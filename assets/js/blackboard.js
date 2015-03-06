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
          } else {
            fn(undefined, undefined, 2);
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
  var addEvents = 
    function () {
      var getCoordinate =
        (function (X, Y) {
          var x =X, y=Y;

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
          queue.push(x, y, 0);
          board.resetBoundary(x, y);
          return false;
        },
        mouseMove = function (e) {
          var pos = getCoordinate(e),
            x = pos.x,
            y = pos.y;

          if (mousedown) {
            queue.push(x, y, 1);
            board.resetBoundary(x, y);
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
    queue = null,
    board = null;

  return Class.Create({
    start: function () {
      PointerLock.requestLock($(doc.body),
        function () {          
          queue = new Queue();
          board = new Board();
          queue.reset();
          addEvents();
        });
    },
    stop: function (onStop) {
      cleanMouseEvents();
      onStop();
    },
    play: function (canvas_elm, recording, complete) {
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
          case 2:
            complete();
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
  });
}());
