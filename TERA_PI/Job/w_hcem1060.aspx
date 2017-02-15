<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_9.master" AutoEventWireup="true"
    CodeFile="w_hcem1060.aspx.cs" Inherits="Job_w_hcem1060" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/w.hcem1060.js" type="text/javascript"></script>
    <script type="text/javascript">

        $(function () {

            gw_job_process.ready();

        });
        
    </script>
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="objContentOption" runat="Server">
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="objContentMenu" runat="Server">
    <div id="lyrMenu">
    </div>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="objContentToggle" runat="Server">
    <form id="frmOption_1" action="">
    </form>
    <form id="frmOption_2" action="">
    </form>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentRemark" runat="Server">
    <div id="lyrRemark_1" style="float:left; width:330px;">
    </div>
    <div id="lyrRemark_2" style="margin-left:330px;">
    </div>
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderID="objContentData_1" runat="Server">
    <div id="grdData_임시">
    </div>
</asp:Content>
<asp:Content ID="Content12" ContentPlaceHolderID="objContentData_2" runat="Server">
    <div id="grdData_고객">
    </div>
</asp:Content>
