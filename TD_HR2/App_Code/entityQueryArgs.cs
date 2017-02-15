//----------------------------------------
// entityQueryArgs
//      : Query Arguments for CRUD
//      : Created by Professor.X, GoodWare (2011.04.03)
//----------------------------------------

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

#region entitySelectArgs : Select Query Arguments

/// <summary>
/// entitySelectArgs : Select Query Arguments.
///     - iType : Argument Type
///     - strQuery : Query as Parameter
/// </summary>
public class entitySelectArgs
{
    #region iType : Argument Type.

    private int _iType;
    /// <summary>
    /// iType : Argument Type. (typeColumn 참조)
    /// </summary>
    public int iType
    {
        get { return _iType; }
        set { _iType = value; }
    }

    #endregion

    #region strWhere : Where 부분 Query.

    private string _strWhere;
    /// <summary>
    /// strWhere : Where 부분 Query.
    /// </summary>
    public string strWhere
    {
        get { return _strWhere; }
        set { _strWhere = value; }
    }

    #endregion

    #region 생성자 : 필드 초기화 및 값 설정.

    /// <summary>
    /// 생성자 : 필드 초기화 및 정의.
    /// </summary>
    public entitySelectArgs() { }
    public entitySelectArgs(string strType, string strQuery)
    {
        this.iType = Convert.ToInt32(getType(strType));
        this.strWhere = strQuery;
    }

    #endregion

    #region getType() : Cast by typeColumn.

    /// <summary>
    /// getType() : Cast by typeColumn.
    /// </summary>
    public typeArgument getType(string strType)
    {
        switch (strType)
        {
            case "Num":
                return typeArgument.NUM;
            case "Char":
                return typeArgument.CHAR;
            case "Date":
                return typeArgument.DATE;
            case "DateTime":
                return typeArgument.DATETIME;

        }
        throw new Exception(
                "잘못된 Database Argument Type입니다."
            );
    }

    #endregion


    #region convertWhere() : Where 부분 변환.

    /// <summary>
    /// convertWhere() : Where 부분 변환.
    /// </summary>
    public string convertWhere(string strQuery, string strID, string strKey, string strValue)
    {
        strValue = (string.IsNullOrEmpty(strValue)) ? "%" : strValue;
        strQuery = strQuery.Replace(strID + "." + strKey, this.strWhere);
        strQuery = strQuery.Replace(":" + strKey, convertArg(strValue));
        
        return strQuery;
    }

    #endregion

    #region convertArg() : Argument Type에 따른 변환.

    /// <summary>
    /// convertArg() : Argument Type에 따른 변환.
    /// </summary>
    public string convertArg(string strArg)
    {
        switch ((typeArgument)this.iType)
        {
            case typeArgument.CHAR:
            case typeArgument.DATE:
            case typeArgument.DATETIME:
                {
                    return "'" + strArg + "'";
                }
            case typeArgument.NUM:
                {
                    return (strArg == "%") ? "" : strArg;
                }
        }
        return null;
    }

    #endregion
}

#endregion

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//