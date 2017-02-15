<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="Accident_Default" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <div style="text-align: center;">
    
        <asp:Image ID="imgAccident" runat="server" ImageAlign="AbsMiddle" ImageUrl="ImageHandler.ashx?start_date=20150801" />
    
    </div>
    </form>
</body>
</html>
