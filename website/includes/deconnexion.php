<?php
        session_start();
        // Supression des variables de session et de la session
        $_SESSION = array();
        session_destroy();

        echo 'document.getElementById("hautGauchePlayer").style.display="none";
         document.getElementById("hautDroitPlayer").style.display="none";
         document.getElementById("divTrans").style.display="none";
         document.getElementById("divTrad").style.display="none";'
         ;

        header('Location: ../index.php');
?>
