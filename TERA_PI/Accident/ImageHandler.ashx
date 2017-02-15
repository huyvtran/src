<%@ WebHandler Language="C#" Class="ImageHandler" %>

using System;
using System.Web;
using System.Configuration;
using System.Data.SqlClient;
using System.Drawing;
using System.Drawing.Imaging;


public class ImageHandler : IHttpHandler {

    public void ProcessRequest (HttpContext context) {

        context.Response.Clear();

        string start_date = String.IsNullOrEmpty(context.Request.QueryString["start_date"])?"20150801":context.Request.QueryString["start_date"];
        string today = string.Empty;
        string acc_days = string.Empty;
        string acc_times = string.Empty;

        try
        {
            using (SqlConnection objCon = new SqlConnection(ConfigurationManager.ConnectionStrings["PLMDB"].ConnectionString))
            {
                objCon.Open();
                string strSQL = string.Format("SELECT CONVERT(VARCHAR, GETDATE(), 112) AS today, dbo.TO_MONEY(A.acc_days, 0) AS acc_days, dbo.TO_MONEY(A.acc_times, 0) AS acc_times FROM dbo.fn_getAccidentDay('{0}') A", start_date);
                SqlDataReader objDr = (new cDBQuery(ruleQuery.INLINE, strSQL)).retrieveQuery(objCon);

                while (objDr.Read())
                {
                    today = objDr[0].ToString();
                    acc_days = objDr[1].ToString();
                    acc_times = objDr[2].ToString();

                    //creating a image object
                    Image bitmap = (System.Drawing.Image)Bitmap.FromFile(context.Server.MapPath("~/Style/images/TERA/TERA_Accdient.png")); // set image    
                                                                                                                     //draw the image object using a Graphics object   
                    Graphics graphicsImage = Graphics.FromImage(bitmap);

                    //Set the alignment based on the coordinates      
                    StringFormat stringformat = new StringFormat();
                    stringformat.Alignment = StringAlignment.Far;
                    stringformat.LineAlignment = StringAlignment.Far;

                    StringFormat stringformat2 = new StringFormat();
                    stringformat2.Alignment = StringAlignment.Center;
                    stringformat2.LineAlignment = StringAlignment.Center;

                    //Set the font color/format/size etc..     
                    Color StringColor1 = ColorTranslator.FromHtml("#000000");
                    Color StringColor2 = ColorTranslator.FromHtml("#0000FF");
                    Color StringColor3 = ColorTranslator.FromHtml("#FF0000");

                    graphicsImage.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.HighQuality;
                    graphicsImage.TextRenderingHint = System.Drawing.Text.TextRenderingHint.AntiAlias;

                    // 개시일
                    string yy = Convert.ToInt16(start_date.Substring(0, 4)).ToString();
                    string mm = Convert.ToInt16(start_date.Substring(4, 2)).ToString();
                    string dd = Convert.ToInt16(start_date.Substring(6, 2)).ToString();
                    graphicsImage.DrawString(yy, new Font("arial", 11, FontStyle.Bold), new SolidBrush(StringColor1), new Point(401, 125), stringformat);
                    graphicsImage.DrawString(mm, new Font("arial", 11, FontStyle.Bold), new SolidBrush(StringColor1), new Point(435, 125), stringformat);
                    graphicsImage.DrawString(dd, new Font("arial", 11, FontStyle.Bold), new SolidBrush(StringColor1), new Point(470, 125), stringformat);

                    // 현재
                    mm = Convert.ToInt16(today.Substring(4, 2)).ToString();
                    dd = Convert.ToInt16(today.Substring(6, 2)).ToString();
                    graphicsImage.DrawString(mm, new Font("arial", 19, FontStyle.Bold), new SolidBrush(StringColor2), new Point(331, 189), stringformat);
                    graphicsImage.DrawString(dd, new Font("arial", 19, FontStyle.Bold), new SolidBrush(StringColor2), new Point(378, 189), stringformat);

                    // 무재해
                    graphicsImage.DrawString(acc_days, new Font("arial", 19, FontStyle.Bold), new SolidBrush(StringColor3), new Point(247, 223), stringformat);
                    graphicsImage.DrawString(acc_times, new Font("arial", 19, FontStyle.Bold), new SolidBrush(StringColor3), new Point(361, 223), stringformat);

                    context.Response.ContentType = "image/png";

                    bitmap.Save(context.Response.OutputStream, ImageFormat.Png);
                }

                objCon.Close();
            }

        }
        catch(Exception ex)
        {
            context.Response.ContentType = "text/html";
            context.Response.Write("<p>Error!!</p>");
        }
        finally
        {
        }

    }

    public bool IsReusable {
        get {
            return false;
        }
    }

}