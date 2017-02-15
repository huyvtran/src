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

public partial class Job_ECM_1028 : System.Web.UI.Page
{

    protected static SqlConnection objCon = null;
    protected static SqlCommand objCmd = null;
    protected static SqlDataReader objDr = null;

    protected static Word.Application _WordApp;
    protected static Word.Document _WordDoc;

    protected void Page_Load(object sender, EventArgs e)
    {
    }

}
