var admin_id = "";

////////////////////////////////////////////////////////////////////////////////
window.onload = function() {   
    if (localStorage.key(0) !== null) {
        $('#mod_dialog_box').modal('hide');
        getAdminList();
        initializeTable();
    }
    else {
        window.open('Login.html', '_self');
    }
};

////////////////////////////////////////////////////////////////////////////////
function initializeTable() {
    $("#tbl_user_access_list").tablesorter({ });
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
    
    // new admin button click //////////////////////////////////////////////////
    $('#btn_new_admin').click(function() { 
        admin_id = "";
        $('#mod_btn_delete').hide();
        clearModalSection();
        $('#mod_dialog_box_header').html("New User Setting");
        $('#mod_dialog_box').modal('show');
        return false;
    });
    
    // table edit button click ///////////////////////////////////////////////
    $('table').on('click', '[id^="admin_id_"]', function() {
        admin_id = $(this).attr('id').replace("admin_id_", "");
        var result = new Array();
        result = db_getAdminByID(admin_id);
        $('#mod_btn_delete').show();
        clearModalSection();
        $('#mod_dialog_box_header').html("Edit User Setting");
        $('#mod_admin_name').val(result[0]['AdminName']);
        $('#mod_admin_email').val(result[0]['AdminEmail']);
        $('#drp_access_level').val(result[0]['AdminLevel']);
        $('#drp_access_level').selectpicker('refresh');
        $('#mod_dialog_box').modal('show');
        return false;
    });
    
    // modal save button click /////////////////////////////////////////////////
    $('#mod_btn_save').click(function() { 
        var admin_name = textReplaceApostrophe($.trim($('#mod_admin_name').val()));
        var admin_email = textReplaceApostrophe($.trim($('#mod_admin_email').val()));
        var admin_level = $('#drp_access_level').val();
        if (admin_id === "") {
            db_insertAdmin(admin_name, admin_email, admin_level);
        }
        else {
            db_updateAdmin(admin_id, admin_name, admin_email, admin_level);
        }
        
        getAdminList();
        $('#mod_dialog_box').modal('hide');
        return false;
    });
    
    // modal delete button click ///////////////////////////////////////////////
    $('#mod_btn_delete').click(function() { 
        db_deleteAdmin(admin_id);
        
        getAdminList();
        $('#mod_dialog_box').modal('hide');
        return false;
    });
    
    // selectpicker
    $('.selectpicker').selectpicker();
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getAdminList() {    
    var result = new Array(); 
    result = db_getAdminList();
    
    $("#body_tr").empty();
    var body_html = "";
    for(var i = 0; i < result.length; i++) { 
        body_html += setAdminListHTML(result[i]['AdminID'], result[i]['AdminName'], result[i]['AdminEmail'], result[i]['AdminLevel']);
    }
    
    $("#body_tr").append(body_html);
    $("#tbl_user_access_list").trigger("update");
}

function setAdminListHTML(admin_id, admin_name, admin_email, admin_level) {   
    var tbl_html = "<tr>";
    tbl_html += "<td class='span4'>" + admin_name + "</td>";
    tbl_html += "<td class='span4'>" + admin_email + "</td>";
    tbl_html += "<td class='span2'>" + admin_level + "</td>";
    tbl_html += "<td class='span2' style='text-align: center'><a href=# id='admin_id_" + admin_id + "'><i class='icon-edit icon-black'></i></a></td>";
    tbl_html += "</tr>";
    return tbl_html;
}

////////////////////////////////////////////////////////////////////////////////
function clearModalSection() {
    $('#mod_dialog_box_header').html("");
    $('#mod_admin_name').val("");
    $('#mod_admin_email').val("");
    $('#drp_access_level').val("Select...");
    $('#drp_access_level').selectpicker('refresh');
}