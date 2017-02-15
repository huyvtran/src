//----------------------------------------
// entityEnumeration
//      : 열거형 상수 선언
//      : Created by Professor.X, GoodWare (2011.04)
//----------------------------------------

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

#region codeProcessed : Service의 처리 Code.

/// <summary>
/// codeProcessed : Service의 처리 Code.
/// </summary>
public enum codeProcessed
{
    SUCCESS = 0,
    NONE = 1,
    ERR_PARAM = -1,
    ERR_PROCESS = -2,
    ERR_SQL = -100,
    NONE_SQL = 100
}

#endregion

#region typeArgument : Argument Type.

/// <summary>
/// typeArgument : Argument Type. (DB)
/// </summary>
public enum typeArgument
{
    NUM = 1,
    CHAR = 2,
    DATE = 3,
    DATETIME = 4,
    WHERE= 5
}

#endregion

#region typeQuery : Query Type.

/// <summary>
/// typeQuery : Query Type. (DB)
/// </summary>
public enum typeQuery
{
    SELECT = 1,
    INSERT = 2,
    UPDATE = 3,
    DELETE = 4
}

#endregion

#region ruleQuery : Query Method.

/// <summary>
/// ruleQuery : Query Method. (DB)
/// </summary>
public enum ruleQuery
{
    INLINE = 1,
    PARAMETER = 2,
    PROCEDURE = 4
}

#endregion

#region typeDirection : Direction Type for Procedure.

/// <summary>
/// typeDirection : Direction type for Procedure.
/// </summary>
public enum typeDirection
{
    INPUT = 1,
    OUTPUT = 2
}

#endregion

#region doTransaction : Process Type using Transaction.

/// <summary>
/// doTransaction : Process Type using Transaction.
/// </summary>
public enum doTransaction
{
    COMMIT = 1,
    ROLLBACK = 2
}

#endregion

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//