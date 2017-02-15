//----------------------------------------
// cRetrieveData
//      : Passed Data to Retrieve (from Client)
//      : Created by Professor.X, GoodWare (2011.04)
//----------------------------------------

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;
using System.Web.Script.Serialization;

#region cRetrieveData : Passed Data to Retrieve

/// <summary>
/// cRetrieveData : Passed Data to Retrieve.
///     - USER : User ID.
///     - QUERY : Procedure Name.
///     - ARGUMENT : Argument List.
///     - OPTION : Option List.
/// </summary>
public class cRetrieveData
{
    #region USER : User ID.

    /// <summary>
    /// USER : User ID.
    /// </summary>
    public string USER { get; set; }

    #endregion

    #region QUERY : Query ID.

    /// <summary>
    /// QUERY : Query ID.
    /// </summary>
    public string QUERY { get; set; }

    #endregion

    #region ARGUMENT : Argument List.

    /// <summary>
    /// ARGUMENT : Argument List.
    /// </summary>
    public entityNameValue ARGUMENT { get; set; }

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
    public cRetrieveData() { }

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

    #region getQuery() : Get Query ID.

    /// <summary>
    /// getQuery() : Get Query ID.
    /// </summary>
    public string getQuery()
    {
        return this.QUERY;
    }

    #endregion

    #region getArgument() : Argument Collection을 Return.

    /// <summary>
    /// getArgument() : Argument Collection을 Return.
    /// </summary>
    public entityNameValue getArgument()
    {
        return this.ARGUMENT;
    }

    #endregion

    #region getArgument() : 해당 Name의 Argument를 Get.

    /// <summary>
    /// getArgument() : 해당 Argument를 Get.
    /// </summary>
    public string getArgument(string strName)
    {
        return this.ARGUMENT.getValue(strName);
    }

    #endregion

    #region setArgument() : 해당 Name의 Argument를 설정.

    /// <summary>
    /// setArgument() : 해당 Name의 Argument를 설정.
    /// </summary>
    public void setArgument(string strName, string strValue)
    {
        this.ARGUMENT.setValue(strName, strValue);
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