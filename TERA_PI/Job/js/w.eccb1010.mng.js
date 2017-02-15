﻿
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

        v_global.logic.pcn_yn = gw_com_api.getPageParameter("issue_no").substr(0, 3) == "PCN" ? true : false;

        // prepare dialogue.
        var args = { type: "PAGE", page: "IFProcess", path: "../Master/", title: "그룹웨어 로그인",
            width: 430, height: 90, locate: ["center", 200]
        };
        gw_com_module.dialoguePrepare(args);

        // set data.
        var args = {
            request: [
                //{
                //    type: "PAGE", name: "진행상태", query: "dddw_zcode",
                //    param: [
                //        { argument: "arg_hcode", value: "ECCB03" }
                //    ]
                //},
                //{
                //    type: "PAGE", name: "조치시점", query: "dddw_zcode",
                //    param: [
                //        { argument: "arg_hcode", value: "ECCB10" }
                //    ]
                //},
                //{
                //    type: "PAGE", name: "분류1", query: "dddw_zcode",
                //    param: [
                //        { argument: "arg_hcode", value: "ECCB05" }
                //    ]
                //},
                //{ type: "PAGE", name: "분류2_IN", query: "dddw_ecr_module" },
                //{
                //    type: "PAGE", name: "분류2", query: "DDDW_CM_CODED_A",
                //    param: [
                //        { argument: "arg_hcode", value: "ECCB06" }
                //    ]
                //},
                //{
                //    type: "PAGE", name: "분류3", query: "dddw_zcode",
                //    param: [
                //        { argument: "arg_hcode", value: "ECCB07" }
                //    ]
                //},
                {
                    type: "PAGE", name: "DEPT_AREA_IN", query: "dddw_deptarea_in",
                    param: [{ argument: "arg_type", value: gw_com_module.v_Session.DEPT_AUTH }]
                }//,
                //{ type: "PAGE", name: "부서", query: "dddw_dept" },
                //{ type: "PAGE", name: "실행요청부서", query: "dddw_dept_eccb1" },
                //{ type: "PAGE", name: "사원", query: "dddw_emp" }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // go next.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function start() {

            gw_job_process.UI();

        }

    },
    //#endregion

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage UI. (design section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //#region
    UI: function () {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // define UI.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //=====================================================================================
        var args = { targetid: "lyrMenu_1", type: "FREE",
            element: [
                { name: "미리보기", value: "미리보기", icon: "출력" },
				{ name: "저장", value: "저장" },
				{ name: "닫기", value: "닫기" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_내역", query: "w_eccb1010_M_1", type: "TABLE", title: "제안 내역",
            caption: true, show: true, selectable: true,
            editable: { bind: "select", focus: "ecr_title", validate: true },
            content: {
                width: { label: 100, field: 200 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "ECR No.", format: { type: "label" } },
                            { name: "ecr_no", editable: { type: "hidden" } },
                            { header: true, value: "관련근거", format: { type: "label" } },
                            { name: "issue_no", editable: { type: "hidden" } },
                            { header: true, value: "사업부", format: { type: "label" } },
                            { name: "dept_area", format: { type: "select", data: { memory: "DEPT_AREA_IN" } } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "개선제안명", format: { type: "label" } },
                            { name: "ecr_title", format: { width: 630 }, style: { colspan: 3 } },
                            { header: true, value: "작성자/부서", format: { type: "label" } },
                            {
                                name: "ecr_emp_nm", style: { colfloat: "float" }, display: true,
                                format: { type: "text", width: 60 }
                            },
                            {
                                name: "ecr_dept_nm", style: { colfloat: "floated" }, display: true,
                                format: { type: "text", width: 120 }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "제안개요", format: { type: "label" } },
                            { name: "ecr_desc", format: { width: 630 }, style: { colspan: 3 } },
                            { header: true, value: "작성일자", format: { type: "label" } },
                            { name: "ecr_dt", mask: "date-ymd" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "조치요구시점", format: { type: "label" } },
                            { name: "act_time_text", format: { width: 300 }, style: { colspan: 3 } },
                            //{
                            //    name: "act_time_etc", style: { colfloat: "floated" }, display: true,
                            //    format: { width: 0 }, editable: { type: "text", width: 467 }
                            //},
                            { header: true, value: "조치요구일", format: { type: "label" } },
                            { name: "act_rqst_date", mask: "date-ymd" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "실행요청부서", format: { type: "label" } },
                            { name: "rqst_dept_nm" },
                            { header: true, value: "접수부서", format: { type: "label" } },
                            { name: "rcvd_dept_nm" },
                            { header: true, value: "접수일자", format: { type: "label" } },
                            { name: "rcvd_dt", mask: "date-ymd" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "분류", format: { type: "label" } },
                            { name: "act_region1_text", format: { width: 200 }, style: { colspan: 5, colfloat: "float" } },
                            { name: "act_module1_text", format: { width: 300 }, style: { colfloat: "floating" } },
                            { name: "act_module1_etc", format: { width: 155 }, style: { colfloat: "floating" } },
                            { name: "mp_class1_text", format: { width: 200 }, style: { colfloat: "floating" } },
                            { name: "mp_class1_etc", format: { width: 155 }, style: { colfloat: "floated" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "", format: { type: "label" } },
                            { name: "act_region2_text", format: { width: 200 }, style: { colspan: 5, colfloat: "float" } },
                            { name: "act_module2_text", format: { width: 300 }, style: { colfloat: "floating" } },
                            { name: "act_module2_etc", format: { width: 155 }, style: { colfloat: "floating" } },
                            { name: "mp_class2_text", format: { width: 200 }, style: { colfloat: "floating" } },
                            { name: "mp_class2_etc", format: { width: 155 }, style: { colfloat: "floated" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "", format: { type: "label" } },
                            { name: "act_region3_text", format: { width: 200 }, style: { colspan: 5, colfloat: "float" } },
                            { name: "act_module3_text", format: { width: 300 }, style: { colfloat: "floating" } },
                            { name: "act_module3_etc", format: { width: 155 }, style: { colfloat: "floating" } },
                            { name: "mp_class3_text", format: { width: 200 }, style: { colfloat: "floating" } },
                            { name: "mp_class3_etc", format: { width: 155 }, style: { colfloat: "floated" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "개선예상효과", format: { type: "label" } },
                            {
                                name: "act_effect", style: { colspan: 3 },
                                format: { type: "textarea", rows: 5, width: 630 }
                            },
                            { header: true, value: "진행상태", format: { type: "label" } },
                            { name: "pstat_nm" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "설계변경", format: { type: "label" } },
                            {
                                name: "eco_yn",
                                format: { type: "checkbox", value: "1", offval: "0", title: "" },
                                editable: { type: "checkbox", value: "1", offval: "0", title: "" }
                            },
                            { header: true, value: "담당자", format: { type: "label" } },
                            {
                                name: "eco_emp_nm", format: { width: 200 }, mask: "search",
                                editable: { type: "text" }
                            },
                            { name: "eco_emp", editable: { type: "hidden" }, hidden: true },
                            { header: true, value: "담당부서", format: { type: "label" } },
                            { name: "eco_dept_nm", editable: { type: "hidden" }, display: true },
                            { name: "eco_dept", editable: { type: "hidden" }, hidden: true },
                            { name: "pstat", editable: { type: "hidden" }, hidden: true },
                            { name: "gw_adate", style: { colfloat: "floated" } },
                            { name: "gw_astat", hidden: true },
                            { name: "gw_key", hidden: true },
                            { name: "gw_seq", hidden: true }
                        ]
                    }
                ]
            }
        };
        //----------
        if (v_global.logic.pcn_yn) {
            args.content.row.push({
                element: [
                    { header: true, value: "회사명", format: { type: "label" } },
                    { name: "comp_nm", format: { type: "text", width: 150 }, style: { colspan: 5 }, display: true }
                ]
            });
        }
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_모델", query: "w_eccb1010_S_1", title: "적용 모델",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            editable: { multi: true, bind: "select", focus: "prod_type", validate: true },
            element: [
                {
                    header: "제품유형", name: "prod_type", width: 100, align: "center",
                    editable: { type: "hidden" }
                },
                { header: "고객사", name: "cust_nm", width: 100, align: "center" },
                {
                    header: "Line", name: "cust_dept", width: 120, align: "center",
                    editable: { type: "hidden" }
                },
                {
                    header: "Process", name: "cust_proc", width: 120, align: "center",
                    editable: { type: "hidden" }
                },
                { header: "제품코드", name: "prod_cd", width: 100, align: "center" },
                { header: "제품명", name: "prod_nm", width: 300 },
                { name: "cust_cd", hidden: true, editable: { type: "hidden" } },
                { name: "prod_key", hidden: true, editable: { type: "hidden" } },
                { name: "model_seq", hidden: true, editable: { type: "hidden" } },
                { name: "root_seq", hidden: true, editable: { type: "hidden" } },
                { name: "root_no", hidden: true, editable: { type: "hidden" } }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_메모A", query: "w_eccb1010_S_2_1", type: "TABLE", title: "개선 전 (현상 및 문제점)",
            caption: true, show: true, fixed: true, selectable: true,
            editable: { bind: "select", validate: true },
            content: {
                width: { field: "100%" }, height: 370,
                row: [
                    {
                        element: [
                            { name: "memo_html", format: { type: "html", height: 370, top: 5 } },
                            { name: "memo_text", hidden: true, editable: { type: "hidden" } },
                            { name: "memo_cd", hidden: true, editable: { type: "hidden" } },
                            { name: "root_seq", hidden: true, editable: { type: "hidden" } },
                            { name: "root_no", hidden: true, editable: { type: "hidden" } }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_메모B", query: "w_eccb1010_S_2_2", type: "TABLE", title: "개선 후 (안)",
            caption: true, show: true, fixed: true, selectable: true,
            editable: { bind: "select", validate: true },
            content: { width: { field: "100%" }, height: 370,
                row: [
                    {
                        element: [
                            { name: "memo_html", format: { type: "html", height: 370, top: 5 } },
                            { name: "memo_text", hidden: true, editable: { type: "hidden" } },
                            { name: "memo_cd", hidden: true, editable: { type: "hidden" } },
                            { name: "root_seq", hidden: true, editable: { type: "hidden" } },
                            { name: "root_no", hidden: true, editable: { type: "hidden" } }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_첨부", query: "w_eccb1010_S_3", title: "첨부 문서",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            editable: { multi: true, bind: "select", focus: "file_desc", validate: true },
            element: [
                { header: "파일명", name: "file_nm", width: 300, align: "left" },
                {
                    header: "다운로드", name: "download", width: 60, align: "center",
                    format: { type: "link", value: "다운로드" }
                },
                {
                    header: "파일설명", name: "file_desc", width: 300, align: "left",
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
                { type: "FORM", id: "frmData_내역", offset: 8 },
                { type: "GRID", id: "grdData_모델", offset: 8 },
                { type: "GRID", id: "grdData_첨부", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        //----------
        gw_com_module.informSize();

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // go next.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        gw_job_process.procedure();

    },
    //#endregion

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage process. (program section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //#region
    procedure: function () {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // define event.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		
		//----------
        var args = { targetid: "lyrMenu_1", element: "미리보기", event: "click", handler: click_lyrMenu_1_미리보기 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1", element: "저장", event: "click", handler: click_lyrMenu_1_저장 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1", element: "닫기", event: "click", handler: click_lyrMenu_1_닫기 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_내역", event: "itemchanged", handler: itemchanged_frmData_내역 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_내역", event: "itemdblclick", handler: itemdblclick_frmData_내역 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_내역", event: "keydown", element: "eco_emp_nm", handler: itemkeypress_frmData_내역 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_첨부", grid: true, element: "download", event: "click", handler: click_grdData_첨부_download };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		
		//---------
        function click_lyrMenu_1_미리보기() {
            //alert(gw_com_api.getPageID());
            //processPrint({});
            //if (!checkManipulate({})) return;
            //if (!checkUpdatable({ check: true })) return false;

            //processApprove({});  -- 현재의 ecr_no 를 받아와야한다. 
            var status = checkCRUD({});
            //alert(status);
            if (status == "retrieve") {
                processPrint({});
            }
            else {
                if (!checkManipulate({})) return;
                if (!checkUpdatable({ check: true })) return false;
            }
        }
        //----------
        function click_lyrMenu_1_저장(ui) {

            processSave({});

        }
        //----------
        function click_lyrMenu_1_닫기(ui) {

            v_global.process.handler = processClose;

            if (!checkUpdatable({})) return;

            processClose({});

        }
        //----------
        function itemchanged_frmData_내역(ui) {

            switch (ui.element) {
                case "eco_yn":
                    {
                        if (ui.value.current == "0") {
                            gw_com_api.setValue(ui.object, ui.row, "eco_emp", "", false, true, false);
                            gw_com_api.setValue(ui.object, ui.row, "eco_emp_nm", "", false, false, false);
                            gw_com_api.setValue(ui.object, ui.row, "eco_dept", "", false, true, false);
                            gw_com_api.setValue(ui.object, ui.row, "eco_dept_nm", "", false, false, false);
                        }
                    }
                    break;
                case "eco_emp_nm":
                    {
                        gw_com_api.setValue(ui.object, ui.row, "eco_yn", ui.value.current == "" ? "0" : "1");
                    }
                    break;
            }

        };
        //----------
        function itemdblclick_frmData_내역(ui) {

            switch (ui.element) {
                case "eco_emp_nm":
                    {
                        processPopup(ui);
                    }
                    break;
            }

        };
        //----------
        function itemkeypress_frmData_내역(ui) {

            if (event.keyCode == 46) {
                // delete
                gw_com_api.setValue(ui.object, ui.row, ui.element, "");
            }

        }
        //----------
        function click_grdData_첨부_download(ui) {

            var args = {
                source: {
                    id: "grdData_첨부",
                    row: ui.row
                },
                targetid: "lyrDown"
            };
            gw_com_module.downloadFile(args);

        }
        //----------

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_module.startPage();
        //----------
        if (v_global.process.param != "" && gw_com_api.getPageParameter("ecr_no") != "") {
            v_global.logic.key = gw_com_api.getPageParameter("ecr_no");
            processRetrieve({ key: v_global.logic.key });
        }
        else
            processClose({});

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

    return gw_com_api.getCRUD("frmData_내역");

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
            { type: "FORM", id: "frmData_내역" },
			{ type: "GRID", id: "grdData_모델" },
            { type: "FORM", id: "frmData_메모A" },
            { type: "FORM", id: "frmData_메모B" },
			{ type: "GRID", id: "grdData_첨부" }
		],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function checkRemovable(param) {

    var status = checkCRUD({});
    if (status == "initialize" || status == "create")
        processDelete({});
    else
        gw_com_api.messageBox([
            { text: "REMOVE" }
        ], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO");

}
//----------
function processRetrieve(param) {

    var args = {
        source: { type: "INLINE", argument: [{ name: "arg_ecr_no", value: param.key }] },
        target: [
			{ type: "FORM", id: "frmData_내역" },
            { type: "GRID", id: "grdData_모델" },
            { type: "FORM", id: "frmData_메모A" },
            { type: "FORM", id: "frmData_메모B" },
            { type: "GRID", id: "grdData_첨부" }
        ],
        handler: {
            complete: processRetrieveEnd,
            param: param
        },
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {

    gw_com_module.formEdit({ targetid: "frmData_내역", edit: true });

}
//----------
function processInsert(param) {

    var args = { targetid: "frmData_내역", edit: true, updatable: true,
        data: [
            { name: "ecr_emp", value: gw_com_module.v_Session.EMP_NO },
            { name: "ecr_emp_nm", value: gw_com_module.v_Session.USR_NM },
            { name: "ecr_dept", value: gw_com_module.v_Session.DEPT_CD },
            { name: "ecr_dept_nm", value: gw_com_module.v_Session.DEPT_NM },
            { name: "dept_area", value: gw_com_module.v_Session.DEPT_AREA },
            { name: "ecr_dt", value: gw_com_api.getDate("") },
            { name: "issue_no", value: gw_com_api.getPageParameter("issue_no") }
        ],
        clear: [
            { type: "GRID", id: "grdData_모델" },
            { type: "FORM", id: "frmData_메모A" },
            { type: "FORM", id: "frmData_메모B" },
            { type: "GRID", id: "grdData_첨부" }
        ]
    };
    gw_com_module.formInsert(args);
    var args = { targetid: "frmData_메모A",
        edit: true,
        updatable: true,
        data: [
            { name: "root_seq", value: "1" },
            { name: "memo_cd", value: "A"}/*,
            { name: "memo_html", value: "<table style='width: 455px; height: 365px; table-layout:fixed; font-family:굴림체; font-size:9pt;' border='1' cellspacing='0' cellpadding='3'><tr valign='top'><td style='word-break: break-all;'></td></tr></table>" }*/
        ]
    };
    gw_com_module.formInsert(args);
    var args = { targetid: "frmData_메모B",
        edit: true,
        updatable: true,
        data: [
            { name: "root_seq", value: "1" },
            { name: "memo_cd", value: "B"}/*,
            { name: "memo_html", value: "<table style='width: 455px; height: 365px; table-layout:fixed; font-family:굴림체; font-size:9pt;' border='1' cellspacing='0' cellpadding='3'><tr valign='top'><td style='word-break: break-all;'></td></tr></table>" }*/
        ]
    };
    gw_com_module.formInsert(args);

}
//----------
function processCopy(param) {

    if (param.sub) {
        var args = {
            source: { type: "INLINE",
                argument: [
                    { name: "arg_root_no", value: param.key },
                    { name: "arg_root_seq", value: param.seq }
                ]
            },
            target: [
                {
                    type: "GRID",
                    id: "grdData_모델",
                    query: "w_eccb1010_I_1",
                    crud: "insert"
                },
                {
                    type: "FORM",
                    id: "frmData_메모A",
                    query: "w_eccb1010_I_2_1",
                    crud: "insert"
                },
                {
                    type: "FORM",
                    id: "frmData_메모B",
                    query: "w_eccb1010_I_2_2",
                    crud: "insert"
                }
		    ],
            key: param.key
        };
        gw_com_module.objRetrieve(args);
    }
    else if (param.master) {
        var args = {
            targetid: "frmData_내역",
            edit: true,
            updatable: true,
            data: [
                { name: "ecr_title", value: param.data.ecr_title },
                { name: "ecr_desc", value: param.data.ecr_desc },
                { name: "ecr_emp", value: gw_com_module.v_Session.EMP_NO },
                { name: "ecr_dept", value: gw_com_module.v_Session.DEPT_CD },
                { name: "ecr_dt", value: gw_com_api.getDate("") },
                { name: "rqst_dept", value: param.data.rqst_dept },
                { name: "act_time", value: param.data.act_time },
                { name: "act_time_sel", value: param.data.act_time_sel },
                { name: "act_time_etc", value: param.data.act_time_etc },
                { name: "act_region1", value: param.data.act_region1 },
                { name: "act_region2", value: param.data.act_region2 },
                { name: "act_region3", value: param.data.act_region3 },
                { name: "act_module1", value: param.data.act_module1 },
                { name: "act_module2", value: param.data.act_module2 },
                { name: "act_module3", value: param.data.act_module3 },
                { name: "act_module1_sel", value: param.data.act_module1_sel },
                { name: "act_module2_sel", value: param.data.act_module2_sel },
                { name: "act_module3_sel", value: param.data.act_module3_sel },
                { name: "act_module1_etc", value: param.data.act_module1_etc },
                { name: "act_module2_etc", value: param.data.act_module2_etc },
                { name: "act_module3_etc", value: param.data.act_module3_etc },
                { name: "mp_class1", value: param.data.mp_class1 },
                { name: "mp_class2", value: param.data.mp_class2 },
                { name: "mp_class3", value: param.data.mp_class3 },
                { name: "mp_class1_sel", value: param.data.mp_class1_sel },
                { name: "mp_class2_sel", value: param.data.mp_class2_sel },
                { name: "mp_class3_sel", value: param.data.mp_class3_sel },
                { name: "mp_class1_etc", value: param.data.mp_class1_etc },
                { name: "mp_class2_etc", value: param.data.mp_class2_etc },
                { name: "mp_class3_etc", value: param.data.mp_class3_etc },
                { name: "act_effect", value: param.data.act_effect }
            ],
            clear: [
                {
                    type: "GRID",
                    id: "grdData_첨부"
                }
            ]
        };
        gw_com_module.formInsert(args);
        processCopy({ sub: true, key: param.data.ecr_no, seq: 1 });
    }
    else {
        var args = { type: "PAGE", page: "w_find_ecr", title: "ECR 복사",
            width: 850, height: 450, locate: ["center", "top"], open: true
        };
        if (gw_com_module.dialoguePrepare(args) == false) {
            var args = { page: "w_find_ecr",
                param: { ID: gw_com_api.v_Stream.msg_selectECR,
                    data: { type: "copy"
                    	, cur_dept_area: gw_com_api.getValue("frmData_내역", 1, "dept_area", false)
                    	, my_dept_area: gw_com_module.v_Session.DEPT_AREA }
                }
            };
            gw_com_module.dialogueOpen(args);
        }
    }

}
//----------
function processDelete(param) {

    var args = {
        target: [
            {
                type: "FORM",
                id: "frmData_내역"
            },
            {
                type: "GRID",
                id: "grdData_모델"
            },
            {
                type: "FORM",
                id: "frmData_메모A"
            },
            {
                type: "FORM",
                id: "frmData_메모B"
            },
            {
                type: "GRID",
                id: "grdData_첨부"
            }
        ]
    };
    gw_com_module.objClear(args);

}
//----------
function processModel(param) {

    v_global.logic.modeling = param.modify;

    var args = { type: "PAGE", page: "w_find_prod_eccb", title: "제품 모델 선택",
        width: 950, height: 460, open: true
    };
    if (gw_com_module.dialoguePrepare(args) == false) {
        var args = { page: "w_find_prod_eccb",
            param: {
                ID: gw_com_api.v_Stream.msg_selectProduct_ECCB
            }
        };
        if (param.modify)
            args.param.data = {
                dept_area: gw_com_api.getValue("frmData_내역", 1, "dept_area", false),
                prod_type: gw_com_api.getValue("grdData_모델", "selected", "prod_type", true),
                cust_cd: gw_com_api.getValue("grdData_모델", "selected", "cust_cd", true),
                cust_dept: gw_com_api.getValue("grdData_모델", "selected", "cust_dept", true),
                cust_proc: gw_com_api.getValue("grdData_모델", "selected", "cust_proc", true),
                prod_cd: gw_com_api.getValue("grdData_모델", "selected", "prod_cd", true),
                prod_nm: gw_com_api.getValue("grdData_모델", "selected", "prod_nm", true),
                prod_key: gw_com_api.getValue("grdData_모델", "selected", "prod_key", true)
        	, cur_dept_area: gw_com_api.getValue("frmData_내역", 1, "dept_area", false)
        	, my_dept_area: gw_com_module.v_Session.DEPT_AREA 
            };
        else
        	args.param.data = {
        		cur_dept_area: gw_com_api.getValue("frmData_내역", 1, "dept_area", false)
        		, my_dept_area: gw_com_module.v_Session.DEPT_AREA 
            };
        gw_com_module.dialogueOpen(args);
    }

}
//----------
function processMemo(param) {

    v_global.event.type = param.type;
    v_global.event.object = param.object;
    v_global.event.row = param.row;
    v_global.event.element = param.element;
    if (param.html) {
        //var args = { type: "PAGE", page: "w_edit_html_eccb", title: "상세 내용",
        //    width: 508,
        //    height: 570,
        //    locate: ["center", "bottom"],
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
function processSave(param) {

    gw_com_api.setError(false, "frmData_내역", 1, "eco_emp_nm");
    var args = {
        target: [
			{ type: "FORM", id: "frmData_내역" },
            { type: "GRID", id: "grdData_모델" },
            { type: "FORM", id: "frmData_메모A" },
            { type: "FORM", id: "frmData_메모B" },
            { type: "GRID", id: "grdData_첨부" }
		]
    };
    if (gw_com_module.objValidate(args) == false) return false;
    
    if (gw_com_api.getValue("frmData_내역", 1, "eco_yn") == "1" && gw_com_api.getValue("frmData_내역", 1, "eco_emp_nm") == "") {
        gw_com_api.setError(true, "frmData_내역", 1, "eco_emp_nm");
        gw_com_api.messageBox([{ text: "NOVALIDATE" }]);
        return false;
    }

    if (gw_com_api.getValue("frmData_내역", 1, "eco_yn") == "1") {
        gw_com_api.setValue("frmData_내역", 1, "pstat", "ECO");
    } else {
        gw_com_api.setValue("frmData_내역", 1, "pstat", "ECCB");
    }
    
    args.handler = {
        success: successSave
    };

    // 담당자 지정 알림 메일
    var eco_yn_old = Query.getECOYN({ ecr_no: v_global.logic.key })[0];
    var eco_yn_new = gw_com_api.getValue("frmData_내역", 1, "eco_yn");
    var eco_emp_old = Query.getECOYN({ ecr_no: v_global.logic.key })[1];
    var eco_emp_new = gw_com_api.getValue("frmData_내역", 1, "eco_emp");
    if (eco_yn_old != eco_yn_new || eco_emp_old != eco_emp_new) {
        args.handler.param = {
            type: eco_yn_new == "1" ? "ECR_MNG_A" : "ECR_MNG_B",
            eco_emp: eco_emp_old
        };
    }

    gw_com_module.objSave(args);

}
//----------
function processRemove(param) {

    var args = {
        target: [
		    {
		        type: "FORM",
		        id: "frmData_내역",
		        key: {
		            element: [
		                { name: "ecr_no" }
		            ]
		        }
		    }
	    ],
        handler: {
            success: successRemove
        }
    };
    gw_com_module.objRemove(args);

}
//----------
function processApprove(param) {

    // 제품모델 입력 확인
    var err = false;
    var RowCnt = gw_com_api.getRowCount("grdData_모델");
    if (RowCnt < 1) {
        // 조치요구시점이 신규장비적용(30)이면 모델확인하지 않음
        if (gw_com_api.getValue("frmData_내역", 1, "act_time") == "30")
            err = false;
        else
            err = true;
    } else {
        var strTemp = gw_com_api.getValue("grdData_모델", 1, "prod_type", true);
        if (strTemp == "undefined" || strTemp == "") err = true;
    }
    if ( err ) {
        gw_com_api.messageBox([ { text: "적용 제품모델 선택 후 상신바랍니다." } ]);
        return false;
    }

    processRetrieve({ key: v_global.logic.key });
    
    var status = gw_com_api.getValue("frmData_내역", 1, "gw_astat_nm", false, true);
    if (status != '없슴' && status != '미처리' && status != '반송' && status != '회수') {
        gw_com_api.messageBox([
            { text: "결재 " + status + " 자료이므로 처리할 수 없습니다." }
        ], 420);
        return false;
    }
	
    //var args = {
    //    page: "IFProcess",
    //    param: {
    //        ID: gw_com_api.v_Stream.msg_authSystem,
    //        data: {
    //            system: "GROUPWARE",
    //            name: gw_com_module.v_Session.GW_ID,
    //            encrypt: { password: true },
    //            param: param
    //        }
    //    }
    //};
    //gw_com_module.dialogueOpen(args);
    var title = encodeURIComponent(Query.getApprovalTitle({ type: "ECR", ref_key1: v_global.logic.key }));
    var url = "http://gw.terasemicon.com/_ERPR/Public/ERPRLogin.aspx?UserId=" + gw_com_module.v_Session.USR_ID
            + "&Pwd=&Lang=ko&EAID=100&gw_num=100&htmltag=&ecr_no=%27" + v_global.logic.key + "%27&NextUrl=/_EAPP/EADocumentWrite.aspx?FormID=100&ErpDocTitle=" + title;

    window.open(url, "", "");

}
//----------
function processClear(param) {

    var args = {
        target: [
            {
                type: "FORM",
                id: "frmData_내역"
            },
            {
                type: "GRID",
                id: "grdData_모델"
            },
            {
                type: "FORM",
                id: "frmData_메모A"
            },
            {
                type: "FORM",
                id: "frmData_메모B"
            },
            {
                type: "GRID",
                id: "grdData_첨부"
            }
        ]
    };
    gw_com_module.objClear(args);

}
//----------
function processPrint(param) {

    //var args = {
    //    target: {
    //        type: "POPUP",
    //        id: gw_com_api.getPageID(),
    //        name: "출력"
    //    }
    //};
    //gw_com_module.pagePrint(args);

    window.open("/Job/w_link_eccb_print.aspx?data_key=" + v_global.logic.key, "", "");

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

    var args = {
        page: param.page
    };
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

    var IsEnd = false;
    $.each(response, function () {
        var query = this.QUERY;
        $.each(this.KEY, function () {
            if (IsEnd) return;
            if (this.NAME == "ecr_no"
                || (this.NAME == "root_no"
                    && (query == "w_eccb1010_S_1" || query == "w_eccb1010_S_2_1" || query == "w_eccb1010_S_2_2"))) {
                v_global.logic.key = this.VALUE;
                processRetrieve({ key: v_global.logic.key });
                IsEnd = true;
            }
        });
    });

    // 담당자 지정 알림 메일
    if (param != undefined && param.type != undefined) {
        var args = {
            url: "COM",
            procedure: "PROC_MAIL_ECCB_ECR",
            nomessage: true,
            input: [
                { name: "type", value: param.type, type: "varchar" },
                { name: "key", value: v_global.logic.key, type: "varchar" },
                { name: "seq", value: 0, type: "int" },
                { name: "add_info", value: param.eco_emp, type: "varchar" },
                { name: "user", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
            ],
            output: [
                { name: "message", type: "varchar" }
            ]
        };
        gw_com_module.callProcedure(args);
    }

}
//----------
function successRemove(response, param) {

    processDelete({});

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

    var DeptArea = gw_com_api.getValue("frmData_내역", 1, "dept_area");
    var FormId = 49;
    if (DeptArea == "DP") FormId = 234;
    else if (DeptArea == "SOLAR") FormId = 233;
    else FormId = 49;

    var url = "http://gw.ips.co.kr/common/main/sso_erp.aspx";
    var params = [
        { name: "form_id", value: FormId },
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
function processPopup(param) {
    
    v_global.event.type = param.type;
    v_global.event.object = param.object;
    v_global.event.row = param.row;
    v_global.event.element = param.element;

    var args;
    switch (param.element) {
        case "eco_emp_nm":
            args = {
                type: "PAGE", page: "w_find_emp", title: "사원 검색",
                width: 600, height: 450, locate: ["center", "top"], open: true,
                id: gw_com_api.v_Stream.msg_selectEmployee
            };
            break;
        case "eco_dept_nm":
            args = {
                type: "PAGE", page: "w_find_dept", title: "부서 검색",
                width: 600, height: 450, locate: ["center", "top"], open: true,
                id: gw_com_api.v_Stream.msg_selectDepartment,
                data: {
                    dept_nm: gw_com_api.getValue(v_global.event.object, v_global.event.row, param.element, (v_global.event.type == "GRID" ? true : false))
                }
            };
            break;
    }
    if (gw_com_module.dialoguePrepare(args) == false) {
        args = { page: args.page, param: { ID: args.id, data: args.data } };
        gw_com_module.dialogueOpen(args);
    }

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
    },
    getECOYN: function (param) {
        var rtn = "";
        var args = {
            request: "PAGE",
            url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
                    "?QRY_ID=w_eccb1010_M_1" +
                    "&QRY_COLS=eco_yn,eco_emp" +
                    "&CRUD=R" +
                    "&arg_ecr_no=" + param.ecr_no,
            handler_success: successRequest
        };
        //=================== async : false ========================
        $.ajaxSetup({ async: false });
        //----------
        gw_com_module.callRequest(args);
        function successRequest(data) {
            rtn = data[0];
        }
        //----------
        $.ajaxSetup({ async: true });
        //=================== async : true ========================
        return rtn
    }

}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
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
                    param.to = {
                        type: "POPUP",
                        page: param.data.page
                    };
                    gw_com_module.streamInterface(param);
                    break;
                }
                switch (param.data.ID) {
                    case gw_com_api.v_Message.msg_confirmSave:
                        {
                            if (param.data.result == "YES")
                                processSave(param.data.arg);
                            else {
                                processDelete({});
                                if (v_global.process.handler != null)
                                    v_global.process.handler(param.data.arg);
                            }
                        }
                        break;
                    case gw_com_api.v_Message.msg_confirmRemove:
                        {
                            if (param.data.result == "YES")
                                processRemove({});
                        }
                        break;
                    case gw_com_api.v_Message.msg_informSaved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                    case gw_com_api.v_Message.msg_informRemoved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                    case gw_com_api.v_Message.msg_informBatched:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_selectedECR:
            {
                processCopy({ master: true, data: param.data });
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedProduct_ECCB:
            {
                if (v_global.logic.modeling) {
                    gw_com_api.setValue("grdData_모델", "selected", "prod_type", (param.data.prod_type != "%") ? param.data.prod_type : "", true, true);
                    gw_com_api.setValue("grdData_모델", "selected", "cust_cd", (param.data.cust_cd != "%") ? param.data.cust_cd : "", true);
                    gw_com_api.setValue("grdData_모델", "selected", "cust_nm", (param.data.cust_cd != "%") ? param.data.cust_nm : " ", true);
                    gw_com_api.setValue("grdData_모델", "selected", "cust_dept", (param.data.cust_dept != "%") ? param.data.cust_dept : "", true, true);
                    gw_com_api.setValue("grdData_모델", "selected", "cust_proc", (param.data.cust_proc != "%") ? param.data.cust_proc : "", true, true);
                    gw_com_api.setValue("grdData_모델", "selected", "prod_key", (param.data.prod_cd != "") ? param.data.prod_key : "", true);
                    gw_com_api.setValue("grdData_모델", "selected", "prod_cd", (param.data.prod_cd != "") ? param.data.prod_cd : " ", true);
                    gw_com_api.setValue("grdData_모델", "selected", "prod_nm", (param.data.prod_cd != "") ? param.data.prod_nm : " ", true);
                    if (gw_com_api.getCRUD("grdData_모델", "selected", true) == "retrieve")
                        gw_com_api.setUpdatable("grdData_모델", gw_com_api.getSelectedRow("grdData_모델"), true);
                }
                else {
                    var args = { targetid: "grdData_모델", edit: true, updatable: true,
                        data: [
                            { name: "root_no", value: gw_com_api.getValue("frmData_내역", 1, "ecr_no") },
                            { name: "root_seq", value: 1 }
                        ]
                    };
                    if (param.data.prod_type != "%")
                        args.data.push({ name: "prod_type", value: param.data.prod_type });
                    if (param.data.cust_cd != "%") {
                        args.data.push({ name: "cust_cd", value: param.data.cust_cd });
                        args.data.push({ name: "cust_nm", value: param.data.cust_nm });
                    }
                    if (param.data.cust_dept != "%")
                        args.data.push({ name: "cust_dept", value: param.data.cust_dept });
                    if (param.data.cust_proc != "%")
                        args.data.push({ name: "cust_proc", value: param.data.cust_proc });
                    if (param.data.prod_key != "") {
                        args.data.push({ name: "prod_key", value: param.data.prod_key });
                        args.data.push({ name: "prod_cd", value: param.data.prod_cd });
                        args.data.push({ name: "prod_nm", value: param.data.prod_nm });
                    }
                    gw_com_module.gridInsert(args);
                }
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_edited_HTML:
            {
                if (param.data.update) {
                    gw_com_api.setValue(v_global.event.object,
                                        v_global.event.row,
                                        v_global.event.element,
			                            param.data.html);
                    gw_com_api.setValue(v_global.event.object,
                                        v_global.event.row,
                                        "memo_text",
			                            param.data.html);
                    gw_com_api.setUpdatable(v_global.event.object);
                }
                if (param.from)
                    closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_uploaded_ECCB:
            {
                var args = {
                    source: {
                        type: "INLINE",
                        argument: [
                            { name: "arg_ecr_no", value: gw_com_api.getValue("frmData_내역", 1, "ecr_no") },
                            { name: "arg_seq", value: 1 }
                        ]
                    },
                    target: [
			            {
			                type: "GRID",
			                id: "grdData_첨부",
			                select: true
			            }
		            ],
                    key: param.key
                };
                gw_com_module.objRetrieve(args);
            }
            break;
        case gw_com_api.v_Stream.msg_authedSystem:
            {
                closeDialogue({ page: param.from.page });

                v_global.logic.name = param.data.name;
                v_global.logic.password = param.data.password;
                var gw_key = gw_com_api.getValue("frmData_내역", 1, "gw_key");
                var gw_seq = gw_com_api.getValue("frmData_내역", 1, "gw_seq");
                gw_seq = (gw_seq == "") ? 0 : parseInt(gw_seq);
                var args = {
                    url: "COM",
                    procedure: "PROC_APPROVAL_ECR",
                    input: [
                        { name: "user", value: gw_com_module.v_Session.USR_ID, type: "varchar" },
                        { name: "emp_no", value: gw_com_module.v_Session.EMP_NO, type: "varchar"}/*,
                        { name: "user", value: "goodware", type: "varchar" },
                        { name: "emp_no", value: "10505", type: "varchar" }*/,
                        { name: "ecr_no", value: gw_com_api.getValue("frmData_내역", 1, "ecr_no"), type: "varchar" },
                        { name: "gw_key", value: gw_key, type: "varchar" },
                        { name: "gw_seq", value: gw_seq, type: "int" }
                    ],
                    output: [
                        { name: "r_key", type: "varchar" },
                        { name: "r_seq", type: "int" },
                        { name: "r_value", type: "int" },
                        { name: "message", type: "varchar" }
                    ],
                    handler: {
                        success: successApproval
                    }
                };
                gw_com_module.callProcedure(args);
            }
            break;
        case gw_com_api.v_Stream.msg_selectedEmployee:
            {
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
                                        v_global.event.element.substr(0, v_global.event.element.length - 3),
                                        param.data.emp_no,
                                        (v_global.event.type == "GRID") ? true : false);
                    if (v_global.event.element == "eco_emp_nm") {
                        gw_com_api.setValue(
                                            v_global.event.object,
                                            v_global.event.row,
                                            "eco_dept_nm",
                                            param.data.dept_nm,
                                            (v_global.event.type == "GRID") ? true : false);
                        gw_com_api.setValue(
                                            v_global.event.object,
                                            v_global.event.row,
                                            "eco_dept",
                                            param.data.dept_cd,
                                            (v_global.event.type == "GRID") ? true : false);
                    }
                }
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = { to: { type: "POPUP", page: param.from.page } };
                switch (param.from.page) {
                    case "w_find_ecr":
                        { args.ID = gw_com_api.v_Stream.msg_selectECR;
                            args.data = { type: "copy"
                                , cur_dept_area: gw_com_api.getValue("frmData_내역", 1, "dept_area", false)
                    	        , my_dept_area: gw_com_module.v_Session.DEPT_AREA
                            };
                        } break;
                    case "w_find_prod_eccb":
                        { args.ID = gw_com_api.v_Stream.msg_selectProduct_ECCB;
                            if (v_global.logic.modeling)
                                args.data = {
                                    prod_type: gw_com_api.getValue("grdData_모델", "selected", "prod_type", true),
                                    cust_cd: gw_com_api.getValue("grdData_모델", "selected", "cust_cd", true),
                                    cust_dept: gw_com_api.getValue("grdData_모델", "selected", "cust_dept", true),
                                    cust_proc: gw_com_api.getValue("grdData_모델", "selected", "cust_proc", true),
                                    prod_cd: gw_com_api.getValue("grdData_모델", "selected", "prod_cd", true),
                                    prod_nm: gw_com_api.getValue("grdData_모델", "selected", "prod_nm", true),
                                    prod_key: gw_com_api.getValue("grdData_모델", "selected", "prod_key", true)
					        	, cur_dept_area: gw_com_api.getValue("frmData_내역", 1, "dept_area", false)
					        	, my_dept_area: gw_com_module.v_Session.DEPT_AREA
                                };
                            else
					        	args.data = {
					        		cur_dept_area: gw_com_api.getValue("frmData_내역", 1, "dept_area", false)
					        		, my_dept_area: gw_com_module.v_Session.DEPT_AREA 
					            };
                        }
                        break;
                    case "w_edit_html_eccb":
                        { args.ID = gw_com_api.v_Stream.msg_edit_HTML;
                            args.data = {
                                edit: true,
                                title: v_global.logic.memo,
                                html: gw_com_api.getValue(v_global.event.object, v_global.event.row, v_global.event.element)
                            };
                        }
                        break;
                    case "w_upload_eccb":
                        { args.ID = gw_com_api.v_Stream.msg_upload_ECCB;
                            args.data = {
                                user: gw_com_module.v_Session.USR_ID,
                                key: gw_com_api.getValue("frmData_내역", 1, "ecr_no"),
                                seq: 1
                            };
                        }
                        break;
                }
                gw_com_module.streamInterface(args);
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                closeDialogue({ page: param.from.page });
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//