
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define Global variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
    logic: {}
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

        var args = { request: [
				{ type: "PAGE", name: "검사항목", query: "DDDW_CM_CODE",
				    param: [{ argument: "arg_hcode", value: "SPC010"}] },
				{ type: "PAGE", name: "품목분류", query: "DDDW_CM_CODE",
				    param: [{ argument: "arg_hcode", value: "SPC020"}] },
				{ type: "PAGE", name: "협력사", query: "DDDW_SPC_SUPP" },
                { type: "INLINE", name: "VIEW",
                    data: [
						{ title: "진행 중", value: "0" },
						{ title: "완료", value: "1" }
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
				{ name: "조회", value: "조회", act: true },
				{ name: "첨부등록", value: "첨부등록", icon: "추가" },
				{ name: "첨부보기", value: "첨부보기", icon: "실행" },
				{ name: "첨부삭제", value: "첨부삭제", icon: "삭제" },
				{ name: "닫기", value: "닫기" }
			]
        };
        gw_com_module.buttonMenu(args);
        

        //==== Option : Form Main ====
        var args = { targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, show: true, border: true, remark: "lyrRemark", margin: 5,
            editable: { focus: "ymd_fr", validate: true },
            content: { row: [
                    { element: [
				        { style: { colfloat: "floating" }, mask: "date-ymd",
				          name: "ymd_fr", label: { title: "대상기간 :" },
				          editable: { type: "text", size: 7, maxlength: 10 }
				        },
				        { style: { colfloat: "floating" }, mask: "date-ymd",
				          name: "ymd_to", label: { title: "~" },
				          editable: { type: "text", size: 7, maxlength: 10 }
				        },
                  		{ name: "chart_view", label: { title: "처리구분 :" }, 
			                editable: { type: "select", data: { memory: "VIEW", unshift: [ { title: "전체", value: "" } ] }  }
			            }
				      ] 
				    },
                    { element: [
                        { name: "supp_cd", label: { title: "협력사 :" }, //hidden: true, 
                            editable: { type: "select", size: 7, maxlength: 20, data: { memory: "협력사", unshift: [ { title: "전체", value: "" } ] } }
                        }
				      ] 
				    },
                    { align: "right", element: [
			            { name: "실행", value: "실행", act: true, format: { type: "button"} },
			            { name: "취소", value: "취소", act: true, format: { type: "button", icon: "닫기"} }
				      ]
                    }
			    ]
            }
        };
        gw_com_module.formCreate(args);

        //==== Grid : Main ====
        var args = { targetid: "grdData_Main", query: "SPC_5030_M_1", title: "NCR 관리대장",
            caption: false, height: 450, show: true, selectable: true, dynamic: true,
            editable: { multi: true, bind: "select", focus: "change_tp", validate: true },
            color: { row: true }, 
            element: [
				{ header: "등록번호", name: "qc_seq", width: 80, align: "center" },
				{ header: "순번", name: "sub_seq", width: 40, align: "center" },
				{ header: "NCR No.", name: "ncr_no", width: 80, align: "center" },
				{ header: "구분", name: "ncr_tp", width: 50, align: "center" },
				{ header: "발생일", name: "qc_date", width: 70, align: "center", mask: "date-ymd" },
				{ header: "협력사", name: "supp_nm", width: 120, align: "center"},
				{ header: "S/N", name: "ser_no", width: 120, align: "center" },
				{ header: "품번", name: "part_nm", width: 80, align: "center" },
				{ header: "품명", name: "part_nm", width: 120, align: "left" },
				{ header: "검사항목", name: "qcitem_nm", width: 80, align: "center" },
				{ header: "수량", name: "part_qty", width: 40, align: "center", mask: "numeric-int" },
				{ header: "측정치", name: "qc_value", width: 60, align: "center" },
				{ header: "불량내용", name: "qc_rmk", width: 180, align: "center" },
				{ header: "작성자", name: "emp_nm", width: 80, align: "center" },
				{ header: "처리결과", name: "qc_chk", width: 60, align: "center" },
				{ header: "첨부 파일", name: "file_nm", width: 200, align: "left", editable: { type: "text", readonly: true} },
                { name: "file_id", hidden: true, editable: { type: "hidden"} },
                { name: "file_path", hidden: true, editable: { type: "hidden"} },
				{ name: "supp_cd", hidden: true },
				{ name: "part_no", hidden: true }
			]
        };
        gw_com_module.gridCreate(args);

        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);

        //==== Resize Objects ====
        var args = {
            target: [
                { type: "GRID", id: "grdData_Main", offset: 8 }
			]
        };
        gw_com_module.objResize(args);

        // go next.
        gw_job_process.procedure();

    },  // End of gw_job_process.UI


    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage process. (program section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    procedure: function () {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Define Events & Method
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //==== Button Click : Main & Option ====
        var args = { targetid: "lyrMenu_1", element: "조회", event: "click", handler: click_lyrMenu_조회 };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_1", element: "닫기", event: "click", handler: click_lyrMenu_닫기 };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_1", element: "첨부등록", event: "click", handler: click_lyrMenu_1_첨부등록 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1", element: "첨부보기", event: "click", handler: click_lyrMenu_1_첨부보기 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1", element: "첨부삭제", event: "click", handler: click_lyrMenu_1_첨부삭제 };
        gw_com_module.eventBind(args);

        var args = { targetid: "frmOption", element: "실행", event: "click", handler: click_frmOption_실행 };
        gw_com_module.eventBind(args);
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: click_frmOption_취소 };
        gw_com_module.eventBind(args);
        
        //==== Event Handler. : Main & Option ====
        function click_lyrMenu_조회() {
            var args = { target: [ { id: "frmOption", focus: true } ] };
            gw_com_module.objToggle(args);
        }
        //----------
        function click_lyrMenu_닫기(ui) { processClose({}); }
        //----------
        function click_frmOption_실행(ui) { processRetrieve({}); }
        //----------
        function click_frmOption_취소(ui) { closeOption({}); }

        //----------
        function click_lyrMenu_1_첨부등록(ui) {

            if (!checkManipulate({})) return;

            var args = { type: "PAGE", page: "w_upload_spcncr", title: "첨부 파일 업로드",
                width: 650, height: 200, locate: ["center", 210], open: true
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = { page: "w_upload_spcncr",
                    param: {
                        ID: gw_com_api.v_Stream.msg_upload_ECCB,
                        data: { user: gw_com_module.v_Session.USR_ID,
                            key: gw_com_api.getValue("grdData_Main", "selected", "ncr_no", true),
                            seq: "0", sub_seq: "0"
                        }
                    }
                };
                gw_com_module.dialogueOpen(args);
            }

        }
        //----------
        function click_lyrMenu_1_첨부보기(ui) {
            if (!checkManipulate({ part: true })) return;

            var FileId = gw_com_api.getValue("grdData_Main", "selected", "file_id", true);
            if (FileId < "  ") {
                gw_com_api.showMessage("등록된 첨부가 없습니다.", "yes");
                return;
            }
            ui.row = gw_com_api.getSelectedRow("grdData_Main", false);

            var args = {
                source: { id: "grdData_Main", row: ui.row },
                targetid: "lyrDown"
            };
            gw_com_module.downloadFile(args);

        }
        //----------
        function click_lyrMenu_1_첨부삭제(ui) {
            if (!checkManipulate({ part: true })) return;

            processApply( {action: "D"} );

        }

        //==== Event Handler. : Grid Main ====
//        var args = { targetid: "grdData_Main", grid: true, event: "rowselected", handler: rowselected_grdData_Main };
//        gw_com_module.eventBind(args);
//        //----------------------------------------
//        function rowselected_grdData_Main(ui) { processLink({}); };

        //==== Event Handler. : Grid Sub ====
        var args = { targetid: "grdData_Main", grid: true, event: "rowdblclick", handler: rowdblclick_grdData_Main };
        gw_com_module.eventBind(args);
        var args = { targetid: "grdData_Main", grid: true, event: "rowkeyenter", handler: rowdblclick_grdData_Main };
        gw_com_module.eventBind(args);
        //----------------------------------------
        function rowdblclick_grdData_Main(ui) {
//			gw_com_api.messageBox([ { text: "개발 테스트 중 입니다." } ]);
			return false;
        	 
            v_global.event.type = ui.type;
            v_global.event.object = ui.object;
            v_global.event.row = ui.row;
            v_global.event.element = null;
            var args = { type: "PAGE", page: "w_ehm1030", title: "품질검사 첨부",
                width: 680, height: 380, open: true, control: true
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = { page: "w_ehm1030",
                    param: { ID: gw_com_api.v_Stream.msg_editASEquipment,
                        data: { prod_sno: gw_com_api.getValue( ui.object, ui.row, "supp_cd", true)
                        }
                    }
                };
                gw_com_module.dialogueOpen(args);
            }
        }	// End of rowdblclick_grdData_Main 

        gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -3 }));
        gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate(""));
        gw_com_api.setValue("frmOption", 1, "chart_view", "0" );
        //----------
        gw_com_module.startPage();
        processRetrieve({});

    }   // End of gw_job_process.procedure

};  // End of gw_job_process

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function processApply(param) {

    var args = {
        url: "COM",
        procedure: "PROC_SPC_NCRATT_FILE",
        nomessage: true,
        input: [
            { name: "file_id", value: gw_com_api.getValue("grdData_Main", "selected", "file_id", true) },
            { name: "user", value: gw_com_module.v_Session.USR_ID, type: "varchar" },
            { name: "proctype", value: param.action, type: "varchar" }
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
function completeApply(response, param) {

    gw_com_api.messageBox([
        { text: response.VALUE[1] }
    ], 420, gw_com_api.v_Message.msg_informBatched, "ALERT",
    { handler: successApply, response: response });

}
function successApply(response) {
    gw_com_api.setValue("grdData_Main", "selected", "file_id", "", true);
    gw_com_api.setValue("grdData_Main", "selected", "file_nm", "", true);
    gw_com_api.setValue("grdData_Main", "selected", "file_path", "", true);

    //if (response.VALUE[0] != -1) { processRetrieve({}); }
}


//----------
function checkCRUD(param) {

    return gw_com_api.getCRUD("grdData_Main", "selected", true);

}
//----------
function checkManipulate(param) {

    closeOption({});

    if (checkCRUD({}) == "none") {
        gw_com_api.messageBox([
            { text: "NOMASTER" }
        ]);
        return false;
    }
    return true;

}
function checkUpdatable(param) {

    closeOption({});

    var args = {
        check: param.check,
        target: [
			{ type: "GRID", id: "grdData_Main" }
		],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function processRetrieve(param) {

    var args = { target: [ { type: "FORM", id: "frmOption" } ] };
    if (gw_com_module.objValidate(args) == false) return false;

    var args = { key: param.key,
        source: { type: "FORM", id: "frmOption", hide: true,
            element: [
				{ name: "ymd_fr", argument: "arg_ymd_fr" },
				{ name: "ymd_to", argument: "arg_ymd_to" },
				{ name: "supp_cd", argument: "arg_supp_cd" },
				{ name: "chart_view", argument: "arg_chart_view" }
			],
            remark: [
	            { element: [ { name: "ymd_fr" }, { name: "ymd_to" } ], infix: "~" },
	            { element: [ { name: "supp_cd"}] },
	            { element: [ { name: "chart_view"}] }
		    ]
        },
        target: [
			{ type: "GRID", id: "grdData_Main", select: true }
		],
        clear: [
			{ type: "GRID", id: "grdData_Main" }

		]
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {

    var args = { key: param.key,
        source: { type: "GRID", id: "grdData_Main", row: "selected", block: true,
            element: [
				{ name: "ymd_fr", argument: "arg_ymd_fr" },
				{ name: "ymd_to", argument: "arg_ymd_to" },
				{ name: "supp_cd", argument: "arg_supp_cd" },
				{ name: "part_grp", argument: "arg_part_grp" },
				{ name: "qcitem_cd", argument: "arg_qcitem_cd" },
				{ name: "chart_view", argument: "arg_chart_view" }
			],
        },
        target: [
            { type: "GRID", id: "grdData_Main", select: true },
            { type: "GRID", id: "grdData_Detail2", select: true }
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
function closeOption(param) { gw_com_api.hide("frmOption"); }
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
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
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
        case gw_com_api.v_Stream.msg_retrieve:
            {
                if (param.data.key != undefined) {
                    $.each(param.data.key, function () {
                        if (this.QUERY == "SPC_5010_M_1")
                            this.QUERY = "SPC_5010_M_1";
                    });
                }
                processRetrieve({ key: param.data.key });
            }
            break;
        case gw_com_api.v_Stream.msg_remove:
            {
                var args = {
                    targetid: "grdData_Main",
                    row: v_global.event.row
                }
                gw_com_module.gridDelete(args);
            }
            break;
        case gw_com_api.v_Stream.msg_uploaded_ECCB: {
//                var args = {
//                    source: { type: "GRID", id: "grdData_발생내역", row: "selected",
//                        element: [
//				            { name: "issue_no", argument: "arg_issue_no" },
//				            { name: "issue_seq", argument: "arg_issue_seq" }
//			            ]
//                    },
//                    target: [ { type: "GRID", id: "grdData_Main", select: true } ],
//                    key: param.key
//                };
//                gw_com_module.objRetrieve(args);
                processRetrieve({});
                closeDialogue({ page: param.from.page });
            } break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = {
                    to: { type: "POPUP", page: param.from.page }
                };
                switch (param.from.page) {
                    case "w_ehm1030":
                        {
                            args.ID = gw_com_api.v_Stream.msg_editASEquipment;
                            if (v_global.event.row != null)
                                args.data = {
                                    prod_sno: gw_com_api.getValue(
                                                v_global.event.object,
                                                v_global.event.row,
                                                "prod_sno",
                                                (v_global.event.type == "GRID" ? true : false))
                                };
                        }
                        break;
                    case "w_upload_spcncr":
                        { args.ID = gw_com_api.v_Stream.msg_upload_ECCB;
                            args.data = { user: gw_com_module.v_Session.USR_ID,
                                key: gw_com_api.getValue("grdData_Main", "selected", "ncr_no", true),
                                seq: "0", sub_seq: "0"
                            };
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

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//