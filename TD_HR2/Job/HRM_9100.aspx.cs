using System;
using System.Text;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Services;

public partial class JOB_HRM_9100 : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
    }

    [WebMethod]
    public static string Encrypt(string _str)
    {
        cEncryptModule em = new cEncryptModule();

        string enc = System.Web.HttpUtility.UrlEncode(em.Encrypt(_str));


        return new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                                codeProcessed.SUCCESS,
                                enc)
                    );
    }

}
