<?php
    require("config.php");
    
    $PrintRequestID = filter_input(INPUT_POST, 'PrintRequestID');
    $Locked = filter_input(INPUT_POST, 'Locked');

    $query = "UPDATE [IVCDCENTER].[dbo].[PrintRequest] "
                ."SET Locked = '".$Locked."', "
                ."Modified = getdate() "
                ."WHERE PrintRequestID = '".$PrintRequestID."'";
    
    $cmd = $dbConn->prepare($query);
    $result = $cmd->execute(); 

    echo json_encode($result);