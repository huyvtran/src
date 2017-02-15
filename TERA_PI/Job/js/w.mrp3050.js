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
                    type: "PAGE", name: "부서", query: "dddw_vdept"
                },
                {
                    type: "PAGE", name: "사원", query: "dddw_vemp"
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
				    name: "조회",
				    value: "조회",
				    act: true
				},
				{
				    name: "추가",
				    value: "추가"
				},
				{
				    name: "저장",
				    value: "저장"
				},
				{
				    name: "삭제",
				    value: "삭제"
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
            targetid: "lyrMenu_2",
            type: "FREE",
            element: [
				{
				    name: "추가",
				    value: "추가"
				},
				{
				    name: "삭제",
				    value: "삭제"
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
            border: true,
            show: true,
            editable: {
                focus: "fr_ymd",
                validate: true
            },
            remark: "lyrRemark",
            content: {
                row: [
                    {
                        element: [
                            {
                                style: {
                                    colfloat: "floating"
                                },
                                name: "fr_ymd",
                                label: {
                                    title: "작업일자 :"
                                },
                                mask: "date-ymd",
                                editable: {
                                    type: "text",
                                    size: 7,
                                    maxlength: 10,
                                    validate: {
                                        rule: "required",
                                        message: "작업일자"
                                    }
                                }
                            },
				            {
				                name: "to_ymd",
				                label: {
				                    title: "~"
				                },
				                mask: "date-ymd",
				                editable: {
				                    type: "text",
				                    size: 7,
				                    maxlength: 10,
				                    validate: {
				                        rule: "required",
				                        message: "작업일자"
				                    }
				                }
				            },
				            {
				                name: "work_dept",
				                label: {
				                    title: "작업부서 :"
				                },
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "부서",
				                        unshift: [
				                            { title: "전체", value: "%" }
				                        ]
				                    }
				                }
				            },
				            {
				                name: "work_emp",
				                label: {
				                    title: "작업자 :"
				                },
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "사원",
				                        unshift: [
				                            { title: "전체", value: "%" }
				                        ]
				                    }
				                }
				            },
				            {
				                name: "proj_no",
				                label: {
				                    title: "Project No. :"
				                },
				                editable: {
				                    type: "text",
				                    size: 7,
				                    maxlength: 20
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
            targetid: "grdData_현황",
            query: "w_mrp3050_M_1",
            title: "작업 실적 현황",
            //caption: true,
            height: 147,
            dynamic: true,
            show: true,
            selectable: true,
            element: [
				{
				    header: "부서",
				    name: "work_dept_nm",
				    width: 120,
				    align: "center"
				},
                {
                    header: "작업자",
                    name: "work_emp_nm",
                    width: 70,
                    align: "center"
                },
                {
                    header: "작업일자",
                    name: "work_date",
                    width: 80,
                    align: "center",
                    mask: "date-ymd"
                },
                {
                    header: "Project No.",
                    name: "proj_no",
                    width: 70,
                    align: "center"
                },
                {
                    header: "공정",
                    name: "mprc_nm",
                    width: 200,
                    align: "left"
                },
                {
                    header: "시작시각",
                    name: "str_time",
                    width: 60,
                    align: "center",
                    mask: "time-hm"
                },
                {
                    header: "종료시각",
                    name: "end_time",
                    width: 60,
                    align: "center",
                    mask: "time-hm"
                },
                {
                    header: "작업시간",
                    name: "work_time",
                    width: 60,
                    align: "center",
                    mask: "time-hm"
                },
                {
                    header: "메모",
                    name: "work_rmk",
                    width: 700,
                    align: "left"
                },
                {
                    name: "work_dept",
                    hidden: true
                },
                {
                    name: "work_seq",
                    hidden: true
                },
                {
                    name: "work_emp",
                    hidden: true
                }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_내역",
            query: "w_mrp3050_M_2",
            type: "TABLE",
            title: "작업 실적 내역",
            caption: true,
            show: true,
            selectable: true,
            editable: {
                bind: "select",
                focus: "work_dept",
                validate: true
            },
            content: {
                width: {
                    label: 80,
                    field: 220
                },
                height: 25,
                row: [
                    {
                        element: [
                            {
                                header: true,
                                value: "작업부서",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "work_dept",
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "부서"
                                    },
                                    validate: {
                                        rule: "required",
                                        message: "작업부서"
                                    }
                                }
                            },
                            {
                                header: true,
                                value: "작업자",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "work_emp",
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "사원"
                                    },
                                    validate: {
                                        rule: "required",
                                        message: "작업자"
                                    }
                                }
                            },
                            {
                                header: true,
                                value: "작업일자",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "work_date",
                                mask: "date-ymd",
                                editable: {
                                    type: "text",
                                    validate: {
                                        rule: "required",
                                        message: "작업일자"
                                    }
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "Project No.",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "proj_no",
                                mask: "search",
                                editable: {
                                    type: "text"
                                }
                            },
                            {
                                header: true,
                                value: "프로젝트명",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "proj_nm",
                                display: true,
                                editable: {
                                    type: "hidden"
                                }
                            },
                            {
                                header: true,
                                value: "고객사",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "cust_nm",
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
                                value: "제품유형",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "prod_type",
                                display: true,
                                editable: {
                                    type: "hidden"
                                }
                            },
                            {
                                header: true,
                                value: "공정번호",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "mprc_no",
                                mask: "search",
                                editable: {
                                    type: "text"
                                }
                            },
                            {
                                header: true,
                                value: "공정명",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "mprc_nm",
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
                                value: "시작시각",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "str_time",
                                mask: "time-hm",
                                editable: {
                                    type: "text",
                                    validate: {
                                        rule: "required",
                                        message: "시작시각"
                                    }
                                }
                            },
                            {
                                header: true,
                                value: "종료시각",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "end_time",
                                mask: "time-hm",
                                editable: {
                                    type: "text",
                                    validate: {
                                        rule: "required",
                                        message: "종료시각"
                                    }
                                }
                            },
                            {
                                header: true,
                                value: "작업시간",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "work_time",
                                mask: "time-hm",
                                editable: {
                                    type: "text",
                                    validate: {
                                        rule: "required",
                                        message: "작업시간"
                                    }
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
                                style: {
                                    colspan: 3
                                },
                                name: "ins_dt"
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "메모",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                style: {
                                    colspan: 5
                                },
                                name: "work_rmk"/*,
                                format: {
                                    type: "text",
                                    width: 734
                                },
                                editable: {
                                    type: "text",
                                    width: 734
                                }*/,
                                format: {
                                    type: "textarea",
                                    rows: 3,
                                    width: 734
                                },
                                editable: {
                                    type: "textarea",
                                    rows: 3,
                                    width: 734
                                }
                            },
                            {
                                name: "proj_key",
                                hidden: true,
                                editable: {
                                    type: "hidden"
                                }
                            },
                            {
                                name: "mprc_cd",
                                hidden: true,
                                editable: {
                                    type: "hidden"
                                }
                            },
                            {
                                name: "work_seq",
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
            targetid: "grdData_파일",
            query: "w_mrp3050_D_1",
            title: "첨부 파일",
            caption: true,
            height: "100%",
            pager: false,
            show: true,
            selectable: true,
            number: true,
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
				    name: "download",
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
				    width: 300,
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
				    type: "GRID",
				    id: "grdData_현황",
				    offset: 8
				},
				{
				    type: "FORM",
				    id: "frmData_내역",
				    offset: 8
				},
				{
				    type: "GRID",
				    id: "grdData_파일",
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

        //----------
        var args = {
            targetid: "lyrMenu_1",
            element: "조회",
            event: "click",
            handler: click_lyrMenu_1_조회
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_1",
            element: "추가",
            event: "click",
            handler: click_lyrMenu_1_추가
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_1",
            element: "삭제",
            event: "click",
            handler: click_lyrMenu_1_삭제
        };
        gw_com_module.eventBind(args);
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
        var args = {
            targetid: "lyrMenu_2",
            element: "추가",
            event: "click",
            handler: click_lyrMenu_2_추가
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_2",
            element: "삭제",
            event: "click",
            handler: click_lyrMenu_2_삭제
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption",
            element: "실행",
            event: "click",
            handler: click_frmOption_실행
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption",
            element: "취소",
            event: "click",
            handler: click_frmOption_취소
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_현황",
            grid: true,
            event: "rowselecting",
            handler: rowselecting_grdData_현황
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_현황",
            grid: true,
            event: "rowselected",
            handler: rowselected_grdData_현황
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmData_내역",
            event: "itemdblclick",
            handler: itemdblclick_frmData_내역
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmData_내역",
            event: "itemkeyenter",
            handler: itemdblclick_frmData_내역
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmData_내역",
            event: "itemchanged",
            handler: itemchanged_frmData_내역
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_파일",
            grid: true,
            element: "download",
            event: "click",
            handler: click_grdData_파일_download
        };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_1_조회(ui) {

            var args = {
                target: [
					{
					    id: "frmOption",
					    focus: true
					}
				]
            };
            gw_com_module.objToggle(args);

        }
        //----------
        function click_lyrMenu_1_추가(ui) {

            v_global.process.handler = processInsert;

            if (!checkUpdatable({})) return;

            processInsert({});

        }
        //----------
        function click_lyrMenu_1_삭제(ui) {

            if (!checkManipulate({})) return;

            v_global.process.handler = processRemove;

            checkRemovable({});

        }
        //----------
        function click_lyrMenu_1_저장(ui) {

            closeOption({});
            processSave({});

        }
        //----------
        function click_lyrMenu_1_닫기(ui) {

            checkClosable({});

        }
        //----------
        function click_lyrMenu_2_추가(ui) {

            if (!checkManipulate({})) return;
            if (!checkUpdatable({ check: true })) return false;

            var args = {
                type: "PAGE",
                page: "w_upload_smwork",
                title: "파일 업로드",
                width: 650,
                height: 180,
                locate: ["center", 180],
                open: true
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = {
                    page: "w_upload_smwork",
                    param: {
                        ID: gw_com_api.v_Stream.msg_upload_SMWORK,
                        data: {
                            user: gw_com_module.v_Session.USR_ID,
                            key: gw_com_api.getValue("grdData_현황", "selected", "work_date", true) +
                                    "-" +
                                    gw_com_api.getValue("grdData_현황", "selected", "work_emp", true),
                            seq: gw_com_api.getValue("grdData_현황", "selected", "work_seq", true)
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
                targetid: "grdData_파일",
                row: "selected"
            }
            gw_com_module.gridDelete(args);

        }
        //----------
        function click_frmOption_실행(ui) {

            v_global.process.handler = processRetrieve;

            if (!checkUpdatable({})) return false;

            processRetrieve({});

        }
        //----------
        function click_frmOption_취소(ui) {

            closeOption({});

        }
        //----------
        function rowselecting_grdData_현황(ui) {

            v_global.process.handler = processSelect;
            v_global.process.current.master = ui.row;

            return checkUpdatable({});

        }
        //----------
        function rowselected_grdData_현황(ui) {

            v_global.process.prev.master = ui.row;

            processLink({});

        };
        //----------
        function itemdblclick_frmData_내역(ui) {

            switch (ui.element) {
                case "proj_no":
                    {
                        v_global.event.type = ui.type;
                        v_global.event.object = ui.object;
                        v_global.event.row = ui.row;
                        v_global.event.element = ui.element;
                        var args = {
                            type: "PAGE",
                            page: "w_find_proj_mrp",
                            title: "Project 검색",
                            width: 800,
                            height: 460,
                            open: true
                        };
                        if (gw_com_module.dialoguePrepare(args) == false) {
                            var args = {
                                page: "w_find_proj_mrp",
                                param: {
                                    ID: gw_com_api.v_Stream.msg_selectProject_MRP
                                }
                            };
                            gw_com_module.dialogueOpen(args);
                        }
                    }
                    break;
                case "mprc_no":
                    {
                        v_global.event.type = ui.type;
                        v_global.event.object = ui.object;
                        v_global.event.row = ui.row;
                        v_global.event.element = ui.element;
                        var args = {
                            type: "PAGE",
                            page: "w_find_proc_mrp",
                            title: "공정 검색",
                            width: 600,
                            height: 460,
                            open: true
                        };
                        if (gw_com_module.dialoguePrepare(args) == false) {
                            var args = {
                                page: "w_find_proc_mrp",
                                param: {
                                    ID: gw_com_api.v_Stream.msg_selectProcess_MRP,
                                    data: {
                                        proj_no: gw_com_api.getValue("frmData_내역", 1, "proj_no")
                                    }
                                }
                            };
                            gw_com_module.dialogueOpen(args);
                        }
                    }
                    break;
            }
        }
        //----------
        function itemchanged_frmData_내역(ui) {

            switch (ui.element) {
                case "str_time":
                    {
                        var fr = gw_com_api.getValue("frmData_내역", 1, "str_time");
                        var to = gw_com_api.getValue("frmData_내역", 1, "end_time");
                        if (fr.length < 4 || (fr * 1) <= 0)
                            gw_com_api.messageBox([
                                { text: "시각을 올바르게 입력해 주세요." }
                            ]);
                        else if (to.length < 4 || (to * 1) <= 0)
                            break;
                        else if ((to * 1) < (fr * 1))
                            gw_com_api.messageBox([
                                { text: "종료 시각은 시작 시각보다 커야 합니다." }
                            ]);
                        else {
                            var frH = fr.substr(0, 2), frM = fr.substr(2, 2);
                            var toH = to.substr(0, 2), toM = to.substr(2, 2);
                            frM = ((frH * 60) + (frM * 1)), toM = ((toH * 60) + (toM * 1));
                            var during = toM - frM;
                            var workH = parseInt(during / 60), workM = parseInt(during % 60);
                            gw_com_api.setValue("frmData_내역", 1, "work_time",
                                gw_com_api.prefixNumber(workH, 2) + gw_com_api.prefixNumber(workM, 2));
                        }
                    }
                    break;
                case "end_time":
                    {
                        var fr = gw_com_api.getValue("frmData_내역", 1, "str_time");
                        var to = gw_com_api.getValue("frmData_내역", 1, "end_time");
                        if (to.length < 4 || (to * 1) <= 0)
                            gw_com_api.messageBox([
                                { text: "시각을 올바르게 입력해 주세요." }
                            ]);
                        else if (fr.length < 4 || (fr * 1) <= 0)
                            break;
                        else if ((to * 1) < (fr * 1))
                            gw_com_api.messageBox([
                                { text: "종료 시각은 시작 시각보다 커야 합니다." }
                            ]);
                        else {
                            var frH = fr.substr(0, 2), frM = fr.substr(2, 2);
                            var toH = to.substr(0, 2), toM = to.substr(2, 2);
                            frM = ((frH * 60) + (frM * 1)), toM = ((toH * 60) + (toM * 1));
                            var during = toM - frM;
                            var workH = parseInt(during / 60), workM = parseInt(during % 60);
                            gw_com_api.setValue("frmData_내역", 1, "work_time",
                                gw_com_api.prefixNumber(workH, 2) + gw_com_api.prefixNumber(workM, 2));
                        }
                    }
                    break;
            }

        };
        //----------
        function click_grdData_파일_download(ui) {

            var args = {
                source: {
                    id: "grdData_파일",
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
        gw_com_api.setValue("frmOption", 1, "fr_ymd", gw_com_api.getDate("", { day: -10 }));
        gw_com_api.setValue("frmOption", 1, "to_ymd", gw_com_api.getDate(""));
        //----------
        gw_com_module.startPage();

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

    return gw_com_api.getCRUD("frmData_내역");

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

    closeOption({});

    var args = {
        check: param.check,
        target: [
            {
                type: "FORM",
                id: "frmData_내역"
            },
            {
                type: "GRID",
                id: "grdData_파일"
            }
		]
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function checkRemovable(param) {

    var status = checkCRUD({});
    if (status == "initialize" || status == "create")
        processClear({});
    else
        gw_com_api.messageBox([
            { text: "REMOVE" }
        ], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO");

}
//----------
function checkClosable(param) {

    closeOption({});

    v_global.process.handler = processClose;

    if (!checkUpdatable({})) return;

    processClose({});

}
//----------
function processRetrieve(param) {

    var args = {
        target: [
	        {
	            type: "FORM",
	            id: "frmOption"
	        }
        ]
    };
    if (gw_com_module.objValidate(args) == false) {
        processClear({ master: true });
        return false;
    }

    if (param.key != undefined) {
        $.each(param.key, function () {
            if (this.QUERY == "w_mrp3050_M_2")
                this.QUERY = "w_mrp3050_M_1";
        });
    }
    var args = {
        source: {
            type: "FORM",
            id: "frmOption",
            hide: true,
            element: [
                {
                    name: "fr_ymd",
                    argument: "arg_fr_ymd"
                },
				{
				    name: "to_ymd",
				    argument: "arg_to_ymd"
				},
				{
				    name: "work_dept",
				    argument: "arg_work_dept"
				},
				{
				    name: "work_emp",
				    argument: "arg_work_emp"
				},
				{
				    name: "proj_no",
				    argument: "arg_proj_no"
				}
			],
            remark: [
                {
                    infix: "~",
                    element: [
	                    { name: "fr_ymd" },
		                { name: "to_ymd" }
		            ]
                },
		        {
		            element: [{ name: "work_dept"}]
		        },
		        {
		            element: [{ name: "work_emp"}]
		        },
		        {
		            element: [{ name: "proj_no"}]
		        }
		    ]
        },
        target: [
			{
			    type: "GRID",
			    id: "grdData_현황",
			    select: true
			}
		],
        clear: [
		    {
		        type: "FORM",
		        id: "frmData_내역"
		    },
            {
                type: "GRID",
                id: "grdData_파일"
            }
		],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {

    var args = {
        source: {
            type: "GRID",
            id: "grdData_현황",
            row: "selected",
            block: true,
            element: [
				{
				    name: "work_date",
				    argument: "arg_work_date"
				},
                {
                    name: "work_emp",
                    argument: "arg_work_emp"
                },
                {
                    name: "work_seq",
                    argument: "arg_work_seq"
                }
			]
        },
        target: [
            {
                type: "FORM",
                id: "frmData_내역"
            },
            {
                type: "GRID",
                id: "grdData_파일"
            }
		],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processSelect(param) {

    gw_com_api.selectRow("grdData_현황", v_global.process.current.master, true, false);

}
//----------
function processInsert(param) {

    gw_com_api.selectRow("grdData_현황", "reset");
    var args = {
        targetid: "frmData_내역",
        edit: true,
        updatable: true,
        data: [
            { name: "work_date", value: gw_com_api.getDate() },
            { name: "work_dept", value: gw_com_module.v_Session.DEPT_CD },
            { name: "work_emp", value: gw_com_module.v_Session.EMP_NO },
            { name: "str_time", value: "0900" },
            { name: "end_time", value: "0900" },
            { name: "work_time", value: "0000" }
        ],
        clear: [
            {
                type: "GRID",
                id: "grdData_파일"
            }
	    ]
    };
    gw_com_module.formInsert(args);

}
//----------
function processDelete(param) {

    var args = {
        targetid: "grdData_현황",
        row: "selected",
        clear: [
            {
                type: "FORM",
                id: "frmData_내역"
            },
            {
                type: "GRID",
                id: "grdData_파일"
            }
        ]
    };
    gw_com_module.gridDelete(args);

}
//----------
function processSave(param) {

    var args = {
        target: [
            {
                type: "FORM",
                id: "frmData_내역"
            },
            {
                type: "GRID",
                id: "grdData_파일"
            }
		]
    };
    if (gw_com_module.objValidate(args) == false) return false;
    var fr = gw_com_api.getValue("frmData_내역", 1, "str_time");
    var to = gw_com_api.getValue("frmData_내역", 1, "end_time");
    var during = gw_com_api.getValue("frmData_내역", 1, "work_time");
    if (fr.length < 4 || (fr * 1) <= 0) {
        gw_com_api.messageBox([
            { text: "시작 시각을 확인해 주세요." }
        ]);
        gw_com_api.setError(true, "frmData_내역", 1, "str_time", false);
        return false;
    }
    else if (to.length < 4 || (to * 1) <= 0) {
        gw_com_api.messageBox([
            { text: "종료 시각을 확인해 주세요." }
        ]);
        gw_com_api.setError(true, "frmData_내역", 1, "end_time", false);
        gw_com_api.setError(false, "frmData_내역", 1, "str_time", false);
        return false;
    }
    else if (during.length < 4 || (during * 1) <= 0) {
        gw_com_api.messageBox([
            { text: "작업 시간을 확인해 주세요." }
        ]);
        gw_com_api.setError(true, "frmData_내역", 1, "work_time", false);
        gw_com_api.setError(false, "frmData_내역", 1, "str_time", false);
        gw_com_api.setError(false, "frmData_내역", 1, "end_time", false);
        return false;
    }
    else if ((to * 1) < (fr * 1)) {
        gw_com_api.messageBox([
            { text: "종료 시각은 시작 시각보다 커야 합니다." }
        ]);
        gw_com_api.setError(true, "frmData_내역", 1, "str_time", false);
        gw_com_api.setError(true, "frmData_내역", 1, "end_time", false);
        gw_com_api.setError(false, "frmData_내역", 1, "work_time", false);
        return false;
    }
    gw_com_api.setError(false, "frmData_내역", 1, "str_time", false);
    gw_com_api.setError(false, "frmData_내역", 1, "end_time", false);
    gw_com_api.setError(false, "frmData_내역", 1, "work_time", false);

    args.handler = {
        success: successSave
    };
    gw_com_module.objSave(args);

}
//----------
function processRemove(param) {

    var args = {
        target: [
		    {
		        type: "GRID",
		        id: "grdData_현황",
		        key: [
		            {
		                row: "selected",
		                element: [
		                    { name: "work_date" },
                            { name: "work_emp" },
                            { name: "work_seq" }
		                ]
		            }
		        ]
		    }
	    ],
        handler: {
            success: successRemove
        }
    };
    gw_com_module.objRemove(args);

}
//----------
function processClear(param) {

    var args = {
        target: [
            {
                type: "FORM",
                id: "frmData_내역"
            },
            {
                type: "GRID",
                id: "grdData_파일"
            }
        ]
    };
    if (param.master)
        args.target.unshift({
            type: "GRID",
            id: "grdData_현황"
        });
    gw_com_module.objClear(args);

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

    var status = checkCRUD({});
    if (status == "create" || status == "update")
        processRetrieve({ key: response });
    else
        processLink({ key: response });

}
//----------
function successRemove(response, param) {

    processDelete({});

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
        case gw_com_api.v_Stream.msg_selectedProject_MRP:
            {
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "proj_no",
			                        param.data.proj_no,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "proj_nm",
			                        param.data.proj_nm,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "cust_nm",
			                        param.data.cust_nm,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "prod_type",
			                        param.data.prod_type,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "proj_key",
			                        param.data.proj_key,
			                        (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedProcess_MRP:
            {
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "mprc_no",
			                        param.data.mprc_no,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "mprc_nm",
			                        param.data.mprc_nm,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "mprc_cd",
			                        param.data.mprc_cd,
			                        (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
        case gw_com_api.v_Stream.msg_uploaded_SMWORK:
            {
                var args = {
                    source: {
                        type: "GRID",
                        id: "grdData_현황",
                        row: "selected",
                        element: [
				            {
				                name: "work_date",
				                argument: "arg_work_date"
				            },
                            {
                                name: "work_emp",
                                argument: "arg_work_emp"
                            },
                            {
                                name: "work_seq",
                                argument: "arg_work_seq"
                            }
			            ]
                    },
                    target: [
			            {
			                type: "GRID",
			                id: "grdData_파일",
			                select: true
			            }
		            ],
                    key: param.key
                };
                gw_com_module.objRetrieve(args);
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = {
                    to: {
                        type: "POPUP",
                        page: param.from.page
                    }
                };
                switch (param.from.page) {
                    case "w_find_proj_mrp":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectProject_MRP;
                        }
                        break;
                    case "w_find_proc_mrp":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectProcess_MRP;
                            args.data = {
                                proj_no: gw_com_api.getValue("frmData_내역", 1, "proj_no")
                            };
                        }
                        break;
                    case "w_upload_smwork":
                        {
                            args.ID = gw_com_api.v_Stream.msg_upload_SMWORK;
                            args.data = {
                                user: gw_com_module.v_Session.USR_ID,
                                key: gw_com_api.getValue("grdData_현황", "selected", "work_date", true) +
                                        "-" +
                                        gw_com_api.getValue("grdData_현황", "selected", "work_emp", true),
                                seq: gw_com_api.getValue("grdData_현황", "selected", "work_seq", true)
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