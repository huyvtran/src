//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 부서원평가
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
                    type: "PAGE", name: "등급",
                    query: "DDDW_HRM_COMMON",
                    param: [{ argument: "arg_hcode", value: "A512" }]
                },
                {
                    type: "PAGE", name: "평가명",
                    query: "HRM_1120_3"
                },
                {
                    type: "PAGE", name: "평가그룹",
                    query: "DDDW_HRM_COMMON",
                    param: [{ argument: "arg_hcode", value: "A502" }]
                },
                {
                    type: "INLINE", name: "평가차수",
                    data: [
                        { title: "전체", value: "%" },
                        { title: "1차평가", value: "2" },
                        { title: "2차평가", value: "3" }
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

            gw_com_api.setValue("frmOption", 1, "evl_year", gw_com_api.getYear());
            gw_com_api.setValue("frmOption", 1, "dept_cd", gw_com_module.v_Session.DEPT_CD);
            gw_com_api.setValue("frmOption", 1, "dept_nm", gw_com_module.v_Session.DEPT_NM);
            gw_com_api.setValue("frmOption", 1, "emp_no", gw_com_module.v_Session.EMP_NO);
            gw_com_api.setValue("frmOption", 1, "emp_nm", gw_com_module.v_Session.USR_NM);

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
                { name: "저장", value: "저장" },
                { name: "제출", value: "제출", icon: "기타" },
                { name: "취소", value: "제출취소", icon: "Act" },
                { name: "닫기", value: "닫기" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true, remark: "lyrRemark2",
            editable: { focus: "emp_no", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "evl_year", label: { title: "평가연도 :" },
                                editable: { type: "text", maxlength: 4, validate: { rule: "required" }, size: 5 }
                            },
                            {
                                name: "evl_no", label: { title: "평가명 :" },
                                editable: { type: "select", data: { memory: "평가명" } }
                            },
                            {
                                name: "evl_seq", label: { title: "평가차수 :" },
                                editable: { type: "select", data: { memory: "평가차수" } }
                            },
                            {
                                name: "emp_nm", label: { title: "사원 :" }, mask: "search",
                                editable: { type: "text", size: 10, validate: { rule: "required" } }, hidden: !v_global.logic.option
                            },
                            { name: "emp_no", label: { title: "사원번호 :" }, hidden: true }
                        ]
                    },
                    {
                        element: [
			                { name: "실행", value: "실행", act: true, format: { type: "button" } },
			                { name: "취소", value: "취소", format: { type: "button", icon: "닫기" } },
                        ], align: "right"
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_MAIN", query: "HRM_1120_1", title: "평가대상자",
            caption: true, height: 100, pager: false, show: true, selectable: true, number: true,
            editable: { master: true, bind: "_edit_yn", multi: true , validate: true },
            element: [
				{ header: "평가연도", name: "evl_year", width: 40, align: "center" },
				{ header: "성명", name: "emp_nm", width: 50, align: "center" },
				{ header: "부서", name: "dept_nm", width: 80 },
				{ header: "직급", name: "grade_nm", width: 50, align: "center" },
				{ header: "호칭", name: "pos_nm", width: 50, align: "center" },
				{
				    header: "평가그룹", name: "evl_group", width: 70, align: "center",
				    format: { type: "select", data: { memory: "평가그룹"} },
				    editable: { type: "select", width: 110, data: { memory: "평가그룹" }, unshift: [{ title: "-", value: "" }] } //, validate: { rule: "required", message: "평가그룹" } }
				},
				{ header: "상태", name: "pstat_nm", width: 50, align: "center" },
				{ header: "1차평가", name: "evl_status1", width: 50, align: "center" },
                { header: "1차평가자", name: "seq1_nm", width: 50, align: "center" },
				{ header: "2차평가", name: "evl_status2", width: 50, align: "center" },
                { header: "2차평가자", name: "seq2_nm", width: 50, align: "center" },
				{ header: "3차평가", name: "evl_status3", width: 50, align: "center" },
				{ header: "최종평가", name: "evl_result0", width: 50, align: "center" },
                { name: "evl_no", hidden: true, editable: { type: "hidden" } },
                { name: "emp_no", hidden: true, editable: { type: "hidden" } },
                { name: "evl_group_org", hidden: true },
                { name: "evl_seq", hidden: true },
                { name: "pstat", hidden: true },
                { name: "appr_yn", hidden: true },
                { name: "_edit_yn", hidden: true },
                { name: "fr_date", editable: { type: "hidden" }, hidden: true },
                { name: "to_date", editable: { type: "hidden" }, hidden: true }

            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        createDW("0");
        //=====================================================================================
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdData_MAIN", offset: 8 },
                { type: "GRID", id: "grdData_SUB", offset: 8 }
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
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "제출", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "취소", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
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
        var args = { targetid: "grdData_MAIN", grid: true, event: "rowselecting", handler: processRowSelecting };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_MAIN", grid: true, event: "rowselected", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_MAIN", grid: true, event: "itemchanged", handler: processItemchanged };
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
        case "저장":
            processSave({});
            break;
        case "제출":
            if (!checkUpdatable({ check: true })) return false;
            processBatch(param);
            break;
        case "취소":
            if (!checkUpdatable({ check: true })) return false;
            processBatch(param);
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
    }
    else if (param.object == "grdData_MAIN") {
        switch (param.element) {
            case "evl_group":
                var org = gw_com_api.getValue(param.object, param.row, "evl_group_org", true);
                if (param.value.current == "21" || param.value.current == "23") {
                    if(org != "21" && org != "23")
                        gw_com_api.setValue(param.object, param.row, "evl_group", org, true, false, false);
                    else
                        gw_com_api.setValue(param.object, param.row, "evl_group", param.value.current, true, false, false);
                }
                    
                else if (param.value.current == "31" || param.value.current == "33") {
                    if (org != "31" && org != "33")
                        gw_com_api.setValue(param.object, param.row, "evl_group", org, true, false, false);
                    else
                        gw_com_api.setValue(param.object, param.row, "evl_group", param.value.current, true, false, false);
                }
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
    return checkUpdatable({ sub: true });

}
//----------
function processSelect(param) {

    gw_com_api.selectRow("grdData_MAIN", v_global.process.current.master, true, false);

}
//----------
function processRetrieve(param) {
    
    var args = { target: [{ type: "FORM", id: "frmOption" }] };
    if (!gw_com_module.objValidate(args)) return;

    if (param.object == "grdData_MAIN") {
        createDW(gw_com_api.getValue("grdData_MAIN", "selected", "evl_seq", true));
        args = {
            source: {
                type: "GRID", id: "grdData_MAIN", row: "selected",
                element: [
                    { name: "evl_no", argument: "arg_evl_no" },
                    { name: "emp_no", argument: "arg_emp_no" },
                    { name: "evl_seq", argument: "arg_evl_seq" }
                ],
                argument: [
                    { name: "arg_chk_emp", value: gw_com_api.getValue("frmOption", 1, "emp_no") },
                ]
            },
            target: [
                { type: "GRID", id: "grdData_SUB", select: true }
            ],
            key: param.key
        };
        
    } else {
        args = {
            source: {
                type: "FORM", id: "frmOption", hide: true,
                element: [
                    { name: "evl_year", argument: "arg_evl_year" },
                    { name: "evl_seq", argument: "arg_evl_seq" },
                    { name: "evl_nm", argument: "arg_evl_nm" },
                    { name: "emp_no", argument: "arg_emp_no" },
                    { name: "evl_no", argument: "arg_evl_no" }
                ],
                remark: [
                    { element: [{ name: "evl_year" }] },
                    { element: [{ name: "emp_nm" }] },
                    { element: [{ name: "evl_no" }] }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_MAIN", select: true }
            ],
            clear: [
                { type: "GRID", id: "grdData_SUB" }
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
function processSave(param) {

    var args = {
        url: "COM",
        target: [
			{ type: "GRID", id: "grdData_SUB" },
            { type: "GRID", id: "grdData_MAIN" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args.handler = {
        success: successSave,
        param: { stat: gw_com_api.getUpdatable("grdData_SUB", true) }
    };
    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    if (param.stat) {
        processBatch({ nomessage: true });
    } else {
        response[0].QUERY = "HRM_1120_1";
        processRetrieve({ key: response });
    }

}
//----------
function processBatch(param) {

    if (gw_com_api.getSelectedRow("grdData_MAIN") < 1 || gw_com_api.getSelectedRow("grdData_MAIN") == undefined) return;
    var evl_no = gw_com_api.getValue("grdData_MAIN", "selected", "evl_no", true);
    var emp_no = gw_com_api.getValue("grdData_MAIN", "selected", "emp_no", true);
    var pstat = gw_com_api.getValue("grdData_MAIN", "selected", "pstat", true);
    var appr_yn = gw_com_api.getValue("grdData_MAIN", "selected", "appr_yn", true);
    var evl_seq = gw_com_api.getValue("grdData_MAIN", "selected", "evl_seq", true);
    var fr_date = gw_com_api.getValue("grdData_MAIN", "selected", "fr_date", true);
    var to_date = gw_com_api.getValue("grdData_MAIN", "selected", "to_date", true);
    var rowIDs = gw_com_api.getRowIDs("grdData_SUB");
    
    var date = new Date();
    var dd = date.getDate();
    var mm = date.getMonth()+1;
    var yy = date.getFullYear();
    
    if (mm < 10)
        mm = "0" + mm;
    if (dd < 10)
        dd - "0" + dd;
        
    var fryy = fr_date.substr(0, 4);
    var frmm = fr_date.substr(4, 2);
    var frdd = fr_date.substr(6, 2);

    var toyy = to_date.substr(0, 4);
    var tomm = to_date.substr(4, 2);
    var todd = to_date.substr(6, 2);

    var today = new Date(yy, mm-1, dd);
    var frDate = new Date(fryy, frmm-1, frdd);
    var toDate = new Date(toyy, tomm-1, todd);

    switch (param.element) {
        case "제출":
            if (!((pstat == evl_seq || pstat == evl_seq - 1) && appr_yn == "2")) {
                gw_com_api.messageBox([{ text: "제출 처리를 할 수 없습니다." }]);
                
                return;
            }

            for (var i in rowIDs) {                                 //added 160829
                gw_com_api.selectRow("grdData_SUB", rowIDs[i]);
                var chkval1 = gw_com_api.getValue("grdData_SUB", "selected", "seq1_grade", true);
                var chkval2 = gw_com_api.getValue("grdData_SUB", "selected", "seq2_grade", true);
                var chkval3 = gw_com_api.getValue("grdData_SUB", "selected", "seq3_grade", true);
                if (evl_seq == "1" && chkval1 == "" || evl_seq == "1" && chkval1 == undefined) {
                    gw_com_api.messageBox([{ text: "제출 처리를 할 수 없습니다." }, { text: evl_seq + "차평가 결과를 모두 입력하세요." }]);
                    return;
                }
                else if (evl_seq == "2" && chkval2 == "" || evl_seq == "2" && chkval2 == undefined) {
                    gw_com_api.messageBox([{ text: "제출 처리를 할 수 없습니다." }, { text: evl_seq + "차평가 결과를 모두 입력하세요." }]);
                    return;
                }
                else if (evl_seq == "3" && chkval3 == "" || evl_seq == "3" && chkval3 == undefined) {
                    gw_com_api.messageBox([{ text: "제출 처리를 할 수 없습니다." }, { text: evl_seq + "차평가 결과를 모두 입력하세요." }]);
                    return;
                }
            }


            //var row = gw_com_api.getFindRow("grdData_SUB", "seq" + evl_seq + "_grade", "");
            ////var row_udf = gw_com_api.getFindRow("grdData_SUB", "seq" + evl_seq + "_grade", undefined);
            //if ( row > 0 ) {
            //    gw_com_api.messageBox([{ text: "제출 처리를 할 수 없습니다." }, { text: evl_seq + "차평가 결과를 모두 입력하세요." }]);
            //    return;
            //}

            //if (!(today >= frDate && today <= toDate)) {               //added 160830
            //    gw_com_api.messageBox([{ text: "제출 처리를 할 수 없습니다." }, { text: evl_seq + "차평가 기간이 아닙니다." }]);
            //    return;
            //}
            //alert("today : " + yy + "." + mm + "." + dd + "/" + today);
            //alert("frday : " + fryy + "." + frmm + "." + frdd + "/" + frDate);
            //alert("~~day : " + toyy + "." + tomm + "." + todd + "/" + toDate);
            appr_yn = "3";
            break;
        case "취소":
            if (!((pstat == evl_seq || pstat == evl_seq - 1) && appr_yn == "3")) {
                gw_com_api.messageBox([{ text: "제출취소 처리를 할 수 없습니다." }]);
                return;
            }
            appr_yn = "2";
            break;
        default:
            appr_yn = "2";
            break;
    }
    var row;
    //if (param.element == "제출") {
        row = [{
            crud: "U",
            column: [
                { name: "evl_no", value: evl_no },
                { name: "emp_no", value: emp_no },
                { name: "pstat", value: evl_seq },
                { name: "appr_yn", value: appr_yn },
                { name: "appr_emp_no", value: gw_com_module.v_Session.EMP_NO },
                { name: "appr_date", value: "" }
            ]
        }];
    //}
    //else {
    //    row = [{
    //        crud: "U",
    //        column: [
    //            { name: "evl_no", value: evl_no },
    //            { name: "emp_no", value: emp_no },
    //            //{ name: "pstat", value: evl_seq },
    //            //{ name: "appr_yn", value: appr_yn },
    //            { name: "appr_emp_no", value: gw_com_module.v_Session.EMP_NO },
    //            { name: "appr_date", value: "" }
    //        ]
    //    }];
    //}
    var args = {
        url: "COM",
        user: gw_com_module.v_Session.USR_ID,
        nomessage: (param.nomessage ? true : false),
        param: [
            {
                query: "HRM_1110_1",
                row: row
            }
        ],
        handler: {
            success: successSave,
            param: {}
        }
    };
    gw_com_module.objSave(args);

}
//----------
function successBatch(response, param) {

    if (param.batch_id == "COPY") {
        var rtn_no = response.VALUE[0];
        var rtn_msg = response.VALUE[1];
        gw_com_api.messageBox([{ text: rtn_msg }], 350);
        if (rtn_no == 0)
            processRetrieve({});
    } else {
        return;
    }
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

    var args;
    if (param.sub) {
        args = {
            check: param.check,
            target: [
                { type: "GRID", id: "grdData_SUB" }
            ],
            param: param
        };
    } else {
        args = {
            check: param.check,
            target: [
                { type: "GRID", id: "grdData_SUB" },
                { type: "GRID", id: "grdData_MAIN" }
            ],
            param: param
        };
    }
    return gw_com_module.objUpdatable(args);

}
//----------
function checkCRUD(param) {

    return gw_com_api.getCRUD("grdData_SUB", "selected", true);

}
//----------
function createDW(arg_evl_seq) {
    var args = {
        targetid: "grdData_SUB", query: "HRM_1110_2", title: "요소별평가",
        caption: true, height: 290, pager: false, show: true, selectable: true, number: true,
        editable: { master: true, multi: true, bind: "_edit_yn", focus: "item_grade", validate: true }
    };
    //----------
    switch (arg_evl_seq) {
        case "1":
            args.element = [
                { header: "평가부문", name: "item_group", width: 60, align: "center" },
                { header: "평가요소", name: "item_nm", width: 80, align: "center" },
                { header: "배점", name: "item_point", width: 60, align: "right", mask: "numeric-int" },
                {
                    header: "1차평가", name: "seq1_grade", width: 60, align: "center",
                    format: { type: "select", data: { memory: "등급", unshift: [{ title: "-", value: "" }] } },
                    editable: { type: "select", data: { memory: "등급", unshift: [{ title: "-", value: "" }] } }
                },
                //{ header: "자기평가 점수", name: "seq1_point", width: 60, align: "right", mask: "numeric-float" },
                {
                    header: "2차평가", name: "seq2_grade", width: 60, align: "center",
                    format: { type: "select", data: { memory: "등급", unshift: [{ title: "-", value: "" }] } }
                },
                //{ header: "1차평가 점수", name: "seq2_point", width: 60, align: "right", mask: "numeric-float" },
                {
                    header: "3차평가", name: "seq3_grade", width: 60, align: "center",
                    format: { type: "select", data: { memory: "등급", unshift: [{ title: "-", value: "" }] } }
                },
                //{ header: "2차평가 점수", name: "seq3_point", width: 60, align: "right", mask: "numeric-float" },
                { header: "설명", name: "item_desc", width: 500 },
                { name: "evl_no", editable: { type: "hidden" }, hidden: true },
                { name: "emp_no", editable: { type: "hidden" }, hidden: true },
                { name: "item_seq", editable: { type: "hidden" }, hidden: true },
                { name: "add_point", editable: { type: "hidden" }, hidden: true },
                { name: "_edit_yn", hidden: true },
                { name: "fr_date", editable: { type: "hidden" }, hidden: true },
                { name: "to_date", editable: { type: "hidden" }, hidden: true }
            ];
            break;
        case "2":
            args.element = [
                { header: "평가부문", name: "item_group", width: 60, align: "center" },
                { header: "평가요소", name: "item_nm", width: 80, align: "center" },
                { header: "배점", name: "item_point", width: 60, align: "right", mask: "numeric-int" },
                {
                    header: "1차평가", name: "seq1_grade", width: 60, align: "center",
                    format: { type: "select", data: { memory: "등급", unshift: [{ title: "-", value: "" }] } }
                },
                //{ header: "자기평가 점수", name: "seq1_point", width: 60, align: "right", mask: "numeric-float" },
                {
                    header: "2차평가", name: "seq2_grade", width: 60, align: "center",
                    format: { type: "select", data: { memory: "등급", unshift: [{ title: "-", value: "" }] } },
                    editable: { type: "select", data: { memory: "등급", unshift: [{ title: "-", value: "" }] } }
                },
                //{ header: "1차평가 점수", name: "seq2_point", width: 60, align: "right", mask: "numeric-float" },
                {
                    header: "3차평가", name: "seq3_grade", width: 60, align: "center",
                    format: { type: "select", data: { memory: "등급", unshift: [{ title: "-", value: "" }] } }
                },
                //{ header: "2차평가 점수", name: "seq3_point", width: 60, align: "right", mask: "numeric-float" },
                { header: "설명", name: "item_desc", width: 500 },
                { name: "evl_no", editable: { type: "hidden" }, hidden: true },
                { name: "emp_no", editable: { type: "hidden" }, hidden: true },
                { name: "item_seq", editable: { type: "hidden" }, hidden: true },
                { name: "add_point", editable: { type: "hidden" }, hidden: true },
                { name: "_edit_yn", hidden: true },
                { name: "fr_date", editable: { type: "hidden" }, hidden: true },
                { name: "to_date", editable: { type: "hidden" }, hidden: true }
            ];
            break;
        case "3":
            args.element = [
                { header: "평가부문", name: "item_group", width: 60, align: "center" },
                { header: "평가요소", name: "item_nm", width: 80, align: "center" },
                { header: "배점", name: "item_point", width: 60, align: "right", mask: "numeric-int" },
                {
                    header: "1차평가", name: "seq1_grade", width: 60, align: "center",
                    format: { type: "select", data: { memory: "등급", unshift: [{ title: "-", value: "" }] } }
                },
                //{ header: "자기평가 점수", name: "seq1_point", width: 60, align: "right", mask: "numeric-float" },
                {
                    header: "2차평가", name: "seq2_grade", width: 60, align: "center",
                    format: { type: "select", data: { memory: "등급", unshift: [{ title: "-", value: "" }] } }
                },
                //{ header: "1차평가 점수", name: "seq2_point", width: 60, align: "right", mask: "numeric-float" },
                {
                    header: "3차평가", name: "seq3_grade", width: 60, align: "center",
                    format: { type: "select", data: { memory: "등급", unshift: [{ title: "-", value: "" }] } },
                    editable: { type: "select", data: { memory: "등급", unshift: [{ title: "-", value: "" }] } }
                },
                //{ header: "2차평가 점수", name: "seq3_point", width: 60, align: "right", mask: "numeric-float" },
                { header: "설명", name: "item_desc", width: 500 },
                { name: "evl_no", editable: { type: "hidden" }, hidden: true },
                { name: "emp_no", editable: { type: "hidden" }, hidden: true },
                { name: "item_seq", editable: { type: "hidden" }, hidden: true },
                { name: "add_point", editable: { type: "hidden" }, hidden: true },
                { name: "_edit_yn", hidden: true },
                { name: "fr_date", editable: { type: "hidden" }, hidden: true },
                { name: "to_date", editable: { type: "hidden" }, hidden: true }
            ];
            break;
        default:
            args.element = [
                { header: "평가부문", name: "item_group", width: 60, align: "center" },
                { header: "평가요소", name: "item_nm", width: 80, align: "center" },
                { header: "배점", name: "item_point", width: 60, align: "right", mask: "numeric-int" },
                {
                    header: "1차평가", name: "seq1_grade", width: 60, align: "center",
                    format: { type: "select", data: { memory: "등급", unshift: [{ title: "-", value: "" }] } }
                },
                //{ header: "자기평가 점수", name: "seq1_point", width: 60, align: "right", mask: "numeric-float" },
                {
                    header: "2차평가", name: "seq2_grade", width: 60, align: "center",
                    format: { type: "select", data: { memory: "등급", unshift: [{ title: "-", value: "" }] } }
                },
                //{ header: "1차평가 점수", name: "seq2_point", width: 60, align: "right", mask: "numeric-float" },
                {
                    header: "3차평가", name: "seq3_grade", width: 60, align: "center",
                    format: { type: "select", data: { memory: "등급", unshift: [{ title: "-", value: "" }] } }
                },
                //{ header: "2차평가 점수", name: "seq3_point", width: 60, align: "right", mask: "numeric-float" },
                { header: "설명", name: "item_desc", width: 500 },
                { name: "evl_no", editable: { type: "hidden" }, hidden: true },
                { name: "emp_no", editable: { type: "hidden" }, hidden: true },
                { name: "item_seq", editable: { type: "hidden" }, hidden: true },
                { name: "add_point", editable: { type: "hidden" }, hidden: true },
                { name: "_edit_yn", hidden: true },
                { name: "fr_date", editable: { type: "hidden" }, hidden: true },
                { name: "to_date", editable: { type: "hidden" }, hidden: true }
            ];
            break;
    }
    //----------
    gw_com_module.gridCreate(args);
    //=====================================================================================
    var args = {
        target: [{ type: "GRID", id: "grdData_SUB", offset: 8 }]
    };
    gw_com_module.objResize(args);
    //=====================================================================================

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
                                //var status = checkCRUD({});
                                //if (status == "initialize" || status == "create")
                                //    processDelete({});
                                //else if (status == "update")
                                //    processRestore({});

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
                    case gw_com_api.v_Message.msg_confirmBatch:
                        { if (param.data.result == "YES") processBatch(param.data.arg); } break;
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
                }
                gw_com_module.streamInterface(args);
            } break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                switch (param.from.page) {
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
                }
                closeDialogue({ page: param.from.page });
            }
            break;
    }

}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//