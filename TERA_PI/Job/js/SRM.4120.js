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

        // prepare dialogue.
        var args = {
            type: "PAGE", page: "SRM_4121", title: "선입고 정보",
            width: 400, height: 300, locate: ["center", "center"]
        };
        gw_com_module.dialoguePrepare(args);

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

        //=====================================================================================
        var args = {
            targetid: "lyrMenu_Main", type: "FREE",
            element: [
				//{ name: "생성", value: "바코드", icon: "실행" },
				{ name: "저장", value: "저장" },
				{ name: "삭제", value: "삭제" },
				{ name: "닫기", value: "닫기" }
            ]
        };
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_Sub", type: "FREE",
            element: [
				{ name: "추가", value: "추가" },
				{ name: "삭제", value: "삭제" }
            ]
        };
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_File1", type: "FREE", hidden: true,
            element: [
				{ name: "추가", value: "추가" },
				{ name: "삭제", value: "삭제" }
            ]
        };
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption2", query: "", type: "TABLE", title: "",
            caption: false, show: false, selectable: true,
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
        //=====================================================================================
        var args = {
            targetid: "frmData_Main", query: "SRM_4120_M_1", type: "TABLE", title: "납품 정보",
            caption: false, show: true, selectable: true,
            editable: { bind: "select", focus: "str_time", validate: true },
            content: {
                width: { label: 120, field: 150 }, height: 25,
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
                          { name: "chk_user_nm" },
                          { header: true, value: "검수일자", format: { type: "label" } },
                          { name: "chk_date", mask: "date-ymd" }
                        ]
                    },
                    {
                        element: [
                          { header: true, value: "납품(예정)일자/시간", format: { type: "label" } },
                          {
                              name: "dlv_date", style: { colfloat: "float" }, mask: "date-ymd",
                              format: { type: "text", width: 60 },
                              editable: { type: "text", validate: { rule: "required" }, width: 100 }
                          },
                          {
                              name: "dlv_time", style: { colfloat: "floated" }, mask: "time-hm",
                              format: { type: "text", width: 36 },
                              editable: { type: "text", validate: { rule: "required" }, width: 36 }
                          },
                          { header: true, value: "납품담당자", format: { type: "label" } },
                          { name: "dlv_user", editable: { type: "text", validate: { rule: "required" } } },
                          { header: true, value: "검수예정(희망)일", format: { type: "label" } },
                          {
                              name: "qc_date", mask: "date-ymd",
                              editable: { type: "text", validate: { rule: "required" } }
                          },
                          { header: true, value: "등록일시", format: { type: "label" } },
                          { name: "ins_dt" }
                        ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_Sub", query: "SRM_4120_S_1", title: "납품 목록",
            caption: true, height: "100%", pager: false, show: true, selectable: true, number: true,
            editable: { master: true, bind: "_edit_yn", focus: "dlv_qty", validate: true },
            element: [
                {
                    header: "발주번호", name: "pur_no", width: 70, align: "center",
                    editable: { type: "hidden" }
                },
				{
				    header: "품번", name: "item_cd", width: 80, align: "center",
				    editable: { type: "hidden" }
				},
				{ header: "품명", name: "item_nm", width: 120, align: "left" },
				{ header: "규격", name: "item_spec", width: 120, align: "left" },
				{ header: "Project Name", name: "proj_nm", width: 130 },
				{
				    header: "Project No.", name: "track_no", width: 80, align: "center",
				    editable: { type: "hidden" }
				},
				{
				    header: "Pallet No.", name: "pallet_no", width: 80, align: "center",
				    editable: { type: "hidden" }, hidden: true
				},
				{ header: "납기요구일", name: "req_date", width: 70, align: "center", mask: "date-ymd" },
				{ header: "발주수량", name: "pur_qty", width: 50, align: "right" },
				{ header: "단위", name: "pur_unit", width: 40, align: "center" },
				{
				    header: "납품수량", name: "dlv_qty", width: 50, align: "right",
				    editable: { type: "text", validate: { rule: "required" } }
				},
				{
				    header: "라벨", name: "label_tp", width: 50, align: "center", hidden: true,
				    format: { type: "select", data: { memory: "라벨유형" } },
				    editable: { type: "select", validate: { rule: "required" }, data: { memory: "라벨유형" } }
				},
				{
				    header: "방문검수", name: "visit_qa", width: 40, align: "center",
				    format: { type: "checkbox", value: 1, offval: 0 },
				    editable: { type: "checkbox", value: 1, offval: 0 }
				},
				{
				    header: "선입고", name: "direct_yn", width: 40, align: "center",
				    format: { type: "checkbox", value: 1, offval: 0 },
				    editable: { type: "checkbox", value: 1, offval: 0 }
				},
                {
                    header: "선입고일", name: "dir_date", width: 70, align: "center", mask: "date-ymd",
                    editable: { type: "hidden" }
                },
                {
                    header: "선입고장소", name: "dir_place", width: 150,
                    editable: { type: "hidden", width: 300 }
                },
                {
                    header: "비고", name: "dlv_rmk", width: 150,
                    editable: { type: "text", width: 162 }
                },
                { name: "dlv_no", hidden: true, editable: { type: "hidden" } },
                { name: "dlv_seq", hidden: true, editable: { type: "hidden" } },
                { name: "pur_seq", hidden: true, editable: { type: "hidden" } },
                { name: "astat", hidden: true },
                { name: "_edit_yn", hidden: true }
            ]
        };
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_File1", query: "SRM_4110_S_2", title: "거래명세서",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            editable: { master: true, bind: "select", focus: "file_desc", validate: true },
            element: [
				{ header: "파일명", name: "file_nm", width: 250, align: "left" },
				{
				    header: "다운로드", name: "download", width: 60, align: "center",
				    format: { type: "link", value: "다운로드" }
				},
				{
				    header: "파일설명", name: "file_desc", width: 380, align: "left",
				    editable: { type: "text", width: 552 }
				},
				{ header: "등록자", name: "upd_usr_nm", width: 60, align: "center" },
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
        //----------
        gw_com_module.pageCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "FORM", id: "frmData_Main", offset: 8 },
                { type: "GRID", id: "grdData_Sub", offset: 8 },
                { type: "GRID", id: "grdData_File1", offset: 8 }
            ]
        };
        gw_com_module.objResize(args);
        //=====================================================================================
        gw_com_module.informSize();
        //=====================================================================================
        var args = {
            targetid: "frmOption2", edit: true,
            data: [
                { name: "direct_yn", value: 0 }
            ]
        };
        gw_com_module.formInsert(args);
        //=====================================================================================
    },

    //==== manage process. (program section)
    procedure: function () {

        //=====================================================================================
        var args = { targetid: "lyrMenu_Main", element: "생성", event: "click", handler: checkAppliable };
        gw_com_module.eventBind(args);
        //----------
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
        //=====================================================================================
        var args = { targetid: "lyrMenu_Sub", element: "추가", event: "click", handler: click_lyrMenu_Sub_추가 };
        gw_com_module.eventBind(args);
        function click_lyrMenu_Sub_추가(ui) { processInsert(ui); }
        //----------
        var args = { targetid: "lyrMenu_Sub", element: "삭제", event: "click", handler: click_lyrMenu_Sub_삭제 };
        gw_com_module.eventBind(args);
        function click_lyrMenu_Sub_삭제(ui) { processDelete(ui); }
        //=====================================================================================
        var args = { targetid: "lyrMenu_File1", element: "추가", event: "click", handler: processInsert };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_File1", element: "삭제", event: "click", handler: processDelete };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption2", grid: false, event: "itemchanged", handler: processItemChanged };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_Sub", grid: true, event: "itemchanged", handler: processItemChanged };
        gw_com_module.eventBind(args);
        //----------
        //var args = { targetid: "grdData_Sub", grid: true, event: "itemdblclick", handler: processItemdblclick };
        //gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_File1", grid: true, element: "download", event: "click", handler: processFile };
        gw_com_module.eventBind(args);
        //=====================================================================================


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
            { name: "DlvNo", value: v_global.logic.key, type: "varchar" },
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

    //gw_com_api.messageBox([
    //    { text: response.VALUE[0] }
    //], 420, gw_com_api.v_Message.msg_informBatched, "ALERT",
    //{ handler: successRun, response: response });

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
    } else if (ui.object == "grdData_Sub") {
        if (ui.element == "dlv_qty") {
            var pur_qty = gw_com_api.getValue(ui.object, ui.row, "pur_qty", true);
            if (Number(pur_qty) < Number(ui.value.current)) {
                gw_com_api.messageBox([{ text: "납품수량이 잘못 입력되었습니다." }]);
                gw_com_api.setValue(ui.object, ui.row, ui.element, (pur_qty < ui.value.prev ? pur_qty : ui.value.prev), true);
            } else if (ui.value.current == 0) {
                gw_com_api.messageBox([{ text: "납품수량이 잘못 입력되었습니다." }]);
            }
        } else if (ui.element == "direct_yn") {
            //if (ui.value.current == "1") {
                var param = {
                    object: ui.object,
                    row: ui.row,
                    element: "dir_date",
                    type: ui.type
                };
                processItemdblclick(param);
            //} else {
            //    gw_com_api.setValue(ui.object, ui.row, "dir_date", "", ui.type == "GRID" ? true : false);
            //    gw_com_api.setValue(ui.object, ui.row, "dir_place", "", ui.type == "GRID" ? true : false);
            //}
        }
    }

}
//----------
function processItemdblclick(param) {

    if (param.object == "grdData_Sub") {
        if (param.element == "dir_date" || param.element == "dir_place") {
            v_global.event.object = param.object;
            v_global.event.row = param.row;
            v_global.event.element = param.element;
            v_global.event.type = param.type;
            v_global.event.data = {
                dir_date: gw_com_api.getValue(v_global.event.object, v_global.event.row, "dir_date", v_global.event.type == "GRID" ? true : false),
                dir_place: gw_com_api.getValue(v_global.event.object, v_global.event.row, "dir_place", v_global.event.type == "GRID" ? true : false)
            }
            var args = {
                page: "SRM_4121",
                param: {
                    ID: gw_com_api.v_Stream.msg_openedDialogue,
                    data: v_global.event.data
                }
            };
            gw_com_module.dialogueOpen(args);
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
            			, width: 960, height: 440, locate: ["center", "top"], open: true
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
			{ type: "FORM", id: "frmData_Main", select: true },
            { type: "GRID", id: "grdData_Sub", select: true },
            { type: "GRID", id: "grdData_File1", select: true }
        ],
        key: param.key, handler_complete: processRetrieveEnd
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {

    //if (gw_com_api.getValue("frmData_Main", 1, "barcode_cnt") == "0") {
    //    gw_com_api.messageBox([{ text: "바코드를 생성하세요." }], 250);
    //} else if (gw_com_api.getValue("frmData_Main", 1, "regen_yn") == "1") {
    //    gw_com_api.messageBox([{ text: "바코드를 다시 생성하세요." }], 300);
    //}

}
//----------
function processInsert(ui) {

    if (ui.object == "lyrMenu_Sub") {
        if (!checkManipulate({})) return;
        if (!checkUpdatable({ check: true })) return false;
        popupFindItem(ui);
    } else if (ui.object == "lyrMenu_File1") {
        processUpload({});
    }
    else {	// 요구서 추가
        var args = {
            targetid: "frmData_Main", edit: true, updatable: true,
            data: [
                { name: "dlv_date", value: gw_com_api.getDate("") },
                { name: "qc_date", value: gw_com_api.getDate("") },
                { name: "supp_cd", value: v_global.logic.supp_cd },
                { name: "supp_nm", value: v_global.logic.supp_nm },
                { name: "pstat", value: "작성중" },
                { name: "astat", value: "작성중" },
                { name: "astat_user", value: gw_com_module.v_Session.USR_ID }
            ],
            clear: [
                { type: "GRID", id: "grdData_Sub" },
                { type: "GRID", id: "grdData_File1" }
            ]
        };
        gw_com_module.formInsert(args);

        // 납품목록 추가
        //processInsert({ object: "lyrMenu_Sub", element: "추가" });
        popupFindItem({ object: "lyrMenu_Sub", element: "추가" });
    }

}
//----------
function processDelete(ui) {

    if (ui.object == "lyrMenu_Sub") {
        // 납품서 출력 후 삭제 불가
        if (gw_com_api.getValue("grdData_Sub", "selected", "astat", true) != "") {
            gw_com_api.messageBox([{ text: "입고증이 출력된 납품서는 품목을 삭제할 수 없습니다." }]);
            return;
        }

        var args = { targetid: "grdData_Sub", row: "selected" }
        gw_com_module.gridDelete(args);
    }
    else if (ui.object == "lyrMenu_File1") {
        var args = { targetid: "grdData_File1", row: "selected" }
        gw_com_module.gridDelete(args);
    }
    else if (ui.object == "lyrMenu_Main") {
        if (!checkManipulate({})) return;

        var status = checkCRUD({});
        if (status == "initialize" || status == "create") processClear({});
        else {
            if (Query.checkUpdable() == "0") return;
            v_global.process.handler = processRemove;
            gw_com_api.messageBox([{ text: "REMOVE" }], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO");
        }
    } else if (ui.object == "lyrMenu_File1") {
        var args = { targetid: "grdData_File1", row: "selected", select: true }
        gw_com_module.gridDelete(args);
    }
    else return;

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_Main" },
            { type: "GRID", id: "grdData_Sub" },
            { type: "GRID", id: "grdData_File1" }
        ]
    };
    gw_com_module.objClear(args);

}
//---------- Save
function processSave(param) {

    var args = {
        target: [
			{ type: "FORM", id: "frmData_Main" },
            { type: "GRID", id: "grdData_Sub" },
            { type: "GRID", id: "grdData_File1" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;
    if (Query.checkUpdable() == "0") return;
    //// 품목 수 제한 (임시)
    //if (gw_com_api.getRowCount("grdData_Sub") > 15) {
    //    gw_com_api.messageBox([{ text: "품목 수를 15개 이하로 등록하세요." }]);
    //    return false;
    //}

    // 시간 형식 체크
    var dlv_time = gw_com_api.getValue("frmData_Main", 1, "dlv_time");
    if (dlv_time.length != 4 || dlv_time >= "2400") {
        gw_com_api.messageBox([{ text: "시간 형식을 확인하세요.(00:00 ~ 23:59)" }]);
        gw_com_api.setError(true, "frmData_Main", 1, "dlv_time", false);
        return false;
    }

    // 납품수량 0 체크
    var row = gw_com_api.getFindRow("grdData_Sub", "dlv_qty", 0);
    if (row > 0) {
        gw_com_api.messageBox([{ text: "납품 수량을 확인하세요." }]);
        //gw_com_api.setError(true, "grdData_Sub", row, "dlv_qty", true);
        gw_com_api.selectRow("grdData_Sub", row, true);
        return false;
    }

    args.handler = { success: successSave };
    gw_com_module.objSave(args);

}
//---------- After Saving
function successSave(response, param) {

    var barcode = false;
    $.each(response, function () {
        if (this.QUERY == "SRM_4120_S_1") barcode = true;
        $.each(this.KEY, function () {
            if (this.NAME == "dlv_no") {
                v_global.logic.key = this.VALUE;
            }
        });
    });
    processRetrieve({ key: v_global.logic.key });
    if (barcode) {
        processRun({});
        processSendMail({});
    }

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
//----------
function processUpload(param) {

    // Check
    if (!checkManipulate({})) return;
    if (!checkUpdatable({ check: true })) return false;
    var dlv_no = gw_com_api.getValue("grdData_Sub", "selected", "dlv_no", true);
    if (dlv_no == "") {
        gw_com_api.messageBox([{ text: "NOMASTER" }]);
        return;
    }

    // Parameter 설정
    v_global.logic.FileUp = {
        type: "SRM-DLV",
        key: dlv_no,
        seq: gw_com_api.getValue("grdData_Sub", "selected", "dlv_seq", true),
        user: gw_com_module.v_Session.USR_ID,
        crud: "C", rev: 0, revise: false
    };

    var args = {
        type: "PAGE", page: "DLG_FileUpload", title: "파일 업로드", datatype: "SRM-DLV",
        width: 650, height: 260, open: true, locate: ["center", "bottom"]
    }; //

    if (gw_com_module.dialoguePrepare(args) == false) {
        var args = {
            page: "DLG_FileUpload",
            param: { ID: gw_com_api.v_Stream.msg_upload_ASFOLDER, data: v_global.logic.FileUp }
        };
        gw_com_module.dialogueOpen(args);
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
function processSendMail(param) {

    //품질팀 알림 메일
    var args = {
        url: "COM",
        procedure: "PROC_MAIL_QDM_QC",
        nomessage: true,
        input: [
            { name: "key", value: v_global.logic.key, type: "varchar" },
            { name: "type", value: "DLV", type: "varchar" }
        ],
        handler: {
            success: completeSendMail,
            param: param
        }
    };
    gw_com_module.callProcedure(args);

}
//----------
function completeSendMail(response, param) {

}
//----------
var Query = {
    checkUpdable: function (param) {
        var rtn = "";
        var args = {
            request: "PAGE",
            url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
                    "?QRY_ID=SRM_4120_X" +
                    "&QRY_COLS=_editable" +
                    "&CRUD=R" +
                    "&arg_dlv_no=" + v_global.logic.key,
            handler_success: successRequest
        };
        //=================== async : false ========================
        $.ajaxSetup({ async: false });
        //----------
        gw_com_module.callRequest(args);
        function successRequest(data) {
            rtn = data[0].DATA[0];
            if (rtn == "0") {
                gw_com_api.messageBox([{ text: "가입고된 내역은 수정할 수 없습니다." }]);
            }
        }
        //----------
        $.ajaxSetup({ async: true });
        //=================== async : true ========================
        return rtn
    }
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
                param.data.rows[i].label_tp = "2";  //통합
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
                case "DLG_FileUpload": {
                    args.ID = gw_com_api.v_Stream.msg_upload_ASFOLDER;
                    args.data = v_global.logic.FileUp;
                } break;
            }
            gw_com_module.streamInterface(args);
        } break;
        case gw_com_api.v_Stream.msg_closeDialogue: {
            switch (param.from.page) {
                case "SRM_4121":
                    if (param.data == undefined) {
                        gw_com_api.setValue(v_global.event.object, v_global.event.row, "direct_yn", "0", v_global.event.type == "GRID" ? true : false);
                        gw_com_api.setValue(v_global.event.object, v_global.event.row, "dir_date", "", v_global.event.type == "GRID" ? true : false, true);
                        gw_com_api.setValue(v_global.event.object, v_global.event.row, "dir_place", "", v_global.event.type == "GRID" ? true : false, true);
                    } else {
                        gw_com_api.setValue(v_global.event.object, v_global.event.row, "direct_yn", "1", v_global.event.type == "GRID" ? true : false);
                        gw_com_api.setValue(v_global.event.object, v_global.event.row, "dir_date", param.data.dir_date, v_global.event.type == "GRID" ? true : false, true);
                        gw_com_api.setValue(v_global.event.object, v_global.event.row, "dir_place", param.data.dir_place, v_global.event.type == "GRID" ? true : false, true);
                    }
                    break;
            }
            closeDialogue({ page: param.from.page });
        } break;
        case gw_com_api.v_Stream.msg_uploaded_ASFOLDER: {
            closeDialogue({ page: param.from.page });
            var args = {
                source: {
                    type: "INLINE",
                    argument: [
                        { name: "arg_dlv_no", value: v_global.logic.key }
                    ]
                },
                target: [
                    { type: "GRID", id: "grdData_File1", select: true }
                ],
                key: param.key
            };
            gw_com_module.objRetrieve(args);
        } break;
    }

}