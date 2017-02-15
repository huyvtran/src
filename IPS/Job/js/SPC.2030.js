
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

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // entry point. (pre-process section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    ready: function () {

        // initialize page.
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        var args = { request: [ 
				{ type: "PAGE", name: "QCITEM_SUPP", query: "DDDW_SPC_QCITEM",
				    param: [{ argument: "arg_hcode", value: gw_com_module.v_Session.EMP_NO}] },
				{ type: "PAGE", name: "QCPART_SUPP", query: "DDDW_SPC_QCPART",
				    param: [{ argument: "arg_hcode", value: gw_com_module.v_Session.EMP_NO}] },
				{ type: "PAGE", name: "QCGROUP_SUPP", query: "DDDW_SPC_QCGROUP",
				    param: [{ argument: "arg_hcode", value: gw_com_module.v_Session.EMP_NO}] },
				{ type: "PAGE", name: "검사항목", query: "DDDW_CM_CODE",
				    param: [{ argument: "arg_hcode", value: "SPC010"}] },
				{ type: "PAGE", name: "품목분류", query: "DDDW_CM_CODE",
				    param: [{ argument: "arg_hcode", value: "SPC020"}] },
				{ type: "PAGE", name: "협력사", query: "DDDW_SPC_SUPP" },
                { type: "INLINE", name: "보기",
                    data: [
						{ title: "축약", value: "S" },
						{ title: "확장", value: "L" }
					]
                },
                { type: "INLINE", name: "생산공정",
                    data: [ { title: "기존", value: "기존" }, { title: "신규", value: "신규" } ] }
			],
            starter: start
        };
        gw_com_module.selectSet(args);

        //start();  //gw_com_module.selectSet(args) 을 사용하지 않을 시에 활성화
        function start() { gw_job_process.UI(); }

    },  // End of gw_job_process.ready

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage UI. (design section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    UI: function () {

        //==== Menu : Main ====
        var args = { targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "조회", value: "조회", act: true },
				{ name: "닫기", value: "닫기" }
			]
        };
        gw_com_module.buttonMenu(args);

        //==== Option : Form Main ====
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
//                        ,{ name: "supp_nm", label: { title: "협력사 :" },
//                            mask: "search",
//                            editable: { type: "text", size: 18, maxlength: 30 }
//                        }
				      ] 
				    },
                    { 
                      element: [
                        { name: "part_grp", label: { title: "품목분류 :" },
                            editable: { type: "select", size: 7, maxlength: 20
//                            	, data: { memory: "QCGROUP_SUPP", unshift: [ { title: "전체", value: "" } ] } }
                            	, data: { memory: "품목분류", unshift: [ { title: "전체", value: "" } ] } }
                        },
                        { name: "qcitem_cd", label: { title: "검사항목 :" },
                            editable: { type: "select", size: 7, maxlength: 20
//                            	, data: { memory: "QCITEM_SUPP", unshift: [ { title: "전체", value: "" } ] } }
                            	, data: { memory: "검사항목", unshift: [ { title: "전체", value: "" } ] } }
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

        //==== Grid : Main ====
        var args = { targetid: "grdData_메뉴", query: "SPC_2000_M_1", title: "검사 내역",
            caption: true, width: 570, height: 508, show: true, selectable: true,
            element: [
				{ header: "관리번호", name: "qc_seq", width: 100, align: "center" },
				{ header: "검사일자", name: "qc_date", width: 80, align: "center", mask: "date-ymd" },
				{ header: "Part No.", name: "part_no", width: 80, align: "center" },
				{ header: "Part Name", name: "part_nm", width: 120, align: "left" },
				{ header: "검사항목", name: "qcitem_nm", width: 120, align: "left" },
				{ header: "건수", name: "value_cnt", width: 80, align: "center" },
				{ header: "Project No.", name: "proj_no", width: 80, align: "center" },
				{ header: "Model", name: "model_no", width: 100, align: "left" },
				{ name: "qcitem_cd", hidden: true },
				{ name: "supp_cd", hidden: true },
				{ name: "normal_value", hidden: true },
				{ name: "usl_value", hidden: true },
				{ name: "lsl_value", hidden: true },
				{ name: "gap_value", hidden: true },
				{ name: "qc_type", hidden: true }
			]
        };
        gw_com_module.gridCreate(args);
        //==== Form : Main ====
        var args = { targetid: "frmData_상세", query: "SPC_2000_S_1", type: "TABLE", title: "검사 내역",
            caption: true, show: true, selectable: true,
            //editable: { bind: "select", focus: "part_no", validate: true },
            content: { width: { label: 80, field: 130 }, height: 25,
                row: [
                    { element: [
                            { header: true, value: "부품번호", format: { type: "label"} },
                            { name: "part_no",
                              //format: { type: "select", data: { memory: "QCPART_SUPP" } },
                              editable: { type: "select", validate: { rule: "required", message: "Part No." } 
                            			, data: { memory: "QCPART_SUPP", unshift: [ { title: "-", value: "" } ], key: ["supp_cd"] }
										},
							  change: [ { name: "qcitem_cd", memory: "QCITEM_SUPP", key: ["part_no"] } ]
							},
//                            { name: "part_no", mask: "search"
//                            	, editable: { type: "text", readonly: false, validate: { rule: "required", message: "Part No." } } },
                            { header: true, value: "Model", format: { type: "label"} },
                            { name: "model_no", editable: { type: "text"} }
                        ]
                    },
                    { element: [
                            { header: true, value: "검사항목", format: { type: "label"} },
//                            { name: "qcitem_cd"
//                                , editable: { type: "select", data: { memory: "검사항목" }, validate: { rule: "required" } } },
                            { name: "qcitem_cd",
                              editable: { type: "select", validate: { rule: "required", message: "검사항목" },
                            			  data: { memory: "QCITEM_SUPP", unshift: [ { title: "-", value: "" } ], key: ["part_no"]}
										} 
							},
                            { header: true, value: "Project No", format: { type: "label"} },
                            { name: "proj_no", editable: { type: "text"} }
                        ]
                    },
                    { element: [
                            { header: true, value: "측 정 자", format: { type: "label"} },
                            { name: "qc_charge", editable: { type: "text"} },
                            { header: true, value: "검사일자", format: { type: "label"} },
                            { name: "qc_date", mask: "date-ymd", align: "center",
                            	editable: { type: "text", validate: { rule: "required" }} 
                            }
                        ]
                    },
                    { element: [
                            { header: true, value: "Exponent", format: { type: "label"} },
                            { name: "value_exp", mask: "numeric-int" },
                            { header: true, value: "등록일시", format: { type: "label"} },
                            { name: "ins_dt", align: "center" },
                            { name: "qc_seq", hidden: true, editable: { type: "hidden"} },
                            { name: "supp_cd", hidden: true, editable: { type: "hidden"}
                            , change: [ { name: "part_no", memory: "QCPART_SUPP", key: ["supp_cd"], unshift: [ { title: "-", value: "" } ] } ] 
                            }
                        ]
                    }
//                    {
//                        element: [
//                            { header: true, value: "Normal Value", format: { type: "label"} },
//                            { name: "normal_value", mask: "numeric-float", editable: { type: "text"} },
//                            { header: true, value: "USL Value", format: { type: "label"} },
//                            { name: "usl_value", mask: "numeric-float", editable: { type: "text"} }
//                        ]
//                    },
//                    {
//                        element: [
//                            { header: true, value: "종  류", format: { type: "label"} },
//                            { name: "qc_type", editable: { type: "text"} },
//                            { header: true, value: "LSL Value", format: { type: "label"} },
//                            { name: "lsl_value", mask: "numeric-float", editable: { type: "text"} },
//                            { name: "gap_value", editable: { type: "hidden"} },
//                        ]
//                    }
                ]
            }
        };
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_2", type: "FREE", show: false,
            element: [
				{ name: "추가", value: "추가" },
				{ name: "삭제", value: "삭제" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = { targetid: "grdData_권한", query: "SPC_2000_S_2", title: "검사 결과",
            caption: true, width: 266, height: 374, show: true, selectable: true, number: true,
            //editable: { multi: true, bind: "select", focus: "ser_no", validate: true },
            element: [
                { header: "Serial No.", name: "ser_no", width: 100, align: "center" 
                	, editable: { type: "text"} },
                { header: "Value.", name: "qc_value", width: 80, align: "center"
                	, editable: { type: "text"} },
                { header: "공정", name: "proc_tp", width: 80, align: "center"
                	, editable: { type: "select", data: { memory: "생산공정"} } },
                { header: "측정자 비고", name: "qc_rmk", width: 120, align: "left" , editable: { type: "text"} },
                { header: "품질 비고", name: "rmk1", width: 120, align: "left", editable: { type: "text"} },
                { header: "부품 비고", name: "rmk2", width: 120, align: "left", editable: { type: "text"} },
				{ name: "qc_seq", hidden: true, editable: { type: "hidden"} },
				{ name: "sub_seq", hidden: true, editable: { type: "hidden"} }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "FORM", id: "frmData_상세", offset: 8 },
				{ type: "GRID", id: "grdData_권한", offset: 8 }
			]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        //----------
        gw_com_module.informSize();

        gw_job_process.procedure();
        //----------

    },

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage process. (program section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    procedure: function () {

        //----------
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: click_lyrMenu_조회 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: click_lyrMenu_닫기 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "추가", event: "click", handler: click_lyrMenu_2_추가 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "삭제", event: "click", handler: click_lyrMenu_2_삭제 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: click_frmOption_실행 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: click_frmOption_취소 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_메뉴", grid: true, event: "rowselecting", handler: rowselecting_grdData_메뉴 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_메뉴", grid: true, event: "rowselected", handler: rowselected_grdData_메뉴 };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_ExcelUpload() {

            var args = { ID: gw_com_api.v_Stream.msg_linkPage,
                to: { type: "MAIN" },
                data: { page: "SPC_2012", title: "검사결과 일괄등록" }
            }
            gw_com_module.streamInterface(args);

        }
        //----------
        function click_lyrMenu_ExcelDown(ui) {
            var args = {
                targetid: "lyrServer",
                control: { by: "DX", id: ctlUpload }
            };
            gw_com_module.uploadFile(args);
        }
        //----------
        function click_lyrMenu_조회() {
            var args = { target: [ { id: "frmOption", focus: true } ] };
            gw_com_module.objToggle(args);
        }
        //----------
        function click_lyrMenu_추가(ui) {
            v_global.process.handler = processInsert;
            if (!checkUpdatable({})) return;
            processInsert({});
        }
        //----------
        function click_lyrMenu_삭제(ui) {
            v_global.process.handler = processRemove;
            if (!checkManipulate({})) return;
            checkRemovable({});
        }
        //----------
        function click_lyrMenu_저장(ui) {
            closeOption({});
            processSave({});
        }
        //----------
        function click_lyrMenu_닫기(ui) {
            checkClosable({});
        }
        //----------
        function click_frmOption_실행(ui) {
            v_global.process.handler = processRetrieve;		// process.handler
            if (!checkUpdatable({})) return;	// 저장하지 않고 조회할 경우 때문에 process.handler 지정문 이후에 와야함
            processRetrieve({});
        }
        //----------
        function click_frmOption_취소(ui) {
            closeOption({});
        }
        //----------
        function click_lyrMenu_2_추가(ui) {
            if (!checkManipulate({})) return;
            v_global.process.handler = processInsert;
            //if (!checkUpdatable({ sub: true })) return;
            processInsert({ sub: true });
        }
        //----------
        function click_lyrMenu_2_삭제(ui) {
            if (!checkManipulate({})) return;
            /*if (gw_com_api.getRowCount("grdData_발생내역") < 2) {
                gw_com_api.messageBox([
                    { text: "발생 내역은 최소 한 건은 입력되어야 합니다." }
                ]);
                return false;
            }*/
            v_global.process.handler = processRemove;
            checkRemovable({ sub: true });
        }
        //----------
        function rowselecting_grdData_메뉴(ui) {
            v_global.process.handler = processSelect;
            v_global.process.current.master = ui.row;
            return checkUpdatable({});
        }
        //----------
        function rowselected_grdData_메뉴(ui) {
            v_global.process.prev.master = ui.row;
            processLink({ master: true });
        };

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -6 }));
        gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate(""));
        gw_com_api.setValue("frmOption", 1, "supp_cd", gw_com_module.v_Session.EMP_NO );

        gw_com_module.startPage();

    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function checkCRUD(param) {

    return gw_com_api.getCRUD("frmData_상세");

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
//----------
function checkUpdatable(param) {

    closeOption({});

    var args = {
        target: [
            {
                type: "FORM",
                id: "frmData_상세"
            },
            {
                type: "GRID",
                id: "grdData_권한"
            }
		],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function checkRemovable(param) {
    closeOption({});
    var status = checkCRUD({});
    if (status == "initialize" || status == "create")
        processClear({});
    else
        gw_com_api.messageBox([
            { text: "REMOVE" }
        ], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO", param);
}

//----------
function checkClosable(param) {

    closeOption({});

    v_global.process.handler = processClose;

    if (!checkUpdatable({})) return;

    processClose({});

}
//----------
function processRetrieve(param) {

    var args = { target: [ { type: "FORM", id: "frmOption" } ] };
    if (gw_com_module.objValidate(args) == false) {
        processClear({ master: true });
        return false;
    }
    
	//신규 생성 후 해당 Row 찾아가기 위함
    if (param.key != undefined) {
        $.each(param.key, function () {
            if (this.QUERY == "SPC_2000_S_1")
                this.QUERY = "SPC_2000_M_1";
        });
    }
    
    var args = { key: param.key,
    	source: { type: "FORM", id: "frmOption", hide: true,
            element: [
				{ name: "ymd_fr", argument: "arg_ymd_fr" },
				{ name: "ymd_to", argument: "arg_ymd_to" },
				{ name: "supp_cd", argument: "arg_supp_cd" },
				{ name: "part_grp", argument: "arg_part_grp" },
				{ name: "qcitem_cd", argument: "arg_qcitem_cd" }
			],
            remark: [
	            { element: [ { name: "ymd_fr" }, { name: "ymd_to" } ], infix: "~" },
	            { element: [ { name: "supp_cd"}] },
	            { element: [ { name: "part_grp"}] },
	            { element: [ { name: "qcitem_cd"}] }
		    ]
        },
        target: [
			{ type: "GRID", id: "grdData_메뉴", select: true }
		],
        clear: [
            { type: "FORM", id: "frmData_상세" },
			{ type: "GRID", id: "grdData_권한" }
		]
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {

    var args = {};
    if (param.master) {
        args = { key: param.key,
	        source: {
	            type: "GRID", id: "grdData_메뉴", row: "selected", block: true,
	            element: [ { name: "qc_seq", argument: "arg_qc_seq" } ]
	        },
	        target: [
	            { type: "FORM", id: "frmData_상세" }	//, edit: true
			],
            handler: { complete: processLink, param: {} }	// Form Data 가 있을 경우 추가
        };
    }
    else {
        args = { key: param.key,
	        source: {
	            type: "GRID", id: "grdData_메뉴", row: "selected", block: true,
	            element: [ { name: "qc_seq", argument: "arg_qc_seq" } ]
	        },
	        target: [
	            { type: "FORM", id: "frmData_상세" },	//, edit: true
				{ type: "GRID", id: "grdData_권한" }	    //, select: true
			]
        };
    }
//    var args = {
//        source: {
//            type: "GRID", id: "grdData_메뉴", row: "selected", block: true,
//            element: [ { name: "qc_seq", argument: "arg_qc_seq" } ]
//        },
//        target: [
//            { type: "FORM", id: "frmData_상세" },	//, edit: true
//			{ type: "GRID", id: "grdData_권한" }	//, select: true
//		],
//        key: param.key
//    };
    gw_com_module.objRetrieve(args);

}
//----------
function processSelect(param) {

    gw_com_api.selectRow("grdData_메뉴", v_global.process.current.master, true, false);

}
//----------
function processInsert(param) {

    if (param.sub) {
        var args = { targetid: "grdData_권한", edit: true, updatable: true,
            data: [
                { name: "qc_seq", value: gw_com_api.getValue("frmData_상세", 1, "qc_seq")},
                { name: "sub_seq", rule: "INCREMENT", value: 1 }
                //{ name: "prod_sub", rule: "COPY", row: "prev", value: gw_com_api.getValue("frmData_발생정보", 1, "prod_sub") },
            ]
        };
        gw_com_module.gridInsert(args);
    }
    else {
	    gw_com_api.selectRow("grdData_메뉴", "reset");
	    var args = { targetid: "frmData_상세", edit: true, updatable: true,
	        data: [
	                { name: "supp_cd", value: gw_com_api.getValue("frmOption", 1, "supp_cd") },
	                { name: "qc_date", value: gw_com_api.getDate() }
	            ],
	        clear: [
			        { type: "GRID", id: "grdData_권한" }
		        ]
	    };
	    gw_com_module.formInsert(args);
	}
}
//----------
function processDelete(param) {

    var args = { row: "selected", remove: true };
    if (param.sub) { 
    	args.targetid = "grdData_권한"; 
    }
    else { 
    	args.targetid = "grdData_메뉴"; 
    	args.clear = [{ type: "FORM", id: "frmData_상세" },{ type: "GRID", id: "grdData_권한" }];
    }
    	
    gw_com_module.gridDelete(args);

}
//----------
function processImport(param) {

    var args = {
        user: gw_com_module.v_Session.USR_ID,
        key: v_global.logic.id,
        path: v_global.logic.path,
        sheet: gw_com_api.getValue("frmOption", 1, "sheet_nm"),
        row: 8,
        column: 1,
        fields: 14,
        handler: {
            success: successImport
        }
    };
    gw_com_module.objImport(args);

}
//----------
function processSave(param) {
    var args = {
        target: [
            { type: "FORM", id: "frmData_상세" },
			{ type: "GRID", id: "grdData_권한" }
		]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    //args.url = "COM";
    args.handler = { success: successSave, param: param };
    gw_com_module.objSave(args);

}
//----------
function processRemove(param) {

    var args = {};
	if (param.sub){
	    args = { url: "COM",
	        target: [
			    { type: "GRID", id: "grdData_권한"
                    , key: [ { row: "selected", element: [ { name: "qc_seq" }, { name: "sub_seq"} ] } ]
                }
		    ],
	        handler: { success: successRemove }
	    };
	}
	else{
	    args = { url: "COM",
	        target: [
			    { type: "FORM", id: "frmData_상세", key: { element: [ { name: "qc_seq" } ] } }
		    ],
	        handler: { success: successRemove }
	    };
	}
    args.handler = { success: successRemove, param: param };
    gw_com_module.objRemove(args);

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_상세" },
            { type: "GRID", id: "grdData_권한" }
        ]
    };
    if (param.master) {
        args.target.unshift({  type: "GRID", id: "grdData_메뉴" });
    }
    gw_com_module.objClear(args);

}
//----------
function processClose(param) {

    var args = { ID: gw_com_api.v_Stream.msg_closePage };
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
function successSave(response, param) {
	
    var status = checkCRUD({});
    if (status == "create" || status == "update")
        processRetrieve({ key: response });		//신규 생성 후 해당 Row 찾아가기 위함
    else 
    	processLink({ sub: true, key: response });

}
//----------
function successRemove(response, param) {

    processDelete(param);

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
streamProcess = function (param) {

    switch (param.ID) {
        // 부품 선택 후 처리  
        case gw_com_api.v_Stream.msg_selectedPart_QCM: {
                if (v_global.event.element == "part_no") {
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, "part_no", param.data.part_cd, false);
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, "model_no", param.data.part_grp_nm, false);
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, "qcitem_cd", param.data.qcitem_cd, false);
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, "qcitem_nm", param.data.qcitem_nm, false);
                }
                closeDialogue({ page: param.from.page, focus: true });
            } break;
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
                    case gw_com_api.v_Message.msg_confirmSave:
                        {
                            if (param.data.result == "YES")
                                processSave({});
                            else {
                                if (param.data.arg.sub) {
                                    var status = checkCRUD({});
                                    if (status == "initialize" || status == "create")
                                        processClear({});
                                    else if (status == "update" || gw_com_api.getUpdatable("frmData_상세") )
                                        processLink({ master: true });
                                    else {
                                        var status = checkCRUD(param.data.arg);
                                        if (status == "initialize" || status == "create")
                                            processDelete(param.data.arg);
                                        else if (status == "update")
                                            processRestore(param.data.arg);
                                        if (v_global.process.handler != null)
                                            v_global.process.handler(param.data.arg);
                                    }
                                }
                                else
                                    if (v_global.process.handler != null)
                                        v_global.process.handler({});
                            }
                        }
                        break;
                    case gw_com_api.v_Message.msg_confirmRemove:
                    	{ if (param.data.result == "YES") processRemove(param.data.arg); } break;
                    case gw_com_api.v_Message.msg_informSaved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                    case gw_com_api.v_Message.msg_informRemoved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = { to: { type: "POPUP", page: param.from.page } };
                switch (param.from.page) {
                    case "w_find_supplier":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectSupplier;
                            args.data = { system: "PLM",
                                supp_nm: gw_com_api.getValue( v_global.event.object, v_global.event.row, v_global.event.element,
			                                (v_global.event.type == "GRID") ? true : false)
                            };
                        }
                        break;
                    case "w_find_part_spcqc":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectPart_QCM;
                            args.data = { system: "PLM",
                                supp_cd: gw_com_api.getValue( v_global.event.object, v_global.event.row, "supp_cd",
			                                (v_global.event.type == "GRID") ? true : false)
                            };
                        }
                        break;
                    case "w_find_emp_scm":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selecteEmployee_SCM;
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