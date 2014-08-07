<?php 


define('BASE_PATH', dirname(__FILE__));
define('BASE_URL','');
// DB login info
define('DB_HOST', 'databaseHost.db');
define('DB_USER', 'databaseUser');
define('DB_PASSWORD', 'databasePassword');
define('DB_DBASE', 'databse');

include_once './_core/class.Core.php'; '';
include_once './_core/class.MySQL.php';


include_once './models/models.php';
include_once './controllers/controllers.php';


Class RouteEngine extends Core {
   


    public function __construct() {
        parent::__construct();
        $this->load->_CLASS("Abc");
    }
    
    public function dispatch($requestURI) {
        switch (explode("?", $requestURI)[0]) {

            case "/":
                $this->abc->retrieve();
                break;

        }
    }

}

$routeEngine = new RouteEngine();
$routeEngine->dispatch($_SERVER["REQUEST_URI"]);