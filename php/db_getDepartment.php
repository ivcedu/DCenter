<?php
    require("config.php");

    $query = "SELECT * FROM [IVCDCENTER].[dbo].[Department] ORDER BY Department ASC";

    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetchAll();

    echo json_encode($data);