<?php
    require("config.php");
    
    $AdminName = filter_input(INPUT_POST, 'AdminName');
    $AdminEmail = filter_input(INPUT_POST, 'AdminEmail');
    $AdminLevel = filter_input(INPUT_POST, 'AdminLevel');

    $query = "INSERT INTO [IVCDCENTER].[dbo].[Admin] (AdminName, AdminEmail, AdminLevel) "
                ."VALUES ('$AdminName', '$AdminEmail', '$AdminLevel')";  
    
    $cmd = $dbConn->prepare($query);
    $cmd->execute();
    $ResultID = $dbConn->lastInsertId();

    echo json_encode($ResultID);