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
				//{ name: "확인", value: "확인", icon: "예" },
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
            targetid: "grdList_EMP", query: "w_find_emp_M_1", title: "사원 검색",
            height: 200, show: true, key: true,
            element: [
				{ header: "부서코드", name: "dept_cd", width: 70, align: "center" },
				{ header: "부서명", name: "dept_nm", width: 100, align: "center" },
				{ header: "사번", name: "emp_no", width: 70, align: "center" },
				{ header: "성명", name: "emp_nm", width: 80, align: "center" },
				{ header: "직급", name: "pos_nm", width: 80, align: "center" },
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
        var args = { targetid: "grdList_EMP", grid: true, event: "rowdblclick", handler: processInformResult /*rowdblclick_grdList_EMP*/ };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_EMP", grid: true, event: "rowkeyenter", handler: processInformResult /*rowdblclick_grdList_EMP*/ };
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
        function rowdblclick_grdList_EMP(ui) {

            var args = {
                data: {
                    dept_cd: gw_com_api.getValue("grdList_EMP", "selected", "dept_cd", true),
                    dept_nm: gw_com_api.getValue("grdList_EMP", "selected", "dept_nm", true),
                    emp_no: gw_com_api.getValue("grdList_EMP", "selected", "emp_no", true),
                    emp_nm: gw_com_api.getValue("grdList_EMP", "selected", "emp_nm", true)
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
			{ type: "GRID", id: "grdList_EMP", focus: true, select: true }
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

}
//----------
function processInformResult(param) {

    var args;
    if (gw_com_api.getSelectedRow("grdList_EMP", false) == null) return;
    args = {
        ID: gw_com_api.v_Stream.msg_selectedEmployee,
        data: {
            dept_cd: gw_com_api.getValue("grdList_EMP", "selected", "dept_cd", true),
            dept_nm: gw_com_api.getValue("grdList_EMP", "selected", "dept_nm", true),
            emp_no: gw_com_api.getValue("grdList_EMP", "selected", "emp_no", true),
            emp_nm: gw_com_api.getValue("grdList_EMP", "selected", "emp_nm", true),
            pos_cd: gw_com_api.getValue("grdList_EMP", "selected", "pos_cd", true),
            pos_nm: gw_com_api.getValue("grdList_EMP", "selected", "pos_nm", true),
            duty_cd: gw_com_api.getValue("grdList_EMP", "selected", "duty_cd", true),
            duty_nm: gw_com_api.getValue("grdList_EMP", "selected", "duty_nm", true),
            grade_cd: gw_com_api.getValue("grdList_EMP", "selected", "grade_cd", true),
            grade_nm: gw_com_api.getValue("grdList_EMP", "selected", "grade_nm", true)
        }
    };
    gw_com_module.streamInterface(args);

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
                }
                else if (!v_global.process.init) {
                    v_global.process.init = true;
                    //retrieve = true;
                }
                if (retrieve) {
                    var key = [{}];
                    if (param.data.key != undefined) {
                        key[0].QUERY = "w_find_emp_M_1";
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