//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 계약추가항목등록
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

        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        var args = {
            request: [
				{
				    type: "PAGE", name: "ISCM81", query: "DDDW_CM_CODE",
				    param: [{ argument: "arg_hcode", value: "ISCM81" }]
				},
				{ type: "PAGE", name: "SYS_FIELD", query: "ECM_1011_9" }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);
        //----------

        function start() { 

            gw_job_process.UI();
        	gw_job_process.procedure();

        	var args = { ID: gw_com_api.v_Stream.msg_openedDialogue };
        	gw_com_module.streamInterface(args);

        	gw_com_module.startPage();
        }
    },

    // manage UI. (design section)
    UI: function () {

        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "닫기", value: "닫기" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_MAIN", query: "ECM_1020_5", title: "",
            caption: false, height: 276, pager: false, show: false, selectable: true, number: true,
            editable: { bind: "open" },
            element: [
				{ header: "항목명", name: "ext_nm", width: 100 },
				{
				    header: "값", name: "ext_val", width: 220,
				    editable: { type: "text", width: 336 }
				},
                { name: "ext_id", editable: { type: "hidden" }, hidden: true },
                { name: "mask", hidden: true },
                { name: "_edit_yn", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        processCreateDW({});
        //=====================================================================================
        var args = {
            target: [
				{ type: "FORM", id: "frmData_MAIN", offset: 8 }
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
        var args = { targetid: "grdData_MAIN", grid: true, event: "itemkeyenter", handler: processEnter };
        gw_com_module.eventBind(args);
        //=====================================================================================

    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//----------
function processButton(param) {

    switch (param.element) {
        case "저장":
            {
                processSave(param);
            }
            break;
        case "상세":
            {
                var data = v_global.data;
                data.edit = true;
                processClose({ data: data });
            }
            break;
        case "전송":
            {
                processSend(param);
            }
            break;
        case "취소":
            {
                processRemove(param);
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
function processRetrieve(param) {

    var args = {
        url: "COM",
        nomessage: true,
        procedure: "sp_createECMDocFieldValue",
        input: [
            { name: "doc_id", value: v_global.data.doc_id, type: "int" },
            { name: "usr_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
        ]
    };
    $.ajaxSetup({ async: false });
    gw_com_module.callProcedure(args);
    $.ajaxSetup({ async: true });

    var args = {
        crud: "update",
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_doc_id", value: v_global.data.doc_id }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_MAIN", select: true }
        ],
        key: param.key,
        handler: {
            complete: processRetrieveEnd,
            param: param
        }
    };
    gw_com_module.objRetrieve(args);

};
//----------
function processRetrieveEnd(param) {

    processCreateDW(param);

}
//----------
function processCreateDW(param) {

    var row = [
        {
            element: [
                { header: true, value: "항목명", format: { type: "label" } },
                { header: true, value: "값", format: { type: "label" } }
            ]
        }
    ];
    //=====================================================================================
    var ids = gw_com_api.getRowIDs("grdData_MAIN");
    var data = new Array();
    var event = new Array();
    if (ids.length > 0) {
        $.each(ids, function () {
            var name1 = this + "_ext_nm";
            var name2 = this + "_ext_val";
            var value1 = gw_com_api.getValue("grdData_MAIN", this, "ext_nm", true);
            var value2 = gw_com_api.getValue("grdData_MAIN", this, "ext_val", true);
            var editable = { type: gw_com_api.getValue("grdData_MAIN", this, "_edit_yn", true) == "1" ? "text" : "hidden" };
            var mask = gw_com_api.getValue("grdData_MAIN", this, "mask", true);
            if (editable.type == "hidden" && mask == "date-ymd")
                editable.width = 500;  //datepicker 감추기
            var col1 = { name: name1, editable: { type: "hidden" } };
            var col2 = { name: name2, editable: editable, mask: mask == "" ? undefined : mask };
            row.push({ element: [col1, col2] });

            data.push({ name: name1, value: value1 });
            data.push({ name: name2, value: value2 });

            if (editable.type == "text")
                event.push(name2);

        });
    }
    //=====================================================================================
    var args = {
        targetid: "frmData_MAIN", query: "ECM_1020_5", type: "TABLE", title: "검토의뢰",
        caption: false, show: true,
        editable: { bind: "select", focus: "1_ext_val", validate: true },
        content: {
            width: { label: 100, field: 270 }, height: 25,
            row: row
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
    var args = {
        targetid: "frmData_MAIN", edit: true, updatable: true,
        data: data
    };
    //----------
    gw_com_module.formInsert(args);
    //=====================================================================================
    $.each(event, function () {
        var args = { targetid: "frmData_MAIN", event: "itemkeyenter", handler: processEnter };
        gw_com_module.eventBind(args);
    });
    //=====================================================================================
    var args = { targetid: "frmData_MAIN", event: "itemchanged", handler: processItemchanged };
    gw_com_module.eventBind(args);
    //=====================================================================================

}
//----------
function processItemchanged(param) {

    if (param.object == "frmData_MAIN") {
        var row = Number(param.element.split("_")[0]);
        var value = param.value.current;
        var el = "#" + param.object + "_" + param.element;
        if ($(el).attr("mask") != undefined) {
            var param = {
                targetobj: el
            };
            value = gw_com_module.textunMask(param);
        }
        gw_com_api.setValue("grdData_MAIN", row, "ext_val", value, true, true);
        gw_com_api.setCRUD("grdData_MAIN", row, "modify", true);
    }

}
//----------
function processSave(param) {

    var args = {
        url: "COM",
        nomessage: param.send ? true : false,
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

    processRetrieve({ key: response });

    if (param.send) {
        processBatch(param);
    } else {
        // 계약서 생성
        processPrint({});
    }

}
//----------
function processRemove(param) {

    var qry = {
        query: "ECM_1020_1",
        row: [{
            crud: "D",
            column: [{ name: "doc_id", value: v_global.data.doc_id }]
        }]
    };

    var args = {
        url: "COM",
        user: gw_com_module.v_Session.USR_ID,
        param: [qry],
        nomessage: true,
        handler: {
            success: successRemove
        }
    };
    gw_com_module.objSave(args);

}
//----------
function successRemove(response, param) {

    processClose({ data: { doc_id: "", send: true } });

}
//----------
function processSend(param) {

    if (gw_com_api.getUpdatable("grdData_MAIN", true)) {
        processSave({ send: true });
    } else {
        processBatch({});
    }

}
//----------
function processBatch(param) {

    var proc = {
        url: "COM",
        procedure: "sp_updateECMDocStat",
        nomessage: true,
        input: [
            { name: "type", value: "SEND_SUPP", type: "varchar" },
            { name: "doc_id", value: v_global.data.doc_id, type: "varchar" },
            { name: "sub_id", value: "%", type: "varchar" },
            { name: "pstat", value: "WAT_A", type: "varchar" }, //계약대기
            { name: "usr_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
        ],
        output: [
            { name: "err_msg", type: "varchar" }
        ],
        handler: {
            success: successBatch,
            param: param
        }
    };
    gw_com_module.callProcedure(proc);

}
//----------
function successBatch(response, param) {

    if (response.VALUE[0] == "") {
        // 계약서 생성
        processPrint({});

        gw_com_api.showMessage("정상 처리되었습니다.");
        var args = {
            data: {
                doc_id: v_global.data.doc_id,
                doc_no: v_global.data.doc_no,
                send: true
            }
        }
        processClose(args);
    } else {
        gw_com_api.messageBox([{ text: response.VALUE[0] }]);
    }

}
//----------
function checkUpdatable(param) {

    var args = {
        check: param.check == undefined ? false : param.check,
        target: [
			{ type: "GRID", id: "grdData_MAIN" }
        ]
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
function processEnter(param) {

    if (param.object == "frmData_MAIN") {
        var seq = Number(param.element.split("_")[0]) + 1;
        var element = seq + "_" + param.element.split("_").slice(1).join("_");
        gw_com_api.setFocus(param.object, param.row, element);
    } else {
        var row = Number(param.row) + 1;
        if (row > gw_com_api.getRowCount(param.object)) return;
        gw_com_api.selectRow(param.object, row, true);
    }

}
//----------
function processPrint(param) {

    var args = {
        page: "ECM_1020",
        option: [
            { name: "PRINT", value: "pdf" },
            { name: "PAGE", value: "ECM_1020" },
            { name: "USER", value: gw_com_module.v_Session.USR_ID },
            { name: "DOC_ID", value: v_global.data.doc_id },
            { name: "DOC_NO", value: v_global.data.doc_no }
        ],
        target: { type: "FILE", id: "ZZZ", name: v_global.data.doc_no }
    };
    gw_com_module.objExport(args);

}
//----------
function setButton(param) {

    var ele = [];
    var args = {
        targetid: "lyrMenu", type: "FREE"
    };
    //-----------------------
    if (gw_com_module.v_Session.USER_TP == undefined || gw_com_module.v_Session.USER_TP == "" || gw_com_module.v_Session.USER_TP == "SUPP") {
        ele[ele.length] = { name: "저장", value: "저장" };
        ele[ele.length] = { name: "닫기", value: "닫기" };
    } else if (v_global.data.new_yn && v_global.data.new_yn == "Y") {
        ele[ele.length] = { name: "저장", value: "저장" };
        ele[ele.length] = { name: "전송", value: "업체전송", icon: "기타" };
        ele[ele.length] = { name: "상세", value: "상세보기", icon: "조회" };
        ele[ele.length] = { name: "취소", value: "등록취소", icon: "아니오" };
    } else {
        ele[ele.length] = { name: "저장", value: "저장" };
        ele[ele.length] = { name: "전송", value: "업체전송", icon: "기타" };
        ele[ele.length] = { name: "닫기", value: "닫기" };
    }
    //-----------------------
    args.element = ele;
    //-----------------------
    gw_com_module.buttonMenu(args);
    //=====================================================================================
    $.each(args.element, function () {
        var event = { targetid: args.targetid, element: this.name, event: "click", handler: processButton };
        gw_com_module.eventBind(event);
    });
    //=====================================================================================

}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                v_global.data = param.data;
                setButton({});
                processRetrieve({});
                v_global.process.init = true;
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_resultMessage:
            {
                if (param.data.page != gw_com_api.getPageID()) {
                    param.to = {
                        type: "POPUP",
                        page: param.data.page
                    };
                    gw_com_module.streamInterface(param);
                    break;
                }
                switch (param.data.ID) {
                    case gw_com_api.v_Message.msg_informSaved:
                        { param.data.arg.handler(param.data.arg.response, param.data.arg.param); } break;
                    case gw_com_api.v_Message.msg_informBatched:
                        { param.data.arg.handler(param.data.arg.response, param.data.arg.param); } break;
                }
            }
            break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//