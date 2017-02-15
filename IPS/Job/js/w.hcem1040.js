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
                    type: "PAGE",
                    name: "분류",
                    query: "dddw_mat_catagorize"
                },
                {
                    type: "PAGE",
                    name: "종류",
                    query: "dddw_mat_part"
                },
                {
                    type: "PAGE",
                    name: "화폐",
                    query: "dddw_mat_monetary_unit"
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

        //=====================================================================================
        var args = {
            targetid: "lyrMenu_1",
            type: "FREE",
            element: [
                {
                    name: "ERP",
                    value: "ERP자재정보 연동",
                    icon: "실행"
                },
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
				    name: "저장",
				    value: "저장"
				},
				{
				    name: "삭제",
				    value: "삭제"
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
				    name: "추가",
				    value: "이력 생성",
				    icon: "추가"
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
            targetid: "frmOption",
            type: "FREE",
            trans: true,
            border: true,
            show: true,
            editable: {
                bind: "open",
                focus: "mat_cd",
                validate: true
            },
            remark: "lyrRemark",
            content: {
                row: [
				    {
				        element: [
                            {
                                name: "mat_cd",
                                label: {
                                    title: "품목코드 :"
                                },
                                editable: {
                                    type: "text",
                                    size: 9,
                                    maxlength: 20
                                }
                            },
				            {
				                name: "mat_categorize",
				                label: {
				                    title: "분류 :"
				                },
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "분류",
				                        unshift: [
				                            { title: "전체", value: "%" }
				                        ]
				                    }
				                }
				            },
				            {
				                name: "mat_part",
				                label: {
				                    title: "종류 :"
				                },
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "종류",
				                        unshift: [
				                            { title: "전체", value: "%" }
				                        ]
				                    }
				                }
				            }
				        ]
				    },
                    {
                        element: [
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
				            },
				            {
				                name: "mat_monetary_unit",
				                label: {
				                    title: "화폐 :"
				                },
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "화폐",
				                        unshift: [
				                            { title: "전체", value: "%" }
				                        ]
				                    }
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
            query: "w_hcem1040_M_1",
            title: "자재 현황",
            caption: true,
            height: 137,
            dynamic: true,
            show: true,
            selectable: true,
            element: [
		        {
		            header: "품목코드",
		            name: "mat_cd",
		            width: 90,
		            align: "center"
		        },
		        {
		            header: "품명",
		            name: "mat_nm",
		            width: 200,
		            align: "left"
		        },
		        {
		            header: "규격",
		            name: "mat_spec",
		            width: 200,
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
		            align: "center",
		            format: {
		                type: "select",
		                data: {
		                    memory: "화폐"
		                }
		            }
		        },
		        {
		            header: "단가",
		            name: "mat_price",
		            width: 100,
		            align: "right",
		            mask: "currency-float"
		        },
		        {
		            header: "거래처",
		            name: "mat_maker",
		            width: 180,
		            align: "left"
		        }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_상세",
            query: "w_hcem1040_S_1",
            type: "TABLE",
            title: "자재 정보",
            caption: true,
            show: true,
            selectable: true,
            editable: {
                bind: "select",
                focus: "mat_categorize",
                validate: true
            },
            content: {
                width: {
                    label: 100,
                    field: 200
                },
                row: [
                    {
                        element: [
                            {
                                header: true,
                                value: "품목코드",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "mat_cd",
                                editable: {
                                    type: "hidden"
                                }
                            },
                            {
                                header: true,
                                type: "label",
                                value: "종류",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "mat_part_nm"
                            },
                            {
                                header: true,
                                type: "label",
                                value: "분류",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "mat_categorize",
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "분류"
                                    },
                                    validate: {
                                        rule: "required",
                                        message: "분류"
                                    }
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "품명",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "mat_nm",
                                editable: {
                                    type: "text",
                                    validate: {
                                        rule: "required",
                                        message: "품명"
                                    }
                                }
                            },
                            {
                                header: true,
                                value: "규격",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "mat_spec",
                                editable: {
                                    type: "text"
                                }
                            },
                            {
                                header: true,
                                value: "단위",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "mat_unit",
                                editable: {
                                    type: "text"
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "화폐",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "mat_monetary_unit",
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "화폐"
                                    },
                                    validate: {
                                        rule: "required",
                                        message: "화폐"
                                    }
                                }
                            },
                            {
                                header: true,
                                value: "단가",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "mat_price",
                                mask: "currency-float",
                                editable: {
                                    type: "text",
                                    validate: {
                                        rule: "required",
                                        message: "단가"
                                    }
                                }
                            },
                            {
                                header: true,
                                value: "거래처",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "mat_maker",
                                editable: {
                                    type: "text"
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "특기사항",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                style: { colspan: 5 },
                                name: "rmk",
                                format: {
                                    type: "textarea",
                                    rows: 3,
                                    width: 796
                                },
                                editable: {
                                    type: "textarea",
                                    rows: 3,
                                    width: 796
                                }
                            },
                            {
                                name: "mat_part",
                                hidden: true,
                                editable: {
                                    type: "hidden"
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
            targetid: "grdData_이력",
            query: "w_hcem1040_S_2",
            title: "단가 이력",
            caption: true,
            height: 68,
            pager: false,
            show: true,
            selectable: true,
            editable: {
                multi: true,
                bind: "select",
                focus: "cdate",
                validate: true
            },
            element: [
		        {
		            header: "변경일자",
		            name: "cdate",
		            width: 80,
		            align: "center",
		            mask: "date-ymd",
		            editable: {
		                type: "hidden"
		            }
		        },
		        {
		            header: "이전화폐",
		            name: "pre_monetary_unit",
		            width: 60,
		            align: "center",
		            format: {
		                type: "text"
		            },
		            editable: {
		                type: "hidden"
		            }
		        },
		        {
		            header: "이전단가",
		            name: "pre_price",
		            width: 100,
		            align: "right",
		            mask: "currency-float",
		            editable: {
		                type: "hidden"
		            }
		        },
		        {
		            header: "변경화폐",
		            name: "cur_monetary_unit",
		            width: 60,
		            align: "center",
		            editable: {
		                type: "hidden"
		            }
		        },
		        {
		            header: "변경단가",
		            name: "cur_price",
		            width: 100,
		            align: "right",
		            mask: "currency-float",
		            editable: {
		                type: "hidden"
		            }
		        },
		        {
		            header: "사유",
		            name: "reason",
		            width: 400,
		            align: "left",
		            editable: {
		                bind: "create",
		                type: "text"
		            }
		        },
		        {
		            header: "등록자",
		            name: "upd_usr",
		            width: 70,
		            align: "center"
		        },
		        {
		            name: "seq",
		            hidden: true,
		            editable: {
		                type: "hidden"
		            }
		        },
		        {
		            name: "mat_cd",
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
            target: [
				{
				    type: "GRID",
				    id: "grdData_현황",
				    offset: 8
				},
                {
                    type: "FORM",
                    id: "frmData_상세",
                    offset: 8
                },
				{
				    type: "GRID",
				    id: "grdData_이력",
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
            targetid: "lyrMenu_1",
            element: "ERP",
            event: "click",
            handler: click_lyrMenu_1_ERP
        };
        gw_com_module.eventBind(args);
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
            element: "삭제",
            event: "click",
            handler: click_lyrMenu_1_삭제
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
            element: "닫기",
            event: "click",
            handler: click_lyrMenu_1_닫기
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
        //----------
        var args = {
            targetid: "grdData_현황",
            grid: true,
            event: "rowselecting",
            handler: rowselecting_grdData_현황
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_현황",
            grid: true,
            event: "rowselected",
            handler: rowselected_grdData_현황
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmData_상세",
            event: "itemchanged",
            handler: itemchanged_frmData_상세
        };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_1_ERP(ui) {

            v_global.process.handler = processBatch;

            if (!checkUpdatable({})) return false;

            checkBatchable({});

        }
        //----------
        function click_lyrMenu_1_조회(ui) {

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
        function click_lyrMenu_1_추가(ui) {

            v_global.process.handler = processInsert;

            if (!checkUpdatable({})) return;

            processInsert({});

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
            processSave({});

        }
        //----------
        function click_lyrMenu_1_닫기(ui) {

            checkClosable({});

        }
        //----------
        function click_lyrMenu_2_추가(ui) {

            if (!checkManipulate()) return;
            if (!checkUpdatable({ sub: true })) return;

            var args = {
                targetid: "grdData_이력",
                edit: true,
                updatable: true,
                where: {
                    type: "first"
                },
                data: [
                    { name: "cdate", value: gw_com_api.getDate() },
                    { name: "pre_monetary_unit", 
                      value: (gw_com_api.getSelectedRow("grdData_현황") != null) 
                                ? gw_com_api.getValue("grdData_현황", "selected", "mat_monetary_unit", true) : "" },
                    { name: "pre_price", 
                      value: (gw_com_api.getSelectedRow("grdData_현황") != null) 
                                ? gw_com_api.getValue("grdData_현황", "selected", "mat_price", true) : "" },
                    { name: "cur_monetary_unit", value: gw_com_api.getValue("frmData_상세", "selected", "mat_monetary_unit") },
                    { name: "cur_price", value: gw_com_api.getValue("frmData_상세", "selected", "mat_price") }
                ]
            };
            v_global.logic.row = gw_com_module.gridInsert(args);

        }
        //----------
        function click_lyrMenu_2_삭제(ui) {

            if (!checkManipulate()) return;

            var args = {
                targetid: "grdData_이력",
                row: "selected"
            }
            gw_com_module.gridDelete(args);

        }
        //---------
        function click_frmOption_실행(ui) {

            v_global.process.handler = processRetrieve;

            if (!checkUpdatable({})) return false;

            processRetrieve({});

        }
        //----------
        function click_frmOption_취소(ui) {

            closeOption({});

        }
        //----------
        function rowselecting_grdData_현황(ui) {

            v_global.process.handler = processSelect;
            v_global.process.current.master = ui.row;

            return checkUpdatable({});

        }
        //----------
        function rowselected_grdData_현황(ui) {

            v_global.process.prev.master = ui.row;

            processLink({});

        };
        //----------
        function itemchanged_frmData_상세(ui) {

            if (v_global.logic.row != null) {
                switch (ui.element) {
                    case "mat_monetary_unit":
                        {

                            gw_com_api.setValue("grdData_이력", v_global.logic.row, "cur_monetary_unit", ui.value.current, true, true);
                        }
                        break;
                    case "mat_price":
                        {
                            gw_com_api.setValue("grdData_이력", v_global.logic.row, "cur_price", ui.value.current, true, true);
                        }
                        break;
                }
                return true;
            }

        };

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_module.startPage();
        //----------
        v_global.logic.row = null;

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

    return gw_com_api.getCRUD("frmData_상세");

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
function checkUpdatable(param) {

    closeOption({});

    var args = {
        target: [
            {
                type: "FORM",
                id: "frmData_상세",
                refer: (param.sub) ? true : false
            },
			{
			    type: "GRID",
			    id: "grdData_이력"
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
        processClear({});
    else
        gw_com_api.messageBox([
            { text: "DELETE" }
        ], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO");

}
//----------
function checkBatchable(param) {

    gw_com_api.messageBox([
            { text: "ERP 신규 자재 정보를 업데이트합니다. 계속 하시겠습니까?" }
        ], 500, gw_com_api.v_Message.msg_confirmBatch, "YESNO");

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
	            id: "frmOption"
	        }
        ]
    };
	if (gw_com_module.objValidate(args) == false) {
	    gw_com_api.show("frmOption");
        processClear({ master: true });
        return false;
    }
    if ((gw_com_api.getValue("frmOption", 1, "mat_categorize") == "0"
            || gw_com_api.getValue("frmOption", 1, "mat_categorize") == "%")
        && gw_com_api.getValue("frmOption", 1, "mat_cd") == ""
        && gw_com_api.getValue("frmOption", 1, "mat_nm") == ""
        && gw_com_api.getValue("frmOption", 1, "mat_spec") == "") {
        gw_com_api.messageBox([
            { text: "품목코드, 품명, 규격 중 한 가지는 반드시 입력하셔야 합니다." }
        ], 480);
        gw_com_api.setError(true, "frmOption", 1, "mat_cd", false, true);
        gw_com_api.setError(true, "frmOption", 1, "mat_nm", false, true);
        gw_com_api.setError(true, "frmOption", 1, "mat_spec", false, true);
        gw_com_api.show("frmOption");
        processClear({ master: true });
        return false;
    }
    gw_com_api.setError(false, "frmOption", 1, "mat_cd", false, true);
    gw_com_api.setError(false, "frmOption", 1, "mat_nm", false, true);
    gw_com_api.setError(false, "frmOption", 1, "mat_spec", false, true);

    if (param.key != undefined) {
        $.each(param.key, function () {
            if (this.QUERY == "w_hcem1040_S_1")
                this.QUERY = "w_hcem1040_M_1";
        });
    }
    var args = {
        source: {
            type: "FORM",
            id: "frmOption",
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
                },
                {
                    name: "mat_monetary_unit",
                    argument: "arg_monetary_unit"
                },
                {
                    name: "mat_categorize",
                    argument: "arg_mat_categorize"
                },
                {
                    name: "mat_part",
                    argument: "arg_mat_part"
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
		        },
		        {
		            element: [{ name: "mat_monetary_unit"}]
		        },
		        {
		            element: [{ name: "mat_categorize"}]
		        },
		        {
		            element: [{ name: "mat_part"}]
		        }
		    ]
        },
        target: [
			{
			    type: "GRID",
			    id: "grdData_현황",
			    select: true
			}
		],
        clear: [
		    {
		        type: "FORM",
		        id: "frmData_상세"
		    },
		    {
		        type: "GRID",
		        id: "grdData_이력"
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
            id: "grdData_현황",
            row: "selected",
            block: true,
            element: [
				{
				    name: "mat_cd",
				    argument: "arg_mat_cd"
				}
			]
        },
        target: [
            {
                type: "FORM",
                id: "frmData_상세"
            },
            {
                type: "GRID",
                id: "grdData_이력"
            }
		],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processSelect(param) {

    gw_com_api.selectRow("grdData_현황", v_global.process.current.master, true, false);

}
//----------
function processInsert(param) {

    gw_com_api.selectRow("grdData_현황", "reset");
    var args = {
        targetid: "frmData_상세",
        edit: true,
        updatable: true,
        data: [
            { name: "mat_part", value: "1" },
            { name: "mat_part_nm", value: "임시" },
            { name: "mat_price", value: "0" }
        ],
        clear: [
		    {
		        type: "GRID",
		        id: "grdData_이력"
		    }
	    ]
    };
    gw_com_module.formInsert(args);

}
//----------
function processDelete(param) {

    var args = {
        targetid: "grdData_현황",
        row: "selected",
        clear: [
            {
                type: "FORM",
                id: "frmData_상세"
            },
            {
                type: "GRID",
                id: "grdData_이력"
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
                type: "FORM",
                id: "frmData_상세"
            },
			{
			    type: "GRID",
			    id: "grdData_이력"
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
        procedure: "PROC_EST_MAT_DELETE",
        nomessage: true,
        input: [
            { name: "mat_cd", value: gw_com_api.getValue("grdData_현황", "selected", "mat_cd", true), type: "varchar" },
            { name: "user", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
        ],
        output: [
            { name: "r_value", type: "int" },
            { name: "message", type: "varchar" }
        ],
        handler: {
            success: completeRemove
        }
    };
    gw_com_module.callProcedure(args);

}
//----------
function processBatch(param) {

    var args = {
        url: "COM",
        procedure: "PROC_GATHER_MAT",
        nomessage: true,
        input: [
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
function processClear(param) {

    var args = {
        target: [
            {
                type: "FORM",
                id: "frmData_상세"
            },
            {
                type: "GRID",
                id: "grdData_이력"
            }
        ]
    };
    if (param.master)
        args.target.unshift({
            type: "GRID",
            id: "grdData_현황"
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

    gw_com_api.hide("frmOption");

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
    if ((status == "create" || status == "update")
        && gw_com_api.getRowCount("grdData_현황") > 0)
        processRetrieve({ key: response });
    else
        processLink({ key: response });

}
//----------
function completeRemove(response, param) {

    gw_com_api.messageBox([
        { text: response.VALUE[1] }
    ], 420, gw_com_api.v_Message.msg_informBatched, "ALERT",
    { handler: successRemove, response: response });

}
//----------
function successRemove(response, param) {

    if (response.VALUE[0] != -1)
        processDelete({});

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

    if (response.VALUE[0] != -1
        && gw_com_api.getRowCount("grdData_현황") > 0) {
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
                    case gw_com_api.v_Message.msg_confirmSave:
                        {
                            if (param.data.result == "YES")
                                processSave({});
                            else {
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
                    case gw_com_api.v_Message.msg_confirmBatch:
                        {
                            if (param.data.result == "YES")
                                processBatch({});
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