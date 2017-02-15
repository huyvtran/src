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

        // 협력사 여부
        v_global.logic.Supp = (gw_com_module.v_Session.USER_TP == "SUPP" ? true : false);

        // set data for DDDW List
        var args = {
            request: [
                {
                    type: "INLINE", name: "조회구분",
                    data: [
                        { title: "발주일자", value: "A" },
                        { title: "납기요구일", value: "B" }
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
            if (v_global.logic.Supp)
                gw_com_api.setValue("frmOption", 1, "supp_cd", gw_com_module.v_Session.EMP_NO);

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
            targetid: "lyrMenu",
            type: "FREE",
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
            trans: true, border: true, show: true,
            editable: { focus: "pur_no", validate: true },
            remark: "lyrRemark",
            content: {
                row: [
                    {
                        element: [
                            { name: "date_gb", editable: { type: "select", data: { memory: "조회구분" } } },
                            {
                                style: { colfloat: "floating" },
                                name: "ymd_fr", label: { title: "" }, mask: "date-ymd",
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
                                name: "pur_no", label: { title: "발주번호 :" },
                                editable: { type: "text", size: 10 }
                            },
                            {
                                name: "proj_no", label: { title: "Project No :" },
                                editable: { type: "text", size: 7, maxlength: 20 }, hidden: true
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "item_cd", label: { title: "품번 :" },
                                editable: { type: "text", size: 10 }
                            },
                            {
                                name: "item_nm", label: { title: "품목명 :" },
                                editable: { type: "text", size: 12 }
                            }
                        ]
                    },
                    {
                        align: "right",
                        element: [
                            {
                                name: "supp_nm", label: { title: "협력사 :" }, mask: "search",
                                hidden: v_global.logic.Supp,
                                editable: { type: "text", size: 14, validate: { rule: "required" } }
                            },
                            { name: "supp_cd", hidden: true, editable: { type: "hidden" } },
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
            targetid: "grdData_현황", query: "w_srm1042_1", title: "주문 대비 납품 현황",
            height: 442, show: true, selectable: true, dynamic: true, key: true,
            color: {
                row: true//,
                //element: ["in_yn"]
            },
            element: [
				{ header: "발주번호", name: "pur_no", width: 80, align: "center" },
				{ header: "순번", name: "pur_seq", width: 40, align: "center" },
                { header: "품번", name: "item_cd", width: 100, align: "center" },
                { header: "품목명", name: "item_nm", width: 200 },
                { header: "규격", name: "item_spec", width: 200 },
                { header: "Project Name", name: "proj_nm", width: 130 },
                //{ header: "Project No", name: "proj_no", width: 80, align: "center" },
				{ header: "발주수량", name: "pur_qty", width: 60, align: "right", mask: "numeric-int" },
                { header: "납품수량", name: "dlv_qty", width: 60, align: "right", mask: "numeric-int" },
                { header: "가입고수량", name: "io_qty", width: 60, align: "right", mask: "numeric-int", hidden: true },
                { header: "불합격수량", name: "chk_qty", width: 60, align: "right", mask: "numeric-int" },
				{ header: "미납수량", name: "not_qty", width: 60, align: "right", mask: "numeric-int" },
                { header: "발주일자", name: "pur_date", width: 80, align: "center", mask: "date-ymd" },
				{ header: "납기요구일", name: "por_date", width: 80, align: "center", mask: "date-ymd" },
				{ header: "납품일자", name: "dlv_date", width: 80, align: "center", mask: "date-ymd" },
				{ header: "입고일자", name: "io_date", width: 80, align: "center", mask: "date-ymd" },
				{ header: "납기준수", name: "pur_dlv_qty", width: 60, align: "right", mask: "numeric-int" },
				{ header: "지연납품", name: "delay_qty", width: 60, align: "right", mask: "numeric-int" },
				//{ header: "상태", name: "pstat", width: 60, align: "center" },
				//{ header: "입고", name: "in_yn", width: 60, align: "center" },
                //{ header: "Pallet No", name: "pallet", width: 80, align: "center" },
				//{ header: "단가", name: "pur_price", width: 80, align: "right", mask: "currency-int" },
				//{ header: "금액", name: "pur_amt", width: 80, align: "right", mask: "currency-int" },
				//{ header: "납품가능량", name: "plan_qty", width: 70, align: "center" },
                { name: "color", hidden: true }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
				{ type: "GRID", id: "grdData_현황", offset: 8 }
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

        //----------
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
        var args = { targetid: "frmOption", event: "itemdblclick", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemkeyenter", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_조회(ui) {

            var args = {
                target: [
					{
					    id: "frmOption",
					    focus: true
					}
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

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -1 }));
        gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate(""));
        //----------
        gw_com_module.startPage();
        //----------
        if (v_global.process.param != "") {
            gw_com_api.setValue("frmOption", 1, "pur_no", v_global.process.param);
            processRetrieve({});
        }

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
            type: "FORM", id: "frmOption", hide: true,
            element: [
				{ name: "date_gb", argument: "arg_date_gb" },
				{ name: "ymd_fr", argument: "arg_ymd_fr" },
				{ name: "ymd_to", argument: "arg_ymd_to" },
                { name: "pur_no", argument: "arg_pur_no" },
				{ name: "item_cd", argument: "arg_item_cd" },
				{ name: "item_nm", argument: "arg_item_nm" },
				{ name: "proj_no", argument: "arg_proj_no" },
				{ name: "supp_cd", argument: "arg_supp_cd" }
			],
            //argument: [
            //    {
            //        name: "arg_supp_cd",
            //        value: gw_com_module.v_Session.EMP_NO
            //    }
			//],
            remark: [
                { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }], label: gw_com_api.getText("frmOption", 1, "date_gb") + " :" },
                { element: [{ name: "pur_no" }] },
                { element: [{ name: "item_cd" }] },
                { element: [{ name: "item_nm"}] },
                { element: [{ name: "proj_no"}] }
		    ]
        },
        target: [
			{ type: "GRID", id: "grdData_현황", select: true, focus: true }
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
function processItemchanged(param) {

    if (param.object == "frmOption") {
        switch (param.element) {
            case "supp_nm":
                if (param.value.current == "")
                    gw_com_api.setValue(param.object, param.row, "supp_cd", "");
                break;
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
function closeDialogue(param) {

    var args = { page: param.page };
    gw_com_module.dialogueClose(args);
    if (param.focus) {
        gw_com_api.setFocus(v_global.event.object, v_global.event.row, v_global.event.element,
                            (v_global.event.type == "GRID") ? true : false);
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
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue: {
            var args = { to: { type: "POPUP", page: param.from.page } };
            switch (param.from.page) {
                case "DLG_SUPPLIER":
                    {
                        args.ID = gw_com_api.v_Stream.msg_selectSupplier;
                        args.data = v_global.logic.search;
                    }
                    break;
            }
            gw_com_module.streamInterface(args);
        } break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                closeDialogue({ page: param.from.page });
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
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//