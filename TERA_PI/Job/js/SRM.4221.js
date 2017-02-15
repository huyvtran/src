//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 납품대상 발주내역 조회
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

        // 협력사 숨김 여부 설정
        v_global.logic.HideSupp = (gw_com_module.v_Session.DEPT_AREA=="SOLAR") ? false : true ;
		
        // set data for DDDW List
        var args = { request: [
                {
                    type: "PAGE", name: "DEPT_AREA_FIND", query: "dddw_deptarea",
                    param: [
                        { argument: "arg_type", value: "ALL" }
                    ]
                },
                {
                    type: "INLINE", name: "라벨유형",
                    data: [{ title: "개별", value: "1" }, { title: "통합", value: "2" }, { title: "-", value: "0" }]
                },
                { type: "INLINE", name: "합불판정",
                    data: [ { title: "합격", value: "1" }, { title: "불합격", value: "0" } ]
                }
			],
            starter: start
        };
        gw_com_module.selectSet(args);

        //----------
        function start() { 
        	gw_job_process.UI(); 
        	gw_job_process.procedure();

        	gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { day: -30 }));
        	gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate());
        	gw_com_api.setValue("frmOption_3", 1, "chk_date", gw_com_api.getDate());
        }
    },

    // manage UI. (design section)
    UI: function () {

        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE",
            trans: true, show: true, border: true, remark: "lyrRemark",
            editable: { focus: "ymd_fr", validate: true },
            content: {
                row: [
                    {
                        element: [
			                {
			                    name: "ymd_fr", label: { title: "가입고일자 :" }, mask: "date-ymd", style: { colfloat: "floating" },
			                    editable: { type: "text", size: 7, maxlength: 10 }
			                },
			                {
			                    name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
			                    editable: { type: "text", size: 7, maxlength: 10 }
			                },
				            {
				                name: "dept_area", label: { title: "사업부 :" },
				                editable: { type: "select", size: 7, maxlength: 20, data: { memory: "DEPT_AREA_FIND", unshift: [{ title: "전체", value: "%" }] } },
                                hidden: true
				            },
			                {
			                    name: "supp_nm", label: { title: "협력사명 :" },
			                    editable: { type: "text", size: 10 }
			                },
                        ]
                    },
                    {
                        element: [
			                {
			                    name: "pur_no", label: { title: "발주번호 :" },
			                    editable: { type: "text", size: 12 }
			                },
			                {
			                    name: "dlv_no", label: { title: "납품번호 :" },
			                    editable: { type: "text", size: 15 }
			                }
                        ]
                    },
                    {
                        element: [
			                {
			                    name: "item_cd", label: { title: "품&nbsp;&nbsp;&nbsp;&nbsp;번 :" },
			                    editable: { type: "text", size: 12 }
			                },
			                {
			                    name: "item_nm", label: { title: "품&nbsp;&nbsp;&nbsp;&nbsp;명 :" },
			                    editable: { type: "text", size: 15 }
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
        //=====================================================================================
        var args = {
            targetid: "frmOption_3", type: "FREE",
            trans: false, show: true, border: true, align: "left", margin_left: 2,
            editable: { focus: "chk_date", validate: true },
            content: {
                row: [
                    {
                        element: [
                            { label: { title: "공급업체 일괄적용 :" } },
                            {
                                name: "chk_date", label: { title: "입고일 :" }, mask: "date-ymd", hidden: true,
                                editable: { type: "text", size: 10, maxlength: 10, validate: { rule: "required", message: "입고일" } }
                            },
			                { name: "합격", value: "일괄합격", format: { type: "button", icon: "기타" } },
			                { name: "불합격", value: "일괄불합격", format: { type: "button", icon: "기타" } }
                        ], align: "left"
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "조회", value: "조회", act: true },
				//{ name: "합격", value: "일괄합격", icon: "기타" },
				//{ name: "불합격", value: "일괄불합격", icon: "기타" },
				{ name: "저장", value: "확인", icon: "저장" },
				{ name: "닫기", value: "취소", icon: "닫기" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_Cust", query: "SRM_4221_M_TERA", title: "납품 업체",
            width: 180, height: 349, show: true, selectable: true,
            element: [
                { header: "공급업체", name: "supp_nm", width: 180, align: "left" },
				{ name: "supp_cd", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_List", query: "SRM_4221_S_TERA", title: "검사 대상 품목",
            width:720, height: 200, show: true, number: true, selectable: true, //multi: true, checkrow: true,
            editable: { master: true, bind: "select", focus: "chk_result", validate: true },
            element: [
				{ header: "발주번호", name: "pur_no", width: 80, align: "center" },
				{ header: "품번", name: "item_cd", width: 80, align: "center" },
				{ header: "품명", name: "item_nm", width: 140, align: "left" },
				{ header: "규격", name: "item_spec", width: 140, align: "left" },
				{ header: "가입고일", name: "io_date", width: 70, align: "center", mask: "date-ymd" },
				{ header: "Project Name.", name: "proj_nm", width: 130 },
				{ header: "Project No.", name: "track_no", width: 80, align: "center" },
				{ header: "Pallet No.", name: "pallet_no", width: 80, align: "center", hidden: true },
				{ header: "수량", name: "issue_qty", width: 40, align: "right", hidden: true },
                { header: "납품", name: "dlv_qty", width: 50, align: "right", mask: "numeric-int" },
                { header: "검사대상", name: "qc_qty", width: 50, align: "right", mask: "numeric-int" },
				{ header: "단위", name: "unit", width: 40, align: "center" },
				{
				    header: "결과", name: "chk_result", width: 60, align: "center",
				    editable: { type: "select", data: { memory: "합불판정", unshift: [{ title: "-", value: "" }] } }
				},
				{ header: "방문검수", name: "visit_qa", width: 40, align: "center", format: { type: "checkbox", value: 1, offval: 0 } },
				{ header: "선입고", name: "direct_yn", width: 40, align: "center", format: { type: "checkbox", value: 1, offval: 0 } },
                { header: "선입고일", name: "dir_date", width: 70, align: "center", mask: "date-ymd" },
                { header: "선입고장소", name: "dir_place", width: 150 },
                {
                    header: "합격", name: "ok_qty", width: 50, align: "right", mask: "numeric-int",
                    editable: { type: "text" }, hidden: true
                },
                {
                    header: "불합격", name: "fail_qty", width: 50, align: "right", mask: "numeric-int",
                    editable: { type: "hidden" }, hidden: true
                },
				{
				    header: "라벨", name: "label_tp", width: 40, align: "center",
				    format: { type: "select", data: { memory: "라벨유형" } }, hidden: true
				},
                { header: "바코드", name: "barcode", width: 60, align: "center", hidden: true },
				{ header: "납품서번호", name: "dlv_no", width: 100, align: "center" },
				{ header: "순번", name: "dlv_seq", width: 40, align: "center" },
                { name: "dlv_user", hidden: true },
                { name: "pur_seq", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_File", query: "SRM_6110_2", title: "성적서",
            width: 720, height: 76, show: true, pager: false, number: true, selectable: true,
            element: [
                { header: "Ser. No.", name: "file_desc2", width: 80 },
                { header: "파일명", name: "file_nm", width: 150 },
				{
				    header: "다운로드", name: "download", width: 60, align: "center",
				    format: { type: "link", value: "다운로드" }
				},
				{ header: "파일설명", name: "file_desc", width: 150 },
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
        var args = {
            targetid: "frmOption_2", type: "FREE",
            trans: false, show: true, border: true, align: "right", margin: 4,
            editable: { bind: "open", focus: "adj_date", validate: true },
            content: {
                row: [
                    {
                        element: [
				            {
				                name: "chk_result", label: { title: "결과 일괄적용:" },
				                editable: { type: "select", data: { memory: "합불판정", unshift: [{ title: "-", value: "" }] } }, value: "1"
				            },
                            { name: "실행", value: "적용", format: { type: "button" } }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);
        //=====================================================================================
        var args = {
            target: [
				{ type: "GRID", id: "grdData_Cust", offset: 8 },
                { type: "GRID", id: "grdData_List", offset: 8 },
                { type: "GRID", id: "grdList_File", offset: 8 },
                { type: "FORM", id: "frmOption_2", offset: 8 },
                { type: "FORM", id: "frmOption_3", offset: 8 }
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
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: viewOption };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: informResult };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //----------
        //var args = { targetid: "lyrMenu", element: "합격", event: "click", handler: processButton };
        //gw_com_module.eventBind(args);
        ////----------
        //var args = { targetid: "lyrMenu", element: "불합격", event: "click", handler: processButton };
        //gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption_3", element: "합격", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption_3", element: "불합격", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: closeOption };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_Cust", grid: true, event: "rowselected", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_List", grid: true, event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_List", grid: true, event: "rowselected", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdList_File", grid: true, element: "download", event: "click", handler: processFile };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption_2", element: "실행", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================

        // startup process.
        //----------
        gw_com_module.startPage();
        //----------
        var args = { ID: gw_com_api.v_Stream.msg_openedDialogue };
        gw_com_module.streamInterface(args);

    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//----------
function processButton(param) {
    switch (param.element) {
        case "실행":
            var chk_result = gw_com_api.getValue("frmOption_2", 1, "chk_result");
            var ids = gw_com_api.getRowIDs("grdData_List");
            $.each(ids, function () {
                gw_com_api.selectRow("grdData_List", this, true);
                gw_com_api.setValue("grdData_List", this, "chk_result", chk_result, true);
            });
            break;
        case "합격":
        case "불합격":
            if (gw_com_api.getRowCount("grdData_List") < 1) return;
            var args = { target: [{ type: "FORM", id: "frmOption_3" }] };
            if (gw_com_module.objValidate(args) == false) return false;

            gw_com_api.messageBox([
                { text: "목록에 표시된 모든 품목이 " + param.element + "처리됩니다." },
                { text: "계속하시겠습니까?" }
            ], 420, gw_com_api.v_Message.msg_confirmBatch, "YESNO", param);
            break;
    }
}
//----------
function processRetrieve(param) {

    var args = { target: [{ type: "FORM", id: "frmOption" }] };
    if (gw_com_module.objValidate(args) == false) return false;
    
    if (param.object == "grdData_List") {
        args = {
            source: {
                type: "GRID", id: param.object, row: param.row,
                element: [
                    { name: "pur_no", argument: "arg_data_key" },
                    { name: "pur_seq", argument: "arg_data_seq" }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_File", focus: true }
            ]
        };
    } else if (param.object == "grdData_Cust") {
        args = {
            source: {
                type: "FORM", id: "frmOption", hide: true,
                element: [
                    { name: "ymd_fr", argument: "arg_ymd_fr" },
                    { name: "ymd_to", argument: "arg_ymd_to" },
                    { name: "barcode", argument: "arg_barcode" },
                    { name: "dept_area", argument: "arg_dept_area" },
                    { name: "pur_no", argument: "arg_pur_no" },
                    { name: "dlv_no", argument: "arg_dlv_no" },
                    { name: "item_cd", argument: "arg_item_cd" },
                    { name: "item_nm", argument: "arg_item_nm" }
                ],
                argument: [
                    { name: "arg_supp_cd", value: gw_com_api.getValue("grdData_Cust", "selected", "supp_cd", true) }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_List", focus: true }
            ],
            clear: [
                { type: "GRID", id: "grdList_File" }
            ]
        };
    } else {
        args = {
            source: {
                type: "FORM", id: "frmOption", hide: true,
                element: [
                    { name: "ymd_fr", argument: "arg_ymd_fr" },
                    { name: "ymd_to", argument: "arg_ymd_to" },
                    { name: "barcode", argument: "arg_barcode" },
                    { name: "dept_area", argument: "arg_dept_area" },
                    { name: "supp_nm", argument: "arg_supp_nm" },
                    { name: "pur_no", argument: "arg_pur_no" },
                    { name: "dlv_no", argument: "arg_dlv_no" },
                    { name: "item_cd", argument: "arg_item_cd" },
                    { name: "item_nm", argument: "arg_item_nm" }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_Cust", select: true }
            ],
            clear: [
               { type: "GRID", id: "grdData_List" },
               { type: "GRID", id: "grdList_File" }
            ]
        };
    }
    gw_com_module.objRetrieve(args);

};
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdData_Cust" },
            { type: "GRID", id: "grdData_List" }
        ]
    };
    gw_com_module.objClear(args);

}
//----------
function processItemchanged(param) {

    if (param.object == "grdData_List") {

        switch (param.element) {
            case "chk_result":
                if (param.value.current == "") {
                    gw_com_api.setValue(param.object, param.row, "ok_qty", "", true, true, true);
                    gw_com_api.setValue(param.object, param.row, "fail_qty", "", true, true, true);
                } else {
                    var chk_qty = gw_com_api.getValue(param.object, param.row, "qc_qty", true);
                    gw_com_api.setValue(param.object, param.row, "ok_qty", (param.value.current == "1" ? chk_qty : 0), true, true, true);
                    gw_com_api.setValue(param.object, param.row, "fail_qty", (param.value.current == "0" ? chk_qty : 0), true, true, true);
                }
                break;
            //case "ok_qty":
            //    if (param.value.current == "") {
            //        gw_com_api.setValue(param.object, param.row, "fail_qty", param.value.current, true, true, true);
            //    } else {
            //        var val = Number(gw_com_api.getValue(param.object, param.row, "dlv_qty", true)) - Number(param.value.current);
            //        if (val < 0) {
            //            gw_com_api.messageBox([{ text: "수량을 잘못 입력하였습니다." }]);
            //            gw_com_api.setValue(param.object, param.row, "ok_qty", "", true, false, false);
            //            gw_com_api.setValue(param.object, param.row, "fail_qty", "", true, false, false);
            //            return false;
            //        }
            //        gw_com_api.setValue(param.object, param.row, "fail_qty", val, true, true, true);
            //    }
            //    break;
        }

    }

}
//----------
function processClose(param) {

    var args = { ID: gw_com_api.v_Stream.msg_closeDialogue };
    gw_com_module.streamInterface(args);
    processClear({});

}
//----------
function viewOption() {
    var args = { target: [{ id: "frmOption", focus: true }] };
    gw_com_module.objToggle(args);
}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

}
//----------
function informResult(param) {

    var rows = new Array();
    var ids = gw_com_api.getRowIDs("grdData_List");
    $.each(ids, function () {
        var crud = $("#grdData_List_data :input[id=" + this + "__CRUD]").val();
        if (gw_com_api.getCRUD("grdData_List", this, true) == "update") {
            var ok_qty = gw_com_api.getCellValue("GRID", "grdData_List", this, "ok_qty");
            var fail_qty = gw_com_api.getCellValue("GRID", "grdData_List", this, "fail_qty");

            if (ok_qty > 0) {
                rows.push({
                    barcode: gw_com_api.getCellValue("GRID", "grdData_List", this, "barcode"),
                    root_no: gw_com_api.getCellValue("GRID", "grdData_List", this, "dlv_no"),
                    root_seq: gw_com_api.getCellValue("GRID", "grdData_List", this, "dlv_seq"),
                    track_no: gw_com_api.getCellValue("GRID", "grdData_List", this, "track_no"),
                    proj_nm: gw_com_api.getCellValue("GRID", "grdData_List", this, "proj_nm"),
                    pallet_no: gw_com_api.getCellValue("GRID", "grdData_List", this, "pallet_no"),
                    item_cd: gw_com_api.getCellValue("GRID", "grdData_List", this, "item_cd"),
                    item_nm: gw_com_api.getCellValue("GRID", "grdData_List", this, "item_nm"),
                    item_spec: gw_com_api.getCellValue("GRID", "grdData_List", this, "item_spec"),
                    dlv_qty: gw_com_api.getCellValue("GRID", "grdData_List", this, "dlv_qty"),
                    pur_unit: gw_com_api.getCellValue("GRID", "grdData_List", this, "unit"),
                    label_tp: gw_com_api.getCellValue("GRID", "grdData_List", this, "label_tp"),
                    rqst_dept: gw_com_api.getValue("grdData_Cust", "selected", "supp_cd", true),
                    rqst_dept_nm: gw_com_api.getValue("grdData_Cust", "selected", "supp_nm", true),
                    rqst_user: gw_com_api.getCellValue("GRID", "grdData_List", this, "dlv_user"),
                    qc_qty: gw_com_api.getCellValue("GRID", "grdData_List", this, "qc_qty"),
                    pur_no: gw_com_api.getCellValue("GRID", "grdData_List", this, "pur_no"),
                    pur_seq: gw_com_api.getCellValue("GRID", "grdData_List", this, "pur_seq"),
                    visit_qa: gw_com_api.getCellValue("GRID", "grdData_List", this, "visit_qa"),
                    direct_yn: gw_com_api.getCellValue("GRID", "grdData_List", this, "direct_yn"),
                    dir_date: gw_com_api.getCellValue("GRID", "grdData_List", this, "dir_date"),
                    dir_place: gw_com_api.getCellValue("GRID", "grdData_List", this, "dir_place"),
                    chk_qty: ok_qty,
                    chk_result: "1"
                });
            }
            if (fail_qty > 0) {
                rows.push({
                    barcode: gw_com_api.getCellValue("GRID", "grdData_List", this, "barcode"),
                    root_no: gw_com_api.getCellValue("GRID", "grdData_List", this, "dlv_no"),
                    root_seq: gw_com_api.getCellValue("GRID", "grdData_List", this, "dlv_seq"),
                    track_no: gw_com_api.getCellValue("GRID", "grdData_List", this, "track_no"),
                    proj_nm: gw_com_api.getCellValue("GRID", "grdData_List", this, "proj_nm"),
                    pallet_no: gw_com_api.getCellValue("GRID", "grdData_List", this, "pallet_no"),
                    item_cd: gw_com_api.getCellValue("GRID", "grdData_List", this, "item_cd"),
                    item_nm: gw_com_api.getCellValue("GRID", "grdData_List", this, "item_nm"),
                    item_spec: gw_com_api.getCellValue("GRID", "grdData_List", this, "item_spec"),
                    dlv_qty: gw_com_api.getCellValue("GRID", "grdData_List", this, "issue_qty"),
                    pur_unit: gw_com_api.getCellValue("GRID", "grdData_List", this, "unit"),
                    label_tp: gw_com_api.getCellValue("GRID", "grdData_List", this, "label_tp"),
                    rqst_dept: gw_com_api.getValue("grdData_Cust", "selected", "supp_cd", true),
                    rqst_dept_nm: gw_com_api.getValue("grdData_Cust", "selected", "supp_nm", true),
                    rqst_user: gw_com_api.getCellValue("GRID", "grdData_List", this, "dlv_user"),
                    qc_qty: gw_com_api.getCellValue("GRID", "grdData_List", this, "qc_qty"),
                    pur_no: gw_com_api.getCellValue("GRID", "grdData_List", this, "pur_no"),
                    pur_seq: gw_com_api.getCellValue("GRID", "grdData_List", this, "pur_seq"),
                    visit_qa: gw_com_api.getCellValue("GRID", "grdData_List", this, "visit_qa"),
                    direct_yn: gw_com_api.getCellValue("GRID", "grdData_List", this, "direct_yn"),
                    dir_date: gw_com_api.getCellValue("GRID", "grdData_List", this, "dir_date"),
                    dir_place: gw_com_api.getCellValue("GRID", "grdData_List", this, "dir_place"),
                    chk_qty: fail_qty,
                    chk_result: "0"
                });
            }
        }
    })
    
    if (rows.length < 1) {
        gw_com_api.messageBox([ { text: "검수결과가 입력된 내역이 없습니다." } ]);
        return false;
    }

    //var ids = gw_com_api.getSelectedRow("grdData_List", true);
    //if (ids.length < 1) {
    //    gw_com_api.messageBox([ { text: "선택된 대상이 없습니다." } ]);
    //    return false;
    //}
    
    //var rows = [];
    //$.each(ids, function () {
    //    rows.push({
    //        barcode: gw_com_api.getCellValue("GRID", "grdData_List", this, "barcode")
    //        , dlv_no: gw_com_api.getCellValue("GRID", "grdData_List", this, "dlv_no")
    //        , dlv_seq: gw_com_api.getCellValue("GRID", "grdData_List", this, "dlv_seq")
    //        , track_no: gw_com_api.getCellValue("GRID", "grdData_List", this, "track_no")
    //        , proj_nm: gw_com_api.getCellValue("GRID", "grdData_List", this, "proj_nm")
    //        , pallet_no: gw_com_api.getCellValue("GRID", "grdData_List", this, "pallet_no")
    //        , item_cd: gw_com_api.getCellValue("GRID", "grdData_List", this, "item_cd")
    //        , item_nm: gw_com_api.getCellValue("GRID", "grdData_List", this, "item_nm")
    //        , item_spec: gw_com_api.getCellValue("GRID", "grdData_List", this, "item_spec")
    //        , dlv_qty: gw_com_api.getCellValue("GRID", "grdData_List", this, "issue_qty")
    //        , unit: gw_com_api.getCellValue("GRID", "grdData_List", this, "unit")
    //        , label_tp: gw_com_api.getCellValue("GRID", "grdData_List", this, "label_tp")
    //        , rqst_dept: gw_com_api.getValue("grdData_Cust", "selected", "supp_cd", true)
    //        , rqst_dept_nm: gw_com_api.getValue("grdData_Cust", "selected", "supp_nm", true)
    //        , rqst_user: gw_com_api.getCellValue("GRID", "grdData_List", this, "dlv_user")
    //        , qc_qty: gw_com_api.getCellValue("GRID", "grdData_List", this, "qc_qty")
    //        , pur_no: gw_com_api.getCellValue("GRID", "grdData_List", this, "pur_no")
    //        , pur_seq: gw_com_api.getCellValue("GRID", "grdData_List", this, "pur_seq")
    //    });
    //});

    var args = {
        ID: gw_com_api.v_Stream.msg_selectedPart_SCM,
        data: { rows: rows }
    };
    gw_com_module.streamInterface(args);

    processClear({});

}
//----------
function processBatch(param) {

    var args = {
        url: "COM",
        procedure: "PROC_SRM_ITEMCHK_CREATE",
        nomessage: true,
        input: [
            { name: "supp_cd", value: gw_com_api.getValue("grdData_Cust", "selected", "supp_cd", true), type: "varchar" },
            { name: "ymd_fr", value: gw_com_api.getValue("frmOption", 1, "ymd_fr"), type: "varchar" },
            { name: "ymd_to", value: gw_com_api.getValue("frmOption", 1, "ymd_to"), type: "varchar" },
            { name: "dept_area", value: gw_com_api.getValue("frmOption", 1, "dept_area"), type: "varchar" },
            { name: "pur_no", value: gw_com_api.getValue("frmOption", 1, "pur_no"), type: "varchar" },
            { name: "dlv_no", value: gw_com_api.getValue("frmOption", 1, "dlv_no"), type: "varchar" },
            { name: "item_cd", value: gw_com_api.getValue("frmOption", 1, "item_cd"), type: "varchar" },
            { name: "item_nm", value: gw_com_api.getValue("frmOption", 1, "item_nm"), type: "varchar" },
            { name: "user_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" },
            { name: "chk_date", value: gw_com_api.getValue("frmOption_3", 1, "chk_date"), type: "varchar" },
            { name: "chk_result", value: (param.element == "합격" ? "1" : "0"), type: "varchar" }
        ],
        output: [
            { name: "chk_no", type: "varchar" },
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
//----------
function successBatch(response, param) {

    if (response.VALUE[1] == "OK") {
        gw_com_api.messageBox([{ text: "SUCCESS" }]);
        var chk_no = response.VALUE[0];
        var args = {
            ID: gw_com_api.v_Stream.msg_selectedPart_SCM,
            data: { chk_no: chk_no }
        };
        gw_com_module.streamInterface(args);
    } else {
        gw_com_api.messageBox([{ text: response.VALUE[2] }]);
    }
    processClear({});

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
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_selectPart_SCM: {
            gw_com_api.show("frmOption");
        } break;
        case gw_com_api.v_Stream.msg_resultMessage: {
            if (param.data.page != gw_com_api.getPageID()) break;
            switch (param.data.ID) {
                case gw_com_api.v_Message.msg_confirmBatch: {
                    if (param.data.result == "YES") processBatch(param.data.arg);
                } break;
                case gw_com_api.v_Message.msg_informBatched: {
                    param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                } break;
            }
        } break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//