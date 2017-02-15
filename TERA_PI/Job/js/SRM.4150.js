//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 입고금액조회
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

        // 협력사 여부
        v_global.logic.Supp = (gw_com_module.v_Session.USER_TP == "SUPP" ? true : false);

        if (v_global.logic.Supp) {
            v_global.logic.SuppCd = gw_com_module.v_Session.EMP_NO;
            v_global.logic.SuppNm = gw_com_module.v_Session.USR_NM;
        }
        else {
            v_global.logic.SuppCd = "";
            v_global.logic.SuppNm = "";
        }

        // set data for DDDW List
        var args = {
            request: [
                {
                    type: "INLINE", name: "조회구분",
                    data: [
                        { title: "가입고일자", value: "A" },
                        { title: "정산일자", value: "B" }
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

            gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { day: v_global.logic.Supp ? -30 : -5 }));
            gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate("", { day: 1 }));

            if (v_global.logic.Supp)
                gw_com_api.setValue("frmOption", 1, "supp_cd", gw_com_module.v_Session.EMP_NO);

        }
    },

    // manage UI. (design section)
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
            trans: true, border: true, show: true, remark: "lyrRemark2",
            editable: { focus: "ymd_fr", validate: true },
            content: {
                row: [
                        {
                            element: [
                                { name: "date_gb", editable: { type: "select", data: { memory: "조회구분" } } },
                                {
                                    name: "ymd_fr", label: { title: "" }, mask: "date-ymd",
                                    style: { colfloat: "floating" },
                                    editable: { type: "text", size: 7, maxlength: 10, validate: { rule: "required" } }
                                },
                                {
                                    name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
                                    editable: { type: "text", size: 7, maxlength: 10, validate: { rule: "required" } }
                                },
                                {
                                    name: "supp_nm", label: { title: "협력사 :" }, mask: "search",
                                    hidden: v_global.logic.Supp,
                                    editable: { type: "text", size: 14, maxlength: 20, validate: { rule: "required" } }
                                },
                                { name: "supp_cd", hidden: true, editable: { type: "hidden" } }
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
            targetid: "grdList_MAIN", query: "SRM_4150_1", title: "상세",
            height: 420, show: true, selectable: true, number: true, dynamic: true,
            element: [
				{ header: "가입고일", name: "io_date", width: 70, align: "center", mask: "date-ymd" },
				{ header: "검수일", name: "chk_date", width: 70, align: "center", mask: "date-ymd" },
                { header: "선입고", name: "direct_yn", width: 40, align: "center", format: { type: "checkbox", value: "1", offval: "0", title: "" } },
                { header: "발주번호", name: "pur_no", width: 80, align: "center" },
				{ header: "품번", name: "item_cd", width: 100, align: "center" },
				{ header: "품명", name: "item_nm", width: 150 },
				{ header: "규격", name: "item_spec", width: 150 },
				{ header: "Project Name", name: "proj_nm", width: 150 },
				{ header: "가입고", name: "io_qty", width: 60, align: "right", mask: "numeric-int" },
				{ header: "불합격", name: "chk_qty", width: 60, align: "right", mask: "numeric-int" },
				{ header: "단가", name: "pur_price", width: 70, align: "right", mask: "numeric-int" },
				{ header: "금액", name: "io_amt", width: 70, align: "right", mask: "numeric-int" },
				{ header: "정산일", name: "adj_date", width: 70, align: "center", mask: "date-ymd" },
				{ header: "정산금액", name: "adj_amt", width: 70, align: "right", mask: "numeric-int" },
				{ name: "io_no", hidden: true },
                { name: "io_seq", hidden: true },
                { name: "pur_seq", hidden: true },
                { name: "proj_no", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_SUM", query: "SRM_4150_2", type: "TABLE", title: "합계",
            caption: false, show: true, selectable: true,
            content: {
                width: { label: 100, field: 100 }, height: 25,
                row: [
                    {
                        element: [
                          { header: true, value: "가입고수량", format: { type: "label" } },
                          { name: "io_qty", mask: "numeric-int" },
                          { header: true, value: "불합격수량", format: { type: "label" } },
                          { name: "chk_qty", mask: "numeric-int" },
                          { header: true, value: "가입고금액", format: { type: "label" } },
                          { name: "io_amt", mask: "numeric-int" },
                          { header: true, value: "불합격금액", format: { type: "label" } },
                          { name: "chk_amt", mask: "numeric-int" },
                          { header: true, value: "정산금액", format: { type: "label" } },
                          { name: "adj_amt", mask: "numeric-int" }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        //----------
        gw_com_module.pageCreate(args);
        //=====================================================================================
        var args = {
            target: [
				{ type: "GRID", id: "grdList_MAIN", offset: 8 },
                { type: "FORM", id: "frmData_SUM", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        gw_com_module.informSize();

    },

    //==== manage process. (program section)
    procedure: function () {

        //=====================================================================================
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemdblclick", handler: processSearch };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemkeyenter", handler: processSearch };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        //var args = { targetid: "grdList_MAIN", grid: true, event: "rowselected", handler: processRetrieve };
        //gw_com_module.eventBind(args);
        //=====================================================================================

    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function processButton(param) {

    switch (param.element) {
        case "조회":
            gw_com_api.show("frmOption");
            break;
        case "닫기":
            processClose(param);
            break;
        case "실행":
            processRetrieve(param);
            break;
        case "취소":
            gw_com_api.hide("frmOption");
            break;
    }

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
function processRetrieve(param) {

    var args = { target: [{ type: "FORM", id: "frmOption" }] };
    if (gw_com_module.objValidate(args) == false) return false;
    args = {
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
                { name: "ymd_fr", argument: "arg_ymd_fr" },
                { name: "ymd_to", argument: "arg_ymd_to" },
                { name: "supp_cd", argument: "arg_supp_cd" },
                { name: "date_gb", argument: "arg_date_gb" }
            ],
            remark: [
                { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }], label: gw_com_api.getText("frmOption", 1, "date_gb") + " :" },
                { element: [{ name: "supp_nm" }] }
            ]
        },
        target: [
            { type: "GRID", id: "grdList_MAIN", select: true },
            { type: "FORM", id: "frmData_SUM" }
        ]
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
function processSearch(param) {

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

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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
                    case gw_com_api.v_Message.msg_confirmSave:
                        {
                            if (param.data.result == "YES") {
                                processSave(param.data.arg);
                            } else {
                                if (v_global.process.handler != null)
                                    v_global.process.handler(param.data.arg);
                            }
                        } break;
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
                switch (param.from.page) {
                    case "":
                        break;
                }
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