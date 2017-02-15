using System;
using System.Collections.Generic;
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
using Excel = Microsoft.Office.Interop.Excel;
using System.Diagnostics;
using System.Windows.Forms;
using System.Linq;

/// <summary>
/// TERA A/S 관련 Excel 기능 클래스
/// 2017.01
/// </summary>
public class ASExcel
{
    Excel.Workbook workbook;
    Excel.Application exc = new Microsoft.Office.Interop.Excel.Application();
    object TypMissing = Type.Missing;


    SqlConnection objcon;
    public ASExcel()
    {
    }

    //========== Excel 파일 open
    public void openFile(string filepath)             
    {
        string name = filepath;
        workbook = exc.Workbooks.Open(name, TypMissing, TypMissing, TypMissing, TypMissing,
            TypMissing, TypMissing,
            TypMissing, TypMissing, TypMissing, TypMissing, TypMissing, TypMissing, TypMissing, TypMissing);
    }

    //========== Sheet 추가
    public void addSheet()
    {
        int sheetcnt = exc.ActiveWorkbook.Sheets.Count;
        Excel.Worksheet sheet = (Excel.Worksheet)this.exc.Worksheets.Add();

        ((Excel.Worksheet)exc.ActiveSheet).Move(TypMissing, this.exc.Worksheets[sheetcnt + 1]);
        
    }

    //========== 
    public void cellRename(string name, int cellnum)
    {
        Excel.Worksheet sheet = (Excel.Worksheet)workbook.Worksheets.get_Item(cellnum);
        try
        {
            sheet.Name = name;
        }catch(Exception e)
        {
            MessageBox.Show("중복된 셀 명칭입니다.");
        }
        
    }


    //==========
    public Excel.Worksheet getSheetByName(string sheetname)
    {
        return (Excel.Worksheet)workbook.Worksheets.get_Item(sheetname);
    }


    //==========
    public void deleteSheet(string sheetname)
    {
        try
        {
            Excel.Worksheet sheet = (Excel.Worksheet)workbook.Worksheets.get_Item(sheetname);
            exc.DisplayAlerts = false;
            sheet.Delete();
        }catch
        {
            return;
        }

    }

    //==========
    public void insertList(List<List<string>> list, string sheetname)
    {
        int col = 2;                 // B부터 시작

        Excel.Worksheet sheet = getSheetByName(sheetname);
        foreach(List<string> sub_list in list)
        {
            //char asciistr = Convert.ToChar(asciinum);
            for(int i = 2; i < sub_list.Count +2; i++)
            {
                sheet.Cells[i, col] = sub_list[i - 2];
            }
            col++;

            setNameManager(sheetname, sub_list[0], sub_list.Count + 2);
        }

    }

    //========== 수기로 등록하는 code list
    public List<List<string>> getSugiList()
    {
        
        List<string[]> strlist = new List<string[]>();
        List<List<string>> sugilist = new List<List<string>>();
        string[] dept = {"부서", "CS", "공정", "전장", "S/W", "품질", "구매", "MKT", "H/W설계", "고객사", "업체", "N/A" };
        string[] pay = { "유무상", "무상", "유상" };
        string[] complete = { "완료유무", "완료", "진행중", "작업대기" };
        string[] result = { "결론", "Close", "ING", "보류", "Drop" };

        strlist.Add(dept);
        strlist.Add(pay);
        strlist.Add(complete);
        strlist.Add(result);

        foreach(string[] temp in strlist)
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



    //==========
    public List<List<string>> getList()
    {
        
        List<List<string>> listlist = new List<List<string>>();
        List<List<string>> sugilist = getSugiList();



        string[] qry = new string[2];
        string[] hcode = { "IEHM80", "IEHM81", "IEHM82", "IEHM83", "IEHM84", "IEHM85", "IEHM86", "IEHM87" };
        //string[] codename = { "대분류", "중분류", "소분류", "A/S 상태유형", "A/S 작업유형", "A/S 발생유형", "A/S GLS 유형", "A/S 추후방안" };
        string rcode1 = "EHM_AS";
        
        qry[0] = "SELECT hname " +
                  " FROM ZCODEH " +
                   "WHERE rcode1 = " + "'" + rcode1 + "'";
        qry[1] = "SELECT dname " +
                  " FROM ZCODED " +
                  "WHERE hcode = ";
        openDB();
        SqlCommand cmd = new SqlCommand();
        cmd.Connection = objcon;
        cmd.CommandType = CommandType.Text;

        for (int i = 0; i < qry.Length; i++)
        {
            List<string> resultlist;


            if (i == 1)
            {
                for (int j= 0; j < hcode.Length; j++)
                {
                    resultlist = new List<string>();

                    cmd.CommandText = qry[i] + "'" + hcode[j] + "'";
                    SqlDataReader dr = cmd.ExecuteReader();

                    resultlist.Add(hcode[j]);
                    while (dr.Read())
                    {
                        resultlist.Add(dr["dname"].ToString());
                    }
                    dr.Close();
                    listlist.Add(resultlist);
                }
            }else
            {
                resultlist = new List<string>();

                cmd.CommandText = qry[i];
                SqlDataReader dr = cmd.ExecuteReader();

                resultlist.Add("항목");
                while (dr.Read())
                {
                    resultlist.Add(dr["hname"].ToString());
                }
                dr.Close();
                listlist.Add(resultlist);
            }
            
        }
        closeDB();

        foreach(List<string> sugi in sugilist)
        {
            listlist.Add(sugi);
        }

        return listlist;
    }


    //==========
    public void openDB()
    {
        objcon = new SqlConnection(ConfigurationManager.ConnectionStrings["PLMDB"].ConnectionString);
        objcon.Open();
    }
    public void closeDB()
    {
        objcon.Close();
    }



    //==========
    public void setNameManager(string sheetname, string name, int rnglength)
    {

        char spliter = '|';
        string crd = findCellByValue(sheetname,"B2","Z2",name);
        string[] cell = crd.Split(spliter);
        int col = Int32.Parse(cell[0]);
        int row = Int32.Parse(cell[1]);
        string title;
        Excel.Worksheet sheet = getSheetByName(sheetname);

        title = sheet.Cells[row, col].ToString();

        Excel.Range rng = sheet.Range[sheet.Cells[row +1 , col], sheet.Cells[rnglength - 1, col]];
        Excel.Names names = exc.Names;
        Excel.Name nm = names.Add(name, rng);
    }

    //==========
    public string findCellByValue(string sheetname, string startCell,string endCell, string value)
    {
        string cell;
        string strcol = startCell.Substring(0, 1);
        string endcol = endCell.Substring(0, 1);
        string strrow = startCell.Substring(1, 1);
        string endrow = endCell.Substring(1, 1);

        Excel.Worksheet sheet = getSheetByName(sheetname);
        Excel.Range rng = sheet.Range[sheet.Cells[strrow,strcol], sheet.Cells[endrow,endcol]];

        Microsoft.Office.Interop.Excel.Range xlFound = rng.EntireRow.Find(value,
        TypMissing, Excel.XlFindLookIn.xlValues, Excel.XlLookAt.xlPart,
        Excel.XlSearchOrder.xlByColumns, Excel.XlSearchDirection.xlNext,
        true, TypMissing, TypMissing);

        cell = xlFound.Column.ToString() + "|" + xlFound.Row.ToString();
        return cell;
    }


    //========== Excel Cell Copy
    public void copyCell(int orgsheet_num, int copysheet_num)
    {
        Excel.Worksheet orgSheet = (Excel.Worksheet)workbook.Worksheets.get_Item(orgsheet_num);
        Excel.Worksheet copySheet = (Excel.Worksheet)workbook.Worksheets.get_Item(copysheet_num);

        string endCell = string.Empty;
        switch (orgsheet_num)
        {
            case 4:                     //Daily 진행사항 일 경우 ~AQ
                endCell = "AQ13";
                break;
            case 8:                     //Fail Parts 일 경우 ~U
                endCell = "U13";
                break;
        }
        Excel.Range orgrow = orgSheet.get_Range("B4", endCell);
        Excel.Range copyto = copySheet.get_Range("B4", endCell);

        orgrow.Copy(copyto);
        
        deleteCell("B4", endCell, copySheet);

        string[] names = { "test1", "test2" };
        addName(copySheet, names);

    }
                                                                             
    //==========
    public void deleteCell(string strcell,string endcell, Excel.Worksheet sheet)
    {
        Excel.Range row = sheet.get_Range(strcell, endcell);
        row.Cells.Value = "";           // row의 format은 유지, value만 삭제
    }


    //========== Daily & FailParts header copy
    public void dfCopy()
    {
        int sheetcnt = exc.ActiveWorkbook.Sheets.Count;
        copyCell(4, sheetcnt-1);
        copyCell(8, sheetcnt);
    }

    //========== 이름관리자에 이름 추가
    public void addName(Excel.Worksheet sheet, string[] strcode)
    {
        Excel.Names names = sheet.Names;
        string refersToString = "={\"" + String.Join("\",\"", strcode) + "\"}";
        try
        {
            Excel.Name name = names.Add("test22", "={\"test1\";\"test2\"}");
        }
        catch(Exception e)
        {
            MessageBox.Show(e.Message);
            workbook.Close();

            return;
        }
        
    }
    
    //========== Excel 저장 및 프로세스 종료
    public void saveFile()
    {
        try
        {
            workbook.Save();
        }catch(Exception e)
        {
            MessageBox.Show(e.Message);
        }
        
        workbook.Close();
        exc.Quit();

        Process[] ExCel = Process.GetProcessesByName("EXCEL");
        if (ExCel.Count() != 0)
        {
            MessageBox.Show("Complete");
            
            ExCel[0].Kill();
        }
    }

}