//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 고분보 관리 > 고분보 등록
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

    // entry point. (pre-process section)
    ready: function () {

        // initialize page.
        v_global.process.param = gw_com_module.initPage({ authority: true, message: true });
        gw_com_api.changeTheme("style_theme");

        // prepare dialogue. ---그룹웨어 로그인
        //        var args = { type: "PAGE", page: "IFProcess", path: "../Master/", title: "그룹웨어 로그인",
        //            width: 430, height: 90, locate: ["center", 200]
        //        };
        //        gw_com_module.dialoguePrepare(args);

        // set data for DDDW List
        var args = { request: [
                { type: "PAGE", name: "AS발생구분", query: "DDDW_CM_CODE", param: [ { argument: "arg_hcode", value: "IEHM11" } ]  },
				{ type: "PAGE", name: "제품군", query: "DDDW_CM_CODE", param: [ { argument: "arg_hcode", value: "IEHM06" } ] },
				{ type: "PAGE", name: "제품유형", query: "DDDW_CM_CODE", param: [ { argument: "arg_hcode", value: "ISCM25" } ] },
                { type: "PAGE", name: "고객사", query: "dddw_cust" },
				{ type: "PAGE", name: "LINE", query: "dddw_custline"},
				{ type: "PAGE", name: "고객공정", query: "dddw_custproc"},
				{ type: "PAGE", name: "모듈", query: "DDDW_CM_CODED_A", param: [ { argument: "arg_hcode", value: "IEHM05" } ] },
                { type: "PAGE", name: "현상분류", query: "DDDW_CM_CODED_A", param: [ { argument: "arg_hcode", value: "IEHM21" } ] },
				{ type: "PAGE", name: "현상구분", query: "DDDW_CM_CODED_A", param: [ { argument: "arg_hcode", value: "IEHM31" } ] },
				{ type: "PAGE", name: "원인부위분류", query: "DDDW_CM_CODED_A", param: [ { argument: "arg_hcode", value: "IEHM22" } ] },
                { type: "PAGE", name: "원인부위구분", query: "DDDW_CM_CODED_A", param: [ { argument: "arg_hcode", value: "IEHM32" } ] },
				{ type: "PAGE", name: "원인분류", query: "DDDW_CM_CODED_A", param: [ { argument: "arg_hcode", value: "IEHM23" } ] },
				{ type: "PAGE", name: "원인구분", query: "DDDW_CM_CODED_A", param: [ { argument: "arg_hcode", value: "IEHM33" } ] },
				{ type: "PAGE", name: "AS진행상태", query: "DDDW_ISSUE_STAT" },
                { type: "PAGE", name: "부위구분", query: "dddw_zcode", param: [{ argument: "arg_hcode", value: "IEHM60"}] },
                { type: "PAGE", name: "PM상세구분", query: "dddw_zcode", param: [{ argument: "arg_hcode", value: "IEHM61"}] },
                { type: "PAGE", name: "현장조치결과", query: "dddw_zcode", param: [{ argument: "arg_hcode", value: "IEHM62"}] },
                { type: "PAGE", name: "발생구분", query: "dddw_zcode", param: [{ argument: "arg_hcode", value: "IEHM63"}] },
                { type: "PAGE", name: "원인추정", query: "dddw_zcode", param: [{ argument: "arg_hcode", value: "IEHM64"}] },
                { type: "PAGE", name: "이행유무", query: "dddw_zcode", param: [{ argument: "arg_hcode", value: "IEHM65"}] },
                { type: "PAGE", name: "준수여부", query: "dddw_zcode", param: [{ argument: "arg_hcode", value: "IEHM66"}] },
                { type: "PAGE", name: "대책구분", query: "dddw_zcoded", param: [{ argument: "arg_hcode", value: "IEHM67"}] },
                { type: "PAGE", name: "Item구분", query: "dddw_zcode", param: [{ argument: "arg_hcode", value: "IEHM69"}] },
                { type: "PAGE", name: "처리결과", query: "dddw_zcode", param: [{ argument: "arg_hcode", value: "QDM022"}] },
                { type: "INLINE", name: "Warranty", data: [{ title: "IN", value: "IN" }, { title: "OUT", value: "OUT" }] },
                { type: "INLINE", name: "유무", data: [{ title: "있음", value: "1" }, { title: "없음", value: "0"}] },
                { type: "INLINE", name: "진행상태", data: [{ title: "검토", value: "검토" }, { title: "처리", value: "처리"}] },
                { type: "INLINE", name: "재발방지", data: [{ title: "관리적대책", value: "관리적대책" }, { title: "기술적대책", value: "기술적대책"}] },
                { type: "PAGE", name: "발생현상(대)", query: "DDDW_CM_FCODE1", param: [{ argument: "arg_hcode", value: "IEHM21" }] },
                { type: "PAGE", name: "현상분류", query: "DDDW_CM_CODEF1", param: [{ argument: "arg_hcode", value: "IEHM21" }] },
				{ type: "PAGE", name: "현상구분", query: "DDDW_CM_CODEF", param: [{ argument: "arg_hcode", value: "IEHM31" }] },
				{ type: "PAGE", name: "원인부위분류", query: "DDDW_CM_CODEF", param: [{ argument: "arg_hcode", value: "IEHM22" }] },
                { type: "PAGE", name: "원인부위구분", query: "DDDW_CM_CODEF", param: [{ argument: "arg_hcode", value: "IEHM32" }] },
				{ type: "PAGE", name: "원인분류", query: "DDDW_CM_CODEF", param: [{ argument: "arg_hcode", value: "IEHM23" }] },
				{ type: "PAGE", name: "원인구분", query: "DDDW_CM_CODEF", param: [{ argument: "arg_hcode", value: "IEHM33" }] },
                { type: "PAGE", name: "귀책분류", query: "DDDW_CM_CODEF", param: [{ argument: "arg_hcode", value: "IEHM25" }] },
				{ type: "PAGE", name: "귀책구분", query: "DDDW_CM_CODEF", param: [{ argument: "arg_hcode", value: "IEHM35" }] },
                { type: "PAGE", name: "부서", query: "dddw_dept" },
                { type: "PAGE", name: "사원", query: "dddw_emp" },
				{
				    type: "PAGE", name: "DEPT_AREA_FIND", query: "dddw_deptarea",
				    param: [{ argument: "arg_type", value: gw_com_module.v_Session.DEPT_AUTH }]
				},
                {
                    type: "INLINE", name: "일자",
                    data: [
                        { title: "발생일자", value: "발생일자" },
                        { title: "작성일자", value: "작성일자" }
                    ]
                }
			],
            starter: start
        };
        gw_com_module.selectSet(args);

        //----------
        function start() {
            gw_job_process.UI();
            gw_job_process.procedure();

			v_global.logic.key = "";
			gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -1 }));
			gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate(""));

        }

    },

    // manage UI. (design section)
    UI: function () {

        //==== Main Menu : 상세, 저장, 통보, 삭제, 닫기
        var args = { targetid: "lyrMenu_Main", type: "FREE",
            element: [
				{ name: "조회", value: "조회", act: true },
                { name: "상세", value: "발생정보", icon: "실행" },
				{ name: "닫기", value: "닫기" }
			]
        };
        gw_com_module.buttonMenu(args);

        //==== Search Option : 
        var args = { targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true, remark: "lyrRemark",
            editable: { focus: "astat", validate: true },
            content: {
                row: [
                    {
                        element: [
			                {
			                    name: "date_tp", label: { title: "" },
			                    style: { colfloat: "float" },
			                    editable: {
			                        type: "select",
			                        data: { memory: "일자" }
			                    }
			                },
			                {
			                    name: "ymd_fr", label: { title: "발생일자 :" }, mask: "date-ymd",
			                    style: { colfloat: "floating" },
			                    editable: { type: "text", size: 7, maxlength: 10 }
			                },
			                {
			                    name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
			                    style: { colfloat: "floated" },
			                    editable: { type: "text", size: 7, maxlength: 10 }
			                },
                            {
                                name: "dept_area", label: { title: "사업부 :" },
                                editable: { type: "select", size: 7, maxlength: 20, data: { memory: "DEPT_AREA_FIND" } }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "issue_tp", label: { title: "발생구분 :" },
                                editable: { type: "select", size: 8, maxlength: 20 , 
                            	    data: { memory: "AS발생구분", unshift: [{ title: "전체", value: ""}] } }
                            },
                            {
                                name: "wrnt_io", label: { title: "Warranty :" },
                                editable: { type: "select",
                                    data: { memory: "Warranty", unshift: [{ title: "전체", value: "%"}] }
                                }
                            }
                    	]
                    },
                    {
                        element: [
                            { name: "prod_group", label: { title: "제품군 :" },
                                editable: { type: "select",
                                    data: { memory: "제품군", unshift: [ { title: "전체", value: "%" } ] }
                                }
                            },
				            {
				                name: "prod_type1", label: { title: "제품유형 :" },
				                editable: { type: "select",
				                    data: { memory: "제품유형", unshift: [ { title: "전체", value: "%" } ] }
				                }
				            },
				            {
				                name: "prod_type2",
				                editable: { type: "select",
				                    data: { memory: "제품유형", unshift: [ { title: "전체", value: "%" } ] }
				                }
				            },
				            {
				                name: "prod_type3",
				                editable: { type: "select",
				                    data: { memory: "제품유형", unshift: [ { title: "전체", value: "%" } ] }
				                }
				            }
				        ]
                    },
                    {
                        element: [
			                {
			                    name: "cust_cd", label: { title: "고객사 :" },
			                    editable: { type: "select", size: 1,
			                        data: { memory: "고객사", unshift: [ { title: "전체", value: "" } ] },
			                        change: [ { name: "cust_dept", memory: "LINE", key: [ "cust_cd" ] } ]
			                    }
			                },
			                {
			                    name: "cust_dept",
			                    label: { title: "LINE :" },
			                    editable: { type: "select", size: 1,
			                        data: { memory: "LINE", unshift: [ { title: "전체", value: "" } ], key: [ "cust_cd" ] }
			                    }
			                },
			                {
			                    name: "cust_proc",
			                    label: { title: "Process :" },
			                    editable: { type: "select", size: 1,
			                        data: { memory: "고객공정", unshift: [ { title: "전체", value: "" } ] }
			                    }
			                }
				        ]
                    },
                    {
                        element: [
                            {
                                name: "prod_nm", label: { title: "설비명 :" },
                                editable: { type: "text", size: 12, maxlength: 40 }
                            },
			                {
			                    name: "part_tp1", label: { title: "부위구분 :" },
			                    editable: { type: "select", size: 6,
			                        data: { memory: "부위구분", unshift: [ { title: "전체", value: "" } ] }
			                    }
			                },
			                {
			                    name: "part_tp2",
			                    label: { title: "상세부위구분 :" },
			                    editable: { type: "select", size: 6,
			                        data: { memory: "PM상세구분", unshift: [ { title: "전체", value: "" } ] }
			                    }
			                },
                            {
                                name: "pstat", label: { title: "진행상태 :" },
                                editable: { type: "select",
                                    data: { memory: "진행상태", unshift: [ { title: "전체", value: "%" } ] }
                                }
                            }
//                        { name: "dept_cd", label: { title: "담당부서 :" }, 
//                        	value: v_global.logic.UserDept, //hidden: v_global.logic.HideDept, 
//                            editable: { type: "select", size: 7, maxlength: 20,
//                                data: { memory: "부서", unshift: [{ title: "전체", value: ""}] } 
//                                }
//                        },
				        ]
                    },
                    {
                        element: [
                            {
                                name: "issue_no", label: { title: "발생번호 : AS" },
                                editable: { type: "text", size: 10, maxlength: 10 }
                            },
                            {
                                name: "rqst_no", label: { title: "고장분석번호 : TAR" },
                                editable: { type: "text", size: 10, maxlength: 10 }
                            },
			                {
			                    name: "search", label: { title: "Keyword 검색 :" },
			                    editable: { type: "texts", size: 30, maxlength: 100, keyword: true },
			                    tip: { text: " (키워드 간에 + 입력은 AND 조건 / , 입력은 OR 조건 검색)", color: "#505050" }
			                }
				        ]
                    },
                    {
                        element: [
			                { name: "실행", value: "실행", act: true, format: { type: "button" } },
			                { name: "취소", value: "취소", format: { type: "button", icon: "닫기" } }
				        ], align: "right"
                    }
			    ]
            }
        };
        gw_com_module.formCreate(args);
        var obj = document.getElementsByTagName("label");
        for (var i = 0; i < obj.length; i++) {
            var label = obj[i];
            if (label.innerHTML == "발생일자 :" || label.innerHTML == "작성일자 :") {
                label.style.display = "none";
            }
        }

        //==== Main Grid : 발생 내역
        var args = { targetid: "grdData_List", query: "EHM_2313_M_1", title: "발생 정보",
            caption: true, height: 150, show: true, selectable: true, number: true, pager: true, //  multi: true, checkrow: true,
            element: [
				{ header: "관리번호",  name: "issue_no", width: 80, align: "center" },
				{ header: "발생일자",  name: "issue_dt", width: 80, align: "center", mask: "date-ymd" },
				{ header: "발생구분",  name: "issue_tp", width: 60, align: "center" },
				{ header: "고객사",  name: "cust_nm", width: 60, align: "center" },
				{ header: "Line",  name: "cust_dept", width: 80, align: "center" },
				{ header: "Process",  name: "cust_proc", width: 100, align: "center" },
				{ header: "고객설비명",  name: "cust_prod_nm", width: 100, align: "center" },
                { header: "제품유형", name: "prod_type", width: 80, align: "center" },
				{ header: "제품명",  name: "prod_nm", width: 220, align: "left" },
				{ header: "발생Module",  name: "prod_sub", width: 60, align: "center" },
				{ header: "고장분석 No.",  name: "rqst_no", width: 80, align: "center" },
				{ header: "진행상태",  name: "tar_pstat", width: 80, align: "center" },
				{ header: "담당부서",  name: "dept_nm", width: 80, align: "center" },
				{ header: "담당자",  name: "user_nm", width: 80, align: "center" },
				{ header: "Warranty",  name: "wrnt_io", width: 60, align: "center" },
				{ header: "A/S상태",  name: "istat", width: 60, align: "center" },
				{ header: "ECR No.",  name: "ecr_no", width: 80, align: "center" },
				{ header: "ECR 진행상태",  name: "ecr_stat", width: 80, align: "center" },
				{ header: "NCR(시정조치)",  name: "ncr_no", width: 80, align: "center" },
				{ header: "시정조치 상태",  name: "ncr_stat", width: 80, align: "center" },
				{ header: "발생현상",  name: "rmk", width: 300, align: "left" },
				{ header: "등록자",  name: "ins_usr", width: 70, align: "center" },
				{ header: "등록일시",  name: "ins_dt", width: 160, align: "center" },
				{ header: "수정자",  name: "upd_usr", width: 70, align: "center" },
				{ header: "수정일시",  name: "upd_dt", width: 160, align: "center" },
				{ name: "prod_key", hidden: true }, { name: "dept_nm", hidden: true }
				, { name: "pstat", hidden: true }, { name: "rqst_no", hidden: true }
			]
        };
        gw_com_module.gridCreate(args);

        //==== Main Form : A/S 발생 정보
        var args = { targetid: "frmData_Top", query: "EHM_2311_M_2", type: "TABLE", title: "A/S 발생 정보",
            caption: true, show: true, selectable: true,
            content: { width: { label: 94, field: 180 }, height: 25,
                row: [
                    { element: [
                        { header: true, value: "참조문서", format: { type: "label"} },
                        { name: "issue_no" },
                        { header: true, value: "발행일자", format: { type: "label"} },
                        { name: "issue_dt", mask: "date-ymd" },
                        { header: true, value: "등록자", format: { type: "label"} },
                        { name: "ins_usr" },
                        { header: true, value: "Down Time", format: { type: "label"} },
                        { name: "down_time" }
	                    ]
                    },
                    { element: [
                        { header: true, value: "고객사", format: { type: "label"} },
                        { name: "cust_nm" },
                        { header: true, value: "라인", format: { type: "label"} },
                        { name: "cust_dept" },
                        { header: true, value: "Process", format: { type: "label"} },
                        { name: "cust_proc" },
                        { header: true, value: "설비사용기간", format: { type: "label"} },
                        { name: "prod_use_month" }
	                    ]
                    },
                    { element: [
                        { header: true, value: "제품군", format: { type: "label"} },
                        { name: "prod_group" },
                        { header: true, value: "제품유형", format: { type: "label"} },
                        { name: "prod_type" },
                        { header: true, value: "설비명", format: { type: "label"} },
                        { name: "cust_prod_nm" },
                        { header: true, value: "모듈", format: { type: "label"} },
                        { name: "prod_sub" }
	                    ]

                    },
                    { element: [
                        { header: true, value: "발생내용", format: { type: "label"} },
                        { name: "rmk_text", style: { colspan: 7 }, format: { type: "textarea", rows: 7, width: 1022 } }
	                    ]

                    }
                ]
            }
        };
        gw_com_module.formCreate(args);

        //==== Main Form : 고분보
        var args = { targetid: "frmData_Main", query: "EHM_2312_M_1", type: "TABLE", title: "고분보",
            caption: true, show: true, selectable: true,
            //editable: { bind: "select", focus: "rqst_tp", validate: true },
            content: { width: { label: 94, field: 180 }, height: 25,
                row: [
                    { element: [
                        { header: true, value: "관리번호", format: { type: "label"} },
                        { name: "rqst_no" , format: { type: "text"} },
                        { header: true, value: "발생구분", format: { type: "label"} },
                        { name: "rqst_tp" , format: { type: "select", data: { memory: "발생구분" } } },
                        { header: true, value: "작성자", format: { type: "label"} },
                        { name: "rqst_user_nm", format: { type: "text"} },
                        { header: true, value: "작성일자", format: { type: "label"} },
                        { name: "rqst_dt", mask: "date-ymd" , format: { type: "text"} },
						{ name: "rqst_user", hidden: true }
	                    ]
                    },
                    { element: [
                        { header: true, value: "제목", format: { type: "label" } },
                        { name: "rqst_title", format: { type: "text", width: 500 }, style: { colspan: 7 } }
                        ]
                    },
                    { element: [
                        { header: true, value: "부위구분", format: { type: "label"} },
                        { name: "part_tp1"
							, format: { type: "select", data: { memory: "부위구분" } } },
                        { header: true, value: "PM상세구분", format: { type: "label"} },
                        { name: "part_tp2"
							, format: { type: "select", data: { memory: "PM상세구분" } } },
                        { header: true, value: "초발/재발", format: { type: "label"} },
                        { name: "issue_cnt", format: { type: "text"} },
                        { header: true, value: "진행상태", format: { type: "label"} },
                        { name: "pstat"
							, format: { type: "select", data: { memory: "진행상태" } } }
	                    ]
                    },
                    { element: [
                        { header: true, value: "현장조치결과", format: { type: "label"} },
                        { name: "result_tp"
							, format: { type: "select", data: { memory: "현장조치결과" } } },
                        { header: true, value: "Item구분", format: { type: "label"} },
                        { name: "item_tp"
							, format: { type: "select", data: { memory: "Item구분" } } },
                        { header: true, value: "인원", format: { type: "label"} },
                        { name: "man_cnt", format: { type: "text"} },
                        { header: true, value: "Warranty", format: { type: "label"} },
                        { name: "wrnt_dt", mask: "date-ymd" }
	                    ]

                    },
                    { element: [
                        { header: true, value: "표준유무", format: { type: "label"} },
                        { name: "standard_yn"
							, format: { type: "select", data: { memory: "유무" } } },
                        { header: true, value: "이행유무", format: { type: "label"} },
                        { name: "actual_yn"
							, format: { type: "select", data: { memory: "이행유무" } } },
                        { header: true, value: "Tatal공수Time", format: { type: "label"} },
                        { name: "total_time", format: { type: "text"} },
                        { header: true, value: "설비사용기간", format: { type: "label"} },
                        { name: "prod_use_month", format: { type: "text"}  }
	                    ]
                    },
                    { element: [
                        { header: true, value: "원인추정", format: { type: "label"} },
                        { name: "reason_tp"
							, format: { type: "select", data: { memory: "원인추정" } } },
                        { header: true, value: "교육체계", format: { type: "label"} },
                        { name: "edu_yn"
							, format: { type: "select", data: { memory: "유무" } } },
                        { header: true, value: "준수여부", format: { type: "label"} },
                        { name: "rule_tp"
							, format: { type: "select", data: { memory: "준수여부" } } },
                        { header: true, value: "파트사용기간", format: { type: "label"} },
                        { name: "part_use_month", format: { type: "text"}  }
                        ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);

        //==== Main Grid : 고분보
        var args = {
            targetid: "grdData_Main", query: "EHM_2312_M_1", title: "고분보",
            caption: false, height: "100%", pager: false, show: true, selectable: true,
            //editable: { master: true, multi: true, bind: "select", focus: "issue_status_grp", validate: true },
            element: [
				{
				    header: "발생현상(대)", name: "issue_status_grp", width: 80, align: "center",
				    format: { type: "select", data: { memory: "발생현상(대)" } },
				    editable: {
				        type: "select", validate: { rule: "required" },
				        data: { memory: "발생현상(대)", unshift: [{ title: "-", value: "" }] },
				        change: [{
				            name: "issue_status_tp1", memory: "현상분류", unshift: [{ title: "-", value: "" }],
				            by: [{ source: { id: "frmData_Top", row: 1, key: "prod_type" } }, { key: "issue_status_grp" }]
				        }]
				    }
				},
				{
				    header: "발생현상(중)", name: "issue_status_tp1", width: 130, align: "center",
				    format: { type: "select", data: { memory: "현상분류" } },
				    editable: {
				        type: "select", validate: { rule: "required" },
				        data: {
				            memory: "현상분류", unshift: [{ title: "-", value: "" }],
				            by: [{ source: { id: "frmData_Top", row: 1, key: "prod_type" } }, { key: "issue_status_grp" }]
				        },
				        change: [{
				            name: "issue_status_tp2", memory: "현상구분", unshift: [{ title: "-", value: "" }],
				            by: [{ source: { id: "frmData_Top", row: 1, key: "prod_type" } }, { key: "issue_status_tp1" }]
				        }]
				    }
				},
				{
				    header: "발생현상(소)", name: "issue_status_tp2", width: 130, align: "center",
				    format: { type: "select", data: { memory: "현상구분" } },
				    editable: {
				        type: "select", validate: { rule: "required" },
				        data: {
				            memory: "현상구분", unshift: [{ title: "-", value: "" }],
				            by: [{ source: { id: "frmData_Top", row: 1, key: "prod_type" } }, { key: "issue_status_tp1" }]
				        }
				    }
				},
				{
				    header: "원인부위분류", name: "issue_part_tp1", width: 90, align: "center",
				    format: { type: "select", data: { memory: "원인부위분류" } },
				    editable: {
				        type: "select",
				        data: {
				            memory: "원인부위분류", unshift: [{ title: "-", value: "" }],
				            by: [{ source: { id: "frmData_Top", row: 1, key: "prod_type" } }]
				        },
				        change: [{
				            name: "issue_part_tp2", memory: "원인부위구분", unshift: [{ title: "-", value: "" }],
				            by: [{ source: { id: "frmData_Top", row: 1, key: "prod_type" } }, { key: "issue_part_tp1" }]
				        }]
				    }
				},
				{
				    header: "원인부위구분", name: "issue_part_tp2", width: 130, align: "center",
				    format: { type: "select", data: { memory: "원인부위구분" } },
				    editable: {
				        type: "select",
				        data: {
				            memory: "원인부위구분", unshift: [{ title: "-", value: "" }],
				            by: [{ source: { id: "frmData_Top", row: 1, key: "prod_type" } }, { key: "issue_part_tp1" }]
				        }
				    }
				},
				{
				    header: "원인분류", name: "issue_reason_tp1", width: 90, align: "center",
				    format: { type: "select", data: { memory: "원인분류" } },
				    editable: {
				        type: "select", validate: { rule: "required" },
				        data: {
				            memory: "원인분류", unshift: [{ title: "-", value: "" }],
				            by: [{ source: { id: "frmData_Top", row: 1, key: "prod_type" } }]
				        },
				        change: [{
				            name: "issue_reason_tp2", memory: "원인구분", unshift: [{ title: "-", value: "" }],
				            by: [{ source: { id: "frmData_Top", row: 1, key: "prod_type" } }, { key: "issue_reason_tp1" }]
				        }]
				    }
				},
				{
				    header: "원인구분", name: "issue_reason_tp2", width: 130, align: "center",
				    format: { type: "select", data: { memory: "원인구분" } },
				    editable: {
				        type: "select", validate: { rule: "required" },
				        data: {
				            memory: "원인구분", unshift: [{ title: "-", value: "" }],
				            by: [{ source: { id: "frmData_Top", row: 1, key: "prod_type" } }, { key: "issue_reason_tp1" }]
				        }
				    }
				},
				{
				    header: "귀책분류", name: "issue_duty_tp1", width: 90, align: "center",
				    format: { type: "select", data: { memory: "귀책분류" } },
				    editable: {
				        type: "select",
				        data: {
				            memory: "귀책분류", unshift: [{ title: "-", value: "" }],
				            by: [{ source: { id: "frmData_Top", row: 1, key: "prod_type" } }]
				        },
				        change: [{
				            name: "issue_duty_tp2", memory: "귀책구분", unshift: [{ title: "-", value: "" }],
				            by: [{ source: { id: "frmData_Top", row: 1, key: "prod_type" } }, { key: "issue_duty_tp1" }]
				        }]
				    }
				},
				{
				    header: "귀책구분", name: "issue_duty_tp2", width: 130, align: "center",
				    format: { type: "select", data: { memory: "귀책구분" } },
				    editable: {
				        type: "select",
				        data: {
				            memory: "귀책구분", unshift: [{ title: "-", value: "" }],
				            by: [{ source: { id: "frmData_Top", row: 1, key: "prod_type" } }, { key: "issue_duty_tp1" }]
				        }
				    }
				}
            ]
        };
        //----------
        gw_com_module.gridCreate(args);

        //==== Sub Form : 고분보 담당 부서
        var args = { targetid: "grdData_Sub", query: "EHM_2312_S_1", title: "담당 부서",
            caption: true, height: "100%", pager: false, show: true, selectable: true, number: true,
            //editable: { multi: true, bind: "open", focus: "dept_nm", validate: true },
            element: [
				{ header: "담당부서", name: "dept_nm", width: 120, align: "left" },
				{ header: "담당자", name: "user_nm", width: 60, align: "left" },
				{ header: "재발방지", name: "act_tp1", width: 120, align: "left"
				    , format: { type: "select", data: { memory: "재발방지" } } },
				{ header: "대책구분", name: "act_tp2", width: 120, align: "left"
				    , format: { type: "select", data: { memory: "대책구분", key: ["act_tp1"] } } },
                { header: "실시항목", name: "act_item", width: 80, align: "center", editable: { type: "text" } },
                { header: "납기일자", name: "plan_dt", width: 70, align: "center", mask: "date-ymd" },
                { header: "처리상태", name: "pstat", width: 70, align: "center" },
                { header: "처리자", name: "rslt_user_nm", width: 60, align: "center" },
                { header: "처리일자", name: "rslt_dt", width: 70, align: "center", mask: "date-ymd" },
                { name: "dept_cd", hidden: true },
                { name: "user_id", hidden: true },
				{ name: "rqst_no", hidden: true },
				{ name: "act_seq", hidden: true }
			]
        };
        gw_com_module.gridCreate(args);

        //==== Detail1 Form : 고분보 담당 부서 처리결과
        var args = { targetid: "frmData_D1", query: "EHM_2322_S_1", type: "TABLE", title: "처리계획 및 결과",
            caption: true, show: true, selectable: true,
            //editable: { bind: "select", focus: "pstat", validate: true },
            content: { width: { label: 94, field: 180 }, height: 25,
                row: [
                    { element: [
                        { header: true, value: "담당부서", format: { type: "label"} },
                        { name: "dept_nm" },
                        { header: true, value: "담당자", format: { type: "label"} },
                        { name: "user_nm" },
                        { header: true, value: "납기일자", format: { type: "label"} },
                        { name: "plan_dt", mask: "date-ymd" },
                        { header: true, value: "재발방지", format: { type: "label"} },
                        { name: "act_tp1", format: { type: "select", data: { memory: "재발방지" } } }
	                    ]
                    },
                    { element: [
                        { header: true, value: "처리결과", format: { type: "label"} },
                        { name: "rslt_cd", format: { type: "select", data: { memory: "처리결과" } } },
                        { header: true, value: "처리자", format: { type: "label"} },
                        { name: "rslt_user_nm", format: { type: "text"} },
                        { header: true, value: "처리일자", format: { type: "label"} },
                        { name: "rslt_dt", mask: "date-ymd", editable: { type: "text" } },
                        { header: true, value: "대책구분", format: { type: "label"} },
                        { name: "act_tp2"
                        	, format: { type: "select", data: { memory: "대책구분" } } }
	                    ]
                    },
                    { element: [
                        { header: true, value: "원인분석 및 대책", format: { type: "label"} },
                        { name: "plan_rmk", style: { colspan: 5 },
                            format: { type: "textarea", rows: 8, width: 800 }
                        },
                        { header: true, value: "실시항목", format: { type: "label"} },
                        { name: "act_item", editable: { type: "hidden"} }
                        ]
                    },
                    { element: [
                        { header: true, value: "처리 내역", format: { type: "label"} },
                        { name: "rslt_rmk", style: { colspan: 5 },
                            format: { type: "textarea", rows: 8, width: 800 }
                        },
                        { header: true, value: "처리상태", format: { type: "label"} },
                        { name: "pstat" },
		                { name: "user_id", hidden: true, editable: { type: "hidden"} },
		                { name: "dept_nm", hidden: true, editable: { type: "hidden"} },
                        { name: "file_cnt", hidden: true, editable: { type: "hidden"} },
                        { name: "rslt_user", hidden: true, editable: { type: "hidden"} }
                        ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);

        //==== Attach File Grid : 첨부 파일
        var args = { targetid: "grdData_File1", query: "DLG_FILE_ZFILE_V", title: "첨부 문서",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            editable: { multi: true, bind: "select", focus: "file_desc", validate: true },
            element: [
				{ header: "파일명", name: "file_nm", width: 250, align: "left" },
				{ header: "등록부서", name: "upd_dept", width: 100, align: "center" },
				{ header: "등록자", name: "upd_usr", width: 60, align: "center" },
				{ header: "사업부", name: "file_group1", width: 80, align: "center", hidden: true },
				{ header: "업무구분", name: "file_group2", width: 80, align: "center" },
				{ header: "문서분류", name: "file_group3", width: 80, align: "center" },
				{ header: "고객사", name: "file_group4", width: 80, align: "center", hidden: true },
				{ header: "Category", name: "file_group5", width: 80, align: "center", hidden: true },
				{ header: "다운로드", name: "download", width: 60, align: "center",
				    format: { type: "link", value: "다운로드" }
				},
				{ header: "파일설명", name: "file_desc", width: 380, align: "left",
				    editable: { type: "text" }
				},
                { name: "file_ext", hidden: true },
                { name: "file_path", hidden: true },
                { name: "network_cd", hidden: true },
                { name: "data_tp", hidden: true },
                { name: "data_key", hidden: true },
                { name: "data_seq", hidden: true },
                { name: "file_id", hidden: true, editable: { type: "hidden"} }
			]
        };
        gw_com_module.gridCreate(args);

        //==== File Download Layer
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);

        //==== Resize Objects
        var args = { target: [
				{ type: "GRID", id: "grdData_List", offset: 8 },
				{ type: "FORM", id: "frmData_Top", offset: 8 },
				{ type: "FORM", id: "frmData_Main", offset: 8 },
                { type: "GRID", id: "grdData_Main", offset: 8 },
                { type: "GRID", id: "grdData_Sub", offset: 8 },
                { type: "FORM", id: "frmData_D1", offset: 8 },
				{ type: "GRID", id: "grdData_File1", offset: 8 }
			]
        };
        gw_com_module.objResize(args);
        gw_com_module.informSize();
    },

    //==== manage process. (program section)
    procedure: function () {

        //==== Button Click : Main (상세, 저장, 통보, 삭제, 닫기) ====
        //----------
        var args = { targetid: "lyrMenu_Main", element: "조회", event: "click", handler: viewOption };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_Main", element: "상세", event: "click", handler: popupDetail };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_Main", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);

        //==== Button Click : Search Option ====
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: closeOption };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------

        //==== 첨부파일 : 추가/삭제/Down ====
        var args = { targetid: "lyrMenu_File1", element: "추가", event: "click", handler: click_lyrMenu_File1_추가 };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_File1", element: "삭제", event: "click", handler: click_lyrMenu_File1_삭제 };
        gw_com_module.eventBind(args);
        var args = { targetid: "grdData_File1", grid: true, element: "download", event: "click", handler: click_File_DownLoad };
        gw_com_module.eventBind(args);
        //----------
        function click_lyrMenu_File1_추가(ui) { processUpload(ui); }
        function click_lyrMenu_File1_삭제(ui) { processDelete(ui); }
        function click_File_DownLoad(ui) { 
        	gw_com_module.downloadFile({ source: { id: ui.object, row: ui.row }, targetid: "lyrDown" });
        }

        //==== Grid Events : Main
        //----------
        var args = { targetid: "frmData_D1", grid: false, event: "itemdblclick", handler: itemdblclick_frmData_Main };
        gw_com_module.eventBind(args);
        var args = { targetid: "frmData_D1", grid: false, event: "itemkeyenter", handler: itemdblclick_frmData_Main };
        gw_com_module.eventBind(args);
        function itemdblclick_frmData_Main(ui) { popupFindItem(ui); }
        //----------
        var args = { targetid: "grdData_List", grid: true, event: "rowselected", handler: processLink };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_Sub", grid: true, event: "rowselected", handler: processLink };
        gw_com_module.eventBind(args);

        // startup process.
        gw_com_module.startPage();

    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function viewOption() {
    var args = { target: [ { id: "frmOption", focus: true } ] };
    gw_com_module.objToggle(args);
}
//---------- Popup Detail Windows
function popupDetail(ui) {
    v_global.event.object = "grdData_List";
    v_global.event.row = "selected";

	var LinkPage = "";
	var LinkID = gw_com_api.v_Stream.msg_infoECR;

	var IssueNo = gw_com_api.getValue(v_global.event.object, v_global.event.row, "issue_no", true);
	if (IssueNo == "" || IssueNo == undefined) return;

	var LinkType = gw_com_api.getValue(v_global.event.object, v_global.event.row, "issue_tp", true);
	if ( LinkType == "VOC"){
		LinkPage = "INFO_VOC";
		LinkID = gw_com_api.v_Stream.msg_infoECR;
	}
	else if ( LinkType == "SPC"){
		LinkPage = "INFO_SPC";
		LinkID = gw_com_api.v_Stream.msg_infoECR;
	}
	else {
		LinkPage = "DLG_ISSUE";
		LinkID = gw_com_api.v_Stream.msg_infoAS;
	}

    var args = {
        type: "PAGE", page: LinkPage, title: "문제발생 상세 정보",
        width: 1100, height: 600, scroll: true, open: true, control: true, locate: ["center", "top"]
    };
    
    if (gw_com_module.dialoguePrepare(args) == false) {
        var args = { page: LinkPage,
            param: { ID: LinkID, data: { issue_no: IssueNo, voc_no: IssueNo } }
        }
        gw_com_module.dialogueOpen(args);
    }
}
//---------- Popup Find Window for select items
function popupFindItem(ui){
	
    v_global.event.type = ui.type;
    v_global.event.object = ui.object;
    v_global.event.row = ui.row;
    v_global.event.element = ui.element;
    
    switch (ui.element) { 
        case "dept_nm": {
                var args = { type: "PAGE", page: "DLG_TEAM", title: "부서 선택", width: 500, height: 450, open: true };
                if (gw_com_module.dialoguePrepare(args) == false) {
                    var args = { page: "DLG_TEAM",
                        param: { ID: gw_com_api.v_Stream.msg_selectTeam }
                    };
                    gw_com_module.dialogueOpen(args);
                }
            } break;
        case "user_nm": 
        case "rslt_user_nm": {
                var args = { type: "PAGE", page: "DLG_EMPLOYEE", title: "사원 선택"
                	, width: 700, height: 450, locate: ["center", "top"], open: true 
            	};
                if (gw_com_module.dialoguePrepare(args) == false) {
                    var args = { page: "DLG_EMPLOYEE",
                        param: { ID: gw_com_api.v_Stream.msg_selectEmployee }
                    };
                    gw_com_module.dialogueOpen(args);
                }
            } break;
        case "supp_nm": {
                var args = { type: "PAGE", page: "w_find_supplier", title: "협력사 선택", width: 500, height: 450, open: true };
                if (gw_com_module.dialoguePrepare(args) == false) {
                    var args = { page: "w_find_supplier",
                        param: { ID: gw_com_api.v_Stream.msg_selectedSupplier }
                    };
                    gw_com_module.dialogueOpen(args);
                }
            } break;
        default: return;
    }
}
//----------
function checkCRUD(param) {

    if (param.sub) {
        var obj = "grdData_Sub";
        if (checkEditable({}))
            return gw_com_api.getCRUD(obj, "selected", true);
        else
            return ((gw_com_api.getSelectedRow(obj) == null) ? false : true);
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
			{ type: "GRID", id: "grdData_File1" }
		],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function processRetrieve(param) {

	// Validate Inupt Options
    var args = { target: [ { type: "FORM", id: "frmOption" } ] };
    if (gw_com_module.objValidate(args) == false) return false;
	
	// Retrieve 
    var args = { key: param.key,
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
				{ name: "ymd_fr", argument: "arg_ymd_fr" },
				{ name: "ymd_to", argument: "arg_ymd_to" },
                { name: "dept_area", argument: "arg_dept_area" },
                { name: "issue_tp", argument: "arg_issue_tp" },
                { name: "wrnt_io", argument: "arg_wrnt_io" },
                { name: "pstat", argument: "arg_pstat" },
				{ name: "prod_group", argument: "arg_prod_group" },
				{ name: "prod_type1", argument: "arg_prod_type1" },
				{ name: "prod_type2", argument: "arg_prod_type2" },
				{ name: "prod_type3", argument: "arg_prod_type3" },
				{ name: "cust_cd", argument: "arg_cust_cd" },
				{ name: "cust_dept", argument: "arg_cust_dept" },
				{ name: "cust_proc", argument: "arg_cust_proc" },
				{ name: "prod_nm", argument: "arg_prod_nm" },
                { name: "part_tp1", argument: "arg_part_tp1" },
                { name: "part_tp2", argument: "arg_part_tp2" },
                { name: "issue_no", argument: "arg_issue_no" },
                { name: "rqst_no", argument: "arg_rqst_no" },
                { name: "search", argument: "arg_search" },
                { name: "date_tp", argument: "arg_date_tp" }
			],
            remark: [
	            { infix: "~",  element: [ { name: "ymd_fr" }, { name: "ymd_to" } ] },
		        { element: [{ name: "dept_area" }] },
		        { element: [{ name: "issue_tp" }] },
		        { element: [{ name: "wrnt_io"}] },
		        { element: [{ name: "cust_cd"}] },
		        { element: [{ name: "cust_dept"}] },
                { element: [{ name: "pstat"}] }
		    ]
        },
        target: [
            { type: "GRID", id: "grdData_List", focus: true, select: true }
	    ],
        clear: [
			{ type: "FORM", id: "frmData_Top" }, { type: "FORM", id: "frmData_Main" }
        ]
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {
	if ( param.status != true ) return;

	var args = {};

	if (param.object == "grdData_List") {
	    args = {
	        source: { type: "GRID", id: "grdData_List", row: "selected", block: true,
	            element: [ 
					{ name: "issue_no", argument: "arg_issue_no" }, 
					{ name: "rqst_no", argument: "arg_rqst_no" } ,
					{ name: "rqst_no", argument: "arg_data_key" } 	// 첨부파일용
	            ]
				, argument: [ { name: "arg_data_seq", value: -1 } ]
	        },
	        target: [
				{ type: "FORM", id: "frmData_Top" },
				{ type: "FORM", id: "frmData_Main" },
				{ type: "GRID", id: "grdData_Main", select: true },
	            { type: "GRID", id: "grdData_Sub", select: true },	//checkEditable({}) ? false : 
				{ type: "GRID", id: "grdData_File1" }
			],
			key: v_global.logic.key
		};
    }
    else if (param.object == "grdData_Sub") {
		args = {
			source: { type: "GRID", id: "grdData_Sub", row: "selected", block: true,
				element: [ 
					{ name: "rqst_no", argument: "arg_rqst_no" } ,
					{ name: "act_seq", argument: "arg_act_seq" } 	// 첨부파일용
				]
				, argument: [ { name: "arg_data_seq", value: -1 } ]
			},
			target: [
				{ type: "FORM", id: "frmData_D1" }
			],
			key: v_global.logic.key
		};
    }
    else if (param.object == "grdData_File1") {
        args = { 
            key: param.key,
            source: { type: "FORM", id: "frmData_Main",
                element: [ { name: "rqst_no", argument: "arg_data_key" } ],
	            argument: [ { name: "arg_data_seq", value: -1 } ]
            },
            target: [ { type: "GRID", id: "grdData_File1", select: true } ]
        };
    }
    else return;

    gw_com_module.objRetrieve(args);

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_Main" },
            { type: "GRID", id: "grdData_Sub" },
            { type: "FORM", id: "frmData_D1" },
            { type: "FORM", id: "frmData_D2" },
            { type: "GRID", id: "grdData_File1" }
        ]
    };
    gw_com_module.objClear(args);

}
//----------
function processClose(param) {

    v_global.process.handler = processClose;
    if (!checkUpdatable({})) return;
    var args = { ID: gw_com_api.v_Stream.msg_closePage };
    gw_com_module.streamInterface(args);

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

}
//----------
function closeDialogue(param) {

    var args = { page: param.page };
    gw_com_module.dialogueClose(args);
    if (param.focus) {
        gw_com_api.setFocus(v_global.event.object, v_global.event.row, v_global.event.element,
	                        (v_global.event.type == "GRID") ? true : false);
    }

}
//---------- 파일 추가/수정/Rev
function processUpload(param) {

    // Check
    if (!checkManipulate({})) return;
    if (!checkUpdatable({ check: true })) return false;

    // Parameter 설정
    v_global.logic.FileUp = {
    	type: "고분보-RQST",
        key: gw_com_api.getValue("frmData_Main", 1, "rqst_no"),
        seq: 0,
        user: gw_com_module.v_Session.USR_ID,
        crud: "C",  rev: 0, revise: false
    };

    // Prepare File Upload Window
    var args = { type: "PAGE", page: "DLG_FileUpload", title: "파일 업로드", datatype: "고분보-RQST", 
    	width: 650, height: 260, open: true, locate: ["center", "top"] }; //

    if (gw_com_module.dialoguePrepare(args) == false) {
    	// 아래 로직은 두 번째 Open 부터 작동함. 첫 번째는 streamProcess 에 의함
        var args = { page: "DLG_FileUpload",
            param: { ID: gw_com_api.v_Stream.msg_upload_ASFOLDER, data: v_global.logic.FileUp }
        };
        gw_com_module.dialogueOpen(args);
    }
    
}
//----------
function processItemchanged(param) {
    if (param.object == "frmOption") {
        switch (param.element) {
            case "date_tp":
                gw_com_api.setAttribute(param.object, 1, "ymd_fr", "label", param.value.current + " :");
                var obj = document.getElementsByTagName("label");
                for (var i = 0; i < obj.length; i++) {
                    var label = obj[i];
                    if (label.innerHTML == "발생일자 :" || label.innerHTML == "작성일자 :") {
                        label.innerHTML = param.value.current + " :"
                    }
                }
                break;
        }
    }
}
//----------

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_showMessage: { 
            gw_com_module.streamInterface(param); 
        } break;
        case gw_com_api.v_Stream.msg_resultMessage: {
        	// PageId가 다를 때 Skip 
        	if (param.data.page != gw_com_api.getPageID()) { 
        		param.to = { type: "POPUP", page: param.data.page };
                gw_com_module.streamInterface(param);
                break;
            }
            // 확인 메시지별 처리    
            switch (param.data.ID) { 
            	case gw_com_api.v_Message.msg_confirmSave: { 
                	if (param.data.result == "YES") processSave(param.data.arg);
                    else { 
                    	processClear({});
                        if (v_global.process.handler != null) v_global.process.handler(param.data.arg);
                    }
                } break;
                case gw_com_api.v_Message.msg_confirmRemove: { 
                    if (param.data.result == "YES") processRemove(param.data.arg);
                } break;
                case gw_com_api.v_Message.msg_confirmBatch: { 
                    if (param.data.result == "YES") processBatch(param.data.arg);
                } break;
                case gw_com_api.v_Message.msg_informSaved: { 
                    param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                } break;
                case gw_com_api.v_Message.msg_informRemoved: { 
                    param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                } break;
                case gw_com_api.v_Message.msg_informBatched: { 
                    param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                } break;
            }
        } break;
        case gw_com_api.v_Stream.msg_selectedSupplier: {
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "supp_cd", param.data.supp_cd,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "supp_nm", param.data.supp_nm,
			                        (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
        } break;
        case gw_com_api.v_Stream.msg_selectedTeam: {
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "dept_cd", param.data.dept_cd,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "dept_nm", param.data.dept_nm,
			                        (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
        } break;
        case gw_com_api.v_Stream.msg_selectedEmployee: {
        	if ( v_global.event.element == "rslt_user_nm" ) {
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "rslt_user", param.data.user_id,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "rslt_user_nm", param.data.user_nm,
			                        (v_global.event.type == "GRID") ? true : false);
        	}
        	else if ( v_global.event.element == "rqst_user_nm" ) {
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "rqst_user", param.data.user_id,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "rqst_user_nm", param.data.user_nm,
			                        (v_global.event.type == "GRID") ? true : false);
        	}
        	else if ( v_global.event.element == "user_nm" ) {
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "user_id", param.data.user_id,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "user_nm", param.data.user_nm,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "dept_cd", param.data.dept_cd,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "dept_nm", param.data.dept_nm,
			                        (v_global.event.type == "GRID") ? true : false);
        	}
            closeDialogue({ page: param.from.page, focus: true });
        } break;
        case gw_com_api.v_Stream.msg_uploaded_ASFOLDER: {
            closeDialogue({ page: param.from.page });
        	processLink( { object: "grdData_File1" } ) ;
        } break;
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
                gw_com_module.callProcedure(args); 
                }
            break;
           
        // When Opened Dialogue Winddows
        case gw_com_api.v_Stream.msg_openedDialogue: { 
        	var args = { to: { type: "POPUP", page: param.from.page } };

            switch (param.from.page) { 
                case "w_find_supplier": { 
                    args.ID = gw_com_api.v_Stream.msg_selectSupplier; 
                } break;
                case "DLG_TEAM": { 
                    args.ID = gw_com_api.v_Stream.msg_selectTeam; 
                } break;
                case "DLG_EMPLOYEE": { 
                    args.ID = gw_com_api.v_Stream.msg_selectEmployee; 
                } break;
                case "DLG_FileUpload": { 
                	args.ID = gw_com_api.v_Stream.msg_upload_ASFOLDER;
                	args.data = v_global.logic.FileUp;
             	} break;
                case "INFO_VOC": {
                    args.ID = gw_com_api.v_Stream.msg_infoECR;
                    args.data = { 
                    	voc_no: gw_com_api.getValue(v_global.event.object, v_global.event.row, "issue_no", true)
                    };
                } break;
                case "INFO_SPC": {
                    args.ID = gw_com_api.v_Stream.msg_infoECR;
                    args.data = { 
                    	issue_no: gw_com_api.getValue(v_global.event.object, v_global.event.row, "issue_no", true)
                    };
                } break;
                case "DLG_ISSUE": {
                    args.ID = gw_com_api.v_Stream.msg_infoAS;
                    args.data = { 
                    	issue_no: gw_com_api.getValue(v_global.event.object, v_global.event.row, "issue_no", true)
                    };
                } break;
            }
            gw_com_module.streamInterface(args); 
        } break;
        case gw_com_api.v_Stream.msg_closeDialogue: {
        	closeDialogue({ page: param.from.page }); 
        } break;
    }

}