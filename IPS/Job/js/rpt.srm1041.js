//------------------------------------------
// Process about Job Process.
//                Created by Professor.X, GoodWare (2011.04)
//------------------------------------------

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var v_global = {
    event: {
        type: null,
        object: null,
        row: null,
        element: null
    },
    process: {
        param: null,
        entry: null,
        act: null,
        handler: null,
        current: {},
        prev: {}
    },
    logic: {}
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
            targetid: "frmOverview",
            type: "REPORT",
            title: "Overview",
            show: true,
            content: {
                cols: 79,
                width: 15,
                height: 30,
                row: [
                    {
                        element: [
                            {
                                cols: 8,
                                type: "label",
                                value: "발주사",
                                header: true
                            },
                            {
                                cols: 20,
                                name: "order_nm",
                                value: "(주)원익아이피에스",
                                align: "center"
                            },
                            {
                                cols: 25,
                                rows: 4,
                                type: "label",
                                value: "납&nbsp;&nbsp;품&nbsp;&nbsp;서",
                                font: {
                                    size: 24,
                                    bold: true
                                },
                                header: true
                            },
                            {
                                cols: 14,
                                type: "label",
                                value: "납품자",
                                header: true
                            },
                            {
                                cols: 14,
                                type: "label",
                                value: "인수자",
                                header: true
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                cols: 8,
                                type: "label",
                                value: "공급사",
                                header: true
                            },
                            {
                                cols: 20,
                                name: "supp_nm",
                                align: "center"
                            },
                            {
                                cols: 14,
                                rows: 2,
                                name: "dlv_man"
                            },
                            {
                                cols: 14,
                                rows: 2,
                                name: "recv_man"
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                cols: 8,
                                type: "label",
                                value: "납품일",
                                header: true
                            },
                            {
                                cols: 20,
                                name: "dlv_date",
                                align: "center"
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                cols: 8,
                                type: "label",
                                value: "검수일",
                                header: true
                            },
                            {
                                cols: 20,
                                name: "chk_dt",
                                align: "center"
                            },
                            {
                                cols: 14,
                                name: "reserved_1"
                            },
                            {
                                cols: 14,
                                name: "reserved_2"
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
            targetid: "grdData_현황",
            query: "w_srm1041_2",
            title: "납품 현황",
            height: "100%",
            show: true,
            number: true,
            selectable: true,
            dynamic: true,
            key: true,
            element: [
                {
                    header: "품번",
                    name: "item_cd",
                    width: 100,
                    align: "center"
                },
                {
                    header: "품명",
                    name: "item_nm",
                    width: 300,
                    align: "left"
                },
                {
                    header: "규격",
                    name: "item_spec",
                    width: 300,
                    align: "left"
                },
                {
                    header: "Project",
                    name: "proj_no",
                    width: 100,
                    align: "center"
                },
                {
                    header: "Pallet",
                    name: "prc_cd",
                    width: 100,
                    align: "center"
                },
                {
                    header: "단위",
                    name: "pur_unit",
                    width: 60,
                    align: "center"
                },
                {
                    header: "수량",
                    name: "dlv_qty",
                    width: 60,
                    align: "center"
                },
				{
				    header: "납기요청일",
				    name: "req_date",
				    width: 90,
				    align: "center",
				    mask: "date-ymd"
				}
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                {
                    type: "FORM",
                    id: "frmOverview",
                    offset: 8
                },
				{
				    type: "GRID",
				    id: "grdData_현황",
				    offset: 8
				}
			]
        };
        //----------
        //gw_com_module.objResize(args);
        //=====================================================================================
        //----------
        gw_com_module.informSize();

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // go next.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
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
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_module.startPage();
        //----------
        gw_com_api.setValue("frmOverview", 1, "supp_nm", gw_com_api.getPageParameter("supp_nm"));
        gw_com_api.setValue("frmOverview", 1, "dlv_date", gw_com_api.Mask(gw_com_api.getPageParameter("dlv_date"), "date-ymd"));
        processRetrieve({});

    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
function processRetrieve(param) {

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_pur_no", value: gw_com_api.getPageParameter("pur_no") },
                { name: "arg_ymd_fr", value: gw_com_api.getPageParameter("dlv_date") },
                { name: "arg_ymd_to", value: gw_com_api.getPageParameter("dlv_date") },
                { name: "arg_supp_cd", value: gw_com_api.getPageParameter("supp_cd") }
            ]
        },
        target: [
			{
			    type: "GRID",
			    id: "grdData_현황"
			}
		],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processPrint(param) {

    window.print();

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//