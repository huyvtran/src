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
        //----------
        gw_com_api.changeTheme("style_theme");

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set data.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        var args = {
            request: [
                {
                    type: "PAGE", name: "권한", query: "dddw_role"
                }
			],
            starter: start
        };
        //gw_com_module.selectSet(args);
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
            targetid: "lyrMenu",
            type: "FREE",
            element: [
				{
				    name: "조회",
				    value: "조회",
				    //act: true
				},
                /*{
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
				},*/
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
            targetid: "frmOption",
            type: "FREE",
            title: "조회 조건",
            trans: true,
            //show: true,
            border: true,
            margin: 240,
            editable: {
                focus: "role_nm",
                validate: true
            },
            remark: "lyrRemark",
            content: {
                row: [
                    {
                        element: [
				            {
				                name: "role_nm",
				                label: {
				                    title: "권한명 :"
				                },
				                editable: {
				                    type: "text",
				                    size: 15,
				                    maxlength: 50
				                }
				            }
				        ]
                    },
                    {
                        align: "right",
                        element: [
				            {
				                name: "실행",
				                value: "실행",
				                act: true,
				                format: {
				                    type: "button"
				                }
				            },
				            {
				                name: "취소",
				                value: "취소",
				                format: {
				                    type: "button",
				                    icon: "닫기"
				                }
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
            targetid: "grdData_권한",
            query: "SYS_2020_M_2",
            title: "Grid_01",
            width: 432,
            height: 400,
            show: true,
            selectable: true,
            editable: {
                master: true,
                bind: "select",
                focus: "use_yn",
                validate: true
            },
            element: [
                {
                    header: "코드",
                    name: "role_id",
                    width: 60,
                    align: "center",
                    editable: {
                        bind: "create",
                        type: "text",
                        validate: {
                            rule: "required",
                            message: "코드"
                        }
                    }
                },
				{
				    header: "권한명칭",
				    name: "role_nm",
				    width: 180,
				    align: "left",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "권한명칭"
				        }
				    }
				},
				{
				    header: "인원",
				    name: "user_cnt",
				    width: 50,
				    align: "center"
				},
				{
				    header: "순번",
				    name: "sort_seq",
				    width: 50,
				    align: "center",
				    editable: {
				        type: "text"
				    }
				},
				{
				    header: "사용",
				    name: "use_yn",
				    width: 50,
				    align: "center",
				    format: {
				        type: "checkbox",
				        title: "",
				        value: "1",
				        offval: "0"
				    },
				    editable: {
				        type: "checkbox",
				        title: "",
				        value: "1",
				        offval: "0"
				    }
				}
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_메뉴",
            query: "SYS_2020_S_1",
            title: "메뉴별 권한",
            height: 400,
            show: true,
            selectable: true,
            editable: {
                multi: true,
                bind: "select",
                focus: "ret_yn",
                validate: true
            },
            element: [
				{
				    header: "메뉴명",
				    name: "menu_name",
				    width: 200,
				    align: "left"
				},
				{
				    header: "허용",
				    name: "ret_yn",
				    width: 60,
				    align: "center",
				    format: {
				        type: "checkbox",
				        title: "",
				        value: "1",
				        offval: "0"
				    },
				    editable: {
				        type: "checkbox",
				        title: "",
				        value: "1",
				        offval: "0"
				    }
				}/*,
				{
				    header: "수정",
				    name: "upd_yn",
				    width: 60,
				    align: "center",
				    format: {
				        type: "checkbox",
				        title: "",
				        value: "1",
				        offval: "0"
				    },
				    editable: {
				        type: "checkbox",
				        title: "",
				        value: "1",
				        offval: "0"
				    }
				}*/,
				{
				    name: "role_id",
				    hidden: true,
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    name: "menu_id",
				    hidden: true,
				    editable: {
				        type: "hidden"
				    }
				}
			]
        };
        //----------
        //gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_사용자",
            query: "SYS_2020_S_3",
            title: "사용자 정보",
            height: 400,
            show: true,
            selectable: true,
            editable: {
                multi: true,
                bind: "select",
                focus: "role_id",
                validate: true
            },
            element: [
				{
				    header: "사용자명",
				    name: "user_nm",
				    width: 70,
				    align: "center"

				},
				{
				    header: "사번",
				    name: "emp_no",
				    width: 70,
				    align: "center"
				},
				{
				    header: "부서",
				    name: "dept_nm",
				    width: 80,
				    align: "center"
				},
				{
				    header: "호칭",
				    name: "pos_nm",
				    width: 60,
				    align: "center"
				},
				{
				    header: "권한",
				    name: "role_id",
				    width: 140,
				    align: "center",
				    format: {
				        type: "select",
				        data: {
				            memory: "권한"
				        }
				    },
				    editable: {
				        type: "select",
				        data: {
				            memory: "권한"
				        }
				    }
				},
				{
				    name: "user_id",
				    hidden: true,
				    editable: {
				        type: "hidden"
				    }
				}
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            tabid: "lyrTab_1",
            target: [
				{
				    type: "GRID",
				    id: "grdData_권한",
				    title: "권한 목록"
				}
			]
        };
        //----------
        gw_com_module.convertTab(args);
        //=====================================================================================
        var args = {
            tabid: "lyrTab_2",
            target: [
				/*{
				    type: "GRID",
				    id: "grdData_메뉴",
				    title: "메뉴별 권한"
				},*/
				{
				    type: "GRID",
				    id: "grdData_사용자",
				    title: "사용자 정보"
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
				    id: "grdData_메뉴",
				    offset: 8
				},
				{
				    type: "GRID",
				    id: "grdData_사용자",
				    offset: 8
				},
				{
				    type: "TAB",
				    id: "lyrTab_2",
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

        //----------
        gw_job_process.procedure();
        //----------

    },
    //#endregion

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage process. (program section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //#region
    procedure: function () {


        gw_com_module.startPage();

    }
    //#endregion

};


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//