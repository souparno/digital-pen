$(document).ready(function () {

  var record = new Record();

//  $('#enable-audio').click(function () {
//    $.voice.record(function () {  });
//  });
  $('#start-record').click(function () {
    record.start();
  });

  $('#save-board').click(function () {
    var formData = new FormData();
      formData.append('blob', 'ddd');
      formData.append('chalkmarks', JSON.stringify(record.get()));
      formData.append('title', $("#title").val());
      formData.append('description', $("#description").val());

      Ajax.request('/ajaxifyCreate', {
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST'                      
      });
  });
});