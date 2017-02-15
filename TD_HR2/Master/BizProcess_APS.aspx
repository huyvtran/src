<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Biz.master" AutoEventWireup="true"
    CodeFile="BizProcess_APS.aspx.cs" Inherits="Master_BizProcess" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objMasterHead" runat="Server">
    <link id="style_theme" href="../Style/theme-smoothness/jquery-ui-1.8.9.custom.css"
        rel="stylesheet" type="text/css" />
    
    
    <script src="js/master.biz_aps.js" type="text/javascript"></script>
    <script src="../Lib/js/lib.encrypt_1.js" type="text/javascript"></script>
    <script type="text/javascript">

        $(document).ready(function ($) {

            gw_job_process.login("<%=param%>");

        });
        
    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objMasterContent" runat="Server">
</asp:Content>
