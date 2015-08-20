var m_bond_cost = 0.00;
var m_glossy_cost = 0.00;
var m_free = false;

var m_letter = 0.03;
var m_letter_color = 0.20;
var m_legal = 0.06;
var m_legal_color = 0.30;
var m_tabloid = 0.10;
var m_tabloid_color = 0.40;

var m_front_cover = 0.05;
var m_front_cover_color = 0.25;
var m_back_cover = 0.05;
var m_back_cover_color = 0.25;
var m_cut = 0.75;

var m_str_dup_cost_info = "";
var m_total_page = 0;
var m_department_id = "";

var m_file_name = "";
var m_base64_data = "";
var m_file_attached = false;

var target;
var spinner;
////////////////////////////////////////////////////////////////////////////////
window.onload = function() {   
    if (localStorage.key(0) !== null) {
        $('#nav_manual').hide();
        $('#plotter_section').hide();
        $('#honor_student').hide();
        $('#duplicating_section').hide();
        $('#dept_section_1').hide();
        $('#dept_section_2').hide();
        $('#dept_section_3').hide();
        
        target = $('#spinner')[0];
        spinner = new Spinner();
        
        getDeviceType();
        getPaperType();
        getDuplex();
        getPaperColor();
        getCoverColor();
        getPaperSize();
        
        setDeviceDetail();
        getUserInformation();
    }
    else {
        window.open('Login.html', '_self');
    }
};

////////////////////////////////////////////////////////////////////////////////
$(document).ready(function() {     
    $('#nav_home').click(function() {
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
        localStorage.clear();
        window.open('Login.html', '_self');
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
    
    // submit button event /////////////////////////////////////////////////////
    $('#btn_submit').click(function() {   
        $('#btn_submit').prop('disabled', true);
        var err = formValidation();
        if (err !== "") {
            alert(err);
            $('#btn_submit').prop('disabled', false);
            return false;
        }
        else {
            if ($('#device_type').val() === "1") {
                var err_1 = plotterValidation();
                if (err_1 !== "") {
                    alert(err_1);
                    $('#btn_submit').prop('disabled', false);
                    return false;
                }
            }
            else {
                var err_2 = duplicatingValidation();
                if (err_2 !== "") {
                    alert(err_2);
                    $('#btn_submit').prop('disabled', false);
                    return false;
                }
            }
        }
        
        startSpin();        
        setTimeout(function() {      
            var print_request_id = addPrintRequest();
            addPDFAttachment(print_request_id);

            if ($('#device_type').val() === "1") {
                addPlotter(print_request_id);
                sendEmailPlotterRequestor(print_request_id);
                sendEmailPlotterAdmin(print_request_id);

                if (m_free) {
                    sendEmailPlotterHonorNotification();
                }
            }
            else {
                addDuplicating(print_request_id);
                db_insertReceipt(print_request_id, m_str_dup_cost_info);
                sendEmailDuplicatingRequestor(print_request_id);
                sendEmailDuplicatingAdmin(print_request_id);
            }
            db_insertTransaction(print_request_id, localStorage.getItem('ls_dc_loginDisplayName'), "Request submitted");
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
    if (!m_file_attached) {
        err += "Attachment is a required field\n";
    }
    if (m_total_page === 0) {
        m_file_attached = false;
        $('#attachment_file').filestyle('clear');
        $('#pdf_pages').val("");
        err += "Your PDF file are not correctly formatted. please verify your pdf file again\n";
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

////////////////////////////////////////////////////////////////////////////////
function getDeviceType() {
    var result = new Array();
    result = db_getDeviceType();
    
    var html = "<option value='0'>Select...</option>";
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

function getMDeptUser() {
    var login_email = localStorage.getItem('ls_dc_loginEmail');
    var result = new Array();
    result = db_getMDeptUserByEmail(login_email);
    
    if (result.length === 1) {
        return true;
    }
    else {
        return false;
    }
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

function getUserInformation() {
    if (localStorage.getItem('ls_dc_loginType') === "Staff") {
        $('#login_type').html("Employee ID:");
        
        var result = new Array();
        result = db_getUserProfile(localStorage.getItem('ls_dc_loginEmail'));
        $('#requestor').val(result[0]['UserName']);
        $('#email').val(result[0]['UserEmail']);
        $('#phone').val(result[0]['UserPhone']);
        $('#login_id').val(result[0]['EmployeeID']);
        m_department_id = result[0]['DepartmentID'];
        
        getDepartment(); 
        $('#department').val(m_department_id);
        $('#department').selectpicker('refresh');
    }
    else {
        $('#login_type').html("Student ID:");
        $('#requestor').val(localStorage.getItem('ls_dc_loginDisplayName'));
        $('#email').val(localStorage.getItem('ls_dc_loginEmail'));
        $('#phone').val(localStorage.getItem('ls_dc_loginPhone'));
        $('#phone').attr("readonly", false);
        $('#login_id').val(localStorage.getItem('ls_dc_loginID'));
    }
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
        $('#depart_section_1').hide();
        $('#depart_section_2').hide();
        $('#depart_section_3').hide();
        setHonorStudent();
        
        $('#device_type').val("1");
        $('#device_type').selectpicker('refresh');
        $('#device_type').attr('disabled', true);
    }
}

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

////////////////////////////////////////////////////////////////////////////////
//function fileAttachment(print_request_id) {
//    var file = $('#attachment_file').get(0).files[0];    
//    var file_data = new FormData();  
//    var f_name = file.name.replace(/#/g, "");
//    var php_flname = print_request_id + "_fileIndex_" + f_name;
//    file_data.append("files[]", file, php_flname); 
//
//    var attachment_id = uploadAttachFile(file_data);
//    if (attachment_id === "") {
//        return false;
//    }
//    else {   
//        var pages = $('#pdf_pages').html();
//        db_updateAttachmentPages(attachment_id, pages);
//        return true;
//    }
//}

function getPDFAttachmentInfo() {
    var file = $('#attachment_file').get(0).files[0];
    var f_name = file.name.replace(/#/g, "");
    
    if (typeof file !== "undefined") { 
        var f_extension = getFileExtension(f_name);
        if (f_extension !== "pdf") {
            alert("Only PDF file can be upload");
            m_file_attached = false;
            $('#attachment_file').filestyle('clear');
            $('#pdf_pages').val("");
            return false;
        } 
        else {   
            if (file.size >= 5000000) {
                alert("Attached file size is too big, max. file size allow is 5Mb or less");
                m_file_attached = false;
                $('#attachment_file').filestyle('clear');
                $('#pdf_pages').val("");
                return false;
            }
            else {
                var file_data = new FormData();
                file_data.append("files[]", file, f_name); 
                m_total_page = pdfGetTotalPages(file_data);
                $('#pdf_pages').html(m_total_page);
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
        m_file_attached = true;
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
        m_letter = 0.025;
        m_letter_color = 0.195;
        m_legal = 0.055;
        m_legal_color = 0.295;
        m_tabloid = 0.95;
        m_tabloid_color = 0.395;
    }
    else {
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
            m_letter = 0.025 + 0.03;
            m_letter_color = 0.195 + 0.03;
            m_legal = 0.055 + 0.03;
            m_legal_color = 0.295 + 0.03;
            m_tabloid = 0.95 + 0.03;
            m_tabloid_color = 0.395 + 0.03;
        }
        else {
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
        m_str_dup_cost_info += "Cutting per Cut : " + formatDollar(m_cut, 2) + "<br/>";
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
function sendEmailPlotterRequestor(print_request_id) {
    var url_param = "?print_request_id=" + print_request_id;
    var name = $('#requestor').val();
    var email = $('#email').val();
    
    var subject = "Your new plotter request has been submitted";
    var message = "Dear " + name + ", <br><br>";
    message += "Thank you for your plotter request.  Request details:<br><br>";
    message += "Contact Phone: " + $('#phone').val() + "<br>";
    message += "Request Title: " + $('#request_title').val() + "<br>";
    message += "Paper Type: " + db_getPaperTypeName($('#paper_type').val()) + "<br>";
    message += "Size: " + $('#size_height').val() + " x " + $('#size_width').val() + "<br>";
    message += "Total Cost: " + $('#plot_total_cost').val() + "<br><br>";
    
    message += "Please use the link below to review the status of your submission at any time.<br><br>";

    //message += "<a href='http://ireport.ivc.edu/DCenter/printRequest.html" + url_param + "'>" + $('#request_title').val() + "</a><br><br>";
    message += "<a href='https://services.ivc.edu/DCenter/printRequest.html" + url_param + "'>" + $('#request_title').val() + "</a><br><br>";
    
    message += "Should you have any questions or comments, please contact the IVC Duplicating Center.<br/><br/>"; 
    message += "Thank you.<br>";
    message += "IVC Duplicating Center<br>";
    message += "ivcduplicating@ivc.edu<br>";
    message += "phone: 949.451.5297";
    
    proc_sendEmail(email, name, subject, message);
}

function sendEmailPlotterAdmin(print_request_id) {
    var url_param = "?print_request_id=" + print_request_id;

    var name = "Jose Delgado";
    var email = "ivcduplicating@ivc.edu";
    
    var subject = "A new plotter request has been created";
    var message = "Dear " + name + ", <br><br>";
    message += "There is a new plotter request.  Request details:<br><br>";
    message += "Requestor: " + $('#requestor').val() + "<br>";
    message += "Contact Phone: " + $('#phone').val() + "<br>";
    message += "Request Title: " + $('#request_title').val() + "<br>";
    message += "Paper Type: " + db_getPaperTypeName($('#paper_type').val()) + "<br>";
    message += "Size: " + $('#size_height').val() + " x " + $('#size_width').val() + "<br>";
    message += "Total Cost: " + $('#plot_total_cost').val() + "<br>";
    message += "Employee Type: " + localStorage.getItem('ls_dc_loginType') + "<br><br>";
    
    message += "Please use the link below to open request at anytime.<br><br>";

    //message += "<a href='http://ireport.ivc.edu/DCenter/printRequest.html" + url_param + "'>" + $('#request_title').val() + "</a><br><br>";
    message += "<a href='https://services.ivc.edu/DCenter/printRequest.html" + url_param + "'>" + $('#request_title').val() + "</a><br><br>";
    message += "Thank you.<br>";
    
    proc_sendEmail(email, name, subject, message);
}

function sendEmailPlotterHonorNotification() {
    var name = "Kay Ryals";
    var email = "kryals@ivc.edu";       //kryals@ivc.edu 
    
    var subject = "A new plotter request from honor student has been submitted";
    var message = "Dear Kay Ryals, <br><br>";
    message += "There is a new plotter request from honor student.  Request details:<br><br>";
    message += "Requestor: " + $('#requestor').val() + "<br>";
    message += "Contact Phone: " + $('#phone').val() + "<br>";
    message += "Request Title: " + $('#request_title').val() + "<br>";
    message += "Paper Type: " + db_getPaperTypeName($('#paper_type').val()) + "<br>";
    message += "Size: " + $('#size_height').val() + " x " + $('#size_width').val() + "<br>";
    message += "Total Cost: " + $('#plot_total_cost').val() + " <strong>Free of Charge</strong><br>";
    message += "Thank you.<br>";
    
    proc_sendEmail(email, name, subject, message);
}

function sendEmailDuplicatingRequestor(print_request_id) {
    var url_param = "?print_request_id=" + print_request_id;
    var name = $('#requestor').val();
    var email = $('#email').val();
    
    var subject = "Your new duplicating request has been submitted";
    var message = "Dear " + name + ", <br><br>";
    message += "Thank you for your duplicating request.  Request details:<br><br>";
    message += "Contact Phone: " + $('#phone').val() + "<br>";
    message += "Request Title: " + $('#request_title').val() + "<br>";
    message += "Date Needed: " + $('#date_needed').val() + " " + $('#time_needed').val() + "<br>";
    message += "Quantity: " + $('#quantity').val() + "<br>";
    
    message += "Please use the link below to review the status of your submission at any time.<br><br>";

    //message += "<a href='http://ireport.ivc.edu/DCenter/printRequest.html" + url_param + "'>" + $('#request_title').val() + "</a><br><br>";
    message += "<a href='https://services.ivc.edu/DCenter/printRequest.html" + url_param + "'>" + $('#request_title').val() + "</a><br><br>";
    
    message += "Should you have any questions or comments, please contact the IVC Duplicating Center.<br/><br/>"; 
    message += "Thank you.<br>";
    message += "IVC Duplicating Center<br>";
    message += "ivcduplicating@ivc.edu<br>";
    message += "phone: 949.451.5297";
    
    proc_sendEmail(email, name, subject, message);
}

function sendEmailDuplicatingAdmin(print_request_id) {
    var url_param = "?print_request_id=" + print_request_id;
    // for testing
    var name = "Jose Delgado";
    var email = "ivcduplicating@ivc.edu";
    
    var subject = "A new duplicating request has been created";
    var message = "Dear " + name + ", <br><br>";
    message += "There is a new duplicating request.  Request details:<br><br>";
    message += "Requestor: " + $('#requestor').val() + "<br>";
    message += "Contact Phone: " + $('#phone').val() + "<br>";
    message += "Email: " + $('#email').val() + "<br>";
    message += "Request Title: " + $('#request_title').val() + "<br>";
    message += "Date Needed: " + $('#date_needed').val() + " " + $('#time_needed').val() + "<br>";
    message += "Quantity: " + $('#quantity').val() + "<br>";
    
    message += "Please use the link below to open request at anytime.<br><br>";

    //message += "<a href='http://ireport.ivc.edu/DCenter/printRequest.html" + url_param + "'>" + $('#request_title').val() + "</a><br><br>";
    message += "<a href='https://services.ivc.edu/DCenter/printRequest.html" + url_param + "'>" + $('#request_title').val() + "</a><br><br>";
    message += "Thank you.<br>";
    
    proc_sendEmail(email, name, subject, message);
}