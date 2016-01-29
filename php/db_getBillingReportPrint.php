<?php
    require("config.php");
    
    $StartDate = filter_input(INPUT_POST, 'StartDate');
    $EndDate = filter_input(INPUT_POST, 'EndDate');
    $DepartmentID = filter_input(INPUT_POST, 'DepartmentID');
    $LoginID = filter_input(INPUT_POST, 'LoginID');
    
    $query = "SELECT prrq.PrintRequestID, prrq.RequestTitle, prrq.Modified, dupl.TotalPrint AS TotalPages, dupl.TotalCost AS TotalCost "
            . "FROM [IVCDCENTER].[dbo].[PrintRequest] AS prrq INNER JOIN [IVCDCENTER].[dbo].[Duplicating] AS dupl ON prrq.PrintRequestID = dupl.PrintRequestID "
            . "INNER JOIN [IVCDCENTER].[dbo].[Department] AS dprt ON dupl.DepartmentID = dprt.DepartmentID "
            . "INNER JOIN [IVCDCENTER].[dbo].[JobStatusDup] AS jstd ON dupl.JobStatusDupID = jstd.JobStatusDupID "
            . "WHERE prrq.LoginType = 'Staff' AND jstd.JobStatusDupID = '5' AND dprt.DepartmentID = '".$DepartmentID."' AND prrq.LoginID = '".$LoginID."' "
            . "AND prrq.Modified BETWEEN '".$StartDate."' AND '".$EndDate."' "
            . "ORDER BY prrq.Modified DESC";

    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetchAll();

    echo json_encode($data);