<?php

class Core {

  public $load;
  public $db;

  public function __construct() {
    $this->load = $this;
    $this->db = new MySQL(DB_DBASE, DB_USER, DB_PASSWORD);
  }

  public function _CLASS($class) {
    $name = strtolower($class);
    if (!isset($this->$name)) {
      $this->$name = new $class();
    }
  }
}

class Controller extends Core {

  public function __construct() {
    parent::__construct();
  }
}

class Model extends Core {

  public function __construct() {
    parent::__construct();
  }
}
