(function(){
  var os, ifname, ref$, ifaces, alias, i$, len$, iface;
  os = require('os');
  for (ifname in ref$ = os.networkInterfaces()) {
    ifaces = ref$[ifname];
    alias = 0;
    for (i$ = 0, len$ = ifaces.length; i$ < len$; ++i$) {
      iface = ifaces[i$];
      if ('IPv4' !== iface.family || iface.internal !== false) {
        continue;
      }
      if (alias >= 1) {
        console.log(ifname + ":" + alias + " " + iface.address);
      } else {
        console.log(ifname + " " + iface.address);
      }
      alias++;
    }
  }
}).call(this);
