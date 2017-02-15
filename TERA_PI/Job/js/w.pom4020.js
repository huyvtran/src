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

        //----------
        /*
        var args = {
            request: [
				{
				    type: "PAGE", name: "사업부", query: "dddw_prodgroup"
				},
                {
                    type: "INLINE", name: "입고",
                    data: [
                        { title: "전체", value: "%" },
						{ title: "미입고", value: "0" },
						{ title: "입고완료", value: "1" }
					]
                }
			],
            starter: start
        };
        gw_com_module.selectSet(args);
        */
        start();

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
            trans: true, border: true, show: true,
            editable: { focus: "fr_ymd", validate: true },
            remark: "lyrRemark",
            content: {
                row: [
                    {
                        element: [
				            {
				                style: { colfloat: "floating" }, name: "fr_ymd", label: { title: "발주일자 :" }, mask: "date-ymd",
				                editable: { type: "text", size: 7, maxlength: 10 }
				            },
				            {
				                name: "to_ymd", label: { title: "~" }, mask: "date-ymd",
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
                                name: "supp_nm", label: { title: "거래처 :" }, mask: "search",
                                editable: { type: "text", size: 12 }
                            },
                            { name: "supp_cd", hidden: true, editable: { type: "hidden" } }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "item_nm", label: { title: "품목명 :" },// mask: "search",
                                editable: { type: "text", size: 15 }
                            },
                            {
                                name: "item_cd", label: { title: "품목코드 : " },
                                editable: { type: "text", size: 12 }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "pur_no", label: { title: "발주번호 : " },
                                editable: { type: "text", size: 12, maxlength: 20 }
                            },
                            {
                                name: "pr_no", label: { title: "구매요청번호 : " },
                                editable: { type: "text", size: 12 }, mask: "search"
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
            targetid: "grdData_현황", query: "w_pom4020_M_1", title: "발주 진행 현황",
            caption: true, height: 256, show: true, selectable: true, number: true, dynamic: true,
            color: {
                row: true,
                //element: ["pur_no", "pur_seq", "dlved_qty"]
            },
            element: [
                { header: "Project Name", name: "proj_nm", width: 130 },
                { header: "Project No.", name: "proj_no", width: 80, align: "center" },
				{ header: "발주번호", name: "pur_no", width: 80, align: "center" },
				{ header: "발주담당자", name: "pur_emp_nm", width: 50, align: "center" },
				{ header: "발주순번", name: "pur_seq", width: 50, align: "center" },
				{ header: "거래처", name: "supp_nm", width: 150 },
				{ header: "품목코드", name: "item_cd", width: 100, align: "center" },
				{ header: "품명", name: "item_nm", width: 200 },
                { header: "구매요청번호", name: "pr_no", width: 80, align: "center" },
				{ header: "요청수량", name: "pr_qty", width: 60, align: "right", mask: "numeric-int" },
				{ header: "발주수량", name: "pur_qty", width: 60, align: "right", mask: "numeric-int" },
				{ header: "업체확인", name: "plan_qty", width: 60, align: "right", mask: "numeric-int" },
				{ header: "납품예정", name: "dlv_qty", width: 60, align: "right", mask: "numeric-int" },
				{ header: "가입고", name: "in_qty", width: 60, align: "right", mask: "numeric-int" },
                { header: "검수구분", name: "qc_yn_nm", width: 50, align: "center" },
				{ header: "검수(합격)", name: "qcok_qty", width: 60, align: "right", mask: "numeric-int" },
				{ header: "검수(불합격)", name: "qcrj_qty", width: 60, align: "right", mask: "numeric-int" },
				{ header: "미검수", name: "qcno_qty", width: 60, align: "right", mask: "numeric-int" },
				{ header: "구매요청일", name: "pr_date", width: 80, align: "center", mask: "date-ymd" },
				{ header: "납기요청일", name: "pr_dlv_date", width: 80, align: "center", mask: "date-ymd" },
				{ header: "구매요청승인일", name: "pr_cfm_date", width: 80, align: "center", mask: "date-ymd" },
				{ header: "구매발주승인일", name: "pur_date", width: 80, align: "center", mask: "date-ymd" },
				{ header: "납기요구일", name: "pur_dlv_date", width: 80, align: "center", mask: "date-ymd" },
				{ header: "납기예정일", name: "plan_date", width: 80, align: "center", mask: "date-ymd" },
				{ header: "입고예정일", name: "dlv_date", width: 80, align: "center", mask: "date-ymd" },
				{ header: "검수일", name: "qc_date", width: 80, align: "center", mask: "date-ymd" },
				{ header: "가입고일", name: "in_date", width: 80, align: "center", mask: "date-ymd" },
				{ header: "납기준수", name: "purok_qty", width: 60, align: "right", mask: "numeric-int" },
				{ header: "지연입고", name: "purrj_qty", width: 60, align: "right", mask: "numeric-int" },
				{ header: "진행상태", name: "pstat_nm", width: 60, align: "center" },
                {
                    name: "color",
                    hidden: true
                }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        //var args = {
        //    targetid: "grdData_이력", query: "w_pom4020_S_1", title: "납품 예정 이력",
        //    caption: true, height: 86, pager: false, number: true, show: true, selectable: true, dynamic: true,
        //    element: [
        //        { header: "납품요청일", name: "req_date", width: 80, align: "center", mask: "date-ymd" },
		//		{ header: "납품예정일", name: "plan_date", width: 80, align: "center", mask: "date-ymd" },
        //        { header: "단위", name: "pur_unit", width: 70, align: "center" },
		//		{ header: "수량", name: "plan_qty", width: 70, align: "center" }
		//	]
        //};
        var args = {
            targetid: "grdData_이력", query: "w_pom3020_D_2", title: "납품 예정 내역",
            height: 96, caption: true, pager: false, show: true, selectable: true, key: true,
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
        //var args = {
        //    targetid: "lyrNotice",
        //    row: [
 		//		{ name: "주석", color: "#800000" }
		//	]
        //};
        ////----------
        //gw_com_module.labelCreate(args);
        //var args = {
        //    targetid: "lyrNotice",
        //    row: [
		//        {
		//            name: "주석",
		//            value:
        //                "▶ [납품예정]/[납품요청]/[입고수량] : '등록 수량 (입고 수량)' 으로 표시 / 검은 색 - '미입고' , 푸른 색 - '납품 예정일 지연' , 붉은 색 - '입고일 지연' 을 의미"
		//        }
	    //    ]
        //};
        //gw_com_module.labelAssign(args);
        //=====================================================================================
        var args = {
            target: [
				{ type: "GRID", id: "grdData_현황", offset: 8 },
				{ type: "GRID", id: "grdData_이력", offset: 8 }
			]
        };
        //----------
        gw_com_module.objResize(args);
        //====================================================================================
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

        //=====================================================================================
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: click_lyrMenu_조회 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: click_lyrMenu_닫기 };
        gw_com_module.eventBind(args);
        //=====================================================================================
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
        //=====================================================================================
        var args = { targetid: "grdData_현황", grid: true, event: "rowselected", handler: rowselected_grdData_현황 };
        gw_com_module.eventBind(args);
        //=====================================================================================

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_조회() {

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
        //----------
        function rowselected_grdData_현황(ui) {

            processLink({});

        };

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        if (v_global.process.param != "") {
            gw_com_api.setValue("frmOption", 1, "fr_ymd", gw_com_api.getPageParameter("pur_date"));
            gw_com_api.setValue("frmOption", 1, "to_ymd", gw_com_api.getPageParameter("pur_date"));
            gw_com_api.setValue("frmOption", 1, "pur_no", gw_com_api.getPageParameter("pur_no"));
            gw_com_api.setValue("frmOption", 1, "prod_group", gw_com_api.getPageParameter("prod_group"));
            //gw_com_api.setValue("frmOption", 1, "supp_nm", gw_com_api.getPageParameter("supp_nm"));
        }
        else {
            gw_com_api.setValue("frmOption", 1, "fr_ymd", gw_com_api.getDate("", { day: -7 }));
            gw_com_api.setValue("frmOption", 1, "to_ymd", gw_com_api.getDate(""));
        }
        //----------
        gw_com_module.startPage();
        //----------
        if (v_global.process.param != "")
            processRetrieve({});

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
        switch (param.element) {
            case "proj_nm":
                if (param.value.current == "")
                    gw_com_api.setValue(param.object, param.row, "proj_no", "");
                break;
            case "supp_nm":
                if (param.value.current == "")
                    gw_com_api.setValue(param.object, param.row, "supp_cd", "");
                break;
            //case "item_nm":
            //    if (param.value.current == "")
            //        gw_com_api.setValue(param.object, param.row, "item_cd", "");
            //    break;
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
        case "pr_no":
            v_global.event.cd = "pr_no";
            v_global.event.nm = "";
            args = {
                type: "PAGE", page: "DLG_PR", title: "구매요청 검색",
                width: 950, height: 460, open: true,
                id: gw_com_api.v_Stream.msg_openDialogue
            };
            break;
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
        //case "item_cd":
        //case "item_nm":
        //    v_global.event.cd = "item_cd";
        //    v_global.event.nm = "item_nm";
        //    v_global.logic.search = {
        //        part_cd: (param.element == "item_cd" ? gw_com_api.getValue(param.object, param.row, param.element) : ""),
        //        part_nm: (param.element == "item_nm" ? gw_com_api.getValue(param.object, param.row, param.element) : ""),
        //        part_spec: ""
        //    };
        //    args = {
        //        type: "PAGE", page: "w_find_part_erp", title: "부품 검색",
        //        width: 900, height: 450, open: true,
        //        id: gw_com_api.v_Stream.msg_selectPart_SCM
        //    };
        //    break;
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
                { name: "pur_no", argument: "arg_pur_no" },
				{ name: "proj_no", argument: "arg_proj_no" },
                { name: "fr_ymd", argument: "arg_fr_ymd" },
				{ name: "to_ymd", argument: "arg_to_ymd" },
				{ name: "item_cd", argument: "arg_item_cd" },
				{ name: "item_nm", argument: "arg_item_nm" },
				{ name: "prod_group", argument: "arg_prod_group" },
				{ name: "supp_nm", argument: "arg_supp_nm" },
				{ name: "rcvd", argument: "arg_rcvd" },
				{ name: "pr_no", argument: "arg_pr_no" }
			],
            remark: [
			    { infix: "~", element: [{ name: "fr_ymd" }, { name: "to_ymd" }] },
		        { element: [{ name: "proj_nm" }] },
		        { element: [{ name: "item_nm" }] },
		        { element: [{ name: "item_cd" }] },
		        { element: [{ name: "supp_nm" }] },
                { element: [{ name: "pur_no" }] },
		        { element: [{ name: "pr_no" }] }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_현황", select: true }
        ],
        clear: [
			{ type: "GRID", id: "grdData_이력" }
		],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {

    var args = {
        source: {
            type: "GRID", id: "grdData_현황", row: "selected", block: true,
            element: [
				{ name: "pur_no", argument: "arg_pur_no" },
                { name: "pur_seq", argument: "arg_pur_seq" }
			]
        },
        target: [
	        { type: "GRID", id: "grdData_이력" }
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
                    case "DLG_PR":
                        {
                            args.ID = gw_com_api.v_Stream.msg_openDialogue;
                            args.data = v_global.logic.search;
                        }
                        break;
                }
                gw_com_module.streamInterface(args);
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                switch (param.from.page) {
                    case "DLG_PR":
                        if (param.data != undefined) {
                            //gw_com_module.objClear({ target: [{ type: "FORM", id: "frmOption" }] });
                            gw_com_api.setValue(v_global.event.object,
                                                v_global.event.row,
                                                "pr_no",
                                                param.data.pr_no,
                                                (v_global.event.type == "GRID") ? true : false);
                            //gw_com_api.setValue(v_global.event.object,
                            //                    v_global.event.row,
                            //                    "ymd_fr",
                            //                    param.data.req_date,
                            //                    (v_global.event.type == "GRID") ? true : false);
                            //gw_com_api.setValue(v_global.event.object,
                            //                    v_global.event.row,
                            //                    "ymd_to",
                            //                    param.data.req_date,
                            //                    (v_global.event.type == "GRID") ? true : false);
                        }
                        break;
                }
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