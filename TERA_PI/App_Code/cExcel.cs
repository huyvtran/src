//----------------------------------------
// cExcel
//      : Office Component와 관련된 기능 수행
//      : Created by Professor.X, GoodWare (2011.04)
//----------------------------------------

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Data;
using System.Data.SqlClient;
using System.Web.Configuration;
using System.Text;
using System.Collections;
using System.Collections.Specialized;
using System.Configuration;
//using Microsoft.Office.Core; //Microsoft Office 12.0 Object Library
using Excel = Microsoft.Office.Interop.Excel; //Microsoft Office 2007 Excel PIAs (Primary Interop Assemblies)

#region cExcel : Office Component와 관련된 기능 수행

/// <summary>
/// cExcel : Office Component와 관련된 기능 수행.
/// </summary>
public class cExcel
{
    public static void drawLine(Microsoft.Office.Interop.Excel.Range objRange, int code)
    {
        if (code == 1)
        {
            objRange.Borders[Excel.XlBordersIndex.xlEdgeTop].LineStyle = Excel.XlLineStyle.xlContinuous;
            objRange.Borders[Excel.XlBordersIndex.xlEdgeBottom].LineStyle = Excel.XlLineStyle.xlContinuous;
        }
        else if (code == 2)
        {
            objRange.Borders[Excel.XlBordersIndex.xlEdgeTop].LineStyle = Excel.XlLineStyle.xlDouble;
            objRange.Borders[Excel.XlBordersIndex.xlEdgeBottom].LineStyle = Excel.XlLineStyle.xlDouble;
        }
        objRange.Borders[Excel.XlBordersIndex.xlEdgeBottom].Weight = Excel.XlBorderWeight.xlThin;
        objRange.Borders[Excel.XlBordersIndex.xlEdgeTop].Weight = Excel.XlBorderWeight.xlThin;
        objRange.Borders[Excel.XlBordersIndex.xlEdgeLeft].LineStyle = Excel.XlLineStyle.xlContinuous;
        objRange.Borders[Excel.XlBordersIndex.xlEdgeLeft].Weight = Excel.XlBorderWeight.xlThin;
        objRange.Borders[Excel.XlBordersIndex.xlEdgeRight].LineStyle = Excel.XlLineStyle.xlContinuous;
        objRange.Borders[Excel.XlBordersIndex.xlEdgeRight].Weight = Excel.XlBorderWeight.xlThin;
        objRange.Borders[Excel.XlBordersIndex.xlInsideHorizontal].LineStyle = Excel.XlLineStyle.xlContinuous;
        objRange.Borders[Excel.XlBordersIndex.xlInsideHorizontal].Weight = Excel.XlBorderWeight.xlThin;
        objRange.Borders[Excel.XlBordersIndex.xlInsideVertical].LineStyle = Excel.XlLineStyle.xlContinuous;
        objRange.Borders[Excel.XlBordersIndex.xlInsideVertical].Weight = Excel.XlBorderWeight.xlThin;
        objRange.Borders[Excel.XlBordersIndex.xlEdgeTop].ColorIndex = Excel.XlColorIndex.xlColorIndexAutomatic;
    }

    public static void drawBorder(Microsoft.Office.Interop.Excel.Range objRange, Excel.XlBorderWeight xlWeight)
    {
        objRange.Borders[Excel.XlBordersIndex.xlEdgeTop].LineStyle = Excel.XlLineStyle.xlContinuous;
        objRange.Borders[Excel.XlBordersIndex.xlEdgeBottom].LineStyle = Excel.XlLineStyle.xlContinuous;
        objRange.Borders[Excel.XlBordersIndex.xlEdgeLeft].LineStyle = Excel.XlLineStyle.xlContinuous;
        objRange.Borders[Excel.XlBordersIndex.xlEdgeRight].LineStyle = Excel.XlLineStyle.xlContinuous;
        objRange.Borders[Excel.XlBordersIndex.xlEdgeTop].Weight = xlWeight;
        objRange.Borders[Excel.XlBordersIndex.xlEdgeBottom].Weight = xlWeight;
        objRange.Borders[Excel.XlBordersIndex.xlEdgeLeft].Weight = xlWeight;
        objRange.Borders[Excel.XlBordersIndex.xlEdgeRight].Weight = xlWeight;
        objRange.Borders[Excel.XlBordersIndex.xlEdgeTop].ColorIndex = Excel.XlColorIndex.xlColorIndexAutomatic;
    }
}

#endregion

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//