//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
    data: null, logic: {}
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define gw_job_process class : ready(), UI(), procedure()
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var gw_job_process = {


    // entry point. (pre-process section)
    ready: function () {

        // initialize page.
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        // set data for DDDW List
        var args = {
            request: [
                {
                    type: "INLINE", name: "날짜구분",
                    data: [
                        { title: "가입고일자", value: "IO" },
                        { title: "발주일자", value: "PO" },
                        { title: "납기요구일자", value: "POR" }
                    ]
                }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);

        //----------
        function start() {
            gw_job_process.UI();
            gw_job_process.procedure();
            gw_com_module.startPage();

            gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { day: -7 }));
            gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate());
        }
    },

    // manage UI. (design section)
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
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true, remark: "lyrRemark",
            editable: { focus: "ymd_fr", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "date_tp", style: { colfloat: "float" },
                                editable: { type: "select", data: { memory: "날짜구분" } }
                            },
                            {
                                name: "ymd_fr", mask: "date-ymd", style: { colfloat: "floating" },
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
                        element: [
                            {
                                name: "pur_no", label: { title: "발주번호 : " },
                                editable: { type: "text", size: 40 }
                            }
                        ]
                    },
                    {
                        element: [
                            { name: "실행", value: "실행", act: true, format: { type: "button" } },
                            { name: "취소", value: "취소", format: { type: "button", icon: "닫기" } }
                        ], align: "right"

                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_MAIN", query: "SRM_8110_1", title: "",
            caption: false, height: 442, pager: true, show: true, selectable: true, number: true, dynamic: true,
            //color: {
            //    row: true,
            //    //element: ["pur_no", "pur_seq", "dlved_qty"]
            //},
            element: [
				{ header: "발주번호", name: "pur_no", width: 80, align: "center" },
				{ header: "발주순번", name: "pur_seq", width: 50, align: "center", hidden: true },
                { header: "Project Name", name: "proj_nm", width: 130 },
                { header: "Project No.", name: "proj_no", width: 80, align: "center", hidden: true },
                { header: "발주담당자", name: "pur_emp_nm", width: 70, align: "center" },
                { header: "협력사", name: "supp_nm", width: 100 },
				{ header: "품목코드", name: "item_cd", width: 100, align: "center" },
				{ header: "품명", name: "item_nm", width: 200 },
				{ header: "발주수량", name: "pur_qty", width: 50, align: "right", mask: "numeric-int" },
                { header: "단위", name: "pur_unit", width: 50, align: "center" },
				{ header: "입고수량", name: "io_qty", width: 50, align: "right", mask: "numeric-int" },
                { header: "발주일", name: "pur_date", width: 80, align: "center", mask: "date-ymd" },
                { header: "납기요구일(A)", name: "por_date", width: 80, align: "center", mask: "date-ymd" },
                { header: "가입고일(B)", name: "io_date", width: 80, align: "center", mask: "date-ymd" },
                { header: "납기준수", name: "dlv_yn", width: 60, align: "center", format: { type: "checkbox", value: "1", offval: "0" } },
                { header: "납기미준수", name: "dlv_yn", width: 60, align: "center", format: { type: "checkbox", value: "0", offval: "1" } },
                { header: "차이(B-A)", name: "date_diff", width: 60, align: "right", mask: "numeric-int" },
                { header: "가입고처리일시", name: "io_ins_dt", width: 150, align: "center" },
                { header: "검수일", name: "chk_date", width: 80, align: "center", mask: "date-ymd" },
                { header: "검수처리일시", name: "chk_ins_dt", width: 150, align: "center" }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdList_MAIN", offset: 8 }
			]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        gw_com_module.informSize();

    },

    // manage process. (program section)
    procedure: function () {

        //=====================================================================================
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: viewOption };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: closeOption };
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

    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function viewOption(param) {

    //gw_com_api.show("frmOption");
    var args = { target: [{ id: "frmOption", focus: true }] };
    gw_com_module.objToggle(args);

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

}
//----------
function processButton(param) {

    closeOption({});
    switch (param.element) {
        case "실행":
            processRetrieve(param);
            break;
        case "닫기":
            processClose({});
            break;
    }

}
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
            //        gw_com_api.setValue(param.object, param.row, "item_cd", "", false, false, false);
            //    break;
            //case "item_cd":
            //    gw_com_api.setValue(param.object, param.row, "item_nm", "", false, false, false);
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

    var args = { target: [{ type: "FORM", id: "frmOption" }] };
    if (!gw_com_module.objValidate(args)) return;
    //if (gw_com_api.getValue("frmOption", 1, "pr_no") == "" &&
    //    gw_com_api.getValue("frmOption", 1, "pr_emp") == "" &&
    //    gw_com_api.getValue("frmOption", 1, "proj_no") == "") {
    //    gw_com_api.messageBox([
    //        { text: "조회 조건 중 한 가지는 반드시 입력하셔야 합니다." }
    //    ]);
    //    gw_com_api.setError(true, "frmOption", 1, "pr_no", false, true);
    //    gw_com_api.setError(true, "frmOption", 1, "pr_emp", false, true);
    //    gw_com_api.setError(true, "frmOption", 1, "proj_no", false, true);
    //    viewOption({});
    //    return false;
    //}
    //gw_com_api.setError(false, "frmOption", 1, "pr_no", false, true);
    //gw_com_api.setError(false, "frmOption", 1, "pr_emp", false, true);
    //gw_com_api.setError(false, "frmOption", 1, "proj_no", false, true);

    args = {
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
                { name: "date_tp", argument: "arg_date_tp" },
                { name: "ymd_fr", argument: "arg_ymd_fr" },
                { name: "ymd_to", argument: "arg_ymd_to" },
                { name: "proj_no", argument: "arg_proj_no" },
                { name: "supp_cd", argument: "arg_supp_cd" },
                { name: "pur_no", argument: "arg_pur_no" }
            ],
            remark: [
                { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }], label: gw_com_api.getText("frmOption", 1, "date_tp") + " :" },
		        { element: [{ name: "proj_nm" }] },
		        { element: [{ name: "supp_nm" }] },
		        { element: [{ name: "pur_no" }] }
            ]
        },
        target: [
            { type: "GRID", id: "grdList_MAIN", select: true }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {

}
//----------
function processClose(param) {

    var args = { ID: gw_com_api.v_Stream.msg_closePage };
    gw_com_module.streamInterface(args);

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
function processFile(param) {

    var args = {
        source: { id: param.object, row: param.row },
        targetid: "lyrDown"
    };
    gw_com_module.downloadFile(args);

}
//----------
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_showMessage:
            {
                gw_com_module.streamInterface(param);
            }
            break;
        case gw_com_api.v_Stream.msg_resultMessage:
            {
                if (param.data.page != gw_com_api.getPageID()) {
                    param.to = { type: "POPUP", page: param.data.page };
                    gw_com_module.streamInterface(param);
                    break;
                }
                switch (param.data.ID) {
                    case gw_com_api.v_Message.msg_confirmRemove:
                        { if (param.data.result == "YES") processRemove(param.data.arg); } break;
                    case gw_com_api.v_Message.msg_informSaved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param); 
                        } break;
                    case gw_com_api.v_Message.msg_informRemoved:
                        { param.data.arg.handler(param.data.arg.response, param.data.arg.param); } break;
                    case gw_com_api.v_Message.msg_informBatched:
                        { param.data.arg.handler(param.data.arg.response, param.data.arg.param); } break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = {
                    to: { type: "POPUP", page: param.from.page },
                    ID: param.ID
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
            } break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                switch (param.from.page) {
                    case "DLG_PR":
                        if (param.data != undefined) {
                            gw_com_module.objClear({ target: [{ type: "FORM", id: "frmOption" }] });
                            gw_com_api.setValue(v_global.event.object,
                                                v_global.event.row,
                                                "pr_no",
                                                param.data.pr_no,
                                                (v_global.event.type == "GRID") ? true : false);
                            gw_com_api.setValue(v_global.event.object,
                                                v_global.event.row,
                                                "ymd_fr",
                                                param.data.req_date,
                                                (v_global.event.type == "GRID") ? true : false);
                            gw_com_api.setValue(v_global.event.object,
                                                v_global.event.row,
                                                "ymd_to",
                                                param.data.req_date,
                                                (v_global.event.type == "GRID") ? true : false);
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
			                        (v_global.event.type == "GRID") ? true : false, false, false);
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