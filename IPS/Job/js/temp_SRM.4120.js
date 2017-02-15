//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 납품 등록
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
    data: null, logic: {}
};

var chkRows;
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define gw_job_process class : ready(), UI(), procedure()
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var gw_job_process = {

    // entry point. (pre-process section)
    ready: function () {

        // initialize page.
        v_global.process.param = gw_com_module.initPage({ authority: true, message: true });
        gw_com_api.changeTheme("style_theme");
        start();

        //----------
        function start() {
            gw_job_process.UI();
            gw_job_process.procedure();
        }

    },

    // manage UI. (design section)
    UI: function () {

        //==== Main Menu : 저장, 삭제, 닫기
        var args = {
            targetid: "lyrMenu_Main", type: "FREE",
            element: [
				{ name: "생성", value: "바코드", icon: "실행" },
				{ name: "저장", value: "저장" },
				{ name: "삭제", value: "삭제" },
				{ name: "닫기", value: "닫기" }
            ]
        };
        gw_com_module.buttonMenu(args);

        //==== Sub Menu : (납품내역) 추가, 삭제
        var args = {
            targetid: "lyrMenu_Sub", type: "FREE",
            element: [
				{ name: "추가", value: "추가" },
				{ name: "삭제", value: "삭제" },
                { name: "저장", value: "야옹",icon:"조회" }

            ]
        };
        gw_com_module.buttonMenu(args);

        //==== Option : 일괄적용(라벨, 선입고)
        /*var args = {
            targetid: "frmOption2", query: "", type: "TABLE", title: "",
            caption: false, show: true, selectable: true,
            editable: { bind: "select", focus: "label_tp", validate: true },
            content: {
                width: { label: 50, field: 60 }, height: 25,
                row: [
                    {
                        element: [
                          { header: true, value: "라벨", format: { type: "label" } },
                          {
                              name: "label_tp", align: "center"
                              , format: { type: "select", data: { memory: "라벨유형" } }
                              , editable: {
                                  type: "select", validate: { rule: "required" }
                                  , data: { memory: "라벨유형" }
                              }
                          },
                          { header: true, value: "선입고", format: { type: "label" } },
                          {
                              name: "direct_yn", align: "center",
                              format: { type: "checkbox", title: "", value: 1, offval: 0 },
                              editable: { type: "checkbox", title: "", value: 1, offval: 0 }
                          }
                        ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);*/

        //==== Main Form : 납품 정보
        var args = {
            targetid: "frmData_Main", type: "FREE", title: "납품 정보",
            caption: false, show: true, selectable: true, border: true, remark: "lyrRemark",trans:true,
            editable: { validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "div_no", label: { title: "납품 번호 : " },
                                editable: { type: "text", size: 20, maxlength: 10 }
                            },
                            {
                                name: "supp_nm", label: { title: "공급사 : " },
                                editable: { type: "text" ,size:20,maxlength:10}
                            },
                            {
                                name: "chk_user", label: { title: "검수자 : " },
                                editable: { type: "text", size: 20, maxlength: 10 }
                            },
                            {
                                name: "chk_dt", label: { title: "검수일시 : " },
                                editable: { type: "text", size: 20, maxlength: 10 }
                            }
                            
                          /*{ header: true, value: "납품번호", format: { type: "label" } },
                          { name: "dlv_no", editable: { type: "hidden" } },
                          { header: true, value: "공급사", format: { type: "label" } },
                          { name: "supp_nm", editable: { type: "hidden" } },
                          { name: "supp_cd", hidden: true, editable: { type: "hidden" } },
                          { name: "barcode_cnt", hidden: true },
                          { name: "regen_yn", hidden: true },
                          { header: true, value: "검수자", format: { type: "label" } },
                          { name: "chk_user", editable: { type: "hidden" } },
                          { header: true, value: "검수일시", format: { type: "label" } },
                          { name: "chk_dt", editable: { type: "hidden" } }*/
                        ]
                    },
                    {
                        element: [
                            {
                                name: "div_date", label: { title: "납품일자 : " }, mask: "date-ymd",
                                editable: { type: "text", size: 30 }
                            },
                            {
                                name: "div_user", label: { title: "담당자 : " },
                                editable: { type: "text" ,size:30}
                            },
                            {
                                name: "acp_user", label: { title: "인수자 : " },
                                editable: { type: "text",size:30 }
                            }


                          /*{ header: true, value: "납품일자", format: { type: "label" } },
                          {
                              name: "dlv_date", mask: "date-ymd",
                              editable: { type: "text", validate: { rule: "required" } }
                          },
                          { header: true, value: "담당자", format: { type: "label" } },
                          { name: "dlv_user", editable: { type: "text" } },
                          { header: true, value: "인수자", format: { type: "label" } },
                          { name: "acp_user", editable: { type: "hidden" } },
                          { header: true, value: "인계일시", format: { type: "label" } },
                          { name: "acp_dt", editable: { type: "hidden" } }*/
                        ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);

        //==== Sub Form : 납품 목록
        var args = {
            targetid: "grdData_Sub", title: "납품 목록",
            caption: true, height: "100%", pager: false, show: true, selectable: true, number: true,
            editable: { multi: true, bind: "select", focus: "dlv_qty", validate: true },
            element: [
                {
                    header: "발주번호", name: "pur_no", width: 60, align: "center"
                    , editable: { type: "hidden" }
                },
				{
				    header: "품번", name: "item_cd", width: 80, align: "center"
					, editable: { type: "hidden" }
				},
				{
				    header: "품명", name: "item_nm", width: 120, align: "left"
					, editable: { type: "hidden" }
				},
				{
				    header: "규격", name: "item_spec", width: 120, align: "left"
					, editable: { type: "hidden" }
				},
				{
				    header: "CheckBox", name: "track_no", width: 80, align: "center",
				    format:{type:"checkbox",title:""}//,value:"1",offval:"0"}
					//, editable: { type: "hidden" }
				},
				{
				    header: "Pallet No.", name: "pallet_no", width: 80, align: "center"
					, editable: { type: "hidden" }
				},
				{
				    header: "납기요청일", name: "req_date", width: 70, align: "center", mask: "date-ymd"
					, editable: { type: "hidden" }
				},
				{
				    header: "PO수량", name: "pur_qty", width: 50, align: "right"
					, editable: { type: "hidden" }
				},
				{
				    header: "단위", name: "pur_unit", width: 40, align: "center"
					, editable: { type: "hidden" }
				},
				{
				    header: "납품수량", name: "dlv_qty", width: 50, align: "right"
					, editable: { type: "text", validate: { rule: "required" } }
				},
				/*{
				    header: "라벨", name: "label_tp", width: 50, align: "center"
					, format: { type: "select", data: { memory: "라벨유형" } }
					, editable: {
					    type: "select", validate: { rule: "required" }
						, data: { memory: "라벨유형" }
					}
				},
				{
				    header: "선입고", name: "direct_yn", width: 30, align: "center"
					, format: { type: "checkbox", value: 1, offval: 0 }
					, editable: { type: "checkbox", value: 1, offval: 0 }
				}*/
            ]
        };
        gw_com_module.gridCreate(args);
        
        //==== Resize Objects
        var args = {
            target: [
                { type: "FORM", id: "frmData_Main", offset: 8 },
                { type: "GRID", id: "grdData_Sub", offset: 8 }
            ]
        };
        gw_com_module.objResize(args);
        gw_com_module.informSize();

    },
    
    //==== manage process. (program section)
    procedure: function () {
        
        gw_com_module.startPage();
        
    }
};