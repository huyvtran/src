//var v_global = {
//	sub_cat_no: null,
//	proj_no: null
//};

var gw_job_process = {
    ready: function () {
        var sub_cat_no = sub_cat_no = gw_com_api.getPageParameter("sub_cat_no");
        var proj_no = proj_no = gw_com_api.getPageParameter("proj_no");

        sub_cat_no = sub_cat_no.toLowerCase();
        setURL(sub_cat_no, proj_no);
        setTitle(sub_cat_no);
        
        $(window).css({
            minWidth: "1300px"
        })

        $(window).resize(function () {
            setMinSize(1220);
        });
    }
};


function setMinSize(w) {
    var wth = document.body.clientWidth;
    var hgt = document.body.clientHeight;

    if (wth < w)
        window.resizeBy(w - wth, 0);
}

function setURL(sub_cat_no, proj_no) {
    var menu_id = null;
    var url = null;
    if (sub_cat_no == "s00")
        url = "../Dashboards/TotalView2.aspx";
    else {
        switch (sub_cat_no) {
            case "s01":
                menu_id = "SCM_8910";
                break;
            case "s11":
            case "s12":
            //case "s61":
            //case "s71":
                menu_id = "w_iscm1080_R";
                break;
            case "s21":
                menu_id = "SCM_8050";
                break;
            case "s31":
            case "s32":
                menu_id = "SCM_8010"
                break;
            case "s51":
                menu_id = "SCM_8040"
                break;
            case "s53":
                menu_id = "SCM_8020"
                break;
            case "s71":
            case "s61":
                menu_id = "SCM_8030"
                break;
            case "s99":
                menu_id = "SCM_8090"
                break;
            case "s90":
                menu_id = "SCM_0000"
                break;
            default:
                menu_id = ""
                break;
        }
        url = menu_id + ".aspx?proj_no=" + proj_no;
    }
    
    if (menu_id == "")
        url = "SCM_9999.aspx";"

    $('#fr').attr('src', url);
};

function setTitle(sub_cat_no) {
    var title;

    switch (sub_cat_no) {
        case "s01":
            title = "프로젝트 Issue 발생 현황";
            break;
        case "s11":
        case "s12":
            title = "프로젝트 의뢰 및 사양 정보";
            break;
        case "s21":
            title = "프로젝트 BOM 진행 현황";
            break;
        case "s22":
            title = "프로젝트 변경점 현황";
            break;
        case "s23":
            title = "프로젝트 도면 정보";
            break;
        case "s31":
        case "s32":
            title = "프로젝트 자재 진행 현황";
            break;
        case "s41":
            title = "프로젝트 성적서 현황";
            break;
        case "s51":
            title = "프로젝트 제조 진행 현황";
            break;
        case "s53":
            title = "프로젝트 문제 발생 현황"
            break;
        case "s56":
            title = "프로젝트 제조필요문서";
            break;
        case "s99":
            title = "프로젝트 외주 공정 현황"
            break;
        case "s90":
            title = "프로젝트 제조 진행 상세"
            break;
        case "s71":
        case "s61":
            title = "프로젝트 Set-Up 진행 정보"
            break;
    }

    $('#lblTitle').html(title);
};