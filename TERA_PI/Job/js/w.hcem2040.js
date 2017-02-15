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
                    type: "PAGE", name: "수주결과", query: "dddw_order_result"
                },
                {
                    type: "PAGE", name: "진행상태", query: "dddw_est_stat"
                },
                {
                    type: "PAGE", name: "사원", query: "dddw_emp"
                },
                {
                    type: "PAGE", name: "절사", query: "dddw_zcoded",
                    param: [
                        { argument: "arg_hcode", value: "HCEM12" }
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
				    name: "출력",
				    value: "견적서 다운로드",
				    icon: "출력"
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
            targetid: "frmOption_1",
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
            targetid: "frmOption_2",
            type: "FREE",
            title: "출력 조건",
            trans: true,
            border: true,
            margin: 20,
            editable: {
                focus: "amt_rule",
                validate: true
            },
            content: {
                row: [
                    {
                        align: "center",
                        element: [
				            {
				                name: "amt_rule",
				                label: {
				                    title: "금액절사기준 :"
				                },
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "절사"
				                    }
				                }
				            }
				        ]
                    },
                    {
                        align: "center",
                        element: [
				            {
				                name: "실행",
				                value: "실행",
				                act: true,
				                format: {
				                    type: "button",
				                    icon: "실행"
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
            query: "w_hcem2040_M_0",
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
            targetid: "frmData_국내갑지",
            query: "w_hcem2040_M_1",
            type: "TABLE",
            title: "갑지 정보",
            caption: true,
            show: true,
            selectable: true,
            content: {
                width: { label: 100, field: 200 },
                row: [
                    { element: [
                        {
                            header: true, value: "견적명",
                            format: { type: "label" }
                        },
                        {
                            name: "est_nm"
                        },
                        {
                            header: true, value: "고객사",
                            format: { type: "label" }
                        },
                        {
                            name: "cust_nm"
                        },
                        {
                            header: true, value: "견적일자",
                            format: { type: "label" }
                        },
                        {
                            name: "est_dt", mask: "date-ymd"
                        }
                    ]
                    },
                    { element: [
                        {
                            header: true, value: "견적금액(￦)",
                            format: { type: "label" }
                        },
                        {
                            name: "est_amt", mask: "currency-int"
                        },
                        {
                            header: true, value: "NEGO금액(￦)",
                            format: { type: "label" }
                        },
                        {
                            name: "nego_amt", mask: "currency-int"
                        },
                        {
                            header: true, value: "최종금액(￦)",
                            format: { type: "label" }
                        },
                        {
                            name: "final_amt", mask: "currency-int"
                        }
                    ]
                    },
                    { element: [
                        {
                            header: true, value: "견적자재비(%)",
                            format: { type: "label" }
                        },
                        {
                            name: "est_rate", mask: "currency-float"
                        },
                        {
                            header: true, value: "NEGO자재비(%)",
                            format: { type: "label" }
                        },
                        {
                            name: "nego_rate", mask: "currency-float"
                        },
                        {
                            header: true, value: "최종자재비(%)",
                            format: { type: "label" }
                        },
                        {
                            name: "final_rate", mask: "currency-float"
                        }
                    ]
                    },
                    { element: [
                        {
                            header: true, value: "지불조건",
                            format: { type: "label" }
                        },
                        {
                            name: "pay_cond"
                        },
                        {
                            header: true, value: "부가세",
                            format: { type: "label" }
                        },
                        {
                            name: "vat_div",
                            format: { type: "checkbox", title: "별도", value: "1", offval: "0" }
                        },
                        {
                            header: true, value: "납기",
                            format: { type: "label" }
                        },
                        {
                            name: "delivery"
                        }
                    ]
                    },
                    { element: [
                        {
                            header: true, value: "견적유효기간",
                            format: { type: "label" }
                        },
                        {
                            name: "est_expired"
                        },
                        {
                            header: true, value: "배송수단",
                            format: { type: "label" }
                        },
                        {
                            name: "shipment"
                        },
                        {
                            header: true, value: "집계기준",
                            format: { type: "label" }
                        },
                        {
                            name: "sheet_summary"
                        }
                    ]
                    },
                    { element: [
                        {
                            header: true, value: "담당자",
                            format: { type: "label" }
                        },
                        {
                            name: "submit_empno_nm"
                        },
                        {
                            header: true, value: "작성자",
                            format: { type: "label" }
                        },
                        {
                            name: "upd_usr"
                        },
                        {
                            header: true, value: "작성일시",
                            format: { type: "label" }
                        },
                        {
                            name: "upd_dt"
                        }
                    ]
                    },
                    { element: [
                        {
                            header: true, value: "특기사항",
                            format: { type: "label" }
                        },
                        {
                            style: { colspan: 5 },
                            name: "rmk",
                            format: { type: "textarea", rows: 5, width: 796 }
                        },
                        {
                            name: "use_div", hidden: true, refer: true
                        },
                        {
                            name: "exchange_dt", hidden: true, refer: true
                        },
                        {
                            name: "exchange_1", hidden: true, refer: true
                        },
                        {
                            name: "exchange_2", hidden: true, refer: true
                        },
                        {
                            name: "distribution_rate", hidden: true, refer: true
                        },
                        {
                            name: "duty_rate", hidden: true, refer: true
                        },
                        {
                            name: "profit_rate", hidden: true, refer: true
                        },
                        {
                            name: "est_key", hidden: true
                        },
                        {
                            name: "revision", hidden: true
                        }
                    ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_해외갑지",
            query: "w_hcem2040_M_1",
            type: "TABLE",
            title: "갑지 정보 (수출)",
            caption: true,
            show: false,
            selectable: true,
            content: {
                width: { label: 100, field: 200 },
                row: [
                    { element: [
                        {
                            header: true, value: "견적명",
                            format: { type: "label" }
                        },
                        {
                            name: "est_nm"
                        },
                        {
                            header: true, value: "고객사",
                            format: { type: "label" }
                        },
                        {
                            name: "cust_nm"
                        },
                        {
                            header: true, value: "견적일자",
                            format: { type: "label" }
                        },
                        {
                            name: "est_dt", mask: "date-ymd"
                        }
                    ]
                    },
                    { element: [
                        {
                            header: true, value: "견적금액($)",
                            format: { type: "label" }
                        },
                        {
                            name: "est_amt", mask: "currency-float"
                        },
                        {
                            header: true, value: "NEGO금액($)",
                            format: { type: "label" }
                        },
                        {
                            name: "nego_amt", mask: "currency-float"
                        },
                        {
                            header: true, value: "최종금액($)",
                            format: { type: "label" }
                        },
                        {
                            name: "final_amt", mask: "currency-float"
                        }
                    ]
                    },
                    { element: [
                        {
                            header: true, value: "견적자재비(%)",
                            format: { type: "label" }
                        },
                        {
                            name: "est_rate", mask: "currency-float"
                        },
                        {
                            header: true, value: "NEGO자재비(%)",
                            format: { type: "label" }
                        },
                        {
                            name: "nego_rate", mask: "currency-float"
                        },
                        {
                            header: true, value: "최종자재비(%)",
                            format: { type: "label" }
                        },
                        {
                            name: "final_rate", mask: "currency-float"
                        }
                    ]
                    },
                    { element: [
                        {
                            header: true, value: "지불조건",
                            format: { type: "label" }
                        },
                        {
                            name: "pay_cond"
                        },
                        {
                            header: true, value: "거래조건",
                            format: { type: "label" }
                        },
                        {
                            name: "trade_term"
                        },
                        {
                            header: true, value: "납기",
                            format: { type: "label" }
                        },
                        {
                            name: "delivery"
                        }
                    ]
                    },
                    { element: [
                        {
                            header: true, value: "견적유효기간",
                            format: { type: "label" }
                        },
                        {
                            name: "est_expired"
                        },
                        {
                            header: true, value: "배송수단",
                            format: { type: "label" }
                        },
                        {
                            name: "shipment"
                        },
                        {
                            header: true, value: "집계기준",
                            format: { type: "label" }
                        },
                        {
                            name: "sheet_summary"
                        }
                    ]
                    },
                    { element: [
                        {
                            header: true, value: "담당자",
                            format: { type: "label" }
                        },
                        {
                            name: "submit_empno_nm"
                        },
                        {
                            header: true, value: "작성자",
                            format: { type: "label" }
                        },
                        {
                            name: "upd_usr"
                        },
                        {
                            header: true, value: "작성일시",
                            format: { type: "label" }
                        },
                        {
                            name: "upd_dt"
                        }
                    ]
                    },
                    { element: [
                        {
                            header: true, value: "특기사항",
                            format: { type: "label" }
                        },
                        {
                            style: { colspan: 5 },
                            name: "rmk",
                            format: { type: "textarea", rows: 5, width: 796 }
                        },
                        {
                            name: "use_div", hidden: true, refer: true
                        },
                        {
                            name: "exchange_dt", hidden: true, refer: true
                        },
                        {
                            name: "exchange_1", hidden: true, refer: true
                        },
                        {
                            name: "exchange_2", hidden: true, refer: true
                        },
                        {
                            name: "distribution_rate", hidden: true, refer: true
                        },
                        {
                            name: "duty_rate", hidden: true, refer: true
                        },
                        {
                            name: "profit_rate", hidden: true, refer: true
                        },
                        {
                            name: "est_key", hidden: true
                        },
                        {
                            name: "revision", hidden: true
                        }
                    ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_집계",
            query: "w_hcem2040_M_3",
            title: "을지 집계",
            caption: true,
            height: "100%",
            pager: false,
            show: true,
            selectable: true,
            element: [
				{
				    header: "그룹기준",
				    name: "index_group",
				    width: 100,
				    align: "center"
				},
                {
                    header: "그룹명",
                    name: "index_group_nm",
                    width: 100,
                    align: "center"
                },
                {
                    header: "집계기준(1)",
                    name: "index_summary1",
                    width: 100,
                    align: "center"
                },
                {
                    header: "집계명(1)",
                    name: "index_summary1_nm",
                    width: 100,
                    align: "center"
                },
                {
                    header: "집계기준(2)",
                    name: "index_summary2",
                    width: 100,
                    align: "center"
                },
                {
                    header: "집계명(2)",
                    name: "index_summary2_nm",
                    width: 100,
                    align: "center"
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
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_국내을지",
            query: "w_hcem2040_S_1",
            title: "을지 목록",
            caption: true,
            height: "100%",
            pager: false,
            number: true,
            show: true,
            selectable: true,
            element: [
				{
				    header: "제품분류",
				    name: "model_nm",
				    width: 270,
				    align: "left",
				    mask: "search"
				},
				{
				    header: "수량",
				    name: "model_qty",
				    width: 50,
				    align: "center",
				    mask: "numeric-int"
				},
				{
				    header: "견적금액(￦)",
				    name: "est_cost",
				    width: 100,
				    align: "right",
				    mask: "currency-int"
				},
				{
				    header: "관리비(￦)",
				    name: "manage_cost",
				    width: 80,
				    align: "right",
				    mask: "currency-int"
				},
				{
				    header: "이윤(￦)",
				    name: "profit_amt",
				    width: 80,
				    align: "right",
				    mask: "currency-int"
				},
				{
				    header: "견적합계(￦)",
				    name: "est_amt",
				    width: 100,
				    align: "right",
				    mask: "currency-int"
				},
				{
				    header: "NEGO율(%)",
				    name: "nego_rate",
				    width: 60,
				    align: "center",
				    mask: "numeric-float"
				},
				{
				    header: "NEGO금액(￦)",
				    name: "nego_cost",
				    width: 100,
				    align: "right",
				    mask: "currency-int"
				},
				{
				    header: "NEGO합계(￦)",
				    name: "nego_amt",
				    width: 100,
				    align: "right",
				    mask: "currency-int"
				},
				{
				    header: "재료비(%)",
				    name: "mat_rate",
				    width: 60,
				    align: "center",
				    mask: "numeric-float"
				},
				{
				    header: "자재금액(￦)",
				    name: "mat_cost",
				    width: 100,
				    align: "right",
				    mask: "currency-int"
				},
				{
				    header: "자재합계(￦)",
				    name: "mat_amt",
				    width: 100,
				    align: "right",
				    mask: "currency-int"
				},
				{
				    header: "견적자재비(%)",
				    name: "est_portion",
				    width: 90,
				    align: "center",
				    mask: "numeric-float"
				},
				{
				    header: "NEGO자재비(%)",
				    name: "nego_portion",
				    width: 90,
				    align: "center",
				    mask: "numeric-float"
				},
				{
				    header: "추가분류(1)",
				    name: "index_div1",
				    width: 150,
				    align: "left"
				},
				{
				    header: "추가분류(2)",
				    name: "index_div2",
				    width: 150,
				    align: "left"
				},
				{
				    header: "추가분류(3)",
				    name: "index_div3",
				    width: 150,
				    align: "left"
				},
				{
				    header: "비고",
				    name: "rmk",
				    width: 400,
				    align: "left"
				},
				{
				    name: "model_class1",
				    hidden: true
				},
				{
				    name: "model_class2",
				    hidden: true
				},
				{
				    name: "model_class3",
				    hidden: true
				},
				{
				    name: "est_key",
				    hidden: true
				},
				{
				    name: "revision",
				    hidden: true
				},
				{
				    name: "model_seq",
				    hidden: true
				}
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_해외을지",
            query: "w_hcem2040_S_1",
            title: "을지 목록 (수출)",
            caption: true,
            height: "100%",
            pager: false,
            number: true,
            show: false,
            selectable: true,
            element: [
				{
				    header: "제품분류",
				    name: "model_nm",
				    width: 270,
				    align: "left",
				    mask: "search"
				},
				{
				    header: "수량",
				    name: "model_qty",
				    width: 50,
				    align: "center",
				    mask: "numeric-int"
				},
				{
				    header: "견적금액($)",
				    name: "est_cost",
				    width: 100,
				    align: "right",
				    mask: "currency-float"
				},
				{
				    header: "관리비($)",
				    name: "manage_cost",
				    width: 80,
				    align: "right",
				    mask: "currency-float"
				},
				{
				    header: "이윤($)",
				    name: "profit_amt",
				    width: 80,
				    align: "right",
				    mask: "currency-float"
				},
				{
				    header: "견적합계($)",
				    name: "est_amt",
				    width: 100,
				    align: "right",
				    mask: "currency-float"
				},
				{
				    header: "NEGO율(%)",
				    name: "nego_rate",
				    width: 60,
				    align: "center",
				    mask: "numeric-float"
				},
				{
				    header: "NEGO금액($)",
				    name: "nego_cost",
				    width: 100,
				    align: "right",
				    mask: "currency-float"
				},
				{
				    header: "NEGO합계($)",
				    name: "nego_amt",
				    width: 100,
				    align: "right",
				    mask: "currency-float"
				},
				{
				    header: "재료비(%)",
				    name: "mat_rate",
				    width: 60,
				    align: "center",
				    mask: "numeric-float"
				},
				{
				    header: "자재금액($)",
				    name: "mat_cost",
				    width: 100,
				    align: "right",
				    mask: "currency-float"
				},
				{
				    header: "자재합계($)",
				    name: "mat_amt",
				    width: 100,
				    align: "right",
				    mask: "currency-float"
				},
				{
				    header: "견적자재비(%)",
				    name: "est_portion",
				    width: 90,
				    align: "center",
				    mask: "numeric-float"
				},
				{
				    header: "NEGO자재비(%)",
				    name: "nego_portion",
				    width: 90,
				    align: "center",
				    mask: "numeric-float"
				},
				{
				    header: "추가분류(1)",
				    name: "index_div1",
				    width: 150,
				    align: "left"
				},
				{
				    header: "추가분류(2)",
				    name: "index_div2",
				    width: 150,
				    align: "left"
				},
				{
				    header: "추가분류(3)",
				    name: "index_div3",
				    width: 150,
				    align: "left"
				},
				{
				    header: "비고",
				    name: "rmk",
				    width: 400,
				    align: "left"
				},
				{
				    name: "model_class1",
				    hidden: true
				},
				{
				    name: "model_class2",
				    hidden: true
				},
				{
				    name: "model_class3",
				    hidden: true
				},
				{
				    name: "est_key",
				    hidden: true
				},
				{
				    name: "revision",
				    hidden: true
				},
				{
				    name: "model_seq",
				    hidden: true
				}
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_국내내역",
            query: "w_hcem2040_D_1",
            title: "세부 내역",
            caption: true,
            height: 545,
            number: true,
            show: true,
            selectable: true,
            group: [
                { element: "title_div2", show: false, summary: true}],
            //nogroup: true,
            element: [
                {
                    header: "분류",
                    name: "title_div2",
                    width: 150,
                    align: "left"
                },
				{
				    header: "품명",
				    name: "mat_nm",
				    width: 200,
				    align: "left",
				    summary: { title: "  ▶ 소계" }
				},
				{
				    header: "규격",
				    name: "mat_spec",
				    width: 200,
				    align: "left"
				},
				{
				    header: "단위",
				    name: "mat_unit",
				    width: 50,
				    align: "center"
				},
				{
				    header: "수량",
				    name: "item_qty",
				    width: 60,
				    align: "right",
				    mask: "numeric-float",
				    summary: { type: "sum" }
				},
				{
				    header: "견적단가(￦)",
				    name: "est_cost",
				    width: 100,
				    align: "right",
				    mask: "currency-int",
				    summary: { type: "sum" }
				},
				{
				    header: "견적금액(￦)",
				    name: "est_amt",
				    width: 100,
				    align: "right",
				    mask: "currency-int",
				    summary: { type: "sum" }
				},
				{
				    header: "자재화폐",
				    name: "monetary_nm",
				    width: 60,
				    align: "center"
				},
				{
				    header: "자재원가",
				    name: "mat_price",
				    width: 100,
				    align: "right",
				    mask: "currency-float"
				},
				{
				    header: "자재단가",
				    name: "mat_ucost",
				    width: 100,
				    align: "right",
				    mask: "currency-float"
				},
				{
				    header: "자재금액",
				    name: "mat_uamt",
				    width: 100,
				    align: "right",
				    mask: "currency-float"
				},
				{
				    header: "자재단가(￦)",
				    name: "mat_cost",
				    width: 100,
				    align: "right",
				    mask: "currency-int",
				    summary: { type: "sum" }
				},
				{
				    header: "자재금액(￦)",
				    name: "mat_amt",
				    width: 100,
				    align: "right",
				    mask: "currency-int",
				    summary: { type: "sum" }
				},
				{
				    header: "자재표시명",
				    name: "mat_tnm",
				    width: 200,
				    align: "left"
				}/*,
				{
				    header: "자재그룹",
				    name: "mat_group",
				    width: 150,
				    align: "center"
				},
				{
				    header: "자재 No.",
				    name: "mat_sno",
				    width: 100,
				    align: "center"
				}*/,
				{
				    header: "비고",
				    name: "rmk",
				    width: 400,
				    align: "left"
				},
				{
				    name: "title_div1",
				    hidden: true
				},
				{
				    name: "sort_num",
				    hidden: true
				},
				{
				    name: "mat_cd",
				    hidden: true
				},
				{
				    name: "mat_categorize",
				    hidden: true
				},
				{
				    name: "mat_maker",
				    hidden: true
				},
				{
				    name: "monetary_unit",
				    hidden: true
				},
				{
				    name: "est_key",
				    hidden: true
				},
				{
				    name: "revision",
				    hidden: true
				},
                {
                    name: "model_seq",
                    hidden: true
                },
				{
				    name: "item_seq",
				    hidden: true
				}
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_해외내역",
            query: "w_hcem2040_D_1",
            title: "세부 내역 (수출)",
            caption: true,
            height: 545,
            number: true,
            show: false,
            selectable: true,
            group: [
                { element: "title_div2", show: false, summary: true}],
            //nogroup: true,
            element: [
                {
                    header: "분류",
                    name: "title_div2",
                    width: 150,
                    align: "left"
                },
				{
				    header: "품명",
				    name: "mat_nm",
				    width: 200,
				    align: "left",
				    summary: { title: "  ▶ 소계" }
				},
				{
				    header: "규격",
				    name: "mat_spec",
				    width: 200,
				    align: "left"
				},
				{
				    header: "단위",
				    name: "mat_unit",
				    width: 50,
				    align: "center"
				},
				{
				    header: "수량",
				    name: "item_qty",
				    width: 60,
				    align: "right",
				    mask: "numeric-float",
				    summary: { type: "sum" }
				},
				{
				    header: "견적단가($)",
				    name: "est_cost",
				    width: 100,
				    align: "right",
				    mask: "currency-float",
				    summary: { type: "sum" }
				},
				{
				    header: "견적금액($)",
				    name: "est_amt",
				    width: 100,
				    align: "right",
				    mask: "currency-float",
				    summary: { type: "sum" }
				},
				{
				    header: "자재화폐",
				    name: "monetary_nm",
				    width: 60,
				    align: "center"
				},
				{
				    header: "자재원가",
				    name: "mat_price",
				    width: 100,
				    align: "right",
				    mask: "currency-float"
				},
				{
				    header: "자재단가",
				    name: "mat_ucost",
				    width: 100,
				    align: "right",
				    mask: "currency-float"
				},
				{
				    header: "자재금액",
				    name: "mat_uamt",
				    width: 100,
				    align: "right",
				    mask: "currency-float"
				},
				{
				    header: "자재단가($)",
				    name: "mat_cost",
				    width: 100,
				    align: "right",
				    mask: "currency-float",
				    summary: { type: "sum" }
				},
				{
				    header: "자재금액($)",
				    name: "mat_amt",
				    width: 100,
				    align: "right",
				    mask: "currency-float",
				    summary: { type: "sum" }
				},
				{
				    header: "자재표시명",
				    name: "mat_tnm",
				    width: 200,
				    align: "left"
				},
				{
				    header: "자재그룹",
				    name: "mat_group",
				    width: 150,
				    align: "center"
				},
				{
				    header: "자재 No.",
				    name: "mat_sno",
				    width: 100,
				    align: "center"
				},
				{
				    header: "비고",
				    name: "rmk",
				    width: 400,
				    align: "left"
				},
				{
				    name: "title_div1",
				    hidden: true
				},
				{
				    name: "sort_num",
				    hidden: true
				},
				{
				    name: "mat_cd",
				    hidden: true
				},
				{
				    name: "mat_categorize",
				    hidden: true
				},
				{
				    name: "mat_maker",
				    hidden: true
				},
				{
				    name: "monetary_unit",
				    hidden: true
				},
				{
				    name: "est_key",
				    hidden: true
				},
				{
				    name: "revision",
				    hidden: true
				},
                {
                    name: "model_seq",
                    hidden: true
                },
                {
                    name: "item_seq",
                    hidden: true
                }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);
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
                    id: "frmData_국내갑지",
                    offset: 8
                },
                {
                    type: "FORM",
                    id: "frmData_해외갑지",
                    offset: 8
                },
                {
                    type: "GRID",
                    id: "grdData_집계",
                    offset: 8
                },
				{
				    type: "GRID",
				    id: "grdData_국내을지",
				    offset: 8
				},
				{
				    type: "GRID",
				    id: "grdData_해외을지",
				    offset: 8
				},
				{
				    type: "GRID",
				    id: "grdData_국내내역",
				    offset: 8
				},
				{
				    type: "GRID",
				    id: "grdData_해외내역",
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
            element: "조회",
            event: "click",
            handler: click_lyrMenu_조회
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
            targetid: "frmOption_1",
            element: "실행",
            event: "click",
            handler: click_frmOption_1_실행
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption_1",
            element: "취소",
            event: "click",
            handler: click_frmOption_취소
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption_2",
            element: "실행",
            event: "click",
            handler: click_frmOption_2_실행
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption_2",
            element: "취소",
            event: "click",
            handler: click_frmOption_취소
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption_1",
            event: "itemdblclick",
            handler: itemdblclick_frmOption_1
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption_1",
            event: "itemkeyenter",
            handler: itemdblclick_frmOption_1
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
            targetid: "grdData_국내을지",
            grid: true,
            event: "rowselected",
            handler: rowselected_grdData_을지
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_해외을지",
            grid: true,
            event: "rowselected",
            handler: rowselected_grdData_을지
        };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_조회(ui) {

            closeOption({ target: ["frmOption_2"] });
            var args = {
                target: [
					{
					    id: "frmOption_1",
					    focus: true
					}
				]
            };
            gw_com_module.objToggle(args);

        }
        //----------
        function click_lyrMenu_출력(ui) {

            closeOption({ target: ["frmOption_1"] });
            var args = {
                target: [
					{
					    id: "frmOption_2",
					    focus: true
					}
				]
            };
            gw_com_module.objToggle(args);

        }
        //----------
        function click_lyrMenu_닫기(ui) {

            checkClosable({});

        }
        //----------
        function click_frmOption_1_실행(ui) {

            processRetrieve({});

        }
        //----------
        function click_frmOption_취소(ui) {

            closeOption({});

        }
        //----------
        function itemdblclick_frmOption_1(ui) {

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
        function click_frmOption_2_실행(ui) {

            if (!checkManipulate({})) return;

            processExport();

        }
        //----------
        function rowselected_grdData_현황(ui) {

            processLink({});

        };
        //----------
        function rowselected_grdData_을지(ui) {

            processLink({ sub: true });

        };

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_api.setValue("frmOption_1", 1, "ymd_fr", gw_com_api.getDate("", { month: -1 }));
        gw_com_api.setValue("frmOption_1", 1, "ymd_to", gw_com_api.getDate("", { month: +1 }));
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
        case "Option":
            return ((use == "1") ? "frmOption_1_2_3_해외" : "frmOption_1_2_3_국내");
        case "갑지":
            return ((use == "1") ? "frmData_해외갑지" : "frmData_국내갑지");
        case "집계":
            return "grdData_집계";
        case "을지":
            return ((use == "1") ? "grdData_해외을지" : "grdData_국내을지");
        case "내역":
            return ((use == "1") ? "grdData_해외내역" : "grdData_국내내역");
    }
    return "";

}
//----------
function toggleObject(param) {

    var use = gw_com_api.getValue("grdData_현황", "selected", "use_div", true);
    if (use == "0") {
        gw_com_api.hide("frmData_해외갑지");
        gw_com_api.hide("grdData_해외을지");
        gw_com_api.hide("grdData_해외내역");
        gw_com_api.show("frmData_국내갑지");
        gw_com_api.show("grdData_집계");
        gw_com_api.show("grdData_국내을지");
        gw_com_api.show("grdData_국내내역");
    }
    else {
        gw_com_api.hide("frmData_국내갑지");
        gw_com_api.hide("grdData_집계");
        gw_com_api.hide("grdData_국내을지");
        gw_com_api.hide("grdData_국내내역");
        gw_com_api.show("frmData_해외갑지");
        gw_com_api.show("grdData_해외을지");
        gw_com_api.show("grdData_해외내역");
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
function checkClosable(param) {

    closeOption({});

    processClose({});

}
//----------
function processRetrieve(param) {

    closeOption({});

    var args = {
        target: [
	        {
	            type: "FORM",
	            id: "frmOption_1"
	        }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    var args = {
        source: {
            type: "FORM",
            id: "frmOption_1",
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
                id: getObject({ name: "갑지" })
            },
            {
                type: "FORM",
                id: getObject({ name: "집계" })
            },
            {
                type: "GRID",
                id: getObject({ name: "을지" })
            },
			{
			    type: "GRID",
			    id: getObject({ name: "내역" })
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
                id: getObject({ name: "을지" }),
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
				    },
				    {
				        name: "model_seq",
				        argument: "arg_model_seq"
				    }
			    ]
            },
            target: [
			    {
			        type: "GRID",
			        id: getObject({ name: "내역" })
			    }
		    ],
            key: param.key
        };
    }
    else {
        toggleObject({});

        args = {
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
            target: [
			    {
			        type: "FORM",
			        id: getObject({ name: "갑지" })
			    },
                {
                    type: "GRID",
                    id: getObject({ name: "집계" })
                },
			    {
			        type: "GRID",
			        id: getObject({ name: "을지" }),
			        select: true
			    }
		    ],
            clear: [
			    {
			        type: "GRID",
			        id: getObject({ name: "내역" })
			    }
		    ],
            key: param.key
        };
    }
    gw_com_module.objRetrieve(args);

}
//----------
function processExport() {

    var args = {
        page: "w_hcem2032",
        source: {
            type: "GRID",
            id: "grdData_현황",
            row: "selected",
            json: true,
            element: [
                { name: "est_key", argument: "arg_est_key" },
                { name: "revision", argument: "arg_revision" }
            ]
        },
        option: [
            { name: "PRINT", value: "XLS" },
            { name: "PAGE", value: "w_hcem2032" },
            { name: "MODEL", value: gw_com_api.getValue("grdData_현황", "selected", "use_div", true) },
            { name: "RULE", value: gw_com_api.getValue("frmOption_2", 1, "amt_rule") }
        ],
        target: {
            type: "FILE",
            id: "lyrDown"
        },
        handler: {
            success: successExport
        }
    };
    gw_com_module.objExport(args);

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

    gw_com_api.hide("frmOption_1");
    gw_com_api.hide("frmOption_2");

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
function successExport(response, param) {

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