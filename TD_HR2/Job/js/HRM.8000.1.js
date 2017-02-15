//------------------------------------------
// Process about Job Process.
//                Created by Professor.X, GoodWare (2011.04)
//------------------------------------------

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
    data: null, logic: {}
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
        // init
        v_global.logic.ann_key = gw_com_api.getPageParameter("ann_key");
        v_global.logic.ann_seq = gw_com_api.getPageParameter("ann_seq");
        v_global.logic.app_key = gw_com_api.getPageParameter("app_key");
        v_global.logic.message1 = true;    // 경력 탭 이동시 알림(최초1번)

        //----------
        var args = {
            request: [
                {
                    type: "INLINE", name: "대학구분",
                    data: [
                        { title: "-", value: "" },
						{ title: "2년제", value: "2년제" },
						{ title: "3년제", value: "3년제" },
						{ title: "4년제", value: "4년제" },
                        { title: "기타", value: "기타" }
                    ]
                },
                {
                    type: "INLINE", name: "주야",
                    data: [
                        { title: "-", value: "" },
						{ title: "주간", value: "주간" },
						{ title: "야간", value: "야간" }
                    ]
                },
                {
                    type: "INLINE", name: "본교여부",
                    data: [
						{ title: "본교", value: "본교" },
						{ title: "분교", value: "분교" }
                    ]
                },
                {
                    type: "INLINE", name: "등급",
                    data: [
                        { title: "-", value: "" },
						{ title: "최상", value: "A" },
						{ title: "상", value: "B" },
						{ title: "중", value: "C" },
						{ title: "하", value: "D" },
						{ title: "최하", value: "E" }
                    ]
                },
                {
                    type: "INLINE", name: "등급2",
                    data: [
                        { title: "-", value: "" },
						{ title: "상", value: "상" },
						{ title: "중", value: "중" },
						{ title: "하", value: "하" }
                    ]
                },
                {
                    type: "INLINE", name: "성별",
                    data: [{ title: "남", value: "1" }, { title: "여", value: "0" }]
                },
                {
                    type: "INLINE", name: "부모",
                    data: [
                        { title: "부(√), 모(√)", value: "3" },
                        { title: "부(√), 모(  )", value: "2" },
                        { title: "부(  ), 모(√)", value: "1" },
                        { title: "부(  ), 모(  )", value: "0" }
                    ]
                },
                {
                    type: "PAGE", name: "관계",
                    query: "DDDW_CM_CODE",
                    param: [{ argument: "arg_hcode", value: "HRM090" }]
                },
                {
                    type: "PAGE", name: "최종학력",
                    query: "DDDW_CM_CODE",
                    param: [{ argument: "arg_hcode", value: "HRM091" }]
                },
                {
                    type: "PAGE", name: "외국어",
                    query: "DDDW_CM_CODE",
                    param: [{ argument: "arg_hcode", value: "HRM092" }]
                },
                {
                    type: "PAGE", name: "희망연봉",
                    query: "DDDW_CM_CODE",
                    param: [{ argument: "arg_hcode", value: "HRM093" }]
                },
                {
                    type: "PAGE", name: "희망직위",
                    query: "DDDW_CM_CODE",
                    param: [{ argument: "arg_hcode", value: "HRM094" }]
                },
                {
                    type: "PAGE", name: "모집부문",
                    query: "DDDW_ANN_CAT01",
                    param: [{ argument: "arg_ann_key", value: v_global.logic.ann_key }]
                },
                {
                    type: "INLINE", name: "졸업구분",
                    data: [
                        { title: "-", value: "" },
                        { title: "졸업", value: "졸업" },
                        { title: "재학", value: "재학" },
                        { title: "중퇴", value: "중퇴" },
                        { title: "휴학", value: "휴학" },
                        { title: "수료", value: "수료" }
                    ]
                },
                {
                    type: "INLINE", name: "병역구분",
                    data: [
                        { title: "-", value: "" },
                        { title: "기필", value: "기필" },
                        { title: "면제", value: "면제" },
                        { title: "미필", value: "미필" },
                        { title: "병역특례", value: "병역특례" }
                    ]
                },
                {
                    type: "INLINE", name: "군별",
                    data: [
                        { title: "-", value: "" },
                        { title: "경비교도대", value: "경비교도대" },
                        { title: "공군", value: "공군" },
                        { title: "기타", value: "기타" },
                        { title: "육군", value: "육군" },
                        { title: "의무경찰", value: "의무경찰" },
                        { title: "전투경찰", value: "전투경찰" },
                        { title: "카츄사", value: "카츄사" },
                        { title: "해군", value: "해군" },
                        { title: "해병대", value: "해병대" },
                        { title: "해양경찰", value: "해양경찰" }
                    ]
                },
                {
                    type: "INLINE", name: "장애",
                    data: [
                        { title: "-", value: "" },
                        { title: "간장애인", value: "간장애인" },
                        { title: "간질장애인", value: "간질장애인" },
                        { title: "뇌병변장애인", value: "뇌병변장애인" },
                        { title: "시각장애인", value: "시각장애인" },
                        { title: "신장장애인", value: "신장장애인" },
                        { title: "안면장애인", value: "안면장애인" },
                        { title: "언어장애인", value: "언어장애인" },
                        { title: "자폐성장애인", value: "자폐성장애인" },
                        { title: "장루장애인", value: "장루장애인" },
                        { title: "정신지체인", value: "정신지체인" },
                        { title: "지적장애인", value: "지적장애인" },
                        { title: "지체장애인", value: "지체장애인" },
                        { title: "청각장애인", value: "청각장애인" },
                        { title: "호흡기장애인", value: "호흡기장애인" }
                    ]
                },
                {
                    type: "INLINE", name: "포함여부",
                    data: [
                        { title: "-", value: "" },
                        { title: "포함", value: "포함" },
                        { title: "미포함", value: "미포함" }
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

            // 자기소개 최대 글자수
            v_global.logic.max1 = 500;

            gw_job_process.UI();
            gw_job_process.procedure();

            //
            gw_com_api.hide("btn_가족");
            gw_com_api.hide("btn_수상");
            gw_com_api.hide("btn_해외");
            gw_com_api.hide("btn_능력");

            if (v_global.logic.ann_key == undefined || v_global.logic.ann_key == "") {
                alert("잘못된 접근입니다.");
                processClose({});
                return;
            } else if (v_global.logic.ann_seq == "" || v_global.logic.app_key == "") {
                processLogin({});
            } else {
                processRetrieve();
            }

            gw_com_api.show("tbl_사진");
            gw_com_api.show("lyrServer");

            //gw_com_api.disableTab("lyrTab", 1);
            gw_com_api.disableTab("lyrTab", 2);
            gw_com_api.disableTab("lyrTab", 3);
            gw_com_api.disableTab("lyrTab", 4);
            //gw_com_api.disableTab("lyrTab", 5);
            //gw_com_api.disableTab("lyrTab", 6);

            gw_com_module.startPage();

            gw_com_api.messageBox([{ text: "입사지원서의 내용이 <b>사실과 다를 경우</b> 입사(합격)가 <b>취소</b>될 수 있습니다." }], 520);

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
            targetid: "btn_가족", type: "FREE",
            element: [
				{ name: "추가", value: "추가" },
				{ name: "삭제", value: "삭제" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "btn_경력", type: "FREE",
            element: [
				{ name: "추가", value: "추가" },
				{ name: "수정", value: "수정", icon: "기타" },
				{ name: "삭제", value: "삭제" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "btn_외국어", type: "FREE",
            element: [
				{ name: "추가", value: "추가" },
				{ name: "삭제", value: "삭제" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "btn_수상", type: "FREE",
            element: [
				{ name: "추가", value: "추가" },
				{ name: "삭제", value: "삭제" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "btn_사회", type: "FREE",
            element: [
				{ name: "추가", value: "추가" },
				{ name: "삭제", value: "삭제" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "btn_자격", type: "FREE",
            element: [
				{ name: "추가", value: "추가" },
				{ name: "삭제", value: "삭제" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "btn_능력", type: "FREE",
            element: [
				{ name: "추가", value: "추가" },
				{ name: "삭제", value: "삭제" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "btn_해외", type: "FREE",
            element: [
				{ name: "추가", value: "추가" },
				{ name: "삭제", value: "삭제" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "btnMove_1", type: "IMG",
            element: [{ name: "next" }]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "btnMove_2", type: "IMG",
            element: [{ name: "prev" }, { name: "next" }]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "btnMove_3", type: "IMG",
            element: [{ name: "prev" }, { name: "next" }]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        //var args = {
        //    targetid: "btnMove_4", type: "IMG",
        //    element: [{ name: "prev" }, { name: "next" }]
        //};
        ////----------
        //gw_com_module.buttonMenu(args);
        ////=====================================================================================
        //var args = {
        //    targetid: "btnMove_5", type: "IMG",
        //    element: [{ name: "prev" }, { name: "next" }]
        //};
        ////----------
        //gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "btnMove_4", type: "IMG",
            element: [{ name: "prev" }, { name: "save" }, { name: "submit" }]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_지원정보", query: "HRM_8000_01", type: "TABLE", title: "지원부문",
            show: true, selectable: true,
            editable: { bind: "select", focus: "d1_inf27", validate: true },
            content: {
                width: { label: 100, field: 100 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "구분", format: { type: "label" } },
                            { name: "ann_cat04_nm", format: { type: "text" }, editable: { type: "hidden" }, align: "center" },
                            { header: true, value: "지원부문", format: { type: "label" } },
                            {
                                name: "d1_inf27",
                                //format: { type: "select", data: { memory: "모집부문", unshift: [{ title: "-", value: "" }] } },
                                editable: { type: "select", data: { memory: "모집부문", unshift: [{ title: "-", value: "" }] }, validate: { rule: "required" } }
                            }//,
                            //{ header: true, value: "희망근무지", format: { type: "label" } },
                            //{ name: "col03", editable: { type: "hidden" } },
                            //{ name: "ann_key", editable: { type: "hidden" }, hidden: true },
                            //{ name: "ann_seq", editable: { type: "hidden" }, hidden: true },
                            //{ name: "app_key", editable: { type: "hidden" }, hidden: true }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_인적", query: "HRM_8000_02", type: "TABLE", title: "인적사항",
            caption: true, show: true, selectable: true,
            editable: { bind: "select", focus: "app_nm_kr", validate: true },
            content: {
                width: { label: 70, field: 150 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "<b>성명(한글)</b>", format: { type: "label" } },
                            { name: "app_nm_kr", editable: { type: "hidden", width: 210, validate: { rule: "required" } } },
                            { header: true, value: "<b>성명(영문)</b>", format: { type: "label" } },
                            { name: "app_nm_en", editable: { type: "text", width: 210, validate: { rule: "required" } } },
                            { header: true, value: "<b>성명(한자)</b>", format: { type: "label" } },
                            { name: "app_nm_cn", editable: { type: "text", width: 210, validate: { rule: "required" } } },
                            { name: "ann_key", editable: { type: "hidden" }, hidden: true },
                            { name: "ann_seq", editable: { type: "hidden" }, hidden: true },
                            { name: "app_key", editable: { type: "hidden" }, hidden: true },
                            { name: "rec_status", editable: { type: "hidden" }, hidden: true },
                            { name: "insert_yn", hidden: true }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "<b>생년월일</b>", format: { type: "label" } },
                            { name: "birth_date", editable: { type: "hidden", width: 300 }, mask: "date-ymd" },
                            { name: "reg_no_1", format: { type: "text" }, editable: { type: "hidden" }, display: true, hidden: true },
                            { name: "reg_no", editable: { type: "hidden" }, hidden: true },
                            { header: true, value: "성별", format: { type: "label" } },
                            { name: "sex", editable: { type: "select", data: { memory: "성별" }, width: 60 } },
                            { header: true, value: "연령(만나이)", format: { type: "label" } },
                            {
                                name: "age", mask: "numeric-int", fix: { mask: "numeric-int" },
                                editable: { type: "text", maxlength: 3, width: 210 }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "<b>거주지 주소</b>", format: { type: "label" } },
                            {
                                name: "addr", style: { colspan: 5 },
                                format: { type: "text", width: 868 },
                                editable: { type: "text", width: 868, validate: { rule: "required" } }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "<b>전화번호</b>", format: { type: "label" } },
                            { name: "tel_no", editable: { type: "text", width: 210, validate: { rule: "required" }, maxlength: 12 } },
                            { header: true, value: "<b>휴대폰</b>", format: { type: "label" } },
                            { name: "mobile_no", editable: { type: "text", width: 210, validate: { rule: "required" }, maxlength: 12 } },
                            { header: true, value: "<b>E-Mail</b>", format: { type: "label" } },
                            { name: "email", editable: { type: "hidden" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "희망연봉", format: { type: "label" } },
                            {
                                name: "d1_inf01",
                                //format: { type: "select", data: { memory: "희망연봉", unshift: [{ title: "-", value: "" }] } },
                                editable: { type: "select", data: { memory: "희망연봉", unshift: [{ title: "-", value: "" }] } }
                            },
                            { header: true, value: "희망직위", format: { type: "label" } },
                            {
                                name: "d1_inf02",
                                //format: { type: "select", data: { memory: "희망직위", unshift: [{ title: "-", value: "" }] } },
                                editable: { type: "select", data: { memory: "희망직위", unshift: [{ title: "-", value: "" }] } }
                            },
                            { name: "inf", style: { colspan: 2 }, format: { type: "text", width: 400 } },
                            { name: "d1_inf03", editable: { type: "hidden" }, hidden: true },
                            { name: "d1_inf04", editable: { type: "hidden" }, hidden: true },
                            { name: "d1_inf05", editable: { type: "hidden" }, hidden: true },
                            { name: "d1_inf06", editable: { type: "hidden" }, hidden: true },
                            { name: "d1_inf07", editable: { type: "hidden" }, hidden: true },
                            { name: "d1_inf08", editable: { type: "hidden" }, hidden: true },
                            { name: "d1_inf09", editable: { type: "hidden" }, hidden: true },
                            { name: "d1_inf10", editable: { type: "hidden" }, hidden: true },
                            { name: "d1_inf11", editable: { type: "hidden" }, hidden: true },
                            { name: "d1_inf12", editable: { type: "hidden" }, hidden: true },
                            { name: "d1_inf13", editable: { type: "hidden" }, hidden: true },
                            { name: "d1_inf14", editable: { type: "hidden" }, hidden: true },
                            { name: "d1_inf15", editable: { type: "hidden" }, hidden: true },
                            { name: "d1_inf16", editable: { type: "hidden" }, hidden: true },
                            { name: "d1_inf17", editable: { type: "hidden" }, hidden: true },
                            { name: "d1_inf18", editable: { type: "hidden" }, hidden: true },
                            { name: "d1_inf19", editable: { type: "hidden" }, hidden: true },
                            { name: "d1_inf20", editable: { type: "hidden" }, hidden: true },
                            { name: "d1_inf21", editable: { type: "hidden" }, hidden: true },
                            { name: "d1_inf22", editable: { type: "hidden" }, hidden: true },
                            { name: "d1_inf23", editable: { type: "hidden" }, hidden: true },
                            { name: "d1_inf24", editable: { type: "hidden" }, hidden: true },
                            { name: "d1_inf25", editable: { type: "hidden" }, hidden: true },
                            { name: "d1_inf26", editable: { type: "hidden" }, hidden: true },
                            { name: "d1_inf27", editable: { type: "hidden" }, hidden: true },
                            { name: "d1_inf28", editable: { type: "hidden" }, hidden: true },
                            { name: "d1_inf29", editable: { type: "hidden" }, hidden: true },
                            { name: "d1_inf30", editable: { type: "hidden" }, hidden: true },
                            { name: "d1_inf31", editable: { type: "hidden" }, hidden: true },
                            { name: "d1_inf32", editable: { type: "hidden" }, hidden: true },
                            { name: "d1_inf33", editable: { type: "hidden" }, hidden: true },
                            { name: "d1_inf34", editable: { type: "hidden" }, hidden: true },
                            { name: "ann_title", hidden: true }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        ////=====================================================================================
        //var args = {
        //    targetid: "frmData_사진", query: "", type: "TABLE", title: "사진",
        //    show: true, selectable: true,
        //    content: {
        //        width: { field: "100%" }, height: 181,
        //        row: [
        //            {
        //                element: [
        //                    { name: "img_url", format: { type: "html", height: 181 } }
        //                ]
        //            }
        //        ]
        //    }
        //};
        ////----------
        //gw_com_module.formCreate(args);
        ////=====================================================================================
        var args = {
            targetid: "frmData_학력", query: "HRM_8000_03", type: "TABLE", title: "학력사항",
            caption: true, show: true, selectable: true,
            editable: { bind: "select", focus: "col01", validate: true },
            content: {
                width: { label: 60, field: 60 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "구분", format: { type: "label" } },
                            { header: true, value: "입학연월", format: { type: "label" } },
                            { header: true, value: "졸업연월", format: { type: "label" } },
                            { header: true, value: "학교명", format: { type: "label" } },
                            { header: true, value: "주/야", format: { type: "label" } },
                            { header: true, value: "전공/학과", format: { type: "label" } },
                            { header: true, value: "부전공", format: { type: "label" } },
                            //{ header: true, value: "구분", format: { type: "label" } },
                            { header: true, value: "졸업구분", format: { type: "label" } },
                            { header: true, value: "소재지", format: { type: "label" } },
                            { header: true, value: "성적 / 만점", format: { type: "label" } },
                            { name: "ann_key", editable: { type: "hidden" }, hidden: true },
                            { name: "ann_seq", editable: { type: "hidden" }, hidden: true },
                            { name: "app_key", editable: { type: "hidden" }, hidden: true },
                            { name: "insert_yn", hidden: true }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "<b>고등학교</b>", format: { type: "label" } },
                            {
                                name: "d2_inf02_1", mask: "date-ymd",
                                format: { type: "text", width: 100 },
                                editable: { type: "text", width: 100, maxlength: 10, validate: { rule: "dateISO" } }
                            },
                            {
                                name: "d2_inf03_1", mask: "date-ymd",
                                format: { type: "text", width: 100 },
                                editable: { type: "text", width: 100, maxlength: 10, validate: { rule: "dateISO" } }
                            },
                            {
                                name: "d2_inf01_1",
                                format: { type: "text", width: 100 },
                                editable: { type: "text", width: 100, validate: { rule: "required" } }
                            },
                            {
                                name: "d2_inf06_1",
                                format: { type: "select", data: { memory: "주야" }, width: 100 },
                                editable: { type: "select", data: { memory: "주야" }, width: 100 }
                            },
                            {
                                name: "d2_inf04_1",
                                format: { type: "text", width: 100 },
                                editable: { type: "text", width: 100, validate: { rule: "required" } }
                            },
                            {
                                name: "d2_inf05_1",
                                format: { type: "text", width: 100 },
                                editable: { type: "text", width: 100 }
                            },
                            //{
                            //    name: "d2_inf11_1",
                            //    format: { type: "select", data: { memory: "대학구분" }, width: 100 },
                            //    editable: { type: "select", data: { memory: "대학구분" }, width: 100 }
                            //},
                            {
                                name: "d2_inf07_1",
                                format: { type: "select", data: { memory: "졸업구분" }, width: 100 },
                                editable: { type: "select", data: { memory: "졸업구분" }, width: 100, validate: { rule: "required" } }
                            },
                            {
                                name: "d2_inf08_1",
                                format: { type: "text", width: 100 },
                                editable: { type: "text", width: 100, validate: { rule: "required" } }
                            },
                            {
                                name: "d2_inf09_1",
                                format: { type: "text", width: 100 },
                                editable: { type: "text", width: 100 }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "전문대학", format: { type: "label" } },
                            {
                                name: "d2_inf02_2", mask: "date-ymd",
                                format: { type: "text", width: 100 },
                                editable: { type: "text", width: 100, maxlength: 10, validate: { rule: "dateISO" } }
                            },
                            {
                                name: "d2_inf03_2", mask: "date-ymd",
                                format: { type: "text", width: 100 },
                                editable: { type: "text", width: 100, maxlength: 10, validate: { rule: "dateISO" } }
                            },
                            {
                                name: "d2_inf01_2",
                                format: { type: "text", width: 100 },
                                editable: { type: "text", width: 100 }
                            },
                            {
                                name: "d2_inf06_2",
                                format: { type: "select", data: { memory: "주야" }, width: 100 },
                                editable: { type: "select", data: { memory: "주야" }, width: 100 }
                            },
                            {
                                name: "d2_inf04_2",
                                format: { type: "text", width: 100 },
                                editable: { type: "text", width: 100 }
                            },
                            {
                                name: "d2_inf05_2",
                                format: { type: "text", width: 100 },
                                editable: { type: "text", width: 100 }
                            },
                            //{
                            //    name: "d2_inf11_2",
                            //    format: { type: "select", data: { memory: "대학구분" }, width: 100 },
                            //    editable: { type: "select", data: { memory: "대학구분" }, width: 100 }
                            //},
                            {
                                name: "d2_inf07_2",
                                format: { type: "select", data: { memory: "졸업구분" }, width: 100 },
                                editable: { type: "select", data: { memory: "졸업구분" }, width: 100 }
                            },
                            {
                                name: "d2_inf08_2", style: { colfloat: "float" },
                                format: { type: "text", width: 50 },
                                editable: { type: "text", width: 50 }
                            },
                            {
                                name: "d2_inf12_2", style: { colfloat: "floated" },
                                format: { type: "select", data: { memory: "본교여부" }, width: 48 },
                                editable: { type: "select", data: { memory: "본교여부" }, width: 48 }
                            },
                            {
                                name: "d2_inf09_2",
                                format: { type: "text", width: 100 },
                                editable: { type: "text", width: 100 }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "대학교(정규)", format: { type: "label" } },
                            {
                                name: "d2_inf02_3", mask: "date-ymd",
                                format: { type: "text", width: 100 },
                                editable: { type: "text", width: 100, maxlength: 10, validate: { rule: "dateISO" } }
                            },
                            {
                                name: "d2_inf03_3", mask: "date-ymd",
                                format: { type: "text", width: 100 },
                                editable: { type: "text", width: 100, maxlength: 10, validate: { rule: "dateISO" } }
                            },
                            {
                                name: "d2_inf01_3",
                                format: { type: "text", width: 100 },
                                editable: { type: "text", width: 100 }
                            },
                            {
                                name: "d2_inf06_3",
                                format: { type: "select", data: { memory: "주야" }, width: 100 },
                                editable: { type: "select", data: { memory: "주야" }, width: 100 }
                            },
                            {
                                name: "d2_inf04_3",
                                format: { type: "text", width: 100 },
                                editable: { type: "text", width: 100 }
                            },
                            {
                                name: "d2_inf05_3",
                                format: { type: "text", width: 100 },
                                editable: { type: "text", width: 100 }
                            },
                            //{
                            //    name: "d2_inf11_3",
                            //    format: { type: "select", data: { memory: "대학구분" }, width: 100 },
                            //    editable: { type: "select", data: { memory: "대학구분" }, width: 100 }
                            //},
                            {
                                name: "d2_inf07_3",
                                format: { type: "select", data: { memory: "졸업구분" }, width: 100 },
                                editable: { type: "select", data: { memory: "졸업구분" }, width: 100 }
                            },
                            {
                                name: "d2_inf08_3", style: { colfloat: "float" },
                                format: { type: "text", width: 50 },
                                editable: { type: "text", width: 50 }
                            },
                            {
                                name: "d2_inf12_3", style: { colfloat: "floated" },
                                format: { type: "select", data: { memory: "본교여부" }, width: 48 },
                                editable: { type: "select", data: { memory: "본교여부" }, width: 48 }
                            },
                            {
                                name: "d2_inf09_3",
                                format: { type: "text", width: 100 },
                                editable: { type: "text", width: 100 }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "대학교(편입)", format: { type: "label" } },
                            {
                                name: "d2_inf02_4", mask: "date-ymd",
                                format: { type: "text", width: 100 },
                                editable: { type: "text", width: 100, maxlength: 10, validate: { rule: "dateISO" } }
                            },
                            {
                                name: "d2_inf03_4", mask: "date-ymd",
                                format: { type: "text", width: 100 },
                                editable: { type: "text", width: 100, maxlength: 10, validate: { rule: "dateISO" } }
                            },
                            {
                                name: "d2_inf01_4",
                                format: { type: "text", width: 100 },
                                editable: { type: "text", width: 100 }
                            },
                            {
                                name: "d2_inf06_4",
                                format: { type: "select", data: { memory: "주야" }, width: 100 },
                                editable: { type: "select", data: { memory: "주야" }, width: 100 }
                            },
                            {
                                name: "d2_inf04_4",
                                format: { type: "text", width: 100 },
                                editable: { type: "text", width: 100 }
                            },
                            {
                                name: "d2_inf05_4",
                                format: { type: "text", width: 100 },
                                editable: { type: "text", width: 100 }
                            },
                            //{
                            //    name: "d2_inf11_4",
                            //    format: { type: "select", data: { memory: "대학구분" }, width: 100 },
                            //    editable: { type: "select", data: { memory: "대학구분" }, width: 100 }
                            //},
                            {
                                name: "d2_inf07_4",
                                format: { type: "select", data: { memory: "졸업구분" }, width: 100 },
                                editable: { type: "select", data: { memory: "졸업구분" }, width: 100 }
                            },
                            {
                                name: "d2_inf08_4", style: { colfloat: "float" },
                                format: { type: "text", width: 50 },
                                editable: { type: "text", width: 50 }
                            },
                            {
                                name: "d2_inf12_4", style: { colfloat: "floated" },
                                format: { type: "select", data: { memory: "본교여부" }, width: 48 },
                                editable: { type: "select", data: { memory: "본교여부" }, width: 48 }
                            },
                            {
                                name: "d2_inf09_4",
                                format: { type: "text", width: 100 },
                                editable: { type: "text", width: 100 }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "대학원(석사)", format: { type: "label" } },
                            {
                                name: "d2_inf02_8", mask: "date-ymd",
                                format: { type: "text", width: 100 },
                                editable: { type: "text", width: 100, maxlength: 10, validate: { rule: "dateISO" } }
                            },
                            {
                                name: "d2_inf03_8", mask: "date-ymd",
                                format: { type: "text", width: 100 },
                                editable: { type: "text", width: 100, maxlength: 10, validate: { rule: "dateISO" } }
                            },
                            {
                                name: "d2_inf01_8",
                                format: { type: "text", width: 100 },
                                editable: { type: "text", width: 100 }
                            },
                            {
                                name: "d2_inf06_8",
                                format: { type: "select", data: { memory: "주야" }, width: 100 },
                                editable: { type: "select", data: { memory: "주야" }, width: 100 }
                            },
                            {
                                name: "d2_inf04_8",
                                format: { type: "text", width: 100 },
                                editable: { type: "text", width: 100 }
                            },
                            {
                                name: "d2_inf05_8",
                                format: { type: "text", width: 100 },
                                editable: { type: "text", width: 100 }
                            },
                            //{
                            //    name: "d2_inf11_8",
                            //    format: { type: "select", data: { memory: "대학구분" }, width: 100 },
                            //    editable: { type: "select", data: { memory: "대학구분" }, width: 100 }
                            //},
                            {
                                name: "d2_inf07_8",
                                format: { type: "select", data: { memory: "졸업구분" }, width: 100 },
                                editable: { type: "select", data: { memory: "졸업구분" }, width: 100 }
                            },
                            {
                                name: "d2_inf08_8", style: { colfloat: "float" },
                                format: { type: "text", width: 50 },
                                editable: { type: "text", width: 50 }
                            },
                            {
                                name: "d2_inf12_8", style: { colfloat: "floated" },
                                format: { type: "select", data: { memory: "본교여부" }, width: 48 },
                                editable: { type: "select", data: { memory: "본교여부" }, width: 48 }
                            },
                            {
                                name: "d2_inf09_8",
                                format: { type: "text", width: 100 },
                                editable: { type: "text", width: 100 }
                            }
                        ]
                    },
                    //{
                    //    element: [
                    //        { header: true, value: "석사", format: { type: "label" } },
                    //        { header: true, value: "세부전공", format: { type: "label" } },
                    //        {
                    //            name: "d2_inf13_8",
                    //            format: { type: "text", width: 214 },
                    //            editable: { type: "text", width: 214 }, style: { colspan: 2 }
                    //        },
                    //        { header: true, value: "논문제목", format: { type: "label" } },
                    //        {
                    //            name: "d2_inf10_8",
                    //            format: { type: "text", width: 558 },
                    //            editable: { type: "text", width: 558 }, style: { colspan: 5 }
                    //        }
                    //    ]
                    //},
                    {
                        element: [
                            { header: true, value: "대학원(박사)", format: { type: "label" } },
                            {
                                name: "d2_inf02_9", mask: "date-ymd",
                                format: { type: "text", width: 100 },
                                editable: { type: "text", width: 100, maxlength: 10, validate: { rule: "dateISO" } }
                            },
                            {
                                name: "d2_inf03_9", mask: "date-ymd",
                                format: { type: "text", width: 100 },
                                editable: { type: "text", width: 100, maxlength: 10, validate: { rule: "dateISO" } }
                            },
                            {
                                name: "d2_inf01_9",
                                format: { type: "text", width: 100 },
                                editable: { type: "text", width: 100 }
                            },
                            {
                                name: "d2_inf06_9",
                                format: { type: "select", data: { memory: "주야" }, width: 100 },
                                editable: { type: "select", data: { memory: "주야" }, width: 100 }
                            },
                            {
                                name: "d2_inf04_9",
                                format: { type: "text", width: 100 },
                                editable: { type: "text", width: 100 }
                            },
                            {
                                name: "d2_inf05_9",
                                format: { type: "text", width: 100 },
                                editable: { type: "text", width: 100 }
                            },
                            //{
                            //    name: "d2_inf11_9",
                            //    format: { type: "select", data: { memory: "대학구분" }, width: 100 },
                            //    editable: { type: "select", data: { memory: "대학구분" }, width: 100 }
                            //},
                            {
                                name: "d2_inf07_9",
                                format: { type: "select", data: { memory: "졸업구분" }, width: 100 },
                                editable: { type: "select", data: { memory: "졸업구분" }, width: 100 }
                            },
                            {
                                name: "d2_inf08_9", style: { colfloat: "float" },
                                format: { type: "text", width: 50 },
                                editable: { type: "text", width: 50 }
                            },
                            {
                                name: "d2_inf12_9", style: { colfloat: "floated" },
                                format: { type: "select", data: { memory: "본교여부" }, width: 48 },
                                editable: { type: "select", data: { memory: "본교여부" }, width: 48 }
                            },
                            {
                                name: "d2_inf09_9",
                                format: { type: "text", width: 100 },
                                editable: { type: "text", width: 100 }
                            }
                        ]
                    }//,
                    //{
                    //    element: [
                    //        { header: true, value: "박사", format: { type: "label" } },
                    //        { header: true, value: "세부전공", format: { type: "label" } },
                    //        {
                    //            name: "d2_inf13_9",
                    //            format: { type: "text", width: 214 },
                    //            editable: { type: "text", width: 214 }, style: { colspan: 2 }
                    //        },
                    //        { header: true, value: "논문제목", format: { type: "label" } },
                    //        {
                    //            name: "d2_inf10_9",
                    //            format: { type: "text", width: 558 },
                    //            editable: { type: "text", width: 558 }, style: { colspan: 5 }
                    //        }
                    //    ]
                    //}
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_병역", query: "HRM_8000_02", type: "TABLE", title: "병역사항",
            caption: true, show: true, selectable: true,
            editable: { bind: "select", focus: "d1_inf03", validate: true },
            content: {
                width: { label: 60, field: 70 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "구분", format: { type: "label" } },
                            {
                                name: "d1_inf03",
                                //format: { type: "select", data: { memory: "병역구분" }, width: 100 },
                                editable: { type: "select", data: { memory: "병역구분" }, width: 100, validate: { rule: "required" } }
                            },
                            { header: true, value: "군별", format: { type: "label" } },
                            {
                                name: "d1_inf04",
                                //format: { type: "select", data: { memory: "군별" }, width: 100 },
                                editable: { type: "select", data: { memory: "군별" }, width: 100, validate: { rule: "required" } }
                            },
                            { header: true, value: "계급", format: { type: "label" } },
                            { name: "d1_inf05", editable: { type: "text", width: 100 } },
                            { header: true, value: "복무기간", format: { type: "label" } },
                            { name: "d1_inf06", mask: "date-ymd", editable: { type: "text", width: 100, maxlength: 10 } },
                            { name: "d1_inf07", mask: "date-ymd", editable: { type: "text", width: 100, maxlength: 10 } },
                            { header: true, value: "면제사유", format: { type: "label" } },
                            {
                                name: "d1_inf08", format: { type: "text", width: 150 },
                                editable: { type: "text", width: 100, maxlength: 25 }
                            },
                            { name: "ann_key", editable: { type: "hidden" }, hidden: true },
                            { name: "ann_seq", editable: { type: "hidden" }, hidden: true },
                            { name: "app_key", editable: { type: "hidden" }, hidden: true }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_가족", query: "HRM_8000_04", title: "가족사항",
            height: 325, show: false, caption: true, selectable: true, number: true, // dynamic: true, multi: true, checkrow: true,
            editable: { bind: "select", focus: "relation", validate: true },
            element: [
				{
				    header: "관계", name: "relation", width: 40,
				    format: { type: "select", data: { memory: "관계" }, width: 76 },
				    editable: {
				        type: "select", data: { memory: "관계", unshift: [{ title: "-", value: "" }] },
				        width: 76, validate: { rule: "required" }
				    }
				},
				{
				    header: "성명", name: "name", width: 60,
				    editable: { type: "text", width: 116, validate: { rule: "required" } }
				},
				{
				    header: "연령", name: "age", width: 40, align: "right", mask: "numeric-int", fix: { mask: "numeric-int" },
				    editable: { type: "text", width: 80, validate: { rule: "required" }, maxlength: 3 }
				},
				//{
				//    header: "최종학력", name: "edugrade", width: 40,
				//    format: { type: "select", data: { memory: "최종학력" }, width: 76 },
				//    editable: {
				//        type: "select", data: { memory: "최종학력", unshift: [{ title: "-", value: "" }] },
				//        width: 76//, validate: { rule: "required" }
				//    }
				//},
				//{
				//    header: "출신교명", name: "school_nm", width: 100,
				//    editable: { type: "text", width: 190, validate: { rule: "required" } }
				//},
				{
				    header: "현직장명", name: "co_nm", width: 160,
				    editable: { type: "text", width: 300, validate: { rule: "required" } }
				},
				{
				    header: "직위", name: "grade_nm", width: 60,
				    editable: { type: "text", width: 116 }
				},
				{
				    header: "동거", name: "live_yn", width: 60, align: "center",
				    format: { type: "checkbox", title: "", value: "1", offval: "0" },
				    editable: { type: "checkbox", title: "", value: "1", offval: "0" }
				},
                { name: "ann_key", editable: { type: "hidden" }, hidden: true },
                { name: "ann_seq", editable: { type: "hidden" }, hidden: true },
                { name: "app_key", editable: { type: "hidden" }, hidden: true },
                { name: "rec_seq", editable: { type: "hidden" }, hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_가족", query: "HRM_8000_02", type: "TABLE", title: "가족사항",
            caption: false, show: false, selectable: true,
            editable: { bind: "select", focus: "d1_inf09", validate: true },
            content: {
                width: { label: 70, field: 70 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "부모생존여부", format: { type: "label" } },
                            { name: "d1_inf09", editable: { type: "select", data: { memory: "부모" }, width: 89 } },
                            { header: true, value: "형제자매", format: { type: "label" } },
                            { name: "d1_inf10", editable: { type: "text", width: 85 } },
                            { header: true, value: "종교", format: { type: "label" } },
                            { name: "d1_inf11", editable: { type: "text", width: 85 } },
                            { header: true, value: "취미", format: { type: "label" } },
                            { name: "d1_inf12", editable: { type: "text", width: 85 } },
                            { header: true, value: "결혼기념일", format: { type: "label" } },
                            { name: "d1_inf13", mask: "date-ymd", editable: { type: "text", width: 85, maxlength: 10 } },
                            { header: true, value: "보훈대상여부", format: { type: "label" } },
                            {
                                name: "보훈대상여부", align: "center",
                                format: { type: "checkbox", title: "", value: "1", offval: "0" },
                                editable: { type: "checkbox", title: "", value: "1", offval: "0" }
                            },
                            { name: "ann_key", editable: { type: "hidden" }, hidden: true },
                            { name: "ann_seq", editable: { type: "hidden" }, hidden: true },
                            { name: "app_key", editable: { type: "hidden" }, hidden: true }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_건강", query: "HRM_8000_02", type: "TABLE", title: "건강사항",
            caption: true, show: true, selectable: true,
            editable: { bind: "select", focus: "d1_inf15", validate: true },
            content: {
                width: { label: 70, field: 70 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "신장(㎝)", format: { type: "label" } },
                            { name: "d1_inf15", editable: { type: "text", width: 104 }, mask: "numeric-float", fix: { mask: "numeric-float" } },
                            { header: true, value: "체중(㎏)", format: { type: "label" } },
                            { name: "d1_inf16", editable: { type: "text", width: 104 }, mask: "numeric-float", fix: { mask: "numeric-float" } },
                            { header: true, value: "혈액형", format: { type: "label" } },
                            { name: "d1_inf17", editable: { type: "text", width: 104, maxlength: 5 } },
                            { header: true, value: "시력(좌,우)", format: { type: "label" } },
                            { name: "d1_inf18", editable: { type: "text", width: 50 }, mask: "numeric-float", style: { colfloat: "float" } },
                            { name: "d1_inf19", editable: { type: "text", width: 50 }, mask: "numeric-float", style: { colfloat: "floated" } },
                            { header: true, value: "신체장애", format: { type: "label" } },
                            {
                                name: "d1_inf20",
                                //format: { type: "select", data: { memeory: "장애" }, width: 104 },
                                editable: { type: "select", data: { memory: "장애" }, width: 104 }
                            },
                            { name: "ann_key", editable: { type: "hidden" }, hidden: true },
                            { name: "ann_seq", editable: { type: "hidden" }, hidden: true },
                            { name: "app_key", editable: { type: "hidden" }, hidden: true }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_경력2", query: "HRM_8000_05_3", type: "TABLE", title: "최종회사 연봉",
            caption: true, show: true, selectable: true,
            editable: { bind: "select", focus: "d10_inf01", validate: true },
            content: {
                width: { label: 100, field: 150 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "식대", format: { type: "label" } },
                            { header: true, value: "기본연봉 포함", format: { type: "label" }, style: { rowspan: 3 } },
                            {
                                name: "d10_inf01",
                                editable: { type: "select", data: { memory: "포함여부" } }
                            },
                            {
                                name: "d10_inf02", mask: "numeric-int", style: { colfloat: "float" },
                                format: { type: "text" }, editable: { type: "text", maxlength: 10 }
                            },
                            {
                                name: "unit", style: { colfloat: "floated" },
                                format: { type: "text" }, editable: { type: "hidden", width: 30 }
                            },
                            { header: true, value: "연봉외 급여", format: { type: "label" } },
                            {
                                name: "d10_inf03", mask: "numeric-int", style: { colfloat: "float" },
                                format: { type: "text" }, editable: { type: "text", maxlength: 10 }
                            },
                            {
                                name: "unit", style: { colfloat: "floated" },
                                format: { type: "text" }, editable: { type: "hidden", width: 30 }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "연월차", format: { type: "label" } },
                            {
                                name: "d10_inf04",
                                editable: { type: "select", data: { memory: "포함여부" } }
                            },
                            {
                                name: "d10_inf05", mask: "numeric-int", style: { colfloat: "float" },
                                format: { type: "text" }, editable: { type: "text", maxlength: 10 }
                            },
                            {
                                name: "unit", style: { colfloat: "floated" },
                                format: { type: "text" }, editable: { type: "hidden", width: 30 }
                            },
                            { header: true, value: "성과급", format: { type: "label" } },
                            {
                                name: "d10_inf06", mask: "numeric-int", style: { colfloat: "float" },
                                format: { type: "text" }, editable: { type: "text", maxlength: 10 }
                            },
                            {
                                name: "unit", style: { colfloat: "floated" },
                                format: { type: "text" }, editable: { type: "hidden", width: 30 }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "퇴직금", format: { type: "label" } },
                            {
                                name: "d10_inf07",
                                editable: { type: "select", data: { memory: "포함여부" } }
                            },
                            {
                                name: "d10_inf08", mask: "numeric-int", style: { colfloat: "float" },
                                format: { type: "text" }, editable: { type: "text", maxlength: 10 }
                            },
                            {
                                name: "unit", style: { colfloat: "floated" },
                                format: { type: "text" }, editable: { type: "hidden", width: 30 }
                            },
                            { header: true, value: "기타", format: { type: "label" } },
                            {
                                name: "d10_inf09", mask: "numeric-int", style: { colfloat: "float" },
                                format: { type: "text" }, editable: { type: "text", maxlength: 10 }
                            },
                            {
                                name: "unit", style: { colfloat: "floated" },
                                format: { type: "text" }, editable: { type: "hidden", width: 30 }
                            },
                            { name: "ann_key", editable: { type: "hidden" }, hidden: true },
                            { name: "ann_seq", editable: { type: "hidden" }, hidden: true },
                            { name: "app_key", editable: { type: "hidden" }, hidden: true },
                            { name: "insert_yn", hidden: true }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_경력", query: "HRM_8000_05", title: "경력사항",
            height: 70, show: true, caption: true, selectable: true, number: true, // dynamic: true, multi: true, checkrow: true,
            //editable: { bind: "select", focus: "d3_inf01", validate: true },
            element: [
				{
				    header: "회사명", name: "d3_inf01", width: 80//,
				    //editable: { type: "text", validate: { rule: "required" }, width: 166 }
				},
				{
				    header: "소재지", name: "d3_inf02", width: 60//,
				    //editable: { type: "text", width: 124 }
				},
				{
				    header: "근무기간", name: "d3_inf03", width: 50, align: "center", mask: "date-ymd"//,
				    //editable: { type: "text", validate: { rule: "required" }, width: 100 }
				},
				{
				    header: "근무기간", name: "d3_inf04", width: 50, align: "center", mask: "date-ymd"//,
				    //editable: { type: "text", validate: { rule: "required" }, width: 100 }
				},
				{ header: "직위", name: "d3_inf05", width: 50/*, editable: { type: "text", width: 106 }*/ },
				{
				    header: "담당업무", name: "d3_inf06", width: 60//,
				    //editable: { type: "text", validate: { rule: "required" }, width: 125 }
				},
				{
				    header: "연봉(만원)", name: "d3_inf07", width: 60, mask: "numeric-int", fix: { mask: "numeric-int" }, align: "right"//,
				    //editable: { type: "text", width: 124 }
				},
				{
				    header: "퇴직(이직)사유", name: "d3_inf08", width: 100//,
				    //editable: { type: "text", validate: { rule: "required" }, width: 206 }
				},
                { name: "d3_inf09", editable: { type: "text" }, hidden: true },
                { name: "d3_inf10", editable: { type: "text" }, hidden: true },
                { name: "d3_inf11", editable: { type: "text" }, hidden: true },
                { name: "d3_inf12", editable: { type: "text" }, hidden: true },
                { name: "d3_inf13", editable: { type: "textarea" }, hidden: true },
                { name: "ann_key", editable: { type: "text" }, hidden: true },
                { name: "ann_seq", editable: { type: "text" }, hidden: true },
                { name: "app_key", editable: { type: "text" }, hidden: true },
                { name: "rec_seq", editable: { type: "text" }, hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_경력", query: "HRM_8000_05_2", type: "TABLE", title: "주요 경력 및 보유 기술",
            caption: false, show: true, selectable: true,
            editable: { bind: "select", focus: "d3_inf09", validate: true },
            content: {
                width: { label: 80, field: 110 }, height: 25,
                row: [
                    {
                        element: [
                            //{ header: true, value: "사업품목", format: { type: "label" } },
                            //{ name: "d3_inf09"/*, editable: { type: "text", width: 172, maxlength: 20 }*/ },
                            { header: true, value: "매출액(억원)", format: { type: "label" } },
                            {
                                name: "d3_inf11"//, mask: "numeric-int", fix: { mask: "numeric-int" },
                                //editable: { type: "text", width: 172 }
                            },
                            { header: true, value: "매출연도", format: { type: "label" } },
                            {
                                name: "d3_inf10"//, mask: "numeric-int", fix: { mask: "numeric-int" },
                                //editable: { type: "text", maxlength: 4, width: 172 }
                            },
                            { header: true, value: "종업원수", format: { type: "label" } },
                            {
                                name: "d3_inf12", mask: "numeric-int", fix: { mask: "numeric-int" }//,
                                //editable: { type: "text", width: 172 }
                            },
                            { name: "ann_key", editable: { type: "hidden" }, hidden: true },
                            { name: "ann_seq", editable: { type: "hidden" }, hidden: true },
                            { name: "app_key", editable: { type: "hidden" }, hidden: true },
                            { name: "rec_seq", editable: { type: "hidden" }, hidden: true }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "주요 경력<br><br>및<br><br>보유 기술", format: { type: "label" } },
                            {
                                name: "d3_inf13", style: { colspan: 5 },
                                format: { type: "textarea", rows: 10, width: 1000 }//,
                                //editable: { type: "textarea", rows: 18, width: 1000 }
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
            targetid: "grdData_외국어", query: "HRM_8000_06", title: "외국어 능력",
            height: 50, show: true, caption: true, selectable: true, number: true, // dynamic: true, multi: true, checkrow: true,
            editable: { bind: "select", focus: "d5_inf01", validate: true },
            element: [
				{
				    header: "외국어명", name: "d5_inf01", width: 180,
				    editable: { type: "text", width: 306, validate: { rule: "required" } }
				},
				{
				    header: "회화", name: "d5_inf02", width: 60, align: "center",
				    format: { type: "select", data: { memory: "등급2" }, width: 104 },
				    editable: { type: "select", data: { memory: "등급2" }, width: 104 }
				},
				{
				    header: "독해", name: "d5_inf03", width: 60, align: "center",
				    format: { type: "select", data: { memory: "등급2" }, width: 104 },
				    editable: { type: "select", data: { memory: "등급2" }, width: 104 }
				},
				{
				    header: "TEST명", name: "d5_inf04", width: 180,
				    format: { type: "select", data: { memory: "외국어", unshift: [{ title: "-", value: "" }] }, width: 304 },
				    editable: { type: "select", data: { memory: "외국어", unshift: [{ title: "-", value: "" }] }, width: 304 }
				},
				{
				    header: "종합점수", name: "d5_inf05", width: 40, mask: "numeric-float", fix: { mask: "numeric-float" }, align: "right",
				    editable: { type: "text", width: 72 }
				},
				{
				    header: "등급", name: "d5_inf07", width: 60,
				    editable: { type: "text", maxlength: 20, width: 104 }
				},
				{
				    header: "취득연도", name: "d5_inf06", width: 40, align: "center",
				    editable: { type: "text", width: 72, maxlength: 4 }
				},
                { name: "ann_key", editable: { type: "hidden" }, hidden: true },
                { name: "ann_seq", editable: { type: "hidden" }, hidden: true },
                { name: "app_key", editable: { type: "hidden" }, hidden: true },
                { name: "rec_seq", editable: { type: "hidden" }, hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_수상", query: "HRM_8000_07", title: "수상경력",
            height: 50, show: false, caption: true, selectable: true, number: true, // dynamic: true, multi: true, checkrow: true,
            editable: { bind: "select", focus: "d6_inf01", validate: true },
            element: [
				{
				    header: "수상내용", name: "d6_inf01", width: 250,
				    editable: { type: "text", width: 406, validate: { rule: "required" } }
				},
				{ header: "수상처", name: "d6_inf02", width: 150, editable: { type: "text", width: 246 } },
				{
				    header: "수상연도", name: "d6_inf03", width: 60,
				    editable: { type: "text", width: 102, maxlength: 4 }
				},
				{ header: "비고", name: "d6_inf04", width: 200, editable: { type: "text", width: 325 } },
                { name: "ann_key", editable: { type: "hidden" }, hidden: true },
                { name: "ann_seq", editable: { type: "hidden" }, hidden: true },
                { name: "app_key", editable: { type: "hidden" }, hidden: true },
                { name: "rec_seq", editable: { type: "hidden" }, hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_사회", query: "HRM_8000_11", title: "사회활동",
            height: 50, show: true, caption: true, selectable: true, number: true, // dynamic: true, multi: true, checkrow: true,
            editable: { bind: "select", focus: "d11_inf01", validate: true },
            element: [
				{
				    header: "기관 및 장소", name: "d11_inf01", width: 250,
				    editable: { type: "text", width: 406, validate: { rule: "required" } }
				},
				{ header: "구분", name: "d11_inf02", width: 150, editable: { type: "text", width: 246 } },
				{
				    header: "활동기간", name: "d11_inf03", width: 60,
				    editable: { type: "text", width: 102, maxlength: 4 }
				},
				{ header: "주요활동내용", name: "d11_inf04", width: 200, editable: { type: "text", width: 325 } },
                { name: "ann_key", editable: { type: "hidden" }, hidden: true },
                { name: "ann_seq", editable: { type: "hidden" }, hidden: true },
                { name: "app_key", editable: { type: "hidden" }, hidden: true },
                { name: "rec_seq", editable: { type: "hidden" }, hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_자격", query: "HRM_8000_09", title: "자격/면허",
            height: 75, show: true, caption: true, selectable: true, number: true, // dynamic: true, multi: true, checkrow: true,
            editable: { bind: "select", focus: "d7_inf01", validate: true },
            element: [
				{ header: "자격명", name: "d7_inf01", width: 200, editable: { type: "text", width: 386 } },
				{ header: "등급", name: "d7_inf02", width: 60, editable: { type: "text", width: 114 } },
				{
				    header: "취득일자", name: "d7_inf03", width: 60, align: "center", mask: "date-ymd",
				    editable: { type: "text", width: 120, maxlength: 10 }
				},
				{
				    header: "만료일자", name: "d7_inf05", width: 60, align: "center", mask: "date-ymd",
				    editable: { type: "text", width: 120, maxlength: 10 }
				},
				{ header: "발급처", name: "d7_inf04", width: 200, editable: { type: "text", width: 386 } },
                { name: "ann_key", editable: { type: "hidden" }, hidden: true },
                { name: "ann_seq", editable: { type: "hidden" }, hidden: true },
                { name: "app_key", editable: { type: "hidden" }, hidden: true },
                { name: "rec_seq", editable: { type: "hidden" }, hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_능력", query: "HRM_8000_10", title: "전산 / CAD / 제어 능력",
            height: 210, show: false, caption: true, selectable: true, number: true, // dynamic: true, multi: true, checkrow: true,
            editable: { bind: "select", focus: "d8_inf01", validate: true },
            element: [
				{ header: "구분", name: "d8_inf01", width: 120, editable: { type: "hidden" } },
				{ header: "Language/자격구분/상품명", name: "d8_inf02", width: 200, editable: { type: "text", width: 386 } },
				{
				    header: "능력정도", name: "d8_inf03", width: 80,
				    format: { type: "select", data: { memory: "등급" } },
				    editable: { type: "select", data: { memory: "등급" }, width: 155 }
				},
				{ header: "경험/기간", name: "d8_inf04", width: 150, editable: { type: "text", width: 290 } },
                { name: "ann_key", editable: { type: "hidden" }, hidden: true },
                { name: "ann_seq", editable: { type: "hidden" }, hidden: true },
                { name: "app_key", editable: { type: "hidden" }, hidden: true },
                { name: "rec_seq", editable: { type: "hidden" }, hidden: true },
                { name: "insert_yn", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_해외", query: "HRM_8000_08", title: "해외여행",
            height: 50, show: false, caption: true, selectable: true, number: true, // dynamic: true, multi: true, checkrow: true,
            editable: { bind: "select", focus: "d9_inf01", validate: true },
            element: [
				{ header: "국명", name: "d9_inf01", width: 100, editable: { type: "text", width: 148 } },
				{ header: "체류기간", name: "d9_inf02", width: 200, editable: { type: "text", width: 288 } },
				{ header: "여행목적", name: "d9_inf03", width: 150, editable: { type: "text", width: 218 } },
				{ header: "해외여행 결격사유", name: "d9_inf04", width: 300, editable: { type: "text", width: 430 } },
                { name: "ann_key", editable: { type: "hidden" }, hidden: true },
                { name: "ann_seq", editable: { type: "hidden" }, hidden: true },
                { name: "app_key", editable: { type: "hidden" }, hidden: true },
                { name: "rec_seq", editable: { type: "hidden" }, hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_추천", query: "HRM_8000_02", type: "TABLE", title: "",
            caption: false, show: true, selectable: true,
            editable: { bind: "select", focus: "d1_inf23", validate: true },
            content: {
                width: { label: 70, field: 70 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "추천자(테크데이타)", format: { type: "label" } },
                            { name: "d1_inf23", editable: { type: "text", width: 182, maxlength: 20 } },
                            { header: true, value: "부서", format: { type: "label" } },
                            { name: "d1_inf24", editable: { type: "text", width: 182, maxlength: 20 } },
                            { header: true, value: "관계", format: { type: "label" } },
                            { name: "d1_inf25", editable: { type: "text", width: 182, maxlength: 20 } },
                            { name: "ann_key", editable: { type: "hidden" }, hidden: true },
                            { name: "ann_seq", editable: { type: "hidden" }, hidden: true },
                            { name: "app_key", editable: { type: "hidden" }, hidden: true }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "테크데이타를 알게 된 동기", format: { type: "label" } },
                            {
                                name: "d1_inf21", style: { colspan: 5 },
                                format: { type: "text", width: 945 },
                                editable: { type: "text", width: 945, maxlength: 100 }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "채용정보를 알게된 방법", format: { type: "label" } },
                            {
                                name: "d1_inf22", style: { colspan: 5 },
                                format: { type: "text", width: 945 },
                                editable: { type: "text", width: 945, maxlength: 100 }
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
            targetid: "frmData_자기소개", query: "HRM_8000_02", type: "TABLE", title: "자기소개서 <font color='red'> (각 항목별 " + v_global.logic.max1 + "자 이내로 입력하세요.)</font>",
            caption: true, show: true, selectable: true,
            editable: { bind: "select", focus: "d1_inf26", validate: true },
            content: {
                width: { label: 10, field: 90 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "1. 지원자 기본사항에 대하여 자세히 작성해 주시기 바랍니다.(성장과정, 성격, 자신의 강/약점, 형제/교우관계, 가치관 등)", format: { type: "label" } }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "d1_inf26",
                                format: { type: "textarea", rows: 5, width: 1130 },
                                editable: { type: "textarea", rows: 5, width: 1130 }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "2. 본인이 속한 조직에서 새로운 것을 도입하여 변화를 일으킨 사례를 구체적으로 기재해 주시기 바랍니다.", format: { type: "label" } }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "d1_inf31",
                                format: { type: "textarea", rows: 5, width: 1130 },
                                editable: { type: "textarea", rows: 5, width: 1130 }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "3. 어떤 목표를 세우고 그 목표를 달성하기 위해 노력했던 사례와 그 결과에 대해 구체적으로 기재해 주시기 바랍니다.", format: { type: "label" } }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "d1_inf32",
                                format: { type: "textarea", rows: 5, width: 1130 },
                                editable: { type: "textarea", rows: 5, width: 1130 }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "4. 본인이 지원하는 직무에 적합하다고 생각하는 이유를 구체적으로 기술해 주시기 바랍니다.", format: { type: "label" } }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "d1_inf33",
                                format: { type: "textarea", rows: 5, width: 1130 },
                                editable: { type: "textarea", rows: 5, width: 1130, validate: { rule: "required" } }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "5. 지원 동기와 입사 후 테크데이타에서 자신의 미래모습을 기술해 주시기 바랍니다.", format: { type: "label" } }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "d1_inf34",
                                format: { type: "textarea", rows: 5, width: 1130 },
                                editable: { type: "textarea", rows: 5, width: 1130, validate: { rule: "required" } }
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
            target: [
                //{ type: "FORM", id: "frmData_지원정보", offset: 8 },
				//{ type: "FORM", id: "frmData_사진", offset: 8 },
				{ type: "FORM", id: "frmData_인적", offset: 8 },
				{ type: "FORM", id: "frmData_학력", offset: 8 },
				{ type: "FORM", id: "frmData_병역", offset: 8 },
				{ type: "FORM", id: "frmData_경력2", offset: 8 },
				{ type: "GRID", id: "grdData_경력", offset: 8 },
				{ type: "FORM", id: "frmData_경력", offset: 8 },
				{ type: "GRID", id: "grdData_가족", offset: 8 },
				{ type: "FORM", id: "frmData_가족", offset: 8 },
				{ type: "FORM", id: "frmData_건강", offset: 8 },
				{ type: "GRID", id: "grdData_외국어", offset: 8 },
				{ type: "GRID", id: "grdData_수상", offset: 8 },
				{ type: "GRID", id: "grdData_사회", offset: 8 },
				{ type: "GRID", id: "grdData_자격", offset: 8 },
				{ type: "GRID", id: "grdData_능력", offset: 8 },
				{ type: "GRID", id: "grdData_해외", offset: 8 },
				{ type: "FORM", id: "frmData_추천", offset: 8 },
                { type: "FORM", id: "frmData_자기소개", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        var args = {
            tabid: "lyrTab",
            target: [
                { type: "LAYER", id: "lyrTab_1", title: "인적사항" },
				{ type: "LAYER", id: "lyrTab_2", title: "경력" },
				{ type: "LAYER", id: "lyrTab_3", title: "자격/면허, 외국어" },
				{ type: "LAYER", id: "lyrTab_4", title: "자기소개서" }
            ]
        };
        //----------
        gw_com_module.convertTab(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "TAB", id: "lyrTab", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        //----------
        gw_com_module.informSize();
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
        var args = { targetid: "btnMove_1", element: "next", event: "click", handler: processTabChange };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "btnMove_2", element: "prev", event: "click", handler: processTabChange };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "btnMove_2", element: "next", event: "click", handler: processTabChange };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "btnMove_3", element: "prev", event: "click", handler: processTabChange };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "btnMove_3", element: "next", event: "click", handler: processTabChange };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "btnMove_4", element: "prev", event: "click", handler: processTabChange };
        gw_com_module.eventBind(args);
        //----------
        //var args = { targetid: "btnMove_4", element: "next", event: "click", handler: processTabChange };
        //gw_com_module.eventBind(args);
        ////----------
        //var args = { targetid: "btnMove_5", element: "prev", event: "click", handler: processTabChange };
        //gw_com_module.eventBind(args);
        ////----------
        //var args = { targetid: "btnMove_5", element: "next", event: "click", handler: processTabChange };
        //gw_com_module.eventBind(args);
        ////----------
        //var args = { targetid: "btnMove_6", element: "prev", event: "click", handler: processTabChange };
        //gw_com_module.eventBind(args);
        ////----------
        var args = { targetid: "btnMove_4", element: "save", event: "click", handler: processSave };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "btnMove_4", element: "submit", event: "click", handler: processSubmit };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "btn_가족", element: "추가", event: "click", handler: processInsert };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "btn_가족", element: "삭제", event: "click", handler: processDelete };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "btn_경력", element: "추가", event: "click", handler: processInsert };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "btn_경력", element: "수정", event: "click", handler: processInsert };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "btn_경력", element: "삭제", event: "click", handler: processDelete };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "btn_외국어", element: "추가", event: "click", handler: processInsert };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "btn_외국어", element: "삭제", event: "click", handler: processDelete };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "btn_수상", element: "추가", event: "click", handler: processInsert };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "btn_수상", element: "삭제", event: "click", handler: processDelete };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "btn_사회", element: "추가", event: "click", handler: processInsert };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "btn_사회", element: "삭제", event: "click", handler: processDelete };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "btn_해외", element: "추가", event: "click", handler: processInsert };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "btn_해외", element: "삭제", event: "click", handler: processDelete };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "btn_자격", element: "추가", event: "click", handler: processInsert };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "btn_자격", element: "삭제", event: "click", handler: processDelete };
        gw_com_module.eventBind(args);
        ////----------
        //var args = { targetid: "btn_능력", element: "추가", event: "click", handler: processInsert };
        //gw_com_module.eventBind(args);
        ////----------
        //var args = { targetid: "btn_능력", element: "삭제", event: "click", handler: processDelete };
        //gw_com_module.eventBind(args);
        ////----------
        var args = { targetid: "lyrTab", event: "tabsselect", handler: processTabChange };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_지원정보", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_경력", grid: true, event: "rowselected", handler: processLink };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_인적", event: "keypress", element: "tel_no", handler: processKeypress };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_인적", event: "keypress", element: "mobile_no", handler: processKeypress };
        gw_com_module.eventBind(args);
        ////----------
        //var args = { targetid: "frmData_인적", event: "itemchanged", handler: processItemchanged };
        //gw_com_module.eventBind(args);
        ////----------
        var args = { targetid: "frmData_병역", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_건강", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_가족", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_자기소개", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        //var args = { targetid: "frmData_자기소개", event: "keypress", element: "d1_inf26", handler: processKeypress };
        //gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_자기소개", event: "keyup", element: "d1_inf26", handler: processKeyup };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_자기소개", event: "keyup", element: "d1_inf31", handler: processKeyup };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_자기소개", event: "keyup", element: "d1_inf32", handler: processKeyup };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_자기소개", event: "keyup", element: "d1_inf33", handler: processKeyup };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_자기소개", event: "keyup", element: "d1_inf34", handler: processKeyup };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_추천", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_경력", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_학력", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_가족", grid: true, event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_경력", grid: true, event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_외국어", grid: true, event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_수상", grid: true, event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_자격", grid: true, event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_능력", grid: true, event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);


        ////----------
        //var args = { targetid: "grdData_경력", grid: true, event: "rowdblclick", handler: processInsert };
        //gw_com_module.eventBind(args);
        ////----------


        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function processLogin(param) {

    var args = {
        type: "PAGE", page: "HRM_8009", title: "Login",
        width: 360, height: 300, locate: ["center", "center"], open: true
    };
    if (gw_com_module.dialoguePrepare(args) == false) {
        var args = {
            page: "HRM_8009",
            param: {
                ID: gw_com_api.v_Stream.msg_openedDialogue,
                data: {
                    ann_key: v_global.logic.ann_key,
                    ann_seq: v_global.logic.ann_seq
                }
            }
        };
        gw_com_module.dialogueOpen(args);
    }

}
//----------
function processInit(param) {
}
//----------
function processTabChange(param) {

    if (param == undefined) return;

    // Tabpage 이동
    if (param.object != undefined) {
        if (param.object == "lyrTab") {

        } else if (param.object.indexOf("btnMove") >= 0) {

            var oldindex = Number(param.object.split("_")[1]);
            var newindex = 0;
            if (param.element == "prev")
                newindex = oldindex - 1;
            else
                newindex = oldindex + 1;

            var args;
            switch (oldindex) {
                case 1: //인적사항
                    args = {
                        target: [
                            { type: "FORM", id: "frmData_인적" },
                            { type: "FORM", id: "frmData_학력" },
                            { type: "GRID", id: "grdData_가족" }
                        ]
                    };
                    break;
                case 2: //경력사항
                    args = {
                        target: [
                            { type: "FORM", id: "frmData_경력2" },
                            { type: "GRID", id: "grdData_경력" }
                        ]
                    };
                    break;
                case 3: //외국어, 자격/면허
                    args = {
                        target: [
                            { type: "GRID", id: "grdData_외국어" },
                            { type: "GRID", id: "grdData_수상" },
                            { type: "GRID", id: "grdData_사회" },
                            { type: "GRID", id: "grdData_해외" },
                            { type: "GRID", id: "grdData_자격" },
                            { type: "GRID", id: "grdData_능력" }
                        ]
                    };
                    break;
                case 4: //자기소개서
                    args = { target: [{ type: "FORM", id: "frmData_인적" }] };
                    break;
            }

            if (oldindex == 1) {
                //지원부문 예외처리
                if (gw_com_api.getValue("frmData_지원정보", 1, "d1_inf27") == "") {
                    gw_com_api.messageBox([
                        { text: "지원부문은 필수입력입니다." }
                    ]);
                    gw_com_api.setError(true, "frmData_지원정보", 1, "d1_inf27", false);
                    gw_com_api.setFocus("frmData_지원정보", 1, "d1_inf27");
                    return;
                }
                //사진 필수입력 처리
                if (gw_com_api.getValue("frmData_인적", 1, "d1_inf30") == "") {
                    gw_com_api.messageBox([
                        { text: "사진을 등록해 주세요." }
                    ]);
                    return;
                }
            }

            if (processCheckUpdatable(args)) {
                if (processSave(args) != undefined) return;
            } 

            gw_com_api.enableTab("lyrTab", newindex);
            gw_com_api.selectTab("lyrTab", newindex);
            gw_com_api.disableTab("lyrTab", oldindex);

            switch (newindex) {
                case 1: //인적사항
                    break;
                case 2: //경력사항
                    if (v_global.logic.message1) {
                        v_global.logic.message1 = false;
                        gw_com_api.messageBox([{ text: "경력 내용은 경력증명서, 건강보험 가입이력 등 <b>증명할 수 있는 이력</b>만 기재합니다." }], 570);
                    }
                    break;
                case 3: //외국어, 자격/면허
                    break;
                case 4: //자기소개서
                    break;
            }

        }
    }
}
//----------
function checkCRUD(param) {

    return gw_com_api.getCRUD("frmData_상세");

}
//----------
function processRetrieve(param) {

    if (v_global.logic.ann_key == undefined || v_global.logic.ann_key == "" ||
        v_global.logic.ann_seq == undefined || v_global.logic.ann_seq == "" ||
        v_global.logic.app_key == undefined || v_global.logic.app_key == "")
        return;

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_ann_key", value: v_global.logic.ann_key },
                { name: "arg_ann_seq", value: v_global.logic.ann_seq },
                { name: "arg_app_key", value: v_global.logic.app_key },
                { name: "arg_rec_seq", value: 0 }
            ]
        },
        target: [
            { type: "FORM", id: "frmData_지원정보", edit: true },
            { type: "FORM", id: "frmData_인적", edit: true },
            { type: "FORM", id: "frmData_학력", edit: true },
            { type: "FORM", id: "frmData_병역" },
            { type: "FORM", id: "frmData_건강" },
            { type: "GRID", id: "grdData_가족" },
            { type: "FORM", id: "frmData_가족" },
            { type: "GRID", id: "grdData_경력", select: true },
            { type: "FORM", id: "frmData_경력2" },
            { type: "GRID", id: "grdData_외국어" },
            { type: "GRID", id: "grdData_수상" },
            { type: "GRID", id: "grdData_사회" },
            { type: "GRID", id: "grdData_해외" },
            { type: "GRID", id: "grdData_자격" },
            { type: "GRID", id: "grdData_능력" },
            { type: "FORM", id: "frmData_자기소개" },
            { type: "FORM", id: "frmData_추천" }
        ],
        handler_complete: processRetrieveEnd
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {

    uf_setImage();

}
//----------
function processLink(param) {

    if (param.object == undefined) return;

    if (param.object == "grdData_경력") {
        //if (gw_com_api.getCRUD(param.object, param.row, true) == "retrieve") {
            var args = {
                source: {
                    type: "GRID", id: param.object, row: "selected", block: true,
                    element: [
                        { name: "ann_key", argument: "arg_ann_key" },
                        { name: "ann_seq", argument: "arg_ann_seq" },
                        { name: "app_key", argument: "arg_app_key" },
                        { name: "rec_seq", argument: "arg_rec_seq" }
                    ]
                },
                target: [
                    { type: "FORM", id: "frmData_경력", select: true }
                ]
            };
            gw_com_module.objRetrieve(args);
        //} else {
        //    gw_com_api.setValue("frmData_경력", 1, "d3_inf09", gw_com_api.getValue("grdData_경력", "selected", "d3_inf09", true));
        //    gw_com_api.setValue("frmData_경력", 1, "d3_inf10", gw_com_api.getValue("grdData_경력", "selected", "d3_inf10", true));
        //    gw_com_api.setValue("frmData_경력", 1, "d3_inf11", gw_com_api.getValue("grdData_경력", "selected", "d3_inf11", true));
        //    gw_com_api.setValue("frmData_경력", 1, "d3_inf12", gw_com_api.getValue("grdData_경력", "selected", "d3_inf12", true));
        //    gw_com_api.setValue("frmData_경력", 1, "d3_inf13", gw_com_api.getValue("grdData_경력", "selected", "d3_inf13", true));
        //    gw_com_api.setCRUD("frmData_경력", 1, gw_com_api.getCRUD("grdData_경력", param.row, true));
        //}
    }
}
//----------
function processKeypress(param) {

    if (param.object == undefined) return;
    
    if (param.element == undefined) {
    } else {
        switch (param.object) {
            case "frmData_인적":
                {
                    switch (param.element) {
                        case "tel_no":
                        case "mobile_no":
                            {
                                if (param.key == 48 || param.key == 49 || param.key == 50 || param.key == 51 || param.key == 52 ||
                                    param.key == 53 || param.key == 54 || param.key == 55 || param.key == 56 || param.key == 57) {
                                    return true;
                                } else {
                                    return false;
                                }
                            }
                            break;
                    }
                }
                break;
            case "frmData_자기소개":
                if (param.element == "d1_inf26") {
                    var a = 'a';
                    //byte 체크
                }
                break;
        }
    }
}
//----------
function processKeyup(param) {

    if (param.element == undefined) {
    } else {
        switch (param.object) {
            case "frmData_자기소개":
                var val = gw_com_api.getCellValue(param.type, param.object, param.row, param.element);
                var len = val.length;
                if (len > v_global.logic.max1) {
                    var msg = "허용된 글자수(" + v_global.logic.max1 + "자)가 초과되었습니다.\r\n초과된 부분은 자동으로 삭제됩니다.";
                    gw_com_api.showMessage(msg);
                    val = val.substring(0, v_global.logic.max1);
                    gw_com_api.setCellValue(param.type, param.object, param.row, param.element, val);
                }
                break;
        }
    }
}
//----------
function processItemchanged(param) {

    if (param.object == undefined) return;

    gw_com_api.show("lyrRmk1");
    gw_com_api.show("lyrRmk2");
    gw_com_api.show("lyrRmk3");
    gw_com_api.show("lyrRmk4");
    gw_com_api.show("lyrRmk5");
    gw_com_api.show("lyrRmk6");

    switch (param.object) {
        case "frmData_인적":
            switch(param.element){
                case "reg_no_1":
                case "reg_no_2":
                    {
                        if (param.element == "reg_no_1") {
                            //나이계산
                            var today = gw_com_api.getDate();
                            gw_com_api.setValue(param.object, 1, "age", uf_getAge(param.value.current + gw_com_api.getValue(param.object, 1, "reg_no_2")));
                        } else {
                            //성별
                            gw_com_api.setValue(param.object, 1, "sex", Number(param.value.current.substring(0, 1)) % 2);
                            gw_com_api.setValue(param.object, 1, "age", uf_getAge(gw_com_api.getValue(param.object, 1, "reg_no_1") + param.value.current));
                        }
                        gw_com_api.setValue(param.object, 1, "reg_no", gw_com_api.getValue(param.object, 1, "reg_no_1") + gw_com_api.getValue(param.object, 1, "reg_no_2"));
                    }
                    break;
            }
        case "frmData_지원정보":
        case "frmData_병역":
        case "frmData_건강":
        case "frmData_가족":
        case "frmData_자기소개":
        case "frmData_추천":
            {
                gw_com_api.setValue("frmData_인적", 1, param.element, param.value.current);
                if (gw_com_api.getCRUD("frmData_인적") == "retrieve")
                    gw_com_api.setCRUD("frmData_인적", 1, "modify");

                //// 자기소개 글자수 체크
                //if (param.object == "frmData_자기소개" && param.element == "d1_inf26") {
                //    var args = { str: param.value.current, max: 80000, message: true };
                //    var val = uf_byteCut(args);
                //    if (param.value.current != val)
                //        gw_com_api.setValue(param.object, 1, param.element, val);
                //}
            }
            break;
        case "frmData_경력":
            {
                gw_com_api.setValue("grdData_경력", "selected", param.element, param.value.current, true);

                if (gw_com_api.getCRUD("grdData_경력", "selected", true) == "retrieve")
                    gw_com_api.setCRUD("grdData_경력", "selected", "modify", true);
            }
            break;
    }

}
//----------
function processInsert(param) {

    if (param.object == undefined) return;

    var isgrid = true;
    var args = {
        targetid: "grdData_" + param.object.split("_")[1], edit: true, updatable: true,
        data: [
            { name: "ann_key", value: v_global.logic.ann_key },
            { name: "ann_seq", value: v_global.logic.ann_seq },
            { name: "app_key", value: v_global.logic.app_key }
        ]
    };

    // default value..
    switch (param.object.split("_")[1]) {
        case "가족":
            args.data[args.data.length] = { name: "live_yn", value: "1" };
            break;
        case "경력":
            {
                var args = {
                    type: "PAGE", page: "HRM_8001", title: "경력 기술서",
                    width: 1000, height: 440, scroll: true, open: true, control: true, locate: ["center", "top"]
                };

                if (param.element == "추가") {
                    v_global.logic.edit = false;
                } else {
                    v_global.logic.edit = true;
                }

                if (gw_com_module.dialoguePrepare(args) == false) {
                    args.param = {
                        ID: gw_com_api.v_Stream.msg_openedDialogue,
                        data: {
                            ann_key: v_global.logic.ann_key,
                            ann_seq: v_global.logic.ann_seq,
                            app_key: v_global.logic.app_key,
                            rec_seq: (v_global.logic.edit ? gw_com_api.getValue("grdData_경력", "selected", "rec_seq", true) : 0)
                        }
                    };
                    gw_com_module.dialogueOpen(args);
                }
                return;

            }
            break;
    }

    gw_com_module.gridInsert(args);

}
//----------
function processDelete(param) {

    if (param.object == undefined) return;

    var args = { targetid: "grdData_" + param.object.split("_")[1], row: "selected", select: true };

    switch (param.object.split("_")[1]) {
        case "가족":
            break;
        case "경력":
            args.clear = [{ type: "FORM", id: "frmData_경력" }];
            break;
    }

    gw_com_module.gridDelete(args);

}
//----------
function processCheckUpdatable(param) {

    if (gw_com_api.getValue("frmData_인적", 1, "insert_yn") == "1") {
        gw_com_api.setCRUD("frmData_인적", 1, "create");
    }

    if (gw_com_api.getValue("frmData_학력", 1, "insert_yn") == "1") {
        gw_com_api.setCRUD("frmData_학력", 1, "create");
    }

    if (gw_com_api.getValue("frmData_경력2", 1, "insert_yn") == "1") {
        gw_com_api.setCRUD("frmData_경력2", 1, "create");
    }

    for (var i = 1; i <= gw_com_api.getRowCount("grdData_능력") ; i++) {
        if (gw_com_api.getValue("grdData_능력", i, "insert_yn", true) == "1") {
            gw_com_api.setCRUD("grdData_능력", i, "create", true);
        }
    }

    var updatable = false;
    if (param.target != undefined) {
        $.each(param.target, function () {
            if (!updatable) {
                var isgrid = this.type == "FORM" ? false : true;
                updatable = gw_com_api.getUpdatable(this.id, isgrid);
            }
        });
    }

    return updatable;

}
//----------
function processSubmit(param) {

    v_global.process.handler = processSave;
    gw_com_api.messageBox([
        { text: "제출이 완료되면 더이상 수정할 수 없습니다." },
        { text: "계속하시겠습니까?" }
    ], 420, gw_com_api.v_Message.msg_confirmBatch, "YESNO", param);

}
//----------
function processSave(param) {

    var args;
    if (param.object == "btnMove_4") {
        args = {
            target: [
			    { type: "FORM", id: "frmData_인적" },
                //{ type: "GRID", id: "grdData_가족" },
                { type: "GRID", id: "grdData_경력" },
                { type: "GRID", id: "grdData_외국어" },
                //{ type: "GRID", id: "grdData_수상" },
                { type: "GRID", id: "grdData_사회" },
                //{ type: "GRID", id: "grdData_해외" },
                { type: "GRID", id: "grdData_자격" }//,
                //{ type: "GRID", id: "grdData_능력" }
            ]
        };

        if (param.element == "submit") {
            //제출
            gw_com_api.setValue("frmData_인적", 1, "rec_status", "1");    //0:작성,1:제출,2:접수,8:불합격,9:합격
            if (!gw_com_api.getUpdatable("frmData_인적"))
                gw_com_api.setCRUD("frmData_인적", 1, "modify");

            args.nomessage = true;
        } else if (param.element == "save") {
            //저장
        }

    } else {
        args = param;
        args.nomessage = true;
    }

    if (gw_com_module.objValidate(args) == false) return false;

    //args.url = "COM";
    args.handler = { success: successSave };
    args.handler.param = param;

    gw_com_module.objSave(args);

}
//----------
function processClear(param) {

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

    gw_com_api.hide("lyrRmk1");
    gw_com_api.hide("lyrRmk2");
    gw_com_api.hide("lyrRmk3");
    gw_com_api.hide("lyrRmk4");
    //gw_com_api.hide("lyrRmk5");
    //gw_com_api.hide("lyrRmk6");

    if (param.element == "submit") {
        v_global.process.handler = processClose;
        
        //메일발송
        var data = { pEmail: gw_com_api.getValue("frmData_인적", 1, "email"), pTitle: gw_com_api.getValue("frmData_인적", 1, "ann_title") };
        var param = {
            request: "SERVICE",
            url: gw_com_module.v_Current.window + ".aspx/sendToUserEmail", //../Service/svc_SendMail.aspx/sendToUserEmail",
            params: JSON.stringify(data),
            handler_success: successRequest,
            handler_invalid: invalidRequest,
            handler_error: errorRequest,
            handler_complete: completeRequest
        };
        gw_com_module.callRequest(param);

        gw_com_api.messageBox([
            { text: "지원해 주셔서 감사합니다." }
        ], 350);
    } else {
        processRetrieve();
    }

}
//----------
function successUpload(response) {
    gw_com_api.setValue("frmData_인적", 1, "d1_inf30", response.id + (response.ext == "" ? "" : "." + response.ext));
    if (gw_com_api.getCRUD("frmData_인적") == "retrieve")
        gw_com_api.setCRUD("frmData_인적", 1, "modify");
    uf_setImage();
}
//----------
function uf_getAge(ssn) {
    var today = gw_com_api.getDate();
    var birthYear = (ssn.substr(6, 1) == "1" || ssn.substr(6, 1) == "2" ? "19" : "20") + ssn.substr(0, 2);
    var age = Number(gw_com_api.getYear()) - birthYear;
    if (today.substr(4, 4) >= ssn.substr(2, 4))
        age++;

    return age;
}
//----------
function uf_setImage(param) {

    var url = location.host;
    var img = gw_com_api.getValue("frmData_인적", 1, "d1_inf30");
    //url = "<img src='http://" + url + "/Files/Recruit/" + (img == "" ? "noimage.jpg" : img) + "' />";
    //gw_com_api.setValue("frmData_사진", 1, "img_url", url);

    url = "http://" + location.host + "/Files/Recruit/" + (img == "" ? "noimage.jpg" : img);
    document.getElementById("img_사진").src = url;
}
//----------
function uf_byteCut(param) {

    var byte = 0;
    var str = "";
    $.each(param.str, function (i) {
        if (byte + (escape(this).length > 4 ? 2 : 1) > param.max) {
            if (param.message != undefined && param.message) {
                alert("허용된 글자수(" + param.max + " byte)가 초과되었습니다.\r\n초과된 부분은 자동으로 삭제됩니다.");
            }
            return false;
        } else {
            str += this;
            byte += (escape(this).length > 4 ? 2 : 1);
        }
    });

    return str;

}
//----------
function getByteLength(s, b, i, c) {
    for (b = i = 0; c = s.charCodeAt(i++) ; b += c >> 11 ? 3 : c >> 7 ? 2 : 1);
    return b;
}
//----------
function successRequest(param) {
}
//----------
function invalidRequest(param) {
}
//----------
function errorRequest(param) {
}
//----------
function completeRequest(param) {
}
//----------
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
                    case gw_com_api.v_Message.msg_alert:
                        {
                            if (v_global.process.handler != null)
                                v_global.process.handler({});
                        }
                        break;
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
                    case gw_com_api.v_Message.msg_confirmBatch:
                        {
                            if (param.data.result == "YES")
                                if (v_global.process.handler != null)
                                    v_global.process.handler( param.data.arg );
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
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = { to: { type: "POPUP", page: param.from.page } };

                switch (param.from.page)
                {
                    case "HRM_8001":
                        {
                            args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                            args.data = {
                                ann_key: v_global.logic.ann_key,
                                ann_seq: v_global.logic.ann_seq,
                                app_key: v_global.logic.app_key,
                                rec_seq: v_global.logic.edit ? gw_com_api.getValue("grdData_경력", "selected", "rec_seq", true) : 0
                            };
                        }
                        break;
                    case "HRM_8009":
                        args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                        args.data = {
                            ann_key: v_global.logic.ann_key,
                            ann_seq: v_global.logic.ann_seq
                        };
                        break;
                }
                gw_com_module.streamInterface(args);
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                switch (param.from.page) {
                    case "HRM_8001":
                        if (param.data != undefined) {
                            if (param.data.save) {
                                var args = {
                                    source: {
                                        type: "INLINE",
                                        argument: [
                                            { name: "arg_ann_key", value: v_global.logic.ann_key },
                                            { name: "arg_ann_seq", value: v_global.logic.ann_seq },
                                            { name: "arg_app_key", value: v_global.logic.app_key },
                                            { name: "arg_rec_seq", value: 0 }
                                        ]
                                    },
                                    target: [
                                        { type: "GRID", id: "grdData_경력", select: true }
                                    ],
                                    handler_complete: processRetrieveEnd
                                };
                                gw_com_module.objRetrieve(args);
                            }
                        }
                        break;
                    case "HRM_8009":
                        if (param.data == undefined) {
                            processClose({});
                            return;
                        }
                        v_global.logic.ann_seq = param.data.ann_seq;
                        v_global.logic.app_key = param.data.app_key;
                        processRetrieve({});
                        break;
                }
                closeDialogue({ page: param.from.page });
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//