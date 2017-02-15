//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 납품 현황
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
                    type: "INLINE", name: "작성",
                    data: [
                        { title: "전체", value: "%" },
                        { title: "작성중", value: "0" },
                        { title: "제출", value: "1" }
                    ]
                },
                {
                    type: "INLINE", name: "성별",
                    data: [{ title: "남", value: "1" }, { title: "여", value: "0" }]
                },
                {
                    type: "PAGE", name: "모집부문", query: "DDDW_CM_CODE",  //DDDW_ANN_CAT02
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

            //// ann_key => ann_cat02 필터 적용
            //$("#frmOption_ann_key").change();
        }
    },

    // manage UI. (design section)
    UI: function () {

        //==== Main Menu : 조회, 닫기
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "조회", value: "조회", act: true },
                { name: "출력", value: "출력" },
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
                                    name: "ann_seq", label: { title: "경력구분 :" },
                                    editable: { type: "select", data: { memory: "경력" } }
                                }
                            ]
                        },
                        {
                            element: [
                                {
                                    name: "rec_status", label: { title: "작성상태 :" },
                                    editable: { type: "select", data: { memory: "작성" } }
                                },
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

        //==== Main Grid : 응시자목록
        var args = {
            targetid: "grdData_Main", query: "HRM_8120_M", title: "응시자 목록",
            height: 450, show: true, selectable: true, number: true, multi: true, checkrow: true, // dynamic: true,
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
                { header: "제출여부", name: "rec_status_nm", width: 50, align: "center" },
                { name: "ann_key", hidden: true },
                { name: "ann_seq", hidden: true },
                { name: "app_key", hidden: true }
            ]
        };
        gw_com_module.gridCreate(args);

        //==== File Download Layer
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);

        //==== Resize Objects
        var args = {
            target: [
				{ type: "GRID", id: "grdData_Main", offset: 8 }
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
        var args = { targetid: "lyrMenu", element: "출력", event: "click", handler: processExport };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //----------

        //==== Button Click : Search Option ====
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: viewOption };
        gw_com_module.eventBind(args);

        //==== Grid Events : Main
        var args = { targetid: "grdData_Main", grid: true, event: "rowdblclick", handler: processPopupDetail };
        gw_com_module.eventBind(args);
        //----------
    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function viewOption() {
    var args = { target: [{ id: "frmOption", focus: true }] };
    gw_com_module.objToggle(args);
}
//----------
function processRetrieve(param) {

    // Validate Inupt Options
    var args = { target: [{ type: "FORM", id: "frmOption" }] };
    if (gw_com_module.objValidate(args) == false) return false;

    // Retrieve 
    var args = {
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
				{ name: "ann_key", argument: "arg_ann_key" },
                { name: "ann_seq", argument: "arg_ann_seq" },
                { name: "ann_cat02", argument: "arg_ann_cat02" },
                { name: "rec_status", argument: "arg_rec_status" },
                { name: "app_nm", argument: "arg_app_nm" }
            ],
            remark: [
		        { element: [{ name: "ann_key" }] },
		        { element: [{ name: "ann_seq" }] },
		        { element: [{ name: "ann_cat02" }] },
		        { element: [{ name: "rec_status" }] },
                { element: [{ name: "app_nm" }] }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_Main" } //, focus: true, select: true }
        ],
        handler_complete: processRetrieveEnd
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
function processPopupDetail(param) {

    var url = "../Job/HRM_8121.aspx";
    var args = "ann_key=" + gw_com_api.getValue(param.object, param.row, "ann_key", true) +
        "&ann_seq=" + gw_com_api.getValue(param.object, param.row, "ann_seq", true) +
        "&app_key=" + gw_com_api.getValue(param.object, param.row, "app_key", true);

    window.open(url + "?" + args, "응시정보", "scrollbars=no,resizable=yes,menubar=no,toolbar=no,width=1200,height=630");

}
//----------
function processExport(param) {

    var reg = /[\\\/\:\*\?\<\>\|\"]/g;
    var ids = gw_com_api.getSelectedRow("grdData_Main", true);
    if (ids.length < 1) {
        gw_com_api.messageBox([{ text: "선택된 대상이 없습니다." }]);
        return;
    }

    var ann_key = gw_com_api.getValue("frmOption", 1, "ann_key");
    var app_key = "";
    $.each(ids, function () {
        if (app_key.length > 0)
            app_key += ",";

        app_key += gw_com_api.getCellValue("GRID", "grdData_Main", this, "app_key");
    });

    var args = {
        //source: {
        //    type: "INLINE", json: true,
        //    argument: [
        //        { name: "arg_ann_key", value: ann_key },
        //        { name: "arg_app_key", value: app_key } //app_key.replace(/,/gi, "','") }
        //    ]
        //},
        option: [
            { name: "PRINT", value: "xls" },
            { name: "PAGE", value: gw_com_module.v_Current.window },
            { name: "USER", value: gw_com_module.v_Session.USR_ID },
            { name: "ANNKEY", value: ann_key },
            { name: "APPKEY", value: app_key },
            { name: "ANNTITLE", value: gw_com_api.getText("frmOption", 1, "ann_key").replace(reg, "") }, //$("#frmOption_ann_key option:selected").text() },
            { name: "ANNCAT01", value: gw_com_api.getText("frmOption", 1, "ann_seq").replace(reg, "") },
            { name: "ANNCAT02", value: gw_com_api.getText("frmOption", 1, "ann_cat02").replace(reg, "") }
        ],
        target: { type: "FILE", id: "lyrDown", name: "입사지원서" }
    };
    gw_com_module.objExport(args);

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = { to: { type: "POPUP", page: param.from.page } };

                switch (param.from.page) {
                    case "HRM_8121":
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
                closeDialogue({ page: param.from.page });
            }
            break;

    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//