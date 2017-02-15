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
                    type: "PAGE", name: "진행상태", query: "dddw_est_stat"
                },
                {
                    type: "PAGE", name: "제출방식", query: "dddw_submit_method"
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
            targetid: "lyrMenu_3",
            type: "FREE",
            show: false,
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
                                mask: "search",
                                editable: {
                                    type: "text",
                                    size: 16,
                                    maxlength: 50
                                }
                            },
				            {
				                name: "est_stat",
				                value: "%",
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
            query: "w_hcem2010_M_1",
            title: "요청 현황",
            caption: true,
            width: 342,
            height: 417,
            number: true,
            show: true,
            selectable: true,
            element: [
				{
				    header: "견적명칭",
				    name: "est_nm",
				    width: 200,
				    align: "left"
				},
				{
				    header: "제출일자",
				    name: "submit_limit_ymd",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
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
            targetid: "frmData_현황",
            query: "w_hcem2010_S_1",
            type: "TABLE",
            title: "견적요구서",
            caption: true,
            show: true,
            selectable: true,
            editable: {
                bind: "select",
                focus: "est_nm",
                validate: true
            },
            content: {
                width: {
                    label: 80,
                    field: 200
                },
                height: 25,
                row: [
                    {
                        element: [
                            {
                                header: true,
                                value: "고객사",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "cust_name",
                                mask: "search",
                                display: true,
                                editable: {
                                    type: "text",
                                    validate: {
                                        rule: "required",
                                        message: "고객사"
                                    }
                                }
                            },
                            {
                                header: true,
                                value: "사용처",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "cust_place",
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
                                value: "견적명칭",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                style: { colspan: 3 },
                                name: "est_nm",
                                format: {
                                    type: "text",
                                    width: 470
                                },
                                editable: {
                                    type: "text",
                                    width: 470,
                                    validate: {
                                        rule: "required",
                                        message: "견적명칭"
                                    }
                                }
                            }/*,
                            {
                                header: true,
                                value: "견적분류",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "stats_nm",
                                mask: "search",
                                display: true,
                                editable: {
                                    type: "text"
                                }
                            }*/
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "고객담당자",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "cust_user",
                                editable: {
                                    type: "text"
                                }
                            },
                            {
                                header: true,
                                value: "고객연락처",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "cust_contact",
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
                                value: "접수일시",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                style: {
                                    colfloat: "float"
                                },
                                name: "receipt_ymd",
                                mask: "date-ymd",
                                format: {
                                    type: "text",
                                    width: 80
                                },
                                editable: {
                                    type: "text",
                                    width: 80,
                                    validate: {
                                        rule: "required",
                                        message: "접수일시"
                                    }
                                }
                            },
                            {
                                style: {
                                    colfloat: "floated"
                                },
                                name: "receipt_time",
                                mask: "time-hm",
                                format: {
                                    type: "text",
                                    width: 36
                                },
                                editable: {
                                    type: "text",
                                    width: 36
                                }
                            },
                            {
                                header: true,
                                value: "제출기한",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                style: {
                                    colfloat: "float"
                                },
                                name: "submit_limit_ymd",
                                mask: "date-ymd",
                                format: {
                                    type: "text",
                                    width: 80
                                },
                                editable: {
                                    type: "text",
                                    width: 80,
                                    validate: {
                                        rule: "required",
                                        message: "제출기한"
                                    }
                                }
                            },
                            {
                                style: {
                                    colfloat: "floated"
                                },
                                name: "submit_limit_time",
                                mask: "time-hm",
                                format: {
                                    type: "text",
                                    width: 36
                                },
                                editable: {
                                    type: "text",
                                    width: 36
                                }
                            }
						]
                    },
                    {
                        element: [
                            {
                                header: true,
                                type: "label",
                                value: "제출방식",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "submit_method",
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "제출방식"
                                    },
                                    validate: {
                                        rule: "required",
                                        message: "제출방식"
                                    }
                                }
                            },
                            {
                                header: true,
                                value: "제출처",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "submit_place",
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
                                type: "label",
                                value: "견적유형",
                                format: {
                                    type: "label"
                                }
                            },
							{
							    name: "est_type",
							    editable: {
							        type: "radio",
							        child: [
								        {
								            title: "구두",
								            value: "0"
								        },
										{
										    title: "일반",
										    value: "1"
										},
										{
										    title: "문서",
										    value: "2"
										}
									],
							        validate: {
							            rule: "required",
							            message: "견적유형"
							        }
							    }
							},
                            {
                                header: true,
                                type: "label",
                                value: "국가구분",
                                format: {
                                    type: "label"
                                }
                            },
							{
							    name: "domestic_div",
							    editable: {
							        type: "radio",
							        child: [
								        {
								            title: "국내",
								            value: "0"
								        },
										{
										    title: "해외",
										    value: "1"
										}
									],
							        validate: {
							            rule: "required",
							            message: "국가구분"
							        }
							    }
							}
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "진행상태",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                style: { colspan: 3 },
                                name: "est_stat_nm"
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "등록자",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "ins_usr"
                            },
                            {
                                header: true,
                                value: "등록일자",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "ins_dt"
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
                                    width: 470
                                },
                                editable: {
                                    type: "textarea",
                                    rows: 4,
                                    width: 470
                                }
                            },
            				{
            				    name: "cust_cd",
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
            targetid: "grdData_메일",
            query: "w_hcem2010_D_1",
            title: "메일 정보",
            //caption: true,
            height: 101,
            pager: false,
            show: true,
            selectable: true,
            number: true,
            editable: {
                multi: true,
                bind: "select",
                focus: "name",
                validate: true
            },
            element: [
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
		            header: "일반전화",
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
		            header: "E-MAIL",
		            name: "email",
		            width: 200,
		            align: "left",
		            editable: {
		                type: "text"
		            }
		        },
		        {
		            header: "송신여부",
		            name: "send_yn",
		            width: 50,
		            align: "center",
		            format: {
		                type: "checkbox",
		                title: "",
		                value: "1",
		                offval: "0"
		            },
		            editable: {
		                type: "checkbox",
		                title: "",
		                value: "1",
		                offval: "0"
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
				    name: "seq",
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
            targetid: "grdData_파일",
            query: "w_hcem2010_D_2",
            title: "첨부 자료",
            //caption: true,
            height: 101,
            pager: false,
            show: true,
            selectable: true,
            number: true,
            editable: {
                multi: true,
                bind: "select",
                focus: "file_desc",
                validate: true
            },
            element: [
				{
				    header: "파일명",
				    name: "file_nm",
				    width: 250,
				    align: "left"
				},
				{
				    header: "다운로드",
				    name: "download",
				    width: 60,
				    align: "center",
				    format: {
				        type: "link",
				        value: "다운로드"
				    }
				},
				{
				    header: "파일설명",
				    name: "file_desc",
				    width: 300,
				    align: "left",
				    editable: {
				        type: "text"
				    }
				},
                {
                    name: "file_ext",
                    hidden: true
                },
                {
                    name: "file_path",
                    hidden: true
                },
                {
                    name: "network_cd",
                    hidden: true
                },
                {
                    name: "data_tp",
                    hidden: true
                },
                {
                    name: "data_key",
                    hidden: true
                },
                {
                    name: "data_seq",
                    hidden: true
                },
                {
                    name: "file_id",
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
            targetid: "lyrDown",
            width: 0,
            height: 0,
            show: false
        };
        gw_com_module.pageCreate(args);
        //=====================================================================================
        var args = {
            tabid: "lyrTab",
            target: [
				{
				    type: "GRID",
				    id: "grdData_메일",
				    title: "메일 정보"
				},
                {
                    type: "GRID",
                    id: "grdData_파일",
                    title: "첨부 자료   "
                }
			]
        };
        //----------
        gw_com_module.convertTab(args);
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
				    id: "grdData_메일",
				    offset: 8
				},
				{
				    type: "GRID",
				    id: "grdData_파일",
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
            targetid: "lyrMenu_3",
            element: "추가",
            event: "click",
            handler: click_lyrMenu_3_추가
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
            targetid: "lyrTab",
            event: "tabselect",
            handler: click_lyrTab_tabselect
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
            targetid: "frmData_현황",
            event: "itemdblclick",
            handler: itemdblclick_frmData_현황
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmData_현황",
            event: "itemkeyenter",
            handler: itemdblclick_frmData_현황
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_파일",
            grid: true,
            element: "download",
            event: "click",
            handler: click_grdData_파일_download
        };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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
                targetid: "grdData_메일",
                edit: true
            };
            gw_com_module.gridInsert(args);

        }
        //----------
        function click_lyrMenu_2_삭제(ui) {

            if (!checkManipulate()) return;

            var args = {
                targetid: "grdData_메일",
                row: "selected"
            }
            gw_com_module.gridDelete(args);

        }
        //----------
        function click_lyrMenu_3_추가(ui) {

            if (!checkManipulate({})) return;
            if (!checkUpdatable({ check: true })) return false;

            var args = {
                type: "PAGE",
                page: "w_upload_estreq",
                title: "파일 업로드",
                width: 650,
                height: 180,
                locate: ["center", 180],
                open: true
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = {
                    page: "w_upload_estreq",
                    param: {
                        ID: gw_com_api.v_Stream.msg_upload_ESTREQ,
                        data: {
                            user: gw_com_module.v_Session.USR_ID,
                            key: gw_com_api.getValue("grdData_현황", "selected", "est_key", true),
                            seq: 0
                        }
                    }
                };
                gw_com_module.dialogueOpen(args);
            }

        }
        //----------
        function click_lyrMenu_3_삭제(ui) {

            if (!checkManipulate({})) return;

            var args = {
                targetid: "grdData_파일",
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
        function itemdblclick_frmOption(ui) {

            switch (ui.element) {
                case "cust_name":
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
        function click_lyrTab_tabselect(ui) {

            gw_com_api.hide("lyrMenu_" + (v_global.process.current.tab + 1));
            v_global.process.current.tab = ui.row;
            gw_com_api.show("lyrMenu_" + (v_global.process.current.tab + 1));

            return true;

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
        function itemdblclick_frmData_현황(ui) {

            switch (ui.element) {
                case "cust_name":
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
        function click_grdData_파일_download(ui) {

            var args = {
                source: {
                    id: "grdData_파일",
                    row: ui.row
                },
                targetid: "lyrDown"
            };
            gw_com_module.downloadFile(args);

        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_module.startPage();
        //----------
        v_global.process.current.tab = 1;

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
        check: param.check,
        target: [
            {
                type: "FORM",
                id: "frmData_현황"
            },
			{
			    type: "GRID",
			    id: "grdData_메일"
			},
            {
                type: "GRID",
                id: "grdData_파일"
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
            if (this.QUERY == "w_hcem2010_S_1")
                this.QUERY = "w_hcem2010_M_1";
        });
    }
    var args = {
        source: {
            type: "FORM",
            id: "frmOption",
            hide: true,
            element: [
				{
				    name: "cust_cd",
				    argument: "arg_cust_cd"
				},
                {
                    name: "cust_name",
                    argument: "arg_cust_name"
                },
				{
				    name: "est_stat",
				    argument: "arg_est_stat"
				}
			],
            remark: [
		        {
		            element: [{ name: "cust_name"}]
		        },
		        {
		            element: [{ name: "est_stat"}]
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
			    id: "grdData_메일"
			},
            {
                type: "GRID",
                id: "grdData_파일"
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
                id: "grdData_메일"
            },
            {
                type: "GRID",
                id: "grdData_파일"
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
        /*
        data: [
        { name: "", value: }
        ],
        */
        clear: [
		    {
		        type: "GRID",
		        id: "grdData_메일"
		    },
            {
                type: "GRID",
                id: "grdData_파일"
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
                id: "grdData_메일"
            },
            {
                type: "GRID",
                id: "grdData_파일"
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
			    id: "grdData_메일"
			},
            {
                type: "GRID",
                id: "grdData_파일"
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
        procedure: "PROC_EST_REQ_DELETE",
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
            success: completeRemove
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
                id: "grdData_메일"
            },
            {
                type: "GRID",
                id: "grdData_파일"
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
function successRevise(response) {

    processRetrieve({ key: response });

}
//----------
function successRemove(response, param) {

    if (response.VALUE[0] != -1)
        processDelete({});

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
			                        "cust_name",
			                        param.data.cust_name,
			                        (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
        case gw_com_api.v_Stream.msg_uploaded_ESTREQ:
            {
                var args = {
                    source: {
                        type: "GRID",
                        id: "grdData_현황",
                        row: "selected",
                        element: [
				            {
				                name: "est_key",
				                argument: "arg_est_key"
				            }
			            ]
                    },
                    target: [
			            {
			                type: "GRID",
			                id: "grdData_파일",
			                select: true
			            }
		            ],
                    key: param.key
                };
                gw_com_module.objRetrieve(args);
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
                    case "w_upload_estreq":
                        {
                            args.ID = gw_com_api.v_Stream.msg_upload_ESTREQ;
                            args.data = {
                                user: gw_com_module.v_Session.USR_ID,
                                key: gw_com_api.getValue("grdData_현황", "selected", "est_key", true),
                                seq: 0
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