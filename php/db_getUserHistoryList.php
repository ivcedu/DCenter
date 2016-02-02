<?php
    require("config.php");
    
    $Email = filter_input(INPUT_POST, 'Email');
    
    $query = "SELECT prrq.PrintRequestID, prrq.RequestTitle, prrq.Modified, dvtp.DeviceType, jstp.JobStatusPlot, pltt.TotalCost AS PlotTotalCost, jstd.JobStatusDup, dupl.TotalCost AS DupTotalCost "
            . "FROM [IVCDCENTER].[dbo].[PrintRequest] AS prrq LEFT JOIN [IVCDCENTER].[dbo].[DeviceType] AS dvtp ON prrq.DeviceTypeID = dvtp.DeviceTypeID "
            . "LEFT JOIN [IVCDCENTER].[dbo].[Plotter] AS pltt ON prrq.PrintRequestID = pltt.PrintRequestID "
            . "LEFT JOIN [IVCDCENTER].[dbo].[JobStatusPlot] AS jstp ON pltt.JobStatusPlotID = jstp.JobStatusPlotID "
            . "LEFT JOIN [IVCDCENTER].[dbo].[Duplicating] AS dupl ON prrq.PrintRequestID = dupl.PrintRequestID "
            . "LEFT JOIN [IVCDCENTER].[dbo].[JobStatusDup] AS jstd ON dupl.JobStatusDupID = jstd.JobStatusDupID "
            . "WHERE (jstp.JobStatusPlotID = '8' OR jstp.JobStatusPlotID = '9' OR jstd.JobStatusDupID = '5' OR jstd.JobStatusDupID = '6') AND prrq.Email = '" . $Email . "' "
            . "ORDER BY prrq.Modified DESC";

    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetchAll();

    echo json_encode($data);