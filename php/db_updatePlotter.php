<?php
    require("config.php");
    
    $PrintRequestID = filter_input(INPUT_POST, 'PrintRequestID');
    $JobStatusPlotID = filter_input(INPUT_POST, 'JobStatusPlotID');

    $query = "UPDATE [IVCDCENTER].[dbo].[Plotter] "
                ."SET JobStatusPlotID = '".$JobStatusPlotID."' "
                ."WHERE PrintRequestID = '".$PrintRequestID."'";
    
    $cmd = $dbConn->prepare($query);
    $result = $cmd->execute(); 

    echo json_encode($result);