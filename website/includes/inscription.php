<?php

if(isset($_POST['formsend'])){


  extract($_POST);

  if($password!=$cpassword){
    echo "Mot de passe différents";
  }else{

    if(!empty($prenom) && !empty($nom) && !empty($email) && !empty($password) && !empty($cpassword)){

      $options = [
          'cost' => 12,
      ];
      $hashpass = password_hash($password,PASSWORD_BCRYPT, $options);
        include 'database.php';
        global $db;

        $c = $db->prepare("SELECT email FROM users WHERE email = :email");
        $c->execute(['email' => $email]);
        $result = $c->rowCount();

        if($result == 0){
          $q = $db->prepare("INSERT INTO users(prenom,nom,email,password) VALUES(:prenom,:nom,:email,:password)");
          $q->execute([
              'prenom' => $prenom,
              'nom' => $nom,
              'email' => $email,
              'password' => $hashpass
          ]);
          echo "Le compte a été créé, Connectez-vous !";
        }else{
          echo "Le compte existe déjà";
        }
      }
    }
  }


?>
