(function(exports) {

  // Check if the build was correct
  if (!exports.__require) {
    throw new Error("Corrupt require-sl build");
  }

  // Fetch event handler
  var ev = exports.__require.emit;

  // Browser structure
  exports.define          = exports.__require.define;
  exports.define.amd      = true;
  exports.require         = exports.__require.require;
  exports.require.on      = ev.on;
  exports.require.emit    = ev;
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
