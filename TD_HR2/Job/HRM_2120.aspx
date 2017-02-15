<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="HRM_2120.aspx.cs" Inherits="Job_HRM_2120" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <!--link href="../Style/other/public.css" rel="stylesheet" type="text/css" /-->
    <link href="../Style/other/cal.css" rel="stylesheet" type="text/css" />
    <!--link href="../Style/other/type_a.css" rel="stylesheet" type="text/css" /-->
    <script src="js/HRM.2120.js?ver=20160119_1" type="text/javascript"></script>
    <script type="text/javascript">

        $(function () {

            gw_job_process.ready();

        });
        
    </script>
</asp:Content>
<asp:Content ID="Content8" ContentPlaceHolderID="objContentOption" runat="Server">
</asp:Content>
<asp:Content ID="Content7" ContentPlaceHolderID="objContentMenu" runat="Server">
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td width="50%">
                <div id="lyrRemark2"></div>
            </td>
            <td width="" align="right">
                <div id="lyrMenu"></div>
            </td>
        </tr>
    </table>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentToggle" runat="Server">
    <form id="frmOption" action="">
    </form>
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="objContentRemark" runat="Server">
    <div id="lyrRemark">
    </div>
</asp:Content>
<asp:Content ID="Content9" ContentPlaceHolderID="objContentData" runat="Server">
    <div id="grdList_MAIN"></div>
    <div id="frmMAIN_2013" style="display:none">
	    <table class="small_table_03" cellspacing="0" cellpadding="0" width="100%" border="0">
		    <tbody>
			    <tr>
				    <td class="small_bg_gray" colspan="4">과세대상급여</td>
				    <td class="small_num" width="150"><span id="13_col01_00"></span> 원 </td>
			    </tr>
			    <tr>
				    <td colspan="4">근로소득공제</td>
				    <td class="small_num"><span id="13_col02_00"></span> 원 </td>
			    </tr>
			    <tr>
				    <td class="small_bg_gray" colspan="4">근로소득금액</td>
				    <td class="small_num"><span id="13_col03_00"></span> 원 </td>
			    </tr>
			    <tr>
				    <td class="small_bg_titl" rowspan="3">기본공제</td>
				    <td colspan="2">본인</td>
				    <td>&nbsp;</td>
				    <td class="small_num"><span id="13_col04_01"></span> 원 </td>
			    </tr>
			    <tr>
				    <td colspan="2">배우자</td>
				    <td>&nbsp;</td>
				    <td class="small_num"><span id="13_col04_02"></span> 원 </td>
			    </tr>
			    <tr>
				    <td colspan="2">부양가족</td>
				    <td class="small_num"><span id="13_col04_03"></span> 명</td>
				    <td class="small_num"><span id="13_col04_04"></span> 원 </td>
			    </tr>
			    <tr>
				    <td class="small_bg_titl" rowspan="6">추가공제</td>
				    <td colspan="2">경로우대(70세 이상)</td>
				    <td class="small_num"><span id="13_col04_05"></span> 명</td>
				    <td class="small_num"><span id="13_col04_06"></span> 원 </td>
			    </tr>
			    <tr>
				    <td colspan="2">장애인</td>
				    <td class="small_num"><span id="13_col04_07"></span> 명</td>
				    <td class="small_num"><span id="13_col04_08"></span> 원 </td>
			    </tr>
			    <tr>
				    <td colspan="2">부녀자</td>
				    <td>&nbsp;</td>
				    <td class="small_num"><span id="13_col04_09"></span> 원 </td>
			    </tr>
			    <tr>
				    <td colspan="2">6세 이하 양육비공제</td>
				    <td class="small_num"><span id="13_col04_10"></span> 명</td>
				    <td class="small_num"><span id="13_col04_11"></span> 원 </td>
			    </tr>
			    <tr>
				    <td colspan="2">출산·입양자 공제</td>
				    <td class="small_num"><span id="13_col04_12"></span> 명</td>
				    <td class="small_num"><span id="13_col04_13"></span> 원 </td>
			    </tr>
			    <tr>
				    <td colspan="2">한부모 공제</td>
				    <td>&nbsp;</td>
				    <td class="small_num"><span id="13_col04_14"></span> 원 </td>
			    </tr>
			    <tr>
				    <td class="small_bg_gray" colspan="3">다자녀추가공제</td>
				    <td class="small_num"><span id="13_col05_01"></span> 원 </td>
				    <td class="small_num"><span id="13_col05_00"></span> 원 </td>
			    </tr>
			    <tr>
				    <td class="small_bg_titl" rowspan="3">연금보험료공제</td>
				    <td colspan="2">국민연금보험료</td>
				    <td class="small_num">&nbsp;</td>
				    <td class="small_num"><span id="13_col06_01"></span> 원 </td>
			    </tr>
			    <tr>
				    <td colspan="2">기타연금보험료</td>
				    <td>&nbsp;</td>
				    <td class="small_num"><span id="13_col06_02"></span> 원 </td>
			    </tr>
			    <tr>
				    <td colspan="2">연금계좌</td>
				    <td>&nbsp;</td>
				    <td class="small_num"><span id="13_col06_03"></span> 원 </td>
			    </tr>
			    <tr>
				    <td class="small_bg_titl" rowspan="18">특별공제</td>
				    <td rowspan="3">보험료</td>
				    <td>장애인전용</td>
				    <td>&nbsp;</td>
				    <td class="small_num"><span id="13_col07_01"></span> 원 </td>
			    </tr>
			    <tr>
				    <td>기타</td>
				    <td>&nbsp;</td>
				    <td class="small_num"><span id="13_col07_02"></span> 원 </td>
			    </tr>
			    <tr>
				    <td>소계</td>
				    <td>&nbsp;</td>
				    <td class="small_num"><span id="13_col07_00"></span> 원 </td>
			    </tr>
			    <tr>
				    <td rowspan="3">의료비</td>
				    <td>장애인</td>
				    <td>&nbsp;</td>
				    <td class="small_num"><span id="13_col07_11"></span> 원 </td>
			    </tr>
			    <tr>
				    <td>기타</td>
				    <td>&nbsp;</td>
				    <td class="small_num"><span id="13_col07_12"></span> 원 </td>
			    </tr>
			    <tr>
				    <td>소계</td>
				    <td>&nbsp;</td>
				    <td class="small_num"><span id="13_col07_10"></span> 원 </td>
			    </tr>
			    <tr>
				    <td rowspan="3">교육비</td>
				    <td>장애인</td>
				    <td>&nbsp;</td>
				    <td class="small_num"><span id="13_col07_21"></span> 원 </td>
			    </tr>
			    <tr>
				    <td>기타</td>
				    <td>&nbsp;</td>
				    <td class="small_num"><span id="13_col07_22"></span> 원 </td>
			    </tr>
			    <tr>
				    <td>소계</td>
				    <td>&nbsp;</td>
				    <td class="small_num"><span id="13_col07_20"></span> 원 </td>
			    </tr>
			    <tr>
				    <td rowspan="3">주택자금공제</td>
				    <td>주택임차차입금<br />원리금상환액</td>
				    <td>&nbsp;</td>
				    <td class="small_num"><span id="13_col07_31"></span> 원 </td>
			    </tr>
			    <tr>
				    <td>월세액</td>
				    <td>&nbsp;</td>
				    <td class="small_num"><span id="13_col07_32"></span> 원 </td>
			    </tr>
			    <tr>
				    <td>장기주택저당차입금 이자상환액</td>
				    <td>&nbsp;</td>
				    <td class="small_num"><span id="13_col07_33"></span> 원 </td>
			    </tr>
			    <tr>
				    <td rowspan="5">기부금</td>
				    <td>정치자금기부금</td>
				    <td>&nbsp;</td>
				    <td class="small_num"><span id="13_col07_41"></span> 원 </td>
			    </tr>
			    <tr>
				    <td>법정기부금</td>
				    <td>&nbsp;</td>
				    <td class="small_num"><span id="13_col07_42"></span> 원 </td>
			    </tr>
			    <tr>
				    <td>우리사주조합기부금</td>
				    <td>&nbsp;</td>
				    <td class="small_num"><span id="13_col07_43"></span> 원 </td>
			    </tr>
			    <tr>
				    <td>지정기부금</td>
				    <td>&nbsp;</td>
				    <td class="small_num"><span id="13_col07_44"></span> 원 </td>
			    </tr>
			    <tr>
				    <td>소계</td>
				    <td>&nbsp;</td>
				    <td class="small_num"><span id="13_col07_40"></span> 원 </td>
			    </tr>
			    <tr>
				    <td class="small_bg_gray" colspan="3">계 (또는 표준공제)</td>
				    <td class="small_num"><span id="13_col07_90"></span> 원 </td>
			    </tr>
			    <tr>
				    <td class="small_bg_gray" colspan="4">차감소득금액</td>
				    <td class="small_num"><span id="13_col08_00"></span> 원 </td>
			    </tr>
			    <tr>
				    <td class="small_bg_titl" rowspan="8">그밖의 소득공제</td>
				    <td colspan="2">개인연금저축</td>
				    <td class="small_num">&nbsp;</td>
				    <td class="small_num"><span id="13_col09_01"></span> 원 </td>
			    </tr>
			    <tr>
				    <td colspan="2">주택마련저축</td>
				    <td>&nbsp;</td>
				    <td class="small_num"><span id="13_col09_02"></span> 원 </td>
			    </tr>
			    <tr>
				    <td colspan="2">신용카드 등 사용금액</td>
				    <td>&nbsp;</td>
				    <td class="small_num"><span id="13_col09_03"></span> 원 </td>
			    </tr>
			    <tr>
				    <td rowspan="5">기타 공제</td>
				    <td>소기업ㆍ소상공인 공제부금 소득공제</td>
				    <td>&nbsp;</td>
				    <td class="small_num"><span id="13_col09_11"></span> 원 </td>
			    </tr>
			    <tr>
				    <td>투자조합 출자공제</td>
				    <td>&nbsp;</td>
				    <td class="small_num"><span id="13_col09_12"></span> 원 </td>
			    </tr>
			    <tr>
				    <td>우리사주출연금소득공제</td>
				    <td>&nbsp;</td>
				    <td class="small_num"><span id="13_col09_13"></span> 원 </td>
			    </tr>
			    <tr>
				    <td>고용유지 중소기업 근로자 소득공제</td>
				    <td>&nbsp;</td>
				    <td class="small_num"><span id="13_col09_14"></span> 원 </td>
			    </tr>
			    <tr>
				    <td>목돈 안드는 전세 이자상환액 공제</td>
				    <td>&nbsp;</td>
				    <td class="small_num"><span id="13_col09_15"></span> 원 </td>
			    </tr>
			    <tr>
				    <td class="small_bg_gray" colspan="4">특별공제 종합한도 초과액</td>
				    <td class="small_num"><span id="13_col10_00"></span> 원 </td>
			    </tr>
			    <tr>
				    <td class="small_bg_gray" colspan="4">종합소득과세표준</td>
				    <td class="small_num"><span id="13_col11_00"></span> 원 </td>
			    </tr>
			    <tr>
				    <td class="small_bg_gray" colspan="4">산출세액</td>
				    <td class="small_num"><span id="13_col12_00"></span> 원 </td>
			    </tr>
			    <tr>
				    <td class="small_bg_titl" rowspan="10">세액감면 및 세액공제</td>
				    <td rowspan="4">세액감면</td>
				    <td>소득세법</td>
				    <td>&nbsp;</td>
				    <td class="small_num"><span id="13_col13_01"></span> 원 </td>
			    </tr>
			    <tr>
				    <td>조세특례제한법</td>
				    <td>&nbsp;</td>
				    <td class="small_num"><span id="13_col13_02"></span> 원 </td>
			    </tr>
			    <tr>
				    <td>조세조약</td>
				    <td>&nbsp;</td>
				    <td class="small_num"><span id="13_col13_03"></span> 원 </td>
			    </tr>
			    <tr>
				    <td class="small_bg_gray" colspan="2">감면세액계</td>
				    <td class="small_num"><span id="13_col13_00"></span> 원 </td>
			    </tr>
			    <tr>
				    <td rowspan="6">세액공제</td>
				    <td>근로소득세액공제</td>
				    <td>&nbsp;</td>
				    <td class="small_num"><span id="13_col13_11"></span> 원 </td>
			    </tr>
			    <tr>
				    <td>납세조합공제</td>
				    <td>&nbsp;</td>
				    <td class="small_num"><span id="13_col13_12"></span> 원 </td>
			    </tr>
			    <tr>
				    <td>주택차입금</td>
				    <td>&nbsp;</td>
				    <td class="small_num"><span id="13_col13_13"></span> 원 </td>
			    </tr>
			    <tr>
				    <td>기부정치자금</td>
				    <td>&nbsp;</td>
				    <td class="small_num"><span id="13_col13_14"></span> 원 </td>
			    </tr>
			    <tr>
				    <td>외국납부</td>
				    <td>&nbsp;</td>
				    <td class="small_num"><span id="13_col13_15"></span> 원 </td>
			    </tr>
			    <tr>
				    <td class="small_bg_gray" colspan="2">세액공제계</td>
				    <td class="small_num"><span id="13_col13_10"></span> 원 </td>
			    </tr>
			    <tr>
				    <td style="HEIGHT: 130px; VERTICAL-ALIGN: middle; PADDING-TOP: 10px" colspan="5">
					    <table id="small_table_04" cellspacing="0" cellpadding="0" width="100%" border="0">
						    <tbody>
							    <tr>
								    <td class="small_bg_gray" width="145">&nbsp;</td>
								    <td class="small_bg_gray" width="170" align="center">소득세</td>
								    <td class="small_bg_gray" width="170" align="center">지방소득세</td>
								    <td class="small_bg_gray" width="170" align="center">농어촌특별세</td>
							    </tr>
							    <tr>
								    <td class="small_bg_gray">결정세액</td>
								    <td class="small_num"><span id="13_col14_01"></span> 원 </td>
								    <td class="small_num"><span id="13_col14_02"></span> 원 </td>
								    <td class="small_num"><span id="13_col14_03"></span> 원 </td>
							    </tr>
							    <tr>
								    <td class="small_bg_gray">기납부세액</td>
								    <td class="small_num"><span id="13_col14_11"></span> 원 </td>
								    <td class="small_num"><span id="13_col14_12"></span> 원 </td>
								    <td class="small_num"><span id="13_col14_13"></span> 원</td>
							    </tr>
							    <tr>
								    <td class="small_bg_gray">차감징수세액</td>
								    <td class="small_num"><span id="13_col14_21"></span> 원 </td>
								    <td class="small_num"><span id="13_col14_22"></span> 원 </td>
								    <td class="small_num"><span id="13_col14_23"></span> 원 </td>
							    </tr>
						    </tbody>
					    </table>
				    </td>
			    </tr>
		    </tbody>
	    </table>
    </div>
    <div id="frmMAIN_2014" style="display:none;">
        <table id="small_table_03" cellspacing="0" cellpadding="0" width="100%" border="0">
            <tbody>
                <tr>
                    <td class="small_bg_gray" colspan="4">과세대상급여</td>
                    <td class="small_num"><span id="col001"></span> 원 </td>
                </tr>
                <tr>
                    <td colspan="4">근로소득공제</td>
                    <td class="small_num"><span id="col002"></span> 원 </td>
                </tr>
                <tr>
                    <td class="small_bg_gray" colspan="4">근로소득금액</td>
                    <td class="small_num"><span id="col003"></span> 원 </td>
                </tr>
                <tr>
                    <td class="small_bg_titl" rowspan="3">기본공제</td>
                    <td colspan="2">본인</td>
                    <td>&nbsp;</td>
                    <td class="small_num"><span id="col004"></span> 원 </td>
                </tr>
                <tr>
                    <td colspan="2">배우자</td>
                    <td>&nbsp;</td>
                    <td class="small_num"><span id="col005"></span> 원 </td>
                </tr>
                <tr>
                    <td colspan="2">부양가족</td>
                    <td class="small_num"><span id="col006"></span> 명 </td>
                    <td class="small_num"><span id="col007"></span> 원 </td>
                </tr>
                <tr>
                    <td class="small_bg_titl" rowspan="4">추가공제</td>
                    <td colspan="2">경로우대(70세 이상)</td>
                    <td class="small_num"><span id="col008"></span> 명 </td>
                    <td class="small_num"><span id="col009"></span> 원 </td>
                </tr>
                <tr>
                    <td colspan="2">장애인</td>
                    <td class="small_num"><span id="col010"></span> 명 </td>
                    <td class="small_num"><span id="col011"></span> 원 </td>
                </tr>
                <tr>
                    <td colspan="2">부녀자</td>
                    <td>&nbsp;</td>
                    <td class="small_num"><span id="col012"></span> 원 </td>
                </tr>
                <tr>
                    <td colspan="2">한부모 공제</td>
                    <td>&nbsp;</td>
                    <td class="small_num"><span id="col013"></span> 원 </td>
                </tr>
                <tr>
                    <td class="small_bg_titl" rowspan="2">연금보험료공제</td>
                    <td colspan="2">국민연금보험료</td>
                    <td class="small_num">&nbsp;</td>
                    <td class="small_num"><span id="col014"></span> 원 </td>
                </tr>
                <tr>
                    <td colspan="2">기타연금보험료</td>
                    <td>&nbsp;</td>
                    <td class="small_num"><span id="col015"></span> 원 </td>
                </tr>
                <tr>
                    <td class="small_bg_titl" rowspan="5">특별소득공제</td>
                    <td>보험료</td>
                    <td>건강 등.고용보험료</td>
                    <td>&nbsp;</td>
                    <td class="small_num"><span id="col016"></span> 원 </td>
                </tr>
                <tr>
                    <td rowspan="2">주택자금공제</td>
                    <td>주택임차차입금 원리금상환액</td>
                    <td>&nbsp;</td>
                    <td class="small_num"><span id="col017"></span> 원 </td>
                </tr>
                <tr>
                    <td>장기주택저당차입금 이자상환액</td>
                    <td>&nbsp;</td>
                    <td class="small_num"><span id="col018"></span> 원 </td>
                </tr>
                <tr>
                    <td>기부금</td>
                    <td>이월분</td>
                    <td>&nbsp;</td>
                    <td class="small_num"><span id="col019"></span> 원 </td>
                </tr>
                <tr>
                    <td class="small_bg_gray" colspan="3">계</td>
                    <td class="small_num"><span id="col020"></span> 원 </td>
                </tr>
                <tr>
                    <td class="small_bg_gray" colspan="4">차감소득금액</td>
                    <td class="small_num"><span id="col021"></span> 원 </td>
                </tr>
                <tr>
                    <td class="small_bg_titl" rowspan="10">그밖의 소득공제</td>
                    <td colspan="2">개인연금저축</td>
                    <td class="small_num">&nbsp;</td>
                    <td class="small_num"><span id="col022"></span> 원 </td>
                </tr>
                <tr>
                    <td colspan="2">주택마련저축</td>
                    <td>&nbsp;</td>
                    <td class="small_num"><span id="col023"></span> 원 </td>
                </tr>
                <tr>
                    <td colspan="2">신용카드 등 사용금액</td>
                    <td>&nbsp;</td>
                    <td class="small_num"><span id="col024"></span> 원 </td>
                </tr>
                <tr>
                    <td rowspan="7">기타 공제</td>
                    <td>소기업ㆍ소상공인 공제부금 소득공제</td>
                    <td>&nbsp;</td>
                    <td class="small_num"><span id="col025"></span> 원 </td>
                </tr>
                <tr>
                    <td>투자조합 출자공제</td>
                    <td>&nbsp;</td>
                    <td class="small_num"><span id="col026"></span> 원 </td>
                </tr>
                <tr>
                    <td>우리사주출연금소득공제</td>
                    <td>&nbsp;</td>
                    <td class="small_num"><span id="col027"></span> 원 </td>
                </tr>
                <tr>
                    <td>우리사주조합기부금</td>
                    <td>&nbsp;</td>
                    <td class="small_num"><span id="col028"></span> 원 </td>
                </tr>
                <tr>
                    <td>고용유지 중소기업 근로자 소득공제</td>
                    <td>&nbsp;</td>
                    <td class="small_num"><span id="col029"></span> 원 </td>
                </tr>
                <tr>
                    <td>목돈 안드는 전세 이자상환액 공제</td>
                    <td>&nbsp;</td>
                    <td class="small_num"><span id="col030"></span> 원 </td>
                </tr>
                <tr>
                    <td>장기집합투자증권저축</td>
                    <td>&nbsp;</td>
                    <td class="small_num"><span id="col031"></span> 원 </td>
                </tr>
                <tr>
                    <td class="small_bg_gray" colspan="4">소득공제 종합한도 초과액</td>
                    <td class="small_num"><span id="col032"></span> 원 </td>
                </tr>
                <tr>
                    <td class="small_bg_gray" colspan="4">종합소득과세표준</td>
                    <td class="small_num"><span id="col033"></span> 원 </td>
                </tr>
                <tr>
                    <td class="small_bg_gray" colspan="4">산출세액</td>
                    <td class="small_num"><span id="col034"></span> 원 </td>
                </tr>
                <tr>
                    <td class="small_bg_titl" rowspan="5">세액감면</td>
                    <td colspan="2">소득세법</td>
                    <td>&nbsp;</td>
                    <td class="small_num"><span id="col035"></span> 원 </td>
                </tr>
                <tr>
                    <td rowspan="2">조세특례제한법</td>
                    <td>중소기업 취업자</td>
                    <td>&nbsp;</td>
                    <td class="small_num"><span id="col036"></span> 원 </td>
                </tr>
                <tr>
                    <td>외국인 기술자 등</td>
                    <td>&nbsp;</td>
                    <td class="small_num"><span id="col037"></span> 원 </td>
                </tr>
                <tr>
                    <td colspan="2">조세조약</td>
                    <td>&nbsp;</td>
                    <td class="small_num"><span id="col038"></span> 원 </td>
                </tr>
                <tr>
                    <td class="small_bg_gray" colspan="3">감면세액계</td>
                    <td class="small_num"><span id="col039"></span> 원 </td>
                </tr>
                <tr>
                    <td rowspan="30">세액공제</td>
                    <td colspan="2">근로소득세액공제</td>
                    <td>&nbsp;</td>
                    <td class="small_num"><span id="col040"></span> 원 </td>
                </tr>
                <tr>
                    <td colspan="2">자녀</td>
                    <td>&nbsp;</td>
                    <td class="small_num"><span id="col041"></span> 원 </td>
                </tr>
                <tr>
                    <td rowspan="6">연금계좌</td>
                    <td rowspan="2">과학기술인공제</td>
                    <td>공제대상금액</td>
                    <td class="small_num"><span id="col042"></span> 원 </td>
                </tr>
                <tr>
                    <td>세액공제액</td>
                    <td class="small_num"><span id="col043"></span> 원 </td>
                </tr>
                <tr>
                    <td rowspan="2">퇴직연금</td>
                    <td>공제대상금액</td>
                    <td class="small_num"><span id="col044"></span> 원 </td>
                </tr>
                <tr>
                    <td>세액공제액</td>
                    <td class="small_num"><span id="col045"></span> 원 </td>
                </tr>
                <tr>
                    <td rowspan="2">연금저축</td>
                    <td>공제대상금액</td>
                    <td class="small_num"><span id="col046"></span> 원 </td>
                </tr>
                <tr>
                    <td>세액공제액</td>
                    <td class="small_num"><span id="col047"></span> 원 </td>
                </tr>
                <tr>
                    <td rowspan="17">특별세액공제</td>
                    <td rowspan="2">보장성보험료</td>
                    <td>공제대상금액</td>
                    <td class="small_num"><span id="col048"></span> 원 </td>
                </tr>
                <tr>
                    <td>세액공제액</td>
                    <td class="small_num"><span id="col049"></span> 원 </td>
                </tr>
                <tr>
                    <td rowspan="2">의료비</td>
                    <td>공제대상금액</td>
                    <td class="small_num"><span id="col050"></span> 원 </td>
                </tr>
                <tr>
                    <td>세액공제액</td>
                    <td class="small_num"><span id="col051"></span> 원 </td>
                </tr>
                <tr>
                    <td rowspan="2">교육비</td>
                    <td>공제대상금액</td>
                    <td class="small_num"><span id="col052"></span> 원 </td>
                </tr>
                <tr>
                    <td>세액공제액</td>
                    <td class="small_num"><span id="col053"></span> 원 </td>
                </tr>
                <tr>
                    <td rowspan="2">정치자금기부금 (10만원 이하)</td>
                    <td>공제대상금액</td>
                    <td class="small_num"><span id="col054"></span> 원 </td>
                </tr>
                <tr>
                    <td>세액공제액</td>
                    <td class="small_num"><span id="col055"></span> 원 </td>
                </tr>
                <tr>
                    <td rowspan="2">정치자금기부금 (10만원 초과)</td>
                    <td>공제대상금액</td>
                    <td class="small_num"><span id="col056"></span> 원 </td>
                </tr>
                <tr>
                    <td>세액공제액</td>
                    <td class="small_num"><span id="col057"></span> 원 </td>
                </tr>
                <tr>
                    <td rowspan="2">법정기부금</td>
                    <td>공제대상금액</td>
                    <td class="small_num"><span id="col058"></span> 원 </td>
                </tr>
                <tr>
                    <td>세액공제액</td>
                    <td class="small_num"><span id="col059"></span> 원 </td>
                </tr>
                <tr>
                    <td rowspan="2">지정기부금</td>
                    <td>공제대상금액</td>
                    <td class="small_num"><span id="col060"></span> 원 </td>
                </tr>
                <tr>
                    <td>세액공제액</td>
                    <td class="small_num"><span id="col061"></span> 원 </td>
                </tr>
                <tr>
                    <td>기부금세액공제계</td>
                    <td>&nbsp;</td>
                    <td class="small_num"><span id="col062"></span> 원 </td>
                </tr>
                <tr>
                    <td>특별세액공제계</td>
                    <td>&nbsp;</td>
                    <td class="small_num"><span id="col063"></span> 원 </td>
                </tr>
                <tr>
                    <td>표준세액공제</td>
                    <td>&nbsp;</td>
                    <td class="small_num"><span id="col064"></span> 원 </td>
                </tr>
                <tr>
                    <td colspan="2">납세조합공제</td>
                    <td>&nbsp;</td>
                    <td class="small_num"><span id="col065"></span> 원 </td>
                </tr>
                <tr>
                    <td colspan="2">주택차입금</td>
                    <td>&nbsp;</td>
                    <td class="small_num"><span id="col066"></span> 원 </td>
                </tr>
                <tr>
                    <td colspan="2">외국납부</td>
                    <td>&nbsp;</td>
                    <td class="small_num"><span id="col067"></span> 원 </td>
                </tr>
                <tr>
                    <td colspan="2">월세액</td>
                    <td>&nbsp;</td>
                    <td class="small_num"><span id="col068"></span> 원 </td>
                </tr>
                <tr>
                    <td class="small_bg_gray" colspan="3">세액공제계</td>
                    <td class="small_num"><span id="col069"></span> 원 </td>
                </tr>
                <tr>
                    <td style="height: 130px; vertical-align: middle; padding-top: 10px" colspan="5">
                        <table id="small_table_03" cellspacing="0" cellpadding="0" width="100%" border="0">
                            <tbody>
                                <tr>
                                    <td width="145">&nbsp;</td>
                                    <td width="170" align="center">소득세</td>
                                    <td width="170" align="center">지방소득세</td>
                                    <td width="170" align="center">농어촌특별세</td>
                                </tr>
                                <tr>
                                    <td class="small_bg_gray">결정세액</td>
                                    <td class="small_num"><span id="col070"></span> 원 </td>
                                    <td class="small_num"><span id="col071"></span> 원 </td>
                                    <td class="small_num"><span id="col072"></span> 원 </td>
                                </tr>
                                <tr>
                                    <td class="small_bg_gray">기납부세액</td>
                                    <td class="small_num"><span id="col073"></span> 원 </td>
                                    <td class="small_num"><span id="col074"></span> 원 </td>
                                    <td class="small_num"><span id="col075"></span> 원 </td>
                                </tr>
                                <tr>
                                    <td class="small_bg_gray">차감징수세액</td>
                                    <td class="small_num"><span id="col076"></span> 원 </td>
                                    <td class="small_num"><span id="col077"></span> 원 </td>
                                    <td class="small_num"><span id="col078"></span> 원 </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <div id="frmMAIN_2015" style="display:none;">
        <iframe id="f_2015" src="/Job/연말정산/2015.html" frameborder="0" width="100%" height="1870"></iframe>
    </div>
    <div id="frmMAIN_2016" style="display:none;">
        <iframe id="f_2016" src="/Job/연말정산/2016.html" frameborder="0" width="100%" height="1870"></iframe>
    </div>
    <div id="lyrDown"></div>
</asp:Content>
