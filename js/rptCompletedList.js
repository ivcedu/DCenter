////////////////////////////////////////////////////////////////////////////////
window.onload = function() {   
    if (localStorage.key(0) !== null) {
        getDefaultStartEndDate();
        getAdminCompletedList();
        initializeTable();
    }
    else {
        window.open('Login.html', '_self');
    }
};

////////////////////////////////////////////////////////////////////////////////
function initializeTable() {
    $("#tbl_complete_list").tablesorter({ });
}

////////////////////////////////////////////////////////////////////////////////
$(document).ready(function() { 
    $('#nav_admin').click(function() {
        window.open('administrator.html', '_self');
    });
    
    $('#nav_logout').click(function() {
        localStorage.clear();
        window.open('Login.html', '_self');
    });
    
    // refresh button click ////////////////////////////////////////////////////
    $('#btn_refresh').click(function() {
        var start_date = $('#start_date').val();
        var end_date = $('#end_date').val();
        
        if (start_date === "" || end_date === "") {
            alert("Please select Start and End date");
        }
        else {
            getAdminCompletedList();
            $('#tbl_complete_list').trigger("update");
        }
        
        return false;
    });
    
    // table row contract click ////////////////////////////////////////////////
    $('table').on('click', '[id^="print_request_id_"]', function(e) {
        e.preventDefault();
        var currentId = $(this).attr('id');
        var print_request_id = currentId.replace("print_request_id_", "");
        
        window.open('printRequest.html?print_request_id=' + print_request_id, '_self');
        return false;
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
            getAdminCompletedList();
            $('#tbl_complete_list').trigger("update");
        }
    });
    
    // datepicker
    $('#start_date').datepicker();
    $('#end_date').datepicker();
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getDefaultStartEndDate() {    
    $('#start_date').datepicker( "setDate", getCurrentFirstDayOfMonth() );
    $('#end_date').datepicker( "setDate", getCurrentLastDayOfMonth() );
}

////////////////////////////////////////////////////////////////////////////////
function getAdminCompletedList() {    
    var result = new Array(); 
    result = db_getAdminCompletedList($('#start_date').val(), $('#end_date').val());
    
    $("#body_tr").empty();
    var body_html = "";
    for(var i = 0; i < result.length; i++) { 
        var modified = convertDBDateToString(result[i]['Modified']);
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
        body_html += setAdminCompletedListHTML(result[i]['PrintRequestID'], result[i]['RequestTitle'], result[i]['Requestor'], result[i]['DeviceType'], status, modified, total);
    }
    
    $("#body_tr").append(body_html);
}

function setAdminCompletedListHTML(print_request_id, request_title, requestor, device_type, job_status, modified, total) {   
    var tbl_html = "<tr>";
    tbl_html += "<td class='span4'><a href=# id='print_request_id_" + print_request_id +  "'>" + request_title + "</a></td>";
    tbl_html += "<td class='span2'>" + requestor + "</td>";
    tbl_html += "<td class='span2'>" + device_type + "</td>";
    tbl_html += "<td class='span2'>" + job_status + "</td>";
    tbl_html += "<td class='span1'>" + modified + "</td>";
    tbl_html += "<td class='span1'>" + total + "</td>";
    if (job_status === "Cancel") {
        tbl_html += "<td class='span1' style='text-align: center'><a href=# id='request_cancel_" + print_request_id + "'><i class='icon-trash icon-black'></i></a></td>";
    }
    else {
        tbl_html += "<td class='span1'></td>";
    }
    tbl_html += "</tr>";
    
    return tbl_html;
}

////////////////////////////////////////////////////////////////////////////////
