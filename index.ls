# addThumbnail = (word) ->
#   new_item = $("<word-thumbnail word='#{word}'>")
#   new_item.click ->
#     $('#thumbnails').hide()
#     $('#focusitem').html('')
#     focus_item = $("<practice-word word='#{word}'>")
#     $(focus_item).on 'task-finished', ->
#       $('#focusitem').html('')
#       $('#thumbnails').show()
#     focus_item.appendTo '#focusitem'
#   new_item.appendTo '#thumbnails'

# window.addEventListener 'WebComponentsReady', (e) ->
#   # imports are loaded and elements have been registered
#   # console.log('Components are ready');
#   # $('#foo').append($('<my-counter >'))
#   # $('#foo').append($('<my-counter>'))
#   # $('#foo').append($('<name-tag>'))
#   # $('#foo').append($('<editable-name-tag>'))
#   #$('latin-keyboard').
#   /*
#   $('#speechrecognition')[0].onresults = (candidates) ->
#     console.log candidates
#     $('#searchresults').html('')
#     for x in candidates
#       #$('<search-result-item query="' + x + '"></search-result-item>').appendTo('#searchresults')
#       $('<search-result-item>').prop('query', x).appendTo('#searchresults')
#   */
#   for word in ['cat', 'dog', 'white', 'black', 'bee']
#     addThumbnail word
