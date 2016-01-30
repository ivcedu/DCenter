var m_total_pages = 0;
var m_total_cost = 0;

////////////////////////////////////////////////////////////////////////////////
window.onload = function() {   
    if (localStorage.key(0) !== null) {
        getDefaultStartEndDate();
        getBillingReportDepartment();
        initializeTable();
    }
    else {
        window.open('Login.html', '_self');
    }
};

////////////////////////////////////////////////////////////////////////////////
function initializeTable() {
    $("#tbl_billing_report").tablesorter({  });
}

////////////////////////////////////////////////////////////////////////////////
$(document).ready(function() { 
    $('#nav_admin').click(function() {
        window.open('administrator.html', '_self');
        return false;
    });
    
    $('#nav_logout').click(function() {
        localStorage.clear();
        window.open('Login.html', '_self');
        return false;
    });
    
    // refresh button click ////////////////////////////////////////////////////
    $('#btn_refresh').click(function() {
        var start_date = $('#start_date').val();
        var end_date = $('#end_date').val();
        
        if (start_date === "" || end_date === "") {
            alert("Please select Start and End date");
        }
        else {
            getBillingReportDepartment();
            $('#tbl_billing_report').trigger("update");
        }
        return false;
    });
    
    // table row depart + click ////////////////////////////////////////////////
    $('table').on('click', '[id^="row_depart_id_"]', function(e) {
        e.preventDefault();
        var row_html = $(this).html();
        var first_child_row_id = $(this).attr('id');
        var depart_id = first_child_row_id.replace("row_depart_id_", "");
        
        if (row_html === "<i class=\"icon-plus icon-black\"></i>") {
            $(this).html("<i class='icon-minus icon-black'></i>");
            getBillingReportUsers(depart_id);
        }
        else {
            $(this).html("<i class='icon-plus icon-black'></i>");
            var result = new Array();
            result = db_getBillingReportUsers($('#start_date').val(), $('#end_date').val(), depart_id);
            for(var i = 0; i < result.length; i++) {
                var user_id = result[i]['LoginID'];
                $(".class_user_id_" + user_id).empty();
            }
            $(".class_depart_id_" + depart_id).empty();
        }
        return false;
    });
    
    // table row users + click /////////////////////////////////////////////////
    $('table').on('click', '[id^="row_user_id_"]', function(e) {
        e.preventDefault();
        var row_html = $(this).html();
        var second_child_row_id = $(this).attr('id');
        var ar_str = second_child_row_id.split("_DID_");
        var user_id = ar_str[0].replace("row_user_id_", "");
        var depart_id = ar_str[1];
        
        if (row_html === "<i class=\"icon-plus icon-black\"></i>") {
            $(this).html("<i class='icon-minus icon-black'></i>");
            getBillingReportPrint(depart_id, user_id);
        }
        else {
            $(this).html("<i class='icon-plus icon-black'></i>");
            $(".class_user_id_" + user_id).empty();
        }
        return false;
    });
    
    // table print request click ///////////////////////////////////////////////
    $('table').on('click', '[id^="row_print_request_id_"]', function(e) {
        e.preventDefault();
        var sel_print_req_id = $(this).attr('id').replace("row_print_request_id_", "");
        window.open('printRequest.html?print_request_id=' + sel_print_req_id, '_blank');
        return false;
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
function getBillingReportDepartment() {
    var result = new Array(); 
    result = db_getBillingReportDepartment($('#start_date').val(), $('#end_date').val());
    
    $("#body_tr").empty();
    var body_html = "";
    for(var i = 0; i < result.length; i++) { 
        m_total_pages += Number(result[i]['TotalPages']);
        m_total_cost += Number(result[i]['TotalCost']);
        body_html += setBillingReportDepartmentHTML(result[i]['DepartmentID'], result[i]['Department'], result[i]['TotalPages'], formatDollar(Number(result[i]['TotalCost']), 2));
    }
    $("#body_tr").append(body_html);
    
    $('#total_pages').html(m_total_pages);
    $('#total_cost').html(formatDollar(m_total_cost, 2));
}

function setBillingReportDepartmentHTML(department_id, department, total_pages, total_cost) { 
    var tbl_html = "<tr id='first_child_depart_id_" + department_id + "'>";
    tbl_html += "<td class='span1' style='text-align: center'><a href=# id='row_depart_id_" + department_id + "'><i class='icon-plus icon-black'></i></a></td>";
    tbl_html += "<td class='span1'></td>";
    tbl_html += "<td class='span5'>" + department + "</td>";
    tbl_html += "<td class='span2' style='text-align: center;'></td>";
    tbl_html += "<td class='span1' style='text-align: right;'>" + total_pages + "</td>";
    tbl_html += "<td class='span2' style='text-align: right;'>" + total_cost + "</td>";
    tbl_html += "</tr>";    
    return tbl_html;
}

////////////////////////////////////////////////////////////////////////////////
function getBillingReportUsers(depart_id) {
    var result = new Array();
    result = db_getBillingReportUsers($('#start_date').val(), $('#end_date').val(), depart_id);
    
    $(".class_depart_id_" + depart_id).empty();
    var body_html = "";
    for(var i = 0; i < result.length; i++) { 
        body_html += setBillingReportUsersHTML(depart_id, result[i]['LoginID'], result[i]['Requestor'], result[i]['TotalPages'], formatDollar(Number(result[i]['TotalCost']), 2));
    }
    $("#first_child_depart_id_" + depart_id).after(body_html);
}

function setBillingReportUsersHTML(depart_id, login_id, requestor, total_pages, total_cost) {
    var tbl_html = "<tr class='class_depart_id_" + depart_id + "' id='second_child_user_id_" + login_id + "'>";
    tbl_html += "<td class='span1'></td>";
    tbl_html += "<td class='span1' style='text-align: center'><a href=# id='row_user_id_" + login_id + "_DID_" + depart_id + "'><i class='icon-plus icon-black'></i></a></td>";
    tbl_html += "<td class='span5' style='font-style: italic;'>" + requestor + "</td>";
    tbl_html += "<td class='span2' style='text-align: center;'></td>";
    tbl_html += "<td class='span1' style='text-align: right;'>" + total_pages + "</td>";
    tbl_html += "<td class='span2' style='text-align: right;'>" + total_cost + "</td>";
    tbl_html += "</tr>";
    return tbl_html;
}

////////////////////////////////////////////////////////////////////////////////
function getBillingReportPrint(depart_id, user_id) {
    var result = new Array();
    result = db_getBillingReportPrint($('#start_date').val(), $('#end_date').val(), depart_id, user_id);
    
    $(".class_user_id_" + user_id).empty();
    var body_html = "";
    for(var i = 0; i < result.length; i++) { 
        body_html += setBillingReportPrintHTML(user_id, result[i]['PrintRequestID'], result[i]['RequestTitle'], 
                                                convertDBDateToString(result[i]['Modified']), result[i]['TotalPages'], formatDollar(Number(result[i]['TotalCost']), 2));
    }
    $("#second_child_user_id_" + user_id).after(body_html);
}

function setBillingReportPrintHTML(user_id, print_request_id, request_title, modified, total_pages, total_cost) {
    var tbl_html = "<tr class='class_user_id_" + user_id + "'>";
    tbl_html += "<td class='span1'></td>";
    tbl_html += "<td class='span1'></td>";
    tbl_html += "<td class='span5' style='font-style: italic;'><a href=# id='row_print_request_id_" + print_request_id +  "'>" + request_title + "</a></td>";
    tbl_html += "<td class='span2' style='text-align: center;'>" + modified + "</td>";
    tbl_html += "<td class='span1' style='text-align: right;'>" + total_pages + "</td>";
    tbl_html += "<td class='span2' style='text-align: right;'>" + total_cost + "</td>";
    tbl_html += "</tr>";
    return tbl_html;
}