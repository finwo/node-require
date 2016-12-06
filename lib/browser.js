(function(exports) {

  // Check if the build was correct
  if (!exports.__require) {
    throw new Error("Corrupt require-sl build");
  }

  // Browser structure
  exports.require      = exports.__require.require;
  exports.require.on   = exports.__require.on;
  exports.require.emit = exports.__require.emit;
  exports.define       = exports.__require.define;
  exports.baseUri      = '/js/';
  exports.known        = {};

  // Make Require.js & Almond.js modules work
  exports.require.amd = true;

  // Register loader for this platform
  exports.require.on('load-module', function(name) {
    var scriptElement = document.createElement('script');
    scriptElement.id  = 'require-sl-' + name;
    scriptElement.src = exports.known[name] || ( exports.baseUri + name + 'js' ) ;
    document.body.appendChild(scriptElement);
    return false;
  });

})(function() {
  // Core library should be contained inside this
  if (typeof window !== 'undefined') return window;
  if (typeof module !== 'undefined') return module.exports;
  return this;
});
