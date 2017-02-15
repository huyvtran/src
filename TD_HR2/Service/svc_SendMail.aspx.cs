//------------------------------------------
// svc_Update
//      : Insert/Update/Delete Process to DB.
//		: Created by Professor.X, GoodWare (2011.04)
//------------------------------------------

using System;
using System.Configuration;
using System.Net.Configuration;
using System.Net.Mail;
using System.Web;
using System.Web.Configuration;
using System.Web.Script.Serialization;
using System.Web.Services;

public partial class Service_svc_SendMail : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

    }

    #region SendMail() : SendMail Process

    [WebMethod]
    public static string sendMail(cMailData DATA)
    {
        cMail mail = new cMail();

        try
        {
            mail.sendMail(DATA);
        }
        catch (Exception ex)
        {
            return new JavaScriptSerializer().Serialize(
                            new entityProcessed<string>(
                                    codeProcessed.ERR_PARAM,
                                    "메일 발송이 실패했습니다.\n" + ex.Message)
                        );
        }


        return new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                                codeProcessed.SUCCESS,
                                "메일이 발송되었습니다.")
                    );
    }

    #endregion

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//