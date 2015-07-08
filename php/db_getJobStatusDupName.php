<?php
    require("config.php");

    $JobStatusDupID = filter_input(INPUT_POST, 'JobStatusDupID');
    
    $query = "SELECT JobStatusDup FROM [IVCDCENTER].[dbo].[JobStatusDup] WHERE JobStatusDupID = '" . $JobStatusDupID . "'";

    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetch();

    echo json_encode($data['JobStatusDup']);