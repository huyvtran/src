//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 해외출장계획&정산 검토
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

        // set data for DDDW List
        var args = {
            request: [
				{
				    type: "PAGE", name: "비용", query: "DDDW_HRM_COMMON",
				    param: [{ argument: "arg_hcode", value: "B410" }]
				},
				{
				    type: "PAGE", name: "통화", query: "DDDW_HRM_COMMON",
				    param: [{ argument: "arg_hcode", value: "B420" }]
				},
				{
				    type: "PAGE", name: "지역", query: "DDDW_HRM_COMMON",
				    param: [{ argument: "arg_hcode", value: "B430" }]
				},
                {
                    type: "INLINE", name: "결재상태",
                    data: [
                        { title: "전체", value: "%" },
                        { title: "대기", value: "0" },
                        { title: "확정", value: "2" },
                        { title: "검토요청", value: "4" },
                        { title: "검토", value: "5" },
                        { title: "회수/반려", value: "9" }
                    ]
                }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);

        //----------
        function start() {
            v_global.logic.biztrip_tp = "C";

            gw_job_process.UI();
            gw_job_process.procedure();
            gw_com_module.startPage();

            gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -3 }));
            gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate(""));
            gw_com_api.setValue("frmOption", 1, "dept_cd", gw_com_module.v_Session.DEPT_CD);
            gw_com_api.setValue("frmOption", 1, "dept_nm", gw_com_module.v_Session.DEPT_NM);

            processRetrieve({ object: "EMP" });
        }
    },

    // manage UI. (design section)
    UI: function () {

        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "조회", value: "조회", act: true },
                { name: "저장", value: "저장" },
                { name: "검토", value: "검토완료", icon: "기타" },
                { name: "계획", value: "상신(계획)", icon: "기타" },
                { name: "정산", value: "상신(정산)", icon: "기타" },
                { name: "규정", value: "관련규정", icon: "Act" },
                { name: "닫기", value: "닫기" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_BIZTRIP_DEST", type: "FREE",
            element: [
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_BIZTRIP_WORK", type: "FREE",
            element: [
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_BIZTRIP_EXP", type: "FREE",
            element: [
                //{ name: "정액", value: "정액경비", icon: "Act" },
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
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true, remark: "lyrRemark",
            editable: { focus: "trip_year", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "dept_nm", label: { title: "부서 :" }, mask: "search",
                                editable: { type: "text", size: 15 }
                            },
                            { name: "dept_cd", hidden: true },
                            {
                                name: "emp_nm", label: { title: "사원 :" }, mask: "search",
                                editable: { type: "text", size: 10 }
                            },
                            { name: "emp_nm", hidden: true }
                        ]
                    },
                    {
                        element: [
				            {
				                name: "ymd_fr", label: { title: "기간 :" }, mask: "date-ymd",
				                editable: { type: "text", size: 7, maxlength: 10, validate: { rule: "dateISO" } }, style: { colfloat: "floating" }
				            },
				            {
				                name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
				                editable: { type: "text", size: 7, maxlength: 10, validate: { rule: "dateISO" } }
				            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "appr_yn", label: { title: "계획결재상태 :" },
                                editable: { type: "select", data: { memory: "결재상태" } }
                            },
                            {
                                name: "appr_stat", label: { title: "정산결재상태 :" },
                                editable: { type: "select", data: { memory: "결재상태" } }
                            }
                        ]
                    },
                    {
                        element: [
			                { name: "실행", value: "실행", act: true, format: { type: "button" } },
			                { name: "취소", value: "취소", format: { type: "button", icon: "닫기" } },
                            { name: "emp_no", label: { title: "사원번호 :" }, editable: { type: "text" }, hidden: true },
                            { name: "emp_nm", label: { title: "사원명 :" }, editable: { type: "text" }, hidden: true }
                        ], align: "right"
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_EMP", query: "HRM_3030_1", title: "사원 정보",
            caption: true, height: "100%", pager: false, show: false, selectable: true, number: true,
            element: [
                { header: "사업부", name: "dept_area_nm", width: 80, align: "center" },
                { header: "부서", name: "dept_nm", width: 80, align: "center" },
                { header: "호칭", name: "pos_nm", width: 80, align: "center" },
                { header: "직급", name: "grade_nm", width: 80, align: "center" },
                { header: "성명", name: "emp_nm", width: 80, align: "center" },
                { header: "사원번호", name: "emp_no", width: 80, align: "center" },
                //{ header: "차량번호", name: "car_no", width: 80, align: "center" },
                { name: "dept_cd", hidden: true },
                { name: "grade_cd", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_BIZTRIP", query: "HRM_3035_2", title: "출장현황(국외)",
            caption: true, height: 165, show: true, selectable: true, number: true,
            editable: { master: true, bind: "_edit_yn2", focus: "fr_date", validate: true },
            element: [
                { header: "결재(계획)", name: "appr_yn_nm", width: 50, align: "center" },
                { header: "결재(정산)", name: "appr_yn2_nm", width: 50, align: "center" },
                { header: "사원", name: "emp_nm", width: 50, align: "center" },
                { header: "부서", name: "dept_nm", width: 140, align: "center" },
                { header: "직급", name: "grade_nm", width: 40, align: "center" },
                {
                    header: "기간(From)", name: "fr_date", width: 100, align: "center", mask: "date-ymd",
                    editable: { type: "text", maxlength: 10, width: 104, validate: { rule: "dateISO" } }
                },
                {
                    header: "기간(To)", name: "to_date", width: 100, align: "center", mask: "date-ymd",
                    editable: { type: "text", maxlength: 10, width: 104, validate: { rule: "dateISO" } }
                },
                { header: "출장지", name: "trip_dest", width: 120, editable: { type: "text", maxlength: 50, width: 126 } },
                { header: "출장지역", name: "trip_area", width: 120, editable: { type: "text", maxlength: 20, width: 126 }, hidden: true },
                { header: "출장목적", name: "trip_desc", width: 150, editable: { type: "text", maxlength: 100, width: 156 } },
                {
                    header: "Project No.", name: "proj_no", width: 100, mask: "search",
                    editable: { type: "text", maxlength: 20, width: 106, validate: { rule: "required" } }
                },
                { header: "경비총액", name: "exp_sum", width: 80, align: "right", mask: "numeric-int" },
                {
                    header: "가지급금", name: "befpay_amt", width: 80,
                    editable: { type: "text", width: 86 }, align: "right", mask: "numeric-int"
                },
                {
                    header: "가지급수령일", name: "befpay_date", width: 100, align: "center", mask: "date-ymd",
                    editable: { type: "text", maxlength: 10, width: 100, validate: { rule: "dateISO" } }
                },
                { header: "정산금액", name: "settle_amt", width: 80, align: "right", mask: "numeric-int" },
                { header: "청구번호", name: "biztrip_no", width: 100, editable: { type: "hidden" }, align: "center" },
                //{ header: "확정일자", name: "appr_date", width: 70, align: "center", mask: "date-ymd" },
                { header: "비고", name: "rmk", width: 150, editable: { type: "text", width: 156 } },
                { header: "근태중복", name: "dup_chk", width: 200 },
                { header: "등록일시", name: "wdate", width: 150, align: "center" },
                { name: "biztrip_tp", editable: { type: "hidden" }, hidden: true },
                { name: "emp_no", editable: { type: "hidden" }, hidden: true },
                { name: "dept_cd", editable: { type: "hidden" }, hidden: true },
                { name: "grade_cd", editable: { type: "hidden" }, hidden: true },
                { name: "caruse_yn", editable: { type: "hidden" }, hidden: true },
                { name: "appr_yn", hidden: true },
                { name: "appr_yn2", hidden: true },
                { name: "_edit_yn2", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_BIZTRIP_DEST", query: "HRM_3030_5", title: "방문기관",
            caption: true, height: 80, pager: false, show: true, selectable: true, number: true, key: true,
            editable: { multi: true, bind: "_edit_yn2", focus: "dest_nm", validate: true },
            element: [
                {
                    header: "방문기관", name: "dest_nm", width: 200,
                    editable: { type: "text", maxlength: 30, width: 380 }
                },
                { name: "biztrip_no", editable: { type: "hidden" }, hidden: true },
                { name: "dest_seq", editable: { type: "hidden" }, hidden: true },
                { name: "_edit_yn2", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_BIZTRIP_WORK", query: "HRM_3030_6", title: "세부일정",
            caption: true, height: 80, pager: false, show: true, selectable: true, number: true, key: true,
            editable: { multi: true, bind: "_edit_yn2", focus: "str_date", validate: true },
            element: [
                {
                    header: "일자", name: "work_date", width: 60, align: "center",
                    editable: { type: "text", width: 110, validate: { rule: "dateISO" } }, mask: "date-ymd"
                },
                {
                    header: "방문처", name: "work_dest", width: 100,
                    editable: { type: "text", maxlength: 25, width: 174 }
                },
                {
                    header: "주요수행업무내용", name: "work_desc", width: 200,
                    editable: { type: "text", maxlength: 40, width: 342 }
                },
                { name: "biztrip_no", editable: { type: "hidden" }, hidden: true },
                { name: "work_seq", editable: { type: "hidden" }, hidden: true },
                { name: "_edit_yn2", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_BIZTRIP_PAY", query: "HRM_3030_7", title: "가지급금 신청",
            caption: true, height: 23, pager: false, show: true, selectable: true, number: true, key: true,
            editable: { multi: true, bind: "_edit_yn2", focus: "trip_area", validate: true },
            element: [
                {
                    header: "지역구분", name: "trip_area", width: 60, align: "center",
                    format: { type: "select", data: { memory: "지역" }, width: 84 },
                    editable: { type: "select", data: { memory: "지역" }, width: 84 }
                },
                {
                    header: "정액경비+숙박비($)", name: "local_amt", width: 100, align: "right",
                    editable: { type: "text", width: 146 }, mask: "numeric-int"
                },
                {
                    header: "환율", name: "exch_rate", width: 100, align: "right",
                    editable: { type: "hidden", width: 146 }, mask: "numeric-float"
                },
                {
                    header: "일수", name: "trip_days", width: 100, align: "right",
                    editable: { type: "text", width: 146 }, mask: "numeric-int"
                },
                {
                    header: "비율", name: "rqst_rate", width: 100, align: "right",
                    editable: { type: "hidden", width: 146 }, mask: "numeric-float"
                },
                {
                    header: "신청금액(￦)", name: "rqst_amt", width: 100, align: "right",
                    editable: { type: "hidden", width: 146 }, mask: "numeric-int"
                },
                { header: "비고", name: "rmk", width: 200, editable: { type: "text", maxlength: 100, width: 288 } },
                { name: "biztrip_no", editable: { type: "hidden" }, hidden: true },
                { name: "pay_seq", editable: { type: "hidden" }, hidden: true },
                { name: "_edit_yn2", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_BIZTRIP_EXP", query: "HRM_3030_8", title: "정산서 산정 내역",
            caption: true, height: "100%", pager: false, show: true, selectable: true, number: true, key: true,
            editable: { multi: true, bind: "_edit_yn2", focus: "use_date", validate: true },
            element: [
                {
                    header: "기간(From)", name: "str_date", width: 80, align: "center",
                    editable: { type: "text", width: 110, validate: { rule: "dateISO" } }, mask: "date-ymd"
                },
                {
                    header: "기간(To)", name: "end_date", width: 80, align: "center",
                    editable: { type: "text", width: 110, validate: { rule: "dateISO" } }, mask: "date-ymd"
                },
                {
                    header: "비용구분", name: "exp_tp", width: 60, align: "center",
                    format: { type: "select", data: { memory: "비용" }, width: 82 },
                    editable: { type: "select", data: { memory: "비용" }, width: 82 }
                },
                {
                    header: "통화", name: "curr_cd", width: 60, align: "center",
                    editable: { type: "select", data: { memory: "통화" }, width: 82 }
                },
                {
                    header: "금액", name: "local_amt", width: 100, align: "right",
                    editable: { type: "text", width: 136 }, mask: "numeric-float"
                },
                {
                    header: "환율", name: "exch_rate", width: 100, align: "right",
                    editable: { type: "text", width: 136 }, mask: "numeric-float"
                },
                {
                    header: "환산금액", name: "use_amt", width: 100, align: "right",
                    editable: { type: "hidden", width: 136 }, mask: "numeric-int"
                },
                { header: "상세내역", name: "rmk", width: 250, editable: { type: "text", width: 328 } },
                { name: "biztrip_no", editable: { type: "hidden" }, hidden: true },
                { name: "exp_seq", editable: { type: "hidden" }, hidden: true },
                { name: "_edit_yn2", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_BIZTRIP_EXP_SUM", query: "HRM_3030_8_3", type: "TABLE", title: "",
            width: "100%", show: true, selectable: true, caption: false,
            content: {
                height: 25, width: { label: 50, field: 50 },
                row: [
                    {
                        element: [
                            { header: true, value: "정액경비", format: { type: "label" } },
                            { name: "amt1", format: { type: "text", width: 150 }, mask: "numeric-int" },
                            { header: true, value: " 숙박비", format: { type: "label" } },
                            { name: "amt2", format: { type: "text", width: 150 }, mask: "numeric-int" },
                            { header: true, value: " 교통비", format: { type: "label" } },
                            { name: "amt3", format: { type: "text", width: 150 }, mask: "numeric-int" },
                            { header: true, value: " 기타경비", format: { type: "label" } },
                            { name: "amt4", format: { type: "text", width: 150 }, mask: "numeric-int" }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_FILE", query: "HRM_3030_9", title: "첨부파일",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            editable: { multi: true, bind: "_edit_yn2", focus: "file_desc", validate: true },
            element: [
				{ header: "파일명", name: "file_nm", width: 250 },
				{ header: "다운로드", name: "download", width: 60, align: "center", format: { type: "link", value: "다운로드" } },
				{ header: "설명", name: "file_desc", width: 300, editable: { type: "text" } },
                { name: "file_path", hidden: true },
                { name: "file_id", hidden: true, editable: { type: "hidden" } },
                { name: "_edit_yn2", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_BIZTRIP_CHK", query: "HRM_COMMON_BIZTRIP_CHK", show: false,
            element: [
				{ name: "rtn_cd" },
                { name: "err_msg" }
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
                { type: "GRID", id: "grdList_EMP", offset: 8 },
                { type: "GRID", id: "grdData_BIZTRIP", offset: 8 },
                { type: "GRID", id: "grdData_BIZTRIP_DEST", offset: 8 },
                { type: "GRID", id: "grdData_BIZTRIP_WORK", offset: 8 },
                { type: "GRID", id: "grdData_BIZTRIP_PAY", offset: 8 },
                { type: "GRID", id: "grdData_BIZTRIP_EXP", offset: 8 },
                { type: "FORM", id: "frmData_BIZTRIP_EXP_SUM", offset: 8 },
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
        var args = { targetid: "lyrMenu", element: "검토", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "계획", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "정산", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "규정", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_BIZTRIP_DEST", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_BIZTRIP_DEST", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_BIZTRIP_WORK", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_BIZTRIP_WORK", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_BIZTRIP_EXP", element: "정액", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_BIZTRIP_EXP", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_BIZTRIP_EXP", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_FILE", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_FILE", element: "삭제", event: "click", handler: processButton };
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
        var args = { targetid: "grdData_BIZTRIP", grid: true, event: "rowselecting", handler: processRowSelecting };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_BIZTRIP", grid: true, event: "rowselected", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_BIZTRIP", grid: true, event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_BIZTRIP", grid: true, event: "itemdblclick", handler: processItemdblClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_BIZTRIP", grid: true, event: "rowdblclick", handler: processRowdblClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_BIZTRIP", grid: true, event: "itemkeyup", handler: processItemKeyup };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_BIZTRIP_PAY", grid: true, event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_BIZTRIP_EXP", grid: true, event: "itemchanged", handler: processItemchanged };
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
            processInsert(param);
            break;
        case "삭제":
            processDelete(param);
            break;
        case "저장":
            processSave({});
            break;
        case "정액":
            processInsert({ object: "lyrMenu_BIZTRIP_EXP" });
            var trip_area = gw_com_api.getValue("grdData_BIZTRIP_PAY", 1, "trip_area", true);
            gw_com_api.setValue("grdData_BIZTRIP_EXP", "selected", "use_date", gw_com_api.getValue("grdData_BIZTRIP", "selected", "to_date", true), true);
            gw_com_api.setValue("grdData_BIZTRIP_EXP", "selected", "exp_tp", "정액", true);
            gw_com_api.setValue("grdData_BIZTRIP_EXP", "selected", "local_amt", (trip_area == "갑지" ? 80 : (trip_area == "을지" ? 50 : 60)), true);
            break;
        case "검토":
            if (gw_com_api.getSelectedRow("grdData_BIZTRIP", false) == null) return;
            if (!checkUpdatable({ check: true })) return;
            if (!checkStat()) {
                gw_com_api.messageBox([{ text: "결재중이거나 완료된 내역입니다." }]);
                return;
            }
            changeStat(param);
            break;
        case "계획":
        case "정산":
            if (gw_com_api.getSelectedRow("grdData_BIZTRIP", false) == null) {
                gw_com_api.messageBox([{ text: "결재 대상을 선택하세요." }]);
                return;
            }
            if (!checkUpdatable({ check: true })) return;
            processBatch(param);
            break;
        case "규정":
            var url = "/Files/HRM/BizManual/해외출장.htm";
            window.open(url, "해외출장규정", "scrollbars=yes,resizable=yes,menubar=no,toolbar=no,width=600,height=300");
            break;
        case "닫기":
            v_global.process.handler = processClose;
            if (!checkUpdatable({})) return;
            processClose({});
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
    } else if (param.object == "grdData_BIZTRIP") {
        var fr_date = "";
        var to_date = "";
        switch (param.element) {
            case "fr_date":
                if (gw_com_api.unMask(param.value.current, "date-ymd") > gw_com_api.getValue(param.object, param.row, "to_date", true))
                    gw_com_api.setValue(param.object, param.row, "to_date", gw_com_api.unMask(param.value.current, "date-ymd"), true);
                break;
            case "to_date":
                if (gw_com_api.unMask(param.value.current, "date-ymd") < gw_com_api.getValue(param.object, param.row, "fr_date", true))
                    gw_com_api.setValue(param.object, param.row, "fr_date", gw_com_api.unMask(param.value.current, "date-ymd"), true);
                break;
            case "befpay_amt":
                calcAmt2();
                break;
        }
    } else if (param.object == "grdData_BIZTRIP_PAY") {
        switch (param.element) {
            case "trip_area":
                var val = (param.value.current == "갑지" ? 180 : (param.value.current == "을지" ? 120 : 150));
                gw_com_api.setValue(param.object, param.row, "local_amt", val, true, true, true);
                //calcAmt1();
                break;
            case "local_amt":
            case "exch_rate":
            case "trip_days":
            case "rqst_rate":
                calcAmt1();
                break;
        }
    } else if (param.object == "grdData_BIZTRIP_EXP") {
        switch (param.element) {
            case "str_date":
                var val = gw_com_api.unMask(param.value.current, "date-ymd");
                if (val > gw_com_api.getValue(param.object, param.row, "end_date", true))
                    gw_com_api.setValue(param.object, param.row, "end_date", val, true);
                break;
            case "end_date":
                var val = gw_com_api.unMask(param.value.current, "date-ymd");
                if (val < gw_com_api.getValue(param.object, param.row, "str_date", true))
                    gw_com_api.setValue(param.object, param.row, "str_date", val, true);
                break;
            case "exp_tp":
                // 정액경비는 USD로 고정
                if (param.value.current == "F10")
                    gw_com_api.setValue(param.object, param.row, "curr_cd", "USD", true, true, true);
                break;
            case "curr_cd":
                if (gw_com_api.getValue(param.object, param.row, "exp_tp", true) == "F10" && param.value.current != "USD")
                    gw_com_api.setValue(param.object, param.row, param.element, "USD", true);
                else
                    if (param.value.current == "KRW")
                        gw_com_api.setValue(param.object, param.row, "exch_rate", 1, true, false, true);
                break;
            case "local_amt":
            case "exch_rate":
                calcAmt2();
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
    switch (param.element) {
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
        case "proj_no":
            args = {
                type: "PAGE", page: "DLG_PROJECT", title: "Project",
                width: 700, height: 400, locate: ["center", "top"], open: true,
                data: {
                    proj_no: gw_com_api.getValue(
                        v_global.event.object,
                        v_global.event.row,
                        v_global.event.element,
                        (v_global.event.type == "GRID") ? true : false)
                }
            };
            break;
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

/*
    v_global.event.type = param.type;
    v_global.event.object = param.object;
    v_global.event.row = param.row;
    v_global.event.element = param.element;
    if (param.object == "grdData_BIZTRIP") {
        if (param.element == "proj_no") {
            var args = {
                type: "PAGE", page: "DLG_PROJECT", title: "Project",
                width: 700, height: 400, locate: ["center", "top"], open: true
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = {
                    page: "DLG_PROJECT",
                    param: {
                        ID: gw_com_api.v_Stream.msg_openedDialogue,
                        data: {
                            proj_no: gw_com_api.getValue(
                                v_global.event.object,
                                v_global.event.row,
                                v_global.event.element,
                                (v_global.event.type == "GRID") ? true : false)
                        }
                    }
                };
                gw_com_module.dialogueOpen(args);
            }
        }
    }
*/

}
//----------
function processRowdblClick(param) {

    switch (param.object) {
        case "grdData_BIZTRIP":
            popupChk(param);
            break;
    }
}
//----------
function processItemKeyup(param) {

    if (param.object == "grdData_BIZTRIP") {
        if (param.element == "proj_no") {
            if (event.keyCode == 46) {
                gw_com_api.setValue(param.object, param.row, param.element, "", true);
            }
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

    gw_com_api.selectRow("grdData_BIZTRIP", v_global.process.current.master, true, false);

}
//----------
function processRetrieve(param) {
    
    var args = { target: [{ type: "FORM", id: "frmOption" }] };
    if (!gw_com_module.objValidate(args)) return;

    var args;
    if (param.object == "EMP") {
        args = {
            source: {
                type: "FORM", id: "frmOption",
                element: [
                    { name: "emp_no", argument: "arg_emp_no" }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_EMP", select: true }
            ]
        };
    } else if (param.object == "grdData_BIZTRIP") {
        args = {
            source: {
                type: param.type, id: param.object, row: "selected",
                element: [
                    { name: "biztrip_no", argument: "arg_biztrip_no" }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_BIZTRIP_DEST"},// select: true },
                { type: "GRID", id: "grdData_BIZTRIP_WORK" },// select: true },
                { type: "GRID", id: "grdData_BIZTRIP_PAY" },// select: true },
                { type: "GRID", id: "grdData_BIZTRIP_EXP" },// select: true },
                { type: "FORM", id: "frmData_BIZTRIP_EXP_SUM" },
                { type: "GRID", id: "grdData_FILE" }//, select: true }
            ],
            handler: {
                complete: processRetrieveEnd,
                param: param
            },
            key: param.key
        };
    } else {
        args = {
            source: {
                type: "FORM", id: "frmOption", hide: true,
                element: [
                    { name: "dept_cd", argument: "arg_dept_cd" },
                    { name: "emp_no", argument: "arg_emp_no" },
                    { name: "ymd_fr", argument: "arg_ymd_fr" },
                    { name: "ymd_to", argument: "arg_ymd_to" },
                    { name: "appr_yn", argument: "arg_appr_yn" },
                    { name: "appr_stat", argument: "arg_appr_stat" }
                ],
                argument: [
                    { name: "arg_biztrip_tp", value: v_global.logic.biztrip_tp }
                ],
                remark: [
                    { element: [{ name: "dept_nm" }] },
                    { element: [{ name: "emp_nm" }] },
                    { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }] },
                    { element: [{ name: "appr_yn" }] },
                    { element: [{ name: "appr_stat" }] }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_BIZTRIP", select: true }
            ],
            clear: [
                { type: "GRID", id: "grdData_BIZTRIP_DEST" },
                { type: "GRID", id: "grdData_BIZTRIP_WORK" },
                { type: "GRID", id: "grdData_BIZTRIP_PAY" },
                { type: "GRID", id: "grdData_BIZTRIP_EXP" },
                { type: "FORM", id: "frmData_BIZTRIP_EXP_SUM" },
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

    var args;
    var obj = param.object.substring(8);

    // pre insert
    switch (obj) {
        case "":
            if (!checkUpdatable({ check: true })) return;
            break;
        case "BIZTRIP_DEST":
        case "BIZTRIP_WORK":
        case "BIZTRIP_PAY":
        case "BIZTRIP_EXP":
        case "FILE":
            if (gw_com_api.getSelectedRow("grdData_BIZTRIP", false) == null) return;
            if (!checkStat()) {
                gw_com_api.messageBox([{ text: "결재중이거나 완료된 내역은 수정할 수 없습니다." }]);
                return;
            }
            break;
    }

    switch (obj) {
        case "":
            args = {
                targetid: "grdData_BIZTRIP", edit: true, updatable: true,
                data: [
                    { name: "emp_no", value: gw_com_api.getValue("grdList_EMP", "selected", "emp_no", true) },
                    { name: "dept_cd", value: gw_com_api.getValue("grdList_EMP", "selected", "dept_cd", true) },
                    { name: "grade_cd", value: gw_com_api.getValue("grdList_EMP", "selected", "grade_cd", true) },
                    { name: "biztrip_tp", value: v_global.logic.biztrip_tp },
                    { name: "fr_date", value: gw_com_api.getDate("", { day: 1 }) },
                    { name: "to_date", value: gw_com_api.getDate("", { day: 1 }) }
                ],
                clear: [
                    { type: "GRID", id: "grdData_BIZTRIP_DEST" },
                    { type: "GRID", id: "grdData_BIZTRIP_WORK" },
                    { type: "GRID", id: "grdData_BIZTRIP_PAY" },
                    { type: "GRID", id: "grdData_BIZTRIP_EXP" },
                    { type: "FORM", id: "frmData_BIZTRIP_EXP_SUM" },
                    { type: "GRID", id: "grdData_FILE" }
                ]
            };
            break;
        case "BIZTRIP_DEST":
            args = {
                targetid: "grdData_" + obj, edit: true, updatable: true,
                data: [
                    { name: "biztrip_no", value: gw_com_api.getValue("grdData_BIZTRIP", "selected", "biztrip_no", true) },
                    { name: "dest_seq", rule: "INCREMENT", value: 1 }
                ]
            };
            break;
        case "BIZTRIP_WORK":
            args = {
                targetid: "grdData_" + obj, edit: true, updatable: true,
                data: [
                    { name: "biztrip_no", value: gw_com_api.getValue("grdData_BIZTRIP", "selected", "biztrip_no", true) },
                    { name: "work_seq", rule: "INCREMENT", value: 1 }
                ]
            };
            break;
        case "BIZTRIP_PAY":
            args = {
                targetid: "grdData_" + obj, edit: true, updatable: true,
                data: [
                    { name: "biztrip_no", value: gw_com_api.getValue("grdData_BIZTRIP", "selected", "biztrip_no", true) },
                    { name: "pay_seq", rule: "INCREMENT", value: 1 },
                    { name: "trip_area", value: "갑지" },
                    { name: "local_amt", value: 180 },
                    { name: "exch_rate", value: 1000 },
                    { name: "rqst_rate", value: 0.8 }
                ]
            };
            break;
        case "BIZTRIP_EXP":
            args = {
                targetid: "grdData_" + obj, edit: true, updatable: true,
                data: [
                    { name: "biztrip_no", value: gw_com_api.getValue("grdData_BIZTRIP", "selected", "biztrip_no", true) },
                    { name: "exp_seq", rule: "INCREMENT", value: 1 },
                    { name: "str_date", rule: "COPY", row: "prev" },
                    { name: "end_date", rule: "COPY", row: "prev" },
                    { name: "curr_cd", rule: "COPY", row: "prev" },
                    { name: "exch_rate", rule: "COPY", row: "prev" }
                ]
            };
            break;
        case "FILE":
            args = {
                type: "PAGE", page: "DLG_FileUpload", title: "파일 업로드",
                width: 650, height: 140, locate: ["center", "bottom"], open: true,
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                args = {
                    page: args.page,
                    param: {
                        ID: gw_com_api.v_Stream.msg_openedDialogue,
                        data: {
                            type: "HRM_BIZTRIP_" + v_global.logic.biztrip_tp,
                            key: gw_com_api.getValue("grdData_BIZTRIP", "selected", "biztrip_no", true)
                        }
                    }
                };
                gw_com_module.dialogueOpen(args);
            }
            return;
            break;
        default:
            return;
            break;
    }
    gw_com_module.gridInsert(args);

    // post insert
    switch (obj) {
        case "":
            $.ajaxSetup({ async: false });
            processInsert({ object: "lyrMenu_BIZTRIP_PAY" })
            $.ajaxSetup({ async: true });
            gw_com_api.setFocus("grdData_BIZTRIP", "selected", "trip_dest", true);
            break;
    }
    
}
//----------
function processDelete(param) {

    var args;
    var obj = (param.object == undefined ? "" : param.object.substring(8));

    // pre delete
    switch (obj) {
        case "":
            break;
        case "BIZTRIP_DEST":
        case "BIZTRIP_WORK":
        case "BIZTRIP_PAY":
        case "BIZTRIP_EXP":
        case "FILE":
            if (gw_com_api.getSelectedRow("grdData_BIZTRIP", false) == null) return;
            if (!checkStat()) {
                gw_com_api.messageBox([{ text: "결재중이거나 완료된 내역은 수정할 수 없습니다." }]);
                return;
            }
            break;
    }
    
    switch (obj) {
        case "":
            var status = checkCRUD({});
            if (status == "initialize" || status == "create") {
                args = {
                    targetid: "grdData_BIZTRIP", row: "selected", remove: true,
                    clear: [
                        { type: "GRID", id: "grdData_BIZTRIP_DEST" },
                        { type: "GRID", id: "grdData_BIZTRIP_WORK" },
                        { type: "GRID", id: "grdData_BIZTRIP_PAY" },
                        { type: "GRID", id: "grdData_BIZTRIP_EXP" },
                        { type: "GRID", id: "grdData_FILE" }
                    ]
                }
            } else {
                v_global.process.handler = processRemove;
                gw_com_api.messageBox([{ text: "REMOVE" }], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO");
                return;
            }
            break;
        default:
            args = { targetid: "grdData_" + obj, row: "selected", select: true }
            break;
    }
    gw_com_module.gridDelete(args);

    // post delete
    switch (obj) {
        case "BIZTRIP_EXP":
            calcAmt2();
            break;
    }

}
//----------
function processRemove(param) {

    if (gw_com_api.getSelectedRow("grdData_BIZTRIP", false) == null) return;
    var args = {
        url: "COM",
        target: [
            {
                type: "GRID", id: "grdData_BIZTRIP",
                key: [{ row: "selected", element: [{ name: "biztrip_no" }] }]
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

    if (!checkStat()) {
        gw_com_api.messageBox([{ text: "결재중이거나 완료된 내역은 수정할 수 없습니다." }]);
        return;
    }

    if (gw_com_api.getRowCount("grdData_BIZTRIP_DEST") < 1) {
        gw_com_api.messageBox([{ text: "방문기관을 입력하세요." }]);
        return;
    } else if (gw_com_api.getRowCount("grdData_BIZTRIP_WORK") < 1) {
        gw_com_api.messageBox([{ text: "세부일정을 입력하세요." }]);
        return;
    }

    var args = {
        target: [
			{ type: "GRID", id: "grdData_BIZTRIP" },
            { type: "GRID", id: "grdData_BIZTRIP_DEST" },
            { type: "GRID", id: "grdData_BIZTRIP_WORK" },
            { type: "GRID", id: "grdData_BIZTRIP_PAY" },
            { type: "GRID", id: "grdData_BIZTRIP_EXP" },
            { type: "GRID", id: "grdData_FILE" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    //일자 체크
    var chk = true;
    var err_msg = "";
    var ids = gw_com_api.getRowIDs("grdData_BIZTRIP_EXP");
    $.each(ids, function () {
        var biztrip_tp = v_global.logic.biztrip_tp;
        var emp_no = gw_com_api.getValue("grdData_BIZTRIP", "selected", "emp_no", true);
        var fr_date = gw_com_api.getValue("grdData_BIZTRIP_EXP", this, "str_date", true);
        var to_date = gw_com_api.getValue("grdData_BIZTRIP_EXP", this, "end_date", true);
        err_msg = checkBiztripDate(biztrip_tp, emp_no, fr_date, to_date);
        if (err_msg != "") {
            chk = false;
            gw_com_api.selectRow("grdData_BIZTRIP_EXP", this, true, false);
            gw_com_api.setFocus("grdData_BIZTRIP_EXP", this, "str_date", true);
            return false;
        }
    });
    if (!chk) {
        gw_com_api.messageBox([{ text: err_msg }]);
        return;
    }

    //var ids = gw_com_api.getRowIDs("grdData_BIZTRIP_EXP");
    //var err = false;
    //$.each(ids, function () {
    //    if (gw_com_api.getValue("grdData_BIZTRIP_EXP", this, "str_date", true) == "") {
    //        gw_com_api.selectRow("grdData_BIZTRIP_EXP", this, true, false);
    //        gw_com_api.setError(true, "grdData_BIZTRIP_EXP", this, "str_date", true);
    //        err = true;
    //    }
    //    if (gw_com_api.getValue("grdData_BIZTRIP_EXP", this, "end_date", true) == "") {
    //        gw_com_api.selectRow("grdData_BIZTRIP_EXP", this, true, false);
    //        gw_com_api.setError(true, "grdData_BIZTRIP_EXP", this, "end_date", true);
    //        err = true;
    //    }
    //    if (err) return false;
    //});
    //if(err) return false;

    args.handler = {
        success: successSave,
        param: param
    };
    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    processRetrieve({ key: response });

}
//----------
function processBatch(param) {

    var opt = param.element == "계획" ? "" : "2";
    if (opt == "2" && gw_com_api.getValue("grdData_BIZTRIP", "selected", "appr_yn", true) != "2") {
        gw_com_api.messageBox([{ text: "[계획] 승인이 완료되지 않았습니다." }]);
        return;
    } else if ($.inArray(gw_com_api.getValue("grdData_BIZTRIP", "selected", "appr_yn" + opt, true), ["0", "1", "2"]) >= 0) {
        gw_com_api.messageBox([{ text: "결재중이거나 완료된 내역은 재상신 할 수 없습니다." }]);
        return;
    //} else if (opt == "2" && gw_com_api.getRowCount("grdData_FILE") < 1) {
    //    gw_com_api.messageBox([{ text: "환율표/영수증을 첨부하세요." }]);
    //    return;
    }
    var frmID = opt == "" ? "HR03_3" : "HR03_4";
    var ref_key1 = gw_com_api.getValue("grdData_BIZTRIP", "selected", "biztrip_no", true);
    var args = {
        url: "COM",
        procedure: "GoodHRM_IF.dbo.SP_IF_ApprovalRequest",
        input: [
            { name: "frm_id", value: frmID, type: "varchar" },
            { name: "ref_key1", value: ref_key1, type: "varchar" },
            { name: "ref_key2", value: "", type: "varchar" },
            { name: "ref_key3", value: "", type: "varchar" },
            { name: "ref_key4", value: "", type: "varchar" },
            { name: "ref_key5", value: "", type: "varchar" },
            { name: "emp_no", value: gw_com_module.v_Session.EMP_NO, type: "varchar" }
        ],
        output: [
            { name: "appr_id", type: "int" },
            { name: "err_msg", type: "varchar" }
        ],
        handler: {
            success: successBatch,
            param: { frmID: frmID, ref_key1: ref_key1 }
        }
    };
    gw_com_module.callProcedure(args);

}
//----------
function successBatch(response, param) {

    $.ajaxSetup({ async: false });
    var key = [{
        QUERY: "HRM_3030_2",
        KEY: [
            { NAME: "apprdock_no", VALUE: param.ref_key1 }
        ]
    }]
    processRetrieve({ key: key });
    $.ajaxSetup({ async: true });

    var args = "FormID=" + param.frmID + "&ApprID=" + response.VALUE[0];
    var url = "http://gw.apsystems.co.kr/CoviWeb/Gate/FormLink4HD.aspx?" + args;    // Live
    //var url = "http://gw.devdwc.co.kr/CoviWeb/Gate/FormLink4HD.aspx?" + args;     // Test
    window.open(url, "전자결재", "scrollbars=no,resizable=yes,menubar=no,toolbar=no,width=1200,height=630");

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
function processRestore(param) {

    var args = { targetid: "grdData_BIZTRIP", row: "selected" };
    gw_com_module.gridRestore(args);

}
//----------
function checkUpdatable(param) {

    var args = {
        check: param.check,
        target: [
            { type: "GRID", id: "grdData_BIZTRIP" },
            { type: "GRID", id: "grdData_BIZTRIP_DEST" },
            { type: "GRID", id: "grdData_BIZTRIP_WORK" },
            { type: "GRID", id: "grdData_BIZTRIP_PAY" },
            { type: "GRID", id: "grdData_BIZTRIP_EXP" },
            { type: "GRID", id: "grdData_FILE" }
        ],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function checkCRUD(param) {

    return gw_com_api.getCRUD("grdData_BIZTRIP", "selected", true);

}
//----------
function checkStat() {

    return ($.inArray(gw_com_api.getValue("grdData_BIZTRIP", "selected", "appr_yn2", true), ["0", "1", "2"]) >= 0 ? false : true);

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
function calcAmt1() {

    var val = Number(gw_com_api.getValue("grdData_BIZTRIP_PAY", "selected", "local_amt", true))
            * Number(gw_com_api.getValue("grdData_BIZTRIP_PAY", "selected", "exch_rate", true))
            * Number(gw_com_api.getValue("grdData_BIZTRIP_PAY", "selected", "trip_days", true))
            * Number(gw_com_api.getValue("grdData_BIZTRIP_PAY", "selected", "rqst_rate", true));
    gw_com_api.setValue("grdData_BIZTRIP_PAY", "selected", "rqst_amt", val, true, true, true);

}
//----------
function calcAmt2() {

    var ids = gw_com_api.getRowIDs("grdData_BIZTRIP_EXP");
    var exp_sum = 0, use_amt = 0, settle_amt = 0;
    var sum_amt1 = 0, sum_amt2 = 0, sum_amt3 = 0, sum_amt4 = 0;

    $.each(ids, function () {
        use_amt = Number(gw_com_api.getValue("grdData_BIZTRIP_EXP", this, "local_amt", true))
                * Number(gw_com_api.getValue("grdData_BIZTRIP_EXP", this, "exch_rate", true));
        gw_com_api.setValue("grdData_BIZTRIP_EXP", this, "use_amt", use_amt, true, true, true);
        exp_sum += use_amt;

        switch (gw_com_api.getValue("grdData_BIZTRIP_EXP", this, "exp_tp", true)) {
            case "F10": //정액경비
                sum_amt1 += use_amt;
                break;
            case "S10": //숙박비
                sum_amt2 += use_amt;
                break;
            case "T10": //교통비
                sum_amt3 += use_amt;
                break;
            case "Z10": //기타경비
                sum_amt4 += use_amt;
                break;
        }

    });
    settle_amt = exp_sum - Number(gw_com_api.getValue("grdData_BIZTRIP", "selected", "befpay_amt", true));

    gw_com_api.setValue("grdData_BIZTRIP", "selected", "exp_sum", exp_sum, true, true, true);
    gw_com_api.setValue("grdData_BIZTRIP", "selected", "settle_amt", settle_amt, true, true, false);

    gw_com_api.setValue("frmData_BIZTRIP_EXP_SUM", 1, "amt1", sum_amt1, false, true, true);
    gw_com_api.setValue("frmData_BIZTRIP_EXP_SUM", 1, "amt2", sum_amt2, false, true, true);
    gw_com_api.setValue("frmData_BIZTRIP_EXP_SUM", 1, "amt3", sum_amt3, false, true, true);
    gw_com_api.setValue("frmData_BIZTRIP_EXP_SUM", 1, "amt4", sum_amt4, false, true, true);

}
//----------
function changeStat(param) {

    var opt = gw_com_api.getValue("grdData_BIZTRIP", "selected", "appr_yn", true) == "2" ? "2" : "";
    var stat = gw_com_api.getValue("grdData_BIZTRIP", "selected", "appr_yn" + opt, true);
    if (stat != "4") return;
    var qry = {
        query: "HRM_3030_2",
        row: [{
            crud: "U",
            column: [
                { name: "biztrip_no", value: gw_com_api.getValue("grdData_BIZTRIP", "selected", "biztrip_no", true) },
                { name: "appr_yn" + opt, value: "5" },
                { name: "check_emp", value: gw_com_module.v_Session.EMP_NO },
                { name: "check_dt", value: "" }
            ]
        }]
    };
    var argParam = [qry];
    var args = {
        user: gw_com_module.v_Session.USR_ID,
        param: argParam,
        handler: {
            success: successSave,
            param: param
        }
    };
    gw_com_module.objSave(args);

}
//----------
function checkBiztripDate(biztrip_tp, emp_no, fr_date, to_date) {

    $.ajaxSetup({ async: false });
    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_biztrip_tp", value: biztrip_tp },
                { name: "arg_emp_no", value: emp_no },
                { name: "arg_date_fr", value: fr_date },
                { name: "arg_date_to", value: to_date }
            ]
        },
        target: [
            { type: "GRID", id: "grdList_BIZTRIP_CHK" }
        ]
    };
    gw_com_module.objRetrieve(args);
    $.ajaxSetup({ async: true });

    var rtn_msg = "";
    if (gw_com_api.getRowCount("grdList_BIZTRIP_CHK") > 0)
        rtn_msg = gw_com_api.getValue("grdList_BIZTRIP_CHK", 1, "err_msg", true);

    return rtn_msg;

}
//----------
function popupChk(param) {

    var args = {
        type: "PAGE", page: "HRM_3091", title: "중복 정보",
        width: 950, height: 370, locate: ["center", "top"], scroll: true, open: true
    };
    if (gw_com_module.dialoguePrepare(args) == false) {
        var args = {
            page: "HRM_3091",
            param: {
                ID: gw_com_api.v_Stream.msg_openedDialogue,
                data: {
                    emp_no: gw_com_api.getValue(param.object, param.row, "emp_no", true),
                    emp_nm: gw_com_api.getValue(param.object, param.row, "emp_nm", true),
                    fr_date: gw_com_api.getValue(param.object, param.row, "fr_date", true),
                    to_date: gw_com_api.getValue(param.object, param.row, "to_date", true)
                }
            }
        };
        gw_com_module.dialogueOpen(args);
    }

}
//----------
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
                                var status = checkCRUD({});
                                if (status == "initialize" || status == "create")
                                    processDelete({});
                                else if (status == "update")
                                    processRestore({});

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
                    case "DLG_FileUpload":
                        args.data = {
                            type: "HRM_BIZTRIP_" + v_global.logic.biztrip_tp,
                            key: gw_com_api.getValue("grdData_BIZTRIP", "selected", "biztrip_no", true)
                        };
                        break;
                    case "DLG_PROJECT":
                        args.data = {
                            proj_no: gw_com_api.getValue(
                                v_global.event.object,
                                v_global.event.row,
                                v_global.event.element,
                                (v_global.event.type == "GRID") ? true : false)
                        }
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
                    case "HRM_3091":
                        args.data = {
                            emp_no: gw_com_api.getValue("grdData_BIZTRIP", "selected", "emp_no", true),
                            emp_nm: gw_com_api.getValue("grdData_BIZTRIP", "selected", "emp_nm", true),
                            fr_date: gw_com_api.getValue("grdData_BIZTRIP", "selected", "fr_date", true),
                            to_date: gw_com_api.getValue("grdData_BIZTRIP", "selected", "to_date", true)
                        };
                        break;
                }
                gw_com_module.streamInterface(args);
            } break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                switch (param.from.page) {
                    case "DLG_FileUpload":
                        if (param.data != undefined)
                            processRetrieve({ object: "grdData_BIZTRIP", type: "GRID", row: "selected" });
                        break;
                    case "DLG_PROJECT":
                        if (param.data != undefined) {
                            gw_com_api.setValue(
                                v_global.event.object,
                                v_global.event.row,
                                v_global.event.element,
                                param.data.proj_no,
                                (v_global.event.type == "GRID") ? true : false);
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
                            gw_com_api.setValue(
                                                v_global.event.object,
                                                v_global.event.row,
                                                "dept_nm",
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
                }
                closeDialogue({ page: param.from.page });
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//