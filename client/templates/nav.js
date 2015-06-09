Template.nav.events({
  'change #searchByHashtag': function(event) {
    var hashtag = $(event.target).val();
    getNewPhotos({tagName: hashtag});
  },

  'click .search-switch': function() {
    $('.search-by-hashtag, .search-by-location').toggle();
  }
});
