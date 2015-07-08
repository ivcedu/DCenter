<?php
    require("class.phpmailer.php");

    if (isset($_POST['Email']))
    {
        $Email = filter_input(INPUT_POST, 'Email');
        $Name = filter_input(INPUT_POST, 'Name');
        $Subject = filter_input(INPUT_POST, 'Subject');
        $Message = filter_input(INPUT_POST, 'Message');
        
        $mail = new PHPMailer();
        $mail->IsSMTP();
        $mail->Host = "smtp1.socccd.edu";
        $mail->From = "ivcduplicating@ivc.edu";
        $mail->FromName = "IVC Duplicating Services";
        $mail->AddAddress($Email, $Name);
        //$mail->AddCC($address, $name);
        $mail->IsHTML(true); // send as HTML
        $mail->Subject = $Subject;
        $mail->Body = $Message;
        
        if($mail->Send()) {
            echo "true";
        }
        else {
            echo "false";
        }
    }