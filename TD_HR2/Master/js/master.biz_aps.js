//------------------------------------------
// Process about Biz Manager.
//                Created by Professor.X, GoodWare (2011.03.03)
//------------------------------------------

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
    login: function(param) {
    	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // login
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //----------
        $.blockUI();
        //----------
        gw_com_module.v_Current.user_id = gw_com_api.getParameter(param, "user_id");
        gw_com_module.v_Current.menu_id = gw_com_api.getParameter(param, "menu_id");

        var args = {
            request: "PAGE",
            url: "../Service/svc_Auth.aspx" +
                    "?QUERY=PLM_AUTH_ID" +
		            "&arg_login_id=" + gw_com_module.v_Current.user_id,
            block: true,
            handler_success: successAuth,
            handler_invalid: invalidAuth
        };
        gw_com_module.callRequest(args);
        //----------
        function successAuth(data) {

            window.location = location.protocol + "//" + location.host + "/Master/BizProcess.aspx";

        };
        //----------
        function invalidAuth(data) {

            window.opener = 'nothing';
            window.open('', '_parent', '');
            self.close();

        };
        //----------
    	
    }
    //#endregion

};
