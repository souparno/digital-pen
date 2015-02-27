// PhantomJS 1.9.8 doesn't support bind yet
Function.prototype.bind = Function.prototype.bind || function (thisp) {
  var fn = this, args = arguments;

  for(var i=0; i<args.length; i++) {    
    if(i){
      args[i-1] = arguments[i];
    }
  }
  return function () {
    return fn.apply(thisp, args);
  };
};

QUnit.module('Queue', {
  beforeEach: function () {
    Queue.reset();
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

        Queue.push(point.x, point.y, 0);
        if (--i) {
          loop.call(this, i, temp_intervals.shift());
        } else {
          timeTest.call(this);
        }
      }.bind(this), timeslot);
    },
    timeTest = function () {
      var actionList = Queue.get(),
        point;

      for (var action in actionList) {
        point = pointList.shift();
        assert.equal(actionList[action].x, point.x);
        assert.equal(Math.round(actionList[action].interval / 100) * 100,
          intervals.shift());
      }
      Queue.clear();
      QUnit.start();
    };

  loop.call(this, temp_pointList.length, temp_intervals.shift());
});
//QUnit.asyncTest('forEachpop', function (assert) {
//  var pointList = [{x: 1, y: 2}, {x: 3, y: 4}, {x: 5, y: 6}],
//    intervals = [500, 1000, 2000],
//    temp_pointList = pointList.slice(),
//    temp_intervals = intervals.slice(),
//    loop = function (i, timeslot) {
//      setTimeout(function () {
//        var point = temp_pointList.shift();
//
//        Queue.push(point.x, point.y, 0);
//        if (--i) {
//          loop.call(this, i, temp_intervals.shift());
//        } else {
//          play.call(this);
//        }
//      }.bind(this), timeslot);
//    },
//    play = function () {
//      var lastTimeSlot = null;
//
//      lastTimeSlot = (new Date()).getTime();
//      Queue.forEachpop(function (x, y) {
//        var point = pointList.shift(),
//          presentTime = (new Date()).getTime(),
//          interval = presentTime - lastTimeSlot;
//
//        lastTimeSlot = presentTime;
//        assert.equal(x, point.x),
//          assert.equal(y, point.y),
//          assert.equal(Math.round(interval / 100) * 100, intervals.shift());
//        if (!intervals.length) {
//          Queue.clear();
//          QUnit.start();
//        }
//      }.bind(this));
//    };
//
//  loop.call(this, temp_pointList.length, temp_intervals.shift());
//});

QUnit.module('Pen');
QUnit.test('moveTo', function (assert) {
  var beginPath_called = false,
    moveTo_x = null,
    moveTo_y = null,
    _context = {
      moveTo: function (x, y) {
        moveTo_x = x;
        moveTo_y = y;
      },
      beginPath: function () {
        beginPath_called = true;
      }
    },
    pen = new Pen(_context);

  pen.moveTo(1, 2);
  assert.equal(true, beginPath_called);
  assert.equal(moveTo_x, 1);
  assert.equal(moveTo_y, 2);
});
QUnit.test('draw', function (assert) {
  var stroke_called = false,
    line_x = null,
    line_y = null,
    _context = {
      stroke: function () {
        stroke_called = true;
      },
      lineTo: function (x, y) {
        line_x = x;
        line_y = y;
      }
    },
    pen = new Pen(_context);
   
  pen.draw(1, 2);
  assert.equal(true, stroke_called);
  assert.equal(line_x, 1);
  assert.equal(line_y, 2);
});

//QUnit.module('Record');
//QUnit.test('start', function (assert) {
//  var count_event =0;
//  
//  Record.start();
//  for(var key in $._data( $(document)[0], "events" )){
//    count_event++;
//  }
//  assert.equal(count_event, 4);
//});

QUnit.module('Pointer', {
  beforeEach: function () {
    this.pointer = new Pointer($(document.body));
  }
});
QUnit.test('lock enter should call the enter function', function (assert) {
  var enter = false,
    onEnter = function () {
      enter = true;
    }, 
    temp_pointerLockElement = document.pointerLockElement,
    temp_requestPointerLock = document.body.requestPointerLock;
    
  document.pointerLockElement = document.body;
  document.body.requestPointerLock = function () {
    return true;
  };
  this.pointer.lock(onEnter, undefined);
  $(document).trigger('pointerlockchange');
  assert.equal(enter, true);
  document.pointerLockElement = temp_pointerLockElement;
  document.body.requestPointerLock = temp_requestPointerLock;
});
QUnit.test('lock exit should call the exit function', function (assert) {
  var exit = false,
    onExit = function () {
      exit = true;
    },
    temp_requestPointerLock = document.body.requestPointerLock;
    
  document.body.requestPointerLock = function () {
    return false;
  };
  this.pointer.lock(undefined, onExit);
  $(document).trigger('pointerlockchange');
  assert.equal(exit, true);
  document.body.requestPointerLock = temp_requestPointerLock;
});