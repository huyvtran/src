using System;
using System.Collections.Generic;
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
using System.Reflection;
using Microsoft.Reporting.WebForms;

public partial class Job_SRM_9900 : System.Web.UI.Page
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
    /// 

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

            string sFileIdSrc = (strTitle == "납품서") ? "DeliveryS" : "ItemLabelA";
            string sFileIdTrg = sFileIdSrc + "_" + strUser + "_" + strKey;
            string sFileNmTrg = sFileIdTrg + "." + strPrint;
            string strRoot = HttpContext.Current.Server.MapPath("~/");
            string strSource = strRoot + "Report/" + strPage + "/" + sFileIdSrc + ".xls";
            string strTarget = strRoot + "Report/" + strPage + "/" + sFileIdTrg;

            #endregion

            #region process Query & set to Print.

            try
            {
                objCmd.CommandText = strBody;
                objDr = objCmd.ExecuteReader();

                
                // Barcode Label Print Sample
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

