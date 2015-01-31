<?php

$_SERVER["REQUEST_URI"] = 'false';

class BoardTest extends PHPUnit_Framework_TestCase
{
  public function __construct() {
    $this->board = new Board();;
  }
  public function test_create() {    
    $title = 'some title';
    $chalkmarks = 'some marks';
    $audio_file = 'audio.wav';  
    $this->assertEquals($this->board->create($title, $chalkmarks, $audio_file), 1);
  }

  public function test_retrieve(){
    $this->assertEquals(count($this->board->retrieve(1)), 1);
  }

  public function test_delete () {
    $this->board->delete();
  }
}