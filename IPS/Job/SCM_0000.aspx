﻿<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="SCM_0000.aspx.cs" Inherits="Job_SCM_0000" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/SCM.0000.js" type="text/javascript"></script>
    <script type="text/javascript">
        $(function () { gw_job_process.ready(); });
    </script>
</asp:Content>
<asp:Content ID="Content8" ContentPlaceHolderID="objContentOption" runat="Server">
</asp:Content>
<asp:Content ID="Content7" ContentPlaceHolderID="objContentMenu" runat="Server">
    <div id="lyrMenu"></div>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentToggle" runat="Server">
    <form id="frmOption" action="">
    </form>
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="objContentRemark" runat="Server">
    <div id="lyrRemark">
    </div>
</asp:Content>
<asp:Content ID="Content9" ContentPlaceHolderID="objContentData" runat="Server">
    <table width="100%">
        <tr>
            <td width="100%">
                <div id="grdData_MAIN"></div>
            </td>
        </tr>
        <tr>
            <td width="">
                <div id="grdData_SUB"></div>
            </td>
        </tr>
    </table>
</asp:Content>