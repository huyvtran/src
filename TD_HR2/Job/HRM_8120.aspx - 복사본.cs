using Microsoft.Office.Core;
using System;
using System.Collections;
using System.Configuration;
using System.Data.SqlClient;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Services;
using Excel = Microsoft.Office.Interop.Excel;

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
    [WebMethod]
    public static string Print(cRetrieveData DATA)
    {

        string strReturn = string.Empty;

        Excel.Application objExcel = null;
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

            string sFileIdSrc = strPage;
            string sFileIdTrg = sFileIdSrc + "_" + strPostfix; // strUser;
            string sFileNmTrg = sFileIdTrg + "." + strPrint;
            string strRoot = HttpContext.Current.Server.MapPath("~/");
            string strSource = strRoot + "Report/" + strPage + "/" + sFileIdSrc + ".xls";
            string strTarget = strRoot + "Report/" + strPage + "/" + sFileIdTrg;
            object objMissing = Type.Missing;
            object varMissing = System.Reflection.Missing.Value;

            Excel._Workbook objWorkBook;
            Excel._Worksheet objWorkSheet, copyWorkSheet;
            Excel.Range objRange;
            Excel.XlFixedFormatType enTarget = Excel.XlFixedFormatType.xlTypePDF;
            Excel.XlFixedFormatQuality enQuality = Excel.XlFixedFormatQuality.xlQualityStandard;
            Excel.XlFileFormat enSource = Excel.XlFileFormat.xlExcel8;

            try
            {
                objExcel = new Excel.Application();
                objExcel.DisplayAlerts = false;
                objExcel.Visible = false;
                objExcel.DisplayAlerts = false;
                objExcel.Visible = false;
                objWorkBook = objExcel.Workbooks.Open(
                                strSource,
                                false,
                                true,
                                varMissing, varMissing, varMissing, varMissing, varMissing, varMissing, varMissing, varMissing, varMissing
                                , true, varMissing, varMissing);
                objWorkSheet = (Excel.Worksheet)objWorkBook.Sheets[1];
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
                objArg.Add("arg_ann_key", DATA.getOption("ANNKEY"));
                objArg.Add("arg_app_key", "");

                foreach (string strAppKey in DATA.getOption("APPKEY").Split(','))
                {
                    objArg.setValue("arg_app_key", strAppKey);
                    
                    copyWorkSheet = (Excel.Worksheet)objWorkBook.Sheets[1];
                    objWorkSheet = (Excel.Worksheet)objWorkBook.Sheets[objWorkBook.Sheets.Count];
                    copyWorkSheet.Copy(Type.Missing, objWorkSheet);
                    objWorkSheet = (Excel.Worksheet)objWorkBook.Sheets[objWorkBook.Sheets.Count];

                    #region 인적사항

                    objCmd.CommandText = getQuery("HRM_8120_P1", objArg);
                    objDr = objCmd.ExecuteReader();

                    while (objDr.Read())
                    {
                        //objWorkSheet.Name = objDr["app_nm_kr"].ToString();
                        setSheetName(ref objWorkSheet, objDr["app_nm_kr"].ToString());

                        // 인적
                        objWorkSheet.Cells[6, 3] = objDr["ann_cat01"].ToString();   // 구분
                        objWorkSheet.Cells[6, 8] = objDr["ann_cat02"].ToString();   // 지원부문
                        objWorkSheet.Cells[9, 3] = objDr["app_nm_kr"].ToString();   // 성명(한글)
                        objWorkSheet.Cells[9, 8] = objDr["reg_no"].ToString();      // 주민등록번호
                        objWorkSheet.Cells[10, 3] = objDr["app_nm_en"].ToString();  // 성명(영문)
                        objWorkSheet.Cells[10, 8] = objDr["age"].ToString();        // 나이
                        objWorkSheet.Cells[10, 13] = objDr["sex"].ToString();       // 성별
                        objWorkSheet.Cells[11, 3] = objDr["app_nm_cn"].ToString();  // 성명(한자)
                        objWorkSheet.Cells[11, 8] = objDr["email"].ToString();      // E-Mail
                        objWorkSheet.Cells[12, 3] = objDr["addr"].ToString();       // 거주지 주소
                        objWorkSheet.Cells[13, 3] = objDr["tel_no"].ToString();     // 전화번호
                        objWorkSheet.Cells[13, 8] = objDr["mobile_no"].ToString();  // 휴대폰
                        objWorkSheet.Cells[13, 13] = objDr["d1_inf01"].ToString() + " / " + objDr["d1_inf02"].ToString();   // 희망연봉/직위

                        // 병역
                        objWorkSheet.Cells[27, 2] = objDr["d1_inf03"].ToString();   // 구분
                        objWorkSheet.Cells[27, 4] = objDr["d1_inf04"].ToString();   // 군별
                        objWorkSheet.Cells[27, 7] = objDr["d1_inf05"].ToString();   // 계급
                        objWorkSheet.Cells[27, 10] = objDr["d1_inf06"].ToString() + " ~ " + objDr["d1_inf07"].ToString();   // 복무기간
                        objWorkSheet.Cells[27, 16] = objDr["d1_inf08"].ToString();  // 면제사유

                        // 건강
                        objWorkSheet.Cells[30, 2] = objDr["d1_inf15"].ToString();   // 신장
                        objWorkSheet.Cells[30, 5] = objDr["d1_inf16"].ToString();   // 체중
                        objWorkSheet.Cells[30, 8] = objDr["d1_inf17"].ToString();   // 혈액형
                        objWorkSheet.Cells[30, 11] = objDr["d1_inf18"].ToString() + " / " + objDr["d1_inf19"].ToString();   // 시력
                        objWorkSheet.Cells[30, 15] = objDr["d1_inf20"].ToString();  // 신체장애

                        // 기타
                        objWorkSheet.Cells[50, 3] = objDr["d1_inf09"].ToString();   // 부모생존여부
                        objWorkSheet.Cells[50, 9] = objDr["d1_inf11"].ToString();   // 종교
                        objWorkSheet.Cells[50, 15] = objDr["d1_inf13"].ToString();  // 결혼기념일
                        objWorkSheet.Cells[51, 3] = objDr["d1_inf10"].ToString();   // 형제자매
                        objWorkSheet.Cells[51, 9] = objDr["d1_inf12"].ToString();   // 취미
                        objWorkSheet.Cells[51, 15] = objDr["d1_inf14"].ToString();  // 보훈대상여부

                        objWorkSheet.Cells[430, 5] = objDr["d1_inf23"].ToString();  // 추천자
                        objWorkSheet.Cells[430, 10] = objDr["d1_inf24"].ToString(); // 부서
                        objWorkSheet.Cells[430, 15] = objDr["d1_inf25"].ToString(); // 관계
                        objWorkSheet.Cells[431, 5] = objDr["d1_inf21"].ToString();  // AP시스템을 알게 된 동기
                        objWorkSheet.Cells[432, 5] = objDr["d1_inf22"].ToString();  // 채용정보를 알게 된 방법

                        // 자기소개
                        objWorkSheet.Cells[448, 1] = "'" + objDr["d1_inf26"].ToString();

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
                            string imgPath = "http://recruit.apsystems.co.kr/Files/Recruit/" + objDr["d1_inf30"].ToString();
                            System.Net.WebRequest request = System.Net.WebRequest.Create(imgPath);
                            try
                            {
                                System.Net.HttpWebResponse response = (System.Net.HttpWebResponse)request.GetResponse();
                                if (response.StatusDescription == "OK")
                                {
                                    objWorkSheet.Shapes.AddPicture(imgPath,
                                        Microsoft.Office.Core.MsoTriState.msoFalse,
                                        Microsoft.Office.Core.MsoTriState.msoCTrue,
                                        440, 84, 85, 130);
                                }
                            }
                            catch
                            {

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
                        objWorkSheet.Cells[17, 3] = objDr["d2_inf02_1"].ToString();    // 고등학교 입학연월
                        objWorkSheet.Cells[17, 5] = objDr["d2_inf03_1"].ToString();    // 고등학교 졸업연월
                        objWorkSheet.Cells[17, 7] = objDr["d2_inf01_1"].ToString();    // 고등학교 학교명
                        objWorkSheet.Cells[17, 10] = objDr["d2_inf04_1"].ToString();   // 고등학교 전공
                        objWorkSheet.Cells[17, 12] = objDr["d2_inf06_1"].ToString();   // 고등학교 주/야
                        objWorkSheet.Cells[17, 13] = objDr["d2_inf07_1"].ToString();   // 고등학교 졸업구분
                        objWorkSheet.Cells[17, 15] = objDr["d2_inf08_1"].ToString();   // 고등학교 소재지
                        objWorkSheet.Cells[17, 17] = objDr["d2_inf09_1"].ToString();   // 고등학교 성적/만점
                        objWorkSheet.Cells[18, 3] = objDr["d2_inf02_2"].ToString();    // 전문대 입학연월
                        objWorkSheet.Cells[18, 5] = objDr["d2_inf03_2"].ToString();    // 전문대 졸업연월
                        objWorkSheet.Cells[18, 7] = objDr["d2_inf01_2"].ToString();    // 전문대 학교명
                        objWorkSheet.Cells[18, 10] = objDr["d2_inf04_2"].ToString();   // 전문대 전공
                        objWorkSheet.Cells[18, 12] = objDr["d2_inf06_2"].ToString();   // 전문대 주/야
                        objWorkSheet.Cells[18, 13] = objDr["d2_inf07_2"].ToString();   // 전문대 졸업구분
                        objWorkSheet.Cells[18, 15] = objDr["d2_inf08_2"].ToString();   // 전문대 소재지
                        objWorkSheet.Cells[18, 17] = objDr["d2_inf09_2"].ToString();   // 전문대 성적/만점
                        objWorkSheet.Cells[19, 3] = objDr["d2_inf02_3"].ToString();    // 대학교 입학연월
                        objWorkSheet.Cells[19, 5] = objDr["d2_inf03_3"].ToString();    // 대학교 졸업연월
                        objWorkSheet.Cells[19, 7] = objDr["d2_inf01_3"].ToString();    // 대학교 학교명
                        objWorkSheet.Cells[19, 10] = objDr["d2_inf04_3"].ToString();   // 대학교 전공
                        objWorkSheet.Cells[19, 12] = objDr["d2_inf06_3"].ToString();   // 대학교 주/야
                        objWorkSheet.Cells[19, 13] = objDr["d2_inf07_3"].ToString();   // 대학교 졸업구분
                        objWorkSheet.Cells[19, 15] = objDr["d2_inf08_3"].ToString();   // 대학교 소재지
                        objWorkSheet.Cells[19, 17] = objDr["d2_inf09_3"].ToString();   // 대학교 성적/만점
                        objWorkSheet.Cells[20, 3] = objDr["d2_inf02_4"].ToString();    // 대학교 입학연월
                        objWorkSheet.Cells[20, 5] = objDr["d2_inf03_4"].ToString();    // 대학교 졸업연월
                        objWorkSheet.Cells[20, 7] = objDr["d2_inf01_4"].ToString();    // 대학교 학교명
                        objWorkSheet.Cells[20, 10] = objDr["d2_inf04_4"].ToString();   // 대학교 전공
                        objWorkSheet.Cells[20, 12] = objDr["d2_inf06_4"].ToString();   // 대학교 주/야
                        objWorkSheet.Cells[20, 13] = objDr["d2_inf07_4"].ToString();   // 대학교 졸업구분
                        objWorkSheet.Cells[20, 15] = objDr["d2_inf08_4"].ToString();   // 대학교 소재지
                        objWorkSheet.Cells[20, 17] = objDr["d2_inf09_4"].ToString();   // 대학교 성적/만점
                        objWorkSheet.Cells[21, 3] = objDr["d2_inf02_8"].ToString();    // 대학원(석사) 입학연월
                        objWorkSheet.Cells[21, 5] = objDr["d2_inf03_8"].ToString();    // 대학원(석사) 졸업연월
                        objWorkSheet.Cells[21, 7] = objDr["d2_inf01_8"].ToString();    // 대학원(석사) 학교명
                        objWorkSheet.Cells[21, 10] = objDr["d2_inf04_8"].ToString();   // 대학원(석사) 전공
                        objWorkSheet.Cells[22, 5] = objDr["d2_inf05_8"].ToString();    // 대학원(석사) 세부전공
                        objWorkSheet.Cells[21, 12] = objDr["d2_inf06_8"].ToString();   // 대학원(석사) 주/야
                        objWorkSheet.Cells[21, 13] = objDr["d2_inf07_8"].ToString();   // 대학원(석사) 졸업구분
                        objWorkSheet.Cells[21, 15] = objDr["d2_inf08_8"].ToString();   // 대학원(석사) 소재지
                        objWorkSheet.Cells[21, 17] = objDr["d2_inf09_8"].ToString();   // 대학원(석사) 성적/만점
                        objWorkSheet.Cells[22, 12] = objDr["d2_inf10_8"].ToString();   // 대학원(석사) 논문제목
                        objWorkSheet.Cells[23, 3] = objDr["d2_inf02_9"].ToString();    // 대학원(박사) 입학연월
                        objWorkSheet.Cells[23, 5] = objDr["d2_inf03_9"].ToString();    // 대학원(박사) 졸업연월
                        objWorkSheet.Cells[23, 7] = objDr["d2_inf01_9"].ToString();    // 대학원(박사) 학교명
                        objWorkSheet.Cells[23, 10] = objDr["d2_inf04_9"].ToString();   // 대학원(박사) 전공
                        objWorkSheet.Cells[24, 5] = objDr["d2_inf05_9"].ToString();    // 대학원(박사) 세부전공
                        objWorkSheet.Cells[23, 12] = objDr["d2_inf06_9"].ToString();   // 대학원(박사) 주/야
                        objWorkSheet.Cells[23, 13] = objDr["d2_inf07_9"].ToString();   // 대학원(박사) 졸업구분
                        objWorkSheet.Cells[23, 15] = objDr["d2_inf08_9"].ToString();   // 대학원(박사) 소재지
                        objWorkSheet.Cells[23, 17] = objDr["d2_inf09_9"].ToString();   // 대학원(박사) 성적/만점
                        objWorkSheet.Cells[24, 12] = objDr["d2_inf10_9"].ToString();   // 대학원(박사) 논문제목
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
                        objWorkSheet.Cells[iRow, 1] = objDr["relation"].ToString();     // 관계
                        objWorkSheet.Cells[iRow, 3] = objDr["name"].ToString();         // 성명
                        objWorkSheet.Cells[iRow, 6] = objDr["age"].ToString();          // 연령
                        objWorkSheet.Cells[iRow, 8] = objDr["co_nm"].ToString();        // 현직장명
                        objWorkSheet.Cells[iRow, 13] = objDr["grade_nm"].ToString();    // 직위
                        objWorkSheet.Cells[iRow, 17] = objDr["live_yn"].ToString();     // 동거

                        iRow++;
                        iCnt++;
                        if (iCnt > 16) break;
                    }
                    objDr.Close();

                    #endregion

                    #region 경력사항

                    objCmd.CommandText = getQuery("HRM_8120_P3", objArg);
                    objDr = objCmd.ExecuteReader();

                    iRow = 55;
                    iCnt = 0;
                    int[] iRow2 = { 80, 108, 136, 164, 192, 220, 248, 276, 304, 332, 360 };
                    int iCnt2 = 0;
                    while (objDr.Read())
                    {
                        objWorkSheet.Cells[iRow, 1] = objDr["d3_inf01"].ToString();     // 회사명
                        objWorkSheet.Cells[iRow, 3] = objDr["d3_inf02"].ToString();     // 소재지
                        objWorkSheet.Cells[iRow, 6] = objDr["d3_inf03"].ToString() + " ~ " + objDr["d3_inf04"].ToString();  // 근무기간
                        objWorkSheet.Cells[iRow, 9] = objDr["d3_inf05"].ToString();     // 직위
                        objWorkSheet.Cells[iRow, 11] = objDr["d3_inf06"].ToString();    // 담당업무
                        objWorkSheet.Cells[iRow, 14] = objDr["d3_inf07"].ToString();    // 연봉
                        objWorkSheet.Cells[iRow, 16] = objDr["d3_inf08"].ToString();    // 퇴직(이직)사유

                        // 상세 내역
                        objWorkSheet.Cells[iRow2[iCnt], 3] = objDr["d3_inf01"].ToString();      // 회사명
                        objWorkSheet.Cells[iRow2[iCnt], 15] = objDr["d3_inf02"].ToString();     // 소재지
                        objWorkSheet.Cells[iRow2[iCnt] + 1, 3] = objDr["d3_inf03"].ToString() + " ~ " + objDr["d3_inf04"].ToString();   // 근무기간
                        objWorkSheet.Cells[iRow2[iCnt] + 1, 9] = objDr["d3_inf07"].ToString();  // 연봉
                        objWorkSheet.Cells[iRow2[iCnt] + 1, 15] = objDr["d3_inf08"].ToString(); // 퇴직(이직)사유
                        objWorkSheet.Cells[iRow2[iCnt] + 2, 3] = objDr["d3_inf09"].ToString();  // 사업품목
                        objWorkSheet.Cells[iRow2[iCnt] + 2, 9] = objDr["d3_inf11"].ToString() + " 억 ( " + objDr["d3_inf10"].ToString() + " )";  // 매출액(연도)
                        objWorkSheet.Cells[iRow2[iCnt] + 2, 15] = objDr["d3_inf12"].ToString(); // 종업원수
                        objWorkSheet.Cells[iRow2[iCnt] + 3, 3] = "'" + objDr["d3_inf13"].ToString();  // 주요 경력 및 보유 기술

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
                        objWorkSheet.Cells[iRow, 2] = objDr["d5_inf01"].ToString();     // 외국어명
                        objWorkSheet.Cells[iRow, 7] = objDr["d5_inf02"].ToString();     // 회화
                        objWorkSheet.Cells[iRow, 9] = objDr["d5_inf03"].ToString();     // 독해
                        objWorkSheet.Cells[iRow, 11] = objDr["d5_inf04"].ToString();    // TEST명
                        objWorkSheet.Cells[iRow, 15] = objDr["d5_inf05"].ToString();    // 종합점수
                        objWorkSheet.Cells[iRow, 17] = objDr["d5_inf06"].ToString();    // 취득연도

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
                        objWorkSheet.Cells[iRow, 2] = objDr["d6_inf01"].ToString();     // 수상내용
                        objWorkSheet.Cells[iRow, 7] = objDr["d6_inf02"].ToString();     // 수상처
                        objWorkSheet.Cells[iRow, 11] = objDr["d6_inf03"].ToString();    // 수상연도
                        objWorkSheet.Cells[iRow, 13] = objDr["d6_inf04"].ToString();    // 비고

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
                        objWorkSheet.Cells[iRow, 2] = objDr["d7_inf01"].ToString();     // 자격명
                        objWorkSheet.Cells[iRow, 7] = objDr["d7_inf02"].ToString();     // 등급
                        objWorkSheet.Cells[iRow, 11] = objDr["d7_inf03"].ToString();    // 취득일자
                        objWorkSheet.Cells[iRow, 13] = objDr["d7_inf04"].ToString();    // 발급처

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
                        objWorkSheet.Cells[iRow, 2] = objDr["d8_inf01"].ToString();     // 구분
                        objWorkSheet.Cells[iRow, 7] = objDr["d8_inf02"].ToString();     // Language/자격구분/상품명
                        objWorkSheet.Cells[iRow, 11] = objDr["d8_inf03"].ToString();    // 능력정도
                        objWorkSheet.Cells[iRow, 13] = objDr["d8_inf04"].ToString();    // 경험/기간

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
                        objWorkSheet.Cells[iRow, 2] = objDr["d9_inf01"].ToString();     // 국명
                        objWorkSheet.Cells[iRow, 7] = objDr["d9_inf02"].ToString();     // 체류기간
                        objWorkSheet.Cells[iRow, 11] = objDr["d9_inf03"].ToString();    // 여행목적
                        objWorkSheet.Cells[iRow, 15] = objDr["d9_inf04"].ToString();    // 발급처

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
                        objRange = objWorkSheet.get_Range("A" + startRow.ToString(), "R" + endRow.ToString());
                        //objRange = objWorkSheet.get_Range("A" + startRow.ToString() + ":R" + endRow.ToString(), Type.Missing);
                        objRange.Delete(Excel.XlDeleteShiftDirection.xlShiftUp);
                    }

                    //objWorkSheet.ResetAllPageBreaks();
                    //switch (iCnt)
                    //{
                    //    case 1:
                    //        objWorkSheet.VPageBreaks.Add(objWorkSheet.get_Range("A53", "R53"));
                    //        objWorkSheet.VPageBreaks.Add(objWorkSheet.get_Range("A105", "R105"));
                    //        objWorkSheet.VPageBreaks.Add(objWorkSheet.get_Range("A157", "R157"));
                    //        objWorkSheet.VPageBreaks.Add(objWorkSheet.get_Range("A209", "R209"));
                    //        break;
                    //    case 2:
                    //    case 3:
                    //        objWorkSheet.VPageBreaks.Add(objWorkSheet.get_Range("A53", "R53"));
                    //        objWorkSheet.VPageBreaks.Add(objWorkSheet.get_Range("A105", "R105"));
                    //        objWorkSheet.VPageBreaks.Add(objWorkSheet.get_Range("A161", "R161"));
                    //        objWorkSheet.VPageBreaks.Add(objWorkSheet.get_Range("A213", "R213"));
                    //        objWorkSheet.VPageBreaks.Add(objWorkSheet.get_Range("A265", "R265"));
                    //        break;
                    //    case 4:
                    //    case 5:
                    //        objWorkSheet.VPageBreaks.Add(objWorkSheet.get_Range("A53", "R53"));
                    //        objWorkSheet.VPageBreaks.Add(objWorkSheet.get_Range("A105", "R105"));
                    //        objWorkSheet.VPageBreaks.Add(objWorkSheet.get_Range("A161", "R161"));
                    //        objWorkSheet.VPageBreaks.Add(objWorkSheet.get_Range("A217", "R217"));
                    //        objWorkSheet.VPageBreaks.Add(objWorkSheet.get_Range("A269", "R269"));
                    //        objWorkSheet.VPageBreaks.Add(objWorkSheet.get_Range("A321", "R321"));
                    //        break;
                    //    case 6:
                    //    case 7:
                    //        objWorkSheet.VPageBreaks.Add(objWorkSheet.get_Range("A53", "R53"));
                    //        objWorkSheet.VPageBreaks.Add(objWorkSheet.get_Range("A105", "R105"));
                    //        objWorkSheet.VPageBreaks.Add(objWorkSheet.get_Range("A161", "R161"));
                    //        objWorkSheet.VPageBreaks.Add(objWorkSheet.get_Range("A217", "R217"));
                    //        objWorkSheet.VPageBreaks.Add(objWorkSheet.get_Range("A273", "R273"));
                    //        objWorkSheet.VPageBreaks.Add(objWorkSheet.get_Range("A325", "R325"));
                    //        objWorkSheet.VPageBreaks.Add(objWorkSheet.get_Range("A377", "R377"));
                    //        break;
                    //    case 8:
                    //    case 9:
                    //        objWorkSheet.VPageBreaks.Add(objWorkSheet.get_Range("A53", "R53"));
                    //        objWorkSheet.VPageBreaks.Add(objWorkSheet.get_Range("A105", "R105"));
                    //        objWorkSheet.VPageBreaks.Add(objWorkSheet.get_Range("A161", "R161"));
                    //        objWorkSheet.VPageBreaks.Add(objWorkSheet.get_Range("A217", "R217"));
                    //        objWorkSheet.VPageBreaks.Add(objWorkSheet.get_Range("A273", "R273"));
                    //        objWorkSheet.VPageBreaks.Add(objWorkSheet.get_Range("A329", "R329"));
                    //        objWorkSheet.VPageBreaks.Add(objWorkSheet.get_Range("A381", "R381"));
                    //        objWorkSheet.VPageBreaks.Add(objWorkSheet.get_Range("A433", "R433"));
                    //        break;
                    //}

                    #endregion
                }

                #region Delete Template

                objWorkSheet = (Excel.Worksheet)objWorkBook.Sheets[1];
                objWorkSheet.Visible = Excel.XlSheetVisibility.xlSheetVeryHidden;

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
                //if (System.IO.File.Exists(strTarget)) System.IO.File.Delete(strTarget);
                //objWorkSheet.SaveAs(strTarget, enSource, varMissing, varMissing, varMissing, varMissing, varMissing, varMissing, varMissing, varMissing);
                //if (System.IO.File.Exists(strTarget)) System.IO.File.Delete(strTarget);
                //if (System.IO.File.Exists(strTarget + "." + strPrint)) System.IO.File.Delete(strTarget + "." + strPrint);
                //objWorkSheet.ExportAsFixedFormat(enTarget, strTarget, enQuality, true, true, 1, 5, false, varMissing);

                if (System.IO.File.Exists(strTarget)) System.IO.File.Delete(strTarget);
                objWorkBook.SaveAs(strTarget, enSource, varMissing, varMissing, varMissing, varMissing, Excel.XlSaveAsAccessMode.xlNoChange, varMissing, varMissing, varMissing, varMissing, varMissing);
                //if (System.IO.File.Exists(strTarget)) System.IO.File.Delete(strTarget);
                //if (System.IO.File.Exists(strTarget + "." + strPrint)) System.IO.File.Delete(strTarget + "." + strPrint);
                //objWorkBook.ExportAsFixedFormat(enTarget, strTarget, enQuality, true, true, varMissing, varMissing, false, varMissing);

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
                            "Print 생성 중에 오류가 발생하였습니다.\n- " + ex.Message)
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
            if (objExcel != null)
            {
                objExcel.Workbooks.Close();
                objExcel.Quit();
                if (objExcel != null)
                {
                    System.Diagnostics.Process[] pProcess;
                    pProcess = System.Diagnostics.Process.GetProcessesByName("Excel");
                    pProcess[0].Kill();
                }
            }

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

    protected static void setSheetName(ref Excel._Worksheet _objSheet, string _name)
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


