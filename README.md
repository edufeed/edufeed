# edufeed

## Demo (Web Version)

See WEBROOT for a demo (chrome only - other browsers don't yet support the Web Components standard).

## Installing and Running (Web Version)

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

You will now be able to access the site by visiting [http://localhost:8080](http://localhost:8080)

## Installing and Running (Android Version)

This is a Mobile Chrome App - the [Mobile Chrome Apps](https://github.com/MobileChromeApps/mobile-chrome-apps/blob/master/docs/Develop.md) site has more detailed deployment instructions.

First, install [git](http://www.git-scm.com/) and clone the repository:

```
git clone https://github.com/edufeed/edufeed
```

Then, install the [Android SDK](http://developer.android.com/sdk/installing/index.html) (comes with Android Studio) on your desktop.

Then, install the [Chrome App Developer Tool](https://github.com/MobileChromeApps/chrome-app-developer-tool/#installation-using-a-pre-built-binary-android-only) on your Android device.

Then install the [Chrome Apps for Mobile toolchain](https://github.com/MobileChromeApps/mobile-chrome-apps/blob/master/docs/Installation.md) to your desktop.

Now, [enable USB Debugging on your Android device](http://developer.android.com/tools/device.html), open the Chrome App Developer Tool on the Android device, hook up your Android device to your desktop, and run the following command to deploy the app (from the edufeed directory):

```
cca run android --device
```

## Setting up Accounts

### Account Creation

Visit the signup page: WEBROOT/signup.html

### Logging in

Visit the feed page, and open the admin console (it should be the first feed item). It will have a place for you to log in.

## Customization

### Customizing Profile Pictures

By default, the profile pic shown will be the first Bing images search result for the username. If you want a different profile pic, add an image in either png or jpg format, to the [profilepics](https://github.com/edufeed/edufeed/tree/master/www/profilepics) folder, and edit the [profilepic_paths.yaml](https://github.com/edufeed/edufeed/blob/master/www/profilepic_paths.yaml) file to add an entry from the username to the profile pic.

### Customizing Word-Task Images

By default, the image shown for a word-task will be the first Bing images search result for the word. If you want a different image shown, add an image in either png or jpg format, to the [images](https://github.com/edufeed/edufeed/tree/master/www/images) folder, and edit the [image_paths.yaml](https://github.com/edufeed/edufeed/blob/master/www/image_paths.yaml) file to add an entry from the username to the profile pic.

## Logs

### Viewing Logs

Visit COUCHROOT/_utils.html and log in with same username/password credentials you signed up with. The logs will be in the database logs_USERNAME.

## Development Details

The frontend is built using [HTML5 Web Components](http://webcomponents.org/) and [Polymer](https://www.polymer-project.org/).

The backend is powered by [node.js](https://nodejs.org/), [express](http://expressjs.com/), and [deployd](http://deployd.com/)

Code is written in [LiveScript](http://livescript.net/).

## Frontend Architecture

### Activities and Thumbnails

Each activity is associated with a thumbnail. The thumbnail is a square that is inserted into the feed, while the activity is the full-screen interactive educational task.

A list of activities and thumbnails can be found in [feed-items.html](https://github.com/edufeed/edufeed/blob/master/www/feed-items.html).

An example activity: [example-activity.html](https://github.com/edufeed/edufeed/blob/master/www/example-activity.html) and [example-activity.ls](https://github.com/edufeed/edufeed/blob/master/www/example-activity.ls)

An example thumbnail: [example-thumbnail.html](https://github.com/edufeed/edufeed/blob/master/www/example-thumbnail.html) and [example-thumbnail.ls](https://github.com/edufeed/edufeed/blob/master/www/example-thumbnail.ls)

To add a new activity, create the activity and thumbnail html file, and add it to [feed-items.html](https://github.com/edufeed/edufeed/blob/master/www/feed-items.html). If you are not following the `itemname-thumbnail` `itemname-activity` naming convention, you will also need to add it to the itemtypes dictionary in [https://github.com/edufeed/edufeed/blob/master/www/feed-items.ls](https://github.com/edufeed/edufeed/blob/master/www/feed-items.ls). [This commit](https://github.com/edufeed/edufeed/commit/5971a4013471af77cea8df6a26169e8ef9c61a48) has a complete example.

### Side-Scrolling Feed

The feed is located in [side-scroll-feed.html](https://github.com/edufeed/edufeed/blob/master/www/side-scroll-feed.html). The logic that inserts items into the feed is in [feed-items.ls](https://github.com/edufeed/edufeed/blob/master/www/feed-items.ls).

To insert items into the feed, use the addItemToFeed method, passing in a dictionary where `itemtype` is the unprefixed form of the activity/thumbnail (ie, `example`, `typeword`), and `keys` is a dictionary with the properties that should be set on the activity and thumbnail.

Here is an example for the `typeword` activity:

```
{itemtype: 'typeword', data: {word: 'dog'}}
```

Here is an example for the `example` activity:

```
{itemtype: 'example', data: {foo: 'somefooval', bar: 'somebarval'}}
```

## Backend Architecture

Entry point is in [app.ls](https://github.com/edufeed/edufeed/blob/master/app.ls) and [resources/express/init.ls](https://github.com/edufeed/edufeed/blob/master/resources/express/init.ls)


