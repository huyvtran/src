//------------------------------------------
// svc_SRM_Auth
//      : 사용자 인증 처리.
//		: Created by Professor.X, GoodWare (2011.03.03)
//------------------------------------------

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using System.Collections.Specialized;
using System.Web.Script.Serialization;

/// <summary>
/// svc_SRM_Auth
///     : 사용자 인증 처리.
///     : input 
///         - ARG_1 : ID
///         - ARG_2 : Password
///     : output 
///         - entityProcessed (string)
/// </summary>
public partial class Service_svc_SRM_Auth : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        //Response.ContentType = "application/json; charset=utf-8";

        #region Argument 처리.

        NameValueCollection lstParams = Request.Form;
        if (string.IsNullOrEmpty(lstParams["ARG_1"])
            || string.IsNullOrEmpty(lstParams["ARG_2"]))
        {
            Response.Write(
                new JavaScriptSerializer().Serialize(
                    new entityProcessed<string>(
                            codeProcessed.ERR_PARAM,
                            "잘못된 호출입니다.")
                    )
                );
            return;
        }
        #endregion

        #region SQL - 사용자 인증.

        string strSQL = string.Format(@"
            SELECT
                EMP_NO AS 'EMP_NO'
              , KNAME AS 'KNAME'
              , DEPT_CODE AS 'DEPT_CODE'
              , DEPT_NAME AS 'DEPT_NAME'
            FROM 
                ZUSERINFO
            WHERE 
                SNO = '{0}' 
            AND 
                PASSWD = '{1}'",
            lstParams["ARG_1"],
            lstParams["ARG_2"]);

        #endregion

        #region 인증 처리.

        SqlConnection objCon = null;
        SqlDataReader objDr = null;
        try
        {
            objCon = new SqlConnection(
                ConfigurationManager.ConnectionStrings["PLMDB"].ConnectionString);
            SqlCommand objCmd = new SqlCommand(strSQL, objCon);
            objCon.Open();
            objDr = objCmd.ExecuteReader(CommandBehavior.CloseConnection);
            if (objDr.Read())
            {
                // 사용자 정보 저장. (추후 Form 인증 방식으로 변경)
                Session["SNO"] = lstParams["ARG_1"];
                Session["DEPT_CODE"] = objDr["DEPT_CODE"];
                Session["DEPT_NAME"] = objDr["DEPT_NAME"];

                Response.Write(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                                codeProcessed.SUCCESS,
                                "인증되었습니다.")
                        )
                    );
            }
            else
            {
                Response.Write(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                                codeProcessed.NONE_SQL,
                                "인증할 수 없습니다.\n사용자 아이디와 패스워드를 확인해 주세요.")
                        )
                    );
            }
        }
        catch (SqlException ex)
        {
            Response.Write(
                new JavaScriptSerializer().Serialize(
                    new entityProcessed<string>(
                            codeProcessed.ERR_SQL,
                            "인증에 실패하였습니다.\n- " + ex.Message)
                    )
                );
            //throw new Exception(ex.Message);
        }
        finally
        {
            if (objDr != null) objDr.Close();
            if (objCon != null) objCon.Close();
        }

        #endregion
    }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
