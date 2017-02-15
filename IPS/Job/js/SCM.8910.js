//------------------------------------------
// Process about Job Process.
//                Created by Professor.X, GoodWare (2011.04)
//------------------------------------------

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var v_global = {
    event: {
        type: null,
        object: null,
        row: null,
        element: null
    },
    process: {
        param: null,
        entry: null,
        act: null,
        handler: null,
        current: {},
        prev: {}
    },
    logic: {}
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
        gw_com_DX.register();
        //----------
        v_global.process.param = gw_com_module.initPage({ message: true });
        //----------
        gw_com_api.changeTheme("style_theme");

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set data.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        var args = {
            request: [
				{ type: "PAGE", name: "사업부", query: "dddw_prodgroup" },
				{ type: "PAGE", name: "고객사", query: "dddw_cust" }, 
                { type: "PAGE", name: "현황_사업부", query: "dddw_prodgroup" }
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
            v_global.logic.proj_no = gw_com_api.getPageParameter("proj_no");
            gw_com_api.setValue("frmOption", 1, "proj_no", v_global.logic.proj_no);
            processRetrieve({});

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
				{ name: "닫기", value: "닫기" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건", trans: true, show: false,  border: true,
            editable: { focus: "proj_no", validate: true }, 
            remark: "lyrRemark",
            content: {
                row: [
                    {
                        element: [
				            {
				                name: "proj_no", label: { title: "Project no. :" },
				                editable: { type: "text", size: 20, maxlength: 20 }
				            }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_현황", query: "SCM_8910_1", type: "TABLE", title: "설비 출하 현황",
            caption: true, show: true,  
            content: {
                width: { label: 100, field: 176 }, height: 25,
                row: [
                    {
                        element: [
                          { header: true, value: "납기요구일", format: { type: "label" } },
                          { name: "c1_str",  },
                          { header: true, value: "출하예정일", format: { type: "label" } },
                          { name: "c2_str",  },
                          { header: true, value: "지연 발생", format: { type: "label" } },
                          { name: "c3_str",  }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_Sub1", query: "SCM_8910_3", title: "필요 자재 납기 Issue 현황", height: "100%",
            pager: false, show: true, caption: true, 
            element: [
				{ header: "품목코드", name: "item_no", width: 70, align: "center" },
                { header: "품명", name: "item_nm", width: 130, align: "left" },
                { header: "수량", name: "bom_qty", width: 50, align: "right", mask:"numeric-int" },
                { header: "납기 예정일", name: "c1_str", width: 60, align: "center" },
                { header: "제조 필요납기", name: "c2_str", width: 60, align: "center" },
				{ header: "지연일수", name: "c1_qty", width: 50, align: "right", mask:"numeric-int" }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_Sub2", query: "SCM_8910_4", title: "PJT 문제 발생 Issue 현황", height: "100%",
            caption: true, pager: false, show: true, width:"100%",
            element: [
				{ header: "Assy", name: "item_no", width: 50, align: "center" },
                { header: "Module", name: "item_nm", width: 110, align: "left" },
                { header: "계획 종료일", name: "c1_str", width: 60, align: "center" },
                { header: "실 완료일", name: "c2_str", width: 60, align: "center" },
                { header: "관리번호", name: "c3_str", width: 60, align: "center" },
                { header: "부적합 내용", name: "c4_str", width: 150, align: "left" },
				{ header: "지연시간", name: "c1_qty", width: 50, align: "right", mask: "numeric-int" }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "lyrChart_현황", query: "SCM_8910_2", show: true,
            format: { view: "10", rotate: "0", reverse: "0"},
            control: { by: "DX",  id: ctlChart_1 }
        };
        //----------
        gw_com_module.chartCreate(args);
        //=====================================================================================
        var args = {
            target: [
				{ type: "GRID", id: "grdData_Sub1", offset: 8 },
                { type: "GRID", id: "grdData_Sub2", offset: 8 },
                { type: "LAYER", id: "lyrChart_현황", offset: 8 },
                { type: "FORM", id: "frmData_현황", offset: 8 }

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
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: click_lyrMenu_닫기 };
        gw_com_module.eventBind(args);
        //----------
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_닫기(ui) {

            top.window.close();

        }
        
        //----------
        //----------
        gw_com_module.startPage();

    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
function processRetrieve(param) {

    var args = {
        target: [
	        { type: "FORM", id: "frmOption" }
        ]
    };
	if (gw_com_module.objValidate(args) == false) return false;

	var args = {
	    source: {
	        type: "FORM",
	        id: "frmOption",
	        hide: true,
	        element: [
				{ name: "proj_no", argument: "arg_proj_no" } 
			],
	        remark: [
		        {
		            element: [{ name: "proj_no"}]
		        }
		    ]
	    },
	    target: [
            { type: "FORM", id: "frmData_현황" },
            { type: "GRID", id: "grdData_Sub1" },
            { type: "GRID", id: "grdData_Sub2" },
            { type: "CHART", id: "lyrChart_현황" }
		]
	};
    gw_com_module.objRetrieve(args);

}
//----------

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
                if (param.data.page != gw_com_api.getPageID())
                    break;
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = {
                    to: {
                        type: "POPUP",
                        page: param.from.page
                    }
                };
                switch (param.from.page) {
                    case "w_find_orders":
                        {
                            var ymd_fr = "", ymd_to = "";
                            if (v_global.event.element == "total") {
                                var yy = gw_com_api.getValue("grdData_Sub1", v_global.event.row, "fr_ym", true).substr(0, 4);
                                var mm = gw_com_api.getValue("grdData_Sub1", v_global.event.row, "fr_ym", true).substr(4, 2) * 1;
                                ymd_fr = gw_com_api.getValue("grdData_Sub1", v_global.event.row, "fr_ym", true) + "01";
                                ymd_to = ((mm + 11 > 12) ? (yy * 1) + 1 : yy) +
                                            gw_com_api.prefixNumber(((mm + 11 > 12) ? mm + 11 - 12 : mm + 11), 2) + 
                                            "31";
                            }
                            else {
                                var yy = gw_com_api.getValue("grdData_Sub1", v_global.event.row, "fr_ym", true).substr(0, 4);
                                var mm = gw_com_api.getValue("grdData_Sub1", v_global.event.row, "fr_ym", true).substr(4, 2) * 1;
                                var index = (v_global.event.element.substr(3, 2) * 1) - 1;
                                var ym = ((mm + index > 12) ? (yy * 1) + 1 : yy) +
                                            gw_com_api.prefixNumber(((mm + index > 12) ? mm + index - 12 : mm + index), 2);
                                ymd_fr = ym + "01";
                                ymd_to = ym + "31";
                            }
                            args.ID = gw_com_api.v_Stream.msg_infoOrders;
                            args.data = {
                                prod_group: gw_com_api.getValue("grdData_Sub1", v_global.event.row, "prod_group", true),
                                ord_class: gw_com_api.getValue("grdData_Sub1", v_global.event.row, "ord_class", true),
                                ymd_tp: gw_com_api.getValue("grdData_Sub1", v_global.event.row, "ymd_tp", true),
                                ymd_fr: ymd_fr,
                                ymd_to: ymd_to,
                                cust_cd: gw_com_api.getValue("grdData_Sub1", v_global.event.row, "cust_cd", true),
                                cust_dept: gw_com_api.getValue("grdData_Sub1", v_global.event.row, "cust_dept", true),
                                cust_proc: gw_com_api.getValue("grdData_Sub1", v_global.event.row, "cust_proc", true),
                                prod_type: gw_com_api.getValue("grdData_Sub1", v_global.event.row, "prod_type", true)
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