<?php

if(isset($_POST['formlang'])){

  extract($_POST);

  if(!empty($nomLangue) && !empty($serveurLangue) && !empty($abbrLangue)){


      include_once('database.php');
      global $db;


      if($typeSelect == "langues"){
        $c = $db->prepare("SELECT nom FROM langues WHERE nom = :nomLangue");
        $c->execute(['nomLangue' => $nomLangue]);
        $result = $c->rowCount();

        if($result == 0){
          $q = $db->prepare("INSERT INTO langues(nom,value,abr) VALUES(:nom,:serveur,:abbr)");
          $q->execute([
                'nom' => $nomLangue,
                'serveur' => $serveurLangue,
                'abbr' => $abbrLangue,
            ]);
            echo "La langue à été ajoutée!";
          }else{
            echo "La langue existe déjà";
          }
        }else{
          $c = $db->prepare("SELECT nom FROM languesortie WHERE nom = :nomLangue");
          $c->execute(['nomLangue' => $nomLangue]);
          $result = $c->rowCount();

          if($result == 0){
            $q = $db->prepare("INSERT INTO languesortie(nom,value,abr) VALUES(:nom,:serveur,:abbr)");
            $q->execute([
                  'nom' => $nomLangue,
                  'serveur' => $serveurLangue,
                  'abbr' => $abbrLangue,
              ]);
              echo "La langue à été ajoutée!";
            }else{
              echo "La langue existe déjà";
            }
        }
    }
}


?>
