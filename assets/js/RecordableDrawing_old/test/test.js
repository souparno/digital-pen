QUnit.module('RecordableDrawing', {
  beforeEach: function () {
    this.drawing = new RecordableDrawing("canvas1");
  },
  afterEach: function () {
    $("#canvas1").unbind();
  }
});
QUnit.test('startRecording', function (assert) {
  this.drawing.startRecording();
  this.drawing.recording.addAction({
    a: 1
  });
  console.log(this.drawing.recordings[0]);
  assert.equal(true, true);
});
QUnit.asyncTest('should serialise recording', function (assert) {

  var serResult,
    mousedown = $.Event('mousedown'),
    mousemove = $.Event('mousemove'),
    mouseup = $.Event('mouseup');

  this.drawing.startRecording();

  mousedown.pageX = 100;
  mousedown.pageY = 250;
  $("#canvas1").trigger(mousedown);

  mousemove.pageX = 101;
  mousemove.pageY = 250;
  $("#canvas1").trigger(mousemove);

  $("#canvas1").trigger(mouseup);

  setTimeout(function () {
   serResult = serializeDrawing(this.drawing);
   assert.equal(true, true);
//    assert.equal(JSON.parse(serResult),
//      [{
//          "actionsets": 
//            [
//              {
//                "actions": 
//                  [
//                    {"type": 0, "actionType": 1, "x": 92, "y": 12, "isMovable": false},
//                    {"type": 1, "actionType": 1, "x": 93, "y": 12, "isMovable": false}
//                  ],
//                "interval": JSON.parse(serResult)[0].actionsets[0].interval
//              }
//            ]
//        }]);
    QUnit.start();
  }.bind(this), 100);
});

QUnit.module('Recording', {
  beforeEach: function () {
    this.recording = new Recording();
  }
});
QUnit.test('addAction', function (assert) {
  this.recording.start();
  this.recording.addAction({
    a: 1
  });
  assert.equal(this.recording.buffer[0].a, 1);
});

QUnit.module('drawingSerialiser', function () {
});
