﻿<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_Chart_62.master" AutoEventWireup="true"
    CodeFile="EOM_5180.aspx.cs" Inherits="JOB_EOM_5180" %>

<%@ Register Assembly="DevExpress.XtraCharts.v15.1.Web, Version=15.1.4.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a"
    Namespace="DevExpress.XtraCharts.Web" TagPrefix="dxchartsui" %>
<%@ Register Assembly="DevExpress.XtraCharts.v15.1, Version=15.1.4.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a"
    Namespace="DevExpress.XtraCharts" TagPrefix="cc1" %>
<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/EOM.5180.js" type="text/javascript"></script>
    <script type="text/javascript">

        $(function () {

            gw_job_process.ready();

        });
        
    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentOption" runat="Server">
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="objContentMenu" runat="Server">
    <div id="lyrMenu"></div>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="objContentToggle" runat="Server">
    <form id="frmOption" action=""></form>
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderID="objContentRemark" runat="Server">
    <div id="lyrRemark"></div>
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="objContentData_1" runat="Server">
    <div id="grdData_Main"></div>
</asp:Content>
<asp:Content ID="Content7" ContentPlaceHolderID="objContentControl_1" runat="Server">
    <div id="lyrChart_Main">
        <dxchartsui:WebChartControl ID="ctlChart_1" runat="server" Height="200px" Width="825px"
            ClientInstanceName="ctlChart_1" DataSourceID="ctlDB_1" OnCustomCallback="ctlChart_1_CustomCallback"
            ClientVisible="False" SeriesDataMember="series" PaletteName="Mixed">
            <seriestemplate argumentdatamember="category" valuedatamembersserializable="value"> </seriestemplate>
            <%--<titles><cc1:ChartTitle Font="Tahoma, 12pt" Text="" /></titles>--%>
        </dxchartsui:WebChartControl>
        <asp:SqlDataSource ID="ctlDB_1" runat="server" ConnectionString="<%$ ConnectionStrings:PLMDB %>">
        </asp:SqlDataSource>
    </div>
</asp:Content>
<asp:Content ID="Content8" ContentPlaceHolderID="objContentData_2" runat="Server">
    <div id="grdData_Sub"></div>
</asp:Content>
<asp:Content ID="Content9" ContentPlaceHolderID="objContentControl_2" runat="Server">
    <div id="lyrChart_Sub">
        <dxchartsui:WebChartControl ID="ctlChart_2" runat="server" Height="200px" Width="825px"
            ClientInstanceName="ctlChart_2" DataSourceID="ctlDB_2" OnCustomCallback="ctlChart_2_CustomCallback"
            ClientVisible="False" SeriesDataMember="series" PaletteName="Mixed">
            <seriestemplate argumentdatamember="category" valuedatamembersserializable="value"> </seriestemplate>
            <%--<titles><cc1:ChartTitle Font="Tahoma, 12pt" Text="" /></titles>--%>
        </dxchartsui:WebChartControl>
        <asp:SqlDataSource ID="ctlDB_2" runat="server" ConnectionString="<%$ ConnectionStrings:PLMDB %>">
        </asp:SqlDataSource>
    </div>
</asp:Content>
<asp:Content ID="Content10" ContentPlaceHolderID="objContentData_3" runat="Server">
    <div id="grdData_3"></div>
</asp:Content>
<asp:Content ID="Content11" ContentPlaceHolderID="objContentControl_3" runat="Server">
    <div id="lyrChart_3">
        <dxchartsui:WebChartControl ID="ctlChart_3" runat="server" Height="200px" Width="825px"
            ClientInstanceName="ctlChart_3" DataSourceID="ctlDB_3" OnCustomCallback="ctlChart_3_CustomCallback"
            ClientVisible="False" SeriesDataMember="series" PaletteName="Mixed">
            <seriestemplate argumentdatamember="category" valuedatamembersserializable="value"> </seriestemplate>
            <%--<titles><cc1:ChartTitle Font="Tahoma, 12pt" Text="" /></titles>--%>
        </dxchartsui:WebChartControl>
        <asp:SqlDataSource ID="ctlDB_3" runat="server" ConnectionString="<%$ ConnectionStrings:PLMDB %>">
        </asp:SqlDataSource>
    </div>
</asp:Content>
<asp:Content ID="Content12" ContentPlaceHolderID="objContentData_4" runat="Server">
    <div id="grdData_4"></div>
</asp:Content>
<asp:Content ID="Content13" ContentPlaceHolderID="objContentControl_4" runat="Server">
    <div id="lyrChart_4">
        <dxchartsui:WebChartControl ID="ctlChart_4" runat="server" Height="200px" Width="825px"
            ClientInstanceName="ctlChart_4" DataSourceID="ctlDB_4" OnCustomCallback="ctlChart_4_CustomCallback"
            ClientVisible="False" SeriesDataMember="series" PaletteName="Mixed">
            <seriestemplate argumentdatamember="category" valuedatamembersserializable="value"> </seriestemplate>
            <%--<titles><cc1:ChartTitle Font="Tahoma, 12pt" Text="" /></titles>--%>
        </dxchartsui:WebChartControl>
        <asp:SqlDataSource ID="ctlDB_4" runat="server" ConnectionString="<%$ ConnectionStrings:PLMDB %>">
        </asp:SqlDataSource>
    </div>
</asp:Content>
<asp:Content ID="Content14" ContentPlaceHolderID="objContentData_5" runat="Server">
    <div id="grdData_5"></div>
</asp:Content>
<asp:Content ID="Content15" ContentPlaceHolderID="objContentControl_5" runat="Server">
    <div id="lyrChart_5">
        <dxchartsui:WebChartControl ID="ctlChart_5" runat="server" Height="200px" Width="825px"
            ClientInstanceName="ctlChart_5" DataSourceID="ctlDB_5" OnCustomCallback="ctlChart_5_CustomCallback"
            ClientVisible="False" SeriesDataMember="series" PaletteName="Mixed">
            <seriestemplate argumentdatamember="category" valuedatamembersserializable="value"> </seriestemplate>
            <%--<titles><cc1:ChartTitle Font="Tahoma, 12pt" Text="" /></titles>--%>
        </dxchartsui:WebChartControl>
        <asp:SqlDataSource ID="ctlDB_5" runat="server" ConnectionString="<%$ ConnectionStrings:PLMDB %>">
        </asp:SqlDataSource>
    </div>
</asp:Content>
<asp:Content ID="Content16" ContentPlaceHolderID="objContentData_6" runat="Server">
    <div id="grdData_6"></div>
</asp:Content>
<asp:Content ID="Content17" ContentPlaceHolderID="objContentControl_6" runat="Server">
    <div id="lyrChart_6">
        <dxchartsui:WebChartControl ID="ctlChart_6" runat="server" Height="200px" Width="825px"
            ClientInstanceName="ctlChart_6" DataSourceID="ctlDB_6" OnCustomCallback="ctlChart_6_CustomCallback"
            ClientVisible="False" SeriesDataMember="series" PaletteName="Mixed">
            <seriestemplate argumentdatamember="category" valuedatamembersserializable="value"> </seriestemplate>
            <%--<titles><cc1:ChartTitle Font="Tahoma, 12pt" Text="" /></titles>--%>
        </dxchartsui:WebChartControl>
        <asp:SqlDataSource ID="ctlDB_6" runat="server" ConnectionString="<%$ ConnectionStrings:PLMDB %>">
        </asp:SqlDataSource>
    </div>
</asp:Content>