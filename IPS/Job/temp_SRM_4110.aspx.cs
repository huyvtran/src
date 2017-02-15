using DevExpress.Spreadsheet;
using Microsoft.Reporting.WebForms;
using System;
using System.Collections;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Services;

public partial class Job_SRM_4110 : System.Web.UI.Page
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

        string strReturn = string.Empty;

        SqlConnection objCon = null;
        SqlCommand objCmd = null;
        SqlDataReader objDr = null;
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
                            SELECT qry_sel AS QUERY_SELECT
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
            string strUser = DATA.getOption("USER");
            string strKey = DATA.getOption("KEY");
            string strTitle = DATA.getOption("TITLE");
            string strRows = DATA.getOption("ROWS");
            string sToday = DateTime.Now.ToString("yyMM");

            string sFileIdSrc = (strTitle == "납품서") ? "DeliveryS" : "ItemLabelA";
            string sFileIdTrg = sFileIdSrc + "_" + strUser + "_" + strKey;
            string sFileNmTrg = sToday + "/" + sFileIdTrg + "." + (strPrint.ToUpper().Equals("PDF") ? "pdf" : "xlsx");
            string strRoot = HttpContext.Current.Server.MapPath("~/");
            string strSource = strRoot + "Report/" + strPage + "/" + sFileIdSrc + ".xlsx";
            if (!System.IO.Directory.Exists(strRoot + "Report/" + strPage + "/" + sToday)) System.IO.Directory.CreateDirectory(strRoot + "Report/" + strPage + "/" + sToday);
            string strTarget = strRoot + "Report/" + strPage + "/" + sToday + "/" + sFileIdTrg;
            object objMissing = Type.Missing;
            object varMissing = System.Reflection.Missing.Value;

            Workbook objWorkBook;
            Worksheet objWorkSheet, objWorkSheet2;
            Range objRange;

            try
            {
                System.IO.File.Copy(strSource, strTarget + ".xlsx", true);
                objWorkBook = new Workbook();
                objWorkBook.LoadDocument(strTarget + ".xlsx", DevExpress.Spreadsheet.DocumentFormat.Xlsx);
                objWorkSheet = objWorkBook.Worksheets[0];

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
                // Sorting 적용
                string strOrder = "\n" + "ORDER BY {0} {1}";
                string strSortCol = string.IsNullOrEmpty(DATA.getOption("SORT_COLUMNS")) ? "dlv_seq" : DATA.getOption("SORT_COLUMNS");
                string strSortOrd = string.IsNullOrEmpty(DATA.getOption("SORT_ORDER")) ? "asc" : DATA.getOption("SORT_ORDER");
                strBody += "\n" + string.Format(strOrder, strSortCol, strSortOrd);

                objCmd.CommandText = strBody;
                objDr = objCmd.ExecuteReader();

                if (strTitle == "납품서")
                {
                    int iStart = 7;
                    int iRow = iStart; // refer to Proto file.
                    int dPurQty = 0, dDlvQty = 0, dUnitPrice = 0, dAmount = 0;
                    bool bHeader = true;

                    while (objDr.Read())
                    {
                        if (bHeader)
                        {
                            // 임시 운영용
                            if (objDr["barcode"].Equals("TGS") && DateTime.Compare(DateTime.Now, new DateTime(2016, 4, 1)) >= 0)
                            {
                                objWorkSheet.Cells["D1"].Value = "(주) 원익홀딩스";
                            }
                            objWorkSheet.Cells["I3"].SetValue((objDr["barcode"].ToString() == "" ? "" : "*" + objDr["barcode"].ToString() + "*"));  // Barcode
                            objWorkSheet.Cells["D2"].SetValue(objDr["supp_nm2"].ToString());                                                        // 공급처
                            objWorkSheet.Cells["D3"].SetValue(objDr["dlv_date"].ToString());                                                        // 납품일
                            objWorkSheet.Cells["D4"].SetValue(objDr["dlv_loc_nm"].ToString());                                                      // 사업부
                            bHeader = false;
                        }

                        objRange = objWorkSheet.Range["B" + iRow.ToString() + ":B" + iRow.ToString()];          // 순번
                        objRange.Alignment.Horizontal = SpreadsheetHorizontalAlignment.Center;
                        objRange.Value = iRow - 6;

                        objRange = objWorkSheet.Range["C" + iRow.ToString() + ":D" + iRow.ToString()];          // 품목코드
                        objRange.Merge();
                        objRange.Alignment.Horizontal = SpreadsheetHorizontalAlignment.Center;
                        objRange.Value = objDr["item_cd"].ToString();

                        objRange = objWorkSheet.Range["E" + iRow.ToString() + ":H" + iRow.ToString()];          // 품명
                        objRange.Merge();
                        objRange.Alignment.Horizontal = SpreadsheetHorizontalAlignment.Left;
                        objRange.Value = objDr["item_nm"].ToString();

                        objRange = objWorkSheet.Range["I" + iRow.ToString() + ":K" + iRow.ToString()];          // 규격
                        objRange.Merge();
                        objRange.Alignment.Horizontal = SpreadsheetHorizontalAlignment.Left;
                        objRange.Value = objDr["item_spec"].ToString();

                        objRange = objWorkSheet.Range["L" + iRow.ToString() + ":M" + iRow.ToString()];          // 발주번호
                        objRange.Merge();
                        objRange.Alignment.Horizontal = SpreadsheetHorizontalAlignment.Center;
                        objRange.Value = objDr["pur_no"].ToString();

                        objRange = objWorkSheet.Range["N" + iRow.ToString() + ":O" + iRow.ToString()];          // Tracking No.(Project No.)
                        objRange.Merge();
                        objRange.Alignment.Horizontal = SpreadsheetHorizontalAlignment.Center;
                        objRange.Value = objDr["proj_no"].ToString();

                        objRange = objWorkSheet.Range["P" + iRow.ToString() + ":P" + iRow.ToString()];          // 단위
                        objRange.Alignment.Horizontal = SpreadsheetHorizontalAlignment.Center;
                        objRange.Value = objDr["pur_unit"].ToString();

                        objRange = objWorkSheet.Range["Q" + iRow.ToString() + ":R" + iRow.ToString()];          // 발주수량, 납품수량
                        objRange.NumberFormat = "#,##0_ ";
                        objWorkSheet.Cells["Q" + iRow.ToString()].Value = Convert.ToInt32(objDr["pur_qty"]);    // 발주수량
                        objWorkSheet.Cells["R" + iRow.ToString()].Value = Convert.ToInt32(objDr["dlv_qty"]);    // 납품수량

                        objRange = objWorkSheet.Range["S" + iRow.ToString() + ":T" + iRow.ToString()];          // 단가
                        objRange.Merge();
                        objRange.Alignment.Horizontal = SpreadsheetHorizontalAlignment.Right;
                        objRange.NumberFormat = "#,##0_ ";
                        objWorkSheet.Cells["S" + iRow.ToString()].Value = Convert.ToInt32(objDr["pur_price"]);

                        objRange = objWorkSheet.Range["U" + iRow.ToString() + ":V" + iRow.ToString()];          // 금액
                        objRange.Merge();
                        objRange.Alignment.Horizontal = SpreadsheetHorizontalAlignment.Right;
                        objRange.NumberFormat = "#,##0_ ";
                        objWorkSheet.Cells["U" + iRow.ToString()].Value = Convert.ToInt32(objDr["dlv_amt"]);

                        objRange = objWorkSheet.Range["W" + iRow.ToString() + ":W" + iRow.ToString()];          // 납기요청일
                        objRange.Alignment.Horizontal = SpreadsheetHorizontalAlignment.Center;
                        objRange.Value = objDr["req_date"].ToString();

                        //objWorkSheet.Row(iRow).Cells[17).Value = objDr["prc_cd"].ToString();        // Pallet No.
                        //objWorkSheet.Row(iRow).Cells[23).Value = objDr["consigned_yn"].ToString();  // 사급

                        dPurQty += Convert.ToInt32(objDr["pur_qty"]);
                        dDlvQty += Convert.ToInt32(objDr["dlv_qty"]);
                        dUnitPrice += Convert.ToInt32(objDr["pur_price"]);
                        dAmount += Convert.ToInt32(objDr["dlv_amt"]);
                        iRow++;
                    }

                    // summary -------------------------------------------------------
                    objWorkSheet.Cells["Q" + iRow.ToString()].Value = dPurQty;      // 발주수량
                    objWorkSheet.Cells["R" + iRow.ToString()].Value = dDlvQty;      // 납품수량
                    objWorkSheet.Cells["S" + iRow.ToString()].Value = dUnitPrice;   // 단가
                    objWorkSheet.Cells["U" + iRow.ToString()].Value = dAmount;      // 금액

                    //int dVat = Convert.ToInt32(Math.Truncate(Convert.ToDecimal(dAmount) - (Convert.ToDecimal(dAmount) / Convert.ToDecimal(1.1))));
                    //dAmount = dAmount - dVat;
                    int dVat = Convert.ToInt32(Convert.ToDecimal(dAmount) * Convert.ToDecimal(0.1));
                    string strSum = string.Format("{2} 건,  총액 : {0},  세액 : {1}    ", string.Format("{0:#,##0}", dAmount), string.Format("{0:#,##0}", dVat), string.Format("{0:#,##0}", iRow - iStart));
                    objWorkSheet.Cells["B" + iRow.ToString()].Value = strSum;

                    objRange = objWorkSheet.Range["B" + iRow.ToString() + ":W" + iRow.ToString()];
                    objRange.Font.FontStyle = SpreadsheetFontStyle.Bold;

                    objRange = objWorkSheet.Range["B" + iRow.ToString() + ":P" + iRow.ToString()];
                    objRange.Merge();
                    objRange.Alignment.Horizontal = SpreadsheetHorizontalAlignment.Right;

                    objRange = objWorkSheet.Range["Q" + iRow.ToString() + ":R" + iRow.ToString()];
                    objRange.NumberFormat = "#,##0_ ";

                    objRange = objWorkSheet.Range["S" + iRow.ToString() + ":T" + iRow.ToString()];
                    objRange.Merge();
                    objRange.Alignment.Horizontal = SpreadsheetHorizontalAlignment.Right;
                    objRange.NumberFormat = "#,##0_ ";

                    objRange = objWorkSheet.Range["U" + iRow.ToString() + ":V" + iRow.ToString()];
                    objRange.Merge();
                    objRange.Alignment.Horizontal = SpreadsheetHorizontalAlignment.Right;
                    objRange.NumberFormat = "#,##0_ ";
                    //----------------------------------------------------------------

                    objRange = objWorkSheet.Range["B" + iStart.ToString() + ":W" + iRow.ToString()];
                    objRange.Borders.SetAllBorders(System.Drawing.Color.Black, BorderLineStyle.Thin);

                    objWorkSheet.SetPrintRange(objWorkSheet.Range["A1:W" + iRow.ToString()]);

                }
                else if (strTitle == "물품라벨")
                {
                    int iRow = 1;
                    int iCell = -1;
                    int iCount = 0;
                    int iCountAll = 0;
                    bool bRead = true;
                    objWorkSheet2 = objWorkBook.Worksheets[1];  //Barcode Template Sheet
                    objWorkSheet.VerticalPageBreaks.Add(18);

                    bRead = objDr.Read();
                    while (true)
                    {
                        if (bRead)
                        {
                            iCountAll++;
                            foreach (string strDlvSeq in strRows.Split(new char[] { ',' }))
                            {
                                if (strDlvSeq.Equals(objDr["dlv_seq"].ToString()))
                                {
                                    iCell += 5;
                                    iCount++;

                                    objWorkSheet2.Cells[1, iCell].SetValue(objDr["item_cd"].ToString());                    //품번
                                    objWorkSheet2.Cells[2, iCell].SetValue(objDr["item_nm"].ToString());                    //품목명
                                    objWorkSheet2.Cells[3, iCell].SetValue(objDr["item_spec"].ToString());                  //규격
                                    objWorkSheet2.Cells[4, iCell].SetValue(objDr["proj_no"].ToString() + (objDr["pallet_no"].ToString() == "" ? "" : " / " + objDr["pallet_no"].ToString()));   //Tracking / Pallet No.
                                    objWorkSheet2.Cells[5, iCell].Value = Convert.ToInt32(objDr["dlv_qty"]);                //수량
                                    objWorkSheet2.Cells[5, iCell + 2].SetValue(objDr["dlv_date"].ToString());               //납품일자
                                    objWorkSheet2.Cells[6, iCell - 1].SetValue("*" + objDr["barcoded"].ToString() + "*");   //바코드
                                    objWorkSheet2.Cells[7, iCell - 1].SetValue(objDr["barcoded"].ToString() + " - " + objDr["supp_nm"].ToString()); //바코드번호 + 업체명
                                }
                            }
                        }
                        else
                        {
                            iCell += 5;
                            iCount++;
                        }
                        bRead = objDr.Read();

                        if (iCount % 3 == 0)
                        {
                            objWorkSheet.Range["A" + iRow.ToString() + ":Q" + iRow.ToString()].CopyFrom(objWorkSheet2.Range["A2:Q8"]);
                            if (!bRead) break;

                            if (iCountAll % 24 == 0)
                            {
                                iRow += 7;
                                objWorkSheet.HorizontalPageBreaks.Add(iRow - 1);
                            }
                            else
                            {
                                iRow += 8;
                            }

                            iCell = -1;
                            iCount = 0;

                            objWorkSheet2.Cells[1, iCell + 5].Value = "";
                            objWorkSheet2.Cells[2, iCell + 5].Value = "";
                            objWorkSheet2.Cells[3, iCell + 5].Value = "";
                            objWorkSheet2.Cells[4, iCell + 5].Value = "";
                            objWorkSheet2.Cells[5, iCell + 5].Value = "";
                            objWorkSheet2.Cells[5, iCell + 7].Value = "";
                            objWorkSheet2.Cells[6, iCell + 4].Value = "";
                            objWorkSheet2.Cells[7, iCell + 4].Value = "";

                            objWorkSheet2.Cells[1, iCell + 10].Value = "";
                            objWorkSheet2.Cells[2, iCell + 10].Value = "";
                            objWorkSheet2.Cells[3, iCell + 10].Value = "";
                            objWorkSheet2.Cells[4, iCell + 10].Value = "";
                            objWorkSheet2.Cells[5, iCell + 10].Value = "";
                            objWorkSheet2.Cells[5, iCell + 12].Value = "";
                            objWorkSheet2.Cells[6, iCell + 9].Value = "";
                            objWorkSheet2.Cells[7, iCell + 9].Value = "";

                            objWorkSheet2.Cells[1, iCell + 15].Value = "";
                            objWorkSheet2.Cells[2, iCell + 15].Value = "";
                            objWorkSheet2.Cells[3, iCell + 15].Value = "";
                            objWorkSheet2.Cells[4, iCell + 15].Value = "";
                            objWorkSheet2.Cells[5, iCell + 15].Value = "";
                            objWorkSheet2.Cells[5, iCell + 17].Value = "";
                            objWorkSheet2.Cells[6, iCell + 14].Value = "";
                            objWorkSheet2.Cells[7, iCell + 14].Value = "";
                        }
                    }
                }
                else
                {
                    DataSet dsBarcode = new DataSet1();
                    dsBarcode.Tables[0].Load(objDr);
                    objDr.Close();

                    ReportViewer rptBarcode = new ReportViewer();
                    rptBarcode.LocalReport.ReportPath = HttpContext.Current.Server.MapPath("Report.rdlc");
                    //ReportViewer1.LocalReport.ReportPath = HttpContext.Current.Server.MapPath("Report.rdlc");

                    ReportDataSource rds = new ReportDataSource();
                    rds.Name = "DataSet1";
                    rds.Value = dsBarcode.Tables[0];
                    rptBarcode.LocalReport.DataSources.Add(rds);
                    rptBarcode.LocalReport.Refresh();

                    string strReportType = "PDF";   // Excel, PDF, Image
                    Warning[] warnings;
                    string[] streamids;
                    string mimeType;
                    string encoding;
                    string extension;

                    byte[] bytes = rptBarcode.LocalReport.Render(strReportType, null, out mimeType, out encoding, out extension, out streamids, out warnings);

                    //var context = HttpContext.Current;

                    //context.Response.Clear();
                    //context.Response.ClearContent();
                    //context.Response.ClearHeaders();
                    //context.Response.ContentType = mimeType;
                    //context.Response.AddHeader("Content-Disposition", "attachment");
                    //context.Response.BinaryWrite(bytes);
                    //context.Response.Flush();
                    //context.Response.End();

                    try
                    {
                        System.IO.FileStream fs = new System.IO.FileStream(strTarget + "." + extension, System.IO.FileMode.Create);
                        //if (System.IO.File.Exists(strTarget + "." + extension)) System.IO.File.Delete(strTarget + "." + extension);
                        fs.Write(bytes, 0, bytes.Length);
                        fs.Close();

                        strReturn = new JavaScriptSerializer().Serialize(
                                        new entityProcessed<string>(codeProcessed.SUCCESS, sFileNmTrg)
                                    );

                        return strReturn;
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
                }
                objDr.Close();
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

            #region save to File.

            try
            {
                //if (System.IO.File.Exists(strTarget)) System.IO.File.Delete(strTarget);
                if (objWorkBook.Worksheets.Count > 1) objWorkBook.Worksheets.RemoveAt(1);
                objWorkBook.SaveDocument(strTarget + ".xlsx", DevExpress.Spreadsheet.DocumentFormat.Xlsx);

                if (strPrint.ToUpper() != "XLS")
                {
                    using (System.IO.FileStream pdf = new System.IO.FileStream(strTarget + ".pdf", System.IO.FileMode.Create))
                    {
                        objWorkBook.ExportToPdf(pdf);
                    }
                }
                objWorkBook.Dispose();

                strReturn = new JavaScriptSerializer().Serialize(
                                new entityProcessed<string>( codeProcessed.SUCCESS, sFileNmTrg)
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
            if (objDr != null) objDr.Close();
            if (objCon != null) objCon.Close();

            #endregion
        }

        return strReturn;
    }

    #endregion
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

