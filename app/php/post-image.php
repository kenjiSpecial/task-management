<?php
/**
 * Created by PhpStorm.
 * User: kenjisaito
 * Date: 10/1/13
 * Time: 10:28 PM
 */

mkdir("./sample");

foreach ($_FILES["images"]["error"] as $key => $error) {
    if ($error == UPLOAD_ERR_OK) {
        $name = $_FILES["images"]["name"][$key];

        move_uploaded_file( $_FILES["images"]["tmp_name"][$key], "./sample/" . $_FILES['images']['name'][$key]);
    }
}

//echo "<h2>Successfully Uploaded Images</h2>";

