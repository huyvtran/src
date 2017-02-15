using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using DevExpress.XtraCharts;
using System.Web.Script.Serialization;

public partial class JOB_KPI_1120 : System.Web.UI.Page
{
    cChart objChart;

    protected void Page_Load(object sender, EventArgs e)
    {
        objChart = new cChart();
    }
    protected void ctlChart_1_CustomCallback(object sender, DevExpress.XtraCharts.Web.CustomCallbackEventArgs e)
    {
        this.ctlChart_1.Series[0].DataFilters.Clear();
        this.ctlChart_1.Series[0].DataFilters.Add(new DataFilter("inf01", "System.Int32", DataFilterCondition.Equal, "MAIN"));
        objChart.bindData(
            e.Parameter.ToString(),
            this.ctlDB,
            this.ctlChart_1);
    }
    protected void ctlChart_2_CustomCallback(object sender, DevExpress.XtraCharts.Web.CustomCallbackEventArgs e)
    {
        this.ctlChart_2.Series[0].DataFilters.Clear();
        this.ctlChart_2.Series[0].DataFilters.Add(new DataFilter("inf01", "System.Int32", DataFilterCondition.Equal, "MAIN"));
        this.ctlChart_2.Series[1].DataFilters.Clear();
        this.ctlChart_2.Series[1].DataFilters.Add(new DataFilter("inf01", "System.Int32", DataFilterCondition.Equal, "MONTHLY"));
        this.ctlChart_2.Series[1].DataFilters.Add(new DataFilter("inf02", "System.Int32", DataFilterCondition.Equal, "구매 품질"));
        objChart.bindData(
            e.Parameter.ToString(),
            this.ctlDB,
            this.ctlChart_2);
    }
    protected void ctlChart_3_CustomCallback(object sender, DevExpress.XtraCharts.Web.CustomCallbackEventArgs e)
    {
        System.Collections.Specialized.NameValueCollection param = HttpUtility.ParseQueryString(e.Parameter.ToString());
        string title = param["arg_tp"];

        if (!string.IsNullOrEmpty(title) && this.ctlChart_3.Titles.Count > 0)
            this.ctlChart_3.Titles[0].Text = title;

        objChart.bindData(
            e.Parameter.ToString(),
            this.ctlDB,
            this.ctlChart_3);
    }
}


