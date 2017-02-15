//----------------------------------------
// cSavedData
//      : Saved Data in DB
//      : Created by Professor.X, GoodWare (2011.04)
//----------------------------------------

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

#region cSavedData : Saved Query & Primary Key in DB.

/// <summary>
/// cSavedData : Saved Query & Primary Key in DB.
/// </summary>
public class cSavedData
{
    #region Query.

    /// <summary>
    /// Query.
    /// </summary>
    public string QUERY { get; set; }

    #endregion

	#region Key List.

    /// <summary>
    /// Key List.
    /// </summary>
    public List<entityJSON> KEY { get; set; }

    #endregion

    #region Constructor() : Filed 초기화 및 설정.

    /// <summary>
    /// Constructor() : Filed 초기화 및 설정.
    /// </summary>
    public cSavedData()
    {
        this.QUERY = string.Empty;
        this.KEY = new List<entityJSON>();
    }
    public cSavedData(string strQuery)
    {
        this.QUERY = strQuery;
        this.KEY = new List<entityJSON>();
    }

    #endregion

    #region addKey() : Key 추가.

    /// <summary>
    /// addKey() : Key 추가.
    /// </summary>
    public void addKey(string strName, string strValue)
    {
        this.KEY.Add(new entityJSON(strName, strValue));
    }

    #endregion
}

#endregion

