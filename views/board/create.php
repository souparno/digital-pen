<html>
  <head>
    <link href="./assets/css/jquery-ui-1.11.3/jquery-ui.min.css" rel="stylesheet">  
  </head>
  <body>
    <p>
      <audio controls src="" id="audio"></audio>
      <br/>
      <canvas id="canvas1" style="border: medium; border-color: #00F; border-style: solid;" width="500" height="400"></canvas>      
      <br/>
    <button id="start-record">Start Record</button>
    <button id="stop-record">Stop record</button>
    <button id="play-record">Play Record</button>
    <button id="save-board">save</button>
    </p>
    <div id="records">
      <table id="record-table">
        <script type="text/html" id='table-data'>
            <% _.each(items, function(value, key){ %>
            <tr>
              <td><%= key %></td>
              <td><%= value %></td>
            </tr>
            <% }) %>
        </script>
      </table>      
    </div>
    <script src="./assets/js/jquery/jquery-1.11.2.min.js" type="text/javascript"></script>
    <script src="./assets/js/audio/recorder.js"></script>
    <script src="./assets/js/audio/jquery.voice.min.js"></script>
    <script src="./assets/js/mini/mini.js"></script>
    <script src="./assets/js/blackboard/blackboard.js" type="text/javascript"></script>
    <script src="./assets/js/margarine/margarine.js"></script>
    <script src="./assets/js/jquery-ui-1.11.3/jquery-ui.min.js"></script>
    <script>
      $(document).ready(function () {
        Board.initialise('canvas1');

        $('#start-record').click(function () {
          console.log('record started');
          $.voice.record(false, function () {
            
          });
          Board.startRecording();
        });
        
        $('#stop-record').click(function () {
          console.log('record stopped');
          $.voice.stop();
          Board.stopRecording();
        });
        
        $('#play-record').click(function () {
          console.log('record playing');
          Board.clearCanvas();
          Board.playRecording();
        });
        
        $('#save-board').click(function () {
          Board.stopRecording();
          $.voice.export(function (blob) {
            var formData = new FormData();
            formData.append('blob', blob);
            formData.append('chalkmarks', JSON.stringify(Board.getRecording()));

            Ajax.request('/ajaxifyCreate', {
              'data': formData,
              'processData': false,
              'contentType': false,
              'type': 'POST',
              'table-data': $("#table-data"),
              'record-table': $("#record-table")
            });
          }, 'blob');
        });
      });
    </script>
  </body>
</html>
