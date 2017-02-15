//----------------------------------------
// cProcedureData
//      : Passed Data to Procedure (from Client)
//      : Created by Professor.X, GoodWare (2011.04)
//----------------------------------------

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;
using System.Web.Script.Serialization;

#region cProcedureData : Passed Data to Procedure

/// <summary>
/// cProcedureData : Passed Data to Procedure.
///     - QUERY : Procedure Name.
///     - ARGUMENT : Argument List.
///     - INPUT : Input Data List.
///     - OUTPUT : Output Data List.
/// </summary>
public class cProcedureData
{
    #region QUERY : Procedure Name.

    /// <summary>
    /// QUERY : Procedure Name.
    /// </summary>
    public string QUERY { get; set; }

    #endregion

    #region ARGUMENT : Argument List.

    /// <summary>
    /// ARGUMENT : Argument List.
    /// </summary>
    public entityNameValue ARGUMENT { get; set; }

    #endregion

    #region INPUT : Input Data List.

    /// <summary>
    /// INPUT : Input Data List.
    /// </summary>
    public entityParameter INPUT { get; set; }

    #endregion

    #region OUTPUT : Output Data List.

    /// <summary>
    /// OUTPUT : Output Data List.
    /// </summary>
    public entityParameter OUTPUT { get; set; }

    #endregion

    #region Constructor : Filed 초기화 및 설정.

    /// <summary>
    /// Constructor : Filed 초기화 및 설정.
    /// </summary>
    public cProcedureData() { }

    #endregion

    #region getQuery() : Get Query ID.

    /// <summary>
    /// getQuery() : Get Query ID.
    /// </summary>
    public string getQuery()
    {
        return this.QUERY;
    }

    #endregion

    #region getSize() : Data Size를 Return.

    /// <summary>
    /// getSize() : Data Size을 Return.
    /// </summary>
    public int getSize(typeDirection enDir)
    {
        return (enDir == typeDirection.INPUT) 
                ? this.INPUT.getSize() : this.OUTPUT.getSize();
    }

    #endregion

    #region getValue() : 해당 Name의 Value를 Get.

    /// <summary>
    /// getValue() : 해당 Value를 Get.
    /// </summary>
    public string getValue(typeDirection enDir, string strName)
    {
        return (enDir == typeDirection.INPUT) 
                ? this.INPUT.getValue(strName) : this.OUTPUT.getValue(strName);
    }

    #endregion

    #region setValue() : 해당 Name의 Value를 설정.

    /// <summary>
    /// setValue() : 해당 Name의 Value를 설정.
    /// </summary>
    public void setValue(typeDirection enDir, string strName, string strValue)
    {
        if (enDir == typeDirection.INPUT)
            this.INPUT.setValue(strName, strValue);
        else
            this.OUTPUT.setValue(strName, strValue);
    }

    #endregion
}

#endregion

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//