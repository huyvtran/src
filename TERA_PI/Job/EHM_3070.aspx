<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="EHM_3070.aspx.cs" Inherits="JOB_EHM_3070" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/EHM.3070.js" type="text/javascript"></script>
    <script type="text/javascript">

        $(function () {

            gw_job_process.ready();

        });
        
    </script>
</asp:Content>
<asp:Content ID="Content8" ContentPlaceHolderID="objContentOption" runat="Server">
    
</asp:Content>
<asp:Content ID="Content7" ContentPlaceHolderID="objContentMenu" runat="Server">
    <div id="lyrMenu_1">
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
<asp:Content ID="Content5" ContentPlaceHolderID="objContentData" runat="Server">
    <div id="grdData_정보">
    </div>
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td></td>
            <td>
                <div id="lyrMenu_측정" align="right"></div>
            </td>
        </tr>
        <tr>
            <td width="60%">
                <form id="frmData_내역" action="">
                </form>
            </td>
            <td width="">
                <div id="grdData_측정">
                </div>
            </td>
        </tr>
    </table>
    <div id="lyrMenu_2" align="right">
    </div>
    <div id="grdData_담당">
    </div>
    <form id="frmData_담당" action="">
    </form>
    <div id="lyrMenu_3" align="right">
    </div>
    <div id="grdData_첨부">
    </div>
    <div id="lyrDown">
    </div>
</asp:Content>
