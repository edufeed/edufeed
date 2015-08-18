# Setup instructions

This should work on any machine that supports creating a wifi hotspot. Surface 3 and Surface 3 Pro do NOT support creating a wifi hotspot, most other laptops and tablets do.

Install chrome https://www.google.com/chrome

Install git http://msysgit.github.io/

Install nodejs https://nodejs.org/

Install python 2.7 https://www.python.org/download/releases/2.7/

Install gulp, node-dev, and pouchdb-server

```
npm install -g gulp node-dev pouchdb-server
```

Clone this repository, cd to the directory, and install prerequisites:

```
git clone https://github.com/edufeed/edufeed
cd edufeed
npm install
```

Use [connectify](http://www.connectify.me/) to create the hotspot - a [coupon](http://www.connectify.me/store/?coupon=DEAL75) is available.

Determine your IP address:

```
node scripts/getip.js
```

Start the server

```
node runserver.js
```

Visit localhost:8080 and ip_address:8080 (where ip_address is what you got from running the getip.js script) in chrome to verify that the server is running and you have the correct IP address.

Now open the app on your tablet, visit the admin console, and enter the IP address under the `CouchDB Server` section.

