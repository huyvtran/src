using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using DevExpress.XtraCharts;
using System.Collections;

public partial class Job_w_eccb4012 : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        string user = Request["User"];
        string key = Request["Key"];
        if(!string.IsNullOrEmpty(user) && !string.IsNullOrEmpty(key))
        {
            string url = "~/Master/BizContainer.aspx?if_menu=eccb4012&user_id=" + user + "&if_key=" + key;
            Response.Redirect(url);
        }
    }
}


