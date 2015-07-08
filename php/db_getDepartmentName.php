<?php
    require("config.php");

    $DepartmentID = filter_input(INPUT_POST, 'DepartmentID');
    
    $query = "SELECT Department FROM [IVCDCENTER].[dbo].[Department] WHERE DepartmentID = '" . $DepartmentID . "'";

    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetch();

    echo json_encode($data['Department']);