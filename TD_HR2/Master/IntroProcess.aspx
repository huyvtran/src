<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Intro.master" AutoEventWireup="true"
    CodeFile="IntroProcess.aspx.cs" Inherits="Master_IntroProcess" %>
 
<asp:Content ID="objManagerHead" ContentPlaceHolderID="objMasterHead" runat="Server">
    <script src="js/intro.biz.js" type="text/javascript"></script>
     <link href="../Style/reset.css" rel="stylesheet" type="text/css" />
    <script type="text/javascript">
        $("document").ready(function () {

            //if ($.inArray("<%=pub_ip%>", ["14.47.64.47", "210.102.25.129"]) == -1 && location.host.split(".")[0].toUpperCase() == "INTRA") {
            //    alert("내부망에서만 접속이 가능합니다.\n<%=pub_ip%>");
            //    location.replace("http://gw.apsystems.co.kr");
            //    return;
            //} else {
                gw_intro_process.ready();
            //}

        });

    </script>
    <script type="text/css">
        .input_login {
                width: 120px;
                height: 17px;
                line-height: 14px;
                border: 1px solid #dddddd;
                background: #fff;
                font-family: Dotum;
                font-size: 12px;
                color: #323335;
                vertical-align: middle;
                margin: 0;
                padding: 0;
         }
    </script>
</asp:Content>
<asp:Content ID="objManagerContent" ContentPlaceHolderID="objMasterContent" runat="Server">
    <div id="lyrMaster" style="display: none;">
           <!-- APS login area start
             -->
        <form id="frmAuth" action="" >
             <div class="rowElem">

        <table width="878" border="0" cellspacing="0" cellpadding="0" height="100%" align="center">
                        <tr>
                          <td height="321"><img src="../style/images/master/main_login_top.jpg" alt="login_image" /></td>
                        </tr>
                        <tr>
                          <td height="70" align="center" style="padding-bottom:10px;">
                            <table width="486" border="0" cellspacing="0" cellpadding="0">
                              <tr>
                                <td width="145"><img src="../style/images/master/main_login_logo.gif" alt="Members Login"/></td>
                                <td width="35"><img src="../style/images/master/login_line.gif" alt="line"/></td>
                                <td width="306">
                                  <table width="281" border="0" cellspacing="0" cellpadding="0">
                                    <!-- 로그인 입력 시작 -->
					                <tr>
                                      <td width="32"><img src="../style/images/master/login_id.gif" alt="id" /></td>
                                      <td width="129" align="left">
                                       <input type="text" id="frmAuth_login_id" name="login_id" size="13" maxlength="20"
                                                 style="width: 120px; height: 17px;line-height: 14px;border: 1px solid #dddddd;background: #fff;font-family: Dotum;font-size: 12px;color: #323335;vertical-align: middle;margin: 0;padding: 0;" title="아이디" value="" />
                                      </td>
                                      <td width="120" align="left" valign="top">
					  	                <table width="100%" border="0" cellspacing="0" cellpadding="0">
						                  <tr>
							                <td width="20%" align="left">
						                        <!--span onFocus="this.blur()" style="border:0px;"><input id="CookieCheck" type="checkbox" name="CookieCheck" tabindex="3" /></!--span -->
							                </td>
							                <td width="80%" align="left" style="float:left; padding-top:3px;" valign="middle"><!-- ID Save --></td>
						                  </tr>
						                </table>
					                  </td>
                                    </tr>
					                <tr>
						                <td colspan="3" height="3"></td>
					                </tr>
                                    <tr>
                                      <td><img src="../style/images/master/login_pw.gif" alt="pass" /></td>
                                      <td align="left">
                                            <input type="password" id="frmAuth_login_pw" name="login_pw" size="13" maxlength="10"
                                                 style="width: 120px; height: 17px;line-height: 14px;border: 1px solid #dddddd;background: #fff;font-family: Dotum;font-size: 12px;color: #323335;vertical-align: middle;margin: 0;padding: 0;" title="비밀번호" value="" />
                                        <!--input name="txtuserpwd" type="password" id="txtuserpwd" tabindex="2" style="width: 120px; height: 17px;line-height: 14px;border: 1px solid #dddddd;background: #fff;font-family: Dotum;font-size: 12px;color: #323335;vertical-align: middle;margin: 0;padding: 0;" /-->
                                      </td>
                                      <td align="right">
                                           <button id="btnAuth" style="border: 0; margin: 0; padding: 0; background-color: Transparent;
                                cursor: pointer;">
                                <img src="../style/images/master/login_btn.gif" alt="로그인" /></button>
                                        <!-- input type="image" name="btnSubmit" id="btnSubmit" tabindex="3" src="../style/images/master/login_btn.gif" onclick="click_btnAuth(); return false;" style="border-width:0px;" /><!--이준희(2012-02-09): 크로스 브라우징 지원을 위해 클라이언트 이벤트만 발생시키고 중단시킴.-->
                                      </td>
                                      <td>
                                        <!--span style="display: none;"><!--이준희(2012-02-09): 크로스 브라우징 지원을 위해 이벤트 격발용 버튼을 은닉함.-->
					                        <!--input type="image"  name="btnSubmitAct" id="btnSubmitAct" src="" style="border-width:0px;" />
				                        </span -->
				                        &nbsp;
				                         
                                      </td>
                                    </tr>
					                <!-- 로그인 입력 끝 -->
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td height="50" align="center" valign="top"  style=" padding-top:10px;">
		  	                <!-- 환경설정 시작 --><!-- 환경설정 끝 -->
			                 <div id="hosturl">
			                 </div>
		                  </td>
                        </tr>
		                 <tr>
                          <td height="40"></td>
                        </tr>
                      </table>
                 </div>
            </form>
         <!-- APS login area end  -->

        <table width="100%" cellspacing="0" style="border-top: #D6D9DE solid 1px; padding: 0;
            margin: 0; white-space: nowrap;">
            <tr>
                <td align="right">

                    <!--img alt="ATTO" src="../style/images/master/biz_bottom.gif" /-->
                </td>
            </tr>
        </table>
    </div>
<!--
    <center><%=pub_ip%></center>
-->
</asp:Content>
