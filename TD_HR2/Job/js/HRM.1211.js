//------------------------------------------
// Process about Job Process.
//                Created by Professor.X, GoodWare (2011.04)
//------------------------------------------

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
    data: null, logic: {}
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// process.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var gw_job_process = {

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // entry point. (pre-process section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //#region
    ready: function () {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // initialize page.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        v_global.process.param = gw_com_module.initPage({ message: true });
        //----------
        gw_com_api.changeTheme("style_theme");

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set data.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        var args = {
            request: [
                {
                    type: "PAGE", name: "교육구분",
                    query: "DDDW_HRM_COMMON",
                    param: [{ argument: "arg_hcode", value: "A301" }]
                },
                {
                    type: "PAGE", name: "필수구분",
                    query: "DDDW_HRM_COMMON",
                    param: [{ argument: "arg_hcode", value: "A302" }]
                },
                {
                    type: "PAGE", name: "분야",
                    query: "DDDW_HRM_COMMON",
                    param: [{ argument: "arg_hcode", value: "A303" }]
                },
                {
                    type: "PAGE", name: "교육결과",
                    query: "DDDW_HRM_COMMON",
                    param: [{ argument: "arg_hcode", value: "A304" }]
                },
                {
                    type: "PAGE", name: "진행단계",
                    query: "DDDW_HRM_COMMON",
                    param: [{ argument: "arg_hcode", value: "A305" }]
                }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);
        //----------

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // go next.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function start() {

            gw_job_process.UI();

            gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -3 }));
            gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate("", { month: 3 }));

        }

    },
    //#endregion

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage UI. (design section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //#region
    UI: function () {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // define UI.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "조회", value: "조회", act: true },
				{ name: "확인", value: "확인", icon: "저장" },
				{ name: "닫기", value: "닫기" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true, remark: "lyrRemark2",
            editable: { focus: "ymd_fr", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "edu_nm", label: { title: "교육과정 :" },
                                editable: { type: "text", size: 16 }
                            }
                        ]
                    },
                    {
                        element: [
				            {
				                name: "ymd_fr", label: { title: "기간 :" }, mask: "date-ymd",
				                editable: { type: "text", size: 7, maxlength: 10, validate: { rule: "dateISO" } }, style: { colfloat: "floating" }
				            },
				            {
				                name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
				                editable: { type: "text", size: 7, maxlength: 10, validate: { rule: "dateISO" } }
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
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_MAIN", query: "HRM_1211_1", title: "교육과정",
            height: 310, show: true, number: true, dynamic: true, key: true,
            editable: { multi: true, bind: "_edit_yn", focus: "edu_nm", validate: true },
            element: [
				{
				    header: "교육과정", name: "edu_nm", width: 150,
				    editable: { type: "text", maxlength: 40, width: 164, validate: { rule: "required" } }
				},
                {
                    header: "시작일", name: "edus_date", width: 90, align: "center", mask: "date-ymd",
                    editable: { type: "text", maxlength: 10, width: 96, validate: { rule: "dateISO" } }
                },
                {
                    header: "종료일", name: "edue_date", width: 90, align: "center", mask: "date-ymd",
                    editable: { type: "text", maxlength: 10, width: 96, validate: { rule: "dateISO" } }
                },
				{
				    header: "교육구분", name: "edu_tp", width: 60, align: "center",
				    format: { type: "select", data: { memory: "교육구분", unshift: [{ title: "-", value: "" }] } },
				    editable: { type: "select", data: { memory: "교육구분", unshift: [{ title: "-", value: "" }] }, validate: { rule: "required" }, width: 66 }
				},
				{
				    header: "분야", name: "edu_div", width: 60, align: "center",
				    format: { type: "select", data: { memory: "분야", unshift: [{ title: "-", value: "" }] } },
				    editable: { type: "select", data: { memory: "분야", unshift: [{ title: "-", value: "" }] }, validate: { rule: "required" }, width: 66 }
				},
				{
				    header: "필수", name: "ess_yn", width: 50, align: "center",
				    format: { type: "select", data: { memory: "필수구분", unshift: [{ title: "-", value: "" }] } },
				    editable: { type: "select", data: { memory: "필수구분", unshift: [{ title: "-", value: "" }] }, validate: { rule: "required" }, width: 56 }
				},
				{
				    header: "교육기관", name: "institute_nm", width: 80,
				    editable: { type: "text", maxlength: 25, width: 90 }
				},
				{
				    header: "교육장소", name: "edu_place", width: 100,
				    editable: { type: "text", maxlength: 25, width: 110 }
				},
				{
				    header: "교육비", name: "edu_amt", width: 60, align: "right", mask: "numeric-int",
				    editable: { type: "text", maxlength: 20, width: 68 }
				},
				{
				    header: "면세", name: "notax_yn", width: 50, align: "center",
				    format: { type: "checkbox", title: "", value: "1", offval: "0" },
				    editable: { type: "checkbox", title: "", value: "1", offval: "0" }
				},
				{
				    header: "환급", name: "ins_yn", width: 50, align: "center",
				    format: { type: "checkbox", title: "", value: "1", offval: "0" },
				    editable: { type: "checkbox", title: "", value: "1", offval: "0" }
				},
				{
				    header: "환급액", name: "ins_amt", width: 60, align: "right", mask: "numeric-int",
				    editable: { type: "text", maxlength: 20, width: 68 }
				},
                { name: "edu_cd", hidden: true },
                { name: "edu_time", hidden: true },
                { name: "edu_purpose", hidden: true },
                { name: "edu_contents", hidden: true },
                { name: "certificate_yn", hidden: true },
                { name: "certificate_nm", hidden: true },
                { name: "edu_amt1", hidden: true },
                { name: "edu_amt2", hidden: true },
                { name: "edu_amt3", hidden: true },
                { name: "ins_rate", hidden: true },
                { name: "_edit_yn", hidden: true }
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
        //----------
        gw_com_module.informSize();

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // go next.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        gw_job_process.procedure();

    },
    //#endregion

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage process. (program section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //#region
    procedure: function () {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // define event.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: viewOption };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "확인", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: closeOption };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_MAIN", grid: true, event: "rowdblclick", handler: processRowdblclick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_MAIN", grid: true, event: "rowkeyenter", handler: processRowkeyenter };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        function processButton(param) {
            switch (param.element) {
                case "확인":
                    informResult({});
                    break;
                case "닫기":
                    processClose({});
                    break;
                case "실행":
                    processRetrieve({});
                    break;
            }
        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_module.startPage();
        //----------
        var args = {
            ID: gw_com_api.v_Stream.msg_openedDialogue
        };
        gw_com_module.streamInterface(args);

    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function viewOption(param) {

    gw_com_api.show("frmOption");

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

}
//----------
function processRowdblclick(param) {

    if (param.object == "grdList_MAIN") {
        if (gw_com_api.getValue(param.object, param.row, "edu_cd", true) == "EDU9999999") {
            return true;
        } else {
            informResult({});
        }
    }

}
//----------
function processRowkeyenter(param) {

    if (param.object == "grdList_MAIN") {
        if (gw_com_api.getValue(param.object, param.row, "edu_cd", true) == "EDU9999999") {
            return true;
        } else {
            informResult({});
        }
    }

}
//----------
processRetrieve = function (param) {

    var args = {
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
				{ name: "edu_nm", argument: "arg_edu_nm" },
                { name: "ymd_fr", argument: "arg_ymd_fr" },
                { name: "ymd_to", argument: "arg_ymd_to" }
            ],
            remark: [
                { element: [{ name: "edu_nm" }] },
                { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }] }
            ]
        },
        target: [
			{ type: "GRID", id: "grdList_MAIN", focus: true, select: true }
		],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

    gw_com_api.show("lyrRmk");

};
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closeDialogue,
        data: param.data
    };
    gw_com_module.streamInterface(args);

}
//----------
function informResult() {

    if (gw_com_api.getSelectedRow("grdList_MAIN") < 1) return;
    if (gw_com_api.getValue("grdList_MAIN", "selected", "edu_cd", true) == "EDU9999999") {
        var args = {
            target: [{ type: "GRID", id: "grdList_MAIN" }]
        };
        if (gw_com_module.objValidate(args) == false) return false;
    }

    var data = {
        edu_cd: gw_com_api.getValue("grdList_MAIN", "selected", "edu_cd", true),
        edu_nm: gw_com_api.getValue("grdList_MAIN", "selected", "edu_nm", true),
        edus_date: gw_com_api.getValue("grdList_MAIN", "selected", "edus_date", true),
        edue_date: gw_com_api.getValue("grdList_MAIN", "selected", "edue_date", true),
        edu_time: gw_com_api.getValue("grdList_MAIN", "selected", "edu_time", true),
        edu_tp: gw_com_api.getValue("grdList_MAIN", "selected", "edu_tp", true),
        edu_tp_nm: gw_com_api.getText("grdList_MAIN", "selected", "edu_tp_nm", true),
        ess_yn: gw_com_api.getValue("grdList_MAIN", "selected", "ess_yn", true),
        ess_yn_nm: gw_com_api.getText("grdList_MAIN", "selected", "ess_yn_nm", true),
        edu_div: gw_com_api.getValue("grdList_MAIN", "selected", "edu_div", true),
        edu_div_nm: gw_com_api.getText("grdList_MAIN", "selected", "edu_div_nm", true),
        institute_nm: gw_com_api.getValue("grdList_MAIN", "selected", "institute_nm", true),
        edu_place: gw_com_api.getValue("grdList_MAIN", "selected", "edu_place", true),
        edu_purpose: gw_com_api.getValue("grdList_MAIN", "selected", "edu_purpose", true),
        edu_contents: gw_com_api.getValue("grdList_MAIN", "selected", "edu_contents", true),
        certificate_yn: gw_com_api.getValue("grdList_MAIN", "selected", "certificate_yn", true),
        certificate_nm: gw_com_api.getValue("grdList_MAIN", "selected", "certificate_nm", true),
        edu_amt: gw_com_api.getValue("grdList_MAIN", "selected", "edu_amt", true),
        edu_amt1: gw_com_api.getValue("grdList_MAIN", "selected", "edu_amt1", true),
        edu_amt2: gw_com_api.getValue("grdList_MAIN", "selected", "edu_amt2", true),
        edu_amt3: gw_com_api.getValue("grdList_MAIN", "selected", "edu_amt3", true),
        notax_yn: gw_com_api.getValue("grdList_MAIN", "selected", "notax_yn", true),
        ins_yn: gw_com_api.getValue("grdList_MAIN", "selected", "ins_yn", true),
        ins_rate: gw_com_api.getValue("grdList_MAIN", "selected", "ins_rate", true),
        ins_amt: gw_com_api.getValue("grdList_MAIN", "selected", "ins_amt", true)
    }
    processClose({ data: data });

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                gw_com_api.setFocus("frmOption", 1, "proj_no");
            }
            break;
        case gw_com_api.v_Stream.msg_resultMessage:
            {
                if (param.data.page != gw_com_api.getPageID())
                    break;
            }
            break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//