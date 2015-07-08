<?php
    require("config.php");
    
    $PrintRequestID = filter_input(INPUT_POST, 'PrintRequestID');
    $JobStatusPlotID = filter_input(INPUT_POST, 'JobStatusPlotID');
    $PaperTypeID = filter_input(INPUT_POST, 'PaperTypeID');
    $SizeHeight = filter_input(INPUT_POST, 'SizeHeight');
    $SizeWidth = filter_input(INPUT_POST, 'SizeWidth');
    $TotalCost = filter_input(INPUT_POST, 'TotalCost');
    $WavedProof = filter_input(INPUT_POST, 'WavedProof');
    $Free = filter_input(INPUT_POST, 'Free');
    $Note = filter_input(INPUT_POST, 'Note');

    $query = "INSERT INTO [IVCDCENTER].[dbo].[Plotter] (PrintRequestID, JobStatusPlotID, PaperTypeID, SizeHeight, SizeWidth, TotalCost, WavedProof, Free, Note) "
                ."VALUES ('$PrintRequestID', '$JobStatusPlotID', '$PaperTypeID', '$SizeHeight', '$SizeWidth', '$TotalCost', '$WavedProof', '$Free', '$Note')";  
    
    $cmd = $dbConn->prepare($query);
    $cmd->execute();
    $ResultID = $dbConn->lastInsertId();

    echo json_encode($ResultID);