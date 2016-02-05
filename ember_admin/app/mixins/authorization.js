import Ember from 'ember';

export default Ember.Mixin.create({
  sessionService: Ember.inject.service('session'),
  isAuthenticated: Ember.computed.alias('sessionService.isAuthenticated'),
  authToken: Ember.computed.alias('sessionService.authToken'),
  currentUser: Ember.computed.alias('sessionService.currentUser'),
  authenticatedRole: Ember.computed('authToken', function(){
    return Object.keys(jwt_decode(this.get('authToken')).pem)[0];
  }),

  activate: function(){
    this.authorizationSetup()
  },

  authorizationSetup: function(){
    this.controllerFor('Application').set('isAuthenticated', this.get('isAuthenticated'));
    this.controllerFor('Application').set('currentUser', this.get('currentUser'));
    this.controllerFor('Application').set('authenticatedRole', this.get('authenticRole'));
  },

  authorizationTeardown: function(){
    this.controllerFor('Application').set('isAuthenticated', false);
    this.controllerFor('Application').set('currentUser', null);
    this.controllerFor('Application').set('authenticatedRole', null);
  },

  destroySession: function(){
    this.authorizationTeardown();
    this.set('isAuthenticated', false);
    this.set('authToken', null);
    this.set('currentUser', null);
    this.set('authenticatedRole', null);
    this.setCookie('user.id', "")
    this.setCookie('token', "")
    this.transitionTo('login');
  },

  createSession: function(data){
    this.set('isAuthenticated', true);
    this.set('authToken', data.token);
    this.set('currentUser', this.store.find('user', data.user.id));
    this.setCookie('user.id', data.user.id)
    this.setCookie('token', data.token)
  },

  redirectUnauthenticated: function(route){
    if (!!(this.getCookie('token') && this.getCookie('user.id'))){
      this.set('isAuthenticated', true);
      this.set('authToken', this.getCookie('token'));
      this.set('currentUser', this.store.find('user', this.getCookie('user.id')));
    }
    if (!this.get('isAuthenticated')){
      return this.transitionTo(route);
    }
  },

  canAuthenticate: function(){
    return !!(this.getCookie('token') && this.getCookie('user.id')) || this.get('isAuthenticated');
  },

  setCookie: function(key, value) {
      var expires = new Date();
      expires.setTime(expires.getTime() + (1 * 24 * 60 * 60 * 1000));
      document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
  },

  getCookie: function(key) {
      var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
      return keyValue ? keyValue[2] : null;
  },

  actions:{
    logout: function(){
      this.destroySession();
    }
  }
});
