//----------------------------------------
// entityCollection
//      : Collection 유형 정의
//      : Created by Professor.X, GoodWare (2011.04)
//----------------------------------------

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Data;
using System.Data.SqlClient;
using System.Web.Configuration;
using System.Text;
using System.Collections;
using System.Collections.Specialized;
using System.Configuration;

#region entityDatum : Data List 유형.

/// <summary>
/// entityDatum : Data List 유형.
///     - DATA : Data List.
/// </summary>
public class entityDatum
{
    #region DATA : Data List.

    /// <summary>
    /// DATA : Data List.
    /// </summary>
    public List<string> DATA { get; set; }

    #endregion

    #region Constructor : Filed 초기화 및 설정.

    /// <summary>
    /// Constructor : Filed 초기화 및 설정.
    /// </summary>
    public entityDatum()
    {
        DATA = new List<string>();
    }

    #endregion

    #region Add() : Data 추가.

    /// <summary>
    /// Add() : Data 추가.
    /// </summary>
    public void Add(string strData)
    {
        DATA.Add(strData);
    }

    #endregion
}

#endregion

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

#region entityJSON : JSON 유형.

/// <summary>
/// entityJSON : JSON 유형.
///     - NAME : Name.
///     - VALUE : Value.
/// </summary>
public class entityJSON
{
    #region NAME : Name.

    /// <summary>
    /// NAME : Name.
    /// </summary>
    public string NAME { get; set; }

    #endregion

    #region VALUE : Value.

    /// <summary>
    /// VALUE : Value.
    /// </summary>
    public string VALUE { get; set; }

    #endregion

    #region Constructor : Filed 초기화 및 설정.

    /// <summary>
    /// Constructor : Filed 초기화 및 설정.
    /// </summary>
    public entityJSON() { }
    public entityJSON(string strName, string strValue)
    {
        NAME = strName;
        VALUE = strValue;
    }

    #endregion

    #region Add() : Add Data.

    /// <summary>
    /// Add() : Add Data.
    /// </summary>
    public void Add(string strName, string strValue)
    {
        NAME = strName;
        VALUE = strValue;
    }

    #endregion

    #region getName() : Get Name.

    /// <summary>
    /// getName() : Get Name.
    /// </summary>
    public string getName(string strName)
    {
        return NAME;
    }

    #endregion

    #region getValue() : Get Value.

    /// <summary>
    /// getValue() : Get Value.
    /// </summary>
    public string getValue()
    {
        return VALUE;
    }

    #endregion
}

#endregion

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

#region entityNameValue : Name + Value List 유형.

/// <summary>
/// entityNameValue : Name + Value List 유형.
///     - NAME : Name List.
///     - VALUE : Value List.
/// </summary>
public class entityNameValue
{
	#region NAME : Name List.

    /// <summary>
    /// NAME : Name List.
    /// </summary>
    public List<string> NAME { get; set; }

    #endregion

    #region VALUE : Value List.

    /// <summary>
    /// VALUE : Value List.
    /// </summary>
    public List<string> VALUE { get; set; }

    #endregion

    #region Constructor : Filed 초기화 및 설정.

    /// <summary>
    /// Constructor : Filed 초기화 및 설정.
    /// </summary>
    public entityNameValue() { }
    public entityNameValue(bool bInitialize) 
    {
        if (bInitialize)
        {
            NAME = new List<string>();
            VALUE = new List<string>();
        }
    }

    #endregion

    #region getSize() : Data Size를 Return.

    /// <summary>
    /// getSize() : Data Size을 Return.
    /// </summary>
    public int getSize()
    {
        return NAME.Count;
    }

    #endregion

    #region Add() : Add Data.

    /// <summary>
    /// Add() : Add Data.
    /// </summary>
    public void Add(string strName, string strValue)
    {
        NAME.Add(strName);
        VALUE.Add(strValue);
    }

    #endregion

    #region getValue() : 해당 Name의 Value를 Get.

    /// <summary>
    /// getValue() : 해당 Name의 Value를 Get.
    /// </summary>
    public string getValue(string strName)
    {
        for (int iAry = 0; iAry < this.NAME.Count; iAry++)
        {
            if (this.NAME[iAry] == strName)
                return this.VALUE[iAry];
        }
        throw new Exception(
                "Data에서 해당 요소를 찾을 수 없습니다."
            );
    }

    #endregion

    #region setValue() : 해당 Name의 Value를 설정.

    /// <summary>
    /// setValue() : 해당 Name의 Value를 설정.
    /// </summary>
    public void setValue(string strName, string strValue)
    {
        for (int iAry = 0; iAry < this.NAME.Count; iAry++)
        {
            if (this.NAME[iAry] == strName)
            {
                this.VALUE[iAry] = strValue;
                return;
            }
        }
        throw new Exception(
                "Data에서 설정할 요소를 찾을 수 없습니다."
            );
    }

    #endregion
}

#endregion

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

#region entityParameter : Parameter List 유형.

/// <summary>
/// entityParameter : Parameter List 유형.
///     - NAME : Name List.
///     - VALUE : Value List.
///     - TYPE : Type List.
/// </summary>
public class entityParameter
{
    #region NAME : Name List.

    /// <summary>
    /// NAME : Name List.
    /// </summary>
    public List<string> NAME { get; set; }

    #endregion

    #region VALUE : Value List.

    /// <summary>
    /// VALUE : Value List.
    /// </summary>
    public List<string> VALUE { get; set; }

    #endregion

    #region TYPE : Type List.

    /// <summary>
    /// TYPE : Type List.
    /// </summary>
    public List<string> TYPE { get; set; }

    #endregion

    #region Constructor : Filed 초기화 및 설정.

    /// <summary>
    /// Constructor : Filed 초기화 및 설정.
    /// </summary>
    public entityParameter() { }

    #endregion

    #region getSize() : Data Size를 Return.

    /// <summary>
    /// getSize() : Data Size을 Return.
    /// </summary>
    public int getSize()
    {
        return NAME.Count;
    }

    #endregion

    #region Add() : Add Data.

    /// <summary>
    /// Add() : Add Data.
    /// </summary>
    public void Add(string strName, string strValue, string strType)
    {
        NAME.Add(strName);
        VALUE.Add(strValue);
        TYPE.Add(strType);
    }

    #endregion

    #region getType() : 해당 Name의 Type을 Get.

    /// <summary>
    /// getType() : 해당 Name의 Type을 Get.
    /// </summary>
    public string getType(string strName)
    {
        for (int iAry = 0; iAry < this.NAME.Count; iAry++)
        {
            if (this.NAME[iAry] == strName)
                return this.TYPE[iAry];
        }
        throw new Exception(
                "Data에서 해당 요소를 찾을 수 없습니다."
            );
    }

    #endregion

    #region getValue() : 해당 Name의 Value를 Get.

    /// <summary>
    /// getValue() : 해당 Name의 Value를 Get.
    /// </summary>
    public string getValue(string strName)
    {
        for (int iAry = 0; iAry < this.NAME.Count; iAry++)
        {
            if (this.NAME[iAry] == strName)
                return this.VALUE[iAry];
        }
        throw new Exception(
                "Data에서 해당 요소를 찾을 수 없습니다."
            );
    }

    #endregion

    #region setValue() : 해당 Name의 Value를 설정.

    /// <summary>
    /// setValue() : 해당 Name의 Value를 설정.
    /// </summary>
    public void setValue(string strName, string strValue)
    {
        for (int iAry = 0; iAry < this.NAME.Count; iAry++)
        {
            if (this.NAME[iAry] == strName)
            {
                this.VALUE[iAry] = strValue;
                return;
            }
        }
        throw new Exception(
                "Data에서 설정할 요소를 찾을 수 없습니다."
            );
    }

    #endregion
}

#endregion

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//