<?php
    require("config.php");
    
    $PrintRequestID = filter_input(INPUT_POST, 'PrintRequestID');
    $DeliveryLocationID = filter_input(INPUT_POST, 'DeliveryLocationID');

    $query = "UPDATE [IVCDCENTER].[dbo].[PrintRequest] "
                ."SET DeliveryLocationID = '".$DeliveryLocationID."', "
                ."Modified = getdate() "
                ."WHERE PrintRequestID = '".$PrintRequestID."'";
    
    $cmd = $dbConn->prepare($query);
    $result = $cmd->execute(); 

    echo json_encode($result);