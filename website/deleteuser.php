<?php
  include_once('includes/database.php');
  global $db;

  $select = "DELETE FROM users WHERE id ='".$_GET['del_id']."'";
  $d = $db->query($select);
  header ("Location: admin.php");
?>
