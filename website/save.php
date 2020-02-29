<?php 
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['file'])) {
        $errors = [];
        $path = './audio/';
        //print_r($_POST);
        $file_name = $_POST['name'];
        $file_tmp = $_FILES['file']['tmp_name'];
        $file_type = $_FILES['file']['type'];
        $file_size = $_FILES['file']['size'];
        $file_ext = strtolower(end(explode('.', $_FILES['file']['name'])));

        $file = $path . $file_name . '.mp3';

        if ($file_size > 2097152) {
            $errors[] = 'File size exceeds limit: ' . $file_name . ' ' . $file_type;
        }

        if (empty($errors)) {
            move_uploaded_file($file_tmp, $file);
            //print_r("Success");
        }

        if ($errors) print_r($errors);
    }
}
?>