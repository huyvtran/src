//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 납품 등록
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
    data: null, logic: {}
};

var chkRows;
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define gw_job_process class : ready(), UI(), procedure()
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var gw_job_process = {

    // entry point. (pre-process section)
    ready: function () {

        // initialize page.
        v_global.process.param = gw_com_module.initPage({ authority: true, message: true });
        gw_com_api.changeTheme("style_theme");

        // 협력사 여부
        v_global.logic.Supp = (gw_com_module.v_Session.USER_TP == "SUPP" ? true : false);

        // set data for DDDW List
        var args = {
            request: [
                    {
                        type: "INLINE", name: "라벨유형",
                        data: [{ title: "개별", value: "1" }, { title: "통합", value: "2" }]
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
        }

    },

    // manage UI. (design section)
    UI: function () {

        //==== Main Menu : 저장, 삭제, 닫기
        var args = {
            targetid: "lyrMenu_Main", type: "FREE",
            element: [
				{ name: "생성", value: "바코드", icon: "실행" },
				{ name: "저장", value: "저장" },
				{ name: "삭제", value: "삭제" },
				{ name: "닫기", value: "닫기" }
            ]
        };
        gw_com_module.buttonMenu(args);

        //==== Sub Menu : (납품내역) 추가, 삭제
        var args = {
            targetid: "lyrMenu_Sub", type: "FREE",
            element: [
				{ name: "추가", value: "추가" },
				{ name: "삭제", value: "삭제" }
            ]
        };
        gw_com_module.buttonMenu(args);

        //==== Option : 일괄적용(라벨, 선입고)
        var args = {
            targetid: "frmOption2", query: "", type: "TABLE", title: "",
            caption: false, show: true, selectable: true,
            editable: { bind: "select", focus: "label_tp", validate: true },
            content: {
                width: { label: 50, field: 60 }, height: 25,
                row: [
                    {
                        element: [
                          { header: true, value: "라벨", format: { type: "label" } },
                          {
                              name: "label_tp", align: "center"
                              , format: { type: "select", data: { memory: "라벨유형" } }
                              , editable: {
                                  type: "select", validate: { rule: "required" }
                                  , data: { memory: "라벨유형" }
                              }
                          },
                          { header: true, value: "선입고", format: { type: "label" } },
                          {
                              name: "direct_yn", align: "center",
                              format: { type: "checkbox", title: "", value: 1, offval: 0 },
                              editable: { type: "checkbox", title: "", value: 1, offval: 0 }
                          }
                        ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);

        //==== Main Form : 납품 정보
        var args = {
            targetid: "frmData_Main", query: "SRM_4120_M_1", type: "TABLE", title: "납품 정보",
            caption: false, show: true, selectable: true,
            editable: { bind: "select", focus: "str_time", validate: true },
            content: {
                width: { label: 76, field: 168 }, height: 25,
                row: [
                    {
                        element: [
                          { header: true, value: "납품번호", format: { type: "label" } },
                          { name: "dlv_no", editable: { type: "hidden" } },
                          { header: true, value: "공급사", format: { type: "label" } },
                          { name: "supp_nm", editable: { type: "hidden" } },
                          { name: "supp_cd", hidden: true, editable: { type: "hidden" } },
                          { name: "barcode_cnt", hidden: true },
                          { name: "regen_yn", hidden: true },
                          { header: true, value: "검수자", format: { type: "label" } },
                          { name: "chk_user", editable: { type: "hidden" } },
                          { header: true, value: "검수일시", format: { type: "label" } },
                          { name: "chk_dt", editable: { type: "hidden" } }
                        ]
                    },
                    {
                        element: [
                          { header: true, value: "납품일자", format: { type: "label" } },
                          {
                              name: "dlv_date", mask: "date-ymd",
                              editable: { type: "text", validate: { rule: "required" } }
                          },
                          { header: true, value: "담당자", format: { type: "label" } },
                          { name: "dlv_user", editable: { type: "text" } },
                          { header: true, value: "인수자", format: { type: "label" } },
                          { name: "acp_user", editable: { type: "hidden" } },
                          { header: true, value: "인계일시", format: { type: "label" } },
                          { name: "acp_dt", editable: { type: "hidden" } }
                        ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);

        //==== Sub Form : 납품 목록
        var args = {
            targetid: "grdData_Sub", query: "SRM_4120_S_1", title: "납품 목록",
            caption: true, height: "100%", pager: false, show: true, selectable: true, number: true,
            editable: { multi: true, bind: "select", focus: "dlv_qty", validate: true },
            element: [
                {
                    header: "발주번호", name: "pur_no", width: 60, align: "center"
                    , editable: { type: "hidden" }
                },
				{
				    header: "품번", name: "item_cd", width: 80, align: "center"
					, editable: { type: "hidden" }
				},
				{
				    header: "품명", name: "item_nm", width: 120, align: "left"
					, editable: { type: "hidden" }
				},
				{
				    header: "규격", name: "item_spec", width: 120, align: "left"
					, editable: { type: "hidden" }
				},
				{
				    header: "Tracking", name: "track_no", width: 80, align: "center"
					, editable: { type: "hidden" }
				},
				{
				    header: "Pallet No.", name: "pallet_no", width: 80, align: "center"
					, editable: { type: "hidden" }
				},
				{
				    header: "납기요청일", name: "req_date", width: 70, align: "center", mask: "date-ymd"
					, editable: { type: "hidden" }
				},
				{
				    header: "PO수량", name: "pur_qty", width: 50, align: "right"
					, editable: { type: "hidden" }
				},
				{
				    header: "단위", name: "pur_unit", width: 40, align: "center"
					, editable: { type: "hidden" }
				},
				{
				    header: "납품수량", name: "dlv_qty", width: 50, align: "right"
					, editable: { type: "text", validate: { rule: "required" } }
				},
				{
				    header: "라벨", name: "label_tp", width: 50, align: "center"
					, format: { type: "select", data: { memory: "라벨유형" } }
					, editable: {
					    type: "select", validate: { rule: "required" }
						, data: { memory: "라벨유형" }
					}
				},
				{
				    header: "선입고", name: "direct_yn", width: 30, align: "center"
					, format: { type: "checkbox", value: 1, offval: 0 }
					, editable: { type: "checkbox", value: 1, offval: 0 }
				},
                { name: "dlv_no", hidden: true, editable: { type: "hidden" } },
                { name: "dlv_seq", hidden: true, editable: { type: "hidden" } },
                { name: "pur_seq", hidden: true, editable: { type: "hidden" } }
            ]
        };
        gw_com_module.gridCreate(args);

        //==== Resize Objects
        var args = {
            target: [
                { type: "FORM", id: "frmData_Main", offset: 8 },
                { type: "GRID", id: "grdData_Sub", offset: 8 }
            ]
        };
        gw_com_module.objResize(args);
        gw_com_module.informSize();

        var args = {
            targetid: "frmOption2", edit: true,
            data: [
                { name: "direct_yn", value: 0 }
            ]
        };
        gw_com_module.formInsert(args);
    },

    //==== manage process. (program section)
    procedure: function () {

        //==== Button Click : Main (저장, 삭제, 닫기) ====
        //----------
        var args = { targetid: "lyrMenu_Main", element: "생성", event: "click", handler: checkAppliable };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_Main", element: "저장", event: "click", handler: click_lyrMenu_Main_저장 };
        gw_com_module.eventBind(args);
        function click_lyrMenu_Main_저장(ui) { processSave({}); }
        //----------
        var args = { targetid: "lyrMenu_Main", element: "삭제", event: "click", handler: click_lyrMenu_Main_삭제 };
        gw_com_module.eventBind(args);
        function click_lyrMenu_Main_삭제(ui) { processDelete(ui); }
        //----------
        var args = { targetid: "lyrMenu_Main", element: "닫기", event: "click", handler: click_lyrMenu_Main_닫기 };
        gw_com_module.eventBind(args);
        function click_lyrMenu_Main_닫기(ui) { processClose({}); }

        //==== Option : 일괄적용(라벨, 선입고)
        //----------
        var args = { targetid: "frmOption2", grid: false, event: "itemchanged", handler: processItemChanged };
        gw_com_module.eventBind(args);
        //----------

        //==== Button Click : Sub ====
        //----------
        var args = { targetid: "lyrMenu_Sub", element: "추가", event: "click", handler: click_lyrMenu_Sub_추가 };
        gw_com_module.eventBind(args);
        function click_lyrMenu_Sub_추가(ui) { processInsert(ui); }
        //----------
        var args = { targetid: "lyrMenu_Sub", element: "삭제", event: "click", handler: click_lyrMenu_Sub_삭제 };
        gw_com_module.eventBind(args);
        function click_lyrMenu_Sub_삭제(ui) { processDelete(ui); }


        // startup process.
        gw_com_module.startPage();

        v_global.logic.key = "";
        if (v_global.process.param != "") {	// Page Parameter 변수 저장
            v_global.logic.key = gw_com_api.getPageParameter("dlv_no");
            v_global.logic.supp_cd = "";//gw_com_api.getPageParameter("supp_cd");
            v_global.logic.supp_nm = "";//gw_com_api.getPageParameter("supp_nm");
            v_global.logic.opt_ymd_fr = gw_com_api.getPageParameter("opt_ymd_fr");
            v_global.logic.opt_ymd_to = gw_com_api.getPageParameter("opt_ymd_to");
            v_global.logic.opt_dlv_no = gw_com_api.getPageParameter("opt_dlv_no");
            v_global.logic.opt_supp_cd = gw_com_api.getPageParameter("opt_supp_cd");
            v_global.logic.opt_supp_nm = gw_com_api.getPageParameter("opt_supp_nm");
            v_global.logic.opt_pur_no = gw_com_api.getPageParameter("opt_pur_no");
        }

        // 협력사
        if (v_global.logic.Supp) {
            v_global.logic.supp_cd = gw_com_module.v_Session.EMP_NO;
            v_global.logic.supp_nm = gw_com_module.v_Session.USR_NM;
        }

        if (v_global.logic.key == "")
            processInsert({ object: "Main" }); // 신규 등록
        else
            processRetrieve({ key: v_global.logic.key }); //수정 및 조회

    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function checkAppliable(param) {

    if (gw_com_api.getRowCount("frmData_Main") < 1) return;
    if (gw_com_api.getValue("frmData_Main", "selected", "barcode_cnt", false) == "0") {
        // 신규
        processRun({});
    } else if (gw_com_api.getValue("frmData_Main", "selected", "regen_yn", false) == "1") {
        // 변경 : 개별(수량증가), 통합(수량변경)
        gw_com_api.messageBox([
            { text: "바코드 정보를 변경합니다." },
            { text: "계속 하시겠습니까?" }
        ], 300, gw_com_api.v_Message.msg_confirmBatch, "YESNO", { apply: true });
    } else {
        processPop({ object: "lyrMenu_Main" });
    }

}
//----------
function processRun(param) {

    //바코드 생성
    var args = {
        url: "COM",
        procedure: "sp_keygen_barcode_dlv",
        nomessage: true,
        input: [
            { name: "DlvNo", value: gw_com_api.getValue("frmData_Main", "selected", "dlv_no", false), type: "varchar" },
            { name: "UserId", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
        ],
        output: [
            { name: "Message", type: "varchar" }
        ],
        handler: {
            success: completeRun
        }
    };
    gw_com_module.callProcedure(args);

}
//----------
function completeRun(response) {

    ////가입고 자동 생성
    //if (!v_global.logic.Supp) {
    //    var args = {
    //        url: "COM",
    //        procedure: "PROC_SRM_ITEMIO_AUTO_CREATE",
    //        nomessage: true,
    //        input: [
    //            { name: "RootNo", value: gw_com_api.getValue("frmData_Main", "selected", "dlv_no", false), type: "varchar" },
    //            { name: "RootTp", value: "DLV", type: "varchar" },
    //            { name: "UserId", value: gw_com_module.v_Session.USR_ID, type: "varchar" },
    //            { name: "UserDept", value: gw_com_module.v_Session.DEPT_CD, type: "varchar" }
    //        ]
    //    };
    //    gw_com_module.callProcedure(args);
    //}

    gw_com_api.messageBox(
        [{ text: response.VALUE[0] }], 420, gw_com_api.v_Message.msg_informBatched, "ALERT",
        { handler: successRun, response: response }
    );

}
//----------
function successRun(response) {

    processPop({ object: "lyrMenu_Main" });
    processRetrieve({ key: v_global.logic.key })

}
//----------
function processPop(ui) {

    v_global.event.object = "frmData_Main";
    v_global.event.row = 1
    v_global.logic.key = gw_com_api.getValue("frmData_Main", "selected", "dlv_no", false);
    var args;

    if (ui.object == "lyrMenu_Main") {
        if (v_global.logic.key == null || v_global.logic.key == "") {
            gw_com_api.messageBox([{ text: "선택된 대상이 없습니다." }], 300);
            return;
        }

        // 바코드 조회 창 열기
        args = {
            type: "PAGE", page: "SRM_4111", title: "바코드 조회",
            width: 850, height: 330, locate: ["center", "top"], open: true
        };

    } else {
        return;
    }

    if (gw_com_module.dialoguePrepare(args) == false) {
        args.param = {
            ID: gw_com_api.v_Stream.msg_selectPart_SCM,
            data: { dlv_no: v_global.logic.key }
        }
        gw_com_module.dialogueOpen(args);
    }

}
//---------- ItemChanged Event 처리
function processItemChanged(ui) {

    if (!checkEditable({})) return;

    var vl = ui.value.current;

    if (ui.element == "Remark") {   // 복수행 입력란의 개행문자 치환
        vl = vl.replace(/\r\n/g, "CRLF");
        gw_com_api.setValue("grdData_Sub", "selected", ui.element, vl, true);
    }

    if (ui.object == "frmOption2") {
        //일괄 적용
        for (var i = 1; i <= gw_com_api.getRowCount("grdData_Sub") ; i++) {
            gw_com_api.selectRow("grdData_Sub", i, true);
            gw_com_api.setValue("grdData_Sub", i, ui.element, ui.value.current, true, true, true);
        }
    }

}
//---------- Popup Find Window for select items
function popupFindItem(ui) {

    v_global.event.type = ui.type;
    v_global.event.object = ui.object;
    v_global.event.row = ui.row;
    v_global.event.element = ui.element;

    var pagePop = v_global.logic.Supp ? "w_find_srm_dlvitem" : "w_find_srm_dlvitem2";

    switch (ui.element) {
        case "추가": {
            if (gw_com_api.getRowCount("grdData_Sub") > 0)
                v_global.logic.pur_no = gw_com_api.getValue("grdData_Sub", "selected", "pur_no", true);
            else
                v_global.logic.pur_no = "";

            var args = {
                type: "PAGE", page: pagePop, title: "납품대상 품목 선택"
            			, width: 1100, height: 440, locate: ["center", "top"], open: true
            };

            chkRows = "";
            ids = gw_com_api.getRowIDs("grdData_Sub");
            $.each(ids, function () {
                chkRows += (chkRows == "" ? "" : ",");
                chkRows += gw_com_api.getCellValue("GRID", "grdData_Sub", this, "pur_no") + "-" + gw_com_api.getCellValue("GRID", "grdData_Sub", this, "pur_seq");
            });

            if (gw_com_module.dialoguePrepare(args) == false) { // POPUP 이 이미 열려 있을 때 : 초기값 전달
                // POPUP 창에 전달할 Data 변수값 설정

                var args = { //검색조건 초기값 전달 인자 설정
                    page: pagePop,
                    param: {
                        ID: gw_com_api.v_Stream.msg_selectPart_SCM
                      , data: {
                          supp_cd: v_global.logic.supp_cd
                      	  , pur_no: v_global.logic.pur_no
                          , except: chkRows
                      }
                    }
                };

                gw_com_module.dialogueOpen(args);
            }
        } break;
        case "user_nm":
        case "rqst_user_nm": {
            var args = {
                type: "PAGE", page: "DLG_EMPLOYEE", title: "사원 선택"
                , width: 700, height: 450, locate: ["center", "top"], open: true
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = {
                    page: "DLG_EMPLOYEE",
                    param: { ID: gw_com_api.v_Stream.msg_selectEmployee }
                };
                gw_com_module.dialogueOpen(args);
            }
        } break;
        case "supp_nm": {
            var args = { type: "PAGE", page: "w_find_supplier", title: "협력사 선택", width: 500, height: 450, open: true };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = {
                    page: "w_find_supplier",
                    param: { ID: gw_com_api.v_Stream.msg_selectedSupplier }
                };
                gw_com_module.dialogueOpen(args);
            }
        } break;
        default: return;
    }

}
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
            { type: "FORM", id: "frmData_Main" },
            { type: "GRID", id: "grdData_Sub" },
			{ type: "GRID", id: "grdData_File1" }
        ],
        param: param
    };

    if (param.target != undefined) {
        args.target = [param.target];
    }

    return gw_com_module.objUpdatable(args);

}
//----------
function processRetrieve(param) {

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_dlv_no", value: param.key }
            ]
        },
        target: [
			{ type: "FORM", id: "frmData_Main", select: true }
            , { type: "GRID", id: "grdData_Sub" }
        ],
        key: param.key, handler_complete: processRetrieveEnd
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {

    if (gw_com_api.getValue("frmData_Main", 1, "barcode_cnt") == "0") {
        gw_com_api.messageBox([{ text: "바코드를 생성하세요." }], 250);
    } else if (gw_com_api.getValue("frmData_Main", 1, "regen_yn") == "1") {
        gw_com_api.messageBox([{ text: "바코드를 다시 생성하세요." }], 300);
    }

}
//----------
function processInsert(ui) {

    if (ui.object == "lyrMenu_Sub") {
        if (!checkUpdatable({ check: true, target: { type: "GRID", id: "grdData_Sub" } })) {
            return;
        }

        popupFindItem(ui);
    }
    else {	// 요구서 추가
        var args = {
            targetid: "frmData_Main", edit: true, updatable: true,
            data: [
                { name: "dlv_date", value: gw_com_api.getDate("") },
                { name: "supp_cd", value: v_global.logic.supp_cd },
                { name: "supp_nm", value: v_global.logic.supp_nm },
                { name: "pstat", value: "작성중" },
                { name: "astat", value: "작성중" },
                { name: "astat_user", value: gw_com_module.v_Session.USR_ID }
            ],
            clear: [
                { type: "GRID", id: "grdData_Sub" }
            ]
        };
        gw_com_module.formInsert(args);

        // 납품목록 추가
        processInsert({ object: "lyrMenu_Sub", element: "추가" });
    }

}
//----------
function processDelete(ui) {

    if (ui.object == "lyrMenu_Sub") {
        var args = { targetid: "grdData_Sub", row: "selected", select: true }
        gw_com_module.gridDelete(args);
    }
    else if (ui.object == "lyrMenu_File1") {
        var args = { targetid: "grdData_File1", row: "selected", select: true }
        gw_com_module.gridDelete(args);
    }
    else if (ui.object == "lyrMenu_Main") {
        if (!checkManipulate({})) return;

        var status = checkCRUD({});
        if (status == "initialize" || status == "create") processClear({});
        else {
            v_global.process.handler = processRemove;
            gw_com_api.messageBox([{ text: "REMOVE" }], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO");
        }
    }
    else return;

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_Main" },
            { type: "GRID", id: "grdData_Sub" }
        ]
    };
    gw_com_module.objClear(args);

}
//---------- Save
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
            if (this.NAME == "dlv_no") {
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
            { type: "FORM", id: "frmData_Main", key: { element: [{ name: "dlv_no" }] } }
        ],
        handler: { success: successRemove, param: param }
    };
    gw_com_module.objRemove(args);

}
//---------- After Removing
function successRemove(response, param) {

    processClear(param);
    //
    var args = {
        ID: gw_com_api.v_Stream.msg_linkPage,
        to: { type: "MAIN" },
        data: {
            page: "SRM_4110", title: "납품서 현황",
            param: [
                { name: "opt_ymd_fr", value: v_global.logic.opt_ymd_fr },
                { name: "opt_ymd_to", value: v_global.logic.opt_ymd_to },
                { name: "opt_dlv_no", value: v_global.logic.opt_dlv_no },
                { name: "opt_supp_cd", value: v_global.logic.opt_supp_cd },
                { name: "opt_supp_nm", value: v_global.logic.opt_supp_nm },
                { name: "opt_pur_no", value: v_global.logic.opt_pur_no }
            ]
        }
    };
    gw_com_module.streamInterface(args);

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
                    if (param.data.result == "YES") {
                        if (param.data.arg.apply)
                            processRun({});
                    } else {
                        processPop({ object: "lyrMenu_main" });
                    }
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
            // 납품 목록 선택 추가
        case gw_com_api.v_Stream.msg_selectedPart_SCM: {
            // 공급사 체크
            if (!v_global.logic.Supp) {
                if (gw_com_api.getValue("frmData_Main", 1, "supp_cd") == "") {
                    gw_com_api.setValue("frmData_Main", 1, "supp_cd", param.data.supp_cd);
                    gw_com_api.setValue("frmData_Main", 1, "supp_nm", param.data.supp_nm);
                } else if (gw_com_api.getValue("frmData_Main", 1, "supp_cd") != param.data.supp_cd) {
                    gw_com_api.messageBox([{ text: "공급사를 잘못 선택했습니다." }], 300);
                    closeDialogue({ page: param.from.page, focus: true });
                    return;
                }
            }

            var args = { targetid: "grdData_Sub", edit: true, updatable: true };
            var sDlvNo = gw_com_api.getValue("frmData_Main", 1, "dlv_no");
            var nRow = gw_com_api.getRowCount("grdData_Sub");
            //$.each(param.data.rows, function () {
            //    args.data = [
            //            { name: "dlv_no", value: sDlvNo },
            //            { name: "dlv_seq", value: ++nRow },
            //            { name: "pur_no", value: this.pur_no },
            //            { name: "pur_seq", value: this.pur_seq },
            //            { name: "item_cd", value: this.item_cd },
            //            { name: "item_nm", value: this.item_nm },
            //            { name: "item_spec", value: this.item_spec },
            //            { name: "track_no", value: this.track_no },
            //            { name: "pallet_no", value: this.pallet_no },
            //            { name: "req_date", value: this.req_date },
            //            { name: "pur_qty", value: this.pur_qty },
            //            { name: "pur_unit", value: this.pur_unit },
            //            { name: "dlv_qty", value: this.dlv_qty }
            //    ];
            //    nRow = gw_com_module.gridInsert(args);
            //});
            //gw_com_api.selectRow("grdData_Sub", nRow);

            // 속도개선 : 20131002 by KWY==============================
            gw_com_api.block();
            for (var i = 0 ; i < param.data.rows.length; i++) {
                param.data.rows[i].dlv_no = sDlvNo;
                param.data.rows[i].dlv_seq = ++nRow;
            }
            args.data = param.data.rows;
            gw_com_module.gridInserts(args)
            gw_com_api.unblock();
            //=========================================================
            closeDialogue({ page: param.from.page, focus: true });
        } break;
        // When Opened Dialogue Winddows
        case gw_com_api.v_Stream.msg_openedDialogue: {
            var args = { to: { type: "POPUP", page: param.from.page } };

            switch (param.from.page) {
                case "w_find_srm_dlvitem":
                case "w_find_srm_dlvitem2": {
                    args.ID = gw_com_api.v_Stream.msg_selectPart_SCM;
                    args.data = {
                        supp_cd: v_global.logic.supp_cd
                  	  , pur_no: v_global.logic.pur_no
                      , except: chkRows
                    };
                } break;
                case "SRM_4111": {
                    args.ID = gw_com_api.v_Stream.msg_selectPart_SCM;
                    args.data = {
                        dlv_no: v_global.logic.key,
                        voc_no: v_global.logic.key
                    }
                } break;
            }
            gw_com_module.streamInterface(args);
        } break;
        case gw_com_api.v_Stream.msg_closeDialogue: {
            closeDialogue({ page: param.from.page });
        } break;
    }

}