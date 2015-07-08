<?php
    require("config.php");
    
    $UserName = filter_input(INPUT_POST, 'UserName');
    $UserEmail = filter_input(INPUT_POST, 'UserEmail');
    $UserPhone = filter_input(INPUT_POST, 'UserPhone');
    $EmployeeID = filter_input(INPUT_POST, 'EmployeeID');
    $DepartmentID = filter_input(INPUT_POST, 'DepartmentID');

    $query = "INSERT INTO [IVCDCENTER].[dbo].[UserProfile] (UserName, UserEmail, UserPhone, EmployeeID, DepartmentID) "
                ."VALUES ('$UserName', '$UserEmail', '$UserPhone', '$EmployeeID', '$DepartmentID')";  
    
    $cmd = $dbConn->prepare($query);
    $cmd->execute();
    $ResultID = $dbConn->lastInsertId();

    echo json_encode($ResultID);