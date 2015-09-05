# edufeed

## Demo (Web Version)

See WEBROOT for a demo (chrome only - other browsers don't yet support the Web Components standard).

## Installing and Running (Web Version)

See [server-setup.md](https://github.com/edufeed/edufeed/blob/master/server-setup.md)

## Installing and Running (Android Version)

This is a Mobile Chrome App - the [Mobile Chrome Apps](https://github.com/MobileChromeApps/mobile-chrome-apps/blob/master/docs/Develop.md) site has more detailed deployment instructions.

First, install [git](http://www.git-scm.com/), [nodejs](https://nodejs.org/) and [python 3](https://www.python.org/) and clone the repository:

```
git clone https://github.com/edufeed/edufeed
```

Now run the following command to download the video files (from the edufeed directory):

```
node scripts/download_videos.js
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

Visit the signup page: http://localhost:8080/signup.html

### Logging in

Visit the feed page, and open the admin console (it should be the first feed item). It will have a place for you to log in.

## Offline Caching and Customization

### Customizing Feed Items

To customize the set of sample feed items (which you can insert from the admin activity, in the `Add sample feed items` section), edit the function `getAllFeedItems` in [sample_feed_items.ls](https://github.com/edufeed/edufeed/blob/master/www/sample_feed_items.ls) - it returns a dictionary mapping from activity type to a list of feed items.

To customize the set of all feed items (which are suggested by the task suggestion algorithm), edit the function `getSampleFeedItems` in [sample_feed_items.ls](https://github.com/edufeed/edufeed/blob/master/www/sample_feed_items.ls) - it returns a dictionary mapping from activity type to a list of feed items, listed in ascending order of difficulty.

### Customzing Task Suggestions

To customize the item recommendation algorithm (which determines which items to insert into the feed after you complete one), you can choose from one of the existing, already-implemented algorithms in the admin console (see the selector box titled `Task Suggestion Formula`). They are:

* `one_more_of_the_sametype`: Inserts one more task, with the same type as the task you just finished.
* `one_of_different_type`: Inserts one more task, with a different type from the task you just finished.
* `three_same_then_one_different`: Inserts one more task, with the same type as the task you just finished. If it has already inserted 3 tasks of the same type in a row, it will insert a different type.
* `one_same_and_one_different` (default): Inserts two tasks: one with the same item type as the task you just finished, and one with a different item type.

To add a new one, add a function to the dictionary returned by `getTaskSuggestionFormulas` in [task-suggestion-utils.ls](https://github.com/edufeed/edufeed/blob/master/www/task-suggestion-utils.ls)

### Customizing Classes

Users who are in the same class will be able to share activities with each other. The list of classes can be edited at [classes.yaml](https://github.com/edufeed/edufeed/blob/master/www/classes.yaml)

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

(Note that this script does not currently work, as Google has started blocking it and returns a CAPTCHA instead of the mp3 file)

The speech is also cached in base64-format strings in the file [filecache.js](https://github.com/edufeed/edufeed/blob/master/www/filecache.js), to allow for faster access. To update this file, run:

```
node scripts/make_filecache.js
```

## Generating the directory listing yaml files

The script [make_directory_listings.ls](https://github.com/edufeed/edufeed/blob/master/scripts/make_directory_listings.ls) automates the task of generating the [image_paths.yaml](https://github.com/edufeed/edufeed/blob/master/www/image_paths.yaml), [profilepic_paths.yaml](https://github.com/edufeed/edufeed/blob/master/www/profilepic_paths.yaml), and [speechsynth_en](https://github.com/edufeed/edufeed/tree/master/www/speechsynth_en) files based on the contents of the corresponding directories ([images](https://github.com/edufeed/edufeed/tree/master/www/images), [profilepics](https://github.com/edufeed/edufeed/tree/master/www/profilepics), [speechsynth_en](https://github.com/edufeed/edufeed/tree/master/www/speechsynth_en)). Run it using:

```
node scripts/make_directory_listings.js
```

## Downloading Videos and Making Video Playlists

The videos are specified as youtube video IDs in the `getFeedVideoLists` function of [sample_feed_items.ls](https://github.com/edufeed/edufeed/blob/master/www/sample_feed_items.ls)

The videos are not in this repository to conserve space. Running the following scripts will download the videos to the directory `www/videos/youtube` and generate thumbnails in `www/videos/youtube_thumbnails` (if you are not satisfied with the thumbnail for a video, edit [scripts/download_videos.ls](https://github.com/edufeed/edufeed/blob/master/scripts/download_videos.ls) to adjust the point the thumbnail is taken from)

```
node scripts/download_videos.js
```

An example of adding a new activity consisting of a video playlist is shown [here](https://github.com/edufeed/edufeed/commit/d1ab10250cd454393361bf089a0f9b42dfcbe6ba)

## Logs

### Viewing Log Analysis Results

You can view the log analysis results for the current user the following ways:

* On the tablet, go to the admin console and click the `Display Log Analysis` button
* On the server, run the command `node scripts/view_log_analysis.js geza` (substituting `geza` with the username you want to view log analysis results for)

Results will look like follows. The code that does the log analysis is in [log-analysis.ls](https://github.com/edufeed/edufeed/blob/master/www/log-analysis.ls)

```
{
  "number of activities started": 13,
  "number of activities finished": 3,
  "number of activities left": 7,
  "number of total share events": 2,
  "number of unique activities shared": 1,
  "number of shares to each person in the class": {
    "geza": 2
  },
  "identities of posters for activities started": {
    "mouse": 13
  },
  "identities of posters for activities finished": {
    "mouse": 3
  },
  "identities of posters for activities left": {
    "mouse": 7
  },
  "types of activities started": {
    "admin": 8,
    "video": 1,
    "balance": 1,
    "typeword": 2,
    "dots": 1
  },
  "types of activities finished": {
    "balance": 1,
    "typeword": 2
  },
  "types of activities left": {
    "admin": 5,
    "video": 1,
    "dots": 1
  },
  "total duration app has been open in seconds (within 10 seconds including idle time)": 580,
  "total duration app has been active (excluding idle periods greater than 10 seconds)": 210,
  "total time spent on each activity type (within 10 seconds including idle time)": {
    "side-scroll-feed": 20,
    "video": 30,
    "balance": 10,
    "typeword": 50,
    "taskfinished-sharing": 200,
    "admin": 260,
    "tutorial": 10
  },
  "total active time spent on each activity type (excluding idle periods greater than 10 seconds)": {
    "side-scroll-feed": 20,
    "video": 10,
    "balance": 10,
    "typeword": 50,
    "taskfinished-sharing": 30,
    "admin": 80,
    "tutorial": 10
  }
}
```

### Viewing Logs

You can view the logs the following ways:

* On the tablet, go to the admin console and either download or view the logs (warning: viewing them directly on the tablet might freeze the app if there's too many logs to display)
* On the server, run the command `node scripts/view_logs.js geza` (substituting `geza` with the username you want to view log analysis results for)
* Visit http://localhost:5984/_utils/ (or wherever the couchdb is hosted) and log in with same username/password credentials you signed up with. The logs will be in the database logs_USERNAME.

## Sample Feed Items

See [sample_feed_items.ls](https://github.com/edufeed/edufeed/blob/master/www/sample_feed_items.ls) for the list of activities, and the algorithm that recommends the next task.

## Development Details

The frontend is built using [HTML5 Web Components](http://webcomponents.org/) and [Polymer](https://www.polymer-project.org/).

The backend is powered by [node.js](https://nodejs.org/), [express](http://expressjs.com/), [couchdb](http://couchdb.apache.org/) and [pouchdb](http://pouchdb.com/)

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

To insert items into the feed, use the addItemToFeed method, passing in a dictionary where `itemtype` is the unprefixed form of the activity/thumbnail (ie, `example`, `typeword`), and `data` is a dictionary with the properties that should be set on the activity and thumbnail, and `social` is a dictionary that can contain a string `poster` and an array `finishedby`.

Here is an example for the `typeword` activity:

```
{itemtype: 'typeword', data: {word: 'dog'}, social: {poster: 'dog', finishedby: ['zebra']}}
```

Here is an example for the `example` activity:

```
{itemtype: 'example', data: {foo: 'somefooval', bar: 'somebarval'}, social: {poster: 'mouse', finishedby: ['elephant']}}
```

See [sample_feed_items.ls](https://github.com/edufeed/edufeed/blob/master/www/sample_feed_items.ls) for more examples.

## Backend Architecture

Entry point is in [app.ls](https://github.com/edufeed/edufeed/blob/master/app.ls)

## Troubleshooting

### No feed items

Open the admin console, go to `Add sample feed items`, and click the `defaults` button.

### Sync Errors

If you are having sync errors and are using a standalone server, please ensure that

* The tablet is connected to the same wifi network as the server (if you have created a wifi network on the server via [connectify](https://github.com/edufeed/edufeed/blob/master/server-setup.md#connectify))
* You are able to visit your_server_ip:5984/_utils (the couchdb admin console) on the tablet (where your_server_ip is [your server's ip address](https://github.com/edufeed/edufeed/blob/master/server-setup.md#determine-server-ip-address))
* [CORS is enabled on the server](https://github.com/edufeed/edufeed/blob/master/server-setup.md#enable-cors)
* [You have set the couchdb `bind_address` variable set to 0.0.0.0](https://github.com/edufeed/edufeed/blob/master/server-setup.md#listen-to-all-hosts)

#### Database Errors

One possible source of sync errors is that your database format is outdated. You can delete all server-side databases using the following command:

```
node scripts/delete_all_databases
```

And you can then delete all tablet-side databases by going to the admin console and clicking the `Delete All Local Databases for all users` (or by going to the android application manager and clearing all app data there).

And after restarting the server and tablet app, the sync issues should hopefully be gone.
