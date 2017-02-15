<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="w_hcem1055.aspx.cs" Inherits="Job_w_hcem1055" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <link id="style_theme_tab" href="" rel="stylesheet" type="text/css" />
    <script src="js/w.hcem1055.js" type="text/javascript"></script>
    <script type="text/javascript">

        $(function () {

            gw_job_process.ready();

        });
        
    </script>
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="objContentOption" runat="Server">
    <div id="lyrNotice">
    </div>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentMenu" runat="Server">
    <div id="lyrMenu_1">
    </div>
    <div id="lyrMenu_2">
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
    <div id="lyrTab">
        <div id='grdData_을지목록'>
        </div>
        <div id='grdData_세부내역서'>
        </div>
    </div>
</asp:Content>
