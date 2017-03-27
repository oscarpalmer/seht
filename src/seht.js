(function(name, context, definition){
  if (typeof module !== "undefined" && module.exports) {
    module.exports = definition();
  } else if (typeof define === "function" && define.amd) {
    define(definition);
  } else {
    context[name] = definition();

    if (typeof context['$'] === 'undefined') {
      context['$'] = definition();
    }
  }
})('seht', this, function(){
  var
  win = window,
  doc = win.document;

  function seht(selector, context) {
    return (context || doc).querySelectorAll(selector);
  }

  return seht;
));