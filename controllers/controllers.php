<?php

class BoardsController extends Controller {

  public function __construct() {
    parent::__construct();
    $this->load->_CLASS("Board");
    $this->response = new Response();
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

  public function index() {
    require_once './views/board/create.php';
  }
  public function ajaxifyCreate() {
    if (sizeof($_POST) && isset($_FILES["blob"])) {
      
      $title = 'something';
      $chalkmarks = $_POST['chalkmarks'];
      $fileName = $this->generate_file_id();
      $uploadDirectory = './uploads/' . $fileName;      
           
      if (!move_uploaded_file($_FILES["blob"]["tmp_name"], $uploadDirectory)) {
        $this->response->dialog(array(
          'title' => 'save failed',
          'content' => "problem, moving file to '.$uploadDirectory.'"
        ));
      } else {
        if($this->board->create($title, $chalkmarks, $fileName)){
          $script = <<< JS
              var Template = _.template($('table-data').html()),
              items = ['name1', 'name2', 'name3', 'name4'],
              data = {items: items};

            $('record-table').html(Template(data));
JS;
          $this->response->script($script);
          $this->response->dialog(array(
            'title' => 'saved',
            'content' => "The data was saved successfully"
          ));
          
        } else {
            $this->response->dialog(array(
            'title' => 'save failed',
            'content' => "failed to save data to database"
          ));
        }        
      }   
      $this->response->send();
    }    
  }

  public function retrieve($id = '%') {
    $data = $this->board->retrieve($id);
    require_once './views/board/retrieve.php';
  }

}
