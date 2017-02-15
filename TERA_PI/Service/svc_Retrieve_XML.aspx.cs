//------------------------------------------
// svc_Data_Retrieve_XML
//      : Select Data from DB -> Convert to XML.
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
/// svc_Data_Retrieve_XML
///     : Data Retrieve from DB.
///     : Convert to XML Document.
///     : input
///         - QRY_ID : Select Query ID
///         - QRY_COLS : Ordered Columns
///         - ARGS : Array for Arguments
///     : output 
///         - success : Data + User Data (cProcessed)
///         - else : User Data (cProcessed)
/// </summary>
public partial class Service_svc_Retrieve_XML : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        NameValueCollection lstParam = Request.QueryString;
        if (string.IsNullOrEmpty(lstParam["QRY_ID"])
            || string.IsNullOrEmpty(lstParam["QRY_COLS"])
            || string.IsNullOrEmpty(lstParam["CRUD"])
            || string.IsNullOrEmpty(lstParam["OPTION"]))
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

        int iDefault = 4;
        string strQueryID = lstParam["QRY_ID"];
        string[] strOrder = HttpUtility.UrlDecode(lstParam["QRY_COLS"].ToString()).Split(',');
        bool bKey = false;
        string[] strKeyName = null, strKeyValue = null;
        if (!string.IsNullOrEmpty(lstParam["KEY_COL"]))
        {
            bKey = true;
            iDefault += 2;
            strKeyName = HttpUtility.UrlDecode(lstParam["KEY_COL"].ToString()).Split(',');
            strKeyValue = HttpUtility.UrlDecode(lstParam["KEY_VAL"].ToString()).Split(',');
        }
        string strSQL = string.Empty;
        string strBody = string.Empty;

        SqlConnection objCon = null;
        SqlDataReader objDr = null;
        try
        {
            try
            {
                objCon = new SqlConnection(
                    ConfigurationManager.ConnectionStrings["PLMDB"].ConnectionString);
                objCon.Open();

                strSQL = string.Format(@"
                            SELECT
                                qry_sel AS QUERY_SELECT
                            FROM ZQUERY
                            WHERE qry_id = '{0}'",
                            strQueryID);
                SqlCommand objCmd = new SqlCommand(strSQL, objCon);
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
                try
                {
                    strSQL = string.Format(@"
                                SELECT
                                    arg_id AS ARG_ID,
                                    arg_tp AS ARG_TYPE,
                                    arg_qry AS ARG_QUERY
                                FROM ZQUERY_ARG
                                WHERE qry_id = '{0}'",
                                strQueryID
                                );
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
                    for (int iAry = iDefault; iAry < lstParam.Count - 7; iAry++)
                    {
                        string strKey = lstParam.Keys[iAry].ToString();
                        cDBArgument objArg = (cDBArgument)tblSelect[strKey];
                        if (objArg == null)
                        {
                            continue;
                            //throw new Exception(
                            //    "관련 Argument를 찾을 수 없습니다.");
                        }
                        else
                            strBody = objArg.convertWhere(
                                                strBody,
                                                strQueryID,
                                                strKey,
                                                HttpUtility.UrlDecode(lstParam[iAry])
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
                objCmd.CommandTimeout = 60;
                objDr = objCmd.ExecuteReader(CommandBehavior.CloseConnection);

                StringBuilder strXML = new StringBuilder(string.Empty);
                strXML.Append("<?xml version='1.0' encoding='utf-8'?>");
                strXML.Append("<rows>");
                strXML.Append("<page>" + 1 + "</page>");
                strXML.Append("<total>" + 1 + "</total>");
                strXML.Append("<records>" + 1000000 + "</records>");
                int iRow = 0, iData = 0, iSelect = 1;
                while (objDr.Read())
                {
                    strXML.Append("<row id='" + (++iRow) + "'>");
                    strXML.Append("<cell>" + iRow + "</cell>");
                    for (int iAry = 0; iAry < strOrder.Length; iAry++)
                    {
                        try
                        {
                            iData = objDr.GetOrdinal(strOrder[iAry]);
                            strXML.Append("<cell>" + objDr[iData].ToString().Replace("&", "&amp;").Replace("<", "&lt;").Replace(">", "&gt;") + "</cell>");
                        }
                        catch (Exception)
                        {
                            strXML.Append("<cell>" + strOrder[iAry] + "</cell>");
                        }
                    }
                    strXML.Append("<cell>" + lstParam["CRUD"] + "</cell>");
                    if (lstParam["OPTION"] == "TREE")
                    {
                        try
                        {
                            strXML.Append("<cell>" + objDr["tree_level"].ToString() + "</cell>");
                            strXML.Append("<cell>" + objDr["tree_parent"].ToString() + "</cell>");
                            strXML.Append("<cell>" + objDr["tree_leaf"].ToString() + "</cell>");
                        }
                        catch (Exception ex)
                        {
                            throw ex;
                        }
                    }
                    strXML.Append("</row>");
                    if (bKey)
                    {
                        try
                        {
                            bool bSelect = true;
                            for (int iKey = 0; iKey < strKeyName.Length; iKey++)
                            {
                                iData = objDr.GetOrdinal(strKeyName[iKey]);
                                if (objDr[iData].ToString() != strKeyValue[iKey])
                                {
                                    bSelect = false;
                                    break;
                                }
                            }
                            if (bSelect)
                            {
                                iSelect = iRow;
                                bKey = false;
                            }
                        }
                        catch (Exception)
                        {
                            bKey = false;
                            //throw new Exception(
                            //    "Key Checking을 할 수 없습니다.");
                        }
                    }
                }
                strXML.Append("<userdata name='select'>" + iSelect + "</userdata>");
                strXML.Append("</rows>");
                Response.ContentType = "text/xml;charset=utf-8";
                Response.Write(strXML.ToString());
            }
            catch (SqlException ex)
            {
                throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                            codeProcessed.ERR_SQL,
                            "Data 조회에 실패하였습니다.\n- " + ex.Message)
                        )
                    );
            }
            catch (Exception ex)
            {
                throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                            codeProcessed.ERR_PROCESS,
                            "Data 조회에 실패하였습니다.\n- " + ex.Message)
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