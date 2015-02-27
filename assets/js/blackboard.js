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
    set: function (actionArgs) {
      array = actionArgs;
    },
    clear: function () {
      array = [];
    }
  };
}());

var Pen = (function () {
  var _context = null;

  return Class.Create({
    init: function (cntxt) {
      _context = cntxt;
    },
    moveTo: function (x, y) {
      _context.beginPath();
      _context.moveTo(x, y);
    },
    draw: function (x, y) {
      _context.lineTo(x, y);
      _context.stroke();
    }
  });
}());

var Board = (function () {
  var height, width, _context, pen;

  return Class.Create({
    init: function (elm) {
      var canvas = $('#' + elm).get(0);

      _context = canvas.getContext('2d');
      height = $(canvas).height();
      width = $(canvas).width();
      pen = new Pen(_context);
    },
    /*
     * @param (object) params :
     * {
     *   board: {
     *     width: --
     *     height: --
     *   },
     *   actions: [array]
     * }
     */
    playRecording: function (params) {
      var ratioX = width / params.board.width,
        ratioY = height / params.board.height;

      Queue.set(params.actions);
      Queue.forEachpop(function (_x, _y, type) {
        var x = _x * ratioX,
          y = _y * ratioY;

        switch (type) {
          case 0:
            pen.moveTo(x, y);
            break;
          case 1:
            pen.draw(x, y);
            break;
        }
      }.bind(this));
    },
    clear: function () {
      _context.fillStyle = 'rgb(255,255,255)';
      _context.fillRect(0, 0, width, height);
    }
  });
}());

var Record = (function () {
  var x = 0, y = 0, maxX = 0, maxY = 0,
    getMovement = function (e) {
      var movementX = e.originalEvent.movementX ||
        e.originalEvent.mozMovementX ||
        e.originalEvent.webkitMovementX ||
        0,
        movementY = e.originalEvent.movementY ||
        e.originalEvent.mozMovementY ||
        e.originalEvent.webkitMovementY ||
        0;

      x += movementX;
      y += movementY;
      if (x > maxX) {
        maxX = x;
      }
      if (y > maxY) {
        maxY = y;
      }
      return {
        x: x,
        y: y
      };
    },
    mouseDown = function (e) {
      var move = getMovement(e);

      _mouseDown = true;
      pushToQueue(move.x, move.y, 0);
      return false;
    },
    mouseMove = function (e) {
      var move = getMovement(e);

      pushToQueue(move.x, move.y, 1);
      return false;
    },
    mouseUp = function () {
      _mouseDown = false;
      return false;
    },
    pushToQueue = function (x, y, type) {
      if (_mouseDown && _isRecording) {
        Queue.push(x, y, type);
      }
    },
    cleanMouseEvents = function () {
      $(document).unbind('mousedown');
      $(document).unbind('mousemove');
      $(document).unbind('mouseup');
    },
    _mouseDown = false,
    _isRecording = false;
  return {
    start: function (onStop, elm) {
      //This part of the code is to be removed later
      var canvas = $('#' + elm).get(0);
      var _context = canvas.getContext('2d');
      var pen = new Pen(_context);
      //End of the dummy code
      var pointer = new Pointer($(document.body));

      pointer.lock(function () {
        _isRecording = true;
        cleanMouseEvents();
        $(document).bind('mousedown', mouseDown);
        $(document).bind('mousemove', mouseMove);
        $(document).bind('mouseup', mouseUp);
        Queue.reset();
      }, function () {
        this.stop(onStop);
      }.bind(this));
    },
    stop: function (callback) {
      cleanMouseEvents();
      _isRecording = false;
      callback();
    },
    /* @param (string) canvas_elm
     * @param (object) recording :
     * {
     *   board: {
     *     width: --
     *     height: --
     *   },
     *   actions: [array]
     * }
     */
    play: function (canvas_elm, recording) {
      var board = new Board(canvas_elm);

      board.playRecording(recording);
    },
    get: function () {
      return {
        board: {
          width: maxX,
          height: maxY
        },
        actions: Queue.get()
      };
    },
    clear: function () {
      Queue.clear();
    }
  };
}());

var Pointer = (function () {
  var lockToggle = function (onEnter, onExit) {
    if ((document.pointerLockElement === element ||
      document.msPointerLockElement === element ||
      document.mozPointerLockElement === element ||
      document.webkitPointerLockElement === element) &&
      (typeof onEnter === 'function')) {
      onEnter();
    } else if (typeof onExit === 'function') {
      onExit();
    }},
    isPointerLockSupported = function () {
      var lockSupport = 'pointerLockElement' in document ||
      'msPointerLockElement' in document ||
      'mozPointerLockElement' in document ||
      'webkitPointerLockElement' in document;
    
      return lockSupport; },
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
