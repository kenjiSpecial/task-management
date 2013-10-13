<?php
/**
 * Created by PhpStorm.
 * User: kenjisaito
 * Date: 10/1/13
 * Time: 10:28 PM
 */
//require_once('PhpConsole.php');
//PhpConsole::start();


foreach ($_FILES["images"]["error"] as $key => $error) {
    if ($error == UPLOAD_ERR_OK) {
        $name = $_FILES["images"]["name"][$key];
        //date_default_timezone_set('America/New_York');
        //$date  = date("YmdHis");

        move_uploaded_file( $_FILES["images"]["tmp_name"][$key], "../images/" .$_FILES['images']['name'][$key]);
    }
}

//echo "<h2>Successfully Uploaded Images</h2>";

