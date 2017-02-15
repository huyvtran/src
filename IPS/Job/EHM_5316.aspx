<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Control_14.master" AutoEventWireup="true"
    CodeFile="EHM_5316.aspx.cs" Inherits="JOB_EHM_5316" %>

<%@ Register Assembly="DevExpress.XtraCharts.v15.1.Web, Version=15.1.6.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a"
    Namespace="DevExpress.XtraCharts.Web" TagPrefix="dxchartsui" %>
<%@ Register Assembly="DevExpress.XtraCharts.v15.1, Version=15.1.6.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a"
    Namespace="DevExpress.XtraCharts" TagPrefix="cc1" %>
<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/EHM.5316.js" type="text/javascript"></script>
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
<asp:Content ID="Content4" ContentPlaceHolderID="objContentData_1" runat="Server">
    <div id="grdData_분류1">
    </div>
</asp:Content>
<asp:Content ID="Content8" ContentPlaceHolderID="objContentData_2" runat="Server">
    <div id="grdData_분류2">
    </div>
</asp:Content>
<asp:Content ID="Content10" ContentPlaceHolderID="objContentData_3" runat="Server">
    <div id="grdData_분류3">
    </div>
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="objContentControl_1" runat="Server">
    <div id="lyrChart_분류1">
        <dxchartsui:WebChartControl ID="ctlChart_1" runat="server" Height="250px" Width="800px"
            ClientInstanceName="ctlChart_1" DataSourceID="ctlDB_1" OnCustomCallback="ctlChart_1_CustomCallback"
            ClientVisible="False">
            <seriesserializable>
                <cc1:Series ArgumentDataMember="category" Name="Series 1" 
                    ValueDataMembersSerializable="value" SynchronizePointOptions="False">
                </cc1:Series>
            </seriesserializable>
            <legend visible="False"></legend>
        </dxchartsui:WebChartControl>
        <asp:SqlDataSource ID="ctlDB_1" runat="server" ConnectionString="<%$ ConnectionStrings:PLMDB %>">
        </asp:SqlDataSource>
    </div>
</asp:Content>
<asp:Content ID="Content9" ContentPlaceHolderID="objContentControl_2" runat="Server">
    <div id="lyrChart_분류2">
        <dxchartsui:WebChartControl ID="ctlChart_2" runat="server" Height="220px" Width="800px"
            ClientInstanceName="ctlChart_2" DataSourceID="ctlDB_2" OnCustomCallback="ctlChart_2_CustomCallback"
            ClientVisible="False">
            <seriesserializable>
                <cc1:Series ArgumentDataMember="category" Name="Series 1" 
                    ValueDataMembersSerializable="value" SynchronizePointOptions="False">
                </cc1:Series>
            </seriesserializable>
            <legend visible="False"></legend>
            <titles><cc1:ChartTitle text="Rev별 교체 갯수" /></titles>
        </dxchartsui:WebChartControl>        
        <asp:SqlDataSource ID="ctlDB_2" runat="server" ConnectionString="<%$ ConnectionStrings:PLMDB %>">
        </asp:SqlDataSource>
    </div>
</asp:Content>
<asp:Content ID="Content11" ContentPlaceHolderID="objContentControl_3" runat="Server">
    <div id="lyrChart_분류3">
        <dxchartsui:WebChartControl ID="ctlChart_3" runat="server" Height="220px" Width="800px"
            ClientInstanceName="ctlChart_3" DataSourceID="ctlDB_3" OnCustomCallback="ctlChart_3_CustomCallback"
            ClientVisible="False">
            <seriesserializable>
                <cc1:Series ArgumentDataMember="category" Name="Series 1" 
                    ValueDataMembersSerializable="value" SynchronizePointOptions="False">
                </cc1:Series>
            </seriesserializable>
            <legend visible="False"></legend>
            <titles><cc1:ChartTitle text="현상별 발생 건수" /></titles>
<ClientSideEvents ObjectSelected="function(s, e) {
	processClientObjectSelected(s, e);
}"></ClientSideEvents>
        </dxchartsui:WebChartControl>        
        <asp:SqlDataSource ID="ctlDB_3" runat="server" ConnectionString="<%$ ConnectionStrings:PLMDB %>">
        </asp:SqlDataSource>
    </div>
</asp:Content>
