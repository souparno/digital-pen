var Point = Class.Create({
  init: function (x, y) {
    this.x = x;
    this.y = y;
  }
});

var Action = Point.Extend({
  init: function (x, y, type, interval) {
    this._super(x, y);
    this.type = type,
    this.interval = interval;
  }
});

var Queue = (function () {
 var array = [],
  lastTimeSlot = null;

  return  Class.Create({
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
        }, interval);},
        temp_array;

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
  });
}());

var Pen = Class.Create({
  moveTo: function (x, y){
    Board.context.beginPath();
    Board.context.moveTo(x, y);
  },

  draw: function (x, y){
    Board.context.lineTo(x,y);
    Board.context.stroke();		
  }
});

var Board = (function (){
  var getCoordinate = function (event) {
    var canvasX = $(canvas).offset().left,
      canvasY = $(canvas).offset().top,
      x = Math.floor(event.pageX - canvasX),
      y = Math.floor(event.pageY - canvasY);

    return {
      x: x,
      y: y
    };},
    mouseDown = function (e) {
      var coordinate;

      e.preventDefault();
      _mouseDown = true;
      coordinate = getCoordinate(e);
      pen.moveTo(coordinate.x, coordinate.y);
      if(_record){
        queue.push(coordinate.x, coordinate.y, 0);
      }   
      return false;},
    mouseMove = function (e) {
      var coordinate;

      e.preventDefault();
      coordinate = getCoordinate(e);
      if(_mouseDown) {
        pen.draw(coordinate.x, coordinate.y);
        if(_record){
          queue.push(coordinate.x, coordinate.y, 1);
        }
      }
      return false;},
    mouseUp = function (e) {
      e.preventDefault();
      _mouseDown = false;
      return false;},
    _mouseDown = false,
    _record = false,
    height, width, queue, canvas, pen;

  return {
    initialise: function (elm) {
      canvas = $("#" + elm).get(0);
      width = $(canvas).width();
		  height = $(canvas).height();
      $(canvas).unbind();
      $(canvas).bind("mousedown", mouseDown);
      $(canvas).bind("mousemove", mouseMove);
      $(canvas).bind("mouseup", mouseUp);
      this.context = canvas.getContext('2d');
      pen = new Pen();
      queue = new Queue();
    },

    startRecording: function () {
      queue.reset();
      _record = true;      
    },

    stopRecording: function () {
      _record = false;
    },
    
    getRecording: function () {
      return queue.get();      
    },
    
    clearRecording: function () {
      queue.clear();
    },
    
    playRecording: function (actionList) {
      if(actionList){
        queue.set(actionList);
      }      
      queue.forEachpop(function(x, y, type) {
        switch(type){
          case 0:
            pen.moveTo(x, y);
            break;
          case 1:
            pen.draw(x, y);
            break;
        }
      }.bind(this));
    },
    
    clearCanvas: function () {
      this.context.fillStyle = "rgb(255,255,255)";
      this.context.fillRect(0, 0, width, height);
    }
  };
}());
