//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 납품대상 바코드 조회
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

        //[1] initialize page.
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        start();

        //create UI objects & define events & start logic
        function start() { 
        	//[3.1] UI & Events
        	gw_job_process.UI(); 
        	gw_job_process.procedure();
            //[3.2] Notice Opened Event to Master Page
            var args = { ID: gw_com_api.v_Stream.msg_openedDialogue };
            gw_com_module.streamInterface(args);
        }
    },

    // manage UI. (design section)
    UI: function () {

        //==== Main Menu : 조회, 확인, 취소
        var args = { targetid: "lyrMenu", type: "FREE",
            element: [
				//{ name: "조회", value: "조회", act: true },
				{ name: "저장", value: "저장", icon: "저장" },
				{ name: "닫기", value: "닫기", icon: "닫기" }
			]
        };
        gw_com_module.buttonMenu(args);

        //==== List Grid : 납품 목록
        var args = { targetid: "grdData_List", query: "SRM_4110_P3", title: "납품목록",
            height: 200, number: true, pager: true, show: true, dynamic: true,
            editable: { multi: true, bind: "select", focus: "ser_no", validate: true },
            element: [
				{ header: "품번", name: "item_cd", width: 70, align: "center" }
                , { header: "품명", name: "item_nm", width: 100, align: "left" }
                , { header: "규격", name: "item_spec", width: 120, align: "left" }
                , { header: "Tracking", name: "track_no", width: 80, align: "center" }
                , { header: "Pallet No.", name: "pallet_no", width: 80, align: "center" }
                , { header: "수량", name: "dlv_qty", width: 40, align: "right" }
                , {
                    header: "바코드", name: "barcode", width: 70, align: "center"
                    , editable: { type: "hidden" }
                }
                , {
                    header: "Serial No.", name: "ser_no", width: 140, align: "center"
                    , editable: { type: "text" }
                }
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

    //==== manage process. (program section)
    procedure: function () {

        //==== Button Click : Main 조회, 추가, 수정, 출력(납품서), 라벨(라벨출력), 닫기 ====
//        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: processRetrieve };
//        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processSave };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);

        // startup process.
        //----------
        gw_com_module.startPage();
    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//----------
function processRetrieve(param) {

    var args = {
        source: {
            type: "INLINE",
            argument: [
				{ name: "arg_dlv_no", value: param.data.dlv_no }//"1106020001" }
            ]
        }, target: [
			{ type: "GRID", id: "grdData_List", select: false, focus: false }
        ]
    };

    gw_com_module.objRetrieve(args);

};
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdData_List" }
        ]
    };
    gw_com_module.objClear(args);

}
//----------
function processClose(param) {

    var args = { ID: gw_com_api.v_Stream.msg_closeDialogue };
    gw_com_module.streamInterface(args);
    processClear({});

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

}
//---------- Save
function processSave(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdData_List" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args.handler = { success: successSave };
    gw_com_module.objSave(args);

}
//---------- After Saving
function successSave(response, param) {

    $.each(response, function () {
        $.each(this.KEY, function () {
        });
    });

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_selectPart_SCM:
            processRetrieve(param);
            break;
        case gw_com_api.v_Stream.msg_resultMessage: {
            if (param.data.page != gw_com_api.getPageID()) break;
        } break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//