<?php
    require("config.php");
    
    $PrintRequestID = filter_input(INPUT_POST, 'PrintRequestID');

    $query = "UPDATE [IVCDCENTER].[dbo].[PrintRequest] "
                ."SET Modified = getdate() "
                ."WHERE PrintRequestID = '".$PrintRequestID."'";
    
    $cmd = $dbConn->prepare($query);
    $result = $cmd->execute(); 

    echo json_encode($result);