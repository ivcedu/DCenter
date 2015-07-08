<?php
    //require("config.php");
    $output_dir = "C:/xampp/htdocs/DCenter/attach_files/";
    
    $FileLinkName = filter_input(INPUT_POST, 'FileLinkName');
    $result = unlink($output_dir.$FileLinkName);
 
    echo json_encode($result);