<?php

class Input {

  /**
   * Check if request is an AJAX 
   * 
   */
  function is_ajax_request() {
    return $isAjax = isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';
  }

}
