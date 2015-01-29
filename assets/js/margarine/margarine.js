(function (window, undefined) {
  'use strict';

  var $ = window.$,
    CIS = window.CIS = window.CIS || {};

  CIS.Ajax = {
    /*
     * Hold the last context that was set by the request.
     * In most case, it will refer to a DOM element that trigger the request.
     * Best use for debugging a response from CIS.Ajax.request function.
     */
    lastContext: undefined,
    /**
     * Perform an Ajax request
     * The response will be handled by CI.Ajax.response function
     * url: the URL to which the request is sent
     * settings: settings for $.ajax() function (optional)
     */
    request: function (url, settings) {
      settings = settings || {};

      settings = $.extend({
        async: true,
        cache: false,
        dataType: 'json',
        type: 'GET',
        context: {},
        success: function (data) {
          CIS.Ajax.response.call(settings.context, data);
        }
      }, settings);
      $.ajax(url, settings);
    },
    /**
     * Handle JSON data responded from CI.Ajax.request function
     * data: JSON data
     *      contains array of scripts to be executed
     */
    response: function (data) {
      data = data || {};
      var context = this;
      CIS.Ajax.lastContext = context;

      if (typeof data.scripts === 'undefined') {
        return;
      }

      // Execute all scripts from the response
      for (var i = 0, length = data.scripts.length; i < length; i++) {
        try {
          eval(data.scripts[i]);
        } catch (ex) {
          console.log(ex);
        }
      }
    }
  };

})(window);