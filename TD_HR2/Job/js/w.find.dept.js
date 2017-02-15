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
				{ name: "닫기", value: "닫기" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, show: true, border: false, align: "left",
            editable: { bind: "open", focus: "dept_nm", validate: true },
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
				                name: "dept_nm", label: { title: "부서명 :" },
				                editable: { type: "text", size: 10 }
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
        //var args = {
        //    targetid: "grdData_목록",
        //    query: "w_find_dept_M_1",
        //    title: "부서 검색",
        //    height: "300",
        //    show: true,
        //    key: true,
        //    element: [
		//		{
		//		    header: "부서코드",
		//		    name: "dept_cd",
		//		    width: 70,
		//		    align: "center"
		//		},
		//		{
		//		    header: "부서명",
		//		    name: "dept_nm",
		//		    width: 150,
		//		    align: "center"
		//		}
		//	]
        //};
        ////----------
        //gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_목록", query: "w_find_dept_M_2", title: "부서",
            height: 300, show: true, selectable: true, pager: false, key: true,
            treegrid: { element: "tree_nm" },
            element: [
				{ header: "부서", name: "tree_nm", width: 250, align: "left", format: { type: "label" } },
				{ name: "dept_nm", hidden: true },
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
            targetid: "frmOption",
            element: "취소",
            event: "click",
            handler: click_frmOption_취소
        };
        //gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemchanged", handler: processRetrieve };
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
            /*
            var args = {
            target: [
            {
            id: "frmOption",
            focus: true
            }
            ]
            };
            gw_com_module.objToggle(args);
            */

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
                    dept_nm: gw_com_api.getValue("grdData_목록", "selected", "dept_nm", true)
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
            element: [
                { name: "comp_id", argument: "arg_comp_id" },
				{ name: "dept_nm", argument: "arg_dept_nm" }
			]
        },
        target: [
			//{ type: "GRID", id: "grdData_목록", focus: true, select: true }
            { type: "GRID", id: "grdData_목록", option: "TREE", select: false, focus: true }
		]
    };
    gw_com_module.objRetrieve(args);

};
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
                    if (param.data.height != undefined) {
                        gw_com_api.setHeight("grdData_목록", param.data.height, true);
                    }
                }
                else if (!v_global.process.init) {
                    v_global.process.init = true;
                    //retrieve = true;
                }
                if (retrieve)
                    processRetrieve();
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