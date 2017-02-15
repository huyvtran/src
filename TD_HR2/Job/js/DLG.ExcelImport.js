
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define Global variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {}, init: false },
    data: null,
    logic: {}
};

var gw_job_process = {

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // entry point. (pre-process section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ready: function () {

        // initialize page.
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");
        v_global.logic.datatype = gw_com_module.v_Option.datatype;

        start();

        function start() {
            gw_job_process.UI();
            gw_job_process.procedure();
        }

    },

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage UI. (design section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    UI: function () {

        //==== Menu : Main ====
        var args = { targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "업로드", value: "업로드", icon: "실행" },
				{ name: "저장", value: "저장" },
				{ name: "닫기", value: "닫기" }
			]
        };
        gw_com_module.buttonMenu(args);

        //==== List Grid : Excel ====
        var args = {
            targetid: "grdData_List", query: "DLG_ExcelImport_List", title: "엑셀 데이터",
            caption: true, height: "300", pager: false, show: true, selectable: true, number: true,
            element: [
				        { name: "file_id", hidden: true },
				        { name: "seq", hidden: true },
				        { name: "chk_cd", hidden: true },
				        { header: "체크결과", name: "chk_msg", width: 150 },
				        { header: "A", name: "COL01", width: 80 },
				        { header: "B", name: "COL02", width: 80 },
				        { header: "C", name: "COL03", width: 80 },
				        { header: "D", name: "COL04", width: 80 },
				        { header: "E", name: "COL05", width: 80 },
				        { header: "F", name: "COL06", width: 80 },
				        { header: "G", name: "COL07", width: 80 },
				        { header: "H", name: "COL08", width: 80 },
				        { header: "I", name: "COL09", width: 80 },
				        { header: "J", name: "COL10", width: 80 },
				        { header: "K", name: "COL11", width: 80 },
				        { header: "L", name: "COL12", width: 80 },
				        { header: "M", name: "COL13", width: 80 },
				        { header: "N", name: "COL14", width: 80 },
				        { header: "O", name: "COL15", width: 80 },
				        { header: "P", name: "COL16", width: 80 },
				        { header: "Q", name: "COL17", width: 80 },
				        { header: "R", name: "COL18", width: 80 },
				        { header: "S", name: "COL19", width: 80 },
				        { header: "T", name: "COL20", width: 80 },
				        { header: "U", name: "COL21", width: 80 },
				        { header: "V", name: "COL22", width: 80 },
				        { header: "W", name: "COL23", width: 80 },
				        { header: "X", name: "COL24", width: 80 },
				        { header: "Y", name: "COL25", width: 80 },
				        { header: "Z", name: "COL26", width: 80 },
				        { header: "AA", name: "COL27", width: 80 },
				        { header: "AB", name: "COL28", width: 80 },
				        { header: "AC", name: "COL29", width: 80 },
				        { header: "AD", name: "COL30", width: 80 },
				        { header: "AE", name: "COL31", width: 80 },
				        { header: "AF", name: "COL32", width: 80 },
				        { header: "AG", name: "COL33", width: 80 },
				        { header: "AH", name: "COL34", width: 80 },
				        { header: "AI", name: "COL35", width: 80 },
				        { header: "AJ", name: "COL36", width: 80 },
				        { header: "AK", name: "COL37", width: 80 },
				        { header: "AL", name: "COL38", width: 80 },
				        { header: "AM", name: "COL39", width: 80 },
				        { header: "AN", name: "COL40", width: 80 },
				        { header: "AO", name: "COL41", width: 80 },
				        { header: "AP", name: "COL42", width: 80 },
				        { header: "AQ", name: "COL43", width: 80 },
				        { header: "AR", name: "COL44", width: 80 },
				        { header: "AS", name: "COL45", width: 80 },
				        { header: "AT", name: "COL46", width: 80 },
				        { header: "AU", name: "COL47", width: 80 },
				        { header: "AV", name: "COL48", width: 80 },
				        { header: "AW", name: "COL49", width: 80 },
				        { header: "AX", name: "COL50", width: 80 },
				        { header: "AY", name: "COL51", width: 80 },
				        { header: "AZ", name: "COL52", width: 80 },
				        { header: "BA", name: "COL53", width: 80 },
				        { header: "BB", name: "COL54", width: 80 },
				        { header: "BC", name: "COL55", width: 80 },
				        { header: "BD", name: "COL56", width: 80 },
				        { header: "BE", name: "COL57", width: 80 },
				        { header: "BF", name: "COL58", width: 80 },
				        { header: "BG", name: "COL59", width: 80 },
				        { header: "BH", name: "COL60", width: 80 },
				        { header: "BI", name: "COL61", width: 80 },
				        { header: "BJ", name: "COL62", width: 80 },
				        { header: "BK", name: "COL63", width: 80 },
				        { header: "BL", name: "COL64", width: 80 },
				        { header: "BM", name: "COL65", width: 80 },
				        { header: "BN", name: "COL66", width: 80 },
				        { header: "BO", name: "COL67", width: 80 },
				        { header: "BQ", name: "COL68", width: 80 },
				        { header: "BR", name: "COL69", width: 80 },
				        { header: "BS", name: "COL70", width: 80 },
				        { header: "BT", name: "COL71", width: 80 },
				        { header: "BU", name: "COL72", width: 80 },
				        { header: "BV", name: "COL73", width: 80 },
				        { header: "BW", name: "COL74", width: 80 },
				        { header: "BX", name: "COL75", width: 80 },
				        { header: "BY", name: "COL76", width: 80 },
				        { header: "BZ", name: "COL77", width: 80 },
				        { header: "CA", name: "COL78", width: 80 },
				        { header: "CB", name: "COL79", width: 80 },
				        { header: "CC", name: "COL80", width: 80 },
				        { header: "CD", name: "COL81", width: 80 },
				        { header: "CE", name: "COL82", width: 80 },
				        { header: "CF", name: "COL83", width: 80 },
				        { header: "CG", name: "COL84", width: 80 },
				        { header: "CH", name: "COL85", width: 80 },
				        { header: "CI", name: "COL86", width: 80 },
				        { header: "CJ", name: "COL87", width: 80 },
				        { header: "CK", name: "COL88", width: 80 },
				        { header: "CL", name: "COL89", width: 80 },
				        { header: "CM", name: "COL90", width: 80 },
				        { header: "CN", name: "COL91", width: 80 },
				        { header: "CO", name: "COL92", width: 80 },
				        { header: "CP", name: "COL93", width: 80 },
				        { header: "CQ", name: "COL94", width: 80 },
				        { header: "CR", name: "COL95", width: 80 },
				        { header: "CS", name: "COL96", width: 80 },
				        { header: "CT", name: "COL97", width: 80 },
				        { header: "CU", name: "COL98", width: 80 },
				        { header: "CV", name: "COL99", width: 80 },
				        { header: "CW", name: "COL100", width: 80 },
				        { header: "CX", name: "COL101", width: 80 },
				        { header: "CY", name: "COL102", width: 80 },
				        { header: "CZ", name: "COL103", width: 80 }
            ]
        };
        gw_com_module.gridCreate(args);

        //==== Resize Objects
        var args = {
            target: [
                    { type: "GRID", id: "grdData_List", offset: 8 }
            ]
        };
        gw_com_module.objResize(args);
        gw_com_module.informSize();
    },

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage process. (program section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    procedure: function () {

        //==== Button Click : Main ====
        var args = { targetid: "lyrMenu", element: "업로드", event: "click", handler: click_lyrMenu_업로드 };
        gw_com_module.eventBind(args);
        //-----------------------------        
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processSave };
        gw_com_module.eventBind(args);
        //-----------------------------        
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //-----------------------------        

        //==== Button Events : Main ====
        function click_lyrMenu_업로드(ui) {
            var args = { targetid: "lyrServer", control: { by: "DX", id: ctlUpload } };
            gw_com_module.uploadFile(args);
        }

        // startup process.
        gw_com_module.startPage();
        var args = {
            ID: gw_com_api.v_Stream.msg_openedDialogue
        };
        gw_com_module.streamInterface(args);

    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function processRetrieve(param) {
    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_file_id", value: param.key }
            ]
        },
        target: [
			{ type: "GRID", id: "grdData_List", focus: true, select: true }
        ],
        key: param.key, handler_complete: processRetrieveEnd
    };
    gw_com_module.objRetrieve(args);
}
//----------
function processRetrieveEnd(param) {

}
//----------
function processClear(param) {

    var args = {
        target: [
			{ type: "GRID", id: "grdData_List" }
		]
    };
    gw_com_module.objClear(args);

    //
    ctlUpload.Cancel();
    ctlUpload.ClearText();

}
//----------
function processSave(param) {

    switch (v_global.logic.OPTION.JOB_ID) {
        case "HRM_3060": {
            var iRow = gw_com_api.getFindRow("grdData_List", "chk_cd", "F");
            if (gw_com_api.getRowCount("grdData_List") < 1) {
                return;
            } else if (iRow > 0) {
                gw_com_api.messageBox([{ text: "오류 항목이 있습니다." }], 300);
            } else {
                v_global.logic.run_tp = "CREATE";
                var args = {
                    url: "COM",
                    procedure: "GoodERP.dbo.PROC_WORKTIME_IMP",
                    nomessage: true,
                    input: [
                        { name: "file_id", value: v_global.logic.key, type: "varchar" },
                        { name: "run_tp", value: v_global.logic.run_tp, type: "varchar" },
                        { name: "work_ymd", value: v_global.logic.OPTION.work_ymd },
                        { name: "usr_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
                    ],
                    output: [
                        { name: "rtn_no", type: "int" },
                        { name: "rtn_msg", type: "varchar" }
                    ],
                    handler: { success: successSave }
                };
                gw_com_module.callProcedure(args)
            }
        } break;
    }

}
//----------
function processClose(param) {
    var args = {
        ID: gw_com_api.v_Stream.msg_closeDialogue
    };
    gw_com_module.streamInterface(args);
    processClear({});
}
//----------
function successUpload(response) {

    switch (v_global.logic.OPTION.JOB_ID) {
        case "HRM_3060": {
            v_global.logic.key = response.id;
            v_global.logic.run_tp = "CHECK";
            var args = {
                url: "COM",
                procedure: "GoodERP.dbo.PROC_WORKTIME_IMP",
                nomessage: true,
                input: [
                    { name: "file_id", value: v_global.logic.key, type: "varchar" },
                    { name: "run_tp", value: v_global.logic.run_tp, type: "varchar" },
                    { name: "work_ymd", value: v_global.logic.OPTION.work_ymd },
                    { name: "usr_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
                ],
                output: [
                    { name: "rtn_no", type: "int" },
                    { name: "rtn_msg", type: "varchar" }
                ],
                handler: { success: successSave }
            };
            gw_com_module.callProcedure(args);
        } break;
    }

}
//----------
function successSave(response, param) {

    switch (v_global.logic.OPTION.JOB_ID) {
        case "HRM_3060": {
            var rtn_no = response.VALUE[0];
            var rtn_msg = response.VALUE[1];
            if (v_global.logic.run_tp == "CHECK") {
                gw_com_api.messageBox([{ text: rtn_msg }], 350);
                if (rtn_no == 0 || rtn_no == "")
                    processRetrieve({ key: v_global.logic.key });
            } else {
                gw_com_api.messageBox([{ text: rtn_msg }], 400);
                if (rtn_no == 0) {
                    var args = {
                        ID: gw_com_api.v_Stream.msg_closeDialogue
                        , data: { }
                    };
                    gw_com_module.streamInterface(args);
                    processClose({});
                }
            }
        } break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

streamProcess = function (param) {
    switch (param.ID) {
        case gw_com_api.v_Stream.msg_openedDialogue: {
            v_global.logic.OPTION = param.data;
        } break;
        case gw_com_api.v_Stream.msg_resultMessage: {
            if (param.data.page != gw_com_api.getPageID()) break;

            switch (param.data.ID) {
                case gw_com_api.v_Message.msg_informSaved: 
                    {
                        param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                    } break;
            }

        } break;
    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
