using System;
public partial class Master_BizContainer : cEncryptModule
{
    public string chkStr = string.Empty;
    public string strAnn_key = string.Empty;
    public string strAnn_Seq = string.Empty;
    public string strApp_key = string.Empty;

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            chkStr = Request.Params["param"];
            if (chkStr == null || chkStr == "")
            {
                strAnn_key = "";
                strAnn_Seq = "";
                strApp_key = "";
            }
            else
            {
                chkStr = Decrypt(chkStr);
                //받은 값을 분리해서 값을 전달하는것으로 바꾸자. 
                string[] pArray = chkStr.Split(new char[] { '&', ' ' }, StringSplitOptions.RemoveEmptyEntries);
                for (int i = 0; i < pArray.Length; ++i)
                {
                    if (i == 0)
                    {
                        strAnn_key = Frn_rtn(pArray[i]);
                    }
                    else if (i == 1)
                    {
                        strAnn_Seq = Frn_rtn(pArray[i]);
                    }
                    else if (i == 2)
                    {
                        strApp_key = Frn_rtn(pArray[i]);
                    }
                }
            }
        }
    }

    private string Frn_rtn(string strP)
    {
        string rtnValue;
        string[] pTest = strP.Split('=');

        rtnValue = pTest[1].ToString();
        return rtnValue;
        
    }
}
