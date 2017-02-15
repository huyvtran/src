//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 출하검사내역등록
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
    data: null, logic: {}
};
v_global.logic.PopupImageContainer = new Image();
v_global.logic.PopupImageCaption = new String();
v_global.logic.PopupImageSRC = new String();

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
                    type: "PAGE", name: "검사단계", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "QDM036" }]
                },
                {
                    type: "PAGE", name: "검사구분", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "QDM039" }]
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

            gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { day: -15 }));
            gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate());
            if (gw_com_module.v_Session.USER_TP != "SYS") {
                gw_com_api.setValue("frmOption", 1, "qc_emp_nm", gw_com_module.v_Session.USR_NM);
                gw_com_api.setValue("frmOption", 1, "qc_emp", gw_com_module.v_Session.EMP_NO);
                //gw_com_api.setValue("frmOption", 1, "qc_dept_nm", gw_com_module.v_Session.DEPT_NM);
                //gw_com_api.setValue("frmOption", 1, "qc_dept", gw_com_module.v_Session.DEPT_CD);
            }
        }
    },

    // manage UI. (design section)
    UI: function () {

        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "조회", value: "조회", act: true },
                //{ name: "추가", value: "추가" },
                //{ name: "삭제", value: "삭제" },
                { name: "저장", value: "저장" },
                { name: "통보", value: "통보", icon: "기타" },
                { name: "닫기", value: "닫기" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_IMAGE_B", type: "FREE",
            element: [
                { name: "추가", value: "사진등록", icon: "추가" },
                { name: "삭제", value: "사진삭제", icon: "삭제" }
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
            editable: { focus: "ymd_fr", validate: true },
            content: {
                row: [
                    {
                        element: [
				            {
				                name: "ymd_fr", label: { title: "점검일자 :" }, mask: "date-ymd",
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
                                name: "qc_emp_nm", label: { title: "담당자 :" }, mask: "search",
                                editable: { type: "text", size: 8 }
                            },
                            { name: "qc_emp", label: { title: "담당자 :" }, editable: { type: "text" }, hidden: true },
                            {
                                name: "qc_dept_nm", label: { title: "담당부서 :" }, mask: "search",
                                editable: { type: "text", size: 12 }
                            },
                            { name: "qc_dept", label: { title: "담당부서 :" }, editable: { type: "text" }, hidden: true }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "proj_nm", label: { title: "Project Name : " }, mask: "search",
                                editable: { type: "text", size: 12 }
                            },
                            {
                                name: "proj_no", label: { title: "Project No : " }, mask: "search",
                                editable: { type: "text", size: 10 }, hidden: true
                            },
                            {
                                name: "emp_nm", label: { title: "작성자 :" }, mask: "search",
                                editable: { type: "text", size: 8 }, hidden: true
                            },
                            { name: "emp_no", label: { title: "작성자 :" }, editable: { type: "text" }, hidden: true },
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
            targetid: "grdList_MAIN", query: "QDM_7110_1", title: "출하검사현황",
            caption: true, height: 150, pager: false, show: true, selectable: true, number: true,
            color: { row: true },
            element: [
				{ header: "검사구분", name: "qc_fg_nm", width: 60 },
                { header: "Project Name", name: "proj_nm", width: 130 },
                { header: "Project No.", name: "projkey", width: 80, align: "center" },
				{ header: "검사단계", name: "qc_tp_nm", width: 60, align: "center" },
				{ header: "건수", name: "qc_cnt", width: 40, align: "center" },
				{ header: "점검일자", name: "qc_date", width: 70, align: "center", mask: "date-ymd" },
				{ header: "작성자", name: "ins_usr_nm", width: 40, align: "center" },
				{ header: "담당자", name: "qc_emp_nm", width: 40, align: "center" },
				{ header: "담당부서", name: "qc_dept_nm", width: 80 },
				{ header: "조치예정일", name: "plan_date", width: 70, align: "center", mask: "date-ymd" },
				{ header: "조치완료일", name: "chk_date", width: 70, align: "center", mask: "date-ymd" },
				{
				    header: "조치여부", name: "chk_yn", width: 50, align: "center",
				    format: { type: "checkbox", title: "", value: "1", offval: "0" }
				},
				//{ header: "발생내용", name: "qc_rmk", width: 250 },
                { name: "pchk_no", hidden: true },
                { name: "qc_tp", hidden: true },
                { name: "color", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_MAIN", query: "QDM_7110_2", type: "TABLE", title: "출하검사내역등록",
            show: true, selectable: true, fixed: true, caption: true,
            editable: { bind: "select", focus: "proj_nm", validate: true },
            content: {
                width: { label: 150, field: 200 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "Project Name", format: { type: "label" } },
                            { name: "proj_nm", format: { type: "text" } },
                            { header: true, value: "점검일자", format: { type: "label" } },
                            { name: "qc_date", format: { type: "text" }, mask: "date-ymd" },
                            { header: true, value: "담당자", format: { type: "label" } },
                            { name: "qc_emp_nm", format: { type: "text", width: 50 }, style: { colfloat: "float" } },
                            { name: "qc_dept_nm", format: { type: "text", width: 200 }, style: { colfloat: "floated" } },
                            { name: "qc_emp", editable: { type: "hidden" }, hidden: true },
                            { name: "qc_dept", editable: { type: "hidden" }, hidden: true }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "Project No.", format: { type: "label" } },
                            { name: "projkey", format: { type: "text" } },
                            { header: true, value: "조치예정일", format: { type: "label" } },
                            { name: "plan_date", editable: { type: "text", width: 90, validate: { rule: "dateISO", message: "조치예정일" } }, mask: "date-ymd" },
                            { name: "ins_usr_nm", format: { type: "text", width: 42 }, style: { colfloat: "float" }, hidden: true },
                            { name: "ins_dt", format: { type: "text" }, style: { colfloat: "floated" }, hidden: true },
                            { header: true, value: "조치완료일", format: { type: "label" } },
                            { name: "chk_date", editable: { type: "text", width: 90, validate: { rule: "dateISO", message: "조치완료일" } }, mask: "date-ymd" },
                            { name: "chk_emp", editable: { type: "hidden" }, hidden: true }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "검사단계", format: { type: "label" } },
                            { name: "qc_tp", format: { type: "select", data: { memory: "검사단계" } } },
                            { header: true, value: "재발여부", format: { type: "label" } },
                            {
                                name: "rcr_yn",
                                format: { type: "checkbox", title: "", value: "1", offval: "0" },
                                editable: { type: "checkbox", title: "", value: "1", offval: "0" }
                            },
                            { header: true, value: "조치여부", format: { type: "label" } },
                            {
                                name: "chk_yn",
                                format: { type: "checkbox", title: "", value: "1", offval: "0" },
                                editable: { type: "checkbox", title: "", value: "1", offval: "0" }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "검사구분", format: { type: "label" } },
                            { name: "qc_fg", format: { type: "select", data: { memory: "검사구분" } } },
                            { header: true, value: "건수", format: { type: "label" } },
                            {
                                name: "qc_cnt", mask: "numeric-int",
                                editable: { type: "text", title: "건수", width: 50 }
                            },
                            { header: true, value: "", format: { type: "label" } },
                            { name: "" },
                            { name: "qc_memo1", editable: { type: "hidden" }, hidden: true },
                            { name: "qc_memo2", editable: { type: "hidden" }, hidden: true },
                            { name: "pchk_no", editable: { type: "hidden" }, hidden: true }
                        ]
                    }//,
                    //{
                    //    element: [
                    //        { header: true, value: "부적합현상(요약)", format: { type: "label" } },
                    //        {
                    //            name: "qc_rmk", style: { colspan: 5 },
                    //            format: { type: "textarea", rows: 3, width: 982 }
                    //        }
                    //    ]
                    //}
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_MEMO_A", query: "QDM_7110_2", type: "TABLE", title: "부적합현상",
            width: "100%", show: true, selectable: true, caption: true,
            //editable: { bind: "select", validate: true },
            content: {
                height: 25, width: { field: "100%" },
                row: [
                    {
                        element: [
                            {
                                name: "qc_memo1", format: { type: "textarea", rows: 7, width: 562 },
                                editable: { type: "textarea", rows: 7, width: 562 }
                            },
                            { name: "pchk_no", editable: { type: "hidden" }, hidden: true }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_IMAGE_A", query: "QDM_7110_IMG", type: "TABLE", title: "부적합현상(사진)",
            caption: true, show: true, fixed: true, selectable: true,
            //editable: { bind: "select", validate: true },
            content: {
                width: { field: "100%" }, height: 400,
                row: [
                    {
                        element: [
                              { name: "qc_image1", format: { type: "html", height: 390, top: 2 } },
                              { name: "pchk_no", editable: { type: "hidden" }, hidden: true },
                              { name: "file_id1", editable: { type: "hidden" }, hidden: true },
                              { name: "url1", editable: { type: "hidden" }, hidden: true }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_MEMO_B", query: "QDM_7110_2", type: "TABLE", title: "조치사항",
            width: "100%", show: true, selectable: true, caption: true,
            editable: { bind: "select", validate: true },
            content: {
                height: 25, width: { field: "100%" },
                row: [
                    {
                        element: [
                            {
                                name: "qc_memo2", format: { type: "textarea", rows: 7, width: 562 },
                                editable: { type: "textarea", rows: 7, width: 562 }
                            },
                            { name: "pchk_no", editable: { type: "hidden" }, hidden: true }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_IMAGE_B", query: "QDM_7110_IMG", type: "TABLE", title: "조치사항(사진)",
            caption: true, show: true, fixed: true, selectable: true,
            //editable: { bind: "select", validate: true },
            content: {
                width: { field: "100%" }, height: 400,
                row: [
                    {
                        element: [
                              { name: "qc_image2", format: { type: "html", height: 390, top: 2 } },
                              { name: "pchk_no", editable: { type: "hidden" }, hidden: true },
                              { name: "file_id2", editable: { type: "hidden" }, hidden: true },
                              { name: "url2", editable: { type: "hidden" }, hidden: true }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_FILE", query: "QDM_7110_F", title: "출하검사 첨부파일",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            editable: { multi: true, bind: "select", focus: "file_desc", validate: true },
            element: [
				{ header: "파일명", name: "file_nm", width: 250, align: "left" },
				{ header: "등록부서", name: "upd_dept", width: 100, align: "center", hidden: true },
				{ header: "등록자", name: "upd_usr", width: 60, align: "center", hidden: true },
				{
				    header: "다운로드", name: "download", width: 60, align: "center",
				    format: { type: "link", value: "다운로드" }
				},
				{
				    header: "파일설명", name: "file_desc", width: 380, align: "left",
				    editable: { type: "text", width: 598 }
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
        var args = { targetid: "lyrMenu", element: "통보", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "취소", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_IMAGE_B", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_IMAGE_B", element: "삭제", event: "click", handler: processButton };
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
        var args = { targetid: "grdList_MAIN", grid: true, event: "rowselecting", handler: processRowSelecting };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_MAIN", grid: true, event: "rowselected", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //=====================================================================================
        //var args = { targetid: "frmData_MAIN", event: "itemdblclick", handler: processItemdblClick };
        //gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_MAIN", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmData_MEMO_A", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmData_MEMO_B", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmData_IMAGE_A", event: "itemdblclick", handler: openImage };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmData_IMAGE_B", event: "itemdblclick", handler: openImage };
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
            if (!checkManipulate({})) return;
            processDelete(param);
            break;
        case "저장":
            processSave({});
            break;
        case "통보":
            if (!checkManipulate({})) return;
            if (!checkUpdatable({})) return;
            processSendmail(param);
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
            case "emp_nm":
            case "qc_emp_nm":
                if (param.value.current == "")
                    gw_com_api.setValue(param.object, param.row, (param.element == "emp_nm" ? "emp_no" : "qc_emp"), "");
                break;
            case "qc_dept_nm":
                if (param.value.current == "")
                    gw_com_api.setValue(param.object, param.row, "qc_dept", "");
                break;
            case "proj_nm":
                if (param.value.current == "")
                    gw_com_api.setValue(param.object, param.row, "proj_no", "");
                break;
        }
    } else if (param.object == "frmData_MAIN") {
        switch (param.element) {
            case "chk_yn":
                if (param.value.current == "1") {
                    if (gw_com_api.getValue(param.object, param.row, "chk_date").replace(/\s+$/, "") == "")
                        gw_com_api.setValue(param.object, param.row, "chk_date", gw_com_api.getDate());
                } else {
                    if (gw_com_api.getValue(param.object, param.row, "chk_date") != "")
                        gw_com_api.setValue(param.object, param.row, "chk_date", "");
                }
                break;
            case "chk_date":
                gw_com_api.setValue(param.object, param.row, "chk_emp", (param.value.current == "" ? "" : gw_com_module.v_Session.EMP_NO));
                if (param.value.current == "") {
                    if (gw_com_api.getValue(param.object, param.row, "chk_yn") == "1")
                        gw_com_api.setValue(param.object, param.row, "chk_yn", "0");
                } else {
                    if (gw_com_api.getValue(param.object, param.row, "chk_yn") == "0")
                        gw_com_api.setValue(param.object, param.row, "chk_yn", "1");
                }
                break;
        }
    } else if (param.object == "frmData_MEMO_A" || param.object == "frmData_MEMO_B") {
        gw_com_api.setValue("frmData_MAIN", 1, param.element, param.value.current);
        if (checkCRUD() == "retrieve") {
            gw_com_api.setCRUD("frmData_MAIN", 1, "modify");
        }
    }

}
//----------
function processItemdblClick(param) {

    if (param.object == "frmData_MAIN") {
        if (param.element == "proj_nm" || param.element == "qc_emp_nm" || param.element == "qc_dept_nm") {
            processFind(param);
        }
    } else if (param.object == "frmOption") {
        if (param.element == "emp_nm" || param.element == "qc_emp_nm" || param.element == "qc_dept_nm" || param.element == "proj_no" || param.element == "proj_nm") {
            processFind(param);
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
    if (param.object == "IMG") {
        args = {
            source: {
                type: "GRID", id: "grdList_MAIN", row: "selected",
                element: [
                    { name: "pchk_no", argument: "arg_pchk_no" }
                ]
            },
            target: [
                { type: "FORM", id: "frmData_IMAGE_B", edit: true }
            ]
        };
    } else if (param.object == "grdList_MAIN") {
        args = {
            source: {
                type: param.type, id: param.object, row: param.row,
                element: [
                    { name: "pchk_no", argument: "arg_pchk_no" }
                ],
                argument: [
                    { name: "arg_data_tp", value: "QDM-PCHK" },
                    { name: "arg_data_key", value: gw_com_api.getValue(param.object, param.row, "pchk_no", true) },
                    { name: "arg_data_seq", value: -1 }
                ]
            },
            target: [
                { type: "FORM", id: "frmData_MAIN", edit: true },
                { type: "FORM", id: "frmData_MEMO_A", edit: true },
                { type: "FORM", id: "frmData_IMAGE_A", edit: true },
                { type: "FORM", id: "frmData_MEMO_B", edit: true },
                { type: "FORM", id: "frmData_IMAGE_B", edit: true },
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
                    { name: "emp_no", argument: "arg_emp_no" },
                    { name: "qc_emp", argument: "arg_qc_emp" },
                    { name: "qc_dept", argument: "arg_qc_dept" },
                    { name: "proj_no", argument: "arg_proj_no" }
                ],
                remark: [
                    { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }] },
                    { element: [{ name: "qc_emp_nm" }] },
                    { element: [{ name: "qc_dept_nm" }] },
                    { element: [{ name: "proj_nm" }] },
                    { element: [{ name: "emp_nm" }] }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_MAIN", select: true }
            ],
            clear: [
                { type: "FORM", id: "frmData_MAIN" },
                { type: "FORM", id: "frmData_MEMO_A" },
                { type: "FORM", id: "frmData_IMAGE_A" },
                { type: "FORM", id: "frmData_MEMO_B" },
                { type: "FORM", id: "frmData_IMAGE_B" },
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

    if (param.object == "lyrMenu") {
        if (!checkUpdatable({ check: true })) return;
        var args = {
            targetid: "frmData_MAIN", edit: true, updatable: true,
            data: [
                { name: "qc_date", value: gw_com_api.getDate() },
                { name: "ins_usr_nm", value: gw_com_module.v_Session.USR_NM }
            ]
        };
        gw_com_module.formInsert(args);
        args = {
            targetid: "frmData_MEMO_A", edit: true, updatable: true
        };
        gw_com_module.formInsert(args);
        //args = {
        //    targetid: "frmData_IMAGE_A", edit: true, updatable: true
        //};
        //gw_com_module.formInsert(args);
        args = {
            targetid: "frmData_MEMO_B", edit: true, updatable: true
        };
        gw_com_module.formInsert(args);
        //args = {
        //    targetid: "frmData_IMAGE_B", edit: true, updatable: true
        //};
        //gw_com_module.formInsert(args);
    } else if (param.object == "lyrMenu_FILE") {
        if (!checkManipulate({})) return;
        if (!checkUpdatable({ check: true })) return false;
        var pchk_no = gw_com_api.getValue("frmData_MAIN", 1, "pchk_no");
        if (pchk_no == "") {
            gw_com_api.messageBox([{ text: "NOMASTER" }]);
            return;
        }

        // Parameter 설정
        var type = (param.object == "lyrMenu_FILE" ? "QDM-PCHK" : "QDM-PCHK-IMG");
        v_global.logic.FileUp = {
            type: type,
            key: pchk_no,
            seq: 0,
            user: gw_com_module.v_Session.USR_ID,
            crud: "C", rev: 0, revise: false
        };

        var args = {
            type: "PAGE", page: "DLG_FileUpload", title: "파일 업로드", datatype: type,
            width: 650, height: 260, open: true, locate: ["center", "bottom"]
        }; //

        if (gw_com_module.dialoguePrepare(args) == false) {
            var args = {
                page: "DLG_FileUpload",
                param: { ID: gw_com_api.v_Stream.msg_upload_ASFOLDER, data: v_global.logic.FileUp }
            };
            gw_com_module.dialogueOpen(args);
        }
    } else {
        if (!checkManipulate({})) return;
        if (!checkUpdatable({ check: true })) return false;
        var pchk_no = gw_com_api.getValue("frmData_MAIN", 1, "pchk_no");
        if (pchk_no == "") {
            gw_com_api.messageBox([{ text: "NOMASTER" }]);
            return;
        }

        // Parameter 설정
        var type = "QDM-PCHK-IMG";
        v_global.logic.FileUp = {
            type: type,
            key: pchk_no,
            seq: 2,
            user: gw_com_module.v_Session.USR_ID
        };

        var args = {
            type: "PAGE", page: "w_upload_image", title: "이미지 업로드",
            width: 650, height: 200, open: true, locate: ["center", 550]
        };

        if (gw_com_module.dialoguePrepare(args) == false) {
            var args = {
                page: "w_upload_image",
                param: {
                    ID: gw_com_api.v_Stream.msg_openedDialogue,
                    data: v_global.logic.FileUp
                }
            };
            gw_com_module.dialogueOpen(args);
        }
    }

}
//----------
function processDelete(param) {

    if (param.object == "lyrMenu") {
        var status = checkCRUD({});
        if (status == "initialize" || status == "create") {
            processRetrieve({ object: "grdList_MAIN", row: "selected", type: "GRID" });
        } else {
            v_global.process.handler = processRemove;
            gw_com_api.messageBox([{ text: "REMOVE" }], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO");
            return;
        }
    } else if (param.object == "lyrMenu_FILE") {
        var args = { targetid: "grdData_FILE", row: "selected", select: true };
        gw_com_module.gridDelete(args);
    } else {
        var key = gw_com_api.getValue("frmData_MAIN", 1, "pchk_no");
        var file_id = gw_com_api.getValue("frmData_IMAGE_B", 1, "file_id2");
        if (key == "" || file_id == "") {
            gw_com_api.messageBox([
                { text: "삭제할 사진이 없습니다." }
            ]);
            return;
        }
        var args = {
            url: "COM",
            user: gw_com_module.v_Session.USR_ID,
            handler: {
                success: successDelete
            }
        };
        var param = [
            {
                query: "QDM_7110_2",
                row: [{
                    crud: "U",
                    column: [
                        { name: "pchk_no", value: key },
                        { name: "qc_image2", value: "" }
                    ]
                }]
            },
            {
                query: "QDM_7110_F",
                row: [{
                    crud: "D",
                    column: [
                        { name: "file_id", value: file_id }
                    ]
                }]
            }
        ];
        args.param = param;
        gw_com_module.objSave(args);
    }

}
//----------
function successDelete(response, param) {

    processRetrieve({ object: "IMG" });

}
//----------
function processRemove(param) {

    var args = {
        url: "COM",
        target: [
            {
                type: "FORM", id: "frmData_MAIN",
                key: {
                    element: [
                        { name: "pchk_no" }
                    ]
                }
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

    var args = {
        url: "COM",
        target: [
			{ type: "FORM", id: "frmData_MAIN" },
            { type: "GRID", id: "grdData_FILE" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    //
    if (gw_com_api.getValue("frmData_MAIN", 1, "plan_date").replace(/\s+$/, "") == "") {
        gw_com_api.setError(true, "frmData_MAIN", 1, "plan_date", false, false);
        gw_com_api.messageBox([{ text: "NOVALIDATE" }]);
        return false;
    }

    if (gw_com_api.getValue("frmData_MAIN", 1, "chk_yn") == "1" &&
        gw_com_api.getValue("frmData_MAIN", 1, "chk_date").replace(/\s+$/, "") == "") {
        gw_com_api.setError(true, "frmData_MAIN", 1, "chk_date", false, false);
        gw_com_api.messageBox([{ text: "NOVALIDATE" }]);
        return false;
    }
    gw_com_api.setError(false, "frmData_MAIN", 1, "plan_date", false, false);
    gw_com_api.setError(false, "frmData_MAIN", 1, "chk_date", false, false);

    args.handler = {
        success: successSave,
        param: param
    };
    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    response[0].QUERY = "QDM_7110_1";
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

    return gw_com_api.getCRUD("frmData_MAIN");

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

    if (!checkManipulate({})) return;
    v_global.event.type = param.type;
    v_global.event.object = param.object;
    v_global.event.row = param.row;
    v_global.event.element = param.element;
    v_global.logic.memo_title = (param.object == "frmData_MEMO_A" ? "부적합현상" : "조치사항");
    //var args = {
    //    type: "PAGE", page: "w_edit_html", title: "상세 내용",
    //    width: 760, height: 600,
    //    locate: ["center", "center"],
    //    open: true
    //};
    //if (gw_com_module.dialoguePrepare(args) == false) {
    //    var args = {
    //        page: "w_edit_html",
    //        param: {
    //            ID: gw_com_api.v_Stream.msg_edit_HTML,
    //            data: {
    //                edit: true,
    //                title: v_global.logic.memo_title,
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
            title: v_global.logic.memo_title,
            html: gw_com_api.getValue(v_global.event.object, v_global.event.row, v_global.event.element)
        }
    };
    gw_com_api.openWindow(args);

}
//----------
function processFind(param) {

    v_global.event.type = param.type;
    v_global.event.object = param.object;
    v_global.event.row = param.row;
    v_global.event.element = param.element;
    v_global.logic.search = null;

    var args;
    switch (param.element) {
        case "proj_nm":
        case "proj_no":
            v_global.event.cd = (param.object == "frmOption" ? "proj_no" : "projkey");
            v_global.event.nm = "proj_nm";
            if (param.object == "frmOption") {
                v_global.logic.search = {
                    proj_no: (param.element == "proj_no" ? gw_com_api.getValue(param.object, param.row, param.element) : ""),
                    proj_nm: (param.element == "proj_nm" ? gw_com_api.getValue(param.object, param.row, param.element) : "")
                };
            }
            args = {
                type: "PAGE", page: "w_find_proj_scm", title: "Project 검색",
                width: 650, height: 460, open: true,
                id: gw_com_api.v_Stream.msg_selectProject_SCM
            };
            break;
        case "qc_emp_nm":
        case "emp_nm":
            v_global.event.cd = (param.element == "qc_emp_nm" ? "qc_emp" : "emp_no");
            v_global.event.nm = param.element;
            if (param.object == "frmOption") {
                v_global.logic.search = {
                    emp_no: (param.element == "emp_no" ? gw_com_api.getValue(param.object, param.row, param.element) : ""),
                    emp_nm: (param.element == "emp_nm" || param.element == "qc_emp_nm" ? gw_com_api.getValue(param.object, param.row, param.element) : "")
                };
            }
            args = {
                type: "PAGE", page: "w_find_emp", title: "사원 검색",
                width: 600, height: 460, open: true,
                //locate: ["center", (param.object == "frmOption" ? "top" : "center")],
                id: gw_com_api.v_Stream.msg_selectEmployee
            };
            break;
        case "qc_dept_nm":
            v_global.event.cd = "qc_dept";
            v_global.event.nm = param.element;
            v_global.logic.search = {
                dept_cd: (param.element == "qc_dept" ? gw_com_api.getValue(param.object, param.row, param.element) : ""),
                dept_nm: (param.element == "qc_dept_nm" ? gw_com_api.getValue(param.object, param.row, param.element) : "")
            };
            args = {
                type: "PAGE", page: "w_find_dept", title: "부서 검색",
                width: 600, height: 450, open: true,
                //locate: ["center", (param.object == "frmOption" ? "top" : "center")],
                id: gw_com_api.v_Stream.msg_selectDepartment
            };
            break;
        default:
            return;
            break;
    }
    if (gw_com_module.dialoguePrepare(args) == false) {
        args = { page: args.page, param: { ID: args.id, data: v_global.logic.search } };
        gw_com_module.dialogueOpen(args);
    }

}
//----------
function processSendmail(param) {

    var type = "CHK";
    var key = gw_com_api.getValue("frmData_MAIN", 1, "pchk_no");
    var args = {
        url: "COM",
        subject: MailInfo.getSubject({ type: type, key: key }),
        body: MailInfo.getBody({ type: type, key: key }),
        to: MailInfo.getTo({ type: type, key: key }),
        edit: true
    };
    gw_com_module.sendMail(args);

}
//----------
function openImage(param) {

    var imagesrc = gw_com_api.getValue(param.object, param.row, (param.object == "frmData_IMAGE_A" ? "url1" : "url2"));
    if (imagesrc == "") { return; }
    var loadDelay = v_global.logic.PopupImageSRC.length ? 1 : 750;
    v_global.logic.PopupImageSRC = imagesrc;
    v_global.logic.PopupImageCaption = (param.object == "frmData_IMAGE_A" ? "◈ 부적합현상" : "◈ 조치사항");
    v_global.logic.PopupImageContainer.src = v_global.logic.PopupImageSRC;
    setTimeout("PopupImageDisplay()", loadDelay);

}
//----------
function PopupImageDisplay() {

    var iw = parseInt(v_global.logic.PopupImageContainer.width);
    var ih = parseInt(v_global.logic.PopupImageContainer.height);
    var ww = iw + 50;
    var hh = ih + 100;
    var properties = 'height=' + hh + ',width=' + ww + ',resizable=yes,location=no';
    var picture = window.open('', '', properties);
    picture.document.writeln('<html><head><title>' + v_global.logic.PopupImageCaption + '</title>');
    picture.document.writeln('<script language="JavaScript"> function CloseMe() { self.close(); } <' + '/script>');
    picture.document.write('<' + '/head><body onBlur="CloseMe()"><center>');
    picture.document.write('<p style="font-family: 굴림체; font-size: 9pt">' + v_global.logic.PopupImageCaption + '<' + '/p>');
    picture.document.write('<img src="' + v_global.logic.PopupImageSRC + '" width="' + iw + '" height="' + ih + '" border="0" /><' + 'br /><' + 'br />');
    picture.document.write('<input type="button" onClick="window.close()" value="닫기" />');
    picture.document.writeln('<' + '/center><' + '/body><' + '/html>');

}
//----------
var MailInfo = {
    getSubject: function (param) {
        var rtn = "";
        var args = {
            request: "PAGE",
            url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
                    "?QRY_ID=QDM_7110_MAIL" +
                    "&QRY_COLS=val" +
                    "&CRUD=R" +
                    "&arg_field=subject&arg_type=" + param.type + "&arg_key=" + param.key,
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
                    "?QRY_ID=QDM_7110_MAIL" +
                    "&QRY_COLS=val" +
                    "&CRUD=R" +
                    "&arg_field=body&arg_type=" + param.type + "&arg_key=" + param.key,
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
                    "?QRY_ID=QDM_7110_MAIL2" +
                    "&QRY_COLS=name,value" +
                    "&CRUD=R" +
                    "&arg_field=&arg_type=" + param.type + "&arg_key=" + param.key,
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
                    case "w_find_emp":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectEmployee;
                            args.data = v_global.logic.search;
                        }
                        break;
                    case "w_find_dept":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectDepartment;
                            args.data = v_global.logic.search;
                        }
                        break;
                    case "DLG_FileUpload":
                        {
                            args.ID = gw_com_api.v_Stream.msg_upload_ASFOLDER;
                            args.data = v_global.logic.FileUp;
                        }
                        break;
                    case "w_upload_image":
                        {
                            args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                            args.data = v_global.logic.FileUp;
                        }
                        break;
                    case "w_edit_html":
                        {
                            args.ID = gw_com_api.v_Stream.msg_edit_HTML;
                            args.data = {
                                edit: true,
                                title: v_global.logic.memo_title,
                                html: gw_com_api.getValue(v_global.event.object, v_global.event.row, v_global.event.element)
                            };
                        }
                        break;
                    case "w_find_proj_scm":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectProject_SCM;
                            args.data = v_global.logic.search;
                        }
                        break;
                }
                gw_com_module.streamInterface(args);
            } break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                switch (param.from.page) {
                    case "w_upload_image":
                        if (param.data != undefined) {
                            var key = gw_com_api.getValue("frmData_MAIN", 1, "pchk_no");
                            var args = {
                                url: "COM",
                                user: gw_com_module.v_Session.USR_ID,
                                nomessage: true,
                                param: [
                                    {
                                        query: "QDM_7110_2",
                                        row: [{
                                            crud: "U",
                                            column: [
                                                { name: "pchk_no", value: key },
                                                { name: "qc_image2", value: param.data[0].KEY[0].VALUE }
                                            ]
                                        }]
                                    }
                                ]
                            };
                            $.ajaxSetup({ async: false });
                            gw_com_module.objSave(args);
                            $.ajaxSetup({ async: true });

                            processRetrieve({ object: "IMG" });
                        }
                        break;
                }
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_edited_HTML:
            {
                if (param.data.update) {
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.element, param.data.html);
                    gw_com_api.setValue("frmData_MAIN", 1, v_global.event.element, param.data.html);
                    gw_com_api.setUpdatable("frmData_MAIN");
                }
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedProject_SCM:
            {
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        v_global.event.cd,
			                        param.data.proj_no,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        v_global.event.nm,
			                        param.data.proj_nm,
			                        (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedEmployee:
            {
                if (param.data != undefined) {
                    gw_com_api.setValue(
                                        v_global.event.object,
                                        v_global.event.row,
                                        v_global.event.nm,
                                        param.data.emp_nm,
                                        (v_global.event.type == "GRID") ? true : false);
                    gw_com_api.setValue(
                                        v_global.event.object,
                                        v_global.event.row,
                                        v_global.event.cd,
                                        param.data.emp_no,
                                        (v_global.event.type == "GRID") ? true : false);
                    if (v_global.event.cd == "qc_emp") {
                        gw_com_api.setValue(
                                            v_global.event.object,
                                            v_global.event.row,
                                            "qc_dept_nm",
                                            param.data.dept_nm,
                                            (v_global.event.type == "GRID") ? true : false);
                        gw_com_api.setValue(
                                            v_global.event.object,
                                            v_global.event.row,
                                            "qc_dept",
                                            param.data.dept_cd,
                                            (v_global.event.type == "GRID") ? true : false);
                    }
                }
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedDepartment:
            {
                gw_com_api.setValue(
                                    v_global.event.object,
                                    v_global.event.row,
                                    v_global.event.nm,
                                    param.data.dept_nm,
                                    (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(
                                    v_global.event.object,
			                        v_global.event.row,
			                        v_global.event.cd,
			                        param.data.dept_cd,
			                        (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });

            }
            break;
        case gw_com_api.v_Stream.msg_uploaded_ASFOLDER:
            {
                closeDialogue({ page: param.from.page });
                var args = {
                    source: {
                        type: "INLINE",
                        argument: [
                            { name: "arg_data_tp", value: "QDM-PCHK" },
                            { name: "arg_data_key", value: gw_com_api.getValue("frmData_MAIN", 1, "pchk_no") },
                            { name: "arg_data_seq", value: -1 }
                        ]
                    },
                    target: [
                        { type: "GRID", id: "grdData_FILE" }
                    ]
                };
                gw_com_module.objRetrieve(args);
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//