//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 외근정산
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
                    type: "INLINE", name: "증명구분",
                    data: [
                        { title: "A", value: "A" },
                        { title: "B", value: "B" },
                        { title: "C", value: "C" }
                    ]
                },
                {
                    type: "INLINE", name: "왕복",
                    data: [
                        { title: "왕복", value: "1" },
                        { title: "편도", value: "0" }
                    ]
                }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);

        //----------
        function start() {
            v_global.logic.biztrip_tp = "A";

            gw_job_process.UI();
            gw_job_process.procedure();
            gw_com_module.startPage();

            gw_com_api.setValue("frmOption", 1, "trip_year", gw_com_api.getYear());
            gw_com_api.setValue("frmOption", 1, "emp_no", gw_com_module.v_Session.EMP_NO);
            gw_com_api.setValue("frmOption", 1, "emp_nm", gw_com_module.v_Session.USR_NM);

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
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" },
                { name: "저장", value: "저장" },
                { name: "요청", value: "검토요청", icon: "기타" },
                //{ name: "취소", value: "검토취소", icon: "기타" },
                { name: "상신", value: "상신", icon: "기타" },
                { name: "닫기", value: "닫기" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_BIZTRIP_D", type: "FREE",
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
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true, remark: "lyrRemark2",
            editable: { focus: "trip_year", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "trip_year", label: { title: "외근연도 :" },
                                editable: { type: "text", size: 10, maxlength: 4, validate: { rule: "required" } }
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
            targetid: "grdList_EMP", query: "HRM_3030_1", title: "외근자 정보",
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
            targetid: "grdData_BIZTRIP", query: "HRM_3030_2", title: "외근현황",
            caption: true, height: 165, show: true, selectable: true, number: true,// multi: true, checkrow: true,
            editable: { master: true, bind: "_edit_yn", focus: "work_date", validate: true },
            element: [
                {
                    header: "기간(From)", name: "fr_date", width: 70, align: "center", mask: "date-ymd",
                    editable: { type: "text", maxlength: 10, width: 104, validate: { rule: "required" } }
                },
                {
                    header: "기간(To)", name: "to_date", width: 70, align: "center", mask: "date-ymd",
                    editable: { type: "text", maxlength: 10, width: 104, validate: { rule: "required" } }
                },
                {
                    header: "보고서 제목", name: "trip_desc", width: 80,
                    editable: { type: "text", width: 170, maxlength: 100, validate: { rule: "required" } }
                },
                { header: "정산금액", name: "exp_sum", width: 50, align: "right", mask: "numeric-int" },
                { header: "결재상태", name: "appr_yn_nm", width: 50, align: "center" },
                { header: "검토자", name: "check_emp_nm", width: 60, align: "center" },
                { header: "결재자", name: "appr_emp_nm", width: 60, align: "center" },
                { header: "청구상태", name: "expadj_yn_nm", width: 50, align: "center", hidden: true },
                { header: "청구일자", name: "expadj_date", width: 70, align: "center", mask: "date-ymd", hidden: true },
                { header: "청구번호", name: "expadj_slip", width: 70, editable: { type: "hidden" }, align: "center", hidden: true },
                //{ header: "차량번호", name: "car_no", width: 70, editable: { type: "text", width: 96 }, align: "center" },
                //{
                //    header: "가지급금", name: "befpay_amt", width: 80, mask: "numeric-int",
                //    editable: { type: "text", width: 86 }, align: "right", hidden: true
                //},
                { header: "청구번호", name: "biztrip_no", width: 70, editable: { type: "hidden" }, align: "center" },
                { name: "biztrip_tp", editable: { type: "hidden" }, hidden: true },
                { name: "emp_no", editable: { type: "hidden" }, hidden: true },
                { name: "dept_cd", editable: { type: "hidden" }, hidden: true },
                { name: "grade_cd", editable: { type: "hidden" }, hidden: true },
                { name: "caruse_yn", editable: { type: "hidden" }, hidden: true },
                { name: "rmk", editable: { type: "textarea" }, hidden: true },
                { name: "appr_yn", hidden: true },
                { name: "expadj_yn", hidden: true },
                { name: "_edit_yn", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_BIZTRIP_D", query: "HRM_3030_3", title: "경비내역",
            caption: true, height: "100%", pager: false, show: true, selectable: true, number: true, key: true,
            editable: { multi: true, bind: "_edit_yn", focus: "str_loc", validate: true },
            element: [
                {
                    header: "일자", name: "str_date", width: 100, align: "center",
                    editable: { type: "text", width: 106, validate: { rule: "dateISO" } }, mask: "date-ymd"
                },
                {
                    header: "방문기관", name: "trip_dest", width: 100,
                    editable: { type: "text", width: 106, maxlength: 20, validate: { rule: "required" } }
                },
                {
                    header: "소요시간", name: "cal_time", width: 50, align: "right",
                    editable: { type: "text", width: 56 }, mask: "numeric-int"
                },
                {
                    header: "업무내용", name: "trip_desc", width: 150,
                    editable: { type: "text", width: 156, maxlength: 100 }
                },
                {
                    header: "Project No.", name: "proj_no", width: 100,
                    editable: { type: "text", width: 104, validate: { rule: "required" } }, align: "center", mask: "search"
                },
                { header: "출발지", name: "str_loc", width: 80, editable: { type: "text", width: 86 } },
                { header: "도착지", name: "end_loc", width: 80, editable: { type: "text", width: 86 } },
                {
                    header: "왕복", name: "return_loc", width: 50, align: "center",
                    format: { type: "select", data: { memory: "왕복" }, width: 56 },
                    editable: { type: "select", data: { memory: "왕복" }, width: 56 }
                },
                {
                    header: "거리(㎞)", name: "drive_km", width: 60, align: "right",
                    editable: { type: "text", width: 64 }, mask: "numeric-int"
                },
                {
                    header: "교통비", name: "trans_amt", width: 60, align: "right",
                    editable: { type: "hidden", width: 64 }, mask: "numeric-int"
                },
                {
                    header: "통행료", name: "toll_amt", width: 60, align: "right",
                    editable: { type: "text", width: 64 }, mask: "numeric-int"
                },
                {
                    header: "주차료", name: "park_amt", width: 60, align: "right",
                    editable: { type: "text", width: 64 }, mask: "numeric-int"
                },
                {
                    header: "식대", name: "food_amt", width: 60, align: "right",
                    editable: { type: "text", width: 64 }, mask: "numeric-int"
                },
                {
                    header: "숙박비", name: "stay_amt", width: 60, align: "right",
                    editable: { type: "text", width: 64 }, mask: "numeric-int"
                },
                {
                    header: "합계", name: "total_amt", width: 60, align: "right",
                    editable: { type: "hidden" }, mask: "numeric-int"
                },
                {
                    header: "비고", name: "rmk", width: 150,
                    editable: { type: "text", width: 156, maxlength: 100 }
                },
                { name: "biztrip_no", editable: { type: "hidden" }, hidden: true },
                { name: "item_seq", editable: { type: "hidden" }, hidden: true },
                { name: "end_date", editable: { type: "hidden" }, hidden: true },
                { name: "_edit_yn", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_BIZTRIP_D_SUM", query: "HRM_3030_3_2", type: "TABLE", title: "",
            width: "100%", show: true, selectable: true, caption: false,
            content: {
                height: 25, width: { label: 50, field: 50 },
                row: [
                    {
                        element: [
                            { header: true, value: "교통비", format: { type: "label" } },
                            { name: "trans_amt", format: { type: "text", width: 150 }, mask: "numeric-int" },
                            { header: true, value: "통행료", format: { type: "label" } },
                            { name: "toll_amt", format: { type: "text", width: 150 }, mask: "numeric-int" },
                            { header: true, value: "주차료", format: { type: "label" } },
                            { name: "park_amt", format: { type: "text", width: 150 }, mask: "numeric-int" },
                            { header: true, value: "식대", format: { type: "label" } },
                            { name: "food_amt", format: { type: "text", width: 150 }, mask: "numeric-int" },
                            { header: true, value: "숙박비", format: { type: "label" } },
                            { name: "stay_amt", format: { type: "text", width: 150 }, mask: "numeric-int" },
                            { header: true, value: "합계", format: { type: "label" } },
                            { name: "total_amt", format: { type: "text", width: 150 }, mask: "numeric-int" }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_BIZTRIP_rmk", query: "HRM_3030_4", type: "TABLE", title: "비고",
            width: "100%", show: true, selectable: true, caption: false,
            editable: { bind: "_edit_yn", validate: true },
            content: {
                height: 25, width: { label: 80, field: 720 },
                row: [
                    {
                        element: [
                            { header: true, value: "비고", format: { type: "label" } },
                            {
                                name: "rmk",
                                format: { type: "textarea", rows: 4, width: 1030 },
                                editable: { type: "textarea", rows: 4, width: 1030, maxlength: 250 }
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
            targetid: "grdData_FILE", query: "HRM_3030_9", title: "첨부파일",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            editable: { multi: true, bind: "_edit_yn", focus: "file_desc", validate: true },
            element: [
				{ header: "파일명", name: "file_nm", width: 250 },
				{ header: "다운로드", name: "download", width: 60, align: "center", format: { type: "link", value: "다운로드" } },
				{ header: "설명", name: "file_desc", width: 300, editable: { type: "text" } },
                { name: "file_path", hidden: true },
                { name: "file_id", hidden: true, editable: { type: "hidden" } },
                { name: "_edit_yn", hidden: true }
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
                { type: "GRID", id: "grdData_BIZTRIP_D", offset: 8 },
                { type: "FORM", id: "frmData_BIZTRIP_D_SUM", offset: 8 },
                { type: "FORM", id: "frmData_BIZTRIP_rmk", offset: 8 },
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
        var args = { targetid: "lyrMenu", element: "요청", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "상신", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_BIZTRIP_D", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_BIZTRIP_D", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_FILE", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_FILE", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
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
        //=====================================================================================
        var args = { targetid: "grdData_BIZTRIP_D", grid: true, event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_BIZTRIP_D", grid: true, event: "itemdblclick", handler: processItemdblClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_BIZTRIP_D", grid: true, event: "itemkeyup", handler: processItemKeyup };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmData_BIZTRIP_rmk", event: "itemchanged", handler: processItemchanged };
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
            if (!checkStat()) {
                gw_com_api.messageBox([{ text: "결재중이거나 완료된 내역은 삭제할 수 없습니다." }]);
                return;
            }
            processDelete(param);
            //if (param.object == "lyrMenu")
            //    processRemove({});
            //else
            //    processDelete({});
            break;
        case "저장":
            processSave({});
            break;
        case "요청":
            if (gw_com_api.getSelectedRow("grdData_BIZTRIP", false) == null) return;
            if (!checkUpdatable({ check: true })) return;
            if (!checkStat()) {
                gw_com_api.messageBox([{ text: "결재중이거나 완료된 내역입니다." }]);
                return;
            }
            changeStat(param);
            break;
        case "상신":
            if (gw_com_api.getSelectedRow("grdData_BIZTRIP", false) == null) return;
            if (!checkUpdatable({ check: true })) return;
            processBatch({});
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

    if (param.object == "grdData_BIZTRIP") {
        switch (param.element) {
            case "fr_date":
                if (gw_com_api.getValue(param.object, param.row, "to_date", true) < gw_com_api.unMask(param.value.current, "date-ymd")) {
                    gw_com_api.setValue(param.object, param.row, "to_date", gw_com_api.unMask(param.value.current, "date-ymd"), true);
                }
                break;
            case "to_date":
                if (gw_com_api.getValue(param.object, param.row, "fr_date", true) > gw_com_api.unMask(param.value.current, "date-ymd")) {
                    gw_com_api.setValue(param.object, param.row, "fr_date", gw_com_api.unMask(param.value.current, "date-ymd"), true);
                }
                break;
        }
    } else if (param.object == "grdData_BIZTRIP_D") {
        switch (param.element) {
            case "str_date":
                var val = gw_com_api.unMask(param.value.current, "date-ymd");
                if (gw_com_api.getValue("grdData_BIZTRIP", "selected", "fr_date", true) > val)
                    gw_com_api.setValue("grdData_BIZTRIP", "selected", "fr_date", val, true);
                else if (gw_com_api.getValue("grdData_BIZTRIP", "selected", "to_date", true) < val)
                    gw_com_api.setValue("grdData_BIZTRIP", "selected", "to_date", val, true);
                gw_com_api.setValue(param.object, param.row, "end_date", val, true);
                break;
            case "drive_km":
            case "trans_amt":
            case "toll_amt":
            case "park_amt":
            case "food_amt":
            case "stay_amt":
                calcAmt();
                break;
        }
    } else if (param.object == "frmData_BIZTRIP_rmk") {
        gw_com_api.setValue("grdData_BIZTRIP", "selected", "rmk", param.value.current, true);
        if (!gw_com_api.getUpdatable("grdData_BIZTRIP", true))
            gw_com_api.setCRUD("grdData_BIZTRIP", "selected", "modify", true);
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
function processItemdblClick(param) {

    v_global.event.type = param.type;
    v_global.event.object = param.object;
    v_global.event.row = param.row;
    v_global.event.element = param.element;
    if (param.object == "grdData_BIZTRIP_D") {
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

}
//----------
function processItemKeyup(param) {

    if (param.object == "grdData_BIZTRIP_D") {
        if (param.element == "proj_no") {
            if (event.keyCode == 46) {
                gw_com_api.setValue(param.object, param.row, param.element, "", true);
            }
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
    } else if (param.object == "grdData_BIZTRIP") {
        args = {
            source: {
                type: param.type, id: param.object, row: "selected",
                element: [
                    { name: "biztrip_no", argument: "arg_biztrip_no" }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_BIZTRIP_D", select: true },
                { type: "FORM", id: "frmData_BIZTRIP_D_SUM" },
                { type: "FORM", id: "frmData_BIZTRIP_rmk", edit: true },
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
                    { name: "emp_no", argument: "arg_emp_no" },
                    { name: "trip_year", argument: "arg_trip_year" }
                ],
                argument:[
                    { name: "arg_biztrip_tp", value: v_global.logic.biztrip_tp },
                    { name: "arg_ymd_fr", value: "%" },
                    { name: "arg_ymd_to", value: "%" }
                ],
                remark: [
                    { element: [{ name: "trip_year" }] }//,
                    //{ element: [{ name: "emp_no" }] },
                    //{ element: [{ name: "emp_nm" }] }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_BIZTRIP", select: true }
            ],
            clear: [
                { type: "GRID", id: "grdData_BIZTRIP_D" },
                { type: "FORM", id: "frmData_BIZTRIP_D_SUM" },
                { type: "FORM", id: "frmData_BIZTRIP_rmk" },
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
    if (param.object == "lyrMenu_FILE") {
        if (gw_com_api.getSelectedRow("grdData_BIZTRIP", false) == null) return;
        if (!checkUpdatable({ check: true })) return;
        if (!checkStat()) {
            gw_com_api.messageBox([{ text: "결재중이거나 완료된 내역은 수정할 수 없습니다." }]);
            return;
        }
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
                        type: "HRM_BIZTRIP_" + v_global.logic.biztrip_tp,
                        key: gw_com_api.getValue("grdData_BIZTRIP", "selected", "biztrip_no", true)
                    }
                }
            };
            gw_com_module.dialogueOpen(args);
        }
        return;
    } else if (param.object == "lyrMenu_BIZTRIP_D") {
        if (gw_com_api.getSelectedRow("grdData_BIZTRIP", false) == null) return;
        if (!checkStat()) {
            gw_com_api.messageBox([{ text: "결재중이거나 완료된 내역은 수정할 수 없습니다." }]);
            return;
        }
        if (gw_com_api.getRowCount("grdData_BIZTRIP_D") == 0 &&
            gw_com_api.getValue("grdData_BIZTRIP", "selected", "fr_date", true) != "" &&
            gw_com_api.getValue("grdData_BIZTRIP", "selected", "to_date", true) != "") {
            var fr_date = gw_com_api.getValue("grdData_BIZTRIP", "selected", "fr_date", true);
            var to_date = gw_com_api.getValue("grdData_BIZTRIP", "selected", "to_date", true);
            var data = [];
            while (fr_date <= to_date) {
                data.push({
                    biztrip_no: gw_com_api.getValue("grdData_BIZTRIP", "selected", "biztrip_no", true),
                    str_date: fr_date,
                    end_date: fr_date
                });
                var y = fr_date.substr(0, 4);
                var m = Number(fr_date.substr(4, 2)) - 1;
                var d = fr_date.substr(6, 2)
                fr_date = gw_com_api.toTimeString(new Date(y, m, d), { day: 1 }).substr(0, 8);
            }
            args = {
                targetid: "grdData_BIZTRIP_D", edit: true, updatable: true,
                data: data
            };
            gw_com_module.gridInserts(args);
            return;
        } else {
            args = {
                targetid: "grdData_BIZTRIP_D", edit: true,
                data: [
                    { name: "biztrip_no", value: gw_com_api.getValue("grdData_BIZTRIP", "selected", "biztrip_no", true) }
                ]
            };
        }
    } else {
        if (!checkUpdatable({ check: true })) return;
        gw_com_api.selectRow("grdData_BIZTRIP", "reset");
        gw_com_module.formInsert({ targetid: "frmData_BIZTRIP_rmk" });
        args = {
            targetid: "grdData_BIZTRIP", edit: true, updatable: true,
            data: [
                { name: "emp_no", value: gw_com_api.getValue("grdList_EMP", "selected", "emp_no", true) },
                { name: "dept_cd", value: gw_com_api.getValue("grdList_EMP", "selected", "dept_cd", true) },
                { name: "grade_cd", value: gw_com_api.getValue("grdList_EMP", "selected", "grade_cd", true) },
                { name: "biztrip_tp", value: v_global.logic.biztrip_tp },
                { name: "fr_date", value: gw_com_api.getDate() },
                { name: "to_date", value: gw_com_api.getDate() }
            ],
            clear: [
                { type: "GRID", id: "grdData_BIZTRIP_D" },
                { type: "FORM", id: "frmData_BIZTRIP_D_SUM" },
                { type: "FORM", id: "frmData_BIZTRIP_rmk" },
                { type: "GRID", id: "grdData_FILE" }
            ]
        };
    }
    gw_com_module.gridInsert(args);

}
//----------
function processDelete(param) {

    var args;
    if (param.object == "lyrMenu_FILE") {
        args = { targetid: "grdData_FILE", row: "selected", select: true }
    } else if (param.object == "lyrMenu_BIZTRIP_D") {
        args = { targetid: "grdData_BIZTRIP_D", row: "selected", select: true }
    } else {
        var status = checkCRUD({});
        if (status == "initialize" || status == "create") {
            args = {
                targetid: "grdData_BIZTRIP", row: "selected", remove: true,
                clear: [
                    { type: "GRID", id: "grdData_BIZTRIP_D" }
                ]
            }
        } else {
            v_global.process.handler = processRemove;
            gw_com_api.messageBox([{ text: "REMOVE" }], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO");
            return;
        }
    }
    gw_com_module.gridDelete(args);

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

    if (gw_com_api.getRowCount("grdData_BIZTRIP_D") < 1) {
        gw_com_api.messageBox([{ text: "경비내역을 입력하세요." }]);
        return;
    }

    var args = {
        target: [
			{ type: "GRID", id: "grdData_BIZTRIP" },
            { type: "GRID", id: "grdData_BIZTRIP_D" },
            { type: "GRID", id: "grdData_FILE" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;
    
    //일자 체크
    var chk = true;
    var err_msg = "";
    var ids = gw_com_api.getRowIDs("grdData_BIZTRIP_D");
    $.each(ids, function () {
        var biztrip_tp = v_global.logic.biztrip_tp;
        var emp_no = gw_com_api.getValue("grdData_BIZTRIP", "selected", "emp_no", true);
        var fr_date = gw_com_api.getValue("grdData_BIZTRIP_D", this, "str_date", true);
        var to_date = gw_com_api.getValue("grdData_BIZTRIP_D", this, "str_date", true);
        err_msg = checkBiztripDate(biztrip_tp, emp_no, fr_date, to_date);
        if (err_msg != "") {
            chk = false;
            gw_com_api.selectRow("grdData_BIZTRIP_D", this, true, false);
            gw_com_api.setFocus("grdData_BIZTRIP_D", this, "str_date", true);
            return false;
        }
    });
    if (!chk) {
        gw_com_api.messageBox([{ text: err_msg }]);
        return;
    }

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

    if ($.inArray(gw_com_api.getValue("grdData_BIZTRIP", "selected", "appr_yn", true), ["0", "1", "2", "4"]) >= 0) {
        gw_com_api.messageBox([{ text: "결재중이거나 완료된 내역은 재상신 할 수 없습니다." }]);
        return;
    }
    var frmID = "HR03_1";
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
        QUERY: "HRM_3030_1",
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
            { type: "GRID", id: "grdData_BIZTRIP_D" },
            { type: "FORM", id: "frmData_BIZTRIP_rmk" },
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

    return ($.inArray(gw_com_api.getValue("grdData_BIZTRIP", "selected", "appr_yn", true), ["0", "1", "2", "5"]) >= 0 ? false : true);

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
function calcAmt() {

    var ids = gw_com_api.getRowIDs("grdData_BIZTRIP_D");
    var trans_amt = 0, total_amt = 0, exp_sum = 0, settle_amt = 0;
    var sum_trans_amt = 0, sum_toll_amt = 0, sum_park_amt = 0, sum_food_amt = 0, sum_stay_amt = 0;

    trans_amt = Number(gw_com_api.getValue("grdData_BIZTRIP_D", "selected", "drive_km", true)) * 260;
    total_amt = trans_amt +
                Number(gw_com_api.getValue("grdData_BIZTRIP_D", "selected", "toll_amt", true)) +
                Number(gw_com_api.getValue("grdData_BIZTRIP_D", "selected", "park_amt", true)) +
                Number(gw_com_api.getValue("grdData_BIZTRIP_D", "selected", "food_amt", true)) +
                Number(gw_com_api.getValue("grdData_BIZTRIP_D", "selected", "stay_amt", true));

    gw_com_api.setValue("grdData_BIZTRIP_D", "selected", "trans_amt", trans_amt, true, true, false);
    gw_com_api.setValue("grdData_BIZTRIP_D", "selected", "total_amt", total_amt, true, true, false);

    $.each(ids, function () {
        sum_trans_amt += Number(gw_com_api.getValue("grdData_BIZTRIP_D", this, "trans_amt", true));
        sum_toll_amt += Number(gw_com_api.getValue("grdData_BIZTRIP_D", this, "toll_amt", true));
        sum_park_amt += Number(gw_com_api.getValue("grdData_BIZTRIP_D", this, "park_amt", true));
        sum_food_amt += Number(gw_com_api.getValue("grdData_BIZTRIP_D", this, "food_amt", true));
        sum_stay_amt += Number(gw_com_api.getValue("grdData_BIZTRIP_D", this, "stay_amt", true));
        exp_sum += Number(gw_com_api.getValue("grdData_BIZTRIP_D", this, "total_amt", true));
    });
    settle_amt = exp_sum; // + gw_com_api.getValue("grdData_BIZTRIP", "selected", "befpay_amt", true);

    gw_com_api.setValue("grdData_BIZTRIP", "selected", "exp_sum", exp_sum, true, true, false);
    gw_com_api.setValue("grdData_BIZTRIP", "selected", "settle_amt", settle_amt, true, true, false);

    gw_com_api.setValue("frmData_BIZTRIP_D_SUM", 1, "trans_amt", sum_trans_amt, false, true, true);
    gw_com_api.setValue("frmData_BIZTRIP_D_SUM", 1, "toll_amt", sum_toll_amt, false, true, true);
    gw_com_api.setValue("frmData_BIZTRIP_D_SUM", 1, "park_amt", sum_park_amt, false, true, true);
    gw_com_api.setValue("frmData_BIZTRIP_D_SUM", 1, "food_amt", sum_food_amt, false, true, true);
    gw_com_api.setValue("frmData_BIZTRIP_D_SUM", 1, "stay_amt", sum_stay_amt, false, true, true);
    gw_com_api.setValue("frmData_BIZTRIP_D_SUM", 1, "total_amt", exp_sum, false, true, true);

}
//----------
function changeStat(param) {

    var qry = {
        query: "HRM_3030_2",
        row: [{
            crud: "U",
            column: [
                { name: "biztrip_no", value: gw_com_api.getValue("grdData_BIZTRIP", "selected", "biztrip_no", true) },
                { name: "appr_yn", value: "4" },
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
                }
                closeDialogue({ page: param.from.page });
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//