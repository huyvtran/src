using System;
using System.Collections.Generic;
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
using Excel = Microsoft.Office.Interop.Excel;
using System.Diagnostics;
using System.Windows.Forms;
using System.Linq;
using System.Reflection;

public partial class JOB_DEV_0000 : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        string filepath = @"C:\Users\Hee\Documents\Sample.xlsx";
        ASExcel ex = new ASExcel();
        ex.openFile(filepath);
        List<List<string>> list = ex.getList();
        string sheetname = "list";
        ex.deleteSheet(sheetname);
        ex.addSheet();
        ex.cellRename(sheetname, 3);
        ex.insertList(list, sheetname);
        ex.saveFile();
        
    }
    
    
}
