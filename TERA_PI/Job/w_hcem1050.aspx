<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="w_hcem1050.aspx.cs" Inherits="Job_w_hcem1050" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <link id="style_theme_tab" href="" rel="stylesheet" type="text/css" />
    <script src="js/w.hcem1050.js" type="text/javascript"></script>
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
    <form id="frmOption_1" action="">
    </form>
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderID="objContentRemark" runat="Server">
    <div id="lyrRemark">
    </div>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="objContentData" runat="Server">
    <div id='grdData_정보'>
    </div>
    <div id="lyrMenu_2" align="right">
    </div>
    <div style="position: absolute; z-index: 10; width: 100%; top: 100;">
        <form id="frmOption_2" action="">
        </form>
    </div>
    <div id='grdData_내역'>
    </div>
</asp:Content>
