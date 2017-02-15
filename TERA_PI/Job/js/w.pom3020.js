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
        v_global.process.param = gw_com_module.initPage({ message: true });
        //----------
        gw_com_api.changeTheme("style_theme");

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set data.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        var args = {
            request: [
                {
                    type: "INLINE", name: "진행상태",
                    data: [
                        { title: "발주", value: "O" },
                        { title: "완료", value: "E" },
                        { title: "중단", value: "C" }
                    ]
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
                { name: "발주서조회", value: "발주서조회", icon: "조회" },
                //{ name: "변경", value: "일괄변경", icon: "실행" },
                //{ name: "저장", value: "저장" },
				{ name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption_1", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true,
            editable: { focus: "pur_no", validate: true },
            remark: "lyrRemark",
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "pur_no", label: { title: "발주번호 :" },
                                editable: { type: "text", size: 10, maxlength: 20 }
                            },
                            {
                                style: { colfloat: "floating" }, name: "ymd_fr", label: { title: "발주일자 :" }, mask: "date-ymd",
                                editable: { type: "text", size: 7, maxlength: 10 }
                            },
				            {
				                name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
				                editable: { type: "text", size: 7, maxlength: 10 }
				            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "proj_nm", label: { title: "Project Name : " }, mask: "search",
                                editable: { type: "text", size: 12 }
                            },
                            {
                                name: "proj_no", label: { title: "Project No : " }, mask: "search",
                                editable: { type: "text", size: 10 }, hidden: true
                            },
                            {
                                name: "supp_nm", label: { title: "협력사 :" }, mask: "search",
                                editable: { type: "text", size: 12 }
                            },
                            { name: "supp_cd", hidden: true, editable: { type: "hidden" } }
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
            targetid: "frmOption_2", type: "FREE", title: "일괄 변경",
            trans: true, show: false, border: true,
            editable: { bind: "open", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "pur_no", label: { title: "발주번호 :" },
                                editable: { type: "text", size: 14, maxlength: 20, validate: { rule: "required", message: "발주번호" } }
                            },
                            {
                                name: "ymd", label: { title: "납기요구일 :" }, mask: "date-ymd",
                                editable: { type: "text", size: 7, maxlength: 10, validate: { rule: "required", message: "납기요구일" } }
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
        var args = {
            targetid: "grdData_현황", query: "w_pom3020_S_1", title: "발주서 전송 현황",
            height: 206, show: true, selectable: true, dynamic: true,
            //editable: { master: true, bind: "select", focus: "pstat", validate: true },
            element: [
                { header: "협력사", name: "supp_nm", width: 130 },
                { header: "발주번호", name: "pur_no", width: 80, align: "center" },
                { header: "Project Name", name: "proj_nm", width: 130 },
                { header: "Project No.", name: "projkey", width: 80, align: "center" },
   				{ header: "최종변경일시", name: "astat_dt", width: 150, align: "center", mask: "date-ymd" },
   				{ header: "정보전송일시", name: "send_dt", width: 150, align: "center", mask: "date-ymd" },
   				{ header: "공급사확인일시", name: "cust_dt", width: 150, align: "center", mask: "date-ymd" },
   				{ header: "출력일시", name: "print_dt", width: 150, align: "center", mask: "date-ymd" },
                {
                    header: "진행상태", name: "pstat", width: 60, align: "center",
                    format: { type: "select", data: { memory: "진행상태" } },
                    editable: { type: "select", data: { memory: "진행상태" } }
                },
   				{ name: "confirm", hidden: true },
   				{ name: "pur_type", hidden: true },
   				{ name: "pur_no", hidden: true, editable: { type: "hidden" } }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_발주", query: "w_pom3020_D_1", title: "발주 품목 내역",
            height: 160, pager: false, show: true, selectable: true, number: true,
            //editable: { master: true, bind: "select", focus: "req_date", validate: true },
            element: [
   				{ header: "Project Name", name: "proj_nm", width: 150 },
   				{ header: "Project No.", name: "proj_no", width: 80, align: "center" },
   				{ header: "품목코드", name: "item_cd", width: 80, align: "center" },
   				{ header: "품명", name: "item_nm", width: 200, align: "left" },
   				{ header: "규격", name: "item_spec", width: 200, align: "left" },
   				{ header: "단위", name: "pur_unit", width: 40, align: "center" },
   				{ header: "수량", name: "pur_qty", width: 50, align: "center", mask: "numeric-int" },
   				{ header: "최초요구일", name: "por_date", width: 80, align: "center", mask: "date-ymd" },
   				{
   				    header: "납기요구일", name: "req_date", width: 92, align: "center", mask: "date-ymd",
   				    editable: { type: "text", validate: { rule: "required", message: "납기요구일" } }
   				},
   				{ header: "최종변경일시", name: "astat_dt", width: 160, align: "center", hidden: true },
                {
                    header: "진행상태", name: "pstat", width: 60, align: "center",
                    format: { type: "select", data: { memory: "진행상태" } },
                    editable: { type: "select", data: { memory: "진행상태" } }
                },
   				{ name: "pur_seq", hidden: true, editable: { type: "hidden" } },
   				{ name: "pur_no", hidden: true, editable: { type: "hidden" } }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_가능", query: "w_pom3020_D_2", title: "납품 예정 내역",
            height: 160, pager: false, show: true, selectable: true, key: true,
            element: [
   				{ header: "Project Name", name: "proj_nm", width: 150 },
   				{ header: "Project No.", name: "proj_no", width: 80, align: "center" },
                { header: "납품예정일", name: "plan_date", width: 80, align: "center", mask: "date-ymd" },
				{ header: "품목코드", name: "item_cd", width: 80, align: "center" },
   				{ header: "품명", name: "item_nm", width: 200, align: "left" },
   				{ header: "규격", name: "item_spec", width: 200, align: "left" },
   				{ header: "단위", name: "pur_unit", width: 40, align: "center" },
   				{ header: "수량", name: "plan_qty", width: 50, align: "center", mask: "numeric-int" },
            	{ header: "구분", name: "astat", width: 60, align: "center" },
   				{ header: "비고", name: "rmk", width: 250, align: "left" }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
				{ type: "GRID", id: "grdData_현황", offset: 8 },
				{ type: "GRID", id: "grdData_발주", offset: 8 },
				{ type: "GRID", id: "grdData_가능", offset: 8 }
			]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        //var args = {
        //    tabid: "lyrTab_1", collapsible: true,
        //    target: [
		//		{ type: "LAYER", id: "lyrData_현황", title: "발주서 전송 현황" }
		//	]
        //};
        ////----------
        //gw_com_module.convertTab(args);
        //=====================================================================================
        var args = {
            tabid: "lyrTab_2",
            target: [
				{ type: "GRID", id: "grdData_발주", title: "발주 품목 내역" },
				{ type: "GRID", id: "grdData_가능", title: "납품 예정 내역" }
			]
        };
        //----------
        gw_com_module.convertTab(args);
        //=====================================================================================
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);
        //=====================================================================================
        var args = {
            target: [
				{ type: "GRID", id: "grdData_현황", offset: 8 },
				{ type: "GRID", id: "grdData_발주", offset: 8 },
				{ type: "GRID", id: "grdData_가능", offset: 8 },
				{ type: "TAB", id: "lyrTab_1", offset: 8 },
				{ type: "TAB", id: "lyrTab_2", offset: 8 }
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
        var args = { targetid: "lyrMenu", element: "발주서조회", event: "click", handler: click_lyrMenu_발주서조회 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "변경", event: "click", handler: click_lyrMenu_변경 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: click_lyrMenu_저장 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: click_lyrMenu_닫기 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption_1", element: "실행", event: "click", handler: click_frmOption_1_실행 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption_1", element: "취소", event: "click", handler: click_frmOption_취소 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption_1", event: "itemdblclick", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption_1", event: "itemkeyenter", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption_1", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption_2", element: "실행", event: "click", handler: click_frmOption_2_실행 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption_2", element: "취소", event: "click", handler: click_frmOption_취소 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrTab_1", event: "tabselect", handler: click_lyrTab_1_tabselect };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_현황", grid: true, event: "rowselecting", handler: rowselecting_grdData_현황 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_현황", grid: true, event: "rowselected", handler: rowselected_grdData_현황 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_현황", grid: true, event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_발주", grid: true, event: "rowselected", handler: rowselected_grdData_발주 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_발주", grid: true, event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_조회(ui) {

            gw_com_api.selectTab("lyrTab_1", 1);
            closeOption({ target: ["frmOption_2"] });
            var args = {
                target: [
					{
					    id: "frmOption_1",
					    focus: true
					}
				]
            };
            gw_com_module.objToggle(args);

        }
        //----------
        function click_lyrMenu_발주서조회(ui) {

            if (!checkManipulate({})) return;
            if (!checkPrintable({})) return;

            processExport();

        }
        //----------
        function click_lyrMenu_변경(ui) {

            if (!checkManipulate({})) return;

            var args = {
                target: [
					{
					    id: "frmOption_2",
					    focus: true
					}
				]
            };
            gw_com_module.objToggle(args);

        }
        //----------
        function click_lyrMenu_저장(ui) {

            if (!checkManipulate({})) return;

            processSave({});

        }
        //----------
        function click_lyrMenu_닫기(ui) {

            v_global.process.handler = processClose;

            if (!checkUpdatable({})) return;

            processClose({});

        }
        //----------
        function click_frmOption_1_실행(ui) {

            v_global.process.handler = processRetrieve;

            if (!checkUpdatable({})) return false;

            processRetrieve({});

        }
        //----------
        function click_frmOption_취소(ui) {

            closeOption({});

        }
        //----------
        function click_frmOption_2_실행(ui) {

            v_global.process.handler = processBatch;

            if (!checkUpdatable({})) return false;

            checkBatchable({});

        }
        //----------
        function click_lyrTab_1_tabselect(ui) {

            v_global.process.current.tab = ui.row;
            if (ui.row > 1) closeOption({});

        }
        //----------
        function rowselecting_grdData_현황(ui) {

            v_global.process.handler = processSelect;
            v_global.process.current.master = ui.row;

            return checkUpdatable({});

        }
        //----------
        function rowselected_grdData_현황(ui) {

            var args = {
                targetid: "grdData_현황",
                row: v_global.process.prev.master
            };
            gw_com_module.gridRestore(args);

            v_global.process.prev.master = ui.row;

            gw_com_api.setValue("frmOption_2", 1, "pur_no", gw_com_api.getValue("grdData_현황", ui.row, "pur_no", true));

            processLink(ui);

        };
        //----------
        function rowselected_grdData_발주(ui) {

            gw_com_api.setValue("frmOption_2", 1, "ymd", gw_com_api.getValue("grdData_발주", ui.row, "req_date", true));

        };

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_api.setValue("frmOption_1", 1, "ymd_fr", gw_com_api.getDate("", { month: -1 }));
        gw_com_api.setValue("frmOption_1", 1, "ymd_to", gw_com_api.getDate(""));
        //----------
        gw_com_module.startPage();
        //----------
        v_global.process.current.tab = 1;

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

    if (param.object == "frmOption_1") {
        switch (param.element) {
            case "proj_nm":
                if (param.value.current == "")
                    gw_com_api.setValue(param.object, param.row, "proj_no", "");
                break;
            case "supp_nm":
                if (param.value.current == "")
                    gw_com_api.setValue(param.object, param.row, "supp_cd", "");
                break;
            case "item_nm":
                if (param.value.current == "")
                    gw_com_api.setValue(param.object, param.row, "item_cd", "");
                break;
        }
    } else if (param.object == "grdData_현황") {
        if (param.element == "pstat") {
            if (param.value.current == "C" || param.value.current == "E") {
                gw_com_api.selectTab("lyrTab_2", 1);
                var ids = gw_com_api.getRowIDs("grdData_발주");
                $.each(ids, function () {
                    if (gw_com_api.getValue("grdData_발주", this, "pstat", true) == "O") {
                        gw_com_api.selectRow("grdData_발주", this, true, false);
                        gw_com_api.setValue("grdData_발주", this, "pstat", param.value.current, true);
                    }
                });
            }
        }
    }

}
//----------
function processItemdblclick(param) {

    v_global.event.type = param.type;
    v_global.event.object = param.object;
    v_global.event.row = param.row;
    v_global.event.element = param.element;
    var args;
    switch (param.element) {
        case "proj_nm":
        case "proj_no":
            v_global.event.cd = "proj_no";
            v_global.event.nm = "proj_nm";
            v_global.logic.search = {
                proj_no: (param.element == "proj_no" ? gw_com_api.getValue(param.object, param.row, param.element) : ""),
                proj_nm: (param.element == "proj_nm" ? gw_com_api.getValue(param.object, param.row, param.element) : "")
            };
            args = {
                type: "PAGE", page: "w_find_proj_scm", title: "Project 검색",
                width: 650, height: 460, open: true,
                id: gw_com_api.v_Stream.msg_selectProject_SCM
            };
            break;
        case "supp_cd":
        case "supp_nm":
            v_global.event.cd = "supp_cd";
            v_global.event.nm = "supp_nm";
            v_global.logic.search = {
                supp_cd: (param.element == "supp_cd" ? gw_com_api.getValue(param.object, param.row, param.element) : ""),
                supp_nm: (param.element == "supp_nm" ? gw_com_api.getValue(param.object, param.row, param.element) : "")
            };
            args = {
                type: "PAGE", page: "DLG_SUPPLIER", title: "협력사 선택",
                width: 600, height: 450, open: true,
                id: gw_com_api.v_Stream.msg_selectSupplier
            };
            break;
        case "item_cd":
        case "item_nm":
            v_global.event.cd = "item_cd";
            v_global.event.nm = "item_nm";
            v_global.logic.search = {
                part_cd: (param.element == "item_cd" ? gw_com_api.getValue(param.object, param.row, param.element) : ""),
                part_nm: (param.element == "item_nm" ? gw_com_api.getValue(param.object, param.row, param.element) : ""),
                part_spec: ""
            };
            args = {
                type: "PAGE", page: "w_find_part_erp", title: "부품 검색",
                width: 900, height: 450, open: true,
                id: gw_com_api.v_Stream.msg_selectPart_SCM
            };
            break;
        default: return;
    }

    if (gw_com_module.dialoguePrepare(args) == false) {
        args = {
            page: args.page,
            param: {
                ID: args.id,
                data: v_global.logic.search
            }
        };
        gw_com_module.dialogueOpen(args);
    }

}
//----------
function checkManipulate(param) {

    closeOption({});

    if (gw_com_api.getSelectedRow("grdData_현황") == null) {
        gw_com_api.messageBox([
            { text: "NOMASTER" }
        ]);
        return false;
    }
    return true;

}
//----------
function checkPrintable(param) {

    closeOption({});

    /*
    if (gw_com_api.getValue("grdData_현황", "selected", "confirm", true) == "미확인") {
    gw_com_api.messageBox([
    { text: "미확인 데이터는 발주서를 조회할 수 없습니다." }
    ]);
    return false;
    }
    */
    return true;

}
//----------
function checkUpdatable(param) {

    closeOption({});

    var args = {
        target: [
            { type: "GRID", id: "grdData_현황" },
			{ type: "GRID", id: "grdData_발주" }
		]
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function checkBatchable(param) {

    closeOption({});

    var args = {
        target: [
	        {
	            type: "FORM",
	            id: "frmOption_2"
	        }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    var ymd = gw_com_api.getValue("frmOption_2", 1, "ymd");
    if (ymd.length < 8) {
        gw_com_api.show("frmOption_2");
        gw_com_api.messageBox([
            { text: "유효한 날짜가 아닙니다." }
        ], 300);
        gw_com_api.setError(true, "frmOption_2", 1, "ymd", false, true);
        return false;
    }
    gw_com_api.setError(false, "frmOption_2", 1, "ymd", false, true);

    gw_com_api.messageBox([
            { text: "◈ 발주번호 : " + gw_com_api.getValue("frmOption_2", 1, "pur_no") + "<br>", align: "left", margin: 30 },
            { text: "◈ 납기요구일 : " + gw_com_api.Mask(ymd, "date-ymd"), align: "left", margin: 30 },
            { text: "일괄 변경 하시겠습니까?" }
    ], 320, gw_com_api.v_Message.msg_confirmBatch, "YESNO");

}
//----------
function processRetrieve(param) {

    var args = {
        target: [
	        { type: "FORM", id: "frmOption_1" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) {
        processClear({ master: true });
        return false;
    }

    var args = {
        source: {
            type: "FORM", id: "frmOption_1", hide: true,
            element: [
				{ name: "prod_group", argument: "arg_prod_group" },
                { name: "pur_no", argument: "arg_pur_no" },
				{ name: "proj_no", argument: "arg_projkey" },
				{ name: "ymd_fr", argument: "arg_ymd_fr" },
				{ name: "ymd_to", argument: "arg_ymd_to" },
				{ name: "supp_cd", argument: "arg_supp_cd" }
			],
            remark: [
                { element: [{ name: "pur_no" }] },
	            { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }] },
		        { element: [{ name: "proj_nm" }] },
                { element: [{ name: "supp_nm" }] }
            ]
        },
        target: [
			{ type: "GRID", id: "grdData_현황", select: true }
		],
        clear: [
			{ type: "GRID", id: "grdData_발주" },
			{ type: "GRID", id: "grdData_가능" }
		],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {

    var args = {
        source: {
            type: param.type, id: param.object, row: param.row, block: true,
            element: [
				{ name: "pur_no", argument: "arg_pur_no" }
            ],
            argument: [
                { name: "arg_pur_seq", value: 0 }
            ]
        },
        target: [
			{ type: "GRID", id: "grdData_발주" },
	        { type: "GRID", id: "grdData_가능" }
		],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processSelect(param) {

    gw_com_api.selectRow("grdData_현황", v_global.process.current.master, true, false);

}
//----------
function processSave(option) {

    var args = {
        target: [
			{ type: "GRID", id: "grdData_현황" },
            { type: "GRID", id: "grdData_발주" }
		]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args.url = "COM";
    args.handler = {
        success: successSave
    };
    gw_com_module.objSave(args);

}
//----------
function processExport() {

    var type = gw_com_api.getValue("grdData_현황", "selected", "pur_type", true);
    var args = {
        page: "w_srm1030",
        query: (type == "외자") ? "w_srm1030_3" : "w_srm1030_2",
        source: {
            type: "GRID",
            id: "grdData_현황",
            row: "selected",
            json: true,
            element: [
                { name: "pur_no", argument: "argPur_no" }
            ]
        },
        option: [
            { name: "PRINT", value: "PDF" },
            { name: "PAGE", value: "w_srm1030" },
            { name: "KEY", value: gw_com_api.getValue("grdData_현황", "selected", "pur_no", true) },
            { name: "SAVE", value: 0 }
        ],
        //target: {
        //    type: "TAB",
        //    id: "lyrTab_1",
        //    name: "발주서",
        //    index: gw_com_api.getValue("grdData_현황", "selected", "pur_no", true)
        //},
        target: { type: "FILE", id: "lyrDown", name: "발주서" },
        handler: {
            success: successExport
        }
    };
    gw_com_module.objExport(args);

}
//----------
function processBatch(param) {

    alert(gw_com_api.getValue("frmOption_2", 1, "pur_no"));
    var args = {
        url: "COM",
        procedure: "sp_scmAutoRequest",
        nomessage: true,
        input: [
            { name: "asUserId", value: gw_com_module.v_Session.USR_ID, type: "varchar" },
            { name: "asPurNo", value: gw_com_api.getValue("frmOption_2", 1, "pur_no"), type: "varchar" },
            { name: "asDate", value: gw_com_api.getValue("frmOption_2", 1, "ymd"), type: "varchar" }
        ],
        output: [
            { name: "r_value", type: "int" },
            { name: "message", type: "varchar" }
        ],
        handler: {
            success: successBatch
        }
    };
    gw_com_module.callProcedure(args);

}
//----------
function processClear(param) {

    var args = {
        target: [
            {
                type: "GRID",
                id: "grdData_발주"
            },
	        {
	            type: "GRID",
	            id: "grdData_가능"
	        }
        ]
    };
    if (param.master)
        args.target.unshift({
            type: "GRID",
            id: "grdData_현황"
        });
    gw_com_module.objClear(args);

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

    if (param.target != undefined) {
        $.each(param.target, function () {
            gw_com_api.hide(this);
        });
    }
    else {
        gw_com_api.hide("frmOption_1");
        gw_com_api.hide("frmOption_2");
    }

}
//----------
function closeDialogue(param) {

    var args = {
        page: param.page
    };
    gw_com_module.dialogueClose(args);
    if (param.focus) {
        gw_com_api.setFocus(v_global.event.object,
	                        v_global.event.row,
	                        v_global.event.element,
	                        (v_global.event.type == "GRID") ? true : false);
    }

}
//----------
function successSave(response, param) {

    processRetrieve({ key: response });
    //processLink({ key: response, object: "grdData_현황", type: "GRID", row: gw_com_api.getSelectedRow("grdData_현황") });

}
//----------
function successExport(response, param) {
}
//----------
function successBatch(response) {

    gw_com_api.messageBox([
        { text: response.VALUE[1] }
    ], 350);

    if (response.VALUE[0] != -1) {
        processLink({ object: "grdData_현황", type: "GRID", row: gw_com_api.getSelectedRow("grdData_현황") });
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
        case gw_com_api.v_Stream.msg_resultMessage:
            {
                if (param.data.page != gw_com_api.getPageID())
                    break;
                switch (param.data.ID) {
                    case gw_com_api.v_Message.msg_confirmSave:
                        {
                            if (param.data.result == "YES")
                                processSave({});
                            else {
                                if (v_global.process.handler != null)
                                    v_global.process.handler({});
                            }
                        }
                        break;
                    case gw_com_api.v_Message.msg_confirmBatch:
                        {
                            if (param.data.result == "YES")
                                processBatch({});
                        }
                        break;
                    case gw_com_api.v_Message.msg_informSaved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                    case gw_com_api.v_Message.msg_informBatched:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                }
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
                    case "w_find_proj_scm":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectProject_SCM;
                            args.data = v_global.logic.search;
                        }
                        break;
                    case "DLG_SUPPLIER":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectSupplier;
                            args.data = v_global.logic.search;
                        }
                        break;
                    case "w_find_part_erp":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectPart_SCM;
                            args.data = v_global.logic.search;
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
        case gw_com_api.v_Stream.msg_selectedProject_SCM:
            {
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        v_global.event.cd,
			                        param.data.proj_no,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        v_global.event.nm,
			                        param.data.proj_nm,
			                        (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedSupplier:
            {
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        v_global.event.cd,
			                        param.data.supp_cd,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        v_global.event.nm,
			                        param.data.supp_nm,
			                        (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedPart_SCM:
            {
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        v_global.event.cd,
			                        param.data.part_cd,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        v_global.event.nm,
			                        param.data.part_nm,
			                        (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//