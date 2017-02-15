//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 출하검사내역등록
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

        start();

        //----------
        function start() {
            gw_job_process.UI();
            gw_job_process.procedure();
            gw_com_module.startPage();

            gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { day: -15 }));
            gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate());
            if (gw_com_module.v_Session.USER_TP != "SYS") {
                gw_com_api.setValue("frmOption", 1, "emp_nm", gw_com_module.v_Session.USR_NM);
                gw_com_api.setValue("frmOption", 1, "emp_no", gw_com_module.v_Session.EMP_NO);
            }
        }
    },

    // manage UI. (design section)
    UI: function () {

        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "조회", value: "조회", act: true },
                { name: "출력", value: "엑셀로 저장", icon: "출력" },
                { name: "닫기", value: "닫기" }
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
				                name: "ymd_fr", label: { title: "점검일자 :" }, mask: "date-ymd",
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
                                name: "qc_emp_nm", label: { title: "담당자 :" }, mask: "search",
                                editable: { type: "text", size: 8 }
                            },
                            { name: "qc_emp", label: { title: "담당자 :" }, editable: { type: "text" }, hidden: true },
                            {
                                name: "qc_dept_nm", label: { title: "담당부서 :" }, mask: "search",
                                editable: { type: "text", size: 12 }
                            },
                            { name: "qc_dept", label: { title: "담당부서 :" }, editable: { type: "text" }, hidden: true }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "proj_nm", label: { title: "Project Name : " }, mask: "search",
                                editable: { type: "text", size: 12 }
                            },
                            {
                                name: "proj_no", label: { title: "Project No : " }, mask: "search",
                                editable: { type: "text", size: 10 }, hidden: true
                            },
                            {
                                name: "emp_nm", label: { title: "작성자 :" }, mask: "search",
                                editable: { type: "text", size: 8 }
                            },
                            { name: "emp_no", label: { title: "작성자 :" }, editable: { type: "text" }, hidden: true },
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
            targetid: "grdList_MAIN", query: "QDM_7130_1", title: "출하검사현황",
            caption: true, height: 450, pager: true, show: true, selectable: true, number: true, //multi: true, checkrow: true,
            //color: { row: true },
            element: [
                { header: "관리번호", name: "pchk_no", width: 80, align: "center" },
				{ header: "검사구분", name: "qc_fg_nm", width: 60 },
                { header: "Project Name", name: "proj_nm", width: 120 },
                { header: "Project No.", name: "projkey", width: 90, align: "center" },
				{ header: "검사단계", name: "qc_tp_nm", width: 60, align: "center" },
				{ header: "점검일자", name: "qc_date", width: 70, align: "center", mask: "date-ymd" },
				{ header: "작성자", name: "ins_usr_nm", width: 40, align: "center" },
				{ header: "담당부서", name: "qc_dept_nm", width: 80 },
				{ header: "담당자", name: "qc_emp_nm", width: 40, align: "center" },
				{ header: "건수", name: "qc_cnt", width: 40, align: "right", mask: "numeric-int" },
				{ header: "조치예정일", name: "plan_date", width: 70, align: "center", mask: "date-ymd" },
				{ header: "조치완료일", name: "chk_date", width: 70, align: "center", mask: "date-ymd" },
				{
				    header: "조치여부", name: "chk_yn", width: 50, align: "center",
				    format: { type: "checkbox", title: "", value: "1", offval: "0" }
				},
				{ header: "부적합현상", name: "qc_memo1", width: 400 },
                { name: "qc_dept", hidden: true },
                { name: "qc_emp", hidden: true },
                { name: "qc_tp", hidden: true },
                { name: "qc_rmk", hidden: true },
                { name: "color", hidden: true }
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
                { type: "GRID", id: "grdList_MAIN", offset: 8 }
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
        var args = { targetid: "lyrMenu", element: "출력", event: "click", handler: processButton };
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
        var args = { targetid: "grdList_MAIN", grid: true, event: "rowdblclick", handler: processLink };
        gw_com_module.eventBind(args);
        //=====================================================================================

    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function viewOption(param) {

    var args = { target: [{ id: "frmOption", focus: true }] };
    gw_com_module.objToggle(args);

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
            processRetrieve({});
            break;
        case "출력":
            processExport({});
            break;
        case "닫기":
            processClose({});
            break;
    }

}
//----------
function processItemchanged(param) {

    if (param.object == "frmOption") {
        switch (param.element) {
            case "emp_nm":
            case "qc_emp_nm":
                if (param.value.current == "")
                    gw_com_api.setValue(param.object, param.row, (param.element == "emp_nm" ? "emp_no" : "qc_emp"), "");
                break;
            case "qc_dept_nm":
                if (param.value.current == "")
                    gw_com_api.setValue(param.object, param.row, "qc_dept", "");
                break;
            case "proj_nm":
                if (param.value.current == "")
                    gw_com_api.setValue(param.object, param.row, "proj_no", "");
                break;
        }
    }

}
//----------
function processItemdblClick(param) {

    if (param.object == "frmOption") {
        if (param.element == "emp_nm" || param.element == "qc_emp_nm" || param.element == "qc_dept_nm" || param.element == "proj_no" || param.element == "proj_nm") {
            processFind(param);
        }
    }

}
//----------
function processRetrieve(param) {

    var args = { target: [{ type: "FORM", id: "frmOption" }] };
    if (!gw_com_module.objValidate(args)) return;

    args = {
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
                { name: "ymd_fr", argument: "arg_ymd_fr" },
                { name: "ymd_to", argument: "arg_ymd_to" },
                { name: "emp_no", argument: "arg_emp_no" },
                { name: "qc_emp", argument: "arg_qc_emp" },
                { name: "qc_dept", argument: "arg_qc_dept" },
                { name: "proj_no", argument: "arg_proj_no" }
            ],
            remark: [
                { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }] },
                { element: [{ name: "qc_emp_nm" }] },
                { element: [{ name: "qc_dept_nm" }] },
                { element: [{ name: "proj_nm" }] },
                { element: [{ name: "emp_nm" }] }
            ]
        },
        target: [
            { type: "GRID", id: "grdList_MAIN", select: true }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {

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
function processFind(param) {
    
    v_global.event.type = param.type;
    v_global.event.object = param.object;
    v_global.event.row = param.row;
    v_global.event.element = param.element;
    v_global.logic.search = null;

    var args;
    switch (param.element) {
        case "proj_nm":
        case "proj_no":
            v_global.event.cd = (param.object == "frmOption" ? "proj_no" : "projkey");
            v_global.event.nm = "proj_nm";
            if (param.object == "frmOption") {
                v_global.logic.search = {
                    proj_no: (param.element == "proj_no" ? gw_com_api.getValue(param.object, param.row, param.element) : ""),
                    proj_nm: (param.element == "proj_nm" ? gw_com_api.getValue(param.object, param.row, param.element) : "")
                };
            }
            args = {
                type: "PAGE", page: "w_find_proj_scm", title: "Project 검색",
                width: 650, height: 460, open: true,
                id: gw_com_api.v_Stream.msg_selectProject_SCM
            };
            break;
        case "qc_emp_nm":
        case "emp_nm":
            v_global.event.cd = (param.element == "qc_emp_nm" ? "qc_emp" : "emp_no");
            v_global.event.nm = param.element;
            if (param.object == "frmOption") {
                v_global.logic.search = {
                    emp_no: (param.element == "emp_no" ? gw_com_api.getValue(param.object, param.row, param.element) : ""),
                    emp_nm: (param.element == "emp_nm" || param.element == "qc_emp_nm" ? gw_com_api.getValue(param.object, param.row, param.element) : "")
                };
            }
            args = {
                type: "PAGE", page: "w_find_emp", title: "사원 검색",
                width: 600, height: 460, open: true,
                //locate: ["center", (param.object == "frmOption" ? "top" : "center")],
                id: gw_com_api.v_Stream.msg_selectEmployee
            };
            break;
        case "qc_dept_nm":
            v_global.event.cd = "qc_dept";
            v_global.event.nm = param.element;
            v_global.logic.search = {
                dept_cd: (param.element == "qc_dept" ? gw_com_api.getValue(param.object, param.row, param.element) : ""),
                dept_nm: (param.element == "qc_dept_nm" ? gw_com_api.getValue(param.object, param.row, param.element) : "")
            };
            args = {
                type: "PAGE", page: "w_find_dept", title: "부서 검색",
                width: 600, height: 450, open: true,
                //locate: ["center", (param.object == "frmOption" ? "top" : "center")],
                id: gw_com_api.v_Stream.msg_selectDepartment
            };
            break;
        default:
            return;
            break;
    }
    if (gw_com_module.dialoguePrepare(args) == false) {
        args = { page: args.page, param: { ID: args.id, data: v_global.logic.search } };
        gw_com_module.dialogueOpen(args);
    }

}
//----------
function processExport(param) {

    var args = {
        query: "QDM_7130_1",
        source: {
            type: "FORM", id: "frmOption", json: true,
            element: [
                { name: "ymd_fr", argument: "arg_ymd_fr" },
                { name: "ymd_to", argument: "arg_ymd_to" },
                { name: "emp_no", argument: "arg_emp_no" },
                { name: "qc_emp", argument: "arg_qc_emp" },
                { name: "qc_dept", argument: "arg_qc_dept" },
                { name: "proj_no", argument: "arg_proj_no" }
            ]
        },
        option: [
            { name: "PAGE", value: gw_com_module.v_Current.window },
            { name: "USER", value: gw_com_module.v_Session.USR_ID }
        ],
        target: { type: "FILE", id: "lyrDown" }
    };
    gw_com_module.objExport(args);

}
//----------
function processLink(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_linkPage,
        to: { type: "MAIN" },
        data: {
            page: "QDM_7119", title: "출하검사 내용 보기",
            param: [
            	{ name: "AUTH", value: "R" },
                { name: "pchk_no", value: gw_com_api.getValue("grdList_MAIN", "selected", "pchk_no", true) }
            ]
        }
    };
    gw_com_module.streamInterface(args);

}
//----------
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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
                            args.ID = gw_com_api.v_Stream.msg_selectEmployee;
                            args.data = v_global.logic.search;
                        }
                        break;
                    case "w_find_dept":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectDepartment;
                            args.data = v_global.logic.search;
                        }
                        break;
                    case "w_find_proj_scm":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectProject_SCM;
                            args.data = v_global.logic.search;
                        }
                        break;
                }
                gw_com_module.streamInterface(args);
            } break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedProject_SCM:
            {
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        v_global.event.cd,
			                        param.data.proj_no,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        v_global.event.nm,
			                        param.data.proj_nm,
			                        (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedEmployee:
            {
                if (param.data != undefined) {
                    gw_com_api.setValue(
                                        v_global.event.object,
                                        v_global.event.row,
                                        v_global.event.nm,
                                        param.data.emp_nm,
                                        (v_global.event.type == "GRID") ? true : false);
                    gw_com_api.setValue(
                                        v_global.event.object,
                                        v_global.event.row,
                                        v_global.event.cd,
                                        param.data.emp_no,
                                        (v_global.event.type == "GRID") ? true : false);
                    if (v_global.event.cd == "qc_emp") {
                        gw_com_api.setValue(
                                            v_global.event.object,
                                            v_global.event.row,
                                            "qc_dept_nm",
                                            param.data.dept_nm,
                                            (v_global.event.type == "GRID") ? true : false);
                        gw_com_api.setValue(
                                            v_global.event.object,
                                            v_global.event.row,
                                            "qc_dept",
                                            param.data.dept_cd,
                                            (v_global.event.type == "GRID") ? true : false);
                    }
                }
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedDepartment:
            {
                gw_com_api.setValue(
                                    v_global.event.object,
                                    v_global.event.row,
                                    v_global.event.nm,
                                    param.data.dept_nm,
                                    (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(
                                    v_global.event.object,
			                        v_global.event.row,
			                        v_global.event.cd,
			                        param.data.dept_cd,
			                        (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });

            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//