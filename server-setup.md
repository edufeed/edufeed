# Setup instructions

This should work on any machine that supports creating a wifi hotspot. Surface 3 and Surface 3 Pro's wifi drivers do NOT support creating a wifi hotspot, most other laptops and tablets do (if your laptop's wifi drivers does not, purchase a TP-LINK TL-WN725N Wireless N Nano USB Adapter and plug it in - I have confirmed it works with connectify).

Install chrome https://www.google.com/chrome

Install git http://msysgit.github.io/

Install nodejs https://nodejs.org/

Install python 2.7 https://www.python.org/download/releases/2.7/

Install visual studio 2013 express for windows https://www.visualstudio.com/en-us/downloads/download-visual-studio-vs

Install gulp, node-dev, and pouchdb-server

```
npm install -g gulp node-dev pouchdb-server add-cors-to-couchdb
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

Enable CORS (cross-origin resource sharing):

```
add-cors-to-couchdb
```

Visit http://localhost:5984/_utils and click config, then change the `bind_address` variable to 0.0.0.0

Visit localhost:8080 and ip_address:8080 (where ip_address is what you got from running the getip.js script) in chrome to verify that the server is running and you have the correct IP address.

Now open the app on your tablet, visit the admin console, enter the IP address under the `CouchDB Server` section along with a username, and click login.

## Setting up Mongo and Bing API Keys

These were originally required for fetching images from the bing API. However, these instructions should no longer be required, as we're storing all the images locally now. However, if you do want to use the bing image functionality, you will also need to do the following (after running the instructions above)

First install [mongoDB](https://www.mongodb.org/)

Then install the mongosrv wrapper:

```
npm install -g node-dev mongosrv
```

Now register for the [Bing Search API](https://datamarket.azure.com/dataset/bing/search), go to [Account Information](https://datamarket.azure.com/account), see your Primary Account Key on that page, and paste it into a file `.getsecret.yaml` inside the `edufeed` directory:

```
bing_api_key: your_primary_account_key_goes_here
```

Now you can start up mongo and run the app:

```
mongosrv
./runserver
```

You will now be able to access the site by visiting [http://localhost:8080](http://localhost:8080)
