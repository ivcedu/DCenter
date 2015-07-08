<?php
    require("config.php");
    
    $AttachmentID = filter_input(INPUT_POST, 'AttachmentID');
    $Pages = filter_input(INPUT_POST, 'Pages');

    $query = "UPDATE [IVCDCENTER].[dbo].[Attachment] "
                ."SET Pages = '".$Pages."' "
                ."WHERE AttachmentID = '".$AttachmentID."'";
    
    $cmd = $dbConn->prepare($query);
    $result = $cmd->execute(); 

    echo json_encode($result);