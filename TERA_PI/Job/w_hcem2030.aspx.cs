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

public partial class Job_w_hcem2030 : System.Web.UI.Page
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

            #region prepare Office object.

            string strType = DATA.getOption("PRINT");
            string strPage = DATA.getOption("PAGE");
            string strModel = (Convert.ToInt32(DATA.getOption("MODEL")) + 1).ToString();
            string strRule = (Convert.ToInt32(DATA.getOption("RULE")) * -1).ToString();

            string strRoot = HttpContext.Current.Server.MapPath("~/");
            string strSource = strRoot + "Report/" + strPage + "/" + strPage + "_" + strModel + ".xls";
            string strTarget = strRoot + "Report/" + strPage + "/" + strPage + "_" + arg_est_key + "_" + arg_revision;
            string strPrint = strPage + "_" + arg_est_key + "_" + arg_revision + "." + strType;

            object objMissing = Type.Missing;
            object varMissing = System.Reflection.Missing.Value;
            Excel._Workbook objWorkBook;
            Excel._Worksheet objWorkSheet, copyWorkSheet;
            Excel.Range objRange, copyRange;
            Excel.XlFileFormat enSource = Excel.XlFileFormat.xlExcel8;

            try
            {
                objExcel = new Excel.Application();
                objExcel.DisplayAlerts = false;
                objExcel.Visible = false;
                objExcel.DisplayAlerts = false;
                objExcel.Visible = false;
                objWorkBook = objExcel.Workbooks.Open(
                                strSource,
                                false,
                                true,
                                varMissing, varMissing, varMissing, varMissing, varMissing, varMissing, varMissing, varMissing, varMissing, varMissing, varMissing, varMissing);
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
                objWorkSheet = (Excel.Worksheet)objWorkBook.Sheets[1];
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
                        objWorkSheet.Cells[3, 2] = "견적명 : " + objDr["est_nm"].ToString();
                        objWorkSheet.Cells[4, 2] = objDr["est_dt"].ToString();
                        objWorkSheet.Cells[5, 2] = objDr["cust_nm"].ToString() + " 귀하";
                        objWorkSheet.Cells[6, 2] = objDr["est_amt"];
                        objWorkSheet.Cells[7, 2] = objDr["est_amt"];

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
                            , SUM(ROUND(A.est_cost, {4}, 1)) AS model_cost
                            , SUM(ROUND(A.est_amt, {4}, 1)) AS model_amt
                            , SUM(ROUND(A.nego_amt, {4}, 1)) AS nego_amt
                            , MAX(A.est_key)
                            , MAX(A.revision)
                        FROM dbo.EM_EST_INDEX A 
                        WHERE A.est_key = '{1}' AND A.revision = '{2}'
                        GROUP BY {3}
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
                            copyRange = objWorkSheet.get_Range("AA10", "AJ10");
                        else
                            copyRange = objWorkSheet.get_Range("AA11", "AJ11");
                        objRange = objWorkSheet.get_Range("B" + iRow.ToString(), "K" + iRow.ToString());
                        copyRange.Copy(objRange);
                        objRange.RowHeight = 20;

                        objWorkSheet.Cells[iRow, 2] = objDr["model_nm"].ToString();
                        objWorkSheet.Cells[iRow, 5] = objDr["model_spec"].ToString();
                        objWorkSheet.Cells[iRow, 7] = Convert.ToDecimal(objDr["model_qty"]);
                        objWorkSheet.Cells[iRow, 8] = Convert.ToDecimal(objDr["model_cost"]);
                        objWorkSheet.Cells[iRow, 10] = Convert.ToDecimal(objDr["model_amt"]);

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

                    copyRange = objWorkSheet.get_Range("AA12", "AJ12");
                    objRange = objWorkSheet.get_Range("B" + iRow.ToString(), "K" + iRow.ToString());
                    copyRange.Copy(objRange);
                    objRange.RowHeight = 22;
                    copyRange = objWorkSheet.get_Range("AA13", "AJ18");
                    objRange = objWorkSheet.get_Range("B" + (iRow + 1).ToString(), "K" + (iRow + 6).ToString());
                    copyRange.Copy(objRange);
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
                        objWorkSheet.Cells[iRow, 10] = objDr["est_amt"];
                        iRow++;
                        objWorkSheet.Cells[iRow, 5] = objDr["delivery"].ToString();
                        objWorkSheet.Cells[iRow, 8] = (objDr["vat_div"].ToString() == "1") ? "** 부가세 별도 **" : "** 부가세 포함 **";
                        iRow++;
                        objWorkSheet.Cells[iRow, 5] = objDr["pay_cond"].ToString();
                        objWorkSheet.Cells[iRow, 8] = "* 담당자 : " + objDr["submit_empnm"].ToString();
                        iRow++;
                        objWorkSheet.Cells[iRow, 5] = objDr["est_expired"].ToString();
                        iRow++;
                        objWorkSheet.Cells[iRow + 1, 2] = objDr["rmk"].ToString().Replace("\r\n", "\n");

                        strRemark = objDr["rmk"].ToString().Replace("\r\n", "\n");
                    }
                    else
                        throw new Exception
                            ("[갑지] 해당 데이터를 찾을 수 없습니다.");
                    objDr.Close();

                    #endregion

                    #region [갑지] - Remove Template.

                    copyRange = objWorkSheet.get_Range("AA10", "AJ17");
                    copyRange.Delete(Excel.XlDeleteShiftDirection.xlShiftToLeft);

                    #endregion

                    #region [갑지] - 비고 출력

                    if (!string.IsNullOrEmpty(strNego))
                    {
                        objWorkSheet.Cells[iRow, 2] =
                            "* NEGO가\n" +
                            ((!string.IsNullOrEmpty(strTitle)) ? strTitle : "") +
                            ((!string.IsNullOrEmpty(strNego)) ? "합계" + "\n" : "") +
                            ((!string.IsNullOrEmpty(strTotal)) ? "* 최종NEGO가" : "");
                        objWorkSheet.Cells[iRow, 4] =
                            "\n" +
                            ((!string.IsNullOrEmpty(strAmount)) ? strAmount : "") +
                            ((!string.IsNullOrEmpty(strNego)) ? strNego + "\n" : "") +
                            ((!string.IsNullOrEmpty(strTotal)) ? strTotal : "");
                        iNego += ((!string.IsNullOrEmpty(strTotal)) ? 3 : 2);
                    }
                    objRange = objWorkSheet.get_Range("B" + iRow.ToString(), "K" + iRow.ToString());
                    objRange.RowHeight = iNego * 18;
                    iRow++;
                    string[] aryRemark = strRemark.Split('\n');
                    objRange = objWorkSheet.get_Range("B" + iRow.ToString(), "K" + iRow.ToString());
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

                objWorkSheet = (Excel.Worksheet)objWorkBook.Sheets[2];
                try
                {
                    #region [을지] - 집계 조회

                    int iMax = 2;
                    List<int []> aryWidth = new List<int[]>();
                    aryWidth.Add(new int [] { 30, 5, 15, 15, 15, 15, 10, 20 });
                    aryWidth.Add(new int [] { 20, 25, 5, 12, 13, 12, 13, 8, 18 });

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

                    objRange = objWorkSheet.get_Range("A2", "A2");
                    objRange.RowHeight = 15;

                    objWorkSheet.Cells[2, 1] = "[ " + strName + " ]";
                    iRow++;                

                    for (int iQry = 0; iQry < ((aryDiv.Count > 0) ? aryDiv.Count : 1); iQry++, iRow++)
                    {
                        if (aryDiv.Count > 0)
                        {
                            objRange = objWorkSheet.get_Range("A" + iRow.ToString(), "A" + iRow.ToString());
                            objRange.RowHeight = 15;

                            objWorkSheet.Cells[iRow++, 1] = "** " + ((string.IsNullOrEmpty(strTitle)) ? "" : strTitle + " : ") + aryDiv[iQry];
                        }

                        iCopy = iStart;
                        copyRange = objWorkSheet.get_Range("AA" + (iCopy + ((iCount - 1) * 6)), "AK" + (iCopy + ((iCount - 1) * 6)));
                        objRange = objWorkSheet.get_Range("A" + iRow.ToString(), "K" + iRow.ToString());
                        copyRange.Copy(objRange);
                        objRange.RowHeight = 15;

                        cCol = 'A';
                        for (int iAry = 0; iAry < aryWidth[iCount - 1].Length; iAry++, cCol++)
                        {
                            objRange = objWorkSheet.get_Range((cCol).ToString() + iRow.ToString(), (cCol).ToString() + iRow.ToString());
                            objRange.ColumnWidth = aryWidth[iCount - 1][iAry];
                            if (iAry < iCount)
                                objWorkSheet.Cells[iRow, iAry + 1] = arySummary[iAry];
                        }
                        int iCol = iCount + 1;
                        objWorkSheet.Cells[iRow, iCol++] = "Q'TY";
                        objWorkSheet.Cells[iRow, iCol++] = "UNIT PRICE";
                        objWorkSheet.Cells[iRow, iCol++] = "TOTAL AMOUNT";
                        objWorkSheet.Cells[iRow, iCol++] = "NEGO PRICE";
                        objWorkSheet.Cells[iRow, iCol++] = "NEGO TOTAL";
                        objWorkSheet.Cells[iRow, iCol++] = "NEGO %";
                        objWorkSheet.Cells[iRow, iCol++] = "자재금액";
                        objWorkSheet.Cells[iRow, iCol++] = "자재비율 %";
                        objWorkSheet.Cells[iRow, iCol++] = "비고";

                        iRow++;

                        strQuery_1 = string.Empty;
                        strQuery_2 = string.Empty;
                        for (int iAry = 0; iAry < aryQuery_1.Count; iAry++)
                        {
                            strQuery_1 += ((iAry == 0) ? "" : ", ") + aryQuery_1[iAry];
                            strQuery_2 += ((iAry == 0) ? "GROUP BY " : ", ") + aryQuery_2[iAry];
                        }
                        strQuery = string.Format(@"
                            SELECT 
                                  {0}
                                , SUM(A.model_qty) AS model_qty
                                , SUM(ROUND(A.est_cost, {5}, 1)) AS est_cost
                                , SUM(ROUND(A.est_amt, {5}, 1)) AS est_amt
                                , SUM(ROUND(A.nego_cost, {5}, 1)) AS nego_cost
                                , SUM(ROUND(A.nego_amt, {5}, 1)) AS nego_amt
                                , CASE SUM(A.est_amt) WHEN 0 THEN 0 ELSE ROUND((SUM(ROUND(A.est_amt, {5}, 1)) - SUM(ROUND(A.nego_amt, {5}, 1))) / SUM(ROUND(A.est_amt, {5}, 1)), 4, 1) END AS nego_rate
                                , SUM(ROUND(A.mat_cost, {5}, 1)) AS mat_cost
                                , SUM(ROUND(A.mat_amt, {5}, 1)) AS mat_amt
                                , CASE SUM(A.est_amt) WHEN 0 THEN 0 ELSE ROUND((SUM(ROUND(A.est_amt, {5}, 1)) - SUM(ROUND(A.mat_amt, {5}, 1))) / SUM(ROUND(A.est_amt, {5}, 1)), 4, 1) END AS mat_rate
                                , MAX(A.rmk) AS rmk
                                , model_class1
                            FROM dbo.EM_EST_INDEX A
                            WHERE A.est_key = '{1}' AND A.revision = '{2}'
                            {3}
                            {4}
                            ",
                             strQuery_1, arg_est_key, arg_revision, (aryDiv.Count > 0) ? aryWhere[iQry] : "", strQuery_2, strRule
                        );
                        objDr = (new cDBQuery(
                                    ruleQuery.INLINE,
                                    strQuery
                                )).retrieveQuery(objCon);

                        string sClass1 = "";
                        decimal fSubQty = 0, fSubCost = 0, fSubAmt = 0, fSubNCost = 0, fSubNAmt = 0, fSubMAmt = 0;
                        decimal fQty = 0, fCost = 0, fAmt = 0, fNCost = 0, fNAmt = 0, fMAmt = 0;
                        while (objDr.Read())
                        {
                            iCopy = 5;
                            copyRange = objWorkSheet.get_Range("AA" + (iCopy + ((iCount - 1) * 6)), "AK" + (iCopy + ((iCount - 1) * 6)));
                            objRange = objWorkSheet.get_Range("A" + iRow.ToString(), "K" + iRow.ToString());
                            copyRange.Copy(objRange);


                            if (sClass1.Equals(objDr["model_class1"].ToString()) || sClass1.Equals(""))
                            {
                                fSubQty += Convert.ToDecimal(objDr["model_qty"]);
                                fSubCost += Convert.ToDecimal(objDr["est_cost"]);
                                fSubAmt += Convert.ToDecimal(objDr["est_amt"]);
                                fSubNCost += Convert.ToDecimal(objDr["nego_cost"]);
                                fSubNAmt += Convert.ToDecimal(objDr["nego_amt"]);
                                fSubMAmt += Convert.ToDecimal(objDr["mat_amt"]);
                            }
                            else
                            {
                                objWorkSheet.get_Range("A" + iRow.ToString(), "A" + iRow.ToString()).HorizontalAlignment = Excel.XlHAlign.xlHAlignCenter;
                                objWorkSheet.get_Range("A" + iRow.ToString(), "J" + iRow.ToString()).Cells.Interior.Color = System.Drawing.ColorTranslator.ToOle(System.Drawing.Color.Yellow);
                                objWorkSheet.Cells[iRow, 1] = "* SUB TOTAL *";
                                objWorkSheet.Cells[iRow, 2] = fSubQty;
                                objWorkSheet.Cells[iRow, 4] = fSubAmt;
                                objWorkSheet.Cells[iRow, 6] = fSubNAmt;
                                objWorkSheet.Cells[iRow, 8] = fSubMAmt;
                                iRow++;

                                fSubQty = Convert.ToDecimal(objDr["model_qty"]);
                                fSubCost = Convert.ToDecimal(objDr["est_cost"]);
                                fSubAmt = Convert.ToDecimal(objDr["est_amt"]);
                                fSubNCost = Convert.ToDecimal(objDr["nego_cost"]);
                                fSubNAmt = Convert.ToDecimal(objDr["nego_amt"]);
                                fSubMAmt = Convert.ToDecimal(objDr["mat_amt"]);

                                copyRange = objWorkSheet.get_Range("AA" + (iCopy + ((iCount - 1) * 6)), "AK" + (iCopy + ((iCount - 1) * 6)));
                                objRange = objWorkSheet.get_Range("A" + iRow.ToString(), "K" + iRow.ToString());
                                copyRange.Copy(objRange);
                            }


                            iCol = 1;
                            for (int iAry = 0; iAry < iCount; iAry++)
                                objWorkSheet.Cells[iRow, iCol++] = objDr["summary" + (iAry + 1)].ToString();
                            objWorkSheet.Cells[iRow, iCol++] = Convert.ToDecimal(objDr["model_qty"]);
                            objWorkSheet.Cells[iRow, iCol++] = Convert.ToDecimal(objDr["est_cost"]);
                            objWorkSheet.Cells[iRow, iCol++] = Convert.ToDecimal(objDr["est_amt"]);
                            objWorkSheet.Cells[iRow, iCol++] = Convert.ToDecimal(objDr["nego_cost"]);
                            objWorkSheet.Cells[iRow, iCol++] = Convert.ToDecimal(objDr["nego_amt"]);
                            //--------------------------------------------------------------------------
                            //objWorkSheet.Cells[iRow, iCol++] = Convert.ToDecimal(objDr["nego_rate"]);
                            iCol++;
                            //--------------------------------------------------------------------------
                            objWorkSheet.Cells[iRow, iCol++] = Convert.ToDecimal(objDr["mat_amt"]);
                            //--------------------------------------------------------------------------
                            //objWorkSheet.Cells[iRow, iCol++] = Convert.ToDecimal(objDr["mat_rate"]);
                            iCol++;
                            //--------------------------------------------------------------------------
                            objWorkSheet.Cells[iRow, iCol++] = objDr["rmk"].ToString();

                            sClass1 = objDr["model_class1"].ToString();
                            fQty += Convert.ToDecimal(objDr["model_qty"]);
                            fCost += Convert.ToDecimal(objDr["est_cost"]);
                            fAmt += Convert.ToDecimal(objDr["est_amt"]);
                            fNCost += Convert.ToDecimal(objDr["nego_cost"]);
                            fNAmt += Convert.ToDecimal(objDr["nego_amt"]);
                            fMAmt += Convert.ToDecimal(objDr["mat_amt"]);

                            iRow++;
                        }
                        objDr.Close();

                        copyRange = objWorkSheet.get_Range("AA" + (iCopy + ((iCount - 1) * 6)), "AK" + (iCopy + ((iCount - 1) * 6)));
                        objRange = objWorkSheet.get_Range("A" + iRow.ToString(), "K" + iRow.ToString());
                        copyRange.Copy(objRange);

                        objWorkSheet.get_Range("A" + iRow.ToString(), "A" + iRow.ToString()).HorizontalAlignment = Excel.XlHAlign.xlHAlignCenter;
                        objWorkSheet.get_Range("A" + iRow.ToString(), "J" + iRow.ToString()).Cells.Interior.Color = System.Drawing.ColorTranslator.ToOle(System.Drawing.Color.Yellow);
                        objWorkSheet.Cells[iRow, 1] = "* SUB TOTAL *";
                        objWorkSheet.Cells[iRow, 2] = fSubQty;
                        objWorkSheet.Cells[iRow, 4] = fSubAmt;
                        objWorkSheet.Cells[iRow, 6] = fSubNAmt;
                        objWorkSheet.Cells[iRow, 8] = fSubMAmt;
                        iRow++;

                        iCopy = 7;
                        copyRange = objWorkSheet.get_Range("AA" + (iCopy + ((iCount - 1) * 6)), "AK" + (iCopy + ((iCount - 1) * 6)));
                        objRange = objWorkSheet.get_Range("A" + iRow.ToString(), "K" + iRow.ToString());
                        copyRange.Copy(objRange);
                        objRange.RowHeight = 15;

                        cCol = 'A';
                        for (int iAry = 0; iAry < iCount - 1; iAry++, cCol++) ;
                        objRange = objWorkSheet.get_Range("A" + iRow.ToString(), cCol.ToString() + iRow.ToString());
                        objRange.MergeCells = true;
                        objRange.HorizontalAlignment = Excel.XlHAlign.xlHAlignLeft;

                        iCol = 1;
                        objWorkSheet.get_Range("A" + iRow.ToString(), "A" + iRow.ToString()).HorizontalAlignment = Excel.XlHAlign.xlHAlignCenter;
                        //objWorkSheet.get_Range("A" + iRow.ToString(), "J" + iRow.ToString()).Cells.Interior.Color = System.Drawing.ColorTranslator.ToOle(System.Drawing.Color.Yellow);
                        objWorkSheet.Cells[iRow, iCol] = "** " + ((aryDiv.Count > 0) ? aryDiv[iQry] : "TOTAL") + " AMOUNT **";
                        iCol += iCount;
                        objWorkSheet.Cells[iRow, iCol++] = fQty;
                        objWorkSheet.Cells[iRow, iCol++] = fCost;
                        objWorkSheet.Cells[iRow, iCol++] = fAmt;
                        objWorkSheet.Cells[iRow, iCol++] = fNCost;
                        objWorkSheet.Cells[iRow, iCol++] = fNAmt;
                        //---------------------------------------------------------------------------------------
                        //objWorkSheet.Cells[iRow, iCol++] = Math.Floor(((fAmt - fNAmt) / fAmt) * 10000) / 10000;
                        iCol++;
                        //---------------------------------------------------------------------------------------
                        objWorkSheet.Cells[iRow, iCol++] = fMAmt;
                        //objWorkSheet.Cells[iRow, iCol++] = Math.Floor(((fAmt - fMAmt) / fAmt) * 10000) / 10000;

                        iRow++;
                    }

                    #endregion  

                    #region [을지] - Remove Template.

                    copyRange = objWorkSheet.get_Range("AA" + iStart, "AK" + (iStart + (iMax * 6)));
                    copyRange.Delete(Excel.XlDeleteShiftDirection.xlShiftToLeft);

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

                    int iSheet = 3;
                    for (int iAry = 0; iAry < aryModelNo.Count; iAry++, iSheet++)
                    {
                        copyWorkSheet = (Excel.Worksheet)objWorkBook.Sheets[iSheet];
                        objWorkSheet = (Excel.Worksheet)objWorkBook.Sheets[iSheet];
                        copyWorkSheet.Copy(Type.Missing, objWorkSheet);
                        objWorkSheet = (Excel.Worksheet)objWorkBook.Sheets[iSheet];
                        //objWorkSheet.Name = aryClassName[iAry].Replace(" : ", "-");
                        objWorkSheet.Name = "내역-" + (iAry + 1);

                        objWorkSheet.Cells[2, 1] = "[ " + strName + " ]";
                        objWorkSheet.Cells[2, 4] = "[ " + aryModelName[iAry] + " ]";

                        strQuery = string.Format(@"
                            SELECT 
                                  title_div2
                                , mat_nm
                                , mat_spec
                                , item_qty
                                , est_cost
                                , est_amt
                                , mat_maker
                            FROM EM_EST_DETAIL
                            WHERE est_key = {0} AND revision = {1} AND model_seq = {2}
                            ORDER BY sort_num, title_div2 COLLATE Korean_Wansung_BIN ASC
                            ",
                            arg_est_key, arg_revision, aryModelNo[iAry]
                        );
                        objDr = (new cDBQuery(
                                    ruleQuery.INLINE,
                                    strQuery
                                )).retrieveQuery(objCon);
                        int iStart = 4, iRow = iStart;
                        string strDiv = string.Empty;
                        decimal fDiv = 0, fTotal = 0;
                        while (objDr.Read())
                        {
                            if (iRow == iStart)
                            {
                                strDiv = objDr["title_div2"].ToString();

                                copyRange = objWorkSheet.get_Range("AA301", "AF301");
                                objRange = objWorkSheet.get_Range("A" + iRow.ToString(), "F" + iRow.ToString());
                                copyRange.Copy(objRange);
                                objRange.RowHeight = 13;

                                objWorkSheet.Cells[iRow++, 1] = strDiv;
                            }
                            else if (strDiv != objDr["title_div2"].ToString())
                            {
                                copyRange = objWorkSheet.get_Range("AA303", "AF303");
                                objRange = objWorkSheet.get_Range("A" + iRow.ToString(), "F" + iRow.ToString());
                                copyRange.Copy(objRange);
                                objRange.RowHeight = 13;

                                objWorkSheet.Cells[iRow, 1] = strDiv + " TOTAL";
                                objWorkSheet.Cells[iRow++, 5] = fDiv;

                                strDiv = objDr["title_div2"].ToString();
                                fDiv = 0;

                                copyRange = objWorkSheet.get_Range("AA301", "AF301");
                                objRange = objWorkSheet.get_Range("A" + iRow.ToString(), "F" + iRow.ToString());
                                copyRange.Copy(objRange);
                                objRange.RowHeight = 13;

                                objWorkSheet.Cells[iRow++, 1] = strDiv;
                            }
                            copyRange = objWorkSheet.get_Range("AA302", "AF302");
                            objRange = objWorkSheet.get_Range("A" + iRow.ToString(), "F" + iRow.ToString());
                            copyRange.Copy(objRange);

                            objWorkSheet.Cells[iRow, 1] = objDr["mat_nm"].ToString();
                            objWorkSheet.Cells[iRow, 2] = objDr["mat_spec"].ToString();
                            objWorkSheet.Cells[iRow, 3] = Convert.ToDecimal(objDr["item_qty"]);
                            objWorkSheet.Cells[iRow, 4] = Convert.ToDecimal(objDr["est_cost"]);
                            objWorkSheet.Cells[iRow, 5] = Convert.ToDecimal(objDr["est_amt"]);
                            objWorkSheet.Cells[iRow, 6] = objDr["mat_maker"].ToString();

                            fDiv += Convert.ToDecimal(objDr["est_amt"]);
                            fTotal += Convert.ToDecimal(objDr["est_amt"]);

                            iRow++;
                        }
                        copyRange = objWorkSheet.get_Range("AA303", "AF303");
                        objRange = objWorkSheet.get_Range("A" + iRow.ToString(), "F" + iRow.ToString());
                        copyRange.Copy(objRange);
                        objRange.RowHeight = 13;

                        objWorkSheet.Cells[iRow, 1] = strDiv + " TOTAL";
                        objWorkSheet.Cells[iRow++, 5] = fDiv;

                        copyRange = objWorkSheet.get_Range("AA303", "AF303");
                        objRange = objWorkSheet.get_Range("A" + iRow.ToString(), "F" + iRow.ToString());
                        copyRange.Copy(objRange);
                        objRange.RowHeight = 15;

                        objWorkSheet.Cells[iRow, 1] = "TOTAL AMOUNT";
                        objWorkSheet.Cells[iRow, 5] = fTotal;

                        objDr.Close();

                        #region [내역] - Remove Template.

                        copyRange = objWorkSheet.get_Range("AA301", "AF310");
                        copyRange.Delete(Excel.XlDeleteShiftDirection.xlShiftToLeft);

                        #endregion
                    }

                    #endregion

                    #region [내역] - Remove Template.

                    copyWorkSheet = (Excel.Worksheet)objWorkBook.Sheets[iSheet];
                    copyWorkSheet.Visible = Excel.XlSheetVisibility.xlSheetVeryHidden;

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

                objWorkSheet = (Excel.Worksheet)objWorkBook.Sheets[1];
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
                            , A.final_amt
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
                        objWorkSheet.Cells[5, 3] = objDr["est_dt"].ToString();
                        objWorkSheet.Cells[6, 3] = objDr["cust_nm"].ToString();
                        objWorkSheet.Cells[5, 10] = objDr["est_expired"].ToString();
                        objWorkSheet.Cells[6, 10] = objDr["delivery"].ToString();
                        objWorkSheet.Cells[7, 10] = objDr["shipment"].ToString();
                        objWorkSheet.Cells[8, 10] = objDr["pay_cond"].ToString();
                        objWorkSheet.Cells[11, 1] = objDr["rmk"].ToString();
                        objWorkSheet.Cells[16, 1] = objDr["est_nm"].ToString();
                        objWorkSheet.Cells[16, 9] = Convert.ToDecimal(objDr["est_amt"]);
                        if (Convert.ToDecimal(objDr["est_amt"]) != Convert.ToDecimal(objDr["final_amt"]))
                        {
                            copyRange = objWorkSheet.get_Range("AA22", "AO22");
                            objRange = objWorkSheet.get_Range("A17", "O17");
                            copyRange.Copy(objRange);

                            objWorkSheet.Cells[17, 9] = Convert.ToDecimal(objDr["final_amt"]);
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

                    int iRow = 20;
                    for (int iAry = 0; iAry < aryModelNo.Count; iAry++)
                    {
                        copyRange = objWorkSheet.get_Range("AA24", "AO26");
                        objRange = objWorkSheet.get_Range("A" + (++iRow).ToString(), "O" + (iRow + 2).ToString());
                        copyRange.Copy(objRange);

                        objWorkSheet.Cells[iRow, 1] = (iAry + 1).ToString() + ". " + aryModelName[iAry];
                        iRow += 3;

                        strQuery = string.Format(@"
                            SELECT 
                                  title_div2
                                , mat_tnm
                                , mat_group
                                , mat_sno
                                , item_qty
                                , est_cost
                                , est_amt
                            FROM EM_EST_DETAIL
                            WHERE est_key = {0} AND revision = {1} AND model_seq = {2}
                            ORDER BY title_div2
                            ",
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
                            copyRange = objWorkSheet.get_Range("AA27", "AO27");
                            objRange = objWorkSheet.get_Range("A" + iRow.ToString(), "O" + iRow.ToString());
                            copyRange.Copy(objRange);

                            objWorkSheet.Cells[iRow, 1] = (iCell + 1).ToString();
                            objWorkSheet.Cells[iRow, 2] = objDr["mat_tnm"].ToString();
                            objWorkSheet.Cells[iRow, 5] = objDr["mat_group"].ToString();
                            objWorkSheet.Cells[iRow, 9] = objDr["mat_sno"].ToString();
                            objWorkSheet.Cells[iRow, 11] = Convert.ToDecimal(objDr["item_qty"]);
                            objWorkSheet.Cells[iRow, 13] = Convert.ToDecimal(objDr["est_cost"]);
                            objWorkSheet.Cells[iRow, 14] = Convert.ToDecimal(objDr["est_amt"]);

                            fQty += Convert.ToDecimal(objDr["item_qty"]);
                            fAmt += Convert.ToDecimal(objDr["est_amt"]);

                            iRow++; iCell++;
                        }
                        copyRange = objWorkSheet.get_Range("AA29", "AO30");
                        objRange = objWorkSheet.get_Range("A" + iRow.ToString(), "O" + (++iRow).ToString());
                        copyRange.Copy(objRange);

                        objWorkSheet.Cells[iRow, 11] = fQty;
                        objWorkSheet.Cells[iRow++, 13] = fAmt;

                        objDr.Close();
                    }

                    #endregion

                    #region [수출] - Remove Template.

                    copyRange = objWorkSheet.get_Range("AA20", "AO42");
                    copyRange.Delete(Excel.XlDeleteShiftDirection.xlShiftToLeft);

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

            objWorkSheet = (Excel.Worksheet)objWorkBook.Sheets[1];
            try
            {
                if (System.IO.File.Exists(strTarget))
                    System.IO.File.Delete(strTarget);
                objWorkSheet.SaveAs(
                                strTarget,
                                enSource,
                                varMissing, varMissing, varMissing, varMissing, varMissing, varMissing, varMissing, varMissing);

                strReturn = new JavaScriptSerializer().Serialize(
                                new entityProcessed<string>(
                                    codeProcessed.SUCCESS,
                                    strPrint)
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
            if (objExcel != null)
            {
                objExcel.Workbooks.Close();
                objExcel.Quit();
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

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
