Meteor.methods({
    getAccessToken: function(){
        try{
            return Meteor.user().profile.token;
        } catch (e){
            throw (e);
        }
    }
});


ServiceConfiguration.configurations.upsert(
  { service: "instagram" },
  {
    $set: {
      client_id: "5ddc29be3311448f8d73bc1fd83bdd52",
      secret: "d77c51b8c1ab40618b28b67bb89058cb",
      loginStyle: "popup",
      scope:"basic",
    }
  }
);