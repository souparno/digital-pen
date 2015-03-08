var doc = document;

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
    forEachpop: function (fn, stackEmpty) {
      var iterate = function (i) {
        var action = temp_array.shift(),
          x = action.x,
          y = action.y,
          type = action.type,
          interval = action.interval;

        setTimeout(function () {
          if (typeof fn === 'function') {
            fn(x, y, type);
          }
          if (--i) {
            iterate(i);
          } else if (typeof stackEmpty === 'function'){
            stackEmpty();
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

Pen = (function () {
  var cntxt = null;

  return Class.Create({
    setContext: function (CNTXT) {
      cntxt = CNTXT;
    },
    moveTo: function (x, y) {
      cntxt.beginPath();
      cntxt.moveTo(x, y);
    },
    lineTo: function (x, y) {
      cntxt.lineTo(x, y);
      cntxt.lineWidth = 2;
      cntxt.strokeStyle = 'black';
      cntxt.stroke();
    }
  });
}());

var Board = (function () {
  var canvas = null,
    cntxt = null,
    height = 0,
    width = 0,
    pen;

  return Class.Create({
    init: function () {
      pen = new Pen();
      this.pen = pen;
    },
    set: function (elm, ratio) {
      if (elm) {
        canvas = $(elm).get(0);
        cntxt = canvas.getContext('2d');
        width = $(canvas).width();
        height = ratio * width;
        $(canvas).attr('height', height);
        pen.setContext(cntxt);
      }
    },
    getHeight: function () {
      return height;
    },
    getWidth: function () {
      return width;
    },
    clear: function () {
      cntxt.fillStyle = 'rgb(255,255,255)';
      cntxt.fillRect(0, 0, width, height);
    }
  });
}());

var Boundary = (function () {
  var minX = 0,
    maxX = 0,
    minY = 0,
    maxY = 0;

  return Class.Create({
    get: function () {
      return {
        minX: minX,
        maxX: maxX,
        minY: minY,
        maxY: maxY
      };
    },
    getHeight: function () {
      return (maxY - minY);
    },
    getWidth: function () {
      return (maxX - minX);
    },
    getMinX: function () {
      return minX;
    },
    getMaxX: function () {
      return maxX;
    },
    getMinY: function () {
      return minY;
    },
    getMaxY: function () {
      return maxY;
    },
    set: function (obj) {
      if (obj) {
        minX = obj.minX;
        maxX = obj.maxX;
        minY = obj.minY;
        maxY = obj.maxY;
      }
    },
    setMinX: function (x) {
      if (x < minX) {
        minX = x;
      }
    },
    setMaxX: function (x) {
      if (x > maxX) {
        maxX = x;
      }
    },
    setMinY: function (y) {
      if (y < minY) {
        minY = y;
      }
    },
    setMaxY: function (y) {
      if (y > maxY) {
        maxY = y;
      }
    }
  });
}());

var Record = (function () {
  var addEvents =
    function () {
      var getCoordinate =
        (function (X, Y) {
          var x = X, y = Y;

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
        }(0, 0)),
        mouseDown = function (e) {
          var pos = getCoordinate(e),
            x = pos.x,
            y = pos.y;

          mousedown = true;
          if (canRecord) {
            queue.push(x, y, 0);
            boundary.setMinX(x);
            boundary.setMaxX(x);
            boundary.setMinY(y);
            boundary.setMaxY(y);
          }
          return false;
        },
        mouseMove = function (e) {
          var pos = getCoordinate(e),
            x = pos.x,
            y = pos.y;

          if (mousedown && canRecord) {
            queue.push(x, y, 1);
            boundary.setMinX(x);
            boundary.setMaxX(x);
            boundary.setMinY(y);
            boundary.setMaxY(y);
          }
          return false;
        },
        mouseUp = function (e) {
          getCoordinate(e);
          mousedown = false;
          return false;
        },
        mousedown = false;

      doc.removeEventListener("mousedown", mouseDown, false);
      doc.removeEventListener("mousemove", mouseMove, false);
      doc.removeEventListener("mouseup", mouseUp, false);
      doc.addEventListener("mousedown", mouseDown, false);
      doc.addEventListener("mousemove", mouseMove, false);
      doc.addEventListener("mouseup", mouseUp, false);
    },
    normalise = function (X, Y) {
      var 
        ratioX = board.getWidth() / boundary.getWidth(),
        ratioY = board.getHeight() / boundary.getHeight(),
        boundaryMinX = boundary.getMinX(),
        boundaryMinY = boundary.getMinY(),
        x =
        (
          (
            X + (boundaryMinX < 0 ? (-1 * boundaryMinX) : 0)
          ) * ratioX
        ),
        y =
        (
          (
            Y + (boundaryMinY < 0 ? (-1 * boundaryMinY) : 0)
          ) * ratioY
        );

      return {
        x: x,
        y: y
      };
    },
    canRecord = false,
    queue = null,
    board = null,
    boundary = null;

  return Class.Create({
    init: function () {
      queue = new Queue();
      boundary = new Boundary();
      board = new Board();
    },
    start: function (onStart, onStop) {
      PointerLock.requestLock(
        $(doc.body),
        function () {
          canRecord = true;
          queue.reset();
          addEvents();
          if (typeof onStart === 'function') {
            onStart();
          }
        },
        this.stop.bind(this, onStop)
        );
    },
    stop: function (onStop) {
      canRecord = false;
      if (typeof onStop === 'function') {
        onStop();
      }
    },
    play: function (canvas_elm, recording, playComplete) {
      boundary.set(recording.boundary);
      board.set(canvas_elm, boundary.getHeight() / boundary.getWidth());      
      queue.set(recording.queue);
      queue.forEachpop(
        function (x, y, type) {
          var pos = normalise(x, y);

          switch (type) {
            case 0:            
              board.pen.moveTo(pos.x, pos.y);
              break;
            case 1:
              board.pen.lineTo(pos.x, pos.y);
              break;
          }
        }.bind(this),
        function () {
          if (typeof playComplete === 'function') {
            playComplete();
          }        
        }.bind(this)
      );
    },
    get: function () {
      return {
        boundary: boundary.get(),
        queue: queue.get()
      };
    },
    clear: function () {
      queue.clear();
      board.clear();
    }
  });
}());
