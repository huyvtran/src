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
        // prepare dialogue.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        var args = {
            type: "PAGE",
            page: "IFProcess",
            path: "../Master/",
            title: "그룹웨어 로그인",
            width: 430,
            height: 90,
            locate: ["center", 200]
        };
        gw_com_module.dialoguePrepare(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set data.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        var args = {
            request: [
                {
                    type: "PAGE", name: "수주결과", query: "dddw_order_result"
                },
                {
                    type: "PAGE", name: "진행상태", query: "dddw_est_stat"
                },
                {
                    type: "PAGE", name: "사원", query: "dddw_emp"
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
                    name: "결재",
                    value: "결재상신",
                    icon: "기타"
                },
                {
                    name: "조회",
                    value: "조회",
                    act: true
                },
				{
				    name: "출력",
				    value: "집계표 조회",
				    icon: "실행"
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
            targetid: "frmOption",
            type: "FREE",
            title: "조회 조건",
            trans: true,
            border: true,
            show: true,
            editable: {
                focus: "est_nm",
                validate: true
            },
            remark: "lyrRemark",
            content: {
                row: [
                    {
                        element: [
				            {
				                name: "est_nm",
				                label: {
				                    title: "견적명 :"
				                },
				                editable: {
				                    type: "text",
				                    size: 16,
				                    maxlength: 50
				                }
				            },
				            {
				                name: "submit_empnm",
				                label: {
				                    title: "제출담당자 :"
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
                            },
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
                            }
				        ]
                    },
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
            query: "w_hcem3010_M_1",
            title: "견적 현황",
            caption: true,
            height: 92,
            //pager: false,
            show: true,
            selectable: true,
            element: [
				{
				    header: "견적명",
				    name: "est_nm",
				    width: 250,
				    align: "left"
				},
			    {
			        header: "차수",
			        name: "revision",
			        width: 60,
			        align: "center"
			    },
				{
				    header: "고객사",
				    name: "cust_nm",
				    width: 250,
				    align: "left"
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
				    width: 80,
				    align: "center"
				},
 				{
 				    header: "진행상태",
 				    name: "est_stat_nm",
 				    width: 60,
 				    align: "center"
 				},
 				{
 				    header: "수주결과",
 				    name: "order_result_nm",
 				    width: 60,
 				    align: "center"
 				},
                {
                    header: "결재상태",
                    name: "gw_status_nm",
                    width: 60,
                    align: "center"
                },
                {
                    name: "gw_key",
                    hidden: true
                },
                {
                    name: "gw_seq",
                    hidden: true
                },
                {
                    name: "gw_status",
                    hidden: true
                },
				{
				    name: "use_div",
				    hidden: true
				},
				{
				    name: "est_key",
				    hidden: true
				}
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_국내정보",
            query: "w_hcem3010_S_1",
            type: "TABLE",
            title: "실행 정보",
            caption: true,
            show: true,
            selectable: true,
            content: {
                width: {
                    label: 100,
                    field: 200
                },
                height: 25,
                row: [
                    {
                        element: [
                            {
                                header: true, value: "견적명", format: { type: "label" }
                            },
                            {
                                name: "est_nm"
                            },
                            {
                                header: true, value: "고객사", format: { type: "label" }
                            },
                            {
                                name: "cust_nm"
                            },
                            {
                                header: true, value: "사용처", format: { type: "label" }
                            },
                            {
                                name: "cust_place"
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true, value: "최종견적가(￦)", format: { type: "label" }
                            },
                            {
                                name: "final_amt", mask: "numeric-int"
                            },
                            {
                                header: true, value: "환율(USD)", format: { type: "label" }
                            },
                            {
                                name: "exchange_1", mask: "numeric-float"
                            },
                            {
                                header: true, value: "환율(JPY)", format: { type: "label" }
                            },
                            {
                                name: "exchange_2", mask: "numeric-float"
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true, value: "제품수량", format: { type: "label" }
                            },
                            {
                                style: { colspan: 5 },
                                name: "prod_lst",
                                format: { type: "textarea", rows: 2, width: 820 },
                                editable: { type: "textarea", rows: 2, width: 820 }
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
            targetid: "frmData_해외정보",
            query: "w_hcem3010_S_1",
            type: "TABLE",
            title: "실행 정보",
            caption: true,
            show: false,
            selectable: true,
            content: {
                width: {
                    label: 100,
                    field: 200
                },
                height: 25,
                row: [
                    {
                        element: [
                            {
                                header: true, value: "견적명", format: { type: "label" }
                            },
                            {
                                name: "est_nm"
                            },
                            {
                                header: true, value: "고객사", format: { type: "label" }
                            },
                            {
                                name: "cust_nm"
                            },
                            {
                                header: true, value: "사용처", format: { type: "label" }
                            },
                            {
                                name: "cust_place"
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true, value: "최종견적가($)", format: { type: "label" }
                            },
                            {
                                name: "final_amt", mask: "numeric-float"
                            },
                            {
                                header: true, value: "환율(USD)", format: { type: "label" }
                            },
                            {
                                name: "exchange_1", mask: "numeric-float"
                            },
                            {
                                header: true, value: "환율(JPY)", format: { type: "label" }
                            },
                            {
                                name: "exchange_2", mask: "numeric-float"
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true, value: "제품수량", format: { type: "label" }
                            },
                            {
                                style: { colspan: 5 },
                                name: "prod_lst",
                                format: { type: "textarea", rows: 2, width: 820 },
                                editable: { type: "textarea", rows: 2, width: 820 }
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
            targetid: "frmData_비고",
            query: "w_hcem3010_S_3",
            type: "TABLE",
            title: "특이 사항",
            caption: true,
            show: true,
            selectable: true,
            editable: {
                bind: "select",
                focus: "note",
                validate: true
            },
            content: {
                width: {
                    label: 100,
                    field: 800
                },
                height: 25,
                row: [
                    {
                        element: [
                            {
                                header: true, value: "특이사항", format: { type: "label" }
                            },
                            {
                                name: "note",
                                format: { type: "textarea", rows: 10, width: 820 },
                                editable: { type: "textarea", rows: 10, width: 820 }
                            },
            				{
            				    name: "est_key",
            				    hidden: true
            				},
            				{
            				    name: "revision",
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
            targetid: "grdData_국내집계",
            query: "w_hcem3010_S_2",
            title: "집계 내역",
            caption: true,
            height: "100%",
            pager: false,
            show: true,
            selectable: true,
            element: [
                {
                    header: "구분",
                    name: "title",
                    width: 150,
                    align: "left"
                },
				{
				    header: "견적실행(￦)",
				    name: "est_amt",
				    width: 120,
				    align: "center",
				    mask: "numeric-int"
				},
				{
				    header: "비율(%)",
				    name: "est_rate",
				    width: 80,
				    align: "center",
				    mask: "numeric-float"
				},
				{
				    header: "NEGO실행(￦)",
				    name: "nego_amt",
				    width: 120,
				    align: "center",
				    mask: "numeric-int"
				},
				{
				    header: "비율(%)",
				    name: "nego_rate",
				    width: 80,
				    align: "center",
				    mask: "numeric-float"
				}
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_해외집계",
            query: "w_hcem3010_S_2",
            title: "집계 내역",
            caption: true,
            height: "100%",
            pager: false,
            show: false,
            selectable: true,
            element: [
                {
                    header: "구분",
                    name: "title",
                    width: 150,
                    align: "left"
                },
				{
				    header: "견적실행($)",
				    name: "est_amt",
				    width: 120,
				    align: "center",
				    mask: "numeric-float"
				},
				{
				    header: "비율(%)",
				    name: "est_rate",
				    width: 80,
				    align: "center",
				    mask: "numeric-float"
				},
				{
				    header: "NEGO실행($)",
				    name: "nego_amt",
				    width: 120,
				    align: "center",
				    mask: "numeric-float"
				},
				{
				    header: "비율(%)",
				    name: "nego_rate",
				    width: 80,
				    align: "center",
				    mask: "numeric-float"
				}
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_출력",
            query: "w_hcem3010_R_1",
            type: "FORM",
            title: "종합 실행 집계표",
            caption: true,
            show: true,
            selectable: true,
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "html_summary"
                            }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.htmlCreate(args);
        //=====================================================================================
        var args = {
            target: [
                {
                    type: "GRID",
                    id: "grdData_현황",
                    offset: 8
                },
                {
                    type: "FORM",
                    id: "frmData_국내정보",
                    offset: 8
                },
                {
                    type: "FORM",
                    id: "frmData_해외정보",
                    offset: 8
                },
				{
				    type: "GRID",
				    id: "grdData_국내집계",
				    offset: 8
				},
				{
				    type: "GRID",
				    id: "grdData_해외집계",
				    offset: 8
				},
				{
				    type: "FORM",
				    id: "frmData_비고",
				    offset: 8
				},
                {
                    type: "FORM",
                    id: "frmData_출력",
                    offset: 8
                }
			]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        var args = {
            tabid: "lyrTab",
            target: [
				{
				    type: "LAYER",
				    id: "lyrData_정보",
				    title: "실행 내역"
				},
                {
                    type: "FORM",
                    id: "frmData_출력",
                    title: "실행 집계표"
                }
			]
        };
        //----------
        gw_com_module.convertTab(args);
        //=====================================================================================
        var args = {
            target: [
                {
				    type: "GRID",
				    id: "grdData_국내집계",
				    offset: 8
				},
				{
				    type: "GRID",
				    id: "grdData_해외집계",
				    offset: 8
				},
                {
                    type: "FORM",
                    id: "frmData_출력",
                    offset: 8
                },				
				{
				    type: "TAB",
				    id: "lyrTab",
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
    // manage process. (programmable section)
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
            element: "결재",
            event: "click",
            handler: click_lyrMenu_결재
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
            element: "저장",
            event: "click",
            handler: click_lyrMenu_저장
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu",
            element: "출력",
            event: "click",
            handler: click_lyrMenu_출력
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
        function click_lyrMenu_결재(ui) {

            if (!checkManipulate({})) return false;

            processApprove({});

        }
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
        function click_lyrMenu_저장() {

            closeOption({});

            processSave({});

        }
        //----------
        function click_lyrMenu_출력() {

            if (!checkManipulate()) return false;

            processCreate({});
        }
        //----------
        function click_lyrMenu_닫기() {

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
        gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -1 }));
        gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate("", { month: +1 }));
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
function getObject(param) {

    var use = gw_com_api.getValue("grdData_현황", "selected", "use_div", true);
    switch (param.name) {
        case "정보":
            return ((use == "1") ? "frmData_해외정보" : "frmData_국내정보");
        case "집계":
            return ((use == "1") ? "grdData_해외집계" : "grdData_국내집계");
    }
    return "";

}
//----------
function toggleObject(param) {

    var use = gw_com_api.getValue("grdData_현황", "selected", "use_div", true);
    if (use == "0") {
        gw_com_api.hide("frmData_해외정보");
        gw_com_api.hide("grdData_해외집계");
        gw_com_api.show("frmData_국내정보");
        gw_com_api.show("grdData_국내집계");
    }
    else {
        gw_com_api.hide("frmData_국내정보");
        gw_com_api.hide("grdData_국내집계");
        gw_com_api.show("frmData_해외정보");
        gw_com_api.show("grdData_해외집계");
    }
}
//----------
function checkManipulate(param) {

    closeOption({});

    if (gw_com_api.getSelectedRow("grdData_현황") == null) {
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
        check: param.check,
        target: [
            {
                type: "FORM",
                id: "frmData_비고"
            }
		],
        param: param
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
        processClear({ master: true });
        return false;
    }

    gw_com_api.selectTab("lyrTab", 1);

    if (param.selected) {
        param.key = [{
            KEY: [
                { NAME: "est_key", VALUE: gw_com_api.getValue("grdData_현황", "selected", "est_key", true) },
                { NAME: "revision", VALUE: gw_com_api.getValue("grdData_현황", "selected", "revision", true) }
            ],
            QUERY: "w_hcem3010_M_1"
        }];
    }
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
				}
			],
            remark: [
		        {
		            element: [{ name: "est_nm"}]
		        },
		        {
		            element: [{ name: "cust_nm"}]
		        },
                {
                    infix: "~",
                    element: [
	                    { name: "ymd_fr" },
		                { name: "ymd_to" }
		            ]
                },
		        {
		            element: [{ name: "submit_empnm"}]
		        },
		        {
		            element: [{ name: "est_stat"}]
		        },
		        {
		            element: [{ name: "order_result"}]
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
			    id: "frmData_국내정보"
			},
            {
                type: "FORM",
                id: "frmData_해외정보"
            },
			{
			    type: "GRID",
			    id: "grdData_국내집계"
			},
			{
			    type: "GRID",
			    id: "grdData_해외집계"
			},
            {
                type: "FORM",
                id: "frmData_비고"
            },
            {
                type: "FORM",
                id: "frmData_출력"
            }
		],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {

    toggleObject({});

    var args = {
        source: {
            type: "GRID",
            id: "grdData_현황",
            row: "selected",
            block: true,
            element: [
				{
				    name: "est_key",
				    argument: "arg_est_key"
				},
				{
				    name: "revision",
				    argument: "arg_revision"
				}
			]
        },
        key: param.key
    };
    if (param.print) {
        args.target = [
            {
                type: "FORM",
                id: "frmData_출력"
            },
		];
    }
    else {
        gw_com_api.selectTab("lyrTab", 1);

        args.target = [
            {
                type: "FORM",
                id: getObject({ name: "정보" })
            },
            {
                type: "GRID",
                id: getObject({ name: "집계" })
            },
			{
			    type: "FORM",
			    id: "frmData_비고"
			}
		];
			args.clear = [
            {
                type: "FORM",
                id: "frmData_출력"
            }
        ];            
    }
    gw_com_module.objRetrieve(args);

}
//----------
function processSelect(param) {

    gw_com_api.selectRow("grdData_현황", v_global.process.current.master, true, false);

}
//----------
function processSave() {

    var args = {
        target: [
			{
			    type: "FORM",
			    id: "frmData_비고"
			}
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
function processCreate(param) {

    var args = {
        url: "COM",
        procedure: "PROC_EST_SUMMARY",
        nomessage: true,
        input: [
            { name: "user", value: gw_com_module.v_Session.USR_ID, type: "varchar" },
            { name: "est_key", value: gw_com_api.getValue("grdData_현황", "selected", "est_key", true), type: "varchar" },
            { name: "revision", value: gw_com_api.getValue("grdData_현황", "selected", "revision", true), type: "varchar" }
        ],
        output: [
            { name: "r_value", type: "int" },
            { name: "message", type: "varchar" }
        ],
        handler: {
            success: completeCreate
        }
    };
    gw_com_module.callProcedure(args);

}
//----------
function processApprove(param) {

    var status = gw_com_api.getValue("grdData_현황", "selected", "gw_status_nm", true);
    if (status != '없슴' && status != '미처리' && status != '반송' && status != '회수') {
        gw_com_api.messageBox([
            { text: "결재 " +
                    gw_com_api.getValue("grdData_현황", "selected", "gw_status_nm", true) +
                    " 자료이므로 처리할 수 없습니다."
            }
        ], 420);
        return false;
    }

    var args = {
        page: "IFProcess",
        param: {
            ID: gw_com_api.v_Stream.msg_authSystem,
            data: {
                system: "GROUPWARE",
                name: gw_com_module.v_Session.GW_ID,
                encrypt: { password: true },
                param: param
            }
        }
    };
    gw_com_module.dialogueOpen(args);

}
//----------
function processClear(param) {

    var args = {
        target: [
            {
                type: "FORM",
                id: "frmData_국내정보"
            },
            {
                type: "FORM",
                id: "frmData_해외정보"
            },
            {
                type: "GRID",
                id: "grdData_국내집계"
            },
            {
                type: "GRID",
                id: "grdData_해외집계"
            },
            {
                type: "FORM",
                id: "frmData_비고"
            }
        ]
    };
    if (param.master) {
        args.target.unshift({
            type: "GRID",
            id: "grdData_현황"
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

}
//----------
function completeCreate(response, param) {

    gw_com_api.messageBox([
        { text: response.VALUE[1] }
    ], 350, gw_com_api.v_Message.msg_informBatched, "ALERT",
    { handler: successCreate, response: response });

}
//----------
function successCreate(response, param) {

    if (response.VALUE[0] != -1) {
        processLink({ print: true });
        gw_com_api.selectTab("lyrTab", 2);
    }

}
//----------
function successApproval(response, param) {

    processRetrieve({ selected: true });

    gw_com_api.showMessage("그룹웨어 페이지로 이동합니다.");
    var data = {};
    $.each(response.NAME, function (approval_i) {
        data[response.NAME[approval_i]] = response.VALUE[approval_i];
    });
    if (data.r_value < 0) {
        gw_com_api.showMessage(data.message);
        return;
    }
    var url = "http://gw.ips.co.kr/common/main/sso_erp.aspx";
    var params = [
        { name: "form_id", value: 206 },
        { name: "cmpid", value: 1 },
        { name: "inter_id", value: "I" },
        { name: "sysid", value: "PLM" },
        { name: "sys_key", value: data.r_key },
        { name: "seq", value: data.r_seq },
        { name: "user_id", value: v_global.logic.name },
        { name: "passwd", value: v_global.logic.password }
    ];
    var args = "";
    $.each(params, function (args_i) {
        args = args +
            ((args_i == 0) ? "?" : "&") + this.name + "=" + this.value;
    });
    window.open(url + args, "", "");

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
                                    v_global.process.handler(param.data.arg);
                            }
                        }
                        break;
                    case gw_com_api.v_Message.msg_confirmBatch:
                        {
                            if (param.data.result == "YES")
                                processRevise(param.data.arg);
                        }
                        break;
                    case gw_com_api.v_Message.msg_informSaved:
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
        case gw_com_api.v_Stream.msg_authedSystem:
            {
                closeDialogue({ page: param.from.page });

                v_global.logic.name = param.data.name;
                v_global.logic.password = param.data.password;
                var args = {
                    url: "COM",
                    procedure: "PROC_EST_APPROVAL",
                    input: [
                        { name: "user", value: gw_com_module.v_Session.USR_ID, type: "varchar" },
                        { name: "est_key", value: gw_com_api.getValue("grdData_현황", "selected", "est_key", true), type: "varchar" },
                        { name: "revision", value: gw_com_api.getValue("grdData_현황", "selected", "revision", true), type: "varchar" },
                        { name: "emp_no", value: gw_com_module.v_Session.EMP_NO, type: "varchar" },
                        { name: "gw_key", value: gw_com_api.getValue("grdData_현황", "selected", "gw_key", true), type: "varchar" },
                        { name: "gw_seq", value: gw_com_api.getValue("grdData_현황", "selected", "gw_seq", true), type: "int" }
                    ],
                    output: [
                        { name: "r_key", type: "varchar" },
                        { name: "r_seq", type: "int" },
                        { name: "r_value", type: "int" },
                        { name: "message", type: "varchar" }
                    ],
                    handler: {
                        success: successApproval
                    }
                };
                gw_com_module.callProcedure(args);
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