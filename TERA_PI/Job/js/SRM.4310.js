//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 입고 현황
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

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // entry point. (pre-process section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ready: function () {

        // initialize page.
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        // 협력사 숨김 여부 설정
        v_global.logic.HideSupp = (gw_com_module.v_Session.USER_TP == "SYS") ? false : true;
        //// 사원번호와 ID가 다른 경우는 사원임 (사용자 구분값이 없어서 임시 처리)
        //if (gw_com_module.v_Session.EMP_NO != gw_com_module.v_Session.USR_ID)
        //	v_global.logic.HideSupp = false;
        v_global.logic.HideSupp = false;
        	
        if (v_global.logic.HideSupp){
	        v_global.logic.SuppCd = gw_com_module.v_Session.EMP_NO;
	        v_global.logic.SuppNm = gw_com_module.v_Session.EMP_NM;
		}
		else {
	        v_global.logic.SuppCd = "";
	        v_global.logic.SuppNm = "";
		}
		
        // set data for DDDW List
        var args = { request: [
//                { type: "PAGE", name: "발생구분", query: "dddw_zcode",
//                    param: [{ argument: "arg_hcode", value: "QDM010"}] 
//                },
                { type: "INLINE", name: "라벨유형",
                    data: [{ title: "개별", value: "1" }, { title: "통합", value: "2"}, { title: "-", value: "0"}]
                },
                { type: "INLINE", name: "합불판정",
                    data: [ { title: "합격", value: "1" }, { title: "불합격", value: "0" } ]
                },
                {
                    type: "INLINE", name: "검수유형",
                    data: [{ title: "필수", value: "1" }, { title: "무검사", value: "0" }]
                },
                {
                    type: "INLINE", name: "검수결과",
                    data: [ { title: "합격", value: "1" }, { title: "불합격", value: "0" } ]
                },
                { type: "INLINE", name: "확인결과",
                    data: [ { title: "정상", value: "정상" }, { title: "정상", value: "정상" }
                  		  , { title: "제외", value: "제외" }, { title: "오류", value: "오류" } ]
                },
                { type: "INLINE", name: "입고상태",
                    data: [ { title: "입고", value: "가입고" }, { title: "진행중", value: "진행중" }
                    	  , { title: "정입고", value: "정입고" } ]
                }
			],
            starter: start
        };
        gw_com_module.selectSet(args);

        // Start Process : Create UI & Event
        function start() { 
        	gw_job_process.UI(); 
        	gw_job_process.procedure();
        }
    },

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage UI. (design section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    UI: function () {

        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "조회", value: "조회", act: true },
				{ name: "추가", value: "추가" },    // icon 자동 맵핑 : 조회,추가,삭제,저장,닫기,기타
				//{ name: "수정", value: "수정", icon: "저장" }
				//{ name: "삭제", value: "삭제" }
                { name: "수정", value: "상세", icon: "기타" }//,
                //{ name: "확정", value: "확정", icon: "기타" }
			]
        };
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true, remark: "lyrRemark",
            editable: { focus: "ymd_fr", validate: true },
            content: {
                row: [
                        {
                            element: [
                                {
                                    name: "ymd_fr", label: { title: "입고일자 :" }, mask: "date-ymd",
                                    style: { colfloat: "floating" },
                                    editable: { type: "text", size: 7, maxlength: 10 }
                                },
                                {
                                    name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
                                    editable: { type: "text", size: 7, maxlength: 10 }
                                }
                            ]
                        },
                        {
                            element: [
                                {
                                    name: "proj_nm", label: { title: "Project Name : " }, mask: "search",
                                    editable: { type: "text", size: 12 }
                                },
                                {
                                    name: "proj_no", label: { title: "Project No : " }, mask: "search",
                                    editable: { type: "text", size: 10 }, hidden: true
                                },
                                {
                                    name: "supp_nm", label: { title: "협력사 :" }, mask: "search",
                                    editable: { type: "text", size: 12 }
                                },
                                { name: "supp_cd", hidden: true, editable: { type: "hidden" } }
                            ]
                        },
                        {
                            element: [
                                {
                                    name: "pur_no", label: { title: "발주번호 :" },
                                    editable: { type: "text", size: 12, maxlength: 20 }
                                },
                                {
                                    name: "pr_no", label: { title: "구매요청번호 :" },
                                    editable: { type: "text", size: 12, maxlength: 20 }
                                }
                            ]
                        },
                        {
                            element: [
                                {
                                    name: "io_no", label: { title: "관리번호 :" },
                                    editable: { type: "text", size: 12, maxlength: 20 }
                                },
                                {
                                    name: "item_cd", label: { title: "품번 :" },
                                    editable: { type: "text", size: 12 }
                                }
                            ]
                        },
                        {
                            element: [
                                { name: "실행", value: "실행", act: true, format: { type: "button" } },
                                { name: "취소", value: "취소", format: { type: "button", icon: "닫기" } }
                            ], align: "right"
                        }
                ]
            }
        };
        gw_com_module.formCreate(args);
        // 협력사 only
        // gw_com_api.setValue("frmOption", 1, "supp_cd", gw_com_module.v_Session.EMP_NO );
        //=====================================================================================
        var args = {
            targetid: "grdData_Main", query: "SRM_4310_M_1", title: "입고 현황",
            height: 150, show: true, selectable: true, number: true, // dynamic: true, multi: true, checkrow: true,
            element: [
				//{ header: "진행상태", name: "pstat", width: 50, align: "center" },
				{ header: "관리번호", name: "io_no", width: 80, align: "center" },
				{ header: "입고일", name: "io_date", width: 70, align: "center", mask: "date-ymd" },
				{ header: "협력사", name: "rqst_dept_nm", width: 150, align: "left" },
				{ header: "담당자", name: "rqst_user", width: 60, align: "center" },
				{ header: "품목수", name: "item_cnt", width: 60, align: "center" },
				{ header: "전체수량", name: "item_qty", width: 60, align: "center", mask: "numeric-int" },
				//{ header: "입고담당", name: "acpt_user_nm", width: 60, align: "center" },
				{ header: "창고", name: "wh_nm", width: 60, align: "center" },
				{ header: "등록자", name: "ins_usr_nm", width: 60, align: "center" },
				{ header: "등록일시", name: "ins_dt", width: 120, align: "center" },
				{ name: "io_tp", hidden: true },
				{ name: "rqst_dept", hidden: true },
				{ name: "acpt_user", hidden: true }
			]
        };
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_Sub", query: "SRM_4310_S_1", title: "입고 목록",
            caption: true, height: "100%", pager: false, show: true, selectable: true, number: true,
            element: [
				{ header: "발주번호", name: "pur_no", width: 80, align: "center", },
				{ header: "발주순번", name: "pur_seq", width: 40, align: "center", mask: "numeric-int", hidden: true },
				{ header: "품번", name: "item_cd", width: 80, align: "center" },
				{ header: "품명", name: "item_nm", width: 120, align: "left" },
				{ header: "규격", name: "item_spec", width: 120, align: "left" },
				{ header: "Project Name", name: "proj_nm", width: 130 },
				{ header: "Project No.", name: "track_no", width: 80, align: "center" },
				{ header: "Pallet No.", name: "pallet_no", width: 80, align: "center", hidden: true },
				{ header: "납기요구일", name: "req_date", width: 70, align: "center", mask: "date-ymd" },
				{ header: "발주수량", name: "pur_qty", width: 50, align: "right" },
				{ header: "단위", name: "io_unit", width: 40, align: "center" },
				{ header: "입고수량", name: "io_qty", width: 50, align: "right" },
				{ header: "라벨", name: "label_tp", width: 40, align: "center", format: { type: "select", data: { memory: "라벨유형" } }, hidden: true },
				{ header: "검수유형", name: "chk_yn", width: 50, align: "center", format: { type: "select", data: { memory: "검수유형" } } },
				{ header: "검수결과", name: "chk_result", width: 50, align: "center", format: { type: "select", data: { memory: "검수결과" } } },
				{ header: "방문검수", name: "visit_qa", width: 40, align: "center", format: { type: "checkbox", value: 1, offval: 0 } },
				{ header: "선입고", name: "direct_yn", width: 40, align: "center", format: { type: "checkbox", value: 1, offval: 0 } },
                { header: "선입고일", name: "dir_date", width: 70, align: "center", mask: "date-ymd" },
                { header: "선입고장소", name: "dir_place", width: 150 },
                { header: "바코드", name: "barcode", width: 70, align: "center", hidden: true },
				{ header: "구매요청자", name: "pr_emp_nm", width: 60, align: "center" },
                { name: "io_no", hidden: true },
                { name: "io_seq", hidden: true },
                { name: "root_no", hidden: true },
                { name: "root_seq", hidden: true }
			]
        };
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_File", query: "SRM_4310_S_2", title: "거래명세서",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            element: [
				{ header: "파일명", name: "file_nm", width: 250 },
				{ header: "다운로드", name: "download", width: 60, align: "center", format: { type: "link", value: "다운로드" } },
				{ header: "파일설명", name: "file_desc", width: 380 },
				{ header: "등록자", name: "upd_usr_nm", width: 60, align: "center" },
                { name: "file_ext", hidden: true },
                { name: "file_path", hidden: true },
                { name: "network_cd", hidden: true },
                { name: "data_tp", hidden: true },
                { name: "data_key", hidden: true },
                { name: "data_seq", hidden: true },
                { name: "file_id", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);
        //=====================================================================================
        var args = {
            target: [
				{ type: "GRID", id: "grdData_Main", offset: 8 },
                { type: "GRID", id: "grdData_Sub", offset: 8 },
                { type: "GRID", id: "grdList_File", offset: 8 }
			]
        };
        gw_com_module.objResize(args);
        //=====================================================================================
        gw_com_module.informSize();

    },

    //==== manage process. (program section)
    procedure: function () {

        //=====================================================================================
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: viewOption };
        gw_com_module.eventBind(args);
        function viewOption(ui) {
		    var args = { target: [ { id: "frmOption", focus: true } ] };
		    gw_com_module.objToggle(args);
        }
        //----------
        var args = { targetid: "lyrMenu", element: "추가", event: "click", handler: processInsert };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "수정", event: "click", handler: processEdit };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "삭제", event: "click", handler: processDelete };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "확정", event: "click", handler: processBatch };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: hideOption };
        gw_com_module.eventBind(args);
        function hideOption(ui) { gw_com_api.hide("frmOption"); }
        //----------
        var args = { targetid: "frmOption", event: "itemdblclick", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemkeyenter", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_Main", grid: true, event: "rowselected", handler: processLink };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_Main", grid: true, event: "rowdblclick", handler: popupDetail };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_Main", grid: true, event: "rowkeyenter", handler: popupDetail };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdList_File", grid: true, element: "download", event: "click", handler: processFile };
        gw_com_module.eventBind(args);
        //=====================================================================================
        gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { day: v_global.logic.HideSupp ? -30 : -5 }));
        gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate("", { day: 1 }));
        gw_com_module.startPage();

    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//---------- Sub Functions : Checking
function checkSelected(objid){
    if (gw_com_api.getSelectedRow(objid) == null) {
        gw_com_api.messageBox([ { text: "선택된 대상이 없습니다." } ], 300);
        return false;
    }
    return true;
}
//---------- Insert
function processInsert( param ) {
	// 1. Check selection of row for editing
	var TargetObj = {id: "grdData_Main", type: "GRID", grid: true, row: "selected"};
    //if (!checkSelected(TargetObj.id)) return false;

	// 2. Check status of row data for inserting

	// 3. Open link page to tabpage of parent page
    var args = { 
    	ID: gw_com_api.v_Stream.msg_linkPage,
        to: { type: "MAIN" },
        data: { 
        	page: "SRM_4320", title: "입고 등록",
            param: [
                { name: "io_no", value: "new" }
            ]
        }
    };
    gw_com_module.streamInterface(args);
}
//---------- Edit
function processEdit( param ) {
	
	// 1. Check selection of row for editing
	var TargetObj = {id: "grdData_Main", type: "GRID", grid: true, row: "selected"};
    if (!checkSelected(TargetObj.id)) return false;

	//// 2. Check status of row data for editing
    //var ProcStat = gw_com_api.getValue(TargetObj.id, TargetObj.row, "pstat", true);
    //if ( ProcStat == "완료" || ProcStat == "취소" ) {
    //    gw_com_api.messageBox([
    //        { text: status + " 자료이므로 수정할 수 없습니다." }
    //    ], 420);
    //    return false;
    //}

	// 3. Open link page to tabpage of parent page
    var args = { 
    	ID: gw_com_api.v_Stream.msg_linkPage,
        to: { type: "MAIN" },
        data: { 
        	page: "SRM_4320", title: "입고 수정",
            param: [
                { name: "io_no", value: gw_com_api.getValue(TargetObj.id, TargetObj.row, "io_no", true) }
            ]
        }
    };
    gw_com_module.streamInterface(args);

}
//----------
function processItemchanged(param) {

    if (param.object == "frmOption") {
        switch (param.element) {
            case "proj_nm":
                if (param.value.current == "")
                    gw_com_api.setValue(param.object, param.row, "proj_no", "");
                break;
            case "supp_nm":
                if (param.value.current == "")
                    gw_com_api.setValue(param.object, param.row, "supp_cd", "");
                break;
            case "item_nm":
                if (param.value.current == "")
                    gw_com_api.setValue(param.object, param.row, "item_cd", "");
                break;
        }
    }

}
//----------
function processItemdblclick(param) {

    v_global.event.type = param.type;
    v_global.event.object = param.object;
    v_global.event.row = param.row;
    v_global.event.element = param.element;
    var args;
    switch (param.element) {
        case "proj_nm":
        case "proj_no":
            v_global.event.cd = "proj_no";
            v_global.event.nm = "proj_nm";
            v_global.logic.search = {
                proj_no: (param.element == "proj_no" ? gw_com_api.getValue(param.object, param.row, param.element) : ""),
                proj_nm: (param.element == "proj_nm" ? gw_com_api.getValue(param.object, param.row, param.element) : "")
            };
            args = {
                type: "PAGE", page: "w_find_proj_scm", title: "Project 검색",
                width: 650, height: 460, open: true,
                id: gw_com_api.v_Stream.msg_selectProject_SCM
            };
            break;
        case "supp_cd":
        case "supp_nm":
            v_global.event.cd = "supp_cd";
            v_global.event.nm = "supp_nm";
            v_global.logic.search = {
                supp_cd: (param.element == "supp_cd" ? gw_com_api.getValue(param.object, param.row, param.element) : ""),
                supp_nm: (param.element == "supp_nm" ? gw_com_api.getValue(param.object, param.row, param.element) : "")
            };
            args = {
                type: "PAGE", page: "DLG_SUPPLIER", title: "협력사 선택",
                width: 600, height: 450, open: true,
                id: gw_com_api.v_Stream.msg_selectSupplier
            };
            break;
        default: return;
    }

    if (gw_com_module.dialoguePrepare(args) == false) {
        args = {
            page: args.page,
            param: {
                ID: args.id,
                data: v_global.logic.search
            }
        };
        gw_com_module.dialogueOpen(args);
    }

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
				{ name: "ymd_fr", argument: "arg_ymd_fr" },
				{ name: "ymd_to", argument: "arg_ymd_to" },
				{ name: "io_no", argument: "arg_io_no" },
				{ name: "supp_cd", argument: "arg_supp_cd" },
				{ name: "supp_nm", argument: "arg_supp_nm" },
				{ name: "pur_no", argument: "arg_pur_no" },
				{ name: "pr_no", argument: "arg_pr_no" },
            	{ name: "proj_no", argument: "arg_proj_no" },
            	{ name: "item_cd", argument: "arg_item_cd" }
            ],
            remark: [
	            { infix: "~",  element: [ { name: "ymd_fr" }, { name: "ymd_to" } ] },
		        { element: [{ name: "proj_nm" }] },
		        { element: [{ name: "supp_nm" }] },
		        { element: [{ name: "pur_no" }] },
		        { element: [{ name: "pr_no" }] },
		        { element: [{ name: "io_no" }] },
		        { element: [{ name: "item_cd" }] }
		    ]
        },
        target: [
            { type: "GRID", id: "grdData_Main", focus: true, select: true }
	    ],
        clear: [
			{ type: "GRID", id: "grdData_Sub" },
            { type: "GRID", id: "grdList_File" }
        ]
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {

    var args = {
        key: param.key,
        source: {
            type: "GRID", id: "grdData_Main", row: "selected", block: true,
            element: [
				{ name: "io_no", argument: "arg_io_no" }
            ],
            argument: [
                { name: "arg_item_cd", value: gw_com_api.getValue("frmOption", 1, "item_cd") }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_Sub", focus: true, select: true },
            { type: "GRID", id: "grdList_File", select: true }
        ]
    };
    gw_com_module.objRetrieve(args);

}
//---------- Start Deleting : processDelete => processRemove => successRemove
function processDelete(ui) {
	gw_com_api.hide("frmOption");	// 조회 조건 입력 창 숨기기
	
    // 1. 삭제 후 Update까지 완료 : 주로 master data에 적용
    if(ui.object == "lyrMenu") {
    	
    	// 1-1. 삭제 대상 설정
        var args = { id: "grdData_Sub2", type: "GRID"
        	, grid: true, row: "selected", element: [ { name: "plan_no" } ] 
        	};
        	
    	// 1-2. 처리 가능여부 확인
    	if (gw_com_module.v_Session.USR_ID != gw_com_api.getValue(args.id, args.row, "acp_user", true)
    	 && gw_com_module.v_Session.USR_ID != gw_com_api.getValue(args.id, args.row, "ins_usr", true)
    	 && gw_com_module.v_Session.USR_ID != gw_com_api.getValue(args.id, args.row, "upd_usr", true))
    	{
	    	gw_com_api.messageBox([{ text: "삭제 권한이 없습니다" }], 420);
    		return; 
    	}
	    
	    // 1-3. Record CRUD 상태에 따른 처리
	    var crud = gw_com_api.getCRUD(args.id, args.row, args.grid);
	    if (crud == "none")
	    	gw_com_api.messageBox([ { text: "NOMASTER" } ]);
	    else if (crud == "initialize" || crud == "create") 	//신규인 경우 화면 초기화
	    	gw_com_module.objClear({ target: [args] });
	    else {	
	    	// 삭제 여부 확인 후 삭제 처리 
		    v_global.process.handler = processRemove;
	        gw_com_api.messageBox([ { text: "REMOVE" } ], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO", args);
		}
    }
    // 2. 화면에서만 삭제 : 주로 Sub Grid에 적용
    else if (ui.object == "lyrMenu_Sample") {
        var args = { targetid: "grdData_Sub", row: "selected" }
        gw_com_module.gridDelete(args);
    }
    else return;

}
//---------- After confirmed removing
function processRemove(param) {
	// 주의 : 자체 삭제 처리 시에는 url 제거
    var args = { 
    	url: "COM",	
        target: [ { type: param.type, id: param.id, key: [ { row: param.row, element: param.element } ] } ]
    };
    args.handler = { success: successRemove, param: param };
    gw_com_module.objRemove(args);
}
//---------- After Removing
function successRemove(response, param) {
    var args = { targetid: param.id, row: param.row }
    gw_com_module.gridDelete(args);
}
//---------- Start Saving : processSave => successSave
function processSave(param) {

    var args = {
        target: [
			{ type: "FORM", id: "frmData_Main" },
            { type: "GRID", id: "grdData_Sub" }
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
        	if (this.NAME == "io_no") { 
        		v_global.logic.key = this.VALUE;
                processRetrieve({ key: v_global.logic.key }); 
            }
        });
    });

}
//----------
function popupDetail(ui) {
    //수정모드
}
//---------- Closing Process
function processClose(param) {
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
//----------
function processFile(param) {

    var args = {
        source: { id: param.object, row: param.row },
        targetid: "lyrDown"
    };
    gw_com_module.downloadFile(args);

}
//----------
function processBatch(param) {

    if (param.element == "확정") {
        if (!checkSelected("grdData_Main")) return;
        var args = {
            url: "COM",
            procedure: "SP_IF_ItemIO",
            nomessage: true,
            input: [
                { name: "io_no", value: gw_com_api.getValue("grdData_Main", "selected", "io_no", true), type: "varchar" },
                { name: "usr_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
            ],
            output: [
                { name: "rtn_cd", type: "varchar" },
                { name: "rtn_msg", type: "varchar" }
            ],
            handler: {
                success: successBatch,
                param: param
            }
        };
        gw_com_module.callProcedure(args);
    }

}
//----------
function successBatch(response, param) {

    if (param.element == "확정") {
        if (response.VALUE[0] == "OK") {
            gw_com_api.messageBox([{ text: "SUCCESS" }]);
        } else {
            gw_com_api.messageBox([{ text: response.VALUE[1] }]);
            return;
        }
    }
    //processRetrieve({ key: v_global.logic.io_no });
}
//----------

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_showMessage: {
            gw_com_module.streamInterface(param);
        } break;
        case gw_com_api.v_Stream.msg_resultMessage: {
            if (param.data.page != gw_com_api.getPageID()) {
                param.to = { type: "POPUP", page: param.data.page };
                gw_com_module.streamInterface(param);
                break;
            }
            switch (param.data.ID) {
                case gw_com_api.v_Message.msg_confirmSave: {
                    if (param.data.result == "YES") processEdit(param.data.arg);
                    else if (v_global.process.handler != null) v_global.process.handler(param.data.arg);
                } break;
                case gw_com_api.v_Message.msg_informSaved: {
                    param.data.arg.handler(param.data.arg.response, param.data.arg.param); 
                } break;
                case gw_com_api.v_Message.msg_confirmRemove: { 
                    if (param.data.result == "YES") processRemove(param.data.arg); 
                } break;
                case gw_com_api.v_Message.msg_informRemoved: { 
                    param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                } break;
                case gw_com_api.v_Message.msg_informBatched: {
                    param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                } break;
		    }   // End of switch (param.data.ID)
		} break;    // End of case gw_com_api.v_Stream.msg_resultMessage
        case gw_com_api.v_Stream.msg_retrieve: {
                processRetrieve({ key: param.data.key });
        } break;
        case gw_com_api.v_Stream.msg_remove: {
                var args = { targetid: "grdData_Main", row: v_global.event.row }
                gw_com_module.gridDelete(args);
            } break;
        case gw_com_api.v_Stream.msg_openedDialogue: {   
                var args = {
                    to: { type: "POPUP", page: param.from.page },
                    ID: param.ID
                };
                switch (param.from.page) {
                    case "w_find_proj_scm":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectProject_SCM;
                            args.data = v_global.logic.search;
                        }
                        break;
                    case "DLG_SUPPLIER":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectSupplier;
                            args.data = v_global.logic.search;
                        }
                        break;
                    default:
                        args.data = {
                            io_no: gw_com_api.getValue(v_global.event.object, v_global.event.row, "io_no", true)
                        };
                        break;
                }
                gw_com_module.streamInterface(args);
            } break;
        case gw_com_api.v_Stream.msg_closeDialogue: { 
        	closeDialogue({ page: param.from.page }); 
        } break;
        case gw_com_api.v_Stream.msg_selectedProject_SCM:
            {
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        v_global.event.cd,
			                        param.data.proj_no,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        v_global.event.nm,
			                        param.data.proj_nm,
			                        (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedSupplier:
            {
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        v_global.event.cd,
			                        param.data.supp_cd,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        v_global.event.nm,
			                        param.data.supp_nm,
			                        (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//