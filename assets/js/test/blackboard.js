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
//      var lastTimeSlot = null;
//
//      lastTimeSlot = (new Date()).getTime();
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
    var obj = null;

    this.cntxt = {
      beginPath: function () {}
    };
    obj = {
      get: function () {
        return {
          getContext: function () {
            return this.cntxt;
          }.bind(this)
        }; 
      }.bind(this),
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
QUnit.asyncTest('play', function (assert) {
  var bound = {
      minX : -4,
      maxX: 196,
      minY: -2,
      maxY: 98
    },
    queue = [
      {x:-4, y:-2, type:0, interval:0},
      {x:90, y:40, type:0, interval:1}
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

  this.cntxt.moveTo = function (x, y) {
    var point = check_against.shift();

    assert.equal(x, point.x);
    assert.equal(y, point.y);
    if(!check_against.length) {
      QUnit.start();
    }
  };
  Record.play(true, {
    bound: bound,
    queue: queue
  });
});
