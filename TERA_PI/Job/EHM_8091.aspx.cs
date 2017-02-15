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
using Excel = Microsoft.Office.Interop.Excel;
using System.Collections;
using System.Collections.Specialized;
using System.Configuration;
using System.Windows.Forms;
using System.Reflection;

public partial class JOB_EHM_8091 : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
    }

    #region Print() : DB의 Data를 통해 출력물 Create.

    /// <summary>
    /// Print() : DB의 Data를 통해 출력물 Create.
    ///     : input
    ///         - DATA : Query and Argument / Option
    ///     : output 
    ///         - success : 출력물 파일 정보
    ///         - else : entityProcessed (string)
    /// </summary>
    [WebMethod]
    public static string Print(cRetrieveData DATA)
    {
        string strReturn = string.Empty;

        string strDept = DATA.getOption("DEPT");
        string strPrint = DATA.getOption("PRINT");
        string strPage = DATA.getOption("PAGE");
        string strUser = DATA.getOption("USER");
        string strTitle = DATA.getOption("TITLE");
        string sToday = DateTime.Now.ToString("yyyyMMdd");

        string sFileIdSrc = "Daily_Report";
        string sFileIdTrg = strDept + "_" + sFileIdSrc + "_" + strUser + "_" + sToday;
        string sFileNmTrg = sFileIdTrg + "." + "xls";
        string strRoot = HttpContext.Current.Server.MapPath("~/");
        string strSource = strRoot + "Report/" + strPage + "/" + sFileIdSrc + ".xls";
        if (!System.IO.Directory.Exists(strRoot + "Report/" + strPage + "/" + sToday)) System.IO.Directory.CreateDirectory(strRoot + "Report/" + strPage + "/" + sToday);
        string strTarget = strRoot + "Report/" + strPage + "/" + sToday + "/" + sFileIdTrg;
        object varMissing = System.Reflection.Missing.Value;


        Excel.Application exc = null;
        Excel.Workbook workbook;
        Excel.XlFileFormat enSource = Excel.XlFileFormat.xlExcel8;
        
        object TypMissing = Type.Missing;
        
        #region create Excel object
        try
        {
            exc = new Excel.Application();
            exc.Visible = false;
            exc.DisplayAlerts = false;
            workbook = exc.Workbooks.Open(strSource, TypMissing, TypMissing, TypMissing, TypMissing,
                TypMissing, TypMissing,
                TypMissing, TypMissing, TypMissing, TypMissing, TypMissing, TypMissing, TypMissing, TypMissing);

        }catch (Exception ex)
        {
            throw new Exception(
                new JavaScriptSerializer().Serialize(
                    new entityProcessed<string>(
                        codeProcessed.ERR_PROCESS,
                        "Office 설정 중에 오류가 발생하였습니다.\n- " + ex.Message)
                    )
                );
        }
        #endregion

        #region delete & add new codelist sheet

        Excel.Worksheet sheet = (Excel.Worksheet)workbook.Worksheets.get_Item("list");
        exc.DisplayAlerts = false;
        sheet.Delete();
        
        int sheetcnt = exc.ActiveWorkbook.Sheets.Count;
        Excel.Worksheet addsheet = (Excel.Worksheet)exc.Worksheets.Add();
        //((Excel.Worksheet)exc.ActiveSheet).Move(TypMissing, exc.Worksheets[sheetcnt + 1]);

        addsheet.Name = "list";

        #endregion

        #region write code sheet
        List<List<string>> list = getSugiList();

        insertList(exc, addsheet, list);
        insertCode(exc, addsheet, strDept);
        #endregion
        addsheet.Visible = Excel.XlSheetVisibility.xlSheetHidden;

        Excel.Worksheet report = (Excel.Worksheet)exc.Worksheets.get_Item("Daily Report");
        Excel.Worksheet parts = (Excel.Worksheet)exc.Worksheets[2];
        //report.Activate();
        //parts.Activate();
        
        #region

        try
        {
            if (System.IO.File.Exists(strTarget)) System.IO.File.Delete(strTarget);
            report.SaveAs(strTarget, enSource, varMissing, varMissing, varMissing, varMissing, varMissing, varMissing, varMissing, varMissing);
            //Excel 파일 오픈시 처음 나타나는 sheet 지정
            
            strReturn = new JavaScriptSerializer().Serialize(
                            new entityProcessed<string>(codeProcessed.SUCCESS, sToday + "/" + sFileNmTrg)
                        );
        }
        catch (Exception ex)
        {
            throw new Exception(
                new JavaScriptSerializer().Serialize(
                    new entityProcessed<string>(
                        codeProcessed.ERR_PROCESS,
                        "Print 생성 중에 오류가 발생하였습니다.\n- " + ex.Message)
                    )
                );
        }
        finally
        {
            #region release.

            // release.
            //
            if (exc != null)
            {
                if (exc.Application.Ready)
                {
                    exc.Workbooks.Close();
                    exc.Quit();
                }
                if (exc != null)
                {
                    System.Diagnostics.Process[] pProcess;
                    pProcess = System.Diagnostics.Process.GetProcessesByName("Excel");
                    pProcess[0].Kill();
                }
            }

            #endregion
        }

        #endregion

        return strReturn;
        #endregion
    }

    //==========
    public static void insertCode(Excel.Application exc, Excel.Worksheet sheet, string deptcode)
    {
        int row = 2;
        int col = 5;                //getsugiList().strlist.size + 1
        string title = string.Empty;
        SqlConnection objCon = null;
        SqlCommand cmd = new SqlCommand();
        #region open DB
        //  connect to DB.
        //
        try
        {
            objCon = new SqlConnection(
                                ConfigurationManager.ConnectionStrings["PLMDB"].ConnectionString);
            objCon.Open();

            cmd.Connection = objCon;
            cmd.CommandType = CommandType.Text;
        }
        catch (SqlException ex)
        {
            throw new Exception(
                new JavaScriptSerializer().Serialize(
                    new entityProcessed<string>(
                        codeProcessed.ERR_SQL,
                        "Database에 연결할 수 없습니다.\n- " + ex.Message)
                    )
                );
        }
        catch (Exception ex)
        {
            throw new Exception(
                new JavaScriptSerializer().Serialize(
                    new entityProcessed<string>(
                        codeProcessed.ERR_PROCESS,
                        "Database 연결 중에 오류가 발생하였습니다.\n- " + ex.Message)
                    )
                );
        }
        #endregion


        string qry = "SELECT * " +
                     "  FROM fn_getEHMIssueCodeList('" + deptcode + "') " +
                     "  ORDER BY SEQ";
        cmd.CommandText = qry;
        SqlDataReader dr = cmd.ExecuteReader();
        while (dr.Read())
        {
            if (title.Equals(dr["code"].ToString()))
            {
                
                sheet.Cells[row, col] = dr["name"].ToString();
                row++;
                
            }
            else
            {
                title = dr["code"].ToString();
                row = 2;
                col++;
                
                sheet.Cells[row, col] = dr["code"].ToString();
                row++;
                sheet.Cells[row, col] = dr["name"].ToString();
                row++;
            }
            setNameManager(exc, sheet, title, row);
        }
        setNameManager(exc, sheet, title, row);
        dr.Close();
        if (objCon != null) objCon.Close();

        
    }
    
    //========== 수기로 등록하는 code list
    public static List<List<string>> getSugiList()
    {

        List<string[]> strlist = new List<string[]>();
        List<List<string>> sugilist = new List<List<string>>();

        //array[0]      = Excel dropdown name title
        //array[1] ~    = Excel dropdown name value
        string[] pay = { "유무상", "무상", "유상" };
        string[] plan = { "업무계획", "plan", "non-plan" };
        string[] complete = { "완료유무", "완료", "진행중", "작업대기" };
        string[] result = { "결론", "Close", "ING", "보류", "Drop" };
                
        strlist.Add(pay);
        strlist.Add(complete);
        strlist.Add(result);
        strlist.Add(plan);

        foreach (string[] temp in strlist)
        {
            List<string> templist = new List<string>();
            foreach (string str in temp)
            {
                templist.Add(str);
            }
            sugilist.Add(templist);
        }

        return sugilist;
    }

    //========== write code & name manager
    public static void insertList(Excel.Application exc, Excel.Worksheet sheet, List<List<string>> list)
    {
        int col = 2;                 // B부터 시작
        
        foreach (List<string> sub_list in list)
        {
            for (int i = 2; i < sub_list.Count + 2; i++){
                sheet.Cells[i, col] = sub_list[i - 2];
            }
            col++;

            setNameManager(exc, sheet, sub_list[0], sub_list.Count + 2);
        }

    }
    //========== insert into name manager
    public static void setNameManager(Excel.Application exc, Excel.Worksheet sheet, string name, int rnglength)
    {
        
        string[] cell = findCellByValue(sheet, "B2", "BZ2", name);
        //char spliter = '|';
        //string cell = crd.Split(spliter);
        int col = Int32.Parse(cell[0]);
        int row = Int32.Parse(cell[1]);
        string title;

        title = sheet.Cells[row, col].ToString();

        Excel.Range rng = sheet.Range[sheet.Cells[row + 1, col], sheet.Cells[rnglength - 1, col]];
        Excel.Names names = exc.Names;
        Excel.Name nm = names.Add(name, rng);
    }

    //========== 
    public static string[] findCellByValue(Excel.Worksheet sheet, string startCell, string endCell, string value)
    {
        object TypMissing = Type.Missing;
        string[] cell = new string[2];
        string strcol = startCell.Substring(0, 1);
        string endcol = endCell.Substring(0, 1);
        string strrow = startCell.Substring(1, 1);
        string endrow = endCell.Substring(1, 1);
        if(endCell.Length > 2)
        {
            endcol = endCell.Substring(0, 2);
            endrow = endCell.Substring(2, 1);
        }
        Excel.Range rng = sheet.Range[sheet.Cells[strrow, strcol], sheet.Cells[endrow, endcol]];

        Microsoft.Office.Interop.Excel.Range xlFound = rng.EntireRow.Find(value,
        TypMissing, Excel.XlFindLookIn.xlValues, Excel.XlLookAt.xlPart,
        Excel.XlSearchOrder.xlByColumns, Excel.XlSearchDirection.xlNext,
        true, TypMissing, TypMissing);

        cell[0] = xlFound.Column.ToString();
        cell[1] = xlFound.Row.ToString();
        return cell;
    }



}
