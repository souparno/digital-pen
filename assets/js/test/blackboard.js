// PhantomJS 1.9.8 doesn't support bind yet
Function.prototype.bind = Function.prototype.bind ||
  function (ctx) {
    var fn = this,
      args = [],
      param_length = 0;

    for (var i = 0; i < arguments.length; i++) {
      if (i) {
        args[i - 1] = arguments[i];
      }
    }
    param_length = args.length;
    return function () {
      for (var i = 0; i < arguments.length; i++) {
        args[param_length + i] = arguments[i];
      }
      return fn.apply(ctx, args);
    };
  };

QUnit.module('Queue', {
  beforeEach: function () {
    this.queue = new Queue();
    this.queue.reset();
  },
  afterEach: function () {
    this.queue.reset();
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
          loop.call(this, i, temp_intervals.shift());
        } else {
          timeTest.call(this);
        }
      }.bind(this), timeslot);
    },
    timeTest = function () {
      var actionList = this.queue.get(),
        point;

      for (var action in actionList) {
        point = pointList.shift();
        assert.equal(actionList[action].x, point.x);
        assert.equal(Math.round(actionList[action].interval / 100) * 100,
          intervals.shift());
      }
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
//        this.queue.push(point.x, point.y, 0);
//        if (--i) {
//          loop.call(this, i, temp_intervals.shift());
//        } else {
//          play.call(this);
//        }
//      }.bind(this), timeslot);
//    },
//    play = function () {
//      var lastTimeSlot = (new Date()).getTime();
//
//      this.queue.forEachpop(function (x, y) {
//        var point = pointList.shift(),
//          presentTime = (new Date()).getTime(),
//          interval = presentTime - lastTimeSlot;
//
//        lastTimeSlot = presentTime;
//        assert.equal(x, point.x);
//        assert.equal(y, point.y);
//        assert.equal(Math.round(interval / 100) * 100, intervals.shift());
//        if (!intervals.length) {
//          QUnit.start();
//        }
//      }.bind(this));
//    };
//
//  loop.call(this, temp_pointList.length, temp_intervals.shift());
//});

QUnit.module('Record', {
  beforeEach: function () {
    this.cntxt = {
      beginPath: function () {
      },
      moveTo: function () {
      },
      lineTo: function () {
      },
      lineWidth: 0,
      strokeStyle: '',
      stroke: function () {
      }
    };
    this.width = function () {
    };
    this.attr = function () {
    };
    this.$ = $;
    $ = function () {
      return {
        get: function () {
          return {
            getContext: function () {
              return this.cntxt;
            }.bind(this)
          };
        }.bind(this),
        width: this.width,
        attr: this.attr
      };
    }.bind(this);
    doc = {
      addEventListener: function (evt, fn) {
        this[evt] = fn;
      },
      removeEventListener: function () {
      }
    };
    PointerLock.requestLock = function (elm, fn) {
      fn();
    };
    this.record = new Record();
  },
  afterEach: function () {
    $ = this.$;
    doc = document;
  }
});
QUnit.asyncTest('start', function (assert) {
  var recording = {},
    height = 0,
    queue_check = [
      {x: 0, y: 0, type: 0},
      {x: 1, y: -1, type: 1},
      {x: 2, y: -2, type: 1},
      {x: 3, y: -3, type: 1},
      {x: 4, y: -4, type: 1},
      {x: 5, y: -5, type: 1},
      {x: 6, y: -6, type: 1},
      {x: 7, y: -7, type: 1},
      {x: 8, y: -8, type: 1},
      {x: 9, y: -9, type: 1},
      {x: 10, y: -10, type: 1}
    ],
    lineTo_check = [
      {x: 0.5, y: 4.5},
      {x: 1, y: 4},
      {x: 1.5, y: 3.5},
      {x: 2, y: 3},
      {x: 2.5, y: 2.5},
      {x: 3, y: 2},
      {x: 3.5, y: 1.5},
      {x: 4, y: 1},
      {x: 4.5, y: 0.5},
      {x: 5, y: 0}
    ];

  this.record.start();
  doc.mousedown({movementX: 0, movementY: 0});
  doc.mousemove({movementX: 1, movementY: -1});
  doc.mousemove({movementX: 1, movementY: -1});
  doc.mousemove({movementX: 1, movementY: -1});
  doc.mousemove({movementX: 1, movementY: -1});
  doc.mousemove({movementX: 1, movementY: -1});
  doc.mousemove({movementX: 1, movementY: -1});
  doc.mousemove({movementX: 1, movementY: -1});
  doc.mousemove({movementX: 1, movementY: -1});
  doc.mousemove({movementX: 1, movementY: -1});
  doc.mousemove({movementX: 1, movementY: -1});
  doc.mouseup({movementX: 0, movementY: 0});
  recording = this.record.get();

  for(var k in recording.queue){
    var q = queue_check.shift();

    assert.equal(recording.queue[k].x, q.x);
    assert.equal(recording.queue[k].y, q.y);
    assert.equal(recording.queue[k].type, q.type);
  }  
  assert.equal(recording.bound.minX, 0);
  assert.equal(recording.bound.maxX, 10);
  assert.equal(recording.bound.minY, -10);
  assert.equal(recording.bound.maxY, 0);

  this.width = function () {
    return 5;
  };
  this.attr = function (key, value) {
    if (key === 'height') {
      height = value;
    }
  };
  this.cntxt.lineTo = function (x, y) {
    var cord = lineTo_check.shift();
    
    assert.equal(cord.x, x);
    assert.equal(cord.y, y);
  };
  this.record.play(true,
    recording,
    function () {
      assert.equal(height, 5);
      this.start();
    }.bind(QUnit));
});
QUnit.asyncTest('play', function (assert) {
  var bound = {
    minX: -4,
    maxX: 196,
    minY: -2,
    maxY: 98
  },
  queue = [
    {x: -4, y: -2, type: 0, interval: 0},
    {x: 90, y: 40, type: 0, interval: 1}
  ],
    check_against = [
      {
        x: 0,
        y: 0
      },
      {
        x: 47,
        y: 21
      }
    ];

  this.width = function () {
    return 100;
  };
  this.cntxt.moveTo = function (x, y) {
    var point = check_against.shift();

    assert.equal(x, point.x);
    assert.equal(y, point.y);
  };
  this.record.play(true,
    {
      bound: bound,
      queue: queue
    }, function () {
      this.start();
    }.bind(QUnit));
});
