<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="w_iscm2010_u.aspx.cs" Inherits="Job_w_iscm2010_u" %>

<%@ Register Assembly="DevExpress.XtraCharts.v15.1.Web, Version=15.1.6.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a"
    Namespace="DevExpress.XtraCharts.Web" TagPrefix="dxchartsui" %>
<%@ Register Assembly="DevExpress.XtraCharts.v15.1, Version=15.1.6.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a"
    Namespace="DevExpress.XtraCharts" TagPrefix="cc1" %>
<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/w.iscm2010_u.js" type="text/javascript"></script>
    <script type="text/javascript">

        $(function () {

            gw_job_process.ready();

        });
        
    </script>
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderID="objContentOption" runat="Server">
    <form id="frmView" action="">
    </form>
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
<asp:Content ID="Content4" ContentPlaceHolderID="objContentData" runat="Server">
    <div id="grdData_현황">
    </div>
    <form id="frmServer" runat="server">
    <div id="lyrChart_현황" align="center">
        <dxchartsui:WebChartControl ID="ctlChart_1" runat="server" Height="244px" Width="900px"
            ClientInstanceName="ctlChart_1" DataSourceID="ctlDB_1" OnCustomCallback="ctlChart_1_CustomCallback"
            ClientVisible="False" SeriesDataMember="series">
            <diagramserializable>
                <cc1:XYDiagram>
                    <axisx visibleinpanesserializable="-1">
                        <range sidemarginsenabled="True" />
                    </axisx>
                    <axisy visibleinpanesserializable="-1">
                        <range sidemarginsenabled="True" />
                    </axisy>
                </cc1:XYDiagram>
            </diagramserializable>
            <seriestemplate argumentdatamember="category" valuedatamembersserializable="value"
                synchronizepointoptions="False">
                <ViewSerializable>
                    <cc1:SideBySideBarSeriesView>
                    </cc1:SideBySideBarSeriesView>
                </ViewSerializable>
                <labelserializable>
                    <cc1:SideBySideBarSeriesLabel LineVisible="True">
                        <fillstyle>
                            <optionsserializable>
                                <cc1:SolidFillOptions />
                            </optionsserializable>
                        </fillstyle>
                    </cc1:SideBySideBarSeriesLabel>
                </labelserializable>
                <PointOptionsSerializable>
                    <cc1:PointOptions>
                    </cc1:PointOptions>
                </PointOptionsSerializable>
                <LegendPointOptionsSerializable>
                    <cc1:PointOptions>
                    </cc1:PointOptions>
                </LegendPointOptionsSerializable>
            </seriestemplate>
            <legend font="맑은 고딕, 9pt"></legend>
            <fillstyle>
                <OptionsSerializable>
                    <cc1:SolidFillOptions></cc1:SolidFillOptions>
                </OptionsSerializable>
            </fillstyle>
        </dxchartsui:WebChartControl>
    </div>
    <asp:SqlDataSource ID="ctlDB_1" runat="server" ConnectionString="<%$ ConnectionStrings:PLMDB %>">
    </asp:SqlDataSource>
    </form>
</asp:Content>
