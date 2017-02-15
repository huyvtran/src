<%@ Page Language="C#" AutoEventWireup="true" CodeFile="TotalView2.aspx.cs" Inherits="TotalView2"%>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title></title>

    <link rel="stylesheet" href="css/default.css"/>
    <link rel="stylesheet" href="css/jquery.qtip.css"/>
    
    <script type="text/javascript" src="Scripts/jquery-1.10.2.min.js"></script>
    <script src="qtip/jquery.qtip.custom/jquery.qtip.js"></script>
    <script src="js/TotalView2.js" type="text/javascript"></script>
    <script type="text/javascript">
        
        $(function () {          
            gw_job_process.ready();
            
        });

    </script>
    
    
    
</head>
<body>

    <form id="form1" runat="server">
        <div id="container">
            <div style="">
                <a id ="test">
                    <img id="domn" src ="domn.png"/>
                </a>  
            </div>
            <div style="position:absolute;top:40px;left:1060px">
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

<%-- A sector --%>
            <%--<div class="w" id ="A01" style="position:absolute;"></div>
            <div class="w" id ="A02" style="position:absolute;"></div>
            <div class="w" id ="A03" style="position:absolute;"></div>
            <div class="w" id ="A04" style="position:absolute;"></div>--%>

<%----------------------------------------------%>

            <%--<div class="w" id ="A05" style="position:absolute;"></div>
            <div class="w" id ="A06" style="position:absolute;"></div>
            <div class="w" id ="A07" style="position:absolute;"></div>
            <div class="w" id ="A08" style="position:absolute;"></div>
            <div class="w" id ="A09" style="position:absolute;"></div>
            <div class="w" id ="A10" style="position:absolute;"></div>--%>




<%-- B sector --%>
            <%--<div class="w" id ="B01" style="position:absolute;"></div>
            <div class="w" id ="B02" style="position:absolute;"></div>
            <div class="w" id ="B03" style="position:absolute;"></div>--%>
<%----------------------------------------------%>
            <%--<div class="w" id ="B04" style="position:absolute;"></div>
            <div class="w" id ="B05" style="position:absolute;"></div>
            <div class="w" id ="B06" style="position:absolute;"></div>--%>
<%----------------------------------------------%>
            <%--<div class="w" id ="B07" style="position:absolute;"></div>
            <div class="w" id ="B08" style="position:absolute;"></div>
            <div class="w" id ="B09" style="position:absolute;"></div>--%>




<%-- C sector --%>
            <%--<div class="w" id ="C11" style="position:absolute;"></div>
            <div class="w" id ="C12" style="position:absolute;"></div>
            <div class="w" id ="C13" style="position:absolute;"></div>
            <div class="w" id ="C14" style="position:absolute;"></div>
            <div class="w" id ="C15" style="position:absolute;"></div>
            <div class="w" id ="C16" style="position:absolute;"></div>
            <div class="w" id ="C17" style="position:absolute;"></div>


        
            <div class="w" id ="C21" style="position:absolute;"></div>
            <div class="w" id ="C22" style="position:absolute;"></div>
            <div class="w" id ="C23" style="position:absolute;"></div>
            <div class="w" id ="C24" style="position:absolute;"></div>
            <div class="w" id ="C25" style="position:absolute;"></div>
            <div class="w" id ="C26" style="position:absolute;"></div>
            <div class="w" id ="C27" style="position:absolute;"></div>


        
            <div class="w" id ="C31" style="position:absolute;"></div>
            <div class="w" id ="C32" style="position:absolute;"></div>
            <div class="w" id ="C33" style="position:absolute;"></div>
            <div class="w" id ="C34" style="position:absolute;"></div>
            <div class="w" id ="C35" style="position:absolute;"></div>
            <div class="w" id ="C36" style="position:absolute;"></div>
            <div class="w" id ="C37" style="position:absolute;"></div>--%>

        </div>
    </form>
    
</body>
</html>
