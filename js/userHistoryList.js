////////////////////////////////////////////////////////////////////////////////
window.onload = function() {   
    if (localStorage.key(0) !== null) {
        getUserHistoryList();
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
    });
    
    $('#nav_logout').click(function() {
        localStorage.clear();
        window.open('Login.html', '_self');
    });
    
    // table row contract click ////////////////////////////////////////////////
    $('table').on('click', 'a', function(e) {
        e.preventDefault();
        var currentId = $(this).attr('id');
        var print_request_id = currentId.replace("print_request_id_", "");
        
        window.open('printRequest.html?print_request_id=' + print_request_id, '_self');
    });
    
    // table delete button click ///////////////////////////////////////////////
    $('table').on('click', '[id^="request_cancel_"]', function() {
        var currentId = $(this).attr('id');
        var print_request_id = currentId.replace("request_cancel_", "");
        
        var result = new Array();
        result = db_getAttachment(print_request_id);
        if (result.length === 1) {
            deleteAttachFile(result[0]['FileLinkName']);
            db_deletePrintRequest(print_request_id);
            getUserHistoryList();
            initializeTable();
        }
    });
});

////////////////////////////////////////////////////////////////////////////////
function getUserHistoryList() {
    var result = new Array(); 
    result = db_getUserHistoryList(localStorage.getItem("ls_dc_loginEmail"));
    
    var total_cost = 0.0;
    $("#body_tr").empty();
    if (result.length !== 0) {
        for(var i = 0; i < result.length; i++) { 
            var modified = convertDBDateToString(result[i]['Modified']);
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
            setAdminCompletedListHTML(result[i]['PrintRequestID'], result[i]['RequestTitle'], result[i]['DeviceType'], status, modified, total);
        }
    }
    
    $("#tbl_print").trigger("update");
    $('#total_cost').html(formatDollar(total_cost, 2));
}

function setAdminCompletedListHTML(print_request_id, request_title, device_type, job_status, modified, total) {   
    var tbl_html = "<tr>";
    tbl_html += "<td class='span4'><a href=# id='print_request_id_" + print_request_id +  "'>" + request_title + "</a></td>";
    tbl_html += "<td class='span2'>" + device_type + "</td>";
    tbl_html += "<td class='span2'>" + job_status + "</td>";
    tbl_html += "<td class='span2'>" + modified + "</td>";
    tbl_html += "<td class='span2'>" + total + "</td>";
    if (job_status === "Cancel") {
        tbl_html += "<td class='span1' style='padding: 0;'><button class='btn btn-mini span12' id='request_cancel_" + print_request_id + "'><i class='icon-trash icon-black'></i></button></td>";
    }
    else {
        tbl_html += "<td class='span1'></td>";
    }
    tbl_html += "</tr>";
    
    $("#body_tr").append(tbl_html);
}