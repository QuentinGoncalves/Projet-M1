<?php
session_start();

if(isset($_POST['formlogin'])){


  extract($_POST);

  if(!empty($lemail) && !empty($lpassword)){

        include 'database.php';
        global $db;

        $q = $db->prepare("SELECT * FROM users WHERE email = :email");
        $q->execute(['email' => $lemail]);
        $result = $q->fetch();

        if($result == true){

          $hashpassword = $result['password'];
          if(password_verify($lpassword,$hashpassword)){
            $_SESSION['connecte'] = "true";
            $_SESSION['nom'] = $result['nom'];
            $_SESSION['prenom'] = $result['prenom'];
            $_SESSION['admin'] = $result['admin'];

            header('Location: index.php');

          }else{
            echo "Mot de passe incorrect";
          }

        }else{
          echo "Le compte n'existe pas, Inscrivez-vous !";
        }

      }
    }
?>
