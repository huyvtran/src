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
				{ type: "PAGE", name: "DEPT_AREA_IN", query: "dddw_deptarea",
				    param: [{ argument: "arg_type", value: "ALL"}] },
				{ type: "PAGE", name: "DEPT_AUTH_IN", query: "dddw_deptarea_auth" },
                { type: "PAGE", name: "권한", query: "dddw_role" },
                { type: "PAGE", name: "부서", query: "dddw_dept" }
			],
            starter: start
        };
        gw_com_module.selectSet(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // go next.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function start() {

            // 조회용 Key
            v_global.data = {
                key: {
                    main: {},
                    sub: {}
                }
            };

            gw_job_process.UI();
            gw_job_process.procedure();
            gw_com_module.startPage();

            processRetrieve({});

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
            targetid: "lyrMenu_1", type: "FREE",
            element: [
				{ name: "추가", value: "추가" },
				{ name: "삭제", value: "삭제" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_2", type: "FREE",
            element: [
				{ name: "조회", value: "새로고침", act: true },
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
            targetid: "grdData_MAIN", query: "SYS_2080_1", title: "그룹 목록",
            height: 450, show: true, selectable: true, number: true, key: true,
            editable: { multi: true, bind: "select", focus: "list_id", validate: true },
            element: [
                {
                    header: "그룹ID", name: "list_id", width: 60, align: "center",
                    editable: { type: "text", validate: { rule: "required" }, bind: "create" }
                },
                {
                    header: "그룸명", name: "list_nm", width: 120,
                    editable: { type: "text" }
                },
                {
                    header: "사용", name: "use_yn", width: 40, align: "center",
                    format: { type: "checkbox", value: "1", offval: "0" },
                    editable: { type: "checkbox", value: "1", offval: "0" }
                }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_SUB", query: "SYS_2080_2", title: "목록",
            height: 450, show: true, selectable: true, number: true, key: true,
            editable: { multi: true, bind: "select", focus: "role_id", validate: true },
            element: [
                {
                    header: "이름", name: "name", width: 60, align: "center",
                    editable: { type: "text", validate: { rule: "required" }, bind: "create" }
                },
                {
                    header: "E-Mail", name: "email", width: 300,
                    editable: { type: "text", width: 462 }
                },
                {
                    header: "사용", name: "use_yn", width: 40, align: "center",
                    format: { type: "checkbox", value: "1", offval: "0" },
                    editable: { type: "checkbox", value: "1", offval: "0" }
                },
                {
                    header: "유형", name: "member_tp", width: 40, align: "center",
                    editable: { type: "hidden" }
                },
                { name: "list_id", editable: { type: "hidden" }, hidden: true },
                { name: "list_seq", editable: { type: "hidden" }, hidden: true },
                { name: "member_key", editable: { type: "hidden" }, hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdData_MAIN", offset: 8 },
                { type: "GRID", id: "grdData_SUB", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
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
        var args = { targetid: "lyrMenu_1", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "조회", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "저장", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_MAIN", grid: true, event: "rowselected", handler: processRetrieve };
        gw_com_module.eventBind(args);

    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function processButton(param) {

    switch (param.element) {
        case "조회":
            v_global.process.handler = processRetrieve;
            if (!checkUpdatable({})) return false;
            processRetrieve({});
            break;
        case "추가":
            if (param.object == "lyrMenu_2") {
                openPopup(param);
            }
            break;
        case "삭제":
            processDelete(param);
            break;
        case "저장":
            closeOption({});
            processSave({});
            break;
        case "닫기":
            checkClosable({});
            break;
    }

}
//----------
function checkUpdatable(param) {

    closeOption({});

    var args = {
        check: param.check,
        target: [
            { type: "GRID", id: "grdData_MAIN" },
            { type: "GRID", id: "grdData_SUB" }
        ]
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function checkClosable(param) {

    closeOption({});

    v_global.process.handler = processClose;

    if (!checkUpdatable({})) return;

    processClose({});

}
//----------
function processRetrieve(param) {

    var args;

    if (param.object == "grdData_MAIN") {
        args = {
            source: {
                type: param.type, id: param.object, row: "selected",
                element: [
                    { name: "list_id", argument: "arg_list_id" }
                ],
                argument: [
                    { name: "arg_use_yn", value: "%" }
                ]
            },
            target: [
		        { type: "GRID", id: "grdData_SUB", select: true }
            ],
            key: v_global.data.key.sub,
            handler: {
                complete: processRetrieveEnd,
                param: { sub: true }
            }
        };

    } else {
        args = {
            target: [
		        { type: "GRID", id: "grdData_MAIN", select: true }
            ],
            clear: [
                { type: "GRID", id: "grdData_SUB" }
            ],
            key: v_global.data.key.main,
            handler: {
                complete: processRetrieveEnd,
                param: { main: true }
            }
        };
    }
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {

    if (param.main)
        v_global.data.key.main = {};
    else
        v_global.data.key.sub = {};

}
//----------
function processInsert(param) {

    var args = {
        targetid: "grdData_목록",
        edit: true
    };
    if (gw_com_api.getRowCount("grdData_목록") > 1)
        args.data = [
            { name: "prod_type", rule: "COPY", row: "prev" },
            { name: "prod_type_nm", rule: "COPY", row: "prev" },
            { name: "cust_cd", rule: "COPY", row: "prev" },
            { name: "cust_nm", rule: "COPY", row: "prev" },
            { name: "cust_proc", rule: "COPY", row: "prev" },
            { name: "cust_proc_nm", rule: "COPY", row: "prev" },
            { name: "part_cd", rule: "COPY", row: "prev" },
            { name: "supp_cd", rule: "COPY", row: "prev" },
            { name: "supp_nm", rule: "COPY", row: "prev" }
        ];
    else
        args.data = [
            { name: "prod_type", value: gw_com_api.getValue("frmOption", 1, "prod_type") },
            { name: "prod_type_nm", value: gw_com_api.getText("frmOption", 1, "prod_type") },
            { name: "cust_cd", value: gw_com_api.getValue("frmOption", 1, "cust_cd") },
            { name: "cust_nm", value: gw_com_api.getText("frmOption", 1, "cust_cd") },
            { name: "cust_proc", value: gw_com_api.getValue("frmOption", 1, "cust_proc") },
            { name: "cust_proc_nm", value: gw_com_api.getText("frmOption", 1, "cust_proc") }
        ];
    var row = gw_com_module.gridInsert(args);
    itemdblclick_grdData_목록({
        type: "GRID",
        object: "grdData_목록",
        row: row,
        element: "part_cd"
    });

}
//----------
function processDelete(param) {

    var args;
    if (param.object == "lyrMenu_2") {
        var args = { targetid: "grdData_SUB", row: "selected", select: true }
    } else {
        return;
    }
    gw_com_module.gridDelete(args);

}
//----------
function processSave(param) {

    var args = {
        target: [
			{ type: "GRID", id: "grdData_MAIN" },
            { type: "GRID", id: "grdData_SUB" }
		]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    //args.url = "COM";
    args.handler = {
        success: successSave
    };
    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    v_global.data.key = {
        main: [{
            QUERY: "SYS_2080_1",
            KEY: [
                { NAME: "list_id", VALUE: gw_com_api.getValue("grdData_MAIN", "selected", "list_id", true) }
            ]
        }],
        sub: [{
            QUERY: "SYS_2080_2",
            KEY: [
                { NAME: "list_id", VALUE: gw_com_api.getValue("grdData_SUB", "selected", "list_id", true) },
                { NAME: "list_seq", VALUE: gw_com_api.getValue("grdData_SUB", "selected", "list_seq", true) }
            ]
        }]
    };

    processRetrieve({});

}
//----------
function processClear(param) {

    var args = {
        target: [
            {
                type: "GRID",
                id: "grdData_목록"
            }
        ]
    };
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
function openPopup(param) {

    // Check
    if (!checkUpdatable({ check: true })) return false;

    // Parameter 설정
    v_global.logic.param = {
        dept_nm: gw_com_module.v_Session.DEPT_NM,
        key: [gw_com_module.v_Session.EMP_NO],
        height: 200,
        multi: true
    };

    var page = "w_find_emp";
    var title = "사원 검색";
    var width = 600;
    var height = 350;
    var locate = ["center", "top"];

    // Prepare File Upload Window
    var args = {
        type: "PAGE", page: page, title: title,
        width: width, height: height, open: true, locate: locate
    }; //

    if (gw_com_module.dialoguePrepare(args) == false) {
        var args = {
            page: page,
            param: {
                ID: gw_com_api.v_Stream.msg_openedDialogue,
                data: v_global.logic.param
            }
        };
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
                                if (v_global.process.handler != null)
                                    v_global.process.handler({});
                            }
                        }
                        break;
                    case gw_com_api.v_Message.msg_informSaved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
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
                    case "w_find_emp":
                        args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                        args.data = v_global.logic.param;
                        break;
                }
                gw_com_module.streamInterface(args);
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                switch (param.from.page) {
                    case "w_find_emp":
                        if (param.data != undefined) {
                            var list_id = gw_com_api.getValue("grdData_MAIN", "selected", "list_id", true);
                            var rows = [];
                            $.each(param.data, function () {
                                if (gw_com_api.getFindRow("grdData_SUB", "member_key", this.emp_no) == -1) {
                                    rows.push({
                                        list_id: list_id,
                                        member_key: this.emp_no,
                                        name: this.emp_nm,
                                        email: this.email,
                                        use_yn: "1",
                                        member_tp: "EMP"
                                    });
                                }
                            });

                            if (rows.length > 0) {
                                var args = {
                                    targetid: "grdData_SUB", edit: true, updatable: true,
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
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
