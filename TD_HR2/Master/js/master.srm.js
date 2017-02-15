//------------------------------------------
// Process about Biz Manager.
//                Created by Professor.X, GoodWare (2011.03.03)
//------------------------------------------

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
var v_Session = {
    USR_ID: null,
    USR_NM: null,
    EMP_NO: null,
    DEPT_CD: null,
    DEPT_NM: null,
    POS_CD: null,
    POS_NM: null
};
//----------
var v_Current = {
    menu: null
};
//----------
var v_Job = {
};
//----------
var v_Menu = {
    obj: null,
    visible: true,
    title: [
		'수요예측 조회',
        '수요납기 등록',
        '발주서 조회',
        '납기 등록',
        '납품 등록',
        '납품 현황',
        '주문 대비<br>납품 현황',
        '안전재고 등록'],
    content: [
		"w_srm1050",
		"w_srm1055",
		"w_srm1030",
		"w_srm1031",
		"w_srm1040",
		"w_srm1041",
        "w_srm1042",
		"w_srm1011"]
};
//----------
var v_Tabs = { obj: null, id: null };
var v_Tab = { index: null, title: null, content: null, args: null };
//----------
var v_Option = {
    width: "1",
    theme_1: "1",
    theme_2: "1"
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
    before: function () {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // initialize page.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        /*
        if ($.browser.msie
            && $.browser.version.slice(0, 1) >= 8) { }
        else {
            gw_com_api.showMessage(
                "이 사이트는 IE 8.0 이상부터 최적화되어 있습니다.\n하위 버전에서 실행할 경우 일부 UI가 보이지 않거나 오동작이 발생할 수 있으므로 반드시 업그레이드 해 주세요.\n\n-> 확인을 클릭하시면 IE 8.0 다운로드 페이지로 이동합니다."
            );
            location.replace("http://windows.microsoft.com/ko-KR/internet-explorer/downloads/ie-8");
        }
        */
        //----------
        $.blockUI();
        //----------
        gw_com_module.v_Current.window = "BizProcess";
        gw_com_module.v_Current.launch = "MAIN";
        //----------
        var args = {
            type: "PAGE",
            page: "MsgProcess",
            path: "../Master/",
            title: "PLM Message",
            width: 420,
            height: 130
        };
        gw_com_module.dialoguePrepare(args);
        /*
        v_Session.USR_ID = gw_com_api.getPageParameter("USR_ID");
        v_Session.USR_NM = gw_com_api.getPageParameter("USR_NM");
        v_Session.EMP_NO = gw_com_api.getPageParameter("EMP_NO");
        v_Session.DEPT_CD = gw_com_api.getPageParameter("DEPT_CD");
        v_Session.DEPT_NM = gw_com_api.getPageParameter("DEPT_NM");
        v_Session.POS_CD = gw_com_api.getPageParameter("POS_CD");
        v_Session.POS_NM = gw_com_api.getPageParameter("POS_NM");
        */

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set data.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        var args = {
            request: [
				{
				    type: "INLINE", name: "page_width",
				    data: [
						{ title: "고정", value: "1" },
						{ title: "자동 늘임", value: "2" }
					]
				},
				{
				    type: "INLINE", name: "master_style",
				    data: [
						{ title: "기본", value: "1" },
						{ title: "Blue", value: "2" },
						{ title: "Orange", value: "3" }
					]
				},
				{
				    type: "INLINE", name: "sub_style",
				    data: [
						{ title: "기본", value: "1" },
						{ title: "Blue", value: "2" },
						{ title: "Orange", value: "3" }
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

            gw_job_process.ready();

        }

    },
    //#endregion

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // ready all for document.
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //#region
    ready: function () {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set UI.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        var args = {
            request: "PAGE",
            url: "../Service/svc_Session.aspx",
            handler_success: successSession,
            handler_invalid: invalidSession
        };
        gw_com_module.callRequest(args);
        //----------
        function successSession(data) {

            v_Session.USR_ID = data.USR_ID;
            v_Session.USR_NM = data.USR_NM;
            v_Session.EMP_NO = data.EMP_NO;
            v_Session.DEPT_CD = data.DEPT_CD;
            v_Session.DEPT_NM = data.DEPT_NM;
            v_Session.POS_CD = data.POS_CD;
            v_Session.POS_NM = data.POS_NM;

            var content =
                "<span style='font-family: 맑은 고딕; font-weight: normal; border-bottom: 1px solid #777777; color: #000000;'>" +
                "▷ 협력사 【 " +
                "<span style='font-family: 맑은 고딕; font-size:10pt; font-weight: bold;'>" +
                v_Session.USR_NM + "</span> 】 " + "님" +
                "이 로그인 중입니다." +
                "</span>";
            $("#lyrInfo").html(content);

            var args = {
                targetid: "srmMenu"
            };
            gw_job_process.buildMenu(args);
            gw_job_process.buildTab("#tabs");

            /**/
            //=====================================================================================
            var args = {
                targetid: "frmOption",
                type: "FREE",
                trans: true,
                show: false,
                border: true,
                editable: {
                    focus: "page_width"
                },
                content: {
                    row: [
                        {
                            element: [
                                {
                                    name: "page_width",
                                    label: {
                                        title: "페이지 폭 :"
                                    },
                                    editable: {
                                        type: "select",
                                        data: {
                                            memory: "page_width"
                                        }
                                    }
                                },
                                {
                                    name: "master_style",
                                    label: {
                                        title: "메인 테마 :"
                                    },
                                    editable: {
                                        type: "select",
                                        data: {
                                            memory: "master_style"
                                        }
                                    }
                                },
                                {
                                    name: "sub_style",
                                    label: {
                                        title: "서브 테마 :"
                                    },
                                    editable: {
                                        type: "select",
                                        data: {
                                            memory: "sub_style"
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            align: "right",
                            element: [
                                {
                                    name: "적용",
                                    value: "적용",
                                    act: true,
                                    format: {
                                        type: "button",
                                        icon: "실행"
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
            /**/
            //----------
            gw_com_api.show("lyrMaster");
            /**/
            //----------
            gw_com_module.formCreate(args);
            //----------
            var args = {
                targetid: "frmOption",
                element: "적용",
                event: "click",
                handler: click_frmOption_적용
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
            /**/
            //----------
            $.unblockUI();

        }
        //----------
        function invalidSession(data) {

            location.replace(
			    "../Master/SRMIntro.aspx"
			);

        }

        //----------
        var args = {
            request: "PAGE",
            url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
                    "?QRY_ID=w_srm_notice" +
                    "&QRY_COLS=nt_title,fr_date" +
			        "&CRUD=R",
            handler_success: successNotice
        };
        gw_com_module.callRequest(args);
        //----------
        function successNotice(data) {

            var column = {
                nt_title: 0,
                fr_date: 1
            };
            var content = "";
            $.each(data, function (i) {
                content = content +
                    "<tr>" +
                    "<td width='275px' align='left'>" +
                    this.DATA[column.nt_title] +
                    "</td>" +
                    "<td width='100px' align='right'>" +
                    this.DATA[column.fr_date] +
                    "</td>" +
                    "</tr>";
            });
            $("#tblNotice").html(content);

        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // process event.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        var args = {
            targetid: "imgMenu",
            event: "click",
            handler: click_imgMenu
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "imgNotice",
            event: "click",
            handler: click_imgNotice
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "btnHome",
            event: "click",
            handler: click_btnHome
        };
        gw_com_module.eventBind(args);
        /**/
        //----------
        var args = {
            targetid: "btnOption",
            event: "click",
            handler: click_btnOption
        };
        gw_com_module.eventBind(args);
        /**/
        //----------
        var args = {
            targetid: "btnInfo",
            event: "click",
            handler: click_btnInfo
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "btnNotice",
            event: "click",
            handler: click_imgNotice
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "btnHelp",
            event: "click",
            handler: click_btnHelp
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "btnLeave",
            event: "click",
            handler: click_btnLeave
        };
        gw_com_module.eventBind(args);

        //----------
        function click_imgMenu() {

            var args = {
                target: [
            {
                id: "srmMenu"
            }
            ]
            };
            gw_com_module.objToggle(args);

        }
        //----------
        function click_imgNotice() {

            //----------
            var args = {
                type: "PAGE",
                page: "w_srm9020",
                title: "공지시항 조회",
                width: 800,
                height: 600,
                open: true
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = {
                    page: "w_srm9020",
                    param: {
                        ID: gw_com_api.v_Stream.msg_myNotice
                    }
                };
                gw_com_module.dialogueOpen(args);
            }

        }
        //----------
        function click_btnHome() {

            if (v_Tabs.obj.tabs("length") > 0) {
                if (!confirm("모든 페이지를 닫고 메인 페이지로 이동합니다.\n계속 하시겠습니까?"))
                    return false;
            }
            var count = v_Tabs.obj.tabs("length");
            for (var i = count - 1; i >= 0; i--)
                v_Tabs.obj.tabs("remove", i);
            gw_com_api.show("lyrNotice");

        }
        //----------
        function click_btnOption() {

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
        function click_btnInfo() {

            //----------
            var args = {
                type: "PAGE",
                page: "w_srm9010",
                title: "협력사 정보",
                width: 700,
                height: 466,
                open: true
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = {
                    page: "w_srm9010",
                    param: {
                        ID: gw_com_api.v_Stream.msg_myInformation,
                        data: {
                            key: v_Session.USR_ID
                        }
                    }
                };
                gw_com_module.dialogueOpen(args);
            }

        }
        //----------
        function click_btnHelp() {

        }
        //----------
        function click_btnLeave() {

            //----------
            var args = {
                request: "PAGE",
                url: "../Service/svc_Session.aspx?SESSION=OUT",
                block: true,
                handler_success: successLeave
            };
            gw_com_module.callRequest(args);

        }
        //----------
        function click_frmOption_적용(ui) {

            v_Option.theme_1 = gw_com_api.getValue("frmOption", 1, "master_style");
            gw_com_api.changeTheme("style_theme", v_Option.theme_1);
            v_Option.theme_2 = gw_com_api.getValue("frmOption", 1, "sub_style");
            gw_com_api.hide("frmOption");

        }
        //----------
        function click_frmOption_취소(ui) {

            gw_com_api.hide("frmOption");
        }

        //----------
        function successLeave(data) {

            alert("정상적으로 로그아웃 되었습니다.\n로그인 페이지로 이동합니다.");
            location.replace(
			    "../Master/SRMIntro.aspx"
			);

        }

    },
    //#endregion

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // common module. (process menu)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // build menu.
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //#region
    //----------
    buildMenu: function (args) {

        v_Menu.obj
			= $("#" + args.targetid).AjaxFlagMenu({
			    Caption: 'Menu',
			    CaptionClass: 'srmMenu_caption',
			    onOutClass: 'srmMenu_out',
			    onOverClass: 'srmMenu_over',
			    onClickClass: 'srmMenu_click',
			    ajaxContent: 'ajaxContent'
			});

        $.each(v_Menu.title, function (i) {
            var image = gw_com_api.getResource("MASTER", "srmMenu_" + i, "png");
            v_Menu.obj.add({
                Title: this,
                onOutIcon: image,
                onOverIcon: image,
                onClickIcon: image,
                HtmlSatusContent: '0',
                url: '../Job/' + v_Menu.content[i] + '.aspx',
                data: v_Menu.content[i]
            });
        });

    },
    //#endregion

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // build tab.
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //#region
    //----------
    buildTab: function (argTab) {

        v_Tabs.id = argTab;
        v_Tabs.obj
		    = $(argTab).tabs({
		        tabTemplate: "<li><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close'>Remove Tab</span></li>",
		        add: function (event, ui) {
		            gw_com_api.hide("lyrNotice");
		            var page = "page_" + v_Tab.index;
		            var key = "";
		            if (v_Job.HCEM != undefined) {
		                $.each(v_Job.HCEM, function (i) {
		                    key = key +
		                        "&" + this.name + "=" + this.value
		                });
		            }
		            var content =
					    "<iframe" +
						    " id='" + page + "'" +
						    " src='" + v_Tab.content +
						        "?USR_ID=" + v_Session.USR_ID +
	                            "&USR_NM=" + v_Session.USR_NM +
	                            "&EMP_NO=" + v_Session.EMP_NO +
	                            "&DEPT_CD=" + v_Session.DEPT_CD +
	                            "&DEPT_NM=" + v_Session.DEPT_NM +
	                            "&POS_CD=" + v_Session.POS_CD +
	                            "&POS_NM=" + v_Session.POS_NM +
							    "&NAME=" + v_Tab.index +
							    "&LAUNCH=CHILD" +
							    "&TYPE=MAIN" +
							    "&PAGE=BizProcess" +
							    "&STYLE=" + v_Option.theme_2 +
							    key +
							    ((v_Tab.args != null && v_Tab.args != "") ? "&PARAM=true" + v_Tab.args : "") +
						    "'" +
						    " width='100%'" +
						    " height='550px'" +
						    " frameborder='yes' scrolling='no' marginheight=0 marginwidth=0" +
					    ">" +
					    "</iframe>";
		            $(ui.panel).append(content);
		        },
		        remote: true,
		        cache: true,
		        ajaxOptions: { async: true },
		        collapsible: false
		    });

        $(argTab + " span.ui-icon-close").live("click", function () {
            var index = $("li", v_Tabs.obj).index($(this).parent());
            v_Tabs.obj.tabs("remove", index);
            if (v_Tabs.obj.tabs("length") == 0)
                gw_com_api.show("lyrNotice");
        });

    },
    //----------
    processTab: function (index, title, content, args) {

        v_Tab.index = index;
        v_Tab.title = title;
        v_Tab.content = content;
        v_Tab.args = args;

        var tab_index = v_Tabs.id + "-" + index;
        if ($(tab_index).html() != null) {
            v_Tabs.obj.tabs('select', tab_index);
        }
        else {
            v_Tabs.obj.tabs("add", tab_index, title);
            v_Tabs.obj.tabs('select', tab_index);
        }

    },
    //----------
    linkTab: function (index, title, content, args) {

        v_Tab.index = index;
        v_Tab.title = title;
        v_Tab.content = content;
        v_Tab.args = args;

        var tab_index = v_Tabs.id + "-" + index;
        if ($(tab_index).html() != null) {
            this.closeTab(index);
        }
        v_Tabs.obj.tabs("add", tab_index, title);
        v_Tabs.obj.tabs('select', tab_index);

    },
    //----------
    closeTab: function (index) {
        var tab_index = v_Tabs.id + "-" + index;
        v_Tabs.obj.tabs("remove", tab_index);
        if (v_Tabs.obj.tabs("length") == 0)
            gw_com_api.show("lyrNotice");
    }
    // #endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// process stream.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
getSession = function () {

    return v_Session;

};
//----------
resizeFrame = function (args) {

    if (args.id == "MsgProcess" && args.height > 0) {
        var param = {
            page: "MsgProcess",
            name: "height",
            value: args.height + 40
        };
        gw_com_module.dialogueSet(param);
        var args = {
            page: "MsgProcess",
            name: "position",
            value: ["center"]
        };
        gw_com_module.dialogueSet(args);
    }
    else if (args.id == "w_srm9020" && args.height > 0) {
        var param = {
            page: "w_srm9020",
            name: "height",
            value: args.height + 40
        };
        gw_com_module.dialogueSet(param);
        var args = {
            page: "w_srm9020",
            name: "position",
            value: ["center"]
        };
        gw_com_module.dialogueSet(args);
    }
    else {
        //alert(args.height);
        if (args.height < 550) args.height = 545;
        $("#page_" + args.id).attr("height", args.height + 5);
    }

};
//----------
function closeDialogue(page, focus) {

    var args = {
        page: page
    };
    gw_com_module.dialogueClose(args);

}
//----------
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_linkPage:
            {
                var arg = "";
                if (param.data.param != undefined) {
                    $.each(param.data.param, function () {
                        arg = arg +
                            "&" + this.name + "=" + this.value;
                    });
                }
                gw_job_process.linkTab(
				            param.data.page,
				            param.data.title,
				            "../job/" + param.data.page + ".aspx",
				            arg);
            }
            break;
        case gw_com_api.v_Stream.msg_closePage:
            {
                gw_job_process.closeTab(param.from.page);
            }
            break;
        case gw_com_api.v_Stream.msg_showMessage:
            {
                var args = {
                    page: "MsgProcess",
                    name: "width",
                    value: (param.data.width != undefined) ? param.data.width : 420
                };
                gw_com_module.dialogueSet(args);
                var args = {
                    page: "MsgProcess",
                    param: {
                        ID: param.data.ID,
                        data: {
                            from: param.from.page,
                            page: param.data.page,
                            type: param.data.type,
                            message: param.data.message,
                            arg: param.data.arg
                        }
                    }
                };
                gw_com_module.dialogueOpen(args);
            }
            break;
        case gw_com_api.v_Stream.msg_resultMessage:
            {
                closeDialogue(param.from.page);
                var args = {
                    to: {
                        page: param.data.to
                    },
                    ID: param.ID,
                    data: {
                        ID: param.data.ID,
                        page: param.data.page,
                        arg: param.data.arg,
                        result: param.data.result
                    }
                };
                gw_com_module.streamInterface(args);
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
                    case "w_srm9010":
                        {
                            args.ID = gw_com_api.v_Stream.msg_myInformation;
                            args.data = {
                                key: v_Session.USR_ID
                            };
                        }
                        break;
                    case "w_srm9020":
                        {
                            args.ID = gw_com_api.v_Stream.msg_myNotice;
                        }
                        break;
                }
                gw_com_module.streamInterface(args);
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                closeDialogue(param.from.page);
            }
            break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//