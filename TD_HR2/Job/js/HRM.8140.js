//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 서류전형관리
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

        // initialize page.
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        // set data for DDDW List
        var args = {
            request: [
                {
                    type: "INLINE", name: "경력",
                    data: [
                        { title: "전체", value: "%" },
                        { title: "신입", value: "1" },
                        { title: "경력", value: "2" }
                    ]
                },
                {
                    type: "INLINE", name: "상태",
                    data: [
                        { title: "전체", value: "%" },
                        { title: "제출", value: "1" },
                        { title: "접수", value: "2" },
                        { title: "서류합격", value: "81" },
                        { title: "서류불합격", value: "91" }
                    ]
                },
                {
                    type: "INLINE", name: "성별",
                    data: [{ title: "남", value: "1" }, { title: "여", value: "0" }]
                },
                {
                    type: "PAGE", name: "모집부문", query: "DDDW_CM_CODE",
                    param: [{ argument: "arg_hcode", value: "HRM095" }]
                },
                {
                    type: "PAGE", name: "진행상태", query: "DDDW_CM_CODE",
                    param: [{ argument: "arg_hcode", value: "HRM096" }]
                },
                {
                    type: "PAGE", name: "공고내역", query: "DDDW_ANNOUNCE",
                    param: [{ argument: "arg_status", value: "%" }]
                }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);

        //----------
        function start() {
            gw_job_process.UI();
            gw_job_process.procedure();
            gw_com_module.startPage();
        }
    },

    // manage UI. (design section)
    UI: function () {

        //==== Main Menu : 조회, 닫기
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "조회", value: "조회", act: true },
				{ name: "합격", value: "합격", icon: "예" },
				{ name: "불합격", value: "불합격", icon: "아니오" },
                { name: "출력", value: "출력" },
                { name: "작성중", value: "작성중", icon: "기타" },
                { name: "제출", value: "제출", icon: "기타" },
                { name: "URL", value: "URL", icon: "기타" },
				{ name: "닫기", value: "닫기" }
            ]
        };
        gw_com_module.buttonMenu(args);

        //==== Search Option : 
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true, remark: "lyrRemark",
            editable: { focus: "ann_key", validate: true },
            content: {
                row: [
                        {
                            element: [
                                {
                                    name: "ann_key", label: { title: "공고제목 :" },
                                    editable: { type: "select", data: { memory: "공고내역" } }
                                }
                            ]
                        },
                        {
                            element: [
                                {
                                    name: "ann_cat02", label: { title: "모집부문 :" },
                                    editable: { type: "select", data: { memory: "모집부문", unshift: [{title: "전체", value: "%"}] } }
                                },
                                {
                                    name: "ann_seq", label: { title: "경력구분 :" },
                                    editable: { type: "select", data: { memory: "경력" } }
                                }
                            ]
                        },
                        {
                            element: [
                                {
                                    name: "rec_status", label: { title: "상태 :" },
                                    editable: { type: "select", data: { memory: "상태" } }
                                },
                                {
                                    name: "app_nm", label: { title: "이름 : " },
                                    editable: { type: "text", size: 10, maxlength: 5 }
                                }
                            ]
                        },
                        {
                            element: [
                              { name: "실행", value: "실행", act: true, format: { type: "button" } },
                              { name: "취소", value: "취소", format: { type: "button", icon: "닫기" } }
                            ], align: "right"
                        }
                ]
            }
        };
        gw_com_module.formCreate(args);

        //==== Main Grid : 응시자목록
        var args = {
            targetid: "grdData_Main", query: "HRM_8140_M", title: "응시자 목록",
            height: 440, show: true, selectable: true, number: true, multi: true, checkrow: true,
            editable: { multi: true, bind: "select", focus: "rec_status" },
            element: [
				{ header: "이름", name: "app_nm_kr", width: 50, align: "center" },
				{ header: "주민번호", name: "reg_no", width: 100, align: "center", hidden: true },
				{ header: "생년월일", name: "birth_date", width: 70, align: "center", mask: "date-ymd" },
				{ header: "나이", name: "age", width: 30, align: "center" },
				{ header: "성별", name: "sex", format: { type: "select", data: { memory: "성별" } }, width: 30, align: "center" },
                { header: "학교", name: "d2_inf01", width: 100, align: "left" },
                { header: "입학일", name: "d2_inf02", width: 70, align: "center", mask: "date-ymd" },
                { header: "졸업일", name: "d2_inf03", width: 70, align: "center", mask: "date-ymd" },
				{ header: "전화번호", name: "tel_no", width: 80 },
				{ header: "휴대폰", name: "mobile_no", width: 80 },
                { header: "모집부문", name: "ann_cat02", format: { type: "select", data: { memory: "모집부문" } }, width: 60 },
                { header: "구분", name: "ann_cat01", width: 30, align: "center" },
                { header: "상태", name: "rec_status", format: { type: "select", data: { memory: "진행상태" } }, width: 60, align: "center" },
                { header: "제출일자", name: "rec_dt", width: 150, align: "center", mask: "date-ymd" },
                { header: "통지일시", name: "mail_dt", width: 150, mask: "date-ymd", align: "center" },
				{ header: "이메일", name: "email", width: 150 },
				{ header: "주소", name: "addr", width: 280 },
                { name: "ann_key", editable: { type: "hidden" }, hidden: true },
                { name: "ann_seq", editable: { type: "hidden" }, hidden: true },
                { name: "app_key", editable: { type: "hidden" }, hidden: true }
            ]
        };
        gw_com_module.gridCreate(args);

        //==== File Download Layer
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);

        //==== Resize Objects
        var args = {
            target: [
				{ type: "GRID", id: "grdData_Main", offset: 8 }
            ]
        };
        gw_com_module.objResize(args);
        gw_com_module.informSize();

    },

    //==== manage process. (program section)
    procedure: function () {

        //==== Button Click : Main 조회, 추가, 수정, 출력(납품서), 라벨(라벨출력), 닫기 ====
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: viewOption };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "합격", event: "click", handler: processSave };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "불합격", event: "click", handler: processSave };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "출력", event: "click", handler: processExport };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "작성중", event: "click", handler: processSave };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "제출", event: "click", handler: processSave };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "URL", event: "click", handler: processGetURL };
        gw_com_module.eventBind(args);

        //==== Button Click : Search Option ====
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: viewOption };
        gw_com_module.eventBind(args);

        //==== Grid Events : Main
        var args = { targetid: "grdData_Main", grid: true, event: "rowdblclick", handler: processPopupDetail };
        gw_com_module.eventBind(args);
        //----------
    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function viewOption() {
    var args = { target: [{ id: "frmOption", focus: true }] };
    gw_com_module.objToggle(args);
}
//----------
function processRetrieve(param) {

    // Validate Inupt Options
    var args = { target: [{ type: "FORM", id: "frmOption" }] };
    if (gw_com_module.objValidate(args) == false) return false;

    // Retrieve 
    var args = {
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
				{ name: "ann_key", argument: "arg_ann_key" },
                { name: "ann_seq", argument: "arg_ann_seq" },
                { name: "ann_cat02", argument: "arg_ann_cat02" },
                { name: "rec_status", argument: "arg_rec_status" },
                { name: "app_nm", argument: "arg_app_nm" }
            ],
            remark: [
		        { element: [{ name: "ann_key" }] },
		        { element: [{ name: "ann_seq" }] },
		        { element: [{ name: "ann_cat02" }] },
                { element: [{ name: "rec_status" }] },
                { element: [{ name: "app_nm" }] }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_Main" }
        ],
        handler_complete: processRetrieveEnd
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {
}
//----------
function processSave(param) {

    var ids = gw_com_api.getSelectedRow("grdData_Main", true);
    if (ids.length < 1) {
        gw_com_api.messageBox([{ text: "선택된 대상이 없습니다." }]);
        return;
    }

    var row = [];
    var nomessage = true;
    if (param.element == "합격" || param.element == "불합격") {
        var email = [];
        $.each(ids, function () {
            row.push(
                {
                    crud: "U",
                    column: [
                        { name: "ann_key", value: gw_com_api.getValue("grdData_Main", this, "ann_key", true) },
                        { name: "ann_seq", value: gw_com_api.getValue("grdData_Main", this, "ann_seq", true) },
                        { name: "app_key", value: gw_com_api.getValue("grdData_Main", this, "app_key", true) },
                        { name: "rec_status", value: (param.element == "합격" ? "81" : "91") }
                    ]
                }
            );

            email.push({
                name: gw_com_api.getValue("grdData_Main", this, "app_nm_kr", true),
                value: gw_com_api.getValue("grdData_Main", this, "email", true),
                key: [
                    { name: "data_tp", value: "HRM_REC01" },
                    { name: "data_key", value: gw_com_api.getValue("grdData_Main", this, "ann_key", true) },
                    { name: "data_seq", value: gw_com_api.getValue("grdData_Main", this, "ann_seq", true) },
                    { name: "data_subseq", value: gw_com_api.getValue("grdData_Main", this, "app_key", true) }
                ]
            });
        });

        param.email = email;    // 합격 메일 발송용 메일 주소

    } else if (param.element == "작성중" || param.element == "제출") {
        gw_com_api.messageBox(
            [{ text: "<b>[" + param.element + "]</b> 상태로 변경하시겠습니까?" }],
            300, gw_com_api.v_Message.msg_confirmSave, "YESNO", param);

    } else if (param.element == "작성중_OK" || param.element == "제출_OK") {
        nomessage = false;
        $.each(ids, function () {
            var rec_status = gw_com_api.getValue("grdData_Main", this, "rec_status", true);
            // 작성중, 제출, 접수 상태일 경우에만 상태 변경 가능 => 서류합격, 서류불합격 추가 20131114 by K.W.Y
//            if (rec_status == "" || rec_status == "0" || rec_status == "1" || rec_status == "2") {
                row.push(
                    {
                        crud: "U",
                        column: [
                            { name: "ann_key", value: gw_com_api.getValue("grdData_Main", this, "ann_key", true) },
                            { name: "ann_seq", value: gw_com_api.getValue("grdData_Main", this, "ann_seq", true) },
                            { name: "app_key", value: gw_com_api.getValue("grdData_Main", this, "app_key", true) },
                            { name: "rec_status", value: (param.element == "작성중_OK" ? "0" : "1") }
                        ]
                    }
                );
//            }
        });
        if (row.length == 0) {
            gw_com_api.messageBox([
                { text: "상태를 변경할 수 없습니다." },
                { text: "<b>[작성중, 제출, 접수]</b> 상태의 자료만 상태를 변경할 수 있습니다." }
            ], 460);
            return false;
        }
    }

    if (row.length > 0) {
        var args = {
            url: "COM",
            user: gw_com_module.v_Session.USR_ID,
            param: [{ query: "HRM_8130_M", row: row }],
            nomessage: nomessage,
            handler: {
                success: successSave,
                param: param
            }
        };
        gw_com_module.objSave(args);
    };

}
//----------
function successSave(response, param) {

    processRetrieve();
    if (param.email != undefined) {
        gw_com_api.messageBox([
                { text: "통보 메일을 보내시겠습니까?" }
        ], 300, gw_com_api.v_Message.msg_confirmBatch, "YESNO", param);
    }

}
//----------
function processClose(param) {
    var args = { ID: gw_com_api.v_Stream.msg_closePage };
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
function processPopupDetail(param) {

    var ann_key = gw_com_api.getValue(param.object, param.row, "ann_key", true);
    var url = "../Job/" + (ann_key < "ANN2015-0005" ? "HRM_8121" : "HRM_8121_1") + ".aspx";
    var args = "ann_key=" + ann_key +
        "&ann_seq=" + gw_com_api.getValue(param.object, param.row, "ann_seq", true) +
        "&app_key=" + gw_com_api.getValue(param.object, param.row, "app_key", true);

    window.open(url + "?" + args, "응시정보", "scrollbars=no,resizable=yes,menubar=no,toolbar=no,width=1200,height=630");

}
//----------
function processSendMail(param) {

    //var subject = "[AP시스템] 서류전형 결과통보";
    //var body = "";
    //var ann_title = gw_com_api.getText("frmOption", 1, "ann_key");
    //if (param.element == "합격") {
    //    body = "<table width='540px' cellpadding='0' cellspacing='0'>"
    //         + "    <tr>"
    //         + "        <td colspan='2'>"
    //         + "            <p>AP시스템 <b>" + ann_title + "</b> 서류 전형에 <b>합격</b>하셨음을 축하드립니다.</p>"
    //         + "            <p>다음과 같이 <b>1차 면접 전형 일시 및 장소</b>를 알려드리오니, 참석바랍니다.</p>"
    //         + "            </br>"
    //         + "            <p><center>- 다&nbsp;&nbsp;&nbsp;&nbsp;음 -</center></p><br>"
    //         + "            <p>1. 일자 : " + gw_com_api.getYear() + "년 " + gw_com_api.getMonth() + "월 " + gw_com_api.getDay() + "일 (" + getWeekName(gw_com_api.getDate("-")) + ") - 시간은 휴대폰으로 개별 통지</p>"
    //         + "            <p>2. 장소 : AP시스템 본사 (입구 보안실 안내)</p>"
    //         + "            <p>3. 복장 및 준비물</p>"
    //         + "            <p>&nbsp;&nbsp;&nbsp;① 복장 : 정장</p>"
    //         + "            <p>&nbsp;&nbsp;&nbsp;② 준비물 : 휴대폰으로 개별 통지</p>"
    //         + "            <p>4. 기타사항 : 문의사항은 인사팀 <b><a href='mailto:mjkim@apsystems.co.kr'>김민정 대리</a> (<a href='tel:0313792957'>031-379-2957</a>)</b>에게</p>"
    //         + "            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;연락하시기 바랍니다.</p>"
    //         + "        </td>"
    //         + "    </tr>"
    //         + "    <tr><td colspan='2'>&nbsp;</td></tr>"
    //         + "    <tr>"
    //         + "        <td>"
    //         + "            <img src='http://recruit.apsystems.co.kr/recruit/images/logo_1.jpg\' width='118px' height='40px'>"
    //         + "       </td>"
    //         + "        <td align='right'>"
    //         + "            <p>- AP시스템 인사팀 -</p>"
    //         + "        </td>"
    //         + "    </tr>"
    //         + "</table>";
    //} else {
    //    body = "<table cellpadding=\"0\" cellspacing=\"0\">"
    //         + "    <tr>"
    //         + "        <td colspan=\"2\">"
    //         + "            <p>AP시스템에 관심을 주셔서 감사드립니다.</p>"
    //         + "            <p>귀하께서는 우수한 능력과 역량을 보유하고 있으나,</p>"
    //         + "            <p>당사의 금번 채용 모집에는 안타깝게도 불합격 하셨습니다.</p>"
    //         + "            <p>AP시스템에 지원해 주셔서 다시 한번 감사드립니다.</p>"
    //         + "        </td>"
    //         + "    </tr>"
    //         + "    <tr><td colspan=\"2\">&nbsp;</td></tr>"
    //         + "    <tr>"
    //         + "        <td>"
    //         + "            <img src=\"http://recruit.apsystems.co.kr/recruit/images/logo_1.jpg\" width=\"118px\" height=\"40px\">"
    //         + "       </td>"
    //         + "        <td align=\"right\">"
    //         + "            <p>- AP시스템 인사팀 -</p>"
    //         + "        </td>"
    //         + "    </tr>"
    //         + "</table>";
    //}

    //var args = {
    //    url: "COM",
    //    to: param.email,
    //    subject: subject,
    //    body: body,
    //    html: true,
    //    edit: true,
    //    section: "smtp_2",
    //};

    var args = {
        url: "COM",
        to: param.email,
        temp_id: (param.element == "합격" ? "HRM_REC01" : "HRM_REC02"),
        edit: true,
        section: "smtp_2",
    };

    gw_com_module.sendMail(args);

}
//----------
function processExport(param) {

    var reg = /[\\\/\:\*\?\<\>\|\"]/g;
    var ids = gw_com_api.getSelectedRow("grdData_Main", true);
    if (ids.length < 1) {
        gw_com_api.messageBox([{ text: "선택된 대상이 없습니다." }]);
        return;
    }

    var ann_key = gw_com_api.getValue("frmOption", 1, "ann_key");
    var app_key = "";
    $.each(ids, function () {
        if (app_key.length > 0)
            app_key += ",";

        app_key += gw_com_api.getCellValue("GRID", "grdData_Main", this, "app_key");
    });

    var args = {
        //source: {
        //    type: "INLINE", json: true,
        //    argument: [
        //        { name: "arg_ann_key", value: ann_key },
        //        { name: "arg_app_key", value: app_key } //app_key.replace(/,/gi, "','") }
        //    ]
        //},
        page: "HRM_8120",
        option: [
            { name: "PRINT", value: "pdf" },
            { name: "PAGE", value: "HRM_8120" },
            { name: "USER", value: gw_com_module.v_Session.USR_ID },
            { name: "ANNKEY", value: ann_key },
            { name: "APPKEY", value: app_key },
            { name: "ANNTITLE", value: gw_com_api.getText("frmOption", 1, "ann_key").replace(reg, "") }, //$("#frmOption_ann_key option:selected").text() },
            { name: "ANNCAT01", value: gw_com_api.getText("frmOption", 1, "ann_seq").replace(reg, "") },
            { name: "ANNCAT02", value: gw_com_api.getText("frmOption", 1, "ann_cat02").replace(reg, "") }
        ],
        target: { type: "FILE", id: "lyrDown", name: "입사지원서" }
    };
    gw_com_module.objExport(args);

}
//----------
function processGetURL(param) {

    var ann_key = gw_com_api.getValue("frmOption", 1, "ann_key");
    var ann_title = gw_com_api.getText("frmOption", 1, "ann_key");
    if (ann_key == "") {
        return;
    }

    var url = location.protocol + "//" + location.host + "/Master/BizContainer_REC.aspx?param=";
    var enc = EncryptURL.Encrypt("ann_key=" + ann_key);
    gw_com_api.messageBox([{ text: "<b>" + ann_title + "</b>" }, { text: url, align: "left" }, { text: enc, align: "left" }], 490);

}
//----------
function getWeekName(date) {
    var d = new Date(date.split("-")[0], date.split("-")[1], date.split("-")[2]);
    var week = new Array('일', '월', '화', '수', '목', '금', '토');
    return week[d.getDay()];
}
//----------
var EncryptURL = {
    Encrypt: function (str) {

        var rtn = "";
        var data = { _str: str };
        var param = {
            request: "SERVICE",
            url: gw_com_module.v_Current.window + ".aspx/Encrypt",
            params: JSON.stringify(data),
            handler_success: successRequest,
            handler_invalid: invalidRequest,
            handler_error: errorRequest,
            handler_complete: completeRequest
        };
        //=================== async : false ========================
        $.ajaxSetup({ async: false });
        gw_com_module.callRequest(param);

        function successRequest(param) {
            //var url = location.protocol + "//" + location.host + "/Master/BizContainer.aspx?param=";
            //gw_com_api.messageBox([{ text: url, align: "left" }, { text: param, align: "left" }], 500);
            rtn = param;
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
        $.ajaxSetup({ async: true });
        //=================== async : true ========================

        return rtn;
    }
};
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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
                    case gw_com_api.v_Message.msg_informSaved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                    case gw_com_api.v_Message.msg_confirmBatch:
                        {
                            if (param.data.result == "YES")
                                processSendMail(param.data.arg);
                            else
                                gw_com_api.messageBox([
                                { text: "저장되었습니다." }
                                ], 300, gw_com_api.v_Message.msg_informSaved, "ALERT");
                        }
                        break;
                    case gw_com_api.v_Message.msg_confirmSave:
                        {
                            if (param.data.result == "YES")
                                processSave({ element: param.data.arg.element + "_OK" });
                        }
                        break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = { to: { type: "POPUP", page: param.from.page } };

                switch (param.from.page) {
                    case "HRM_8121":
                    case "HRM_8121_1":
                        {
                            args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                            args.data = {
                                ann_key: v_global.logic.ann_key,
                                ann_seq: v_global.logic.ann_seq,
                                app_key: v_global.logic.app_key
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