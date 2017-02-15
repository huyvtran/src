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

        // 협력사 여부
        v_global.logic.Supp = (gw_com_module.v_Session.USER_TP == "SUPP" ? true : false);

        // set data for DDDW List
        var args = { request: [
				{ type: "PAGE", name: "LINE", query: "DDDW_CM_CODED",
				    param: [ { argument: "arg_hcode", value: "IEHM02" } ]
				},
                {
                    type: "INLINE", name: "라벨유형",
                    data: [{ title: "개별", value: "1" }, { title: "통합", value: "2" }, { title: "-", value: "0" }]
                },
                {
                    type: "INLINE", name: "합불판정",
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
        }
    },

    // manage UI. (design section)
    UI: function () {

        //==== Main Menu : 조회, 확인, 취소
        var args = { targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "조회", value: "조회", act: true },
				{ name: "저장", value: "확인", icon: "저장" },
				{ name: "닫기", value: "취소", icon: "닫기" }
			]
        };
        gw_com_module.buttonMenu(args);

        //==== Find Grid : Option
        var args = { targetid: "grdData_Find", query: "w_find_srm_dlvitem_f", title: "검색 조건",
            height: "100%", pager: false, show: true,
            editable: { master: true, bind: "select", focus: "pur_no", validate: true },
            element: [
				{
				    header: "발주번호", name: "pur_no", width: 80, align: "center",
				    editable: { type: "text", width: 100/*, validate: { rule: "required" }*/ }
				},
				{
				    header: "품번", name: "item_cd", width: 80, align: "center",
				    editable: { type: "text", width: 100 }
				},
				{
				    header: "품명", name: "item_nm", width: 120, align: "center",
				    editable: { type: "text", width: 150 }
				},
				{
				    header: "규격", name: "item_spec", width: 150, align: "center",
				    editable: { type: "text", width: 190 }
				},
				{
				    header: "Project No.", name: "proj_no", width: 80, align: "center",
				    editable: { type: "text", width: 100 }, hidden: true
				},
				{
				    header: "발주일자(From)", name: "ymd_fr", width: 100, align: "center",
				    editable: { type: "text" }, mask: "date-ymd"
				},
				{
				    header: "발주일자(To)", name: "ymd_to", width: 100, align: "center",
				    editable: { type: "text" }, mask: "date-ymd"
				},
                {
                    header: "협력사ID", name: "supp_cd", width: 100, align: "left",
                    editable: { type: "text" }, hidden: true
                },
                { name: "except", hidden: true }
            ]
        };
        gw_com_module.gridCreate(args);

        //==== List Grid : 납품 대상 발주목록
        var args = { targetid: "grdData_List", query: "w_find_srm_dlvitem_l", title: "납품 대상 품목",
            height: 250, show: true, dynamic: true, key: true, multi: true, checkrow: true,
            color: {
                row: true,
                //element: ["chk01_yn_nm"]
            },
            element: [
				{ header: "발주번호", name: "pur_no", width: 80, align: "center" },
				{ header: "품번", name: "item_cd", width: 80, align: "center" },
				{ header: "품명", name: "item_nm", width: 120, align: "center" },
				{ header: "규격", name: "item_spec", width: 120, align: "center" },
				{ header: "Project Name", name: "proj_nm", width: 130 },
				{ header: "Project No.", name: "track_no", width: 80, align: "center" },
				{ header: "Pallet No.", name: "pallet_no", width: 80, align: "center", hidden: true },
				{ header: (v_global.logic.Supp ? "고객요청일" : "납기요구일"), name: "req_date", width: 70, align: "center", mask: "date-ymd" },
				{ header: "발주수량", name: "pur_qty", width: 60, align: "right", mask: "numeric-int" },
				{ header: "단위", name: "pur_unit", width: 40, align: "center" },
				{ header: "납품수량", name: "dlv_qty", width: 60, align: "right", mask: "numeric-int" },
				{
				    header: "라벨", name: "label_tp", width: 40, align: "center",
				    format: { type: "select", data: { memory: "라벨유형" } }, hidden: true
				},
				{
				    header: "직납", name: "direct_yn", width: 40, align: "center",
                    format: { type: "checkbox", value: 1, offval: 0 }, hidden: true
				},
                { name: "pur_no", hidden: true },
                { name: "pur_seq", hidden: true },
                { name: "color", hidden: true }
			]
        };
        gw_com_module.gridCreate(args);

        //==== Resize Objects
        var args = {
            target: [
				{ type: "GRID", id: "grdData_Find", offset: 8 },
                { type: "GRID", id: "grdData_List", offset: 8 }
			]
        };
        gw_com_module.objResize(args);
        gw_com_module.informSize();

        //$("#lyrNotice").text("※ 발주번호(PO번호) 단위로 납품등록 하세요.");
        $("#lyrNotice").html("※ 발주번호(PO번호) 단위로 납품등록 하세요. <font color='red'>빨간색 품목은 <b>성적서 필수 첨부</b> 품목입니다.</font>");

    },

    //==== manage process. (program section)
    procedure: function () {

        //==== Button Click : Main 조회, 추가, 수정, 출력(납품서), 라벨(라벨출력), 닫기 ====
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: informResult };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);

        //----------
        var args = { targetid: "grdData_Find", grid: true, event: "itemchanged", handler: itemchanged_grdData_Find };
        gw_com_module.eventBind(args);
        //----------
//        var args = { targetid: "grdData_List", grid: true, event: "rowdblclick", handler: informResult };
//        gw_com_module.eventBind(args);
//        var args = { targetid: "grdData_List", grid: true, event: "rowkeyenter", handler: informResult };
//        gw_com_module.eventBind(args);


        //----------
        function itemchanged_grdData_Find(ui) {

            switch (ui.element) {
                case "prod_type": {
                    gw_com_api.setCellValue(ui.type, ui.object, ui.row, "cust_cd", "%");
                } break;
                case "prod_cd": {
                    gw_com_api.setCellValue(ui.type, ui.object, ui.row, "prod_nm", "");
                } break;
            }

        }

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
function processRetrieve(param) {

    var args = { target: [ { type: "GRID", id: "grdData_Find" } ] };
    if (gw_com_module.objValidate(args) == false) return false;

    var args = {
        source: { type: "GRID", id: "grdData_Find", row: "selected",
            element: [
				{ name: "supp_cd", argument: "arg_supp_cd" },
				{ name: "pur_no", argument: "arg_pur_no" },
				{ name: "item_cd", argument: "arg_item_cd" },
				{ name: "item_nm", argument: "arg_item_nm" },
				{ name: "item_spec", argument: "arg_item_spec" },
				{ name: "proj_no", argument: "arg_proj_no" },
				{ name: "ymd_fr", argument: "arg_ymd_fr" },
				{ name: "ymd_to", argument: "arg_ymd_to" },
				{ name: "except", argument: "arg_except" }
            ]
        },
        target: [
			{ type: "GRID", id: "grdData_List", focus: true }
		],
        key: param.key
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
function informResult(param) {

    var ids = gw_com_api.getSelectedRow("grdData_List", true);
    if (ids.length < 1) {
        gw_com_api.messageBox([ { text: "선택된 대상이 없습니다." } ]);
        return false;
    }
    
    var rows = [];
    $.each(ids, function () {
	var dlvQty = gw_com_api.getCellValue("GRID", "grdData_List", this, "pur_qty") - gw_com_api.getCellValue("GRID", "grdData_List", this, "dlv_qty");
        rows.push({
            pur_no: gw_com_api.getCellValue("GRID", "grdData_List", this, "pur_no"),
            pur_seq: gw_com_api.getCellValue("GRID", "grdData_List", this, "pur_seq"),
            item_cd: gw_com_api.getCellValue("GRID", "grdData_List", this, "item_cd"),
            item_nm: gw_com_api.getCellValue("GRID", "grdData_List", this, "item_nm"),
            item_spec: gw_com_api.getCellValue("GRID", "grdData_List", this, "item_spec"),
            track_no: gw_com_api.getCellValue("GRID", "grdData_List", this, "track_no"),
            proj_nm: gw_com_api.getCellValue("GRID", "grdData_List", this, "proj_nm"),
            pallet_no: gw_com_api.getCellValue("GRID", "grdData_List", this, "pallet_no"),
            req_date: gw_com_api.getCellValue("GRID", "grdData_List", this, "req_date"),
            pur_qty: gw_com_api.getCellValue("GRID", "grdData_List", this, "pur_qty"),
            pur_unit: gw_com_api.getCellValue("GRID", "grdData_List", this, "pur_unit"),
            dlv_qty: dlvQty
        });
    });
    var args = {
        ID: gw_com_api.v_Stream.msg_selectedPart_SCM,
        data: { rows: rows }
    };
    gw_com_module.streamInterface(args);

    processClear({});

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_selectPart_SCM: {
            var args = { targetid: "grdData_Find", edit: true };
            if (param.data != undefined) {
                var PurNo = "";
                if (param.data.pur_no != undefined) PurNo = param.data.pur_no;
                if (param.data.supp_cd != undefined) v_global.logic.SuppCd = param.data.supp_cd;

                args.data = [
                    { name: "pur_no", value: PurNo },
                    { name: "supp_cd", value: v_global.logic.SuppCd },
                    { name: "ymd_fr", value: gw_com_api.getDate("", { day:-30 }) },
                    { name: "ymd_to", value: gw_com_api.getDate("", { day: 0 }) },
                    { name: "except", value: (param.data.except == undefined ? "" : param.data.except.replace(/,/gi, "','")) }
                ];
            }
            gw_com_module.gridInsert(args);
        } break;
        case gw_com_api.v_Stream.msg_resultMessage: {
            if (param.data.page != gw_com_api.getPageID()) break;
        } break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//