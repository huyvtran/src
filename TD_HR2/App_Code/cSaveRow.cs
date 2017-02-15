//----------------------------------------
// cSaveRow
//      : Client I/F Row to Save
//      : Created by Professor.X, GoodWare (2011.04)
//----------------------------------------

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

#region cSaveRow : Client Row to Save.

/// <summary>
/// cSaveRow : Client Row to Save.
///     - COLUMN : Column List.
///     - VALUE : Value List.
/// </summary>
public class cSaveRow
{
    #region COLUMN : Column List.

    /// <summary>
    /// COLUMN : Column List.
    /// </summary>
    public List<string> COLUMN { get; set; }

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
    public cSaveRow() { }

    #endregion

    #region getSize() : Data Size를 Return.

    /// <summary>
    /// getSize() : Data Size을 Return.
    /// </summary>
    public int getSize()
    {
        return COLUMN.Count;
    }

    #endregion

    #region getType() : Query Type을 Return.

    /// <summary>
    /// getType() : Query Type을 Return.
    /// </summary>
    public typeQuery getType()
    {
        switch (this.getValue("_CRUD"))
        {
            case "C":
                return typeQuery.INSERT;
            case "R":
                return typeQuery.SELECT;
            case "U":
                return typeQuery.UPDATE;
            case "D":
                return typeQuery.DELETE;
        }
        throw new Exception(
                "Save Row의 Query Type을 알 수 없습니다."
            );
    }

    #endregion

    #region getValue() : 해당 Column의 Value를 Get.

    /// <summary>
    /// getValue() : 해당 Column의 Value를 Get.
    /// </summary>
    public string getValue(string strColumn)
    {
        for (int iAry = 0; iAry < this.COLUMN.Count; iAry++)
        {
            if (this.COLUMN[iAry] == strColumn)
                return this.VALUE[iAry];
        }
        throw new Exception(
                "Save Row에서 해당 Column을 찾을 수 없습니다."
            );
    }

    #endregion

    #region setValue() : 해당 Column의 Value를 설정.

    /// <summary>
    /// setValue() : 해당 Column의 Value를 설정.
    /// </summary>
    public void setValue(string strColumn, string strValue)
    {
        for (int iAry = 0; iAry < this.COLUMN.Count; iAry++)
        {
            if (this.COLUMN[iAry] == strColumn)
            {
                this.VALUE[iAry] = strValue;
                return;
            }
        }
        throw new Exception(
                "Save Row에서 해당 Column을 찾을 수 없습니다."
            );
    }

    #endregion
}

#endregion

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//