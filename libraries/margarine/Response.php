<?php

class Response {

  protected $url;
  protected $input;
  protected $dialog;
  protected $data;

  public function __construct() {
    $this->url = new Url();
    $this->input = new Input();
    $this->dialog = new Dialog();
  }

  /**
   * Add callback Javascript
   *
   * @access  public
   * @param   string  $script
   * @return  void
   */
  public function script($script) {
    $this->data['scripts'][] = $script;
  }

  /**
   * Show confirm dialog
   *
   * @access  public
   * @param   string  $title
   * @param   string  $body
   * @param   string  $ok_label
   * @param   string  $close_label
   * @return  bool
   */
  public function confirm($data) {

    if (!isset($_POST['_dialog_confirmed'])) {

      $dialog_id = (empty($data['id'])) ? 'dialog-' . mt_rand(1000000, 9999999) : $data['id'];

      $this->dialog->set_id($dialog_id);

      if (!empty($data['title'])) {
        $this->dialog->set_title($data['title']);
      }

      if (!empty($data['content'])) {
        $this->dialog->set_content($data['content']);
      }

      $html = $this->dialog->html();
      $json_html = json_encode($html);

      /*
       * - Append dialog HTML to <body>.
       * - Store reference of the button that toggles this dialog (caller)
       * on every async forms of the dialog.
       * - Launch the dialog.
       * - Register an event to destroy the dialog after it was closed
       * (must use setTimeout to prevent the dialog from being completely removed
       * before other scripts, which retrieve dialog's data, are executed,
       * especially for dialogs that have no hidden effect or for IE).
       */

      $code = <<< JS
    $('body').append({$json_html});
    $('#{$dialog_id}').dialog({
                      modal: true,
                      	buttons: [
		{
			text: "Ok",
			click: function() {
				CIS.Ajax.request('{$this->url->uri()}', {
        type: 'POST',
        context:context,
        data: '_dialog_confirmed=1&&_dialog_id={$dialog_id}'
        });
			}
		},
		{
			text: "Cancel",
			click: function() {
				$( this ).dialog( "close" );
			}
		}
	]
                    });
JS;
      $this->script($code);
      return FALSE;
    }

    // Closing the DIalog
    $dialog_id = $_POST['_dialog_id'];
    $this->script("$('#{$dialog_id}').dialog('close');");
    return TRUE;
  }

  /**
   * Generate Dialog script
   *
   * @access  private
   * @param   array   $data
   * @return  void
   */
  public function dialog($data) {


    $dialog_id = (empty($data['id'])) ? 'dialog-' . mt_rand(1000000, 9999999) : $data['id'];

    $this->dialog->set_id($dialog_id);

    if (!empty($data['title'])) {
      $this->dialog->set_title($data['title']);
    }

    if (!empty($data['content'])) {
      $this->dialog->set_content($data['content']);
    }


    $html = $this->dialog->html();
    $json_html = json_encode($html);

    /*
     * - Append dialog HTML to <body>.
     * - Store reference of the button that toggles this dialog (caller)
     * on every async forms of the dialog.
     * - Launch the dialog.
     * - Register an event to destroy the dialog after it was closed
     * (must use setTimeout to prevent the dialog from being completely removed
     * before other scripts, which retrieve dialog's data, are executed,
     * especially for dialogs that have no hidden effect or for IE).
     */

    $code = <<< JS
    $('body').append({$json_html});
    $('#{$dialog_id}').dialog({
                      modal: true,
                      	buttons: [
		{
			text: "Cancel",
			click: function() {
				$( this ).dialog( "close" );
			}
		}
	]
                    });
JS;

    $this->script($code);
  }

  /**
   * Send response to CIS.Ajax.response() Javascript function
   *
   * @access  public
   * @param   boolean $data
   * @return  void
   */
  public function send($return = FALSE) {
    if (!empty($this->data) && $this->input->is_ajax_request()) {
      $json_data = json_encode($this->data);
      if ($return) {
        return $json_data;
      } else {
        echo $json_data;
        exit;
      }
    }
  }

}
