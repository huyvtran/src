//------------------------------------------
// svc_Auth_GW
//      : Auth Check (Groupware)
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
/// svc_Auth_GW
///     : Auth Check. (Groupware)
///     : input
///         - QUERY : Query ID
///         - ARGS : Array for Arguments
///     : output 
///         - entityProcessed (string)
/// </summary>
public partial class Service_svc_Auth_GW : System.Web.UI.Page
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
                            "Query 조회에 실패하였습니다.\n- " + ex.Message)
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
                                "Query Parameter 조회에 실패하였습니다.\n- " + ex.Message)
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
                                    "Query 생성에 실패하였습니다.\n- " + ex.Message)
                            )
                        );
                }
            }

            try
            {
                SqlCommand objCmd = new SqlCommand(strBody, objCon);
                objDr = objCmd.ExecuteReader(CommandBehavior.CloseConnection);

                if (objDr.HasRows)
                {
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
                            "사용자 인증에 실패하였습니다.\n- " + ex.Message)
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