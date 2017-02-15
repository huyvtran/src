//------------------------------------------
// Process about Job Process.
//                Created by Professor.X, GoodWare (2011.04)
//------------------------------------------

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var v_global = {
    event: {
        type: null,
        object: null,
        row: null,
        element: null
    },
    process: {
        param: null,
        entry: null,
        act: null,
        handler: null,
        current: {},
        prev: {}
    },
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
            targetid: "lyrMenu_1",
            type: "FREE",
            element: [
				{
				    name: "조회",
				    value: "조회",
				    act: true
				},
				{
				    name: "추가",
				    value: "대분류추가"
				},
				{
				    name: "삭제",
				    value: "대분류삭제"
				},
				{
				    name: "저장",
				    value: "저장"
				},
				{
				    name: "닫기",
				    value: "닫기"
				}
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_2",
            type: "FREE",
            element: [
				{
				    name: "추가",
				    value: "중분류추가"
				},
				{
				    name: "삭제",
				    value: "중분류삭제"
				}
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_3",
            type: "FREE",
            element: [
				{
				    name: "추가",
				    value: "소분류추가"
				},
				{
				    name: "삭제",
				    value: "소분류삭제"
				}
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_대분류",
            query: "w_hcem1020_M_1",
            title: "대분류",
            caption: true,
            height: 155,
            width: 342,
            show: true,
            selectable: true,
            editable: {
                master: true,
                bind: "select",
                focus: "model_class_cd1",
                validate: true
            },
            element: [
				{
				    header: "코드",
				    name: "model_class_cd1",
				    width: 60,
				    align: "center",
				    editable: {
				        bind: "create",
				        type: "text",
				        maxlength: 3,
				        validate: {
				            rule: "required",
				            message: "코드"
				        }
				    }
				},
                {
                    header: "대분류명",
                    name: "model_type_nm",
                    width: 200,
                    align: "left",
                    editable: {
                        type: "text",                        
                        validate: {
                            rule: "required",
                            message: "대분류명"
                        }
                    }
                },
                {
                    header: "순번",
                    name: "sort_num",
                    width: 50,
                    align: "center",
                    editable: {
                        type: "text"
                    }
                },
                {
                    name: "model_tnm",
                    hidden: true,
                    editable: {
                        type: "hidden"
                    }
                },
                {
                    name: "model_class_cd2",
                    hidden: true,
                    editable: {
                        type: "hidden"
                    }
                },
                {
                    name: "model_class_cd3",
                    hidden: true,
                    editable: {
                        type: "hidden"
                    }
                },
                {
                    name: "model_class_key",
                    hidden: true,
                    editable: {
                        type: "hidden"
                    }
                }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_중분류",
            query: "w_hcem1020_S_1",
            title: "중분류",
            caption: true,
            width: 342,
            height: 168,
            show: true,
            selectable: true,
            key: true,
            editable: {
                master: true,
                multi: true,
                bind: "select",
                focus: "model_class_cd2",
                validate: true
            },
            element: [
				{
				    header: "코드",
				    name: "model_class_cd2",
				    width: 60,
				    align: "center",
				    editable: {
				        bind: "create",
				        type: "text",
				        maxlength: 3,
				        validate: {
				            rule: "required",
				            message: "코드"
				        }
				    }
				},
				{
				    header: "중분류명",
				    name: "model_type_nm",
				    width: 200,
				    align: "left",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "중분류명"
				        }
				    }
				},
				{
				    header: "순번",
				    name: "sort_num",
				    width: 50,
				    align: "center",
				    editable: {
				        type: "text"
				    }
				},
                {
                    name: "model_tnm",
                    hidden: true,
                    editable: {
                        type: "hidden"
                    }
                },
                {
                    name: "model_class_cd1",
                    hidden: true,
                    editable: {
                        type: "hidden"
                    }
                },
                {
                    name: "model_class_cd3",
                    hidden: true,
                    editable: {
                        type: "hidden"
                    }
                },
                {
                    name: "model_class_key",
                    hidden: true,
                    editable: {
                        type: "hidden"
                    }
                }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_소분류",
            query: "w_hcem1020_S_2",
            title: "소분류",
            caption: true,
            height: 402,
            show: true,
            selectable: true,
            editable: {
                multi: true,
                bind: "select",
                focus: "model_class_cd3",
                validate: true
            },
            element: [
				{
				    header: "코드",
				    name: "model_class_cd3",
				    width: 60,
				    align: "center",
				    editable: {
				        bind: "create",
				        type: "text",
				        maxlength: 3,
				        validate: {
				            rule: "required",
				            message: "코드"
				        }
				    }
				},
				{
				    header: "소분류명",
				    name: "model_type_nm",
				    width: 200,
				    align: "left",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "소분류명"
				        }
				    }
				},
				{
				    header: "표시명칭",
				    name: "model_tnm",
				    width: 230,
				    align: "left",
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    header: "순번",
				    name: "sort_num",
				    width: 50,
				    align: "center",
				    editable: {
				        type: "text"
				    }
				},
                {
                    name: "model_class_cd1",
                    hidden: true,
                    editable: {
                        type: "hidden"
                    }
                },
                {
                    name: "model_class_cd2",
                    hidden: true,
                    editable: {
                        type: "hidden"
                    }
                },
                {
                    name: "model_class_key",
                    hidden: true,
                    editable: {
                        type: "hidden"
                    }
                }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
				{
				    type: "GRID",
				    id: "grdData_소분류",
				    offset: 8
				}
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
            targetid: "lyrMenu_1",
            element: "조회",
            event: "click",
            handler: click_lyrMenu_1_조회
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_1",
            element: "추가",
            event: "click",
            handler: click_lyrMenu_1_추가
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_1",
            element: "삭제",
            event: "click",
            handler: click_lyrMenu_1_삭제
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_1",
            element: "저장",
            event: "click",
            handler: click_lyrMenu_1_저장
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_1",
            element: "닫기",
            event: "click",
            handler: click_lyrMenu_1_닫기
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
        //----------
        var args = {
            targetid: "grdData_대분류",
            grid: true,
            event: "itemchanged",
            handler: itemchanged_grdData_대분류
        };
        gw_com_module.eventBind(args);
        //----------
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
        //----------
        var args = {
            targetid: "grdData_중분류",
            grid: true,
            event: "itemchanged",
            handler: itemchanged_grdData_중분류
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_소분류",
            grid: true,
            event: "itemchanged",
            handler: itemchanged_grdData_소분류
        };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_1_조회(ui) {

            v_global.process.handler = processRetrieve;

            if (!checkUpdatable({})) return;

            processRetrieve({});

        }
        //----------
        function click_lyrMenu_1_추가(ui) {

            v_global.process.handler = processInsert;

            if (!checkUpdatable({})) return;

            processInsert({});

        }
        //----------
        function click_lyrMenu_1_삭제(ui) {

            if (!checkManipulate({})) return;

            v_global.process.handler = processRemove;

            checkRemovable({});

        }
        //----------
        function click_lyrMenu_1_저장(ui) {

            processSave({});

        }
        //----------
        function click_lyrMenu_1_닫기(ui) {

            checkClosable({});

        }
        //----------
        function click_lyrMenu_2_추가(ui) {

            if (!checkManipulate({})) return;

            v_global.process.handler = processInsert;

            if (!checkUpdatable({ sub: true })) return;

            processInsert({ sub: true });

        }
        //----------
        function click_lyrMenu_2_삭제(ui) {

            if (!checkManipulate({ sub: true })) return;

            v_global.process.handler = processRemove;

            checkRemovable({ sub: true });

        }
        //----------
        function click_lyrMenu_3_추가(ui) {

            if (!checkManipulate({ sub: true })) return;

            var args = {
                targetid: "grdData_소분류",
                edit: true,
                data: [
                    { name: "model_class_cd1", value: gw_com_api.getValue("grdData_중분류", "selected", "model_class_cd1", true) },
                    { name: "model_class_cd2", value: gw_com_api.getValue("grdData_중분류", "selected", "model_class_cd2", true) }
                ]
            };
            gw_com_module.gridInsert(args);

        }
        //----------
        function click_lyrMenu_3_삭제(ui) {

            if (!checkManipulate({ detail: true })) return;

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
        //----------
        function itemchanged_grdData_대분류(ui) {

            switch (ui.element) {
                case "model_class_cd1":
                    {
                        var ids = gw_com_api.getRowIDs("grdData_중분류");
                        $.each(ids, function () {
                            if (ui.value.prev
                                == gw_com_api.getValue("grdData_중분류", this, "model_class_cd1", true))
                                gw_com_api.setValue("grdData_중분류", this, "model_class_cd1", ui.value.current, true);
                        });
                        ids = gw_com_api.getRowIDs("grdData_소분류");
                        $.each(ids, function () {
                            if (ui.value.prev
                                == gw_com_api.getValue("grdData_소분류", this, "model_class_cd1", true))
                                gw_com_api.setValue("grdData_소분류", this, "model_class_cd1", ui.value.current, true);
                        });
                    }
                    break;
                case "model_type_nm":
                    {
                        gw_com_api.setCellValue(
                            ui.type,
                            ui.object,
                            ui.row,
                            "model_tnm",
                            ui.value.current
                        );
                    }
                    break;
            }
            return true;

        }
        //----------
        function rowselecting_grdData_중분류(ui) {

            v_global.process.handler = processSelect;
            v_global.process.current.sub = ui.row;

            return checkUpdatable({ sub: true });

        }
        //----------
        function rowselected_grdData_중분류(ui) {

            v_global.process.prev.sub = ui.row;

            processLink({ sub: true });

        };
        //----------
        function itemchanged_grdData_중분류(ui) {

            switch (ui.element) {
                case "model_class_cd2":
                    {
                        ids = gw_com_api.getRowIDs("grdData_소분류");
                        $.each(ids, function () {
                            if (ui.value.prev
                                == gw_com_api.getValue("grdData_소분류", this, "model_class_cd2", true))
                                gw_com_api.setValue("grdData_소분류", this, "model_class_cd2", ui.value.current, true);
                        });
                    }
                    break;
                case "model_type_nm":
                    {
                        gw_com_api.setCellValue(
                            ui.type,
                            ui.object,
                            ui.row,
                            "model_tnm",
                            gw_com_api.getValue("grdData_대분류", "selected", "model_type_nm", true) + " : " +
                            ui.value.current
                        );
                    }
                    break;
            }
            return true;

        }
        //----------
        function itemchanged_grdData_소분류(ui) {

            switch (ui.element) {
                case "model_type_nm":
                    {
                        gw_com_api.setValue(
                            ui.object,
                            ui.row,
                            "model_tnm",
                            gw_com_api.getValue("grdData_대분류", "selected", "model_type_nm", true) + " : " +
                            gw_com_api.getValue("grdData_중분류", "selected", "model_type_nm", true) + " : " +
                            ui.value.current,
                            true,
                            true
                        );
                    }
                    break;
            }
            return true;

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

    return (param.detail)
            ? gw_com_api.getCRUD("grdData_소분류", "selected", true)
            : (param.sub)
                ? gw_com_api.getCRUD("grdData_중분류", "selected", true)
                : gw_com_api.getCRUD("grdData_대분류", "selected", true);

}
//----------
function checkManipulate(param) {

    if (checkCRUD(param) == "none") {
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
			{
			    type: "GRID",
			    id: "grdData_대분류",
			    refer: (param.sub) ? true : false
			},
			{
			    type: "GRID",
			    id: "grdData_중분류",
			    refer: (param.sub) ? true : false
			},
            {
                type: "GRID",
                id: "grdData_소분류"
            }
		],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function checkRemovable(param) {

    var status = checkCRUD(param);
    if (status == "initialize" || status == "create")
        processDelete(param);
    else
        gw_com_api.messageBox([
            { text: "DELETE" }
        ], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO", param);

}
//----------
function processRetrieve(param) {

    var args = {
        target: [
			{
			    type: "GRID",
			    id: "grdData_대분류",
			    select: true
			}
		],
        clear: [
			{
			    type: "GRID",
			    id: "grdData_중분류"
			},
			{
			    type: "GRID",
			    id: "grdData_소분류"
			}
		],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {

    var args = {};
    if (param.sub) {
        args = {
            source: {
                type: "GRID",
                id: "grdData_중분류",
                row: "selected",
                block: true,
                element: [
		            {
		                name: "model_class_cd1",
		                argument: "argModel_class_cd1"
		            },
                    {
                        name: "model_class_cd2",
                        argument: "argModel_class_cd2"
                    }
	            ]
            },
            target: [
	            {
	                type: "GRID",
	                id: "grdData_소분류"
	            }
            ],
            key: param.key
        };
    }
    else {
        args = {
            source: {
                type: "GRID",
                id: "grdData_대분류",
                row: "selected",
                block: true,
                element: [
		            {
		                name: "model_class_cd1",
		                argument: "argModel_class_cd1"
		            }
	            ]
            },
            target: [
	            {
	                type: "GRID",
	                id: "grdData_중분류",
	                select: true
	            }
            ],
            clear: [
	            {
	                type: "GRID",
	                id: "grdData_소분류"
	            }
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

    var args = {};
    if (param.sub) {
        args = {
            targetid: "grdData_중분류",
            edit: true,
            updatable: true,
            data: [
                { name: "model_class_cd1", value: gw_com_api.getValue("grdData_대분류", "selected", "model_class_cd1", true) },
                { name: "model_class_cd3", value: "00" }
            ],
            clear: [
                {
                    type: "GRID",
                    id: "grdData_소분류"
                }
		    ]
        };
    }
    else {
        args = {
            targetid: "grdData_대분류",
            edit: true,
            updatable: true,
            data: [
                { name: "model_class_cd2", value: "00" },
                { name: "model_class_cd3", value: "00" }
            ],
            clear: [
                {
                    type: "GRID",
                    id: "grdData_중분류"
                },
                {
                    type: "GRID",
                    id: "grdData_소분류"
                }
		    ]
        };
    }
    gw_com_module.gridInsert(args);

}
//----------
function processDelete(param) {

    var args = {};
    if (param.detail) {
        args = {
            targetid: "grdData_소분류",
            row: "selected",
            remove: true
        };
    }
    else if (param.sub) {
        args = {
            targetid: "grdData_중분류",
            row: "selected",
            remove: true,
            clear: [
                {
                    type: "GRID",
                    id: "grdData_소분류"
                }
            ]
        };
    }
    else {
        args = {
            targetid: "grdData_대분류",
            row: "selected",
            remove: true,
            clear: [
                {
                    type: "GRID",
                    id: "grdData_중분류"
                },
                {
                    type: "GRID",
                    id: "grdData_소분류"
                }
            ]
        };
    }
    gw_com_module.gridDelete(args);

}
//----------
function processSave(param) {

    var args = {
        target: [
			{
			    type: "GRID",
			    id: "grdData_대분류"
			},
			{
			    type: "GRID",
			    id: "grdData_중분류"
			},
			{
			    type: "GRID",
			    id: "grdData_소분류"
			}
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
function processRemove(param) {

    var target = (param.detail)
                    ? "grdData_소분류"
                    : (param.sub)
                        ? "grdData_중분류" : "grdData_대분류";
    var args = {
        url: "COM",
        procedure: "PROC_MODEL_CLASS_DELETE",
        nomessage: true,
        input: [
            { name: "model_class1", value: gw_com_api.getValue(target, "selected", "model_class_cd1", true), type: "varchar" },
            { name: "model_class2", value: gw_com_api.getValue(target, "selected", "model_class_cd2", true), type: "varchar" },
            { name: "model_class3", value: gw_com_api.getValue(target, "selected", "model_class_cd3", true), type: "varchar" },
            { name: "user", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
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

    var args = {};
    if (param.sub) {
        args = {
            targetid: "grdData_중분류",
            row: v_global.process.prev.sub
        };
    }
    else {
        args = {
            targetid: "grdData_대분류",
            row: v_global.process.prev.master
        };
    }
    gw_com_module.gridRestore(args);

}
//----------
function processClear(param) {

    var args = {
        target: [
            {
                type: "GRID",
                id: "grdData_소분류"
            }
        ]
    };
    if (param.sub)
        args.target.unshift({
            type: "GRID",
            id: "grdData_중분류"
        });
    if (param.master) {
        args.target.unshift({
            type: "GRID",
            id: "grdData_중분류"
        });
        args.target.unshift({
            type: "GRID",
            id: "grdData_대분류"
        });
    }
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
function successSave(response, param) {

    var status = checkCRUD({});
    if (status == "create" || status == "update")
        processRetrieve({ key: response });
    else {
        status = checkCRUD({ sub: true });
        if (status == "create" || status == "update")
            processLink({ key: response });
        else
            processLink({ sub: true, key: response });
    }

}
//----------
function completeRemove(response, param) {

    gw_com_api.messageBox([
        { text: response.VALUE[1] }
    ], 430, gw_com_api.v_Message.msg_informBatched, "ALERT",
    { handler: successRemove, response: response, param: param });

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
                                var status = checkCRUD(param.data.arg);
                                if (status == "initialize" || status == "create")
                                    processDelete(param.data.arg);
                                else if (status == "update") {
                                    processRestore(param.data.arg);
                                    if (param.data.arg.sub && checkCRUD({}) == "retrieve") {
                                        processLink({});
                                        return;
                                    }
                                }
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
                }
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//