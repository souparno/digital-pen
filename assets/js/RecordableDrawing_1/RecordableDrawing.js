var Point = Class.Create({
  init: function (x, y) {
    this.x = x;
    this.y = y;
  }
});

var Action = Point.Extend({
  init: function (coordinate, timeSlot) {
    this._super(coordinate.x, coordinate.y);
    this.timeSlot = timeSlot;
    this.next = null;
  }
});

var Recording = Class.Create({
  init: function () {
    this.head = null;
    this.tail = null;    
  },

  input: function (coordinate) {
    var timeSlot = (new Date()).getTime();
    
    if(!this.head){
      this.head = new Action(coordinate, timeSlot);
      this.tail = this.head;
      return;
    }
    
    this.tail.next = new Action(coordinate, timeSlot);
    this.tail = this.tail.next;
  },

  serialise: function () {
    return JSON.stringify(this.head);
  }
});

