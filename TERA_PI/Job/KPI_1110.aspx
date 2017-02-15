<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Control_7.master" AutoEventWireup="true"
    CodeFile="KPI_1110.aspx.cs" Inherits="JOB_KPI_1110" %>

<%@ Register Assembly="DevExpress.XtraCharts.v15.1.Web, Version=15.1.4.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a"
    Namespace="DevExpress.XtraCharts.Web" TagPrefix="dxchartsui" %>
<%@ Register Assembly="DevExpress.XtraCharts.v15.1, Version=15.1.4.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a"
    Namespace="DevExpress.XtraCharts" TagPrefix="cc1" %>
<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/KPI.1110.js" type="text/javascript"></script>
    <script type="text/javascript">

        $(function () {

            gw_job_process.ready();

        });
        
    </script>
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderID="objContentOption" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentMenu" runat="Server">
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td width="800">
                <form id="frmOption2" action="">
                </form>
                <div id="lyrRemark2">
                </div>
            </td>
            <td width="" align="right">
                <div id="lyrMenu">
                </div>
            </td>
        </tr>
    </table>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="objContentToggle" runat="Server">
    <form id="frmOption" action="">
    </form>
</asp:Content>
<asp:Content ID="Content7" ContentPlaceHolderID="objContentRemark" runat="Server">
    <div id="lyrRemark">
    </div>
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="objContentControl" runat="Server">
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td width="480">
                <div id="lyrChart_1">
                    <dxchartsui:WebChartControl ID="ctlChart_1" runat="server" Height="350px" Width="467px"
                        ClientInstanceName="ctlChart_1" DataSourceID="ctlDB" OnCustomCallback="ctlChart_1_CustomCallback"
                        ClientVisible="False">
                        <SeriesSerializable>
                            <cc1:Series ArgumentDataMember="category" Name="Series 1" 
                                ValueDataMembersSerializable="value" SynchronizePointOptions="False" LabelsVisibility="True">
                                <viewserializable>
                                    <cc1:RadarAreaSeriesView>
                                    </cc1:RadarAreaSeriesView>
                                </viewserializable>
                            </cc1:Series>
                        </SeriesSerializable>
                        <DiagramSerializable>
                            <cc1:RadarDiagram RotationDirection="Clockwise" DrawingStyle="Polygon">
                            </cc1:RadarDiagram>
                        </DiagramSerializable>
                        <titles>
                            <cc1:ChartTitle Alignment="Near" Font="굴림체, 14pt, style=Bold" Text="" Visibility="True" WordWrap="True" />
                        </titles>
                        <legend visibility="False"></legend>
                        <ClientSideEvents ObjectSelected="function(s, e) { processClientObjectSelected(s, e); }" objecthottracked="function(s, e) {	processClientObjectHotTracked(s, e); }"></ClientSideEvents>
                    </dxchartsui:WebChartControl>
                </div>
            </td>
            <td width="">
                <div id="lyrChart_2">
                    <dxchartsui:WebChartControl ID="ctlChart_2" runat="server" Height="350px" Width="676px"
                        ClientInstanceName="ctlChart_2" DataSourceID="ctlDB" OnCustomCallback="ctlChart_2_CustomCallback"
                        ClientVisible="False" CrosshairEnabled="True" AutoLayout="True" ToolTipEnabled="False">
                        <SeriesSerializable>
                            <cc1:Series Name="Series 1" SynchronizePointOptions="False" ArgumentDataMember="category" ValueDataMembersSerializable="value">
                                <viewserializable>
                                    <cc1:StackedBarSeriesView></cc1:StackedBarSeriesView>
                                </viewserializable>
                                <labelserializable>
                                    <cc1:StackedBarSeriesLabel Font="굴림체, 8pt">
                                    </cc1:StackedBarSeriesLabel>
                                </labelserializable>
                            </cc1:Series>
                            <cc1:Series Name="Series 2" SynchronizePointOptions="False" ArgumentDataMember="category" ValueDataMembersSerializable="value" Visible="False">
                                <viewserializable>
                                    <cc1:StackedBarSeriesView></cc1:StackedBarSeriesView>
                                </viewserializable>
                                <labelserializable>
                                    <cc1:StackedBarSeriesLabel Font="굴림체, 8pt">
                                    </cc1:StackedBarSeriesLabel>
                                </labelserializable>
                            </cc1:Series>
                            <cc1:Series Name="Series 3" SynchronizePointOptions="False" ArgumentDataMember="category" ValueDataMembersSerializable="value" Visible="False">
                                <viewserializable>
                                    <cc1:StackedBarSeriesView>
                                    </cc1:StackedBarSeriesView>
                                </viewserializable>
                                <labelserializable>
                                    <cc1:StackedBarSeriesLabel Font="굴림체, 8pt">
                                    </cc1:StackedBarSeriesLabel>
                                </labelserializable>
                            </cc1:Series>
                        </SeriesSerializable>
                        <DiagramSerializable>
                            <cc1:XYDiagram>
                                <AxisY VisibleInPanesSerializable="-1">
                                    <label font="굴림체, 8pt"></label>
                                    <Range ScrollingRange-MinValueSerializable="0" ScrollingRange-MaxValueSerializable="300" ScrollingRange-SideMarginsEnabled="False"></Range>
                                    <VisualRange AutoSideMargins="False" maxvalueserializable="300"></VisualRange>
                                    <WholeRange Auto="False" MinValueSerializable="0" MaxValueSerializable="300" AutoSideMargins="False"></WholeRange>
                                    <numericscaleoptions autogrid="False" gridspacing="30" />
                                </AxisY>
                            </cc1:XYDiagram>
                        </DiagramSerializable>
                        <seriestemplate argumentdatamember="category">
                            <labelserializable>
                                <cc1:SideBySideBarSeriesLabel Font="굴림체, 8pt">
                                </cc1:SideBySideBarSeriesLabel>
                            </labelserializable>
                        </seriestemplate>
                        <titles>
                            <cc1:ChartTitle Font="굴림체, 14pt, style=Bold" Text="" Visibility="True" WordWrap="True" />
                        </titles>
                        <legend visibility="False" alignmenthorizontal="Right" alignmentvertical="TopOutside" direction="LeftToRight" font="굴림체, 8pt"></legend>
                        <ClientSideEvents ObjectSelected="function(s, e) { processClientObjectSelected(s, e); }" objecthottracked="function(s, e) {	processClientObjectHotTracked(s, e); }"></ClientSideEvents>
                    </dxchartsui:WebChartControl>        
                </div>
            </td>
        </tr>
        <tr><td colspan="2">&nbsp;</td></tr>
        <tr>
            <td>
                <div id="grdList_1"></div>
            </td>
            <td>
                <div id="grdList_2"></div>
            </td>
        </tr>
    </table>
    <asp:SqlDataSource ID="ctlDB" runat="server" ConnectionString="<%$ ConnectionStrings:PLMDB %>">
    </asp:SqlDataSource>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="objContentData" runat="Server">
</asp:Content>
