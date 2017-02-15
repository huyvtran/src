<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_8.master" AutoEventWireup="true"
    CodeFile="w_hcem4020.aspx.cs" Inherits="Job_w_hcem4020" %>

<%@ Register Assembly="DevExpress.XtraCharts.v15.1.Web, Version=15.1.4.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a"
    Namespace="DevExpress.XtraCharts.Web" TagPrefix="dxchartsui" %>
<%@ Register Assembly="DevExpress.XtraCharts.v15.1, Version=15.1.4.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a"
    Namespace="DevExpress.XtraCharts" TagPrefix="cc1" %>
<%@ Register Assembly="DevExpress.XtraCharts.v15.1" Namespace="DevExpress.XtraCharts"
    TagPrefix="cc2" %>
<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/w.hcem4020.js" type="text/javascript"></script>
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
    <div id="grdData_현황">
    </div>
    <div id="grdData_현황상세" style="padding-top: 10px;">
    </div>
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="objContentData_2" runat="Server">
    <form id="frmServer" runat="server">
    <div id="lyrChart_통계" align="center">
        <dxchartsui:WebChartControl ID="ctlChart_1" runat="server" Height="250px" Width="660px"
            ClientInstanceName="ctlChart_1" DataSourceID="ctlDB_1" OnCustomCallback="ctlChart_1_CustomCallback"
            ClientVisible="False">
            <seriesserializable>
                <cc1:Series ArgumentDataMember="category" Name="Series 1" 
                    ValueDataMembersSerializable="value" SynchronizePointOptions="False">
                    <viewserializable>
                        <cc1:SideBySideBarSeriesView ColorEach="True">
                        </cc1:SideBySideBarSeriesView>
                    </viewserializable>
                    <labelserializable>
                        <cc1:SideBySideBarSeriesLabel Font="굴림, 8.25pt" LineVisible="True">
                            <fillstyle>
                                <optionsserializable>
                                    <cc1:SolidFillOptions />
                                </optionsserializable>
                            </fillstyle>
                        </cc1:SideBySideBarSeriesLabel>
                    </labelserializable>
                    <pointoptionsserializable>
                        <cc1:PointOptions>
                        </cc1:PointOptions>
                    </pointoptionsserializable>
                    <legendpointoptionsserializable>
                        <cc1:PointOptions>
                        </cc1:PointOptions>
                    </legendpointoptionsserializable>
                </cc1:Series>
            </seriesserializable>
            <diagramserializable>
                <cc1:XYDiagram>
                    <axisx visibleinpanesserializable="-1">
                        <range sidemarginsenabled="True" />
<Label Font="굴림, 8.25pt"></Label>

<Range SideMarginsEnabled="True"></Range>
                    </axisx>
                    <axisy visibleinpanesserializable="-1">
                        <range sidemarginsenabled="True" />
<Label Font="굴림, 8.25pt"></Label>

<Range SideMarginsEnabled="True"></Range>
                    </axisy>
                </cc1:XYDiagram>
            </diagramserializable>
            <seriestemplate>
                <ViewSerializable>
                    <cc1:PieSeriesView RuntimeExploding="False">
                    </cc1:PieSeriesView>
                </ViewSerializable>
                <LabelSerializable>
                    <cc1:PieSeriesLabel LineVisible="True">
                        <fillstyle>
                            <optionsserializable>
                                <cc1:SolidFillOptions />
                            </optionsserializable>
                        </fillstyle>
                    </cc1:PieSeriesLabel>
                </LabelSerializable>
                <PointOptionsSerializable>
                    <cc1:PiePointOptions>
                    </cc1:PiePointOptions>
                </PointOptionsSerializable>
                <LegendPointOptionsSerializable>
                    <cc1:PiePointOptions>
                    </cc1:PiePointOptions>
                </LegendPointOptionsSerializable>
            </seriestemplate>
            <legend alignmenthorizontal="Right" font="Tahoma, 8.25pt" visible="False"></legend>
            <fillstyle>
                <OptionsSerializable>
                    <cc1:SolidFillOptions></cc1:SolidFillOptions>
                </OptionsSerializable>
            </fillstyle>
        </dxchartsui:WebChartControl>
    </div>
    <div id="lyrChart_통계상세">
        <dxchartsui:WebChartControl ID="ctlChart_2" runat="server" Height="350px" Width="670px"
            ClientInstanceName="ctlChart_2" DataSourceID="ctlDB_2" OnCustomCallback="ctlChart_2_CustomCallback"
            ClientVisible="False">
            <seriesserializable>
                <cc1:Series ArgumentDataMember="category" Name="Series 1" ValueDataMembersSerializable="value">
                    <viewserializable>
                        <cc1:SideBySideBarSeriesView ColorEach="True">
                        </cc1:SideBySideBarSeriesView>
                    </viewserializable>
                    <labelserializable>
                        <cc1:SideBySideBarSeriesLabel Font="굴림, 8.25pt" LineVisible="True">
                            <fillstyle>
                                <optionsserializable>
                                    <cc1:SolidFillOptions />
                                </optionsserializable>
                            </fillstyle>
                        </cc1:SideBySideBarSeriesLabel>
                    </labelserializable>
                    <pointoptionsserializable>
                        <cc1:PointOptions>
                        </cc1:PointOptions>
                    </pointoptionsserializable>
                    <legendpointoptionsserializable>
                        <cc1:PointOptions>
                        </cc1:PointOptions>
                    </legendpointoptionsserializable>
                </cc1:Series>
            </seriesserializable>
            <diagramserializable>
                <cc1:XYDiagram Rotated="True">
                    <axisx title-alignment="Near" title-font="굴림, 8.25pt" title-text="" 
                        title-visible="True" visibleinpanesserializable="-1">
                        <range sidemarginsenabled="True" />
<Label Font="굴림, 8.25pt"></Label>

<Range SideMarginsEnabled="True"></Range>
                    </axisx>
                    <axisy title-alignment="Far" title-font="굴림, 8.25pt" title-text="" 
                        title-visible="True" visibleinpanesserializable="-1">
                        <range sidemarginsenabled="True" />
<Label Font="굴림, 8.25pt"></Label>

<Range SideMarginsEnabled="True"></Range>
                    </axisy>
                </cc1:XYDiagram>
            </diagramserializable>
            <seriestemplate>
                <ViewSerializable>
                    <cc1:SideBySideBarSeriesView></cc1:SideBySideBarSeriesView>
                </ViewSerializable>
                <LabelSerializable>
                    <cc1:SideBySideBarSeriesLabel LineVisible="True">
                        <FillStyle>
                            <OptionsSerializable>
                                <cc1:SolidFillOptions></cc1:SolidFillOptions>
                            </OptionsSerializable>
                        </FillStyle>
                    </cc1:SideBySideBarSeriesLabel>
                </LabelSerializable>
                <PointOptionsSerializable>
                    <cc1:PointOptions></cc1:PointOptions>
                </PointOptionsSerializable>
                <LegendPointOptionsSerializable>
                    <cc1:PointOptions></cc1:PointOptions>
                </LegendPointOptionsSerializable>
            </seriestemplate>
            <legend visibility="False"></legend>
            <fillstyle>
                <OptionsSerializable>
                    <cc1:SolidFillOptions></cc1:SolidFillOptions>
                </OptionsSerializable>
            </fillstyle>
        </dxchartsui:WebChartControl>
    </div>
    <asp:SqlDataSource ID="ctlDB_1" runat="server" ConnectionString="<%$ ConnectionStrings:PLMDB %>">
    </asp:SqlDataSource>
    <asp:SqlDataSource ID="ctlDB_2" runat="server" ConnectionString="<%$ ConnectionStrings:PLMDB %>">
    </asp:SqlDataSource>
    </form>
</asp:Content>
