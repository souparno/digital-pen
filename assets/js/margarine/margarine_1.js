var Ajax = (function () {
  'use strict';

  return {

    request: function (url, settings) {
      var self = this;

      settings = settings || {};
      settings = $.extend({
        async: true,
        cache: false,
        dataType: 'json',
        type: 'GET',
        success: function (data) {
          self.response(data);
        }
      }, settings);
      $.ajax(url, settings);
    },

    response: function (data) {
      console.log("===================");
      console.log(data);
      for (var i = 0, length = data.scripts.length; i < length; i++) {
        try {
          eval(data.scripts[i]);
        } catch (ex) {
          console.log(ex);
        }
      }
    }
  };
}());
