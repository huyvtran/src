using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Drawing;
using System.IO;
using System.Text;
using System.Web.Script.Serialization;
using System.Web.Services;

public partial class JOB_HRM_8000 : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        TimeSpan ts = new TimeSpan(0, 5, 0);
        this.AsyncTimeout = ts;
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
            #region initialize to Save.

            // initialize to Update.
            //
            objUpdate.initialize(false);

            #endregion

            #region Customize.

            //---------------------------------------------------------------------------
            // rec_seq 생성
            //---------------------------------------------------------------------------
            for (int iAry = 0; iAry < DATA.getSize(); iAry++)
            {
                string strID = string.Empty;
                string strKey = string.Empty;
                switch (DATA.getObject(iAry).getQuery())
                {
                    case "HRM_8000_04": //가족사항
                        {
                            strID = "EMP_RECRUIT_D4";
                            strKey = "rec_seq";
                        }
                        break;
                    case "HRM_8000_05": //경력사항
                        {
                            strID = "EMP_RECRUIT_D3";
                            strKey = "rec_seq";
                        }
                        break;
                    case "HRM_8000_06": //외국어
                        {
                            strID = "EMP_RECRUIT_D5";
                            strKey = "rec_seq";
                        }
                        break;
                    case "HRM_8000_07": //수상경력
                        {
                            strID = "EMP_RECRUIT_D6";
                            strKey = "rec_seq";
                        }
                        break;
                    case "HRM_8000_08": //해외여행
                        {
                            strID = "EMP_RECRUIT_D9";
                            strKey = "rec_seq";
                        }
                        break;
                    case "HRM_8000_09": //자격/면허
                        {
                            strID = "EMP_RECRUIT_D7";
                            strKey = "rec_seq";
                        }
                        break;
                    default:
                        continue;
                }
                int iKey = 0;
                for (int iRow = 0; iRow < DATA.getObject(iAry).getSize(); iRow++)
                {
                    if (DATA.getObject(iAry).getRow(iRow).getType() == typeQuery.INSERT)
                    {
                        if (iKey == 0)
                        {
                            try
                            {
                                objUpdate.objDr = (new cDBQuery(
                                                        ruleQuery.INLINE,
                                                        "SELECT dbo.FN_CREATEKEY('" + strID + "','" +
                                                            DATA.getValue(iAry, iRow, "ann_key") + "," +
                                                            DATA.getValue(iAry, iRow, "ann_seq") + "," +
                                                            DATA.getValue(iAry, iRow, "app_key") + "')"
                                                    )).retrieveQuery(objUpdate.objCon);
                                if (objUpdate.objDr.Read())
                                {
                                    iKey = Convert.ToInt32(objUpdate.objDr[0]);
                                }
                                objUpdate.objDr.Close();
                            }
                            catch (SqlException ex)
                            {
                                throw new Exception(
                                        new JavaScriptSerializer().Serialize(
                                            new entityProcessed<string>(
                                                    codeProcessed.ERR_SQL,
                                                    "Key를 생성할 수 없습니다.\n- " + ex.Message)
                                        )
                                    );
                            }
                            catch (Exception ex)
                            {
                                throw new Exception(
                                        new JavaScriptSerializer().Serialize(
                                            new entityProcessed<string>(
                                                    codeProcessed.ERR_PROCESS,
                                                    "Key 생성 중에 오류가 발생하였습니다.\n- " + ex.Message)
                                        )
                                    );
                            }
                        }
                        DATA.setValue(iAry, iRow, strKey, Convert.ToString(iKey++));
                    }
                }
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

    protected void ctlUpload_FileUploadComplete(object sender, DevExpress.Web.FileUploadCompleteEventArgs e)
    {
        string strPath = Server.MapPath("~/Files/Recruit/Original");
        if (!Directory.Exists(strPath)) Directory.CreateDirectory(strPath);

        string strOriginalFileName = Path.GetFileNameWithoutExtension(e.UploadedFile.FileName);
        string strFileName = Path.GetFileName(e.UploadedFile.FileName);
        string strExt = Path.GetExtension(e.UploadedFile.FileName).Substring(1);
        string strNewFileName = getNewFileName(Path.Combine(strPath, strFileName));
        e.UploadedFile.SaveAs(strNewFileName);

        // image resize : 긴축을 130px, by KWY, 20130927
        Image img = Image.FromFile(strNewFileName);
        if (img.Height > 130)
            img = ResizeByHeight(img, 130);

        // 무조건 jpg로 변환 : by KWY, 20130927
        strPath = Server.MapPath("~/Files/Recruit");
        strExt = "jpg";
        strNewFileName = Path.Combine(strPath, Path.GetFileNameWithoutExtension(strNewFileName) + ".jpg");
        img.Save(strNewFileName, System.Drawing.Imaging.ImageFormat.Jpeg);

        img.Dispose();

        e.CallbackData = Path.GetFileNameWithoutExtension(strNewFileName) + "@" + strOriginalFileName + "@" + strExt + "@" + strPath;
    }

    # region ResizeByWidth
    protected Image ResizeByWidth(Image Img, int NewWidth)
    {
        float PercentW = ((float)Img.Width / (float)NewWidth);

        System.Drawing.Bitmap bmp = new System.Drawing.Bitmap(NewWidth, (int)(Img.Height / PercentW));
        Graphics g = Graphics.FromImage(bmp);

        g.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
        g.DrawImage(Img, 0, 0, bmp.Width, bmp.Height);
        g.Dispose();

        return bmp;
    }
    # endregion

    # region ResizeByHeight
    protected static Image ResizeByHeight(Image Img, int NewHeight)
    {
        float PercentH = ((float)Img.Height / (float)NewHeight);

        Bitmap bmp = new Bitmap((int)(Img.Width / PercentH), NewHeight);
        Graphics g = Graphics.FromImage(bmp);

        g.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
        g.DrawImage(Img, 0, 0, bmp.Width, bmp.Height);
        g.Dispose();

        return bmp;
    }
    # endregion

    protected string getNewFileName(string aFullName)
    {
        string strPath = Path.GetDirectoryName(aFullName);
        string strPrefix = DateTime.Now.ToString("yyyyMMddHHmmss");
        string strNewFileName = strPrefix;
        string strExt = Path.GetExtension(aFullName);
        int iCnt = 0;

        while (true)
        {
            if (File.Exists(Path.Combine(strPath, strNewFileName + strExt)))
            {
                iCnt++;
                strNewFileName = strPrefix + "[" + iCnt.ToString() + "]";
            }
            else
            {
                break;
            }
        }

        return Path.Combine(strPath, strNewFileName + strExt);
    }

    #region sendToUserEmail() : 제출 확인 메일 발송
    /// <summary>
    /// 
    /// </summary>
    [WebMethod]
    public static string sendToUserEmail(string pTitle, string pEmail)
    {
        cMail mail = new cMail();

        string tDay = "";
        DateTime dt = new DateTime();
        dt = DateTime.Now;
        tDay = String.Format("{0:yyyy-MM-dd HH:mm}", Convert.ToDateTime(dt.ToString()));

        StringBuilder sb = new StringBuilder();
        sb.Append("<table   width='417' height='316' border='0' cellpadding='0' cellspacing='0'> <tr> ");
        sb.Append("<td colspan='3'> <img src='http://recruit.apsystems.co.kr/recruit/images/applicant_ok_01.png' width='417' height='76' alt=''></td> </tr>");
        sb.Append("<tr> <td rowspan='3' valign='top'> <img src='http://recruit.apsystems.co.kr/recruit/images/applicant_ok_02.png' width='161' height='184' alt=''></td>");
        sb.Append("<td colspan='2'> <img src='http://recruit.apsystems.co.kr/recruit/images/applicant_ok_03.png' width='256' height='39' alt=''></td> </tr>");
        sb.Append("<tr> <td colspan='2' width='256' height='110' align='center' valign='top'>&nbsp;<b>" + pTitle + "</b></td> </tr>");
        sb.Append("<tr> <td> <img src='http://recruit.apsystems.co.kr/recruit/images/applicant_ok_05.png' width='60' height='35' alt=''></td> <td width='196' height='35' align='center'>&nbsp;<b>" + tDay + "</b></td>");
        sb.Append("</tr> <tr> <td colspan='3'> <img src='http://recruit.apsystems.co.kr/recruit/images/applicant_ok_07.png' width='417' height='56' alt=''></td> </tr> </table>");

        //bool success = cMail.sendMail(pEmail, "", "[AP Systems]에 지원해주셔서 감사합니다.", sb.ToString(), true, "smtp_2");
        bool success = mail.sendMail("", pEmail, "[AP Systems]에 지원해주셔서 감사합니다.", sb.ToString(), true, "smtp_2");

        if (success)
        {
            return new JavaScriptSerializer().Serialize(
                            new entityProcessed<string>(
                                    codeProcessed.SUCCESS,
                                    "메일이 발송되었습니다.")
                        );
        }
        else
        {
            return new JavaScriptSerializer().Serialize(
                            new entityProcessed<string>(
                                    codeProcessed.ERR_PARAM,
                                    "메일 발송이 실패했습니다.")
                        );
        }
    }

    #endregion


}
