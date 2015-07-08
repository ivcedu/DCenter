<?php
    require("config.php");

    $PaperColorID = filter_input(INPUT_POST, 'PaperColorID');
    
    $query = "SELECT PaperColor FROM [IVCDCENTER].[dbo].[PaperColor] WHERE PaperColorID = '" . $PaperColorID . "'";

    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetch();

    echo json_encode($data['PaperColor']);