using System;
using System.Text;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Services;

public partial class JOB_HRM_8140 : System.Web.UI.Page
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

    #region sendToUserEmail() : 서류합격 메일 발송
    /// <summary>
    /// 
    /// </summary>
    //[WebMethod]
    //public static string sendMail(string _email, bool _tp)
    //{
    //    string subject = string.Empty;
    //    StringBuilder sb = new StringBuilder();

    //    subject = "[AP시스템] 서류전형 결과통보";
    //    if (_tp)
    //    {
    //        sb.Append("<table width=\"540px\" cellpadding=\"0\" cellspacing=\"0\">");
    //        sb.Append("    <tr>");
    //        sb.Append("        <td colspan=\"2\">");
    //        sb.Append("            <p>AP시스템 <b>2013년 정기채용 모집</b> 서류 전형에 <b>합격</b>하셨음을 축하드립니다.</p>");
    //        sb.Append("            <p>다음과 같이 <b>1차 면접 전형 일시 및 장소</b>를 알려드리오니, 참석바랍니다.</p>");
    //        sb.Append("            </br>");
    //        sb.Append("            <p><center>- 다&nbsp;&nbsp;&nbsp;&nbsp;음 -</center></p><br>");
    //        sb.Append("            <p>1. 일자 : 2013년 8월 29일 (목) - 시간은 휴대폰으로 개별 통지</p>");
    //        sb.Append("            <p>2. 장소 : AP시스템 본사 (입구 보안실 안내)</p>");
    //        sb.Append("            <p>3. 복장 및 준비물</p>");
    //        sb.Append("            <p>&nbsp;&nbsp;&nbsp;① 복장 : 정장</p>");
    //        sb.Append("            <p>&nbsp;&nbsp;&nbsp;② 준비물 : 휴대폰으로 개별 통지</p>");
    //        sb.Append("            <p>4. 기타사항 : 문의사항은 인사팀 <b>김민정 대리 (031-379-2957)</b>에게</p>");
    //        sb.Append("            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;연락하시기 바랍니다.</p>");
    //        sb.Append("        </td>");
    //        sb.Append("    </tr>");
    //        sb.Append("    <tr><td colspan=\"2\">&nbsp;</td></tr>");
    //        sb.Append("    <tr>");
    //        sb.Append("        <td>");
    //        sb.Append("            <img src=\"http://recruit.apsystems.co.kr/recruit/images/logo_1.jpg\" width=\"118px\" height=\"40px\">");
    //        sb.Append("       </td>");
    //        sb.Append("        <td align=\"right\">");
    //        sb.Append("            <p>- AP시스템 인사팀 -</p>");
    //        sb.Append("        </td>");
    //        sb.Append("    </tr>");
    //        sb.Append("</table>");
    //    }
    //    else
    //    {
    //        sb.Append("<table cellpadding=\"0\" cellspacing=\"0\">");
    //        sb.Append("    <tr>");
    //        sb.Append("        <td colspan=\"2\">");
    //        sb.Append("            <p>AP시스템에 관심을 주셔서 감사드립니다.</p>");
    //        sb.Append("            <p>귀하께서는 우수한 능력과 역량을 보유하고 있으나,</p>");
    //        sb.Append("            <p>당사의 금번 채용 모집에는 안타깝게도 불합격 하셨습니다.</p>");
    //        sb.Append("            <p>AP시스템에 지원해 주셔서 다시 한번 감사드립니다.</p>");
    //        sb.Append("        </td>");
    //        sb.Append("    </tr>");
    //        sb.Append("    <tr><td colspan=\"2\">&nbsp;</td></tr>");
    //        sb.Append("    <tr>");
    //        sb.Append("        <td>");
    //        sb.Append("            <img src=\"http://recruit.apsystems.co.kr/recruit/images/logo_1.jpg\" width=\"118px\" height=\"40px\">");
    //        sb.Append("       </td>");
    //        sb.Append("        <td align=\"right\">");
    //        sb.Append("            <p>- AP시스템 인사팀 -</p>");
    //        sb.Append("        </td>");
    //        sb.Append("    </tr>");
    //        sb.Append("</table>");
    //    }

    //    bool success = false;
    //    foreach (string email in _email.Split(','))
    //    {
    //        if (cMail.sendMail(email, "", subject, sb.ToString(), true, "smtp_2"))
    //            success = true;
    //    }

    //    if (success)
    //    {
    //        return new JavaScriptSerializer().Serialize(
    //                        new entityProcessed<string>(
    //                                codeProcessed.SUCCESS,
    //                                "메일이 발송되었습니다.")
    //                    );
    //    }
    //    else
    //    {
    //        return new JavaScriptSerializer().Serialize(
    //                        new entityProcessed<string>(
    //                                codeProcessed.ERR_PARAM,
    //                                "메일 발송이 실패했습니다.")
    //                    );
    //    }
    //}

    #endregion
}
