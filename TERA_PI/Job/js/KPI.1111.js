
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
				{ type: "PAGE", name: "DATA_YM", query: "KPI_1110_Z" },
                { type: "PAGE", name: "DATA_YM2", query: "KPI_1110_Z2" },
                { type: "PAGE", name: "DATA_YM3", query: "KPI_1110_Z3" }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);
        //----------
        function start() {

            gw_job_process.UI();

            //----------
            setDefault();
            //----------

            if (v_global.logic.retrieve)
                processRetrieve({});

            gw_com_module.startPage();

            // 주-날짜 변환용
            v_global.logic.data_ym3 = gw_com_module.selectGet({ name: "DATA_YM3" });
        }

    },

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage UI. (design section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    UI: function () {

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
            targetid: "lyrChart_1", query: "KPI_1111_1", title: "품질 지표", show: true, menu: false,
            format: { view: "1", rotate: "0", reverse: "0" },
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
            targetid: "lyrChart_2", query: "KPI_1111_2", title: "월별 추이", show: true,
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
            targetid: "lyrChart_3", query: "KPI_1111_3", title: "상세", show: true,
            format: { view: "1", rotate: "1", reverse: "0" },
            control: { by: "DX", id: ctlChart_3 },
            handler: {
                event: "dblclick",
                action: processDblclick
            }
        };
        //----------
        gw_com_module.chartCreate(args);
        //=====================================================================================
        var args = {
            targetid: "lyrChart_4", query: "KPI_1111_5", title: "월별 추이", show: false,
            format: { view: "1", rotate: "0", reverse: "0" },
            control: { by: "DX", id: ctlChart_4 },
            handler: {
                event: "dblclick",
                action: processDblclick
            }
        };
        //----------
        gw_com_module.chartCreate(args);
        //=====================================================================================
        createForm({ kpi_item: "" });
        //----------
        createDW({ resize: false });
        //=====================================================================================
        var args = {
            target: [
                { type: "LAYER", id: "lyrChart_1", offset: 8 },
                { type: "LAYER", id: "lyrChart_2", offset: 8 },
                { type: "LAYER", id: "lyrChart_3", offset: 8 },
                { type: "LAYER", id: "lyrChart_4", offset: 8 },
				{ type: "GRID", id: "grdList_1", offset: 15 }
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
        //var args = { targetid: "frmOption2", element: "실행", event: "click", handler: click_frmOption2_실행 };
        //gw_com_module.eventBind(args);
        ////----------
        //var args = { targetid: "frmOption2", element: "취소", event: "click", handler: click_frmOption2_취소 };
        //gw_com_module.eventBind(args);
        ////----------
        //var args = { targetid: "frmOption2", event: "itemchanged", handler: processItemchanged };
        //gw_com_module.eventBind(args);
        ////----------
        //var args = { targetid: "grdList_1", grid: true, event: "rowdblclick", handler: rowdblclick_grdList_1 };
        //gw_com_module.eventBind(args);
        ////----------
        //var args = { targetid: "grdList_1", grid: true, event: "rowkeyenter", handler: rowdblclick_grdList_1 };
        //gw_com_module.eventBind(args);

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

    if (param.object == "frmOption2") {
        if (param.element == "date_type") {
            createForm({
                kpi_item: gw_com_api.getValue(param.object, param.row, "kpi_item"),
                kpi_item_nm: gw_com_api.getValue(param.object, param.row, "kpi_item_nm")
            });
        } else if (param.element == "ymd_fr") {
            if (param.value.current > gw_com_api.getValue(param.object, param.row, "ymd_to")) {
                gw_com_api.setValue(param.object, param.row, "ymd_to", param.value.current, false, false, false);
            }
        } else if (param.element == "ymd_to") {
            if (param.value.current < gw_com_api.getValue(param.object, param.row, "ymd_fr")) {
                gw_com_api.setValue(param.object, param.row, "ymd_fr", param.value.current, false, false, false);
            }
        }
    }

}
//----------
function processLink(param) {

    var kpi_item = gw_com_api.getValue(param.object, param.row, "kpi_item", true);
    if (kpi_item == "" || kpi_item == undefined || gw_com_api.getValue(param.object, param.row, "sub_cnt", true) < 1)
        return;

    var args = {
        type: "PAGE", page: "KPI_1112", title: "상세자료",
        width: 1150, height: 700, open: true,
        locate: ["center", "center"],
        id: gw_com_api.v_Stream.msg_openedDialogue
    };
    var date = getDate();
    v_global.logic.search = {
        data_tp: gw_com_api.getValue("frmOption2", 1, "data_tp"),
        ymd_fr: date.ymd_fr,
        ymd_to: date.ymd_to,
        kpi_group: gw_com_api.getValue(param.object, param.row, "kpi_group", true),
        kpi_group_nm: gw_com_api.getValue(param.object, param.row, "kpi_group_nm", true),
        kpi_item: kpi_item,
        kpi_item_nm: gw_com_api.getValue(param.object, param.row, "kpi_item_nm", true),
        key1: gw_com_api.getValue(param.object, param.row, "inf01", true),
        key_nm1: gw_com_api.getValue(param.object, param.row, "category", true)
    };
    if (gw_com_module.dialoguePrepare(args) == false) {
        args = { page: args.page, param: { ID: args.id, data: v_global.logic.search } };
        gw_com_module.dialogueOpen(args);
    }

}
//----------
function processRetrieve(param) {

    var args = {
        target: [
	        { type: "FORM", id: "frmOption2" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;
    var kpi_item = gw_com_api.getValue("frmOption2", 1, "kpi_item");
    createDW({ resize: true });
    
    if (param.object == "lyrChart_1") {
        args = {
            source: {
                type: "FORM", id: "frmOption2",
                element: [
                    { name: "date_type", argument: "arg_date_type" },
                    { name: "ymd_fr", argument: "arg_ymd_fr" },
                    { name: "ymd_to", argument: "arg_ymd_to" },
                    { name: "kpi_group", argument: "arg_kpi_group" },
                    { name: "kpi_group_nm", argument: "arg_kpi_group_nm" },
                    { name: "kpi_item", argument: "arg_kpi_item" },
                    { name: "kpi_item_nm", argument: "arg_kpi_item_nm" },
                    { name: "data_tp", argument: "arg_data_tp" },
                    { name: "data_fg", argument: "arg_data_fg" }
                ],
                argument: [
                    { name: "arg_data_tp_nm", value: gw_com_api.getText("frmOption2", 1, "data_tp") },
                    { name: "arg_data_fg_nm", value: gw_com_api.getText("frmOption2", 1, "data_fg") }
                ]
            },
            target: [
                { type: "CHART", id: kpi_item == "KPI041" ? "lyrChart_4" : "lyrChart_2" },
                { type: "CHART", id: "lyrChart_3" },
                { type: "GRID", id: "grdList_1" }
            ]
        };
    } else {
        args = {
            source: {
                type: "FORM", id: "frmOption2",
                element: [
                    { name: "date_type", argument: "arg_date_type" },
                    { name: "ymd_fr", argument: "arg_ymd_fr" },
                    { name: "ymd_to", argument: "arg_ymd_to" },
                    { name: "kpi_group", argument: "arg_kpi_group" },
                    { name: "kpi_group_nm", argument: "arg_kpi_group_nm" },
                    { name: "kpi_item", argument: "arg_kpi_item" },
                    { name: "kpi_item_nm", argument: "arg_kpi_item_nm" },
                    { name: "data_tp", argument: "arg_data_tp" },
                    { name: "data_fg", argument: "arg_data_fg" }
                ],
                argument: [
                    { name: "arg_data_tp_nm", value: gw_com_api.getText("frmOption2", 1, "data_tp") },
                    { name: "arg_data_fg_nm", value: gw_com_api.getText("frmOption2", 1, "data_fg") }
                ]
            },
            target: [
                { type: "CHART", id: "lyrChart_1" },
                { type: "CHART", id: kpi_item == "KPI041" ? "lyrChart_4" : "lyrChart_2" },
                { type: "CHART", id: "lyrChart_3" },
                { type: "GRID", id: "grdList_1" }
            ],
            clear: [
                //{ type: "CHART", id: "lyrChart_1" },
                //{ type: "CHART", id: "lyrChart_2" },
                //{ type: "CHART", id: "lyrChart_3" },
                { type: "GRID", id: "grdList_1" }
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
function closeDialogue(param) {

    var args = { page: param.page };
    gw_com_module.dialogueClose(args);

}
//----------
function processClientObjectSelected(s, e) {

    var object = "lyr" + s.name.substring(s.name.length - 7, s.name.length);
    
    if (object == "lyrChart_1") {
        if (e.hitInfo.inLegend) {
            var kpi_item_nm = e.additionalHitObject ? e.additionalHitObject.name : "";
            if (kpi_item_nm > "") {
                var date = getDate();
                var item = Query.getKPIItem({ kpi_name: kpi_item_nm, ymd_fr: date.ymd_fr, ymd_to: date.ymd_to });
                if (item && item.length > 0) {
                    gw_com_api.setValue("frmOption2", 1, "kpi_item", item[0]);
                    gw_com_api.setValue("frmOption2", 1, "kpi_item_nm", item[1]);
                    createForm({ kpi_item: item[0], kpi_item_nm: item[1] });
                    processRetrieve({ object: object });
                }
            }
        }
    }

}
//----------
function processClientObjectHotTracked(s, e) {

    var cursor = "default";

    if (e.hitInfo.inLegend)
        cursor = "hand";

    s.SetCursor(cursor);
}
//----------
function processDblclick(param) {

    return false;

}
//----------
function setDefault(param) {

    v_global.logic.date_type = gw_com_api.getPageParameter("date_type") == "" ? "MONTH" : gw_com_api.getPageParameter("date_type");
    v_global.logic.ymd_fr = gw_com_api.getPageParameter("ymd_fr");
    v_global.logic.ymd_to = gw_com_api.getPageParameter("ymd_to");
    v_global.logic.kpi_group = gw_com_api.getPageParameter("kpi_group");
    v_global.logic.kpi_group_nm = gw_com_api.getPageParameter("kpi_group_nm");
    v_global.logic.kpi_item = gw_com_api.getPageParameter("kpi_item");
    v_global.logic.kpi_item_nm = gw_com_api.getPageParameter("kpi_item_nm");
    v_global.logic.retrieve = true;

    if (v_global.logic.ymd_fr == undefined || v_global.logic.ymd_fr == "")
        v_global.logic.ymd_fr = gw_com_api.getYear() + "0101";

    if (v_global.logic.ymd_to == undefined || v_global.logic.ymd_to == "")
        v_global.logic.ymd_to = gw_com_api.getDate();

    if (v_global.logic.kpi_group != "" && v_global.logic.kpi_item == "") {
        var kpi_item = Query.getKPIItem({ kpi_group: v_global.logic.kpi_group, ymd_fr: v_global.logic.ymd_fr, ymd_to: v_global.logic.ymd_to });
        if (kpi_item.length > 0) {
            v_global.logic.kpi_item = kpi_item[0];
            v_global.logic.kpi_item_nm = kpi_item[1];
            v_global.logic.kpi_group_nm = kpi_item[3];
        } else {
            v_global.logic.err = true;
        }
    } else if (v_global.logic.kpi_item != "") {
        var kpi_item = Query.getKPIItem({ kpi_item: v_global.logic.kpi_item, ymd_fr: v_global.logic.ymd_fr, ymd_to: v_global.logic.ymd_to });
        if (kpi_item.length > 0) {
            v_global.logic.kpi_item = kpi_item[0];
            v_global.logic.kpi_item_nm = kpi_item[1];
            v_global.logic.kpi_group = kpi_item[2];
            v_global.logic.kpi_group_nm = kpi_item[3];
        } else {
            v_global.logic.err = true;
        }
    } else {
        v_global.logic.err = true;
    }

    if (v_global.logic.err) {
        v_global.logic.retrieve = false;
        gw_com_api.showMessage("데이터가 없습니다.");
    }

    if (v_global.logic.kpi_item == "KPI041") {
        gw_com_api.hide("lyrChart_2");
        gw_com_api.show("lyrChart_4");
    } else {
        gw_com_api.show("lyrChart_2");
        gw_com_api.hide("lyrChart_4");
    }

    gw_com_api.setValue("frmOption2", 1, "date_type", v_global.logic.date_type, false, false, false);
    gw_com_api.setValue("frmOption2", 1, "ymd_fr", v_global.logic.ymd_fr);
    gw_com_api.setValue("frmOption2", 1, "ymd_to", v_global.logic.ymd_to);
    gw_com_api.setValue("frmOption2", 1, "kpi_group", v_global.logic.kpi_group);
    gw_com_api.setValue("frmOption2", 1, "kpi_group_nm", v_global.logic.kpi_group_nm);
    gw_com_api.setValue("frmOption2", 1, "kpi_item", v_global.logic.kpi_item);
    gw_com_api.setValue("frmOption2", 1, "kpi_item_nm", v_global.logic.kpi_item_nm);

    createForm({ kpi_item: v_global.logic.kpi_item, kpi_item_nm: v_global.logic.kpi_item_nm })
    
}
//----------
function createForm(param) {

    var data1;  // Day/Week/Month
    var data2;  // PROJ/SUPP/DEPT/TYPE
    var data3;  // Worst/Best/Check

    data1 = [{ title: "Day", value: "DAY" }, { title: "Week", value: "WEEK" }, { title: "Month", value: "MONTH" }];
    data3 = [{ title: "Worst", value: "WORST" }, { title: "Best", value: "BEST" }, { title: "Check", value: "CHECK" }];
    switch (param.kpi_item) {
        case "KPI023":  // 설계 부적합
            data2 = [{ title: "프로젝트", value: "PROJ" }, { title: "발생구분", value: "TYPE" }];
            break;
        case "KPI031":  // 납기 준수율
        case "KPI033":  // 발주리드타임
        case "KPI035":  // 수입검사불량
            data2 = [{ title: "프로젝트", value: "PROJ" }, { title: "협력사", value: "SUPP" }];
            break;
        case "KPI041":  // 출하설비 완성율
            data2 = [{ title: "프로젝트", value: "PROJ" }, { title: "검사단계", value: "TYPE" }, { title: "담당부서", value: "DEPT" }];
            break;
        case "KPI051":  // 협력업체 부적합
            data2 = [{ title: "프로젝트", value: "PROJ" }, { title: "협력사", value: "SUPP" }, { title: "1차원인", value: "TYPE" }];
            break;
        case "KPI053":  // SETUP 부적합
            data2 = [{ title: "프로젝트", value: "PROJ" }, { title: "1차원인", value: "TYPE" }];
            break;
        case "KPI091":  // VOC 처리율
            data2 = [{ title: "고객사", value: "CUST" }, { title: "담당자", value: "EMP" }];
            break;
        default:
            data2 = [{ title: "프로젝트", value: "PROJ" }];
            break;
    }

    if (v_global.logic.form) {
        v_global.logic.date_type = gw_com_api.getValue("frmOption2", 1, "date_type");
        v_global.logic.ymd_fr = gw_com_api.getValue("frmOption2", 1, "ymd_fr");
        v_global.logic.ymd_to = gw_com_api.getValue("frmOption2", 1, "ymd_to");
        v_global.logic.data_tp = gw_com_api.getValue("frmOption2", 1, "data_tp");
        v_global.logic.data_fg = gw_com_api.getValue("frmOption2", 1, "data_fg");
        v_global.logic.kpi_group = gw_com_api.getValue("frmOption2", 1, "kpi_group");
        v_global.logic.kpi_group_nm = gw_com_api.getValue("frmOption2", 1, "kpi_group_nm");
        v_global.logic.kpi_item = gw_com_api.getValue("frmOption2", 1, "kpi_item");
        v_global.logic.kpi_item_nm = gw_com_api.getValue("frmOption2", 1, "kpi_item_nm");
    }

    var args = {
        targetid: "frmOption2", type: "FREE", title: "조회 조건",
        trans: true, show: true, border: false, align: "left", //remark: "lyrRemark2",
        editable: { focus: "ymd_fr", validate: true },
        content: {
            row: [
                    {
                        element: [
                            { name: "kpi_group", hidden: true },
                            { name: "kpi_group_nm", hidden: true },
                            { name: "kpi_item", hidden: true },
                            { name: "kpi_item_nm", hidden: true },
                            {
                                name: "date_type", label: { title: "날짜구분 :" },
                                editable: { type: "select", data: data1 }, value: v_global.logic.date_type
                            }
                        ]
                    }
            ]
        }
    };
    //----------
    switch (v_global.logic.date_type) {
        case "WEEK":
            {
                args.content.row[0].element.push(
                    {
                        name: "ymd_fr", label: { title: "조회기간 :" }, style: { colfloat: "float" },
                        editable: {
                            type: "select", data: { memory: "DATA_YM3" }, validate: { rule: "required" }
                        }
                    }
                );
                args.content.row[0].element.push(
                    {
                        name: "ymd_to", label: { title: "~" }, style: { colfloat: "floated" },
                        editable: {
                            type: "select", data: { memory: "DATA_YM3" }, validate: { rule: "required" }
                        }
                    }
                );
            }
            break;
        case "MONTH":
            {
                args.content.row[0].element.push(
                    {
                        name: "ymd_fr", label: { title: "조회기간 :" }, style: { colfloat: "float" },
                        editable: { type: "select", data: { memory: "DATA_YM" }, validate: { rule: "required" } }
                    }
                );
                args.content.row[0].element.push(
                    {
                        name: "ymd_to", label: { title: "~" }, style: { colfloat: "float" },
                        editable: { type: "select", data: { memory: "DATA_YM" }, validate: { rule: "required" } }
                    }
                );
            }
            break;
        default:
            {
                args.content.row[0].element.push(
                    {
                        name: "ymd_fr", label: { title: "조회기간 :" }, mask: "date-ymd", style: { colfloat: "float" },
                        editable: { type: "text", size: 10, maxlength: 10, validate: { rule: "required" } }
                    }
                );
                args.content.row[0].element.push(
                    {
                        name: "ymd_to", label: { title: "~" }, mask: "date-ymd", style: { colfloat: "floated" },
                        editable: { type: "text", size: 10, maxlength: 10, validate: { rule: "required" } }
                    }
                );
            }
            break;
    }
    //----------
    args.content.row[0].element.push(
        {
            name: "data_tp", label: { title: "구분 :" }, style: { colfloat: "floating" },
            editable: { type: "select", data: data2 }, value: v_global.logic.data_tp
        }
    );
    args.content.row[0].element.push(
        {
            name: "data_fg", label: { title: "" },
            editable: { type: "select", data: data3 }, value: v_global.logic.data_fg
        }
    );
    //----------
    gw_com_module.formCreate(args);
    //=====================================================================================
    if (v_global.logic.form) {
        gw_com_api.setValue("frmOption2", 1, "ymd_fr", v_global.logic.ymd_fr);
        gw_com_api.setValue("frmOption2", 1, "ymd_to", v_global.logic.ymd_to);
        gw_com_api.setValue("frmOption2", 1, "kpi_group", v_global.logic.kpi_group);
        gw_com_api.setValue("frmOption2", 1, "kpi_group_nm", v_global.logic.kpi_group_nm);
        gw_com_api.setValue("frmOption2", 1, "kpi_item", v_global.logic.kpi_item);
        gw_com_api.setValue("frmOption2", 1, "kpi_item_nm", v_global.logic.kpi_item_nm);
    }
    //=====================================================================================
    //var args = { targetid: "frmOption2", element: "실행", event: "click", handler: click_frmOption2_실행 };
    //gw_com_module.eventBind(args);
    ////----------
    //var args = { targetid: "frmOption2", element: "취소", event: "click", handler: click_frmOption2_취소 };
    //gw_com_module.eventBind(args);
    //----------
    var args = { targetid: "frmOption2", event: "itemchanged", handler: processItemchanged };
    gw_com_module.eventBind(args);
    //=====================================================================================
    v_global.logic.form = true;
}
//----------
function createDW(param) {

    var kpi_item = gw_com_api.getValue("frmOption2", 1, "kpi_item");
    var data_tp = gw_com_api.getValue("frmOption2", 1, "data_tp");
    var header01 = gw_com_api.getText("frmOption2", 1, "data_tp");
    var args = {
        targetid: "grdList_1", query: "KPI_1111_4", title: "",
        caption: false, height: 300, pager: true, show: true, selectable: false,
        color: { row: true },
        element: [
            { header: "프로젝트", name: "category", width: 150 },
            { name: "inf01", hidden: true },
            { name: "color", hidden: true }
        ]
    };
    //----------
    switch (kpi_item) {
        case "KPI011":  // 사양 확정LT
            args.element = [
                { header: header01, name: "category", width: 150 },
				{ header: "리드타임", name: "val01", width: 40, align: "right", mask: "numeric-int" },
				{ header: "목표", name: "val05", width: 40, align: "right", mask: "numeric-float" },
				{ header: "달성율", name: "val06", width: 40, align: "right", mask: "numeric-float" },
                { name: "inf01", hidden: true },
                { name: "color", hidden: true },
                { name: "kpi_group", hidden: true },
                { name: "kpi_group_nm", hidden: true },
                { name: "kpi_item", hidden: true },
                { name: "kpi_item_nm", hidden: true },
                { name: "sub_cnt", hidden: true }
            ];
            break;
        case "KPI013":  // 사양확정 완성도
            args.element = [
                { header: header01, name: "category", width: 150 },
				{ header: "완성도", name: "val01", width: 40, align: "right", mask: "numeric-float" },
				{ header: "확정항목", name: "val02", width: 40, align: "right", mask: "numeric-int" },
				{ header: "체크항목", name: "val04", width: 40, align: "right", mask: "numeric-int" },
				{ header: "목표", name: "val05", width: 40, align: "right", mask: "numeric-float" },
				{ header: "달성율", name: "val06", width: 40, align: "right", mask: "numeric-float" },
                { name: "inf01", hidden: true },
                { name: "color", hidden: true },
                { name: "kpi_group", hidden: true },
                { name: "kpi_group_nm", hidden: true },
                { name: "kpi_item", hidden: true },
                { name: "kpi_item_nm", hidden: true },
                { name: "sub_cnt", hidden: true }
            ];
            break;
        case "KPI021":  // 설계 납기 준수율
        case "KPI031":  // 납기준수율
        case "KPI061":  // Set Up 납기 준수율
            args.element = [
                { header: header01, name: "category", width: 150 },
				{ header: "준수율", name: "val01", width: 40, align: "right", mask: "numeric-float" },
				{ header: "준수", name: "val02", width: 40, align: "right", mask: "numeric-int" },
				{ header: "미준수", name: "val03", width: 40, align: "right", mask: "numeric-int" },
				{ header: "총건수", name: "val04", width: 40, align: "right", mask: "numeric-int" },
				{ header: "목표", name: "val05", width: 40, align: "right", mask: "numeric-float" },
				{ header: "달성율", name: "val06", width: 40, align: "right", mask: "numeric-float" },
                { name: "inf01", hidden: true },
                { name: "color", hidden: true },
                { name: "kpi_group", hidden: true },
                { name: "kpi_group_nm", hidden: true },
                { name: "kpi_item", hidden: true },
                { name: "kpi_item_nm", hidden: true },
                { name: "sub_cnt", hidden: true }
            ];
            break;
        case "KPI023":  // 설계 부적합 건수
        case "KPI051":  // 협력업체 부적합 건수
        case "KPI053":  // Setup 부적합건수
            args.element = [
                { header: header01, name: "category", width: 150 },
				{ header: "발생건수", name: "val01", width: 40, align: "right", mask: "numeric-float" },
				{ header: "목표", name: "val05", width: 40, align: "right", mask: "numeric-float" },
				{ header: "달성율", name: "val06", width: 40, align: "right", mask: "numeric-float" },
                { name: "inf01", hidden: true },
                { name: "color", hidden: true },
                { name: "kpi_group", hidden: true },
                { name: "kpi_group_nm", hidden: true },
                { name: "kpi_item", hidden: true },
                { name: "kpi_item_nm", hidden: true },
                { name: "sub_cnt", hidden: true }
            ];
            break;
        case "KPI033":  // 발주리드타임
            args.element = [
                { header: header01, name: "category", width: 150 },
				{ header: "평균일수", name: "val01", width: 40, align: "right", mask: "numeric-int" },
				{ header: "총일수합", name: "val02", width: 40, align: "right", mask: "numeric-int" },
				{ header: "총건수", name: "val04", width: 40, align: "right", mask: "numeric-int" },
				{ header: "목표", name: "val05", width: 40, align: "right", mask: "numeric-float" },
				{ header: "달성율", name: "val06", width: 40, align: "right", mask: "numeric-float" },
                { name: "inf01", hidden: true },
                { name: "color", hidden: true },
                { name: "kpi_group", hidden: true },
                { name: "kpi_group_nm", hidden: true },
                { name: "kpi_item", hidden: true },
                { name: "kpi_item_nm", hidden: true },
                { name: "sub_cnt", hidden: true }
            ];
            break;
        case "KPI035":  // 수입검사 불량율
            args.element = [
                { header: header01, name: "category", width: 150 },
				{ header: "불량율", name: "val01", width: 40, align: "right", mask: "numeric-float" },
				{ header: "불량건수", name: "val02", width: 40, align: "right", mask: "numeric-int" },
				{ header: "합격건수", name: "val03", width: 40, align: "right", mask: "numeric-int" },
				{ header: "총건수", name: "val04", width: 40, align: "right", mask: "numeric-int" },
				{ header: "목표", name: "val05", width: 40, align: "right", mask: "numeric-float" },
				{ header: "달성율", name: "val06", width: 40, align: "right", mask: "numeric-float" },
                { name: "inf01", hidden: true },
                { name: "color", hidden: true },
                { name: "kpi_group", hidden: true },
                { name: "kpi_group_nm", hidden: true },
                { name: "kpi_item", hidden: true },
                { name: "kpi_item_nm", hidden: true },
                { name: "sub_cnt", hidden: true }
            ];
            break;
        case "KPI041":  // 출하설비 완성율
            if (data_tp == "PROJ") {
                args.element = [
                    { header: header01, name: "category", width: 150 },
                    { header: "완성율", name: "val01", width: 40, align: "right", mask: "numeric-float" },
                    { header: "AAT", name: "val02", width: 40, align: "right", mask: "numeric-int" },
                    { header: "PAT", name: "val03", width: 40, align: "right", mask: "numeric-int" },
                    { header: "FAT", name: "val04", width: 40, align: "right", mask: "numeric-int" },
                    { header: "BSFC/8계통", name: "val05", width: 40, align: "right", mask: "numeric-int" },
                    { header: "달성율", name: "val06", width: 40, align: "right", mask: "numeric-float" },
                    { name: "inf01", hidden: true },
                    { name: "color", hidden: true },
                    { name: "kpi_group", hidden: true },
                    { name: "kpi_group_nm", hidden: true },
                    { name: "kpi_item", hidden: true },
                    { name: "kpi_item_nm", hidden: true },
                    { name: "sub_cnt", hidden: true }
                ];
            } else {
                args.element = [
                    { header: header01, name: "category", width: 150 },
                    { header: "완성율", name: "val01", width: 40, align: "right", mask: "numeric-float" },
                    { header: "조치건수", name: "val02", width: 40, align: "right", mask: "numeric-int" },
                    { header: "미조치건수", name: "val03", width: 40, align: "right", mask: "numeric-int" },
                    { header: "총건수", name: "val04", width: 40, align: "right", mask: "numeric-int" },
                    { header: "목표", name: "val05", width: 40, align: "right", mask: "numeric-float" },
                    { header: "달성율", name: "val06", width: 40, align: "right", mask: "numeric-float" },
                    { name: "inf01", hidden: true },
                    { name: "color", hidden: true },
                    { name: "kpi_group", hidden: true },
                    { name: "kpi_group_nm", hidden: true },
                    { name: "kpi_item", hidden: true },
                    { name: "kpi_item_nm", hidden: true },
                    { name: "sub_cnt", hidden: true }
                ];
            }
            break;
        case "KPI063":  // 300SE 설비안정화
        case "KPI065":  // Memory Alarm 감소 활동
            args.element = [
                { header: header01, name: "category", width: 150 },
				{ header: "활동건수", name: "val01", width: 40, align: "right", mask: "numeric-int" },
				{ header: "목표", name: "val05", width: 40, align: "right", mask: "numeric-float" },
				{ header: "달성율", name: "val06", width: 40, align: "right", mask: "numeric-float" },
                { name: "inf01", hidden: true },
                { name: "color", hidden: true },
                { name: "kpi_group", hidden: true },
                { name: "kpi_group_nm", hidden: true },
                { name: "kpi_item", hidden: true },
                { name: "kpi_item_nm", hidden: true },
                { name: "sub_cnt", hidden: true }
            ];
            break;
        case "KPI091":  // VOC 처리율
            args.element = [
                { header: header01, name: "category", width: 150 },
				{ header: "처리율", name: "val01", width: 40, align: "right", mask: "numeric-float" },
				{ header: "처리건수", name: "val02", width: 40, align: "right", mask: "numeric-int" },
				{ header: "미조치", name: "val03", width: 40, align: "right", mask: "numeric-int" },
				{ header: "총건수", name: "val04", width: 40, align: "right", mask: "numeric-int" },
				{ header: "목표", name: "val05", width: 40, align: "right", mask: "numeric-float" },
				{ header: "달성율", name: "val06", width: 40, align: "right", mask: "numeric-float" },
                { name: "inf01", hidden: true },
                { name: "color", hidden: true },
                { name: "kpi_group", hidden: true },
                { name: "kpi_group_nm", hidden: true },
                { name: "kpi_item", hidden: true },
                { name: "kpi_item_nm", hidden: true },
                { name: "sub_cnt", hidden: true }
            ];
            break;
        default:
            args.element = [
                { header: "", name: "category", width: 150 },
				{ header: "", name: "val01", width: 40, align: "right", mask: "numeric-float" },
				{ header: "", name: "val02", width: 40, align: "right", mask: "numeric-int" },
				{ header: "", name: "val03", width: 40, align: "right", mask: "numeric-int" },
				{ header: "", name: "val04", width: 40, align: "right", mask: "numeric-int" },
				{ header: "", name: "val05", width: 40, align: "right", mask: "numeric-float" },
				{ header: "", name: "val06", width: 40, align: "right", mask: "numeric-float" },
                { name: "inf01", hidden: true },
                { name: "color", hidden: true },
                { name: "kpi_group", hidden: true },
                { name: "kpi_group_nm", hidden: true },
                { name: "kpi_item", hidden: true },
                { name: "kpi_item_nm", hidden: true },
                { name: "sub_cnt", hidden: true }
            ];
            break;
    }
    //----------
    gw_com_module.gridCreate(args);
    //=====================================================================================
    if (param.resize) {
        var args = {
            target: [
                { type: "GRID", id: "grdList_1", offset: 15 }
            ]
        };
        //----------
        gw_com_module.objResize(args);

    }
    //=====================================================================================
    var args = { targetid: "grdList_1", grid: true, event: "rowdblclick", handler: processLink };
    gw_com_module.eventBind(args);
    //=====================================================================================

}
//----------
function getDate() {

    var rtn = { ymd_fr: "", ymd_to: "" };
    switch (gw_com_api.getValue("frmOption2", 1, "date_type")) {
        case "WEEK":
            rtn = Query.getDateByWeek({ yw_fr: gw_com_api.getValue("frmOption2", 1, "ymd_fr"), yw_to: gw_com_api.getValue("frmOption2", 1, "ymd_to") });
            break;
        case "MONTH":
            rtn.ymd_fr = gw_com_api.getValue("frmOption2", 1, "ymd_fr") + "01";
            rtn.ymd_to = gw_com_api.getValue("frmOption2", 1, "ymd_to") + "31";
            break;
        default:
            rtn.ymd_fr = gw_com_api.getValue("frmOption2", 1, "ymd_fr");
            rtn.ymd_to = gw_com_api.getValue("frmOption2", 1, "ymd_to");
            break;
    }
    return rtn;

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
        var args = {
            request: "PAGE",
            url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
                    "?QRY_ID=KPI_1110_X" +
                    "&QRY_COLS=kpi_item,kpi_name,kpi_group,kpi_group_nm,val_unit,sort_seq" +
                    "&CRUD=R" +
                    "&arg_kpi_group=" + kpi_group + "&arg_kpi_item=" + kpi_item + "&arg_kpi_name=" + kpi_name + "&arg_ymd_fr=" + param.ymd_fr + "&arg_ymd_to=" + param.ymd_to,
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
    getDateByWeek: function (param) {
        var rtn = { ymd_fr: "", ymd_to: "" };
        var args = {
            request: "PAGE",
            url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
                    "?QRY_ID=KPI_1110_Z4" +
                    "&QRY_COLS=ymd_fr,ymd_to" +
                    "&CRUD=R" +
                    "&arg_yw_fr=" + param.yw_fr + "&arg_yw_to=" + param.yw_to,
            handler_success: successRequest
        };
        //=================== async : false ========================
        $.ajaxSetup({ async: false });
        //----------
        gw_com_module.callRequest(args);
        //----------
        function successRequest(data) {
            if (data && data.length > 0) {
                rtn.ymd_fr = data[0].DATA[0];
                rtn.ymd_to = data[0].DATA[1];
            }
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
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = {
                    to: { type: "POPUP", page: param.from.page },
                    ID: param.ID
                };
                switch (param.from.page) {
                    case "KPI_1112":
                        args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                        args.data = v_global.logic.search;
                        break;
                }
                gw_com_module.streamInterface(args);
            } break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                closeDialogue({ page: param.from.page });
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//