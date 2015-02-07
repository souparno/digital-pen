var Point = Class.Create({
  init: function (x, y) {
    this.x = x;
    this.y = y;
  }
});

var Action = Point.Extend({
  init: function (coordinate, interval) {
    this._super(coordinate.x, coordinate.y);
    this.interval = interval;
  }
});

var Record = Class.Create({
  init: function () {
    this._Record = false;
    this.actionList = [];    
    this.lastTimeSlot = null;
  },
  start: function () {
    this.lastTimeSlot = (new Date()).getTime();
    this._Record = true;
  },
  stop: function () {
    this._Record = false;
  },
  add: function (coordinate) {
    var presentTime = (new Date()).getTime(),
      interval, action;

    if (this._Record) {
      interval = presentTime - this.lastTimeSlot;
      this.lastTimeSlot = presentTime;
      action = new Action(coordinate, interval);
      this.actionList.push(action);
    }
  },
  play: function (fn) {
    var actionList = this.actionList,
      actionList_length = actionList.length,
      loop = function (i) {
        var pos = actionList_length - i,
          action = actionList[pos],
          x = action.x,
          y = action.y,
          interval = action.interval;

        setTimeout(function () {
          fn(x, y);
          if (--i) {
            loop.call(this, i , interval);
          }
        }.bind(this), interval);
      };

    if(!this._Record && this.actionList.length){
      loop(actionList_length);
    }
  }
});

var Paint = Class.Create({
  init: function () {

  },
  draw: function () {
    
  }
});

