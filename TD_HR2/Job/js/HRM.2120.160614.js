//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 연말정산명세서
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
        v_global.logic.sys = (gw_com_module.v_Session.USER_TP == "SYS" ? true : false);

        //
        start();

        //----------
        function start() {

            v_global.logic.years = ["2013", "2014", "2015"];
            gw_job_process.UI();
            gw_com_api.show("frmMAIN_" + (gw_com_api.getYear() - 1));
            gw_job_process.procedure();
            gw_com_module.startPage();

            if (v_global.process.param != "") {
                closeOption({});
                gw_com_api.setValue("frmOption", 1, "year", gw_com_api.getPageParameter("taxadj_year"));
                gw_com_api.setValue("frmOption", 1, "emp_no", gw_com_api.getPageParameter("emp_no"));
                gw_com_api.setValue("frmOption", 1, "emp_nm", gw_com_api.getPageParameter("emp_nm"));
                processRetrieve({});
            } else {
                gw_com_api.setValue("frmOption", 1, "year", gw_com_api.getYear() - 1);
                gw_com_api.setValue("frmOption", 1, "emp_no", gw_com_module.v_Session.EMP_NO);
                gw_com_api.setValue("frmOption", 1, "emp_nm", gw_com_module.v_Session.USR_NM);
                if (!v_global.logic.sys)
                    processAuth({});
            }
        }
    },

    // manage UI. (design section)
    UI: function () {

        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "조회", value: "조회" },
                { name: "닫기", value: "닫기" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true, remark: "lyrRemark2",
            editable: { focus: "year", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "year", label: { title: "귀속연도 :" },
                                editable: { type: "text", size: 5, maxlength: 4, validate: { rule: "required" } }
                            },
                            {
                                name: "emp_nm", label: { title: "사원 :" }, mask: "search",
                                editable: { type: "text", size: 10, validate: { rule: "required" } }, hidden: !v_global.logic.sys
                            },
                            { name: "emp_no", label: { title: "사원번호 :" }, editable: { type: "text" }, hidden: true }
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
            targetid: "grdList_MAIN", query: "HRM_2120_1", show: false,
            element: [
                { name: "frm_id" },
                { name: "col001" },
                { name: "col002" },
                { name: "col003" },
                { name: "col004" },
                { name: "col005" },
                { name: "col006" },
                { name: "col007" },
                { name: "col008" },
                { name: "col009" },
                { name: "col010" },
                { name: "col011" },
                { name: "col012" },
                { name: "col013" },
                { name: "col014" },
                { name: "col015" },
                { name: "col016" },
                { name: "col017" },
                { name: "col018" },
                { name: "col019" },
                { name: "col020" },
                { name: "col021" },
                { name: "col022" },
                { name: "col023" },
                { name: "col024" },
                { name: "col025" },
                { name: "col026" },
                { name: "col027" },
                { name: "col028" },
                { name: "col029" },
                { name: "col030" },
                { name: "col031" },
                { name: "col032" },
                { name: "col033" },
                { name: "col034" },
                { name: "col035" },
                { name: "col036" },
                { name: "col037" },
                { name: "col038" },
                { name: "col039" },
                { name: "col040" },
                { name: "col041" },
                { name: "col042" },
                { name: "col043" },
                { name: "col044" },
                { name: "col045" },
                { name: "col046" },
                { name: "col047" },
                { name: "col048" },
                { name: "col049" },
                { name: "col050" },
                { name: "col051" },
                { name: "col052" },
                { name: "col053" },
                { name: "col054" },
                { name: "col055" },
                { name: "col056" },
                { name: "col057" },
                { name: "col058" },
                { name: "col059" },
                { name: "col060" },
                { name: "col061" },
                { name: "col062" },
                { name: "col063" },
                { name: "col064" },
                { name: "col065" },
                { name: "col066" },
                { name: "col067" },
                { name: "col068" },
                { name: "col069" },
                { name: "col070" },
                { name: "col071" },
                { name: "col072" },
                { name: "col073" },
                { name: "col074" },
                { name: "col075" },
                { name: "col076" },
                { name: "col077" },
                { name: "col078" },
                { name: "col079" },
                { name: "col080" },
                { name: "col081" },
                { name: "col082" },
                { name: "col083" },
                { name: "col084" },
                { name: "col085" }
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
                { type: "GRID", id: "frmMAIN_13", offset: 8 },
                { type: "GRID", id: "frmMAIN_14", offset: 8 }
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
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: closeOption };
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
        case "조회":
            processRetrieve({});
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

    var args = {
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
                { name: "emp_no", argument: "arg_emp_no" },
                { name: "year", argument: "arg_year" }
            ],
            remark: [
                { element: [{ name: "year" }] },
                { element: [{ name: "emp_nm" }] }
            ]
        },
        target: [
            { type: "GRID", id: "grdList_MAIN", select: true }
        ],
        handler: {
            complete: processRetrieveEnd,
            param: param
        },
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {
    
    var obj_nm = "grdList_MAIN";
    var col_cnt = gw_com_api.getColCount(obj_nm);
    var year = gw_com_api.getValue("frmOption", 1, "year");
    var frm_id = "frmMAIN_" + year;
    for (var i = 2; i < col_cnt.length; i++) {
        var col_nm = gw_com_api.getColName(obj_nm, i);
        var val = gw_com_api.getValue(obj_nm, 1, col_nm, true);
        if (val == "undefined" || val == undefined || val == col_nm) {
            val = "";
        } else {
            val = gw_com_api.Mask(val, "numeric-int");
        }
        //$("#" + frm_id + "_" + col_nm).html(val);
        if (year >= "2015") {
            $("#f_" + year).contents().find("#" + col_nm).html(val);
        } else {
            $("#" + col_nm).html(val);
        }
    }
    $.each(v_global.logic.years, function () {
        if (frm_id != "frmMAIN_" + this)
            gw_com_api.hide("frmMAIN_" + this);
    });
    gw_com_api.show(frm_id);

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
function processAuth(param) {

    // 주민번호 인증
    var args = {
        type: "PAGE", page: "DLG_ZUSER_PASSWD_CHK", title: "본인인증",
        width: 280, height: 160, locate: ["center", 100], open: true,
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
                    case "DLG_FileUpload":
                        args.data = {
                            type: "PER_SUPP",
                            key: v_global.logic.per_no,
                            seq: v_global.logic.supp_seq
                        };
                        break;
                    case "DLG_ZUSER_PASSWD_CHK":
                        break;
                    case "DLG_PERSON_ID_CHK":
                        break;
                    case "w_find_emp":
                        {
                            args.data = {
                                emp_nm: gw_com_api.getValue(
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
                    case "DLG_ZUSER_PASSWD_CHK":
                    case "DLG_PERSON_ID_CHK":
                        if (param.data == undefined)
                            processClose({});
                        else
                            gw_com_api.setFocus("frmOption", 1, "year", false);
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
                        }
                        break;
                }
                closeDialogue({ page: param.from.page });
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//