using DevExpress.Spreadsheet;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Services;
using Excel = Microsoft.Office.Interop.Excel;

public partial class Job_SRM_1012 : System.Web.UI.Page
{

    protected static SqlConnection objCon = null;
    protected static SqlCommand objCmd = null;
    protected static SqlDataReader objDr = null;

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
            if (DATA.getFirst().getQuery() == "SRM_1012_1"
                && DATA.getFirst().getFirst().getType() == typeQuery.INSERT)
            {
                cProcedure objProcedure = new cProcedure();
                // initialize to Call.
                //
                objProcedure.initialize();
                try
                {
                    string strSQL = "SP_KEYGEN_PLM";
                    objProcedure.objCmd.CommandText = strSQL;
                    objProcedure.objCmd.Parameters.AddWithValue("@KeyType", "PER");
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
                                new entityProcessed<string>(
                                        codeProcessed.ERR_SQL,
                                        "Key를 생성할 수 없습니다.\n- " + ex.Message)
                            )
                        );
                }
                catch (Exception ex)
                {
                    objProcedure.processTran(doTransaction.ROLLBACK);

                    throw new Exception(
                            new JavaScriptSerializer().Serialize(
                                new entityProcessed<string>(
                                        codeProcessed.ERR_PROCESS,
                                        "Key 생성 중에 오류가 발생하였습니다.\n- " + ex.Message)
                            )
                        );
                }
                string strKey = objProcedure.objCmd.Parameters["@NewKey"].Value.ToString();
                DATA.setValues("per_no", strKey);
            }
            //---------------------------------------------------------------------------
            //하위 grid 및 form을 저장하는 로직을 첨부해야한다.
            for (int iAry = 0; iAry < DATA.getSize(); iAry++)
            {
                string strID = string.Empty;
                string strKey = string.Empty;
                switch (DATA.getObject(iAry).getQuery())
                {
                    case "SRM_1012_2":
                        {
                            strID = "PER_ITEM";
                            strKey = "item_seq";
                        }
                        break;
                    case "SRM_1012_3":
                        {
                            strID = "PER_SUPP";
                            strKey = "supp_seq";
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
                                                            DATA.getValue(iAry, iRow, "per_no") + "')"
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
                        DATA.setValue(iAry, iRow, strKey, Convert.ToString(iKey++));
                    }
                }
            }

            //---------------------------------------------------------------------------

            #endregion

            #region process Saving

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
    public static string Print(cRetrieveData DATA)
    {

        string strReturn = string.Empty;
        try
        {
            #region connect to DB.

            //  connect to DB.
            //
            try
            {
                objCon = new SqlConnection(ConfigurationManager.ConnectionStrings["PLMDB"].ConnectionString);
                objCon.Open();
                objCmd = new SqlCommand("", objCon);
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

            string strPrint = DATA.getOption("PRINT");
            string strPage = DATA.getOption("PAGE");
            string strUser = DATA.getOption("USER");

            string sFileIdSrc = strPage;
            string sFileIdTrg = sFileIdSrc + "_" + strUser;
            string sFileNmTrg = sFileIdTrg + "." + strPrint;
            string strRoot = HttpContext.Current.Server.MapPath("~/");
            string strSource = strRoot + "Report/" + strPage + "/" + sFileIdSrc + ".xlsx";
            string strTarget = strRoot + "Report/" + strPage + "/" + sFileIdTrg;
            object objMissing = Type.Missing;
            object varMissing = System.Reflection.Missing.Value;

            Workbook objWorkBook;
            Worksheet objWorkSheet, copyWorkSheet;

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
                int iItemCnt = Convert.ToInt16(DATA.getOption("ITEM_CNT"));
                int iSheetIdx = (iItemCnt > 15 ? 1 : 0);

                copyWorkSheet = objWorkBook.Worksheets[iSheetIdx];
                objWorkSheet = objWorkBook.Worksheets[objWorkBook.Worksheets.Count - 1];
                //copyWorkSheet.Copy(Type.Missing, objWorkSheet);
                objWorkBook.Worksheets.Add();
                objWorkBook.Worksheets[objWorkBook.Worksheets.Count - 1].CopyFrom(copyWorkSheet);
                objWorkSheet = objWorkBook.Worksheets[objWorkBook.Worksheets.Count - 1];

                #region 수신/발신자

                objWorkSheet.Cells["D4"].Value = DATA.getOption("PER_NO");
                objWorkSheet.Cells["D5"].Value = DATA.getOption("SUPP_NM");
                objWorkSheet.Cells["D6"].Value = DATA.getOption("SUPP_MAN");
                objWorkSheet.Cells["D7"].Value = DATA.getOption("SUPP_TEL");
                objWorkSheet.Cells["D8"].Value = DATA.getOption("SUPP_FAX");
                objWorkSheet.Cells["D9"].Value = DATA.getOption("SUPP_EMAIL");

                objWorkSheet.Cells["K4"].Value = DATA.getOption("PER_DATE");
                objWorkSheet.Cells["K5"].Value = DATA.getOption("PER_COMP");
                objWorkSheet.Cells["K6"].Value = DATA.getOption("PER_MAN");
                objWorkSheet.Cells["K7"].Value = DATA.getOption("PER_TEL");
                objWorkSheet.Cells["K8"].Value = DATA.getOption("PER_FAX");
                objWorkSheet.Cells["K9"].Value = DATA.getOption("PER_EMAIL");
                objWorkSheet.Cells["K10"].Value = DATA.getOption("CLOSE_DATE");

                #endregion

                #region 견적의뢰 품목

                entityNameValue objArg = new entityNameValue(true);
                objArg.Add("arg_per_no", DATA.getOption("PER_NO"));
                objCmd.CommandText = getQuery("SRM_1012_2", objArg);
                objDr = objCmd.ExecuteReader();
                int iRow = 13, iCnt = 1, iSubCnt = 0;
                while (objDr.Read())
                {
                    objWorkSheet.Cells["B" + iRow.ToString()].Value = iCnt;                             // No.
                    objWorkSheet.Cells["C" + iRow.ToString()].Value = objDr["item_cd"].ToString();      // 품번
                    objWorkSheet.Cells["D" + iRow.ToString()].Value = objDr["item_nm"].ToString();      // 품명
                    objWorkSheet.Cells["E" + iRow.ToString()].Value = objDr["item_spec"].ToString();    // 규격
                    objWorkSheet.Cells["F" + iRow.ToString()].Value = objDr["prc_cd"].ToString();       // 공정
                    objWorkSheet.Cells["G" + iRow.ToString()].Value = objDr["uom"].ToString();          // 단위
                    objWorkSheet.Cells["H" + iRow.ToString()].Value = objDr["qty"].ToString();          // 수량
                    objWorkSheet.Cells["I" + iRow.ToString()].Value = objDr["dlvr_date"].ToString();    // 납기요청일
                    objWorkSheet.Cells["J" + iRow.ToString()].Value = objDr["proj_no"].ToString();      // 프로젝트 번호
                    objWorkSheet.Cells["K" + iRow.ToString()].Value = objDr["pr_man"].ToString();       // 담당자
                    objWorkSheet.Cells["L" + iRow.ToString()].Value = objDr["item_rmk"].ToString();     // 비고

                    if (iCnt == 20)
                    {
                        iRow = 2;
                        iSheetIdx = (iItemCnt - iCnt > 25 ? 2 : 3);
                        copyWorkSheet = objWorkBook.Worksheets[iSheetIdx];
                        objWorkSheet = objWorkBook.Worksheets[objWorkBook.Worksheets.Count - 1];
                        //copyWorkSheet.Copy(Type.Missing, objWorkSheet);
                        objWorkBook.Worksheets.Add();
                        objWorkBook.Worksheets[objWorkBook.Worksheets.Count - 1].CopyFrom(copyWorkSheet);
                        objWorkSheet = objWorkBook.Worksheets[objWorkBook.Worksheets.Count - 1];
                    }
                    else if (iCnt > 20)
                    {
                        iSubCnt++;
                        if (iSubCnt % 30 == 0)
                        {
                            iRow = 2;
                            iSheetIdx = (iItemCnt - iCnt > 25 ? 2 : 3);
                            copyWorkSheet = objWorkBook.Worksheets[iSheetIdx];
                            objWorkSheet = objWorkBook.Worksheets[objWorkBook.Worksheets.Count - 1];
                            //copyWorkSheet.Copy(Type.Missing, objWorkSheet);
                            objWorkBook.Worksheets.Add();
                            objWorkBook.Worksheets[objWorkBook.Worksheets.Count - 1].CopyFrom(copyWorkSheet);
                            objWorkSheet = objWorkBook.Worksheets[objWorkBook.Worksheets.Count - 1];
                        }
                    }
                    iCnt++;
                    iRow++;

                }

                iRow = 0;
                switch (iSheetIdx)
                {
                    case 0:
                        if (iItemCnt < 15) iRow = iItemCnt + 13;
                        break;
                    case 1:
                        if (iItemCnt < 20) iRow = iItemCnt + 13;
                        break;
                    case 2:
                        if ((iItemCnt - 20) % 30 > 0) iRow = ((iItemCnt - 20) % 30) + 3;
                        break;
                    case 3:
                        if ((iItemCnt - 20) % 30 < 25) iRow = ((iItemCnt - 20) % 30) + 3;
                        break;
                }
                if (iRow > 0)
                {
                    objWorkSheet.Cells["E" + iRow.ToString()].Value = "- 이하여백 -";
                    objWorkSheet.Range["E" + iRow.ToString() + ":E" + iRow.ToString()].Alignment.Horizontal = SpreadsheetHorizontalAlignment.Center;
                }

                if (iItemCnt > 15 && iSheetIdx != 3)
                {
                    copyWorkSheet = objWorkBook.Worksheets[3];
                    objWorkSheet = objWorkBook.Worksheets[objWorkBook.Worksheets.Count - 1];
                    //copyWorkSheet.Copy(Type.Missing, objWorkSheet);
                    objWorkBook.Worksheets.Add();
                    objWorkBook.Worksheets[objWorkBook.Worksheets.Count - 1].CopyFrom(copyWorkSheet);
                    objWorkSheet = objWorkBook.Worksheets[objWorkBook.Worksheets.Count - 1];
                    objWorkSheet.Cells["E4"].Value = "- 이하여백 -";
                    objWorkSheet.Range["E4:E4"].Alignment.Horizontal = SpreadsheetHorizontalAlignment.Center;
                }

                #endregion

                #region 비고

                objWorkSheet.Cells["B30"].Value = DATA.getOption("RMK1");
                objWorkSheet.Cells["H30"].Value = DATA.getOption("RMK2");

                #endregion

                #region Delete Template

                // 양식 sheet 4개 삭제
                //objWorkSheet = objWorkBook.Worksheets[0];
                //objWorkSheet.Delete();
                //objWorkSheet = objWorkBook.Worksheets[0];
                //objWorkSheet.Delete();
                //objWorkSheet = objWorkBook.Worksheets[0];
                //objWorkSheet.Delete();
                //objWorkSheet = objWorkBook.Worksheets[0];
                //objWorkSheet.Delete();

                objWorkBook.Worksheets.RemoveAt(0);
                objWorkBook.Worksheets.RemoveAt(0);
                objWorkBook.Worksheets.RemoveAt(0);
                objWorkBook.Worksheets.RemoveAt(0);

                //인쇄 시작할 sheet 선택
                objWorkSheet = objWorkBook.Worksheets[0];

                #endregion

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
                objWorkBook.SaveDocument(strTarget + ".xlsx", DevExpress.Spreadsheet.DocumentFormat.Xlsx);
                objWorkBook.Dispose();
                strReturn = new JavaScriptSerializer().Serialize(
                                new entityProcessed<string>(codeProcessed.SUCCESS, sFileNmTrg)
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

    protected static string getQuery(string strQueryID, entityNameValue objArgs)
    {
        #region get Query from DB.

        string strSQL = string.Empty;
        string strBody = string.Empty;
        string strZQuery = "SELECT qry_sel AS QUERY_SELECT FROM ZQUERY WHERE qry_id = '{0}'";

        strSQL = string.Format(@strZQuery, strQueryID);

        using (SqlConnection objCon = new SqlConnection(ConfigurationManager.ConnectionStrings["PLMDB"].ConnectionString))
        using (SqlCommand objCmd = new SqlCommand(strSQL, objCon))
        {
            objCon.Open();

            try
            {
                using (SqlDataReader dr = objCmd.ExecuteReader())
                {
                    if (dr.Read())
                    {
                        strBody = dr["QUERY_SELECT"].ToString();
                    }
                    else
                    {
                        throw new Exception(
                            "관련 Query를 찾을 수 없습니다.");
                    }
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

            objCon.Close();
        }

        #endregion

        #region bind Argument to Query.

        bindArg(strQueryID, ref strBody, objArgs);

        #endregion

        return strBody;

    }

    protected static void bindArg(string strQueryID, ref string strBody, entityNameValue objArgs)
    {

        #region create Query.

        string strSQL = string.Empty;
        string strZArg = "SELECT arg_id AS ARG_ID, arg_tp AS ARG_TYPE, arg_qry AS ARG_QUERY FROM ZQUERY_ARG WHERE qry_id = '{0}'";
        Hashtable tblSelect = new Hashtable();

        if (objArgs.getSize() > 0)
        {
            #region get Argument from DB.

            strSQL = string.Format(@strZArg, strQueryID);
            using (SqlConnection objCon = new SqlConnection(ConfigurationManager.ConnectionStrings["PLMDB"].ConnectionString))
            using (SqlCommand objCmd = new SqlCommand(strSQL, objCon))
            {
                objCon.Open();

                try
                {

                    using (SqlDataReader dr = objCmd.ExecuteReader())
                    {
                        while (dr.Read())
                        {
                            tblSelect.Add(
                                dr["ARG_ID"].ToString(),
                                new cDBArgument(
                                    dr["ARG_TYPE"].ToString(),
                                    dr["ARG_QUERY"].ToString())
                                );
                        }

                    }

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


                objCon.Close();
            }


            #endregion

            #region bind Argument to Query.

            try
            {
                for (int iAry = 0; iAry < objArgs.getSize(); iAry++)
                {
                    string strArg = objArgs.NAME[iAry];
                    cDBArgument objArg = (cDBArgument)tblSelect[strArg];
                    if (objArg == null)
                    {
                        throw new Exception(
                            strArg + " - 관련 Argument를 찾을 수 없습니다.");
                    }
                    strBody = objArg.convertWhere(
                                        strBody,
                                        strQueryID,
                                        strArg,
                                        HttpUtility.UrlDecode(objArgs.getValue(strArg))
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

    }

    protected static void setSheetName(ref Worksheet _objSheet, string _name)
    {
        int iName = 0;
        string strNewName = _name;

        while (true)
        {
            try
            {
                _objSheet.Name = strNewName;
                break;
            }
            catch (Exception e)
            {
                strNewName = string.Format("{0} ({1})", _name, ++iName);
            }
        }
    }

    #endregion

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

