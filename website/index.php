<?php session_start(); ?>
<!DOCTYPE html>
<html lang="en">

<head>

  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="description" content="">
  <meta name="author" content="">

  <title>SB Admin 2 - Dashboard</title>

  <!-- Custom fonts for this template-->
  <link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">
  <link href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i" rel="stylesheet">

  <!-- Custom styles for this template-->
  <link href="css/sb-admin-2.min.css" rel="stylesheet">

  <script data-require="jquery@*" data-semver="2.1.3" src="https://code.jquery.com/jquery-2.1.3.min.js"></script>
  <link data-require="bootstrap-glyphicons@*" data-semver="3.2.1" rel="stylesheet" href="http://netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/img/glyphicons-halflings.png" />
  <script src="./js/jquery.js"></script>

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

      <!-- Nav Item - Dashboard -->
      <li class="nav-item active">
        <form method="post" enctype="multipart/form-data">
          <a class="nav-link">
            <div class="input-group">
              <div class="custom-file">
                <input type="file" class="custom-file-input" id="inputGroupFile01"
                  aria-describedby="inputGroupFileAddon01" disabled="true" accept="audio/*">
                <label class="custom-file-label" for="inputGroupFile01">Choose file</label>
              </div>
            </div>
          </a>
        </form>
      </li>

      <!-- Divider -->
      <hr class="sidebar-divider">

      <!-- Heading -->
      <div class="sidebar-heading">
        <ul id="playlist">
            <li class="active sidebar-heading" >
                <a href="./audio/Les_trois_petits_cochons.mp3">
                   <font color="white">Trois Petits Cochons</font>
                </a>
            </li>

            <!-- Divider -->
            <hr class="sidebar-divider">


            <li class="sidebar-heading">
                <a href="http://www.archive.org/download/MoonlightSonata_755/Beethoven-MoonlightSonata.mp3">
                    <font color="white">Test 2</font>
                </a>
            </li>

            <!-- Divider -->
            <hr class="sidebar-divider">


            <li class="sidebar-heading">
                <a href="http://www.archive.org/download/CanonInD_261/CanoninD.mp3">
                    <font color="white">Test 3</font>
                </a>
            </li>

            <!-- Divider -->
            <hr class="sidebar-divider">

            <li class="sidebar-heading">
                <a href="http://www.archive.org/download/PatrikbkarlChamberSymph/PatrikbkarlChamberSymph_vbr_mp3.zip">
                    <font color="white">Test 4</font>
                </a>
              </li>
          </ul>
      </div>
       <!-- Divider -->
      <hr class="sidebar-divider">
      
      <div class="sidebar-heading">
        <ul id="serverView" style="pointer-events: none; opacity: 0.5;">
          
        </ul>
      </div>
      
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

          <div class="small mb-1">  Choix Langue Entrée: &emsp; </div>
          <select id="servers" class="mdb-select md-form">
              <option value="ws://lst-demo.univ-lemans.fr:8888/client/ws/speech|ws://lst-demo.univ-lemans.fr:8888/client/ws/status" selected="selected">Francais</option>
              <option value="ws://lst-demo.univ-lemans.fr:443/client/ws/speech|ws://lst-demo.univ-lemans.fr:443/client/ws/status">Anglais</option>
          </select>

          <div class="topbar-divider d-none d-sm-block"></div>


          <div class="small mb-1">  Choix Langue Sortie: &emsp; </div>
          <select id="ChoixSortie" class="mdb-select md-form">
              <option >Francais</option>
          </select>

          <div class="topbar-divider d-none d-sm-block"></div>


          <div class="small mb-1">  Choix Type Entrée: &emsp; </div>
          <select class="mdb-select md-form" id="ChoixEntree">
              <option >Fichier</option>
              <option >Microphone</option>
              <option >Streaming</option>
          </select>

          <div class="topbar-divider d-none d-sm-block"></div>

          <div class="small mb-1">
            <input id="Confirm" type="button" value="Confirm" onclick="confirm();" />
            <input id="Reset" type="button" value="Reset" onclick="reset();" />
          </div>


          <!-- Côté droit -->
          <ul class="navbar-nav ml-auto">

            <li class="nav-item dropdown no-arrow d-sm-none">
              <a class="nav-link dropdown-toggle" href="#" id="searchDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="fas fa-search fa-fw"></i>
              </a>
              <div class="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in" aria-labelledby="searchDropdown">
                <form class="form-inline mr-auto w-100 navbar-search">
                  <div class="input-group">
                    <input type="text" class="form-control bg-light border-0 small" placeholder="Search for..." aria-label="Search" aria-describedby="basic-addon2">
                    <div class="input-group-append">
                      <button class="btn btn-primary" type="button">
                        <i class="fas fa-search fa-sm"></i>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </li>



            <div class="topbar-divider d-none d-sm-block"></div>

            <!-- Nav Item - User Information -->
            <li class="nav-item dropdown no-arrow">
              <a class="nav-link" href="./login.php" id="userDropdown" role="button" onclick="">
                <img class="img-profile rounded-circle" src="img/log.png" id="imageCon" >
                <span class="mr-2 d-none d-lg-inline text-gray-600 small" id="nomCon">
                  <?php
                      if(isset($_SESSION['nom']) && (isset($_SESSION['prenom']))){
                        ?>
                        <script type="text/javascript">
                         document.getElementById("imageCon").setAttribute("src", "img/logout.png");
                         document.getElementById("userDropdown").setAttribute("href","includes/deconnexion.php");
                        </script>
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
            <a href="mailto:lium.toutauto@gmail.com" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"><i class="fas fa-download fa-sm text-white-50"></i> Generate Report</a>
          </div>


          <!-- Content Row -->
          <div class="row">

            <!-- Commandes Streaming / Microphone -->
            <div  id="hautGaucheBouton" class="col-xl-6 col-md-6 mb-4">
              <div class="card border-left-warning shadow h-100 py-2">
                <div class="card-body">
                  <div class="row no-gutters align-items-center">
                    <div class="col mr-2">
                        <!--Textarea with icon prefix-->
                        <div class="md-form mb-4 pink-textarea active-pink-textarea">
                          <h1 class="h3 mb-0 text-gray-800">Commandes</h1>
                          <!-- <audio controls>
                              <source src="horse.ogg" type="audio/ogg">
                              <source src="horse.mp3" type="audio/mpeg">
                            </audio> -->
                            <input type="button" id="buttonToggleListening"
                            disabled
                             onclick="toggleListening();"
                             value="Start"/>
                            <input type="button"
                              id="buttonCancel"
                              disabled="disabled"
                              onclick="cancel();"
                              title="Cancels the speech recognition."
                              value="Cancel"/>
                            <input type="button"
                                onclick="clearTranscription();"
                                title="Clears the transcription"
                                value="Clear"/>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Player Transcription -->
            <div id="hautGauchePlayer" class="col-xl-6 col-md-6 mb-4" >
              <div class="card border-left-warning shadow h-100 py-2">
                <div class="card-body">
                  <div class="row no-gutters align-items-center">
                    <div class="col mr-2">
                        <div class="md-form mb-4 pink-textarea active-pink-textarea">
                          <h1 class="h3 mb-0 text-gray-800">Player Entree</h1>
                          <audio id="audio" preload="auto" tabindex="0" controls="" >
                            Your Fallback goes here
                          </audio>
                          </div>
                        </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Player Traduction -->
              <div id="hautDroitPlayer" class="col-xl-6 col-md-6 mb-4" >
                <div class="card border-left-info shadow h-100 py-2">
                  <div class="card-body">
                    <div class="row no-gutters align-items-center">
                      <div class="col mr-2">
                          <div class="md-form mb-4 pink-textarea active-pink-textarea">
                            <h1 class="h3 mb-0 text-gray-800">Player Sortie</h1>
                            <audio id="audio" preload="auto" tabindex="0" controls="" >
                              Your Fallback goes here
                            </audio>
                            </div>
                          </div>
                      </div>
                    </div>
                  </div>
                </div>



            </div>

          <!-- Content Row -->
          <div class="row">

            <!-- Transcription -->
            <div class="col-xl-6 col-md-6 mb-4">
              <div class="card border-left-success shadow h-100 py-2">
                <div class="card-body">
                  <div class="row no-gutters align-items-center">
                    <div class="col mr-2">
                        <!--Textarea with icon prefix-->
                        <div class="md-form mb-4 pink-textarea active-pink-textarea">
                          <h1 class="h3 mb-0 text-gray-800">Transcription</h1>
                          <i class="fas fa-angle-double-right prefix"></i>
                          <textarea disabled id="trans" class="md-textarea form-control" rows="3"></textarea>
                          <label for="form21"></label>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Traduction -->
            <div class="col-xl-6 col-md-6 mb-4" >
              <div class="card border-left-primary shadow h-100 py-2">
                <div class="card-body">
                  <div class="row no-gutters align-items-center">
                    <div class="col mr-2">
                        <!--Textarea with icon prefix-->
                        <div class="md-form mb-4 pink-textarea active-pink-textarea">
                          <h1 class="h3 mb-0 text-gray-800">Traduction</h1>
                          <i class="fas fa-angle-double-right prefix"></i>
                          <textarea id="trad" class="md-textarea form-control" rows="3"></textarea>
                          <label for="form21"></label>
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

  <!-- Logout Modal-->
  <div class="modal fade" id="logoutModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Ready to Leave?</h5>
          <button class="close" type="button" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <div class="modal-body">Select "Logout" below if you are ready to end your current session.</div>
        <div class="modal-footer">
          <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
          <a class="btn btn-primary" href="login.html">Logout</a>
        </div>
      </div>
    </div>
  </div>

  <!-- Script for cURL command in JavaScript-->
  <script src="https://unpkg.com/axios/dist/axios.min.js"></script>

  <!-- Script for file upload-->
  <script type="text/javascript" src="js/browser-upload.js?$$REVISION$$"></script>

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

  <script src="js/lib/dictate.js"></script>
  <script src="js/lib/recorder.js"></script>
  <script type="text/javascript" src="js/transcription.js?$$REVISION$$"></script>

  <!-- Script for translation-->
  <script src="js/translation.js"></script>



</body>

</html>
