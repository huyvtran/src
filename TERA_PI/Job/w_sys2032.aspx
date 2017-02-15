<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_10.master" AutoEventWireup="true"
    CodeFile="w_sys2032.aspx.cs" Inherits="Job_w_sys2032" %>

<%@ Register Assembly="DevExpress.Web.ASPxHtmlEditor.v15.1, Version=15.1.4.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a"
    Namespace="DevExpress.Web.ASPxHtmlEditor" TagPrefix="dx" %>
<%@ Register Assembly="DevExpress.Web.v15.1, Version=15.1.4.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a"
    Namespace="DevExpress.Web" TagPrefix="dx" %>
<%@ Register Assembly="DevExpress.Web.ASPxSpellChecker.v15.1, Version=15.1.4.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a"
    Namespace="DevExpress.Web.ASPxSpellChecker" TagPrefix="dx" %>
<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/w.sys2032.js" type="text/javascript"></script>
    <script type="text/javascript">

        $(function () {

            gw_job_process.ready();

        });
        
    </script>
</asp:Content>
<asp:Content ID="Content8" ContentPlaceHolderID="objContentOption_1" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentMenu_1" runat="Server">
    <div id="lyrMenu_1">
    </div>
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderID="objContentOption_2" runat="Server">
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="objContentMenu_2" runat="Server">
    <div id="lyrMenu_2">
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="objContentToggle" runat="Server">
</asp:Content>
<asp:Content ID="Content9" ContentPlaceHolderID="objContentRemark" runat="Server">
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="objContentData_1" runat="Server">
    <form id="frmData_공지등록" action="">
    </form>
</asp:Content>
<asp:Content ID="Content7" ContentPlaceHolderID="objContentData_2" runat="Server">
    <div id="grdData_첨부파일">
    </div>
    <div id="lyrDown">
    </div>
    <form id="frmData_공지내용" action="">
    </form>
    <form id="frmServer" runat="server">
    <div id="ctlData_공지내용">
        <dx:ASPxHtmlEditor ID="ASPxHtmlEditor1" runat="server" Width="100%" ClientInstanceName="ctrl_memo"
            ClientVisible="False">
            <SettingsSpellChecker Culture="ko-KR">
            </SettingsSpellChecker>
            <SettingsValidation ErrorText="HTML 내용이 유효하지 않습니다.">
                <RequiredField ErrorText="내용은 반드시 입력하셔야 합니다." />
            </SettingsValidation>
            <SettingsImageSelector>
                <CommonSettings AllowedFileExtensions=".jpe, .jpeg, .jpg, .gif, .png"></CommonSettings>
            </SettingsImageSelector>
            <SettingsHtmlEditing EnterMode="BR" />
            <SettingsImageUpload UploadImageFolder="~/Files/PLM_FILES/images/">
                <ValidationSettings AllowedFileExtensions=".jpe, .jpeg, .jpg, .gif, .png" FileDoesNotExistErrorText="업로드할 파일을 찾을 수 없습니다."
                    GeneralErrorText="네트웍 에러가 발생하여 전송할 수 없습니다." InvalidUrlErrorText="URL 혹은 파일이 유효하지 않습니다."
                    MaxFileSizeErrorText="파일 사이즈가 최대 사이즈를 초과하였습니다." NotAllowedFileExtensionErrorText="해당하는 파일의 확장자는 허용되지 않습니다.">
                </ValidationSettings>
            </SettingsImageUpload>
            <ClientSideEvents HtmlChanged="gw_com_DX.event_htmlchanged" />
        </dx:ASPxHtmlEditor>
    </div>
    </form>
</asp:Content>
