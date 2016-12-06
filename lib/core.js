(function(exports) {

  // Tiny event simulator
  // ---[ start ]---
  var evListeners = {};

  function emitEvent(name, data) {
    var list = evListeners[name] || [];
    list.forEach(function (callback) {
      if (!data) return;
      data = callback.call(null, data);
    });
    return data;
  }

  emitEvent.on = function (name, callback) {
    if (!evListeners[name]) {
      evListeners[name] = [];
    }
    evListeners[name].push(callback);
  };
  // ---[  end  ]---

  // Tracking modules
  var modules  = {}, // Registered modules
      queue    = [], // Require/Define queue
      depQueue = [], // Dependency queue
      loaded   = []; // List to prevent double-loading

  // Processing of the current status
  function process() {

    // Process queue
    queue = queue.filter(function (entry) {
      var runnable = true;
      entry.deps.forEach(function (dep) {
        if (Object.keys(modules).indexOf(dep) < 0) {
          runnable = false;
          depQueue.push(dep);
        }
      });
      if (runnable) {
        var args   = entry.deps.map(function (name) {
          return modules[name];
        });
        var result = entry.callback.apply(null, args);
        if (entry.name) {
          modules[entry.name] = result;
        }
      }
      return !runnable;
    });

    // Process dependency queue
    var name;
    while (depQueue.length) {
      name = depQueue.shift();
      if (loaded.indexOf(name) >= 0) {
        continue;
      }
      loaded.push(name);
      emitEvent('load-module', name);
    }
  }

  // The actual structure
  exports.__require = {

    // Expose the event emitter
    on  : emitEvent.on,
    emit: emitEvent,

    // Requiring modules
    require: function (dependencies, callback) {
      queue.push({
        callback: callback,
        deps    : dependencies
      });
      process();
    },

    // Registering modules
    define: function (name, dependencies, callback) {
      if (typeof dependencies === 'function') {
        callback     = dependencies;
        dependencies = [];
      }
      queue.push({
        callback: callback,
        deps    : dependencies,
        name    : name
      });
      process();
    }
  };

  // Allow remote process triggering
  emitEvent.on('process', process);

})(typeof exports === 'object' ? exports : this);


