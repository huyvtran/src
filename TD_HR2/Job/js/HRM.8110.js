//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 채용공고
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
                    type: "INLINE", name: "경력",
                    data: [
                        { title: "전체", value: "%" },
                        { title: "신입", value: "1" },
                        { title: "경력", value: "2" }
                    ]
                },
                {
                    type: "INLINE", name: "성별",
                    data: [{ title: "남", value: "1" }, { title: "여", value: "0" }]
                },
                {
                    type: "PAGE", name: "모집부문", query: "DDDW_CM_CODE",
                    param: [{ argument: "arg_hcode", value: "HRM095" }]
                },
                {
                    type: "PAGE", name: "공고내역", query: "DDDW_ANNOUNCE",
                    param: [{ argument: "arg_status", value: "%" }]
                }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);

        //----------
        function start() {
            gw_job_process.UI();
            gw_job_process.procedure();
            gw_com_api.show("btnArrow");
            gw_com_module.startPage();

            gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -1 }));
            gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate("", { month: 1 }));
        }
    },

    // manage UI. (design section)
    UI: function () {

        //==== Main Menu : 
        var args = {
            targetid: "lyrMenu_1", type: "FREE",
            element: [
				{ name: "조회", value: "조회", act: true },
				{ name: "추가", value: "추가" },
				{ name: "수정", value: "수정", icon: "추가" },
				{ name: "닫기", value: "닫기" }
            ]
        };
        gw_com_module.buttonMenu(args);

        //==== Sub Menu : 
        var args = {
            targetid: "lyrMenu_2", type: "FREE",
            element: [
				{ name: "조회", value: "새로고침", icon: "조회" },
				{ name: "삭제", value: "삭제" },
				{ name: "저장", value: "저장" },
				{ name: "닫기", value: "닫기" }
            ]
        };
        gw_com_module.buttonMenu(args);

        //==== File Menu : 
        var args = {
            targetid: "lyrMenu_3", type: "FREE",
            element: [
				{ name: "파일", value: "파일첨부", icon: "기타" }
            ]
        };
        gw_com_module.buttonMenu(args);

        //==== Search Option : 
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true, remark: "lyrRemark_1",
            editable: { focus: "ymd_fr", validate: true },
            content: {
                row: [
                    {
                        element: [
				            {
				                style: { colfloat: "floating" }, name: "ymd_fr", label: { title: "게시기간 :" }, mask: "date-ymd",
				                editable: { type: "text", size: 7, maxlength: 10 }
				            },
				            { name: "ymd_to", label: { title: "~" }, mask: "date-ymd", editable: { type: "text", size: 7, maxlength: 10 } }
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
        gw_com_module.formCreate(args);

        //==== Main List Grid : 공고 목록
        var args = {
            targetid: "grdList_Main", query: "HRM_8110_1", title: "채용 공고 현황",
            height: 400, show: true, selectable: true, number: true,
            element: [
                { header: "관리번호", name: "ann_key", width: 80, align: "center" },
                { header: "제목", name: "ann_title", width: 200 },
				{ header: "게시시작일", name: "noti_fr_date", width: 80, align: "center", mask: "date-ymd" },
				{ header: "게시종료일", name: "noti_to_date", width: 80, align: "center", mask: "date-ymd" },
				{ header: "접수시작일", name: "ann_fr_date", width: 80, align: "center", mask: "date-ymd" },
				{ header: "접수마감일", name: "ann_to_date", width: 80, align: "center", mask: "date-ymd" },
				{ header: "채용부문", name: "ann_cat", width: 400 }
            ]
        };
        gw_com_module.gridCreate(args);

        //==== Main Form : 공고내역
        var args = {
            targetid: "frmData_Main", query: "HRM_8110_1", type: "TABLE", title: "채용 공고 내역",
            caption: true, show: true, selectable: true,
            editable: { bind: "select", focus: "noti_fr_date", validate: true },
            content: {
                width: { label: 40, field: 60 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "게시시작일", format: { type: "label" } },
                            { name: "noti_fr_date", editable: { type: "text", validate: { rule: "required" }, width: 80 }, mask: "date-ymd" },
                            { header: true, value: "게시종료일", format: { type: "label" } },
                            { name: "noti_to_date", editable: { type: "text", validate: { rule: "required" }, width: 80 }, mask: "date-ymd" },
                            { header: true, value: "접수시작일", format: { type: "label" } },
                            { name: "ann_fr_date", editable: { type: "text", validate: { rule: "required" }, width: 80 }, mask: "date-ymd" },
                            { header: true, value: "접수마감일", format: { type: "label" } },
                            { name: "ann_to_date", editable: { type: "text", validate: { rule: "required" }, width: 80 }, mask: "date-ymd" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "제목", format: { type: "label" } },
                            {
                                name: "ann_title", format: { type: "text", width: 1020 },
                                editable: { type: "text", validate: { rule: "required" }, width: 1020 }, style: { colspan: 7 }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "공고내용", format: { type: "label" } },
                            { name: "ann_file", format: { type: "text", width: 1020 }, style: { colspan: 5 } },
                            { header: true, value: "관리번호", format: { type: "label" } },
                            { name: "ann_key", editable: { type: "hidden", width: 110 } }
                        ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);

        //==== Sub Form : 공고내역
        var args = {
            targetid: "frmData_Sub", query: "HRM_8110_2", type: "TABLE", title: "공고내용",
            caption: true, show: true, selectable: true, width: 800,
            content: {
                width: { label: 14, field: 86 }, height: 285,
                row: [
                    {
                        element: [
                            { header: true, value: "공고내용", format: { type: "label" } },
                            { name: "ann_contents", format: { type: "html", height: 265 } },
                            { name: "ann_key", editable: { type: "hidden" }, hidden: true }
                        ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);

        //==== Sub Grid : 모집부문(기준)
        var args = {
            targetid: "grdList_CAT", query: "HRM_8110_4", title: "모집부문(기준)",
            width: 150, height: 288, show: true, caption: true, selectable: true, pager: false,// multi: true,
            element: [
                { header: "항목", name: "ann_cat01_nm", width: 100 },
                { name: "ann_cat01", hidden: true }
            ]
        };
        gw_com_module.gridCreate(args);

        //==== Sub Grid : 모집부문(사용)
        var args = {
            targetid: "grdData_Sub", query: "HRM_8110_3", title: "모집부문(사용)",
            width: 150, height: 288, show: true, caption: true, selectable: true, pager: false,// multi: true,
            editable: { bind: "select", focus: "ann_cat01_nm", validate: true },
            element: [
                { header: "항목", name: "ann_cat01_nm", width: 100, editable: { type: "hidden" }, display: true },
                { name: "ann_cat01", editable: { type: "hidden" }, hidden: true },
                { name: "ann_seq", editable: { type: "hidden" }, hidden: true },
                { name: "ann_key", editable: { type: "hidden" }, hidden: true }
            ]
        };
        gw_com_module.gridCreate(args);

        //==== Resize Objects
        var args = {
            target: [
				{ type: "GRID", id: "grdList_Main", offset: 8 },
				{ type: "FORM", id: "frmData_Main", offset: 8 },
				{ type: "FORM", id: "frmData_Sub", offset: 8 },
				{ type: "GRID", id: "grdList_CAT", offset: 8 },
				{ type: "GRID", id: "grdData_Sub", offset: 8 }
            ]
        };
        gw_com_module.objResize(args);

        //==== Create Tab
        var args = {
            tabid: "lyrTab",
            target: [
                { type: "LAYER", id: "lyrTab_1", title: "채용 공고 현황" },
				{ type: "LAYER", id: "lyrTab_2", title: "채용 공고 내역" }
            ]
        };
        gw_com_module.convertTab(args);

        //==== Resize Objects
        var args = {
            target: [
				{ type: "TAB", id: "lyrTab", offset: 8 }
            ]
        };
        gw_com_module.objResize(args);

        gw_com_module.informSize();

    },

    //==== manage process. (program section)
    procedure: function () {

        //==== Button Click : Main 조회, 추가, 수정, 출력(납품서), 라벨(라벨출력), 닫기 ====
        var args = { targetid: "lyrMenu_1", element: "조회", event: "click", handler: viewOption };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1", element: "추가", event: "click", handler: processInsert };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1", element: "수정", event: "click", handler: processEdit };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "조회", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "삭제", event: "click", handler: processRemove };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "저장", event: "click", handler: processSave };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_3", element: "파일", event: "click", handler: processFileUpload };
        gw_com_module.eventBind(args);
        //----------

        //==== Button Click : Search Option ====
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: closeOption };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "btnRightAll", event: "click", handler: processCopy };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "btnRight", event: "click", handler: processCopy };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "btnLeftAll", event: "click", handler: processCopy };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "btnLeft", event: "click", handler: processCopy };
        gw_com_module.eventBind(args);

        //==== Grid Events :
        var args = { targetid: "grdList_Main", grid: true, event: "rowdblclick", handler: processEdit };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_CAT", grid: true, event: "rowdblclick", handler: processCopy };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_Sub", grid: true, event: "rowdblclick", handler: processCopy };
        gw_com_module.eventBind(args);
        //----------

        //==== Other Object Events :
        var args = { targetid: "lyrTab", event: "tabselect", handler: processTabChange };
        gw_com_module.eventBind(args);
        //----------

    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function viewOption() {

    gw_com_api.show("frmOption");

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

}
//----------
function processInsert(param) {

    var args = {
        targetid: "frmData_Main", edit: true, updatable: true,
        data: [
            { name: "noti_fr_date", value: gw_com_api.getDate("") },
            { name: "noti_to_date", value: gw_com_api.getDate("") },
            { name: "ann_fr_date", value: gw_com_api.getDate("") },
            { name: "ann_to_date", value: gw_com_api.getDate("") }
        ],
        clear: [
            { type: "FORM", id: "frmData_Sub" },
            { type: "GRID", id: "grdList_CAT" },
            { type: "GRID", id: "grdData_Sub" }
        ]
    };
    gw_com_module.formInsert(args);
    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_ann_key", value: 0 }
            ]
        },
        target: [
            { type: "GRID", id: "grdList_CAT" },
        ]
    };
    gw_com_module.objRetrieve(args);
    gw_com_api.selectTab("lyrTab", 2);
    v_global.logic.ann_key = 0;

}
//----------
function processEdit(param) {

    if (gw_com_api.getSelectedRow("grdList_Main", false) == null) return;
    v_global.logic.ann_key = gw_com_api.getValue("grdList_Main", "selected", "ann_key", true);
    processRetrieve({});
    gw_com_api.selectTab("lyrTab", 2);

}
//----------
function processCopy(param) {

    gw_com_api.block("grdList_CAT");
    gw_com_api.block("grdData_Sub");

    var _all = false;
    var _ann_key = gw_com_api.getValue("frmData_Main", 1, "ann_key");
    var _ids = new Array();
    var _data = new Array();
    var _source = "";
    var _target = "";

    switch (param.object) {
        case "btnRightAll":
            _all = true;
        case "btnRight":
        case "grdList_CAT":
            _source = "grdList_CAT";
            _target = "grdData_Sub";
            break;
        case "btnLeftAll":
            _all = true;
        case "btnLeft":
        case "grdData_Sub":
            _source = "grdData_Sub";
            _target = "grdList_CAT";
            break;
    }

    if (_all)
        _ids = gw_com_api.getRowIDs(_source);
    else
        _ids = [gw_com_api.getSelectedRow(_source, false)];

    if (_ids != null) {
        for (var i = 0 ; i < _ids.length; i++) {
            _data.push({
                ann_key: _ann_key,
                ann_cat01: gw_com_api.getValue(_source, _ids[i], "ann_cat01", true),
                ann_cat01_nm: gw_com_api.getValue(_source, _ids[i], "ann_cat01_nm", true)
            });
        }
        gw_com_module.gridInserts({ targetid: _target, updatable: true, edit: true, data: _data });

        //if (gw_com_api.getRowCount(_source) == _ids.length) {
        //    gw_com_module.objClear({ target: [{ type: "GRID", id: _source }] });
        //} else {
            for (var i = _ids.length - 1; i >= 0; i--) {
                gw_com_module.gridDelete({ targetid: _source, row: _ids[i] });
            }
        //}
    }
    gw_com_api.unblock("grdList_CAT");
    gw_com_api.unblock("grdData_Sub");

}
//----------
function processRetrieve(param) {

    var args = {};
    if (param.object == "frmOption" || param.master) {
        // Validate Inupt Options
        args = { target: [{ type: "FORM", id: "frmOption" }] };
        if (gw_com_module.objValidate(args) == false) return false;

        // Retrieve
        args = {
            source: {
                type: "FORM", id: "frmOption", hide: true,
                element: [
                    { name: "ymd_fr", argument: "arg_ymd_fr" },
                    { name: "ymd_to", argument: "arg_ymd_to" }
                ],
                argument: [
                    { name: "arg_ann_key", value: 0 }
                ],
                remark: [
                    { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }] }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_Main", select: true }
            ],
            clear: [
                { type: "FORM", id: "frmData_Main" },
                { type: "FORM", id: "frmData_Sub" },
                { type: "GRID", id: "grdList_CAT" },
                { type: "GRID", id: "grdData_Sub" },
            ],
            key: param.key,
            handler: { complete: processRetrieveEnd, param: param }
        };
    } else if (param.object == "grdList_Main" || param.sub) {
        args = {
            source: {
                type: "INLINE",
                argument: [
                    { name: "arg_ymd_fr", value: "0" },
                    { name: "arg_ymd_to", value: "9" },
                    { name: "arg_ann_key", value: v_global.logic.ann_key }
                ],
            },
            target: [
                { type: "FORM", id: "frmData_Main", edit: true },
                { type: "FORM", id: "frmData_Sub" }
            ],
            key: param.key,
            handler: { complete: processRetrieveEnd, param: param }
        };

    } else {
        if (v_global.logic.ann_key == 0 || v_global.logic.ann_key == null) return;
        args = {
            source: {
                type: "INLINE",
                argument: [
                    { name: "arg_ymd_fr", value: "0" },
                    { name: "arg_ymd_to", value: "9" },
                    { name: "arg_ann_key", value: v_global.logic.ann_key }
                ],
            },
            target: [
                { type: "FORM", id: "frmData_Main", edit: true },
                { type: "FORM", id: "frmData_Sub" },
                { type: "GRID", id: "grdList_CAT" },
                { type: "GRID", id: "grdData_Sub" }
            ],
            key: param.key,
            handler: { complete: processRetrieveEnd, param: param }
        };

    }
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {
}
//----------
function processRemove(param) {

    if (param.object == "lyrMenu_2") {
        if (!checkManipulate({})) return;
        v_global.process.handler = processRemove;
        gw_com_api.messageBox([{ text: "REMOVE" }], 420
                , gw_com_api.v_Message.msg_confirmRemove, "YESNO", param);
    } else {
        var args = {
            target: [
                {
                    type: "FORM", id: "frmData_Main",
                    key: { element: [{ name: "ann_key" }] }
                }
            ],
            handler: {
                success: successRemove,
                param: param
            }
        };
        gw_com_module.objRemove(args);
    }

}
//----------
function successRemove(response, param) {

    processClear({});
    processRetrieve({ master: true });
    gw_com_api.selectTab("lyrTab", 1);

}
//----------
function processSave(param) {

    var args = {
        target: [
			{ type: "FORM", id: "frmData_Main" },
            { type: "GRID", id: "grdData_Sub" }
        ]
    };

    if (gw_com_module.objValidate(args) == false) return false;

    //args.url = "COM";
    args.handler = { success: successSave };
    args.handler.param = param;

    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    v_global.logic.ann_key = response[0].KEY[0].VALUE;
    var key = [{
        KEY: [{ NAME: "ann_key", VALUE: response[0].KEY[0].VALUE }],
        QUERY: "HRM_8110_1"
    }];
    processRetrieve({ key: key, master: true });
    processRetrieve({ key: response });
    //gw_com_api.selectTab("lyrTab", 1);
    //processClear({});
}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_Main" },
            { type: "GRID", id: "grdList_CAT" },
            { type: "GRID", id: "grdData_Sub" }
        ]
    };
    gw_com_module.objClear(args);

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
function processTabChange(param) {

    closeOption();

}
//----------
function processFileUpload(param) {

    if (!checkManipulate({})) return;
    if (!checkUpdatable({ check: true })) return false;

    var args = {
        type: "PAGE", page: "w_upload_recruit", title: "파일 업로드",
        width: 650, height: 180, locate: ["center", 200], open: true
    };
    if (gw_com_module.dialoguePrepare(args) == false) {
        var args = {
            page: "w_upload_recruit",
            param: {
                ID: gw_com_api.v_Stream.msg_openedDialogue,
                data: {
                    key: gw_com_api.getValue("frmData_Main", 1, "ann_key")
                }
            }
        };
        gw_com_module.dialogueOpen(args);
    }
}
//----------
function checkManipulate(param) {

    closeOption({});

    if (checkCRUD(param) == "none") {
        gw_com_api.messageBox([{ text: "NOMASTER" }]);
        return false;
    }
    return true;

}
//----------
function checkCRUD(param) {

    if (param.sub)
        return gw_com_api.getCRUD("grdData_Sub", "selected", true);
    else 
        return gw_com_api.getCRUD("frmData_Main");

}
//----------
function checkUpdatable(param) {

    closeOption({});

    var args = {
        check: param.check,
        target: [
            { type: "FORM", id: "frmData_Main" },
			{ type: "GRID", id: "grdData_Sub" }
        ],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}

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
                        }
                        break;
                    case gw_com_api.v_Message.msg_confirmRemove:
                        {
                            if (param.data.result == "YES")
                                processRemove({});
                        }
                        break;
                    case gw_com_api.v_Message.msg_informSaved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                    case gw_com_api.v_Message.msg_informRemoved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = { to: { type: "POPUP", page: param.from.page } };

                switch (param.from.page) {
                    case "w_upload_recruit":
                        {
                            args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                            args.data = {
                                user: gw_com_module.v_Session.USR_ID,
                                key: v_global.logic.ann_key
                            };
                        }
                        break;
                }
                gw_com_module.streamInterface(args);
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                switch (param.from.page) {
                    case "w_upload_recruit":
                        if (param.data != undefined) {
                            v_global.logic.ann_key = param.data[0].KEY[0].VALUE;
                            var key = [{
                                KEY: [{ NAME: "ann_key", VALUE: v_global.logic.ann_key }],
                                QUERY: "HRM_8110_1"
                            }];
                            processRetrieve({ key: key, sub: true });
                        }
                        break;
                }
                closeDialogue({ page: param.from.page });
            }
            break;

    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//