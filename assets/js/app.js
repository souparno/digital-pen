$(document).ready(function () {
  var recording = null;

  var onStop = function () {
    recording = Record.get();
    console.log(recording);
  };

  $('#start-record').click(function () {
    Record.start(onStop);
  });

  $('#play-record').click(function () {
    Record.play('canvas1', recording);
  });
});
//var canvas = $('#start-record').get()[0];
//canvas.onclick = function() {
//  canvas.requestPointerLock();
//};
//
//canvas.requestPointerLock = canvas.requestPointerLock ||
//  canvas.mozRequestPointerLock ||
//  canvas.webkitRequestPointerLock;
//
//// Hook pointer lock state change events for different browsers
//document.addEventListener('pointerlockchange', lockChangeAlert, false);
//document.addEventListener('mozpointerlockchange', lockChangeAlert, false);
//document.addEventListener('webkitpointerlockchange', lockChangeAlert, false);
//
//function lockChangeAlert() {
//  if (document.pointerLockElement === canvas ||
//    document.mozPointerLockElement === canvas ||
//    document.webkitPointerLockElement === canvas) {
//
//    console.log('The pointer lock status is now locked');
//    document.addEventListener("mousemove", canvasLoop, false);
//     //$(document).bind('mousemove', canvasLoop);
//  } else {
//    console.log('The pointer lock status is now unlocked');
//    //document.removeEventListener("mousemove", canvasLoop, false);
//    $(document).unbind('mousemove');
//  }
//}
//
//
//var tracker = document.querySelector('#tracker'), x =0, y= 0;
//function canvasLoop(e) {
//  console.log('I am here');
//  var movementX = e.originalEvent.movementX ||
//          e.originalEvent.mozMovementX ||
//          e.originalEvent.webkitMovementX ||
//          0;
//
//  var movementY = e.movementY ||
//          e.mozMovementY ||
//          e.webkitMovementY ||
//          0;
//  x += movementX;
//  y += movementY; 
//  tracker.innerHTML = "X position: " + x + ', Y position: ' + y;
//}