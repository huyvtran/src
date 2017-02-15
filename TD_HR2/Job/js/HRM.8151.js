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
        var args = {
            request: [
                {
                    type: "INLINE", name: "결과",
                    data: [
                        { title: "-", value: "" },
                        { title: "합격", value: "합격" },
                        { title: "불합격", value: "불합격" }
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
            gw_job_process.procedure();

            var args = { ID: gw_com_api.v_Stream.msg_openedDialogue };
            gw_com_module.streamInterface(args);

            gw_com_module.startPage();

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
                { name: "조회", value: "새로고침", icon: "조회" },
				{ name: "저장", value: "확인", icon: "저장" },
				{ name: "닫기", value: "취소" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_File", type: "FREE",
            element: [
                { name: "추가", value: "추가" },
				{ name: "삭제", value: "삭제" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_Main", query: "HRM_8151_1", title: "면접 대상자",
            height: "100%", caption: true, show: true, selectable: true, number: true, pager: false,
            element: [
                { header: "이름", name: "app_nm_kr", width: 50, align: "center" },
                { header: "주민번호", name: "reg_no", width: 90, align: "center", hidden: true },
				{ header: "생년월일", name: "birth_date", width: 100, align: "center", mask: "date-ymd" },
                { header: "나이", name: "age", width: 30, align: "center" },
                { header: "성별", name: "sex", format: { type: "select", data: { memory: "성별" } }, width: 30, align: "center" },
                { header: "전화번호", name: "tel_no", width: 60 },
                { header: "휴대폰", name: "mobile_no", width: 60 },
                { header: "이메일", name: "email", width: 100 },
                { header: "주소", name: "addr", width: 250 },
                { header: "모집부문", name: "ann_cat02", width: 60, align: "center" },
                { header: "구분", name: "ann_cat01", width: 30, align: "center" },
                { header: "최종결과", name: "rec_status_nm", width: 50, align: "center" },
                { name: "ann_key", editable: { type: "hidden" }, hidden: true },
                { name: "ann_seq", editable: { type: "hidden" }, hidden: true },
                { name: "app_key", editable: { type: "hidden" }, hidden: true },
                { name: "img_nm", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_Main", query: "HRM_8151_2", title: "결과",
            height: "100%", caption: true, show: true, selectable: true, number: true, pager: false,
            editable: { bind: "select", focus: "result_cd", validate: true },
            element: [
                { header: "구분", name: "itv_tp", width: 60, align: "center", display: true },
                { header: "결과", name: "result_cd", editable: { type: "select", data: { memory: "결과" }, width: 120 }, width: 90, align: "center" },
                { header: "시행일", name: "itv_date", editable: { type: "text", width: 100 }, width: 60, mask: "date-ymd", align: "center" },
                { header: "확정일", name: "set_date", editable: { type: "text", width: 100 }, width: 60, mask: "date-ymd", align: "center" },
                { header: "통지일", name: "inf_date", width: 100, mask: "date-ymd", align: "center" },
                { header: "비고", name: "rmk", editable: { type: "text", width: 270 }, width: 150 },
                { name: "ann_key", editable: { type: "hidden" }, hidden: true },
                { name: "ann_seq", editable: { type: "hidden" }, hidden: true },
                { name: "app_key", editable: { type: "hidden" }, hidden: true },
                { name: "itv_seq", editable: { type: "hidden" }, hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_File", query: "HRM_8151_3", title: "첨부 파일",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            editable: { multi: true, bind: "_edit_yn", focus: "file_desc", validate: true },
            element: [
				{ header: "파일명", name: "file_nm", width: 270, align: "left" },
				{ header: "다운로드", name: "download", width: 60, align: "center", format: { type: "link", value: "다운로드" } },
                { header: "등록자", name: "upd_usr", width: 70, align: "center" },
                { header: "등록일시", name: "upd_dt", width: 150, align: "center" },
				{ header: "설명", name: "file_desc", width: 320, align: "left", editable: { type: "text", width: 370 } },
                { name: "file_path", hidden: true },
                { name: "file_id", hidden: true, editable: { type: "hidden" } },
				{ name: "_edit_yn", hidden: true }
            ]
        };
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdList_Main", offset: 8 },
                { type: "GRID", id: "grdData_Main", offset: 8 },
                { type: "GRID", id: "grdData_File", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        gw_com_module.informSize();

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
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_File", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_File", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_File", grid: true, element: "download", event: "click", handler: processDownload };
        gw_com_module.eventBind(args);
    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function processButton(param) {

    if (param.object == "lyrMenu") {
        switch (param.element) {
            case "조회":
                processRetrieve({});
                break;
            case "저장":
                processSave({});
                break;
            case "닫기":
                processClose({});
                break;
        }
    } else if (param.object == "lyrMenu_File") {
        if (param.element == "추가") {
            var args = {
                type: "PAGE", page: "HRM_8152", title: "파일 업로드",
                width: 650, height: 200, locate: ["center", 100], open: true
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = {
                    page: "HRM_8152",
                    param: {
                        ID: gw_com_api.v_Stream.msg_openedDialogue,
                        data: {
                            user: gw_com_module.v_Session.USR_ID,
                            key: gw_com_api.getValue("grdData_Main", 1, "ann_key", true),
                            seq: gw_com_api.getValue("grdData_Main", 1, "ann_seq", true),
                            subseq: gw_com_api.getValue("grdData_Main", 1, "app_key", true)
                        }
                    }
                };
                gw_com_module.dialogueOpen(args);
            }
        } else {
            var args = { targetid: "grdData_File", row: "selected", select: true };
            gw_com_module.gridDelete(args);
        }
    }

}
//----------
function processRetrieve(param) {

    var args = {};
    if (param.file) {
        args = {
            source: {
                type: "INLINE",
                argument: [
                    { name: "arg_ann_key", value: v_global.logic.ann_key },
                    { name: "arg_ann_seq", value: v_global.logic.ann_seq },
                    { name: "arg_app_key", value: v_global.logic.app_key }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_File", select: true }
            ],
            key: param.key,
            handler: { complete: processRetrieveEnd, param: param }
        };
    } else {
        args = {
            source: {
                type: "INLINE",
                argument: [
                    { name: "arg_ann_key", value: v_global.logic.ann_key },
                    { name: "arg_ann_seq", value: v_global.logic.ann_seq },
                    { name: "arg_app_key", value: v_global.logic.app_key },
                    { name: "arg_itv_seq", value: v_global.logic.itv_seq }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_Main", select: true, updatable: true },
                { type: "GRID", id: "grdData_Main", select: true, edit: true },
                { type: "GRID", id: "grdData_File", select: true }
            ],
            handler: { complete: processRetrieveEnd, param: param }
        };
    }
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {

    if (gw_com_api.getRowCount("grdList_Main") != 1) {
        gw_com_api.messageBox([{ text: "면접 대상자 정보가 존재하지 않습니다." }]);
        processClose({});
    }

    if (gw_com_api.getRowCount("grdData_Main") != 1) {

        var itv_tp = "";
        var result_cd = "";
        switch (v_global.logic.itv_seq) {
            case 1:
                itv_tp = "1차면접";
                break;
            case 2:
                itv_tp = "2차면접";
                break;
            case 8:
                itv_tp = "채용확정";
                result_cd = "합격";
                break;
            case 9:
                itv_tp = "채용취소";
                result_cd = "불합격";
                break;
        }

        var args = {
            targetid: "grdData_Main", edit: true, updatable: true,
            data: [
                { name: "ann_key", value: v_global.logic.ann_key },
                { name: "ann_seq", value: v_global.logic.ann_seq },
                { name: "app_key", value: v_global.logic.app_key },
                { name: "itv_seq", value: v_global.logic.itv_seq },
                { name: "itv_tp", value: itv_tp },
                { name: "result_cd", value: result_cd },
                { name: "itv_date", value: gw_com_api.getDate("") },
                { name: "set_date", value: gw_com_api.getDate("") }
            ]
        };
        gw_com_module.gridInsert(args);
    }

}
//----------
function processSave(param) {

    // 저장
    var args = {
        target: [
			{ type: "GRID", id: "grdList_Main" },
            { type: "GRID", id: "grdData_Main" },
            { type: "GRID", id: "grdData_File" }
        ]
    };

    if (gw_com_module.objValidate(args) == false) return false;

    // 상태
    var chk_fld = "";
    switch (v_global.logic.itv_seq) {
        case 1:     // 1차면접
        case 2:     // 2차면접
            chk_fld = "result_cd";
            break;
        case 3:     // 채용확정
        case 4:     // 채용취소
            chk_fld = "";
            gw_com_api.setValue("grdData_Main", 1, "result_cd", "", true, false, true);
            break;
    }
    if (chk_fld != "" && gw_com_api.getValue("grdData_Main", 1, chk_fld, true) == "") {
        gw_com_api.messageBox([{ text: "[결과]를 입력하세요." }], 350);
        gw_com_api.setError(true, "grdData_Main", 1, chk_fld, true);
        return false;
    }

    args.url = "COM";
    args.handler = { success: successSave };
    args.handler.param = param;

    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    if (v_global.logic.itv_seq == 1 || v_global.logic.itv_seq == 2) {
        var args = {
            handler: processClose,
            param: {
                data: { saved: true, key: response }
            }
        };

        gw_com_api.messageBox([
                { text: "통보 메일을 보내시겠습니까?" }
        ], 300, gw_com_api.v_Message.msg_confirmBatch, "YESNO", args);
    } else {
        var crud = v_global.logic.itv_seq == 8 ? "C" : "D";
        //var args = {
        //    url: "COM",
        //    nomessage: true,
        //    procedure: "sp_REC2HRM",
        //    input: [
        //        { name: "ann_key", value: v_global.logic.ann_key, type: "varchar" },
        //        { name: "ann_seq", value: v_global.logic.ann_seq, type: "varchar" },
        //        { name: "app_key", value: v_global.logic.app_key, type: "varchar" },
        //        { name: "usr_id", value: gw_com_module.v_Session.USR_ID },
        //        { name: "crud", value: crud, type: "varchar" }
        //    ],
        //    handler: {
        //        success: processClose,
        //        param: { data: { saved: true, key: response } }
        //    }
        //};
        //gw_com_module.callProcedure(args);
        //processClose({ data: { saved: true, key: response } });

        var data = {
            ann_key: v_global.logic.ann_key,
            ann_seq: v_global.logic.ann_seq,
            app_key: v_global.logic.app_key,
            usr_id: gw_com_module.v_Session.USR_ID,
            crud: crud,
            img_nm: gw_com_api.getValue("grdList_Main", "selected", "img_nm", true)
        };
        EmpCreate.run(data, response);

    }

}
//----------
function processClose(param) {

    processClear({});
    var args = { ID: gw_com_api.v_Stream.msg_closeDialogue };
    if (param != undefined && param.data != undefined)
        args.data = param.data;
    gw_com_module.streamInterface(args);

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
function processClear(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdList_Main" },
            { type: "GRID", id: "grdData_Main" }//,
            //{ type: "GRID", id: "grdData_File" }
        ]
    };

}
//----------
function processDownload(param) {

    var args = {
        source: { id: "grdData_File", row: param.row },
        targetid: "lyrDown"
    };
    gw_com_module.downloadFile(args);

}
//----------
function processSendMail(param) {


    var to = [{
        name: gw_com_api.getValue("grdList_Main", 1, "app_nm_kr", true),
        value: gw_com_api.getValue("grdList_Main", 1, "email", true),
        key: [
            { name: "data_tp", value: "HRM_REC02" },
            { name: "data_key", value: v_global.logic.ann_key },
            { name: "data_seq", value: v_global.logic.ann_seq },
            { name: "data_subseq", value: v_global.logic.app_key },
            { name: "data_detailseq", value: v_global.logic.itv_seq }
        ]
    }];

    var temp_id = "";
    if (gw_com_api.getValue("grdData_Main", 1, "result_cd", true) == "합격")
        temp_id = (v_global.logic.itv_seq == 1 ? "HRM_REC03" : "HRM_REC05");
    else
        temp_id = (v_global.logic.itv_seq == 1 ? "HRM_REC04" : "HRM_REC06");

    var args = {
        url: "COM",
        to: to,
        temp_id: temp_id,
        edit: true,
        section: "smtp_2",
    };

    gw_com_module.sendMail(args);

    processClose(param);

}
//----------
var EmpCreate = {
    run: function (data, key) {

        var rtn = "";
        var param = {
            request: "SERVICE",
            url: gw_com_module.v_Current.window + ".aspx/EmpCreate",
            params: JSON.stringify(data),
            handler_success: successRequest,
            handler_invalid: invalidRequest,
            handler_error: errorRequest,
            handler_complete: completeRequest
        };
        gw_com_module.callRequest(param);

        function successRequest(param) {
            processClose({ data: { saved: true, key: key } });
        }
        //----------
        function invalidRequest(param) {
        }
        //----------
        function errorRequest(param) {
        }
        //----------
        function completeRequest(param) {
        }
    }
};

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
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = {
                    to: { type: "POPUP",  page: param.from.page  }
                };
                switch (param.from.page) {
                    case "HRM_8150":
                        v_global.logic.ann_key = param.data.ann_key;
                        v_global.logic.ann_seq = param.data.ann_seq;
                        v_global.logic.app_key = param.data.app_key;
                        v_global.logic.itv_seq = param.data.itv_seq;
                        processRetrieve({});
                        break;
                    case "HRM_8152":
                        args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                        args.data = {
                            user: gw_com_module.v_Session.USR_ID,
                            key: gw_com_api.getValue("grdData_Main", 1, "ann_key", true),
                            seq: gw_com_api.getValue("grdData_Main", 1, "ann_seq", true),
                            subseq: gw_com_api.getValue("grdData_Main", 1, "app_key", true)
                        };
                        gw_com_module.streamInterface(args);
                        break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_resultMessage:
            {
                if (param.data.page != gw_com_api.getPageID()) {
                    param.to = {
                        type: "POPUP",
                        page: param.data.page
                    };
                    gw_com_module.streamInterface(param);
                    break;
                }
                switch (param.data.ID) {
                    case gw_com_api.v_Message.msg_confirmSave:
                        {
                            if (param.data.result == "YES")
                                processSave({});
                            else {
                                var status = checkCRUD({});
                                if (status == "initialize" || status == "create")
                                    processClear({});
                                if (v_global.process.handler != null)
                                    v_global.process.handler({});
                            }
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
                    case gw_com_api.v_Message.msg_confirmBatch:
                        {
                            if (param.data.result == "YES")
                                processSendMail(param.data.arg.param);
                            else
                                param.data.arg.handler(param.data.arg.param);
                        }
                        break;
                    case gw_com_api.v_Message.msg_informBatched:
                        { param.data.arg.handler(param.data.arg.response, param.data.arg.param); } break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                switch (param.from.page) {
                    case "HRM_8152":
                        if (param.key != undefined) {
                            processRetrieve({ file: true, key: param.key });
                        }
                        break;
                }
                closeDialogue({ page: param.from.page });
            }
    };

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//