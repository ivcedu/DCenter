<?php
    require("config.php");
    
    $PrintRequestID = filter_input(INPUT_POST, 'PrintRequestID');
    $DeviceTypeID = filter_input(INPUT_POST, 'DeviceTypeID');

    $query = "UPDATE [IVCDCENTER].[dbo].[PrintRequest] "
                ."SET DeviceTypeID = '".$DeviceTypeID."', "
                ."Modified = getdate() "
                ."WHERE PrintRequestID = '".$PrintRequestID."'";
    
    $cmd = $dbConn->prepare($query);
    $result = $cmd->execute(); 

    echo json_encode($result);