<?php

class Index extends Controller{
    
    public function __construct() {
        parent::__construct();        
        $this->load->_CLASS("Abc_model");
    }


    public function retrieve(){
        echo $this->abc_model->retrieve();
        require_once './views/index.php';
    }   
    
}


