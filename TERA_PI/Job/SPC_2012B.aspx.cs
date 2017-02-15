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
using System.IO;
using System.Data.OleDb;

public partial class Job_SPC_2012B : System.Web.UI.Page
{
    string strData = string.Empty;

    protected void Page_Load(object sender, EventArgs e)
    {
    }
    protected void ctlUpload_FileUploadComplete(object sender, DevExpress.Web.FileUploadCompleteEventArgs e)
    {
        #region 1. Mapping Argument.

        // 1. Mapping Argument.
        //
        /*
        NameValueCollection lstParam = Request.QueryString;
        if (string.IsNullOrEmpty(lstParam["DATA_TYPE"]))
        {
            throw new Exception("처리할 데이터 종류를 확인할 수 없습니다.");
        }
        strData = lstParam["DATA_TYPE"].ToString();
        */
        strData = "SPC_QCRESULT";

        string strName = e.UploadedFile.FileName;
        string[] strFile = strName.Split('.');
        string strType = (strFile.Length > 1) ? strFile[strFile.Length - 1] : string.Empty;
        string strID = strData +
                        "-" + String.Format("{0:yyyyMMdd-HHmmss}", DateTime.Now);
        string strPath = Server.MapPath("~/Import/") + strID + "." + strType;

        #endregion

        #region 2. Save File.

        // 2. Save File.
        //
        try
        {
            e.UploadedFile.SaveAs(strPath);

            OleDbConnection oleCon = null;

            #region Open Excel & Get Environment.

            DataTable objSheet = new DataTable();
            // Open Excel & Get Environment.
            //
            try
            {
                #region Connect to OLE & Get Names of Sheets.

                // Connect to OLE.
                //
                string strProvider =
                    "Provider=Microsoft.Jet.OLEDB.4.0; Data Source=" + strPath + "; Extended Properties=\"Excel 8.0; IMEX=1;\"";
                //"Provider=Microsoft.ACE.OLEDB.12.0; Data Source=" + strSave + "; Extended Properties=Excel 12.0";
                oleCon = new OleDbConnection(strProvider);
                oleCon.Open();

                // Get Names of Sheets.
                //
                objSheet = oleCon.GetOleDbSchemaTable(OleDbSchemaGuid.Tables, null);
                if (objSheet == null)
                    throw new Exception("Sheet 정보를 확인할 수 없습니다.");
                string strSheet = string.Empty;
                string strTable = string.Empty;
                for (int iAry = 0; iAry < objSheet.Rows.Count; iAry++)
                {
                    strTable = objSheet.Rows[iAry]["TABLE_NAME"].ToString().Trim('\'').Replace("$", "");
                    if (!strTable.Contains("Print") && !strTable.EndsWith("_"))
                        strSheet += (((iAry == 0) ? "" : ",") + strTable);
                }

                #endregion

                e.CallbackData = strID + "@" + strName + "@" + strType + "@" + strPath + "@" + strSheet;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                // release.
                //
                objSheet.Dispose();
                if (oleCon != null) oleCon.Close();
            }

            #endregion
        }
        catch (Exception ex)
        {
            throw ex;
        }
        finally
        {
        }

        #endregion
    }

    #region Import() : Import Excel Data

    /// <summary>
    /// Import() : Import Excel Data
    ///     : Get Excel Data and Save to Temporary DB
    ///     input : 
    ///         - DATA - Client Data (cSaveData)
    ///     output:
    ///         - success : Key List (cSavedData)
    ///         - else : entityProcessed (string)
    /// </summary>
    [WebMethod]
    public static string Import(cImportData DATA)
    {
        #region check Argument.

        // check Argument.
        //
        if (!DATA.validData())
        {
            return new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                                codeProcessed.ERR_PARAM,
                                "잘못된 호출입니다.")
                    );
        }

        #endregion

        string strReturn = string.Empty;

        #region Read Data from Excel & Save to Temporary DB.

        // Read Data from Excel
        //  & Save to Temporary DB.
        //
        try
        {
            OleDbConnection oleCon = null;
            OleDbDataReader oleDr = null;
            cUpdate objUpdate = new cUpdate();
            int iRow = 0, iNum = 1;
            try
            {
                #region Connect to OLE & Get Names of Sheets.

                // Connect to OLE.
                //
                string strProvider =
                    "Provider=Microsoft.Jet.OLEDB.4.0; Data Source=" + DATA.getPath() + "; Extended Properties=\"Excel 8.0; IMEX=1;\"";
                //"Provider=Microsoft.ACE.OLEDB.12.0; Data Source=" + strSave + "; Extended Properties=Excel 12.0";
                oleCon = new OleDbConnection(strProvider);
                oleCon.Open();

                #endregion

                #region Connect to DB & Open Transaction.

                // Connect to DB & Open Transaction.
                //
                objUpdate.initialize(false);
                objUpdate.beginTran();

                #endregion

                #region Read Data from Excel & Save.

                // Read Data from Excel & Save.
                //
                    // select data from excel.
                string strSQL = "SELECT * FROM [" + DATA.getSheet() + "$]";
                OleDbCommand oleCmd = new OleDbCommand(strSQL, oleCon);
                oleDr = oleCmd.ExecuteReader(CommandBehavior.CloseConnection);
                if (!oleDr.HasRows)
                {
                    throw new Exception("Sheet에 읽을 데이터가 없습니다.");
                }

                    // delete existed data.
                string strQuery = string.Format(@" DELETE FROM EXCEL_EM_MODEL
                    WHERE FILE_ID = '{0}' AND SHEET_NM = '{1}'",
                    DATA.getKey(),
                    DATA.getSheet());
                new cDBQuery(ruleQuery.INLINE, strQuery)
                    .executeQuery(objUpdate.objCmd, true);
                strQuery = string.Format(@"
                    DELETE FROM EXCEL_EM_MODEL_ITEM
                    WHERE FILE_ID = '{0}' AND SHEET_NM = '{1}'",
                    DATA.getKey(),
                    DATA.getSheet());
                new cDBQuery(ruleQuery.INLINE, strQuery)
                    .executeQuery(objUpdate.objCmd, true);

                    // read and update data.
                string sColsM = "FILE_ID, SHEET_NM, SUPP_CD, SUPP_NM, PART_CD, PART_NM, MODEL_NM, QC_DATE, PROJ_NO, QC_CHARGE, INS_USR, INS_DT";
                string sColsD = "FILE_ID, SHEET_NM, SEQ, QCITEM_CD, QCITEM_NM, SUB_SEQ, SER_NO, QC_VALUE, QC_INPUT, INS_USR, INS_DT";
                string sValsM = "'" + DATA.getKey() + "', '" + DATA.getSheet() + "'";
                
                string strUser = "";
                string strDate = DateTime.Now.ToShortDateString();
                string sQcItemCode = "";
                string sQcItemName = "";
                int nSubSeq = 0;

                while (oleDr.Read())
                {
                    #region Save to Temporary DB.

                    // Save to Temporary DB.
                    #region Master Table Insert 용 Value String 작성
                    //"FILE_ID, SHEET_NM, SUPP_CD, SUPP_NM, PART_CD, PART_NM, MODEL_NM, QC_DATE, PROJ_NO, QC_CHARGE, INS_USR, INS_DT"
                    if (iRow == 0) //업체코드
                        sValsM = sValsM + ",'" + getDbString(oleDr[1]) + "'";
                    if (iRow == 1) //업체명
                        sValsM = sValsM + ",'" + getDbString(oleDr[1]) + "'";
                    if (iRow == 2) //Part No
                        sValsM = sValsM + ",'" + getDbString(oleDr[1]) + "'";
                    if (iRow == 3) //Part Name
                        sValsM = sValsM + ",'" + getDbString(oleDr[1]) + "'";
                    if (iRow == 4) //Model
                        sValsM = sValsM + ",'" + getDbString(oleDr[1]) + "'";
                    if (iRow == 5) //검사일
                        sValsM = sValsM + ",'" + getDbString(oleDr[1]) + "'";
                    if (iRow == 6) //Project No.
                        sValsM = sValsM + ",'" + getDbString(oleDr[1]) + "'";
                    if (iRow == 7) //측정자
                        sValsM = sValsM + ",'" + getDbString(oleDr[1]) + "'";
                    #endregion

                    #region Master Table Insert
                    if (iRow == 7)
                    {
                        sValsM = sValsM +
                            ",'" + strUser + "'" +
                            ",'" + strDate + "'";
                        strQuery = string.Format(
                            "INSERT INTO dbo.EXCEL_SPC_QCRESULT ({0}) VALUES ({1})"
                            , sColsM, sValsM);
                        new cDBQuery(ruleQuery.INLINE, strQuery).executeQuery(objUpdate.objCmd, false);
                    }
                    #endregion

                    #region Detail Table Insert
                    if (iRow > 0 && !string.IsNullOrEmpty(oleDr[5].ToString().Trim()))
                    {
                        string sValsD = "'" + DATA.getKey() + "', '" + DATA.getSheet() + "'";
                        // 검사항목코드 및 명칭 반복
                        if (!string.IsNullOrEmpty(oleDr[3].ToString().Trim()))
                        {
                            nSubSeq = 0;
                            sQcItemCode = getDbString(oleDr[3]);
                        }
                        if (!string.IsNullOrEmpty(oleDr[4].ToString().Trim())) sQcItemName = getDbString(oleDr[4]);
                        nSubSeq++;
                        sValsD += "," + iNum.ToString()
                            + ",'" + sQcItemCode + "'"
                            + ",'" + sQcItemName + "'"
                            + "," + nSubSeq.ToString()
                            + ",'" + getDbString(oleDr[6]) + "'"
                            + "," + Convert.ToDecimal(string.IsNullOrEmpty(oleDr[7].ToString()) ? 0.0 : oleDr[7])
                            + ",'" + getDbString(oleDr[8]) + "'"
                            + ",'" + strUser + "'"
                            + ",'" + strDate + "'";
                        strQuery = string.Format(
                                        "INSERT INTO dbo.EXCEL_SPC_QCRESULT_D ({0}) VALUES ({1})", sColsD, sValsD);
                        new cDBQuery(ruleQuery.INLINE, strQuery).executeQuery(objUpdate.objCmd, false);

                        iNum++;
                    }
                    #endregion
                    //getDbCodeByName(oleDr, objUpdate);
                    if (iRow > 0 && string.IsNullOrEmpty(oleDr[5].ToString().Trim())) break;
                    iRow++;

                    #endregion
                }

                objUpdate.close(doTransaction.COMMIT);
                strReturn = new JavaScriptSerializer().Serialize(
                                new entityProcessed<string>( codeProcessed.SUCCESS, "success")
                            );

                #endregion
            }
            catch (SqlException ex)
            {
                // abnormal Closing.
                //
                objUpdate.close(doTransaction.ROLLBACK);

                throw new Exception(
                        new JavaScriptSerializer().Serialize(
                            new entityProcessed<string>( codeProcessed.ERR_SQL,
                                "데이터 저장에 실패하였습니다. (" + iRow + 2 + "행)\n- " + ex.Message)
                            )
                        );
            }
            catch (Exception ex)
            {
                // abnormal Closing.
                //
                objUpdate.close(doTransaction.ROLLBACK);

                throw new Exception(
                        new JavaScriptSerializer().Serialize(
                            new entityProcessed<string>( codeProcessed.ERR_PROCESS,
                                "데이터 저장 중에 오류가 발생하였습니다.\n- " + ex.Message)
                            )
                        );
            }
            finally
            {
                // release.
                //
                if (oleDr != null) { oleDr.Close(); oleDr.Dispose(); }
                if (oleCon != null) oleCon.Close();
                objUpdate.release();
            }
        }
        catch (Exception ex)
        { strReturn = ex.Message; }
        finally
        { }

        #endregion

        return strReturn;
    }

    private static void getDbCodeByName(OleDbDataReader oleDr, cUpdate objUpdate)
    {
        // get code data.
        string strName = getDbString(oleDr[3]);
        string strCode = string.Empty;
        string sQuery = string.Format(@"
                                        SELECT CUST_CD FROM EM_CUST_INFO
                                        WHERE UPPER(REPLACE(CUST_NAME, ' ', '')) = UPPER(REPLACE('{0}', ' ', ''))",
            strName);
        objUpdate.objDr = (new cDBQuery(ruleQuery.INLINE, sQuery)).retrieveQuery(objUpdate.objCmd);
        if (objUpdate.objDr.Read()) strCode = objUpdate.objDr[0].ToString();
        objUpdate.objDr.Close();
    }

    private static string getDbString(object oleDrCol)
    {
        return oleDrCol.ToString().Trim().Replace("'", "''");
    }

    #endregion
}
