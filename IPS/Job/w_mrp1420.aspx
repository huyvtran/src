<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_14.master" AutoEventWireup="true"
    CodeFile="w_mrp1420.aspx.cs" Inherits="Job_w_mrp1420" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/w.mrp1420.js" type="text/javascript"></script>
    <script type="text/javascript">

        $(function () {

            gw_job_process.ready();

        });
        
    </script>
</asp:Content>
<asp:Content ID="Content8" ContentPlaceHolderID="objContentOption" runat="Server">
    <div id="lyrRemark">
    </div>
</asp:Content>
<asp:Content ID="Content7" ContentPlaceHolderID="objContentMenu" runat="Server">
    <div id="lyrMenu_Main"></div>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentToggle" runat="Server">
    <form id="frmOption" action=""></form>
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="objContentRemark" runat="Server">    
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderID="objContentData_1" runat="Server">
    <form id="frmData_Main" action=""></form>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="objContentHTML" runat="Server">
    <table border="0" cellpadding="0" cellspacing="0" style="margin: 0; padding: 0">
        <tr>
            <td style="width: 60%">
                <form id="frmData_MemoA" action="">
                </form>
            </td>
            <td style="width: 40%">
                <form id="frmData_MemoB" action="">
                </form>
            </td>
        </tr>
    </table>
    <form id="frmData_MemoTop" action=""></form>
    <form id="frmData_MemoBot" action=""></form>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="objContentData_2" runat="Server">
    <table border="0" cellpadding="0" cellspacing="0" style="margin: 0; padding: 0">
        <tr valign="bottom">
            <td style="width: 60%">
                <div id="lyrMenu_D1" align="right"></div>
            </td>
            <td style="width: 40%">
                <div id="lyrMenu_D2" align="right"></div>
            </td>
        </tr>
        <tr valign="top">
            <td>
                <div id="grdData_D1">
                </div>
            </td>
            <td>
                <div id="grdData_D2">
                </div>
            </td>
        </tr>
    </table>
    <div id="lyrMenu_Sub" align="right"></div>
    <div id="grdData_Sub"></div>
    <div id="lyrMenu_File1" align="right"></div>
    <div id="grdData_File1"></div>
    <div id="grdData_Temp1"></div>
    <div id="lyrDown"></div>
</asp:Content>
