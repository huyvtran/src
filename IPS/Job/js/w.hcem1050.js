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
        var args = {
            request: [
                {
                    type: "PAGE", name: "대분류", query: "dddw_model_class_1"
                },
                {
                    type: "PAGE", name: "중분류", query: "dddw_model_class_2"
                },
                {
                    type: "PAGE", name: "소분류", query: "dddw_model_class_3"
                },
                {
                    type: "PAGE", name: "화폐", query: "dddw_mat_monetary_unit"
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

        var args = {
            targetid: "lyrMenu_1",
            type: "FREE",
            element: [
				{
				    name: "조회",
				    value: "조회",
				    act: true
				},
				{
				    name: "추가",
				    value: "추가"
				},
				{
				    name: "삭제",
				    value: "삭제"
				},
				{
				    name: "저장",
				    value: "저장"
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
            targetid: "lyrMenu_2",
            type: "FREE",
            element: [
                {
                    name: "그룹적용",
                    value: "그룹적용",
                    icon: "실행"
                },
                {
                    name: "그룹해제",
                    value: "그룹해제",
                    icon: "실행"
                },
                {
                    name: "추가",
                    value: "추가"
                },
				{
				    name: "삭제",
				    value: "삭제"
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
            show: true,
            editable: {
                bind: "open",
                focus: "cust_name",
                validate: true
            },
            remark: "lyrRemark",
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "cust_name",
                                label: {
                                    title: "고객사 :"
                                },
                                mask: "search",
                                editable: {
                                    type: "text",
                                    size: 16,
                                    maxlength: 50
                                }
                            },
				            {
				                name: "model_class1",
				                value: "%",
				                label: {
				                    title: "대분류 :"
				                },
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "대분류",
				                        unshift: [
				                            { title: "전체", value: "%" }
				                        ]
				                    },
				                    change: [
					                    {
					                        name: "model_class2",
					                        memory: "중분류",
					                        key: [
							                    "model_class1"
						                    ]
					                    },
                                        {
                                            name: "model_class3",
                                            memory: "소분류",
                                            key: [
							                    "model_class1",
                                                "model_class2"
						                    ]
                                        }
				                    ]
				                }
				            },
				            {
				                name: "model_class2",
				                value: "%",
				                label: {
				                    title: "중분류 :"
				                },
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "중분류",
				                        unshift: [
				                            { title: "전체", value: "%" }
				                        ],
				                        key: [
							                "model_class1"
						                ]
				                    },
				                    change: [
					                    {
					                        name: "model_class3",
					                        memory: "소분류",
					                        key: [
							                    "model_class1",
                                                "model_class2"
						                    ]
					                    }
				                    ]
				                }
				            },
				            {
				                name: "model_class3",
				                value: "%",
				                label: {
				                    title: "소분류 :"
				                },
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "소분류",
				                        unshift: [
				                            { title: "전체", value: "%" }
				                        ],
				                        key: [
							                "model_class1",
                                            "model_class2"
						                ]
				                    }
				                }
				            },
                            {
                                name: "cust_cd",
                                hidden: true
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
            show: false,
            margin: 6,
            content: {
                row: [
                    {
                        align: "center",
                        element: [
				            {
				                name: "자재",
				                value: "자재 검색",
				                format: {
				                    type: "button",
				                    icon: "검색"
				                }
				            },
                            {
                                name: "내역",
                                value: "견적내역 검색",
                                format: {
                                    type: "button",
                                    icon: "검색"
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
            targetid: "grdData_정보",
            query: "w_hcem1050_M_1",
            title: "모델 정보",
            caption: true,
            height: 138,
            show: true,
            selectable: true,
            editable: {
                master: true,
                bind: "select",
                focus: "model_nm",
                validate: true
            },
            element: [
                {
                    header: "고객사",
                    name: "cust_name",
                    width: 200,
                    align: "left",
                    mask: "search",
                    display: true,
                    editable: {
                        bind: "create",
                        type: "text",
                        validate: {
                            rule: "required",
                            message: "모델명"
                        }
                    }
                },
				{
				    header: "모델명",
				    name: "model_nm",
				    width: 250,
				    align: "left",
				    mask: "search",
				    editable: {
				        bind: "create",
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "모델명"
				        }
				    }
				},
				{
				    header: "순번",
				    name: "model_seq",
				    width: 40,
				    align: "center",
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    header: "비고",
				    name: "rmk",
				    width: 300,
				    align: "left",
				    editable: {
				        type: "text"
				    }
				},
				{
				    header: "등록자",
				    name: "ins_usr",
				    width: 70,
				    align: "center"
				},
				{
				    header: "등록일시",
				    name: "ins_dt",
				    width: 160,
				    align: "center"
				},
				{
				    name: "cust_cd",
				    hidden: true,
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    name: "model_class1",
				    hidden: true,
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    name: "model_class2",
				    hidden: true,
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    name: "model_class3",
				    hidden: true,
				    editable: {
				        type: "hidden"
				    }
				}
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_내역",
            query: "w_hcem1050_D_1",
            title: "세부 내역",
            height: 545,
            caption: true,
            number: true,
            show: true,
            selectable: true,
            group: [
                { element: "title_div2", show: true, summary: true }
            ],
            nogroup: true,
            editable: {
                bind: "select",
                focus: "title_div2",
                validate: true
            },
            element: [
                {
                    header: "분류",
                    name: "title_div2",
                    width: 150,
                    align: "left",
                    editable: {
                        type: "text",
                        validate: {
                            rule: "required",
                            message: "분류"
                        }
                    }
                },
				{
				    header: "품목코드",
				    name: "mat_cd",
				    width: 100,
				    align: "center",
				    editable: {
				        type: "hidden"
				    },
				    summary: { title: "  ▶ 소계" }
				},
				{
				    header: "품명",
				    name: "mat_nm",
				    width: 200,
				    align: "left",
				    editable: {
				        type: "text"
				    }
				},
				{
				    header: "규격",
				    name: "mat_spec",
				    width: 200,
				    align: "left",
				    editable: {
				        type: "text"
				    }
				}/*,
				{
				    header: "단위",
				    name: "mat_unit",
				    width: 50,
				    align: "center",
				    editable: {
				        type: "text"
				    }
				},
				{
				    header: "화폐",
				    name: "monetary_unit",
				    width: 50,
				    align: "center",
				    format: {
				        type: "select",
				        data: {
				            memory: "화폐"
				        }
				    },
				    editable: {
				        type: "select",
				        data: {
				            memory: "화폐"
				        }
				    }
				}*/,
				{
				    header: "수량",
				    name: "item_qty",
				    width: 60,
				    align: "right",
				    mask: "numeric-float",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "수량"
				        }
				    },
				    summary: { type: "sum" }
				},
				{
				    header: "거래처",
				    name: "mat_maker",
				    width: 100,
				    align: "center",
				    editable: {
				        type: "text"
				    }
				},
				{
				    header: "비고",
				    name: "rmk",
				    width: 300,
				    align: "left",
				    editable: {
				        type: "text"
				    }
				},
				{
				    name: "sort_num",
				    hidden: true,
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    name: "title_div1",
				    hidden: true,
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    name: "cust_cd",
				    hidden: true,
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    name: "model_class1",
				    hidden: true,
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    name: "model_class2",
				    hidden: true,
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    name: "model_class3",
				    hidden: true,
				    editable: {
				        type: "hidden"
				    }
				},
                {
                    name: "model_seq",
                    hidden: true,
                    editable: {
                        type: "hidden"
                    }
                },
                {
                    name: "item_seq",
                    hidden: true,
                    editable: {
                        type: "hidden"
                    }
                }
			]
        };
        //----------
        //gw_com_module.sheetCreate(args);
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
				{
				    type: "GRID",
				    id: "grdData_정보",
				    offset: 8
				},
				{
				    type: "GRID",
				    id: "grdData_내역",
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

        gw_job_process.procedure();

    },
    //#endregion

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage process. (programmable section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //#region
    procedure: function () {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // define event.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        var args = {
            targetid: "lyrMenu_1",
            element: "조회",
            event: "click",
            handler: click_lyrMenu_1_조회
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_1",
            element: "추가",
            event: "click",
            handler: click_lyrMenu_1_추가
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_1",
            element: "저장",
            event: "click",
            handler: click_lyrMenu_1_저장
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_1",
            element: "삭제",
            event: "click",
            handler: click_lyrMenu_1_삭제
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_1",
            element: "닫기",
            event: "click",
            handler: click_lyrMenu_1_닫기
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_2",
            element: "그룹적용",
            event: "click",
            handler: click_lyrMenu_2_그룹적용
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_2",
            element: "그룹해제",
            event: "click",
            handler: click_lyrMenu_2_그룹해제
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_2",
            element: "추가",
            event: "click",
            handler: click_lyrMenu_2_추가
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_2",
            element: "삭제",
            event: "click",
            handler: click_lyrMenu_2_삭제
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
            handler: click_frmOption_1_취소
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption_1",
            event: "itemdblclick",
            handler: itemdblclick_frmOption_1
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption_1",
            event: "itemkeyenter",
            handler: itemdblclick_frmOption_1
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption_2",
            element: "자재",
            event: "click",
            handler: click_frmOption_2_자재
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption_2",
            element: "내역",
            event: "click",
            handler: click_frmOption_2_내역
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_정보",
            grid: true,
            event: "rowselecting",
            handler: rowselecting_grdData_정보
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_정보",
            grid: true,
            event: "rowselected",
            handler: rowselected_grdData_정보
        };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_1_조회(ui) {

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
        //----------
        function click_lyrMenu_1_추가(ui) {

            var args = { ID: gw_com_api.v_Stream.msg_linkPage,
                to: { type: "MAIN" },
                data: { page: "w_hcem1052", title: "모델내역 등록" }
            }
            gw_com_module.streamInterface(args);

        }
        //----------
        function click_lyrMenu_1_삭제(ui) {

            if (!checkManipulate({})) return;

            v_global.process.handler = processRemove;

            checkRemovable({});

        }
        //----------
        function click_lyrMenu_1_저장(ui) {

            closeOption({});

            processSave();

        }
        //----------
        function click_lyrMenu_1_닫기(ui) {

            checkClosable({});

        }
        //----------
        function click_lyrMenu_2_그룹적용(ui) {

            if (!checkManipulate({})) return;
            if (!checkbeGroup({})) return;
            if (!checkUpdatable({ check: true })) return false;

            $("#grdData_내역_data").jqGrid('groupingGroupBy', "title_div2");
            gw_com_api.hide(ui.object, ui.element);
            gw_com_api.show(ui.object, "그룹해제");

        }
        //----------
        function click_lyrMenu_2_그룹해제(ui) {

            if (!checkManipulate({})) return;

            $("#grdData_내역_data").jqGrid('groupingRemove', true);
            gw_com_api.hide(ui.object, ui.element);
            gw_com_api.show(ui.object, "그룹적용");

        }
        //----------
        function click_lyrMenu_2_추가(ui) {

            closeOption({ target: ["frmOption_1"] });
            var args = {
                target: [
					{
					    id: "frmOption_2"
					}
				]
            };
            gw_com_module.objToggle(args);

        }
        //----------
        function click_lyrMenu_2_삭제(ui) {

            if (!checkManipulate({})) return;

            var args = {
                targetid: "grdData_내역",
                row: "selected"
            }
            gw_com_module.gridDelete(args);

        }
        //---------
        function click_frmOption_1_실행(ui) {

            v_global.process.handler = processRetrieve;

            if (!checkUpdatable({})) return false;

            processRetrieve({});

        }
        //----------
        function click_frmOption_1_취소(ui) {

            closeOption({});

        }
        //----------
        function itemdblclick_frmOption_1(ui) {

            switch (ui.element) {
                case "cust_name":
                    {
                        v_global.event.type = ui.type;
                        v_global.event.object = ui.object;
                        v_global.event.row = ui.row;
                        v_global.event.element = ui.element;
                        var args = {
                            type: "PAGE",
                            page: "w_find_cust_info",
                            title: "고객사 검색",
                            width: 700,
                            height: 420,
                            locate: ["center", "top"],
                            open: true
                        };
                        if (gw_com_module.dialoguePrepare(args) == false) {
                            var args = {
                                page: "w_find_cust_info",
                                param: {
                                    ID: gw_com_api.v_Stream.msg_selectCusromer
                                }
                            };
                            gw_com_module.dialogueOpen(args);
                        }
                    }
                    break;
            }

        }
        //----------
        function click_frmOption_2_자재() {

            if (!checkManipulate({})) return;

            var args = {
                type: "PAGE",
                page: "w_find_mat",
                title: "자재 검색",
                width: 790,
                height: 850,
                open: true
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = {
                    page: "w_find_mat",
                    param: {
                        ID: gw_com_api.v_Stream.msg_selecttoEstimate
                    }
                };
                gw_com_module.dialogueOpen(args);
            }

        }
        //----------
        function click_frmOption_2_내역() {

            if (!checkManipulate({})) return;

            var args = {
                type: "PAGE",
                page: "w_find_est_detail",
                title: "견적내역 검색",
                width: 900,
                height: 870,
                open: true
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = {
                    page: "w_find_est_detail",
                    param: {
                        ID: gw_com_api.v_Stream.msg_selectPreEstimate
                    }
                };
                gw_com_module.dialogueOpen(args);
            }

        }
        //----------
        function rowselecting_grdData_정보(ui) {

            v_global.process.handler = processSelect;
            v_global.process.current.master = ui.row;

            return checkUpdatable({});

        }
        //----------
        function rowselected_grdData_정보(ui) {

            v_global.process.prev.master = ui.row;

            processLink({});

        };

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_api.hide("lyrMenu_2", "그룹해제");
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
function checkCRUD(param) {

    return gw_com_api.getCRUD("grdData_정보", "selected", true);

}
//----------
function checkManipulate(param) {

    closeOption({});

    if (checkCRUD({}) == "none") {
        gw_com_api.messageBox([
            { text: "NOMASTER" }
        ]);
        return false;
    }
    return true;

}
//----------
function checkbeGroup(param) {

    closeOption({});

    return ((gw_com_api.getRowCount("grdData_내역") > 0) ? true : false);

}
//----------
function checkUpdatable(param) {

    closeOption({});

    var args = {
        check: param.check,
        target: [
			{
			    type: "GRID",
			    id: "grdData_정보"
			},
			{
			    type: "GRID",
			    id: "grdData_내역"
			}
		]
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function checkRemovable(param) {

    closeOption({});

    var status = checkCRUD({});
    if (status == "initialize" || status == "create")
        processDelete({});
    else
        gw_com_api.messageBox([
            { text: "REMOVE" }
        ], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO");

}
//----------
function checkClosable(param) {

    closeOption({});

    v_global.process.handler = processClose;

    if (!checkUpdatable({})) return;

    processClose({});

}
//----------
function processRetrieve(param) {

    var args = {
        target: [
	        {
	            type: "FORM",
	            id: "frmOption_1"
	        }
        ]
    };
    if (gw_com_module.objValidate(args) == false) {
        processClear({ master: true });
        return false;
    }

    var args = {
        source: {
            type: "FORM",
            id: "frmOption_1",
            hide: true,
            element: [
				{
				    name: "cust_name",
				    argument: "arg_cust_name"
				},
				{
				    name: "model_class1",
				    argument: "arg_model_class1"
				},
				{
				    name: "model_class2",
				    argument: "arg_model_class2"
				},
				{
				    name: "model_class3",
				    argument: "arg_model_class3"
				}
			],
            remark: [
		        {
		            element: [{ name: "cust_name"}]
		        },
		        {
		            element: [{ name: "model_class1"}]
		        },
		        {
		            element: [{ name: "model_class2"}]
		        },
		        {
		            element: [{ name: "model_class3"}]
		        }
		    ]
        },
        target: [
			{
			    type: "GRID",
			    id: "grdData_정보",
			    select: true
			}
		],
        clear: [
			{
			    type: "GRID",
			    id: "grdData_내역"
			}
		],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {

    var args = {
        source: {
            type: "GRID",
            id: "grdData_정보",
            row: "selected",
            block: true,
            element: [
				{
				    name: "cust_cd",
				    argument: "arg_cust_cd"
				},
				{
				    name: "model_class1",
				    argument: "arg_model_class1"
				},
				{
				    name: "model_class2",
				    argument: "arg_model_class2"
				},
				{
				    name: "model_class3",
				    argument: "arg_model_class3"
				},
				{
				    name: "model_seq",
				    argument: "arg_model_seq"
				}
			]
        },
        target: [
			{
			    type: "GRID",
			    id: "grdData_내역"
			}
		],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processSelect(param) {

    gw_com_api.selectRow("grdData_정보", v_global.process.current.master, true, false);

}
//----------
function processDelete(param) {

    var args = {
        targetid: "grdData_정보",
        row: "selected",
        remove: true,
        clear: [
            {
                type: "GRID",
                id: "grdData_내역"
            }
        ]
    };
    gw_com_module.gridDelete(args);

}
//----------
function processSave(param) {

    var args = {
        target: [
			{
			    type: "GRID",
			    id: "grdData_정보"
			},
			{
			    type: "GRID",
			    id: "grdData_내역"
			}
		]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args.handler = {
        success: successSave
    };
    gw_com_module.objSave(args);

}
//----------
function processRemove(param) {

    var args = {
        url: "COM",
        target: [
		    {
		        type: "GRID",
		        id: "grdData_정보",
		        key: [
		            {
		                row: "selected",
		                element: [
		                    { name: "cust_cd" },
                            { name: "model_class1" },
                            { name: "model_class2" },
                            { name: "model_class3" },
                            { name: "model_seq" }
		                ]
		            }
		        ]
		    }
	    ],
        handler: {
            success: successRemove
        }
    };
    gw_com_module.objRemove(args);

}
//----------
function processRestore(param) {

    var args = {
        targetid: "grdData_정보",
        row: v_global.process.prev.master
    };
    gw_com_module.gridRestore(args);

}
//----------
function processClear(param) {

    var args = {
        target: [
            {
                type: "GRID",
                id: "grdData_내역"
            }
        ]
    };
    if (param.master)
        args.target.unshift({
            type: "GRID",
            id: "grdData_정보"
        });
    gw_com_module.objClear(args);

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
function successSave(response, param) {

    var status = checkCRUD({});
    if (status == "create" || status == "update")
        processRetrieve({ key: response });
    else
        processLink({ key: response });

}
//----------
function successRemove(response, param) {

    processDelete({});

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
                    case gw_com_api.v_Message.msg_confirmSave:
                        {
                            if (param.data.result == "YES")
                                processSave({});
                            else {
                                var status = checkCRUD({});
                                if (status == "initialize" || status == "create")
                                    processDelete({});
                                else if (status == "update")
                                    processRestore({});
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
                }
            }
            break;
        case gw_com_api.v_Stream.msg_selectedCustomer:
            {
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "cust_cd",
			                        param.data.cust_cd,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "cust_name",
			                        param.data.cust_name,
			                        (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedtoEstimate:
            {
                $.each(param.data.rows, function (i) {
                    var args = {
                        targetid: "grdData_내역",
                        edit: true,
                        updatable: true,
                        data: [
                            { name: "cust_cd", value: gw_com_api.getValue("grdData_정보", "selected", "cust_cd", true) },
                            { name: "model_class1", value: gw_com_api.getValue("grdData_정보", "selected", "model_class1", true) },
                            { name: "model_class2", value: gw_com_api.getValue("grdData_정보", "selected", "model_class2", true) },
                            { name: "model_class3", value: gw_com_api.getValue("grdData_정보", "selected", "model_class3", true) },
                            { name: "model_seq", value: gw_com_api.getValue("grdData_정보", "selected", "model_seq", true) },
                            { name: "title_div1", value: this.title_div1 },
                            { name: "title_div2", value: this.title_div2 },
                            { name: "mat_cd", value: this.mat_cd },
                            { name: "mat_nm", value: this.mat_nm },
                            { name: "mat_spec", value: this.mat_spec },
                            { name: "item_qty", value: "1" },
                            { name: "mat_maker", value: this.mat_maker },
                            { name: "sort_num", value: "0" }
                        ]
                    };
                    gw_com_module.gridInsert(args);
                });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedPreEstimate:
            {
                $.each(param.data.rows, function (i) {
                    var args = {
                        targetid: "grdData_내역",
                        edit: true,
                        updatable: true,
                        data: [
                            { name: "cust_cd", value: gw_com_api.getValue("grdData_정보", "selected", "cust_cd", true) },
                            { name: "model_class1", value: gw_com_api.getValue("grdData_정보", "selected", "model_class1", true) },
                            { name: "model_class2", value: gw_com_api.getValue("grdData_정보", "selected", "model_class2", true) },
                            { name: "model_class3", value: gw_com_api.getValue("grdData_정보", "selected", "model_class3", true) },
                            { name: "model_seq", value: gw_com_api.getValue("grdData_정보", "selected", "model_seq", true) },
                            { name: "title_div1", value: this.title_div1 },
                            { name: "title_div2", value: this.title_div2 },
                            { name: "mat_cd", value: this.mat_cd },
                            { name: "mat_nm", value: this.mat_nm },
                            { name: "mat_spec", value: this.mat_spec },
                            { name: "item_qty", value: this.item_qty },
                            { name: "mat_maker", value: this.mat_maker },
                            { name: "sort_num", value: "0" }
                        ]
                    };
                    gw_com_module.gridInsert(args);
                });
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = {
                    to: {
                        type: "POPUP",
                        page: param.from.page
                    }
                };
                switch (param.from.page) {
                    case "w_find_cust_info":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectCusromer;
                        }
                        break;
                    case "w_find_mat":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selecttoEstimate;
                        }
                        break;
                    case "w_find_est_detail":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectPreEstimate;
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