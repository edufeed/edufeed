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
  closeShareWidget: ->
    this.$$('#sharingbutton').closeShareWidget()
  closeButtonClicked: ->
    if this.$$('#sharingbutton').isShareWidgetOpen()
      this.closeShareWidget()
    else
      addlog {event: 'task-closed', item: this.current_item}
      this.closeActivity()
  doneButtonClicked: ->
    if this.$$('#sharingbutton').isShareWidgetOpen()
      this.closeShareWidget()
    else
      addlog {event: 'task-finished', item: this.current_item}
      this.itemFinished this.current_item
      this.closeActivity()
  helpButtonClicked: ->
    itemtype = this.current_item.itemtype
    this.openTutorial(itemtype)
  openTutorial: (itemtype) ->
    self = this
    videofile = "videos/#{itemtype}-tutorial.mp4"
    this.S('#activity').hide()
    this.S('#activitybuttons').hide()
    this.S('#tutorial').show()
    tutorialvideo_jq = $('<video>')
      .css({width: '100%', height: 'auto', 'pointer-events': 'none'})
      .prop({src: videofile, id: 'tutorialvideo'})
    tutorialvideo = tutorialvideo_jq[0]
    tutorialvideo_alttext = this.$$('#tutorialvideo_alttext')
    play_tutorial_video = ->
      tutorialvideo.removeEventListener('canplaythrough', play_tutorial_video)
      tutorialvideo_alttext.innerText = ''
      tutorialvideo.currentTime = 0
      tutorialvideo.style.display = 'inline'
      tutorialvideo.play()
    tutorial_video_ended = ->
      tutorialvideo.removeEventListener('ended', tutorial_video_ended)
      self.closeTutorial()
    tutorialvideo.addEventListener('canplaythrough', play_tutorial_video)
    tutorialvideo.addEventListener('ended', tutorial_video_ended)
    tutorialvideo.style.display = 'none'
    tutorialvideo_alttext.innerText = 'loading ' + videofile + ' - if this message persists, check that the file exists'
    tutorialvideo.src = videofile
    tutorialvideo_jq.appendTo(this.S('#tutorial'))
  closeTutorial: ->
    this.S('#tutorial').hide()
    this.S('#tutorial').find('#tutorialvideo').remove()
    this.S('#activity').show()
    this.S('#activitybuttons').show()
  closeActivity: ->
    this.S('#activity').html('')
    this.S('#thumbnails').show()
    this.S('#activitybuttons').hide()
    this.$$('#sharingbutton').closeShareWidget()
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
    this.S('#thumbnails').hide()
    this.S('#activitybuttons').show()
    this.S('#donebutton').hide()
    this.S('#exitbutton').show()
    this.S('#activity').html('')
    this.current_item = item
    activity = makeActivity(item) # feed-items.ls
    activity.on 'task-finished', ~>
      addlog {event: 'task-finished', item: item}
      this.itemFinished item
      this.closeActivity()
    activity.on 'task-left', ~>
      addlog {event: 'task-left', item: item}
      this.closeActivity()
    activity.appendTo this.S('#activity')
  addItemToFeed: (item) ->
    thumbnail = makeSocialThumbnail item
    thumbnail.find('#thumbnail').click ~>
      addlog {event: 'task-started', item: item}
      this.openItem item
    this.S('#thumbnails').append thumbnail
  itemsChanged: (newitems, olditems) ->
    if newitems === olditems
      return
    this.S('#thumbnails').html('')
    for item in this.items
      this.addItemToFeed item
  updateItems: (firstvisit) ->
    self = this
    username <- getUsername()
    docs <- getItems "feeditems_#{username}"
    if not docs? or not docs.length?
      docs = []
    #admin <- getBoolParam 'admin'
    noadmin <- getBoolParam 'noadmin'
    if self.hide_admin_console? and self.hide_admin_console
      noadmin = true
    if docs.length == 0 or (!noadmin and (docs.map (.itemtype)).indexOf('admin') == -1)
      docs := [{itemtype: 'admin', social: {poster: 'horse'}}] ++ docs
    finished_items <- getFinishedItems()
    self.finished_items = finished_items
    for doc in docs
      matching_finished_items = [x for x in finished_items when itemtype_and_data_matches(doc, x)]
      if matching_finished_items.length > 0
        if not doc.social?
          doc.social = {}
        doc.social.finishedby = matching_finished_items[0].social.finishedby
    self.items = docs
    if firstvisit? and firstvisit
      addlog {event: 'visitfeed'}
  shareActivity: (obj, evt) ->
    self = this
    {username} = evt
    local_username <- getUsername()
    console.log 'sharing with: ' + username
    if not username?
      console.log 'no username'
      return
    console.log 'current activity info is: '
    {itemtype, data, social} = self.S('#activity').children()[0].getalldata()
    if not itemtype?
      console.log 'do not have itemtype'
      return
    postItemToTarget username, {
      itemtype: itemtype
      data: data
      social: {
        poster: local_username
      }
    }
  ready: ->
    self = this
    $(this).on 'hide-admin-activity', ->
      self.hide_admin_console = true
      self.updateItems()
    $(this).on 'task-freeplay', ->
      console.log 'received task-freeplay'
      self.S('#exitbutton').hide()
      self.S('#donebutton').show()
    $(this).on 'task-notfreeplay', ->
      self.S('#donebutton').hide()
      self.S('#exitbutton').show()
    this.updateItems(true)
    getUsername (username) ->
      setSyncHandler "feeditems_#{username}", (change) ->
        self.updateItems()
      classmates <- getClassmates(username)
      for let classmate in classmates
        setSyncHandler "finisheditems_#{classmate}", (change) ->
          self.updateItems()
}
