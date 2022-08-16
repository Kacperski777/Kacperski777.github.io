<?php




$form = $_POST['form'];
$name = $_POST['name'];
$email = $_POST['email'];
$message_text = $_POST['message_text'];
$message = $form . " " . $name . " " .  $email . " " .  $message_text;
$to = 'kacpermmlp@gmail.com';
$subject = 'Portfolio Email';

if(mail($to, $subject, $message)){
	header('Location: https://kacperski777.github.io/index.html#contacts');
} else{
    echo("Error");
}


?>