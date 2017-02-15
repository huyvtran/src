using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

public class cExportRetrieve
{
    public cExportRetrieve() { }

    #region ARGUMENT
    //------------------------------------------
    public string QUERY { get; set; }
    public List<string> ARGUMENT { get; set; }
    public List<string> VALUE    { get; set; }
    public int getSize()
    {
        return ARGUMENT.Count;
    }
    public string getQuery()
    {
        return this.QUERY;
    }
    public string getValue(string strArgument)
    {
        for (int iAry = 0; iAry < this.ARGUMENT.Count; iAry++)
        {
            if (this.ARGUMENT[iAry] == strArgument)
                return this.VALUE[iAry];
        }
        throw new Exception(
                "Request Data에서 해당 Argument를 찾을 수 없습니다."
            );
    }

    //------------------------------------------
    #endregion

    #region OPTION
    //------------------------------------------
    public List<string> OPTION { get; set; }
    public List<string> OPTIONVALUE { get; set; }
    public string getOptionValue(string strArgument)
    {
        for (int iAry = 0; iAry < this.OPTION.Count; iAry++)
        {
            if (this.OPTION[iAry] == strArgument)
                return this.OPTIONVALUE[iAry];
        }
        throw new Exception(
                "Request Data에서 해당 Option을 찾을 수 없습니다."
            );
    }

    //------------------------------------------
    #endregion


    #region PROCEDURE INPUT PARAMETER
    //------------------------------------------
    public List<string> INPARAM { get; set; }
    public List<string> INPARAMVALUE { get; set; }
    public string[,] GetpInParamAeray()
    {
        string[,] aString = new string[INPARAM.Count, 2];

        for (int iAry = 0; iAry < this.INPARAM.Count; iAry++)
        {
            aString[iAry, 0] = this.INPARAM[iAry];
            aString[iAry, 1] = this.INPARAMVALUE[iAry];
        }
        return aString;
    }
    //------------------------------------------
    #endregion

    #region PROCEDURE OUTPUT PARAMETER
    //------------------------------------------
    public List<string> OUTPARAM { get; set; }
    public List<string> OUTPARAMVALUE { get; set; }
    public string[,] GetpOutParamAeray()
    {
        string[,] aString = new string[OUTPARAM.Count, 2];

        for (int iAry = 0; iAry < this.OUTPARAM.Count; iAry++)
        {
            aString[iAry, 0] = this.OUTPARAM[iAry];
            aString[iAry, 1] = this.OUTPARAMVALUE[iAry];
        }
        return aString;
    }
    //------------------------------------------
    #endregion

}
