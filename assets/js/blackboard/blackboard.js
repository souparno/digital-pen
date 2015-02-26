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
      console.log('moved to x', x,'y',y);
      _context.beginPath();
      _context.moveTo(x, y);
    },
    draw: function (x, y) {
      console.log('draw to x', x,'y',y);
      _context.lineTo(x, y);
      _context.stroke();
    }
  });
}());

var Board = (function () {
  var height, width, canvas, _context, pen;

  return Class.Create({
    init: function (elm) {
      canvas = $('#' + elm).get(0);
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
            pen.moveTo(x, y, _context);
            break;
          case 1:
            pen.draw(x, y, _context);
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
      if (_mouseDown && isRecording) {
        Queue.push(x, y, type);
      }
    },
    cleanMouseEvents = function () {
      $(document).unbind('mousedown');
      $(document).unbind('mousemove');
      $(document).unbind('mouseup');
    },
    _mouseDown = false,
    isRecording = false;
  return {
    start: function (onStop) {
      var pointer = new Pointer($(document.body));

      pointer.lock(function () {
        isRecording = true;
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
      isRecording = false;
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
  var lockToggle = function () {
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
  isPointerLockSupported =
    'pointerLockElement' in document ||
    'msPointerLockElement' in document ||
    'mozPointerLockElement' in document ||
    'webkitPointerLockElement' in document,
  element = null, onEnter = null, onExit = null;

  return Class.Create({
    init: function (elm) {
      element = $(elm)[0];
      element.requestPointerLock =
        element.requestPointerLock ||
        element.msRequestPointerLock ||
        element.mozRequestPointerLock ||
        element.webkitRequestPointerLock;
    },
    lock: function (_onEnter, _onExit) {
      if (!isPointerLockSupported) {
        return false;
      }
      onEnter = _onEnter;
      onExit = _onExit;
      element.requestPointerLock();
      $(document).unbind('pointerlockchange');
      $(document).unbind('mspointerlockchange');
      $(document).unbind('mozpointerlockchange');
      $(document).unbind('webkitpointerlockchange');

      $(document).bind('pointerlockchange', lockToggle);
      $(document).bind('mspointerlockchange', lockToggle);
      $(document).bind('mozpointerlockchange', lockToggle);
      $(document).bind('webkitpointerlockchange', lockToggle);
      return true;
    }
  });
}());
