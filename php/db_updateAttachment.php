<?php
    require("config.php");
    ini_set('max_execution_time', 0);
    
    $PrintRequestID = filter_input(INPUT_POST, 'PrintRequestID');
    $FileName = filter_input(INPUT_POST, 'FileName');
    $Pages = filter_input(INPUT_POST, 'Pages');
    $PDFData = filter_input(INPUT_POST, 'PDFData');

    $query = "UPDATE [IVCDCENTER].[dbo].[Attachment] "
                . "SET FileName = '".$FileName."', Pages = '".$Pages."', PDFData = '".$PDFData."' "
                . "WHERE PrintRequestID = '".$PrintRequestID."'";
    
    $cmd = $dbConn->prepare($query);
    $result = $cmd->execute(); 

    echo json_encode($result);