//------------------------------------------
// Process about Job Process.
//                Created by Professor.X, GoodWare (2011.04)
//------------------------------------------

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
    data: null, logic: {}
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// process.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var gw_job_process = {

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // entry point. (pre-process section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //#region
    ready: function () {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // initialize page.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        v_global.process.param = gw_com_module.initPage({ message: true });
        //----------
        gw_com_api.changeTheme("style_theme");

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set data.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        var args = {
            request: [
				{
				    type: "PAGE", name: "회사", query: "DDDW_HRM_COMMON",
				    param: [{ argument: "arg_hcode", value: "S100" }]
				},
                {
                    type: "PAGE", name: "결재유형", query: "DDDW_HRM_COMMON",
                    param: [{ argument: "arg_hcode", value: "S212" }]
                }
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
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
				//{ name: "조회", value: "조회", act: true },
				{ name: "확인", value: "확인", icon: "예" },
				{ name: "닫기", value: "닫기" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = { targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, show: true, border: false, align: "left",
            editable: { bind: "open", focus: "comp_id", validate: true },
            //remark: "lyrRemark",
            content: {
                row: [
                    {
                        element: [
				            {
				                name: "comp_id", label: { title: "회사 :" },
				                editable: { type: "select", data: { memory: "회사", unshift: [{ title: "전체", value: "%" }] } }
				            },
                            {
                                name: "emp_nm", label: { title: "사원 :" },
                                editable: { type: "text", size: 4 }
                            },
                            {
                                name: "appr_tp", label: { title: "구분 :" },
                                editable: { type: "select", data: { memory: "결재유형" } }
                            },
				            { name: "실행", act: true, show: false, format: { type: "button" } }
				        ]
                    }
				]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_DEPT", query: "DLG_EDIT_APPR_LINE_1", title: "부서",
            height: 320, show: true, selectable: true, pager: false,
            treegrid: { element: "dept_nm" },
            element: [
				{ header: "부서", name: "dept_nm", width: 250, align: "left", format: { type: "label" } },
				{ name: "dept_cd", hidden: true },
				{ name: "pdept_cd", hidden: true },
                { name: "level_no", hidden: true },
                { name: "org_pos", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_EMP", query: "DLG_EDIT_APPR_LINE_2", title: "사원",
            height: 320, show: true, key: true, pager: false, multi: true, checkrow: true,
            element: [
				{ header: "부서코드", name: "dept_cd", width: 70, align: "center", hidden: true },
				{ header: "부서명", name: "dept_nm", width: 150, align: "center" },
				{ header: "사번", name: "emp_no", width: 70, align: "center", hidden: true },
				{ header: "성명", name: "emp_nm", width: 50, align: "center" },
				{ header: "직급", name: "pos_nm", width: 50, align: "center" },
                { name: "pos_cd", hidden: true },
                { name: "duty_cd", hidden: true },
                { name: "duty_nm", hidden: true },
                { name: "grade_cd", hidden: true },
                { name:"grade_nm", hidden: true }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdList_DEPT", offset: 8 },
				{ type: "GRID", id: "grdList_EMP", offset: 8 }
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
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "확인", event: "click", handler: processInformResult };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: closeOption };
        //gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_DEPT", grid: true, event: "rowselected", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_EMP", grid: true, event: "rowdblclick", handler: processInformResult };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_EMP", grid: true, event: "rowkeyenter", handler: processInformResult };
        gw_com_module.eventBind(args);
        //----------

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_module.startPage();
        //----------
        var args = {
            ID: gw_com_api.v_Stream.msg_openedDialogue
        };
        gw_com_module.streamInterface(args);

    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
processRetrieve = function(param) {

    var args;

    if (param.object == "grdList_DEPT") {

        args = {
            source: {
                type: param.type, id: param.object, row: param.row,
                element: [
                    { name: "org_pos", argument: "arg_org_pos" }
                ],
                argument:[
                    { name: "arg_emp_nm", value: gw_com_api.getValue("frmOption", 1, "emp_nm") }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_EMP" }
            ],
            key: param.key
        };

    } else {

        args = {
            target: [
                { type: "FORM", id: "frmOption" }
            ]
        };
        if (gw_com_module.objValidate(args) == false) return false;

        args = {
            source: {
                type: "FORM", id: "frmOption",
                //hide: true,
                element: [
                    { name: "comp_id", argument: "arg_comp_id" },
                    { name: "emp_nm",  argument: "arg_emp_nm" }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_DEPT", option: "TREE", select: false }
            ],
            clear: [
                { type: "GRID", id: "grdList_DEPT" },
                { type: "GRID", id: "grdList_EMP" }
            ],
            key: param.key
        };

    }

    gw_com_module.objRetrieve(args);

};
//----------
function processItemchanged(param) {

    if (param.object == "frmOption" && param.element != "appr_tp") processRetrieve({});

}
//----------
function processInformResult(param) {

    //var args;
    //if (gw_com_api.getSelectedRow("grdList_EMP", false) == null) return;
    //args = {
    //    ID: gw_com_api.v_Stream.msg_selectedEmployee,
    //    data: {
    //        dept_cd: gw_com_api.getValue("grdList_EMP", "selected", "dept_cd", true),
    //        dept_nm: gw_com_api.getValue("grdList_EMP", "selected", "dept_nm", true),
    //        emp_no: gw_com_api.getValue("grdList_EMP", "selected", "emp_no", true),
    //        emp_nm: gw_com_api.getValue("grdList_EMP", "selected", "emp_nm", true),
    //        pos_cd: gw_com_api.getValue("grdList_EMP", "selected", "pos_cd", true),
    //        pos_nm: gw_com_api.getValue("grdList_EMP", "selected", "pos_nm", true),
    //        duty_cd: gw_com_api.getValue("grdList_EMP", "selected", "duty_cd", true),
    //        duty_nm: gw_com_api.getValue("grdList_EMP", "selected", "duty_nm", true),
    //        grade_cd: gw_com_api.getValue("grdList_EMP", "selected", "grade_cd", true),
    //        grade_nm: gw_com_api.getValue("grdList_EMP", "selected", "grade_nm", true)
    //    }
    //};
    //gw_com_module.streamInterface(args);

    var args = { ID: gw_com_api.v_Stream.msg_selectedEmployee };
    var ids = gw_com_api.getSelectedRow("grdList_EMP", true);
    $.each(ids, function () {
        args.data = {
            appr_tp: gw_com_api.getValue("frmOption", 1, "appr_tp"),
            dept_cd: gw_com_api.getValue("grdList_EMP", this, "dept_cd", true),
            dept_nm: gw_com_api.getValue("grdList_EMP", this, "dept_nm", true),
            emp_no: gw_com_api.getValue("grdList_EMP", this, "emp_no", true),
            emp_nm: gw_com_api.getValue("grdList_EMP", this, "emp_nm", true),
            pos_cd: gw_com_api.getValue("grdList_EMP", this, "pos_cd", true),
            pos_nm: gw_com_api.getValue("grdList_EMP", this, "pos_nm", true),
            duty_cd: gw_com_api.getValue("grdList_EMP", this, "duty_cd", true),
            duty_nm: gw_com_api.getValue("grdList_EMP", this, "duty_nm", true),
            grade_cd: gw_com_api.getValue("grdList_EMP", this, "grade_cd", true),
            grade_nm: gw_com_api.getValue("grdList_EMP", this, "grade_nm", true)
        }
        gw_com_module.streamInterface(args);
    });

}
//----------
function processClose(param) {

    var args = {
        ID: (param.id == undefined ? gw_com_api.v_Stream.msg_closeDialogue : param.id)
    };

    if (param.data != undefined)
        args.data = param.data;

    gw_com_module.streamInterface(args);

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

}
//----------

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
streamProcess = function(param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var retrieve = false;
                if (!v_global.process.init) {
                    v_global.process.init = true;
                    retrieve = true;
                }
                if (retrieve) {
                    var key = [{}];
                    //if (param.data.key != undefined) {
                    //    key[0].QUERY = "DLG_EDIT_APPR_LINE_1";
                    //    key[0].KEY = [];
                    //    $.each(param.data.key, function () {
                    //        key[0].KEY.push({
                    //            NAME: "dept_cd",
                    //            VALUE: this
                    //        });
                    //    });
                    //}
                    processRetrieve({ key: key });
                }
                gw_com_api.setFocus("frmOption", 1, "dept_nm");
            }
            break;
        case gw_com_api.v_Stream.msg_resultMessage:
            {
                if (param.data.page != gw_com_api.getPageID())
                    break;
            }
            break;
    }


};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//