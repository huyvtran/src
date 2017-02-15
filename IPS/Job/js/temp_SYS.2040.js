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
                    type: "INLINE", name: "레벨",
                    data: [
						{ title: "레벨 1", value: "1" },
						{ title: "레벨 2", value: "2" },
						{ title: "레벨 3", value: "3" },
                    	{ title: "레벨 4", value: "4" }
                    ]
                }
            ],
            starter: start
        };
        //gw_com_module.selectSet(args);
        start();

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
            //  { name: "실행", value: "실행" },
				{ name: "조회", value: "조회" },//, act: true },
                { name: "야옹", value: "야옹" },
            //  { name: "추가", value: "추가" },
            //  { name: "삭제", value: "삭제" },
			//	{ name: "저장", value: "저장" },
				{ name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, show: true, border: true, margin: 220,
            editable: { focus: "menu_nm", validate: true },
            remark: "lyrRemark",
            content: {
                row: [
                    {
                        element: [
				            {
				                name: "menu_nm", label: { title: "메뉴명 :" },
				                editable: { type: "text", size: 20, maxlength: 50 }
				            }
                        ]
                    },
                    {
                        align: "right",
                        element: [
				            { name: "실행", value: "실행", act: true, format: { type: "button" } },
				            { name: "취소", value: "취소", format: { type: "button", icon: "닫기" } }
                        ]
                    }
                ]
            }
        };
        //----------
        //gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_메뉴", query: "SYS_2040_M_1", title: "메뉴 목록",
            //caption: true,
            width: 422, height: 417, show: true, selectable: true,
            element: [
				{ header: "메뉴명", name: "menu_nm", width: 270, align: "left" },
				//{ header: "순번", name: "sort_seq", width: 60, align: "center" },
				{
				    header: "사용", name: "use_yn", width: 60, align: "center",
				    format: { type: "checkbox", title: "", value: "1", offval: "0" }
				},
				{ name: "menu_id", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_상세", query: "SYS_2040_S_1", type: "TABLE", title: "메뉴 정보",
            height: 25, caption: true, show: true, selectable: true,
            editable: { bind: "select", focus: "menu_id", validate: true },
            content: { width: { label: 70, field: 150 },
                row: [
                    {
                        element: [
                            { header: true, value: "메뉴ID", format: { type: "label" } },
                            { name: "menu_id", editable: { type: "text", validate: { rule: "required", message: "메뉴ID" } } },
                            { header: true, value: "오브젝트ID", format: { type: "label" } },
                            { name: "obj_id", editable: { type: "text" } },
                            { header: true, value: "상위메뉴ID", format: { type: "label" } },
                            { name: "menu_pid", editable: { type: "text" } }
                        ]
                    }/*,
                    {
                        element: [
                            { header: true, value: "메뉴명", format: { type: "label" } },
                            {
                                style: { colspan: 3 }, name: "menu_nm", format: { type: "text", width: 380 },
                                editable: { type: "text", width: 380, validate: { rule: "required", message: "메뉴명" } }
                            },
                            { header: true, value: "Arguments", format: { type: "label" } },
                            { name: "menu_args", editable: { type: "text" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "순번", format: { type: "label" } },
                            { name: "sort_seq", editable: { type: "text" } },
                            { header: true, value: "레벨", format: { type: "label" } },
                            { name: "level_no", format: { type: "select", data: { memory: "레벨" } } },
                            { header: true, value: "사용", format: { type: "label" } },
                            {
                                name: "use_yn",
                                format: { type: "checkbox", title: "", value: "1", offval: "0" },
                                editable: { type: "checkbox", title: "", value: "1", offval: "0" }
                            }
                        ]
                    }*/
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_권한", query: "SYS_2040_S_2", title: "권한 정보", //caption: true,
            height: 310, show: true, selectable: true,
            editable: { multi: true, bind: "select", focus: "ret_yn", validate: true },
            element: [
                { header: "코드", name: "role_id", width: 60, align: "center" },
				//{ header: "권한명칭", name: "role_nm", width: 180, align: "left" },
				{
				    header: "허용", name: "ret_yn", width: 80, align: "center",
				    format: { type: "checkbox", title: "", value: "1", offval: "0" },
				    editable: { type: "checkbox", title: "", value: "1", offval: "0" }
				},
				{ name: "role_id", hidden: true, editable: { type: "hidden" } },
				{ name: "menu_id", hidden: true, editable: { type: "hidden" } }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "FORM", id: "frmData_상세", offset: 8 },
				{ type: "GRID", id: "grdData_권한", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        //----------
        gw_com_module.informSize();

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // go next.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_job_process.procedure();
        //----------

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
        var args = { targetid: "lyrMenu", element: "실행", event: "click", handler: click_lyrMenu_실행 };
        //gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "조회", event: "click", };//handler: click_lyrMenu_조회 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "추가", event: "click", handler: click_lyrMenu_추가 };
        //gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "삭제", event: "click", handler: click_lyrMenu_삭제 };
        //gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: click_lyrMenu_저장 };
        //gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: click_lyrMenu_닫기 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: click_frmOption_실행 };
        //gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: click_frmOption_취소 };
        //gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_메뉴", grid: true, event: "rowselecting", handler: rowselecting_grdData_메뉴 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_메뉴", grid: true, event: "rowselected", handler: rowselected_grdData_메뉴 };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_실행() {

            closeOption({});

            v_global.process.handler = processLaunch;

            if (!checkUpdatable({})) return;

            processLaunch({});

        }
        //----------
        /*function click_lyrMenu_조회() {

            var args = {
                target: [
					{ id: "frmOption", focus: true }
                ]
            };
            gw_com_module.objToggle(args);

        }*/
        //----------
        function click_lyrMenu_추가(ui) {

            v_global.process.handler = processInsert;

            if (!checkUpdatable({})) return;

            processInsert({});

        }
        //----------
        function click_lyrMenu_삭제(ui) {

            v_global.process.handler = processRemove;

            if (!checkManipulate({})) return;

            checkRemovable({});

        }
        //----------
        function click_lyrMenu_저장(ui) {

            closeOption({});

            processSave({});

        }
        //----------
        function click_lyrMenu_닫기(ui) {

            checkClosable({});

        }
        //----------
        function click_frmOption_실행(ui) {

            v_global.process.handler = processRetrieve;

            if (!checkUpdatable({})) return;

            processRetrieve({});

        }
        //----------
        function click_frmOption_취소(ui) {

            closeOption({});

        }
        //----------
        function rowselecting_grdData_메뉴(ui) {

            v_global.process.handler = processSelect;
            v_global.process.current.master = ui.row;

            return checkUpdatable({});

        }
        //----------
        function rowselected_grdData_메뉴(ui) {

            v_global.process.prev.master = ui.row;

            processLink({});

        };

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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
/*function checkCRUD(param) {

    return gw_com_api.getCRUD("frmData_상세");

}
//----------
function checkManipulate(param) {

    closeOption({});

    if (checkCRUD({}) == "none") {
        gw_com_api.messageBox([
            { text: "NOMASTER" }
        ]);
        return false;
    }
    return true;

}
//----------
function checkUpdatable(param) {

    closeOption({});

    var args = {
        target: [
            { type: "FORM", id: "frmData_상세" },
            { type: "GRID", id: "grdData_권한" }
        ],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function checkRemovable(param) {

    closeOption({});

    var status = checkCRUD({});
    if (status == "initialize" || status == "create")
        processClear({});
    else
        gw_com_api.messageBox([
            { text: "REMOVE" }
        ], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO");

}*/
//----------
function checkClosable(param) {

    closeOption({});

    v_global.process.handler = processClose;

    if (!checkUpdatable({})) return;

    processClose({});

}
//----------
/*function processRetrieve(param) {

    var args = {
        target: [
	        { type: "FORM", id: "frmOption" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) {
        processClear({ master: true });
        return false;
    }

    if (param.key != undefined) {
        $.each(param.key, function () {
            if (this.QUERY == "SYS_2040_S_1")
                this.QUERY = "SYS_2040_M_1";
        });
    }
    var args = {
        source: {
            type: "FORM",
            id: "frmOption",
            hide: true,
            element: [
				{
				    name: "menu_nm",
				    argument: "arg_menu_nm"
				}
            ],
            remark: [
		        {
		            element: [{ name: "menu_nm" }]
		        }
            ]
        },
        target: [
			{
			    type: "GRID",
			    id: "grdData_메뉴",
			    select: true
			}
        ],
        clear: [
            {
                type: "FORM",
                id: "frmData_상세"
            },
			{
			    type: "GRID",
			    id: "grdData_권한"
			}
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {

    var args = {
        source: {
            type: "GRID",
            id: "grdData_메뉴",
            row: "selected",
            block: true,
            element: [
                {
                    name: "menu_id",
                    argument: "arg_menu_id"
                }
            ]
        },
        target: [
            {
                type: "FORM",
                id: "frmData_상세",
                edit: true
            },
			{
			    type: "GRID",
			    id: "grdData_권한",
			    select: true
			}
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processSelect(param) {

    gw_com_api.selectRow("grdData_메뉴", v_global.process.current.master, true, false);

}
//----------
function processInsert(param) {

    gw_com_api.selectRow("grdData_메뉴", "reset");
    var args = {
        targetid: "frmData_상세",
        edit: true,
        updatable: true,
        data: [
                { name: "use_yn", value: "1" }
        ],
        clear: [
		        {
		            type: "GRID",
		            id: "grdData_권한"
		        }
        ]
    };
    gw_com_module.formInsert(args);

}
//----------
function processDelete(param) {

    var args = {
        targetid: "grdData_메뉴", row: "selected", remove: true,
        clear: [
            { type: "FORM", id: "frmData_상세" },
            { type: "GRID", id: "grdData_권한" }
        ]
    };
    gw_com_module.gridDelete(args);

}
//----------
function processSave(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_상세" },
			{ type: "GRID", id: "grdData_권한" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args.url = "COM";
    args.handler = {
        success: successSave,
        param: param
    };
    gw_com_module.objSave(args);

}
//----------
function processRemove(param) {

    var args = {
        url: "COM",
        target: [
		    {
		        type: "FORM", id: "frmData_상세",
		        key: { element: [{ name: "menu_id" }] }
		    }
        ],
        handler: {
            success: successRemove
        }
    };
    gw_com_module.objRemove(args);

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_상세" },
            { type: "GRID", id: "grdData_권한" }
        ]
    };
    if (param.master) {
        args.target.unshift({
            type: "GRID",
            id: "grdData_메뉴"
        });
    }
    gw_com_module.objClear(args);

}
//----------*/
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closePage
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
/*function successSave(response, param) {

    var master = false;
    var query = $("#frmData_상세").attr("query");

    $.each(response, function () {
        if (this.QUERY == query) master = true;
    });
    
    if (master)
        processRetrieve({ key: response });
    else
        processLink({ key: response });

}
//----------
function successRemove(response, param) {

    processDelete({});

}
//----------
function processLaunch(param) {

    if (gw_com_api.getSelectedRow("grdData_메뉴") < 1) return;
    var obj_id = gw_com_api.getValue("frmData_상세", 1, "obj_id");
    var menu_nm = gw_com_api.getValue("frmData_상세", 1, "menu_nm");
    var menu_args = gw_com_api.getValue("frmData_상세", 1, "menu_args");
    if (obj_id == "" || obj_id == undefined || obj_id == "undefinded") return;

    var args = {
        ID: gw_com_api.v_Stream.msg_linkPage,
        to: { type: "MAIN" },
        data: {
            page: obj_id,
            title: menu_nm,
            param: [
                { name: "args", value: menu_args }
            ]
        }
    };
    gw_com_module.streamInterface(args);

}*/
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
                    param.to = {
                        type: "POPUP",
                        page: param.data.page
                    };
                    gw_com_module.streamInterface(param);
                    break;
                }
                switch (param.data.ID) {
                    case gw_com_api.v_Message.msg_confirmSave:
                        {
                            if (param.data.result == "YES")
                                processSave({});
                            else {
                                var status = checkCRUD({});
                                if (status == "initialize" || status == "create")
                                    processClear({});
                                if (v_global.process.handler != null)
                                    v_global.process.handler({});
                            }
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
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                closeDialogue({ page: param.from.page });
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//