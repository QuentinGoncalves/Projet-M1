<?php session_start(); ?>
<!DOCTYPE html>
<html lang="en">

<head>

  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="description" content="">
  <meta name="author" content="">

  <title>Tout auto</title>

  <!-- Custom fonts for this template-->
  <link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">
  <link href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i" rel="stylesheet">

  <!-- Custom styles for this template-->
  <link href="css/sb-admin-2.min.css" rel="stylesheet">

  <script data-require="jquery@*" data-semver="2.1.3" src="https://code.jquery.com/jquery-2.1.3.min.js"></script>
  <link data-require="bootstrap-glyphicons@*" data-semver="3.2.1" rel="stylesheet" href="http://netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/img/glyphicons-halflings.png" />

  <meta name="viewport" content="width=device-width, initial-scale=1">

  <style>
  body {font-family: Arial, Helvetica, sans-serif;}

  .buttondel{
    cursor: pointer;
    border: none;
  }

  /* The Modal (background) */
  .modal {
    display: none; /* Hidden by default */
    position: fixed; /* Stay in place */
    z-index: 1; /* Sit on top */
    padding-top: 100px; /* Location of the box */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    background-color: rgb(0,0,0); /* Fallback color */
    background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
  }

  /* Modal Content */
  .modal-content {
    background-color: #fefefe;
    margin: auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
  }

  /* The Close Button */
  .close {
    color: #aaaaaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
  }

  .close:hover,
  .close:focus {
    color: #000;
    text-decoration: none;
    cursor: pointer;
  }
  </style>

</head>

<body id="page-top">
  <?php
    include 'includes/database.php';
  ?>

  <!-- Page Wrapper -->
  <div id="wrapper">

    <!-- Sidebar -->
    <ul class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">

      <!-- Sidebar - Brand -->
      <a class="sidebar-brand d-flex align-items-center justify-content-center" href="index.html">
        <div>
          <img src="https://lium.univ-lemans.fr/wp-content/uploads/2019/11/logoLIUM.v2-1.png" width="180" height="65">
        </div>
      </a>

      <!-- Divider -->
      <hr class="sidebar-divider my-0">


    </ul>
    <!-- End of Sidebar -->

    <!-- Content Wrapper -->
    <div id="content-wrapper" class="d-flex flex-column">

      <!-- Main Content -->
      <div id="content">

        <!-- Topbar -->
        <nav class="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">

          <!-- Sidebar Toggle (Topbar) -->
          <button id="sidebarToggleTop" class="btn btn-link d-md-none rounded-circle mr-3">
            <i class="fa fa-bars"></i>
          </button>

          <div class="medium mb-1"> Ajouter une langue : &emsp; </div>

          <div class="small mb-1">
            <form method="post">
                <input type="text" class="form-control form-control-user" name="Langue" id="nomLangue" placeholder="Exemple : Francais" required>
          </div>


              <div class="topbar-divider d-none d-sm-block"></div>



            <div class="small mb-1">
                <input type="text" class="form-control form-control-user" name="Serveur" id="serveurLangue" placeholder="Exemple : ws://lst-demo.univ-lemans.fr:8888/client/ws/speech|ws://lst-demo.univ-lemans.fr:8888/client/ws/status" required>
            </div>



          <div class="topbar-divider d-none d-sm-block"></div>

          <div class="small mb-1">
              <input type="text" class="form-control form-control-user" name="Abbreviation" id="abbrLangue" placeholder="Exemple : fr" required>
          </div>

          <div class="topbar-divider d-none d-sm-block"></div>

          <div class="small mb-1">
            <input type="submit" name="formlang" id="formlang" class="btn btn-primary btn-user btn-block" value="Valider">
            </form>
          </div>


          <!-- Côté droit -->
          <ul class="navbar-nav ml-auto">

            <?php
                if(isset($_SESSION['admin'])){
                  ?>
                      <li class="nav-item dropdown no-arrow">
                        <a class="nav-link" href="./admin.php" id="admin" role="button" onclick="">
                          <img class="img-profile rounded-circle" src="img/admin.png" id="imAdmin" >
                        </a>
                      </li>
                  <?php
                }
            ?>




            <div class="topbar-divider d-none d-sm-block"></div>

            <!-- Nav Item - User Information -->
            <li class="nav-item dropdown no-arrow">
              <a class="nav-link" href="./login.php" id="userDropdown" role="button" onclick="">
                <img class="img-profile rounded-circle" src="img/log.png" id="imageCon" >
                <span class="mr-2 d-none d-lg-inline text-gray-600 small" id="nomCon">
                  <?php
                      if(isset($_SESSION['nom']) && (isset($_SESSION['prenom']))){
                        ?>

                       <?= $_SESSION['nom'] . " " . $_SESSION['prenom']; ?></span>
                     <?php }else{
                       ?>
                       <script type="text/javascript">
                       document.getElementById("imageCon").setAttribute("src", "img/log.png");
                       document.getElementById("userDropdown").setAttribute("href","login.php");
                       document.getElementById("userDropdown").setAttribute("onclick","");
                       </script>
                       <?php } ?>
              </a>
            </li>

          </ul>

        </nav>
        <!-- End of Topbar -->

        <!-- Begin Page Content -->
        <div class="container-fluid">

          <!-- Page Heading -->
          <div id="Report" class="d-sm-flex align-items-center justify-content-between mb-4">
            <h1 class="h3 mb-0 text-gray-800"></h1>
            <a href="mailto:lium.toutauto@gmail.com" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"><i class="fas fa-download fa-sm text-white-50"></i> Mail To</a>
          </div>



          <!-- Content Row -->
          <div class="row">

            <div id="divAjout" class="col-xl-6 col-md-6 mb-4">
              <div class="card border-left-success shadow h-100 py-2">
                <div class="card-body">
                  <div class="row no-gutters align-items-center">
                    <div class="col mr-2">
                        <!--Textarea with icon prefix-->
                        <div class="md-form mb-4 pink-textarea active-pink-textarea">
                          <h1 class="h3 mb-0 text-gray-800">Création bloc :</h1>
                          <i class="fas fa-angle-double-right prefix"></i>
                          <!-- Trigger/Open The Modal -->
                          <button id="myBtn">Afficher Code</button>
                          <label for="form21"></label>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div id="divAjout" class="col-xl-6 col-md-6 mb-4">
              <div class="card border-left-success shadow h-100 py-2">
                <div class="card-body">
                  <div class="row no-gutters align-items-center">
                    <div class="col mr-2">
                        <div class="md-form mb-4 pink-textarea active-pink-textarea">
                          <h1 class="h3 mb-0 text-gray-800">Détails :</h1>
                          <p> Aucun mot de passe n'est enregistré, lors de l'inscription on utilise password_hash(); pour le stocker.<br/>
                            Pour la connexion on utilise password_verify(mdp,mdpBDD), qui compare le mot de passe entrée avec le mot de passe haché qui se trouve dans la BDD.</p>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- The Modal -->
            <div id="myModal" class="modal">

              <!-- Modal content -->
              <div class="modal-content">

                <textarea disabled id="codeBloc" class="md-textarea form-control" rows="18">
                  <div class="row"> <----- Ajouter une ligne (max 2 blocs par ligne)

                      <div id="idBloc" class="col-xl-6 col-md-6 mb-4" > <-------- Ajouter un bloc / Changer largeur bloc (col-xl-1 à col-xl-12)
                        <div class="card border-left-info shadow h-100 py-2"> <------ Remplacer "info" pour changer de couleur (success, warning, primary)
                          <div class="card-body">
                            <div class="row no-gutters align-items-center">
                              <div class="col mr-2">
                                  <div class="md-form mb-4 pink-textarea active-pink-textarea">
                                    <h1 class="h3 mb-0 text-gray-800">Titre</h1> <-------- Titre du bloc
                                    <i class="fas fa-angle-double-right prefix"></i><br/> <----- Flèches
                                      ------------- Contenu du bloc (Textarea, player, ...)-------------
                                    </div>
                                  </div>
                              </div>
                            </div>
                          </div>
                        </div>

                  </div></textarea>
                <span class="close">&times;</span>
              </div>

            </div>

            <script>
            // Get the modal
            var modal = document.getElementById("myModal");

            // Get the button that opens the modal
            var btn = document.getElementById("myBtn");

            // Get the <span> element that closes the modal
            var span = document.getElementsByClassName("close")[0];

            // When the user clicks the button, open the modal
            btn.onclick = function() {
              modal.style.display = "block";
            }

            // When the user clicks on <span> (x), close the modal
            span.onclick = function() {
              modal.style.display = "none";
            }

            // When the user clicks anywhere outside of the modal, close it
            window.onclick = function(event) {
              if (event.target == modal) {
                modal.style.display = "none";
              }
            }
            </script>

          </div>


          <!-- Content Row -->
          <div class="row">


              <div id="divUsers" class="col-xl-12 col-md-6 mb-4" >
                <div class="card border-left-primary shadow h-100 py-2">
                  <div class="card-body">
                    <div class="row no-gutters align-items-center">
                      <div class="col mr-2">
                          <!--Textarea with icon prefix-->
                          <div class="md-form mb-4 pink-textarea active-pink-textarea">
                            <h1 class="h3 mb-0 text-gray-800">Liste Utilisateurs :</h1>
                            <i class="fas fa-angle-double-right prefix"></i><br/>
                              <table width="1200">
                                  <tr>
                                    <td>Id</td>
                                    <td>Nom</td>
                                    <td>Prenom</td>
                                    <td>Mail</td>
                                    <td>Date de création</td>
                                  </tr>
                              <?php

                                require_once('includes/database.php');
                                global $db;

                                $q = $db->query("SELECT * FROM users");
                                while($user = $q->fetch()){
                                  if(isset($user['admin'])){

                                  }else{
                                    ?>
                                      <tr>
                                        <td><?= $user['id'] ?></td>
                                        <td><?= $user['nom'] ?></td>
                                        <td><?= $user['prenom'] ?></td>
                                        <td><?= $user['email'] ?></td>
                                        <td><?= $user['date'] ?></td>
                                        <td><button onClick="deleteme(<?php echo $user['id']; ?>)" style="background-color: white" name="Delete" class="buttondel"><img src="img/imgCroix.png" width="30" height="30"></button></td>
                                      </tr>
                                      <script language="javascript">
                                        function deleteme(delid){
                                          window.location.href='deleteuser.php?del_id=' +delid +''
                                          return true;
                                        }
                                      </script>
                                  <?php
                                  }
                                }
                              ?>
                            </table>
                          </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

        </div>
        <!-- /.container-fluid -->

      </div>
      <!-- End of Main Content -->

      <!-- Footer -->
      <footer class="sticky-footer bg-white">
        <div class="container my-auto">
          <div class="copyright text-center my-auto">
            <span>Copyright &copy; Tout automatique de l'anglais au français 2019</span>
          </div>
        </div>
      </footer>
      <!-- End of Footer -->

    </div>
    <!-- End of Content Wrapper -->

  </div>
  <!-- End of Page Wrapper -->

  <!-- Scroll to Top Button-->
  <a class="scroll-to-top rounded" href="#page-top">
    <i class="fas fa-angle-up"></i>
  </a>

  <!-- Script for cURL command in JavaScript-->
  <script src="https://unpkg.com/axios/dist/axios.min.js"></script>


  <!-- Bootstrap core JavaScript-->
  <script src="vendor/jquery/jquery.min.js"></script>
  <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

  <!-- Core plugin JavaScript-->
  <script src="vendor/jquery-easing/jquery.easing.min.js"></script>

  <!-- Custom scripts for all pages-->
  <script src="js/sb-admin-2.min.js"></script>

  <!-- Page level plugins -->
  <script src="vendor/chart.js/Chart.min.js"></script>

  <!-- Placed at the end of the document so the pages load faster -->
  <script src="js/other/jquery-1.10.2.min.js"></script>

  <!-- Latest compiled and minified JavaScript -->
  <script src="//netdna.bootstrapcdn.com/bootstrap/3.0.3/js/bootstrap.min.js"></script>


</body>

</html>
