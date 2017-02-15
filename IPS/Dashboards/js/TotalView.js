

var eq_list = ["A01", "A02", "A03", "A04", "A05", "A06", "A07", "A08", "A09", "A10"
              , "B01", "B02", "B03", "B04", "B05", "B06", "B07", "B08", "B09"
              , "C01", "C02", "C03", "C04", "C05", "C06", "C07", "C08", "C09", "C10"
              , "C11", "C12", "C13", "C14", "C15", "C16", "C17", "C18", "C19", "C20", "C21"];

gw_job_process = {


    
    ready: function () {
        
        gw_job_process.getCol(false);

        var loop = setInterval(function () {
            gw_job_process.getCol(true);
        }, 18000);
        
    },

    hoverEvent: function (location) {
        var lct = "#" + location;
        
        $(lct).hover(
            function () {
                $(lct + " > div").addClass("hover");
            }, function () {
                $(lct + " > div").removeClass("hover");
            }
        );
    },

    linkBind: function (location) {
        var id = "#" + location;
        $(id).click(function (e) {
            alert("[" + id + "]" + " Click");
        });
    },

    getCol: function (changable) {

        var url = "readData"
        var DATA = {};
        var val = "";
        $.ajax({
            url: "./WebService.asmx/readData",
            type: "POST",
            data: DATA,
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            success: function (result) {
                if (changable == false)
                    gw_job_process.setVisual($.parseJSON(result.d));
                else
                    gw_job_process.loopSet($.parseJSON(result.d));
            },
            error: function (e) {
                alert("error" + e.responseText);
            }
        });
               
    },

    changeColor: function (location, color) {
        var lct = "#" + location + "";
        $(lct).attr('class', color);
    },

    addTooltip: function (location, text) {
        var lct = "#" + location + "";
        $(lct).qtip({
            content: text,
            position: {
                my: 'bottom center',  // Position my top left...
                at: 'top right', // at the bottom right of...
                target: $(lct) // my target
            },
            style: {
                classes: 'qtip-light qtip-shadow'
            }
        });
    },

    drawRect: function(location,top,left,width,height){
        var lct = "#" + location;
        $(lct).css("top", top + "px");
        $(lct).css("left", left + "px");
        $(lct).height(height);
        $(lct).width(width);
    },

    addBoxText: function (location, text, changable) {
        var lct = "#" + location;
        var ost = $(lct).offset();
        var boxtext = '<div class="boxtxt" style="text-align:center;">' + text + '</div>';
        if (changable == true)
            $(lct + " > div").remove();
        $(lct).append(boxtext);

    },

    loopSet: function (param) {
        $.each(param, function () {
            gw_job_process.changeColor(this.location, this.color);
            gw_job_process.addBoxText(this.location, this.text_box, true);
            gw_job_process.addTooltip(this.location, this.text_tooltip);
        })
    },

    setVisual: function (param) {
        $.each(param, function () {
            gw_job_process.drawRect(this.location, this._top, this._left, this.width, this.height);
            gw_job_process.changeColor(this.location, this.color);
            gw_job_process.addTooltip(this.location, this.text_tooltip);
            gw_job_process.addBoxText(this.location, this.text_box, false);
            gw_job_process.linkBind(this.location);
            gw_job_process.hoverEvent(this.location);
        });
    }


    
}
