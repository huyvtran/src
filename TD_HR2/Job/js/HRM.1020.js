//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 증명서발급신청
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
				    type: "PAGE", name: "증명구분", query: "DDDW_HRM_COMMON",
				    param: [{ argument: "arg_hcode", value: "A030" }]
				},
				{
				    type: "PAGE", name: "용도", query: "DDDW_HRM_COMMON",
				    param: [{ argument: "arg_hcode", value: "A031" }]
				},
				{
				    type: "PAGE", name: "수령", query: "DDDW_HRM_COMMON",
				    param: [{ argument: "arg_hcode", value: "A032" }]
				},
				{
				    type: "PAGE", name: "연도", query: "DDDW_HRM_COMMON",
				    param: [{ argument: "arg_hcode", value: "E999" }]
				},
                {
                    type: "INLINE", name: "YESNO",
                    data: [
                        { title: "예", value: "1" },
                        { title: "아니오", value: "0" }
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

            gw_com_api.setValue("frmOption", 1, "req_year", gw_com_api.getYear());
            gw_com_api.setValue("frmOption", 1, "emp_no", gw_com_module.v_Session.EMP_NO);
            gw_com_api.setValue("frmOption", 1, "emp_nm", gw_com_module.v_Session.USR_NM);

            processRetrieve({ object: "EMP" });

            gw_com_module.startPage();
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
				{ name: "출력", value: "출력" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true, remark: "lyrRemark",
            editable: { focus: "req_year", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "req_year", label: { title: "신청연도 :" },
                                editable: { type: "text", size: 10, maxlength: 4 }
                            }
                        ]
                    },
                    {
                        element: [
			                { name: "실행", value: "실행", act: true, format: { type: "button" } },
			                { name: "취소", value: "취소", format: { type: "button", icon: "닫기" } },
                            { name: "emp_no", editable: { type: "text" }, hidden: true }
                        ], align: "right"
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_EMP", query: "HRM_1020_1",
            caption: false, height: "100%", pager: false, show: true, selectable: true, number: true,
            element: [
				{ header: "사업부", name: "dept_area_nm", width: 100, align: "center" },
				{ header: "부서", name: "dept_nm", width: 140, align: "center" },
				{ header: "호칭", name: "pos_nm", width: 100, align: "center" },
				{ header: "직급", name: "grade_nm", width: 100, align: "center" },
				{ header: "성명", name: "emp_nm", width: 60, align: "center" },
				{ header: "사원번호", name: "emp_no", width: 80, align: "center" },
				{ header: "입사일", name: "enter_date", width: 80, align: "center", mask: "date-ymd" }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_ISSUE", query: "HRM_1020_3", type: "TABLE", title: "발급신청",
            show: true, selectable: true, fixed: true, caption: true,
            editable: { bind: "select", focus: "division", validate: true },
            content: {
                width: { label: 30, field: 70 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "사원번호", format: { type: "label" } },
                            { name: "emp_no", editable: { type: "hidden", width:200 } },
                            { header: true, value: "증명서구분", format: { type: "label" } },
                            {
                                name: "division",
                                format: { type: "select", data: { memory: "증명구분" }, width: 150 },
                                editable: { type: "select", data: { memory: "증명구분" }, width: 150, validate: { rule: "required" } },
                            },
                            { name: "division_nm", editable: { type: "hidden", width:200 }, hidden: true },
                            { header: true, value: "신청일", format: { type: "label" } },
                            { name: "req_date", editable: { type: "hidden", width: 500 }, mask: "date-ymd" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "성명", format: { type: "label" } },
                            { name: "emp_nm", editable: { type: "hidden" } },
                            { header: true, value: "용도", format: { type: "label" } },
                            { name: "issue_purpose2_nm", editable: { type: "hidden", width: 200 }, hidden: true },
                            {
                                name: "issue_purpose", style: { colfloat: "float" },
                                format: { type: "select", data: { memory: "용도" }, width: 100 },
                                editable: { type: "select", data: { memory: "용도" }, width: 100, validate: { rule: "required" } }
                            },
                            {
                                name: "issue_purpose2", style: { colfloat: "floated" },
                                editable: { type: "text", maxlength: 40, width: 150, validate: { rule: "required" } }
                            },
                            { header: true, value: "수령방법", format: { type: "label" } },
                            { name: "receive_type_nm", editable: { type: "hidden" }, hidden: true },
                            {
                                name: "receive_type",
                                format: { type: "select", data: { memory: "수령" }, width: 120 },
                                editable: { type: "select", data: { memory: "수령" }, width: 120, validate: { rule: "required" } }
                            }
                            
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "제출처", format: { type: "label" } },
                            { name: "submit_organ", editable: { type: "text", maxlength: 15, width: 260 } },
                            { header: true, value: "주민번호 표시", format: { type: "label" } },
                            { name: "display_id_nm", editable: { type: "hidden" }, hidden: true },
                            {
                                name: "display_id",
                                format: { type: "select", data: { memory: "YESNO" }, width: 100 },
                                editable: { type: "select", data: { memory: "YESNO" }, width: 100, validate: { rule: "required" } }
                            },
                            { header: true, value: "출력횟수", format: { type: "label" } },
                            { name: "print_cnt", editable: { type: "hidden" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "승인상태", format: { type: "label" } },
                            { name: "issue_yn_nm", editable: { type: "hidden" } },
                            { name: "issue_yn", editable: { type: "hidden" }, hidden: true },
                            { header: true, value: "대상연도", format: { type: "label" } },
                            { name: "fr_date", editable: { type: "select", data: { memory: "연도" }, width: 60 } },
                            { header: true, value: "발급일", format: { type: "label" } },
                            { name: "issue_date", editable: { type: "hidden", width: 340 }, mask: "date-ymd" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "발급번호", format: { type: "label" } },
                            { name: "issue_no", editable: { type: "hidden", width: 150 } },
                            { header: true, value: "비고", format: { type: "label" } },
                            { name: "rmk", editable: { type: "text", width: 650 }, style: { colspan: 3 } },
                            { name: "issue_file", hidden: true },
                            { name: "issue_day", hidden: true }
                        ]
                    }
                ]
            }
        };
        //----------
        v_global.logic.frm = args;
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_ISSUE", query: "HRM_1020_2", title: "증명서 발급 신청 이력",
            caption: true, height: 260, pager: false, show: true, selectable: true, number: true,
            element: [
				{ header: "신청일", name: "req_date", width: 80, align: "center", mask: "date-ymd" },
				{ header: "증명서구분", name: "division_nm", width: 80 },
				{ header: "용도", name: "issue_purpose_nm", width: 120, hidden: true },
				{ header: "용도", name: "issue_purpose2", width: 120 },
				{ header: "대상연도", name: "fr_date", width: 60, align: "center" },
				{ header: "승인상태", name: "issue_yn_nm", width: 50, align: "center" },
				{ header: "발급일", name: "issue_date", width: 80, align: "center", mask: "date-ymd" },
				{ header: "발급번호", name: "issue_no", width: 80, align: "center" },
                { header: "수령방법", name: "receive_type_nm", width: 60, align: "center" },
                { header: "제출처", name: "submit_organ", width: 150 },
                { header: "주민번호", name: "display_id_nm", width: 60, align: "center" },
                { header: "출력횟수", name: "print_cnt", width: 60, align: "center" },
                { header: "출력일시", name: "print_dt", width: 150, align: "center" },
                { header: "출력자", name: "print_user_nm", width: 60, align: "center" },
            	{ header: "비고", name: "rmk", width: 200 },
                { name: "emp_no", hidden: true },
                { name: "issue_yn", hidden: true },
                { name: "issue_file", hidden: true },
                { name: "receive_type", hidden: true }
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
                { type: "GRID", id: "grdList_EMP", offset: 8 },
				{ type: "FORM", id: "frmData_ISSUE", offset: 8 },
                { type: "GRID", id: "grdList_ISSUE", offset: 8 }
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
        var args = { targetid: "lyrMenu", element: "출력", event: "click", handler: processButton };
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
        var args = { targetid: "frmData_ISSUE", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdList_ISSUE", grid: true, event: "rowselected", handler: processRetrieve };
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
            if (!checkUpdatable({ check: true })) return;
            processInsert(param);
            break;
        case "삭제":
            if (!checkManipulate({})) return;
            processDelete(param);
            break;
        case "저장":
            processSave({});
            break;
        case "닫기":
            v_global.process.handler = processClose;
            if (!checkUpdatable({})) return;
            processClose({});
            break;
        case "출력":
            if (!checkManipulate({})) return;
            if (!checkUpdatable({ check: true })) return;
            if (checkStat({})) {
                gw_com_api.messageBox([{ text: "승인되지 않아 출력할 수 없습니다." }]);
                return;
            }
            if (gw_com_api.getValue("frmData_ISSUE", 1, "receive_type") != "1") {
                var receve_type = gw_com_api.getValue("frmData_ISSUE", 1, "receive_type_nm");
                gw_com_api.messageBox([{ text: "수령방법을 [" + receve_type + "]으로 선택하셨습니다." }]);
                return;
            }
            if (gw_com_api.getValue("frmData_ISSUE", 1, "issue_day") > 7) {
                gw_com_api.messageBox([{ text: "발급일로 부터 7일 이내에만 출력할 수 있습니다." }]);
                return;
            }
            if (gw_com_api.getValue("frmData_ISSUE", 1, "print_cnt") >= 2) {
                gw_com_api.messageBox([{ text: "출력 횟수는 2회를 초과할 수 없습니다." }]);
                return;
            }
            processExport({});
            break;
    }

}
//----------
function processItemchanged(param) {

    if (param.object == "frmData_ISSUE") {
        switch (param.element) {
            //case "division":
            //    if (param.value.current.substring(0, 1) == "C") {
            //        gw_com_api.setValue(param.object, param.row, "receive_type", "0");
            //    }
            //    break;
            //case "receive_type":
            //    if (gw_com_api.getValue(param.object, param.row, "division").substring(0, 1) == "C" && param.value.current != "0") {
            //        gw_com_api.setValue(param.object, param.row, param.element, "0");
            //    }
            //    break;
            case "issue_purpose":
                if (param.value.current == "99") {
                    gw_com_api.setValue(param.object, param.row, "issue_purpose2", "");
                } else {
                    gw_com_api.setValue(param.object, param.row, "issue_purpose2", gw_com_api.getText(param.object, param.row, param.element));
                }
                break;
            case "issue_purpose2":
                if (gw_com_api.getValue(param.object, param.row, "issue_purpose") != 99) {
                    gw_com_api.setValue(param.object, param.row, "issue_purpose2", gw_com_api.getText(param.object, param.row, "issue_purpose"), false, false, false);
                }
                break;
        }
    }

}
//----------
function processRetrieve(param) {

    var args;
    if (param.object == "EMP") {
        args = {
            source: {
                type: "INLINE",
                argument: [
                    { name: "arg_emp_no", value: gw_com_module.v_Session.EMP_NO }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_EMP", select: true }
            ]
        };
    } else if (param.object == "grdList_ISSUE") {
        changeDW_STAT(gw_com_api.getValue(param.object, param.row, "issue_yn", true));
        args = {
            source: {
                type: param.type, id: param.object, row: "selected",
                element: [
                    { name: "issue_no", argument: "arg_issue_no" }
                ]
            },
            target: [
                { type: "FORM", id: "frmData_ISSUE", edit: true }
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
                    { name: "req_year", argument: "arg_req_year" }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_ISSUE", select: true }
            ],
            clear: [
                { type: "FORM", id: "frmData_ISSUE" }
            ],
            handler: {
                complete: processRetrieveEnd,
                param: param
            },
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

    changeDW_STAT("new");
    var args = {
        targetid: "frmData_ISSUE", edit: true, updatable: true,
        data: [
            { name: "emp_no", value: gw_com_api.getValue("grdList_EMP", "selected", "emp_no", true) },
            { name: "emp_nm", value: gw_com_api.getValue("grdList_EMP", "selected", "emp_nm", true) },
            { name: "req_date", value: gw_com_api.getDate() },
            { name: "fr_date", value: gw_com_api.getYear() },
            { name: "issue_yn", value: "0" }
        ]
    };

    gw_com_module.formInsert(args);

}
//----------
function processDelete(param) {

    if (!checkStat({})) {
        gw_com_api.messageBox([{ text: "승인된 내역은 삭제할 수 없습니다." }]);
        return;
    }

    var args;
    if (param.element == "파일삭제") {
        args = { targetid: "grdData_FILE", row: "selected", select: true }
        gw_com_module.gridDelete(args);
    } else {
        var status = checkCRUD({});
        if (status == "initialize" || status == "create") {
            //args = {
            //    target: [
            //        { type: "FORM", id: "frmData_ISSUE" }
            //    ]
            //};
            //gw_com_module.objClear(args);
            processRetrieve({ object: "grdList_ISSUE", type: "GRID", row: "selected" });
        } else {
            v_global.process.handler = processRemove;
            gw_com_api.messageBox([{ text: "REMOVE" }], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO");
            return;
        }
    }

}
//----------
function processRemove(param) {

    var args = {
        url: "COM",
        target: [
            {
                type: "FORM", id: "frmData_ISSUE",
                key: { element: [{ name: "issue_no" }, { name: "emp_no" }] }
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

    if (!checkStat({})) {
        gw_com_api.messageBox([{ text: "승인된 내역은 수정할 수 없습니다." }]);
        return;
    }
    var args = {
        target: [
			{ type: "FORM", id: "frmData_ISSUE" }
        ],
        nomessage: param.nomessage
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

    response[0].QUERY = "HRM_1020_2";
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
            { type: "FORM", id: "frmData_ISSUE" }
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

    return gw_com_api.getCRUD("frmData_ISSUE");

}
//----------
function checkStat(param) {

    return (gw_com_api.getValue("frmData_ISSUE", 1, "issue_yn") == "1" ? false : true);

}
//----------
function processExport(param) {
    
    if (param.confirm) {
        var issue_no = gw_com_api.getValue("frmData_ISSUE", 1, "issue_no");
        var emp_no = gw_com_api.getValue("frmData_ISSUE", 1, "emp_no");
        var print_cnt = Number(gw_com_api.getValue("frmData_ISSUE", 1, "print_cnt")) + 1;
        var file = gw_com_api.getValue("frmData_ISSUE", 1, "issue_file");
        if (file == "" || file == null || file == "undefined") return;
        alert("뷰어가 열린 후 [Ctrl + P] 버튼을 누르면 출력할 수 있습니다.");
        window.open("/Files" + file, "_blank", "증명서");

        var qryZfile = {
            query: "HRM_1020_3",
            row: [{
                crud: "U",
                column: [
                    { name: "issue_no", value: issue_no },
                    { name: "emp_no", value: emp_no },
                    { name: "print_dt", value: "" },
                    { name: "print_user", value: gw_com_module.v_Session.USR_ID },
                    { name: "print_cnt", value: print_cnt }
                ]
            }]
        };
        var argParam = [qryZfile];
        var args = {
            nomessage: true,
            user: gw_com_module.v_Session.USR_ID,
            param: argParam,
            handler: {
                success: successSave,
                param: param
            }
        };
        gw_com_module.objSave(args);
    } else {
        // 주민번호 인증
        var args = {
            type: "PAGE", page: "DLG_ZUSER_PASSWD_CHK", title: "본인인증",
            width: 280, height: 160, locate: ["center", "center"], open: true,
        };
        if (gw_com_module.dialoguePrepare(args) == false) {
            args = {
                page: args.page,
                param: {
                    ID: gw_com_api.v_Stream.msg_openedDialogue
                }
            };
            gw_com_module.dialogueOpen(args);
        }
    }

}
//----------
function changeDW_STAT(stat) {

    $.ajaxSetup({ async: false });
    //----------
    var args = $.extend(true, {}, v_global.logic.frm);
    //----------
    switch (stat) {
        case "1":
            args.editable.focus = "";
            args.content.row[0].element[3].hidden = true;
            args.content.row[0].element[4].hidden = false;
            args.content.row[1].element[3].hidden = false;
            args.content.row[1].element[4].hidden = true;
            args.content.row[1].element[5].editable.type = "hidden";
            args.content.row[1].element[7].hidden = false;
            args.content.row[1].element[8].hidden = true;
            args.content.row[2].element[1].editable.type = "hidden";
            args.content.row[2].element[3].hidden = false;
            args.content.row[2].element[4].hidden = true;
            args.content.row[3].element[4].editable.type = "hidden";
            args.content.row[4].element[3].editable.type = "hidden";
            break;
    }
    //----------
    gw_com_module.formCreate(args);
    //=====================================================================================
    var args = {
        target: [
            { type: "FORM", id: "frmData_ISSUE", offset: 8 }
        ]
    };
    gw_com_module.objResize(args);
    //=====================================================================================
    var args = { targetid: "frmData_ISSUE", event: "itemchanged", handler: processItemchanged };
    gw_com_module.eventBind(args);
    //=====================================================================================
    $.ajaxSetup({ async: true });
    //----------
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
                    case "DLG_ZUSER_PASSWD_CHK":
                        break;

                }
                gw_com_module.streamInterface(args);
            } break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                switch (param.from.page) {
                    case "DLG_ZUSER_PASSWD_CHK":
                        if (param.data != undefined)
                            processExport({ confirm: true });
                        break;
                }
                closeDialogue({ page: param.from.page });
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//