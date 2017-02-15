<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_9.master" AutoEventWireup="true"
    CodeFile="SRM_4323.aspx.cs" Inherits="Job_SRM_4323" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/SRM.4323.js" type="text/javascript"></script>
    <script type="text/javascript">
        $(function () { gw_job_process.ready(); });
    </script>
</asp:Content>
<%--<asp:Content ID="Content2" ContentPlaceHolderID="objContentOption" runat="Server">
    <form id="frmOption" action="">
    </form>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="objContentMenu" runat="Server">
    <div id="lyrMenu"></div>
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="objContentToggle" runat="Server">
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="objContentRemark" runat="Server">
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderID="objContentData" runat="Server">
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td>
                <div id="grdList_MAIN"></div>
            </td>
            <td rowspan="2">
                <div id="grdList_SUB"></div>
            </td>
        </tr>
        <tr>
            <td>
                <div id="grdList_DETAIL"></div>
            </td>
        </tr>
    </table>
</asp:Content>--%>



<asp:Content ID="Content7" ContentPlaceHolderID="objContentOption" runat="Server">
    <form id="frmOption" action="">
    </form>
</asp:Content>
<asp:Content ID="Content8" ContentPlaceHolderID="objContentMenu" runat="Server">
    <div id="lyrMenu">
    </div>
</asp:Content>
<asp:Content ID="Content9" ContentPlaceHolderID="objContentToggle" runat="Server">
</asp:Content>
<asp:Content ID="Content10" ContentPlaceHolderID="objContentRemark" runat="Server">
    <div id="lyrRemark">
    </div>
</asp:Content>
<asp:Content ID="Content11" ContentPlaceHolderID="objContentData_1" runat="Server">
    <div id="grdList_MAIN">
    </div>
    <div id="grdList_SUB">
    </div>
</asp:Content>
<asp:Content ID="Content12" ContentPlaceHolderID="objContentData_2" runat="Server">
    <div id="grdList_DETAIL">
    </div>
</asp:Content>
