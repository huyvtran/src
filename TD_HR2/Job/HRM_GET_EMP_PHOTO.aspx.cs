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

public partial class Job_HRM_GET_EMP_PHOTO : System.Web.UI.Page
{

    protected void Page_Load(object sender, EventArgs e)
    {
        SqlConnection objCon = null;
        string strEmpNo = Request.QueryString["EMP_NO"];
        try
        {
            objCon = new SqlConnection(ConfigurationManager.ConnectionStrings["PLMDB"].ConnectionString);
            objCon.Open();
            SqlCommand objCmd = new SqlCommand("SELECT EXT, PHOTO FROM ZPHOTO WHERE hcode = 'EMP' AND dcode = '" + strEmpNo + "'", objCon);
            SqlDataReader objDr;
            objDr = objCmd.ExecuteReader();
            objDr.Read(); // goto first row

            string contenttype = string.Empty;
            switch (objDr["EXT"].ToString())
            {
                case "jpg":
                    contenttype = "jpeg";
                    break;
                case "gif":
                    contenttype = "gif";
                    break;
                default:
                    contenttype = objDr["EXT"].ToString();
                    break;
            }
            Response.ClearContent();
            Response.ContentType = "image/" + contenttype;
            Response.BinaryWrite((byte[])objDr["PHOTO"]);
            Response.End();
        }
        catch (Exception ex)
        {
            
        }
        finally
        {
            objCon.Close();
        }
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

