//----------------------------------------
// cSaveData
//      : Client I/F Data to Save
//      : Created by Professor.X, GoodWare (2011.04)
//----------------------------------------

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;

#region cSaveData : Client I/F Data to Save.

/// <summary>
/// cSaveData : Client I/F Data to Save.
///     - OBJECTS : Object (cSaveObject) List.
/// </summary>
public class cSaveData
{
    #region USER : User ID.

    /// <summary>
    /// USER : User ID.
    /// </summary>
    public string USER { get; set; }

    #endregion

    #region OBJECTS : Object (cSaveObject) List.

    /// <summary>
    /// OBJECTS : Object (cSaveObject) List.
    /// </summary>
    public List<cSaveObject> OBJECTS { get; set; }

    #endregion

    #region OPTION : 추가 Option.

    /// <summary>
    /// OPTION : 추가 Option.
    /// </summary>
    public entityNameValue OPTION { get; set; }

    #endregion

    #region Constructor : Filed 초기화 및 설정.

    /// <summary>
    /// Constructor : Filed 초기화 및 설정.
    /// </summary>
    public cSaveData() { }

    #endregion

    #region getUser() : Get User ID.

    /// <summary>
    /// getUser() : Get User ID.
    /// </summary>
    public string getUser()
    {
        return this.USER;
    }

    #endregion

    #region getObject() : 해당 Object를 Return.

    /// <summary>
    /// getOeject() : 해당 Object를 Return.
    /// </summary>
    public cSaveObject getObject(int iObject)
    {
        return this.OBJECTS[iObject];
    }

    #endregion

    #region getFirst() : 첫번째 Object를 Return.

    /// <summary>
    /// getFirst() : 첫번째 Object를 Return.
    /// </summary>
    public cSaveObject getFirst()
    {
        return this.OBJECTS[0];
    }

    #endregion

    #region getLast() : 마지막 Object를 Return.

    /// <summary>
    /// getLast() : 마지막 Object를 Return.
    /// </summary>
    public cSaveObject getLast()
    {
        return this.OBJECTS[OBJECTS.Count - 1];
    }

    #endregion

    #region getSize() : Object List의 Size를 Return.

    /// <summary>
    /// getSize() : Object List의 Size Return.
    /// </summary>
    public int getSize()
    {
        return this.OBJECTS.Count;
    }

    #endregion
    
    #region getValue() : 해당 Object, Row, Column의 Value를 Return.

    /// <summary>
    /// getValue() : 해당 Object, Row, Column의 Value를 Return.
    /// </summary>
    public string getValue(int iObject, int iRow, string strColumn)
    {
        return this.OBJECTS[iObject].getValue(iRow, strColumn);
    }

    #endregion

    #region getValues() : 해당 Object, Column의 Value List를 Return.

    /// <summary>
    /// getValues() : 해당 Object, Column의 Value List를 Return.
    /// </summary>
    public List<string> getValues(int iObject, string strColumn)
    {
        return this.OBJECTS[iObject].getValues(strColumn);
    }

    #endregion

    #region setValue() : 해당 Object, Row, Column의 Value를 설정.

    /// <summary>
    /// setValue() : 해당 Object, Row, Column의 Value를 설정.
    /// </summary>
    public void setValue(int iObject, int iRow, string strColumn, string strValue)
    {
        this.OBJECTS[iObject].setValue(iRow, strColumn, strValue);
    }

    #endregion

    #region setValues() : 해당 조건의 모든 Value를 설정.

    /// <summary>
    /// setValues() : 해당 조건의 모든 Value를 설정.
    /// </summary>
    public void setValues(int iObject, string strColumn, string strValue)
    {
        this.OBJECTS[iObject].setValues(strColumn, strValue);
    }
    public void setValues(string strColumn, string strValue)
    {
        for (int iAry = 0; iAry < this.OBJECTS.Count; iAry++)
        {
            this.OBJECTS[iAry].setValues(strColumn, strValue);
        }
    }
    
    #endregion

    #region implementValue() : Query를 통하여 해당 조건의 Value를 설정.

    /// <summary>
    /// implementValue() : Query를 통하여 해당 조건의 Value를 설정.
    /// </summary>
    public string implementValue(int iObject, int iRow, string strColumn, string strSQL, SqlConnection objCon)
    {
        string strValue = string.Empty;
        cDBQuery objQuery = new cDBQuery(
                                    ruleQuery.INLINE,
                                    strSQL
                                );
        SqlDataReader objDr = objQuery.retrieveQuery(objCon);
        if (objDr.Read())
        {
            strValue = objDr[0].ToString();
            setValue(iObject, iRow, strColumn, strValue);
        }
        objDr.Close();
        return strValue;
    }

    #endregion

    #region implementValues() : Query를 통하여 해당 조건의 모든 Value를 설정.

    /// <summary>
    /// implementValues() : Query를 통하여 해당 조건의 모든 Value를 설정.
    /// </summary>
    public string implementValues(int iObject, string strColumn, string strSQL, SqlConnection objCon)
    {
        string strValue = string.Empty;
        cDBQuery objQuery = new cDBQuery(
                                    ruleQuery.INLINE,
                                    strSQL
                                );
        SqlDataReader objDr = objQuery.retrieveQuery(objCon);
        if (objDr.Read())
        {
            strValue = objDr[0].ToString();
            setValues(iObject, strColumn, strValue);
        }
        objDr.Close();
        return strValue;
    }
    public string implementValues(string strColumn, string strSQL, SqlConnection objCon)
    {
        string strValue = string.Empty;
        cDBQuery objQuery = new cDBQuery(
                                    ruleQuery.INLINE,
                                    strSQL
                                );
        SqlDataReader objDr = objQuery.retrieveQuery(objCon);
        if (objDr.Read())
        {
            strValue = objDr[0].ToString();
            setValues(strColumn, strValue);
        }
        objDr.Close();
        return strValue;
    }

    #endregion

    #region getOption() : Option Collection을 Return.

    /// <summary>
    /// getOption() : Option Collection을 Return.
    /// </summary>
    public entityNameValue getOption()
    {
        return this.OPTION;
    }

    #endregion

    #region getOption() : 해당 Name의 Option을 Get.

    /// <summary>
    /// getOption() : 해당 Option을 Get.
    /// </summary>
    public string getOption(string strName)
    {
        return this.OPTION.getValue(strName);
    }

    #endregion

    #region setOption() : 해당 Name의 Option을 설정.

    /// <summary>
    /// setOption() : 해당 Name의 Option을 설정.
    /// </summary>
    public void setOption(string strName, string strValue)
    {
        this.OPTION.setValue(strName, strValue);
    }

    #endregion
}

#endregion

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//