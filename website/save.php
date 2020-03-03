<?php

ini_set('upload_max_filesize', '10M');
ini_set('post_max_size', '10M');
ini_set('max_input_time', 300);
ini_set('max_execution_time', 300);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['file'])) {
        $errors = [];
        $path = './audio/';
        //print_r($_POST);
        $file_name = $_POST['name'];
        $file_tmp = $_FILES['file']['tmp_name'];
        $file_type = $_FILES['file']['type'];
        $file_size = $_FILES['file']['size'];
        //$file_ext = strtolower(end(explode('.', $_FILES['file']['name'])));

        $file = $path . $file_name . '.mp3';

        if (empty($errors)) {
            move_uploaded_file($file_tmp, $file);
            print_r("Success");
        }

        if ($errors) print_r($errors);
    }
}
?>
