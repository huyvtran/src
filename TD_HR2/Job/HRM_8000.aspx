<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="HRM_8000.aspx.cs" Inherits="JOB_HRM_8000" %>

<%@ Register Assembly="DevExpress.Web.v15.1, Version=15.1.6.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a"
    Namespace="DevExpress.Web" TagPrefix="dx" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/HRM.8000.js" type="text/javascript"></script>
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
                    <td align="center">
                        <form id="frmServer" runat="server">
                            <div id="lyrServer" class="form_2" style="width: 88px; display:none;">
                                <dx:ASPxUploadControl ID="ctlUpload" runat="server" ClientInstanceName="ctlUpload" ShowProgressPanel="True"
                                                NullText="Click here to browse files..." width="100%" OnFileUploadComplete="ctlUpload_FileUploadComplete" ToolTip="HRM">
                                                <ClientSideEvents
                                                    FileUploadComplete="function(s, e) { e.handler_success = successUpload; gw_com_DX.event_fileuploadcomplete(e); }"
                                                    TextChanged="function(s, e) { gw_com_module.uploadFile({ targetid: 'lyrServer', control: { by: 'DX', id: ctlUpload } }); }">
                                                </ClientSideEvents>
                                                <ValidationSettings
                                                    FileDoesNotExistErrorText="파일이 존재하지 않습니다."
                                                    GeneralErrorText="파일 업로드 중에 에러가 발생하였습니다."
                                                    MaxFileSize="4194304"
                                                    MaxFileSizeErrorText="파일 크기는 4MB를 넘을 수 없습니다."
                                                    AllowedFileExtensions=".bmp,.jpg,.jpeg,.jpe,.gif,.png"
                                                    NotAllowedFileExtensionErrorText="첨부하신 파일의 확장자는 허용되지 않습니다.">
                                                </ValidationSettings>
                                                <CancelButton Text="취소">
                                                </CancelButton>
                                            </dx:ASPxUploadControl>
                            </div>
                        </form>
                    </td>
                    <td></td>
                </tr>
            </table>
            <form id="frmData_학력" action="">
            </form>
            <form id="frmData_병역" action="">
            </form>
            <form id="frmData_건강" action="">
            </form>
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
            <div id="btn_가족" align="right"></div>
            <div id="grdData_가족"></div>
            <form id="frmData_가족" action=""></form>
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
            <form id="frmData_경력2" action=""></form>
            <div id="btn_경력" align="right"></div>
            <div id="grdData_경력"></div>
            <form id="frmData_경력" action=""></form>
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
            <div id="btn_외국어" align="right"></div>
            <div id="grdData_외국어"></div>
            <div id="btn_수상" align="right"></div>
            <div id="grdData_수상"></div>
            <div id="btn_해외" align="right"></div>
            <div id="grdData_해외"></div>
            <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                    <td>
                        <div id="lyrRmk4" style="display:none;">
                            <p>※ <font color="red"><b>[이전]</b></font>, <font color="red"><b>[다음]</b></font> 버튼을 누르면 수정된 내용이 저장됩니다.</p>
                        </div>
                    </td>
                    <td>
                        <div id="btnMove_4" align="right"></div>
                    </td>
                </tr>
            </table>
        </div>
        <div id="lyrTab_5">
            <div id="btn_자격" align="right"></div>
            <div id="grdData_자격"></div>
            <div id="btn_능력" align="right"></div>
            <div id="grdData_능력"></div>
            <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                    <td>
                        <div id="lyrRmk5" style="display:none;">
                            <p>※ <font color="red"><b>[이전]</b></font>, <font color="red"><b>[다음]</b></font> 버튼을 누르면 수정된 내용이 저장됩니다.</p>
                        </div>
                    </td>
                    <td>
                        <div id="btnMove_5" align="right"></div>
                    </td>
                </tr>
            </table>
        </div>
        <div id="lyrTab_6">
            <form id="frmData_자기소개" action=""></form>
            <form id="frmData_추천" action=""></form>
            <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                    <td>
                        <div id="lyrRmk6" style="display:none;">
                            <p>※ <font color="red"><b>[이전]</b></font>, <font color="red"><b>[저장]</b></font>, <font color="red"><b>[제출]</b></font> 버튼을 누르면 수정된 내용이 저장됩니다.</p>
                        </div>
                    </td>
                    <td>
                        <div id="btnMove_6" align="right"></div>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</asp:Content>
