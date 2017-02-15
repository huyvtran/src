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

        var args = {
            request: [
				{
				    type: "PAGE", name: "검사항목", query: "DDDW_CM_CODE",
				    param: [{ argument: "arg_hcode", value: "SPC010"}]
				},
				{
				    type: "PAGE", name: "품목분류", query: "DDDW_CM_CODE",
				    param: [{ argument: "arg_hcode", value: "SPC020"}]
				},
                {
                    type: "INLINE", name: "보기",
                    data: [
						{ title: "축약", value: "S" },
						{ title: "확장", value: "L" }
					]
                }
			],
            starter: start
        };
        gw_com_module.selectSet(args);

        //start();

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
				{ name: "조회", value: "조회", act: true },
				{ name: "저장", value: "저장" },
				{ name: "닫기", value: "닫기" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_2", type: "FREE",
            element: [
				{ name: "추가", value: "추가" },
				{ name: "삭제", value: "삭제" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_3", type: "FREE",
            element: [
				{ name: "추가", value: "추가" },
				{ name: "삭제", value: "삭제" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_대분류", query: "SPC_1010_M_1", title: "품질검사항목",
            caption: true, width: 400, height: 165, show: true, selectable: true,
            element: [
				{ header: "코드", name: "dcode", width: 60, align: "center" },
				{ header: "검사항목", name: "dname", width: 200, align: "left" },
				{ header: "측정단위", name: "fcode1", width: 100, align: "center" },
				{ name: "hcode", hidden: true, editable: { type: "hidden"} }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_중분류", query: "SPC_1010_S_1", title: "검사대상품목",
            caption: true, width: 500, height: 145, show: true, selectable: true,
            editable: { multi: true, bind: "select", focus: "part_no", validate: true },
            element: [
				{ header: "Part No.", name: "part_no", width: 100, align: "center", mask: "search",
				    editable: { type: "text", readonly: false,
				        validate: { rule: "required", message: "Part No." }
				    }
				},
				{ header: "Part Name", name: "part_nm", width: 150, align: "left" },
				{ header: "Part 분류", name: "part_grp", width: 150, align: "left",
				    format: { type: "select", data: { memory: "품목분류"} },
				    editable: { validate: { rule: "required" }, type: "select", data: { memory: "품목분류"} }
				},
				{ header: "협력사", name: "supp_nm", width: 150, align: "left", mask: "search", display: true,
				    editable: { type: "text" }
				},
				{ name: "supp_cd", hidden: true }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_소분류", query: "SPC_1010_S_2", title: "검사표준",
            caption: true, width: 900, height: 178, show: true, selectable: true,
            editable: { multi: true, bind: "select", focus: "qcitem_cd", validate: true },
            element: [
				{ header: "검사 항목", name: "qcitem_cd", width: 200, align: "left",
				    format: { type: "select", data: { memory: "검사항목"} },
				    editable: { validate: { rule: "required" }, type: "select", data: { memory: "검사항목"} }
				},
				{ header: "Part 분류", name: "part_no", width: 200, align: "left",
				    format: { type: "select", data: { memory: "품목분류"} },
				    editable: { validate: { rule: "required" }, type: "select", data: { memory: "품목분류"} }
				},
            	{ header: "Normal Value", name: "normal_value", width: 120, align: "center"
                    , editable: { type: "text"}
            	},
            	{ header: "USL Value", name: "usl_value", width: 120, align: "center"
                    , editable: { type: "text"}
            	},
            	{ header: "LSL Value", name: "lsl_value", width: 120, align: "center"
                    , editable: { type: "text"}
            	},
            	{ header: "공차", name: "gap_value", width: 120, align: "center"
                    , editable: { type: "text"}
            	},
            	{ header: "종류", name: "qc_type", width: 150, align: "center"
                    , editable: { type: "text"}
            	}
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdData_대분류", offset: 8 },
                { type: "GRID", id: "grdData_중분류", offset: 8 },
				{ type: "GRID", id: "grdData_소분류", offset: 8 }
			]
        };
        //----------
        gw_com_module.objResize(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // go next.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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
        var args = {
            targetid: "lyrMenu",
            element: "조회",
            event: "click",
            handler: click_lyrMenu_조회
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu",
            element: "저장",
            event: "click",
            handler: click_lyrMenu_저장
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu",
            element: "닫기",
            event: "click",
            handler: click_lyrMenu_닫기
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_2",
            element: "추가",
            event: "click",
            handler: click_lyrMenu_2_추가
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_2",
            element: "삭제",
            event: "click",
            handler: click_lyrMenu_2_삭제
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_3",
            element: "추가",
            event: "click",
            handler: click_lyrMenu_3_추가
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_3",
            element: "삭제",
            event: "click",
            handler: click_lyrMenu_3_삭제
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_대분류",
            grid: true,
            event: "rowselecting",
            handler: rowselecting_grdData_대분류
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_대분류",
            grid: true,
            event: "rowselected",
            handler: rowselected_grdData_대분류
        };
        gw_com_module.eventBind(args);
        /*        //----------
        var args = {
        targetid: "grdData_중분류",
        grid: true,
        event: "rowselecting",
        handler: rowselecting_grdData_중분류
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
        targetid: "grdData_중분류",
        grid: true,
        event: "rowselected",
        handler: rowselected_grdData_중분류
        };
        gw_com_module.eventBind(args);
        */
        //----------
        var args = {
            targetid: "grdData_중분류",
            grid: true,
            event: "itemchanged",
            handler: itemchanged_grdData_중분류
        };
        //----------
        gw_com_module.eventBind(args);
        var args = { targetid: "grdData_중분류", grid: true,
            event: "itemdblclick", handler: itemdblclick_grdData_중분류
        };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_중분류", grid: true,
            event: "itemkeyenter", handler: itemdblclick_grdData_중분류
        };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_조회(ui) {

            v_global.process.handler = processRetrieve;

            if (!checkUpdatable({})) return;

            processRetrieve({});

        }
        //----------
        function click_lyrMenu_저장(ui) {

            processSave({});

        }
        //----------
        function click_lyrMenu_닫기(ui) {

            v_global.process.handler = processClose;

            if (!checkUpdatable({})) return;

            processClose({});

        }
        //----------
        function click_lyrMenu_2_추가(ui) {

            if (!checkManipulate({})) return;

            v_global.process.handler = processInsert;

            if (!checkUpdatable({ sub: true })) return;

            processInsert({});

        }
        //----------
        function click_lyrMenu_2_삭제(ui) {

            if (!checkManipulate({})) return;

            v_global.process.handler = processRemove;

            checkRemovable({});

        }
        //----------
        function click_lyrMenu_3_추가(ui) {

            if (!checkManipulate({ sub: true })) return;

            var args = {
                targetid: "grdData_소분류",
                edit: true,
                data: [
                    { name: "qcitem_cd", value: gw_com_api.getValue("grdData_대분류", "selected", "dcode", true) }
                ]
            };
            gw_com_module.gridInsert(args);

        }
        //----------
        function click_lyrMenu_3_삭제(ui) {

            if (!checkManipulate({ sub: true })) return;

            v_global.process.handler = processRemove;

            checkRemovable({ detail: true });

        }
        //----------
        function rowselecting_grdData_대분류(ui) {

            v_global.process.handler = processSelect;
            v_global.process.current.master = ui.row;

            return checkUpdatable({});

        }
        //----------
        function rowselected_grdData_대분류(ui) {

            v_global.process.prev.master = ui.row;

            processLink({});

        };
        /*        //----------
        function rowselecting_grdData_중분류(ui) {

        v_global.process.handler = processSelect;
        v_global.process.current.sub = ui.row;

        //return checkUpdatable({ sub: true });

        }
        //----------
        function rowselected_grdData_중분류(ui) {

        v_global.process.prev.sub = ui.row;

        //processLink({ sub: true });

        };
        //----------
        */
        function itemchanged_grdData_중분류(ui) {

            switch (ui.element) {
                case "dcode":
                    /*{
                    ids = gw_com_api.getRowIDs("grdData_소분류");
                    $.each(ids, function () {
                    if (ui.value.prev
                    == gw_com_api.getValue("grdData_소분류", this, "rcode", true))
                    gw_com_api.setValue("grdData_소분류", this, "rcode", ui.value.current, true);
                    });
                    }*/
                    break;
            }
            return true;

        }
        //----------
        function itemdblclick_grdData_중분류(ui) {

            switch (ui.element) {
                case "supp_nm":
                    {
                        v_global.event.type = ui.type;
                        v_global.event.object = ui.object;
                        v_global.event.row = ui.row;
                        v_global.event.element = ui.element;
                        var args = { type: "PAGE", page: "DLG_SUPPLIER", title: "협력사 선택", width: 600, height: 450, open: true };
                        if (gw_com_module.dialoguePrepare(args) == false) {
                            var args = { page: "DLG_SUPPLIER",
                                param: { ID: gw_com_api.v_Stream.msg_selectSupplier }
                            };
                            gw_com_module.dialogueOpen(args);
                        }
                    }
                    break;
                case "part_no":
                    {
                        v_global.event.type = ui.type;
                        v_global.event.object = ui.object;
                        v_global.event.row = ui.row;
                        v_global.event.element = ui.element;
                        var args = { type: "PAGE", page: "w_find_part_qcm",
                            title: "부품 검색", width: 800, height: 460, open: true
                        };
                        if (gw_com_module.dialoguePrepare(args) == false) {
                            var args = { page: "w_find_part_qcm",
                                param: { ID: gw_com_api.v_Stream.msg_selectPart_QCM }
                            };
                            gw_com_module.dialogueOpen(args);
                        }
                    }
                    break;
            }
        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_module.startPage();
        //----------
        processRetrieve({});

    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
function checkCRUD(param) {

    //return gw_com_api.getCRUD("grdData_대분류", "selected", true);
    return true;

}
//----------
function checkManipulate(param) {

    if ((param.sub != true && gw_com_api.getSelectedRow("grdData_대분류") == null)
        || (param.sub && checkCRUD({}) == "none")) {
        gw_com_api.messageBox([
            { text: "NOMASTER" }
        ]);
        return false;
    }
    return true;

}
//----------
function checkUpdatable(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdData_중분류" },
            { type: "GRID", id: "grdData_소분류" }
		],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function checkRemovable(param) {

    var status = checkCRUD({});
    if (status == "initialize" || status == "create")
        processDelete({});
    else
        gw_com_api.messageBox([
            { text: "REMOVE" }
        ], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO", param);

}
//----------
function processRetrieve(param) {

    var args = {
        source: {
            type: "INLINE",
            argument: [
                {
                    name: "arg_part",
                    value: "QS"
                }
			]
        },
        target: [
			{ type: "GRID", id: "grdData_대분류", select: true }
		],
        clear: [
			{ type: "GRID", id: "grdData_중분류" },
			{ type: "GRID", id: "grdData_소분류" }
		],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {

    var args = {};
    if (param.sub) {
        return;
        args = {
            source: {
                type: "GRID", id: "grdData_중분류", row: "selected", block: true,
                element: [
		            { name: "part_no", argument: "arg_part_no" }
	            ],
                argument: [
                    { name: "arg_qcitem_cd", value: gw_com_api.getValue("grdData_대분류", "selected", "dcode", true) }
	            ]
            },
            target: [
	            { type: "GRID", id: "grdData_소분류", select: false }
            ],
            key: param.key
        };
    }
    else {
        args = {
            source: {
                type: "GRID", id: "grdData_대분류", row: "selected", block: true,
                element: [ { name: "dcode", argument: "arg_dcode" } ]
            },
            target: [
	            { type: "GRID", id: "grdData_중분류", select: true },
	            { type: "GRID", id: "grdData_소분류" }
            ],
            key: param.key
        };
    }
    gw_com_module.objRetrieve(args);

}
//----------
function processSelect(param) {

    if (param.sub)
        gw_com_api.selectRow("grdData_중분류", v_global.process.current.sub, true, false);
    else
        gw_com_api.selectRow("grdData_대분류", v_global.process.current.master, true, false);

}
//----------
function processInsert(param) {

    var args = {
        targetid: "grdData_중분류",
        edit: true,
        updatable: true,
        data: [
            { name: "hcode", value: gw_com_api.getValue("grdData_대분류", "selected", "dcode", true) }
        ]
    };
    gw_com_module.gridInsert(args);

}
//----------
function processDelete(param) {

    var args = {
        row: "selected",
        remove: true
    };
    if (param.detail) {
        args.targetid = "grdData_소분류";
    }
    else {
        args.targetid = "grdData_중분류";
        args.clear = [
            {
                type: "GRID",
                id: "grdData_소분류"
            }
        ];        
    }
    gw_com_module.gridDelete(args);

}
//----------
function processSave(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdData_중분류" },
			{ type: "GRID", id: "grdData_소분류" }
		]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args.url = "COM";
    args.handler = {
        success: successSave
    };
    gw_com_module.objSave(args);

}
//----------
function processRemove(param) {

    var args = {
        url: "COM",
        procedure: "PROC_DELETE_ISSUE_DIV",
        nomessage: true,
        input: [
            { name: "user", value: gw_com_module.v_Session.USR_ID, type: "varchar" },
            { name: "type", value: "QDM", type: "varchar" },
            { name: "hcode", value: gw_com_api.getValue((param.detail) ? "grdData_소분류" : "grdData_중분류", "selected", "hcode", true), type: "varchar" },
            { name: "dcode", value: gw_com_api.getValue((param.detail) ? "grdData_소분류" : "grdData_중분류", "selected", "dcode", true), type: "varchar" }
        ],
        output: [
            { name: "r_value", type: "int" },
            { name: "message", type: "varchar" }
        ],
        handler: {
            success: completeRemove,
            param: param
        }
    };
    gw_com_module.callProcedure(args);

}
//----------
function processRestore(param) {

    var args = {
        targetid: "grdData_중분류",
        row: v_global.process.prev.sub
    };
    gw_com_module.gridRestore(args);

}
//----------
function processClear(param) {

    var args = {
        target: [ { type: "GRID", id: "grdData_소분류" } ]
    };
    if (param.master) {
        args.target.unshift({ type: "GRID", id: "grdData_중분류" });
        args.target.unshift({ type: "GRID", id: "grdData_대분류" });
    }
    else if (param.sub)
        args.target.unshift({ type: "GRID", id: "grdData_중분류" });
    gw_com_module.objClear(args);

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
function completeRemove(response, param) {

    gw_com_api.messageBox([
        { text: response.VALUE[1] }
    ], 420, gw_com_api.v_Message.msg_informBatched, "ALERT",
    { handler: successRemove, response: response, param: param });

}
//----------
function successSave(response, param) {

    var status = checkCRUD({});
    if (status == "create" || status == "update")
        processLink({ key: response });
    else
        processLink({ sub: true, key: response });

}
//----------
function successRemove(response, param) {

    if (response.VALUE[0] != -1)
        processDelete(param);

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_resultMessage:
            {
                if (param.data.page != gw_com_api.getPageID())
                    break;
                switch (param.data.ID) {
                    case gw_com_api.v_Message.msg_confirmSave:
                        {
                            if (param.data.result == "YES")
                                processSave(param.data.arg);
                            else {
                                var status = checkCRUD({});
                                if (status == "initialize" || status == "create")
                                    processDelete({});
                                else if (status == "update")
                                    processRestore({});
                                if (v_global.process.handler != null)
                                    v_global.process.handler(param.data.arg);
                            }
                        }
                        break;
                    case gw_com_api.v_Message.msg_confirmRemove:
                        {
                            if (param.data.result == "YES")
                                processRemove(param.data.arg);
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
                    case gw_com_api.v_Message.msg_informBatched:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
			        case gw_com_api.v_Stream.msg_selectedSupplier:
			            {
			                gw_com_api.setValue(v_global.event.object,
						                        v_global.event.row,
						                        "supp_cd",
						                        param.data.supp_cd,
						                        (v_global.event.type == "GRID") ? true : false);
			                gw_com_api.setValue(v_global.event.object,
						                        v_global.event.row,
						                        "supp_nm",
						                        param.data.supp_nm,
						                        (v_global.event.type == "GRID") ? true : false);
			                closeDialogue({ page: param.from.page, focus: true });
			            }
			            break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_selectedPart_QCM:
            {
                if (v_global.event.element == "part_no") {
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, "part_no", param.data.part_cd,
			                            (v_global.event.type == "GRID") ? true : false);
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, "part_nm", param.data.part_nm,
			                            (v_global.event.type == "GRID") ? true : false);
                }
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedSupplier:
            {
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "supp_cd", param.data.supp_cd,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "supp_nm", param.data.supp_nm,
			                        (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = {
                    to: { type: "POPUP", page: param.from.page }
                };
                switch (param.from.page) {
                    case "w_find_part_qcm":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectPart_QCM;
                        }
                        break;
                }
                gw_com_module.streamInterface(args);
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                closeDialogue({ page: param.from.page });
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//