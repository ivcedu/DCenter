<?php
    require("config.php");
    
    $StartDate = filter_input(INPUT_POST, 'StartDate');
    $EndDate = filter_input(INPUT_POST, 'EndDate');
    
    $query = "SELECT prrq.PrintRequestID, prrq.RequestTitle, prrq.Requestor, prrq.Modified, prrq.DeviceTypeID, dvtp.DeviceType, jstp.JobStatusPlot, pltt.TotalCost AS PlotTotalCost, jstd.JobStatusDup, dupl.TotalCost AS DupTotalCost "
            . "FROM [IVCDCENTER].[dbo].[PrintRequest] AS prrq LEFT JOIN [IVCDCENTER].[dbo].[DeviceType] AS dvtp ON prrq.DeviceTypeID = dvtp.DeviceTypeID "
            . "LEFT JOIN [IVCDCENTER].[dbo].[Plotter] AS pltt ON prrq.PrintRequestID = pltt.PrintRequestID "
            . "LEFT JOIN [IVCDCENTER].[dbo].[JobStatusPlot] AS jstp ON pltt.JobStatusPlotID = jstp.JobStatusPlotID "
            . "LEFT JOIN [IVCDCENTER].[dbo].[Duplicating] AS dupl ON prrq.PrintRequestID = dupl.PrintRequestID "
            . "LEFT JOIN [IVCDCENTER].[dbo].[JobStatusDup] AS jstd ON dupl.JobStatusDupID = jstd.JobStatusDupID "
            . "WHERE (jstp.JobStatusPlotID = '8' OR jstp.JobStatusPlotID = '9' OR jstd.JobStatusDupID = '5' OR jstd.JobStatusDupID = '6') "
            . "AND prrq.Modified BETWEEN '".$StartDate."' AND '".$EndDate."' "
            . "ORDER BY prrq.PrintRequestID DESC";

    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetchAll();

    echo json_encode($data);