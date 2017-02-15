<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="HRM_2110.aspx.cs" Inherits="Job_HRM_2110" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/HRM.2110.js?ver=20160127_1" type="text/javascript"></script>
    <script type="text/javascript">

        $(function () {

            gw_job_process.ready();

        });
        
    </script>
</asp:Content>
<asp:Content ID="Content8" ContentPlaceHolderID="objContentOption" runat="Server">
</asp:Content>
<asp:Content ID="Content7" ContentPlaceHolderID="objContentMenu" runat="Server">
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td width="15%">
                <div id="lyrRemark2"></div>
            </td>
            <td width="" align="right">
                <div id="lyrMenu"></div>
            </td>
        </tr>
    </table>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentToggle" runat="Server">
    <form id="frmOption" action="">
    </form>
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="objContentRemark" runat="Server">
    <div id="lyrRemark">
    </div>
</asp:Content>
<asp:Content ID="Content9" ContentPlaceHolderID="objContentData" runat="Server">
    <div id="lyrTab">
        <div id="lyrTab_01">
            <div id="grdData_TAXADJ_FAMILY"></div>
        </div>
        <div id="lyrTab_02">
            <div id="grdData_TAXADJ_OFC"></div>
        </div>
        <div id="lyrTab_03">
            <div id="grdData_TAXADJ_MEDI"></div>
        </div>
        <div id="lyrTab_04">
            <div id="grdData_TAXADJ_GIBU"></div>
        </div>
        <div id="lyrTab_05">
            <div id="grdData_TAXADJ_ANNUITY"></div>
        </div>
        <div id="lyrTab_06">
            <div id="grdData_TAXADJ_RENT"></div>
        </div>
        <div id="lyrTab_07">
            <div id="grdData_TAXADJ_FILE"></div>
        </div>
    </div>
    <div id="grdData_TAXADJ_EMP_101"></div>
    <div id="grdData_TAXADJ_EMP_201"></div>
    <div id="grdData_TAXADJ_EMP_205"></div>
    <div id="grdData_TAXADJ_EMP_210"></div>
    <div id="grdData_TAXADJ_EMP_230"></div>
    <div id="grdData_TAXADJ_EMP_240"></div>
    <div id="grdData_TAXADJ_EMP_250"></div>
    <div id="grdData_TAXADJ_EMP_260"></div>
    <div id="grdData_TAXADJ_EMP_300"></div>
    <div id="grdData_TAXADJ_EMP_310"></div>
    <div id="grdData_TAXADJ_EMP_320"></div>
    <div id="lyrDown"></div>
</asp:Content>
