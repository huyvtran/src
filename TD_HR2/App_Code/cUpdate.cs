//----------------------------------------
// cUpdate
//      : Process Updatable Transaction to DB
//      : Created by Professor.X, GoodWare (2011.04)
//----------------------------------------

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Services;
using System.Web.Script.Services;
using System.Web.Script.Serialization;
using System.Data;
using System.Data.SqlClient;
using System.Web.Configuration;
using System.Text;
using System.Collections;
using System.Collections.Specialized;
using System.Configuration;

#region cUpdate : Process Updatable Transaction to DB

/// <summary>
/// cUpdate : Process Updatable Transaction to DB
/// </summary>
public class cUpdate
{
    #region DB Objects : Database Objects.

    public SqlConnection objCon { get; set; }
    public SqlTransaction objTran { get; set; }
    public SqlCommand objCmd { get; set; }
    public SqlDataReader objDr { get; set; }

    #endregion

    #region Constructor : Filed 초기화 및 설정.

    /// <summary>
    /// Constructor : Filed 초기화 및 설정.
    /// </summary>
	public cUpdate()
	{
        this.objCon = null;
        this.objTran = null;
        this.objCmd = null;
        this.objDr = null;
    }

    #endregion

    #region release() : release all Objects.

    /// <summary>
    /// release() : release all Objects.
    /// </summary>
    public void release()
    {
        if (this.objDr != null)
        { this.objDr.Close(); this.objDr = null; }
        if (this.objCon != null)
        { this.objCon.Close(); this.objCon = null; }
    }

    #endregion

    #region openDB() : connect to DB.

    /// <summary>
    /// openDB() : connect to DB.
    /// </summary>
    public SqlConnection openDB()
    {
        try
        {
            this.objCon = new SqlConnection(
                                ConfigurationManager.ConnectionStrings["PLMDB"].ConnectionString);
            this.objCon.Open();
        }
        catch (SqlException ex)
        {
            throw new Exception(
                "Database에 연결할 수 없습니다.\n- " + ex.Message);
        }
        catch (Exception ex)
        {
            throw new Exception(
                "Database 연결 중에 오류가 발생하였습니다.\n- " + ex.Message);
        }
        return this.objCon;
    }

    #endregion

    #region beginTran() : begin DB Transaction.

    /// <summary>
    /// beginTran() : begin DB Transaction.
    /// </summary>
    public SqlTransaction beginTran()
    {
        try
        {
            this.objTran = objCon.BeginTransaction();
            if (this.objCmd != null)
                this.objCmd.Transaction = this.objTran;
        }
        catch (SqlException ex)
        {
            throw new Exception(
                "Transaction을 시작할 수 없습니다.\n- " + ex.Message);
        }
        catch (Exception ex)
        {
            throw new Exception(
                "Transaction 시작 중에 오류가 발생하였습니다.\n- " + ex.Message);
        }
        return this.objTran;
    }

    #endregion

    #region processTran() : process DB Transaction.

    /// <summary>
    /// processTran() : process DB Transaction.
    /// </summary>
    public void processTran(doTransaction enTran)
    {
        try
        {
            if (this.objTran != null)
            {
                if (enTran == doTransaction.COMMIT)
                    this.objTran.Commit();
                else
                    this.objTran.Rollback();
            }
        }
        catch (SqlException ex)
        {
            throw new Exception(
                "Transaction을 처리할 수 없습니다.\n- " + ex.Message);
        }
        catch (Exception ex)
        {
            throw new Exception(
                "Transaction 처리 중에 오류가 발생하였습니다.\n- " + ex.Message);
        }
    }

    #endregion

    #region createComman() : create DB Command.

    /// <summary>
    /// createCommand() : create DB Command.
    /// </summary>
    public SqlCommand createCommand()
    {
        try
        {
            this.objCmd = new SqlCommand(string.Empty, this.objCon, this.objTran);
        }
        catch (SqlException ex)
        {
            throw new Exception(
                "Query Command를 생성할 수 없습니다.\n- " + ex.Message);
        }
        catch (Exception ex)
        {
            throw new Exception(
                "Query Command 생성 중에 오류가 발생하였습니다.\n- " + ex.Message);
        }
        return this.objCmd;
    }
    public SqlCommand createCommand(bool bTran)
    {
        try
        {
            if (bTran)
                this.objCmd = new SqlCommand(string.Empty, this.objCon, this.objTran);
            else
                this.objCmd = new SqlCommand(string.Empty, this.objCon);
        }
        catch (SqlException ex)
        {
            throw new Exception(
                "Query Command를 생성할 수 없습니다.\n- " + ex.Message);
        }
        catch (Exception ex)
        {
            throw new Exception(
                "Query Command 생성 중에 오류가 발생하였습니다.\n- " + ex.Message);
        }
        return this.objCmd;
    }

    #endregion

    #region initialize() : initialize for Saving Process.

    /// <summary>
    /// initialize() : initialize for Saving Process.
    /// </summary>
    public void initialize()
    {
        this.openDB();
        this.beginTran();
        this.createCommand();
    }
    public void initialize(bool bTran)
    {
        this.openDB();
        if (bTran) this.beginTran();
        this.createCommand(bTran);
    }

    #endregion

    #region process() : process for Saving Process.

    /// <summary>
    /// process() : process for Saving Process.
    /// </summary>
    public cSavedData process(cSaveObject objData, string strUser)
    {
        cSavedData objKey;

        // Saving Module 생성.
        //
        cSave objProcess = new cSave(objData, objData.getQuery(), strUser);
        
        // DB Column 정보 Mapping.
        //
        try
        {
            objKey = objProcess.mapsColumn(this.objCmd, this.objDr);
        }
        catch (SqlException ex)
        {
            throw new Exception(
                "Column 정보를 Mapping할 수 없습니다.\n -" + ex.Message);
        }
        catch (Exception ex)
        {
            throw new Exception(
                "Column 정보 Mapping 중에 오류가 발생하였습니다.\n -" + ex.Message);
        }

        // DML 생성. (Insert/Update/Delete)
        //
        try
        {
            objProcess.inlineQuery();
        }
        catch (Exception ex)
        {
            throw new Exception(
                "Query 생성 중에 오류가 발생하였습니다.\n -" + ex.Message);
        }

        // DML 실행. (Insert/Update/Delete)
        //
        try
        {
            objProcess.executeSave(this.objCmd);
        }
        catch (SqlException ex)
        {
            throw new Exception(
                "Data 저장에 실패하였습니다.\n- (" + ex.Number + ") : " + ex.Message);
        }
        catch (Exception ex)
        {
            throw new Exception(
                "Data 저장 중에 오류가 발생하였습니다.\n- " + ex.Message);
        }

        return objKey;
    }

    #endregion

    #region close() : close Saving Process.

    /// <summary>
    /// close() : close Saving Process.
    /// </summary>
    public void close(doTransaction enTran)
    {
        this.processTran(enTran);
        this.release();
    }

    #endregion
}

#endregion

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//