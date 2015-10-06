Polymer {
  is: 'side-scroll-feed'
  properties: {
    items: {
      type: Array
      value: []
      observer: 'itemsChanged'
    }
  }
  S: (pattern) ->
    $(this.$$(pattern))
  SM: (pattern) ->
    $(this.querySelectorAll(pattern))
  closeShareWidget: ->
    this.$$('#sharingbutton').closeShareWidget()
  closeButtonClicked: ->
    if this.$$('#sharingbutton').isShareWidgetOpen()
      this.closeShareWidget()
    else
      addlog {event: 'task-left', item: this.current_item}
      this.closeActivity()
  doneButtonClicked: ->
    if this.$$('#sharingbutton').isShareWidgetOpen()
      this.closeShareWidget()
    else
      this.openTaskFinished(this.current_item)
  helpButtonClicked: ->
    itemtype = this.current_item.itemtype
    this.openTutorial(itemtype)
  openTutorial: (itemtype) ->
    stop_sound()
    this.SM('.mainscreen').hide()
    this.S('#tutorial').show()
    tutorial_dom = Polymer.dom(this.$$('#tutorial'))
    tutorial_dom.innerHTML = "<tutorial-display tutorial='#{itemtype}'></tutorial-display>"
    addlog {'tutorial-opened', item: this.current_item}
    this.currentactivitytype = 'tutorial'
  closeTutorial: ->
    stop_sound()
    this.SM('.mainscreen').hide()
    tutorial_dom = Polymer.dom(this.$$('#tutorial'))
    tutorial_dom.innerHTML = ''
    this.S('#activityscreen').show()
    this.currentactivitytype = this.current_item.itemtype
  openTaskFinished: (item) ->
    stop_sound()
    addlog {event: 'task-finished', item: item}
    this.itemFinished item
    #this.closeActivity()
    this.SM('.mainscreen').hide()
    this.S('#activity').html('')
    this.$$('#sharingbutton').closeShareWidget()
    this.S('#taskfinished').show()
    taskfinished_dom = Polymer.dom(this.$$('#taskfinished'))
    taskfinished_dom.innerHTML = "<taskfinished-display></taskfinished-display>"
    this.currentactivitytype = 'taskfinished-sharing'
  closeTaskFinished: ->
    stop_sound()
    this.SM('.mainscreen').hide()
    tutorial_dom = Polymer.dom(this.$$('#taskfinished'))
    tutorial_dom.innerHTML = ''
    this.S('#thumbnails').show()
  closeActivity: ->
    stop_sound()
    this.SM('.mainscreen').hide()
    this.S('#activity').html('')
    this.S('#thumbnails').show()
    this.$$('#sharingbutton').closeShareWidget()
    this.currentactivitytype = 'side-scroll-feed'
  itemFinished: (item) ->
    self = this
    postFinishedItem item, ->
      addNewItemSuggestions item, self.items, self.finished_items, ->
        self.updateItems()
    /*
    for x in $('social-thumbnail')
      tag = $(x).find('#thumbnail')
      if not tag?
        return
      tag = tag[0]
      if not tag?
        return
      if tagMatchesItem tag, item
        username <- getUsername()
        if x.finishedby.indexOf(username) == -1
          x.finishedby = x.finishedby ++ [username]
    */
  openItem: (item) ->
    this.SM('.mainscreen').hide()
    this.S('#activityscreen').show()
    this.S('#donebutton').hide()
    this.S('#exitbutton').show()
    this.S('#activity').html('')
    this.current_item = item
    this.currentactivitytype = item.itemtype
    activity = makeActivity(item) # feed-items.ls
    activity[0].addEventListener 'task-finished', ~>
      if not activity[0].alreadyleft
        activity[0].alreadyleft = true
        this.openTaskFinished(item)
    activity[0].addEventListener 'task-left', ~>
      if not activity[0].alreadyleft
        activity[0].alreadyleft = true
        addlog {event: 'task-left', item: item}
        this.closeActivity()
    activity.appendTo this.S('#activity')
    bumpFeedItemUpdateTime item, ~>
      this.updateItems()
  addItemToFeed: (item, idx) ->
    thumbnail = makeSocialThumbnail item
    thumbnail.find('#thumbnail').click ~>
      if item.itemtype != 'admin'
        addlog {event: 'task-started', item: item}
        this.openItem item
      else
        password = prompt("Password: ")
        if password == 'edu'
          addlog {event: 'task-started', item: item}
          this.openItem item
    if not idx?
      this.S('#thumbnails').append thumbnail
    else
      this.S('#thumbnails').insertAt idx, thumbnail
  removeItemFromFeed: (idx) ->
    thumbnail = this.S('#thumbnails').children().eq(idx)
    thumbnail.remove()
  updateSocialThumbnail: (item, idx) ->
    if not item? or not item.social?
      return
    thumbnail = this.S('#thumbnails').children().eq(idx)
    thumbnail.prop item.social
  itemsChanged: (newitems, olditems) ->
    if newitems === olditems
      return
    newitems = newitems ? []
    olditems = olditems ? []
    edits = edit_sequence(newitems, olditems, itemtype_and_data_matches)
    for edit in edits
      {action, idx, item} = edit
      if action == 'EQUAL'
        new_social = item.social ? {}
        old_social = edit.olditem.social ? {}
        if new_social !== old_social
          this.updateSocialThumbnail(item, idx)
      if action == 'DELETE'
        this.removeItemFromFeed(idx)
      if action == 'INSERT'
        this.addItemToFeed(item, idx)
  /*
  itemsChanged: (newitems, olditems) ->
    if newitems === olditems
      return
    this.S('#thumbnails').html('')
    for item in this.items
      this.addItemToFeed item
  */
  sortByUpdateTime: (docs) ->
    return docs.sort (a, b) ->
      a_updatetime = 0
      if a? and a.updatetime?
        a_updatetime = a.updatetime
      b_updatetime = 0
      if b? and b.updatetime?
        b_updatetime = b.updatetime
      return b_updatetime - a_updatetime
  # removeFinishedItems removes all items finished by the user from their feed
  removeFinishedItems: (origItems, finishedItems, username) ->
    # If no items have been finished by anyone, return the original feed items
    if finishedItems.length == 0
      return origItems
    newItemsList = []
    # Otherwise, for each item in the feed
    for item in origItems
      # Hack. Not sure how to check if it's been finished if it isn't social.
      if not item.social?
        newItemsList.push(item)
      # Check if it has been finished
      else
        matching_finished_item = [x for x in finishedItems when itemtype_and_data_matches(item, x)]
        if matching_finished_item.length > 0
          # If it hasn't been finished by this user, it can go on the feed
          if username not in matching_finished_item[0].social.finishedby
            newItemsList.push(item)
        # If it hasn't been finished anyone, it can go on the feed
        else
          newItemsList.push(item)
    return newItemsList
  # filterItems sets the feed so that there are
  # at min 4 items suggested by the system.
  # The rest can be shared by classmates.
  filterItems: (origItems, classmates) ->
    maxLength = 10
    sharedMax = 6
    noSharedMax = 4

    if origItems.length <= maxLength
      # Hack
      # Make sure that there are no left over readaloud, typeletter, and dots activites
      console.log 'origItems only has ' + origItems.length + ' items'

      newOrigItems = []
      for item in origItems
        if item.itemtype != 'dots' and item.itemtype != 'readaloud' and item.itemtype != 'typeletter' and item.itemtype != 'bars'
          newOrigItems.push(item)
      return newOrigItems

    # Get ready to filter the list
    filteredList = []
    adminItem = []

    # Separate the shared and system-suggested (no shared) items
    noSharedItemsList = []
    sharedItemsList = []
    for item in origItems
      if item.itemtype == 'admin'
        adminItem.push(item)
      else if item.itemtype != 'dots' and item.itemtype != 'readaloud' and item.itemtype != 'typeletter' and item.itemtype != 'bars'
        if not item.social?
          noSharedItemsList.push(item)
        else if item.social.poster not in classmates
          noSharedItemsList.push(item)
        else
          sharedItemsList.push(item)

    console.log 'origItems length: ' + origItems.length
    console.log 'noSharedItemsList length: ' + noSharedItemsList.length
    console.log 'sharedItemsList length: ' + sharedItemsList.length

    NSIL_len = noSharedItemsList.length
    SIL_len = sharedItemsList.length

    if NSIL_len <= noSharedMax and SIL_len <= sharedMax
      filteredList = noSharedItemsList ++ sharedItemsList
    else if NSIL_len > noSharedMax and SIL_len > sharedMax
      # Newest items stay in feed
      for x from 0 to noSharedMax-1
        filteredList.push(noSharedItemsList[x])
      for y from 0 to sharedMax-1
        filteredList.push(sharedItemsList[y])

      /* Oldest items stay in feed
      for x from NSIL_len-1 to NSIL_len-noSharedMax by -1
        filteredList.push(noSharedItemsList[x])
      for y from SIL_len-1 to SIL_len-sharedMax by -1
        filteredList.push(sharedItemsList[y])*/

    else if NSIL_len > noSharedMax and SIL_len <= sharedMax
      filteredList = sharedItemsList
      
      # Oldest items stay in feed
      # for x from NSIL_len-1 to 0 by -1

      # Newest items stay in feed
      for x from 0 to NSIL_len-1
        if filteredList.length < maxLength
          filteredList.push(noSharedItemsList[x])
        else
          console.log 'filtered list length: ' + filteredList.length
          filteredList = filteredList ++ adminItem
          return filteredList

    else if NSIL_len <= noSharedMax and SIL_len > sharedMax
      filteredList = noSharedItemsList

      # Oldest items stay in feed
      # for x from SIL_len-1 to SIL_len-sharedMax by -1

      # Newest items stay in feed
      for x from 0 to sharedMax-1
        if filteredList.length < maxLength
          filteredList.push(sharedItemsList[x])
        else
          console.log 'filtered list length: ' + filteredList.length
          filteredList = filteredList ++ adminItem
          return filteredList

    console.log 'filtered list length: ' + filteredList.length
    filteredList = filteredList ++ adminItem
    return filteredList
  itemtype_and_poster_matches: (item1, item2) ->
    if item1.itemtype == item2.itemtype and item1.social.poster == item2.social.poster
      return true
    return false
  updateItems: (firstvisit) ->
    self = this
    username <- getUsername()
    classmates <- getClassmates(username)
    docs <- getItems "feeditems_#{username}"
    if not docs? or not docs.length?
      docs = []
    #admin <- getBoolParam 'admin'
    noadmin <- getBoolParam 'noadmin'
    if self.hide_admin_console? and self.hide_admin_console
      noadmin = true
    if docs.length == 0 or (!noadmin and (docs.map (.itemtype)).indexOf('admin') == -1)
      docs := [{itemtype: 'admin', social: {poster: 'tablet'}, updatetime: 0}] ++ docs
    finished_items <- getFinishedItems()
    self.finished_items = finished_items
    for doc in docs
      if not doc.social?
        doc.social = {}
      doc.social.myname = username
      matching_finished_items = [x for x in finished_items when itemtype_and_data_matches(doc, x)]
      if matching_finished_items.length > 0
        doc.social.finishedby = matching_finished_items[0].social.finishedby
    noFinishedItemsList = self.removeFinishedItems(docs, finished_items, username)
    noDuplicateItemsList = self.
    sortedItems = self.sortByUpdateTime(noFinishedItemsList)
    filteredItems = self.filterItems(sortedItems, classmates)
    self.items = self.sortByUpdateTime(filteredItems)
    if firstvisit? and firstvisit
      addlog {event: 'visitfeed'}
  shareActivity: (evt) ->
    self = this
    {username} = evt.detail
    local_username <- getUsername()
    if not username?
      console.log 'no username'
      return
    # {itemtype, data} = self.S('#activity').children()[0].getalldata()
    {itemtype, data} = self.current_item
    if not itemtype?
      console.log 'do not have itemtype'
      return
    social_sharing_data = getSocialSharingData(itemtype)
    if social_sharing_data?
      for k,v of social_sharing_data
        data[k] = v
    postItemToTarget username, {
      itemtype: itemtype
      data: data
      social: {
        poster: local_username
      }
    }
    addlog {event: 'shareactivity', targetuser: username, item: self.current_item}
  ready: ->
    self = this
    this.addEventListener 'hide-admin-activity', ->
      self.hide_admin_console = true
      self.updateItems()
    this.addEventListener 'make-all-buttons-transparent', ->
      self.S('#activitybuttons').css('opacity', 0)
    this.addEventListener 'make-all-buttons-opaque', ->
      self.S('#activitybuttons').css('opacity', 1)
    this.addEventListener 'hide-share-button', ->
      self.S('#sharingbutton').hide()
    this.addEventListener 'show-share-button', ->
      self.S('#sharingbutton').show()
    this.addEventListener 'hide-help-button', ->
      self.S('#helpbutton').hide()
    this.addEventListener 'show-help-button', ->
      self.S('#helpbutton').show()
    this.addEventListener 'task-freeplay', ->
      self.S('#exitbutton').hide()
      self.S('#donebutton').show()
    this.addEventListener 'task-notfreeplay', ->
      self.S('#donebutton').hide()
      self.S('#exitbutton').show()
    this.addEventListener 'close-tutorial', ->
      self.closeTutorial()
    this.addEventListener 'close-taskfinished', ->
      self.closeTaskFinished()
    this.addEventListener 'share-activity', (evt) ->
      self.shareActivity(evt)
    this.updateItems(true)
    getUsername (username) ->
      setSyncHandler "feeditems_#{username}", (change) ->
        self.updateItems()
      classmates <- getClassmates(username)
      for let classmate in classmates
        setSyncHandler "finisheditems_#{classmate}", (change) ->
          self.updateItems()
    hidesharebutton <- getBoolParam('hidesharebutton')
    hidehelpbutton <- getBoolParam('hidehelpbutton')
    if hidesharebutton
      self.S('#sharingbutton').hide()
    if hidehelpbutton
      self.S('#helpbutton').hide()
    self.currentactivitytype = 'side-scroll-feed'
    mostrecentclick = Date.now()
    $('body').click ->
      mostrecentclick := Date.now()
    postinterval = 10000 # every 10 seconds
    setInterval ->
      addlog {event: 'app-still-open', 'mostrecentclick': mostrecentclick, 'currenttime': Date.now(), 'postinterval': postinterval, 'currentactivitytype': self.currentactivitytype, 'item': self.current_item}
    , postinterval
}
