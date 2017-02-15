//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 검사품목관리
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

        // set data for DDDW List
        var args = {
            request: [
				{
				    type: "PAGE", name: "사업부", query: "dddw_prodgroup"
				},
                {
                    type: "PAGE", name: "검수유형", query: "dddw_zcode",
                    param: [
                        { argument: "arg_hcode", value: "QDM037" }
                    ]
                },
                {
                    type: "PAGE", name: "성적서", query: "dddw_zcode",
                    param: [
                        { argument: "arg_hcode", value: "QDM038" }
                    ]
                }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);

        // Start Process : Create UI & Event
        function start() {
            gw_job_process.UI();
            gw_job_process.procedure();
        }
    },

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage UI. (design section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    UI: function () {

        //==== Main Menu : 조회, 추가, 수정, 삭제
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
        gw_com_module.buttonMenu(args);

        //==== Search Option : 
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true, remark: "lyrRemark",
            editable: { focus: "plant_cd", validate: true },
            content: {
                row: [
                        //{
                        //    element: [
                        //        {
                        //            name: "plant_cd", label: { title: "사업부 : " },
                        //            editable: {
                        //                type: "select", data: {
                        //                    memory: "사업부",
                        //                    unshift: [
                        //                        { title: "전체", value: "%" }
                        //                    ]
                        //                }
                        //            }
                        //        }
                        //    ]
                        //},
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
                                { name: "plant_cd", hidden: true }
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


        //==== Main Grid : 검수품목
        var args = {
            targetid: "grdData_Main", query: "SRM_4250", title: "",
            height: 442, show: true, selectable: true, number: true, // dynamic: true, multi: true, checkrow: true,
            editable: { master: true, bind: "select", focus: "item_cd", validate: true },
            element: [
                {
                    header: "사업부", name: "dept_area", width: 60, align: "left",
                    format: { type: "select", data: { memory: "사업부" } },
                    //editable: {
                    //    bind: "create", type: "select", data: { memory: "사업부" },
                    //    validate: { rule: "required" }, width: 110
                    //}
                    editable: { type: "hidden" }, hidden: true
                },
				{
				    header: "품번", name: "item_cd", width: 60,
				    editable: { type: "hidden", validate: { rule: "requied" }, width: 140 }
				},
				{ header: "품명", name: "item_nm", width: 150, align: "left" },
				{ header: "규격", name: "item_spec", width: 150, align: "left" },
                { header: "단위", name: "item_unit", width: 40, align: "center" },
                {
                    header: "검수유형", name: "check_yn", width: 60, align: "center",
                    //format: {
                    //    type: "radio", child: [{ title: "필수", value: "1" }, { title: "선택", value: "0" }]
                    //},
                    //editable: {
                    //    type: "radio", child: [{ title: "필수", value: "1" }, { title: "선택", value: "0" }]
                    //}
                    format: { type: "select", data: { memory: "검수유형" } },
                    editable: { type: "select", data: { memory: "검수유형" }, width: 110, validate: { rule: "required" } }
                },
                {
                    header: "성적서", name: "chk01_yn", width: 60, align: "center",
                    //format: {
                    //    type: "radio", child: [{ title: "필수", value: "1" }, { title: "선택", value: "0" }]
                    //},
                    //editable: {
                    //    type: "radio", child: [{ title: "필수", value: "1" }, { title: "선택", value: "0" }]
                    //}
                    format: { type: "select", data: { memory: "성적서" } }, hidden: true,
                    editable: { type: "select", data: { memory: "성적서" }, width: 110, validate: { rule: "required" } }
                }
            ]
        };
        gw_com_module.gridCreate(args);

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

        //==== Button Click ====
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
        //----------

        //==== Button Click : Search Option ====
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: hideOption };
        gw_com_module.eventBind(args);
        function hideOption(ui) { gw_com_api.hide("frmOption"); }
        //----------

        //==== Grid Events : Main
        var args = { targetid: "grdData_Main", grid: true, event: "itemdblclick", handler: itemdblClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_Main", grid: true, event: "itemkeyenter", handler: itemdblClick };
        gw_com_module.eventBind(args);
        //----------

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
                    { name: "plant_cd", argument: "arg_plant_cd" },
                    { name: "item_cd", argument: "arg_item_cd" },
                    { name: "item_nm", argument: "arg_item_nm" }
                ],
                remark: [
                    { element: [{ name: "plant_cd" }] },
                    { element: [{ name: "item_cd" }] },
                    { element: [{ name: "item_nm" }] }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_Main", focus: true, select: true }
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
			{ type: "GRID", id: "grdData_Main" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args.url = "COM";
    args.handler = { success: successSave };
    gw_com_module.objSave(args);

}
//---------- After Saving
function successSave(response, param) {
    //$.each(response, function () {
    //    processRetrieve({ object: "frmOption" });
    //});
    processRetrieve({ key: response });
}
//---------- Insert
function processInsert(param) {
    
    gw_com_api.hide("frmOption");
    //var args = {
    //    targetid: "grdData_Main", edit: true,
    //    data: [
    //        { name: "dept_area", value: "" },
    //        { name: "check_yn", value: "1" }
    //    ]
    //};
    //var row = gw_com_module.gridInsert(args);
    //itemdblClick({ type: "GRID", object: "grdData_Main", row: row, element: "item_cd" });
    processFind({ element: "item_cd" });

}
//---------- Delete
function processDelete(param) {

    gw_com_api.hide("frmOption");
    var args = { targetid: "grdData_Main", row: "selected", select: true }
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

    switch (param.element) {
        case "item_cd":
            {
                var args = {
                    type: "PAGE", page: "DLG_PART", title: "품목 선택",
                    width: 900, height: 450, open: true
                };
                if (gw_com_module.dialoguePrepare(args) == false) {
                    var args = {
                        page: "DLG_PART",
                        param: { ID: gw_com_api.v_Stream.msg_selectPart }
                    };
                    gw_com_module.dialogueOpen(args);
                }
            }
            break;
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
        case gw_com_api.v_Stream.msg_closeDialogue: {
            closeDialogue({ page: param.from.page });
        } break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = { to: { type: "POPUP", page: param.from.page } };
                switch (param.from.page) {
                    case "DLG_PART":
                        { args.ID = gw_com_api.v_Stream.msg_selectPart; }
                        break;
                }
                gw_com_module.streamInterface(args);
            }
            break;
        case gw_com_api.v_Stream.msg_selectedPart:
            {
                var find = gw_com_api.getFindRow("grdData_Main", "item_cd", param.data.part_cd);
                if (find > 0) return;
                var args = {
                    targetid: "grdData_Main", edit: true, updatable: true,
                    data: [
                        { name: "dept_area", value: param.data.prod_group },
                        { name: "item_cd", value: param.data.part_cd },
                        { name: "item_nm", value: param.data.part_nm },
                        { name: "item_spec", value: param.data.part_spec },
                        { name: "item_unit", value: param.data.part_unit },
                        { name: "check_yn", value: "1" },
                        { name: "chk01_yn", value: "1" }
                    ]
                };
                var row = gw_com_module.gridInsert(args);

                //gw_com_api.setValue(v_global.event.object,
			    //                    v_global.event.row,
			    //                    "dept_area",
			    //                    param.data.prod_group,
			    //                    (v_global.event.type == "GRID") ? true : false);
                //gw_com_api.setValue(v_global.event.object,
			    //                    v_global.event.row,
			    //                    "item_cd",
			    //                    param.data.part_cd,
			    //                    (v_global.event.type == "GRID") ? true : false);
                //gw_com_api.setValue(v_global.event.object,
			    //                    v_global.event.row,
			    //                    "item_nm",
			    //                    param.data.part_nm,
			    //                    (v_global.event.type == "GRID") ? true : false);
                //gw_com_api.setValue(v_global.event.object,
			    //                    v_global.event.row,
			    //                    "item_spec",
			    //                    param.data.part_spec,
			    //                    (v_global.event.type == "GRID") ? true : false);
                //gw_com_api.setValue(v_global.event.object,
			    //                    v_global.event.row,
			    //                    "item_unit",
			    //                    param.data.part_unit,
			    //                    (v_global.event.type == "GRID") ? true : false);
                //closeDialogue({ page: param.from.page, focus: true });
            }
            break;

    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//