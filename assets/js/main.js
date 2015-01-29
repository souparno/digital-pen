$(document).ready(function () {
  "use strict";

  var drawing = new RecordableDrawing("canvas1");

  $("#recordBtn").click(function () {
    var btn = $("#recordBtn"), btnTxt = btn.prop("value");

    switch (btnTxt) {
      case 'Record':
        btn.prop("value", "Stop Record");
        drawing.startRecording();        
        break;
      case 'Stop Record':
        btn.prop("value", "Record");
        drawing.stopRecording();        
        break;
    }
  });
  
  $("#playBtn").click(function () {
    drawing.playRecording(function () {}, function () {}, function () {}, function () {});
  });

  $("#saveBtn").click(function () {
    var serResult = serializeDrawing(drawing);
    console.log(serResult);
  });
  
  $("#clearBtn").click(function(){
		drawing.clearCanvas();			
	});

});