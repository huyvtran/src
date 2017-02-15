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
        var args = {
            request: [
                {
                    type: "INLINE", name: "경력",
                    data: [
                        { title: "-", value: "" },
                        { title: "신입", value: "1" },
                        { title: "경력", value: "2" }
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
            gw_com_module.startPage();

            var args = { ID: gw_com_api.v_Stream.msg_openedDialogue };
            gw_com_module.streamInterface(args);

            v_global.logic.login_cnt = 0;
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
            targetid: "frmLogin", type: "FREE", title: "Login",
            trans: true, border: true, show: true,
            editable: { focus: "app_nm", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "ann_seq", label: { title: "경력구분 : " },
                                editable: { type: "select", data: { memory: "경력" }, validate: { rule: "required" } }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "app_nm", label: { title: "이&nbsp;&nbsp;&nbsp;&nbsp;름 : " },
                                editable: { type: "text", maxlength: 10, size: 10, validate: { rule: "required" } }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "app_birth_date", label: { title: "생년월일 : " }, mask: "date-ymd",
                                editable: { type: "text", maxlength: 10, validate: { rule: "required" } }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "app_email", label: { title: "E-Mail : " },
                                editable: { type: "text", maxlength: 60, size: 20, validate: { rule: "required" } }
                            }
                        ]
                    },
                    //{
                    //    element: [
				    //        {
				    //            style: { colfloat: "floating" }, name: "app_reg_no_1", label: { title: "주민번호 :" },
				    //            editable: { type: "text", maxlength: 6, size: 7, validate: { rule: "required" } }
				    //        },
				    //        {
				    //            name: "app_reg_no_2", label: { title: "-" }, editable: { type: "text", maxlength: 7, size: 13, validate: { rule: "required" } },
				    //            encrypt: true
				    //        }
                    //    ]
                    //},
                    {
                        element: [
                            {
                                name: "pw", label: { title: "비밀번호 : " },
                                editable: { type: "text", size: 15, validate: { rule: "required" } }, encrypt: true
                            }
                        ]
                    },
                    {
                        element: [
                            { name: "실행", value: "확인", act: true, format: { type: "button" } },
                            { name: "닫기", value: "취소", format: { type: "button" } }
                        ], align: "right"
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_APPLICANT", query: "HRM_8009_1", title: "",
            show: false,
            element: [
                { name: "ann_key", hidden: true },
                { name: "ann_seq", hidden: true },
                { name: "app_key", hidden: true },
                { name: "app_nm", hidden: true },
                { name: "rec_status", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
				{ type: "FORM", id: "frmLogin", offset: 8 }
			]
        };
        //----------
        gw_com_module.objResize(args);

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
        var args = { targetid: "frmLogin", element: "실행", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmLogin", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //----------

    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function processRetrieve(param) {

    var args = { target: [{ type: "FORM", id: "frmLogin" }] };
    if (gw_com_module.objValidate(args) == false) return false;

    // Retrieve
    args = {
        source: {
            type: "FORM", id: "frmLogin",
            element: [
                { name: "ann_seq", argument: "arg_ann_seq" },
                { name: "app_nm", argument: "arg_app_nm" },
                //{ name: "app_reg_no_1", argument: "arg_app_reg_no_1" },
                //{ name: "app_reg_no_2", argument: "arg_app_reg_no_2" },
                { name: "app_birth_date", argument: "arg_app_birth_date" },
                { name: "app_email", argument: "arg_app_email" },
                { name: "pw", argument: "arg_pw" }
            ],
            argument: [
                { name: "arg_ann_key", value: v_global.logic.ann_key }
            ]
        },
        target: [
            { type: "GRID", id: "grdList_APPLICANT" }
        ],
        handler: { complete: processRetrieveEnd, param: param }
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {

    v_global.logic.login_cnt++;
    var cnt = gw_com_api.getRowCount("grdList_APPLICANT");
    if (cnt == 0) {
        if (v_global.logic.login_cnt >= 3) {
            alert("응시내역이 존재하지 않습니다.\n프로그램을 종료합니다.");
            processClose({});
        } else {
            alert("응시내역이 존재하지 않습니다.");
        }
    } else if (cnt > 1) {
        alert("응시자 정보 오류입니다.\n관리자에게 문의바랍니다.");
        processClose({});
    } else {
        var args = {};
        if (gw_com_api.getValue("grdList_APPLICANT", 1, "rec_status", true) >= "1") {
            alert("제출된 지원서는 수정할 수 없습니다.");
        } else {
            args = {
                data: {
                    ann_key: gw_com_api.getValue("grdList_APPLICANT", 1, "ann_key", true),
                    ann_seq: gw_com_api.getValue("grdList_APPLICANT", 1, "ann_seq", true),
                    app_key: gw_com_api.getValue("grdList_APPLICANT", 1, "app_key", true)
                }
            };
        }
        processClose(args);
    }

}
//----------
function processClear(param) {

    var args = {
        target: [
			{ type: "FORM", id: "frmLogin" }
		]
    };
    gw_com_module.objClear(args);

}
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closeDialogue,
        data: param.data
    };
    gw_com_module.streamInterface(args);

}
//----------

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                v_global.process.init = true;
                gw_com_api.enable("frmLogin", "ann_seq", 1);
                if (param.data.ann_seq == undefined || param.data.ann_seq == "") {
                    gw_com_api.setFocus("frmLogin", 1, "ann_seq");
                } else {
                    gw_com_api.setValue("frmLogin", 1, "ann_seq", param.data.ann_seq);
                    $("#frmLogin_ann_seq").change();
                    gw_com_api.disable("frmLogin", "ann_seq", 1);
                    gw_com_api.setFocus("frmLogin", 1, "app_nm");
                }
                v_global.logic.ann_key = param.data.ann_key;
                v_global.logic.ann_seq = param.data.ann_seq;

            }
            break;
        case gw_com_api.v_Stream.msg_resultMessage: {
            if (param.data.page != gw_com_api.getPageID()) break;

            switch (param.data.ID) {
                case gw_com_api.v_Message.msg_informSaved: {
                    param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                } break;
            }
        } break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//