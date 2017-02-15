using DevExpress.XtraCharts;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Web;

public partial class JOB_KPI_1110 : System.Web.UI.Page
{
    cChart objChart;

    protected void Page_Load(object sender, EventArgs e)
    {
        //DevExpress.Utils.AppearanceObject.DefaultFont = new System.Drawing.Font("굴림체", 8);
        objChart = new cChart();
    }
    protected void ctlChart_1_CustomCallback(object sender, DevExpress.XtraCharts.Web.CustomCallbackEventArgs e)
    {
        System.Collections.Specialized.NameValueCollection param = HttpUtility.ParseQueryString(e.Parameter.ToString());
        string title = param["arg_ymd_to"];
        try
        {
            if (!string.IsNullOrEmpty(title) && this.ctlChart_1.Titles.Count > 0)
                title = string.Format("{0}년 {1}월", title.Substring(0, 4), Convert.ToInt16(title.Substring(4, 2)).ToString());
            else
                title = "품질지수";
        } catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            title = "품질지수";
        }
        this.ctlChart_1.Titles[0].Text = title;
        objChart.bindData(
            e.Parameter.ToString(),
            this.ctlDB,
            this.ctlChart_1);
    }
    protected void ctlChart_2_CustomCallback(object sender, DevExpress.XtraCharts.Web.CustomCallbackEventArgs e)
    {
        System.Collections.Specialized.NameValueCollection param = HttpUtility.ParseQueryString(e.Parameter.ToString());
        string title = string.Format("{0} 월별 달성율 추이", HttpUtility.UrlDecode(param["arg_kpi_group_nm"]));
        if (!string.IsNullOrEmpty(title) && this.ctlChart_2.Titles.Count > 0)
            this.ctlChart_2.Titles[0].Text = title;

        string kpi_group = param["arg_kpi_group"];
        string ymd_fr = param["arg_ymd_fr"];
        string ymd_to = param["arg_ymd_to"];
        List<KPIItem> item = getKPIItemInfo(kpi_group, ymd_fr, ymd_to);
        if (item.Count < 1) return;

        int i = 0;
        foreach (Series s in this.ctlChart_2.Series)
        {
            s.DataFilters.Clear();
            DataFilter f1 = new DataFilter();
            f1.ColumnName = "series";
            f1.Condition = DataFilterCondition.Equal;

            if (item.Count < i + 1)
            {
                s.Visible = false;
            }
            else
            {
                s.Visible = true;
                s.Name = item[i].kpi_name;
                s.LegendText = item[i].kpi_name;
                s.ShowInLegend = true;
                f1.Value = item[i].kpi_item;
            }
            s.DataFilters.Add(f1);
            i++;
        }
        //((XYDiagram)ctlChart_2.Diagram).AxisY.Range.SetMinMaxValues(0, item.Count * 100);
        ((XYDiagram)ctlChart_2.Diagram).AxisY.WholeRange.SetMinMaxValues(0, item.Count * 100);
        ((XYDiagram)ctlChart_2.Diagram).AxisY.VisualRange.SetMinMaxValues(0, item.Count * 100);
        ((XYDiagram)ctlChart_2.Diagram).AxisY.NumericScaleOptions.GridSpacing = (item.Count == 3 ? 30 : 20);

        objChart.bindData(
            e.Parameter.ToString(),
            this.ctlDB,
            this.ctlChart_2);

        this.ctlChart_2.Legend.Visibility = DevExpress.Utils.DefaultBoolean.True;

        foreach (Series s in this.ctlChart_2.Series)
        {
            ((BarSeriesView)s.View).Transparency = objChart.transparancy;
        }
    }
    protected List<KPIItem> getKPIItemInfo(string kpi_group, string ymd_fr, string ymd_to)
    {
        List<KPIItem> row = new List<KPIItem>();
        using (SqlConnection objCon = new SqlConnection(ConfigurationManager.ConnectionStrings["PLMDB"].ConnectionString))
        {
            objCon.Open();
            string sSQL = string.Format("SELECT A.KPI_ITEM\n"
                                      + "     , MAX(A.KPI_NAME) AS KPI_NAME\n"
                                      + "     , MAX(A.VAL_UNIT) AS VAL_UNIT\n"
                                      + "     , MAX(A.UNIT_TEXT) AS UNIT_TEXT\n"
                                      + "     , MAX(A.SORT_SEQ) AS SORT_SEQ\n"
                                      + "  FROM KPI_ITEM A\n"
                                      + " WHERE A.KPI_GROUP = '{0}'\n"
                                      + "   AND EXISTS (SELECT 1 FROM KPI_DATA WHERE KPI_ITEM = A.KPI_ITEM AND KPI_DATE BETWEEN '{1}01' AND '{2}31')\n"
                                      + "GROUP BY A.KPI_ITEM\n"
                                      + "ORDER BY SORT_SEQ", kpi_group, ymd_fr, ymd_to);
            using (SqlDataReader objDr = (new cDBQuery(ruleQuery.INLINE, sSQL)).retrieveQuery(objCon))
            {
                while (objDr.Read())
                {
                    row.Add(new KPIItem
                    {
                        kpi_item = objDr["kpi_item"].ToString(),
                        kpi_name = objDr["kpi_name"].ToString(),
                        val_unit = objDr["val_unit"].ToString(),
                        unit_text = objDr["unit_text"].ToString(),
                        sort_seq = objDr["sort_seq"].ToString()
                    });
                }
            }
            objCon.Close();
        }
        return row;
    }
    public class KPIItem
    {
        public string kpi_item { get; set; }
        public string kpi_name { get; set; }
        public string val_unit { get; set; }
        public string unit_text { get; set; }
        public string sort_seq { get; set; }
    }
}


