//----------------------------------------
// cDBQuery
//      : Query Collection & Process
//      : Created by Professor.X, GoodWare (2011.04)
//----------------------------------------

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;

#region cDBQuery : Query Collection + Execute Query

/// <summary>
/// cDBQuery : Query Collection + Execute Query
///     - enType : 종류. (typeQuery 참조)
///     - strSQL : Query.
/// </summary>
public class cDBQuery
{
    #region enRule : Method. (ruleQuery 참조)

    private ruleQuery _enRule;
    /// <summary>
    /// enRule : Method. (ruleQuery 참조)
    /// </summary>
    public ruleQuery enRule
    {
        get { return _enRule; }
        set { _enRule = value; }
    }

    #endregion

    #region strSQL : Query.

    private string _strSQL;
    /// <summary>
    /// strSQL : Query.
    /// </summary>
    public string strSQL
    {
        get { return _strSQL; }
        set { _strSQL = value; }
    }

    #endregion

    #region lstParam : Query Parameter.

    private List<cDBParameter> _lstParam;
    /// <summary>
    /// lstParam : Query Parameter.
    /// </summary>
    public List<cDBParameter> lstParam
    {
        get { return _lstParam; }
        set { _lstParam = value; }
    }

    #endregion

    #region Constructor : Filed 초기화 및 설정.

    /// <summary>
    /// Constructor : Filed 초기화 및 설정.
    /// </summary>
	public cDBQuery()   {}
    public cDBQuery(ruleQuery enRule, string strSQL)
    {
        this.enRule = enRule;
        this.strSQL = strSQL;
    }
    public cDBQuery(ruleQuery enRule, string strSQL, List<cDBParameter> lstParam)
    {
        this.enRule = enRule;
        this.strSQL = strSQL;
        this.lstParam = lstParam;
    }

    #endregion

    #region retrieveQuery() : Run Query to Retrieve.

    /// <summary>
    /// retrieveQuery() : Run Query to Retrieve.
    /// </summary>
    public SqlDataReader retrieveQuery(SqlCommand objCmd)
    {
        objCmd.CommandText = this.strSQL.ToString();
        switch (this.enRule)
        {
            case ruleQuery.INLINE:
                {
                    objCmd.CommandType = CommandType.Text;
                }
                break;
            case ruleQuery.PARAMETER:
                {
                    objCmd.CommandType = CommandType.StoredProcedure;
                    foreach (cDBParameter objParam in this.lstParam)
                    {
                        objParam.attachQuery(objCmd);
                    }
                }
                break;
        }
        return objCmd.ExecuteReader();
    }
    public SqlDataReader retrieveQuery(SqlConnection objCon)
    {
        SqlCommand objCmd = new SqlCommand(this.strSQL, objCon);
        switch (this.enRule)
        {
            case ruleQuery.INLINE:
                {
                    objCmd.CommandType = CommandType.Text;
                }
                break;
            case ruleQuery.PARAMETER:
                {
                    objCmd.CommandType = CommandType.StoredProcedure;
                    foreach (cDBParameter objParam in this.lstParam)
                    {
                        objParam.attachQuery(objCmd);
                    }
                }
                break;
        }
        return objCmd.ExecuteReader();
    }
    
    #endregion

    #region executeQuery() : Run Query to Execute.

    /// <summary>
    /// executeQuery() : Run Query to Execute.
    /// </summary>
    public void executeQuery(SqlCommand objCmd)
    {
        objCmd.CommandText = this.strSQL.ToString();
        switch (enRule)
        {
            case ruleQuery.INLINE:
                {
                    objCmd.CommandType = CommandType.Text;
                }
                break;
            case ruleQuery.PARAMETER:
                {
                    objCmd.CommandType = CommandType.StoredProcedure;
                    foreach (cDBParameter objParam in lstParam)
                    {
                        objParam.attachQuery(objCmd);
                    }
                }
                break;
        }
        if (objCmd.ExecuteNonQuery() <= 0)
        {
            throw new Exception(
                "DB에서 처리할 Data를 찾을 수가 없습니다.\n  - DB에 조건에 맞는 데이터가 없는 경우\n  - 해당 Data가 다른 트랜잭션에 의해 변경된 경우");
        }
    }
    public void executeQuery(SqlCommand objCmd, bool bNone)
    {
        objCmd.CommandText = this.strSQL.ToString();
        switch (enRule)
        {
            case ruleQuery.INLINE:
                {
                    objCmd.CommandType = CommandType.Text;
                }
                break;
            case ruleQuery.PARAMETER:
                {
                    objCmd.CommandType = CommandType.StoredProcedure;
                    foreach (cDBParameter objParam in lstParam)
                    {
                        objParam.attachQuery(objCmd);
                    }
                }
                break;
        }
        if (objCmd.ExecuteNonQuery() <= 0 && !bNone)
        {
            throw new Exception(
                "DB에서 처리할 Data를 찾을 수가 없습니다.\n  - DB에 조건에 맞는 데이터가 없는 경우\n  - 해당 Data가 다른 트랜잭션에 의해 변경된 경우");
        }
    }
    public void executeQuery(SqlConnection objCon)
    {
        SqlCommand objCmd = new SqlCommand(this.strSQL, objCon);
        switch (enRule)
        {
            case ruleQuery.INLINE:
                {
                    objCmd.CommandType = CommandType.Text;
                }
                break;
            case ruleQuery.PARAMETER:
                {
                    objCmd.CommandType = CommandType.StoredProcedure;
                    foreach (cDBParameter objParam in this.lstParam)
                    {
                        objParam.attachQuery(objCmd);
                    }
                }
                break;
        }
        if (objCmd.ExecuteNonQuery() <= 0)
        {
            throw new Exception(
                "DB에서 처리할 Data를 찾을 수가 없습니다.\n  - DB에 조건에 맞는 데이터가 없는 경우\n  - 해당 Data가 다른 트랜잭션에 의해 변경된 경우");
        }
    }
    
    #endregion
}

#endregion

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//