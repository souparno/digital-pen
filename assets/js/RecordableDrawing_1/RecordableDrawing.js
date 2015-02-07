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

var Record = (function () {

  var lastTimeSlot = null,
    _record = false;
  
  return  Class.Create({
    init: function () {
      this.actionList = [];
    },

    start: function () {
      lastTimeSlot = (new Date()).getTime();
      _record = true;
    },

    stop: function () {
      _record = false;
    },

    push: function (coordinate) {
      var presentTime = (new Date()).getTime(),
        interval, action;

      if (_record) {
        interval = presentTime - lastTimeSlot;
        lastTimeSlot = presentTime;
        action = new Action(coordinate, interval);
        this.actionList.push(action);
      }
    },

    play: function (fn) {
      var iterate = function (i) {
        var action = temp_actionList.shift(),
          x = action.x,
          y = action.y,
          interval = action.interval;

        setTimeout(function () {
          fn(x, y);
          if (--i) {
            iterate(i);
          }
        }, interval);},
        temp_actionList;

      if (!_record && this.actionList.length) {
        temp_actionList = this.actionList.slice();
        iterate(temp_actionList.length);
      }
    }
  });
}());

