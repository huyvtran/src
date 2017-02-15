//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 업무실적등록
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

        // set data for DDDW List
        var args = {
            request: [
                {
                    type: "PAGE", name: "사업부", query: "dddw_deptarea",
                    param: [
                        { argument: "arg_type", value: gw_com_module.v_Session.DEPT_AUTH }
                    ]
                }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);

        //----------
        function start() {
            gw_job_process.UI();
            gw_job_process.procedure();
            gw_com_module.startPage();

            gw_com_api.setValue("frmOption", 1, "work_ymd_fr", gw_com_api.getYM("", { month: -1 }));
            gw_com_api.setValue("frmOption", 1, "work_ymd_to", gw_com_api.getYM("", { month: -1 }));
        }
    },

    // manage UI. (design section)
    UI: function () {

        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "조회", value: "조회", act: true },
                { name: "닫기", value: "닫기" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true, remark: "lyrRemark2",
            editable: { focus: "work_ymd", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "dept_area", label: { title: "사업부 :" },
                                editable: { type: "select", data: { memory: "사업부", unshift: [{ title: "전체", value: "%" }] } }
                            },
                            {
                                name: "work_ymd_fr", label: { title: "근무연월 :" }, mask: "date-ym", style: { colfloat: "floating" },
                                editable: { type: "text", size: 6, maxlength: 7, validate: { rule: "required" } }
                            },
                            {
                                name: "work_ymd_to", label: { title: "~" }, mask: "date-ym",
                                editable: { type: "text", size: 6, maxlength: 7, validate: { rule: "required" } }
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
            targetid: "grdData_MAIN", query: "HRM_3069_1", title: "월간 부서별/프로젝트별 합계",
            caption: true, height: 250, pager: false, show: true, selectable: true, number: true,
            element: [
                { header: "연월", name: "work_ymd", width: 60, align: "center", mask: "date-ym" },
                { header: "부서", name: "dept_nm", width: 100, align: "center" },
                { header: "프로젝트 번호", name: "proj_no", width: 80, align: "center" },
                { header: "프로젝트 번호(구)", name: "proj_no_old", width: 80, align: "center" },
                { header: "프로젝트명", name: "proj_nm", width: 200 },
                { header: "투입시간", name: "input_time", width: 60, align: "right", mask: "numeric-float" },
                { name: "dept_cd", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_SUB", query: "HRM_3069_2", title: "투입시간 내역",
            caption: true, height: 140, pager: false, show: true, selectable: true, number: true,
            element: [
                { header: "연월", name: "work_ymd", width: 60, align: "center", mask: "date-ym" },
                { header: "부서", name: "dept_nm", width: 100, align: "center" },
                { header: "사원번호", name: "emp_no", width: 60, align: "center" },
                { header: "성명", name: "emp_nm", width: 60, align: "center" },
                { header: "프로젝트번호", name: "proj_no", width: 60, align: "center" },
                { header: "프로젝트번호(구)", name: "proj_no_old", width: 60, align: "center" },
                { header: "프로젝트명", name: "proj_nm", width: 200 },
				{ header: "투입시간", name: "input_time", width: 50, align: "right", mask: "numeric-float" },
                { name: "emp_no", editable: { type: "hidden" }, hidden: true },
                { name: "work_ymd", editable: { type: "hidden" }, hidden: true }
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
                { type: "GRID", id: "grdData_MAIN", offset: 8 },
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
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption", event: "itemdblclick", handler: processItemdblClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemkeyenter", handler: processItemdblClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: closeOption };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_MAIN", grid: true, event: "rowselecting", handler: processRowSelecting };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_MAIN", grid: true, event: "rowselected", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_MAIN", grid: true, event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_SUB", grid: true, event: "itemchanged", handler: processItemchanged };
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
        case "실행":
            v_global.process.handler = processRetrieve;
            if (!checkUpdatable({})) return;
            processRetrieve({});
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

    gw_com_api.selectRow("grdData_MAIN", v_global.process.current.master, true, false);

}
//----------
function processItemchanged(param) {

    if (param.object == "frmOption") {
        switch (param.element) {
            case "dept_nm":
                if (param.value.current == "")
                    gw_com_api.setValue(param.object, param.row, "dept_cd", "");
                break;
            case "emp_nm":
                if (param.value.current == "")
                    gw_com_api.setValue(param.object, param.row, "emp_no", "");
                break;
        }
    } else if (param.object == "grdData_MAIN" && param.element == "work_ymd") {
        var ids = gw_com_api.getRowIDs("grdData_SUB");
        $.each(ids, function () {
            gw_com_api.selectRow("grdData_SUB", this, true);
            gw_com_api.setValue("grdData_SUB", this, "work_ymd", gw_com_api.unMask(param.value.current, "date-ym"), true, true, false);
        });
    } else if (param.object == "grdData_SUB") {
    }

}
//----------
function processItemdblClick(param) {

    v_global.event.type = param.type;
    v_global.event.object = param.object;
    v_global.event.row = param.row;
    v_global.event.element = param.element;

    var args;
    switch (param.element) {
        case "dept_nm":
            args = {
                type: "PAGE", page: "w_find_dept", title: "부서 검색",
                width: 600, height: 450, locate: ["center", "top"], open: true,
                data: {
                    dept_nm: gw_com_api.getValue(
                        v_global.event.object,
                        v_global.event.row,
                        v_global.event.element,
                        (v_global.event.type == "GRID" ? true : false))
                }
            };
            break;
        case "emp_nm":
            args = {
                type: "PAGE", page: "w_find_emp", title: "사원 검색",
                width: 600, height: 450, locate: ["center", "top"], open: true,
                data: {
                    emp_nm: gw_com_api.getValue(
                        v_global.event.object,
                        v_global.event.row,
                        v_global.event.element,
                        (v_global.event.type == "GRID" ? true : false))
                }
            };
            break;
        case "proj_no":
            args = {
                type: "PAGE", page: "DLG_PROJECT", title: "Project",
                width: 700, height: 400, locate: ["center", "top"], open: true,
                data: {
                    proj_no: gw_com_api.getValue(
                        v_global.event.object,
                        v_global.event.row,
                        v_global.event.element,
                        (v_global.event.type == "GRID") ? true : false)
                }
            };
            break;
    }

    if (args != null) {
        if (gw_com_module.dialoguePrepare(args) == false) {
            args = {
                page: args.page,
                param: {
                    ID: gw_com_api.v_Stream.msg_openedDialogue,
                    data: args.data
                }
            };
            gw_com_module.dialogueOpen(args);
        }
    }

}
//----------
function processRetrieve(param) {

    var args = { target: [{ type: "FORM", id: "frmOption" }] };
    if (!gw_com_module.objValidate(args)) return;

    var args;
    if (param.object == "grdData_MAIN") {
        args = {
            source: {
                type: param.type, id: param.object, row: "selected",
                element: [
                    { name: "work_ymd", argument: "arg_work_ymd" },
                    { name: "dept_cd", argument: "arg_dept_cd" },
                    { name: "proj_no", argument: "arg_proj_no" }
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
                    { name: "dept_area", argument: "arg_dept_area" },
                    { name: "work_ymd_fr", argument: "arg_work_ymd_fr" },
                    { name: "work_ymd_to", argument: "arg_work_ymd_to" }
                ],
                remark: [
                    { element: [{ name: "dept_area" }] },
                    { infix: "~", element: [{ name: "work_ymd_fr" }, { name: "work_ymd_to" }] }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_MAIN", select: true }
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

}
//----------
function processDelete(param) {

    if (!checkStat()) {
        gw_com_api.messageBox([{ text: "확정된 내역은 삭제할 수 없습니다." }]);
        return;
    }
    var args;
    if (param.object == "lyrMenu_SUB") {
        args = { targetid: "grdData_SUB", row: "selected", select: true }
    } else {
        var status = checkCRUD({});
        if (status == "initialize" || status == "create") {
            args = {
                targetid: "grdData_MAIN", row: "selected", remove: true,
                clear: [
                    { type: "GRID", id: "grdData_SUB" }
                ]
            }
        } else {
            v_global.process.handler = processRemove;
            gw_com_api.messageBox([{ text: "REMOVE" }], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO");
            return;
        }
    }
    gw_com_module.gridDelete(args);

}
//----------
function processRemove(param) {

    if (gw_com_api.getSelectedRow("grdData_MAIN", false) == null) return;
    var args = {
        url: "COM",
        target: [
            {
                type: "GRID", id: "grdData_MAIN",
                key: [{ row: "selected", element: [{ name: "work_ymd" }, { name: "emp_no" }] }]
            }
        ],
        handler: {
            success: successRemove,
            param: param
        }
    };
    gw_com_module.objRemove(args);

}
//----------
function successRemove(param) {

    processRetrieve({});

}
//----------
function processSave(param) {

}
//----------
function successSave(response, param) {

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
function processRestore(param) {

    var args = { targetid: "grdData_MAIN", row: "selected" };
    gw_com_module.gridRestore(args);

}
//----------
function checkUpdatable(param) {

    var args = {
        check: param.check,
        target: [
            { type: "GRID", id: "grdData_MAIN" },
            { type: "GRID", id: "grdData_SUB" }
        ],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function checkCRUD(param) {

    return gw_com_api.getCRUD("grdData_MAIN", "selected", true);

}
//----------
function checkStat() {

    return ($.inArray(gw_com_api.getValue("grdData_MAIN", "selected", "pstat", true), ["1"]) >= 0 ? false : true);

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
                                var status = checkCRUD({});
                                if (status == "initialize" || status == "create")
                                    processDelete({});
                                else if (status == "update")
                                    processRestore({});

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
                    case gw_com_api.v_Message.msg_confirmBatch:
                        { if (param.data.result == "YES") processBatch(param.data.arg); } break;
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
                    case "DLG_FileUpload":
                        args.data = {
                            type: "PER_SUPP",
                            key: v_global.logic.per_no,
                            seq: v_global.logic.supp_seq
                        };
                        break;
                    case "DLG_PROJECT2":
                        args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                        args.data = {
                            dept_area_nm: v_global.logic.dept_area_nm,
                            multi: true
                        };
                        break;
                    case "DLG_ExcelImport":
                        args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                        args.data = {
                            JOB_ID: "HRM_3060",
                            work_ymd: gw_com_api.getValue("frmOption", 1, "work_ymd")
                        }
                        break;
                    case "w_find_emp":
                        {
                            args.data = {
                                dept_nm: gw_com_api.getValue(
                                    v_global.event.object,
                                    v_global.event.row,
                                    "dept_nm",
                                    (v_global.event.type == "GRID" ? true : false)),
                                emp_nm: gw_com_api.getValue(
                                    v_global.event.object,
                                    v_global.event.row,
                                    v_global.event.element,
                                    (v_global.event.type == "GRID" ? true : false))
                            }

                        }
                        break;
                    case "w_find_dept":
                        {
                            args.data = {
                                dept_nm: gw_com_api.getValue(
                                    v_global.event.object,
                                    v_global.event.row,
                                    v_global.event.element,
                                    (v_global.event.type == "GRID" ? true : false))
                            }
                        }
                        break;
                }
                gw_com_module.streamInterface(args);
            } break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                switch (param.from.page) {
                    case "DLG_FileUpload":
                        if (param.data != undefined)
                            processRetrieve({});
                        break;
                    case "DLG_PROJECT2":
                        if (param.data != undefined) {
                            var rows = [];
                            $.each(param.data, function () {
                                if (gw_com_api.getFindRow("grdData_SUB", "work_cd", this.proj_key) == -1) {
                                    rows.push({
                                        work_ymd: gw_com_api.getValue("grdData_MAIN", "selected", "work_ymd", true),
                                        emp_no: gw_com_api.getValue("grdData_MAIN", "selected", "emp_no", true),
                                        work_cd: this.proj_key,
                                        work_nm: this.proj_nm,
                                        proj_no_old: this.proj_no_old
                                    });
                                }

                            });

                            if(rows.length>0){
                                var args = {
                                    targetid: "grdData_SUB", edit: true, updatable: true,
                                    data: rows
                                };
                                gw_com_module.gridInserts(args);
                            }
                        }
                        break;
                    case "DLG_ExcelImport":
                        if (param.data != undefined)
                            processRetrieve({});
                        break;
                    case "w_find_emp":
                        if (param.data != undefined) {
                            gw_com_api.setValue(
                                                v_global.event.object,
                                                v_global.event.row,
                                                v_global.event.element,
                                                param.data.emp_nm,
                                                (v_global.event.type == "GRID") ? true : false);
                            gw_com_api.setValue(
                                                v_global.event.object,
                                                v_global.event.row,
                                                "emp_no",
                                                param.data.emp_no,
                                                (v_global.event.type == "GRID") ? true : false);
                            gw_com_api.setValue(
                                                v_global.event.object,
                                                v_global.event.row,
                                                "dept_nm",
                                                param.data.dept_nm,
                                                (v_global.event.type == "GRID") ? true : false);
                            gw_com_api.setValue(
                                                v_global.event.object,
                                                v_global.event.row,
                                                "dept_cd",
                                                param.data.dept_cd,
                                                (v_global.event.type == "GRID") ? true : false);
                        }
                        break;
                    case "w_find_dept":
                        if (param.data != undefined) {
                            gw_com_api.setValue(
                                                v_global.event.object,
                                                v_global.event.row,
                                                v_global.event.element,
                                                param.data.dept_nm,
                                                (v_global.event.type == "GRID") ? true : false);
                            gw_com_api.setValue(
                                                v_global.event.object,
                                                v_global.event.row,
                                                "dept_cd",
                                                param.data.dept_cd,
                                                (v_global.event.type == "GRID") ? true : false);
                        }
                        break;
                }
                closeDialogue({ page: param.from.page });
            }
            break;
    }

}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//