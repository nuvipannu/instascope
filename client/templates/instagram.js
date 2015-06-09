// Helper function to push photos to template scope
Template.instagram.helpers({
  photoset: function(){
    return Session.get('photoset');
  }
});
