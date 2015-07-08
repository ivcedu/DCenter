var m_user_profile_id = "";

////////////////////////////////////////////////////////////////////////////////
window.onload = function() {   
    if (localStorage.key(0) !== null) {
        getDepartment();
        setUserInfomation();
    }
    else {
        window.open('Login.html', '_self');
    }
};

////////////////////////////////////////////////////////////////////////////////
$(document).ready(function() {
    $('#btn_save').click(function() {
        var err = formValidation();
        if (err !== "") {
            alert(err);
            return false;
        }
        
        updateUserProfile();
        window.open('home.html', '_self');
    });
    
    $('#btn_close').click(function() {
        if (m_user_profile_id === "") {
            localStorage.clear();
            window.open('Login.html', '_self');
        }
        else {
            window.open('home.html', '_self');
        }
    });
});

////////////////////////////////////////////////////////////////////////////////
function formValidation() {
    var err = "";

    if ($('#up_name').val().replace(/\s+/g, '') === "") {
        err += "Your name is a required field\n";
    }
    if ($('#up_email').val().replace(/\s+/g, '') === "") {
        err += "Email address is a required field\n";
    }
    if ($('#up_phone').val().replace(/\s+/g, '') === "") {
        err += "Phone number is a required field\n";
    }
    if ($('#up_employee_id').val().replace(/\s+/g, '') === "") {
        err += "Employee ID is a required field\n";
    }
    if ($('#up_department').val() === "0") {
        err += "Department is a required field\n";
    }

    return err;
}

////////////////////////////////////////////////////////////////////////////////
function setUserInfomation() {
    var result = new Array();
    result = db_getUserProfile(localStorage.getItem('ls_dc_loginEmail'));
    
    if (result.length === 0) {
        $('#up_name').val(localStorage.getItem('ls_dc_loginDisplayName'));
        $('#up_email').val(localStorage.getItem('ls_dc_loginEmail'));
        $('#up_phone').val(localStorage.getItem('ls_dc_loginPhone'));
        $('#up_employee_id').val(localStorage.getItem('ls_dc_loginID'));
    }
    else {
        m_user_profile_id = result[0]['UserProfileID'];
        $('#up_name').val(result[0]['UserName']);
        $('#up_email').val(result[0]['UserEmail']);
        $('#up_phone').val(result[0]['UserPhone']);
        $('#up_employee_id').val(result[0]['EmployeeID']);        
        $('#up_department').val(result[0]['DepartmentID']);
        $('#up_department').selectpicker('refresh');
    }
}

////////////////////////////////////////////////////////////////////////////////
function getDepartment() {
    var result = new Array();
    result = db_getDepartment();
    
    $('#up_department').empty();
    var html = "<option value='0'>Select...</option>";
    for (var i = 0; i < result.length; i++) {
        html += "<option value='" + result[i]['DepartmentID'] + "'>" + result[i]['Department'] + "</option>";
    }
    
    $('#up_department').append(html);
    $('#up_department').selectpicker('refresh');
}

////////////////////////////////////////////////////////////////////////////////
function updateUserProfile() {
    var name = textReplaceApostrophe($('#up_name').val());
    var email = textReplaceApostrophe($('#up_email').val());
    var phone = textReplaceApostrophe($('#up_phone').val());
    var employee_id = textReplaceApostrophe($('#up_employee_id').val());
    var depart_id = $('#up_department').val();
    
    if (m_user_profile_id === "") {
        db_insertUserProfile(name, email, phone, employee_id, depart_id);
    }
    else {
        db_updateUserProfile(m_user_profile_id, name, email, phone, employee_id, depart_id);
    }
}