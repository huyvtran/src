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

        // set data for DDDW List
        var args = {
            request: [
                {
                    type: "PAGE", name: "부서", query: "DDDW_HRM_DEPT_AUTH",
                    param: [{ argument: "arg_emp_no", value: gw_com_module.v_Session.EMP_NO }]
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

            gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { day: -1 }));
            gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate());

            $.validator.addMethod("time24", function (value, element) {
                if (!/^\d{2}:\d{2}$/.test(value) && value != "") return false;
                var parts = value.split(':');
                if (parts[0] > 23 || parts[1] > 59 || parts[2] > 59) return false;
                return true;
            }, "Invalid time format.");
        }
    },

    // manage UI. (design section)
    UI: function () {

        //==== Main Menu : 조회, 닫기
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "조회", value: "조회", act: true },
                { name: "저장", value: "저장" },
				{ name: "닫기", value: "닫기" }
            ]
        };
        gw_com_module.buttonMenu(args);

        //==== Search Option : 
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true, remark: "lyrRemark2",
            editable: { focus: "ann_key", validate: true },
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
				            },
                            {
                                name: "dept_cd", label: { title: "부서 :" },
                                editable: { type: "select", data: { memory: "부서" } }
                            },
                            {
                                name: "emp_nm", label: { title: "사원 : " },
                                editable: { type: "text", size: 10, maxlength: 5 }
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
        gw_com_module.formCreate(args);

        //==== Main Grid : 근태현황
        var args = {
            targetid: "grdData_Main", query: "HRM_3130_1", title: "근태현황",
            height: 450, caption: true, pager: false, show: true, selectable: true, number: true,
            editable: { bind: "appr_yn", focus: "att_time", validate: true },
            element: [
                {
                    header: "근무일자", name: "att_date", width: 60, align: "center", mask: "date-ymd",
                    editable: { type: "hidden" }
                },
                { header: "요일", name: "day_nm", width: 30, align: "center" },
                { header: "휴일구분", name: "holiday_type", width: 40, align: "center" },
				{ header: "부서", name: "dept_nm", width: 80, align: "center" },
                { header: "직급", name: "grade_nm", width: 50, align: "center" },
                { header: "근무자명", name: "emp_nm", width: 50, align: "center" },
                { header: "근태구분", name: "att_nm", width: 50, align: "center" },
                {
                    header: "출근시각", name: "att_time", width: 50, align: "center", mask: "time-hm",
                    editable: { type: "text", validate: { rule: "time24" } }
                },
                {
                    header: "퇴근시각", name: "leave_time", width: 50, align: "center", mask: "time-hm",
                    editable: { type: "text", validate: { rule: "time24" } }
                },
                { header: "수정자", name: "upd_usr_nm", width: 50, align: "center" },
                { header: "수정일시", name: "udate", width: 120, align: "center" },
                { name: "emp_no", editable: { type: "hidden" }, hidden: true },
                { name: "appr_yn", hidden: true }
            ]
        };
        gw_com_module.gridCreate(args);

        //==== File Download Layer
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);

        //==== Resize Objects
        var args = {
            target: [
				{ type: "GRID", id: "grdData_Main", offset: 8 }
            ]
        };
        gw_com_module.objResize(args);
        gw_com_module.informSize();

    },

    //==== manage process. (program section)
    procedure: function () {

        //==== Button Click : Main 조회, 추가, 수정, 출력(납품서), 라벨(라벨출력), 닫기 ====
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: toggleOption };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------

        //==== Button Click : Search Option ====
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: toggleOption };
        gw_com_module.eventBind(args);

        //==== Grid Events : Main
        //var args = { targetid: "grdData_Main", grid: true, event: "rowdblclick", handler: processPopupDetail };
        //gw_com_module.eventBind(args);
        //----------
    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function toggleOption() {
    var args = { target: [{ id: "frmOption", focus: true }] };
    gw_com_module.objToggle(args);
}
//----------
function processButton(param) {

    switch (param.element) {
        case "저장":
            processSave({});
            break;
        case "닫기":
            v_global.process.handler = processClose;
            if (!checkUpdatable({})) return;
            processClose({});
            break;
    }

}
//----------
function processRetrieve(param) {

    // Validate Inupt Options
    var args = { target: [{ type: "FORM", id: "frmOption" }] };
    if (gw_com_module.objValidate(args) == false) return false;

    // Retrieve 
    var args = {
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
				{ name: "ymd_fr", argument: "arg_ymd_fr" },
                { name: "ymd_to", argument: "arg_ymd_to" },
                { name: "dept_cd", argument: "arg_dept_cd" },
                { name: "emp_nm", argument: "arg_emp_nm" }
            ],
            argument: [
                { name: "arg_emp_no", value: gw_com_module.v_Session.EMP_NO }
            ],
            remark: [
                { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }] },
		        { element: [{ name: "dept_cd" }] },
		        { element: [{ name: "emp_nm" }] }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_Main", select: true }
        ],
        handler_complete: processRetrieveEnd,
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {
}
//----------
function processSave(param) {

    var args = {
        url: "COM",
        target: [
            { type: "GRID", id: "grdData_Main" }
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

    processRetrieve({ key: response });

}
//----------
function checkUpdatable(param) {

    var args = {
        check: param.check,
        target: [
            { type: "GRID", id: "grdData_Main" }
        ],
        param: param
    };
    return gw_com_module.objUpdatable(args);

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
function processPopupDetail(param) {

    var url = "../Job/HRM_8121.aspx";
    var args = "ann_key=" + gw_com_api.getValue(param.object, param.row, "ann_key", true) +
        "&ann_seq=" + gw_com_api.getValue(param.object, param.row, "ann_seq", true) +
        "&app_key=" + gw_com_api.getValue(param.object, param.row, "app_key", true);

    window.open(url + "?" + args, "응시정보", "scrollbars=no,resizable=yes,menubar=no,toolbar=no,width=1200,height=630");

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