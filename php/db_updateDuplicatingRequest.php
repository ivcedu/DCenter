<?php
    require("config.php");
    
    $PrintRequestID = filter_input(INPUT_POST, 'PrintRequestID');
    $DepartmentID = filter_input(INPUT_POST, 'DepartmentID');
    $Quantity = filter_input(INPUT_POST, 'Quantity');
    $DateNeeded = filter_input(INPUT_POST, 'DateNeeded');
    $TimeNeeded = filter_input(INPUT_POST, 'TimeNeeded');
    $PaperSizeID = filter_input(INPUT_POST, 'PaperSizeID');
    $DuplexID = filter_input(INPUT_POST, 'DuplexID');
    $PaperColorID = filter_input(INPUT_POST, 'PaperColorID');
    $CoverColorID = filter_input(INPUT_POST, 'CoverColorID');
    $ColorCopy = filter_input(INPUT_POST, 'ColorCopy');
    $FrontCover = filter_input(INPUT_POST, 'FrontCover');
    $BackCover = filter_input(INPUT_POST, 'BackCover');
    $Confidential = filter_input(INPUT_POST, 'Confidential');
    $ThreeHolePunch = filter_input(INPUT_POST, 'ThreeHolePunch');
    $Staple = filter_input(INPUT_POST, 'Staple');
    $Cut = filter_input(INPUT_POST, 'Cut');
    $TotalPrint = filter_input(INPUT_POST, 'TotalPrint');
    $TotalCost = filter_input(INPUT_POST, 'TotalCost');
    $Note = filter_input(INPUT_POST, 'Note');

    $query = "UPDATE [IVCDCENTER].[dbo].[Duplicating] "
                ."SET DepartmentID = '".$DepartmentID."', "
                ."Quantity = '".$Quantity."', "
                ."DateNeeded = '".$DateNeeded."', "
                ."TimeNeeded = '".$TimeNeeded."', "
                ."PaperSizeID = '".$PaperSizeID."', "
                ."DuplexID = '".$DuplexID."', "
                ."PaperColorID = '".$PaperColorID."', "
                ."CoverColorID = '".$CoverColorID."', "
                ."ColorCopy = '".$ColorCopy."', "
                ."FrontCover = '".$FrontCover."', "
                ."BackCover = '".$BackCover."', "
                ."Confidential = '".$Confidential."', "
                ."ThreeHolePunch = '".$ThreeHolePunch."', "
                ."Staple = '".$Staple."', "
                ."Cut = '".$Cut."', "
                ."TotalPrint = '".$TotalPrint."', "
                ."TotalCost = '".$TotalCost."', "
                ."Note = '".$Note."' "
                ."WHERE PrintRequestID = '".$PrintRequestID."'";
    
    $cmd = $dbConn->prepare($query);
    $result = $cmd->execute(); 

    echo json_encode($result);