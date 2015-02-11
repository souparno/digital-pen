<html>
  <head>
    <style>
      .button{
        display: inline-block;
        vertical-align: middle;
        margin: 0px 5px;
        padding: 5px 12px;
        cursor: pointer;
        outline: none;
        font-size: 13px;
        text-decoration: none !important;
        text-align: center;
        color:#fff;
        background-color: #4D90FE;
        background-image: linear-gradient(top,#4D90FE, #4787ED);
        background-image: -ms-linear-gradient(top,#4D90FE, #4787ED);
        background-image: -o-linear-gradient(top,#4D90FE, #4787ED);
        background-image: linear-gradient(top,#4D90FE, #4787ED);
        border: 1px solid #4787ED;
        box-shadow: 0 1px 3px #BFBFBF;
      }
      a.button{
        color: #fff;
      }
      .button:hover{
        box-shadow: inset 0px 1px 1px #8C8C8C;
      }
      .button.disabled{
        box-shadow:none;
        opacity:0.7;
      }
    </style>
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
    <p id="topics"></p>


    <script src="./assets/js/jquery/jquery-1.11.2.min.js" type="text/javascript"></script>
    <script src="./assets/js/audio/recorder.js"></script>
    <script src="./assets/js/audio/jquery.voice.min.js"></script>
    <script src="./assets/js/mini/mini.js"></script>
    <script src="./assets/js/blackboard/blackboard.js" type="text/javascript"></script>
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
          $.voice.stop();
          $.voice.export(function (blob) {
            var formData = new FormData();
            formData.append('blob', blob);
            formData.append('chalkmarks', JSON.stringify(Board.getRecording()));
          
            $.ajax({
              url: '/create',
              data: formData,
              processData: false,
              contentType: false,
              type: 'POST',
              success: function (data) {
                console.log(data);
              }
            });
          }, 'blob');
        });
      });
    </script>
  </body>
</html>
