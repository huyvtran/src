//------------------------------------------
// svc_Session
//      : Session 정보 전달.
//		: Created by Professor.X, GoodWare (2011.03.10)
//------------------------------------------

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Script.Serialization;
using System.Collections.Specialized;

/// <summary>
/// svc_Session
///     : Session 정보 전달.
///     : output - entityProcessed (entitySession)
/// </summary>
public partial class Service_svc_Session : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        #region Session 정보 전달.

        NameValueCollection lstParam = Request.QueryString;
        if (lstParam["SESSION"] == "OUT")
        {
            Session["AUTH"] = null;
            Response.Write(
            new JavaScriptSerializer().Serialize(
                new entityProcessed<string>(
                        codeProcessed.SUCCESS,
                        "로그아웃 되었습니다."
                    )
                )
            );
            return;
        }

        if (Session["AUTH"] == null)
        {
            Response.Write(
                new JavaScriptSerializer().Serialize(
                    new entityProcessed<string>(
                            codeProcessed.NONE,
                            "장시간 미입력 등으로 정보가 유효하지 않습니다.\n다시 로그인 후 사용해 주세요.")
                    )
                );
            return;
        }

        Response.Write(
            new JavaScriptSerializer().Serialize(
                new entityProcessed<entitySession>(
                        codeProcessed.SUCCESS,
                        new entitySession(
                            Session["USR_ID"].ToString(),
                            Session["GW_ID"].ToString(), 
                            Session["USR_NM"].ToString(),
                            Session["EMP_NO"].ToString(),
                            Session["DEPT_CD"].ToString(),
                            Session["DEPT_NM"].ToString(),
                            Session["POS_CD"].ToString(),
                            Session["POS_NM"].ToString(),
                            Session["DEPT_AREA"].ToString(),
                            Session["DEPT_AUTH"].ToString(),
                            Session["USER_TP"].ToString(),
                            Session["PUB_IP"].ToString())
                    )
                )
            );

        #endregion
    }
}
