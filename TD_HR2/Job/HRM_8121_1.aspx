<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="HRM_8121_1.aspx.cs" Inherits="JOB_HRM_8121" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/HRM.8121.1.js" type="text/javascript"></script>
    <script type="text/javascript">

        $(function () {

            gw_job_process.ready();

        });

    </script>
</asp:Content>
<asp:Content ID="Content8" ContentPlaceHolderID="objContentOption" runat="Server">
</asp:Content>
<asp:Content ID="Content7" ContentPlaceHolderID="objContentMenu" runat="Server">
    <div id="lyrMenu_Main">
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
<asp:Content ID="Content9" ContentPlaceHolderID="objContentData" runat="Server">
    <div id="lyrTab">
        <div id="lyrTab_1">
            <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                    <td width="170" style="margin-right: 12px">
                        <table id="tbl_사진" style="width:154px; height:184px; display:none;" border="1" cellpadding="0" cellspacing="0">
                            <tr>
                                <td>
                                    <img id="img_사진" alt="증명사진" src="/Files/Recruit/noimage.jpg"
                                         style="max-width:154px; max-height: 181px; width: 100%; height: 100%" />
                                </td>
                            </tr>
                        </table>
<!--
                        <form id="frmData_사진" action=""></form>
-->
                    </td>
                    <td width="">
                        <form id="frmData_지원정보" action=""></form>
                        <form id="frmData_인적" action=""></form>
                    </td>
                </tr>
                <tr>
                    <td></td>
                    <td align="center">
                    </td>
                </tr>
            </table>
            <form id="frmData_학력" action="">
            </form>
            <form id="frmData_병역" action="">
            </form>
            <form id="frmData_건강" action="">
            </form>
            <div id="btn_가족" align="right"></div>
            <div id="grdData_가족"></div>
            <form id="frmData_가족" action=""></form>
            <table width="100%" cellpadding="0" cellspacing>
                <tr>
                    <td>
                        <div id="lyrRmk1" style="display:none;">
                            <p>※ <font color="red"><b>[다음]</b></font> 버튼을 누르면 수정된 내용이 저장됩니다.</p>
                        </div>
                    </td>
                    <td>
                        <div id="btnMove_1" align="right"></div>
                    </td>
                </tr>
            </table>
        </div>
        <div id="lyrTab_2">
            <form id="frmData_경력2" action=""></form>
            <div id="btn_경력" align="right"></div>
            <div id="grdData_경력"></div>
            <form id="frmData_경력" action=""></form>
            <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                    <td>
                        <div id="lyrRmk2" style="display:none;">
                            <p>※ <font color="red"><b>[이전]</b></font>, <font color="red"><b>[다음]</b></font> 버튼을 누르면 수정된 내용이 저장됩니다.</p>
                        </div>
                    </td>
                    <td>
                        <div id="btnMove_2" align="right"></div>
                    </td>
                </tr>
            </table>
        </div>
        <div id="lyrTab_3">
            <div id="btn_수상" align="right"></div>
            <div id="grdData_수상"></div>
            <div id="btn_사회" align="right"></div>
            <div id="grdData_사회"></div>
            <div id="btn_해외" align="right"></div>
            <div id="grdData_해외"></div>
            <div id="btn_자격" align="right"></div>
            <div id="grdData_자격"></div>
            <div id="btn_외국어" align="right"></div>
            <div id="grdData_외국어"></div>
            <div id="btn_능력" align="right"></div>
            <div id="grdData_능력"></div>
            <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                    <td>
                        <div id="lyrRmk3" style="display:none;">
                            <p>※ <font color="red"><b>[이전]</b></font>, <font color="red"><b>[다음]</b></font> 버튼을 누르면 수정된 내용이 저장됩니다.</p>
                        </div>
                    </td>
                    <td>
                        <div id="btnMove_3" align="right"></div>
                    </td>
                </tr>
            </table>
        </div>
        <div id="lyrTab_4">
            <form id="frmData_자기소개" action=""></form>
            <form id="frmData_추천" action=""></form>
            <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                    <td>
                        <div id="lyrRmk4" style="display:none;">
                            <p>※ <font color="red"><b>[이전]</b></font>, <font color="red"><b>[저장]</b></font>, <font color="red"><b>[제출]</b></font> 버튼을 누르면 수정된 내용이 저장됩니다.</p>
                        </div>
                    </td>
                    <td>
                        <div id="btnMove_4" align="right"></div>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</asp:Content>
