var PointerLock = (function () {
  var pointerlockchange =
    function (onEnter, onExit) {
      if ((document.pointerLockElement === element ||
        document.msPointerLockElement === element ||
        document.mozPointerLockElement === element ||
        document.webkitPointerLockElement === element) &&
        (typeof onEnter === 'function')) {
        onEnter();
      } else if (typeof onExit === 'function') {
        cleanEvents();
        onExit();
      }
    },
    pointerlockerror = function (onError) {
      if(typeof onError === 'function') {
        onError();
      }
    },
    isPointerLockSupported = function () {
      var lockSupport = 
        'pointerLockElement' in document ||
        'msPointerLockElement' in document ||
        'mozPointerLockElement' in document ||
        'webkitPointerLockElement' in document;
      return lockSupport;
    },
    addEvents = function (onEnter, onExit, onError) {
      document.addEventListener('pointerlockchange',
        pointerlockchange.bind(undefined, onEnter, onExit), false);
      document.addEventListener('mspointerlockchange',
        pointerlockchange.bind(undefined, onEnter, onExit), false);
      document.addEventListener('mozpointerlockchange',
        pointerlockchange.bind(undefined, onEnter, onExit), false);
      document.addEventListener('webkitpointerlockchange',
        pointerlockchange.bind(undefined, onEnter, onExit), false);
      document.addEventListener('pointerlockerror',
        pointerlockerror.bind(undefined, onError), false);
      document.addEventListener('mspointerlockerror',
        pointerlockerror.bind(undefined, onError), false);
      document.addEventListener('mozpointerlockerror',
        pointerlockerror.bind(undefined, onError), false);
      document.addEventListener('webkitpointerlockerror',
        pointerlockerror.bind(undefined, onError), false);
    },
    cleanEvents = function () {
      document.removeEventListener('pointerlockchange',
        pointerlockchange, false);
      document.removeEventListener('mspointerlockchange',
        pointerlockchange, false);
      document.removeEventListener('mozpointerlockchange',
        pointerlockchange, false);
      document.removeEventListener('webkitpointerlockchange',
        pointerlockchange, false);
      document.removeEventListener('pointerlockerror',
        pointerlockerror, false);
      document.removeEventListener('mspointerlockerror',
        pointerlockerror, false);
      document.removeEventListener('mozpointerlockerror',
        pointerlockerror, false);
      document.removeEventListener('webkitpointerlockerror',
        pointerlockerror, false);
    },
    element = null;

  return {
    requestLock: function (elm, onEnter, onExit, onError) {
      if (!isPointerLockSupported()) {
        return false;
      }
      addEvents(onEnter, onExit, onError);
      element = $(elm)[0];
      element.requestPointerLock =
        element.requestPointerLock ||
        element.msRequestPointerLock ||
        element.mozRequestPointerLock ||
        element.webkitRequestPointerLock;
      element.requestPointerLock();
      return true;
    },
    exitLock: function () {
      if (!isPointerLockSupported()) {
        return false;
      }
      element.exitPointerLock =
        element.exitPointerLock ||
        element.msExitPointerLock ||
        element.mozExitPointerLock ||
        element.webkitExitPointerLock;
      element.exitPointerLock();
      return true;
    }
  };
}());
