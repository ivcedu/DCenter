<?php
    require("config.php");

    $query = "SELECT * FROM [IVCDCENTER].[dbo].[Duplex]";

    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetchAll();

    echo json_encode($data);