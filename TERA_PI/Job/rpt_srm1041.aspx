<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Report_1.master" AutoEventWireup="true"
    CodeFile="rpt_srm1041.aspx.cs" Inherits="Job_rpt_srm1041" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <script src="js/rpt.srm1041.js" type="text/javascript"></script>
    <script type="text/javascript">

        $(function () {

            gw_job_process.ready();

        });

    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentOverview" runat="Server">
    <form id="frmOverview" action="">
    </form>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="objContentData" runat="Server">
    <div id="grdData_현황">
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="objContentFooter" runat="Server">
    <form id="frmFooter" action="">
    </form>
</asp:Content>
