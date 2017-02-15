// ECCB 회의 등록
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define Global variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
    data: null, logic: {}
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define gw_job_process class : ready(), UI(), procedure()
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var gw_job_process = {

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // entry point. (pre-process section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ready: function () {

        // initialize page.
        v_global.process.param = gw_com_module.initPage({ authority: true, message: true });
        gw_com_api.changeTheme("style_theme");

        // prepare dialogue. ---그룹웨어 로그인
        var args = { type: "PAGE", page: "IFProcess", path: "../Master/", title: "그룹웨어 로그인",
            width: 430, height: 90, locate: ["center", 200]
        };
        gw_com_module.dialoguePrepare(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set data for DDDW List
        var args = { request: [
                {
                    type: "PAGE", name: "심의결과", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "ECCB30" }]
                },
                {
                    type: "PAGE", name: "우선순위", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "ECCB22" }]
                },
				{
				    type: "PAGE", name: "분류1", query: "dddw_zcode",
				    param: [{ argument: "arg_hcode", value: "ECCB05" }]
				},
				{
				    type: "PAGE", name: "분류2", query: "dddw_zcode",
				    param: [{ argument: "arg_hcode", value: "ECCB06" }]
				},
				{
				    type: "PAGE", name: "분류3", query: "dddw_zcode",
				    param: [{ argument: "arg_hcode", value: "ECCB07" }]
				},
				{
				    type: "PAGE", name: "DEPT_AREA_IN", query: "dddw_deptarea_in",
				    param: [{ argument: "arg_type", value: gw_com_module.v_Session.DEPT_AUTH }]
				},
                { type: "PAGE", name: "부서", query: "dddw_dept" },
                { type: "PAGE", name: "사원", query: "dddw_emp" }
			],
            starter: start
        };
        gw_com_module.selectSet(args);

        //----------
        function start() { gw_job_process.UI(); }

    },
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage UI. (design section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    UI: function () {

        var args = { targetid: "lyrMenu_Main", type: "FREE",
            element: [
                { name: "조회", value: "새로고침", icon: "조회" },
                //{ name: "평가", value: "제안평가", icon: "실행" },
                { name: "상신", value: "결재상신", icon: "기타" },
				{ name: "추가", value: "추가" },
				{ name: "저장", value: "저장" },
				{ name: "삭제", value: "삭제" },
				{ name: "닫기", value: "닫기" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_Sub", type: "FREE",
            element: [
                { name: "상세", value: "상세정보", icon: "기타" },
				{ name: "추가", value: "추가" },
				{ name: "삭제", value: "삭제" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
       //=====================================================================================
        var args = { targetid: "lyrMenu_D3", type: "FREE",
            element: [
                { name: "예정", value: "예정통보", icon: "실행", updatable: true },
                { name: "결과", value: "결과통보", icon: "실행" },
				{ name: "추가", value: "추가" },
				{ name: "삭제", value: "삭제" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_File1", type: "FREE",
            element: [
				{ name: "추가", value: "첨부추가" },
				{ name: "삭제", value: "첨부삭제" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = { targetid: "frmData_Main", query: "w_eccb2020_M_1", type: "TABLE", title: "회의 정보",
            //caption: true,
            show: true, selectable: true,
            editable: { bind: "select", focus: "str_time", validate: true },
            content: { width: { label: 100, field: 190 }, height: 25,
                row: [
                    { element: [
                            { header: true,
                                value: "심의번호",
                                format: { type: "label"
                                }
                            },
                            { name: "eccb_no",
                                editable: { type: "hidden"
                                }
                            },
                            { header: true,
                                value: "주관부서",
                                format: { type: "label"
                                }
                            },
                            {
                                name: "mng_dept",
                                format: {
                                    type: "select",
                                    data: {
                                        memory: "부서"
                                    }
                                },
                                editable: { type: "select",
                                    data: { memory: "부서"
                                    }
                                }
                            },
                            { header: true,
                                value: "시작시각",
                                format: { type: "label"
                                }
                            },
                            { name: "str_time",
                                mask: "time-hm",
                                editable: { type: "text"
                                }
                            }
                        ]
                    },
                    { element: [
                            { header: true,
                                value: "회의장소",
                                format: { type: "label"
                                }
                            },
                            { name: "meet_place",
                                editable: { type: "text"
                                }
                            },
                            { header: true,
                                value: "회의일자",
                                format: { type: "label"
                                }
                            },
                            { name: "meet_dt",
                                mask: "date-ymd",
                                editable: { type: "text"
                                }
                            },
                            { header: true,
                                value: "종료시각",
                                format: { type: "label"
                                }
                            },
                            { name: "end_time",
                                mask: "time-hm",
                                editable: { type: "text"
                                }
                            }
                        ]
                    },
                    { element: [
                            { header: true, value: "제목", format: { type: "label" } },
                            { name: "meet_title", style: { colspan: 3 },
                                format: { width: 620 },
                                editable: { type: "text", width: 620 }
                            },
                            { header: true, value: "사업부", format: { type: "label" } },
                            { name: "dept_area",
                                format: { type: "select", data: { memory: "DEPT_AREA_IN" } },
                                editable: { type: "select", data: { memory: "DEPT_AREA_IN" }, validate: { rule: "required" } }
                            }
                        ]
                    },
                    { element: [
                            { header: true,
                                value: "승인상태",
                                format: { type: "label"
                                }
                            },
                            { name: "gw_astat_nm"
                            },
                            { header: true,
                                value: "승인자",
                                format: { type: "label"
                                }
                            },
                            { name: "gw_aemp"
                            },
                            { header: true,
                                value: "승인일시",
                                format: { type: "label"
                                }
                            },
                            { name: "gw_adate"
                            },
                            { name: "gw_astat",
                                hidden: true
                            },
                            { name: "gw_key",
                                hidden: true
                            },
                            { name: "gw_seq",
                                hidden: true
                            }
                        ]
                    }
                ] }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = { targetid: "grdData_Sub", query: "w_eccb2020_S_1", title: "협의 안건",
            caption: true, height: "100%", pager: false, show: true, selectable: true,
            editable: { multi: true, bind: "select", validate: true },
            element: [
                { header: "구분", name: "root_type", width: 50, align: "center", editable: { type: "hidden" }, hidden: true },
                { header: "구분", name: "root_type_nm", width: 50, align: "center" },
				{ header: "등록번호", name: "root_no", width: 100, align: "center", editable: { type: "hidden" } },
				{ header: "개선제안명", name: "root_title", width: 350, align: "left" },
				{ header: "제안자", name: "root_emp", width: 70, align: "center" },
				{ header: "작성일자", name: "root_dt", width: 70, align: "center", mask: "date-ymd" },
				{ header: "조치요구일", name: "root_act_rqst_date", width: 70, align: "center", mask: "date-ymd" },
				{
				    header: "시정요구일", name: "act_rqst_date", width: 70, align: "center", mask: "date-ymd",
				    editable: { type: "hidden" }, mask: "date-ymd"
				},
				{ header: "심의결과", name: "result_nm", width: 60, align: "center" },
				{ name: "result_cd", hidden: true, editable: { type: "hidden" } },
				{ name: "priority_cd", hidden: true, editable: { type: "hidden" } },
				{ name: "act_dept1", hidden: true, editable: { type: "hidden" } },
				{ name: "act_dept2", hidden: true, editable: { type: "hidden" } },
				{ name: "act_dept1_nm", hidden: true },
				{ name: "act_dept2_nm", hidden: true },
				{ name: "act_emp1", hidden: true, editable: { type: "hidden" } },
				{ name: "act_emp2", hidden: true, editable: { type: "hidden" } },
				{ name: "act_emp1_nm", hidden: true },
				{ name: "act_emp2_nm", hidden: true },
				{ name: "item_note", hidden: true, editable: { type: "hidden" } },
				{ name: "ecr_no", hidden: true, editable: { type: "hidden" } },
				{ name: "cip_no", hidden: true, editable: { type: "hidden" } },
				{ name: "item_seq", hidden: true, editable: { type: "hidden" } },
				{ name: "eccb_no", hidden: true, editable: { type: "hidden" } }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = { targetid: "frmData_D1", query: "w_eccb2020_S_2", type: "TABLE", title: "협의 안건",
            //caption: true,
            show: true, selectable: true,
            editable: { bind: "select", focus: "result_cd", validate: true },
            content: { width: { label: 100, field: 190 }, height: 25,
                row: [
                    { element: [
                            { header: true, value: "등록번호", format: { type: "label" } },
                            { name: "root_no" },
                            { header: true, value: "실행부서", format: { type: "label" } },
                            { name: "act_dept1_nm" },
                            { header: true, value: "담당자", format: { type: "label" } },
                            { name: "act_emp1_nm", mask: "search", display: true, editable: { type: "text" } },
                            { name: "act_dept1", hidden: true, editable: { type: "hidden" } },
                            { name: "act_emp1", hidden: true, editable: { type: "hidden" } }
                        ]
                    },
                    { element: [
                            { header: true, value: "심의결과", format: { type: "label" } },
                            {
                                name: "result_cd",
                                format: { type: "select", data: { memory: "심의결과" } },
                                editable: { type: "select", data: { memory: "심의결과" } }
                            },
                            { header: true, value: "실행부서", format: { type: "label" } },
                            { name: "act_dept2_nm" },
                            { header: true, value: "담당자", format: { type: "label" } },
                            { name: "act_emp2_nm", mask: "search", display: true, editable: { type: "text" } },
                            { name: "act_dept2", hidden: true, editable: { type: "hidden" } },
                            { name: "act_emp2", hidden: true, editable: { type: "hidden" } }
                        ]
                    },
                    { element: [
                            { header: true, value: "우선순위", format: { type: "label" } },
                            {
                                style: { colspan: 3 }, name: "priority_cd", format: { width: 600 },
                                format: { type: "select", data: { memory: "우선순위" }, width: 600 },
                                editable: { type: "select", data: { memory: "우선순위" }, width: 600 }
                            },
                            { header: true, value: "시정요구일", format: { type: "label" } },
                            { name: "act_rqst_date", display: true, editable: { type: "text" }, mask: "date-ymd" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "협의내용", format: { type: "label" } },
                            {
                                style: { colspan: 5 },
                                name: "item_note", format: { type: "textarea", rows: 4, width: 900 },
                                editable: { type: "textarea", rows: 4, width: 900 }
                            },
                            { name: "root_no", hidden: true, editable: { type: "hidden" } },
                            { name: "item_seq", hidden: true, editable: { type: "hidden" } },
                            { name: "eccb_no", hidden: true, editable: { type: "hidden" } }
                        ]
                    }
                ] }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_D4", query: "w_eccb1020_M_1", type: "TABLE", title: "MP 분류",
            caption: true, show: true, selectable: true,
            editable: { bind: "select", focus: "pstat", validate: true },
            content: {
                width: { label: 100, field: 780 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "분류", format: { type: "label" } },
                            {
                                style: { colspan: 5, colfloat: "float" }, name: "act_region1", format: { width: 0 },
                                editable: { type: "select", data: { memory: "분류1", unshift: [{ title: "-", value: "" }] }, width: 155 }
                            },
                            { style: { colfloat: "floating" }, name: "act_region1_text", format: { width: 200 } },
                            { style: { colfloat: "floating" }, name: "act_module1_text", format: { width: 300 } },
                            {
                                style: { colfloat: "floating" }, name: "act_module1_sel", format: { width: 0 },
                                editable: { type: "select", data: { memory: "분류2", unshift: [{ title: "-", value: "" }] }, width: 155 },
                                display: true
                            },
                            {
                                style: { colfloat: "floating" }, name: "act_module1_etc", format: { width: 0 },
                                editable: { type: "text", width: 155 },
                                display: true
                            },
                            { name: "act_module1", hidden: true, editable: { type: "hidden" } },
                            {
                                style: { colfloat: "floating" },
                                name: "mp_class1_text", format: { width: 200 }
                            },
                            {
                                style: { colfloat: "floating" }, name: "mp_class1_sel", format: { width: 0 },
                                editable: { type: "select", data: { memory: "분류3", unshift: [{ title: "-", value: "" }] }, width: 155 },
                                display: true
                            },
                            {
                                style: { colfloat: "floated" }, name: "mp_class1_etc", format: { width: 0 },
                                editable: { type: "text", width: 155 },
                                display: true
                            },
                            { name: "mp_class1", hidden: true, editable: { type: "hidden" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "", format: { type: "label" } },
                            {
                                style: { colspan: 5, colfloat: "float" }, name: "act_region2", format: { width: 0 },
                                editable: { type: "select", data: { memory: "분류1", unshift: [{ title: "-", value: "" }] }, width: 155 }
                            },
                            { style: { colfloat: "floating" }, name: "act_region2_text", format: { width: 200 } },
                            { style: { colfloat: "floating" }, name: "act_module2_text", format: { width: 300 } },
                            {
                                style: { colfloat: "floating" }, name: "act_module2_sel", format: { width: 0 },
                                editable: { type: "select", data: { memory: "분류2", unshift: [{ title: "-", value: "" }] }, width: 155 },
                                display: true
                            },
                            {
                                style: { colfloat: "floating" }, name: "act_module2_etc", format: { width: 0 },
                                editable: { type: "text", width: 155 },
                                display: true
                            },
                            { name: "act_module2", hidden: true, editable: { type: "hidden" } },
                            { style: { colfloat: "floating" }, name: "mp_class2_text", format: { width: 200 } },
                            {
                                style: { colfloat: "floating" }, name: "mp_class2_sel", format: { width: 0 },
                                editable: { type: "select", data: { memory: "분류3", unshift: [{ title: "-", value: "" }] }, width: 155 },
                                display: true
                            },
                            {
                                style: { colfloat: "floated" }, name: "mp_class2_etc", format: { width: 0 },
                                editable: { type: "text", width: 155 },
                                display: true
                            },
                            { name: "mp_class2", hidden: true, editable: { type: "hidden" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "", format: { type: "label" } },
                            {
                                style: { colspan: 5, colfloat: "float" }, name: "act_region3", format: { width: 0 },
                                editable: { type: "select", data: { memory: "분류1", unshift: [{ title: "-", value: "" }] }, width: 155 }
                            },
                            { style: { colfloat: "floating" }, name: "act_region3_text", format: { width: 200 } },
                            { style: { colfloat: "floating" }, name: "act_module3_text", format: { width: 300 } },
                            {
                                style: { colfloat: "floating" }, name: "act_module3_sel", format: { width: 0 },
                                editable: { type: "select", data: { memory: "분류2", unshift: [{ title: "-", value: "" }] }, width: 155 },
                                display: true
                            },
                            {
                                style: { colfloat: "floating" }, name: "act_module3_etc", format: { width: 0 },
                                editable: { type: "text", width: 155 },
                                display: true
                            },
                            { name: "act_module3", hidden: true, editable: { type: "hidden" } },
                            { style: { colfloat: "floating" }, name: "mp_class3_text", format: { width: 200 } },
                            {
                                style: { colfloat: "floating" }, name: "mp_class3_sel", format: { width: 0 },
                                editable: { type: "select", data: { memory: "분류3", unshift: [{ title: "-", value: "" }] }, width: 155 },
                                display: true
                            },
                            {
                                style: { colfloat: "floated" }, name: "mp_class3_etc", format: { width: 0 },
                                editable: { type: "text", width: 155 },
                                display: true
                            },
                            { name: "mp_class3", hidden: true, editable: { type: "hidden" } },
                            { name: "ecr_no", hidden: true, editable: { type: "hidden" } }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = { targetid: "frmData_D2", query: "w_eccb2020_M_2", type: "TABLE", title: "회의 비고",
            caption: true, width: "100%", show: true, selectable: true,
            editable: { bind: "select", /*focus: "meet_note",*/ validate: true },
            content: { height: 25, width: { label: 100, field: 770 },
                row: [
                    { element: [
                            { header: true, value: "비고", format: { type: "label" } },
                            {
                                name: "meet_note", format: { type: "textarea", rows: 5, width: 900 },
                                editable: { type: "textarea", rows: 5, width: 900 }
                            },
                            { name: "eccb_no", hidden: true, editable: { type: "hidden" } }
                        ]
                    }
                ] }
        };
        //----------
        gw_com_module.formCreate(args);
		//=====================================================================================
        var args = { targetid: "grdData_Sub2", query: "w_eccb5020_S_1", title: "평가 안건", caption: true,
            height: "100%", pager: false, show: false, //selectable: true,
            //editable: { master: true, multi: true, bind: "select", validate: true },
            element: [
				{ header: "ECR No.", name: "ecr_no", width: 100, align: "center", editable: { type: "hidden" } },
				{ header: "개선제안명", name: "ecr_title", width: 350, align: "left" },
                { header: "ECO No.", name: "eco_no", width: 100, align: "center", editable: { type: "hidden" } },
				{ header: "제안자", name: "ecr_emp", width: 70, align: "center" },
				{ header: "제안일자", name: "ecr_dt", width: 80, align: "center", mask: "date-ymd" },
				{ header: "평가점수", name: "evl_point", width: 80, align: "center", editable: { type: "hidden" } },
				{ header: "평가등급", name: "evl_grade", hidden: true, editable: { type: "hidden" } },
				{ name: "evl_no", hidden: true, editable: { type: "hidden" } },
				{ name: "root_no", hidden: true, editable: { type: "hidden" } },
				{ name: "root_seq", hidden: true, editable: { type: "hidden" } },
				{ name: "cip_no", hidden: true, editable: { type: "hidden" } },
				{ header: "평가일자", name: "evl_date", hidden: true, editable: { type: "hidden" } },
				{ name: "pstat", hidden: true, editable: { type: "hidden" } },
				{ name: "pdate", hidden: true, editable: { type: "hidden" } },
				{ name: "evl_rmk", hidden: true, editable: { type: "hidden" } }
			]
        };
        gw_com_module.gridCreate(args);

        //=====================================================================================
        var args = { targetid: "grdData_D3", query: "w_eccb2020_S_3", title: "참석자",
            caption: true, height: "100%", pager: false, show: true, selectable: true,
            editable: { multi: true, bind: "select", validate: true },
            element: [
				{ header: "부서",
				    name: "attend_dept1_nm",
				    width: 120,
				    align: "center"
				},
				{ header: "성명",
				    name: "attend_emp1_nm",
				    width: 100,
				    align: "center",
				    mask: "search",
				    display: true,
				    editable: { type: "text"
				    }
				},
                { header: "참석",
                    name: "attend_yn1",
                    width: 30,
                    align: "center",
                    format: { type: "checkbox",
                        title: "",
                        value: "1",
                        offval: "0"
                    },
                    editable: { type: "checkbox",
                        title: "",
                        value: "1",
                        offval: "0"
                    }
                },
                { header: "부서",
                    name: "attend_dept2_nm",
                    width: 120,
                    align: "center" },
				{ header: "성명",
				    name: "attend_emp2_nm",
				    width: 100,
				    align: "center",
				    width: 100,
				    align: "center",
				    mask: "search",
				    display: true,
				    editable: { type: "text"
				    }
				},
                { header: "참석",
                    name: "attend_yn2",
                    width: 30,
                    align: "center",
                    format: { type: "checkbox",
                        title: "",
                        value: "1",
                        offval: "0"
                    },
                    editable: { type: "checkbox",
                        title: "",
                        value: "1",
                        offval: "0"
                    }
                },
                { header: "부서",
                    name: "attend_dept3_nm",
                    width: 120,
                    align: "center" },
				{ header: "성명",
				    name: "attend_emp3_nm",
				    width: 100,
				    align: "center",
				    width: 100,
				    align: "center",
				    mask: "search",
				    display: true,
				    editable: { type: "text"
				    }
				},
                { header: "참석",
                    name: "attend_yn3",
                    width: 30,
                    align: "center",
                    format: { type: "checkbox",
                        title: "",
                        value: "1",
                        offval: "0"
                    },
                    editable: { type: "checkbox",
                        title: "",
                        value: "1",
                        offval: "0"
                    }
                },
				{ name: "attend_dept1",
				    hidden: true,
				    editable: { type: "hidden"
				    }
				},
				{ name: "attend_emp1",
				    hidden: true,
				    editable: { type: "hidden"
				    }
				},
				{ name: "attend_dept2",
				    hidden: true,
				    editable: { type: "hidden"
				    }
				},
				{ name: "attend_emp2",
				    hidden: true,
				    editable: { type: "hidden"
				    }
				},
				{ name: "attend_dept3",
				    hidden: true,
				    editable: { type: "hidden"
				    }
				},
				{ name: "attend_emp3",
				    hidden: true,
				    editable: { type: "hidden"
				    }
				},
				{ name: "attend_seq",
				    hidden: true,
				    editable: { type: "hidden"
				    }
				},
				{ name: "eccb_no",
				    hidden: true,
				    editable: { type: "hidden"
				    }
				}
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        //grdData_File1 : 첨부 파일
        var args = { targetid: "grdData_File1", query: "w_eccb2020_S_4", title: "첨부 문서",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            editable: { multi: true, bind: "select", focus: "file_desc", validate: true },
            element: [
				{ header: "파일명", name: "file_nm", width: 350, align: "left" },
				{ header: "다운로드", name: "download", width: 60, align: "center",
				  format: { type: "link", value: "다운로드" } },
				{ header: "파일설명", name: "file_desc", width: 600, align: "left",
				  editable: { type: "text" } },
                { name: "file_ext", hidden: true },
                { name: "file_path", hidden: true },
                { name: "network_cd", hidden: true },
                { name: "data_tp", hidden: true },
                { name: "data_key", hidden: true },
                { name: "data_seq", hidden: true },
                { name: "file_id", hidden: true, editable: { type: "hidden" } }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false
        };
        gw_com_module.pageCreate(args);
        //=====================================================================================
        var args = { target: [
				{ type: "FORM", id: "frmData_Main", offset: 8 },
                { type: "GRID", id: "grdData_Sub", offset: 8 },
                { type: "FORM", id: "frmData_D1", offset: 8 },
                { type: "FORM", id: "frmData_D4", offset: 8 },
                { type: "FORM", id: "frmData_D2", offset: 8 },
                { type: "GRID", id: "grdData_Sub2", offset: 8 },
                { type: "GRID", id: "grdData_D3", offset: 8 },
				{ type: "GRID", id: "grdData_File1", offset: 8 }
			]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        //----------
        gw_com_module.informSize();

        gw_job_process.procedure();

    },
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage process. (program section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    procedure: function () {

        //----------
        var args = { targetid: "lyrMenu_Main",
            element: "상신",
            event: "click",
            handler: click_lyrMenu_Main_상신
        };
        gw_com_module.eventBind(args);

        //----------
        var args = { targetid: "lyrMenu_Main",
            element: "조회",
            event: "click",
            handler: click_lyrMenu_Main_조회
        };
        gw_com_module.eventBind(args);

        //----------
        var args = { targetid: "lyrMenu_Main",
            element: "추가",
            event: "click",
            handler: click_lyrMenu_Main_추가
        };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_Main",
            element: "삭제",
            event: "click",
            handler: click_lyrMenu_Main_삭제
        };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_Main",
            element: "저장",
            event: "click",
            handler: click_lyrMenu_Main_저장
        };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_Main",
            element: "평가",
            event: "click",
            handler: click_lyrMenu_Main_평가
        };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_Main",
            element: "닫기",
            event: "click",
            handler: click_lyrMenu_Main_닫기
        };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_Sub",
            element: "상세",
            event: "click",
            handler: click_lyrMenu_Sub_상세
        };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_Sub",
            element: "추가",
            event: "click",
            handler: click_lyrMenu_Sub_추가
        };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_Sub",
            element: "삭제",
            event: "click",
            handler: click_lyrMenu_Sub_삭제
        };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_D3",
            element: "추가",
            event: "click",
            handler: click_lyrMenu_D3_추가
        };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_D3",
            element: "삭제",
            event: "click",
            handler: click_lyrMenu_D3_삭제
        };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_D3",
            element: "예정",
            event: "click",
            handler: click_lyrMenu_D3_예정
        };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_D3",
            element: "결과",
            event: "click",
            handler: click_lyrMenu_D3_결과
        };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_File1",
            element: "추가",
            event: "click",
            handler: click_lyrMenu_File1_추가
        };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_File1",
            element: "삭제",
            event: "click",
            handler: click_lyrMenu_File1_삭제
        };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_Sub",
            grid: true,
            event: "rowselected",
            handler: rowselected_grdData_Sub
        };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_D1",
            event: "itemchanged",
            handler: itemchanged_frmData_D1
        };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_D1",
            event: "itemdblclick",
            handler: itemdblclick_frmData_D1
        };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_D1",
            event: "itemkeyenter",
            handler: itemdblclick_frmData_D1
        };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_D3",
            grid: true,
            event: "itemdblclick",
            handler: itemdblclick_grdData_D3
        };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_D3",
            grid: true,
            event: "itemkeyenter",
            handler: itemdblclick_grdData_D3
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmData_D4",
            event: "itemchanged",
            handler: itemchanged_frmData_D4
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_File1",
            grid: true,
            element: "download",
            event: "click",
            handler: click_grdData_File1_download
        };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_Main_조회() {
			processRetrieve({ key: v_global.logic.key });
        }
        //----------
        function click_lyrMenu_Main_상신() {
            if (!checkManipulate({})) return;
            if (!checkUpdatable({ check: true })) return false;
            processApprove({});
        }
        //----------
        function click_lyrMenu_Main_추가(ui) {

            v_global.process.handler = processInsert;
            if (!checkUpdatable({})) return;
            processInsert({});

        }
        //----------
        function click_lyrMenu_Main_삭제(ui) {

            if (!checkManipulate({})) return;

            v_global.process.handler = processRemove;

            checkRemovable({});

        }
        //----------
        function click_lyrMenu_Main_저장(ui) {

            processSave({});

        }
        //----------
        function click_lyrMenu_Main_평가(ui) {

            if (!checkManipulate({})) return;
            if (!checkUpdatable({ check: true })) return false;

            var args = { ID: gw_com_api.v_Stream.msg_linkPage,
                to: { type: "MAIN" } };
            if (checkEditable({}))
                args.data = { page: "w_eccb5020",
                    title: "평가 등록",
                    param: [
                        { name: "eccb_no", value: gw_com_api.getValue("frmData_Main", 1, "eccb_no") }
                    ]
                };
            else
                args.data = { page: "w_eccb5020",
                    title: "평가 정보",
                    param: [
                        { name: "AUTH", value: "R" },
                        { name: "eccb_no", value: gw_com_api.getValue("frmData_Main", 1, "eccb_no") }
                    ]
                };
            gw_com_module.streamInterface(args);

        }
        //----------
        function click_lyrMenu_Main_닫기(ui) {

            v_global.process.handler = processClose;
            if (!checkUpdatable({})) return;
            processClose({});

        }
        //----------
        function click_lyrMenu_Sub_상세(ui) {

            if (!checkManipulate({ sub: true })) return;

            var args = { type: "PAGE",
                page: "w_info_eccb_item",
                title: "안건 상세 정보",
                width: 950,
                height: 800,
                scroll: true,
                open: true };
            if (gw_com_module.dialoguePrepare(args) == false) { var args = { page: "w_info_eccb_item",
                    param: { ID: gw_com_api.v_Stream.msg_infoECCBItem,
                        data: { type: gw_com_api.getValue("grdData_Sub", "selected", "root_type", true),
                            ecr_no: gw_com_api.getValue("grdData_Sub", "selected", "ecr_no", true)
                        }
                    }
                };
                gw_com_module.dialogueOpen(args); }

        }
        //----------
        function click_lyrMenu_Sub_추가(ui) {

            if (!checkManipulate({})) return;

            processInsert({ item: true });

        }
        //----------
        function click_lyrMenu_Sub_삭제(ui) {

            if (!checkManipulate({})) return;

            var args = { targetid: "grdData_Sub",
                row: "selected" }
            gw_com_module.gridDelete(args);

        }
        //----------
        function click_lyrMenu_D3_추가(ui) {

            if (!checkManipulate({})) return;

            var args = { targetid: "grdData_D3",
                edit: true,
                data: [
                    { name: "eccb_no", value: gw_com_api.getValue("frmData_Main", 1, "eccb_no") }
                ] };
            gw_com_module.gridInsert(args);

        }
        //----------
        function click_lyrMenu_D3_삭제(ui) {

            if (!checkManipulate({})) return;

            var args = { targetid: "grdData_D3",
                row: "selected" }
            gw_com_module.gridDelete(args);

        }
        //----------
        function click_lyrMenu_D3_예정(ui) {

            if (!checkManipulate({})) return;
            if (!checkUpdatable({ check: true })) return false;

            gw_com_api.messageBox([
                { text: "회의 예정 사항에 대한 이메일을 발송합니다." + "<br>" },
                { text: "계속 하시겠습니까?" }
            ], 420, gw_com_api.v_Message.msg_confirmBatch, "YESNO", { plan: true });

        }
        //----------
        function click_lyrMenu_D3_결과(ui) { if (!checkManipulate({})) return;
            if (!checkUpdatable({ check: true })) return false;
            gw_com_api.messageBox([
                { text: "회의 결과에 대한 이메일을 발송합니다." + "<br>" },
                { text: "계속 하시겠습니까?" }
            ], 420, gw_com_api.v_Message.msg_confirmBatch, "YESNO", { result: true });
        }
        //----------
        function click_lyrMenu_File1_추가(ui) {

            if (!checkManipulate({})) return;
            if (!checkUpdatable({ check: true })) return false;

            var args = { type: "PAGE",
                page: "w_upload_eccb",
                title: "파일 업로드",
                width: 650,
                height: 200,
                //locate: ["center", 600],
                open: true };
            if (gw_com_module.dialoguePrepare(args) == false) { var args = { page: "w_upload_eccb",
                    param: { ID: gw_com_api.v_Stream.msg_upload_ECCB,
                        data: { user: gw_com_module.v_Session.USR_ID,
                            key: gw_com_api.getValue("frmData_Main", 1, "eccb_no"),
                            seq: 0
                        }
                    }
                };
                gw_com_module.dialogueOpen(args); }

        }
        //----------
        function click_lyrMenu_File1_삭제(ui) {

            if (!checkManipulate({})) return;

            var args = { targetid: "grdData_File1",
                row: "selected" }
            gw_com_module.gridDelete(args);

        }
        //----------
        function rowselected_grdData_Sub(ui) {

            if (checkEditable({})) {
                var args = {
                    targetid: "frmData_D1",
                    data: [
                        { name: "result_cd", value: gw_com_api.getValue(ui.object, ui.row, "result_cd", true), change: false },
                        { name: "priority_cd", value: gw_com_api.getValue(ui.object, ui.row, "priority_cd", true), change: false },
                        { name: "act_dept1", value: gw_com_api.getValue(ui.object, ui.row, "act_dept1", true), change: false },
                        { name: "act_dept2", value: gw_com_api.getValue(ui.object, ui.row, "act_dept2", true), change: false },
                        { name: "act_dept1_nm", value: gw_com_api.getValue(ui.object, ui.row, "act_dept1_nm", true), hide: true, change: false },
                        { name: "act_dept2_nm", value: gw_com_api.getValue(ui.object, ui.row, "act_dept2_nm", true), hide: true, change: false },
                        { name: "act_emp1", value: gw_com_api.getValue(ui.object, ui.row, "act_emp1", true), change: false },
                        { name: "act_emp2", value: gw_com_api.getValue(ui.object, ui.row, "act_emp2", true), change: false },
                        { name: "act_emp1_nm", value: gw_com_api.getValue(ui.object, ui.row, "act_emp1_nm", true), change: false },
                        { name: "act_emp2_nm", value: gw_com_api.getValue(ui.object, ui.row, "act_emp2_nm", true), change: false },
                        { name: "item_note", value: gw_com_api.getValue(ui.object, ui.row, "item_note", true).replace(/CRLF/g, "\r\n"), change: false },
                        { name: "act_rqst_date", value: gw_com_api.getValue(ui.object, ui.row, "act_rqst_date", true), change: false },
                    ]
                };
                gw_com_module.formInsert(args);

                if(gw_com_api.getSelectedRow("grdData_Sub") > 0)
                    processLink({ target: [{ type: "FORM", id: "frmData_D4" }] });
            }
            else { processLink({}); }

        };
        //----------
        function itemchanged_frmData_D1(ui) {

            if (!checkEditable({})) return;

            var vl = ui.value.current;
            if (ui.element == "item_note")
                vl = vl.replace(/\r\n/g, "CRLF");
            else if (ui.element == "act_rqst_date")
                vl = gw_com_api.unMask(vl, "date-ymd");
            gw_com_api.setValue("grdData_Sub", "selected", ui.element, vl, true, true);
            if (ui.element == "act_emp1_nm" || ui.element == "act_emp2_nm") { gw_com_api.setValue("grdData_Sub",
                                    "selected",
                                    ui.element.substr(0, ui.element.length - 3),
                                    gw_com_api.getValue(ui.object, ui.row, ui.element.substr(0, ui.element.length - 3)),
                                    true);
                gw_com_api.setValue("grdData_Sub",
                                    "selected",
                                    ui.element.replace("emp", "dept"),
                                    gw_com_api.getValue(ui.object, ui.row, ui.element.replace("emp", "dept"), false, true),
                                    true);
                gw_com_api.setValue("grdData_Sub",
                                    "selected",
                                    ui.element.substr(0, ui.element.length - 3).replace("emp", "dept"),
                                    gw_com_api.getValue(ui.object, ui.row, ui.element.substr(0, ui.element.length - 3).replace("emp", "dept")),
                                    true); }
            else if (ui.element == "result_cd")
                gw_com_api.setValue("grdData_Sub", "selected", "result_nm", gw_com_api.getText(ui.object, ui.row, ui.element), true);
            if (gw_com_api.getCRUD("grdData_Sub", "selected", true) == "retrieve")
                gw_com_api.setUpdatable("grdData_Sub", gw_com_api.getSelectedRow("grdData_Sub"), true);

        };
        //----------
        function itemdblclick_frmData_D1(ui) {

            if (!checkEditable({})) return;
            switch (ui.element) { case "act_emp1_nm":
                case "act_emp2_nm":
                    { gw_com_api.setValue(ui.object, ui.row, ui.element, "");
                        gw_com_api.setValue(ui.object, ui.row, ui.element.substr(0, ui.element.length - 3), "");
                        gw_com_api.setValue(ui.object, ui.row, ui.element.replace("emp", "dept"), "", false, true);
                        gw_com_api.setValue(ui.object, ui.row, ui.element.substr(0, ui.element.length - 3).replace("emp", "dept"), "");

                        v_global.event.type = ui.type;
                        v_global.event.object = ui.object;
                        v_global.event.row = ui.row;
                        v_global.event.element = ui.element;
                        var args = { type: "PAGE",
                            page: "w_find_emp",
                            title: "사원 검색",
                            width: 600,
                            height: 450,
                            locate: ["center", "top"],
                            open: true
                        };
                        if (gw_com_module.dialoguePrepare(args) == false) { var args = { page: "w_find_emp",
                                param: { ID: gw_com_api.v_Stream.msg_selectEmployee
                                }
                            };
                            gw_com_module.dialogueOpen(args);
                        }
                    }
                    break; }

        }
        //----------
        function itemdblclick_grdData_D3(ui) {

            switch (ui.element) { case "attend_emp1_nm":
                case "attend_emp2_nm":
                case "attend_emp3_nm":
                    { gw_com_api.setValue(ui.object, ui.row, ui.element, "", true);
                        gw_com_api.setValue(ui.object, ui.row, ui.element.substr(0, ui.element.length - 3), "", true);
                        gw_com_api.setValue(ui.object, ui.row, ui.element.replace("emp", "dept"), " ", true);
                        gw_com_api.setValue(ui.object, ui.row, ui.element.substr(0, ui.element.length - 3).replace("emp", "dept"), "", true);

                        v_global.event.type = ui.type;
                        v_global.event.object = ui.object;
                        v_global.event.row = ui.row;
                        v_global.event.element = ui.element;
                        var args = { type: "PAGE",
                            page: "w_find_emp",
                            title: "사원 검색",
                            width: 600,
                            height: 450,
                            open: true
                        };
                        if (gw_com_module.dialoguePrepare(args) == false) { var args = { page: "w_find_emp",
                                param: { ID: gw_com_api.v_Stream.msg_selectEmployee
                                }
                            };
                            gw_com_module.dialogueOpen(args);
                        }
                    }
                    break; }

        }
        //----------        
        function click_grdData_File1_download(ui) {

            var args = { source: { id: "grdData_File1",
                    row: ui.row
                },
                targetid: "lyrDown" };
            gw_com_module.downloadFile(args);

        }
        //----------
        function itemchanged_frmData_D4(ui) {

            switch (ui.element) {
                case "act_time_sel":
                case "act_module1_sel":
                case "act_module2_sel":
                case "act_module3_sel":
                case "mp_class1_sel":
                case "mp_class2_sel":
                case "mp_class3_sel":
                    {
                        var em = ui.element.substr(0, ui.element.length - 4);
                        gw_com_api.setValue(ui.object, ui.row, em + '_etc', "");
                        gw_com_api.setValue(ui.object, ui.row, em, (ui.value.current == "1000") ? "" : ui.value.current);
                    }
                    break;
                case "act_time_etc":
                case "act_module1_etc":
                case "act_module2_etc":
                case "act_module3_etc":
                case "mp_class1_etc":
                case "mp_class2_etc":
                case "mp_class3_etc":
                    {
                        var em = ui.element.substr(0, ui.element.length - 4);
                        if (gw_com_api.getValue(ui.object, ui.row, em + "_sel") == 1000)
                            gw_com_api.setValue(ui.object, ui.row, em, ui.value.current);
                    }
                    break;
            }

        };
        //----------

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_module.startPage();
        //----------
        if (v_global.process.param != "") { 
        	v_global.logic.key = gw_com_api.getPageParameter("eccb_no");
            processRetrieve({ key: v_global.logic.key });
        }
        else
            processInsert({});

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

    if (param.sub) {
        if (checkEditable({}))
            return gw_com_api.getCRUD("grdData_Sub", "selected", true);
        else
            return ((gw_com_api.getSelectedRow("grdData_Sub") == null) ? false : true);
    }
    else return gw_com_api.getCRUD("frmData_Main");

}
//----------
function checkManipulate(param) {

    if (checkCRUD(param) == "none") {
        gw_com_api.messageBox([
            { text: (param.sub) ? "선택된 내역이 없습니다." : "NOMASTER" }
        ]);
        return false;
    }
    return true;

}
//----------
function checkEditable(param) {

    return (gw_com_module.v_Option.authority.usable && gw_com_module.v_Option.authority.control == "R") ? false : true;

}
//----------
function checkUpdatable(param) {

    var args = {
        check: param.check,
        target: [
            { type: "FORM", id: "frmData_Main" },
            { type: "GRID", id: "grdData_Sub" },
            { type: "FORM", id: "frmData_D2" },
            { type: "GRID", id: "grdData_D3" },
            { type: "FORM", id: "frmData_D4" },
			{ type: "GRID", id: "grdData_File1" }
		],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function checkRemovable(param) {

    var status = checkCRUD(param);
    if (status == "initialize" || status == "create") {
        (param.sub) ? processDelete(param) : processClear({});
    }
    else
        gw_com_api.messageBox([
            { text: "REMOVE" }
        ], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO", param);

}
//----------
function processRetrieve(param) {

    var args = {
        source: { type: "INLINE",
            argument: [
                { name: "arg_eccb_no", value: param.key },
            ]
        },
        target: [
			{ type: "FORM", id: "frmData_Main" },
			{ type: "GRID", id: "grdData_Sub", select: checkEditable({}) ? false : true },
            { type: "FORM", id: "frmData_D2" },
            { type: "GRID", id: "grdData_D3" },
            { type: "GRID", id: "grdData_Sub2" },
            { type: "GRID", id: "grdData_File1" }
		],
        clear: [
            { type: "FORM", id: "frmData_D1" },
            { type: "FORM", id: "frmData_D4" },
			{ type: "GRID", id: "grdData_File1" }
		],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {

    var args = {
        source: { type: "GRID", id: "grdData_Sub", row: "selected", block: true,
            element: [
				{ name: "eccb_no", argument: "arg_eccb_no" },
                { name: "item_seq", argument: "arg_item_seq" },
                { name: "root_no", argument: "arg_ecr_no" }
            ]
        },
        target: [],
        key: param.key
    };

    if (param.target == undefined) {
        args.target = [
			{ type: "FORM", id: "frmData_D1" },
            { type: "FORM", id: "frmData_D4" }
        ];
    } else {
        args.target = param.target;
    }
    if (args.target.length < 1) return;
    gw_com_module.objRetrieve(args);

}
//----------
function processInsert(param) {

    if (param.member) {
        var args = {
	        source: { 
	            argument: [
	                { name: "arg_dept_area", value: gw_com_api.getValue("frmData_Main", 1, "dept_area", false) }
	            ]
	        },
            target: [
                { type: "GRID", id: "grdData_D3", query: "w_eccb2020_I_3", crud: "insert" }
		    ],
            key: param.key
        };
        gw_com_module.objRetrieve(args);
    }
    else if (param.item) {
        var args = { type: "PAGE", page: "w_find_eccb_item", title: "심의대상 선택",
            width: 850, height: 450, locate: ["center", "top"], open: true
        };
        if (gw_com_module.dialoguePrepare(args) == false) { 
            var args = { page: "w_find_eccb_item",
                param: { ID: gw_com_api.v_Stream.msg_selectECCBItem,
                    data: { type: "new"
                    	, eccb_no: gw_com_api.getValue("frmData_Main", 1, "eccb_no", false)
                    	, cur_dept_area: gw_com_api.getValue("frmData_Main", 1, "dept_area", false)
                    	, my_dept_area: gw_com_module.v_Session.DEPT_AREA }
                } };
            gw_com_module.dialogueOpen(args);
        }
    }
    else {
        var args = { targetid: "frmData_Main", edit: true, updatable: true,
            data: [
            	{ name: "dept_area", value: gw_com_module.v_Session.DEPT_AREA },
                { name: "mng_dept", value: "482" },
                { name: "meet_dt", value: gw_com_api.getDate("") }
            ],
            clear: [
                { type: "GRID", id: "grdData_Sub" },
                { type: "FORM", id: "frmData_D1" },
                { type: "FORM", id: "frmData_D2" },
                { type: "GRID", id: "grdData_D3" },
                { type: "GRID", id: "grdData_File1" }
            ]
        };
        gw_com_module.formInsert(args);
        args = { targetid: "frmData_D2", edit: true };
        gw_com_module.formInsert(args);
        gw_com_api.setCRUD("frmData_D2", 1, "modify");
        processInsert({ member: true });
    }

}
//----------
function processDelete(param) {

    var args = {
        target: [
            { type: "FORM",
                id: "frmData_Main" },
            { type: "GRID",
                id: "grdData_Sub" },
            { type: "FORM",
                id: "frmData_D1" },
            { type: "FORM",
                id: "frmData_D2" },
            { type: "GRID",
                id: "grdData_D3" },
            { type: "GRID",
                id: "grdData_File1" }
        ]
    };
    gw_com_module.objClear(args);

}
//----------
function processSave(param) {

    var args = {
        target: [
			{ type: "FORM", id: "frmData_Main" },
            { type: "GRID", id: "grdData_Sub" },
            { type: "FORM", id: "frmData_D2" },
            { type: "GRID", id: "grdData_D3" },
            { type: "FORM", id: "frmData_D4" },
			{ type: "GRID", id: "grdData_File1" }
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
            { type: "FORM", id: "frmData_Main",
		        key: { element: [ { name: "eccb_no" } ] }
		    }
        ],
        handler: { success: successRemove, param: param }
    };
    gw_com_module.objRemove(args);

}
//----------
function processInform(param) {
    var args = {
        url: (param.plan) ? "COM" : gw_com_module.v_Current.window + ".aspx/" + "Mail",
        procedure: "PROC_MAIL_ECCB_MEET", nomessage: true,
        argument: [
            { name: "eccb_no", value: gw_com_api.getValue("frmData_Main", 1, "eccb_no") }
        ],
        input: [
            { name: "user", value: gw_com_module.v_Session.USR_ID, type: "varchar" },
            { name: "emp_no", value: gw_com_module.v_Session.EMP_NO, type: "varchar" },
            { name: "eccb_no", value: gw_com_api.getValue("frmData_Main", 1, "eccb_no"), type: "varchar" },
            { name: "type", value: (param.plan) ? "PLAN" : "RESULT", type: "varchar" }
        ],
        output: [
            { name: "r_value", type: "int" },
            { name: "message", type: "varchar" }
        ],
        handler: { success: successInform }
    };
    gw_com_module.callProcedure(args);
}
//----------
function processApprove(param) {

    processRetrieve({ key: v_global.logic.key });

    var status = gw_com_api.getValue("frmData_Main", 1, "gw_astat_nm", false, true);
    if (status != '없슴' && status != '미처리' && status != '반송' && status != '회수') {
        gw_com_api.messageBox([
            { text: "결재 " + status + " 자료이므로 처리할 수 없습니다." }
        ], 420);
        return false;
    }

    //var args = { page: "IFProcess",
    //    param: { ID: gw_com_api.v_Stream.msg_authSystem,
    //        data: { system: "GROUPWARE",
    //            name: gw_com_module.v_Session.GW_ID,
    //            encrypt: { password: true },
    //            param: param }
    //    }
    //};
    //gw_com_module.dialogueOpen(args);

    var title = encodeURIComponent(Query.getApprovalTitle({ type: "ECCB", ref_key1: v_global.logic.key }));
    var url = "http://gw.terasemicon.com/_ERPR/Public/ERPRLogin.aspx?UserId=" + gw_com_module.v_Session.USR_ID
        + "&Pwd=&Lang=ko&EAID=113&gw_num=100&htmltag=&eccb_no=%27" + v_global.logic.key + "%27&NextUrl=/_EAPP/EADocumentWrite.aspx?FormID=113&ErpDocTitle=" + title;

    window.open(url, "", "");

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_Main" },
            { type: "GRID", id: "grdData_Sub" },
            { type: "FORM", id: "frmData_D1" },
            { type: "FORM", id: "frmData_D2" },
            { type: "GRID", id: "grdData_D3" },
            { type: "GRID", id: "grdData_File1" }
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
function closeDialogue(param) {

    var args = { page: param.page };
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

    var retrieve = false;
    $.each(response, function () {
        $.each(this.KEY, function () { 
        	if (this.NAME == "eccb_no") { 
        		v_global.logic.key = this.VALUE;
        		processRetrieve({ key: v_global.logic.key });
        		retrieve = true;
            }
        });
    });

    if (!retrieve) {
        processLink({ target: [{ type: "FORM", id: "frmData_D4" }] });
    }

}
//----------
function successRemove(response, param) {

    processDelete(param);

}
//----------
function successInform(response) {

    gw_com_api.messageBox([ { text: response.VALUE[1] } ], 350);

}
//----------
function successApproval(response, param) {

    processRetrieve({ key: v_global.logic.key });

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
        { name: "form_id", value: 7 },
        { name: "cmpid", value: 1 },
        { name: "inter_id", value: "I" },
        { name: "sysid", value: "ECCB" },
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
//----------
var Query = {
    getApprovalTitle: function (param) {
        var rtn = "";
        var args = {
            request: "PAGE",
            url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
                    "?QRY_ID=DLG_APPR_TITLE" +
                    "&QRY_COLS=title" +
                    "&CRUD=R" +
                    "&arg_type=" + param.type +
                    "&arg_ref_key1=" + (param.ref_key1 == undefined ? "" : param.ref_key1) +
                    "&arg_ref_key2=" + (param.ref_key2 == undefined ? "" : param.ref_key2) +
                    "&arg_ref_key3=" + (param.ref_key3 == undefined ? "" : param.ref_key3) +
                    "&arg_ref_key4=" + (param.ref_key4 == undefined ? "" : param.ref_key4) +
                    "&arg_ref_key5=" + (param.ref_key5 == undefined ? "" : param.ref_key5),
            handler_success: successRequest
        };
        //=================== async : false ========================
        $.ajaxSetup({ async: false });
        //----------
        gw_com_module.callRequest(args);
        function successRequest(data) {
            rtn = data[0].DATA[0];
        }
        //----------
        $.ajaxSetup({ async: true });
        //=================== async : true ========================
        return rtn
    }
}
//----------
function checkDupECCBItem(param) {

    var row = 0;
    var data = $("#grdData_Sub_data").jqGrid("getGridParam", "data");
    $.each(data, function (i) {
        if (this.root_type == param.root_type && this.root_no == param.root_no) {
            row = i + 1;
            return false;
        }
    });
    return row;
}
//----------
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_showMessage:
            { gw_com_module.streamInterface(param); }
            break;
        case gw_com_api.v_Stream.msg_resultMessage:
            { if (param.data.page != gw_com_api.getPageID()) { param.to = { type: "POPUP", page: param.data.page };
                    gw_com_module.streamInterface(param);
                    break;
                }
                switch (param.data.ID) { case gw_com_api.v_Message.msg_confirmSave:
                        { if (param.data.result == "YES")
                                processSave(param.data.arg);
                            else { processDelete({});
                                if (v_global.process.handler != null)
                                    v_global.process.handler(param.data.arg);
                            }
                        }
                        break;
                    case gw_com_api.v_Message.msg_confirmRemove:
                        { if (param.data.result == "YES")
                                processRemove(param.data.arg);
                        }
                        break;
                    case gw_com_api.v_Message.msg_confirmBatch:
                        { if (param.data.result == "YES")
                                processInform(param.data.arg);
                        }
                        break;
                    case gw_com_api.v_Message.msg_informSaved:
                        { param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                    case gw_com_api.v_Message.msg_informRemoved:
                        { param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                    case gw_com_api.v_Message.msg_informBatched:
                        { param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                } }
            break;
        case gw_com_api.v_Stream.msg_selectedECCBItem: { 
        	var args = { targetid: "grdData_Sub", edit: true, updatable: true };
            var row = 1;
            $.each(param.data.rows, function () {
                if (checkDupECCBItem({ root_type: this.root_type, root_no: this.root_no }) < 1) {
                    args.data = [
                        { name: "eccb_no", value: gw_com_api.getValue("frmData_Main", 1, "eccb_no") },
                        { name: "root_type", value: this.root_type },
                        { name: "root_type_nm", value: this.root_type_nm },
                        { name: "root_no", value: this.root_no },
                        { name: "ecr_no", value: this.ecr_no },
                        { name: "cip_no", value: this.cip_no },
                        { name: "root_title", value: this.root_title },
                        { name: "root_dt", value: this.root_dt },
                        { name: "root_emp", value: this.root_emp },
                        { name: "root_act_rqst_date", value: this.act_rqst_date }
                    ];
                    row = gw_com_module.gridInsert(args);
                }
            });
            gw_com_api.selectRow("grdData_Sub", row);
            closeDialogue({ page: param.from.page }); 
        } break;
        case gw_com_api.v_Stream.msg_selectedEmployee:
            { gw_com_api.setValue( v_global.event.object,
			                        v_global.event.row,
			                        v_global.event.element.substr(0, v_global.event.element.length - 3),
			                        param.data.emp_no,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue( v_global.event.object,
			                        v_global.event.row,
			                        v_global.event.element.replace("emp", "dept"),
			                        param.data.dept_nm,
			                        (v_global.event.type == "GRID") ? true : false,
                                    (v_global.event.type == "FORM") ? true : false);
                gw_com_api.setValue( v_global.event.object,
			                        v_global.event.row,
			                        v_global.event.element.substr(0, v_global.event.element.length - 3).replace("emp", "dept"),
			                        param.data.dept_cd,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue( v_global.event.object,
			                        v_global.event.row,
			                        v_global.event.element,
			                        param.data.emp_nm,
			                        (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true }); }
            break;
        case gw_com_api.v_Stream.msg_uploaded_ECCB:
            { var args = { source: { type: "FORM", id: "frmData_Main",
                        element: [
				            { name: "eccb_no", argument: "arg_eccb_no" }
			            ]
                    },
                    target: [
			            { type: "GRID", id: "grdData_File1", select: true }
		            ],
                    key: param.key
                };
                gw_com_module.objRetrieve(args); }
            break;
        case gw_com_api.v_Stream.msg_authedSystem: { 
            closeDialogue({ page: param.from.page });

                v_global.logic.name = param.data.name;
                v_global.logic.password = param.data.password;
                var gw_key = gw_com_api.getValue("frmData_Main", 1, "gw_key");
                var gw_seq = gw_com_api.getValue("frmData_Main", 1, "gw_seq");
                gw_seq = (gw_seq == "") ? 0 : parseInt(gw_seq);
                var args = { url: "COM",
                    procedure: "PROC_APPROVAL_ECCB",
                    input: [
                        { name: "user", value: gw_com_module.v_Session.USR_ID, type: "varchar" },
                        { name: "emp_no", value: gw_com_module.v_Session.EMP_NO, type: "varchar"}/*,
                        { name: "user", value: "goodware", type: "varchar" },
                        { name: "emp_no", value: "10505", type: "varchar" }*/,
                        { name: "eccb_no", value: gw_com_api.getValue("frmData_Main", 1, "eccb_no"), type: "varchar" },
                        { name: "gw_key", value: gw_key, type: "varchar" },
                        { name: "gw_seq", value: gw_seq, type: "int" }
                    ],
                    output: [
                        { name: "r_key", type: "varchar" },
                        { name: "r_seq", type: "int" },
                        { name: "r_value", type: "int" },
                        { name: "message", type: "varchar" }
                    ],
                    handler: { success: successApproval
                    }
                };
                gw_com_module.callProcedure(args); }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue: { 
            var args = { to: { type: "POPUP", page: param.from.page } };
            switch (param.from.page) { 
                case "w_find_eccb_item": {
                    args.ID = gw_com_api.v_Stream.msg_selectECCBItem;
                    args.data = { type: "new"
                    	, eccb_no: gw_com_api.getValue("frmData_Main", 1, "eccb_no", false)
                    	, cur_dept_area: gw_com_api.getValue("frmData_Main", 1, "dept_area", false)
                    	, my_dept_area: gw_com_module.v_Session.DEPT_AREA
                        };
                    }
                    break;
                case "w_info_eccb_item": { 
                    args.ID = gw_com_api.v_Stream.msg_infoECCBItem;
                    args.data = { type: gw_com_api.getValue("grdData_Sub", "selected", "root_type", true),
                            ecr_no: gw_com_api.getValue("grdData_Sub", "selected", "ecr_no", true)
                        };
                    }
                    break;
                case "w_find_emp":
                    { args.ID = gw_com_api.v_Stream.msg_selecteEmployee; }
                    break;
                case "w_upload_eccb":
                    { args.ID = gw_com_api.v_Stream.msg_upload_ECCB;
                        args.data = { user: gw_com_module.v_Session.USR_ID,
                            key: gw_com_api.getValue("frmData_Main", 1, "eccb_no"),
                            seq: 0
                        };
                    }
                    break;
                }
                gw_com_module.streamInterface(args); }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            { closeDialogue({ page: param.from.page }); }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//