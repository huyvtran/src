<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="w_mrp3230.aspx.cs" Inherits="Job_w_mrp3230" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/w.mrp3230.js" type="text/javascript"></script>
    <script type="text/javascript">

        $(function () {

            gw_job_process.ready();

        });
        
    </script>
</asp:Content>
<asp:Content ID="Content8" ContentPlaceHolderID="objContentOption" runat="Server">
    <div id="lyrRemark">
    </div>
</asp:Content>
<asp:Content ID="Content7" ContentPlaceHolderID="objContentMenu" runat="Server">
    <div id="lyrMenu_Main">
    </div>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentToggle" runat="Server">
    <form id="frmOption" action=""></form>
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="objContentRemark" runat="Server">    
</asp:Content>
<asp:Content ID="Content9" ContentPlaceHolderID="objContentData" runat="Server">
    <table border="0" cellpadding="0" cellspacing="0" style="margin: 0; padding: 0">
        <tr style="width: 100%">
            <td>
                <div id="grdData_Main" align="left"></div>
            </td>
            <td>
                <div id="grdData_Sub" align="left"></div>
            </td>
        </tr>
    </table>
    <div id="lyrMenu_D" align="right"></div>
    <div id="grdData_D"></div>
    <div id="lyrMenu_File1" align="right"></div>
    <div id="grdData_File1"></div>
    <div id="lyrDown"></div>
</asp:Content>
