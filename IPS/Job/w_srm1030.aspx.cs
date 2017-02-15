using DevExpress.Spreadsheet;
using System;
using System.Collections;
using System.Configuration;
using System.Data.SqlClient;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Services;

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
            string strToday = DateTime.Now.ToString("yyMM");

            string strRoot = System.IO.Path.Combine(HttpContext.Current.Server.MapPath("~/Report"), strPage);
            string strSource = System.IO.Path.Combine(strRoot, strPage + ((DATA.getQuery() == "w_srm1030_2") ? "_5" : "_6") + ".xls");
            string strTarget = System.IO.Path.Combine(strRoot, strToday);
            if (!System.IO.Directory.Exists(strTarget))
                System.IO.Directory.CreateDirectory(strTarget);
            strTarget = System.IO.Path.Combine(strTarget, strPage + "_" + strKey + ".xls");

            Workbook objWorkBook;
            Worksheet objWorkSheet;
            Range objRange;

            try
            {
                System.IO.File.Copy(strSource, strTarget, true);
                objWorkBook = new Workbook();
                objWorkBook.Unit = DevExpress.Office.DocumentUnit.Point;
                objWorkBook.LoadDocument(strTarget, DevExpress.Spreadsheet.DocumentFormat.Xls);
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
                objCmd.CommandText = strBody;
                objDr = objCmd.ExecuteReader();

                if (DATA.getQuery() == "w_srm1030_2")
                {
                    int iStart = 14;    // refer to Proto file.
                    int iRow = iStart; 
                    decimal fTotal = 0;
                    string strRemark = string.Empty;
                    bool bHeader = true;

                    while (objDr.Read())
                    {
                        if (bHeader)
                        {
                            // TGS 분리, 임시 운영용
                            if (objDr["dlv_loc"].Equals("TGS") && DateTime.Compare(DateTime.Now, new DateTime(2016, 4, 1)) >= 0)
                            {
                                strSource = System.IO.Path.Combine(strRoot, strPage + "_5_2.xls");
                                System.IO.File.Copy(strSource, strTarget, true);
                                objWorkBook.LoadDocument(strTarget, DevExpress.Spreadsheet.DocumentFormat.Xls);
                                objWorkSheet = objWorkBook.Worksheets[0];
                            }

                            objWorkSheet.Cells["D5"].Value = objDr["pur_no"].ToString();
                            objWorkSheet.Cells["D6"].Value = objDr["pur_date"].ToString();
                            objWorkSheet.Cells["D7"].Value = objDr["supply_nm"].ToString();
                            objWorkSheet.Cells["D8"].Value = objDr["pay_meth"].ToString();
                            objWorkSheet.Cells["D9"].Value = objDr["dlv_place"].ToString();
                            objWorkSheet.Cells["D10"].Value = objDr["dlv_loc"].ToString();
                            string[] aryEmployee = objDr["emp_no"].ToString().Split('/');
                            objWorkSheet.Cells["K6"].Value = aryEmployee[0];
                            if (aryEmployee.Length > 1)
                            {
                                string[] aryContact = aryEmployee[1].Split(',');
                                objWorkSheet.Cells["K7"].Value = aryContact[0];
                                if (aryContact.Length > 1)
                                    objWorkSheet.Cells["K8"].Value = aryContact[1];
                            }
                            objWorkSheet.Cells["N6"].Value = objDr["cust_emp"].ToString();
                            objWorkSheet.Cells["N7"].Value = objDr["cust_tel"].ToString();
                            objWorkSheet.Cells["N8"].Value = objDr["cust_fax"].ToString();
                            if (objDr["vat_yn"].ToString() == "1")
                                objWorkSheet.Cells["N12"].Value = "(V.A.T별도)";
                            else
                                objWorkSheet.Cells["N12"].Value = "(V.A.T포함)";
                            strRemark = objDr["rmk"].ToString();
                            bHeader = false;
                        }

                        objWorkSheet.Cells["B" + iRow.ToString()].Value = iRow - 13; //순번
                        objRange = objWorkSheet.Range["C" + iRow.ToString() + ":D" + iRow.ToString()];
                        objRange.Merge();
                        objWorkSheet.Range["C" + iRow.ToString() + ":D" + iRow.ToString()].NumberFormat = "@";
                        objWorkSheet.Cells["C" + iRow.ToString()].Value = objDr["item_cd"].ToString();
                        objWorkSheet.Range["E" + iRow.ToString() + ":E" + iRow.ToString()].NumberFormat = "@";
                        objWorkSheet.Cells["E" + iRow.ToString()].Value = objDr["item_nm"].ToString();
                        objWorkSheet.Range["F" + iRow.ToString() + ":F" + iRow.ToString()].NumberFormat = "@";
                        objWorkSheet.Cells["F" + iRow.ToString()].Value = objDr["item_spec"].ToString();
                        objWorkSheet.Range["G" + iRow.ToString() + ":G" + iRow.ToString()].NumberFormat = "@";
                        objWorkSheet.Cells["G" + iRow.ToString()].Value = objDr["projkey"].ToString();
                        objWorkSheet.Range["H" + iRow.ToString() + ":H" + iRow.ToString()].NumberFormat = "@";
                        objWorkSheet.Cells["H" + iRow.ToString()].Value = objDr["prc_cd"].ToString();
                        objWorkSheet.Cells["I" + iRow.ToString()].Value = objDr["pur_unit"].ToString();
                        objWorkSheet.Cells["J" + iRow.ToString()].Value = Convert.ToInt32(objDr["pur_qty"]);
                        objWorkSheet.Cells["K" + iRow.ToString()].Value = Convert.ToInt32(objDr["pur_price"]);
                        objWorkSheet.Cells["L" + iRow.ToString()].Value = objDr["curr_cd"].ToString();
                        objWorkSheet.Cells["M" + iRow.ToString()].Value = Convert.ToInt32(objDr["pur_amt"]);
                        objWorkSheet.Cells["N" + iRow.ToString()].Value = objDr["req_date"].ToString();
                        fTotal += Convert.ToDecimal(objDr["pur_amt"]);
                        iRow++;
                    }
                    objDr.Close();

                    objWorkSheet.Cells["M12"].Value = Convert.ToInt32(fTotal);

                    objRange = objWorkSheet.Range["B" + iStart.ToString() + ":N" + (iRow - 1).ToString()];
                    objRange.Borders.SetAllBorders(System.Drawing.Color.Black, BorderLineStyle.Thin);

                    int iSkip = 32 - iRow;
                    iRow += ((iSkip < 0) ? 1 : iSkip);
                    objRange = objWorkSheet.Range["B" + iRow.ToString() + ":J" + (iRow + 4).ToString()];
                    objRange.Merge();
                    objRange.Alignment.Horizontal = SpreadsheetHorizontalAlignment.Left;
                    objRange.Font.Size = 9;
                    objWorkSheet.Cells["B" + iRow.ToString()].Alignment.WrapText = true;
                    objWorkSheet.Cells["B" + iRow.ToString()].Value =
                        " - 원익아이피에스 SRM시스템(http://srm.ips.co.kr)에서 납품예정일 등록 시 본 발주서 출력 가능하며, 납품예정일 변경 시 수시로 수정 바랍니다."
                        + "\n" + " - 요청 납기보다 납품이 늦어질 경우 즉시 구매담당자에게 연락 바랍니다."
                        + "\n" + " - 세금계산서의 발행은 당사의 검사기준에 의거 합격품에 한하며, 납품 시 본 주문서 및 주문서와 동일한 품목, 수량, 단가 등으로 작성된 납품서(거래명세서)를 제시하여야 합니다."
                        + "\n" + " - 물품의 검수, 검사는 당사의 검수, 검사규정에 의하여 실시하며, 당사가 사용도중 발생되는 품질문제의 원인이 납품자재 자체에 있을 경우에는 귀사의 책임으로 변상해야 합니다."
                        + "\n" + " - 귀사의 납기지연이나 정상적인 물품의 입고가 불가능할 경우 당사는 귀사와 협의하여 발주를 취소할 수 있습니다."
                        + "\n" + " - 상기 언급되지 않은 사항은 귀사와 당사간에 체결한 기본거래계약에 따릅니다.";
                    objRange.Borders.SetAllBorders(System.Drawing.Color.Black, BorderLineStyle.Thin);
                    objWorkSheet.Cells["K" + iRow.ToString()].Value = "  ※ 특기사항";
                    objRange = objWorkSheet.Range["K" + iRow.ToString() + ":N" + iRow.ToString()];
                    objRange.Merge();
                    objRange.Alignment.Horizontal = SpreadsheetHorizontalAlignment.Left;
                    objRange.Borders.SetAllBorders(System.Drawing.Color.Black, BorderLineStyle.Thin);
                    objRange = objWorkSheet.Range["K" + (iRow + 1).ToString() + ":N" + (iRow + 4).ToString()];
                    objRange.Merge();
                    objRange.Alignment.Horizontal = SpreadsheetHorizontalAlignment.Center;
                    objRange.Font.Size = 9;
                    objWorkSheet.Cells["K" + (iRow + 1).ToString()].Value = strRemark.Replace("\a", "\n");
                    objRange.Alignment.WrapText = true;
                    objRange.Borders.SetAllBorders(System.Drawing.Color.Black, BorderLineStyle.Thin);

                    iRow += 5;
                    objRange = objWorkSheet.Range["B" + iRow.ToString() + ":N" + iRow.ToString()];
                    objRange.RowHeight = 9.75;
                    objRange = objWorkSheet.Range["A1:O" + iRow.ToString()];
                    objRange.Borders.SetOutsideBorders(System.Drawing.Color.Black, BorderLineStyle.Medium);
                }
                else
                {
                    int iStart = 18;    // refer to Proto file.
                    int iRow = iStart;
                    decimal fTotal = 0;
                    string strRemark = string.Empty;
                    bool bHeader = true;

                    while (objDr.Read())
                    {
                        if (bHeader)
                        {
                            // TGS 분리, 임시 운영용
                            if (objDr["dlv_loc"].Equals("TGS") && DateTime.Compare(DateTime.Now, new DateTime(2016, 4, 1)) >= 0)
                            {
                                strSource = System.IO.Path.Combine(strRoot, strPage + "_6_2.xls");
                                System.IO.File.Copy(strSource, strTarget, true);
                                objWorkBook.LoadDocument(strTarget, DevExpress.Spreadsheet.DocumentFormat.Xls);
                                objWorkSheet = objWorkBook.Worksheets[0];
                            }

                            objWorkSheet.Cells["D8"].Value = ": " + objDr["pur_no"].ToString();
                            objWorkSheet.Cells["D9"].Value = ": " + objDr["pur_date"].ToString();
                            objWorkSheet.Cells["D10"].Value = ": " + objDr["supply_nm"].ToString();
                            objWorkSheet.Cells["D11"].Value = ": " + objDr["pay_meth"].ToString();
                            objWorkSheet.Cells["D12"].Value = ": ";
                            objWorkSheet.Cells["D13"].Value = ": ";
                            objWorkSheet.Cells["D14"].Value = ": ";
                            objWorkSheet.Cells["D15"].Value = ": " + objDr["dlv_loc"].ToString();
                            string[] aryEmployee = objDr["emp_no"].ToString().Split('/');
                            if (aryEmployee.Length > 1)
                            {
                                string[] aryContact = aryEmployee[1].Split(',');
                                objWorkSheet.Cells["N10"].Value = aryContact[0];
                                if (aryContact.Length > 1)
                                    objWorkSheet.Cells["N11"].Value = aryContact[1];
                                if (aryEmployee.Length > 2)
                                    objWorkSheet.Cells["N9"].Value = aryEmployee[2];
                            }
                            objWorkSheet.Cells["L16"].Value = objDr["curr_nm"].ToString();
                            strRemark = objDr["rmk"].ToString();
                            bHeader = false;
                        }

                        objWorkSheet.Cells["B" + iRow.ToString()].Value = iRow - 17; //순번
                        objWorkSheet.Cells["C" + iRow.ToString()].Value = objDr["item_cd"].ToString();
                        objWorkSheet.Cells["E" + iRow.ToString()].Value = objDr["item_nm"].ToString();
                        objWorkSheet.Cells["F" + iRow.ToString()].Value = objDr["item_spec"].ToString();
                        objWorkSheet.Cells["G" + iRow.ToString()].Value = objDr["projkey"].ToString();
                        objWorkSheet.Cells["I" + iRow.ToString()].Value = objDr["pur_unit"].ToString();
                        objWorkSheet.Cells["J" + iRow.ToString()].Value = Convert.ToInt32(objDr["pur_qty"]);
                        objWorkSheet.Cells["K" + iRow.ToString()].Value = Convert.ToInt32(objDr["pur_price"]);
                        objWorkSheet.Cells["L" + iRow.ToString()].Value = objDr["curr_cd"].ToString();
                        objWorkSheet.Cells["M" + iRow.ToString()].Value = Convert.ToInt32(objDr["pur_amt"]);
                        objWorkSheet.Cells["O" + iRow.ToString()].Value = objDr["req_date"].ToString();
                        objRange = objWorkSheet.Range["C" + iRow.ToString() + ":D" + iRow.ToString()];
                        objRange.Merge();
                        objRange.Alignment.Horizontal = SpreadsheetHorizontalAlignment.Center;
                        objRange = objWorkSheet.Range["M" + iRow.ToString() + ":N" + iRow.ToString()];
                        objRange.Merge();
                        objRange.Alignment.Horizontal = SpreadsheetHorizontalAlignment.Right;
                        fTotal += Convert.ToDecimal(objDr["pur_amt"]);
                        iRow++;
                    }
                    objDr.Close();

                    objWorkSheet.Cells["M16"].Value = Convert.ToInt32(fTotal);

                    objRange = objWorkSheet.Range["B" + iStart.ToString() + ":O" + (iRow - 1).ToString()];
                    objRange.Borders.SetAllBorders(System.Drawing.Color.Black, BorderLineStyle.Thin);

                    int iSkip = 30 - iRow;
                    iRow += ((iSkip < 0) ? 1 : iSkip);
                    /*
                    objRange = objWorkSheet.Range["B" + iRow.ToString(), "O" + (iRow + 5).ToString());
                    objRange.MergeCells = true;
                    objRange.HorizontalAlignment = Excel.XlHAlign.xlHAlignLeft;
                    objWorkSheet.Cells[iRow, 2] = " * Please signify your acceptance of this purchase order by inputting expected delivery date within seven days in WONIK IPS SRM system. (http://srm.ips.co.kr)"
                                                    + "\n" + " * Supplier must give a notice to Purchaser if requested delivery date is delayed."
                                                    + "\n" + " * Supplier herein shall indemnify Purchaser against any and all claims(including patent infringement) arising out of or in related to the purchase of the above items according to this"
                                                    + "\n" + "   Purchase Order. Such indemnification shall include indemnification against any and all claims whether such claims are direct, indirect, or incidental to the purchase of the above items"
                                                    + "\n" + "   according to Purchase Order. Further, such indemnification shall also include, but not limited to, reimbursement of all costs and expenses(including attorney's fee) for defending "
                                                    + "\n" + "   such claims resulted from the Purchase of the above items.";
                    cExcel.drawBorder(objRange, Excel.XlBorderWeight.xlThin);
                    */
                    objRange = objWorkSheet.Range["B" + iRow.ToString() + ":J" + (iRow + 7).ToString()];
                    objRange.Merge();
                    objRange.Alignment.Horizontal = SpreadsheetHorizontalAlignment.Left;
                    objWorkSheet.Cells["B" + iRow.ToString()].Alignment.WrapText = true;
                    objWorkSheet.Cells["B" + iRow.ToString()].Value
                        = " * Please signify your acceptance of this purchase order by inputting expected delivery date within seven days in WONIK IPS SRM "
                        + "\n" + "   system. (http://srm.ips.co.kr)"
                        + "\n" + " * Supplier must give a notice to Purchaser if requested delivery date is delayed."
                        + "\n" + " * Supplier herein shall indemnify Purchaser against any and all claims(including patent infringement) arising out of or in related to "
                        + "\n" + "   the purchase of the above items according to this Purchase Order. Such indemnification shall include indemnification against any "
                        + "\n" + "   and all claims whether such claims are direct, indirect, or incidental to the purchase of the above items according to Purchase Order."
                        + "\n" + "   Further, such indemnification shall also include, but not limited to, reimbursement of all costs and expenses(including attorney's fee) "
                        + "\n" + "   for defending such claims resulted from the Purchase of the above items.";
                    objRange.Borders.SetOutsideBorders(System.Drawing.Color.Black, BorderLineStyle.Thin);
                    objRange = objWorkSheet.Range["K" + iRow.ToString() + ":O" + (iRow + 7).ToString()];
                    objRange.Merge();
                    objRange.Alignment.Horizontal = SpreadsheetHorizontalAlignment.Center;
                    objRange.Alignment.WrapText = true;
                    objWorkSheet.Cells["K" + iRow.ToString()].Value = strRemark.Replace("\a", "\n");
                    objRange.Borders.SetOutsideBorders(System.Drawing.Color.Black, BorderLineStyle.Thin);

                    iRow += 8;
                    objRange = objWorkSheet.Range["B" + iRow.ToString() + ":O" + iRow.ToString()];
                    objRange.RowHeight = 9.75;
                    objRange = objWorkSheet.Range["A1:P" + iRow.ToString()];
                    objRange.Borders.SetOutsideBorders(System.Drawing.Color.Black, BorderLineStyle.Medium);
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
                objWorkBook.SaveDocument(strTarget, DevExpress.Spreadsheet.DocumentFormat.Xls);

                if (strPrint.ToUpper() != "XLS")
                {
                    using (System.IO.FileStream pdf = new System.IO.FileStream(System.IO.Path.ChangeExtension(strTarget, ".pdf"), System.IO.FileMode.Create))
                    {
                        objWorkBook.ExportToPdf(pdf);
                    }
                }
                objWorkBook.Dispose();

                strReturn = new JavaScriptSerializer().Serialize(
                                new entityProcessed<string>(
                                    codeProcessed.SUCCESS,
                                    strToday + "/" + strPage + "_" + strKey + "." + strPrint)
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

            #endregion
        }

        return strReturn;
    }

    #endregion
}
