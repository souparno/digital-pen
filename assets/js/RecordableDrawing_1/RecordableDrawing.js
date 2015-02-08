var Point = Class.Create({
  init: function (x, y) {
    this.x = x;
    this.y = y;
  }
});

var Action = Point.Extend({
  init: function (x, y, mouseMove, interval) {
    this._super(x, y);
    this.mouseMove = mouseMove,
    this.interval = interval;
  }
});

var Queue = (function () {
 var actionList = [],
    lastTimeSlot = null;

  return  Class.Create({
    push: function (params) {
      var presentTime = (new Date()).getTime(),
        interval, action;

        interval = presentTime - lastTimeSlot;
        lastTimeSlot = presentTime;
        action = new Action(params.x, params.y, params.mouseMove, interval);
        actionList.push(action);
    },

    forEachpop: function (fn) {
      var iterate = function (i) {
        var action = temp_actionList.shift(),
          x = action.x,
          y = action.y,
          mouseMove = action.mouseMove,
          interval = action.interval;

        setTimeout(function () {
          fn(x, y, mouseMove);
          if (--i) {
            iterate(i);
          }
        }, interval);},
        temp_actionList;

      temp_actionList = actionList.slice();
      iterate(temp_actionList.length);
    },

    getActionList: function () {
      return actionList;
    },

    setActionList: function (actionArgs) {
      actionList = actionArgs;
    }
  });
}());

var Pen = (function () {
  var getCoordinate = function (event) {
    var canvasX = Board.canvas.offset().left,
      canvasY = Board.canvas.offset().top,
      x = Math.floor(event.pageX - canvasX),
      y = Math.floor(event.pageY - canvasY);
      
    return {
      x: x,
      y: y
    };},
    _mouseDown = false;

  return Class.Create({
    init: function (settings) {
      this.settings = $.extend({
        strokeStyle: "#000000",
        lineWidth: 1
      }, settings);
    },
    mouseDown: function (event) {
      var coordinate = getCoordinate(event);
      
      _mouseDown = true;
      return {
        x: coordinate.x,
        y: coordinate.y,
        mouseMove: false
      };      
    },
    mouseMove: function (event) {
      var coordinate = null;

      if(_mouseDown){
        coordinate = getCoordinate(event);
        
        return {
          x: coordinate.x,
          y: coordinate.y,
          mouseMove: true
        };
      }
      return false;
    },
    mouseUp: function () {
      _mouseDown = false;
      return false;
    }
  });
}());

var Board = (function (){
  var _boardSettings = {        
    fillStyle: "#000000",
    font: "10px sans-serif" },
    queue = new Queue(); 
    _record = false,
  context, pen;

  return {
    canvas: null,
    initialise: function (elm, settings) {
      settings = settings || {};

      this.canvas = document.getElementById(elm);
      this.canvas.bind("mousedown", this.mouseDown);
      this.canvas.bind("mousemove", this.mouseMove);
      this.canvas.bind("mouseup", this.mouseUp);
    
      pen = new Pen(settings);
      context = this.canvas.getContext('2d');
      context = $.extend(context, _boardSettings, pen.settings);
    },
    mouseDown: function (e) {
      var params;

      e.preventDefault();
      params = pen.mouseDown(e);
      if(_record && params){
        queue.push(params);
      }      
      return false;
    },
    mouseMove: function (e) {
      var params;

      e.preventDefault();
      params = pen.mouseMove(e);
      if(_record && params){
        queue.push(params);
      }
      return false;
    },
    mouseUp: function (e) {
      e.preventDefault();
      pen.mouseUp(e);
      return false;
    },
    startRecording: function () {
      _record = true;
    },
    stopRecording: function () {
      _record = false;
      return queue.getActionList;
    },
    playRecording: function (actionList) {
      queue.setActionList = actionList;
      queue.forEachpop(function(x, y, mouseEvent) {
        switch(mouseEvent) {
          case 'mouseDown':
            pen.mouseDown({});
            break;
          case 'mouseMove':
            pen.mouseMove({});
            break;
          case 'mouseUp':
            pen.mouseUp({});
            break;
        };
      }.bind(this));
    }
  };
}());

