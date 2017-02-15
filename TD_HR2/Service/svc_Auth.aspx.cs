//------------------------------------------
// svc_Auth
//      : Auth Check & Set Session Data.
//		: Created by Professor.X, GoodWare (2011.04)
//------------------------------------------

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Text;
using System.Collections;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using System.Collections.Specialized;
using System.Web.Script.Serialization;

/// <summary>
/// svc_Auth
///     : Auth Check & Set Session Data.
///     : input
///         - QUERY : Query ID
///         - ARGS : Array for Arguments
///     : output 
///         - success : JSON Document
///         - else : entityProcessed (string)
/// </summary>
public partial class Service_svc_Auth : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        NameValueCollection lstParam = Request.QueryString;
        if (string.IsNullOrEmpty(lstParam["QUERY"]))
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

        string strReturn = string.Empty;
        int iDefault = 1;

        string strQueryID = lstParam["QUERY"];
        string strSQL = string.Format(@"
            SELECT
                qry_sel AS QUERY_SELECT
            FROM ZQUERY
            WHERE qry_id = '{0}'",
            strQueryID);
        string strBody = string.Empty;

        SqlConnection objCon = null;
        SqlDataReader objDr = null;
        try
        {
            try
            {
                objCon = new SqlConnection(
                    ConfigurationManager.ConnectionStrings["PLMDB"].ConnectionString);
                SqlCommand objCmd = new SqlCommand(strSQL, objCon);
                objCon.Open();
                objDr = objCmd.ExecuteReader();
                if (objDr.Read())
                {
                    strBody = objDr["QUERY_SELECT"].ToString();
                    objDr.Close();
                }
                else
                {
                    throw new Exception(
                        "관련 Query를 찾을 수 없습니다.");
                }
            }
            catch (SqlException ex)
            {
                throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                            codeProcessed.ERR_SQL,
                            "Query 조회에 실패하였습니다.\n- " + ex.Message)
                        )
                    );
            }
            catch (Exception ex)
            {
                throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                            codeProcessed.ERR_PROCESS,
                            "Query 조회 중에 오류가 발생하였습니다.\n- " + ex.Message)
                        )
                    );
            }

            if (lstParam.Count > iDefault)
            {
                Hashtable tblSelect = new Hashtable();

                strSQL = string.Format(@"
                                SELECT
                                    arg_id AS ARG_ID,
                                    arg_tp AS ARG_TYPE,
                                    arg_qry AS ARG_QUERY
                                FROM ZQUERY_ARG
                                WHERE qry_id = '{0}'",
                                strQueryID
                                );
                try
                {
                    SqlCommand objCmd = new SqlCommand(strSQL, objCon);
                    objDr = objCmd.ExecuteReader();

                    while (objDr.Read())
                    {
                        tblSelect.Add(
                            objDr["ARG_ID"].ToString(),
                            new cDBArgument(
                                objDr["ARG_TYPE"].ToString(),
                                objDr["ARG_QUERY"].ToString())
                            );
                    }
                    objDr.Close();
                }
                catch (SqlException ex)
                {
                    throw new Exception(
                        new JavaScriptSerializer().Serialize(
                            new entityProcessed<string>(
                                codeProcessed.ERR_SQL,
                                "Query Parameter 조회에 실패하였습니다.\n- " + ex.Message)
                            )
                        );
                }
                catch (Exception ex)
                {
                    throw new Exception(
                        new JavaScriptSerializer().Serialize(
                            new entityProcessed<string>(
                                codeProcessed.ERR_PROCESS,
                                "Query Parameter 조회 중에 오류가 발생하였습니다.\n- " + ex.Message)
                            )
                        );
                }

                try
                {
                    string[] aryARG = new string[lstParam.Count - 1];
                    for (int iAry = 1; iAry < lstParam.Count; iAry++)
                    {
                        string strKey = lstParam.Keys[iAry].ToString();
                        cDBArgument objArg = (cDBArgument)tblSelect[strKey];
                        if (objArg == null)
                        {
                            continue;
                            //throw new Exception(
                            //    "관련 Argument를 찾을 수 없습니다.");
                        }
                        strBody = objArg.convertWhere(
                                            strBody,
                                            strQueryID,
                                            strKey,
                                            lstParam[iAry],
                                            false
                                        );
                    }
                }
                catch (Exception ex)
                {
                    throw new Exception(
                        new JavaScriptSerializer().Serialize(
                            new entityProcessed<string>(
                                    codeProcessed.ERR_PROCESS,
                                    "Query 생성 중에 오류가 발생하였습니다.\n- " + ex.Message)
                            )
                        );
                }
            }

            try
            {
                SqlCommand objCmd = new SqlCommand(strBody, objCon);
                objDr = objCmd.ExecuteReader();

                if (objDr.Read())
                {
                    entityDatum objDatum = new entityDatum();
                    for (int iAry = 0; iAry < objDr.FieldCount; iAry++)
                    {
                        objDatum.Add(objDr[iAry].ToString());
                    }
                    Session["AUTH"] = true;
                    Session["USR_ID"] = objDr["user_id"];
                    Session["GW_ID"] = objDr["gw_id"];
                    Session["USR_NM"] = objDr["user_nm"];
                    Session["EMP_NO"] = objDr["emp_no"];
                    Session["DEPT_CD"] = objDr["dept_cd"];
                    Session["DEPT_NM"] = objDr["dept_nm"];
                    Session["POS_CD"] = objDr["pos_cd"];
                    Session["POS_NM"] = objDr["pos_nm"];
                    Session["DEPT_AREA"] = objDr["dept_area"];
                    Session["DEPT_AUTH"] = objDr["dept_auth"];
                    Session["USER_TP"] = objDr["user_tp"];

                    objDr.Close();

                    /**************************************************
                     * 외부 IP
                     **************************************************/
                    cGetClientIP req = new cGetClientIP();
                    Session["PUB_IP"] = req.GetClientIP();


                    strReturn = new JavaScriptSerializer().Serialize(
                                    new entityProcessed<entityDatum>(
                                        codeProcessed.SUCCESS,
                                        objDatum)
                                );
                }
                else
                {
                    if (strQueryID.StartsWith("gw"))
                    {
                        Response.Write(
                                new JavaScriptSerializer().Serialize(
                                    new entityProcessed<string>(
                                            codeProcessed.NONE_SQL,
                                            "인증할 수 없습니다.")
                                    )
                                );
                        return;
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
                        return;
                    }
                }
            }
            catch (SqlException ex)
            {
                throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                            codeProcessed.ERR_SQL,
                            "사용자 인증에 실패하였습니다.\n- " + ex.Message)
                    )
                );
            }
            catch (Exception ex)
            {
                throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                            codeProcessed.ERR_PROCESS,
                            "사용자 인증 중에 오류가 발생하였습니다.\n- " + ex.Message)
                    )
                );
            }

            try
            {
                string strQuery = @"
                    UPDATE ZUSER 
                    SET on_date = cast(GETDATE() as varchar)
                    WHERE user_id = '" + Session["USR_ID"] + "'";
                cDBQuery objQuery = new cDBQuery(ruleQuery.INLINE, strQuery);
                objQuery.executeQuery(objCon);

                Response.Write(strReturn);
            }
            catch (SqlException ex)
            {
                Session["AUTH"] = false;                

                throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                            codeProcessed.ERR_SQL,
                            "로그인 정보 저장에 실패하였습니다.\n- " + ex.Message)
                    )
                );
            }
            catch (Exception ex)
            {
                Session["AUTH"] = false;

                throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                            codeProcessed.ERR_PROCESS,
                            "로그인 정보 저장 중에 오류가 발생하였습니다.\n- " + ex.Message)
                    )
                );
            }
        }
        catch (Exception ex)
        {
            Response.Write(ex.Message);
        }
        finally
        {
            if (objDr != null)
                objDr.Close();
            if (objCon != null)
                objCon.Close();
        }
    }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//