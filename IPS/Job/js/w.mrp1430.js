//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 시정조치 요구서 발행
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
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        // set data for DDDW List
        var args = { request: [
				{ type: "PAGE", name: "제품군", query: "DDDW_CM_CODE",
				    param: [ { argument: "arg_hcode", value: "IEHM06" } ]
				},
				{ type: "PAGE", name: "제품유형", query: "DDDW_CM_CODE",
				    param: [ { argument: "arg_hcode", value: "ISCM25" } ]
				},
                { type: "INLINE", name: "입력유형",
                    data: [ { title: "text", value: "text" }, { title: "select", value: "select" }
                    	  , { title: "file", value: "file" }, { title: "button", value: "button" } ]
                },
                { type: "INLINE", name: "선택코드",
                    data: [ { title: "-", value: "" }, { title: "InputCheck", value: "InputCheck" } ]
                },
                { type: "INLINE", name: "Alignment",
                    data: [ { title: "center", value: "center" }, { title: "left", value: "left" }, { title: "right", value: "right" } ]
                }
			],
            starter: start
        };
        gw_com_module.selectSet(args);

        //----------
        function start() { 
        	gw_job_process.UI(); 
        	gw_job_process.procedure();
        }
    },

    // manage UI. (design section)
    UI: function () {

        //==== Main Menu : 조회, 추가, 삭제, 저장, 닫기
        var args = { targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "조회", value: "조회", act: true },
				{ name: "추가", value: "추가", icon: "추가" },
				{ name: "삭제", value: "삭제", icon: "삭제" },
				{ name: "저장", value: "저장", icon: "저장" },
				{ name: "닫기", value: "닫기" }
			]
        };
        gw_com_module.buttonMenu(args);
        
        //==== Main Menu : 추가, 삭제, 미리보기
        var args = { targetid: "lyrMenu_Sub", type: "FREE",
            element: [
				{ name: "추가", value: "추가", icon: "추가" },
				{ name: "삭제", value: "삭제", icon: "삭제" },
				{ name: "미리보기", value: "미리보기", icon: "기타", hidden: true }
			]
        };
        gw_com_module.buttonMenu(args);

        //==== Search Option : 
        var args = { targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true, remark: "lyrRemark",
            editable: { focus: "input_nm", validate: true },
            content: { row: [
                    { element: [
			            { name: "input_cd", label: { title: "Code :" }, editable: { type: "text", size: 10, maxlength: 10 } },
			            { name: "input_nm", label: { title: "Category :" }, editable: { type: "text", size: 20, maxlength: 50 } }
                    	]
                    },
                    { element: [
			            { name: "input_nm", label: { title: "Description :" }, editable: { type: "text", size: 40, maxlength: 150 } }
                    	]
                    },
                    { element: [
			            { name: "실행", value: "실행", act: true, format: { type: "button" } },
			            { name: "취소", value: "취소", format: { type: "button", icon: "닫기" } }
				        ], align: "right"
                    }
			    ]
            }
        };
        gw_com_module.formCreate(args);

        //==== Main Grid : Check Item Category
        var args = { targetid: "grdData_Main", query: "w_mrp1430_M_1", title: "Check Item Category",
            width: "100%", height: 160, show: true, selectable: true, // number: true, multi: true, checkrow: true, dynamic: true,
			editable: { bind: "select", focus: "input_cd", validate: true },
            element: [
				{ header: "Code", name: "input_cd", width: 80, align: "center",
					editable: { type: "text", validate: { rule: "required"} } 
				},
				{ header: "Catetory", name: "input_nm", width: 250, align: "left",
					editable: { type: "text", validate: { rule: "required"} } 
				},
				{ header: "Description", name: "input_desc", width: 750, align: "left",
					editable: { type: "text" } 
				}
			]
        };
        gw_com_module.gridCreate(args);
        
        //==== Main Grid : Column Definition
        var args = { targetid: "grdData_Sub", query: "w_mrp1430_S_1", title: "Column Definition",
            width: "100%", height: 180, show: true, selectable: true, // number: true, multi: true, checkrow: true, dynamic: true,
			editable: { multi: true, bind: "select", focus: "sort_seq", validate: true },
            element: [
				{ header: "순서", name: "sort_seq", width: 50, align: "center",
					editable: { type: "text", validate: { rule: "required"} }
				},
				{ header: "항목ID", name: "col_nm", width: 120, align: "left",
					editable: { type: "text", validate: { rule: "required"} } 
				},
				{ header: "열제목", name: "col_title", width: 300, align: "left",
					editable: { type: "text", validate: { rule: "required"} } 
				},
				{ header: "Size", name: "col_size", width: 60, align: "center",
					editable: { type: "text", validate: { rule: "required"} } 
				},
				{ header: "수정", name: "edit_yn", width: 60, align: "center",
					format: { type: "checkbox", title: "", value: "1", offval: "0" },
					editable: { type: "checkbox", title: "", value: "1", offval: "0" } 
				},
				{ header: "Alignment", name: "col_align", width: 100, align: "center",
					editable: { type: "select", validate: { rule: "required" }, data: { memory: "Alignment" } } 
				},
				{ header: "입력유형", name: "input_tp", width: 100, align: "center",
					editable: { type: "select", validate: { rule: "required" }, data: { memory: "입력유형" } } 
				},
				{ header: "선택코드", name: "code_nm", width: 100, align: "center",
					editable: { type: "select", data: { memory: "선택코드" } } 
				},
				{ name: "rspan_yn", hidden: true, editable: { type: "hidden" } },
				{ name: "col_seq", hidden: true, editable: { type: "hidden" } },
				{ name: "input_cd", hidden: true, editable: { type: "hidden" } }
			]
        };
        gw_com_module.gridCreate(args);
        
        //==== Sub Grid : 미리보기
        var args = { targetid: "grdData_D1", query: "w_mrp1430_D_1", title: "Preview", hidden: true,
            caption: true, height: 20, pager: false, show: true, dynamic: true, //selectable: true, key: true,
            element: [
				{ header: "첫 번째 열", name: "input_val1", width: 100, align: "center" },
				{ header: "점검자", name: "input_user_nm", width: 100, align: "center", mask: "search", display: false },
				{ header: "점검일자", name: "input_dt", width: 100, align: "center", mask: "date-ymd" },
				{ header: "비고", name: "input_val6", width: 700, align: "left" }
			]
        };
        gw_com_module.gridCreate(args);

        //==== Resize Objects
        var args = {
            target: [
				{ type: "GRID", id: "grdData_Main", offset: 8 },
				{ type: "GRID", id: "grdData_Sub", offset: 8 },
                { type: "GRID", id: "grdData_D1", offset: 8 }
			]
        };
        gw_com_module.objResize(args);
        gw_com_module.informSize();

    },

    //==== manage process. (program section)
    procedure: function () {

        //==== Button Click : Main ====
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: click_lyrMenu_조회 };
        gw_com_module.eventBind(args);
        function click_lyrMenu_조회(ui) { viewOption(); }
        //----------
        var args = { targetid: "lyrMenu", element: "추가", event: "click", handler: processInsert };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "삭제", event: "click", handler: processDelete };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: click_lyrMenu_저장 };
        gw_com_module.eventBind(args);
        function click_lyrMenu_저장(ui) { processSave({ main: true }); }
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: click_lyrMenu_닫기 };
        gw_com_module.eventBind(args);
        function click_lyrMenu_닫기(ui) { processClose({}); }
        //----------
        
        //==== Button Click : Sub : 추가, 삭제, 미리보기 ====
        var args = { targetid: "lyrMenu_Sub", element: "추가", event: "click", handler: processInsert };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_Sub", element: "삭제", event: "click", handler: processDelete };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_Sub", element: "미리보기", event: "click", handler: click_lyrMenu_Sub_보기 };
        gw_com_module.eventBind(args);
        function click_lyrMenu_Sub_보기(ui) { processPreview({ sub: true }); }


        //==== Button Click : Search Option ====
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: click_frmOption_실행 };
        gw_com_module.eventBind(args);
        function click_frmOption_실행(ui) { processRetrieve({}); }
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: click_frmOption_취소 };
        gw_com_module.eventBind(args);
        function click_frmOption_취소(ui) { closeOption({}); }

        //==== Grid Events : Main
        var args = { targetid: "grdData_Main", grid: true, event: "rowselected", handler: rowselected_grdData_Main };
        gw_com_module.eventBind(args);
        function rowselected_grdData_Main(ui) { processLink({}); }

        // startup process.
        gw_com_module.startPage();

    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function viewOption() {
    var args = { target: [ { id: "frmOption", focus: true } ] };
    gw_com_module.objToggle(args);
}

function getMaxSeq(gridId, colId){
	var nRowCnt = gw_com_api.getRowCount(gridId);
	var nNewSeq = 0;
	
	for (var i = 1; i <= nRowCnt; i++) {
			var sCurVal = gw_com_api.getValue(gridId, i, colId, true, false);
			if (sCurVal > nNewSeq) nNewSeq = sCurVal;
	}
	
	return nNewSeq + 1;
}
//----------
function processInsert(ui) {

    if (ui.object == "lyrMenu_Sub") {
    	//if (!checkManipulate({ sub: true })) return false;

        var args = { targetid: "grdData_Sub", edit: true, updatable: true,
            data: [
                { name: "input_cd", value: gw_com_api.getValue("grdData_Main", "selected", "input_cd", true) },
                { name: "col_seq", value: getMaxSeq("grdData_Sub", "col_seq") },
                { name: "col_size", value: 10 },
                { name: "col_align", value: "center" },
                { name: "input_tp", value: "text" },
            ]
        };
        gw_com_module.gridInsert(args);
    }
    else {
        var args = { targetid: "grdData_Main", edit: true, updatable: true,
            data: [
                { name: "input_nm", value: "new" }
            ]
        };
        gw_com_module.gridInsert(args);
    }
}
//----------
function processPreview( param ) {
	
    if (gw_com_api.getSelectedRow("grdData_Main") == null) {
        gw_com_api.messageBox([ { text: "선택된 대상이 없습니다." } ], 300);
        return false;
    }

}
//----------
function processSave( param ) {
	
    if (gw_com_api.getSelectedRow("grdData_Main") == null) {
        gw_com_api.messageBox([ { text: "선택된 대상이 없습니다." } ], 300);
        return false;
    }

    var args = { url: "COM",
        target: [
			{ type: "GRID", id: "grdData_Main" }
		  , { type: "GRID", id: "grdData_Sub" }
		]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args.handler = { success: successSave };
    gw_com_module.objSave(args);
}
//----------
function successSave(response, param) {
	processRetrieve({});
    $.each(response, function () {
        $.each(this.KEY, function () { 
        	if (this.NAME == "input_cd") { 
        		v_global.logic.key = this.VALUE;
                processRetrieve({ key: v_global.logic.key }); 
            }
        });
    });
}
//----------
//----------
function processDelete(ui) {

    if(ui.object == "lyrMenu") {
    	// 삭제 여부 확인 후 삭제 처리 
	    v_global.process.handler = processRemove;
		checkRemovable(ui)
    }
    else if(ui.object == "lyrMenu_Sub") {
        var args = { targetid: "grdData_Sub", row: "selected" }
        gw_com_module.gridDelete(args);
    }
    else return;

}
//----------
function checkRemovable(ui) {
    gw_com_api.hide("frmOption");

    var status = gw_com_api.getCRUD(ui.object, "selected", true);
    if (status == "initialize" || status == "create")
        processClear({});
    else
        gw_com_api.messageBox([
            { text: "REMOVE" }
        ], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO", param);
}
//----------
function processRemove(param) {

    var args = {};
    args = { url: "COM",
        target: [
		    { type: "GRID", id: "grdData_Main"
                , key: [ { row: "selected"
                	, element: [ { name: "input_cd" } ] } ]
            }
	    ],
        handler: { success: successRemove }
    };
    args.handler = { success: successRemove, param: param };
    gw_com_module.objRemove(args);
}
//----------
function successRemove(response, param) {
        var args = { targetid: "grdData_Main", row: "selected"
        }
        gw_com_module.gridDelete(args);
}
//----------
function processRetrieve(param) {

	// Validate Inupt Options
    var args = { target: [ { type: "FORM", id: "frmOption" } ] };
    if (gw_com_module.objValidate(args) == false) return false;

	// Retrieve 
    var args = { key: param.key,
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
				{ name: "input_cd", argument: "arg_input_cd" },
				{ name: "input_nm", argument: "arg_input_nm" },
				{ name: "input_desc", argument: "arg_input_desc" }
			],
            remark: [
		        { element: [{ name: "input_cd"}, { name: "input_nm"}, { name: "input_desc"}] }
		    ]
        },
        target: [
            { type: "GRID", id: "grdData_Main", focus: true, select: true }
	    ],
        clear: [
			{ type: "GRID", id: "grdData_Sub" },
			{ type: "GRID", id: "grdData_D1" }
        ]
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {
    var args = { key: param.key,
        source: { type: "GRID", id: "grdData_Main", row: "selected", block: true,
            element: [
				{ name: "input_cd", argument: "arg_input_cd" }
			]
        },
        target: [
            { type: "GRID", id: "grdData_Sub", focus: true, select: true }
        ]
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processClose(param) {

    var args = { ID: gw_com_api.v_Stream.msg_closePage };
    gw_com_module.streamInterface(args);

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

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
        case gw_com_api.v_Stream.msg_showMessage:
            {
                gw_com_module.streamInterface(param);
            }
            break;
        case gw_com_api.v_Stream.msg_resultMessage:
            {
                if (param.data.page != gw_com_api.getPageID()) {
                    param.to = { type: "POPUP", page: param.data.page };
                    gw_com_module.streamInterface(param);
                    break;
                }
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
        case gw_com_api.v_Stream.msg_retrieve:
            {
                processRetrieve({ key: param.data.key });
            }
            break;
        case gw_com_api.v_Stream.msg_remove:
            {
                var args = { targetid: "grdData_Main", row: v_global.event.row }
                gw_com_module.gridDelete(args);
            } break;
        case gw_com_api.v_Stream.msg_openedDialogue: {   
            	var args = { to: { type: "POPUP", page: param.from.page } };
                switch (param.from.page) {
                    case "INFO_VOC": {
                        args.ID = gw_com_api.v_Stream.msg_infoECR;
                    } break;
                    case "INFO_SPC": {
                        args.ID = gw_com_api.v_Stream.msg_infoECR;
                    } break;
                    case "DLG_ISSUE": {
                        args.ID = gw_com_api.v_Stream.msg_infoAS;
                    } break;
                }
                args.data = {
                    issue_no: gw_com_api.getValue(v_global.event.object, v_global.event.row, "issue_no", true),
                    voc_no: gw_com_api.getValue(v_global.event.object, v_global.event.row, "issue_no", true)
                }
                gw_com_module.streamInterface(args);
            } break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                closeDialogue({ page: param.from.page });
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//