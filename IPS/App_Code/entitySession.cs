//----------------------------------------
// entitySession
//      : Session Data 정의
//      : Created by Professor.X, GoodWare (2011.04)
//----------------------------------------

using System;
using System.Data;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Xml.Linq;

#region entitySession : Session Data.

/// <summary>
/// entitySession : Session Data.
///     - VALUE List : Value List.
/// </summary>
public class entitySession
{
    #region Fields.

    /// <summary>
    /// Fields.
    /// </summary>
    public string USR_ID { get; set; }
    public string GW_ID { get; set; }
    public string USR_NM { get; set; }
    public string EMP_NO { get; set; }
    public string DEPT_CD { get; set; }
    public string DEPT_NM { get; set; }
    public string POS_CD { get; set; }
    public string POS_NM { get; set; }
    public string DEPT_AREA { get; set; }
    public string DEPT_AUTH { get; set; }
    public string USER_TP { get; set; }
    public string PUB_IP { get; set; }

    #endregion

    #region Constructor() : Filed 초기화 및 설정.

    /// <summary>
    /// Constructor() : Filed 초기화 및 설정.
    /// </summary>
    public entitySession() { }
    public entitySession(string strUSR_ID, string strGW_ID, string strUSR_NM, string strEMP_NO, string strDEPT_CD, string strDEPT_NM, string strPOS_CD, string strPOS_NM)
    {
        this.USR_ID = strUSR_ID;
        this.GW_ID = strGW_ID;
        this.USR_NM = strUSR_NM;
        this.EMP_NO = strEMP_NO;
        this.DEPT_CD = strDEPT_CD;
        this.DEPT_NM = strDEPT_NM;
        this.POS_CD = strPOS_CD;
        this.POS_NM = strPOS_NM;
    }
    public entitySession(string strUSR_ID, string strGW_ID, string strUSR_NM, string strEMP_NO
        , string strDEPT_CD, string strDEPT_NM, string strPOS_CD, string strPOS_NM, string strDEPT_AREA, string strDEPT_AUTH, string strUSER_TP, string strPUB_IP)
    {
        this.USR_ID = strUSR_ID;
        this.GW_ID = strGW_ID;
        this.USR_NM = strUSR_NM;
        this.EMP_NO = strEMP_NO;
        this.DEPT_CD = strDEPT_CD;
        this.DEPT_NM = strDEPT_NM;
        this.POS_CD = strPOS_CD;
        this.POS_NM = strPOS_NM;
        this.DEPT_AREA = strDEPT_AREA;
        this.DEPT_AUTH = strDEPT_AUTH;
        this.USER_TP = strUSER_TP;
        this.PUB_IP = strPUB_IP;
    }

    #endregion
}

#endregion

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//