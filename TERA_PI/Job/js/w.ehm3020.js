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
                    type: "PAGE", name: "고객사", query: "dddw_cust"
                },
				{
				    type: "PAGE", name: "LINE", query: "dddw_zcoded",
				    param: [
                        { argument: "arg_hcode", value: "IEHM02" }
                    ]
				},
				{
				    type: "PAGE", name: "발생Module", query: "dddw_zcode",
				    param: [
                        { argument: "arg_hcode", value: "IEHM05" }
                    ]
				},
                {
                    type: "INLINE", name: "진행상태",
                    data: [
                        { title: "발생", value: "발생" },
						{ title: "진행", value: "진행" },
						{ title: "완료", value: "완료" },
                        { title: "보류", value: "보류" }
					]
                },
				{
				    type: "PAGE", name: "DEPT_AREA_FIND", query: "dddw_deptarea",
				    param: [{ argument: "arg_type", value: gw_com_module.v_Session.DEPT_AUTH }]
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
				{ name: "조회", value: "조회", act: true },
				{ name: "추가", value: "추가" },
				{ name: "저장", value: "저장" },
				{ name: "삭제", value: "삭제" },
				{ name: "닫기", value: "닫기" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_2", type: "FREE",
            element: [
				{ name: "추가", value: "추가" },
				{ name: "삭제", value: "삭제" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_3", type: "FREE",
            element: [
				{ name: "추가", value: "추가" },
				{ name: "삭제", value: "삭제" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true,
            editable: { focus: "cust_cd", validate: true },
            remark: "lyrRemark",
            content: {
                row: [
                    {
                        element: [
				            {
				                style: { colfloat: "floating" }, name: "ymd_fr", label: { title: "시작일자 :" },
				                mask: "date-ymd", editable: { type: "text", size: 7, maxlength: 10 }
				            },
				            {
				                name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
				                editable: { type: "text", size: 7, maxlength: 10 }
				            },
                            {
                                name: "dept_area", label: { title: "사업부 :" },
                                editable: { type: "select", size: 7, maxlength: 20, data: { memory: "DEPT_AREA_FIND" } }
                            },
                        ]
                    },
                    {
                        element: [
				            {
				                name: "cust_cd", label: { title: "고객사 :" },
				                editable: {
				                    type: "select", size: 1,
				                    data: { memory: "고객사", unshift: [{ title: "전체", value: "%" }] },
				                    change: [{ name: "cust_dept", memory: "LINE", key: ["cust_cd"] }]
				                }
				            },
				            {
				                name: "cust_dept", label: { title: "LINE :" },
				                editable: {
				                    type: "select", size: 1,
				                    data: { memory: "LINE", unshift: [{ title: "전체", value: "%" }], key: ["cust_cd"] }
				                }
				            },
				            {
				                name: "cust_prod_nm", label: { title: "고객설비명 :" },
				                editable: { type: "text", size: 10, maxlength: 20 }
				            }
				        ]
                    },
                    {
                        align: "right",
                        element: [
				            { name: "실행", value: "실행", act: true, format: { type: "button" } },
				            { name: "취소", value: "취소", format: { type: "button", icon: "닫기" } }
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
            query: "w_ehm3020_M_1",
            title: "Setup 현황",
            //caption: true,
            height: 110,
            dynamic: true,
            show: true,
            selectable: true,
            editable: {
                master: true,
                bind: "select",
                focus: "cust_nm",
                validate: true
            },
            element: [
				{
				    header: "관리번호",
				    name: "setup_no",
				    width: 80,
				    align: "center",
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    header: "시작일자",
				    name: "str_ymd",
				    width: 92,
				    align: "center",
				    mask: "date-ymd",
				    editable: {
				        type: "text"
				    }
				},
				{
				    header: "고객사",
				    name: "cust_nm",
				    width: 80,
				    align: "center",
				    mask: "search",
				    display: true,
				    editable: {
				        type: "text"
				    }
				},
				{
				    header: "Line",
				    name: "cust_dept",
				    width: 80,
				    align: "center",
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    header: "고객설비명",
				    name: "cust_prod_nm",
				    width: 120,
				    align: "left",
				    display: true,
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    header: "발생Module",
				    name: "prod_sub",
				    width: 80,
				    align: "center",
				    format: {
				        type: "select",
				        data: {
				            memory: "발생Module"
				        }
				    },
				    editable: {
				        type: "select",
				        data: {
				            memory: "발생Module"
				        }
				    }
				},
				{
				    header: "진행상태",
				    name: "pstat",
				    width: 60,
				    align: "center",
				    format: {
				        type: "select",
				        data: {
				            memory: "진행상태"
				        }
				    },
				    editable: {
				        type: "select",
				        data: {
				            memory: "진행상태"
				        }
				    }
				},
				{
				    header: "등록자",
				    name: "ins_usr",
				    width: 70,
				    align: "center"
				},
				{
				    header: "등록일시",
				    name: "ins_dt",
				    width: 160,
				    align: "center"
				},
				{
				    header: "수정자",
				    name: "upd_usr",
				    width: 70,
				    align: "center"
				},
				{
				    header: "수정일시",
				    name: "upd_dt",
				    width: 160,
				    align: "center"
				},
				{
				    name: "cust_cd",
				    hidden: true,
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    name: "cust_proc",
				    hidden: true,
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    name: "prod_key",
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
            targetid: "grdData_보고서",
            query: "w_ehm3020_S_1",
            title: "Setup 보고서",
            caption: true,
            height: "100%",
            pager: false,
            dynamic: false,
            show: true,
            selectable: true,
            editable: {
                master: true,
                bind: "select"
            },
            element: [
				{
				    header: "관리번호",
				    name: "setup_no",
				    width: 80,
				    align: "center",
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    header: "작업일자",
				    name: "setup_ymd",
				    width: 80,
				    align: "center",
				    mask: "date-ymd",
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    header: "시작시간",
				    name: "str_time",
				    width: 80,
				    align: "center"
				},
				{
				    header: "종료시간",
				    name: "end_time",
				    width: 80,
				    align: "center"
				},
				{
				    header: "진행상태",
				    name: "pstat",
				    width: 60,
				    align: "center",
				    format: {
				        type: "select",
				        data: {
				            memory: "진행상태"
				        }
				    }
				},
				{
				    header: "등록자",
				    name: "ins_usr",
				    width: 70,
				    align: "center"
				},
				{
				    header: "등록일시",
				    name: "ins_dt",
				    width: 160,
				    align: "center"
				}
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_보고서",
            query: "w_ehm3020_S_2",
            type: "TABLE",
            title: "Setup 보고서",
            //caption: true,
            show: true,
            selectable: true,
            editable: {
                bind: "select",
                focus: "pstat",
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
                                value: "관리번호",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "setup_no",
                                editable: {
                                    type: "hidden"
                                }
                            },
                            {
                                header: true,
                                value: "작업일자",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "setup_ymd",
                                mask: "date-ymd",
                                editable: {
                                    type: "text"
                                }
                            },
                            {
                                header: true,
                                value: "진행상태",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "pstat",
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "진행상태"
                                    }
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "시작시간",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "str_time",
                                editable: {
                                    type: "text"
                                }
                            },
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
                                value: "수정자",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "upd_usr"
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "종료시간",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "end_time",
                                editable: {
                                    type: "text"
                                }
                            },
                            {
                                header: true,
                                value: "등록일시",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "ins_dt"
                            },
                            {
                                header: true,
                                value: "수정일시",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "upd_dt"
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "근무자",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                style: {
                                    colspan: 5,
                                    colfloat: "float"
                                },
                                name: "emp_nm01",
                                format: {
                                    width: 100
                                },
                                editable: {
                                    type: "text",
                                    width: 100
                                }
                            },
                            {
                                style: {
                                    colfloat: "floating"
                                },
                                name: "emp_nm02",
                                format: {
                                    width: 100
                                },
                                editable: {
                                    type: "text",
                                    width: 100
                                }
                            },
                            {
                                style: {
                                    colfloat: "floating"
                                },
                                name: "emp_nm03",
                                format: {
                                    width: 100
                                },
                                editable: {
                                    type: "text",
                                    width: 100
                                }
                            },
                            {
                                style: {
                                    colfloat: "floating"
                                },
                                name: "emp_nm04",
                                format: {
                                    width: 100
                                },
                                editable: {
                                    type: "text",
                                    width: 100
                                }
                            },
                            {
                                style: {
                                    colfloat: "floating"
                                },
                                name: "emp_nm05",
                                format: {
                                    width: 100
                                },
                                editable: {
                                    type: "text",
                                    width: 100
                                }
                            },
                            {
                                style: {
                                    colfloat: "divide"
                                },
                                name: "emp_nm06",
                                format: {
                                    width: 100
                                },
                                editable: {
                                    type: "text",
                                    width: 100
                                }
                            },
                            {
                                style: {
                                    colfloat: "floating"
                                },
                                name: "emp_nm07",
                                format: {
                                    width: 100
                                },
                                editable: {
                                    type: "text",
                                    width: 100
                                }
                            },
                            {
                                style: {
                                    colfloat: "floating"
                                },
                                name: "emp_nm08",
                                format: {
                                    width: 100
                                },
                                editable: {
                                    type: "text",
                                    width: 100
                                }
                            },
                            {
                                style: {
                                    colfloat: "floating"
                                },
                                name: "emp_nm09",
                                format: {
                                    width: 100
                                },
                                editable: {
                                    type: "text",
                                    width: 100
                                }
                            },
                            {
                                style: {
                                    colfloat: "floating"
                                },
                                name: "emp_nm10",
                                format: {
                                    width: 100
                                },
                                editable: {
                                    type: "text",
                                    width: 100
                                }
                            },
                            {
                                style: {
                                    colfloat: "floating"
                                },
                                name: "emp_nm11",
                                format: {
                                    width: 100
                                },
                                editable: {
                                    type: "text",
                                    width: 100
                                }
                            },
                            {
                                style: {
                                    colfloat: "floated"
                                },
                                name: "emp_nm12",
                                format: {
                                    width: 100
                                },
                                editable: {
                                    type: "text",
                                    width: 100
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "문제점",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                style: {
                                    colspan: 5
                                },
                                name: "rmk_problem",
                                format: {
                                    type: "textarea",
                                    rows: 10,
                                    width: 734
                                },
                                editable: {
                                    type: "textarea",
                                    rows: 10,
                                    width: 734
                                }
                            }
                        ]
                    },

                    {
                        element: [
                            {
                                header: true,
                                value: "금일<br>진행상황",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                style: {
                                    colspan: 5
                                },
                                name: "rmk_today",
                                format: {
                                    type: "textarea",
                                    rows: 12,
                                    width: 734
                                },
                                editable: {
                                    type: "textarea",
                                    rows: 12,
                                    width: 734
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "익일<br>예정사항",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                style: {
                                    colspan: 5
                                },
                                name: "rmk_tomorrow",
                                format: {
                                    type: "textarea",
                                    rows: 8,
                                    width: 734
                                },
                                editable: {
                                    type: "textarea",
                                    rows: 8,
                                    width: 734
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
            targetid: "grdData_첨부파일",
            query: "w_ehm3020_S_3",
            title: "첨부 파일",
            caption: true,
            height: "100%",
            pager: false,
            show: true,
            number: true,
            selectable: true,
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
				    width: 300,
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
            target: [
				{
				    type: "GRID",
				    id: "grdData_현황",
				    offset: 8
				},
                {
                    type: "GRID",
                    id: "grdData_보고서",
                    offset: 8
                },
				{
				    type: "FORM",
				    id: "frmData_보고서",
				    offset: 8
				},
				{
				    type: "GRID",
				    id: "grdData_첨부파일",
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
            targetid: "grdData_현황",
            grid: true,
            event: "itemdblclick",
            handler: itemdblclick_grdData_현황
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_현황",
            grid: true,
            event: "itemkeyenter",
            handler: itemdblclick_grdData_현황
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_보고서",
            grid: true,
            event: "rowselecting",
            handler: rowselecting_grdData_보고서
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_보고서",
            grid: true,
            event: "rowselected",
            handler: rowselected_grdData_보고서
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_첨부파일",
            grid: true,
            element: "download",
            event: "click",
            handler: click_grdData_첨부파일_download
        };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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
        function click_lyrMenu_1_추가(ui) {

            v_global.process.handler = processInsert;

            if (!checkUpdatable({})) return;

            processInsert({});

        }
        //----------
        function click_lyrMenu_1_삭제(ui) {

            v_global.process.handler = processRemove;

            if (!checkManipulate({})) return;

            checkRemovable({});

        }
        //----------
        function click_lyrMenu_1_저장(ui) {

            closeOption({});
            processSave({});

        }
        //----------
        function click_lyrMenu_1_닫기(ui) {

            v_global.process.handler = processClose;

            if (!checkUpdatable({})) return;

            processClose({});

        }
        //----------
        function click_lyrMenu_2_추가(ui) {

            if (!checkManipulate({})) return;

            v_global.process.handler = processInsert;

            if (!checkUpdatable({ sub: true })) return;

            processInsert({ sub: true });
        }
        //----------
        function click_lyrMenu_2_삭제(ui) {

            if (!checkManipulate({})) return;

            var status = checkCRUD({ sub: true });
            if (status == "initialize" || status == "create")
                processClear({});
            else
                processDelete({ sub: true });

        }
        //----------
        function click_lyrMenu_3_추가(ui) {

            if (!checkManipulate({})) return;
            if (!checkUpdatable({ check: true })) return false;

            var args = {
                type: "PAGE",
                page: "w_upload_assetup",
                title: "파일 업로드",
                width: 650,
                height: 200,
                locate: ["center", 600],
                open: true
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = {
                    page: "w_upload_assetup",
                    param: {
                        ID: gw_com_api.v_Stream.msg_upload_ASSETUP,
                        data: {
                            user: gw_com_module.v_Session.USR_ID,
                            key: gw_com_api.getValue("grdData_현황", "selected", "setup_no", true),
                            seq: gw_com_api.getValue("grdData_현황", "selected", "str_ymd", true)
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
                targetid: "grdData_첨부파일",
                row: "selected"
            }
            gw_com_module.gridDelete(args);

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
        function itemdblclick_grdData_현황(ui) {

            switch (ui.element) {
                case "cust_nm":
                    {
                        v_global.event.type = ui.type;
                        v_global.event.object = ui.object;
                        v_global.event.row = ui.row;
                        v_global.event.element = ui.element;
                        var args = {
                            type: "PAGE",
                            page: "w_find_prod_ehm",
                            title: "장비 검색",
                            width: 800,
                            height: 460,
                            locate: ["center", "top"],
                            open: true
                        };
                        if (gw_com_module.dialoguePrepare(args) == false) {
                            var args = {
                                page: "w_find_prod_ehm",
                                param: {
                                    ID: gw_com_api.v_Stream.msg_selectProduct_EHM
                                }
                            };
                            gw_com_module.dialogueOpen(args);
                        }
                    }
                    break;
            }
        }
        //----------
        function rowselecting_grdData_보고서(ui) {

            v_global.process.handler = processSelect;
            v_global.process.current.sub = ui.row;

            return checkUpdatable({ sub: true });

        }
        //----------
        function rowselected_grdData_보고서(ui) {

            v_global.process.prev.sub = ui.row;

            processLink({ sub: true });

        };
        //----------        
        function click_grdData_첨부파일_download(ui) {

            var args = {
                source: {
                    id: "grdData_첨부파일",
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
        gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -3 }));
        gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate(""));
        //----------
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

    return ((param.sub)
            ? gw_com_api.getCRUD("frmData_보고서")
            : gw_com_api.getCRUD("grdData_현황", "selected", true));

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
function checkUpdatable(param) {

    closeOption({});

    var args = {
        target: [
            {
                type: "GRID",
                id: "grdData_현황",
                refer: (param.sub) ? true : false
            },
            {
                type: "GRID",
                id: "grdData_보고서",
                refer: (param.sub) ? true : false
            },
            {
                type: "FORM",
                id: "frmData_보고서"
            },
			{
			    type: "GRID",
			    id: "grdData_첨부파일"
			}
		],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function checkRemovable(param) {

    var status = checkCRUD({});
    if (status == "initialize" || status == "create")
        processDelete({});
    else
        gw_com_api.messageBox([
            { text: "REMOVE" }
        ], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO");

}
//----------
function processRetrieve(param) {

    var args = {
        target: [
	        { type: "FORM", id: "frmOption" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) {
        processClear({ master: true });
        return false;
    }

    var args = {
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
				{ name: "ymd_fr", argument: "arg_ymd_fr" },
				{ name: "ymd_to", argument: "arg_ymd_to" },
				{ name: "cust_cd", argument: "arg_cust_cd" },
				{ name: "cust_dept", argument: "arg_cust_dept" },
				{ name: "cust_prod_nm", argument: "arg_cust_prod_nm" },
                { name: "dept_area", argument: "arg_dept_area" }
			],
            remark: [
			    { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }] },
		        { element: [{ name: "dept_area" }] },
		        { element: [{ name: "cust_cd" }] },
		        { element: [{ name: "cust_dept"}] },
		        { element: [{ name: "cust_prod_nm"}] }
		    ]
        },
        target: [
			{ type: "GRID", id: "grdData_현황", select: true }
		],
        clear: [
            { type: "GRID", id: "grdData_보고서" },
		    { type: "FORM", id: "frmData_보고서" },
			{ type: "GRID", id: "grdData_첨부파일" }
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
                id: "grdData_보고서",
                row: "selected",
                block: true,
                element: [
				    {
				        name: "setup_no",
				        argument: "arg_setup_no"
				    },
                    {
                        name: "setup_ymd",
                        argument: "arg_setup_ymd"
                    }
			    ]
            },
            target: [
                {
                    type: "FORM",
                    id: "frmData_보고서"
                }
            ],
            key: param.key
        };
    }
    else {
        if (param.key != undefined) {
            $.each(param.key, function () {
                if (this.QUERY == "w_ehm3020_S_2")
                    this.QUERY = "w_ehm3020_S_1";
            });
        }
        args = {
            source: {
                type: "GRID",
                id: "grdData_현황",
                row: "selected",
                block: true,
                element: [
				    {
				        name: "setup_no",
				        argument: "arg_setup_no"
				    }
			    ]
            },
            target: [
                {
                    type: "GRID",
                    id: "grdData_보고서",
                    select: true
                },
			    {
			        type: "GRID",
			        id: "grdData_첨부파일"
			    }
		    ],
            clear: [
		        {
		            type: "FORM",
		            id: "frmData_보고서"
		        }
		    ],
            key: param.key
        };
    }
    gw_com_module.objRetrieve(args);

}
//----------
function processSelect(param) {

    if (param.sub)
        gw_com_api.selectRow("grdData_보고서", v_global.process.current.sub, true, false);
    else
        gw_com_api.selectRow("grdData_현황", v_global.process.current.master, true, false);

}
//----------
function processInsert(param) {

    if (param.sub) {
        gw_com_api.selectRow("grdData_보고서", "reset");
        var args = {
            targetid: "frmData_보고서",
            edit: true,
            data: [
                { name: "setup_no", value: gw_com_api.getValue("grdData_현황", "selected", "setup_no", true) },
                { name: "setup_ymd", value: gw_com_api.getDate() }
            ]
        };
        gw_com_module.formInsert(args);
    }
    else {
        var args = {
            targetid: "grdData_현황",
            edit: true,
            updatable: true,
            data: [
                { name: "str_ymd", value: gw_com_api.getDate() }
            ],
            clear: [
		        {
		            type: "GRID",
		            id: "grdData_보고서"
		        },
		        {
		            type: "FORM",
		            id: "frmData_보고서"
		        },
		        {
		            type: "GRID",
		            id: "grdData_첨부파일"
		        }
	        ]
        };
        var row = gw_com_module.gridInsert(args);

        v_global.event.type = "GRID";
        v_global.event.object = "grdData_현황";
        v_global.event.row = row;
        v_global.event.element = "prod_sub";
        var args = {
            type: "PAGE",
            page: "w_find_prod_ehm",
            title: "장비 검색",
            width: 800,
            height: 460,
            locate: ["center", "top"],
            open: true
        };
        if (gw_com_module.dialoguePrepare(args) == false) {
            var args = {
                page: "w_find_prod_ehm",
                param: {
                    ID: gw_com_api.v_Stream.msg_selectProduct_EHM
                }
            };
            gw_com_module.dialogueOpen(args);
        }
    }

}
//----------
function processDelete(param) {

    if (param.sub) {
        var args = {
            targetid: "grdData_보고서",
            row: "selected",
            clear: [
                {
                    type: "FORM",
                    id: "frmData_보고서"
                }
            ]
        };
        gw_com_module.gridDelete(args);
    }
    else {
        var args = {
            targetid: "grdData_현황",
            row: "selected",
            remove: true,
            clear: [
                {
                    type: "GRID",
                    id: "grdData_보고서"
                },
                {
                    type: "FORM",
                    id: "frmData_보고서"
                },
                {
                    type: "GRID",
                    id: "grdData_첨부파일"
                }
            ]
        };
        gw_com_module.gridDelete(args);
    }
}
//----------
function processSave(param) {

    var args = {
        target: [
            {
                type: "GRID",
                id: "grdData_현황"
            },
            {
                type: "GRID",
                id: "grdData_보고서"
            },
			{
			    type: "FORM",
			    id: "frmData_보고서"
			},
			{
			    type: "GRID",
			    id: "grdData_첨부파일"
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
        target: [
		    {
		        type: "GRID",
		        id: "grdData_현황",
		        key: [
		            {
		                row: "selected",
		                element: [
		                    { name: "setup_no" }
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
function processRestore(param) {

    var args = {
        targetid: "grdData_현황",
        row: v_global.process.prev.master
    };
    gw_com_module.gridRestore(args);

}
//----------
function processClear(param) {

    var args = {
        target: [
            {
                type: "FORM",
                id: "frmData_보고서"
            }
        ]
    };
    if (param.master) {
        args.target.unshift({
            type: "GRID",
            id: "grdData_보고서"
        });
        args.target.unshift({
            type: "GRID",
            id: "grdData_첨부파일"
        });
        args.target.unshift({
            type: "GRID",
            id: "grdData_현황"
        });
    }
    else if (param.sub) {
        args.target.unshift({
            type: "GRID",
            id: "grdData_보고서"
        });
        args.target.unshift({
            type: "GRID",
            id: "grdData_첨부파일"
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

    var status = checkCRUD({});
    if (status == "create" || status == "update")
        processRetrieve({ key: response });
    else
        processLink({ key: response });

}
//----------
function successRemove(response, param) {

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
                                processSave(param.data.arg);
                            else {
                                var status = checkCRUD({});
                                if (status == "initialize" || status == "create")
                                    processDelete({});
                                else if (status == "update")
                                    processRestore({});
                                if (v_global.process.handler != null)
                                    v_global.process.handler(param.data.arg);
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
                    case gw_com_api.v_Message.msg_informRemoved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_selectedProduct_EHM:
            {
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "cust_nm",
			                        param.data.cust_nm,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "cust_cd",
			                        param.data.cust_cd,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "cust_dept",
			                        param.data.cust_dept,
			                        (v_global.event.type == "GRID") ? true : false,
                                    true);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "cust_proc",
			                        param.data.cust_dept,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "cust_prod_nm",
			                        param.data.cust_prod_nm,
			                        (v_global.event.type == "GRID") ? true : false,
                                    true);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "prod_key",
			                        param.data.prod_key,
			                        (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
        case gw_com_api.v_Stream.msg_uploaded_ASSETUP:
            {
                var args = {
                    source: {
                        type: "GRID",
                        id: "grdData_현황",
                        row: "selected",
                        element: [
				            {
				                name: "setup_no",
				                argument: "arg_setup_no"
				            }
			            ]
                    },
                    target: [
			            {
			                type: "GRID",
			                id: "grdData_첨부파일",
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
                    case "w_find_prod_ehm":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectProduct_EHM;
                        }
                        break;
                    case "w_upload_assetup":
                        {
                            args.ID = gw_com_api.v_Stream.msg_upload_ASSETUP;
                            args.data = {
                                user: gw_com_module.v_Session.USR_ID,
                                key: gw_com_api.getValue("grdData_현황", "selected", "setup_no", true),
                                seq: gw_com_api.getValue("grdData_현황", "selected", "str_ymd", true)
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