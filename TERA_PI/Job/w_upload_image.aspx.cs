using System;
using System.Collections.Specialized;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;

public partial class Job_w_upload_image : System.Web.UI.Page
{
    string strData = "IMG";
    string strNetwork = "HTTP";

    protected void Page_Load(object sender, EventArgs e)
    {
        NameValueCollection lstParam = Request.QueryString;
        if (string.IsNullOrEmpty(lstParam["DATA_TYPE"]))
        {
            return;
        }
        strData = lstParam["DATA_TYPE"].ToString();
    }
    protected void ctlUpload_FileUploadComplete(object sender, DevExpress.Web.FileUploadCompleteEventArgs e)
    {
        #region 1. Mapping Argument.

        // 1. Mapping Argument.
        //
        string strName = e.UploadedFile.FileName;
        string [] strFile = strName.Split('.');
        string strType = (strFile.Length > 1) ? strFile[strFile.Length - 1] : string.Empty;

        #endregion

        SqlConnection objCon = null;
        SqlTransaction objTran = null;
        SqlCommand objCmd = null;
        try
        {
            #region 2. DB Connection Open.

            objCon = new SqlConnection(
                                ConfigurationManager.ConnectionStrings["PLMDB"].ConnectionString);
            objCon.Open();

            #endregion

            #region 3. Run Procedure.

            objTran = objCon.BeginTransaction();

            string strSQL = "sp_getNewFileID";
            objCmd = new SqlCommand(strSQL, objCon, objTran);
            objCmd.CommandText = strSQL;
            objCmd.Parameters.AddWithValue("@FileName", strName);
            objCmd.Parameters.AddWithValue("@DataType", strData);
            objCmd.Parameters.AddWithValue("@NetworkCode", strNetwork);
            objCmd.Parameters.Add("@FileID", SqlDbType.VarChar, 20).Direction = ParameterDirection.Output;
            //objCmd.Parameters.AddWithValue("@FilePath", "/Files/PLM_FILES/").Direction = ParameterDirection.InputOutput;
            objCmd.Parameters.Add("@FilePath", SqlDbType.VarChar, 255).Direction = ParameterDirection.InputOutput;
            objCmd.Parameters["@FilePath"].Value = "/Files/PLM_FILES/";
            objCmd.CommandType = CommandType.StoredProcedure;
            
            objCmd.ExecuteNonQuery();

            objTran.Commit();

            #endregion

            #region 4. Get Result.

            // 4. Get Result.
            //
            string strID = objCmd.Parameters["@FileID"].Value.ToString();
            string strPath = objCmd.Parameters["@FilePath"].Value.ToString();
            string strLocalPath = string.Empty;
            if (string.IsNullOrEmpty(strID) || string.IsNullOrEmpty(strPath))
            {
                throw new Exception
                    ("저장할 파일 ID와 경로를 가져올 수 없습니다.");
            }
            if (Uri.IsWellFormedUriString(strPath, UriKind.Relative))
                strLocalPath = Server.MapPath(strPath);
            else
                strLocalPath = strPath;

            if (!Directory.Exists(strLocalPath))
                Directory.CreateDirectory(strLocalPath);
            string strSave = Path.Combine(strLocalPath, strID + (string.IsNullOrEmpty(strType) ? "" : "." + strType));
            e.UploadedFile.SaveAs(strSave);
            e.CallbackData = strID + "@" + strName + "@" + strType + "@" + strPath;

            #endregion
        }
        catch (Exception ex)
        {
            #region 5. Exception.

            // 5. Exception.
            //
            if (objTran != null)
                objTran.Rollback();

            throw ex;

            #endregion
        }
        finally
        {
            #region 6. Release Object.

            // 6. Release Object.
            //
            if (objCon != null)
                objCon.Close();

            #endregion
        }
    }
}
