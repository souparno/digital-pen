<?php

define('BASE_PATH', dirname(__FILE__));
define('BASE_URL', '');
// DB login info
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASSWORD', 'bonnie');
define('DB_DBASE', 'db_class_board');

include_once './core/Core.php';
include_once './core/MySQL.php';


include_once './models/models.php';
include_once './controllers/controllers.php';

Class RouteEngine extends Core {

  public function __construct() {
    parent::__construct();
  }

  public function dispatch($requestURI) {
    switch (explode("?", $requestURI)[0]) {

      case "/":
        $id = isset($_GET['id']) ? $_GET['id'] : '%';
        $this->load->_CLASS("BoardsController");
        $this->boardscontroller->retrieve($id);
        break;
      case "/create":
        $this->load->_Class('BoardsController');
        $this->boardscontroller->create();
        break;
    }
  }
}

$routeEngine = new RouteEngine();
$routeEngine->dispatch($_SERVER["REQUEST_URI"]);
