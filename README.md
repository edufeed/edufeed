# edufeed

## Demo (Web Version)

See WEBROOT for a demo (chrome only - other browsers don't yet support the Web Components standard).

## Installing and Running (Web Version)

First install [git](http://www.git-scm.com/) and [node.js](https://nodejs.org/) and [mongoDB](https://www.mongodb.org/)

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

Now, install the USB drivers for your Android device (for either [Nexus](http://developer.android.com/sdk/win-usb.html) or [other](http://developer.android.com/tools/extras/oem-usb.html) devices) on your desktop, [enable USB Debugging on your Android device](http://developer.android.com/tools/device.html), open the Chrome App Developer Tool on the Android device, hook up your Android device to your desktop, and run the following command to deploy the app (from the edufeed directory):

```
cca run android --device
```

## Setting up Accounts

### Account Creation

Visit the signup page: WEBROOT/signup.html

### Logging in

Visit the feed page, and open the admin console (it should be the first feed item). It will have a place for you to log in.

## Offline Caching and Customization

### Customizing Profile Pictures

By default, the profile pic shown will be the first Bing images search result for the username. If you want a different profile pic, add an image in either png or jpg format, to the [profilepics](https://github.com/edufeed/edufeed/tree/master/www/profilepics) folder, and edit the [profilepic_paths.yaml](https://github.com/edufeed/edufeed/blob/master/www/profilepic_paths.yaml) file to add an entry from the username to the profile pic (or use the [make_directory_listings.ls](https://github.com/edufeed/edufeed/blob/master/scripts/make_directory_listings.ls) script, instructions below).

### Customizing Word-Task Images

By default, the image shown for a word-task will be the first Bing images search result for the word. If you want a different image shown, add an image in either png or jpg format, to the [images](https://github.com/edufeed/edufeed/tree/master/www/images) folder, and edit the [image_paths.yaml](https://github.com/edufeed/edufeed/blob/master/www/image_paths.yaml) file to add an entry from the username to the profile pic (or use the [make_directory_listings.ls](https://github.com/edufeed/edufeed/blob/master/scripts/make_directory_listings.ls) script, instructions below).

The script [fetch_bing_image.ls](https://github.com/edufeed/edufeed/blob/master/scripts/fetch_bing_image.ls) automates the task of downloading images from bing and putting them in the `www/images` folder. To run it, provide a list of search queries to download as arguments:

```
node scripts/fetch_bing_image.js cat dog mouse
```

(If you get any errors about missing modules, run the command `npm install` and try again)

## Caching Speech Synthesis Results

By default, the voice synthesis result for the word will be from Google's speech synthesis service. If you want to cache it, or have something else said for a word, add an audio file in mp3 format to the [speechsynth_en](https://github.com/edufeed/edufeed/tree/master/www/speechsynth_en) folder, and edit the [speechsynth_en_paths.yaml](https://github.com/edufeed/edufeed/blob/master/www/speechsynth_en_paths.yaml) file to add an entry from the utterance to the file name (or use the [make_directory_listings.ls](https://github.com/edufeed/edufeed/blob/master/scripts/make_directory_listings.ls) script, instructions below).

The script [fetch_speechsynth.ls](https://github.com/edufeed/edufeed/blob/master/scripts/fetch_speechsynth.ls) automates the task of downloading speech synthesis audio recordings and putting them in the `www/speechsynth_en` folder. To run it, provide a list of words to download as arguments:

```
node scripts/fetch_speechsynth.js cat dog mouse
```

## Generating the directory listing yaml files

The script [make_directory_listings.ls](https://github.com/edufeed/edufeed/blob/master/scripts/make_directory_listings.ls) automates the task of generating the [image_paths.yaml](https://github.com/edufeed/edufeed/blob/master/www/image_paths.yaml), [profilepic_paths.yaml](https://github.com/edufeed/edufeed/blob/master/www/profilepic_paths.yaml), and [speechsynth_en](https://github.com/edufeed/edufeed/tree/master/www/speechsynth_en) files based on the contents of the corresponding directories ([images](https://github.com/edufeed/edufeed/tree/master/www/images), [profilepics](https://github.com/edufeed/edufeed/tree/master/www/profilepics), [speechsynth_en](https://github.com/edufeed/edufeed/tree/master/www/speechsynth_en)). Run it using:

```
node scripts/make_directory_listings.js
```

## Logs

### Viewing Logs

Visit COUCHROOT/_utils/ and log in with same username/password credentials you signed up with. The logs will be in the database logs_USERNAME.

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


