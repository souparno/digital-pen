QUnit.module('Recording', {
  beforeEach: function () {
    this.recording = new Recording();
  }
});

QUnit.test('input', function (assert) {
  this.recording.input({x:1, y:2});
  this.recording.input({x:3, y:4});
  this.recording.input({x:5, y:6});
  this.recording.input({x:7, y:8});

  
  console.log(this.recording.serialise());
  assert.equal(true, true);
});
