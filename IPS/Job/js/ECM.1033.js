//------------------------------------------
// Process about Job Process.
//                Created by Professor.X, GoodWare (2011.04)
//------------------------------------------

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
    data: null, logic: {}
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// process.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var gw_job_process = {

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // entry point. (pre-process section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //#region
    ready: function () {


        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // initialize page.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        v_global.process.param = gw_com_module.initPage({ message: true });
        //----------
        gw_com_api.changeTheme("style_theme");

        // prepare dialogue.
        var args = {
            type: "PAGE", page: "IFProcess", path: "../Master/", title: "그룹웨어 로그인",
            width: 430, height: 134, locate: ["center", "center"]
        };
        gw_com_module.dialoguePrepare(args);

        start();
        //----------

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // go next.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function start() {

            gw_job_process.UI();
            gw_job_process.procedure();

            var args = { ID: gw_com_api.v_Stream.msg_openedDialogue };
            gw_com_module.streamInterface(args);

            gw_com_module.startPage();
        }

    },
    //#endregion

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage UI. (design section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //#region
    UI: function () {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // define UI.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
                { name: "저장", value: "상신" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_MAIN", query: "ECM_1020_1", type: "TABLE", title: "",
            caption: false, show: true,
            editable: { bind: "select", focus: "open_date", validate: true },
            content: {
                width: { label: 80, field: 150 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "문서번호", format: { type: "label" } },
                            { name: "doc_no", editable: { type: "hidden" }, display: true },
                            { header: true, value: "버전", format: { type: "label" } },
                            { name:"ver_no" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "열람기간", format: { type: "label" } },
                            {
                                name: "open_date", mask: "date-ymd", style: { colspan: 3, colfloat: "float" },
                                format: { type: "text", width: 60 },
                                editable: { type: "text", width: 100, validate: { rule: "required", message: "열람기간" } }
                            },
                            {
                                value: "~", style: { colspan: 3, colfloat: "floating" },
                                format: { type: "label", width: 60 }
                            },
                            {
                                name: "close_date", mask: "date-ymd", style: { colfloat: "floated" },
                                format: { type: "text", width: 60 },
                                editable: { type: "text", width: 100, validate: { rule: "required", message: "열람기간" } }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "열람사유", format: { type: "label" } },
                            {
                                name: "rqst_rmk", style: { colspan: 3 },
                                format: { type: "textarea", rows: 10, width: 440 },
                                editable: { type: "textarea", rows: 10, width: 448, validate: { rule: "required", message: "열람사유" } }
                            }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            target: [
				{ type: "FORM", id: "frmData_MAIN", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        //----------
        gw_com_module.informSize();
    },
    //#endregion

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage process. (program section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //#region
    procedure: function () {

        //=====================================================================================
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmData_MAIN", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //=====================================================================================

    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function processButton(param) {

    if (param.object == undefined) return false;
    switch (param.element) {
        case "저장":
            {
                var args = {
                    page: "IFProcess",
                    param: {
                        ID: gw_com_api.v_Stream.msg_authSystem,
                        data: {
                            system: "GROUPWARE",
                            name: gw_com_module.v_Session.GW_ID,
                            encrypt: { password: true },
                            param: param
                        }
                    }
                };
                gw_com_module.dialogueOpen(args);
            }
            break;
        case "닫기":
            {
                processClose({});
            }
            break;
    }

}
//----------
function processItemchanged(param) {

}
//----------
function processInsert(param) {

    var args = {
        targetid: "frmData_MAIN", edit: true,
        data: [
            { name: "doc_id", value: v_global.data.doc_id },
            { name: "doc_no", value: v_global.data.doc_no },
            { name: "open_date", value: gw_com_api.getDate("", { day: 1 }) },
            { name: "close_date", value: gw_com_api.getDate("", { day: 8 }) }
        ],
        clear: [
            { type: "FORM", id: "frmData_MAIN" }
        ]
    };
    gw_com_module.formInsert(args);

}
//----------
function processSave(param) {

    var args = {
        target: [
			{ type: "FORM", id: "frmData_MAIN" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    var proc = {
        url: "COM",
        nomessage: true,
        procedure: "sp_createECMDocAuthRqst",
        input: [
            { name: "doc_id", value: v_global.data.doc_id, type: "int" },
            { name: "open_date", value: gw_com_api.getValue("frmData_MAIN", 1, "open_date") },
            { name: "close_date", value: gw_com_api.getValue("frmData_MAIN", 1, "close_date") },
            { name: "rqst_rmk", value: gw_com_api.getValue("frmData_MAIN", 1, "rqst_rmk") },
            { name: "user_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
        ],
        output: [
            { name: "gw_key", type: "varchar" },
            { name: "gw_seq", type: "int" },
            { name: "err_msg", type: "varchar" }
        ],
        handler: {
            success: successSave,
            param: param
        }
    };
    gw_com_module.callProcedure(proc);

}
//----------
function successSave(response, param) {

    if (response.VALUE[2] == "") {
        gw_com_api.showMessage("그룹웨어 페이지로 이동합니다.");
        var url = "http://gw.ips.co.kr/linkage/Approval_IP.aspx";
        var params = [
            { name: "form_id", value: 22 },
            { name: "cmpid", value: 2 },
            { name: "inter_id", value: "I" },
            { name: "sysid", value: "ECM02" },
            { name: "sys_key", value: response.VALUE[0] },
            { name: "seq", value: response.VALUE[1] },
            { name: "user_id", value: v_global.logic.name },
            { name: "passwd", value: v_global.logic.password }
        ];
        var args = "";
        $.each(params, function (args_i) {
            args = args +
                ((args_i == 0) ? "?" : "&") + this.name + "=" + this.value;
        });
        window.open(url + args, "", "");
        processClose({ data: { doc_id: v_global.data.doc_id } });
        //processClear({});
    } else {
        gw_com_api.messageBox([{ text: response.VALUE[2] }]);
    }

}
//----------
function processClear(param) {

    var args = {
        target: [
			{ type: "FORM", id: "frmData_MAIN" }
        ]
    };
    gw_com_module.objClear(args);

}
//----------
function processClose(param) {

    var args = { ID: gw_com_api.v_Stream.msg_closeDialogue };
    if (param != undefined && param.data != undefined)
        args.data = param.data;
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

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                v_global.data = param.data;
                processInsert({});
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
                    case gw_com_api.v_Message.msg_informSaved:
                        { param.data.arg.handler(param.data.arg.response, param.data.arg.param); } break;
                    case gw_com_api.v_Message.msg_informRemoved:
                        { param.data.arg.handler(param.data.arg.response, param.data.arg.param); } break;
                    case gw_com_api.v_Message.msg_informBatched:
                        { param.data.arg.handler(param.data.arg.response, param.data.arg.param); } break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                switch (param.from.page) {
                    case "":
                        break;
                }

                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_authedSystem:
            {
                v_global.logic.name = param.data.name;
                v_global.logic.password = param.data.password;
                closeDialogue({ page: param.from.page });
                processSave({});
            }
            break;
    };

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//