////////////////////////////////////////////////////////////////////////////////
window.onload = function() {
    $('#login_error').hide();
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
            if (curVersion < 10)
                window.open('browser_not_support.html', '_self');
            break;
        default:     
            break;
    }
    
    if (localStorage.key(0) !== null) {
        if (IsLoginExpired()) {
            window.open('Login.html', '_self');
        }
        else {
            window.open('home.html', '_self');
        }
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
        var url_param = sessionStorage.getItem('ss_dc_url_param');
        
        if(loginInfo()) {
            if (url_param === null) {
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
                window.open(url_param, '_self');
            }
        }
        else {
            $('#login_error').show();
            this.blur();
        }
    });
});

////////////////////////////////////////////////////////////////////////////////
function loginInfo() {   
    var result = new Array();
    var username = $('#username').val().toLowerCase().replace("@ivc.edu", "");
    var password = $('#password').val();
    
    result = getLoginUserInfo("php/login.php", username, password);
    if (result.length === 0) {
        result = getLoginUserInfo("php/login_student.php", username, password);
    }
//    if (result.length === 0) {
//        result = getLoginUserInfo("php/login_saddleback_student.php", username, password);
//    }
    
    if (result.length === 0) {
        return false;
    }
    else {
        var display_name = result[0];
        var email = result[1];
        var phone = result[2];
        var loginID = result[3];
        var depart = result[4];
        var login_type = result[5];

        localData_login(display_name, email, phone, loginID, depart, login_type);
        return true;
    }
}

////////////////////////////////////////////////////////////////////////////////
function getLoginUserInfo(php_file, user, pass) {
    var result = new Array();
    $.ajax({
        type:"POST",
        datatype:"json",
        url:php_file,
        data:{username:user, password:pass},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}