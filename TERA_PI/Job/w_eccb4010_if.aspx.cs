using System;
using System.Collections.Generic;
using System.Linq;
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
using System.Net;
using System.IO;

public partial class Job_w_eccb4010_if : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        string user = Request["User"];
        string key = Request["Key"];
        string url = "~/Master/BizContainer.aspx?if_menu=eccb4010&user_id=" + user + "&if_key=" + key;
        Response.Redirect(url);
    }

}
