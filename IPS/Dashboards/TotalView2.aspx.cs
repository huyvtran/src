using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.SqlClient;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Windows.Forms;
using System.Web.Services;

public partial class TotalView2 : System.Web.UI.Page
{
    
    protected void Page_Load(object sender, EventArgs e)
    {
    }
    
    //[WebMethod]
    //public static string readData(String location)
    //{
    //    string lct = location;
    //    String sql = "select * from eom_eq_issue where issue_id = '5274'";
    //    //String sql = "SELECT * FROM EQ_LOCATION_TEST WHERE LCT_KEY =" + lct;
    //    String result = string.Empty;

    //    SqlConnection objcon = new SqlConnection(ConfigurationManager.ConnectionStrings["PLMDB"].ConnectionString);
    //    objcon.Open();
        
    //    MessageBox.Show("!!!!");
    //    SqlCommand cmd = new SqlCommand();
    //    cmd.Connection = objcon;
    //    cmd.CommandText = sql;
    //    cmd.CommandType = CommandType.Text;
        
    //    SqlDataReader dr = cmd.ExecuteReader();
    //    while (dr.Read())
    //    {
    //        result = dr["eq_cd"].ToString();
    //        dr.Close();
    //    }
    //    //dr.Close();

    //    return result;
    //}
}