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
using System.IO;
using System.Runtime.InteropServices;
using System.Xml;
using System.Xml.Linq;

public partial class Job_DLG_TAXADJ_PDF : System.Web.UI.Page
{
    string strDataType = "ZF"; // File ID의 Prefix로만 사용함 by JJJ
    string strNetwork = "HTTP";

    protected void Page_Load(object sender, EventArgs e)
    {
        TimeSpan ts = new TimeSpan(0, 5, 0);
        this.AsyncTimeout = ts;
    }
    protected void ctlUpload_FileUploadComplete(object sender, DevExpress.Web.FileUploadCompleteEventArgs e)
    {
        #region 1. Mapping Argument.
        TimeSpan ts = new TimeSpan(0, 5, 0);
        this.AsyncTimeout = ts;

        // 1. Mapping Argument.
        //
        string strName = e.UploadedFile.FileName;
        string[] strFile = strName.Split('.');
        string strType = (strFile.Length > 1) ? strFile[strFile.Length - 1] : string.Empty;


        #endregion

        SqlConnection objCon = null;
        SqlTransaction objTran = null;
        SqlCommand objCmd = null;
        try
        {
            objCon = new SqlConnection(ConfigurationManager.ConnectionStrings["PLMDB"].ConnectionString);
            objCon.Open();
            objTran = objCon.BeginTransaction();

            string strSQL = "sp_getNewFileID";
            objCmd = new SqlCommand(strSQL, objCon, objTran);
            objCmd.CommandText = strSQL;
            objCmd.Parameters.AddWithValue("@FileName", strName);
            objCmd.Parameters.AddWithValue("@DataType", strDataType);
            objCmd.Parameters.AddWithValue("@NetworkCode", strNetwork);
            objCmd.Parameters.Add("@FileID", SqlDbType.VarChar, 20).Direction = ParameterDirection.Output;
            objCmd.Parameters.Add("@FilePath", SqlDbType.VarChar, 255).Direction = ParameterDirection.Output;
            objCmd.CommandType = CommandType.StoredProcedure;

            objCmd.ExecuteNonQuery();
            objTran.Commit();

            // 4. Get Result.
            string strID = objCmd.Parameters["@FileID"].Value.ToString();
            string strPath = objCmd.Parameters["@FilePath"].Value.ToString();
            //========================== 파일 경로 변경 =============================
            strPath = HttpContext.Current.Server.MapPath("~/") + "Files\\HRM\\TAXADJ\\" + String.Format("{0:yyyyMMdd}", DateTime.Today) + "\\";
            //=======================================================================
            //string strID = strID = Guid.NewGuid().ToString().Replace("{", "").Replace("}", "");

            if (string.IsNullOrEmpty(strID) || string.IsNullOrEmpty(strPath))
            {
                throw new Exception("저장할 파일 ID와 경로를 가져올 수 없습니다.");
            }

            if (!Directory.Exists(strPath)) Directory.CreateDirectory(strPath);
            string strFilePath = strPath + strID + (string.IsNullOrEmpty(strType) ? "" : "." + strType);
            e.UploadedFile.SaveAs(strFilePath);
            e.CallbackData = strID + "@" + strName + "@" + strType + "@" + strPath; //id, file, ext, path, option
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }
    private static bool ValidateFile(string strFile, string strPasswd, out string strMsg)
    {
        strMsg = string.Empty;
        bool bChk = false;
        long result = 0;

        byte[] baGenTime = new byte[1024];
        byte[] baHashAlg = new byte[1024];
        byte[] baHashVal = new byte[1024];
        byte[] baCertDN = new byte[1024];

        try
        {
            result = YesoneUtil.DSTSPdfSigVerifyF(strFile, baGenTime, baHashAlg, baHashVal, baCertDN);
            switch (result)
            {
                case 0:
                    bChk = true;
                    strMsg = "원본 파일입니다.";
                    break;
                case 2101:
                    strMsg = String.Format("문서가 변조되었습니다.");
                    break;
                case 2102:
                    strMsg = String.Format("TSA 서명 검증에 실패하였습니다.");
                    break;
                case 2103:
                    strMsg = String.Format("지원하지 않는 해쉬알고리즘 입니다.");
                    break;
                case 2104:
                    strMsg = String.Format("해당 파일을 읽을 수 없습니다.");
                    break;
                case 2105:
                    strMsg = String.Format("서명검증을 위한 API 처리 오류입니다.");
                    break;
                case 2106:
                    strMsg = String.Format("타임스탬프 토큰 데이터 파싱 오류입니다.");
                    break;
                case 2107:
                    strMsg = String.Format("TSA 인증서 처리 오류입니다.");
                    break;
                case 2108:
                    strMsg = String.Format("타임스탬프가 적용되지 않은 파일입니다.");
                    break;
                case 2109:
                    strMsg = String.Format("인증서 검증에 실패 하였습니다.");
                    break;
                default:
                    strMsg = String.Format("에러코드 미정의 error - [%d]", result);
                    break;
            }
        }
        catch(Exception e)
        {
            // 파일 다운로드
            strMsg = "간소화 사이트 API 프로그램이 설치되지 않았습니다." + e.Message;
        }

        if (bChk)
        {
            int fileSize = YesoneFile.NTS_GetFileSize(strFile, strPasswd, "XML", 0);
            if (fileSize == -10)
            {
                strMsg = "파일이 없거나 손상된 PDF 파일입니다.";
                bChk = false;
            }
            else if (fileSize == -11)
            {
                strMsg = "국세청에서 발급된 전자문서가 아닙니다.";
                bChk = false;
            }
            else if (fileSize == -13)
            {
                strMsg = "추출용 버퍼가 유효하지 않습니다.";
                bChk = false;
            }
            else if (fileSize == -200)
            {
                strMsg = "비밀번호가 틀립니다.";
                bChk = false;
            }
            else if (fileSize > 0)
            {
                byte[] buf = new byte[fileSize];
                fileSize = YesoneFile.NTS_GetFileBuf(strFile, strPasswd, "XML", buf, 0);
                if (fileSize > 0)
                {
                    strMsg = Encoding.UTF8.GetString(buf).Replace("\n", "\r\n");
                }
            }
        }
        return bChk;
    }
    private static cSaveRow mapField(cSaveRow row, XmlNode node, bool deep)
    {
        cSaveRow rtn = row;
        if(node.Name =="sum")
            rtn.setValue(convertField_2(node.Name), node.InnerText);
        for (int i = 0; i < node.Attributes.Count; i++)
        {
            try
            {
                if(node.Name == "sum")
                {
                    rtn.setValue(convertField_2(node.Attributes[i].Name), node.Attributes[i].Value);
                }else
                {
                    rtn.setValue(convertField(node.Attributes[i].Name), node.Attributes[i].Value);
                }
            }
            catch
            {
                continue;
            }
        }

        if (deep)
        {
            foreach (XmlNode child in node.ChildNodes)
            {
                try
                {
                    if (child.NodeType == XmlNodeType.Element && child.Attributes.Count > 0)
                        rtn = mapField(rtn, child, deep);
                    else
                        rtn.setValue(convertField(child.Name), child.InnerText);
                }
                catch
                {
                    continue;
                }
            }
        }
        return rtn;
        
    }
    private static string convertField_2(string filed1)     //added 170109 -- 2016연말정산
    {
        string rtn = string.Empty;
        switch (filed1)
        {
            case "hi_pmt":
            case "hi_ntf":
            case "ltrm_pmt":
            case "ltrm_ntf":
                rtn = filed1 + "_2";
                break;
            case "sum":
                rtn = "year_sum";
                break;
            default:
                rtn = filed1;
                break;
        }
        return rtn;
    }
    private static string convertField(string filed1)
    {
        string rtn = string.Empty;
        switch (filed1)
        {
            case "sum":
                rtn = "year_sum";
                break;
            case "mm":
            case "dd":
                rtn = "sub_key";
                break;
            default:
                rtn = filed1;
                break;
        }
        return rtn;
    }
    private static cSaveObject Yesone2DB(string emp_no, string year, string file_id, string user_id, string str)
    {
        cSaveObject OBJ = new cSaveObject();
        cSaveRow ROW;
        OBJ.ROWS = new List<cSaveRow>();

        XmlDocument doc = new XmlDocument();
        doc.LoadXml(str);

        string doc_type = doc.SelectSingleNode("yesone/doc/doc_type").InnerText;    // B:기본내역(연간), D:상세내역(월별/일별)
        string att_year = doc.SelectSingleNode("yesone/doc/att_year").InnerText;    // 귀속연도

        if (!att_year.Equals(year))
            throw new Exception(string.Format("귀속연도를 확인하세요.{0}", att_year));

        foreach (XmlNode node_form in doc.SelectNodes("yesone/form"))
        {
            foreach (XmlNode node_man in node_form.ChildNodes)
            {
                foreach (XmlNode node_data in node_man.ChildNodes)
                {
                    ROW = new cSaveRow();
                    OBJ.QUERY = "HRM_TAXADJ_PDF";
                    ROW.COLUMN = new List<string> { "emp_no", "adj_year", "form_cd", "dat_cd", "sub_key", "file_id", "resid", "name", "year_sum", "busnid", "trade_nm",
                        "acc_no", "goods_nm", "reg_dt", "insu1_resid", "insu1_nm", "insu2_resid_1", "insu2_nm_1", "insu2_resid_2", "insu2_nm_2", "insu2_resid_3",
                        "insu2_nm_3", "edu_tp", "course_cd", "subject_nm", "start_dt", "end_dt", "com_cd", "ann_tot_amt", "tax_year_amt", "ddct_bs_ass_amt",
                        "pension_cd", "ftyr_tot_amt", "ftyr_market_tot_amt", "ftyr_tmoney_tot_amt", "pre_tot_amt", "pre_market_tot_amt", "pre_tmoney_tot_amt",
                        "use_place_cd", "first_tot_amt", "second_tot_amt", "first_year_tot_amt", "second_year_tot_amt", "inqr_strt_mm", "inqr_end_mm", "lend_dt",
                        "lend_kd", "house_take_dt", "mort_setup_dt", "repay_years", "lend_goods_nm", "debt", "fixed_rate_debt", "not_defer_debt", "this_year_rede_amt",
                        "ddct", "saving_gubn", "lend_loan_amt", "pay_method", "donation_cd","sbdy_apln_sum","sum","conb_sum","apln","hi_yrs","ltrm_yrs","hi_ntf","ltrm_ntf",
                        "hi_pmt","ltrm_pmt","spym","jlc","ntf","pmt","wrkp_ntf","wrkp_pmt","mm","hi_ntf_2","hi_pmt_2","ltrm_ntf_2","ltrm_pmt_2","rgn_pmt","secu_no", "fund_nm", "fix_cd", "amt", "_CRUD" };
                    ROW.VALUE = new List<string>(new string[ROW.COLUMN.Count]);

                    ROW.setValue("emp_no", emp_no);
                    ROW.setValue("adj_year", year);
                    ROW.setValue("form_cd", node_form.Attributes["form_cd"].Value);
                    ROW.setValue("file_id", file_id);
                    ROW.setValue("_CRUD", "C");

                    ROW = mapField(ROW, node_man, false);
                    ROW = mapField(ROW, node_data, true);

                    if (node_data.SelectSingleNode("amt") == null)
                    {
                        #region 기본
                        OBJ.ROWS.Add(ROW);
                        #endregion
                    }
                    else
                    {
                        #region 월별/일별
                        foreach (XmlNode node_amt in node_data.SelectNodes("amt"))
                        {
                            cSaveRow ROW2 = new cSaveRow();
                            ROW2.COLUMN = ROW.COLUMN;
                            ROW2.VALUE = new List<string>(new string[ROW.COLUMN.Count]);

                            foreach (string col in ROW.COLUMN)
                            {
                                ROW2.setValue(col, ROW.getValue(col));
                            }
                            //ROW2.setValue("emp_no", emp_no);
                            //ROW2.setValue("adj_year", year);
                            //ROW2.setValue("form_cd", node_form.Attributes["form_cd"].Value);
                            //ROW2.setValue("file_id", file_id);
                            //ROW2.setValue("_CRUD", "C");

                            ROW2 = mapField(ROW2, node_man, false);
                            ROW2 = mapField(ROW2, node_data, true);

                            for (int i = 0; i < node_amt.Attributes.Count; i++)
                            {
                                try
                                {
                                    if(node_amt.Attributes[i].Name == "dd" || node_amt.Attributes[i].Name == "mm")
                                        ROW2.setValue(node_amt.Attributes[i].Name, node_amt.Attributes[i].Value);
                                    ROW2.setValue(convertField(node_amt.Attributes[i].Name), node_amt.Attributes[i].Value);
                                }
                                catch
                                {
                                    continue;
                                }
                            }
                            try
                            {
                                ROW2.setValue("amt", node_amt.InnerText);
                            }
                            catch
                            {
                                continue;
                            }
                            OBJ.ROWS.Add(ROW2);
                        }
                        #endregion
                    }
                }
            }
        }
        return OBJ;
    }

    #region Update() : Update Process

    /// <summary>
    /// Update() : Update Process
    ///     : Insert/Update/Delete Process to DB.
    ///     input : 
    ///         - DATA - Client Data (cSaveData)
    ///     output:
    ///         - success : Key List (cSavedData)
    ///         - else : entityProcessed (string)
    /// </summary>
    [WebMethod]
    public static string Update(cSaveData DATA)
    {
        #region check Argument.

        // check Argument.
        //
        if (DATA.getSize() <= 0)
        {
            return new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                                codeProcessed.ERR_PARAM,
                                "잘못된 호출입니다.")
                    );
        }

        #endregion

        string strReturn = string.Empty;
        List<cSavedData> lstSaved = new List<cSavedData>();
        cUpdate objUpdate = new cUpdate();
        try
        {
            objUpdate.initialize(false);

            #region Customize.

            //---------------------------------------------------------------------------
            string strKey = string.Empty;
            string strID = HttpUtility.UrlDecode(DATA.getObject(0).getFirst().getValue("file_id"));
            string strExt = HttpUtility.UrlDecode(DATA.getObject(0).getFirst().getValue("file_ext"));
            string strPath = HttpUtility.UrlDecode(DATA.getObject(0).getFirst().getValue("file_path"));
            string strPasswd = HttpUtility.UrlDecode(DATA.getObject(0).getFirst().getValue("passwd"));
            string strFile = strPath + strID + "." + strExt;
            string strDataTp = HttpUtility.UrlDecode(DATA.getObject(0).getFirst().getValue("data_tp"));
            string strDataKey = HttpUtility.UrlDecode(DATA.getObject(0).getFirst().getValue("data_key"));
            string strDataSubKey = HttpUtility.UrlDecode(DATA.getObject(0).getFirst().getValue("data_subkey"));

            // 연말정산 파일 체크
            string strMsg = string.Empty;
            if (ValidateFile(strFile, strPasswd, out strMsg))
            {
                // 기존 파일 삭제 후 추가 - 임시
                string strSQL = string.Format("DELETE FROM ZFILE WHERE FILE_ID <> '{0}' AND DATA_TP = '{1}' AND DATA_KEY = '{2}' AND DATA_SUBKEY = '{3}'", strID, strDataTp, strDataKey, strDataSubKey);
                new cDBQuery(ruleQuery.INLINE, strSQL).executeQuery(objUpdate.objCmd, true);
                cSaveObject OBJ = Yesone2DB(strDataKey, strDataSubKey, strID, DATA.USER, strMsg);
                DATA.OBJECTS.Add(OBJ);
            }
            else
            {
                // 파일삭제
                File.Delete(strFile);
                string strSQL = string.Format("DELETE FROM ZFILE WHERE FILE_ID = '{0}'", strID);
                new cDBQuery(ruleQuery.INLINE, strSQL).executeQuery(objUpdate.objCmd, true);
                return new JavaScriptSerializer().Serialize(
                    new entityProcessed<string>(
                            codeProcessed.ERR_PROCESS,
                            strMsg)
                    );
            }
            //---------------------------------------------------------------------------

            #endregion

            #region process Saving.

            // process Saving.
            //
            objUpdate.beginTran();
            for (int iAry = 0; iAry < DATA.getSize(); iAry++)
            {
                lstSaved.Add(
                    objUpdate.process(DATA.getObject(iAry), DATA.getUser())
                );
            }

            #endregion

            #region normal Closing.

            // normal Closing.
            //
            objUpdate.close(doTransaction.COMMIT);
            strReturn = new JavaScriptSerializer().Serialize(
                                new entityProcessed<List<cSavedData>>(
                                    codeProcessed.SUCCESS,
                                    lstSaved)
                            );

            #endregion
        }
        catch (Exception ex)
        {
            #region abnormal Closing.

            // abnormal Closing.
            //
            objUpdate.close(doTransaction.ROLLBACK);
            strReturn = new JavaScriptSerializer().Serialize(
                            new entityProcessed<string>(
                                    codeProcessed.ERR_PROCESS,
                                    ex.Message)
                            );

            #endregion
        }
        finally
        {
            #region release.

            // release.
            //
            objUpdate.release();

            #endregion
        }

        return strReturn;
    }
    #endregion

    #region Define Yesone Util

    class YesoneUtil
    {
        [DllImport("DSTSPDFSig_C.dll")]
        public static extern int DSTSPdfSigVerifyF([MarshalAs(UnmanagedType.LPStr)]string pram1, byte[] pram2, byte[] pram3, byte[] pram4, byte[] pram5);
    }
    class YesoneFile
    {
        [DllImport("ExportCustomFile.dll")]
        public static extern int NTS_GetFileSize([MarshalAs(UnmanagedType.LPStr)]string szIn, [MarshalAs(UnmanagedType.LPStr)]string szPassword, [MarshalAs(UnmanagedType.LPStr)]string szName, int bAnsi);

        [DllImport("ExportCustomFile.dll")]
        public static extern int NTS_GetFileBuf([MarshalAs(UnmanagedType.LPStr)]string szIn, [MarshalAs(UnmanagedType.LPStr)]string szPassword, [MarshalAs(UnmanagedType.LPStr)]string szName, [In, Out]byte[] pcBuffer, int bAnsi);
    }

    #endregion

}
