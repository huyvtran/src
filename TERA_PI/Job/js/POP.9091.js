
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
            gw_com_api.setValue("frmData_설명", 1, "dept_area", gw_com_module.v_Session.DEPT_AREA) ;
        }

    },

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage UI. (design section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    UI: function () {

        //==== Menu : Main ====
        var args = { targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "업로드", value: "업로드", icon: "저장", act: true },
				{ name: "닫기", value: "닫기" }
			]
        };
        gw_com_module.buttonMenu(args);

        var args = {
            targetid: "frmData_설명", type: "TABLE", title: "파일 정보",
            width: "100%", show: true, selectable: true,
            editable: { bind: "select", focus: "file_desc", validate: true },
            content: {
                height: 25, width: { label: 150, field: 450 },
                row: [
                    {
                        element: [
                              { header: true, value: "설명", format: { type: "label" } },
                              {
                                  name: "file_desc", style: { colspan: 5 },
                                  editable: { type: "text" }
                              },
                              { name: "dept_area", editable: { type: "hidden" }, hidden: true },
                              { name: "biz_area", editable: { type: "hidden" }, hidden: true },
                              { name: "doc_area", editable: { type: "hidden" }, hidden: true },
                              { name: "cust_cd", editable: { type: "hidden" }, hidden: true },
                              { name: "prod_type", editable: { type: "hidden" }, hidden: true },
                              { name: "folder_id", editable: { type: "hidden" }, hidden: true },
                              { name: "user_id", editable: { type: "hidden" }, hidden: true }
                        ]
                    }
                ]
            }
        }; gw_com_module.formCreate(args);
        
        //==== Resize ====
        var args = {
            target: [
				{ type: "FORM", id: "frmData_설명", offset: 8 }
			]
        };
        gw_com_module.objResize(args);

    },

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage process. (program section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    procedure: function () {

        //==== Button Click : Main ====
        var args = { targetid: "lyrMenu", element: "업로드", event: "click", handler: click_lyrMenu_업로드 };
        gw_com_module.eventBind(args);
        
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: click_lyrMenu_닫기 };
        gw_com_module.eventBind(args);

        //==== Button Events : Main ====
        function click_lyrMenu_업로드(ui) {
            var args = { targetid: "lyrServer", control: { by: "DX", id: ctlUpload } };
            gw_com_module.uploadFile(args);
        }

        function click_lyrMenu_닫기(ui) {
            processClose({});
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

function processClear(param) {

    var args = {
        target: [
			{ type: "FORM", id: "frmData_설명" }
		]
    };
    gw_com_module.objClear(args);

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
	var RevType = v_global.data.crud;
	if (v_global.data.revise) RevType = "R";

	var qryZfile = {
	    query: "DLG_FILE_ZFILE", // ZFILE
	    row: [{
	        crud: "U",
	        column: [
                { name: "file_id", value: response.id },
                { name: "file_ext", value: response.ext },
                { name: "file_desc", value: gw_com_api.getValue("frmData_설명", 1, "file_desc") },
                { name: "data_tp", value: v_global.data.type },
                { name: "data_key", value: v_global.data.key },
                { name: "data_seq", value: 0 }
	        ]
	    }]
	};
	var argParam = [qryZfile];
    var args = { user: v_global.data.user,
        param: argParam,
        handler: { success: successSave }
    };
    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closeDialogue,
        key: response
    };
    gw_com_module.streamInterface(args);
    gw_com_api.setValue("frmData_설명", 1, "file_desc", "");

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
            	// v_global.data : user, key, seq, crud, rev, revise
                v_global.data = param.data;
                v_global.process.init = true;
                var args = { targetid: "frmData_설명", edit: true
		            ,data: [
		                { name: "dept_area", value: gw_com_module.v_Session.DEPT_AREA },
		                { name: "user_id", value: gw_com_module.v_Session.USR_NM }
		            ]
                };
                gw_com_module.formInsert(args);
            }
            break;
        case gw_com_api.v_Stream.msg_resultMessage: 
            {
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
