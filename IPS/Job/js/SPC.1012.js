
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define Global variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
    logic: {}
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define gw_job_process class : ready(), UI(), procedure()
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var gw_job_process = {

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // entry point. (pre-process section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ready: function () {

        // initialize page.
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        var args = { request: [
				{ type: "PAGE", name: "검사항목", query: "DDDW_CM_CODE",
				    param: [{ argument: "arg_hcode", value: "SPC010"}] },
				{ type: "PAGE", name: "품목분류", query: "DDDW_CM_CODE",
				    param: [{ argument: "arg_hcode", value: "SPC020"}] },
                { type: "INLINE", name: "보기",
                    data: [
						{ title: "축약", value: "S" },
						{ title: "확장", value: "L" }
					]
                }
                ,{ type: "INLINE", name: "규격종류",
                    data: [
						{ title: "양쪽규격", value: "양쪽규격" },
						{ title: "한쪽(USL)", value: "한쪽(USL)" }
						, { title: "한쪽(LSL)", value: "한쪽(LSL)" }
					]
                }
			],
            starter: start
        };
        gw_com_module.selectSet(args);

        //start();  //gw_com_module.selectSet(args) 을 사용하지 않을 시에 활성화
        function start() { gw_job_process.UI(); }

    },  // End of gw_job_process.ready

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage UI. (design section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    UI: function () {

        //==== Menu : Main ====
        var args = { targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "조회", value: "조회", act: true },
				{ name: "추가", value: "추가" },
				{ name: "삭제", value: "삭제" },
				{ name: "저장", value: "저장" },
				{ name: "닫기", value: "닫기" }
			]
        };
        gw_com_module.buttonMenu(args);

        //==== Menu : Sub
        var args = { targetid: "lyrMenu_2", type: "FREE",
            element: [
				{ name: "추가", value: "추가" },
				{ name: "삭제", value: "삭제" }
			]
        };
        gw_com_module.buttonMenu(args);

        //==== Menu : Detail ====
        var args = {
            targetid: "lyrMenu_3", type: "FREE",
            element: [
				{ name: "추가", value: "추가" },
				{ name: "삭제", value: "삭제" }
			]
        };
        gw_com_module.buttonMenu(args);

        //==== Option : Form Main ====
        
        //==== Grid : Main ====
        var args = { targetid: "grdData_대분류", query: "SPC_1012_M_1", title: "품질검사 품목분류",
            caption: true, width: 200, height: 250, show: true, selectable: true, number: false,
            editable: { multi: true, bind: "select", focus: "dcode", validate: true },
            element: [
				{ header: "코드", name: "dcode", width: 40, align: "center"
					, editable: { bind: "create", type: "text", validate: { rule: "required", message: "품목분류 코드"}}
				},
				{ header: "분류명", name: "dname", width: 100, align: "left"
					, editable: { type: "text", validate: { rule: "required", message: "품목분류 명칭" } } },
				{ name: "hcode", hidden: true, editable: { type: "hidden"} },
				{ name: "use_yn", hidden: true, editable: { type: "hidden"} },
				{ name: "sort_seq", hidden: true, editable: { type: "hidden"} }
			]
        };
        gw_com_module.gridCreate(args);

        //==== Grid : Sub ====
        var args = { targetid: "grdData_중분류", query: "SPC_1012_S_1", title: "검사대상품목",
            caption: true, width: 650, height: 222, show: true, selectable: true,
            editable: { multi: true, bind: "select", focus: "part_no", validate: true },
            element: [
				{ header: "Part No.", name: "part_no", width: 100, align: "center", mask: "search",
				    editable: { bind: "create", type: "text", validate: { rule: "required", message: "Part No."} }
				},
				{ header: "Part Name", name: "part_nm", width: 220, align: "left" },
				{ header: "협력사", name: "supp_nm", width: 160, align: "left", mask: "search",
				    editable: { type: "text" }
				},
				{ header: "담당자", name: "emp_nm", width: 80, align: "left", mask: "search",
				    editable: { type: "text" }
				},
				{ header: "Part Spec", name: "part_spec", width: 140, align: "left" },
				{ header: "Remark", name: "part_desc", width: 200, align: "left"
					, editable: { type: "text" } },
				{ name: "part_grp", hidden: true, editable: { type: "hidden"} },
				{ name: "supp_cd", hidden: true, editable: { type: "hidden"} },
				{ name: "emp_no", hidden: true, editable: { type: "hidden"} }
			]
        };
        gw_com_module.gridCreate(args);

        //==== Grid : Detail ====
        var args = { targetid: "grdData_소분류", query: "SPC_1012_S_2", title: "검사표준",
            caption: true, width: 900, height: 178, show: true, selectable: true,
            editable: { multi: true, bind: "select", focus: "qcitem_cd", validate: true },
            element: [
				{ header: "검사 항목", name: "qcitem_cd", width: 200, align: "left",
				    format: { type: "select", data: { memory: "검사항목"} },
				    editable: { bind: "create", type: "select", validate: { rule: "required" }, data: { memory: "검사항목"} }
				},
				{ header: "적용일자", name: "app_date", width: 100, align: "center", mask: "date-ymd", editable: { type: "text" } },
            	{ header: "Nominal Value", name: "normal_value", width: 80, align: "center" , editable: { type: "text" } },
            	{ header: "USL Value", name: "usl_value", width: 80, align: "center" , editable: { type: "text" } },
            	{ header: "LSL Value", name: "lsl_value", width: 80, align: "center" , editable: { type: "text" } },
            	{ header: "공차", name: "gap_value", width: 80, align: "center" , editable: { type: "text" } },
            	{ header: "Exponent", name: "value_exp", width: 60, align: "center" , editable: { type: "text" } },
            	{ header: "Group Size", name: "group_size", width: 60, align: "center" , editable: { type: "text" } },
            	{ header: "규격종류", name: "qc_type", width: 100, align: "center" 
            		//, format: { type: "select", data: { memory: "규격종류"} }
				    , editable: { type: "select", validate: { rule: "required" }, data: { memory: "규격종류"} }
				},
            	{ header: "UCL(%)", name: "ucl_rate", width: 60, align: "center" , editable: { type: "text" } },
            	{ header: "LCL(%)", name: "lcl_rate", width: 60, align: "center" , editable: { type: "text" } },
            	{ name: "part_no", hidden: true, editable: { type: "hidden" } }
			]
        };
        gw_com_module.gridCreate(args);

        //==== Resize Objects ====
        var args = {
            target: [
                { type: "GRID", id: "grdData_대분류", offset: 8 },
                { type: "GRID", id: "grdData_중분류", offset: 8 },
				{ type: "GRID", id: "grdData_소분류", offset: 8 }
			]
        };
        gw_com_module.objResize(args);

        // go next.
        gw_job_process.procedure();

    },  // End of gw_job_process.UI

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage process. (program section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    procedure: function () {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Define Events & Method
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //==== Button Click : Main ====
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: click_lyrMenu_조회 };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: click_lyrMenu_저장 };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "추가", event: "click", handler: click_lyrMenu_추가 };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "삭제", event: "click", handler: click_lyrMenu_삭제 };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: click_lyrMenu_닫기 };
        gw_com_module.eventBind(args);
        //----------------------------------------
        function click_lyrMenu_조회(ui) { 
            if (!checkUpdatable({})) return;
        	v_global.process.handler = processRetrieve;
            processRetrieve({});
        }

        function click_lyrMenu_추가(ui) { 
            if (!checkUpdatable({ main: true })) return;	// 하위 Data 변경 여부 확인
            v_global.process.handler = processInsert;
            processInsert({});
        }
        
        function click_lyrMenu_삭제(ui) { 
        	if (!checkSelectedRow({ main: true})) return;
            v_global.process.handler = processRemove;
            checkRemovable({});
        }

        function click_lyrMenu_저장(ui) { processSave({}); }

        function click_lyrMenu_닫기(ui) { 
        	v_global.process.handler = processClose;
            if (!checkUpdatable({})) return;
            processClose({});
        }

        //==== Button Click : Sub ====
        var args = { targetid: "lyrMenu_2", element: "추가", event: "click", handler: click_lyrMenu_2_추가 };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_2", element: "삭제", event: "click", handler: click_lyrMenu_2_삭제 };
        gw_com_module.eventBind(args);
        
        function click_lyrMenu_2_추가(ui) { 
            if (!checkSelectedRow({ main: true })) return;		// 상위 Data 존재 여부 화인
            if (!checkUpdatable({ sub: true })) return;			// 하위 Data 변경 여부 확인
            v_global.process.handler = processInsert;
            processInsert({ sub: true });
        }
        
        function click_lyrMenu_2_삭제(ui) { 
        	if (!checkSelectedRow({ sub: true })) return;
            v_global.process.handler = processRemove;
            checkRemovable({ sub: true });
        }

        //==== Button Click : Detail ====
        var args = { targetid: "lyrMenu_3", element: "추가", event: "click", handler: click_lyrMenu_3_추가 };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_3", element: "삭제", event: "click", handler: click_lyrMenu_3_삭제 };
        gw_com_module.eventBind(args);
        //----------------------------------------
        function click_lyrMenu_3_추가(ui) { 
            if (!checkSelectedRow({ sub: true })) return;
            if (!checkUpdatable({ detail: true })) return;
            v_global.process.handler = processInsert;
            processInsert({ detail: true });
        }
        //----------------------------------------
        function click_lyrMenu_3_삭제(ui) { 
            if (!checkSelectedRow({ detail: true })) return;
            v_global.process.handler = processRemove;
            checkRemovable({ detail: true });
        }

        //==== Grid Events : Main
        var args = { targetid: "grdData_대분류", grid: true, event: "rowselecting", handler: rowselecting_grdData_대분류 };
        gw_com_module.eventBind(args);
        var args = { targetid: "grdData_대분류", grid: true, event: "rowselected", handler: rowselected_grdData_대분류 };
        gw_com_module.eventBind(args);
        //----------------------------------------
        function rowselecting_grdData_대분류(ui) { v_global.process.handler = processSelect;
            v_global.process.current.master = ui.row;
            return checkUpdatable({});
        }
        //----------------------------------------
        function rowselected_grdData_대분류(ui) { v_global.process.prev.master = ui.row;
            processLink({});
        };

        //==== Grid Events : Sub
        var args = { targetid: "grdData_중분류", grid: true, event: "rowselecting", handler: rowselecting_grdData_중분류 };
        gw_com_module.eventBind(args);
        var args = { targetid: "grdData_중분류", grid: true, event: "rowselected", handler: rowselected_grdData_중분류 };
        gw_com_module.eventBind(args);
        var args = { targetid: "grdData_중분류", grid: true, event: "itemdblclick", handler: itemdblclick_grdData_중분류 };
        gw_com_module.eventBind(args);
        var args = { targetid: "grdData_중분류", grid: true, event: "itemkeyenter", handler: itemdblclick_grdData_중분류 };
        gw_com_module.eventBind(args);
        //----------------------------------------
        function rowselecting_grdData_중분류(ui) { v_global.process.handler = processSelect;
            v_global.process.current.sub = ui.row;
            return checkUpdatable({sub: true});
        }
        //----------------------------------------
        function rowselected_grdData_중분류(ui) { v_global.process.prev.sub = ui.row;
            processLink({sub: true});
        };
        //----------------------------------------
        function itemdblclick_grdData_중분류(ui) {

            switch (ui.element) {
                case "supp_nm":
                    { v_global.event.type = ui.type; v_global.event.object = ui.object; v_global.event.row = ui.row; v_global.event.element = ui.element;
                        var args = { type: "PAGE", page: "DLG_SUPPLIER", title: "협력사 선택", width: 600, height: 500, open: true };
                        if (gw_com_module.dialoguePrepare(args) == false) {
                            var args = { page: "DLG_SUPPLIER",
                                param: { ID: gw_com_api.v_Stream.msg_selectSupplier }
                            };
                            gw_com_module.dialogueOpen(args);
                        }
                    } break;

                case "emp_nm":
                    { v_global.event.type = ui.type; v_global.event.object = ui.object; v_global.event.row = ui.row; v_global.event.element = ui.element;
                        var args = { type: "PAGE", page: "DLG_EMPLOYEE", title: "담당 사원 선택", width: 600, height: 500, open: true };
                        if (gw_com_module.dialoguePrepare(args) == false) {
                            var args = { page: "DLG_EMPLOYEE",
                                param: { ID: gw_com_api.v_Stream.msg_selectEmployee }
                            };
                            gw_com_module.dialogueOpen(args);
                        }
                    } break;

                case "part_no":
                    { v_global.event.type = ui.type; v_global.event.object = ui.object; v_global.event.row = ui.row; v_global.event.element = ui.element;
                        var args = { type: "PAGE", page: "w_find_part_spc", title: "부품 검색", width: 960, height: 500, open: true };
                        if (gw_com_module.dialoguePrepare(args) == false) {
                            var args = { page: "w_find_part_spc", param: { ID: gw_com_api.v_Stream.msg_selectPart_QCM } };
                            gw_com_module.dialogueOpen(args);
                        }
                    } break;
            }   // End of switch (ui.element)
        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        gw_com_module.startPage();
        processRetrieve({});

    }   // End of gw_job_process.procedure

};  // End of gw_job_process

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------------------------------------
function processSelect(param) {

    if (param.sub)
        gw_com_api.selectRow("grdData_중분류", v_global.process.current.sub, true, false);
    else
        gw_com_api.selectRow("grdData_대분류", v_global.process.current.master, true, false);

}
//----------------------------------------
function processRetrieve(param) {

    var args = {
        source: { type: "INLINE",
            argument: [ { name: "arg_part", value: "QCITEM" } ]
        },
        target: [
			{ type: "GRID", id: "grdData_대분류", select: true }
		],
        clear: [
			{ type: "GRID", id: "grdData_중분류" },
			{ type: "GRID", id: "grdData_소분류" }
		],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------------------------------------
function processLink(param) {

    var args = {};
    if (param.sub) {
        args = { key: param.key
            , source: { type: "GRID", id: "grdData_중분류", row: "selected", block: true,
                element: [ { name: "part_no", argument: "arg_part_no" } ]
              }
            , target: [
	            { type: "GRID", id: "grdData_소분류", select: false }
              ]
        };
    }
    else {
        args = { key: param.key
            , source: { type: "GRID", id: "grdData_대분류", row: "selected", block: true,
                element: [ { name: "dcode", argument: "arg_part_grp" } ]
            }
            , target: [
	            { type: "GRID", id: "grdData_중분류", select: true }
            ]
            , clear: [
				{ type: "GRID", id: "grdData_소분류" }
			]
        };
    }
    gw_com_module.objRetrieve(args);

}
//----------------------------------------
function checkCRUD(param) {
	if (param.sub)
    	return gw_com_api.getCRUD("grdData_중분류", "selected", true);
	else if (param.detail)
    	return gw_com_api.getCRUD("grdData_소분류", "selected", true);
    else
    	return gw_com_api.getCRUD("grdData_대분류", "selected", true);
    	
}
//----------------------------------------
function checkSelectedRow(param) {

    if ((param.main && gw_com_api.getSelectedRow("grdData_대분류") == null) || 
    	(param.sub && gw_com_api.getSelectedRow("grdData_중분류") == null) || 
    	(param.detail && gw_com_api.getSelectedRow("grdData_소분류") == null) )
    {
        gw_com_api.messageBox([ { text: "NOMASTER" } ]);
        return false;
    }
    return true;
}
//----------------------------------------
function checkUpdatable(param) {
    
    gw_com_api.hide("frmOption");
    if (param.detail) return true;
    
    var args = { param: param,
	        target: [
	            { type: "GRID", id: "grdData_대분류", refer: (param.main || param.sub) ? true : false }
	          , { type: "GRID", id: "grdData_중분류", refer: (param.sub) ? true : false }
	          , { type: "GRID", id: "grdData_소분류" }
			] 
		};
    return gw_com_module.objUpdatable(args);

}
//----------------------------------------
function processSave(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdData_대분류" }
		   ,{ type: "GRID", id: "grdData_중분류" }
		   ,{ type: "GRID", id: "grdData_소분류" }
		]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args.url = "COM";   // aspx.cs 의 Update 프로세스 사용시에는 제거해야함 
    args.handler = { success: successSave };
    gw_com_module.objSave(args);

}
//----------------------------------------
function successSave(response, param) {

    //processLink({ key: response });
    var status = checkCRUD({});
    if (status == "create" || status == "update")	//대분류가 변경된 경우
    	processRetrieve({ key: response });			// => 전체 조회
    else{
    	status = checkCRUD({ sub: true });
    	if (status == "create" || status == "update")	//중분류가 변경된 경우
	        processLink({ key: response });				//=>중,소 조회
    	else
	        processLink({ sub: true, key: response });	//=> 소만 조회
    }
    	

}
//----------------------------------------
function processInsert(param) {
    var args = {};
    if (param.detail)
        args = { targetid: "grdData_소분류", edit: true,
            data: [
                { name: "part_no", value: gw_com_api.getValue("grdData_중분류", "selected", "part_no", true) }
              , { name: "value_exp", value: 0 }
            ]
        };
    else if (param.sub)
        args = { targetid: "grdData_중분류", updatable: true, edit: true,
            data: [
                { name: "part_grp", value: gw_com_api.getValue("grdData_대분류", "selected", "dcode", true) }
            ],
            clear: [
                { type: "GRID", id: "grdData_소분류" }
	        ]
        };
    else
        args = { targetid: "grdData_대분류", updatable: true, edit: true,
            data: [
                { name: "hcode", value: "SPC020" },
                { name: "use_yn", value: "1" },
                { name: "sort_seq", value: "1" }
            ],
            clear: [
		        { type: "GRID", id: "grdData_중분류" }
	        ]
        };
    gw_com_module.gridInsert(args);

}
//----------------------------------------
function checkRemovable(param) {

    var status = checkCRUD( param );
    if (status == "initialize" || status == "create")
        processDelete( param );
    else
        gw_com_api.messageBox([
            { text: "REMOVE" }
        ], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO", param);

}
//----------------------------------------
function processDelete(param) {

    var args = { row: "selected", remove: true };
    if (param.detail) { 
    	args.targetid = "grdData_소분류"; 
    }
    else if (param.sub) { 
    	args.targetid = "grdData_중분류";
        args.clear = [ { type: "GRID", id: "grdData_소분류" } ];  //Detail 이 Sub에 종속적인 경우에 사용
    }
    else { 
    	args.targetid = "grdData_대분류";
        args.clear = [ { type: "GRID", id: "grdData_중분류" }, { type: "GRID", id: "grdData_소분류" } ];
    }
    gw_com_module.gridDelete(args);

}
//----------------------------------------
function processRemove(param) {
    var args = {};
    if (param.sub) {
        args = { url: "COM",
            target: [
		        { type: "GRID", id: "grdData_중분류",
		            key: [ { row: "selected", element: [ { name: "part_no" } ] } ]
		        }
	        ]
        };
    }
    else if (param.detail) {
        args = { url: "COM",
            target: [
		        { type: "GRID", id: "grdData_소분류",
		            key: [ { row: "selected", element: [ { name: "part_no" }, { name: "qcitem_cd" } ] } ]
		        }
	        ]
        };
    }
	else {
        args = { url: "COM",
            target: [
		        { type: "GRID", id: "grdData_대분류",
		            key: [ { row: "selected", element: [ { name: "hcode" }, { name: "dcode" } ] } ]
		        }
	        ]
        };
    }
    args.handler = { success: successRemove, param: param };
    gw_com_module.objRemove(args);

	// Procedure에 의한 삭제처리
	/*
    var args = { url: "COM", procedure: "PROC_DELETE_ISSUE_DIV", nomessage: true,
        input: [
            { name: "user", value: gw_com_module.v_Session.USR_ID, type: "varchar" },
            { name: "type", value: "QDM", type: "varchar" },
            { name: "hcode", value: gw_com_api.getValue((param.detail) ? "grdData_소분류" : "grdData_중분류", "selected", "hcode", true), type: "varchar" },
            { name: "dcode", value: gw_com_api.getValue((param.detail) ? "grdData_소분류" : "grdData_중분류", "selected", "dcode", true), type: "varchar" }
        ],
        output: [ { name: "r_value", type: "int" }, { name: "message", type: "varchar" } ],
        handler: { success: completeRemove, param: param }
    };
    gw_com_module.callProcedure(args);
	*/
}
//----------------------------------------
function successRemove(response, param) {

        processDelete(param);

}
//----------------------------------------
function completeRemove(response, param) {

    gw_com_api.messageBox( [ { text: response.VALUE[1] } ], 420, gw_com_api.v_Message.msg_informBatched, "ALERT",
    { handler: successRemove, response: response, param: param });

}
//----------------------------------------
function processRestore(param) {

    var args = { targetid: "grdData_중분류", row: v_global.process.prev.sub };
    gw_com_module.gridRestore(args);

}
//----------------------------------------
function processClear(param) {

    var args = {
        target: [ { type: "GRID", id: "grdData_소분류" } ]
    };
    if (param.master) {
        args.target.unshift({ type: "GRID", id: "grdData_중분류" });
        args.target.unshift({ type: "GRID", id: "grdData_대분류" });
    }
    else if (param.sub)
        args.target.unshift({ type: "GRID", id: "grdData_중분류" });
    gw_com_module.objClear(args);

}
//----------------------------------------
function processClose(param) {
    var args = { ID: gw_com_api.v_Stream.msg_closePage };
    gw_com_module.streamInterface(args);
}
//----------------------------------------
function closeDialogue(param) {

    var args = { page: param.page };
    gw_com_module.dialogueClose(args);
    if (param.focus) {
        gw_com_api.setFocus(v_global.event.object,  v_global.event.row, v_global.event.element, (v_global.event.type == "GRID") ? true : false);
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
streamProcess = function (param)  {
    switch (param.ID) {
        case gw_com_api.v_Stream.msg_resultMessage:
            {
                if (param.data.page != gw_com_api.getPageID()) break;

                switch (param.data.ID) {
                    case gw_com_api.v_Message.msg_confirmSave:
                        {
                            if (param.data.result == "YES") processSave(param.data.arg);
                            else { var status = checkCRUD({});
                                if (status == "initialize" || status == "create") processDelete({});
                                else if (status == "update") processRestore({});
                                if (v_global.process.handler != null) v_global.process.handler(param.data.arg);
                            }
                        } break;
                    case gw_com_api.v_Message.msg_confirmRemove:
                        { if (param.data.result == "YES") processRemove(param.data.arg); } break;
                    case gw_com_api.v_Message.msg_informSaved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param); 
                        } break;
                    case gw_com_api.v_Message.msg_informRemoved:
                        { param.data.arg.handler(param.data.arg.response, param.data.arg.param); } break;
                    case gw_com_api.v_Message.msg_informBatched:
                        { param.data.arg.handler(param.data.arg.response, param.data.arg.param); } break;
			    }   // End of switch (param.data.ID)
			} break;    // End of case gw_com_api.v_Stream.msg_resultMessage
        case gw_com_api.v_Stream.msg_closeDialogue:
            { closeDialogue({ page: param.from.page }); } break;
        // 부품 선택 후 처리
        case gw_com_api.v_Stream.msg_selectedPart_QCM: {
                if (v_global.event.element == "part_no") {
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, "part_no", param.data.part_cd,
			                            (v_global.event.type == "GRID") ? true : false);
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, "part_nm", param.data.part_nm,
			                            (v_global.event.type == "GRID") ? true : false);
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, "part_spec", param.data.part_spec, true);
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, "supp_cd", param.data.supp_cd, true);
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, "supp_nm", param.data.supp_nm, true);
                }
                closeDialogue({ page: param.from.page, focus: true });
            } break;
        // 협력사 선택 후 처리
        case gw_com_api.v_Stream.msg_selectedSupplier: {
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "supp_cd", param.data.supp_cd,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "supp_nm", param.data.supp_nm,
			                        (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
            } break;
        // 사원 선택 후 처리
        case gw_com_api.v_Stream.msg_selectedEmployee:
            {
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "emp_nm",
			                        param.data.emp_nm, (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "emp_no",
			                        param.data.emp_no, (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
        // 부품 선택 창 오픈 후에 현재 값을 조회조건에 자동 지정
        case gw_com_api.v_Stream.msg_openedDialogue: { 
                var args = { to: { type: "POPUP", page: param.from.page } };
                switch (param.from.page) {
                    case "DLG_EMPLOYEE":
                        { args.ID = gw_com_api.v_Stream.msg_selecteEmployee;
                        } break;
//                    case "w_find_part_qcm":
//                        { args.ID = gw_com_api.v_Stream.msg_selectPart_QCM; } break;
                }
                gw_com_module.streamInterface(args);
            } break;
    }   // End of switch (param.ID)

}   // End of streamProcess

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//