//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 교육신청및보고
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
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        //
        if (gw_com_module.v_Session.USER_TP == "SYS") {
            v_global.logic.option = true;
        } else {
            v_global.logic.option = false;
        }

        // set data for DDDW List
        var args = {
            request: [
                {
                    type: "PAGE", name: "교육구분",
                    query: "DDDW_HRM_COMMON",
                    param: [{ argument: "arg_hcode", value: "A301" }]
                },
                {
                    type: "PAGE", name: "필수구분",
                    query: "DDDW_HRM_COMMON",
                    param: [{ argument: "arg_hcode", value: "A302" }]
                },
                {
                    type: "PAGE", name: "교육분야",
                    query: "DDDW_HRM_COMMON",
                    param: [{ argument: "arg_hcode", value: "A303" }]
                },
                {
                    type: "PAGE", name: "교육결과",
                    query: "DDDW_HRM_COMMON",
                    param: [{ argument: "arg_hcode", value: "A304" }]
                },
                {
                    type: "PAGE", name: "진행단계",
                    query: "DDDW_HRM_COMMON",
                    param: [{ argument: "arg_hcode", value: "A305" }]
                },
                {
                    type: "PAGE", name: "교육만족도",
                    query: "DDDW_HRM_COMMON",
                    param: [{ argument: "arg_hcode", value: "A311" }]
                },
                {
                    type: "INLINE", name: "이수여부",
                    data: [
                        { title: "-", value: "" },
                        { title: "이수", value: "1" },
                        { title: "미이수", value: "0" }
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
            gw_com_module.startPage();

            gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -3 }));
            gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate("", { month: 1 }));
            gw_com_api.setValue("frmOption", 1, "emp_nm", gw_com_module.v_Session.USR_NM);
            gw_com_api.setValue("frmOption", 1, "emp_no", gw_com_module.v_Session.EMP_NO);
        }
    },

    // manage UI. (design section)
    UI: function () {

        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "조회", value: "조회", act: true },
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" },
                { name: "저장", value: "저장" },
                { name: "계획", value: "계획신청", icon: "기타" },
                { name: "교육", value: "교육신청", icon: "기타" },
                { name: "이수", value: "이수제출", icon: "기타" },
                //{ name: "취소", value: "제출취소", icon: "Act" },
                { name: "닫기", value: "닫기" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_SUB", type: "FREE",
            element: [
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_FILE", type: "FREE",
            element: [
                { name: "파일추가", value: "추가", icon: "추가" },
                { name: "파일삭제", value: "삭제", icon: "삭제" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true, remark: "lyrRemark2",
            editable: { focus: "ymd_fr", validate: true },
            content: {
                row: [
                    {
                        element: [
				            {
				                name: "ymd_fr", label: { title: "기간 :" }, mask: "date-ymd",
				                editable: { type: "text", size: 7, maxlength: 10, validate: { rule: "dateISO" } }, style: { colfloat: "floating" }
				            },
				            {
				                name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
				                editable: { type: "text", size: 7, maxlength: 10, validate: { rule: "dateISO" } }
				            },
                            {
                                name: "emp_nm", label: { title: "사원 :" }, mask: "search",
                                editable: { type: "text", size: 10, validate: { rule: "required" } }, hidden: !v_global.logic.option
                            },
                            { name: "emp_no", label: { title: "사원번호 :" }, editable: { type: "text" }, hidden: true }
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
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_MAIN", query: "HRM_1210_1", title: "교육신청이력",
            caption: true, height: 130, pager: false, show: true, selectable: true, number: true,
            element: [
                { header: "시작일", name: "edus_date", width: 80, align: "center", mask: "date-ymd" },
                { header: "종료일", name: "edue_date", width: 80, align: "center", mask: "date-ymd" },
				{ header: "관리번호", name: "edu_no", width: 80, align: "center" },
				{ header: "교육과정", name: "edu_nm", width: 150 },
				{ header: "교육구분", name: "edu_tp_nm", width: 60, align: "center" },
				{ header: "분야", name: "edu_div_nm", width: 60, align: "center" },
				{ header: "필수", name: "ess_yn_nm", width: 50, align: "center" },
				{ header: "교육기관", name: "institute_nm", width: 80 },
				{ header: "교육장소", name: "edu_place", width: 100 },
				{ header: "교육비", name: "edu_amt", width: 60, align: "right", mask: "numeric-int" },
				{
				    header: "고용보험", name: "ins_yn", width: 50, align: "center",
				    format: { type: "checkbox", title: "", value: "1", offval: "0" }
				},
				{ header: "환급액", name: "ins_amt", width: 60, align: "right", mask: "numeric-int" },
				{
				    header: "근태반영", name: "attend_yn", width: 50, align: "center",
				    format: { type: "checkbox", title: "", value: "1", offval: "0" }
				},
				{ header: "진행단계", name: "pstat_nm", width: 50, align: "center" },
				{ header: "승인상태", name: "appr_yn_nm", width: 50, align: "center" },
                { name: "edu_cd", hidden: true },
                { name: "pstat", hidden: true },
                { name: "appr_yn", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_MAIN", query: "HRM_1210_2", type: "TABLE", title: "내역",
            show: true, selectable: true, fixed: true, caption: true,
            editable: { bind: "select", focus: "edus_date", validate: true },
            content: {
                width: { label: 50, field: 50 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "관리번호", format: { type: "label" } },
                            {
                                name: "edu_no",
                                format: { type: "text", width: 137 },
                                editable: { type: "hidden", width: 137 }
                            },
                            { header: true, value: "진행단계/상태", format: { type: "label" } },
                            { name: "stat_nm", format: { type: "text", width: 150 } },
                            { name: "pstat", editable: { type: "hidden" }, hidden: true },
                            { name: "appr_yn", editable: { type: "hidden" }, hidden: true },
                            { header: true, value: "근태반영", format: { type: "label" } },
                            {
                                name: "attend_yn",
                                format: { type: "checkbox", title: "", value: "1", offval: "0" },
                                editable: { type: "checkbox", title: "", value: "1", offval: "0" }
                            },
                            { header: true, value: "제출일시", format: { type: "label" } },
                            { name: "pstat_dt", format: { type: "text", width: 137 } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "시작일", format: { type: "label" } },
                            {
                                name: "edus_date", mask: "date-ymd",
                                format: { type: "text", width: 137 },
                                editable: { type: "text", maxlength: 10, width: 137, validate: { rule: "required" } }
                            },
                            { header: true, value: "교육과정", format: { type: "label" } },
                            {
                                name: "edu_nm", style: { colspan: 3 }, //mask: "search",
                                format: { type: "text", width: 428 },
                                editable: { type: "text", maxlength: 40, width: 428, validate: { rule: "required" } }
                            },
                            { name: "edu_cd", editable: { type: "hidden" }, hidden: true },
                            { header: true, value: "접수일시", format: { type: "label" } },
                            { name: "appr_dt", format: { type: "text", width: 137 } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "종료일", format: { type: "label" } },
                            {
                                name: "edue_date", mask: "date-ymd",
                                format: { type: "text", width: 137 },
                                editable: { type: "text", maxlength: 10, width: 137, validate: { rule: "required" } }
                            },
                            { header: true, value: "교육기관", format: { type: "label" } },
                            {
                                name: "institute_nm", style: { colspan: 3 },
                                format: { type: "text", width: 428 },
                                editable: { type: "text", maxlength: 25, width: 428, validate: { rule: "required" } }
                            },
                            { header: true, value: "교육구분", format: { type: "label" } },
                            {
                                name: "edu_tp",
                                format: { type: "select", data: { memory: "교육구분" }, width: 140 },
                                editable: { type: "select", data: { memory: "교육구분" }, width: 140, validate: { rule: "required" } }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "교육일수", format: { type: "label" } },
                            {
                                name: "edu_days", mask: "numeric-int",
                                format: { type: "text", width: 137 },
                                editable: { type: "text", maxlength: 3, width: 137, validate: { rule: "required" } }
                            },
                            { header: true, value: "교육장소", format: { type: "label" } },
                            {
                                name: "edu_place", style: { colspan: 3 },
                                format: { type: "text", width: 428 },
                                editable: { type: "text", maxlength: 25, width: 428 }
                            },
                            { header: true, value: "교육분야", format: { type: "label" } },
                            {
                                name: "edu_div",
                                format: { type: "select", data: { memory: "교육분야" }, width: 140 },
                                editable: { type: "select", data: { memory: "교육분야" }, width: 140, validate: { rule: "required" } }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "교육시간", format: { type: "label" } },
                            {
                                name: "edu_time", mask: "numeric-float1",
                                format: { type: "text", width: 137 },
                                editable: { type: "text", maxlength: 7, width: 137, validate: { rule: "required" } }
                            },
                            { header: true, value: "자격증대비", format: { type: "label" } },
                            {
                                name: "cetify_yn",
                                format: { type: "checkbox", title: "", value: "1", offval: "0" },
                                editable: { type: "checkbox", title: "", value: "1", offval: "0" }
                            },
                            { header: true, value: "자격증등급", format: { type: "label" } },
                            {
                                name: "cetify_grade",
                                format: { type: "text", width: 137 },
                                editable: { type: "text", width: 137 }
                            },
                            { header: true, value: "필수", format: { type: "label" } },
                            {
                                name: "ess_yn",
                                format: { type: "select", data: { memory: "필수구분" }, width: 140 },
                                editable: { type: "select", data: { memory: "필수구분" }, width: 140, validate: { rule: "required" } }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "교육비총액", format: { type: "label" } },
                            {
                                name: "edu_amt", mask: "numeric-int",
                                format: { type: "text", width: 137 },
                                editable: { type: "text", width: 137 }
                            },
                            { header: true, value: "수강료", format: { type: "label" } },
                            {
                                name: "edu_amt1", mask: "numeric-int",
                                format: { type: "text", width: 137 },
                                editable: { type: "text", width: 137 }
                            },
                            { header: true, value: "교재비", format: { type: "label" } },
                            {
                                name: "edu_amt2", mask: "numeric-int",
                                format: { type: "text", width: 137 },
                                editable: { type: "text", width: 137 }
                            },
                            { header: true, value: "기타비용", format: { type: "label" } },
                            {
                                name: "edu_amt3", mask: "numeric-int",
                                format: { type: "text", width: 137 },
                                editable: { type: "text", width: 137 }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "면세여부", format: { type: "label" } },
                            {
                                name: "notax_yn",
                                format: { type: "checkbox", title: "", value: "1", offval: "0" },
                                editable: { type: "checkbox", title: "", value: "1", offval: "0" }
                            },
                            { header: true, value: "고용보험환급", format: { type: "label" } },
                            {
                                name: "ins_yn",
                                format: { type: "checkbox", title: "", value: "1", offval: "0" },
                                editable: { type: "checkbox", title: "", value: "1", offval: "0" }
                            },
                            { header: true, value: "환급율", format: { type: "label" } },
                            {
                                name: "ins_rate", mask: "numeric-float",
                                format: { type: "text", width: 137 },
                                editable: { type: "text", maxlength: 5, width: 137 }
                            },
                            { header: true, value: "환급액", format: { type: "label" } },
                            {
                                name: "ins_amt", mask: "numeric-int",
                                format: { type: "text", width: 137 },
                                editable: { type: "text", width: 137 }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "교육목적", format: { type: "label" } },
                            {
                                name: "edu_purpose", style: { colspan: 7 },
                                format: { type: "textarea", rows: 2, width: 1006 },
                                editable: { type: "textarea", rows: 2, width: 1006 }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "교육내용", format: { type: "label" } },
                            {
                                name: "edu_contents", style: { colspan: 7 },
                                format: { type: "textarea", rows: 2, width: 1006 },
                                editable: { type: "textarea", rows: 2, width: 1006 }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "비고(결재방법)", format: { type: "label" } },
                            {
                                name: "rqst_rmk", style: { colspan: 7 },
                                format: { type: "text", width: 1008 },
                                editable: { type: "text", maxlength: 110, width: 1008 }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "접수자비고", format: { type: "label" } },
                            {
                                name: "appr_rmk", style: { colspan: 7 },
                                format: { type: "text", width: 1006 }
                            },
                            { name: "emp_no", editable: { type: "hidden" }, hidden: true }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        v_global.logic.frm = args;
        //=====================================================================================
        var args = {
            targetid: "frmData_SUB", query: "HRM_1210_4", type: "TABLE", title: "이수결과 및 평가",
            show: false, selectable: true, fixed: true, caption: true,
            editable: { bind: "select", focus: "finish_yn", validate: true },
            content: {
                width: { label: 50, field: 50 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "이수여부", format: { type: "label" } },
                            {
                                name: "finish_yn",
                                format: { type: "select", data: { memory: "이수여부" }, width: 137 },
                                editable: { type: "select", data: { memory: "이수여부" }, width: 137 }
                            },
                            { header: true, value: "이수시간", format: { type: "label" } },
                            {
                                name: "edu_time", mask: "numeric-float1",
                                format: { type: "text", width: 137 },
                                editable: { type: "text", maxlength: 5, width: 137 }
                            },
                            { header: true, value: "교육만족도", format: { type: "label" } },
                            {
                                name: "survey_grade",
                                format: { type: "select", data: { memory: "교육만족도" }, width: 137 },
                                editable: { type: "select", data: { memory: "교육만족도" }, width: 137 }
                            },
                            { header: true, value: "추천여부", format: { type: "label" } },
                            {
                                name: "recom_yn",
                                format: { type: "checkbox", title: "", value: "1", offval: "0" },
                                editable: { type: "checkbox", title: "", value: "1", offval: "0" }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "교육소감", format: { type: "label" } },
                            {
                                name: "rmk", style: { colspan: 7 },
                                format: { type: "textarea", rows: 3, width: 1006 },
                                editable: { type: "textarea", rows: 3, width: 1006 }
                            },
                            { name: "edu_no", editable: { type: "hidden" }, hidden: true },
                            { name: "emp_no", editable: { type: "hidden" }, hidden: true }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_SUB", query: "HRM_1210_4", title: "수강자 및 이수결과",
            caption: true, height: "100%", pager: false, show: true, selectable: true, number: true,
            editable: { multi: true, bind: "select", focus: "finish_yn", validate: true },
            element: [
                { header: "참가자", name: "emp_nm", width: 60, align: "center" },
                {
                    header: "이수여부", name: "finish_yn", width: 80, align: "center",
                    format: { type: "select", data: { memory: "이수여부" }, width: 118 },
                    editable: { type: "select", data: { memory: "이수여부" }, width: 118 }
                },
                {
                    header: "이수시간", name: "edu_time", width: 60, align: "right", mask: "numeric-float1",
                    format: { type: "text" },
                    editable: { type: "text", maxlength: 5, width: 90 }
                },
				{
				    header: "교육만족도", name: "survey_grade", width: 80, align: "center",
				    format: { type: "select", data: { memory: "교육만족도", unshift: [{ title: "-", value: "" }] }, width: 118 },
				    editable: { type: "select", data: { memory: "교육만족도", unshift: [{ title: "-", value: "" }] }, width: 118 }
				},
				{
				    header: "추천여부", name: "recom_yn", width: 60, align: "center",
				    format: { type: "checkbox", title: "", value: "1", offval: "0" },
				    editable: { type: "checkbox", title: "", value: "1", offval: "0" }
				},
				{
				    header: "교육소감", name: "rmk", width: 400,
				    format: { type: "text" },
				    editable: { type: "text", width: 586 }
				},
                { name: "edu_no", editable: { type: "hidden"}, hidden: true },
                { name: "emp_no", editable: { type: "hidden" }, hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_FILE", query: "HRM_1210_3", title: "첨부파일",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            editable: { multi: true, bind: "select", focus: "file_desc", validate: true },
            element: [
				{ header: "파일명", name: "file_nm", width: 250 },
				{ header: "다운로드", name: "download", width: 60, align: "center", format: { type: "link", value: "다운로드" } },
				{ header: "설명", name: "file_desc", width: 300, editable: { type: "text", maxlength: 110, width: 400 } },
                { name: "file_path", hidden: true },
                { name: "file_id", hidden: true, editable: { type: "hidden" } }
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
                { type: "GRID", id: "grdList_MAIN", offset: 8 },
                { type: "FORM", id: "frmData_MAIN", offset: 8 },
                { type: "FORM", id: "frmData_SUB", offset: 8 },
                { type: "GRID", id: "grdData_SUB", offset: 8 },
                { type: "GRID", id: "grdData_FILE", offset: 8 }
			]
        };
        gw_com_module.objResize(args);
        //=====================================================================================
        gw_com_module.informSize();

    },

    // manage process. (program section)
    procedure: function () {

        //=====================================================================================
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: viewOption };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "계획", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "교육", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "이수", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "취소", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_SUB", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_SUB", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_FILE", element: "파일추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_FILE", element: "파일삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption", event: "itemdblclick", handler: processItemdblClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemkeyenter", handler: processItemdblClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: closeOption };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdList_MAIN", grid: true, event: "rowselecting", handler: processRowSelecting };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_MAIN", grid: true, event: "rowselected", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmData_MAIN", event: "itemdblclick", handler: processItemdblClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_MAIN", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_FILE", grid: true, element: "download", event: "click", handler: processFile };
        gw_com_module.eventBind(args);
        //=====================================================================================

    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function viewOption(param) {

    gw_com_api.show("frmOption");

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

}
//----------
function processButton(param) {

    closeOption({});
    switch (param.element) {
        case "실행":
            v_global.process.handler = processRetrieve;
            if (!checkUpdatable({})) return;
            processRetrieve({});
            break;
        case "추가":
            if (!checkUpdatable({ check: true })) return;
            processInsert(param);
            break;
        case "삭제":
            if (!checkManipulate({})) return;
            processDelete(param);
            break;
        case "저장":
            processSave({});
            break;
        case "교육":
        case "이수":
            if (!checkManipulate({})) return;
            if (!checkUpdatable({ check: true })) return;
            if (!processApprChk(param)) return;

            v_global.logic.frm_id = (param.element == "교육" ? "EDU2" : "EDU3");
            var args = {
                type: "PAGE", page: "DLG_EDIT_APPR", title: "결재상신",
                width: 1100, height: 700, scroll: true, open: true, control: true, locate: ["center", "center"]
            };

            if (gw_com_module.dialoguePrepare(args) == false) {
                args.param = {
                    ID: gw_com_api.v_Stream.msg_openedDialogue,
                    data: {
                        frm_id: v_global.logic.frm_id,
                        ref_key1: gw_com_api.getValue("frmData_MAIN", 1, "edu_no"),
                        ref_key2: "",
                        ref_key3: "",
                        root_no: gw_com_api.getValue("frmData_MAIN", 1, "edu_no")
                    }
                };
                gw_com_module.dialogueOpen(args);
            }
            break;
        case "계획":
        case "취소":
            if (!checkManipulate({})) return;
            if (!checkUpdatable({ check: true })) return;

            param.data = {};
            param.data.edu_no = gw_com_api.getValue("frmData_MAIN", 1, "edu_no");
            if (!processApprChk(param)) return;

            switch (param.element) {
                case "계획":
                    if (gw_com_api.getValue("frmData_MAIN", 1, "pstat") == "1" && gw_com_api.getValue("frmData_MAIN", 1, "appr_yn") != "3")
                        param.data.appr_yn = "2";
                    break;
                case "교육":
                    if (gw_com_api.getValue("frmData_MAIN", 1, "pstat") == "2" && gw_com_api.getValue("frmData_MAIN", 1, "appr_yn") != "3")
                        param.data.appr_yn = "2";
                    break;
                case "이수":
                    if (gw_com_api.getValue("frmData_MAIN", 1, "pstat") == "3" && gw_com_api.getValue("frmData_MAIN", 1, "appr_yn") != "3")
                        param.data.appr_yn = "2";
                    break;
                case "취소":
                    if (gw_com_api.getValue("frmData_MAIN", 1, "appr_yn") == "2")
                        param.data.appr_yn = "5";
                    break;
            }
            processAppr(param);
            break;
        case "닫기":
            v_global.process.handler = processClose;
            if (!checkUpdatable({})) return;
            processClose({});
            break;
        case "파일추가":
            if (!checkManipulate({})) return;
            if (!checkUpdatable({ check: true })) return;
            if (!checkStat({})) {
                gw_com_api.messageBox([{ text: "수정할 수 없습니다." }]);
                return;
            }
            processInsert(param);
            break;
        case "파일삭제":
            processDelete(param);
            break;
    }

}
//----------
function processItemchanged(param) {

    if (param.object == "frmOption") {
        switch (param.element) {
            case "dept_nm":
                if (param.value.current == "")
                    gw_com_api.setValue(param.object, param.row, "dept_cd", "");
                break;
            case "emp_nm":
                if (param.value.current == "")
                    gw_com_api.setValue(param.object, param.row, "emp_no", "");
                break;
        }
    }

}
//----------
function processItemdblClick(param) {

    v_global.event.type = param.type;
    v_global.event.object = param.object;
    v_global.event.row = param.row;
    v_global.event.element = param.element;

    var args;
    if (param.object == "frmData_MAIN") {
        args = {
            type: "PAGE", page: "HRM_1211", title: "교육과정",
            width: 1100, height: 450, locate: ["center", "center"], open: true
        };
    } else {
        switch (param.element) {
            case "edu_nm":
                args = {
                    type: "PAGE", page: "HRM_1211", title: "교육과정",
                    width: 1100, height: 450, locate: ["center", "center"], open: true
                };
                break;
            case "dept_nm":
                args = {
                    type: "PAGE", page: "w_find_dept", title: "부서 검색",
                    width: 600, height: 450, locate: ["center", "top"], open: true,
                    data: {
                        dept_nm: gw_com_api.getValue(
                            v_global.event.object,
                            v_global.event.row,
                            v_global.event.element,
                            (v_global.event.type == "GRID" ? true : false))
                    }
                };
                break;
            case "emp_nm":
                args = {
                    type: "PAGE", page: "w_find_emp", title: "사원 검색",
                    width: 600, height: 450, locate: ["center", "top"], open: true,
                    data: {
                        emp_nm: gw_com_api.getValue(
                            v_global.event.object,
                            v_global.event.row,
                            v_global.event.element,
                            (v_global.event.type == "GRID" ? true : false))
                    }
                };
                break;
        }
    }

    if (args != null) {
        if (gw_com_module.dialoguePrepare(args) == false) {
            args = {
                page: args.page,
                param: {
                    ID: gw_com_api.v_Stream.msg_openedDialogue,
                    data: args.data
                }
            };
            gw_com_module.dialogueOpen(args);
        }
    }

}
//----------
function processRowSelecting(param) {

    v_global.process.handler = processSelect;
    v_global.process.current.master = param.row;
    return checkUpdatable({});

}
//----------
function processSelect(param) {

    gw_com_api.selectRow("grdList_MAIN", v_global.process.current.master, true, false);

}
//----------
function processRetrieve(param) {

    var args;
    if (param.object == "grdList_MAIN") {
        //changeDW_STAT(checkStat2({}));
        args = {
            source: {
                type: param.type, id: param.object, row: "selected",
                element: [
                    { name: "edu_no", argument: "arg_edu_no" }
                ],
                argument: [
                    { name: "arg_emp_no", value: gw_com_module.v_Session.EMP_NO }
                ]
            },
            target: [
                { type: "FORM", id: "frmData_MAIN" },
                { type: "FORM", id: "frmData_SUB" },
                { type: "GRID", id: "grdData_SUB" },
                { type: "GRID", id: "grdData_FILE" }
            ],
            handler: {
                complete: processRetrieveEnd,
                param: param
            },
            key: param.key
        };
    } else {
        args = { target: [{ type: "FORM", id: "frmOption" }] };
        if (!gw_com_module.objValidate(args)) return;

        args = {
            source: {
                type: "FORM", id: "frmOption", hide: true,
                element: [
                    { name: "ymd_fr", argument: "arg_ymd_fr" },
                    { name: "ymd_to", argument: "arg_ymd_to" },
                    { name: "emp_no", argument: "arg_emp_no" }
                ],
                remark: [
                    { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }] }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_MAIN", select: true }
            ],
            clear: [
                { type: "FORM", id: "frmData_MAIN" },
                { type: "FORM", id: "frmData_SUB" },
                { type: "GRID", id: "grdData_SUB" },
                { type: "GRID", id: "grdData_FILE" }
            ],
            key: param.key
        };
    }
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {

}
//----------
function processInsert(param) {

    if (param.object == "lyrMenu_SUB") {
        if (!checkManipulate({})) return;
        var args = {
            type: "PAGE", page: "DLG_EMP", title: "사원 검색",
            width: 650, height: 450, locate: ["center", "center"], open: true
        };
        if (gw_com_module.dialoguePrepare(args) == false) {
            var args = {
                page: "DLG_EMP",
                param: {
                    ID: gw_com_api.v_Stream.msg_openedDialogue,
                    data: {
                        dept_nm: gw_com_module.v_Session.DEPT_NM,
                        key: [gw_com_module.v_Session.EMP_NO]
                    }
                }
            };
            gw_com_module.dialogueOpen(args);
        }
    } else if (param.object == "lyrMenu_FILE") {
        if (!checkManipulate({})) return;
        var args = {
            type: "PAGE", page: "DLG_FileUpload", title: "파일 업로드",
            width: 650, height: 140, locate: ["center", "bottom"], open: true,
        };
        if (gw_com_module.dialoguePrepare(args) == false) {
            args = {
                page: args.page,
                param: {
                    ID: gw_com_api.v_Stream.msg_openedDialogue,
                    data: {
                        type: "HRM_EDU",
                        key: gw_com_api.getValue("frmData_MAIN", 1, "edu_no")
                    }
                }
            };
            gw_com_module.dialogueOpen(args);
        }
    } else {
        changeDW_STAT(true);
        var args = {
            targetid: "frmData_MAIN", edit: true, updatable: true,
            data: [
                { name: "emp_no", value: gw_com_module.v_Session.EMP_NO },
                { name: "edus_date", value: gw_com_api.getDate("", { day: 1 }) },
                { name: "edue_date", value: gw_com_api.getDate("", { day: 1 }) },
                { name: "pstat", value: "1" },
                { name: "appr_yn", value: "1" }
            ],
            clear: [
                { type: "FORM", id: "frmData_SUB" },
                { type: "GRID", id: "grdData_SUB" },
                { type: "GRID", id: "grdData_FILE" }
            ]
        };
        gw_com_module.formInsert(args);
        //args = {
        //    targetid: "frmData_SUB", edit: true, updatable: true,
        //    data: [
        //        { name: "emp_no", value: gw_com_module.v_Session.EMP_NO }
        //    ],
        //    clear: [
        //        { type: "GRID", id: "grdData_FILE" }
        //    ]
        //};
        //gw_com_module.formInsert(args);
        args = {
            targetid: "grdData_SUB", edit: true, updatable: true,
            data: [
                { name: "edu_on", value: gw_com_api.getValue("frmData_MAIN", 1, "edu_no") },
                { name: "emp_no", value: gw_com_module.v_Session.EMP_NO },
                { name: "emp_nm", value: gw_com_module.v_Session.USR_NM }
            ]
        };
        gw_com_module.gridInsert(args);
        
        processItemdblClick({ object: "frmData_MAIN", type: "FORM", element: "edu_nm", row: "1" });
    }

}
//----------
function processDelete(param) {

    if (!checkStat({})) {
        gw_com_api.messageBox([{ text: "제출 또는 접수된 내역은 삭제할 수 없습니다." }]);
        return;
    }

    var args;
    if (param.object == "lyrMenu_SUB") {
        if (gw_com_api.getValue("grdData_SUB", "selected", "emp_no", true) == gw_com_module.v_Session.EMP_NO) {
            gw_com_api.messageBox([{ text: "등록자 자료는 삭제할 수 없습니다." }]);
            return;
        }
        args = { targetid: "grdData_SUB", row: "selected", select: true }
        gw_com_module.gridDelete(args);
    } else if (param.object == "lyrMenu_FILE") {
        args = { targetid: "grdData_FILE", row: "selected", select: true }
        gw_com_module.gridDelete(args);
    } else {
        var status = checkCRUD({});
        if (status == "initialize" || status == "create") {
            processRetrieve({ object: "grdList_MAIN", row: "selected", type: "GRID" });
        } else {
            v_global.process.handler = processRemove;
            gw_com_api.messageBox([{ text: "REMOVE" }], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO");
            return;
        }
    }

}
//----------
function processRemove(param) {

    var args = {
        url: "COM",
        target: [
            {
                type: "FORM", id: "frmData_MAIN",
                key: { element: [{ name: "edu_no" }] }
            }
        ],
        handler: {
            success: successRemove,
            param: param
        }
    };
    gw_com_module.objRemove(args);

}
//----------
function successRemove(param) {

    processRetrieve({});

}
//----------
function processSave(param) {

    if (!checkStat({})) {
        gw_com_api.messageBox([{ text: "제출 또는 접수된 내역은 수정할 수 없습니다." }]);
        return;
    }
    var args = {
        //url: "COM",
        target: [
			{ type: "FORM", id: "frmData_MAIN" },
			//{ type: "FORM", id: "frmData_SUB" },
            { type: "GRID", id: "grdData_SUB" },
            { type: "GRID", id: "grdData_FILE" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args.handler = {
        success: successSave,
        param: param
    };
    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    response[0].QUERY = "HRM_1210_1";
    processRetrieve({ key: response });

}
//----------
function processClose(param) {

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
//----------
function checkUpdatable(param) {

    var args = {
        check: param.check,
        target: [
            { type: "FORM", id: "frmData_MAIN" },
            { type: "FORM", id: "frmData_SUB" }
        ],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function checkManipulate(param) {

    if (checkCRUD(param) == "none") {
        gw_com_api.messageBox([{ text: "NOMASTER" }]);
        return false;
    }
    return true;

}
//----------
function checkCRUD(param) {

    return gw_com_api.getCRUD("frmData_MAIN");

}
//----------
function checkStat(param) {

    var pstat = gw_com_api.getValue("frmData_MAIN", 1, "pstat");
    var appr_yn = gw_com_api.getValue("frmData_MAIN", 1, "appr_yn");

    //if ($.inArray(pstat, ["", "1"]) >= 0 && $.inArray(appr_yn, ["", "1"]) >= 0)
    //    return true;
    //else
    //    return false;
    if ($.inArray(appr_yn, ["2", "3"]) >= 0)
        return false;
    else
        return true;

}
//----------
function checkStat2(param) {

    var pstat = gw_com_api.getValue("grdList_MAIN", "selected", "pstat", true);
    var appr_yn = gw_com_api.getValue("grdList_MAIN", "selected", "appr_yn", true);

    if ($.inArray(pstat, ["", "1"]) >= 0 && $.inArray(appr_yn, ["", "1"]) >= 0)
        return true;
    else
        return false;

}
//----------
function processFile(param) {

    var args = {
        source: { id: param.object, row: param.row },
        targetid: "lyrDown"
    };
    gw_com_module.downloadFile(args);

}
//----------
function changeDW_STAT(stat) {

    //$.ajaxSetup({ async: false });
    ////----------
    //var args = $.extend(true, {}, v_global.logic.frm);
    ////----------
    //if (stat) {
    //} else {
    //    args.content.row[0].element[3].editable.type = "hidden";
    //    args.content.row[5].element[1].editable.type = "hidden";
    //}
    ////----------
    //gw_com_module.formCreate(args);
    ////=====================================================================================
    //var args = {
    //    target: [
    //        { type: "FORM", id: "frmData_MAIN", offset: 8 }
    //    ]
    //};
    //gw_com_module.objResize(args);
    ////=====================================================================================
    //if (stat) {
    //    var args = { targetid: "frmData_MAIN", event: "itemdblclick", handler: processItemdblClick };
    //    gw_com_module.eventBind(args);
    //}
    ////----------
    //var args = { targetid: "frmData_MAIN", event: "itemchanged", handler: processItemchanged };
    //gw_com_module.eventBind(args);
    ////=====================================================================================
    //$.ajaxSetup({ async: true });
    ////----------

}
//----------
function processApprChk(param) {

    var rtn = false
    var msg = "";
    switch (param.element) {
        case "계획":
            if (gw_com_api.getValue("frmData_MAIN", 1, "pstat") == "1" && gw_com_api.getValue("frmData_MAIN", 1, "appr_yn") != "3")
                rtn = true;
            msg = "계획신청 처리를 할 수 없습니다.";
            break;
        case "교육":
            if ($.inArray(gw_com_api.getValue("frmData_MAIN", 1, "pstat"), ["1", "2"]) >= 0 && gw_com_api.getValue("frmData_MAIN", 1, "appr_yn") != "3")
                rtn = true;
            msg = "교육신청 처리를 할 수 없습니다.";
            break;
        case "이수":
            if (gw_com_api.getValue("frmData_MAIN", 1, "pstat") == "3" && gw_com_api.getValue("frmData_MAIN", 1, "appr_yn") != "3")
                rtn = true;
            msg = "이수제출 처리를 할 수 없습니다.";
            break;
        case "취소":
            if (gw_com_api.getValue("frmData_MAIN", 1, "appr_yn") == "2")
                rtn = true;
            msg = "제출취소 처리를 할 수 없습니다.";
            break;
    }

    if (!rtn && !param.nomessage)
        gw_com_api.messageBox([{ text: msg }]);
    return rtn;

}
//----------
function processAppr(param) {

    var row = [{
        crud: "U",
        column: [
            { name: "edu_no", value: param.data.edu_no },
            { name: "appr_yn", value: param.data.appr_yn },
            { name: "appr_emp_no", value: gw_com_module.v_Session.EMP_NO },
            { name: "appr_date", value: "" }
        ]
    }];

    if (param.data.appr_yn == "2") {
        row[0].column.push({ name: "pstat_dt", value: "" });
    }

    var args = {
        url: "COM",
        user: gw_com_module.v_Session.USR_ID,
        param: [
            {
                query: "HRM_1210_2",
                row: row
            }
        ],
        handler: {
            success: successSave
        }
    };
    gw_com_module.objSave(args);

}
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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
                    param.to = { type: "POPUP", page: param.data.page };
                    gw_com_module.streamInterface(param);
                    break;
                }
                switch (param.data.ID) {
                    case gw_com_api.v_Message.msg_confirmSave:
                        {
                            if (param.data.result == "YES") {
                                processSave(param.data.arg);
                            } else {
                                if (v_global.process.handler != null)
                                    v_global.process.handler(param.data.arg);
                            }
                        } break;
                    case gw_com_api.v_Message.msg_confirmRemove:
                        { if (param.data.result == "YES") processRemove(param.data.arg); } break;
                    case gw_com_api.v_Message.msg_informSaved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param); 
                        } break;
                    case gw_com_api.v_Message.msg_informRemoved:
                        { param.data.arg.handler(param.data.arg.response, param.data.arg.param); } break;
                    case gw_com_api.v_Message.msg_informBatched:
                        { param.data.arg.handler(param.data.arg.response, param.data.arg.param); } break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = {
                    to: { type: "POPUP", page: param.from.page },
                    ID: param.ID
                };
                switch (param.from.page) {
                    case "HRM_1211":
                        break;
                    case "w_find_emp":
                        {
                            args.data = {
                                dept_nm: gw_com_api.getValue(
                                    v_global.event.object,
                                    v_global.event.row,
                                    "dept_nm",
                                    (v_global.event.type == "GRID" ? true : false)),
                                emp_nm: gw_com_api.getValue(
                                    v_global.event.object,
                                    v_global.event.row,
                                    v_global.event.element,
                                    (v_global.event.type == "GRID" ? true : false))
                            }

                        }
                        break;
                    case "w_find_dept":
                        {
                            args.data = {
                                dept_nm: gw_com_api.getValue(
                                    v_global.event.object,
                                    v_global.event.row,
                                    v_global.event.element,
                                    (v_global.event.type == "GRID" ? true : false))
                            }
                        }
                        break;
                    case "DLG_FileUpload":
                        {
                            args.data = {
                                type: "HRM_EDU",
                                key: gw_com_api.getValue("frmData_MAIN", 1, "edu_no")
                            }
                        }
                        break;
                    case "DLG_EDIT_APPR":
                        args.data = {
                            frm_id: v_global.logic.frm_id,
                            ref_key1: gw_com_api.getValue("frmData_MAIN", 1, "edu_no"),
                            ref_key2: "",
                            ref_key3: "",
                            root_no: gw_com_api.getValue("frmData_MAIN", 1, "edu_no")
                        }
                        break;
                    case "DLG_EMP":
                        args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                        args.data = {
                            dept_nm: gw_com_module.v_Session.DEPT_NM,
                            key: [gw_com_module.v_Session.EMP_NO]
                        };
                        break;
                }
                gw_com_module.streamInterface(args);
            } break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                switch (param.from.page) {
                    case "HRM_1211":
                        if (param.data != undefined) {
                            gw_com_api.setValue(v_global.event.object, v_global.event.row, "edu_cd", param.data.edu_cd);
                            gw_com_api.setValue(v_global.event.object, v_global.event.row, "edu_nm", param.data.edu_nm);
                            gw_com_api.setValue(v_global.event.object, v_global.event.row, "edus_date", param.data.edus_date);
                            gw_com_api.setValue(v_global.event.object, v_global.event.row, "edue_date", param.data.edue_date);
                            gw_com_api.setValue(v_global.event.object, v_global.event.row, "edu_time", param.data.edu_time);
                            gw_com_api.setValue(v_global.event.object, v_global.event.row, "edu_tp", param.data.edu_tp);
                            gw_com_api.setValue(v_global.event.object, v_global.event.row, "edu_tp_nm", param.data.edu_tp_nm);
                            gw_com_api.setValue(v_global.event.object, v_global.event.row, "ess_yn", param.data.ess_yn);
                            gw_com_api.setValue(v_global.event.object, v_global.event.row, "ess_yn_nm", param.data.ess_yn_nm);
                            gw_com_api.setValue(v_global.event.object, v_global.event.row, "edu_div", param.data.edu_div);
                            gw_com_api.setValue(v_global.event.object, v_global.event.row, "edu_div_nm", param.data.edu_div_nm);
                            gw_com_api.setValue(v_global.event.object, v_global.event.row, "institute_nm", param.data.institute_nm);
                            gw_com_api.setValue(v_global.event.object, v_global.event.row, "edu_place", param.data.edu_place);
                            gw_com_api.setValue(v_global.event.object, v_global.event.row, "edu_purpose", param.data.edu_purpose);
                            gw_com_api.setValue(v_global.event.object, v_global.event.row, "edu_contents", param.data.edu_contents);
                            gw_com_api.setValue(v_global.event.object, v_global.event.row, "edu_amt", param.data.edu_amt);
                            gw_com_api.setValue(v_global.event.object, v_global.event.row, "edu_amt1", param.data.edu_amt1);
                            gw_com_api.setValue(v_global.event.object, v_global.event.row, "edu_amt2", param.data.edu_amt2);
                            gw_com_api.setValue(v_global.event.object, v_global.event.row, "edu_amt3", param.data.edu_amt3);
                            gw_com_api.setValue(v_global.event.object, v_global.event.row, "notax_yn", param.data.notax_yn);
                            gw_com_api.setValue(v_global.event.object, v_global.event.row, "ins_yn", param.data.ins_yn);
                            gw_com_api.setValue(v_global.event.object, v_global.event.row, "ins_rate", param.data.ins_rate);
                            gw_com_api.setValue(v_global.event.object, v_global.event.row, "ins_amt", param.data.ins_amt);
                            ////gw_com_api.setValue(v_global.event.object, v_global.event.row, "notax_yn2", param.data.notax_yn);
                            //if (param.data.notax_yn == "1") {
                            //    $("#frmData_MAIN_notax_yn2_view").attr("checked", true);
                            //} else {
                            //    $("#frmData_MAIN_notax_yn2_view").removeAttr("checked");
                            //}
                            //$("#frmData_MAIN_notax_yn2_view").attr("value", param.data.notax_yn);
                            //gw_com_api.setValue(v_global.event.object, v_global.event.row, "ins_yn", param.data.ins_yn);
                            ////gw_com_api.setValue(v_global.event.object, v_global.event.row, "ins_yn2", param.data.ins_yn);
                            //if (param.data.ins_yn == "1") {
                            //    $("#frmData_MAIN_ins_yn2_view").attr("checked", true);
                            //} else {
                            //    $("#frmData_MAIN_ins_yn2_view").removeAttr("checked");
                            //}
                            //$("#frmData_MAIN_ins_yn2_view").attr("value", param.data.ins_yn);
                        }
                        break;
                    case "w_find_emp":
                        if (param.data != undefined) {
                            gw_com_api.setValue(
                                                v_global.event.object,
                                                v_global.event.row,
                                                v_global.event.element,
                                                param.data.emp_nm,
                                                (v_global.event.type == "GRID") ? true : false);
                            gw_com_api.setValue(
                                                v_global.event.object,
                                                v_global.event.row,
                                                "emp_no",
                                                param.data.emp_no,
                                                (v_global.event.type == "GRID") ? true : false);
                            //gw_com_api.setValue(
                            //                    v_global.event.object,
                            //                    v_global.event.row,
                            //                    "dept_nm",
                            //                    param.data.dept_nm,
                            //                    (v_global.event.type == "GRID") ? true : false);
                            //gw_com_api.setValue(
                            //                    v_global.event.object,
                            //                    v_global.event.row,
                            //                    "dept_cd",
                            //                    param.data.dept_cd,
                            //                    (v_global.event.type == "GRID") ? true : false);
                        }
                        break;
                    case "w_find_dept":
                        if (param.data != undefined) {
                            gw_com_api.setValue(
                                                v_global.event.object,
                                                v_global.event.row,
                                                v_global.event.element,
                                                param.data.dept_nm,
                                                (v_global.event.type == "GRID") ? true : false);
                            gw_com_api.setValue(
                                                v_global.event.object,
                                                v_global.event.row,
                                                "dept_cd",
                                                param.data.dept_cd,
                                                (v_global.event.type == "GRID") ? true : false);
                        }
                        break;
                    case "DLG_FileUpload":
                        if (param.data != undefined) {
                            processRetrieve({ type: "GRID", object: "grdList_MAIN", row: "selected" });
                        }
                        break;
                    case "DLG_EDIT_APPR":
                        if (param.data != undefined) {
                            var key = [
                                {
                                    KEY: [
                                        { NAME: "edu_no", VALUE: param.data.ref_key1 }
                                    ],
                                    QUERY: "HRM_1210_1"
                                }
                            ];
                            processRetrieve({ key: key });
                        }
                        break;
                }
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedEmployee:
            {
                if (param.data != undefined && param.data.emp_no != undefined) {
                    if (gw_com_api.getFindRow("grdData_SUB", "emp_no", param.data.emp_no) == -1) {
                        var args = {
                            targetid: "grdData_SUB", edit: true, updatable: true,
                            data: [
                                { name: "edu_no", value: gw_com_api.getValue("frmData_MAIN", 1, "edu_no") },
                                { name: "emp_no", value: param.data.emp_no },
                                { name: "emp_nm", value: param.data.emp_nm }
                            ]
                        };
                        gw_com_module.gridInsert(args);
                    }
                }
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//