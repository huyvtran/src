
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
				{ type: "PAGE", name: "DATA_YM", query: "KPI_1110_Z" }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);

        //----------
        function start() {
            gw_job_process.UI();

            //----------
            setDefault();
            processRetrieve({});
            //----------

            gw_com_module.startPage();

        }

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
            targetid: "frmOption2", type: "FREE", title: "조회 조건",
            trans: true, show: true, border: false, align: "left", //remark: "lyrRemark2",
            editable: { focus: "ymd_fr", validate: true },
            content: {
                row: [
                        {
                            element: [
                                {
                                    name: "ymd_fr", label: { title: "조회기간 :" },
                                    style: { colfloat: "float" },
                                    editable: { type: "select", data: { memory: "DATA_YM" }, validate: { rule: "required" } }
                                },
                                {
                                    name: "ymd_to", label: { title: "~" },
                                    style: { colfloat: "floated" },
                                    editable: { type: "select", data: { memory: "DATA_YM" }, validate: { rule: "required" } }
                                },
                                { name: "kpi_group", hidden: true },
                                { name: "kpi_group_nm", hidden: true },
                                { name: "kpi_item", hidden: true },
                                { name: "kpi_item_nm", hidden: true }
                            ]
                        }//,
                        //{
                        //    align: "right",
                        //    element: [
                        //        { name: "실행", value: "실행", act: true, format: { type: "button" } },
                        //        { name: "취소", value: "취소", format: { type: "button", icon: "닫기" } }
                        //    ]
                        //}
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "lyrChart_1", query: "KPI_1110_1", title: "품질 지표", show: true,
            format: { view: "8" },
            control: { by: "DX", id: ctlChart_1 },
            handler: {
                event: "dblclick",
                action: processDblclick
            }
        };
        //----------
        gw_com_module.chartCreate(args);
        //=====================================================================================
        var args = {
            targetid: "lyrChart_2", query: "KPI_1110_2", title: "월별 추이", show: true,
            format: { view: "1", rotate: "0", reverse: "0" },
            control: { by: "DX", id: ctlChart_2 },
            handler: {
                event: "dblclick",
                action: processDblclick
            }
        };
        //----------
        gw_com_module.chartCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_1", query: "KPI_1110_5", title: "달성율",
            caption: true, /*width: 370,*/ height: 299, pager: true, show: true, selectable: false,
            color: { row: true },
            element: [
				{ header: "지표 구분", name: "series", width: 80 },
				{ header: "지표 항목", name: "category", width: 120 },
				{ header: "목표", name: "value1", width: 50, align: "right", mask: "numeric-int" },
				{ header: "실적", name: "value2", width: 50, align: "right", mask: "numeric-int" },
				{ header: "달성율(%)", name: "value3", width: 60, align: "right", mask: "numeric-float" },
                { name: "kpi_group", hidden: true },
                { name: "kpi_item", hidden: true },
                { name: "color", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_2", query: "KPI_1110_6", title: "프로젝트별 현황",
            caption: true, /*width: 370,*/ height: 299, pager: true, show: true, selectable: false,
            //color: { row: true },
            element: [
				{ header: "프로젝트", name: "proj_nm", width: 140 },
				{ header: "사양", name: "val01", width: 40, align: "right", mask: "numeric-float" },
				{ header: "설계", name: "val02", width: 40, align: "right", mask: "numeric-float" },
				{ header: "구매", name: "val03", width: 40, align: "right", mask: "numeric-float" },
				{ header: "제조", name: "val04", width: 40, align: "right", mask: "numeric-float" },
				{ header: "검사", name: "val05", width: 40, align: "right", mask: "numeric-float" },
				{ header: "Setup", name: "val06", width: 40, align: "right", mask: "numeric-float" },
				{ header: "공통", name: "val09", width: 40, align: "right", mask: "numeric-float" },
				{ header: "종합", name: "value", width: 40, align: "right", mask: "numeric-float" },
				{ header: "프로젝트시작일", name: "start_date", width: 80, align: "center", mask: "date-ymd" },
				{ name: "proj_no", hidden: true },
                { name: "color01", hidden: true },
                { name: "color02", hidden: true },
                { name: "color03", hidden: true },
                { name: "color04", hidden: true },
                { name: "color05", hidden: true },
                { name: "color06", hidden: true },
                { name: "color09", hidden: true },
                { name: "color", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "LAYER", id: "lyrChart_1", offset: 8 },
                { type: "LAYER", id: "lyrChart_2", offset: 8 },
				{ type: "GRID", id: "grdList_1", offset: 15 },
				{ type: "GRID", id: "grdList_2", offset: 15 }
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
        var args = { targetid: "frmOption2", element: "실행", event: "click", handler: click_frmOption2_실행 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption2", element: "취소", event: "click", handler: click_frmOption2_취소 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption2", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_1", grid: true, event: "rowdblclick", handler: processDblclick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_2", grid: true, event: "rowdblclick", handler: processDblclick };
        gw_com_module.eventBind(args);
        //----------

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_조회(ui) {

            processRetrieve({});
            //var args = {
            //    target: [
			//		{ id: "frmOption2", focus: true }
			//	]
            //};
            //gw_com_module.objToggle(args);

        }
        //----------
        function click_lyrMenu_닫기(ui) {

            processClose({});

        }
        //----------
        function click_frmOption2_실행(ui) {

            processRetrieve({});

        }
        //----------
        function click_frmOption2_취소(ui) {

            closeOption({});

        }
        //----------

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

    //if (param.object == "frmOption2") {
    //    var ymd_fr = gw_com_api.addDate("yyyy", -1, param.value.current, "");
    //    gw_com_api.setValue(param.object, param.row, "ymd_fr", ymd_fr, false, true, true);
    //    processRetrieve({});
    //}

}
//----------
function processRetrieve(param) {

    var args = {
        target: [
	        { type: "FORM", id: "frmOption2" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    if (param.object == "lyrChart_1") {
        args = {
            source: {
                type: "FORM", id: "frmOption2",
                element: [
                    { name: "kpi_group", argument: "arg_kpi_group" },
                    { name: "kpi_group_nm", argument: "arg_kpi_group_nm" }
                ],
                argument: [
                    { name: "arg_ymd_fr", value: gw_com_api.getValue("frmOption2", 1, "ymd_fr") + "01" },
                    { name: "arg_ymd_to", value: gw_com_api.getValue("frmOption2", 1, "ymd_to") + "31" }
                ]
            },
            target: [
                { type: "CHART", id: "lyrChart_2" }
            ]
        };
    } else {
        args = {
            source: {
                type: "FORM", id: "frmOption2", //hide: true,
                element: [
                    { name: "kpi_group", argument: "arg_kpi_group" },
                    { name: "kpi_group_nm", argument: "arg_kpi_group_nm" }
                ],
                argument: [
                    { name: "arg_ymd_fr", value: gw_com_api.getValue("frmOption2", 1, "ymd_fr") + "01" },
                    { name: "arg_ymd_to", value: gw_com_api.getValue("frmOption2", 1, "ymd_to") + "31" }
                ]
            },
            target: [
                { type: "CHART", id: "lyrChart_1" },
                { type: "CHART", id: "lyrChart_2" },
                { type: "GRID", id: "grdList_1" },
                { type: "GRID", id: "grdList_2" }
            ],
            handler: {
                complete: processRetrieveEnd,
                param: param
            }
        };
    }
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {

    var find = gw_com_api.getFindRow("grdList_1", "kpi_group", gw_com_api.getValue("frmOption2", 1, "kpi_group"));
    if (find > 0)
        gw_com_api.selectRow("grdList_1", find, true, false);

    var obj = "grdList_2";
    var cols = ["value", "val01", "val02", "val03", "val04", "val05", "val06", "val09"];
    var colors = ["color", "color01", "color02", "color03", "color04", "color05", "color06", "color09"];

    var ids = gw_com_api.getRowIDs(obj);
    $.each(ids, function () {
        var data = gw_com_api.getRowData(obj, this);
        var row = this;
        $.each(cols, function (i) {
            var col = gw_com_api.getColNumber(obj, cols[i]);
            var color = data[this.replace(/value/g, "color").replace(/val/g, "color")];
            $("#" + obj + "_data").jqGrid("setCell", row, col, "", { "color": color });
        });
    });

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

    gw_com_api.hide("frmOption2");

}
//----------
function processClientObjectSelected(s, e) {

    var obj = s.name.split("_")[2] + "_" + s.name.split("_")[3];
    switch (obj) {
        case "ctlChart_1":
            if (e.hitInfo.inAxisLabelItem && !e.hitInfo.inDiagram) {
                var item = Query.getKPIGroup({ kpi_group_nm: e.additionalHitObject.axisValue });
                gw_com_api.setValue("frmOption2", 1, "kpi_group", item[0]);
                gw_com_api.setValue("frmOption2", 1, "kpi_group_nm", item[1]);
                var find = gw_com_api.getFindRow("grdList_1", "kpi_group", item[0]);
                if (find > 0)
                    gw_com_api.selectRow("grdList_1", find, true, false);
            }
            break;
        default:
            return false;
    }

    processRetrieve({ object: "lyrChart_1" });

}
//----------
function processClientObjectHotTracked(s, e) {

    var obj = s.name.split("_")[2] + "_" + s.name.split("_")[3];
    var cursor = "default";
    switch (obj) {
        case "ctlChart_1":
            if (e.hitInfo.inAxisLabelItem && !e.hitInfo.inDiagram)
                cursor = "hand";
            break;
        case "ctlChart_2":
            if (e.hitInfo.inChartTitle)
                cursor = "hand";
            break;
    }

    s.SetCursor(cursor);
}
//----------
function processDblclick(param) {

    var args = {
        param: [
            { name: "date_type", value: "MONTH" },
            { name: "ymd_fr", value: gw_com_api.getValue("frmOption2", 1, "ymd_fr") },
            { name: "ymd_to", value: gw_com_api.getValue("frmOption2", 1, "ymd_to") },
            { name: "kpi_group", value: "" },
            { name: "kpi_group_nm", value: "" },
            { name: "kpi_item", value: "" },
            { name: "kpi_item_nm", value: "" },
            { name: "proj_no", value: "" },
            { name: "proj_nm", value: "" }
        ]
    };
    if (param.object == "lyrChart_2") {
        var kpi_group_nm = ctlChart_2.chart.titles[0].lines.toString().replace(" 월별 달성율 추이", "");
        var kpi_group = Query.getKPIGroup({ kpi_group_nm: kpi_group_nm });
        if (kpi_group && kpi_group.length > 0) {
            var values = [
                { name: "kpi_group", value: kpi_group[0] },
                { name: "kpi_group_nm", value: kpi_group[1] }
            ];
            args = processMergeParam({ param: args.param, merge: values });
        } else
            return false;
    } else if (param.object == "grdList_1") {
        var values = [
            { name: "kpi_item", value: gw_com_api.getValue(param.object, param.row, "kpi_item", true) },
            { name: "kpi_item_nm", value: gw_com_api.getValue(param.object, param.row, "category", true) },
            { name: "kpi_group", value: gw_com_api.getValue(param.object, param.row, "kpi_group", true) },
            { name: "kpi_group_nm", value: gw_com_api.getValue(param.object, param.row, "series", true) }
        ];
        args = processMergeParam({ param: args.param, merge: values });
    } else if (param.object == "grdList_2") {
        return false;
    } else {
        return false;
    }
    processLinkPage(args);
}
//----------
function processLinkPage(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_linkPage,
        to: { type: "MAIN" },
        data: {
            page: "KPI_1111",
            title: "KPI지표(" + param[4].value + ")",
            param: param
        }
    };
    gw_com_module.streamInterface(args);

}
//----------
function processMergeParam(param) {

    $.each(param.merge, function () {
        var value = this;
        $.each(param.param, function () {
            if (value.name == this.name) {
                this.value = value.value;
                return false;
            }
        })
    });
    return param.param;

}
//----------
function setDefault(param) {

    v_global.logic.ymd_fr = gw_com_api.getPageParameter("ymd_fr");
    v_global.logic.ymd_to = gw_com_api.getPageParameter("ymd_to");
    v_global.logic.retrieve = true

    if (v_global.logic.ymd_fr == undefined || v_global.logic.ymd_fr == "")
        v_global.logic.ymd_fr = gw_com_api.getYear() + "01";
        //v_global.logic.ymd_fr = gw_com_api.getDate("", { month: -12 });

    if (v_global.logic.ymd_to == undefined || v_global.logic.ymd_to == "")
        v_global.logic.ymd_to = gw_com_api.getYear() + gw_com_api.getMonth();
        //v_global.logic.ymd_to = gw_com_api.getDate();

    gw_com_api.setValue("frmOption2", 1, "ymd_fr", v_global.logic.ymd_fr, false, true, false);
    gw_com_api.setValue("frmOption2", 1, "ymd_to", v_global.logic.ymd_to, false, true, false);

    var item = Query.getKPIItem({ ymd_fr: v_global.logic.ymd_fr, ymd_to: v_global.logic.ymd_to });
    gw_com_api.setValue("frmOption2", 1, "kpi_group", item[2]);
    gw_com_api.setValue("frmOption2", 1, "kpi_group_nm", item[3]);

}
//----------
var Query = {
    getKPIGroup: function (param) {
        var rtn = new Array();
        var args = {
            request: "PAGE",
            url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
                    "?QRY_ID=KPI_1110_Y" +
                    "&QRY_COLS=dcode,dname,sort_seq" +
                    "&CRUD=R" +
                    "&arg_kpi_group_nm=" + encodeURIComponent(param.kpi_group_nm),
            handler_success: successRequest
        };
        //=================== async : false ========================
        $.ajaxSetup({ async: false });
        //----------
        gw_com_module.callRequest(args);
        //----------
        function successRequest(data) {
            if (data && data.length > 0)
                rtn = data[0].DATA;
        }
        //----------
        $.ajaxSetup({ async: true });
        //=================== async : true ========================
        return rtn
    },
    getKPIItem: function (param) {
        var rtn = new Array();
        var kpi_group = (param.kpi_group ? encodeURIComponent(param.kpi_group) : "%");
        var kpi_item = (param.kpi_item ? encodeURIComponent(param.kpi_item) : "%");
        var kpi_name = (param.kpi_name ? encodeURIComponent(param.kpi_name) : "%");
        var ymd_fr = param.ymd_fr.substring(0, 6) + "01";
        var ymd_to = param.ymd_to.substring(0, 6) + "31";
        var args = {
            request: "PAGE",
            url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
                    "?QRY_ID=KPI_1110_X" +
                    "&QRY_COLS=kpi_item,kpi_name,kpi_group,kpi_group_nm,val_unit,sort_seq" +
                    "&CRUD=R" +
                    "&arg_kpi_group=" + kpi_group + "&arg_kpi_item=" + kpi_item + "&arg_kpi_name=" + kpi_name + "&arg_ymd_fr=" + ymd_fr + "&arg_ymd_to=" + ymd_to,
            handler_success: successRequest
        };
        //=================== async : false ========================
        $.ajaxSetup({ async: false });
        //----------
        gw_com_module.callRequest(args);
        //----------
        function successRequest(data) {
            if (data && data.length > 0)
                rtn = data[0].DATA;
        }
        //----------
        $.ajaxSetup({ async: true });
        //=================== async : true ========================
        return rtn
    }
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
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//