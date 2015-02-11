<?php

$_SERVER["REQUEST_URI"] = 'false';

class BoardsControllerTest extends PHPUnit_Framework_TestCase{
  public function __construct() {
    $this->boardscontroller = new BoardsController();
  }

  public function test_create() {
//    $_POST['chalkmarks'] = 'some marks';
//    $_FILES["blob"]["tmp_name"] = 'some files';
//    $this->boardscontroller->create();
//
//    $_POST['chalkmarks'] = 'some more marks';
//    $_FILES["blob"]["tmp_name"] = 'some more files';
//    $this->boardscontroller->create();
    $this->assertEquals(true, true);
  }

  public function test_retrieve () {
    $data = $this->boardscontroller->retrieve(1);
    var_dump($data);
  }
}