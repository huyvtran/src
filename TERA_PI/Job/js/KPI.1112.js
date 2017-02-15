//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : KPI상세
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
    data: null, logic: {}
};

var r_barcode;

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

        function start() { 
        	gw_job_process.UI(); 
        	gw_job_process.procedure();
            var args = { ID: gw_com_api.v_Stream.msg_openedDialogue };
            gw_com_module.streamInterface(args);
        }
    },

    // manage UI. (design section)
    UI: function () {

        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "닫기", value: "닫기", icon: "닫기" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: false, //remark: "lyrRemark2",
            editable: { focus: "ymd_fr", validate: true },
            content: {
                row: [
                        {
                            element: [
                                {
                                    name: "kpi_group_nm", label: { title: "지표 구분 :" },
                                    editable: { type: "text" }, hidden: true
                                },
                                {
                                    name: "kpi_item_nm", label: { title: "지표 항목 :" },
                                    editable: { type: "text" }, hidden: true
                                },
                                {
                                    name: "ymd_fr", label: { title: "조회 연월 :" },
                                    style: { colfloat: "floating" },
                                    editable: { type: "text" }, hidden: true
                                },
                                {
                                    name: "ymd_to", label: { title: "조회 연월 :" },
                                    editable: { type: "text", validate: { rule: "required" } }
                                },
                                { name: "kpi_group", hidden: true },
                                { name: "kpi_item", hidden: true },
                                { name: "data_tp", hidden: true },
                                { name: "key1", hidden: true },
                                { name: "key_nm1", hidden: true }
                            ]
                        },
                        {
                            align: "right",
                            element: [
                                { name: "실행", value: "실행", act: true, format: { type: "button" } },
                                { name: "취소", value: "취소", format: { type: "button", icon: "닫기" } }
                            ]
                        }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        //createDW({ resize: false });
        ////=====================================================================================
        //var args = {
        //    target: [
		//		{ type: "GRID", id: "grdList_MAIN", offset: 15 }
		//	]
        //};
        ////----------
        //gw_com_module.objResize(args);
        //=====================================================================================
        gw_com_module.informSize();

    },

    //==== manage process. (program section)
    procedure: function () {

        //=====================================================================================
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: viewOption };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption", event: "itemdblclick", handler: processItemdblClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemkeyenter", handler: processItemdblClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: closeOption };
        gw_com_module.eventBind(args);
        //=====================================================================================

        // startup process.
        //----------
        gw_com_module.startPage();
    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//----------
function viewOption(param) {

    var args = { target: [{ id: "frmOption", focus: true }] };
    gw_com_module.objToggle(args);

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

}
//----------
function processItemchanged(param) {


}
//----------
function processItemdblClick(param) {


}
//----------
function processRetrieve(param) {

    var args = { target: [{ type: "FORM", id: "frmOption" }] };
    if (!gw_com_module.objValidate(args)) return;
    if (!createDW({ resize: true })) return;

    args = {
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
                { name: "ymd_fr", argument: "arg_ymd_fr" },
                { name: "ymd_to", argument: "arg_ymd_to" },
                { name: "kpi_item", argument: "arg_kpi_item" },
                { name: "key1", argument: "arg_key1" },
                { name: "data_tp", argument: "arg_data_tp" }
            ]
        },
        target: [
            { type: "GRID", id: "grdList_MAIN", select: true }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

};
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdList_MAIN" }
        ]
    };
    gw_com_module.objClear(args);

}
//----------
function processClose(param) {

    var args = { ID: gw_com_api.v_Stream.msg_closeDialogue };
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
function createDW(param) {

    var kpi_item = gw_com_api.getValue("frmOption", 1, "kpi_item");
    var kpi_item_nm = gw_com_api.getValue("frmOption", 1, "kpi_item_nm");
    var key_nm1 = gw_com_api.getValue("frmOption", 1, "key_nm1");
    var data_tp = gw_com_api.getValue("frmOption", 1, "data_tp");
    var title = key_nm1;    //kpi_item_nm + " - [ " + key_nm1 + " ]";
    var args = {
        targetid: "grdList_MAIN", query: "KPI_1112_1", title: title,
        caption: true, height: 530, pager: true, show: true, selectable: false, dynamic: true,
        //color: { row: true },
        element: []
    };
    //----------
    var table = QUERY.getTable({ kpi_item: kpi_item, data_tp: data_tp });
    if (table == undefined || table.length == 0) {
        processClose({});
        return false;
    }

    $.each(table, function () {
        var ele = {
            name: this.name,
            hidden: this.visible == 1 ? false : true
        };
        if (!ele.hidden) {
            ele.header = this.header;
            ele.width = this.width;
            ele.align = (this.align == "L" ? "left" : this.align == "C" ? "center" : "right");
            if (this.mask != "") {
                ele.mask = this.mask;
            }
        }
        args.element.push(ele);
    });
    //----------
    gw_com_module.gridCreate(args);
    //=====================================================================================
    if (param.resize) {
        var args = {
            target: [
                { type: "GRID", id: "grdList_MAIN", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
    }
    //=====================================================================================
    var args = {
        targetid: "lyrRemark2",
        row: [
            { name: "title" }
        ]
    };
    //----------
    gw_com_module.labelCreate(args);
    //=====================================================================================
    var args = {
        targetid: "lyrRemark2",
        row: [
		    { name: "title", value: "▶ " + kpi_item_nm }
        ]
    };
    //----------
    gw_com_module.labelAssign(args);
    //=====================================================================================

    return true;
}
//----------
var QUERY = {
    getTable: function (param) {
        var rtn = new Array();
        var args = {
            request: "PAGE",
            url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
                    "?QRY_ID=KPI_1112_0" +
                    "&QRY_COLS=name,header,visible,width,align,mask" +
                    "&CRUD=R" +
                    "&arg_kpi_item=" + param.kpi_item + "&arg_data_tp=" + param.data_tp,
            handler_success: successRequest
        };
        //=================== async : false ========================
        $.ajaxSetup({ async: false });
        //----------
        gw_com_module.callRequest(args);
        function successRequest(data) {
            $.each(data, function (i) {
                rtn.push({
                    name: this.DATA[0],
                    header: this.DATA[1],
                    visible: this.DATA[2],
                    width: this.DATA[3],
                    align: this.DATA[4],
                    mask: this.DATA[5]
                });
            });
        }
        //----------
        $.ajaxSetup({ async: true });
        //=================== async : true ========================
        return rtn
    }
}
//----------
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_openedDialogue: {
            var args = {
                to: { type: "POPUP", page: param.from.page },
                ID: param.ID
            };
            if (param.data != undefined) {
                $.each(param.data, function (name, value) {
                    gw_com_api.setValue("frmOption", 1, name, value);
                });
                processRetrieve({});
            }
            gw_com_module.streamInterface(args);

        } break;
        case gw_com_api.v_Stream.msg_closeDialogue: {
            closeDialogue({ page: param.from.page });
        } break;
        case gw_com_api.v_Stream.msg_resultMessage: {
            if (param.data.page != gw_com_api.getPageID()) break;
        } break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//