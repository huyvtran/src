//------------------------------------------
// Process about Intro Manager.
//                Created by Professor.X, GoodWare (2011.03.03)
//------------------------------------------

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// process.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var gw_intro_process = {

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // ready all for document.
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //#region
    ready: function (argMenu) {

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
        gw_com_module.v_Current.window = "IntroProcess";
        gw_com_module.v_Current.launch = "MAIN";

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set UI.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        var args = {
            targetid: "frmAuth",
            show: true
        };
        gw_com_module.formTrans(args);

        var args = {
            targetid: "frmAuth",
            trans: true
        };
        gw_com_module.formValidator(args);

        var args = {
            targetid: "btnAuth",
            event: "click",
            handler: click_btnAuth
        };
        gw_com_module.eventBind(args);

        //----------
        $.unblockUI();
        //----------
        gw_com_api.show("lyrMaster");
        if ($.browser.msie
            && $.browser.version.slice(0, 1) >= 8) { }
        else
            gw_com_api.show("lyrAlert");

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        function click_btnAuth() {

            var args = {
                targetid: "frmAuth"
            };
            if (gw_com_module.formValidate(args) == false) {
                return false;
            }

            //----------
            var args = {
                request: "PAGE",
                url: "../Service/svc_Auth.aspx" +
                        "?QUERY=w_plm_auth" +
			            "&arg_login_id=" + gw_com_api.getValue("frmAuth", 1, "login_id") +
			            "&arg_login_pw=" + gw_com_api.getValue("frmAuth", 1, "login_pw") +
			            "&arg_user_tp=SUPP",
                block: true,
                handler_success: successAuth
            };
            gw_com_module.callRequest(args);

            return false;

        };

        function successAuth(data) {

            /*
            var column = {
            login_id: 0,
            user_nm: 1,
            emp_no: 2,
            dept_cd: 3,
            dept_nm: 4,
            pos_cd: 5,
            pos_nm: 6
            };
            location.replace(
            "../Master/BizProcess.aspx" +
            "?USR_ID=" + data.DATA[column.login_id] +
            "&USR_NM=" + data.DATA[column.user_nm] +
            "&EMP_NO=" + data.DATA[column.emp_no] +
            "&DEPT_CD=" + data.DATA[column.dept_cd] +
            "&DEPT_NM=" + data.DATA[column.dept_nm] +
            "&POS_CD=" + data.DATA[column.pos_cd] +
            "&POS_NM=" + data.DATA[column.pos_nm]
            );
            */
            location.replace(
			    "../Master/SRMProcess.aspx"
			);

        };

    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//