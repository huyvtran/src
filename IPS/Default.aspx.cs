using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class _Default : System.Web.UI.Page 
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (Session["AUTH"] == null)
            Response.Redirect("~/Master/IntroProcess.aspx" + (Request.QueryString.ToString() == "" ? "" : "?" + Request.QueryString.ToString()));
        else
            Response.Redirect("~/Master/BizProcess.aspx" + (Request.QueryString.ToString() == "" ? "" : "?" + Request.QueryString.ToString()));
    }
}
