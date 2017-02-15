using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.SqlClient;
using System.Configuration;
using System.Data;
using System.IO;

public partial class Service_UploadFile : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        string strDataType = Request.QueryString["Type"];
        string strDataKey = Request.QueryString["Key"];
        string strDataSeq = Request.QueryString["Seq"];
        string strDataSubSeq = Request.QueryString["SubSeq"];
        string strUser = Request.QueryString["User"];

        string[] FiledIDs = new string[Request.Files.AllKeys.Length];
        foreach (string f in Request.Files.AllKeys)
        {
            HttpPostedFile file = Request.Files[f];
            FiledIDs[FiledIDs.Length - 1] = UploadFile(file, strDataType, strDataKey, strDataSeq, strDataSubSeq, strUser);
        }
        Response.Write(String.Join("</ br>", FiledIDs));
    }

    protected string UploadFile(HttpPostedFile file, string strDataType, string strDataKey, string strDataSeq, string strDataSubSeq, string strUser)
    {
        #region 1. Mapping Argument.

        // 1. Mapping Argument.
        //
        string strName = file.FileName;
        string[] strFile = strName.Split('.');
        string strType = (strFile.Length > 1) ? strFile[strFile.Length - 1] : string.Empty;
        string strID = string.Empty;

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

            string strSQL = "sp_getNewFileID2";
            objCmd = new SqlCommand(strSQL, objCon, objTran);
            objCmd.CommandText = strSQL;
            objCmd.Parameters.AddWithValue("@FileName", strName);
            objCmd.Parameters.AddWithValue("@DataType", strDataType);
            if (!string.IsNullOrEmpty(strDataKey))
                objCmd.Parameters.AddWithValue("@DataKey", strDataKey);
            if (!string.IsNullOrEmpty(strDataSeq))
                objCmd.Parameters.AddWithValue("@DataSeq", strDataSeq);
            if (!string.IsNullOrEmpty(strDataSubSeq))
                objCmd.Parameters.AddWithValue("@DataSubSeq", strDataSubSeq);
            objCmd.Parameters.AddWithValue("@NetworkCode", "HTTP");
            objCmd.Parameters.AddWithValue("@UserId", strUser);
            objCmd.Parameters.Add("@FileID", SqlDbType.VarChar, 20).Direction = ParameterDirection.Output;
            objCmd.Parameters.Add("@FilePath", SqlDbType.VarChar, 255).Direction = ParameterDirection.Output;
            objCmd.CommandType = CommandType.StoredProcedure;

            objCmd.ExecuteNonQuery();

            objTran.Commit();

            #endregion

            #region 4. Get Result.

            // 4. Get Result.
            //
            strID = objCmd.Parameters["@FileID"].Value.ToString();
            string strPath = objCmd.Parameters["@FilePath"].Value.ToString();
            if (string.IsNullOrEmpty(strID) || string.IsNullOrEmpty(strPath))
            {
                throw new Exception
                    ("저장할 파일 ID와 경로를 가져올 수 없습니다.");
            }
            if (!Directory.Exists(strPath))
                Directory.CreateDirectory(strPath);
            string strSave = strPath + strID + (string.IsNullOrEmpty(strType) ? "" : "." + strType);
            file.SaveAs(strSave);
            
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
        return strID;
    }
}