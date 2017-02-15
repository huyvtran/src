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
				{ type: "PAGE", name: "사업부", query: "dddw_prodgroup" },
				{ type: "PAGE", name: "고객사", query: "dddw_cust" },
                {
                    type: "PAGE", name: "공정구분", query: "dddw_zcode",
                    param: [
                        { argument: "arg_hcode", value: "ISCM26" }
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
				    name: "조회",
				    value: "조회",
				    act: true
				}/*,
				{
				    name: "추가",
				    value: "추가"
				}*/,
				{
				    name: "작성",
				    value: "Check Sheet",
				    icon: "실행"
				},
				{
				    name: "수정",
				    value: "마감(취소)",
				    icon: "실행"
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
				    name: "계산",
				    value: "계획일자 계산",
				    icon: "기타"
				},
				{
				    name: "반영",
				    value: "작업실적 반영",
				    icon: "저장"
				},
                {
                    name: "재생성",
                    value: "공정 재생성",
                    icon: "실행"
                }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = { targetid: "frmOption_1", type: "FREE", title: "조회 조건",
            trans: true, show: true, border: true,
            editable: {
                focus: "ymd_fr",
                validate: true
            },
            remark: "lyrRemark",
            content: {
                row: [
                    { element: [
                            { name: "proj_no",  label: { title: "Project No :" },
                                editable: { type: "text", size: 7, maxlength: 10 }
                            },
                            { style: { colfloat: "floating" }, name: "ymd_fr",  label: { title: "납기일자 :" },
                                mask: "date-ymd",
                                editable: { type: "text", size: 7, maxlength: 10
                                }
                            },
				            { name: "ymd_to", label: { title: "~" },
				                mask: "date-ymd",
				                editable: { type: "text", size: 7, maxlength: 10 }
				            },
				            { name: "prod_group", label: { title: "사업부 :" },
				                editable: { type: "select", data: { memory: "사업부" } }
				            },
				            { name: "cust_cd", label: { title: "고객사 :" },
				                editable: { type: "select",
				                    data: { memory: "고객사", unshift: [ { title: "전체", value: "%" } ] }
				                }
				            }
				        ]
                    },
                    {
                        align: "right",
                        element: [
				            { name: "실행",
				                value: "실행",
				                act: true,
				                format: {
				                    type: "button"
				                }
				            },
				            { name: "취소",
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
            title: "계획일자 계산",
            trans: true,
            show: false,
            border: true,
            margin: 110,
            editable: {
                bind: "open",
                //focus: "ymd",
                validate: true
            },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "ymd",  label: {
                                    title: "계획일자 :"
                                },
                                mask: "date-ymd",
                                editable: { type: "text", size: 7, maxlength: 10,
                                    validate: {
                                        rule: "required",
                                        message: "계획일자"
                                    }
                                }
                            }
				        ]
                    },
                    {
                        align: "right",
                        element: [
				            { name: "실행",
				                value: "실행",
				                act: true,
				                format: {
				                    type: "button"
				                }
				            },
				            { name: "취소",
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
            query: "w_mrp3010_M_1",
            title: "프로젝트 진행 현황",
            caption: true,
            height: 115,
            show: true,
            selectable: true,
            element: [
				{
				    header: "고객사",
				    name: "cust_nm",
				    width: 60,
				    align: "center"
				},
				{
				    header: "제품유형",
				    name: "prod_type",
				    width: 100,
				    align: "center"
				},
				{
				    header: "제품명",
				    name: "prod_nm",
				    width: 200,
				    align: "left"
				},
				{
				    header: "Project No.",
				    name: "proj_no",
				    width: 80,
				    align: "center"
				}/*,
				{
				    header: "영업",
				    name: "sale_stat",
				    width: 50,
				    align: "center"
				},
				{
				    header: "설계",
				    name: "draw_stat",
				    width: 50,
				    align: "center"
				},
				{
				    header: "구매",
				    name: "pur_stat",
				    width: 50,
				    align: "center"
				}*/,
				{
				    header: "생산",
				    name: "prod_stat",
				    width: 50,
				    align: "center"
				},
				{
				    header: "공정진행율",
				    name: "prod_rate",
				    width: 70,
				    align: "center",
				    mask: "numeric-float"
				},
				{
				    header: "납기요청일",
				    name: "due_ymd",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    header: "완료예정일",
				    name: "end_ymd",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    name: "ord_no",
				    hidden: true
				}
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_상세",
            query: "w_mrp3010_S_1",
            title: "공정별 계획 및 실적",
            caption: true,
            height: 545,
            show: true,
            selectable: true,
            editable: {
                multi: true,
                bind: "select",
                focus: "pln_ymd",
                validate: true
            },
            element: [
				{
				    header: "공정구분",
				    name: "mprc_class",
				    width: 90,
				    align: "center",
				    format: {
				        type: "select",
				        data: {
				            memory: "공정구분"
				        }
				    },
				    editable: {
				        bind: "create",
				        type: "select",
				        data: {
				            memory: "공정구분"
				        }/*,
                        disable: true*/
				    }
				},
				{
				    header: "공정코드",
				    name: "mprc_no",
				    width: 60,
				    align: "center",
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    header: "공정명",
				    name: "mprc_nm",
				    width: 240,
				    align: "left",
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    header: "소요시간",
				    name: "mprc_term",
				    width: 55,
				    align: "center",
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    header: "인원",
				    name: "mprc_persons",
				    width: 40,
				    align: "center",
				    mask: "numeric-int",
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    header: "표준소요시간",
				    name: "mprc_times",
				    width: 75,
				    align: "center",
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    header: "표준시작일",
				    name: "mprc_days",
				    width: 65,
				    align: "center",
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    header: "표준가중치",
				    name: "mprc_weight",
				    width: 65,
				    align: "center",
				    mask: "numeric-float",
				    editable: {
				        type: "hidden"
				    }
				},
				{ header: "표준진행율", name: "mprc_rate", width: 65, align: "center", mask: "numeric-float",
				    editable: { type: "hidden" }
				},
				{ header: "공정진행율", name: "real_rate", width: 65, align: "center", mask: "numeric-float",
				    editable: { type: "hidden" }
				},
				{
				    header: "완료예정일",
				    name: "due_ymd",
				    width: 80,
				    align: "center",
				    mask: "date-ymd",
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    header: "완료계획일",
				    name: "pln_ymd",
				    width: 92,
				    align: "center",
				    mask: "date-ymd",
				    editable: {
				        type: "text"
				    }
				},
				{
				    header: "완료실적일",
				    name: "end_ymd",
				    width: 92,
				    align: "center",
				    mask: "date-ymd",
				    editable: {
				        type: "text"
				    }
				},
				{
				    header: "투입인원",
				    name: "real_persons",
				    width: 60,
				    align: "center",
				    mask: "numeric-int",
				    editable: {
				        type: "text"
				    }
				},
				{
				    header: "투입시간",
				    name: "real_times",
				    width: 60,
				    align: "center",
				    editable: {
				        type: "text"
				    }
				},
				{
				    header: "실제시작일",
				    name: "real_days",
				    width: 65,
				    align: "center",
				    editable: {
				        type: "text"
				    }
				},
				{
				    name: "pstat",
				    hidden: true
				},
				{
				    name: "astat",
				    hidden: true
				},
				{
				    name: "sort_seq",
				    hidden: true
				},
				{
				    name: "mprc_cd",
				    hidden: true,
				    editable: { type: "hidden" }
				},
				{
				    name: "ord_no",
				    hidden: true,
				    editable: { type: "hidden" }
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
				    type: "GRID",
				    id: "grdData_상세",
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
            element: "조회",
            event: "click",
            handler: click_lyrMenu_1_조회
        };
        gw_com_module.eventBind(args);
        /*
        //----------
        var args = {
        targetid: "lyrMenu_1",
        element: "추가",
        event: "click",
        handler: click_lyrMenu_1_추가
        };
        gw_com_module.eventBind(args);
        */
        //----------
        var args = {
            targetid: "lyrMenu_1",
            element: "수정",
            event: "click",
            handler: click_lyrMenu_1_수정
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
        //----------
        var args = { targetid: "lyrMenu_1", element: "작성", event: "click", handler: click_lyrMenu_작성 };
        gw_com_module.eventBind(args);
        function click_lyrMenu_작성(ui) {
        	
		    if (gw_com_api.getSelectedRow("grdData_현황") == null) {
		        gw_com_api.messageBox([ { text: "선택된 대상이 없습니다." } ], 300);
		        return false;
		    }
		
		    var args = { ID: gw_com_api.v_Stream.msg_linkPage,
		        to: { type: "MAIN" },
		        data: { page: "w_mrp3200", title: "생산작업 Check Sheet",
		            param: [
		    			{ name: "ord_no", value: gw_com_api.getValue("grdData_현황", "selected", "ord_no", true) },
		    			{ name: "proj_no", value: gw_com_api.getValue("grdData_현황", "selected", "proj_no", true) }
		            ]
		        }
		    };
		    gw_com_module.streamInterface(args);

        }
        
        var args = {
            targetid: "lyrMenu_2",
            element: "계산",
            event: "click",
            handler: click_lyrMenu_2_계산
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_2",
            element: "반영",
            event: "click",
            handler: click_lyrMenu_2_반영
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_2",
            element: "재생성",
            event: "click",
            handler: processBatch
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
            targetid: "grdData_상세",
            grid: true,
            event: "rowselected",
            handler: rowselected_grdData_상세
        };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_1_조회(ui) {

            gw_com_api.hide("frmOption_2");
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
        /*
        //----------
        function click_lyrMenu_1_추가(ui) {

        if (!checkManipulate()) return false;
        if (gw_com_api.getRowCount("grdData_상세") > 0) {
        gw_com_api.messageBox([
        { text: "공정별 계획 및 실적이 이미 존재합니다." }
        ]);
        return false;
        }

        v_global.process.handler = processInsert;

        if (!checkUpdatable({})) return false;

        processInsert({});

        }
        */
        //----------
        function click_lyrMenu_1_수정(ui) {

            if (!checkManipulate()) return false;

            v_global.process.handler = processModify;

            if (!checkUpdatable({})) return false;

            processModify({});

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
        function click_lyrMenu_2_계산(ui) {

            gw_com_api.hide("frmOption_1");
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
        function click_lyrMenu_2_반영(ui) {

            if (!checkManipulate()) return false;

            v_global.process.handler = processApply;

            if (!checkUpdatable({ check: true })) return false;

            checkAppliable({});

        }
        //----------
        function click_frmOption_1_실행(ui) {

            v_global.process.handler = processRetrieve;

            if (!checkUpdatable({})) return;

            processRetrieve({});

        }
        //----------
        function click_frmOption_취소(ui) {

            closeOption({});

        }
        //----------
        function click_frmOption_2_실행(ui) {

            if (!checkManipulate()) return false;

            v_global.process.handler = processCompute;

            //if (!checkUpdatable({ check: true })) return false;
            if (!checkUpdatable({})) return false;

            checkComputable({});

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
        function rowselected_grdData_상세(ui) {

            gw_com_api.setValue("frmOption_2", 1, "ymd", gw_com_api.getValue("grdData_상세", ui.row, "pln_ymd", true));

        };

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_api.setValue("frmOption_1", 1, "ymd_fr", gw_com_api.getDate("", { month: -1 }));
        gw_com_api.setValue("frmOption_1", 1, "ymd_to", gw_com_api.getDate("", { month: +6 }));
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
function checkUpdatable(param) {

    closeOption({});

    var args = {
        check: param.check,
        target: [
            {
                type: "GRID",
                id: "grdData_상세"
            }
		],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function checkComputable(param) {

    closeOption({});

    if (gw_com_api.getSelectedRow("grdData_상세") == null) {
        gw_com_api.messageBox([
            { text: "선택된 공정이 없습니다." }
        ], 300);
        return false;
    }
    var args = {
        target: [
	        {
	            type: "FORM",
	            id: "frmOption_2"
	        }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    if (gw_com_api.getSelectedRow("grdData_상세") == gw_com_api.getRowCount("grdData_상세"))
        gw_com_api.messageBox([
            { text: "모든 공정의 계획 일자가 다시 계산됩니다." + "<br>" },
            { text: "계속 하시겠습니까?" }
        ], 420, gw_com_api.v_Message.msg_confirmBatch, "YESNO", { compute: true });
    else
        gw_com_api.messageBox([
            { text: "선택한 공정을 포함하여 이후 공정의 계획 일자가" + "<br>" },
            { text: "다시 계산됩니다. 계속 하시겠습니까?" }
        ], 420, gw_com_api.v_Message.msg_confirmBatch, "YESNO", { compute: true });

}
//----------
function checkAppliable(param) {

    gw_com_api.messageBox([
            { text: "작업 실적 정보를 반영합니다. 계속 하시겠습니까?" }
        ], 500, gw_com_api.v_Message.msg_confirmBatch, "YESNO", { apply: true });

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
                    name: "proj_no",
                    argument: "arg_proj_no"
                },
				{
				    name: "cust_cd",
				    argument: "arg_cust_cd"
				},
				{
				    name: "prod_group",
				    argument: "arg_prod_group"
				},
				{
				    name: "ymd_fr",
				    argument: "arg_ymd_fr"
				},
				{
				    name: "ymd_to",
				    argument: "arg_ymd_to"
				}
			],
            remark: [
                {
                    element: [{ name: "proj_no"}]
                },
		        {
		            element: [{ name: "prod_group"}]
		        },
                {
                    element: [{ name: "cust_cd"}]
                },
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
			    select: true
			}
		],
        clear: [
			{
			    type: "GRID",
			    id: "grdData_상세"
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
				    name: "ord_no",
				    argument: "arg_ord_no"
				}
			]
        },
        target: [
			{
			    type: "GRID",
			    id: "grdData_상세"
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
/*
//----------
function processInsert(param) {

var args = {
url: "COM",
procedure: "sp_scmMprcAdd",
input: [
{ name: "asOrdNo", value: gw_com_api.getValue("grdData_현황", "selected", "ord_no", true), type: "varchar" }
],
handler: {
success: successInsert
}
};
gw_com_module.callProcedure(args);

}
*/
//----------
function processModify(param) {

    var args = {
        url: "COM",
        procedure: "sp_scmMprcStatus",
        input: [
            { name: "arg_ord_no", value: gw_com_api.getValue("grdData_현황", "selected", "ord_no", true), type: "varchar" },
            { name: "arg_usr", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
        ],
        handler: {
            success: successModify
        }
    };
    gw_com_module.callProcedure(args);

}
//----------
function processSave(param) {

    var args = {
        target: [
			{
			    type: "GRID",
			    id: "grdData_상세"
			}
		]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    //args.url = "COM";
    args.handler = {
        success: successSave
    };
    gw_com_module.objSave(args);

}
//----------
function processCompute(param) {

    var args = {
        url: "COM",
        procedure: "sp_scmMprcSchedule",
        input: [
            { name: "arg_user", value: gw_com_module.v_Session.USR_ID, type: "varchar" },
            { name: "arg_ord_no", value: gw_com_api.getValue("grdData_현황", "selected", "ord_no", true), type: "varchar" },
            { name: "arg_mprc_cd", value: gw_com_api.getValue("grdData_상세", "selected", "mprc_cd", true), type: "varchar" },
            { name: "arg_pln_ymd", value: gw_com_api.getValue("frmOption_2", 1, "ymd"), type: "varchar" },
            { name: "arg_cmd_all", value: (gw_com_api.getSelectedRow("grdData_상세") == gw_com_api.getRowCount("grdData_상세")) ? "1" : "0", type: "varchar" }
        ],
        output: [
            { name: "r_value", type: "int" },
            { name: "message", type: "varchar" }
        ],
        handler: {
            success: successCompute
        }
    };
    gw_com_module.callProcedure(args);

}
//----------
function processApply(param) {

    var args = {
        url: "COM",
        procedure: "sp_scmMprcWork",
        input: [
            { name: "arg_ord_no", value: gw_com_api.getValue("grdData_현황", "selected", "ord_no", true), type: "varchar" },
            { name: "arg_usr", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
        ],
        handler: {
            success: successApply
        }
    };
    gw_com_module.callProcedure(args);

}
//----------
function processClear(param) {

    var args = {
        target: [
            {
                type: "GRID",
                id: "grdData_상세"
            }
        ]
    };
    if (param.master) {
        args.target.unshift({
            type: "GRID",
            id: "grdData_현황"
        });
    }
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

    gw_com_api.hide("frmOption_1");
    gw_com_api.hide("frmOption_2");

}
//----------
function successSave(response, param) {

    processLink({ key: response });

}
//----------
function successInsert(response) {

    processLink({});

}
//----------
function successModify(response) {

    var key = [
        {
            KEY: [
                { NAME: "ord_no", VALUE: gw_com_api.getValue("grdData_현황", "selected", "ord_no", true) }
            ],
            QUERY: "w_mrp3010_M_1"
        }
    ];
    processRetrieve({ key: key });

}
//----------
function successCompute(response) {

    processLink({});

}
//----------
function successApply(response) {

    processLink({});

}
//----------
function processBatch(param) {

    if (param.element == "재생성") {
        if (param.regen) {
            var args = {
                url: "COM",
                procedure: "sp_scmMprcAdd",
                input: [
                    { name: "asOrdNo", value: gw_com_api.getValue("grdData_현황", "selected", "ord_no", true), type: "varchar" },
                    { name: "asRegen", value: "Y", type: "varchar" }
                ],
                handler: {
                    success: successBatch,
                    param: param
                }
            };
            gw_com_module.callProcedure(args);
        } else {
            if (!checkManipulate()) return false;
            //if (!checkUpdatable({ check: true })) return false;
            gw_com_api.messageBox(
                [{ text: "[공정별 계획 및 실적] 삭제 후 재생성 됩니다." }, { text: "계속 하시겠습니까?" }], 420
                    , gw_com_api.v_Message.msg_confirmBatch, "YESNO", { element: "재생성", regen: true });
        }
    }

}
//----------
function successBatch(param) {

    processLink({});

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
                    case gw_com_api.v_Message.msg_confirmBatch:
                        {
                            if (param.data.result == "YES") {
                                if (param.data.arg.compute)
                                    processCompute({});
                                else if (param.data.arg.apply)
                                    processApply({});
                                else if (param.data.arg.regen)
                                    processBatch(param.data.arg);
                            }
                        }
                        break;
                    case gw_com_api.v_Message.msg_informSaved:
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