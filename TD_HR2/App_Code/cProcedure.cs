//----------------------------------------
// cProcedure
//      : Process using Procedure (DB)
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

#region cProcedure : Process using Procedure (DB)

/// <summary>
/// cProcedure : Process using Procedure (DB)
/// </summary>
public class cProcedure
{
    #region DB Objects : Database Objects.

    public SqlConnection objCon { get; set; }
    public SqlTransaction objTran { get; set; }
    public SqlCommand objCmd { get; set; }

    #endregion

    #region Constructor : Filed 초기화 및 설정.

    /// <summary>
    /// Constructor : Filed 초기화 및 설정.
    /// </summary>
	public cProcedure()
	{
        this.objCon = null;
        this.objTran = null;
        this.objCmd = null;
    }
    public cProcedure(SqlConnection objCon, SqlTransaction objTran, SqlCommand objCmd)
    {
        this.objCon = objCon;
        this.objTran = objTran;
        this.objCmd = objCmd;
    }

    #endregion

    #region release() : release all Objects.

    /// <summary>
    /// release() : release all Objects.
    /// </summary>
    public void release()
    {
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
            if (this.objTran != null)
                this.objCmd = new SqlCommand(string.Empty, this.objCon, this.objTran);
            else
                this.objCmd = new SqlCommand(string.Empty, this.objCon);
            this.objCmd.CommandType = CommandType.StoredProcedure;
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

    #region castType() : Cast Type. (SqlDbType)

    /// <summary>
    /// castType() : Cast Type. (SqlDbType)
    /// </summary>
    public SqlDbType castType(string strType)
    {
        strType = strType.ToUpper();
        switch (strType)
        {
            case "TINYINT":
                return SqlDbType.TinyInt;
            case "SMALLINT":
                return SqlDbType.SmallInt;
            case "INT":
                return SqlDbType.Int;
            case "BIGINT":
                return SqlDbType.Int;
            case "NUMERIC":
                return SqlDbType.Decimal;
            case "DECIMAL":
                return SqlDbType.Decimal;
            case "CHAR":
            case "NCHAR":
                return SqlDbType.Char;
            case "VARCHAR":
                return SqlDbType.VarChar;
            case "TEXT":
                return SqlDbType.Text;
            case "DATETIME":
                return SqlDbType.DateTime;
        }
        throw new Exception(
                "잘못된 Parameter Type입니다."
            );
    }

    #endregion

    #region numberType() : is Number Type.

    /// <summary>
    /// numberType() : is Number Type.
    /// </summary>
    public bool numberType(string strType)
    {
        strType = strType.ToUpper();
        switch (strType)
        {
            case "TINYINT":
            case "SMALLINT":
            case "INT":
            case "BIGINT":
            case "NUMERIC":
            case "DECIMAL":
                return true;
        }
        return false;
    }

    #endregion

    #region intType() : is Integer Type.

    /// <summary>
    /// intType() : is Integer Type.
    /// </summary>
    public bool intType(string strType)
    {
        strType = strType.ToUpper();
        switch (strType)
        {
            case "TINYINT":
            case "SMALLINT":
            case "INT":
            case "BIGINT":
                return true;
        }
        return false;
    }

    #endregion

    #region decimalType() : is Integer Type.

    /// <summary>
    /// decimalType() : is Decimal Type.
    /// </summary>
    public bool decimalType(string strType)
    {
        strType = strType.ToUpper();
        switch (strType)
        {
            case "NUMERIC":
            case "DECIMAL":
                return true;
        }
        return false;
    }

    #endregion

    #region stringType() : is String Type.

    /// <summary>
    /// stringType() : is String Type.
    /// </summary>
    public bool stringType(string strType)
    {
        strType = strType.ToUpper();
        switch (strType)
        {
            case "CHAR":
            case "NCHAR":
            case "VARCHAR":
            case "TEXT":
                return true;
        }
        return false;
    }

    #endregion

    #region initialize() : initialize to Call Procedure.

    /// <summary>
    /// initialize() : initialize to Call Procedure.
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
        this.createCommand();
    }

    #endregion

    #region call() : call Procedure.

    /// <summary>
    /// call() : call Procedure.
    /// </summary>
    public entityNameValue call(cProcedureData objData)
    {
        entityNameValue objResult = new entityNameValue(true);

        // Mapping.
        //
        string strProcedure = objData.getQuery();
        this.objCmd.CommandText = strProcedure;
        try
        {
            for (int iAry = 0; iAry < objData.getSize(typeDirection.INPUT); iAry++)
            {
                if (this.intType(objData.INPUT.TYPE[iAry]))
                    this.objCmd.Parameters.AddWithValue(
                        "@" + objData.INPUT.NAME[iAry],
                        Convert.ToInt32(objData.INPUT.VALUE[iAry]));
                else if (this.decimalType(objData.INPUT.TYPE[iAry]))
                    this.objCmd.Parameters.AddWithValue(
                        "@" + objData.INPUT.NAME[iAry],
                        Convert.ToDecimal(objData.INPUT.VALUE[iAry]));
                else
                    this.objCmd.Parameters.AddWithValue(
                        "@" + objData.INPUT.NAME[iAry],
                        HttpUtility.UrlDecode(objData.INPUT.VALUE[iAry]));
            }
            
            for (int iAry = 0; iAry < objData.getSize(typeDirection.OUTPUT); iAry++)
            {
                if (this.numberType(objData.OUTPUT.TYPE[iAry]))
                    objCmd.Parameters.Add(
                        "@" + objData.OUTPUT.NAME[iAry],
                        this.castType(objData.OUTPUT.TYPE[iAry]))
                    .Direction = ParameterDirection.Output;
                else
                    objCmd.Parameters.Add(
                        "@" + objData.OUTPUT.NAME[iAry],
                        this.castType(objData.OUTPUT.TYPE[iAry]), 
                        1000)
                    .Direction = ParameterDirection.Output;
            }
        }
        catch (SqlException ex)
        {
            throw new Exception(
                "Parameter 정보를 Mapping할 수 없습니다.\n -" + ex.Message);
        }
        catch (Exception ex)
        {
            throw new Exception(
                "Parameter 정보 Mapping 중에 오류가 발생하였습니다.\n -" + ex.Message);
        }

        // Run.
        //
        try
        {
            objCmd.ExecuteNonQuery();
        }
        catch (SqlException ex)
        {
            throw new Exception(
                "Procedure를 실행할 수 없습니다.\n -" + ex.Message);
        }
        catch (Exception ex)
        {
            throw new Exception(
                "Procedure 실행 중에 오류가 발생하였습니다.\n -" + ex.Message);
        }

        // Result.
        //
        try
        {
            for (int iAry = 0; iAry < objData.getSize(typeDirection.OUTPUT); iAry++)
            {
                objResult.Add(
                    objData.OUTPUT.NAME[iAry],
                    objCmd.Parameters["@" + objData.OUTPUT.NAME[iAry]].Value.ToString());
            }
        }
        catch (SqlException ex)
        {
            throw new Exception(
                "Result 정보를 Mapping할 수 없습니다.\n -" + ex.Message);
        }
        catch (Exception ex)
        {
            throw new Exception(
                "Result 정보 Mapping 중에 오류가 발생하였습니다.\n -" + ex.Message);
        }

        return objResult;
    }

    #endregion

    #region close() : close Saving Process.

    /// <summary>
    /// close() : close.
    /// </summary>
    public void close()
    {
        this.release();
    }
    public void close(doTransaction enTran)
    {
        this.processTran(enTran);
        this.release();
    }

    #endregion
}

#endregion

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//