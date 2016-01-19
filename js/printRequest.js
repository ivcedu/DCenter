var print_request_id = "";
var m_depart_id = "";
var bursar = false;
var user_locked = false;
var admin_open = false;

////////////////////////////////////////////////////////////////////////////////
window.onload = function() {   
    if (localStorage.key(0) !== null) {
//        var html5pdf = require(['html5-to-pdf']);
        $('#depart_section').hide();
        
        getURLParameters();
        if (printRequestLocked()) {
            alert("Request opened Plotter/Duplicating request to edit/cancel. Please try back later");
            window.open('administrator.html', '_self');
            return false;
        }

        setAdminOption();
        getPrintRequest();
        getTransactionHistory();
    }
    else {
        var url_str = "http://services.ivc.edu/DCenter/printRequest.html" + location.search;
        sessionStorage.setItem('ss_dc_url_param', url_str);
        window.open('Login.html', '_self');
    }
};

window.onbeforeunload = function (event) {
    db_updatePrintRequestLocked(print_request_id, false);
};

////////////////////////////////////////////////////////////////////////////////
function getURLParameters() {
    var searchStr = location.search;
    //var section = location.hash.substring(1,location.hash.length);
    var searchArray = new Array();
    while (searchStr!=='') 
    {
        var name, value;
        // strip off leading ? or &
        if ((searchStr.charAt(0)==='?')||(searchStr.charAt(0)==='&')) 
            searchStr = searchStr.substring(1,searchStr.length);
        // find name
        name = searchStr.substring(0,searchStr.indexOf('='));
        // find value
        if (searchStr.indexOf('&')!==-1) 
            value = searchStr.substring(searchStr.indexOf('=')+1,searchStr.indexOf('&'));
        else 
            value = searchStr.substring(searchStr.indexOf('=')+1,searchStr.length);
        // add pair to an associative array
        value = value.replace("%20", " ");
        searchArray[name] = value;
        // cut first pair from string
        if (searchStr.indexOf('&')!==-1) 
            searchStr =  searchStr.substring(searchStr.indexOf('&')+1,searchStr.length);
        else 
            searchStr = '';
    }
    
    print_request_id = searchArray['print_request_id'];
}

////////////////////////////////////////////////////////////////////////////////
function printRequestLocked() {    
    var login_email = localStorage.getItem("ls_dc_loginEmail");
    
    var admin_list = new Array();
    admin_list = db_getAdminByEmail(login_email);
    
    if(admin_list.length === 1) {
        if (admin_list[0]['AdminLevel'] === "Admin") {        
            var result = new Array();
            result = db_getPrintRequest(print_request_id);

            if (result[0]['Locked'] === "1") {
                user_locked = true;
                return true;
            }
            else {
                admin_open = true;
                db_updatePrintRequestLocked(print_request_id, true);
                return false;
            }
        }
    }
    
    return false;
}

////////////////////////////////////////////////////////////////////////////////
$(document).ready(function() {
    window.addEventListener("beforeunload", function () {
        if (!user_locked && admin_open && localStorage.key(0) !== null) {
            db_updatePrintRequestLocked(print_request_id, false);
        }
    });
    
    $('#nav_home').click(function() {
        if (admin_open) {
            db_updatePrintRequestLocked(print_request_id, false);
        }
        window.open('home.html', '_self');
    });
    
    $('#nav_admin').click(function() {
        if (admin_open) {
            db_updatePrintRequestLocked(print_request_id, false);
        }
        window.open('administrator.html', '_self');
    });
    
    $('#nav_bursar').click(function() {
        if (admin_open) {
            db_updatePrintRequestLocked(print_request_id, false);
        }
        window.open('bursarOffice.html', '_self');
    });
    
    $('#nav_print').click(function() {
        window.print();
    });
    
    $('#nav_logout').click(function() {
        if (admin_open) {
            db_updatePrintRequestLocked(print_request_id, false);
        }
        localStorage.clear();
        window.open('Login.html', '_self');
    });
    
    ////////////////////////////////////////////////////////////////////////////
    $('#admin_depart').change(function() {
        m_depart_id = $(this).val();
    });

    ////////////////////////////////////////////////////////////////////////////
    $('#attachment_file').click(function() {
        var result = new Array();
        result = db_getAttachment(print_request_id);
        
        if (result.length === 1) {            
            var file_link_name = result[0]['FileLinkName'];
            var file_name = result[0]['FileName'];
            var pdf_data = result[0]['PDFData'];
            if (file_link_name !== "") {
                var url_pdf = "attach_files/" + file_link_name;
                window.open(url_pdf, '_blank');
            }
            else {
                var curBrowser = bowser.name;
                if (curBrowser === "Internet Explorer") {
                    var blob = b64toBlob(pdf_data, 'application/pdf');
                    window.saveAs(blob, file_name);
                }
                else {
                    window.open(pdf_data, '_blank');
                }
            }
        }
    });
    
    ////////////////////////////////////////////////////////////////////////////
    $('#btn_download').click(function() {
        var result = new Array();
        result = db_getAttachment(print_request_id);
        
        if (result.length === 1) {            
            var file_name = result[0]['FileName'];
            var pdf_data = result[0]['PDFData'];
            
            if (pdf_data === "") {
                return false;
            }
            else {
                var blob = b64toBlob(pdf_data, 'application/pdf');
                window.saveAs(blob, file_name);
            }
        }
    });
    
    ////////////////////////////////////////////////////////////////////////////
    $('#btn_save').click(function() {
        if ($('#device_type').html() === "Duplicating") {
            var err = duplicatingValidation();
            if (err !== "") {
                alert(err);
                return false;
            }
        }
        
        updatePrintStatus();
        statusEmailNotification();
        if (admin_open) {
            db_updatePrintRequestLocked(print_request_id, false);
        }
        
        if (bursar) {
            window.open('bursarOffice.html', '_self');
        }
        else {
            window.open('administrator.html', '_self');
        }
    });
    
    // auto size
    $('#admin_msg_note').autosize();
    
    // selectpicker
    $('.selectpicker').selectpicker();
});

////////////////////////////////////////////////////////////////////////////////
function duplicatingValidation() {
    var err = "";
    
    if ($('#admin_depart').val() === "0") {
        err += "Department is a required field\n";
    }
    
    return err;
}

////////////////////////////////////////////////////////////////////////////////
function setAdminOption() { 
    $('#show_admin').hide();
    $('#show_bursar').hide();
    $('#administrator').hide();
    $('#dept_section').hide();
    $('#department').hide();
    $('#plotter_section').hide();
    $('#duplicating_section').hide();
    
    var login_email = localStorage.getItem("ls_dc_loginEmail");
    
    var admin_list = new Array();
    admin_list = db_getAdminByEmail(login_email);
    
    var bursar_list = new Array();
    bursar_list = db_getBursarByEmail(login_email);
    
    if (admin_list.length === 1 || bursar_list.length === 1) {
        setDeliveryLocation();
        
        if (admin_list.length === 1) {
            $('#show_admin').show();
        }
        if (bursar_list.length === 1) {
            $('#show_bursar').show();
        }
    }
}

function setPlotterAdministrator(job_status_plot_id) {
    var login_email = localStorage.getItem("ls_dc_loginEmail");
    
    var admin_list = new Array();
    admin_list = db_getAdminByEmail(login_email);
    
    var bursar_list = new Array();
    bursar_list = db_getBursarByEmail(login_email);
    
    switch(job_status_plot_id) {
        case "4":
            if (bursar_list.length === 1) {        
                $('#administrator').show();
                bursar = true;
            }
            break;
        case "1": case "2": case "3": case "5": case "6": case "7":
            if (admin_list.length === 1) {        
                $('#administrator').show();
            }                  
            break;
        default:
            break;
    }
}

function setDuplicatingAdministrator(job_status_dup_id) {
    var login_email = localStorage.getItem("ls_dc_loginEmail");
    
    var admin_list = new Array();
    admin_list = db_getAdminByEmail(login_email);
    
    switch (job_status_dup_id) {
        case "1": case "2": case "3": case "4":
            if (admin_list.length === 1) {        
                $('#administrator').show();
            }            
            break;
        default:
            break;
    }
}

function setJobStatusPlot() {
    var result = new Array();
    result = db_getJobStatusPlot();
    
    var html = "";
    for (var i = 0; i < result.length; i++) {        
        html += "<option value='" + result[i]['JobStatusPlotID'] + "'>" + result[i]['JobStatusPlot'] + "</option>";
    }
    
    $('#admin_job_status').append(html);
    $('#admin_job_status').selectpicker('refresh');
}

function setJobStatusDup() {
    var result = new Array();
    result = db_getJobStatusDup();
    
    var html = "";
    for (var i = 0; i < result.length; i++) {
        html += "<option value='" + result[i]['JobStatusDupID'] + "'>" + result[i]['JobStatusDup'] + "</option>";
    }
    
    $('#admin_job_status').append(html);
    $('#admin_job_status').selectpicker('refresh');
}

function setDepartment() {
    var result = new Array();
    result = db_getDepartment();
    
    var html = "<option value='0'>Select...</option>";
    for (var i = 0; i < result.length; i++) {
        html += "<option value='" + result[i]['DepartmentID'] + "'>" + result[i]['Department'] + "</option>";
    }
    
    $('#admin_depart').append(html);
    $('#admin_depart').selectpicker('refresh');
}

function setDeliveryLocation() {
    var result = new Array();
    result = db_getDeliveryLocation();
    
    var html = "";
    for (var i = 0; i < result.length; i++) {
        html += "<option value='" + result[i]['DeliveryLocationID'] + "'>" + result[i]['DeliveryLocation'] + "</option>";
    }
    
    $('#admin_del_loc').append(html);
    $('#admin_del_loc').selectpicker('refresh');
}

////////////////////////////////////////////////////////////////////////////////
function getPrintRequest() {
    var result = new Array();
    result = db_getPrintRequest(print_request_id);
    
    if (result.length === 1) {
        var device_type_id = result[0]['DeviceTypeID'];
        var del_loc_id = result[0]['DeliveryLocationID'];
        $('#admin_del_loc').val(del_loc_id);
        $('#admin_del_loc').selectpicker('refresh');

        setRequestorInformation(result[0]['LoginType'], result[0]['LoginID'], result[0]['Requestor'], result[0]['Email'], result[0]['Phone'], result[0]['RequestTitle']);
        
        if (device_type_id === "1") {
            setPlotter(device_type_id, result[0]['DTStamp'], result[0]['Modified']);
        }
        else {
            $('#depart_section').show();
            setDuplicating(device_type_id, result[0]['DTStamp'], result[0]['Modified']);
        }
    }
}

function setRequestorInformation(login_type, login_id, requestor, email, phone, request_title) {
    $('#requestor').html(requestor);
    $('#email').html(email);
    $('#phone').html(phone);
    
    if (login_type === "Staff") {
        $('#login_type').html("Employee ID:");
    }
    else {
        $('#login_type').html("Student ID:");
    }
    
    $('#login_id').html(login_id);
    $('#request_title').html(request_title);
}

function setPlotter(device_type_id, dtstamp, modified) {
    $('#plotter_section').show();
    setJobStatusPlot();
    $('#admin_del_loc').attr("disabled", "disabled");
    
    $('#device_type').html(db_getDeviceTypeName(device_type_id));
    setAttachment();
    
    var result = new Array();
    result = db_getPlotter(print_request_id);
    if (result.length === 1) {
        var job_status_plot_id = result[0]['JobStatusPlotID'];
        $('#admin_job_status').val(job_status_plot_id);
        $('#admin_job_status').selectpicker('refresh');
        setPlotterAdministrator(job_status_plot_id);
        
        $('#job_status').html(db_getJobStatusPlotName(job_status_plot_id));
        if (modified === null) {
            $('#modified').html(convertDBDateTimeToString(dtstamp));
        }
        else {
            $('#modified').html(convertDBDateTimeToString(modified));
        }
        
        $('#paper_type').html(db_getPaperTypeName(result[0]['PaperTypeID']));
        $('#size_height').html(result[0]['SizeHeight']);
        $('#plot_total_cost').html(formatDollar(Number(result[0]['TotalCost']), 2));
        if (result[0]['WavedProof'] === "1") {
            $("#ckb_waved_proof").prop('checked', true);
        }
        if (result[0]['Free'] === "0") {
            $('#honor_student').hide();
        }
        
        $('#plot_note').html(result[0]['Note'].replace(/\n/g, "<br>"));
    }
}

function setDuplicating(device_type_id, dtstamp, modified) {
    $('#dept_section').show();
    $('#department').show();
    $('#duplicating_section').show();
    setJobStatusDup();
    setDepartment();
    
    $('#device_type').html(db_getDeviceTypeName(device_type_id));
    setAttachment();
    
    var result = new Array();
    result = db_getDuplicating(print_request_id);
    if (result.length === 1) {
        var job_status_dup_id = result[0]['JobStatusDupID'];
        $('#admin_job_status').val(job_status_dup_id);
        $('#admin_job_status').selectpicker('refresh');
        setDuplicatingAdministrator(job_status_dup_id);
        
        $('#job_status').html(db_getJobStatusDupName(job_status_dup_id));
        if (modified === null) {
            $('#modified').html(convertDBDateTimeToString(dtstamp));
        }
        else {
            $('#modified').html(convertDBDateTimeToString(modified));
        }
        
        m_depart_id = result[0]['DepartmentID'];
        if (m_depart_id !== "0") {
            $('#admin_depart').val(m_depart_id);
            $('#admin_depart').selectpicker('refresh');
        }
        $('#department').html(db_getDepartmentName(m_depart_id));
        
        $('#quantity').html(result[0]['Quantity']);
        $('#date_needed').html(result[0]['DateNeeded']);
        $('#time_needed').html(result[0]['TimeNeeded']);
        $('#paper_size').html(db_getPaperSizeName(result[0]['PaperSizeID']));
        $('#duplex').html(db_getDuplexName(result[0]['DuplexID']));
        $('#paper_color').html(db_getPaperColorName(result[0]['PaperColorID']));
        $('#cover_color').html(db_getCoverColorName(result[0]['CoverColorID']));
        if (result[0]['ColorCopy'] === "1") {
            $("#ckb_color_copy").prop('checked', true);
        }
        if (result[0]['FrontCover'] === "1") {
            $("#ckb_front_cover").prop('checked', true);
        }
        if (result[0]['BackCover'] === "1") {
            $("#ckb_back_cover").prop('checked', true);
        }
        if (result[0]['Confidential'] === "1") {
            $("#ckb_confidential").prop('checked', true);
        }
        if (result[0]['ThreeHolePunch'] === "1") {
            $("#ckb_three_hole_punch").prop('checked', true);
        }
        if (result[0]['Staple'] === "1") {
            $("#ckb_staple").prop('checked', true);
        }
        if (result[0]['Cut'] === "1") {
            $("#ckb_cut").prop('checked', true);
        }
        $('#dup_total_print').html(result[0]['TotalPrint']);
        $('#dup_total_cost').html(formatDollar(Number(result[0]['TotalCost']), 2));
        $('#dup_note').html(result[0]['Note'].replace(/\n/g, "<br>"));
    }
}

function setAttachment() {
    var result = new Array();
    result = db_getAttachment(print_request_id);
    
    if (result.length === 1) {        
        $('#attachment_file').html(result[0]['FileName']);
        $('#pdf_pages').html(result[0]['Pages']);
    }
}

////////////////////////////////////////////////////////////////////////////////
function getTransactionHistory() {
    var result = new Array();
    result = db_getTransaction(print_request_id);
    
    for (var i = 0; i < result.length; i++) {
        var dt_stamp = convertDBDateTimeToString(result[i]['DTStamp']);
        var login_name = result[i]['LoginName'];
        var note = result[i]['Note'];

        var html = login_name + " : " + dt_stamp + "<br>" + note.replace(/\n/g, "<br>") + "<br><br>";
        $("#transaction_history").append(html);
    }
}

////////////////////////////////////////////////////////////////////////////////
function updatePrintStatus() {
    var admin_del_loc_id = $('#admin_del_loc').val();
    var admin_job_status_id = $('#admin_job_status').val();
    var admin_msg_note = textReplaceApostrophe($('#admin_msg_note').val());
    var status_change = "";
    
    if ($('#device_type').html() === "Duplicating") {
        db_updateDuplicating(print_request_id, admin_job_status_id);
        db_updateDepartment(print_request_id, m_depart_id);
        db_updatePrintRequestDelivery(print_request_id, admin_del_loc_id);
        status_change = db_getJobStatusDupName(admin_job_status_id);
    }
    else {
        db_updatePlotter(print_request_id, admin_job_status_id);
        status_change = db_getJobStatusPlotName(admin_job_status_id);
    }
    
    if (admin_msg_note !== "") {
        status_change += "\n" + admin_msg_note;
    }
    
    db_updatePrintRequestModified(print_request_id);
    db_insertTransaction(print_request_id, localStorage.getItem('ls_dc_loginDisplayName'), "Status has been changed to " + status_change);
}

////////////////////////////////////////////////////////////////////////////////
function statusEmailNotification() {
    var admin_job_status_id = $('#admin_job_status').val();
    var device_type = $('#device_type').html();
    
    if (device_type === "Plotter") {
        switch(admin_job_status_id) {
            case "2":
                sendEmailNeedsProof();
                break;
            case "3":
                sendEmailProofReady();
                break;
            case "4":
                sendEmailWaitingForPayment();
                break;
            case "5":
                sendEmailReadyForPrinting();
                break;
            case "6":
                sendEmailAdditionalInfo();
                break;
            case "7":
                sendEmailInProgress();
                break;
            case "8":
                sendEmailPlotCompleted();
                break;
            case "9":
                sendEmailCancel();
                break;
            default:
                break;
        }
    }
    else {
        switch(admin_job_status_id) {
            case "2":
                sendEmailAdditionalInfo();
                break;
            case "3":
                sendEmailInProgress();
                break;
            case "4":
                sendEmailDupCompleted();
                break;
            case "5":
                sendEmailDupDelivered();
                break;
            case "6":
                sendEmailCancel();
                break;
            default:
                break;
        }
    }
}

function sendEmailNeedsProof() {
    var name = $('#requestor').html();
    var email = $('#email').html();
    
    var subject = "Your new plotter request";
    var message = "Dear " + name + ", <br><br>";
    message += "Thank you for your plotter request.  Request details:<br><br>";
    message += "Contact Phone: " + $('#phone').html() + "<br>";
    message += "Request Title: " + $('#request_title').html() + "<br>";
    message += "Paper Type: " + $('#paper_type').html() + "<br>";
    message += "Size: " + $('#size_height').html() + " x 36<br>";
    message += "Total Cost: " + $('#total_cost').html() + "<br><br>";
    
    message += "You will receive an email when your proof is ready to be reviewed.<br><br>";
    
    message += "Should you have any questions or comments, please contact the IVC Duplicating Center.<br/><br/>"; 
    message += "Thank you.<br>";
    message += "IVC Duplicating Center<br>";
    message += "ivcduplicating@ivc.edu<br>";
    message += "phone: 949.451.5297";
    
    proc_sendEmail(email, name, subject, message);
}

function sendEmailProofReady() {
    var name = $('#requestor').html();
    var email = $('#email').html();
    
    var subject = "Your plotter proof is now ready for review";
    var message = "Dear " + name + ", <br><br>";
    
    message += "Your proof for the request titled <strong>" + $('#request_title').html() + "</strong> is now ready for review.<br>";
    message += "Please come to the IVC Duplicating Center to approve your proof.<br><br>";
    
    message += "Should you have any questions or comments, please contact the IVC Duplicating Center.<br/><br/>"; 
    message += "Thank you.<br>";
    message += "IVC Duplicating Center<br>";
    message += "ivcduplicating@ivc.edu<br>";
    message += "phone: 949.451.5297";
    
    proc_sendEmail(email, name, subject, message);
}

function sendEmailWaitingForPayment() {
    var name = $('#requestor').html();
    var email = $('#email').html();
    
    var subject = "Your plotter request is ready for payment";
    var message = "Dear " + name + ", <br><br>";
    
    message += "Your plotter request titled <strong>" + $('#request_title').html() + "</strong> is now ready for payment.<br>";
    message += "Please take this email and go to the Bursars Office and pay " + $('#plot_total_cost').html() + " for this job.<br><br>";
    
    message += "Should you have any questions or comments, please contact the IVC Duplicating Center.<br/><br/>"; 
    message += "Thank you.<br>";
    message += "IVC Duplicating Center<br>";
    message += "ivcduplicating@ivc.edu<br>";
    message += "phone: 949.451.5297";
    
    proc_sendEmail(email, name, subject, message);
}

function sendEmailReadyForPrinting() {
    var name = "Jose Delgado";
    var email = "ivcduplicating@ivc.edu";
    
    var subject = "Plotter request " + $('#request_title').html() + " has been PAID";
    var message = "Dear " + name + ", <br><br>";
    
    message += "Plotter request titled <strong>" + $('#request_title').html() + "</strong> has been PAID.<br><br>";
    
    message += "Should you have any questions, please contact the Bursars's Office.<br/><br/>"; 
    message += "Thank you.<br>";
    
    proc_sendEmail(email, name, subject, message);
}

function sendEmailCancel() {
    var name = $('#requestor').html();
    var email = $('#email').html();
    
    var subject = "Your " + $('#device_type').html() + " request has been cancel";
    var message = "Dear " + name + ", <br><br>";
    
    message += "Your " + $('#device_type').html() + " request titled <strong>" + $('#request_title').html() + "</strong> has been CANCEL. The reason for this is:<br>";
    message += $('#admin_msg_note').val().replace(/\n/g, "<br>") + "<br><br>";
    
    message += "Should you have any questions or comments, please contact the IVC Duplicating Center.<br/><br/>"; 
    message += "Thank you.<br>";
    message += "IVC Duplicating Center<br>";
    message += "ivcduplicating@ivc.edu<br>";
    message += "phone: 949.451.5297";
    
    proc_sendEmail(email, name, subject, message);
}

function sendEmailAdditionalInfo() {
    var name = $('#requestor').html();
    var email = $('#email').html();
    
    var subject = "Additional information is needed for your " + $('#device_type').html() + " request";
    var message = "Dear " + name + ", <br><br>";
    
    message += "We need some information about your " + $('#device_type').html() + " request titled <strong>" + $('#request_title').html() + "</strong>. Here is what we need:<br>";
    message += $('#admin_msg_note').val().replace(/\n/g, "<br>") + "<br><br>";
    message += "Please respond to ivcduplicating@ivc.edu<br><br>";

    message += "Should you have any questions or comments, please contact the IVC Duplicating Center.<br/><br/>"; 
    message += "Thank you.<br>";
    message += "IVC Duplicating Center<br>";
    message += "ivcduplicating@ivc.edu<br>";
    message += "phone: 949.451.5297";
    
    proc_sendEmail(email, name, subject, message);
}

function sendEmailInProgress() {
    var name = $('#requestor').html();
    var email = $('#email').html();
    
    var subject = "Your " + $('#device_type').html() + " request is now in progress";
    var message = "Dear " + name + ", <br><br>";
    
    message += "Your " + $('#device_type').html() + " request titled <strong>" + $('#request_title').html() + "</strong> is now in progress.<br>";
    message += "You will receive an email when the request is complete.<br><br>";

    message += "Should you have any questions or comments, please contact the IVC Duplicating Center.<br/><br/>"; 
    message += "Thank you.<br>";
    message += "IVC Duplicating Center<br>";
    message += "ivcduplicating@ivc.edu<br>";
    message += "phone: 949.451.5297";
    
    proc_sendEmail(email, name, subject, message);
}

function sendEmailPlotCompleted() {
    var name = $('#requestor').html();
    var email = $('#email').html();
    
    var subject = "Your " + $('#device_type').html() + " request has been completed";
    var message = "Dear " + name + ", <br><br>";
    
    message += "Your " + $('#device_type').html() + " request titled <strong>" + $('#request_title').html() + "</strong> has been completed.<br>";
    message += "Please come to " + db_getDeliveryLocationName($('#admin_del_loc').val()) + " to pick up your job.<br><br>";

    message += "Should you have any questions or comments, please contact the IVC Duplicating Center.<br/><br/>"; 
    message += "Thank you.<br>";
    message += "IVC Duplicating Center<br>";
    message += "ivcduplicating@ivc.edu<br>";
    message += "phone: 949.451.5297";
    
    proc_sendEmail(email, name, subject, message);
}

function sendEmailDupCompleted() {
    var name = $('#requestor').html();
    var email = $('#email').html();
    
    var subject = "Your " + $('#device_type').html() + " request has been completed";
    var message = "Dear " + name + ", <br><br>";
    
    message += "Your " + $('#device_type').html() + " request titled <strong>" + $('#request_title').html() + "</strong> has been completed.<br>";
    message += "You will receive an email when the delivery is complete.<br><br>";

    message += "Should you have any questions or comments, please contact the IVC Duplicating Center.<br/><br/>"; 
    message += "Thank you.<br>";
    message += "IVC Duplicating Center<br>";
    message += "ivcduplicating@ivc.edu<br>";
    message += "phone: 949.451.5297";
    
    proc_sendEmail(email, name, subject, message);
}

function sendEmailDupDelivered() {
    var name = $('#requestor').html();
    var email = $('#email').html();
    
    var subject = "Your " + $('#device_type').html() + " request has been completed";
    var message = "Dear " + name + ", <br><br>";
    
    message += "Your " + $('#device_type').html() + " request titled <strong>" + $('#request_title').html() + "</strong> has been delivered.<br>";
    message += "Please come to " + db_getDeliveryLocationName($('#admin_del_loc').val()) + " to pick up your job.<br><br>";

    message += "Should you have any questions or comments, please contact the IVC Duplicating Center.<br/><br/>"; 
    message += "Thank you.<br>";
    message += "IVC Duplicating Center<br>";
    message += "ivcduplicating@ivc.edu<br>";
    message += "phone: 949.451.5297";
    
    proc_sendEmail(email, name, subject, message);
}