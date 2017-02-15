<%@ Page Language="C#" AutoEventWireup="true" CodeFile="DLG_EDIT_HTML_ASISSUE.aspx.cs" Inherits="Job_DLG_EDIT_HTML_ASISSUE" %>

<%@ Register assembly="DevExpress.Web.ASPxHtmlEditor.v15.1, Version=15.1.4.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a" namespace="DevExpress.Web.ASPxHtmlEditor" tagprefix="dx" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>[ Product Lifecycle Management System ]</title>
    <script src="../Lib/js/lib.jquery.js" type="text/javascript"></script>
    <link href="../Style/theme-smoothness/jquery-ui-1.8.9.custom.css" rel="stylesheet"
        type="text/css" />
    <link href="../Style/lib.ui.tabs.css" rel="stylesheet" type="text/css" />
    <link href="../Style/lib.grid.css" rel="stylesheet" type="text/css" />
    <link href="../Style/lib.contextmenu.css" rel="stylesheet" type="text/css" />
    <link href="../Style/lib.formui_1.css" rel="stylesheet" type="text/css" />
    <link href="../Style/gw.ui.css" rel="stylesheet" type="text/css" />
    <style type="text/css">
        body
        {
            font-family: '굴림체';
            font-size: 9pt;
        }
        input, textarea, select
        {
            font-family: '굴림체';
            font-size: 9pt;
        }
    </style>
    <script src="../Lib/js/lib.ui.datepicker-ko.js" type="text/javascript"></script>
    <script src="../Lib/js/lib.ui.js" type="text/javascript"></script>
    <script src="../Lib/js/lib.grid.en.js" type="text/javascript"></script>
    <script src="../Lib/js/lib.grid.js" type="text/javascript"></script>
    <script src="../Lib/js/lib.contextmenu.js" type="text/javascript"></script>
    <script src="../Lib/js/lib.formui_1.js" type="text/javascript"></script>
    <script src="../Lib/js/lib.textarea_1.js" type="text/javascript"></script>
    <script src="../Lib/js/lib.mask_2.js" type="text/javascript"></script>
    <script src="../Lib/js/lib.mask_3.js" type="text/javascript"></script>
    <script src="../Lib/js/lib.format_1.js" type="text/javascript"></script>
    <script src="../Lib/js/lib.format_1.ko.js" type="text/javascript"></script>
    <script src="../Lib/js/lib.validate_1.js" type="text/javascript"></script>
    <script src="../Lib/js/lib.blockui.js" type="text/javascript"></script>
    <script src="../Lib/js/lib.json.js" type="text/javascript"></script>
    <script src="../Lib/js/gw.com.module.js" type="text/javascript"></script>
    <script src="../Lib/js/gw.com.api.js" type="text/javascript"></script>
    <script src="../Lib/js/gw.com.DX.js" type="text/javascript"></script>
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/DLG.EDIT.HTML.ASISSUE.js" type="text/javascript"></script>
    <script type="text/javascript">

        $(function () {

            gw_job_process.ready();

        });

    </script>
</head>
<body id="docBody" runat="server">

    <table width="100%" border="0" cellpadding="1" cellspacing="0" style="margin: 0;
        margin-top: 2px; padding: 0; white-space: nowrap;">
        <tr>
            <td align="right" valign="top">
                <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin: 0;
                    padding: 0;">
                    <tr>
                        <td align="left">
                            <div id="lyrNotice">
                            </div>
                        </td>
                        <td align="right">
                            <div id="lyrMenu">
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    <div style="position: absolute; z-index: 10; width: 100%; top: 100;">
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
    <div style="width: 100%; margin: 0; padding: 0;">
        <div id="lyrRemark">
        </div>
    </div>
    <table width="100%" border="0" cellpadding="1" cellspacing="0" style="margin: 0;
        margin-top: 2px; padding: 0; table-layout: fixed; white-space: nowrap;">
        <tr>
            <td valign="top" style="padding-left: 5px; padding-right: 2px;">
                <form id="frmHTML" action="">
                </form>
                <form id="frmServer" runat="server">
                    <div id="lyrControl">
                    <dx:ASPxHtmlEditor ID="ASPxctlHTML" runat="server" Width="100%" ClientInstanceName="ctlHTML"
                        ClientVisible="False" Height="530px" EnableTheming="True" Theme="Default">

                        <StylesDocument Font-Names="굴림체" />
                        <ClientSideEvents HtmlChanged="gw_com_DX.event_htmlchanged" Init="function(s, e) {
	var param = window.opener.v_global.event.send_data;
	if (param.issue_no != undefined) {
		v_global.data.key = param.issue_no;
		processRetrieve({});
	} else {
		v_global.data.key = null;
		var args = { targetid: &quot;frmHTML&quot; };
		gw_com_module.formInsert(args);
	}
}" />
                        <Toolbars>
                    <dx:HtmlEditorToolbar>
                        <Items>
                            <dx:ToolbarUndoButton>
                            </dx:ToolbarUndoButton>
                            <dx:ToolbarRedoButton>
                            </dx:ToolbarRedoButton>
                            <dx:ToolbarFontNameEdit>
                                <Items>
                                    <dx:ToolbarListEditItem Text="굴림" Value="굴림" />
                                    <dx:ToolbarListEditItem Selected="True" Text="굴림체" Value="굴림체" />
                                    <dx:ToolbarListEditItem Text="Times New Roman" Value="Times New Roman" />
                                    <dx:ToolbarListEditItem Text="Tahoma" Value="Tahoma" />
                                    <dx:ToolbarListEditItem Text="Verdana" Value="Verdana" />
                                    <dx:ToolbarListEditItem Text="Arial" Value="Arial" />
                                    <dx:ToolbarListEditItem Text="MS Sans Serif" Value="MS Sans Serif" />
                                    <dx:ToolbarListEditItem Text="Courier" Value="Courier" />
                                </Items>
                            </dx:ToolbarFontNameEdit>
                            <dx:ToolbarFontSizeEdit>
                                <Items>
                                    <dx:ToolbarListEditItem Text="1 (8pt)" Value="1" />
                                    <dx:ToolbarListEditItem Text="2 (10pt)" Value="2" />
                                    <dx:ToolbarListEditItem Text="3 (12pt)" Value="3" />
                                    <dx:ToolbarListEditItem Text="4 (14pt)" Value="4" />
                                    <dx:ToolbarListEditItem Text="5 (18pt)" Value="5" />
                                    <dx:ToolbarListEditItem Text="6 (24pt)" Value="6" />
                                    <dx:ToolbarListEditItem Text="7 (36pt)" Value="7" />
                                </Items>
                            </dx:ToolbarFontSizeEdit>
                            <dx:ToolbarBoldButton>
                            </dx:ToolbarBoldButton>
                            <dx:ToolbarItalicButton>
                            </dx:ToolbarItalicButton>
                            <dx:ToolbarFontColorButton>
                            </dx:ToolbarFontColorButton>
                            <dx:ToolbarBackColorButton>
                            </dx:ToolbarBackColorButton>
                            <dx:ToolbarJustifyLeftButton>
                            </dx:ToolbarJustifyLeftButton>
                            <dx:ToolbarJustifyCenterButton>
                            </dx:ToolbarJustifyCenterButton>
                            <dx:ToolbarJustifyRightButton>
                            </dx:ToolbarJustifyRightButton>
                            <dx:ToolbarTableOperationsDropDownButton>
                                <Items>
                                    <dx:ToolbarInsertTableDialogButton BeginGroup="True">
                                    </dx:ToolbarInsertTableDialogButton>
                                    <dx:ToolbarTablePropertiesDialogButton BeginGroup="True">
                                    </dx:ToolbarTablePropertiesDialogButton>
                                    <dx:ToolbarTableRowPropertiesDialogButton>
                                    </dx:ToolbarTableRowPropertiesDialogButton>
                                    <dx:ToolbarTableColumnPropertiesDialogButton>
                                    </dx:ToolbarTableColumnPropertiesDialogButton>
                                    <dx:ToolbarTableCellPropertiesDialogButton>
                                    </dx:ToolbarTableCellPropertiesDialogButton>
                                    <dx:ToolbarInsertTableRowAboveButton BeginGroup="True">
                                    </dx:ToolbarInsertTableRowAboveButton>
                                    <dx:ToolbarInsertTableRowBelowButton>
                                    </dx:ToolbarInsertTableRowBelowButton>
                                    <dx:ToolbarInsertTableColumnToLeftButton>
                                    </dx:ToolbarInsertTableColumnToLeftButton>
                                    <dx:ToolbarInsertTableColumnToRightButton>
                                    </dx:ToolbarInsertTableColumnToRightButton>
                                    <dx:ToolbarSplitTableCellHorizontallyButton BeginGroup="True">
                                    </dx:ToolbarSplitTableCellHorizontallyButton>
                                    <dx:ToolbarSplitTableCellVerticallyButton>
                                    </dx:ToolbarSplitTableCellVerticallyButton>
                                    <dx:ToolbarMergeTableCellRightButton>
                                    </dx:ToolbarMergeTableCellRightButton>
                                    <dx:ToolbarMergeTableCellDownButton>
                                    </dx:ToolbarMergeTableCellDownButton>
                                    <dx:ToolbarDeleteTableButton BeginGroup="True">
                                    </dx:ToolbarDeleteTableButton>
                                    <dx:ToolbarDeleteTableRowButton>
                                    </dx:ToolbarDeleteTableRowButton>
                                    <dx:ToolbarDeleteTableColumnButton>
                                    </dx:ToolbarDeleteTableColumnButton>
                                </Items>
                            </dx:ToolbarTableOperationsDropDownButton>
                            <dx:ToolbarInsertImageDialogButton>
                            </dx:ToolbarInsertImageDialogButton>
                            <dx:ToolbarInsertLinkDialogButton>
                            </dx:ToolbarInsertLinkDialogButton>
                        </Items>
                    </dx:HtmlEditorToolbar>
                </Toolbars>
                        <SettingsHtmlEditing EnterMode="Default">
                        </SettingsHtmlEditing>
                        <SettingsDialogs>
                            <InsertImageDialog ShowMoreOptionsButton="False">
                                <SettingsImageUpload UploadFolder="~/Files/EDIT_FILES/images/" UploadImageFolder="~/Files/EDIT_FILES/images/">
                                </SettingsImageUpload>
                                <SettingsImageSelector>
                                    <EditingSettings TemporaryFolder="~/Files/EDIT_FILES/temp" />
                                </SettingsImageSelector>
                            </InsertImageDialog>
                        </SettingsDialogs>
                    </dx:ASPxHtmlEditor>
                </div>
                </form>
            </td>
        </tr>
    </table>
<!--
    <ul id="navContext" class="contextMenu">
        <li class="excel"><a href="#excel">엑셀로 저장</a></li>
    </ul>
    <iframe id="pageExport" src="" width='0' height='0' scrolling='no' marginheight='0' marginwidth='0'>
    </iframe>
-->
</body>
</html>
