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
				    type: "PAGE", name: "제품유형", query: "dddw_prodtype"
				},
				{
				    type: "PAGE", name: "공정구분", query: "dddw_zcode",
				    param: [
				        { argument: "arg_hcode", value: "ISCM26" }
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
            targetid: "lyrMenu",
            type: "FREE",
            element: [
            /*
            {
            name: "EXCEL",
            value: "Excel 불러오기",
            icon: "기타"
            },*/
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
				    name: "삭제",
				    value: "삭제"
				},
				{
				    name: "저장",
				    value: "저장"
				},
                {
                    name: "복사",
                    value: "복사",
                    icon: "기타"
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
            title: "조회 조건",
            trans: true,
            show: true,
            border: true,
            margin: 90,
            editable: {
                bind: "open",
                focus: "prod_group",
                validate: true
            },
            remark: "lyrRemark",
            content: {
                row: [
                    {
                        element: [
				            {
				                name: "prod_type",
				                label: {
				                    title: "제품유형 :"
				                },
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "제품유형"
				                    }
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
            targetid: "grdData_목록",
            query: "w_mrp1030_M_1",
            title: "생산 공정 정보",
            height: "442",
            show: true,
            selectable: true,
            key: true,
            editable: {
                multi: true,
                bind: "select",
                focus: "req_qty",
                validate: true
            },
            element: [
				{
				    header: "공정구분",
				    name: "mprc_class",
				    width: 90,
				    align: "center",
				    format: {
				        type: "select",
				        data: {
				            memory: "공정구분"
				        }
				    },
				    editable: {
				        type: "select",
				        data: {
				            memory: "공정구분"
				        }
				    }
				}/*,
				{
				    header: "공정코드",
				    name: "mprc_cd",
				    width: 80,
				    align: "left",
				    editable: {
                        bind: "create",
				        type: "text"
				    }
				}*/,
				{
				    header: "공정코드",
				    name: "mprc_no",
				    width: 70,
				    align: "center",
				    editable: {
				        type: "text"
				    }
				},
				{
				    header: "공정명",
				    name: "mprc_nm",
				    width: 300,
				    align: "left",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "공정명"
				        }
				    }
				},
				{
				    header: "시간",
				    name: "mprc_term",
				    width: 50,
				    align: "center",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "시간"
				        }
				    }
				},
				{
				    header: "인원",
				    name: "mprc_persons",
				    width: 50,
				    align: "center",
				    mask: "numeric-int",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "인원"
				        }
				    }
				},
				{
				    header: "표준소요시간",
				    name: "mprc_times",
				    width: 80,
				    align: "center",
                    mask: "numeric-float",
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    header: "공정시작일",
				    name: "mprc_days",
				    width: 70,
				    align: "center",
                    mask: "numeric-int",
				    editable: {
				        type: "text"
				    }
				},
				{
				    header: "공정가중치",
				    name: "mprc_weight",
				    width: 70,
				    align: "center",
				    mask: "numeric-float"
				},
				{
				    header: "누적진행율",
				    name: "mprc_rate",
				    width: 70,
				    align: "center",
				    mask: "numeric-float"
				},
                {
                    name: "prod_group",
                    hidden: true,
                    editable: {
                        type: "hidden"
                    }
                },
                {
                    name: "prod_type",
                    hidden: true,
                    editable: {
                        type: "hidden"
                    }
                },
                {
                    name: "mprc_cd",
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
				    id: "grdData_목록",
				    offset: 8
				}
			]
        };
        //----------
        gw_com_module.objResize(args);
        //====================================================================================
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
            element: "EXCEL",
            event: "click",
            handler: click_lyrMenu_EXCEL
        };
        gw_com_module.eventBind(args);
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
            element: "추가",
            event: "click",
            handler: click_lyrMenu_추가
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
            element: "복사",
            event: "click",
            handler: click_lyrMenu_복사
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
            targetid: "grdData_목록",
            grid: true,
            event: "itemchanged",
            handler: itemchanged_grdData_목록
        };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_EXCEL() {

            alert("기능 테스트 중입니다. 잠시 기다려 주세요.");

        }
        //----------
        function click_lyrMenu_조회() {

            var args = {
                target: [
					{
					    id: "frmOption"
					}
				]
            };
            gw_com_module.objToggle(args);

        }
        //----------
        function click_lyrMenu_추가() {

            closeOption({});

            var args = {
                targetid: "grdData_목록",
                edit: true
            };
            gw_com_module.gridInsert(args);

        }
        //----------
        function click_lyrMenu_삭제() {

            closeOption({});

            var args = {
                targetid: "grdData_목록",
                row: "selected"
            }
            gw_com_module.gridDelete(args);

        }
        //----------
        function click_lyrMenu_저장() {

            closeOption({});

            processSave({});

        }
        //----------
        function click_lyrMenu_복사() {

            closeOption({});

            processCopy({});

        }
        //----------
        function click_lyrMenu_닫기(ui) {

            checkClosable({});

        }
        //----------
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
        function itemchanged_grdData_목록(ui) {

            switch (ui.element) {
                case "mprc_term":
                case "mprc_persons":
                    {
                        var term = parseFloat(gw_com_api.getCellValue(ui.type, ui.object, ui.row, "mprc_term"));
                        var persons = parseFloat(gw_com_api.getCellValue(ui.type, ui.object, ui.row, "mprc_persons"));
                        gw_com_api.setValue(ui.object, ui.row, "mprc_times", parseFloat(term * persons), true, true);
                    }
                    break;
            }
            return true;

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
function checkUpdatable(param) {

    closeOption({});

    var args = {
        target: [
			{
			    type: "GRID",
			    id: "grdData_목록"
			}
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
            hide: true,
            element: [
				{
				    name: "prod_type",
				    argument: "arg_prod_type"
				}
			],
			remark: [
		        {
		            element: [{ name: "prod_type"}]
		        }
		    ]
        },
        target: [
			{
			    type: "GRID",
			    id: "grdData_목록",
			    select: true
			}
		],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processSave(param) {

    var args = {
        target: [
			{
			    type: "GRID",
			    id: "grdData_목록"
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
function successSave(response, param) {

    processRetrieve({ key: response });

}
//----------
function processCopy(param) {

    var args = {
        type: "PAGE", page: "w_mrp1031", title: "공정 복사",
        width: 1100, height: 500, locate: ["center", "center"], open: true
    };
    if (gw_com_module.dialoguePrepare(args) == false) {
        var args = {
            page: "w_mrp1031",
            param: {
                ID: gw_com_api.v_Stream.msg_openedDialogue
            }
        };
        gw_com_module.dialogueOpen(args);
    }

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
                    case "w_mrp1031":
                        break;
                }
                gw_com_module.streamInterface(args);
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                switch (param.from.page) {
                    case "w_mrp1031":
                        if (param.data != undefined) {
                            gw_com_api.setValue("frmOption", 1, "prod_type", param.data.prod_type);
                            processRetrieve({});
                        }
                        break;
                }
                closeDialogue({ page: param.from.page });
            }
            break;
    }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//