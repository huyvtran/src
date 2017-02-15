using System;
using System.Data;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Xml.Linq;
using System.Data.SqlClient;

/// <summary>
/// DataAccess의 요약 설명입니다.
/// </summary>
public class DataAccess
{
    SqlConnection Conn;
    SqlDataAdapter DA= new SqlDataAdapter();
    SqlCommandBuilder CB;

    DataTable DT;

    public SqlConnection OpenConnection()
    {  
        Conn = new SqlConnection(ConfigurationManager.ConnectionStrings["PLMDB"].ConnectionString);
        return Conn;
    }

    public Array CallStoredProcedure(string[,] MyINPram, string[,] MyOUTPram, string MySPName)
    {
        string Result;
        Conn = OpenConnection();
        SqlCommand CmdSp = new SqlCommand();
        CmdSp.Connection = Conn;
        CmdSp.CommandText = MySPName.ToString();
        CmdSp.CommandType = CommandType.StoredProcedure;

        //input parameters 
        for (int i = 0; i < MyINPram.Length / 2; i++)
        {
            CmdSp.Parameters.AddWithValue(MyINPram[i, 0], MyINPram[i, 1]);
        }

        //outparameters
        for (int i = 0; i < MyOUTPram.Length / 2; i++)
        { 
            if (MyOUTPram[i, 1] == "SqlDbType.VarChar")
            {
                CmdSp.Parameters.Add(MyOUTPram[i, 0], SqlDbType.VarChar, 150);
            }
            else
            {
                CmdSp.Parameters.Add(MyOUTPram[i, 0], SqlDbType.Int, 4);
            }

            CmdSp.Parameters[MyOUTPram[i, 0]].Direction = ParameterDirection.Output;
        }

        Conn.Open();
        CmdSp.ExecuteNonQuery();
        Conn.Close();

        string[,] Temparray = new string[MyOUTPram.Length / 2, 2];
        for (int i = 0; i < MyOUTPram.Length / 2; i++)
        {
            if (MyOUTPram[i, 1] == "SqlDbType.VarChar")
            {
                Result = (string)CmdSp.Parameters[MyOUTPram[i, 0]].Value;
            }
            else
            {
                Result = Convert.ToString(CmdSp.Parameters[MyOUTPram[i, 0]].Value);
            }
            Temparray[i, 0] = MyOUTPram[i, 0];
            Temparray[i, 1] = Result;
        }

        return Temparray;

	}

    public DataTable CallStoredProcedure(string MySPName)
    {          
        Conn = OpenConnection();
        SqlCommand cm = new SqlCommand(MySPName, Conn);
        cm.CommandType = CommandType.StoredProcedure;
        DA.SelectCommand = cm;
        DT = new DataTable();
        DA.Fill(DT);
        return DT;
     }
}
