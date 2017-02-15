<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="HRM_8110.aspx.cs" Inherits="JOB_HRM_8110" %>
<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/HRM.8110.js" type="text/javascript"></script>
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
    <form id="frmOption" action="">
    </form>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentRemark" runat="Server">
    <div id="lyrRemark">
    </div>
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderID="objContentData" runat="Server">
    <div id="lyrTab">
        <div id="lyrTab_1">
            <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                    <td>
                        <div id="lyrRemark_1"></div>
                    </td>
                    <td>
                        <div id="lyrMenu_1" align="right"></div>
                    </td>
                </tr>
            </table>
            <div id="grdList_Main"></div>
        </div>
        <div id="lyrTab_2">
            <div id="lyrMenu_2" align="right"></div>
            <table width="1155" cellpadding="0" cellspacing="0">
                <tr>
                    <td width="100%" colspan="4">
                        <form id="frmData_Main" action=""></form>
                    </td>
                </tr>
                <tr>
                    <td width="800">
                        <div id="lyrMenu_3" align="right"></div>
                        <form id="frmData_Sub" action=""></form>
                    </td>
                    <td width="150">
                        <div id="grdList_CAT"></div>
                    </td>
                    <td width="55" align="center">
                        <div id="btnArrow" style="display: none">
                            <p><button id="btnRightAll">>></button></p>
                            <p><button id="btnRight">></button></p>
                            <p><button id="btnLeft"><</button></p>
                            <p><button id="btnLeftAll"><<</button></p>
                        </div>
                    </td>
                    <td width="150">
                        <div id="grdData_Sub"></div>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</asp:Content>
