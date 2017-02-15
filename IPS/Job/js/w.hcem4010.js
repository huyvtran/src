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
        gw_com_DX.register();
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
                    type: "INLINE", name: "분류",
                    data: [
			            { title: "담당자", value: "EM-EMP" },
			            { title: "고객사", value: "EM-CUST" }
		            ]
                },
                {
                    type: "INLINE", name: "구분",
                    data: [
						{ title: "진행상태", value: "2" },
						{ title: "수주결과", value: "3" }
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
				                style: {
				                    colfloat: "floating"
				                },
				                name: "ymd_fr",
				                label: {
				                    title: "제출일자 :"
				                },
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
				                name: "chart_1",
				                label: {
				                    title: "분류 :"
				                },
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "분류"
                                    }
                                }
				            },
				            {
				                name: "chart_2",
				                label: {
				                    title: "구분 :"
				                },
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "구분"
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
            targetid: "grdData_현황",
            query: "w_hcem4010_M_1",
            title: "분류별 통계",
            caption: true,
            width: 265,
            height: 280,
            pager: false,
            show: true,
            element: [
				{
				    header: "분류",
				    name: "category",
				    width: 180,
				    align: "left"
				},
				{
				    header: "건수",
				    name: "value",
				    width: 60,
				    align: "center",
				    mask: "numeric-int"
				},
				{
				    name: "rcode",
				    hidden: true
				},
				{
				    name: "ymd_fr",
				    hidden: true
				},
				{
				    name: "ymd_to",
				    hidden: true
				},
				{
				    name: "chart_1",
				    hidden: true
				},
				{
				    name: "chart_2",
				    hidden: true
				}
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_현황상세",
            query: "w_hcem4010_S_1",
            title: "구분별 통계",
            caption: true,
            width: 265,
            height: 92,
            pager: false,
            show: true,
            element: [
                {
                    header: "구분",
                    name: "category",
                    width: 180,
                    align: "center"
                },
				{
				    header: "건수",
				    name: "value",
				    width: 60,
				    align: "center",
				    mask: "numeric-int"
				},
				{
				    name: "rcode",
				    hidden: true
				},
				{
				    name: "ymd_fr",
				    hidden: true
				},
				{
				    name: "ymd_to",
				    hidden: true
				},
				{
				    name: "tp",
				    hidden: true
				},
				{
				    name: "chart_1",
				    hidden: true
				},
				{
				    name: "chart_2",
				    hidden: true
				}
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "lyrChart_통계",
            query: "w_hcem4010_M_1",
            show: true,
            control: {
                by: "DX",
                id: ctlChart_1
            }
        };
        //----------
        gw_com_module.chartCreate(args);
        //=====================================================================================
        var args = {
            targetid: "lyrChart_통계상세",
            query: "w_hcem4010_S_1",
            show: true,
            control: {
                by: "DX",
                id: ctlChart_2
            }
        };
        //----------
        gw_com_module.chartCreate(args);
        //=====================================================================================
        var args = {
            target: [
				{
				    type: "GRID",
				    id: "grdData_현황",
				    offset: 15,
				    min: true
				},
				{
				    type: "GRID",
				    id: "grdData_현황상세",
				    offset: 15,
				    min: true
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
            targetid: "grdData_현황",
            grid: true,
            event: "rowselected",
            handler: rowselected_grdData_현황
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
        //----------
        var args = {
            targetid: "grdData_현황상세",
            grid: true,
            event: "rowdblclick",
            handler: rowdblclick_grdData_현황상세
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_현황상세",
            grid: true,
            event: "rowkeyenter",
            handler: rowdblclick_grdData_현황상세
        };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_조회(ui) {

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
        function rowselected_grdData_현황(ui) {

            processLink({});

        };
        //----------
        function rowdblclick_grdData_현황(ui) {

            var args = {
                ID: gw_com_api.v_Stream.msg_linkPage,
                to: {
                    type: "MAIN"
                },
                data: {
                    page: "w_hcem3040",
                    title: "견적 진행 현황",
                    param: [
                        { name: "ymd_fr", value: gw_com_api.getValue("grdData_현황", "selected", "ymd_fr", true) },
                        { name: "ymd_to", value: gw_com_api.getValue("grdData_현황", "selected", "ymd_to", true) }
                    ]
                }
            };
            var chart = gw_com_api.getValue("grdData_현황", "selected", "chart_1", true);
            switch (chart) {
                case "EM-EMP":
                    {
                        args.data.param.push(
                            { name: "submit_empnm", value: gw_com_api.getValue("grdData_현황", "selected", "category", true) }
                        );
                    }
                    break;
                case "EM-CUST":
                    {
                        args.data.param.push(
                            { name: "cust_cd", value: gw_com_api.getValue("grdData_현황", "selected", "rcode", true) }
                        );
                    }
                    break;
            }
            gw_com_module.streamInterface(args);

        }
        //----------
        function rowdblclick_grdData_현황상세(ui) {

            var args = {
                ID: gw_com_api.v_Stream.msg_linkPage,
                to: {
                    type: "MAIN"
                },
                data: {
                    page: "w_hcem3040",
                    title: "견적 진행 현황",
                    param: [
                        { name: "ymd_fr", value: gw_com_api.getValue("grdData_현황", "selected", "ymd_fr", true) },
                        { name: "ymd_to", value: gw_com_api.getValue("grdData_현황", "selected", "ymd_to", true) }
                    ]
                }
            };
            var chart = gw_com_api.getValue("grdData_현황", "selected", "chart_1", true);
            switch (chart) {
                case "EM-EMP":
                    {
                        args.data.param.push(
                            { name: "submit_empnm", value: gw_com_api.getValue("grdData_현황", "selected", "category", true) }
                        );
                    }
                    break;
                case "EM-CUST":
                    {
                        args.data.param.push(
                            { name: "cust_cd", value: gw_com_api.getValue("grdData_현황", "selected", "rcode", true) }
                        );
                    }
                    break;
            }
            chart = gw_com_api.getValue("grdData_현황", "selected", "chart_2", true);
            switch (chart) {
                case "2":
                    {
                        args.data.param.push(
                            { name: "est_stat", value: gw_com_api.getValue("grdData_현황상세", "selected", "rcode", true) }
                        );
                    }
                    break;
                case "3":
                    {
                        args.data.param.push(
                            { name: "order_result", value: gw_com_api.getValue("grdData_현황", "selected", "rcode", true) }
                        );
                    }
                    break;
            }
            gw_com_module.streamInterface(args);

        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -3 }));
        gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate(""));
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
				    name: "ymd_fr",
				    argument: "arg_ymd_fr"
				},
				{
				    name: "ymd_to",
				    argument: "arg_ymd_to"
				},
                {
                    name: "chart_1",
                    argument: "arg_chart_1"
                },
                {
                    name: "chart_2",
                    argument: "arg_chart_2"
                }
			],
            remark: [
	            {
	                infix: "~",
	                element: [
	                    { name: "ymd_fr" },
		                { name: "ymd_to" }
		            ]
	            },
                {
                    element: [{ name: "chart_1"}]
                },
                {
                    element: [{ name: "chart_2"}]
                }
		    ]
        },
        target: [
			{
			    type: "GRID",
			    id: "grdData_현황"/*,
			    select: true*/
			},
			{
			    type: "CHART",
			    id: "lyrChart_통계"
			}
		],
        clear: [
			{
			    type: "GRID",
			    id: "grdData_현황상세"
			},
			{
			    type: "CHART",
			    id: "lyrChart_통계상세"
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
                    name: "ymd_fr",
                    argument: "arg_ymd_fr"
                },
				{
				    name: "ymd_to",
				    argument: "arg_ymd_to"
				},
				{
				    name: "rcode",
				    argument: "arg_tp"
				},
                {
                    name: "chart_1",
                    argument: "arg_chart_1"
                },
                {
                    name: "chart_2",
                    argument: "arg_chart_2"
                }
			]
        },
        target: [
            {
			    type: "GRID",
			    id: "grdData_현황상세"
			},
			{
			    type: "CHART",
			    id: "lyrChart_통계상세"
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
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//