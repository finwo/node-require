(function(exports){
  
  // ---[ events ]---
  var l={},ev=function(n,d){d=d||!0;(l[n]||[]).map(function(c){d=d&&c(d)})};
  ev.on=function(n,c){(l[n]=l[n]||[]).push(c)};
  
  var queue   = [],
      modules = {},
      timeout = setTimeout;
  
  // ---[ helpers ]---
  function ObjectValues( obj ) {
    return Object
      .keys(obj)
      .map(function(key) {
        return obj[key];
      });
  }
  
  // ---[ core ]---
  ev.on('process', function() {
    
    // Fetch next entry
    var entry = queue.shift();
    if(!entry) return;
    
    // Don't redefine a module
    if ( entry.s && modules[entry.s] ) {
      queue.length && timeout(ev.bind(null,'process'), 20);
      return;
    }
    
    // Fetch dependencies
    var ready = true,
        args  = entry.o.map(function(dependency) {
          if ( !ready              ) return;
          if ( modules[dependency] ) return modules[dependency];
          ready = false;
          ev('load-module', dependency);
        });
    
    // Run/register the module if ready
    if ( ready ) {
      entry.s ? modules[entry.s] = entry.f.apply(null, args) : entry.f.apply(null, args);
    }
    
    // Continue processing if there's a queue
    queue.length && timeout(ev.bind(null,'process'), 20);
  });
  
  // ---[ API ]---
  exports.emit    = ev;
  exports.on      = ev.on;
  exports.require = exports.define = function() {
    var entry = { s: null, o: [], f: function(){} };
    ObjectValues(arguments).forEach(function(argument) {
      entry[(typeof argument).substr(0,1)] = argument;
    });
    queue.push(entry);
    ev('process');
  };
  
})(typeof exports === 'object' ? exports : this);

