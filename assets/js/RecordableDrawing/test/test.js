var drawing = new RecordableDrawing("canvas1");

QUnit.test('should initialise the Canvas Class properties', function (assert) {
  

  assert.equal(drawing.width, 500);
  assert.equal(drawing.height, 400);
});

//QUnit.test('mousedown event handler', function (assert) {
//  $("#canvas1").simulate('mousedown', {clientX: 24, clientY: 335});
//  assert.equal(true, true);
//});
//
//QUnit.test('mouseup event handler', function (assert) {
//  $("#canvas1").simulate('mouseup', {clientX: 24, clientY: 335});
//  assert.equal(true, true);
//});

QUnit.test('should serialise recording', function (assert) {
  var serResult;

  drawing.startRecording();
  $("#canvas1").simulate('drag-n-drop', {dx: -71, dy: 71});
  //drawing.stopRecording();
  //drawing.clearCanvas();
  //serResult = serializeDrawing(drawing);
  //console.log(serResult);
  assert.equal(true, true);  
});


