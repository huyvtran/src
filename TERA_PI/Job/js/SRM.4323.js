//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 입고대상 목록 조회
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
                    type: "PAGE", name: "창고", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "ISCM10" }]
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
				{ name: "저장", value: "가입고", icon: "저장" },
				{ name: "닫기", value: "취소", icon: "닫기" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, show: true, border: false, align: "left",
            editable: { bind: "open", focus: "proj_no", validate: true },
            content: {
                row: [
                    {
                        element: [
				            {
				                name: "supp_nm", label: { title: "협력사명 :" },
				                editable: { type: "text", size: 15 }
				            },
                            {
				                name: "dlv_no", label: { title: "납품서번호 :" },
				                editable: { type: "text", size: 13, maxlength: 20 }
				            },
                            {
                                name: "wh_cd", label: { title: "창고 :" },
                                editable: { type: "select", data: { memory: "창고", unshift: [{ title: "-", value: "" }] } }
                            },
				            { name: "실행", act: true, show: false, format: { type: "button" } }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //----------
        var $wrapper = $("#frmOption_dlv_no").parent().parent().parent().parent();
        $wrapper.css("padding-right", "110px");
        //=====================================================================================
        var args = {
            targetid: "grdList_MAIN", query: "SRM_4323_1", title: "납품서",
            width: 210, height: 182, pager: false, caption: true, show: true, number: true,
            element: [
				{ header: "협력사", name: "supp_nm", width: 100 },
                { name: "supp_cd", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_SUB", query: "SRM_4323_2", title: "납품서",
            width: 210, height: 150, pager: false, caption: false, show: true, multi: true, checkrow: true,
            element: [
				{ header: "납품서번호", name: "dlv_no", width: 100, align: "center" }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_DETAIL", query: "SRM_4323_3", title: "가입고 대상 품목",
            height: 334, show: true, caption: true, selectable: true, number: true,
            element: [
				{ header: "품번", name: "item_cd", width: 80, align: "center" },
				{ header: "품명", name: "item_nm", width: 130, align: "left" },
				{ header: "규격", name: "item_spec", width: 130, align: "left" },
				{ header: "Project Name", name: "proj_nm", width: 130 },
				{ header: "Project No.", name: "proj_no", width: 80, align: "center", hidden: true },
                {
                    header: "선입고", name: "direct_yn", width: 50, align: "center",
                    format: { type: "checkbox", value: "1", offval: "", title: "" }
                },
				{ header: "검수유형", name: "chk_yn_nm", width: 50, align: "center" },
				{ header: "수량", name: "dlv_qty", width: 50, align: "right", mask: "numeric-int" },
				{ header: "단위", name: "pur_unit", width: 40, align: "center" },
				{
				    header: "확인수량", name: "chk_qty", width: 50, align: "right",
				    editable: { type: "text", validate: { rule: "required" } }, hidden: true   // TERA-사용안함
				},
				{ header: "발주번호", name: "pur_no", width: 100, align: "center" },
				{ header: "발주순번", name: "pur_seq", width: 60, align: "center", hidden: true },
                { name: "label_tp", hidden: true },
                { name: "dlv_no", hidden: true },
                { name: "dlv_seq", hidden: true },
                { name: "pur_no", hidden: true },
                { name: "pur_seq", hidden: true },
                { name: "pur_qty", hidden: true },
                { name: "req_date", hidden: true },
                { name: "chk_yn", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
				{ type: "GRID", id: "grdList_MAIN", offset: 4 },
				{ type: "GRID", id: "grdList_SUB", offset: 4 },
				{ type: "GRID", id: "grdList_DETAIL", offset: 4 }
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
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processSave };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdList_MAIN", grid: true, event: "rowselected", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdList_SUB", grid: true, event: "rowselected", handler: processRowSelected };
        gw_com_module.eventBind(args);
        //----------
        $("#cb_grdList_SUB_data").change(function () {
            return processRowSelected({ object: "grdList_SUB", element: "check_all" });
        });
        //=====================================================================================

        // startup process.
        //----------
        gw_com_module.startPage();
    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//----------
function processRowSelected(param) {

    if (param.object == "grdList_SUB") {
        var dlv_no = getDlvNo().replace(/,/gi, "','");;
        if (dlv_no == "") {
            var args = {
                target: [
                    { type: "GRID", id: "grdList_DETAIL" }
                ]
            };
            gw_com_module.objClear(args);
        } else {
            var args = {
                source: {
                    type: "INLINE",
                    argument: [
                        { name: "arg_dlv_no", value: dlv_no }
                    ]
                },
                target: [
                    { type: "GRID", id: "grdList_DETAIL" }
                ]
            };
            gw_com_module.objRetrieve(args);
        }
    }

}
//----------
function processRetrieve(param) {

    var args;
    if (param.object == "grdList_MAIN") {
        args = {
            source: {
                type: param.type, id: param.object, row: param.row,
                element: [
                    { name: "supp_cd", argument: "arg_supp_cd" }
                ],
                argument: [
                    { name: "arg_dlv_no", value: gw_com_api.getValue("frmOption", 1, "dlv_no") }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_SUB", select: true }
            ],
            key: param.key
        };
    } else {
        args = {
            source: {
                type: "FORM", id: "frmOption",
                element: [
                    { name: "dlv_no", argument: "arg_dlv_no" },
                    { name: "supp_nm", argument: "arg_supp_nm" }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_MAIN", select: true }
            ],
            clear: [
                { type: "GRID", id: "grdList_SUB" },
                { type: "GRID", id: "grdList_DETAIL" }
            ],
            key: param.key
        };
    }
    gw_com_module.objRetrieve(args);

};
//----------
function processSave(param) {

    var dlv_no = getDlvNo();
    if (dlv_no == "") {
        gw_com_api.messageBox([{ text: "NODATA" }]);
        return;
    }
    var wh_cd = gw_com_api.getValue("frmOption", 1, "wh_cd");
    if (wh_cd == "") {
        gw_com_api.messageBox([{ text: "창고를 선택하세요." }], 250, gw_com_api.v_Message.msg_alert, "ALERT", { type: "chk_wh_cd" });
        return;
    }

    var args = {
        url: "COM",
        nomessage: true,
        procedure: "PROC_SRM_ITEMIO_AUTO_CREATE",
        input: [
            { name: "RootNo", value: dlv_no, type: "varchar" },
            { name: "RootTp", value: "DLV", type: "varchar" },
            { name: "WhCd", value: wh_cd, type: "varchar" },
            { name: "UserId", value: gw_com_module.v_Session.USR_ID, type: "varchar" },
            { name: "UserDept", value: gw_com_module.v_Session.DEPT_CD, type: "varchar" }
        ],
        output: [
            { name: "IoNo", type: "varchar" },
            { name: "rtn_cd", type: "varchar" },
            { name: "rtn_msg", type: "varchar" }
        ],
        handler: {
            success: successSave,
            param: param
        }
    };
    gw_com_module.callProcedure(args);

}
//----------
function successSave(response, param) {

    if (response.VALUE[1] == "OK") {
        gw_com_api.messageBox(
            [{ text: "SUCCESS" }], 320, gw_com_api.v_Message.msg_informBatched,
            "ALERT", { handler: successBatch, response: response, param: { type: "itemio" } }
        );
    } else {
        gw_com_api.messageBox([{ text: response.VALUE[2] }], 320, gw_com_api.v_Message.msg_informBatched,
            "ALERT", { handler: successBatch, response: response, param: { type: "itemio" } }
            );
    }

}
//----------
function successBatch(response, param) {

    if (param.type == "itemio") {
        var args = {
            ID: gw_com_api.v_Stream.msg_closeDialogue,
            data: { io_no: response.VALUE[0] }
        };
        gw_com_module.streamInterface(args);
    }

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdList_MAIN" },
            { type: "GRID", id: "grdList_SUB" },
            { type: "GRID", id: "grdList_DETAIL" }
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
function getDlvNo() {

    var ids = gw_com_api.getSelectedRow("grdList_SUB", true);
    var dlv_no = "";
    $.each(ids, function () {
        dlv_no += (dlv_no == "" ? "" : ",") + gw_com_api.getValue("grdList_SUB", this, "dlv_no", true);
    });
    return dlv_no;

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_selectPart_SCM: {
            gw_com_api.setValue("frmOption", 1, "wh_cd", "");
            processRetrieve({});
        } break;
        case gw_com_api.v_Stream.msg_resultMessage: {
            if (param.data.page != gw_com_api.getPageID())
                break;

            // 확인 메시지별 처리    
            switch (param.data.ID) {
                case gw_com_api.v_Message.msg_confirmSave: {
                    if (param.data.result == "YES") processSave(param.data.arg);
                    else {
                        processClear({});
                        if (v_global.process.handler != null) v_global.process.handler(param.data.arg);
                    }
                } break;
                case gw_com_api.v_Message.msg_confirmRemove: {
                    if (param.data.result == "YES") processRemove(param.data.arg);
                } break;
                case gw_com_api.v_Message.msg_confirmBatch: {
                    if (param.data.result == "YES") {
                        if (param.data.arg.apply)
                            processRun({});
                    } else {
                        processPop({ object: "lyrMenu_main" });
                    }
                } break;
                case gw_com_api.v_Message.msg_informSaved: {
                    param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                } break;
                case gw_com_api.v_Message.msg_informRemoved: {
                    param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                } break;
                case gw_com_api.v_Message.msg_informBatched: {
                    param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                } break;
                case gw_com_api.v_Message.msg_alert:
                    if (param.data.arg != undefined) {
                        switch (param.data.arg.type) {
                            case "chk_wh_cd":
                                var $wrapper = $("#frmOption_wh_cd").parent();
                                $("a.jqTransformSelectOpen", $wrapper).click();
                                break;
                        }
                    }
                    break;
            }
        } break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//