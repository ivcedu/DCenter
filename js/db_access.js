// LDAP get ////////////////////////////////////////////////////////////////////
function getLoginUserInfo(php_file, user, pass) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:php_file,
        data:{username:user, password:pass},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

// get DB //////////////////////////////////////////////////////////////////////
function db_getDeliveryLocation() {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getDeliveryLocation.php",
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getDeliveryLocationName(DeliveryLocationID) {
    var result = "";
    $.ajax({
        type:"POST",
        url:"php/db_getDeliveryLocationName.php",
        data:{DeliveryLocationID:DeliveryLocationID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getDeviceType() {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getDeviceType.php",
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getDeviceTypeName(DeviceTypeID) {
    var result = "";
    $.ajax({
        type:"POST",
        url:"php/db_getDeviceTypeName.php",
        data:{DeviceTypeID:DeviceTypeID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getJobStatusPlot() {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getJobStatusPlot.php",
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getJobStatusPlotName(JobStatusPlotID) {
    var result = "";
    $.ajax({
        type:"POST",
        url:"php/db_getJobStatusPlotName.php",
        data:{JobStatusPlotID:JobStatusPlotID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getJobStatusDup() {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getJobStatusDup.php",
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getJobStatusDupName(JobStatusDupID) {
    var result = "";
    $.ajax({
        type:"POST",
        url:"php/db_getJobStatusDupName.php",
        data:{JobStatusDupID:JobStatusDupID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getPaperType() {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getPaperType.php",
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getPaperTypeName(PaperTypeID) {
    var result = "";
    $.ajax({
        type:"POST",
        url:"php/db_getPaperTypeName.php",
        data:{PaperTypeID:PaperTypeID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getDuplex() {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getDuplex.php",
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getDuplexName(DuplexID) {
    var result = "";
    $.ajax({
        type:"POST",
        url:"php/db_getDuplexName.php",
        data:{DuplexID:DuplexID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getPaperColor() {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getPaperColor.php",
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getPaperColorName(PaperColorID) {
    var result = "";
    $.ajax({
        type:"POST",
        url:"php/db_getPaperColorName.php",
        data:{PaperColorID:PaperColorID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getCoverColor() {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getCoverColor.php",
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getCoverColorName(CoverColorID) {
    var result = "";
    $.ajax({
        type:"POST",
        url:"php/db_getCoverColorName.php",
        data:{CoverColorID:CoverColorID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getDepartment() {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getDepartment.php",
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getDepartmentID(Department) {
    var result = "";
    $.ajax({
        type:"POST",
        url:"php/db_getDepartmentID.php",
        data:{Department:Department},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getDepartmentName(DepartmentID) {
    var result = "";
    $.ajax({
        type:"POST",
        url:"php/db_getDepartmentName.php",
        data:{DepartmentID:DepartmentID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getPaperSize() {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getPaperSize.php",
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getPaperSizeName(PaperSizeID) {
    var result = "";
    $.ajax({
        type:"POST",
        url:"php/db_getPaperSizeName.php",
        data:{PaperSizeID:PaperSizeID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getAdminByEmail(LoginEmail) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getAdminByEmail.php",
        data:{LoginEmail:LoginEmail},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getAdminByID(AdminID) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getAdminByID.php",
        data:{AdminID:AdminID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getAdminList() {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getAdminList.php",
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getBursarByEmail(LoginEmail) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getBursarByEmail.php",
        data:{LoginEmail:LoginEmail},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getHonorStudentByEmail(LoginEmail) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getHonorStudentByEmail.php",
        data:{LoginEmail:LoginEmail},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getMDeptUserByEmail(LoginEmail) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getMDeptUserByEmail.php",
        data:{LoginEmail:LoginEmail},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getUserPrintRequestList(Email) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getUserPrintRequestList.php",
        data:{Email:Email},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getUserHistoryList(Email) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getUserHistoryList.php",
        data:{Email:Email},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getBursarPrintRequestList() {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getBursarPrintRequestList.php",
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getAdminPrintRequestList() {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getAdminPrintRequestList.php",
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getAdminCompletedList(StartDate, EndDate) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getAdminCompletedList.php",
        data:{StartDate:StartDate, EndDate:EndDate},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getPrintRequest(PrintRequestID) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getPrintRequest.php",
        data:{PrintRequestID:PrintRequestID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getAttachment(PrintRequestID) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getAttachment.php",
        data:{PrintRequestID:PrintRequestID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getPlotter(PrintRequestID) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getPlotter.php",
        data:{PrintRequestID:PrintRequestID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getDuplicating(PrintRequestID) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getDuplicating.php",
        data:{PrintRequestID:PrintRequestID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getTransaction(PrintRequestID) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getTransaction.php",
        data:{PrintRequestID:PrintRequestID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getUserProfile(LoginEmail) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getUserProfile.php",
        data:{LoginEmail:LoginEmail},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getReceipt(PrintRequestID) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getReceipt.php",
        data:{PrintRequestID:PrintRequestID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getBillingReportDepartment(StartDate, EndDate) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getBillingReportDepartment.php",
        data:{StartDate:StartDate, EndDate:EndDate},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getBillingReportUsers(StartDate, EndDate, DepartmentID) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getBillingReportUsers.php",
        data:{StartDate:StartDate, EndDate:EndDate, DepartmentID:DepartmentID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getBillingReportPrint(StartDate, EndDate, DepartmentID, LoginID) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getBillingReportPrint.php",
        data:{StartDate:StartDate, EndDate:EndDate, DepartmentID:DepartmentID, LoginID:LoginID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

// insert DB ///////////////////////////////////////////////////////////////////
function db_insertPrintRequest(DeviceTypeID, DeliveryLocationID, LoginType, LoginID, Requestor, Email, Phone, RequestTitle) {
    var ResultID = "";
    $.ajax({
        type:"POST",
        url:"php/db_insertPrintRequest.php",
        data:{DeviceTypeID:DeviceTypeID, DeliveryLocationID:DeliveryLocationID, LoginType:LoginType, LoginID:LoginID, Requestor:Requestor, Email:Email, Phone:Phone, RequestTitle:RequestTitle},
        async: false,  
        success:function(data) {
            ResultID = JSON.parse(data);
        }
    });
    return ResultID;
}

function db_insertPlotter(PrintRequestID, JobStatusPlotID, PaperTypeID, SizeHeight, SizeWidth, TotalCost, WavedProof, Free, Note) {
    var ResultID = "";
    $.ajax({
        type:"POST",
        url:"php/db_insertPlotter.php",
        data:{PrintRequestID:PrintRequestID, JobStatusPlotID:JobStatusPlotID, PaperTypeID:PaperTypeID, SizeHeight:SizeHeight, SizeWidth:SizeWidth, TotalCost:TotalCost, WavedProof:WavedProof, Free:Free, Note:Note},
        async: false,  
        success:function(data) {
            ResultID = JSON.parse(data);
        }
    });
    return ResultID;
}

function db_insertDuplicating(PrintRequestID, JobStatusDupID, DepartmentID, Quantity, DateNeeded, TimeNeeded, PaperSizeID, DuplexID, PaperColorID, CoverColorID,
                                ColorCopy, FrontCover, BackCover, Confidential, ThreeHolePunch, Staple, Cut, TotalPrint, TotalCost, Note) {
    var ResultID = "";
    $.ajax({
        type:"POST",
        url:"php/db_insertDuplicating.php",
        data:{PrintRequestID:PrintRequestID, JobStatusDupID:JobStatusDupID, DepartmentID:DepartmentID, Quantity:Quantity, DateNeeded:DateNeeded, TimeNeeded:TimeNeeded,
                PaperSizeID:PaperSizeID, DuplexID:DuplexID, PaperColorID:PaperColorID, CoverColorID:CoverColorID, ColorCopy:ColorCopy, FrontCover:FrontCover, 
                BackCover:BackCover, Confidential:Confidential, ThreeHolePunch:ThreeHolePunch, Staple:Staple, Cut:Cut, TotalPrint:TotalPrint, TotalCost:TotalCost, Note:Note},
        async: false,  
        success:function(data) {
            ResultID = JSON.parse(data);
        }
    });
    return ResultID;
}

function db_insertTransaction(PrintRequestID, LoginName, Note) {
    var ResultID = "";
    $.ajax({
        type:"POST",
        url:"php/db_insertTransaction.php",
        data:{PrintRequestID:PrintRequestID, LoginName:LoginName, Note:Note},
        async: false,  
        success:function(data) {
            ResultID = JSON.parse(data);
        }
    });
    return ResultID;
}

function db_insertUserProfile(UserName, UserEmail, UserPhone, EmployeeID, DepartmentID) {
    var ResultID = "";
    $.ajax({
        type:"POST",
        url:"php/db_insertUserProfile.php",
        data:{UserName:UserName, UserEmail:UserEmail, UserPhone:UserPhone, EmployeeID:EmployeeID, DepartmentID:DepartmentID},
        async: false,  
        success:function(data) {
            ResultID = JSON.parse(data);
        }
    });
    return ResultID;
}

function db_insertAttachment(PrintRequestID, FileName, Pages, PDFData) {
    var ResultID = "";
    $.ajax({
        type:"POST",
        url:"php/db_insertAttachment.php",
        data:{PrintRequestID:PrintRequestID, FileName:FileName, Pages:Pages, PDFData:PDFData},
        async: false,  
        success:function(data) {
            ResultID = JSON.parse(data);
        }
    });
    return ResultID;
}

function db_insertReceipt(PrintRequestID, ReceiptDetail) {
    var ResultID = "";
    $.ajax({
        type:"POST",
        url:"php/db_insertReceipt.php",
        data:{PrintRequestID:PrintRequestID, ReceiptDetail:ReceiptDetail},
        async: false,  
        success:function(data) {
            ResultID = JSON.parse(data);
        }
    });
    return ResultID;
}

function db_insertAdmin(AdminName, AdminEmail, AdminLevel) {
    var ResultID = "";
    $.ajax({
        type:"POST",
        url:"php/db_insertAdmin.php",
        data:{AdminName:AdminName, AdminEmail:AdminEmail, AdminLevel:AdminLevel},
        async: false,  
        success:function(data) {
            ResultID = JSON.parse(data);
        }
    });
    return ResultID;
}

// update DB ///////////////////////////////////////////////////////////////////
function db_updatePrintRequestDevice(PrintRequestID, DeviceTypeID) {
    var Result = false;
    $.ajax({
        type:"POST",
        url:"php/db_updatePrintRequestDevice.php",
        data:{PrintRequestID:PrintRequestID, DeviceTypeID:DeviceTypeID},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}

function db_updatePrintRequestDelivery(PrintRequestID, DeliveryLocationID) {
    var Result = false;
    $.ajax({
        type:"POST",
        url:"php/db_updatePrintRequestDelivery.php",
        data:{PrintRequestID:PrintRequestID, DeliveryLocationID:DeliveryLocationID},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}

function db_updatePrintRequestModified(PrintRequestID) {
    var Result = false;
    $.ajax({
        type:"POST",
        url:"php/db_updatePrintRequestModified.php",
        data:{PrintRequestID:PrintRequestID},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}

function db_updatePlotter(PrintRequestID, JobStatusPlotID) {
    var Result = false;
    $.ajax({
        type:"POST",
        url:"php/db_updatePlotter.php",
        data:{PrintRequestID:PrintRequestID, JobStatusPlotID:JobStatusPlotID},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}

function db_updateDuplicating(PrintRequestID, JobStatusDupID) {
    var Result = false;
    $.ajax({
        type:"POST",
        url:"php/db_updateDuplicating.php",
        data:{PrintRequestID:PrintRequestID, JobStatusDupID:JobStatusDupID},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}

function db_updateDepartment(PrintRequestID, DepartmentID) {
    var Result = false;
    $.ajax({
        type:"POST",
        url:"php/db_updateDepartment.php",
        data:{PrintRequestID:PrintRequestID, DepartmentID:DepartmentID},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}

function db_updateAttachmentPages(AttachmentID, Pages) {
    var Result = false;
    $.ajax({
        type:"POST",
        url:"php/db_updateAttachmentPages.php",
        data:{AttachmentID:AttachmentID, Pages:Pages},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}

function db_updateUserProfile(UserProfileID, UserName, UserEmail, UserPhone, EmployeeID, DepartmentID) {
    var Result = false;
    $.ajax({
        type:"POST",
        url:"php/db_updateUserProfile.php",
        data:{UserProfileID:UserProfileID, UserName:UserName, UserEmail:UserEmail, UserPhone:UserPhone, EmployeeID:EmployeeID, DepartmentID:DepartmentID},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}

function db_updateDuplicatingRequest(PrintRequestID, DepartmentID, Quantity, DateNeeded, TimeNeeded, PaperSizeID, DuplexID, PaperColorID, CoverColorID,
                                ColorCopy, FrontCover, BackCover, Confidential, ThreeHolePunch, Staple, Cut, TotalPrint, TotalCost, Note) {
    var Result = false;
    $.ajax({
        type:"POST",
        url:"php/db_updateDuplicatingRequest.php",
        data:{PrintRequestID:PrintRequestID, DepartmentID:DepartmentID, Quantity:Quantity, DateNeeded:DateNeeded, TimeNeeded:TimeNeeded,
                PaperSizeID:PaperSizeID, DuplexID:DuplexID, PaperColorID:PaperColorID, CoverColorID:CoverColorID, ColorCopy:ColorCopy, FrontCover:FrontCover, 
                BackCover:BackCover, Confidential:Confidential, ThreeHolePunch:ThreeHolePunch, Staple:Staple, Cut:Cut, TotalPrint:TotalPrint, TotalCost:TotalCost, Note:Note},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}

function db_updatePlotterRequest(PrintRequestID, PaperTypeID, SizeHeight, SizeWidth, TotalCost, WavedProof, Note) {
    var Result = false;
    $.ajax({
        type:"POST",
        url:"php/db_updatePlotterRequest.php",
        data:{PrintRequestID:PrintRequestID, PaperTypeID:PaperTypeID, SizeHeight:SizeHeight, SizeWidth:SizeWidth, TotalCost:TotalCost, WavedProof:WavedProof, Note:Note},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}

function db_updatePrintRequestLocked(PrintRequestID, Locked) {
    var Result = false;
    $.ajax({
        type:"POST",
        url:"php/db_updatePrintRequestLocked.php",
        data:{PrintRequestID:PrintRequestID, Locked:Locked},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}

function db_updateReceipt(PrintRequestID, ReceiptDetail) {
    var Result = false;
    $.ajax({
        type:"POST",
        url:"php/db_updateReceipt.php",
        data:{PrintRequestID:PrintRequestID, ReceiptDetail:ReceiptDetail},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}

function db_updateAdmin(AdminID, AdminName, AdminEmail, AdminLevel) {
    var Result = false;
    $.ajax({
        type:"POST",
        url:"php/db_updateAdmin.php",
        data:{AdminID:AdminID, AdminName:AdminName, AdminEmail:AdminEmail, AdminLevel:AdminLevel},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}

// delete DB ///////////////////////////////////////////////////////////////////
function db_deleteAttachment(PrintRequestID) {
    var Result = false;
    $.ajax({
        type:"POST",
        url:"php/db_deleteAttachment.php",
        data:{PrintRequestID:PrintRequestID},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}

function db_deleteDuplicating(PrintRequestID) {
    var Result = false;
    $.ajax({
        type:"POST",
        url:"php/db_deleteDuplicating.php",
        data:{PrintRequestID:PrintRequestID},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}

function db_deletePlotter(PrintRequestID) {
    var Result = false;
    $.ajax({
        type:"POST",
        url:"php/db_deletePlotter.php",
        data:{PrintRequestID:PrintRequestID},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}

function db_deletePrintRequest(PrintRequestID) {
    var Result = false;
    $.ajax({
        type:"POST",
        url:"php/db_deletePrintRequest.php",
        data:{PrintRequestID:PrintRequestID},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}

function db_deleteAdmin(AdminID) {
    var Result = false;
    $.ajax({
        type:"POST",
        url:"php/db_deleteAdmin.php",
        data:{AdminID:AdminID},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}

// upload attach file //////////////////////////////////////////////////////////
function uploadAttachFile(file_data) {
    var Result = "";
    $.ajax({  
        url: "php/upload_attach_file.php",  
        type: "POST",  
        data: file_data,
        processData: false,  
        contentType: false,  
        async: false,
        success:function(data) {
            Result = JSON.parse(data);
        }  
    });
    return Result;
}

function deleteAttachFile(FileLinkName) {
    var Result = false;
    $.ajax({  
        url: "php/delete_attach_file.php",  
        type: "POST",
        data:{FileLinkName:FileLinkName},
        async: false,
        success:function(data) {
            Result = JSON.parse(data);
        }  
    });
    return Result;
}

function pdfGetTotalPages(file_data) {
    var Result = "";
    $.ajax({  
        url: "php/pdf_getTotalPages.php",  
        type: "POST",  
        data: file_data,
        processData: false,  
        contentType: false,  
        async: false,
        success:function(data) {
            Result = JSON.parse(data);
        }  
    });
    return Result;
}