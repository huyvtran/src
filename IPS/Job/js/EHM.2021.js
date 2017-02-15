//--------------------------------------------
// 화면명 : AS 발생 현황
//---------------------------------------------

var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: {  param: null,  entry: null, act: null, handler: null, current: {},  prev: {} },
    logic: {}
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// process class: ready(), UI(), procedure() 형태로 변경한다.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var gw_job_process = {

    //#region
    ready: function () {
        // initialize page. 
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        // set data.

        var args = {
            request: [
				{
				    type: "PAGE", name: "설비군", query: "DDDW_CM_CODE",
				    param: [{ argument: "arg_hcode", value: "IEHM06" }]
				},
				{
				    type: "PAGE", name: "제품유형", query: "DDDW_CM_CODE",
				    param: [{ argument: "arg_hcode", value: "ISCM25" }]
				},
                {
                    type: "PAGE", name: "고객사", query: "DDDW_CM_CODE",
                    param: [{ argument: "arg_hcode", value: "ISCM29" }]
                },
				{
				    type: "PAGE", name: "LINE", query: "DDDW_CM_CODED",
				    param: [{ argument: "arg_hcode", value: "IEHM02" }]
				},
                {
                    type: "PAGE", name: "발생구분", query: "DDDW_ISSUE_TP",
                    param: [{ argument: "arg_rcode", value: "AS" }]
                },
                {
                    type: "INLINE", name: "Warranty",
                    data: [{ title: "IN", value: "IN" }, { title: "OUT", value: "OUT" }]
                },
                {
                    type: "INLINE", name: "YesNo",
                    data: [{ title: "Yes", value: "1" }, { title: "No", value: "0" }]
                },
                {
                    type: "INLINE", name: "중요도",
                    data: [{ title: "상", value: "상" }, { title: "중", value: "중" }, { title: "하", value: "하" }]
                },
				{
				    type: "PAGE", name: "상태", query: "DDDW_CM_CODE",
				    param: [{ argument: "arg_hcode", value: "IEHM13" }]
				},
				{
				    type: "PAGE", name: "모듈", query: "DDDW_CM_CODE",
				    param: [{ argument: "arg_hcode", value: "IEHM05" }]
				},

                {
                    type: "PAGE", name: "발생현상(대)", query: "DDDW_CM_FCODE1",
                    param: [{ argument: "arg_hcode", value: "IEHM21" }]
                },
                /*
                {
                    type: "PAGE", name: "현상분류", query: "DDDW_CM_CODEF1",
                    param: [{ argument: "arg_hcode", value: "IEHM21" }]
                },
				{
				    type: "PAGE", name: "현상구분", query: "DDDW_CM_CODEF",
				    param: [{ argument: "arg_hcode", value: "IEHM31" }]
				},
				{
				    type: "PAGE", name: "원인부위분류", query: "DDDW_CM_CODEF",
				    param: [{ argument: "arg_hcode", value: "IEHM22" }]
				},
                {
                    type: "PAGE", name: "원인부위구분", query: "DDDW_CM_CODEF",
                    param: [{ argument: "arg_hcode", value: "IEHM32" }]
                },
				{
				    type: "PAGE", name: "원인분류", query: "DDDW_CM_CODEF",
				    param: [{ argument: "arg_hcode", value: "IEHM23" }]
				},
				{
				    type: "PAGE", name: "원인구분", query: "DDDW_CM_CODEF",
				    param: [{ argument: "arg_hcode", value: "IEHM33" }]
				},
                {
                    type: "PAGE", name: "귀책분류", query: "DDDW_CM_CODEF",
                    param: [{ argument: "arg_hcode", value: "IEHM25" }]
                },
				{
				    type: "PAGE", name: "귀책구분", query: "DDDW_CM_CODEF",
				    param: [{ argument: "arg_hcode", value: "IEHM35" }]
				},
				{
				    type: "PAGE", name: "조치분류", query: "DDDW_CM_CODEF",
				    param: [{ argument: "arg_hcode", value: "IEHM24" }]
				},
				{
				    type: "PAGE", name: "조치구분", query: "DDDW_CM_CODEF",
				    param: [{ argument: "arg_hcode", value: "IEHM34" }]
				},
				{
				    type: "PAGE", name: "조치상태", query: "DDDW_CM_CODE",
				    param: [{ argument: "arg_hcode", value: "IEHM13" }]
				},
				{
				    type: "PAGE", name: "교체구분", query: "DDDW_CM_CODE",
				    param: [{ argument: "arg_hcode", value: "IEHM12" }]
				},
				{
				    type: "PAGE", name: "부품상태", query: "DDDW_CM_CODE",
				    param: [{ argument: "arg_hcode", value: "IEHM40" }]
				},
				{
				    type: "PAGE", name: "부품군", query: "DDDW_CM_CODEF",
				    param: [{ argument: "arg_hcode", value: "IEHM29" }]
				},
                */
				{
				    type: "PAGE", name: "진행상태", query: "DDDW_CM_CODE",
				    param: [{ argument: "arg_hcode", value: "IEHM10" }]
				},
                {
                    type: "INLINE", name: "보기",
                    data: [{ title: "축약", value: "S" }, { title: "확장", value: "L" }]
                },
				{
				    type: "PAGE", name: "DEPT_AREA_FIND", query: "dddw_deptarea",
				    param: [{ argument: "arg_type", value: gw_com_module.v_Session.DEPT_AUTH }]
				},
				{
				    type: "PAGE", name: "1차원인", query: "DDDW_CM_CODE",
				    param: [{ argument: "arg_hcode", value: "IEHM73" }]
				},
                {
                    type: "INLINE", name: "유/무",
                    data: [{ title: "유", value: "1" }, { title: "무", value: "0" }]
                },
                {
                    type: "INLINE", name: "준수여부",
                    data: [{ title: "준수", value: "1" }, { title: "미준수", value: "0" }]
                }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);


        // go next.

        function start() {

            gw_job_process.UI();

            //---  위 부분에 procedure() 함수를 추가해서 정의를 내려준다.
        }

    },
    //#endregion 

    // manage UI. (design section) 

    //#region
    UI: function () {

        // define UI.

        var args = {
            targetid: "lyrMenu_1_1", type: "FREE",
            element: [
                { name: "조회", value: "조회", act: true },
                { name: "추가", value: "추가" },
               /* { name: "저장", value: "저장" },
                { name: "삭제", value: "삭제" },
                */
                { name: "수정", value: "수정", icon: "추가" }
                ,
                //{ name: "출력", value: "출력", icon: "출력" },
                //{ name: "ECR", value: "개선제안", icon: "실행" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);


        //=====================================================================================
        var args = {
            targetid: "lyrMenu_1_2", type: "FREE",
            show: false,
            element: [{ name: "닫기", value: "닫기" }]
        };
        //----------
        gw_com_module.buttonMenu(args);

        //-- 조회창 
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건", remark: "lyrRemark",
            trans: true, border: true, show: true,
            editable: { focus: "ymd_fr", validate: true },
            content: {
                row: [
                    {
                        element: [
				            {
				                style: { colfloat: "floating" },
				                name: "ymd_fr",
				                label: { title: "발생일자 :" },
				                mask: "date-ymd",
				                editable: { type: "text", size: 7, maxlength: 10 }
				            },
				            {
				                name: "ymd_to",
				                label: { title: "~" },
				                mask: "date-ymd",
				                editable: { type: "text", size: 7, maxlength: 10 }
				            },
				            {
				                name: "prod_type",
				                label: { title: "제품유형 :" },
				                editable: {
				                    type: "select",
				                    data: { memory: "제품유형", unshift: [{ title: "전체", value: "%" }] }
				                }
				            }
                        ]
                    },
                    {
                        element: [
				            {
				                name: "cust_cd",
				                label: { title: "고객사 :" },
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "고객사", unshift: [{ title: "전체", value: "%" }]
				                    },
				                    change: [{ name: "cust_dept", memory: "LINE", key: ["cust_cd"] }]
				                }
				            },
				            {
				                name: "cust_dept",
				                label: { title: "LINE :" },
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "LINE", unshift: [{ title: "전체", value: "%" }], key: ["cust_cd"]
				                    }
				                }
				            },
				            {
				                name: "cust_prod_nm",
				                label: { title: "설비명 :" },
				                editable: { type: "text", size: 12, maxlength: 20 }
				            },
				            { name: "proj_no", hidden: true }
                        ]
                    },
                    {
                        align: "right",
                        element: [
							{
                                name: "dept_area", label: { title: "사업부 :" },
                                editable: { type: "select", size: 7, maxlength: 20, data: { memory: "DEPT_AREA_FIND" } }
                            },				            {
				                name: "prod_group",
				                label: { title: "설비군 :" },
				                editable: {
				                    type: "select",
				                    data: { memory: "설비군", unshift: [{ title: "전체", value: "%" }] }
				                }
				            },
                            {
                                name: "issue_stat",
                                label: { title: "상태 :" },
                                editable: {
                                    type: "select",
                                    data: { memory: "진행상태", unshift: [{ title: "전체", value: "%" }] }
                                }
                            },
				            {
				                name: "실행", value: "실행", act: true,
				                format: { type: "button" }
				            },
				            {
				                name: "취소", value: "취소",
				                format: {
				                    type: "button", icon: "닫기"
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
            targetid: "grdData_발생정보", query: "EHM_2010_M_1", title: "발생 정보",
            caption: true,
            height: 250,
            dynamic: true,
            show: true,
            selectable: true,
            element: [
				{
				    header: "관리번호", name: "issue_no", width: 80, align: "center"
				},
				{
				    header: "발생일자", name: "issue_dt", width: 80, align: "center",
				    mask: "date-ymd"
				},
				{
				    header: "발생구분", name: "issue_tp", width: 90, align: "center"
				},
				{
				    header: "고객사", name: "cust_nm", width: 70, align: "center"
				},
				{
				    header: "Line", name: "cust_dept", width: 80, align: "center"
				},
				{
				    header: "Process", name: "cust_proc", width: 100, align: "center"
				},
				{
				    header: "고객설비명", name: "cust_prod_nm", width: 120, align: "center"
				},
                {
                    header: "제품유형", name: "prod_type", width: 100, align: "center"
                },
				{
				    header: "제품명", name: "prod_nm", width: 250, align: "left"
				},
				{
				    header: "발생Module", name: "prod_sub", width: 100, align: "center"
				},
				{
				    header: "Warranty", name: "wrnt_io", width: 60, align: "center"
				},
				{
				    header: "진행상태", name: "istat", width: 80, align: "center"
				},
				{
				    header: "발생현상", name: "rmk", width: 300, align: "left"
				}/*,
				{  header: "확인자",  name: "aemp", width: 70, align: "center"
				},
				{  header: "확인일시",  name: "adate", width: 160, align: "center"
				}*/,
				{
				    header: "품질확인자", name: "qemp", width: 70, align: "center"
				},
				{
				    header: "품질확인일시", name: "qdate", width: 160, align: "center"
				},
				{
				    header: "등록자", name: "ins_usr", width: 70, align: "center"
				},
				{
				    header: "등록일시", name: "ins_dt", width: 160, align: "center"
				},
				{
				    header: "수정자", name: "upd_usr", width: 70, align: "center"
				},
				{
				    header: "수정일시", name: "upd_dt", width: 160, align: "center"
				},
				{ name: "prod_key", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);

        //frmData_발생정보==================================================================
        var args = {
            targetid: "frmData_발생정보", query: "EHM_2010_M_2", type: "TABLE", title: "발생 정보",
            show: true, selectable: true,
            //editable: { bind: "select", focus: "issue_time", validate: true },
            content: {
                width: { label: 80, field: 190 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "관리번호", format: { type: "label" } },
                            { name: "issue_no", editable: { type: "hidden" } },
                            { header: true, value: "발생일시", format: { type: "label" } },
                            {
                                style: { colfloat: "float" }, name: "issue_dt", mask: "date-ymd", format: { type: "text", width: 62 }
                                //,editable: { validate: { rule: "required" }, type: "text", width: 80 }
                            },
                            {
                                style: { colfloat: "floated" }, name: "issue_time", mask: "time-hh", format: { type: "text", width: 30 }
                                //,editable: { type: "text", width: 30 }
                            },
                            { header: true, value: "발생구분", format: { type: "label" } },
                            { name: "issue_tp", editable: { validate: { rule: "required" }, type: "select", data: { memory: "발생구분" } } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "고객사", format: { type: "label" } },
                            { name: "cust_nm", mask: "search", editable: { validate: { rule: "required" }, type: "text" } },
                            { header: true, value: "Line", format: { type: "label" } },
                            { name: "cust_dept", editable: { type: "hidden" } },
                            { header: true, value: "Process", format: { type: "label" } },
                            { name: "cust_proc", editable: { type: "hidden" } },
                            { name: "cust_cd", hidden: true, editable: { type: "hidden" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "설비명", format: { type: "label" } },
                            { name: "cust_prod_nm", display: true, editable: { type: "hidden" } },
                            { header: true, value: "제품명", format: { type: "label" } },
                            {
                                name: "prod_nm", display: true, format: { type: "text", width: 458 }
                                //, editable: { type: "hidden" }
                            },
                            { header: true, value: "발생Module", format: { type: "label" } },
                            { name: "prod_sub", editable: { type: "select", data: { memory: "모듈" } } },
                            { name: "prod_type", hidden: true, editable: { type: "hidden" } },
                            { name: "prod_key", hidden: true, editable: { type: "hidden" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "Warranty", format: { type: "label" } },
                            { name: "wrnt_io", editable: { type: "select", data: { memory: "Warranty" } } },
                            { header: true, value: "", format: { type: "label" } },
                            { header: false, value: "", format: { type: "label" } },
                            { header: true, value: "상태", format: { type: "label" } },
                            {
                                name: "pstat"
                                //, editable: { type: "select", data: { memory: "상태" } }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "발생현상", format: { type: "label" } },
                            {
                                style: { colspan: 5 }, name: "rmk", format: { type: "text", width: 734 }
                                //, editable: { type: "text", width: 734 }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "등록자", format: { type: "label" } },
                            { name: "ins_usr" },
                            { header: true, value: "수정자", format: { type: "label" } },
                            { name: "upd_usr" },
                            { header: true, value: "작성일시", format: { type: "label" } },
                            { name: "upd_dt" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "CS표준유무", format: { type: "label" } },
                            { name: "standard_yn", format: { type: "select", data: { memory: "유/무" } } },
                            { header: true, value: "CS표준준수여부", format: { type: "label" } },
                            { name: "follow_yn", format: { type: "select", data: { memory: "준수여부" } } },
                            { header: true, value: "표준번호", format: { type: "label" } },
                            { name: "standard_no", editable: { type: "text", maxlength: 20, width: 254 } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "제조Test유무", format: { type: "label" } },
                            { name: "ptest_yn", format: { type: "select", data: { memory: "유/무" } } },
                            { header: true, value: "1차원인선택", format: { type: "label" } },
                            { name: "factor_tp", format: { type: "select", data: { memory: "1차원인" } } },
                            { header: true, value: "1차원인근거", format: { type: "label" } },
                            { name: "basis_rmk", editable: { type: "text", maxlength: 100, width: 254 } }
                        ]
                    }
                    //{
                    //    element: [
                    //        { header: true, value: "품질확인", format: { type: "label" } },
                    //        { name: "qstat" },
                    //        { header: true, value: "품질확인자", format: { type: "label" } },
                    //        { name: "qemp" },
                    //        { header: true, value: "품질확인일시", format: { type: "label" } },
                    //        { name: "qdate" }
                    //    ]
                    //},
                    //{
                    //    element: [
                    //        { header: true, value: "품질확인메모", format: { type: "label" } },
                    //        { style: { colspan: 5 }, name: "qnote" }
                    //    ]
                    //}
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);

        var args = {
            target: [
				{ type: "GRID", id: "grdData_발생정보", offset: 8 },
				{ type: "FORM", id: "frmData_발생정보", offset: 8 } 
            ]
        };
        //----------
        gw_com_module.objResize(args);

        /*
        var args = {
            targetid: "frmView", type: "FREE", trans: true, show: true, border: false, align: "left",
            editable: { bind: "open", validate: true },
            content: {
                row: [
                    {
                        element: [
				            {
				                name: "view", label: { title: "보기 :" }, value: "L",
				                editable: { type: "select", data: { memory: "보기" } }
				            },
				            {
				                name: "실행", act: true, show: false, format: { type: "button" }
				            }
                        ]
                    }
                ]
            }
        };

        gw_com_module.formCreate(args);
        */
        

      
      
        //----------
      //  gw_com_module.informSize();

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // go next.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        gw_job_process.procedure();

    },
    //#endregion


    // manage process. (program section) 
    //#region


    procedure: function () {

        

        //상단메뉴에 대한 이벤트 바인딩  
        var args = { targetid: "lyrMenu_1_1", element: "조회", event: "click", handler: click_lyrMenu_1_1_조회 };
        gw_com_module.eventBind(args);


        //-- 추가  
        var args = { targetid: "lyrMenu_1_1", element: "추가", event: "click", handler: click_lyrMenu_1_1_추가 };
        gw_com_module.eventBind(args);

        //-- 수정 
        
        var args = { targetid: "lyrMenu_1_1", element: "수정", event: "click", handler: click_lyrMenu_1_1_수정 };
        gw_com_module.eventBind(args);

        //-- 실행 과 취소에 대한 이벤트 바인딩 
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: click_frmOption_실행 };
        gw_com_module.eventBind(args);

        var args = { targetid: "frmOption", element: "취소", event: "click", handler: click_frmOption_취소 };
        gw_com_module.eventBind(args);

        //-- Grid row가 선택되었을때의 이벤트 바인딩

        //----------
        var args = { targetid: "grdData_발생정보", grid: true, event: "rowselecting", handler: rowselecting_grdData_발생정보 };
        gw_com_module.eventBind(args);

        //----------
        var args = { targetid: "grdData_발생정보", grid: true, event: "rowselected", handler: rowselected_grdData_발생정보 };
        gw_com_module.eventBind(args);



        function click_lyrMenu_1_1_조회(ui) {

            var args = { target: [{ id: "frmOption", focus: true }] };
            gw_com_module.objToggle(args);
        }

        //-- 추가 
        function click_lyrMenu_1_1_추가(ui) {
            //alert('a');
            var args = {
                ID: gw_com_api.v_Stream.msg_linkPage,
                to: { type: "MAIN" },
                data: {
                    page: "EHM_2022", title: "AS 발생 등록",
                   
                    param: [
                        { name: "act", value: "I" }
                  ]
                }
            };
            gw_com_module.streamInterface(args);
        }

        //-- 수정
        function click_lyrMenu_1_1_수정(ui) {
            
            var args = {
                ID: gw_com_api.v_Stream.msg_linkPage,
                to: { type: "MAIN" },
                data: {
                    page: "EHM_2022", title: "AS 발생 등록",
                    param: [
                        { name: "issue_no", value: gw_com_api.getValue("grdData_발생정보", "selected", "issue_no", true) }
                    ]
                }
            };
            gw_com_module.streamInterface(args);

          /*  var status = gw_com_api.getValue("grdData_현황", "selected", "gw_astat_nm", true);
            if (v_global.logic.authSystem == false
            	&& status != '없슴' && status != '미처리' && status != '반송' && status != '회수') {
                gw_com_api.messageBox([
                    { text: "결재 " + status + " 자료이므로 수정할 수 없습니다." }
                ], 420);
                return false;
            }

            var args = {
                ID: gw_com_api.v_Stream.msg_linkPage,
                to: { type: "MAIN" },
                data: {
                    page: "w_eccb2020", title: "ECCB 회의 등록",
                    param: [
                        { name: "eccb_no", value: gw_com_api.getValue("grdData_현황", "selected", "eccb_no", true) }
                    ]
                }
            };
            gw_com_module.streamInterface(args);
            */
        }



        function click_frmOption_실행(ui) {
            v_global.process.handler = processRetrieve;
            if (!checkUpdatable({})) return false;
            processRetrieve({});

        }

        function click_frmOption_취소(ui) {

            closeOption({});

        }

        gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { day: -10 }));
        gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate("")); 
        gw_com_module.startPage();
    }



}


//----------
function rowselected_grdData_발생정보(ui) {
    v_global.process.prev.master = ui.row;
    processLink({ master: true });  //연결정보를 해주는 함수를 찾아서 정리를 해줘야한다. 
};


//----------
function rowselecting_grdData_발생정보(ui) {

    v_global.process.handler = processSelect;
    v_global.process.current.master = ui.row;

    return checkUpdatable({});

}

function processLink(param) {

    var args = {

        source: {
            type: "GRID", id: "grdData_발생정보", row: "selected", block: true,
            element: [{ name: "issue_no", argument: "arg_issue_no" }]
        },
        target: [
            { type: "FORM", id: "frmData_발생정보" }
        ],
        key: param.key,

    };
    gw_com_module.objRetrieve(args);

    //if (param.master) {
    //    args = {
    //        source: {
    //            type: "GRID", id: "grdData_발생정보", row: "selected", block: true,
    //            element: [{ name: "issue_no", argument: "arg_issue_no" }]
    //        },
    //        target: [
    //            { type: "FORM", id: "frmData_발생정보" }
    //        ],
    //        key: param.key,
    //        handler: { complete: processLink, param: {} }
    //    };
    //}
}

function closeOption(param) {

    gw_com_api.hide("frmOption");

}

/*
  아래는 grid를 선택했을때 이벤트 
*/

//----------
function rowselecting_grdData_발생정보(ui) {

    v_global.process.handler = processSelect;
    v_global.process.current.master = ui.row;

    return checkUpdatable({});

}

//----------
function rowselected_grdData_발생정보(ui) {
    v_global.process.prev.master = ui.row;
    processLink({ master: true });
};

function processSelect(param) {

     gw_com_api.selectRow("grdData_발생정보", v_global.process.current.master, true, false);

}

function processRetrieve(param) {

    var args = { target: [{ type: "FORM", id: "frmOption" }] };
    if (gw_com_module.objValidate(args) == false) {
        processClear({ master: true });
        return false;
    }

    if (param.key != undefined) {
        $.each(param.key, function () {
            if (this.QUERY == "EHM_2010_M_2")
                this.QUERY = "EHM_2010_M_1";
        });
    }
    var args = {
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
				{ name: "ymd_fr", argument: "arg_ymd_fr" },
				{ name: "ymd_to", argument: "arg_ymd_to" },
				{ name: "issue_stat", argument: "arg_issue_stat" },
				{ name: "prod_group", argument: "arg_prod_group" },
				{ name: "prod_type", argument: "arg_prod_type" },
				{ name: "cust_cd", argument: "arg_cust_cd" },
				{ name: "cust_dept", argument: "arg_cust_dept" },
				{ name: "cust_prod_nm", argument: "arg_cust_prod_nm" },
				{ name: "proj_no", argument: "arg_proj_no" },
                { name: "dept_area", argument: "arg_dept_area" }
            ],
            argument: [
                { name: "arg_issue_part", value: "AS" }
            ],
            remark: [
			    { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }] },
		        { element: [{ name: "prod_group" }] },
		        { element: [{ name: "prod_type" }] },
		        { element: [{ name: "cust_cd" }] },
		        { element: [{ name: "cust_dept" }] },
		        { element: [{ name: "cust_prod_nm" }] },
		        { element: [{ name: "dept_area" }] },
		        { element: [{ name: "issue_stat" }] }
            ]
        },
        target: [
			{ type: "GRID", id: "grdData_발생정보", select: true }
        ],
        clear: [
		    { type: "FORM", id: "frmData_발생정보" }
            /*,
		    { type: "GRID", id: "grdData_발생내역" }
			{ type: "FORM", id: "frmData_발생내용" },
			{ type: "GRID", id: "grdData_조치내역" },
			{ type: "FORM", id: "frmData_조치내용" },
			{ type: "GRID", id: "grdData_교체PART" },
			{ type: "FORM", id: "frmData_교체내용" },
            { type: "FORM", id: "frmData_처리결과" },
			{ type: "GRID", id: "grdData_첨부파일" },
			{ type: "FORM", id: "frmData_상세메모" }
		*/
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}

function checkUpdatable(param) {

    closeOption({});

    var args = {
        check: param.check,
        target: [
            {
                type: "FORM",
                id: "frmData_발생정보"
            }
			
        ],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}
// stream handler. (network section)

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
                    param.to = { type: "POPUP", page: param.data.page };
                    gw_com_module.streamInterface(param);
                    break;
                }
                switch (param.data.ID) {
                    //case gw_com_api.v_Message.msg_confirmSave:
                    //    {
                    //        if (param.data.result == "YES")
                    //            processSave(param.data.arg);
                    //        else {
                    //            if (param.data.arg.sub) {
                    //                var status = checkCRUD({});
                    //                if (status == "initialize" || status == "create")
                    //                    processClear({});
                    //                else if (status == "update"
                    //                    || gw_com_api.getUpdatable("frmData_발생내용")
                    //                    || gw_com_api.getUpdatable("frmData_조치내용")
                    //                    || gw_com_api.getUpdatable("frmData_교체내용")
                    //                    || gw_com_api.getUpdatable("grdData_첨부파일", true)
                    //                    || gw_com_api.getUpdatable("frmData_상세메모"))
                    //                    processLink({ master: true });
                    //                else {
                    //                    var status = checkCRUD(param.data.arg);
                    //                    if (status == "initialize" || status == "create")
                    //                        processDelete(param.data.arg);
                    //                    else if (status == "update")
                    //                        processRestore(param.data.arg);
                    //                    if (v_global.process.handler != null)
                    //                        v_global.process.handler(param.data.arg);
                    //                }
                    //            }
                    //            else
                    //                if (v_global.process.handler != null)
                    //                    v_global.process.handler({});
                    //        }
                    //    }
                    //    break;
                    case gw_com_api.v_Message.msg_confirmRemove:
                        {
                            if (param.data.arg.itemchange == true) {
                                if (param.data.result == "YES")
                                    gw_com_api.setValue("frmData_발생정보", 1, "pstat", "완료", false);
                            }
                            else if (param.data.result == "YES")
                                processRemove(param.data.arg);
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
        case gw_com_api.v_Stream.msg_selectedProduct_EHM:
            {
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "cust_nm", param.data.cust_nm, (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "cust_cd", param.data.cust_cd, (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "cust_dept", param.data.cust_dept, (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "cust_proc", param.data.cust_proc, (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "cust_prod_nm", param.data.cust_prod_nm, (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "prod_key", param.data.prod_key, (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "prod_type", param.data.prod_type, (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "prod_nm", param.data.prod_nm, (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "wrnt_io", param.data.wrnt_io, (v_global.event.type == "GRID") ? true : false);
                //var ids = gw_com_api.getRowIDs("grdData_발생내역");
                //$.each(ids, function () {
                //    gw_com_api.setValue("grdData_발생내역", this, "prod_type", param.data.prod_type, true);
                //    gw_com_api.filterSelect("grdData_발생내역", this, "status_tp1",
                //                            {
                //                                memory: "현상분류", unshift: [{ title: "-", value: "" }],
                //                                by: [{ source: { id: "frmData_발생정보", row: 1, key: "prod_type" } }]
                //                            },
                //                            true);
                //    gw_com_api.filterSelect("grdData_발생내역", this, "part_tp1",
                //                            {
                //                                memory: "원인부위분류", unshift: [{ title: "-", value: "" }],
                //                                by: [{ source: { id: "frmData_발생정보", row: 1, key: "prod_type" } }]
                //                            },
                //                            true);
                //    gw_com_api.filterSelect("grdData_발생내역", this, "reason_tp1",
                //                            {
                //                                memory: "원인분류", unshift: [{ title: "-", value: "" }],
                //                                by: [{ source: { id: "frmData_발생정보", row: 1, key: "prod_type" } }]
                //                            },
                //                            true);
                //    gw_com_api.filterSelect("grdData_발생내역", this, "duty_tp1",
                //                            {
                //                                memory: "귀책분류", unshift: [{ title: "-", value: "" }],
                //                                by: [{ source: { id: "frmData_발생정보", row: 1, key: "prod_type" } }]
                //                            },
                //                            true);
                //});
            //    var ids = gw_com_api.getRowIDs("grdData_조치내역");
            //    $.each(ids, function () {
            //        gw_com_api.filterSelect("grdData_조치내역", this, "work_tp1",
            //                                {
            //                                    memory: "조치분류", unshift: [{ title: "-", value: "" }],
            //                                    by: [{ source: { id: "frmData_발생정보", row: 1, key: "prod_type" } }]
            //                                },
            //                                true);
            //    });
            //    var ids = gw_com_api.getRowIDs("grdData_교체PART");
            //    $.each(ids, function () {
            //        gw_com_api.setValue("grdData_교체PART", this, "prod_type", param.data.prod_type, true);
            //        gw_com_api.filterSelect("grdData_교체PART", this, "apart_tp",
            //                                {
            //                                    memory: "부품군", unshift: [{ title: "-", value: "" }],
            //                                    by: [{ source: { id: "frmData_발생정보", row: 1, key: "prod_type" } }]
            //                                },
            //                                true);
            //        gw_com_api.filterSelect("grdData_교체PART", this, "bpart_tp",
            //                                {
            //                                    memory: "부품군", unshift: [{ title: "-", value: "" }],
            //                                    by: [{ source: { id: "frmData_발생정보", row: 1, key: "prod_type" } }]
            //                                },
            //                                true);
            //    });
            //    closeDialogue({ page: param.from.page, focus: true });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedPart_EHM:
            {
                if (v_global.event.element == "apart_cd") {
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, "apart_cd", param.data.part_cd, (v_global.event.type == "GRID") ? true : false);
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, "apart_nm", param.data.part_nm, (v_global.event.type == "GRID") ? true : false);
                    /*
                    if (gw_com_api.getValue(v_global.event.object,
                    v_global.event.row,
                    "bpart_cd",
                    (v_global.event.type == "GRID") ? true : false) == "") {
                    */
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, "bpart_tp", "기타", (v_global.event.type == "GRID") ? true : false);
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, "bpart_cd", param.data.part_cd, (v_global.event.type == "GRID") ? true : false);
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, "bpart_nm", param.data.part_nm, (v_global.event.type == "GRID") ? true : false);
                    /*
                    }
                    */
                }
                else if (v_global.event.element == "bpart_cd") {
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, "bpart_cd", param.data.part_cd, (v_global.event.type == "GRID") ? true : false);
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, "bpart_nm", param.data.part_nm,
			                            (v_global.event.type == "GRID") ? true : false,
			                            true);
                }
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedPart_EHM_1:
            {
                if (v_global.event.element == "apart_cd") {
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, "apart_cd", param.data.part_cd, (v_global.event.type == "GRID") ? true : false);
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, "apart_nm", param.data.part_nm, (v_global.event.type == "GRID") ? true : false);
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, "apart_supp", param.data.part_supp, (v_global.event.type == "GRID") ? true : false);
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, "apart_model", param.data.part_model, (v_global.event.type == "GRID") ? true : false);
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, "apart_rev", param.data.part_rev, (v_global.event.type == "GRID") ? true : false);
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, "apart_rmk", param.data.part_rmk, (v_global.event.type == "GRID") ? true : false);
                    /*
                    if (gw_com_api.getValue(v_global.event.object,
                    v_global.event.row,
                    "bpart_cd",
                    (v_global.event.type == "GRID") ? true : false) == "") {
                    */
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, "bpart_tp", param.data.part_tp, (v_global.event.type == "GRID") ? true : false);
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, "bpart_cd", param.data.part_cd, (v_global.event.type == "GRID") ? true : false);
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, "bpart_nm", param.data.part_nm, (v_global.event.type == "GRID") ? true : false);
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, "bpart_supp", param.data.part_supp, (v_global.event.type == "GRID") ? true : false);
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, "bpart_model", param.data.part_model, (v_global.event.type == "GRID") ? true : false);
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, "bpart_rev", param.data.part_rev, (v_global.event.type == "GRID") ? true : false);
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, "bpart_rmk", param.data.part_rmk, (v_global.event.type == "GRID") ? true : false);
                    /*
                    }
                    */
                }
                else if (v_global.event.element == "bpart_cd") {
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, "bpart_cd", param.data.part_cd, (v_global.event.type == "GRID") ? true : false);
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, "bpart_nm", param.data.part_nm, (v_global.event.type == "GRID") ? true : false);
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, "bpart_supp", param.data.part_supp, (v_global.event.type == "GRID") ? true : false);
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, "bpart_model", param.data.part_model, (v_global.event.type == "GRID") ? true : false);
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, "bpart_rev", param.data.part_rev, (v_global.event.type == "GRID") ? true : false);
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, "bpart_rmk", param.data.part_rmk, (v_global.event.type == "GRID") ? true : false);
                }
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
        //case gw_com_api.v_Stream.msg_selectedPart_EHM_2:
        //    {
        //        gw_com_api.setValue(v_global.event.object, v_global.event.row, "status_tp1", param.data.status_tp1, (v_global.event.type == "GRID") ? true : false);
        //        gw_com_api.setValue(v_global.event.object, v_global.event.row, "status_tp2", param.data.status_tp2, (v_global.event.type == "GRID") ? true : false);
        //        gw_com_api.setValue(v_global.event.object, v_global.event.row, "status_tp1_nm", (param.data.status_tp1 == "기타") ? "" : param.data.status_tp1_nm, (v_global.event.type == "GRID") ? true : false);
        //        gw_com_api.setValue(v_global.event.object, v_global.event.row, "status_tp2_nm", (param.data.status_tp1 == "기타") ? "" : param.data.status_tp2_nm, (v_global.event.type == "GRID") ? true : false);
        //        gw_com_api.setValue(v_global.event.object, v_global.event.row, "status_rmk", param.data.status_rmk, (v_global.event.type == "GRID") ? true : false);
        //        gw_com_api.setValue(v_global.event.object, v_global.event.row, "status_etc", (param.data.status_tp1 == "기타") ? 1 : 0, (v_global.event.type == "GRID") ? true : false);
        //        var toggle = (param.data.status_tp1 == "기타") ? false : true;
        //        gw_com_api.setAttribute(v_global.event.object, v_global.event.row, "status_tp1_nm",
        //                                "readonly", toggle, true);
        //        gw_com_api.setAttribute(v_global.event.object, v_global.event.row, "status_tp2_nm",
        //                                "readonly", toggle, true);
        //        gw_com_api.setAttribute(v_global.event.object, v_global.event.row, "status_rmk",
        //                                "readonly", toggle, true);
        //        closeDialogue({ page: param.from.page, focus: true });
        //    }
        //    break;
        //case gw_com_api.v_Stream.msg_edited_Memo:
        //    {
        //        if (param.data.update)
        //            gw_com_api.setValue(v_global.event.object,
        //                                v_global.event.row,
        //                                v_global.event.element,
		//	                            param.data.text);
        //        closeDialogue({ page: param.from.page });
        //    }
        //    break;
        //case gw_com_api.v_Stream.msg_edited_ASISSUE:
        //    {
        //        gw_com_api.setValue("frmData_상세메모", 1, "memo_text", param.data.html);
        //        closeDialogue({ page: param.from.page });
        //    }
        //    break;
        //case gw_com_api.v_Stream.msg_uploaded_ASISSUE: {
        //    var args = {
        //        source: {
        //            type: "GRID", id: "grdData_발생정보", row: "selected",
        //            element: [
        //                { name: "issue_no", argument: "arg_issue_no" }
        //            ]
        //        },
        //        target: [{ type: "GRID", id: "grdData_첨부파일", select: true }],
        //        key: param.key
        //    };
        //    gw_com_module.objRetrieve(args);
        //} break;
        //case gw_com_api.v_Stream.msg_uploaded_ECCB: {
        //    var args = {
        //        source: {
        //            type: "GRID", id: "grdData_발생내역", row: "selected",
        //            element: [
        //                { name: "issue_no", argument: "arg_issue_no" },
        //                { name: "issue_seq", argument: "arg_issue_seq" }
        //            ]
        //        },
        //        target: [{ type: "GRID", id: "grdData_교체PART", select: true }],
        //        key: param.key
        //    };
        //    gw_com_module.objRetrieve(args);
        //    closeDialogue({ page: param.from.page });
        //} break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = {
                    to: { type: "POPUP", page: param.from.page }
                };
                switch (param.from.page) {
                    case "w_find_prod_ehm":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectProduct_EHM;
                        }
                        break;
                    case "DLG_PART_EHM_1":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectPart_EHM;
                            args.data = {
                                prod_type: gw_com_api.getValue("frmData_발생정보", 1, "prod_type"),
                                part_tp: gw_com_api.getValue(v_global.event.object,
                                                             v_global.event.row,
                                                             v_global.event.element.substr(0, 1) + "part_tp",
                                                             true),
                                part_tp_nm: gw_com_api.getText(v_global.event.object,
                                                               v_global.event.row,
                                                               v_global.event.element.substr(0, 1) + "part_tp",
                                                               true)
                            };
                        }
                        break;
                    case "DLG_PART_EHM_2":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectPart_EHM;
                            args.data = {
                                prod_type: gw_com_api.getValue("frmData_발생정보", 1, "prod_type"),
                                part_tp: gw_com_api.getValue(v_global.event.object,
                                                             v_global.event.row,
                                                             "apart_tp",
                                                             true),
                                part_tp_nm: gw_com_api.getText(v_global.event.object,
                                                               v_global.event.row,
                                                               "apart_tp",
                                                               true)
                            };
                        }
                        break;
                    case "w_find_part_ehm":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectPart_EHM;
                            args.data = {
                                tab: 2,
                                prod_key: gw_com_api.getValue("frmData_발생정보", 1, "prod_key"),
                                prod_nm: gw_com_api.getValue("frmData_발생정보", 1, "prod_nm")
                            };
                        }
                        break;
                    //case "w_edit_memo":
                    //    {
                    //        args.ID = gw_com_api.v_Stream.msg_edit_Memo;
                    //        args.data = {
                    //            edit: true,
                    //            title: v_global.logic.memo,
                    //            text: gw_com_api.getValue(v_global.event.object, v_global.event.row, v_global.event.element)
                    //        };
                    //    }
                    //    break;
                    //case "w_upload_asissue":
                    //    {
                    //        args.ID = gw_com_api.v_Stream.msg_upload_ASISSUE;
                    //        args.data = {
                    //            user: gw_com_module.v_Session.USR_ID,
                    //            key: gw_com_api.getValue("grdData_발생정보", "selected", "issue_no", true),
                    //            seq: 0
                    //        };
                    //    }
                    //    break;
                    //case "w_upload_aspart":
                    //    {
                    //        args.ID = gw_com_api.v_Stream.msg_upload_ECCB;
                    //        args.data = {
                    //            user: gw_com_module.v_Session.USR_ID,
                    //            key: gw_com_api.getValue("grdData_교체PART", "selected", "issue_no", true),
                    //            seq: gw_com_api.getValue("grdData_교체PART", "selected", "issue_seq", true),
                    //            part_seq: gw_com_api.getValue("grdData_교체PART", "selected", "part_seq", true)
                    //        };
                    //    }
                    //    break;
                    //case "w_edit_asissue":
                    //    {
                    //        args.ID = gw_com_api.v_Stream.msg_edit_ASISSUE;
                    //        args.data = {
                    //            issue_no: gw_com_api.getValue("grdData_발생정보", "selected", "issue_no", true)
                    //        };
                    //    }
                    //    break;
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
    /*  
        }
*/
    // custom function. (program section)

    //----------


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//