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
                { type: "PAGE", name: "부위구분", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "IEHM60"}]
                },
                { type: "PAGE", name: "PM상세구분", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "IEHM61"}]
                },
                { type: "PAGE", name: "현장조치결과", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "IEHM62"}]
                },
                { type: "PAGE", name: "발생구분", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "IEHM63"}]
                },
                { type: "PAGE", name: "원인추정", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "IEHM64"}]
                },
                { type: "PAGE", name: "이행유무", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "IEHM65"}]
                },
                { type: "PAGE", name: "준수여부", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "IEHM66"}]
                },
                { type: "PAGE", name: "대책구분", query: "dddw_zcoded",
                    param: [{ argument: "arg_hcode", value: "IEHM67"}]
                },
                { type: "PAGE", name: "Item구분", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "IEHM69"}]
                },
                { type: "PAGE", name: "처리결과", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "QDM022"}]
                },
                { type: "INLINE", name: "유무",
                    data: [{ title: "있음", value: "1" }, { title: "없음", value: "0"}]
                },
                { type: "INLINE", name: "진행상태",
                    data: [{ title: "검토", value: "검토" }, { title: "처리", value: "처리"}]
                },
                { type: "INLINE", name: "재발방지",
                    data: [{ title: "관리적대책", value: "관리적대책" }, { title: "기술적대책", value: "기술적대책"}]
                },
                { type: "PAGE", name: "발생현상(대)", query: "DDDW_CM_FCODE1",
                    param: [{ argument: "arg_hcode", value: "IEHM21" }]
                },
                { type: "PAGE", name: "현상분류", query: "DDDW_CM_CODEF1",
                    param: [{ argument: "arg_hcode", value: "IEHM21" }]
                },
				{ type: "PAGE", name: "현상구분", query: "DDDW_CM_CODEF",
				    param: [{ argument: "arg_hcode", value: "IEHM31" }]
				},
				{ type: "PAGE", name: "원인부위분류", query: "DDDW_CM_CODEF",
				    param: [{ argument: "arg_hcode", value: "IEHM22" }]
				},
                { type: "PAGE", name: "원인부위구분", query: "DDDW_CM_CODEF",
                    param: [{ argument: "arg_hcode", value: "IEHM32" }]
                },
				{ type: "PAGE", name: "원인분류", query: "DDDW_CM_CODEF",
				    param: [{ argument: "arg_hcode", value: "IEHM23" }]
				},
				{ type: "PAGE", name: "원인구분", query: "DDDW_CM_CODEF",
				    param: [{ argument: "arg_hcode", value: "IEHM33" }]
				},
                { type: "PAGE", name: "귀책분류", query: "DDDW_CM_CODEF",
                    param: [{ argument: "arg_hcode", value: "IEHM25" }]
                },
				{ type: "PAGE", name: "귀책구분", query: "DDDW_CM_CODEF",
				    param: [{ argument: "arg_hcode", value: "IEHM35" }]
				},
                { type: "PAGE", name: "부서", query: "dddw_dept" },
                { type: "PAGE", name: "사원", query: "dddw_emp" }
			],
            starter: start
        };
        gw_com_module.selectSet(args);

        //----------
        function start() {
            gw_job_process.UI();
            gw_job_process.procedure();

			v_global.logic.key = "";
			if (v_global.process.param != "") {	// Page Parameter 변수 저장
				v_global.logic.key = gw_com_api.getPageParameter("rqst_no");
				v_global.logic.issue_no = gw_com_api.getPageParameter("issue_no");
				v_global.logic.status_grp = gw_com_api.getPageParameter("status_grp");
				v_global.logic.status_tp1 = gw_com_api.getPageParameter("status_tp1");
				v_global.logic.status_tp2 = gw_com_api.getPageParameter("status_tp2");
				v_global.logic.part_tp1 = gw_com_api.getPageParameter("part_tp1");
				v_global.logic.part_tp2 = gw_com_api.getPageParameter("part_tp2");
				v_global.logic.reason_tp1 = gw_com_api.getPageParameter("reason_tp1");
				v_global.logic.reason_tp2 = gw_com_api.getPageParameter("reason_tp2");
				v_global.logic.duty_tp1 = gw_com_api.getPageParameter("duty_tp1");
				v_global.logic.duty_tp2 = gw_com_api.getPageParameter("duty_tp2");

				processRetrieveIssue({ key: v_global.logic.issue_no });	// A/S 발생정보
			}
        }
    },

    // manage UI. (design section)
    UI: function () {

        //==== Main Menu : 상세, 저장, 통보, 삭제, 닫기
        var args = { targetid: "lyrMenu_Main", type: "FREE",
            element: [
                { name: "상세", value: "발생정보", icon: "실행" },
				{ name: "저장", value: "저장" },
                { name: "통보", value: "통보", icon: "기타" },
				{ name: "삭제", value: "삭제" },
				{ name: "닫기", value: "닫기" }
			]
        };
        gw_com_module.buttonMenu(args);

        //==== Sub Menu : (대상부서) 추가, 삭제
        var args = { targetid: "lyrMenu_Sub", type: "FREE",
            element: [
				{ name: "추가", value: "추가" },
				{ name: "삭제", value: "삭제" }
			]
        };
        gw_com_module.buttonMenu(args);

        //==== 첨부파일 Menu : 추가, 삭제
        var args = { targetid: "lyrMenu_File1", type: "FREE",
            element: [
				{ name: "추가", value: "추가" },
				{ name: "삭제", value: "삭제" }
			]
        };
        gw_com_module.buttonMenu(args);

        //==== Main Form : 고분보
        var args = {
            targetid: "frmData_Top", query: "EHM_2311_M_2", type: "TABLE", title: "A/S 발생 정보",
            caption: true, show: true, selectable: true,
            editable: { bind: "select", focus: "issue_no", validate: true },
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
                        { name: "prod_type", editable: { type: "hidden" } },
                        { header: true, value: "설비명", format: { type: "label"} },
                        { name: "cust_prod_nm" },
                        { header: true, value: "모듈", format: { type: "label"} },
                        { name: "prod_sub" }
	                    ]

                    }
                ]
            }
        };
        gw_com_module.formCreate(args);

        //==== Main Form : 고분보
        var args = { targetid: "frmData_Main", query: "EHM_2312_M_1", type: "TABLE", title: "고분보",
            caption: true, show: true, selectable: true,
            editable: { bind: "select", focus: "rqst_tp", validate: true },
            content: { width: { label: 94, field: 180 }, height: 25,
                row: [
                    { element: [
                        { header: true, value: "관리번호", format: { type: "label"} },
                        { name: "rqst_no"
							, editable: { type: "hidden"} },
                        { header: true, value: "발생구분", format: { type: "label"} },
                        { name: "rqst_tp"
							, editable: { type: "select", data: { memory: "발생구분" }, validate: { rule: "required"} } },
                        { header: true, value: "작성자", format: { type: "label"} },
                        { name: "rqst_user_nm", mask: "search", display: true
							, editable: { type: "text"} },
                        { header: true, value: "작성일자", format: { type: "label"} },
                        { name: "rqst_dt", mask: "date-ymd"
							, editable: { type: "text", validate: { rule: "required"} } },
						{ name: "issue_no", hidden: true, editable: { type: "hidden" } },
						{ name: "rqst_user", hidden: true, editable: { type: "hidden" } },
                        { name: "issue_status_grp", hidden: true },
                        { name: "issue_status_tp1", hidden: true, editable: { type: "hidden" } },
                        { name: "issue_status_tp2", hidden: true, editable: { type: "hidden" } },
                        { name: "issue_part_tp1", hidden: true, editable: { type: "hidden" } },
                        { name: "issue_part_tp2", hidden: true, editable: { type: "hidden" } },
                        { name: "issue_reason_tp1", hidden: true, editable: { type: "hidden" } },
                        { name: "issue_reason_tp2", hidden: true, editable: { type: "hidden" } },
                        { name: "issue_duty_tp1", hidden: true, editable: { type: "hidden" } },
                        { name: "issue_duty_tp2", hidden: true, editable: { type: "hidden" } }
                    ]
                    },
                    { element: [
                        { header: true, value: "제목", format: { type: "label" } },
                        { name: "rqst_title", editable: { type: "text", width: 1022 }, style: { colspan: 7 } }
                        ]
                    },
                    { element: [
                        { header: true, value: "부위구분", format: { type: "label"} },
                        { name: "part_tp1"
							, editable: { type: "select", data: { memory: "부위구분" }, validate: { rule: "required"} } },
                        { header: true, value: "PM상세구분", format: { type: "label"} },
                        { name: "part_tp2"
							, editable: { type: "select", data: { memory: "PM상세구분" }, validate: { rule: "required"} } },
                        { header: true, value: "초발/재발", format: { type: "label"} },
                        { name: "issue_cnt"
							, editable: { type: "text" } },
                        { header: true, value: "진행상태", format: { type: "label"} },
                        { name: "pstat"
							, editable: { type: "select", data: { memory: "진행상태" }, validate: { rule: "required"} } }
	                    ]
                    },
                    { element: [
                        { header: true, value: "현장조치결과", format: { type: "label"} },
                        { name: "result_tp"
							, editable: { type: "select", data: { memory: "현장조치결과" }, validate: { rule: "required"} } },
                        { header: true, value: "Item구분", format: { type: "label"} },
                        { name: "item_tp"
							, editable: { type: "select", data: { memory: "Item구분" }, validate: { rule: "required"} } },
                        { header: true, value: "인원", format: { type: "label"} },
                        { name: "man_cnt"
							, editable: { type: "text" } },
                        { header: true, value: "Warranty", format: { type: "label"} },
                        { name: "wrnt_dt", mask: "date-ymd" }
	                    ]

                    },
                    { element: [
                        { header: true, value: "표준유무", format: { type: "label"} },
                        { name: "standard_yn"
							, editable: { type: "select", data: { memory: "유무" }, validate: { rule: "required"} } },
                        { header: true, value: "이행유무", format: { type: "label"} },
                        { name: "actual_yn"
							, editable: { type: "select", data: { memory: "이행유무" }, validate: { rule: "required"} } },
                        { header: true, value: "Tatal공수Time", format: { type: "label"} },
                        { name: "total_time", editable: { type: "hidden" } },
                        { header: true, value: "설비사용기간", format: { type: "label"} },
                        { name: "prod_use_month", editable: { type: "hidden" }  }
	                    ]
                    },
                    { element: [
                        { header: true, value: "원인추정", format: { type: "label"} },
                        { name: "reason_tp"
							, editable: { type: "select", data: { memory: "원인추정" }, validate: { rule: "required"} } },
                        { header: true, value: "교육체계", format: { type: "label"} },
                        { name: "edu_yn"
							, editable: { type: "select", data: { memory: "유무" }, validate: { rule: "required"} } },
                        { header: true, value: "준수여부", format: { type: "label"} },
                        { name: "rule_tp"
							, editable: { type: "select", data: { memory: "준수여부" }, validate: { rule: "required"} } },
                        { header: true, value: "파트사용기간", format: { type: "label"} },
                        { name: "part_use_month", editable: { type: "text" }  }
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
            editable: { master: true, multi: true, bind: "select", focus: "issue_status_grp", validate: true },
            element: [
				{
				    header: "발생현상(대)", name: "issue_status_grp", width: 80, align: "center",
				    format: { type: "select", data: { memory: "발생현상(대)" } },
				    editable: { type: "select", validate: { rule: "required" },
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
				    editable: { type: "select", validate: { rule: "required" },
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
				    editable: { type: "select", validate: { rule: "required" },
				        data: {
				            memory: "현상구분", unshift: [{ title: "-", value: "" }],
				            by: [{ source: { id: "frmData_Top", row: 1, key: "prod_type" } }, { key: "issue_status_tp1" }]
				        }
				    }
				},
				{
				    header: "원인부위분류", name: "issue_part_tp1", width: 90, align: "center",
				    format: { type: "select", data: { memory: "원인부위분류" } },
				    editable: { type: "select",
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
				    editable: { type: "select",
				        data: { memory: "원인부위구분", unshift: [{ title: "-", value: "" }],
				            by: [{ source: { id: "frmData_Top", row: 1, key: "prod_type" } }, { key: "issue_part_tp1" }]
				        }
				    }
				},
				{
				    header: "원인분류", name: "issue_reason_tp1", width: 90, align: "center",
				    format: { type: "select", data: { memory: "원인분류" } },
				    editable: { type: "select", validate: { rule: "required" },
				        data: { memory: "원인분류", unshift: [{ title: "-", value: "" }],
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
				    editable: { type: "select", validate: { rule: "required" },
				        data: { memory: "원인구분", unshift: [{ title: "-", value: "" }],
				            by: [{ source: { id: "frmData_Top", row: 1, key: "prod_type" } }, { key: "issue_reason_tp1" }]
				        }
				    }
				},
				{
				    header: "귀책분류", name: "issue_duty_tp1", width: 90, align: "center",
				    format: { type: "select", data: { memory: "귀책분류" } },
				    editable: { type: "select",
				        data: { memory: "귀책분류", unshift: [{ title: "-", value: "" }],
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
				    editable: { type: "select",
				        data: { memory: "귀책구분", unshift: [{ title: "-", value: "" }],
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
            editable: { multi: true, bind: "open", focus: "dept_nm", validate: true },
            element: [
				{ header: "담당부서", name: "dept_nm", width: 120, align: "left", mask: "search", display: true,
				    editable: { type: "text", validate: { rule: "required"} }
				},
				{ header: "담당자", name: "user_nm", width: 60, align: "left", mask: "search", display: true,
				    editable: { type: "text" }
				},
				{ header: "재발방지", name: "act_tp1", width: 120, align: "left"
				    , editable: { type: "select", data: { memory: "재발방지" }, validate: { rule: "required"}
						, change: [ { name: "act_tp2", memory: "대책구분", key: [ "act_tp1" ] } ]
					} },
				{ header: "대책구분", name: "act_tp2", width: 120, align: "left"
				    , editable: { type: "select", data: { memory: "대책구분", key: ["act_tp1"] }, validate: { rule: "required"} } },
                { header: "실시항목", name: "act_item", width: 80, align: "center", editable: { type: "text" } },
                { header: "납기일자", name: "plan_dt", width: 70, align: "center", mask: "date-ymd", editable: { type: "text" } },
                { header: "처리상태", name: "pstat", width: 70, align: "center" },
                { header: "처리자", name: "rslt_user_nm", width: 60, align: "center" },
                { header: "처리일자", name: "rslt_dt", width: 70, align: "center", mask: "date-ymd" },
                { name: "dept_cd", hidden: true, editable: { type: "hidden"} },
                { name: "user_id", hidden: true, editable: { type: "hidden"} },
				{ name: "rqst_no", hidden: true, editable: { type: "hidden"} },
				{ name: "act_seq", hidden: true, editable: { type: "hidden"} }
			]
        };
        gw_com_module.gridCreate(args);

        //==== Detail1 Form : 고분보 담당 부서 처리결과
        var args = { targetid: "frmData_D1", query: "EHM_2312_D_1", type: "TABLE", title: "처리계획 및 결과",
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
                        { name: "plan_dt", mask: "date-ymd",
                            editable: { type: "text", validate: { rule: "required"} }
                        },
                        { header: true, value: "재발방지", format: { type: "label"} },
                        { name: "act_tp1" }
	                    ]
                    },
                    { element: [
                        { header: true, value: "처리결과", format: { type: "label"} },
                        { name: "rslt_cd", editable: { type: "select", data: { memory: "처리결과" }, validate: { rule: "required"} } },
                        { header: true, value: "처리자", format: { type: "label"} },
                        { name: "rslt_user_nm" },
                        { header: true, value: "처리일자", format: { type: "label"} },
                        { name: "rslt_dt", mask: "date-ymd", editable: { type: "hidden" } },
                        { header: true, value: "대책구분", format: { type: "label"} },
                        { name: "act_tp2" }
	                    ]
                    },
                    { element: [
                        { header: true, value: "원인분석 및 대책", format: { type: "label"} },
                        { name: "plan_rmk", style: { colspan: 5 },
                            format: { type: "textarea", rows: 8, width: 800 },
                            editable: { type: "textarea", rows: 8, width: 800 }
                        }
                        ]
                    },
                    { element: [
                        { header: true, value: "처리 내역", format: { type: "label"} },
                        { name: "rslt_rmk", style: { colspan: 5 },
                            format: { type: "textarea", rows: 8, width: 800 },
                            editable: { type: "textarea", rows: 8, width: 800 }
                        },
		                { name: "user_id", hidden: true, editable: { type: "hidden"} },
		                { name: "dept_id", hidden: true, editable: { type: "hidden"} },
                        { name: "file_cnt", hidden: true },
                        { name: "rslt_user", hidden: true }
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
        var args = { targetid: "lyrMenu_Main", element: "상세", event: "click", handler: click_lyrMenu_Main_상세 };
        gw_com_module.eventBind(args);
        function click_lyrMenu_Main_상세(ui) { popupDetail(ui); } //ui.object=lyrMenu_Main, ui.row=1, ui.element=상세, ui.type=FORM
        //----------
        var args = { targetid: "lyrMenu_Main", element: "저장", event: "click", handler: processSave };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_Main", element: "통보", event: "click", handler: click_lyrMenu_Main_통보 };
        gw_com_module.eventBind(args);
        function click_lyrMenu_Main_통보(ui) { processSend({}); }
        //----------
        var args = { targetid: "lyrMenu_Main", element: "삭제", event: "click", handler: processDelete };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_Main", element: "닫기", event: "click", handler: click_lyrMenu_Main_닫기 };
        gw_com_module.eventBind(args);
        function click_lyrMenu_Main_닫기(ui) { processClose({}); }

        //==== Button Click : Sub ====
        //----------
        var args = { targetid: "lyrMenu_Sub", element: "추가", event: "click", handler: click_lyrMenu_Sub_추가 };
        gw_com_module.eventBind(args);
        function click_lyrMenu_Sub_추가(ui) { processInsert(ui); }
        //----------
        var args = { targetid: "lyrMenu_Sub", element: "삭제", event: "click", handler: processDelete };
        gw_com_module.eventBind(args);

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
        var args = { targetid: "frmData_Main", grid: false, event: "itemdblclick", handler: itemdblclick_frmData_Main };
        gw_com_module.eventBind(args);
        var args = { targetid: "frmData_Main", grid: false, event: "itemkeyenter", handler: itemdblclick_frmData_Main };
        gw_com_module.eventBind(args);
        function itemdblclick_frmData_Main(ui) { popupFindItem(ui); }
        //----------
        var args = { targetid: "grdData_Sub", grid: true, event: "rowselected", handler: rowselected_grdData_Sub };
        gw_com_module.eventBind(args);
        function rowselected_grdData_Sub(ui) { if (ui.status) processLink(ui); }
        //----------
        var args = { targetid: "grdData_Sub", grid: true, event: "itemdblclick", handler: itemdblclick_grdData_Sub };
        gw_com_module.eventBind(args);
        var args = { targetid: "grdData_Sub", grid: true, event: "itemkeyenter", handler: itemdblclick_grdData_Sub };
        gw_com_module.eventBind(args);
        function itemdblclick_grdData_Sub(ui) { popupFindItem(ui); }
        //----------
        var args = { targetid: "frmData_D1", event: "itemchanged", handler: itemchanged_frmData_D1 };
        gw_com_module.eventBind(args);
        function itemchanged_frmData_D1(ui) { processItemChanged(ui); }
        //----------

        // startup process.
        gw_com_module.startPage();

    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//---------- ItemChanged Event 처리
function processItemChanged(ui) {

    if (!checkEditable({})) return;

    var vl = ui.value.current;

    if (ui.element == "Remark") {   // 복수행 입력란의 개행문자 치환
        vl = vl.replace(/\r\n/g, "CRLF");
        gw_com_api.setValue("grdData_Sub", "selected", ui.element, vl, true);
    }

    //string.substring(start, length)   
    //string.replace("A","B")

}
//---------- Popup Detail Windows
function popupDetail(ui) {
    v_global.event.object = "frmData_Main";
    v_global.event.row = 1;

	var LinkPage = "";
	var LinkID = gw_com_api.v_Stream.msg_infoECR;

	var IssueNo = gw_com_api.getValue(v_global.event.object, v_global.event.row, "issue_no", false);
	if (IssueNo == "") return;

	var LinkType = gw_com_api.getValue(v_global.event.object, v_global.event.row, "issue_tp", false);
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
        case "rqst_user_nm": {
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
function processRetrieveIssue(param) {

    var args = {
        source: { type: "INLINE",
            argument: [
                { name: "arg_issue_no", value: param.key }
            ]
        },
        target: [
			{ type: "FORM", id: "frmData_Top" }
		],
        key: param.key, handler_complete: processRetrieve
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieve(param) {

	if (v_global.logic.key == "")  {
	    processInsert({ object: "Main" }); // 신규 등록
	    return;
	}

    var args = {
        source: { type: "INLINE",
            argument: [
                { name: "arg_rqst_no", value: v_global.logic.key },
                { name: "arg_data_key", value: v_global.logic.key },	// 첨부파일용
                { name: "arg_data_seq", value: -1 }	// 첨부파일용
            ]
        },
        target: [
			{ type: "FORM", id: "frmData_Main" },
            { type: "GRID", id: "grdData_Main", select: true },
			{ type: "GRID", id: "grdData_Sub", select: true },	//checkEditable({}) ? false : 
			{ type: "GRID", id: "grdData_File1" }
		],
        clear: [
            { type: "FORM", id: "frmData_D1" }
		],
        key: v_global.logic.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {
    var args = {};

    if (param.object == "grdData_Sub") {
        args = { 
            key: param.key,
            source: { type: "GRID", id: "grdData_Sub", row: "selected", block: true,
                element: [
				    { name: "rqst_no", argument: "arg_rqst_no" },
				    { name: "act_seq", argument: "arg_act_seq" }
			    ]
            },
            target: [
                { type: "FORM", id: "frmData_D1" }
		    ]
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
function processInsert(ui) {

    if (ui.object == "lyrMenu_Sub") {	// 대상부서 추가
    	//if (!checkManipulate({ sub: true })) return false;

        var args = { targetid: "grdData_Sub", edit: true, updatable: true,
            data: [
                { name: "rqst_no", value: gw_com_api.getValue("frmData_Main", 1, "rqst_no", false) }
            ]
        };
        gw_com_module.gridInsert(args);
    }
    else {	// 요구서 추가
        var args = { targetid: "frmData_Main", edit: true, updatable: true,
            data: [
                { name: "rqst_no", value: "New" },
                { name: "issue_no", value: v_global.logic.issue_no },
                { name: "rqst_dt", value: gw_com_api.getDate("") },
                { name: "pstat", value: "검토" }
            ],
            clear: [
                { type: "GRID", id: "grdData_Main" },
                { type: "GRID", id: "grdData_Sub" },
                { type: "FORM", id: "frmData_D1" },
                { type: "GRID", id: "grdData_File1" }
            ]
        };
        gw_com_module.formInsert(args);

        var args = {
            targetid: "grdData_Main", edit: true, updatable: true,
            data: [
                { name: "issue_status_grp", value: v_global.logic.status_grp },
                { name: "issue_status_tp1", value: v_global.logic.status_tp1 },
                { name: "issue_status_tp2", value: v_global.logic.status_tp2 },
                { name: "issue_part_tp1", value: v_global.logic.part_tp1 },
                { name: "issue_part_tp2", value: v_global.logic.part_tp2 },
                { name: "issue_reason_tp1", value: v_global.logic.reason_tp1 },
                { name: "issue_reason_tp2", value: v_global.logic.reason_tp2 },
                { name: "issue_duty_tp1", value: v_global.logic.duty_tp1 },
                { name: "issue_duty_tp2", value: v_global.logic.duty_tp2 }
            ]
        };
        gw_com_module.gridInsert(args);
        
        // 대상부서 추가
        processInsert({ object: "lyrMenu_Sub" });

        // 처리결과, 확인 Form 초기화
//        args = { targetid: "frmData_D1", edit: false };
//        gw_com_module.formInsert(args);
//        gw_com_api.setCRUD("frmData_D1", 1, "modify");	// Change Row's Status to Modify

    }

}
//----------
function processDelete(ui) {

    if (ui.object == "lyrMenu_Sub") {
        var args = { targetid: "grdData_Sub", row: "selected" }
        gw_com_module.gridDelete(args);
    }
    else if (ui.object == "lyrMenu_File1") {
        var args = { targetid: "grdData_File1", row: "selected" }
        gw_com_module.gridDelete(args);
    }
    else if(ui.object == "lyrMenu_Main") {
		if (!checkManipulate({})) return;
	            
	    var status = checkCRUD({});
	    if (status == "initialize" || status == "create") processClear({});
	    else {
		    v_global.process.handler = processRemove;
	        gw_com_api.messageBox([ { text: "REMOVE" } ], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO", ui);
		}
    }
    else return;

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_Main" },
            { type: "GRID", id: "grdData_Main" },
            { type: "GRID", id: "grdData_Sub" },
            { type: "FORM", id: "frmData_D1" },
            { type: "GRID", id: "grdData_File1" }
        ]
    };
    gw_com_module.objClear(args);

}
//---------- Save
function processSave(param) {
    //
    var cells = ["issue_status_tp1", "issue_status_tp2", "issue_part_tp1", "issue_part_tp2", "issue_reason_tp1", "issue_reason_tp2", "issue_duty_tp1", "issue_duty_tp2"];
    if (gw_com_api.getUpdatable("grdData_Main", true)) {
        for (var i = 0; i < cells.length; i++) {
            gw_com_api.setValue("frmData_Main", "selected", cells[i], gw_com_api.getValue("grdData_Main", "selected", cells[i], true), false);
        }
        if (gw_com_api.getCRUD("frmData_Main", 1, false) == "retrieve")
            gw_com_api.setCRUD("frmData_Main", 1, "modify", false);
    }

    var args = {
        target: [
			{ type: "FORM", id: "frmData_Main" },
            { type: "GRID", id: "grdData_Sub" },
			{ type: "GRID", id: "grdData_File1" }
		]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args.handler = { success: successSave };
    gw_com_module.objSave(args);

}
//---------- After Saving
function successSave(response, param) {

    $.each(response, function () {
        $.each(this.KEY, function () { 
        	if (this.NAME == "rqst_no") { 
        		v_global.logic.key = this.VALUE;
                processRetrieve({ key: v_global.logic.key }); 
            }
        });
    });

}
//---------- Remove
function processRemove(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_Main", key: { element: [ { name: "rqst_no" } ] } }
        ],
        handler: { success: successRemove, param: param }
    };
    gw_com_module.objRemove(args);

}
//---------- After Removing
function successRemove(response, param) {

    processClear(param);

}
//---------- 고분보 발행 통보 : Mail 전송 시작
function processSend(param) {
	
    if (!checkManipulate({})) return;
    if (!checkUpdatable({ check: true })) return false;

    gw_com_api.messageBox([
        { text: "고분보 발행에 대한 이메일을 발송합니다." + "<br>" },
        { text: "계속 하시겠습니까?" }
    ], 420, gw_com_api.v_Message.msg_confirmBatch, "YESNO", { type: "TAR-RQST" });

}
//---------- Batch : 고분보 발행 통보 처리 Procedure 실행 (PROC_MAIL_EHM_TAR)
function processBatch(param) {
    var args = {
        url: (param.type == "EHM_TAR") ? "COM" : gw_com_module.v_Current.window + ".aspx/" + "Mail",
        procedure: "PROC_MAIL_EHM_TAR", nomessage: true,
        argument: [
            { name: "key_no", value: gw_com_api.getValue("frmData_Main", 1, "rqst_no") }
        ],
        input: [
            { name: "type", value: param.type, type: "varchar" },
            { name: "key_no", value: gw_com_api.getValue("frmData_Main", 1, "rqst_no"), type: "varchar" },
            { name: "key_seq", value: "0", type: "varchar" },
            { name: "user", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
        ],
        output: [
            { name: "r_value", type: "int" },
            { name: "message", type: "varchar" }
        ],
        handler: { success: successBatch }
    };
    gw_com_module.callProcedure(args);
}
//---------- Batch : Afert Processing
function successBatch(response) {
    gw_com_api.messageBox([ { text: response.VALUE[1] } ], 350);
}
//----------
function processApprove(param) {

    var status = gw_com_api.getValue("frmData_Main", 1, "gw_astat_nm", false, true);
    if (status != '없슴' && status != '미처리' && status != '반송' && status != '회수') {
        gw_com_api.messageBox([
            { text: "결재 " + status + " 자료이므로 처리할 수 없습니다." }
        ], 420);
        return false;
    }

    var args = { page: "IFProcess",
        param: { ID: gw_com_api.v_Stream.msg_authSystem,
            data: { system: "GROUPWARE",
                name: gw_com_module.v_Session.GW_ID,
                e고분보ypt: { password: true },
                param: param }
        }
    };
    gw_com_module.dialogueOpen(args);

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
function processClose(param) {

    v_global.process.handler = processClose;
    if (!checkUpdatable({})) return;
    var args = { ID: gw_com_api.v_Stream.msg_closePage };
    gw_com_module.streamInterface(args);

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
                    	voc_no: gw_com_api.getValue(v_global.event.object, v_global.event.row, "issue_no", false)
                    };
                } break;
                case "INFO_SPC": {
                    args.ID = gw_com_api.v_Stream.msg_infoECR;
                    args.data = { 
                    	issue_no: gw_com_api.getValue(v_global.event.object, v_global.event.row, "issue_no", false)
                    };
                } break;
                case "DLG_ISSUE": {
                    args.ID = gw_com_api.v_Stream.msg_infoAS;
                    args.data = { 
                    	issue_no: gw_com_api.getValue(v_global.event.object, v_global.event.row, "issue_no", false)
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