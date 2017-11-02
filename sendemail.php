<?php
   // Method: POST, PUT, GET etc
    // Data: array("param" => "value") ==> index.php?param=value
    function CallAPI($method, $url, $data = false)
    {
        $curl = curl_init();

        switch ($method)
        {
            case "POST":
                curl_setopt($curl, CURLOPT_POST, 1);

                if ($data)
                    curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
                break;
            case "PUT":
                curl_setopt($curl, CURLOPT_PUT, 1);
                break;
            default:
                if ($data)
                    $url = sprintf("%s?%s", $url, http_build_query($data));
        }

        // Optional Authentication:
        curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
        curl_setopt($curl, CURLOPT_USERPWD, "username:password");

        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

        $result = curl_exec($curl);

        curl_close($curl);

        return $result;
    }

    session_cache_limiter( 'nocache' );
    header( 'Expires: ' . gmdate( 'r', 0 ) );
    header( 'Content-type: application/json' );


    $to = 'mail@lukashavenga.co.za';  // put your email here

    $secret = '6Ldb2TYUAAAAAGUZ4ECAmbBUmQEL6Hx6pEVR6BVH';

    $email_template = 'simple.html';

    $subject    = strip_tags($_POST['subject']);
    $email      = strip_tags($_POST['email']);
    $name       = strip_tags($_POST['name']);
    $message    = nl2br( htmlspecialchars($_POST['message'], ENT_QUOTES) );
    $captcha    = strip_tags($_POST['g-recaptcha-respons']);
    $result     = array();

    $captcha_passed = callAPI('POST','https://www.google.com/recaptcha/api/siteverify',{'secret':$secret,'response':$captcha});


    if(empty($name)){

        $result = array( 'response' => 'error', 'empty'=>'name', 'message'=>'<strong>Error!</strong>&nbsp; Name is empty.' );
        echo json_encode($result );
        die;
    } 

    if(empty($email)){

        $result = array( 'response' => 'error', 'empty'=>'email', 'message'=>'<strong>Error!</strong>&nbsp; Email is empty.' );
        echo json_encode($result );
        die;
    } 

    if(empty($message)){

         $result = array( 'response' => 'error', 'empty'=>'message', 'message'=>'<strong>Error!</strong>&nbsp; Message body is empty.' );
         echo json_encode($result );
         die;
    }
    


    $headers  = "From: " . $name . ' <' . $email . '>' . "\r\n";
    $headers .= "Reply-To: ". $email . "\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";


    $templateTags =  array(
        '{{subject}}' => $subject,
        '{{email}}'=>$email,
        '{{message}}'=>$message,
        '{{name}}'=>$name
        );


    $templateContents = file_get_contents( dirname(__FILE__) . '/email-templates/'.$email_template);

    $contents =  strtr($templateContents, $templateTags);

    if ( mail( $to, $subject, $contents, $headers ) && $captcha_passed) ) {
        $result = array( 'response' => 'success', 'message'=>'<strong>Thank You!</strong>&nbsp; Your email has been sent.' );
    } else {
        $result = array( 'response' => 'error', 'message'=>'<strong>Error!</strong>&nbsp; Cann\'t Send Mail.'  );
    }

    echo json_encode( $result );

    die;