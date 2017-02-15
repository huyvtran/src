//----------------------------------------
// cSave
//      : Process All Insert/Update/Delete Query to DB
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

#region cSave : Process All Insert/Update/Delete Query to DB

/// <summary>
/// cSave : Process All Insert/Update/Delete Query to DB
///     - objRequest : 요청 Data. (from Client)
/// </summary>
public class cSave
{
    #region objRequest : Client Object.

    private cSaveObject _objRequest;
    /// <summary>
    /// objRequest : Client Object.
    /// </summary>
    public cSaveObject objRequest
    {
        get { return _objRequest; }
        set { _objRequest = value; }
    }

    #endregion

    #region strID : Query ID.

    private string _strID;
    /// <summary>
    /// strID : Query ID.
    /// </summary>
    public string strID
    {
        get { return _strID; }
        set { _strID = value; }
    }

    #endregion

    #region strTable : Table Name.

    private string _strTable;
    /// <summary>
    /// strTable : Table Name.
    /// </summary>
    public string strTable
    {
        get { return _strTable; }
        set { _strTable = value; }
    }

    #endregion

    #region strUser : User ID.

    private string _strUser;
    /// <summary>
    /// strUser : User ID.
    /// </summary>
    public string strUser
    {
        get { return _strUser; }
        set { _strUser = value; }
    }

    #endregion

    #region tblColumn : Mapping된 Column 정보.

    private Hashtable _tblColumn;
    /// <summary>
    /// tblColumn : Mapping된 Column 정보.
    /// </summary>
    public Hashtable tblColumn
    {
        get { return _tblColumn; }
        set { _tblColumn = value; }
    }

    #endregion

    #region objKey : Primary Key 정보.

    private cDBKey _objKey;
    /// <summary>
    /// objKey : Primary Key 정보.
    /// </summary>
    public cDBKey objKey
    {
        get { return _objKey; }
        set { _objKey = value; }
    }

    #endregion

    #region List<cDBQuery> : 생성된 Query List.

    private List<cDBQuery> _lstQuery;
    /// <summary>
    /// lstQuery : 생성된 Query List.
    /// </summary>
    public List<cDBQuery> lstQuery
    {
        get { return _lstQuery; }
        set { _lstQuery = value; }
    }

    #endregion

    #region Constructor : Filed 초기화 및 설정.

    /// <summary>
    /// Constructor : Filed 초기화 및 설정.
    /// </summary>
    public cSave() { }
    public cSave(cSaveObject objRequest, string strID)
    {
        this.objRequest = objRequest;
        this.strID = strID;
        this.strUser = "GOODTEST";
    }
    public cSave(cSaveObject objRequest, string strID, string strUser)
    {
        this.objRequest = objRequest;
        this.strID = strID;
        this.strUser = strUser;
    }

    #endregion

    #region mapColumn() : Column 정보 Mapping.

    /// <summary>
    /// mapColumn() : Column 정보 Mapping.
    /// </summary>
    public cDBKey mapColumn(SqlCommand objCmd, SqlDataReader objDr)
    {
        try
        {
            this.objKey = new cDBKey();
            this.strTable = string.Empty;
            this.tblColumn = new Hashtable();
            string strSQL = string.Format(@"
                                    SELECT
                                        tbl_id AS TBL_ID,
                                        col_id AS COL_ID,
                                        data_tp AS DATA_TP,
                                        data_xprec AS DATA_XPREC,
                                        upd_yn AS UPD_YN,
                                        key_yn AS KEY_YN
                                    FROM ZQUERY_COL
                                    WHERE qry_id = '{0}'",
                                    this.strID
                                );
            objCmd.CommandText = strSQL;
            objDr = objCmd.ExecuteReader();
            while (objDr.Read())
            {
                if (string.IsNullOrEmpty(this.strTable))
                    this.strTable = objDr["TBL_ID"].ToString();
                this.tblColumn.Add(
                    objDr["COL_ID"].ToString(),
                    new cDBColumn(
                        objDr["COL_ID"].ToString(),
                        objDr["DATA_TP"].ToString(),
                        Convert.ToInt16(objDr["DATA_XPREC"]),
                        (objDr["UPD_YN"].ToString() == "1") ? true : false,
                        (objDr["KEY_YN"].ToString() == "1") ? true : false)
                    );
                if (objDr["KEY_YN"].ToString() == "1")
                {
                    string strKey = objDr["COL_ID"].ToString();
                    string strValue = string.Empty;
                    try
                    {
                        try
                        {
                            strValue = this.objRequest.getFirst().getValue(strKey);
                        }
                        catch(Exception)
                        {
                            throw new Exception(
                                "Client Data에서 Key를 찾을 수 없습니다."
                            );
                        }
                        if (string.IsNullOrEmpty(strValue))
                            throw new Exception(
                                "Key의 값이 존재하지 않습니다."
                            );
                        strValue = HttpUtility.UrlDecode(strValue);
                    }
                    catch(Exception ex)
                    {
                        throw ex;
                    }
                    this.objKey.Add(strKey, strValue);
                }
            }
        }
        catch (Exception ex)
        {
            throw ex;
        }
        finally
        {
            objDr.Close();
        }
        return objKey;
    }

    #endregion

    #region mapColumn() : Column 정보 Mapping.

    /// <summary>
    /// mapsColumn() : Column 정보 Mapping.
    /// </summary>
    public cSavedData mapsColumn(SqlCommand objCmd, SqlDataReader objDr)
    {
        cSavedData objSaved = new cSavedData(this.strID);
        try
        {
            this.objKey = new cDBKey();
            this.strTable = string.Empty;
            this.tblColumn = new Hashtable();
            string strSQL = string.Format(@"
                                    SELECT
                                        tbl_id AS TBL_ID,
                                        col_id AS COL_ID,
                                        data_tp AS DATA_TP,
                                        data_xprec AS DATA_XPREC,
                                        upd_yn AS UPD_YN,
                                        key_yn AS KEY_YN
                                    FROM ZQUERY_COL
                                    WHERE qry_id = '{0}'",
                                    this.strID
                                );
            objCmd.CommandText = strSQL;
            objDr = objCmd.ExecuteReader();
            while (objDr.Read())
            {
                if (string.IsNullOrEmpty(this.strTable))
                    this.strTable = objDr["TBL_ID"].ToString();
                this.tblColumn.Add(
                    objDr["COL_ID"].ToString(),
                    new cDBColumn(
                        objDr["COL_ID"].ToString(),
                        objDr["DATA_TP"].ToString(),
                        Convert.ToInt16(objDr["DATA_XPREC"]),
                        (objDr["UPD_YN"].ToString() == "1") ? true : false,
                        (objDr["KEY_YN"].ToString() == "1") ? true : false)
                    );
                if (objDr["KEY_YN"].ToString() == "1")
                {
                    string strKey = objDr["COL_ID"].ToString();
                    string strValue = string.Empty;
                    try
                    {
                        try
                        {
                            strValue = this.objRequest.getFirst().getValue(strKey);
                        }
                        catch (Exception)
                        {
                            throw new Exception(
                                "Client Data에서 Key를 찾을 수 없습니다."
                            );
                        }
                        if (string.IsNullOrEmpty(strValue))
                            throw new Exception(
                                "Key의 값이 존재하지 않습니다."
                            );
                        strValue = HttpUtility.UrlDecode(strValue);
                    }
                    catch (Exception ex)
                    {
                        throw ex;
                    }
                    this.objKey.Add(strKey, strValue);
                    objSaved.addKey(strKey, strValue);
                }
            }
        }
        catch (Exception ex)
        {
            throw ex;
        }
        finally
        {
            objDr.Close();
        }
        return objSaved;
    }

    #endregion

    #region inlineQuery() : Inline 형식 Query 생성.

    /// <summary>
    /// inlineQuery() : Inline 형식 Query 생성.
    /// </summary>
    public void inlineQuery()
    {
        this.lstQuery = new List<cDBQuery>();
        foreach (cSaveRow objRow in this.objRequest.ROWS)
        {
            string strSQL = string.Empty;
            string strQuery_1 = string.Empty;
            string strQuery_2 = string.Empty;
            

            switch (objRow.getType())
            {
                case typeQuery.INSERT:
                    {
                        Boolean bIsFirstCol = true;
                        for (int iAry = 0; iAry < objRow.getSize() - 1; iAry++)
                        {
                            cDBColumn objColumn = (cDBColumn)this.tblColumn[objRow.COLUMN[iAry]];
                            if (objColumn == null)
                            {
                                continue;
                                //throw new Exception
                                //    ("[" + objRow.COLUMN[iAry] + "] Column 정보를 확인할 수 없습니다.");
                            }
                            NameValueCollection lstPart
                                = objColumn.createQuery(
                                            typeQuery.INSERT,
                                            HttpUtility.UrlDecode(objRow.VALUE[iAry]));
                            if (!(string.IsNullOrEmpty(lstPart["COLUMN"]))
                                    && !(string.IsNullOrEmpty(lstPart["VALUES"])))
                            {
                                if (bIsFirstCol)
                                {
                                    bIsFirstCol = false;
                                    strQuery_1 += lstPart["COLUMN"];
                                    strQuery_2 += lstPart["VALUES"];
                                }
                                else {
                                    strQuery_1 += ", " + lstPart["COLUMN"];
                                    strQuery_2 += ", " + lstPart["VALUES"];
                                }

                                //strQuery_1 += ((iAry > 0) ? ", " : "") + lstPart["COLUMN"];
                                //strQuery_2 += ((iAry > 0) ? ", " : "") + lstPart["VALUES"];
                                
                            }
                        }
                        if (this.tblColumn["ins_usr"] != null)
                        {
                            strQuery_1 += ",ins_usr";
                            strQuery_2 += ",'" + this.strUser + "'";
                        }
                        if (this.tblColumn["ins_dt"] != null)
                        {
                            strQuery_1 += ",ins_dt";
                            strQuery_2 += ",GETDATE()";
                        }
                        if (this.tblColumn["upd_usr"] != null)
                        {
                            strQuery_1 += ",upd_usr";
                            strQuery_2 += ",'" + this.strUser + "'";
                        }
                        if (this.tblColumn["upd_dt"] != null)
                        {
                            strQuery_1 += ",upd_dt";
                            strQuery_2 += ",GETDATE()";
                        }
                        if (this.tblColumn["wsno"] != null)
                        {
                            strQuery_1 += ",wsno";
                            strQuery_2 += ",'" + this.strUser + "'";
                        }
                        if (this.tblColumn["wdate"] != null)
                        {
                            strQuery_1 += ",wdate";
                            strQuery_2 += ",GETDATE()";
                        }
                        if (this.tblColumn["usno"] != null)
                        {
                            strQuery_1 += ",usno";
                            strQuery_2 += ",'" + this.strUser + "'";
                        }
                        if (this.tblColumn["udate"] != null)
                        {
                            strQuery_1 += ",udate";
                            strQuery_2 += ",GETDATE()";
                        }
                        strSQL = string.Format(@"
                                    INSERT INTO {0} 
                                    ({1}) 
                                    VALUES
                                    ({2})",
                                    this.strTable,
                                    strQuery_1,
                                    strQuery_2);
                    }
                    break;
                case typeQuery.UPDATE:
                    {
                        Boolean bIsFirstCol1 = true;
                        Boolean bIsFirstCol2 = true;
                        for (int iAry = 0; iAry < objRow.getSize() - 1; iAry++)
                        {
                            cDBColumn objColumn = (cDBColumn)this.tblColumn[objRow.COLUMN[iAry]];
                            if (objColumn == null)
                            {
                                continue;
                                //throw new Exception
                                //    ("[" + objRow.COLUMN[iAry] + "] Column 정보를 확인할 수 없습니다.");
                            }

                            if ((objColumn.enType == SqlDbType.Date || objColumn.enType == SqlDbType.DateTime) && string.IsNullOrEmpty(objRow.VALUE[iAry].ToString()))
                            {
                                continue;
                            }

                            NameValueCollection lstPart
                                = objColumn.createQuery(
                                            typeQuery.UPDATE,
                                            HttpUtility.UrlDecode(objRow.VALUE[iAry]));

                            if (!string.IsNullOrEmpty(lstPart["SET"]))
                            {
                                if (bIsFirstCol1)
                                {
                                    bIsFirstCol1 = false;
                                    strQuery_1 += lstPart["SET"];
                                }
                                else
                                {
                                    strQuery_1 += ", " + lstPart["SET"];
                                }
                            }

                            if (!string.IsNullOrEmpty(lstPart["WHERE"]))
                            {
                                if (bIsFirstCol2)
                                {
                                    bIsFirstCol2 = false;
                                    strQuery_2 += lstPart["WHERE"];
                                }
                                else
                                {
                                    strQuery_2 += " " + lstPart["WHERE"];
                                }
                            }
                            
                            //strQuery_1 += (string.IsNullOrEmpty(lstPart["SET"]))
                            //                    ? "" : ((iAry > 0) ? ", " : "") + lstPart["SET"];
                            //strQuery_2 += (string.IsNullOrEmpty(lstPart["WHERE"]))
                            //                    ? "" : ((iAry > 0) ? " " : "") + lstPart["WHERE"];
                        }
                        if (this.tblColumn["upd_usr"] != null)
                        {
                            strQuery_1 += ",upd_usr='" + this.strUser + "'";
                        }
                        if (this.tblColumn["upd_dt"] != null)
                        {
                            strQuery_1 += ",upd_dt=" + "GETDATE()";
                        }
                        if (this.tblColumn["usno"] != null)
                        {
                            strQuery_1 += ",usno='" + this.strUser + "'";
                        }
                        if (this.tblColumn["udate"] != null)
                        {
                            strQuery_1 += ",udate=" + "GETDATE()";
                        }
                        if (strQuery_2.Trim() == "")
                            throw new Exception
                                    ("저장 조건을 생성할 수 없습니다.");
                        strSQL = string.Format(@"
                                    UPDATE {0} 
                                    SET    {1} 
                                    WHERE  1=1 
                                    {2}",
                                    this.strTable,
                                    strQuery_1,
                                    strQuery_2);
                    }
                    break;
                case typeQuery.DELETE:
                    {
                        for (int iAry = 0; iAry < objRow.getSize() - 1; iAry++)
                        {
                            cDBColumn objColumn = (cDBColumn)this.tblColumn[objRow.COLUMN[iAry]];
                            if (objColumn == null)
                            {
                                throw new Exception
                                    ("[" + objRow.COLUMN[iAry] + "] Column 정보를 확인할 수 없습니다.");
                            }
                            NameValueCollection lstPart
                                = objColumn.createQuery(
                                            typeQuery.DELETE,
                                            HttpUtility.UrlDecode(objRow.VALUE[iAry]));
                            strQuery_1 += (string.IsNullOrEmpty(lstPart["WHERE"]))
                                                ? "" : ((iAry > 0) ? " " : "") + lstPart["WHERE"];
                        }
                        if (strQuery_1.Trim() == "")
                            throw new Exception
                                    ("삭제 조건을 생성할 수 없습니다.");
                        strSQL = string.Format(@"
                                    DELETE {0} 
                                    WHERE  1=1 
                                    {1}",
                                    this.strTable,
                                    strQuery_1);
                    }
                    break;
            }
            this.lstQuery.Add(new cDBQuery(ruleQuery.INLINE, strSQL));
        }
    }

    #endregion

    #region paramQuery() : Parameter 형식 Query 생성.

    /// <summary>
    /// paramQuery() : Parameter 형식 Query 생성.
    /// </summary>
    public void paramQuery()
    {
        foreach (cSaveRow objRow in this.objRequest.ROWS)
        {
            string strSQL = string.Empty;
            string strQuery_1 = string.Empty;
            string strQuery_2 = string.Empty;
            List<cDBParameter> lstParam;
            lstParam = new List<cDBParameter>();
            switch (objRow.getType())
            {
                case typeQuery.INSERT:
                    {
                        for (int iAry = 0; iAry < objRow.getSize() - 1; iAry++)
                        {
                            cDBColumn objColumn = (cDBColumn)this.tblColumn[objRow.COLUMN[iAry]];
                            NameValueCollection lstPart
                                = objColumn.createQuery(
                                            typeQuery.INSERT,
                                            HttpUtility.UrlDecode(objRow.VALUE[iAry]),
                                            lstParam);
                            strQuery_1 += (string.IsNullOrEmpty(lstPart["COLUMN"]))
                                                ? "" : ((iAry > 0) ? ", " : "") + lstPart["COLUMN"];
                            strQuery_2 += (string.IsNullOrEmpty(lstPart["VALUES"]))
                                                ? "" : ((iAry > 0) ? ", " : "") + lstPart["VALUES"];
                        }
                        strSQL = string.Format(@"
                                    INSERT INTO {0} 
                                    ({1}) 
                                    VALUES
                                    ({2})",
                                    this.strTable,
                                    strQuery_1,
                                    strQuery_2);
                    }
                    break;
                case typeQuery.UPDATE:
                    {
                        for (int iAry = 0; iAry < objRow.getSize() - 1; iAry++)
                        {
                            cDBColumn objColumn = (cDBColumn)this.tblColumn[objRow.COLUMN[iAry]];
                            NameValueCollection lstPart
                                = objColumn.createQuery(
                                            typeQuery.UPDATE,
                                            HttpUtility.UrlDecode(objRow.VALUE[iAry]),
                                            lstParam);
                            strQuery_1 += (string.IsNullOrEmpty(lstPart["SET"]))
                                                ? "" : ((iAry > 0) ? ", " : "") + lstPart["SET"];
                            strQuery_2 += (string.IsNullOrEmpty(lstPart["WHERE"]))
                                                ? "" : ((iAry > 0) ? " " : "") + lstPart["WHERE"];
                        }
                        strSQL = string.Format(@"
                                    UPDATE {0} 
                                    SET    {1} 
                                    WHERE  1=1 
                                    {2}",
                                    this.strTable,
                                    strQuery_1,
                                    strQuery_2);
                    }
                    break;
                case typeQuery.DELETE:
                    {
                        for (int iAry = 0; iAry < objRow.getSize() - 1; iAry++)
                        {
                            cDBColumn objColumn = (cDBColumn)this.tblColumn[objRow.COLUMN[iAry]];
                            NameValueCollection lstPart
                                = objColumn.createQuery(
                                            typeQuery.DELETE,
                                            HttpUtility.UrlDecode(objRow.VALUE[iAry]),
                                            lstParam);
                            strQuery_1 += (string.IsNullOrEmpty(lstPart["WHERE"]))
                                                ? "" : ((iAry > 0) ? " " : "") + lstPart["WHERE"];
                        }
                        strSQL = string.Format(@"
                                    DELETE {0} 
                                    WHERE  1=1 
                                    {1}",
                                    this.strTable,
                                    strQuery_1);
                    }
                    break;
            }
            this.lstQuery.Add(new cDBQuery(ruleQuery.PARAMETER, strSQL, lstParam));
        }
    }

    #endregion

    #region addQuery() : Query 추가.

    /// <summary>
    /// addQuery() : Query 추가.
    /// </summary>
    public void addQuery(string strSQL)
    {
        this.lstQuery.Add(new cDBQuery(ruleQuery.INLINE, strSQL));
    }

    #endregion

    #region executeSave() : Object Saving.

    /// <summary>
    /// executeSave() : Object Saving.
    /// </summary>
    public void executeSave(SqlCommand objCmd)
    {
        foreach (cDBQuery objQuery in lstQuery)
        {
            objQuery.executeQuery(objCmd);
        }

    }

    #endregion
}

#endregion

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//