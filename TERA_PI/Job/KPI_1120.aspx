<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Control_7.master" AutoEventWireup="true"
    CodeFile="KPI_1120.aspx.cs" Inherits="JOB_KPI_1120" %>

<%@ Register Assembly="DevExpress.XtraCharts.v15.1.Web, Version=15.1.4.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a"
    Namespace="DevExpress.XtraCharts.Web" TagPrefix="dxchartsui" %>
<%@ Register Assembly="DevExpress.XtraCharts.v15.1, Version=15.1.4.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a"
    Namespace="DevExpress.XtraCharts" TagPrefix="cc1" %>
<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/KPI.1120.js" type="text/javascript"></script>
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
                <div id="lyrRemark_2">
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
            <td width="50%">
                <div id="lyrChart_1">
                    <dxchartsui:WebChartControl ID="ctlChart_1" runat="server" Height="350px" Width="571px"
                        ClientInstanceName="ctlChart_1" DataSourceID="ctlDB" OnCustomCallback="ctlChart_1_CustomCallback"
                        ClientVisible="False">
                        <seriesserializable>
                            <cc1:Series ArgumentDataMember="category" Name="Series 1" 
                                ValueDataMembersSerializable="value" SynchronizePointOptions="False">
                                <viewserializable>
                                    <cc1:RadarAreaSeriesView>
                                    </cc1:RadarAreaSeriesView>
                                </viewserializable>
                            </cc1:Series>
                        </seriesserializable>
                        <DiagramSerializable>
                            <cc1:RadarDiagram RotationDirection="Clockwise" DrawingStyle="Polygon">
                            </cc1:RadarDiagram>
                        </DiagramSerializable>
                        <titles>
                            <cc1:ChartTitle Alignment="Near" Font="굴림체, 14pt, style=Bold" Text="품질지수" Visibility="True" WordWrap="True" />
                        </titles>
                        <legend visibility="False"></legend>
                        <ClientSideEvents ObjectSelected="function(s, e) { processClientObjectSelected(s, e); }"></ClientSideEvents>
                    </dxchartsui:WebChartControl>
                </div>
            </td>
            <td width="50%">
                <div id="lyrChart_2">
                    <dxchartsui:WebChartControl ID="ctlChart_2" runat="server" Height="350px" Width="571px"
                        ClientInstanceName="ctlChart_2" DataSourceID="ctlDB" OnCustomCallback="ctlChart_2_CustomCallback"
                        ClientVisible="False">
                        <SeriesSerializable>
                            <cc1:Series ArgumentDataMember="category" Name="Series 1" 
                                ValueDataMembersSerializable="value" SynchronizePointOptions="False">
                            </cc1:Series>
                            <cc1:Series ArgumentDataMember="category" Name="Series 2" 
                                ValueDataMembersSerializable="value" SynchronizePointOptions="False">
                                <ViewSerializable>
                                    <cc1:SideBySideBarSeriesView PaneName="Pane 1" AxisXName="secondaryAxisX1" AxisYName="secondaryAxisY1"></cc1:SideBySideBarSeriesView>
                                </ViewSerializable>
                            </cc1:Series>
                        </SeriesSerializable>
                        <DiagramSerializable>
                            <cc1:XYDiagram PaneDistance="4">
                                <AxisX VisibleInPanesSerializable="-1"></AxisX>
                                <AxisY VisibleInPanesSerializable="-1">
                                    <WholeRange Auto="True"></WholeRange>
                                </AxisY>
                                <SecondaryAxesX>
                                    <cc1:SecondaryAxisX AxisID="0" Alignment="Near" Title-Visibility="False" VisibleInPanesSerializable="0" Name="secondaryAxisX1">
                                    </cc1:SecondaryAxisX>
                                </SecondaryAxesX>
                                <SecondaryAxesY>
                                    <cc1:SecondaryAxisY AxisID="1" Alignment="Near" Title-Visibility="False" VisibleInPanesSerializable="0" Name="secondaryAxisY1">
                                        <WholeRange Auto="True"></WholeRange>
                                    </cc1:SecondaryAxisY>
                                </SecondaryAxesY>
                                <Panes>
                                    <cc1:XYDiagramPane PaneID="0" Name="Pane 1"></cc1:XYDiagramPane>
                                </Panes>
                            </cc1:XYDiagram>
                        </DiagramSerializable>
                        <titles>
                            <cc1:ChartTitle Font="굴림체, 14pt, style=Bold" Text="품질지수" Visibility="True" WordWrap="True" />
                        </titles>
                        <legend visibility="False"></legend>
                    </dxchartsui:WebChartControl>        
                </div>
                <div id="lyrChart_3">
                    <dxchartsui:WebChartControl ID="ctlChart_3" runat="server" Height="350px" Width="571px"
                        ClientInstanceName="ctlChart_3" DataSourceID="ctlDB" OnCustomCallback="ctlChart_3_CustomCallback"
                        ClientVisible="False">
                        <seriesserializable>
                            <cc1:Series ArgumentDataMember="category" Name="Series 1" 
                                ValueDataMembersSerializable="value" SynchronizePointOptions="False">
                            </cc1:Series>
                        </seriesserializable>
                        <titles>
                            <cc1:ChartTitle Font="굴림체, 14pt, style=Bold" Text="월별 추이" Visibility="True" WordWrap="True" />
                        </titles>
                        <legend visibility="False"></legend>
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
