<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['id'])) {
        $file_pointer = "./audio/".$_POST['id'].".mp3";  
           
        // Use unlink() function to delete a file  
        if (!array_map( "unlink", glob( $file_pointer ))) {
            echo ("$file_pointer cannot be deleted due to an error");  
        }  
        else {  
            echo ("$file_pointer has been deleted");  
        }   
    }
}
?>