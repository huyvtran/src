<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="HRM_3120.aspx.cs" Inherits="Job_HRM_3120" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/HRM.3120.js" type="text/javascript"></script>
    <script type="text/javascript">

        $(function () {

            gw_job_process.ready();

        });
        
    </script>
</asp:Content>
<asp:Content ID="Content8" ContentPlaceHolderID="objContentOption" runat="Server">
</asp:Content>
<asp:Content ID="Content7" ContentPlaceHolderID="objContentMenu" runat="Server">
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td width="25%">
                <div id="lyrRemark2"></div>
            </td>
            <td width="" align="right">
                <div id="lyrMenu"></div>
            </td>
        </tr>
    </table>
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
    <div id="grdList_MAIN"></div>
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td width="80%">
                <form id="frmData_MAIN" action=""></form>
            </td>
            <td width="">
                <div id="lyrMenu_DETAIL" align="right"></div>
                <div id="grdData_DETAIL"></div>
            </td>
        </tr>
    </table>
    <div id="lyrDown"></div>
</asp:Content>
