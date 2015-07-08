<?php
    require("config.php");

    $CoverColorID = filter_input(INPUT_POST, 'CoverColorID');
    
    $query = "SELECT CoverColor FROM [IVCDCENTER].[dbo].[CoverColor] WHERE CoverColorID = '" . $CoverColorID . "'";

    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetch();

    echo json_encode($data['CoverColor']);