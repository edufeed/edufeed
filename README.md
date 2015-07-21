# edufeed

## Demo

See [http://edfeed.herokuapp.com/](http://edfeed.herokuapp.com/) for a demo (chrome only - other browsers don't yet support the Web Components standard).

## Installing and Running

First install [node.js](https://nodejs.org/) and [mongoDB](https://www.mongodb.org/)

Then clone the repository and install prerequisites:

```
git clone https://github.com/edufeed/edufeed
cd edufeed
npm install
npm install -g node-dev mongosrv
```

Now register for the [Bing Search API](https://datamarket.azure.com/dataset/bing/search), go to [Account Information](https://datamarket.azure.com/account), see your Primary Account Key on that page, and paste it into a file `.getsecret.yaml` inside the `edufeed` directory:

```
bing_api_key: your_primary_account_key_goes_here
```

Now you can start up mongo and run the app:

```
mongosrv &
node-dev app.ls
```

## Architecture Overview

The frontend is built using [HTML5 Web Components](http://webcomponents.org/) and [Polymer](https://www.polymer-project.org/).

The backend is powered by [node.js](https://nodejs.org/) and [Express](http://expressjs.com/).

Code is written in [LiveScript](http://livescript.net/).

## Frontend Architecture

### Activities and Thumbnails

Each activity is associated with a thumbnail. The thumbnail is a square that is inserted into the feed, while the activity is the full-screen interactive educational task.

A list of activities and thumbnails can be found in [feed-items.html](https://github.com/edufeed/edufeed/blob/master/feed-items.html).

An example activity: [example-activity.html](https://github.com/edufeed/edufeed/blob/master/example-activity.html) and [example-activity.ls](https://github.com/edufeed/edufeed/blob/master/example-activity.ls)

An example thumbnail: [example-thumbnail.html](https://github.com/edufeed/edufeed/blob/master/example-thumbnail.html) and [example-thumbnail.ls](https://github.com/edufeed/edufeed/blob/master/example-thumbnail.ls)

To add a new activity, create the activity and thumbnail html file, and add it to [feed-items.html](https://github.com/edufeed/edufeed/blob/master/feed-items.html). If you are not following the `itemname-thumbnail` `itemname-activity` naming convention, you will also need to add it to the itemtypes dictionary in [https://github.com/edufeed/edufeed/blob/master/feed-items.ls](https://github.com/edufeed/edufeed/blob/master/feed-items.ls). [This commit](https://github.com/edufeed/edufeed/commit/5971a4013471af77cea8df6a26169e8ef9c61a48) has a complete example.

### Side-Scrolling Feed

The feed is located in [side-scroll-feed.html](https://github.com/edufeed/edufeed/blob/master/side-scroll-feed.html). The logic that inserts items into the feed is in [feed-items.ls](https://github.com/edufeed/edufeed/blob/master/feed-items.ls).

To insert items into the feed, use the addItemToFeed method, passing in a dictionary where `itemtype` is the unprefixed form of the activity/thumbnail (ie, `example`, `typeword`), and the rest of the keys are the data that should be set as properties on the activity and thumbnail.

Here is an example for the `typeword` activity:

```
{itemtype: 'typeword', word: 'dog'}
```

Here is an example for the `example` activity:

```
{itemtype: 'example', foo: 'somefooval', bar: 'somebarval'}
```

## Backend Architecture

Entry point is in [app.ls](https://github.com/edufeed/edufeed/blob/master/app.ls)


