<?php
    require("config.php");
    
    $PrintRequestID = filter_input(INPUT_POST, 'PrintRequestID');
    $ReceiptDetail = filter_input(INPUT_POST, 'ReceiptDetail');

    $query = "UPDATE [IVCDCENTER].[dbo].[Receipt] "
                ."SET ReceiptDetail = '".$ReceiptDetail."' "
                ."WHERE PrintRequestID = '".$PrintRequestID."'";
    
    $cmd = $dbConn->prepare($query);
    $result = $cmd->execute(); 

    echo json_encode($result);