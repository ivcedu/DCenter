<?php
    require("config.php");
    
    $PrintRequestID = filter_input(INPUT_POST, 'PrintRequestID');
    $PaperTypeID = filter_input(INPUT_POST, 'PaperTypeID');
    $SizeHeight = filter_input(INPUT_POST, 'SizeHeight');
    $SizeWidth = filter_input(INPUT_POST, 'SizeWidth');
    $TotalCost = filter_input(INPUT_POST, 'TotalCost');
    $WavedProof = filter_input(INPUT_POST, 'WavedProof');
    $Note = filter_input(INPUT_POST, 'Note');

    $query = "UPDATE [IVCDCENTER].[dbo].[Plotter] "
                ."SET PaperTypeID = '".$PaperTypeID."', "
                ."SizeHeight = '".$SizeHeight."', "
                ."SizeWidth = '".$SizeWidth."', "
                ."TotalCost = '".$TotalCost."', "
                ."WavedProof = '".$WavedProof."', "
                ."Note = '".$Note."' "
                ."WHERE PrintRequestID = '".$PrintRequestID."'";
    
    $cmd = $dbConn->prepare($query);
    $result = $cmd->execute(); 

    echo json_encode($result);