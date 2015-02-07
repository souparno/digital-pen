QUnit.module('Record', {
  beforeEach: function () {
    this.record = new Record();
  }
});
//
//QUnit.test('add', function (assert) {
//  this.record.add({x: 1, y: 2});
//  this.record.add({x: 3, y: 4});
//
//  assert.equal(this.record.actionList.length, 2);
//});

QUnit.asyncTest('add with time stamp', function (assert) {
  var pointList = [{x: 1, y: 2}, {x: 3, y: 4}, {x: 5, y: 6}],
    pointList_length = pointList.length,  
    loop = function (i, timeslot) {
      setTimeout(function () {
        this.record.add(pointList[pointList_length - i]);
        if (--i) {
          loop.call(this, i , timeslot + 500);
        } else {
          timeTest.call(this);
        }
      }.bind(this), timeslot);
    },
    timeTest = function () { 
      var interval = [];

      interval.push(this.record.actionList[0].interval);
      interval.push(this.record.actionList[1].interval);
      interval.push(this.record.actionList[2].interval);

      assert.equal(Math.round(interval[0]/100)*100, 0);
      assert.equal(Math.round(interval[1]/100)*100, 500);
      assert.equal(Math.round(interval[2]/100)*100, 1000);
      QUnit.start();
    };

  this.record.start();
  loop.call(this, pointList_length, 0);

});
//QUnit.asyncTest('play', function (assert) {
//
//  this.record.add({x:1, y:2});
//  this.record.add({x:3, y:4});
//  this.record.add({x:5, y:6});
//  this.record.add({x:7, y:8});
//
//  this.record.play();
//
//  var timeSlot = (new Date()).getTime();
//  setTimeout(function () {
//    assert.equal(Math.round(((new Date()).getTime() - timeSlot)/10)*10 , 100);
//    QUnit.start();
//  }.bind(this), 100);
//});

