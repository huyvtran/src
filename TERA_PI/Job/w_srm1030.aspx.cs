using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Services;
using System.Web.Script.Services;
using System.Web.Script.Serialization;
using System.Data;
using System.Data.SqlClient;
using System.Web.Configuration;
using System.Text;
using System.Collections;
using System.Collections.Specialized;
using System.Configuration;
using Microsoft.Office.Core;
using Excel = Microsoft.Office.Interop.Excel;
using System.Reflection;

public partial class Job_w_srm1030 : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
    }

    #region Print() : DB의 Data를 통해 출력물 Create.

    /// <summary>
    /// Print() : DB의 Data를 통해 출력물 Create.
    ///     : input
    ///         - DATA : Query and Argument / Option
    ///     : output 
    ///         - success : 출력물 파일 정보
    ///         - else : entityProcessed (string)
    /// </summary>
    [WebMethod]
    public static string Print(cRetrieveData DATA)
    {
        #region check Argument.

        // check Argument.
        //
        if (string.IsNullOrEmpty(DATA.getQuery()))
        {
            return new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                                codeProcessed.ERR_PARAM,
                                "잘못된 호출입니다.")
                    );
        }

        #endregion

        string strReturn  = string.Empty;

        SqlConnection objCon = null;
        SqlCommand objCmd = null;
        SqlDataReader objDr = null;
        Excel.Application objExcel = null;
        try
        {
            #region connect to DB.

            //  connect to DB.
            //
            try
            {
                objCon = new SqlConnection(
                                    ConfigurationManager.ConnectionStrings["PLMDB"].ConnectionString);
                objCon.Open();
            }
            catch (SqlException ex)
            {
                throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                            codeProcessed.ERR_SQL,
                            "Database에 연결할 수 없습니다.\n- " + ex.Message)
                        )
                    );
            }
            catch (Exception ex)
            {
                throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                            codeProcessed.ERR_PROCESS,
                            "Database 연결 중에 오류가 발생하였습니다.\n- " + ex.Message)
                        )
                    );
            }

            #endregion

            #region get Query from DB.

            string strSQL = string.Empty;
            string strBody = string.Empty;
            try
            {
                strSQL = string.Format(@"
                            SELECT
                                qry_sel AS QUERY_SELECT
                            FROM ZQUERY
                            WHERE qry_id = '{0}'",
                            DATA.getQuery());
                objCmd = new SqlCommand(strSQL, objCon);
                objDr = objCmd.ExecuteReader();

                if (objDr.Read())
                {
                    strBody = objDr["QUERY_SELECT"].ToString();
                    objDr.Close();
                }
                else
                {
                    throw new Exception(
                        "관련 Query를 찾을 수 없습니다.");
                }
            }
            catch (SqlException ex)
            {
                throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                            codeProcessed.ERR_SQL,
                            "Query 조회에 실패하였습니다.\n- " + ex.Message)
                        )
                    );
            }
            catch (Exception ex)
            {
                throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                            codeProcessed.ERR_PROCESS,
                            "Query 조회에 실패하였습니다.\n- " + ex.Message)
                        )
                    );
            }

            #endregion

            #region create Query.

            if (DATA.getArgument().getSize() > 0)
            {
                #region get Argument from DB.

                Hashtable tblSelect = new Hashtable();
                try
                {
                    strSQL = string.Format(@"
                                SELECT
                                    arg_id AS ARG_ID,
                                    arg_tp AS ARG_TYPE,
                                    arg_qry AS ARG_QUERY
                                FROM ZQUERY_ARG
                                WHERE qry_id = '{0}'",
                                DATA.getQuery()
                                );
                    objCmd.CommandText = strSQL;
                    objDr = objCmd.ExecuteReader();

                    while (objDr.Read())
                    {
                        tblSelect.Add(
                            objDr["ARG_ID"].ToString(),
                            new cDBArgument(
                                objDr["ARG_TYPE"].ToString(),
                                objDr["ARG_QUERY"].ToString())
                            );
                    }
                    objDr.Close();
                }
                catch (SqlException ex)
                {
                    throw new Exception(
                        new JavaScriptSerializer().Serialize(
                            new entityProcessed<string>(
                                codeProcessed.ERR_SQL,
                                "Query Argument 조회에 실패하였습니다.\n- " + ex.Message)
                            )
                        );
                }
                catch (Exception ex)
                {
                    throw new Exception(
                        new JavaScriptSerializer().Serialize(
                            new entityProcessed<string>(
                                codeProcessed.ERR_PROCESS,
                                "Query Argument 조회에 실패하였습니다.\n- " + ex.Message)
                            )
                        );
                }

                #endregion

                #region bind Argument to Query.

                try
                {
                    for (int iAry = 0; iAry < DATA.getArgument().getSize(); iAry++)
                    {
                        string strArg = DATA.ARGUMENT.NAME[iAry];
                        cDBArgument objArg = (cDBArgument)tblSelect[strArg];
                        if (objArg == null)
                        {
                            throw new Exception(
                                strArg + " - 관련 Argument를 찾을 수 없습니다.");
                        }
                        strBody = objArg.convertWhere(
                                            strBody,
                                            DATA.getQuery(),
                                            strArg,
                                            HttpUtility.UrlDecode(DATA.ARGUMENT.VALUE[iAry])
                                        );
                    }
                }
                catch (Exception ex)
                {
                    throw new Exception(
                        new JavaScriptSerializer().Serialize(
                            new entityProcessed<string>(
                                    codeProcessed.ERR_PROCESS,
                                    "Query 생성에 실패하였습니다.\n- " + ex.Message)
                            )
                        );
                }

                #endregion
            }

            #endregion

            #region prepare Office object.

            string strPrint = DATA.getOption("PRINT");
            string strPage = DATA.getOption("PAGE");
            string strKey = DATA.getOption("KEY");
            string sToday = DateTime.Now.ToString("yyyyMMdd");
            
            string strRoot = HttpContext.Current.Server.MapPath("~/");
            string strSource = strRoot + "Report/" + strPage + "/" + strPage + 
                                ((DATA.getQuery() == "w_srm1030_2") ? "_5" : "_6") + ".xls";
            if (!System.IO.Directory.Exists(strRoot + "Report/" + strPage + "/" + sToday)) System.IO.Directory.CreateDirectory(strRoot + "Report/" + strPage + "/" + sToday);
            //string strTarget = strRoot + "Report/" + strPage + "/" + strPage + "_" + strKey;
            string strTarget = strRoot + "Report/" + strPage + "/" + sToday + "/" + strPage + "_" + strKey;
            string strTempNm = strRoot + "Report/" + strPage + "/" + sToday + "/" + strKey + "_" + Guid.NewGuid().ToString() + ".xls";
            
            object objMissing = Type.Missing;
            object varMissing = System.Reflection.Missing.Value;

            Excel._Workbook objWorkBook;
            Excel._Worksheet objWorkSheet;
            Excel.Range objRange, objRow, objFooter;
            Excel.XlFixedFormatType enTarget = Excel.XlFixedFormatType.xlTypePDF;
            Excel.XlFixedFormatQuality enQuality = Excel.XlFixedFormatQuality.xlQualityStandard;
            Excel.XlFileFormat enSource = Excel.XlFileFormat.xlExcel8;

            try
            {
                System.IO.File.Copy(strSource, strTempNm);

                objExcel = new Excel.Application();
                objExcel.DisplayAlerts = false;
                objExcel.Visible = false;
                objWorkBook = objExcel.Workbooks.Open(
                                strTempNm,
                                true,
                                true,
                                varMissing, varMissing, varMissing, varMissing, varMissing, varMissing, varMissing, varMissing, varMissing, varMissing, varMissing, varMissing);
                objWorkSheet = (Excel.Worksheet)objWorkBook.Sheets[1];

                //납품목록 Template Row
                objRow = ((Excel.Worksheet)objWorkBook.Sheets[2]).get_Range("A2", "AJ2");

                //Footer Template
                objFooter = ((Excel.Worksheet)objWorkBook.Sheets[2]).get_Range("A4", "AJ9");
            }
            catch (Exception ex)
            {
                throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                            codeProcessed.ERR_PROCESS,
                            "Office 설정 중에 오류가 발생하였습니다.\n- " + ex.Message)
                        )
                    );
            }

            #endregion

            #region process Query & set to Print.

            try
            {
                objCmd.CommandText = strBody;
                objDr = objCmd.ExecuteReader();

                if (DATA.getQuery() == "w_srm1030_2")
                {
                    int iRow = 15; // refer to Proto file.
                    decimal fTotalPrice = 0, fTotalVAT = 0, fTotalAmt = 0;
                    string strRemark = string.Empty;
                    bool bHeader = true;

                    while (objDr.Read())
                    {
                        if (bHeader)
                        {
                            objWorkSheet.Cells[8, 6] = objDr["pur_no"].ToString();
                            objWorkSheet.Cells[8, 33] = string.Format("(통화단위 : {0})", objDr["curr_cd"].ToString());
                            objWorkSheet.Cells[10, 6] = objDr["supp_nm"].ToString();
                            objWorkSheet.Cells[10, 15] = objDr["cust_emp"].ToString();
                            objWorkSheet.Cells[11, 6] = objDr["addr"].ToString();
                            objWorkSheet.Cells[12, 6] = objDr["cust_tel"].ToString();
                            objWorkSheet.Cells[12, 15] = objDr["cust_fax"].ToString();

                            objWorkSheet.Cells[10, 28] = objDr["emp_nm"].ToString();
                            objWorkSheet.Cells[11, 28] = objDr["emp_tel"].ToString();
                            objWorkSheet.Cells[12, 28] = objDr["emp_fax"].ToString();
                            objWorkSheet.Cells[13, 28] = objDr["emp_email"].ToString();

                            strRemark = objDr["rmk"].ToString();
                            bHeader = false;
                        }

                        //objWorkSheet.Cells[iRow, 2] = iRow - 14; //순번
                        //objRange = objWorkSheet.get_Range("C" + iRow.ToString(), "E" + iRow.ToString());
                        //objRange.MergeCells = true;
                        //objWorkSheet.Cells[iRow, 3] = objDr["proj_nm"].ToString();
                        //objRange = objWorkSheet.get_Range("F" + iRow.ToString(), "H" + iRow.ToString());
                        //objRange.MergeCells = true;
                        //objWorkSheet.Cells[iRow, 6] = objDr["projkey"].ToString();
                        //objRange = objWorkSheet.get_Range("I" + iRow.ToString(), "K" + iRow.ToString());
                        //objRange.MergeCells = true;
                        //objWorkSheet.Cells[iRow, 9] = objDr["item_cd"].ToString();
                        //objRange = objWorkSheet.get_Range("L" + iRow.ToString(), "P" + iRow.ToString());
                        //objRange.MergeCells = true;
                        //objWorkSheet.Cells[iRow, 12] = objDr["item_nm"].ToString();
                        //objRange = objWorkSheet.get_Range("Q" + iRow.ToString(), "T" + iRow.ToString());
                        //objRange.MergeCells = true;
                        //objWorkSheet.Cells[iRow, 17] = objDr["item_spec"].ToString();
                        //objRange = objWorkSheet.get_Range("U" + iRow.ToString(), "V" + iRow.ToString());
                        //objRange.MergeCells = true;
                        //objWorkSheet.Cells[iRow, 21] = Convert.ToDecimal(objDr["pur_qty"]);
                        //objRange = objWorkSheet.get_Range("W" + iRow.ToString(), "X" + iRow.ToString());
                        //objRange.MergeCells = true;
                        //objWorkSheet.Cells[iRow, 23] = objDr["pur_unit"].ToString();
                        //objRange = objWorkSheet.get_Range("Y" + iRow.ToString(), "AB" + iRow.ToString());
                        //objRange.MergeCells = true;
                        //objWorkSheet.Cells[iRow, 25] = Convert.ToDecimal(objDr["pur_price"]);
                        //objRange = objWorkSheet.get_Range("AC" + iRow.ToString(), "AE" + iRow.ToString());
                        //objRange.MergeCells = true;
                        //objWorkSheet.Cells[iRow, 29] = Convert.ToDecimal(objDr["pur_amt"]);
                        //objRange = objWorkSheet.get_Range("AF" + iRow.ToString(), "AG" + iRow.ToString());
                        //objRange.MergeCells = true;
                        //objWorkSheet.Cells[iRow, 32] = objDr["req_date"].ToString();
                        //objRange = objWorkSheet.get_Range("AH" + iRow.ToString(), "AI" + iRow.ToString());
                        //objRange.MergeCells = true;
                        //objWorkSheet.Cells[iRow, 34] = objDr["dlvwh_nm"].ToString();
                        //objWorkSheet.Cells[iRow, 36] = objDr["chk_yn_nm"].ToString();

                        //objRange = objWorkSheet.get_Range("B" + iRow.ToString(), "AJ" + iRow.ToString());
                        //cExcel.drawLine(objRange, 1);

                        objRow.Cells[1, 2] = iRow - 14; //순번
                        objRow.Cells[1, 3] = objDr["proj_nm"].ToString();
                        objRow.Cells[1, 6] = objDr["projkey"].ToString();
                        objRow.Cells[1, 9] = objDr["item_cd"].ToString();
                        objRow.Cells[1, 12] = objDr["item_nm"].ToString();
                        objRow.Cells[1, 17] = objDr["item_spec"].ToString();
                        objRow.Cells[1, 21] = Convert.ToDecimal(objDr["pur_qty"]);
                        objRow.Cells[1, 23] = objDr["pur_unit"].ToString();
                        objRow.Cells[1, 25] = Convert.ToDecimal(objDr["pur_price"]);
                        objRow.Cells[1, 29] = Convert.ToDecimal(objDr["pur_amt"]);
                        objRow.Cells[1, 32] = objDr["req_date"].ToString();
                        objRow.Cells[1, 34] = objDr["dlvwh_nm"].ToString();
                        objRow.Cells[1, 36] = objDr["chk_yn_nm"].ToString();

                        objRow.Copy(objWorkSheet.get_Range(objWorkSheet.Cells[iRow, "A"], objWorkSheet.Cells[iRow, "AJ"]));

                        fTotalPrice += Convert.ToDecimal(objDr["pur_amt"]);
                        fTotalVAT += Convert.ToDecimal(objDr["pur_vat"]);
                        fTotalAmt += Convert.ToDecimal(objDr["pur_amt"]) + Convert.ToDecimal(objDr["pur_vat"]);
                        iRow++;
                    }
                    objDr.Close();

                    objRange = objWorkSheet.get_Range("B" + "14", "AJ" + (iRow - 1).ToString());
                    cExcel.drawBorder(objRange, Excel.XlBorderWeight.xlMedium);

                    objWorkSheet.Cells[13, 6] = fTotalPrice;
                    objWorkSheet.Cells[13, 12] = fTotalVAT;
                    objWorkSheet.Cells[13, 18] = fTotalAmt;

                    //int iSkip = 31 - iRow;
                    //iRow += ((iSkip < 0) ? 1 : iSkip);
                    //objRange = objWorkSheet.get_Range("B" + iRow.ToString(), "AJ" + (iRow + 5).ToString());
                    //objRange.MergeCells = false;
                    //objRange.Font.Size = 10;

                    //objRange = objWorkSheet.get_Range("B" + iRow.ToString(), "D" + (iRow + 2).ToString());
                    //objRange.MergeCells = true;
                    //objRange.HorizontalAlignment = Excel.XlHAlign.xlHAlignCenter;
                    //objRange.Interior.Color = 16764622;
                    //cExcel.drawLine(objRange, 1);
                    //objWorkSheet.Cells[iRow, 2] = "REMARK";
                    //objRange = objWorkSheet.get_Range("E" + iRow.ToString(), "AJ" + (iRow + 2).ToString());
                    //objRange.MergeCells = true;
                    //objRange.HorizontalAlignment = Excel.XlHAlign.xlHAlignLeft;
                    //cExcel.drawLine(objRange, 1);
                    //objWorkSheet.Cells[iRow, 5] = " 1. 지불조건    당사 지불 조건에 준함."
                    //                            + "\n" + " 2. 기타        1) 매월 마감일은 25일 까지 입니다(물품 납입, 거래명세표, 세금계산서 도착 기준)"
                    //                            + "\n" + "                2) 거래명세표, 세금계산서에 발주번호 기재 必 요망";
                    //objRange = objWorkSheet.get_Range("B" + iRow.ToString(), "AJ" + (iRow + 2).ToString());
                    //cExcel.drawBorder(objRange, Excel.XlBorderWeight.xlMedium);

                    //iRow += 3;
                    //objRange = objWorkSheet.get_Range("B" + iRow.ToString(), "D" + (iRow + 2).ToString());
                    ////objRange.RowHeight = 9;
                    //objRange.MergeCells = true;
                    //objRange.HorizontalAlignment = Excel.XlHAlign.xlHAlignCenter;
                    //objRange.Interior.Color = 16764622;
                    //cExcel.drawLine(objRange, 1);
                    //objWorkSheet.Cells[iRow, 2] = "비    고";
                    //objRange = objWorkSheet.get_Range("E" + iRow.ToString(), "AJ" + (iRow + 2).ToString());
                    //objRange.MergeCells = true;
                    //objRange.WrapText = true;
                    //objRange.HorizontalAlignment = Excel.XlHAlign.xlHAlignLeft;
                    //cExcel.drawLine(objRange, 1);
                    //objWorkSheet.Cells[iRow, 5] = strRemark.Replace("\a", "\n");
                    //objRange = objWorkSheet.get_Range("B" + iRow.ToString(), "AJ" + (iRow + 2).ToString());
                    //cExcel.drawBorder(objRange, Excel.XlBorderWeight.xlMedium);

                    iRow++;
                    objFooter.Cells[4, 5] = strRemark.Replace("\a", "\n"); //비고
                    objFooter.Copy(objWorkSheet.get_Range(objWorkSheet.Cells[iRow, "A"], objWorkSheet.Cells[iRow, "AJ"]));
                }
                else
                {
                    int iRow = 11; // refer to Proto file.
                    decimal fTotalAmt = 0;
                    string strRemark = string.Empty;
                    string strCurrCD = string.Empty;
                    bool bHeader = true;

                    while (objDr.Read())
                    {
                        if (bHeader)
                        {
                            objWorkSheet.Cells[3, 3] = objDr["pur_no"].ToString();
                            objWorkSheet.Cells[3, 16] = objDr["pur_date"].ToString();
                            objWorkSheet.Cells[5, 3] = objDr["supp_nm"].ToString(); //Vender Name
                            objWorkSheet.Cells[5, 15] = objDr["emp_nm"].ToString(); //Our Reference
                            objWorkSheet.Cells[6, 3] = "";  //Phone No.
                            objWorkSheet.Cells[6, 15] = objDr["pay_meth"].ToString(); ; //Payment
                            //objWorkSheet.Cells[7, 3] = "";  //FAX No.
                            //objWorkSheet.Cells[7, 15] = ""; //Price Term
                            //objWorkSheet.Cells[8, 3] = "";  //Contact Name
                            //objWorkSheet.Cells[8, 15] = ""; //Destination

                            strRemark = objDr["rmk"].ToString();
                            strCurrCD = objDr["curr_cd"].ToString();
                            bHeader = false;
                        }

                        //objWorkSheet.Cells[iRow, 2] = iRow - 10; //순번
                        objRange = objWorkSheet.get_Range("A" + iRow.ToString(), "B" + iRow.ToString());
                        objRange.RowHeight = 30;
                        objRange.MergeCells = true;
                        objRange.HorizontalAlignment = Excel.XlHAlign.xlHAlignLeft;
                        objWorkSheet.Cells[iRow, 1] = objDr["proj_nm"].ToString();
                        objRange = objWorkSheet.get_Range("C" + iRow.ToString(), "E" + iRow.ToString());
                        objRange.MergeCells = true;
                        objRange.HorizontalAlignment = Excel.XlHAlign.xlHAlignLeft;
                        objWorkSheet.Cells[iRow, 3] = objDr["item_nm"].ToString();
                        objRange = objWorkSheet.get_Range("F" + iRow.ToString(), "F" + iRow.ToString());
                        objRange.HorizontalAlignment = Excel.XlHAlign.xlHAlignRight;
                        objWorkSheet.Cells[iRow, 6] = Convert.ToDecimal(objDr["pur_qty"]);
                        objRange = objWorkSheet.get_Range("G" + iRow.ToString(), "J" + iRow.ToString());
                        objRange.MergeCells = true;
                        objRange.HorizontalAlignment = Excel.XlHAlign.xlHAlignRight;
                        objRange.NumberFormat = "#,##0.00";
                        objWorkSheet.Cells[iRow, 7] = Convert.ToDecimal(objDr["pur_price"]);
                        objRange = objWorkSheet.get_Range("K" + iRow.ToString(), "M" + iRow.ToString());
                        objRange.MergeCells = true;
                        objRange.HorizontalAlignment = Excel.XlHAlign.xlHAlignCenter;
                        objWorkSheet.Cells[iRow, 11] = objDr["curr_cd"].ToString();
                        objRange = objWorkSheet.get_Range("N" + iRow.ToString(), "J" + iRow.ToString());
                        objRange.HorizontalAlignment = Excel.XlHAlign.xlHAlignRight;
                        objRange.NumberFormat = "#,##0.00";
                        objWorkSheet.Cells[iRow, 14] = Convert.ToDecimal(objDr["pur_amt"]);
                        objRange = objWorkSheet.get_Range("O" + iRow.ToString(), "Q" + iRow.ToString());
                        objRange.MergeCells = true;
                        objRange.HorizontalAlignment = Excel.XlHAlign.xlHAlignCenter;
                        objWorkSheet.Cells[iRow, 15] = objDr["req_date"].ToString();
                        objRange = objWorkSheet.get_Range("R" + iRow.ToString(), "S" + iRow.ToString());
                        objRange.MergeCells = true;
                        objRange.HorizontalAlignment = Excel.XlHAlign.xlHAlignLeft;
                        objWorkSheet.Cells[iRow, 18] = objDr["rmk"].ToString();

                        objRange = objWorkSheet.get_Range("A" + iRow.ToString(), "S" + iRow.ToString());
                        objRange.VerticalAlignment = Excel.XlVAlign.xlVAlignCenter;
                        objRange.Font.Size = 9;
                        cExcel.drawLine(objRange, 1);
                        fTotalAmt += Convert.ToDecimal(objDr["pur_amt"]);
                        iRow++;
                    }
                    objDr.Close();

                    iRow++;
                    objRange = objWorkSheet.get_Range("B" + iRow.ToString(), "D" + iRow.ToString());
                    objRange.RowHeight = 30;
                    objRange.MergeCells = true;
                    objRange.HorizontalAlignment = Excel.XlHAlign.xlHAlignLeft;
                    objWorkSheet.Cells[iRow, 2] = "TOTAL AMOUNT";
                    objRange = objWorkSheet.get_Range("E" + iRow.ToString(), "I" + iRow.ToString());
                    objRange.MergeCells = true;
                    objRange.HorizontalAlignment = Excel.XlHAlign.xlHAlignLeft;
                    objWorkSheet.Cells[iRow, 5] = strCurrCD;
                    objRange = objWorkSheet.get_Range("J" + iRow.ToString(), "P" + iRow.ToString());
                    objRange.MergeCells = true;
                    objRange.HorizontalAlignment = Excel.XlHAlign.xlHAlignLeft;
                    objRange.NumberFormat = "#,##0.00";
                    objWorkSheet.Cells[iRow, 10] = fTotalAmt;
                    objRange = objWorkSheet.get_Range("A" + iRow.ToString(), "S" + iRow.ToString());
                    objRange.VerticalAlignment = Excel.XlVAlign.xlVAlignTop;
                    objRange.Font.Size = 12;

                    iRow++;
                    objRange = objWorkSheet.get_Range("A" + iRow.ToString(), "S" + iRow.ToString());
                    objRange.RowHeight = 6;

                    iRow++;
                    objRange = objWorkSheet.get_Range("B" + iRow.ToString(), "R" + iRow.ToString());
                    objRange.RowHeight = 30;
                    objRange.MergeCells = true;
                    objRange.HorizontalAlignment = Excel.XlHAlign.xlHAlignLeft;
                    objRange.Font.Size = 10;
                    objRange.Font.Bold = true;
                    objWorkSheet.Cells[iRow, 2] = "Please give us your order confirmation and lead time by return";

                    objRange = objWorkSheet.get_Range("A" + iRow.ToString(), "S" + iRow.ToString());
                    objRange.VerticalAlignment = Excel.XlVAlign.xlVAlignTop;
                }
            }
            catch (SqlException ex)
            {
                throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                            codeProcessed.ERR_SQL,
                            "Data 조회에 실패하였습니다.\n- " + ex.Message)
                        )
                    );
            }
            catch (Exception ex)
            {
                throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                            codeProcessed.ERR_PROCESS,
                            "Data 조회 중에 오류가 발생하였습니다.\n- " + ex.Message)
                        )
                    );
            }

            #endregion

            #region update Status.

            string strSave = DATA.getOption("SAVE");
            if (strSave == "1")
            {
                try
                {
                    string strQuery = @"
                        UPDATE SM_PUR 
                        SET    cust_dt = CASE WHEN ISNULL(cust_dt, '') = '' THEN GETDATE() ELSE cust_dt END,
                               checked_dt = CASE WHEN ISNULL(checked_dt, '') < GETDATE() THEN GETDATE() ELSE checked_dt END,
                               print_dt = CASE WHEN ISNULL(print_dt, '') = '' THEN GETDATE() ELSE print_dt END,
                               printed_dt = CASE WHEN ISNULL(printed_dt, '') < GETDATE() THEN GETDATE() ELSE printed_dt END
                        WHERE  pur_no = '" + DATA.getArgument("argPur_no") + "'";
                    cDBQuery objQuery = new cDBQuery(ruleQuery.INLINE, strQuery);
                    objQuery.executeQuery(objCmd, true);
                }
                catch (SqlException ex)
                {
                    throw new Exception(
                        new JavaScriptSerializer().Serialize(
                            new entityProcessed<string>(
                                codeProcessed.ERR_SQL,
                                "출력 정보 저장에 실패하였습니다.\n- " + ex.Message)
                        )
                    );
                }
                catch (Exception ex)
                {
                    throw new Exception(
                        new JavaScriptSerializer().Serialize(
                            new entityProcessed<string>(
                                codeProcessed.ERR_PROCESS,
                                "출력 정보 저장 중에 오류가 발생하였습니다.\n- " + ex.Message)
                        )
                    );
                }
            }

            #endregion

            #region save to File.

            try
            {
                if (System.IO.File.Exists(strTarget))
                    System.IO.File.Delete(strTarget);
                objWorkSheet.SaveAs(
                                strTarget,
                                enSource,
                                varMissing, varMissing, varMissing, varMissing, varMissing, varMissing, varMissing, varMissing);
                if (System.IO.File.Exists(strTempNm))
                    System.IO.File.Delete(strTempNm);

                if (System.IO.File.Exists(strTarget + "." + strPrint))
                    System.IO.File.Delete(strTarget + "." + strPrint);
                objWorkSheet.ExportAsFixedFormat(
                                enTarget,
                                strTarget,
                                enQuality,
                                true,
                                true,
                                1,
                                100,
                                false,
                                varMissing);

                //strReturn = new JavaScriptSerializer().Serialize(
                //                new entityProcessed<string>(
                //                    codeProcessed.SUCCESS,
                //                    strPage + "_" + strKey + "." + strPrint)
                //            );
                strReturn = new JavaScriptSerializer().Serialize(
                                new entityProcessed<string>(
                                    codeProcessed.SUCCESS,
                                    sToday + "/" + strPage + "_" + strKey + "." + strPrint)
                            );
            }
            catch (Exception ex)
            {
                throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                            codeProcessed.ERR_PROCESS,
                            "Print 생성 중에 오류가 발생하였습니다.\n- " + ex.Message)
                        )
                    );
            }

            #endregion
        }
        catch (Exception ex)
        {
            #region abnormal Closing.

            // abnormal Closing.
            //
            strReturn = ex.Message;

            #endregion
        }
        finally
        {
            #region release.

            // release.
            //
            if (objDr != null)
                objDr.Close();
            if (objCon != null)
                objCon.Close();
            if (objExcel != null)
            {
                objExcel.Workbooks.Close();
                objExcel.Quit();
                if (objExcel != null)
                {
                    System.Diagnostics.Process[] pProcess;
                    pProcess = System.Diagnostics.Process.GetProcessesByName("Excel");
                    pProcess[0].Kill();
                }
            }

            #endregion
        }

        return strReturn;
    }

    #endregion
}
