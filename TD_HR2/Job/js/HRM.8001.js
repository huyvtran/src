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

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set data.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        var args = {
            request: [
                {
                    type: "INLINE", name: "주야",
                    data: [
                        { title: "-", value: "" },
						{ title: "주간", value: "주" },
						{ title: "야간", value: "야" }
                    ]
                },
                {
                    type: "INLINE", name: "등급",
                    data: [
                        { title: "-", value: "" },
						{ title: "최상", value: "A" },
						{ title: "상", value: "B" },
						{ title: "중", value: "C" },
						{ title: "하", value: "D" },
						{ title: "최하", value: "E" }
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
            targetid: "lyrMenu_Main", type: "FREE",
            element: [
                { name: "저장", value: "저장" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_경력", query: "HRM_8000_05", type: "TABLE", title: "경력 기술서",
            caption: false, show: true, selectable: true,
            editable: { bind: "select", focus: "d3_inf01", validate: true },
            content: {
                width: { label: 50, field: 70 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "근무회사", format: { type: "label" } },
                            { name: "d3_inf01", editable: { type: "text", width: 144, maxlength: 20 } },
                            { header: true, value: "소재지", format: { type: "label" } },
                            { name: "d3_inf02", editable: { type: "text", width: 144, maxlength: 20 } },
                            { header: true, value: "근무기간", format: { type: "label" } },
                            { name: "d3_inf03", mask: "date-ymd", align: "center", editable: { type: "text", width: 144 } },
                            { name: "d3_inf04", mask: "date-ymd", align: "center", editable: { type: "text", width: 144 } },
                            { name: "ann_key", editable: { type: "hidden" }, hidden: true },
                            { name: "ann_seq", editable: { type: "hidden" }, hidden: true },
                            { name: "app_key", editable: { type: "hidden" }, hidden: true },
                            { name: "rec_seq", editable: { type: "hidden" }, hidden: true }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "담당업무", format: { type: "label" } },
                            { name: "d3_inf06", editable: { type: "text", width: 411, maxlength: 20 }, style: { colspan: 3 } },
                            { header: true, value: "직위", format: { type: "label" } },
                            { name: "d3_inf05", editable: { type: "text", width: 304, maxlength: 20 }, style: { colspan: 2 } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "퇴직(이직)사유", format: { type: "label" } },
                            { name: "d3_inf08", editable: { type: "text", width: 411, maxlength: 20 }, style: { colspan: 3 } },
                            { header: true, value: "연봉(만원)", format: { type: "label" } },
                            {
                                name: "d3_inf07", mask: "numeric-int", fix: { mask: "numeric-int" },
                                editable: { type: "text", width: 144, maxlength: 20 }, style: { colspan: 2 }
                            }
                        ]
                    },
                    {
                        element: [
                            //{ header: true, value: "사업품목", format: { type: "label" } },
                            //{ name: "d3_inf09", editable: { type: "text", width: 144, maxlength: 20 } },
                            { header: true, value: "매출액(억원)", format: { type: "label" } },
                            {
                                name: "d3_inf11",// mask: "numeric-int", fix: { mask: "numeric-int" },
                                editable: { type: "text", width: 144, maxlength: 20 }
                            },
                            { header: true, value: "매출연도", format: { type: "label" } },
                            { name: "d3_inf10", editable: { type: "text", width: 144, maxlength: 20 } },
                            { header: true, value: "종업원수", format: { type: "label" } },
                            {
                                name: "d3_inf12", mask: "numeric-int", fix: { mask: "numeric-int" },
                                editable: { type: "text", width: 144, maxlength: 20 }, style: { colspan: 2 }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "주요 경력<br><br>및<br><br>보유 기술", format: { type: "label" } },
                            {
                                name: "d3_inf13", style: { colspan: 6 },
                                format: { type: "textarea", rows: 18, width: 836 },
                                editable: { type: "textarea", rows: 18, width: 836 }
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
				{ type: "FORM", id: "frmData_경력", offset: 8 }
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

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // define event.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //----------
        var args = { targetid: "lyrMenu_Main", element: "저장", event: "click", handler: processSave };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_Main", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_경력", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);

    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function processInit(param) {
}
//----------
function checkCRUD(param) {

    return gw_com_api.getCRUD("frmData_상세");

}
//----------
function processRetrieve(param) {

    if (v_global.logic.ann_key == undefined || v_global.logic.ann_key == "" ||
        v_global.logic.ann_seq == undefined || v_global.logic.ann_seq == "" ||
        v_global.logic.app_key == undefined || v_global.logic.app_key == "")
        return;

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_ann_key", value: v_global.logic.ann_key },
                { name: "arg_ann_seq", value: v_global.logic.ann_seq },
                { name: "arg_app_key", value: v_global.logic.app_key },
                { name: "arg_rec_seq", value: v_global.logic.rec_seq }
            ]
        },
        target: [
            { type: "FORM", id: "frmData_경력" }
        ],
        handler_complete: processRetrieveEnd
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {

}
//----------
function processItemchanged(param) {

    if (param.object == undefined) return;

    //if (param.object == "frmData_경력" && param.element == "d3_inf13") {
    //    var args = { str: param.value.current, max: 80000, message: true };
    //    var val = uf_byteCut(args);
    //    if (param.value.current != val)
    //        gw_com_api.setValue(param.object, 1, param.element, val);
    //}
}
//----------
function processInsert(param) {

    processClear();

    var args = {
        targetid: "frmData_경력", edit: true, updatable: true,
        data: [
            { name: "ann_key", value: v_global.logic.ann_key },
            { name: "ann_seq", value: v_global.logic.ann_seq },
            { name: "app_key", value: v_global.logic.app_key }
        ]
    };

    gw_com_module.formInsert(args);

}
//----------
function processDelete(param) {

}
//----------
function processCheckUpdatable(param) {

}
//----------
function processSave(param) {

    // 저장
    var args = {
        target: [
			{ type: "FORM", id: "frmData_경력" }
        ],
        nomessage: true
    };

    if (gw_com_module.objValidate(args) == false) return false;

    //args.url = "COM";
    args.handler = { success: successSave };
    args.handler.param = param;

    gw_com_module.objSave(args);

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_경력" }
        ]
    };
    gw_com_module.objClear(args);

}
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closeDialogue,
        data: { save: param.save }
    };
    gw_com_module.streamInterface(args);

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

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
function successSave(response, param) {

    processClose({ save: true });

}
//----------
function uf_byteCut(param) {

    var byte = 0;
    var str = "";
    $.each(param.str, function (i) {
        if (byte + (escape(this).length > 4 ? 2 : 1) > param.max) {
            if (param.message != undefined && param.message) {
                alert("허용된 글자수(" + param.max + " byte)가 초과되었습니다.\r\n초과된 부분은 자동으로 삭제됩니다.");
            }
            return false;
        } else {
            str += this;
            byte += (escape(this).length > 4 ? 2 : 1);
        }
    });

    return str;

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
                v_global.logic.ann_key = param.data.ann_key;
                v_global.logic.ann_seq = param.data.ann_seq;
                v_global.logic.app_key = param.data.app_key;
                v_global.logic.rec_seq = param.data.rec_seq;

                if (v_global.logic.rec_seq == 0) {
                    processInsert();
                } else {
                    processRetrieve();
                }
            }
            break;
        case gw_com_api.v_Stream.msg_resultMessage: {
            if (param.data.page != gw_com_api.getPageID()) break;
        } break;
    };

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//