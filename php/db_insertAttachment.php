<?php
    require("config.php");
    
    $PrintRequestID = filter_input(INPUT_POST, 'PrintRequestID');
    $FileName = filter_input(INPUT_POST, 'FileName');
    $Pages = filter_input(INPUT_POST, 'Pages');
    $PDFData = filter_input(INPUT_POST, 'PDFData');

    $query = "INSERT INTO [IVCDCENTER].[dbo].[Attachment] (PrintRequestID, FileName, Pages, PDFData) "
                ."VALUES ('$PrintRequestID', '$FileName', '$Pages', '$PDFData')";  
    
    $cmd = $dbConn->prepare($query);
    $cmd->execute();
    $ResultID = $dbConn->lastInsertId();

    echo json_encode($ResultID);