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

        // 협력사 여부
        v_global.logic.Supp = (gw_com_module.v_Session.USER_TP == "SUPP" ? true : false);

        // set data for DDDW List
        var args = {
            request: [
                {
                    type: "INLINE", name: "날짜구분",
                    data: [
                        { title: "발주일자", value: "PO" },
                        { title: "가입고일자", value: "IO" },
                        { title: "검수일자", value: "CHK" }
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

            gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { day: -30 }));
            gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate());

            if (v_global.logic.Supp) {
                gw_com_api.setValue("frmOption", 1, "supp_cd", gw_com_module.v_Session.EMP_NO);
            } else {
                gw_com_api.hide("lyrMenu_SUB");
            }
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
            targetid: "lyrMenu_SUB", type: "FREE",
            element: [
				{ name: "추가", value: "추가" },
				{ name: "삭제", value: "삭제" },
                { name: "저장", value: "저장" }
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
                                name: "pur_no", label: { title: "발주번호 : " },
                                editable: { type: "text", size: 10, maxlength: 20 }
                            },
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
			                },
                            {
                                name: "chk01_yn", label: { title: "필수 :" },
                                editable: { type: "checkbox", value: "1", offval: "0" }, value: "1"
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
                                editable: { type: "text", size: 12/*, validate: { rule: "required" }*/ }, hidden: v_global.logic.Supp
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
            targetid: "grdList_MAIN", query: "SRM_6110_1", title: "발주서 목록",
            caption: true, height: 290, pager: true, show: true, selectable: true, number: true, dynamic: true,
            color: {
                row: true,
                //element: ["chk01_yn_nm"]
            },
            element: [
                { header: "협력사", name: "supp_nm", width: 100, hidden: v_global.logic.Supp },
                { header: "발주번호", name: "pur_no", width: 80, align: "center" },
                { header: "발주일자", name: "pur_date", width: 80, align: "center", mask: "date-ymd" },
                { header: "Project Name", name: "proj_nm", width: 130 },
                { header: "Project No.", name: "proj_no", width: 80, align: "center" },
                { header: "품번", name: "item_cd", width: 100 },
                { header: "품명", name: "item_nm", width: 130 },
   				{ header: "규격", name: "item_spec", width: 200 },
                { header: "발주수량", name: "pur_qty", width: 50, align: "right", mask: "numeric-int" },
                { header: "검수수량", name: "qcok_qty", width: 50, align: "right", mask: "numeric-int" },
                { header: "성적서", name: "qcfile_qty", width: 50, align: "right", mask: "numeric-int" },
                { header: "구분", name: "chk01_yn_nm", width: 50, align: "center" },
                { name: "pur_seq", hidden: true },
                { name: "chk01_yn", hidden: true },
                { name: "color", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_SUB", query: "SRM_6110_2", title: "성적서",
            caption: true, height: 80, pager: false, show: true, selectable: true, number: true,
            editable: v_global.logic.Supp ? { multi: true, bind: "_edit_yn", focus: "file_desc2", validate: true } : undefined,
            element: [
                {
                    header: "Ser. No.", name: "file_desc2", width: 80,
                    editable: { type: "text", width: 108 }
                },
                { header: "파일명", name: "file_nm", width: 200 },
				{
				    header: "다운로드", name: "download", width: 60, align: "center",
				    format: { type: "link", value: "다운로드" }
				},
				{
				    header: "파일설명", name: "file_desc", width: 300, align: "left",
				    editable: { type: "text", width: 388 }
				},
                { header: "최종수정자", name: "last_usr_nm", width: 80 },
                { header: "최종수정일시", name: "last_dt", width: 120, align: "center" },
                { name: "file_ext", hidden: true },
                { name: "file_path", hidden: true },
                { name: "network_cd", hidden: true },
                { name: "data_tp", hidden: true },
                { name: "data_key", hidden: true },
                { name: "data_seq", hidden: true },
                { name: "file_id", hidden: true, editable: { type: "hidden" } },
                { name: "_edit_yn", hidden: true }
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
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_SUB", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_SUB", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_SUB", element: "저장", event: "click", handler: processButton };
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
        var args = { targetid: "grdList_MAIN", grid: true, event: "rowselected", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_SUB", grid: true, element: "download", event: "click", handler: processFile };
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
            processRetrieve(param);
            break;
        case "닫기":
            processClose({});
            break;
        case "추가":
            processInsert(param);
            break;
        case "삭제":
            {
                var pur_no = gw_com_api.getValue("grdData_SUB", "selected", "data_key", true);
                var pur_seq = gw_com_api.getValue("grdData_SUB", "selected", "data_seq", true);
                //var del_yn = Query.getDelYN({ pur_no: pur_no, pur_seq: pur_seq });
                //if (del_yn == "1")
                    processDelete(param);
                //else
                //    gw_com_api.messageBox([{ text: "입고된 품목의 성적서는 삭제할 수 없습니다." }]);
            }
            break;
        case "저장":
            processSave(param);
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

    var args;
    if (param.object == "grdList_MAIN") {
        args = {
            source: {
                type: param.type, id: param.object, row: param.row, block: true,
                element: [
                    { name: "pur_no", argument: "arg_data_key" },
                    { name: "pur_seq", argument: "arg_data_seq" }
                ],
            },
            target: [
                { type: "GRID", id: "grdData_SUB", select: true }
            ],
            key: param.key
        };
    } else {
        args = { target: [{ type: "FORM", id: "frmOption" }] };
        if (!gw_com_module.objValidate(args)) return;
        args = {
            source: {
                type: "FORM", id: "frmOption", hide: true,
                element: [
                    { name: "date_tp", argument: "arg_date_tp" },
                    { name: "ymd_fr", argument: "arg_ymd_fr" },
                    { name: "ymd_to", argument: "arg_ymd_to" },
                    { name: "supp_cd", argument: "arg_cust_cd" },
                    { name: "pur_no", argument: "arg_pur_no" },
                    { name: "proj_no", argument: "arg_proj_no" },
                    { name: "chk01_yn", argument: "arg_chk01_yn" }
                ],
                remark: [
                    { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }], label: gw_com_api.getText("frmOption", 1, "date_tp") + " :" },
                    { element: [{ name: "pur_no" }] },
                    { element: [{ name: "proj_nm" }] }
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

        if (!v_global.logic.Supp)
            args.source.remark.push({ element: [{ name: "supp_nm" }] });
    }
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {

}
//----------
function processInsert(param) {

    if (!checkManipulate({})) return;
    if (!checkUpdatable({ check: true })) return false;

    v_global.logic.popup_data = {
        user: gw_com_module.v_Session.USR_ID,
        data_tp: "QCR",
        key: gw_com_api.getValue("grdList_MAIN", "selected", "pur_no", true),
        seq: gw_com_api.getValue("grdList_MAIN", "selected", "pur_seq", true)
    };

    var args = {
        type: "PAGE", page: "w_upload_qcr", title: "파일 업로드",
        width: 650, height: 300,
        //locate: ["center", 600],
        open: true
    };
    if (gw_com_module.dialoguePrepare(args) == false) {
        var args = {
            page: "w_upload_qcr",
            param: {
                ID: gw_com_api.v_Stream.msg_openedDialogue,
                data: v_global.logic.popup_data
            }
        };
        gw_com_module.dialogueOpen(args);
    }

}
//----------
function processDelete(param) {

    var args = { targetid: "grdData_SUB", row: "selected", select: true };
    gw_com_module.gridDelete(args);

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

    if (param.mail != undefined) processBatch(param);
    var key = response;
    processRetrieve({ object: "grdList_MAIN", type: "GRID", row: "selected" });
}
//----------
function checkManipulate(param) {
    
    var row = gw_com_api.getSelectedRow("grdList_MAIN");
    if (!row > 0) {
        gw_com_api.messageBox([
            { text: "NOMASTER" }
        ]);
        return false;
    }
    return true;

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
var Query = {
    getDelYN: function (param) {
        var rtn = new Array();
        var args = {
            request: "PAGE",
            url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
                    "?QRY_ID=SRM_6110_9" +
                    "&QRY_COLS=del_yn" +
                    "&CRUD=R" +
                    "&arg_pur_no=" + param.pur_no + "&arg_pur_seq=" + param.pur_seq,
            handler_success: successRequest
        };
        //=================== async : false ========================
        $.ajaxSetup({ async: false });
        //----------
        gw_com_module.callRequest(args);
        //----------
        function successRequest(data) {
            if (data && data.length > 0)
                rtn = data[0].DATA[0];
        }
        //----------
        $.ajaxSetup({ async: true });
        //=================== async : true ========================
        return rtn
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
                    case "w_upload_qcr":
                        {
                            args.ID = param.ID;
                            args.data = v_global.logic.popup_data;
                        }
                        break;
                }
                gw_com_module.streamInterface(args);
            } break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                switch (param.from.page) {
                    case "w_upload_qcr":
                        break;
                }
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_uploaded_ECCB:
            {
                processRetrieve({ object: "grdList_MAIN", type: "GRID", row: "selected" });
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