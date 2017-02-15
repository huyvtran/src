//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 근태보고등록
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

        // set data for DDDW List
        var args = {
            request: [
                {
                    type: "PAGE", name: "근태구분",
                    query: "DDDW_HRM_COMMON",
                    param: [{ argument: "arg_hcode", value: "B130" }]
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

            //팀장일 경우 수정가능
            if (gw_com_module.v_Session.USER_TP == "SYS" || EmpInfo.getDuty({}) == "125") {
                v_global.logic.editable = true;
            } else {
                v_global.logic.editable = false;
            }

            gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -1 }));
            gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate("", { month: 1 }));
            gw_com_api.setValue("frmOption", 1, "dept_cd", gw_com_module.v_Session.DEPT_CD);
            gw_com_api.setValue("frmOption", 1, "dept_nm", gw_com_module.v_Session.DEPT_NM);
        }
    },

    // manage UI. (design section)
    UI: function () {

        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "조회", value: "조회", act: true },
                //{ name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" },
                { name: "저장", value: "저장" },
                //{ name: "보고", value: "보고", icon: "기타" },
                { name: "닫기", value: "닫기" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_DETAIL", type: "FREE",
            element: [
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true, remark: "lyrRemark2",
            editable: { focus: "ymd_fr", validate: true },
            content: {
                row: [
                    {
                        element: [
				            {
				                name: "ymd_fr", label: { title: "기간 :" }, mask: "date-ymd",
				                editable: { type: "text", size: 7, maxlength: 10, validate: { rule: "dateISO" } }, style: { colfloat: "floating" }
				            },
				            {
				                name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
				                editable: { type: "text", size: 7, maxlength: 10, validate: { rule: "dateISO" } }
				            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "dept_nm", label: { title: "부서 :" }, mask: "search",
                                editable: { type: "text", size: 15 }
                            },
                            { name: "dept_cd", hidden: true },
                            {
                                name: "emp_nm", label: { title: "사원 :" }, mask: "search",
                                editable: { type: "text", size: 10 }
                            },
                            { name: "emp_no", hidden: true }
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
            targetid: "grdList_MAIN", query: "HRM_3110_1", title: "근태보고현황",
            caption: true, height: 340, pager: false, show: true, selectable: true, number: true,
            element: [
                { header: "근태구분", name: "atte_nm", width: 60, align: "center" },
                { header: "근무일자", name: "work_date", width: 80, align: "center", mask: "date-ymd" },
				{ header: "근무지", name: "work_location", width: 100 },
				{ header: "근무시간", name: "ot_time", width: 100, align: "center" },
				{ header: "근무지시자", name: "cmd_emp_nm", width: 60, align: "center" },
				{ header: "업무내용", name: "reason", width: 150 },
				{ header: "일정메모", name: "work_rmk", width: 250 },
				{ header: "완료메모", name: "work_rmk2", width: 250 },
                { name: "ext_no", hidden: true },
                { name: "emp_no", hidden: true },
                { name: "atte_cd", hidden: true },
                { name: "dept_cd", hidden: true },
                { name: "cmd_emp", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_MAIN", query: "HRM_3110_2", type: "TABLE", title: "근태 내역",
            show: true, selectable: true, fixed: true, caption: true,
            editable: { bind: "select", focus: "ot_stm", validate: true },
            content: {
                width: { label: 50, field: 50 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "근무자명", format: { type: "label" } },
                            { name: "emp_nm", editable: { type: "hidden", width: 106 } },
                            { name: "emp_no", editable: { type: "hidden" }, hidden: true },
                            { header: true, value: "근무일자", format: { type: "label" } },
                            { name: "work_date", editable: { type: "text", width: 90, validate: { rule: "dateISO" } }, mask: "date-ymd" },
                            { header: true, value: "시작시각", format: { type: "label" } },
                            { name: "ot_stm", editable: { type: "text", width: 40, validate: { rule: "required" } }, mask: "time-hm" },
                            { header: true, value: "종료시각", format: { type: "label" } },
                            { name: "ot_etm", editable: { type: "text", width: 40, validate: { rule: "required" } }, mask: "time-hm" },
                            { name: "nextday_yn", editable: { type: "hidden" }, hidden: true }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "근태구분", format: { type: "label" } },
                            {
                                name: "atte_cd",
                                editable: {
                                    type: "select", width: 110, validate: { rule: "required" },
                                    data: { memory: "근태구분" }, bind: "create"
                                }
                            },
                            { header: true, value: "부서", format: { type: "label" } },
                            { name: "dept_nm", editable: { type: "hidden", width: 110 } },
                            { name: "dept_cd", editable: { type: "hidden" }, hidden: true },
                            { header: true, value: "출근시각", format: { type: "label" } },
                            { name: "att_time", mask: "time-hm", display: true },
                            { header: true, value: "퇴근시각", format: { type: "label" } },
                            { name: "leave_time", mask: "time-hm", display: true }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "근무지", format: { type: "label" } },
                            {
                                name: "work_location",
                                editable: { type: "text", maxlength: 15, width: 106, validate: { rule: "required" } }
                            },
                            { header: true, value: "업무내용", format: { type: "label" } },
                            {
                                name: "reason", style: { colspan: 3 },
                                editable: { type: "text", maxlength: 50, width: 338, validate: { rule: "required" } }
                            },
                            { header: true, value: "근무지시자", format: { type: "label" } },
                            { name: "cmd_emp_nm"/*, editable: { type: "text", width: 106, validate: { rule: "required" } }, mask: "search"*/ },
                            { name: "cmd_emp", editable: { type: "hidden" }, hidden: true }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "일정메모", format: { type: "label" } },
                            {
                                name: "work_rmk", style: { colspan: 5 },
                                format: { type: "textarea", rows: 2, width: 568 },
                                editable: { type: "textarea", rows: 2, maxlength: 250, width: 568 }
                            },
                            { header: true, value: "작성일", format: { type: "label" } },
                            { name: "wdate", editable: { type: "hidden", width: 106 }, display: true }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "완료메모", format: { type: "label" } },
                            {
                                name: "work_rmk2", style: { colspan: 5 },
                                format: { type: "textarea", rows: 2, width: 568 },
                                editable: { type: "textarea", rows: 2, maxlength: 250, width: 568 }
                            },
                            { header: true, value: "최종수정일", format: { type: "label" } },
                            { name: "udate", editable: { type: "hidden", width: 106 }, display: true },
                            { name: "ext_no", editable: { type: "hidden" }, hidden: true }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        v_global.logic.frm = args;
        //=====================================================================================
        var args = {
            targetid: "grdData_DETAIL", query: "HRM_3110_4", title: "동행자",
            caption: true, height: 97, pager: false, show: true, selectable: true, number: true, width: 200,
            editable: { multi: true, bind: "select", focus: "ot_stm", validate: true },
            element: [
                { header: "동행자명", name: "emp_nm", width: 60, align: "center" },
                {
                    header: "시작시각", name: "ot_stm", width: 60, align: "center",
                    editable: { type: "text", width: 50, validate: { rule: "required" } }, mask: "time-hm"
                },
                {
                    header: "종료시각", name: "ot_etm", width: 60, align: "center",
                    editable: { type: "text", width: 50, validate: { rule: "required" } }, mask: "time-hm"
                },
                { name: "ext_no", editable: { type: "hidden" }, hidden: true },
                { name: "emp_no", editable: { type: "hidden" }, hidden: true }
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
                { type: "FORM", id: "frmData_MAIN", offset: 8 },
                { type: "GRID", id: "grdData_DETAIL", offset: 8 }
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
        var args = { targetid: "lyrMenu", element: "보고", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "취소", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_DETAIL", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_DETAIL", element: "삭제", event: "click", handler: processButton };
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
        var args = { targetid: "grdList_MAIN", grid: true, event: "rowselecting", handler: processRowSelecting };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_MAIN", grid: true, event: "rowselected", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmData_MAIN", event: "itemdblclick", handler: processItemdblClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_MAIN", event: "itemchanged", handler: processItemchanged };
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
        case "추가":
            processInsert(param);
            break;
        case "삭제":
            if (!checkManipulate({})) return;
            processDelete(param);
            break;
        case "저장":
            processSave({});
            break;
        case "보고":
            break;
        case "닫기":
            v_global.process.handler = processClose;
            if (!checkUpdatable({})) return;
            processClose({});
            break;
    }

}
//----------
function processItemchanged(param) {

    if (param.object == "frmOption") {
        switch (param.element) {
            case "emp_nm":
                if (param.value.current == "")
                    gw_com_api.setValue(param.object, param.row, "emp_no", "");
                break;
        }
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
        case "emp_nm":
            //case "cmd_emp_nm":
            if (param.object == "frmData_MAIN" && param.element == "emp_nm") return;
            v_global.logic.emp_multi = false;
            args = {
                type: "PAGE", page: "w_find_emp", title: "사원 검색",
                width: 600, height: 450, locate: ["center", "top"], open: true,
                data: {
                    dept_nm: gw_com_module.v_Session.DEPT_NM,
                    multi: v_global.logic.emp_multi
                }
            };
            break;
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
        //changeDW_STAT(checkStat2({}));
        args = {
            source: {
                type: param.type, id: param.object, row: "selected",
                element: [
                    { name: "ext_no", argument: "arg_ext_no" }
                ]
            },
            target: [
                { type: "FORM", id: "frmData_MAIN", edit: true },
                { type: "GRID", id: "grdData_DETAIL", select: true }
            ],
            handler: {
                complete: processRetrieveEnd,
                param: param
            },
            key: param.key
        };
    } else {
        args = { target: [{ type: "FORM", id: "frmOption" }] };
        if (!gw_com_module.objValidate(args)) return;

        args = {
            source: {
                type: "FORM", id: "frmOption", hide: true,
                element: [
                    { name: "ymd_fr", argument: "arg_ymd_fr" },
                    { name: "ymd_to", argument: "arg_ymd_to" },
                    { name: "dept_cd", argument: "arg_dept_cd" },
                    { name: "emp_no", argument: "arg_emp_no" }
                ],
                remark: [
                    { element: [{ name: "emp_nm" }] },
                    { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }] }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_MAIN", select: true }
            ],
            clear: [
                { type: "FORM", id: "frmData_MAIN" },
                { type: "GRID", id: "grdData_DETAIL" }
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

    if (param.object == "lyrMenu") {
        if (!checkUpdatable({ check: true })) return;
        changeDW_STAT(true);
        var args = {
            targetid: "frmData_MAIN", edit: true, updatable: true,
            data: [
                { name: "emp_no", value: gw_com_module.v_Session.EMP_NO },
                { name: "emp_nm", value: gw_com_module.v_Session.USR_NM },
                { name: "dept_cd", value: gw_com_module.v_Session.DEPT_CD },
                { name: "dept_nm", value: gw_com_module.v_Session.DEPT_NM },
                { name: "work_date", value: gw_com_api.getDate() },
                { name: "atte_cd", value: "1" }
            ],
            clear: [
                { type: "GRID", id: "grdData_DETAIL" }
            ]
        };
        gw_com_module.formInsert(args);
    } else {
        if (!checkManipulate({})) return;
        v_global.logic.emp_multi = true;
        var args = {
            type: "PAGE", page: "w_find_emp", title: "사원 검색",
            width: 600, height: 450, locate: ["center", "top"], open: true,
            data: {
                dept_nm: gw_com_module.v_Session.DEPT_NM,
                multi: v_global.logic.emp_multi
            }
        };

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
function processDelete(param) {

    if (!v_global.logic.editable) {
        gw_com_api.messageBox([{ text: "수정 권한이 없습니다." }]);
        return;
    }

    if (!checkStat({})) {
        gw_com_api.messageBox([{ text: "제출 또는 접수된 내역은 삭제 및 수정할 수 없습니다." }]);
        return;
    }

    if (param.object == "lyrMenu") {
        var status = checkCRUD({});
        if (status == "initialize" || status == "create") {
            processRetrieve({ object: "grdList_MAIN", row: "selected", type: "GRID" });
        } else {
            v_global.process.handler = processRemove;
            gw_com_api.messageBox([{ text: "REMOVE" }], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO");
            return;
        }
    } else {
        var args = { targetid: "grdData_DETAIL", row: "selected", select: true }
        gw_com_module.gridDelete(args);
    }

}
//----------
function processRemove(param) {

    if (!v_global.logic.editable) {
        gw_com_api.messageBox([{ text: "수정 권한이 없습니다." }]);
        return;
    }

    var args = {
        url: "COM",
        target: [
            {
                type: "FORM", id: "frmData_MAIN",
                key: {
                    element: [
                        { name: "ext_no" }
                    ]
                }
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

    if (!v_global.logic.editable) {
        gw_com_api.messageBox([{ text: "수정 권한이 없습니다." }]);
        return;
    }

    if (!checkStat({})) {
        gw_com_api.messageBox([{ text: "제출 또는 접수된 내역은 수정할 수 없습니다." }]);
        return;
    }
    var args = {
        url: "COM",
        target: [
			{ type: "FORM", id: "frmData_MAIN" },
            { type: "GRID", id: "grdData_DETAIL" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    if (gw_com_api.getValue("frmData_MAIN", 1, "work_date") == "") {
        gw_com_api.setError(true, "frmData_MAIN", 1, "work_date");
        gw_com_api.messageBox([{ text: "NOVALIDATE" }]);
        return;
    }

    // 중복체크
    if (gw_com_api.getCRUD("frmData_MAIN", 1) == "create") {
        var check = {
            emp_no: gw_com_api.getValue("frmData_MAIN", 1, "emp_no"),
            work_date: gw_com_api.getValue("frmData_MAIN", 1, "work_date"),
            atte_cd: gw_com_api.getValue("frmData_MAIN", 1, "atte_cd")
        }
        if (checkData.BT_ATTEXTRA(check) > 0) {
            gw_com_api.messageBox([{ text: "[" + gw_com_api.Mask(check.work_date, "date-ymd") + "]에 이미 등록된 자료가 있습니다." }]);
            return;
        }
    }

    if (!checkTime(gw_com_api.getValue("frmData_MAIN", 1, "ot_stm"))) {
        gw_com_api.messageBox([{ text: "시간은 00:00 부터 23:59 까지 입력할 수 있습니다." }]);
        gw_com_api.setError(true, "frmData_MAIN", 1, "ot_stm");
        return;
    }
    if (!checkTime(gw_com_api.getValue("frmData_MAIN", 1, "ot_etm"))) {
        gw_com_api.messageBox([{ text: "시간은 00:00 부터 23:59 까지 입력할 수 있습니다." }]);
        gw_com_api.setError(true, "frmData_MAIN", 1, "ot_etm");
        return;
    }

    // 익일 여부
    if (gw_com_api.getValue("frmData_MAIN", 1, "ot_stm") > gw_com_api.getValue("frmData_MAIN", 1, "ot_etm")) {
        gw_com_api.setValue("frmData_MAIN", 1, "nextday_yn", "1");
    } else {
        gw_com_api.setValue("frmData_MAIN", 1, "nextday_yn", "0");
    }

    args.handler = {
        success: successSave,
        param: param
    };
    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    response[0].QUERY = "HRM_3110_1";
    processRetrieve({ key: response });

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
            { type: "FORM", id: "frmData_MAIN" },
            { type: "GRID", id: "grdData_DETAIL" }
        ],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function checkManipulate(param) {

    if (checkCRUD(param) == "none") {
        gw_com_api.messageBox([{ text: "NOMASTER" }]);
        return false;
    }
    return true;

}
//----------
function checkCRUD(param) {

    return gw_com_api.getCRUD("frmData_MAIN");

}
//----------
function checkStat(param) {

    //var pstat = gw_com_api.getValue("frmData_MAIN", 1, "pstat");
    //var appr_yn = gw_com_api.getValue("frmData_MAIN", 1, "appr_yn");

    ////if ($.inArray(pstat, ["", "1"]) >= 0 && $.inArray(appr_yn, ["", "1"]) >= 0)
    ////    return true;
    ////else
    ////    return false;
    //if ($.inArray(appr_yn, ["2", "3"]) >= 0)
    //    return false;
    //else
    //    return true;
    return true;

}
//----------
function checkStat2(param) {

    var pstat = gw_com_api.getValue("grdList_MAIN", "selected", "pstat", true);
    var appr_yn = gw_com_api.getValue("grdList_MAIN", "selected", "appr_yn", true);

    if ($.inArray(pstat, ["", "1"]) >= 0 && $.inArray(appr_yn, ["", "1"]) >= 0)
        return true;
    else
        return false;

}
//----------
function processFile(param) {

    var args = {
        source: { id: param.object, row: param.row },
        targetid: "lyrDown"
    };
    gw_com_module.downloadFile(args);

}
//----------
function changeDW_STAT(stat) {

    //$.ajaxSetup({ async: false });
    ////----------
    //var args = $.extend(true, {}, v_global.logic.frm);
    ////----------
    //if (stat) {
    //} else {
    //    args.content.row[0].element[3].editable.type = "hidden";
    //    args.content.row[5].element[1].editable.type = "hidden";
    //}
    ////----------
    //gw_com_module.formCreate(args);
    ////=====================================================================================
    //var args = {
    //    target: [
    //        { type: "FORM", id: "frmData_MAIN", offset: 8 }
    //    ]
    //};
    //gw_com_module.objResize(args);
    ////=====================================================================================
    //if (stat) {
    //    var args = { targetid: "frmData_MAIN", event: "itemdblclick", handler: processItemdblClick };
    //    gw_com_module.eventBind(args);
    //}
    ////----------
    //var args = { targetid: "frmData_MAIN", event: "itemchanged", handler: processItemchanged };
    //gw_com_module.eventBind(args);
    ////=====================================================================================
    //$.ajaxSetup({ async: true });
    ////----------

}
//----------
function checkTime(time) {

    time = gw_com_api.unMask(time, "time-hm");
    if (time.length != 4) return false;
    if (!(time >= "0000" && time < "2400")) return false;
    return true;

}
//----------
var checkData = {
    BT_ATTEXTRA: function (param) {
        var rtn = "";
        var args = {
            request: "PAGE",
            url: "../Service/svc_Data_Retrieve_JSON.aspx" +
                    "?QRY_ID=HRM_3110_3" +
                    "&QRY_COLS=cnt" +
                    "&CRUD=R" +
                    "&arg_ext_no=" + param.ext_no + "&arg_emp_no=" + param.emp_no + "&arg_work_date=" + param.work_date + "&arg_atte_cd=" + param.atte_cd,
            handler_success: successRequest
        };
        //=================== async : false ========================
        $.ajaxSetup({ async: false });
        //----------
        gw_com_module.callRequest(args);
        function successRequest(data) {
            rtn = data.DATA[0];
        }
        //----------
        $.ajaxSetup({ async: true });
        //=================== async : true ========================
        return rtn
    }
}
//----------
var EmpInfo = {
    getDuty: function (param) {
        var rtn = "";
        var args = {
            request: "PAGE",
            url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
                    "?QRY_ID=HRM_EMP_MASTER" +
                    "&QRY_COLS=duty_cd" +
                    "&CRUD=R" +
                    "&arg_emp_no=" + gw_com_module.v_Session.EMP_NO,
            handler_success: successRequest
        };
        //=================== async : false ========================
        $.ajaxSetup({ async: false });
        //----------
        gw_com_module.callRequest(args);
        function successRequest(data) {
            rtn = data[0].DATA[0];
        }
        //----------
        $.ajaxSetup({ async: true });
        //=================== async : true ========================
        return rtn
    }
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
                    case "w_find_emp":
                        {
                            args.data = {
                                dept_nm: gw_com_module.v_Session.DEPT_NM,
                                multi: v_global.logic.emp_multi
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
                    case "w_find_emp":
                        if (param.data != undefined) {
                            if (param.multi) {
                                var rows = [];
                                $.each(param.data, function () {
                                    if (gw_com_api.getFindRow("grdData_DETAIL", "emp_no", this.emp_no) == -1) {
                                        rows.push({
                                            ext_no: gw_com_api.getValue("frmData_MAIN", 1, "ext_no"),
                                            emp_no: this.emp_no,
                                            emp_nm: this.emp_nm
                                        });
                                    }

                                });

                                if (rows.length > 0) {
                                    var args = {
                                        targetid: "grdData_DETAIL", edit: true, updatable: true,
                                        data: rows
                                    };
                                    gw_com_module.gridInserts(args);
                                }

                            } else {
                                gw_com_api.setValue(
                                                    v_global.event.object,
                                                    v_global.event.row,
                                                    v_global.event.element,
                                                    param.data.emp_nm,
                                                    (v_global.event.type == "GRID") ? true : false);
                                gw_com_api.setValue(
                                                    v_global.event.object,
                                                    v_global.event.row,
                                                    v_global.event.element == "emp_nm" ? "emp_no" : "cmd_emp",
                                                    param.data.emp_no,
                                                    (v_global.event.type == "GRID") ? true : false);
                            }
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