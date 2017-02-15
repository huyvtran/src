//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 정산관리
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
        v_global.logic.supp_yn = (gw_com_module.v_Session.USER_TP == "SUPP" ? true : false);

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

            //if (v_global.logic.supp_yn) {
            //    v_global.logic.supp_cd = gw_com_module.v_Session.EMP_NO;
            //    v_global.logic.supp_nm = gw_com_module.v_Session.USR_NM;
            //}
            //else {
            //    v_global.logic.supp_cd = "00000";
            //    v_global.logic.supp_nm = "TERA";
            //}

            //var ymd_fr = gw_com_api.getDate("", { month: -1 });
            //var ymd_to = gw_com_api.getDate("", { month: -1 });
            var ymd_fr = gw_com_api.getDate();
            var ymd_to = gw_com_api.getDate();
            var lastDay = (new Date(ymd_to.substring(0, 4), ymd_to.substring(5, 2), 0)).getDate();

            gw_com_api.setValue("frmOption", 1, "ymd_fr", ymd_fr.substring(0, 6) + "01");
            gw_com_api.setValue("frmOption", 1, "ymd_to", ymd_to.substring(0, 6) + lastDay);
        }
    },

    // manage UI. (design section)
    UI: function () {

        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "조회", value: "조회", act: true },
                { name: "저장", value: "저장" },
                { name: "닫기", value: "닫기" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true, remark: "lyrRemark2",// margin_top: 70,
            editable: { focus: "ymd_fr", validate: true },
            content: {
                row: [
                    {
                        element: [
                            { name: "date_gb", editable: { type: "select", data: { memory: "조회구분" } } },
                            {
                                name: "ymd_fr", label: { title: "" }, mask: "date-ymd", style: { colfloat: "floating" },
                                editable: { type: "text", size: 7, maxlength: 10 }
                            },
			                {
			                    name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
			                    editable: { type: "text", size: 7, maxlength: 10 }
			                }
                        ]
                    }
                ]
            }
        };
        //----------
        if (v_global.logic.supp_yn) {
            args.content.row[0].element.push(
                {
                    name: "supp_nm", label: { title: "협력사 :" }, mask: "search",
                    editable: { type: "text", size: 18, maxlength: 50 }, hidden: true
                },
                { name: "supp_cd", hidden: true, editable: { type: "hidden" } }
            );
        } else {
            args.content.row.push({
                element: [
                    {
                        name: "supp_nm", label: { title: "협력사 :" }, mask: "search",
                        editable: { type: "text", size: 18, maxlength: 50 }
                    },
                    { name: "supp_cd", hidden: true, editable: { type: "hidden" } }
                ]
            });
        }
        args.content.row.push({
            element: [
                { name: "실행", value: "실행", act: true, format: { type: "button" } },
                { name: "취소", value: "취소", format: { type: "button", icon: "닫기" } }
            ], align: "right"
        });
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_MAIN", query: "SRM_4390_1", title: "정산현황(업체)",
            caption: false, height: 454, width: 280, pager: true, show: true, selectable: true, number: true,
            element: [
                { header: "업체명", name: "supp_nm", width: 100 },
                { header: "정산", name: "adj_y", width: 80, align: "right"/*, mask: "numeric-int"*/ },
                { header: "미정산", name: "adj_n", width: 80, align: "right"/*, mask: "numeric-int"*/ },
                { header: "가입고금액", name: "io_amt", width: 60, align: "right", mask: "numeric-int" },
                { name: "supp_cd", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_SUB", query: "SRM_4390_2", title: "정산현황(목록)",
            caption: false, height: 415, width: 886, pager: true, show: true, number: true, selectable: true,
            editable: { master: true, bind: "select", focus: "io_date", validate: true },
            element: [
				{ header: "가입고일자", name: "io_date", width: 70, align: "center", mask: "date-ymd" },
				{ header: "검수일자", name: "chk_date", width: 70, align: "center", mask: "date-ymd" },
                { header: "선입고", name: "direct_yn", width: 40, align: "center", format: { type: "checkbox", value: "1", offval: "0", title: "" } },
				{ header: "품목코드", name: "item_cd", width: 100 },
				{ header: "품명", name: "item_nm", width: 150 },
				{ header: "규격", name: "item_spec", width: 150 },
                { header: "가입고", name: "io_qty", width: 60, align: "right", mask: "numeric-int" },
                { header: "불합격", name: "chk_qty", width: 60, align: "right", mask: "numeric-int" },
                { header: "단가", name: "pur_price", width: 60, align: "right", mask: "numeric-int" },
                { header: "단위", name: "pur_unit", width: 40, align: "center", hidden: true },
                { header: "금액", name: "io_amt", width: 60, align: "right", mask: "numeric-int" },
                {
                    header: "정산일자", name: "adj_date", width: 90, align: "center", mask: "date-ymd",
                    editable: { type: "text", validate: { rule: "dateISO" } }
                },
				{ header: "Project Name", name: "proj_nm", width: 150 },
				{ header: "Project No.", name: "proj_no", width: 80, align: "center" },
                { header: "발주번호", name: "pur_no", width: 100, align: "center" },
                { header: "순번", name: "pur_seq", width: 50, align: "center", mask: "numeric-int" },
                { name: "io_no", editable: { type: "hidden" }, hidden: true },
                { name: "io_seq", editable: { type: "hidden" }, hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption_2", type: "FREE",
            trans: false, show: true, border: true, align: "right",
            editable: { bind: "open", focus: "adj_date", validate: true },
            content: {
                row: [
                    {
                        element: [
				            {
				                name: "adj_date", label: { title: "정산일자 일괄적용:" },
				                editable: { type: "text", size: 10 }, mask: "date-ymd"
				            },
                            { name: "실행", value: "적용", format: { type: "button" } }
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
                { type: "GRID", id: "grdData_SUB", offset: 8 }
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
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processButton };
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
        var args = { targetid: "frmOption", event: "itemdblclick", handler: processSearch };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemkeyenter", handler: processSearch };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption_2", element: "실행", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        //var args = { targetid: "frmOption_2", event: "itemchanged", handler: processItemchanged };
        //gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdList_MAIN", grid: true, event: "rowselecting", handler: processRowselecting };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_MAIN", grid: true, event: "rowselected", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //=====================================================================================

    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function viewOption(param) {

    gw_com_api.show("frmOption");

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
            if (param.object == "frmOption") {
                v_global.process.handler = processRetrieve;
                if (!checkUpdatable({})) return;
                processRetrieve(param);
            } else if (param.object == "frmOption_2") {
                var adj_date = gw_com_api.getValue("frmOption_2", 1, "adj_date");
                var ids = gw_com_api.getRowIDs("grdData_SUB");
                $.each(ids, function () {
                    gw_com_api.selectRow("grdData_SUB", this, true);
                    gw_com_api.setValue("grdData_SUB", this, "adj_date", adj_date, true);
                });
            }
            break;
        case "저장":
            processSave({});
            break;
        case "닫기":
            v_global.process.handler = processClose;
            if (!checkUpdatable({})) return;
            processClose({});
            break;
    }

}
//----------
function processRowselecting(param) {

    v_global.process.handler = processSelect;
    v_global.process.current.master = param.row;

    return checkUpdatable({});
}
//----------
function processSelect(param) {

    gw_com_api.selectRow("grdList_MAIN", v_global.process.current.master, true, false);

}
//----------
function processEdit(param) {

    v_global.process.handler = processRetrieve;
    if (!checkUpdatable({})) return;
    processRetrieve(param);

}
//----------
function processItemchanged(param) {

    if (param.object == "frmOption_2") {
        var ids = gw_com_api.getRowIDs("grdData_SUB");
        $.each(ids, function () {
            gw_com_api.selectRow("grdData_SUB", this, true);
            gw_com_api.setValue("grdData_SUB", this, "adj_date", param.value.current, true);
        });
    } else if (param.object == "frmOption") {
        if (param.element == "supp_nm" && param.value.current == "") {
            gw_com_api.setValue(param.object, param.row, "supp_cd", "");
        }
    }

}
//----------
function processRetrieve(param) {

    var args = { target: [{ type: "FORM", id: "frmOption" }] };
    if (!gw_com_module.objValidate(args)) return;

    var args;
    if (param.object == "frmOption") {
        args = {
            source: {
                type: "FORM", id: "frmOption", hide: true,
                element: [
                    { name: "ymd_fr", argument: "arg_ymd_fr" },
                    { name: "ymd_to", argument: "arg_ymd_to" },
                    { name: "date_gb", argument: "arg_date_gb" },
                    { name: "supp_cd", argument: "arg_supp_cd" }
                ],
                remark: [
                    { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }], label: gw_com_api.getText("frmOption", 1, "date_gb") + " :" },
                    { element: [{ name: "supp_nm" }] }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_MAIN", select: true }
            ],
            clear: [
                { type: "GRID", id: "grdData_SUB" }
            ],
            key: param.key
        };
    } else {
        v_global.process.prev.master = param.row;
        args = {
            source: {
                type: "FORM", id: "frmOption", row: param.row,
                element: [
                    { name: "date_gb", argument: "arg_date_gb" },
                    { name: "ymd_fr", argument: "arg_ymd_fr" },
                    { name: "ymd_to", argument: "arg_ymd_to" }
                ],
                argument: [
                    { name: "arg_supp_cd", value: gw_com_api.getValue("grdList_MAIN", "selected", "supp_cd", true) }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_SUB", select: true }
            ],
            handler: {
                complete: processRetrieveEnd,
                param: param
            },
            key: (v_global.logic.sub_key != undefined ? v_global.logic.sub_key : param.key)
        };

    }
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {

    v_global.logic.sub_key = undefined;
}
//----------
function processSave(param) {

    var args = {
        url: "COM",
        target: [
            { type: "GRID", id: "grdData_SUB" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args.handler = {
        success: successSave,
        param: param
    };
    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    v_global.logic.sub_key = response;
    var key = [{
        KEY: [{ NAME: "supp_cd", VALUE: gw_com_api.getValue("grdList_MAIN", "selected", "supp_cd", true) }],
        QUERY: "SRM_4390_1"
    }];
    processRetrieve({ object: "frmOption", row: 1, type: "FORM", key: key });

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
function checkCRUD(param) {

    return gw_com_api.getCRUD("grdData_SUB");

}
//----------
function checkManipulate(param) {

    if (checkCRUD(param) == "none") {
        gw_com_api.messageBox([
            { text: "NOMASTER" }
        ]);
        return false;
    }
    return true;

}
//----------
function checkEditable(param) {

    return (gw_com_module.v_Option.authority.usable && gw_com_module.v_Option.authority.control == "R") ? false : true;

}
//----------
function checkUpdatable(param) {

    var args = {
        check: param.check,
        target: [
			{ type: "GRID", id: "grdData_SUB" }
        ],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function processSearch(param) {

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
                                var status = checkCRUD({});
                                if (status == "initialize" || status == "create")
                                    processDelete({});
                                else if (status == "update")
                                    processRestore({});

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
                }
                gw_com_module.streamInterface(args);
            } break;
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
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//