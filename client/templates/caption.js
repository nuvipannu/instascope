Template.caption.helpers({
  timestamp: function() {
    t = moment(this.created_time * 1000).fromNow();
    console.log(t);
    return t;
  }
});
