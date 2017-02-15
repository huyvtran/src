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
                    type: "PAGE", name: "절사", query: "dddw_zcoded",
                    param: [
                        { argument: "arg_hcode", value: "HCEM12" }
                    ]
                },
                {
                    type: "PAGE", name: "집계", query: "dddw_zcoded",
                    param: [
                        { argument: "arg_hcode", value: "HCEM13" }
                    ]
                },
                {
                    type: "PAGE", name: "화폐", query: "dddw_mat_monetary_unit"
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
				    name: "조회",
				    value: "조회",
				    act: true
				},
				{
				    name: "복사",
				    value: "복사",
				    icon: "실행"
				},
				{
				    name: "저장",
				    value: "저장"
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
            targetid: "lyrMenu_2",
            type: "FREE",
            element: [
                {
                    name: "자재",
                    value: "자재정보 반영",
                    icon: "기타"
                },
                {
                    name: "기준",
                    value: "기준정보 적용",
                    icon: "기타"
                },
                {
                    name: "NEGO",
                    value: "NEGO율 적용",
                    icon: "기타"
                },
				{
				    name: "복사",
				    value: "복사",
				    icon: "실행"
				},
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
            targetid: "lyrMenu_3",
            type: "FREE",
            element: [
                {
                    name: "재료",
                    value: "재료비 적용",
                    icon: "기타"
                },
                {
                    name: "그룹적용",
                    value: "그룹 적용",
                    icon: "실행"
                },
                {
                    name: "그룹해제",
                    value: "그룹 해제",
                    icon: "실행"
                },
				{
				    name: "추가",
				    value: "추가"
				},
				{
				    name: "단가",
				    value: "단가 일괄변경",
				    icon: "실행"
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
            targetid: "frmOption_1_1",
            type: "FREE",
            title: "조회 조건",
            width: "240px",
            trans: true,
            show: true,
            border: true,
            margin: 250,
            editable: {
                focus: "est_nm",
                validate: true
            },
            remark: "lyrRemark_1",
            content: {
                row: [
                    {
                        element: [
				            {
				                name: "est_nm",
				                label: {
				                    title: "견적명 :"
				                },
				                mask: "search",
				                editable: {
				                    type: "text",
				                    size: 20,
				                    readonly: true,
				                    validate: {
				                        rule: "required",
				                        message: "견적명"
				                    }
				                }
				            },
                            {
                                name: "use_div",
                                value: "0",
                                hidden: true
                            },
                            {
                                name: "est_key",
                                hidden: true
                            },
                            {
                                name: "revision",
                                label: {
                                    title: "차수 :"
                                },
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
            targetid: "frmOption_1_2",
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
            targetid: "frmOption_2_1",
            type: "FREE",
            title: "NEGO율",
            trans: true,
            border: true,
            margin: 230,
            editable: {
                focus: "nego_rate",
                validate: true
            },
            content: {
                row: [
                    {
                        align: "center",
                        element: [
				            {
				                name: "nego_rate",
				                label: {
				                    title: "NEGO율(%) :"
				                },
				                editable: {
				                    type: "text",
				                    size: 5,
				                    maxlength: 10,
				                    validate: {
				                        rule: "required",
				                        message: "NEGO율"
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
            targetid: "frmOption_2_2",
            type: "FREE",
            trans: true,
            border: true,
            show: false,
            margin: 80,
            content: {
                row: [
                    {
                        align: "center",
                        element: [
				            {
				                name: "모델",
				                value: "모델 복사",
				                format: {
				                    type: "button",
				                    icon: "기타"
				                }
				            },
                            {
                                name: "을지",
                                value: "견적을지 복사",
                                format: {
                                    type: "button",
                                    icon: "기타"
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
            targetid: "frmOption_2_3_국내",
            type: "FREE",
            title: "기준 정보",
            trans: true,
            border: true,
            margin: 10,
            editable: {
                focus: "profit_rate",
                validate: true
            },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "profit_rate",
                                label: {
                                    title: "이윤(%) :"
                                },
                                editable: {
                                    type: "text",
                                    size: 4,
                                    maxlength: 5,
                                    validate: {
                                        rule: "required",
                                        message: "이윤(%)"
                                    }
                                }
                            },
                            {
                                name: "manage_rate",
                                label: {
                                    title: "관리비(%) :"
                                },
                                editable: {
                                    type: "text",
                                    size: 4,
                                    maxlength: 5,
                                    validate: {
                                        rule: "required",
                                        message: "관리비(%)"
                                    }
                                }
                            },
                            {
                                name: "distribution_rate",
                                label: {
                                    title: "물류비(%) :"
                                },
                                editable: {
                                    type: "text",
                                    size: 4,
                                    maxlength: 5,
                                    validate: {
                                        rule: "required",
                                        message: "물류비(%)"
                                    }
                                }
                            },
                            {
                                name: "duty_rate",
                                label: {
                                    title: "통관비(%) :"
                                },
                                editable: {
                                    type: "text",
                                    size: 4,
                                    maxlength: 5,
                                    validate: {
                                        rule: "required",
                                        message: "통관비(%)"
                                    }
                                }
                            }
				        ]
                    },
                    {
                        element: [
				            {
				                name: "exchange_dt",
				                label: {
				                    title: "환율기준일 :"
				                },
				                mask: "date-ymd",
				                editable: {
				                    type: "text",
				                    size: 7,
				                    maxlength: 10
				                }
				            },
                            {
                                name: "exchange_1",
                                label: {
                                    title: "환율($) :"
                                },
                                editable: {
                                    type: "text",
                                    size: 5,
                                    maxlength: 10,
                                    validate: {
                                        rule: "required",
                                        message: "환율($)"
                                    }
                                }
                            },
                            {
                                name: "exchange_2",
                                label: {
                                    title: "환율(￥) :"
                                },
                                editable: {
                                    type: "text",
                                    size: 5,
                                    maxlength: 10,
                                    validate: {
                                        rule: "required",
                                        message: "환율(￥)"
                                    }
                                }
                            },
                            {
                                name: "est_fix",
                                label: {
                                    title: "견적가고정 :"
                                },
                                editable: {
                                    type: "checkbox",
                                    title: "",
                                    value: "1",
                                    offval: "0"
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
            targetid: "frmOption_2_3_해외",
            type: "FREE",
            title: "기준 정보",
            trans: true,
            border: true,
            margin: 10,
            editable: {
                focus: "profit_rate",
                validate: true
            },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "profit_rate",
                                label: {
                                    title: "이윤(%) :"
                                },
                                editable: {
                                    type: "text",
                                    size: 4,
                                    maxlength: 5,
                                    validate: {
                                        rule: "required",
                                        message: "이윤(%)"
                                    }
                                }
                            },
                            {
                                name: "manage_rate",
                                label: {
                                    title: "관리비(%) :"
                                },
                                editable: {
                                    type: "text",
                                    size: 4,
                                    maxlength: 5,
                                    validate: {
                                        rule: "required",
                                        message: "관리비(%)"
                                    }
                                }
                            },
                            {
                                name: "distribution_rate",
                                label: {
                                    title: "물류비(%) :"
                                },
                                editable: {
                                    type: "text",
                                    size: 4,
                                    maxlength: 5,
                                    validate: {
                                        rule: "required",
                                        message: "물류비(%)"
                                    }
                                }
                            },
                            {
                                name: "duty_rate",
                                label: {
                                    title: "통관비(%) :"
                                },
                                editable: {
                                    type: "text",
                                    size: 4,
                                    maxlength: 5,
                                    validate: {
                                        rule: "required",
                                        message: "통관비(%)"
                                    }
                                }
                            }
				        ]
                    },
                    {
                        element: [
				            {
				                name: "exchange_dt",
				                label: {
				                    title: "환율기준일 :"
				                },
				                mask: "date-ymd",
				                editable: {
				                    type: "text",
				                    size: 7,
				                    maxlength: 10
				                }
				            },
                            {
                                name: "exchange_1",
                                label: {
                                    title: "환율($:￦) :"
                                },
                                editable: {
                                    type: "text",
                                    size: 5,
                                    maxlength: 10,
                                    validate: {
                                        rule: "required",
                                        message: "환율($:￦)"
                                    }
                                }
                            },
                            {
                                name: "exchange_2",
                                label: {
                                    title: "환율($:￥) :"
                                },
                                editable: {
                                    type: "text",
                                    size: 5,
                                    maxlength: 10,
                                    validate: {
                                        rule: "required",
                                        message: "환율($:￥)"
                                    }
                                }
                            },
                            {
                                name: "est_fix",
                                label: {
                                    title: "견적가고정 :"
                                },
                                editable: {
                                    type: "checkbox",
                                    title: "",
                                    value: "1",
                                    offval: "0"
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
            targetid: "frmOption_3_1",
            type: "FREE",
            trans: true,
            border: true,
            margin: 5,
            show: false,
            content: {
                row: [
                    {
                        align: "center",
                        element: [
				            {
				                name: "자재",
				                value: "자재 검색",
				                format: {
				                    type: "button",
				                    icon: "검색"
				                }
				            },
                            {
                                name: "모델",
                                value: "모델내역 검색",
                                format: {
                                    type: "button",
                                    icon: "검색"
                                }
                            },
                            {
                                name: "내역",
                                value: "견적내역 검색",
                                format: {
                                    type: "button",
                                    icon: "검색"
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
            targetid: "frmOption_3_2",
            type: "FREE",
            title: "재료비",
            trans: true,
            border: true,
            margin: 390,
            editable: {
                focus: "mat_rate",
                validate: true
            },
            content: {
                row: [
                    {
                        align: "center",
                        element: [
				            {
				                name: "mat_rate",
				                label: {
				                    title: "재료비(%) :"
				                },
				                editable: {
				                    type: "text",
				                    size: 5,
				                    maxlength: 10,
				                    validate: {
				                        rule: "required",
				                        message: "재료비"
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
            targetid: "frmOption_3_3",
            type: "FREE",
            title: "단가",
            trans: true,
            border: true,
            margin: 10,
            editable: {
                focus: "mat_rate",
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
				                    size: 8,
				                    maxlength: 20,
				                    disable: true
				                }
				            },
                            {
                                name: "mat_nm",
                                label: {
                                    title: "품목명 :"
                                },
                                editable: {
                                    type: "text",
                                    size: 20,
                                    maxlength: 50,
                                    disable: true
                                }
                            },
                            {
                                name: "mat_spec",
                                label: {
                                    title: "규격 :"
                                },
                                editable: {
                                    type: "text",
                                    size: 20,
                                    maxlength: 50,
                                    disable: true
                                }
                            },
                            {
                                name: "prev_cost",
                                label: {
                                    title: "이전단가 :"
                                },
                                editable: {
                                    type: "text",
                                    size: 8,
                                    maxlength: 20,
                                    disable: true
                                }
                            },
                            {
                                name: "est_cost",
                                label: {
                                    title: "변경단가 :"
                                },
                                editable: {
                                    type: "text",
                                    size: 8,
                                    maxlength: 20,
                                    validate: {
                                        rule: "required",
                                        message: "변경단가"
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
            targetid: "frmData_국내갑지",
            query: "w_hcem2030_M_1",
            type: "TABLE",
            title: "갑지 정보",
            caption: true,
            show: true,
            selectable: true,
            editable: {
                bind: "select",
                focus: "pay_cond",
                validate: true
            },
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
                            name: "est_dt", mask: "date-ymd",
                            editable: { type: "text" }
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
                            name: "final_amt", mask: "currency-int",
                            editable: { type: "text" }
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
                            name: "pay_cond",
                            editable: { type: "text" }
                        },
                        {
                            header: true, value: "부가세",
                            format: { type: "label" }
                        },
                        {
                            name: "vat_div",
                            format: { type: "checkbox", title: "별도", value: "1", offval: "0" },
                            editable: { type: "checkbox", title: "별도", value: "1", offval: "0" }
                        },
                        {
                            header: true, value: "납기",
                            format: { type: "label" }
                        },
                        {
                            name: "delivery",
                            editable: { type: "text" }
                        }
                    ]
                    },
                    { element: [
                        {
                            header: true, value: "견적유효기간",
                            format: { type: "label" }
                        },
                        {
                            name: "est_expired",
                            editable: { type: "text" }
                        },
                        {
                            header: true, value: "배송수단",
                            format: { type: "label" }
                        },
                        {
                            name: "shipment",
                            editable: { type: "text" }
                        },
                        {
                            header: true, value: "집계기준",
                            format: { type: "label" }
                        },
                        {
                            name: "sheet_summary",
                            editable: {
                                type: "select",
                                data: { memory: "집계" }
                            }
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
                            format: { type: "textarea", rows: 5, width: 796 },
                            editable: { type: "textarea", rows: 5, width: 796 }
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
                            name: "manage_rate", hidden: true, refer: true
                        },
                        {
                            name: "profit_rate", hidden: true, refer: true
                        },
                        {
                            name: "est_fix", hidden: true, refer: true
                        },
                        {
                            name: "est_key", hidden: true,
                            editable: { type: "hidden" }
                        },
                        {
                            name: "revision", hidden: true,
                            editable: { type: "hidden" }
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
            query: "w_hcem2030_M_1",
            type: "TABLE",
            title: "갑지 정보 (수출)",
            caption: true,
            show: false,
            selectable: true,
            editable: {
                bind: "select",
                focus: "pay_cond",
                validate: true
            },
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
                            name: "est_dt", mask: "date-ymd",
                            editable: { type: "text" }
                        }
                    ]
                    },
                    { element: [
                        {
                            header: true, value: "견적금액($)",
                            format: { type: "label" }
                        },
                        {
                            name: "est_amt", mask: "currency-float",
                            editable: { type: "hidden" }
                        },
                        {
                            header: true, value: "NEGO금액($)",
                            format: { type: "label" }
                        },
                        {
                            name: "nego_amt", mask: "currency-float",
                            editable: { type: "hidden" }
                        },
                        {
                            header: true, value: "최종금액($)",
                            format: { type: "label" }
                        },
                        {
                            name: "final_amt", mask: "currency-float",
                            editable: { type: "text" }
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
                            name: "pay_cond",
                            editable: { type: "text" }
                        },
                        {
                            header: true, value: "납기",
                            format: { type: "label" }
                        },
                        {
                            name: "delivery",
                            editable: { type: "text" }
                        },
                        {
                            header: true, value: "견적유효기간",
                            format: { type: "label" }
                        },
                        {
                            name: "est_expired",
                            editable: { type: "text" }
                        }
                    ]
                    },
                    { element: [
                        {
                            header: true, value: "배송수단",
                            format: { type: "label" }
                        },
                        {
                            name: "shipment",
                            editable: { type: "text" }
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
                            format: { type: "textarea", rows: 5, width: 796 },
                            editable: { type: "textarea", rows: 5, width: 796 }
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
                            name: "manage_rate", hidden: true, refer: true
                        },
                        {
                            name: "profit_rate", hidden: true, refer: true
                        },
                        {
                            name: "est_fix", hidden: true, refer: true
                        },
                        {
                            name: "est_key", hidden: true,
                            editable: { type: "hidden" }
                        },
                        {
                            name: "revision", hidden: true,
                            editable: { type: "hidden" }
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
            query: "w_hcem2030_M_3",
            title: "을지 집계",
            caption: true,
            height: "100%",
            pager: false,
            show: true,
            selectable: true,
            editable: {
                master: true,
                bind: "select",
                focus: "index_group",
                validate: true
            },
            element: [
				{
				    header: "그룹기준",
				    name: "index_group",
				    width: 100,
				    align: "center",
				    format: {
				        type: "select",
				        data: {
				            memory: "집계",
				            unshift: [
                                { title: "없음", value: "" }
                            ]
				        }
				    },
				    editable: {
				        type: "select",
				        data: {
				            memory: "집계",
				            unshift: [
                                { title: "없음", value: "" }
                            ]
				        }
				    }
				},
                {
                    header: "그룹명",
                    name: "index_group_nm",
                    width: 100,
                    align: "center",
                    editable: {
                        type: "text"
                    }
                },
                {
                    header: "집계기준(1)",
                    name: "index_summary1",
                    width: 100,
                    align: "center",
                    format: {
                        type: "select",
                        data: {
                            memory: "집계"
                        }
                    },
                    editable: {
                        type: "select",
                        data: {
                            memory: "집계"
                        }
                    }
                },
                {
                    header: "집계명(1)",
                    name: "index_summary1_nm",
                    width: 100,
                    align: "center",
                    editable: {
                        type: "text"
                    }
                },
                {
                    header: "집계기준(2)",
                    name: "index_summary2",
                    width: 100,
                    align: "center",
                    format: {
                        type: "select",
                        data: {
                            memory: "집계",
                            unshift: [
                                { title: "없음", value: "" }
                            ]
                        }
                    },
                    editable: {
                        type: "select",
                        data: {
                            memory: "집계",
                            unshift: [
                                { title: "없음", value: "" }
                            ]
                        }
                    }
                },
                {
                    header: "집계명(2)",
                    name: "index_summary2_nm",
                    width: 100,
                    align: "center",
                    editable: {
                        type: "text"
                    }
                },
				{
				    name: "est_key",
				    hidden: true,
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    name: "revision",
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
            targetid: "grdData_국내을지",
            query: "w_hcem2030_S_1",
            title: "을지 목록",
            caption: true,
            height: "100%",
            pager: false,
            show: true,
            selectable: true,
            editable: {
                master: true,
                bind: "select",
                focus: "model_nm",
                validate: true
            },
            element: [
                {
                    header: "순번",
                    name: "sort_seq",
                    width: 40,
                    align: "center",
                    editable: {
                        type: "text",
                        validate: { rule: "required" }
                    }
                },
				{
				    header: "제품분류",
				    name: "model_nm",
				    width: 240,
				    align: "left",
				    mask: "search",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "제품분류"
				        }
				    }
				},
				{
				    header: "수량",
				    name: "model_qty",
				    width: 40,
				    align: "center",
				    mask: "numeric-int",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "수량"
				        }
				    }
				},
				{
				    header: "견적금액(￦)",
				    name: "est_cost",
				    width: 90,
				    align: "right",
				    mask: "currency-int",
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    header: "관리비(￦)",
				    name: "manage_cost",
				    width: 80,
				    align: "right",
				    mask: "currency-int",
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    header: "이윤(￦)",
				    name: "profit_amt",
				    width: 80,
				    align: "right",
				    mask: "currency-int",
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    header: "견적합계(￦)",
				    name: "est_amt",
				    width: 90,
				    align: "right",
				    mask: "currency-int",
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    header: "NEGO율(%)",
				    name: "nego_rate",
				    width: 60,
				    align: "center",
				    mask: "numeric-float",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "NEGE율"
				        }
				    }
				},
				{
				    header: "NEGO금액(￦)",
				    name: "nego_cost",
				    width: 90,
				    align: "right",
				    mask: "currency-int",
				    editable: {
				        type: "text"
				    }
				},
				{
				    header: "NEGO합계(￦)",
				    name: "nego_amt",
				    width: 90,
				    align: "right",
				    mask: "currency-int",
				    editable: {
				        type: "hidden"
				    }
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
				    width: 90,
				    align: "right",
				    mask: "currency-int",
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    header: "자재합계(￦)",
				    name: "mat_amt",
				    width: 90,
				    align: "right",
				    mask: "currency-int",
				    editable: {
				        type: "hidden"
				    }
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
				    align: "left",
				    editable: {
				        type: "text"
				    }
				},
				{
				    header: "추가분류(2)",
				    name: "index_div2",
				    width: 150,
				    align: "left",
				    editable: {
				        type: "text"
				    }
				},
				{
				    header: "추가분류(3)",
				    name: "index_div3",
				    width: 150,
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
				    name: "model_class1",
				    hidden: true,
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    name: "model_class2",
				    hidden: true,
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    name: "model_class3",
				    hidden: true,
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    name: "est_key",
				    hidden: true,
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    name: "revision",
				    hidden: true,
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    name: "model_seq",
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
            targetid: "grdData_해외을지",
            query: "w_hcem2030_S_1",
            title: "을지 목록 (수출)",
            caption: true,
            height: "100%",
            pager: false,
            show: false,
            selectable: true,
            editable: {
                master: true,
                bind: "select",
                focus: "model_nm",
                validate: true
            },
            element: [
                {
                    header: "순번",
                    name: "sort_seq",
                    width: 40,
                    align: "center",
                    editable: {
                        type: "text",
                        validate: { rule: "required" }
                    }
                },
				{
				    header: "제품분류",
				    name: "model_nm",
				    width: 240,
				    align: "left",
				    mask: "search",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "제품분류"
				        }
				    }
				},
				{
				    header: "수량",
				    name: "model_qty",
				    width: 40,
				    align: "center",
				    mask: "numeric-int",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "수량"
				        }
				    }
				},
				{
				    header: "견적금액($)",
				    name: "est_cost",
				    width: 90,
				    align: "right",
				    mask: "currency-float",
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    header: "관리비($)",
				    name: "manage_cost",
				    width: 80,
				    align: "right",
				    mask: "currency-float",
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    header: "이윤($)",
				    name: "profit_amt",
				    width: 80,
				    align: "right",
				    mask: "currency-float",
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    header: "견적합계($)",
				    name: "est_amt",
				    width: 90,
				    align: "right",
				    mask: "currency-float",
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    header: "NEGO율(%)",
				    name: "nego_rate",
				    width: 60,
				    align: "center",
				    mask: "numeric-float",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "NEGE율"
				        }
				    }
				},
				{
				    header: "NEGO금액($)",
				    name: "nego_cost",
				    width: 90,
				    align: "right",
				    mask: "currency-float",
				    editable: {
				        type: "text"
				    }
				},
				{
				    header: "NEGO합계($)",
				    name: "nego_amt",
				    width: 90,
				    align: "right",
				    mask: "currency-float",
				    editable: {
				        type: "hidden"
				    }
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
				    width: 90,
				    align: "right",
				    mask: "currency-float",
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    header: "자재합계($)",
				    name: "mat_amt",
				    width: 90,
				    align: "right",
				    mask: "currency-float",
				    editable: {
				        type: "hidden"
				    }
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
				    align: "left",
				    editable: {
				        type: "text"
				    }
				},
				{
				    header: "추가분류(2)",
				    name: "index_div2",
				    width: 150,
				    align: "left",
				    editable: {
				        type: "text"
				    }
				},
				{
				    header: "추가분류(3)",
				    name: "index_div3",
				    width: 150,
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
				    name: "model_class1",
				    hidden: true,
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    name: "model_class2",
				    hidden: true,
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    name: "model_class3",
				    hidden: true,
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    name: "est_key",
				    hidden: true,
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    name: "revision",
				    hidden: true,
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    name: "model_seq",
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
            targetid: "grdData_국내내역",
            query: "w_hcem2030_D_1",
            title: "세부 내역",
            caption: true,
            height: 545,
            show: true,
            selectable: true,
            group: [
                { element: "title_div2", show: true, summary: true}],
            nogroup: true,
            editable: {
                bind: "select",
                focus: "title_div2",
                validate: true
            },
            element: [
                {
                    header: "순번",
                    name: "sort_seq",
                    width: 40,
                    align: "center",
                    editable: {
                        type: "text",
                        validate: { rule: "required" }
                    }
                },
                {
                    header: "분류",
                    name: "title_div2",
                    width: 150,
                    align: "left",
                    editable: {
                        type: "text",
                        validate: {
                            rule: "required",
                            message: "분류"
                        }
                    }
                },
				{
				    header: "품명",
				    name: "mat_nm",
				    width: 200,
				    align: "left",
				    editable: {
				        type: "hidden"
				    },
				    summary: { title: "  ▶ 소계" }
				},
				{
				    header: "규격",
				    name: "mat_spec",
				    width: 200,
				    align: "left",
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    header: "단위",
				    name: "mat_unit",
				    width: 50,
				    align: "center",
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    header: "수량",
				    name: "item_qty",
				    width: 60,
				    align: "right",
				    mask: "numeric-float",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "수량"
				        }
				    },
				    summary: { type: "sum" }
				},
				{
				    header: "견적단가(￦)",
				    name: "est_cost",
				    width: 100,
				    align: "right",
				    mask: "currency-int",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "견적단가"
				        }
				    },
				    summary: { type: "sum" }
				},
				{
				    header: "견적금액(￦)",
				    name: "est_amt",
				    width: 100,
				    align: "right",
				    mask: "currency-int",
				    editable: {
				        type: "hidden"
				    },
				    summary: { type: "sum" }
				},
				{
				    header: "자재화폐",
				    name: "monetary_nm",
				    width: 60,
				    align: "center",
				    format: {
				        type: "select",
				        data: {
				            memory: "화폐"
				        }
				    }
				},
				{
				    header: "자재원가",
				    name: "mat_price",
				    width: 100,
				    align: "right",
				    mask: "currency-float",
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    header: "자재단가",
				    name: "mat_ucost",
				    width: 100,
				    align: "right",
				    mask: "currency-float",
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    header: "자재금액",
				    name: "mat_uamt",
				    width: 100,
				    align: "right",
				    mask: "currency-float",
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    header: "자재단가(￦)",
				    name: "mat_cost",
				    width: 100,
				    align: "right",
				    mask: "currency-int",
				    editable: {
				        type: "hidden"
				    },
				    summary: { type: "sum" }
				},
				{
				    header: "자재금액(￦)",
				    name: "mat_amt",
				    width: 100,
				    align: "right",
				    mask: "currency-int",
				    editable: {
				        type: "hidden"
				    },
				    summary: { type: "sum" }
				},
				{
				    header: "자재표시명",
				    name: "mat_tnm",
				    width: 200,
				    align: "left",
				    editable: {
				        type: "text"
				    }
				}/*,
				{
				    header: "자재그룹",
				    name: "mat_group",
				    width: 150,
				    align: "center",
				    editable: {
				        type: "text"
				    }
				},
				{
				    header: "자재 No.",
				    name: "mat_sno",
				    width: 100,
				    align: "center",
				    editable: {
				        type: "text"
				    }
				}*/,
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
				    name: "title_div1",
				    hidden: true,
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    name: "sort_num",
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
				},
				{
				    name: "mat_categorize",
				    hidden: true,
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    name: "mat_maker",
				    hidden: true,
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    name: "monetary_unit",
				    hidden: true,
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    name: "est_key",
				    hidden: true,
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    name: "revision",
				    hidden: true,
				    editable: {
				        type: "hidden"
				    }
				},
                {
                    name: "model_seq",
                    hidden: true,
                    editable: {
                        type: "hidden"
                    }
                },
				{
				    name: "item_seq",
				    hidden: true,
				    editable: {
				        type: "hidden"
				    }
				}
			]
        };
        //----------
        gw_com_module.sheetCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_해외내역",
            query: "w_hcem2030_D_1",
            title: "세부 내역 (수출)",
            caption: true,
            height: 545,
            show: false,
            selectable: true,
            group: [
                { element: "title_div2", show: true, summary: true}],
            nogroup: true,
            editable: {
                bind: "select",
                focus: "title_div2",
                validate: true
            },
            element: [
                {
                    header: "순번",
                    name: "sort_seq",
                    width: 40,
                    align: "center",
                    editable: {
                        type: "text",
                        validate: { rule: "required" }
                    }
                },
                {
                    header: "분류",
                    name: "title_div2",
                    width: 150,
                    align: "left",
                    editable: {
                        type: "text",
                        validate: {
                            rule: "required",
                            message: "분류"
                        }
                    }
                },
				{
				    header: "품명",
				    name: "mat_nm",
				    width: 200,
				    align: "left",
				    editable: {
				        type: "hidden"
				    },
				    summary: { title: "  ▶ 소계" }
				},
				{
				    header: "규격",
				    name: "mat_spec",
				    width: 200,
				    align: "left",
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    header: "단위",
				    name: "mat_unit",
				    width: 50,
				    align: "center",
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    header: "수량",
				    name: "item_qty",
				    width: 60,
				    align: "right",
				    mask: "numeric-float",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "수량"
				        }
				    },
				    summary: { type: "sum" }
				},
				{
				    header: "견적단가($)",
				    name: "est_cost",
				    width: 100,
				    align: "right",
				    mask: "currency-float",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "견적단가"
				        }
				    },
				    summary: { type: "sum" }
				},
				{
				    header: "견적금액($)",
				    name: "est_amt",
				    width: 100,
				    align: "right",
				    mask: "currency-float",
				    editable: {
				        type: "hidden"
				    },
				    summary: { type: "sum" }
				},
				{
				    header: "자재화폐",
				    name: "monetary_nm",
				    width: 60,
				    align: "center",
				    format: {
				        type: "select",
				        data: {
				            memory: "화폐"
				        }
				    }
				},
				{
				    header: "자재원가",
				    name: "mat_price",
				    width: 100,
				    align: "right",
				    mask: "currency-float",
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    header: "자재단가",
				    name: "mat_ucost",
				    width: 100,
				    align: "right",
				    mask: "currency-float",
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    header: "자재금액",
				    name: "mat_uamt",
				    width: 100,
				    align: "right",
				    mask: "currency-float",
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    header: "자재단가($)",
				    name: "mat_cost",
				    width: 100,
				    align: "right",
				    mask: "currency-float",
				    editable: {
				        type: "hidden"
				    },
				    summary: { type: "sum" }
				},
				{
				    header: "자재금액($)",
				    name: "mat_amt",
				    width: 100,
				    align: "right",
				    mask: "currency-float",
				    editable: {
				        type: "hidden"
				    },
				    summary: { type: "sum" }
				},
				{
				    header: "자재표시명",
				    name: "mat_tnm",
				    width: 200,
				    align: "left",
				    editable: {
				        type: "text"
				    }
				},
				{
				    header: "자재그룹",
				    name: "mat_group",
				    width: 150,
				    align: "center",
				    editable: {
				        type: "text"
				    }
				},
				{
				    header: "자재 No.",
				    name: "mat_sno",
				    width: 100,
				    align: "center",
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
				    name: "title_div1",
				    hidden: true,
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    name: "sort_num",
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
				},
				{
				    name: "mat_categorize",
				    hidden: true,
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    name: "mat_maker",
				    hidden: true,
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    name: "monetary_unit",
				    hidden: true,
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    name: "est_key",
				    hidden: true,
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    name: "revision",
				    hidden: true,
				    editable: {
				        type: "hidden"
				    }
				},
                {
                    name: "model_seq",
                    hidden: true,
                    editable: {
                        type: "hidden"
                    }
                },
                {
                    name: "item_seq",
                    hidden: true,
                    editable: {
                        type: "hidden"
                    }
                }
			]
        };
        //----------
        gw_com_module.sheetCreate(args);
        //=====================================================================================
        var args = {
            targetid: "lyrDown",
            width: 0,
            height: 0,
            show: false
        };
        gw_com_module.pageCreate(args);
        //=====================================================================================
        var args = {
            targetid: "lyrRemark_2",
            row: [
 				{
 				    name: "기준정보"
 				}
			]
        };
        //----------
        gw_com_module.labelCreate(args);
        //=====================================================================================
        var args = {
            target: [
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
            targetid: "lyrMenu_1",
            element: "조회",
            event: "click",
            handler: click_lyrMenu_1_조회
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_1",
            element: "복사",
            event: "click",
            handler: click_lyrMenu_1_복사
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
            element: "출력",
            event: "click",
            handler: click_lyrMenu_1_출력
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_1",
            element: "닫기",
            event: "click",
            handler: click_lyrMenu_닫기
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_2",
            element: "기준",
            event: "click",
            handler: click_lyrMenu_2_기준
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_2",
            element: "자재",
            event: "click",
            handler: click_lyrMenu_2_자재
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_2",
            element: "NEGO",
            event: "click",
            handler: click_lyrMenu_2_NEGO
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_2",
            element: "복사",
            event: "click",
            handler: click_lyrMenu_2_복사
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
            targetid: "lyrMenu_2",
            element: "닫기",
            event: "click",
            handler: click_lyrMenu_닫기
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_3",
            element: "재료",
            event: "click",
            handler: click_lyrMenu_3_재료
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_3",
            element: "그룹적용",
            event: "click",
            handler: click_lyrMenu_3_그룹적용
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_3",
            element: "그룹해제",
            event: "click",
            handler: click_lyrMenu_3_그룹해제
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
            element: "단가",
            event: "click",
            handler: click_lyrMenu_3_단가
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
            targetid: "lyrMenu_3",
            element: "닫기",
            event: "click",
            handler: click_lyrMenu_닫기
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption_1_1",
            element: "실행",
            event: "click",
            handler: click_frmOption_1_1_실행
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption_1_1",
            element: "취소",
            event: "click",
            handler: click_frmOption_취소
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption_1_1",
            event: "itemdblclick",
            handler: itemdblclick_frmOption_1_1
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption_1_1",
            event: "itemkeyenter",
            handler: itemdblclick_frmOption_1_1
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption_1_2",
            element: "실행",
            event: "click",
            handler: click_frmOption_1_2_실행
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption_1_2",
            element: "취소",
            event: "click",
            handler: click_frmOption_취소
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption_2_1",
            element: "실행",
            event: "click",
            handler: click_frmOption_2_1_실행
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption_2_1",
            element: "취소",
            event: "click",
            handler: click_frmOption_취소
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption_2_2",
            element: "모델",
            event: "click",
            handler: click_frmOption_2_2_모델
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption_2_2",
            element: "을지",
            event: "click",
            handler: click_frmOption_2_2_을지
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption_2_3_국내",
            element: "실행",
            event: "click",
            handler: click_frmOption_2_3_실행
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption_2_3_국내",
            element: "취소",
            event: "click",
            handler: click_frmOption_2_3_취소
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption_2_3_해외",
            element: "실행",
            event: "click",
            handler: click_frmOption_2_3_실행
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption_2_3_해외",
            element: "취소",
            event: "click",
            handler: click_frmOption_2_3_취소
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption_3_1",
            element: "자재",
            event: "click",
            handler: click_frmOption_3_1_자재
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption_3_1",
            element: "모델",
            event: "click",
            handler: click_frmOption_3_1_모델
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption_3_1",
            element: "내역",
            event: "click",
            handler: click_frmOption_3_1_내역
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption_3_2",
            element: "실행",
            event: "click",
            handler: click_frmOption_3_2_실행
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption_3_2",
            element: "취소",
            event: "click",
            handler: click_frmOption_3_2_취소
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption_3_3",
            element: "실행",
            event: "click",
            handler: click_frmOption_3_3_실행
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption_3_3",
            element: "취소",
            event: "click",
            handler: click_frmOption_3_3_취소
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_국내을지",
            grid: true,
            event: "rowselecting",
            handler: rowselecting_grdData_을지
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
            targetid: "grdData_국내을지",
            grid: true,
            event: "itemchanged",
            handler: itemchanged_grdData_을지
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_국내을지",
            grid: true,
            event: "itemdblclick",
            handler: itemdblclick_grdData_을지
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_국내을지",
            grid: true,
            event: "itemkeyenter",
            handler: itemdblclick_grdData_을지
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_국내내역",
            grid: true,
            event: "itemchanged",
            handler: itemchanged_grdData_내역
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_해외을지",
            grid: true,
            event: "rowselecting",
            handler: rowselecting_grdData_을지
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
        //----------
        var args = {
            targetid: "grdData_해외을지",
            grid: true,
            event: "itemchanged",
            handler: itemchanged_grdData_을지
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_해외을지",
            grid: true,
            event: "itemdblclick",
            handler: itemdblclick_grdData_을지
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_해외을지",
            grid: true,
            event: "itemkeyenter",
            handler: itemdblclick_grdData_을지
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_해외내역",
            grid: true,
            event: "itemchanged",
            handler: itemchanged_grdData_내역
        };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_1_조회(ui) {

            closeOption({ target: ["frmOption_1_2"] });
            closeOption({ target: ["frmOption_2_1"] });
            closeOption({ target: ["frmOption_2_2"] });
            closeOption({ target: [getObject({ name: "Option" })] });
            closeOption({ target: ["frmOption_3_1"] });
            closeOption({ target: ["frmOption_3_2"] });
            closeOption({ target: ["frmOption_3_3"] });

            var args = {
                target: [
					{
					    id: "frmOption_1_1",
					    focus: true
					}
				]
            };
            gw_com_module.objToggle(args);

        }
        //----------
        function click_lyrMenu_1_복사(ui) {

            if (!checkManipulate({})) return;
            if (!checkUpdatable({ check: true })) return false;

            var args = {
                type: "PAGE",
                page: "w_find_est_copy",
                title: "견적서 복사",
                width: 840,
                height: 1060,
                open: true
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = {
                    page: "w_find_est_copy",
                    param: {
                        ID: gw_com_api.v_Stream.msg_copyPreEstimate,
                        data: {
                            user: gw_com_module.v_Session.USR_ID,
                            est_key: gw_com_api.getValue(getObject({ name: "갑지" }), 1, "est_key"),
                            revision: gw_com_api.getValue(getObject({ name: "갑지" }), 1, "revision")
                        }
                    }
                };
                gw_com_module.dialogueOpen(args);
            }

        }
        //----------
        function click_lyrMenu_1_저장(ui) {

            closeOption({});

            processSave();

        }
        //----------
        function click_lyrMenu_1_출력(ui) {

            closeOption({ target: ["frmOption_1_1"] });
            closeOption({ target: ["frmOption_2_1"] });
            closeOption({ target: ["frmOption_2_2"] });
            closeOption({ target: [getObject({ name: "Option" })] });
            closeOption({ target: ["frmOption_3_1"] });
            closeOption({ target: ["frmOption_3_2"] });
            closeOption({ target: ["frmOption_3_3"] });

            var args = {
                target: [
					{
					    id: "frmOption_1_2",
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
        function click_lyrMenu_2_기준(ui) {

            closeOption({ target: ["frmOption_1_1"] });
            closeOption({ target: ["frmOption_1_2"] });
            closeOption({ target: ["frmOption_2_1"] });
            closeOption({ target: ["frmOption_2_2"] });
            closeOption({ target: ["frmOption_3_1"] });
            closeOption({ target: ["frmOption_3_2"] });
            closeOption({ target: ["frmOption_3_3"] });

            var args = {
                target: [
					{
					    id: getObject({ name: "Option" }),
					    focus: true
					}
				]
            };
            gw_com_module.objToggle(args);

        }
        //----------
        function click_lyrMenu_2_자재(ui) {

            closeOption({});

            if (!checkUpdatable({ check: true })) return false;

            checkBatchable({ mat: true });

        }
        //----------
        function click_lyrMenu_2_NEGO(ui) {

            closeOption({ target: ["frmOption_1_1"] });
            closeOption({ target: ["frmOption_1_2"] });
            closeOption({ target: ["frmOption_2_2"] });
            closeOption({ target: [getObject({ name: "Option" })] });
            closeOption({ target: ["frmOption_3_1"] });
            closeOption({ target: ["frmOption_3_2"] });
            closeOption({ target: ["frmOption_3_3"] });

            var args = {
                target: [
					{
					    id: "frmOption_2_1",
					    focus: true
					}
				]
            };
            gw_com_module.objToggle(args);

        }
        //----------
        function click_lyrMenu_2_복사(ui) {

            closeOption({ target: ["frmOption_1_1"] });
            closeOption({ target: ["frmOption_1_2"] });
            closeOption({ target: ["frmOption_2_1"] });
            closeOption({ target: [getObject({ name: "Option" })] });
            closeOption({ target: ["frmOption_3_1"] });
            closeOption({ target: ["frmOption_3_2"] });
            closeOption({ target: ["frmOption_3_3"] });

            var args = {
                target: [
					{
					    id: "frmOption_2_2"
					}
				]
            };
            gw_com_module.objToggle(args);

        }
        //----------
        function click_lyrMenu_2_추가(ui) {

            v_global.process.handler = processInsert;

            if (!checkUpdatable({ sub: true })) return;

            processInsert({});

        }
        //----------
        function click_lyrMenu_2_삭제(ui) {

            if (!checkManipulate({ sub: true })) return;

            v_global.process.handler = processRemove;

            checkRemovable({});

        }
        //----------
        function click_lyrMenu_3_재료(ui) {

            closeOption({ target: ["frmOption_1_1"] });
            closeOption({ target: ["frmOption_1_2"] });
            closeOption({ target: ["frmOption_2_1"] });
            closeOption({ target: ["frmOption_2_2"] });
            closeOption({ target: [getObject({ name: "Option" })] });
            closeOption({ target: ["frmOption_3_1"] });
            closeOption({ target: ["frmOption_3_3"] });

            var args = {
                target: [
					{
					    id: "frmOption_3_2",
					    focus: true
					}
				]
            };
            gw_com_module.objToggle(args);

        }
        //----------
        function click_lyrMenu_3_그룹적용(ui) {

            if (!checkManipulate({ sub: true })) return;
            if (!checkbeGroup({})) return;
            if (!checkUpdatable({ sub: true, check: true })) return false;

            $("#" + getObject({ name: "내역" }) + "_data").jqGrid('groupingGroupBy', "title_div2");
            gw_com_api.hide(ui.object, ui.element);
            gw_com_api.show(ui.object, "그룹해제");

            gw_com_module.informSize();

        }
        //----------
        function click_lyrMenu_3_그룹해제(ui) {

            if (!checkManipulate({ sub: true })) return;

            $("#" + getObject({ name: "내역" }) + "_data").jqGrid('groupingRemove', true);
            gw_com_api.hide(ui.object, ui.element);
            gw_com_api.show(ui.object, "그룹적용");

            gw_com_module.informSize();

        }
        //----------
        function click_lyrMenu_3_추가(ui) {

            closeOption({ target: ["frmOption_1_1"] });
            closeOption({ target: ["frmOption_1_2"] });
            closeOption({ target: ["frmOption_2_1"] });
            closeOption({ target: ["frmOption_2_2"] });
            closeOption({ target: [getObject({ name: "Option" })] });
            closeOption({ target: ["frmOption_3_2"] });
            closeOption({ target: ["frmOption_3_3"] });

            var args = {
                target: [
					{
					    id: "frmOption_3_1"
					}
				]
            };
            gw_com_module.objToggle(args);

        }
        //----------
        function click_lyrMenu_3_단가(ui) {

            if (gw_com_api.getSelectedRow(getObject({ name: "내역" })) == null) {
                gw_com_api.messageBox([
                    { text: "변경할 품목이 선택되지 않았습니다." }
                ], 350);
                return false;
            }

            closeOption({ target: ["frmOption_1_1"] });
            closeOption({ target: ["frmOption_1_2"] });
            closeOption({ target: ["frmOption_2_1"] });
            closeOption({ target: ["frmOption_2_2"] });
            closeOption({ target: [getObject({ name: "Option" })] });
            closeOption({ target: ["frmOption_3_1"] });
            closeOption({ target: ["frmOption_3_2"] });

            var args = {
                target: [
					{
					    id: "frmOption_3_3"
					}
				]
            };
            gw_com_module.objToggle(args);

            gw_com_api.setValue("frmOption_3_3", 1, "mat_cd",
                                gw_com_api.getValue(getObject({ name: "내역" }), "selected", "mat_cd", true));
            gw_com_api.setValue("frmOption_3_3", 1, "mat_nm",
                                gw_com_api.getValue(getObject({ name: "내역" }), "selected", "mat_nm", true));
            gw_com_api.setValue("frmOption_3_3", 1, "mat_spec",
                                gw_com_api.getValue(getObject({ name: "내역" }), "selected", "mat_spec", true));
            gw_com_api.setValue("frmOption_3_3", 1, "prev_cost",
                                gw_com_api.getValue(getObject({ name: "내역" }), "selected", "est_cost", true));
            gw_com_api.setValue("frmOption_3_3", 1, "est_cost", "");

        }
        //----------
        function click_lyrMenu_3_삭제(ui) {

            if (!checkManipulate({ sub: true })) return;
            if (gw_com_api.getSelectedRow(getObject({ name: "내역" })) == null) {
                gw_com_api.messageBox([
                    { text: "삭제할 데이터가 선택되지 않았습니다." }
                ]);
                return false;
            }

            if (gw_com_api.getValue(getObject({ name: "내역" }), "selected", "mat_categorize", true) == "0")
                applySummary({ by: "MAT", diff: (-1) * getAmount({ obj: "내역", row: "selected", name: "mat_amt", grid: true }) });
            applySummary({ by: "EST", diff: (-1) * getAmount({ obj: "내역", row: "selected", name: "est_amt", grid: true }) });

            var args = {
                targetid: getObject({ name: "내역" }),
                row: "selected"
            }
            gw_com_module.gridDelete(args);

        }
        //----------
        function click_frmOption_1_1_실행(ui) {

            v_global.process.handler = processRetrieve;

            if (!checkUpdatable({})) return false;

            processRetrieve({});

        }
        //----------
        function click_frmOption_취소(ui) {

            closeOption({});

        }
        //----------
        function itemdblclick_frmOption_1_1(ui) {

            switch (ui.element) {
                case "est_nm":
                    {
                        v_global.event.type = ui.type;
                        v_global.event.object = ui.object;
                        v_global.event.row = ui.row;
                        v_global.event.element = ui.element;
                        var args = {
                            type: "PAGE",
                            page: "w_find_est_info",
                            title: "견적정보 검색",
                            width: 850,
                            height: 500,
                            locate: ["center", "top"],
                            open: true
                        };
                        if (gw_com_module.dialoguePrepare(args) == false) {
                            var args = {
                                page: "w_find_est_info",
                                param: {
                                    ID: gw_com_api.v_Stream.msg_selectEstimate/*,
                                    data: {
                                        est_nm: gw_com_api.getValue(ui.object, ui.row, ui.element)
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
        function click_frmOption_1_2_실행(ui) {

            if (!checkManipulate({})) return;
            if (!checkUpdatable({ check: true })) return false;
            if (!checkExportable({})) return;

            processExport();

        }
        //----------
        function click_frmOption_2_1_실행(ui) {

            closeOption({});

            if (gw_com_api.getRowCount(getObject({ name: "을지" })) == null) {
                gw_com_api.messageBox([
                    { text: "적용할 내역이 없습니다." }
                ]);
                return;
            }

            var rate = gw_com_api.getValue("frmOption_2_1", 1, "nego_rate");
            var obj = getObject({ name: "을지" });
            for (var i = 1; i <= gw_com_api.getRowCount(obj); i++) {
                var row = i * 1;
                gw_com_module.gridEdit({
                    targetid: obj,
                    row: row,
                    edit: true
                });
                gw_com_api.setValue(
                    obj,
                    row,
                    "nego_rate",
                    rate,
                    true
                );
            }

        }
        //----------
        function click_frmOption_2_2_모델() {

            if (!checkManipulate({})) return;
            if (!checkUpdatable({ check: true })) return false;

            var args = {
                type: "PAGE",
                page: "w_find_model_copy",
                title: "모델 복사",
                width: 840,
                height: 940,
                open: true
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = {
                    page: "w_find_model_copy",
                    param: {
                        ID: gw_com_api.v_Stream.msg_copyPreModel,
                        data: {
                            user: gw_com_module.v_Session.USR_ID,
                            est_key: gw_com_api.getValue(getObject({ name: "갑지" }), 1, "est_key"),
                            revision: gw_com_api.getValue(getObject({ name: "갑지" }), 1, "revision")
                        }
                    }
                };
                gw_com_module.dialogueOpen(args);
            }
        }
        //----------
        function click_frmOption_2_2_을지() {

            if (!checkManipulate({})) return;
            if (!checkUpdatable({ check: true })) return false;

            var args = {
                type: "PAGE",
                page: "w_find_index_copy",
                title: "견적을지 복사",
                width: 900,
                height: 940,
                open: true
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = {
                    page: "w_find_index_copy",
                    param: {
                        ID: gw_com_api.v_Stream.msg_copyPreIndex,
                        data: {
                            user: gw_com_module.v_Session.USR_ID,
                            est_key: gw_com_api.getValue(getObject({ name: "갑지" }), 1, "est_key"),
                            revision: gw_com_api.getValue(getObject({ name: "갑지" }), 1, "revision")
                        }
                    }
                };
                gw_com_module.dialogueOpen(args);
            }

        }
        //----------
        function click_frmOption_2_3_실행(ui) {

            if (!checkUpdatable({ check: true })) return false;

            checkBatchable({ env: true });

        }
        //----------
        function click_frmOption_2_3_취소(ui) {

            closeOption({});

            restoreOption({ to: "ENV" });

        }
        //----------
        function click_frmOption_3_1_자재() {

            closeOption({});

            if (!checkManipulate({ sub: true })) return;

            var args = {
                type: "PAGE",
                page: "w_find_mat",
                title: "자재 검색",
                width: 790,
                height: 890,
                open: true
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = {
                    page: "w_find_mat",
                    param: {
                        ID: gw_com_api.v_Stream.msg_selecttoEstimate
                    }
                };
                gw_com_module.dialogueOpen(args);
            }

        }
        //----------
        function click_frmOption_3_1_모델() {

            closeOption({});

            if (!checkManipulate({ sub: true })) return;

            var args = {
                type: "PAGE",
                page: "w_find_model_detail",
                title: "모델내역 검색",
                width: 900,
                height: 870,
                open: true
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = {
                    page: "w_find_model_detail",
                    param: {
                        ID: gw_com_api.v_Stream.msg_selectPreModel,
                        data: {
                            user: gw_com_module.v_Session.USR_ID,
                            est_key: gw_com_api.getValue(getObject({ name: "갑지" }), 1, "est_key"),
                            revision: gw_com_api.getValue(getObject({ name: "갑지" }), 1, "revision")
                        }
                    }
                };
                gw_com_module.dialogueOpen(args);
            }

        }
        //----------
        function click_frmOption_3_1_내역() {

            closeOption({});

            if (!checkManipulate({ sub: true })) return;

            var args = {
                type: "PAGE",
                page: "w_find_est_detail",
                title: "견적내역 검색",
                width: 900,
                height: 870,
                open: true
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = {
                    page: "w_find_est_detail",
                    param: {
                        ID: gw_com_api.v_Stream.msg_selectPreEstimate
                    }
                };
                gw_com_module.dialogueOpen(args);
            }

        }
        //----------
        function click_frmOption_3_2_실행(ui) {

            closeOption({});

            if (!checkUpdatable({ check: true })) return false;

            checkBatchable({ est: true });

        }
        //----------
        function click_frmOption_3_2_취소(ui) {

            closeOption({});

            restoreOption({ to: "EST" });

        }
        //----------
        function click_frmOption_3_3_실행(ui) {

            closeOption({});

            if (!checkUpdatable({ check: true })) return false;

            checkBatchable({ cost: true });

        }
        //----------
        function click_frmOption_3_3_취소(ui) {

            closeOption({});

            restoreOption({ to: "COST" });

        }
        //----------
        function rowselecting_grdData_을지(ui) {

            v_global.process.handler = processSelect;
            v_global.process.current.master = ui.row;

            return checkUpdatable({ sub: true });

        }
        //----------
        function rowselected_grdData_을지(ui) {

            v_global.process.prev.master = ui.row;

            processLink({});

        };
        //----------
        function itemchanged_grdData_을지(ui) {

            switch (ui.element) {
                case "model_qty":
                    {
                        var qty = parseInt(gw_com_api.getCellValue(ui.type, ui.object, ui.row, "model_qty"));
                        if (qty == "") {
                            qty = 0;
                            gw_com_api.setValue(ui.object, ui.row, "model_qty", "0", (ui.type == "GRID") ? true : false, false, false);
                        }
                        var cost = getAmount({ obj: "을지", row: ui.row, name: "mat_cost", grid: true });
                        setAmount({ obj: "을지", row: ui.row, name: "mat_amt", value: qty * cost, grid: true, hidden: true });
                        cost = getAmount({ obj: "을지", row: ui.row, name: "est_cost", grid: true })
				                + getAmount({ obj: "을지", row: ui.row, name: "manage_cost", grid: true })
				                + getAmount({ obj: "을지", row: ui.row, name: "profit_amt", grid: true });
                        setAmount({ obj: "을지", row: ui.row, name: "est_amt", value: qty * cost, grid: true, hidden: true });
                        cost = getAmount({ obj: "을지", row: ui.row, name: "nego_cost", grid: true });
                        setAmount({ obj: "을지", row: ui.row, name: "nego_amt", value: qty * cost, grid: true, hidden: true });
                        applySummary({});
                    }
                    break;
                case "nego_rate":
                    {
                        var rate = parseFloat(ui.value.current);
                        if (rate == "") {
                            rate = 0;
                            gw_com_api.setValue(ui.object, ui.row, "nego_rate", "0", (ui.type == "GRID") ? true : false, false, false);
                        }
                        var qty = parseInt(gw_com_api.getCellValue(ui.type, ui.object, ui.row, "model_qty"));
                        var cost = getAmount({ obj: "을지", row: ui.row, name: "est_cost", grid: true })
					                + getAmount({ obj: "을지", row: ui.row, name: "manage_cost", grid: true })
					                + getAmount({ obj: "을지", row: ui.row, name: "profit_amt", grid: true });
                        cost = parseFloat(((rate > 0) ? cost - ((cost * rate) / 100) : cost));
                        setAmount({ obj: "을지", row: ui.row, name: "nego_cost", value: cost, grid: true, hidden: false, trigger: false });
                        setAmount({ obj: "을지", row: ui.row, name: "nego_amt", value: qty * cost, grid: true, hidden: true });
                        applySummary({});
                    }
                    break;
                case "nego_cost":
                    {
                        var nego = getAmount({ obj: "을지", row: ui.row, name: "nego_cost", grid: true });
                        if (nego == "") {
                            nego = 0;
                            gw_com_api.setValue(ui.object, ui.row, "nego_cost", "0", (ui.type == "GRID") ? true : false, false, false);
                        }
                        var cost = getAmount({ obj: "을지", row: ui.row, name: "est_cost", grid: true })
					                + getAmount({ obj: "을지", row: ui.row, name: "manage_cost", grid: true })
					                + getAmount({ obj: "을지", row: ui.row, name: "profit_amt", grid: true });
                        var rate = parseFloat((((cost - nego) / cost) * 10000) / 100);
                        gw_com_api.setValue(ui.object, ui.row, "nego_rate", rate, (ui.type == "GRID") ? true : false, false, false);
                        var qty = parseInt(gw_com_api.getCellValue(ui.type, ui.object, ui.row, "model_qty"));
                        setAmount({ obj: "을지", row: ui.row, name: "nego_amt", value: qty * nego, grid: true, hidden: true });
                        applySummary({});
                    }
                    break;
            }
            return true;

        };
        //----------
        function itemdblclick_grdData_을지(ui) {

            switch (ui.element) {
                case "model_nm":
                    {
                        v_global.event.type = ui.type;
                        v_global.event.object = ui.object;
                        v_global.event.row = ui.row;
                        v_global.event.element = ui.element;
                        var args = {
                            type: "PAGE",
                            page: "w_find_model_class",
                            title: "제품유형 검색",
                            width: 500,
                            height: 460,
                            open: true
                        };
                        if (gw_com_module.dialoguePrepare(args) == false) {
                            var args = {
                                page: "w_find_model_class",
                                param: {
                                    ID: gw_com_api.v_Stream.msg_selectModelClass
                                }
                            };
                            gw_com_module.dialogueOpen(args);
                        }
                    }
                    break;
            }

        }
        //----------
        function itemchanged_grdData_내역(ui) {

            switch (ui.element) {
                case "item_qty":
                    {
                        var qty = parseInt(gw_com_api.getCellValue(ui.type, ui.object, ui.row, "item_qty"));
                        if (qty == "") {
                            qty = 0;
                            gw_com_api.setValue(ui.object, ui.row, "item_qty", "0", (ui.type == "GRID") ? true : false, false, false);
                        }
                        var cost = parseFloat(gw_com_api.getCellValue(ui.type, ui.object, ui.row, "mat_ucost"));
                        gw_com_api.setCellValue(ui.type, ui.object, ui.row, "mat_uamt", parseFloat(qty * cost));
                        cost = getAmount({ obj: "내역", row: ui.row, name: "mat_cost", grid: true });
                        var prev = getAmount({ obj: "내역", row: ui.row, name: "mat_amt", grid: true });
                        setAmount({ obj: "내역", row: ui.row, name: "mat_amt", value: qty * cost, grid: true });
                        var current = getAmount({ obj: "내역", row: ui.row, name: "mat_amt", grid: true });
                        applySummary({ by: "MAT", diff: current - prev });
                        cost = getAmount({ obj: "내역", row: ui.row, name: "est_cost", grid: true });
                        var prev = getAmount({ obj: "내역", row: ui.row, name: "est_amt", grid: true });
                        setAmount({ obj: "내역", row: ui.row, name: "est_amt", value: qty * cost, grid: true });
                        var current = getAmount({ obj: "내역", row: ui.row, name: "est_amt", grid: true });
                        applySummary({ by: "EST", diff: current - prev });
                    }
                    break;
                case "est_cost":
                    {
                        var cost = getAmount({ obj: "내역", row: ui.row, name: "est_cost", grid: true });
                        if (cost == "") {
                            cost = 0;
                            gw_com_api.setValue(ui.object, ui.row, "est_cost", "0", (ui.type == "GRID") ? true : false, false, false);
                        }
                        var qty = parseInt(gw_com_api.getCellValue(ui.type, ui.object, ui.row, "item_qty"));
                        var prev = getAmount({ obj: "내역", row: ui.row, name: "est_amt", grid: true });
                        setAmount({ obj: "내역", row: ui.row, name: "est_amt", value: qty * cost, grid: true });
                        var current = getAmount({ obj: "내역", row: ui.row, name: "est_amt", grid: true });
                        applySummary({ by: "EST", diff: current - prev });
                    }
                    break;
            }
            return true;

        };

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_api.hide("lyrMenu_3", "그룹해제");
        //----------
        gw_com_module.startPage();
        //----------
        if (v_global.process.param != "") {
            gw_com_api.setValue("frmOption_1_1", 1, "est_nm", gw_com_api.getPageParameter("est_nm"));
            gw_com_api.setValue("frmOption_1_1", 1, "use_div", gw_com_api.getPageParameter("use_div"));
            gw_com_api.setValue("frmOption_1_1", 1, "est_key", gw_com_api.getPageParameter("est_key"));
            gw_com_api.setValue("frmOption_1_1", 1, "revision", gw_com_api.getPageParameter("revision"));
            toggleObject({});
            processRetrieve({});
        }
        else {
            itemdblclick_frmOption_1_1({
                type: "FORM",
                object: "frmOption_1_1",
                row: 1,
                element: "est_nm"
            });
        }

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

    var use = gw_com_api.getValue("frmOption_1_1", 1, "use_div");
    switch (param.name) {
        case "Option":
            return ((use == "1") ? "frmOption_2_3_해외" : "frmOption_2_3_국내");
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

    var use = gw_com_api.getValue("frmOption_1_1", 1, "use_div");
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
function getExchange(param) {

    var use = gw_com_api.getValue(getObject({ name: "갑지" }), 1, "use_div");
    var ex = 1;
    if ((use == "0" && param.currency == "USD")
        || (use == "1" && param.currency == "KRW"))
        ex = parseFloat(gw_com_api.getValue(getObject({ name: "갑지" }), 1, "exchange_1"));
    else if (param.currency == "JPY")
        ex = parseFloat(gw_com_api.getValue(getObject({ name: "갑지" }), 1, "exchange_2"));
    return ex;

}
//----------
function getAmount(param) {

    var use = gw_com_api.getValue(getObject({ name: "갑지" }), 1, "use_div");
    return (use == "0")
            ? parseInt(gw_com_api.getValue(getObject({ name: param.obj }), param.row, param.name, param.grid))
            : parseFloat(gw_com_api.getValue(getObject({ name: param.obj }), param.row, param.name, param.grid));

}
//----------
function setAmount(param) {

    var use = gw_com_api.getValue(getObject({ name: "갑지" }), 1, "use_div");
    return (use == "0")
            ? gw_com_api.setValue(getObject({ name: param.obj }), param.row, param.name, parseInt(param.value), param.grid, param.hidden, param.trigger)
            : gw_com_api.setValue(getObject({ name: param.obj }), param.row, param.name, parseFloat(param.value), param.grid, param.hidden, param.trigger);

}
//----------
function convertValue(param) {

    switch (param.by) {
        case "exchange":
            {
                var ex = 1;
                if (param.exchange != undefined)
                    ex = param.exchange;
                else {
                    var use = gw_com_api.getValue(getObject({ name: "갑지" }), 1, "use_div");
                    if ((use == "0" && param.currency == "USD")
                        || (use == "1" && param.currency == "KRW"))
                        ex = parseFloat(gw_com_api.getValue(getObject({ name: "갑지" }), 1, "exchange_1"));
                    else if (param.currency == "JPY")
                        ex = parseFloat(gw_com_api.getValue(getObject({ name: "갑지" }), 1, "exchange_2"));
                }
                var convert = param.value * 1;
                if (use == "1")
                    convert = parseFloat(param.value / ex);
                else
                    convert = parseInt(param.value * ex);
                return convert;
            }
            break;
        case "impose":
            {
                var convert = param.value * 1;
                if (param.currency != "KRW") {
                    var use = gw_com_api.getValue(getObject({ name: "갑지" }), 1, "use_div");
                    var rate_1 = parseFloat(gw_com_api.getValue(getObject({ name: "갑지" }), 1, "distribution_rate"));
                    var rate_2 = parseFloat(gw_com_api.getValue(getObject({ name: "갑지" }), 1, "duty_rate"));
                    convert = convert + parseFloat((param.value * rate_1) / 100);
                    convert = convert + parseFloat((param.value * rate_2) / 100);
                }
                return convert;
            }
            break;
        case "cost":
            {
                var convert = param.value * 1;
                var use = gw_com_api.getValue(getObject({ name: "갑지" }), 1, "use_div");
                var rate = parseFloat(gw_com_api.getValue(getObject({ name: "을지" }), "selected", "mat_rate", true));
                if (use == "1")
                    convert = (rate == 0) ? param.value : parseFloat(param.value / (rate / 100));
                else
                    convert = (rate == 0) ? param.value : parseInt(param.value / (rate / 100));
                return convert;
            }
            break;
        default:
            {
                var convert = param.value * 1;
                var use = gw_com_api.getValue(getObject({ name: "갑지" }), 1, "use_div");
                convert = (use == "1") ? parseFloat(convert) : parseInt(convert);
                return convert;
            }
            break;
    }

}
//----------
function applySummary(param) {

    switch (param.by) {
        case "MAT":
            {
                var qty = parseInt(gw_com_api.getValue(getObject({ name: "을지" }), "selected", "model_qty", true));
                var cost = getAmount({ obj: "을지", row: "selected", name: "mat_cost", grid: true }) + param.diff;
                setAmount({ obj: "을지", row: "selected", name: "mat_cost", value: cost, grid: true, hidden: true });
                setAmount({ obj: "을지", row: "selected", name: "mat_amt", value: cost * qty, grid: true, hidden: true });
                return;
            }
            break;
        case "EST":
            {
                var qty = parseInt(gw_com_api.getValue(getObject({ name: "을지" }), "selected", "model_qty", true));
                var cost = getAmount({ obj: "을지", row: "selected", name: "est_cost", grid: true }) + param.diff;
                setAmount({ obj: "을지", row: "selected", name: "est_cost", value: cost, grid: true, hidden: true });
                var rate = parseFloat(gw_com_api.getValue(getObject({ name: "갑지" }), 1, "manage_rate"));
                var compute = parseFloat(((rate > 0) ? ((cost * rate) / 100) : 0));
                setAmount({ obj: "을지", row: "selected", name: "manage_cost", value: compute, grid: true, hidden: true });
                cost = cost + compute;
                var rate = parseFloat(gw_com_api.getValue(getObject({ name: "갑지" }), 1, "profit_rate"));
                compute = parseFloat(((rate > 0) ? ((cost * rate) / 100) : 0));
                setAmount({ obj: "을지", row: "selected", name: "profit_amt", value: compute, grid: true, hidden: true });
                cost = cost + compute;
                setAmount({ obj: "을지", row: "selected", name: "est_amt", value: cost * qty, grid: true, hidden: true });
                var rate = parseFloat(gw_com_api.getValue(getObject({ name: "을지" }), "selected", "nego_rate", true));
                cost = parseFloat(((rate > 0) ? cost - ((cost * rate) / 100) : cost));
                setAmount({ obj: "을지", row: "selected", name: "nego_cost", value: cost, grid: true, hidden: false, trigger: false });
                setAmount({ obj: "을지", row: "selected", name: "nego_amt", value: cost * qty, grid: true, hidden: true });
            }
            break;
    }
    var est = 0, nego = 0;
    for (var i = 1; i <= gw_com_api.getRowCount(getObject({ name: "을지" })); i++) {
        var row = i * 1;
        est = est + getAmount({ obj: "을지", row: row, name: "est_amt", grid: true });
        nego = nego + getAmount({ obj: "을지", row: row, name: "nego_amt", grid: true });
    }
    setAmount({ obj: "갑지", row: 1, name: "est_amt", value: est, grid: false, hidden: true });
    setAmount({ obj: "갑지", row: 1, name: "nego_amt", value: nego, grid: false, hidden: true });
    setAmount({ obj: "갑지", row: 1, name: "final_amt", value: nego, grid: false, hidden: true });

}
//----------
function restoreOption(param) {

    switch (param.to) {
        case "ENV":
            {
                var exchange_dt = gw_com_api.getValue(getObject({ name: "갑지" }), 1, "exchange_dt");
                var exchange_1 = parseFloat(gw_com_api.getValue(getObject({ name: "갑지" }), 1, "exchange_1"));
                var exchange_2 = parseFloat(gw_com_api.getValue(getObject({ name: "갑지" }), 1, "exchange_2"));
                var distribution_rate = parseFloat(gw_com_api.getValue(getObject({ name: "갑지" }), 1, "distribution_rate"));
                var duty_rate = parseFloat(gw_com_api.getValue(getObject({ name: "갑지" }), 1, "duty_rate"));
                var manage_rate = parseFloat(gw_com_api.getValue(getObject({ name: "갑지" }), 1, "manage_rate"));
                var profit_rate = parseFloat(gw_com_api.getValue(getObject({ name: "갑지" }), 1, "profit_rate"));
                var est_fix = gw_com_api.getValue(getObject({ name: "갑지" }), 1, "est_fix");
                gw_com_api.setValue(getObject({ name: "Option" }), 1, "exchange_dt", exchange_dt);
                gw_com_api.setValue(getObject({ name: "Option" }), 1, "exchange_1", exchange_1);
                gw_com_api.setValue(getObject({ name: "Option" }), 1, "exchange_2", exchange_2);
                gw_com_api.setValue(getObject({ name: "Option" }), 1, "distribution_rate", distribution_rate);
                gw_com_api.setValue(getObject({ name: "Option" }), 1, "duty_rate", duty_rate);
                gw_com_api.setValue(getObject({ name: "Option" }), 1, "manage_rate", manage_rate);
                gw_com_api.setValue(getObject({ name: "Option" }), 1, "profit_rate", profit_rate);
                gw_com_api.setValue(getObject({ name: "Option" }), 1, "est_fix", est_fix);
            }
            break;
        case "EST":
            {
                var mat_rate = parseFloat(gw_com_api.getValue(getObject({ name: "을지" }), "selected", "mat_rate", true));
                gw_com_api.setValue("frmOption_3_2", 1, "mat_rate", mat_rate);
            }
            break;
        case "COST":
            {
                gw_com_api.setValue("frmOption_3_3", 1, "mat_cd", "");
                gw_com_api.setValue("frmOption_3_3", 1, "mat_nm", "");
                gw_com_api.setValue("frmOption_3_3", 1, "mat_spec", "");
                gw_com_api.setValue("frmOption_3_3", 1, "prev_cost", "");
                gw_com_api.setValue("frmOption_3_3", 1, "est_cost", "");
            }
            break;
    }

}
//----------
function checkCRUD(param) {

    return (param.sub)
            ? gw_com_api.getCRUD(getObject({ name: "을지" }), "selected", true)
            : gw_com_api.getCRUD(getObject({ name: "갑지" }));

}
//----------
function checkManipulate(param) {

    closeOption({});

    if (checkCRUD(param) == "none") {
        gw_com_api.messageBox([
            { text: "NOMASTER" }
        ]);
        return false;
    }
    return true;

}
//----------
function checkbeGroup(param) {

    closeOption({});

    return ((gw_com_api.getRowCount(getObject({ name: "내역" })) > 0) ? true : false);

}
//----------
function checkUpdatable(param) {

    closeOption({});

    var status = checkCRUD({ sub: true });
    var args = {
        check: param.check,
        target: [
            {
                type: "FORM",
                id: getObject({ name: "갑지" }),
                refer: (status == "initialize" || status == "create" || param.sub != true) ? false : true
            },
            {
                type: "GRID",
                id: getObject({ name: "집계" }),
                refer: (status == "initialize" || status == "create" || param.sub != true) ? false : true
            },
			{
			    type: "GRID",
			    id: getObject({ name: "을지" }),
			    refer: (status == "initialize" || status == "create" || param.sub != true) ? false : true
			},
			{
			    type: "GRID",
			    id: getObject({ name: "내역" })
			}
		]
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function checkRemovable(param) {

    closeOption({});

    var status = checkCRUD({ sub: true });
    if (status == "initialize" || status == "create")
        processDelete({});
    else
        gw_com_api.messageBox([
            { text: "REMOVE" }
        ], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO");

}
//----------
function checkBatchable(param) {

    closeOption({});

    if (param.env) {
        var args = {
            target: [
	            {
	                type: "FORM",
	                id: getObject({ name: "Option" })
	            }
            ]
        };
        if (gw_com_module.objValidate(args) == false) return false;

        var use = gw_com_api.getValue("frmOption_1_1", 1, "use_div");
        gw_com_api.messageBox([
                { text: "관련된 모든 단가 및 견적 금액이 재계산됩니다." + "<br>" },
                { text: "계속 하시겠습니까?" }
        ], 420, gw_com_api.v_Message.msg_confirmBatch, "YESNO", { env: true });
    }
    else if (param.mat) {
        closeOption({});

        gw_com_api.messageBox([
                { text: "모든 내역의 자재 정보 및 단가와 금액이 재계산됩니다." + "<br>" },
                { text: "계속 하시겠습니까?" }
        ], 420, gw_com_api.v_Message.msg_confirmBatch, "YESNO", { mat: true });
    }
    else if (param.est) {
        closeOption({});

        gw_com_api.messageBox([
                { text: "선택된 을지 내역의 견적 단가와 금액이 재계산됩니다." + "<br>" },
                { text: "계속 하시겠습니까?" }
        ], 420, gw_com_api.v_Message.msg_confirmBatch, "YESNO", { est: true });
    }
    else if (param.cost) {
        var args = {
            target: [
	            {
	                type: "FORM",
	                id: "frmOption_3_3"
	            }
            ]
        };
        if (gw_com_module.objValidate(args) == false) return false;

        gw_com_api.messageBox([
                { text: "해당 품목의 모든 견적 단가가 일괄 변경됩니다." + "<br>" },
                { text: "계속 하시겠습니까?" }
        ], 420, gw_com_api.v_Message.msg_confirmBatch, "YESNO", { cost: true });
    }

}
//----------
function checkExportable(param) {

    closeOption({});

    return true;

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

    closeOption({});

    var args = {
        target: [
	        {
	            type: "FORM",
	            id: "frmOption_1_1"
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
            id: "frmOption_1_1",
            hide: true,
            element: [
				{
				    name: "est_key",
				    argument: "arg_est_key"
				},
				{
				    name: "revision",
				    argument: "arg_revision"
				}
			],
            remark: [
		        {
		            element: [{ name: "est_nm"}]
		        },
                {
                    element: [{ name: "revision"}]
                }
		    ]
        },
        target: [
            {
                type: "FORM",
                id: getObject({ name: "갑지" }),
                handler: {
                    success: successRetrieve,
                    param: { name: "갑지" }
                }
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
    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {

    if (gw_com_api.getValue(getObject({ name: "을지" }), "selected", "model_nm", true) == "") {
        processClear({});
        return;
    }

    var args = {
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
			    id: getObject({ name: "내역" }),
			    handler: {
			        success: successRetrieve,
			        param: { name: "을지" }
			    }
			}
		],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processSelect(param) {

    gw_com_api.selectRow(getObject({ name: "을지" }), v_global.process.current.master, true, false);

}
//----------
function processInsert(param) {

    var args = {
        targetid: getObject({ name: "을지" }),
        edit: true,
        updatable: true,
        data: [
            { name: "est_key", value: gw_com_api.getValue(getObject({ name: "갑지" }), 1, "est_key") },
            { name: "revision", value: gw_com_api.getValue(getObject({ name: "갑지" }), 1, "revision") },
            { name: "model_qty", value: "1" },
            { name: "mat_cost", value: "0" },
            { name: "mat_amt", value: "0" },
            { name: "mat_rate", value: "0" },
            { name: "est_cost", value: "0" },
            { name: "est_amt", value: "0" },
            { name: "nego_rate", value: "0" },
            { name: "nego_cost", value: "0" },
            { name: "nego_amt", value: "0" }
        ],
        clear: [
		    {
		        type: "GRID",
		        id: getObject({ name: "내역" })
		    }
	    ]
    };
    var row = gw_com_module.gridInsert(args);
    gw_com_api.setValue(getObject({ name: "을지" }), row, "sort_seq", row * 10, true);

    v_global.event.type = "GRID";
    v_global.event.object = getObject({ name: "을지" });
    v_global.event.row = row;
    v_global.event.element = "model_nm";
    var args = {
        type: "PAGE",
        page: "w_find_model_class",
        title: "제품유형 검색",
        width: 500,
        height: 460,
        open: true
    };
    if (gw_com_module.dialoguePrepare(args) == false) {
        var args = {
            page: "w_find_model_class",
            param: {
                ID: gw_com_api.v_Stream.msg_selectModelClass
            }
        };
        gw_com_module.dialogueOpen(args);
    }

}
//----------
function processDelete(param) {

    var args = {
        targetid: getObject({ name: "을지" }),
        row: "selected",
        remove: true,
        clear: [
            {
                type: "GRID",
                id: getObject({ name: "내역" })
            }
        ]
    };
    gw_com_module.gridDelete(args);

    //applySummary({});
    processRetrieve({});

}
//----------
function processSave(param) {

    var args = {
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
			    id: getObject({ name: "을지" })
			},
			{
			    type: "GRID",
			    id: getObject({ name: "내역" })
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
		        type: "GRID",
		        id: getObject({ name: "을지" }),
		        key: [
		            {
		                row: "selected",
		                element: [
		                    { name: "est_key" },
                            { name: "revision" },
                            { name: "model_seq" }
		                ]
		            }
		        ]
		    }
	    ],
        handler: {
            success: successRemove
        }
    };
    gw_com_module.objRemove(args);

}
//----------
function processEnv(param) {

    var args = {
        url: "COM",
        procedure: "PROC_EST_CONVERT_ENV",
        nomessage: true,
        input: [
            { name: "user", value: gw_com_module.v_Session.USR_ID, type: "varchar" },
            { name: "est_key", value: gw_com_api.getValue(getObject({ name: "갑지" }), 1, "est_key"), type: "varchar" },
            { name: "revision", value: gw_com_api.getValue(getObject({ name: "갑지" }), 1, "revision"), type: "varchar" },
            { name: "exchange_dt", value: gw_com_api.getValue(getObject({ name: "Option" }), 1, "exchange_dt"), type: "varchar" },
            { name: "exchange_1", value: gw_com_api.getValue(getObject({ name: "Option" }), 1, "exchange_1"), type: "numeric" },
            { name: "exchange_2", value: gw_com_api.getValue(getObject({ name: "Option" }), 1, "exchange_2"), type: "numeric" },
            { name: "distribution_rate", value: gw_com_api.getValue(getObject({ name: "Option" }), 1, "distribution_rate"), type: "numeric" },
            { name: "duty_rate", value: gw_com_api.getValue(getObject({ name: "Option" }), 1, "duty_rate"), type: "numeric" },
            { name: "manage_rate", value: gw_com_api.getValue(getObject({ name: "Option" }), 1, "manage_rate"), type: "numeric" },
            { name: "profit_rate", value: gw_com_api.getValue(getObject({ name: "Option" }), 1, "profit_rate"), type: "numeric" },
            { name: "est_fix", value: gw_com_api.getValue(getObject({ name: "Option" }), 1, "est_fix"), type: "varchar" }
        ],
        output: [
            { name: "r_value", type: "int" },
            { name: "message", type: "varchar" }
        ],
        handler: {
            success: completeEnv
        }
    };
    gw_com_module.callProcedure(args);

}
//----------
function processMat(param) {

    var args = {
        url: "COM",
        procedure: "PROC_EST_CONVERT_MAT",
        nomessage: true,
        input: [
            { name: "user", value: gw_com_module.v_Session.USR_ID, type: "varchar" },
            { name: "est_key", value: gw_com_api.getValue(getObject({ name: "갑지" }), 1, "est_key"), type: "varchar" },
            { name: "revision", value: gw_com_api.getValue(getObject({ name: "갑지" }), 1, "revision"), type: "varchar" }
        ],
        output: [
            { name: "r_value", type: "int" },
            { name: "message", type: "varchar" }
        ],
        handler: {
            success: completeMat
        }
    };
    gw_com_module.callProcedure(args);

}
//----------
function processEst(param) {

    var args = {
        url: "COM",
        procedure: "PROC_EST_CONVERT_EST",
        nomessage: true,
        input: [
            { name: "user", value: gw_com_module.v_Session.USR_ID, type: "varchar" },
            { name: "est_key", value: gw_com_api.getValue(getObject({ name: "을지" }), "selected", "est_key", true), type: "varchar" },
            { name: "revision", value: gw_com_api.getValue(getObject({ name: "을지" }), "selected", "revision", true), type: "varchar" },
            { name: "model_seq", value: gw_com_api.getValue(getObject({ name: "을지" }), "selected", "model_seq", true), type: "varchar" },
            { name: "mat_rate", value: gw_com_api.getValue("frmOption_3_2", 1, "mat_rate"), type: "numeric" }
        ],
        output: [
            { name: "r_value", type: "int" },
            { name: "message", type: "varchar" }
        ],
        handler: {
            success: completeEst
        }
    };
    gw_com_module.callProcedure(args);

}
//----------
function processCost(param) {

    var args = {
        url: "COM",
        procedure: "PROC_EST_CONVERT_COST",
        nomessage: true,
        input: [
            { name: "user", value: gw_com_module.v_Session.USR_ID, type: "varchar" },
            { name: "est_key", value: gw_com_api.getValue(getObject({ name: "갑지" }), 1, "est_key"), type: "varchar" },
            { name: "revision", value: gw_com_api.getValue(getObject({ name: "갑지" }), 1, "revision"), type: "varchar" },
            { name: "mat_cd", value: gw_com_api.getValue("frmOption_3_3", 1, "mat_cd"), type: "varchar" },
            { name: "est_cost", value: gw_com_api.getValue("frmOption_3_3", 1, "est_cost"), type: "varchar" }
        ],
        output: [
            { name: "r_value", type: "int" },
            { name: "message", type: "varchar" }
        ],
        handler: {
            success: completeCost
        }
    };
    gw_com_module.callProcedure(args);

}
//----------
function processExport() {

    var args = {
        source: {
            type: "FORM",
            id: getObject({ name: "갑지" }),
            json: true,
            element: [
                { name: "est_key", argument: "arg_est_key" },
                { name: "revision", argument: "arg_revision" }
            ]
        },
        option: [
            { name: "PRINT", value: "XLS" },
            { name: "PAGE", value: gw_com_module.v_Current.window },
            { name: "MODEL", value: gw_com_api.getValue("frmOption_1_1", 1, "use_div") },
            { name: "RULE", value: gw_com_api.getValue("frmOption_1_2", 1, "amt_rule") }
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
function processRestore(param) {

    var args = {
        targetid: getObject({ name: "을지" }),
        row: v_global.process.prev.master
    };
    gw_com_module.gridRestore(args);

}
//----------
function processClear(param) {

    var args = {
        target: [
            {
                type: "GRID",
                id: getObject({ name: "내역" })
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

    if (param.target != undefined) {
        $.each(param.target, function () {
            gw_com_api.hide(this);
        });
    }
    else {
        gw_com_api.hide("frmOption_1_1");
        gw_com_api.hide("frmOption_1_2");
        gw_com_api.hide("frmOption_2_1");
        gw_com_api.hide("frmOption_2_2");
        gw_com_api.hide("frmOption_2_3_국내");
        gw_com_api.hide("frmOption_2_3_해외");
        gw_com_api.hide("frmOption_3_1");
        gw_com_api.hide("frmOption_3_2");
        gw_com_api.hide("frmOption_3_3");
    }

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
function successRetrieve(response, param) {

    switch (param.name) {
        case "갑지":
            {
                var use = gw_com_api.getValue(getObject({ name: "갑지" }), 1, "use_div");
                var exchange_dt = gw_com_api.getValue(getObject({ name: "갑지" }), 1, "exchange_dt");
                var exchange_1 = parseFloat(gw_com_api.getValue(getObject({ name: "갑지" }), 1, "exchange_1"));
                var exchange_2 = parseFloat(gw_com_api.getValue(getObject({ name: "갑지" }), 1, "exchange_2"));
                var distribution_rate = parseFloat(gw_com_api.getValue(getObject({ name: "갑지" }), 1, "distribution_rate"));
                var duty_rate = parseFloat(gw_com_api.getValue(getObject({ name: "갑지" }), 1, "duty_rate"));
                var manage_rate = parseFloat(gw_com_api.getValue(getObject({ name: "갑지" }), 1, "manage_rate"));
                var profit_rate = parseFloat(gw_com_api.getValue(getObject({ name: "갑지" }), 1, "profit_rate"));
                var est_fix = gw_com_api.getValue(getObject({ name: "갑지" }), 1, "est_fix");
                var args = {
                    targetid: "lyrRemark_2",
                    row: [
		                {
		                    name: "기준정보",
		                    value:
		                        "[이윤 : " + profit_rate + "%] " +
		                        "[관리비 : " + manage_rate + "%] " +
		                        "[물류비 : " + distribution_rate + "%] " +
                                "[통관비 : " + duty_rate + "%]" +
                                "[환율기준일 : " + ((exchange_dt != "") ? gw_com_api.Mask(exchange_dt, "date-ymd") : "없음") + "] " +
                                ((use == "0") ? "[환율($) : " : "[환율($:￦) : ") + exchange_1 + "] " +
                                ((use == "0") ? "[환율(￥) : " : "[환율($:￥) : ") + exchange_2 + "] " +
                                ((est_fix == "1") ? "[견적가고정]" : "")
		                }
	                ]
                };
                gw_com_module.labelAssign(args);
                gw_com_api.setValue(getObject({ name: "Option" }), 1, "exchange_dt", exchange_dt);
                gw_com_api.setValue(getObject({ name: "Option" }), 1, "exchange_1", exchange_1);
                gw_com_api.setValue(getObject({ name: "Option" }), 1, "exchange_2", exchange_2);
                gw_com_api.setValue(getObject({ name: "Option" }), 1, "distribution_rate", distribution_rate);
                gw_com_api.setValue(getObject({ name: "Option" }), 1, "duty_rate", duty_rate);
                gw_com_api.setValue(getObject({ name: "Option" }), 1, "manage_rate", manage_rate);
                gw_com_api.setValue(getObject({ name: "Option" }), 1, "profit_rate", profit_rate);
                gw_com_api.setValue(getObject({ name: "Option" }), 1, "est_fix", est_fix);
            }
            break;
        case "을지":
            {
                var mat_rate = parseFloat(gw_com_api.getValue(getObject({ name: "을지" }), "selected", "mat_rate", true));
                var args = {
                    targetid: "lyrRemark_2",
                    row: [
		                {
		                    name: "재료비",
		                    value:
                                "[재료비 : " + mat_rate + "%] "
		                }
	                ]
                };
                //gw_com_module.labelAssign(args);
                gw_com_api.setValue("frmOption_3_2", 1, "mat_rate", mat_rate);
            }
            break;
    }

}
//----------
function successSave(response, param) {

    if (gw_com_api.getSelectedRow(getObject({ name: "을지" })) != null) {
        var index = false;
        $.each(response, function () {
            if (this.QUERY == "w_hcem2030_S_1")
                index = true;
        });
        if (!index) {
            response.push({
                QUERY: "w_hcem2030_S_1",
                KEY: [
                    { NAME: "est_key", VALUE: gw_com_api.getValue(getObject({ name: "을지" }), "selected", "est_key", true) },
                    { NAME: "revision", VALUE: gw_com_api.getValue(getObject({ name: "을지" }), "selected", "revision", true) },
                    { NAME: "model_seq", VALUE: gw_com_api.getValue(getObject({ name: "을지" }), "selected", "model_seq", true) }
                ]
            });
        }
    }
    processRetrieve({ key: response });

}
//----------
function successRemove(response, param) {

    processDelete({});

}
//----------
function completeEnv(response, param) {

    gw_com_api.messageBox([
        { text: response.VALUE[1] }
    ], 350, gw_com_api.v_Message.msg_informBatched, "ALERT",
    { handler: successEnv, response: response });

}
//----------
function successEnv(response, param) {

    if (response.VALUE[0] != -1) {
        processRetrieve({});
    }

}
//----------
function completeMat(response, param) {

    gw_com_api.messageBox([
        { text: response.VALUE[1] }
    ], 350, gw_com_api.v_Message.msg_informBatched, "ALERT",
    { handler: successMat, response: response });

}
//----------
function successMat(response, param) {

    if (response.VALUE[0] != -1) {
        processRetrieve({});
    }

}
//----------
function completeEst(response, param) {

    gw_com_api.messageBox([
        { text: response.VALUE[1] }
    ], 350, gw_com_api.v_Message.msg_informBatched, "ALERT",
    { handler: successEst, response: response });

}
//----------
function successEst(response, param) {

    if (response.VALUE[0] != -1) {
        processRetrieve({});
    }

}
//----------
function completeCost(response, param) {

    gw_com_api.messageBox([
        { text: response.VALUE[1] }
    ], 350, gw_com_api.v_Message.msg_informBatched, "ALERT",
    { handler: successCost, response: response });

}
//----------
function successCost(response, param) {

    if (response.VALUE[0] != -1) {
        processRetrieve({});
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
                switch (param.data.ID) {
                    case gw_com_api.v_Message.msg_confirmSave:
                        {
                            if (param.data.result == "YES")
                                processSave({});
                            else {
                                var status = checkCRUD({});
                                /*
                                if (status == "initialize" || status == "create")
                                processDelete({});
                                else if (status == "update")
                                processRestore({});
                                if (v_global.process.handler != null)
                                v_global.process.handler({});
                                */
                                processRetrieve({});
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
                            if (param.data.result == "YES") {
                                if (param.data.arg.env)
                                    processEnv({});
                                else if (param.data.arg.mat)
                                    processMat({});
                                else if (param.data.arg.est)
                                    processEst({});
                                else if (param.data.arg.cost)
                                    processCost({});
                            }
                            else {
                                if (param.data.arg.env)
                                    restoreOption({ to: "ENV" });
                                else if (param.data.arg.est)
                                    restoreOption({ to: "EST" });
                                else if (param.data.arg.est)
                                    restoreOption({ to: "COST" });
                            }
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
        case gw_com_api.v_Stream.msg_selectedEstimate:
            {
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "est_key",
			                        param.data.est_key,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "revision",
			                        param.data.revision,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "est_nm",
			                        param.data.est_nm,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "use_div",
			                        param.data.use_div,
			                        (v_global.event.type == "GRID") ? true : false);
                toggleObject({});
                closeDialogue({ page: param.from.page, focus: true });
                processRetrieve({});
            }
            break;
        case gw_com_api.v_Stream.msg_copiedPreEstimate:
            {
                processRetrieve({});
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedModelClass:
            {
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "model_class1",
			                        param.data.class_1,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "model_class2",
			                        param.data.class_2,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "model_class3",
			                        param.data.class_3,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "model_nm",
			                        param.data.class_name,
			                        (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
        case gw_com_api.v_Stream.msg_copiedPreModel:
            {
                var key = {
                    KEY: [
                        {
                            NAME: "est_key",
                            VALUE: param.data.est_key
                        },
                        {
                            NAME: "revision",
                            VALUE: param.data.revision
                        },
                        {
                            NAME: "model_seq",
                            VALUE: param.data.model_seq
                        }
                    ],
                    QUERY: "w_hcem2030_S_1"
                };
                processRetrieve({ key: [key] });
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
        case gw_com_api.v_Stream.msg_copiedPreIndex:
            {
                var key = {
                    KEY: [
                        {
                            NAME: "est_key",
                            VALUE: param.data.est_key
                        },
                        {
                            NAME: "revision",
                            VALUE: param.data.revision
                        },
                        {
                            NAME: "model_seq",
                            VALUE: param.data.model_seq
                        }
                    ],
                    QUERY: "w_hcem2030_S_1"
                };
                processRetrieve({ key: [key] });
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedtoEstimate:
            {
                var costs = 0, offers = 0;
                $.each(param.data.rows, function (i) {
                    var price = convertValue({ by: "impose", currency: this.mat_monetary_unit, value: gw_com_api.unMask(this.mat_price, "currency-float") });
                    var cost = convertValue({ by: "exchange", currency: this.mat_monetary_unit, value: price });
                    var offer = convertValue({ by: "cost", currency: this.mat_monetary_unit, value: cost });
                    var args = {
                        targetid: getObject({ name: "내역" }),
                        //edit: true,
                        updatable: true,
                        data: [
                            { name: "est_key", value: gw_com_api.getValue(getObject({ name: "을지" }), "selected", "est_key", true) },
                            { name: "revision", value: gw_com_api.getValue(getObject({ name: "을지" }), "selected", "revision", true) },
                            { name: "model_seq", value: gw_com_api.getValue(getObject({ name: "을지" }), "selected", "model_seq", true) },
                            { name: "title_div1", value: this.title_div1 },
                            { name: "title_div2", value: this.title_div2 },
                            { name: "mat_cd", value: this.mat_cd },
                            { name: "mat_categorize", value: this.mat_categorize },
                            { name: "mat_nm", value: this.mat_nm },
                            { name: "mat_spec", value: this.mat_spec },
                            { name: "mat_unit", value: this.mat_unit },
                            { name: "mat_maker", value: this.mat_maker },
                            { name: "item_qty", value: "1" },
                            { name: "monetary_nm", value: this.mat_monetary_unit },
                            { name: "monetary_unit", value: this.mat_monetary_unit },
                            { name: "mat_price", value: gw_com_api.unMask(this.mat_price, "currency-float") },
                            { name: "mat_ucost", value: "" + price },
                            { name: "mat_uamt", value: "" + price },
                            { name: "mat_cost", value: "" + cost },
                            { name: "mat_amt", value: "" + cost },
                            { name: "est_cost", value: "" + offer },
                            { name: "est_amt", value: "" + offer },
                            { name: "sort_num", value: "0" }
                        ]
                    };
                    var row = gw_com_module.gridInsert(args);
                    gw_com_api.setValue(getObject({ name: "내역" }), row, "sort_seq", row * 10, true);
                    costs = costs +
                        ((this.mat_categorize == "0") ? getAmount({ obj: "내역", row: row, name: "mat_amt", grid: true }) : 0);
                    offers = offers + getAmount({ obj: "내역", row: row, name: "est_amt", grid: true });
                });
                applySummary({ by: "MAT", diff: costs });
                applySummary({ by: "EST", diff: offers });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedPreModel:
            {
                var costs = 0, offers = 0;
                $.each(param.data.rows, function (i) {
                    var price = convertValue({ by: "impose", currency: this.monetary_unit, value: gw_com_api.unMask(this.mat_price, "currency-float") });
                    var cost = convertValue({ by: "exchange", currency: this.monetary_unit, value: price });
                    var offer = convertValue({ by: "cost", currency: this.monetary_unit, value: cost });
                    var args = {
                        targetid: getObject({ name: "내역" }),
                        //edit: true,
                        updatable: true,
                        data: [
                            { name: "est_key", value: gw_com_api.getValue(getObject({ name: "을지" }), "selected", "est_key", true) },
                            { name: "revision", value: gw_com_api.getValue(getObject({ name: "을지" }), "selected", "revision", true) },
                            { name: "model_seq", value: gw_com_api.getValue(getObject({ name: "을지" }), "selected", "model_seq", true) },
                            { name: "title_div1", value: this.title_div1 },
                            { name: "title_div2", value: this.title_div2 },
                            { name: "mat_cd", value: this.mat_cd },
                            { name: "mat_categorize", value: this.mat_categorize },
                            { name: "mat_nm", value: this.mat_nm },
                            { name: "mat_spec", value: this.mat_spec },
                            { name: "mat_unit", value: this.mat_unit },
                            { name: "mat_maker", value: this.mat_maker },
                            { name: "item_qty", value: this.item_qty },
                            { name: "monetary_nm", value: this.monetary_unit },
                            { name: "monetary_unit", value: this.monetary_unit },
                            { name: "mat_price", value: gw_com_api.unMask(this.mat_price, "currency-float") },
                            { name: "mat_ucost", value: "" + price },
                            { name: "mat_uamt", value: "" + price * this.item_qty },
                            { name: "mat_cost", value: "" + cost },
                            { name: "mat_amt", value: "" + convertValue({ value: cost * this.item_qty }) },
                            { name: "est_cost", value: "" + offer },
                            { name: "est_amt", value: "" + convertValue({ value: offer * this.item_qty }) },
                            { name: "sort_num", value: "0" }
                        ]
                    };
                    var row = gw_com_module.gridInsert(args);
                    gw_com_api.setValue(getObject({ name: "내역" }), row, "sort_seq", row * 10, true);
                    costs = costs +
                        ((this.mat_categorize == "0") ? getAmount({ obj: "내역", row: row, name: "mat_amt", grid: true }) : 0);
                    offers = offers + getAmount({ obj: "내역", row: row, name: "est_amt", grid: true });
                });
                applySummary({ by: "MAT", diff: costs });
                applySummary({ by: "EST", diff: offers });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedPreEstimate:
            {
                var costs = 0, offers = 0;
                $.each(param.data.rows, function (i) {
                    var price = convertValue({ by: "impose", currency: this.monetary_unit, value: gw_com_api.unMask(this.mat_price, "currency-float") });
                    var cost = convertValue({ by: "exchange", currency: this.monetary_unit, value: price });
                    var offer = convertValue({ by: "cost", currency: this.monetary_unit, value: cost });
                    var args = {
                        targetid: getObject({ name: "내역" }),
                        //edit: true,
                        updatable: true,
                        data: [
                            { name: "est_key", value: gw_com_api.getValue(getObject({ name: "을지" }), "selected", "est_key", true) },
                            { name: "revision", value: gw_com_api.getValue(getObject({ name: "을지" }), "selected", "revision", true) },
                            { name: "model_seq", value: gw_com_api.getValue(getObject({ name: "을지" }), "selected", "model_seq", true) },
                            { name: "title_div1", value: this.title_div1 },
                            { name: "title_div2", value: this.title_div2 },
                            { name: "mat_cd", value: this.mat_cd },
                            { name: "mat_categorize", value: this.mat_categorize },
                            { name: "mat_nm", value: this.mat_nm },
                            { name: "mat_spec", value: this.mat_spec },
                            { name: "mat_tnm", value: this.mat_tnm },
                            { name: "mat_group", value: this.mat_group },
                            { name: "mat_sno", value: this.mat_sno },
                            { name: "mat_unit", value: this.mat_unit },
                            { name: "mat_maker", value: this.mat_maker },
                            { name: "item_qty", value: this.item_qty },
                            { name: "monetary_nm", value: this.monetary_unit },
                            { name: "monetary_unit", value: this.monetary_unit },
                            { name: "mat_price", value: gw_com_api.unMask(this.mat_price, "currency-float") },
                            { name: "mat_ucost", value: "" + price },
                            { name: "mat_uamt", value: "" + price * this.item_qty },
                            { name: "mat_cost", value: "" + cost },
                            { name: "mat_amt", value: "" + convertValue({ value: cost * this.item_qty }) },
                            { name: "est_cost", value: "" + offer },
                            { name: "est_amt", value: "" + convertValue({ value: offer * this.item_qty }) },
                            { name: "sort_num", value: "0" }
                        ]
                    };
                    var row = gw_com_module.gridInsert(args);
                    gw_com_api.setValue(getObject({ name: "내역" }), row, "sort_seq", row * 10, true);
                    costs = costs +
                        ((this.mat_categorize == "0") ? getAmount({ obj: "내역", row: row, name: "mat_amt", grid: true }) : 0);
                    offers = offers + getAmount({ obj: "내역", row: row, name: "est_amt", grid: true });
                });
                applySummary({ by: "MAT", diff: costs });
                applySummary({ by: "EST", diff: offers });
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
                    case "w_find_est_info":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectEstimate;
                            /*
                            args.data = {
                            est_nm: gw_com_api.getValue(
                            v_global.event.object,
                            v_global.event.row,
                            v_global.event.element,
                            (v_global.event.type == "GRID") ? true : false)
                            };
                            */
                        }
                        break;
                    case "w_find_model_class":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectModelClass;
                        }
                        break;
                    case "w_find_est_copy":
                        {
                            args.ID = gw_com_api.v_Stream.msg_copyPreEstimate;
                            args.data = {
                                user: gw_com_module.v_Session.USR_ID,
                                est_key: gw_com_api.getValue(getObject({ name: "갑지" }), 1, "est_key"),
                                revision: gw_com_api.getValue(getObject({ name: "갑지" }), 1, "revision")
                            };
                        }
                        break;
                    case "w_find_model_copy":
                        {
                            args.ID = gw_com_api.v_Stream.msg_copyPreModel;
                            args.data = {
                                user: gw_com_module.v_Session.USR_ID,
                                est_key: gw_com_api.getValue(getObject({ name: "갑지" }), 1, "est_key"),
                                revision: gw_com_api.getValue(getObject({ name: "갑지" }), 1, "revision")
                            };
                        }
                        break;
                    case "w_find_index_copy":
                        {
                            args.ID = gw_com_api.v_Stream.msg_copyPreIndex;
                            args.data = {
                                user: gw_com_module.v_Session.USR_ID,
                                est_key: gw_com_api.getValue(getObject({ name: "갑지" }), 1, "est_key"),
                                revision: gw_com_api.getValue(getObject({ name: "갑지" }), 1, "revision")
                            };
                        }
                        break;
                    case "w_find_mat":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selecttoEstimate;
                        }
                        break;
                    case "w_find_model_detail":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectPreModel;
                        }
                        break;
                    case "w_find_est_detail":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectPreEstimate;
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