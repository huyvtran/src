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
				    type: "PAGE", name: "사업부", query: "dddw_prodgroup"
				},
				{
				    type: "PAGE", name: "고객사", query: "dddw_cust"
				}/*,
                {
                    type: "PAGE", name: "공정", query: "dddw_mprocess"
                }*/
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
				    name: "닫기",
				    value: "닫기"
				}
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmView",
            type: "FREE",
            trans: true,
            show: true,
            border: false,
            align: "right",
            editable: {
                bind: "open",
                validate: true
            },
            content: {
                row: [
                    {
                        element: [
				            {
				                name: "delay",
				                label: {
				                    title: "납품지연 자재 :"
				                },
				                editable: {
				                    type: "checkbox",
				                    value: "1",
				                    offval: "%"
				                }/*,
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "보기"
				                    }
				                }*/
				            },
                            {
                                name: "rcvd",
                                label: {
                                    title: "입고완료 포함 :"
                                },
                                editable: {
                                    type: "checkbox",
                                    value: "%",
                                    offval: "0"
                                }/*,
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "보기"
				                    }
				                }*/
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
            targetid: "frmOption",
            type: "FREE",
            title: "조회 조건",
            trans: true,
            show: true,
            border: true,
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
                                name: "proj_no",
                                label: {
                                    title: "Project No :"
                                },
                                editable: {
                                    type: "text",
                                    size: 7,
                                    maxlength: 10
                                }
                            },
                            {
                                style: {
                                    colfloat: "floating"
                                },
                                name: "ymd_fr",
                                label: {
                                    title: "납기일자 :"
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
				                name: "prod_group",
				                label: {
				                    title: "사업부 :"
				                },
				                editable: {
				                    type: "select",
				                    size: 1,
				                    data: {
				                        memory: "사업부"
				                    },
				                    validate: {
				                        rule: "required",
				                        message: "사업부"
				                    }
				                }
				            },
				            {
				                name: "cust_cd",
				                label: {
				                    title: "고객사 :"
				                },
				                editable: {
				                    type: "select",
				                    size: 1,
				                    data: {
				                        memory: "고객사",
				                        unshift: [
				                            { title: "전체", value: "%" }
				                        ]
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
            query: "w_mrp3030_M_1",
            title: "프로젝트 진행 현황",
            caption: true,
            height: 115,
            show: true,
            selectable: true,
            element: [
				{
				    header: "고객사",
				    name: "cust_nm",
				    width: 60,
				    align: "center"
				},
				{
				    header: "제품유형",
				    name: "prod_type",
				    width: 100,
				    align: "center"
				},
				{
				    header: "제품명",
				    name: "prod_nm",
				    width: 200,
				    align: "left"
				},
				{
				    header: "Project No.",
				    name: "proj_no",
				    width: 80,
				    align: "center"
				}/*,
				{
				    header: "영업",
				    name: "sale_stat",
				    width: 50,
				    align: "center"
				},
				{
				    header: "설계",
				    name: "draw_stat",
				    width: 50,
				    align: "center"
				},
				{
				    header: "구매",
				    name: "pur_stat",
				    width: 50,
				    align: "center"
				}*/,
				{
				    header: "생산",
				    name: "prod_stat",
				    width: 50,
				    align: "center"
				},
				{
				    header: "공정진행율",
				    name: "prod_rate",
				    width: 70,
				    align: "center",
				    mask: "numeric-float"
				},
				{
				    header: "납기요청일",
				    name: "due_ymd",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    header: "완료예정일",
				    name: "end_ymd",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    name: "ord_no",
				    hidden: true
				}
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_공정",
            query: "w_mrp3030_S_1",
            title: "공정별 진행 현황",
            height: 545,
            show: true,
            selectable: true,
            element: [
				{
				    header: "공정구분",
				    name: "mprc_class_nm",
				    width: 70,
				    align: "center"
				},
				{
				    header: "공정코드",
				    name: "mprc_no",
				    width: 60,
				    align: "center"
				},
				{
				    header: "공정명",
				    name: "mprc_nm",
				    width: 240,
				    align: "left"
				},
				{
				    header: "표준가중치",
				    name: "mprc_weight",
				    width: 65,
				    align: "center",
				    mask: "numeric-float"
				},
				{
				    header: "표준진행율",
				    name: "mprc_rate",
				    width: 65,
				    align: "center",
				    mask: "numeric-float"
				},
				{
				    header: "완료예정일",
				    name: "due_ymd",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    header: "완료계획일",
				    name: "pln_ymd",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    header: "완료실적일",
				    name: "end_ymd",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    header: "투입인원",
				    name: "real_persons",
				    width: 60,
				    align: "center",
				    mask: "numeric-int"
				},
				{
				    header: "투입시간",
				    name: "real_times",
				    width: 60,
				    align: "center"
				},
				{
				    header: "시작일",
				    name: "real_days",
				    width: 70,
				    align: "center"
				},
				{
				    header: "진행상태",
				    name: "pstat",
				    width: 60,
				    align: "center"
				},
				{
				    header: "변경상태",
				    name: "astat",
				    width: 60,
				    align: "center"
				},
                {
                    name: "mprc_class",
                    hidden: true
                },
				{
				    name: "sort_seq",
				    hidden: true
				},
				{
				    name: "mprc_cd",
				    hidden: true
				},
				{
				    name: "ord_no",
				    hidden: true
				}
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_핵심",
            query: "w_mrp3030_S_2",
            title: "이슈 자재 진행 현황",
            height: 545,
            show: true,
            selectable: true,
            dynamic: true,
            color: {
                row: true//,
                //element: ["mprc_no", "mprc_nm", "part_nm", "part_spec", "req_qty", "need_date", "pur_qty", "req_date", "plan_date", "in_qty", "in_date"]
            },
            editable: {
                multi: true,
                bind: "select",
                focus: "core_yn",
                validate: true
            },
            element: [
				{
				    header: "공정코드",
				    name: "mprc_no",
				    width: 60,
				    align: "center"
				},
				{
				    header: "공정명",
				    name: "mprc_nm",
				    width: 200,
				    align: "left"
				},
				{
				    header: "품목명",
				    name: "part_nm",
				    width: 200,
				    align: "left"
				},
				{
				    header: "규격",
				    name: "part_spec",
				    width: 200,
				    align: "left"
				},
				{
				    header: "이슈품목",
				    name: "core_yn",
				    width: 60,
				    align: "center",
				    format: {
				        type: "checkbox",
				        title: "",
				        value: 1,
				        offval: 0
				    },
				    editable: {
				        type: "checkbox",
				        title: "",
				        value: 1,
				        offval: 0
				    }
				},
				{
				    header: "필요수량",
				    name: "req_qty",
				    width: 60,
				    align: "right",
				    mask: "numeric-float"
				},
				{
				    header: "필요일자",
				    name: "need_date",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    header: "발주수량",
				    name: "pur_qty",
				    width: 60,
				    align: "right",
				    mask: "numeric-float"
				},
				{
				    header: "납기요청일",
				    name: "req_date",
				    width: 150,
				    align: "center"
				},
				{
				    header: "납품예정일",
				    name: "plan_date",
				    width: 150,
				    align: "center"
				},
				{
				    header: "입고수량",
				    name: "in_qty",
				    width: 60,
				    align: "right",
				    mask: "numeric-float"
				},
				{
				    header: "입고일자",
				    name: "in_date",
				    width: 150,
				    align: "center"
				},
				{
				    name: "bom_seq",
				    hidden: true,
				    editable: { type: "hidden" }
				},
				{
				    name: "part_cd",
				    hidden: true,
				    editable: { type: "hidden" }
				},
				{
				    name: "mprc_cd",
				    hidden: true,
				    editable: { type: "hidden" }
				},
				{
				    name: "ord_no",
				    hidden: true,
				    editable: { type: "hidden" }
				},
                {
                    name: "color",
                    hidden: true
                }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_전체",
            query: "w_mrp3030_S_3",
            title: "전체 자재 진행 현황",
            height: 545,
            show: true,
            selectable: true,
            dynamic: true,
            color: {
                row: true//,
                //element: ["mprc_no", "mprc_nm", "part_nm", "part_spec", "req_qty", "need_date", "pur_qty", "req_date", "plan_date", "in_qty", "in_date"]
            },
            editable: {
                multi: true,
                bind: "select",
                focus: "core_yn",
                validate: true
            },
            element: [
				{
				    header: "공정코드",
				    name: "mprc_no",
				    width: 60,
				    align: "center"
				},
				{
				    header: "공정명",
				    name: "mprc_nm",
				    width: 200,
				    align: "left"
                },
				{
				    header: "품목명",
				    name: "part_nm",
				    width: 200,
				    align: "left"
				},
				{
				    header: "규격",
				    name: "part_spec",
				    width: 220,
				    align: "left"
				},
				{
				    header: "이슈품목",
				    name: "core_yn",
				    width: 60,
				    align: "center",
				    format: {
				        type: "checkbox",
				        title: "",
				        value: 1,
				        offval: 0
				    },
				    editable: {
				        type: "checkbox",
				        title: "",
				        value: 1,
				        offval: 0
				    }
				},
				{
				    header: "필요수량",
				    name: "req_qty",
				    width: 60,
				    align: "right",
				    mask: "numeric-float"
				},
				{
				    header: "필요일자",
				    name: "need_date",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    header: "발주수량",
				    name: "pur_qty",
				    width: 60,
				    align: "right",
				    mask: "numeric-float"
				},
				{
				    header: "납기요청일",
				    name: "req_date",
				    width: 150,
				    align: "center"
				},
				{
				    header: "납품예정일",
				    name: "plan_date",
				    width: 150,
				    align: "center"
				},
				{
				    header: "입고수량",
				    name: "in_qty",
				    width: 60,
				    align: "right",
				    mask: "numeric-float"
				},
				{
				    header: "입고일자",
				    name: "in_date",
				    width: 150,
				    align: "center"
				},
				{
				    name: "bom_seq",
				    hidden: true,
				    editable: { type: "hidden" }
				},
				{
				    name: "part_cd",
				    hidden: true,
				    editable: { type: "hidden" }
				},
				{
				    name: "mprc_cd",
				    hidden: true,
				    editable: { type: "hidden" }
				},
				{
				    name: "ord_no",
				    hidden: true,
				    editable: { type: "hidden" }
				},
                {
                    name: "color",
                    hidden: true
                }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            tabid: "lyrTab",
            collapsible: true,
            target: [
				{
				    type: "GRID",
				    id: "grdData_공정",
				    title: "공정별 진행 현황"
				},
				{
				    type: "GRID",
				    id: "grdData_핵심",
				    title: "이슈 자재 진행 현황"
				},
				{
				    type: "GRID",
				    id: "grdData_전체",
				    title: "전체 자재 진행 현황"
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
				    id: "grdData_현황",
				    offset: 8
				},
				{
				    type: "GRID",
				    id: "grdData_공정",
				    offset: 8
				},
				{
				    type: "GRID",
				    id: "grdData_핵심",
				    offset: 8
				},
				{
				    type: "GRID",
				    id: "grdData_전체",
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

        //----------
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
            targetid: "frmView",
            event: "itemchanged",
            handler: itemchanged_frmView
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
        function click_lyrMenu_저장(ui) {

            closeOption({});

            processSave({});

        }
        //----------
        function click_lyrMenu_닫기(ui) {

            checkClosable({});

        }
        //----------
        function itemchanged_frmView(ui) {

            switch (ui.element) {
                case "delay":
                    {
                        processLink({ bom: true });
                    }
                    break;
                case "rcvd":
                    {
                        processLink({ bom: true });
                    }
                    break;
            }

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
        if (v_global.process.param != "") {
            gw_com_api.setValue("frmOption", 1, "proj_no", gw_com_api.getPageParameter("proj_no"));
            gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -1 }));
            gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate("", { month: +6 }));
        }
        else {
            gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -1 }));
            gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate("", { month: +6 }));
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
        target: [
            {
                type: "GRID",
                id: "grdData_핵심"
            },
            {
                type: "GRID",
                id: "grdData_전체"
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

    var args = {
        source: {
            type: "FORM",
            id: "frmOption",
            hide: true,
            element: [
                {
                    name: "proj_no",
                    argument: "arg_proj_no"
                },
				{
				    name: "cust_cd",
				    argument: "arg_cust_cd"
				},
				{
				    name: "prod_group",
				    argument: "arg_prod_group"
				},
				{
				    name: "ymd_fr",
				    argument: "arg_ymd_fr"
				},
				{
				    name: "ymd_to",
				    argument: "arg_ymd_to"
				}
			],
            remark: [
                {
                    element: [{ name: "proj_no"}]
                },
		        {
		            element: [{ name: "prod_group"}]
		        },
	            {
	                element: [{ name: "cust_cd"}]
	            },
                {
                    infix: "~",
                    element: [
	                    { name: "ymd_fr" },
		                { name: "ymd_to" }
		            ]
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
			    type: "GRID",
			    id: "grdData_공정"
			},
			{
			    type: "GRID",
			    id: "grdData_핵심"
			},
			{
			    type: "GRID",
			    id: "grdData_전체"
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
            element: [
				{
				    name: "ord_no",
				    argument: "arg_ord_no"
				}
			],
            argument: [
                { name: "arg_delay", value: gw_com_api.getValue("frmView", 1, "delay") },
                { name: "arg_rcvd", value: gw_com_api.getValue("frmView", 1, "rcvd") }
            ]
        },
        target: [
			{
			    type: "GRID",
			    id: "grdData_핵심"
			},
			{
			    type: "GRID",
			    id: "grdData_전체"
			}
        ],
        key: param.key
    };
    if (param.bom) {
    }
    else {
        args.source.block = true;
        args.target.unshift({
			type: "GRID",
			id: "grdData_공정"
		});
    }
    gw_com_module.objRetrieve(args);

}
//----------
function processSelect(param) {

    gw_com_api.selectRow("grdData_현황", v_global.process.current.master, true, false);

}
//----------
function processSave(param) {

    var args = {
        target: [
			{
			    type: "GRID",
			    id: "grdData_핵심"
			},
            {
                type: "GRID",
                id: "grdData_전체"
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
function processClear(param) {

    var args = {
        target: [
            {
                type: "GRID",
                id: "grdData_공정"
            },
            {
                type: "GRID",
                id: "grdData_핵심"
            },
            {
                type: "GRID",
                id: "grdData_전체"
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
function successSave(response, param) {

    processLink({ key: response });

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
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//