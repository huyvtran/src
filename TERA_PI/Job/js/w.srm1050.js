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
				    name: "조회",
				    value: "조회",
				    act: true
				},
				{
				    name: "수요납기등록",
				    value: "수요납기등록",
				    icon: "추가"
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
            targetid: "frmOption",
            type: "FREE",
            title: "조회 조건",
            trans: true,
            show: true,
            border: true,
            editable: {
                focus: "ymd_fr",
                validate: true
            },
            remark: "lyrRemark",
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "pur_no",
                                label: {
                                    title: "요청번호 : "
                                },
                                editable: {
                                    type: "text",
                                    size: 10,
                                    maxlength: 20
                                }
                            },
				            {
				                style: {
				                    colfloat: "floating"
				                },
				                name: "ymd_fr",
				                label: {
				                    title: "납기요구일 :"
				                },
				                mask: "date-ymd",
				                editable: {
				                    type: "text",
				                    size: 7,
				                    maxlength: 10
				                }
				            },
				            {
				                name: "ymd_to",
				                label: {
				                    title: "~"
				                },
				                mask: "date-ymd",
				                editable: {
				                    type: "text",
				                    size: 7,
				                    maxlength: 10
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
            targetid: "grdData_현황",
            query: "w_srm1050_M_1",
            title: "프로젝트 현황",
            height: 431,
            number: true,
            show: true,
            selectable: true,
            key: true,
            element: [
				{
				    header: "상태",
				    name: "proj_no",
				    width: 50,
				    align: "center"
				},
				{
				    header: "요청번호",
				    name: "proj_no",
				    width: 100,
				    align: "center"
				},
				{
				    header: "제품유형",
				    name: "proj_no",
				    width: 100,
				    align: "center"
				},
				{
				    header: "Process",
				    name: "proj_no",
				    width: 100,
				    align: "center"
				},
				{
				    header: "품목수",
				    name: "item_qty",
				    width: 60,
				    align: "center",
				    fix: {
				        mask: "numeric-int",
				        color: {
				            by: "cancel_yn",
				            to: "#909090"
				        }
				    }
				},
				{
				    header: "납기미등록",
				    name: "no_regist",
				    width: 70,
				    align: "center",
				    fix: {
				        mask: "numeric-int",
				        color: {
				            by: "cancel_yn",
				            to: "#909090"
				        }
				    }
				},
				{
				    header: "납기요구일",
				    name: "req_date",
				    width: 160,
				    align: "center",
				    fix: {
				        color: {
				            by: "cancel_yn",
				            to: "#909090"
				        }
				    }
				},
				{
				    header: "최종전송일시",
				    name: "checked_dt",
				    width: 160,
				    align: "center",
				    fix: {
				        color: {
				            by: "cancel_yn",
				            to: "#909090"
				        }
				    }
				},
				{
				    header: "최종확인일시",
				    name: "checked_dt",
				    width: 160,
				    align: "center",
				    fix: {
				        color: {
				            by: "cancel_yn",
				            to: "#909090"
				        }
				    }
				}
            ],
				subgrid: {
				    query: "w_srm1030_4",
				    height: "100%",
				    argument: [
			        { name: "pur_no", argument: "arg_pur_no" }
			    ],
				    element: [
				    {
				        header: "품번",
				        name: "item_cd",
				        width: 70,
				        align: "center"
				    },
				    {
				        header: "품명",
				        name: "item_nm",
				        width: 200,
				        align: "left"
				    },
				    {
				        header: "규격",
				        name: "item_spec",
				        width: 200,
				        align: "left"
				    },
				    {
				        header: "Project",
				        name: "proj_no",
				        width: 70,
				        align: "center"
				    },
				    {
				        header: "Pallet No.",
				        name: "pallet",
				        width: 80,
				        align: "center"
				    },
				    {
				        header: "납기요구일",
				        name: "req_date",
				        width: 80,
				        align: "center",
				        mask: "date-ymd"
				    },
				    {
				        header: "발주수량",
				        name: "pur_qty",
				        width: 60,
				        align: "center",
				        mask: "numeric-int"
				    },
				    {
				        header: "단위",
				        name: "pur_unit",
				        width: 40,
				        align: "center"
				    },
				    {
				        header: "준수수량",
				        name: "plan_qty",
				        width: 60,
				        align: "center",
				        mask: "numeric-int"
				    },
				    {
				        header: "미준수수량",
				        name: "delay_qty",
				        width: 70,
				        align: "center",
				        mask: "numeric-int"
				    },
				    {
				        header: "납품가능일",
				        name: "plan_date",
				        width: 160,
				        align: "center",
				        mask: "date-ymd"
				    }
			    ]
			}
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
				{
				    type: "GRID",
				    id: "grdData_현황",
				    offset: 8
				}
			]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        //----------
        gw_com_module.informSize();

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // go next.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
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
            element: "조회",
            event: "click",
            handler: click_lyrMenu_조회
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu",
            element: "수요납기등록",
            event: "click",
            handler: click_lyrMenu_납기등록
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu",
            element: "닫기",
            event: "click",
            handler: click_lyrMenu_닫기
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption",
            element: "실행",
            event: "click",
            handler: click_frmOption_실행
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption",
            element: "취소",
            event: "click",
            handler: click_frmOption_취소
        };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_조회(ui) {

            var args = {
                target: [
					{
					    id: "frmOption",
					    focus: true
					}
				]
            };
            gw_com_module.objToggle(args);

        }
        //----------
        function click_lyrMenu_납기등록(ui) {

            if (!checkManipulate({})) return;

            openPage({ page: "w_srm1055", title: "프로젝트 납기 등록" });

        }
        //----------
        function click_lyrMenu_닫기(ui) {

            processClose({});

        }
        //----------
        function click_frmOption_실행(ui) {

            processRetrieve({});

        }
        //----------
        function click_frmOption_취소(ui) {

            closeOption({});

        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -1 }));
        gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate(""));
        //----------
        gw_com_module.startPage();

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

    if (gw_com_api.getSelectedRow("grdData_현황") == null) {
        gw_com_api.messageBox([
            { text: "NOMASTER" }
        ]);
        return false;
    }
    return true;

}
//----------
function processRetrieve(param) {

    var args = {
        target: [
	        {
	            type: "FORM",
	            id: "frmOption"
	        }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    var args = {
        source: {
            type: "FORM",
            id: "frmOption",
            hide: true,
            element: [
                {
                    name: "ymd_fr",
                    argument: "arg_ymd_fr"
                },
                {
                    name: "ymd_to",
                    argument: "arg_ymd_to"
                }
            ],
            argument: [
                {
                    name: "arg_supp_cd",
                    value: gw_com_module.v_Session.EMP_NO
                }
			],
            remark: [
                {
                    infix: "~",
                    element: [
                        { name: "ymd_fr" },
                        { name: "ymd_to" }
                    ]
                }
            ]
        },
        target: [
			{
			    type: "GRID",
			    id: "grdData_현황",
			    select: true,
			    focus: true
			}
		],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closePage
    };
    gw_com_module.streamInterface(args);

}
//----------
function openPage(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_linkPage,
        to: {
            type: "MAIN"
        },
        data: {
            page: param.page,
            title: param.title,
            param: [
                { name: "proj_no", value: gw_com_api.getValue("grdData_현황", "selected", "proj_no", true) }
            ]
        }
    };
    gw_com_module.streamInterface(args);

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_resultMessage:
            {
                if (param.data.page != gw_com_api.getPageID())
                    break;
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//