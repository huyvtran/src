//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 결재함
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

        // prepare dialogue.
        var args = {
            type: "PAGE", page: "DLG_APPR", title: "결재",
            width: 1100, height: 530, scroll: true, control: true, locate: ["center", "top"]
        };
        gw_com_module.dialoguePrepare(args);

        // set data for DDDW List
        var args = {
            request: [
				{
				    type: "PAGE", name: "회사", query: "DDDW_HRM_COMMON",
				    param: [{ argument: "arg_hcode", value: "S100" }]
				},
				{ type: "PAGE", name: "양식", query: "HRM_APPR_FORM" }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);

        //----------
        function start() {
            gw_job_process.UI();
            gw_job_process.procedure();
            gw_com_module.startPage();

            //gw_com_api.setValue("frmOption2", 1, "comp_id", EmpInfo.getCompCd({ dept_cd: gw_com_module.v_Session.DEPT_CD }), false, false, false);
            gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -3 }));
            gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate("", { month: 1 }));

            if (v_global.process.param != "" && gw_com_api.getPageParameter("appr_box") != "") {
                v_global.logic.main_key = [
                    {
                        KEY: [{ NAME: "appr_box", VALUE: gw_com_api.getPageParameter("appr_box") }],
                        QUERY: "DLG_APPR_12"
                    }
                ];
                if (gw_com_api.getPageParameter("appr_id") != "") {
                    v_global.logic.sub_key = [
                        {
                            KEY: [{ NAME: "appr_id", VALUE: gw_com_api.getPageParameter("appr_id") }],
                            QUERY: "DLG_APPR_22"
                        }
                    ];
                }
                processRetrieve({ key: v_global.logic.main_key });
            } else
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
				//{ name: "회수", value: "회수", icon: "삭제" },
                //{ name: "결재", value: "결재", icon: "예" },
                { name: "출력", value: "출력" },
                { name: "닫기", value: "닫기" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //----------
        //gw_com_api.hide("lyrMenu_회수");
        //gw_com_api.hide("lyrMenu_결재");
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true, remark: "lyrRemark",
            editable: { focus: "comp_id", validate: true },
            content: {
                row: [
                    {
                        element: [
				            {
				                name: "comp_id", label: { title: "회사 :" },
				                editable: { type: "select", data: { memory: "회사", unshift: [{ title: "전체", value: "%" }] } }
				            },
				            {
				                name: "ymd_fr", label: { title: "상신일자 :" }, mask: "date-ymd",
				                editable: { type: "text", size: 7, maxlength: 10, validate: { rule: "dateISO" } }, style: { colfloat: "float" }
				            },
				            {
				                name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
				                editable: { type: "text", size: 7, maxlength: 10, validate: { rule: "dateISO" } }, style: { colfloat: "floated" }
				            }
                        ]
                    },
                    {
                        element: [
				            {
				                name: "form_id", label: { title: "문서구분 :" },
				                editable: { type: "select", data: { memory: "양식", unshift: [{ title: "전체", value: "%" }] } }
				            },
                            {
                                name: "rqst_emp", label: { title: "상신자 :" },
                                editable: { type: "text", size: 7 }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "appr_title", label: { title: "제목 :" },
                                editable: { type: "text", size: 30 }
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
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        //var args = {
        //    targetid: "frmOption2", type: "FREE",
        //    trans: true, show: true, border: false, align: "left",
        //    editable: { bind: "open", focus: "comp_id" },
        //    //remark: "lyrRemark",
        //    content: {
        //        row: [
        //            {
        //                element: [
        //                    {
        //                        name: "comp_id", label: { title: "회사 :" },
        //                        editable: { type: "select", data: { memory: "회사", unshift: [{ title: "전체", value: "%" }] } }
        //                    },
        //                    {
        //                        name: "ymd_fr", label: { title: "상신일자 :" }, mask: "date-ymd",
        //                        editable: { type: "text", size: 7, maxlength: 10, validate: { rule: "dateISO" } }, style: { colfloat: "float" }
        //                    },
        //                    {
        //                        name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
        //                        editable: { type: "text", size: 7, maxlength: 10, validate: { rule: "dateISO" } }, style: { colfloat: "floated" }
        //                    },
        //                    {
        //                        name: "form_id", label: { title: "문서구분 :" },
        //                        editable: { type: "select", data: { memory: "양식", unshift: [{ title: "전체", value: "%" }] } }
        //                    },
        //                    {
        //                        name: "appr_title", label: { title: "제목 :" },
        //                        editable: { type: "text", size: 10 }
        //                    },
        //                    {
        //                        name: "rqst_emp", label: { title: "상신자 :" },
        //                        editable: { type: "text", size: 7 }
        //                    },
        //                    { name: "실행", act: true, show: false, format: { type: "button" } }
        //                ]
        //            }
        //        ]
        //    }
        //};
        ////----------
        //gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_MAIN", query: "DLG_APPR_12", title: "결재함",
            caption: true, height: 161, pager: false, show: true, selectable: true, number: true,
            element: [
                { header: "구분", name: "appr_box_nm", width: 60, align: "center" },
                { header: "건수", name: "cnt1", width: 40, align: "right", mask: "numeric-int" },
                { name: "appr_box", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_SUB", query: "DLG_APPR_22", title: "결재문서",
            caption: true, height: 161, pager: false, show: true, selectable: true, number: true, dynamic: true,
            element: [
                { header: "문서구분", name: "form_nm", width: 60, align: "center" },
                { header: "상신일", name: "rqst_date", width: 80, align: "center", mask: "date-ymd" },
                { header: "상신자", name: "rqst_emp_nm", width: 50, align: "center" },
                { header: "직급", name: "rqst_grade_nm", width: 40, align: "center" },
                { header: "직책", name: "rqst_duty_nm", width: 40, align: "center" },
                { header: "부서", name: "rqst_dept_nm", width: 60 },
                { header: "제목", name: "doc_title", width: 220 },
                { header: "진행상태", name: "pstat_nm", width: 40, align: "center" },
                { header: "승인구분", name: "appr_yn_nm", width: 40, align: "center" },
				{ name: "appr_id", hidden: true },
                { name: "appr_seq", hidden: true },
                { name: "rqst_emp", hidden: true },
                { name: "pstat", hidden: true },
                { name: "appr_yn", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_HTML", query: "DLG_EDIT_APPR", type: "TABLE", title: "",
            show: true, selectable: true, fixed: true, caption: false,
            content: {
                height: "100%", width: { field: "100%" },
                row: [
                    {
                        element: [
                            { name: "doc_body2", format: { type: "html" } },
                            { name: "doc_body", format: { type: "text" }, hidden: true }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //----------
        $("#frmData_HTML_data .form_2-content").removeClass("form_2-content");
        //=====================================================================================
        var args = {
            targetid: "grdList_FILE", query: "DLG_EDIT_APPR_FILE", title: "첨부파일",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            element: [
				{ header: "파일명", name: "file_nm", width: 250 },
				{ header: "다운로드", name: "download", width: 60, align: "center", format: { type: "link", value: "다운로드" } },
				{ header: "설명", name: "file_desc", width: 300, format: { type: "text", maxlength: 110, width: 400 } },
                { name: "file_path", hidden: true },
                { name: "file_id", hidden: true }
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
                { type: "GRID", id: "grdList_SUB", offset: 8 },
                { type: "FORM", id: "frmData_HTML", offset: 8 },
                { type: "GRID", id: "grdList_FILE", offset: 8 }
			]
        };
        gw_com_module.objResize(args);
        //=====================================================================================
        gw_com_module.informSize();

    },

    // manage process. (program section)
    procedure: function () {

        //=====================================================================================
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        //var args = { targetid: "lyrMenu", element: "결재", event: "click", handler: processButton };
        //gw_com_module.eventBind(args);
        ////----------
        //var args = { targetid: "lyrMenu", element: "회수", event: "click", handler: processButton };
        //gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "출력", event: "click", handler: processPrint };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: closeOption };
        gw_com_module.eventBind(args);
        //=====================================================================================
        //var args = { targetid: "frmOption2", event: "itemchanged", handler: processRetrieve };
        //gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdList_MAIN", grid: true, event: "rowselected", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_SUB", grid: true, event: "rowselected", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_SUB", grid: true, event: "rowdblclick", handler: processOpenAppr };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdList_FILE", grid: true, element: "download", event: "click", handler: processFile };
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
        case "조회":
            viewOption({});
            break;
        case "실행":
            processRetrieve({});
            break;
        case "결재":
            processOpenAppr(param);
            break;
        case "회수":
            var row = gw_com_api.getSelectedRow("grdList_SUB");
            if (row > 0) {
                var args = [
                    { name: "appr_id", value: gw_com_api.getValue("grdList_SUB", row, "appr_id", true) },
                    { name: "appr_seq", value: gw_com_api.getValue("grdList_SUB", row, "appr_seq", true) },
                    { name: "appr_yn", value: "" }
                ];
                processSetAppr(args);
            }
            break;
    }

}
//----------
function processButtonStat(param) {

    //switch (param.object) {
    //    case "grdList_MAIN":
    //        {
    //            switch (gw_com_api.getValue(param.object, param.row, "appr_box", true)) {
    //                case "0":   // 미결함
    //                    gw_com_api.show("lyrMenu_결재");
    //                    gw_com_api.hide("lyrMenu_회수");
    //                    break;
    //                case "1":   // 보류함
    //                case "2":   // 기결함
    //                case "3":   // 반려함
    //                case "4":   // 기안함
    //                case "5":   // 완료함
    //                case "6":   // 회수함
    //                case "7":   // 참조함
    //                case "8":   // 협조함
    //                    gw_com_api.hide("lyrMenu_결재");
    //                    gw_com_api.hide("lyrMenu_회수");
    //                    break;
    //                default:
    //                    gw_com_api.hide("lyrMenu_결재");
    //                    gw_com_api.hide("lyrMenu_회수");
    //                    break;
    //            }
    //        }
    //        break;
    //    case "grdList_SUB":
    //        {
    //            //if (gw_com_api.getValue(param.object, param.row, "rqst_emp", true) == gw_com_module.v_Session.EMP_NO &&
    //            //    gw_com_api.getValue("grdList_SUB", 1, "appr_yn", true) == "대기") {
    //            //    gw_com_api.show("lyrMenu_회수");
    //            //} else {
    //            //    gw_com_api.hide("lyrMenu_회수");
    //            //}
    //        }
    //        break;
    //    default:
    //        gw_com_api.hide("lyrMenu_회수");
    //        gw_com_api.hide("lyrMenu_결재");
    //        break;
    //}

}
//----------
function processRetrieve(param) {

    var args;
    if (param.object == "grdList_MAIN") {
        args = {
            source: {
                type: param.type, id: param.object, row: param.row,
                element: [
                    { name: "appr_box", argument: "arg_appr_box" }
                ],
                argument: [
                    { name: "arg_comp_id", value: gw_com_api.getValue("frmOption", 1, "comp_id") },
                    { name: "arg_ymd_fr", value: gw_com_api.getValue("frmOption", 1, "ymd_fr") },
                    { name: "arg_ymd_to", value: gw_com_api.getValue("frmOption", 1, "ymd_to") },
                    { name: "arg_form_id", value: gw_com_api.getValue("frmOption", 1, "form_id") },
                    { name: "arg_rqst_emp", value: gw_com_api.getValue("frmOption", 1, "rqst_emp") },
                    { name: "arg_appr_title", value: gw_com_api.getValue("frmOption", 1, "appr_title") },
                    { name: "arg_user_id", value: gw_com_module.v_Session.USR_ID }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_SUB", select: true }
            ],
            clear: [
                { type: "FORM", id: "frmData_HTML" },
                { type: "GRID", id: "grdList_FILE" }
            ],
            handler: {
                complete: processRetrieveEnd,
                param: param
            },
            key: (v_global.logic.sub_key ? v_global.logic.sub_key : param.key)
        };
    } else if (param.object == "grdList_SUB") {
        args = {
            source: {
                type: param.type, id: param.object, row: "selected",
                element: [
                    { name: "appr_id", argument: "arg_appr_id" }
                ]
            },
            target: [
                { type: "FORM", id: "frmData_HTML", edit: true },
                { type: "GRID", id: "grdList_FILE", edit: true }
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
                    { name: "comp_id", argument: "arg_comp_id" },
                    { name: "ymd_fr", argument: "arg_ymd_fr" },
                    { name: "ymd_to", argument: "arg_ymd_to" },
                    { name: "form_id", argument: "arg_form_id" },
                    { name: "rqst_emp", argument: "arg_rqst_emp" },
                    { name: "appr_title", argument: "arg_appr_title" }
                ],
                argument: [
                    { name: "arg_user_id", value: gw_com_module.v_Session.USR_ID }
                ],
                remark: [
                    { element: [{ name: "comp_id" }] },
                    { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }] },
                    { element: [{ name: "form_id" }] },
                    { element: [{ name: "rqst_emp" }] },
                    { element: [{ name: "appr_title" }] }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_MAIN", select: true }
            ],
            clear: [
                { type: "GRID", id: "grdList_SUB" },
                { type: "FORM", id: "frmData_HTML" },
                { type: "GRID", id: "grdList_FILE" }
            ],
            key: param.key
        };
    }
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {

    processButtonStat(param);

    delete v_global.logic.main_key;
    delete v_global.logic.sub_key;

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
function processPrint(param) {

    if (gw_com_api.getCRUD("frmData_HTML") == "none") {
        gw_com_api.messageBox([{ text: "NOMASTER" }]);
        return;
    }

    if (gw_com_api.getValue("grdList_SUB", "selected", "appr_yn", true) != "승인") {
        gw_com_api.messageBox([{ text: "승인되지 않은 결재는 출력할 수 없습니다." }]);
        return;
    }

    var title = gw_com_api.getValue("grdList_SUB", "selected", "form_nm", true) + " - " + gw_com_api.getValue("grdList_SUB", "selected", "doc_title", true);
    var width = $("#frmData_HTML_doc_body2").width(),
        height = $("#frmData_HTML_doc_body2").height() + (100 - ($("#frmData_HTML_doc_body2").height() * 0.06));
    $("#frmData_HTML_doc_body2").printElement({
        printMode: "popup",
        width: width,
        height: height,
        pageTitle: title,
        leaveOpen: false
    });

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
function processOpenAppr(param) {
    if (gw_com_api.getSelectedRow("grdList_SUB") > 0) {
        //if (gw_com_api.getValue("grdList_SUB", "selected", "appr_yn", true) != "대기") {
        //    gw_com_api.messageBox([{ text: "결재 대상이 아닙니다." }]);
        //    return;
        //}
        //var args = {
        //    type: "PAGE", page: "DLG_APPR", title: "결재",
        //    width: 1100, height: 530, scroll: true, open: true, control: true, locate: ["center", "top"]
        //};

        //if (gw_com_module.dialoguePrepare(args) == false) {
        //    args.param = {
        //        ID: gw_com_api.v_Stream.msg_openedDialogue,
        //        data: {
        //            appr_id: gw_com_api.getValue("grdList_SUB", "selected", "appr_id", true),
        //            appr_seq: gw_com_api.getValue("grdList_SUB", "selected", "appr_seq", true)
        //        }
        //    };
        //    gw_com_module.dialogueOpen(args);
        //}
        var args = {
            page: "DLG_APPR",
            param: {
                ID: gw_com_api.v_Stream.msg_openedDialogue,
                data: {
                    appr_id: gw_com_api.getValue("grdList_SUB", "selected", "appr_id", true),
                    appr_seq: gw_com_api.getValue("grdList_SUB", "selected", "appr_seq", true)
                }
            }
        };
        gw_com_module.dialogueOpen(args);
    }
}
//----------
function processSetAppr(param) {

    param.push({ name: "appr_date", value: gw_com_api.getDate() });
    var row = [{
        crud: "U",
        column: param
    }];

    var args = {
        url: "COM",
        user: gw_com_module.v_Session.USR_ID,
        param: [
            {
                query: "DLG_APPR_LINE",
                row: row
            }
        ],
        handler: {
            success: successSetAppr,
            param: {}
        }
    };
    gw_com_module.objSave(args);

}
//----------
function successSetAppr(response, param) {

}
//----------
var EmpInfo = {
    getCompCd: function (param) {
        var rtn = "";
        var args = {
            request: "PAGE",
            url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
                    "?QRY_ID=HRM_DEPT_MASTER" +
                    "&QRY_COLS=comp_cd" +
                    "&CRUD=R" +
                    "&arg_dept_cd=" + param.dept_cd,
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
                    case "DLG_APPR":
                        if (gw_com_api.getSelectedRow("grdList_SUB") < 1) return false;
                        args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                        args.data = {
                            appr_id: gw_com_api.getValue("grdList_SUB", "selected", "appr_id", true),
                            appr_seq: gw_com_api.getValue("grdList_SUB", "selected", "appr_seq", true)
                        }
                        break;
                }
                gw_com_module.streamInterface(args);
            } break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                switch (param.from.page) {
                    case "DLG_APPR":
                        if (param.data != undefined) {
                            var key = [
                                {
                                    KEY: [
                                        { NAME: "appr_box", VALUE: gw_com_api.getValue("grdList_MAIN", "selected", "appr_box", true) }
                                    ],
                                    QUERY: "DLG_APPR_12"
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