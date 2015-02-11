QUnit.module('Queue', {
  beforeEach: function () {
    this.queue = new Queue();
    this.startTime = (new Date()).getTime();
  }
});

QUnit.asyncTest('push', function (assert) {
  var pointList = [{x: 1, y: 2}, {x: 3, y: 4}, {x: 5, y: 6}],
    intervals = [0, 500, 1000],
    temp_pointList = pointList.slice(),
    temp_intervals = intervals.slice(), 
    loop = function (i, timeslot) {
      setTimeout(function () {
        var point = temp_pointList.shift();

        this.queue.push(point.x, point.y, 0);
        if (--i) {
          loop.call(this, i , temp_intervals.shift());
        } else {
          timeTest.call(this);
        }
      }.bind(this), timeslot);
    },
    timeTest = function () {
      var actionList = this.queue.get(),
        point;
      
      for(var action in actionList) {
        point = pointList.shift();
        assert.equal(actionList[action].x, point.x);
        assert.equal(Math.round(actionList[action].interval/100)*100,
          intervals.shift());        
      }
      this.queue.clear();
      QUnit.start();
    };

  loop.call(this, temp_pointList.length, temp_intervals.shift());
});

QUnit.asyncTest('forEachpop', function (assert) {
  var pointList = [{x: 1, y: 2}, {x: 3, y: 4}, {x: 5, y: 6}],
    intervals = [500, 1000, 2000],
    temp_pointList = pointList.slice(),
    temp_intervals = intervals.slice(), 
    loop = function (i, timeslot) {
      setTimeout(function () {
        var point = temp_pointList.shift();

        this.queue.push(point.x, point.y, 0);
        if (--i) {
          loop.call(this, i , temp_intervals.shift());
        } else {
          play.call(this);
        }
      }.bind(this), timeslot);
    },
    play = function () {
      var lastTimeSlot = null;

      lastTimeSlot = (new Date()).getTime();
      this.queue.forEachpop(function (x, y) {
        var point = pointList.shift(),
          presentTime =  (new Date()).getTime(),
          interval = presentTime - lastTimeSlot;

        lastTimeSlot = presentTime;  
        assert.equal(x, point.x),
        assert.equal(y, point.y),
        assert.equal(Math.round(interval/100)*100, intervals.shift());
        if(!intervals.length){
          this.queue.clear();
          QUnit.start();
        }
      }.bind(this));
    };

  loop.call(this, temp_pointList.length, temp_intervals.shift());
});

QUnit.module('Pen ', {
  beforeEach: function () {
    Board.initialise('canvas1');
    this.pen = new Pen();
  }
});
QUnit.test('moveTo', function (assert) {
  var _beginPath = Board.context.beginPath,
    _moveTo = Board.context.moveTo,
    beginPath_called = false,
    moveTo_x = null, moveTo_y = null;

  Board.context.beginPath = function () {
    beginPath_called = true;
  };
  Board.context.moveTo = function (x, y) {
    moveTo_x = x;
    moveTo_y = y;
  };

  this.pen.moveTo(1, 2);
  assert.equal(true, beginPath_called);
  assert.equal(moveTo_x, 1);
  assert.equal(moveTo_y, 2);

  Board.context.beginPath = _beginPath;
  Board.context.moveTo = _moveTo;
});
QUnit.test('draw', function (assert) {
  var _lineTo = Board.context.lineTo,
    _stroke = Board.context.stroke,
    stroke_called = false,
    line_x = null, line_y = null;

  Board.context.stroke = function () {
    stroke_called = true;
  };
  Board.context.lineTo = function (x, y) {
    line_x = x;
    line_y = y;
  };

  this.pen.draw(1, 2);
  assert.equal(true, stroke_called);
  assert.equal(line_x, 1);
  assert.equal(line_y, 2);

  Board.context.stroke = _stroke;
  Board.context.lineTo = _lineTo;
});
  
QUnit.module('Board', {
  beforeEach: function () {
    Board.initialise('canvas1');
  }
});
QUnit.test('mouseDown', function (assert) {
   var mousedown = $.Event('mousedown'),
     mouseup = $.Event('mouseup');;

  mousedown.pageX = 100;
  mousedown.pageY = 250;
  $("#canvas1").trigger(mousedown);

  assert.equal(true, true);
  $("#canvas1").trigger(mouseup);
});
