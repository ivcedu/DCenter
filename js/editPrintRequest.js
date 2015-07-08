var m_bond_cost = 0.00;
var m_glossy_cost = 0.00;
var m_free = false;

var m_letter = 0.03;
var m_letter_color = 0.20;
var m_legal = 0.06;
var m_legal_color = 0.30;
var m_tabloid = 0.10;
var m_tabloid_color = 0.40;
var m_duplex = 1;
var m_color_paper = 0.05;
var m_front_cover = 0.05;
var m_front_cover_color = 0.25;
var m_back_cover = 0.05;
var m_back_cover_color = 0.25;
var m_three_hole = 0.02;
var m_staple = 0.02;
var m_cut = 0.75;

var m_str_dup_cost_info = "";
var m_total_page = "";
var m_department_id = "";

var print_request_id = "";
var m_device = "";
var m_file_deleted = false;

var m_file_name = "";
var m_base64_data = "";

var target;
var spinner;
////////////////////////////////////////////////////////////////////////////////
window.onload = function() {   
    if (localStorage.key(0) !== null) {
        $('#add_file_section').hide();
        $('#plotter_section').hide();
        $('#honor_student').hide();
        $('#duplicating_section').hide();
        $('#dept_section_1').hide();
        $('#dept_section_2').hide();
        
        target = $('#spinner')[0];
        spinner = new Spinner();
        
        getURLParameters();
        db_updatePrintRequestLocked(print_request_id, true);
        
        getDeviceType();
        getPaperType();
        getDuplex();
        getPaperColor();
        getCoverColor();
        getPaperSize();
        getDepartment();
        
        setDeviceDetail();
        getPrintRequest();
    }
    else {
        window.open('Login.html', '_self');
    }
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
$(document).ready(function() {
    window.addEventListener("beforeunload", function () {
        db_updatePrintRequestLocked(print_request_id, false);
    });
    
    $('#nav_home').click(function() {
        db_updatePrintRequestLocked(print_request_id, false);
        window.open('home.html', '_self');
    });
    
    $('#nav_manual').click(function() {
        var device_type = $('#device_type').val();
        if (device_type === "0") {
            return false;
        }
        else {
            if (localStorage.getItem('ls_dc_loginType') === "Student") {
                window.open('doc/Plotter_Student_User_Manual.pdf', '_blank');
            }
            else {
                if (device_type === "1") {
                    window.open('doc/Plotter_Staff_User_Manual.pdf', '_blank');
                }
                else {
                    window.open('doc/Duplicating_User_Manual.pdf', '_blank');
                }
            }
        }
    });
    
    $('#nav_logout').click(function() {
        db_updatePrintRequestLocked(print_request_id, false);
        localStorage.clear();
        window.open('Login.html', '_self');
    });
    
    // delete file button click ////////////////////////////////////////////////
    $('#btn_delete_file').click(function() { 
        var result = new Array();
        result = db_getAttachment(print_request_id);
        if (result.length === 1) {
//            deleteAttachFile(result[0]['FileLinkName']);
            db_deleteAttachment(print_request_id);
            m_file_deleted = true;
            $('#delete_file_section').hide();
            $('#add_file_section').show();
        }
    });
    
    // file change event ///////////////////////////////////////////////////////
    $('#attachment_file').change(function() { 
        getPDFAttachmentInfo();
    });
    
    // dropdown event //////////////////////////////////////////////////////////
    $('#device_type').change(function() { 
        var device_type_id = $(this).val();
        if (device_type_id === "1") {
            $('#nav_manual').show();
            $('#plotter_section').show();
            $('#duplicating_section').hide();
            $('#dept_section_1').hide();
            $('#dept_section_2').hide();
            $('#dept_section_3').hide();
            setHonorStudent();
        }
        else if (device_type_id === "2") {
            $('#nav_manual').show();
            $('#plotter_section').hide();
            $('#duplicating_section').show();
            $('#dept_section_1').show();
            $('#dept_section_2').show();
            $('#dept_section_3').hide();
        }
        else {
            $('#nav_manual').hide();
            $('#plotter_section').hide();
            $('#duplicating_section').hide();
            $('#dept_section_1').hide();
            $('#dept_section_2').hide();
            $('#dept_section_3').hide();
        }
    });
    
    // plotting event //////////////////////////////////////////////////////////
    $('#paper_type').change(function() { 
        var paper_type_id = $(this).val();
        var size_height = Number($('#size_height').val().replace(/[^0-9\.]/g, ''));
        if (paper_type_id === "1") {
            var plot_total_cost = size_height * m_bond_cost;
            $('#plot_total_cost').val(formatDollar(plot_total_cost, 2));
        }
        else if (paper_type_id === "2") {
            var plot_total_cost = size_height * m_glossy_cost;
            $('#plot_total_cost').val(formatDollar(plot_total_cost, 2));
        }
        else {
            $('#plot_total_cost').val("");
        }
    });
    
    $('#size_height').change(function() {      
        var input_val = Number($(this).val().replace(/[^0-9\.]/g, '')); 
        var paper_type_id = $('#paper_type').val();
        if (paper_type_id === "1") {
            var plot_total_cost = input_val * m_bond_cost;
            $('#plot_total_cost').val(formatDollar(plot_total_cost, 2));
        }
        else if (paper_type_id === "2") {
            var plot_total_cost = input_val * m_glossy_cost;
            $('#plot_total_cost').val(formatDollar(plot_total_cost, 2));
        }
        else {
            $('#plot_total_cost').val("");
        }
    });
    
    // duplicating event ///////////////////////////////////////////////////////
    $('#department').change(function() {
        m_department_id = $(this).val();
    });
    
    $('#quantity').change(function() {      
        var input_val = Number($(this).val().replace(/[^0-9\.]/g, ''));     
        $(this).val(input_val);
        calculateDupTotalCost();
    }); 
    
    $('#paper_size').change(function() {
        calculateDupTotalCost();
    });
    
    $('#duplex').change(function() {
        calculateDupTotalCost();
    });
    
    $('#paper_color').change(function() {
        calculateDupTotalCost();
    });
    
    $('#cover_color').change(function() {
        calculateDupTotalCost();
    });
    
    $('#ckb_color_copy').change(function() {
        calculateDupTotalCost();
    });
    
    $('#ckb_front_cover').change(function() {
        calculateDupTotalCost();
    });
    
    $('#ckb_back_cover').change(function() {
        calculateDupTotalCost();
    });
    
    $('#ckb_confidential').change(function() {
        calculateDupTotalCost();
    });
    
    $('#ckb_three_hole_punch').change(function() {
        calculateDupTotalCost();
    });
    
    $('#ckb_staple').change(function() {
        calculateDupTotalCost();
    });
    
    $('#ckb_cut').change(function() {
        calculateDupTotalCost();
    });
    
    // close button click //////////////////////////////////////////////////////
    $('#btn_close').click(function() { 
        if (!editFormValidation()) {
            return false;
        }
        
        db_updatePrintRequestLocked(print_request_id, false);
        window.open('home.html', '_self');
    });
    
    // cancel button click /////////////////////////////////////////////////////
    $('#btn_cancel').click(function() { 
        if (!editFormValidation()) {
            return false;
        }
        
        var device = "";
        var device_type_id = $('#device_type').val();
        if (device_type_id === "1") {
            var result_1 = new Array();
            result_1 = db_getPlotter(print_request_id);
            if (result_1.length === 1) {
                db_updatePlotter(print_request_id, 9);
                device = "Plotter";
            }
            else {
                alert("Your original request was a Duplicating. Please select Duplicating than click cancel button");
                return false;
            }
        }
        else {
            var result_2 = new Array();
            result_2 = db_getDuplicating(print_request_id);
            if (result_2.length === 1) {
                db_updateDuplicating(print_request_id, 6);
                device = "Duplicating";
            }
            else {
                alert("Your original request was a Plotter. Please select Plotter than click cancel button");
                return false;
            }
        }
        
        db_insertTransaction(print_request_id, localStorage.getItem('ls_dc_loginDisplayName'), device + " request has been canceled");
        sendEmailCancelAdmin();

        db_updatePrintRequestLocked(print_request_id, false);
        alert(device + " request has been canceled");
        window.open('home.html', '_self');
    });
    
    // save button click ///////////////////////////////////////////////////////
    $('#btn_save').click(function() {   
        $('#btn_save').prop('disabled', true);
        if (!editFormValidation()) {
            return false;
        }
        
        startSpin();        
        setTimeout(function() {      
            if (m_file_deleted) {
                addPDFAttachment(print_request_id);
            }

            var device = "";
            if ($('#device_type').val() === "1") {
                device = "Plotter";
                var result_1 = new Array();
                result_1 = db_getPlotter(print_request_id);
                if (result_1.length === 1) {
                    updatePlotter(print_request_id);
                }
                else {
                    db_deleteDuplicating(print_request_id);
                    addPlotter(print_request_id);
                    db_updatePrintRequestDevice(print_request_id, 1);
                }
            }
            else {
                device = "Duplicating";
                var result_2 = new Array();
                result_2 = db_getDuplicating(print_request_id);
                if (result_2.length === 1) {
                    updateDuplicating(print_request_id);
                    db_updateReceipt(print_request_id, m_str_dup_cost_info);
                }
                else {
                    db_deletePlotter(print_request_id);
                    addDuplicating(print_request_id);
                    db_updatePrintRequestDevice(print_request_id, 2);
                }
            }

            sendEmailUpdateAdmin(print_request_id);
            if (m_device === device) {
                db_insertTransaction(print_request_id, localStorage.getItem('ls_dc_loginDisplayName'), m_device + " request has been changed");
            }
            else {
                db_insertTransaction(print_request_id, localStorage.getItem('ls_dc_loginDisplayName'), m_device + " request has been changed to " + device);
            }

            db_updatePrintRequestLocked(print_request_id, false);
            alert("Your request has been changed successfully");
            window.open('home.html', '_self');
        }, 1000);
    });
    
    // auto size
    $('#plot_note').autosize();
    $('#dup_note').autosize();
    
    // selectpicker
    $('.selectpicker').selectpicker();
    
    // datepicker
    $('#date_needed').datepicker({minDate: new Date()});
    
    // timepicker
    $('#time_needed').timepicker();
    
    // bootstrap filestyle
    $(":file").filestyle({classButton: "btn btn-primary"});
});

////////////////////////////////////////////////////////////////////////////////
function formValidation() {
    var err = "";

    if ($('#phone').val().replace(/\s+/g, '') === "") {
        err += "Phone number is a required field\n";
    }
    if ($('#request_title').val().replace(/\s+/g, '') === "") {
        err += "Request title is a required field\n";
    }
    if ($('#device_type').val() === "Select...") {
        err += "Divice type is a required field\n";
    }
    if (m_file_deleted) {
        if ($('#attachment_file').val().replace(/\s+/g, '') === "") {
            err += "Attachment is a required field\n";
        }
    }
    
    return err;
}

function plotterValidation() {
    var err = "";
    
    if ($('#size_height').val().replace(/\s+/g, '') === "") {
        err += "Size is a required field\n";
    }
    if ($('#ckb_terms_condition').is(':checked') === false) {
        err += "Please check Terms and Condition\n";
    }
    
    return err;
}

function duplicatingValidation() {
    var err = "";
    
    if ($('#quantity').val().replace(/\s+/g, '') === "") {
        err += "Quantity is a required field\n";
    }
    if ($('#date_needed').val().replace(/\s+/g, '') === "") {
        err += "Date needed is a required field\n";
    }
    if ($('#time_needed').val().replace(/\s+/g, '') === "") {
        err += "Time needed is a required field\n";
    }
    
    return err;
}

function editFormValidation() {
    var err = formValidation();
    if (err !== "") {
        alert(err);
        return false;
    }
    else {
        if ($('#device_type').val() === "1") {
            var err_1 = plotterValidation();
            if (err_1 !== "") {
                alert(err_1);
                return false;
            }
            else {
                return true;
            }
        }
        else {
            var err_2 = duplicatingValidation();
            if (err_2 !== "") {
                alert(err_2);
                return false;
            }
            else {
                return true;
            }
        }
    }
}

////////////////////////////////////////////////////////////////////////////////
function getDeviceType() {
    var result = new Array();
    result = db_getDeviceType();
    
    var html = "";
    for (var i = 0; i < result.length; i++) {
        html += "<option value='" + result[i]['DeviceTypeID'] + "'>" + result[i]['DeviceType'] + "</option>";
    }
    
    $('#device_type').append(html);
    $('#device_type').selectpicker('refresh');
}

function getPaperType() {
    var result = new Array();
    result = db_getPaperType();
    
    var html = "";
    for (var i = 0; i < result.length; i++) {
        html += "<option value='" + result[i]['PaperTypeID'] + "'>" + result[i]['PaperType'] + "</option>";
        
        switch(result[i]['PaperTypeID']) {
            case "1":
                m_bond_cost = Number(result[i]['PaperCost']);
                break;
            case "2":
                m_glossy_cost = Number(result[i]['PaperCost']);
                break;
            default:
                break;
        }
    }
    
    $('#paper_type').append(html);
    $('#paper_type').selectpicker('refresh');
}

function getDuplex() {
    var result = new Array();
    result = db_getDuplex();
    
    var html = "";
    for (var i = 0; i < result.length; i++) {
        html += "<option value='" + result[i]['DuplexID'] + "'>" + result[i]['Duplex'] + "</option>";
    }
    
    $('#duplex').append(html);
    $('#duplex').selectpicker('refresh');
}

function getPaperColor() {
    var result = new Array();
    result = db_getPaperColor();
    
    var html = "";
    for (var i = 0; i < result.length; i++) {
        html += "<option value='" + result[i]['PaperColorID'] + "'>" + result[i]['PaperColor'] + "</option>";
    }
    
    $('#paper_color').append(html);
    $('#paper_color').selectpicker('refresh');
}

function getCoverColor() {
    var result = new Array();
    result = db_getCoverColor();
    
    var html = "";
    for (var i = 0; i < result.length; i++) {
        html += "<option value='" + result[i]['CoverColorID'] + "'>" + result[i]['CoverColor'] + "</option>";
    }
    
    $('#cover_color').append(html);
    $('#cover_color').selectpicker('refresh');
}

function getDepartment() {
    var result = new Array();
    result = db_getDepartment();
    
    var html = "<option value='0'>Select...</option>";
    for (var i = 0; i < result.length; i++) {
        html += "<option value='" + result[i]['DepartmentID'] + "'>" + result[i]['Department'] + "</option>";
    }
    
    $('#department').append(html);
    $('#department').selectpicker('refresh');
}

function getPaperSize() {
    var result = new Array();
    result = db_getPaperSize();
    
    var html = "";
    for (var i = 0; i < result.length; i++) {
        html += "<option value='" + result[i]['PaperSizeID'] + "'>" + result[i]['PaperSize'] + "</option>";
    }
    
    $('#paper_size').append(html);
    $('#paper_size').selectpicker('refresh');
}

////////////////////////////////////////////////////////////////////////////////
function setHonorStudent() {
    var result = new Array();
    result = db_getHonorStudentByEmail(localStorage.getItem("ls_dc_loginEmail"));
    
    if (result.length === 1) {
        $('#honor_student').show();
        $('#ckb_waved_proof').attr("disabled", true);
        m_free = true;
    }
}

function setDeviceDetail() {
    if (localStorage.getItem('ls_dc_loginType') === "Student") {
        $('#plotter_section').show();    
        $('#duplicating_section').hide();
        $('#device_type').attr('disabled', true);
        setHonorStudent();
    }
}

function getPrintRequest() {
    var result = new Array();
    result = db_getPrintRequest(print_request_id);
    
    if (result.length === 1) {
        var device_type_id = result[0]['DeviceTypeID'];
        setRequestorInformation(result[0]['LoginType'], result[0]['LoginID'], result[0]['Requestor'], result[0]['Email'], result[0]['Phone'], result[0]['RequestTitle']);
        $('#device_type').val(device_type_id);
        $('#device_type').selectpicker('refresh');
        setAttachment();
        
        if (device_type_id === "1") {
            m_device = "Plotter";
            $('#plotter_section').show();
            setPlotter();
        }
        else {
            m_device = "Duplicating";
            $('#dept_section_1').show();
            $('#dept_section_2').show();
            $('#duplicating_section').show();
            setDuplicating();
        }
    }
}

function setRequestorInformation(login_type, login_id, requestor, email, phone, request_title) {
    $('#requestor').val(requestor);
    $('#email').val(email);
    $('#phone').val(phone);
    
    if (login_type === "Staff") {
        $('#login_type').html("Employee ID:");
    }
    else {
        $('#login_type').html("Student ID:");
    }
    
    $('#login_id').val(login_id);
    $('#request_title').val(request_title);
}

function setAttachment() {
    var result = new Array();
    result = db_getAttachment(print_request_id);
    
    if (result.length === 1) {    
        var html = "<a href='attach_files/" + result[0]['FileLinkName'] + "' target='_blank'>" + result[0]['FileName'] + "</a>";
        $('#delete_file_name').append(html);
        m_total_page = result[0]['Pages'];
        $('#delete_pdf_pages').html(m_total_page);
    }
}

function setPlotter() {
    var result = new Array();
    result = db_getPlotter(print_request_id);
    
    if (result.length === 1) {        
        $('#paper_type').val(result[0]['PaperTypeID']);
        $('#paper_type').selectpicker('refresh');
        
        $('#size_height').val(result[0]['SizeHeight']);
        $('#plot_total_cost').val(formatDollar(Number(result[0]['TotalCost']), 2));
        if (result[0]['WavedProof'] === "1") {
            $("#ckb_waved_proof").prop('checked', true);
        }
        if (result[0]['Free'] === "0") {
            $('#honor_student').hide();
        }
        
        $('#plot_note').html(result[0]['Note'].replace(/\n/g, "<br>"));
    }
}

function setDuplicating() {    
    var result = new Array();
    result = db_getDuplicating(print_request_id);
    
    if (result.length === 1) {        
        m_department_id = result[0]['DepartmentID'];
        if (m_department_id !== "0") {
            $('#department').val(m_department_id);
            $('#department').selectpicker('refresh');
        }
        
        $('#quantity').val(result[0]['Quantity']);
        $('#date_needed').val(result[0]['DateNeeded']);
        $('#date_needed').selectpicker('refresh');
        $('#time_needed').val(result[0]['TimeNeeded']);
        $('#paper_size').val(result[0]['PaperSizeID']);
        $('#paper_size').selectpicker('refresh');
        $('#duplex').val(result[0]['DuplexID']);
        $('#duplex').selectpicker('refresh');
        $('#paper_color').val(result[0]['PaperColorID']);
        $('#paper_color').selectpicker('refresh');
        $('#cover_color').val(result[0]['CoverColorID']);
        $('#cover_color').selectpicker('refresh');
        
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
        $('#dup_note').val(result[0]['Note']);
        
        calculateDupTotalCost();
    }
}

////////////////////////////////////////////////////////////////////////////////
function addPrintRequest() {
    var name = textReplaceApostrophe($('#requestor').val());
    var email = textReplaceApostrophe($('#email').val());
    var phone = textReplaceApostrophe($('#phone').val());
    var login_type = localStorage.getItem('ls_dc_loginType');
    var login_id = textReplaceApostrophe($('#login_id').val());
    var request_title = textReplaceApostrophe($('#request_title').val());
    var device_type_id = $('#device_type').val();
    var delivery_location_id = "3";
    if (device_type_id === "2") {
        delivery_location_id = "1";
    }
    
    return db_insertPrintRequest(device_type_id, delivery_location_id, login_type, login_id, name, email, phone, request_title);
}

function addPlotter(print_request_id) {
    var paper_type_id = $('#paper_type').val();
    var job_status_plot_id = "2";
    var size_height = textReplaceApostrophe($('#size_height').val());
    var size_width = textReplaceApostrophe($('#size_width').val());
    var plot_total_cost = revertDollar($('#plot_total_cost').val());
    var waved_proof = ($('#ckb_waved_proof').is(':checked') ? true : false);
    var note = textReplaceApostrophe($('#plot_note').val());
    if (waved_proof) {
        job_status_plot_id = "1";
    }
    
    return db_insertPlotter(print_request_id, job_status_plot_id, paper_type_id, size_height, size_width, plot_total_cost, waved_proof, m_free, note);
}

function updatePlotter(print_request_id) {
    var paper_type_id = $('#paper_type').val();
    var size_height = textReplaceApostrophe($('#size_height').val());
    var size_width = textReplaceApostrophe($('#size_width').val());
    var plot_total_cost = revertDollar($('#plot_total_cost').val());
    var waved_proof = ($('#ckb_waved_proof').is(':checked') ? true : false);
    var note = textReplaceApostrophe($('#plot_note').val());
    
    return db_updatePlotterRequest(print_request_id, paper_type_id, size_height, size_width, plot_total_cost, waved_proof, note);
}

function addDuplicating(print_request_id) {    
    var quantity = textReplaceApostrophe($('#quantity').val());
    var date_needed = textReplaceApostrophe($('#date_needed').val());
    var time_needed = textReplaceApostrophe($('#time_needed').val());
    var paper_size_id = $('#paper_size').val();
    var duplex_id = $('#duplex').val();
    var paper_color_id = $('#paper_color').val();
    var cover_color_id = $('#cover_color').val();
    var color_copy = ($('#ckb_color_copy').is(':checked') ? true : false);
    var front_cover = ($('#ckb_front_cover').is(':checked') ? true : false);
    var back_cover = ($('#ckb_back_cover').is(':checked') ? true : false);
    var confidential = ($('#ckb_confidential').is(':checked') ? true : false);
    var three_hole_punch = ($('#ckb_three_hole_punch').is(':checked') ? true : false);
    var staple = ($('#ckb_staple').is(':checked') ? true : false);
    var cut = ($('#ckb_cut').is(':checked') ? true : false);
    var total_print = $('#dup_total_print').html();
    var dup_total_cost = revertDollar($('#dup_total_cost').html());
    var note = textReplaceApostrophe($('#dup_note').val());
    
    return db_insertDuplicating(print_request_id, "1", m_department_id, quantity, date_needed, time_needed, paper_size_id, duplex_id, paper_color_id, cover_color_id,
                                color_copy, front_cover, back_cover, confidential, three_hole_punch, staple, cut, total_print, dup_total_cost, note);
}

function updateDuplicating(print_request_id) {    
    var quantity = textReplaceApostrophe($('#quantity').val());
    var date_needed = textReplaceApostrophe($('#date_needed').val());
    var time_needed = textReplaceApostrophe($('#time_needed').val());
    var paper_size_id = $('#paper_size').val();
    var duplex_id = $('#duplex').val();
    var paper_color_id = $('#paper_color').val();
    var cover_color_id = $('#cover_color').val();
    var color_copy = ($('#ckb_color_copy').is(':checked') ? true : false);
    var front_cover = ($('#ckb_front_cover').is(':checked') ? true : false);
    var back_cover = ($('#ckb_back_cover').is(':checked') ? true : false);
    var confidential = ($('#ckb_confidential').is(':checked') ? true : false);
    var three_hole_punch = ($('#ckb_three_hole_punch').is(':checked') ? true : false);
    var staple = ($('#ckb_staple').is(':checked') ? true : false);
    var cut = ($('#ckb_cut').is(':checked') ? true : false);
    var total_print = $('#dup_total_print').html();
    var dup_total_cost = revertDollar($('#dup_total_cost').html());
    var note = textReplaceApostrophe($('#dup_note').val());
    
    return db_updateDuplicatingRequest(print_request_id, m_department_id, quantity, date_needed, time_needed, paper_size_id, duplex_id, paper_color_id, cover_color_id,
                                        color_copy, front_cover, back_cover, confidential, three_hole_punch, staple, cut, total_print, dup_total_cost, note);
}

////////////////////////////////////////////////////////////////////////////////
function fileAttachment(print_request_id) {
    var file = $('#attachment_file').get(0).files[0];    
    var file_data = new FormData();
    var f_name = file.name.replace(/#/g, "");
    var php_flname = print_request_id + "_fileIndex_" + f_name;
    file_data.append("files[]", file, php_flname); 

    var attachment_id = uploadAttachFile(file_data);
    if (attachment_id === "") {
        return false;
    }
    else {   
        var pages = $('#add_pdf_pages').html();
        db_updateAttachmentPages(attachment_id, pages);
        return true;
    }
}

function getPDFAttachmentInfo() {
    var file = $('#attachment_file').get(0).files[0];
    var f_name = file.name.replace(/#/g, "");
    
    if (typeof file !== "undefined") {
        var f_extension = getFileExtension(f_name);
        if (f_extension !== "pdf") {
            alert("Only PDF file can be upload");
            return false;
        } 
        else {   
            if (file.size >= 5000000) {
                alert("Attached file size is too big, max. file size allow is 5Mb or less");
                $('#attachment_file').filestyle('clear');
                $('#add_pdf_pages').val("");
                return false;
            }
            else {
                var file_data = new FormData();
                file_data.append("files[]", file, f_name); 
                m_total_page = pdfGetTotalPages(file_data);
                $('#add_pdf_pages').html(m_total_page);
                calculateDupTotalCost();
                convertPDFtoBase64();
                return true;
            }
        }
    }
    else {
        return true;
    }
}

function convertPDFtoBase64() {
    var file = $('#attachment_file').get(0).files[0];
    m_file_name = file.name.replace(/#/g, "");
    var reader = new FileReader();
    
    reader.onloadend = function () {
        m_base64_data = reader.result;
    };

    if (file) {
        reader.readAsDataURL(file);
    } 
}

function addPDFAttachment(print_request_id) {    
    db_insertAttachment(print_request_id, m_file_name, m_total_page, m_base64_data);
    $('#attachment_file').filestyle('clear');
}

////////////////////////////////////////////////////////////////////////////////
function calculateDupTotalCost() {
    m_str_dup_cost_info = "";
    var paper_cost = 0.0;
    var quantity = Number($('#quantity').val());
    var paper_color = $('#paper_color option:selected').text();
    
    m_str_dup_cost_info += "Quantity: " + quantity + "<br/>";
    m_str_dup_cost_info += "Paper Color: " + paper_color + "<br/>";
    
    duplexValue();
    paperColorCost();
    paper_cost = paperSizeCost();
    
    var front_cover = frontCoverCost();
    var back_cover = backCoverCost();
    confidential();
    threeHolePunchCost();
    stapleCost();
    
    var total_cost = paper_cost * quantity * Number(m_total_page);
    total_cost += front_cover + back_cover + cutCost();
    
    m_str_dup_cost_info += "<b>Print Cost: " + formatDollar(paper_cost, 3) + "</b>";
    
    $('#dup_cost_info').html(m_str_dup_cost_info.trim());
    $('#dup_total_print').html(quantity * Number(m_total_page));
    $('#dup_total_cost').html(formatDollar(total_cost, 2));
}

function paperSizeCost() {
    var cost = 0.0;
    var paper_size_id = $('#paper_size').val();
    var color_copy = ($('#ckb_color_copy').is(':checked') ? true : false);
    
    switch(paper_size_id) {
        case "1":
            if (color_copy) {
                m_str_dup_cost_info += "Paper Size: Letter 8.5 X 11 Color Copy<br/>";
                cost = m_letter_color;
            }
            else {
                m_str_dup_cost_info += "Paper Size: Letter 8.5 X 11<br/>";
                cost = m_letter;
            }
            break;
        case "2":
            if (color_copy) {
                m_str_dup_cost_info += "Paper Size: Legal 8.5 X 14 Color Copy<br/>";
                cost = m_legal_color;
            }
            else {
                m_str_dup_cost_info += "Paper Size: Legal 8.5 X 14<br/>";
                cost = m_legal;
            }
            break;
        case "3":
            if (color_copy) {
                m_str_dup_cost_info += "Paper Size: Tabloid 11 X 17 Color Copy<br/>";
                cost = m_tabloid_color;
            }
            else {
                m_str_dup_cost_info += "Paper Size: Tabloid 11 X 17<br/>";
                cost = m_tabloid;
            }
            break;
        default:
            break;
    }
    
    return cost;
}

function duplexValue() {
    var duplex_id = $('#duplex').val();
    if (duplex_id === "2") {
        m_duplex = 2;
        m_letter = 0.025;
        m_letter_color = 0.195;
        m_legal = 0.055;
        m_legal_color = 0.295;
        m_tabloid = 0.95;
        m_tabloid_color = 0.395;
    }
    else {
        m_duplex = 1;
        m_letter = 0.03;
        m_letter_color = 0.20;
        m_legal = 0.06;
        m_legal_color = 0.30;
        m_tabloid = 0.10;
        m_tabloid_color = 0.40;
    }
}

function paperColorCost() {
    var paper_color_id = $('#paper_color').val();
    if (paper_color_id !== "1") {
        var duplex_id = $('#duplex').val();
        if (duplex_id === "2") {
            m_duplex = 2;
            m_letter = 0.025 + 0.03;
            m_letter_color = 0.195 + 0.03;
            m_legal = 0.055 + 0.03;
            m_legal_color = 0.295 + 0.03;
            m_tabloid = 0.95 + 0.03;
            m_tabloid_color = 0.395 + 0.03;
        }
        else {
            m_duplex = 1;
            m_letter = 0.03 + 0.03;
            m_letter_color = 0.20 + 0.03;
            m_legal = 0.06 + 0.03;
            m_legal_color = 0.30 + 0.03;
            m_tabloid = 0.10 + 0.03;
            m_tabloid_color = 0.40 + 0.03;
        }
    }
}

function frontCoverCost() {   
    var color_cover_id = $('#cover_color').val();
    var cover_color = $('#cover_color option:selected').text();
    var front_cover = ($('#ckb_front_cover').is(':checked') ? true : false);
    if (front_cover) {
        if (color_cover_id === "1") {
            m_str_dup_cost_info += "Front Cover White : " + formatDollar(m_front_cover, 2) + "<br/>";
            return m_front_cover;
        }
        else {
            m_str_dup_cost_info += "Front Cover " + cover_color + " : " + formatDollar(m_front_cover_color, 2) + "<br/>";
            return m_front_cover_color;
        }
    }
    else {
        return 0.0;
    }
}

function backCoverCost() {
    var color_cover_id = $('#cover_color').val();
    var cover_color = $('#cover_color option:selected').text();
    var back_cover = ($('#ckb_back_cover').is(':checked') ? true : false);
    if (back_cover) {
        if (color_cover_id === "1") {
            m_str_dup_cost_info += "Back Cover White : " + formatDollar(m_back_cover, 2) + "<br/>";
            return m_back_cover;
        }
        else {
            m_str_dup_cost_info += "Back Cover " + cover_color + " : " + formatDollar(m_back_cover_color, 2) + "<br/>";
            return m_back_cover_color;
        }
    }
    else {
        return 0.0;
    }
}

function confidential() {
    var confidential = ($('#ckb_confidential').is(':checked') ? true : false);
    if (confidential) {
        m_str_dup_cost_info += "Confidential<br/>";
    }
}

function threeHolePunchCost() {
    var three_hole_punch = ($('#ckb_three_hole_punch').is(':checked') ? true : false);
    if (three_hole_punch) {
        m_str_dup_cost_info += "3 Hole Punch<br/>";
    }
}

function stapleCost() {
    var staple = ($('#ckb_staple').is(':checked') ? true : false);
    if (staple) {
        m_str_dup_cost_info += "Staple<br/>";
    }
}

function cutCost() {
    var cut = ($('#ckb_cut').is(':checked') ? true : false);
    if (cut) {
        m_str_dup_cost_info += "Cutting per Cut " + formatDollar(m_cut, 2) + " ";
        return m_cut;
    }
    else {
        return 0.0;
    }
}

////////////////////////////////////////////////////////////////////////////////
function startSpin() {
    spinner.spin(target);
}

function stopSpin() {
    spinner.stop();
}

////////////////////////////////////////////////////////////////////////////////
function sendEmailCancelAdmin() {
    var name = "Jose Delgado";
    var email = "ivcduplicating@ivc.edu";
    
    var subject = m_device + " request has been canceled";
    var message = "Dear " + name + ", <br><br>";
    message += m_device + " request, title <strong>" + $('#request_title').val() + "</strong> has been canceled<br>";    
    message += "Please refresh your admin page.<br><br>";

    message += "Thank you.<br>";
    
    proc_sendEmail(email, name, subject, message);
}

function sendEmailUpdateAdmin(print_request_id) {
    var url_param = "?print_request_id=" + print_request_id;

    var name = "Jose Delgado";
    var email = "ivcduplicating@ivc.edu";
    
    var subject = m_device + " request has been changed";
    var message = "Dear " + name + ", <br><br>";
    message += m_device + " request, title <strong>" + $('#request_title').val() + "</strong> has been changed<br>";    
    message += "Please refresh your admin page and use the link below to open request at anytime.<br><br>";

    message += "<a href='https://services.ivc.edu/DCenter/printRequest.html" + url_param + "'>" + $('#request_title').val() + "</a><br><br>";
    message += "Thank you.<br>";
    
    proc_sendEmail(email, name, subject, message);
}