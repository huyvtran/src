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

        //----------
        start();

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // go next.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function start() {

            gw_job_process.UI();

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
				//{ name: "조회", value: "조회", act: true },
				{ name: "저장", value: "확인" },
				{ name: "닫기", value: "닫기" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE",
            trans: true, border: true, show: false, remark: "lyrRemark2",
            editable: { bind: "open", focus: "emp_no", validate: true },
            content: {
                row: [
                    {
                        element: [
				            {
				            	name: "emp_no", label: { title: "사원번호 :" },
				                editable: { type: "text", size: 12, maxlength: 20 }
				            },
				            {
				                name: "emp_nm", label: { title: "사원명 :" },
				                editable: { type: "text", size: 12, maxlength: 50 }
				            },
				            {
				                name: "taxadj_year", label: { title: "귀속연도 :" },
				                editable: { type: "text", size: 12, maxlength: 50 }
				            },
				            { name: "실행", act: true, show: false, format: { type: "button" } }
				        ]
                    }
				]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        //var args = {
        //    targetid: "frmData_MAIN", query: "HRM_2030_2", type: "TABLE", title: "비과세소득",
        //    caption: false, show: true, selectable: true,
        //    editable: { bind: "open", focus: "amt7", validate: true },
        //    content: {
        //        width: { label: 50, field: 50 }, height: 30,
        //        row: [
        //            {
        //                element: [
        //                    { header: true, value: "비과세학자금", format: { type: "label" } },
        //                    { name: "amt7", editable: { type: "text", maxlength: 10, width: 98 }, align: "right", mask: "numeric-int" },
        //                    { header: true, value: "무보수위원수당", format: { type: "label" } },
        //                    { name: "amt8", editable: { type: "text", maxlength: 10, width: 98 }, align: "right", mask: "numeric-int" },
        //                    { header: true, value: "경호ㆍ승선수당", format: { type: "label" } },
        //                    { name: "amt9", editable: { type: "text", maxlength: 10, width: 98 }, align: "right", mask: "numeric-int" },
        //                    { header: true, value: "유아ㆍ초중등", format: { type: "label" } },
        //                    { name: "amt10", editable: { type: "text", maxlength: 10, width: 98 }, align: "right", mask: "numeric-int" }
        //                ]
        //            },
        //            {
        //                element: [
        //                    { header: true, value: "고등교육법", format: { type: "label" } },
        //                    { name: "amt11", editable: { type: "text", maxlength: 10, width: 98 }, align: "right", mask: "numeric-int" },
        //                    { header: true, value: "특별법", format: { type: "label" } },
        //                    { name: "amt12", editable: { type: "text", maxlength: 10, width: 98 }, align: "right", mask: "numeric-int" },
        //                    { header: true, value: "연구기관 등", format: { type: "label" } },
        //                    { name: "amt13", editable: { type: "text", maxlength: 10, width: 98 }, align: "right", mask: "numeric-int" },
        //                    { header: true, value: "기업연구소", format: { type: "label" } },
        //                    { name: "amt14", editable: { type: "text", maxlength: 10, width: 98 }, align: "right", mask: "numeric-int" }
        //                ]
        //            },
        //            {
        //                element: [
        //                    { header: true, value: "취재수당", format: { type: "label" } },
        //                    { name: "amt15", editable: { type: "text", maxlength: 10, width: 98 }, align: "right", mask: "numeric-int" },
        //                    { header: true, value: "벽지수당", format: { type: "label" } },
        //                    { name: "amt16", editable: { type: "text", maxlength: 10, width: 98 }, align: "right", mask: "numeric-int" },
        //                    { header: true, value: "재해관련급여", format: { type: "label" } },
        //                    { name: "amt17", editable: { type: "text", maxlength: 10, width: 98 }, align: "right", mask: "numeric-int" },
        //                    { header: true, value: "외국정부등근무자", format: { type: "label" } },
        //                    { name: "amt18", editable: { type: "text", maxlength: 10, width: 98 }, align: "right", mask: "numeric-int" }
        //                ]
        //            },
        //            {
        //                element: [
        //                    { header: true, value: "외국주둔군인등", format: { type: "label" } },
        //                    { name: "amt19", editable: { type: "text", maxlength: 10, width: 98 }, align: "right", mask: "numeric-int" },
        //                    { header: true, value: "국외근로100만원", format: { type: "label" } },
        //                    { name: "amt20", editable: { type: "text", maxlength: 10, width: 98 }, align: "right", mask: "numeric-int" },
        //                    { header: true, value: "국외근로150만원", format: { type: "label" } },
        //                    { name: "amt21", editable: { type: "text", maxlength: 10, width: 98 }, align: "right", mask: "numeric-int" },
        //                    { header: true, value: "국외근로", format: { type: "label" } },
        //                    { name: "amt22", editable: { type: "text", maxlength: 10, width: 98 }, align: "right", mask: "numeric-int" }
        //                ]
        //            },
        //            {
        //                element: [
        //                    { header: true, value: "야간근로수당", format: { type: "label" } },
        //                    { name: "amt23", editable: { type: "text", maxlength: 10, width: 98 }, align: "right", mask: "numeric-int" },
        //                    { header: true, value: "출산보육수당", format: { type: "label" } },
        //                    { name: "amt24", editable: { type: "text", maxlength: 10, width: 98 }, align: "right", mask: "numeric-int" },
        //                    { header: true, value: "주식매수선택권", format: { type: "label" } },
        //                    { name: "amt25", editable: { type: "text", maxlength: 10, width: 98 }, align: "right", mask: "numeric-int" },
        //                    { header: true, value: "외국인기술자", format: { type: "label" } },
        //                    { name: "amt26", editable: { type: "text", maxlength: 10, width: 98 }, align: "right", mask: "numeric-int" }
        //                ]
        //            },
        //            {
        //                element: [
        //                    { header: true, value: "외국인근로자", format: { type: "label" } },
        //                    { name: "amt27", editable: { type: "text", maxlength: 10, width: 98 }, align: "right", mask: "numeric-int" },
        //                    { header: true, value: "우리사주조합배정", format: { type: "label" } },
        //                    { name: "amt28", editable: { type: "text", maxlength: 10, width: 98 }, align: "right", mask: "numeric-int" },
        //                    { header: true, value: "우리사주조합인출금50%", format: { type: "label" } },
        //                    { name: "amt29", editable: { type: "text", maxlength: 10, width: 98 }, align: "right", mask: "numeric-int" },
        //                    { header: true, value: "우리사주조합인출금75%", format: { type: "label" } },
        //                    { name: "amt30", editable: { type: "text", maxlength: 10, width: 98 }, align: "right", mask: "numeric-int" }
        //                ]
        //            },
        //            {
        //                element: [
        //                    { header: true, value: "주택자금보조금", format: { type: "label" } },
        //                    { name: "amt31", editable: { type: "text", maxlength: 10, width: 98 }, align: "right", mask: "numeric-int" },
        //                    { header: true, value: "해저광물자원개발", format: { type: "label" } },
        //                    { name: "amt32", editable: { type: "text", maxlength: 10, width: 98 }, align: "right", mask: "numeric-int" },
        //                    { header: true, value: "그 밖의 비과세", format: { type: "label" } },
        //                    { name: "amt33", editable: { type: "text", maxlength: 10, width: 98 }, align: "right", mask: "numeric-int" },
        //                    { header: true, value: "계", format: { type: "label" } },
        //                    { name: "amt34", editable: { type: "hidden", maxlength: 10, width: 98 }, align: "right", mask: "numeric-int" }
        //                ]
        //            }
        //        ]
        //    }
        //};
        ////----------
        //gw_com_module.formCreate(args);
        createDW({});
        ////=====================================================================================
        //var args = {
        //    target: [
		//		{ type: "FORM", id: "frmData_MAIN", offset: 8 }
		//	]
        //};
        ////----------
        //gw_com_module.objResize(args);
        ////=====================================================================================
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

        //=====================================================================================
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        function processButton(param) {
            switch (param.element) {
                case "조회":
                    processRetrieve({});
                    break;
                case "저장":
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

//----------
processRetrieve = function (param) {

    var args = {
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
				{ name: "emp_no", argument: "arg_emp_no" },
                { name: "taxadj_year", argument: "arg_taxadj_year" }
            ],
            remark: [
                { element: [{ name: "taxadj_year" }] },
                { element: [{ name: "emp_nm" }] }
            ]
        },
        target: [
			{ type: "FORM", id: "frmData_MAIN", focus: true, select: true }
		],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

};
//----------
function processItemchanged(param) {

    if (param.object == "frmData_MAIN") {
        switch (param.element) {
            case "amt7":
            case "amt8":
            case "amt9":
            case "amt10":
            case "amt11":
            case "amt12":
            case "amt13":
            case "amt14":
            case "amt15":
            case "amt16":
            case "amt17":
            case "amt18":
            case "amt19":
            case "amt20":
            case "amt21":
            case "amt22":
            case "amt23":
            case "amt24":
            case "amt25":
            case "amt26":
            case "amt27":
            case "amt28":
            case "amt29":
            case "amt30":
            case "amt31":
            case "amt32":
            case "amt33":
                var val = Number(gw_com_api.getValue(param.object, param.row, "amt7"))
                        + Number(gw_com_api.getValue(param.object, param.row, "amt8"))
                        + Number(gw_com_api.getValue(param.object, param.row, "amt9"))
                        + Number(gw_com_api.getValue(param.object, param.row, "amt10"))
                        + Number(gw_com_api.getValue(param.object, param.row, "amt11"))
                        + Number(gw_com_api.getValue(param.object, param.row, "amt12"))
                        + Number(gw_com_api.getValue(param.object, param.row, "amt13"))
                        + Number(gw_com_api.getValue(param.object, param.row, "amt14"))
                        + Number(gw_com_api.getValue(param.object, param.row, "amt15"))
                        + Number(gw_com_api.getValue(param.object, param.row, "amt16"))
                        + Number(gw_com_api.getValue(param.object, param.row, "amt17"))
                        + Number(gw_com_api.getValue(param.object, param.row, "amt18"))
                        + Number(gw_com_api.getValue(param.object, param.row, "amt19"))
                        + Number(gw_com_api.getValue(param.object, param.row, "amt20"))
                        + Number(gw_com_api.getValue(param.object, param.row, "amt21"))
                        + Number(gw_com_api.getValue(param.object, param.row, "amt22"))
                        + Number(gw_com_api.getValue(param.object, param.row, "amt23"))
                        + Number(gw_com_api.getValue(param.object, param.row, "amt24"))
                        + Number(gw_com_api.getValue(param.object, param.row, "amt25"))
                        + Number(gw_com_api.getValue(param.object, param.row, "amt26"))
                        + Number(gw_com_api.getValue(param.object, param.row, "amt27"))
                        + Number(gw_com_api.getValue(param.object, param.row, "amt28"))
                        + Number(gw_com_api.getValue(param.object, param.row, "amt29"))
                        + Number(gw_com_api.getValue(param.object, param.row, "amt30"))
                        + Number(gw_com_api.getValue(param.object, param.row, "amt31"))
                        + Number(gw_com_api.getValue(param.object, param.row, "amt32"))
                        + Number(gw_com_api.getValue(param.object, param.row, "amt33"));
                //var val = Number(gw_com_api.getValue(param.object, param.row, "amt34"))
                //        - Number(gw_com_api.unMask(param.value.prev, "numeric-int"))
                //        + Number(gw_com_api.unMask(param.value.current, "numeric-int"));
                gw_com_api.setValue(param.object, param.row, "amt34", val, false, true, false);
                break;
        }
    }

}
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

    var data = {
        emp_no: gw_com_api.getValue("frmOption", 1, "emp_no"),
        taxadj_year: gw_com_api.getValue("frmOption", 1, "taxadj_year"),
        amt7: gw_com_api.getValue("frmData_MAIN", 1, "amt7"),
        amt8: gw_com_api.getValue("frmData_MAIN", 1, "amt8"),
        amt9: gw_com_api.getValue("frmData_MAIN", 1, "amt9"),
        amt10: gw_com_api.getValue("frmData_MAIN", 1, "amt10"),
        amt11: gw_com_api.getValue("frmData_MAIN", 1, "amt11"),
        amt12: gw_com_api.getValue("frmData_MAIN", 1, "amt12"),
        amt13: gw_com_api.getValue("frmData_MAIN", 1, "amt13"),
        amt14: gw_com_api.getValue("frmData_MAIN", 1, "amt14"),
        amt15: gw_com_api.getValue("frmData_MAIN", 1, "amt15"),
        amt16: gw_com_api.getValue("frmData_MAIN", 1, "amt16"),
        amt17: gw_com_api.getValue("frmData_MAIN", 1, "amt17"),
        amt18: gw_com_api.getValue("frmData_MAIN", 1, "amt18"),
        amt19: gw_com_api.getValue("frmData_MAIN", 1, "amt19"),
        amt20: gw_com_api.getValue("frmData_MAIN", 1, "amt20"),
        amt21: gw_com_api.getValue("frmData_MAIN", 1, "amt21"),
        amt22: gw_com_api.getValue("frmData_MAIN", 1, "amt22"),
        amt23: gw_com_api.getValue("frmData_MAIN", 1, "amt23"),
        amt24: gw_com_api.getValue("frmData_MAIN", 1, "amt24"),
        amt25: gw_com_api.getValue("frmData_MAIN", 1, "amt25"),
        amt26: gw_com_api.getValue("frmData_MAIN", 1, "amt26"),
        amt27: gw_com_api.getValue("frmData_MAIN", 1, "amt27"),
        amt28: gw_com_api.getValue("frmData_MAIN", 1, "amt28"),
        amt29: gw_com_api.getValue("frmData_MAIN", 1, "amt29"),
        amt30: gw_com_api.getValue("frmData_MAIN", 1, "amt30"),
        amt31: gw_com_api.getValue("frmData_MAIN", 1, "amt31"),
        amt32: gw_com_api.getValue("frmData_MAIN", 1, "amt32"),
        amt33: gw_com_api.getValue("frmData_MAIN", 1, "amt33"),
        amt34: gw_com_api.getValue("frmData_MAIN", 1, "amt34")
    }
    processClose({ data: data });

}
//----------
function createDW(param) {
    var args = {
        targetid: "frmData_MAIN", query: "HRM_2030_2", type: "TABLE", title: "비과세소득",
        caption: false, show: true, selectable: true,
        editable: { bind: "open", focus: "amt7", validate: true },
        content: {
            width: { label: 50, field: 50 }, height: 30,
            row: [
                {
                    element: [
                        { header: true, value: "비과세학자금", format: { type: "label" } },
                        { name: "amt7", editable: { type: "text", maxlength: 10, width: 98 }, align: "right", mask: "numeric-int" },
                        { header: true, value: "무보수위원수당", format: { type: "label" } },
                        { name: "amt8", editable: { type: "text", maxlength: 10, width: 98 }, align: "right", mask: "numeric-int" },
                        { header: true, value: "경호ㆍ승선수당", format: { type: "label" } },
                        { name: "amt9", editable: { type: "text", maxlength: 10, width: 98 }, align: "right", mask: "numeric-int" },
                        { header: true, value: "유아ㆍ초중등", format: { type: "label" } },
                        { name: "amt10", editable: { type: "text", maxlength: 10, width: 98 }, align: "right", mask: "numeric-int" }
                    ]
                },
                {
                    element: [
                        { header: true, value: "고등교육법", format: { type: "label" } },
                        { name: "amt11", editable: { type: "text", maxlength: 10, width: 98 }, align: "right", mask: "numeric-int" },
                        { header: true, value: "특별법", format: { type: "label" } },
                        { name: "amt12", editable: { type: "text", maxlength: 10, width: 98 }, align: "right", mask: "numeric-int" },
                        { header: true, value: "연구기관 등", format: { type: "label" } },
                        { name: "amt13", editable: { type: "text", maxlength: 10, width: 98 }, align: "right", mask: "numeric-int" },
                        { header: true, value: "기업연구소", format: { type: "label" } },
                        { name: "amt14", editable: { type: "text", maxlength: 10, width: 98 }, align: "right", mask: "numeric-int" }
                    ]
                },
                {
                    element: [
                        { header: true, value: "취재수당", format: { type: "label" } },
                        { name: "amt15", editable: { type: "text", maxlength: 10, width: 98 }, align: "right", mask: "numeric-int" },
                        { header: true, value: "벽지수당", format: { type: "label" } },
                        { name: "amt16", editable: { type: "text", maxlength: 10, width: 98 }, align: "right", mask: "numeric-int" },
                        { header: true, value: "재해관련급여", format: { type: "label" } },
                        { name: "amt17", editable: { type: "text", maxlength: 10, width: 98 }, align: "right", mask: "numeric-int" },
                        { header: true, value: "외국정부등근무자", format: { type: "label" } },
                        { name: "amt18", editable: { type: "text", maxlength: 10, width: 98 }, align: "right", mask: "numeric-int" }
                    ]
                },
                {
                    element: [
                        { header: true, value: "외국주둔군인등", format: { type: "label" } },
                        { name: "amt19", editable: { type: "text", maxlength: 10, width: 98 }, align: "right", mask: "numeric-int" },
                        { header: true, value: "국외근로100만원", format: { type: "label" } },
                        { name: "amt20", editable: { type: "text", maxlength: 10, width: 98 }, align: "right", mask: "numeric-int" },
                        { header: true, value: "국외근로150만원", format: { type: "label" } },
                        { name: "amt21", editable: { type: "text", maxlength: 10, width: 98 }, align: "right", mask: "numeric-int" },
                        { header: true, value: "국외근로", format: { type: "label" } },
                        { name: "amt22", editable: { type: "text", maxlength: 10, width: 98 }, align: "right", mask: "numeric-int" }
                    ]
                },
                {
                    element: [
                        { header: true, value: "야간근로수당", format: { type: "label" } },
                        { name: "amt23", editable: { type: "text", maxlength: 10, width: 98 }, align: "right", mask: "numeric-int" },
                        { header: true, value: "출산보육수당", format: { type: "label" } },
                        { name: "amt24", editable: { type: "text", maxlength: 10, width: 98 }, align: "right", mask: "numeric-int" },
                        { header: true, value: "주식매수선택권", format: { type: "label" } },
                        { name: "amt25", editable: { type: "text", maxlength: 10, width: 98 }, align: "right", mask: "numeric-int" },
                        { header: true, value: "외국인기술자", format: { type: "label" } },
                        { name: "amt26", editable: { type: "text", maxlength: 10, width: 98 }, align: "right", mask: "numeric-int" }
                    ]
                },
                {
                    element: [
                        { header: true, value: "외국인근로자", format: { type: "label" } },
                        { name: "amt27", editable: { type: "text", maxlength: 10, width: 98 }, align: "right", mask: "numeric-int" },
                        { header: true, value: "우리사주조합배정", format: { type: "label" } },
                        { name: "amt28", editable: { type: "text", maxlength: 10, width: 98 }, align: "right", mask: "numeric-int" },
                        { header: true, value: "우리사주조합인출금50%", format: { type: "label" } },
                        { name: "amt29", editable: { type: "text", maxlength: 10, width: 98 }, align: "right", mask: "numeric-int" },
                        { header: true, value: "우리사주조합인출금75%", format: { type: "label" } },
                        { name: "amt30", editable: { type: "text", maxlength: 10, width: 98 }, align: "right", mask: "numeric-int" }
                    ]
                },
                {
                    element: [
                        { header: true, value: "주택자금보조금", format: { type: "label" } },
                        { name: "amt31", editable: { type: "text", maxlength: 10, width: 98 }, align: "right", mask: "numeric-int" },
                        { header: true, value: "해저광물자원개발", format: { type: "label" } },
                        { name: "amt32", editable: { type: "text", maxlength: 10, width: 98 }, align: "right", mask: "numeric-int" },
                        { header: true, value: "그 밖의 비과세", format: { type: "label" } },
                        { name: "amt33", editable: { type: "text", maxlength: 10, width: 98 }, align: "right", mask: "numeric-int" },
                        { header: true, value: "계", format: { type: "label" } },
                        { name: "amt34", editable: { type: "hidden", maxlength: 10, width: 98 }, align: "right", mask: "numeric-int" }
                    ]
                }
            ]
        }
    };
    //----------
    if (!param.editable) {
        $.each(args.content.row, function () {
            for (i = 0; i < this.element.length; i++) {
                if (this.element[i].editable) {
                    this.element[i].editable.type = "hidden";
                }
            }
        });
    }
    //----------
    gw_com_module.formCreate(args);
    //=====================================================================================
    var args = {
        target: [
            { type: "FORM", id: "frmData_MAIN", offset: 8 }
        ]
    };
    //----------
    gw_com_module.objResize(args);
    //=====================================================================================
    var args = { targetid: "frmData_MAIN", event: "itemchanged", handler: processItemchanged };
    gw_com_module.eventBind(args);
    //=====================================================================================
}
//----------
var TaxAdj = {
    close: function (param) {
        var rtn = false;
        var year = (v_global.logic.popup_data == undefined || v_global.logic.popup_data.taxadj_year == undefined ? "" : v_global.logic.popup_data.taxadj_year);
        var emp_no = (v_global.logic.popup_data == undefined || v_global.logic.popup_data.emp_no == undefined ? "" : v_global.logic.popup_data.emp_no);
        var args = {
            request: "PAGE",
            url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
                    "?QRY_ID=HRM_TAXADJ_MASTER" +
                    "&QRY_COLS=close_yn" +
                    "&CRUD=R" +
                    "&arg_year=" + year + "&arg_emp_no=" + emp_no,
            handler_success: successRequest
        };
        //=================== async : false ========================
        $.ajaxSetup({ async: false });
        //----------
        gw_com_module.callRequest(args);
        function successRequest(data) {
            rtn = (data[0].DATA[0] == "1" ? true : false);
        }
        //----------
        $.ajaxSetup({ async: true });
        //=================== async : true ========================
        return rtn
    }
}
//----------
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
                v_global.logic.popup_data = param.data;
                v_global.logic.close = TaxAdj.close();
                createDW({ editable: !v_global.logic.close });
                if (v_global.logic.close) {
                    gw_com_api.hide("lyrMenu_저장");
                } else {
                    gw_com_api.show("lyrMenu_저장");
                }

                gw_com_api.setValue("frmOption", 1, "emp_no", param.data.emp_no);
            	gw_com_api.setValue("frmOption", 1, "emp_nm", param.data.emp_nm);
            	gw_com_api.setValue("frmOption", 1, "taxadj_year", param.data.taxadj_year);
            	
                //processRetrieve({});
            	var args = {
            	    targetid: "frmData_MAIN", edit: true, updatable: true,
            	    data: [
                        { name: "amt7", value: param.data.amt7 },
                        { name: "amt8", value: param.data.amt8 },
                        { name: "amt9", value: param.data.amt9 },
                        { name: "amt10", value: param.data.amt10 },
                        { name: "amt11", value: param.data.amt11 },
                        { name: "amt12", value: param.data.amt12 },
                        { name: "amt13", value: param.data.amt13 },
                        { name: "amt14", value: param.data.amt14 },
                        { name: "amt15", value: param.data.amt15 },
                        { name: "amt16", value: param.data.amt16 },
                        { name: "amt17", value: param.data.amt17 },
                        { name: "amt18", value: param.data.amt18 },
                        { name: "amt19", value: param.data.amt19 },
                        { name: "amt20", value: param.data.amt20 },
                        { name: "amt21", value: param.data.amt21 },
                        { name: "amt22", value: param.data.amt22 },
                        { name: "amt23", value: param.data.amt23 },
                        { name: "amt24", value: param.data.amt24 },
                        { name: "amt25", value: param.data.amt25 },
                        { name: "amt26", value: param.data.amt26 },
                        { name: "amt27", value: param.data.amt27 },
                        { name: "amt28", value: param.data.amt28 },
                        { name: "amt29", value: param.data.amt29 },
                        { name: "amt30", value: param.data.amt30 },
                        { name: "amt31", value: param.data.amt31 },
                        { name: "amt32", value: param.data.amt32 },
                        { name: "amt33", value: param.data.amt33 },
                        { name: "amt34", value: param.data.amt34 }
            	    ]
            	};
            	gw_com_module.formInsert(args);
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