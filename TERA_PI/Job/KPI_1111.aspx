<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Control_7.master" AutoEventWireup="true"
    CodeFile="KPI_1111.aspx.cs" Inherits="JOB_KPI_1111" %>

<%@ Register Assembly="DevExpress.XtraCharts.v15.1.Web, Version=15.1.4.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a"
    Namespace="DevExpress.XtraCharts.Web" TagPrefix="dxchartsui" %>
<%@ Register Assembly="DevExpress.XtraCharts.v15.1, Version=15.1.4.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a"
    Namespace="DevExpress.XtraCharts" TagPrefix="cc1" %>
<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/KPI.1111.js" type="text/javascript"></script>
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
            <td width="520">
                <div id="lyrChart_1">
                    <dxchartsui:WebChartControl ID="ctlChart_1" runat="server" Height="350px" Width="507px"
                        ClientInstanceName="ctlChart_1" DataSourceID="ctlDB" OnCustomCallback="ctlChart_1_CustomCallback" OnCustomDrawSeriesPoint="ctlChart_1_CustomDrawSeriesPoint"
                        ClientVisible="False">
                        <SeriesSerializable>
                            <cc1:Series ArgumentDataMember="category" Name="S_1_1"
                                ValueDataMembersSerializable="value" SynchronizePointOptions="False" LabelsVisibility="True">
                                <ViewSerializable>
                                    <cc1:SideBySideBarSeriesView AxisYName="secondaryAxisY1"></cc1:SideBySideBarSeriesView>
                                </ViewSerializable>
                            </cc1:Series>
                            <cc1:Series ArgumentDataMember="category" Name="S_1_2"
                                ValueDataMembersSerializable="value" SynchronizePointOptions="False" LabelsVisibility="True">
                            </cc1:Series>
                            <cc1:Series ArgumentDataMember="category" Name="S_2_1"
                                ValueDataMembersSerializable="value" SynchronizePointOptions="False" LabelsVisibility="True">
                                <ViewSerializable>
                                    <cc1:SideBySideBarSeriesView PaneName="Pane 1" AxisYName="secondaryAxisY2"></cc1:SideBySideBarSeriesView>
                                </ViewSerializable>
                            </cc1:Series>
                            <cc1:Series ArgumentDataMember="category" Name="S_2_2"
                                ValueDataMembersSerializable="value" SynchronizePointOptions="False" LabelsVisibility="True">
                                <ViewSerializable>
                                    <cc1:SideBySideBarSeriesView PaneName="Pane 1"></cc1:SideBySideBarSeriesView>
                                </ViewSerializable>
                            </cc1:Series>
                            <cc1:Series ArgumentDataMember="category" Name="S_3_1"
                                ValueDataMembersSerializable="value" SynchronizePointOptions="False" LabelsVisibility="True">
                                <ViewSerializable>
                                    <cc1:SideBySideBarSeriesView PaneName="Pane 2" AxisYName="secondaryAxisY3"></cc1:SideBySideBarSeriesView>
                                </ViewSerializable>
                            </cc1:Series>
                            <cc1:Series ArgumentDataMember="category" Name="S_3_2"
                                ValueDataMembersSerializable="value" SynchronizePointOptions="False" LabelsVisibility="True">
                                <ViewSerializable>
                                    <cc1:SideBySideBarSeriesView PaneName="Pane 2"></cc1:SideBySideBarSeriesView>
                                </ViewSerializable>
                            </cc1:Series>
                        </SeriesSerializable>
                        <DiagramSerializable>
                            <cc1:XYDiagram PaneDistance="4">
                                <AxisX VisibleInPanesSerializable="-1;0;1"></AxisX>
                                <AxisY VisibleInPanesSerializable="-1;0;1" Alignment="Far" title-alignment="Center" title-antialiasing="False" title-font="굴림체, 8pt" title-text="(%)" title-visibility="True">
                                    <Range ScrollingRange-MinValueSerializable="0" ScrollingRange-MaxValueSerializable="100" ScrollingRange-SideMarginsEnabled="False"></Range>
                                    <VisualRange AutoSideMargins="False" SideMarginsValue="0" auto="False" maxvalueserializable="100" minvalueserializable="0"></VisualRange>
                                    <WholeRange Auto="False" MinValueSerializable="0" MaxValueSerializable="100" AutoSideMargins="False" SideMarginsValue="0"></WholeRange>
                                    <numericscaleoptions autogrid="False" gridspacing="20" />
                                </AxisY>
                                <SecondaryAxesY>
                                    <cc1:SecondaryAxisY AxisID="0" Alignment="Near" VisibleInPanesSerializable="-1" Name="secondaryAxisY1"
                                        title-alignment="Center" title-antialiasing="False" title-font="굴림체, 8pt" title-text="" title-visibility="True">
                                        <gridlines visible="False"></gridlines>
                                    </cc1:SecondaryAxisY>
                                    <cc1:SecondaryAxisY AxisID="1" Alignment="Near" VisibleInPanesSerializable="0" Name="secondaryAxisY2" Visibility="False"
                                        title-alignment="Center" title-antialiasing="False" title-font="굴림체, 8pt" title-text="" title-visibility="True">
                                        <gridlines visible="False"></gridlines>
                                    </cc1:SecondaryAxisY>
                                    <cc1:SecondaryAxisY AxisID="2" Alignment="Near" VisibleInPanesSerializable="1" Name="secondaryAxisY3" Visibility="False"
                                        title-alignment="Center" title-antialiasing="False" title-font="굴림체, 8pt" title-text="" title-visibility="True">
                                        <gridlines visible="False"></gridlines>
                                    </cc1:SecondaryAxisY>
                                </SecondaryAxesY>
                                <Panes>
                                    <cc1:XYDiagramPane PaneID="0" Name="Pane 1" Visible="False"></cc1:XYDiagramPane>
                                    <cc1:XYDiagramPane PaneID="1" Name="Pane 2" Visible="False"></cc1:XYDiagramPane>
                                </Panes>
                            </cc1:XYDiagram>
                        </DiagramSerializable>
                        <titles>
                            <cc1:ChartTitle Font="굴림체, 14pt, style=Bold" Text="" Visibility="True" WordWrap="True" />
                        </titles>
                        <legend visibility="False" alignmenthorizontal="Left" alignmentvertical="TopOutside" direction="LeftToRight" font="굴림체, 8.25pt">
                            <border visibility="False" />
                        </legend>
                        <ClientSideEvents ObjectSelected="function(s, e) { processClientObjectSelected(s, e); }" objecthottracked="function(s, e) {	processClientObjectHotTracked(s, e); }"></ClientSideEvents>
                    </dxchartsui:WebChartControl>
                </div>
            </td>
            <td width="">
                <div id="lyrChart_2">
                    <dxchartsui:WebChartControl ID="ctlChart_2" runat="server" Height="350px" Width="636px"
                        ClientInstanceName="ctlChart_2" DataSourceID="ctlDB" OnCustomCallback="ctlChart_2_CustomCallback"
                        ClientVisible="False" CrosshairEnabled="True">
                        <SeriesSerializable>
                            <cc1:Series ArgumentDataMember="category" Name="실적" 
                                ValueDataMembersSerializable="value" SynchronizePointOptions="False" LabelsVisibility="True">
                                <viewserializable>
                                    <cc1:SideBySideBarSeriesView AxisYName="Secondary AxisY 1" ColorEach="True" Transparency="100">
                                    </cc1:SideBySideBarSeriesView>
                                </viewserializable>
                            </cc1:Series>
                            <cc1:Series ArgumentDataMember="category" Name="달성율"
                                ValueDataMembersSerializable="value" SynchronizePointOptions="False" LabelsVisibility="True">
                                <viewserializable>
                                    <cc1:LineSeriesView ColorEach="True"></cc1:LineSeriesView>
                                </viewserializable>
                            </cc1:Series>
                        </SeriesSerializable>
                        <DiagramSerializable>
                            <cc1:XYDiagram>
                                <AxisY VisibleInPanesSerializable="-1" Alignment="Far">
                                    <Range ScrollingRange-MinValueSerializable="0" ScrollingRange-MaxValueSerializable="100" ScrollingRange-SideMarginsEnabled="False"></Range>
                                    <VisualRange AutoSideMargins="False" SideMarginsValue="0"></VisualRange>
                                    <WholeRange Auto="False" MinValueSerializable="0" MaxValueSerializable="100" AutoSideMargins="False" SideMarginsValue="0"></WholeRange>
                                </AxisY>
                                <secondaryaxesy>
                                    <cc1:SecondaryAxisY AxisID="0" Name="Secondary AxisY 1" VisibleInPanesSerializable="-1" Alignment="Near">
                                    </cc1:SecondaryAxisY>
                                </secondaryaxesy>
                            </cc1:XYDiagram>
                        </DiagramSerializable>
                        <titles>
                            <cc1:ChartTitle Font="굴림체, 14pt, style=Bold" Text="" Visibility="True" WordWrap="True" />
                        </titles>
                        <legend visibility="False"></legend>
                    </dxchartsui:WebChartControl>
                </div>
                <div id="lyrChart_4">
                    <dxchartsui:WebChartControl ID="ctlChart_4" runat="server" Height="350px" Width="636px"
                        ClientInstanceName="ctlChart_4" DataSourceID="ctlDB" OnCustomCallback="ctlChart_4_CustomCallback"
                        ClientVisible="False" CrosshairEnabled="True" AutoLayout="True">
                        <SeriesSerializable>
                            <cc1:Series Name="Series 1" SynchronizePointOptions="False" ArgumentDataMember="category" ValueDataMembersSerializable="value" CrosshairLabelPattern="{A} {S} {G} {V}" LegendTextPattern="{G}:{A}">
                                <viewserializable>
                                    <cc1:SideBySideStackedBarSeriesView StackedGroupSerializable="지적" Transparency="100">
                                    </cc1:SideBySideStackedBarSeriesView>
                                </viewserializable>
                                <labelserializable>
                                    <cc1:StackedBarSeriesLabel Position="Auto" TextOrientation="TopToBottom">
                                    </cc1:StackedBarSeriesLabel>
                                </labelserializable>
                            </cc1:Series>
                            <cc1:Series Name="Series 2" SynchronizePointOptions="False" ArgumentDataMember="category" ValueDataMembersSerializable="value" CrosshairLabelPattern="{A} {S} {G} {V}">
                                <viewserializable>
                                    <cc1:SideBySideStackedBarSeriesView StackedGroupSerializable="지적" Transparency="100">
                                    </cc1:SideBySideStackedBarSeriesView>
                                </viewserializable>
                                <labelserializable>
                                    <cc1:StackedBarSeriesLabel Position="Auto" TextOrientation="TopToBottom">
                                    </cc1:StackedBarSeriesLabel>
                                </labelserializable>
                            </cc1:Series>
                            <cc1:Series Name="Series 3" SynchronizePointOptions="False" ArgumentDataMember="category" ValueDataMembersSerializable="value" CrosshairLabelPattern="{A} {S} {G} {V}">
                                <viewserializable>
                                    <cc1:SideBySideStackedBarSeriesView StackedGroupSerializable="지적" Transparency="100">
                                    </cc1:SideBySideStackedBarSeriesView>
                                </viewserializable>
                                <labelserializable>
                                    <cc1:StackedBarSeriesLabel Position="Auto" TextOrientation="TopToBottom">
                                    </cc1:StackedBarSeriesLabel>
                                </labelserializable>
                            </cc1:Series>
                            <cc1:Series Name="Series 4" SynchronizePointOptions="False" ArgumentDataMember="category" CrosshairLabelPattern="{A} {S} {G} {V}" ValueDataMembersSerializable="value">
                                <viewserializable>
                                    <cc1:SideBySideStackedBarSeriesView StackedGroupSerializable="지적" Transparency="100">
                                    </cc1:SideBySideStackedBarSeriesView>
                                </viewserializable>
                                <labelserializable>
                                    <cc1:StackedBarSeriesLabel Position="Auto" TextOrientation="TopToBottom">
                                    </cc1:StackedBarSeriesLabel>
                                </labelserializable>
                            </cc1:Series>
                            <cc1:Series Name="Series 5" SynchronizePointOptions="False" ArgumentDataMember="category" CrosshairLabelPattern="{A} {S} {G} {V}" ValueDataMembersSerializable="value" ShowInLegend="False">
                                <viewserializable>
                                    <cc1:SideBySideStackedBarSeriesView StackedGroupSerializable="조치" Transparency="100">
                                    </cc1:SideBySideStackedBarSeriesView>
                                </viewserializable>
                                <labelserializable>
                                    <cc1:StackedBarSeriesLabel Position="Auto" TextOrientation="TopToBottom">
                                    </cc1:StackedBarSeriesLabel>
                                </labelserializable>
                            </cc1:Series>
                            <cc1:Series Name="Series 6" SynchronizePointOptions="False" ArgumentDataMember="category" CrosshairLabelPattern="{A} {S} {G} {V}" ValueDataMembersSerializable="value" ShowInLegend="False">
                                <viewserializable>
                                    <cc1:SideBySideStackedBarSeriesView StackedGroupSerializable="조치" Transparency="100">
                                    </cc1:SideBySideStackedBarSeriesView>
                                </viewserializable>
                                <labelserializable>
                                    <cc1:StackedBarSeriesLabel Position="Auto" TextOrientation="TopToBottom">
                                    </cc1:StackedBarSeriesLabel>
                                </labelserializable>
                            </cc1:Series>
                            <cc1:Series Name="Series 7" SynchronizePointOptions="False" ArgumentDataMember="category" CrosshairLabelPattern="{A} {S} {G} {V}" ValueDataMembersSerializable="value" ShowInLegend="False">
                                <viewserializable>
                                    <cc1:SideBySideStackedBarSeriesView StackedGroupSerializable="조치" Transparency="100">
                                    </cc1:SideBySideStackedBarSeriesView>
                                </viewserializable>
                                <labelserializable>
                                    <cc1:StackedBarSeriesLabel Position="Auto" TextOrientation="TopToBottom">
                                    </cc1:StackedBarSeriesLabel>
                                </labelserializable>
                            </cc1:Series>
                            <cc1:Series Name="Series 8" SynchronizePointOptions="False" ArgumentDataMember="category" CrosshairLabelPattern="{A} {S} {G} {V}" ValueDataMembersSerializable="value" ShowInLegend="False">
                                <viewserializable>
                                    <cc1:SideBySideStackedBarSeriesView StackedGroupSerializable="조치" Transparency="100">
                                    </cc1:SideBySideStackedBarSeriesView>
                                </viewserializable>
                                <labelserializable>
                                    <cc1:StackedBarSeriesLabel Position="Auto" TextOrientation="TopToBottom">
                                    </cc1:StackedBarSeriesLabel>
                                </labelserializable>
                            </cc1:Series>
                        </SeriesSerializable>
                        <DiagramSerializable>
                            <cc1:XYDiagram>
                                <AxisX VisibleInPanesSerializable="-1" logarithmic="True" visibility="True">
                                    <label angle="45" font="맑은 고딕, 8pt">
                                    </label>
                                    <gridlines minorvisible="True" visible="True">
                                    </gridlines>
                                </AxisX>
                                <AxisY VisibleInPanesSerializable="-1" visibility="True">
                                    <label font="굴림체, 8pt"></label>
                                    <Range ScrollingRange-SideMarginsEnabled="False"></Range>
                                    <VisualRange AutoSideMargins="False"></VisualRange>
                                    <WholeRange AutoSideMargins="False"></WholeRange>
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
                            <cc1:ChartTitle Font="굴림체, 14pt, style=Bold" Text="" Visibility="False" WordWrap="True" />
                        </titles>
                        <legend visibility="False" alignmenthorizontal="Right" alignmentvertical="TopOutside" direction="LeftToRight" font="굴림체, 8pt" maxhorizontalpercentage="80"></legend>
                    </dxchartsui:WebChartControl>        
                </div>
            </td>
        </tr>
        <tr><td colspan="2">&nbsp;</td></tr>
        <tr>
            <td>
                <div id="lyrChart_3">
                    <dxchartsui:WebChartControl ID="ctlChart_3" runat="server" Height="350px" Width="507px"
                        ClientInstanceName="ctlChart_3" DataSourceID="ctlDB" OnCustomCallback="ctlChart_3_CustomCallback"
                        ClientVisible="False">
                        <SeriesSerializable>
                            <cc1:Series ArgumentDataMember="category" Name="Series 1" 
                                ValueDataMembersSerializable="value" SynchronizePointOptions="False" LabelsVisibility="True">
                                <viewserializable>
                                    <cc1:SideBySideBarSeriesView ColorEach="True" Transparency="100">
                                    </cc1:SideBySideBarSeriesView>
                                </viewserializable>
                            </cc1:Series>
                        </SeriesSerializable>
                        <titles>
                            <cc1:ChartTitle Font="굴림체, 14pt, style=Bold" Text="" Visibility="True" WordWrap="True" />
                        </titles>
                        <DiagramSerializable>
                            <cc1:XYDiagram Rotated="True">
                                <AxisX VisibleInPanesSerializable="-1"></AxisX>
                                <AxisY VisibleInPanesSerializable="-1"></AxisY>
                            </cc1:XYDiagram>
                        </DiagramSerializable>
                        <legend visibility="False"></legend>
                        <ClientSideEvents ObjectSelected="function(s, e) { processClientObjectSelected(s, e); }"></ClientSideEvents>
                    </dxchartsui:WebChartControl>
                </div>
            </td>
            <td>
                <div id="grdList_1"></div>
            </td>
        </tr>
    </table>
    <asp:SqlDataSource ID="ctlDB" runat="server" ConnectionString="<%$ ConnectionStrings:PLMDB %>">
    </asp:SqlDataSource>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="objContentData" runat="Server">
</asp:Content>
