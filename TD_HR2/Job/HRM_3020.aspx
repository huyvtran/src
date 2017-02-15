<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="HRM_3020.aspx.cs" Inherits="Job_HRM_3020" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/HRM.3020.js" type="text/javascript"></script>
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
            <td width="40%">
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
    <div id="grdList_HOLIDAY_Y"></div>
    <form id="frmData_HOLIDAY" action=""></form>
    <div id="grdList_HOLIDAY_CHK"></div>
    <div id="grdData_HOLIDAY"></div>
    <div id="lyrMenu_FILE" align="right"></div>
    <div id="grdData_FILE"></div>
    <div id="grdList_CALC_DATE"></div>
    <form id="frmData_HOLIDAY_RULE" action=""></form>
    <div id="lyrDown"></div>
</asp:Content>
