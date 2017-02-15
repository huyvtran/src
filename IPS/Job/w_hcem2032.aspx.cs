using DevExpress.Spreadsheet;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Services;

public partial class Job_w_hcem2032 : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
    }

    #region Update() : Update Process

    /// <summary>
    /// Update() : Update Process
    ///     : Insert/Update/Delete Process to DB.
    ///     input : 
    ///         - DATA - Client Data (cSaveData)
    ///     output:
    ///         - success : Key List (cSavedData)
    ///         - else : entityProcessed (string)
    /// </summary>
    [WebMethod]
    public static string Update(cSaveData DATA)
    {
        #region check Argument.

        // check Argument.
        //
        if (DATA.getSize() <= 0)
        {
            return new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                                codeProcessed.ERR_PARAM,
                                "잘못된 호출입니다.")
                    );
        }

        #endregion

        string strReturn = string.Empty;
        List<cSavedData> lstSaved = new List<cSavedData>();
        cUpdate objUpdate = new cUpdate();
        try
        {
            #region initialize to Save.

            // initialize to Update.
            //
            objUpdate.initialize(false);

            #endregion

            #region Customize.

            //---------------------------------------------------------------------------
            string strModel = string.Empty;
            for (int iAry = 0; iAry < DATA.getSize(); iAry++)
            {
                string strID = string.Empty;
                string strKey = string.Empty;
                switch (DATA.getObject(iAry).getQuery())
                {
                    case "w_hcem2030_S_1":
                        {
                            strKey = "model_seq";
                        }
                        break;
                    default:
                        continue;
                }
                int iKey = 0;
                for (int iRow = 0; iRow < DATA.getObject(iAry).getSize(); iRow++)
                {
                    if (DATA.getObject(iAry).getRow(iRow).getType() == typeQuery.INSERT)
                    {
                        if (iKey == 0)
                        {
                            try
                            {
                                objUpdate.objDr = (new cDBQuery(
                                                        ruleQuery.INLINE,
                                                        "SELECT CAST(ISNULL(MAX(model_seq), 0) + 1 AS varchar) FROM EM_EST_INDEX" +
                                                        " WHERE est_key = '" + DATA.getFirst().getFirst().getValue("est_key") + "'" +
                                                        " AND revision = '" + DATA.getFirst().getFirst().getValue("revision") + "'"
                                                    )).retrieveQuery(objUpdate.objCon);
                                if (objUpdate.objDr.Read())
                                {
                                    iKey = Convert.ToInt32(objUpdate.objDr[0]);
                                }
                                objUpdate.objDr.Close();
                            }
                            catch (SqlException ex)
                            {
                                throw new Exception(
                                        new JavaScriptSerializer().Serialize(
                                            new entityProcessed<string>(
                                                    codeProcessed.ERR_SQL,
                                                    "Key를 생성할 수 없습니다.\n- " + ex.Message)
                                        )
                                    );
                            }
                            catch (Exception ex)
                            {
                                throw new Exception(
                                        new JavaScriptSerializer().Serialize(
                                            new entityProcessed<string>(
                                                    codeProcessed.ERR_PROCESS,
                                                    "Key 생성 중에 오류가 발생하였습니다.\n- " + ex.Message)
                                        )
                                    );
                            }
                        }
                        strModel = Convert.ToString(iKey++);
                        DATA.setValue(iAry, iRow, strKey, strModel);
                    }
                }
            }
            //---------------------------------------------------------------------------
            for (int iAry = 0; iAry < DATA.getSize(); iAry++)
            {
                string strID = string.Empty;
                string strKey = string.Empty;
                switch (DATA.getObject(iAry).getQuery())
                {
                    case "w_hcem2030_D_1":
                        {
                            strKey = "item_seq";
                        }
                        break;
                    default:
                        continue;
                }
                int iKey = 0;
                for (int iRow = 0; iRow < DATA.getObject(iAry).getSize(); iRow++)
                {
                    if (DATA.getObject(iAry).getRow(iRow).getType() == typeQuery.INSERT)
                    {
                        if (iKey == 0)
                        {
                            try
                            {
                                objUpdate.objDr = (new cDBQuery(
                                                        ruleQuery.INLINE,
                                                        "SELECT CAST(ISNULL(MAX(item_seq), 0) + 1 AS varchar) FROM EM_EST_DETAIL" +
                                                        " WHERE est_key = '" + DATA.getValue(iAry, iRow, "est_key") + "'" +
                                                        " AND revision = '" + DATA.getValue(iAry, iRow, "revision") + "'" +
                                                        " AND model_seq = '" + DATA.getValue(iAry, iRow, "model_seq") + "'"
                                                    )).retrieveQuery(objUpdate.objCon);
                                if (objUpdate.objDr.Read())
                                {
                                    iKey = Convert.ToInt32(objUpdate.objDr[0]);
                                }
                                objUpdate.objDr.Close();
                            }
                            catch (SqlException ex)
                            {
                                throw new Exception(
                                        new JavaScriptSerializer().Serialize(
                                            new entityProcessed<string>(
                                                    codeProcessed.ERR_SQL,
                                                    "Key를 생성할 수 없습니다.\n- " + ex.Message)
                                        )
                                    );
                            }
                            catch (Exception ex)
                            {
                                throw new Exception(
                                        new JavaScriptSerializer().Serialize(
                                            new entityProcessed<string>(
                                                    codeProcessed.ERR_PROCESS,
                                                    "Key 생성 중에 오류가 발생하였습니다.\n- " + ex.Message)
                                        )
                                    );
                            }
                        }
                        if (!string.IsNullOrEmpty(strModel))
                            DATA.setValue(iAry, iRow, "model_seq", strModel);
                        DATA.setValue(iAry, iRow, strKey, Convert.ToString(iKey++));
                    }
                }
            }
            //---------------------------------------------------------------------------

            #endregion

            #region process Saving.

            // process Saving.
            //
            objUpdate.beginTran();
            for (int iAry = 0; iAry < DATA.getSize(); iAry++)
            {
                lstSaved.Add(
                    objUpdate.process(DATA.getObject(iAry), DATA.getUser())
                );
            }

            #endregion

            #region Customize.

            //---------------------------------------------------------------------------
            // Customize - Run Procedure.
            //
            try
            {
                string strSQL = "PROC_EST_RESUM";
                objUpdate.objCmd.CommandText = strSQL;
                objUpdate.objCmd.CommandType = CommandType.StoredProcedure;
                objUpdate.objCmd.Parameters.AddWithValue(
                    "@user", DATA.getUser());
                objUpdate.objCmd.Parameters.AddWithValue(
                    "@process", 1);
                objUpdate.objCmd.Parameters.AddWithValue(
                    "@est_key", DATA.getFirst().getFirst().getValue("est_key"));
                objUpdate.objCmd.Parameters.AddWithValue(
                    "@revision", DATA.getFirst().getFirst().getValue("revision"));
                objUpdate.objCmd.Parameters.AddWithValue(
                    "@model_seq", 0);
                objUpdate.objCmd.ExecuteNonQuery();
            }
            catch (SqlException ex)
            {
                throw new Exception(
                    "금액 재계산에 실패하였습니다.\n- (" + ex.Number + ") : " + ex.Message
                );
            }
            catch (Exception ex)
            {
                throw new Exception(
                    "금액 재계산 중에 오류가 발생하였습니다.\n- " + ex.Message
                );
            }
            //---------------------------------------------------------------------------

            #endregion

            #region normal Closing.

            // normal Closing.
            //
            objUpdate.close(doTransaction.COMMIT);
            strReturn = new JavaScriptSerializer().Serialize(
                                new entityProcessed<List<cSavedData>>(
                                    codeProcessed.SUCCESS,
                                    lstSaved)
                            );

            #endregion
        }
        catch (Exception ex)
        {
            #region abnormal Closing.

            // abnormal Closing.
            //
            objUpdate.close(doTransaction.ROLLBACK);
            strReturn = new JavaScriptSerializer().Serialize(
                            new entityProcessed<string>(
                                    codeProcessed.ERR_PROCESS,
                                    ex.Message)
                            );

            #endregion
        }
        finally
        {
            #region release.

            // release.
            //
            objUpdate.release();

            #endregion
        }

        return strReturn;
    }

    #endregion

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
    public static string Print(cExcelData DATA)
    {
        #region check Argument.

        // check Argument.
        //
        if (string.IsNullOrEmpty(DATA.getUser()))
        {
            return new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                                codeProcessed.ERR_PARAM,
                                "잘못된 호출입니다.")
                    );
        }

        #endregion

        string arg_est_key = DATA.getArgument("arg_est_key");
        string arg_revision = DATA.getArgument("arg_revision");
        string strReturn = string.Empty;

        SqlConnection objCon = null;
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

            #region prepare Office object.

            string strType = DATA.getOption("PRINT").ToUpper().Equals("XLS") ? "xlsx" : DATA.getOption("PRINT");
            string strPage = DATA.getOption("PAGE");
            string strToday = DateTime.Now.ToString("yyMM");
            string strModel = (Convert.ToInt32(DATA.getOption("MODEL")) + 1).ToString();
            string strRule = (Convert.ToInt32(DATA.getOption("RULE")) * -1).ToString();

            string strRoot = System.IO.Path.Combine(HttpContext.Current.Server.MapPath("~/Report"), strPage);
            string strSource = System.IO.Path.Combine(strRoot, strPage + "_" + strModel + ".xls");
            string strTarget = System.IO.Path.Combine(strRoot, strToday);
            if (!System.IO.Directory.Exists(strTarget))
                System.IO.Directory.CreateDirectory(strTarget);
            strTarget = System.IO.Path.Combine(strTarget, strPage + "_" + arg_est_key + "_" + arg_revision);
            string strPrint = strPage + "_" + arg_est_key + "_" + arg_revision + "." + strType;

            Workbook objWorkBook;
            Worksheet objWorkSheet, copyWorkSheet;
            Range objRange, copyRange;

            try
            {
                objWorkBook = new Workbook();
                objWorkBook.Unit = DevExpress.Office.DocumentUnit.Point;
                if (!objWorkBook.LoadDocument(strSource, DevExpress.Spreadsheet.DocumentFormat.Xls))
                    throw new Exception( "템플릿 파일 로드 중 오류가 발생하였습니다.");
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

            #region [내수 견적서] 생성

            // 내수 견적서 -------
            //
            if (strModel == "1")
            {
                #region process Query & set to Print. [갑지]

                string strName = string.Empty;
                objWorkSheet = objWorkBook.Worksheets[0];
                try
                {
                    #region [갑지] - 상단 출력

                    string strQuery = string.Format(@"
                        SELECT 
                              dbo.fn_GETNAME('견적명',' ',A.est_key) AS est_nm
                            , dbo.fn_GETNAME('견적고객명',' ',A.est_key) AS cust_nm
                            , SUBSTRING(A.est_dt, 1, 4) + '년 ' + SUBSTRING(A.est_dt, 5, 2) + '월 ' + SUBSTRING(A.est_dt, 7, 2) + '일' AS est_dt
                            --, ROUND(A.est_amt, {2}, 1) AS est_amt
                            --, ROUND(A.nego_amt, {2}, 1) AS nego_amt
                            , (SELECT SUM(ROUND(est_amt, {2}, 1)) FROM EM_EST_INDEX WHERE est_key = {0} AND revision = {1}) AS est_amt
                            , (SELECT SUM(ROUND(nego_amt, {2}, 1)) FROM EM_EST_INDEX WHERE est_key = {0} AND revision = {1}) AS nego_amt
                            , ROUND(A.final_amt, {2}, 1) AS final_amt
                            , A.sheet_summary
                            , A.rmk
                        FROM dbo.EM_EST_ENV A
                        INNER JOIN dbo.EM_EST_REGISTER B ON B.est_key = A.est_key AND B.revision = A.revision
                        WHERE A.est_key = '{0}' AND A.revision = '{1}'
                        ",
                        arg_est_key, arg_revision, strRule
                    );
                    objDr = (new cDBQuery(
                                ruleQuery.INLINE,
                                strQuery
                            )).retrieveQuery(objCon);
                    string strNego = string.Empty;
                    string strTotal = string.Empty;
                    if (objDr.Read())
                    {
                        objWorkSheet.Cells["B3"].Value = "견적명 : " + objDr["est_nm"].ToString();
                        objWorkSheet.Cells["B4"].Value = objDr["est_dt"].ToString();
                        objWorkSheet.Cells["B5"].Value = objDr["cust_nm"].ToString() + " 귀하";
                        objWorkSheet.Cells["B6"].Value = Convert.ToInt32(objDr["est_amt"]);
                        objWorkSheet.Cells["B7"].Value = Convert.ToInt32(objDr["est_amt"]);

                        strName = "견적명 : " + objDr["est_nm"].ToString();
                        if (Convert.ToDecimal(objDr["est_amt"]) != Convert.ToDecimal(objDr["nego_amt"]))
                            strNego = "￦ " + string.Format("{0:N0}", objDr["nego_amt"]);
                        if (Convert.ToDecimal(objDr["nego_amt"]) != Convert.ToDecimal(objDr["final_amt"]))
                            strTotal = "￦ " + string.Format("{0:N0}", objDr["final_amt"]);
                    }
                    else
                        throw new Exception
                            ("[갑지] 해당 데이터를 찾을 수 없습니다.");
                    string strSummary = objDr["sheet_summary"].ToString();
                    objDr.Close();

                    #endregion

                    #region [갑지] - 집계 출력

                    string strQuery_1 = @"(
                                SELECT model_tnm + ' 류' 
                                FROM EM_MODEL_CLASS 
                                WHERE model_class_cd1 = A.model_class1";
                    string strQuery_2 = string.Empty;
                    switch (strSummary)
                    {
                        case "10":
                            strQuery_1 += @"
                                        AND model_class_cd2 = '00'
                                        AND model_class_cd3 = '00')";
                            strQuery_2 = "A.model_class1";
                            break;
                        case "20":
                            strQuery_1 += @"
                                        AND model_class_cd2 = A.model_class2
                                        AND model_class_cd3 = '00')";
                            strQuery_2 = "A.model_class2";
                            break;
                        case "30":
                            strQuery_1 += @"
                                        AND model_class_cd2 = A.model_class2
                                        AND model_class_cd3 = A.model_class3)";
                            strQuery_2 = "A.model_class3";
                            break;
                        case "40":
                            strQuery_1 = "A.index_div1";
                            strQuery_2 = "A.index_div1";
                            break;
                        case "50":
                            strQuery_1 = "A.index_div2";
                            strQuery_2 = "A.index_div2";
                            break;
                        case "60":
                            strQuery_1 = "A.index_div3";
                            strQuery_2 = "A.index_div3";
                            break;
                    }
                    strQuery = string.Format(@"
                        SELECT 
                              {0} AS model_nm
                            , ( SELECT TOP 1 mat_spec + ' 외'
                                FROM EM_EST_DETAIL
                                WHERE est_key = MAX(A.est_key) AND revision = MAX(A.revision) AND model_seq = MAX(A.model_seq)
                                AND ISNULL(mat_spec, '') <> ''
                                ) AS model_spec
                            , SUM(A.model_qty) AS model_qty
                            , SUM(ROUND(A.est_cost, {4}, 1)) + SUM(ROUND(A.manage_cost, {4}, 1)) + SUM(ROUND(A.profit_amt, {4}, 1)) AS model_cost
                            , SUM(ROUND(A.est_amt, {4}, 1)) AS model_amt
                            , SUM(ROUND(A.nego_amt, {4}, 1)) AS nego_amt
                            , MAX(A.est_key)
                            , MAX(A.revision)
                        FROM dbo.EM_EST_INDEX A 
                        WHERE A.est_key = '{1}' AND A.revision = '{2}'
                        GROUP BY {3}
                        ORDER BY MIN(A.sort_seq)
                        ",
                        strQuery_1, arg_est_key, arg_revision, strQuery_2, strRule
                    );
                    objDr = (new cDBQuery(
                                ruleQuery.INLINE,
                                strQuery
                            )).retrieveQuery(objCon);
                    int iStart = 10, iRow = iStart;
                    string strTitle = string.Empty, strAmount = string.Empty;
                    int iNego = 0;
                    while (objDr.Read())
                    {
                        if (iRow == iStart)
                            copyRange = objWorkSheet.Range["AA10:AJ10"];
                        else
                            copyRange = objWorkSheet.Range["AA11:AJ11"];
                        objRange = objWorkSheet.Range["B" + iRow.ToString() + ":K" + iRow.ToString()];
                        objRange.CopyFrom(copyRange);
                        objRange.RowHeight = 20;

                        objWorkSheet.Cells["B" + iRow.ToString()].Value = objDr["model_nm"].ToString();
                        objWorkSheet.Cells["E" + iRow.ToString()].Value = objDr["model_spec"].ToString();
                        objWorkSheet.Cells["G" + iRow.ToString()].Value = Convert.ToInt32(objDr["model_qty"]);
                        objWorkSheet.Cells["H" + iRow.ToString()].Value = Convert.ToInt32(objDr["model_cost"]);
                        objWorkSheet.Cells["J" + iRow.ToString()].Value = Convert.ToInt32(objDr["model_amt"]);

                        if (!string.IsNullOrEmpty(strNego))
                        {
                            iNego++;
                            strTitle += objDr["model_nm"].ToString() + "\n";
                            strAmount += "￦ " + string.Format("{0:N0}", Convert.ToDecimal(objDr["nego_amt"])) + "\n";
                        }
                        iRow++;
                    }
                    objDr.Close();

                    #endregion

                    #region [갑지] - 하단 출력

                    copyRange = objWorkSheet.Range["AA12:AJ12"];
                    objRange = objWorkSheet.Range["B" + iRow.ToString() + ":K" + iRow.ToString()];
                    objRange.CopyFrom(copyRange);
                    objRange.RowHeight = 22;
                    copyRange = objWorkSheet.Range["AA13:AJ18"];
                    objRange = objWorkSheet.Range["B" + (iRow + 1).ToString() + ":K" + (iRow + 6).ToString()];
                    objRange.CopyFrom(copyRange);
                    objRange.RowHeight = 35;

                    strQuery = string.Format(@"
                        SELECT
                              --ROUND(A.est_amt, {2}, 1) AS est_amt 
                              (SELECT SUM(ROUND(est_amt, {2}, 1)) FROM EM_EST_INDEX WHERE est_key = {0} AND revision = {1}) AS est_amt                              
                            , A.delivery
                            , A.pay_cond
                            , A.est_expired
                            , A.vat_div
                            , dbo.fn_GETNAME('사원명',' ', B.submit_empno) AS submit_empnm
                            , A.rmk
                        FROM dbo.EM_EST_ENV A
                        INNER JOIN dbo.EM_EST_REGISTER B ON B.est_key = A.est_key AND B.revision = A.revision
                        WHERE A.est_key = '{0}' AND A.revision = '{1}'
                        ",
                        arg_est_key, arg_revision, strRule
                    );
                    objDr = (new cDBQuery(
                                ruleQuery.INLINE,
                                strQuery
                            )).retrieveQuery(objCon);
                    string strRemark = string.Empty;
                    if (objDr.Read())
                    {
                        objWorkSheet.Cells["J" + iRow.ToString()].Value = Convert.ToInt32(objDr["est_amt"]);
                        iRow++;
                        objWorkSheet.Cells["E" + iRow.ToString()].Value = objDr["delivery"].ToString();
                        objWorkSheet.Cells["H" + iRow.ToString()].Value = (objDr["vat_div"].ToString() == "1") ? "** 부가세 별도 **" : "** 부가세 포함 **";
                        iRow++;
                        objWorkSheet.Cells["E" + iRow.ToString()].Value = objDr["pay_cond"].ToString();
                        objWorkSheet.Cells["H" + iRow.ToString()].Value = "* 담당자 : " + objDr["submit_empnm"].ToString();
                        iRow++;
                        objWorkSheet.Cells["E" + iRow.ToString()].Value = objDr["est_expired"].ToString();
                        iRow++;
                        objWorkSheet.Cells["B" + (iRow + 1).ToString()].Value = objDr["rmk"].ToString().Replace("\r\n", "\n");

                        strRemark = objDr["rmk"].ToString().Replace("\r\n", "\n");
                    }
                    else
                        throw new Exception
                            ("[갑지] 해당 데이터를 찾을 수 없습니다.");
                    objDr.Close();

                    #endregion

                    #region [갑지] - Remove Template.

                    copyRange = objWorkSheet.Range["AA10:AJ17"];
                    copyRange.Delete(DeleteMode.ShiftCellsLeft);
                    //copyRange.Delete(Excel.XlDeleteShiftDirection.xlShiftToLeft);

                    #endregion

                    #region [갑지] - 비고 출력

                    if (!string.IsNullOrEmpty(strNego))
                    {
                        objWorkSheet.Cells["B" + iRow.ToString()].Alignment.WrapText = true;
                        objWorkSheet.Cells["B" + iRow.ToString()].Value =
                            "* NEGO가\n" +
                            ((!string.IsNullOrEmpty(strTitle)) ? strTitle : "") +
                            ((!string.IsNullOrEmpty(strNego)) ? "합계" + "\n" : "") +
                            ((!string.IsNullOrEmpty(strTotal)) ? "* 최종NEGO가" : "");
                        objWorkSheet.Cells["D" + iRow.ToString()].Alignment.WrapText = true;
                        objWorkSheet.Cells["D" + iRow.ToString()].Value =
                            "\n" +
                            ((!string.IsNullOrEmpty(strAmount)) ? strAmount : "") +
                            ((!string.IsNullOrEmpty(strNego)) ? strNego + "\n" : "") +
                            ((!string.IsNullOrEmpty(strTotal)) ? strTotal : "");
                        iNego += ((!string.IsNullOrEmpty(strTotal)) ? 3 : 2);
                    }
                    objRange = objWorkSheet.Range["B" + iRow.ToString() + ":K" + iRow.ToString()];
                    objRange.RowHeight = iNego * 18;
                    iRow++;
                    string[] aryRemark = strRemark.Split('\n');
                    objRange = objWorkSheet.Range["B" + iRow.ToString() + ":K" + iRow.ToString()];
                    objRange.RowHeight = aryRemark.Length * 18;

                    #endregion
                }
                catch (SqlException ex)
                {
                    throw new Exception(
                        new JavaScriptSerializer().Serialize(
                            new entityProcessed<string>(
                                codeProcessed.ERR_SQL,
                                "[갑지] 데이터 조회에 실패하였습니다.\n- " + ex.Message)
                            )
                        );
                }
                catch (Exception ex)
                {
                    throw new Exception(
                        new JavaScriptSerializer().Serialize(
                            new entityProcessed<string>(
                                codeProcessed.ERR_PROCESS,
                                "[갑지] 생성 중에 오류가 발생하였습니다.\n- " + ex.Message)
                            )
                        );
                }

                #endregion

                #region process Query & set to Print. [을지]

                objWorkSheet = objWorkBook.Worksheets[1];   //(Excel.Worksheet)objWorkBook.Sheets[2];
                try
                {
                    #region [을지] - 집계 조회

                    int iMax = 2;
                    List<int[]> aryWidth = new List<int[]>();
                    aryWidth.Add(new int[] { 30, 5, 15, 15, 15, 15, 10, 20 });
                    aryWidth.Add(new int[] { 20, 25, 5, 12, 13, 12, 13, 8, 18 });

                    string strDiv = string.Empty;
                    string strTitle = string.Empty;
                    string strQuery_1 = string.Empty;
                    string strQuery_2 = string.Empty;
                    List<string> arySummary = new List<string>();
                    List<string> aryQuery_1 = new List<string>();
                    List<string> aryQuery_2 = new List<string>();
                    string strQuery = string.Format(@"
                        SELECT 
                              ISNULL(A.index_group, '') AS div
                            , CASE WHEN ISNULL(A.index_group, '') = '' THEN '' ELSE A.index_group_nm END AS title
                            , CASE WHEN ISNULL(A.index_summary1, '') = '' THEN '' ELSE CASE WHEN ISNULL(A.index_summary1_nm, '') = '' THEN '제품분류' ELSE A.index_summary1_nm END END AS summary1
                            , CASE WHEN ISNULL(A.index_summary2, '') = '' THEN '' ELSE CASE WHEN ISNULL(A.index_summary2_nm, '') = '' THEN '제품분류' ELSE A.index_summary2_nm END END AS summary2
                            , CASE A.index_group
                                WHEN '10' THEN
                                    '(SELECT model_tnm
                                        FROM EM_MODEL_CLASS 
                                        WHERE model_class_cd1 = A.model_class1
                                        AND model_class_cd2 = ''00''
                                        AND model_class_cd3 = ''00'')'
                                WHEN '20' THEN
                                    '(SELECT model_tnm
                                        FROM EM_MODEL_CLASS 
                                        WHERE model_class_cd1 = A.model_class1
                                        AND model_class_cd2 = A.model_class2
                                        AND model_class_cd3 = ''00'')'
                                WHEN '30' THEN
                                    '(SELECT model_tnm
                                        FROM EM_MODEL_CLASS 
                                        WHERE model_class_cd1 = A.model_class1
                                        AND model_class_cd2 = A.model_class2
                                        AND model_class_cd3 = A.model_class3)'
                                WHEN '40' THEN
                                    'index_div1'
                                WHEN '50' THEN
                                    'index_div2'
                                WHEN '60' THEN
                                    'index_div3'
                                ELSE '' END + ' AS div' AS div_get
                            , CASE A.index_summary1 
                                WHEN '10' THEN
                                    '(SELECT model_tnm
                                        FROM EM_MODEL_CLASS 
                                        WHERE model_class_cd1 = A.model_class1
                                        AND model_class_cd2 = ''00''
                                        AND model_class_cd3 = ''00'')'
                                WHEN '20' THEN
                                    '(SELECT model_tnm
                                        FROM EM_MODEL_CLASS 
                                        WHERE model_class_cd1 = A.model_class1
                                        AND model_class_cd2 = A.model_class2
                                        AND model_class_cd3 = ''00'')'
                                WHEN '30' THEN
                                    '(SELECT model_tnm
                                        FROM EM_MODEL_CLASS 
                                        WHERE model_class_cd1 = A.model_class1
                                        AND model_class_cd2 = A.model_class2
                                        AND model_class_cd3 = A.model_class3)'
                                WHEN '40' THEN
                                    'index_div1'
                                WHEN '50' THEN
                                    'index_div2'
                                WHEN '60' THEN
                                    'index_div3'
                                ELSE '' END + ' AS summary1' AS summary1_get
                            , CASE A.index_summary2 
                                WHEN '10' THEN
                                    '(SELECT model_tnm
                                        FROM EM_MODEL_CLASS 
                                        WHERE model_class_cd1 = A.model_class1
                                        AND model_class_cd2 = ''00''
                                        AND model_class_cd3 = ''00'')'
                                WHEN '20' THEN
                                    '(SELECT model_tnm
                                        FROM EM_MODEL_CLASS 
                                        WHERE model_class_cd1 = A.model_class1
                                        AND model_class_cd2 = A.model_class2
                                        AND model_class_cd3 = ''00'')'
                                WHEN '30' THEN
                                    '(SELECT model_tnm
                                        FROM EM_MODEL_CLASS 
                                        WHERE model_class_cd1 = A.model_class1
                                        AND model_class_cd2 = A.model_class2
                                        AND model_class_cd3 = A.model_class3)'
                                WHEN '40' THEN
                                    'index_div1'
                                WHEN '50' THEN
                                    'index_div2'
                                WHEN '60' THEN
                                    'index_div3'
                                ELSE '' END + ' AS summary2' AS summary2_get
                            , CASE A.index_group
                                WHEN '10' THEN 'model_class1' 
                                WHEN '20' THEN 'model_class1,model_class2' 
                                WHEN '30' THEN 'model_class1,model_class2, model_class3' 
                                WHEN '40' THEN 'index_div1' 
                                WHEN '50' THEN 'index_div2' 
                                WHEN '60' THEN 'index_div3'
                                ELSE '' END AS div_by
                            , CASE A.index_summary1 
                                WHEN '10' THEN 'model_class1' 
                                WHEN '20' THEN 'model_class1,model_class2' 
                                WHEN '30' THEN 'model_class1,model_class2, model_class3' 
                                WHEN '40' THEN 'index_div1' 
                                WHEN '50' THEN 'index_div2' 
                                WHEN '60' THEN 'index_div3'
                                ELSE '' END AS summary1_by
                            , CASE A.index_summary2 
                                WHEN '10' THEN 'model_class1' 
                                WHEN '20' THEN 'model_class1,model_class2' 
                                WHEN '30' THEN 'model_class1,model_class2, model_class3' 
                                WHEN '40' THEN 'index_div1' 
                                WHEN '50' THEN 'index_div2' 
                                WHEN '60' THEN 'index_div3'
                                ELSE '' END AS summary2_by
                        FROM dbo.EM_EST_ENV A
                        WHERE A.est_key = '{0}' AND A.revision = '{1}'
                        ",
                        arg_est_key, arg_revision
                    );
                    objDr = (new cDBQuery(
                                ruleQuery.INLINE,
                                strQuery
                            )).retrieveQuery(objCon);
                    while (objDr.Read())
                    {
                        if (!string.IsNullOrEmpty(objDr["div"].ToString()))
                        {
                            strDiv = objDr["div"].ToString();
                            strTitle = objDr["title"].ToString();
                            strQuery_1 = objDr["div_get"].ToString();
                            strQuery_2 = objDr["div_by"].ToString();
                        }
                        for (int iAry = 1; iAry <= iMax; iAry++)
                        {
                            if (string.IsNullOrEmpty(objDr["summary" + iAry].ToString()))
                                break;
                            arySummary.Add(objDr["summary" + iAry].ToString());
                            aryQuery_1.Add(objDr["summary" + iAry + "_get"].ToString());
                            aryQuery_2.Add(objDr["summary" + iAry + "_by"].ToString());
                        }
                    }
                    objDr.Close();

                    #endregion

                    #region [을지] - 그룹 조회

                    List<string> aryDiv = new List<string>();
                    List<string> aryWhere = new List<string>();
                    if (!string.IsNullOrEmpty(strDiv))
                    {
                        strQuery = string.Format(@"
                            SELECT 
                                  {3}
                                , {0}
                            FROM dbo.EM_EST_INDEX A
                            WHERE A.est_key = '{1}' AND A.revision = '{2}'
                            GROUP BY {3}
                            ",
                            strQuery_1, arg_est_key, arg_revision, strQuery_2
                        );
                        objDr = (new cDBQuery(
                                ruleQuery.INLINE,
                                strQuery
                            )).retrieveQuery(objCon);
                        while (objDr.Read())
                        {
                            aryDiv.Add(objDr["div"].ToString());
                            switch (strDiv)
                            {
                                case "10":
                                    {
                                        aryWhere.Add(
                                            " AND model_class1 = '" + objDr["model_class1"].ToString() + "'"
                                        );
                                    }
                                    break;
                                case "20":
                                    {
                                        aryWhere.Add(
                                            " AND model_class1 = '" + objDr["model_class1"].ToString() + "'" +
                                            " AND model_calss2 = '" + objDr["model_class2"].ToString() + "'"
                                        );
                                    }
                                    break;
                                case "30":
                                    {
                                        aryWhere.Add(
                                            " AND model_class1 = '" + objDr["model_class1"].ToString() + "'" +
                                            " AND model_calss2 = '" + objDr["model_class2"].ToString() + "'" +
                                            " AND model_calss3 = '" + objDr["model_class3"].ToString() + "'"
                                        );
                                    }
                                    break;
                                case "40":
                                    {
                                        aryWhere.Add(
                                            " AND index_div1 = '" + objDr["index_div1"].ToString() + "'"
                                        );
                                    }
                                    break;
                                case "50":
                                    {
                                        aryWhere.Add(
                                            " AND index_div2 = '" + objDr["index_div2"].ToString() + "'"
                                        );
                                    }
                                    break;
                                case "60":
                                    {
                                        aryWhere.Add(
                                            " AND index_div3 = '" + objDr["index_div3"].ToString() + "'"
                                        );
                                    }
                                    break;
                            }
                        }
                        objDr.Close();
                    }

                    #endregion

                    #region [을지] - 집계 출력

                    int iCount = arySummary.Count;
                    int iStart = 3, iRow = iStart, iCopy = iStart;
                    char cCol = 'A';

                    objRange = objWorkSheet.Range["A2:A2"];
                    objRange.RowHeight = 15;

                    objWorkSheet.Cells["A2"].Value = "[ " + strName + " ]"; iRow++;

                    for (int iQry = 0; iQry < ((aryDiv.Count > 0) ? aryDiv.Count : 1); iQry++, iRow++)
                    {
                        if (aryDiv.Count > 0)
                        {
                            objRange = objWorkSheet.Range["A" + iRow.ToString() + ":A" + iRow.ToString()];
                            objRange.RowHeight = 15;

                            objWorkSheet.Cells["A" + iRow++.ToString()].Value = "** " + ((string.IsNullOrEmpty(strTitle)) ? "" : strTitle + " : ") + aryDiv[iQry];
                        }

                        iCopy = iStart;
                        copyRange = objWorkSheet.Range["AA" + (iCopy + ((iCount - 1) * 6)) + ":AK" + (iCopy + ((iCount - 1) * 6))];
                        objRange = objWorkSheet.Range["A" + iRow.ToString() + ":K" + iRow.ToString()];
                        objRange.CopyFrom(copyRange);
                        objRange.RowHeight = 15;

                        cCol = 'A';
                        for (int iAry = 0; iAry < aryWidth[iCount - 1].Length; iAry++, cCol++)
                        {
                            objRange = objWorkSheet.Range[(cCol).ToString() + iRow.ToString() + ":" + (cCol).ToString() + iRow.ToString()];
                            objRange.ColumnWidthInCharacters = aryWidth[iCount - 1][iAry];
                            if (iAry < iCount)
                                objWorkSheet.Cells[iRow - 1, iAry].Value = arySummary[iAry];
                        }
                        int iCol = iCount;// + 1;
                        objWorkSheet.Cells[iRow - 1, iCol++].Value = "Q'TY";
                        objWorkSheet.Cells[iRow - 1, iCol++].Value = "UNIT PRICE";
                        objWorkSheet.Cells[iRow - 1, iCol++].Value = "TOTAL AMOUNT";
                        objWorkSheet.Cells[iRow - 1, iCol++].Value = "NEGO PRICE";
                        objWorkSheet.Cells[iRow - 1, iCol++].Value = "NEGO TOTAL";
                        objWorkSheet.Cells[iRow - 1, iCol++].Value = "NEGO %";
                        objWorkSheet.Cells[iRow - 1, iCol++].Value = "자재금액";
                        objWorkSheet.Cells[iRow - 1, iCol++].Value = "자재비율 %";
                        objWorkSheet.Cells[iRow - 1, iCol++].Value = "비고";

                        iRow++;

                        strQuery_1 = string.Empty;
                        strQuery_2 = string.Empty;
                        for (int iAry = 0; iAry < aryQuery_1.Count; iAry++)
                        {
                            strQuery_1 += ((iAry == 0) ? "" : ", ") + aryQuery_1[iAry];
                            strQuery_2 += ((iAry == 0) ? "GROUP BY " : ", ") + aryQuery_2[iAry];
                        }
			/*
                        if (!string.IsNullOrEmpty(strQuery_2))
                            strQuery_2 += " ORDER BY MAX(A.model_seq);
			*/
                        strQuery = string.Format(@"
                            SELECT 
                                  {0}
                                , SUM(A.model_qty) AS model_qty
                                , SUM(ROUND(A.est_cost, {5}, 1)) + SUM(ROUND(A.manage_cost, {5}, 1)) + SUM(ROUND(A.profit_amt, {5}, 1)) AS est_cost
                                , SUM(ROUND(A.est_amt, {5}, 1)) AS est_amt
                                , SUM(ROUND(A.nego_cost, {5}, 1)) AS nego_cost
                                , SUM(ROUND(A.nego_amt, {5}, 1)) AS nego_amt
                                , CASE SUM(A.est_amt) WHEN 0 THEN 0 ELSE ROUND((SUM(ROUND(A.est_amt, {5}, 1)) - SUM(ROUND(A.nego_amt, {5}, 1))) / SUM(ROUND(A.est_amt, {5}, 1)), 4, 1) END AS nego_rate
                                , SUM(ROUND(A.mat_cost, {5}, 1)) AS mat_cost
                                , SUM(ROUND(A.mat_amt, {5}, 1)) AS mat_amt
                                , CASE SUM(A.est_amt) WHEN 0 THEN 0 ELSE ROUND((SUM(ROUND(A.est_amt, {5}, 1)) - SUM(ROUND(A.mat_cost, {5}, 1))) / SUM(ROUND(A.est_amt, {5}, 1)), 4, 1) END AS mat_rate
                                , MAX(A.rmk) AS rmk
                                , model_class1
                            FROM dbo.EM_EST_INDEX A
                            WHERE A.est_key = '{1}' AND A.revision = '{2}'
                            {3}
                            {4}
                            ORDER BY MIN(A.model_seq), MIN(A.sort_seq)
                            ",
                             strQuery_1, arg_est_key, arg_revision, (aryDiv.Count > 0) ? aryWhere[iQry] : "", strQuery_2, strRule
                        );
                        objDr = (new cDBQuery(
                                    ruleQuery.INLINE,
                                    strQuery
                                )).retrieveQuery(objCon);
                        int iSubRow = iRow;
                        string sClass1 = "";
                        decimal fSubQty = 0, fSubCost = 0, fSubAmt = 0, fSubNCost = 0, fSubNAmt = 0, fSubMCost = 0, fSubMAmt = 0;
                        decimal fQty = 0, fCost = 0, fAmt = 0, fNCost = 0, fNAmt = 0, fMCost = 0, fMAmt = 0;
                        while (objDr.Read())
                        {
                            if (!sClass1.Equals(objDr["model_class1"]) && !sClass1.Equals(""))
                            {
                                iCopy = 6;  // SUB TOTAL
                                copyRange = objWorkSheet.Range["AA" + (iCopy + ((iCount - 1) * 6)) + ":AK" + (iCopy + ((iCount - 1) * 6))];
                                objRange = objWorkSheet.Range["A" + iRow.ToString() + ":K" + iRow.ToString()];
                                objRange.CopyFrom(copyRange);
                                //copyRange.Copy(objRange);

                                objWorkSheet.Range["A" + iRow.ToString() + ":A" + iRow.ToString()].Alignment.Horizontal = SpreadsheetHorizontalAlignment.Center;
                                objWorkSheet.Cells["A" + iRow.ToString()].Value = "* SUB TOTAL *";
                                //objWorkSheet.Cells[iRow, 2] = fSubQty;
                                //objWorkSheet.Cells[iRow, 4] = fSubAmt;
                                //objWorkSheet.Cells[iRow, 6] = fSubNAmt;
                                //objWorkSheet.Cells[iRow, 8] = fSubMAmt;
                                objWorkSheet.Cells["B" + iRow.ToString()].Formula = "=SUM(B" + iSubRow.ToString() + ":B" + (iRow - 1).ToString() + ")";
                                objWorkSheet.Cells["D" + iRow.ToString()].Formula = "=SUM(D" + iSubRow.ToString() + ":D" + (iRow - 1).ToString() + ")";
                                objWorkSheet.Cells["F" + iRow.ToString()].Formula = "=SUM(F" + iSubRow.ToString() + ":F" + (iRow - 1).ToString() + ")";
                                objWorkSheet.Cells["H" + iRow.ToString()].Formula = "=SUM(H" + iSubRow.ToString() + ":H" + (iRow - 1).ToString() + ")";

                                fSubQty = 0;
                                fSubCost = 0;
                                fSubAmt = 0;
                                fSubNCost = 0;
                                fSubNAmt = 0;
                                fSubMCost = 0;
                                fSubMAmt = 0;

                                iRow++;
                                iSubRow = iRow;
                            }

                            iCopy = 5;  // CONTENTS
                            copyRange = objWorkSheet.Range["AA" + (iCopy + ((iCount - 1) * 6)) + ":AK" + (iCopy + ((iCount - 1) * 6))];
                            objRange = objWorkSheet.Range["A" + iRow.ToString() + ":K" + iRow.ToString()];
                            objRange.CopyFrom(copyRange);
                            //copyRange.Copy(objRange);

                            iCol = 0;
                            for (int iAry = 0; iAry < iCount; iAry++)
                                objWorkSheet.Cells[iRow - 1, iCol++].Value = objDr["summary" + (iAry + 1)].ToString();
                            objWorkSheet.Cells[iRow - 1, iCol++].Value = Convert.ToInt32(objDr["model_qty"]);
                            objWorkSheet.Cells[iRow - 1, iCol++].Value = Convert.ToInt32(objDr["est_cost"]);
                            objWorkSheet.Cells[iRow - 1, iCol++].Value = Convert.ToInt32(objDr["est_amt"]);
                            objWorkSheet.Cells[iRow - 1, iCol++].Value = Convert.ToInt32(objDr["nego_cost"]);
                            objWorkSheet.Cells[iRow - 1, iCol++].Value = Convert.ToInt32(objDr["nego_amt"]);
                            //objWorkSheet.Cells[iRow, iCol++] = Convert.ToDecimal(objDr["nego_rate"]);
                            iCol++;
                            objWorkSheet.Cells[iRow - 1, iCol++].Value = Convert.ToInt32(objDr["mat_cost"]);
                            //objWorkSheet.Cells[iRow, iCol++] = Convert.ToDecimal(objDr["mat_rate"]);
                            iCol++;
                            objWorkSheet.Cells[iRow - 1, iCol++].Value = objDr["rmk"].ToString();

                            fSubQty += Convert.ToDecimal(objDr["model_qty"]);
                            fSubCost += Convert.ToDecimal(objDr["est_cost"]);
                            fSubAmt += Convert.ToDecimal(objDr["est_amt"]);
                            fSubNCost += Convert.ToDecimal(objDr["nego_cost"]);
                            fSubNAmt += Convert.ToDecimal(objDr["nego_amt"]);
                            fSubMCost += Convert.ToDecimal(objDr["mat_cost"]);
                            fSubMAmt += Convert.ToDecimal(objDr["mat_amt"]);

                            fQty += Convert.ToDecimal(objDr["model_qty"]);
                            fCost += Convert.ToDecimal(objDr["est_cost"]);
                            fAmt += Convert.ToDecimal(objDr["est_amt"]);
                            fNCost += Convert.ToDecimal(objDr["nego_cost"]);
                            fNAmt += Convert.ToDecimal(objDr["nego_amt"]);
                            fMCost += Convert.ToDecimal(objDr["mat_cost"]);
                            fMAmt += Convert.ToDecimal(objDr["mat_amt"]);

                            iRow++;
                            sClass1 = objDr["model_class1"].ToString();
                        }
                        objDr.Close();

                        iCopy = 6;  // SUB TOTAL
                        copyRange = objWorkSheet.Range["AA" + (iCopy + ((iCount - 1) * 6)) + ":AK" + (iCopy + ((iCount - 1) * 6))];
                        objRange = objWorkSheet.Range["A" + iRow.ToString() + ":K" + iRow.ToString()];
                        objRange.CopyFrom(copyRange);
                        objRange.RowHeight = 15;

                        objWorkSheet.Range["A" + iRow.ToString() + ":A" + iRow.ToString()].Alignment.Horizontal = SpreadsheetHorizontalAlignment.Center;
                        objWorkSheet.Cells["A" + iRow.ToString()].Value = "* SUB TOTAL *";
                        objWorkSheet.Cells["B" + iRow.ToString()].Formula = "=SUM(B" + iSubRow.ToString() + ":B" + (iRow - 1).ToString() + ")";
                        objWorkSheet.Cells["D" + iRow.ToString()].Formula = "=SUM(D" + iSubRow.ToString() + ":D" + (iRow - 1).ToString() + ")";
                        objWorkSheet.Cells["F" + iRow.ToString()].Formula = "=SUM(F" + iSubRow.ToString() + ":F" + (iRow - 1).ToString() + ")";
                        objWorkSheet.Cells["H" + iRow.ToString()].Formula = "=SUM(H" + iSubRow.ToString() + ":H" + (iRow - 1).ToString() + ")";


                        iRow++;

                        iCopy = 7;  // TOTAL
                        copyRange = objWorkSheet.Range["AA" + (iCopy + ((iCount - 1) * 6)) + ":AK" + (iCopy + ((iCount - 1) * 6))];
                        objRange = objWorkSheet.Range["A" + iRow.ToString() + ":K" + iRow.ToString()];
                        objRange.CopyFrom(copyRange);
                        objRange.RowHeight = 15;

                        cCol = 'A';
                        for (int iAry = 0; iAry < iCount - 1; iAry++, cCol++) ;
                        objRange = objWorkSheet.Range["A" + iRow.ToString() + ":" + cCol.ToString() + iRow.ToString()];
                        objRange.Merge();
                        objRange.Alignment.Horizontal = SpreadsheetHorizontalAlignment.Left;

                        iCol = 0;
                        objWorkSheet.Range["A" + iRow.ToString() + ":A" + iRow.ToString()].Alignment.Horizontal = SpreadsheetHorizontalAlignment.Center;
                        objWorkSheet.Cells[iRow - 1, iCol].Value = "** " + ((aryDiv.Count > 0) ? aryDiv[iQry] : "TOTAL") + " AMOUNT **";
                        iCol += iCount;
                        objWorkSheet.Cells[iRow - 1, iCol++].Value = Convert.ToInt32(fQty);
                        objWorkSheet.Cells[iRow - 1, iCol++].Value = Convert.ToInt32(fCost);
                        objWorkSheet.Cells[iRow - 1, iCol++].Value = Convert.ToInt32(fAmt);
                        objWorkSheet.Cells[iRow - 1, iCol++].Value = Convert.ToInt32(fNCost);
                        objWorkSheet.Cells[iRow - 1, iCol++].Value = Convert.ToInt32(fNAmt);
                        objWorkSheet.Cells[iRow - 1, iCol++].Value = Convert.ToInt32(Math.Floor(((fAmt - fNAmt) / fAmt) * 10000) / 10000);
                        objWorkSheet.Cells[iRow - 1, iCol++].Value = Convert.ToInt32(fMCost);
                        objWorkSheet.Cells[iRow - 1, iCol++].Value = Convert.ToInt32(Math.Floor(((fAmt - fMCost) / fAmt) * 10000) / 10000);

                        iRow++;
                    }

                    #endregion

                    #region [을지] - Remove Template.

                    copyRange = objWorkSheet.Range["AA" + iStart + ":AK" + (iStart + (iMax * 6))];
                    copyRange.Delete(DeleteMode.ShiftCellsLeft);
                    //copyRange.Delete(Excel.XlDeleteShiftDirection.xlShiftToLeft);

                    #endregion
                }
                catch (SqlException ex)
                {
                    throw new Exception(
                        new JavaScriptSerializer().Serialize(
                            new entityProcessed<string>(
                                codeProcessed.ERR_SQL,
                                "[을지] 데이터 조회에 실패하였습니다.\n- " + ex.Message)
                            )
                        );
                }
                catch (Exception ex)
                {
                    throw new Exception(
                        new JavaScriptSerializer().Serialize(
                            new entityProcessed<string>(
                                codeProcessed.ERR_PROCESS,
                                "[을지] 생성 중에 오류가 발생하였습니다.\n- " + ex.Message)
                            )
                        );
                }

                #endregion

                #region process Query & set to Print. [내역]

                try
                {
                    #region [내역] - 을지 조회

                    string strQuery = string.Format(@"
                        SELECT 
                              A.model_seq
                            , MAX(A.model_nm) AS model_nm
                            , (SELECT model_tnm
                               FROM EM_MODEL_CLASS 
                               WHERE model_class_cd1 = MAX(A.model_class1)
                               AND model_class_cd2 = '00'
                               AND model_class_cd3 = '00') AS class_nm
                        FROM dbo.EM_EST_INDEX A
                        WHERE A.est_key = '{0}' AND A.revision = '{1}'
                        GROUP BY A.model_seq
                        ORDER BY MIN(A.model_seq), MIN(A.sort_seq)
                        ",
                        arg_est_key, arg_revision
                    );

                    objDr = (new cDBQuery(
                                ruleQuery.INLINE,
                                strQuery
                            )).retrieveQuery(objCon);
                    List<int> aryModelNo = new List<int>();
                    List<string> aryModelName = new List<string>();
                    List<string> aryClassName = new List<string>();
                    while (objDr.Read())
                    {
                        aryModelNo.Add(Convert.ToInt16(objDr["model_seq"]));
                        aryModelName.Add(objDr["model_nm"].ToString());
                        aryClassName.Add(objDr["class_nm"].ToString());
                    }
                    objDr.Close();

                    #endregion

                    #region [내역] - 자재 출력

                    // 기준정보
                    string strMngRate = string.Empty;
                    string strPrfRate = string.Empty;
                    strQuery = string.Format(@"
                          SELECT STR(ROUND(A.manage_rate / 100, 2), 5, 2) AS manage_rate
                               , STR(ROUND(A.profit_rate / 100, 2), 5, 2) AS profit_rate
                            FROM EM_EST_REGISTER A
                           WHERE A.est_key = {0}
                             AND A.revision = {1}
                        ", arg_est_key, arg_revision);

                    objDr = (new cDBQuery(
                                ruleQuery.INLINE,
                                strQuery
                            )).retrieveQuery(objCon);

                    while (objDr.Read())
                    {
                        strMngRate = objDr["manage_rate"].ToString();
                        strPrfRate = objDr["profit_rate"].ToString();
                    }
                    objDr.Close();

                    // 내역
                    int iSheet = 3;
                    String[] strSheetNames = new String[aryModelNo.Count];
                    for (int iAry = 0; iAry < aryModelNo.Count; iAry++, iSheet++)
                    {
                        copyWorkSheet = objWorkBook.Worksheets[iSheet - 1]; //(Excel.Worksheet)objWorkBook.Sheets[iSheet];
                        objWorkSheet = objWorkBook.Worksheets[iSheet - 1];  //(Excel.Worksheet)objWorkBook.Sheets[iSheet];
                        //objWorkSheet.CopyFrom(copyWorkSheet);
                        objWorkBook.Worksheets.Add();
                        objWorkBook.Worksheets[objWorkBook.Worksheets.Count - 1].CopyFrom(copyWorkSheet);
                        //copyWorkSheet.Copy(Type.Missing, objWorkSheet);
                        objWorkSheet = objWorkBook.Worksheets[iSheet - 1];  //(Excel.Worksheet)objWorkBook.Sheets[iSheet];
                        //objWorkSheet.Name = aryClassName[iAry].Replace(" : ", "-");
                        //objWorkSheet.Name = "내역-" + (iAry + 1);
                        string strSheetName = aryModelName[iAry].Split(new char[] { ':' })[0].Trim() + " (" +
                            aryModelName[iAry].Split(new char[] { ':' })[2].Trim() + ")";
                        //if (strSheetName.Length > 30)
                        //    strSheetName = strSheetName.Substring(0, 29) + (iAry + 1);

                        // 특수문자 제거
                        strSheetName = System.Text.RegularExpressions.Regex.Replace(strSheetName, @"[*:'?/\[\]\\]", " ", System.Text.RegularExpressions.RegexOptions.Singleline);
                        if (strSheetName.Length > 27)
                            strSheetName = strSheetName.Substring(0, 27);

                        // 중복 제거
/*
                        int i = Array.LastIndexOf(strSheetNames, strSheetName);
                        if (i >= 0)
                        {
                            string strNum = " (" + (iAry + 1) + ")";
                            int iLen = (strSheetName.Length + strNum.Length) > 30 ? 30 - strNum.Length : strSheetName.Length;
                            strSheetName = strSheetName.Substring(0, iLen) + strNum;
                        }
*/
                        strSheetNames[iAry] = (iAry + 1).ToString() + "." + strSheetName;

                        objWorkSheet.Name = (iAry + 1).ToString() + "." + strSheetName;
                        objWorkSheet.Cells["A2"].Value = "[ " + strName + " ]";
                        objWorkSheet.Cells["D2"].Value = "[ " + aryModelName[iAry] + " ]";

                        strQuery = string.Format(@"
                            SELECT 
                                  '1.' + A.title_div2 AS title_div2
				                , RANK() OVER(ORDER BY A.title_div2 COLLATE Korean_Wansung_BIN ASC, A.sort_seq) AS sort_seq
                                , A.mat_nm
                                , A.mat_spec
                                , A.item_qty
                                , A.est_cost
                                , A.est_amt
                                , A.mat_maker
                            FROM EM_EST_DETAIL A
                            WHERE A.est_key = {0} AND A.revision = {1} AND A.model_seq = {2}
                            ORDER BY sort_seq
                            ",
                            arg_est_key, arg_revision, aryModelNo[iAry]
                        );

                            //UNION
                            //SELECT
                            //     '2.관리비' AS title_div2
                            //    , 99998 AS sort_seq
                            //    , '관리비' AS mat_nm
                            //    , '' AS mat_spec
                            //    , 1 AS item_qty
                            //    , A.manage_cost AS est_cost
                            //    , A.manage_cost AS est_amt
                            //    , '' AS mat_maker
                            //FROM EM_EST_INDEX A
                            //WHERE A.est_key = {0} AND A.revision = {1} AND A.model_seq = {2}
                            //AND ISNULL(A.manage_cost, 0) > 0
                            //UNION
                            //SELECT
                            //     '3.이윤' AS title_div2
                            //    , 99999 AS sort_seq
                            //    , '이윤' AS mat_nm
                            //    , '' AS mat_spec
                            //    , 1 AS item_qty
                            //    , A.profit_amt AS est_cost
                            //    , A.profit_amt AS est_amt
                            //    , '' AS mat_maker
                            //FROM EM_EST_INDEX A
                            //WHERE A.est_key = {0} AND A.revision = {1} AND A.model_seq = {2}
                            //AND ISNULL(A.profit_amt, 0) > 0
                            //ORDER BY sort_seq

                        
                        objDr = (new cDBQuery(
                                    ruleQuery.INLINE,
                                    strQuery
                                )).retrieveQuery(objCon);
                        int iStart = 4, iRow = iStart, iSubRow = iStart;
                        string strCell01 = string.Empty;    //옵션 + 자재
                        string strCell02 = string.Empty;    //인건비
                        string strCell03 = string.Empty;    //관리비
                        string strCell = string.Empty;
                        string strCellTotal = string.Empty;
                        string strDiv = string.Empty;
                        decimal fDiv = 0, fTotal = 0;
                        while (objDr.Read())
                        {
                            if (iRow == iStart)
                            {
                                strDiv = objDr["title_div2"].ToString().Substring(2);

                                copyRange = objWorkSheet.Range["AA301:AF301"];
                                objRange = objWorkSheet.Range["A" + iRow.ToString() + ":F" + iRow.ToString()];
                                objRange.CopyFrom(copyRange);
                                objRange.RowHeight = 13;

                                objWorkSheet.Cells["A" + iRow++.ToString()].Value = strDiv;
                                iSubRow = iRow;
                            }
                            else if (strDiv != objDr["title_div2"].ToString().Substring(2))
                            {
                                copyRange = objWorkSheet.Range["AA303:AF303"];
                                objRange = objWorkSheet.Range["A" + iRow.ToString() + ":F" + iRow.ToString()];
                                objRange.CopyFrom(copyRange);
                                objRange.RowHeight = 13;

                                objWorkSheet.Cells["A" + iRow.ToString()].Value = strDiv + " TOTAL";
                                objWorkSheet.Cells["E" + iRow.ToString()].Formula = string.Format("=SUM(E{0}:E{1})", iSubRow.ToString(), (iRow - 1).ToString());

                                strCell01 += strCell01.Equals("") ? "E" + iRow.ToString() : " + E" + iRow.ToString();
                                strCellTotal += strCellTotal.Equals("") ? "E" + iRow.ToString() : " + E" + iRow.ToString();

                                iRow++;

                                strDiv = objDr["title_div2"].ToString().Substring(2);
                                fDiv = 0;

                                copyRange = objWorkSheet.Range["AA301:AF301"];
                                objRange = objWorkSheet.Range["A" + iRow.ToString() + ":F" + iRow.ToString()];
                                objRange.CopyFrom(copyRange);
                                objRange.RowHeight = 13;

                                objWorkSheet.Cells["A" + iRow++.ToString()].Value = strDiv;
                                iSubRow = iRow;
                            }
                            copyRange = objWorkSheet.Range["AA302:AF302"];
                            objRange = objWorkSheet.Range["A" + iRow.ToString() + ":F" + iRow.ToString()];
                            objRange.CopyFrom(copyRange);

                            objWorkSheet.Cells["A" + iRow.ToString()].Value = objDr["mat_nm"].ToString();
                            objWorkSheet.Cells["B" + iRow.ToString()].Value = objDr["mat_spec"].ToString();
                            objWorkSheet.Cells["C" + iRow.ToString()].Value = Convert.ToInt32(objDr["item_qty"]);
                            objWorkSheet.Cells["F" + iRow.ToString()].Value = objDr["mat_maker"].ToString();
                            objWorkSheet.Cells["D" + iRow.ToString()].Value = Convert.ToInt32(objDr["est_cost"]);
                            objWorkSheet.Cells["E" + iRow.ToString()].Formula = string.Format("=C{0} * D{0}", iRow.ToString());

                            fDiv += Convert.ToDecimal(objDr["est_amt"]);
                            fTotal += Convert.ToDecimal(objDr["est_amt"]);

                            iRow++;
                        }
                        copyRange = objWorkSheet.Range["AA303:AF303"];
                        objRange = objWorkSheet.Range["A" + iRow.ToString() + ":F" + iRow.ToString()];
                        objRange.CopyFrom(copyRange);
                        objRange.RowHeight = 13;

                        objWorkSheet.Cells["A" + iRow.ToString()].Value = strDiv + " TOTAL";
                        objWorkSheet.Cells["E" + iRow.ToString()].Formula = string.Format("=SUM(E{0}:E{1})", iSubRow.ToString(), (iRow-1).ToString());

                        strCell01 += strCell01.Equals("") ? "E" + iRow.ToString() : " + E" + iRow.ToString();
                        strCellTotal += strCellTotal.Equals("") ? "E" + iRow.ToString() : " + E" + iRow.ToString();

                        iRow++;

                        // 관리비
                        strDiv = "관리비";
                        if (Convert.ToDecimal(strMngRate) != 0)
                        {
                            copyRange = objWorkSheet.Range["AA301:AF301"];
                            objRange = objWorkSheet.Range["A" + iRow.ToString() + ":F" + iRow.ToString()];
                            objRange.CopyFrom(copyRange);
                            objRange.RowHeight = 13;
                            objWorkSheet.Cells["A" + iRow.ToString()].Value = strDiv;
                            iRow++;

                            copyRange = objWorkSheet.Range["AA302:AF302"];
                            objRange = objWorkSheet.Range["A" + iRow.ToString() + ":F" + iRow.ToString()];
                            objRange.CopyFrom(copyRange);
                            objRange.RowHeight = 13;

                            objWorkSheet.Cells["A" + iRow.ToString()].Value = strDiv;
                            objWorkSheet.Cells["B" + iRow.ToString()].Value = "-";
                            objWorkSheet.Cells["C" + iRow.ToString()].Value = "-";
                            objWorkSheet.Cells["F" + iRow.ToString()].Value = "-";
                            // (OPTION + 인건비 + 자재비) * 기준정보(관리비%)
                            strCell = strCell01 + (strCell01.Equals("") || strCell02.Equals("") ? strCell02 : " + " + strCell02);
                            strCell = "=(" + strCell + ") * " + strMngRate;
                            objWorkSheet.Cells["D" + iRow.ToString()].Formula = strCell;
                            objWorkSheet.Cells["E" + iRow.ToString()].Formula = "=D" + iRow.ToString();
                            iRow++;

                            copyRange = objWorkSheet.Range["AA303:AF303"];
                            objRange = objWorkSheet.Range["A" + iRow.ToString() + ":F" + iRow.ToString()];
                            objRange.CopyFrom(copyRange);
                            objRange.RowHeight = 13;

                            objWorkSheet.Cells["A" + iRow.ToString()].Value = strDiv + " TOTAL";
                            objWorkSheet.Cells["E" + iRow.ToString()].Formula = string.Format("=SUM(E{0}:E{1})", (iRow - 1).ToString(), (iRow - 1).ToString());
                            strCellTotal += strCellTotal.Equals("") ? "E" + iRow.ToString() : " + E" + iRow.ToString();
                            strCell03 = "E" + iRow.ToString();
                            iRow++;
                        }

                        // 이윤
                        strDiv = "이윤";
                        if (Convert.ToDecimal(strPrfRate) != 0)
                        {
                            copyRange = objWorkSheet.Range["AA301:AF301"];
                            objRange = objWorkSheet.Range["A" + iRow.ToString() + ":F" + iRow.ToString()];
                            objRange.CopyFrom(copyRange);
                            objRange.RowHeight = 13;
                            objWorkSheet.Cells["A" + iRow.ToString()].Value = strDiv;
                            iRow++;

                            copyRange = objWorkSheet.Range["AA302:AF302"];
                            objRange = objWorkSheet.Range["A" + iRow.ToString() + ":F" + iRow.ToString()];
                            objRange.CopyFrom(copyRange);
                            objRange.RowHeight = 13;

                            objWorkSheet.Cells["A" + iRow.ToString()].Value = strDiv;
                            objWorkSheet.Cells["B" + iRow.ToString()].Value = "-";
                            objWorkSheet.Cells["C" + iRow.ToString()].Value = "-";
                            objWorkSheet.Cells["F" + iRow.ToString()].Value = "-";
                            // (OPTION + 인건비 + 자재비 + 관리비) * 기준정보(이윤%)
                            strCell = strCell01 + (strCell01.Equals("") || strCell02.Equals("") ? strCell02 : " + " + strCell02);
                            strCell += (strCell.Equals("") || strCell03.Equals("") ? strCell03 : " + " + strCell03);
                            strCell = "=(" + strCell + ") * " + strPrfRate;
                            objWorkSheet.Cells["D" + iRow.ToString()].Formula = strCell;
                            objWorkSheet.Cells["E" + iRow.ToString()].Formula = "=D" + iRow.ToString();
                            iRow++;

                            copyRange = objWorkSheet.Range["AA303:AF303"];
                            objRange = objWorkSheet.Range["A" + iRow.ToString() + ":F" + iRow.ToString()];
                            objRange.CopyFrom(copyRange);
                            objRange.RowHeight = 13;

                            objWorkSheet.Cells["A" + iRow.ToString()].Value = strDiv + " TOTAL";
                            objWorkSheet.Cells["E" + iRow.ToString()].Formula = string.Format("=SUM(E{0}:E{1})", (iRow - 1).ToString(), (iRow - 1).ToString());
                            strCellTotal += strCellTotal.Equals("") ? "E" + iRow.ToString() : " + E" + iRow.ToString();
                            iRow++;
                        }

                        // TOTAL
                        copyRange = objWorkSheet.Range["AA303:AF303"];
                        objRange = objWorkSheet.Range["A" + iRow.ToString() + ":F" + iRow.ToString()];
                        objRange.CopyFrom(copyRange);
                        objRange.RowHeight = 15;

                        objWorkSheet.Cells["A" + iRow.ToString()].Value = "TOTAL AMOUNT";
                        objWorkSheet.Cells["E" + iRow.ToString()].Formula = "=INT((" + strCellTotal + ") / 1000) * 1000";

                        objDr.Close();

                        #region [내역] - Remove Template.

                        copyRange = objWorkSheet.Range["AA301:AF310"];
                        copyRange.Delete(DeleteMode.ShiftCellsLeft);
                        //copyRange.Delete(Excel.XlDeleteShiftDirection.xlShiftToLeft);

                        #endregion
                    }

                    #endregion

                    #region [내역] - Remove Template.

                    copyWorkSheet = objWorkBook.Worksheets[iSheet - 1];
                    copyWorkSheet.Visible = false;
                    //copyWorkSheet.Visible = Excel.XlSheetVisibility.xlSheetVeryHidden;

                    #endregion
                }
                catch (SqlException ex)
                {
                    throw new Exception(
                        new JavaScriptSerializer().Serialize(
                            new entityProcessed<string>(
                                codeProcessed.ERR_SQL,
                                "[세부 내역서] 데이터 조회에 실패하였습니다.\n- " + ex.Message)
                            )
                        );
                }
                catch (Exception ex)
                {
                    throw new Exception(
                        new JavaScriptSerializer().Serialize(
                            new entityProcessed<string>(
                                codeProcessed.ERR_PROCESS,
                                "[세부 내역서] 생성 중에 오류가 발생하였습니다.\n- " + ex.Message)
                            )
                        );
                }

                #endregion
            }
            // -------

            #endregion

            #region [수출 견적서] 생성

            // 수출 견적서 -------
            //
            else if (strModel == "2")
            {
                #region process Query & set to Print. [수출]

                objWorkSheet = objWorkBook.Worksheets[0];   //(Excel.Worksheet)objWorkBook.Sheets[1];
                try
                {
                    #region [수출] - 상단 출력

                    string strQuery = string.Format(@"
                        SELECT 
                              dbo.fn_GETNAME('견적명',' ',A.est_key) AS est_nm
                            , dbo.fn_GETNAME('견적고객명',' ',A.est_key) AS cust_nm
                            , SUBSTRING(A.est_dt, 1, 4) + '- ' + SUBSTRING(A.est_dt, 5, 2) + '- ' + SUBSTRING(A.est_dt, 7, 2) AS est_dt
                            --, ROUND(A.est_amt, {2}, 1) AS est_amt
                            --, ROUND(A.nego_amt, {2}, 1) AS nego_amt
                            , (SELECT SUM(ROUND(est_amt, {2}, 1)) FROM EM_EST_INDEX WHERE est_key = {0} AND revision = {1}) AS est_amt
                            , (SELECT SUM(ROUND(nego_amt, {2}, 1)) FROM EM_EST_INDEX WHERE est_key = {0} AND revision = {1}) AS nego_amt
                            , ROUND(A.final_amt, {2}, 1) AS final_amt
                            , A.final_amt AS final_amt
                            --, CEILING((SELECT SUM(ROUND(est_amt, {2}, 1)) FROM EM_EST_INDEX WHERE est_key = {0} AND revision = {1}) / 100) * 100 AS est_amt
                            --, CEILING((SELECT SUM(ROUND(nego_amt, {2}, 1)) FROM EM_EST_INDEX WHERE est_key = {0} AND revision = {1}) / 100) * 100 AS nego_amt
                            --, CEILING(ROUND(A.final_amt, {2}, 1) / 100) * 100 AS final_amt
                            --, CEILING(A.final_amt / 100) * 100 AS final_amt
                            , A.est_expired
                            , A.delivery
                            , A.shipment
                            , A.pay_cond
                            , A.rmk
                        FROM dbo.EM_EST_ENV A
                        INNER JOIN dbo.EM_EST_REGISTER B ON B.est_key = A.est_key AND B.revision = A.revision
                        WHERE A.est_key = '{0}' AND A.revision = '{1}'
                        ",
                         arg_est_key, arg_revision, (strRule == "0") ? "2" : strRule
                    );
                    objDr = (new cDBQuery(
                                ruleQuery.INLINE,
                                strQuery
                            )).retrieveQuery(objCon);
                    string strTotal = string.Empty;
                    if (objDr.Read())
                    {
                        objWorkSheet.Cells["C5"].Value = objDr["est_dt"].ToString();
                        objWorkSheet.Cells["C6"].Value = objDr["cust_nm"].ToString();
                        objWorkSheet.Cells["J5"].Value = objDr["est_expired"].ToString();
                        objWorkSheet.Cells["J6"].Value = objDr["delivery"].ToString();
                        objWorkSheet.Cells["J7"].Value = objDr["shipment"].ToString();
                        objWorkSheet.Cells["J8"].Value = objDr["pay_cond"].ToString();
                        objWorkSheet.Cells["A11"].Value = objDr["rmk"].ToString();
                        objWorkSheet.Cells["A16"].Value = objDr["est_nm"].ToString();
                        objWorkSheet.Cells["I16"].Value = Convert.ToInt32(objDr["est_amt"]);
                        if (Convert.ToDecimal(objDr["est_amt"]) != Convert.ToDecimal(objDr["final_amt"]))
                        {
                            copyRange = objWorkSheet.Range["AA22:AO22"];
                            objRange = objWorkSheet.Range["A17:O17"];
                            objRange.CopyFrom(copyRange);
                            //copyRange.Copy(objRange);

                            objWorkSheet.Cells["I17"].Value = Convert.ToInt32(objDr["final_amt"]);
                        }
                    }
                    else
                        throw new Exception
                            ("해당 데이터를 찾을 수 없습니다.");
                    objDr.Close();

                    #endregion

                    #region [수출] - 을지 조회

                    strQuery = string.Format(@"
                        SELECT 
                              A.model_seq
                            , MAX(A.model_nm) AS model_nm
                            , (SELECT model_tnm
                               FROM EM_MODEL_CLASS 
                               WHERE model_class_cd1 = MAX(A.model_class1)
                               AND model_class_cd2 = '00'
                               AND model_class_cd3 = '00') AS class_nm
                        FROM dbo.EM_EST_INDEX A
                        WHERE A.est_key = '{0}' AND A.revision = '{1}'
                        GROUP BY A.model_seq
                        ORDER BY MIN(A.sort_seq)
                        ",
                        arg_est_key, arg_revision
                    );

                    objDr = (new cDBQuery(
                                ruleQuery.INLINE,
                                strQuery
                            )).retrieveQuery(objCon);
                    List<int> aryModelNo = new List<int>();
                    List<string> aryModelName = new List<string>();
                    List<string> aryClassName = new List<string>();
                    while (objDr.Read())
                    {
                        aryModelNo.Add(Convert.ToInt16(objDr["model_seq"]));
                        aryModelName.Add(objDr["model_nm"].ToString());
                        aryClassName.Add(objDr["class_nm"].ToString());
                    }
                    objDr.Close();

                    #endregion

                    #region [수출] - 자재 출력

                    int iRow = 20, iSubRow = 0;
                    for (int iAry = 0; iAry < aryModelNo.Count; iAry++)
                    {
                        copyRange = objWorkSheet.Range["AA24:AO26"];
                        objRange = objWorkSheet.Range["A" + (++iRow).ToString() + ":O" + (iRow + 2).ToString()];
                        objRange.CopyFrom(copyRange);
                        //copyRange.Copy(objRange);

                        objWorkSheet.Cells["A" + iRow.ToString()].Value = (iAry + 1).ToString() + ". " + aryModelName[iAry];
                        iRow += 3;
                        iSubRow = iRow;

                        strQuery = string.Format(@"
                            SELECT 
                                  title_div2
                                --, ISNULL(mat_tnm, '') AS mat_tnm
                                , ISNULL(mat_nm, '') AS mat_tnm
                                , ISNULL(mat_group, '') AS mat_group
                                , ISNULL(mat_sno, '') AS mat_sno
                                , ISNULL(item_qty, 0) AS item_qty
                                , ISNULL(est_cost, 0) AS est_cost
                                --, ISNULL(CEILING(est_cost / 100) * 100, 0) AS est_cost
                                , ISNULL(est_amt, 0) AS est_amt
                            FROM EM_EST_DETAIL
                            WHERE est_key = {0} AND revision = {1} AND model_seq = {2}
                            ORDER BY title_div2 COLLATE Korean_Wansung_BIN
                            ",
                            /*
                            UNION
                            SELECT
	                             '2.MANAGING COST' AS title_div2
	                            ,'MANAGING COST' AS mat_tnm
	                            ,'' AS mat_group
                                ,'' AS mat_sno
	                            ,1 AS item_qty
	                            ,manage_cost AS est_cost
	                            ,manage_cost AS est_amt
                            FROM EM_EST_INDEX
                            WHERE est_key = {0} AND revision = {1} AND model_seq = {2}
                            AND ISNULL(manage_cost, 0) > 0
                            UNION
                            SELECT
	                             '3.PROFIT' AS title_div2
	                            ,'PROFIT' AS mat_tnm
	                            ,'' AS mat_group
                                ,'' AS mat_sno
	                            ,1 AS item_qty
	                            ,profit_amt AS est_cost
	                            ,profit_amt AS est_amt
                            FROM EM_EST_INDEX
                            WHERE est_key = {0} AND revision = {1} AND model_seq = {2}
                            AND ISNULL(profit_amt, 0) > 0
                            */
                            arg_est_key, arg_revision, aryModelNo[iAry]
                        );
                        objDr = (new cDBQuery(
                                    ruleQuery.INLINE,
                                    strQuery
                                )).retrieveQuery(objCon);
                        int iCell = 0;
                        decimal fQty = 0, fAmt = 0;
                        while (objDr.Read())
                        {
                            copyRange = objWorkSheet.Range["AA27:AO27"];
                            objRange = objWorkSheet.Range["A" + iRow.ToString() + ":O" + iRow.ToString()];
                            objRange.CopyFrom(copyRange);
                            //copyRange.Copy(objRange);

                            objWorkSheet.Cells["A" + iRow.ToString()].Value = (iCell + 1).ToString();
                            objWorkSheet.Cells["B" + iRow.ToString()].Value = objDr["mat_tnm"].ToString();
                            objRange = objWorkSheet.Range["B" + iRow.ToString() + ":B" + iRow.ToString()];
                            objRange.Alignment.Horizontal = SpreadsheetHorizontalAlignment.Left;
                            objWorkSheet.Cells["E" + iRow.ToString()].Value = objDr["mat_group"].ToString();
                            objWorkSheet.Cells["I" + iRow.ToString()].Value = objDr["mat_sno"].ToString();
                            objWorkSheet.Cells["K" + iRow.ToString()].Value = Convert.ToInt32(objDr["item_qty"]);
                            objWorkSheet.Cells["M" + iRow.ToString()].Value = Convert.ToInt32(objDr["est_cost"]);
                            objWorkSheet.Cells["N" + iRow.ToString()].Formula = string.Format("=K{0} * M{0}", iRow.ToString());
                            //objWorkSheet.Cells[iRow, 14] = Convert.ToDecimal(objDr["est_amt"]);

                            fQty += Convert.ToDecimal(objDr["item_qty"]);
                            fAmt += Convert.ToDecimal(objDr["est_amt"]);

                            iRow++; iCell++;
                        }
                        copyRange = objWorkSheet.Range["AA29:AO30"];
                        objRange = objWorkSheet.Range["A" + iRow.ToString() + ":O" + (++iRow).ToString()];
                        objRange.CopyFrom(copyRange);
                        //copyRange.Copy(objRange);

                        objWorkSheet.Cells["K" + iRow.ToString()].Formula = string.Format("=SUM(K{0}:K{1})", iSubRow.ToString(), (iRow - 2).ToString());
                        objWorkSheet.Cells["M" + iRow++.ToString()].Formula = string.Format("=SUM(N{0}:N{1})", iSubRow.ToString(), (iRow - 2).ToString());
                        //objWorkSheet.Cells[iRow, 11] = fQty;
                        //objWorkSheet.Cells[iRow++, 13] = fAmt;

                        objDr.Close();
                    }

                    #endregion

                    #region [수출] - 기타 출력

                    {
                        strQuery = string.Format(@"
                            SELECT
	                             COUNT(*) AS cnt
	                            ,SUM(ISNULL(manage_cost, 0)) AS est_cost
	                            ,SUM(ISNULL(manage_cost, 0)) AS est_amt
	                            --,CEILING(SUM(ISNULL(manage_cost, 0)) / 100) * 100 AS est_cost
	                            --,CEILING(SUM(ISNULL(manage_cost, 0)) / 100) * 100 AS est_amt
                            FROM EM_EST_INDEX
                            WHERE est_key = {0} AND revision = {1}
                            AND ISNULL(manage_cost, 0) > 0
                            ",
                            arg_est_key, arg_revision
                        );
                        objDr = (new cDBQuery(
                                    ruleQuery.INLINE,
                                    strQuery
                                )).retrieveQuery(objCon);
                        int iAry = aryModelNo.Count;
                        decimal fAmt = 0;
                        if (objDr.Read() && Convert.ToInt32(objDr["cnt"]) > 0)
                        {
                            copyRange = objWorkSheet.Range["AA24:AO24"];
                            objRange = objWorkSheet.Range["A" + (++iRow).ToString() + ":O" + (iRow).ToString()];
                            objRange.CopyFrom(copyRange);
                            //copyRange.Copy(objRange);

                            objWorkSheet.Cells["A" + iRow.ToString()].Value = (++iAry).ToString() + ". " + "Managing Cost";

                            copyRange = objWorkSheet.Range["AA38:AO38"];
                            objRange = objWorkSheet.Range["A" + (++iRow).ToString() + ":O" + (iRow).ToString()];
                            objRange.CopyFrom(copyRange);
                            //copyRange.Copy(objRange);

                            copyRange = objWorkSheet.Range["AA39:AO40"];
                            objRange = objWorkSheet.Range["A" + (++iRow).ToString() + ":O" + (iRow+1).ToString()];
                            objRange.CopyFrom(copyRange);
                            //copyRange.Copy(objRange);

                            objWorkSheet.Cells["A" + iRow.ToString()].Value = "Managing Cost";
                            objWorkSheet.Cells["M" + iRow.ToString()].Value = Convert.ToInt32(objDr["est_amt"]);

                            fAmt += Convert.ToDecimal(objDr["est_amt"]);

                            iRow+=2;

                            copyRange = objWorkSheet.Range["AA41:AO42"];
                            objRange = objWorkSheet.Range["A" + iRow.ToString() + ":O" + (++iRow).ToString()];
                            objRange.CopyFrom(copyRange);
                            //copyRange.Copy(objRange);

                            objWorkSheet.Cells["M" + iRow++.ToString()].Value = Convert.ToInt32(fAmt);
                        }
                        objDr.Close();

                        strQuery = string.Format(@"
                            SELECT
	                             COUNT(*) AS cnt
	                            ,SUM(ISNULL(profit_amt, 0)) AS est_cost
	                            ,SUM(ISNULL(profit_amt, 0)) AS est_amt
                            FROM EM_EST_INDEX
                            WHERE est_key = {0} AND revision = {1}
                            AND ISNULL(profit_amt, 0) > 0
                            ",
                            arg_est_key, arg_revision
                        );
                        objDr = (new cDBQuery(
                                    ruleQuery.INLINE,
                                    strQuery
                                )).retrieveQuery(objCon);
                        fAmt = 0;
                        if (objDr.Read() && Convert.ToInt32(objDr["cnt"]) > 0)
                        {
                            copyRange = objWorkSheet.Range["AA24:AO24"];
                            objRange = objWorkSheet.Range["A" + (++iRow).ToString() + ":O" + (iRow).ToString()];
                            objRange.CopyFrom(copyRange);
                            //copyRange.Copy(objRange);

                            objWorkSheet.Cells["A" + iRow.ToString()].Value = (++iAry).ToString() + ". " + "Profit";

                            copyRange = objWorkSheet.Range["AA38:AO38"];
                            objRange = objWorkSheet.Range["A" + (++iRow).ToString() + ":O" + (iRow).ToString()];
                            objRange.CopyFrom(copyRange);
                            //copyRange.Copy(objRange);

                            copyRange = objWorkSheet.Range["AA39:AO40"];
                            objRange = objWorkSheet.Range["A" + (++iRow).ToString() + ":O" + (iRow + 1).ToString()];
                            objRange.CopyFrom(copyRange);
                            //copyRange.Copy(objRange);

                            objWorkSheet.Cells["A" + iRow.ToString()].Value = "Profit";
                            objWorkSheet.Cells["M" + iRow.ToString()].Value = Convert.ToInt32(objDr["est_amt"]);

                            fAmt += Convert.ToDecimal(objDr["est_amt"]);

                            iRow += 2;

                            copyRange = objWorkSheet.Range["AA41:AO42"];
                            objRange = objWorkSheet.Range["A" + iRow.ToString() + ":O" + (++iRow).ToString()];
                            objRange.CopyFrom(copyRange);
                            //copyRange.Copy(objRange);

                            objWorkSheet.Cells["M" + iRow++.ToString()].Value = Convert.ToInt32(fAmt);
                        }
                        objDr.Close();
                    }

                    #endregion

                    #region [수출] - Remove Template.

                    copyRange = objWorkSheet.Range["AA20:AO42"];
                    copyRange.Delete(DeleteMode.ShiftCellsLeft);

                    #endregion
                }
                catch (SqlException ex)
                {
                    throw new Exception(
                        new JavaScriptSerializer().Serialize(
                            new entityProcessed<string>(
                                codeProcessed.ERR_SQL,
                                "데이터 조회에 실패하였습니다.\n- " + ex.Message)
                            )
                        );
                }
                catch (Exception ex)
                {
                    throw new Exception(
                        new JavaScriptSerializer().Serialize(
                            new entityProcessed<string>(
                                codeProcessed.ERR_PROCESS,
                                "출력물 생성 중에 오류가 발생하였습니다.\n- " + ex.Message)
                            )
                        );
                }
                // -------

                #endregion
            }

            #endregion

            #region save to File.

            objWorkBook.Worksheets.ActiveWorksheet = objWorkBook.Worksheets[0];
            try
            {
                using (System.IO.FileStream xls = new System.IO.FileStream(strTarget + ".xlsx", System.IO.FileMode.Create))
                {
                    objWorkBook.SaveDocument(xls, DevExpress.Spreadsheet.DocumentFormat.Xlsx);
                }

                strReturn = new JavaScriptSerializer().Serialize(
                                new entityProcessed<string>(
                                    codeProcessed.SUCCESS,
                                    strToday + "/" + strPrint)
                            );
            }
            catch (Exception ex)
            {
                throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                            codeProcessed.ERR_PROCESS,
                            "파일 생성 중에 오류가 발생하였습니다.\n- " + ex.Message)
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

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
