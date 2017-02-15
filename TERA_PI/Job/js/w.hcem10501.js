//------------------------------------------
// Process about Job Process.
//                Created by Professor.X, GoodWare (2011.03.03)
//------------------------------------------

var gw_job_process = {

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // entry point. (pre-process section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //#region
    ready: function() {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // initialize page.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        var l_param = gw_com_module.initPage();

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set data.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        var args = {
            request: [
		            {
		                type: "INLINE", name: "화폐",
		                data: [
				            { title: "원화(\\)", value: "0" },
				            { title: "엔화(￥)", value: "1" },
				            { title: "달러($)", value: "2" }
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
    UI: function() {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // define UI.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        var args = {
            targetid: "lyrMenu_1",
            type: "FREE",
            element: [
				{
				    name: "조회",
				    value: "조회"
				},
                {
                    name: "추가",
                    value: "추가"
                },
				{
				    name: "삭제",
				    value: "삭제"
				},
				{
				    name: "저장",
				    value: "저장"
				},
				{
				    name: "닫기",
				    value: "닫기"
				}
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_을지목록",
            query: "w_hcem10501_M_1",
            title: "을지목록",
            caption: "[ 을지목록 ]",
            remark: true,
            height: "400",
            number: true,
            show: true,
            selectable: true,
            element: [
				{
				    header: "모델타입명",
				    name: "model_class_nm",
				    width: 200,
				    align: "left"
				},
				{
				    header: "등록일자",
				    name: "ins_dt",
				    width: 150,
				    align: "center"
				},
				{
				    header: "등록사원",
				    name: "ins_usr_nm",
				    width: 100,
				    align: "center"
				},
				{
				    header: "변경일자",
				    name: "upd_usr_nm",
				    width: 150,
				    align: "center"
				},
				{
				    header: "변경사원",
				    name: "upd_usr_nm",
				    width: 100,
				    align: "center"
				}
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_세부내역서",
            query: "w_hcem10501_M_2",
            title: "세부내역서",
            caption: "[ 세부내역서 ]",
            height: "400",
            show: true,
            selectable: true,
            editable: {
                multi: true,
                bind: "select",
                focus: "pers_name",
                validate: true
            },
            element: [
				{
				    header: "품명",
				    name: "mat_nm",
				    width: 200,
				    align: "center",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "품명"
				        }
				    }
				},
				{
				    header: "규격",
				    name: "mat_spec",
				    width: 200,
				    align: "center",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "규격"
				        }
				    }
				},
				{
				    header: "단위",
				    name: "mat_unit",
				    width: 80,
				    align: "center",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "단위"
				        }
				    }
				},
				{
				    header: "화폐",
				    name: "moneytary_unit",
				    width: 80,
				    align: "center",
				    editable: {
				        type: "select",
				        size: 1,
				        data: {
				            memory: "화폐"
				        },
				        validate: {
				            rule: "required",
				            message: "화폐"
				        }
				    }
				},
				{
				    header: "수량",
				    name: "item_qty",
				    width: 80,
				    align: "center",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "수량"
				        }
				    }
				},
				{
				    header: "비고",
				    name: "rmk",
				    width: 300,
				    align: "center",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "비고"
				        }
				    }
				}
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            tabid: "lyrTab",
            collapsible: true,
            target: [
				{
				    id: "grdData_을지목록",
				    title: "을지목록"
				},
				{
				    id: "grdData_세부내역서",
				    title: "세부내역서"
				}

			]
        };
        //----------
        gw_com_module.convertTab(args);
        //=====================================================================================
        var args = {
            target: [
				{
				    type: "GRID",
				    id: "grdData_을지목록",
				    offset: 8
				},
				{
				    type: "GRID",
				    id: "grdData_세부내역서",
				    offset: 8
				},
				{
				    type: "TAB",
				    id: "lyrTab",
				    offset: 8
				}
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
    // manage process. (programmable section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //#region
    procedure: function() {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // declare variables.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        var l_current = {
            param: gw_com_api.getPageParameter("PARAM"),
            act: "NONE",
            row: 0
        };

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_module.startPage();

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // define event.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //~~~~~~~~~
        // Button.
        //~~~~~~~~~
        //----------
        var args = {
            targetid: "lyrMenu_1",
            element: "조회",
            event: "click",
            handler: click_lyrMenu_1_조회
        };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //~~~~~~~~~
        // Button.
        //~~~~~~~~~
        //----------
        function click_lyrMenu_1_조회() {

            var args = {
                param: "&argModel_cd=" + l_current.param,
                target: [
					{
					    type: "GRID",
					    id: "grdData_을지목록"
					},
					{
					    type: "GRID",
					    id: "grdData_세부내역서"
					}
				]
            };
            gw_com_module.objRetrieve(args);
            
        }

    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//