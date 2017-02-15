using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Configuration;
using System.Web.Script.Serialization;
using System.Web.Script.Services;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class JOB_HRM_8151 : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
    }

    [WebMethod]
    public static string EmpCreate(string ann_key, int ann_seq, int app_key, string usr_id, string crud, string img_nm)
    {

        try
        {
            cProcedure objProcedure = new cProcedure();
            objProcedure.initialize();
            try
            {
                objProcedure.objCmd.CommandText = "sp_REC2HRM";
                objProcedure.objCmd.Parameters.AddWithValue("@ann_key", ann_key);
                objProcedure.objCmd.Parameters.AddWithValue("@ann_seq", ann_seq);
                objProcedure.objCmd.Parameters.AddWithValue("@app_key", app_key);
                objProcedure.objCmd.Parameters.AddWithValue("@usr_id", usr_id);
                objProcedure.objCmd.Parameters.AddWithValue("@crud", crud);
                objProcedure.objCmd.Parameters.Add("@emp_no", SqlDbType.VarChar, 20).Direction = ParameterDirection.Output;
                objProcedure.objCmd.CommandType = CommandType.StoredProcedure;
                objProcedure.objCmd.ExecuteNonQuery();
                objProcedure.processTran(doTransaction.COMMIT);
            }
            catch (SqlException ex)
            {
                objProcedure.processTran(doTransaction.ROLLBACK);

                throw new Exception(
                        new JavaScriptSerializer().Serialize(
                            new entityProcessed<string>(
                                    codeProcessed.ERR_SQL,
                                    "사원 생성 중 오류가 발생했습니다.\n- " + ex.Message)
                        )
                    );
            }
            catch (Exception ex)
            {
                objProcedure.processTran(doTransaction.ROLLBACK);

                throw new Exception(
                        new JavaScriptSerializer().Serialize(
                            new entityProcessed<string>(
                                    codeProcessed.ERR_PROCESS,
                                    "사원 생성 중 오류가 발생했습니다.\n- " + ex.Message)
                        )
                    );
            }
            string emp_no = objProcedure.objCmd.Parameters["@emp_no"].Value.ToString();

            // 이미지 업로드
            if (crud == "C")
            {
                try
                {
                    string ext = img_nm.Substring(img_nm.LastIndexOf(".") + 1);
                    string img_url = "http://recruit.goodware.co.kr/Files/Recruit/" + img_nm;
                    byte[] bImg = new System.Net.WebClient().DownloadData(img_url);

                    string strSQL = "INSERT INTO ZPHOTO(hcode, dcode, photo, ext, wsno, wdate) VALUES(@hcode, @dcode, @photo, @ext, @wsno, GETDATE())";
                    using (SqlConnection objCon = new SqlConnection(ConfigurationManager.ConnectionStrings["PLMDB"].ConnectionString))
                    using (SqlCommand objCmd = new SqlCommand(strSQL, objCon))
                    {
                        objCon.Open();

                        objCmd.Parameters.AddWithValue("@hcode", "EMP");
                        objCmd.Parameters.AddWithValue("@dcode", emp_no);
                        objCmd.Parameters.AddWithValue("@photo", bImg);
                        objCmd.Parameters.AddWithValue("@ext", ext);
                        objCmd.Parameters.AddWithValue("@wsno", "SYSTEM");

                        objCmd.ExecuteNonQuery();

                        objCon.Close();
                    }
                }
                catch (Exception ex)
                {

                }
                

            }
        }
        catch (Exception ex)
        {
            return new JavaScriptSerializer().Serialize(
                            new entityProcessed<string>(
                                    codeProcessed.ERR_PARAM,
                                    ex.Message)
                        );
        }

        return new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                                codeProcessed.SUCCESS,
                                "OK")
                    );

    }
}
