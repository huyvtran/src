//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 고분보 관리 > 고분보 등록
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

        // prepare dialogue. ---그룹웨어 로그인
        //        var args = { type: "PAGE", page: "IFProcess", path: "../Master/", title: "그룹웨어 로그인",
        //            width: 430, height: 90, locate: ["center", 200]
        //        };
        //        gw_com_module.dialoguePrepare(args);

        // set data for DDDW List
        var args = { request: [
                { type: "PAGE", name: "부위구분", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "IEHM60"}]
                },
                { type: "PAGE", name: "대책구분", query: "dddw_zcoded",
                    param: [{ argument: "arg_hcode", value: "IEHM67"}]
                },
                { type: "PAGE", name: "Item구분", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "IEHM69"}]
                },
                { type: "PAGE", name: "처리결과", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "QDM022"}]
                },
                { type: "INLINE", name: "입력유형",
                    data: [{ title: "확인", value: "CHECK" }, { title: "측정값", value: "VALUE"}]
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

            processRetrieve( {} );
        }

    },

    // manage UI. (design section)
    UI: function () {

        //==== Main Menu : 
        var args = { targetid: "lyrMenu_Main", type: "FREE",
            element: [
                { name: "조회", value: "조회" },
				{ name: "저장", value: "저장" },
				{ name: "추가", value: "추가" },
				{ name: "삭제", value: "삭제" },
                { name: "적용", value: "적용", icon: "기타" },
				{ name: "닫기", value: "닫기" }
			]
        };
        gw_com_module.buttonMenu(args);

        //==== Sub Menu : 추가, 삭제
        var args = { targetid: "lyrMenu_Sub", type: "FREE",
            element: [
				{ name: "추가", value: "추가" },
				{ name: "삭제", value: "삭제" }
			]
        };
        gw_com_module.buttonMenu(args);

        ////==== 첨부파일 Menu : 추가, 삭제
        //var args = { targetid: "lyrMenu_File1", type: "FREE",
        //    element: [
		//		{ name: "추가", value: "추가" },
		//		{ name: "삭제", value: "삭제" }
		//	]
        //};
        //gw_com_module.buttonMenu(args);

        //==== Main Grid : 작업분류
        var args = { targetid: "grdData_Main", query: "w_mrp1440_M_1", title: "작업 분류",
            caption: true, height: 120, pager: false, show: true, selectable: true, number: true,
            editable: { multi: false, bind: "select", focus: "group_cd", validate: true },
            element: [
                { header: "분류코드", name: "group_cd", width: 80, align: "center", editable: { type: "text", validate: { rule: "required" } } },
                { header: "분류명", name: "group_nm", width: 200, align: "left", editable: { type: "text", validate: { rule: "required" } } },
                { header: "입력유형", name: "rmk", width: 120, align: "left"
                	, editable: { type: "select", data: { memory: "입력유형" }, validate: { rule: "required" } }
                },
                { header: "등록자", name: "ins_usr_nm", width: 80, align: "center", editable: { type: "hidden" } },
                { header: "등록일시", name: "ins_dt", width: 120, align: "left" },
                { header: "수정자", name: "upd_usr_nm", width: 80, align: "center", editable: { type: "hidden" } },
                { header: "수정일시", name: "upd_dt", width: 120, align: "left" }
			]
        };
        gw_com_module.gridCreate(args);

        //==== Sub Grid : 작업일람
        var args = { targetid: "grdData_Sub", query: "w_mrp1440_S_1", title: "작업 일람",
            caption: true, height: "300", pager: false, show: true, selectable: true, //number: true,
            editable: { multi: true, bind: "select", focus: "sort_seq", validate: true },
            element: [
                { header: "순번", name: "sort_seq", width: 40, align: "center", editable: { type: "text", validate: { rule: "required" } } },
                { header: "구분", name: "item_nm", width: 160, align: "center", editable: { type: "text", validate: { rule: "required" } } },
                { header: "작업명", name: "item_desc", width: 700, align: "left", editable: { type: "text" } },
                { header: "비고", name: "rmk", width: 120, align: "left", editable: { type: "text" } },
                { name: "item_id", hidden: true, editable: { type: "hidden" } },
                { name: "group_cd", hidden: true, editable: { type: "hidden" } }
			]
        };
        gw_com_module.gridCreate(args);

        ////==== Attach File Grid : 첨부 파일
        //var args = { targetid: "grdData_File1", query: "DLG_FILE_ZFILE_V", title: "첨부 문서",
        //    caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
        //    editable: { multi: true, bind: "select", focus: "file_desc", validate: true },
        //    element: [
		//		{ header: "파일명", name: "file_nm", width: 250, align: "left" },
		//		{ header: "등록부서", name: "upd_dept", width: 100, align: "center" },
		//		{ header: "등록자", name: "upd_usr", width: 60, align: "center" },
		//		{ header: "사업부", name: "file_group1", width: 80, align: "center", hidden: true },
		//		{ header: "업무구분", name: "file_group2", width: 80, align: "center" },
		//		{ header: "문서분류", name: "file_group3", width: 80, align: "center" },
		//		{ header: "고객사", name: "file_group4", width: 80, align: "center", hidden: true },
		//		{ header: "Category", name: "file_group5", width: 80, align: "center", hidden: true },
		//		{ header: "다운로드", name: "download", width: 60, align: "center",
		//		    format: { type: "link", value: "다운로드" }
		//		},
		//		{ header: "파일설명", name: "file_desc", width: 380, align: "left",
		//		    editable: { type: "text" }
		//		},
        //        { name: "file_ext", hidden: true },
        //        { name: "file_path", hidden: true },
        //        { name: "network_cd", hidden: true },
        //        { name: "data_tp", hidden: true },
        //        { name: "data_key", hidden: true },
        //        { name: "data_seq", hidden: true },
        //        { name: "file_id", hidden: true, editable: { type: "hidden"} }
		//	]
        //};
        //gw_com_module.gridCreate(args);

        //==== File Download Layer
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);

        //==== Resize Objects
        var args = { target: [
				{ type: "GRID", id: "grdData_Main", offset: 8 },
                { type: "GRID", id: "grdData_Sub", offset: 8 }
			]
        };
        gw_com_module.objResize(args);
        gw_com_module.informSize();
    },

    //==== manage process. (program section)
    procedure: function () {

        //==== Button Click : Main (상세, 저장, 통보, 삭제, 닫기) ====
        //----------
        var args = { targetid: "lyrMenu_Main", element: "조회", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_Main", element: "저장", event: "click", handler: processSave };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_Main", element: "추가", event: "click", handler: processInsert };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_Main", element: "삭제", event: "click", handler: processDelete };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_Main", element: "적용", event: "click", handler: processSend };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_Main", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);

        //==== Button Click : Sub ====
        //----------
        var args = { targetid: "lyrMenu_Sub", element: "추가", event: "click", handler: processInsert };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_Sub", element: "삭제", event: "click", handler: processDelete };
        gw_com_module.eventBind(args);

        //==== 첨부파일 : 추가/삭제/Down ====
        //var args = { targetid: "lyrMenu_File1", element: "추가", event: "click", handler: click_lyrMenu_File1_추가 };
        //gw_com_module.eventBind(args);
        //var args = { targetid: "lyrMenu_File1", element: "삭제", event: "click", handler: click_lyrMenu_File1_삭제 };
        //gw_com_module.eventBind(args);
        //var args = { targetid: "grdData_File1", grid: true, element: "download", event: "click", handler: click_File_DownLoad };
        //gw_com_module.eventBind(args);
        ////----------
        //function click_lyrMenu_File1_추가(ui) { processUpload(ui); }
        //function click_lyrMenu_File1_삭제(ui) { processDelete(ui); }
        //function click_File_DownLoad(ui) { 
        //	gw_com_module.downloadFile({ source: { id: ui.object, row: ui.row }, targetid: "lyrDown" });
        //}

        //==== Grid Events : Main
        //----------
        var args = { targetid: "grdData_Main", grid: true, event: "rowselected", handler: rowselected_grdData_Sub };
        gw_com_module.eventBind(args);
        function rowselected_grdData_Sub(ui) { if (ui.status) processLink(ui); }

        // startup process.
        gw_com_module.startPage();

    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//---------- ItemChanged Event 처리
function processItemChanged(ui) {

    if (!checkEditable({})) return;

    var vl = ui.value.current;

    if (ui.element == "Remark") {   // 복수행 입력란의 개행문자 치환
        vl = vl.replace(/\r\n/g, "CRLF");
        gw_com_api.setValue("grdData_Sub", "selected", ui.element, vl, true);
    }

    //string.substring(start, length)   
    //string.replace("A","B")

}
//----------
function checkCRUD(param) {

    if (param.main) {
        var obj = "grdData_Main";
        if (checkEditable({}))
            return gw_com_api.getCRUD(obj, "selected", true);
        else
            return ((gw_com_api.getSelectedRow(obj) == null) ? false : true);
    }
    else return gw_com_api.getCRUD("grdData_Sub");

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
            { type: "GRID", id: "grdData_Main" },
            { type: "GRID", id: "grdData_Sub" }
			//,{ type: "GRID", id: "grdData_File1" }
		],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function processRetrieve(param) {

    var args = {
        source: { type: "INLINE"
            ,argument: [
                { name: "arg_group_cd", value: v_global.logic.key },
                { name: "arg_data_key", value: v_global.logic.key },	// 첨부파일용
                { name: "arg_data_seq", value: -1 }	// 첨부파일용
            ]
        },
        target: [
			{ type: "GRID", id: "grdData_Main", select: true } 	//checkEditable({}) ? false : 
			//,{ type: "GRID", id: "grdData_File1" }
		],
        clear: [
            { type: "GRID", id: "grdData_Sub" }
		],
        key: v_global.logic.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {
    var args = {};

    if (param.object == "grdData_Main") {
        args = { 
            key: param.key,
            source: { type: "GRID", id: "grdData_Main", row: "selected", block: true,
                element: [
				    { name: "group_cd", argument: "arg_group_cd" }
			    ]
            },
            target: [
                { type: "GRID", id: "grdData_Sub" }
		    ]
        };
    }
    else if (param.object == "grdData_File1") {
        args = { 
            key: param.key,
            source: { type: "GRID", id: "grdData_Main",
                element: [ { name: "rqst_no", argument: "arg_data_key" } ],
	            argument: [ { name: "arg_data_seq", value: -1 } ]
            },
            target: [ { type: "GRID", id: "grdData_File1", select: true } ]
        };
    }
    else return;

    gw_com_module.objRetrieve(args);

}
//----------
function processInsert(ui) {

    if (ui.object == "lyrMenu_Sub") {
    	//if (!checkManipulate({ main: true })) return false;

        var args = { targetid: "grdData_Sub", edit: true, updatable: true,
            data: [
                { name: "group_cd", value: gw_com_api.getValue("grdData_Main", "selected", "group_cd", true) }
            ]
        };
        gw_com_module.gridInsert(args);
    }
    else {	// 요구서 추가
    	if (!checkManipulate({ main: true })) return false;

        var args = { targetid: "grdData_Main", edit: true, updatable: true,
            data: [
                { name: "group_cd", value: "New" }
            ]
        };
        gw_com_module.gridInsert(args);
        
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
	        gw_com_api.messageBox([ { text: "REMOVE" } ], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO", ui);
		}
    }
    else return;

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdData_Main" },
            { type: "GRID", id: "grdData_Sub" }
            //,{ type: "GRID", id: "grdData_File1" }
        ]
    };
    gw_com_module.objClear(args);

}
//---------- Save
function processSave(param) {

    var args = {
        target: [
			{ type: "GRID", id: "grdData_Main" },
            { type: "GRID", id: "grdData_Sub" }
			//,{ type: "GRID", id: "grdData_File1" }
		]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args.handler = { success: successSave };
    gw_com_module.objSave(args);

}
//---------- After Saving
function successSave(response, param) {

    $.each(response, function () {
        $.each(this.KEY, function () { 
        	if (this.NAME == "group_cd") { 
        		v_global.logic.key = this.VALUE;
                processRetrieve({ key: v_global.logic.key }); 
            }
        });
    });

}
//---------- Remove
function processRemove(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdData_Main", key: { element: [ { name: "group_cd" } ] } }
        ],
        handler: { success: successRemove, param: param }
    };
    gw_com_module.objRemove(args);

}
//---------- After Removing
function successRemove(response, param) {

    processClear(param);

}
//---------- 적용
function processSend(param) {
	
    if (!checkManipulate({})) return;
    if (!checkUpdatable({ check: true })) return false;

    gw_com_api.messageBox([
        { text: "진행 중인 Project 전체에 대하여 현재의 구성을 재적용합니다.." + "<br>" },
        { text: "계속 하시겠습니까?" }
    ], 420, gw_com_api.v_Message.msg_confirmBatch, "YESNO", { type: "MRP-EQHISTORY" });

}
//---------- Batch : 적용 Procedure 실행 (PROC_MRP_EQHISTORY)
function processBatch(param) {
	var GroupCd = gw_com_api.getValue( "grdData_Main", "selected", "group_cd" );
    var args = {
        url: "COM",
        procedure: "PROC_MRP_EQHISTORY", nomessage: true,
        argument: [
            { name: "key_no", value: GroupCd }
        ],
        input: [
            { name: "type", value: param.type, type: "varchar" },
            { name: "key_no", value: GroupCd, type: "varchar" },
            { name: "key_seq", value: "0", type: "varchar" },
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
//---------- 파일 추가/수정/Rev
//function processUpload(param) {

//    // Check
//    if (!checkManipulate({})) return;
//    if (!checkUpdatable({ check: true })) return false;

//    // Parameter 설정
//    v_global.logic.FileUp = {
//    	type: "고분보-RQST",
//        key: gw_com_api.getValue("grdData_Main", 1, "rqst_no"),
//        seq: 0,
//        user: gw_com_module.v_Session.USR_ID,
//        crud: "C",  rev: 0, revise: false
//    };

//    // Prepare File Upload Window
//    var args = { type: "PAGE", page: "DLG_FileUpload", title: "파일 업로드", datatype: "고분보-RQST", 
//    	width: 650, height: 260, open: true, locate: ["center", "top"] }; //

//    if (gw_com_module.dialoguePrepare(args) == false) {
//    	// 아래 로직은 두 번째 Open 부터 작동함. 첫 번째는 streamProcess 에 의함
//        var args = { page: "DLG_FileUpload",
//            param: { ID: gw_com_api.v_Stream.msg_upload_ASFOLDER, data: v_global.logic.FileUp }
//        };
//        gw_com_module.dialogueOpen(args);
//    }
    
//}

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
        case gw_com_api.v_Stream.msg_selectedSupplier: {
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "supp_cd", param.data.supp_cd,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "supp_nm", param.data.supp_nm,
			                        (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
        } break;
        case gw_com_api.v_Stream.msg_selectedTeam: {
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "dept_cd", param.data.dept_cd,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "dept_nm", param.data.dept_nm,
			                        (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
        } break;
        case gw_com_api.v_Stream.msg_selectedEmployee: {
        	if ( v_global.event.element == "rslt_user_nm" ) {
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "rslt_user", param.data.user_id,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "rslt_user_nm", param.data.user_nm,
			                        (v_global.event.type == "GRID") ? true : false);
        	}
        	else if ( v_global.event.element == "rqst_user_nm" ) {
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "rqst_user", param.data.user_id,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "rqst_user_nm", param.data.user_nm,
			                        (v_global.event.type == "GRID") ? true : false);
        	}
        	else if ( v_global.event.element == "user_nm" ) {
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "user_id", param.data.user_id,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "user_nm", param.data.user_nm,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "dept_cd", param.data.dept_cd,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "dept_nm", param.data.dept_nm,
			                        (v_global.event.type == "GRID") ? true : false);
        	}
            closeDialogue({ page: param.from.page, focus: true });
        } break;
        case gw_com_api.v_Stream.msg_uploaded_ASFOLDER: {
            closeDialogue({ page: param.from.page });
        	processLink( { object: "grdData_File1" } ) ;
        } break;
        case gw_com_api.v_Stream.msg_authedSystem: { 
            	closeDialogue({ page: param.from.page });

                v_global.logic.name = param.data.name;
                v_global.logic.password = param.data.password;
                var gw_key = gw_com_api.getValue("grdData_Main", 1, "gw_key");
                var gw_seq = gw_com_api.getValue("grdData_Main", 1, "gw_seq");
                gw_seq = (gw_seq == "") ? 0 : parseInt(gw_seq);
                var args = { url: "COM",
                    procedure: "PROC_APPROVAL_ECCB",
                    input: [
                        { name: "user", value: gw_com_module.v_Session.USR_ID, type: "varchar" },
                        { name: "emp_no", value: gw_com_module.v_Session.EMP_NO, type: "varchar"}/*,
                        { name: "user", value: "goodware", type: "varchar" },
                        { name: "emp_no", value: "10505", type: "varchar" }*/,
                        { name: "eccb_no", value: gw_com_api.getValue("grdData_Main", 1, "eccb_no"), type: "varchar" },
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
                case "w_find_supplier": { 
                    args.ID = gw_com_api.v_Stream.msg_selectSupplier; 
                } break;
                case "DLG_TEAM": { 
                    args.ID = gw_com_api.v_Stream.msg_selectTeam; 
                } break;
                case "DLG_EMPLOYEE": { 
                    args.ID = gw_com_api.v_Stream.msg_selectEmployee; 
                } break;
                case "DLG_FileUpload": { 
                	args.ID = gw_com_api.v_Stream.msg_upload_ASFOLDER;
                	args.data = v_global.logic.FileUp;
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