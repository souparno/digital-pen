$(document).ready(function () {

  var record = new Record();

  $('#enable-audio').click(function () {
    $.voice.record(function () {  });
  });
  $('#start-record').click(function () {
    record.start();
  });

  $('#save-board').click(function () {
    $.voice.export(function (blob) {
      var formData = new FormData();
      formData.append('blob', blob);
      formData.append('chalkmarks', JSON.stringify(record.get()));
      formData.append('title', $("#title").val());
      formData.append('description', $("#description").val());

      Ajax.request('/ajaxifyCreate', {
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST'                      
      });
    }, 'blob');
  });
});