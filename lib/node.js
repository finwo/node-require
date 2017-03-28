
// Load the core library
module.exports = require('./core');

// Register loader for this platform
module.exports.on('load-module', function(name) {
  module.exports.define(name, function() {
    return require(name);
  });
  return false;
});
