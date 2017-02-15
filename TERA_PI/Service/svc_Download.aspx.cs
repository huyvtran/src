using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Text;
using System.Collections;
using System.Collections.Specialized;
using System.Web.Script.Serialization;
using System.Data.SqlClient;
using System.Configuration;

public partial class Service_svc_Download : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        NameValueCollection lstParam = Request.QueryString;
        if (string.IsNullOrEmpty(lstParam["TYPE"]))
        {
            Response.Write(
                new JavaScriptSerializer().Serialize(
                    new entityProcessed<string>( codeProcessed.ERR_PARAM, "잘못된 호출입니다.")
                    )
                );
            return;
        }

        string sUserId = string.Empty;
        string sQryLog = string.Empty;
        string strDown = lstParam["TYPE"].ToString();
        string strName = string.Empty;
        string strTarget = string.Empty;
        switch (strDown)
        {
            case "FILE":
                {
                    if (string.IsNullOrEmpty(lstParam["ID"])
                        || string.IsNullOrEmpty(lstParam["PATH"])
                        || string.IsNullOrEmpty(lstParam["NAME"]))
                    {
                        Response.Write(
                            new JavaScriptSerializer().Serialize(
                                new entityProcessed<string>( codeProcessed.ERR_PARAM, "잘못된 호출입니다.")
                                )
                            );
                        return;
                    }

                    string strID = HttpUtility.UrlDecode(lstParam["ID"].ToString());
                    string strPath = HttpUtility.UrlDecode(lstParam["PATH"].ToString());
                    strName = HttpUtility.UrlDecode(lstParam["NAME"].ToString());
                    string[] strFile = strName.Split('.');
                    string strType = (strFile.Length > 1) ? strFile[strFile.Length - 1] : string.Empty;
                    strTarget = strPath + strID + (string.IsNullOrEmpty(strType) ? "" : "." + strType);
                    Response.ContentType = "application/octect-stream";

                    //Download Log 를 위한 쿼리 생성
                    if (!string.IsNullOrEmpty(lstParam["USER"]))
                    {
                        sUserId = lstParam["USER"].ToString();
                        sQryLog = "Insert Into EDM_LOG_DOWN(log_dt, user_id, file_id) Values(GetDate(), "
                                + string.Format("'{0}', '{1}' )", sUserId, strID) ;
                        int nLogCnt = logDownload(sQryLog);
                    }
                }
                break;
            case "REPORT":
                {
                    strName = HttpUtility.UrlDecode(lstParam["NAME"].ToString());
                    strTarget = Server.MapPath("~/Report/" + strName);
                }
                break;
        }
        //Response.AppendHeader("Content-Disposition", "attachment; filename=" + HttpUtility.UrlEncode(strName, Encoding.UTF8));
        string sFileDownName;
        if (strName.IndexOf("/") < 0) sFileDownName = strName;
        //else sFileDownName = strName.Substring(strName.IndexOf("/") + 1);
        else
        {
            string[] strSplit = strName.Split('/');
            sFileDownName = strSplit.Last();
        }

        sFileDownName = HttpUtility.UrlEncode(sFileDownName, Encoding.UTF8);
        sFileDownName = sFileDownName.Replace("+", " ");
        Response.AppendHeader("Content-Disposition", "attachment; filename=" + sFileDownName);
        Response.TransmitFile(strTarget);
        Response.End();
    }

    private int logDownload(string _qry)
    {
        SqlConnection objCon = null;
        objCon = new SqlConnection( ConfigurationManager.ConnectionStrings["PLMDB"].ConnectionString);
        SqlCommand objCmd = new SqlCommand(_qry, objCon);
        objCon.Open();
        int nRows = objCmd.ExecuteNonQuery();
        objCon.Close();
        return nRows;
    }
}
