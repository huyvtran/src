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

public partial class Job_w_upload_recruit : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
    }

    protected void ctlUpload_FileUploadComplete(object sender, DevExpress.Web.FileUploadCompleteEventArgs e)
    {
        string strPath = Server.MapPath("~/Files/Recruit/Announce");
        if (!Directory.Exists(strPath)) Directory.CreateDirectory(strPath);

        string strOriginalFileName = Path.GetFileNameWithoutExtension(e.UploadedFile.FileName);
        string strFileName = Path.GetFileName(e.UploadedFile.FileName);
        string strExt = Path.GetExtension(e.UploadedFile.FileName).Substring(1);
        string strNewFileName = getNewFileName(Path.Combine(strPath, strFileName));
        e.UploadedFile.SaveAs(strNewFileName);
        e.CallbackData = Path.GetFileNameWithoutExtension(strNewFileName) + "@" + strOriginalFileName + "@" + strExt + "@" + strPath;
    }

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

}
