<?php
    require("config.php");
    
    $PrintRequestID = filter_input(INPUT_POST, 'PrintRequestID');
    $ReceiptDetail = filter_input(INPUT_POST, 'ReceiptDetail');

    $query = "INSERT INTO [IVCDCENTER].[dbo].[Receipt] (PrintRequestID, ReceiptDetail) "
                ."VALUES ('$PrintRequestID', '$ReceiptDetail')";  
    
    $cmd = $dbConn->prepare($query);
    $cmd->execute();
    $ResultID = $dbConn->lastInsertId();

    echo json_encode($ResultID);