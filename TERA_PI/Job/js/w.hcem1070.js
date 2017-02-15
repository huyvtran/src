//------------------------------------------
// Process about Job Process.
//                Created by Professor.X, GoodWare (2011.04)
//------------------------------------------

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var v_global = {
    event: {
        type: null,
        object: null,
        row: null,
        element: null
    },
    process: {
        param: null,
        entry: null,
        act: null,
        handler: null,
        current: {},
        prev: {}
    },
    logic: {}
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
        start();

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // go next.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function start() {

            gw_job_process.UI();

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
            targetid: "lyrMenu",
            type: "FREE",
            element: [
				{
				    name: "임시",
				    value: "임시정보 조회",
				    icon: "조회",
				    act: true
				},
                {
                    name: "자재",
                    value: "자재정보 조회",
                    icon: "조회"
                },
                {
                    name: "연결",
                    value: "연결",
                    icon: "저장"
                },
				{
				    name: "닫기",
				    value: "닫기"
				}
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption_1",
            type: "FREE",
            trans: true,
            border: true,
            margin: 80,
            show: true,
            editable: {
                bind: "open",
                focus: "mat_cd",
                validate: true
            },
            remark: "lyrRemark_1",
            content: {
                row: [
				    {
				        element: [
                            {
                                name: "mat_cd",
                                label: {
                                    title: "임시코드 :"
                                },
                                editable: {
                                    type: "text",
                                    size: 7,
                                    maxlength: 20
                                }
                            },
				            {
				                name: "mat_nm",
				                label: {
				                    title: "품명 :"
				                },
				                editable: {
				                    type: "text",
				                    size: 12,
				                    maxlength: 20
				                }
				            },
				            {
				                name: "mat_spec",
				                label: {
				                    title: "규격 :"
				                },
				                editable: {
				                    type: "text",
				                    size: 12,
				                    maxlength: 20
				                }
				            }
				        ]
				    },
                    {
                        align: "right",
                        element: [
				            {
				                name: "실행",
				                value: "실행",
				                act: true,
				                format: {
				                    type: "button"
				                }
				            },
				            {
				                name: "취소",
				                value: "취소",
				                format: {
				                    type: "button",
				                    icon: "닫기"
				                }
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
            targetid: "frmOption_2",
            type: "FREE",
            trans: true,
            border: true,
            show: true,
            editable: {
                bind: "open",
                focus: "mat_cd",
                validate: true
            },
            remark: "lyrRemark_2",
            content: {
                row: [
				    {
				        element: [
                            {
                                name: "mat_cd",
                                label: {
                                    title: "자재코드 :"
                                },
                                editable: {
                                    type: "text",
                                    size: 10,
                                    maxlength: 20
                                }
                            },
				            {
				                name: "mat_nm",
				                label: {
				                    title: "품명 :"
				                },
				                editable: {
				                    type: "text",
				                    size: 12,
				                    maxlength: 20
				                }
				            },
				            {
				                name: "mat_spec",
				                label: {
				                    title: "규격 :"
				                },
				                editable: {
				                    type: "text",
				                    size: 12,
				                    maxlength: 20
				                }
				            }
				        ]
				    },
                    {
                        align: "right",
                        element: [
				            {
				                name: "실행",
				                value: "실행",
				                act: true,
				                format: {
				                    type: "button"
				                }
				            },
				            {
				                name: "취소",
				                value: "취소",
				                format: {
				                    type: "button",
				                    icon: "닫기"
				                }
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
            targetid: "grdData_임시",
            query: "w_hcem1070_M_1",
            title: "임시 정보",
            caption: true,
            width: 330,
            height: 431,
            pager: false,
            show: true,
            selectable: true,
            element: [
                {
                    header: "임시코드",
                    name: "mat_cd",
                    width: 70,
                    align: "center",
                    editable: {
                        type: "hidden"
                    }
                },
                {
                    header: "품명",
                    name: "mat_nm",
                    width: 250,
                    align: "left"
                },
                {
                    header: "규격",
                    name: "mat_spec",
                    width: 250,
                    align: "left"
                },
                {
                    header: "단위",
                    name: "mat_unit",
                    width: 50,
                    align: "center"
                },
                {
                    header: "화폐",
                    name: "mat_monetary_unit",
                    width: 50,
                    align: "center"
                }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_자재",
            query: "w_hcem1070_M_2",
            title: "자재 정보",
            caption: true,
            height: 431,
            pager: false,
            show: true,
            selectable: true,
            dynamic: true,
            element: [
				{
				    header: "자재코드",
				    name: "mat_cd",
				    width: 90,
				    align: "center"
				},
                {
                    header: "품명",
                    name: "mat_nm",
                    width: 250,
                    align: "left"
                },
                {
                    header: "규격",
                    name: "mat_spec",
                    width: 250,
                    align: "left"
                },
                {
                    header: "단위",
                    name: "mat_unit",
                    width: 50,
                    align: "center"
                },
                {
                    header: "화폐",
                    name: "mat_monetary_unit",
                    width: 50,
                    align: "center"
                }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
				{
				    type: "GRID",
				    id: "grdData_자재",
				    offset: 8
				}
			]
        };
        //----------
        gw_com_module.objResize(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // go next.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        gw_job_process.procedure();

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

        //----------
        var args = {
            targetid: "lyrMenu",
            element: "임시",
            event: "click",
            handler: click_lyrMenu_임시
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu",
            element: "자재",
            event: "click",
            handler: click_lyrMenu_자재
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu",
            element: "연결",
            event: "click",
            handler: click_lyrMenu_연결
        };
        gw_com_module.eventBind(args);
        //-----------
        var args = {
            targetid: "lyrMenu",
            element: "닫기",
            event: "click",
            handler: click_lyrMenu_닫기
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption_1",
            element: "실행",
            event: "click",
            handler: click_frmOption_1_실행
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption_1",
            element: "취소",
            event: "click",
            handler: click_frmOption_취소
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption_2",
            element: "실행",
            event: "click",
            handler: click_frmOption_2_실행
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption_2",
            element: "취소",
            event: "click",
            handler: click_frmOption_취소
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_자재",
            grid: true,
            event: "rowdblclick",
            handler: rowdblclick_grdData_자재
        };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //---------
        function click_lyrMenu_임시(ui) {

            closeOption({ target: ["frmOption_2"] });
            var args = {
                target: [
					{
					    id: "frmOption_1",
					    focus: true
					}
				]
            };
            gw_com_module.objToggle(args);

        }
        //---------
        function click_lyrMenu_자재(ui) {

            closeOption({ target: ["frmOption_1"] });
            var args = {
                target: [
					{
					    id: "frmOption_2",
					    focus: true
					}
				]
            };
            gw_com_module.objToggle(args);

        }
        //----------
        function click_lyrMenu_연결(ui) {

            if (!checkManipulate({})) return;
            if (!checkManipulate({ sub: true })) return;

            checkBatchable({});

        }
        //----------
        function click_lyrMenu_닫기(ui) {

            processClose({});

        }
        //---------
        function click_frmOption_1_실행(ui) {

            processRetrieve({});

        }
        //----------
        function click_frmOption_취소(ui) {

            closeOption({});

        }
        //---------
        function click_frmOption_2_실행(ui) {

            processRetrieve({ sub: true });

        }
        //----------
        function rowdblclick_grdData_자재(ui) {

            click_lyrMenu_연결({});

        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_module.startPage();
        //----------
        processRetrieve({});

    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
function checkManipulate(param) {

    closeOption({});

    if (param.sub) {
        if (gw_com_api.getSelectedRow("grdData_자재") == null) {
            gw_com_api.messageBox([
                { text: "선택된 자재 정보가 없습니다." }
            ], 350);
            return false;
        }
    }
    else {
        if (gw_com_api.getSelectedRow("grdData_임시") == null) {
            gw_com_api.messageBox([
                { text: "선택된 임시 정보가 없습니다." }
            ], 350);
            return false;
        }
    }
    return true;

}
//----------
function checkBatchable(param) {

    closeOption({});

    gw_com_api.messageBox([
            { text: "해당 코드가 사용된 모든 연관 정보가 함께 업데이트됩니다." },
            { text: "계속 하시겠습니까?" }
        ], 500, gw_com_api.v_Message.msg_confirmBatch, "YESNO");

}
//----------
function processRetrieve(param) {

    var args = {
        target: [
	        {
	            type: "FORM",
	            id: (param.sub) ? "frmOption_2" : "frmOption_1"
	        }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;
    if (param.sub) {
        if (gw_com_api.getValue("frmOption_2", 1, "mat_cd") == ""
                && gw_com_api.getValue("frmOption_2", 1, "mat_nm") == ""
                && gw_com_api.getValue("frmOption_2", 1, "mat_spec") == "") {
            gw_com_api.messageBox([
                    { text: "자재코드, 품명, 규격 중 한 가지는 반드시 입력하셔야 합니다." }
                ], 480);
            gw_com_api.setError(true, "frmOption_2", 1, "mat_cd", false, true);
            gw_com_api.setError(true, "frmOption_2", 1, "mat_nm", false, true);
            gw_com_api.setError(true, "frmOption_2", 1, "mat_spec", false, true);
            return false;
        }
        gw_com_api.setError(false, "frmOption_2", 1, "mat_cd", false, true);
        gw_com_api.setError(false, "frmOption_2", 1, "mat_nm", false, true);
        gw_com_api.setError(false, "frmOption_2", 1, "mat_spec", false, true);
    }

    var args = {
        source: {
            type: "FORM",
            id: (param.sub) ? "frmOption_2" : "frmOption_1",
            hide: true,
            element: [
				{
				    name: "mat_cd",
				    argument: "arg_mat_cd"
				},
				{
				    name: "mat_nm",
				    argument: "arg_mat_nm"
				},
				{
				    name: "mat_spec",
				    argument: "arg_mat_spec"
				}
			],
            remark: [
		        {
		            element: [{ name: "mat_cd"}]
		        },
		        {
		            element: [{ name: "mat_nm"}]
		        },
		        {
		            element: [{ name: "mat_spec"}]
		        }
		    ]
        },
        target: [
			{
			    type: "GRID",
			    id: (param.sub) ? "grdData_자재" : "grdData_임시",
			    select: true
			}
		],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processBatch(param) {

    var args = {
        url: "COM",
        procedure: "PROC_MAPPING_MAT",
        nomessage: true,
        input: [
            { name: "F_code", value: gw_com_api.getValue("grdData_임시", "selected", "mat_cd", true), type: "varchar" },
            { name: "T_code", value: gw_com_api.getValue("grdData_자재", "selected", "mat_cd", true), type: "varchar" },
            { name: "user", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
        ],
        output: [
            { name: "r_value", type: "int" },
            { name: "message", type: "varchar" }
        ],
        handler: {
            success: completeBatch
        }
    };
    gw_com_module.callProcedure(args);

}
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closePage
    };
    gw_com_module.streamInterface(args);

}
//----------
function closeOption(param) {

    if (param.target != undefined) {
        $.each(param.target, function () {
            gw_com_api.hide(this);
        });
    }
    else {
        gw_com_api.hide("frmOption_1");
        gw_com_api.hide("frmOption_2");
    }

}
//----------
function completeBatch(response, param) {

    gw_com_api.messageBox([
        { text: response.VALUE[1] }
    ], 350, gw_com_api.v_Message.msg_informBatched, "ALERT",
    { handler: successBatch, response: response });

}
//----------
function successBatch(response, param) {

    if (response.VALUE[0] != -1) {
        processRetrieve({});
    }

}

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
                    case gw_com_api.v_Message.msg_confirmBatch:
                        {
                            if (param.data.result == "YES")
                                processBatch({});
                        }
                        break;
                    case gw_com_api.v_Message.msg_informBatched:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                }
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//