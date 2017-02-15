using System;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Text;

public partial class Proc_getApprBoxCount : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

        string user_id = Request.QueryString["user_id"];
        string passwd = Request.QueryString["passwd"];
        StringBuilder XML = new StringBuilder(string.Empty);
        XML.Append("<?xml version=\"1.0\" encoding=\"utf-8\"?>");
        XML.Append("<rss version=\"2.0\">");
        XML.Append("<channel>");

        
        StringBuilder sql = new StringBuilder(string.Empty);
        sql.Append("SELECT TOP 5 A.USER_ID, B.EMP_NM AS USER_NM, B.DEPT_CD, dbo.OF_DEPT_NM(B.DEPT_CD) AS DEPT_NM, C.*");
        sql.Append(" FROM ZUSER A INNER JOIN AT_EMP B");
        sql.Append(" ON A.EMP_NO = B.EMP_NO");
        sql.AppendFormat(" CROSS JOIN dbo.fn_getApprBoxLine('0', '%', '{0}') C", user_id);
        sql.AppendFormat("  WHERE A.USER_ID = '{0}'", user_id);
        sql.Append(" ORDER BY C.APPR_ID DESC");

        SqlConnection objCon = null;
        SqlDataReader objDr = null;
        try
        {
            objCon = new SqlConnection(ConfigurationManager.ConnectionStrings["PLMDB"].ConnectionString); objCon.Open();
            SqlCommand objCmd = new SqlCommand(sql.ToString(), objCon);
            objDr = objCmd.ExecuteReader(CommandBehavior.CloseConnection);

            while (objDr.Read())
            {
                string link = string.Format("http://hr.techdata.co.kr/Master/BizContainer.aspx?login_tp=gw&user_id={0}&passwd={1}&menu=HRM_9100", user_id, passwd);
                XML.Append("<item>");
                XML.AppendFormat("<title><![CDATA[{0}]]></title>", objDr["doc_title"].ToString());
                XML.AppendFormat("<username><![CDATA[{0}]]></username>", objDr["rqst_emp_nm"].ToString());
                XML.AppendFormat("<pubDate><![CDATA[{0}]]></pubDate>", objDr["rqst_date"].ToString());
                XML.AppendFormat("<link><![CDATA[{0}]]></link>", link);
                XML.Append("</item>");
            }
        }
        catch (SqlException ex)
        {
            XML.Append("");
        }
        catch (Exception ex)
        {
            XML.Append("");
        }
        finally
        {
            if (objDr != null)
                objDr.Close();
            if (objCon != null)
                objCon.Close();
        }
        XML.Append("</channel>");
        XML.Append("</rss>");
        Response.ContentType = "text/xml;charset=utf-8";
        Response.Write(XML.ToString());
   }

    protected string getUserName(string user_id)
    {
        string user_name = string.Empty;
        SqlConnection objCon = null;
        SqlDataReader objDr = null;
        try
        {
            objCon = new SqlConnection(ConfigurationManager.ConnectionStrings["PLMDB"].ConnectionString); objCon.Open();

            string sql = string.Format("SELECT dbo.fn_getName('USER', 'NAME', '{0}')", user_id);

            SqlCommand objCmd = new SqlCommand(sql, objCon);
            objDr = objCmd.ExecuteReader(CommandBehavior.CloseConnection);
            if (objDr.Read())
            {
                user_name = objDr["cnt1"].ToString();
                objDr.Close();

            }
        }
        catch (SqlException ex)
        {
            user_name = user_id;
        }
        catch (Exception ex)
        {
            user_name = user_id;
        }
        finally
        {
            if (objDr != null)
                objDr.Close();
            if (objCon != null)
                objCon.Close();
        }
        return user_name;
    }
}