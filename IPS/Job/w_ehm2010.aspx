﻿<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="w_ehm2010.aspx.cs" Inherits="Job_w_ehm2010" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <link id="style_theme_tab" href="" rel="stylesheet" type="text/css" />
    <script src="js/w.ehm2010.js" type="text/javascript"></script>
    <script type="text/javascript">

        $(function () {

            gw_job_process.ready();

        });
        
    </script>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="objContentOption" runat="Server">
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="objContentMenu" runat="Server">
    <div id="lyrMenu_1_1">
    </div>
    <div id="lyrMenu_1_2">
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
    <div id="lyrTab">
        <div id="lyrData_등록">
            <div id="grdData_발생정보">
            </div>
            <form id="frmData_발생정보" action="">
            </form>
            <div id="lyrMenu_2" align="right">
            </div>
            <div id="grdData_발생내역">
            </div>
            <form id="frmData_발생현상상세" action="">
            </form>
            <div id="lyrMenu_3" align="right">
            </div>
            <div id="grdData_조치내역">
            </div>
            <form id="frmData_조치내역상세" action="">
            </form>
            <div id="lyrMenu_4" align="right">
            </div>
            <div id="grdData_교체PART">
            </div>
            <form id="frmData_교체내역상세" action="">
            </form>
            <div id="lyrMenu_5" align="right">
            </div>
            <div id="grdData_첨부파일">
            </div>
            <div id="lyrDown">
            </div>
            <div id="lyrMenu_6" align="right">
            </div>
            <form id="frmData_상세메모" action="" style="margin-top: 4px">
            </form>
        </div>
    </div>
</asp:Content>