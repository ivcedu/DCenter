////////////////////////////////////////////////////////////////////////////////
window.onload = function() {   
    if (localStorage.key(0) !== null) {
        $('#show_admin').hide();
        $('#show_bursar').hide();
        $('#logn_name').html(localStorage.getItem('ls_dc_loginDisplayName'));

        setAdminOption();
        setBursarOption();
        
        getUserPrintList();
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
    $('#nav_new_print').click(function() {
        window.open('newPrintRequest.html', '_self');
    });
    
    $('#nav_history').click(function() {
        window.open('userHistoryList.html', '_self');
    });
    
    $('#nav_admin').click(function() {
        window.open('administrator.html', '_self');
    });
    
    $('#nav_bursar').click(function() {
        window.open('bursarOffice.html', '_self');
    });
    
    $('#nav_logout').click(function() {
        localStorage.clear();
        window.open('Login.html', '_self');
    });
    
    $('#user_profile').click(function() {
        var user_type = localStorage.getItem('ls_dc_loginType');
        if (user_type === "Staff") {
            window.open('userProfile.html', '_self');
        }
    });
    
    // table row contract click //////////////////////////////////////////////
    $('table').on('click', 'a', function(e) {
        e.preventDefault();
        var currentId = $(this).attr('id');
        var print_request_id = currentId.replace("print_request_id_", "");
        
        window.open('printRequest.html?print_request_id=' + print_request_id, '_self');
    });
    
    $('table').on('click', '[id^="edit_request_"]', function() {
        var currentId = $(this).attr('id');
        var print_request_id = currentId.replace("edit_request_", "");
        
        if (printRequestLocked(print_request_id)) {
            alert("Duplicating center is already working on your request. Please contact Jose Delgado at 949.451.5297");
            getUserPrintList();
            initializeTable();
        }
        else {
            window.open('editPrintRequest.html?print_request_id=' + print_request_id, '_self');
        }
    });
});

////////////////////////////////////////////////////////////////////////////////
function printRequestLocked(print_request_id) {
    var result = new Array();
    result = db_getPrintRequest(print_request_id);
    
    if (result[0]['Locked'] === "1") {
        return true;
    }
    else {
        return false;
    }
}

////////////////////////////////////////////////////////////////////////////////
function setAdminOption() {        
    var login_email = localStorage.getItem("ls_dc_loginEmail");
    var result = new Array();
    result = db_getAdminByEmail(login_email);
    
    if (result.length === 1) {
        $('#show_admin').show();
    }
}

function setBursarOption() {
    var login_email = localStorage.getItem("ls_dc_loginEmail");
    var result = new Array();
    result = db_getBursarByEmail(login_email);
    
    if (result.length === 1) {
        $('#show_bursar').show();
    }
}

////////////////////////////////////////////////////////////////////////////////
function getUserPrintList() {
    var result = new Array(); 
    result = db_getUserPrintRequestList(localStorage.getItem("ls_dc_loginEmail"));
    
    var total_cost = 0.0;
    $("#body_tr").empty();
    if (result.length !== 0) {
        for(var i = 0; i < result.length; i++) { 
            var created = convertDBDateToString(result[i]['DTStamp']);
            var status = "";
            var total = "";
            if (result[i]['DeviceTypeID'] === "1") {
                status = result[i]['JobStatusPlot'];
                total = formatDollar(Number(result[i]['PlotTotalCost']), 2);
                total_cost += Number(result[i]['PlotTotalCost']);
            }
            else {
                status = result[i]['JobStatusDup'];
                total = formatDollar(Number(result[i]['DupTotalCost']), 2);
                total_cost += Number(result[i]['DupTotalCost']);
            }
            setUserPrintListHTML(result[i]['PrintRequestID'], result[i]['RequestTitle'], result[i]['DeviceType'], status, created, total);
        }
    }
    
    $("#tbl_print").trigger("update");
    $('#total_cost').html(formatDollar(total_cost, 2));
}

function setUserPrintListHTML(print_request_id, request_title, device_type, job_status, created, total) {   
    var tbl_html = "<tr class='form-horizontal'>";
    tbl_html += "<td class='span3'><a href=# id='print_request_id_" + print_request_id +  "'>" + request_title + "</a></td>";
    tbl_html += "<td class='span2'>" + device_type + "</td>";
    tbl_html += "<td class='span2'>" + job_status + "</td>";
    tbl_html += "<td class='span2'>" + created + "</td>";
    tbl_html += "<td class='span2'>" + total + "</td>";
    if (job_status === "Queued") {
        tbl_html += "<td class='span1' style='padding: 0;'><button class='btn btn-mini span12' id='edit_request_" + print_request_id + "'><i class='icon-pencil icon-black'></i></button></td>";
    }
    else {
        tbl_html += "<td class='span1'></td>";
    }
    tbl_html += "</tr>";
    
    $("#body_tr").append(tbl_html);
}