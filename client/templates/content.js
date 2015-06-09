// Event Handlers for click and mouseover events
Template.content.events({
  'click .photo': function(event){
    $(event.target).addClass('greyed');
    if (Session.equals('zoomed', '')) {
      $('<input type="submit" value="close" class="close">').appendTo('#zoomed-image');
      $('<img src='+this.images.standard_resolution.url+' alt="">').appendTo('#zoomed-image');
      Session.set('zoomed', 'zoomed');
    }
    $('#zoomed-image').toggle('');
  },
  'click .popupPhoto': function(event){
    $('.photo').toggleClass('greyed');
    if (Session.equals('zoomed', '')) {
      $('#zoomed-image').toggle('');
      $('<img src='+event.target.src+' alt="">').appendTo('#zoomed-image');
      $('<input type="submit" value="close" class="close">').appendTo('#zoomed-image');
      Session.set('zoomed', 'zoomed');
    } else {
      $('#zoomed-image').hide();
      $('#zoomed-image').children().remove();
      Session.set('zoomed', '');
    }
  },
  'click #zoomed-image': function(event){
      $(event.currentTarget).hide();
      $(event.currentTarget).children().remove();
      Session.set('zoomed', '');
      $('.photo').removeClass('greyed');
  },
  'mouseenter .photodiv': function(event){
    $(event.target.children[0]).addClass('greyed');
    for (var i =1; i < event.target.children.length; i++){
      $(event.target.children[i]).show("easing");
    }
  },
  'mouseleave .photodiv': function(event){
    $(event.target.children[0]).toggleClass('greyed');
    for (var i =1; i < event.target.children.length; i++){
      $(event.target.children[i]).hide("easing");
    }
  }
});
