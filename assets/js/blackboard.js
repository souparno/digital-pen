var Point = Class.Create({
  init: function (x, y) {
    this.x = x;
    this.y = y;
  }
});

var Action = Point.Extend({
  init: function (x, y, type, interval) {
    this._super(x, y);
    this.type = type;
    this.interval = interval;
  }
});

var Queue = (function () {
  var array = [],
    lastTimeSlot = null;

  return {
    reset: function () {
      this.clear();
      lastTimeSlot = (new Date()).getTime();
    },
    push: function (x, y, type) {
      var presentTime = (new Date()).getTime(),
        interval, action;

      interval = presentTime - lastTimeSlot;
      lastTimeSlot = presentTime;
      action = new Action(x, y, type, interval);
      array.push(action);
    },
    forEachpop: function (fn) {
      var iterate = function (i) {
        var action = temp_array.shift(),
          x = action.x,
          y = action.y,
          type = action.type,
          interval = action.interval;

        setTimeout(function () {
          fn(x, y, type);
          if (--i) {
            iterate(i);
          }
        }, interval);
      }, temp_array;

      temp_array = array.slice();
      iterate(temp_array.length);
    },
    get: function () {
      return array;
    },
    set: function (_array) {
      array = _array;
    },
    clear: function () {
      array = [];
    }
  };
}());

var Board = (function () {
  var Pen = Class.Create({
    moveTo: function (x, y) {
      if (canvas) {
        cntxt.beginPath();
        cntxt.moveTo(x, y);
      } else {
        Queue.push(x, y, 0);
        resetBounds(x, y);
      }
    },
    lineTo: function (x, y) {
      if (canvas) {
        cntxt.lineTo(x, y);
        cntxt.stroke();
      } else {
        Queue.push(x, y, 1);
        resetBounds(x, y);        
      }
    }}),
    resetBounds = function (x, y) {
      if (x < minX) {
        minX = x;
      } else if (x > maxX) {
        maxX = x;
      }
      if (y < minY) {
        minY = y;
      } else if (y > maxY) {
        maxY = y;
      }
    },
    canvas = null,
    cntxt = null,
    height = 0,
    width = 0,
    minX = 0,
    maxX = 0,
    minY = 0,
    maxY = 0;

  return Class.Create({
    init: function (elm, bound) {
      var ratio = 0;

      if (elm) {
        canvas = $(elm).get(0);
        cntxt = canvas.getContext('2d');
        minX = bound.minX;
        maxX = bound.maxX;
        minY = bound.minY;
        maxY = bound.maxY;
        ratio = (maxY - minY) / (maxX - minX);        
        width = $(canvas).width();
        height = ratio * width;
        $(canvas).height(height);
      }
      Queue.reset();
      this.pen = new Pen();
    },
    playRecording: function (recording) {
      Queue.set(recording);
      Queue.forEachpop(function (X, Y, type) {
        var ratioX = width / (maxX - minX),
          ratioY = height / (maxY - minY),
          x = (X * ratioX) + (minX < 0 ? (-1 * minX * ratioX) : 0),
          y = (Y * ratioY) + (minY < 0 ? (-1 * minY * ratioY) : 0);

        switch (type) {
          case 0:
            this.pen.moveTo(x, y);
            break;
          case 1:
            this.pen.lineTo(x, y);
            break;
        }
      }.bind(this));
    },
    get: function () {
      return {
        bound: {
          minX: minX,
          maxX: maxX,
          minY: minY,
          maxY: maxY
        },
        queue: Queue.get()
      };
    },
    clear: function () {
      cntxt.fillStyle = 'rgb(255,255,255)';
      cntxt.fillRect(0, 0, width, height);
      Queue.clear();
    }
  });
}());

var Record = (function () {
  var getMovement =
    function (e) {
      var movementX = e.movementX ||
        e.mozMovementX ||
        e.webkitMovementX ||
        0,
        movementY = e.movementY ||
        e.mozMovementY ||
        e.webkitMovementY ||
        0;

      x += movementX;
      y += movementY;
    },
    mouseDown = function (e) {
      _mouseDown = true;
      getMovement(e);
      board.pen.moveTo(x, y);
      return false;
    },
    mouseMove = function (e) {
      getMovement(e);
      if (_mouseDown) {
        board.pen.lineTo(x, y);
      }
      return false;
    },
    mouseUp = function () {
      _mouseDown = false;
      return false;
    },
    cleanMouseEvents = function () {
      document.removeEventListener("mousedown", mouseDown, false);
      document.removeEventListener("mousemove", mouseMove, false);
      document.removeEventListener("mouseup", mouseUp, false);
    },
    x = 0,
    y = 0,
    _mouseDown = false,
    board = null;

  return {
    start: function (onStop) {
      var pointer = new Pointer($(document.body));

      pointer.lock(function () {
        board = new Board();
        cleanMouseEvents();
        document.addEventListener("mousedown", mouseDown, false);
        document.addEventListener("mousemove", mouseMove, false);
        document.addEventListener("mouseup", mouseUp, false);        
      }, function () {
        this.stop(onStop);
      }.bind(this));
    },
    stop: function (callback) {
      cleanMouseEvents();
      callback();
    },
    play: function (canvas_elm, recording) {
      board = new Board(canvas_elm, recording.bound);
      board.playRecording(recording.queue);
    },
    get: function () {
      return board.get();
    },
    clear: function () {
      board.clear();
    }
  };
}());

var Pointer = (function () {
  var lockToggle =
    function (onEnter, onExit) {
      if ((document.pointerLockElement === element ||
        document.msPointerLockElement === element ||
        document.mozPointerLockElement === element ||
        document.webkitPointerLockElement === element) &&
        (typeof onEnter === 'function')) {
        onEnter();
      } else if (typeof onExit === 'function') {
        onExit();
      }
    },
    isPointerLockSupported = function () {
      var lockSupport = 'pointerLockElement' in document ||
        'msPointerLockElement' in document ||
        'mozPointerLockElement' in document ||
        'webkitPointerLockElement' in document;
      return lockSupport;
    },
    element = null;

  return Class.Create({
    init: function (elm) {
      element = $(elm)[0];
      element.requestPointerLock =
        element.requestPointerLock ||
        element.msRequestPointerLock ||
        element.mozRequestPointerLock ||
        element.webkitRequestPointerLock;
    },
    lock: function (onEnter, onExit) {
      if (!isPointerLockSupported()) {
        return false;
      }
      element.requestPointerLock();
      $(document).unbind('pointerlockchange');
      $(document).unbind('mspointerlockchange');
      $(document).unbind('mozpointerlockchange');
      $(document).unbind('webkitpointerlockchange');
      $(document).bind('pointerlockchange',
        lockToggle.bind(undefined, onEnter, onExit));
      $(document).bind('mspointerlockchange',
        lockToggle.bind(undefined, onEnter, onExit));
      $(document).bind('mozpointerlockchange',
        lockToggle.bind(undefined, onEnter, onExit));
      $(document).bind('webkitpointerlockchange',
        lockToggle.bind(undefined, onEnter, onExit));
      return true;
    }
  });
}());
