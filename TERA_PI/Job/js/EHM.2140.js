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
    logic: {}
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

        // set data for DDDW List
        var args = {
            request: [
                {
                    type: "PAGE", name: "고객사", query: "DDDW_CM_CODE",
                    param: [
                        { argument: "arg_hcode", value: "ISCM29" }
                    ]
                },
				{
				    type: "PAGE", name: "LINE", query: "DDDW_CM_CODED",
				    param: [
                        { argument: "arg_hcode", value: "IEHM02" }
				    ]
				},
                {
                    type: "PAGE", name: "발생구분", query: "DDDW_ISSUE_TP",
                    param: [
                        { argument: "arg_rcode", value: "AS" }
                    ]
                },
                {
                    type: "PAGE", name: "상태구분", query: "DDDW_CM_CODED",
                    param: [
                        { argument: "arg_hcode", value: "IEHM70" }
                    ]
                },
                {
                    type: "PAGE", name: "처리구분", query: "DDDW_CM_CODED",
                    param: [
                        { argument: "arg_hcode", value: "IEHM71" }
                    ]
                },
                {
                    type: "PAGE", name: "처분구분", query: "DDDW_CM_CODED",
                    param: [
                        { argument: "arg_hcode", value: "IEHM72" }
                    ]
                },
                {
                    type: "PAGE", name: "귀책구분", query: "DDDW_CM_CODED",
                    param: [
                        { argument: "arg_hcode", value: "IEHM25" }
                    ]
                }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // go next.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function start() {

            gw_job_process.UI();

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
            targetid: "lyrMenu",
            type: "FREE",
            element: [
				{ name: "조회", value: "조회" },
				//{ name: "추가", value: "추가" },
				//{ name: "삭제", value: "삭제" },
				{ name: "저장", value: "저장" },
				{ name: "닫기", value: "닫기" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE",
            trans: true, show: true, border: true, remark: "lyrRemark",
            editable: { bind: "open", focus: "cust_cd", validate: true },
            content: {
                row: [
                        {
                            element: [
				                {
				                    name: "ymd_fr", label: { title: "요청일 :" },
				                    mask: "date-ymd", style: { colfloat: "floating" },
				                    editable: { type: "text", size: 7, maxlength: 10 }
				                },
				                {
				                    name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
				                    editable: { type: "text", size: 7, maxlength: 10 }
				                },
                                {
                                    name: "issue_tp", label: { title: "발생구분 :" },
                                    editable: {
                                        type: "select", data: { memory: "발생구분", unshift: [{ title: "전체", value: "%" }] }
                                    }
                                }
                            ]
                        },
                        {
                            element: [
				                {
				                    name: "rqst_usr", label: { title: "요청자 :" },
				                    editable: { type: "text", size: 7, maxlength: 10 }
				                },
				                {
				                    name: "apart_cd", label: { title: "품목코드 :" },
				                    editable: { type: "text", size: 12, maxlength: 20 }
				                },
				                {
				                    name: "apart_nm", label: { title: "품목명 :" },
				                    editable: { type: "text", size: 12, maxlength: 20 }
				                },
                            ]
                        },
                        {
                            element: [
                                {
                                    name: "cust_cd", label: { title: "고객사 :" },
                                    editable: {
                                        type: "select", data: { memory: "고객사", unshift: [{ title: "전체", value: "%" }] },
                                        change: [{ name: "cust_dept", memory: "LINE", key: ["cust_cd"] }]
                                    }
                                },
				                {
				                    name: "cust_dept", label: { title: "LINE :" },
				                    editable: {
				                        type: "select",
				                        data: { memory: "LINE", unshift: [{ title: "전체", value: "%" }], key: ["cust_cd"] }
				                    }
				                },
				                {
				                    name: "cust_prod_nm", label: { title: "설비명 :" },
				                    editable: { type: "text", size: 12, maxlength: 20 }
				                }
                            ]
                        },
                        {
                            align: "right",
                            element: [
                                { name: "실행", value: "실행", format: { type: "button" }, act: true },
                                { name: "취소", value: "취소", format: { type: "button", icon: "닫기" } }
                            ]
                        }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_Main", query: "EHM_2110_1", title: "자재반입요청목록",
            height: 450, show: true, selectable: true, number: true, //dynamic: true,
            editable: { bind: "select", focus: "stock_status", validate: true },
            element: [
                { header: "고객사", name: "cust_nm", width: 80, align: "left" },
                { header: "LINE", name: "cust_dept", width: 70, align: "left" },
                { header: "Process", name: "cust_proc", width: 70, align: "left" },
                { header: "설비명", name: "cust_prod_nm", width: 120, align: "left" },
                { header: "품목코드", name: "apart_cd", width: 80, align: "left" },
                { header: "품목명", name: "apart_nm", width: 160, align: "left" },
                { header: "Ser. No.", name: "apart_sno", width: 120, align: "left" },
                {
                    header: "A/S 번호", name: "issue_no", width: 70, align: "center",
                    editable: { type: "hidden" }
                },
                {
                    header: "상태구분", name: "stock_status_nm", width: 60, align: "center",
                    format: { type: "select", data: { memory: "상태구분" } }
                },
                {
                    header: "처분일", name: "disp_dt", width: 100, align: "center",
                    editable: { type: "text", validate: { rule: "required" } }, mask: "date-ymd"
                },
                {
                    header: "처분자", name: "disp_usr", width: 60, align: "left",
                    editable: { type: "text", validate: { rule: "required" }, maxlength: 5 }
                },
                {
                    header: "처분유형", name: "disp_tp", width: 60, align: "center",
                    format: { type: "select", data: { memory: "처분구분" } },
                    editable: {
                        validate: { rule: "required" }, type: "select",
                        data: { memory: "처분구분", unshift: [{ title: "-", value: "" }] }
                    }
                },
                {
                    header: "처분비고", name: "disp_rmk", width: 180, align: "left",
                    editable: { type: "text", maxlength: 50 }
                },
                { header: "검수일", name: "qc_dt", width: 100, align: "center", mask: "date-ymd" },
                { header: "검수자", name: "qc_usr", width: 60, align: "left" },
                {
                    header: "처리구분", name: "qc_tp", width: 60, align: "center",
                    format: { type: "select", data: { memory: "처리구분" } }
                },
                {
                    header: "귀책구분", name: "duty_tp", width: 60, align: "center",
                    format: { type: "select", data: { memory: "귀책구분" } }
                },
                { header: "검수비고", name: "qc_rmk", width: 180, align: "left" },
                { header: "요청일", name: "rqst_dt", width: 100, align: "center", mask: "date-ymd" },
                { header: "요청자", name: "rqst_usr", width: 60, align: "left" },
                { header: "요청비고", name: "rqst_rmk", width: 180, align: "left" },
                { header: "입고일", name: "stock_dt", width: 100, align: "center", mask: "date-ymd" },
                { header: "입고자", name: "stock_usr", width: 60, align: "left" },
                { header: "입고비고", name: "stock_rmk", width: 180, align: "left" },
                { name: "cust_prod", hidden: true },
                { name: "stock_status", editable: { type: "hidden" }, hidden: true },
                { name: "issue_seq", editable: { type: "hidden" }, hidden: true },
                { name: "part_seq", editable: { type: "hidden" }, hidden: true }
            ]
        };
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdData_Main", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        gw_com_module.informSize();

        gw_job_process.procedure();

    },
    //#endregion

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage process. (program section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //#region
    procedure: function () {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // define event.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: toggleOption };
        gw_com_module.eventBind(args);
        ////----------
        //var args = { targetid: "lyrMenu", element: "추가", event: "click", handler: processInsert };
        //gw_com_module.eventBind(args);
        ////----------
        //var args = { targetid: "lyrMenu", element: "삭제", event: "click", handler: processDelete };
        //gw_com_module.eventBind(args);
        ////----------
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processSave };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: closeOption };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //==== DW Events : Main
        var args = { targetid: "grdData_Main", grid: true, event: "itemchanged", handler: processItemChanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_Main", grid: true, event: "rowdblclick", handler: processPopup };
        gw_com_module.eventBind(args);
        //----------
        //var args = { targetid: "grdData_Main", grid: true, event: "rowkeyenter", handler: processPopup };
        //gw_com_module.eventBind(args);
        ////----------

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { day: -30 }));
        gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate(""));
        //----------
        gw_com_module.startPage();

    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function toggleOption() {
    var args = { target: [{ id: "frmOption", focus: true }] };
    gw_com_module.objToggle(args);
}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

}
//----------
function processRetrieve(param) {

    closeOption();

    var args = {
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
                { name: "ymd_fr", argument: "arg_ymd_fr" },
                { name: "ymd_to", argument: "arg_ymd_to" },
                { name: "issue_tp", argument: "arg_issue_tp" },
                { name: "rqst_usr", argument: "arg_rqst_usr" },
                { name: "apart_cd", argument: "arg_apart_cd" },
                { name: "apart_nm", argument: "arg_apart_nm" },
                { name: "cust_cd", argument: "arg_cust_cd" },
                { name: "cust_dept", argument: "arg_cust_dept" },
                { name: "cust_prod_nm", argument: "arg_cust_prod_nm" }
            ],
            argument: [
                { name:"arg_stock_status", value:"040" }
            ],
            remark: [
                { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }] },
                { element: [{ name: "issue_tp" }] },
                { element: [{ name: "rqst_usr" }] },
                { element: [{ name: "apart_cd" }] },
                { element: [{ name: "apart_nm" }] },
                { element: [{ name: "cust_cd" }] },
                { element: [{ name: "cust_dept" }] },
                { element: [{ name: "cust_prod_nm" }] }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_Main", select: true }
        ]
    };

    gw_com_module.objRetrieve(args);

}
//----------
function processItemChanged(param) {

    if (param == undefined || param.object == undefined) return;

    switch (param.object) {
        case "grdData_Main":
            if (param.element == "disp_usr" || param.element == "disp_dt") {
                gw_com_api.setValue(param.object, param.row, "stock_status_nm", "050", (param.type == "GRID" ? true : false));
                gw_com_api.setValue(param.object, param.row, "stock_status", "050", (param.type == "GRID" ? true : false));
                if (param.element == "disp_usr" && gw_com_api.getValue(param.object, param.row, "disp_dt", (param.type == "GRID" ? true : false)) == "") {
                    gw_com_api.setValue(param.object, param.row, "disp_dt", gw_com_api.getDate(""), (param.type == "GRID" ? true : false));
                } else if (param.element == "disp_dt" && gw_com_api.getValue(param.object, param.row, "disp_usr", (param.type == "GRID" ? true : false)) == "") {
                    gw_com_api.setValue(param.object, param.row, "disp_usr", gw_com_module.v_Session.USR_NM, (param.type == "GRID" ? true : false));
                }
            }
            break;
    }
}
//----------
function processInsert(param) {

    closeOption();

    processPopup(param);
}
//----------
function processDelete(param) {

    closeOption();

    var args = { targetid: "grdData_Main", row: "selected", focus: true, select: true }
    gw_com_module.gridDelete(args);

}
//----------
function processSave(param) {

    closeOption();

    var args = {
        target: [
            { type: "GRID", id: "grdData_Main" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args.url = "COM";
    args.handler = { success: successSave };
    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    processRetrieve();

}
//----------
function processClear(param) {

}
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closePage
    };
    gw_com_module.streamInterface(args);

}
//----------
function closeDialogue(param) {

    var args = {
        page: param.page
    };
    gw_com_module.dialogueClose(args);
    if (param.focus) {
        gw_com_api.setFocus(v_global.event.object,
	                        v_global.event.row,
	                        v_global.event.element,
	                        (v_global.event.type == "GRID") ? true : false);
    }

}
//----------
function processPopup(param) {
    
    if (param.object == undefined) return;

    var args, page, title, width, height, id, data;
    switch (param.object) {
        case "grdData_Main":
            {
                page = "DLG_ISSUE";
                title = "문제 상세 정보";
                width = 1100;
                height = 500;
                id = gw_com_api.v_Stream.msg_infoAS;
                data = { issue_no: gw_com_api.getValue("grdData_Main", "selected", "issue_no", true) };
            }
            break;
        case "lyrMenu":
            {
                page = "EHM_2111";
                title = "반입목록";
                width = 950;
                height = 430;
                id = gw_com_api.v_Stream.msg_openedDialogue;
            }
            break;
        default:
            return;
            break;

    }

    args = {
        type: "PAGE", page: page, title: title,
        width: width, height: height, scroll: true, open: true, control: true, locate: ["center", "top"]
    };

    if (gw_com_module.dialoguePrepare(args) == false) {
        args.param = {
            ID: id,
            data: data
        }
        gw_com_module.dialogueOpen(args);
    }

}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
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
                            //if (param.data.result == "YES")
                                //processSave({});
                            //else {
                                //var status = checkCRUD({});
                                //if (status == "initialize" || status == "create")
                                //    processClear({});
                                //if (v_global.process.handler != null)
                                //    v_global.process.handler({});
                            //}
                        }
                        break;
                    case gw_com_api.v_Message.msg_confirmRemove:
                        {
                            if (param.data.result == "YES")
                                processRemove({});
                        }
                        break;
                    case gw_com_api.v_Message.msg_informSaved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                    case gw_com_api.v_Message.msg_informRemoved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = { to: { type: "POPUP", page: param.from.page } };

                switch (param.from.page) {
                    case "EHM_2111":
                        {
                            args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                        }
                        break;
                    case "DLG_ISSUE":
                        {
                            args.ID = gw_com_api.v_Stream.msg_infoAS;
                            args.data = {
                                issue_no: gw_com_api.getValue("grdData_Main", "selected", "issue_no", true)
                            };
                        }
                        break;
                }
                gw_com_module.streamInterface(args);
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                switch (param.from.page) {
                    case "EHM_2111": {
                        if (param.data != undefined && param.data.rows != undefined) {
                            var args = { targetid: "grdData_Main", edit: true, updatable: true };
                            args.data = param.data.rows;
                            gw_com_module.gridInserts(args);
                        }
                    } break;
                }

                closeDialogue({ page: param.from.page });
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
