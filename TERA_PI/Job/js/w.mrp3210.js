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
                { type: "PAGE", name: "공정구분", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "ISCM26"}]
                },
                { type: "PAGE", name: "작업그룹", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "IPOP11"}]
                },
                { type: "INLINE", name: "합불판정",
                    data: [ { title: "합격", value: "1" }, { title: "불합격", value: "0" } ]
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
        	closeOption({});

	        if (v_global.process.param != "") {	// Page Parameter 변수 저장
	            v_global.logic.ord_no = gw_com_api.getPageParameter("ord_no");
	            v_global.logic.proj_no = gw_com_api.getPageParameter("proj_no");
	        	gw_com_api.setValue("frmOption", 1, "ord_no", v_global.logic.ord_no);
	        	gw_com_api.setValue("frmOption", 1, "proj_no", v_global.logic.proj_no);
	        }
        	processRetrieve({});
        }
    },

    // manage UI. (design section)
    UI: function () {

        //==== Main Menu : 조회, 접수, 반려, 닫기
        var args = { targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "조회", value: "조회", act: true },
				{ name: "보기", value: "보기", icon: "추가" },
				{ name: "작성", value: "작성", icon: "저장" },
				{ name: "닫기", value: "닫기" }
			]
        };
        gw_com_module.buttonMenu(args);
        
        //==== Search Option : 
        var args = { targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true, remark: "lyrRemark",
            editable: { focus: "astat", validate: true },
            content: { row: [
                    { element: [
			            { name: "proj_no", label: { title: "Project No. :" }, editable: { type: "text" }
			            	, value: "Test130321" },	// Test by JJJ
			            { name: "ord_no", hidden: true, editable: { type: "hidden" } }
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

        //==== Main Grid : 작업 List
        var args = { targetid: "grdData_Main", query: "w_mrp3210_M_1", title: "작업 그룹",
            width:542, height: 400, show: true, selectable: true, dynamic: true, // number: true, multi: true, checkrow: true,
            element: [
				//{ header: "제품유형", name: "prod_type", width: 50, align: "center" },
				{ header: "제품명", name: "prod_nm", width: 150, align: "center" },
				//{ header: "Proj. No.", name: "proj_no", width: 80, align: "center" },
				{ header: "작업그룹", name: "work_group_nm", width: 150, align: "center" },
				{ header: "Process", name: "cust_proc", width: 80, align: "center" },
				{ header: "총항목수", name: "item_cnt", width: 60, align: "center" },
				{ header: "완료건수", name: "input_cnt", width: 60, align: "center" },
				{ name: "ord_no", hidden: true },
				{ name: "proj_no", hidden: true },
				{ name: "prod_type", hidden: true },
				{ name: "work_group", hidden: true }
			]
        };
        gw_com_module.gridCreate(args);
        
        //==== Main Grid : 작업 List
        var args = { targetid: "grdData_Sub", query: "w_mrp3210_S_1", title: "작업 List",
            width:580, height: 400, show: true, selectable: true, dynamic: true, number: true, // multi: true, checkrow: true,
            element: [
				//{ header: "순서", name: "work_seq", width: 40, align: "center" },
				{ header: "작업명", name: "work_nm", width: 200, align: "left" },
				{ header: "생산공정", name: "mprc_no", width: 60, align: "center" },
				{ header: "총항목수", name: "item_cnt", width: 50, align: "center" },
				{ header: "완료건수", name: "input_cnt", width: 50, align: "center" },
				{ name: "prod_type", hidden: true },
				{ name: "ord_no", hidden: true },
				{ name: "work_cd", hidden: true },
				{ name: "mprc_cd", hidden: true },
				{ name: "work_seq", hidden: true },
				{ name: "work_group", hidden: true },
                { name: "input_cd", hidden: true }
			]
        };
        gw_com_module.gridCreate(args);
        
        //==== Sub Grid : 진행 이력
        var args = { targetid: "grdData_이력", query: "w_mrp1410_M_1", title: "변경 이력", hidden: true,
            caption: true, height: 100, pager: false, show: false, selectable: true, key: true, dynamic: true,
            element: [
				{ header: "제품유형", name: "prod_type", width: 50, align: "center" },
				{ header: "생산공정", name: "mprc_cd", width: 80, align: "center" },
				{ header: "작업그룹", name: "work_group", width: 80, align: "center" },
				{ header: "작업코드", name: "work_cd", width: 50, align: "center" },
				{ header: "작업명칭", name: "work_nm", width: 100, align: "center" },
				{ header: "작업순서", name: "work_seq", width: 60, align: "center" },
				{ header: "사용", name: "use_yn", width: 40, align: "center" },
				{ header: "적용일자", name: "app_dt", width: 70, align: "center", mask: "date-ymd" },
				{ header: "작성자", name: "edit_user", width: 60, align: "center" },
				{ header: "비고", name: "use_yn", width: 200, align: "center" }
			]
        };
        gw_com_module.gridCreate(args);

        //==== Resize Objects
        var args = {
            target: [
				{ type: "GRID", id: "grdData_Main", offset: 8 },
				{ type: "GRID", id: "grdData_Sub", offset: 8 },
                { type: "GRID", id: "grdData_이력", offset: 8 }
			]
        };
        gw_com_module.objResize(args);
        gw_com_module.informSize();

    },

    //==== manage process. (program section)
    procedure: function () {

        //==== Button Click : Main ====
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: viewOption };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "보기", event: "click", handler: processEdit };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "작성", event: "click", handler: processEdit };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: click_lyrMenu_닫기 };
        gw_com_module.eventBind(args);
        function click_lyrMenu_닫기(ui) { processClose({}); }
        //----------
        
        //==== Button Click : Search Option ====
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: click_frmOption_실행 };
        gw_com_module.eventBind(args);
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: click_frmOption_취소 };
        gw_com_module.eventBind(args);
        //----------
        function click_frmOption_실행(ui) { processRetrieve({}); }
        //----------
        function click_frmOption_취소(ui) { closeOption({}); }

        //==== Grid Events : Main
        var args = { targetid: "grdData_Main", grid: true, event: "rowselected", handler: rowselected_grdData_Main };
        gw_com_module.eventBind(args);
        function rowselected_grdData_Main(ui) { processLink({}); }
        //var args = { targetid: "grdData_Sub", grid: true, event: "rowselected", handler: rowselected_grdData_Sub };
        //gw_com_module.eventBind(args);
        //function rowselected_grdData_Sub(ui) { processLink({}); }

        // startup process.
        gw_com_module.startPage();

    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function viewOption( param ) {
    var args = { target: [ { id: "frmOption", focus: true } ] };
    gw_com_module.objToggle(args);
}

//----------
function processEdit( param ) {
	
    if (gw_com_api.getSelectedRow("grdData_Main") == null) {
        gw_com_api.messageBox([ { text: "선택된 대상이 없습니다." } ], 300);
        return false;
    }

    var args = { ID: gw_com_api.v_Stream.msg_linkPage,
        to: { type: "MAIN" },
        data: { page: "w_mrp3220", title: "작업 Check Sheet",
            param: [
    		{ name: "ord_no", value: gw_com_api.getValue("grdData_Main", "selected", "ord_no", true) },
    		{ name: "work_group", value: gw_com_api.getValue("grdData_Main", "selected", "work_group", true) },
    		{ name: "work_cd", value: gw_com_api.getValue("grdData_Sub", "selected", "work_cd", true) },
    		{ name: "input_cd", value: gw_com_api.getValue("grdData_Sub", "selected", "input_cd", true) }
            ]
        }
    };
    gw_com_module.streamInterface(args);

}
//----------
function successSave(response, param) {
	processRetrieve({});
//    $.each(response, function () {
//        $.each(this.KEY, function () { 
//        	if (this.NAME == "issue_no") { 
//        		v_global.logic.key = this.VALUE;
//                processRetrieve({ key: v_global.logic.key }); 
//            }
//        });
//    });
}
//----------
function processDelete() {
	return true;
}
//----------
function popupDetail(ui) {
	return;
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
				{ name: "proj_no", argument: "arg_proj_no" },
				{ name: "ord_no", argument: "arg_ord_no" }
			],
            remark: [
		        { element: [{ name: "proj_no"}] },
		        { element: [{ name: "ord_no"}] }
		    ]
        },
        target: [
            { type: "GRID", id: "grdData_Main", focus: true, select: true }
	    ],
        clear: [
			{ type: "GRID", id: "grdData_이력" }
            ,{ type: "GRID", id: "grdData_Sub" }
        ]
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {

    var args = { key: param.key,
        source: { type: "GRID", id: "grdData_Main", row: "selected", block: true,
            element: [
				{ name: "ord_no", argument: "arg_ord_no" },
				{ name: "work_group", argument: "arg_work_group" }
			]
        },
        target: [
            { type: "GRID", id: "grdData_Sub", select: true }
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
                            if (param.data.result == "YES") processEdit(param.data.arg);
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