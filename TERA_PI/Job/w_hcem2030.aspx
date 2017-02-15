<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="w_hcem2030.aspx.cs" Inherits="Job_w_hcem2030" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <link id="style_theme_tab" href="" rel="stylesheet" type="text/css" />
    <script src="js/w.hcem2030.js" type="text/javascript"></script>
    <script type="text/javascript">

        $(function () {

            gw_job_process.ready();

        });
        
    </script>
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="objContentOption" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentMenu" runat="Server">
    <div id="lyrMenu_1">
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="objContentToggle" runat="Server">
    <form id="frmOption_1_1" action="">
    </form>
    <form id="frmOption_1_2" action="">
    </form>
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderID="objContentRemark" runat="Server">
    <div id="lyrRemark_1">
    </div>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="objContentData" runat="Server">
    <form id='frmData_국내갑지' action="">
    </form>
    <form id='frmData_해외갑지' action="">
    </form>
    <div id='grdData_집계'>
    </div>
    <div id="lyrMenu_2" align="right">
    </div>
    <div style="position: absolute; z-index: 10; width: 100%; top: 100;">
        <form id="frmOption_2_1" action="">
        </form>
        <form id="frmOption_2_2" action="">
        </form>
        <form id="frmOption_2_3_국내" action="">
        </form>
        <form id="frmOption_2_3_해외" action="">
        </form>
    </div>
    <div id="lyrRemark_2" style="margin-top: 5px; margin-bottom: 2px;">
    </div>
    <div id='grdData_국내을지'>
    </div>
    <div id='grdData_해외을지'>
    </div>
    <div id="lyrMenu_3" align="right">
    </div>
    <div style="position: absolute; z-index: 10; width: 100%; top: 100;">
        <form id="frmOption_3_1" action="">
        </form>
        <form id="frmOption_3_2" action="">
        </form>
    </div>
    <div id='grdData_국내내역'>
    </div>
    <div id='grdData_해외내역'>
    </div>
    <div id="lyrDown">
    </div>
</asp:Content>
