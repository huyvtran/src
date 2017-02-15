//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 검수 현황
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
        var args = {
            request: [
                {
                    type: "INLINE", name: "라벨유형",
                    data: [
                        { title: "개별", value: "1" },
                        { title: "통합", value: "2" },
                        { title: "-", value: "0" }
                    ]
                },
                {
                    type: "INLINE", name: "검수결과",
                    data: [
                        { title: "전체", value: "%" },
                        { title: "합격", value: "1" },
                        { title: "불합격", value: "0" }
                    ]
                },
                {
                    type: "INLINE", name: "검수여부",
                    data: [
                        { title: "전체", value: "%" },
                        { title: "검사완료", value: "1" },
                        { title: "미검사", value: "2" }
                    ]
                },
                {
                    type: "INLINE", name: "일자",
                    data: [
                        { title: "가입고일자", value: "가입고일자" },
                        { title: "검수일자", value: "검수일자" }
                    ]
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

        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "조회", value: "조회", act: true },
				{ name: "추가", value: "검수등록", icon: "Dialogue" },
				//{ name: "바코드", value: "검수등록(바코드)", icon: "Dialogue" },
				{ name: "수정", value: "수정", icon: "추가" },
				{ name: "ISSUE", value: "문제등록", icon: "실행" },
				{ name: "닫기", value: "닫기" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true, remark: "lyrRemark",
            editable: { focus: "ymd_fr", validate: true },
            content: { row: [
                    {
                        element: [
			                {
			                    name: "ymd_fr", label: { title: "가입고일자 :" }, mask: "date-ymd",
			                    style: { colfloat: "float" },
			                    editable: { type: "text", size: 7, maxlength: 10 }
			                },
			                {
			                    name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
			                    style: { colfloat: "floating" },
			                    editable: { type: "text", size: 7, maxlength: 10 }
			                },
			                {
			                    name: "date_tp", label: { title: "" },
			                    style: { colfloat: "floated" },
			                    editable: {
			                        type: "select",
			                        data: { memory: "일자" }
			                    }
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
                                editable: { type: "text", size: 14 }
                            },
                            { name: "supp_cd", hidden: true, editable: { type: "hidden" } }
				        ]
                    },
                    {
                        element: [
                            { name: "pur_no", label: { title: "발주번호 :" }, editable: { type: "text", size: 12 } },
                            {
                                name: "chk_yn", label: { title: "검수여부 :" }, value: "2",
                                editable: {
                                    type: "select",
                                    data: { memory: "검수여부" }
                                }
                            },
                            {
                                name: "chk_result", label: { title: "검수결과 :" },
                                editable: {
                                    type: "select",
                                    data: { memory: "검수결과", message: "검수결과" }
                                }
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
        //----------
        gw_com_module.formCreate(args);
        // 협력사 only
        // gw_com_api.setValue("frmOption", 1, "supp_cd", gw_com_module.v_Session.EMP_NO );
        //=====================================================================================
        var args = {
            targetid: "grdData_Main", query: "SRM_4210_M_1", title: "검수 현황",
            caption: false, height: 150, show: true, selectable: true, number: true, // dynamic: true, multi: true, checkrow: true,
            element: [
                { header: "협력사", name: "supp_nm", width: 150, align: "left" },
                {
                    header: "합계건수", name: "item_cnt", width: 50, align: "right",
                    fix: { mask: "numeric-int", margin: 1 }
                },
                {
                    header: "합계수량", name: "item_qty", width: 50, align: "right",
                    fix: { mask: "numeric-int", margin: 1 }
                },
                {
                    header: "필수", name: "check_1_qty", width: 50, align: "right",
                    fix: { mask: "numeric-int", margin: 1 }, hidden: true
                },
                {
                    header: "무검사", name: "check_0_qty", width: 50, align: "right",
                    fix: { mask: "numeric-int", margin: 1 }, hidden: true
                },
                {
                    header: "검사건수", name: "chk_1_cnt", width: 50, align: "right",
                    fix: { mask: "numeric-int", margin: 1 }
                },
                {
                    header: "검사수량", name: "chk_1_qty", width: 50, align: "right",
                    fix: { mask: "numeric-int", margin: 1 }
                },
                {
                    header: "미검사건수", name: "chk_0_cnt", width: 50, align: "right",
                    fix: { mask: "numeric-int", margin: 1 }
                },
                {
                    header: "미검사수량", name: "chk_0_qty", width: 50, align: "right",
                    fix: { mask: "numeric-int", margin: 1 }
                },
                {
                    header: "합격건수", name: "chk_result_1_cnt", width: 50, align: "right",
                    fix: { mask: "numeric-int", margin: 1 }
                },
                {
                    header: "합격수량", name: "chk_result_1_qty", width: 50, align: "right",
                    fix: { mask: "numeric-int", margin: 1 }
                },
                {
                    header: "불합격건수", name: "chk_result_0_cnt", width: 50, align: "right",
                    fix: { mask: "numeric-int", margin: 1 }
                },
                {
                    header: "불합격수량", name: "chk_result_0_qty", width: 50, align: "right",
                    fix: { mask: "numeric-int", margin: 1 }
                },
                { name: "supp_cd", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_Sub", query: "SRM_4210_S_1", title: "검수 목록",
            caption: true, height: 200, pager: true, show: true, selectable: true, number: true,
            element: [
                { header: "발주번호", name: "pur_no", width: 90, align: "center" },
                { header: "품번", name: "item_cd", width: 80, align: "center" },
                { header: "품명", name: "item_nm", width: 150 },
                { header: "규격", name: "item_spec", width: 120 },
                { header: "Project Name", name: "proj_nm", width: 130 },
                { header: "Peoject No.", name: "track_no", width: 80, align: "center" },
                { header: "Pallet No.", name: "pallet_no", width: 80, hidden: true },
                {
                    header: "수량", name: "issue_qty", width: 60, align: "right",
                    fix: { mask: "numeric-int", margin: 1 }
                },
                { header: "단위", name: "unit", width: 30, align: "center" },
                { header: "가입고일", name: "io_date", width: 80, align: "center", mask: "date-ymd" },
                {
                    header: "검수수량", name: "chk_qty", width: 60, align: "right",
                    fix: { mask: "numeric-int", margin: 1 }
                },
                {
                    header: "결과", name: "chk_result", width: 40, align: "center",
                    format: { type: "select", data: { memory: "검수결과" } }
                },
                { header: "유형", name: "check_yn_nm", width: 40, align: "center" },
                {
                    header: "여부", name: "chk_yn", width: 60, align: "center",
                    format: { type: "select", data: { memory: "검수여부" } }, hidden: true
                },
				{ header: "방문검수", name: "visit_qa", width: 40, align: "center", format: { type: "checkbox", value: 1, offval: 0 } },
				{ header: "선입고", name: "direct_yn", width: 40, align: "center", format: { type: "checkbox", value: 1, offval: 0 } },
                { header: "선입고일", name: "dir_date", width: 70, align: "center", mask: "date-ymd" },
                { header: "선입고장소", name: "dir_place", width: 150 },
                { header: "바코드", name: "barcode", width: 60, align: "center", hidden: true },
                {
                    header: "라벨", name: "label_tp", width: 30, align: "center",
                    format: { type: "select", data: { memory: "라벨유형" } }, hidden: true
                },
                { header: "검수자", name: "chk_user_nm", width: 50, align: "center" },
                { header: "검수일자", name: "chk_date", width: 80, align: "center", mask: "date-ymd" },
                { header: "검수처리일시", name: "ins_dt", width: 150, align: "center" },
				{ header: "비고", name: "rmk", width: 150 },
                { header: "납품서번호", name: "dlv_no", width: 90, align: "center" },
                { header: "순번", name: "dlv_seq", width: 30, align: "center" },
                { name: "chk_no", hidden: true },
                { name: "chk_seq", hidden: true },
                { name: "chk_result", hidden: true },
                { name: "pur_seq", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_File", query: "SRM_6110_2", title: "성적서",
            caption: true, height: "100%", pager: false, show: true, selectable: true, number: true,
            element: [
                {
                    header: "Ser. No.", name: "file_desc2", width: 80,
                    editable: { type: "text", width: 108 }
                },
                { header: "파일명", name: "file_nm", width: 200 },
				{
				    header: "다운로드", name: "download", width: 60, align: "center",
				    format: { type: "link", value: "다운로드" }
				},
				{
				    header: "파일설명", name: "file_desc", width: 300, align: "left",
				    editable: { type: "text", width: 388 }
				},
                { header: "최종수정자", name: "last_usr_nm", width: 80 },
                { header: "최종수정일시", name: "last_dt", width: 120, align: "center" },
                { name: "file_ext", hidden: true },
                { name: "file_path", hidden: true },
                { name: "network_cd", hidden: true },
                { name: "data_tp", hidden: true },
                { name: "data_key", hidden: true },
                { name: "data_seq", hidden: true },
                { name: "file_id", hidden: true, editable: { type: "hidden" } }
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
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        gw_com_module.informSize();
    },

    //==== manage process. (program section)
    procedure: function () {

        //=====================================================================================
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: click_lyrMenu_조회 };
        gw_com_module.eventBind(args);
        function click_lyrMenu_조회(ui) { viewOption(); }
        //----------
        var args = { targetid: "lyrMenu", element: "추가", event: "click", handler: processEdit };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "바코드", event: "click", handler: processEdit };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "수정", event: "click", handler: processEdit };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "ISSUE", event: "click", handler: processIssue };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: click_lyrMenu_닫기 };
        gw_com_module.eventBind(args);
        function click_lyrMenu_닫기(ui) { processClose({}); }
        //=====================================================================================
        var args = { targetid: "frmOption", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemdblclick", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemkeyenter", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: click_frmOption_실행 };
        gw_com_module.eventBind(args);
        function click_frmOption_실행(ui) { processRetrieve({}); }
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: click_frmOption_취소 };
        gw_com_module.eventBind(args);
        function click_frmOption_취소(ui) { gw_com_api.hide("frmOption"); }
        //=====================================================================================
        var args = { targetid: "grdData_Main", grid: true, event: "rowselected", handler: processLink };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_Sub", grid: true, event: "rowselected", handler: processLink };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdList_File", grid: true, element: "download", event: "click", handler: processFile };
        gw_com_module.eventBind(args);
        //=====================================================================================


        //==== startup process.
        gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { day: -5 }));
        gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate());
        gw_com_module.startPage();

    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function processItemchanged(param) {

    if (param.object == "frmOption") {
        switch (param.element) {
            case "date_tp":
                gw_com_api.setAttribute(param.object, 1, "ymd_fr", "label", param.value.current + " :");
                var obj = document.getElementsByTagName("label");
                for (var i = 0; i < obj.length; i++) {
                    var label = obj[i];
                    if (label.innerHTML == "가입고일자 :" || label.innerHTML == "검수일자 :") {
                        label.innerHTML = param.value.current + " :"
                    }
                }
                if (param.value.current == "검수일자") {
                    gw_com_api.setValue(param.object, param.row, "chk_yn", "1");        // 검수여부-검사완료
                }
                break;
            case "chk_yn":
                if (param.value.current == "2") {                                       // 검수여부-미검사
                    gw_com_api.setValue(param.object, param.row, "chk_result", "%");    // 검수결과-전체
                }
                break;
            case "chk_result":
                if (param.value.current != "%") {                                       // 검수결과-!전체
                    gw_com_api.setValue(param.object, param.row, "chk_yn", "1");        // 검수여부-검사완료
                }
                break;
            case "proj_nm":
                if (param.value.current == "")
                    gw_com_api.setValue(param.object, param.row, "proj_no", "");
                break;
            case "supp_nm":
                if (param.value.current == "")
                    gw_com_api.setValue(param.object, param.row, "supp_cd", "");
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
function processExport(param) {
}
//----------
function viewOption() {
    var args = { target: [ { id: "frmOption", focus: true } ] };
    gw_com_module.objToggle(args);
}
//---------- Main Button : 추가 & 수정 (ui.type/object/row/element)
function processEdit( param ) {
	
	// 0. Set editing mode (Insert or Update)
    var isNewMode;
    var isBarcode;
    if (param.object == "lyrMenu" && param.element == "추가") {
        isNewMode = true;
        isBarcode = "N";
    }
    else if (param.object == "lyrMenu" && param.element == "바코드") {
        isNewMode = true;
        isBarcode = "Y";
    }
    else if (param.object == "lyrMenu" && param.element == "수정") isNewMode = false;
    else if (param.object == "grdData_Main") isNewMode = false;
    else return;
	
    var sSuppCd, sSuppNm;
    var sChkNo;

    if (isNewMode) {
        sSuppCd = "";
        sSuppNm = "";
    } else {
        // 1-1. Check selection of row for editing
        if (gw_com_api.getSelectedRow("grdData_Main") == null) {
            gw_com_api.messageBox([{ text: "선택된 대상이 없습니다." }], 300);
            return false;
        }

        // 협력사 설정
        sSuppCd = gw_com_api.getValue("grdData_Main", "selected", "supp_cd", true);
        sSuppNm = gw_com_api.getValue("grdData_Main", "selected", "supp_nm", true);

        // 검수번호 설정
        sChkNo = gw_com_api.getValue("grdData_Sub", "selected", "chk_no", true);

        if (sChkNo == "")
            return;
    }

	// 2. Convert to editing mode
	// Open link page to tabpage of parent page : SRM_4220 수정
    var args = { ID: gw_com_api.v_Stream.msg_linkPage,
        to: { type: "MAIN" },
        data: { page: "SRM_4220", title: "검수 등록 및 수정",
            param: [
                { name: "chk_no", value: sChkNo },
                { name: "supp_cd", value: sSuppCd },
                { name: "supp_nm", value: sSuppNm },
                { name: "barcode", value: isBarcode }
            ]
        }
    };
    gw_com_module.streamInterface(args);

}
//----------
function processDetail( param ) {
}
//----------
function successSave(response, param) {
	processRetrieve({});
}
//----------
function processDelete() {
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
                { name: "date_tp", argument: "arg_date_tp" },
				{ name: "ymd_fr", argument: "arg_ymd_fr" },
				{ name: "ymd_to", argument: "arg_ymd_to" },
				{ name: "supp_nm", argument: "arg_supp_nm" },
                { name: "chk_yn", argument: "arg_chk_yn" },
                { name: "proj_no", argument: "arg_track_no" },
                { name: "pur_no", argument: "arg_pur_no" },
                { name: "chk_result", argument: "arg_chk_result" }
            ],
            remark: [
	            { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }]/*, label: gw_com_api.getText("frmOption", 1, "date_tp") + " :"*/ },
                { element: [{ name: "proj_nm" }] },
		        { element: [{ name: "supp_nm" }] },
		        { element: [{ name: "pur_no" }] },
		        { element: [{ name: "chk_yn" }] },
		        { element: [{ name: "chk_result" }] }
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

    var args;
    if (param.object == "grdData_Main") {
        args = {
            key: param.key,
            source: {
                type: "FORM", id: "frmOption", block: true,
                element: [
                    { name: "date_tp", argument: "arg_date_tp" },
                    { name: "ymd_fr", argument: "arg_ymd_fr" },
                    { name: "ymd_to", argument: "arg_ymd_to" },
                    { name: "chk_yn", argument: "arg_chk_yn" },
                    { name: "proj_no", argument: "arg_track_no" },
                    { name: "pur_no", argument: "arg_pur_no" },
                    { name: "chk_result", argument: "arg_chk_result" }
                ],
                argument: [
                    { name: "arg_supp_cd", value: gw_com_api.getValue(param.object, param.row, "supp_cd", true) }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_Sub", focus: true, select: true }
            ],
            clear: [
                { type: "GRID", id: "grdList_File" }
            ]
        };
    } else {
        if (param.row < 1 || param.row == undefined) return;
        args = {
            key: param.key,
            source: {
                type: param.type, id: param.object, row: param.row, block: true,
                element: [
                    { name: "pur_no", argument: "arg_data_key" },
                    { name: "pur_seq", argument: "arg_data_seq" }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_File" }
            ]
        };
    }
    gw_com_module.objRetrieve(args);

}
//----------
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

function processIssue(param) {
    
    var args = {
        ID: gw_com_api.v_Stream.msg_linkPage,
        to: { type: "MAIN" },
        data: {
            page: "w_qcm2010", title: "수입문제 관리",
            param: [
                { name: "chk_no", value: gw_com_api.getValue("grdData_Sub", "selected", "chk_no", true) }
            ]
        }
    };
    gw_com_module.streamInterface(args);

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
                    case "INFO_VOC":
                        {
                            args.ID = gw_com_api.v_Stream.msg_infoECR;
                        }
                        break;
                    case "INFO_SPC":
                        {
                            args.ID = gw_com_api.v_Stream.msg_infoECR;
                        }
                        break;
                    case "DLG_ISSUE":
                        {
                            args.ID = gw_com_api.v_Stream.msg_infoAS;
                        }
                        break;
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
                }
                //args.data = {
                //    dlv_no: gw_com_api.getValue(v_global.event.object, v_global.event.row, "dlv_no", true),
                //    voc_no: gw_com_api.getValue(v_global.event.object, v_global.event.row, "dlv_no", true)
                //}
                gw_com_module.streamInterface(args);
            } break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                closeDialogue({ page: param.from.page });
            }
            break;
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