$(document).ready(function() {
  document.getElementById("imageCon").setAttribute("src", "img/logout.png");
  document.getElementById("userDropdown").setAttribute("href","includes/deconnexion.php");
  document.getElementById("Confirm").disabled=false;
  document.getElementById("servers").disabled=false;
  document.getElementById("ChoixSortie").disabled=false;
  document.getElementById("ChoixEntree").disabled=false;
  document.getElementById("hautGauchePlayer").style.display="block";
  document.getElementById("hautGaucheBouton").style.display="none";
  document.getElementById("hautDroitPlayer").style.display="block";
  document.getElementById("divTrans").style.display="block";
  document.getElementById("divTrad").style.display="block";
  document.getElementById("btnStream").style.display="none";
});
