<%@ Page Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="DLG_APPR.aspx.cs" Inherits="Job_DLG_APPR" Title="" ValidateRequest="false" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link href="/Style/approval_form.css" rel="stylesheet" type="text/css" />
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/DLG.APPR.js" type="text/javascript"></script>
    <script type="text/javascript">

        $(function () {

            gw_job_process.ready();

        });

    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentOption" runat="Server">
    <div id="lyrNotice">
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="objContentMenu" runat="Server">
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td><div id="lyrMenu_1"></div></td>
            <td><div id="lyrMenu_2" align="right"></div></td>
        </tr>
    </table>
    <div id="lyrMenu">
    </div>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="objContentToggle" runat="Server">
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderID="objContentRemark" runat="Server">
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="objContentData" runat="Server">
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td width="35%">
                <form id="frmData_APPR" action=""></form>
            </td>
            <td width="5%"></td>
            <td width="60%" align="right">
                <div id="lyrMenu_APPR_LINE"></div>
                <div id="grdData_APPR_LINE"></div>
                <form id="frmData_RMK" action=""></form>
            </td>
        </tr>
    </table>
    <form id="frmData_INPUT" action=""></form>
    <form id="frmData_HTML" action=""></form>
    <div id="lyrMenu_FILE" align="right"></div>
    <div id="grdData_FILE"></div>
    <div id="lyrDown"></div>
</asp:Content>
