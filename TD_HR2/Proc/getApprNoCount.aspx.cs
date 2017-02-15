using System;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Text;

public partial class Proc_getApprNoCount : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

        string user_id = Request.QueryString["user_id"];
        string cnt = "0";

        SqlConnection objCon = null;
        SqlDataReader objDr = null;
        try
        {
            objCon = new SqlConnection(ConfigurationManager.ConnectionStrings["PLMDB"].ConnectionString);objCon.Open();

            StringBuilder sql = new StringBuilder(string.Empty);
            sql.Append("SELECT A.cnt1");
            sql.Append(" FROM dbo.fn_getApprBox('%', '" + user_id + "') A");
            sql.Append(" WHERE A.appr_box = '0'");

            SqlCommand objCmd = new SqlCommand(sql.ToString(), objCon);
            objDr = objCmd.ExecuteReader(CommandBehavior.CloseConnection);
            if (objDr.Read())
            {
                cnt = objDr["cnt1"].ToString();
                objDr.Close();

            }
        }
        catch (SqlException ex)
        {
            cnt = "0";
        }
        catch (Exception ex)
        {
            cnt = "0";
        }
        finally
        {
            if (objDr != null)
                objDr.Close();
            if (objCon != null)
                objCon.Close();
        }
        Response.Write(cnt);
    }
}