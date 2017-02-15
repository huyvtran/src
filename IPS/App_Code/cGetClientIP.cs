using System.Net;
using System.Text.RegularExpressions;
using System.Web;

public class cGetClientIP
{
    public string GetClientIP()
    {
        string pub_ip = string.Empty;
        //try
        //{
        //    string externalIP;
        //    externalIP = (new WebClient()).DownloadString("http://checkip.dyndns.org/");
        //    externalIP = (new Regex(@"\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}"))
        //                 .Matches(externalIP)[0].ToString();
        //    pub_ip = externalIP;
        //}
        //catch
        //{
        //    pub_ip = string.Empty;
        //}


        try
        {
            if (HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"] != null)
            {
                pub_ip = HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"].ToString();
            }
            else if (HttpContext.Current.Request.UserHostAddress.Length != 0)
            {
                pub_ip = HttpContext.Current.Request.UserHostAddress;
            }
        }
        catch
        {
            pub_ip = string.Empty;
        }

        return pub_ip;
    }
}
