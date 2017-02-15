using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Collections.Specialized;

public partial class _GoodPLM : System.Web.UI.Page 
{
    protected void Page_Load(object sender, EventArgs e)
    {
        NameValueCollection lstParam = Request.QueryString;
        string strName = string.Empty;
        string strPassword = string.Empty;
        strName = lstParam["user_id"];
        strPassword = lstParam["passwd"];
	    Response.Redirect(
            "~/Master/GoodPLM.aspx" +
            "?user_id=" + strName +
            "&passwd=" + strPassword);
    }
}
