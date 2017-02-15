<%@ Page Language="C#" MasterPageFile="~/Master/SRM.master" AutoEventWireup="true"
    CodeFile="SRMProcess.aspx.cs" Inherits="Master_SRMProcess" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objMasterHead" runat="Server">
    <link id="style_theme" href="../Style/theme-smoothness/jquery-ui-1.8.9.custom.css"
        rel="stylesheet" type="text/css" />
    <script src="js/master.srm.js" type="text/javascript"></script>
    <script type="text/javascript">

        $(document).ready(function ($) {

            gw_job_process.before();

        });
        
    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objMasterContent" runat="Server">
    <table id="lyrMaster" border="0" width="1200px" cellspacing="0" style="padding: 0;
        margin: 0; display: none;">
        <tr>
            <td width="100%" valign="bottom">
                <table border="0" width="100%" cellspacing="0" style="padding: 0; margin: 0; white-space: nowrap;
                    border-bottom: #D6D9DE solid 1px; background: url(../style/images/master/biz_top.png) top repeat-x;">
                    <tr>
                        <td align="left" style="padding-left: 25px;">
                            <img src="../style/images/master/biz_logo.png" alt="IPS 홈페이지" title="IPS 홈페이지" style="cursor:pointer;" onclick="window.open('http://www.ips.co.kr', '_blank');" />
                        </td>
                        <td width="100%" align="right" valign="middle" style="padding-right: 50px;">
                            <div id="lyrInfo">
                            </div>
                        </td>
                        <td width="100%" align="right" style="padding-right: 10px;">
                            <button id="btnHome" style="border: 0; margin: 0; padding: 0; background-color: Transparent;
                                cursor: pointer;">
                                <img src="../style/images/master/btnHome.png" alt="메인으로" title="메인으로" /></button>
                            <button id="btnInfo" style="border: 0; margin: 0; padding: 0; background-color: Transparent; cursor: pointer;">
                                <img src="../style/images/master/btnInfo.png" alt="협력사정보" title="협력사정보" /></button>
                            <button id="btnNotice" style="border: 0; margin: 0; padding: 0; background-color: Transparent; cursor: pointer;">
                                <img src="../style/images/master/btnNotice.png" alt="공지사항" title="공지사항"/></button>
                            <!--
                            <button id="btnSMS" style="border: 0; margin: 0; padding: 0; background-color: Transparent; cursor: pointer;">
                                <img src="../style/images/master/btnSms.png" alt="SMS" title="SMS" /></button>
                            <button id="btnMail" style="border: 0; margin: 0; padding: 0; background-color: Transparent; cursor: pointer;">
                                <img src="../style/images/master/btnMail.png" alt="e-Mail" title="e-Mail" /></button>
                                -->
                            <!--
                            <button id="btnOption" style="border: 0; margin: 0; padding: 0; background-color: Transparent; cursor: pointer;">
                                <img src="../style/images/master/btnOption.png" alt="옵션" title="옵션" /></button>
                                -->
                            <button id="btnHelp" style="border: 0; margin: 0; padding: 0; background-color: Transparent; cursor: pointer;">
                                <img src="../style/images/master/btnHelp.png" alt="도움말" title="도움말" /></button>
                            <button id="btnLeave" style="border: 0; margin: 0; padding: 0; background-color: Transparent; cursor: pointer;">
                                <img src="../style/images/master/btnLogout.png" alt="로그아웃" title="로그아웃" /></button>
                        </td>
                    </tr>
                </table>
                <!---->
                <div style="width: 1200px; position: absolute; z-index: 10; top: 100;">
                    <table width="100%" border="0" cellpadding="1" cellspacing="0" style="margin: 0;
                        margin-top: 2px; padding: 0; white-space: nowrap;">
                        <tr>
                            <td align="right" valign="top">
                                <form id="frmOption" action="">
                                </form>
                            </td>
                        </tr>
                    </table>
                </div>
                <!---->
            </td>
        </tr>
        <tr>
            <td>
                <table border="0" width="100%" cellspacing="0" style="height: 560px; padding: 0;
                    margin: 0; white-space: nowrap;">
                    <tr>
                        <td valign="top" style="border-right: 1px;">
                            <div style="width: 100%;" id="srmMenu">
                            </div>
                        </td>
                        <td valign="top">
                            <img id="imgMenu" alt="Arrow" src="../style/images/master/imgMenu_Show.png" style="cursor: pointer;" />
                        </td>
                        <td width="100%" valign="top">
                            <table border="0" width="100%" cellspacing="0" style="padding: 0; margin: 0; white-space: nowrap;">
                                <tr>
                                    <td valign="top">
                                        <div class="workarea_bg" style="height: 600px;">
                                            <div id="tabs">
                                                <ul>
                                                </ul>
                                            </div>
                                            <div id="lyrNotice" style="width: 400px; overflow: hidden; margin-top: 320px; margin-left: 200px;">
                                                <table border="0" width="100%" cellpadding="5px">
                                                    <tr>
                                                        <td colspan="3" align="left" style="border-bottom: 1px solid gray;">
                                                            <img src="../style/images/master/biz_notice.png" alt="공지사항" />
                                                            <img id="imgNotice" align="right" src="../style/images/master/biz_more.gif" alt="공지사항 조회"
                                                                style="cursor: pointer;" title="공지사항 조회" />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <table id="tblNotice" border="0" cellpadding="2" cellspacing="2" style="margin: 0;
                                                                padding: 0;">
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <!--
                                <tr>
                                    <td>
                                        <table width="100%" cellspacing="5px" style="border-top: #D6D9DE solid 1px; padding: 0;
                                            margin: 0; white-space: nowrap;">
                                            <tr>
                                                <td align="center">
                                                    <img alt="ATTO" src="../style/images/master/biz_bottom.gif" onclick="window.scroll(0,0);" />
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                -->
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</asp:Content>
