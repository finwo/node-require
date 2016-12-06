var fs   = require('fs'),
    path = require('path');

// Pre-construct directories
var distFolder = path.join(__dirname, 'dist'),
    libFolder  = path.join(__dirname, 'lib');

// What to build & where to place it
var rules = [
  {
    target: path.join(distFolder, 'core.js'),
    source: path.join(libFolder, 'core.js')
  },
  { // Browser
    target: path.join(distFolder, 'require.js'),
    source: [
      path.join(libFolder, 'core.js'),
      path.join(libFolder, 'browser.js')
    ]
  },
  { // Node
    target: path.join(distFolder, 'node.js'),
    source: path.join(libFolder, 'node.js')
  }
];

// Make sure we're building a clean version
rules.forEach(function(rule) {
  try { fs.unlinkSync(rule.target); } catch(e) {}
});
try { fs.rmdirSync(distFolder); } catch(e) {}
try { fs.mkdirSync(distFolder); } catch(e) {}

// Loop through build rules
(function processRule() {
  var rule = rules.shift();
  if(!rule) return;

  var sources = rule.source.forEach && rule.source || [rule.source];
  var target  = fs.createWriteStream(rule.target, {
    autoClose: false
  });

  target.on('close', processRule);

  (function concatFile() {
    var source = sources.shift();
    if(!source) {
      target.close();
      return;
    }

    fs.readFile(source, function(err, data) {
      target.write(data);
      concatFile();
    });
  })();

})();
