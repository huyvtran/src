//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 출하검사내역 일괄등록
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

        // set data for DDDW List
        var args = {
            request: [
                {
                    type: "PAGE", name: "검사단계", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "QDM036" }]
                },
                {
                    type: "PAGE", name: "검사구분", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "QDM039" }]
                }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);

        //create UI objects & define events & start logic
        function start() { 
        	//[3.1] UI & Events
        	gw_job_process.UI(); 
        	gw_job_process.procedure();

        	processInsert({});

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
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" },
                { name: "저장", value: "저장" },
                //{ name: "통보", value: "통보", icon: "기타" },
				{ name: "닫기", value: "닫기" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_MAIN", query: "QDM_7110_2", type: "TABLE", title: "출하검사내역등록",
            show: true, selectable: true, fixed: true, caption: true,
            editable: { bind: "select", focus: "proj_nm", validate: true },
            content: {
                width: { label: 130, field: 180 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "Project Name", format: { type: "label" } },
                            { name: "proj_nm", editable: { type: "text", validate: { rule: "required", message: "Project Name" } }, mask: "search" },
                            { header: true, value: "점검일자", format: { type: "label" } },
                            { name: "qc_date", editable: { type: "text", width: 90, validate: { rule: "dateISO", message: "점검일자" } }, mask: "date-ymd" },
                            { header: true, value: "담당자", format: { type: "label" } },
                            { name: "qc_emp_nm", editable: { type: "text", width: 60, validate: { rule: "required", message: "담당자" } }, mask: "search", style: { colfloat: "float" } },
                            { name: "qc_dept_nm", editable: { type: "hidden", width: 200 }, style: { colfloat: "floated" } },
                            { name: "qc_emp", editable: { type: "hidden" }, hidden: true },
                            { name: "qc_dept", editable: { type: "hidden" }, hidden: true }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "Project No.", format: { type: "label" } },
                            { name: "projkey", editable: { type: "hidden" } },
                            { header: true, value: "작성자", format: { type: "label" } },
                            { name: "ins_usr_nm", editable: { type: "hidden", width: 44 }, style: { colfloat: "float" } },
                            { name: "ins_dt", editable: { type: "hidden" }, style: { colfloat: "floated" }, display: true },
                            { header: true, value: "개선완료일", format: { type: "label" } },
                            { name: "chk_date", mask: "date-ymd" },
                            { name: "chk_emp", editable: { type: "hidden" }, hidden: true }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "검사단계", format: { type: "label" } },
                            {
                                name: "qc_tp",
                                format: { type: "select", data: { memory: "검사단계" } },
                                editable: { type: "select", data: { memory: "검사단계", unshift: [{ title: "-", value: "" }] }, validate: { rule: "required", message: "검사단계" } }
                            },
                            { header: true, value: "재발여부", format: { type: "label" } },
                            {
                                name: "rcr_yn",
                                format: { type: "checkbox", title: "", value: "1", offval: "0" },
                                editable: { type: "checkbox", title: "", value: "1", offval: "0" }
                            },
                            { header: true, value: "조치여부", format: { type: "label" } },
                            {
                                name: "chk_yn",
                                format: { type: "checkbox", title: "", value: "1", offval: "0" }//,
                                //editable: { type: "checkbox", title: "", value: "1", offval: "0" }
                            },
                            { name: "qc_rmk", editable: { type: "hidden" }, hidden: true },
                            { name: "qc_memo1", editable: { type: "hidden" }, hidden: true },
                            { name: "qc_memo2", editable: { type: "hidden" }, hidden: true },
                            { name: "pchk_no", editable: { type: "hidden" }, hidden: true }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "검사구분", format: { type: "label" } },
                            {
                                name: "qc_fg",
                                format: { type: "select", data: { memory: "검사구분" } },
                                editable: { type: "select", data: { memory: "검사구분", unshift: [{ title: "-", value: "" }] }, validate: { rule: "required" } }
                            },
                            { header: true, value: "건수", format: { type: "label" } },
                            {
                                name: "qc_cnt", mask: "numeric-int",
                                editable: { type: "text", validate: { ruie: "required" }, title: "건수", width: 50 }
                            },
                            { header: true, value: "", format: { type: "label" } },
                            { name: "" }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_MAIN", query: "QDM_7110_2", title: "출하검사내역",
            caption: true, height: 250, pager: false, show: true, selectable: true, number: true,
            editable: { master: true, bind: "select", focus: "qc_rmk", validate: true },
            element: [
                {
                    header: "검사구분", name: "qc_fg", width: 70,
                    format: { type: "select", data: { memory: "검사구분" } },
                    editable: { type: "select", data: { memory: "검사구분" }, validate: { rule: "required", message: "검사구분" }, width: 84 }
                },
                {
                    header: "Project Name", name: "proj_nm", width: 130, mask: "search",
                    editable: { type: "text", width: 154 }
                },
                {
                    header: "검사단계", name: "qc_tp", width: 70,
                    format: { type: "select", data: { memory: "검사단계" } },
                    editable: { type: "select", data: { memory: "검사단계" }, validate: { rule: "required", message: "검사단계" }, width: 84 }
                },
                {
                    header: "건수", name: "qc_cnt", width: 50,
                    editable: { type: "text", validate: { ruie: "required" }, width: 62 }, mask: "numeric-int"
                },
				{
				    header: "점검일자", name: "qc_date", width: 80, align: "center", mask: "date-ymd",
				    editable: { type: "text", validate: { rule: "required" }, width: 100 }
				},
				{
				    header: "담당자", name: "qc_emp_nm", width: 50, align: "center", mask: "search",
				    editable: { type: "text", width: 60 }
				},
				{ header: "담당부서", name: "qc_dept_nm", width: 80 },
                {
                    header: "재발여부", name: "rcr_yn", width: 50, align: "center",
                    format: { type: "checkbox", title: "", value: "1", offval: "0" },
                    editable: { type: "checkbox", title: "", value: "1", offval: "0" }
                },
				//{
				//    header: "부적합현상(요약)", name: "qc_rmk", width: 250,
				//    editable: { type: "text", width: 294, maxlength: 500, validate: { rule: "required" } }
				//},
				{
				    header: "부적합현상", name: "qc_memo1", width: 250,
				    editable: { type: "textarea", rows: 2, width: 294, maxlength: 500, validate: { rule: "required" } }
				},
                { name: "pchk_no", editable: { type: "hidden" }, hidden: true },
				{ name: "projkey", editable: { type: "hidden" }, hidden: true },
				{ name: "qc_emp", editable: { type: "hidden" }, hidden: true },
				{ name: "qc_dept", editable: { type: "hidden" }, hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "FORM", id: "frmData_MAIN", offset: 8 },
				{ type: "GRID", id: "grdData_MAIN", offset: 8 }
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
        var args = { targetid: "lyrMenu", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "통보", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmData_MAIN", event: "itemdblclick", handler: processItemdblClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_MAIN", event: "itemkeyenter", handler: processItemdblClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_MAIN", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_MAIN", grid: true, event: "itemdblclick", handler: processItemdblClick };
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
function processButton(param) {
    
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
        case "통보":
            if (!checkUpdatable({})) return;
            processSendmail(param);
            break; break;
    }

}
//----------
function processItemchanged(param) {

}
//----------
function processItemdblClick(param) {

    if (param.element == "proj_nm" || param.element == "qc_emp_nm" || param.element == "qc_dept_nm") {
        processFind(param);
    }

}
//----------
function processInsert(param) {

    if (param.object == "lyrMenu") {
        var args = {
            target: [
                { type: "FORM", id: "frmData_MAIN" }
            ]
        };
        if (gw_com_module.objValidate(args) == false) return false;
        var args = {
            targetid: "grdData_MAIN", edit: true, updatable: true,
            data: [
                { name: "projkey", value: gw_com_api.getValue("frmData_MAIN", 1, "projkey") },
                { name: "proj_nm", value: gw_com_api.getValue("frmData_MAIN", 1, "proj_nm") },
                { name: "qc_date", value: gw_com_api.getValue("frmData_MAIN", 1, "qc_date") },
                { name: "qc_emp", value: gw_com_api.getValue("frmData_MAIN", 1, "qc_emp") },
                { name: "qc_emp_nm", value: gw_com_api.getValue("frmData_MAIN", 1, "qc_emp_nm") },
                { name: "qc_dept", value: gw_com_api.getValue("frmData_MAIN", 1, "qc_dept") },
                { name: "qc_dept_nm", value: gw_com_api.getValue("frmData_MAIN", 1, "qc_dept_nm") },
                { name: "qc_tp", value: gw_com_api.getValue("frmData_MAIN", 1, "qc_tp") },
                { name: "qc_fg", value: gw_com_api.getValue("frmData_MAIN", 1, "qc_fg") },
                { name: "qc_cnt", value: gw_com_api.getValue("frmData_MAIN", 1, "qc_cnt") },
                { name: "rcr_yn", value: gw_com_api.getValue("frmData_MAIN", 1, "rcr_yn") },
                { name: "ins_usr_nm", value: gw_com_api.getValue("frmData_MAIN", 1, "ins_usr_nm") }
            ]
        };
        gw_com_module.gridInsert(args);

    } else {
        var args = {
            targetid: "frmData_MAIN", edit: true, updatable: true,
            data: [
                { name: "qc_date", value: gw_com_api.getDate() },
                { name: "qc_fg", value: "010" },    // 출하검사
                { name: "qc_cnt", value: 1 },
                { name: "ins_usr_nm", value: gw_com_module.v_Session.USR_NM }
            ]
        };
        gw_com_module.formInsert(args);
    }

}
//----------
function processDelete(param) {

    var args = { targetid: "grdData_MAIN", row: "selected", select: true };
    gw_com_module.gridDelete(args);

}
//----------
function processSave(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdData_MAIN" }
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

    processClose({ data: response });

}
//----------
function processRetrieve(param) {

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_pchk_no", value: param.key }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_MAIN" }
        ]
    };
    gw_com_module.objRetrieve(args);

}
//----------
function checkUpdatable(param) {

    var args = {
        check: param.check,
        target: [
            { type: "GRID", id: "grdData_MAIN" }
        ],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdData_MAIN" }
        ]
    };
    gw_com_module.objClear(args);

}
//----------
function processClose(param) {

    var args = { ID: gw_com_api.v_Stream.msg_closeDialogue, data: param.data };
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

    var ids = gw_com_api.getRowIDs("grdData_MAIN");
    if (ids.length < 1 || ids == undefined) {
        gw_com_api.messageBox([{ text: "NODATA" }]);
        return;
    }

    var type = "REG";
    var key = "";
    $.each(ids, function () {
        var pchk_no = gw_com_api.getValue("grdData_MAIN", this, "pchk_no", true);
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