using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class cFileDownload : cEncryptModule
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            string strFileId = HttpUtility.UrlDecode(Request.Url.Query.Substring(1));
            string strFileIdEnc = Decrypt(HttpUtility.UrlDecode(Request.Url.Query.Substring(1)));
            string strFileNm = string.Empty;
            string strFilePath = string.Empty;
            string strContentType = "application/octect-stream";
            try
            {
                string strSQL = "SELECT file_id, file_nm, REPLACE(file_path, '\\', '\\\\') AS file_path, file_ext FROM ZFILE WHERE file_id = @file_id OR file_id = @file_id2";
                using (SqlConnection objCon = new SqlConnection(ConfigurationManager.ConnectionStrings["PLMDB"].ConnectionString))
                using (SqlCommand objCmd = new SqlCommand(strSQL, objCon))
                {
                    objCon.Open();
                    objCmd.Parameters.AddWithValue("@file_id", strFileId);
                    objCmd.Parameters.AddWithValue("@file_id2", strFileIdEnc);
                    SqlDataReader objDr = objCmd.ExecuteReader();
                    while (objDr.Read())
                    {
                        strFileId = objDr["file_id"].ToString();
                        strFileNm = HttpUtility.UrlEncode(objDr["file_nm"].ToString(), Encoding.UTF8);
                        strFilePath = objDr["file_path"].ToString() + strFileId + (objDr["file_ext"].ToString() == "" ? "" : "." + objDr["file_ext"].ToString());

                        switch (objDr["file_ext"].ToString().ToLower())
                        {
                            case "jpg":
                                strContentType = "image/jpeg";
                                break;
                            case "gif":
                                strContentType = "image/gif";
                                break;
                            case "pdf":
                                strContentType = "application/pdf";
                                break;
                            case "doc":
                            case "docx":
                                strContentType = "application/msword";
                                break;
                            case "xls":
                            case "xlsx":
                                strContentType = "application/vnd.ms-excel";
                                break;
                            case "ppt":
                            case "pptx":
                                strContentType = "application/vnd.ms-powerpoint";
                                break;
                        }

                    }
                    objCon.Close();
                }

                if (System.IO.File.Exists(strFilePath))
                {
                    Response.ContentType = strContentType;
                    Response.AppendHeader("Content-Disposition", "attachment; filename=" + strFileNm);
                    Response.TransmitFile(strFilePath);
                    Response.End();
                }
                else
                {
                    ClientScript.RegisterStartupScript(GetType(), "close", "alert(\"요청한 파일이 없습니다.\\n" + strFilePath + "\");window.close();", true);
                }
            }
            catch
            {
                ClientScript.RegisterStartupScript(GetType(), "close", "alert(\"잘못된 접근입니다.\");window.close();", true);
            }
            finally
            {
                //ClientScript.RegisterStartupScript(GetType(), "close", "window.close();", true);
            }
        }
    }
}
