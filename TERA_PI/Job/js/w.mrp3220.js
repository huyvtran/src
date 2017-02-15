//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 작업 표준서 등록
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
    data: null, logic: {}
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define gw_job_process class : ready(), UI(), procedure()
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var gw_job_process = {

    // entry point. (pre-process section)
    ready: function () {

        // initialize page.
        v_global.process.param = gw_com_module.initPage({ authority: true, message: true });
        gw_com_api.changeTheme("style_theme");

        // Set page variables for parameters
	    v_global.logic.ord_no = "";
	    if (v_global.process.param) {	// Page Parameter 변수 저장
	        v_global.logic.ord_no = gw_com_api.getPageParameter("ord_no");
	        v_global.logic.work_group = gw_com_api.getPageParameter("work_group");
	        v_global.logic.work_cd = gw_com_api.getPageParameter("work_cd");
	        v_global.logic.input_cd = "none";//gw_com_api.getPageParameter("input_cd");
	    }

        // set data for DDDW List
        var args = { request: [
				{ type: "PAGE", name: "제품군", query: "DDDW_CM_CODE",
				    param: [{ argument: "arg_hcode", value: "IEHM06"}]
				},
				{ type: "PAGE", name: "제품유형", query: "DDDW_CM_CODE",
				    param: [{ argument: "arg_hcode", value: "ISCM25"}]
				},
                { type: "PAGE", name: "공정구분", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "ISCM26"}]
                },
                { type: "PAGE", name: "작업그룹", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "IPOP11"}]
                },
                { type: "INLINE", name: "InputCheck",
                    data: [{ title: "OK", value: "OK" }, { title: "NG", value: "NG"}, { title: "N/A", value: "N/A"}]
                },
                { type: "PAGE", name: "부서", query: "dddw_dept" },
                { type: "PAGE", name: "사원", query: "dddw_emp" }
			],
            starter: start
        };
        gw_com_module.selectSet(args);

        //----------
        function start() {
            gw_job_process.UI();
            gw_job_process.procedure();
            
            // 작업 단계에 따른 개체 숨김 처리
			$("#lyrMenu_Sub_이전").show();
			$("#lyrMenu_Sub_확인").show();
			$("#lyrMenu_Sub_저장").hide();
			$("#lyrMenu_Sub_추가").hide();
			$("#lyrMenu_Sub_삭제").hide();
			//$("#grdData_Sub").hide();
            
            // 
	        if (v_global.logic.ord_no != "")
                processRetrieve(v_global.logic);

        }

    },

    // manage UI. (design section)
    UI: function () {

        //==== Sub Menu : (Check) 추가, 삭제
        var args = { targetid: "lyrMenu_Sub", type: "FREE",
            element: [
				{ name: "이전", value: "이전으로 돌아가기", icon: "조회" },
				{ name: "확인", value: "작업표준서 확인", icon: "예" },
				{ name: "다음", value: "다음작업 보기", icon: "조회" },
				{ name: "저장", value: "Check 완료", icon: "저장" },
				{ name: "추가", value: "추가" },
				{ name: "삭제", value: "삭제" }
			]
        };
        gw_com_module.buttonMenu(args);
        //==== Main Form : SM_WORK
        var args = { targetid: "frmData_Main", query: "w_mrp3220_M_1", type: "TABLE", title: "작업 정보",
            caption: true, show: true, selectable: true,
            editable: { bind: "select", focus: "input_cnt", validate: true },
            content: { width: { label: 100, field: 190 }, height: 25,
                row: [
                    { element: [
                        { header: true, value: "제품유형", format: { type: "label"} },
                        { name: "prod_type",
                            format: { type: "select", data: { memory: "제품유형"} }
                        },
                        { header: true, value: "제품명칭", format: { type: "label"} },
                        { name: "prod_nm" },
                        { header: true, value: "생산공정", format: { type: "label"} },
                        { name: "mprc_nm" }
	                    ]
                    },
                    { element: [
                        { header: true, value: "작업그룹", format: { type: "label"} },
                        { name: "work_group_nm" },
                        { header: true, value: "작업명칭", format: { type: "label"} },
                        { name: "work_nm" },
                        { header: true, value: "작업코드", format: { type: "label"} },
                        { name: "work_cd", format: { type: "text"}, editable: { type: "hidden" } }
	                    ]
                    },
                    { element: [
                        { header: true, value: "작업순번", format: { type: "label"} },
                        { name: "work_seq" },
                        { header: true, value: "총항목수", format: { type: "label"} },
                        { name: "item_cnt" },
                        { header: true, value: "완료항목", format: { type: "label"} },
                        { name: "input_cnt" }
	                    ]
                    },
                    { element: [
                        { header: true, value: "작업 비고", format: { type: "label"} },
                        { name: "work_rmk", style: { colspan: 5 } },
                        { name: "ord_no", hidden: true },
                        { name: "work_group", hidden: true },
                        { name: "next_work_cd", hidden: true },
                        { name: "prev_work_cd", hidden: true },
                        { name: "input_cd", hidden: true },
                        { name: "size_tp", hidden: true }
                        ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);

        //==== Sub Form : 사진 및 그림
        var args = { targetid: "frmData_MemoA", query: "w_mrp1420_MemoA", type: "TABLE", title: "사진 및 그림",
            caption: true, show: true, fixed: true, selectable: true,
            editable: { bind: "select", validate: true },
            content: {
                width: { field: "100%" }, height: 360,
                row: [
                    { element: [
                            { name: "memo_html", format: { type: "html", height: 370, top: 5} },
                            { name: "memo_text", hidden: true, editable: { type: "hidden"} },
                            { name: "memo_cd", hidden: true, editable: { type: "hidden"} },
                            { name: "root_seq", hidden: true, editable: { type: "hidden"} },
                            { name: "root_no", hidden: true, editable: { type: "hidden"} }
                        ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);

        var args = { targetid: "frmData_MemoTop", query: "w_mrp1420_MemoA", type: "TABLE", title: "사진 및 그림",
            caption: true, show: false, fixed: true, selectable: true,
            editable: { bind: "select", validate: true },
            content: {
                width: { field: "100%" }, height: 360,
                row: [
                    { element: [
                            { name: "memo_html", format: { type: "html", height: 370, top: 5} },
                            { name: "memo_text", hidden: true, editable: { type: "hidden"} },
                            { name: "memo_cd", hidden: true, editable: { type: "hidden"} },
                            { name: "root_seq", hidden: true, editable: { type: "hidden"} },
                            { name: "root_no", hidden: true, editable: { type: "hidden"} }
                        ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);

        //==== Sub Form : 작업 방법 및 순서
        var args = { targetid: "frmData_MemoB", query: "w_mrp1420_MemoB", type: "TABLE", title: "작업 방법 및 순서",
            caption: true, show: true, fixed: true, selectable: true,
            editable: { bind: "select", validate: true },
            content: {
                width: { field: "100%" }, height: 360,
                row: [
                    { element: [
                            { name: "memo_html", format: { type: "html", height: 370, top: 5} },
                            { name: "memo_text", hidden: true, editable: { type: "hidden"} },
                            { name: "memo_cd", hidden: true, editable: { type: "hidden"} },
                            { name: "root_seq", hidden: true, editable: { type: "hidden"} },
                            { name: "root_no", hidden: true, editable: { type: "hidden"} }
                        ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);

        var args = { targetid: "frmData_MemoBot", query: "w_mrp1420_MemoB", type: "TABLE", title: "작업 방법 및 순서",
            caption: true, show: false, fixed: true, selectable: true,
            editable: { bind: "select", validate: true },
            content: {
                width: { field: "100%" }, height: 360,
                row: [
                    { element: [
                            { name: "memo_html", format: { type: "html", height: 370, top: 5} },
                            { name: "memo_text", hidden: true, editable: { type: "hidden"} },
                            { name: "memo_cd", hidden: true, editable: { type: "hidden"} },
                            { name: "root_seq", hidden: true, editable: { type: "hidden"} },
                            { name: "root_no", hidden: true, editable: { type: "hidden"} }
                        ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);

        //==== Sub Form : Part List
        var args = { targetid: "grdData_D1", query: "w_mrp1420_D1", title: "Part List",
            caption: true, height: "100%", pager: false, show: true, selectable: true,//, width: "690"
            //editable: { multi: true, bind: "select", focus: "part_seq", validate: true },
            element: [
                { header: "No.", name: "part_seq", width: 40, align: "center",
                    editable: { type: "text", validate: { rule: "required"}}
                },
                { header: "Part No.", name: "part_no", width: 200, align: "left",
                    editable: { type: "text"}
                },
				{ header: "Part Name", name: "part_nm", width: 320, align: "left",
				    editable: { type: "text", validate: { rule: "required"} }
				},
                { header: "Qty", name: "part_qty", width: 40, align: "center",
                    editable: { type: "text" }
                },
                { header: "UOM", name: "uom", width: 40, align: "center",
                    editable: { type: "text" }
                },
                { name: "work_cd", hidden: true, editable: { type: "hidden"} }
			]
        };
        gw_com_module.gridCreate(args);

        //==== Sub Form : 필요 공구
        var args = { targetid: "grdData_D2", query: "w_mrp1420_D2", title: "필요 공구",
            caption: true, height: "100%", pager: false, show: true, selectable: true,	//, width: "464"
            //editable: { multi: true, bind: "select", focus: "dept_nm", validate: true },
            element: [
                { header: "No.", name: "tool_seq", width: 40, align: "center",
                    editable: { type: "text", validate: { rule: "required"}}
                },
                { header: "Part No.", name: "tool_no", width: 110, align: "left", hidden: true,
                    editable: { type: "text"}
                },
				{ header: "Tool Name", name: "tool_nm", width: 220, align: "left",
				    editable: { type: "text", validate: { rule: "required"} }
				},
                { header: "Qty", name: "tool_qty", width: 40, align: "center",
                    editable: { type: "text" }
                },
                { header: "UOM", name: "uom", width: 40, align: "center",
                    editable: { type: "text" }
                },
                { name: "tool_rmk", hidden: true, editable: { type: "hidden"} },
                { name: "work_cd", hidden: true, editable: { type: "hidden"} }
			]
        };
        gw_com_module.gridCreate(args);

        //==== Sub Form : Check Sheet
        //createTableObject({ objType: "GRID", objId: "grdData_Sub", readonly: false, clear: false });

        //==== File Download Layer
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);

        //==== Sub Form : Part List
        var args = { targetid: "grdData_Temp1", query: "w_mrp3220_T_1", title: "Check Sheet Column Definition",
            caption: false, height: "0", pager: false, show: false, //selectable: true,
            //editable: { multi: true, bind: "select", focus: "part_seq", validate: true },
            element: [
                { name: "input_cd", hidden: true },
                { name: "col_seq", hidden: true },
                { name: "col_nm", hidden: true },
                { name: "col_title", hidden: true },
                { name: "col_size", hidden: true },
                { name: "col_align", hidden: true },
                { name: "input_tp", hidden: true },
                { name: "code_nm", hidden: true },
                { name: "edit_yn", hidden: true },
                { name: "rspan_yn", hidden: true }
			]
        };
        gw_com_module.gridCreate(args);

        //==== Resize Objects
        var args = { target: [
				{ type: "FORM", id: "frmData_Main", offset: 8 },
                { type: "GRID", id: "grdData_D1", offset: 8 },
                { type: "GRID", id: "grdData_D2", offset: 8 }
			]
        };
        gw_com_module.objResize(args);
        gw_com_module.informSize();
    },

    //==== manage process. (program section)
    procedure: function () {

        //==== Button Click : Sub ====
        //----------
        var args = { targetid: "lyrMenu_Sub", element: "추가", event: "click", handler: click_lyrMenu_추가 };
        gw_com_module.eventBind(args);
        function click_lyrMenu_추가(ui) { processInsert(ui); }
        //----------
        var args = { targetid: "lyrMenu_Sub", element: "삭제", event: "click", handler: click_lyrMenu_삭제 };
        gw_com_module.eventBind(args);
        function click_lyrMenu_삭제(ui) { processDelete(ui); }
        //----------
        var args = { targetid: "lyrMenu_Sub", element: "다음", event: "click", handler: click_lyrMenu_다음 };
        gw_com_module.eventBind(args);
        function click_lyrMenu_다음(ui) { processWorkStep( { step: 1 } ); }
        //----------
        var args = { targetid: "lyrMenu_Sub", element: "이전", event: "click", handler: click_lyrMenu_이전 };
        gw_com_module.eventBind(args);
        function click_lyrMenu_이전(ui) { processWorkStep( { step: -1 } ); }
        //----------
        var args = { targetid: "lyrMenu_Sub", element: "확인", event: "click", handler: click_lyrMenu_확인 };
        gw_com_module.eventBind(args);
        function click_lyrMenu_확인(ui) {
        	// View Check Sheet Item 
			$("#lyrMenu_Sub_확인").hide();
			$("#lyrMenu_Sub_저장").show();
        	$("#grdData_Sub").show(); 
        	gw_com_module.informSize();
        	
        }
        //----------
        var args = { targetid: "lyrMenu_Sub", element: "저장", event: "click", handler: click_lyrMenu_저장 };
        gw_com_module.eventBind(args);
        function click_lyrMenu_저장(ui) { processSave(ui); }

        //==== Grid Events : Main
        //----------
        var args = { targetid: "frmData_Main", grid: false, event: "itemdblclick", handler: eventItemDblClick };
        gw_com_module.eventBind(args);
        var args = { targetid: "frmData_Main", grid: false, event: "itemkeyenter", handler: eventItemDblClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_MemoA", event: "itemdblclick", handler: eventItemDblClick };
        gw_com_module.eventBind(args);
        var args = { targetid: "frmData_MemoB", event: "itemdblclick", handler: eventItemDblClick };
        gw_com_module.eventBind(args);
        var args = { targetid: "frmData_MemoTop", event: "itemdblclick", handler: eventItemDblClick };
        gw_com_module.eventBind(args);
        var args = { targetid: "frmData_MemoBot", event: "itemdblclick", handler: eventItemDblClick };
        gw_com_module.eventBind(args);

        // startup process.
        gw_com_module.startPage();

    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function processWorkStep(param){
    
	var WorkCode = ""; var ErrMsg = "";
	if (param.step == 1){
		WorkCode = gw_com_api.getValue("frmData_Main", 1, "next_work_cd");
		ErrMsg = "마지막 작업입니다. 다음 작업이 없습니다." ;
	}
	else if (param.step == -1){
		WorkCode = gw_com_api.getValue("frmData_Main", 1, "prev_work_cd");
		ErrMsg = "첫 번째 작업입니다. 이전 작업이 없습니다." ;
	}
	else return false;	

	if (WorkCode == ""){
		gw_com_api.messageBox([ { text: ErrMsg } ]);
		return false;
	}
        	
	// 버튼 숨김 설정        	
	$("#lyrMenu_Sub_확인").show();
	$("#lyrMenu_Sub_저장").hide();
	$("#grdData_Sub").hide();

    var args = { target: [
            { type: "GRID", id: "grdData_D1", offset: 8 },
            { type: "GRID", id: "grdData_D2", offset: 8 }
		]
    };
    gw_com_module.objResize(args);
    //gw_com_module.informSize();
        	
	// 조회
	processClear({});
    v_global.logic.work_cd = WorkCode;
    processRetrieve(v_global.logic);
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Grid & Form Objects
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//====  create Table Object : FORM & GRID
function createTableObject(param) {
	var args = {};
	var IsGrid = (param.objType=="GRID")? true : false;
	
    //==== Clear Object
    if (param.clear) {
        args = { target: [{ type: param.objType, id: param.objId}] };
        gw_com_module.objClear(args);
    }

    //==== Create Object : readonly 일 경우는 editable을 undefined로 설정한다
    //editable: (param.readonly) ? undefined : { multi: true, bind: "select", focus: "input_val1", validate: true },
    if (param.objId == "grdData_Sub") {
        // Check Input Code
        var sInputCode = param.clear ? gw_com_api.getValue("frmData_Main", 1, "input_cd", false)
                                     : v_global.logic.input_cd;

        // Get dynamic column's definition
        var sColName, sColTitle, sColEdit, sColRspan = "0";
        var dynaCols = [];	var Cols = [];

        // 동적 Columns 정의
        for ( var i = 1; i <= gw_com_api.getRowCount("grdData_Temp1"); i++ ) {
            var RowData = gw_com_api.getRowData( "grdData_Temp1", i );
            var nColSize = gw_com_api.getValue("grdData_Temp1", i, "col_size", true);
            var sInputType = gw_com_api.getValue("grdData_Temp1", i, "input_tp", true);
            var sEditCode = gw_com_api.getValue("grdData_Temp1", i, "code_nm", true);
            var sEditYn = gw_com_api.getValue( "grdData_Temp1", i, "edit_yn", true );
            var sRowSpan = gw_com_api.getValue( "grdData_Temp1", i, "rspan_yn", true );
            var sAlign = "cneter"; //gw_com_api.getValue( "grdData_Temp1", i, "col_align", true );
            
            var tempCol = {
                header: gw_com_api.getValue("grdData_Temp1", i, "col_title", true), 
                name: gw_com_api.getValue("grdData_Temp1", i, "col_nm", true), 
                width: nColSize * 10, align: sAlign
            };
            
            if (sInputType == "select") {
            	tempCol.format = { type: "select", data: { memory: sEditCode} };
            	tempCol.editable = { type: sInputType, readonly: (sEditYn=="1")? false : true
            					, data: { memory: sEditCode, unshift: [ { title: "-", value: "" } ] } };
            }
            else if (sInputType == "file") {
				tempCol.editable = { type: "text", readonly: true };
            }
            else if (sInputType == "button") {
            	tempCol.format = { type: "link", value: "다운로드" };
            }
            else {
				tempCol.editable = { type: sInputType, readonly: (sEditYn=="1")? false : true };
        	}	
            dynaCols.push( tempCol );
        }

    	var checkCols = [
			{ header: "Action", name: "input_val1", width: 220, align: "left" },
            { header: "Description", name: "input_val2", width: 440, align: "left" },
            { header: "Check", name: "input_val3", width: 120, align: "center",
                format: { type: "select", data: { memory: "InputCheck"} },
                editable: { type: "select", data: { memory: "InputCheck", unshift: [ { title: "-", value: "" } ] } }
            }
    	];
    	// 동적 Columns 추가
        if (sInputCode == "CHECK")
        	for (var i = 0; i < checkCols.length; i++) Cols.push( checkCols[i] );
        else if(sInputCode > " ")
            for (var i = 0; i < dynaCols.length; i++) Cols.push( dynaCols[i] );
        else
            for (var i = 0; i < checkCols.length; i++) Cols.push( checkCols[i] );
		
		// 뒤쪽 고정 컬럼 추가
        var lastCols = [
            { header: "점검자", name: "input_user_nm", width: 100, align: "center"
                , mask: "search", display: false,
	            editable: { type: "text", validate: { rule: "required"} }
            },
            { header: "점검일자", name: "input_dt", width: 100, align: "center"
                , mask: "date-ymd",
                editable: { type: "text", validate: { rule: "required"} }
            },
	        { header: "비고", name: "input_val6", width: 400, align: "left",
	            editable: { type: "text" }
	        },
            { name: "ord_no", hidden: true, editable: { type: "hidden"} },
            { name: "work_group", hidden: true, editable: { type: "hidden"} },
            { name: "work_cd", hidden: true, editable: { type: "hidden"} },
            { name: "input_user", hidden: true, editable: { type: "hidden"} },
            { name: "check_seq", hidden: true, editable: { type: "hidden" } }
    	];
    	for (var i = 0; i < lastCols.length; i++) Cols.push( lastCols[i] );

		// recreate Grid
        args = { targetid: "grdData_Sub", query: "w_mrp3220_S", title: "Check Sheet",
            caption: true, height: "100%", pager: false, show: false, selectable: true, number: true,
            editable: (param.readonly) ? undefined : { multi: true, bind: "select", focus: "input_val1", validate: true },
            element: Cols
        };
        gw_com_module.gridCreate(args);
	}
	else if (param.objId == "frmData_D2"){
	}
	else { return; }
	
    //==== Set Events
    if (!param.readonly) {
        args = { targetid: param.objId, event: "itemdblclick", handler: eventItemDblClick, grid: IsGrid };
        gw_com_module.eventBind(args);
        args = { targetid: param.objId, event: "itemkeyenter", handler: eventItemDblClick, grid: IsGrid };
        gw_com_module.eventBind(args);
        args = { targetid: param.objId, event: "itemchanged", handler: eventItemChanged, grid: IsGrid };
        gw_com_module.eventBind(args);
    }
	//==== Resize Object & Form
    //if (param.clear) {
	    args = { target: [ { type: param.objType, id: param.objId, offset: 8 } ] };
        gw_com_module.objResize(args);
        //gw_com_module.informSize();
    //}
}
//====  Event Process : ItemChanged
function eventItemChanged(ui) {

    if (!checkEditable({})) return;

    var vl = ui.value.current;

    if (ui.element == "input_val1") {   
        //vl = vl.replace(/\r\n/g, "CRLF");	// 복수행 입력란의 개행문자 치환
        gw_com_api.setValue("grdData_Sub", "selected", "input_user", gw_com_module.v_Session.USR_ID, true);
        gw_com_api.setValue("grdData_Sub", "selected", "input_user_nm", gw_com_module.v_Session.USR_NM, true);
        gw_com_api.setValue("grdData_Sub", "selected", "input_dt", gw_com_api.getDate(""), true);
    }

    //string.substring(start, length)   
    //string.replace("A","B")

}
//====  Event Process : ItemDoubleClick
function eventItemDblClick(ui){
	
    v_global.event.type = ui.type;
    v_global.event.object = ui.object;
    v_global.event.row = ui.row;
    v_global.event.element = ui.element;
    
    switch (ui.element) { 
        case "dept_nm": {
            var args = { type: "PAGE", page: "DLG_TEAM", title: "부서 선택", width: 500, height: 450, open: true };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = { page: "DLG_TEAM",
                    param: { ID: gw_com_api.v_Stream.msg_selectTeam }
                };
                gw_com_module.dialogueOpen(args);
            }
        } break;
        case "input_user_nm": {
            var args = { type: "PAGE", page: "DLG_EMPLOYEE", title: "사원 선택"
            	, width: 700, height: 450, locate: ["center", "top"], open: true 
        	};
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = { page: "DLG_EMPLOYEE",
                    param: { ID: gw_com_api.v_Stream.msg_selectEmployee }
                };
                gw_com_module.dialogueOpen(args);
            }
        } break;
        default: return;
    }
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//==== Check Functions
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function checkCRUD(param) {

    if (param.sub) {
        var obj = "grdData_Sub";
        if (checkEditable({}))
            return gw_com_api.getCRUD(obj, "selected", true);
        else
            return ((gw_com_api.getSelectedRow(obj) == null) ? false : true);
    }
    else return gw_com_api.getCRUD("frmData_Main");

}
//----------
function checkManipulate(param) {

    if (checkCRUD(param) == "none") {
        gw_com_api.messageBox([
            { text: (param.sub) ? "선택된 내역이 없습니다." : "NOMASTER" }
        ]);
        return false;
    }
    return true;

}
//----------
function checkEditable(param) {

    return (gw_com_module.v_Option.authority.usable && gw_com_module.v_Option.authority.control == "R") ? false : true;

}
//----------
function checkUpdatable(param) {

    var args = {
        check: param.check,
        target: [
            { type: "GRID", id: "grdData_Sub" }
		],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//==== Retrieve & Insert & Delete Data Functions
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function processRetrieve(param) {
	v_global.logic.work_cd = param.work_cd;
    var args = {
        source: { type: "INLINE",
            argument: [
                { name: "arg_ord_no", value: param.ord_no },
                { name: "arg_work_group", value: param.work_group },
                { name: "arg_work_cd", value: param.work_cd }
            ]
        },
        target: [
            { type: "FORM", id: "frmData_Main", focus: true, select: true },
            { type: "GRID", id: "grdData_D1" },
            { type: "GRID", id: "grdData_D2" },
            { type: "FORM", id: "frmData_MemoA" },
            { type: "FORM", id: "frmData_MemoB" },
            { type: "FORM", id: "frmData_MemoTop" },
            { type: "FORM", id: "frmData_MemoBot" }
		],
        key: param.key
        ,handler_complete: completeRetrieve
    };
    gw_com_module.objRetrieve(args);

}
function completeRetrieve(param) { 

    var args = {
        source: { type: "INLINE",
            argument: [
                { name: "arg_work_cd", value: v_global.logic.work_cd }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_Temp1" }
		],
        handler_complete: processLink
    };
    gw_com_module.objRetrieve(args);

	v_global.logic.size_tp = gw_com_api.getValue("frmData_Main", 1, "size_tp");
	if ( v_global.logic.size_tp == "" ) v_global.logic.size_tp = "LR";

	if ( v_global.logic.size_tp == "TB" ) {
		gw_com_api.show( "frmData_MemoTop" );
		gw_com_api.show( "frmData_MemoBot" );
		gw_com_api.hide( "frmData_MemoA" );
		gw_com_api.hide( "frmData_MemoB" );
	}
	else {
		gw_com_api.hide( "frmData_MemoTop" );
		gw_com_api.hide( "frmData_MemoBot" );
		gw_com_api.show( "frmData_MemoA" );
		gw_com_api.show( "frmData_MemoB" );
	}
}

//----------
function processLink(param) {
    
    v_global.logic.ord_no = gw_com_api.getValue("frmData_Main", 1, "ord_no");
    v_global.logic.work_group = gw_com_api.getValue("frmData_Main", 1, "work_group");
    v_global.logic.work_cd = gw_com_api.getValue("frmData_Main", 1, "work_cd");
    
    var sInputCode = gw_com_api.getValue("frmData_Main", 1, "input_cd");
    if ( v_global.logic.input_cd != sInputCode ) {
		var bClear = (v_global.logic.input_cd=="none")? false : true;
        v_global.logic.input_cd = sInputCode;
        createTableObject({ objType: "GRID", objId: "grdData_Sub", readonly: false, clear: bClear });
    }

    var args = {
        source: { type: "INLINE",
            argument: [
                { name: "arg_ord_no", value: v_global.logic.ord_no },
                { name: "arg_work_group", value: v_global.logic.work_group },
                { name: "arg_work_cd", value: v_global.logic.work_cd }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_Sub" }
        ],
        key: v_global.logic.ord_no
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processInsert(ui) {

    if (ui.object == "lyrMenu_Sub") {
        var args = { targetid: "grdData_Sub", edit: true, updatable: true,
            data: [
                { name: "work_cd", value: gw_com_api.getValue("frmData_Main", 1, "work_cd", false) }
            ]
        };
        gw_com_module.gridInsert(args);
    }
    else if (ui.object == "lyrMenu_D1") {
        var args = { targetid: "grdData_D1", edit: true, updatable: true,
            data: [
                { name: "work_cd", value: gw_com_api.getValue("frmData_Main", 1, "work_cd", false) }
            ]
        };
        gw_com_module.gridInsert(args);
    }
    else if (ui.object == "lyrMenu_D2") {
        var args = { targetid: "grdData_D2", edit: true, updatable: true,
            data: [
                { name: "work_cd", value: gw_com_api.getValue("frmData_Main", 1, "work_cd", false) }
            ]
        };
        gw_com_module.gridInsert(args);
    }
    else {	// 요구서 추가
        var args = { targetid: "frmData_Main", edit: true, updatable: true,
            data: [
                { name: "rqst_dt", value: gw_com_api.getDate("") },
                { name: "pstat", value: "진행(품질)" },
                { name: "astat", value: "작성중" },
                { name: "astat_user", value: gw_com_module.v_Session.USR_ID },
                { name: "rqst_user", value: gw_com_module.v_Session.USR_ID },
                { name: "rqst_user_nm", value: gw_com_module.v_Session.USR_NM },
                { name: "issue_no", value: v_global.logic.issue_no },
                { name: "issue_tp", value: v_global.logic.issue_tp },
                { name: "issue_dept", value: v_global.logic.issue_dept },
                { name: "issue_dt", value: v_global.logic.issue_dt },
                { name: "prod_nm", value: v_global.logic.prod_nm }
            ],
            clear: [
                { type: "GRID", id: "grdData_Sub" },
                { type: "GRID", id: "grdData_D1" },
                { type: "GRID", id: "grdData_D2" }
            ]
        };
        gw_com_module.formInsert(args);
        
        // 대상부서 추가
        processInsert({ object: "lyrMenu_Sub" });
        processInsert({ object: "lyrMenu_D1" });
        processInsert({ object: "lyrMenu_D2" });
    }

}
//----------
function processDelete(ui) {

    if (ui.object == "lyrMenu_Sub") {
        var args = { targetid: "grdData_Sub", row: "selected" }
        gw_com_module.gridDelete(args);
    }
    else if (ui.object == "lyrMenu_File1") {
        var args = { targetid: "grdData_File1", row: "selected" }
        gw_com_module.gridDelete(args);
    }
    else if(ui.object == "lyrMenu_Main") {
		if (!checkManipulate({})) return;
	            
	    var status = checkCRUD({});
	    if (status == "initialize" || status == "create") processClear({});
	    else {
		    v_global.process.handler = processRemove;
	        gw_com_api.messageBox([ { text: "REMOVE" } ], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO", param);
		}
    }
    else return;

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_Main" },
            { type: "GRID", id: "grdData_D1" },
            { type: "GRID", id: "grdData_D2" },
            { type: "FORM", id: "frmData_MemoA" },
            { type: "FORM", id: "frmData_MemoB" },
            { type: "GRID", id: "grdData_Sub" }
        ]
    };
    gw_com_module.objClear(args);

}
//---------- Save
function processSave(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdData_Sub" }
		]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args.handler = { success: successSave };
    gw_com_module.objSave(args);

}
//---------- After Saving
function successSave(response, param) {
	// 다음 작업 조회
    processWorkStep( { step: 1 } );

}
//---------- Remove
function processRemove(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_Main", key: { element: [ { name: "work_cd" } ] } }
        ],
        handler: { success: successRemove, param: param }
    };
    gw_com_module.objRemove(args);

}
//---------- After Removing
function successRemove(response, param) {

    processClear(param);

}
//---------- NCR 발행 통보 : Mail 전송 시작
function processSend(param) {
	
    if (!checkManipulate({})) return;
    if (!checkUpdatable({ check: true })) return false;

    gw_com_api.messageBox([
        { text: "시정조치 요구서에 대한 이메일을 발송합니다." + "<br>" },
        { text: "계속 하시겠습니까?" }
    ], 420, gw_com_api.v_Message.msg_confirmBatch, "YESNO", { type: "NCR-RQST" });

}
//---------- Batch : NCR 발행 통보 처리 Procedure 실행 (PROC_MAIL_QDM_NCR)
function processBatch(param) {
    var args = {
        url: (param.type == "NCR-RQST") ? "COM" : gw_com_module.v_Current.window + ".aspx/" + "Mail",
        procedure: "PROC_MAIL_QDM_NCR", nomessage: true,
        argument: [
            { name: "key_no", value: gw_com_api.getValue("frmData_Main", 1, "work_cd") }
        ],
        input: [
            { name: "type", value: param.type, type: "varchar" },
            { name: "key_no", value: gw_com_api.getValue("frmData_Main", 1, "work_cd"), type: "varchar" },
            { name: "user", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
        ],
        output: [
            { name: "r_value", type: "int" },
            { name: "message", type: "varchar" }
        ],
        handler: { success: successBatch }
    };
    gw_com_module.callProcedure(args);
}
//---------- Batch : Afert Processing
function successBatch(response) {
    gw_com_api.messageBox([ { text: response.VALUE[1] } ], 350);
}
//----------
function processClose(param) {

    v_global.process.handler = processClose;
    if (!checkUpdatable({})) return;
    var args = { ID: gw_com_api.v_Stream.msg_closePage };
    gw_com_module.streamInterface(args);

}
//----------
function closeDialogue(param) {

    var args = { page: param.page };
    gw_com_module.dialogueClose(args);
    if (param.focus) {
        gw_com_api.setFocus(v_global.event.object, v_global.event.row, v_global.event.element,
	                        (v_global.event.type == "GRID") ? true : false);
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_showMessage: { 
            gw_com_module.streamInterface(param); 
        } break;
        case gw_com_api.v_Stream.msg_resultMessage: {
        	// PageId가 다를 때 Skip 
        	if (param.data.page != gw_com_api.getPageID()) { 
        		param.to = { type: "POPUP", page: param.data.page };
                gw_com_module.streamInterface(param);
                break;
            }
            // 확인 메시지별 처리    
            switch (param.data.ID) { 
            	case gw_com_api.v_Message.msg_confirmSave: { 
                	if (param.data.result == "YES") processSave(param.data.arg);
                    else { 
                    	processClear({});
                        if (v_global.process.handler != null) v_global.process.handler(param.data.arg);
                    }
                } break;
                case gw_com_api.v_Message.msg_confirmRemove: { 
                    if (param.data.result == "YES") processRemove(param.data.arg);
                } break;
                case gw_com_api.v_Message.msg_confirmBatch: { 
                    if (param.data.result == "YES") processBatch(param.data.arg);
                } break;
                case gw_com_api.v_Message.msg_informSaved: { 
                    param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                } break;
                case gw_com_api.v_Message.msg_informRemoved: { 
                    param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                } break;
                case gw_com_api.v_Message.msg_informBatched: { 
                    param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                } break;
            }
        } break;
        case gw_com_api.v_Stream.msg_selectedTeam: {
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "dept_cd", param.data.dept_cd,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "dept_nm", param.data.dept_nm,
			                        (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
        } break;
        case gw_com_api.v_Stream.msg_selectedEmployee: {
                if (v_global.event.element == "input_user_nm") {
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, "input_user", param.data.user_id,
			                        (v_global.event.type == "GRID") ? true : false);
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, "input_user_nm", param.data.user_nm,
			                        (v_global.event.type == "GRID") ? true : false);
        	}
            closeDialogue({ page: param.from.page, focus: true });
        } break;
        case gw_com_api.v_Stream.msg_edited_HTML:
            {
                if (param.data.update) {
                    gw_com_api.setValue(v_global.event.object,
                                        v_global.event.row,
                                        v_global.event.element,
			                            param.data.html);
                    gw_com_api.setValue(v_global.event.object,
                                        v_global.event.row,
                                        "memo_text",
			                            param.data.html);
                    gw_com_api.setUpdatable(v_global.event.object);
                }
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_authedSystem: { 
            	closeDialogue({ page: param.from.page });

                v_global.logic.name = param.data.name;
                v_global.logic.password = param.data.password;
                var gw_key = gw_com_api.getValue("frmData_Main", 1, "gw_key");
                var gw_seq = gw_com_api.getValue("frmData_Main", 1, "gw_seq");
                gw_seq = (gw_seq == "") ? 0 : parseInt(gw_seq);
                var args = { url: "COM",
                    procedure: "PROC_APPROVAL_ECCB",
                    input: [
                        { name: "user", value: gw_com_module.v_Session.USR_ID, type: "varchar" },
                        { name: "emp_no", value: gw_com_module.v_Session.EMP_NO, type: "varchar"}/*,
                        { name: "user", value: "goodware", type: "varchar" },
                        { name: "emp_no", value: "10505", type: "varchar" }*/,
                        { name: "eccb_no", value: gw_com_api.getValue("frmData_Main", 1, "eccb_no"), type: "varchar" },
                        { name: "gw_key", value: gw_key, type: "varchar" },
                        { name: "gw_seq", value: gw_seq, type: "int" }
                    ],
                    output: [
                        { name: "r_key", type: "varchar" },
                        { name: "r_seq", type: "int" },
                        { name: "r_value", type: "int" },
                        { name: "message", type: "varchar" }
                    ],
                    handler: { success: successApproval
                    }
                };
                gw_com_module.callProcedure(args); 
                }
            break;
           
        // When Opened Dialogue Winddows
        case gw_com_api.v_Stream.msg_openedDialogue: { 
        	var args = { to: { type: "POPUP", page: param.from.page } };

            switch (param.from.page) { 
                case "DLG_TEAM": { 
                    args.ID = gw_com_api.v_Stream.msg_selectTeam; 
                	} break;
                case "DLG_EMPLOYEE": { 
                    args.ID = gw_com_api.v_Stream.msg_selectEmployee; 
                	} break;
                case "DLG_FileUpload": { 
                	args.ID = gw_com_api.v_Stream.msg_upload_ASFOLDER;
                    args.data = { 
                    	user: gw_com_module.v_Session.USR_ID,
                        key: gw_com_api.getValue("frmData_Main", 1, "work_cd"), seq: 0, crud: "C", revision: 1
                    	};
                	} break;
                case "INFO_VOC": {
                    args.ID = gw_com_api.v_Stream.msg_infoECR;
                    args.data = { 
                    	voc_no: gw_com_api.getValue(v_global.event.object, v_global.event.row, "issue_no", false)
                    	};
                	} break;
                case "INFO_SPC": {
                    args.ID = gw_com_api.v_Stream.msg_infoECR;
                    args.data = { 
                    	issue_no: gw_com_api.getValue(v_global.event.object, v_global.event.row, "issue_no", false)
                    	};
                	} break;
                case "DLG_ISSUE": {
                    args.ID = gw_com_api.v_Stream.msg_infoAS;
                    args.data = { 
                    	issue_no: gw_com_api.getValue(v_global.event.object, v_global.event.row, "issue_no", false)
                    	};
                	} break;
                }
            gw_com_module.streamInterface(args); 
            } break;
        case gw_com_api.v_Stream.msg_closeDialogue: {
        	closeDialogue({ page: param.from.page }); 
        } break;
    }

}