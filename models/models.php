<?php

class Abc_model extends Model {

    public function __construct() {
        parent::__construct();
        $this->load->_CLASS("Def_model");        
    }
    
    public function retrieve(){
        return $this->def_model->retrieve();
        
    }   

}


class Def_model extends Model{
    
    public function __construct() {
        parent::__construct();
    }
    
    public function retrieve() {
        return "Hello there";
    }   
    
}
