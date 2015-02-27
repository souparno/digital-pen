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
        context: {},
        success: function (data) {
          self.response.call(settings, data);
        }
      }, settings);
      $.ajax(url, settings);
    },

    response: function (data) {
      var context = this.context,
        scripts = data.scripts,
        key;

      for (key in scripts) {
        try {
          eval(scripts[key]);
        } catch (ex) {
          console.log(ex);
        }
      }
    }
  };
}());
