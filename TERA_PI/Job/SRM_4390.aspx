<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="SRM_4390.aspx.cs" Inherits="Job_SRM_4390" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/SRM.4390.js" type="text/javascript"></script>
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
            <td width="40%">
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
	<table border="0" cellpadding="0" cellspacing="0">
		<tr>
			<td width="100">
				<div id="grdList_MAIN"></div>
			</td>
			<td width="">
				<form id="frmOption_2" action=""></form>
				<div id="grdData_SUB"></div>
			</td>
		</tr>
	</table>
    <div id="lyrDown"></div>
</asp:Content>
