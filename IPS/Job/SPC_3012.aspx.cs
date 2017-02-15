using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using DevExpress.XtraCharts;
using System.Web.Script.Serialization;

public partial class JOB_SPC_3012 : System.Web.UI.Page
{
    cChart objChart;

    protected void Page_Load(object sender, EventArgs e)
    {
        objChart = new cChart();
    }
    protected void ctlChart_1_CustomCallback(object sender, DevExpress.XtraCharts.Web.CustomCallbackEventArgs e)
    {
        objChart.bindData(
            e.Parameter.ToString(),
            this.ctlDB_1,
            this.ctlChart_1);

        ////ctlDB_1.Select(argRow)를 사용하려면 DataSet 을 사용해야함
        //ctlDB_1.DataSourceMode = SqlDataSourceMode.DataSet;
        //DataSourceSelectArguments argRow = new DataSourceSelectArguments();
        //argRow.StartRowIndex = 1;
        //System.Collections.IEnumerable kkk = ctlDB_1.Select(argRow);
        //string[] jkl = (string[])kkk;
        //if (jkl != null){
        //string jlksdf = jkl[0];
        //}

        // Customizing
        // Get CL, UCL, LCL Value
        string sQry = ctlDB_1.SelectCommand;
        if (!string.IsNullOrEmpty(sQry) && sQry.IndexOf("FROM (") > 0)
        {
            sQry = sQry.Substring(sQry.IndexOf("FROM ("));
            sQry = "Select Cast(MAX(nsl_value) as numeric(12,3)), Cast(MAX(cl_value) as numeric(12,3))"
                    + ", Cast(MAX(ucl_value) as numeric(12,3)), Cast(MAX(lcl_value) as numeric(12,3))"
                    + ", Cast(MAX(usl_value) as numeric(12,3)), Cast(MAX(lsl_value) as numeric(12,3))"
                    + ", Cast(MAX(value) as numeric(12,3)), Cast(MIN(value) as numeric(12,3)) "
                    + ", MAX(ucl_rate), MAX(lcl_rate)"
                    + sQry;
            int nPos = sQry.LastIndexOf("ORDER BY");
            if (nPos > 0) sQry = sQry.Substring(0, nPos);
            sQry = sQry.Replace("CHART-", "LINE-");


            if (sQry.IndexOf(@"'IM'", 0) > 0) ctlChart_1.Titles[0].Text = "I-bar Chart";
            else ctlChart_1.Titles[0].Text = "X-bar Chart";

            cUpdate objUpdate = new cUpdate();
            objUpdate.initialize(false);
            //objUpdate.beginTran();

            double[] nVal = { 0.0, 1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0 };
            objUpdate.objDr = (new cDBQuery(ruleQuery.INLINE, sQry)).retrieveQuery(objUpdate.objCmd);
            if (objUpdate.objDr.Read() && !Convert.IsDBNull(objUpdate.objDr[0]))
            {
                for (int i = 0; i < nVal.Length; i++)
                    nVal[i] = Convert.ToDouble(objUpdate.objDr[i]);
            }

            objUpdate.objDr.Close();
            //objUpdate.close(doTransaction.COMMIT);
            objUpdate.release();

            DevExpress.XtraCharts.XYDiagram jj = (DevExpress.XtraCharts.XYDiagram)ctlChart_1.Diagram;
            jj.AxisY.Range.MinValue = -999999.0;
            jj.AxisY.Range.MaxValue = +999999.0;

            // 0:nsl, 1:cl, 2:ucl, 3:lcl, 4:usl, 5:lsl, 6:max, 7:min
            double nMaxVal = getMaxValue(nVal, 8);
            double nMinVal = getMinValue(nVal, 8);
            if (nMinVal == nVal[5])
                jj.AxisY.Range.MinValue = nMinVal - (nMaxVal - nMinVal) / 4;
            else
                jj.AxisY.Range.MinValue = nMinVal;

            jj.AxisY.Range.MaxValue = nMaxVal + (nMaxVal - nMinVal) / 4;
            jj.AxisY.ConstantLines[0].AxisValue = nVal[2];  //UCL
            jj.AxisY.ConstantLines[1].AxisValue = nVal[1];  //CL
            jj.AxisY.ConstantLines[2].AxisValue = nVal[3];  //LCL
            jj.AxisY.ConstantLines[3].AxisValue = nVal[4];  //USL
            jj.AxisY.ConstantLines[4].AxisValue = nVal[5];  //LSL

            //UCL nVal[0]
            if (nVal[8] == 0.0)
                jj.AxisY.ConstantLines[0].AxisValue = nVal[2];
            else
                jj.AxisY.ConstantLines[0].AxisValue = nVal[1] + (nVal[4] - nVal[1]) * nVal[8] / 100.0;

            //LCL nVal[2]
            if (nVal[9] == 0.0)
                jj.AxisY.ConstantLines[2].AxisValue = nVal[3];
            else
                jj.AxisY.ConstantLines[2].AxisValue = nVal[1] - (nVal[1] - nVal[5]) * nVal[9] / 100.0;
        }

    }

    private double getMaxValue(double[] nVal, int _cnt)
    {
        double nTemp = -99999.0;
        for (int i = 0; i < _cnt; i++)
            if (nTemp < nVal[i]) nTemp = nVal[i];

        return nTemp;
    }

    private double getMinValue(double[] nVal, int _cnt)
    {
        double nTemp = 99999.0;
        for (int i = 0; i < _cnt; i++)
            if (nTemp > nVal[i]) nTemp = nVal[i];

        return nTemp;
    }

    protected void ctlChart_2_CustomCallback(object sender, DevExpress.XtraCharts.Web.CustomCallbackEventArgs e)
    {
        objChart.bindData(e.Parameter.ToString(), this.ctlDB_2, this.ctlChart_2);

        // Customizing
        // Get CL, UCL, LCL Value
        string sQry = ctlDB_2.SelectCommand;
        if (!string.IsNullOrEmpty(sQry) && sQry.IndexOf("FROM (") > 0)
        {
            sQry = sQry.Substring(sQry.IndexOf("FROM ("));
            sQry = "Select MAX(ucl_value), MAX(cl_value), Cast(MAX(value) as numeric(12,3))" + sQry;
            int nPos = sQry.LastIndexOf("ORDER BY");
            if (nPos > 0) sQry = sQry.Substring(0, nPos);
            sQry = sQry.Replace("CHART-", "LINE-");

            cUpdate objUpdate = new cUpdate();
            objUpdate.initialize(false);
            //objUpdate.beginTran();

            double[] nVal = { 1.0, 0.0, 0.0 };
            objUpdate.objDr = (new cDBQuery(ruleQuery.INLINE, sQry)).retrieveQuery(objUpdate.objCmd);
            if (objUpdate.objDr.Read() && !Convert.IsDBNull(objUpdate.objDr[0]))
            {
                nVal[0] = Convert.ToDouble(objUpdate.objDr[0]);
                nVal[1] = Convert.ToDouble(objUpdate.objDr[1]);
                nVal[2] = Convert.ToDouble(objUpdate.objDr[2]);
            }

            objUpdate.objDr.Close();
            //objUpdate.close(doTransaction.COMMIT);
            objUpdate.release();

            DevExpress.XtraCharts.XYDiagram jj = (DevExpress.XtraCharts.XYDiagram)ctlChart_2.Diagram;
            jj.AxisY.Range.MinValue = -999999.0;
            jj.AxisY.Range.MaxValue = +999999.0;
            jj.AxisY.Range.MinValue = nVal[1] - Math.Abs(nVal[0] - nVal[1]);

            if (nVal[2] > nVal[0] + Math.Abs(nVal[0] - nVal[1]))
                jj.AxisY.Range.MaxValue = nVal[2];
            else
                jj.AxisY.Range.MaxValue = nVal[0] + Math.Abs(nVal[0] - nVal[1]);

            jj.AxisY.ConstantLines[0].AxisValue = nVal[0];
            jj.AxisY.ConstantLines[1].AxisValue = nVal[1];

        }
    }

    protected void ctlChart_3_CustomCallback(object sender, DevExpress.XtraCharts.Web.CustomCallbackEventArgs e)
    {
        objChart.bindData( e.Parameter.ToString(), this.ctlDB_3, this.ctlChart_3);

        // Customizing
        // Get CL, UCL, LCL Value
        string sQry = ctlDB_3.SelectCommand;
        if (!string.IsNullOrEmpty(sQry) && sQry.IndexOf("From dbo.fn_getDataSPC") > 0)
        {
            sQry = sQry.Substring(sQry.IndexOf("From dbo.fn_getDataSPC"));
            sQry = "Select Min(cast(str00 as numeric(18,3))), Max(cast(str00 as numeric(18,3)))"
                + ", MAX(val02), MAX(case when seq = 108 then cast(str00 as numeric(18,3)) else 0 end ), MAX(val04), MAX(val09) "
                + sQry;
            int nPos = sQry.LastIndexOf("ORDER BY");
            if (nPos > 0) sQry = sQry.Substring(0, nPos);


            cUpdate objUpdate = new cUpdate();
            objUpdate.initialize(false);
            double[] nVal = { 1.0, 15.0, 3.0, 8.0, 13.0, 20.0 };
            objUpdate.objDr = (new cDBQuery(ruleQuery.INLINE, sQry)).retrieveQuery(objUpdate.objCmd);
            if (objUpdate.objDr.Read() && !Convert.IsDBNull(objUpdate.objDr[0]))
            {
                nVal[0] = Convert.ToDouble(objUpdate.objDr[0]);
                nVal[1] = Convert.ToDouble(objUpdate.objDr[1]);
                nVal[2] = Convert.ToDouble(objUpdate.objDr[2]);
                nVal[3] = Convert.ToDouble(objUpdate.objDr[3]);
                nVal[4] = Convert.ToDouble(objUpdate.objDr[4]);
                nVal[5] = Convert.ToDouble(objUpdate.objDr[5]);
            }

            objUpdate.objDr.Close();
            objUpdate.release();

            DevExpress.XtraCharts.XYDiagram jj = (DevExpress.XtraCharts.XYDiagram)ctlChart_3.Diagram;
            //jj.AxisX.Range.MinValue = -999999.0;
            //jj.AxisX.Range.MaxValue = +999999.0;
            //jj.AxisX.Range.MinValue = string.Format("{0:#0.000}", nVal[0]);
            //jj.AxisX.Range.MaxValue = string.Format("{0:#0.000}", nVal[1]);
            jj.AxisX.ConstantLines[0].AxisValue = string.Format("{0:#0.000}", nVal[2]);  //USL
            jj.AxisX.ConstantLines[1].AxisValue = string.Format("{0:#0.000}", nVal[3]);  //NSL
            jj.AxisX.ConstantLines[2].AxisValue = string.Format("{0:#0.000}", nVal[4]);  //LSL

            jj.AxisY.Range.MinValue = 0.0;
            jj.AxisY.Range.MaxValue = +999999.0;
            jj.AxisY.Range.MinValue = 0;
            jj.AxisY.Range.MaxValue = nVal[5] + nVal[5] * 0.1;

        }
    }

}


