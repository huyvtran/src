//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 출하검사내역 통보
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
    data: null, logic: {}
};

var r_barcode;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define gw_job_process class : ready(), UI(), procedure()
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var gw_job_process = {

    // entry point. (pre-process section)
    ready: function () {

        //[1] initialize page.
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        start();

        //create UI objects & define events & start logic
        function start() { 
        	//[3.1] UI & Events
        	gw_job_process.UI(); 
        	gw_job_process.procedure();
            //[3.2] Notice Opened Event to Master Page
            var args = { ID: gw_com_api.v_Stream.msg_openedDialogue };
            gw_com_module.streamInterface(args);
        }
    },

    // manage UI. (design section)
    UI: function () {

        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
                { name: "조회", value: "조회", act: true },
                { name: "통보", value: "통보", icon: "기타" },
				{ name: "닫기", value: "취소", icon: "닫기" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true, //remark: "lyrRemark2",
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
            targetid: "grdList_MAIN", query: "QDM_7110_1", title: "출하검사현황",
            caption: true, height: 400, pager: false, show: true, selectable: true, number: true, multi: true, checkrow: true,
            element: [
				{ header: "검사구분", name: "qc_fg_nm", width: 60 },
                { header: "Project Name", name: "proj_nm", width: 130 },
                { header: "Project No.", name: "projkey", width: 80, align: "center" },
				{ header: "검사단계", name: "qc_tp_nm", width: 60, align: "center" },
				{ header: "건수", name: "qc_cnt", width: 40, align: "right", mask: "numeric-int" },
				{ header: "점검일자", name: "qc_date", width: 70, align: "center", mask: "date-ymd" },
				{ header: "작성자", name: "ins_usr_nm", width: 40, align: "center" },
				{ header: "담당자", name: "qc_emp_nm", width: 40, align: "center" },
				{ header: "담당부서", name: "qc_dept_nm", width: 80 },
				{ header: "개선완료일", name: "chk_date", width: 70, align: "center", mask: "date-ymd" },
				{
				    header: "조치여부", name: "chk_yn", width: 60, align: "center",
				    format: { type: "checkbox", title: "", value: "1", offval: "0" }
				},
				{ header: "부적합현상(요약)", name: "qc_rmk", width: 250 },
                { name: "pchk_no", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
				{ type: "GRID", id: "grdList_MAIN", offset: 15 }
			]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        gw_com_module.informSize();

    },

    //==== manage process. (program section)
    procedure: function () {

        //=====================================================================================
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: viewOption };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "통보", event: "click", handler: processSendmail };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
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
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: closeOption };
        gw_com_module.eventBind(args);
        //=====================================================================================

        // startup process.
        //----------
        gw_com_module.startPage();
    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//----------
function viewOption(param) {

    var args = { target: [{ id: "frmOption", focus: true }] };
    gw_com_module.objToggle(args);

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

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

};
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdList_MAIN" }
        ]
    };
    gw_com_module.objClear(args);

}
//----------
function processClose(param) {

    var args = { ID: gw_com_api.v_Stream.msg_closeDialogue };
    gw_com_module.streamInterface(args);
    processClear({});

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
function processSendmail(param) {

    var ids = gw_com_api.getSelectedRow("grdList_MAIN", true);
    if (ids.length < 1 || ids == undefined) {
        gw_com_api.messageBox([{ text: "NODATA" }]);
        return;
    }

    var type = "REG";
    var key = "";
    $.each(ids, function () {
        var pchk_no = gw_com_api.getValue("grdList_MAIN", this, "pchk_no", true);
        key += (key == "" ? pchk_no : "," + pchk_no);
    });
    var args = {
        url: "COM",
        subject: MailInfo.getSubject({ type: type, key: key }),
        body: MailInfo.getBody({ type: type, key: key }),
        to: MailInfo.getTo({ type: type, key: key }),
        edit: true
    };
    gw_com_module.sendMail(args);
    processClose({});

}
//----------
var MailInfo = {
    getSubject: function (param) {
        var rtn = "";
        var args = {
            request: "PAGE",
            url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
                    "?QRY_ID=QDM_7110_MAIL" +
                    "&QRY_COLS=val" +
                    "&CRUD=R" +
                    "&arg_field=subject&arg_type=" + param.type + "&arg_key=" + param.key,
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
    },
    getBody: function (param) {
        var rtn = "";
        var args = {
            request: "PAGE",
            url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
                    "?QRY_ID=QDM_7110_MAIL" +
                    "&QRY_COLS=val" +
                    "&CRUD=R" +
                    "&arg_field=body&arg_type=" + param.type + "&arg_key=" + param.key,
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
    },
    getTo: function (param) {
        var rtn = new Array();
        var args = {
            request: "PAGE",
            url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
                    "?QRY_ID=QDM_7110_MAIL2" +
                    "&QRY_COLS=name,value" +
                    "&CRUD=R" +
                    "&arg_field=&arg_type=" + param.type + "&arg_key=" + param.key,
            handler_success: successRequest
        };
        //=================== async : false ========================
        $.ajaxSetup({ async: false });
        //----------
        gw_com_module.callRequest(args);
        function successRequest(data) {
            $.each(data, function () {
                rtn.push({
                    name: this.DATA[0],
                    value: this.DATA[1]
                });
            });
        }
        //----------
        $.ajaxSetup({ async: true });
        //=================== async : true ========================
        return rtn
    }
}
//----------
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_openedDialogue: {
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
                default:
                    if (param.data != undefined) {
                        $.each(param.data, function (name, value) {
                            gw_com_api.setValue("frmOption", 1, name, value);
                        });
                        processRetrieve({});
                    }
                    return;
                    break;
            }
            gw_com_module.streamInterface(args);

        } break;
        case gw_com_api.v_Stream.msg_closeDialogue: {
            closeDialogue({ page: param.from.page });
        } break;
        case gw_com_api.v_Stream.msg_resultMessage: {
            if (param.data.page != gw_com_api.getPageID()) break;
        } break;
        case gw_com_api.v_Stream.msg_selectedProject_SCM: {
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
        } break;
        case gw_com_api.v_Stream.msg_selectedEmployee: {
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
        } break;
        case gw_com_api.v_Stream.msg_selectedDepartment: {
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

        } break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//