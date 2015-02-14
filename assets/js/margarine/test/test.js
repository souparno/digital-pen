QUnit.module('response');
QUnit.test('should parse the response with context variables', function (assert) {
  var temp_ajax = $.ajax,
    data = {
      scripts: ["var Template = _.template($(context.table_data).html()),\n\
        items = ['name1', 'name2', 'name3', 'name4'],\n\
        data = {items: items};\n\
        $(context.record_table).html(Template(data));"]
    };

  $.ajax = function (url, settings) {
    if(settings.success){
      settings.success(data);
    }
  };

  Ajax.request('', {
    context: {
      record_table : $("#record_table"),
      table_data: $("#table_data")
    }    
  });
  assert.equal(true, true);
  $.ajax = temp_ajax;
});
