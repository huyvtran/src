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

        start();
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

            v_global.logic.err_cnt = 0;
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
            targetid: "frmData_MAIN", query: "USER_BY_ID", type: "TABLE", title: "비밀번호 변경",
            show: true, selectable: true, fixed: true, caption: false,
            editable: { bind: "select", focus: "password_chk", validate: true },
            content: {
                width: { label: 45, field: 55 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "현재 비밀번호", format: { type: "label" } },
                            {
                                name: "password_chk", encrypt: true,
                                editable: { type: "text", maxlength: 20, width: 122, validate: { rule: "required", message: "이전 비밀번호" } }
                            },
                            { name: "passwd", editable: { type: "hieden" }, hidden: true },
                            { name: "user_id", editable: { type: "hieden" }, hidden: true }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "변경 비밀번호", format: { type: "label" } },
                            {
                                name: "new_password", encrypt: true,
                                editable: { type: "text", maxlength: 20, width: 122, validate: { rule: "required", message: "새로운 비밀번호" } }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "비밀번호 확인", format: { type: "label" } },
                            {
                                name: "new_password_chk", encrypt: true,
                                editable: { type: "text", maxlength: 20, width: 122, validate: { rule: "required", message: "비밀번호 확인" } }
                            }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "lyrBtn", type: "FREE",
            element: [
				{ name: "저장", value: "확인", act: true },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            target: [
				{ type: "FORM", id: "frmData_MAIN", offset: 8 }
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

        //=====================================================================================
        var args = { targetid: "lyrBtn", element: "저장", event: "click", handler: processSave };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrBtn", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //=====================================================================================

    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function processRetrieve(param) {

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_user_id", value: param.usr_id }
            ]
        },
        target: [
            { type: "FORM", id: "frmData_MAIN", updatable: true, edit: true }
        ],
        handler: { complete: processRetrieveEnd, param: param }
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {

}
//----------
function processSave(param) {

    var args = {
        url: "COM",
        target: [
            { type: "FORM", id: "frmData_MAIN" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    // 기존암호 확인
    var pwd_chk = hex_md5(gw_com_api.getValue("frmData_MAIN", 1, "password_chk"));
    if (gw_com_api.getValue("frmData_MAIN", 1, "passwd") == pwd_chk) {
        
    } else {
        gw_com_api.messageBox([{ text: "잘못된 암호입니다." }], 300);
        gw_com_api.setError(true, "frmData_MAIN", 1, "password_chk");
        ErrCnt();
        return false;
    }

    // 신규암호 확인
    var pass1 = hex_md5(gw_com_api.getValue("frmData_MAIN", 1, "new_password"));
    var pass2 = hex_md5(gw_com_api.getValue("frmData_MAIN", 1, "new_password_chk"));
    if (pass1 == pass2) {
        gw_com_api.setValue("frmData_MAIN", 1, "passwd", pass1);
    } else {
        gw_com_api.messageBox([{ text: "새로운 비밀번호가 일치하지 않습니다." }]);
        gw_com_api.setError(true, "frmData_MAIN", 1, "new_password_chk");
        return false;
    }
    gw_com_api.setError(false, "frmData_MAIN", 1, "password_chk");
    gw_com_api.setError(false, "frmData_MAIN", 1, "new_password_chk");

    args.handler = {
        success: successSave,
        param: param
    };
    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    processClose({});

}
//----------
function processClear(param) {

    var args = {
        target: [
			{ type: "FORM", id: "frmData_MAIN" }
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
    gw_com_api.setValue("frmData_MAIN", 1, "person_id", "");

}
//----------
function ErrCnt() {

    v_global.logic.err_cnt++;
    if (v_global.logic.err_cnt >= 3) {
        gw_com_api.messageBox([{ text: "오류 3회 발생" }, { text: "비밀번호 변경 실패" }]);
        processClose({});
    }

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
                processRetrieve({ usr_id: param.data.usr_id });
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