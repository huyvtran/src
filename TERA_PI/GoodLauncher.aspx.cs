using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Collections.Specialized;

public partial class _GoodLauncher : System.Web.UI.Page 
{
    protected void Page_Load(object sender, EventArgs e)
    {
        NameValueCollection lstParam = Request.QueryString;
        string strPage = string.Empty;
        string strKey = string.Empty;
        string strNum = string.Empty;
        strPage = lstParam["obj_id"];
        strKey = lstParam["data_key"];
        strNum = lstParam["data_seq"];
	    Response.Redirect(
            "~/Job/" + strPage/* + ".aspx"*/ +
            "?data_key=" + strKey +
            "&data_seq=" + strNum);
    }
}
