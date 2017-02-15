//------------------------------------------
// Process about Job Process.
//                Created by Professor.X, GoodWare (2011.04)
//------------------------------------------

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, init: false, entry: null, act: null, handler: null, current: {}, prev: {} },
    data: {}, logic: {}
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

        //----------
        start();

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
				{ name: "닫기", value: "닫기" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE",
            trans: true, show: true, border: false, align: "left",
            editable: { bind: "open", focus: "supp_nm", validate: true },
            content: {
                row: [
                    {
                        element: [
				            {
				                name: "ymd_fr", label: { title: "요청일 :" },
				                editable: { type: "text", size: 7 }, mask: "date-ymd"
				            },
				            {
				                name: "ymd_to", label: { title: "~" },
				                editable: { type: "text", size: 7 }, mask: "date-ymd"
				            },
				            {
				                name: "emp_nm", label: { title: "요청자 :" },
				                editable: { type: "text", size: 6 }
				            },
				            {
				                name: "proj_nm", label: { title: "Project Name :" },
				                editable: { type: "text", size: 12 }
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
            targetid: "grdData_목록", query: "DLG_PR_1", title: "구매요청",
            height: 300, show: true, number: true, dynamic: true, key: true,
            element: [
				{ header: "구매요청번호", name: "pr_no", width: 90, align: "center" },
				{ header: "Project Name", name: "proj_nm", width: 130 },
				{ header: "Project No.", name: "proj_no", width: 80, align: "center" },
				{ header: "요청일", name: "req_date", width: 60, align: "center", mask: "date-ymd" },
				{ header: "요청자", name: "emp_nm", width: 50, align: "center" },
				{ header: "품목코드", name: "item_cd", width: 90, align: "center" },
				{ header: "품명", name: "item_nm", width: 130 },
				{ header: "규격", name: "item_spec", width: 130 },
				{ header: "수량", name: "pr_qty", width: 50, align: "right", mask: "numeric-int" },
				{ name: "emp_no", hidden: true },
				{ name: "pr_seq", hidden: true }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
				{ type: "GRID", id: "grdData_목록", offset: 8 }
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
        var args = {
            targetid: "lyrMenu",
            element: "조회",
            event: "click",
            handler: click_lyrMenu_조회
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu",
            element: "닫기",
            event: "click",
            handler: click_lyrMenu_닫기
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption",
            element: "실행",
            event: "click",
            handler: click_frmOption_실행
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_목록",
            grid: true,
            event: "rowdblclick",
            handler: rowdblclick_grdData_목록
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_목록",
            grid: true,
            event: "rowkeyenter",
            handler: rowdblclick_grdData_목록
        };
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
        function rowdblclick_grdData_목록(ui) {

            informResult({});

        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_module.startPage();
        //----------
        gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { day: -7 }));
        gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate());
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
processRetrieve = function (param) {

    var args = {
        source: {
            type: "FORM", id: "frmOption",
            element: [
                { name: "ymd_fr", argument: "arg_ymd_fr" },
                { name: "ymd_to", argument: "arg_ymd_to" },
				{ name: "emp_nm", argument: "arg_emp_nm" },
				{ name: "proj_nm", argument: "arg_proj_nm" }
			]
        },
        target: [
			{ type: "GRID", id: "grdData_목록", focus: true, select: true }
		],
        handler: {
            complete: processRetrieveEnd,
            param: param
        },
        key: param.key
    };
    gw_com_module.objRetrieve(args);

};
//----------
function processRetrieveEnd(param) {

    if (v_global.logic.auto_retrieve && gw_com_api.getRowCount("grdData_목록") == 1)
        informResult({ row: 1 });
    else if (gw_com_api.getRowCount("grdData_목록") > 0)
        gw_com_api.setFocus("grdData_목록");

    v_global.logic.auto_retrieve = false;

}
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closeDialogue,
        data: param.data
    };
    gw_com_module.streamInterface(args);

}
//----------
function informResult(param) {

    var data = {
        pr_no: gw_com_api.getValue("grdData_목록", (param.row != undefined ? param.row : "selected"), "pr_no", true),
        pr_seq: gw_com_api.getValue("grdData_목록", (param.row != undefined ? param.row : "selected"), "pr_seq", true),
        req_date: gw_com_api.getValue("grdData_목록", (param.row != undefined ? param.row : "selected"), "req_date", true),
        proj_no: gw_com_api.getValue("grdData_목록", (param.row != undefined ? param.row : "selected"), "proj_no", true),
        proj_nm: gw_com_api.getValue("grdData_목록", (param.row != undefined ? param.row : "selected"), "proj_nm", true),
        item_cd: gw_com_api.getValue("grdData_목록", (param.row != undefined ? param.row : "selected"), "item_cd", true),
        item_nm: gw_com_api.getValue("grdData_목록", (param.row != undefined ? param.row : "selected"), "item_nm", true)
    };
    processClose({ data: data });

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_openDialogue:
            {
                v_global.logic.auto_retrieve = false;
                if (param.data != undefined) {
                    v_global.data.system = param.data.system;
                    if (param.data.emp_nm
                        != gw_com_api.getValue("frmOption", 1, "emp_nm")) {
                        gw_com_api.setValue("frmOption", 1, "emp_nm", param.data.emp_nm);
                        gw_com_api.setFocus("frmOption", 1, "emp_nm");
                        v_global.logic.auto_retrieve = true;
                    }
                    if (param.data.proj_nm
                        != gw_com_api.getValue("frmOption", 1, "proj_nm")) {
                        gw_com_api.setValue("frmOption", 1, "proj_nm", param.data.proj_nm);
                        gw_com_api.setFocus("frmOption", 1, "proj_nm");
                        v_global.logic.auto_retrieve = true;
                    }
                }
                else if (!v_global.process.init) {
                    v_global.process.init = true;
                    //retrieve = true;
                }
                if (gw_com_api.getValue("frmOption", 1, "emp_nm") == "" &&
                    gw_com_api.getValue("frmOption", 1, "proj_nm") == "") {
                    v_global.logic.auto_retrieve = false;
                }
                if (v_global.logic.auto_retrieve)
                    processRetrieve({});
                else
                    gw_com_api.setFocus("frmOption", 1, "emp_nm");
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