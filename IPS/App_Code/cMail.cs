//----------------------------------------
// cMail
//      : SMTP를 이용한 Mail 발송
//      : Created by KWY, GoodWare (2013.08)
//----------------------------------------
using System;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Net.Configuration;
using System.Net.Mail;
using System.Web;
using System.Web.Configuration;
using System.Web.Script.Serialization;
using System.Web.Services;

/// <summary>
/// cMail : SMTP를 이용한 메일 발송.
/// </summary>
public class cMail
{
    protected SmtpSection settings = null;
    protected SmtpClient client = null;
    protected MailAddress address = null;
    protected MailMessage message = new MailMessage();

    protected void initialize(string _section)
    {

        string strSectionGroup = string.Format(@"mailSettings/{0}", (_section == "" || _section == null ? "smtp_1" : _section));
        Configuration config = null;

        try
        {
            config = WebConfigurationManager.OpenWebConfiguration(HttpContext.Current.Request.ApplicationPath);
            settings = (SmtpSection)config.GetSection(strSectionGroup);

            client = new SmtpClient(settings.Network.Host, settings.Network.Port);
            client.UseDefaultCredentials = (bool)settings.Network.DefaultCredentials;
            //client.EnableSsl = true;
            client.DeliveryMethod = settings.DeliveryMethod;
            client.Credentials = new System.Net.NetworkCredential(settings.Network.UserName, settings.Network.Password);
        }
        catch (Exception ex)
        {
            throw new Exception(
                "초기화 실패.");
        }

    }

    protected void initialize()
    {
        initialize("");
    }

    protected MailAddress convertAddress(string _address)
    {
        MailAddress address = null;
        try
        {
            address = new MailAddress(_address);
        }
        catch (Exception ex)
        {
            throw new Exception(
                "메일 형식에 오류가 있습니다.\n -" + ex.Message);
        }

        return address;
    }

    public string sendMail(cMailData DATA)
    {
        string strReturn = string.Empty;

        #region Set To & Send Mail
        cProcedure objProcedure = new cProcedure();
        objProcedure.initialize();
        objProcedure.objCmd.CommandText = "SP_SENDMAIL";
        objProcedure.objCmd.CommandType = CommandType.StoredProcedure;
        if (DATA.STRETCH)
        {
            foreach (string to in DATA.TO)
            {
                if (!(to == null || to == ""))
                {
                    objProcedure.objCmd.Parameters.Clear();
                    objProcedure.objCmd.Parameters.AddWithValue("@recipients", to);
                    objProcedure.objCmd.Parameters.AddWithValue("@subject", HttpUtility.UrlDecode(DATA.SUBJECT));
                    objProcedure.objCmd.Parameters.AddWithValue("@body", HttpUtility.UrlDecode(DATA.BODY));
                    objProcedure.objCmd.Parameters.AddWithValue("@body_format", DATA.HTML ? "HTML" : "TEXT");
                    if (DATA.CC.Length > 0)
                    {
                        objProcedure.objCmd.Parameters.AddWithValue("@copy_recipients", string.Join(";", DATA.CC));
                    }

                    objProcedure.objCmd.ExecuteNonQuery();
                }
            }
        }
        else
        {
            objProcedure.objCmd.Parameters.Clear();
            objProcedure.objCmd.Parameters.AddWithValue("@recipients", string.Join(";", DATA.TO));
            objProcedure.objCmd.Parameters.AddWithValue("@subject", HttpUtility.UrlDecode(DATA.SUBJECT));
            objProcedure.objCmd.Parameters.AddWithValue("@body", HttpUtility.UrlDecode(DATA.BODY));
            objProcedure.objCmd.Parameters.AddWithValue("@body_format", DATA.HTML ? "HTML" : "TEXT");
            if (DATA.CC.Length > 0)
            {
                objProcedure.objCmd.Parameters.AddWithValue("@copy_recipients", string.Join(";", DATA.CC));
            }
            objProcedure.objCmd.ExecuteNonQuery();
        }
        objProcedure.processTran(doTransaction.COMMIT);
        #endregion

        return strReturn;

    }

    public string sendMail2(cMailData DATA)
    {

        string strReturn = string.Empty;
        initialize(DATA.SECTION);

        #region Set From
        // From
        if (DATA.FROM == null || DATA.FROM == "")
        {
            MailAddress from = new MailAddress(settings.From);
            message.From = from;

        }
        else
        {
            message.From = convertAddress(DATA.FROM);
        }
        #endregion

        #region Set Cc
        // CC
        if (!DATA.STRETCH)
        {
            foreach (string cc in DATA.CC)
            {
                if (!(cc == null || cc == ""))
                {
                    message.CC.Add(convertAddress(cc));
                }
            }
        }
        #endregion

        #region Set Message
        // Message Body
        message.IsBodyHtml = DATA.HTML;
        message.Subject = HttpUtility.UrlDecode(DATA.SUBJECT);
        message.Body = HttpUtility.UrlDecode(DATA.BODY);
        message.SubjectEncoding = System.Text.Encoding.UTF8;
        message.BodyEncoding = System.Text.Encoding.UTF8;
        #endregion

        #region Set To & Send Mail

        foreach (string to in DATA.TO)
        {
            if (!(to == null || to == ""))
            {
                message.To.Add(convertAddress(to));

                if (DATA.STRETCH)
                {
                    try
                    {
                        client.Send(message);
                    }
                    catch (SmtpException ex)
                    {
                        // OUTPUT 처리 예정
                        continue;
                    }
                    catch (InvalidOperationException ex)
                    {
                        // OUTPUT 처리 예정
                        continue;
                    }
                    catch (Exception ex)
                    {
                        // OUTPUT 처리 예정
                        continue;
                    }
                    finally
                    {
                        message.To.Clear();
                    }
                }
            }
        }

        try
        {
            if (!DATA.STRETCH) client.Send(message);
        }
        catch (Exception ex)
        {
            throw new Exception(
            "메일 발송 중 오류가 발생했습니다.\n -" + ex.Message);
        }

        #endregion

        return strReturn;

    }

    public bool sendMail(string _from, string _to, string _cc, string _subject, string _body, bool _html, string _section, bool _divide)
    {

        initialize(_section);

        // From
        if (_from == null || _from == "")
        {
            address = new MailAddress(settings.From);
            message.From = address;
        }
        else
        {
            address = new MailAddress(_from);
            message.From = address;
        }

        // CC
        foreach (string cc in _cc.Split(','))
        {
            if (!(cc == null || cc == ""))
            {
                address = new MailAddress(cc);
                message.CC.Add(address);
            }
        }

        // Message Body
        message.IsBodyHtml = _html;
        message.Subject = _subject;
        message.Body = _body;
        message.SubjectEncoding = System.Text.Encoding.UTF8;
        message.BodyEncoding = System.Text.Encoding.UTF8;

        // To & Send
        try
        {
            foreach (string to in _to.Split(','))
            {
                if (!(to == null || to == ""))
                {
                    address = new MailAddress(to);
                    message.To.Add(address);

                    if (_divide) client.Send(message);
                }
            }

            if (!_divide) client.Send(message);
        }
        catch (Exception ex)
        {
            return false;
        }
        finally
        {
            message.Dispose();
        }

        return true;
    }

    public bool sendMail(string _from, string _to, string _cc, string _subject, string _body, bool _html, string _section)
    {
        return sendMail(_from, _to, _cc, _subject, _body, _html, _section, true);
    }

    public bool sendMail(string _from, string _to, string _subject, string _body, bool _html, string _section, bool _divide)
    {
        return sendMail(_from, _to, string.Empty, _subject, _body, _html, _section, _divide);
    }

    public bool sendMail(string _from, string _to, string _subject, string _body, bool _html, string _section)
    {
        return sendMail(_from, _to, string.Empty, _subject, _body, _html, _section, true);
    }

    public bool sendMail(string _from, string _to, string _subject, string _body, bool _html)
    {
        return sendMail(_from, _to, string.Empty, _subject, _body, _html, string.Empty, true);
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//