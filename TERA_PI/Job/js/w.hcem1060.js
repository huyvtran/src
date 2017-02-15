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
                    name: "고객",
                    value: "고객정보 조회",
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
            title: "조회 조건",
            trans: true,
            border: true,
            margin: 140,
            show: false,
            editable: {
                bind: "open",
                focus: "cust_name",
                validate: true
            },
            remark: "lyrRemark_1",
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "cust_cd",
                                label: {
                                    title: "임시코드 :"
                                },
                                editable: {
                                    type: "text",
                                    size: 6,
                                    maxlength: 15
                                }
                            },
                            {
                                name: "cust_name",
                                label: {
                                    title: "고객사명 :"
                                },
                                editable: {
                                    type: "text",
                                    size: 18,
                                    maxlength: 50
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
            title: "조회 조건",
            trans: true,
            border: true,
            margin: 10,
            show: true,
            remark: "lyrRemark_2",
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "cust_cd",
                                label: {
                                    title: "고객코드 :"
                                },
                                editable: {
                                    type: "text",
                                    size: 8,
                                    maxlength: 15
                                }
                            },
                            {
                                name: "cust_name",
                                label: {
                                    title: "고객사명 :"
                                },
                                editable: {
                                    type: "text",
                                    size: 18,
                                    maxlength: 50
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
            query: "w_hcem1060_M_1",
            title: "임시 정보",
            caption: true,
            width: 320,
            height: 431,
            pager: false,
            show: true,
            selectable: true,
            element: [
                {
                    header: "임시코드",
                    name: "cust_cd",
                    width: 70,
                    align: "center"
                },
                {
                    header: "고객사명",
                    name: "cust_name",
                    width: 240,
                    align: "left"
                },
                {
                    header: "대표자",
                    name: "ceo_name",
                    width: 70,
                    align: "center"
                },
                {
                    header: "주소",
                    name: "address",
                    width: 400,
                    align: "left"
                }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_고객",
            query: "w_hcem1060_M_2",
            title: "고객 정보",
            caption: true,
            height: 431,
            pager: false,
            show: true,
            selectable: true,
            element: [
				{
				    header: "고객코드",
				    name: "cust_cd",
				    width: 80,
				    align: "center"
				},
				{
				    header: "고객사명",
				    name: "cust_name",
				    width: 240,
				    align: "left"
				},
				{
				    header: "대표자",
				    name: "ceo_name",
				    width: 70,
				    align: "center"
				},
				{
				    header: "주소",
				    name: "address",
				    width: 400,
				    align: "left"
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
				    id: "grdData_고객",
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
            element: "고객",
            event: "click",
            handler: click_lyrMenu_고객
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
            targetid: "grdData_고객",
            grid: true,
            event: "rowdblclick",
            handler: rowdblclick_grdData_고객
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
        function click_lyrMenu_고객(ui) {

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
        function rowdblclick_grdData_고객(ui) {

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
        if (gw_com_api.getSelectedRow("grdData_고객") == null) {
            gw_com_api.messageBox([
                { text: "선택된 고객 정보가 없습니다." }
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

    var args = {
        source: {
            type: "FORM",
            id: (param.sub) ? "frmOption_2" : "frmOption_1",
            hide: true,
            element: [
                {
                    name: "cust_cd",
                    argument: "arg_cust_cd"
                },
                {
                    name: "cust_name",
                    argument: "arg_cust_name"
                }
			],
            remark: [
                {
		            element: [{ name: "cust_cd"}]
		        },
		        {
		            element: [{ name: "cust_name"}]
		        }
		    ]
        },
        target: [
			{
			    type: "GRID",
			    id: (param.sub) ? "grdData_고객" : "grdData_임시",
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
        procedure: "PROC_MAPPING_CUST",
        nomessage: true,
        input: [
            { name: "F_code", value: gw_com_api.getValue("grdData_임시", "selected", "cust_cd", true), type: "varchar" },
            { name: "T_code", value: gw_com_api.getValue("grdData_고객", "selected", "cust_cd", true), type: "varchar" },
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