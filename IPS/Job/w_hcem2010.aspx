<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_5.master" AutoEventWireup="true"
    CodeFile="w_hcem2010.aspx.cs" Inherits="Job_w_hcem2010" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <link id="style_theme_tab" href="" rel="stylesheet" type="text/css" />
    <script src="js/w.hcem2010.js" type="text/javascript"></script>
    <script type="text/javascript">

        $(function () {

            gw_job_process.ready();

        });
        
    </script>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="objContentOption_1" runat="Server">
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="objContentMenu_1" runat="Server">
    <div id="lyrMenu_1">
    </div>
</asp:Content>
<asp:Content ID="Content9" ContentPlaceHolderID="objContentOption_2" runat="Server">
</asp:Content>
<asp:Content ID="Content10" ContentPlaceHolderID="objContentMenu_2" runat="Server">
    <div id="lyrMenu_2">
    </div>
    <div id="lyrMenu_3">
    </div>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentToggle" runat="Server">
    <form id="frmOption" action="">
    </form>
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="objContentRemark" runat="Server">
    <div id="lyrRemark">
    </div>
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderID="objContentData_1" runat="Server">
    <div id="grdData_현황">
    </div>
</asp:Content>
<asp:Content ID="Content7" ContentPlaceHolderID="objContentData_2" runat="Server">
    <form id="frmData_현황" action="">
    </form>
</asp:Content>
<asp:Content ID="Content8" ContentPlaceHolderID="objContentData_3" runat="Server">
    <div id="lyrTab">
        <div id="grdData_메일">
        </div>
        <div id="grdData_파일">
        </div>
    </div>
    <div id="lyrDown">
    </div>
</asp:Content>
