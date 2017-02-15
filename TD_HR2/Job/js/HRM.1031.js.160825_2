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
				            //{
				            //    name: "comp_id", label: { title: "회사 :" },
				            //    editable: { type: "select", data: { memory: "회사"} }
				            //},
				            //{
				            //    name: "emp_nm", label: { title: "성명 :" },
				            //    editable: { type: "text", size: 4 }
				            //},
				            //{
				            //    name: "ret_yn", label: { title: "재직 :" },
				            //    editable: { type: "checkbox", value: "0", offval: "%" }
				            //},
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
            targetid: "grdData_목록", query: "HRM_1031", title: "사원 검색",
            height: "300", show: true, key: true,
            element: [
				{ header: "사업장", name: "dname", width: 80, align: "center" },
				{ header: "부서명", name: "deptkor_nm", width: 100, align: "center" },
				{ header: "직책", name: "dname2", width: 80, align: "center" },
				{ header: "성명", name: "user_nm", width: 80, align: "center" },
				{ header: "org-pos", name: "ORG_POS", width: 100, align: "center", hidden: true },
                { name: "emp_no", hidden: true }
                //{ name: "email", hidden: true }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_목록2", query: "HRM_1031", title: "사원 검색",
            height: "300", show: false, key: true, multi: true, checkrow: true,
            element: [
				{ header: "사업장", name: "dname", width: 80, align: "center" },
				{ header: "부서명", name: "deptkor_nm", width: 120, align: "center" },
				{ header: "직책", name: "dname2", width: 80, align: "center" },
				{ header: "성명", name: "user_nm", width: 80, align: "center" },
				{ header: "org-pos", name: "ORG_POS", width: 100, align: "center", hidden: true },
                { name: "emp_no", hidden: true }
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
        var args = { targetid: "frmOption", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
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
                    user_nm: gw_com_api.getValue("grdData_목록", this, "user_nm", true),
                    dname: gw_com_api.getValue("grdData_목록", this, "dname", true),
                    dname2: gw_com_api.getValue("grdData_목록", this, "dname2", true),
                    deptkor_nm: gw_com_api.getValue("grdData_목록", this, "deptkor_nm", true),
                    org_pos: gw_com_api.getValue("grdData_목록", this, "ORG_POS", true),
                    emp_no: gw_com_api.getValue("grdData_목록", this, "emp_no", true)
                    //email: gw_com_api.getValue("grdData_목록", "selected", "email", true)
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
function processItemchanged(param) {

    if (param.object == "frmOption") {
        if (param.element == "comp_id") {
            processRetrieve({});
        }
    }

}
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
				//{ name: "comp_id", argument: "arg_comp_id" }
            ],
            argument: [
                { name: "arg_comp_id", value: gw_com_api.getValue("frmOption", 1, "comp_id") },
                { name: "arg_emp_no", value: gw_com_module.v_Session.EMP_NO }
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
                var user_nm = gw_com_api.getValue("grdData_목록2", row, "user_nm", true);
                $.each(param.key[0].KEY, function () {
                    if (this.NAME == "user_nm") {
                        if (this.VALUE == user_nm) {
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
                user_nm: gw_com_api.getValue("grdData_목록2", this, "user_nm", true),
                dname: gw_com_api.getValue("grdData_목록2", this, "dname", true),
                dname2: gw_com_api.getValue("grdData_목록2", this, "dname2", true),
                deptkor_nm: gw_com_api.getValue("grdData_목록2", this, "deptkor_nm", true),
                org_pos: gw_com_api.getValue("grdData_목록2", this, "ORG_POS", true),
                emp_no: gw_com_api.getValue("grdData_목록2", this, "emp_no", true)
                //email: gw_com_api.getValue("grdData_목록2", this, "email", true)
            });
        });

    } else {
        if (gw_com_api.getSelectedRow("grdData_목록", false) == null) return;
        args = {
            data: {
                user_nm: gw_com_api.getValue("grdData_목록", "selected", "user_nm", true),
                dname: gw_com_api.getValue("grdData_목록", "selected", "dname", true),
                dname2: gw_com_api.getValue("grdData_목록", "selected", "dname2", true),
                deptkor_nm: gw_com_api.getValue("grdData_목록", "selected", "deptkor_nm", true),
                org_pos: gw_com_api.getValue("grdData_목록", "selected", "ORG_POS", true),
                emp_no: gw_com_api.getValue("grdData_목록", "selected", "emp_no", true)
                //email: gw_com_api.getValue("grdData_목록2", this, "email", true)
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
    args.multi = v_global.logic.multi;

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

                if (!v_global.process.init) processRetrieve({});
                v_global.process.init = true;

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