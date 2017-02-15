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
            show: false,
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
            targetid: "frmOption_1",
            type: "FREE",
            title: "조회 조건",
            trans: true,
            border: true,
            show: true,
            margin: 170,
            editable: {
                bind: "open",
                focus: "model_class_key_nm",
                validate: true
            },
            remark: "lyrRemark",
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "model_class_key_nm",
                                label: {
                                    title: "분류명 :"
                                },
                                mask: "search",
                                editable: {
                                    type: "text",
                                    size: 27,
                                    maxlength: 50
                                }
                            },
                            {
                                name: "model_class_key",
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
            margin: 180,
            content: {
                row: [
                    {
                        align: "center",
                        element: [
				            {
				                name: "자재",
				                value: "자재검색",
				                format: {
				                    type: "button",
                                    icon: "검색"
				                }
				            },
                            {
				                name: "내역",
				                value: "내역검색",
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
            targetid: "grdData_을지목록",
            query: "w_hcem1055_M_1",
            title: "을지 목록",
            height: 400,
            show: true,
            selectable: true,
            editable: {
                master: true,
                bind: "select",
                focus: "model_qty",
                validate: true
            },
            element: [
                {
				    header: "모델명",
				    name: "model_nm",
				    width: 200,
				    align: "left"
				},
				{
				    header: "분류명",
				    name: "model_class_key_nm",
				    width: 300,
				    align: "left",
				    mask: "search",
				    display: true,
				    editable: {
				        bind: "create",
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "분류명"
				        }
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
				    name: "upd_usr",
				    width: 70,
				    align: "center"
				},
				{
				    header: "등록일시",
				    name: "upd_dt",
				    width: 160,
				    align: "center"
				},
				{
				    name: "model_class_key",
				    hidden: true,
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    name: "model_cd",
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
            targetid: "grdData_세부내역서",
            query: "w_hcem1055_M_2",
            title: "세부 내역서",
            height: 400,
            show: true,
            selectable: true,
            group: [
                { element: "title_div_nm", show: true, summary: true } 
            ],
            nogroup: true,
            editable: {
                bind: "select",
                focus: "title_div_nm",
                validate: true
            },
            element: [
                {
                    header: "구분명",
                    name: "title_div_nm",
                    width: 100,
                    align: "left",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "구분명"
				        }
				    },
                },
				{
				    header: "품명",
				    name: "mat_nm",
				    width: 250,
				    align: "left",
				    editable: {
				        type: "hidden"
				    },
				    summary: { title: "  ▶ 소계" }
				},
				{
				    header: "규격",
				    name: "mat_spec",
				    width: 250,
				    align: "left",
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    header: "단위",
				    name: "mat_unit",
				    width: 50,
				    align: "center",
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    header: "화폐",
				    name: "monetary_unit",
				    width: 50,
				    align: "center",
				    editable: {
				        type: "select",
				        data: {
				            memory: "화폐"
				        }
				    }
				},
				{
				    header: "수량",
				    name: "item_qty",
				    width: 50,
				    align: "center",
				    mask: "numeric-int",
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
				    header: "비고",
				    name: "rmk",
				    width: 400,
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
				    name: "mat_cd",
				    hidden: true,
                    editable: {
                        type: "hidden"
                    }
				},
				{
				    name: "title_div",
				    hidden: true
				},
                {
                    name: "item_seq",
                    hidden: true,
                    editable: {
                        type: "hidden"
                    }
                },
				{
				    name: "model_class_key",
				    hidden: true,
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    name: "model_cd",
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
            targetid: "lyrNotice",
            row: [
 				{
 				    name: "모델명"
 				}
			]
        };
        //----------
        gw_com_module.labelCreate(args);
        //=====================================================================================
        var args = {
            tabid: "lyrTab",
            target: [
				{
				    type: "GRID",
				    id: "grdData_을지목록",
				    title: "을지 목록"
				},
				{
				    type: "GRID",
				    id: "grdData_세부내역서",
				    title: "세부 내역서"
				}
			]
        };
        //----------
        gw_com_module.convertTab(args);
        //=====================================================================================
        var args = {
            target: [
				{
				    type: "GRID",
				    id: "grdData_을지목록",
				    offset: 8
				},
				{
				    type: "GRID",
				    id: "grdData_세부내역서",
				    offset: 8
				},
				{
				    type: "TAB",
				    id: "lyrTab",
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
            handler: click_lyrMenu_닫기
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
            element: "저장",
            event: "click",
            handler: click_lyrMenu_1_저장
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
            targetid: "lyrMenu_2",
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
            targetid: "lyrTab",
            event: "tabselect",
            handler: click_lyrTab_tabselect
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_을지목록",
            grid: true,
            event: "rowselecting",
            handler: rowselecting_grdData_을지목록
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_을지목록",
            grid: true,
            event: "rowselected",
            handler: rowselected_grdData_을지목록
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_을지목록",
            grid: true,
            event: "rowdblclick",
            handler: rowdblclick_grdData_을지목록
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_을지목록",
            grid: true,
            event: "itemdblclick",
            handler: itemdblclick_grdData_을지목록
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_을지목록",
            grid: true,
            event: "itemkeyenter",
            handler: itemdblclick_grdData_을지목록
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

            if (!checkManipulate({parent:true})) return;

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
            processSave();

        }
        //----------
        function click_lyrMenu_닫기(ui) {

            checkClosable({});

        }
        //----------
        function click_lyrMenu_2_그룹적용(ui) {

            if (!checkManipulate({})) return;
            if (!checkbeGroup({})) return;
            if (!checkUpdatable({check:true})) return false;

            $("#grdData_세부내역서_data").jqGrid('groupingGroupBy', "title_div_nm");
            gw_com_api.hide(ui.object, ui.element);
            gw_com_api.show(ui.object, "그룹해제");

        }
        //----------
        function click_lyrMenu_2_그룹해제(ui) {

            if (!checkManipulate({})) return;

            $("#grdData_세부내역서_data").jqGrid('groupingRemove', true); 
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
                targetid: "grdData_세부내역서",
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
                case "model_class_key_nm":
                    {
                        v_global.event.type = ui.type;
                        v_global.event.object = ui.object;
                        v_global.event.row = ui.row;
                        v_global.event.element = ui.element;
                        var args = {
                            type: "PAGE",
                            page: "w_find_model_class",
                            title: "제품유형 정보 검색",
                            width: 500,
                            height: 460,
                            open: true
                        };
                        if (gw_com_module.dialoguePrepare(args) == false) {
                            var args = {
                                page: "w_find_model_class",
                                param: {
                                    ID: gw_com_api.v_Stream.msg_selectModelClass/*,
                                    data: {
                                        model_name: gw_com_api.getValue(ui.object, ui.row, ui.element)
                                    }*/
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
                page: "w_find_model",
                title: "자재 검색",
                width: 790,
                height: 510,
                open: true
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = {
                    page: "w_find_model",
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
                height: 510,
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
        function click_lyrTab_tabselect(ui) {

            closeOption({});

            $("#lyrMenu_" + v_global.process.current.tab).hide();
            v_global.process.current.tab = ui.row;
            $("#lyrMenu_" + v_global.process.current.tab).show();

        }
        //----------
        function rowselecting_grdData_을지목록(ui) {

            v_global.process.handler = processSelect;
            v_global.process.current.master = ui.row;

            return checkUpdatable({});

        }
        //----------
        function rowselected_grdData_을지목록(ui) {

            v_global.process.prev.master = ui.row;

            processLink({});

        };
        //----------
        function rowdblclick_grdData_을지목록(ui) {

            gw_com_api.selectTab("lyrTab", 2);

        }
        //----------
        function itemdblclick_grdData_을지목록(ui) {

            switch (ui.element) {
                case "model_class_key_nm":
                    {
                        v_global.event.type = ui.type;
                        v_global.event.object = ui.object;
                        v_global.event.row = ui.row;
                        v_global.event.element = ui.element;
                        var args = {
                            type: "PAGE",
                            page: "w_find_model_class",
                            title: "제품유형 정보 검색",
                            width: 500,
                            height: 460,
                            open: true
                        };
                        if (gw_com_module.dialoguePrepare(args) == false) {
                            var args = {
                                page: "w_find_model_class",
                                param: {
                                    ID: gw_com_api.v_Stream.msg_selectModelClass
                                }
                            };
                            gw_com_module.dialogueOpen(args);
                        }
                    }
                    break;
            }
        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        v_global.logic.model_cd = gw_com_api.getPageParameter("model_cd");
        v_global.logic.model_nm = gw_com_api.getPageParameter("model_nm");
        //----------
        if (v_global.logic.model_cd != "") {
            var args = {
                targetid: "lyrNotice",
                row: [
		            {
		                name: "모델명",
		                value: "▶ 모델명 : " +
                                v_global.logic.model_nm
		            }
	            ]
            };
            gw_com_module.labelAssign(args);
        }
        gw_com_api.hide("lyrMenu_2", "그룹해제");
        //----------
        gw_com_module.startPage();
        //----------
        v_global.process.current.tab = 1;
        if (v_global.logic.model_cd != "")
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
function checkCRUD(param) {

    return gw_com_api.getCRUD("grdData_을지목록", "selected", true);

}
//----------
function checkManipulate(param) {

    closeOption({});

    if (param.parent) {
        if (v_global.logic.model_cd == "") {
            gw_com_api.messageBox([
                { text: "모델이 선택되지 않았습니다." },
                { text: "제품모델 관리 화면에서 모델을 먼저 선택해 주세요." }
            ]);
            return false;
        }
    }
    else {
        if (checkCRUD({}) == "none") {
            gw_com_api.messageBox([
                { text: "NOMASTER" }
            ]);
            return false;
        }
    }
    return true;

}
//----------
function checkbeGroup(param) {

    closeOption({});

    return ((gw_com_api.getRowCount("grdData_세부내역서") > 0) ? true : false);

}
//----------
function checkUpdatable(param) {

    closeOption({});

    var args = {
        check: param.check,
        target: [
			{
			    type: "GRID",
			    id: "grdData_을지목록"
			},
			{
			    type: "GRID",
			    id: "grdData_세부내역서"
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

    closeOption({});

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_model_cd", value: v_global.logic.model_cd },
                { name: "arg_model_class_key", value: gw_com_api.getValue("frmOption_1", 1, "model_class_key") }
            ]
        },
        target: [
			{
			    type: "GRID",
			    id: "grdData_을지목록",
			    select: true
			}
		],
        clear: [
			{
			    type: "GRID",
			    id: "grdData_세부내역서"
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
            id: "grdData_을지목록",
            row: "selected",
            block: true,
            element: [
				{
				    name: "model_cd",
				    argument: "arg_model_cd"
				},
				{
				    name: "model_class_key",
				    argument: "arg_model_class_key"
				}
			]
        },
        target: [
			{
			    type: "GRID",
			    id: "grdData_세부내역서"
			}
		],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processSelect(param) {

    gw_com_api.selectRow("grdData_을지목록", v_global.process.current.master, true, false);

}
//----------
function processInsert(param) {

    var args = {
        targetid: "grdData_을지목록",
        edit: true,
        updatable: true,
        data: [
            { name: "model_cd", value: v_global.logic.model_cd }
        ],
        clear: [
		    {
		        type: "GRID",
		        id: "grdData_세부내역서"
		    }
	    ]
    };
    var row = gw_com_module.gridInsert(args);

    v_global.event.type = "GRID";
    v_global.event.object = "grdData_을지목록";
    v_global.event.row = row;
    v_global.event.element = "model_class_key_nm";
    var args = {
        type: "PAGE",
        page: "w_find_model_class",
        title: "제품유형 정보 검색",
        width: 500,
        height: 460,
        open: true
    };
    if (gw_com_module.dialoguePrepare(args) == false) {
        var args = {
            page: "w_find_model_class",
            param: {
                ID: gw_com_api.v_Stream.msg_selectModelClass
            }
        };
        gw_com_module.dialogueOpen(args);
    }

}
//----------
function processDelete(param) {

    var args = {
        targetid: "grdData_을지목록",
        row: "selected",
        remove: true,
        clear: [
            {
                type: "GRID",
                id: "grdData_세부내역서"
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
			    id: "grdData_을지목록"
			},
			{
			    type: "GRID",
			    id: "grdData_세부내역서"
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
		        id: "grdData_을지목록",
		        key: [
		            {
		                row: "selected",
		                element: [
		                    { name: "model_cd" },
                            { name: "model_class_key" }
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
        targetid: "grdData_을지목록",
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
                id: "grdData_세부내역서"
            }
        ]
    };
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
        case gw_com_api.v_Stream.msg_selectedModelClass:
            {
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "model_class_key",
			                        param.data.class_key,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "model_class_key_nm",
			                        param.data.class_name,
			                        (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedtoEstimate:
            {
                $.each(param.data.rows, function (i) {
                    var args = {
                        targetid: "grdData_세부내역서",
                        edit: true,
                        updatable: true,
                        data: [
                            { name: "model_cd", value: gw_com_api.getValue("grdData_을지목록", "selected", "model_cd", true) },
                            { name: "model_class_key", value: gw_com_api.getValue("grdData_을지목록", "selected", "model_class_key", true) },
                            { name: "sort_num", value: "0" },
                            { name: "mat_cd", value: this.mat_cd },
                            { name: "mat_nm", value: this.mat_nm },
                            { name: "mat_spec", value: this.mat_spec },
                            { name: "mat_unit", value: this.mat_unit },
                            { name: "monetary_unit", value: this.mat_monetary_unit },
                            { name: "title_div_nm", value: this.title_div_nm }
                        ]
                    };
                    if (this.item_qty != undefined)
                        args.data.push({
                            name: "item_qty", value: this.item_qty
                        });
                    gw_com_module.gridInsert(args);

                });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedPreEstimate:
            {
                $.each(param.data.rows, function (i) {
                    var args = {
                        targetid: "grdData_세부내역서",
                        edit: true,
                        updatable: true,
                        data: [
                            { name: "model_cd", value: gw_com_api.getValue("grdData_을지목록", "selected", "model_cd", true) },
                            { name: "model_class_key", value: gw_com_api.getValue("grdData_을지목록", "selected", "model_class_key", true) },
                            { name: "sort_num", value: "0" },
                            { name: "mat_cd", value: this.mat_cd },
                            { name: "mat_nm", value: this.mat_nm },
                            { name: "mat_spec", value: this.mat_spec },
                            { name: "mat_unit", value: this.mat_unit },
                            { name: "monetary_unit", value: this.monetary_unit },
                            { name: "item_qty", value: this.item_qty },
                            { name: "rmk", value: this.rmk },
                            { name: "title_div_nm", value: this.title_div_nm }
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
                    case "w_find_model_class":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectModelClass;
                            args.data = {
                                model_name: gw_com_api.getValue(
                                                v_global.event.object,
                                                v_global.event.row,
                                                v_global.event.element,
			                                    (v_global.event.type == "GRID") ? true : false)
                            };
                        }
                        break;
                    case "w_find_model":
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