////////////////////////////////////////////////////////////////////////////////
window.onload = function() {   
    if (localStorage.key(0) !== null) {
        getBursarPrintList();
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
    
    // table row contract click //////////////////////////////////////////////
    $('table').on('click', 'a', function(e) {
        e.preventDefault();
        var currentId = $(this).attr('id');
        var print_request_id = currentId.replace("print_request_id_", "");
        
        window.open('printRequest.html?print_request_id=' + print_request_id, '_self');
    });
});

////////////////////////////////////////////////////////////////////////////////
function getBursarPrintList() {
    var result = new Array(); 
    result = db_getBursarPrintRequestList();
    
    $("#body_tr").empty();
    if (result.length !== 0) {
        for(var i = 0; i < result.length; i++) { 
            var created = convertDBDateToString(result[i]['DTStamp']);
            var total = formatDollar(Number(result[i]['PlotTotalCost']), 2);

            setBursarPrintListHTML(result[i]['PrintRequestID'], result[i]['RequestTitle'], result[i]['Requestor'], result[i]['DeviceType'], result[i]['JobStatusPlot'], created, total);
        }
    }
    
    $("#tbl_print").trigger("update");
}

function setBursarPrintListHTML(print_request_id, request_title, requestor, device_type, job_status, created, total) {   
    var tbl_html = "<tr>";
    tbl_html += "<td class='span2'><a href=# id='print_request_id_" + print_request_id +  "'>" + request_title + "</a></td>";
    tbl_html += "<td class='span2'>" + requestor + "</td>";
    tbl_html += "<td class='span2'>" + device_type + "</td>";
    tbl_html += "<td class='span2'>" + job_status + "</td>";
    tbl_html += "<td class='span2'>" + created + "</td>";
    tbl_html += "<td class='span2'>" + total + "</td>";
    tbl_html += "</tr>";
    
    $("#body_tr").append(tbl_html);
}