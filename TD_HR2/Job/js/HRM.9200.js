//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 법인카드관리
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

        //
        if (gw_com_module.v_Session.USER_TP == "SYS") {
            v_global.logic.option = true;
        } else {
            v_global.logic.option = false;
        }

        start();

        //----------
        function start() {
            gw_job_process.UI();
            gw_job_process.procedure();
            gw_com_module.startPage();

            gw_com_api.setValue("frmOption", 1, "use_yn", "Y");
            processRetrieve({});
        }
    },

    // manage UI. (design section)
    UI: function () {

        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "조회", value: "조회", act: true },
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" },
                { name: "저장", value: "저장" },
                { name: "닫기", value: "닫기" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //----------
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: false, remark: "lyrRemark2",
            editable: { focus: "work_ym", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "owner_nm", label: { title: "소유자 :" },
                                editable: { type: "text", size: 10 }
                            },
                            {
                                name: "use_yn", label: { title: "사용여부 :" },
                                editable: { type: "checkbox", value: "Y", offval: "N" }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "card_nb", label: { title: "카드번호 :" },
                                editable: { type: "text", size: 20 }
                            }
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
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_MAIN", query: "HRM_9200_1", title: "법인카드",
            caption: true, height: 446, pager: false, show: true, selectable: true, number: true,
            element: [
                { header: "카드번호", name: "card_nb", width: 70, align: "center" },
                { header: "유효기간", name: "card_exp_date2", width: 40, align: "center" },
                { header: "소유자", name: "card_owner_nm", width: 80, align: "center" },
                { header: "결재일", name: "card_bill_day", width: 30, align: "center" },
                { header: "사용", name: "use_yn", format: { type: "checkbox", value: "Y", offval: "N" }, width: 30, align: "center" },
                { header: "사용자수", name: "user_cnt", width: 30, align: "right" },
                { name: "card_seq", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_SUB", query: "HRM_9200_2", title: "사용자",
            caption: true, height: 446, pager: false, show: true, selectable: true, number: true, dynamic: true,
            editable: { multi: true, bind: "select", focus: "open_yn", validate: true },
            element: [
                {
                    header: "공개", name: "open_yn", width: 30, align: "center",
                    format: { type: "checkbox", value: "1", offval: "0" },
                    editable: { type: "checkbox", value: "1", offval: "0" }
                },
                {
                    header: "사원번호", name: "emp_no", width: 50, align: "center",
                    editable: { type: "hidden" }
                },
                { header: "성명", name: "emp_nm", width: 50, align: "center" },
                { header: "직급", name: "grade_nm", width: 50, align: "center" },
                { header: "부서", name: "dept_nm", width: 100, align: "center" },
                { name: "card_nb", editable: { type: "hidden" }, hidden: true },
                { header: "uuid", name: "uuid", editable: { type: "hidden" }, width: 50, align: "center" }
//                { name: "uuid", editable: { type: "hidden" }, hidden: true }
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
                { type: "GRID", id: "grdList_MAIN", offset: 8 },
                { type: "GRID", id: "grdData_SUB", offset: 8 }
			]
        };
        gw_com_module.objResize(args);
        //=====================================================================================
        gw_com_module.informSize();

    },

    // manage process. (program section)
    procedure: function () {

        //=====================================================================================
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: viewOption };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: closeOption };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdList_MAIN", grid: true, event: "rowselecting", handler: processRowSelecting };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_MAIN", grid: true, event: "rowselected", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //=====================================================================================

    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function viewOption(param) {

    gw_com_api.show("frmOption");

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

}
//----------
function processButton(param) {

    closeOption({});
    switch (param.element) {
        case "추가":
            processInsert(param);
            break;
        case "삭제":
            processDelete(param);
            break;
        case "저장":
            processSave(param);
            break;
        case "닫기":
            v_global.process.handler = processClose;
            if (!checkUpdatable({})) return;
            processClose({});
            break;
    }

}
//----------
function processRowSelecting(param) {

    v_global.process.handler = processSelect;
    v_global.process.current.master = param.row;
    return checkUpdatable({});

}
//----------
function processSelect(param) {

    gw_com_api.selectRow("grdList_MAIN", v_global.process.current.master, true, false);

}
//----------
function processRetrieve(param) {

    var args;
    if (param.object == "grdList_MAIN") {
        args = {
            source: {
                type: param.type, id: param.object, row: param.row,
                element: [
                    { name: "card_nb", argument: "arg_card_nb" }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_SUB", select: true }
            ],
            handler: {
                complete: processRetrieveEnd,
                param: param
            },
            key: param.key
        };
    } else {
        args = {
            source: {
                type: "FORM", id: "frmOption", hide: true,
                element: [
                    { name: "owner_nm", argument: "arg_owner_nm" },
                    { name: "use_yn", argument: "arg_use_yn" },
                    { name: "card_nb", argument: "arg_card_nb" },
                ]
            },
            target: [
                { type: "GRID", id: "grdList_MAIN", select: true }
            ],
            clear: [
                { type: "GRID", id: "grdData_SUB" }
            ],
            key: param.key
        };
    }
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {


}
//----------
function processInsert(param) {

    if (gw_com_api.getSelectedRow("grdList_MAIN", false) < 1) return;
    var args = {
        type: "PAGE", page: "HRM_9201", title: "사원 검색",
        width: 600, height: 350, locate: ["center", "top"], open: true
    };
    if (gw_com_module.dialoguePrepare(args) == false) {
        var args = {
            page: "HRM_9201",
            param: {
                ID: gw_com_api.v_Stream.msg_openedDialogue,
                data: {
                    dept_nm: gw_com_module.v_Session.DEPT_NM,
                    key: [gw_com_module.v_Session.EMP_NO],
                    height: 200,
                    multi: true
                }
            }
        };
        gw_com_module.dialogueOpen(args);
    }

}
//----------
function processDelete(param) {

    var args = { targetid: "grdData_SUB", row: "selected", select: true }
    gw_com_module.gridDelete(args);

}
//----------
function processSave(param) {

    var args = {
        target: [
			{ type: "GRID", id: "grdData_SUB" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args.url = "COM";
    args.handler = {
        success: successSave,
        param: param
    };
    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    processRetrieve({ type: "GRID", object: "grdList_MAIN", row: "selected" });

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
function checkUpdatable(param) {

    var args = {
        check: param.check,
        target: [
            { type: "GRID", id: "grdData_SUB" }
        ],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}
//----------
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_showMessage:
            {
                gw_com_module.streamInterface(param);
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
                            if (param.data.result == "YES") {
                                processSave(param.data.arg);
                            } else {
                                if (v_global.process.handler != null)
                                    v_global.process.handler(param.data.arg);
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
                }
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = {
                    to: { type: "POPUP", page: param.from.page },
                    ID: param.ID
                };
                switch (param.from.page) {
                    case "HRM_9201":
                        args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                        args.data = {
                            dept_nm: gw_com_module.v_Session.DEPT_NM,
                            key: [gw_com_module.v_Session.EMP_NO],
                            height: 200,
                            multi: true,
                        };
                        break;
                }
                gw_com_module.streamInterface(args);
            } break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                switch (param.from.page) {
                    case "HRM_9201":
                        if (param.data != undefined) {
                            if (param.data != undefined) {
                                var rows = [];
                                $.each(param.data, function () {
                                    if (gw_com_api.getFindRow("grdData_SUB", "uuid", this.uuid) == -1) {
                                        rows.push({
                                            card_nb: gw_com_api.getValue("grdList_MAIN", "selected", "card_nb", true),
                                            emp_no: this.emp_no,
                                            emp_nm: this.emp_nm,
                                            grade_nm: this.grade_nm,
                                            dept_nm: this.dept_nm,
                                            uuid: this.uuid
                                        });
                                    }

                                });

                                if (rows.length > 0) {
                                    var args = {
                                        targetid: "grdData_SUB", edit: true, updatable: true,
                                        data: rows
                                    };
                                    gw_com_module.gridInserts(args);
                                }
                            }
                        }
                        break;
                }
                closeDialogue({ page: param.from.page });
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//