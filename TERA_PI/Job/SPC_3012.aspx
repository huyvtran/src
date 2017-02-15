<%@ Page Title="" Language="C#" MasterPageFile="~/Master/BasePage_SPC3.master" AutoEventWireup="true"
    CodeFile="SPC_3012.aspx.cs" Inherits="JOB_SPC_3012" %>

<%@ Register Assembly="DevExpress.XtraCharts.v15.1.Web, Version=15.1.4.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a"
    Namespace="DevExpress.XtraCharts.Web" TagPrefix="dxchartsui" %>
<%@ Register Assembly="DevExpress.XtraCharts.v15.1, Version=15.1.4.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a"
    Namespace="DevExpress.XtraCharts" TagPrefix="cc1" %>
<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/SPC.3010.js" type="text/javascript"></script>
    <script type="text/javascript">

        $(function () {

            gw_job_process.ready();

        });
        
    </script>
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderID="objContentOption" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentMenu" runat="Server">
    <div id="lyrMenu">
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="objContentToggle" runat="Server">
    <form id="frmOption" action="">
    </form>
</asp:Content>
<asp:Content ID="Content7" ContentPlaceHolderID="objContentRemark" runat="Server">
    <div id="lyrRemark">
    </div>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="objContentData_1" runat="Server">
    <div id="grdData_현황" style="height: 250px; width: 100%">
    </div>
</asp:Content>
<asp:Content ID="Content8" ContentPlaceHolderID="objContentData_2" runat="Server">
    <div id="grdData_상세현황" style="height: 550px; width: 100%">
    </div>
</asp:Content>
<asp:Content ID="Content9" ContentPlaceHolderID="objContentData_3" runat="Server">
    <div id="grdData_Detail" style="height: 550px; width: 800px">
    </div>
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="objContentControl_1" runat="Server">
    <div id="lyrChart_통계">
        <dxchartsui:WebChartControl ID="ctlChart_1" runat="server" Height="250px" Width="800px"
            ClientInstanceName="ctlChart_1" DataSourceID="ctlDB_1" 
            OnCustomCallback="ctlChart_1_CustomCallback" SeriesDataMember="series" 
            PaletteName="Palette 1" ClientVisible="False">
            <DiagramSerializable>
                <cc1:XYDiagram PaneDistance="2">
                    <axisx visibleinpanesserializable="-1">
                        <tickmarks minorvisible="False" />
                        <range auto="False" maxvalueserializable="25" minvalueserializable="1" 
                            sidemarginsenabled="True" />
<Tickmarks MinorVisible="False"></Tickmarks>

<Range Auto="False" MinValueSerializable="1" MaxValueSerializable="25" SideMarginsEnabled="True"></Range>
                    </axisx>
                    <axisy visibleinpanesserializable="-1">
                        <constantlines>
                            <cc1:ConstantLine AxisValueSerializable="1.2" Color="DarkGreen" LegendText="CL" 
                                Name="Constant Line UCL" ShowBehind="True" Title-Text="UCL" 
                                Title-Alignment="Far">
                            </cc1:ConstantLine>
                            <cc1:ConstantLine AxisValueSerializable="1" Color="Blue" LegendText="CL" 
                                Name="Constant Line CL" Title-Text="CL">
                                <linestyle dashstyle="Dash" thickness="2" />
<LineStyle Thickness="2" DashStyle="Dash"></LineStyle>
                            </cc1:ConstantLine>
                            <cc1:ConstantLine AxisValueSerializable="0.8" Color="DarkGreen" LegendText="LCL" 
                                Name="Constant Line LCL" Title-Text="LCL" Title-Alignment="Far">
                            </cc1:ConstantLine>
                            <cc1:ConstantLine AxisValueSerializable="1.4" Name="Constant Line USL" 
                                Title-Text="USL" Color="Red">
                                <linestyle dashstyle="Solid" thickness="2" />
<LineStyle Thickness="2" DashStyle="Solid"></LineStyle>
                            </cc1:ConstantLine>
                            <cc1:ConstantLine AxisValueSerializable="0.6" Name="Constant Line LSL" 
                                Title-Text="LSL" Color="Red">
                                <linestyle dashstyle="Solid" thickness="2" />
<LineStyle Thickness="2" DashStyle="Solid"></LineStyle>
                            </cc1:ConstantLine>
                        </constantlines>
                        <range auto="False" maxvalueserializable="2" minvalueserializable="0" 
                            sidemarginsenabled="True" />

<Range Auto="False" MinValueSerializable="0" MaxValueSerializable="2" SideMarginsEnabled="True"></Range>
                    </axisy>
                </cc1:XYDiagram>
</DiagramSerializable>

<FillStyle><OptionsSerializable>
<cc1:SolidFillOptions></cc1:SolidFillOptions>
</OptionsSerializable>
</FillStyle>

            <legend visibility="False"></legend>

            <seriestemplate argumentdatamember="category" valuedatamembersserializable="value">
                <ViewSerializable>

<cc1:LineSeriesView><linemarkeroptions color="DarkRed" size="12"></linemarkeroptions></cc1:LineSeriesView></ViewSerializable>
                <labelserializable>
                    <cc1:PointSeriesLabel LineVisible="True" Visible="False">
                        <fillstyle>
                            <optionsserializable>
                                <cc1:SolidFillOptions />
                            </optionsserializable>
                        </fillstyle>
                    </cc1:PointSeriesLabel>
                </labelserializable>
<PointOptionsSerializable>
<cc1:PointOptions></cc1:PointOptions>
</PointOptionsSerializable>
<LegendPointOptionsSerializable>
<cc1:PointOptions></cc1:PointOptions>
</LegendPointOptionsSerializable>
            </seriestemplate>
            <titles>
                <cc1:ChartTitle Text="Xbar Chart" />
            </titles>
            <palettewrappers>
                <dxchartsui:PaletteWrapper Name="Palette 1" ScaleMode="Repeat">
                    <palette>
                        <cc1:PaletteEntry Color="255, 128, 0" Color2="255, 128, 0" />
                    </palette>
                </dxchartsui:PaletteWrapper>
            </palettewrappers>
<ClientSideEvents ObjectSelected="function Chart1Selected(s, e) {
	processClientObjectSelected(s, e);
}
">
</ClientSideEvents>
        </dxchartsui:WebChartControl>
        <asp:SqlDataSource ID="ctlDB_1" runat="server" ConnectionString="<%$ ConnectionStrings:PLMDB %>">
        </asp:SqlDataSource>
    </div>
</asp:Content>
<asp:Content ID="Content10" ContentPlaceHolderID="objContentControl_2" runat="Server">
    <div id="lyrChart_통계2">
        <dxchartsui:WebChartControl ID="ctlChart_2" runat="server" Height="250px" Width="800px"
            ClientInstanceName="ctlChart_2" DataSourceID="ctlDB_2" OnCustomCallback="ctlChart_2_CustomCallback"
            ClientVisible="False" SeriesDataMember="series" PaletteName="Palette 1">
            <DiagramSerializable>
<cc1:XYDiagram>
<AxisX VisibleInPanesSerializable="-1">
    <tickmarks minorvisible="False" />
<Tickmarks MinorVisible="False"></Tickmarks>

<Range SideMarginsEnabled="True" auto="False" maxvalueserializable="25" 
        minvalueserializable="1"></Range>
</AxisX>

<AxisY VisibleInPanesSerializable="-1">
    <constantlines>
        <cc1:ConstantLine AxisValueSerializable="0.16" Color="DarkGreen" LegendText="UCL" 
            Name="Constant Line UCL" Title-Text="UCL">
            <linestyle thickness="2" />
<LineStyle Thickness="2"></LineStyle>
        </cc1:ConstantLine>
        <cc1:ConstantLine AxisValueSerializable="0.08" Color="Blue" LegendText="CL" 
            Name="Constant Line CL" Title-Text="CL">
            <linestyle dashstyle="Dash" thickness="2" />
<LineStyle DashStyle="Dash" Thickness="2"></LineStyle>
        </cc1:ConstantLine>
    </constantlines>
<Range SideMarginsEnabled="True" auto="False" maxvalueserializable="0.18" 
        minvalueserializable="0"></Range>
</AxisY>
</cc1:XYDiagram>
</DiagramSerializable>

<FillStyle><OptionsSerializable>
<cc1:SolidFillOptions></cc1:SolidFillOptions>
</OptionsSerializable>
</FillStyle>

            <legend visibility="False"></legend>

            <seriestemplate argumentdatamember="category" valuedatamembersserializable="value">
                <ViewSerializable>
                    <cc1:LineSeriesView>
                        <linemarkeroptions color="Red" kind="Pentagon" size="12">
                        </linemarkeroptions>
                    </cc1:LineSeriesView>
</ViewSerializable>
<LabelSerializable>
    <cc1:PointSeriesLabel LineVisible="True" Visible="False">
        <fillstyle>
            <optionsserializable>
                <cc1:SolidFillOptions />
            </optionsserializable>
        </fillstyle>
    </cc1:PointSeriesLabel>
</LabelSerializable>
<PointOptionsSerializable>
<cc1:PointOptions></cc1:PointOptions>
</PointOptionsSerializable>
<LegendPointOptionsSerializable>
<cc1:PointOptions></cc1:PointOptions>
</LegendPointOptionsSerializable>
            </seriestemplate>
            <titles>
                <cc1:ChartTitle Text="R Chart" />
                <cc1:ChartTitle Alignment="Far" Font="Tahoma, 9.75pt" Text="최대값-최소값 (R)범위" />
            </titles>
            <palettewrappers>
                <dxchartsui:PaletteWrapper Name="Palette 1" ScaleMode="Repeat">
                    <palette>
                        <cc1:PaletteEntry Color="Olive" Color2="Olive" />
                    </palette>
                </dxchartsui:PaletteWrapper>
            </palettewrappers>
            <clientsideevents objectselected="function(s, e) {
	processClientObjectSelected(s, e);
}" />

<ClientSideEvents ObjectSelected="function(s, e) {
	processClientObjectSelected(s, e);
}"></ClientSideEvents>
        </dxchartsui:WebChartControl>
        <asp:SqlDataSource ID="ctlDB_2" runat="server" ConnectionString="<%$ ConnectionStrings:PLMDB %>">
        </asp:SqlDataSource>
    </div>
</asp:Content>
<%--협력사 : Width="346px"--%>    
<asp:Content ID="Content11" runat="server" contentplaceholderid="objContentControl_3">
    <div id="lyrChart_통계3">
        <dxchartsui:WebChartControl ID="ctlChart_3" runat="server" Height="250px" Width="330px"
            ClientInstanceName="ctlChart_3" DataSourceID="ctlDB_3" OnCustomCallback="ctlChart_3_CustomCallback"
            ClientVisible="False" SeriesDataMember="series" PaletteName="Office">
            <DiagramSerializable>
                <cc1:XYDiagram PaneDistance="2">
                    <axisx visibleinpanesserializable="-1">
                        <tickmarks minorvisible="False" />
                        <range auto="False" maxvalueserializable="25" minvalueserializable="1" 
                            sidemarginsenabled="True" />
<Tickmarks MinorVisible="False"></Tickmarks>

                        <constantlines>
                            <cc1:ConstantLine AxisValueSerializable="A" Color="Red" LegendText="USL" 
                                Name="Constant Line USL" Title-Text="LSL">
                                <linestyle dashstyle="Solid" />
<LineStyle DashStyle="Solid"></LineStyle>
                            </cc1:ConstantLine>
                            <cc1:ConstantLine AxisValueSerializable="C" Color="Blue" 
                                Name="Constant Line SL" Title-Text="Norminal" Title-Visible="False">
                                <linestyle dashstyle="Dash" />
<LineStyle DashStyle="Dash"></LineStyle>
                            </cc1:ConstantLine>
                            <cc1:ConstantLine AxisValueSerializable="E" Color="Red" 
                                Name="Constant Line LSL" Title-Text="USL">
                                <linestyle dashstyle="Solid" />
<LineStyle DashStyle="Solid"></LineStyle>
                            </cc1:ConstantLine>
                        </constantlines>
                        <label angle="270" />

<Label Angle="270"></Label>

<Range SideMarginsEnabled="True"></Range>
                    </axisx>
                    <axisy visibleinpanesserializable="-1">
                        <range auto="False" maxvalueserializable="2" minvalueserializable="0" 
                            sidemarginsenabled="True" />

<Range SideMarginsEnabled="True"></Range>
                    </axisy>
                </cc1:XYDiagram>
</DiagramSerializable>

<FillStyle><OptionsSerializable>
<cc1:SolidFillOptions></cc1:SolidFillOptions>
</OptionsSerializable>
</FillStyle>

            <legend visibility="False"></legend>

            <seriestemplate argumentdatamember="category" valuedatamembersserializable="value">
                <ViewSerializable>

                    <cc1:SplineSeriesView>
                        <linemarkeroptions color="DarkRed" size="4" />
                    </cc1:SplineSeriesView>
                </ViewSerializable>
                <labelserializable>
                    <cc1:PointSeriesLabel LineVisible="True" Visible="False">
                        <fillstyle>
                            <optionsserializable>
                                <cc1:SolidFillOptions />
                            </optionsserializable>
                        </fillstyle>
                    </cc1:PointSeriesLabel>
                </labelserializable>
<PointOptionsSerializable>
<cc1:PointOptions></cc1:PointOptions>
</PointOptionsSerializable>
<LegendPointOptionsSerializable>
<cc1:PointOptions></cc1:PointOptions>
</LegendPointOptionsSerializable>
            </seriestemplate>
            <titles>
                <cc1:ChartTitle Text="정규분포도" />
            </titles>
        </dxchartsui:WebChartControl>
        <asp:SqlDataSource ID="ctlDB_3" runat="server" ConnectionString="<%$ ConnectionStrings:PLMDB %>">
        </asp:SqlDataSource>
    </div>
</asp:Content>

