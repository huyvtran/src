//----------------------------------------
// cDBCode
//      : Code List in DB
//      : Created by Professor.X, GoodWare (2011.04)
//----------------------------------------

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;


#region cDBCode : Code List in DB. (for DDDW)

/// <summary>
/// cDBCode : Code List in DB (for DDDW)
///     - TITLE : Name List.
///     - VALUE : Value List.
///     - KEY : Key List.
/// </summary>
public class cDBCode
{
	#region Name List.

    /// <summary>
    /// Name List.
    /// </summary>
    public List<string> TITLE { get; set; }

    #endregion

    #region Value List.

    /// <summary>
    /// Value List.
    /// </summary>
    public List<string> VALUE { get; set; }

    #endregion

    #region Key in List.

    /// <summary>
    /// Key in List.
    /// </summary>
    public List<entityDatum> KEY { get; set; }

    #endregion

    #region Constructor() : Filed 초기화 및 설정.

    /// <summary>
    /// Constructor() : Filed 초기화 및 설정.
    /// </summary>
    public cDBCode()
    {
        TITLE = new List<string>();
        VALUE = new List<string>();
        KEY = new List<entityDatum>();
    }

    #endregion

    #region AddData() : Data 추가.

    /// <summary>
    /// AddData() : Data 추가.
    /// </summary>
    public void AddData(string strValue, string strTitle)
    {
        TITLE.Add(strTitle);
        VALUE.Add(strValue);
    }

    #endregion

    #region AddKey() : Key 추가.

    /// <summary>
    /// AddKey() : Key 추가.
    /// </summary>
    public void AddKey(entityDatum objKey)
    {
        KEY.Add(objKey);
    }

    #endregion
}

#endregion

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//