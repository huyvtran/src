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
        var args = { request: [
				{ type: "PAGE", name: "DEPT_AREA_FIND", query: "dddw_deptarea",
				    param: [{ argument: "arg_type", value: "FIND" }] }
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
				{ name: "조회", value: "조회", act: true },
				{ name: "확인", value: "확인", icon: "예" },
				{ name: "닫기", value: "닫기" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = { targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, show: true, border: false, align: "left",
            editable: { bind: "open", focus: "dept_nm", validate: true },
            //remark: "lyrRemark",
            content: {
                row: [
                    {
                        element: [
				            {
				                name: "dept_nm", label: { title: "부서명 :" },
				                editable: { type: "text", size: 12, maxlength: 30 }
				            },
				            {
				                name: "emp_nm", label: { title: "성명 :" },
				                editable: { type: "text", size: 5, maxlength: 10 }
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
            targetid: "grdData_목록", query: "HRM_9201_1", title: "사원 검색",
            height: "300", show: true, key: true,
            element: [
				{ header: "부서코드", name: "dept_cd", width: 70, align: "center" },
				{ header: "부서명", name: "dept_nm", width: 100, align: "center" },
				{ header: "사번", name: "emp_no", width: 70, align: "center" },
				{ header: "성명", name: "emp_nm", width: 80, align: "center" },
//				{ header: "직급", name: "pos_nm", width: 80, align: "center" }
                { header: "uuid", name: "uuid", width: 60, align: "center" }
//              { name: "uuid", editable: { type: "hidden" }, hidden: true }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_목록2", query: "HRM_9201_1", title: "사원 검색",
            height: "300", show: false, key: true, multi: true, checkrow: true,
            element: [
				{ header: "부서코드", name: "dept_cd", width: 60, align: "center" },
				{ header: "부서명", name: "dept_nm", width: 150, align: "center" },
				{ header: "사번", name: "emp_no", width: 60, align: "center" },
				{ header: "성명", name: "emp_nm", width: 60, align: "center" },
//				{ header: "직급", name: "pos_nm", width: 60, align: "center" }
                { header: "uuid", name: "uuid", width: 60, align: "center" }
        //      { name: "uuid", editable: { type: "hidden" }, hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
				{ type: "GRID", id: "grdData_목록", offset: 8 },
                { type: "GRID", id: "grdData_목록2", offset: 8 }
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
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: click_lyrMenu_조회 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "확인", event: "click", handler: processInformResult };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: click_lyrMenu_닫기 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: click_frmOption_실행 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: click_frmOption_취소 };
        //gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_목록", grid: true, event: "rowdblclick", handler: processInformResult /*rowdblclick_grdData_목록*/ };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_목록", grid: true, event: "rowkeyenter", handler: processInformResult /*rowdblclick_grdData_목록*/ };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_조회(ui) {

            processRetrieve({});

        }
        //----------
        function click_lyrMenu_닫기(ui) {

            processClose({});

        }
        //----------
        function click_frmOption_실행(ui) {

            processRetrieve({});

        }
        //----------
        function click_frmOption_취소(ui) {

            closeOption({});

        }
        //----------
        function rowdblclick_grdData_목록(ui) {

            var args = {
                data: {
                    dept_cd: gw_com_api.getValue("grdData_목록", "selected", "dept_cd", true),
                    dept_nm: gw_com_api.getValue("grdData_목록", "selected", "dept_nm", true),
                    emp_no: gw_com_api.getValue("grdData_목록", "selected", "emp_no", true),
                    emp_nm: gw_com_api.getValue("grdData_목록", "selected", "emp_nm", true)
                }
            };
            processClose(args);

        }

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

    var args = {
        target: [
	        { type: "FORM", id: "frmOption" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;
        
    var args = {
        source: {
            type: "FORM", id: "frmOption",
            //hide: true,
            element: [
				{ name: "dept_nm", argument: "arg_dept_nm" },
				{ name: "emp_nm", argument: "arg_emp_nm" }
			]
        },
        target: [
			{ type: "GRID", id: "grdData_목록", focus: true, select: true },
            { type: "GRID", id: "grdData_목록2", focus: true }
        ],
        handler: {
            complete: processRetrieveEnd,
            param: { key: param.key }
        },
        key: param.key
    };
    gw_com_module.objRetrieve(args);

};
//----------
function processRetrieveEnd(param) {

    if (v_global.logic.multi) {
        if (param.key != undefined) {
            var ids = gw_com_api.getRowIDs("grdData_목록2");
            $.each(ids, function () {
                var row = this;
                var emp_no = gw_com_api.getValue("grdData_목록2", row, "emp_no", true);
                $.each(param.key[0].KEY, function () {
                    if (this.NAME == "emp_no") {
                        if (this.VALUE == emp_no) {
                            gw_com_api.selectRow("grdData_목록2", row);
                        }
                    }
                });
            });
        }
    }

}
//----------
function processInformResult(param) {

    var args;
    if (v_global.logic.multi) {
        var rows = gw_com_api.getSelectedRow("grdData_목록2", true);
        if (rows.length < 1) return;
        args = { data: [] };
        $.each(rows, function () {
            args.data.push({
                emp_no: gw_com_api.getValue("grdData_목록2", this, "emp_no", true),
                emp_nm: gw_com_api.getValue("grdData_목록2", this, "emp_nm", true),
                dept_cd: gw_com_api.getValue("grdData_목록2", this, "dept_cd", true),
                dept_nm: gw_com_api.getValue("grdData_목록2", this, "dept_nm", true),
                uuid: gw_com_api.getValue("grdData_목록2", this, "uuid", true)
            });
        });

    } else {
        if (gw_com_api.getSelectedRow("grdData_목록", false) == null) return;
        args = {
            data: {
                dept_cd: gw_com_api.getValue("grdData_목록", "selected", "dept_cd", true),
                dept_nm: gw_com_api.getValue("grdData_목록", "selected", "dept_nm", true),
                emp_no: gw_com_api.getValue("grdData_목록", "selected", "emp_no", true),
                emp_nm: gw_com_api.getValue("grdData_목록", "selected", "emp_nm", true),
                uuid: gw_com_api.getValue("grdData_목록2", this, "uuid", true)
            }
        };
    }
    processClose(args);

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
                if (param.data != undefined) {
                    if (param.data.dept_cd
                        != gw_com_api.getValue("frmOption", 1, "dept_nm")) {
                        gw_com_api.setValue("frmOption", 1, "dept_nm", param.data.dept_nm);
                        retrieve = true;
                    }
                    if (param.data.emp_nm
                        != gw_com_api.getValue("frmOption", 1, "emp_nm")) {
                        gw_com_api.setValue("frmOption", 1, "emp_nm", param.data.emp_nm);
                        retrieve = true;
                    }
                    if (param.data.height != undefined) {
                        gw_com_api.setHeight("grdData_목록", param.data.height, true);
                        gw_com_api.setHeight("grdData_목록2", param.data.height, true);
                    }
                    if (param.data.multi) {
                        v_global.logic.multi = true;
                        gw_com_api.hide("grdData_목록");
                        gw_com_api.show("grdData_목록2");
                    } else {
                        gw_com_api.show("grdData_목록");
                        gw_com_api.hide("grdData_목록2");
                    }
                    var args = {
                        target: [
                            { type: "GRID", id: "grdData_목록", offset: 8 },
                            { type: "GRID", id: "grdData_목록2", offset: 8 }
                        ]
                    };
                    gw_com_module.objResize(args);
                }
                else if (!v_global.process.init) {
                    v_global.process.init = true;
                    //retrieve = true;
                }
                if (retrieve) {
                    var key = [{}];
                    if (param.data.key != undefined) {
                        key[0].QUERY = "HRM_9201_1";
                        key[0].KEY = [];
                        $.each(param.data.key, function () {
                            key[0].KEY.push({
                                NAME: "emp_no",
                                VALUE: this
                            });
                        });
                    }
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