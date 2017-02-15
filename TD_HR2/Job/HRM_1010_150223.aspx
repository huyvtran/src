<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="HRM_1010.aspx.cs" Inherits="Job_HRM_1010" %>

<%@ Register Assembly="DevExpress.Web.v15.1, Version=15.1.6.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a"
    Namespace="DevExpress.Web" TagPrefix="dx" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/HRM.1010.js" type="text/javascript"></script>
    <script type="text/javascript">

        $(function () {

            gw_job_process.ready();

        });
        
    </script>
</asp:Content>
<asp:Content ID="Content8" ContentPlaceHolderID="objContentOption" runat="Server">
</asp:Content>
<asp:Content ID="Content7" ContentPlaceHolderID="objContentMenu" runat="Server">
    <div id="lyrMenu">
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
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td width="134" style="margin-right: 12px">
                <table width="100%" cellpadding="0" cellspacing="0" border="1">
                    <tr>
                        <td align="center">
                            <asp:Image ID="imgPhoto" runat="server" ToolTip="증명사진" ImageUrl="~/Style/images/noimage.jpg"
                                 style="max-width:128px; max-height: 150px; width: 100%; height: 100%" />
                        </td>
                    </tr>
                </table>
            </td>
            <td width="">
                <form id="frmData_EMP" action=""></form>
            </td>
        </tr>
        <tr>
            <td></td>
            <td align="center">
                <form id="frmServer" runat="server" style="display:none;">
                    <div id="lyrServer" class="form_2" style="width: 92px">
                        <dx:ASPxUploadControl ID="ctlUpload" runat="server" ClientInstanceName="ctlUpload" ShowProgressPanel="True"
                            NullText="Click here to browse files..." width="100%" OnFileUploadComplete="ctlUpload_FileUploadComplete" ToolTip="사진선택">
                            <ClientSideEvents
                                FileUploadComplete="function(s, e) { gw_com_DX.event_fileuploadcomplete(e); }"
                                TextChanged="function(s, e) { gw_com_module.uploadFile({ targetid: 'lyrServer', control: { by: 'DX', id: ctlUpload } }); }">
                            </ClientSideEvents>
                            <ValidationSettings
                                FileDoesNotExistErrorText="파일이 존재하지 않습니다."
                                GeneralErrorText="파일 업로드 중에 에러가 발생하였습니다."
                                MaxFileSize="4194304"
                                MaxFileSizeErrorText="파일 크기는 4MB를 넘을 수 없습니다."
                                AllowedFileExtensions=".bmp,.jpg,.gif"
                                NotAllowedFileExtensionErrorText="첨부하신 파일의 확장자는 허용되지 않습니다.">
                            </ValidationSettings>
                            <CancelButton Text="취소">
                            </CancelButton>
                        </dx:ASPxUploadControl>
                    </div>
                </form>
            </td>
        </tr>
    </table>
    <div id="lyrTab">
        <div id="lyrTab_01">
            <form id="frmData_EMP2" action=""></form>
        </div>
        <div id="lyrTab_02">
            <div id="lyrMenu_OFCODR" align="right"></div>
            <div id="grdList_OFCODR"></div>
        </div>
        <div id="lyrTab_03">
            <div id="lyrMenu_FAMILY" align="right"></div>
            <div id="grdData_FAMILY"></div>
        </div>
        <div id="lyrTab_04">
            <div id="grdList_SCHOOL"></div>
        </div>
        <div id="lyrTab_05">
            <div id="grdList_LANG"></div>
        </div>
        <div id="lyrTab_06">
            <div id="grdList_EDU"></div>
        </div>
        <div id="lyrTab_07">
            <div id="grdList_AWARD"></div>
        </div>
        <div id="lyrTab_08">
            <div id="grdList_LICENSE"></div>
        </div>
        <div id="lyrTab_09">
            <div id="grdList_EVL"></div>
        </div>
    </div>
    <div id="lyrDown"></div>
</asp:Content>
