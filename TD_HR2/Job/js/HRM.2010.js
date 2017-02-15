//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 급여명세서
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
        var args = {
            request: [
                {
                    type: "INLINE", name: "증명구분",
                    data: [
                        { title: "A", value: "A" },
                        { title: "B", value: "B" },
                        { title: "C", value: "C" }
                    ]
                },
                {
                    type: "INLINE", name: "용도",
                    data: [
                        { title: "A", value: "A" },
                        { title: "B", value: "B" },
                        { title: "C", value: "C" }
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

            gw_com_api.setValue("frmOption", 1, "pay_year", gw_com_api.getYear());
            gw_com_api.setValue("frmOption", 1, "emp_no", gw_com_module.v_Session.EMP_NO);
            gw_com_api.setValue("frmOption", 1, "emp_nm", gw_com_module.v_Session.USR_NM);

            processAuth({});
        }
    },

    // manage UI. (design section)
    UI: function () {

        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "조회", value: "조회", act: true },
                { name: "닫기", value: "닫기" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true, remark: "lyrRemark2",
            editable: { focus: "supp_nm", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "pay_year", label: { title: "급여연도 :" },
                                editable: { type: "text", size: 10, maxlength: 4, validate: { rule: "required" } }
                            }
                        ]
                    },
                    {
                        element: [
			                { name: "실행", value: "실행", act: true, format: { type: "button" } },
			                { name: "취소", value: "취소", format: { type: "button", icon: "닫기" } },
                            { name: "emp_no", label: { title: "사원번호 :" }, editable: { type: "text" }, hidden: true }, 
                            { name: "emp_nm", label: { title: "사원명 :" }, editable: { type: "text" }, hidden: true }
                        ], align: "right"
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_PAY_EMP", query: "HRM_2010_1", title: "월별 급여 지급 내역",
            caption: true, height: 130, pager: false, show: true, selectable: true, number: true,
            element: [
                { header: "급여연월", name: "pay_ym", width: 80, align: "center", mask: "date-ym" },
				{ header: "구분", name: "pay_tp_nm", width: 100, align: "center" },
				{ header: "지급총액", name: "paytot_amt", width: 100, align: "right", mask: "numeric-int" },
				{ header: "공제총액", name: "ducttot_amt", width: 100, align: "right", mask: "numeric-int" },
				{ header: "실수령액", name: "tot_amt", width: 100, align: "right", mask: "numeric-int" },
				{ header: "지급일", name: "iche_date", width: 80, align: "center", mask: "date-ymd" },
				//{ header: "부서", name: "dept_nm", width: 150, align: "center" },
				//{ header: "호칭", name: "pos_nm", width: 60, align: "center" },
				//{ header: "직급", name: "grade_nm", width: 60, align: "center" },
                { header: "비고", name: "rmk", width: 270 },
                { name: "ofc_cd", hidden: true },
                { name: "pay_seq", hidden: true },
				{ name: "emp_no", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_PAY_EMP_D", query: "HRM_2010_2", show: false,
            element: [
                { name: "pay_cd001_nm" },
                { name: "pay_cd002_nm" },
                { name: "pay_cd003_nm" },
                { name: "pay_cd004_nm" },
                { name: "pay_cd005_nm" },
                { name: "pay_cd006_nm" },
                { name: "pay_cd007_nm" },
                { name: "pay_cd008_nm" },
                { name: "pay_cd009_nm" },
                { name: "pay_cd010_nm" },
                { name: "pay_cd011_nm" },
                { name: "pay_cd012_nm" },
                { name: "pay_cd013_nm" },
                { name: "pay_cd014_nm" },
                { name: "pay_cd015_nm" },
                { name: "pay_cd016_nm" },
                { name: "pay_cd017_nm" },
                { name: "pay_cd018_nm" },
                { name: "pay_amt001" },
                { name: "pay_amt002" },
                { name: "pay_amt003" },
                { name: "pay_amt004" },
                { name: "pay_amt005" },
                { name: "pay_amt006" },
                { name: "pay_amt007" },
                { name: "pay_amt008" },
                { name: "pay_amt009" },
                { name: "pay_amt010" },
                { name: "pay_amt011" },
                { name: "pay_amt012" },
                { name: "pay_amt013" },
                { name: "pay_amt014" },
                { name: "pay_amt015" },
                { name: "pay_amt016" },
                { name: "pay_amt017" },
                { name: "pay_amt018" },
                { name: "paytot_amt" },
                { name: "pay_cd101_nm" },
                { name: "pay_cd102_nm" },
                { name: "pay_cd103_nm" },
                { name: "pay_cd104_nm" },
                { name: "pay_cd105_nm" },
                { name: "pay_cd106_nm" },
                { name: "pay_cd107_nm" },
                { name: "pay_cd108_nm" },
                { name: "pay_cd109_nm" },
                { name: "pay_cd110_nm" },
                { name: "pay_cd111_nm" },
                { name: "pay_cd112_nm" },
                { name: "pay_cd113_nm" },
                { name: "pay_cd114_nm" },
                { name: "pay_cd115_nm" },
                { name: "pay_cd116_nm" },
                { name: "pay_cd117_nm" },
                { name: "pay_cd118_nm" },
                { name: "pay_amt101" },
                { name: "pay_amt102" },
                { name: "pay_amt103" },
                { name: "pay_amt104" },
                { name: "pay_amt105" },
                { name: "pay_amt106" },
                { name: "pay_amt107" },
                { name: "pay_amt108" },
                { name: "pay_amt109" },
                { name: "pay_amt110" },
                { name: "pay_amt111" },
                { name: "pay_amt112" },
                { name: "pay_amt113" },
                { name: "pay_amt114" },
                { name: "pay_amt115" },
                { name: "pay_amt116" },
                { name: "pay_amt117" },
                { name: "pay_amt118" },
                { name: "ducttot_amt" }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_PAY_EMP_D1", query: "HRM_2010_2", type: "TABLE", title: "지급내역",
            show: true, selectable: true, fixed: true, caption: true,
            content: {
                width: { label: 55, field: 45 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, name: "lbl_pay_cd001_nm", value: "", format: { type: "label" } },
                            { name: "pay_amt001", format: { type: "text", width: 200 }, align: "right", mask: "numeric-int" },
                            { header: true, name: "lbl_pay_cd002_nm", value: "", format: { type: "label" } },
                            { name: "pay_amt002", format: { type: "text", width: 200 }, align: "right", mask: "numeric-int" },
                            { header: true, name: "lbl_pay_cd003_nm", value: "", format: { type: "label" } },
                            { name: "pay_amt003", format: { type: "text", width: 200 }, align: "right", mask: "numeric-int" }
                        ]
                    },
                    {
                        element: [
                            { header: true, name: "lbl_pay_cd004_nm", value: "", format: { type: "label" } },
                            { name: "pay_amt004", format: { type: "text", width: 200 }, align: "right", mask: "numeric-int" },
                            { header: true, name: "lbl_pay_cd005_nm", value: "", format: { type: "label" } },
                            { name: "pay_amt005", format: { type: "text", width: 200 }, align: "right", mask: "numeric-int" },
                            { header: true, name: "lbl_pay_cd006_nm", value: "", format: { type: "label" } },
                            { name: "pay_amt006", format: { type: "text", width: 200 }, align: "right", mask: "numeric-int" }
                        ]
                    },
                    {
                        element: [
                            { header: true, name: "lbl_pay_cd007_nm", value: "", format: { type: "label" } },
                            { name: "pay_amt007", format: { type: "text", width: 200 }, align: "right", mask: "numeric-int" },
                            { header: true, name: "lbl_pay_cd008_nm", value: "", format: { type: "label" } },
                            { name: "pay_amt008", format: { type: "text", width: 200 }, align: "right", mask: "numeric-int" },
                            { header: true, name: "lbl_pay_cd009_nm", value: "", format: { type: "label" } },
                            { name: "pay_amt009", format: { type: "text", width: 200 }, align: "right", mask: "numeric-int" }
                        ]
                    },
                    {
                        element: [
                            { header: true, name: "lbl_pay_cd010_nm", value: "", format: { type: "label" } },
                            { name: "pay_amt010", format: { type: "text", width: 200 }, align: "right", mask: "numeric-int" },
                            { header: true, name: "lbl_pay_cd011_nm", value: "", format: { type: "label" } },
                            { name: "pay_amt011", format: { type: "text", width: 200 }, align: "right", mask: "numeric-int" },
                            { header: true, name: "lbl_pay_cd012_nm", value: "", format: { type: "label" } },
                            { name: "pay_amt012", format: { type: "text", width: 200 }, align: "right", mask: "numeric-int" }
                        ]
                    },
                    {
                        element: [
                            { header: true, name: "lbl_pay_cd013_nm", value: "", format: { type: "label" } },
                            { name: "pay_amt013", format: { type: "text", width: 200 }, align: "right", mask: "numeric-int" },
                            { header: true, name: "lbl_pay_cd014_nm", value: "", format: { type: "label" } },
                            { name: "pay_amt014", format: { type: "text", width: 200 }, align: "right", mask: "numeric-int" },
                            { header: true, name: "lbl_pay_cd015_nm", value: "", format: { type: "label" } },
                            { name: "pay_amt015", format: { type: "text", width: 200 }, align: "right", mask: "numeric-int" }
                        ]
                    },
                    {
                        element: [
                            { header: true, name: "lbl_pay_cd016_nm", value: "", format: { type: "label" } },
                            { name: "pay_amt016", format: { type: "text", width: 200 }, align: "right", mask: "numeric-int" },
                            { header: true, name: "lbl_pay_cd017_nm", value: "", format: { type: "label" } },
                            { name: "pay_amt017", format: { type: "text", width: 200 }, align: "right", mask: "numeric-int" },
                            { header: true, name: "lbl_pay_cd018_nm", value: "", format: { type: "label" } },
                            { name: "pay_amt018", format: { type: "text", width: 200 }, align: "right", mask: "numeric-int" }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_PAY_EMP_D2", query: "HRM_2010_2", type: "TABLE", title: "공제내역",
            show: true, selectable: true, fixed: true, caption: true,
            content: {
                width: { label: 55, field: 45 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, name: "lbl_pay_cd101_nm", value: "", format: { type: "label" } },
                            { name: "pay_amt101", format: { type: "text", width: 200 }, align: "right", mask: "numeric-int" },
                            { header: true, name: "lbl_pay_cd102_nm", value: "", format: { type: "label" } },
                            { name: "pay_amt102", format: { type: "text", width: 200 }, align: "right", mask: "numeric-int" },
                            { header: true, name: "lbl_pay_cd103_nm", value: "", format: { type: "label" } },
                            { name: "pay_amt103", format: { type: "text", width: 200 }, align: "right", mask: "numeric-int" }
                        ]
                    },
                    {
                        element: [
                            { header: true, name: "lbl_pay_cd104_nm", value: "", format: { type: "label" } },
                            { name: "pay_amt104", format: { type: "text", width: 200 }, align: "right", mask: "numeric-int" },
                            { header: true, name: "lbl_pay_cd105_nm", value: "", format: { type: "label" } },
                            { name: "pay_amt105", format: { type: "text", width: 200 }, align: "right", mask: "numeric-int" },
                            { header: true, name: "lbl_pay_cd106_nm", value: "", format: { type: "label" } },
                            { name: "pay_amt106", format: { type: "text", width: 200 }, align: "right", mask: "numeric-int" }
                        ]
                    },
                    {
                        element: [
                            { header: true, name: "lbl_pay_cd107_nm", value: "", format: { type: "label" } },
                            { name: "pay_amt107", format: { type: "text", width: 200 }, align: "right", mask: "numeric-int" },
                            { header: true, name: "lbl_pay_cd108_nm", value: "", format: { type: "label" } },
                            { name: "pay_amt108", format: { type: "text", width: 200 }, align: "right", mask: "numeric-int" },
                            { header: true, name: "lbl_pay_cd109_nm", value: "", format: { type: "label" } },
                            { name: "pay_amt109", format: { type: "text", width: 200 }, align: "right", mask: "numeric-int" }
                        ]
                    },
                    {
                        element: [
                            { header: true, name: "lbl_pay_cd110_nm", value: "", format: { type: "label" } },
                            { name: "pay_amt110", format: { type: "text", width: 200 }, align: "right", mask: "numeric-int" },
                            { header: true, name: "lbl_pay_cd111_nm", value: "", format: { type: "label" } },
                            { name: "pay_amt111", format: { type: "text", width: 200 }, align: "right", mask: "numeric-int" },
                            { header: true, name: "lbl_pay_cd112_nm", value: "", format: { type: "label" } },
                            { name: "pay_amt112", format: { type: "text", width: 200 }, align: "right", mask: "numeric-int" }
                        ]
                    },
                    {
                        element: [
                            { header: true, name: "lbl_pay_cd113_nm", value: "", format: { type: "label" } },
                            { name: "pay_amt113", format: { type: "text", width: 200 }, align: "right", mask: "numeric-int" },
                            { header: true, name: "lbl_pay_cd114_nm", value: "", format: { type: "label" } },
                            { name: "pay_amt114", format: { type: "text", width: 200 }, align: "right", mask: "numeric-int" },
                            { header: true, name: "lbl_pay_cd115_nm", value: "", format: { type: "label" } },
                            { name: "pay_amt115", format: { type: "text", width: 200 }, align: "right", mask: "numeric-int" }
                        ]
                    },
                    {
                        element: [
                            { header: true, name: "lbl_pay_cd116_nm", value: "", format: { type: "label" } },
                            { name: "pay_amt116", format: { type: "text", width: 200 }, align: "right", mask: "numeric-int" },
                            { header: true, name: "lbl_pay_cd117_nm", value: "", format: { type: "label" } },
                            { name: "pay_amt117", format: { type: "text", width: 200 }, align: "right", mask: "numeric-int" },
                            { header: true, name: "lbl_pay_cd118_nm", value: "", format: { type: "label" } },
                            { name: "pay_amt118", format: { type: "text", width: 200 }, align: "right", mask: "numeric-int" }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_PAY_MAST", query: "HRM_2010_3", type: "TABLE", title: "알림사항",
            show: true, selectable: true, fixed: true, caption: true,
            content: {
                height: 120, width: { field: "100%" },
                row: [
                    {
                        element: [
                            { name: "pay_notice", format: { type: "textarea", rows: 10, width: 1150 } }
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
                { type: "GRID", id: "grdList_PAY_EMP", offset: 8 },
                { type: "FORM", id: "frmData_PAY_EMP_D1", offset: 8 },
                { type: "FORM", id: "frmData_PAY_EMP_D2", offset: 8 },
				{ type: "FORM", id: "frmData_PAY_MAST", offset: 8 }
			]
        };
        gw_com_module.objResize(args);
        //=====================================================================================
        gw_com_module.informSize();

    },

    // manage process. (program section)
    procedure: function () {

        //=====================================================================================
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: viewOption };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: closeOption };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdList_PAY_EMP", grid: true, event: "rowselected", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //=====================================================================================

    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function viewOption(param) {

    gw_com_api.show("frmOption");

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

}
//----------
function processButton(param) {

    closeOption({});
    switch (param.element) {
        case "조회":
            processRetrieve({});
            break;
        case "닫기":
            processClose({});
            break;
    }

}
//----------
function processRetrieve(param) {

    var args = { target: [{ type: "FORM", id: "frmOption" }] };
    if (!gw_com_module.objValidate(args)) return;

    var args;
    if (param.object == "grdList_PAY_EMP") {
        args = {
            source: {
                type: param.type, id: param.object, row: "selected",
                element: [
                    { name: "ofc_cd", argument: "arg_ofc_cd" },
                    { name: "pay_ym", argument: "arg_pay_ym" },
                    { name: "pay_seq", argument: "arg_pay_seq" },
                    { name: "emp_no", argument: "arg_emp_no" }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_PAY_EMP_D" },
                { type: "FORM", id: "frmData_PAY_MAST", clear: true }
            ],
            clear: [
                { type: "FORM", id: "frmData_PAY_EMP_D1" },
                { type: "FORM", id: "frmData_PAY_EMP_D2" }
            ],
            handler: {
                complete: processRetrieveEnd,
                param: param
            },
            key: param.key
        };
    } else {
        args = {
            source: {
                type: "FORM", id: "frmOption", hide: true,
                element: [
                    { name: "emp_no", argument: "arg_emp_no" },
                    { name: "pay_year", argument: "arg_pay_year" }
                ],
                remark: [
                    { element: [{ name: "pay_year" }] },
                    //{ element: [{ name: "emp_no" }] },
                    { element: [{ name: "emp_nm" }] }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_PAY_EMP", select: true }
            ],
            clear: [
                { type: "GRID", id: "grdList_PAY_EMP_D" },
                { type: "FORM", id: "frmData_PAY_EMP_D1" },
                { type: "FORM", id: "frmData_PAY_EMP_D2" },
                { type: "FORM", id: "frmData_PAY_MAST" }
            ],
            key: param.key
        };
    }
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {
    
    // 급여항목명
    if (gw_com_api.getRowCount("grdList_PAY_EMP_D") > 0) {
        for (var i = 1; i <= 18; i++) {
            var obj_nm1 = "pay_cd0" + ("00" + i).substring(("00" + i).length, ("00" + i).length - 2) + "_nm";
            var obj_nm2 = "pay_cd1" + ("00" + i).substring(("00" + i).length, ("00" + i).length - 2) + "_nm";
            var label1 = gw_com_api.getValue("grdList_PAY_EMP_D", 1, obj_nm1, true);
            var label2 = gw_com_api.getValue("grdList_PAY_EMP_D", 1, obj_nm2, true);

            var obj_amt1 = "pay_amt0" + ("00" + i).substring(("00" + i).length, ("00" + i).length - 2);
            var obj_amt2 = "pay_amt1" + ("00" + i).substring(("00" + i).length, ("00" + i).length - 2);
            var amt1 = gw_com_api.Mask(gw_com_api.getValue("grdList_PAY_EMP_D", 1, obj_amt1, true), "numeric-int");
            var amt2 = gw_com_api.Mask(gw_com_api.getValue("grdList_PAY_EMP_D", 1, obj_amt2, true), "numeric-int");

            $("#frmData_PAY_EMP_D1_lbl_" + obj_nm1).text(label1);
            $("#frmData_PAY_EMP_D2_lbl_" + obj_nm2).text(label2);
            $("input[name='" + obj_amt1 + "']").val(amt1 == "0" ? "" : amt1);
            $("input[name='" + obj_amt2 + "']").val(amt2 == "0" ? "" : amt2);
        }
        //gw_com_api.setValue("frmData_PAY_EMP_D1", 1, "paytot_amt", gw_com_api.getValue("grdList_PAY_EMP_D", 1, "paytot_amt", true));
        //gw_com_api.setValue("frmData_PAY_EMP_D2", 1, "ducttot_amt", gw_com_api.getValue("grdList_PAY_EMP_D", 1, "ducttot_amt", true));
    }

}
//----------
function processClose(param) {

    if (parent && parent != this) {
        var args = { ID: gw_com_api.v_Stream.msg_closePage };
        gw_com_module.streamInterface(args);
    } else {
        window.close();
    }

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
function processAuth(param) {

    // 주민번호 인증
    var args = {
        type: "PAGE", page: "DLG_ZUSER_PASSWD_CHK", title: "본인인증",
        width: 280, height: 160, locate: ["center", "center"], open: true,
    };
    if (gw_com_module.dialoguePrepare(args) == false) {
        args = {
            page: args.page,
            param: {
                ID: gw_com_api.v_Stream.msg_openedDialogue
            }
        };
        gw_com_module.dialogueOpen(args);
    }

}
//----------
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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
                    case gw_com_api.v_Message.msg_confirmSave:
                        {
                            if (param.data.result == "YES") {
                                processSave(param.data.arg);
                            } else {
                                if (v_global.process.handler != null)
                                    v_global.process.handler(param.data.arg);
                            }
                        } break;
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
                }
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = {
                    to: { type: "POPUP", page: param.from.page },
                    ID: param.ID
                };
                switch (param.from.page) {
                    case "DLG_FileUpload":
                        args.data = {
                            type: "PER_SUPP",
                            key: v_global.logic.per_no,
                            seq: v_global.logic.supp_seq
                        };
                        break;
                    case "DLG_ZUSER_PASSWD_CHK":
                        break;

                }
                gw_com_module.streamInterface(args);
            } break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                switch (param.from.page) {
                    case "DLG_FileUpload":
                        if (param.data != undefined)
                            processRetrieve({});
                        break;
                    case "DLG_ZUSER_PASSWD_CHK":
                        if (param.data == undefined) {
                            processClose({});
                            return;
                        }
                        break;
                }
                closeDialogue({ page: param.from.page });
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//