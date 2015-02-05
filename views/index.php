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
      <input type="button" id="recordBtn" value="Record" style="display: inline-block;"> 
      <input type="button" id="playBtn" value="Play" style="display: inline-block;"> 
      <input type="button" id="pauseBtn" value="Pause" style="display: none;"> 
      <input type="button" id="clearBtn" value="Clear" style="display: inline-block;">
      <input type="button" id="saveBtn" value="Save" style="display: inline-block;">
    </p>
    <p id="topics"></p>


    <script src="./assets/js/jquery/jquery-1.11.2.min.js" type="text/javascript"></script>
    <script src="./assets/js/RecordableDrawing/RecordableDrawing.js" type="text/javascript"></script>
    <script src="./assets/js/RecordableDrawing/drawingSerializer.js" type="text/javascript"></script>
    <script src="./assets/js/margarine/margarine.js" type="text/javascript"></script>
    <script src="./assets/js/underscore/underscore-min.js"></script>   
    <script src="./assets/js/audio/recorder.js"></script>
    <script src="./assets/js/audio/jquery.voice.min.js"></script>
    <script src="./assets/js/main.js" type="text/javascript"></script> 
    <script>
        $(document).ready(function () {
          "use strict";

          var drawing = new RecordableDrawing("canvas1");

          $("#recordBtn").click(function () {
            var btn = $("#recordBtn"), btnTxt = btn.prop("value");

            switch (btnTxt) {
              case 'Record':
                btn.prop("value", "Stop Record");
                $.voice.record(false, function () {

                });
                drawing.startRecording();
                break;
              case 'Stop Record':
                btn.prop("value", "Record");
                $.voice.stop();
                drawing.stopRecording();
                break;
            }
          });

          $("#playBtn").click(function () {
            drawing.playRecording(function () {
            }, function () {
            }, function () {
            }, function () {
            });
          });

          $("#saveBtn").click(function () {
            var serResult = serializeDrawing(drawing);
            
            
            console.log(serResult);
            
            $.voice.stop();
            $.voice.export(function (blob) {
              var formData = new FormData();
              formData.append('blob', blob);
              formData.append('chalkmarks', serResult);

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
            }, "blob");
          });

          $("#clearBtn").click(function () {
            drawing.clearCanvas();
          });

          function play(serTxt, url) {
            var result = deserializeDrawing(serTxt);
            drawing.recordings = result;
            for (var i = 0; i < result.length; i++) {
              result[i].drawing = drawing;
            }
            drawing.playRecording(function () { },
              function () { },
              function () { },
              function () { });
            $("#audio").attr("src", url);
            $("#audio")[0].play();
          }

          
        });
      </script>
    <?php
    if (count($data)) {
      var_dump( $data);
      ?>
      
      <?php
    }
    ?>
  </body>
</html>
