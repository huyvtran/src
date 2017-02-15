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
                    type: "INLINE", name: "기간",
                    data: [
			            { title: "요청일자", value: "RQ" },
			            { title: "제출일자", value: "IS" }
		            ]
                },
                {
                    type: "PAGE", name: "진행상태", query: "dddw_est_stat"
                },
				{
				    type: "PAGE", name: "수주결과", query: "dddw_order_result"
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
            border: true,
            show: true,
            editable: {
                focus: "ymd_fr",
                validate: true
            },
            remark: "lyrRemark",
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "date_tp",
                                value: "",
                                label: {
                                    title: "기간 :"
                                },
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "기간"
                                    }
                                }
                            },
				            {
				                style: {
				                    colfloat: "floating"
				                },
				                name: "ymd_fr",
				                mask: "date-ymd",
				                editable: {
				                    type: "text",
				                    size: 7,
				                    maxlength: 10
				                }
				            },
				            {
				                name: "ymd_to",
				                label: {
				                    title: "~"
				                },
				                mask: "date-ymd",
				                editable: {
				                    type: "text",
				                    size: 7,
				                    maxlength: 10
				                }
				            },
                            {
                                name: "submit_empnm",
                                label: {
                                    title: "담당자 :"
                                },
                                editable: {
                                    type: "text",
                                    size: 7,
                                    maxlength: 10
                                }
                            }
				        ]
                    },
                    {
                        element: [
                            {
                                name: "est_nm",
                                label: {
                                    title: "견적명 :"
                                },
                                editable: {
                                    type: "text",
                                    size: 20,
                                    maxlength: 50
                                }
                            },
                            {
                                name: "cust_nm",
                                label: {
                                    title: "고객사 :"
                                },
                                mask: "search",
                                editable: {
                                    type: "text",
                                    size: 16,
                                    maxlength: 50
                                }
                            }
				        ]
                    },
                    {
                        element: [
                            {
                                name: "est_stat",
                                label: {
                                    title: "진행상태 :"
                                },
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "진행상태",
                                        unshift: [
				                            { title: "전체", value: "%" }
				                        ]
                                    }
                                }
                            },
                            {
                                name: "order_result",
                                label: {
                                    title: "수주결과 :"
                                },
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "수주결과",
                                        unshift: [
				                            { title: "전체", value: "%" }
				                        ]
                                    }
                                }
                            },
		     	            {
		     	                name: "revision_yn",
		     	                value: "1",
		     	                title: "최종차수",
		     	                label: {
		     	                    title: "최종차수 :"
		     	                },
		     	                editable: {
		     	                    type: "checkbox",
		     	                    value: 1,
		     	                    offval: 0
		     	                }
		     	            },
				            {
				                name: "cust_cd",
				                hidden: true
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
            query: "w_hcem3040_M_1",
            title: "견적 진행 현황",
            height: 442,
            show: true,
            selectable: true,
            key: true,
            number: true,
            element: [
				{
				    header: "구분",
				    name: "use_div",
				    width: 50,
				    align: "center"
				},
				{
				    header: "고객사",
				    name: "cust_nm",
				    width: 200,
				    align: "left"
				},
				{
				    header: "요청일자",
				    name: "receipt_ymd",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    header: "견적명",
				    name: "est_nm",
				    width: 250,
				    align: "left"
				},
				{
				    header: "진행상태",
				    name: "est_stat",
				    width: 60,
				    align: "center"
				},
				{
				    header: "결재상태",
				    name: "gw_status",
				    width: 60,
				    align: "center"
				},
				{
				    header: "제출일자",
				    name: "submit_dt",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    header: "담당자",
				    name: "submit_empnm",
				    width: 70,
				    align: "center"
				},
				{
				    header: "견적금액",
				    name: "est_amt",
				    width: 100,
				    align: "right",
				    mask: "numeric-float"
				},
				{
				    header: "최종NEGO금액",
				    name: "final_amt",
				    width: 100,
				    align: "right",
				    mask: "numeric-float"
				},
				{
				    header: "수주결과",
				    name: "order_result",
				    width: 60,
				    align: "center"
				},
				{
				    header: "수주금액",
				    name: "order_amt",
				    width: 100,
				    align: "right",
				    mask: "numeric-float"
				},
				{
				    header: "차수",
				    name: "revision",
				    width: 50,
				    align: "center"
				},
				{
				    name: "rpt_yn",
				    hidden: true
				},
				{
				    name: "est_key",
				    hidden: true
				}
			],
            subgrid: {
                query: "w_hcem3040_D_1",
                height: "100%",
                argument: [
			        { name: "est_key", argument: "arg_est_key" },
                    { name: "revision", argument: "arg_revision" }
			    ],
                element: [
				    {
				        header: "제품분류",
				        name: "model_nm",
				        width: 250,
				        align: "left"
				    },
				    {
				        header: "수량",
				        name: "model_qty",
				        width: 40,
				        align: "center",
				        mask: "numeric-int"
				    },
				    {
				        header: "견적금액",
				        name: "est_amt",
				        width: 100,
				        align: "right",
				        mask: "numeric-float"
				    },
				    {
				        header: "NEGO율(%)",
				        name: "nego_rate",
				        width: 80,
				        align: "center",
				        mask: "numeric-float"
				    },
				    {
				        header: "NEGO금액",
				        name: "nego_amt",
				        width: 100,
				        align: "right",
				        mask: "numeric-float"
				    },
				    {
				        header: "재료비(%)",
				        name: "mat_rate",
				        width: 80,
				        align: "center",
				        mask: "numeric-float"
				    },
				    {
				        header: "자재금액",
				        name: "mat_amt",
				        width: 100,
				        align: "right",
				        mask: "numeric-float"
				    },
				    {
				        header: "비고",
				        name: "rmk",
				        width: 400,
				        align: "left"
				    }
			    ]
            }
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
				{
				    type: "GRID",
				    id: "grdData_현황",
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
            element: "조회",
            event: "click",
            handler: click_lyrMenu_조회
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
            targetid: "frmOption",
            event: "itemdblclick",
            handler: itemdblclick_frmOption
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption",
            event: "itemkeyenter",
            handler: itemdblclick_frmOption
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_현황",
            grid: true,
            event: "rowdblclick",
            handler: rowdblclick_grdData_현황
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_현황",
            grid: true,
            event: "rowkeyenter",
            handler: rowdblclick_grdData_현황
        };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_조회() {

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
        function click_lyrMenu_닫기(ui) {

            processClose({});

        }
        //----------
        function click_frmOption_실행(ui) {

            processRetrieve({});

        }
        //----------
        function click_frmOption_취소(ui) {

            closeOption({});

        }
        //----------
        function itemdblclick_frmOption(ui) {

            switch (ui.element) {
                case "cust_nm":
                    {
                        v_global.event.type = ui.type;
                        v_global.event.object = ui.object;
                        v_global.event.row = ui.row;
                        v_global.event.element = ui.element;
                        var args = {
                            type: "PAGE",
                            page: "w_find_cust_info",
                            title: "고객사 검색",
                            width: 700,
                            height: 460,
                            locate: ["center", "top"],
                            open: true
                        };
                        if (gw_com_module.dialoguePrepare(args) == false) {
                            var args = {
                                page: "w_find_cust_info",
                                param: {
                                    ID: gw_com_api.v_Stream.msg_selectCusromer/*,
                                    data: {
                                        cust_name: gw_com_api.getValue(ui.object, ui.row, ui.element)
                                    }*/
                                }
                            };
                            gw_com_module.dialogueOpen(args);
                        }
                    }
                    break;
            }

        }
        //----------
        function rowdblclick_grdData_현황(ui) {

            if (gw_com_api.getValue("grdData_현황", "selected", "rpt_yn", true) == 0) {
                gw_com_api.messageBox([
                    { text: "종합 실행 집계표가 생성되지 않았습니다." }
                ]);
                return;
            }

            var args = {
                type: "PAGE",
                page: "w_find_est_summary",
                title: "종합 실행 집계",
                width: 800,
                height: 520,
                scroll: true,
                open: true
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = {
                    page: "w_find_est_summary",
                    param: {
                        ID: gw_com_api.v_Stream.msg_infoEstimateSummary,
                        data: {
                            est_nm: gw_com_api.getValue("grdData_현황", "selected", "est_nm", true),
                            est_key: gw_com_api.getValue("grdData_현황", "selected", "est_key", true),
                            revision: gw_com_api.getValue("grdData_현황", "selected", "revision", true)
                        }
                    }
                };
                gw_com_module.dialogueOpen(args);
            }

        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        if (v_global.process.param != "") {
            gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getPageParameter("ymd_fr"));
            gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getPageParameter("ymd_to"));
            gw_com_api.setValue("frmOption", 1, "cust_cd", gw_com_api.getPageParameter("cust_cd"));
            gw_com_api.setValue("frmOption", 1, "submit_empnm", gw_com_api.getPageParameter("submit_empnm"));
            gw_com_api.setValue("frmOption", 1, "est_stat", gw_com_api.getPageParameter("est_stat"));
            gw_com_api.setValue("frmOption", 1, "order_result", gw_com_api.getPageParameter("order_result"));
        }
        else {
            gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -3 }));
            gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate(""));
        }
        //----------
        gw_com_module.startPage();
        //----------
        if (v_global.process.param != "")
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
function processRetrieve(param) {

    var args = {
        target: [
	        {
	            type: "FORM",
	            id: "frmOption"
	        }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    var args = {
        source: {
            type: "FORM",
            id: "frmOption",
            hide: true,
            element: [
				{
				    name: "est_nm",
				    argument: "arg_est_nm"
				},
				{
				    name: "cust_nm",
				    argument: "arg_cust_nm"
				},
				{
				    name: "date_tp",
				    argument: "arg_date_tp"
				},
				{
				    name: "ymd_fr",
				    argument: "arg_ymd_fr"
				},
				{
				    name: "ymd_to",
				    argument: "arg_ymd_to"
				},
				{
				    name: "submit_empnm",
				    argument: "arg_submit_empnm"
				},
				{
				    name: "est_stat",
				    argument: "arg_est_stat"
				},
				{
				    name: "order_result",
				    argument: "arg_order_result"
				},
				{
				    name: "revision_yn",
				    argument: "arg_revision_yn"
				}
			],
            remark: [
		        {
		            element: [{ name: "date_tp"}]
		        },
                {
                    infix: "~",
                    element: [
	                    { name: "ymd_fr" },
		                { name: "ymd_to" }
		            ]
                },
	            {
	                element: [{ name: "est_nm"}]
	            },
		        {
		            element: [{ name: "cust_nm"}]
		        },
		        {
		            element: [{ name: "submit_empnm"}]
		        },
		        {
		            element: [{ name: "est_stat"}]
		        },
		        {
		            element: [{ name: "order_result"}]
		        },
		        {
		            element: [{ name: "revision_yn"}]
		        }
		    ]
        },
        target: [
			{
			    type: "GRID",
			    id: "grdData_현황",
			    select: true,
			    focus: true
			}
		],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

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
                if (param.data.page != gw_com_api.getPageID())
                    break;
            }
            break;
        case gw_com_api.v_Stream.msg_selectedCustomer:
            {
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "cust_cd",
			                        param.data.cust_cd,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "cust_nm",
			                        param.data.cust_name,
			                        (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = {
                    to: {
                        type: "POPUP",
                        page: param.from.page
                    }
                };
                switch (param.from.page) {
                    case "w_find_cust_info":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectCusromer;
                            /*
                            args.data = {
                            cust_name: gw_com_api.getValue(
                            v_global.event.object,
                            v_global.event.row,
                            v_global.event.element,
                            (v_global.event.type == "GRID") ? true : false)
                            };
                            */
                        }
                        break;
                    case "w_find_est_summary":
                        {
                            args.ID = gw_com_api.v_Stream.msg_infoEstimateSummary;
                            args.data = {
                                est_nm: gw_com_api.getValue("grdData_현황", "selected", "est_nm", true),
                                est_key: gw_com_api.getValue("grdData_현황", "selected", "est_key", true),
                                revision: gw_com_api.getValue("grdData_현황", "selected", "revision", true)
                            };
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