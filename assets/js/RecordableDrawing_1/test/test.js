QUnit.module('Record', {
  beforeEach: function () {
    this.record = new Record();
  }
});

QUnit.asyncTest('push', function (assert) {
  var pointList = [{x: 1, y: 2}, {x: 3, y: 4}, {x: 5, y: 6}],
    intervals = [0, 500, 1000],
    temp_pointList = pointList.slice(),
    temp_intervals = intervals.slice(), 
    loop = function (i, timeslot) {
      setTimeout(function () {
        this.record.push(temp_pointList.shift());
        if (--i) {
          loop.call(this, i , temp_intervals.shift());
        } else {
          timeTest.call(this);
        }
      }.bind(this), timeslot);
    },
    timeTest = function () {
      assert.equal(Math.round(this.record.actionList.shift().interval/100)*100,
        intervals.shift());
      assert.equal(Math.round(this.record.actionList.shift().interval/100)*100,
        intervals.shift());
      assert.equal(Math.round(this.record.actionList.shift().interval/100)*100,
        intervals.shift());
      QUnit.start();
    };

  this.record.start();
  loop.call(this, temp_pointList.length, temp_intervals.shift());
});

QUnit.asyncTest('pop', function (assert) {
  var pointList = [{x: 1, y: 2}, {x: 3, y: 4}, {x: 5, y: 6}],
    intervals = [500, 1000, 2000],
    temp_pointList = pointList.slice(),
    temp_intervals = intervals.slice(), 
    loop = function (i, timeslot) {
      setTimeout(function () {
        this.record.push(temp_pointList.shift());
        if (--i) {
          loop.call(this, i , temp_intervals.shift());
        } else {
          play.call(this);
        }
      }.bind(this), timeslot);
    },
    play = function () {
      var lastTimeSlot = null;

      this.record.stop();
      lastTimeSlot = (new Date()).getTime();
      this.record.pop(function (x, y) {
        var point = pointList.shift(),
          presentTime =  (new Date()).getTime(),
          interval = presentTime - lastTimeSlot;

        lastTimeSlot = presentTime;  
        assert.equal(x, point.x),
        assert.equal(y, point.y),
        assert.equal(Math.round(interval/100)*100, intervals.shift());
        if(!intervals.length){
          QUnit.start();
        }
      }.bind(this));
    };

  this.record.start();
  loop.call(this, temp_pointList.length, temp_intervals.shift());
});

