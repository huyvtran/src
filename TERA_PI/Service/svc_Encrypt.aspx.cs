//------------------------------------------
// svc_Encrypt
//      : Encrypt/Decrypt
//		: Created by Professor.X, GoodWare (2011.03.10)
//------------------------------------------

using System;
using System.Web.Script.Serialization;
using System.Web.Services;

/// <summary>
/// svc_Encrypt
///     : Encrypt/Decrypt
///     : output - Encrypt/Decrypt String
/// </summary>
public partial class Service_svc_Encrypt : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
    }
    
    [WebMethod]
    public static string Encrypt(string _str)
    {
        cEncryptModule em = new cEncryptModule();

        string enc = em.Encrypt(System.Web.HttpUtility.UrlDecode(_str));


        return new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                                codeProcessed.SUCCESS,
                                enc)
                    );
    }
    
    
    [WebMethod]
    public static string Decrypt(string _str)
    {
        cEncryptModule em = new cEncryptModule();

        string dec = em.Decrypt(System.Web.HttpUtility.UrlDecode(_str));


        return new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                                codeProcessed.SUCCESS,
                                dec)
                    );
    }


}
