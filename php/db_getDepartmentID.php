<?php
    require("config.php");

    $Department = filter_input(INPUT_POST, 'Department');
    
    $query = "SELECT DepartmentID FROM [IVCDCENTER].[dbo].[Department] WHERE Department = '" . $Department . "'";

    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetch();

    echo json_encode($data['DepartmentID']);