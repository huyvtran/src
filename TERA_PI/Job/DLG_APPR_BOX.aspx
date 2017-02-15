<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="DLG_APPR_BOX.aspx.cs" Inherits="Job_DLG_APPR_BOX" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link href="/Style/approval_form.css" rel="stylesheet" type="text/css" />
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/DLG.APPR.BOX.js" type="text/javascript"></script>
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
            <td width="25%">
                <div id="frmOption2"></div>
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
	<table width="100%" cellpadding="0" cellspacing="0">
		<tr>
			<td width="20%">
				<div id="grdList_MAIN"></div>
			</td>
			<td width="">
				<div id="grdList_SUB"></div>
			</td>
		</tr>
	</table>
    <form id="frmData_HTML" action=""></form>
    <div id="grdList_FILE"></div>
    <div id="lyrDown"></div>
</asp:Content>
