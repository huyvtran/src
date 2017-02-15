<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="HRM_3055.aspx.cs" Inherits="Job_HRM_3055" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/HRM.3055.js" type="text/javascript"></script>
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
            <td width="30%">
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
    <div id="grdList_EMP"></div>
    <div id="grdData_BIZTRIP"></div>
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td width="40%">
                <div id="lyrMenu_BIZTRIP_DEST" align="right"></div>
            </td>
            <td width="60%">
                <div id="lyrMenu_BIZTRIP_WORK" align="right"></div>
            </td>
        </tr>
        <tr>
            <td>
                <div id="grdData_BIZTRIP_DEST"></div>
            </td>
            <td>
                <div id="grdData_BIZTRIP_WORK"></div>
            </td>
        </tr>
    </table>
    <div id="grdData_BIZTRIP_PAY"></div>
    <div id="lyrMenu_BIZTRIP_EXP" align="right"></div>
    <div id="grdData_BIZTRIP_EXP"></div>
    <form id="frmData_BIZTRIP_EXP_SUM" action=""></form>
    <div id="lyrMenu_FILE" align="right"></div>
    <div id="grdData_FILE"></div>
    <div id="lyrDown"></div>
    <div id="grdList_BIZTRIP_CHK"></div>
</asp:Content>
