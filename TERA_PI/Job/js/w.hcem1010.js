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
                    type: "INLINE", name: "구분",
                    data: [
                        { title: "현재", value: "1" },
                        { title: "이전", value: "2" }
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
                    name: "ERP",
                    value: "ERP고객정보 연동",
                    icon: "실행"
                },
				{
				    name: "조회",
				    value: "조회",
				    act: true
				},
				{
				    name: "추가",
				    value: "추가"
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
            targetid: "lyrMenu_2",
            type: "FREE",
            element: [
				{
				    name: "추가",
				    value: "추가"
				},
				{
				    name: "삭제",
				    value: "삭제"
				}
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption",
            type: "FREE",
            title: "조회 조건",
            trans: true,
            border: true,
            margin: 235,
            show: true,
            editable: {
                bind: "open",
                focus: "cust_name",
                validate: true
            },
            remark: "lyrRemark",
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "cust_name",
                                label: {
                                    title: "고객사 :"
                                },
                                editable: {
                                    type: "text",
                                    size: 18,
                                    maxlength: 50
                                }
                            }
				        ]
                    },
                    {
                        align: "right",
                        element: [
				            {
				                name: "실행",
				                value: "실행",
				                act: true,
				                format: {
				                    type: "button"
				                }
				            },
				            {
				                name: "취소",
				                value: "취소",
				                format: {
				                    type: "button",
				                    icon: "닫기"
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
            targetid: "grdData_현황",
            query: "w_hcem1010_M_1",
            title: "고객사 목록",
            caption: true,
            width: 337,
            height: 425,
            show: true,
            selectable: true,
            element: [
				{
				    header: "코드",
				    name: "cust_cd",
				    width: 70,
				    align: "center"
				},
				{
				    header: "고객사명",
				    name: "cust_name",
				    width: 240,
				    align: "left"
				}
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_현황",
            query: "w_hcem1010_S_1",
            type: "TABLE",
            title: "고객사 정보",
            caption: true,
            show: true,
            selectable: true,
            editable: {
                bind: "select",
                focus: "biz_no",
                validate: true
            },
            content: {
                width: {
                    label: 80,
                    field: 190
                },
                height: 25,
                row: [
                    {
                        element: [
                            {
                                header: true,
                                value: "코드",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "cust_cd",
                                editable: {
                                    type: "hidden"
                                }
                            },
                            {
                                header: true,
                                value: "사업자번호",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "biz_no",
                                mask: "biz-no",
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
                                value: "고객사명",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                style: { colspan: 3 },
                                name: "cust_name",
                                format: { type: "text", width: 460 },
                                editable: {
                                    type: "text",
                                    width: 460,
                                    validate: { rule: "required", message: "고객사명" }
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "업태",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "business_cond",
                                editable: {
                                    type: "text"
                                }
                            },
                            {
                                header: true,
                                value: "종목",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "business_type",
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
                                value: "대표자",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "ceo_name",
                                editable: {
                                    type: "text"
                                }
                            },
                            {
                                header: true,
                                value: "우편번호",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "zip_code",
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
                                value: "주소",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                style: { colspan: 3 },
                                name: "address",
                                format: { type: "text", width: 460 },
                                editable: {
                                    type: "text",
                                    width: 460
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "전화번호",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "phone_no",
                                editable: {
                                    type: "text"
                                }
                            },
                            {
                                header: true,
                                value: "팩스번호",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "fax_no",
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
                                style: { colspan: 3 },
                                name: "rmk",
                                format: {
                                    type: "textarea",
                                    rows: 5,
                                    width: 460
                                },
                                editable: {
                                    type: "textarea",
                                    rows: 5,
                                    width: 460
                                }
                            },
                            {
                                name: "cust_div",
                                hidden: true
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
            targetid: "grdData_내역",
            query: "w_hcem1010_D_1",
            title: "관계자 정보",
            caption: true,
            height: "164",
            pager: false,
            show: true,
            selectable: true,
            number: true,
            editable: {
                multi: true,
                bind: "select",
                focus: "work_role",
                validate: true
            },
            element: [
                {
                    header: "담당업무",
                    name: "work_role",
                    width: 100,
                    align: "center",
                    editable: {
                        type: "text"
                    }
                },
				{
				    header: "구분",
				    name: "work_div",
				    width: 60,
				    align: "center",
				    format: {
				        type: "select",
				        data: { memory: "구분" }
				    },
				    editable: {
				        type: "select",
				        data: { memory: "구분" }
				    }
				},
				{
				    header: "성명",
				    name: "name",
				    width: 70,
				    align: "center",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "성명"
				        }
				    }
				},
				{
				    header: "전화",
				    name: "phone",
				    width: 100,
				    align: "center",
				    editable: {
				        type: "text"
				    }
				},
				{
				    header: "휴대전화",
				    name: "hphone",
				    width: 100,
				    align: "center",
				    editable: {
				        type: "text"
				    }
				},
				{
				    header: "이메일",
				    name: "email",
				    width: 200,
				    align: "left",
				    editable: {
				        type: "text"
				    }
				},
				{
				    header: "비고",
				    name: "rmk",
				    width: 400,
				    align: "left",
				    editable: {
				        type: "text"
				    }
				},
				{
				    name: "seq",
				    hidden: true,
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    name: "cust_cd",
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
				    type: "FORM",
				    id: "frmData_현황",
				    offset: 8
				},
				{
				    type: "GRID",
				    id: "grdData_내역",
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
            targetid: "lyrMenu_1",
            element: "ERP",
            event: "click",
            handler: click_lyrMenu_1_ERP
        };
        gw_com_module.eventBind(args);
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
            targetid: "frmOption",
            element: "실행",
            event: "click",
            handler: click_frmOption_실행
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption",
            element: "취소",
            event: "click",
            handler: click_frmOption_취소
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_현황",
            grid: true,
            event: "rowselecting",
            handler: rowselecting_grdData_현황
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_현황",
            grid: true,
            event: "rowselected",
            handler: rowselected_grdData_현황
        };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_1_ERP(ui) {

            v_global.process.handler = checkBatchable;

            if (!checkUpdatable({})) return false;

            checkBatchable({});

        }
        //----------
        function click_lyrMenu_1_조회(ui) {

            var args = {
                target: [
					{
					    id: "frmOption",
					    focus: true
					}
				]
            };
            gw_com_module.objToggle(args);

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

            closeOption({});

            processSave({});

        }
        //----------
        function click_lyrMenu_1_닫기(ui) {

            checkClosable({});

        }
        //----------
        function click_lyrMenu_2_추가(ui) {

            if (!checkManipulate()) return;

            var args = {
                targetid: "grdData_내역",
                edit: true
            };
            gw_com_module.gridInsert(args);

        }
        //----------
        function click_lyrMenu_2_삭제(ui) {

            if (!checkManipulate()) return;

            var args = {
                targetid: "grdData_내역",
                row: "selected"
            }
            gw_com_module.gridDelete(args);

        }
        //---------
        function click_frmOption_실행(ui) {

            v_global.process.handler = processRetrieve;

            if (!checkUpdatable({})) return false;

            processRetrieve({});

        }
        //----------
        function click_frmOption_취소(ui) {

            closeOption({});

        }
        //----------
        function rowselecting_grdData_현황(ui) {

            v_global.process.handler = processSelect;
            v_global.process.current.master = ui.row;

            return checkUpdatable({});

        }
        //----------
        function rowselected_grdData_현황(ui) {

            v_global.process.prev.master = ui.row;

            processLink({});

        };

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
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
function checkCRUD(param) {

    return gw_com_api.getCRUD("frmData_현황");

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
            {
                type: "FORM",
                id: "frmData_현황"
            },
			{
			    type: "GRID",
			    id: "grdData_내역"
			}
		]
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
            { text: "DELETE" }
        ], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO");

}
//----------
function checkBatchable(param) {

    closeOption({});

    gw_com_api.messageBox([
            { text: "ERP 신규 고객 정보를 업데이트합니다. 계속 하시겠습니까?" }
        ], 500, gw_com_api.v_Message.msg_confirmBatch, "YESNO");

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

    var args = {
        target: [
	        {
	            type: "FORM",
	            id: "frmOption"
	        }
        ]
    };
    if (gw_com_module.objValidate(args) == false) {
        processClear({ master: true });
        return false;
    }

    if (param.key != undefined) {
        $.each(param.key, function () {
            if (this.QUERY == "w_hcem1010_S_1")
                this.QUERY = "w_hcem1010_M_1";
        });
    }
    var args = {
        source: {
            type: "FORM",
            id: "frmOption",
            hide: true,
            element: [
                {
                    name: "cust_name",
                    argument: "arg_cust_name"
                }
			],
            remark: [
		        {
		            element: [{ name: "cust_name"}]
		        }
		    ]
        },
        target: [
            {
                type: "GRID",
                id: "grdData_현황",
                select: true
            }
        ],
        clear: [
            {
                type: "FORM",
                id: "frmData_현황"
            },
			{
			    type: "GRID",
			    id: "grdData_내역"
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
            id: "grdData_현황",
            row: "selected",
            block: true,
            element: [
				{
				    name: "cust_cd",
				    argument: "arg_cust_cd"
				}
			]
        },
        target: [
            {
                type: "FORM",
                id: "frmData_현황"
            },
            {
                type: "GRID",
                id: "grdData_내역"
            }
		],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processSelect(param) {

    gw_com_api.selectRow("grdData_현황", v_global.process.current.master, true, false);

}
//----------
function processInsert(param) {

    gw_com_api.selectRow("grdData_현황", "reset");
    var args = {
        targetid: "frmData_현황",
        edit: true,
        updatable: true,
        data: [
            { name: "cust_div", value: "1" }
        ],
        clear: [
		    {
		        type: "GRID",
		        id: "grdData_내역"
		    }
	    ]
    };
    gw_com_module.formInsert(args);

}
//----------
function processDelete(param) {

    var args = {
        targetid: "grdData_현황",
        row: "selected",
        clear: [
            {
                type: "FORM",
                id: "frmData_현황"
            },
            {
                type: "GRID",
                id: "grdData_내역"
            }
        ]
    };
    gw_com_module.gridDelete(args);

}
//----------
function processSave(param) {

    var args = {
        target: [
            {
                type: "FORM",
                id: "frmData_현황"
            },
			{
			    type: "GRID",
			    id: "grdData_내역"
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
        procedure: "PROC_EST_CUST_DELETE",
        nomessage: true,
        input: [
            { name: "cust_cd", value: gw_com_api.getValue("grdData_현황", "selected", "cust_cd", true), type: "varchar" },
            { name: "user", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
        ],
        output: [
            { name: "r_value", type: "int" },
            { name: "message", type: "varchar" }
        ],
        handler: {
            success: completeRemove
        }
    };
    gw_com_module.callProcedure(args);

}
//----------
function processBatch(param) {

    var args = {
        url: "COM",
        procedure: "PROC_GATHER_CUST",
        nomessage: true,
        input: [
            { name: "user", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
        ],
        output: [
            { name: "r_value", type: "int" },
            { name: "message", type: "varchar" }
        ],
        handler: {
            success: completeBatch
        }
    };
    gw_com_module.callProcedure(args);

}
//----------
function processClear(param) {

    var args = {
        target: [
            {
                type: "FORM",
                id: "frmData_현황"
            },
            {
                type: "GRID",
                id: "grdData_내역"
            }
        ]
    };
    if (param.master)
        args.target.unshift({
            type: "GRID",
            id: "grdData_현황"
        });
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
function successSave(response, param) {

    var status = checkCRUD({});
    if (status == "create" || status == "update")
        processRetrieve({ key: response });
    else
        processLink({ key: response });

}
//----------
function completeRemove(response, param) {

    gw_com_api.messageBox([
        { text: response.VALUE[1] }
    ], 420, gw_com_api.v_Message.msg_informBatched, "ALERT",
    { handler: successRemove, response: response });

}
//----------
function successRemove(response, param) {

    if (response.VALUE[0] != -1)
        processDelete({});

}
//----------
function completeBatch(response, param) {

    gw_com_api.messageBox([
        { text: response.VALUE[1] }
    ], 350, gw_com_api.v_Message.msg_informBatched, "ALERT",
    { handler: successBatch, response: response });

}
//----------
function successBatch(response, param) {

    if (response.VALUE[0] != -1) {
        processRetrieve({});
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
                    case gw_com_api.v_Message.msg_confirmRemove:
                        {
                            if (param.data.result == "YES")
                                processRemove({});
                        }
                        break;
                    case gw_com_api.v_Message.msg_confirmBatch:
                        {
                            if (param.data.result == "YES")
                                processBatch({});
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