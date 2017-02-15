using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Services;
using DevExpress.Spreadsheet;

public partial class Job_QDM_7130 : System.Web.UI.Page
{
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
        #region check Argument.

        // check Argument.
        //
        if (string.IsNullOrEmpty(DATA.getQuery()))
        {
            return new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                                codeProcessed.ERR_PARAM,
                                "잘못된 호출입니다.")
                    );
        }

        #endregion

        string strReturn = string.Empty;

        SqlConnection objCon = null;
        SqlCommand objCmd = null;
        SqlDataReader objDr = null;
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

            #region get Query from DB.

            string strSQL = string.Empty;
            string strBody = string.Empty;

            try
            {
                strSQL = string.Format(@"
                            SELECT qry_sel AS QUERY_SELECT
                            FROM ZQUERY
                            WHERE qry_id = '{0}'",
                            DATA.getQuery());
                objCmd = new SqlCommand(strSQL, objCon);
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

            #region create Query.

            if (DATA.getArgument().getSize() > 0)
            {
                #region get Argument from DB.

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
                                DATA.getQuery()
                                );
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
                    for (int iAry = 0; iAry < DATA.getArgument().getSize(); iAry++)
                    {
                        string strArg = DATA.ARGUMENT.NAME[iAry];
                        cDBArgument objArg = (cDBArgument)tblSelect[strArg];
                        if (objArg == null)
                        {
                            throw new Exception(
                                strArg + " - 관련 Argument를 찾을 수 없습니다.");
                        }
                        strBody = objArg.convertWhere(
                                            strBody,
                                            DATA.getQuery(),
                                            strArg,
                                            HttpUtility.UrlDecode(DATA.ARGUMENT.VALUE[iAry])
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

            #region prepare Office object.

            string strPage = DATA.getOption("PAGE");
            string strUser = DATA.getOption("USER");
            string sToday = DateTime.Now.ToString("yyyyMMdd");
            string strRoot = HttpContext.Current.Server.MapPath("~/");
            string sFileNmTrg = "출하검사현황_" + strUser + ".xls";
            string strTarget = System.IO.Path.Combine(strRoot, "Report/" + strPage + "/" + sFileNmTrg);
            object objMissing = Type.Missing;
            object varMissing = System.Reflection.Missing.Value;

            Workbook objWorkBook;
            Worksheet objWorkSheet;
            Range objRange;

            try
            {
                objWorkBook = new Workbook();
                objWorkBook.Unit = DevExpress.Office.DocumentUnit.Point;
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
                objCmd.CommandText = strBody;
                objDr = objCmd.ExecuteReader();
                int row = 0;
                bool header = true;

                while (objDr.Read())
                {
                    row++;
                    if (header)
                    {
                        objWorkSheet.Cells["A" + row.ToString()].Value = "No.";
                        objWorkSheet.Cells["B" + row.ToString()].Value = "관리번호";
                        objWorkSheet.Cells["C" + row.ToString()].Value = "검사구분";
                        objWorkSheet.Cells["D" + row.ToString()].Value = "Project Name";
                        objWorkSheet.Cells["E" + row.ToString()].Value = "Project No.";
                        objWorkSheet.Cells["F" + row.ToString()].Value = "검사단계";
                        objWorkSheet.Cells["G" + row.ToString()].Value = "점검일자";
                        objWorkSheet.Cells["H" + row.ToString()].Value = "작성자";
                        objWorkSheet.Cells["I" + row.ToString()].Value = "담당부서";
                        objWorkSheet.Cells["J" + row.ToString()].Value = "담당자";
                        objWorkSheet.Cells["K" + row.ToString()].Value = "건수";
                        objWorkSheet.Cells["L" + row.ToString()].Value = "부적합현상";
                        objWorkSheet.Cells["M" + row.ToString()].Value = "부적합현상(사진)";
                        objWorkSheet.Cells["N" + row.ToString()].Value = "조치예정일";
                        objWorkSheet.Cells["O" + row.ToString()].Value = "조치완료일";
                        objWorkSheet.Cells["P" + row.ToString()].Value = "조치사항";
                        objWorkSheet.Cells["Q" + row.ToString()].Value = "조치사항(사진)";
                        objWorkSheet.Cells["R" + row.ToString()].Value = "조치여부";

                        objRange = objWorkSheet.Range["A" + row.ToString() + ":R" + row.ToString()];
                        objRange.Fill.BackgroundColor = System.Drawing.Color.LightGray;

                        header = false;
                        row++;
                    }

                    objRange = objWorkSheet.Range["B" + row.ToString() + ":R" + row.ToString()];
                    objRange.NumberFormat = "@";

                    objRange = objWorkSheet.Range["K" + row.ToString() + ":K" + row.ToString()];
                    objRange.NumberFormat = "#,###";

                    objWorkSheet.Cells["A" + row.ToString()].Value = row - 1;
                    objWorkSheet.Cells["B" + row.ToString()].Value = objDr["pchk_no"].ToString();
                    objWorkSheet.Cells["C" + row.ToString()].Value = objDr["qc_fg_nm"].ToString();
                    objWorkSheet.Cells["D" + row.ToString()].Value = objDr["proj_nm"].ToString();
                    objWorkSheet.Cells["E" + row.ToString()].Value = objDr["projkey"].ToString();
                    objWorkSheet.Cells["F" + row.ToString()].Value = objDr["qc_tp_nm"].ToString();
                    objWorkSheet.Cells["G" + row.ToString()].Value = objDr["qc_date2"].ToString();
                    objWorkSheet.Cells["H" + row.ToString()].Value = objDr["ins_usr_nm"].ToString();
                    objWorkSheet.Cells["I" + row.ToString()].Value = objDr["qc_dept_nm"].ToString();
                    objWorkSheet.Cells["J" + row.ToString()].Value = objDr["qc_emp_nm"].ToString();
                    objWorkSheet.Cells["K" + row.ToString()].Value = Convert.ToUInt32(objDr["qc_cnt"]);
                    objWorkSheet.Cells["L" + row.ToString()].Value = objDr["qc_memo1"].ToString().Replace("\r\n", "\n");
                    objWorkSheet.Cells["N" + row.ToString()].Value = objDr["plan_date2"].ToString();
                    objWorkSheet.Cells["O" + row.ToString()].Value = objDr["chk_date2"].ToString();
                    objWorkSheet.Cells["P" + row.ToString()].Value = objDr["qc_memo2"].ToString().Replace("\r\n", "\n");
                    objWorkSheet.Cells["R" + row.ToString()].Value = (objDr["chk_yn"].ToString().Equals("1") ? "Y" : "N");

                    // 부적합현상(사진)
                    string img = objDr["img1"].ToString();
                    if (!string.IsNullOrEmpty(img))
                    {
                        img = System.Web.Hosting.HostingEnvironment.MapPath(img);
                        if (System.IO.File.Exists(img))
                        {
                            objRange = objWorkSheet.Range["M" + row.ToString() + ":M" + row.ToString()];
                            objRange.RowHeight = 72;
                            addImage(img, objRange);
                        }
                    }

                    // 조치사항(사진)
                    img = objDr["img2"].ToString();
                    if (!string.IsNullOrEmpty(img))
                    {
                        img = System.Web.Hosting.HostingEnvironment.MapPath(img);
                        if (System.IO.File.Exists(img))
                        {
                            objRange = objWorkSheet.Range["Q" + row.ToString() + ":Q" + row.ToString()];
                            objRange.RowHeight = 72;
                            addImage(img, objRange);
                        }
                    }
                }
                objDr.Close();

                objRange = objWorkSheet.Range["A1:R" + row.ToString()];
                objRange.Borders.SetAllBorders(System.Drawing.Color.Black, BorderLineStyle.Thin);
                objRange.Font.Name = "굴림체";
                objRange.Font.Size = 9;
                objRange.AutoFitColumns();

                objRange = objWorkSheet.Range["L2:L" + row.ToString()];
                objRange.Alignment.WrapText = true;
                objRange.AutoFitColumns();
                objRange = objWorkSheet.Range["P2:P" + row.ToString()];
                objRange.Alignment.WrapText = true;
                objRange.AutoFitColumns();

                objWorkSheet.Cells["M1"].ColumnWidthInCharacters = 27;
                objWorkSheet.Cells["Q1"].ColumnWidthInCharacters = 27;

                objRange = objWorkSheet.Range["A2:R" + row.ToString()];
                objRange.Alignment.Vertical = SpreadsheetVerticalAlignment.Top;


                // Header 가운데 정렬
                objRange = objWorkSheet.Range["A1:R1"];
                objRange.Alignment.Horizontal = SpreadsheetHorizontalAlignment.Center;
                objRange.Alignment.Vertical = SpreadsheetVerticalAlignment.Center;

                // No. 가운데 정렬
                objRange = objWorkSheet.Range["A2:A" + row.ToString()];
                objRange.Alignment.Horizontal = SpreadsheetHorizontalAlignment.Center;
                objRange.Alignment.Vertical = SpreadsheetVerticalAlignment.Center;

                // 관리번호 가운데 정렬
                objRange = objWorkSheet.Range["B2:B" + row.ToString()];
                objRange.Alignment.Horizontal = SpreadsheetHorizontalAlignment.Center;

                // 점검일자 가운데 정렬
                objRange = objWorkSheet.Range["G2:G" + row.ToString()];
                objRange.Alignment.Horizontal = SpreadsheetHorizontalAlignment.Center;

                // 조치예정일, 조치완료일 가운데 정렬
                objRange = objWorkSheet.Range["N2:O" + row.ToString()];
                objRange.Alignment.Horizontal = SpreadsheetHorizontalAlignment.Center;

                // 조치여부
                objRange = objWorkSheet.Range["R2:R" + row.ToString()];
                objRange.Alignment.Horizontal = SpreadsheetHorizontalAlignment.Center;

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
                objWorkBook.SaveDocument(strTarget, DocumentFormat.Xls);
                objWorkBook.Dispose();

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

            #endregion
        }

        return strReturn;
    }

    #endregion


    public static void addImage(string file, Range r)
    {
        if (!System.IO.File.Exists(file)) return;

        Worksheet s = r.Worksheet;

        ////using (System.Drawing.Image img = System.Drawing.Image.FromFile(file))
        ////{
        ////    System.Windows.Forms.Clipboard.SetImage(img);
        ////    s.Paste(r, false);
        ////    Excel.Pictures p = (Excel.Pictures)s.Pictures(System.Reflection.Missing.Value);
        ////    Excel.Picture pic = (Excel.Picture)p.Item(p.Count);
        ////    scalePicture(pic, (double)r.Width, (double)r.Height);
        ////};

        //float left = float.Parse(r.Left.ToString()) + 2, top = float.Parse(r.Top.ToString()) + 2;

        //s.Shapes.AddPicture(file,
        //                Microsoft.Office.Core.MsoTriState.msoFalse,
        //                Microsoft.Office.Core.MsoTriState.msoCTrue,
        //                left, top, -1, -1);

        //Excel.Pictures p = (Excel.Pictures)s.Pictures(System.Reflection.Missing.Value);
        //Excel.Picture pic = (Excel.Picture)p.Item(p.Count);
        //scalePicture(pic, (double)r.Width - 4, (double)r.Height - 4);

        Picture pic = s.Pictures.AddPicture(file, r);

    }

    //public static void scalePicture(Picture pic, float width, float height)
    //{
    //    float fX = width / pic.Width;
    //    float fY = height / pic.Height;
    //    float oldH = pic.Height;
    //    if (fX < fY)
    //    {
    //        pic.Width *= fX;
    //        if (pic.Height == oldH) // no change if aspect ratio is locked
    //            pic.Height *= fX;
    //        pic.Top += (height - pic.Height) / 2;
    //    }
    //    else
    //    {
    //        pic.Width *= fY;
    //        if (pic.Height == oldH) // no change if aspect ratio is locked
    //            pic.Height *= fY;
    //        pic.Left += (width - pic.Width) / 2;
    //    }
    //}

}
