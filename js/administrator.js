////////////////////////////////////////////////////////////////////////////////
window.onload = function() {   
    if (localStorage.key(0) !== null) {
        $('#nav_user_access').hide();
        setUserAccessOption();
        getAdminPrintList();
        initializeTable();
}
    else {
        window.open('Login.html', '_self');
    }
};

////////////////////////////////////////////////////////////////////////////////
function initializeTable() {
    $("#tbl_print").tablesorter({ });
}

////////////////////////////////////////////////////////////////////////////////
$(document).ready(function() { 
    $('#nav_home').click(function() {
        window.open('home.html', '_self');
        return false;
    });
    
    $('#nav_user_access').click(function() {
        window.open('userAccess.html', '_self');
        return false;
    });
    
    $('#nav_completed_list').click(function() {
        window.open('rptCompletedList.html', '_self');
        return false;
    });
    
    $('#nav_billing_report').click(function() {
        window.open('rptBillingReport.html', '_self');
        return false;
    });
    
    $('#nav_logout').click(function() {
        localStorage.clear();
        window.open('Login.html', '_self');
        return false;
    });
    
    // table row contract click //////////////////////////////////////////////
    $('table').on('click', 'a', function(e) {
        e.preventDefault();
        var currentId = $(this).attr('id');
        var print_request_id = currentId.replace("print_request_id_", "");
        
        window.open('printRequest.html?print_request_id=' + print_request_id, '_self');
        return false;
    });
});

////////////////////////////////////////////////////////////////////////////////
function setUserAccessOption() {        
    var login_email = localStorage.getItem("ls_dc_loginEmail");
    var result = new Array();
    result = db_getAdminByEmail(login_email);
    
    if (result[0]['AdminLevel'] === "Master") {
        $('#nav_user_access').show();
    }
}

////////////////////////////////////////////////////////////////////////////////
function getAdminPrintList() {
    var result = new Array(); 
    result = db_getAdminPrintRequestList();
    
    $("#body_tr").empty();
    var body_html = "";
    for(var i = 0; i < result.length; i++) { 
        var created = convertDBDateToString(result[i]['DTStamp']);
        var status = "";
        var total = "";
        if (result[i]['DeviceTypeID'] === "1") {
            status = result[i]['JobStatusPlot'];
            total = formatDollar(Number(result[i]['PlotTotalCost']), 2);
        }
        else {
            status = result[i]['JobStatusDup'];
            total = formatDollar(Number(result[i]['DupTotalCost']), 2);
        }
        body_html += setAdminPrintListHTML(result[i]['PrintRequestID'], result[i]['RequestTitle'], result[i]['Requestor'], result[i]['DeviceType'], status, created, total);
    }
    
    $("#body_tr").append(body_html);
    $("#tbl_print").trigger("update");
}

function setAdminPrintListHTML(print_request_id, request_title, requestor, device_type, job_status, created, total) {   
    var tbl_html = "<tr>";
    tbl_html += "<td class='span3'><a href=# id='print_request_id_" + print_request_id +  "'>" + request_title + "</a></td>";
    tbl_html += "<td class='span2'>" + requestor + "</td>";
    tbl_html += "<td class='span2'>" + device_type + "</td>";
    tbl_html += "<td class='span2'>" + job_status + "</td>";
    tbl_html += "<td class='span1'>" + created + "</td>";
    tbl_html += "<td class='span2' style='text-align: right;'>" + total + "</td>";
    tbl_html += "</tr>";
    return tbl_html;
}