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
using DevExpress.Office.Services;
using System.Net;
using DevExpress.XtraRichEdit;
using DevExpress.XtraRichEdit.API.Native;
using System.Reflection;
using System.Windows.Forms;
using System.IO;

public partial class Job_ECM_1010_test : System.Web.UI.Page
{

    DataTable mmdt = null;
    RichEditDocumentServer docServer = null;
    public Job_ECM_1010_test()
    {
        Initialize();   
    }
    protected void Page_Load(object sender, EventArgs e)
    {
        RefreshView();
    }
    public void Initialize()
    {
        mmdt = new DataTable();
        mmdt.Columns.Add("test", typeof(string));   //Merge Field 
        mmdt.Rows.Add("test_test");                 //value
    }

    public void RefreshView()
    {
        Response.StatusCode = (int)HttpStatusCode.OK;
        Response.ContentType = "application/msword";
        using (Stream outputstream = ExecuteMerge())
        {
            outputstream.Seek(0, SeekOrigin.Begin);
            outputstream.CopyTo(Response.OutputStream);
            
            Response.End();
        }
        
        
    }

    public Stream ExecuteMerge()
    {
        docServer = new RichEditDocumentServer();
        Stream result;
        try
        {
            Document doc = docServer.Document;
            docServer.LoadDocument("C:\\Users\\Hee\\Documents\\test.docx", DevExpress.XtraRichEdit.DocumentFormat.OpenXml);
            docServer.Options.MailMerge.DataSource = mmdt;
            docServer.Options.MailMerge.ViewMergedData = true;
            FieldCollection fc = docServer.Document.Fields;
            int cnt = fc.Count;
            for(int i = 0; i < cnt; i++)
            {
                Field f = fc[i];
                f.ShowCodes = false;
                string val = doc.GetText(f.CodeRange);
                val = val.Substring(12);
                val = val.Substring(0, val.LastIndexOf('\\')-1);
                val.Trim();

                MessageBox.Show("'"+val+ "'");
            }
            
        }catch(Exception e)
        {
            MessageBox.Show(e.Message);
        }
        
        result = new MemoryStream();
        mergeToDoc(result);

        return result;
        
    }
    
    public void mergeToDoc(Stream stream)
    {
        MailMergeOptions options = docServer.CreateMailMergeOptions();
        options.DataSource = mmdt;
        options.FirstRecordIndex = 0;
        options.LastRecordIndex = 0;
        docServer.MailMerge(options, stream, DevExpress.XtraRichEdit.DocumentFormat.OpenXml);
    }
}
