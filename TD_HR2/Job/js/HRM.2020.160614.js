//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 연간급여내역
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
                },
				{
				    type: "PAGE", name: "회사", query: "DDDW_HRM_COMMON",
				    param: [{ argument: "arg_hcode", value: "S100" }]
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
                                name: "comp_id", label: { title: "회사 :" },
                                editable: { type: "select", data: { memory: "회사", unshift: [{ title: "전체", value: "%" }] } }
                            },
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
/*
        var args = {
            targetid: "grdList_PAY_EMP_YEAR", query: "HRM_2020_0", title: "계약연봉 변경이력",
            caption: true, height: 69, pager: false, show: true, selectable: true, number: true,
            element: [
                { header: "변경연월", name: "sal_ym", width: 60, align: "center", mask: "date-ym", title: "테스트" },
                { header: "부서", name: "dept_nm", width: 120, align: "center" },
                { header: "호칭", name: "pos_nm", width: 60, align: "center" },
                { header: "계약연봉", name: "sal_amt01", width: 70, align: "right", mask: "numeric-int" },
                { header: "(a)기본급+고정OT", name: "sal_amt02", width: 70, align: "right", mask: "numeric-int" },
                { header: "(b)비과세수당", name: "sal_amt03", width: 70, align: "right", mask: "numeric-int" },
                { header: "(c)과세수당", name: "sal_amt04", width: 70, align: "right", mask: "numeric-int" },
                { header: "월급여<br/>(a+b+c)", name: "sal_amt05", width: 70, align: "right", mask: "numeric-int" },
                { header: "총연봉<br/>(월급여*12)", name: "sal_amt06", width: 70, align: "right", mask: "numeric-int" }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        $("#grdList_PAY_EMP_YEAR_data_sal_ym").attr("title", "변경연월");
        $("#grdList_PAY_EMP_YEAR_data_dept_nm").attr("title", "부서");
        $("#grdList_PAY_EMP_YEAR_data_pos_nm").attr("title", "호칭");
        $("#grdList_PAY_EMP_YEAR_data_sal_amt01").attr("title", "(기본급 + 고정OT + 비과세수당) * 12 (연봉인상 기준금액)");
        $("#grdList_PAY_EMP_YEAR_data_sal_amt02").attr("title", "(a)기본급 + 고정OT");
        $("#grdList_PAY_EMP_YEAR_data_sal_amt03").attr("title", "보육수당, 연구보조금");
        $("#grdList_PAY_EMP_YEAR_data_sal_amt04").attr("title", "직책수당, CS수당, 기타수당");
        $("#grdList_PAY_EMP_YEAR_data_sal_amt05").attr("title", "월급여(a+b+c)");
        $("#grdList_PAY_EMP_YEAR_data_sal_amt06").attr("title", "계약연봉 + 과세수당");
*/
        //=====================================================================================
        var args = {
            targetid: "grdList_PAY_EMP_D1", query: "HRM_2020_1", title: "지급 내역",
            caption: true, height: 115, pager: false, show: true, selectable: true, number: true,
            element: [
                { header: "급여항목", name: "pay_nm", width: 80 },
                { header: "1월", name: "pay_amt01", width: 70, align: "right", mask: "numeric-int"},
                { header: "2월", name: "pay_amt02", width: 70, align: "right", mask: "numeric-int" },
                { header: "3월", name: "pay_amt03", width: 70, align: "right", mask: "numeric-int" },
                { header: "4월", name: "pay_amt04", width: 70, align: "right", mask: "numeric-int" },
                { header: "5월", name: "pay_amt05", width: 70, align: "right", mask: "numeric-int" },
                { header: "6월", name: "pay_amt06", width: 70, align: "right", mask: "numeric-int" },
                { header: "7월", name: "pay_amt07", width: 70, align: "right", mask: "numeric-int" },
                { header: "8월", name: "pay_amt08", width: 70, align: "right", mask: "numeric-int" },
                { header: "9월", name: "pay_amt09", width: 70, align: "right", mask: "numeric-int" },
                { header: "10월", name: "pay_amt10", width: 70, align: "right", mask: "numeric-int" },
                { header: "11월", name: "pay_amt11", width: 70, align: "right", mask: "numeric-int" },
                { header: "12월", name: "pay_amt12", width: 70, align: "right", mask: "numeric-int" },
                { header: "계", name: "tot_amt", width: 80, align: "right", mask: "numeric-int" }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_PAY_EMP_D2", query: "HRM_2020_2", title: "공제 내역",
            caption: true, height: 115, pager: false, show: true, selectable: true, number: true,
            element: [
                { header: "급여항목", name: "pay_nm", width: 80 },
                { header: "1월", name: "pay_amt01", width: 70, align: "right", mask: "numeric-int" },
                { header: "2월", name: "pay_amt02", width: 70, align: "right", mask: "numeric-int" },
                { header: "3월", name: "pay_amt03", width: 70, align: "right", mask: "numeric-int" },
                { header: "4월", name: "pay_amt04", width: 70, align: "right", mask: "numeric-int" },
                { header: "5월", name: "pay_amt05", width: 70, align: "right", mask: "numeric-int" },
                { header: "6월", name: "pay_amt06", width: 70, align: "right", mask: "numeric-int" },
                { header: "7월", name: "pay_amt07", width: 70, align: "right", mask: "numeric-int" },
                { header: "8월", name: "pay_amt08", width: 70, align: "right", mask: "numeric-int" },
                { header: "9월", name: "pay_amt09", width: 70, align: "right", mask: "numeric-int" },
                { header: "10월", name: "pay_amt10", width: 70, align: "right", mask: "numeric-int" },
                { header: "11월", name: "pay_amt11", width: 70, align: "right", mask: "numeric-int" },
                { header: "12월", name: "pay_amt12", width: 70, align: "right", mask: "numeric-int" },
                { header: "계", name: "tot_amt", width: 80, align: "right", mask: "numeric-int" }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_PAY_EMP", query: "HRM_2020_3", title: "이체내역",
            caption: true, height: "100%", pager: false, show: true, selectable: true, number: true,
            element: [
                { header: "계좌구분", name: "bank_nm", width: 130 },
                { header: "1월", name: "bank_amt01", width: 70, align: "right", mask: "numeric-int" },
                { header: "2월", name: "bank_amt02", width: 70, align: "right", mask: "numeric-int" },
                { header: "3월", name: "bank_amt03", width: 70, align: "right", mask: "numeric-int" },
                { header: "4월", name: "bank_amt04", width: 70, align: "right", mask: "numeric-int" },
                { header: "5월", name: "bank_amt05", width: 70, align: "right", mask: "numeric-int" },
                { header: "6월", name: "bank_amt06", width: 70, align: "right", mask: "numeric-int" },
                { header: "7월", name: "bank_amt07", width: 70, align: "right", mask: "numeric-int" },
                { header: "8월", name: "bank_amt08", width: 70, align: "right", mask: "numeric-int" },
                { header: "9월", name: "bank_amt09", width: 70, align: "right", mask: "numeric-int" },
                { header: "10월", name: "bank_amt10", width: 70, align: "right", mask: "numeric-int" },
                { header: "11월", name: "bank_amt11", width: 70, align: "right", mask: "numeric-int" },
                { header: "12월", name: "bank_amt12", width: 70, align: "right", mask: "numeric-int" },
                { header: "계", name: "bank_amt", width: 80, align: "right", mask: "numeric-int" }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);
        //=====================================================================================
        var args = {
            target: [
//                { type: "GRID", id: "grdList_PAY_EMP_YEAR", offset: 8 },
                { type: "GRID", id: "grdList_PAY_EMP_D1", offset: 8 },
                { type: "GRID", id: "grdList_PAY_EMP_D2", offset: 8 },
                { type: "GRID", id: "grdList_PAY_EMP", offset: 8 }
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

    var args = {
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
                { name: "comp_id", argument: "arg_comp_id" },
                { name: "emp_no", argument: "arg_emp_no" },
                { name: "pay_year", argument: "arg_pay_year" }
            ],
            remark: [
                { element: [{ name: "comp_id" }] },
                { element: [{ name: "pay_year" }] },
                //{ element: [{ name: "emp_no" }] },
                { element: [{ name: "emp_nm" }] }
            ]
        },
        target: [
//            { type: "GRID", id: "grdList_PAY_EMP_YEAR", select: true },
            { type: "GRID", id: "grdList_PAY_EMP_D1", select: true },
            { type: "GRID", id: "grdList_PAY_EMP_D2", select: true },
            { type: "GRID", id: "grdList_PAY_EMP", select: true }
        ],
        handler: {
            complete: processRetrieveEnd,
            param: param
        },
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {

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
                        if (param.data == undefined)
                            processClose({});
                        gw_com_api.setFocus("frmOption", 1, "pay_year");
                        break;
                }
                closeDialogue({ page: param.from.page });
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//