<?php

$server['root']['PHPMailer']=substr(__FILE__,0,strpos(__FILE__,"main"))."main/PHPMailer"; // file system path

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

/* Exception class. */
require $server['root']['PHPMailer']."/src/Exception.php";
/* The main PHPMailer class. */
require $server['root']['PHPMailer'].'/src/PHPMailer.php';
/* SMTP class, needed if you want to use SMTP. */
require $server['root']['PHPMailer'].'/src/SMTP.php';

$email = new PHPMailer(TRUE);

$email->setFrom($_POST['email'], $_POST['name']);
$email->addAddress('mtpsilva@gmail.com', 'AeonLabs website');
$email->Subject  = 'AeonLabs contact form';
$email->Body     = $_POST['message'];
if(!$email->send()) {
  echo 'Message was not sent.';
  echo 'Mailer error: ' . $email->ErrorInfo;
} else {
  echo 'Message has been sent.';
}

?>