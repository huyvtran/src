using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Services;
using System.Web.Script.Services;
using System.Web.Script.Serialization;
using System.Data;
using System.Data.SqlClient;
using System.Web.Configuration;
using System.Text;
using System.Collections;
using System.Collections.Specialized;
using System.Configuration;
using Word = Microsoft.Office.Interop.Word;
using System.IO;
using DevExpress.XtraRichEdit;
using DevExpress.XtraRichEdit.API.Native;
using System.Windows.Forms;

public partial class Job_ECM_2020 : System.Web.UI.Page
{
    
    protected static SqlConnection objCon = null;
    protected static SqlCommand objCmd = null;
    protected static SqlDataReader objDr = null;

    protected static Word.Application _WordApp;
    protected static Word.Document _WordDoc;

    protected void Page_Load(object sender, EventArgs e)
    {
    }

    #region Print() : DB의 Data를 통해 출력물 Create.

    /// <summary>
    /// Print() : DB의 Data를 통해 출력물 Create.
    ///     : input
    ///         - DATA : Query and Argument / Option
    ///     : output 
    ///         - success : 출력물 파일 정보
    ///         - else : entityProcessed (string)
    /// </summary>
    [WebMethod]
    public static string Print(cRetrieveData DATA)
    {
        RichEditDocumentServer docServer = new RichEditDocumentServer(); ;
        string strReturn = string.Empty;
        MemoryStream st = null;
        System.IO.FileStream fs = null;
        try
        {
            #region connect to DB.

            //  connect to DB.
            //
            try
            {
                objCon = new SqlConnection(ConfigurationManager.ConnectionStrings["PLMDB"].ConnectionString);
                objCon.Open();
                objCmd = new SqlCommand("", objCon);
            }
            catch (SqlException ex)
            {
                throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                            codeProcessed.ERR_SQL,
                            "Database에 연결할 수 없습니다.\n- " + ex.Message)
                        )
                    );
            }
            catch (Exception ex)
            {
                throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                            codeProcessed.ERR_PROCESS,
                            "Database 연결 중에 오류가 발생하였습니다.\n- " + ex.Message)
                        )
                    );
            }

            #endregion

            #region prepare Office object.

            string strPrint = DATA.getOption("PRINT");
            string strPage = DATA.getOption("PAGE");
            string strUser = DATA.getOption("USER");
            string strDocID = DATA.getOption("DOC_ID");
            string strDocNo = DATA.getOption("DOC_NO");

            string strRoot = HttpContext.Current.Server.MapPath("~/");
            string strSource = getTemplate2(strDocID);
            string strPstat = getPstat(strDocID);
            string strTargetExt = ".pdf";
            string strTarget = strRoot + "Report/" + strPage + "/" + Path.GetFileName(Path.ChangeExtension(strSource, strTargetExt));
            string sFileNmTrg = strDocNo + strTargetExt;
            object objMissing = Type.Missing;
            string sourcePath = Path.GetExtension(strSource);
            #endregion

            #region process Query & set to Print.


            try
            {



                //if (strPstat.Equals("ING") && !Path.GetExtension(strSource).Equals(".pdf"))
                #region do process
                if (sourcePath.Equals(".doc") || sourcePath.Equals(".docx"))
                {
                    DevExpress.XtraRichEdit.DocumentFormat docformat = (sourcePath == ".docx") ? DevExpress.XtraRichEdit.DocumentFormat.OpenXml : DevExpress.XtraRichEdit.DocumentFormat.Doc;
                    docServer.LoadDocument(strSource);
                    
                    Document doc = docServer.Document;
                    DataTable dt = getData(strDocID);
                    DataTable mmdt = convertMergeDT(dt);

                    //if (Path.GetExtension(strSource) == ".docx")
                    //{
                    //    docServer.LoadDocument(strSource, DevExpress.XtraRichEdit.DocumentFormat.OpenXml);
                    //}
                    //else if (Path.GetExtension(strSource) == ".doc")
                    //{
                    //    docServer.LoadDocument(strSource, DevExpress.XtraRichEdit.DocumentFormat.Doc);
                    //}
                    docServer.Options.MailMerge.DataSource = mmdt;
                    docServer.Options.MailMerge.ViewMergedData = true;
                    FieldCollection fc = docServer.Document.Fields;

                    List<string> removeColList = new List<string>();
                    


                    #region insert image
                    while(fc.Count > 0)
                    {
                        Field f = fc[0];
                        f.ShowCodes = true;
                        string val = doc.GetText(f.CodeRange);
                        val = val.Substring(12);
                        val = val.Substring(0, val.LastIndexOf('\\') - 1);
                        val.Trim();
                        val.Replace(" ", "");
                        if (val.Contains(" "))
                        {
                            string[] v = val.Split(' ');
                            val = v[1];
                        }
                        if(val.IndexOf("SIGN_") >= 0 || val.IndexOf("인(") >= 0)
                        {
                            string engval = string.Empty;
                            if (strPstat.Equals("CFM"))
                            {
                                switch (val)
                                {
                                    case "인(갑)":
                                        engval = "SIGN_A";
                                        break;
                                    case "인(을)":
                                        engval = "SIGN_B";
                                        break;
                                    case "인(병)":
                                        engval = "SIGN_C";
                                        break;
                                }
                                string sign_image = strRoot + @"\Files\ECM_FILES\SIGN_FILES\" + getSignImage(strDocID, engval) + ".png";
                                docServer.Document.CaretPosition = f.Range.Start;
                                docServer.Document.Delete(f.Range);

                                if (File.Exists(sign_image))
                                {
                                    docServer.Document.Images.Insert(docServer.Document.CaretPosition, DocumentImageSource.FromFile(sign_image));
                                }
                            }
                        }
                    }
                    #endregion

                    #region do merge
                    st = new MemoryStream();
                    MailMergeOptions options = docServer.CreateMailMergeOptions();
                    options.DataSource = mmdt;
                    options.FirstRecordIndex = 0;
                    options.LastRecordIndex = 0;
                    docServer.MailMerge(options, st, DevExpress.XtraRichEdit.DocumentFormat.OpenXml);
                    #endregion

                    #region insert footer
                    if (strPstat.Equals("CFM"))
                    {
                        //docServer.HtmlText = "<font color=\"blue\">본 계약서는 전자서명법에 따라(주)원익아이피에스와 상기 업체 간에 공인인증을 득하여 체결한 전자계약서로써 제반 법령에 따라 법적 효력을 충족한 것임을 확인합니다.</font>";

                        //string foottxt = "\n" + "본 계약서는 전자서명법에 따라 (주)원익아이피에스와 상기 업체 간에 공인인증을 득하여 체결한 전자계약서로써 제반 법령에 따라 법적 효력을 충족한 것임을 확인합니다.";

                        Section firstsct = docServer.Document.Sections[0];
                        SubDocument footer = firstsct.BeginUpdateFooter(HeaderFooterType.Odd);
                        RichEditControl htmltxt = new RichEditControl();
                        htmltxt.Document.HtmlText = "</br><font color=\"darkblue\" size=\"2\">본 계약서는 전자서명법에 따라 (주)원익아이피에스와 상기 업체 간에 공인인증을 득하여 체결한 전자계약서로써 제반 법령에 따라 법적 효력을 충족한 것임을 확인합니다.</font>";


                        //DocumentRange rng = footer.InsertText(footer.CreatePosition(0), foottxt);
                        DocumentRange rng = footer.InsertHtmlText(footer.CreatePosition(0), htmltxt.Document.HtmlText);
                        
                        docServer.Document.Sections[0].EndUpdateFooter(footer);
                    }
                    #endregion

                    #region save to File.
                    fs = File.Open(strTarget, FileMode.Create);
                    fs.Position = 0;
                    MessageBox.Show(docServer.Document.DefaultCharacterProperties.FontName);
                    docServer.ExportToPdf(fs);
                    fs.Seek(0, SeekOrigin.Begin);
                    //using (fs = new System.IO.FileStream(strTarget, System.IO.FileMode.OpenOrCreate))
                    //{
                    //    docServer.ExportToPdf(fs);
                    //}
                    fs.Close();
                    strReturn = new JavaScriptSerializer().Serialize(
                                    new entityProcessed<string>(codeProcessed.SUCCESS, sFileNmTrg)
                                );
                    #endregion
                }
                #endregion
                else
                {
                    strReturn = new JavaScriptSerializer().Serialize(
                                    new entityProcessed<string>(codeProcessed.SUCCESS, Path.GetFileName(strSource))
                                );
                }
            }
            catch (Exception ex)
            {

                throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                            codeProcessed.ERR_PROCESS,
                            "계약서 생성 중 오류가 발생하였습니다.\n- " + ex.Message)
                        )
                    );
            }
            #endregion

            

        }
        catch (Exception ex)
        {
            #region abnormal Closing.

            // abnormal Closing.
            //
            strReturn = ex.Message;

            #endregion
        }
        finally
        {
            #region release.

            // release.
            //
            if (objDr != null) objDr.Close();
            if (objCon != null) objCon.Close();

            #endregion
        }

        return strReturn;
    }
    #endregion

    protected static string getQuery(string strQueryID, entityNameValue objArgs)
    {
        #region get Query from DB.

        string strSQL = string.Empty;
        string strBody = string.Empty;
        string strZQuery = "SELECT qry_sel AS QUERY_SELECT FROM ZQUERY WHERE qry_id = '{0}'";

        strSQL = string.Format(@strZQuery, strQueryID);

        using (SqlConnection objCon = new SqlConnection(ConfigurationManager.ConnectionStrings["PLMDB"].ConnectionString))
        using (SqlCommand objCmd = new SqlCommand(strSQL, objCon))
        {
            objCon.Open();

            try
            {
                using (SqlDataReader dr = objCmd.ExecuteReader())
                {
                    if (dr.Read())
                    {
                        strBody = dr["QUERY_SELECT"].ToString();
                    }
                    else
                    {
                        throw new Exception(
                            "관련 Query를 찾을 수 없습니다.");
                    }
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

            objCon.Close();
        }

        #endregion

        #region bind Argument to Query.

        bindArg(strQueryID, ref strBody, objArgs);

        #endregion

        return strBody;

    }

    protected static void bindArg(string strQueryID, ref string strBody, entityNameValue objArgs)
    {

        #region create Query.

        string strSQL = string.Empty;
        string strZArg = "SELECT arg_id AS ARG_ID, arg_tp AS ARG_TYPE, arg_qry AS ARG_QUERY FROM ZQUERY_ARG WHERE qry_id = '{0}'";
        Hashtable tblSelect = new Hashtable();

        if (objArgs.getSize() > 0)
        {
            #region get Argument from DB.

            strSQL = string.Format(@strZArg, strQueryID);
            using (SqlConnection objCon = new SqlConnection(ConfigurationManager.ConnectionStrings["PLMDB"].ConnectionString))
            using (SqlCommand objCmd = new SqlCommand(strSQL, objCon))
            {
                objCon.Open();

                try
                {

                    using (SqlDataReader dr = objCmd.ExecuteReader())
                    {
                        while (dr.Read())
                        {
                            tblSelect.Add(
                                dr["ARG_ID"].ToString(),
                                new cDBArgument(
                                    dr["ARG_TYPE"].ToString(),
                                    dr["ARG_QUERY"].ToString())
                                );
                        }

                    }

                }
                catch (SqlException ex)
                {
                    throw new Exception(
                        new JavaScriptSerializer().Serialize(
                            new entityProcessed<string>(
                                codeProcessed.ERR_SQL,
                                "Query Argument 조회에 실패하였습니다.\n- " + ex.Message)
                            )
                        );
                }
                catch (Exception ex)
                {
                    throw new Exception(
                        new JavaScriptSerializer().Serialize(
                            new entityProcessed<string>(
                                codeProcessed.ERR_PROCESS,
                                "Query Argument 조회에 실패하였습니다.\n- " + ex.Message)
                            )
                        );
                }


                objCon.Close();
            }


            #endregion

            #region bind Argument to Query.

            try
            {
                for (int iAry = 0; iAry < objArgs.getSize(); iAry++)
                {
                    string strArg = objArgs.NAME[iAry];
                    cDBArgument objArg = (cDBArgument)tblSelect[strArg];
                    if (objArg == null)
                    {
                        throw new Exception(
                            strArg + " - 관련 Argument를 찾을 수 없습니다.");
                    }
                    strBody = objArg.convertWhere(
                                        strBody,
                                        strQueryID,
                                        strArg,
                                        HttpUtility.UrlDecode(objArgs.getValue(strArg))
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

            #endregion
        }

        #endregion

    }

    protected static string getTemplate(string doc_id)
    {
        string file = string.Empty;

        try
        {
            string strQuery = string.Format("SELECT FILE_PATH + FILE_ID + '.' + FILE_EXT AS DOC_FILE FROM ZFILE A WHERE A.FILE_ID = (SELECT MAX(CASE WHEN EDIT_YN = '1' THEN FILE_ID ELSE FILE_PID END) FROM ECM_DOCUMENT_FILE WHERE DOC_ID = {0} AND DOC_TP = '1')", doc_id);
            objCmd.CommandText = strQuery;

            using (objDr = objCmd.ExecuteReader())
            {
                if (objDr.Read()) file = objDr[0].ToString();
            }
        }
        catch (SqlException ex)
        {
            throw new Exception(ex.Message);
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }

        return file;
    }

    protected static DataTable convertMergeDT(DataTable dt)
    {
        DataTable mmdt = new DataTable();                 //datatable for merge
        int colnum = 0;
        DataRow workrow = mmdt.NewRow();
        foreach (DataRow row in dt.Rows)
        {
            foreach (DataColumn column in dt.Columns)
            {
                if (column.ColumnName == "FIELD_NM")
                {
                    mmdt.Columns.Add(row[column].ToString());
                }
                else if (column.ColumnName == "VALUE")
                {
                    //mmdt.Rows.Add(row[column].ToString());
                    workrow[colnum] = row[column].ToString();
                    colnum++;
                }

            }
        }
        mmdt.Rows.Add(workrow);

        return mmdt;
    }

    protected static DataTable adjustDT(DataTable dt, string colForRemove)
    {
        dt.Columns.Remove(colForRemove);
        return dt;
    }

    protected static string getTemplate2(string doc_id)
    {
        string file = string.Empty;

        try
        {
            //entityNameValue objArg = new entityNameValue(true);
            //objArg.Add("arg_doc_id", doc_id);
            //objCmd.CommandText = getQuery("ECM_1020_9", objArg);
            string strQuery = string.Format("SELECT FILE_PATH + FILE_ID + '.' + FILE_EXT AS DOC_FILE FROM ZFILE A WHERE A.FILE_ID = (SELECT TOP 1 FILE_ID FROM ECM_DOCUMENT_FILE WHERE DOC_ID = {0} AND DOC_TP = '1')", doc_id);
            objCmd.CommandText = strQuery;

            using (objDr = objCmd.ExecuteReader())
            {
                if (objDr.Read()) file = objDr[0].ToString();
            }
        }
        catch (SqlException ex)
        {
            throw new Exception(ex.Message);
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }

        return file;
    }

    protected static bool getEditYn(string doc_id)
    {
        bool edit_yn = false;

        try
        {
            entityNameValue objArg = new entityNameValue(true);
            string qry = string.Format("SELECT TOP 1 EDIT_YN FROM ECM_DOCUMENT_FILE A WHERE A.DOC_TP = '1' AND A.DOC_ID = {0}", doc_id);
            objCmd.CommandText = qry;
            using (objDr = objCmd.ExecuteReader())
            {
                if (objDr.Read()) edit_yn = objDr[0].ToString().Equals("1");
            }
        }
        catch (SqlException ex)
        {
            throw new Exception(ex.Message);
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }

        return edit_yn;
    }

    protected static string getPstat(string doc_id)
    {
        string pstat = string.Empty;
        try
        {
            entityNameValue objArg = new entityNameValue(true);
            string qry = string.Format("SELECT PSTAT FROM ECM_DOCUMENT A WHERE A.DOC_ID = {0}", doc_id);
            objCmd.CommandText = qry;
            using (objDr = objCmd.ExecuteReader())
            {
                if (objDr.Read()) pstat = objDr[0].ToString();
            }
        }
        catch (SqlException ex)
        {
            throw new Exception(ex.Message);
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
        return pstat;
    }

    protected static string getSysField(string doc_id, string field_nm)
    {
        string sys_field = string.Empty;
        try
        {
            entityNameValue objArg = new entityNameValue(true);
            string qry = string.Format("SELECT dbo.fn_getECMSysField2({0}, '{1}')", doc_id, field_nm);
            objCmd.CommandText = qry;
            using (objDr = objCmd.ExecuteReader())
            {
                if (objDr.Read()) sys_field = objDr[0].ToString();
            }
        }
        catch (SqlException ex)
        {
            throw new Exception(ex.Message);
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
        return sys_field;
    }

    protected static string getSignImage(string doc_id, string sys_field)
    {
        string sign_image = string.Empty;
        try
        {
            entityNameValue objArg = new entityNameValue(true);
            string qry = string.Format("SELECT TOP 1 CASE WHEN '{1}' = 'SIGN_A' THEN '0000000000' ELSE REPLACE(RGST_NO, '-', '') END AS IMG FROM ECM_DOCUMENT_SUPP WHERE DOC_ID = {0} AND ('{1}' = 'SIGN_A' OR SUPP_TP = CASE '{1}' WHEN 'SIGN_B' THEN '2' WHEN 'SIGN_C' THEN '3' END) ", doc_id, sys_field);
            objCmd.CommandText = qry;
            using (objDr = objCmd.ExecuteReader())
            {
                if (objDr.Read()) sign_image = objDr[0].ToString();
            }
        }
        catch (SqlException ex)
        {
            throw new Exception(ex.Message);
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
        return sign_image;
    }

    protected static DataTable getData(string doc_id)
    {
        DataTable dt = new DataTable();

        try
        {
            entityNameValue objArg = new entityNameValue(true);
            objArg.Add("arg_doc_id", doc_id);
            objCmd.CommandText = getQuery("ECM_1020_8", objArg);
            using (objDr = objCmd.ExecuteReader())
            {
                dt.Load(objDr);
            }
        }
        catch (SqlException ex)
        {
            throw new Exception(ex.Message);
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }

        return dt;
    }

    protected static string findValue(DataTable dt, string field)
    {
        DataRow[] dr = dt.Select(string.Format("field_nm='{0}'", field));

        string rtn = string.Empty;

        if (!(dr == null || dr.Length == 0))
            rtn = dr[0]["value"].ToString();

        return string.IsNullOrEmpty(rtn) ? "" : rtn;

    }


}
