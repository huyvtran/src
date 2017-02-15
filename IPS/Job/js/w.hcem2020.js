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
                    type: "INLINE", name: "외주구분",
                    data: [
				        { title: "전체", value: "%" },
						{ title: "없음", value: "0" },
						{ title: "외주", value: "1" }
					]
                },
				{
				    type: "INLINE", name: "제출승인",
				    data: [
				        { title: "없음", value: "0" },
						{ title: "구두승인", value: "1" },
						{ title: "결재승인", value: "2" }
					]
				},
                {
                    type: "PAGE", name: "수주결과", query: "dddw_order_result"
                },
                {
                    type: "PAGE", name: "진행상태", query: "dddw_est_stat"
                },
                {
                    type: "PAGE", name: "대분류", query: "dddw_stats_class_1"
                },
                {
                    type: "PAGE", name: "중분류", query: "dddw_stats_class_2"
                },
                {
                    type: "PAGE", name: "소분류", query: "dddw_stats_class_3"
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
            targetid: "lyrMenu_1",
            type: "FREE",
            element: [
                {
                    name: "견적서",
                    value: "견적서 작성",
                    icon: "추가"
                },
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
            targetid: "lyrMenu_2",
            type: "FREE",
            element: [
 				{
 				    name: "추가",
 				    value: "Revision 추가",
 				    icon: "추가"
 				},
 				{
 				    name: "삭제",
 				    value: "Revision 삭제",
 				    icon: "삭제"
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
				                    size: 14,
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
				                name: "out_yn",
				                label: {
				                    title: "외주구분 :"
				                },
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "외주구분"
				                    }
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
            query: "w_hcem2020_M_1",
            title: "견적 현황",
            caption: true,
            height: 92,
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
				    name: "est_key",
				    hidden: true
				}
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_이력",
            query: "w_Hcem2020_D_1",
            title: "Revision 내역",
            caption: true,
            height: 70,
            pager: false,
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
				    name: "est_key",
				    hidden: true
				}
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_상세",
            query: "w_hcem2020_S_1",
            type: "TABLE",
            title: "견적 정보",
            caption: true,
            show: true,
            selectable: true,
            editable: {
                bind: "select",
                focus: "cust_nm",
                validate: true
            },
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
                                header: true, value: "차수", format: { type: "label" }
                            },
                            {
                                name: "revision_nm"
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true, value: "고객분류", format: { type: "label" }
                            },
                            {
                                style: { colspan: 3 },
                                name: "stats_nm",
                                mask: "search",
                                display: true,
                                editable: {
                                    type: "text",
                                    width: 470
                                }
                            },
                            {
                                header: true, value: "외주유무", format: { type: "label" }
                            },
                            {
                                name: "out_yn",
                                value: "외주",
                                format: {
                                    type: "checkbox",
                                    title: "외주",
                                    value: "1"
                                },
                                editable: {
                                    type: "checkbox",
                                    title: "외주",
                                    value: "1",
                                    offval: "0"
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true, value: "제출담당자", format: { type: "label" }
                            },
                            {
                                name: "submit_empno",
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "사원"
                                    }
                                }
                            },
                            {
                                header: true, value: "제출승인", format: { type: "label" }
                            },
						    {
						        name: "submit_sign_div",
						        editable: {
						            type: "select",
						            data: {
						                memory: "제출승인"
						            }
						        }
						    },
                            {
                                header: true, value: "제출일자", format: { type: "label" }
                            },
                            {
                                name: "submit_dt",
                                mask: "date-ymd",
                                editable: {
                                    type: "text"
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true, value: "견적유형", format: { type: "label" }
                            },
                            {
                                name: "est_type_nm"
                            },
                            {
                                header: true, value: "진행상태", format: { type: "label" }
                            },
                            {
                                name: "est_stat",
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "진행상태"
                                    }
                                }
                            },
                            {
                                header: true, value: "수주결과", format: { type: "label" }
                            },
                            {
                                name: "order_result",
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "수주결과"
                                    }
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true, value: "견적금액", format: { type: "label" }
                            },
                            {
                                name: "est_amt",
                                mask: "currency-float"
                            },
                            {
                                header: true, value: "NEGO금액", format: { type: "label" }
                            },
                            {
                                name: "nego_amt",
                                mask: "currency-float"
                            },
                            {
                                header: true, value: "최종NEGO금액", format: { type: "label" }
                            },
                            {
                                name: "final_amt",
                                mask: "currency-float"
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true, value: "수주금액", format: { type: "label" }
                            },
                            {
                                name: "order_amt",
                                mask: "currency-float",
                                editable: {
                                    type: "text"
                                }
                            },
                            {
                                header: true, value: "수주율(%)", format: { type: "label" }
                            },
                            {
                                name: "order_rate",
                                mask: "numeric-float",
                                editable: {
                                    type: "text"
                                }
                            },
                            {
                                header: true, value: "생산의뢰번호", format: { type: "label" }
                            },
                            {
                                name: "proj_no",
                                editable: {
                                    type: "text"
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true, value: "비고", format: { type: "label" }
                            },
                            {
                                style: { colspan: 5 },
                                name: "rmk",
                                format: {
                                    type: "textarea",
                                    rows: 4,
                                    width: 784
                                },
                                editable: {
                                    type: "textarea",
                                    rows: 4,
                                    width: 784
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                style: { colspan: 6 }, value: "기준정보", format: { type: "caption" }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true, value: "용도구분", format: { type: "label" }
                            },
						    {
						        name: "use_div",
						        editable: {
						            type: "radio",
						            child: [
						                {
						                    title: "내수",
						                    value: "0"
						                },
								        {
								            title: "수출",
								            value: "1"
								        }
								    ]
						        }
						    },
                            {
                                header: true, value: "관리비(%)", format: { type: "label" }
                            },
                            {
                                name: "manage_rate",
                                mask: "numeric-float",
                                editable: {
                                    type: "text"
                                }
                            },
                            {
                                header: true, value: "이윤(%)", format: { type: "label" }
                            },
                            {
                                name: "profit_rate",
                                mask: "numeric-float",
                                editable: {
                                    type: "text"
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true, value: "환율기준일", format: { type: "label" }
                            },
                            {
                                name: "exchange_dt",
                                mask: "date-ymd",
                                editable: {
                                    type: "text"
                                }
                            },
                            {
                                header: true, value: "환율($)", format: { type: "label" }
                            },
                            {
                                name: "exchange_1",
                                mask: "numeric-float",
                                editable: {
                                    type: "text"
                                }
                            },
                            {
                                header: true, value: "환율(￥)", format: { type: "label" }
                            },
                            {
                                name: "exchange_2",
                                mask: "numeric-float",
                                editable: {
                                    type: "text"
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true, value: "물류비(%)", format: { type: "label" }
                            },
                            {
                                name: "distribution_rate",
                                mask: "numeric-float",
                                editable: {
                                    type: "text"
                                }
                            },
                            {
                                header: true, value: "통관비(%)", format: { type: "label" }
                            },
                            {
                                name: "duty_rate",
                                mask: "numeric-float",
                                editable: {
                                    type: "text"
                                }
                            },
                            {
                                header: true, value: "견적가고정", format: { type: "label" }
                            },
						    {
						        name: "est_fix",
						        format: {
						            type: "checkbox",
						            title: "고정",
						            value: "1"
						        },
						        editable: {
						            type: "checkbox",
						            title: "고정",
						            value: "1",
						            offval: "0"
						        }
						    },
            				{
            				    name: "stats_class1",
            				    hidden: true
            				},
            				{
            				    name: "stats_class2",
            				    hidden: true
            				},
            				{
            				    name: "stats_class3",
            				    hidden: true
            				},
            				{
            				    name: "revision",
            				    hidden: true
            				},
            				{
            				    name: "est_key",
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
            targetid: "lyrNotice",
            row: [
 				{
 				    name: "견적작업"
 				}
			]
        };
        //----------
        gw_com_module.labelCreate(args);
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
				    id: "frmData_상세",
				    offset: 8
				},
				{
				    type: "GRID",
				    id: "grdData_이력",
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
            element: "견적서",
            event: "click",
            handler: click_lyrMenu_1_견적서
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
        //----------
        var args = {
            targetid: "frmData_상세",
            event: "itemdblclick",
            handler: itemdblclick_frmData_상세
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmData_상세",
            event: "itemkeyenter",
            handler: itemdblclick_frmData_상세
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_이력",
            grid: true,
            event: "rowdblclick",
            handler: rowdblclick_grdData_이력
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_이력",
            grid: true,
            event: "rowkeyenter",
            handler: rowdblclick_grdData_이력
        };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_1_견적서(ui) {

            if (!checkManipulate({})) return;
            if (!checkUpdatable({ check: true })) return false;

            var args = {
                ID: gw_com_api.v_Stream.msg_linkPage,
                to: {
                    type: "MAIN"
                },
                data: {
                    page: "w_hcem2032",
                    title: "견적서 작성",
                    param: [
                        { name: "est_nm", value: gw_com_api.getValue("grdData_현황", "selected", "est_nm", true) },
                        { name: "use_div", value: gw_com_api.getValue("frmData_상세", 1, "use_div") },
                        { name: "est_key", value: gw_com_api.getValue("frmData_상세", 1, "est_key") },
                        { name: "revision", value: gw_com_api.getValue("frmData_상세", 1, "revision") }
                    ]
                }
            };
            gw_com_module.streamInterface(args);

        }
        //----------
        function click_lyrMenu_1_조회() {

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
        function click_lyrMenu_1_저장() {

            closeOption({});
            processSave({});

        }
        //----------
        function click_lyrMenu_1_닫기() {

            checkClosable({});

        }
        //----------
        function click_lyrMenu_2_추가(ui) {

            if (!checkManipulate()) return false;

            v_global.process.handler = checkRevisable;

            if (!checkUpdatable({ revise: true })) return false;

            checkRevisable({ revise: true });

        }
        //----------
        function click_lyrMenu_2_삭제(ui) {

            if (!checkManipulate()) return false;
            if (gw_com_api.getSelectedRow("grdData_이력") == null) {
                gw_com_api.messageBox([
                    { text: "선택된 데이터가 없습니다." }
                ], 300);
                return false;
            }

            v_global.process.handler = checkRevisable;

            if (!checkUpdatable({})) return false;

            checkRevisable({});

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
        //----------
        function itemdblclick_frmData_상세(ui) {

            switch (ui.element) {
                case "stats_nm":
                    {
                        v_global.event.type = ui.type;
                        v_global.event.object = ui.object;
                        v_global.event.row = ui.row;
                        v_global.event.element = ui.element;
                        var args = {
                            type: "PAGE",
                            page: "w_find_stats_class",
                            title: "고객분류 검색",
                            width: 500,
                            height: 460,
                            open: true
                        };
                        if (gw_com_module.dialoguePrepare(args) == false) {
                            var args = {
                                page: "w_find_stats_class",
                                param: {
                                    ID: gw_com_api.v_Stream.msg_selectStatsClass/*,
                                    data: {
                                        div_tnm: gw_com_api.getValue(ui.object, ui.row, ui.element)
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
        function rowdblclick_grdData_이력(ui) {

            var args = {
                type: "PAGE",
                page: "w_find_est_register",
                title: "Revision 상세",
                width: 900,
                height: 420,
                scroll: true,
                open: true
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = {
                    page: "w_find_est_register",
                    param: {
                        ID: gw_com_api.v_Stream.msg_infoEstimate,
                        data: {
                            est_key: gw_com_api.getValue("grdData_이력", "selected", "est_key", true),
                            revision: gw_com_api.getValue("grdData_이력", "selected", "revision", true)
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
function checkCRUD(param) {

    return gw_com_api.getCRUD("frmData_상세");

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
        check: param.check,
        target: [
            {
                type: "FORM",
                id: "frmData_상세"
            }
		],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function checkRevisable(param) {

    if (param.revise)
        gw_com_api.messageBox([
                { text: "Revision이 추가됩니다. 계속 하시겠습니까?" }
            ], 420, gw_com_api.v_Message.msg_confirmBatch, "YESNO", param);
    else
        gw_com_api.messageBox([
                { text: "선택된 Revision 및 연관 데이터가 모두 삭제됩니다." },
                { text: "계속 하시겠습니까?" }
            ], 420, gw_com_api.v_Message.msg_confirmBatch, "YESNO", param);

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
            if (this.QUERY == "w_hcem2020_S_1")
                this.QUERY = "w_hcem2020_M_1";
        });
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
				    name: "out_yn",
				    argument: "arg_out_yn"
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
		            element: [{ name: "out_yn"}]
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
			    id: "frmData_상세"
			},
			{
			    type: "GRID",
			    id: "grdData_이력"
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
			    id: "frmData_상세"
			},
			{
			    type: "GRID",
			    id: "grdData_이력"
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
function processSave() {

    var args = {
        target: [
			{
			    type: "FORM",
			    id: "frmData_상세"
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
function processRevise(param) {

    var args = {
        url: "COM",
        procedure: (param.revise) ? "PROC_EST_REVISION_ADD" : "PROC_EST_REVISION_DELETE",
        nomessage: true,
        input: [
            { name: "est_key", value: gw_com_api.getValue("grdData_현황", "selected", "est_key", true), type: "varchar" },
            { name: "user", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
        ],
        output: [
            { name: "r_value", type: "int" },
            { name: "message", type: "varchar" }
        ],
        handler: {
            success: completeRevise
        }
    };
    if (param.revise != true)
        args.input.push({ name: "revision", value: gw_com_api.getValue("grdData_이력", "selected", "revision", true), type: "int" });
    gw_com_module.callProcedure(args);

}
//----------
function processClear(param) {

    var args = {
        target: [
            {
                type: "FORM",
                id: "frmData_상세"
            },
            {
                type: "GRID",
                id: "grdData_이력"
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
function completeRevise(response, param) {

    gw_com_api.messageBox([
        { text: response.VALUE[1] }
    ], 350, gw_com_api.v_Message.msg_informBatched, "ALERT",
    { handler: successRevise, response: response });

}
//----------
function successRevise(response, param) {

    if (response.VALUE[0] != -1)
        processLink({});

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
        case gw_com_api.v_Stream.msg_selectedStatsClass:
            {
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "stats_class1",
			                        param.data.class_1,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "stats_class2",
			                        param.data.class_2,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "stats_class3",
			                        param.data.class_3,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "stats_nm",
			                        param.data.class_name,
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
                    case "w_find_stats_class":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selecteStatsClass;
                        }
                        break;
                    case "w_find_est_register":
                        {
                            args.ID = gw_com_api.v_Stream.msg_infoEstimate;
                            args.data = {
                                est_key: gw_com_api.getValue("grdData_이력", "selected", "est_key", true),
                                revision: gw_com_api.getValue("grdData_이력", "selected", "revision", true)
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