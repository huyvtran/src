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
				    type: "PAGE", name: "DEPT_AREA_FIND", query: "dddw_deptarea",
				    param: [{ argument: "arg_type", value: gw_com_module.v_Session.DEPT_AUTH }]
				},
                {
                    type: "INLINE", name: "점검유형",
                    data: [
                        { title: "I/O", value: "IO" },
                        { title: "S/W", value: "SW" }
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

            gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -1 }));
            gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate());

            processRetrieve({ object: "FILE" });

        }
    },

    // manage UI. (design section)
    UI: function () {

        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "올리기", value: "양식 등록", icon: "추가" },
				{ name: "받기", value: "양식 받기", icon: "저장" },
				{ name: "조회", value: "조회", act: true },
                { name: "닫기", value: "닫기" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //----------
        gw_com_api.hide("lyrMenu", "올리기");
        gw_com_api.hide("lyrMenu", "받기");
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
                                name: "ymd_fr", label: { title: "작성일자 :" }, mask: "date-ymd", style: { colfloat: "floating" },
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
                                name: "dept_area", label: { title: "사업부 :" },
                                editable: { type: "select", data: { memory: "DEPT_AREA_FIND", unshift: [{ title: "전체", value: "%" }] } }
                            },
                            {
                                name: "check_tp", label: { title: "점검유형 : " },
                                editable: { type: "select", data: { memory: "점검유형", unshift: [{ title: "전체", value: "%" }] } }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "proj_nm", label: { title: "Project Name : " }, mask: "search",
                                editable: { type: "text", size: 12 }
                            },
                            { name: "proj_no", hidden: true },
                            {
                                name: "user_nm", label: { title: "작성자 : " },
                                editable: { type: "text", size: 10 }
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
            targetid: "frmOption2", type: "FREE", title: "양식 등록/받기",
            trans: true, border: true, show: false,
            editable: { focus: "dept_area", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "dept_area", label: { title: "사업부 :" },
                                editable: { type: "select", data: { memory: "DEPT_AREA_FIND" } }
                            },
                            {
                                name: "check_tp", label: { title: "점검유형 : " },
                                editable: { type: "select", data: { memory: "점검유형" } }
                            },
                            { name: "up_down", hidden: true }
                        ]
                    },
                    {
                        element: [
                            { name: "실행", value: "확인", act: true, format: { type: "button" } },
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
            targetid: "grdList_MAIN", query: "POP_9090_1", title: "Check Sheet List",
            caption: false, height: "100%", pager: true, show: true, selectable: true, number: true,
            element: [
                { header: "Project Name", name: "proj_nm", width: 130 },
                { header: "Project No.", name: "proj_no", width: 80, align: "center" },
                {
                    header: "사업부", name: "prod_tp", width: 60, align: "center",
                    format: { type: "select", data: { memory: "DEPT_AREA_FIND" } }
                },
				{
				    header: "점검유형", name: "check_tp", width: 50, align: "center",
				    format: { type: "select", data: { memory: "점검유형" } }
				},
                { header: "작성자", name: "uuser_nm", width: 50, align: "center" },
                { header: "작성일시", name: "udate", width: 100, align: "center" },
                { header: "Ver.No.", name: "ver_no", width: 40, align: "center" },
                { header: "완료율", name: "total_rate", width: 50, align: "right" },
				{ header: "전체건수", name: "item_cnt", width: 50, align: "right", mask: "numeric-int" },
				{ header: "완료건수", name: "check_cnt", width: 50, align: "right", mask: "numeric-int" },
				{ header: "비고", name: "rmk", width: 150 },
                { header: "다운로드", name: "download", width: 60, align: "center", format: { type: "link", value: "다운로드" } },
                { name: "prod_tp", hidden: true },
                { name: "check_tp", hidden: true },
                { name: "file_id", hidden: true },
                { name: "file_path", hidden: true },
                { name: "file_nm", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        $("#grdList_MAIN_data").parents('div.ui-jqgrid-bdiv').css("min-height", "150px");
        $("#grdList_MAIN_data").parents('div.ui-jqgrid-bdiv').css("max-height", "300px");
        //=====================================================================================
        createDW();
        //=====================================================================================
        var args = {
            targetid: "grdList_FILE", query: "POP_9090_3", title: "양식파일",
            show: false,
            element: [
                { name: "file_id", hidden: true },
                { name: "file_path", hidden: true },
                { name: "file_nm", hidden: true },
                { name: "data_tp", hidden: true },
                { name: "data_key", hidden: true }
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
                { type: "GRID", id: "grdList_SUB", offset: 8 }
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
        //----------
        var args = { targetid: "lyrMenu", element: "올리기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "받기", event: "click", handler: processButton };
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
        var args = { targetid: "frmOption2", element: "실행", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption2", element: "취소", event: "click", handler: closeOption };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdList_MAIN", grid: true, event: "rowselected", handler: createDW };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_MAIN", grid: true, element: "download", event: "click", handler: processFile };
        gw_com_module.eventBind(args);
        //=====================================================================================

    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function viewOption(param) {

    var frm1 = param.element == "조회" ? "frmOption" : "frmOption2";
    var frm2 = param.element == "조회" ? "frmOption2" : "frmOption";

    gw_com_api.hide(frm2);
    var args = { target: [{ id: frm1, focus: true }] };
    gw_com_module.objToggle(args);

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");
    gw_com_api.hide("frmOption2");

}
//----------
function processButton(param) {

    closeOption({});
    switch (param.element) {
        case "실행":
            {
                if (param.object == "frmOption")
                    processRetrieve(param);
                else
                    processTempFile(param);
            }
            break;
        case "닫기":
            {
                processClose({});
            }
            break;
        case "올리기":
        case "받기":
            {
                gw_com_api.setValue("frmOption2", 1, "up_down", param.element == "받기" ? "D" : "U");
                viewOption(param);
            }
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
    if (param.object == "FILE") {
        args = {
            target: [
                { type: "GRID", id: "grdList_FILE" }
            ]
        };
    } else if (param.object == "grdList_MAIN") {
        args = {
            source: {
                type: "GRID", id: param.object, row: param.row,
                element: [
                    { name: "file_id", argument: "arg_file_id" }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_SUB", select: true }
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
                    { name: "ymd_fr", argument: "arg_ymd_fr" },
                    { name: "ymd_to", argument: "arg_ymd_to" },
                    { name: "dept_area", argument: "arg_dept_area" },
                    { name: "check_tp", argument: "arg_check_tp" },
                    { name: "proj_no", argument: "arg_proj_no" },
                    { name: "user_nm", argument: "arg_user_nm" }
                ],
                remark: [
                    { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }] },
                    { element: [{ name: "dept_area" }] },
                    { element: [{ name: "check_tp" }] },
                    { element: [{ name: "proj_nm" }] },
                    { element: [{ name: "user_nm" }] }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_MAIN", select: true },
                { type: "GRID", id: "grdList_FILE" }
            ],
            clear: [
                { type: "GRID", id: "grdList_SUB" }
            ],
            key: param.key
        };
    }
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
function createDW(param) {

    var args = {
        targetid: "grdList_SUB", query: "POP_9090_2", title: "Module Check Result",
        caption: false, height: "100%", pager: true, show: true, selectable: true, number: true
    };
    //----------
    var element = [
        { header: "Module", name: "module", width: 130 },
        { header: "종합", name: "total_rate", width: 100 },
        { name: "file_id", hidden: true },
        { name: "module_cd", hidden: true }
    ];

    if (param == undefined) {
        var element2 = [
            { header: "Item01", name: "item01", width: 100 },
            { header: "Item02", name: "item02", width: 100 },
            { header: "Item03", name: "item03", width: 100 },
            { header: "Item04", name: "item04", width: 100 },
            { header: "Item05", name: "item05", width: 100 },
            { header: "Item06", name: "item06", width: 100 },
            { header: "Item07", name: "item07", width: 100 },
            { header: "Item08", name: "item08", width: 100 },
            { header: "Item09", name: "item09", width: 100 },
            { header: "Item10", name: "item10", width: 100 }
        ];
    } else {
        var element2 = new Array();
        var header = Query.getHeader({ file_id: gw_com_api.getValue(param.object, param.row, "file_id", param.type == "GRID" ? true : false) });
        for (var i = 1; i <= header[0]; i++) {
            var name = ("0" + i);
            name = "item" + name.substring(name.length - 2, name.length);
            element2.push({ header: header[i], name: name, width: 100 });
        }

    }
    args.element = element.concat(element2);
    gw_com_module.gridCreate(args);
    $("#grdList_SUB_data").parents('div.ui-jqgrid-bdiv').css("min-height", "250px");

    if (param != undefined) {
        var args = {
            target: [
                { type: "GRID", id: "grdList_SUB", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        processRetrieve(param);
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
function processTempFile(param) {

    var dept_area = gw_com_api.getValue("frmOption2", 1, "dept_area");
    var chk_tp = gw_com_api.getValue("frmOption2", 1, "check_tp");

    if ($.inArray(dept_area, ["", "%"]) >= 0) {
        gw_com_api.messageBox([{ text: "사업부를 선택하세요." }]);
        return;
    }

    if ($.inArray(chk_tp, ["", "%"]) >= 0) {
        gw_com_api.messageBox([{ text: "점검유형을 선택하세요." }]);
        return;
    }

    var key = dept_area + "_" + chk_tp;
    var mode = gw_com_api.getValue("frmOption2", 1, "up_down");

    if (mode == "U") {
        v_global.logic.search = {
            type: "CHKSHT",
            key: key
        };
        var args = {
            type: "PAGE", page: "POP_9091", title: "양식 업로드",
            width: 650, height: 200, locate: ["center", "top"], open: true,
        };
        if (gw_com_module.dialoguePrepare(args) == false) {
            args = {
                page: args.page,
                param: {
                    ID: gw_com_api.v_Stream.msg_openedDialogue,
                    data: v_global.logic.search
                }
            };
            gw_com_module.dialogueOpen(args);
        }

    } else if (mode == "D") {
        var row = gw_com_api.getFindRow("grdList_FILE", "data_key", key);
        if (row > 0) {
            var args = {
                source: { id: "grdList_FILE", row: row },
                targetid: "lyrDown"
            };
            gw_com_module.downloadFile(args);
        } else {
            gw_com_api.messageBox([{ text: "등록된 양식이 없습니다." }]);
        }
    }

}
//----------
var Query = {
    getHeader: function (param) {
        var rtn = new Array();
        var args = {
            request: "PAGE",
            url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
                    "?QRY_ID=POP_9090_9" +
                    "&QRY_COLS=module,item01,item02,item03,item04,item05,item06,item07,item08,item09,item10,item11,item12,item13,item14,item15,item16,item17,item18,item19,item20,item21,item22,item23,item24,item25,item26,item27,item28,item29,item30,item31,item32,item33,item34,item35,item36,item37,item38,item39" +
                    "&CRUD=R" +
                    "&arg_file_id=" + param.file_id,
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
                    case "POP_9091":
                        {
                            args.data = v_global.logic.search;
                        }
                        break;
                }
                gw_com_module.streamInterface(args);
            } break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                switch (param.from.page) {
                    case "POP_9091":
                        {
                            processRetrieve({ object: "FILE" });
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
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//