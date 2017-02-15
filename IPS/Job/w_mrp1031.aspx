<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="w_mrp1031.aspx.cs" Inherits="JOB_w_mrp1031" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/w.mrp1031.js" type="text/javascript"></script>
    <script type="text/javascript">

        $(function () {

            gw_job_process.ready();

        });

    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentOption" runat="Server">
    <form id="frmOption" action="">
    </form>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="objContentMenu" runat="Server">
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
<asp:Content ID="Content6" ContentPlaceHolderID="objContentToggle" runat="Server">
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="objContentRemark" runat="Server">
    <div id="lyrRemark">
    </div>
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderID="objContentData" runat="Server">
	<table width="100%" cellpadding="0" cellspacing="0">
		<tr>
			<td width="50%">
				<form id="frmData_MAIN" action="">
				</form>
			</td>
			<td width="50%">
				<form id="frmData_SUB" action="">
				</form>
			</td>
		</tr>
		<tr>
			<td>
			    <div id="grdList_MAIN">
			    </div>
			</td>
			<td>
			    <div id="grdList_SUB">
			    </div>
			</td>
		</tr>
	</table>
</asp:Content>
