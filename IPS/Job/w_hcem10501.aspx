<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Job_1.master" AutoEventWireup="true"
    CodeFile="w_hcem10501.aspx.cs" Inherits="Job_w_hcem10501" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">

    <script src="js/w.hcem10501.js" type="text/javascript"></script>

    <script type="text/javascript">

        $(function() {

            gw_job_process.ready();

        });
        
    </script>

</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentMenu" runat="Server">
    <div id="lyrMenu_1">
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="objContentOption" runat="Server">
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="objContentData" runat="Server">
    <div id="lyrTab">
        <div id='grdData_을지목록'>
        </div>
        <div id='grdData_세부내역서'>
        </div>
    </div>
</asp:Content>
