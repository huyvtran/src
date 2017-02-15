using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Master_BizProcess : cEncryptModule
{
    public string param = string.Empty;

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            param = Request.Url.Query;
            //param = Request.Params["param"];
            //if (param != "")
            //    param = Decrypt(param);
        }
    }
}
