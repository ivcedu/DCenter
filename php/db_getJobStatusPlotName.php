<?php
    require("config.php");

    $JobStatusPlotID = filter_input(INPUT_POST, 'JobStatusPlotID');
    
    $query = "SELECT JobStatusPlot FROM [IVCDCENTER].[dbo].[JobStatusPlot] WHERE JobStatusPlotID = '" . $JobStatusPlotID . "'";

    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetch();

    echo json_encode($data['JobStatusPlot']);