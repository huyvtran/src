//----------------------------------------
// cMailData
//      : Passed Data to EMail (from Client)
//      : Created by Professor.X, GoodWare (2011.04)
//----------------------------------------

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;
using System.Web.Script.Serialization;

#region cMailData : Passed Data to EMail

/// <summary>
/// cMailData : Passed Data to EMail.
///     - FROM : Sender.
///     - TO : Receiver List.
///     - BODY : Mail Body.
///     - OUTPUT : Output Data List.
/// </summary>
public class cMailData
{
    #region SECTION : SMTP Section.

    /// <summary>
    /// SECTION : SMTP Section.
    /// </summary>
    public string SECTION { get; set; }

    #endregion

    #region FROM : Sender.

    /// <summary>
    /// FROM : Sender.
    /// </summary>
    public string FROM { get; set; }

    #endregion

    #region TO : Receiver List.

    /// <summary>
    /// TO : Receiver List.
    /// </summary>
    public string[] TO { get; set; }

    #endregion

    #region CC : Carbon Copy List.

    /// <summary>
    /// CC : Carbon Copy List.
    /// </summary>
    public string[] CC { get; set; }

    #endregion

    #region SUBJECT : Subject.

    /// <summary>
    /// SUBJECT : Subject.
    /// </summary>
    public string SUBJECT { get; set; }

    #endregion
    
    #region BODY : Mail Body.

    /// <summary>
    /// BODY : Mail Body.
    /// </summary>
    public string BODY { get; set; }

    #endregion

    #region HTML : Html Y/N.

    /// <summary>
    /// HTML : Html Y/N.
    /// </summary>
    public bool HTML { get; set; }

    #endregion

    #region STRETCH : Sending Strech.

    /// <summary>
    /// STRETCH : Sending Strech.
    /// </summary>
    public bool STRETCH { get; set; }

    #endregion

    #region OUTPUT : Output Data List.

    /// <summary>
    /// OUTPUT : Output Data List.
    /// </summary>
    public entityNameValue OUTPUT { get; set; }

    #endregion

    #region Constructor : Filed 초기화 및 설정.

    /// <summary>
    /// Constructor : Filed 초기화 및 설정.
    /// </summary>
    public cMailData() { }

    #endregion

    #region getFrom() : Get FROM.

    /// <summary>
    /// getFrom() : Get FROM.
    /// </summary>
    public string getFrom()
    {
        return this.FROM;
    }

    #endregion
}

#endregion

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//