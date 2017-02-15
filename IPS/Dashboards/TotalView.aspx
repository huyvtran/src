<%@ Page Language="C#" AutoEventWireup="true" CodeFile="TotalView.aspx.cs" Inherits="TotalView"%>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title></title>

    <link rel="stylesheet" href="css/default.css"/>
    <link rel="stylesheet" href="css/jquery.qtip.css"/>
    
    <script type="text/javascript" src="Scripts/jquery-1.10.2.min.js"></script>
    <script src="qtip/jquery.qtip.custom/jquery.qtip.js"></script>
    <script src="js/TotalView.js" type="text/javascript"></script>
    <script type="text/javascript">
        
        $(function () {          
            gw_job_process.ready();
            
        });

    </script>
    
    
    
</head>
<body>

    <form id="form1" runat="server">
    <div style="margin:80px,20px,20px,20px;padding:50px">
        <a id ="test">
            <img id="domn" src ="domn.png"/>
        </a>  
    </div>
    <div style="position:absolute;top:90px;left:1100px">
        <table>
            <tr>
                <td class="w_exp" style="width:15px;border:1px solid;"></td>
                <td class="explan">:상태 없음</td>
            </tr>
            <tr>
                <td class="b_exp" style="width:15px;border:1px solid;"></td>
                <td class="explan">:진행중</td>
            </tr>
            <tr>
                <td class="y_exp" style="width:15px;border:1px solid;"></td>
                <td class="explan">:진행경고</td>
            </tr>
            <tr>
                <td class="s_exp" style="width:15px;border:1px solid;"></td>
                <td class="explan">:진행보류</td>
            </tr>
        </table>
    </div>
    
<%--    <div class ="w" style="position:absolute;top:105px;left:1065px;width:10px;height:10px;border:1px solid"></div>
    <div class ="b" style="position:absolute;top:125px;left:1065px;width:10px;height:10px;border:1px solid"></div>
    <div class ="y" style="position:absolute;top:145px;left:1065px;width:10px;height:10px;border:1px solid"></div>
    <div class ="s" style="position:absolute;top:165px;left:1065px;width:10px;height:10px;border:1px solid"></div>

    <div class="explan" id="w_explan" style="position:absolute;top:103px;left:1085px">: 상태 없음</div>
    <div class="explan" id="b_explan" style="position:absolute;top:123px;left:1085px">: 진행중</div>
    <div class="explan" id="y_explan" style="position:absolute;top:143px;left:1085px">: 진행 경고</div>
    <div class="explan" id="s_explan" style="position:absolute;top:163px;left:1085px">: 진행 보류</div>--%>
    

<%-- A sector --%>
    <div class="w" id ="A01" style="position:absolute;"></div>
    <div class="w" id ="A02" style="position:absolute;"></div>
    <div class="w" id ="A03" style="position:absolute;"></div>
    <div class="w" id ="A04" style="position:absolute;"></div>

<%----------------------------------------------%>

    <div class="w" id ="A05" style="position:absolute;"></div>
    <div class="w" id ="A06" style="position:absolute;"></div>
    <div class="w" id ="A07" style="position:absolute;"></div>
    <div class="w" id ="A08" style="position:absolute;"></div>
    <div class="w" id ="A09" style="position:absolute;"></div>
    <div class="w" id ="A10" style="position:absolute;"></div>




<%-- B sector --%>
    <div class="w" id ="B01" style="position:absolute;"></div>
    <div class="w" id ="B02" style="position:absolute;"></div>
    <div class="w" id ="B03" style="position:absolute;"></div>
<%----------------------------------------------%>
    <div class="w" id ="B04" style="position:absolute;"></div>
    <div class="w" id ="B05" style="position:absolute;"></div>
    <div class="w" id ="B06" style="position:absolute;"></div>
<%----------------------------------------------%>
    <div class="w" id ="B07" style="position:absolute;"></div>
    <div class="w" id ="B08" style="position:absolute;"></div>
    <div class="w" id ="B09" style="position:absolute;"></div>




<%-- C sector --%>
    <div class="w" id ="C01" style="position:absolute;"></div>
    <div class="w" id ="C02" style="position:absolute;"></div>
    <div class="w" id ="C03" style="position:absolute;"></div>
    <div class="w" id ="C04" style="position:absolute;"></div>
    <div class="w" id ="C05" style="position:absolute;"></div>
    <div class="w" id ="C06" style="position:absolute;"></div>
    <div class="w" id ="C07" style="position:absolute;"></div>


        
    <div class="w" id ="C08" style="position:absolute;"></div>
    <div class="w" id ="C09" style="position:absolute;"></div>
    <div class="w" id ="C10" style="position:absolute;"></div>
    <div class="w" id ="C11" style="position:absolute;"></div>
    <div class="w" id ="C12" style="position:absolute;"></div>
    <div class="w" id ="C13" style="position:absolute;"></div>
    <div class="w" id ="C14" style="position:absolute;"></div>


        
    <div class="w" id ="C15" style="position:absolute;"></div>
    <div class="w" id ="C16" style="position:absolute;"></div>
    <div class="w" id ="C17" style="position:absolute;"></div>
    <div class="w" id ="C18" style="position:absolute;"></div>
    <div class="w" id ="C19" style="position:absolute;"></div>
    <div class="w" id ="C20" style="position:absolute;"></div>
    <div class="w" id ="C21" style="position:absolute;"></div>
    </form>
    
</body>
</html>
