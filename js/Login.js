////////////////////////////////////////////////////////////////////////////////
window.onload = function() {
    var curBrowser = bowser.name;
    var curVersion = Number(bowser.version);
    
    switch (curBrowser) {
        case "Safari":
            if (curVersion < 5)
                window.open('browser_not_support.html', '_self');
            break;
        case "Chrome":
            if (curVersion < 7)
                window.open('browser_not_support.html', '_self');
            break;
        case "Firefox":
            if (curVersion < 22)
                window.open('browser_not_support.html', '_self');
            break;
        case "Internet Explorer":
            if (curVersion < 11)
                window.open('browser_not_support.html', '_self');
            break;
        default:     
            break;
    }
};

////////////////////////////////////////////////////////////////////////////////
$(document).ready(function() {  
    // enter key to login
    $('#password').keypress(function (e) {
        if(e.keyCode === 13){
            $('#btn_login').click();
        }
    });
    
    $('#btn_login').click(function() {
        var login_error = loginInfo();
        if(login_error === "") {
            var user_type = localStorage.getItem('ls_dc_loginType');
            if (user_type === "Staff") {
                var result = new Array();
                result = db_getUserProfile(localStorage.getItem('ls_dc_loginEmail'));

                if (result.length === 0) {
                    window.open('userProfile.html', '_self');
                }
                else {
                    window.open('home.html', '_self');
                }
            }
            else {
                window.open('home.html', '_self');
            }
        }
        else {
            $('#login_error').html(login_error);
            this.blur();
        }
    });
});

////////////////////////////////////////////////////////////////////////////////
function loginInfo() {   
    var result = new Array();
    var username = $('#username').val().toLowerCase();
    var password = $('#password').val();
    var error = loginEmailValidation(username);
    if(error !== "") {
        return error;
    }
    
    var result = new Array();
    if (username.indexOf("@ivc.edu") >= 1) {
        username = username.replace("@ivc.edu", "");
        result = getLoginUserInfo("php/login.php", username, password);
        if (result.length === 0) {
            result = getLoginUserInfo("php/login_student.php", username, password);
        }
    }
    else {
        username = username.replace("@saddleback.edu", "");
        result = getLoginUserInfo("php/login_saddleback.php", username, password);
        if (result.length === 0) {
            result = getLoginUserInfo("php/login_student_saddleback.php", username, password);
        }
    } 
    
    if (result.length === 0) {
        return "Invalid Email or Password";
    }
    else {
        var display_name = result[0];
        var email = result[1];
        var phone = result[2];
        var loginID = result[3];
        var depart = result[4];
        var login_type = result[5];
        
        if (email === null || typeof email === 'undefined') {
            return "AD Login System Error";
        }
        else {
            localData_login(display_name, email, phone, loginID, depart, login_type);
            return "";
        }
    }
}

////////////////////////////////////////////////////////////////////////////////
function loginEmailValidation(login_email) {    
    if (login_email.indexOf("@ivc.edu") !== -1 || login_email.indexOf("@saddleback.edu") !== -1) {
        return "";
    }
    else {
        return "Invalid Email";
    }
}