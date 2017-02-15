//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 납품 현황
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
    data: null, logic: {}
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define gw_job_process class : ready(), UI(), procedure()
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var gw_job_process = {

    // entry point. (pre-process section)
    ready: function () {

        // initialize page.
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        // 협력사 숨김 여부 설정
        v_global.logic.HideSupp = (gw_com_module.v_Session.USR_ID == "GOODTEST") ? false : true;
        if (v_global.logic.HideSupp) {
            v_global.logic.SuppCd = gw_com_module.v_Session.EMP_NO;
            v_global.logic.SuppNm = gw_com_module.v_Session.EMP_NM;
        }
        else {
            v_global.logic.SuppCd = "";
            v_global.logic.SuppNm = "";
        }

        // set data for DDDW List
        var args = {
            request: [
                    {
                        type: "PAGE", name: "발생구분", query: "dddw_zcode",
                        param: [{ argument: "arg_hcode", value: "QDM010" }]
                    },
                    {
                        type: "PAGE", name: "LINE", query: "DDDW_CM_CODED",
                        param: [{ argument: "arg_hcode", value: "IEHM02" }]
                    },
                    {
                        type: "INLINE", name: "합불판정",
                        data: [{ title: "합격", value: "1" }, { title: "불합격", value: "0" }]
                    }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);

        //----------
        function start() {
            gw_job_process.UI();
            gw_job_process.procedure();
        }
    },

    // manage UI. (design section)
    UI: function () {

        //==== Main Menu : 조회, 추가, 수정, 출력(납품서), 라벨(라벨출력), 닫기
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "조회", value: "조회", act: true },
				{ name: "추가", value: "추가", icon: "추가" },
				{ name: "수정", value: "수정", icon: "추가" },
				{ name: "라벨", value: "라벨출력", icon: "기타" },
				{ name: "닫기", value: "닫기" }
            ]
        };
        gw_com_module.buttonMenu(args);

        //==== Search Option : 
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true, remark: "lyrRemark",
            editable: { focus: "ymd_fr", validate: true },
            content: {
                row: [
                        {
                            element: [
                              {
                                  name: "ymd_fr", label: { title: "납품일자 :" }, mask: "date-ymd",
                                  style: { colfloat: "floating" },
                                  editable: { type: "text", size: 7, maxlength: 10 }
                              },
                              {
                                  name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
                                  editable: { type: "text", size: 7, maxlength: 10 }
                              }
                            ]
                        },
                        {
                            element: [
        //                        { name: "track_no", label: { title: "Tracking No. :" },
        //                            editable: { type: "text", size: 16, maxlength: 20 }
        //                        },
                                {
                                    name: "dlv_no", label: { title: "납품서번호 :" },
                                    editable: { type: "text", size: 12 }
                                },
                                {
                                    name: "supp_nm", label: { title: "협력사 :" }, //hidden: true,  협력사 only
                                    editable: { type: "text", size: 14 }
                                },
                                { name: "supp_cd", hidden: true, editable: { type: "hidden" } }
                            ]
                        },
                        {
                            element: [
                              { name: "실행", value: "실행", act: true, format: { type: "button" } },
                              { name: "취소", value: "취소", format: { type: "button", icon: "닫기" } }
                            ], align: "right"
                        }
                ]
            }
        };
        gw_com_module.formCreate(args);
        // 협력사 only
        // gw_com_api.setValue("frmOption", 1, "supp_cd", gw_com_module.v_Session.EMP_NO );

        //==== Main Grid : 납품 현황
        var args = {
            targetid: "grdData_Main", query: "SRM_4110_M_1", title: "납품 현황",
            height: 150, show: true, selectable: true, number: true, // dynamic: true, multi: true, checkrow: true,
            element: [
				{ header: "납품서번호", name: "dlv_no", width: 80, align: "center" },
				{ header: "납품일", name: "dlv_date", width: 70, align: "center", mask: "date-ymd" },
				{
				    header: "협력사", name: "supp_nm", width: 120, align: "center"
					, hidden: v_global.logic.HideSupp ? true : false
				},
				{ header: "품목수", name: "item_cnt", width: 50, align: "center" },
				{ header: "담당자", name: "dlv_user", width: 60, align: "center" },
				{ header: "진행상태", name: "pstat", width: 60, align: "center" },
				{ header: "검수자", name: "chk_user", width: 60, align: "center" },
				{ header: "검수일시", name: "chk_dt", width: 70, align: "center", mask: "date-ymd" },
				{ header: "인수자", name: "acp_user", width: 60, align: "center" },
				{ header: "인계일시", name: "acp_dt", width: 70, align: "center", mask: "date-ymd" },
				{ name: "supp_cd", hidden: true }
            ]
        };
        gw_com_module.gridCreate(args);

        //==== Sub Grid : 납품 목록
        var args = {
            targetid: "grdData_Sub", query: "SRM_4110_S_1", title: "납품 목록",
            caption: true, height: 350, pager: true, show: true, key: true, number: true, multi: true, checkrow: true,
            element: [
				{ header: "품번", name: "item_cd", width: 80, align: "center" },
				{ header: "품명", name: "item_nm", width: 120, align: "center" },
				{ header: "규격", name: "item_spec", width: 120, align: "center" },
				{ header: "Tracking", name: "track_no", width: 80, align: "center" },
				{ header: "Pallet No.", name: "pallet_no", width: 80, align: "center" },
				{ header: "납기요청일", name: "req_date", width: 70, align: "center", mask: "date-ymd" },
				{ header: "PO수량", name: "pur_qty", width: 60, align: "center" },
				{ header: "단위", name: "pur_unit", width: 40, align: "center" },
				{ header: "납품수량", name: "dlv_qty", width: 60, align: "center" },
				{ header: "라벨", name: "label_tp", width: 40, align: "center" },
				{ header: "선입고", name: "direct_yn", width: 40, align: "center" },
                { name: "dlv_no", hidden: true },
                { name: "dlv_seq", hidden: true }
            ]
        };
        gw_com_module.gridCreate(args);

        //==== File Download Layer
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);

        //==== Resize Objects
        var args = {
            target: [
				{ type: "GRID", id: "grdData_Main", offset: 8 },
                { type: "GRID", id: "grdData_Sub", offset: 8 }
            ]
        };
        gw_com_module.objResize(args);
        gw_com_module.informSize();

    },

    //==== manage process. (program section)
    procedure: function () {

        //==== Button Click : Main 조회, 추가, 수정, 출력(납품서), 라벨(라벨출력), 닫기 ====
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: click_lyrMenu_조회 };
        gw_com_module.eventBind(args);
        function click_lyrMenu_조회(ui) { viewOption(); }
        //----------
        var args = { targetid: "lyrMenu", element: "추가", event: "click", handler: processEdit };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "수정", event: "click", handler: processEdit };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "출력", event: "click", handler: processExport };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "라벨", event: "click", handler: processExport };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: click_lyrMenu_닫기 };
        gw_com_module.eventBind(args);
        function click_lyrMenu_닫기(ui) { processClose({}); }
        //----------

        //==== Button Click : Search Option ====
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: click_frmOption_실행 };
        gw_com_module.eventBind(args);
        function click_frmOption_실행(ui) { processRetrieve({}); }
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: click_frmOption_취소 };
        gw_com_module.eventBind(args);
        function click_frmOption_취소(ui) { gw_com_api.hide("frmOption"); }

        //==== Grid Events : Main
        var args = { targetid: "grdData_Main", grid: true, event: "rowselected", handler: rowselected_grdData_Main };
        gw_com_module.eventBind(args);
        function rowselected_grdData_Main(ui) { processLink(ui); }
        //----------
        var args = { targetid: "grdData_Main", grid: true, event: "rowdblclick", handler: popupDetail };
        gw_com_module.eventBind(args);
        var args = { targetid: "grdData_Main", grid: true, event: "rowkeyenter", handler: popupDetail };
        gw_com_module.eventBind(args);

        //==== startup process.
        gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { day: v_global.logic.HideSupp ? -30 : -5 }));
        gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate("", { day: 1 }));
        gw_com_module.startPage();

    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function processExport(param) {

    var ReportTitle = "";
    var SelRows = "";
    var ids = gw_com_api.getSelectedRow("grdData_Sub", true);


    //바코드 라벨 화면
    ReportTitle = "물품라벨";
    if (ids.length < 1) {
        gw_com_api.messageBox([{ text: "선택된 대상이 없습니다." }]);
        return;
    }

    $.each(ids, function () {
        if (SelRows.length > 0)
            SelRows += ",";

        SelRows += gw_com_api.getCellValue("GRID", "grdData_Sub", this, "dlv_seq");
    });

    var key = gw_com_api.getValue("grdData_Main", "selected", "dlv_no", true);
    var args = {
        query: "SRM_4110_P", //"w_srm1041_2", "SRM_4110_P_1"
        source: {
            type: "GRID", id: "grdData_Main", row: "selected", json: true,
            element: [
                { name: "dlv_no", argument: "arg_dlv_no" }
            ]
        },
        option: [
            { name: "PRINT", value: "PDF" },
            { name: "PAGE", value: gw_com_module.v_Current.window },
            { name: "USER", value: gw_com_api.getValue("grdData_Main", "selected", "dlv_user", false) },
            { name: "KEY", value: key },
            { name: "TITLE", value: ReportTitle },
            { name: "ROWS", value: SelRows }
        ],
        target: { type: "FILE", id: "lyrDown", name: ReportTitle }
    };
    gw_com_module.objExport(args);

}
//----------
function viewOption() {
    var args = { target: [{ id: "frmOption", focus: true }] };
    gw_com_module.objToggle(args);
}

//---------- Main Button : 추가 & 수정 (ui.type/obkect/row/element)
function processEdit(param) {

    // 0. Set editing mode (Insert or Update)
    var isNewMode;
    if (param.object == "lyrMenu" && param.element == "추가") isNewMode = true;
    else if (param.object == "lyrMenu" && param.element == "수정") isNewMode = false;
    else return;

    // 협력사 설정
    var sSuppCd, sSuppNm;
    if (gw_com_api.getSelectedRow("grdData_Main") == null) {
        sSuppCd = v_global.logic.SuppCd;
        sSuppNm = v_global.logic.SuppNm;
    }
    else {
        sSuppCd = gw_com_api.getValue("grdData_Main", "selected", "supp_cd", true);
        sSuppNm = gw_com_api.getValue("grdData_Main", "selected", "supp_nm", true);
    }

    // 납품번호 설정
    var sDlvNo;
    if (isNewMode) {
        sDlvNo = "";
    }
    else {
        // 1-1. Check selection of row for editing
        if (gw_com_api.getSelectedRow("grdData_Main") == null) {
            gw_com_api.messageBox([{ text: "선택된 대상이 없습니다." }], 300);
            return false;
        }
        // 1-2. Check status of row data for editing
        var ProcStat = gw_com_api.getValue("grdData_Main", "selected", "pstat", true);
        if (ProcStat == "완료" || ProcStat == "취소") {
            gw_com_api.messageBox([
	            { text: status + " 자료이므로 수정할 수 없습니다." }
            ], 420);
            return false;
        }
        sDlvNo = gw_com_api.getValue("grdData_Main", "selected", "dlv_no", true);
    }

    // 2. Convert to editing mode
    // Open link page to tabpage of parent page : SRM_4120 납품서 수정
    var args = {
        ID: gw_com_api.v_Stream.msg_linkPage,
        to: { type: "MAIN" },
        data: {
            page: "SRM_4120", title: "납품서 등록 및 수정",
            param: [
                { name: "dlv_no", value: sDlvNo },
                { name: "supp_cd", value: sSuppCd },
                { name: "supp_nm", value: sSuppNm }
            ]
        }
    };
    gw_com_module.streamInterface(args);

}
//----------
function processDetail(param) {

    if (gw_com_api.getSelectedRow("grdData_Main") == null) {
        gw_com_api.messageBox([{ text: "선택된 대상이 없습니다." }], 300);
        return false;
    }

    var ProcStat = gw_com_api.getValue("grdData_Main", "selected", "pstat", true);

    //    if ( ProcStat == "완료" || ProcStat == "취소" ) {
    //        gw_com_api.messageBox([
    //            { text: status + " 자료이므로 수정할 수 없습니다." }
    //        ], 420);
    //        return false;
    //    }

    var args = {
        ID: gw_com_api.v_Stream.msg_linkPage,
        to: { type: "MAIN" },
        data: {
            page: "QDM_6220", title: "NCR 보기",
            param: [
            	{ name: "AUTH", value: "R" },
                { name: "rqst_no", value: gw_com_api.getValue("grdData_Main", "selected", "rqst_no", true) }
            ]
        }
    };
    gw_com_module.streamInterface(args);

}
//----------
function successSave(response, param) {
    processRetrieve({});
    //    $.each(response, function () {
    //        $.each(this.KEY, function () { 
    //        	if (this.NAME == "dlv_no") { 
    //        		v_global.logic.key = this.VALUE;
    //                processRetrieve({ key: v_global.logic.key }); 
    //            }
    //        });
    //    });
}
//----------
function processDelete() {
}
//----------
function popupDetail(ui) {
    v_global.event.type = ui.type;
    v_global.event.object = ui.object;
    v_global.event.row = ui.row;
    v_global.event.element = ui.element;

    if (ui.object = "grdData_Main") {
        var LinkPage = "";
        var LinkID = gw_com_api.v_Stream.msg_infoECR;

        var LinkType = gw_com_api.getValue(ui.object, ui.row, "issue_tp", true);
        if (LinkType == "VOC") {
            LinkPage = "INFO_VOC";
            LinkID = gw_com_api.v_Stream.msg_infoECR;
        }
        else if (LinkType == "SPC") {
            LinkPage = "INFO_SPC";
            LinkID = gw_com_api.v_Stream.msg_infoECR;
        }
        else {
            LinkPage = "DLG_ISSUE";
            LinkID = gw_com_api.v_Stream.msg_infoAS;
        }

        var args = {
            type: "PAGE", page: LinkPage, title: "문제발생 상세 정보",
            width: 1100, height: 600, scroll: true, open: true, control: true, locate: ["center", "top"]
        };

        if (gw_com_module.dialoguePrepare(args) == false) {
            var args = {
                page: LinkPage,
                param: {
                    ID: LinkID,
                    data: {
                        dlv_no: gw_com_api.getValue(ui.object, ui.row, "dlv_no", true),
                        voc_no: gw_com_api.getValue(ui.object, ui.row, "dlv_no", true)
                    }
                }
            }
            gw_com_module.dialogueOpen(args);
        }
    }
}
//----------
function processRetrieve(param) {

    // Validate Inupt Options
    var args = { target: [{ type: "FORM", id: "frmOption" }] };
    if (gw_com_module.objValidate(args) == false) return false;

    // Retrieve 
    var args = {
        key: param.key,
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
				{ name: "ymd_fr", argument: "arg_ymd_fr" },
				{ name: "ymd_to", argument: "arg_ymd_to" },
				//{ name: "track_no", argument: "arg_track_no" },
				{ name: "dlv_no", argument: "arg_dlv_no" },
				{ name: "supp_cd", argument: "arg_supp_cd" },
				{ name: "supp_nm", argument: "arg_supp_nm" }
            ],
            remark: [
	            { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }] },
		        //{ element: [{ name: "track_no"}] },
		        { element: [{ name: "dlv_no" }] },
		        { element: [{ name: "supp_nm" }] }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_Main", focus: true, select: true }
        ],
        clear: [
			{ type: "GRID", id: "grdData_Sub" }
        ]
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {

    var args = {
        key: param.key,
        source: {
            type: "GRID", id: "grdData_Main", row: "selected", block: true,
            element: [
				{ name: "dlv_no", argument: "arg_dlv_no" }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_Sub" }
        ],
        handler_complete: retrieveEnd
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processClose(param) {
    var args = { ID: gw_com_api.v_Stream.msg_closePage };
    gw_com_module.streamInterface(args);
}
//----------
function closeDialogue(param) {

    var args = { page: param.page };
    gw_com_module.dialogueClose(args);
    if (param.focus) {
        gw_com_api.setFocus(v_global.event.object, v_global.event.row, v_global.event.element,
	                        (v_global.event.type == "GRID") ? true : false);
    }

}
//----------
function retrieveEnd(param) {
    for (var i = 1 ; i <= gw_com_api.getRowCount("grdData_Sub") ; i++) {
        gw_com_api.selectRow("grdData_Sub", i);
    }
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_showMessage: {
            gw_com_module.streamInterface(param);
        } break;
        case gw_com_api.v_Stream.msg_resultMessage: {
            if (param.data.page != gw_com_api.getPageID()) {
                param.to = { type: "POPUP", page: param.data.page };
                gw_com_module.streamInterface(param);
                break;
            }
            switch (param.data.ID) {
                case gw_com_api.v_Message.msg_confirmSave:
                    {
                        if (param.data.result == "YES") processEdit(param.data.arg);
                        else {
                            var status = checkCRUD({});
                            if (status == "initialize" || status == "create") processDelete({});
                            else if (status == "update") processRestore({});
                            if (v_global.process.handler != null) v_global.process.handler(param.data.arg);
                        }
                    } break;
                case gw_com_api.v_Message.msg_confirmRemove:
                    { if (param.data.result == "YES") processRemove(param.data.arg); } break;
                case gw_com_api.v_Message.msg_informSaved:
                    {
                        param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                    } break;
                case gw_com_api.v_Message.msg_informRemoved:
                    { param.data.arg.handler(param.data.arg.response, param.data.arg.param); } break;
                case gw_com_api.v_Message.msg_informBatched:
                    { param.data.arg.handler(param.data.arg.response, param.data.arg.param); } break;
            }   // End of switch (param.data.ID)
        } break;    // End of case gw_com_api.v_Stream.msg_resultMessage
        case gw_com_api.v_Stream.msg_retrieve:
            {
                processRetrieve({ key: param.data.key });
            }
            break;
        case gw_com_api.v_Stream.msg_remove:
            {
                var args = { targetid: "grdData_Main", row: v_global.event.row }
                gw_com_module.gridDelete(args);
            } break;
        case gw_com_api.v_Stream.msg_openedDialogue: {
            var args = { to: { type: "POPUP", page: param.from.page } };
            switch (param.from.page) {
                case "INFO_VOC": {
                    args.ID = gw_com_api.v_Stream.msg_infoECR;
                } break;
                case "INFO_SPC": {
                    args.ID = gw_com_api.v_Stream.msg_infoECR;
                } break;
                case "DLG_ISSUE": {
                    args.ID = gw_com_api.v_Stream.msg_infoAS;
                } break;
            }
            args.data = {
                dlv_no: gw_com_api.getValue(v_global.event.object, v_global.event.row, "dlv_no", true),
                voc_no: gw_com_api.getValue(v_global.event.object, v_global.event.row, "dlv_no", true)
            }
            gw_com_module.streamInterface(args);
        } break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                closeDialogue({ page: param.from.page });
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//