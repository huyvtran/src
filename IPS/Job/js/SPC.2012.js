
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define Global variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, init: false, entry: null, act: null, handler: null, current: {}, prev: {} },
    data: null, logic: {}
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define gw_job_process class : ready(), UI(), procedure()
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var gw_job_process = {

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // entry point. (pre-process section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ready: function () {

        // initialize page.
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        var args = {
            request: [
				{ type: "PAGE", name: "검사항목", query: "DDDW_CM_CODE",
				    param: [{ argument: "arg_hcode", value: "SPC010"}] },
				{ type: "PAGE", name: "품목분류", query: "DDDW_CM_CODE",
				    param: [{ argument: "arg_hcode", value: "SPC020"}] },
				{ type: "PAGE", name: "협력사", query: "DDDW_SPC_SUPP_ALL" },
                { type: "INLINE", name: "보기",
                    data: [
						{ title: "축약", value: "S" },
						{ title: "확장", value: "L" }
					]
                }
			],
            starter: start
        };
        gw_com_module.selectSet(args);

        //start();  //gw_com_module.selectSet(args) 을 사용하지 않을 시에 활성화
        function start() { gw_job_process.UI(); }

    },  // End of gw_job_process.ready

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage UI. (design section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    UI: function () {

        //==== Menu : Main ====
        var args = { targetid: "lyrMenu_1", type: "FREE",
            element: [
				{ name: "업로드", value: "업로드", icon: "실행", act: true },
				{ name: "닫기", value: "닫기" }
			]
        };
        gw_com_module.buttonMenu(args);

        //==== Menu : Main ====
        var args = { targetid: "lyrMenu_2", type: "FREE",
            element: [
				{ name: "조회", value: "시트 읽기", icon: "조회" },
				{ name: "삭제", value: "취소", icon: "삭제" },
				{ name: "저장", value: "저장" }
			]
        };
        gw_com_module.buttonMenu(args);

        //==== Option : Form Main ====
/*        
        var args = { targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, show: true, border: true, margin: 150, remark: "lyrRemark", number: true,
            editable: { focus: "ymd_fr", validate: true },
            content: {
                row: [
                    { 
                      element: [
				        { style: { colfloat: "floating" }, mask: "date-ymd",
				          name: "ymd_fr", label: { title: "검사일자 :" },
				          editable: { type: "text", size: 7, maxlength: 10 }
				        },
				        { style: { colfloat: "floating" }, mask: "date-ymd",
				          name: "ymd_to", label: { title: "~" },
				          editable: { type: "text", size: 7, maxlength: 10 }
				        },
                        { name: "supp_cd", label: { title: "협력사 :" }, //hidden: true, 
                            editable: { type: "select", size: 7, maxlength: 20, data: { memory: "협력사"} }
                        }
				      ] 
				    },
                    { align: "right",
                      element: [
				            { name: "실행", value: "실행", act: true, format: { type: "button"} },
				            { name: "취소", value: "취소", act: true, format: { type: "button", icon: "닫기"} }
				      ]
                    }
			    ]
            }
        };
        gw_com_module.formCreate(args);
*/
        //==== Grid : Main ====
        var args = { targetid: "frmData_정보", query: "SPC_2012_M_1", type: "TABLE", title: "품목정보",
            caption: true, show: false, selectable: true,
            editable: { bind: "select", focus: "qc_date", validate: true },
            content: { width: { label: 80, field: 170 }, height: 25,
                row: [
                    { element: [
                            { header: true, value: "Part No.", format: { type: "label"} },
                            { name: "part_cd", editable: { type: "text"} },
                            { header: true, value: "Part Name", format: { type: "label"} },
                            { name: "part_nm", editable: { type: "text"} },
                            { header: true, value: "Model", format: { type: "label"} },
                            { name: "model_nm", editable: { type: "text"} },
                            { header: true, value: "Project No", format: { type: "label"} },
                            { name: "proj_no", editable: { type: "text"} }
                        ]
                    },
                    { element: [
                            { header: true, value: "업체코드", format: { type: "label"} },
                            { name: "supp_cd", editable: { type: "text"} },
                            { header: true, value: "업체명", format: { type: "label"} },
                            { name: "supp_nm", editable: { type: "text"} },
                            { header: true, value: "검사일자", format: { type: "label"} },
                            { name: "qc_date", mask: "date-ymd", align: "center",
                            	editable: { type: "text", validate: { rule: "required" }} },
                            { header: true, value: "측 정 자", format: { type: "label"} },
                            { name: "qc_charge", editable: { type: "text"} },
                            { name: "rmk", hidden: true }
                        ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);
        
        //==== Grid : Sub1 ====
        var args = { targetid: "grdData_엑셀", query: "SPC_2012_S_1", title: "엑셀파일 검사결과",
            caption: true, height: 400, show: true, selectable: true, color: { row: true },
            element: [
                { header: "Row", name: "seq", width: 34, align: "center" },
                { header: "검증", name: "pstat", width: 34, align: "center" },
                { header: "검사일자", name: "str01", width: 80, align: "center" },
                { header: "측정자", name: "str02", width: 60, align: "center" },
                { header: "품목코드", name: "str03", width: 80, align: "center" },
                { header: "Project No.", name: "str04", width: 80, align: "center" },
                { header: "Ser. No.", name: "str05", width: 100, align: "center" },
                { header: "항목코드", name: "str06", width: 60, align: "center" },
                { header: "검사항목명", name: "str07", width: 120, align: "left" },
                { header: "측정조건", name: "str08", width: 100, align: "center" },
                { header: "측정값", name: "str09", width: 80, align: "center" },
                { header: "측정 비고", name: "str10", width: 200, align: "center" },
                { header: "자료 검증 결과", name: "rmk", width: 200, align: "left" },
				{ name: "ins_usr", hidden: true },
				{ name: "file_id", hidden: true },
				{ name: "sheet_nm", hidden: true },
				{ name: "color", hidden: true }
			]
        };
        gw_com_module.gridCreate(args);

        //==== Grid : Sub2 ====
        var args = { targetid: "grdData_적용", query: "SPC_2012_S_2", title: "검사결과 등록내역",
            caption: true, height: 400, show: true, selectable: true,
            element: [
                { header: "등록번호", name: "qc_seq", width: 100, align: "center" },
                { header: "검사일자", name: "qc_date", width: 80, align: "center" },
                { header: "Project", name: "proj_no", width: 80, align: "center" },
                { header: "품목코드", name: "part_no", width: 80, align: "center" },
                { header: "품목명칭", name: "part_nm", width: 150, align: "center" },
                { header: "Ser. No.", name: "ser_no", width: 100, align: "center" },
                { header: "항목코드", name: "qcitem_cd", width: 60, align: "center" },
                { header: "검사항목", name: "qcitem_nm", width: 150, align: "center" },
                { header: "순번", name: "sub_seq", width: 40, align: "center" },
                { header: "측정값", name: "qc_value", width: 80, align: "center" },
                { header: "측정비고", name: "qc_rmk", width: 150, align: "center" }
			]
        };
        gw_com_module.gridCreate(args);
        
        var args = { targetid: "lyrRemark", row: [ { name: "작업" } ] };
        gw_com_module.labelCreate(args);

        var args = { tabid: "lyrTab",
            target: [
                { type: "GRID", id: "grdData_엑셀", title: "엑셀 내역" },
                { type: "GRID", id: "grdData_적용", title: "적용 내역" }
			]
        };
        //----------
        gw_com_module.convertTab(args);
        //=====================================================================================
        var args = {
            target: [
				{ type: "FORM", id: "frmData_정보", offset: 8 },
                { type: "GRID", id: "grdData_적용", offset: 8 },
                { type: "GRID", id: "grdData_엑셀", offset: 8 },
				{ type: "TAB", id: "lyrTab", offset: 8 }
			]
        };
        //----------
        gw_com_module.objResize(args);

        gw_job_process.procedure();

    },
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage process. (program section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    procedure: function () {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // define event.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //==== Button Click : Main ====
        var args = { targetid: "lyrMenu_1", element: "업로드",
            event: "click", handler: click_lyrMenu_1_업로드
        };
        gw_com_module.eventBind(args);
        
        function click_lyrMenu_1_업로드(ui) {
            var args = { targetid: "lyrServer", control: { by: "DX", id: ctlUpload } };
            gw_com_module.uploadFile(args);
        }
        
        //----------
        var args = { targetid: "lyrMenu_1", element: "닫기",
            event: "click", handler: click_lyrMenu_1_닫기
        };
        gw_com_module.eventBind(args);
        
        function click_lyrMenu_1_닫기(ui) { processClose({}); }

        //==== Button Click : 시트 읽기 ====
        var args = { targetid: "lyrMenu_2", element: "조회", event: "click", handler: click_lyrMenu_2_조회 };
        gw_com_module.eventBind(args);

        function click_lyrMenu_2_조회(ui) {
            var args = { target: [ { id: "frmOption", focus: true } ] };
            gw_com_module.objToggle(args);
        }

        //==== Button Click : 시트 읽기 및 취소 ====
        var args = { targetid: "lyrMenu_2", element: "삭제", event: "click", handler: click_lyrMenu_2_취소 };
        gw_com_module.eventBind(args);

        function click_lyrMenu_2_취소(ui) {
            closeOption({});
            processCancel({});
        }

        //==== Button Click : 시트 읽기 저장 ====
        var args = { targetid: "lyrMenu_2", element: "저장", event: "click", handler: click_lyrMenu_2_저장 };
        gw_com_module.eventBind(args);

        function click_lyrMenu_2_저장(ui) {
            closeOption({});
            processSave({});
        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//        gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -6 }));
//        gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate(""));
//        gw_com_api.setValue("frmOption", 1, "supp_cd", gw_com_module.v_Session.EMP_NO );

        gw_com_module.startPage();

        var args = { ID: gw_com_api.v_Stream.msg_openedDialogue };
        gw_com_module.streamInterface(args);

    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
function processOption(param) {

    gw_com_api.show("frmOption");

    //----------
    var args = { targetid: "frmOption", type: "FREE", title: "조회 조건",
        trans: true, border: true, margin: 82, show: true,
        editable: { focus: "sheet", validate: true },
        content: { row: [
                { 
                	element: [
				        { name: "sheet_nm", label: { title: "시트명 :" },
				            editable: { type: "select", data: { memory: "SHEET" } } },
                        { name: "supp_cd", label: { title: "협력사 :" }, //hidden: true, 	//SuppOnly
                            editable: { type: "select", size: 7, maxlength: 20, data: { memory: "협력사"} }
                        }
				    ]
                },
                { align: "right",
                    element: [
				        { name: "실행", value: "실행", act: true, format: { type: "button" } },
				        { name: "취소", value: "취소", format: { type: "button", icon: "닫기" } }
				    ]
                }
			]
        }
    };
    gw_com_module.formCreate(args);
    gw_com_api.setValue("frmOption", 1, "supp_cd", gw_com_module.v_Session.EMP_NO );
    //----------
    var args = { targetid: "frmOption", element: "실행", event: "click", handler: click_frmOption_실행 };
    gw_com_module.eventBind(args);
    //----------
    var args = { targetid: "frmOption", element: "취소", event: "click", handler: click_frmOption_취소 };
    gw_com_module.eventBind(args);

}

//---------
function click_frmOption_실행(ui) {
    v_global.process.handler = processImport;
    //if (!checkUpdatable({})) return false;
    processImport({});
}
//----------
function click_frmOption_취소(ui) {
    closeOption({});
}

//----------
function processRetrieve(param) {

    closeOption({});
    var args = {
        source: { type: "INLINE",
            argument: [ 
                { name: "arg_file_id", value: v_global.logic.id },
                { name: "arg_sheet_nm", value: gw_com_api.getValue("frmOption", 1, "sheet_nm") }
			]
        },
        target: [
//			{ type: "FORM", id: "frmData_정보", edit: param.edit, updatable: true },
			{ type: "GRID", id: "grdData_적용", select: true },
			{ type: "GRID", id: "grdData_엑셀", select: true }
		],
//        clear: [
//			{ type: "GRID", id: "grdData_중분류" },
//			{ type: "GRID", id: "grdData_소분류" }
//		],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processImport(param) {

    var args = { user: gw_com_api.getValue("frmOption", 1, "supp_cd"),	//gw_com_module.v_Session.USR_ID,
        key: v_global.logic.id, path: v_global.logic.path,
        sheet: gw_com_api.getValue("frmOption", 1, "sheet_nm"),
        row: 1, column: 1, fields: 10,
        handler: { success: successImport }
    };
    gw_com_module.objImport(args);
}
//----------
function successImport(response) { processRetrieve({ edit: true }); }
//----------
function processSave(param) {

//    if (gw_com_api.getValue("frmOption", 1, "rpt_id") == "") {
//        gw_com_api.messageBox([
//            { text: "메일 수신자가 지정되지 않았습니다." }
//        ]);
//        return false;
//    }
    
    gw_com_api.messageBox([
        { text: "엑셀 데이터를 검사결과로 등록합니다." + "<br>" },
        { text: "계속 하시겠습니까?" }
    ], 420, gw_com_api.v_Message.msg_confirmBatch, "YESNO", { plan: true });

}
//----------
function processCancel(param) {

    gw_com_api.messageBox([
        { text: "엑셀 업로드 데이터를 삭제하고 검사결과 등록을 취소합니다." + "<br>" },
        { text: "계속 하시겠습니까?" }
    ], 420, gw_com_api.v_Message.msg_confirmBatch, "YESNO", { plan: false });

}
//----------
function processApply(param) {

    var args = {
        url: "COM",
        procedure: "PROC_SPC_QCRESULT_EXCEL",
        nomessage: true,
        input: [
            { name: "file_id", value: gw_com_api.getValue("grdData_엑셀", "selected", "file_id", true) },
            { name: "sheet_nm", value: gw_com_api.getValue("grdData_엑셀", "selected", "sheet_nm", true) },
            { name: "user", value: gw_com_module.v_Session.USR_ID, type: "varchar" },
            { name: "proctype", value: param.plan ? "C" : "D", type: "varchar" }
        ],
        output: [
            { name: "r_value", type: "int" },
            { name: "message", type: "varchar" }
        ],
        message: "",
        handler: { success: completeApply }
    };
    gw_com_module.callProcedure(args);
}
//----------
function processClear(param) {

    var args = {
        target: [
//			{ type: "FORM", id: "frmData_정보" },
            { type: "GRID", id: "grdData_적용" },
            { type: "GRID", id: "grdData_엑셀" }
		]
    };
    gw_com_module.objClear(args);

}
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closePage
    };
    gw_com_module.streamInterface(args);

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

}
//----------
function closeDialogue(param) {

    var args = {
        page: param.page
    };
    gw_com_module.dialogueClose(args);
    if (param.focus) {
        gw_com_api.setFocus(v_global.event.object,
	                        v_global.event.row,
	                        v_global.event.element,
	                        (v_global.event.type == "GRID") ? true : false);
    }

}
//----------
function completeApply(response, param) {

    gw_com_api.messageBox([
        { text: response.VALUE[1] }
    ], 420, gw_com_api.v_Message.msg_informBatched, "ALERT",
    { handler: successApply, response: response });

}
//----------
function successApply(response) {
    if (response.VALUE[0] != -1) { processRetrieve({}); }
}
//----------
function successUpload(response) {

    v_global.logic.id = response.id;
    v_global.logic.path = response.path;

    var data = [];
    $.each(response.option.split(","), function () {
        data.push({ title: this, value: this });
    });
    var args = {
        request: [ { type: "INLINE", name: "SHEET", data: data } ],
        starter: processOption
    };
    gw_com_module.selectSet(args);
    //----------
    var args = { targetid: "lyrRemark",
        row: [
		    { name: "작업", value: "[ 파일 : " + response.file + " ]" }
	    ]
    };
    gw_com_module.labelAssign(args);

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_upload_ESTREQ:
            {
                v_global.data = param.data;
                v_global.process.init = true;
            }
            break;
        case gw_com_api.v_Stream.msg_resultMessage:
            {
                if (param.data.page != gw_com_api.getPageID())
                    break;
                switch (param.data.ID) {
                    case gw_com_api.v_Message.msg_confirmBatch:
                        { if (param.data.result == "YES") processApply(param.data.arg); }
                        break;
                    case gw_com_api.v_Message.msg_informBatched:
                        { param.data.arg.handler(param.data.arg.response, param.data.arg.param); }
                        break;
                    case gw_com_api.v_Message.msg_informSaved:
                        { param.data.arg.handler(param.data.arg.response, param.data.arg.param); }
                        break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_selectedCustomer:
            {
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "cust_cd",
			                        param.data.cust_cd,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "cust_nm",
			                        param.data.cust_name,
			                        (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = {
                    to: {
                        type: "POPUP",
                        page: param.from.page
                    }
                };
                switch (param.from.page) {
                    case "w_find_cust_info":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectCusromer;
                        }
                        break;
                }
                gw_com_module.streamInterface(args);
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                closeDialogue({ page: param.from.page });
            }
            break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//