<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Control_16.master" AutoEventWireup="true"
    CodeFile="EDM_3110.aspx.cs" Inherits="JOB_EDM_3110" %>
<%@ Register Assembly="DevExpress.XtraCharts.v15.1.Web, Version=15.1.6.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a"
    Namespace="DevExpress.XtraCharts.Web" TagPrefix="dxchartsui" %>
<%@ Register Assembly="DevExpress.XtraCharts.v15.1, Version=15.1.6.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a"
    Namespace="DevExpress.XtraCharts" TagPrefix="cc1" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/EDM.3110.js" type="text/javascript"></script>
    <script type="text/javascript">

        $(function () {

            gw_job_process.ready();

        });
        
    </script>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="objContentOption" runat="Server">
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="objContentMenu" runat="Server">
    <div id="lyrMenu">
    </div>
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="objContentToggle" runat="Server">
    <form id="frmOption" action="">
    </form>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentRemark" runat="Server">
    <div id="lyrRemark">
    </div>
</asp:Content>
<asp:Content ID="Content7" ContentPlaceHolderID="objContentData_1" runat="Server">
    <div id="grdData_Main1">
    </div>
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderID="objContentData_2" runat="Server">
    <div id="grdData_Main2">
    </div>
</asp:Content>
<asp:Content ID="Content8" ContentPlaceHolderID="objContentControl_1" runat="Server">
    <div id="lyrChart_Main1" align="center">
        <dxchartsui:WebChartControl ID="ctlChart_1" runat="server" Height="280px" Width="500px"
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
    <div id="lyrChart_Main2" align="center">
        <dxchartsui:WebChartControl ID="ctlChart_2" runat="server" Height="280px" Width="500px"
            ClientInstanceName="ctlChart_2" DataSourceID="ctlDB_2" OnCustomCallback="ctlChart_2_CustomCallback"
            ClientVisible="False">
            <seriesserializable>
                <cc1:Series ArgumentDataMember="category" Name="Series 1" 
                    ValueDataMembersSerializable="value" SynchronizePointOptions="False">
                </cc1:Series>
            </seriesserializable>
            <legend visible="False"></legend>
        </dxchartsui:WebChartControl>
        <asp:SqlDataSource ID="ctlDB_2" runat="server" ConnectionString="<%$ ConnectionStrings:PLMDB %>">
        </asp:SqlDataSource>
    </div>
</asp:Content>
