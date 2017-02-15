using DevExpress.XtraCharts;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Configuration;
using System.Data.SqlClient;
using System.Web;

public partial class JOB_KPI_1111 : System.Web.UI.Page
{
    cChart objChart;

    protected void Page_Load(object sender, EventArgs e)
    {
        objChart = new cChart();
    }

    protected void ctlChart_1_CustomCallback(object sender, DevExpress.XtraCharts.Web.CustomCallbackEventArgs e)
    {
        NameValueCollection param = HttpUtility.ParseQueryString(e.Parameter.ToString());
        string title = HttpUtility.UrlDecode(param["arg_kpi_group_nm"]);
        if (!string.IsNullOrEmpty(title) && this.ctlChart_1.Titles.Count > 0)
            this.ctlChart_1.Titles[0].Text = title;

        int panes = ((XYDiagram)this.ctlChart_1.Diagram).Panes.Count;

        string kpi_group = param["arg_kpi_group"];
        string date_type = param["arg_date_type"];
        string ymd_fr = param["arg_ymd_fr"];
        string ymd_to = param["arg_ymd_to"];
        List<KPIItem> item = getKPIItemInfo(kpi_group, date_type, ymd_fr, ymd_to);
        if (item.Count < 1) return;

        this.ctlChart_1.Legend.Visibility = DevExpress.Utils.DefaultBoolean.True;

        for (int p = 0; p < ((XYDiagram)this.ctlChart_1.Diagram).Panes.Count + 1; p++)
        {
            if (p < item.Count)
            {
                if (p > 0)
                    ((XYDiagram)this.ctlChart_1.Diagram).Panes[p - 1].Visible = true;
                ((XYDiagram)ctlChart_1.Diagram).SecondaryAxesY[p].Visibility = DevExpress.Utils.DefaultBoolean.True;
                ((XYDiagram)ctlChart_1.Diagram).SecondaryAxesY[p].Title.Visibility = DevExpress.Utils.DefaultBoolean.True;
                ((XYDiagram)ctlChart_1.Diagram).SecondaryAxesY[p].Title.Text = item[p].unit_text;
            }
            else
            {
                if (p > 0)
                    ((XYDiagram)this.ctlChart_1.Diagram).Panes[p - 1].Visible = false;
                ((XYDiagram)ctlChart_1.Diagram).SecondaryAxesY[p].Visibility = DevExpress.Utils.DefaultBoolean.False;
                ((XYDiagram)ctlChart_1.Diagram).SecondaryAxesY[p].Title.Visibility = DevExpress.Utils.DefaultBoolean.False;
            }
        }

        int sn = 0;
        foreach(Series s in this.ctlChart_1.Series)
        {
            s.DataFilters.Clear();
            DataFilter[] f = new DataFilter[2];
            s.DataFiltersConjunctionMode = ConjunctionTypes.And;

            int item_index = Convert.ToInt16(Math.Truncate(Convert.ToDecimal(sn / 2)));
            if (item_index < item.Count)
            {
                s.Visible = true;
                s.Name = item[item_index].kpi_name;
                s.LegendText = item[item_index].kpi_name;
                s.ShowInLegend = sn % 2 == 0 ? true : false;

                f[0] = new DataFilter("series", "System.String", DataFilterCondition.Equal, item[item_index].kpi_name);
                f[1] = new DataFilter("category", "System.String", sn % 2 == 0 ? DataFilterCondition.NotEqual : DataFilterCondition.Equal, "달성율");
                s.DataFilters.AddRange(f);
            }
            else
            {
                s.Visible = false;
            }

            //// 달성율 색상 고정
            //if (sn % 2 != 0)
            //{
            //    s.View.Color = System.Drawing.Color.SlateGray;
            //}

            ((BarSeriesView)s.View).Transparency = objChart.transparancy;
            sn++;
        }
        ((XYDiagram)ctlChart_1.Diagram).AxisY.NumericScaleOptions.GridSpacing = (item.Count == 3 ? 50 : 20);
        NameValueCollection lstParam = objChart.parseData(e.Parameter.ToString());
        this.ctlDB.SelectCommand = objChart.setQuery(lstParam);
        this.ctlChart_1.DataBind();
    }

    protected void ctlChart_1_CustomDrawSeriesPoint(object sender, CustomDrawSeriesPointEventArgs e)
    {
        //// 달성율 색상
        //if (e.Series.SeriesID % 2 != 0)
        //{
        //    double val = e.SeriesPoint.Values[0];
        //    if (val < 80 && val >= 70)
        //        e.SeriesDrawOptions.Color = System.Drawing.Color.Blue;
        //    else if (val < 70)
        //        e.SeriesDrawOptions.Color = System.Drawing.Color.Red;
        //    else
        //        e.SeriesDrawOptions.Color = System.Drawing.Color.Gray;
        //}
    }

    protected void ctlChart_2_CustomCallback(object sender, DevExpress.XtraCharts.Web.CustomCallbackEventArgs e)
    {
        NameValueCollection param = HttpUtility.ParseQueryString(e.Parameter.ToString());
        string date_tp = param["arg_date_type"].Equals("MONTH") ? "월별" : param["arg_date_type"].Equals("WEEK") ? "주별" : "일별";
        string title = string.Format("{0} {1} 추이", HttpUtility.UrlDecode(param["arg_kpi_item_nm"]), date_tp);

        if (!string.IsNullOrEmpty(title) && this.ctlChart_2.Titles.Count > 0)
            this.ctlChart_2.Titles[0].Text = title;

        this.ctlChart_2.Series[0].DataFilters.Clear();
        this.ctlChart_2.Series[1].DataFilters.Clear();
        this.ctlChart_2.Series[0].DataFilters.Add(new DataFilter("series", "System.Int32", DataFilterCondition.Equal, "실적"));
        this.ctlChart_2.Series[1].DataFilters.Add(new DataFilter("series", "System.Int32", DataFilterCondition.Equal, "달성율"));

        objChart.bindData(
            e.Parameter.ToString(),
            this.ctlDB,
            this.ctlChart_2);
    }

    protected void ctlChart_3_CustomCallback(object sender, DevExpress.XtraCharts.Web.CustomCallbackEventArgs e)
    {
        NameValueCollection param = HttpUtility.ParseQueryString(e.Parameter.ToString());
        string title = string.Format("{0} ({1})", HttpUtility.UrlDecode(param["arg_kpi_item_nm"]), param["arg_data_tp_nm"]);
        if (!string.IsNullOrEmpty(title) && this.ctlChart_3.Titles.Count > 0)
            this.ctlChart_3.Titles[0].Text = title;

        objChart.bindData(
            e.Parameter.ToString(),
            this.ctlDB,
            this.ctlChart_3);
    }

    protected void ctlChart_4_CustomCallback(object sender, DevExpress.XtraCharts.Web.CustomCallbackEventArgs e)
    {
        NameValueCollection param = HttpUtility.ParseQueryString(e.Parameter.ToString());
        string title = string.Format("{0} 월별 달성율 추이", HttpUtility.UrlDecode(param["arg_kpi_group_nm"]));
        if (!string.IsNullOrEmpty(title) && this.ctlChart_4.Titles.Count > 0)
            this.ctlChart_4.Titles[0].Text = title;

        string kpi_group = param["arg_kpi_group"];
        string kpi_item = param["arg_kpi_item"];
        string ymd_fr = param["arg_ymd_fr"];
        string ymd_to = param["arg_ymd_to"];
        string data_tp = param["arg_data_tp"];
        string data_fg = param["arg_data_fg"];

        ctlChart_4.Series[0].DataFilters.Add(new DataFilter("data_type", "System.String", DataFilterCondition.Equal, "지적"));
        ctlChart_4.Series[0].DataFilters.Add(new DataFilter("series", "System.String", DataFilterCondition.Equal, "설계팀"));
        ctlChart_4.Series[1].DataFilters.Add(new DataFilter("data_type", "System.String", DataFilterCondition.Equal, "지적"));
        ctlChart_4.Series[1].DataFilters.Add(new DataFilter("series", "System.String", DataFilterCondition.Equal, "제조전장팀"));
        ctlChart_4.Series[2].DataFilters.Add(new DataFilter("data_type", "System.String", DataFilterCondition.Equal, "지적"));
        ctlChart_4.Series[2].DataFilters.Add(new DataFilter("series", "System.String", DataFilterCondition.Equal, "제어팀"));
        ctlChart_4.Series[3].DataFilters.Add(new DataFilter("data_type", "System.String", DataFilterCondition.Equal, "지적"));
        ctlChart_4.Series[3].DataFilters.Add(new DataFilter("series", "System.String", DataFilterCondition.Equal, "제조파트"));
        ctlChart_4.Series[4].DataFilters.Add(new DataFilter("data_type", "System.String", DataFilterCondition.Equal, "조치"));
        ctlChart_4.Series[4].DataFilters.Add(new DataFilter("series", "System.String", DataFilterCondition.Equal, "설계팀"));
        ctlChart_4.Series[5].DataFilters.Add(new DataFilter("data_type", "System.String", DataFilterCondition.Equal, "조치"));
        ctlChart_4.Series[5].DataFilters.Add(new DataFilter("series", "System.String", DataFilterCondition.Equal, "제조전장팀"));
        ctlChart_4.Series[6].DataFilters.Add(new DataFilter("data_type", "System.String", DataFilterCondition.Equal, "조치"));
        ctlChart_4.Series[6].DataFilters.Add(new DataFilter("series", "System.String", DataFilterCondition.Equal, "제어팀"));
        ctlChart_4.Series[7].DataFilters.Add(new DataFilter("data_type", "System.String", DataFilterCondition.Equal, "조치"));
        ctlChart_4.Series[7].DataFilters.Add(new DataFilter("series", "System.String", DataFilterCondition.Equal, "제조파트"));

        ctlChart_4.Series[0].Name = "설계팀";
        ctlChart_4.Series[1].Name = "제조전장팀";
        ctlChart_4.Series[2].Name = "제어팀";
        ctlChart_4.Series[3].Name = "제조파트";
        ctlChart_4.Series[4].Name = "설계팀";
        ctlChart_4.Series[5].Name = "제조전장팀";
        ctlChart_4.Series[6].Name = "제어팀";
        ctlChart_4.Series[7].Name = "제조파트";

        ctlChart_4.Series[0].LegendText = "설계팀";
        ctlChart_4.Series[1].LegendText = "제조전장팀";
        ctlChart_4.Series[2].LegendText = "제어팀";
        ctlChart_4.Series[3].LegendText = "제조파트";

        NameValueCollection lstParam = objChart.parseData(e.Parameter.ToString());
        this.ctlDB.SelectCommand = objChart.setQuery(lstParam);
        this.ctlChart_4.DataBind();

        this.ctlChart_4.Legend.Visibility = DevExpress.Utils.DefaultBoolean.True;

        // 팀별 색상 통일
        PaletteEntry[] palette = ctlChart_4.GetPaletteEntries(ctlChart_4.Series.Count);
        int start = palette.Length / 2;
        for (int i = start; i < palette.Length; i++)
        {
            BarSeriesView view = (BarSeriesView)ctlChart_4.Series[i].View;
            view.Color = palette[i - start].Color;
            view.FillStyle.FillMode = FillMode.Gradient;
            ((GradientFillOptionsBase)view.FillStyle.Options).Color2 = palette[i - start].Color2;
            view.Transparency = objChart.transparancy;
        }
    }

    protected List<KPIItem> getKPIItemInfo(string kpi_group, string date_type, string ymd_fr, string ymd_to)
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
                                      + "   AND EXISTS(SELECT 1 FROM KPI_DATA WHERE KPI_ITEM = A.KPI_ITEM AND KPI_DATE BETWEEN dbo.fn_getKpiDate('{1}', '{2}', 'F') AND dbo.fn_getKpiDate('{1}', '{3}', 'T'))\n"
                                      + "GROUP BY A.KPI_ITEM\n"
                                      + "ORDER BY SORT_SEQ", kpi_group, date_type, ymd_fr, ymd_to);
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


