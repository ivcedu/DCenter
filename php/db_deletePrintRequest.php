<?php
    require("config.php");
    
    $PrintRequestID = filter_input(INPUT_POST, 'PrintRequestID');
    
    $query1 = "DELETE [IVCDCENTER].[dbo].[Attachment] WHERE PrintRequestID = '".$PrintRequestID ."'";
    $query2 = "DELETE [IVCDCENTER].[dbo].[Duplicating] WHERE PrintRequestID = '".$PrintRequestID ."'";
    $query3 = "DELETE [IVCDCENTER].[dbo].[Plotter] WHERE PrintRequestID = '".$PrintRequestID ."'";
    $query4 = "DELETE [IVCDCENTER].[dbo].[PrintRequest] WHERE PrintRequestID = '".$PrintRequestID ."'";
    $query5 = "DELETE [IVCDCENTER].[dbo].[Transaction] WHERE PrintRequestID = '".$PrintRequestID ."'";
    $query6 = "DELETE [IVCDCENTER].[dbo].[Receipt] WHERE PrintRequestID = '".$PrintRequestID ."'";
    
    $cmd = $dbConn->prepare($query1);
    $result = $cmd->execute();
    
    $cmd = $dbConn->prepare($query2);
    $result = $cmd->execute();
    
    $cmd = $dbConn->prepare($query3);
    $result = $cmd->execute();
    
    $cmd = $dbConn->prepare($query4);
    $result = $cmd->execute();
    
    $cmd = $dbConn->prepare($query5);
    $result = $cmd->execute();
    
    $cmd = $dbConn->prepare($query6);
    $result = $cmd->execute();

    echo json_encode($result);