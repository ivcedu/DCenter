<?php
    require("config.php");
    
    $DeviceTypeID = filter_input(INPUT_POST, 'DeviceTypeID');
    $DeliveryLocationID = filter_input(INPUT_POST, 'DeliveryLocationID');
    $LoginType = filter_input(INPUT_POST, 'LoginType');
    $LoginID = filter_input(INPUT_POST, 'LoginID');
    $Requestor = filter_input(INPUT_POST, 'Requestor');
    $Email = filter_input(INPUT_POST, 'Email');
    $Phone = filter_input(INPUT_POST, 'Phone');
    $RequestTitle = filter_input(INPUT_POST, 'RequestTitle');

    $query = "INSERT INTO [IVCDCENTER].[dbo].[PrintRequest] (DeviceTypeID, DeliveryLocationID, LoginType, LoginID, Requestor, Email, Phone, RequestTitle) "
                ."VALUES ('$DeviceTypeID', '$DeliveryLocationID', '$LoginType', '$LoginID', '$Requestor', '$Email', '$Phone', '$RequestTitle')";  
    
    $cmd = $dbConn->prepare($query);
    $cmd->execute();
    $ResultID = $dbConn->lastInsertId();

    echo json_encode($ResultID);