//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 고분보 관리 > A/S 조회
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
        var args = { request: [
                { type: "PAGE", name: "발생구분", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "QDM010"}] 
                },
                { type: "PAGE", name: "접수구분", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "QDM020"}]
                },
                { type: "PAGE", name: "발행구분", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "QDM021"}]
                },
                { type: "PAGE", name: "진행상태", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "QDM025"}]
                },
                { type: "PAGE", name: "발행근거", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "QDM030"}]
                },
                { type: "PAGE", name: "처리방안", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "QDM035"}]
                },
                { type: "PAGE", name: "처리상태", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "QDM025"}]
                },
                { type: "INLINE", name: "합불판정",
                    data: [ { title: "합격", value: "1" }, { title: "불합격", value: "0" } ]
                },
                { type: "PAGE", name: "고객사", query: "DDDW_CM_CODE",
                    param: [ { argument: "arg_hcode", value: "ISCM29" } ]
                },
				{ type: "PAGE", name: "LINE", query: "DDDW_CM_CODED",
				    param: [ { argument: "arg_hcode", value: "IEHM02" } ]
				},
				{
				    type: "PAGE", name: "DEPT_AREA_FIND", query: "dddw_deptarea",
				    param: [{ argument: "arg_type", value: gw_com_module.v_Session.DEPT_AUTH }]
				}
			],
            starter: start
        };
        gw_com_module.selectSet(args);

        //----------
        function start() { 
        	gw_job_process.UI(); 
        	gw_job_process.procedure();

			//==== startup process.
			gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { day: -7 }));
			gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate(""));
			gw_com_module.startPage();

        }
    },

    // manage UI. (design section)
    UI: function () {

        //==== Main Menu : 조회, 접수, 반려, 닫기
        var args = { targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "조회", value: "조회", act: true },
				//{ name: "상세", value: "고분보 조회", icon: "기타" },
				{ name: "추가", value: "고분보 추가", icon: "추가" },
				{ name: "수정", value: "고분보 수정", icon: "저장" },
				{ name: "닫기", value: "닫기" }
			]
        };
        gw_com_module.buttonMenu(args);
        
        //==== Search Option : 
        var args = { targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true, remark: "lyrRemark",
            editable: { focus: "astat", validate: true },
            content: {
                row: [
                    {
                        element: [
			                { name: "ymd_fr", label: { title: "발생일자 :" }, mask: "date-ymd",
			                    style: { colfloat: "floating" },
			                    editable: { type: "text", size: 7, maxlength: 10 }
			                },
			                { name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
			                    editable: { type: "text", size: 7, maxlength: 10 }
			                },
                            {
                                name: "dept_area", label: { title: "사업부 :" },
                                editable: { type: "select", size: 7, maxlength: 20, data: { memory: "DEPT_AREA_FIND" } }
                            }
                        ]
                    },
                    {
                        element: [
                            { name: "issue_tp", label: { title: "발생구분 :" },
                                editable: { type: "select", size: 7, maxlength: 20 , 
                            	    data: { memory: "발생구분", unshift: [{ title: "전체", value: ""}] } }
                            },
                            { name: "astat", label: { title: "발행구분 :" }, //value: "미발행",
                                editable: { type: "select", size: 7, maxlength: 20,
                                    data: { memory: "발행구분", unshift: [{ title: "전체", value: ""}] } 
                                    }
                            }
                    	]
                    },
                    {
                        element: [
			                { name: "cust_cd", label: { title: "고객사 :" },
			                    editable: { type: "select", size: 1,
			                        data: { memory: "고객사", unshift: [ { title: "전체", value: "" } ] },
			                        change: [ { name: "cust_dept", memory: "LINE", key: [ "cust_cd" ] } ]
			                    }
			                },
			                { name: "cust_dept",
			                    label: { title: "LINE :" },
			                    editable: { type: "select", size: 1,
			                        data: { memory: "LINE", unshift: [ { title: "전체", value: "" } ], key: [ "cust_cd" ] }
			                    }
			                },
                            { name: "prod_nm", label: { title: "설비명 :" },
                                editable: { type: "text", size: 20, maxlength: 50 }
                            }
				        ]
                    },
                    {
                        element: [
                            { name: "issue_no", label: { title: "관리번호 :" },
                                editable: { type: "text", size: 20, maxlength: 20 }
                            },
                            { name: "rqst_no", label: { title: "발행번호 :" },
                                editable: { type: "text", size: 20, maxlength: 20 }
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
        gw_com_module.formCreate(args);

        //==== Main Grid : 발생 내역
        var args = { targetid: "grdData_현황", query: "EHM_2311_M_1", title: "발생 정보",
            caption: true, height: 150, dynamic: true, show: true, selectable: true, // number: true, multi: true, checkrow: true,
            element: [
				{ header: "관리번호",  name: "issue_no", width: 80, align: "center" },
				{ header: "발생일자",  name: "issue_dt", width: 80, align: "center", mask: "date-ymd" },
				{ header: "발생구분",  name: "issue_tp", width: 60, align: "center" },
				{ header: "고객사",  name: "cust_nm", width: 60, align: "center" },
				{ header: "Line",  name: "cust_dept", width: 80, align: "center" },
				{ header: "Process",  name: "cust_proc", width: 100, align: "center" },
				{ header: "고객설비명",  name: "cust_prod_nm", width: 100, align: "center" },
                { header: "제품유형", name: "prod_type", width: 80, align: "center" },
				{ header: "제품명",  name: "prod_nm", width: 220, align: "left" },
				{ header: "발생Module",  name: "prod_sub", width: 60, align: "center" },
				{ header: "고장분석 No.",  name: "rqst_no", width: 80, align: "center" },
				{ header: "Warranty",  name: "wrnt_io", width: 60, align: "center" },
				{ header: "진행상태",  name: "istat", width: 60, align: "center" },
				{ header: "ECR No.",  name: "ecr_no", width: 80, align: "center" },
				{ header: "ECR 진행상태",  name: "ecr_stat", width: 80, align: "center" },
				{ header: "NCR(시정조치)",  name: "ncr_no", width: 80, align: "center" },
				{ header: "시정조치 상태",  name: "ncr_stst", width: 80, align: "center" },
				//{ header: "횡전개유무",  name: "pm_yn", width: 80, align: "center" },
				//{ header: "귀책1(CS)",  name: "reason_cs1", width: 80, align: "center" },
				//{ header: "귀책2(CS)",  name: "reason_cs2", width: 80, align: "center" },
				//{ header: "귀책1(품질)",  name: "reason_qm1", width: 80, align: "center" },
				//{ header: "귀책1(품질)",  name: "reason_qm2", width: 80, align: "center" },
				{ header: "발생현상",  name: "rmk", width: 300, align: "left" },
				{ header: "등록자",  name: "ins_usr", width: 70, align: "center" },
				{ header: "등록일시",  name: "ins_dt", width: 160, align: "center" },
				{ header: "수정자",  name: "upd_usr", width: 70, align: "center" },
				{ header: "수정일시",  name: "upd_dt", width: 160, align: "center" },
				{ name: "prod_key", hidden: true }, { name: "dept_nm", hidden: true }
				, { name: "pstat", hidden: true }, { name: "rqst_no", hidden: true }
			]
        };
        gw_com_module.gridCreate(args);
        
        //frmData_발생정보==================================================================
        var args = { targetid: "frmData_발생정보", query: "EHM_2311_M_2", type: "TABLE", title: "발생 정보",
            show: true, selectable: true,
            editable: { bind: "select", focus: "issue_time", validate: true },
            content: { width: { label: 80, field: 190 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "관리번호", format: { type: "label" } },
                            { name: "issue_no", editable: { type: "hidden" } },
                            { header: true, value: "발생일시", format: { type: "label" } },
                            { style: { colfloat: "float" }, name: "issue_dt", mask: "date-ymd", format: { type: "text",     width: 62
                                }, editable: { validate: { rule: "required" },     type: "text",     width: 80 } },
                            { style: { colfloat: "floated" }, name: "issue_time", mask: "time-hh", format: { type: "text",     width: 30
                                }, editable: { type: "text",     width: 30 } },
                            { header: true, value: "발생구분", format: { type: "label" } },
                            { name: "issue_tp"
                            	, editable: { validate: { rule: "required" },     type: "select",     data: { memory: "발생구분"
                                    } } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "고객사", format: { type: "label" } },
                            { name: "cust_nm", mask: "search", editable: { validate: { rule: "required" },     type: "text" } },
                            { header: true, value: "Line", format: { type: "label" } },
                            { name: "cust_dept", editable: { type: "hidden" } },
                            { header: true, value: "Process", format: { type: "label" } },
                            { name: "cust_proc", editable: { type: "hidden" } },
                            { name: "cust_cd", hidden: true, editable: { type: "hidden" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "설비명", format: { type: "label" } },
                            { name: "cust_prod_nm", display: true, editable: { type: "hidden" } },
                            { header: true, value: "제품명", format: { type: "label" } },
                            { name: "prod_nm", display: true, format: { type: "text", width: 458 }, editable: { type: "hidden" } },
                            { header: true, value: "발생Module", format: { type: "label" } },
                            { name: "prod_sub", editable: { type: "select",     data: { memory: "모듈" } } },
                            { name: "prod_type", hidden: true, editable: { type: "hidden" } },
                            { name: "prod_key", hidden: true, editable: { type: "hidden" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "Warranty", format: { type: "label"} },
                            { name: "wrnt_io", editable: { type: "select", data: { memory: "Warranty"}} },
                            { header: true, value: "", format: { type: "label"} },
                            { header: false, value: "", format: { type: "label"} },
                            { header: true, value: "상태", format: { type: "label"} },
                            { name: "pstat", editable: { type: "select", data: { memory: "상태"} } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "발생현상", format: { type: "label" } },
                            { style: { colspan: 5 }, name: "rmk", format: { type: "text",     width: 734
                                }, editable: { type: "text",     width: 734 } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "등록자", format: { type: "label" } },
                            { name: "ins_usr" },
                            { header: true, value: "수정자", format: { type: "label" } },
                            { name: "upd_usr" },
                            { header: true, value: "작성일시", format: { type: "label" } },
                            { name: "upd_dt" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "품질확인", format: { type: "label" } },
                            { name: "qstat" },
                            { header: true, value: "품질확인자", format: { type: "label" } },
                            { name: "qemp" },
                            { header: true, value: "품질확인일시", format: { type: "label" } },
                            { name: "qdate" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "품질확인메모", format: { type: "label" } },
                            { style: { colspan: 5 }, name: "qnote" }
                        ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);
        
        //grdData_발생내역====================================================================
        var args = { targetid: "grdData_발생내역", query: "EHM_2311_S_1", title: "발생 내역",
            caption: true, height: "80", pager: false, show: true, selectable: true,
            element: [
                { header: "순번", name: "issue_seq", width: 35, align: "center" },
				{ header: "발생구분", name: "issue_tp", width: 100, align: "center" },
				{ header: "발생Module",  name: "prod_sub", width: 80, align: "center" },
				{ header: "발생현상(대)", name: "status_grp_nm", width: 80, align: "center" },
				{ header: "발생현상(중)", name: "status_tp1_nm", width: 130, align: "center" },
				{ header: "발생현상(소)", name: "status_tp2_nm", width: 130, align: "center" },
				{ header: "원인부위분류", name: "part_tp1_nm", width: 90, align: "center" },
				{ header: "원인부위구분", name: "part_tp2_nm", width: 130, align: "center" },
				{ header: "원인분류", name: "reason_tp1_nm", width: 90, align: "center" },
				{ header: "원인구분", name: "reason_tp2_nm", width: 130, align: "center" },
				{ header: "귀책분류", name: "duty_tp1_nm", width: 90, align: "center" },
				{ header: "귀책구분", name: "duty_tp2_nm", width: 130, align: "center" },
                { name: "prod_type", hidden: true, editable: { type: "hidden" } },
                { name: "issue_no", hidden: true, editable: { type: "hidden" } },
                { name: "status_grp", hidden: true, editable: { type: "hidden" } },
                { name: "status_tp1", hidden: true, editable: { type: "hidden" } },
                { name: "status_tp2", hidden: true, editable: { type: "hidden" } },
                { name: "part_tp1", hidden: true, editable: { type: "hidden" } },
                { name: "part_tp2", hidden: true, editable: { type: "hidden" } },
                { name: "reason_tp1", hidden: true, editable: { type: "hidden" } },
                { name: "reason_tp2", hidden: true, editable: { type: "hidden" } },
                { name: "duty_tp1", hidden: true, editable: { type: "hidden" } },
                { name: "duty_tp2", hidden: true, editable: { type: "hidden" } }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        
        //==== Resize Objects
        var args = {
            target: [
				{ type: "GRID", id: "grdData_현황", offset: 8 },
                { type: "FORM", id: "frmData_발생정보", offset: 8 },
                { type: "GRID", id: "grdData_발생내역", offset: 8 }
			]
        };
        gw_com_module.objResize(args);
        gw_com_module.informSize();

    },

    //==== manage process. (program section)
    procedure: function () {

        //==== Button Click : Main ====
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: click_lyrMenu_조회 };
        gw_com_module.eventBind(args);
        function click_lyrMenu_조회(ui) { viewOption(); }
        //----------
        var args = { targetid: "lyrMenu", element: "추가", event: "click", handler: processEdit };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "수정", event: "click", handler: processEdit };
        gw_com_module.eventBind(args);
        //----------
        //var args = { targetid: "lyrMenu", element: "상세", event: "click", handler: processDetail };
        //gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //----------
        
        //==== Button Click : Search Option ====
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: click_frmOption_실행 };
        gw_com_module.eventBind(args);
        function click_frmOption_실행(ui) { processRetrieve({}); }
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: click_frmOption_취소 };
        gw_com_module.eventBind(args);
        function click_frmOption_취소(ui) { gw_com_api.hide("frmOption"); }

        //==== Grid Events : Main
        var args = { targetid: "grdData_현황", grid: true, event: "rowselected", handler: rowselected_grdData_현황 };
        gw_com_module.eventBind(args);
        function rowselected_grdData_현황(ui) { processLink(ui); }
        //----------
        var args = { targetid: "grdData_현황", grid: true, event: "rowdblclick", handler: rowdblclick_grdData_현황 };
        gw_com_module.eventBind(args);
        var args = { targetid: "grdData_현황", grid: true, event: "rowkeyenter", handler: rowdblclick_grdData_현황 };
        gw_com_module.eventBind(args);
        function rowdblclick_grdData_현황(ui) { popupDetail(ui); }

    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function viewOption() {
    var args = { target: [ { id: "frmOption", focus: true } ] };
    gw_com_module.objToggle(args);
}
//----------
function processEdit( param ) {
	
    if (gw_com_api.getSelectedRow("grdData_현황") == null) {
        gw_com_api.messageBox([ { text: "선택된 대상이 없습니다." } ], 300);
        return false;
    }

    var RqstNo = gw_com_api.getValue("grdData_현황", "selected", "rqst_no", true);
    var IssueNo = gw_com_api.getValue("grdData_현황", "selected", "issue_no", true);
    var status_grp = "";
    var status_tp1 = "";
    var status_tp2 = "";
    var part_tp1 = "";
    var part_tp2 = "";
    var reason_tp1 = "";
    var reason_tp2 = "";
    var duty_tp1 = "";
    var duty_tp2 = "";

    if (gw_com_api.getRowCount("grdData_발생내역") > 0) {
        status_grp = gw_com_api.getValue("grdData_발생내역", "selected", "status_grp_nm", true);
        status_tp1 = gw_com_api.getValue("grdData_발생내역", "selected", "status_tp1", true);
        status_tp2 = gw_com_api.getValue("grdData_발생내역", "selected", "status_tp2", true);
        part_tp1 = gw_com_api.getValue("grdData_발생내역", "selected", "part_tp1", true);
        part_tp2 = gw_com_api.getValue("grdData_발생내역", "selected", "part_tp2", true);
        reason_tp1 = gw_com_api.getValue("grdData_발생내역", "selected", "reason_tp1", true);
        reason_tp2 = gw_com_api.getValue("grdData_발생내역", "selected", "reason_tp2", true);
        duty_tp1 = gw_com_api.getValue("grdData_발생내역", "selected", "duty_tp1", true);
        duty_tp2 = gw_com_api.getValue("grdData_발생내역", "selected", "duty_tp2", true);
    }

    if ( param.element == "추가" && RqstNo != "" ) {
        gw_com_api.messageBox([ { text: "고분보가 이미 발행된 상태입니다. 수정모드로 들어갑니다." } ], 420);
    }
    
    var args = { ID: gw_com_api.v_Stream.msg_linkPage,
        to: { type: "MAIN" },
        data: { page: "EHM_2312", title: "고분보 등록", 
                param: [
                    { name: "issue_no", value: IssueNo },
                    { name: "rqst_no", value: RqstNo },
                    { name: "status_grp", value: status_grp },
                    { name: "status_tp1", value: status_tp1 },
                    { name: "status_tp2", value: status_tp2 },
                    { name: "part_tp1", value: part_tp1 },
                    { name: "part_tp2", value: part_tp2 },
                    { name: "reason_tp1", value: reason_tp1 },
                    { name: "reason_tp2", value: reason_tp2 },
                    { name: "duty_tp1", value: duty_tp1 },
                    { name: "duty_tp2", value: duty_tp2 }
                ]
        }
    };
    gw_com_module.streamInterface(args);

    //var ProcStat = gw_com_api.getValue("grdData_현황", "selected", "pstat", true);
    //if ( ProcStat == "완료" || ProcStat == "취소" ) {
    //    gw_com_api.messageBox([
    //        { text: status + " 자료이므로 수정할 수 없습니다." }
    //    ], 420);
    //    return false;
    //}
    
	return true;
}
//----------
function processDetail( param ) {
	
    if (gw_com_api.getSelectedRow("grdData_현황") == null) {
        gw_com_api.messageBox([ { text: "선택된 대상이 없습니다." } ], 300);
        return false;
    }

    var ProcStat = gw_com_api.getValue("grdData_현황", "selected", "pstat", true);
    
//    if ( ProcStat == "완료" || ProcStat == "취소" ) {
//        gw_com_api.messageBox([
//            { text: status + " 자료이므로 수정할 수 없습니다." }
//        ], 420);
//        return false;
//    }

    var RqstNo = gw_com_api.getValue("grdData_현황", "selected", "rqst_no", true);
    var IssueNo = gw_com_api.getValue("grdData_현황", "selected", "issue_no", true);

    var args = { ID: gw_com_api.v_Stream.msg_linkPage,
        to: { type: "MAIN" },
        data: { page: "EHM_2312", title: "고분보 보기",
            param: [
            	{ name: "AUTH", value: "R" },
                { name: "issue_no", value: IssueNo }, { name: "rqst_no", value: RqstNo }
            ]
        }
    };
    gw_com_module.streamInterface(args);

}
//----------
function processDelete() {
}
//----------
function popupDetail(ui) {
    v_global.event.type = ui.type;
    v_global.event.object = ui.object;
    v_global.event.row = ui.row;
    v_global.event.element = ui.element;

    if (ui.object = "grdData_현황") {
        var LinkPage = "";
        var LinkID = gw_com_api.v_Stream.msg_infoECR;

        var LinkType = gw_com_api.getValue(ui.object, ui.row, "issue_tp", true);
        if (LinkType == "VOC") {
            LinkPage = "INFO_VOC";
            LinkID = gw_com_api.v_Stream.msg_infoECR;
        }
        else if (LinkType == "SPC") {
            LinkPage = "INFO_SPC";
            LinkID = gw_com_api.v_Stream.msg_infoECR;
        }
        else {
            LinkPage = "DLG_ISSUE";
            LinkID = gw_com_api.v_Stream.msg_infoAS;
        }

        var args = {
            type: "PAGE", page: LinkPage, title: "문제발생 상세 정보",
            width: 1100, height: 600, scroll: true, open: true, control: true, locate: ["center", "top"]
        };

        if (gw_com_module.dialoguePrepare(args) == false) {
            var args = { page: LinkPage,
                param: { ID: LinkID,
                    data: {
                        issue_no: gw_com_api.getValue(ui.object, ui.row, "issue_no", true),
                        voc_no: gw_com_api.getValue(ui.object, ui.row, "issue_no", true)
                    }
                }
            }
            gw_com_module.dialogueOpen(args);
        }
    }
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
				{ name: "ymd_fr", argument: "arg_ymd_fr" },
				{ name: "ymd_to", argument: "arg_ymd_to" },
				{ name: "dept_area", argument: "arg_dept_area" },
				{ name: "cust_cd", argument: "arg_cust_cd" },
				{ name: "cust_dept", argument: "arg_cust_dept" },
				{ name: "prod_nm", argument: "arg_prod_nm" },
                { name: "issue_tp", argument: "arg_issue_tp" },
                { name: "issue_no", argument: "arg_issue_no" },
                { name: "rqst_no", argument: "arg_rqst_no" },
                { name: "astat", argument: "arg_astat" }
			],
            remark: [
	            { infix: "~",  element: [ { name: "ymd_fr" }, { name: "ymd_to" } ] },
		        { element: [{ name: "dept_area" }] },
		        { element: [{ name: "issue_tp" }] },
		        { element: [{ name: "astat"}] },
		        { element: [{ name: "cust_cd"}] },
		        { element: [{ name: "cust_dept"}] },
                { element: [{ name: "prod_nm"}] }
		    ]
        },
        target: [
            { type: "GRID", id: "grdData_현황", focus: true, select: true }
	    ],
        clear: [
			{ type: "FORM", id: "frmData_발생정보" }, { type: "GRID", id: "grdData_발생내역" }
        ]
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {

    var args = { key: param.key,
        source: { type: "GRID", id: "grdData_현황", row: "selected", block: true,
            element: [
				{ name: "issue_no", argument: "arg_issue_no" }
			]
        },
        target: [
            { type: "FORM", id: "frmData_발생정보" },
            { type: "GRID", id: "grdData_발생내역", select: true }
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
                if (param.data.page != gw_com_api.getPageID()) {
                    param.to = { type: "POPUP", page: param.data.page };
                    gw_com_module.streamInterface(param);
                    break;
                }
                switch (param.data.ID) {
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
                var args = { targetid: "grdData_현황", row: v_global.event.row }
                gw_com_module.gridDelete(args);
            } break;
        case gw_com_api.v_Stream.msg_openedDialogue: {   
            	var args = { to: { type: "POPUP", page: param.from.page } };
                switch (param.from.page) {
                    case "INFO_VOC": {
                        args.ID = gw_com_api.v_Stream.msg_infoECR;
                    } break;
                    case "INFO_SPC": {
                        args.ID = gw_com_api.v_Stream.msg_infoECR;
                    } break;
                    case "DLG_ISSUE": {
                        args.ID = gw_com_api.v_Stream.msg_infoAS;
                    } break;
                }
                args.data = {
                    issue_no: gw_com_api.getValue(v_global.event.object, v_global.event.row, "issue_no", true),
                    voc_no: gw_com_api.getValue(v_global.event.object, v_global.event.row, "issue_no", true)
                }
                gw_com_module.streamInterface(args);
            } break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                closeDialogue({ page: param.from.page });
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//