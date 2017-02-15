//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 특근신청
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
                    type: "INLINE", name: "증명구분",
                    data: [
                        { title: "A", value: "A" },
                        { title: "B", value: "B" },
                        { title: "C", value: "C" }
                    ]
                },
                {
                    type: "INLINE", name: "용도",
                    data: [
                        { title: "A", value: "A" },
                        { title: "B", value: "B" },
                        { title: "C", value: "C" }
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

            gw_com_api.setValue("frmOption", 1, "work_ym", gw_com_api.getYM());
            gw_com_api.setValue("frmOption", 1, "emp_no", gw_com_module.v_Session.EMP_NO);
            gw_com_api.setValue("frmOption", 1, "emp_nm", gw_com_module.v_Session.USR_NM);
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
                { name: "계획", value: "신청", icon: "기타" },
                { name: "보고", value: "보고", icon: "기타" },
                { name: "규정", value: "관련규정", icon: "Act" },
                { name: "닫기", value: "닫기" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_OVERTIME", type: "FREE",
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
            editable: { focus: "work_ym", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "work_ym", label: { title: "특근연월 :" }, mask: "date-ym",
                                editable: { type: "text", size: 10, maxlength: 7, validate: { rule: "required" } }
                            }
                        ]
                    },
                    {
                        element: [
			                { name: "실행", value: "실행", act: true, format: { type: "button" } },
			                { name: "취소", value: "취소", format: { type: "button", icon: "닫기" } },
                            { name: "emp_no", label: { title: "사원번호 :" }, editable: { type: "text" }, hidden: true }, 
                            { name: "emp_nm", label: { title: "사원명 :" }, editable: { type: "text" }, hidden: true }
                        ], align: "right"
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_OVERTIME_A", query: "HRM_3010_1", title: "결재 신청 문서",
            caption: true, height: 180, pager: false, show: true, selectable: true, number: true,
            editable: { multi: true, bind: "_edit_yn", focus: "work_date", validate: true },
            element: [
                {
                    header: "문서번호", name: "apprdock_no", width: 70, align: "center",
                    editable: { type: "hidden" }
                },
                {
                    header: "근무일자", name: "work_date", width: 80, align: "center", mask: "date-ymd",
                    editable: { type: "text", maxlength: 10, width: 100, validate: { rule: "dateISO" }, bind: "create" }
                },
                { header: "부서", name: "dept_nm", width: 120, align: "center" },
                { header: "상신자", name: "rqst_emp_nm", width: 50, align: "center" },
                { header: "상신일(신청)", name: "appr_dt1", width: 120, align: "center" },
                { header: "신청승인", name: "appr_yn1_nm", width: 80, align: "center" },
                { header: "상신일(보고)", name: "appr_dt2", width: 120, align: "center" },
                { header: "보고승인", name: "appr_yn2_nm", width: 80, align: "center" },
				{
				    header: "비고", name: "rqst_rmk", width: 150,
                    editable: { type: "text", width: 188 }
				},
                { name: "over_cd", editable: { type: "hidden" }, hidden: true },
                { name: "dept_cd", editable: { type: "hidden" }, hidden: true },
                { name: "emp_no", editable: { type: "hidden" }, hidden: true },
                { name: "appr_yn1", hidden: true },
                { name: "appr_yn2", hidden: true },
                { name: "col_opt", hidden: true },
                { name: "_edit_yn", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_OVERTIME", query: "HRM_3010_2", title: "근무자",
            caption: true, height: 190, pager: false, show: true, selectable: true, number: true,
            editable: { multi: true, bind: "_edit_yn", focus: "ot_stm", validate: true },
            element: [
                { header: "근무자", name: "emp_nm", width: 60, align: "center" },
                {
                    header: "근무일자", name: "work_date", width: 80, align: "center", mask: "date-ymd",
                    editable: { type: "hidden", maxlength: 10, validate: { rule: "required" } }
                },
				{
				    header: "시작시각", name: "ot_stm", width: 50, align: "center", mask: "time-hm",
				    editable: { type: "text", maxlength: 5, validate: { rule: "required" }, bind: "_edit_yn2" }
				},
				{
				    header: "종료시각", name: "ot_etm", width: 50, align: "center", mask: "time-hm",
				    editable: { type: "text", maxlength: 5, validate: { rule: "required" }, bind: "_edit_yn2" }
				},
				{ header: "신청시간", name: "tot_hour", width: 50, align: "right", mask: "numeric-int" },
				{ header: "출근시각", name: "att_time", width: 50, align: "center", mask: "time-hm" },
				{ header: "퇴근시각", name: "leave_time", width: 50, align: "center", mask: "time-hm" },
				{ header: "인정시간", name: "appr_time", width: 50, align: "right", mask: "numeric-int" },
				{
				    header: "근무지", name: "work_location", width: 100,
				    editable: { type: "text", maxlength: 15, width: 156 }, hidden: true
				},
				{
				    header: "업무내용", name: "reason", width: 160,
				    editable: { type: "text", maxlength: 50, width: 242 }, hidden: true
				},
				{
				    header: "근무지", name: "work_location2", width: 100,
				    editable: { type: "text", maxlength: 15, width: 156 }
				},
				{
				    header: "업무내용", name: "reason2", width: 160,
				    editable: { type: "text", maxlength: 50, width: 242 }
				},
                { name: "emp_no", editable: { type: "hidden" }, hidden: true },
                { name: "over_cd", editable: { type: "hidden" }, hidden: true },
                { name: "apprdock_no", editable: { type: "hidden" }, hidden: true },
                { name: "col_opt", hidden: true },
                { name: "_edit_yn", hidden: true },
                { name: "_edit_yn2", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_OVERTIME_CHK", query: "HRM_COMMON_OVERTIME_CHK", show: false,
            element: [
				{ name: "rtn_val" },
                { name: "err_msg" }
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
                { type: "GRID", id: "grdData_OVERTIME_A", offset: 8 },
                { type: "GRID", id: "grdData_OVERTIME", offset: 8 }
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
        var args = { targetid: "lyrMenu", element: "계획", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "보고", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "규정", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_OVERTIME", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_OVERTIME", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: closeOption };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_OVERTIME_A", grid: true, event: "rowselecting", handler: processRowSelecting };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_OVERTIME_A", grid: true, event: "rowselected", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_OVERTIME_A", grid: true, event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_OVERTIME", grid: true, event: "itemchanged", handler: processItemchanged };
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
            processDelete(param);
            //if (param.object == "lyrMenu")
            //    processRemove({});
            //else
            //    processDelete({});
            break;
        case "저장":
            processSave({});
            break;
        case "계획":
        case "보고":
            if (gw_com_api.getSelectedRow("grdData_OVERTIME_A", false) == null) {
                gw_com_api.messageBox([{ text: "결재 신청 문서를 선택하세요." }]);
                return;
            }
            if (!checkUpdatable({ check: true })) return;
            processBatch(param);
            break;
        case "규정":
            var url = "/Files/HRM/BizManual/특근규정.htm";
            window.open(url, "특근규정", "scrollbars=yes,resizable=yes,menubar=no,toolbar=no,width=600,height=500");
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

    gw_com_api.selectRow("grdData_OVERTIME_A", v_global.process.current.master, true, false);

}
//----------
function processItemchanged(param) {

    if (param.object == "grdData_OVERTIME_A" && param.element == "work_date") {
        var ids = gw_com_api.getRowIDs("grdData_OVERTIME");
        $.each(ids, function () {
            gw_com_api.selectRow("grdData_OVERTIME", this, true);
            gw_com_api.setValue("grdData_OVERTIME", this, "work_date", param.value.current, true, true, false);
        });
        var col_opt = (gw_com_api.unMask(param.value.current, "date-ymd") >= gw_com_api.getDate() ? "1" : "2");
        gw_com_api.setValue(param.object, param.row, "col_opt", col_opt, true);
    } else if (param.object == "grdData_OVERTIME") {
        if ($.inArray(param.element, ["reason2", "work_location2"]) >= 0 &&
            gw_com_api.getValue("grdData_OVERTIME_A", "selected", "col_opt", true) == "1" &&
            $.inArray(gw_com_api.getValue("grdData_OVERTIME_A", "selected", "appr_yn1", true), ["", "9"]) >= 0) {
            gw_com_api.setValue(param.object, param.row, param.element.substring(0, param.element.length - 1), param.value.current, true);
        }

        if ($.inArray(param.element, ["ot_stm", "ot_etm"]) >= 0) {
            var val1 = gw_com_api.getValue(param.object, param.row, "emp_no", true);
            var val2 = gw_com_api.getValue(param.object, param.row, "work_date", true);
            var val3 = "";
            var val4 = "";
            if (param.element == "ot_stm") {
                val3 = gw_com_api.unMask(param.value.current, "time-hm");
                val4 = gw_com_api.unMask(gw_com_api.getValue(param.object, param.row, "ot_etm", true), "time-hm");
                if (val3 >= "2400") {
                    gw_com_api.messageBox([{ text: "시간은 00:00 부터 23:59 까지 입력할 수 있습니다." }]);
                    return false;
                } else if (val3 > val4) {
                    //gw_com_api.setValue(param.object, param.row, "ot_etm", val3, true);
                    //return true;
                }
            } else {
                val3 = gw_com_api.unMask(gw_com_api.getValue(param.object, param.row, "ot_stm", true), "time-hm");
                val4 = gw_com_api.unMask(param.value.current, "time-hm");
                if (val4 >= "2400") {
                    gw_com_api.messageBox([{ text: "시간은 00:00 부터 23:59 까지 입력할 수 있습니다." }]);
                    return false;
                } else if (val3 > val4) {
                    //gw_com_api.setValue(param.object, param.row, "ot_stm", val4, true);
                    //return true;
                }

            }
            //chkOVERTIME(val1, val2, val3, val4, true);
        }
    }

}
//----------
function processRetrieve(param) {

    var args = { target: [{ type: "FORM", id: "frmOption" }] };
    if (!gw_com_module.objValidate(args)) return;

    var args;
    if (param.object == "grdData_OVERTIME_A") {
        args = {
            source: {
                type: param.type, id: param.object, row: "selected",
                element: [
                    { name: "apprdock_no", argument: "arg_doc_no" }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_OVERTIME", select: true }
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
                    { name: "emp_no", argument: "arg_emp_no" },
                    { name: "work_ym", argument: "arg_work_ym" }
                ],
                argument: [
                    { name: "arg_dept_cd", value: gw_com_module.v_Session.DEPT_CD }
                ],
                remark: [
                    { element: [{ name: "work_ym" }] },
                    //{ element: [{ name: "emp_no" }] },
                    { element: [{ name: "emp_nm" }] }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_OVERTIME_A", select: true }
            ],
            clear: [
                { type: "GRID", id: "grdData_OVERTIME" }
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

    var args;
    if (param.object == "lyrMenu_OVERTIME") {
        if (gw_com_api.getSelectedRow("grdData_OVERTIME_A", false) == null) return;
        if (!checkStat()) {
            gw_com_api.messageBox([{ text: "결재중이거나 완료된 내역은 수정할 수 없습니다." }]);
            return;
        }

        var args = {
            type: "PAGE", page: "w_find_emp", title: "사원 검색",
            width: 600, height: 350, locate: ["center", "top"], open: true
        };
        if (gw_com_module.dialoguePrepare(args) == false) {
            var args = {
                page: "w_find_emp",
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
    } else {
        if (!checkUpdatable({ check: true })) return;
        args = {
            targetid: "grdData_OVERTIME_A", edit: true, updatable: true,
            data: [
                { name: "over_cd", value: "720" },
                { name: "dept_cd", value: gw_com_module.v_Session.DEPT_CD },
                { name: "dept_nm", value: gw_com_module.v_Session.DEPT_NM },
                { name: "emp_no", value: gw_com_module.v_Session.EMP_NO },
                { name: "work_date", value: gw_com_api.getDate("", { day: 1 }) },
                { name: "col_opt", value: "1" },
                { name: "_edit_yn", value: "1" }
            ],
            clear: [
                { type: "GRID", id: "grdData_OVERTIME" }
            ]
        };
        gw_com_module.gridInsert(args);
        processInsert({ object: "lyrMenu_OVERTIME" });
    }

}
//----------
function processDelete(param) {

    var args;
    if (param.object == "lyrMenu_OVERTIME") {
        if ($.inArray(gw_com_api.getValue("grdData_OVERTIME_A", "selected", "appr_yn2", true), ["", "9"]) == -1) {
            gw_com_api.messageBox([{ text: "결재중이거나 완료된 내역은 삭제할 수 없습니다." }]);
            return;
        }
        args = { targetid: "grdData_OVERTIME", row: "selected", select: true }
    } else {
        if (!checkStat()) {
            gw_com_api.messageBox([{ text: "결재중이거나 완료된 내역은 삭제할 수 없습니다." }]);
            return;
        }
        var status = checkCRUD({});
        if (status == "initialize" || status == "create") {
            args = {
                targetid: "grdData_OVERTIME_A", row: "selected", remove: true,
                clear: [
                    { type: "GRID", id: "grdData_OVERTIME" }
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

    if (gw_com_api.getSelectedRow("grdData_OVERTIME_A", false) == null) return;
    var args = {
        url: "COM",
        target: [
            {
                type: "GRID", id: "grdData_OVERTIME_A",
                key: [{ row: "selected", element: [{ name: "apprdock_no" }] }]
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

    if (gw_com_api.getRowCount("grdData_OVERTIME") < 1) {
        gw_com_api.messageBox([{ text: "근무자 내역을 입력하세요." }]);
        return;
    }

    var args = {
        target: [
			{ type: "GRID", id: "grdData_OVERTIME_A" },
            { type: "GRID", id: "grdData_OVERTIME" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    var ids = gw_com_api.getRowIDs("grdData_OVERTIME");
    var chk = true;
    $.each(ids, function () {
        var arg0 = gw_com_api.getValue("grdData_OVERTIME", this, "apprdock_no", true);
        var arg1 = gw_com_api.getValue("grdData_OVERTIME", this, "emp_no", true);
        var arg2 = gw_com_api.getValue("grdData_OVERTIME", this, "work_date", true);
        var arg3 = gw_com_api.getValue("grdData_OVERTIME", this, "ot_stm", true);
        var arg4 = gw_com_api.getValue("grdData_OVERTIME", this, "ot_etm", true);

        chk = chkOVERTIME(arg0, arg1, arg2, arg3, arg4, true);
        if (!chk) {
            gw_com_api.selectRow("grdData_OVERTIME", this, true, false);
            gw_com_api.setError(true, "grdData_OVERTIME", this, "ot_stm", true);
            gw_com_api.setError(true, "grdData_OVERTIME", this, "ot_etm", true);
            return false;
        }
    });
    if (!chk) return false;

    args.handler = {
        success: successSave,
        param: param
    };
    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    var key = [{
        QUERY: "HRM_3010_1",
        KEY: [
            { NAME: "apprdock_no", VALUE: gw_com_api.getValue("grdData_OVERTIME_A", "selected", "apprdock_no", true) }
        ]
    }]

    processRetrieve({ key: key });

}
//----------
function processBatch(param) {

    //var opt = gw_com_api.getValue("grdData_OVERTIME_A", "selected", "col_opt", true);
    var opt = param.element == "계획" ? "1" : "2";
    var title = (opt == "1" ? "[신청]" : "[보고]");
    if (opt == "1" && $.inArray(gw_com_api.getValue("grdData_OVERTIME_A", "selected", "appr_yn2", true), ["", "9"]) == -1) {
        gw_com_api.messageBox([{ text: "[보고]결재가 진행중이거나 완료되었습니다." }]);
        return;
    } else if (opt == "1" && gw_com_api.getValue("grdData_OVERTIME_A", "selected", "work_date", true) <= gw_com_api.getDate()) {
        //gw_com_api.messageBox([{ text: "당일 이전의 특근은 [신청]상신할 수 없습니다." }]);
        //return;
    }

    if ($.inArray(gw_com_api.getValue("grdData_OVERTIME_A", "selected", "appr_yn" + opt, true), ["", "9"]) == -1) {
        gw_com_api.messageBox([{ text: title + "결재중이거나 완료된 내역은 재상신 할 수 없습니다." }]);
        return;
    }

    //if (opt == "2" && $.inArray(gw_com_api.getValue("grdData_OVERTIME_A", "selected", "appr_yn1", true), ["", "2"]) == -1) {
    //    gw_com_api.messageBox([{ text: "[신청]결재가 완료되지 않았습니다." }]);
    //    return;
    //}

    var appr_yn1 = gw_com_api.getValue("grdData_OVERTIME_A", "selected", "appr_yn1", true);
    var frmID = (opt == "1" ? "HR02_1" : "HR02_2");

    //var args = {
    //    url: "COM",
    //    procedure: "GoodHRM_IF.dbo.SP_IF_ApprovalRequest",
    //    input: [
    //        { name: "frm_id", value: frmID, type: "varchar" },
    //        { name: "ref_key1", value: gw_com_api.getValue("grdData_OVERTIME_A", "selected", "apprdock_no", true), type: "varchar" },
    //        { name: "ref_key2", value: "", type: "varchar" },
    //        { name: "ref_key3", value: "", type: "varchar" },
    //        { name: "ref_key4", value: "", type: "varchar" },
    //        { name: "ref_key5", value: "", type: "varchar" },
    //        { name: "emp_no", value: gw_com_module.v_Session.EMP_NO, type: "varchar" }

    //    ],
    //    output: [
    //        { name: "appr_id", type: "int" },
    //        { name: "err_msg", type: "varchar" }
    //    ],
    //    handler: {
    //        success: successBatch,
    //        param: { frmID: frmID }
    //    }
    //};
    //gw_com_module.callProcedure(args);

    v_global.logic.frm_id = frmID;
    var args = {
        type: "PAGE", page: "DLG_EDIT_APPR", title: "결재상신",
        width: 1100, height: 530, scroll: true, open: true, control: true, locate: ["center", "center"]
    };

    if (gw_com_module.dialoguePrepare(args) == false) {
        args.param = {
            ID: gw_com_api.v_Stream.msg_openedDialogue,
            data: {
                frm_id: v_global.logic.frm_id,
                ref_key1: gw_com_api.getValue("grdData_OVERTIME_A", "selected", "apprdock_no", true),
                root_no: gw_com_api.getValue("grdData_OVERTIME_A", "selected", "apprdock_no", true)
            }
        };
        gw_com_module.dialogueOpen(args);
    }

}
//----------
function successBatch(response, param) {

    $.ajaxSetup({ async: false });
    var key = [{
        QUERY: "HRM_3010_1",
        KEY: [
            { NAME: "apprdock_no", VALUE: gw_com_api.getValue("grdData_OVERTIME_A", "selected", "apprdock_no", true) }
        ]
    }]
    processRetrieve({ key: key });
    $.ajaxSetup({ async: true });

    var args = "FormID=" + param.frmID + "&ApprID=" + response.VALUE[0];
    var url = "http://gw.apsystems.co.kr/CoviWeb/Gate/FormLink4HD.aspx?" + args;    // Live
    //var url = "http://gw.devdwc.co.kr/CoviWeb/Gate/FormLink4HD.aspx?" + args;     // Test
    window.open(url, "전자결재", "scrollbars=no,resizable=yes,menubar=no,toolbar=no,width=1200,height=630");

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

    var args = { targetid: "grdData_OVERTIME_A", row: "selected" };
    gw_com_module.gridRestore(args);

}
//----------
function checkUpdatable(param) {

    var args = {
        check: param.check,
        target: [
            { type: "GRID", id: "grdData_OVERTIME_A" },
            { type: "GRID", id: "grdData_OVERTIME" }
        ],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function checkCRUD(param) {

    return gw_com_api.getCRUD("grdData_OVERTIME_A", "selected", true);

}
//----------
function checkStat() {

    return ($.inArray(gw_com_api.getValue("grdData_OVERTIME_A", "selected", "appr_yn1", true), ["", "9"]) == -1 ||
        $.inArray(gw_com_api.getValue("grdData_OVERTIME_A", "selected", "appr_yn2", true), ["", "9"]) == -1 ? false : true);

}
//----------
function chkOVERTIME(arg_doc_no, arg_emp_no, arg_date, arg_stime, arg_etime, arg_msg_yn) {

    if (arg_stime != "" && arg_etime != "") {
        var args = {
            source: {
                type: "INLINE",
                argument: [
                    { name: "arg_type", value: "HOLIWORK" },
                    { name: "arg_emp_no", value: arg_emp_no },
                    { name: "arg_date", value: arg_date },
                    { name: "arg_stime", value: arg_stime },
                    { name: "arg_etime", value: arg_etime },
                    { name: "arg_doc_no", value: arg_doc_no }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_OVERTIME_CHK" }
            ]
        };
        $.ajaxSetup({ async: false });
        gw_com_module.objRetrieve(args);
        $.ajaxSetup({ async: true });

        var err_msg = gw_com_api.getValue("grdList_OVERTIME_CHK", 1, "err_msg", true);

        if (arg_msg_yn && err_msg != "") {
            gw_com_api.messageBox([{ text: err_msg }]);
        }
        return err_msg == "" ? true : false;
    } else {
        return true;
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
                    case "w_find_emp":
                        args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                        args.data = {
                            dept_nm: gw_com_module.v_Session.DEPT_NM,
                            key: [gw_com_module.v_Session.EMP_NO],
                            height: 200,
                            multi: true,
                        };
                        break;
                    case "DLG_EDIT_APPR":
                        args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                        args.data = {
                            frm_id: v_global.logic.frm_id,
                            ref_key1: gw_com_api.getValue("grdData_OVERTIME_A", "selected", "apprdock_no", true),
                            root_no: gw_com_api.getValue("grdData_OVERTIME_A", "selected", "apprdock_no", true)
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
                    case "w_find_emp":
                        if (param.data != undefined) {
                            var rows = [];
                            $.each(param.data, function () {
                                if (gw_com_api.getFindRow("grdData_OVERTIME", "emp_no", this.emp_no) == -1) {
                                    rows.push({
                                        emp_no: this.emp_no,
                                        emp_nm: this.emp_nm,
                                        work_date: gw_com_api.getValue("grdData_OVERTIME_A", "selected", "work_date", true),
                                        over_cd: "720"
                                    });
                                }

                            });

                            if(rows.length>0){
                                var args = {
                                    targetid: "grdData_OVERTIME", edit: true, updatable: true,
                                    data: rows
                                };
                                gw_com_module.gridInserts(args);
                            }
                        }
                        break;
                    case "DLG_EDIT_APPR":
                        if (param.data != undefined) {
                            var key = [
                                {
                                    KEY: [
                                        { NAME: "apprdock_no", VALUE: param.data.ref_key1 }
                                    ],
                                    QUERY: "HRM_3010_1"
                                }
                            ];
                            processRetrieve({ key: key });
                        }
                        break;
                }
                closeDialogue({ page: param.from.page });
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//