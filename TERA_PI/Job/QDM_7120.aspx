<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="QDM_7120.aspx.cs" Inherits="Job_QDM_7120" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/QDM.7120.js" type="text/javascript"></script>
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
    <div id="lyrMenu_MAIN" align="right"></div>
    <form id="frmData_MAIN" action=""></form>
    <table border="0" cellpadding="0" cellspacing="0" style="margin: 0; padding: 0">
        <tr>
            <td style="width: 50%">
                <form id="frmData_MEMO_A" action="">
                </form>
            </td>
            <td style="width: 50%">
                <form id="frmData_MEMO_B" action="">
                </form>
            </td>
        </tr>
        <tr>
            <td>
                <div id="lyrMenu_IMAGE_A" align="right"></div>
            </td>
            <td>
                <div id="lyrMenu_IMAGE_B" align="right"></div>
            </td>
        </tr>
        <tr>
            <td>
                <form id="frmData_IMAGE_A" action="">
                </form>
            </td>
            <td>
                <form id="frmData_IMAGE_B" action="">
                </form>
            </td>
        </tr>
    </table>
    <div id="lyrMenu_FILE" align="right"></div>
    <div id="grdData_FILE"></div>
    <div id="lyrDown"></div>
</asp:Content>
