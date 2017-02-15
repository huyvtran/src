//------------------------------------------
// svc_Procedure
//      : Call DB Procedure and Get Result.
//		: Created by Professor.X, GoodWare (2011.04)
//------------------------------------------

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

public partial class Service_svc_Procedure : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
    }

    #region Call() : Call Procedure

    /// <summary>
    /// Call() : Call Procedure
    ///     : Call DB Procedure and Get Result.
    ///     : input
    ///         - DATA : Query and Input / Output Parameter
    ///     : output 
    ///         - success : Result (entityNameValue)
    ///         - else : entityProcessed (string)
    /// </summary>
    [WebMethod]
    public static string Call(cProcedureData DATA)
    {
        string strReturn = string.Empty;
        entityNameValue objResult = null;
        cProcedure objProcedure = new cProcedure();
        try
        {
            #region initialize to Call.

            // initialize to Call.
            //
            objProcedure.initialize(false);
            objProcedure.objCmd.CommandTimeout = 99;

            #endregion

            #region call Procedure.

            // call Procedure.
            //
            objResult = objProcedure.call(DATA);

            #endregion

            #region normal Closing.

            // normal Closing.
            //
            objProcedure.close();
            strReturn = new JavaScriptSerializer().Serialize(
                                new entityProcessed<entityNameValue>(
                                    codeProcessed.SUCCESS,
                                    objResult)
                            );

            #endregion
        }
        catch (Exception ex)
        {
            #region abnormal Closing.

            // abnormal Closing.
            //
            strReturn = new JavaScriptSerializer().Serialize(
                            new entityProcessed<string>(
                                    codeProcessed.ERR_PROCESS,
                                    ex.Message)
                            );

            #endregion
        }
        finally
        {
            #region release.

            // release.
            //
            objProcedure.release();

            #endregion
        }

        return strReturn;
    }

    #endregion

    #region Exce() : Execute Procedure (using Transaction)

    /// <summary>
    /// Exec() : Execute Procedure (using Transaction)
    ///     : Execute DB Procedure using Transaction and Get Result.
    ///     : input
    ///         - DATA : Query and Input / Output Parameter
    ///     : output 
    ///         - success : Result (entityNameValue)
    ///         - else : entityProcessed (string)
    /// </summary>
    [WebMethod]
    public static string Exec(cProcedureData DATA)
    {
        string strReturn = string.Empty;
        entityNameValue objResult = null;
        cProcedure objProcedure = new cProcedure();
        try
        {
            #region initialize to Call.

            // initialize to Call.
            //
            objProcedure.initialize(true);
            objProcedure.objCmd.CommandTimeout = 99;

            #endregion

            #region call Procedure.

            // call Procedure.
            //
            objResult = objProcedure.call(DATA);

            #endregion

            #region normal Closing.

            // normal Closing.
            //
            objProcedure.close(doTransaction.COMMIT);
            strReturn = new JavaScriptSerializer().Serialize(
                                new entityProcessed<entityNameValue>(
                                    codeProcessed.SUCCESS,
                                    objResult)
                            );

            #endregion
        }
        catch (Exception ex)
        {
            #region abnormal Closing.

            // abnormal Closing.
            //
            objProcedure.close(doTransaction.ROLLBACK);
            strReturn = new JavaScriptSerializer().Serialize(
                            new entityProcessed<string>(
                                    codeProcessed.ERR_PROCESS,
                                    ex.Message)
                            );

            #endregion
        }
        finally
        {
            #region release.

            // release.
            //
            objProcedure.release();

            #endregion
        }

        return strReturn;
    }

    #endregion
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//