(function(exports) {

  // Fetch event handler
  var ev = exports.emit;

  // Browser structure
  exports.define.amd      = true;
  exports.require.amd     = true;
  exports.require.baseUri = '/js/';

  // List of urls 
  var known = {};

  // Allow registering paths
  exports.require.register = function( list ) {
    Object.keys(list).forEach(function (key) {
      known[key] = list[key];
    });
  };

  // Register loader for this platform
  ev.on('load-module', function(name) {
    var scriptElement = document.createElement('script');
    scriptElement.id  = 'require-sl-' + name;
    scriptElement.src = known[name] || ( exports.require.baseUri + name + '.js' ) ;
    document.body.appendChild(scriptElement);
    return false;
  });

})(typeof exports === 'object' ? exports : this);
