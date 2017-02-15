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

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set data.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        var args = {
            request: [
                {
                    type: "PAGE",
                    name: "화폐",
                    query: "dddw_mat_monetary_unit"
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
				{
				    name: "조회",
				    value: "조회",
				    act: true
				},
				{
				    name: "저장",
				    value: "저장"
				},
				{
				    name: "삭제",
				    value: "삭제"
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
            targetid: "frmOption",
            type: "FREE",
            trans: true,
            border: false,
            show: true,
            align: "left",
            editable: {
                bind: "open",
                focus: "mat_cd",
                validate: true
            },
            content: {
                row: [
                    {
                        element: [
				            {
				                name: "mat_cd",
				                label: {
				                    title: "품목코드 :"
				                },
				                editable: {
				                    type: "text",
				                    size: 7,
				                    maxlength: 20
				                }
				            },
				            {
				                name: "실행",
				                act: true,
				                show: false,
				                format: {
				                    type: "button"
				                }
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
            targetid: "frmData_상세",
            query: "w_hcem1041_M_1",
            type: "TABLE",
            title: "임시 자재 관리",
            show: true,
            selectable: true,
            editable: {
                bind: "select",
                focus: "mat_nm",
                validate: true
            },
            content: {
                width: {
                    label: "90",
                    field: "220"
                },
                height: "25",
                row: [
                    {
                        element: [
                            {
                                header: true,
                                value: "품명",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "mat_nm",
                                editable: {
                                    type: "text",
                                    validate: {
                                        rule: "required",
                                        message: "품명"
                                    }
                                }
                            },
                            {
                                header: true,
                                value: "규격",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "mat_spec",
                                editable: {
                                    type: "text"
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "단위",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "mat_unit",
                                editable: {
                                    type: "text"
                                }
                            },
                            {
                                header: true,
                                value: "화폐(지급)",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "mat_monetary_unit",
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "화폐"
                                    },
                                    validate: {
                                        rule: "required",
                                        message: "화폐(지급)"
                                    }
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "단가",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "mat_price",
                                mask: "currency-float",
                                editable: {
                                    type: "text",
                                    validate: {
                                        rule: "required",
                                        message: "단가"
                                    }
                                }
                            },
                            {
                                header: true,
                                value: "거래업체",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "mat_maker",
                                editable: {
                                    type: "text"
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "특기사항",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                style: {
                                    colspan: 3
                                },
                                name: "rmk",
                                format: {
                                    type: "textarea",
                                    rows: 4,
                                    width: 520
                                },
                                editable: {
                                    type: "textarea",
                                    rows: 4,
                                    width: 520
                                }
                            },
                            {
                                name: "mat_categorize",
                                hidden: true,
                                editable: {
                                    type: "hidden"
                                }
                            },
                            {
                                name: "mat_part",
                                hidden: true,
                                editable: {
                                    type: "hidden"
                                }
                            },
                            {
                                name: "mat_cd",
                                hidden: true,
                                editable: {
                                    type: "hidden"
                                }
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
				{
				    type: "FORM",
				    id: "frmData_상세",
				    offset: 8
				}
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
            element: "삭제",
            event: "click",
            handler: click_lyrMenu_삭제
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
            targetid: "frmOption",
            element: "실행",
            event: "click",
            handler: click_frmOption_실행
        };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_조회(ui) {

            v_global.process.handler = processRetrieve;

            if (!checkUpdatable({})) return false;

            processRetrieve({});

        }
        //----------
        function click_lyrMenu_삭제(ui) {

            v_global.process.handler = processRemove;

            checkRemovable({});

        }
        //----------
        function click_lyrMenu_저장(ui) {

            processSave();

        }
        //----------
        function click_lyrMenu_닫기(ui) {

            checkClosable();

        }
        //----------
        function click_frmOption_실행(ui) {

            v_global.process.handler = processRetrieve;

            if (!checkUpdatable({})) return false;

            processRetrieve({});

        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_module.startPage();
        //----------
        var args = {
            ID: gw_com_api.v_Stream.msg_openedDialogue
        };
        gw_com_module.streamInterface(args);
        //----------
        v_global.logic.key = null;

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

    return gw_com_api.getCRUD("frmData_상세");

}
//----------
function checkUpdatable(param) {

    var args = {
        target: [
            {
                type: "FORM",
                id: "frmData_상세"
            }
		]
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function checkRemovable(param) {

    var status = checkCRUD({});
    if (status == "initialize" || status == "create")
        processClear({});
    else
        gw_com_api.messageBox([
            { text: "REMOVE" }
        ], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO");

}
//----------
function checkClosable(param) {

    v_global.process.handler = processClose;

    if (!checkUpdatable({})) return;

    processClose({});

}
//----------
function processRetrieve(param) {

    var args = {
        target: [
	        {
	            type: "FORM",
	            id: "frmOption"
	        }
        ]
    };
    if (gw_com_module.objValidate(args) == false) {
        processClear({});
        return false;
    }

    var args = {
        source: {
            type: "FORM",
            id: "frmOption",
            element: [
				{
				    name: "mat_cd",
				    argument: "arg_mat_cd"
				}
			],
            remark: [
		        {
		            element: [{ name: "mat_cd"}]
		        }
		    ]
        },
        target: [
			{
			    type: "FORM",
			    id: "frmData_상세"
			}
		],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processInsert(param) {

    var args = {
        targetid: "frmData_상세",
        edit: true,
        data: [
            { name: "mat_categorize", value: param.mat_categorize },
            { name: "mat_part", value: "1" },
            { name: "mat_ucost", value: "0" }
        ]
    };
    gw_com_module.formInsert(args);

}
//----------
function processSave(param) {

    var args = {
        target: [
			{
			    type: "FORM",
			    id: "frmData_상세"
			}
		]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args.handler = {
        success: successSave
    };
    gw_com_module.objSave(args);

}
//----------
function processRemove(param) {

    var args = {
        url: "COM",
        target: [
		    {
		        type: "FORM",
		        id: "frmData_상세",
		        key: {
		            element: [
		                { name: "mat_cd" }
		            ]
		        }
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
            {
                type: "FORM",
                id: "frmData_상세"
            }
        ]
    };
    gw_com_module.objClear(args);

}
//----------
function processClose(param) {

    processClear({});

    if (v_global.logic.key != null) {
        var args = {
            ID: gw_com_api.v_Stream.msg_retrieve,
            data: {
                key: v_global.logic.key
            }
        };
        gw_com_module.streamInterface(args);
    }
    v_global.logic.key = null;
    var args = {
        ID: gw_com_api.v_Stream.msg_closeDialogue
    };
    gw_com_module.streamInterface(args);

}
//----------
function successSave(response, param) {

    v_global.logic.key = response;

    gw_com_api.setValue("frmOption", 1, "mat_cd", response[0].KEY[0].VALUE);
    processRetrieve({});
}
//----------
function successRemove(response, param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_remove
    };
    gw_com_module.streamInterface(args);

    processClose({});

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_editMaterial:
            {
                if (param.data != undefined) {
                    if (param.data.mat_cd != undefined) {
                        gw_com_api.show("lyrMenu", "삭제");
                        gw_com_api.setValue("frmOption", 1, "mat_cd", param.data.mat_cd);
                        processRetrieve({});
                    }
                    else if (param.data.mat_categorize != undefined) {
                        gw_com_api.hide("lyrMenu", "삭제");
                        gw_com_api.setValue("frmOption", 1, "mat_cd", "");
                        processInsert({ mat_categorize: param.data.mat_categorize });
                    }
                }
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
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
