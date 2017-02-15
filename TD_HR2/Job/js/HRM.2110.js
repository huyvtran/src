//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 연말정산기준입력
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

        //
        v_global.logic.sys = (gw_com_module.v_Session.USER_TP == "SYS" || gw_com_module.v_Session.USR_ID == "U00381" ? true : false);

        // set data for DDDW List
        var args = {
            request: [
				{
				    type: "PAGE", name: "관계", query: "DDDW_HRM_COMMON",
				    param: [{ argument: "arg_hcode", value: "A101" }]
				},
				{
				    type: "PAGE", name: "기부", query: "DDDW_HRM_COMMON",
				    param: [{ argument: "arg_hcode", value: "C430" }]
				},
				{
				    type: "PAGE", name: "의료", query: "DDDW_HRM_COMMON",
				    param: [{ argument: "arg_hcode", value: "C450" }]
				},
				{
				    type: "PAGE", name: "소득공제", query: "DDDW_HRM_COMMON",
				    param: [{ argument: "arg_hcode", value: "C460" }]
				},
				{
				    type: "PAGE", name: "금융기관", query: "DDDW_HRM_COMMON",
				    param: [{ argument: "arg_hcode", value: "C461" }]
				},
				{
				    type: "PAGE", name: "주택유형", query: "DDDW_HRM_COMMON",
				    param: [{ argument: "arg_hcode", value: "C021" }]
				}
            ],
            starter: start
        };
        gw_com_module.selectSet(args);

        //----------
        function start() {
            gw_job_process.UI();
            gw_job_process.procedure();

            gw_com_api.setValue("frmOption", 1, "taxadj_year", gw_com_api.getYear() - 1);
            gw_com_api.setValue("frmOption", 1, "emp_no", gw_com_module.v_Session.EMP_NO);
            gw_com_api.setValue("frmOption", 1, "emp_nm", gw_com_module.v_Session.USR_NM);

            gw_com_module.startPage();

            processRetrieve({});
        }
    },

    // manage UI. (design section)
    UI: function () {

        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
                { name: "명세서", value: "연말정산명세서", icon: "기타"},
                { name: "설명", value: "항목 설명 보기", icon: "기타" },
                { name: "초기화", value: "초기화", icon: "삭제" },
                //{ name: "파일", value: "전자파일추가", icon: "기타" },
				{ name: "조회", value: "조회", act: true },
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" },
                { name: "저장", value: "저장" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true, remark: "lyrRemark2",
            editable: { focus: "pay_year", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "taxadj_year", label: { title: "귀속연도 :" },
                                editable: { type: "text", size: 5, maxlength: 4, validate: { rule: "required" } }
                            },
                            {
                                name: "emp_nm", label: { title: "사원 :" }, mask: "search",
                                editable: { type: "text", size: 10, validate: { rule: "required" } }, hidden: !v_global.logic.sys
                            },
                            { name: "emp_no", label: { title: "사원번호 :" }, editable: { type: "text" }, hidden: true }
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
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_TAXADJ_FAMILY", query: "HRM_2030_1", title: "인적공제",
            caption: false, height: 120, pager: false, show: true, selectable: true, number: true,
            editable: { bind: "edit_yn", focus: "family_rel", validate: true },
            element: [
				{
				    header: "관계", name: "family_rel", width: 120,
				    format: { type: "select", data: { memory: "관계" } },
				    editable: { type: "select", data: { memory: "관계" }, validate: { rule: "required" }, width: 176 }
				},
				{
				    header: "성명", name: "family_nm", width: 50, align: "center",
				    editable: { type: "text", maxlength: 5, validate: { rule: "required" }, width: 74 }
				},
				{
				    header: "주민번호", name: "family_id", width: 80, align: "center", mask: "person-id",
				    editable: { type: "text", maxlength: 14, validate: { rule: "required" }, width: 112 }
				},
				{
				    header: "외국인", name: "national_yn", width: 50, align: "center",
				    format: { type: "checkbox", value: "9", offval: "1" },
				    editable: { type: "checkbox", value: "9", offval: "1" }
				},
				{
				    header: "기본공제", name: "basic_yn", width: 50, align: "center",
				    format: { type: "checkbox", value: "1", offval: "0" },
				    editable: { type: "checkbox", value: "1", offval: "0" }
				},
				{
				    header: "6세이하", name: "baby_yn", width: 50, align: "center",
				    format: { type: "checkbox", value: "1", offval: "0" },
				    editable: { type: "checkbox", value: "1", offval: "0" }
				},
				{
				    header: "출생,입양", name: "birth_yn", width: 50, align: "center",
				    format: { type: "checkbox", value: "1", offval: "0" },
				    editable: { type: "checkbox", value: "1", offval: "0" }
				},
				{
				    header: "부녀자", name: "woman_yn", width: 50, align: "center",
				    format: { type: "checkbox", value: "1", offval: "0" },
				    editable: { type: "checkbox", value: "1", offval: "0" }
				},
				{
				    header: "한부모", name: "adopt_yn", width: 50, align: "center",
				    format: { type: "checkbox", value: "1", offval: "0" },
				    editable: { type: "checkbox", value: "1", offval: "0" }
				},
				{
				    header: "경로우대", name: "old_yn", width: 50, align: "center",
				    format: { type: "checkbox", value: "1", offval: "0" },
				    editable: { type: "checkbox", value: "1", offval: "0" }
				},
				{
				    header: "장애인", name: "handi_yn", width: 50, align: "center",
				    format: { type: "checkbox", value: "1", offval: "0" },
				    editable: { type: "checkbox", value: "1", offval: "0" }
				},
                {
                    header: "비고", name: "rmk", width: 150,
                    editable: { type: "text", maxlength: 25, width: 198 }, hidden: true
                },
                { header: "상세입력", name: "link", width: 50, align: "center", format: { type: "link", value: "상세입력" } },
                { name: "emp_no", editable: { type: "hidden" }, hidden: true },
                { name: "taxadj_year", editable: { type: "hidden" }, hidden: true },
                { name: "family_seq", editable: { type: "hidden" }, hidden: true },
                { name: "child_yn", editable: { type: "hidden" }, hidden: true },       //교육비구분:0(본인), 1(취학전), 2(초등학생),3(중학생), 4(고등학생), 5(대학생)
                { name: "deduct11_amt", editable: { type: "text" }, hidden: true },     //국세청_보험료
                { name: "deduct21_amt", editable: { type: "text" }, hidden: true },     //국세청_의료비
                { name: "deduct31_amt", editable: { type: "text" }, hidden: true },     //국세청_신용카드등
                { name: "deduct41_amt", editable: { type: "text" }, hidden: true },     //국세청_현금영수증
                { name: "deduct51_amt", editable: { type: "text" }, hidden: true },     //국세청_기부금
                { name: "deduct61_amt", editable: { type: "text" }, hidden: true },     //국세청_교육비
                { name: "deduct71_amt", editable: { type: "text" }, hidden: true },     //국세청_직불카드
                { name: "deduct81_amt", editable: { type: "text" }, hidden: true },     //국세청_전통시장
                { name: "deduct91_amt", editable: { type: "text" }, hidden: true },     //국세청_학원지로분
                { name: "deducta1_amt", editable: { type: "text" }, hidden: true },     //국세청_특수교육비
                { name: "deductb1_amt", editable: { type: "text" }, hidden: true },     //국세청_건강고용보험
                { name: "deductc1_amt", editable: { type: "text" }, hidden: true },     //국세청_보장성보험(장애인전용)
                { name: "deduct12_amt", editable: { type: "text" }, hidden: true },     //기타_보험료
                { name: "deduct22_amt", editable: { type: "text" }, hidden: true },     //기타_의료비
                { name: "deduct32_amt", editable: { type: "text" }, hidden: true },     //기타_신용카드등
                { name: "deduct42_amt", editable: { type: "text" }, hidden: true },     //기타_현금영수증
                { name: "deduct52_amt", editable: { type: "text" }, hidden: true },     //기타_기부금
                { name: "deduct62_amt", editable: { type: "text" }, hidden: true },     //기타_교육비
                { name: "deduct72_amt", editable: { type: "text" }, hidden: true },     //기타_직불카드
                { name: "deduct82_amt", editable: { type: "text" }, hidden: true },     //기타_전통시장
                { name: "deduct92_amt", editable: { type: "text" }, hidden: true },     //기타_학원지로분
                { name: "deducta2_amt", editable: { type: "text" }, hidden: true },     //기타_특수교육비
                { name: "deductb2_amt", editable: { type: "text" }, hidden: true },     //기타_건강고용보험
                { name: "deductc2_amt", editable: { type: "text" }, hidden: true },     //기타_보장성보험(장애인전용)
                { name: "edit_yn", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_TAXADJ_OFC", query: "HRM_2030_2", title: "종전근무지",
            caption: false, height: 120, pager: false, show: true, selectable: true, number: true,
            editable: { bind: "edit_yn", focus: "ofc_nm", validate: true },
            element: [
				{
				    header: "종(전)근무처명", name: "ofc_nm", width: 120,
				    editable: { type: "text", maxlength: 25, width: 150, validate: { rule: "required" } }
				},
				{
				    header: "사업자번호", name: "reg_num", width: 80, align: "center", mask: "biz-no",
				    editable: { type: "text", width: 100, validate: { rule: "required" } }
				},
				{
				    header: "근무기간(From)", name: "works_date", width: 80, align: "center", mask: "date-ymd",
				    editable: { type: "text", maxlength: 10, width: 100, validate: { rule: "dateISO" } }
				},
				{
				    header: "근무기간(To)", name: "worke_date", width: 80, align: "center", mask: "date-ymd",
				    editable: { type: "text", maxlength: 10, width: 100, validate: { rule: "dateISO" } }
				},
                {
                    header: "급여총액", name: "amt1", width: 50, align: "right", mask: "numeric-int",
                    editable: { type: "text", maxlength: 10, width: 66 }
                },
                {
                    header: "상여총액", name: "amt2", width: 50, align: "right", mask: "numeric-int",
                    editable: { type: "text", maxlength: 10, width: 66 }
                },
                {
                    header: "인정상여", name: "amt3", width: 50, align: "right", mask: "numeric-int",
                    editable: { type: "text", maxlength: 10, width: 66 }
                },
                {
                    header: "계", name: "amt6", width: 50, align: "right", mask: "numeric-int",
                    editable: { type: "hidden", maxlength: 10, width: 66 }
                },
                {
                    header: "비과세소득", name: "amt34", width: 50, align: "right", mask: "numeric-int",
                    editable: { type: "text", maxlength: 10, width: 66, readonly: true }
                },
                {
                    header: "소득세", name: "amt35", width: 50, align: "right", mask: "numeric-int",
                    editable: { type: "text", maxlength: 10, width: 66 }
                },
                {
                    header: "주민세", name: "amt36", width: 50, align: "right", mask: "numeric-int",
                    editable: { type: "text", maxlength: 10, width: 66 }
                },
                {
                    header: "농특세", name: "amt37", width: 50, align: "right", mask: "numeric-int",
                    editable: { type: "text", maxlength: 10, width: 66 }
                },
                {
                    header: "계", name: "amt38", width: 50, align: "right", mask: "numeric-int",
                    editable: { type: "hidden", width: 66 }
                },
                { header: "상세입력", name: "link", width: 50, align: "center", format: { type: "link", value: "상세입력" } },
                { name: "emp_no", editable: { type: "hidden" }, hidden: true },
                { name: "taxadj_year", editable: { type: "hidden" }, hidden: true },
                { name: "ofc_seq", editable: { type: "hidden" }, hidden: true },
                { name: "amt7", editable: { type: "text" }, hidden: true },
                { name: "amt8", editable: { type: "text" }, hidden: true },
                { name: "amt9", editable: { type: "text" }, hidden: true },
                { name: "amt10", editable: { type: "text" }, hidden: true },
                { name: "amt11", editable: { type: "text" }, hidden: true },
                { name: "amt12", editable: { type: "text" }, hidden: true },
                { name: "amt13", editable: { type: "text" }, hidden: true },
                { name: "amt14", editable: { type: "text" }, hidden: true },
                { name: "amt15", editable: { type: "text" }, hidden: true },
                { name: "amt16", editable: { type: "text" }, hidden: true },
                { name: "amt17", editable: { type: "text" }, hidden: true },
                { name: "amt18", editable: { type: "text" }, hidden: true },
                { name: "amt19", editable: { type: "text" }, hidden: true },
                { name: "amt20", editable: { type: "text" }, hidden: true },
                { name: "amt21", editable: { type: "text" }, hidden: true },
                { name: "amt22", editable: { type: "text" }, hidden: true },
                { name: "amt23", editable: { type: "text" }, hidden: true },
                { name: "amt24", editable: { type: "text" }, hidden: true },
                { name: "amt25", editable: { type: "text" }, hidden: true },
                { name: "amt26", editable: { type: "text" }, hidden: true },
                { name: "amt27", editable: { type: "text" }, hidden: true },
                { name: "amt28", editable: { type: "text" }, hidden: true },
                { name: "amt29", editable: { type: "text" }, hidden: true },
                { name: "amt30", editable: { type: "text" }, hidden: true },
                { name: "amt31", editable: { type: "text" }, hidden: true },
                { name: "amt32", editable: { type: "text" }, hidden: true },
                { name: "amt33", editable: { type: "text" }, hidden: true },
                { name: "edit_yn", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_TAXADJ_MEDI", query: "HRM_2030_3", title: "의료비",
            caption: false, height: 120, pager: false, show: true, selectable: true, number: true,
            editable: { bind: "edit_yn", focus: "gubun", validate: true },
            element: [
				{ header: "성명", name: "family_nm", width: 40, align: "center" },
				{
				    header: "주민번호", name: "family_id", width: 60, align: "center", mask: "person-id",
				    editable: { type: "hidden" }
				},
				{
				    header: "의료비구분", name: "gubun", width: 150,
				    format: { type: "select", data: { memory: "의료" } },
				    editable: { type: "select", data: { memory: "의료" }, validate: { rule: "required" }, width: 268 }
				},
				{
				    header: "지급처상호", name: "comp_nm", width: 170,
				    editable: { type: "text", maxlength: 20, width: 304 }
				},
				{
				    header: "사업자번호", name: "comp_regno", width: 60, align: "center", mask: "biz-no",
				    editable: { type: "text", width: 104 }
				},
				{
				    header: "지급건수", name: "cash_cnt", width: 40, align: "right", mask: "numeric-int",
				    editable: { type: "text", maxlength: 5, width: 72 }
				},
				{
				    header: "지급금액", name: "cash_amt", width: 80, align: "right", mask: "numeric-int",
				    editable: { type: "text", maxlength: 10, width: 128 }
				},
				{
				    header: "비고", name: "rmk", width: 150,
				    editable: { type: "text", maxlength: 50, width: 236 }, hidden: true
				},
                { name: "emp_no", editable: { type: "hidden" }, hidden: true },
                { name: "taxadj_year", editable: { type: "hidden" }, hidden: true },
                { name: "medi_seq", editable: { type: "hidden" }, hidden: true },
                { name: "edit_yn", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_TAXADJ_GIBU", query: "HRM_2030_4", title: "기부금",
            caption: false, height: 120, pager: false, show: true, selectable: true, number: true,
            editable: { bind: "edit_yn", focus: "gibu_tp", validate: true },
            element: [
                {
                    header: "기부연도", name: "gibu_year", width: 60, align: "center", mask: "date_ymd",
                    editable: { type: "text", width: 60 }
                },
				{ header: "성명", name: "family_nm", width: 70, align: "center" },
				{
				    header: "주민번호", name: "family_id", width: 100, align: "center", mask: "person-id",
				    editable: { type: "hidden" }
				},
				{
				    header: "구분", name: "gibu_tp", width: 220,
				    format: { type: "select", data: { memory: "기부" } },
				    editable: { type: "select", data: { memory: "기부" }, validate: { rule: "required" }, width: 220 }
				},
				{
				    header: "지급처상호", name: "comp_nm", width: 190,
				    editable: { type: "text", maxlength: 20, width: 188 }
				},
				{
				    header: "사업자번호", name: "comp_regno", width: 90, align: "center", mask: "biz-no",
				    editable: { type: "text", width: 98 }
				},
				{
				    header: "건수", name: "gibu_cnt", width: 40, align: "right", mask: "numeric-int",
				    editable: { type: "text", maxlength: 5, width: 37 }
				},
				//{
				//    header: "전년도이월금액", name: "previous_amt", width: 80, align: "right", mask: "numeric-int",
				//    editable: { type: "text", maxlength: 10, width: 102 }, hidden: true
				//},
				{
				    header: "전년도까지 공제된 금액", name: "previous_amt", width: 140, align: "right", mask: "numeric-int",
				    editable: { type: "text", maxlength: 10, width: 140 }
				},
				{
				    header: "기부금액", name: "gibu_amt", width: 70, align: "right", mask: "numeric-int",
				    editable: { type: "text", maxlength: 10, width: 70 }
				},
                {
                    header: "기부장려신청금액", name: "gibu_jang_amt", width: 100, align: "right", mask: "numeric-int",
                    editable: { type: "text", maxlength: 10, width: 99 }
                },
                {
                    header: "이월여부", name: "transfer_yn", width: 50, align: "center",
                    format: { type: "checkbox", value: "1", offval: "0" }
                },
				{
				    header: "공제금액", name: "deduct_amt", width: 60, align: "right", mask: "numeric-int",
				    editable: { type: "text", maxlength: 10, width: 102 }, hidden: true
				},
				{
				    header: "비고", name: "rmk", width: 150,
				    editable: { type: "text", maxlength: 50, width: 212 }, hidden: true
				},

                { name: "emp_no", editable: { type: "hidden" }, hidden: true },
                { name: "taxadj_year", editable: { type: "hidden" }, hidden: true },
                { name: "gibu_seq", editable: { type: "hidden" }, hidden: true },
                { name: "edit_yn", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_TAXADJ_ANNUITY", query: "HRM_2030_5", title: "연금 및 저축",
            caption: false, height: 120, pager: false, show: true, selectable: true, number: true,
            editable: { bind: "edit_yn", focus: "ann_tp", validate: true },
            element: [
				{
				    header: "소득공제구분", name: "ann_tp", width: 150,
				    format: { type: "select", data: { memory: "소득공제" } },
				    editable: { type: "select", data: { memory: "소득공제" }, validate: { rule: "required" }, width: 231 }
				},
				{
				    header: "금융기관", name: "bank_cd", width: 150,
				    format: { type: "select", data: { memory: "금융기관" } },
				    editable: { type: "select", data: { memory: "금융기관" }, validate: { rule: "required" }, width: 231 }
				},
				{
				    header: "계좌번호", name: "acnt_no", width: 70,
				    editable: { type: "text", maxlength: 20, width: 117 }
				},
				{
				    header: "납입연차", name: "year_cnt", width: 40, align: "right", mask: "numeric-int",
				    editable: { type: "text", maxlength: 5, width: 68 }
				},
				{
				    header: "불입금액", name: "paid_amt", width: 80, align: "right", mask: "numeric-int",
				    editable: { type: "text", maxlength: 10, width: 133 }
				},
				{
				    header: "공제금액", name: "deduct_amt", width: 80, align: "right", mask: "numeric-int",
				    editable: { type: "text", maxlength: 10, width: 133 }
				},
                {
                    header: "주택청약종합저축 가입일자", name: "reg_date", width: 100, align: "right", mask: "date-ymd",
                    editable: { type: "text", maxlength: 10, width: 152, validate: { rule: "dateISO" } }
                },
				{
				    header: "비고", name: "rmk", width: 150,
				    editable: { type: "text", maxlength: 50, width: 242 }, hidden: true
				},
                { name: "emp_no", editable: { type: "hidden" }, hidden: true },
                { name: "taxadj_year", editable: { type: "hidden" }, hidden: true },
                { name: "ann_seq", editable: { type: "hidden" }, hidden: true },
                { name: "edit_yn", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_TAXADJ_RENT", query: "HRM_2030_6", title: "월세액",
            caption: false, height: 120, pager: false, show: true, selectable: true, number: true,
            editable: { bind: "edit_yn", focus: "lessor_nm", validate: true },
            element: [
				{
				    header: "임대인성명", name: "lessor_nm", width: 60,
				    editable: { type: "text", maxlength: 20, width: 76 }
				},
				{
				    header: "주민번호", name: "lessor_rgsid", width: 80, align: "center", mask: "person-id",
				    editable: { type: "text", validate: { rule: "required" }, width: 98 }
				},
				{
				    header: "주택유형", name: "house_tp", width: 80,
				    format: { type: "select", data: { memory: "주택유형" } },
				    editable: { type: "select", data: { memory: "주택유형", validate: { rule: "required" } }, width: 98 }
				},
				{
				    header: "주택계약면적", name: "rent_area", width: 70, align: "right", mask: "numeric-float",
				    editable: { type: "text", validate: { rule: "required" }, width: 90 }
				},
				{
				    header: "임대차 계약서상 주소", name: "rent_addr", width: 260,
				    editable: { type: "text", maxlength: 70, width: 330 }
				},
				{
				    header: "계약기간(From)", name: "rents_dt", width: 80, align: "center", mask: "date-ymd",
				    editable: { type: "text", maxlength: 10, width: 98, validate: { rule: "dateISO" } }
				},
				{
				    header: "계약기간(To)", name: "rente_dt", width: 80, align: "center", mask: "date-ymd",
				    editable: { type: "text", maxlength: 10, width: 98, validate: { rule: "dateISO" } }
				},
				{
				    header: "연간월세액(원)", name: "year_amt", width: 70, align: "right", mask: "numeric-int",
				    editable: { type: "text", maxlength: 10, validate: { rule: "required" }, width: 90 }
				},
				{
				    header: "세액공제금액", name: "act_amt", width: 70, align: "right", mask: "numeric-int",
				    editable: { type: "text", maxlength: 10, width: 90 }, hidden: true
				},
                { name: "emp_no", editable: { type: "hidden" }, hidden: true },
                { name: "emp_nm", editable: { type: "hidden" }, hidden: true },
                { name: "taxadj_year", editable: { type: "hidden" }, hidden: true },
                { name: "rent_seq", editable: { type: "hidden" }, hidden: true },
                { name: "rent_tp", editable: { type: "hidden" }, hidden: true },
                { name: "edit_yn", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_TAXADJ_FILE", query: "HRM_2030_FILE", title: "전자파일",
            caption: false, height: 120, pager: false, show: true, number: true, selectable: true,
            editable: { multi: true, bind: "edit_yn", focus: "file_desc", validate: true },
            element: [
				{ header: "파일명", name: "file_nm", width: 250 },
				{ header: "다운로드", name: "download", width: 60, align: "center", format: { type: "link", value: "다운로드" } },
				{ header: "설명", name: "file_desc", width: 300, editable: { type: "text", maxlength: 110, width: 532 } },
                { name: "file_path", hidden: true },
                { name: "file_id", hidden: true, editable: { type: "hidden" } },
                { name: "passwd", hidden: true },
                { name: "edit_yn", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_TAXADJ_EMP_101", query: "HRM_TAXADJ_EMP_101", title: "기본사항",
            caption: true, height: "100%", pager: false, show: true, selectable: true, /* hiddengrid: true,*/
            editable: { bind: "edit_yn", focus: "input_val", validate: true },
            element: [
				{ header: "입력할 항목", name: "taxadj_nm", width: 120 },
				{ header: "", name: "input_nm", width: 120 },
				{
				    header: "선택 또는 입력", name: "input_val", width: 60,
				    editable: { type: "text", maxlength: 10, width: 118 }, mask: "numeric-int", align: "right"
				},
				{ header: "단위", name: "input_uom", width: 20, align: "center" },
				{ header: "입력", name: "input_yn", format: { type: "checkbox", value: "1", offval: "0" }, width: 20, align: "center" },
            	//{ header: "항목별 요약설명", name: "user_help", width: 300 },
                { name: "emp_no", editable: { type: "hidden" }, hidden: true },
                { name: "taxadj_year", editable: { type: "hidden" }, hidden: true },
                { name: "taxadj_grp", editable: { type: "hidden" }, hidden: true },
                { name: "taxadj_cd", editable: { type: "hidden" }, hidden: true },
                { name: "edit_yn", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_TAXADJ_EMP_201", query: "HRM_TAXADJ_EMP_201", title: "기본공제",
            caption: true, height: "100%", pager: false, show: true, selectable: true, /* hiddengrid: true,*/
            editable: { bind: "edit_yn", focus: "input_val", validate: true },
            element: [
				{ header: "입력할 항목", name: "taxadj_nm", width: 120 },
				{ header: "", name: "input_nm", width: 120 },
				{
				    header: "선택 또는 입력", name: "input_val", width: 60,
				    editable: { type: "text", maxlength: 10, width: 118 }, mask: "numeric-int", align: "right"
				},
				{ header: "단위", name: "input_uom", width: 20, align: "center" },
				{ header: "입력", name: "input_yn", format: { type: "checkbox", value: "1", offval: "0" }, width: 20, align: "center" },
            	//{ header: "항목별 요약설명", name: "user_help", width: 300 },
                { name: "emp_no", editable: { type: "hidden" }, hidden: true },
                { name: "taxadj_year", editable: { type: "hidden" }, hidden: true },
                { name: "taxadj_grp", editable: { type: "hidden" }, hidden: true },
                { name: "taxadj_cd", editable: { type: "hidden" }, hidden: true },
                { name: "edit_yn", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_TAXADJ_EMP_205", query: "HRM_TAXADJ_EMP_205", title: "추가공제",
            caption: true, height: "100%", pager: false, show: true, selectable: true, /* hiddengrid: true,*/
            editable: { bind: "edit_yn", focus: "input_val", validate: true },
            element: [
				{ header: "입력할 항목", name: "taxadj_nm", width: 120 },
				{ header: "", name: "input_nm", width: 120 },
				{
				    header: "선택 또는 입력", name: "input_val", width: 60,
				    editable: { type: "text", maxlength: 10, width: 118 }, mask: "numeric-int", align: "right"
				},
				{ header: "단위", name: "input_uom", width: 20, align: "center" },
				{ header: "입력", name: "input_yn", format: { type: "checkbox", value: "1", offval: "0" }, width: 20, align: "center" },
            	//{ header: "항목별 요약설명", name: "user_help", width: 300 },
                { name: "emp_no", editable: { type: "hidden" }, hidden: true },
                { name: "taxadj_year", editable: { type: "hidden" }, hidden: true },
                { name: "taxadj_grp", editable: { type: "hidden" }, hidden: true },
                { name: "taxadj_cd", editable: { type: "hidden" }, hidden: true },
                { name: "edit_yn", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_TAXADJ_EMP_210", query: "HRM_TAXADJ_EMP_210", title: "연금보험료공제",
            caption: true, height: "100%", pager: false, show: true, selectable: true, /* hiddengrid: true,*/
            editable: { bind: "edit_yn", focus: "input_val", validate: true },
            element: [
				{ header: "입력할 항목", name: "taxadj_nm", width: 120 },
				{ header: "", name: "input_nm", width: 120 },
				{
				    header: "선택 또는 입력", name: "input_val", width: 60,
				    editable: { type: "text", maxlength: 10, width: 118 }, mask: "numeric-int", align: "right"
				},
				{ header: "단위", name: "input_uom", width: 20, align: "center" },
				{ header: "입력", name: "input_yn", format: { type: "checkbox", value: "1", offval: "0" }, width: 20, align: "center" },
            	//{ header: "항목별 요약설명", name: "user_help", width: 300 },
                { name: "emp_no", editable: { type: "hidden" }, hidden: true },
                { name: "taxadj_year", editable: { type: "hidden" }, hidden: true },
                { name: "taxadj_grp", editable: { type: "hidden" }, hidden: true },
                { name: "taxadj_cd", editable: { type: "hidden" }, hidden: true },
                { name: "edit_yn", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_TAXADJ_EMP_230", query: "HRM_TAXADJ_EMP_230", title: "특별소득공제",
            caption: true, height: "100%", pager: false, show: true, selectable: true, /* hiddengrid: true,*/
            editable: { bind: "edit_yn", focus: "input_val", validate: true },
            element: [
				{ header: "입력할 항목", name: "taxadj_nm", width: 120 },
				{ header: "", name: "input_nm", width: 120 },
				{
				    header: "선택 또는 입력", name: "input_val", width: 60,
				    editable: { type: "text", maxlength: 10, width: 118 }, mask: "numeric-int", align: "right"
				},
				{ header: "단위", name: "input_uom", width: 20, align: "center" },
				{ header: "입력", name: "input_yn", format: { type: "checkbox", value: "1", offval: "0" }, width: 20, align: "center" },
            	//{ header: "항목별 요약설명", name: "user_help", width: 300 },
                { name: "emp_no", editable: { type: "hidden" }, hidden: true },
                { name: "taxadj_year", editable: { type: "hidden" }, hidden: true },
                { name: "taxadj_grp", editable: { type: "hidden" }, hidden: true },
                { name: "taxadj_cd", editable: { type: "hidden" }, hidden: true },
                { name: "edit_yn", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_TAXADJ_EMP_240", query: "HRM_TAXADJ_EMP_240", title: "그밖의 소득공제(저축)",
            caption: true, height: "100%", pager: false, show: true, selectable: true, /* hiddengrid: true,*/
            editable: { bind: "edit_yn", focus: "input_val", validate: true },
            element: [
				{ header: "입력할 항목", name: "taxadj_nm", width: 120 },
				{ header: "", name: "input_nm", width: 120 },
				{
				    header: "선택 또는 입력", name: "input_val", width: 60,
				    editable: { type: "text", maxlength: 10, width: 118 }, mask: "numeric-int", align: "right"
				},
				{ header: "단위", name: "input_uom", width: 20, align: "center" },
				{ header: "입력", name: "input_yn", format: { type: "checkbox", value: "1", offval: "0" }, width: 20, align: "center" },
            	//{ header: "항목별 요약설명", name: "user_help", width: 300 },
                { name: "emp_no", editable: { type: "hidden" }, hidden: true },
                { name: "taxadj_year", editable: { type: "hidden" }, hidden: true },
                { name: "taxadj_grp", editable: { type: "hidden" }, hidden: true },
                { name: "taxadj_cd", editable: { type: "hidden" }, hidden: true },
                { name: "edit_yn", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_TAXADJ_EMP_250", query: "HRM_TAXADJ_EMP_250", title: "그밖의 소득공제(카드)",
            caption: true, height: "100%", pager: false, show: true, selectable: true, /* hiddengrid: true,*/
            editable: { bind: "edit_yn", focus: "input_val", validate: true },
            element: [
				{ header: "입력할 항목", name: "taxadj_nm", width: 120 },
				{ header: "", name: "input_nm", width: 120 },
				{
				    header: "선택 또는 입력", name: "input_val", width: 60,
				    editable: { type: "text", maxlength: 10, width: 118 }, mask: "numeric-int", align: "right"
				},
				{ header: "단위", name: "input_uom", width: 20, align: "center" },
				{ header: "입력", name: "input_yn", format: { type: "checkbox", value: "1", offval: "0" }, width: 20, align: "center" },
            	//{ header: "항목별 요약설명", name: "user_help", width: 300 },
                { name: "emp_no", editable: { type: "hidden" }, hidden: true },
                { name: "taxadj_year", editable: { type: "hidden" }, hidden: true },
                { name: "taxadj_grp", editable: { type: "hidden" }, hidden: true },
                { name: "taxadj_cd", editable: { type: "hidden" }, hidden: true },
                { name: "edit_yn", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_TAXADJ_EMP_260", query: "HRM_TAXADJ_EMP_260", title: "그밖의 소득공제(기타)",
            caption: true, height: "100%", pager: false, show: true, selectable: true, /* hiddengrid: true,*/
            editable: { bind: "edit_yn", focus: "input_val", validate: true },
            element: [
				{ header: "입력할 항목", name: "taxadj_nm", width: 120 },
				{ header: "", name: "input_nm", width: 120 },
				{
				    header: "선택 또는 입력", name: "input_val", width: 60,
				    editable: { type: "text", maxlength: 10, width: 118 }, mask: "numeric-int", align: "right"
				},
				{ header: "단위", name: "input_uom", width: 20, align: "center" },
				{ header: "입력", name: "input_yn", format: { type: "checkbox", value: "1", offval: "0" }, width: 20, align: "center" },
            	//{ header: "항목별 요약설명", name: "user_help", width: 300 },
                { name: "emp_no", editable: { type: "hidden" }, hidden: true },
                { name: "taxadj_year", editable: { type: "hidden" }, hidden: true },
                { name: "taxadj_grp", editable: { type: "hidden" }, hidden: true },
                { name: "taxadj_cd", editable: { type: "hidden" }, hidden: true },
                { name: "edit_yn", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_TAXADJ_EMP_300", query: "HRM_TAXADJ_EMP_300", title: "세액감면",
            caption: true, height: "100%", pager: false, show: true, selectable: true, /* hiddengrid: true,*/
            editable: { bind: "edit_yn", focus: "input_val", validate: true },
            element: [
				{ header: "입력할 항목", name: "taxadj_nm", width: 120 },
				{ header: "", name: "input_nm", width: 120 },
				{
				    header: "선택 또는 입력", name: "input_val", width: 60,
				    editable: { type: "text", maxlength: 10, width: 118 }, mask: "numeric-int", align: "right"
				},
				{ header: "단위", name: "input_uom", width: 20, align: "center" },
				{ header: "입력", name: "input_yn", format: { type: "checkbox", value: "1", offval: "0" }, width: 20, align: "center" },
            	//{ header: "항목별 요약설명", name: "user_help", width: 300 },
                { name: "emp_no", editable: { type: "hidden" }, hidden: true },
                { name: "taxadj_year", editable: { type: "hidden" }, hidden: true },
                { name: "taxadj_grp", editable: { type: "hidden" }, hidden: true },
                { name: "taxadj_cd", editable: { type: "hidden" }, hidden: true },
                { name: "edit_yn", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_TAXADJ_EMP_310", query: "HRM_TAXADJ_EMP_310", title: "세액공제",
            caption: true, height: "100%", pager: false, show: true, selectable: true, /* hiddengrid: true,*/
            editable: { bind: "edit_yn", focus: "input_val", validate: true },
            element: [
				{ header: "입력할 항목", name: "taxadj_nm", width: 120 },
				{ header: "", name: "input_nm", width: 120 },
				{
				    header: "선택 또는 입력", name: "input_val", width: 60,
				    editable: { type: "text", maxlength: 10, width: 118 }, mask: "numeric-int", align: "right"
				},
				{ header: "단위", name: "input_uom", width: 20, align: "center" },
				{ header: "입력", name: "input_yn", format: { type: "checkbox", value: "1", offval: "0" }, width: 20, align: "center" },
            	//{ header: "항목별 요약설명", name: "user_help", width: 300 },
                { name: "emp_no", editable: { type: "hidden" }, hidden: true },
                { name: "taxadj_year", editable: { type: "hidden" }, hidden: true },
                { name: "taxadj_grp", editable: { type: "hidden" }, hidden: true },
                { name: "taxadj_cd", editable: { type: "hidden" }, hidden: true },
                { name: "edit_yn", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_TAXADJ_EMP_320", query: "HRM_TAXADJ_EMP_320", title: "세액공제(기타)",
            caption: true, height: "100%", pager: false, show: true, selectable: true, /* hiddengrid: true,*/
            editable: { bind: "edit_yn", focus: "input_val", validate: true },
            element: [
				{ header: "입력할 항목", name: "taxadj_nm", width: 120 },
				{ header: "", name: "input_nm", width: 120 },
				{
				    header: "선택 또는 입력", name: "input_val", width: 60,
				    editable: { type: "text", maxlength: 10, width: 118 }, mask: "numeric-int", align: "right"
				},
				{ header: "단위", name: "input_uom", width: 20, align: "center" },
				{ header: "입력", name: "input_yn", format: { type: "checkbox", value: "1", offval: "0" }, width: 20, align: "center" },
            	//{ header: "항목별 요약설명", name: "user_help", width: 300 },
                { name: "emp_no", editable: { type: "hidden" }, hidden: true },
                { name: "taxadj_year", editable: { type: "hidden" }, hidden: true },
                { name: "taxadj_grp", editable: { type: "hidden" }, hidden: true },
                { name: "taxadj_cd", editable: { type: "hidden" }, hidden: true },
                { name: "edit_yn", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);
        //=====================================================================================
        var args = {
            target: [
				{ type: "GRID", id: "grdData_TAXADJ_FAMILY", offset: 8 },
				{ type: "GRID", id: "grdData_TAXADJ_OFC", offset: 8 },
				{ type: "GRID", id: "grdData_TAXADJ_MEDI", offset: 8 },
				{ type: "GRID", id: "grdData_TAXADJ_GIBU", offset: 8 },
				{ type: "GRID", id: "grdData_TAXADJ_ANNUITY", offset: 8 },
				{ type: "GRID", id: "grdData_TAXADJ_RENT", offset: 8 },
				{ type: "GRID", id: "grdData_TAXADJ_FILE", offset: 8 },
				{ type: "GRID", id: "grdData_TAXADJ_EMP_101", offset: 8 },
				{ type: "GRID", id: "grdData_TAXADJ_EMP_201", offset: 8 },
				{ type: "GRID", id: "grdData_TAXADJ_EMP_205", offset: 8 },
				{ type: "GRID", id: "grdData_TAXADJ_EMP_210", offset: 8 },
				{ type: "GRID", id: "grdData_TAXADJ_EMP_230", offset: 8 },
				{ type: "GRID", id: "grdData_TAXADJ_EMP_240", offset: 8 },
				{ type: "GRID", id: "grdData_TAXADJ_EMP_250", offset: 8 },
				{ type: "GRID", id: "grdData_TAXADJ_EMP_260", offset: 8 },
				{ type: "GRID", id: "grdData_TAXADJ_EMP_300", offset: 8 },
				{ type: "GRID", id: "grdData_TAXADJ_EMP_310", offset: 8 },
				{ type: "GRID", id: "grdData_TAXADJ_EMP_320", offset: 8 }
            ]
        };
        gw_com_module.objResize(args);
        //=====================================================================================
        var args = {
            tabid: "lyrTab",
            target: [
				{ type: "LAYER", id: "lyrTab_01", title: "인적공제" },
				{ type: "LAYER", id: "lyrTab_02", title: "종전근무지" },
				{ type: "LAYER", id: "lyrTab_03", title: "의료비" },
                { type: "LAYER", id: "lyrTab_04", title: "기부금" },
                { type: "LAYER", id: "lyrTab_05", title: "연금 및 저축" },
                { type: "LAYER", id: "lyrTab_06", title: "월세액" },
                { type: "LAYER", id: "lyrTab_07", title: "전자파일" }
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
        gw_com_module.informSize();

    },

    // manage process. (program section)
    procedure: function () {

        //=====================================================================================
        var args = { targetid: "lyrMenu", element: "명세서", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "설명", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "파일", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "초기화", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption", event: "itemdblclick", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemkeyenter", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_TAXADJ_FAMILY", grid: true, element: "link", event: "click", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_TAXADJ_FAMILY", grid: true, event: "itemdblclick", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_TAXADJ_OFC", grid: true, event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_TAXADJ_OFC", grid: true, element: "link", event: "click", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_TAXADJ_OFC", grid: true, event: "itemdblclick", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_TAXADJ_FILE", grid: true, element: "download", event: "click", handler: processDownload };
        gw_com_module.eventBind(args);
        //=====================================================================================

    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function viewOption(param) {

    gw_com_api.show("frmOption");

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

}
//----------
function processButton(param) {

    closeOption({});
    switch (param.element) {
        case "명세서":
            v_global.process.handler = processPopup;
            if (!checkUpdatable({})) return;
            processPopup({});
            break;
        case "설명":
            var year = gw_com_api.getValue("frmOption", 1, "taxadj_year");
            var url = "";
            if (year == "2015") {
                url = "/Files/HRM/BizManual/연말정산/연말정산_" + year + ".pdf";
            } else {
                url = "/Files/HRM/BizManual/연말정산/연말정산_" + year + ".htm";
            }
            window.open(url, "항목설명", "scrollbars=yes,resizable=yes,menubar=no,toolbar=no,width=760,height=600");
            break;
        case "파일":
            gw_com_api.selectTab("lyrTab", 7);
            var args = {
                type: "PAGE", page: "DLG_TAXADJ_PDF", title: "전자파일추가",
                width: 700, height: 200, locate: ["center", 50], open: true
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = {
                    page: "DLG_TAXADJ_PDF",
                    param: {
                        ID: gw_com_api.v_Stream.msg_openedDialogue,
                        data: {
                            key: gw_com_api.getValue("frmOption", 1, "emp_no"),
                            subkey: gw_com_api.getValue("frmOption", 1, "taxadj_year")
                        }
                    }
                };
                gw_com_module.dialogueOpen(args);
            }
            break;
        case "조회":
            viewOption({});
            break;
        case "실행":
            v_global.process.handler = processRetrieve;
            if (!checkUpdatable({})) return;
            processRetrieve({});
            break;
        case "취소":
            closeOption({});
            break;
        case "추가":
            processInsert({});
            break;
        case "삭제":
            processDelete({});
            break;
        case "저장":
            if (!chkRegData({})) {
                gw_com_api.messageBox([{ text: "주택청약종합저축 가입일을 입력하세요." }], 320);
                return false;
            }
            processSave({});
            break;
        case "닫기":
            v_global.process.handler = processClose;
            if (!checkUpdatable({})) return;
            processClose({});
            break;
        case "초기화":
            startReset({});
            break;
    }

}
//----------
function chkRegData(param) {
    var chkyn = true;
    var rowcnt = gw_com_api.getRowCount("grdData_TAXADJ_ANNUITY");
    for(var i = 1; i <= rowcnt; i++){
        var income_tp = gw_com_api.getValue("grdData_TAXADJ_ANNUITY", i, "ann_tp", true);
        if (income_tp == "32") {
            if (gw_com_api.getValue("grdData_TAXADJ_ANNUITY", i, "reg_date", true) == "")
                chkyn = false;
        }
    }
    return chkyn;
}
//----------
function processItemchanged(param) {

    switch (param.object) {
        case "grdData_TAXADJ_OFC":
            switch (param.element) {
                case "amt1":
                case "amt2":
                case "amt3":
                    var val = Number(gw_com_api.getValue(param.object, param.row, "amt1", true))
                            + Number(gw_com_api.getValue(param.object, param.row, "amt2", true))
                            + Number(gw_com_api.getValue(param.object, param.row, "amt3", true));
                    gw_com_api.setValue(param.object, param.row, "amt6", val, true, true, false);
                    break;
                case "amt34":
                case "amt35":
                case "amt36":
                case "amt37":
                    var val = Number(gw_com_api.getValue(param.object, param.row, "amt34", true))
                            + Number(gw_com_api.getValue(param.object, param.row, "amt35", true))
                            + Number(gw_com_api.getValue(param.object, param.row, "amt36", true))
                            + Number(gw_com_api.getValue(param.object, param.row, "amt37", true));
                    gw_com_api.setValue(param.object, param.row, "amt38", val, true, true, false);
                    break;
            }
            break;
        case "frmOption":
            switch (param.element) {
                case "emp_nm":
                    if (param.value.current == "")
                        gw_com_api.setValue(param.object, param.row, "emp_no", "");
                    break;
            }
            break;
    }

}
//----------
function processItemdblclick(param) {

    v_global.event.type = param.type;
    v_global.event.object = param.object;
    v_global.event.row = param.row;
    v_global.event.element = param.element;

    var args;
    if (param.object == "grdData_TAXADJ_FAMILY") {
        if (param.element == "family_nm" || param.element == "link") {
            //가족관계 확인
            if ($.inArray(gw_com_api.getValue(param.object, param.row, "family_rel", true), ["", "Z"]) >= 0) {
                //gw_com_api.setFocus(param.object, param.row, "family_rel", true);
                gw_com_api.messageBox([{ text: "가족관계를 입력하세요." }], 320);
                return;
            }
            gw_com_api.setError(false, param.object, param.row, "family_rel", true);
            v_global.logic.popup_data = getRowData(param.object, param.row, true);
            args = {
                type: "PAGE", page: "HRM_2113", title: "인적공제",
                width: 900, height: 350, locate: ["center", 100], open: true,
                data: v_global.logic.popup_data
            };
        }
    } else if (param.object == "grdData_TAXADJ_OFC") {
        if (param.element == "amt34" || param.element == "link") {
            v_global.logic.popup_data = getRowData(param.object, param.row, true);
            v_global.logic.popup_data["emp_nm"]= gw_com_api.getValue("frmOption", 1, "emp_nm");
            args = {
                type: "PAGE", page: "HRM_2112", title: "비과세소득",
                width: 900, height: 300, locate: ["center", 100], open: true,
                data: v_global.logic.popup_data
            };
        }
    } else if (param.object == "frmOption") {
        if (param.element == "emp_nm") {
            args = {
                type: "PAGE", page: "w_find_emp", title: "사원 검색",
                width: 600, height: 450, locate: ["center", 100], open: true,
                data: {
                    emp_nm: gw_com_api.getValue(
                        v_global.event.object,
                        v_global.event.row,
                        v_global.event.element,
                        (v_global.event.type == "GRID" ? true : false))
                }
            };
        }
    } else {
        return;
    }

    if (args != null) {
        if (gw_com_module.dialoguePrepare(args) == false) {
            args = {
                page: args.page,
                param: {
                    ID: gw_com_api.v_Stream.msg_openedDialogue,
                    data: args.data
                }
            };
            gw_com_module.dialogueOpen(args);
        }
    }

}
//----------
function processInsert(param) {

    // 마감체크
    if (TaxAdj.close()) {
        gw_com_api.messageBox([{ text: "마감된 자료는 수정할 수 없습니다." }]);
        return;
    }

    var data = new Array();
    var id = "";
    var seq = "";
    var tab_idx = $("#lyrTab").tabs("option", "selected");

    switch (tab_idx) {
        case 0: // 인적공제
            id = "grdData_TAXADJ_FAMILY";
            seq = "family_seq";
            data.push({ name: "family_rel", value: "Z" });
            data.push({ name: "link", value: "상세입력" });
            break;
        case 1: // 종전근무지
            id = "grdData_TAXADJ_OFC";
            seq = "ofc_seq";
            data.push({ name: "link", value: "상세입력" });
            break;
        case 2: // 의료비
        case 3: // 기부금
            if (param.data != undefined) {
                id = (tab_idx == 2 ? "grdData_TAXADJ_MEDI" : "grdData_TAXADJ_GIBU");
                seq = (tab_idx == 2 ? "medi_seq" : "gibu_seq");
                //                if (gw_com_api.getFindRow(id, "family_id", param.data.family_id) > 0)
                //                    return;
                data.push({ name: "family_nm", value: param.data.family_nm });
                data.push({ name: "family_id", value: param.data.family_id });
                data.push({ name: "transfer_yn", value: 0 });
                data.push({ name: "gibu_year", value: gw_com_api.getValue("frmOption", 1, "taxadj_year") });
            } else {
                var args = {
                    type: "PAGE", page: "HRM_2111", title: "인적공제내역",
                    width: 500, height: 290, locate: ["center", "top"], open: true
                };
                if (gw_com_module.dialoguePrepare(args) == false) {
                    var args = {
                        page: "HRM_2111",
                        param: {
                            ID: gw_com_api.v_Stream.msg_openedDialogue,
                            data: {
                                emp_no: gw_com_api.getValue("frmOption", 1, "emp_no"),
                                emp_nm: gw_com_api.getValue("frmOption", 1, "emp_nm"),
                                taxadj_year: gw_com_api.getValue("frmOption", 1, "taxadj_year")
                            }
                        }
                    };
                    gw_com_module.dialogueOpen(args);
                }
                return;
            }
            break;
        case 4: // 연금 및 저축
            id = "grdData_TAXADJ_ANNUITY";
            seq = "ann_seq";
            break;
        case 5: // 월세액
            id = "grdData_TAXADJ_RENT";
            seq = "rent_seq";
            data.push({ name: "emp_nm", value: gw_com_api.getValue("frmOption", 1, "emp_nm") });
            data.push({ name: "rent_tp", value: "61" });
            break;
        case 6: // 전자파일
            var args = {
                type: "PAGE", page: "DLG_TAXADJ_PDF", title: "전자파일추가",
                width: 700, height: 200, locate: ["center", 50], open: true
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = {
                    page: "DLG_TAXADJ_PDF",
                    param: {
                        ID: gw_com_api.v_Stream.msg_openedDialogue,
                        data: {
                            key: gw_com_api.getValue("frmOption", 1, "emp_no"),
                            subkey: gw_com_api.getValue("frmOption", 1, "taxadj_year")
                        }
                    }
                };
                gw_com_module.dialogueOpen(args);
            }
            return;
            break;
    }

    data.push({ name: "emp_no", value: gw_com_api.getValue("frmOption", 1, "emp_no") });
    data.push({ name: "taxadj_year", value: gw_com_api.getValue("frmOption", 1, "taxadj_year") });
    data.push({ name: seq, rule: "INCREMENT", value: 1 });

    var args = {
        targetid: id, edit: true, updatable: true,
        data: data
    };
    gw_com_module.gridInsert(args);

}
//----------
function processDelete(param) {

    // 마감체크
    if (TaxAdj.close()) {
        gw_com_api.messageBox([{ text: "마감된 자료는 수정할 수 없습니다." }]);
        return;
    }

    var id = "";

    switch ($("#lyrTab").tabs("option", "selected")) {
        case 0: // 인적공제
            id = "grdData_TAXADJ_FAMILY";
            // 삭제가능체크
            var year = gw_com_api.getValue("frmOption", 1, "taxadj_year");
            var emp_no = gw_com_api.getValue("frmOption", 1, "emp_no");
            var family_id = gw_com_api.getValue(id, "selected", "family_id", true);
            if (family_id != "" && family_id != undefined) {
                if (!TaxAdj.del_family({ year: year, emp_no: emp_no, family_id: family_id })) {
                    gw_com_api.messageBox([
                        { text: "해당 주민번호로 공제 정보가 등록되어 있습니다." },
                        { text: "전자파일을 다시 등록하거나 해당 주민번호의 공제 정보를 삭제 후 다시 진행하시기 바랍니다." }
                    ], 620);
                    return false;
                }
            }
            break;
        case 1: // 종전근무지
            id = "grdData_TAXADJ_OFC";
            break;
        case 2: // 의료비
            id = "grdData_TAXADJ_MEDI";
            break;
        case 3: // 기부금
            //id = "grdData_TAXADJ_GIBU";
            var chkYN = gw_com_api.getValue("grdData_TAXADJ_GIBU", "selected", "transfer_yn", true);
            if (chkYN == "1") {
                gw_com_api.messageBox([{ text: "이월 금액은 삭제할 수 없습니다." }]);
                id = "empty";
                break;
            }else {
                id = "grdData_TAXADJ_GIBU";
            }
            break;
        case 4: // 연금 및 저축
            id = "grdData_TAXADJ_ANNUITY";
            break;
        case 5: // 월세액
            id = "grdData_TAXADJ_RENT";
            break;
        case 6: // 전자파일
            id = "grdData_TAXADJ_FILE";
            break;
    }
    if (id == "empty") {
        return;
    } else {
        var args = { targetid: id, row: "selected", select: true };
        gw_com_module.gridDelete(args);
    }

}
//----------
function processSave(param) {

    // 마감체크
    if (TaxAdj.close()) {
        gw_com_api.messageBox([{ text: "마감된 자료는 수정할 수 없습니다." }]);
        return;
    }

    var args = {
        nomessage: true,
        url: "COM",
        target: [
			{ type: "GRID", id: "grdData_TAXADJ_FAMILY" },
            { type: "GRID", id: "grdData_TAXADJ_OFC" },
            { type: "GRID", id: "grdData_TAXADJ_MEDI" },
            { type: "GRID", id: "grdData_TAXADJ_GIBU" },
            { type: "GRID", id: "grdData_TAXADJ_ANNUITY" },
            { type: "GRID", id: "grdData_TAXADJ_RENT" },
            { type: "GRID", id: "grdData_TAXADJ_FILE" },
            { type: "GRID", id: "grdData_TAXADJ_EMP_101" },
            { type: "GRID", id: "grdData_TAXADJ_EMP_201" },
            { type: "GRID", id: "grdData_TAXADJ_EMP_205" },
            { type: "GRID", id: "grdData_TAXADJ_EMP_210" },
            { type: "GRID", id: "grdData_TAXADJ_EMP_230" },
            { type: "GRID", id: "grdData_TAXADJ_EMP_240" },
            { type: "GRID", id: "grdData_TAXADJ_EMP_250" },
            { type: "GRID", id: "grdData_TAXADJ_EMP_260" },
            { type: "GRID", id: "grdData_TAXADJ_EMP_300" },
            { type: "GRID", id: "grdData_TAXADJ_EMP_310" },
            { type: "GRID", id: "grdData_TAXADJ_EMP_320" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    // 가족관계 체크
    var row = gw_com_api.getFindRow("grdData_TAXADJ_FAMILY", "family_rel", "Z");
    if (row > 0) {
        gw_com_api.messageBox([{ text: "가족관계를 확인하세요." }], 320
            , gw_com_api.v_Message.msg_alert
            , "ALERT"
            , { type: "chk_family", id: "grdData_TAXADJ_FAMILY", row: row });
        return false;
    }


    args.handler = {
        success: successSave,
        param: param
    };
    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    var args = {
        nomessage: true,
        url: "COM",
        procedure: "dbo.sp_cYearAdj",
        input: [
            { name: "v_process", value: "CADJ_CALC", type: "varchar" },
            { name: "as_ofc_cd", value: "%", type: "varchar" },
            { name: "as_emp_no", value: gw_com_api.getValue("frmOption", 1, "emp_no"), type: "varchar" },
            { name: "v_year", value: gw_com_api.getValue("frmOption", 1, "taxadj_year"), type: "varchar" }
        ],
        output: [
            { name: "v_ret", type: "varchar" },
            { name: "v_msg", type: "varchar" }
        ],
        handler: {
            success: successBatch,
            param: param
        }
    };
    gw_com_module.callProcedure(args);

}
//----------
function processRetrieve(param) {

    var args = { target: [{ type: "FORM", id: "frmOption" }] };
    if (!gw_com_module.objValidate(args)) return;

    var args = {
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
                { name: "emp_no", argument: "arg_emp_no" },
                { name: "taxadj_year", argument: "arg_taxadj_year" }
            ],
            remark: [
                { element: [{ name: "taxadj_year" }] },
                { element: [{ name: "emp_nm" }] }
            ]
        },
        handler: {
            complete: processRetrieveEnd,
            param: param
        },
        key: param.key
    };

    if (param.target != undefined) {
        args.target = param.target;
    } else {
        args.target = [
            { type: "GRID", id: "grdData_TAXADJ_FAMILY" },
            { type: "GRID", id: "grdData_TAXADJ_OFC" },
            { type: "GRID", id: "grdData_TAXADJ_MEDI" },
            { type: "GRID", id: "grdData_TAXADJ_GIBU" },
            { type: "GRID", id: "grdData_TAXADJ_ANNUITY" },
            { type: "GRID", id: "grdData_TAXADJ_RENT" },
            { type: "GRID", id: "grdData_TAXADJ_FILE" },
            { type: "GRID", id: "grdData_TAXADJ_EMP_101" },
            { type: "GRID", id: "grdData_TAXADJ_EMP_201" },
            { type: "GRID", id: "grdData_TAXADJ_EMP_205" },
            { type: "GRID", id: "grdData_TAXADJ_EMP_210" },
            { type: "GRID", id: "grdData_TAXADJ_EMP_230" },
            { type: "GRID", id: "grdData_TAXADJ_EMP_240" },
            { type: "GRID", id: "grdData_TAXADJ_EMP_250" },
            { type: "GRID", id: "grdData_TAXADJ_EMP_260" },
            { type: "GRID", id: "grdData_TAXADJ_EMP_300" },
            { type: "GRID", id: "grdData_TAXADJ_EMP_310" },
            { type: "GRID", id: "grdData_TAXADJ_EMP_320" }
        ];
    }
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {

}
//----------
function startReset(param) {
    var args = {
        handler: processReset,
        param: {
            data: { saved: true, key:param }
        }
    };
    gw_com_api.messageBox([
            { text: "초기화 하시겠습니까?" }
    ], 300, gw_com_api.v_Message.msg_confirmBatch, "YESNO", args);
}
//----------
function processReset(param) {
    param = {
        reset: true
    };
    var args = {
        url: "COM",
        nomessage: true,
        procedure: "sp_cYearAdj_Reset",
        input: [
            { name: "as_site", value: "a", type: "varchar" },
            { name: "as_ofc_cd", value: "a", type: "varchar" },
            { name: "as_year", value: gw_com_api.getValue("frmOption", 1, "taxadj_year"), type: "varchar" },
            { name: "as_emp_no", value: gw_com_api.getValue("frmOption", 1, "emp_no"), type: "varchar" }

        ],
        output: [
            { name: "as_ret", type: "varchar" },
            { name: "as_msg", type: "varchar" }
        ],
        handler: {
            success: successBatch,
            param: param
        }
    };
    gw_com_module.callProcedure(args);
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
function checkUpdatable(param) {

    var args = {
        check: param.check,
        target: [
            { type: "GRID", id: "grdData_TAXADJ_FAMILY" },
            { type: "GRID", id: "grdData_TAXADJ_OFC" },
            { type: "GRID", id: "grdData_TAXADJ_MEDI" },
            { type: "GRID", id: "grdData_TAXADJ_GIBU" },
            { type: "GRID", id: "grdData_TAXADJ_ANNUITY" },
            { type: "GRID", id: "grdData_TAXADJ_RENT" },
            { type: "GRID", id: "grdData_TAXADJ_FILE" },
            { type: "GRID", id: "grdData_TAXADJ_EMP_101" },
            { type: "GRID", id: "grdData_TAXADJ_EMP_201" },
            { type: "GRID", id: "grdData_TAXADJ_EMP_205" },
            { type: "GRID", id: "grdData_TAXADJ_EMP_210" },
            { type: "GRID", id: "grdData_TAXADJ_EMP_230" },
            { type: "GRID", id: "grdData_TAXADJ_EMP_240" },
            { type: "GRID", id: "grdData_TAXADJ_EMP_250" },
            { type: "GRID", id: "grdData_TAXADJ_EMP_260" },
            { type: "GRID", id: "grdData_TAXADJ_EMP_300" },
            { type: "GRID", id: "grdData_TAXADJ_EMP_310" },
            { type: "GRID", id: "grdData_TAXADJ_EMP_320" }
        ],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function processDownload(param) {

    var args = {
        source: { id: param.object, row: param.row },
        targetid: "lyrDown"
    };
    gw_com_module.downloadFile(args);

}
//----------
function successBatch(response, param) {

    var rtn_no = response.VALUE[0];
    var rtn_msg = response.VALUE[1];
    if (param.reset) {
        gw_com_api.messageBox([{ text: "초기화 되었습니다" }], 500);
    } else {
        gw_com_api.messageBox([{ text: rtn_msg + " (" + rtn_no + ")" }], 500);
    }

    if (rtn_no == "OK") {
        processRetrieve({});
    }

}
//----------
function processPopup(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_linkPage,
        to: {
            type: "MAIN"
        },
        data: {
            page: "HRM_2120", title: "연말정산 명세서",
            param: [
                { name: "taxadj_year", value: gw_com_api.getValue("frmOption", 1, "taxadj_year") },
                { name: "emp_no", value: gw_com_api.getValue("frmOption", 1, "emp_no") },
                { name: "emp_nm", value: gw_com_api.getValue("frmOption", 1, "emp_nm") },
            ]
        }
    };
    gw_com_module.streamInterface(args);

}
//----------
function getRowData(id, row, grid) {

    var data = new Object();
    var cols = gw_com_api.getColCount(id);
    $.each(cols, function () {
        var name = this.name;
        var val = gw_com_api.getValue(id, row, name, grid);
        data[name] = val;
    });
    return data;

}
//----------
function setRowData(id, row, val, grid) {

    var args = { targetid: id, row: row, edit: true };
    gw_com_module.gridEdit(args);
    var cols = gw_com_api.getColCount(id);
    $.each(cols, function () {
        var name = this.name;
        var value = val[name];
        if (value != undefined)
            gw_com_api.setValue(id, row, name, value, grid);
    });

}
//----------
var TaxAdj = {
    close: function (param) {
        var rtn = false;
        var args = {
            request: "PAGE",
            url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
                    "?QRY_ID=HRM_TAXADJ_MASTER" +
                    "&QRY_COLS=close_yn" +
                    "&CRUD=R" +
                    "&arg_year=" + gw_com_api.getValue("frmOption", 1, "taxadj_year") + "&arg_emp_no=" + gw_com_api.getValue("frmOption", 1, "emp_no"),
            handler_success: successRequest
        };
        //=================== async : false ========================
        $.ajaxSetup({ async: false });
        //----------
        gw_com_module.callRequest(args);
        function successRequest(data) {
            rtn = (data[0].DATA[0] == "1" ? true : false);
        }
        //----------
        $.ajaxSetup({ async: true });
        //=================== async : true ========================
        return rtn
    },
    del_family: function (param) {
        var rtn = false;
        var args = {
            request: "PAGE",
            url: "../Service/svc_Data_Retrieve_JSON.aspx" +
                    "?QRY_ID=HRM_TAXADJ_FAMILY_DEL" +
                    "&QRY_COLS=chk" +
                    "&CRUD=R" +
                    "&arg_year=" + param.year + "&arg_emp_no=" + param.emp_no + "&arg_family_id=" + param.family_id,
            handler_success: successRequest
        };
        //=================== async : false ========================
        $.ajaxSetup({ async: false });
        //----------
        gw_com_module.callRequest(args);
        function successRequest(data) {
            rtn = (data.DATA[0] == "1" ? true : false);
        }
        //----------
        $.ajaxSetup({ async: true });
        //=================== async : true ========================
        return rtn
    }
}
//----------
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
                    case gw_com_api.v_Message.msg_alert:
                        if (param.data.arg != undefined && param.data.arg.type != undefined) {
                            switch (param.data.arg.type) {
                                case "chk_family":
                                    gw_com_api.selectRow(param.data.arg.id, param.data.arg.row, true);
                                    break;
                            }
                        }
                        break;
                    case gw_com_api.v_Message.msg_confirmBatch:
                        {
                            if (param.data.result == "YES") {
                                processReset();
                            }   
                        }
                        break;
                    case gw_com_api.v_Message.msg_confirmSave:
                        {
                            if (param.data.result == "YES") {
                                processSave(param.data.arg);
                            } else {
                                if (v_global.process.handler != null)
                                    v_global.process.handler(param.data.arg);
                            }
                        } break;
                    case gw_com_api.v_Message.msg_confirmRemove:
                        { if (param.data.result == "YES") processRemove(param.data.arg); } break;
                    case gw_com_api.v_Message.msg_informSaved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        } break;
                    case gw_com_api.v_Message.msg_informRemoved:
                        { param.data.arg.handler(param.data.arg.response, param.data.arg.param); } break;
                    case gw_com_api.v_Message.msg_informBatched:
                        { param.data.arg.handler(param.data.arg.response, param.data.arg.param); } break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = {
                    to: { type: "POPUP", page: param.from.page },
                    ID: param.ID
                };
                switch (param.from.page) {
                    case "DLG_TAXADJ_PDF":
                        args.data = {
                            key: gw_com_api.getValue("frmOption", 1, "emp_no"),
                            subkey: gw_com_api.getValue("frmOption", 1, "taxadj_year")
                        }
                        break;
                    case "HRM_2111":
                        args.data = {
                            emp_no: gw_com_api.getValue("frmOption", 1, "emp_no"),
                            emp_nm: gw_com_api.getValue("frmOption", 1, "emp_nm"),
                            taxadj_year: gw_com_api.getValue("frmOption", 1, "taxadj_year")
                        };
                        break;
                    case "HRM_2112":
                    case "HRM_2113":
                        args.data = v_global.logic.popup_data;
                        break;
                    case "w_find_emp":
                        {
                            args.data = {
                                emp_nm: gw_com_api.getValue(
                                    v_global.event.object,
                                    v_global.event.row,
                                    v_global.event.element,
                                    (v_global.event.type == "GRID" ? true : false))
                            }

                        }
                        break;
                }
                gw_com_module.streamInterface(args);
            } break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                switch (param.from.page) {
                    case "DLG_TAXADJ_PDF":
                        if (param.data != undefined)
                            processRetrieve({});
                            //processRetrieve({ type: "GRID", id: "grdData_TAXADJ_FILE" });
                        break;
                    case "HRM_2111":
                        if (param.data != undefined)
                            processInsert(param);
                        break;
                    case "HRM_2112":
                    case "HRM_2113":
                        if (param.data != undefined) {
                            setRowData(v_global.event.object, v_global.event.row, param.data, true);
                        }
                        break;
                    case "w_find_emp":
                        if (param.data != undefined) {
                            gw_com_api.setValue(
                                                v_global.event.object,
                                                v_global.event.row,
                                                v_global.event.element,
                                                param.data.emp_nm,
                                                (v_global.event.type == "GRID") ? true : false);
                            gw_com_api.setValue(
                                                v_global.event.object,
                                                v_global.event.row,
                                                "emp_no",
                                                param.data.emp_no,
                                                (v_global.event.type == "GRID") ? true : false);
                        }
                        break;
                }
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.GW_msg_uploaded_WORK:
            switch (param.from.page) {
                case "DLG_TAXADJ_PDF":
                    processRetrieve({ type: "GRID", id: "grdData_TAXADJ_FILE" });
                    break;
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//