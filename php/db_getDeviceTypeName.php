<?php
    require("config.php");

    $DeviceTypeID = filter_input(INPUT_POST, 'DeviceTypeID');
    
    $query = "SELECT DeviceType FROM [IVCDCENTER].[dbo].[DeviceType] WHERE DeviceTypeID = '" . $DeviceTypeID . "'";

    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetch();

    echo json_encode($data['DeviceType']);