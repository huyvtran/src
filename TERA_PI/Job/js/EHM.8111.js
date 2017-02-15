
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define Global variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
    logic: {}
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
        gw_com_DX.register();
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        var args = {
            request: [
                { type: "PAGE", name: "월별", query: "dddw_issuw_work_date_m" },
				{ type: "PAGE", name: "분기별", query: "dddw_issue_work_date_q" },
				{ type: "PAGE", name: "연도별", query: "dddw_issue_work_date_y" },
				{
				    type: "INLINE", name: "구분",
				    data: [
						{ title: "월 별", value: "M" },
						{ title: "분기 별", value: "Q" },
						{ title: "연도 별", value: "Y" }
				    ]
				}
			],
            starter: start
        };
        gw_com_module.selectSet(args);

        //----------
        function start() { gw_job_process.UI(); }

    },

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage UI. (design section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    UI: function () {

        //==== Menu : Main ====
        var args = { targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "조회", value: "조회", act: true },
				{ name: "닫기", value: "닫기" }
			]
        };
        gw_com_module.buttonMenu(args);

        //==== Option : Form Main 월별 ====
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, show: true, border: true, remark: "lyrRemark",
            content: {
                row: [
                        {
                            element: [
                                {
                                    name: "category", label: { title: "구분 :" }, style: { colfloat: "floating" },
                                    editable: { type: "select", data: { memory: "구분" } }
                                },
                                {
                                    name: "ym_fr", label: { title: "기간 :" },
                                    editable: { type: "select", data: { memory: "월별" } }
                                },
                                {
                                    name: "ym_to", label: { title: "~" },
                                    editable: { type: "select", data: { memory: "월별" } }
                                },
                                {
                                    name: "q_fr", label: { title: "기간 :" }, hidden: true,
                                    editable: { type: "select", data: { memory: "분기별" } }
                                },
                                {
                                    name: "q_to", label: { title: "~" }, hidden: true,
                                    editable: { type: "select", data: { memory: "분기별" } }
                                },
                                {
                                    name: "y_fr", label: { title: "기간 :" }, hidden: true,
                                    editable: { type: "select", data: { memory: "연도별" } }
                                },
                                {
                                    name: "y_to", label: { title: "~" }, hidden: true,
                                    editable: { type: "select", data: { memory: "연도별" } }
                                }
                            ]
                        },
                        {
                            align: "right",
                            element: [
                                { name: "실행", value: "실행", act: true, format: { type: "button" } },
                                { name: "취소", value: "취소", format: { type: "button", icon: "닫기" } }
                            ]
                        }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = { targetid: "grdData_현황", query: "EHM_5050_M_1", title: "투입 시간",
            caption: true, width: 370, height: 299, pager: false, show: true,
            element: [
				{ header: "구분", name: "category", width: 60, align: "center" },
				{ header: "LINE", name: "value", width: 50, align: "center" },
				{ header: "설비", name: "down_time", width: 60, align: "center" },
				{ header: "Module(대)", name: "down_rate", width: 60, align: "center" },
				{ header: "투입시간", name: "rgroup", width: 60, align: "center" },
				{ name: "rcode", hidden: true },
				{ name: "issue_part", hidden: true },
				{ name: "ymd_fr", hidden: true },
				{ name: "ymd_to", hidden: true },
				{ name: "prod_group", hidden: true },
				{ name: "prod_type1", hidden: true },
				{ name: "prod_type2", hidden: true },
				{ name: "prod_type3", hidden: true },
				{ name: "cust_cd", hidden: true },
				{ name: "cust_dept", hidden: true },
				{ name: "cust_prod_nm", hidden: true },
				{ name: "proj_no", hidden: true },
				{ name: "issue_stat", hidden: true },
				{ name: "issue_type", hidden: true },
				{ name: "chart", hidden: true }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = { targetid: "grdData_상세현황", query: "EHM_5050_M_2", title: "분류별 상세 현황",
            caption: true, width: 370, height: 299, pager: false, show: true,
            element: [
				{ header: "구분", name: "category", width: 165, align: "center" },
				{ header: "발생부서", name: "value", width: 50, align: "center" },
				{ header: "투입시간", name: "down_time", width: 60, align: "center" },
				{ name: "rgroup", hidden: true },
				{ name: "rcode", hidden: true },
				{ name: "issue_part", hidden: true },
				{ name: "issue_type", hidden: true },
				{ name: "ymd_fr", hidden: true },
				{ name: "ymd_to", hidden: true },
				{ name: "prod_group", hidden: true },
				{ name: "prod_type1", hidden: true },
				{ name: "prod_type2", hidden: true },
				{ name: "prod_type3", hidden: true }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = { targetid: "lyrChart_통계", query: "EHM_5050_S_1", title: "분류별 통계", show: true,
            format: { view: "1", rotate: "0", reverse: "1" },
            control: { by: "DX", id: ctlChart_1 }
        };
        //----------
        gw_com_module.chartCreate(args);
        //=====================================================================================
        var args = {
            targetid: "lyrChart_상세통계", query: "EHM_5050_S_2", title: "분류별 상세 통계", show: true,
            format: { view: "1", rotate: "0", reverse: "1" }, control: { by: "DX", id: ctlChart_2 }
        };
        //----------
        gw_com_module.chartCreate(args);
        //=====================================================================================
        var args = {
            target: [
				{ type: "GRID", id: "grdData_현황", offset: 15, min: true },
				{ type: "GRID", id: "grdData_상세현황", offset: 15, min: true },
                { type: "LAYER", id: "lyrChart_통계", offset: 8 },
                { type: "LAYER", id: "lyrChart_상세통계", offset: 8 }
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
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: click_lyrMenu_닫기 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: click_frmOption_실행 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: click_frmOption_취소 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemchanged", handler: itemChanged_frmOption };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_현황", grid: true, event: "rowselected", handler: rowselected_grdData_현황 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_현황", grid: true, event: "rowdblclick", handler: rowdblclick_grdData_현황 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_현황", grid: true, event: "rowkeyenter", handler: rowdblclick_grdData_현황 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_상세현황", grid: true, event: "rowdblclick", handler: rowdblclick_grdData_상세현황 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_상세현황", grid: true, event: "rowkeyenter", handler: rowdblclick_grdData_상세현황 };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_조회(ui) {
            var args = {
                target: [
					{ id: "frmOption", focus: true }
				]
            };
            gw_com_module.objToggle(args);

        }
        //----------
        function click_lyrMenu_닫기(ui) {

            processClose({});

        }
        //----------
        function click_frmOption_실행(ui) {
            var param = {
                object: ui.object
            }
            processRetrieve(param);

        }
        //----------
        function itemChanged_frmOption(ui) {
            alert("");
            switch(param.element) {
                case "M":
                    {
                        gw_com_api.show("frmOption_ym_fr");
                        gw_com_api.show("frmOption_ym_to");
                        gw_com_api.hide("frmOption_y_fr");
                        gw_com_api.hide("frmOption_y_to");
                        gw_com_api.hide("frmOption_q_fr");
                        gw_com_api.hide("frmOption_q_to");
                    }
                    break;
                case "Q":
                    {
                        gw_com_api.hide("frmOption_ym_fr");
                        gw_com_api.hide("frmOption_ym_to");
                        gw_com_api.hide("frmOption_y_fr");
                        gw_com_api.hide("frmOption_y_to");
                        gw_com_api.show("frmOption_q_fr");
                        gw_com_api.show("frmOption_q_to");
                    }
                    break;
                case "Y":
                    {
                        gw_com_api.hide("frmOption_ym_fr");
                        gw_com_api.hide("frmOption_ym_to");
                        gw_com_api.show("frmOption_y_fr");
                        gw_com_api.show("frmOption_y_to");
                        gw_com_api.hide("frmOption_q_fr");
                        gw_com_api.hide("frmOption_q_to");
                    }
                    break;
            }
        }
        //----------
        function click_frmOption_취소(ui) {
            var param = {
                object: ui.object
            }
            closeOption(param);

        }
        //----------
        function rowselected_grdData_현황(ui) {

            processLink({});

        };
        //----------
        function rowdblclick_grdData_현황(ui) {

            var args = {
                ID: gw_com_api.v_Stream.msg_linkPage,
                to: { type: "MAIN" },
                data: {
                    page: "EHM_2030",
                    title: "발생 내역",
                    param: [
                        { name: "issue_part", value: gw_com_api.getValue("grdData_현황", "selected", "issue_part", true) },
                        { name: "issue_type", value: gw_com_api.getValue("grdData_현황", "selected", "issue_type", true) },
                        { name: "prod_group", value: gw_com_api.getValue("grdData_현황", "selected", "prod_group", true) },
                        { name: "wrnt_io", value: "" },
                        { name: "ymd_fr", value: gw_com_api.getValue("grdData_현황", "selected", "ymd_fr", true) },
                        { name: "ymd_to", value: gw_com_api.getValue("grdData_현황", "selected", "ymd_to", true) },
                        { name: "issue_stat", value: gw_com_api.getValue("grdData_현황", "selected", "issue_stat", true) },
                        { name: "dept_area", value: gw_com_api.getValue("frmOption", 1, "dept_area") }
                    ]
                }
            };
            var chart = gw_com_api.getValue("grdData_현황", "selected", "chart", true);
            switch (chart) {
                case "ISSUE-STATUS":
                    {
                        args.data.param.push(
                            { name: "prod_type1", value: gw_com_api.getValue("grdData_현황", "selected", "prod_type1", true) },
                            { name: "prod_type2", value: gw_com_api.getValue("grdData_현황", "selected", "prod_type2", true) },
                            { name: "prod_type3", value: gw_com_api.getValue("grdData_현황", "selected", "prod_type3", true) },
                            { name: "cust_cd", value: gw_com_api.getValue("grdData_현황", "selected", "cust_cd", true) },
                            { name: "cust_dept", value: gw_com_api.getValue("grdData_현황", "selected", "cust_dept", true) },
                            { name: "cust_prod_nm", value: gw_com_api.getValue("grdData_현황", "selected", "cust_prod_nm", true) },
                            { name: "status_tp1", value: gw_com_api.getValue("grdData_현황", "selected", "rcode", true) },
                            { name: "status_nm1", value: gw_com_api.getValue("grdData_현황", "selected", "category", true) }
                        );
                    }
                    break;
                case "ISSUE-PART":
                    {
                        args.data.param.push(
                            { name: "prod_type1", value: gw_com_api.getValue("grdData_현황", "selected", "prod_type1", true) },
                            { name: "prod_type2", value: gw_com_api.getValue("grdData_현황", "selected", "prod_type2", true) },
                            { name: "prod_type3", value: gw_com_api.getValue("grdData_현황", "selected", "prod_type3", true) },
                            { name: "cust_cd", value: gw_com_api.getValue("grdData_현황", "selected", "cust_cd", true) },
                            { name: "cust_dept", value: gw_com_api.getValue("grdData_현황", "selected", "cust_dept", true) },
                            { name: "cust_prod_nm", value: gw_com_api.getValue("grdData_현황", "selected", "cust_prod_nm", true) },
                            { name: "part_tp1", value: gw_com_api.getValue("grdData_현황", "selected", "rcode", true) },
                            { name: "part_nm1", value: gw_com_api.getValue("grdData_현황", "selected", "category", true) }
                        );
                    }
                    break;
                case "ISSUE-REASON":
                    {
                        args.data.param.push(
                            { name: "prod_type1", value: gw_com_api.getValue("grdData_현황", "selected", "prod_type1", true) },
                            { name: "prod_type2", value: gw_com_api.getValue("grdData_현황", "selected", "prod_type2", true) },
                            { name: "prod_type3", value: gw_com_api.getValue("grdData_현황", "selected", "prod_type3", true) },
                            { name: "cust_cd", value: gw_com_api.getValue("grdData_현황", "selected", "cust_cd", true) },
                            { name: "cust_dept", value: gw_com_api.getValue("grdData_현황", "selected", "cust_dept", true) },
                            { name: "cust_prod_nm", value: gw_com_api.getValue("grdData_현황", "selected", "cust_prod_nm", true) },
                            { name: "reason_tp1", value: gw_com_api.getValue("grdData_현황", "selected", "rcode", true) },
                            { name: "reason_nm1", value: gw_com_api.getValue("grdData_현황", "selected", "category", true) }
                        );
                    }
                    break;
                case "ISSUE-CUST":
                    {
                        args.data.param.push(
                            { name: "prod_type1", value: gw_com_api.getValue("grdData_현황", "selected", "prod_type1", true) },
                            { name: "prod_type2", value: gw_com_api.getValue("grdData_현황", "selected", "prod_type2", true) },
                            { name: "prod_type3", value: gw_com_api.getValue("grdData_현황", "selected", "prod_type3", true) },
                            { name: "cust_cd", value: gw_com_api.getValue("grdData_현황", "selected", "rcode", true) }
                        );
                    }
                    break;
                case "ISSUE-LINE":
                    {
                        args.data.param.push(
                            { name: "prod_type1", value: gw_com_api.getValue("grdData_현황", "selected", "prod_type1", true) },
                            { name: "prod_type2", value: gw_com_api.getValue("grdData_현황", "selected", "prod_type2", true) },
                            { name: "prod_type3", value: gw_com_api.getValue("grdData_현황", "selected", "prod_type3", true) },
                            { name: "cust_cd", value: gw_com_api.getValue("grdData_현황", "selected", "rgroup", true) },
                            { name: "cust_dept", value: gw_com_api.getValue("grdData_현황", "selected", "rcode", true) }
                        );
                    }
                    break;
                case "ISSUE-PROD":
                    {
                        args.data.param.push(
                            { name: "cust_cd", value: gw_com_api.getValue("grdData_현황", "selected", "cust_cd", true) },
                            { name: "cust_dept", value: gw_com_api.getValue("grdData_현황", "selected", "cust_dept", true) },
                            { name: "prod_type1", value: gw_com_api.getValue("grdData_현황", "selected", "rcode", true) },
                            { name: "prod_type2", value: "" },
                            { name: "prod_type3", value: "" }
                        );
                    }
                    break;
            }
            gw_com_module.streamInterface(args);

        }
        //----------
        function rowdblclick_grdData_상세현황(ui) {

            var args = {
                ID: gw_com_api.v_Stream.msg_linkPage,
                to: {
                    type: "MAIN"
                },
                data: {
                    page: "EHM_2030",
                    title: "발생 내역",
                    param: [
                        { name: "issue_part", value: gw_com_api.getValue("grdData_현황", "selected", "issue_part", true) },
                        { name: "issue_type", value: gw_com_api.getValue("grdData_현황", "selected", "issue_type", true) },
                        { name: "wrnt_io", value: "" },
                        { name: "ymd_fr", value: gw_com_api.getValue("grdData_현황", "selected", "ymd_fr", true) },
                        { name: "ymd_to", value: gw_com_api.getValue("grdData_현황", "selected", "ymd_to", true) },
                        { name: "issue_stat", value: gw_com_api.getValue("grdData_현황", "selected", "issue_stat", true) },
                        { name: "dept_area", value: gw_com_api.getValue("frmOption", 1, "dept_area") }
                    ]
                }
            };
            var chart = gw_com_api.getValue("grdData_현황", "selected", "chart", true);
            switch (chart) {
                case "ISSUE-STATUS":
                    {
                        args.data.param.push(
                            { name: "prod_group", value: gw_com_api.getValue("grdData_현황", "selected", "prod_group", true) },
                            { name: "prod_type1", value: gw_com_api.getValue("grdData_현황", "selected", "prod_type1", true) },
                            { name: "cust_cd", value: gw_com_api.getValue("grdData_현황", "selected", "cust_cd", true) },
                            { name: "cust_dept", value: gw_com_api.getValue("grdData_현황", "selected", "cust_dept", true) },
                            { name: "cust_prod_nm", value: gw_com_api.getValue("grdData_현황", "selected", "cust_prod_nm", true) },
                            { name: "status_tp1", value: gw_com_api.getValue("grdData_현황", "selected", "rcode", true) },
                            { name: "status_nm1", value: gw_com_api.getValue("grdData_현황", "selected", "category", true) },
                            { name: "status_tp2", value: gw_com_api.getValue("grdData_상세현황", "selected", "rcode", true) },
                            { name: "status_nm2", value: gw_com_api.getValue("grdData_상세현황", "selected", "category", true) }
                        );
                    }
                    break;
                case "ISSUE-PART":
                    {
                        args.data.param.push(
                            { name: "prod_group", value: gw_com_api.getValue("grdData_현황", "selected", "prod_group", true) },
                            { name: "prod_type1", value: gw_com_api.getValue("grdData_현황", "selected", "prod_type1", true) },
                            { name: "cust_cd", value: gw_com_api.getValue("grdData_현황", "selected", "cust_cd", true) },
                            { name: "cust_dept", value: gw_com_api.getValue("grdData_현황", "selected", "cust_dept", true) },
                            { name: "cust_prod_nm", value: gw_com_api.getValue("grdData_현황", "selected", "cust_prod_nm", true) },
                            { name: "part_tp1", value: gw_com_api.getValue("grdData_현황", "selected", "rcode", true) },
                            { name: "part_nm1", value: gw_com_api.getValue("grdData_현황", "selected", "category", true) },
                            { name: "part_tp2", value: gw_com_api.getValue("grdData_상세현황", "selected", "rcode", true) },
                            { name: "part_nm2", value: gw_com_api.getValue("grdData_상세현황", "selected", "category", true) }
                        );
                    }
                    break;
                case "ISSUE-REASON":
                    {
                        args.data.param.push(
                            { name: "prod_group", value: gw_com_api.getValue("grdData_현황", "selected", "prod_group", true) },
                            { name: "prod_type1", value: gw_com_api.getValue("grdData_현황", "selected", "prod_type1", true) },
                            { name: "cust_cd", value: gw_com_api.getValue("grdData_현황", "selected", "cust_cd", true) },
                            { name: "cust_dept", value: gw_com_api.getValue("grdData_현황", "selected", "cust_dept", true) },
                            { name: "cust_prod_nm", value: gw_com_api.getValue("grdData_현황", "selected", "cust_prod_nm", true) },
                            { name: "reason_tp1", value: gw_com_api.getValue("grdData_현황", "selected", "rcode", true) },
                            { name: "reason_nm1", value: gw_com_api.getValue("grdData_현황", "selected", "category", true) },
                            { name: "reason_tp2", value: gw_com_api.getValue("grdData_상세현황", "selected", "rcode", true) },
                            { name: "reason_nm2", value: gw_com_api.getValue("grdData_상세현황", "selected", "category", true) }
                        );
                    }
                    break;
                case "ISSUE-CUST":
                    {
                        args.data.param.push(
                            { name: "prod_group", value: gw_com_api.getValue("grdData_현황", "selected", "prod_group", true) },
                            { name: "prod_type1", value: gw_com_api.getValue("grdData_현황", "selected", "prod_type1", true) },
                            { name: "cust_cd", value: gw_com_api.getValue("grdData_현황", "selected", "rcode", true) },
                            { name: "cust_dept", value: gw_com_api.getValue("grdData_상세현황", "selected", "rcode", true) }
                        );
                    }
                    break;
                case "ISSUE-LINE":
                    {
                        args.data.param.push(
                            { name: "prod_group", value: gw_com_api.getValue("grdData_현황", "selected", "prod_group", true) },
                            { name: "prod_type1", value: gw_com_api.getValue("grdData_현황", "selected", "prod_type1", true) },
                            { name: "cust_cd", value: gw_com_api.getValue("grdData_현황", "selected", "rgroup", true) },
                            { name: "cust_dept", value: gw_com_api.getValue("grdData_현황", "selected", "rcode", true) },
                            { name: "cust_proc", value: gw_com_api.getValue("grdData_상세현황", "selected", "rcode", true) }
                        );
                    }
                    break;
                case "ISSUE-PROD":
                    {
                        args.data.param.push(
                            { name: "cust_cd", value: gw_com_api.getValue("grdData_현황", "selected", "cust_cd", true) },
                            { name: "cust_dept", value: gw_com_api.getValue("grdData_현황", "selected", "cust_dept", true) },
                            { name: "prod_group", value: gw_com_api.getValue("grdData_현황", "selected", "prod_group", true) },
                            { name: "prod_type1", value: gw_com_api.getValue("grdData_현황", "selected", "rcode", true) },
                            { name: "cust_prod_nm", value: gw_com_api.getValue("grdData_상세현황", "selected", "rcode", true) }
                        );
                    }
                    break;
            }
            gw_com_module.streamInterface(args);

        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -3 }));
        gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate(""));
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
	        {
	            type: "FORM",
	            id: param.object
	        }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;
    
    var args = {
        source: {
            type: "FORM",
            id: param.object,
            hide: true,
            element: [
				{ name: "ymd_fr", argument: "arg_ymd_fr" },
				{ name: "ymd_to", argument: "arg_ymd_to" },
				{ name: "issue_type", argument: "arg_issue_type" },
				{ name: "issue_stat", argument: "arg_issue_stat" },
				{ name: "prod_group", argument: "arg_prod_group" },
				{ name: "prod_type1", argument: "arg_prod_type1" },
				{ name: "prod_type2", argument: "arg_prod_type2" },
				{ name: "prod_type3", argument: "arg_prod_type3" },
				{ name: "cust_cd", argument: "arg_cust_cd" },
				{ name: "cust_dept", argument: "arg_cust_dept" },
				{ name: "cust_prod_nm", argument: "arg_cust_prod_nm" },
				{ name: "proj_no", argument: "arg_proj_no" },
                { name: "chart", argument: "arg_chart" },
                { name: "dept_area", argument: "arg_dept_area" }
            ],
			argument: [
                { name: "arg_issue_part", value: "AS" }
			],
            remark: [
	            { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }] },
		        { element: [{ name: "dept_area" }] },
		        { element: [{ name: "prod_group" }] },
		        { element: [{ name: "prod_type1"}] },
		        { element: [{ name: "cust_cd"}] },
		        { element: [{ name: "cust_dept"}] },
		        { element: [{ name: "cust_prod_nm"}] },
		        { element: [{ name: "issue_stat"}] },
		        { element: [{ name: "proj_no"}] },
		        { element: [{ name: "chart"}] }
		    ]
        },
        target: [
			{ type: "GRID", id: "grdData_현황" },
			{ type: "CHART", id: "lyrChart_통계" }
		],
        clear: [
			{ type: "GRID", id: "grdData_상세현황" },
			{ type: "CHART", id: "lyrChart_상세통계" }
		],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function selectChange(param) {
    var category = gw_com_api.getValue("frmOption", 1, "category");
    switch (category) {
        case "mm":
            {
                gw_com_api.hide("frmOption_y");
                gw_com_api.hide("frmOption_q");
                gw_com_api.show("frmOption");
            }
            break;
        case "qq":
            {
                gw_com_api.hide("frmOption");
                gw_com_api.hide("frmOption_y");
                gw_com_api.show("frmOption_q");
            }
            break;
        case "yy":
            {
                gw_com_api.hide("frmOption");
                gw_com_api.hide("frmOption_q");
                gw_com_api.show("frmOption_y");
                //gw_com_api.setValue("frmOption_y", 1, "category", category);
            }
            break;
    }
}
function processLink(param) {
    
    var args = {
        source: {
            type: "GRID", id: "grdData_현황", row: "selected", block: true,
            element: [
                { name: "chart", argument: "arg_chart" },
				{ name: "issue_part", argument: "arg_issue_part" },
				{ name: "issue_type", argument: "arg_issue_type" },
                { name: "ymd_fr", argument: "arg_ymd_fr" },
				{ name: "ymd_to", argument: "arg_ymd_to" },
				{ name: "issue_stat", argument: "arg_issue_stat" },
				{ name: "prod_group", argument: "arg_prod_group" },
				{ name: "prod_type1", argument: "arg_prod_type1" },
				{ name: "prod_type2", argument: "arg_prod_type2" },
				{ name: "prod_type3", argument: "arg_prod_type3" },
				{ name: "cust_cd", argument: "arg_cust_cd" },
				{ name: "cust_dept", argument: "arg_cust_dept" },
				{ name: "cust_prod_nm", argument: "arg_cust_prod_nm" },
				{ name: "proj_no", argument: "arg_proj_no" },
				{ name: "rcode", argument: "arg_tp" }
            ],
            argument: [
                { name: "arg_dept_area", value: gw_com_api.getValue("frmOption", 1, "dept_area") }
            ]
        },
        target: [
            {
                type: "GRID", id: "grdData_상세현황"
            },
			{
			    type: "CHART", id: "lyrChart_상세통계"
			}
		],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closePage
    };
    gw_com_module.streamInterface(args);

}
//----------
function closeOption(param) {

    gw_com_api.hide(param.object);

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
                if (param.data.page != gw_com_api.getPageID())
                    break;
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//