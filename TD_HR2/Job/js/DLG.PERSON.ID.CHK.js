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
            editable: { focus: "person_id", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "person_id", label: { title: "주민번호 뒷자리 : " },
                                editable: { type: "text", maxlength: 7, size: 10, validate: { rule: "required" } }, encrypt: true
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
            targetid: "grdList_PERSON", query: "DLG_PERSON_ID_CHK", title: "",
            show: false,
            element: [
                { name: "emp_no", hidden: true }
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
                { name: "person_id", argument: "arg_person_id" }
            ],
            argument: [
                { name: "arg_emp_no", value: gw_com_module.v_Session.EMP_NO }
            ]
        },
        target: [
            { type: "GRID", id: "grdList_PERSON" }
        ],
        handler: { complete: processRetrieveEnd, param: param }
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {

    v_global.logic.login_cnt++;
    var cnt = gw_com_api.getRowCount("grdList_PERSON");
    if (cnt == 0) {
        if (v_global.logic.login_cnt >= 3) {
            alert("3회 이상 정보를 잘못 입력했습니다.\n프로그램을 종료합니다.");
            processClose({});
        } else {
            alert("정보가 존재하지 않습니다.");
        }
    } else {
        var args = {
            data: {
                emp_no: gw_com_api.getValue("grdList_PERSON", 1, "emp_no", true)
            }
        };
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
    gw_com_api.setValue("frmLogin", 1, "person_id", "");

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
                gw_com_api.setFocus("frmLogin", 1, "person_id");
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