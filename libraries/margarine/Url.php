<?php

class Url {

  protected $requested_uri;

  function __construct() {
    $this->requested_uri = $_SERVER['REQUEST_URI'];
  }

  function uri() {
    return $this->requested_uri;
  }

}
