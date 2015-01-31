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

});