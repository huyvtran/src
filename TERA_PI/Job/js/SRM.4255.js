//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 검사성적서관리(협력사)
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

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // entry point. (pre-process section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ready: function () {

        // initialize page.
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        // 협력사 여부
        v_global.logic.Supp = (gw_com_module.v_Session.USER_TP == "SUPP" ? true : false);

        start();

        // Start Process : Create UI & Event
        function start() {
            gw_job_process.UI();
            gw_job_process.procedure();

            gw_com_api.setValue("frmOption", 1, "qa_tp", "COI");
            if (v_global.logic.Supp) {
                gw_com_api.setValue("frmOption", 1, "supp_cd", gw_com_module.v_Session.EMP_NO);
                gw_com_api.setValue("frmOption", 1, "supp_nm", gw_com_module.v_Session.USR_NM);
                processRetrieve({});
            }
        }
    },

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage UI. (design section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    UI: function () {

        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "조회", value: "조회", act: true },
				{ name: "추가", value: "추가" },
				{ name: "삭제", value: "삭제" },
				{ name: "저장", value: "저장" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true, remark: "lyrRemark",
            editable: { focus: "item_cd", validate: true },
            content: {
                row: [
                        {
                            element: [
                                {
                                    name: "item_cd", label: { title: "품번 :" },
                                    editable: { type: "text", size: 10 }
                                },
                                {
                                    name: "item_nm", label: { title: "품명 :" },
                                    editable: { type: "text", size: 20 }
                                },
                                {
                                    name: "supp_nm", label: { title: "협력사 :" }, mask: "search",
                                    hidden: v_global.logic.Supp,
                                    editable: { type: "text", size: 14, maxlength: 20, validate: { rule: "required" } }
                                },
                                { name: "supp_cd", editable: { type: "hidden" }, hidden: true },
                                { name: "qa_tp", editable: { type: "hidden" }, hidden: true }
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
            targetid: "grdData_MAIN", query: "SRM_4255_1", title: "",
            height: 442, show: true, selectable: true, number: true, // dynamic: true, multi: true, checkrow: true,
            editable: { master: true, bind: "select", focus: "item_cd", validate: true },
            element: [
				{
				    header: "품번", name: "item_cd", width: 100,
				    editable: { type: "hidden", validate: { rule: "requied" }, width: 140 }
				},
				{ header: "품명", name: "item_nm", width: 200 },
				{ header: "규격", name: "item_spec", width: 200 },
                //{ header: "단위", name: "item_unit", width: 50, align: "center" },
                {
                    header: "성적서 필수 첨부", name: "qa_yn", width: 60, align: "center",
                    format: { type: "checkbox", value: "1", offval: "0", title: "" },
                    editable: { type: "checkbox", value: "1", offval: "0", title: "" }
                },
                { name: "supp_cd", editable: { type: "hidden" }, hidden: true },
                { name: "qa_tp", editable: { type: "hidden" }, hidden: true },
                { name: "app_date", editable: { type: "hidden" }, hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
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
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: viewOption };
        gw_com_module.eventBind(args);
        function viewOption(ui) {
            var args = { target: [{ id: "frmOption", focus: true }] };
            gw_com_module.objToggle(args);
        }
        //----------
        var args = { targetid: "lyrMenu", element: "추가", event: "click", handler: processInsert };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "삭제", event: "click", handler: processDelete };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processSave };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption", event: "itemdblclick", handler: processFind };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemkeyenter", handler: processFind };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: hideOption };
        gw_com_module.eventBind(args);
        function hideOption(ui) { gw_com_api.hide("frmOption"); }
        //=====================================================================================
        var args = { targetid: "grdData_MAIN", grid: true, event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //=====================================================================================

        gw_com_module.startPage();

    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//---------- Sub Functions : Checking
function checkSelected(objid) {
    if (gw_com_api.getSelectedRow(objid) == null) {
        gw_com_api.messageBox([{ text: "선택된 대상이 없습니다." }], 300);
        return false;
    }
    return true;
}
//----------
function processItemchanged(param) {

    if (param.object == "grdData_MAIN") {
        gw_com_api.setValue(param.object, param.row, "app_date", gw_com_api.getDate(), true);
    } else if (param.object == "frmOption") {
        switch (param.element) {
            case "supp_nm":
                if (param.value.current == "")
                    gw_com_api.setValue(param.object, param.row, "supp_cd", "");
                break;
        }
    }

}
//----------
function processRetrieve(param) {

    // Validate Inupt Options
    var args = { target: [{ type: "FORM", id: "frmOption" }] };
    if (gw_com_module.objValidate(args) == false) return false;

    // Retrieve
    if (param.object == "frmOption" || param.object == undefined) {
        args = {
            source: {
                type: "FORM", id: "frmOption", hide: true,
                element: [
                    { name: "item_cd", argument: "arg_item_cd" },
                    { name: "item_nm", argument: "arg_item_nm" },
                    { name: "supp_cd", argument: "arg_supp_cd" },
                    { name: "qa_tp", argument: "arg_qa_tp" }
                ],
                remark: [
                    { element: [{ name: "supp_nm" }], label: "협력사 :" },
                    { element: [{ name: "item_cd" }] },
                    { element: [{ name: "item_nm" }] }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_MAIN", focus: true, select: true }
            ],
            key: param.key
        };
    }

    gw_com_module.objRetrieve(args);

}
//---------- Save
function processSave(param) {

    var args = {
        target: [
			{ type: "GRID", id: "grdData_MAIN" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args.url = "COM";
    args.handler = { success: successSave };
    gw_com_module.objSave(args);

}
//---------- After Saving
function successSave(response, param) {

    processRetrieve({ key: response });

}
//---------- Insert
function processInsert(param) {
    
    gw_com_api.hide("frmOption");
    processFind({ element: "item_cd" });

}
//---------- Delete
function processDelete(param) {

    gw_com_api.hide("frmOption");

    // 신규 추가 내역만 삭제 가능
    if (gw_com_api.getCRUD("grdData_MAIN", "selected", true) != "create") {
        gw_com_api.messageBox([{ text: "이미 저장된 내역은 삭제할 수 없습니다." }], 400);
        return false;
    }

    var args = { targetid: "grdData_MAIN", row: "selected", select: true }
    gw_com_module.gridDelete(args);

}
//---------- Closing Process
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
function itemdblClick(param) {

    switch (param.element) {
        case "item_cd":
            {
                v_global.event.type = param.type;
                v_global.event.object = param.object;
                v_global.event.row = param.row;
                v_global.event.element = param.element;
                var args = {
                    type: "PAGE",
                    page: "DLG_PART",
                    title: "품목 선택",
                    width: 900,
                    height: 450,
                    open: true
                };
                if (gw_com_module.dialoguePrepare(args) == false) {
                    var args = {
                        page: "DLG_PART",
                        param: {
                            ID: gw_com_api.v_Stream.msg_selectPart
                        }
                    };
                    gw_com_module.dialogueOpen(args);
                }
            }
            break;
    }
}
//----------
function processFind(param) {

    v_global.event.type = param.type;
    v_global.event.object = param.object;
    v_global.event.row = param.row;
    v_global.event.element = param.element;
    var args;
    switch (param.element) {
        case "item_cd":
            {
                v_global.event.data = {
                    qa_tp: gw_com_api.getValue("frmOption", 1, "qa_tp")
                };
                args = {
                    type: "PAGE", page: "SRM_4256", title: "품목 선택",
                    width: 700, height: 350, open: true,
                    id: gw_com_api.v_Stream.msg_openedDialogue
                };
            }
            break;
        case "supp_cd":
        case "supp_nm":
            v_global.event.cd = "supp_cd";
            v_global.event.nm = "supp_nm";
            v_global.event.data = {
                supp_cd: (param.element == "supp_cd" ? gw_com_api.getValue(param.object, param.row, param.element) : ""),
                supp_nm: (param.element == "supp_nm" ? gw_com_api.getValue(param.object, param.row, param.element) : "")
            };
            args = {
                type: "PAGE", page: "DLG_SUPPLIER", title: "협력사 선택",
                width: 600, height: 450, open: true,
                id: gw_com_api.v_Stream.msg_selectSupplier
            };
            break;
        default:
            return;
    }

    if (gw_com_module.dialoguePrepare(args) == false) {
        args = {
            page: args.page,
            param: {
                ID: args.id,
                data: v_global.event.data
            }
        };
        gw_com_module.dialogueOpen(args);
    }

}
//----------
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_showMessage: {
            gw_com_module.streamInterface(param);
        } break;
        case gw_com_api.v_Stream.msg_resultMessage: {
            // PageId가 다를 때 Skip 
            if (param.data.page != gw_com_api.getPageID()) {
                param.to = { type: "POPUP", page: param.data.page };
                gw_com_module.streamInterface(param);
                break;
            }
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
            }
        } break;
        case gw_com_api.v_Stream.msg_retrieve: {
            processRetrieve({ key: param.data.key });
        } break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = { to: { type: "POPUP", page: param.from.page } };
                switch (param.from.page) {
                    case "DLG_SUPPLIER":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectSupplier;
                            args.data = v_global.event.data;
                        }
                        break;
                    case "SRM_4256":
                        args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                        args.data = v_global.event.data;
                        break;
                }
                gw_com_module.streamInterface(args);
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                switch (param.from.page) {
                    case "SRM_4256":
                        if (param.data != undefined) {
                            var rows = new Array();
                            $.each(param.data, function () {
                                var find = gw_com_api.getFindRow("grdData_MAIN", "item_cd", this.item_cd);
                                if (find < 1) {
                                    rows.push(this);
                                }
                            });
                            if (rows.length > 0) {
                                var args = {
                                    targetid: "grdData_MAIN", edit: true, updatable: true,
                                    data: rows
                                };
                                gw_com_module.gridInserts(args);
                            }
                        }
                        break;
                }
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedSupplier:
            {
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        v_global.event.cd,
			                        param.data.supp_cd,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        v_global.event.nm,
			                        param.data.supp_nm,
			                        (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//