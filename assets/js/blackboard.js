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

  return Class.Create({
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
  });
}());

var Board = (function () {
  var canvas = null,
    cntxt = null,
    height = 0,
    width = 0,
    minX = 0,
    maxX = 0,
    minY = 0,
    maxY = 0,
    Pen = (function () {
      var getCoordinate = function (X, Y) {
        var ratioX = width / (maxX - minX),
          ratioY = height / (maxY - minY),
          x = ((X + (minX < 0 ? (-1 * minX) : 0))* ratioX),
          y = ((Y + (minY < 0 ? (-1 * minY) : 0)) * ratioY);

        return {
          x: x,
          y: y
        };
      };

      return Class.Create({
        moveTo: function (x, y) {
          var pos = getCoordinate(x, y);

          cntxt.beginPath();
          cntxt.moveTo(pos.x, pos.y);
        },
        lineTo: function (x, y) {
          var pos = getCoordinate(x, y);

          cntxt.lineTo(pos.x, pos.y);
          cntxt.lineWidth = 2;
          cntxt.strokeStyle = 'black';
          cntxt.stroke();
        }
      });
  }());

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
        $(canvas).attr('height', height);
        this.pen = new Pen();
      }      
    },
    resetBoundary: function (x, y) {
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
    get: function () {
      return {
        minX: minX,
        maxX: maxX,
        minY: minY,
        maxY: maxY
      };
    },
    clear: function () {
      cntxt.fillStyle = 'rgb(255,255,255)';
      cntxt.fillRect(0, 0, width, height);
    }
  });
}());

var Record = (function () {
  var getMovement =
    (function () {
      var x =0, y=0;

      return function (e) {
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
        return {
          x: x,
          y: y
        };
      };
    }()),
    mouseDown = function (e) {
      var movement = getMovement(e),
        x = movement.x,
        y = movement.y;

      mousedown = true;
      queue.push(x, y, 0);
      board.resetBoundary(x, y);
      return false;
    },
    mouseMove = function (e) {
      var movement= null,
        x = 0,
        y = 0;

      if (mousedown) {
        movement = getMovement(e);
        x = movement.x;
        y = movement.y;

        queue.push(x, y, 1);
        board.resetBoundary(x, y);
      }
      return false;
    },
    mouseUp = function () {
      mousedown = false;
      return false;
    },
    addMouseEvents = function () {
      document.addEventListener("mousedown", mouseDown, false);
      document.addEventListener("mousemove", mouseMove, false);
      document.addEventListener("mouseup", mouseUp, false);    
    },
    cleanMouseEvents = function () {
      document.removeEventListener("mousedown", mouseDown, false);
      document.removeEventListener("mousemove", mouseMove, false);
      document.removeEventListener("mouseup", mouseUp, false);
    },
    mousedown = false,
    queue = null,
    board = null;

  return {
    start: function () {
      PointerLock.requestLock($(document.body),
        function () {
          queue = new Queue();
          board = new Board();
          queue.reset();
          cleanMouseEvents();
          addMouseEvents();
        });
    },
    stop: function (onStop) {
      cleanMouseEvents();
      onStop();
    },
    play: function (canvas_elm, recording) {
      queue = new Queue();
      board = new Board(canvas_elm, recording.bound);
      queue.set(recording.queue);
      queue.forEachpop(function (x, y, type) {
        switch (type) {
          case 0:
            board.pen.moveTo(x, y);
            break;
          case 1:
            board.pen.lineTo(x, y);
            break;
        }
      }.bind(this));
    },
    get: function () {
      return {
        bound: board.get(),
        queue: queue.get()
      };
    },
    clear: function () {
      queue.clear();
      board.clear();
    }
  };
}());
