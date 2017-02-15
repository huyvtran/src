 
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var v_global = {
    event: {type: null,object: null,row: null,element: null},
    process: {param: null,init: false,entry: null,act: null,handler: null,current: {},prev: {}},
    data: {key: null},
    logic: {}
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// process.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var gw_job_process = {

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // entry point. (pre-process section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //#region
    ready: function (param) {
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // initialize page.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");
        //----------
        //gw_com_DX.register();

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set data.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        var args = {
            request: [
				{
				    type: "PAGE", name: "결재유형", query: "DDDW_HRM_COMMON",
				    param: [{ argument: "arg_hcode", value: "S212" }]
				},
				{
				    type: "PAGE", name: "승인유형", query: "DDDW_HRM_COMMON",
				    param: [{ argument: "arg_hcode", value: "S213" }]
				},
                {
                    type: "PAGE", name: "결재자유형", query: "DDDW_HRM_COMMON",
                    param: [{ argument: "arg_hcode", value: "S214" }]
                }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // go next.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function start() {

            gw_job_process.UI();
            gw_job_process.procedure();
            gw_com_module.startPage();
            //----------
            var args = {
                ID: gw_com_api.v_Stream.msg_openedDialogue
            };
            gw_com_module.streamInterface(args);

        }

    },
    //#endregion

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage UI. (design section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //#region
    UI: function () {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // define UI.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //=====================================================================================
        var args = {
            targetid: "lyrMenu_1", type: "FREE",
            element: [
				{ name: "회수", value: "회수", icon: "삭제" },
				{ name: "취소", value: "결재취소", icon: "아니오" },
				{ name: "승인", value: "승인", icon: "예" },
				{ name: "반려", value: "반려", icon: "아니오" },
				{ name: "보류", value: "보류", icon: "실행" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //----------
        gw_com_api.hide("lyrMenu_1_취소");
        gw_com_api.hide("lyrMenu_1_회수");
        gw_com_api.hide("lyrMenu_1_승인");
        gw_com_api.hide("lyrMenu_1_반려");
        gw_com_api.hide("lyrMenu_1_보류");
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_2", type: "FREE",
            element: [
                { name: "추가", value: "결재선추가" },
                { name: "삭제", value: "결재선삭제" },
				{ name: "닫기", value: "닫기", icon: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //----------
        gw_com_api.hide("lyrMenu_2_추가");
        gw_com_api.hide("lyrMenu_2_삭제");
        //=====================================================================================
        var args = {
            targetid: "frmData_APPR", query: "DLG_EDIT_APPR", type: "TABLE", title: "",
            caption: false, show: true, selectable: true,
            editable: { bind: "select", validate: true },
            content: {
                width: { label: 100, field: 120 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "결재문서 유형", format: { type: "label" } },
                            { name: "form_nm", editable: { type: "hidden", width: 300 } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "상신자", format: { type: "label" } },
                            { name: "rqst_emp_nm2", editable: { type: "hidden", width: 300 } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "상신일시", format: { type: "label" } },
                            { name: "rqst_date", editable: { type: "hidden", width: 300 }, mask: "date-ymd" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "완료희망일", format: { type: "label" } },
                            { name: "plan_date", editable: { type: "hidden", width: 500 }, mask: "date-ymd" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "결재문서번호", format: { type: "label" } },
                            { name: "doc_no", editable: { type: "hidden" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "참조문서번호", format: { type: "label" } },
                            { name: "root_no", editable: { type: "hidden" } },
                            { name: "appr_id", editable: { type: "hidden" }, hidden: true },
                            { name: "rqst_emp", editable: { type: "hidden" }, hidden: true },
                            { name: "rqst_dept", editable: { type: "hidden" }, hidden: true },
                            { name: "rqst_grade", editable: { type: "hidden" }, hidden: true },
                            { name: "rqst_duty", editable: { type: "hidden" }, hidden: true },
                            { name: "rqst_rmk", editable: { type: "textarea" }, hidden: true },
                            { name: "form_id", editable: { type: "hidden" }, hidden: true },
                            { name: "doc_title", editable: { type: "hidden" }, hidden: true },
                            { name: "root_seq", editable: { type: "hidden" }, hidden: true },
                            { name: "ref_key1", editable: { type: "hidden" }, hidden: true },
                            { name: "ref_key2", editable: { type: "hidden" }, hidden: true },
                            { name: "ref_key3", editable: { type: "hidden" }, hidden: true },
                            { name: "doc_body", editable: { type: "hidden" }, hidden: true },
                            { name: "pstat", editable: { type: "hidden" }, hidden: true },
                            { name: "pstat_emp", editable: { type: "hidden" }, hidden: true },
                            { name: "pstat_dt", editable: { type: "hidden" }, hidden: true }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_APPR_LINE", query: "DLG_APPR_LINE", title: "",
            caption: false, height: 82, pager: false, show: true, selectable: true, number: true,
            editable: { multi: true, bind: "_edit_yn", validate: true },
            element: [
                {
                    header: "구분", name: "appr_tp", width: 60, align: "center",
                    editable: { type: "select", data: { memory: "결재유형" }, validate: { rule: "required" } }
                },
                { header: "성명", name: "appr_emp_nm", width: 60, align: "center" },
                { header: "직급", name: "appr_grade_nm", width: 60, align: "center" },
				{ header: "직책", name: "appr_duty_nm", width: 60, align: "center" },
				{ header: "부서", name: "appr_dept_nm", width: 100 },
                //{
                //    header: "승인", name: "appr_yn", width: 60, align: "center",
                //    editable: { type: "select", data: { memory: "승인유형" }, validate: { rule: "required" } }
                //},
                { header: "승인", name: "appr_yn", width: 60, align: "center", editable: { type: "hidden" } },
                {
                    header: "승인일자", name: "appr_date", width: 80, align: "center",
                    editable: { type: "hidden" }, mask: "date-ymd"
                },
                { header:"의견", name: "appr_rmk_yn", width: 30, align: "center" },
                { name: "appr_id", editable: { type: "hidden" }, hidden: true },
                { name: "appr_seq", editable: { type: "hidden" }, hidden: true },
                { name: "appr_emp", editable: { type: "hidden" }, hidden: true },
                { name: "appr_grade", editable: { type: "hidden" }, hidden: true },
                { name: "appr_duty", editable: { type: "hidden" }, hidden: true },
                { name: "appr_dept", editable: { type: "hidden" }, hidden: true },
                { name: "appr_rmk", editable: { type: "textarea" }, hidden: true },
                { name: "_edit_yn", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        createDW({});
        //=====================================================================================
        var args = {
            targetid: "frmData_INPUT", query: "DLG_EDIT_APPR", type: "TABLE", title: "",
            caption: false, show: true, fixed: true, selectable: true,
            content: {
                width: { label: 123, field: 680 }, height: 25,
                row: [
                    {
                        element: [
                          { header: true, value: "제    목", format: { type: "label" } },
                          { name: "doc_title", format: { type: "text", width: 882 } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "상신 비고", format: { type: "label" } },
                            { name: "rqst_rmk", format: { type: "textarea", rows: 2, width: 882 } }
                        ]
                    }
                    //,
                    //{
                    //    control: true,
                    //    element: [
                    //        {
                    //            name: "doc_body", hidden: true, editable: { type: "hidden" },
                    //            control: { by: "DX", type: "htmleditor", id: ctlHTML }
                    //        }
                    //    ]
                    //}
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_HTML", query: "DLG_EDIT_APPR", type: "TABLE", title: "",
            show: true, selectable: true, fixed: true, caption: false,
            editable: { bind: "select", validate: true },
            content: {
                height: "100%", width: { field: "100%" },
                row: [
                    {
                        element: [
                            { name: "doc_body", format: { type: "html" } }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //----------
        $("#frmData_HTML_data .form_2-content").removeClass("form_2-content");
        //=====================================================================================
        var args = {
            targetid: "grdData_FILE", query: "DLG_EDIT_APPR_FILE", title: "첨부파일",
            caption: false, height: "100%", pager: false, show: true, number: true, selectable: true,
            element: [
				{ header: "파일명", name: "file_nm", width: 250 },
				{ header: "다운로드", name: "download", width: 60, align: "center", format: { type: "link", value: "다운로드" } },
				{ header: "설명", name: "file_desc", width: 300, format: { type: "text", width: 500 } },
                { name: "file_path", hidden: true },
                { name: "file_id", hidden: true, editable: { type: "hidden" } },
                { name: "_edit_yn", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "FORM", id: "frmData_APPR", offset: 8 },
                { type: "GRID", id: "grdData_APPR_LINE", offset: 8 },
				{ type: "FORM", id: "frmData_INPUT", offset: 8 },
				{ type: "FORM", id: "frmData_HTML", offset: 8 },
                { type: "GRID", id: "grdData_FILE", offset: 8 }
			]
        };
        //----------
        gw_com_module.objResize(args);

    },
    //#endregion

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage process. (program section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //#region
    procedure: function () {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // define event.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //=====================================================================================
        var args = { targetid: "lyrMenu_1", element: "취소", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1", element: "회수", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1", element: "승인", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1", element: "반려", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1", element: "보류", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_APPR_LINE", grid: true, event: "rowselected", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_APPR_LINE", grid: true, event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_FILE", grid: true, element: "download", event: "click", handler: processDownload };
        gw_com_module.eventBind(args);
        //=====================================================================================
    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function processButton(param) {

    //임시
    processButtonStat({});

    if (v_global.logic.appr_tp == "참조") return;

    var args;
    switch (param.element) {
        case "취소":
            args = [
                { name: "appr_id", value: v_global.data.appr_id },
                { name: "appr_seq", value: v_global.data.appr_seq },
                { name: "appr_yn", value: "대기" }
            ];
            break;
        case "회수":
            args = [
                { name: "appr_id", value: v_global.data.appr_id },
                { name: "appr_seq", value: gw_com_api.getValue("grdData_APPR_LINE", 1, "appr_seq", true) },
                { name: "appr_yn", value: "" }
            ];
            break;
        case "승인":
        case "반려":
        case "보류":
            args = [
                { name: "appr_id", value: v_global.data.appr_id },
                { name: "appr_seq", value: v_global.data.appr_seq },
                { name: "appr_yn", value: param.element }
            ];
            if (v_global.logic.appr_row > 0)
                args.push({
                    name: "appr_rmk",
                    value: gw_com_api.getValue("grdData_APPR_LINE", v_global.logic.appr_row, "appr_rmk", true)
                });
            break;
        case "추가":
            if (eval("v_global.logic.button." + param.element)) {
                processInsert(param);
            } else {
                gw_com_api.messageBox([{ text: "결재선을 변경할 수 없습니다." }]);
            }
            return;
            break;
        case "삭제":
            if (eval("v_global.logic.button." + param.element)) {
                processDelete(param);
            } else {
                gw_com_api.messageBox([{ text: "결재선을 변경할 수 없습니다." }]);
            }
            return;
            break;
        default:
            return;
    }

    if (eval("v_global.logic.button." + param.element)) {
        gw_com_api.messageBox(
            [{ text: param.element + "처리 하시겠습니까?" }],
            420, gw_com_api.v_Message.msg_confirmSave, "YESNO", args);
        //processSetAppr(args);
    } else {
        gw_com_api.messageBox([{ text: param.element + "처리 할 수 없습니다." }]);
    }

}
//----------
function processButtonStat(param) {

    v_global.logic.appr_row = gw_com_api.getFindRow("grdData_APPR_LINE", "appr_seq", v_global.data.appr_seq == undefined ? 0 : v_global.data.appr_seq);
    v_global.logic.appr_tp = gw_com_api.getValue("grdData_APPR_LINE", v_global.logic.appr_row, "appr_tp", true);
    v_global.logic.appr_emp = gw_com_api.getValue("grdData_APPR_LINE", v_global.logic.appr_row, "appr_emp", true);
    v_global.logic.appr_yn = gw_com_api.getValue("grdData_APPR_LINE", v_global.logic.appr_row, "appr_yn", true);
    v_global.logic.appr_yn_next = gw_com_api.getValue("grdData_APPR_LINE", Number(v_global.logic.appr_row) + 1, "appr_yn", true);
    v_global.logic.pstat = gw_com_api.getValue("frmData_APPR", 1, "pstat");
    v_global.logic.rqst_emp = gw_com_api.getValue("frmData_APPR", 1, "rqst_emp");

    v_global.logic.button = {
        취소: false,
        승인: false,
        반려: false,
        보류: false,
        회수: false,
        추가: false,
        삭제: false
    }

    if (param.reset) {
    } else {
        if ($.inArray(v_global.logic.appr_yn, ["", "대기"]) == -1 &&
            $.inArray(v_global.logic.appr_yn_next, ["", "대기", undefined]) >= 0 && appryncheck() > 0 &&
            v_global.logic.appr_emp == gw_com_module.v_Session.EMP_NO) {
            v_global.logic.button.취소 = true;
        }

        switch (v_global.logic.appr_yn) {
            case "대기":
                if ($.inArray(v_global.logic.appr_tp, ["참조", "후열"]) >= 0) {
                    v_global.logic.button.승인 = true;
                } else {
                    v_global.logic.button.승인 = true;
                    v_global.logic.button.반려 = true;
                    v_global.logic.button.보류 = true;
                }
                break;
            case "보류":
                v_global.logic.button.승인 = true;
                v_global.logic.button.반려 = true;
                break;
        }

        if (v_global.logic.rqst_emp == gw_com_module.v_Session.EMP_NO &&
            gw_com_api.getValue("grdData_APPR_LINE", 1, "appr_yn", true) == "대기") {
            v_global.logic.button.회수 = true;
        }

        if ($.inArray(v_global.logic.pstat, ["상신", "진행"]) >= 0 &&
            $.inArray(v_global.logic.appr_yn, ["대기", "보류"]) >= 0) {
            v_global.logic.button.추가 = true;
            v_global.logic.button.삭제 = true;
        }
    }

    //if (v_global.logic.button.취소) gw_com_api.show("lyrMenu_1_취소"); else gw_com_api.hide("lyrMenu_1_취소");
    //if (v_global.logic.button.승인) gw_com_api.show("lyrMenu_1_승인"); else gw_com_api.hide("lyrMenu_1_승인");
    //if (v_global.logic.button.반려) gw_com_api.show("lyrMenu_1_반려"); else gw_com_api.hide("lyrMenu_1_반려");
    //if (v_global.logic.button.보류) gw_com_api.show("lyrMenu_1_보류"); else gw_com_api.hide("lyrMenu_1_보류");
    //if (v_global.logic.button.회수) gw_com_api.show("lyrMenu_1_회수"); else gw_com_api.hide("lyrMenu_1_회수");
    //if (v_global.logic.button.추가) gw_com_api.show("lyrMenu_2_추가"); else gw_com_api.hide("lyrMenu_2_추가");
    //if (v_global.logic.button.삭제) gw_com_api.show("lyrMenu_2_삭제"); else gw_com_api.hide("lyrMenu_2_삭제");
    gw_com_api.show("lyrMenu_1_취소");
    gw_com_api.show("lyrMenu_1_승인");
    gw_com_api.show("lyrMenu_1_반려");
    gw_com_api.show("lyrMenu_1_보류");
    gw_com_api.show("lyrMenu_1_회수");
    gw_com_api.show("lyrMenu_2_추가");
    gw_com_api.show("lyrMenu_2_삭제");
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// najinwooya 2014.09.24   
function appryncheck(param) {

    var cnt = gw_com_api.getRowCount("grdData_APPR_LINE");

    if (cnt > v_global.logic.appr_row) {
        for (var i = v_global.logic.appr_row + 1; i <= cnt; i++) {
            if ($.inArray(gw_com_api.getValue("grdData_APPR_LINE", i, "appr_yn", true), ["승인","보류"]) >= 0 ) return -1
        }
    }
    return cnt
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//----------
function processItemchanged(param) {

    if (param.object == "grdData_APPR_LINE") {
        if (param.element == "appr_yn") {
            gw_com_api.setValue(param.object, param.row, "appr_date", gw_com_api.getDate(), true, true, true);
            //if (gw_com_api.getCRUD(param.object, param.row, true) == "retrieve") gw_com_api.setCRUD(param.object, param.row, "modify", true);
        } else if (param.element == "appr_tp") {
            if (param.row >= v_global.logic.appr_row) {
                switch (param.value.current) {
                    case "결재":
                        if (gw_com_api.getFindRow(param.object, "appr_tp", "전결") < 1) {
                            var row = gw_com_api.getFindRow(param.object, "appr_tp", "후열");
                            while (row > 0) {
                                if ($.inArray(gw_com_api.getValue(param.object, row, "appr_yn", true), ["", "대기"]) >= 0) {
                                    gw_com_api.setValue(param.object, row, "appr_tp", "결재", true, false, false);
                                    //if ($.inArray(gw_com_api.getCRUD(param.object, row, true), ["none", "retrieve"]) >= 0) gw_com_api.setCRUD(param.object, row, "modify", true);
                                    row = gw_com_api.getFindRow(param.object, "appr_tp", "후열");
                                }
                            }
                        }
                        break;
                    case "전결":
                        var ids = gw_com_api.getRowIDs(param.object);
                        $.each(ids, function () {
                            if ($.inArray(gw_com_api.getValue(param.object, row, "appr_yn", true), ["", "대기"]) >= 0) {
                                if (this > param.row) {
                                    if ($.inArray(gw_com_api.getValue(param.object, this, "appr_tp", true), ["결재", "전결"]) >= 0) {
                                        gw_com_api.setValue(param.object, this, "appr_tp", "후열", true, false, false);
                                        //if ($.inArray(gw_com_api.getCRUD(param.object, this, true), ["none", "retrieve"]) >= 0) gw_com_api.setCRUD(param.object, this, "modify", true);
                                    }
                                } else if (this < param.row) {
                                    if ($.inArray(gw_com_api.getValue(param.object, this, "appr_tp", true), ["전결", "후열"]) >= 0) {
                                        gw_com_api.setValue(param.object, this, "appr_tp", "결재", true, false, false);
                                        //if ($.inArray(gw_com_api.getCRUD(param.object, this, true), ["none", "retrieve"]) >= 0) gw_com_api.setCRUD(param.object, this, "modify", true);
                                    }
                                }
                            }
                        });
                        break;
                }
            } else {
                gw_com_api.setValue(param.object, param.row, param.element, param.value.prev, true, false, false);
            }
        }
    } else if (param.object == "frmData_RMK") {
        gw_com_api.setValue("grdData_APPR_LINE", "selected", "appr_rmk", param.value.current, true, true);
    }

}
//----------
function processRetrieve(param) {

    if (param.object == "grdData_APPR_LINE") {
        var appr_seq = gw_com_api.getValue(param.object, param.row, "appr_seq", true);
        var appr_rmk = gw_com_api.getValue(param.object, param.row, "appr_rmk", true);
        var editable = false;
        if (appr_seq == v_global.data.appr_seq && $.inArray(gw_com_api.getValue(param.object, param.row, "appr_yn", true), ["대기", "보류"]) >= 0)
            editable = true;
        createDW({ editable: editable });
        if (editable) {
            var args = {
                targetid: "frmData_RMK", edit: true, updatable: true,
                data: [
                    { name: "appr_rmk", value: appr_rmk }
                ]
            };
            gw_com_module.formInsert(args);
        } else {
            $("#frmData_RMK_appr_rmk_view").val(appr_rmk);
        }
    } else {
        var key = [
            {
                QUERY: "DLG_APPR_LINE",
                KEY: [
                    { NAME: "appr_id", VALUE: v_global.data.appr_id },
                    { NAME: "appr_seq", VALUE: v_global.data.appr_seq }
                ]
            }
        ];
        var args = {
            source: {
                type: "INLINE",
                argument: [
                    { name: "arg_appr_id", value: v_global.data.appr_id == undefined ? "" : v_global.data.appr_id },
                    { name: "arg_appr_seq", value: v_global.data.appr_seq == undefined ? "0" : v_global.data.appr_seq },
                    { name: "arg_emp_no", value: gw_com_module.v_Session.EMP_NO }
                ]
            },
            target: [
                { type: "FORM", id: "frmData_APPR" },
                { type: "GRID", id: "grdData_APPR_LINE", select: true, crud: "update" },
                { type: "FORM", id: "frmData_INPUT" },
                { type: "FORM", id: "frmData_HTML" },
                { type: "GRID", id: "grdData_FILE" }
            ],
            clear: [
                { type: "FORM", id: "frmData_RMK" }
            ],
            handler: {
                complete: processRetrieveEnd,
                param: param
            },
            key: key
        };
        gw_com_module.objRetrieve(args);
    }

}
//----------
function processRetrieveEnd(param) {

    processButtonStat({});
    gw_com_api.selectRow("grdData_APPR_LINE", v_global.logic.appr_row, true);
}
//----------
function processItemdblclick(param) {


}
//----------
function processInsert(param) {

    if (param.object == "lyrMenu_2") {
        var args = {
            type: "PAGE", page: "DLG_EDIT_APPR_LINE", title: "사원 검색",
            width: 670, height: 450, locate: ["left", "top"], open: true
        };
        if (gw_com_module.dialoguePrepare(args) == false) {
            var args = {
                page: "DLG_EDIT_APPR_LINE",
                param: {
                    ID: gw_com_api.v_Stream.msg_openedDialogue,
                    data: {
                        dept_nm: gw_com_module.v_Session.DEPT_NM,
                        key: [gw_com_module.v_Session.EMP_NO]
                    }
                }
            };
            gw_com_module.dialogueOpen(args);
        }
    } else if (param.object == "lyrMenu_FILE") {
        var args = {
            type: "PAGE", page: "DLG_FileUpload", title: "파일 업로드",
            width: 650, height: 140, locate: ["center", "bottom"], open: true,
        };
        if (gw_com_module.dialoguePrepare(args) == false) {
            args = {
                page: args.page,
                param: {
                    ID: gw_com_api.v_Stream.msg_openedDialogue,
                    data: {
                        type: "APPR",
                        key: ""
                    }
                }
            };
            gw_com_module.dialogueOpen(args);
        }
        return;
    }

}
//----------
function processDelete(param) {

    var args;
    switch (param.object) {
        case "lyrMenu_2":
            if (gw_com_api.getValue("grdData_APPR_LINE", "selected", "appr_yn", true) != "") {
                gw_com_api.messageBox([{ text: "삭제할 수 없습니다." }]);
                return;
            }
            args = { targetid: "grdData_APPR_LINE", row: "selected", select: true }
            break;
        case "lyrMenu_FILE":
            args = { targetid: "grdData_FILE", row: "selected", select: true }
            break;
        default:
            return;
            break;
    }
    gw_com_module.gridDelete(args);

}
//----------
function processSave(param) {
    
    var args = {
        url: "COM",
        nomessage: true,
        target: [
			{ type: "GRID", id: "grdData_APPR_LINE" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args.handler = {
        success: successSave,
        param: param
    };
    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    processBatch(param);

}
//----------
function processBatch(param) {

    var args = {
        url: "COM",
        procedure: "dbo.sp_ApprDoc_Confirm",
        input: [
            { name: "ApprId", value: param[0].value, type: "varchar" },
            { name: "ApprSeq", value: param[1].value, type: "varchar" },
            { name: "ApprYn", value: param[2].value, type: "varchar" },
            { name: "ApprEmpNo", value: gw_com_module.v_Session.EMP_NO, type: "varchar" }
        ],
        handler: {
            success: successBatch,
            param: param
        }
    };
    gw_com_module.callProcedure(args);

}
//----------
function successBatch(response, param) {

    processClose({ data: v_global.data });

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_APPR" },
            { type: "GRID", id: "grdData_APPR_LINE" },
			{ type: "FORM", id: "frmData_INPUT" },
            { type: "GRID", id: "grdData_FILE" }
        ]
    };
    gw_com_module.objClear(args);

}
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closeDialogue,
        data: param.data
    };
    gw_com_module.streamInterface(args);
    processClear({});
    processButtonStat({ reset: true });

}
//----------
function closeDialogue(param) {

    var args = {
        page: param.page
    };
    gw_com_module.dialogueClose(args);
    if (param.focus) {
        gw_com_api.setFocus(v_global.event.object,
	                        v_global.event.row,
	                        v_global.event.element,
	                        (v_global.event.type == "GRID") ? true : false);
    }

}
//----------
function convertImgeUrl(param) {

    // var html = $.parseHTML(param); jquery 1.8....
    // Using Empty DOM..
    $("#lyrHTML_temp").empty();
    $("#lyrHTML_temp").append(param);
    var img = $("#lyrHTML_temp img");
    $.each(img, function () {

        // Set Full URL
        var src = this.src;
        this.src = src;

    });

    var html = $("#lyrHTML_temp").html();
    $("#lyrHTML_temp").empty();
    return html;

}
//----------
function processSetAppr(param) {

    var row = gw_com_api.getFindRow("grdData_APPR_LINE", "appr_seq", param[1].value);
    if (row > 0) {
        gw_com_api.setValue("grdData_APPR_LINE", row, "appr_yn", param[2].value, true, true, true);
        gw_com_api.setValue("grdData_APPR_LINE", row, "appr_date", gw_com_api.getDate(), true, true, true);
    }
    processSave(param);

    //param.push({ name: "appr_date", value: gw_com_api.getDate() });
    //var row = [{
    //    crud: "U",
    //    column: param
    //}];

    //var args = {
    //    url: "COM",
    //    user: gw_com_module.v_Session.USR_ID,
    //    param: [
    //        {
    //            query: "DLG_APPR_LINE",
    //            row: row
    //        }
    //    ],
    //    handler: {
    //        success: successSave,
    //        param: {}
    //    }
    //};
    //gw_com_module.objSave(args);

}
//----------
function createDW(param) {

    //=====================================================================================
    var args = {
        targetid: "frmData_RMK", query: "DLG_EDIT_APPR", type: "TABLE", title: "",
        caption: false, show: true, selectable: true,
        editable: { bind: "select", focus: "appr_rmk", validate: true },
        content: {
            width: { label: 10, field: 70 }, height: 25,
            row: [
                {
                    element: [
                      { header: true, value: "의    견", format: { type: "label" } },
                      { name: "appr_rmk" }
                    ]
                }
            ]
        }
    };
    //----------
    if (param.editable) {
        args.content.row[0].element[1].format = { type: "textarea", rows: 2, width: 535 };
        args.content.row[0].element[1].editable = { type: "textarea", rows: 2, width: 535 };
    } else {
        args.content.row[0].element[1].format = { type: "textarea", rows: 2, width: 535 };
    }
    //----------
    gw_com_module.formCreate(args);
    //=====================================================================================
    var args = {
        target: [
            { type: "FORM", id: "frmData_RMK", offset: 8 }
        ]
    };
    //----------
    gw_com_module.objResize(args);
    //=====================================================================================
    //----------
    var args = { targetid: "frmData_RMK", event: "itemchanged", handler: processItemchanged };
    gw_com_module.eventBind(args);
    //=====================================================================================

}
//----------
function processDownload(param) {

    var args = {
        source: { id: param.object, row: param.row },
        targetid: "lyrDown"
    };
    gw_com_module.downloadFile(args);

}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_showMessage:
            {
                gw_com_module.streamInterface(param);
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = {
                    to: { type: "POPUP",  page: param.from.page  }
                };
                switch (param.from.page) {
                    case "DLG_FileUpload":
                        args.data = {
                            type: "APPR",
                            key: ""
                        };
                        break;
                    case "DLG_EDIT_APPR_LINE":
                        args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                        args.data = {
                            dept_nm: gw_com_module.v_Session.DEPT_NM,
                            key: [gw_com_module.v_Session.EMP_NO]
                        };
                        break;
                    default:
                        v_global.data = param.data;
                        processRetrieve({});
                        return
                        break;
                }
                gw_com_module.streamInterface(args);

            }
            break;
        case gw_com_api.v_Stream.msg_resultMessage:
            {
                if (param.data.page != gw_com_api.getPageID())
                    break;
                switch (param.data.ID) {
                    case gw_com_api.v_Message.msg_confirmSave:
                        {
                            if (param.data.result == "YES")
                                //processSave({});
                                processSetAppr(param.data.arg);
                            else {
                                //processRetrieve({});
                                if (v_global.process.handler != null)
                                    v_global.process.handler({});
                            }
                        }
                        break;
                    case gw_com_api.v_Message.msg_informSaved:
                        { param.data.arg.handler(param.data.arg.response, param.data.arg.param); } break;
                    case gw_com_api.v_Message.msg_informBatched:
                        { param.data.arg.handler(param.data.arg.response, param.data.arg.param); } break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                switch (param.from.page) {
                    case "DLG_FileUpload":
                        if (param.data != undefined)
                            //processRetrieve({ object: "grdData_BIZTRIP", type: "GRID", row: "selected" });
                        break;
                }
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedEmployee:
            {
                if (param.data != undefined && param.data.emp_no != undefined) {
                    if (gw_com_api.getFindRow("grdData_APPR_LINE", "appr_emp", param.data.emp_no) == -1) {
                        var args = {
                            targetid: "grdData_APPR_LINE", edit: true, updatable: true,
                            data: [
                                { name: "appr_id", value: v_global.data.appr_id },
                                { name: "appr_seq", rule: "INCREMENT", value: 1 },
                                { name: "appr_tp", value: param.data.appr_tp },
                                { name: "appr_emp", value: param.data.emp_no },
                                { name: "appr_emp_nm", value: param.data.emp_nm },
                                { name: "appr_dept", value: param.data.dept_cd },
                                { name: "appr_dept_nm", value: param.data.dept_nm },
                                { name: "appr_grade", value: param.data.grade_cd },
                                { name: "appr_grade_nm", value: param.data.grade_nm },
                                { name: "appr_duty", value: param.data.duty_cd },
                                { name: "appr_duty_nm", value: param.data.duty_nm }//,
                                //{ name: "appr_tp", value: "결재" }
                            ]
                        };
                        gw_com_module.gridInsert(args);
                    }
                }
            }
            break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//