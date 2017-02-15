//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 납품대상 통관내역 조회
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
                    type: "INLINE", name: "라벨유형",
                    data: [
                        { title: "개별", value: "1" },
                        { title: "통합", value: "2" }
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

        	gw_com_module.startPage();
            //----------
        	var args = { ID: gw_com_api.v_Stream.msg_openedDialogue };
        	gw_com_module.streamInterface(args);
        }
    },

    // manage UI. (design section)
    UI: function () {

        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "조회", value: "조회", act: true },
				{ name: "저장", value: "확인", icon: "저장" },
				{ name: "닫기", value: "취소", icon: "닫기" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE",
            trans: true, show: true, border: true, remark: "lyrRemark2",
            editable: { bind: "open", focus: "cust_cd", validate: true },
            content: {
                row: [
                        {
                            element: [
				                {
				                    name: "bl_no", label: { title: "B/L번호 :" },
				                    editable: { type: "text", size: 8, validate: { rule: "required" } }
				                }
                            ]
                        },
                        {
                            align: "right",
                            element: [
                                { name: "실행", value: "실행", format: { type: "button" }, act: true },
                                { name: "취소", value: "취소", format: { type: "button", icon: "닫기" } }
                            ]
                        }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_MAIN", query: "w_find_srm_dlvitem_cc", title: "납품 대상 품목",
            height: 290, show: true, key: true, multi: true, checkrow: true,
            editable: { multi: true, bind: "select", focus: "label_tp", validate: true },
            element: [
				{ header: "협력사", name: "supp_nm", width: 100 },
				{ header: "통관번호", name: "cc_no", width: 60, align: "center" },
				{ header: "발주번호", name: "pur_no", width: 60, align: "center" },
				{ header: "품번", name: "item_cd", width: 80, align: "center" },
				{ header: "품명", name: "item_nm", width: 120, align: "left" },
				{ header: "규격", name: "item_spec", width: 120, align: "left" },
				{ header: "Tracking", name: "projkey", width: 80, align: "center" },
				{ header: "Pallet No.", name: "prc_cd", width: 80, align: "center" },
				{ header: "발주일", name: "pur_date", width: 70, align: "center", mask: "date-ymd" },
				{ header: "납기요청일", name: "req_date", width: 70, align: "center", mask: "date-ymd" },
				{ header: "PO수량", name: "pur_qty", width: 50, align: "right", mask: "numeric-int" },
				{ header: "단위", name: "pur_unit", width: 40, align: "center" },
				{ header: "통관수량", name: "cc_qty", width: 50, align: "right", mask: "numeric-int" },
				{
				    header: "라벨", name: "label_tp", width: 40, align: "center",
				    format: { type: "select", data: { memory: "라벨유형" } },
				    editable: { type: "select", data: { memory: "라벨유형" } }
				},
				{
				    header: "선입고", name: "direct_yn", width: 40, align: "center",
				    format: { type: "checkbox", value: 1, offval: 0 },
				    editable: { type: "checkbox", value: 1, offval: 0 }
				},
				{ header: "납품수량", name: "dlv_qty", width: 60, align: "right" },
                { name: "pur_seq", hidden: true }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
				{ type: "GRID", id: "grdList_MAIN", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        gw_com_module.informSize();
        //=====================================================================================

    },

    //==== manage process. (program section)
    procedure: function () {

        //=====================================================================================
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: toggleOption };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: informResult };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: toggleOption };
        gw_com_module.eventBind(args);
        //=====================================================================================

    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//----------
function toggleOption() {
    var args = { target: [{ id: "frmOption", focus: true }] };
    gw_com_module.objToggle(args);
}
//----------
function processRetrieve(param) {

    var args = { target: [ { type: "FORM", id: "frmOption" } ] };
    if (gw_com_module.objValidate(args) == false) return false;

    var args = {
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
				{ name: "bl_no", argument: "arg_cc_no" }
            ],
            remark: [
                { element: [{ name: "bl_no" }] }
            ]
        },
        target: [
			{ type: "GRID", id: "grdList_MAIN", select: true }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

};
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdList_MAIN" }
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
        rows.push({
            pur_no: gw_com_api.getCellValue("GRID", "grdList_MAIN", this, "pur_no"),
            pur_seq: gw_com_api.getCellValue("GRID", "grdList_MAIN", this, "pur_seq"),
            item_cd: gw_com_api.getCellValue("GRID", "grdList_MAIN", this, "item_cd"),
            item_nm: gw_com_api.getCellValue("GRID", "grdList_MAIN", this, "item_nm"),
            item_spec: gw_com_api.getCellValue("GRID", "grdList_MAIN", this, "item_spec"),
            track_no: gw_com_api.getCellValue("GRID", "grdList_MAIN", this, "track_no"),
            pallet_no: gw_com_api.getCellValue("GRID", "grdList_MAIN", this, "pallet_no"),
            req_date: gw_com_api.getCellValue("GRID", "grdList_MAIN", this, "req_date"),
            pur_qty: gw_com_api.getCellValue("GRID", "grdList_MAIN", this, "pur_qty"),
            pur_unit: gw_com_api.getCellValue("GRID", "grdList_MAIN", this, "pur_unit"),
            dlv_qty: gw_com_api.getCellValue("GRID", "grdList_MAIN", this, "cc_qty")
        });
    });
    var args = {
        ID: gw_com_api.v_Stream.msg_selectedPart_SCM,
        data: {
            supp_cd: gw_com_api.getValue("grdList_MAIN", "selected", "supp_cd", true),
            supp_nm: gw_com_api.getValue("grdList_MAIN", "selected", "supp_nm", true),
            rows: rows
        }
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
            if (param.data != undefined) {
                gw_com_api.setValue("frmOption", 1, "pur_no", param.data.pur_no == undefined ? "" : param.data.pur_no);
                gw_com_api.setValue("frmOption", 1, "supp_cd", param.data.supp_cd == undefined ? "" : param.data.supp_cd);
                gw_com_api.setValue("frmOption", 1, "except", param.data.except == undefined ? "" : param.data.except.replace(/,/gi, "','"));
            }
        } break;
        case gw_com_api.v_Stream.msg_resultMessage: {
            if (param.data.page != gw_com_api.getPageID()) break;
        } break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//