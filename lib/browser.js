(function(exports) {

  // Check if the build was correct
  if (!exports.__require) {
    throw new Error("Corrupt require-sl build");
  }

  // Browser structure
  exports.define          = exports.__require.define;
  exports.require         = exports.__require.require;
  exports.require.on      = exports.__require.on;
  exports.require.emit    = exports.__require.emit;
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

  // Make Require.js & Almond.js modules work

  // Register loader for this platform
  exports.require.on('load-module', function(name) {
    var scriptElement = document.createElement('script');
    scriptElement.id  = 'require-sl-' + name;
    scriptElement.src = known[name] || ( exports.baseUri + name + '.js' ) ;
    document.body.appendChild(scriptElement);
    return false;
  });

})(typeof exports === 'object' ? exports : this);
