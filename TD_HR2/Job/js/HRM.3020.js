//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 휴가신청
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
				{ type: "PAGE", name: "근태구분", query: "DDDW_HRM_ATT" },
				{ type: "PAGE", name: "휴가구분", query: "DDDW_HRM_HOLI" },
                {
                    type: "INLINE", name: "시간",
                    data: [
						{ title: "-", value: "" },
						{ title: "09:00", value: "0900" },
						{ title: "10:00", value: "1000" },
						{ title: "11:00", value: "1100" },
						{ title: "12:00", value: "1200" },
						{ title: "13:00", value: "1300" },
						{ title: "14:00", value: "1400" },
						{ title: "15:00", value: "1500" }
                    ]
                },
                {
                    type: "INLINE", name: "오전오후",
                    data: [
                        { title: "오전", value: "AM" },
                        { title: "오후", value: "PM" },
                        { title: "-", value: "" }
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

            var info = Query.getHoliBaseDate({ year: gw_com_api.getYear() });
            gw_com_api.setValue("frmOption", 1, "holi_year", (gw_com_api.getDate() < info.ymd_fr ? gw_com_api.getYear() - 1 : info.default_year), false, false, false);
            gw_com_api.setValue("frmOption", 1, "base_holi_date", gw_com_api.Mask(info.default_ymd_fr, "date-ymd") + " ~ " + gw_com_api.Mask(info.default_ymd_to, "date-ymd"));
            gw_com_api.setValue("frmOption", 1, "emp_no", gw_com_module.v_Session.EMP_NO);
            gw_com_api.setValue("frmOption", 1, "emp_nm", gw_com_module.v_Session.USR_NM);
            processRetrieve({ object: "EMP" });
            processRetrieve({});
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
                { name: "상신", value: "상신", icon: "기타" },
                { name: "규정", value: "관련규정", icon: "Act" },
                { name: "닫기", value: "닫기" }
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
            editable: { focus: "supp_nm", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "holi_year", label: { title: "기준연도 :" },
                                editable: { type: "text", size: 10, maxlength: 4, validate: { rule: "required" } }
                            },
                            {
                                name: "base_holi_date", label: { title: "휴가시작일 :" },
                                editable: { type: "text" }, hidden: true
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
                { name: "grade_cd", hidden: true },
                { name: "mobile_no", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_HOLIDAY_Y", query: "HRM_3020_1", title: "연간 사용일수",
            caption: true, height: "100%", pager: false, show: true, selectable: true,
            element: [
                { header: "휴가구분", name: "holi_nm", width: 80, align: "center" },
				{ header: "전년이월", name: "bholi_day", width: 80, align: "right", mask: "numeric-float" },
				{ header: "발생일수", name: "issue_day", width: 80, align: "right", mask: "numeric-float" },
				{ header: "신청일수", name: "rqst_day", width: 80, align: "right", mask: "numeric-float" },
				{ header: "사용일수", name: "used_day", width: 80, align: "right", mask: "numeric-float" },
				{ header: "잔여일수", name: "rest_day", width: 80, align: "right", mask: "numeric-float" }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_HOLIDAY", query: "HRM_3020_2", type: "TABLE", title: "휴가신청",
            show: true, selectable: true, fixed: true, caption: true,
            editable: { bind: "select", focus: "holi_cd", validate: true },
            content: {
                width: { label: 50, field: 50 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "휴가구분", format: { type: "label" } },
                            {
                                name: "holi_cd",
                                format: { type: "select", data: { memory: "휴가구분" }, width: 100 },
                                editable: {
                                    type: "select", data: { memory: "휴가구분" }, validate: { rule: "required", message: "휴가구분" },
                                    change: [{ name: "att_cd", memory: "근태구분", key: ["holi_cd"] }], width: 100
                                }
                            },
                            { name: "holi_nm", editable: { type: "hidden", width: 200 }, hidden: true },
                            { header: true, value: "근태구분", format: { type: "label" } },
                            {
                                name: "att_cd",
                                format: { type: "select", data: { memory: "근태구분" }, width: 136 },
                                editable: {
                                    type: "select", data: { memory: "근태구분", key: ["holi_cd"] },
                                    validate: { rule: "required", message: "근태구분" }, width: 136
                                }
                            },
                            { name: "att_nm", editable: { type: "hidden", width: 200 }, hidden: true },
                            { header: true, value: "신청일", format: { type: "label" } },
                            { name: "rqst_dt", editable: { type: "hidden", width: 120 } },
                            { header: true, value: "결재자", format: { type: "label" } },
                            { name: "appr_emp_nm", editable: { type: "hidden", width: 120 } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "시작일", format: { type: "label" } },
                            {
                                name: "holi_date", mask: "date-ymd",
                                editable: { type: "text", maxlength: 10, width: 100 }, validate: { rule: "required", message: "휴가기간(시작일)" }
                            },
                            { header: true, value: "종료일", format: { type: "label" } },
                            {
                                name: "last_date", mask: "date-ymd",
                                editable: { type: "text", maxlength: 10, width: 100 }, validate: { rule: "required", message: "휴가기간(종료일)" }
                            },
                            { header: true, value: "긴급연락처", format: { type: "label" } },
                            { name: "tel_no", editable: { type: "text", maxlength: 40, width: 136, validate: { rule: "required", message: "긴급연락처" } } },
                            { header: true, value: "결재상태", format: { type: "label" } },
                            { name: "appr_yn_nm", editable: { type: "hidden", width: 120 } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "일수", format: { type: "label" } },
                            { name: "holi_day", editable: { type: "hidden" } },
                            { header: true, value: "오전/오후", format: { type: "label" } },
                            {
                                name: "ampm",
                                format: { type: "select", data: { memory: "오전오후" }, width: 60 },
                                editable: { type: "select", data: { memory: "오전오후" }, width: 60 }
                            },
                            { name: "ampm_nm", editable: { type: "hidden" }, hidden: true },
                            { header: true, value: "사유", format: { type: "label" } },
                            {
                                name: "rqst_rmk", style: { colspan: 3 },
                                editable: { type: "text", maxlength: 100, width: 428, validate: { rule: "required", message: "사유" } }
                            },
                            { name: "emp_no", editable: { type: "hidden" }, hidden: true },
                            //{ name: "holi_cd", editable: { type: "hidden"}, hidden: true },
                            { name: "appr_yn", editable: { type: "hidden" }, hidden: true },
                            { name: "appr_type", editable: { type: "hidden" }, hidden: true },
                            { name: "dept_cd", editable: { type: "hidden" }, hidden: true }
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
            targetid: "grdList_HOLIDAY_CHK", query: "HRM_3020_2", show: false,
            element: [
                { name: "emp_no", hidden: true },
                { name: "holi_cd", hidden: true },
                { name: "holi_date", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_HOLIDAY", query: "HRM_3020_3", title: "휴가 사용 현황",
            caption: true, height: "100%", pager: false, show: true, selectable: true, number: true,
            //editable: { multi: true, bind: "select", validate: true },
            element: [
                { header: "휴가구분", name: "holi_nm", width: 80, align: "center" },
                { header: "근태구분", name: "att_nm", width: 80, align: "center" },
				{ header: "시작일", name: "holi_date", editable: { type: "hidden" }, width: 80, align: "center", mask: "date-ymd" },
				{ header: "종료일", name: "last_date", width: 80, align: "center", mask: "date-ymd" },
				{ header: "오전/오후", name: "ampm_nm", width: 60, align: "center" },
				{ header: "결재상태", name: "appr_yn_nm", width: 80, align: "center" },
				{ header: "결재자", name: "appr_emp_nm", width: 80, align: "center" },
				{ header: "긴급연락처", name: "tel_no", width: 100 },
				{ header: "사유", name: "rqst_rmk", width: 180 },
                { name: "emp_no", editable: { type: "hidden" }, hidden: true },
                { name: "holi_cd", editable: { type: "hidden" }, hidden: true },
                { name: "appr_yn", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_FILE", query: "HRM_3020_4", title: "첨부파일",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            editable: { multi: true, bind: "select", focus: "file_desc", validate: true },
            element: [
				{ header: "파일명", name: "file_nm", width: 250 },
				{ header: "다운로드", name: "download", width: 60, align: "center", format: { type: "link", value: "다운로드" } },
				{ header: "설명", name: "file_desc", width: 300, editable: { type: "text" } },
                { name: "file_path", hidden: true },
                { name: "file_id", hidden: true, editable: { type: "hidden" } }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_CALC_DATE", query: "HRM_COMMON_HOLIDAY_CHK", show: false,
            element: [
				{ name: "rtn_val" },
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
                { type: "GRID", id: "grdList_HOLIDAY_Y", offset: 8 },
                { type: "FORM", id: "frmData_HOLIDAY", offset: 8 },
                { type: "GRID", id: "grdData_HOLIDAY", offset: 8 },
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
        var args = { targetid: "lyrMenu", element: "상신", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "규정", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_FILE", element: "파일추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_FILE", element: "파일삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: closeOption };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_HOLIDAY", grid: true, event: "rowselected", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmData_HOLIDAY", event: "itemchanged", handler: processItemchanged };
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
        case "상신":
            if (!checkManipulate({})) return;
            if (!checkUpdatable({ check: true })) return;
            if (!checkStat({})) {
                gw_com_api.messageBox([{ text: "결재중이거나 완료된 내역은 재상신 할 수 없습니다." }]);
                return;
            }
            // 첨부파일체크(공가,경조사, 병가)
            //if ($.inArray(gw_com_api.getValue("frmData_HOLIDAY", 1, "holi_cd"), ["400", "500"]) >= 0 || gw_com_api.getValue("frmData_HOLIDAY", 1, "att_cd") == "611") {
            // 공가만 체크하도록 수정
            if (gw_com_api.getValue("frmData_HOLIDAY", 1, "holi_cd") == "400") {
                if (gw_com_api.getRowCount("grdData_FILE") < 1) {
                    gw_com_api.messageBox([{ text: "증빙자료를 첨부하세요." }]);
                    return;
                }
            }

            //var args = {
            //    url: "COM",
            //    procedure: "dbo.SP_IF_ApprovalRequest",
            //    input: [
            //        { name: "frm_id", value: "HR01", type: "varchar" },
            //        { name: "ref_key1", value: gw_com_api.getValue("frmData_HOLIDAY", 1, "emp_no"), type: "varchar" },
            //        { name: "ref_key2", value: gw_com_api.getValue("frmData_HOLIDAY", 1, "holi_cd"), type: "varchar" },
            //        { name: "ref_key3", value: gw_com_api.getValue("frmData_HOLIDAY", 1, "holi_date"), type: "varchar" },
            //        { name: "ref_key4", value: "", type: "varchar" },
            //        { name: "ref_key5", value: "", type: "varchar" },
            //        { name: "emp_no", value: gw_com_module.v_Session.EMP_NO, type: "varchar" }

            //    ],
            //    output: [
            //        { name: "appr_id", type: "int" },
            //        { name: "err_msg", type: "varchar" }
            //    ],
            //    handler: {
            //        success: successBatch,
            //        param: { frmID: "HR01" }
            //    }
            //};
            //gw_com_module.callProcedure(args);

            v_global.logic.frm_id = "HR01";
            var args = {
                type: "PAGE", page: "DLG_EDIT_APPR", title: "결재상신",
                width: 1100, height: 530, scroll: true, open: true, control: true, locate: ["center", "center"]
            };

            if (gw_com_module.dialoguePrepare(args) == false) {
                args.param = {
                    ID: gw_com_api.v_Stream.msg_openedDialogue,
                    data: {
                        frm_id: v_global.logic.frm_id,
                        ref_key1: gw_com_api.getValue("frmData_HOLIDAY", 1, "emp_no"),
                        ref_key2: gw_com_api.getValue("frmData_HOLIDAY", 1, "holi_cd"),
                        ref_key3: gw_com_api.getValue("frmData_HOLIDAY", 1, "holi_date")
                    }
                };
                gw_com_module.dialogueOpen(args);
            }

            break;
        case "규정":
            var url = "/Files/HRM/BizManual/휴가규정.htm";
            window.open(url, "휴가규정", "scrollbars=yes,resizable=yes,menubar=no,toolbar=no,width=760,height=600");
            break;
        case "닫기":
            v_global.process.handler = processClose;
            if (!checkUpdatable({})) return;
            processClose({});
            break;
        case "파일추가":
            if (!checkManipulate({})) return;
            if (!checkUpdatable({ check: true })) return;
            if (!checkStat({})) return;
            processInsert(param);
            break;
        case "파일삭제":
            if (!checkManipulate({})) return;
            processDelete(param);
            break;
    }

}
//----------
function processItemchanged(param) {
    
    if (param.object == "frmOption") {
        if (param.element == "holi_year") {
            var info = Query.getHoliBaseDate({ year: param.value.current });
            gw_com_api.setValue(param.object, param.row, "base_holi_date", gw_com_api.Mask(info.ymd_fr, "date-ymd") + " ~ " + gw_com_api.Mask(info.ymd_to, "date-ymd"));
        }
    } else if (param.object == "frmData_HOLIDAY") {
        switch (param.element) {
            case "holi_date":
                if (gw_com_api.unMask(param.value.current, "date-ym") < gw_com_api.getDate()) {
                    gw_com_api.setValue("frmData_HOLIDAY", 1, "appr_type", "After");
                } else {
                    gw_com_api.setValue("frmData_HOLIDAY", 1, "appr_type", "Before");
                }
                var val = gw_com_api.unMask(param.value.current, "date-ym");
                if (val > gw_com_api.getValue(param.object, param.row, "last_date")) {
                    gw_com_api.setValue(param.object, param.row, "last_date", param.value.current);
                }
                break;
            case "last_date":
                var val = gw_com_api.unMask(param.value.current, "date-ym");
                if (val < gw_com_api.getValue(param.object, param.row, "holi_date")) {
                    gw_com_api.setValue(param.object, param.row, "holi_date", val);
                }
                break;
        }

        if (param.element == "holi_cd") {
            gw_com_api.setValue(param.object, param.row, "holi_day", 0);
        } else {
            // 휴가일수
            var msg = $.inArray(param.element, ["att_cd", "holi_date", "last_date"]) >= 0 ? true : false;
            var arg1 = gw_com_api.getValue(param.object, param.row, "att_cd");
            var arg2 = gw_com_api.getValue(param.object, param.row, "emp_no");
            var arg3 = gw_com_api.getValue(param.object, param.row, "holi_date");
            var arg4 = gw_com_api.getValue(param.object, param.row, "last_date")
            var val = getHolidyCnt(arg1, arg2, arg3, arg4, msg);
            switch (val) {
                case "-212":
                case "-103":
                case "-101":
                    val = 0;
                    break;
                default:
                    val = val < 0 ? -1 * val : val;
            }
            gw_com_api.setValue(param.object, param.row, "holi_day", val);
        }


        // 반차 처리
        if ($.inArray(gw_com_api.getValue(param.object, param.row, "att_cd"), ["212", "413", "414"]) < 0 &&
            //gw_com_api.getValue(param.object, param.row, "att_cd") != "212" &&
            gw_com_api.getValue(param.object, param.row, "ampm") != "") {
            gw_com_api.setValue(param.object, param.row, "ampm", "");
        }
    }

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
    } else if (param.object == "grdData_HOLIDAY") {
        changeDW_STAT(gw_com_api.getValue(param.object, param.row, "appr_yn", true));
        args = {
            source: {
                type: param.type, id: param.object, row: "selected",
                element: [
                    { name: "emp_no", argument: "arg_emp_no" },
                    { name: "holi_cd", argument: "arg_holi_cd" },
                    { name: "holi_date", argument: "arg_holi_date" }
                ]
            },
            target: [
                { type: "FORM", id: "frmData_HOLIDAY", edit: true },
                { type: "GRID", id: "grdData_FILE", edit: true }
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
                    { name: "emp_no", argument: "arg_emp_no" },
                    { name: "holi_year", argument: "arg_holi_year" }
                ],
                remark: [
                    //{ element: [{ name: "holi_year" }] },
                    { element: [{ name: "base_holi_date" }] },
                    //{ element: [{ name: "emp_no" }] },
                    { element: [{ name: "emp_nm" }] }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_HOLIDAY_Y", select: true },
                { type: "GRID", id: "grdData_HOLIDAY", select: true }
            ],
            clear: [
                { type: "FORM", id: "frmData_HOLIDAY" },
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

    if (param.element == "파일추가") {
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
                        type: "HRM_HOLI",
                        key: gw_com_api.getValue("frmData_HOLIDAY", 1, "emp_no"),
                        subkey: gw_com_api.getValue("frmData_HOLIDAY", 1, "holi_cd") + "-" + gw_com_api.getValue("frmData_HOLIDAY", 1, "holi_date")
                    }
                }
            };
            gw_com_module.dialogueOpen(args);
        }
    } else {
        changeDW_STAT("new");
        var args = {
            targetid: "frmData_HOLIDAY", edit: true, updatable: true,
            data: [
                { name: "emp_no", value: gw_com_module.v_Session.EMP_NO },
                { name: "holi_date", value: gw_com_api.getDate("", { day: 1 }) },
                { name: "last_date", value: gw_com_api.getDate("", { day: 1 }) },
                { name: "holi_day", value: 1 },
                { name: "holis_time", value: "0900" },
                { name: "dept_cd", value: gw_com_module.v_Session.DEPT_CD },
                { name: "ampm", value: "" },
                { name: "tel_no", value: gw_com_api.getValue("grdList_EMP", 1, "mobile_no", true) }

            ]
        };
        gw_com_module.formInsert(args);
    }

}
//----------
function processDelete(param) {

    if (!checkStat({})) {
        gw_com_api.messageBox([{ text: "결재중이거나 완료된 내역은 삭제할 수 없습니다." }]);
        return;
    }

    var args;
    if (param.element == "파일삭제") {
        args = { targetid: "grdData_FILE", row: "selected", select: true }
        gw_com_module.gridDelete(args);
    } else {
        var status = checkCRUD({});
        if (status == "initialize" || status == "create") {
            //args = {
            //    target: [
            //        { type: "FORM", id: "frmData_HOLIDAY" }
            //    ]
            //};
            //gw_com_module.objClear(args);
            processRetrieve({ object: "grdData_HOLIDAY", row: "selected", type: "GRID" });
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
                type: "FORM", id: "frmData_HOLIDAY",
                key: { element: [{ name: "emp_no" }, { name: "holi_cd" }, { name: "holi_date" }] }
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
        gw_com_api.messageBox([{ text: "결재중이거나 완료된 내역은 수정할 수 없습니다." }]);
        return;
    }
    var args = {
        url: "COM",
        target: [
			{ type: "FORM", id: "frmData_HOLIDAY" },
            { type: "GRID", id: "grdData_FILE" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    // 중복 체크
    if (gw_com_api.getCRUD("frmData_HOLIDAY") == "create") {
        if (!checkStat({ type: "holi_dup" })) {
            gw_com_api.messageBox([{ text: "해당일자에 휴가가 등록되어 있습니다." }]);
            return false;
        }
    }

    // 반차일 경우 오전/오후 필수입력
    if ($.inArray(gw_com_api.getValue("frmData_HOLIDAY", 1, "att_cd"), ["212", "413", "414"]) >= 0 &&
        gw_com_api.getValue("frmData_HOLIDAY", 1, "ampm") == "") {
        gw_com_api.setError(true, "frmData_HOLIDAY", this, "ampm", false);
        gw_com_api.messageBox([{ text: "오전/오후는 필수입력입니다." }]);
        return false;
    } else {
        if (gw_com_api.getValue("frmData_HOLIDAY", 1, "ampm") != "") {
            gw_com_api.setValue("frmData_HOLIDAY", 1, "ampm", "");
        }
    }

    var arg1 = gw_com_api.getValue("frmData_HOLIDAY", 1, "att_cd");
    var arg2 = gw_com_api.getValue("frmData_HOLIDAY", 1, "emp_no");
    var arg3 = gw_com_api.getValue("frmData_HOLIDAY", 1, "holi_date");
    var arg4 = gw_com_api.getValue("frmData_HOLIDAY", 1, "last_date");

    // 휴가일수 체크
    var val = getHolidyCnt(arg1, arg2, arg3, arg4, true);
    //if (val < 0 && val != -1) return false; //잔여일수(val == -1) 체크 해제
    if ($.inArray(val, ["-212", "-103", "-101"]) >= 0) return false;

    args.handler = {
        success: successSave,
        param: param
    };
    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    response[0].QUERY = "HRM_3020_3";
    processRetrieve({ key: response });

}
//----------
function successBatch(response, param) {

    $.ajaxSetup({ async: false });
    var key = [{
        QUERY: "HRM_3020_3",
        KEY: [
            { NAME: "emp_no", VALUE: gw_com_api.getValue("frmData_HOLIDAY", 1, "emp_no") },
            { NAME: "holi_cd", VALUE: gw_com_api.getValue("frmData_HOLIDAY", 1, "holi_cd") },
            { NAME: "holi_date", VALUE: gw_com_api.getValue("frmData_HOLIDAY", 1, "holi_date") },
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
function checkUpdatable(param) {

    var args = {
        check: param.check,
        target: [
            { type: "FORM", id: "frmData_HOLIDAY" },
            { type: "GRID", id: "grdData_FILE" }
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

    return gw_com_api.getCRUD("frmData_HOLIDAY");

}
//----------
function checkStat(param) {

    if (param.type == "holi_dup") {
        $.ajaxSetup({ async: false });
        var args = {
            source: {
                type: "INLINE",
                argument: [
                    { name: "arg_emp_no", value: gw_com_api.getValue("frmData_HOLIDAY", 1, "emp_no") },
                    { name: "arg_holi_cd", value: gw_com_api.getValue("frmData_HOLIDAY", 1, "holi_cd") },
                    { name: "arg_holi_date", value: gw_com_api.getValue("frmData_HOLIDAY", 1, "holi_date") }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_HOLIDAY_CHK", edit: true }
            ]
        };
        gw_com_module.objRetrieve(args);
        $.ajaxSetup({ async: true });
        if (gw_com_api.getRowCount("grdList_HOLIDAY_CHK") > 0)
            return false;
        else
            return true;
    } else {
        return ($.inArray(gw_com_api.getValue("frmData_HOLIDAY", 1, "appr_yn"), ["", "9"]) == -1 ? false : true);
    }

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
function getHolidyCnt(arg_type, arg_emp_no, arg_date_fr, arg_date_to, msg) {

    if (arg_type == null || arg_type == "" || arg_date_fr == "" || arg_date_to == "") {
        return 0;
    }

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_type", value: arg_type },
                { name: "arg_emp_no", value: arg_emp_no },
                { name: "arg_sdate", value: arg_date_fr },
                { name: "arg_edate", value: arg_date_to }
            ]
        },
        target: [
            { type: "GRID", id: "grdList_CALC_DATE" }
        ]
    };
    $.ajaxSetup({ async: false });
    gw_com_module.objRetrieve(args);
    $.ajaxSetup({ async: true });

    var err_msg = gw_com_api.getValue("grdList_CALC_DATE", 1, "err_msg", true);
    if (msg && err_msg != "") {
        gw_com_api.messageBox([{ text: err_msg }]);
    }

    if (gw_com_api.getRowCount("grdList_CALC_DATE") == 1)
        return gw_com_api.getValue("grdList_CALC_DATE", 1, "rtn_val", true).replace(".0", "");
    else
        return 0;

}
//----------
function changeDW_STAT(stat) {

    $.ajaxSetup({ async: false });
    //----------
    var args = $.extend(true, {}, v_global.logic.frm);
    //----------
    switch (stat) {
        case "":
        case "9":
            args.editable.focus = "tel_no";
            args.content.row[0].element[1].hidden = true;
            args.content.row[0].element[2].hidden = false;
            args.content.row[0].element[4].hidden = false;
            args.content.row[0].element[5].hidden = true;
            args.content.row[1].element[1].editable.type = "hidden";
            args.content.row[1].element[1].editable.width = 200;    // date picker 감추기 위해...
            args.content.row[1].element[3].editable.type = "hidden";
            args.content.row[1].element[3].editable.width = 200;    // date picker 감추기 위해...
            args.content.row[1].element[5].editable.type = "text";    // 긴급연락처
            args.content.row[2].element[3].hidden = false;
            args.content.row[2].element[4].hidden = true;
            args.content.row[2].element[6].editable.type = "text";    // 사유
            break;
        case "0":
        case "1":
        case "2":
            args.editable.focus = "";
            args.content.row[0].element[1].hidden = true;
            args.content.row[0].element[2].hidden = false;
            args.content.row[0].element[4].hidden = true;
            args.content.row[0].element[5].hidden = false;
            args.content.row[1].element[1].editable.type = "hidden";
            args.content.row[1].element[1].editable.width = 200;        // date picker 감추기 위해...
            args.content.row[1].element[3].editable.type = "hidden";
            args.content.row[1].element[3].editable.width = 200;        // date picker 감추기 위해...
            args.content.row[1].element[5].editable.type = "hidden";    // 긴급연락처
            args.content.row[2].element[3].hidden = true;
            args.content.row[2].element[4].hidden = false;
            args.content.row[2].element[6].editable.type = "hidden";    // 사유
            break;
    }
    //----------
    gw_com_module.formCreate(args);
    //=====================================================================================
    var args = {
        target: [
            { type: "FORM", id: "frmData_HOLIDAY", offset: 8 }
        ]
    };
    gw_com_module.objResize(args);
    //=====================================================================================
    var args = { targetid: "frmData_HOLIDAY", event: "itemchanged", handler: processItemchanged };
    gw_com_module.eventBind(args);
    //----------
    $.ajaxSetup({ async: true });
    //----------
}
//----------
var Query = {
    getHoliBaseDate: function (param) {
        var rtn;
        var args = {
            request: "PAGE",
            url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
                    "?QRY_ID=HRM_COMMON_HOLI_BASE_DATE" +
                    "&QRY_COLS=ymd_fr,ymd_to,default_year,default_ymd_fr,default_ymd_to" +
                    "&CRUD=R" +
                    "&arg_year=" + param.year,
            handler_success: successRequest
        };
        //=================== async : false ========================
        $.ajaxSetup({ async: false });
        //----------
        gw_com_module.callRequest(args);
        function successRequest(data) {
            $.each(data, function () {
                rtn = {
                    ymd_fr: this.DATA[0],
                    ymd_to: this.DATA[1],
                    default_year: this.DATA[2],
                    default_ymd_fr: this.DATA[3],
                    default_ymd_to: this.DATA[4]
                };
            });
        }
        //----------
        $.ajaxSetup({ async: true });
        //=================== async : true ========================
        return rtn
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
                            type: "HRM_HOLI",
                            key: gw_com_api.getValue("frmData_HOLIDAY", 1, "emp_no"),
                            subkey: gw_com_api.getValue("frmData_HOLIDAY", 1, "holi_cd") + "-" + gw_com_api.getValue("frmData_HOLIDAY", 1, "holi_date")
                        };
                        break;
                    case "DLG_EDIT_APPR":
                        args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                        args.data = {
                            frm_id: v_global.logic.frm_id,
                            ref_key1: gw_com_api.getValue("frmData_HOLIDAY", 1, "emp_no"),
                            ref_key2: gw_com_api.getValue("frmData_HOLIDAY", 1, "holi_cd"),
                            ref_key3: gw_com_api.getValue("frmData_HOLIDAY", 1, "holi_date")
                        }
                        break;
                }
                gw_com_module.streamInterface(args);
            } break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                switch (param.from.page) {
                    case "DLG_FileUpload":
                        if (param.data != undefined)
                            processRetrieve({ object: "grdData_HOLIDAY", type: "GRID" });
                        break;
                    case "DLG_EDIT_APPR":
                        if (param.data != undefined) {
                            var key = [
                                {
                                    KEY: [
                                        { NAME: "emp_no", VALUE: param.data.ref_key1 },
                                        { NAME: "holi_cd", VALUE: param.data.ref_key2 },
                                        { NAME: "holi_date", VALUE: param.data.ref_key3 }
                                    ],
                                    QUERY: "HRM_3020_3"
                                }
                            ];
                            processRetrieve({ key: key });
                        }
                        break;
                }
                closeDialogue({ page: param.from.page });
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//