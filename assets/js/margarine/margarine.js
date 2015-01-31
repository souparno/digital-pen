var Ajax = (function () {
  'use strict';

  return {

    lastContext: undefined,

    request: function (url, settings) {
      settings = settings || {};

      settings = $.extend({
        async: true,
        cache: false,
        dataType: 'json',
        type: 'GET',
        context: {},
        success: function (data) {
          Ajax.response.call(settings.context, data);
        }
      }, settings);
      $.ajax(url, settings);
    },

    response: function (data) {
      Ajax.lastContext = this;
      data = data || {};      
      
      if (!data.scripts) {
        return;
      }

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
