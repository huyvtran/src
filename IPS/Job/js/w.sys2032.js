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
        gw_com_DX.register();
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
				    type: "PAGE", name: "공지구분", query: "dddw_zcode",
				    param: [
				        { argument: "arg_hcode", value: "SYS211" }
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
            targetid: "lyrMenu_1",
            type: "FREE",
            element: [
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
        var args = { targetid: "lyrMenu_2", type: "FREE",
            element: [
				{ name: "추가", value: "추가" },
				{ name: "삭제", value: "삭제" }
			]
        };
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_공지등록",
            query: "w_sys2032_M_1",
            type: "TABLE",
            title: "공지 등록",
            show: true,
            selectable: true,
            editable: {
                bind: "select",
                focus: "nt_tp",
                validate: true
            },
            content: {
                width: {
                    label: 60,
                    field: 230
                },
                height: 25,
                row: [
                    {
                        element: [
                            {
                                header: true,
                                value: "구분",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "nt_tp",
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "공지구분"
                                    },
                                    validate: {
                                        rule: "required",
                                        message: "구분"
                                    }
                                }
                            },
                            {
                                header: true,
                                value: "공지일자",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "fr_date",
                                mask: "date-ymd",
                                editable: {
                                    type: "text",
                                    validate: {
                                        rule: "required",
                                        message: "공지일자"
                                    }
                                }
                            },
                            {
                                header: true,
                                value: "만료일자",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "to_date",
                                mask: "date-ymd",
                                editable: {
                                    type: "text"
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "제목",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                style: {
                                    colspan: 3
                                },
                                name: "nt_title",
                                format: {
                                    width: 517
                                },
                                editable: {
                                    type: "text",
                                    width: 517,
                                    validate: {
                                        rule: "required",
                                        message: "제목"
                                    }
                                }
                            },
                            {
                                header: true,
                                value: "상태",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "pstat",
                                editable: {
                                    type: "text"
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "대상자",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                style: {
                                    colspan: 5
                                },
                                name: "nt_target",
                                display: true,
                                editable: {
                                    type: "hidden"
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "등록자",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "ins_usr"
                            },
                            {
                                header: true,
                                value: "등록일시",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "ins_dt"
                            },
                            {
                                header: true,
                                value: "수정일시",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "upd_dt"
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                type: "label",
                                value: "비고",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                style: {
                                    colspan: 5
                                },
                                name: "nt_rmk",
                                format: {
                                    type: "textarea",
                                    rows: 5,
                                    width: 810
                                },
                                editable: {
                                    type: "textarea",
                                    rows: 5,
                                    width: 810
                                }
                            },
                            {
                                name: "nt_usr",
                                hidden: true,
                                editable: {
                                    type: "hidden"
                                }
                            },
                            {
                                name: "nt_seq",
                                hidden: true,
                                editable: {
                                    type: "hidden"
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
            targetid: "grdData_첨부파일",
            query: "w_sys2030_S_1",
            title: "첨부 파일",
            caption: true,
            height: "100%",
            pager: false,
            number: true,
            show: true,
            selectable: true,
            editable: {
                multi: true,
                bind: "select",
                focus: "file_desc",
                validate: true
            },
            element: [
				{
				    header: "파일명",
				    name: "file_nm",
				    width: 300,
				    align: "left"
				},
				{
				    header: "다운로드",
				    name: "_download",
				    width: 60,
				    align: "center",
				    format: {
				        type: "link",
				        value: "다운로드"
				    }
				},
				{
				    header: "파일설명",
				    name: "file_desc",
				    width: 450,
				    align: "left",
				    editable: {
				        type: "text"
				    }
				},
                {
                    name: "file_ext",
                    hidden: true
                },
                {
                    name: "file_path",
                    hidden: true
                },
                {
                    name: "network_cd",
                    hidden: true
                },
                {
                    name: "data_tp",
                    hidden: true
                },
                {
                    name: "data_key",
                    hidden: true
                },
                {
                    name: "data_seq",
                    hidden: true
                },
                {
                    name: "file_id",
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
            targetid: "frmData_공지내용",
            query: "w_sys2030_S_2",
            type: "TABLE",
            title: "공지내용",
            caption: true,
            width: "100%",
            scroll: false,
            show: true,
            selectable: true,
            editable: {
                bind: "select",
                focus: "memo_text",
                validate: true
            },
            content: {
                row: [
                    {
                        control: true,
                        element: [
                            {
                                name: "memo_text",
                                hidden: true,
                                editable: {
                                    type: "hidden"
                                },
                                control: {
                                    by: "DX",
                                    type: "htmleditor",
                                    id: ctrl_memo
                                }
                            },
                            {
                                name: "memo_tp",
                                hidden: true,
                                editable: {
                                    type: "hidden"
                                }
                            },
                            {
                                name: "nt_seq",
                                hidden: true,
                                editable: {
                                    type: "hidden"
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
            targetid: "lyrDown",
            width: 0,
            height: 0,
            show: false
        };
        gw_com_module.pageCreate(args);
        //=====================================================================================
        var args = {
            target: [
				{
				    type: "FORM",
				    id: "frmData_공지등록",
				    offset: 8
				},
				{
				    type: "GRID",
				    id: "grdData_첨부파일",
				    offset: 8
				},
				{
				    type: "FORM",
				    id: "frmData_공지내용",
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
    // manage process. (program section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //#region
    procedure: function () {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // define event.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        /*
        //----------
        var args = {
        targetid: "lyrMenu_1",
        element: "대상자",
        event: "click",
        handler: click_lyrMenu_1_대상자
        };
        gw_com_module.eventBind(args);
        */
        //----------
        var args = {
            targetid: "lyrMenu_1",
            element: "저장",
            event: "click",
            handler: click_lyrMenu_1_저장
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_1",
            element: "닫기",
            event: "click",
            handler: click_lyrMenu_1_닫기
        };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "추가", event: "click",
            handler: click_lyrMenu_2_추가
        };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "삭제", event: "click",
            handler: click_lyrMenu_2_삭제
        };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_첨부파일", grid: true, element: "_download", event: "click",
            handler: click_grdData_첨부파일__download
        };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        /*
        //----------
        function click_lyrMenu_1_대상자(ui) {
        }
        */
        //----------
        function click_lyrMenu_1_저장(ui) {

            processSave({});

        }
        //----------
        function click_lyrMenu_1_닫기(ui) {

            v_global.process.handler = processClose;

            if (!checkUpdatable({})) return;

            processClose({});

        }
        //----------
        function click_lyrMenu_2_추가(ui) {

            if (!checkManipulate({})) return;
            if (!checkUpdatable({ check: true })) return false;

            var args = { type: "PAGE", page: "w_upload_notice", title: "파일 업로드",
                width: 650, height: 180, locate: ["center", 180], open: true
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = {
                    page: "w_upload_notice",
                    param: {
                        ID: gw_com_api.v_Stream.msg_upload_NOTICE,
                        data: {
                            user: gw_com_module.v_Session.USR_ID,
                            key: "",
                            seq: gw_com_api.getValue("frmData_공지등록", "selected", "nt_seq")
                        }
                    }
                };
                gw_com_module.dialogueOpen(args);
            }
        }
        //----------
        function click_lyrMenu_2_삭제(ui) {
            if (!checkManipulate({})) return;
            var args = {
                targetid: "grdData_첨부파일",
                row: "selected"
            }
            gw_com_module.gridDelete(args);
        }
        //----------
        function click_grdData_첨부파일__download(ui) {

            var args = {
                source: {
                    id: "grdData_첨부파일",
                    row: ui.row
                },
                targetid: "lyrDown"
            };
            gw_com_module.downloadFile(args);

        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_module.startPage();
        //----------
        v_global.logic.nt_seq = gw_com_api.getPageParameter("nt_seq");
        if (v_global.logic.nt_seq != "") {
            processRetrieve({ key: v_global.logic.nt_seq });
        }
        else {
            var args = {
                targetid: "frmData_공지등록",
                edit: true,
                updatable: true,
                data: [
                    { name: "fr_date", value: gw_com_api.getDate() },
                    { name: "nt_usr", value: gw_com_module.v_Session.USR_NM },
                    { name: "nt_target", value: "전체" }
                ]
            };
            gw_com_module.formInsert(args);
            var args = {
                targetid: "frmData_공지내용",
                updatable: true,
                data: [
                    { name: "memo_tp", value: "HTML" }
                ]
            };
            gw_com_module.formInsert(args);
        }

    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
function checkCRUD(param) {

    return gw_com_api.getCRUD("frmData_공지등록");

}
//----------
function checkManipulate(param) {

    closeOption({});

    if (checkCRUD({}) == "none") {
        gw_com_api.messageBox([
            { text: "NOMASTER" }
        ]);
        return false;
    }
    return true;

}
//----------
function checkUpdatable(param) {

    var args = {
        check: param.check,
        target: [
			{
			    type: "FORM",
			    id: "frmData_공지등록"
			},
			{
			    type: "GRID",
			    id: "grdData_첨부파일"
			},
			{
			    type: "FORM",
			    id: "frmData_공지내용"
			}
		]
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function processRetrieve(param) {

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_nt_seq", value: param.key },
            ]
        },
        target: [
            {
                type: "FORM",
                id: "frmData_공지등록"
            },
			{
			    type: "GRID",
			    id: "grdData_첨부파일"
			},
			{
			    type: "FORM",
			    id: "frmData_공지내용"
			}
		]
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processSave() {

    var args = {
        target: [
			{
			    type: "FORM",
			    id: "frmData_공지등록"
			},
			{
			    type: "GRID",
			    id: "grdData_첨부파일"
			},
			{
			    type: "FORM",
			    id: "frmData_공지내용"
			}
		]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args.handler = {
        success: successSave
    };
    gw_com_module.objSave(args);

}
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closePage
    };
    gw_com_module.streamInterface(args);

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

}
//----------
function closeDialogue(param) {

    var args = {
        page: param.page
    };
    gw_com_module.dialogueClose(args);
    if (param.focus) {
        gw_com_api.setFocus(v_global.event.object,
	                        v_global.event.row,
	                        v_global.event.element,
	                        (v_global.event.type == "GRID") ? true : false);
    }

}
//----------
function successSave(response, param) {

    $.each(response, function () {
        $.each(this.KEY, function () {
            if (this.NAME == "nt_seq")
                processRetrieve({ key: this.VALUE });
        });
    });

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_showMessage:
            {
                gw_com_module.streamInterface(param);
            }
            break;
        case gw_com_api.v_Stream.msg_resultMessage:
            {
                if (param.data.page != gw_com_api.getPageID()) {
                    param.to = {
                        type: "POPUP",
                        page: param.data.page
                    };
                    gw_com_module.streamInterface(param);
                    break;
                }
                switch (param.data.ID) {
                    case gw_com_api.v_Message.msg_confirmSave:
                        {
                            if (param.data.result == "YES")
                                processSave({});
                            else {
                                if (v_global.process.handler != null)
                                    v_global.process.handler({});
                            }
                        }
                        break;
                    case gw_com_api.v_Message.msg_informSaved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_uploaded_NOTICE:
            {
                var args = {
                    source: { type: "FORM", id: "frmData_공지등록",
                        element: [
				            { name: "nt_seq", argument: "arg_nt_seq" }
			            ]
                    },
                    target: [
			            { type: "GRID", id: "grdData_첨부파일" }
		            ]
                };
                gw_com_module.objRetrieve(args);
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = {
                    to: { type: "POPUP", page: param.from.page }
                };
                switch (param.from.page) {
                    case "w_upload_notice":
                        {
                            args.ID = gw_com_api.v_Stream.msg_upload_NOTICE;
                            args.data = {
                                user: gw_com_module.v_Session.USR_ID,
                                key: "",
                                seq: gw_com_api.getValue("frmData_공지등록", 1, "nt_seq")
                            };
                        }
                        break;
                }
                gw_com_module.streamInterface(args);
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                closeDialogue({ page: param.from.page });
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//