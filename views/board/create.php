<html>
  <head>
    <link href="./assets/css/jquery-ui-1.11.3/jquery-ui.min.css" rel="stylesheet">  
  </head>
  <body>
    <table>
      <tr>
        <td>Title</td>
        <td><input type="text" id="title" /></td>
      </tr>
      <tr>
        <td>Description</td>
        <td><textarea id="description"></textarea></td>
      </tr>
    </table>
    <button id="enable-audio">Enable Audio</button>
    <button id="start-record">Start Record</button>
    <button id="save-board">Save</button>
    <script src="./assets/js/lib/jquery-1.11.2.min.js"></script>
    <script src="./assets/js/audio/recorder.js"></script>
    <script src="./assets/js/audio/jquery.voice.min.js"></script>
    <script src="./assets/js/mini.js"></script>
    <script src="./assets/js/pointerlock.js"></script>
    <script src="./assets/js/blackboard.js"></script>    
    <script src="./assets/js/margarine.js"></script>
    <script src="./assets/js/lib/jquery-ui-1.11.3.min.js"></script>
    <script>
      $(document).ready(function () {
        var recording = null;

        var onStop = function () {
          recording = Record.get();
          $.voice.stop();
        };

        $('#enable-audio').click(function () {
          $.voice.record(function () {  });
        });
        $('#start-record').click(function () {
          Record.start(onStop, function () {
            console.log('error occured');
          });
        });

        $('#save-board').click(function () {
          $.voice.export(function (blob) {
            var formData = new FormData();
            formData.append('blob', blob);
            formData.append('chalkmarks', JSON.stringify(recording));
            formData.append('title', $("#title").val());
            formData.append('description', $("#description").val());

            Ajax.request('/ajaxifyCreate', {
              data: formData,
              processData: false,
              contentType: false,
              type: 'POST'                      
            });
          }, 'blob');
        });
      });
    </script>
  </body>
</html>
