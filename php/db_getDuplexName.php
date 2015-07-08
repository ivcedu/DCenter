<?php
    require("config.php");

    $DuplexID = filter_input(INPUT_POST, 'DuplexID');
    
    $query = "SELECT Duplex FROM [IVCDCENTER].[dbo].[Duplex] WHERE DuplexID = '" . $DuplexID . "'";

    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetch();

    echo json_encode($data['Duplex']);