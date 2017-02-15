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
        var args = {
            request: [
				{
				    type: "PAGE", name: "제품유형", query: "dddw_prodtype"
				},
				{
				    type: "PAGE", name: "공정구분", query: "dddw_zcode",
				    param: [
				        { argument: "arg_hcode", value: "ISCM26" }
				    ]
				}
            ],
            starter: start
        };
        gw_com_module.selectSet(args);

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
				{ name: "복사", value: "복사", icon: "기타" },
				{ name: "닫기", value: "닫기" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_MAIN", type: "FREE",
            trans: true, border: false, show: true, align: "left",
            editable: { bind: "open", focus: "emp_no", validate: true },
            content: {
                row: [
                    {
                        element: [
				            {
				            	name: "prod_type", label: { title: "제품유형(원본) :" },
				                editable: { type: "select", data: { memory: "제품유형" } }
				            }
				        ]
                    }
				]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_SUB", type: "FREE",
            trans: true, border: false, show: true, align: "left",
            editable: { bind: "open", focus: "emp_no", validate: true },
            content: {
                row: [
                    {
                        element: [
				            {
				            	name: "prod_type", label: { title: "제품유형(복사) :" },
				                editable: { type: "select", data: { memory: "제품유형" } }
				            }
				        ]
                    }
				]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_MAIN", query: "w_mrp1030_M_1", title: "생산 공정 정보",
            height: 320, show: true, number: true, dynamic: true,
            element: [
				{
				    header: "공정구분", name: "mprc_class", width: 90, align: "center",
				    format: { type: "select", data: { memory: "공정구분" } }
				},
				{ header: "공정코드", name: "mprc_no", width: 70, align: "center" },
				{ header: "공정명", name: "mprc_nm", width: 180 },
				//{ header: "시간", name: "mprc_term", width: 50, align: "center" },
				//{ header: "인원", name: "mprc_persons", width: 50, align: "center", mask: "numeric-int" },
				//{ header: "표준소요시간", name: "mprc_times", width: 80, align: "center", mask: "numeric-float" },
				//{ header: "공정시작일", name: "mprc_days", width: 70, align: "center", mask: "numeric-int" },
				//{ header: "공정가중치", name: "mprc_weight", width: 70, align: "center", mask: "numeric-float" },
				//{ header: "누적진행율", name: "mprc_rate", width: 70, align: "center", mask: "numeric-float" },
                { name: "prod_group", hidden: true },
                { name: "prod_type", hidden: true },
                { name: "mprc_cd", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_SUB", query: "w_mrp1030_M_1", title: "생산 공정 정보",
            height: 320, show: true, number: true, dynamic: true,
            element: [
				{
				    header: "공정구분", name: "mprc_class", width: 90, align: "center",
				    format: { type: "select", data: { memory: "공정구분" } }
				},
				{ header: "공정코드", name: "mprc_no", width: 70, align: "center" },
				{ header: "공정명", name: "mprc_nm", width: 180 },
				//{ header: "시간", name: "mprc_term", width: 50, align: "center" },
				//{ header: "인원", name: "mprc_persons", width: 50, align: "center", mask: "numeric-int" },
				//{ header: "표준소요시간", name: "mprc_times", width: 80, align: "center", mask: "numeric-float" },
				//{ header: "공정시작일", name: "mprc_days", width: 70, align: "center", mask: "numeric-int" },
				//{ header: "공정가중치", name: "mprc_weight", width: 70, align: "center", mask: "numeric-float" },
				//{ header: "누적진행율", name: "mprc_rate", width: 70, align: "center", mask: "numeric-float" },
                { name: "prod_group", hidden: true },
                { name: "prod_type", hidden: true },
                { name: "mprc_cd", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
				{ type: "GRID", id: "grdList_MAIN", offset: 8 },
                { type: "GRID", id: "grdList_SUB", offset: 8 }
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

        //=====================================================================================
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "복사", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmData_MAIN", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_SUB", event: "itemchanged", handler: processItemchanged };
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
                case "복사":
                    processCopy({});
                    break;
                case "닫기":
                    processClose({});
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

    if (param.object == "frmData_MAIN" || param.object == undefined) {
        var args = {
            source: {
                type: "FORM", id: "frmData_MAIN",
                element: [
                    { name: "prod_type", argument: "arg_prod_type" }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_MAIN", focus: true, select: true }
            ],
            key: param.key
        };
        gw_com_module.objRetrieve(args);
    }

    if (param.object == "frmData_SUB" || param.object == undefined) {
        var args = {
            source: {
                type: "FORM", id: "frmData_SUB",
                element: [
                    { name: "prod_type", argument: "arg_prod_type" }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_SUB", focus: true, select: true }
            ],
            key: param.key
        };
        gw_com_module.objRetrieve(args);
    }

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
function processItemchanged(param) {

    processRetrieve(param);

}
//----------
function processCopy(param) {

    var fr_prod_type = gw_com_api.getValue("frmData_MAIN", 1, "prod_type");
    var to_prod_type = gw_com_api.getValue("frmData_SUB", 1, "prod_type");

    if (fr_prod_type == to_prod_type) {
        gw_com_api.messageBox([{ text: "원본과 대상이 같습니다." }]);
        return;
    } else if (gw_com_api.getRowCount("grdList_SUB") > 0) {
        gw_com_api.messageBox([{ text: "기존의 공정 자료가 삭제 후 복사됩니다." }, { text: "계속하시겠습니까?" }],
            420, gw_com_api.v_Message.msg_confirmBatch, "YESNO");
        return;
    }

    processBatch({});

}
//----------
function processBatch(param) {

    var args = {
        url: "COM",
        procedure: "dbo.PROC_COPY_MPRC",
        input: [
            { name: "fr_prod_type", value: gw_com_api.getValue("frmData_MAIN", 1, "prod_type"), type: "varchar" },
            { name: "to_prod_type", value: gw_com_api.getValue("frmData_SUB", 1, "prod_type"), type: "varchar" },
            { name: "usr_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
        ],
        handler: {
            success: successBatch,
            param: param
        }
    };
    gw_com_module.callProcedure(args);

}
//----------
function successBatch(response, param) {

    processClose({ data: { prod_type: gw_com_api.getValue("frmData_SUB", 1, "prod_type") } });

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
                processRetrieve({});
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
                                var status = checkCRUD({});
                                if (status == "initialize" || status == "create")
                                    processDelete({});
                                else if (status == "update")
                                    processRestore({});

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
                    case gw_com_api.v_Message.msg_confirmBatch:
                        { if (param.data.result == "YES") processBatch(param.data.arg); } break;
                }
            }
            break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//