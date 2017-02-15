using System;
using System.Data;
using System.Data.SqlClient;

public partial class Proc_setWorkTime : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        DateTime now = DateTime.Now;
        string user_id = Request.QueryString["user_id"];
        string work_tp = Request.QueryString["work_tp"];
        if (work_tp.ToUpper().Equals("IN"))
            setAttTime(user_id, now);
        else if (work_tp.ToUpper().Equals("OUT"))
            setLeaveTime(user_id, now);
        else
            Response.Write("<script>alert(\"잘못된 매개변수\");</script>");
    }

    protected void setAttTime(string user_id, DateTime att_dt)
    {
        cProcedure objProcedure = new cProcedure();
        string att_date = att_dt.ToString("yyyyMMdd");
        string att_time = att_dt.ToString("HHmm");
        string rtn_msg = string.Empty;

        objProcedure.initialize();
        try
        {
            string strSQL = "SP_IF_AttendChange";

            objProcedure.objCmd.CommandText = strSQL;
            objProcedure.objCmd.Parameters.AddWithValue("@att_date", att_date);
            objProcedure.objCmd.Parameters.AddWithValue("@user_id", user_id);
            objProcedure.objCmd.Parameters.AddWithValue("@att_time", att_time);
            objProcedure.objCmd.Parameters.Add("@msg", SqlDbType.VarChar, 200).Direction = ParameterDirection.Output;
            objProcedure.objCmd.CommandType = CommandType.StoredProcedure;
            objProcedure.objCmd.ExecuteNonQuery();
            objProcedure.processTran(doTransaction.COMMIT);

            rtn_msg = objProcedure.objCmd.Parameters["@msg"].Value.ToString();
            //rtn_msg = string.Format("{0}님\n {1} {2} 에 출근 처리가 완료 되었습니다.", rtn_msg, att_dt.ToShortDateString(), att_dt.ToLongTimeString());
        }
        catch (SqlException ex)
        {
            objProcedure.processTran(doTransaction.ROLLBACK);
            rtn_msg = "출근처리 오류\n" + ex.Message;
        }
        catch (Exception ex)
        {
            objProcedure.processTran(doTransaction.ROLLBACK);
            rtn_msg = "출근처리 오류\n" + ex.Message;
        }
        finally
        {
            if (objProcedure != null)
                objProcedure.close();
        }

        string alert = string.Format("<script>alert(\"{0}\");</script>", rtn_msg.Replace("\n", "\\n"));
        Response.Write(alert);

    }

    protected void setLeaveTime(string user_id, DateTime leave_dt)
    {
        cProcedure objProcedure = new cProcedure();
        string att_date = leave_dt.ToString("yyyyMMdd");
        string leave_time = leave_dt.ToString("HHmm");
        string rtn_msg = string.Empty;

        objProcedure.initialize();
        try
        {
            string strSQL = "SP_IF_AttendChange";

            objProcedure.objCmd.CommandText = strSQL;
            objProcedure.objCmd.Parameters.AddWithValue("@att_date", att_date);
            objProcedure.objCmd.Parameters.AddWithValue("@user_id", user_id);
            objProcedure.objCmd.Parameters.AddWithValue("@leave_time", leave_time);
            objProcedure.objCmd.Parameters.Add("@msg", SqlDbType.VarChar, 200).Direction = ParameterDirection.Output;
            objProcedure.objCmd.CommandType = CommandType.StoredProcedure;
            objProcedure.objCmd.ExecuteNonQuery();
            objProcedure.processTran(doTransaction.COMMIT);

            rtn_msg = objProcedure.objCmd.Parameters["@msg"].Value.ToString();
            //rtn_msg = string.Format("{0}님\n {1} {2} 에 퇴근 처리가 완료 되었습니다.", rtn_msg, leave_dt.ToShortDateString(), leave_dt.ToLongTimeString());
        }
        catch (SqlException ex)
        {
            objProcedure.processTran(doTransaction.ROLLBACK);
            rtn_msg = "퇴근처리 오류\n" + ex.Message;
        }
        catch (Exception ex)
        {
            objProcedure.processTran(doTransaction.ROLLBACK);
            rtn_msg = "퇴근처리 오류\n" + ex.Message;
        }
        finally
        {
            if (objProcedure != null)
                objProcedure.close();
        }

        string alert = string.Format("<script>alert(\"{0}\");</script>", rtn_msg.Replace("\n", "\\n"));
        Response.Write(alert);

    }

}