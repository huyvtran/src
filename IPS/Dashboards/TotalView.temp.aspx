<%@ Page Language="C#" AutoEventWireup="true" CodeFile="TotalView_temp.aspx.cs" Inherits="TotalView"%>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title></title>

    <link rel="stylesheet" href="css/default.css"/>
    <link rel="stylesheet" href="qtip/jquery.qtip.custom/jquery.qtip.css"/>
    
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
