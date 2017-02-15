//----------------------------------------
// cSaveObject
//      : Client I/F Object to Save
//      : Created by Professor.X, GoodWare (2011.04)
//----------------------------------------

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;
using System.Web.Script.Serialization;

#region cSaveObject : Client Object to Save.

/// <summary>
/// cSaveObject : Client Object to Save.
///     - QUERY : Query ID.
///     - ROWS : Row (cSaveRow) List.
/// </summary>
public class cSaveObject
{
    #region QUERY : Query ID.

    /// <summary>
    /// QUERY : Query ID.
    /// </summary>
    public string QUERY { get; set; }

    #endregion

    #region ROWS : Row (cSaveRow) List.

    /// <summary>
    /// ROWS : Row (cSaveRow) List.
    /// </summary>
    public List<cSaveRow> ROWS { get; set; }

    #endregion

    #region Constructor : Filed 초기화 및 설정.

    /// <summary>
    /// Constructor : Filed 초기화 및 설정.
    /// </summary>
    public cSaveObject() { }

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

    #region getRow() : 해당 Row를 Return.

    /// <summary>
    /// getRow() : 해당 Row를 Return.
    /// </summary>
    public cSaveRow getRow(int iRow)
    {
        return this.ROWS[iRow];
    }

    #endregion

    #region getFirst() : 첫번째 Row를 Return.

    /// <summary>
    /// getFirst() : 첫번째 Row를 Return.
    /// </summary>
    public cSaveRow getFirst()
    {
        return this.ROWS[0];
    }

    #endregion

    #region getLast() : 마지막 Row를 Return.

    /// <summary>
    /// getLast() : 마지막 Row를 Return.
    /// </summary>
    public cSaveRow getLast()
    {
        return this.ROWS[this.ROWS.Count - 1];
    }

    #endregion

    #region getSize() : Row List의 Size를 Return.

    /// <summary>
    /// getSize() : Row List의 Size Return.
    /// </summary>
    public int getSize()
    {
        return this.ROWS.Count;
    }

    #endregion

    #region getValue() : 해당 Row, Column의 Value를 Return.

    /// <summary>
    /// getValue() : 해당 Row, Column의 Value를 Return.
    /// </summary>
    public string getValue(int iRow, string strColumn)
    {
        return this.ROWS[iRow].getValue(strColumn);
    }

    #endregion

    #region getValues() : 해당 Column의 Value List를 Return.

    /// <summary>
    /// getValues() : 해당 Column의 Value List를 Return.
    /// </summary>
    public List<string> getValues(string strColumn)
    {
        List<string> lstValue = new List<string>();
        for (int iAry = 0; iAry < this.ROWS.Count; iAry++)
        {
            lstValue.Add(
                    this.ROWS[iAry].getValue(strColumn)
                );
        }
        return lstValue;
    }

    #endregion

    #region setValue() : 해당 Row, Column의 Value를 설정.

    /// <summary>
    /// setValue() : 해당 Row, Column의 Value를 설정.
    /// </summary>
    public void setValue(int iRow, string strColumn, string strValue)
    {
        this.ROWS[iRow].setValue(strColumn, strValue);
    }

    #endregion

    #region setValues() : 모든 해당 Column의 Value를 설정.

    /// <summary>
    /// setValues() : 모든 해당 Column의 Value를 설정.
    /// </summary>
    public void setValues(string strColumn, string strValue)
    {
        for (int iAry = 0; iAry < this.ROWS.Count; iAry++)
        {
            this.ROWS[iAry].setValue(strColumn, strValue);
        }
    }

    #endregion
}

#endregion

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//