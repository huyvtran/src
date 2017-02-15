//----------------------------------------
// cDBKey
//      : Primary Key in DB
//      : Created by Professor.X, GoodWare (2011.04)
//----------------------------------------

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

#region cDBKey : Primary Key in DB.

/// <summary>
/// cDBKey : Primary Key in DB.
/// </summary>
public class cDBKey
{
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
    public cDBKey()
    {
        KEY = new List<entityJSON>();
    }

    #endregion

    #region Add() : Key 추가.

    /// <summary>
    /// Add() : Key 추가.
    /// </summary>
    public void Add(string strName, string strValue)
    {
        this.KEY.Add(new entityJSON(strName, strValue));
    }

    #endregion
}

#endregion

