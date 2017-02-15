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

            gw_com_api.setValue("frmOption", 1, "work_ymd", gw_com_api.getYM("", { month: -1 }));
            gw_com_api.setValue("frmOption", 1, "dept_cd", gw_com_module.v_Session.DEPT_CD);
            gw_com_api.setValue("frmOption", 1, "dept_nm", gw_com_module.v_Session.DEPT_NM);

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
                { name: "복사", value: "전월복사", icon: "기타" },
                { name: "닫기", value: "닫기" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_SUB", type: "FREE",
            element: [
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" },
                { name: "다운로드", value: "엑셀다운로드", icon: "기타" },
                { name: "업로드", value: "엑셀업로드", icon: "기타" }
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
                                name: "dept_nm", label: { title: "부서 :" }, mask: "search",
                                editable: { type: "text", size: 15 }, hidden: (gw_com_module.v_Session.USER_TP == "SYS" ? false : true)
                            },
                            { name: "dept_cd", hidden: true },
                            {
                                name: "work_ymd", label: { title: "근무연월 :" }, mask: "date-ym",
                                editable: { type: "text", size: 7, maxlength: 7, validate: { rule: "required" } }
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
            targetid: "grdData_MAIN", query: "HRM_3060_1", title: "월간합계",
            caption: true, height: 92, pager: false, show: true, selectable: true, number: true,
            //editable: { multi: true, bind: "_edit_yn", focus: "work_ymd", validate: true },
            element: [
                {
                    header: "연월", name: "work_ymd", width: 60, align: "center", mask: "date-ym",
                    editable: { type: "text", maxlength: 7, width: 80, bind: "create", validate: { rule: "required" } }
                },
                { header: "부서", name: "dept_nm", width: 150, align: "center" },
                { header: "호칭", name: "pos_nm", width: 60, align: "center" },
                {
                    header: "사원번호", name: "emp_no", width: 60, align: "center",
                    editable: { type: "hidden" }
                },
                { header: "성명", name: "emp_nm", width: 60, align: "center" },
                { header: "프로젝트수", name: "input_cnt", width: 60, align: "center" },
                { header: "시간합계", name: "input_time", width: 60, align: "center" },
                { header: "상태", name: "pstat_nm", width: 60, align: "center" },
                { header: "수정일시", name: "udate", width: 150, align: "center" },
                { header: "수정자", name: "usnm", width: 60, align: "center" },
                { name: "dept_cd", editable: { type: "hidden" }, hidden: true },
                { name: "position_cd", editable: { type: "hidden" }, hidden: true },
                { name: "pstat", editable: { type: "hidden" }, hidden: true },
                { name: "_edit_yn", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_SUB", query: "HRM_3060_2", title: "프로젝트별 투입시간",
            caption: true, height: 271, pager: false, show: true, selectable: true, number: true,
            editable: { multi: true, bind: "_edit_yn", focus: "input_time", validate: true },
            element: [
                {
                    header: "프로젝트번호", name: "work_cd", width: 60, align: "center",
                    editable: { type: "hidden", maxlength: 10, validate: { rule: "required" } }
                },
                { header: "프로젝트번호(구)", name: "proj_no_old", width: 60, align: "center" },
                { header: "프로젝트명", name: "work_nm", width: 180 },
				{
				    header: "투입시간", name: "input_time", width: 50, align: "right", mask: "numeric-float",
				    editable: { type: "text", maxlength: 7, width: 96, validate: { rule: "required" }, bind: "_edit_yn" }
				},
				{ header: "투입비율", name: "input_rate", width: 50, align: "right", mask: "numeric-float" },
				{
				    header: "비고", name: "rmk", width: 200,
				    editable: { type: "text", maxlength: 120, width: 356, bind: "_edit_yn" }
				},
                { name: "emp_no", editable: { type: "hidden" }, hidden: true },
                { name: "work_ymd", editable: { type: "hidden" }, hidden: true },
                { name: "_edit_yn", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_EXCEL", query: "HRM_3060_5", title: "업무실적등록_" + gw_com_module.v_Session.DEPT_NM, show: false,
            element: [
				{ header: "A", name: "proj_no2" },
                { header: "A", name: "proj_no" },
                { header: "A", name: "proj_nm" },
                { header: "A", name: "col01" },
                { header: "A", name: "col02" },
                { header: "A", name: "col03" },
                { header: "A", name: "col04" },
                { header: "A", name: "col05" },
                { header: "A", name: "col06" },
                { header: "A", name: "col07" },
                { header: "A", name: "col08" },
                { header: "A", name: "col09" },
                { header: "A", name: "col10" },
                { header: "A", name: "col11" },
                { header: "A", name: "col12" },
                { header: "A", name: "col13" },
                { header: "A", name: "col14" },
                { header: "A", name: "col15" },
                { header: "A", name: "col16" },
                { header: "A", name: "col17" },
                { header: "A", name: "col18" },
                { header: "A", name: "col19" },
                { header: "A", name: "col20" },
                { header: "A", name: "col21" },
                { header: "A", name: "col22" },
                { header: "A", name: "col23" },
                { header: "A", name: "col24" },
                { header: "A", name: "col25" },
                { header: "A", name: "col26" },
                { header: "A", name: "col27" },
                { header: "A", name: "col28" },
                { header: "A", name: "col29" },
                { header: "A", name: "col30" },
                { header: "A", name: "col31" },
                { header: "A", name: "col32" },
                { header: "A", name: "col33" },
                { header: "A", name: "col34" },
                { header: "A", name: "col35" },
                { header: "A", name: "col36" },
                { header: "A", name: "col37" },
                { header: "A", name: "col38" },
                { header: "A", name: "col39" },
                { header: "A", name: "col40" },
                { header: "A", name: "col41" },
                { header: "A", name: "col42" },
                { header: "A", name: "col43" },
                { header: "A", name: "col44" },
                { header: "A", name: "col45" },
                { header: "A", name: "col46" },
                { header: "A", name: "col47" },
                { header: "A", name: "col48" },
                { header: "A", name: "col49" },
                { header: "A", name: "col50" },
                { header: "A", name: "col51" },
                { header: "A", name: "col52" },
                { header: "A", name: "col53" },
                { header: "A", name: "col54" },
                { header: "A", name: "col55" },
                { header: "A", name: "col56" },
                { header: "A", name: "col57" },
                { header: "A", name: "col58" },
                { header: "A", name: "col59" },
                { header: "A", name: "col60" },
                { header: "A", name: "col61" },
                { header: "A", name: "col62" },
                { header: "A", name: "col63" },
                { header: "A", name: "col64" },
                { header: "A", name: "col65" },
                { header: "A", name: "col66" },
                { header: "A", name: "col67" },
                { header: "A", name: "col68" },
                { header: "A", name: "col69" },
                { header: "A", name: "col70" },
                { header: "A", name: "col71" },
                { header: "A", name: "col72" },
                { header: "A", name: "col73" },
                { header: "A", name: "col74" },
                { header: "A", name: "col75" },
                { header: "A", name: "col76" },
                { header: "A", name: "col77" },
                { header: "A", name: "col78" },
                { header: "A", name: "col79" },
                { header: "A", name: "col80" },
                { header: "A", name: "col81" },
                { header: "A", name: "col82" },
                { header: "A", name: "col83" },
                { header: "A", name: "col84" },
                { header: "A", name: "col85" },
                { header: "A", name: "col86" },
                { header: "A", name: "col87" },
                { header: "A", name: "col88" },
                { header: "A", name: "col89" },
                { header: "A", name: "col90" },
                { header: "A", name: "col91" },
                { header: "A", name: "col92" },
                { header: "A", name: "col93" },
                { header: "A", name: "col94" },
                { header: "A", name: "col95" },
                { header: "A", name: "col96" },
                { header: "A", name: "col97" },
                { header: "A", name: "col98" },
                { header: "A", name: "col99" }
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
        var args = { targetid: "lyrMenu", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "복사", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_SUB", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_SUB", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_SUB", element: "다운로드", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_SUB", element: "업로드", event: "click", handler: processButton };
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
        case "복사":
            processBatch({});
            break;
        case "닫기":
            v_global.process.handler = processClose;
            if (!checkUpdatable({})) return;
            processClose({});
            break;
        case "다운로드":
            processRetrieve({ object: "grdList_EXCEL" });
            break;
        case "업로드":
            processImport({});
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
    if (param.object == "grdList_EXCEL") {
        args = {
            source: {
                type: "FORM", id: "frmOption",
                element: [
                    { name: "work_ymd", argument: "arg_work_ymd" },
                    { name: "dept_cd", argument: "arg_dept_cd" }
                ],
                argument: [
                    { name: "arg_emp_no", value: "%" }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_EXCEL" }
            ],
            handler: {
                complete: processRetrieveEnd,
                param: param
            }
        };
    } else if (param.object == "grdData_MAIN") {
        args = {
            source: {
                type: param.type, id: param.object, row: "selected",
                element: [
                    { name: "work_ymd", argument: "arg_work_ymd" },
                    { name: "emp_no", argument: "arg_emp_no" }
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
                    { name: "dept_cd", argument: "arg_dept_cd" },
                    { name: "work_ymd", argument: "arg_work_ymd" }
                ],
                argument:[
                    { name: "arg_emp_no", value: "%" }
                ],
                remark: [
                    { element: [{ name: "dept_nm" }] },
                    { element: [{ name: "work_ymd" }] }
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
    
    if (param.object == "grdList_EXCEL") {
        // Excel Export
        gw_com_module.gridDownload({ url: "../Service/svc_Retrieve_EXCEL_new.aspx", targetid: param.object, header: false });
    }

}
//----------
function processInsert(param) {

    var args;
    if (param.object == "lyrMenu_SUB") {
        if (gw_com_api.getSelectedRow("grdData_MAIN", false) == null) return;
        if (!checkStat()) {
            gw_com_api.messageBox([{ text: "확정된 내역은 수정할 수 없습니다." }]);
            return;
        }

        var args = {
            type: "PAGE", page: "DLG_PROJECT2", title: "Project",
            width: 1100, height: 400, locate: ["center", "center"], open: true
        };
        if (gw_com_module.dialoguePrepare(args) == false) {
            var args = {
                page: "DLG_PROJECT2",
                param: {
                    ID: gw_com_api.v_Stream.msg_openedDialogue,
                    data: {
                        dept_area_nm: v_global.logic.dept_area_nm,
                        multi: true
                    }
                }
            };
            gw_com_module.dialogueOpen(args);
        }
    } else {
        if (!checkUpdatable({ check: true })) return;
        processCreate({});
    }

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

    if (gw_com_api.getRowCount("grdData_SUB") < 1) {
        gw_com_api.messageBox([{ text: "프로젝트별 투입시간 내역을 입력하세요." }]);
        return;
    }

    var args = {
        url: "COM",
        target: [
			{ type: "GRID", id: "grdData_MAIN" },
            { type: "GRID", id: "grdData_SUB" }
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

    var key = [{
        QUERY: "HRM_3060_1",
        KEY: [
            { NAME: "work_ymd", VALUE: gw_com_api.getValue("grdData_MAIN", "selected", "work_ymd", true) },
            { NAME: "emp_no", VALUE: gw_com_api.getValue("grdData_MAIN", "selected", "emp_no", true) }
        ]
    }]

    processRetrieve({ key: key });

}
//----------
function processCreate(param) {

    var dept_cd = gw_com_api.getValue("frmOption", 1, "dept_cd");
    var work_ymd = gw_com_api.getValue("frmOption", 1, "work_ymd");
    if (dept_cd == "" || dept_cd == undefined) {
        gw_com_api.setError(true, "frmOption", 1, "dept_nm", false, true);
        viewOption({});
        gw_com_api.messageBox([{ text: "부서를 입력하세요." }], 350);
        return;
    } else if (work_ymd == "" || work_ymd == undefined) {
        gw_com_api.setError(true, "frmOption", 1, "work_ymd", false, true);
        viewOption({});
        gw_com_api.messageBox([{ text: "근무연월을 입력하세요." }], 350);
        return;
    }
    gw_com_api.setError(false, "frmOption", 1, "dept_nm", false, true);
    gw_com_api.setError(false, "frmOption", 1, "work_ymd", false, true);

    var args = {
        url: "COM",
        procedure: "GoodERP.dbo.PROC_WORKTIME_CREATE",
        nomessage: true,
        input: [
            { name: "dept_cd", value: gw_com_api.getValue("frmOption", 1, "dept_cd"), type: "varchar" },
            { name: "work_ymd", value: gw_com_api.getValue("frmOption", 1, "work_ymd"), type: "varchar" },
            { name: "usr_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
        ],
        output: [
            { name: "rtn_no", type: "int" },
            { name: "rtn_msg", type: "varchar" }
        ],
        handler: {
            success: successBatch,
            param: { batch_id: "CREATE" }
        }
    };
    gw_com_module.callProcedure(args);

}
//----------
function processBatch(param) {

    var dept_cd = gw_com_api.getValue("frmOption", 1, "dept_cd");
    var work_ymd = gw_com_api.getValue("frmOption", 1, "work_ymd");
    if (dept_cd == "" || dept_cd == undefined) {
        gw_com_api.setError(true, "frmOption", 1, "dept_nm", false, true);
        viewOption({});
        gw_com_api.messageBox([{ text: "부서를 입력하세요." }], 350);
        return;
    } else if (work_ymd == "" || work_ymd == undefined) {
        gw_com_api.setError(true, "frmOption", 1, "work_ymd", false, true);
        viewOption({});
        gw_com_api.messageBox([{ text: "근무연월을 입력하세요." }], 350);
        return;
    }
    gw_com_api.setError(false, "frmOption", 1, "dept_nm", false, true);
    gw_com_api.setError(false, "frmOption", 1, "work_ymd", false, true);

    if (param.batch) {
        var args = {
            url: "COM",
            procedure: "GoodERP.dbo.PROC_WORKTIME_COPY",
            nomessage: true,
            input: [
                { name: "work_ymd", value: work_ymd, type: "varchar" },
                { name: "dept_cd", value: dept_cd, type: "varchar" },
                { name: "emp_no", value: "%", type: "varchar" },
                { name: "usr_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
            ],
            output: [
                { name: "rtn_no", type: "int" },
                { name: "rtn_msg", type: "varchar" }
            ],
            handler: {
                success: successBatch,
                param: { batch_id: "COPY" }
            }
        };
        gw_com_module.callProcedure(args);
    } else {
        work_ymd = gw_com_api.Mask(work_ymd, "date-ym");
        gw_com_api.messageBox([{ text: work_ymd + " 의 자료가 삭제 후 재생성 됩니다." }, { text: "계속 하시겠습니까?" }],
            420, gw_com_api.v_Message.msg_confirmBatch, "YESNO", { batch: true });
    }

}
//----------
function successBatch(response, param) {

    if (param.batch_id == "CREATE") {
        var rtn_no = response.VALUE[0];
        var rtn_msg = response.VALUE[1];
        gw_com_api.messageBox([{ text: rtn_msg }], 350);
        if(rtn_no == 0)
            processRetrieve({});
    } else if (param.batch_id == "COPY") {
        var rtn_no = response.VALUE[0];
        var rtn_msg = response.VALUE[1];
        gw_com_api.messageBox([{ text: rtn_msg }], 350);
        if (rtn_no == 0)
            processRetrieve({});
    } else {
        return;
    }
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
function processImport(param) {

    var args = { target: [{ type: "FORM", id: "frmOption" }] };
    if (!gw_com_module.objValidate(args)) return;

    var args = {
        type: "PAGE", page: "DLG_ExcelImport", title: "엑셀업로드",
        width: 900, height: 500, locate: ["center", "center"], open: true
    };

    if (gw_com_module.dialoguePrepare(args) == false) {
        args.param = {
            ID: gw_com_api.v_Stream.msg_openedDialogue,
            data: {
                JOB_ID: "HRM_3060",
                work_ymd: gw_com_api.getValue("frmOption", 1, "work_ymd")
            }
        }
        gw_com_module.dialogueOpen(args);
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