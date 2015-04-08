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

var Pen = (function () {
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

var Canvas = (function () {
  var canvas = null,
    cntxt = null,
    height = 0,
    width = 0,
    pen = null;

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

var MouseEvent =  (function () {
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
    mousedown = false,
    mouseDownEvtAdded = false,  
    mouseDragEvtAdded = false,
    mouseUpEvtAdded = false;

  return Class.Create({
    init: function () {
      mouseDownEvtAdded = false;
      mouseDragEvtAdded = false;
    },
    onMouseDown: function (fn, e) {
      var pos = {}, x =0, y = 0;

      if(!mouseDownEvtAdded) {
        mouseDownEvtAdded = true;
        doc.removeEventListener("mousedown", this.onMouseDown, false);
        doc.addEventListener("mousedown", this.onMouseDown.bind(this, fn), false);
        return false;
      }       
      mousedown = true;
      pos = getCoordinate(e);
      x = pos.x;
      y = pos.y;      
      fn(x, y);
      return false;
    },
    onMouseDrag: function (fn, e) {
      var pos = {}, x =0, y = 0;
      
      if(!mouseDragEvtAdded) {
        mouseDragEvtAdded = true;
        doc.removeEventListener("mousemove", this.onMouseDrag, false);
        doc.addEventListener("mousemove", this.onMouseDrag.bind(this, fn), false);
        return false;
      }
      pos = getCoordinate(e);
      x = pos.x;
      y = pos.y;
      if(mousedown){
        fn(x, y);
      }      
      return false;
    },
    onMouseUp: function (e) {
      if(!mouseUpEvtAdded) {
        mouseDragEvtAdded = true;
        doc.removeEventListener("mouseup", this.onMouseUp, false);
        doc.addEventListener("mouseup", this.onMouseUp.bind(this), false);
        return false;
      }
      mousedown = false;
      getCoordinate(e);
      return false;
    }
  });
}());

var Record = (function () {
  var normalise = function (X, Y) {
      var ratioX = canvas.getWidth() / boundary.getWidth(),
        ratioY = canvas.getHeight() / boundary.getHeight(),
        boundaryMinX = boundary.getMinX(),
        boundaryMinY = boundary.getMinY(),
        x =((X + (boundaryMinX < 0 ? (-1 * boundaryMinX) : 0)) * ratioX),
        y =((Y + (boundaryMinY < 0 ? (-1 * boundaryMinY) : 0)) * ratioY);

      return {
        x: x,
        y: y
      };
    },
    onMouseDown= function (x, y) {
      if (canRecord) {
        queue.push(x, y, 0);
        boundary.setMinX(x);
        boundary.setMaxX(x);
        boundary.setMinY(y);
        boundary.setMaxY(y);
      }
    },
    onMouseDrag = function (x, y) {
      if (canRecord) {
        queue.push(x, y, 1);
        boundary.setMinX(x);
        boundary.setMaxX(x);
        boundary.setMinY(y);
        boundary.setMaxY(y);
      }
    },
    canRecord = false,
    queue = null,
    canvas = null,
    boundary = null,
    mouseevent = null;

  return Class.Create({
    init: function () {
      queue = new Queue();
      boundary = new Boundary();
      canvas = new Canvas();
      mouseevent = new MouseEvent();
    },
    start: function (onStart, onStop) {
      PointerLock.requestLock(
        $(doc.body),
        function () {
          canRecord = true;
          mouseevent.onMouseDown(onMouseDown);
          mouseevent.onMouseDrag(onMouseDrag);
          mouseevent.onMouseUp();
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
      canvas.set(canvas_elm, boundary.getHeight() / boundary.getWidth());      
      queue.set(recording.queue);
      queue.forEachpop(
        function (x, y, type) {
          var pos = normalise(x, y);

          switch (type) {
            case 0:            
              canvas.pen.moveTo(pos.x, pos.y);
              break;
            case 1:
              canvas.pen.lineTo(pos.x, pos.y);
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
      canvas.clear();
    }
  });
}());
