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
        //v_global.process.param = gw_com_module.initPage({ message: true });
        //----------
        gw_com_api.changeTheme("style_theme");

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
            targetid: "lyrMenu_1",
            type: "FREE",
            element: [
				{
				    name: "조회",
				    value: "조회1"
				    //act: true
				},
				/*{
				    name: "추가",
				    value: "추가1"
				},
				{
				    name: "삭제",
				    value: "삭제1"
				},
				{
				    name: "저장",
				    value: "저장1"
				},*/
				{
				    name: "닫기",
				    value: "닫기1"
				}
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_2",
            type: "FREE",
            element: [
				{
				    name: "추가",
				    value: "추가1"
				},
				{
				    name: "삭제",
				    value: "삭제1"
				}
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_분류",
            //query: "w_sys1050_M_1",
            title: "코드 분류",
            caption: true,
            height: 165,
            show: true,
            selectable: true,
            editable: {
                master: true,
                bind: "select",
                focus: "mod_id",
                validate: true
            },
            element: [
				{
				    header: "Module",
				    name: "mod_id",
				    width: 60,
				    align: "center",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "Module"
				        }
				    }
				},
				{
				    header: "분류코드",
				    name: "hcode",
				    width: 70,
				    align: "center",
				    editable: {
				        bind: "create",
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "분류코드"
				        }
				    }
				},
				{
				    header: "분류명",
				    name: "hname",
				    width: 180,
				    align: "left",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "분류명"
				        }
				    }
				},
		        {
		            header: "사용",
		            name: "use_yn",
		            width: 40,
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
		        },
		        {
		            header: "고정",
		            name: "sys_yn",
		            width: 40,
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
		        },
				{
				    header: "관리자",
				    name: "role_id",
				    width: 70,
				    align: "center",
				    editable: {
				        type: "text"
				    }
				},
				{
				    header: "테이블",
				    name: "tname",
				    width: 150,
				    align: "left",
				    editable: {
				        type: "text"
				    }
				},
				{
				    header: "컬럼",
				    name: "cname",
				    width: 150,
				    align: "left",
				    editable: {
				        type: "text"
				    }
				},
				{
				    header: "설명",
				    name: "rmk",
				    width: 300,
				    align: "left",
				    editable: {
				        type: "text"
				    }
				}
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_코드",
            query: " ",
            title: "코드 내역",
            caption: true,
            height: 154,
            show: true,
            selectable: true,
            key: true,
            editable: {
                multi: true,
                bind: "select",
                focus: "dname",
                validate: true
            },
            element: [
				{
				    header: "분류코드",
				    name: "hcode",
				    width: 60,
				    align: "center",
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    header: "코드",
				    name: "dcode",
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
				    header: "명칭",
				    name: "dname",
				    width: 300,
				    align: "left",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "명칭"
				        }
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
				    header: "관련코드",
				    name: "rcode",
				    width: 60,
				    align: "center",
				    editable: {
				        type: "text"
				    }
				}/*,
				{
				    header: "문자열1",
				    name: "fcode1",
				    width: 100,
				    align: "left",
				    editable: {
				        type: "text"
				    }
				},
				{
				    header: "문자열2",
				    name: "fcode2",
				    width: 100,
				    align: "left",
				    editable: {
				        type: "text"
				    }
				},
				{
				    header: "문자열3",
				    name: "fcode3",
				    width: 100,
				    align: "left",
				    editable: {
				        type: "text"
				    }
				},
				{
				    header: "문자열4",
				    name: "fcode4",
				    width: 100,
				    align: "left",
				    editable: {
				        type: "text"
				    }
				},
				{
				    header: "문자열5",
				    name: "fcode5",
				    width: 100,
				    align: "left",
				    editable: {
				        type: "text"
				    }
				},
				{
				    header: "숫자값1",
				    name: "dvalue1",
				    width: 70,
				    align: "center",
				    editable: {
				        type: "text"
				    }
				},
				{
				    header: "숫자값2",
				    name: "dvalue2",
				    width: 70,
				    align: "center",
				    editable: {
				        type: "text"
				    }
				},
				{
				    header: "숫자값3",
				    name: "dvalue3",
				    width: 70,
				    align: "center",
				    editable: {
				        type: "text"
				    }
				}*/,
				{
				    header: "비고",
				    name: "rmk",
				    width: 300,
				    align: "left",
				    editable: {
				        type: "text"
				    }
				}
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
				{
				    type: "GRID",
				    id: "grdData_분류",
				    offset: 8
				},
				{
				    type: "GRID",
				    id: "grdData_코드",
				    offset: 8
				}
			]
        };
        //----------
        gw_com_module.objResize(args);

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
        

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_module.startPage();
        //----------
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


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_resultMessage:
            {
                if (param.data.page != gw_com_api.getPageID())
                    break;
                switch (param.data.ID) {
                    case gw_com_api.v_Message.msg_confirmSave:
                        {
                            if (param.data.result == "YES")
                                processSave({});
                            else {
                                var status = checkCRUD({});
                                if (status == "initialize" || status == "create")
                                    processDelete({});
                                else if (status == "update")
                                    processRestore({});
                                if (v_global.process.handler != null)
                                    v_global.process.handler({});
                            }
                        }
                        break;
                    case gw_com_api.v_Message.msg_confirmRemove:
                        {
                            if (param.data.result == "YES")
                                processRemove({});
                        }
                        break;
                    case gw_com_api.v_Message.msg_informSaved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                    case gw_com_api.v_Message.msg_informRemoved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                }
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//