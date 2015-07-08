<?php
    require("config.php");
    
    $PrintRequestID = filter_input(INPUT_POST, 'PrintRequestID');
    
    $query = "DELETE [IVCDCENTER].[dbo].[Duplicating] WHERE PrintRequestID = '".$PrintRequestID ."'";
    $cmd = $dbConn->prepare($query);
    $result = $cmd->execute();           

    echo json_encode($result);