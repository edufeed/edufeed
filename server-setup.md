# Setup instructions

This was done on a Surface 3 Pro but should work on any machine.

Install chrome https://www.google.com/chrome

Install git http://msysgit.github.io/

Install nodejs https://nodejs.org/

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

Determine your IP address:

```
node scripts/getip.js
```

Start the server:

```
node runserver.js
```
