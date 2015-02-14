<?php

class Board extends Model {

  private function generate_id() {
    $sql = "SELECT id FROM boards ORDER BY id DESC LIMIT 0,1 ;";
    $result = $this->db->ExecuteSQL($sql);
    return $result[0]["id"] + 1;
  }

  public function create($title, $description, $chalkmarks, $audio_file) {
    $id = $this->generate_id();
    $sql = "INSERT INTO boards SET id = '" . $id . "',"
            . "title = '". $title ."',"
            . "description = '".$description."',"
            . "chalkmarks = '". $chalkmarks ."',"
            . "audio_file = '". $audio_file ."';";
    return $this->db->ExecuteSQL($sql);
  }

  public function retrieve($id = '%') {
    $sql = "SELECT * FROM boards WHERE id Like '". $id ."';";
    $result = $this->db->ExecuteSQL($sql);
    return $result;
  }
  
  public function delete($id = '%') {
    $sql = "SELECT * FROM boards WHERE id Like '". $id ."';";
    $result = $this->db->ExecuteSQL($sql);
    return $result;
  }

}
