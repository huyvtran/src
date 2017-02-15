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

public partial class JOB_SPC_2030 : System.Web.UI.Page
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
        if (DATA.getSize() <= 0)
        {
            return new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>( codeProcessed.ERR_PARAM, "잘못된 호출입니다.")
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

            //검사내역 신규 : qc_seq 생성
            if (DATA.getFirst().getQuery() == "SPC_2000_S_1"
                && DATA.getFirst().getFirst().getType() == typeQuery.INSERT)
            {
                cProcedure objProcedure = new cProcedure();
                // initialize to Call.
                objProcedure.initialize();
                try
                {
                    string strSQL = "SP_KEYGEN_PLM";
                    objProcedure.objCmd.CommandText = strSQL;
                    objProcedure.objCmd.Parameters.AddWithValue("@KeyType", "QCR");
                    objProcedure.objCmd.Parameters.Add("@NewKey", SqlDbType.VarChar, 20).Direction = ParameterDirection.Output;
                    objProcedure.objCmd.CommandType = CommandType.StoredProcedure;
                    objProcedure.objCmd.ExecuteNonQuery();
                    objProcedure.processTran(doTransaction.COMMIT);
                }
                catch (SqlException ex)
                {
                    objProcedure.processTran(doTransaction.ROLLBACK);

                    throw new Exception(
                            new JavaScriptSerializer().Serialize(
                                new entityProcessed<string>( codeProcessed.ERR_SQL
                                    , "Key를 생성할 수 없습니다.\n- " + ex.Message)
                            )
                        );
                }
                catch (Exception ex)
                {
                    objProcedure.processTran(doTransaction.ROLLBACK);

                    throw new Exception(
                            new JavaScriptSerializer().Serialize(
                                new entityProcessed<string>( codeProcessed.ERR_PROCESS
                                    , "Key 생성 중에 오류가 발생하였습니다.\n- " + ex.Message)
                            )
                        );
                }
                string strKey = objProcedure.objCmd.Parameters["@NewKey"].Value.ToString();
                DATA.setValues("qc_seq", strKey);
            }

            //자식 테이블의 Key 값 생성
            for (int iAry = 0; iAry < DATA.getSize(); iAry++)
            {
                string strID = string.Empty;
                string strKey = string.Empty;
                switch (DATA.getObject(iAry).getQuery())
                {
                    case "SPC_2000_S_2":
                        {
                            strID = "SPC_QCRESULT_D";
                            strKey = "sub_seq";
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
                                                        "SELECT dbo.FN_CREATEKEY('" + strID + "','" +
                                                            DATA.getValue(iAry, iRow, "qc_seq") + "')"
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
                                            new entityProcessed<string>( codeProcessed.ERR_SQL,
                                                    "Key를 생성할 수 없습니다.\n- " + ex.Message)
                                        )
                                    );
                            }
                            catch (Exception ex)
                            {
                                throw new Exception(
                                        new JavaScriptSerializer().Serialize(
                                            new entityProcessed<string>( codeProcessed.ERR_PROCESS,
                                                    "Key 생성 중에 오류가 발생하였습니다.\n- " + ex.Message)
                                        )
                                    );
                            }
                        }
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

        string arg_issue_no = DATA.getArgument("arg_issue_no");
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

            string strRoot = HttpContext.Current.Server.MapPath("~/");
            string strSource = strRoot + "Report/" + strPage + "/" + strPage + ".xls";
            string strTarget = strRoot + "Report/" + strPage + "/" + strPage + "_" + arg_issue_no;
            string strPrint = strPage + "_" + arg_issue_no + "." + strType;

            object objMissing = Type.Missing;
            object varMissing = System.Reflection.Missing.Value;
            Excel._Workbook objWorkBook;
            Excel._Worksheet objWorkSheet;
            Excel.Range objRange;
            Excel.XlFixedFormatType enTarget = Excel.XlFixedFormatType.xlTypePDF;
            Excel.XlFixedFormatQuality enQuality = Excel.XlFixedFormatQuality.xlQualityStandard;
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
                objWorkSheet = (Excel.Worksheet)objWorkBook.Sheets[1];
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
                string strQuery = string.Format(@"
                    SELECT 
                          A.issue_no
                        , A.ins_dt
                        , B.prod_cd
                        , B.prod_nm
                        , B.prod_sno
                        , A.prod_sub
                        , dbo.to_format(A.issue_dt,'CTOD') AS issue_dt
                        , dbo.fn_getName('USER_NAME','',A.ins_usr) AS ins_usr
                        , dbo.fn_getName('사원명','',A.aemp) AS aemp
                    FROM AS_ISSUE A
                    INNER JOIN V_PROD_AS B ON B.prod_key = A.prod_key
                    WHERE A.issue_no = '{0}'
                    ",
                    arg_issue_no
                );
                objDr = (new cDBQuery(
                            ruleQuery.INLINE,
                            strQuery
                        )).retrieveQuery(objCon);
                if (objDr.Read())
                {
                    #region set Data.

                    objWorkSheet.Cells[8, 4] = objDr["issue_no"].ToString();
                    objWorkSheet.Cells[8, 11] = objDr["ins_dt"].ToString();
                    objWorkSheet.Cells[10, 4] = objDr["prod_cd"].ToString();
                    objWorkSheet.Cells[10, 8] = objDr["prod_nm"].ToString();
                    objWorkSheet.Cells[10, 12] = objDr["prod_sno"].ToString();
                    objWorkSheet.Cells[11, 4] = objDr["issue_dt"].ToString();
                    objWorkSheet.Cells[11, 8] = objDr["ins_usr"].ToString();
                    objWorkSheet.Cells[11, 12] = objDr["aemp"].ToString();
                    objWorkSheet.Cells[11, 15] = objDr["prod_sub"].ToString();

                    #endregion
                }
                else
                    throw new Exception
                        ("해당 데이터를 찾을 수 없습니다.");
                objDr.Close();

                strQuery = string.Format(@"
                    SELECT 
                          dbo.fn_getName('ZCODE','IEHM21',A.status_tp1) + ' : '
                          + dbo.fn_getName('ZCODE','IEHM31',A.status_tp2) AS status_tp
                        , dbo.fn_getName('ZCODE','IEHM22',A.part_tp1) + ' : ' 
                          + dbo.fn_getName('ZCODE','IEHM32',A.part_tp2) AS part_tp
                        , dbo.fn_getName('ZCODE','IEHM23',A.reason_tp1) + ' : ' 
                          + dbo.fn_getName('ZCODE','IEHM33',A.reason_tp2) AS reason_tp
                        , dbo.fn_getName('ZCODE','IEHM25',A.duty_tp1) + ' : ' 
                          + dbo.fn_getName('ZCODE','IEHM35',A.duty_tp2) AS duty_tp
                    FROM AS_ISSUE_D A
                    WHERE A.issue_no = '{0}'
                    AND A.issue_seq = 1
                    ",
                    arg_issue_no
                );
                objDr = (new cDBQuery(
                            ruleQuery.INLINE,
                            strQuery
                        )).retrieveQuery(objCon);
                if (objDr.Read())
                {
                    #region set Data.

                    objWorkSheet.Cells[12, 5] =
                        (objDr["status_tp"].ToString() == " : ") ? "" : objDr["status_tp"].ToString();
                    objWorkSheet.Cells[13, 5] =
                        (objDr["part_tp"].ToString() == " : ") ? "" : objDr["part_tp"].ToString();
                    objWorkSheet.Cells[12, 12] =
                        (objDr["reason_tp"].ToString() == " : ") ? "" : objDr["reason_tp"].ToString();
                    objWorkSheet.Cells[13, 12] =
                        (objDr["duty_tp"].ToString() == " : ") ? "" : objDr["duty_tp"].ToString();

                    #endregion
                }
                else
                    throw new Exception
                        ("해당 데이터를 찾을 수 없습니다.");
                objDr.Close();

                strQuery = string.Format(@"
                    SELECT 
                          A.apart_cd + ' : ' + A.apart_nm + ' : ' + A.apart_sno AS part
                    FROM AS_ISSUE_P A
                    WHERE A.issue_no = '{0}'
                    AND A.apart_nm > ' '
                    ORDER BY A.change_dt
                    ",
                    arg_issue_no
                );
                string strText = string.Empty;
                objDr = (new cDBQuery(
                            ruleQuery.INLINE,
                            strQuery
                        )).retrieveQuery(objCon);
                int iRow = 0;
                while (objDr.Read())
                {
                    strText += ((iRow > 0) ? "\n" : "");
                    strText += objDr["part"].ToString();
                    iRow++;
                }
                objDr.Close();

                #region set Data.

                objWorkSheet.Cells[14, 4] = strText;

                #endregion

                strQuery = string.Format(@"
                    SELECT 
                          A.rmk_text
                    FROM AS_ISSUE_RMK A
                    WHERE A.issue_no = '{0}'
                    AND A.rmk_cd = 'STATUS'
                    ",
                    arg_issue_no
                );
                objDr = (new cDBQuery(
                            ruleQuery.INLINE,
                            strQuery
                        )).retrieveQuery(objCon);
                if (objDr.Read())
                {
                    #region set Data.

                    objWorkSheet.Cells[17, 3] = objDr["rmk_text"].ToString().Replace("\r\n", "\n");

                    #endregion
                }
                else
                    throw new Exception
                        ("해당 데이터를 찾을 수 없습니다.");
                objDr.Close();

                strQuery = string.Format(@"
                    SELECT 
                          A.rmk_text
                    FROM AS_ISSUE_RMK A
                    WHERE A.issue_no = '{0}'
                    AND A.rmk_cd = 'WORK'
                    ",
                    arg_issue_no
                );
                objDr = (new cDBQuery(
                            ruleQuery.INLINE,
                            strQuery
                        )).retrieveQuery(objCon);
                if (objDr.Read())
                {
                    #region set Data.

                    objWorkSheet.Cells[25, 3] = objDr["rmk_text"].ToString().Replace("\r\n", "\n");

                    #endregion
                }
                else
                    throw new Exception
                        ("해당 데이터를 찾을 수 없습니다.");
                objDr.Close();

                strQuery = string.Format(@"
                    SELECT 
                          '<' + dbo.to_format(work_dt,'CTOD')
                          + '> ' + dbo.fn_getName('ZCODE','IEHM24',work_tp1)
                          + ' : ' + dbo.fn_getName('ZCODE','IEHM34',work_tp2)
                          + case when work_man1 > ' ' then '  (작업자 : ' + work_man1 + ')' else '' end AS work
                    FROM AS_ISSUE_W A
                    WHERE A.issue_no = '{0}'
                    ORDER BY A.work_dt
                    ",
                    arg_issue_no
                );
                strText = string.Empty;
                objDr = (new cDBQuery(
                            ruleQuery.INLINE,
                            strQuery
                        )).retrieveQuery(objCon);
                iRow = 0;
                while (objDr.Read())
                {
                    strText += ((iRow > 0) ? "\n" : "");
                    strText += objDr["work"].ToString();
                    iRow++;
                }
                objDr.Close();

                #region set Data.

                objWorkSheet.Cells[34, 4] = strText;

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
                if (System.IO.File.Exists(strTarget))
                    System.IO.File.Delete(strTarget);

                if (System.IO.File.Exists(strTarget + "." + strType))
                    System.IO.File.Delete(strTarget + "." + strType);
                objWorkSheet.ExportAsFixedFormat(
                                enTarget,
                                strTarget,
                                enQuality,
                                true,
                                true,
                                1,
                                5,
                                false,
                                varMissing);

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
