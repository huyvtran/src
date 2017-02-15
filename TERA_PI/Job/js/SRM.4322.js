//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 가입고대상 납품내역 조회
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
    data: null, logic: {}
};

var r_barcode;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define gw_job_process class : ready(), UI(), procedure()
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var gw_job_process = {

    // entry point. (pre-process section)
    ready: function () {

        //[1] initialize page.
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        // 협력사 숨김 여부 설정
        v_global.logic.HideSupp = (gw_com_module.v_Session.DEPT_AREA=="SOLAR") ? false : true ;
		
        //[2] set data for DDDW List
        var args = { request: [
                { type: "INLINE", name: "합불판정",
                    data: [ { title: "합격", value: "1" }, { title: "불합격", value: "0" } ]
                }
			], starter: start
        };
        gw_com_module.selectSet(args);

        //[3] create UI objects & define events & start logic
        function start() { 
        	//[3.1] UI & Events
        	gw_job_process.UI(); 
        	gw_job_process.procedure();
            //[3.2] Notice Opened Event to Master Page
            var args = { ID: gw_com_api.v_Stream.msg_openedDialogue };
            gw_com_module.streamInterface(args);
        }
    },

    // manage UI. (design section)
    UI: function () {

        //==== Main Menu : 조회, 확인, 취소
        var args = { targetid: "lyrMenu", type: "FREE",
            element: [
//				{ name: "조회", value: "조회", act: true },
                //{ name: "선택", value: "전체선택", icon: "예" },
                //{ name: "취소", value: "선택취소", icon: "아니오" },
				{ name: "저장", value: "확인", icon: "저장" },
				{ name: "닫기", value: "취소", icon: "닫기" }
			]
        };
        gw_com_module.buttonMenu(args);

        //==== Find Grid : Option
        var args = {
            targetid: "grdData_Find", title: "품목 번호 입력",
            height: "100%", pager: false, show: false, caption: true,
            editable: { master: true, bind: "select", focus: "incode", validate: true },
            element: [
				{
				    header: "바코드 입력", name: "incode", width: 100, align: "center",
				    editable: { type: "text", size: 100, maxlength: 10 }
				},
				{
				    header: "확인코드", name: "barcode", width: 100, align: "center"
					, editable: { type: "hidden" }
				},
				{
				    header: "품목수", name: "item_cnt", width: 90, align: "right"
					, editable: { type: "hidden" }
				},
				{
				    header: "확인 품목수", name: "chk_item_cnt", width: 90, align: "right"
					, editable: { type: "hidden" }
				},
				{
				    header: "총수량", name: "item_sum", width: 90, align: "right"
					, editable: { type: "hidden" }
				},
				{
				    header: "확인수량", name: "chk_item_sum", width: 90, align: "right"
					, editable: { type: "hidden" }
				}
            ]
        };
        gw_com_module.gridCreate(args);

        //==== List Grid : 검수 대상 납품목록
        var args = {
            targetid: "grdData_List", query: "SRM_4322_S_1", title: "가입고 대상 품목",
            height: 350, show: true, caption: true, selectable: true, multi: true, checkrow: true,
            editable: { multi: true, bind: "select", focus: "chk_qty", validate: true },
            element: [
				        { header: "바코드", name: "barcode", width: 70, align: "center", hidden: true },
				        { header: "품번", name: "item_cd", width: 70, align: "center" },
				        { header: "품명", name: "item_nm", width: 130, align: "left" },
				        { header: "규격", name: "item_spec", width: 130, align: "left" },
				        { header: "Project Name", name: "proj_nm", width: 130 },
				        { header: "Project No.", name: "track_no", width: 80, align: "center" },
				        { header: "Pallet No.", name: "pallet_no", width: 70, align: "center", hidden: true },
				        { header: "검수유형", name: "chk_yn_nm", width: 50, align: "center" },
				        { header: "검수결과", name: "chk_result_nm", width: 50, align: "center" },
				        { header: "납품수량", name: "dlv_qty", width: 50, align: "right" },
				        { header: "단위", name: "pur_unit", width: 40, align: "center" },
				        {
				            header: "확인수량", name: "chk_qty", width: 50, align: "right"
				            , editable: { type: "text", validate: { rule: "required"} }, hidden: true   // TERA-사용안함
				        },
				        { header: "발주번호", name: "pur_no", width: 100, align: "center" },
				        { header: "발주순번", name: "pur_seq", width: 60, align: "center", hidden: true },
                        { name: "plant_cd", hidden: true, editable: { type: "hidden" } },
                        { name: "label_tp", hidden: true, editable: { type: "hidden" } },
                        { name: "direct_yn", hidden: true, editable: { type: "hidden" } },
                        { name: "supp_cd", hidden: true, editable: { type: "hidden" } },
                        { name: "supp_nm", hidden: true, editable: { type: "hidden" } },
                        { name: "dlv_user", hidden: true, editable: { type: "hidden" } },
                        { name: "dlv_user_nm", hidden: true, editable: { type: "hidden" } },
                        { name: "dlv_no", hidden: true, editable: { type: "hidden" } },
                        { name: "dlv_seq", hidden: true, editable: { type: "hidden" } },
                        { name: "pur_no", hidden: true, editable: { type: "hidden" } },
                        { name: "pur_seq", hidden: true, editable: { type: "hidden" } },
                        { name: "pur_qty", hidden: true, editable: { type: "hidden" } },
                        { name: "req_date", hidden: true, editable: { type: "hidden" } },
                        { name: "chk_yn", hidden: true, editable: { type: "hidden" } },
                        { name: "chk_result", hidden: true, editable: { type: "hidden" } }
            ]
        };
        gw_com_module.gridCreate(args);

        //==== Resize Objects
        var args = {
            target: [
				{ type: "GRID", id: "grdData_Find", offset: 15 },
                { type: "GRID", id: "grdData_List", offset: 15 }
			]
        };
        gw_com_module.objResize(args);
        gw_com_module.informSize();

    },

    //==== manage process. (program section)
    procedure: function () {

        //==== Button Click : Main 조회, 추가, 수정, 출력(납품서), 라벨(라벨출력), 닫기 ====
//        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: processRetrieve };
//        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: informResult };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "선택", event: "click", handler: processSelect };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "취소", event: "click", handler: processSelect };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_Find", grid: true, event: "itemkeyup", handler: eventItemKeyUp };
        gw_com_module.eventBind(args);
        //----------
        //var args = { targetid: "grdData_List", grid: true, event: "rowselecting", handler: rowfocuschanging };
        //gw_com_module.eventBind(args);
        ////----------
        //var args = { targetid: "grdData_List", grid: true, event: "rowselected", handler: rowfocuschanged };
        //gw_com_module.eventBind(args);
        //----------


        // startup process.
        //----------
        gw_com_module.startPage();
    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//----------
function eventItemKeyUp(ui) {
    if (ui.object == "grdData_Find"){
		if (event.keyCode==17 || event.keyCode==13) {
			var args = { bcode: gw_com_api.getValue( "grdData_Find", 1, "incode", true ) };
			processBarcode(args);
		}
    }
}
//----------
function processBarcode(param) {
    var nRow = gw_com_api.getFindRow("grdData_List", "barcode", param.bcode);
    if (nRow > 0) {
        var nFind = jQuery.inArray(String(nRow), gw_com_api.getSelectedRow("grdData_List", true));
        if (nFind >= 0) {
            //gw_com_api.messageBox([{ text: "이미 체크한 품목입니다." }], 300);
            alert("이미 체크한 품목입니다.");
            gw_com_api.setValue("grdData_Find", "selected", "barcode", "", true, true);
        } else {
            gw_com_api.setValue("grdData_Find", "selected", "barcode", param.bcode, true, true);
            gw_com_api.selectRow("grdData_List", nRow, true);
        }
    } else {
        //gw_com_api.messageBox([{ text: "잘못된 품목입니다." }], 300);
        alert("잘못된 품목입니다.");
        gw_com_api.setValue("grdData_Find", "selected", "barcode", "", true, true);
    }

    gw_com_api.setValue("grdData_Find", "selected", "incode", "", true);
}
//----------
function processRetrieve(param) {

    var s_barcode = "";
    $.each(r_barcode, function () {
        s_barcode += (s_barcode == "" ? this.barcode : "," + this.barcode);
    });
    s_barcode = s_barcode.replace(/,/gi, "','");

    //test: 1106020001
    var args = {
        source: {
            type: "INLINE",
            argument: [
				{ name: "arg_barcode", value: s_barcode }//"1106020001" }
            ]
        }, target: [
			{ type: "GRID", id: "grdData_List", select: false, focus: false }
		],
        key: param.key, handler_complete: informSet
    };
    gw_com_module.objRetrieve(args);

};
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdData_Find" },
            { type: "GRID", id: "grdData_List" }
        ]
    };
    gw_com_module.objClear(args);

}
//----------
function processClose(param) {

    var args = { ID: gw_com_api.v_Stream.msg_closeDialogue };
    gw_com_module.streamInterface(args);
    processClear({});

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

}
//----------
function informSet() {
    var nItemCnt = gw_com_api.getRowCount("grdData_List");
    var nItemSum = 0;
    var nChkItemCnt = 0;
    var nChkItemSum = 0;

    for (var i = 1; i <= nItemCnt ; i++) {
        nItemSum += Number(gw_com_api.getValue("grdData_List", i, "dlv_qty", true));
    }

    var ids = gw_com_api.getSelectedRow("grdData_List", true);
    $.each(ids, function () {
        nChkItemCnt++;
        nChkItemSum += Number(gw_com_api.getCellValue("GRID", "grdData_List", this, "dlv_qty"));
    });

    gw_com_api.setValue("grdData_Find", "selected", "item_cnt", nItemCnt, true, true);
    gw_com_api.setValue("grdData_Find", "selected", "item_sum", nItemSum, true, true);
    gw_com_api.setValue("grdData_Find", "selected", "chk_item_cnt", nChkItemCnt, true, true);
    gw_com_api.setValue("grdData_Find", "selected", "chk_item_sum", nChkItemSum, true, true);

}
//----------
function informResult(param) {

    var ids = gw_com_api.getSelectedRow("grdData_List", true);
    if (ids.length < 1) {
        //gw_com_api.messageBox([{ text: "선택된 대상이 없습니다." }]);
        alert("선택된 대상이 없습니다.");
        return false;
    }

    var rows = [];

    var bChk = false;
    $.each(ids, function () {
        //// 검사유형 체크----------------------------------------------------------------------------------
        //if (gw_com_api.getCellValue("GRID", "grdData_List", this, "chk_yn") == "1") {
        //    if (gw_com_api.getCellValue("GRID", "grdData_List", this, "chk_result") == "") {
        //        //gw_com_api.messageBox([{ text: "수입검사가 진행되지 않은 품목이 있습니다." }], 400);
        //        alert("수입검사가 진행되지 않은 품목이 있습니다.");
        //        bChk = true;
        //        return false;
        //    }
        //}

        //if (gw_com_api.getCellValue("GRID", "grdData_List", this, "chk_result") == "0") {
        //    //gw_com_api.messageBox([{ text: "수입검사 [불합격] 품목은 입고처리 할 수 없습니다." }], 400);
        //    alert("수입검사 [불합격] 품목은 입고처리 할 수 없습니다.");
        //    bChk = true;
        //    return false;
        //}
        //// -----------------------------------------------------------------------------------------------

        rows.push({
            item_cd: gw_com_api.getCellValue("GRID", "grdData_List", this, "item_cd")
            , item_nm: gw_com_api.getCellValue("GRID", "grdData_List", this, "item_nm")
            , item_spec: gw_com_api.getCellValue("GRID", "grdData_List", this, "item_spec")
            , track_no: gw_com_api.getCellValue("GRID", "grdData_List", this, "track_no")
            , proj_nm: gw_com_api.getCellValue("GRID", "grdData_List", this, "proj_nm")
            , pallet_no: gw_com_api.getCellValue("GRID", "grdData_List", this, "pallet_no")
            , plant_cd: gw_com_api.getCellValue("GRID", "grdData_List", this, "plant_cd")
            , req_date: gw_com_api.getCellValue("GRID", "grdData_List", this, "req_date")
            , pur_qty: gw_com_api.getCellValue("GRID", "grdData_List", this, "pur_qty")
            , io_unit: gw_com_api.getCellValue("GRID", "grdData_List", this, "pur_unit")
            //, io_qty: gw_com_api.getCellValue("GRID", "grdData_List", this, "chk_qty")
            , io_qty: gw_com_api.getCellValue("GRID", "grdData_List", this, "dlv_qty")  // TERA - 바코드 사용하지 않음.
            , label_tp: gw_com_api.getCellValue("GRID", "grdData_List", this, "label_tp")
            , direct_yn: gw_com_api.getCellValue("GRID", "grdData_List", this, "direct_yn")
            , barcode: gw_com_api.getCellValue("GRID", "grdData_List", this, "barcode")
            , root_no: gw_com_api.getCellValue("GRID", "grdData_List", this, "dlv_no")
            , root_seq: gw_com_api.getCellValue("GRID", "grdData_List", this, "dlv_seq")
            , pur_no: gw_com_api.getCellValue("GRID", "grdData_List", this, "pur_no")
            , pur_seq: gw_com_api.getCellValue("GRID", "grdData_List", this, "pur_seq")
            , io_cd: "구매입고"
            , loc_cd: "자재"
        });
    });

    if (bChk) return false;

    var args = {
        ID: gw_com_api.v_Stream.msg_selectedPart_SCM
        , SUBID: "품목"
        , data: { rows: rows }
    };

    r_barcode = rows;
    gw_com_module.streamInterface(args);
    processClear({});

}
//----------
function rowfocuschanging(param) {
    var gridYn = (param.type == "GRID" ? true : false);
    if (param.object == "grdData_List") {
        // 검사유형 체크----------------------------------------------------------------------------------
        if (gw_com_api.getValue(param.object, param.row, "chk_yn", gridYn) == "1") {
            if (gw_com_api.getValue(param.object, param.row, "chk_result", gridYn) == "") {
                //gw_com_api.messageBox([{ text: "<b>수입검사 필수</b> 품목입니다." }, { text: "수입검사를 먼저 진행해 주세요." }], 300);
                alert("수입검사 필수 품목입니다.\n수입검사를 먼저 진행해 주세요.");
                return false;
            }
        }

        if (gw_com_api.getValue("grdData_List", param.row, "chk_result", gridYn) == "0") {
            //gw_com_api.messageBox([{ text: "수입검사 [불합격] 품목입니다." }], 300);
            alert("수입검사 [불합격] 품목입니다.");
            return false;
        }
        // -----------------------------------------------------------------------------------------------
    }
    return true;
}
//----------
function rowfocuschanged(param) {
    var gridYn = (param.type == "GRID" ? true : false);
    if (param.object == "grdData_List") {
        processSelect(param);
    }
}
//----------
function processSelect(param) {

    if (param.element == "선택") {
        gw_com_api.selectRow("grdData_List", "reset");
        for (var i = 1; i <= gw_com_api.getRowCount("grdData_List") ; i++) {
            gw_com_api.selectRow("grdData_List", i, true);
            var dlv_qty = gw_com_api.getValue("grdData_List", i, "dlv_qty", true);
            gw_com_api.setValue("grdData_List", i, "chk_qty", dlv_qty, true);
        }
    } else if (param.element == "취소") {
        gw_com_api.selectRow("grdData_List", "reset");
        for (var i = 1; i <= gw_com_api.getRowCount("grdData_List") ; i++) {
            gw_com_api.setValue("grdData_List", i, "chk_qty", 0, true);
        }
    } else {
        var dlv_qty = (param.status ? gw_com_api.getValue(param.object, param.row, "dlv_qty", true) : 0);
        gw_com_api.setValue("grdData_List", param.row, "chk_qty", dlv_qty, true);
    }

    //확인
    informSet();

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_selectPart_SCM: {
            var args = { targetid: "grdData_Find", edit: true };
            if (param.data != undefined) {
                r_barcode = param.data.barcode;
                gw_com_module.gridInsert(args);
                processRetrieve({});
            }
        } break;
        case gw_com_api.v_Stream.msg_resultMessage: {
            //if (param.data.page != gw_com_api.getPageID()) break;
            gw_com_api.setFocus("grdData_Find", "selected", "incode", true);
        } break;
    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//