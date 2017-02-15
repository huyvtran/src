//----------------------------------------
// cDBParameter
//      : Query Parameter Entity
//      : Created by Professor.X, GoodWare (2011.04)
//----------------------------------------

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;

#region cDBParameter : Query Parameter Entity

/// <summary>
/// cDBParameter : Query Parameter Entity
///	- strName : 이름.
///     - enType : Column Type. (SqlDbType)
///     - iLength : Column Length.
/// </summary>
public class cDBParameter
{
    #region strName : 이름.

    private string _strName;
    /// <summary>
    /// strName : 이름.
    /// </summary>
    public string strName
    {
        get { return _strName; }
        set { _strName = value; }
    }

    #endregion

    #region enType : Column Type. (SqlDbType)

    private SqlDbType _enType;
    /// <summary>
    /// enType : Column Type. (SqlDbType)
    /// </summary>
    public SqlDbType enType
    {
        get { return _enType; }
        set { _enType = value; }
    }

    #endregion

    #region iLength : Column Length.

    private int _iLength;
    /// <summary>
    /// iLength : Column Length.
    /// </summary>
    public int iLength
    {
        get { return _iLength; }
        set { _iLength = value; }
    }

    #endregion

    #region strValue : Data Value.

    private string _strValue;
    /// <summary>
    /// strValue : Data Value.
    /// </summary>
    public string strValue
    {
        get { return _strValue; }
        set { _strValue = value; }
    }

    #endregion

    #region Constructor : Filed 초기화 및 설정.

    /// <summary>
    /// Constructor : Filed 초기화 및 설정.
    /// </summary>
    public cDBParameter() { }
    public cDBParameter(string strName, SqlDbType enType, int iLength, string strValue)
    {
        this.strName = strName;
        this.enType = enType;
        this.iLength = iLength;
        this.strValue = strValue;
    }

    #endregion

    #region setField() : Field Value 설정.

    /// <summary>
    /// setField() : Field Value 설정.
    /// </summary>
    public void setField(string strName, SqlDbType enType, int iLength, string strValue)
    {
        this.strName = strName;
        this.enType = enType;
        this.iLength = iLength;
        this.strValue = strValue;
    }

    #endregion

    #region setValue() : Value 설정.

    /// <summary>
    /// setValue() : Value 설정.
    /// </summary>
    public void setValue(string strValue)
    {
        this.strValue = strValue;
    }

    #endregion

    #region attachQuery() : Attach Query.

    /// <summary>
    /// attachQuery() : Attach Query.
    /// </summary>
    public void attachQuery(SqlCommand objCmd)
    {
        objCmd.Parameters.Add(
            this.strName,
            this.enType,
            this.iLength);
        objCmd.Parameters[this.strName].Value = this.strValue;
    }

    #endregion
}

#endregion

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//