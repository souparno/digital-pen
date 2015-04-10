// PhantomJS 1.9.8 doesn't support bind yet
Function.prototype.bind = Function.prototype.bind ||
  function (ctx) {
    var fn = this,
      args = [],
      param_length = 0;

    for(var i=0; i<arguments.length; i++) {    
      if(i){
        args[i-1] = arguments[i];
      }
    }
    param_length = args.length;
    return function () {
      for(var i =0; i<arguments.length; i++){
        args[param_length + i] = arguments[i];
      }
      return fn.apply(ctx, args);
    };
  };

//QUnit.module('Queue', {
//  beforeEach: function () {
//    Queue.reset();
//  }
//});
//QUnit.asyncTest('push', function (assert) {
//  var pointList = [{x: 1, y: 2}, {x: 3, y: 4}, {x: 5, y: 6}],
//    intervals = [0, 500, 1000],
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
//          timeTest.call(this);
//        }
//      }.bind(this), timeslot);
//    },
//    timeTest = function () {
//      var actionList = Queue.get(),
//        point;
//
//      for (var action in actionList) {
//        point = pointList.shift();
//        assert.equal(actionList[action].x, point.x);
//        assert.equal(Math.round(actionList[action].interval / 100) * 100,
//          intervals.shift());
//      }
//      Queue.clear();
//      QUnit.start();
//    };
//
//  loop.call(this, temp_pointList.length, temp_intervals.shift());
//});
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

//QUnit.module('Pen');
//QUnit.test('moveTo', function (assert) {
//  var beginPath_called = false,
//    moveTo_x = null,
//    moveTo_y = null,
//    _context = {
//      moveTo: function (x, y) {
//        moveTo_x = x;
//        moveTo_y = y;
//      },
//      beginPath: function () {
//        beginPath_called = true;
//      }
//    },
//    pen = new Pen(_context);
//
//  pen.moveTo(1, 2);
//  assert.equal(true, beginPath_called);
//  assert.equal(moveTo_x, 1);
//  assert.equal(moveTo_y, 2);
//});
//QUnit.test('draw', function (assert) {
//  var stroke_called = false,
//    line_x = null,
//    line_y = null,
//    _context = {
//      stroke: function () {
//        stroke_called = true;
//      },
//      lineTo: function (x, y) {
//        line_x = x;
//        line_y = y;
//      }
//    },
//    pen = new Pen(_context);
//   
//  pen.draw(1, 2);
//  assert.equal(true, stroke_called);
//  assert.equal(line_x, 1);
//  assert.equal(line_y, 2);
//});

QUnit.module('Board', {
  beforeEach: function () {
    var obj = {
      get: function () {
        return {
          getContext: function () {}
        }; 
      },
      width: function () { return 100; },
      attr: function (param) { return param; }
    };

    this.$ = $;
    $ = function () { return obj;};
  },
  afterEach: function () {
    $ = this.$;
  }
});
QUnit.asyncTest('playRecording', function (assert) {
  var bound = {
      minX : -4,
      maxX: 196,
      minY: -2,
      maxY: 98,
      actions: []
    },
    check_against = [
      {
        x: 0,
        y: 0
      },
      {
        x: 47,
        y: 21
      }
    ],
    board = new Board(true, bound);

  board.pen.moveTo = function (x, y) {
    var point = check_against.shift();

    assert.equal(x, point.x);
    assert.equal(y, point.y);
    if(!check_against.length) {
      QUnit.start();
    }
  };
  board.playRecording([
    {x:-4, y:-2, type:0, interval:0},
    {x:90, y:40, type:0, interval:1}
  ]);
});

//QUnit.module('Pointer', {
//  beforeEach: function () {
//    this.pointer = new Pointer($(document.body));
//    this.pointerLockElement = document.pointerLockElement;
//    document.pointerLockElement = document.body;
//  },
//  afterEach: function () {
//    document.pointerLockElement = this.pointerLockElement;
//  }
//});
//QUnit.test('lock enter should call the enter function', function (assert) {
//  var enter = false,
//    onEnter = function () {
//      enter = true;
//    }, 
//    temp_requestPointerLock = document.body.requestPointerLock;
//    
//  document.body.requestPointerLock = function () {
//    return true;
//  };
//  this.pointer.lock(onEnter, undefined);
//  $(document).trigger('pointerlockchange');
//  assert.equal(enter, true);
//  document.body.requestPointerLock = temp_requestPointerLock;
//});
//QUnit.test('lock exit should call the exit function', function (assert) {
//  var exit = false,
//    onExit = function () {
//      exit = true;
//    },
//    temp_requestPointerLock = document.body.requestPointerLock;
//    
//  document.body.requestPointerLock = function () {
//    return false;
//  };
//  this.pointer.lock(undefined, onExit);
//  $(document).trigger('pointerlockchange');
//  assert.equal(exit, true);
//  document.body.requestPointerLock = temp_requestPointerLock;
//});