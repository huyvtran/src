using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Services;

public partial class Job_HRM_1030 : System.Web.UI.Page
{

    public static string strEmpNo = string.Empty;
    protected void Page_Load(object sender, EventArgs e)
    {
        //strEmpNo = Request.QueryString["EMP_NO"];
        //imgPhoto.ImageUrl = "HRM_GET_EMP_PHOTO.aspx?EMP_NO=" + strEmpNo;
    }

    protected void ctlUpload_FileUploadComplete(object sender, DevExpress.Web.FileUploadCompleteEventArgs e)
    {
        string strPath = Server.MapPath("~/Files/Temp");
        if (!Directory.Exists(strPath)) Directory.CreateDirectory(strPath);
        string strFileName = e.UploadedFile.FileName;
        string strExt = Path.GetExtension(strFileName).Substring(1).ToLower();
        
        e.UploadedFile.SaveAs(Path.Combine(strPath, strFileName));

        if (Img2DB(Path.Combine(strPath, strFileName)) == 0)
            imgPhoto.ImageUrl = "HRM_GET_EMP_PHOTO.aspx?EMP_NO=" + strEmpNo;
    }

    protected int Img2DB(string strFileName)
    {
        int rtn = 0;
        string ext = Path.GetExtension(strFileName).Substring(1).ToLower();
        if (ext == "jpg" || ext == "bmp" || ext == "gif")
        {
            FileStream fs = new FileStream(strFileName, FileMode.Open, FileAccess.Read);
            byte[] bImg = new byte[fs.Length];
            fs.Read(bImg, 0, (int)fs.Length);

            //string strSQL = "INSERT INTO ZPHOTO(hcode, dcode, photo, ext, wsno, wdate) VALUES(@hcode, @dcode, @photo, @ext, @wsno, GETDATE())";
            string strSQL = "MERGE ZPHOTO A USING (SELECT @hcode AS hcode, @dcode AS dcode, @ext AS ext) B "
                          + "ON (A.hcode = B.hcode AND A.dcode = B.dcode) "
                          + "WHEN NOT MATCHED THEN INSERT(hcode, dcode, ext, wdate) VALUES(B.hcode, B.dcode, B.ext, GETDATE());";
            try
            {
                using (SqlConnection objCon = new SqlConnection(ConfigurationManager.ConnectionStrings["PLMDB"].ConnectionString))
                using (SqlCommand objCmd = new SqlCommand(strSQL, objCon))
                {
                    objCon.Open();
                    objCmd.Parameters.AddWithValue("@hcode", "EMP");
                    objCmd.Parameters.AddWithValue("@dcode", strEmpNo);
                    objCmd.Parameters.AddWithValue("@photo", bImg);
                    objCmd.Parameters.AddWithValue("@ext", ext);
                    objCmd.ExecuteNonQuery();
                    objCon.Close();
                }

                strSQL = "UPDATE ZPHOTO SET photo = @photo WHERE hcode = @hcode AND dcode = @dcode";
                using (SqlConnection objCon = new SqlConnection(ConfigurationManager.ConnectionStrings["PLMDB"].ConnectionString))
                using (SqlCommand objCmd = new SqlCommand(strSQL, objCon))
                {
                    objCon.Open();
                    objCmd.Parameters.AddWithValue("@hcode", "EMP");
                    objCmd.Parameters.AddWithValue("@dcode", strEmpNo);
                    objCmd.Parameters.AddWithValue("@photo", bImg);
                    objCmd.Parameters.AddWithValue("@ext", ext);
                    objCmd.ExecuteNonQuery();
                    objCon.Close();
                }

            }
            catch
            {
                rtn = -1;
            }
            finally
            {
                fs.Close();
                fs.Dispose();
            }
        }
        return rtn;
    }


    [WebMethod]
    public static string ImageUpload()
    {

        try
        {
            foreach (string f in Directory.GetFiles(@"D:\Temp"))
            {
                string emp_no = Path.GetFileNameWithoutExtension(f);
                string ext = Path.GetExtension(f).Substring(1).ToLower();
                if (ext == "jpg" || ext == "bmp" || ext == "gif")
                {
                    FileStream fs = new FileStream(f, FileMode.Open, FileAccess.Read);
                    byte[] bImg = new byte[fs.Length];
                    fs.Read(bImg, 0, (int)fs.Length);

                    string strSQL = "INSERT INTO ZPHOTO(hcode, dcode, photo, ext, wsno, wdate) VALUES(@hcode, @dcode, @photo, @ext, @wsno, GETDATE())";
                    using (SqlConnection objCon = new SqlConnection(ConfigurationManager.ConnectionStrings["PLMDB"].ConnectionString))
                    using (SqlCommand objCmd = new SqlCommand(strSQL, objCon))
                    {
                        objCon.Open();

                        objCmd.Parameters.AddWithValue("@hcode", "EMP");
                        objCmd.Parameters.AddWithValue("@dcode", emp_no);
                        objCmd.Parameters.AddWithValue("@photo", bImg);
                        objCmd.Parameters.AddWithValue("@ext", ext);
                        objCmd.Parameters.AddWithValue("@wsno", "SYSTEM");

                        objCmd.ExecuteNonQuery();

                        objCon.Close();
                    }
                }
            }
        }
        catch (Exception ex)
        {
            return new JavaScriptSerializer().Serialize(
                            new entityProcessed<string>(
                                    codeProcessed.ERR_PARAM,
                                    "오마이갓 마더파더!\n" + ex.Message)
                        );
        }

        return new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                                codeProcessed.SUCCESS,
                                "오케이 마더파더!")
                    );
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

