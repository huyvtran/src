
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

        start();

        //----------
        function start() { gw_job_process.UI(); }

    },

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage UI. (design section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    UI: function () {

        //==== Menu : Main ====
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "조회", value: "조회", act: true },
				{ name: "닫기", value: "닫기" }
            ]
        };
        gw_com_module.buttonMenu(args);

        //==== Option : Form Main ====
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, show: true, border: true, remark: "lyrRemark_2",
            editable: { focus: "year", validate: true },
            content: {
                row: [
                        {
                            element: [
                                {
                                    name: "year", label: { title: "조회 연도 :" },
                                    editable: { type: "text", size: 4, maxlength: 4 }
                                }//,
                                //{
                                //    name: "ym_fr", label: { title: "조회 월 :" },
                                //    style: { colfloat: "floating" }, mask: "date-ym",
                                //    editable: { type: "text", size: 5, maxlength: 10 }
                                //},
                                //{
                                //    name: "ym_to", label: { title: "~" },
                                //    mask: "date-ym",
                                //    editable: { type: "text", size: 5, maxlength: 10 }
                                //}
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
        var args = {
            targetid: "lyrChart_1", query: "KPI_1110_0", title: "Main 지표", show: true,
            format: { view: "8" },
            control: { by: "DX", id: ctlChart_1 }
        };
        //----------
        gw_com_module.chartCreate(args);
        //=====================================================================================
        var args = {
            targetid: "lyrChart_2", query: "KPI_1110_0", title: "Main 지표", show: true,
            format: { view: "1", rotate: "0", reverse: "0" },
            control: { by: "DX", id: ctlChart_2 }
        };
        //----------
        gw_com_module.chartCreate(args);
        //=====================================================================================
        var args = {
            targetid: "lyrChart_3", query: "KPI_1110_2", title: "월별 추이", show: false,
            format: { view: "1", rotate: "0", reverse: "0" },
            control: { by: "DX", id: ctlChart_3 }
        };
        //----------
        gw_com_module.chartCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_1", query: "", title: "상세1",
            caption: true, width: 370, height: 299, pager: false, show: true,
            element: [
				{ header: "분류", name: "category", width: 165, align: "center" },
				{ header: "건수", name: "value", width: 50, align: "center" },
				//{ header: "DOWN시간", name: "down_time", width: 60, align: "center" },
				//{ header: "DOWN율", name: "down_rate", width: 60, align: "center" },
				{
				    name: "rgroup",
				    hidden: true
				},
				{
				    name: "rcode",
				    hidden: true
				},
				{
				    name: "issue_part",
				    hidden: true
				},
				{ name: "ymd_fr", hidden: true },
				{ name: "ymd_to", hidden: true },
				{
				    name: "prod_group",
				    hidden: true
				},
				{ name: "prod_type1", hidden: true },
				{ name: "prod_type2", hidden: true },
				{ name: "prod_type3", hidden: true },
				{
				    name: "cust_cd",
				    hidden: true
				},
				{
				    name: "cust_dept",
				    hidden: true
				},
				{
				    name: "cust_prod_nm",
				    hidden: true
				},
				{
				    name: "proj_no",
				    hidden: true
				},
				{ name: "issue_stat", hidden: true },
				{ name: "issue_type", hidden: true },
				{ name: "chart", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_2", query: "", title: "상세2",
            caption: true, width: 370, height: 299, pager: false, show: true,
            element: [
				{
				    header: "구분",
				    name: "category",
				    width: 165,
				    align: "center"
				},
				{
				    header: "건수",
				    name: "value",
				    width: 50,
				    align: "center"
				},
				//{ header: "DOWN시간", name: "down_time", width: 60, align: "center" },
				//{ header: "DOWN율", name: "down_rate", width: 60, align: "center" },
				{
				    name: "rgroup",
				    hidden: true
				},
				{
				    name: "rcode",
				    hidden: true
				},
				{
				    name: "issue_part",
				    hidden: true
				},
				{ name: "issue_type", hidden: true },
				{
				    name: "ymd_fr",
				    hidden: true
				},
				{
				    name: "ymd_to",
				    hidden: true
				},
				{
				    name: "prod_group",
				    hidden: true
				},
				{ name: "prod_type1", hidden: true },
				{ name: "prod_type2", hidden: true },
				{ name: "prod_type3", hidden: true },
				{
				    name: "cust_cd",
				    hidden: true
				},
				{
				    name: "cust_dept",
				    hidden: true
				},
				{
				    name: "cust_prod_nm",
				    hidden: true
				},
				{
				    name: "proj_no",
				    hidden: true
				},
				{
				    name: "issue_stat",
				    hidden: true
				}
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "LAYER", id: "lyrChart_1", offset: 8 },
                { type: "LAYER", id: "lyrChart_2", offset: 8 },
				{ type: "GRID", id: "grdList_1", offset: 15, min: true },
				{ type: "GRID", id: "grdList_2", offset: 15, min: true }
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
        //var args = { targetid: "grdList_1", grid: true, event: "rowselected", handler: rowselected_grdList_1 };
        //gw_com_module.eventBind(args);
        ////----------
        //var args = { targetid: "grdList_1", grid: true, event: "rowdblclick", handler: rowdblclick_grdList_1 };
        //gw_com_module.eventBind(args);
        ////----------
        //var args = { targetid: "grdList_1", grid: true, event: "rowkeyenter", handler: rowdblclick_grdList_1 };
        //gw_com_module.eventBind(args);
        ////----------
        //var args = { targetid: "grdList_2", grid: true, event: "rowdblclick", handler: rowdblclick_grdList_2 };
        //gw_com_module.eventBind(args);
        ////----------
        //var args = { targetid: "grdList_2", grid: true, event: "rowkeyenter", handler: rowdblclick_grdList_2 };
        //gw_com_module.eventBind(args);

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

            processRetrieve({});

        }
        //----------
        function click_frmOption_취소(ui) {

            closeOption({});

        }
        //----------
        function rowselected_grdList_1(ui) {

            processLink({});

        };
        //----------
        function rowdblclick_grdList_1(ui) {

            var args = {
                ID: gw_com_api.v_Stream.msg_linkPage,
                to: { type: "MAIN" },
                data: {
                    page: "EHM_2030",
                    title: "발생 내역",
                    param: [
                        { name: "issue_part", value: gw_com_api.getValue("grdList_1", "selected", "issue_part", true) },
                        { name: "issue_type", value: gw_com_api.getValue("grdList_1", "selected", "issue_type", true) },
                        { name: "prod_group", value: gw_com_api.getValue("grdList_1", "selected", "prod_group", true) },
                        { name: "wrnt_io", value: "" },
                        { name: "ymd_fr", value: gw_com_api.getValue("grdList_1", "selected", "ymd_fr", true) },
                        { name: "ymd_to", value: gw_com_api.getValue("grdList_1", "selected", "ymd_to", true) },
                        { name: "issue_stat", value: gw_com_api.getValue("grdList_1", "selected", "issue_stat", true) },
                        { name: "dept_area", value: gw_com_api.getValue("frmOption", 1, "dept_area") }
                    ]
                }
            };
            var chart = gw_com_api.getValue("grdList_1", "selected", "chart", true);
            switch (chart) {
                case "ISSUE-STATUS":
                    {
                        args.data.param.push(
                            { name: "prod_type1", value: gw_com_api.getValue("grdList_1", "selected", "prod_type1", true) },
                            { name: "prod_type2", value: gw_com_api.getValue("grdList_1", "selected", "prod_type2", true) },
                            { name: "prod_type3", value: gw_com_api.getValue("grdList_1", "selected", "prod_type3", true) },
                            { name: "cust_cd", value: gw_com_api.getValue("grdList_1", "selected", "cust_cd", true) },
                            { name: "cust_dept", value: gw_com_api.getValue("grdList_1", "selected", "cust_dept", true) },
                            { name: "cust_prod_nm", value: gw_com_api.getValue("grdList_1", "selected", "cust_prod_nm", true) },
                            { name: "status_tp1", value: gw_com_api.getValue("grdList_1", "selected", "rcode", true) },
                            { name: "status_nm1", value: gw_com_api.getValue("grdList_1", "selected", "category", true) }
                        );
                    }
                    break;
                case "ISSUE-PART":
                    {
                        args.data.param.push(
                            { name: "prod_type1", value: gw_com_api.getValue("grdList_1", "selected", "prod_type1", true) },
                            { name: "prod_type2", value: gw_com_api.getValue("grdList_1", "selected", "prod_type2", true) },
                            { name: "prod_type3", value: gw_com_api.getValue("grdList_1", "selected", "prod_type3", true) },
                            { name: "cust_cd", value: gw_com_api.getValue("grdList_1", "selected", "cust_cd", true) },
                            { name: "cust_dept", value: gw_com_api.getValue("grdList_1", "selected", "cust_dept", true) },
                            { name: "cust_prod_nm", value: gw_com_api.getValue("grdList_1", "selected", "cust_prod_nm", true) },
                            { name: "part_tp1", value: gw_com_api.getValue("grdList_1", "selected", "rcode", true) },
                            { name: "part_nm1", value: gw_com_api.getValue("grdList_1", "selected", "category", true) }
                        );
                    }
                    break;
                case "ISSUE-REASON":
                    {
                        args.data.param.push(
                            { name: "prod_type1", value: gw_com_api.getValue("grdList_1", "selected", "prod_type1", true) },
                            { name: "prod_type2", value: gw_com_api.getValue("grdList_1", "selected", "prod_type2", true) },
                            { name: "prod_type3", value: gw_com_api.getValue("grdList_1", "selected", "prod_type3", true) },
                            { name: "cust_cd", value: gw_com_api.getValue("grdList_1", "selected", "cust_cd", true) },
                            { name: "cust_dept", value: gw_com_api.getValue("grdList_1", "selected", "cust_dept", true) },
                            { name: "cust_prod_nm", value: gw_com_api.getValue("grdList_1", "selected", "cust_prod_nm", true) },
                            { name: "reason_tp1", value: gw_com_api.getValue("grdList_1", "selected", "rcode", true) },
                            { name: "reason_nm1", value: gw_com_api.getValue("grdList_1", "selected", "category", true) }
                        );
                    }
                    break;
                case "ISSUE-CUST":
                    {
                        args.data.param.push(
                            { name: "prod_type1", value: gw_com_api.getValue("grdList_1", "selected", "prod_type1", true) },
                            { name: "prod_type2", value: gw_com_api.getValue("grdList_1", "selected", "prod_type2", true) },
                            { name: "prod_type3", value: gw_com_api.getValue("grdList_1", "selected", "prod_type3", true) },
                            { name: "cust_cd", value: gw_com_api.getValue("grdList_1", "selected", "rcode", true) }
                        );
                    }
                    break;
                case "ISSUE-LINE":
                    {
                        args.data.param.push(
                            { name: "prod_type1", value: gw_com_api.getValue("grdList_1", "selected", "prod_type1", true) },
                            { name: "prod_type2", value: gw_com_api.getValue("grdList_1", "selected", "prod_type2", true) },
                            { name: "prod_type3", value: gw_com_api.getValue("grdList_1", "selected", "prod_type3", true) },
                            { name: "cust_cd", value: gw_com_api.getValue("grdList_1", "selected", "rgroup", true) },
                            { name: "cust_dept", value: gw_com_api.getValue("grdList_1", "selected", "rcode", true) }
                        );
                    }
                    break;
                case "ISSUE-PROD":
                    {
                        args.data.param.push(
                            { name: "cust_cd", value: gw_com_api.getValue("grdList_1", "selected", "cust_cd", true) },
                            { name: "cust_dept", value: gw_com_api.getValue("grdList_1", "selected", "cust_dept", true) },
                            { name: "prod_type1", value: gw_com_api.getValue("grdList_1", "selected", "rcode", true) },
                            { name: "prod_type2", value: "" },
                            { name: "prod_type3", value: "" }
                        );
                    }
                    break;
            }
            gw_com_module.streamInterface(args);

        }
        //----------
        function rowdblclick_grdList_2(ui) {

            var args = {
                ID: gw_com_api.v_Stream.msg_linkPage,
                to: {
                    type: "MAIN"
                },
                data: {
                    page: "EHM_2030",
                    title: "발생 내역",
                    param: [
                        { name: "issue_part", value: gw_com_api.getValue("grdList_1", "selected", "issue_part", true) },
                        { name: "issue_type", value: gw_com_api.getValue("grdList_1", "selected", "issue_type", true) },
                        { name: "wrnt_io", value: "" },
                        { name: "ymd_fr", value: gw_com_api.getValue("grdList_1", "selected", "ymd_fr", true) },
                        { name: "ymd_to", value: gw_com_api.getValue("grdList_1", "selected", "ymd_to", true) },
                        { name: "issue_stat", value: gw_com_api.getValue("grdList_1", "selected", "issue_stat", true) },
                        { name: "dept_area", value: gw_com_api.getValue("frmOption", 1, "dept_area") }
                    ]
                }
            };
            var chart = gw_com_api.getValue("grdList_1", "selected", "chart", true);
            switch (chart) {
                case "ISSUE-STATUS":
                    {
                        args.data.param.push(
                            { name: "prod_group", value: gw_com_api.getValue("grdList_1", "selected", "prod_group", true) },
                            { name: "prod_type1", value: gw_com_api.getValue("grdList_1", "selected", "prod_type1", true) },
                            { name: "cust_cd", value: gw_com_api.getValue("grdList_1", "selected", "cust_cd", true) },
                            { name: "cust_dept", value: gw_com_api.getValue("grdList_1", "selected", "cust_dept", true) },
                            { name: "cust_prod_nm", value: gw_com_api.getValue("grdList_1", "selected", "cust_prod_nm", true) },
                            { name: "status_tp1", value: gw_com_api.getValue("grdList_1", "selected", "rcode", true) },
                            { name: "status_nm1", value: gw_com_api.getValue("grdList_1", "selected", "category", true) },
                            { name: "status_tp2", value: gw_com_api.getValue("grdList_2", "selected", "rcode", true) },
                            { name: "status_nm2", value: gw_com_api.getValue("grdList_2", "selected", "category", true) }
                        );
                    }
                    break;
                case "ISSUE-PART":
                    {
                        args.data.param.push(
                            { name: "prod_group", value: gw_com_api.getValue("grdList_1", "selected", "prod_group", true) },
                            { name: "prod_type1", value: gw_com_api.getValue("grdList_1", "selected", "prod_type1", true) },
                            { name: "cust_cd", value: gw_com_api.getValue("grdList_1", "selected", "cust_cd", true) },
                            { name: "cust_dept", value: gw_com_api.getValue("grdList_1", "selected", "cust_dept", true) },
                            { name: "cust_prod_nm", value: gw_com_api.getValue("grdList_1", "selected", "cust_prod_nm", true) },
                            { name: "part_tp1", value: gw_com_api.getValue("grdList_1", "selected", "rcode", true) },
                            { name: "part_nm1", value: gw_com_api.getValue("grdList_1", "selected", "category", true) },
                            { name: "part_tp2", value: gw_com_api.getValue("grdList_2", "selected", "rcode", true) },
                            { name: "part_nm2", value: gw_com_api.getValue("grdList_2", "selected", "category", true) }
                        );
                    }
                    break;
                case "ISSUE-REASON":
                    {
                        args.data.param.push(
                            { name: "prod_group", value: gw_com_api.getValue("grdList_1", "selected", "prod_group", true) },
                            { name: "prod_type1", value: gw_com_api.getValue("grdList_1", "selected", "prod_type1", true) },
                            { name: "cust_cd", value: gw_com_api.getValue("grdList_1", "selected", "cust_cd", true) },
                            { name: "cust_dept", value: gw_com_api.getValue("grdList_1", "selected", "cust_dept", true) },
                            { name: "cust_prod_nm", value: gw_com_api.getValue("grdList_1", "selected", "cust_prod_nm", true) },
                            { name: "reason_tp1", value: gw_com_api.getValue("grdList_1", "selected", "rcode", true) },
                            { name: "reason_nm1", value: gw_com_api.getValue("grdList_1", "selected", "category", true) },
                            { name: "reason_tp2", value: gw_com_api.getValue("grdList_2", "selected", "rcode", true) },
                            { name: "reason_nm2", value: gw_com_api.getValue("grdList_2", "selected", "category", true) }
                        );
                    }
                    break;
                case "ISSUE-CUST":
                    {
                        args.data.param.push(
                            { name: "prod_group", value: gw_com_api.getValue("grdList_1", "selected", "prod_group", true) },
                            { name: "prod_type1", value: gw_com_api.getValue("grdList_1", "selected", "prod_type1", true) },
                            { name: "cust_cd", value: gw_com_api.getValue("grdList_1", "selected", "rcode", true) },
                            { name: "cust_dept", value: gw_com_api.getValue("grdList_2", "selected", "rcode", true) }
                        );
                    }
                    break;
                case "ISSUE-LINE":
                    {
                        args.data.param.push(
                            { name: "prod_group", value: gw_com_api.getValue("grdList_1", "selected", "prod_group", true) },
                            { name: "prod_type1", value: gw_com_api.getValue("grdList_1", "selected", "prod_type1", true) },
                            { name: "cust_cd", value: gw_com_api.getValue("grdList_1", "selected", "rgroup", true) },
                            { name: "cust_dept", value: gw_com_api.getValue("grdList_1", "selected", "rcode", true) },
                            { name: "cust_proc", value: gw_com_api.getValue("grdList_2", "selected", "rcode", true) }
                        );
                    }
                    break;
                case "ISSUE-PROD":
                    {
                        args.data.param.push(
                            { name: "cust_cd", value: gw_com_api.getValue("grdList_1", "selected", "cust_cd", true) },
                            { name: "cust_dept", value: gw_com_api.getValue("grdList_1", "selected", "cust_dept", true) },
                            { name: "prod_group", value: gw_com_api.getValue("grdList_1", "selected", "prod_group", true) },
                            { name: "prod_type1", value: gw_com_api.getValue("grdList_1", "selected", "rcode", true) },
                            { name: "cust_prod_nm", value: gw_com_api.getValue("grdList_2", "selected", "rcode", true) }
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
        gw_com_api.setValue("frmOption", 1, "year", gw_com_api.getYear());
        //gw_com_api.setValue("frmOption", 1, "ym_fr", gw_com_api.getYM("", { month: -3 }));
        //gw_com_api.setValue("frmOption", 1, "ym_to", gw_com_api.getYM(""));
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

    gw_com_api.block();

    if (param.object == "lyrChart_1") {
        args = {
            source: {
                type: "FORM", id: "frmOption",
                element: [
                    { name: "year", argument: "arg_year" }
                ],
                argument: [
                    { name: "arg_tp", value: param.cat }
                ]
            },
            target: [
                { type: "CHART", id: "lyrChart_3" }
            ],
            clear: [
                { type: "GRID", id: "grdList_1" },
                { type: "GRID", id: "grdList_2" }
            ]
        };
    } else {
        args = {
            source: {
                type: "FORM", id: "frmOption", hide: true,
                element: [
                    { name: "year", argument: "arg_year" }
                ],
                //argument: [
                //    { name: "arg_tp", value: "MAIN" }
                //],
                remark: [
                    { element: [{ name: "year" }] }//,
                    //{ infix: "~", element: [{ name: "ym_fr" }, { name: "ym_to" }] }
                ]
            },
            target: [
                { type: "CHART", id: "lyrChart_1" },
                { type: "CHART", id: "lyrChart_2" }
            ],
            clear: [
                { type: "CHART", id: "lyrChart_3" },
                { type: "GRID", id: "grdList_1" },
                { type: "GRID", id: "grdList_2" }
            ]
        };
    }
    gw_com_module.objRetrieve(args);

    gw_com_api.unblock();

}
//----------
function processLink(param) {
    
    var args = {
        source: {
            type: "GRID", id: "grdList_1", row: "selected", block: true,
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
                type: "GRID",
                id: "grdList_2"
            },
			{
			    type: "CHART",
			    id: "lyrChart_2"
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

    gw_com_api.hide("frmOption");

}
//----------
function processClientObjectSelected(s, e) {

    var gCode, gName, gRmk = "";
    var i = 0;
    var IsOk = false;

    if (e.hitInfo.chartTitle) {

        gw_com_api.show("lyrChart_2");
        gw_com_api.hide("lyrChart_3");

    } else if (e.additionalHitObject != null) {

        gw_com_api.show("lyrChart_3");
        gw_com_api.hide("lyrChart_2");

        var cat = e.additionalHitObject.argument ? e.additionalHitObject.argument : e.additionalHitObject.axisValue;
        processRetrieve({ object: "lyrChart_1", cat: cat });

        //var HitCode = e.additionalHitObject.argument;	// Category
        //var HitValue = e.additionalHitObject.values;
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
                if (param.data.page != gw_com_api.getPageID())
                    break;
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//