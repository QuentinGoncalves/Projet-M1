<?php
        session_start();
        // Supression des variables de session et de la session
        $_SESSION = array();
        session_destroy();

        header('Location: ../index.php');
?>
