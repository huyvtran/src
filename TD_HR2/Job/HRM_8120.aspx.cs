using DevExpress.Spreadsheet;
using System;
using System.Collections;
using System.Configuration;
using System.Data.SqlClient;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Services;

public partial class JOB_HRM_8120 : System.Web.UI.Page
{

    protected static SqlConnection objCon = null;
    protected static SqlCommand objCmd = null;
    protected static SqlDataReader objDr = null;

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
    /// 
    [WebMethod]
    public static string Print(cRetrieveData DATA)
    {

        string strReturn = string.Empty;
        try
        {
            #region connect to DB.

            //  connect to DB.
            //
            try
            {
                objCon = new SqlConnection(
                                    ConfigurationManager.ConnectionStrings["PLMDB"].ConnectionString);
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
            string strPostfix = DATA.getOption("ANNTITLE") + "_" + DATA.getOption("ANNCAT02") + "_" + DATA.getOption("ANNCAT01");
            foreach (char c in (System.IO.Path.GetInvalidFileNameChars()))
            {
                strPostfix = strPostfix.Replace(c.ToString(), "");
            }
            strPostfix = strPostfix.Replace("[", "").Replace("]", "");

            string sFileIdSrc = (DATA.getOption("ANNKEY").CompareTo("ANN2015-0005") < 0 ? "HRM_8120" : "HRM_8120_1"); // strPage;
            string sFileIdTrg = sFileIdSrc + "_" + strPostfix; // strUser;
            string sFileNmTrg = sFileIdTrg + "." + strPrint;
            string strRoot = HttpContext.Current.Server.MapPath("~/");
            string strSource = strRoot + "Report/" + strPage + "/" + sFileIdSrc + ".xlsx";
            string strTarget = strRoot + "Report/" + strPage + "/" + sFileIdTrg;
            object objMissing = Type.Missing;
            object varMissing = System.Reflection.Missing.Value;

            Workbook objWorkBook;
            Worksheet objWorkSheet;
            Range objRange;

            try
            {
                System.IO.File.Copy(strSource, strTarget + ".xlsx", true);
                objWorkBook = new Workbook();
                objWorkBook.LoadDocument(strTarget + ".xlsx", DocumentFormat.Xlsx);
                objWorkSheet = objWorkBook.Worksheets[0];
            }
            catch (Exception ex)
            {
                throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                            codeProcessed.ERR_PROCESS,
                            "Office 설정 중에 오류가 발생하였습니다.\n- " + ex.Message)
                        )
                    );
            }

            #endregion

            #region process Query & set to Print.

            try
            {
                entityNameValue objArg = new entityNameValue(true);
                string strAnnKey = DATA.getOption("ANNKEY");
                objArg.Add("arg_ann_key", strAnnKey);
                objArg.Add("arg_app_key", "");

                foreach (string strAppKey in DATA.getOption("APPKEY").Split(','))
                {
                    objArg.setValue("arg_app_key", strAppKey);

                    objWorkBook.Worksheets.Add();
                    objWorkBook.Worksheets[objWorkBook.Worksheets.Count - 1].CopyFrom(objWorkBook.Worksheets[0]);
                    objWorkSheet = objWorkBook.Worksheets[objWorkBook.Worksheets.Count - 1];

                    if(strAnnKey.CompareTo("ANN2015-0005") < 0)
                    {
                        #region 인적사항

                        objCmd.CommandText = getQuery("HRM_8120_P1", objArg);
                        objDr = objCmd.ExecuteReader();

                        while (objDr.Read())
                        {
                            //objWorkSheet.Name = objDr["app_nm_kr"].ToString();
                            setSheetName(ref objWorkSheet, objDr["app_nm_kr"].ToString());

                            // 인적
                            objWorkSheet.Cells["F6"].SetValue(objDr["ann_cat01"].ToString());           // 구분
                            objWorkSheet.Cells["K6"].SetValue(objDr["ann_cat02"].ToString());           // 지원부문
                            objWorkSheet.Cells["F9"].SetValue(objDr["app_nm_kr"].ToString());           // 성명(한글)
                            objWorkSheet.Cells["K9"].SetValue(objDr["reg_no"].ToString());              // 주민등록번호
                            objWorkSheet.Cells["F10"].SetValue(objDr["app_nm_en"].ToString());          // 성명(영문)
                            objWorkSheet.Cells["K10"].SetValue(objDr["age"].ToString());                // 나이
                            objWorkSheet.Cells["P10"].SetValue(objDr["sex"].ToString());                // 성별
                            objWorkSheet.Cells["F11"].SetValue(objDr["app_nm_cn"].ToString());          // 성명(한자)
                            objWorkSheet.Cells["K11"].SetValue(objDr["email"].ToString());              // E-Mail
                            objWorkSheet.Cells["F12"].SetValue(objDr["addr"].ToString());               // 거주지 주소
                            objWorkSheet.Cells["F13"].SetValue(objDr["tel_no"].ToString());             // 전화번호
                            objWorkSheet.Cells["K13"].SetValue(objDr["mobile_no"].ToString());          // 휴대폰
                            objWorkSheet.Cells["P13"].SetValue(objDr["d1_inf01"].ToString() + " / " + objDr["d1_inf02"].ToString());   // 희망연봉/직위

                            // 병역
                            objWorkSheet.Cells["B27"].SetValue(objDr["d1_inf03"].ToString());           // 구분
                            objWorkSheet.Cells["D27"].SetValue(objDr["d1_inf04"].ToString());           // 군별
                            objWorkSheet.Cells["G27"].SetValue(objDr["d1_inf05"].ToString());           // 계급
                            objWorkSheet.Cells["J27"].SetValue(objDr["d1_inf06"].ToString() + " ~ " + objDr["d1_inf07"].ToString());   // 복무기간
                            objWorkSheet.Cells["P27"].SetValue(objDr["d1_inf08"].ToString());           // 면제사유

                            // 건강
                            objWorkSheet.Cells["B30"].SetValue(objDr["d1_inf15"].ToString());           // 신장
                            objWorkSheet.Cells["E30"].SetValue(objDr["d1_inf16"].ToString());           // 체중
                            objWorkSheet.Cells["H30"].SetValue(objDr["d1_inf17"].ToString());           // 혈액형
                            objWorkSheet.Cells["K30"].SetValue(objDr["d1_inf18"].ToString() + " / " + objDr["d1_inf19"].ToString());   // 시력
                            objWorkSheet.Cells["O30"].SetValue(objDr["d1_inf20"].ToString());           // 신체장애

                            // 기타
                            objWorkSheet.Cells["C50"].SetValue(objDr["d1_inf09"].ToString());           // 부모생존여부
                            objWorkSheet.Cells["I50"].SetValue(objDr["d1_inf11"].ToString());           // 종교
                            objWorkSheet.Cells["O50"].SetValue(objDr["d1_inf13"].ToString());           // 결혼기념일
                            objWorkSheet.Cells["C51"].SetValue(objDr["d1_inf10"].ToString());           // 형제자매
                            objWorkSheet.Cells["I51"].SetValue(objDr["d1_inf12"].ToString());           // 취미
                            objWorkSheet.Cells["O51"].SetValue(objDr["d1_inf14"].ToString());           // 보훈대상여부

                            objWorkSheet.Cells["E430"].SetValue(objDr["d1_inf23"].ToString());          // 추천자
                            objWorkSheet.Cells["J430"].SetValue(objDr["d1_inf24"].ToString());          // 부서
                            objWorkSheet.Cells["O430"].SetValue(objDr["d1_inf25"].ToString());          // 관계
                            objWorkSheet.Cells["E431"].SetValue(objDr["d1_inf21"].ToString());          // AP시스템을 알게 된 동기
                            objWorkSheet.Cells["E432"].SetValue(objDr["d1_inf22"].ToString());          // 채용정보를 알게 된 방법

                            // 자기소개
                            objWorkSheet.Cells["C446"].SetValue("'" + objDr["d1_inf26"].ToString());    // 성장과정(학교생활)
                            objWorkSheet.Cells["C471"].SetValue("'" + objDr["d1_inf31"].ToString());    // 성격/생활신조
                            objWorkSheet.Cells["C501"].SetValue("'" + objDr["d1_inf32"].ToString());    // 특기분야
                            objWorkSheet.Cells["C526"].SetValue("'" + objDr["d1_inf33"].ToString());    // 지원동기
                            objWorkSheet.Cells["C556"].SetValue("'" + objDr["d1_inf34"].ToString());    // 희망업무/계획

                            objWorkSheet.Range["C446:C446"].Font.Size = (System.Text.ASCIIEncoding.Unicode.GetByteCount(objDr["d1_inf26"].ToString()) > 2300 ? 8 : 9);
                            objWorkSheet.Range["C471:C471"].Font.Size = (System.Text.ASCIIEncoding.Unicode.GetByteCount(objDr["d1_inf31"].ToString()) > 2300 ? 8 : 9);
                            objWorkSheet.Range["C501:C501"].Font.Size = (System.Text.ASCIIEncoding.Unicode.GetByteCount(objDr["d1_inf32"].ToString()) > 2300 ? 8 : 9);
                            objWorkSheet.Range["C526:C526"].Font.Size = (System.Text.ASCIIEncoding.Unicode.GetByteCount(objDr["d1_inf32"].ToString()) > 2300 ? 8 : 9);
                            objWorkSheet.Range["C556:C556"].Font.Size = (System.Text.ASCIIEncoding.Unicode.GetByteCount(objDr["d1_inf34"].ToString()) > 2300 ? 8 : 9);

                            // 사진
                            if (objDr["d1_inf30"].ToString() != "")
                            {
                                //string imgPath = System.IO.Path.Combine(strRoot, "Files\\Recruit\\" + objDr["d1_inf30"]);
                                //if (System.IO.File.Exists(imgPath))
                                //{
                                //    //objWorkSheet.Shapes.AddPicture2(imgPath,
                                //    //    MsoTriState.msoFalse,
                                //    //    MsoTriState.msoTrue,
                                //    //    508, 84, 98, 128,
                                //    //    MsoPictureCompress.msoPictureCompressTrue);

                                //    objWorkSheet.Shapes.AddPicture(imgPath,
                                //        Microsoft.Office.Core.MsoTriState.msoFalse,
                                //        Microsoft.Office.Core.MsoTriState.msoCTrue,
                                //        508, 84, 98, 128);
                                //}

                                //string imgPath = HttpContext.Current.Request.Url.Scheme + "://" + HttpContext.Current.Request.Url.Authority + HttpContext.Current.Request.ApplicationPath;
                                //imgPath += "/Files/Recruit/" + objDr["d1_inf30"].ToString();
                                string imgPath = "http://hr.techdata.co.kr/Files/Recruit/" + objDr["d1_inf30"].ToString();
                                System.Net.WebRequest request = System.Net.WebRequest.Create(imgPath);
                                try
                                {
                                    System.Net.HttpWebResponse response = (System.Net.HttpWebResponse)request.GetResponse();
                                    if (response.StatusDescription == "OK")
                                    {
                                        SpreadsheetImageSource imageSource = SpreadsheetImageSource.FromUri(imgPath, objWorkBook);
                                        objWorkSheet.Pictures.AddPicture(imageSource, objWorkSheet.Range["A6:C13"], true);
                                        //objWorkSheet.Pictures.AddPicture(imageSource, 2, 84, 98, 130, true);
                                    }
                                }
                                catch(Exception ex)
                                {
                                    string err = ex.Message;
                                }

                                //objWorkSheet.Shapes.AddPicture("http://recruit.apsystems.co.kr/Files/Recruit/" + objDr["d1_inf30"],
                                //    Microsoft.Office.Core.MsoTriState.msoFalse,
                                //    Microsoft.Office.Core.MsoTriState.msoCTrue,
                                //    508, 84, 98, 128);
                            }

                        }
                        objDr.Close();

                        #endregion

                        #region 학력사항

                        objCmd.CommandText = getQuery("HRM_8120_P2", objArg);
                        objDr = objCmd.ExecuteReader();

                        while (objDr.Read())
                        {
                            objWorkSheet.Cells["C17"].SetValue(objDr["d2_inf02_1"].ToString());     // 고등학교 입학연월
                            objWorkSheet.Cells["E17"].SetValue(objDr["d2_inf03_1"].ToString());     // 고등학교 졸업연월
                            objWorkSheet.Cells["G17"].SetValue(objDr["d2_inf01_1"].ToString());     // 고등학교 학교명
                            objWorkSheet.Cells["I17"].SetValue(objDr["d2_inf04_1"].ToString());     // 고등학교 전공
                                                                                          //                        objWorkSheet.Cells[17, 12] = objDr["d2_inf06_1"].ToString();   // 고등학교 주/야
                            objWorkSheet.Cells["K17"].SetValue(objDr["d2_inf05_1"].ToString());     // 부전공
                            objWorkSheet.Cells["M17"].SetValue(objDr["d2_inf11_1"].ToString());     // ?년제
                            objWorkSheet.Cells["N17"].SetValue(objDr["d2_inf07_1"].ToString());     // 고등학교 졸업구분
                            objWorkSheet.Cells["O17"].SetValue(objDr["d2_inf08_1"].ToString());     // 고등학교 소재지
                            objWorkSheet.Cells["Q17"].SetValue(objDr["d2_inf09_1"].ToString());     // 고등학교 성적/만점

                            objWorkSheet.Cells["C18"].SetValue(objDr["d2_inf02_2"].ToString());     // 전문대 입학연월
                            objWorkSheet.Cells["E18"].SetValue(objDr["d2_inf03_2"].ToString());     // 전문대 졸업연월
                            objWorkSheet.Cells["G18"].SetValue(objDr["d2_inf01_2"].ToString());     // 전문대 학교명
                            objWorkSheet.Cells["I18"].SetValue(objDr["d2_inf04_2"].ToString());     // 전문대 전공
                                                                                          //                        objWorkSheet.Cells[18, 12] = objDr["d2_inf06_2"].ToString();   // 전문대 주/야
                            objWorkSheet.Cells["K18"].SetValue(objDr["d2_inf05_2"].ToString());     // 부전공
                            objWorkSheet.Cells["M18"].SetValue(objDr["d2_inf11_2"].ToString());     // ?년제
                            objWorkSheet.Cells["N18"].SetValue(objDr["d2_inf07_2"].ToString());     // 전문대 졸업구분
                            objWorkSheet.Cells["O18"].SetValue(objDr["d2_inf08_2"].ToString() + "/" + objDr["d2_inf12_2"].ToString());   // 전문대 소재지
                            objWorkSheet.Cells["Q18"].SetValue(objDr["d2_inf09_2"].ToString());     // 전문대 성적/만점


                            objWorkSheet.Cells["C19"].SetValue(objDr["d2_inf02_3"].ToString());     // 대학교 입학연월
                            objWorkSheet.Cells["E19"].SetValue(objDr["d2_inf03_3"].ToString());     // 대학교 졸업연월
                            objWorkSheet.Cells["G19"].SetValue(objDr["d2_inf01_3"].ToString());     // 대학교 학교명
                            objWorkSheet.Cells["I19"].SetValue(objDr["d2_inf04_3"].ToString());     // 대학교 전공
                                                                                          //                        objWorkSheet.Cells[19, 12] = objDr["d2_inf06_3"].ToString();   // 대학교 주/야
                            objWorkSheet.Cells["K19"].SetValue(objDr["d2_inf05_3"].ToString());     // 부전공
                            objWorkSheet.Cells["M19"].SetValue(objDr["d2_inf11_3"].ToString());     // ?년제
                            objWorkSheet.Cells["N19"].SetValue(objDr["d2_inf07_3"].ToString());     // 대학교 졸업구분
                            objWorkSheet.Cells["O19"].SetValue(objDr["d2_inf08_3"].ToString() + "/" + objDr["d2_inf12_3"].ToString());   // 대학교 소재지
                            objWorkSheet.Cells["Q19"].SetValue(objDr["d2_inf09_3"].ToString());     // 대학교 성적/만점

                            objWorkSheet.Cells["C20"].SetValue(objDr["d2_inf02_4"].ToString());     // 대학교 입학연월
                            objWorkSheet.Cells["E20"].SetValue(objDr["d2_inf03_4"].ToString());     // 대학교 졸업연월
                            objWorkSheet.Cells["G20"].SetValue(objDr["d2_inf01_4"].ToString());     // 대학교 학교명
                            objWorkSheet.Cells["I20"].SetValue(objDr["d2_inf04_4"].ToString());     // 대학교 전공
                                                                                          //                        objWorkSheet.Cells[20, 12] = objDr["d2_inf06_4"].ToString();   // 대학교 주/야
                            objWorkSheet.Cells["K20"].SetValue(objDr["d2_inf05_4"].ToString());     // 부전공
                            objWorkSheet.Cells["M20"].SetValue(objDr["d2_inf11_4"].ToString());     // ?년제
                            objWorkSheet.Cells["N20"].SetValue(objDr["d2_inf07_4"].ToString());     // 대학교 졸업구분
                            objWorkSheet.Cells["O20"].SetValue(objDr["d2_inf08_4"].ToString() + "/" + objDr["d2_inf12_4"].ToString());   // 대학교 소재지
                            objWorkSheet.Cells["Q20"].SetValue(objDr["d2_inf09_4"].ToString());     // 대학교 성적/만점

                            objWorkSheet.Cells["C21"].SetValue(objDr["d2_inf02_8"].ToString());     // 대학원(석사) 입학연월
                            objWorkSheet.Cells["E21"].SetValue(objDr["d2_inf03_8"].ToString());     // 대학원(석사) 졸업연월
                            objWorkSheet.Cells["G21"].SetValue(objDr["d2_inf01_8"].ToString());     // 대학원(석사) 학교명
                            objWorkSheet.Cells["I21"].SetValue(objDr["d2_inf04_8"].ToString());     // 대학원(석사) 전공
                                                                                          //                        objWorkSheet.Cells[21, 12] = objDr["d2_inf06_8"].ToString();   // 대학원(석사) 주/야
                            objWorkSheet.Cells["K21"].SetValue(objDr["d2_inf05_8"].ToString());     // 부전공
                            objWorkSheet.Cells["M21"].SetValue(objDr["d2_inf11_8"].ToString());     // ?년제
                            objWorkSheet.Cells["N21"].SetValue(objDr["d2_inf07_8"].ToString());     // 대학원(석사) 졸업구분
                            objWorkSheet.Cells["O21"].SetValue(objDr["d2_inf08_8"].ToString() + "/" + objDr["d2_inf12_8"].ToString());   // 대학원(석사) 소재지
                            objWorkSheet.Cells["Q21"].SetValue(objDr["d2_inf09_8"].ToString());     // 대학원(석사) 성적/만점
                            objWorkSheet.Cells["E22"].SetValue(objDr["d2_inf05_8"].ToString());     // 대학원(석사) 세부전공
                            objWorkSheet.Cells["K22"].SetValue(objDr["d2_inf10_8"].ToString());     // 대학원(석사) 논문제목

                            objWorkSheet.Cells["C23"].SetValue(objDr["d2_inf02_9"].ToString());     // 대학원(박사) 입학연월
                            objWorkSheet.Cells["E23"].SetValue(objDr["d2_inf03_9"].ToString());     // 대학원(박사) 졸업연월
                            objWorkSheet.Cells["G23"].SetValue(objDr["d2_inf01_9"].ToString());     // 대학원(박사) 학교명
                            objWorkSheet.Cells["I23"].SetValue(objDr["d2_inf04_9"].ToString());     // 대학원(박사) 전공
                                                                                          //                        objWorkSheet.Cells[23, 12] = objDr["d2_inf06_9"].ToString();   // 대학원(박사) 주/야
                            objWorkSheet.Cells["K23"].SetValue(objDr["d2_inf05_9"].ToString());     // 부전공 
                            objWorkSheet.Cells["M23"].SetValue(objDr["d2_inf11_9"].ToString());     // ?년제
                            objWorkSheet.Cells["N23"].SetValue(objDr["d2_inf07_9"].ToString());     // 대학원(박사) 졸업구분
                            objWorkSheet.Cells["O23"].SetValue(objDr["d2_inf08_9"].ToString() + "/" + objDr["d2_inf12_9"].ToString());   // 대학원(박사) 소재지
                            objWorkSheet.Cells["Q23"].SetValue(objDr["d2_inf09_9"].ToString());     // 대학원(박사) 성적/만점
                            objWorkSheet.Cells["E24"].SetValue(objDr["d2_inf05_9"].ToString());     // 대학원(박사) 세부전공
                            objWorkSheet.Cells["K24"].SetValue(objDr["d2_inf10_9"].ToString());     // 대학원(박사) 논문제목
                        }
                        objDr.Close();

                        #endregion

                        #region 가족사항

                        objCmd.CommandText = getQuery("HRM_8120_P4", objArg);
                        objDr = objCmd.ExecuteReader();

                        int iRow = 34;
                        int iCnt = 0;
                        while (objDr.Read())
                        {
                            objWorkSheet.Cells[string.Format("A{0}", iRow)].SetValue(objDr["relation"].ToString());     // 관계
                            objWorkSheet.Cells[string.Format("C{0}", iRow)].SetValue(objDr["name"].ToString());         // 성명
                            objWorkSheet.Cells[string.Format("F{0}", iRow)].SetValue(objDr["age"].ToString());          // 연령
                            objWorkSheet.Cells[string.Format("I{0}", iRow)].SetValue(objDr["co_nm"].ToString());        // 현직장명
                            objWorkSheet.Cells[string.Format("M{0}", iRow)].SetValue(objDr["grade_nm"].ToString());     // 직위
                            objWorkSheet.Cells[string.Format("Q{0}", iRow)].SetValue(objDr["live_yn"].ToString());      // 동거

                            iRow++;
                            iCnt++;
                            if (iCnt > 16) break;
                        }
                        objDr.Close();

                        #endregion

                        #region 경력사항

                        objCmd.CommandText = getQuery("HRM_8120_P3", objArg);
                        objDr = objCmd.ExecuteReader();

                        iRow = 60;
                        iCnt = 0;
                        int[] iRow2 = { 80, 108, 136, 164, 192, 220, 248, 276, 304, 332, 360 };
                        int iCnt2 = 0;
                        while (objDr.Read())
                        {
                            objWorkSheet.Cells[string.Format("A{0}", iRow)].SetValue(objDr["d3_inf01"].ToString());                     // 회사명
                            objWorkSheet.Cells[string.Format("C{0}", iRow)].SetValue(objDr["d3_inf02"].ToString());                     // 소재지
                            objWorkSheet.Cells[string.Format("F{0}", iRow)].SetValue(objDr["d3_inf03"].ToString() + " ~ " + objDr["d3_inf04"].ToString());  // 근무기간
                            objWorkSheet.Cells[string.Format("I{0}", iRow)].SetValue(objDr["d3_inf05"].ToString());                     // 직위
                            objWorkSheet.Cells[string.Format("K{0}", iRow)].SetValue(objDr["d3_inf06"].ToString());                     // 담당업무
                            objWorkSheet.Cells[string.Format("N{0}", iRow)].SetValue(objDr["d3_inf07"].ToString());                     // 연봉
                            objWorkSheet.Cells[string.Format("P{0}", iRow)].SetValue(objDr["d3_inf08"].ToString());                     // 퇴직(이직)사유

                            // 상세 내역
                            objWorkSheet.Cells[string.Format("C{0}", iRow2[iCnt])].SetValue(objDr["d3_inf01"].ToString());              // 회사명
                            objWorkSheet.Cells[string.Format("O{0}", iRow2[iCnt])].SetValue(objDr["d3_inf02"].ToString());              // 소재지
                            objWorkSheet.Cells[string.Format("C{0}", iRow2[iCnt] + 1)].SetValue(objDr["d3_inf03"].ToString() + " ~ " + objDr["d3_inf04"].ToString());           // 근무기간
                            objWorkSheet.Cells[string.Format("I{0}", iRow2[iCnt] + 1)].SetValue(objDr["d3_inf07"].ToString());          // 연봉
                            objWorkSheet.Cells[string.Format("O{0}", iRow2[iCnt] + 1)].SetValue(objDr["d3_inf08"].ToString());          // 퇴직(이직)사유
                            objWorkSheet.Cells[string.Format("C{0}", iRow2[iCnt] + 2)].SetValue(objDr["d3_inf09"].ToString());          // 사업품목
                            objWorkSheet.Cells[string.Format("I{0}", iRow2[iCnt] + 2)].SetValue(objDr["d3_inf11"].ToString() + " 억 ( " + objDr["d3_inf10"].ToString() + " )"); // 매출액(연도)
                            objWorkSheet.Cells[string.Format("O{0}", iRow2[iCnt] + 2)].SetValue(objDr["d3_inf12"].ToString());          // 종업원수
                            objWorkSheet.Cells[string.Format("C{0}", iRow2[iCnt] + 3)].SetValue("'" + objDr["d3_inf13"].ToString());    // 주요 경력 및 보유 기술

                            iRow++;
                            iCnt++;
                            if (iCnt > 11) break;
                            iCnt2++;
                        }
                        objDr.Close();

                        #endregion

                        #region 외국어

                        objCmd.CommandText = getQuery("HRM_8120_P5", objArg);
                        objDr = objCmd.ExecuteReader();

                        iRow = 387;
                        iCnt = 0;
                        while (objDr.Read())
                        {
                            objWorkSheet.Cells[string.Format("B{0}", iRow)].SetValue(objDr["d5_inf01"].ToString()); // 외국어명
                            objWorkSheet.Cells[string.Format("F{0}", iRow)].SetValue(objDr["d5_inf02"].ToString()); // 회화
                            objWorkSheet.Cells[string.Format("H{0}", iRow)].SetValue(objDr["d5_inf03"].ToString()); // 독해
                            objWorkSheet.Cells[string.Format("J{0}", iRow)].SetValue(objDr["d5_inf04"].ToString()); // TEST명
                            objWorkSheet.Cells[string.Format("M{0}", iRow)].SetValue(objDr["d5_inf05"].ToString()); // 종합점수
                            objWorkSheet.Cells[string.Format("O{0}", iRow)].SetValue(objDr["d5_inf07"].ToString()); // 등급
                            objWorkSheet.Cells[string.Format("Q{0}", iRow)].SetValue(objDr["d5_inf06"].ToString()); // 취득연도

                            iRow++;
                            iCnt++;
                            if (iCnt > 5) break;
                        }
                        objDr.Close();

                        #endregion

                        #region 수상경력

                        objCmd.CommandText = getQuery("HRM_8120_P6", objArg);
                        objDr = objCmd.ExecuteReader();

                        iRow = 394;
                        iCnt = 0;
                        while (objDr.Read())
                        {
                            objWorkSheet.Cells[string.Format("B{0}", iRow)].SetValue(objDr["d6_inf01"].ToString()); // 수상내용
                            objWorkSheet.Cells[string.Format("G{0}", iRow)].SetValue(objDr["d6_inf02"].ToString()); // 수상처
                            objWorkSheet.Cells[string.Format("K{0}", iRow)].SetValue(objDr["d6_inf03"].ToString()); // 수상연도
                            objWorkSheet.Cells[string.Format("M{0}", iRow)].SetValue(objDr["d6_inf04"].ToString()); // 비고

                            iRow++;
                            iCnt++;
                            if (iCnt > 5) break;
                        }
                        objDr.Close();

                        #endregion

                        #region 자격/면허

                        objCmd.CommandText = getQuery("HRM_8120_P7", objArg);
                        objDr = objCmd.ExecuteReader();

                        iRow = 401;
                        iCnt = 0;
                        while (objDr.Read())
                        {
                            objWorkSheet.Cells[string.Format("B{0}", iRow)].SetValue(objDr["d7_inf01"].ToString()); // 자격명
                            objWorkSheet.Cells[string.Format("G{0}", iRow)].SetValue(objDr["d7_inf02"].ToString()); // 등급
                            objWorkSheet.Cells[string.Format("K{0}", iRow)].SetValue(objDr["d7_inf03"].ToString()); // 취득일자
                            objWorkSheet.Cells[string.Format("M{0}", iRow)].SetValue(objDr["d7_inf04"].ToString()); // 발급처

                            iRow++;
                            iCnt++;
                            if (iCnt > 5) break;
                        }
                        objDr.Close();

                        #endregion

                        #region 전산능력

                        objCmd.CommandText = getQuery("HRM_8120_P8", objArg);
                        objDr = objCmd.ExecuteReader();

                        iRow = 408;
                        iCnt = 0;
                        while (objDr.Read())
                        {
                            objWorkSheet.Cells[string.Format("B{0}", iRow)].SetValue(objDr["d8_inf01"].ToString()); // 구분
                            objWorkSheet.Cells[string.Format("G{0}", iRow)].SetValue(objDr["d8_inf02"].ToString()); // Language/자격구분/상품명
                            objWorkSheet.Cells[string.Format("K{0}", iRow)].SetValue(objDr["d8_inf03"].ToString()); // 능력정도
                            objWorkSheet.Cells[string.Format("M{0}", iRow)].SetValue(objDr["d8_inf04"].ToString()); // 경험/기간

                            iRow++;
                            iCnt++;
                            if (iCnt > 14) break;
                        }
                        objDr.Close();

                        #endregion

                        #region 해외여행

                        objCmd.CommandText = getQuery("HRM_8120_P9", objArg);
                        objDr = objCmd.ExecuteReader();

                        iRow = 423;
                        iCnt = 0;
                        while (objDr.Read())
                        {
                            objWorkSheet.Cells[string.Format("B{0}", iRow)].SetValue(objDr["d9_inf01"].ToString()); // 국명
                            objWorkSheet.Cells[string.Format("G{0}", iRow)].SetValue(objDr["d9_inf02"].ToString()); // 체류기간
                            objWorkSheet.Cells[string.Format("K{0}", iRow)].SetValue(objDr["d9_inf03"].ToString()); // 여행목적
                            objWorkSheet.Cells[string.Format("O{0}", iRow)].SetValue(objDr["d9_inf04"].ToString()); // 발급처

                            iRow++;
                            iCnt++;
                            if (iCnt > 5) break;
                        }
                        objDr.Close();

                        #endregion

                        #region 경력사항 공란 삭제

                        int startRow = 0, endRow = 0;

                        // 하드코딩..
                        switch (iCnt2)
                        {
                            case 0:
                                startRow = 53;
                                endRow = 384;
                                break;
                            case 1:
                                startRow = 105;
                                endRow = 384;
                                break;
                            case 2:
                            case 3:
                                startRow = 161;
                                endRow = 384;
                                break;
                            case 4:
                            case 5:
                                startRow = 217;
                                endRow = 384;
                                break;
                            case 6:
                            case 7:
                                startRow = 273;
                                endRow = 384;
                                break;
                            case 8:
                            case 9:
                                startRow = 329;
                                endRow = 384;
                                break;
                        }

                        if (startRow > 0 && endRow > 0)
                        {
                            objRange = objWorkSheet.Range[string.Format("A{0}:R{1}", startRow, endRow)];
                            //objRange.Delete(Excel.XlDeleteShiftDirection.xlShiftUp);
                            objWorkSheet.DeleteCells(objRange, DeleteMode.ShiftCellsUp);
                        }

                        //objWorkSheet.ResetAllPageBreaks();
                        //switch (iCnt)
                        //{
                        //    case 1:
                        //        objWorkSheet.VPageBreaks.Add(objWorkSheet.Range["A53", "R53"));
                        //        objWorkSheet.VPageBreaks.Add(objWorkSheet.Range["A105", "R105"));
                        //        objWorkSheet.VPageBreaks.Add(objWorkSheet.Range["A157", "R157"));
                        //        objWorkSheet.VPageBreaks.Add(objWorkSheet.Range["A209", "R209"));
                        //        break;
                        //    case 2:
                        //    case 3:
                        //        objWorkSheet.VPageBreaks.Add(objWorkSheet.Range["A53", "R53"));
                        //        objWorkSheet.VPageBreaks.Add(objWorkSheet.Range["A105", "R105"));
                        //        objWorkSheet.VPageBreaks.Add(objWorkSheet.Range["A161", "R161"));
                        //        objWorkSheet.VPageBreaks.Add(objWorkSheet.Range["A213", "R213"));
                        //        objWorkSheet.VPageBreaks.Add(objWorkSheet.Range["A265", "R265"));
                        //        break;
                        //    case 4:
                        //    case 5:
                        //        objWorkSheet.VPageBreaks.Add(objWorkSheet.Range["A53", "R53"));
                        //        objWorkSheet.VPageBreaks.Add(objWorkSheet.Range["A105", "R105"));
                        //        objWorkSheet.VPageBreaks.Add(objWorkSheet.Range["A161", "R161"));
                        //        objWorkSheet.VPageBreaks.Add(objWorkSheet.Range["A217", "R217"));
                        //        objWorkSheet.VPageBreaks.Add(objWorkSheet.Range["A269", "R269"));
                        //        objWorkSheet.VPageBreaks.Add(objWorkSheet.Range["A321", "R321"));
                        //        break;
                        //    case 6:
                        //    case 7:
                        //        objWorkSheet.VPageBreaks.Add(objWorkSheet.Range["A53", "R53"));
                        //        objWorkSheet.VPageBreaks.Add(objWorkSheet.Range["A105", "R105"));
                        //        objWorkSheet.VPageBreaks.Add(objWorkSheet.Range["A161", "R161"));
                        //        objWorkSheet.VPageBreaks.Add(objWorkSheet.Range["A217", "R217"));
                        //        objWorkSheet.VPageBreaks.Add(objWorkSheet.Range["A273", "R273"));
                        //        objWorkSheet.VPageBreaks.Add(objWorkSheet.Range["A325", "R325"));
                        //        objWorkSheet.VPageBreaks.Add(objWorkSheet.Range["A377", "R377"));
                        //        break;
                        //    case 8:
                        //    case 9:
                        //        objWorkSheet.VPageBreaks.Add(objWorkSheet.Range["A53", "R53"));
                        //        objWorkSheet.VPageBreaks.Add(objWorkSheet.Range["A105", "R105"));
                        //        objWorkSheet.VPageBreaks.Add(objWorkSheet.Range["A161", "R161"));
                        //        objWorkSheet.VPageBreaks.Add(objWorkSheet.Range["A217", "R217"));
                        //        objWorkSheet.VPageBreaks.Add(objWorkSheet.Range["A273", "R273"));
                        //        objWorkSheet.VPageBreaks.Add(objWorkSheet.Range["A329", "R329"));
                        //        objWorkSheet.VPageBreaks.Add(objWorkSheet.Range["A381", "R381"));
                        //        objWorkSheet.VPageBreaks.Add(objWorkSheet.Range["A433", "R433"));
                        //        break;
                        //}

                        #endregion
                    }
                    else
                    {
                        #region 인적사항

                        objCmd.CommandText = getQuery("HRM_8120_P1", objArg);
                        objDr = objCmd.ExecuteReader();

                        while (objDr.Read())
                        {
                            //objWorkSheet.Name = objDr["app_nm_kr"].ToString();
                            setSheetName(ref objWorkSheet, objDr["app_nm_kr"].ToString());

                            // 인적
                            objWorkSheet.Cells["F6"].SetValue(objDr["ann_cat01"].ToString());           // 구분
                            objWorkSheet.Cells["K6"].SetValue(objDr["ann_cat02"].ToString());           // 지원부문
                            objWorkSheet.Cells["F9"].SetValue(objDr["app_nm_kr"].ToString());           // 성명(한글)
                            objWorkSheet.Cells["K9"].SetValue(objDr["reg_no"].ToString());              // 주민등록번호
                            objWorkSheet.Cells["F10"].SetValue(objDr["app_nm_en"].ToString());          // 성명(영문)
                            objWorkSheet.Cells["K10"].SetValue(objDr["age"].ToString());                // 나이
                            objWorkSheet.Cells["P10"].SetValue(objDr["sex"].ToString());                // 성별
                            objWorkSheet.Cells["F11"].SetValue(objDr["app_nm_cn"].ToString());          // 성명(한자)
                            objWorkSheet.Cells["K11"].SetValue(objDr["email"].ToString());              // E-Mail
                            objWorkSheet.Cells["F12"].SetValue(objDr["addr"].ToString());               // 거주지 주소
                            objWorkSheet.Cells["F13"].SetValue(objDr["tel_no"].ToString());             // 전화번호
                            objWorkSheet.Cells["K13"].SetValue(objDr["mobile_no"].ToString());          // 휴대폰
                            objWorkSheet.Cells["P13"].SetValue(objDr["d1_inf01"].ToString() + " / " + objDr["d1_inf02"].ToString());   // 희망연봉/직위

                            // 병역
                            objWorkSheet.Cells["B47"].SetValue(objDr["d1_inf03"].ToString());           // 구분
                            objWorkSheet.Cells["D47"].SetValue(objDr["d1_inf04"].ToString());           // 군별
                            objWorkSheet.Cells["G47"].SetValue(objDr["d1_inf05"].ToString());           // 계급
                            objWorkSheet.Cells["J47"].SetValue(objDr["d1_inf06"].ToString() + " ~ " + objDr["d1_inf07"].ToString());   // 복무기간
                            objWorkSheet.Cells["P47"].SetValue(objDr["d1_inf08"].ToString());           // 면제사유

                            // 건강
                            objWorkSheet.Cells["B50"].SetValue(objDr["d1_inf15"].ToString());           // 신장
                            objWorkSheet.Cells["E50"].SetValue(objDr["d1_inf16"].ToString());           // 체중
                            objWorkSheet.Cells["H50"].SetValue(objDr["d1_inf17"].ToString());           // 혈액형
                            objWorkSheet.Cells["K50"].SetValue(objDr["d1_inf18"].ToString() + " / " + objDr["d1_inf19"].ToString());   // 시력
                            objWorkSheet.Cells["O50"].SetValue(objDr["d1_inf20"].ToString());           // 신체장애

                            // 기타
                            objWorkSheet.Cells["E52"].SetValue(objDr["d1_inf23"].ToString());           // 추천자
                            objWorkSheet.Cells["J52"].SetValue(objDr["d1_inf24"].ToString());           // 부서
                            objWorkSheet.Cells["O52"].SetValue(objDr["d1_inf25"].ToString());           // 관계
                            objWorkSheet.Cells["E53"].SetValue(objDr["d1_inf21"].ToString());           // TechData를 알게 된 동기
                            objWorkSheet.Cells["E54"].SetValue(objDr["d1_inf22"].ToString());           // 채용정보를 알게 된 방법

                            // 자기소개
                            objWorkSheet.Cells["A60"].SetValue("'" + objDr["d1_inf26"].ToString());     // 성장과정(학교생활)
                            objWorkSheet.Cells["A87"].SetValue("'" + objDr["d1_inf31"].ToString());     // 성격/생활신조
                            objWorkSheet.Cells["A114"].SetValue("'" + objDr["d1_inf32"].ToString());    // 특기분야
                            objWorkSheet.Cells["A141"].SetValue("'" + objDr["d1_inf33"].ToString());    // 지원동기
                            objWorkSheet.Cells["A170"].SetValue("'" + objDr["d1_inf34"].ToString());    // 희망업무/계획

                            // 사진
                            if (objDr["d1_inf30"].ToString() != "")
                            {
                                string imgPath = "http://hr.techdata.co.kr/Files/Recruit/" + objDr["d1_inf30"].ToString();
                                System.Net.WebRequest request = System.Net.WebRequest.Create(imgPath);
                                try
                                {
                                    System.Net.HttpWebResponse response = (System.Net.HttpWebResponse)request.GetResponse();
                                    if (response.StatusDescription == "OK")
                                    {
                                        SpreadsheetImageSource imageSource = SpreadsheetImageSource.FromUri(imgPath, objWorkBook);
                                        objWorkSheet.Pictures.AddPicture(imageSource, objWorkSheet.Range["A6:C13"], true);
                                        //objWorkSheet.Pictures.AddPicture(imageSource, 2, 84, 98, 130, true);
                                    }
                                }
                                catch
                                {

                                }
                            }

                        }
                        objDr.Close();

                        #endregion

                        #region 학력사항

                        objCmd.CommandText = getQuery("HRM_8120_P2", objArg);
                        objDr = objCmd.ExecuteReader();

                        while (objDr.Read())
                        {
                            objWorkSheet.Cells["C17"].SetValue(objDr["d2_inf02_1"].ToString());     // 고등학교 입학연월
                            objWorkSheet.Cells["E17"].SetValue(objDr["d2_inf03_1"].ToString());     // 고등학교 졸업연월
                            objWorkSheet.Cells["G17"].SetValue(objDr["d2_inf01_1"].ToString());     // 고등학교 학교명
                            objWorkSheet.Cells["J17"].SetValue(objDr["d2_inf08_1"].ToString());     // 고등학교 소재지
                            objWorkSheet.Cells["L17"].SetValue(objDr["d2_inf04_1"].ToString());     // 고등학교 전공
                            objWorkSheet.Cells["N17"].SetValue(objDr["d2_inf06_1"].ToString());     // 고등학교 주/야
                            objWorkSheet.Cells["O17"].SetValue(objDr["d2_inf07_1"].ToString());     // 고등학교 졸업구분
                            objWorkSheet.Cells["Q17"].SetValue(objDr["d2_inf09_1"].ToString());     // 고등학교 성적/만점
                            //objWorkSheet.Cells["K17"].SetValue(objDr["d2_inf05_1"].ToString());     // 부전공
                            //objWorkSheet.Cells["M17"].SetValue(objDr["d2_inf11_1"].ToString());     // ?년제

                            objWorkSheet.Cells["C18"].SetValue(objDr["d2_inf02_2"].ToString());     // 전문대 입학연월
                            objWorkSheet.Cells["E18"].SetValue(objDr["d2_inf03_2"].ToString());     // 전문대 졸업연월
                            objWorkSheet.Cells["G18"].SetValue(objDr["d2_inf01_2"].ToString());     // 전문대 학교명
                            objWorkSheet.Cells["J18"].SetValue(objDr["d2_inf08_2"].ToString() + "/" + objDr["d2_inf12_2"].ToString());   // 전문대 소재지
                            objWorkSheet.Cells["L18"].SetValue(objDr["d2_inf04_2"].ToString());     // 전문대 전공
                            objWorkSheet.Cells["N18"].SetValue(objDr["d2_inf06_2"].ToString());     // 전문대 주/야
                            objWorkSheet.Cells["O18"].SetValue(objDr["d2_inf07_2"].ToString());     // 전문대 졸업구분
                            objWorkSheet.Cells["Q18"].SetValue(objDr["d2_inf09_2"].ToString());     // 전문대 성적/만점
                            //objWorkSheet.Cells["K18"].SetValue(objDr["d2_inf05_2"].ToString());     // 부전공
                            //objWorkSheet.Cells["M18"].SetValue(objDr["d2_inf11_2"].ToString());     // ?년제

                            objWorkSheet.Cells["C19"].SetValue(objDr["d2_inf02_3"].ToString());     // 대학교 입학연월
                            objWorkSheet.Cells["E19"].SetValue(objDr["d2_inf03_3"].ToString());     // 대학교 졸업연월
                            objWorkSheet.Cells["G19"].SetValue(objDr["d2_inf01_3"].ToString());     // 대학교 학교명
                            objWorkSheet.Cells["J19"].SetValue(objDr["d2_inf08_3"].ToString() + "/" + objDr["d2_inf12_3"].ToString());   // 대학교 소재지
                            objWorkSheet.Cells["L19"].SetValue(objDr["d2_inf04_3"].ToString());     // 대학교 전공
                            objWorkSheet.Cells["N19"].SetValue(objDr["d2_inf06_3"].ToString());     // 대학교 주/야
                            objWorkSheet.Cells["O19"].SetValue(objDr["d2_inf07_3"].ToString());     // 대학교 졸업구분
                            objWorkSheet.Cells["Q19"].SetValue(objDr["d2_inf09_3"].ToString());     // 대학교 성적/만점
                            //objWorkSheet.Cells["K19"].SetValue(objDr["d2_inf05_3"].ToString());     // 부전공
                            //objWorkSheet.Cells["M19"].SetValue(objDr["d2_inf11_3"].ToString());     // ?년제

                            objWorkSheet.Cells["C20"].SetValue(objDr["d2_inf02_4"].ToString());     // 대학교 입학연월
                            objWorkSheet.Cells["E20"].SetValue(objDr["d2_inf03_4"].ToString());     // 대학교 졸업연월
                            objWorkSheet.Cells["G20"].SetValue(objDr["d2_inf01_4"].ToString());     // 대학교 학교명
                            objWorkSheet.Cells["J20"].SetValue(objDr["d2_inf08_4"].ToString() + "/" + objDr["d2_inf12_4"].ToString());   // 대학교 소재지
                            objWorkSheet.Cells["L20"].SetValue(objDr["d2_inf04_4"].ToString());     // 대학교 전공
                            objWorkSheet.Cells["N20"].SetValue(objDr["d2_inf06_4"].ToString());     // 대학교 주/야
                            objWorkSheet.Cells["O20"].SetValue(objDr["d2_inf07_4"].ToString());     // 대학교 졸업구분
                            objWorkSheet.Cells["Q20"].SetValue(objDr["d2_inf09_4"].ToString());     // 대학교 성적/만점
                            //objWorkSheet.Cells["K20"].SetValue(objDr["d2_inf05_4"].ToString());     // 부전공
                            //objWorkSheet.Cells["M20"].SetValue(objDr["d2_inf11_4"].ToString());     // ?년제

                            // 부전공
                            objWorkSheet.Cells["J21"].SetValue(objDr["d2_inf05_3"].ToString().Equals("") ? objDr["d2_inf05_4"].ToString() : objDr["d2_inf05_3"].ToString());

                            objWorkSheet.Cells["C22"].SetValue(objDr["d2_inf02_8"].ToString());     // 대학원(석사) 입학연월
                            objWorkSheet.Cells["E22"].SetValue(objDr["d2_inf03_8"].ToString());     // 대학원(석사) 졸업연월
                            objWorkSheet.Cells["G22"].SetValue(objDr["d2_inf01_8"].ToString());     // 대학원(석사) 학교명
                            objWorkSheet.Cells["J22"].SetValue(objDr["d2_inf08_8"].ToString() + "/" + objDr["d2_inf12_8"].ToString());   // 대학원(석사) 소재지
                            objWorkSheet.Cells["L22"].SetValue(objDr["d2_inf04_8"].ToString());     // 대학원(석사) 전공
                            objWorkSheet.Cells["N22"].SetValue(objDr["d2_inf06_8"].ToString());     // 대학원(석사) 주/야
                            objWorkSheet.Cells["O22"].SetValue(objDr["d2_inf07_8"].ToString());     // 대학원(석사) 졸업구분
                            objWorkSheet.Cells["Q22"].SetValue(objDr["d2_inf09_8"].ToString());     // 대학원(석사) 성적/만점
                            //objWorkSheet.Cells["K21"].SetValue(objDr["d2_inf05_8"].ToString());     // 부전공
                            //objWorkSheet.Cells["M21"].SetValue(objDr["d2_inf11_8"].ToString());     // ?년제
                            //objWorkSheet.Cells["E22"].SetValue(objDr["d2_inf05_8"].ToString());     // 대학원(석사) 세부전공
                            //objWorkSheet.Cells["K22"].SetValue(objDr["d2_inf10_8"].ToString());     // 대학원(석사) 논문제목

                            objWorkSheet.Cells["C23"].SetValue(objDr["d2_inf02_9"].ToString());     // 대학원(박사) 입학연월
                            objWorkSheet.Cells["E23"].SetValue(objDr["d2_inf03_9"].ToString());     // 대학원(박사) 졸업연월
                            objWorkSheet.Cells["G23"].SetValue(objDr["d2_inf01_9"].ToString());     // 대학원(박사) 학교명
                            objWorkSheet.Cells["J23"].SetValue(objDr["d2_inf08_9"].ToString() + "/" + objDr["d2_inf12_9"].ToString());   // 대학원(박사) 소재지
                            objWorkSheet.Cells["L23"].SetValue(objDr["d2_inf04_9"].ToString());     // 대학원(박사) 전공
                            objWorkSheet.Cells["N23"].SetValue(objDr["d2_inf06_9"].ToString());     // 대학원(박사) 주/야
                            objWorkSheet.Cells["O23"].SetValue(objDr["d2_inf07_9"].ToString());     // 대학원(박사) 졸업구분
                            objWorkSheet.Cells["Q23"].SetValue(objDr["d2_inf09_9"].ToString());     // 대학원(박사) 성적/만점
                            //objWorkSheet.Cells["K23"].SetValue(objDr["d2_inf05_9"].ToString());     // 부전공 
                            //objWorkSheet.Cells["M23"].SetValue(objDr["d2_inf11_9"].ToString());     // ?년제
                            //objWorkSheet.Cells["E24"].SetValue(objDr["d2_inf05_9"].ToString());     // 대학원(박사) 세부전공
                            //objWorkSheet.Cells["K24"].SetValue(objDr["d2_inf10_9"].ToString());     // 대학원(박사) 논문제목
                        }
                        objDr.Close();

                        #endregion

                        int iRow = 0;
                        int iCnt = 0;

                        #region 사회활동

                        objCmd.CommandText = getQuery("HRM_8120_P11", objArg);
                        objDr = objCmd.ExecuteReader();

                        iRow = 26;
                        iCnt = 0;
                        while (objDr.Read() && iCnt < 5)
                        {
                            objWorkSheet.Cells[string.Format("B{0}", iRow)].SetValue(objDr["d11_inf01"].ToString());    // 기관 및 장소
                            objWorkSheet.Cells[string.Format("F{0}", iRow)].SetValue(objDr["d11_inf02"].ToString());    // 구분
                            objWorkSheet.Cells[string.Format("I{0}", iRow)].SetValue(objDr["d11_inf03"].ToString());    // 활동기간
                            objWorkSheet.Cells[string.Format("M{0}", iRow)].SetValue(objDr["d11_inf04"].ToString());    // 주요활동내용

                            iRow++;
                            iCnt++;
                        }
                        objDr.Close();

                        #endregion

                        #region 자격/면허

                        objCmd.CommandText = getQuery("HRM_8120_P7", objArg);
                        objDr = objCmd.ExecuteReader();

                        iRow = 33;
                        iCnt = 0;
                        while (objDr.Read() && iCnt < 5)
                        {
                            objWorkSheet.Cells[string.Format("B{0}", iRow)].SetValue(objDr["d7_inf01"].ToString());     // 자격명
                            objWorkSheet.Cells[string.Format("G{0}", iRow)].SetValue(objDr["d7_inf02"].ToString());     // 등급
                            objWorkSheet.Cells[string.Format("K{0}", iRow)].SetValue(objDr["d7_inf03"].ToString());     // 취득일자
                            objWorkSheet.Cells[string.Format("M{0}", iRow)].SetValue(objDr["d7_inf04"].ToString());     // 발급처

                            iRow++;
                            iCnt++;
                            if (iCnt > 5) break;
                        }
                        objDr.Close();

                        #endregion

                        #region 외국어

                        objCmd.CommandText = getQuery("HRM_8120_P5", objArg);
                        objDr = objCmd.ExecuteReader();

                        iRow = 40;
                        iCnt = 0;
                        while (objDr.Read() && iCnt < 5)
                        {
                            objWorkSheet.Cells[string.Format("B{0}", iRow)].SetValue(objDr["d5_inf01"].ToString());     // 외국어명
                            objWorkSheet.Cells[string.Format("F{0}", iRow)].SetValue(objDr["d5_inf02"].ToString());     // 회화
                            objWorkSheet.Cells[string.Format("H{0}", iRow)].SetValue(objDr["d5_inf03"].ToString());     // 독해
                            objWorkSheet.Cells[string.Format("J{0}", iRow)].SetValue(objDr["d5_inf04"].ToString());     // TEST명
                            objWorkSheet.Cells[string.Format("M{0}", iRow)].SetValue(objDr["d5_inf05"].ToString());     // 종합점수
                            objWorkSheet.Cells[string.Format("O{0}", iRow)].SetValue(objDr["d5_inf07"].ToString());     // 등급
                            objWorkSheet.Cells[string.Format("Q{0}", iRow)].SetValue(objDr["d5_inf06"].ToString());     // 취득연도

                            iRow++;
                            iCnt++;
                            if (iCnt > 5) break;
                        }
                        objDr.Close();

                        #endregion

                    }

                }

                #region Delete Template

                objWorkBook.Worksheets[0].Visible = false;
                //objWorkSheet = objWorkBook.Worksheets[0];
                //objWorkSheet.Visible = Excel.XlSheetVisibility.xlSheetVeryHidden;

                #endregion

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
                            "Data 조회 중에 오류가 발생하였습니다.\n- " + ex.Message)
                        )
                    );
            }

            #endregion

            #region save to File.

            try
            {
                if (System.IO.File.Exists(strTarget)) System.IO.File.Delete(strTarget);

                objWorkBook.SaveDocument(strTarget + ".xlsx", DocumentFormat.Xlsx);
                using (System.IO.FileStream pdf = new System.IO.FileStream(strTarget + ".pdf", System.IO.FileMode.Create))
                {
                    objWorkBook.ExportToPdf(pdf);
                }
                strReturn = new JavaScriptSerializer().Serialize(
                                new entityProcessed<string>(codeProcessed.SUCCESS, sFileNmTrg)
                            );
            }
            catch (Exception ex)
            {
                throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                            codeProcessed.ERR_PROCESS,
                            "Print 생성 중에 오류가 발생하였습니다...\n- " + ex.Message)
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

    protected static string getQuery(string strQueryID, entityNameValue objArgs)
    {
        #region get Query from DB.

        string strSQL = string.Empty;
        string strBody = string.Empty;
        string strZQuery = "SELECT qry_sel AS QUERY_SELECT FROM ZQUERY WHERE qry_id = '{0}'";

        try
        {
            strSQL = string.Format(@strZQuery, strQueryID);
            objCmd.CommandText = strSQL;
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

        if (objArgs.getSize() > 0)
        {
            #region get Argument from DB.

            Hashtable tblSelect = new Hashtable();
            try
            {
                strSQL = string.Format(@strZArg, strQueryID);
                objCmd.CommandText = strSQL;
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

    protected static void setSheetName(ref Worksheet _objSheet, string _name)
    {
        int iName = 0;
        string strNewName = _name;

        while (true)
        {
            try
            {
                _objSheet.Name = strNewName;
                break;
            }
            catch (Exception e)
            {
                strNewName = string.Format("{0} ({1})", _name, ++iName);
            }
        }
    }
    #endregion
}


