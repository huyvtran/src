<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="w_hcem2040.aspx.cs" Inherits="Job_w_hcem2040" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <link id="style_theme_tab" href="" rel="stylesheet" type="text/css" />
    <script src="js/w.hcem2040.js" type="text/javascript"></script>
    <script type="text/javascript">

        $(function () {

            gw_job_process.ready();

        });
        
    </script>
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="objContentOption" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentMenu" runat="Server">
    <div id="lyrMenu">
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="objContentToggle" runat="Server">
    <form id="frmOption_1" action="">
    </form>
    <form id="frmOption_2" action="">
    </form>
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderID="objContentRemark" runat="Server">
    <div id="lyrRemark">
    </div>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="objContentData" runat="Server">
    <div id='grdData_현황'>
    </div>
    <form id='frmData_국내갑지' action="">
    </form>
    <form id='frmData_해외갑지' action="">
    </form>
    <div id='grdData_집계'>
    </div>
    <div id='grdData_국내을지'>
    </div>
    <div id='grdData_해외을지'>
    </div>
    <div id='grdData_국내내역'>
    </div>
    <div id='grdData_해외내역'>
    </div>
    <div id="lyrDown">
    </div>
</asp:Content>
