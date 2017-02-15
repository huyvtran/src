//------------------------------------------
// svc_Compress
//      : Compress/Extract
//		: Created by Professor.X, GoodWare (2011.03.10)
//------------------------------------------

using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Web.Script.Serialization;
using System.Web.Services;

/// <summary>
/// svc_Compress
///     : Compress/Extract
///     : output - String
/// </summary>
public partial class Service_svc_Compress : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
    }
    
    [WebMethod]
    public static string Compress(string[] _files)
    {
    	
    	
    	
    	

        return new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                                codeProcessed.SUCCESS,
                                "")
                    );
    }
    

}
