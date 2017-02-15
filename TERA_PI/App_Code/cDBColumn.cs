//----------------------------------------
// cDBColumn
//      : Manipulation about DB Columns for Query
//      : Created by Professor.X, GoodWare (2011.04)
//----------------------------------------

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;
using System.Collections.Specialized;

#region cDBColumn : Database Column 관련 정의 및 기능

/// <summary>
/// cDBColumn : Database Column 관련 정의 및 기능
///     - strName : 이름
///     - enType : Column Type. (SqlDbType)
///     - bUpdatable : Update 대상 여부
///     - bKey : Primary Key 여부
/// </summary>
public class cDBColumn
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

    #region bUpdatable : Update 대상 여부.

    private bool _bUpdatable;
    /// <summary>
    /// bUpdatable : 저장 대상 여부.
    /// </summary>
    public bool bUpdatable
    {
        get { return _bUpdatable; }
        set { _bUpdatable = value; }
    }

    #endregion

    #region bKey : Primary Key 여부.

    private bool _bKey;
    /// <summary>
    /// bKey : Primary Key 여부.
    /// </summary>
    public bool bKey
    {
        get { return _bKey; }
        set { _bKey = value; }
    }

    #endregion

    #region Constructor : Filed 초기화 및 설정.

    /// <summary>
    /// Constructor : Filed 초기화 및 설정.
    /// </summary>
	public cDBColumn()	{}
    public cDBColumn(string strName, string strType, int iLength, bool bUpdatable, bool bKey)
    {
        this.strName = strName;
        this.enType = castType(strType);
        this.iLength = iLength;
        this.bUpdatable = bUpdatable;
        this.bKey = bKey;
    }

    #endregion

    #region isKey() : Key 여부 판단.

    /// <summary>
    /// isKey() : Key 여부 판단.
    /// </summary>
    public bool isKey()
    {
        return this.bKey;
    }

    #endregion

    #region castType() : Cast Column Type. (SqlDbType)

    /// <summary>
    /// castType() : Cast Column Type. (SqlDbType)
    /// </summary>
    public SqlDbType castType(string strType)
    {
        strType = strType.ToUpper();
        switch (strType)
        {
            case "TINYINT":
                return SqlDbType.TinyInt;
            case "SMALLINT":
                return SqlDbType.SmallInt;
            case "INT":
                return SqlDbType.Int;
            case "BIGINT":
                return SqlDbType.Int;
            case "NUMERIC":
                return SqlDbType.Decimal;
            case "DECIMAL":
                return SqlDbType.Decimal;
            case "CHAR":
            case "NCHAR":
		        return SqlDbType.Char;
            case "VARCHAR":
                return SqlDbType.VarChar;
            case "NVARCHAR":
                return SqlDbType.NVarChar;
            case "TEXT":
                return SqlDbType.Text;
            case "DATETIME":
                return SqlDbType.DateTime;
        }
        throw new Exception(
                "잘못된 Database Column Type입니다."
            );
    }

    #endregion

    #region convertValue() : Column Type에 따른 변환.

    /// <summary>
    /// convertValue() : Column Type에 따른 변환.
    /// </summary>
    public string convertValue(string strValue)
    {
        switch (this.enType)
        {
            case SqlDbType.Char:
            case SqlDbType.VarChar:
            case SqlDbType.NVarChar:
            case SqlDbType.Text:
                {
                    return "'" + strValue.Replace("'", "''") + "'";
                }
            case SqlDbType.Date:
            case SqlDbType.DateTime:
                {
                    return "GETDATE()";
                }
            default:
                {
                    return (string.IsNullOrEmpty(strValue)) ? "0" : strValue;
                }
        }
    }

    #endregion

    #region createQuery() : Query Type에 따른 부분 SQL 생성.

    /// <summary>
    /// createQuery() : Query Type에 따른 부분 SQL 생성.
    ///     - Query String을 만들어 Return.
    ///     - Query String 및 Parameter를 만들어 Return.
    /// </summary>
    public NameValueCollection createQuery(typeQuery enType, string strValue)
    {
        NameValueCollection lstQuery = new NameValueCollection();
        switch (enType)
        {
            case typeQuery.INSERT:
                {
                    if (this.bUpdatable)
                    {
                        lstQuery["COLUMN"] = this.strName;
                        lstQuery["VALUES"] = convertValue(strValue);
                    }
                }
                break;
            case typeQuery.UPDATE:
                {
                    if (this.bUpdatable)
                        lstQuery["SET"] = string.Format("{0} = {1}", 
                                                    this.strName, convertValue(strValue));
                    if (this.bKey)
                        lstQuery["WHERE"] = string.Format("AND {0} = {1}", 
                                                    this.strName, convertValue(strValue));
                }
                break;
            case typeQuery.DELETE:
                {
                    if (this.bKey)
                        lstQuery["WHERE"] = string.Format("AND {0} = {1}", 
                                                    this.strName, convertValue(strValue));
                }
                break;
        }
        return lstQuery;
    }
    public NameValueCollection createQuery(typeQuery enType, string strValue, List<cDBParameter> lstParam)
    {
        NameValueCollection lstQuery = new NameValueCollection();
        switch (enType)
        {
            case typeQuery.INSERT:
                {
                    if (this.bUpdatable)
                    {
                        lstQuery["COLUMN"] = this.strName;
                        lstQuery["VALUES"] = "@" + this.strName;
                        lstParam.Add(new cDBParameter(
                                            this.strName,
                                            this.enType,
                                            this.iLength,
                                            convertValue(strValue)));
                    }
                }
                break;
            case typeQuery.UPDATE:
                {
                    if (this.bUpdatable)
                    {
                        lstQuery["SET"] = string.Format("{0} = {1}",
                                                    this.strName, "@" + this.strName);
                        lstParam.Add(new cDBParameter(
                                            this.strName,
                                            this.enType,
                                            this.iLength,
                                            convertValue(strValue)));
                    }
                    if (this.bKey)
                    {
                        lstQuery["WHERE"] = string.Format("AND {0} = {1}",
                                                    this.strName, "@" + this.strName);
                        lstParam.Add(new cDBParameter(
                                            this.strName,
                                            this.enType,
                                            this.iLength,
                                            convertValue(strValue)));
                    }
                }
                break;
            case typeQuery.DELETE:
                {
                    if (this.bKey)
                    {
                        lstQuery["WHERE"] = string.Format("AND {0} = {1}",
                                                    this.strName, "@" + this.strName);
                        lstParam.Add(new cDBParameter(
                                            this.strName,
                                            this.enType,
                                            this.iLength,
                                            convertValue(strValue)));
                    }
                }
                break;
        }
        return lstQuery;
    }

    #endregion
}

#endregion

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//