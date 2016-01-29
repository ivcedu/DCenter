<?php
    require("config.php");
    
    $StartDate = filter_input(INPUT_POST, 'StartDate');
    $EndDate = filter_input(INPUT_POST, 'EndDate');
    
    $query = "SELECT dprt.DepartmentID, dprt.Department, SUM(dupl.TotalPrint) AS TotalPages, SUM(dupl.TotalCost) AS TotalCost "
            . "FROM [IVCDCENTER].[dbo].[PrintRequest] AS prrq INNER JOIN [IVCDCENTER].[dbo].[Duplicating] AS dupl ON prrq.PrintRequestID = dupl.PrintRequestID "
            . "INNER JOIN [IVCDCENTER].[dbo].[Department] AS dprt ON dupl.DepartmentID = dprt.DepartmentID "
            . "INNER JOIN [IVCDCENTER].[dbo].[JobStatusDup] AS jstd ON dupl.JobStatusDupID = jstd.JobStatusDupID "
            . "WHERE prrq.LoginType = 'Staff' AND jstd.JobStatusDupID = '5' "
            . "AND prrq.Modified BETWEEN '".$StartDate."' AND '".$EndDate."' "
            . "GROUP BY dprt.DepartmentID, dprt.Department "
            . "ORDER BY dprt.Department ASC";

    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetchAll();

    echo json_encode($data);