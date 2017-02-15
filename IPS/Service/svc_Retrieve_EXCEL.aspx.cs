//------------------------------------------
// svc_Data_Retrieve_EXCEL
//      : Select Data from DB -> Convert to EXCEL.
//		: Created by Professor.X, GoodWare (2011.05)
//------------------------------------------

using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Text;
using System.Web;
using System.Web.Script.Serialization;

/// <summary>
/// svc_Data_Retrieve_EXCEL
///     : Data Retrieve from DB.
///     : Convert to EXCEL File.
///     : input
///         - QRY_ID : Select Query ID
///         - OPTION : 추가 Option
///         - Arguments : Query Arguments
///     : output 
///         - success : Data + User Data (cProcessed)
///         - else : User Data (cProcessed)
/// </summary>
public partial class Service_svc_Retrieve_EXCEL : System.Web.UI.Page
{
    private NameValueCollection lstParam = null;
    private SortedList<string, object> objGrid = new SortedList<string, object>();
    private JavaScriptSerializer js = new JavaScriptSerializer();

    protected void Page_Load(object sender, EventArgs e)
    {
        lstParam = Request.Form;
        if (string.IsNullOrEmpty(lstParam["QRY_ID"])
            //|| string.IsNullOrEmpty(lstParam["QRY_HDRS"])
            //|| string.IsNullOrEmpty(lstParam["QRY_COLS"])
            || string.IsNullOrEmpty(lstParam["OPTION"])
            || string.IsNullOrEmpty(lstParam["QRY_OBJ"]))
        {
            //Response.Write(
            //    new JavaScriptSerializer().Serialize(
            //        new entityProcessed<string>(
            //                codeProcessed.ERR_PARAM,
            //                "잘못된 호출입니다.")
            //        )
            //    );
            return;
        }

        int iDefault = 4;
        string strQueryID = HttpUtility.UrlDecode(lstParam["QRY_ID"]);
        string strSQL = string.Empty;
        string strBody = string.Empty;

        SqlConnection objCon = null;
        SqlDataReader objDr = null;
        try
        {
            # region Create Query
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
                    for (int iAry = iDefault; iAry < lstParam.Count; iAry++)
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
            #endregion

            #region Export Excel
            try
            {
                SqlCommand objCmd = new SqlCommand(strBody, objCon);
                objCmd.CommandTimeout = 60;
                objDr = objCmd.ExecuteReader(CommandBehavior.CloseConnection);

                // Export Excel
                DB2Excel(objDr);

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
            #endregion
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

    private void DB2Excel(SqlDataReader sdrData)
    {

        objGrid = js.Deserialize<SortedList<string, object>>(lstParam["QRY_OBJ"]);

        string strTitle = string.IsNullOrEmpty(lstParam["TITLE"]) ? "NoTitle" : HttpUtility.UrlDecode(lstParam["TITLE"]);
        //string[] strHeader = HttpUtility.UrlDecode(lstParam["QRY_HDRS"].ToString()) == "" ? new string[] { } : HttpUtility.UrlDecode(lstParam["QRY_HDRS"].ToString()).Split(',');
        //string[] strColumn = HttpUtility.UrlDecode(lstParam["QRY_COLS"].ToString()).Split(',');
        string[] strHeader = HttpUtility.UrlDecode(objGrid["header"].ToString()) == "" ? new string[] { } : HttpUtility.UrlDecode(objGrid["header"].ToString()).Split(',');
        string[] strColumn = HttpUtility.UrlDecode(objGrid["view"].ToString()).Split(',');

        #region Using HTML To Excel
        // 1. Using Text HTML
        StringBuilder strExcel = new StringBuilder(string.Empty);
        int iCnt = 0, iData = 0;
        if (sdrData.HasRows)
        {
            strExcel.Append("<STYLE> TD { mso-number-format:\\@; } </STYLE>");
            strExcel.Append("<TABLE border=\"1\">\n");

            #region 1. Create Header
            if (strHeader.Length > 0)
            {
                strExcel.Append("<TR>\n");
                strExcel.Append("<TD align='center' bgcolor='#BFBFBF'>No.</TD>\n");
                for (int iAry = 0; iAry < strHeader.Length; iAry++)
                {
                    strExcel.Append("<TD align='center' bgcolor='#BFBFBF'>" + HttpUtility.UrlDecode(strHeader[iAry]) + "</TD>\n");
                }
                strExcel.Append("</TR>\n");
            }
            #endregion

            #region 2. Create Data
            while (sdrData.Read())
            {
                strExcel.Append("<TR>\n");
                strExcel.Append("<TD align='right'>" + (++iCnt).ToString() + "</TD>\n");
                for (int iAry = 0; iAry < strColumn.Length; iAry++)
                {
                    try
                    {
                        iData = sdrData.GetOrdinal(strColumn[iAry]);
                        strExcel.Append(getVal(strColumn[iAry], sdrData[iData].ToString()));
                    }
                    catch (Exception)
                    {
                        strExcel.Append("</TR>\n");
                    }
                }
                strExcel.Append("</TR>\n");
            }
            #endregion

            strExcel.Append("</TABLE>");

            Response.Clear();
            Response.Buffer = true;
            //Response.ClearContent();
            //Response.ClearHeaders();
            Response.AddHeader("content-disposition", "attachment; filename=" + Server.UrlEncode(strTitle.Replace(" ", "")) + ".xls");
            Response.ContentType = "application/vnd.ms-excel";
            //Response.Charset = "euc-kr";
            Response.ContentEncoding = Encoding.UTF8;
            //Response.ContentEncoding = Encoding.GetEncoding(949);
            Response.Write("<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" />");
            Response.Write(strExcel.ToString());
            Response.Flush();
            //Response.Close();
            //Response.End();
            Response.SuppressContent = true;
            HttpContext.Current.ApplicationInstance.CompleteRequest();
        }
        #endregion

        #region Using GridView
        //// 2. Using GridView
        //if (sdrData.HasRows)
        //{
        //    DataTable dt = new DataTable();
        //    dt.Load(sdrData);
        //    dt.SetColumnsOrder(strColumn);
        //    while (dt.Columns.Count > strColumn.Length)
        //    {
        //        dt.Columns.RemoveAt(strColumn.Length);
        //    }

        //    StringWriter tw = new StringWriter();
        //    HtmlTextWriter hw = new System.Web.UI.HtmlTextWriter(tw);

        //    GridView gridView = new GridView();
        //    //gridView.AutoGenerateColumns = true;

        //    gridView.DataSource = dt;
        //    gridView.DataBind();

        //    foreach (TableCell cell in gridView.HeaderRow.Cells)
        //    {
        //        // Set Header Text
        //        int idx = Array.IndexOf(strColumn, cell.Text.ToLower());
        //        try
        //        {
        //            if (idx >= 0)
        //                cell.Text = HttpUtility.UrlDecode(strHeader[idx]).Replace("<br/>", "\n");
        //        }
        //        catch
        //        {
        //            continue;
        //        }
        //    }

        //    foreach (GridViewRow row in gridView.Rows)
        //    {
        //        //row.BackColor = System.Drawing.Color.White;
        //        foreach (TableCell cell in row.Cells)
        //        {
        //            //if (row.RowIndex % 2 == 0)
        //            //{
        //            //    cell.BackColor = gridView.AlternatingRowStyle.BackColor;
        //            //}
        //            //else
        //            //{
        //            //    cell.BackColor = gridView.RowStyle.BackColor;
        //            //}
        //            cell.CssClass = "textmode";
        //        }
        //    }
        //    gridView.RenderControl(hw);

        //    //Write the HTML back to the browser.
        //    Response.Clear();
        //    Response.Buffer = true;
        //    Response.ContentType = "application/vnd.ms-excel";
        //    Response.AppendHeader("Content-Disposition", "attachment; filename=" + Server.UrlEncode(strTitle.Replace(" ", "")) + ".xls");
        //    this.EnableViewState = false;
        //    string style = @"<style> td { mso-number-format:""@""; } </style> ";
        //    Response.Write(style);
        //    Response.Write("<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" />");
        //    //Response.Write(tw.ToString());
        //    Response.Output.Write(tw.ToString());
        //    Response.Flush();
        //    Response.End();
        //}
        #endregion

    }

    private string getVal(string col_nm, string val)
    {
        string style = string.Empty;
        string styled_val = val;
        try
        {
            SortedList<string, object> col = new SortedList<string, object>();
            col = js.Deserialize<SortedList<string, object>>(js.Serialize(js.Deserialize<SortedList<string, object>>(js.Serialize(objGrid["option"]))[col_nm]));
            switch (col["mask"].ToString())
            {
                case "date-ymd":
                    //style = "mso-number-format:yyyy\\-MM\\-dd !important;";
                    styled_val = val.Replace("-", "").Substring(0, 4) + "-" + val.Replace("-", "").Substring(4, 2) + "-" + val.Replace("-", "").Substring(6);
                    break;
                case "numeric-int":
                    style = "mso-number-format:\\#\\,0 !important;";
                    break;
                case "numeric-float":
                    style = "mso-number-format:\\#\\,0\\.00 !important;";
                    break;
                case "numeric-float1":
                    style = "mso-number-format:\\#\\,0\\.0 !important;";
                    break;
                case "numeric-float4":
                    style = "mso-number-format:\\#\\,0\\.0000 !important;";
                    break;
                case "biz-no":
                    styled_val = val.Replace("-", "").Substring(0, 3) + "-" + val.Replace("-", "").Substring(3, 2) + "-" + val.Replace("-", "").Substring(5);
                    break;
                case "person-id":
                    styled_val = val.Replace("-", "").Substring(0, 6) + "-" + val.Replace("-", "").Substring(6);
                    break;
            }

        }
        catch
        {
            style = string.Empty;
            styled_val = val;
        }

        if (!string.IsNullOrEmpty(style))
            style = " style= '" + style + "'";

        return "<TD" + style + ">" + styled_val + "</TD>\n";
    }

}

public static class DataTableExtensions
{
    public static void SetColumnsOrder(this DataTable table, params String[] columnNames)
    {
        for (int columnIndex = 0; columnIndex < columnNames.Length; columnIndex++)
        {
            table.Columns[columnNames[columnIndex]].SetOrdinal(columnIndex);
        }
    }
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//