 
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

            // 첨부파일 임시 키
            v_global.logic.file_key = gw_com_module.v_Session.USR_ID + new Date().getTime();

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
            targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "제출", value: "제출", icon: "저장" },
				{ name: "취소", value: "취소", icon: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_APPR_LINE", type: "FREE",
            element: [
				{ name: "추가", value: "결재선추가" },
				{ name: "삭제", value: "결재선삭제" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_FILE", type: "FREE",
            element: [
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_APPR", query: "DLG_EDIT_APPR", type: "TABLE", title: "",
            width: "100%", caption: false, show: true, selectable: true,
            editable: { bind: "select", focus: "appr_date", validate: true },
            content: {
                width: { label: 100, field: 120 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "결재문서 유형", format: { type: "label" } },
                            { name: "form_nm", editable: { type: "hidden", width: 200 } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "상신자", format: { type: "label" } },
                            { name: "rqst_emp_nm2", editable: { type: "hidden", width: 200 } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "상신일시", format: { type: "label" } },
                            { name: "rqst_date", editable: { type: "hidden", width: 200 }, mask: "date-ymd" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "완료희망일", format: { type: "label" } },
                            { name: "plan_date", editable: { type: "text", width: 100 }, mask: "date-ymd" }
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
            targetid: "grdData_APPR_LINE", query: "DLG_EDIT_APPR_LINE", title: "",
            caption: false, height: 96, pager: false, show: true, selectable: true, number: true,
            editable: { multi: true, bind: "select", validate: true },
            element: [
                {
                    header: "구분", name: "appr_tp", width: 60, align: "center",
                    editable: { type: "select", data: { memory: "결재유형" }, validate: { rule: "required" } }
                },
                { header: "결재자", name: "appr_emp_nm", width: 60, editable: { type: "hidden" }, align: "center" },
                { header: "직급", name: "appr_grade_nm", width: 60, align: "center" },
				{ header: "직책", name: "appr_duty_nm", width: 60, align: "center" },
				{ header: "부서", name: "appr_dept_nm", width: 100 },
                { name: "appr_id", editable: { type: "hidden" }, hidden: true },
                { name: "appr_seq", editable: { type: "hidden" }, hidden: true },
                { name: "appr_emp", editable: { type: "hidden" }, hidden: true },
                { name: "appr_grade", editable: { type: "hidden" }, hidden: true },
                { name: "appr_duty", editable: { type: "hidden" }, hidden: true },
                { name: "appr_dept", editable: { type: "hidden" }, hidden: true },
                { name: "appr_yn", editable: { type: "hidden" }, hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_INPUT", query: "DLG_EDIT_APPR", type: "TABLE", title: "",
            caption: false, show: true, fixed: true, selectable: true,
            editable: { bind: "select", focus: "doc_title", validate: true },
            content: {
                width: { label: 123, field: 680 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "제    목", format: { type: "label" } },
                            { name: "doc_title", editable: { type: "text", width: 884 }, validate: { rule: "required" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "상신 비고", format: { type: "label" } },
                            {
                                name: "rqst_rmk",
                                format: { type: "textarea", rows: 2, width: 882 },
                                editable: { type: "textarea", rows: 2, width: 882 }
                            }
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
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            editable: { multi: true, bind: "_edit_yn", focus: "file_desc", validate: true },
            element: [
				{ header: "파일명", name: "file_nm", width: 250 },
				{ header: "다운로드", name: "download", width: 60, align: "center", format: { type: "link", value: "다운로드" } },
				{ header: "설명", name: "file_desc", width: 300, editable: { type: "text" } },
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
        var args = { targetid: "lyrMenu", element: "제출", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "취소", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_APPR_LINE", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_APPR_LINE", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_FILE", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_FILE", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmData_INPUT", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_APPR_LINE", grid: true, event: "itemchanged", handler: processItemchanged };
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
function processInit(param) {
    
    var args = {
        source: {
            type: "INLINE",
            argument:[
                { name: "arg_frm_id", value: v_global.data.frm_id == undefined ? "" : v_global.data.frm_id },
                { name: "arg_ref_key1", value: v_global.data.ref_key1 == undefined ? "" : v_global.data.ref_key1 },
                { name: "arg_ref_key2", value: v_global.data.ref_key2 == undefined ? "" : v_global.data.ref_key2 },
                { name: "arg_ref_key3", value: v_global.data.ref_key3 == undefined ? "" : v_global.data.ref_key3 },
                { name: "arg_ref_key4", value: v_global.data.ref_key4 == undefined ? "" : v_global.data.ref_key4 },
                { name: "arg_ref_key5", value: v_global.data.ref_key5 == undefined ? "" : v_global.data.ref_key5 },
                { name: "arg_root_no", value: v_global.data.root_no == undefined ? "" : v_global.data.root_no },
                { name: "arg_root_seq", value: v_global.data.root_seq == undefined ? "0" : v_global.data.root_seq },
                { name: "arg_emp_no", value: gw_com_module.v_Session.EMP_NO }
            ]
        },
        target: [
            { type: "FORM", id: "frmData_APPR", crud: "insert", edit: true, updatable: true, query: "DLG_EDIT_APPR_0" },
            { type: "GRID", id: "grdData_APPR_LINE", crud: "insert", select: true, query: "DLG_EDIT_APPR_LINE_0" },
            { type: "FORM", id: "frmData_INPUT", edit: true, updatable: true, query: "DLG_EDIT_APPR_0" },
            { type: "FORM", id: "frmData_HTML", query: "DLG_EDIT_APPR_0" }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processButton(param) {

    switch (param.element) {
        case "제출":
            gw_com_api.messageBox(
                [{ text: "제출과 동시에 기안자 결재는 승인 처리됩니다." }, { text: "상신문서를 제출하시겠습니까?" }],
                450, gw_com_api.v_Message.msg_confirmSave, "YESNO");
            break;
        case "추가":
            processInsert(param);
            break;
        case "삭제":
            processDelete(param);
            break;
    }

}
//----------
function processItemchanged(param) {

    if (param.object == "frmData_INPUT") {
        if (param.element == "rqst_rmk") {
            gw_com_api.setValue("frmData_APPR", 1, param.element, param.value.current);
        }
    } else if (param.object == "grdData_APPR_LINE") {
        if (param.element == "appr_tp") {
            switch (param.value.current) {
                case "결재":
                    if (gw_com_api.getFindRow(param.object, "appr_tp", "전결") < 1) {
                        var row = gw_com_api.getFindRow(param.object, "appr_tp", "후열");
                        while (row > 0) {
                            gw_com_api.setValue(param.object, row, "appr_tp", "결재", true, false, false);
                            row = gw_com_api.getFindRow(param.object, "appr_tp", "후열");
                        }
                    }
                    break;
                case "전결":
                    var ids = gw_com_api.getRowIDs(param.object);
                    $.each(ids, function () {
                        if (this > param.row) {
                            if ($.inArray(gw_com_api.getValue(param.object, this, "appr_tp", true), ["결재", "전결"]) >= 0) {
                                gw_com_api.setValue(param.object, this, "appr_tp", "후열", true, false, false);
                            }
                        } else if (this < param.row) {
                            if ($.inArray(gw_com_api.getValue(param.object, this, "appr_tp", true), ["전결", "후열"]) >= 0) {
                                gw_com_api.setValue(param.object, this, "appr_tp", "결재", true, false, false);
                            }
                        }
                    });
                    break;
            }
        }
    }

}
//----------
function processInsert(param) {

    if (param.object == "lyrMenu_APPR_LINE") {
        var args = {
            type: "PAGE", page: "DLG_EDIT_APPR_LINE", title: "사원 검색",
            width: 600, height: 350, locate: ["left", "top"], open: true
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
            width: 650, height: 140, locate: ["center", "center"], open: true,
        };
        if (gw_com_module.dialoguePrepare(args) == false) {
            args = {
                page: args.page,
                param: {
                    ID: gw_com_api.v_Stream.msg_openedDialogue,
                    data: {
                        type: "APPR",
                        key: v_global.logic.file_key
                    }
                }
            };
            gw_com_module.dialogueOpen(args);
        }
    }

}
//----------
function processDelete(param) {

    var args;
    switch (param.object) {
        case "lyrMenu_APPR_LINE":
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
    
    var ids = gw_com_api.getRowIDs("grdData_APPR_LINE");
    if (ids.length == 0) {
        gw_com_api.messageBox([{ text: "결재선을 지정하세요." }]);
        return;
    }
    // 첫 번째 결재선이 "참조"면 안됨.
    if (gw_com_api.getValue("grdData_APPR_LINE", ids[0], "appr_tp", true) == "") {
        gw_com_api.messageBox([{ text: "첫 번째 결재선의 결재구분에 [참조]를 입력할 수 없습니다.." }], 500);
        return;
    }

    // editor control 사용할 경우 image url 처리
    //v_global.data.args.body = convertImgeUrl(gw_com_api.getValue("frmData_INPUT", 1, "body"));

    //// 첫번째 로우 대기상태로..
    //gw_com_api.setValue("grdData_APPR_LINE", ids[0], "appr_yn", "대기", true);

    gw_com_api.setCRUD("frmData_APPR", 1, "create");

    var args = {
        nomessage: true,
        target: [
            { type: "FORM", id: "frmData_APPR" },
			{ type: "GRID", id: "grdData_APPR_LINE" },
            { type: "GRID", id: "grdData_FILE" }
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

    var appr_id = response[0].KEY[0].VALUE

    // 첨부파일 연결
    var ids = gw_com_api.getRowIDs("grdData_FILE");
    if (ids.length > 0) {
        var row = new Array();
        $.each(ids, function () {
            row.push(
                {
                    crud: "U",
                    column: [
                        { name: "file_id", value: gw_com_api.getValue("grdData_FILE", this, "file_id", true) },
                        { name: "data_key", value: appr_id }
                    ]
                }
            );
        });
        var args = {
            url: "COM",
            nomessage: true,
            user: gw_com_module.v_Session.USR_ID,
            param: [
                {
                    query: "DLG_EDIT_APPR_FILE",
                    row: row
                }
            ]
        };
        gw_com_module.objSave(args);
    }

    var data = {
        appr_id: appr_id,
        frm_id: v_global.data.frm_id == undefined ? "" : v_global.data.frm_id,
        ref_key1: v_global.data.ref_key1 == undefined ? "" : v_global.data.ref_key1,
        ref_key2: v_global.data.ref_key2 == undefined ? "" : v_global.data.ref_key2,
        ref_key3: v_global.data.ref_key3 == undefined ? "" : v_global.data.ref_key3,
        ref_key4: v_global.data.ref_key4 == undefined ? "" : v_global.data.ref_key4,
        ref_key5: v_global.data.ref_key5 == undefined ? "" : v_global.data.ref_key5,
        root_no: v_global.data.root_no == undefined ? "" : v_global.data.root_no,
        root_seq: v_global.data.root_seq == undefined ? "0" : v_global.data.root_seq
    };
    //processClose({ data: data });
    processBatch(data);

}
//----------
function processBatch(param) {

    var ids = gw_com_api.getRowIDs("grdData_APPR_LINE");
    var args = {
        url: "COM",
        procedure: "dbo.sp_ApprDoc_Confirm",
        input: [
            { name: "ApprId", value: param.appr_id, type: "varchar" },
            { name: "ApprSeq", value: gw_com_api.getValue("grdData_APPR_LINE", ids[0], "appr_seq", true), type: "varchar" },
            { name: "ApprYn", value: "승인", type: "varchar" },
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

    processClose({ data: param });

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

}
//----------
function closeDialogue(param) {

    var args = {
        page: param.page
    };
    gw_com_module.dialogueClose(args);

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
                        args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                        args.data = {
                            type: "APPR",
                            key: v_global.logic.file_key
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
                        processInit({});
                        return;
                        break;
                }
                gw_com_module.streamInterface(args);

            }
            break;
        case gw_com_api.v_Stream.msg_resultMessage:
            {
                if (param.data.page != gw_com_api.getPageID()) {
                    param.to = { type: "POPUP", page: param.data.page };
                    gw_com_module.streamInterface(param);
                    break;
                }
                switch (param.data.ID) {
                    case gw_com_api.v_Message.msg_confirmSave:
                        {
                            if (param.data.result == "YES")
                                processSave(param.data.arg);
                            else {
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
                        if (param.data != undefined) {
                            var args = {
                                source: {
                                    type: "INLINE",
                                    argument: [
                                        { name: "arg_file_key", value: v_global.logic.file_key }
                                    ]
                                },
                                target: [
                                    { type: "GRID", id: "grdData_FILE", select: true, query: "DLG_EDIT_APPR_FILE_0" }
                                ]
                            };
                            gw_com_module.objRetrieve(args);
                        }
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
                                { name: "appr_emp", value: param.data.emp_no },
                                { name: "appr_emp_nm", value: param.data.emp_nm },
                                { name: "appr_dept", value: param.data.dept_cd },
                                { name: "appr_dept_nm", value: param.data.dept_nm },
                                { name: "appr_grade", value: param.data.grade_cd },
                                { name: "appr_grade_nm", value: param.data.grade_nm },
                                { name: "appr_duty", value: param.data.duty_cd },
                                { name: "appr_duty_nm", value: param.data.duty_nm },
                                { name: "appr_tp", value: "결재" }
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