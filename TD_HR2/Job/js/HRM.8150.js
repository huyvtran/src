//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 면접관리
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
                        { title: "전체", value: "0" },
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
            gw_com_module.startPage();
        }
    },

    // manage UI. (design section)
    UI: function () {

        //==== Main Menu : 
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "조회", value: "조회", act: true },
				{ name: "job1", value: "1차면접", icon: "추가" },
				{ name: "job2", value: "2차면접", icon: "추가" },
				{ name: "job3", value: "채용확정", icon: "추가" },
				{ name: "job4", value: "채용취소", icon: "추가" },
				{ name: "닫기", value: "닫기" }
            ]
        };
        gw_com_module.buttonMenu(args);

        //==== Search Option : 
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true, remark: "lyrRemark",
            editable: { focus: "ann_key", validate: true },
            content: {
                row: [
                        {
                            element: [
                                {
                                    name: "ann_key", label: { title: "공고제목 :" },
                                    editable: {
                                        type: "select",
                                        data: { memory: "공고내역" }//,
                                        //change: [{ name: "ann_cat02", memory: "모집부문", key: ["ann_key"] }]
                                    }
                                }
                            ]
                        },
                        {
                            element: [
                                {
                                    name: "ann_cat02", label: { title: "모집부문 :" },
                                    editable: { type: "select", data: { memory: "모집부문", unshift: [{ title: "전체", value: "%" }]/*, key: ["ann_key"]*/ } }
                                },
                                {
                                    name: "ann_cat01", label: { title: "경력구분 :" },
                                    editable: { type: "select", data: { memory: "경력" } }
                                }
                            ]
                        },
                        {
                            element: [
                                {
                                    name: "app_nm", label: { title: "이름 : " },
                                    editable: { type: "text", size: 10, maxlength: 5 }
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
        gw_com_module.formCreate(args);

        //==== Main Grid : 면접 대상자
        var args = {
            targetid: "grdList_Main", query: "HRM_8150_1", title: "면접 대상자",
            height: 265, caption: true, show: true, selectable: true, number: true,
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
                { name: "ann_key", hidden: true },
                { name: "ann_seq", hidden: true },
                { name: "app_key", hidden: true },
                { name: "rec_status", hidden: true },
                { name: "emp_no", hidden: true }
            ]
        };
        gw_com_module.gridCreate(args);

        //==== Sub Grid : 면접 단계별 결과
        var args = {
            targetid: "grdList_Sub", query: "HRM_8150_2", title: "결과",
            height: 65, caption: true, show: true, selectable: true, number: true,
            element: [
                { header: "구분", name: "itv_tp", width: 60, align: "center" },
                { header: "결과", name: "result_cd", width: 50, align: "center" },
                { header: "시행일", name: "itv_date", width: 50, align: "center", mask: "date-ymd" },
                { header: "확정일", name: "set_date", width: 50, align: "center", mask: "date-ymd" },
                { header: "통지일", name: "inf_date", width: 90, align: "center", mask: "date-ymd" },
                { header: "비고", name: "rmk", width: 200 },
                { name: "ann_key", hidden: true },
                { name: "ann_seq", hidden: true },
                { name: "app_key", hidden: true },
                { name: "itv_seq", hidden: true }
            ]
        };
        gw_com_module.gridCreate(args);

        //==== Resize Objects
        var args = {
            target: [
				{ type: "GRID", id: "grdList_Main", offset: 8 },
				{ type: "GRID", id: "grdList_Sub", offset: 8 }
            ]
        };
        gw_com_module.objResize(args);

        gw_com_module.informSize();

    },

    //==== manage process. (program section)
    procedure: function () {

        //==== Button Click : Main 조회, 추가, 수정, 출력(납품서), 라벨(라벨출력), 닫기 ====
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: viewOption };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "job1", event: "click", handler: processPopup };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "job2", event: "click", handler: processPopup };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "job3", event: "click", handler: processPopup };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "job4", event: "click", handler: processPopup };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: closeOption };
        gw_com_module.eventBind(args);

        //==== Grid Events :
        var args = { targetid: "grdList_Main", grid: true, event: "rowselected", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_Main", grid: true, event: "rowdblclick", handler: processPopupDetail };
        gw_com_module.eventBind(args);
        //----------

        ////==== Other Object Events :
        //var args = { targetid: "lyrTab", event: "tabselect", handler: processTabChange };
        //gw_com_module.eventBind(args);
        ////----------

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
function processPopup(param) {

    if (gw_com_api.getSelectedRow("grdList_Main", false) == null) return;
    var rec_status = gw_com_api.getValue("grdList_Main", "selected", "rec_status", true);
    switch (param.element) {
        case "job1":
            if (!(rec_status == "81" || rec_status == "82" || rec_status == "92")) {
                gw_com_api.messageBox([
                    { text: "[<b>1차 면접</b>] 가능한 상태가 아닙니다." },
                    { text: "※ 서류합격, 1차면접합격, 2차면접합격" }
                ]);
                return false;
            }
            v_global.logic.ivt_seq = 1;
            break;
        case "job2":
            if (!(rec_status == "82" || rec_status == "83" || rec_status == "93")) {
                gw_com_api.messageBox([
                    { text: "[<b>2차 면접</b>] 가능한 상태가 아닙니다.<br>" },
                    { text: "※ 1차면접합격, 2차면접합격, 2차면접불합격" }
                ]);
                return false;
            }
            v_global.logic.ivt_seq = 2;
            break;
        case "job3":
            if (!(rec_status == "83" || rec_status == "89" || rec_status == "99")) {
                gw_com_api.messageBox([
                    { text: "[<b>채용확정</b>] 가능한 상태가 아닙니다.<br>" },
                    { text: "※ 2차면접합격, 채용확정, 채용취소" }
                ]);
                return false;
            }
            v_global.logic.ivt_seq = 8;
            break;
        case "job4":
            if (!(rec_status == "89" || rec_status == "99")) {
                gw_com_api.messageBox([
                    { text: "[<b>채용취소</b>] 가능한 상태가 아닙니다.<br>" },
                    { text: "※ 채용확정, 채용취소" }
                ]);
                return false;
            }
            v_global.logic.ivt_seq = 9;
            break;
        default:
            return false;
            break;
    }
    v_global.logic.ann_key = gw_com_api.getValue("grdList_Main", "selected", "ann_key", true);
    v_global.logic.ann_seq = gw_com_api.getValue("grdList_Main", "selected", "ann_seq", true);
    v_global.logic.app_key = gw_com_api.getValue("grdList_Main", "selected", "app_key", true);

    var args = {
        type: "PAGE", page: "HRM_8151", title: "면접결과등록",
        width: 1100, height: 420, scroll: true, open: true, control: true, locate: ["center", "top"]
    };

    if (gw_com_module.dialoguePrepare(args) == false) {
        args.param = {
            ID: gw_com_api.v_Stream.msg_openedDialogue,
            data: {
                ann_key: v_global.logic.ann_key,
                ann_seq: v_global.logic.ann_seq,
                app_key: v_global.logic.app_key,
                itv_seq: v_global.logic.ivt_seq
            }
        };
        gw_com_module.dialogueOpen(args);
    }

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
                    { name: "ann_key", argument: "arg_ann_key" },
                    { name: "ann_cat01", argument: "arg_ann_cat01" },
                    { name: "ann_cat02", argument: "arg_ann_cat02" },
                    { name: "app_nm", argument: "arg_app_nm" },
                ],
                remark: [
                    { element: [{ name: "ann_key" }] },
                    { element: [{ name: "ann_cat01" }] },
                    { element: [{ name: "ann_cat02" }] },
                    { element: [{ name: "app_nm" }] }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_Main", select: true }
            ],
            clear: [
                { type: "FORM", id: "grdList_Sub" }
            ],
            key: param.key,
            handler: { complete: processRetrieveEnd, param: param }
        };
    } else if (param.object == "grdList_Main" || param.sub) {
        args = {
            source: {
                type: "GRID", id: "grdList_Main", row: "selected",
                element: [
                    { name: "ann_key", argument: "arg_ann_key" },
                    { name: "ann_seq", argument: "arg_ann_seq" },
                    { name: "app_key", argument: "arg_app_key" }
                ],
            },
            target: [
                { type: "GRID", id: "grdList_Sub", select: true }
            ],
            key: param.key,
            handler: { complete: processRetrieveEnd, param: param }
        };

    } else {

    }
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {
}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdList_Main" },
            { type: "GRID", id: "grdList_Sub" }
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
function processPopupDetail(param) {

    var ann_key = gw_com_api.getValue(param.object, param.row, "ann_key", true);
    var url = "../Job/" + (ann_key < "ANN2015-0005" ? "HRM_8121" : "HRM_8121_1") + ".aspx";
    var args = "ann_key=" + ann_key +
        "&ann_seq=" + gw_com_api.getValue(param.object, param.row, "ann_seq", true) +
        "&app_key=" + gw_com_api.getValue(param.object, param.row, "app_key", true);

    window.open(url + "?" + args, "응시정보", "scrollbars=no,resizable=yes,menubar=no,toolbar=no,width=1200,height=630");

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
                    case "HRM_8151":
                        {
                            args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                            args.data = {
                                ann_key: v_global.logic.ann_key,
                                ann_seq: v_global.logic.ann_seq,
                                app_key: v_global.logic.app_key,
                                itv_seq: v_global.logic.ivt_seq
                            };
                        }
                        break;
                    case "w_upload_recruit":
                        {
                            args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                            args.data = {
                                user: gw_com_module.v_Session.USR_ID,
                                key: v_global.logic.ann_key
                            };
                        }
                        break;
                    case "HRM_8121":
                    case "HRM_8121_1":
                        {
                            args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                            args.data = {
                                ann_key: v_global.logic.ann_key,
                                ann_seq: v_global.logic.ann_seq,
                                app_key: v_global.logic.app_key
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
                    case "HRM_8151":
                        {
                            if (param.data != undefined) {
                                var key = [{
                                    KEY: [
                                        { NAME: "ann_key", VALUE: v_global.logic.ann_key },
                                        { NAME: "ann_seq", VALUE: v_global.logic.ann_seq },
                                        { NAME: "app_key", VALUE: v_global.logic.app_key }
                                    ],
                                    QUERY: "HRM_8150_1"
                                }];
                                processRetrieve({ master: true, key: key });
                            }
                        }
                        break;
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