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
using Excel = Microsoft.Office.Interop.Excel;
using System.Reflection;
using System.IO;
using Microsoft.Office.Core;
using Microsoft.Reporting.WebForms;

public partial class Job_SRM_4110_P : System.Web.UI.Page
{
    private string strDlvNo = string.Empty;
    private string strDlvSeq = string.Empty;

    protected void Page_Init(object sender, EventArgs e)
    {
        strDlvNo = Page.Request["dlv_no"].Trim();
//        strDlvSeq = Page.Request["dlv_seq"].Trim();

        ReportCreator(new DataSet1(), ReportViewer1, "Report.rdlc", "DataSet1");
    }

    private void ReportCreator(DataSet _dataSet, ReportViewer _reportViewer, string _ReportName, string _ReportDataSourceName)
    {
        using (SqlConnection objCon = new SqlConnection(ConfigurationManager.ConnectionStrings["PLMDB"].ConnectionString))
        {
            objCon.Open();

            SqlCommand objCmd = null;
            SqlDataReader objDr = null;

            #region get Query from DB.

            string strSQL = string.Empty;
            string strBody = string.Empty;

            try
            {
                strSQL = string.Format(@"
                            SELECT qry_sel AS QUERY_SELECT
                            FROM ZQUERY
                            WHERE qry_id = '{0}'",
                            "SRM_4110_P");
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
                            "SRM_4110_P"
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
                cDBArgument objArg = (cDBArgument)tblSelect["arg_dlv_no"];
                strBody = objArg.convertWhere(
                                    strBody,
                                    "SRM_4110_P",
                                    "arg_dlv_no",
                                    HttpUtility.UrlDecode(strDlvNo)
                                );
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

            #endregion


            SqlCommand cmd = objCon.CreateCommand();

            SqlDataReader dr;
            DataSet ds = _dataSet;

            try
            {
                cmd.CommandText = strBody;
                dr = cmd.ExecuteReader();
                ds.Tables[0].Load(dr);
                dr.Close();

                _reportViewer.LocalReport.ReportPath = Server.MapPath(_ReportName);

                ReportDataSource rds = new ReportDataSource();
                rds.Name = _ReportDataSourceName;
                rds.Value = ds.Tables[0];
                _reportViewer.LocalReport.DataSources.Add(rds);
                _reportViewer.LocalReport.Refresh();

                string strRoot = HttpContext.Current.Server.MapPath("~/");
                string strPage = "SRM_4110";
                string sFileIdTrg = "test.pdf";
                string strTarget = strRoot + "Report/" + strPage + "/" + sFileIdTrg;

                Warning[] warnings;
                string[] streamids;
                string mimeType;
                string encoding;
                string extension;

                byte[] bytes = _reportViewer.LocalReport.Render("PDF", null, out mimeType, out encoding, out extension, out streamids, out warnings);

                FileStream fs = new FileStream(strTarget, FileMode.Create);
                fs.Write(bytes, 0, bytes.Length);
                fs.Close();

                //string strReturn = new JavaScriptSerializer().Serialize(
                //    new entityProcessed<string>(codeProcessed.SUCCESS, @strTarget)
                //);
                ////return strReturn;

            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                if (objCon.State == ConnectionState.Open)
                    objCon.Close();
            }
        }
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

