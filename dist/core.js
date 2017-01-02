(function(exports){

  // ---[ event sim ]---
  var l={},ev=function(n,d){d=d||true;l[n]=l[n]||[];l[n].forEach(function(c){d=d&&c(d);});};
  ev.on=function(n,c){l[n]=l[n]||[];l[n].push(c);};

  // Keep track of modules
  var known   = [],
      modules = {},
      queue   = [];

  // Process the current status
  ev.on('process',function() {
    queue = queue.filter(function(module){
      if(module.n&&(modules.indexOf(module.n)>=0))return false;
      var runnable=true,args=[];
      module.d.forEach(function(dep) {
        if(modules[dep]) {
          args.push(modules[dep]);
        } else {
          runnable=false;
          if(known.indexOf(dep)<0){ev('load-module',dep);known.push(dep);}
        }
      });
      if(runnable){
        var result = module.c.apply(null,args);
        if(module.n)modules[module.n]=result;
      }
      return !runnable;
    });
  });

  // The actual require module
  exports.__require = {
    on  : ev.on,
    emit: ev,
    require: function(deps,callback) {
      queue.push({d:deps,c:callback});
      ev('process');
    },
    define: function(name,deps,callback) {
      if(typeof deps==='function'){callback=deps;deps=[];}
      queue.unshift({d:deps,c:callback,n:name});
      ev('process');
    }
  };
})(typeof exports === 'object' ? exports : this);

