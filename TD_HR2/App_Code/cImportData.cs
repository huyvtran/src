//----------------------------------------
// cImportData
//      : Client I/F Data to Import Excel
//      : Created by Professor.X, GoodWare (2011.04)
//----------------------------------------

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;

#region cImportData : Client I/F Data to Import Excel.

/// <summary>
/// cImportData : Client I/F Data to Import Excel.
///     - USER : User ID
///     - KEY : Key for DB. (File ID)
///     - PATH : Excel File Path
///     - SHEET : Excel Sheet No.
///     - ROW : Starting Data Row in Sheet
///     - COLUMN : Starting Data Column in Sheet
///     - FIELDS : Count of Fields to Save
/// </summary>
public class cImportData
{
    #region USER : User ID.

    /// <summary>
    /// USER : User ID.
    /// </summary>
    public string USER { get; set; }

    #endregion

    #region KEY : Key for DB. (File ID)

    /// <summary>
    /// KEY : Key for DB. (File ID)
    /// </summary>
    public string KEY { get; set; }

    #endregion

    #region PATH : Excel File Path.

    /// <summary>
    /// PATH : Excel File Path.
    /// </summary>
    public string PATH { get; set; }

    #endregion

    #region SHEET : Excel Sheet No.

    /// <summary>
    /// SHEET : Excel Sheet No.
    /// </summary>
    public string SHEET { get; set; }

    #endregion

    #region ROW : Starting Data Row in Sheet.

    /// <summary>
    /// ROW : Starting Data Row in Sheet.
    /// </summary>
    public int ROW { get; set; }

    #endregion

    #region COLUMN : Starting Data Column in Sheet.

    /// <summary>
    /// COLUMN : Starting Data Column in Sheet.
    /// </summary>
    public int COLUMN { get; set; }

    #endregion

    #region FIELDS : Count of Fields to Save.

    /// <summary>
    /// FILEDS : Count of Fileds to Save.
    /// </summary>
    public int FIELDS { get; set; }

    #endregion

    #region Constructor : Filed 초기화 및 설정.

    /// <summary>
    /// Constructor : Filed 초기화 및 설정.
    /// </summary>
    public cImportData() 
    {
        USER = string.Empty;
        KEY = string.Empty;
        PATH = string.Empty;
        SHEET = string.Empty;
        ROW = 0;
        COLUMN = 0;
        FIELDS = 0;
    }

    #endregion

    #region validData() : Check Validation of Data.

    /// <summary>
    /// validData() : Check Validation of Data.
    /// </summary>
    public bool validData()
    {
        return ((string.IsNullOrEmpty(this.USER) ||
                string.IsNullOrEmpty(this.KEY) ||
                string.IsNullOrEmpty(this.PATH) ||
                string.IsNullOrEmpty(this.SHEET) ||
                this.ROW == 0 ||
                this.COLUMN == 0 ||
                this.FIELDS == 0) ? false : true);
    }

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

    #region getKey() : Get Key for DB.

    /// <summary>
    /// getKey() : Get Key for DB.
    /// </summary>
    public string getKey()
    {
        return this.KEY;
    }

    #endregion

    #region getPath() : Get Excel File Path.

    /// <summary>
    /// getPath() : Get Excel File Path.
    /// </summary>
    public string getPath()
    {
        return this.PATH;
    }

    #endregion

    #region getSheet() : Excel Sheet No.

    /// <summary>
    /// getSheet() : Get User ID.
    /// </summary>
    public string getSheet()
    {
        return this.SHEET;
    }

    #endregion
    
    #region getRow() : Get User ID.

    /// <summary>
    /// getRow() : Get User ID.
    /// </summary>
    public int getRow()
    {
        return this.ROW;
    }

    #endregion

    #region getColumn() : Get User ID.

    /// <summary>
    /// getColumn() : Get User ID.
    /// </summary>
    public int getColumn()
    {
        return this.COLUMN;
    }

    #endregion

    #region getFields() : Get User ID.

    /// <summary>
    /// getFields() : Get User ID.
    /// </summary>
    public int getFields()
    {
        return this.FIELDS;
    }

    #endregion
}

#endregion

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//