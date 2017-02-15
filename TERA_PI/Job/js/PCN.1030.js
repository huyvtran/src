//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 
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

        // 관리자 여부
        v_global.logic.sys_yn = gw_com_module.v_Session.USR_ID == "GOODTEST" ? true : false;

        // set data for DDDW List
        var args = {
            request: [
                {
                    type: "INLINE", name: "판정",
                    data: [
                        { title: "접수승인", value: "접수승인" },
                        { title: "부적합", value: "부적합" },
                        { title: "담당자변경", value: "담당자변경" }
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

            gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { day: -30 }));
            gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate("", { day: 1 }));
            gw_com_api.setValue("frmOption", 1, "user_id", gw_com_module.v_Session.USR_ID);
            gw_com_api.setValue("frmOption", 1, "user_nm", gw_com_module.v_Session.USR_NM);
        }
    },

    // manage UI. (design section)
    UI: function () {

        //=====================================================================================
        var args = {
            targetid: "lyrMenu_1", type: "FREE",
            element: [
				{ name: "조회", value: "조회", act: true },
                { name: "검토", value: "검토", icon: "기타" },
                { name: "닫기", value: "닫기" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_2", type: "FREE",
            element: [
                { name: "실행", value: "새로고침", icon: "Act" },
                { name: "저장", value: "저장" },
                { name: "닫기", value: "닫기" }
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
            targetid: "lyrMenu_4", type: "FREE",
            element: [
                { name: "접수", value: "접수", icon: "기타" },
                { name: "승인", value: "접수승인", icon: "예" },
                { name: "반려", value: "부적합", icon: "아니오" },
                { name: "담당", value: "담당자변경", icon: "아니오" },
                { name: "저장", value: "저장" },
                { name: "진행", value: "ECR등록", icon: "Act" },
                { name: "통보", value: "통보", icon: "기타" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true, margin_top: 70,
            editable: { focus: "ymd_fr", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "ymd_fr", label: { title: "작성일자 :" }, mask: "date-ymd", style: { colfloat: "floating" },
                                editable: { type: "text", size: 7, maxlength: 10 }
                            },
			                {
			                    name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
			                    editable: { type: "text", size: 7, maxlength: 10 }
			                }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "user_nm", label: { title: "담당자 :" }, mask: "search",
                                editable: { type: "text", size: 10, maxlength: 50 }, hidden: !v_global.logic.sys_yn
                            },
                            { name: "user_id", hidden: true, editable: { type: "hidden" } },
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
            targetid: "grdList_MAIN", query: "PCN_1030_1", title: "변경점 검토 요청 현황",
            caption: false, height: 420, pager: false, show: true, selectable: true, number: true,
            element: [
                { header: "관리번호", name: "issue_no", width: 80, align: "center" },
                { header: "협력사명", name: "comp_nm", width: 100 },
                { header: "작성일", name: "issue_dt", width: 100, align: "center" },
                { header: "진행상태", name: "astat", width: 60, align: "center" },
                { header: "요청자", name: "rqst_user_nm", width: 60, align: "center" },
                { header: "E-Mail", name: "rqst_user_email", width: 100 },
                { header: "제목", name: "issue_title", width: 200 },
                { header: "품번", name: "item_cd", width: 80, align: "center" },
                { header: "품명", name: "item_nm", width: 170 },
                { header: "담당부서", name: "prc_dept_nm", width: 100 },
                { header: "담당자", name: "prc_user_nm", width: 60, align: "center" },
                //{ header: "협력사", name: "prc_supp_nm", width: 150 },
                { header: "완료예정일", name: "plan_dt", width: 90, align: "center", mask: "date-ymd" },
                { name: "pstat", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_MAIN", query: "PCN_1010_2", type: "TABLE", title: "변경점 승인 요청",
            caption: false, show: true, selectable: true,
            editable: { bind: "select", focus: "rqst_user_nm", validate: true },
            content: {
                width: { label: 40, field: 60 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "관리번호", format: { type: "label" } },
                            { name: "issue_no", editable: { type: "hidden", width: 166 } },
                            { header: true, value: "협력사명", format: { type: "label" } },
                            { name: "comp_nm", format: { type: "text", width: 500 }, style: { colspan: 3 }, width: 150 },
                            { name: "comp_cd", format: { type: "text" }, hidden: true },
                            { header: true, value: "작성일시", format: { type: "label" } },
                            { name: "issue_dt", format: { type: "text", width: 166 } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "적용예정일", format: { type: "label" } },
                            { name: "plan_date", format: { type: "text", width: 100 }, mask: "date-ymd" },
                            { header: true, value: "작성자", format: { type: "label" } },
                            { name: "rqst_user_nm", format: { type: "text", width: 128 } },
                            { header: true, value: "직급", format: { type: "label" } },
                            { name: "rqst_user_pos", format: { type: "text", width: 128 } },
                            { header: true, value: "E-Mail", format: { type: "label" } },
                            { name: "rqst_user_email", format: { type: "text", width: 166 } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "품번", format: { type: "label" } },
                            { name: "item_cd", format: { type: "text", width: 166 } },
                            { header: true, value: "품명", format: { type: "label" } },
                            { name: "item_nm", format: { type: "text", width: 414 }, style: { colspan: 3 } },
                            { header: true, value: "연락처", format: { type: "label" } },
                            { name: "rqst_user_tel", format: { type: "text", width: 166 } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "변경구분", format: { type: "label" } },
                            { name: "chg_tp", format: { type: "text", width: 166 } },
                            { header: true, value: "상세구분", format: { type: "label" } },
                            { name: "chg_dtl_tp", format: { type: "text", width: 414 }, style: { colspan: 3 } },
                            { header: true, value: "진행상태", format: { type: "label" } },
                            { name: "astat", editable: { type: "hidden", width: 166 } },
                            { name: "pstat", editable: { type: "hidden" }, hidden: true }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "제목", format: { type: "label" } },
                            {
                                name: "issue_title", style: { colspan: 7 },
                                editable: { type: "hidden", width: 1002 }, display: true
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "변경사유", format: { type: "label" } },
                            {
                                name: "chg_reason", style: { colspan: 7 },
                                format: { type: "textarea", rows: 4, width: 1000 }
                            },
                            { name: "chg_memo1", editable: { type: "textarea" }, hidden: true },
                            { name: "chg_memo2", editable: { type: "textarea" }, hidden: true },
                            { name: "chg_memo3", editable: { type: "textarea" }, hidden: true },
                            { name: "chg_memo4", editable: { type: "textarea" }, hidden: true }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_MEMO1", query: "PCN_1010_2", type: "TABLE", title: "내용(변경 전)",
            caption: true, show: true, fixed: true, selectable: true,
            editable: { bind: "select", validate: true },
            content: {
                width: { field: "100%" }, height: 370,
                row: [
                    {
                        element: [
                            { name: "chg_memo1", format: { type: "html", height: 370, top: 5 } }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_MEMO2", query: "PCN_1010_2", type: "TABLE", title: "내용(변경 후)",
            caption: true, show: true, fixed: true, selectable: true,
            editable: { bind: "select", validate: true },
            content: {
                width: { field: "100%" }, height: 370,
                row: [
                    {
                        element: [
                            { name: "chg_memo2", format: { type: "html", height: 370, top: 5 } }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_MEMO3", query: "PCN_1010_2", type: "TABLE", title: "",
            caption: false, show: true, selectable: true,
            editable: { bind: "select", focus: "chg_memo3", validate: true },
            content: {
                width: { label: 10, field: 90 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "품질검증내용", format: { type: "label" } },
                            {
                                name: "chg_memo3",
                                format: { type: "textarea", rows: 4, width: 1000 }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "4M", format: { type: "label" } },
                            {
                                header: false, name: "chg_memo4", format: { type: "label" },
                                value: "① MAN(작업자) : 주요공정 및 보안 공정의 작업자 변경&nbsp;&nbsp;&nbsp;&nbsp;② MACHINE(설비) : 설비,금형 및 2차업체 변경<br/>③ MATERIAL(재료) : 재질변경 및 국산화품 적용&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;④ METHOD(작업방법) : 제조공법변경,생산공장이전 등<br/>&nbsp;&nbsp;※기 타 : 1년이상 방치된 금형 설비 사용 또는 납품 중단 후 재개 등"
                            }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        createDW({});
        //=====================================================================================
        var args = {
            targetid: "grdData_FILE", query: "DLG_FILE_ZFILE_V", title: "첨부 문서",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            editable: { multi: true, bind: "select", focus: "file_desc", validate: true },
            element: [
				{ header: "파일명", name: "file_nm", width: 250, align: "left" },
				{ header: "등록부서", name: "upd_dept", width: 100, align: "center" },
				{ header: "등록자", name: "upd_usr", width: 60, align: "center" },
				{
				    header: "다운로드", name: "download", width: 60, align: "center",
				    format: { type: "link", value: "다운로드" }
				},
				{
				    header: "파일설명", name: "file_desc", width: 380, align: "left",
				    editable: { type: "text" }
				},
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
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdList_MAIN", offset: 8 },
                { type: "FORM", id: "frmData_MAIN", offset: 8 },
                { type: "FORM", id: "frmData_MEMO1", offset: 8 },
                { type: "FORM", id: "frmData_MEMO2", offset: 8 },
                { type: "FORM", id: "frmData_MEMO3", offset: 8 },
                { type: "FORM", id: "frmData_SUB", offset: 8 },
                { type: "GRID", id: "grdData_FILE", offset: 8 }
			]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        var args = {
            tabid: "lyrTab",
            target: [
                { type: "LAYER", id: "lyrTab_1", title: "요청현황" },
				{ type: "LAYER", id: "lyrTab_2", title: "결과등록" }
            ]
        };
        //----------
        gw_com_module.convertTab(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "TAB", id: "lyrTab", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        gw_com_module.informSize();

    },

    // manage process. (program section)
    procedure: function () {

        //=====================================================================================
        var args = { targetid: "lyrMenu_1", element: "조회", event: "click", handler: viewOption };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1", element: "검토", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_2", element: "실행", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "저장", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "요청", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "취소", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_3", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_3", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_4", element: "저장", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_4", element: "접수", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_4", element: "승인", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_4", element: "반려", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_4", element: "담당", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_4", element: "진행", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_4", element: "통보", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: closeOption };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemdblclick", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemkeyenter", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //=====================================================================================
        //var args = { targetid: "grdList_MAIN", grid: true, event: "rowselected", handler: processRetrieve };
        //gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_MAIN", grid: true, event: "rowdblclick", handler: processEdit };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmData_MAIN", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_MEMO1", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_MEMO1", event: "itemdblclick", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_MEMO2", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_MEMO2", event: "itemdblclick", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_MEMO3", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrTab", event: "tabselect", handler: processTabChange };
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
            processRetrieve(param);
            break;
        case "추가":
            processInsert(param);
            break;
        case "검토":
            processEdit(param);
            break;
        case "삭제":
            processDelete(param);
            break;
        case "저장":
            processSave({});
            break;
        case "접수":
        case "승인":
        case "반려":
        case "담당":
        case "진행":
            processStat(param);
            break;
        case "통보":
            if (!checkManipulate({})) return;
            v_global.process.handler = processSendMail;
            if (!checkUpdatable({})) return;
            processSendMail(param);
            break;
        case "닫기":
            v_global.process.handler = processClose;
            if (!checkUpdatable({})) return;
            processClose({});
            break;
    }

}
//----------
function processTabChange(param) {

    closeOption({});

}
//----------
function processEdit(param) {

    v_global.process.handler = processRetrieve;
    if (!checkUpdatable({})) return;
    processRetrieve(param);

}
//----------
function processStat(param) {

    if (!checkManipulate({})) return;
    //if (!checkUpdatable({ check: true })) return false;
    gw_com_api.setError(false, "frmData_SUB", 1, "plan_dt", false);
    gw_com_api.setError(false, "frmData_SUB", 1, "exam_rmk", false);

    switch (param.element) {
        case "접수":
            gw_com_api.setValue("frmData_MAIN", 1, "astat", "검토접수");
            gw_com_api.setValue("frmData_MAIN", 1, "pstat", "검토");
            gw_com_api.setValue("frmData_SUB", 1, "act_dt", gw_com_api.getDate());
            gw_com_api.setValue("frmData_SUB", 1, "act_user", gw_com_module.v_Session.USR_ID);
            gw_com_api.setValue("frmData_SUB", 1, "act_user_nm", gw_com_module.v_Session.USR_NM);
            gw_com_api.setCRUD("frmData_MAIN", 1, "modify");
            gw_com_api.setCRUD("frmData_SUB", 1, "modify");
            processSave({});
            break;
        case "승인":
        case "반려":
            //if (gw_com_api.getValue("frmData_SUB", 1, "exam_rmk") == "") {
            //    gw_com_api.messageBox([{ text: "NOVALIDATE" }]);
            //    return;
            //}
            var astat = param.element == "승인" ? "검토승인" : "검토반려";
            var pstat = param.element == "승인" ? "검토" : "반려";
            var result = param.element == "승인" ? "접수승인" : "부적합";
            gw_com_api.setValue("frmData_MAIN", 1, "astat", astat);
            gw_com_api.setValue("frmData_MAIN", 1, "pstat", pstat);
            gw_com_api.setValue("frmData_SUB", 1, "exam_dt", gw_com_api.getDate());
            gw_com_api.setValue("frmData_SUB", 1, "exam_user", gw_com_module.v_Session.USR_ID);
            gw_com_api.setValue("frmData_SUB", 1, "exam_user_nm", gw_com_module.v_Session.USR_NM);
            gw_com_api.setValue("frmData_SUB", 1, "exam_result", result);
            gw_com_api.setCRUD("frmData_MAIN", 1, "modify");
            gw_com_api.setCRUD("frmData_SUB", 1, "modify");
            if (param.element == "승인") {
                if (gw_com_api.getValue("frmData_SUB", 1, "plan_dt") == "") {
                    gw_com_api.messageBox([{ text: "NOVALIDATE" }]);
                    gw_com_api.setError(true, "frmData_SUB", 1, "plan_dt", false);
                    return;
                }
            } else if (param.element == "반려") {
                param.batch = {
                    type: "PCN-MAIL",
                    data: {
                        type: "PCN-RQST-REJECT",
                        key_no: gw_com_api.getValue("frmData_MAIN", 1, "issue_no")
                    }
                };
            }
            gw_com_api.setError(false, "frmData_SUB", 1, "plan_dt", false);
            processSave(param);
            break;
        case "담당":
            gw_com_api.setValue("frmData_MAIN", 1, "astat", "담당자변경");
            gw_com_api.setValue("frmData_MAIN", 1, "pstat", "검토");
            gw_com_api.setValue("frmData_SUB", 1, "act_dt", gw_com_api.getDate());
            gw_com_api.setValue("frmData_SUB", 1, "act_user", gw_com_module.v_Session.USR_ID);
            gw_com_api.setValue("frmData_SUB", 1, "act_user_nm", gw_com_module.v_Session.USR_NM);
            gw_com_api.setCRUD("frmData_MAIN", 1, "modify");
            gw_com_api.setCRUD("frmData_SUB", 1, "modify");
            processSave({});
            break;
        case "진행":
            param.batch = {
                type: "ECR",
                data: {
                    issue_no: gw_com_api.getValue("frmData_MAIN", 1, "issue_no"),
                    emp_no: gw_com_module.v_Session.EMP_NO,
                    dept_cd: gw_com_module.v_Session.DEPT_CD,
                    user_id: gw_com_module.v_Session.USR_ID
                }
            };
            processBatch(param);
            break;
    }

}
//----------
function processItemchanged(param) {

    if (param.object == "frmData_MEMO3") {
        gw_com_api.setValue("frmData_MEMO1", param.row, param.element, param.value.current);
    } else if (param.object == "frmOption") {
        if (param.element == "user_nm" && param.value.current == "") {
            gw_com_api.setValue(param.object, param.row, "user_id", "");
        }
    } else if (param.object == "frmData_SUB") {
        if (param.element == "exam_result") {
            var astat = param.value.current == "승인" ? "검토승인" : "검토반려";
            var pstat = param.value.current == "승인" ? "검토" : "반려";
            gw_com_api.setValue("frmData_MAIN", 1, "astat", astat);
            gw_com_api.setValue("frmData_MAIN", 1, "pstat", pstat);
            gw_com_api.setValue("frmData_SUB", 1, "exam_dt", gw_com_api.getDate());
            gw_com_api.setValue("frmData_SUB", 1, "exam_user", gw_com_module.v_Session.USR_ID);
            gw_com_api.setValue("frmData_SUB", 1, "exam_user_nm", gw_com_module.v_Session.USR_NM);
            gw_com_api.setCRUD("frmData_MAIN", 1, "modify");
            gw_com_api.setCRUD("frmData_SUB", 1, "modify");
        }
    }

}
//----------
function processItemdblclick(param) {

    v_global.event.type = param.type;
    v_global.event.object = param.object;
    v_global.event.row = param.row;
    v_global.event.element = param.element;

    switch (param.element) {
        //case "chg_memo1":
        //case "chg_memo2":
        //    if (!checkEditable({})) return;
        //    if (!checkManipulate({})) return;
        //    if (param.element == "chg_memo1") {
        //        v_global.logic.memo = "내용(변경 전)";
        //    } else {
        //        v_global.logic.memo = "내용(변경 후)";
        //    }
        //    processMemo({ type: param.type, object: param.object, row: param.row, element: param.element, html: true });
        //    break;
        case "dept_nm":
            var args = {
                type: "PAGE", page: "DLG_TEAM", title: "부서 선택",
                width: 500, height: 450, locate: ["center", "top"], open: true
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = {
                    page: "DLG_TEAM",
                    param: { ID: gw_com_api.v_Stream.msg_selectTeam }
                };
                gw_com_module.dialogueOpen(args);
            }
            break;
        case "user_nm":
            var args = {
                type: "PAGE", page: "DLG_EMPLOYEE", title: "사원 선택",
                width: 700, height: 450, locate: ["center", "top"], open: true
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = {
                    page: "DLG_EMPLOYEE",
                    param: { ID: gw_com_api.v_Stream.msg_selectEmployee }
                };
                gw_com_module.dialogueOpen(args);
            }
            break;
        case "supp_nm":
            var args = {
                type: "PAGE", page: "w_find_supplier", title: "협력사 선택",
                width: 500, height: 450, locate: ["center", "top"], open: true
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = {
                    page: "w_find_supplier",
                    param: { ID: gw_com_api.v_Stream.msg_selectedSupplier }
                };
                gw_com_module.dialogueOpen(args);
            }
            break;
        default: return;
    }

}
//----------
function processRetrieve(param) {

    var args = { target: [{ type: "FORM", id: "frmOption" }] };
    if (!gw_com_module.objValidate(args)) return;

    var args;
    if (param.object == "frmOption") {
        args = {
            source: {
                type: "FORM", id: "frmOption", hide: true,
                element: [
                    { name: "ymd_fr", argument: "arg_ymd_fr" },
                    { name: "ymd_to", argument: "arg_ymd_to" },
                    { name: "user_id", argument: "arg_user_id" }
                ],
                //remark: [
                //    { element: [{ name: "work_ym" }] },
                //    //{ element: [{ name: "emp_no" }] },
                //    { element: [{ name: "emp_nm" }] }
                //]
            },
            target: [
                { type: "GRID", id: "grdList_MAIN", select: true }
            ],
            clear: [
                { type: "FORM", id: "frmData_MAIN" },
                { type: "FORM", id: "frmData_MEMO1" },
                { type: "FORM", id: "frmData_MEMO2" },
                { type: "FORM", id: "frmData_MEMO3" },
                { type: "FORM", id: "frmData_SUB" },
                { type: "GRID", id: "grdData_FILE" }
            ],
            key: param.key
        };
    } else if (param.object == "frmData_SUB") {
        args = {
            source: {
                type: "FORM", id: "frmData_MAIN",
                element: [
                    { name: "issue_no", argument: "arg_issue_no" }
                ]
            },
            target: [
                { type: "FORM", id: "frmData_SUB", edit: true },
            ]
        };
    } else {
        args = {
            source: {
                type: "GRID", id: "grdList_MAIN", row: "selected",
                element: [
                    { name: "issue_no", argument: "arg_issue_no" },
                    { name: "issue_no", argument: "arg_data_key" }
                ],
                argument: [
                    { name: "arg_data_seq", value: -1 }
                ]
            },
            target: [
                { type: "FORM", id: "frmData_MAIN", edit: true },
                { type: "FORM", id: "frmData_MEMO1" },
                { type: "FORM", id: "frmData_MEMO2" },
                { type: "FORM", id: "frmData_MEMO3" },
                //{ type: "FORM", id: "frmData_SUB", edit: true },
                { type: "GRID", id: "grdData_FILE" }
            ],
            handler: {
                complete: processRetrieveEnd,
                param: param
            },
            key: param.key
        };
        gw_com_api.selectTab("lyrTab", 2);

    }
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {

    createDW({ astat: gw_com_api.getValue("frmData_MAIN", 1, "astat") });

}
//----------
function processInsert(param) {

    if (!checkManipulate({})) return;
    if (!checkUpdatable({ check: true })) return false;
    var args = {
        type: "PAGE", page: "w_upload_pcn", title: "파일 업로드",
        width: 650, height: 200,
        //locate: ["center", 600],
        open: true
    };
    if (gw_com_module.dialoguePrepare(args) == false) {
        var args = {
            page: "w_upload_pcn",
            param: {
                ID: gw_com_api.v_Stream.msg_upload_ECCB,
                data: {
                    user: gw_com_module.v_Session.USR_ID,
                    key: gw_com_api.getValue("frmData_MAIN", 1, "issue_no"),
                    seq: 1
                }
            }
        };
        gw_com_module.dialogueOpen(args);
    }

}
//----------
function processDelete(param) {

    var args;
    if (param.object == "lyrMenu_3") {
        //if ($.inArray(gw_com_api.getValue("grdList_MAIN", "selected", "appr_yn2", true), ["", "9"]) == -1) {
        //    gw_com_api.messageBox([{ text: "결재중이거나 완료된 내역은 삭제할 수 없습니다." }]);
        //    return;
        //}
        args = { targetid: "grdData_FILE", row: "selected", select: true }
        gw_com_module.gridDelete(args);
    }

}
//----------
function processSave(param) {

    var args = {
        url: "COM",
        target: [
			{ type: "FORM", id: "frmData_MAIN" },
			{ type: "FORM", id: "frmData_SUB" },
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

    var key = [{
        KEY: [{
            NAME: "issue_no",
            VALUE: response[0].KEY[0].VALUE
        }],
        QUERY: "PCN_1030_1"
    }];
    if (param.batch == undefined) {
        $.ajaxSetup({ async: false });
        processRetrieve({ object: "frmOption", key: key });
        $.ajaxSetup({ async: true });
        processRetrieve({});
    } else {
        param.key = key;
        processBatch(param);
    }

}
//----------
function processBatch(param) {

    var args;
    switch (param.batch.type) {
        case "PCN-MAIL":
            args = {
                url: "COM",
                procedure: "dbo.PROC_MAIL_ECCB_PCN",
                nomessage: true,
                input: [
                    { name: "type", value: param.batch.data.type, type: "varchar" },
                    { name: "key_no", value: param.batch.data.key_no, type: "varchar" },
                    { name: "key_seq", value: "0", type: "varchar" },
                    { name: "user", value: gw_com_module.v_Session.USR_ID, type: "varchar" }

                ],
                handler: {
                    success: successBatch,
                    param: param
                }
            };
            break;
        case "ECR":
            args = {
                url: "COM",
                procedure: "dbo.PROC_PCN_TO_ECR",
                input: [
                    { name: "issue_no", value: param.batch.data.issue_no, type: "varchar" },
                    { name: "emp_no", value: param.batch.data.emp_no, type: "varchar" },
                    { name: "dept_cd", value: param.batch.data.dept_cd, type: "varchar" },
                    { name: "user_id", value: param.batch.data.user_id, type: "varchar" }
                ],
                output: [
                    { name: "ecr_no", type: "varchar" }
                ],
                handler: {
                    success: successBatch,
                    param: param
                }
            };
            break;
        default:
            return;
            break;
    }
    gw_com_module.callProcedure(args);

}
//----------
function successBatch(response, param) {

    if (param.batch.type == "ECR") {
        var args = {
            ID: gw_com_api.v_Stream.msg_linkPage,
            to: {
                type: "MAIN"
            },
            data: {
                page: "w_eccb1010",
                title: "ECR 등록",
                param: [
                    { name: "AUTH", value: "C" },
                    { name: "ecr_no", value: response.VALUE[0] },
                    { name: "issue_no", value: param.batch.data.issue_no }
                ]
            }
        };
        gw_com_module.streamInterface(args);
    }
    $.ajaxSetup({ async: false });
    processRetrieve({ object: "frmOption", key: param.key });
    $.ajaxSetup({ async: true });
    processRetrieve({});

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
function processFile(param) {

    var args = {
        source: { id: param.object, row: param.row },
        targetid: "lyrDown"
    };
    gw_com_module.downloadFile(args);

}
//----------
function processMemo(param) {

    v_global.event.type = param.type;
    v_global.event.object = param.object;
    v_global.event.row = param.row;
    v_global.event.element = param.element;
    if (param.html) {
        //var args = {
        //    type: "PAGE", page: "w_edit_html_eccb", title: "상세 내용",
        //    width: 510,
        //    height: 570,
        //    locate: ["center", "center"],
        //    open: true
        //};
        //if (gw_com_module.dialoguePrepare(args) == false) {
        //    var args = {
        //        page: "w_edit_html_eccb",
        //        param: {
        //            ID: gw_com_api.v_Stream.msg_edit_HTML,
        //            data: {
        //                edit: true,
        //                title: v_global.logic.memo,
        //                html: gw_com_api.getValue(v_global.event.object, v_global.event.row, v_global.event.element)
        //            }
        //        }
        //    };
        //    gw_com_module.dialogueOpen(args);
        //}
        var args = {
            page: "DLG_EDIT_HTML",
            option: "width=900,height=600,left=300",
            data: {
                title: v_global.logic.memo,
                html: gw_com_api.getValue(v_global.event.object, v_global.event.row, v_global.event.element)
            }
        };
        gw_com_api.openWindow(args);
    }

}
//----------
function checkCRUD(param) {

    return gw_com_api.getCRUD("frmData_MAIN");

}
//----------
function checkManipulate(param) {

    if (checkCRUD(param) == "none") {
        gw_com_api.messageBox([
            { text: "NOMASTER" }
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
            { type: "FORM", id: "frmData_MAIN" },
            { type: "FORM", id: "frmData_MEMO1" },
            { type: "FORM", id: "frmData_MEMO2" },
            { type: "FORM", id: "frmData_MEMO3" },
			{ type: "GRID", id: "grdData_FILE" }
        ],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function createDW(param) {

    //=====================================================================================
    var args = {
        targetid: "frmData_SUB", query: "PCN_1030_2", type: "TABLE", title: "TERA 검토결과",
        caption: true, show: true, selectable: true,
        editable: { bind: "select", focus: "", validate: true },
        content: {
            width: { label: 44, field: 56 }, height: 25,
            row: [
                {
                    element: [
                        { header: true, value: "접수일", format: { type: "label" } },
                        { name: "act_dt", mask: "date-ymd", editable: { type: "hidden", width: 300 } },
                        { header: true, value: "접수자", format: { type: "label" } },
                        { name: "act_user_nm", editable: { type: "hidden", width: 200 } },
                        { name: "act_user", editable: { type: "hidden" }, hidden: true },
                        { header: true, value: "완료예정일", format: { type: "label" } },
                        { name: "plan_dt", editable: { type: "hidden", width: 200, validate: { rule: "dateISO" } }, mask: "date-ymd" },
                        { header: true, value: "승인자", format: { type: "label" } },
                        { name: "appr_user_nm", editable: { type: "hidden", width: 200 }, display: true }
                    ]
                },
                {
                    element: [
                        { header: true, value: "검토일", format: { type: "label" } },
                        { name: "exam_dt", mask: "date-ymd", editable: { type: "hidden", width: 300 } },
                        { header: true, value: "검토자", format: { type: "label" } },
                        { name: "exam_user_nm", editable: { type: "hidden", width: 200 } },
                        { name: "exam_user", editable: { type: "hidden" }, hidden: true },
                        { header: true, value: "판정", format: { type: "label" } },
                        { name: "exam_result", editable: { type: "hidden", width: 200 } },
                        { header: true, value: "승인일", format: { type: "label" } },
                        { name: "appr_date", editable: { type: "hidden", width: 300 }, mask: "date-ymd", display: true }
                    ]
                },
                {
                    element: [
                        { header: true, value: "검토결과", format: { type: "label" } },
                        {
                            name: "exam_rmk", style: { colspan: 7 },
                            format: { type: "textarea", rows: 4, width: 996 }
                        },
                        { name: "issue_no", editable: { type: "hidden" }, hidden: true },
                        { name: "act_seq", editable: { type: "hidden" }, hidden: true }
                    ]
                }
            ]
        }
    };
    //----------
    switch (param.astat) {
        case "검토요청":
            gw_com_api.show("lyrMenu_4_접수");
            gw_com_api.hide("lyrMenu_4_승인");
            gw_com_api.hide("lyrMenu_4_반려");
            gw_com_api.hide("lyrMenu_4_담당");
            gw_com_api.hide("lyrMenu_4_저장");
            gw_com_api.hide("lyrMenu_4_진행");
            gw_com_api.hide("lyrMenu_4_통보");
            break;
        case "검토접수":
            gw_com_api.hide("lyrMenu_4_접수");
            gw_com_api.show("lyrMenu_4_승인");
            gw_com_api.show("lyrMenu_4_반려");
            gw_com_api.show("lyrMenu_4_담당");
            gw_com_api.show("lyrMenu_4_저장");
            gw_com_api.hide("lyrMenu_4_진행");
            gw_com_api.hide("lyrMenu_4_통보");
            args.content.row[0].element[6].editable = { type: "text", width: 100 };
            args.content.row[2].element[1].editable = { type: "textarea", rows: 4, width: 996, validate: { rule: "required" } };
            break;
        case "검토승인":
        case "검토반려":
            gw_com_api.hide("lyrMenu_4_접수");
            gw_com_api.hide("lyrMenu_4_승인");
            gw_com_api.hide("lyrMenu_4_반려");
            gw_com_api.hide("lyrMenu_4_담당");
            if (param.astat == "검토승인") {
                gw_com_api.show("lyrMenu_4_저장");
                gw_com_api.show("lyrMenu_4_진행");
                gw_com_api.show("lyrMenu_4_통보");
                args.content.row[0].element[6].editable = { type: "text", width: 100 };
            } else {
                gw_com_api.hide("lyrMenu_4_저장");
                gw_com_api.hide("lyrMenu_4_진행");
                gw_com_api.hide("lyrMenu_4_통보");
            }
            break;
        default:
            gw_com_api.hide("lyrMenu_4_접수");
            gw_com_api.hide("lyrMenu_4_승인");
            gw_com_api.hide("lyrMenu_4_반려");
            gw_com_api.hide("lyrMenu_4_담당");
            gw_com_api.show("lyrMenu_4_저장");
            gw_com_api.hide("lyrMenu_4_진행");
            gw_com_api.hide("lyrMenu_4_통보");
            args.content.row[0].element[6].editable = { type: "text", width: 100 };
            break;
    }
    //----------
    gw_com_module.formCreate(args);
    //=====================================================================================
    var args = {
        target: [
            { type: "FORM", id: "frmData_SUB", offset: 8 }
        ]
    };
    //----------
    gw_com_module.objResize(args);
    //=====================================================================================
    var args = { targetid: "frmData_SUB", event: "itemchanged", handler: processItemchanged };
    gw_com_module.eventBind(args);
    //=====================================================================================
    if (checkCRUD({}) == "none") return;
    processRetrieve({ object: "frmData_SUB" });
    //=====================================================================================

}
//----------
function processSendMail(param) {

    var issue_no = gw_com_api.getValue("grdList_MAIN", "selected", "issue_no", true);
    var args = {
        url: "COM",
        subject: MailInfo.getSubject({ issue_no: issue_no }),
        body: MailInfo.getBody({ issue_no: issue_no }),
        to: MailInfo.getTo({ issue_no: issue_no }),
        cc: MailInfo.getCc({ issue_no: issue_no }),
        edit: true
    };
    gw_com_module.sendMail(args);

}
//----------
var MailInfo = {
    getSubject: function (param) {
        var rtn = "";
        var args = {
            request: "PAGE",
            url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
                    "?QRY_ID=PCN_1010_MAIL" +
                    "&QRY_COLS=value" +
                    "&CRUD=R" +
                    "&arg_type=PCN_1030&arg_field=SUBJECT&arg_key_no=" + param.issue_no,
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
    },
    getBody: function (param) {
        var rtn = "";
        var args = {
            request: "PAGE",
            url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
                    "?QRY_ID=PCN_1010_MAIL" +
                    "&QRY_COLS=value" +
                    "&CRUD=R" +
                    "&arg_type=PCN_1030&arg_field=BODY&arg_key_no=" + param.issue_no,
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
    },
    getTo: function (param) {
        var rtn = new Array();
        var args = {
            request: "PAGE",
            url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
                    "?QRY_ID=PCN_1010_MAIL" +
                    "&QRY_COLS=name,value" +
                    "&CRUD=R" +
                    "&arg_type=PCN_1030&arg_field=TO&arg_key_no=" + param.issue_no,
            handler_success: successRequest
        };
        //=================== async : false ========================
        $.ajaxSetup({ async: false });
        //----------
        gw_com_module.callRequest(args);
        function successRequest(data) {
            $.each(data, function () {
                rtn.push({
                    name: this.DATA[0],
                    value: this.DATA[1]
                });
            });
        }
        //----------
        $.ajaxSetup({ async: true });
        //=================== async : true ========================
        return rtn
    },
    getCc: function (param) {
        var rtn = new Array();
        var args = {
            request: "PAGE",
            url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
                    "?QRY_ID=PCN_1010_MAIL" +
                    "&QRY_COLS=name,value" +
                    "&CRUD=R" +
                    "&arg_type=PCN_1030&arg_field=CC&arg_key_no=" + param.issue_no,
            handler_success: successRequest
        };
        //=================== async : false ========================
        $.ajaxSetup({ async: false });
        //----------
        gw_com_module.callRequest(args);
        function successRequest(data) {
            $.each(data, function () {
                rtn.push({
                    name: this.DATA[0],
                    value: this.DATA[1]
                });
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
                                var status = checkCRUD({});
                                if (status == "initialize" || status == "create")
                                    processDelete({});
                                else if (status == "update")
                                    processRetrieve({});

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
                    case "w_upload_pcn":
                        {
                            args.ID = gw_com_api.v_Stream.msg_upload_ECCB;
                            args.data = {
                                user: gw_com_module.v_Session.USR_ID,
                                key: gw_com_api.getValue("frmData_MAIN", 1, "issue_no"),
                                seq: 0
                            };
                        }
                        break;
                    case "DLG_SUPPLIER":
                        args.ID = gw_com_api.v_Stream.msg_selectSupplier;
                        break;

                }
                gw_com_module.streamInterface(args);
            } break;
        case gw_com_api.v_Stream.msg_edited_HTML:
            {
                if (param.data.update) {
                    gw_com_api.setValue(v_global.event.object,
                                        v_global.event.row,
                                        v_global.event.element,
			                            param.data.html);
                    gw_com_api.setValue("frmData_MAIN",
                                        1,
                                        v_global.event.element,
			                            param.data.html);
                    gw_com_api.setUpdatable(v_global.event.object);
                }
                if (param.from)
                    closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                switch (param.from.page) {
                    case "":
                        break;
                }
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_uploaded_ECCB:
            {
                var args = {
                    source: {
                        type: "FORM", id: "frmData_MAIN",
                        element: [
				            { name: "issue_no", argument: "arg_data_key" }
                        ],
                        argument: [
                            { name: "arg_data_seq", value: -1 }
                        ]
                    },
                    target: [
			            { type: "GRID", id: "grdData_FILE", select: true }
                    ],
                    key: param.key
                };
                gw_com_module.objRetrieve(args);
            }
            break;
        case gw_com_api.v_Stream.msg_selectedSupplier:
            {
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "supp_cd",
			                        param.data.supp_cd,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "supp_nm",
			                        param.data.supp_nm,
			                        (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
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
            gw_com_api.setValue(v_global.event.object, v_global.event.row, "user_id", param.data.user_id,
			                    (v_global.event.type == "GRID") ? true : false);
            gw_com_api.setValue(v_global.event.object, v_global.event.row, "user_nm", param.data.user_nm,
			                    (v_global.event.type == "GRID") ? true : false);
            gw_com_api.setValue(v_global.event.object, v_global.event.row, "dept_cd", param.data.dept_cd,
			                    (v_global.event.type == "GRID") ? true : false);
            gw_com_api.setValue(v_global.event.object, v_global.event.row, "dept_nm", param.data.dept_nm,
			                    (v_global.event.type == "GRID") ? true : false);
            closeDialogue({ page: param.from.page, focus: true });
        } break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//