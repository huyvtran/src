//----------------------------------------
// entityProcessed
//      : Service의 처리 결과
//      : Created by Professor.X, GoodWare (2011.04)
//----------------------------------------

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

#region entityProcessed : Service의 처리 결과.

/// <summary>
/// entityProcessed : Service의 처리 결과.
///     - iCode : Processed Code
///     - tData : Processed Data (can be Error Message)
/// </summary>
public class entityProcessed<T>
{
    #region iCode : Processed Code.

    private int _iCode;
    /// <summary>
    /// iCode : Processed Code. (codeProcessed 참조)
    /// </summary>
    public int iCode
    {
        get { return _iCode; }
        set { _iCode = value; }
    }

    #endregion

    #region tData : Processed Data.

    private T _tData;
    /// <summary>
    /// tData : Processed Data. (can be Error Message)
    /// </summary>
    public T tData
    {
        get { return _tData; }
        set { _tData = value; }
    }

    #endregion

    #region 생성자 : 필드 초기화 및 값 설정.

    /// <summary>
    /// 생성자 : 필드 초기화 및 정의.
    /// </summary>
    public entityProcessed() { }
    public entityProcessed(codeProcessed enCode, T tData)
    {
        this.iCode = Convert.ToInt32(enCode);
        this.tData = tData;
    }

    #endregion

    #region setValue() : 필드 값 설정.

    /// <summary>
    /// setValue() : 필드 값 설정.
    /// </summary>
    public void setValue(codeProcessed enCode, T tData)
    {
        this.iCode = Convert.ToInt32(enCode);
        this.tData = tData;
    }

    #endregion
}

#endregion

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//