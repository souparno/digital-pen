<?php

class BoardsController extends Controller {

  public function __construct() {
    parent::__construct();
    $this->load->_CLASS("Board");
  }

  private function generate_file_id($length = 10) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
      $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString . '.wav';
  }

  public function create() {
    if (sizeof($_POST) && isset($_FILES["blob"])) {
      
      $title = 'something';
      $chalkmarks = $_POST['chalkmarks'];
      $fileName = $this->generate_file_id();
      $uploadDirectory = './uploads/' . $fileName;
           
      if (!move_uploaded_file($_FILES["blob"]["tmp_name"], $uploadDirectory)) {
        echo(" problem moving uploaded file" . $uploadDirectory);
      } else {
        echo $this->board->create($title, $chalkmarks, $fileName);        
      }
    }
  }

  public function retrieve($id = '%') {
    $data = $this->board->retrieve($id);
    require_once './views/index.php';
  }

}
