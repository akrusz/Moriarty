var _ = require('lodash')
  , messageHelper = require('./messageHelper')
  , validator = require('./Validator');

var Lobby = function () {
  var users = [];
  var games = [];
  var invitations = [];

  function LobbyUser(username) {
    this.username = username;
    this.isInGame = false;
  }

  function LobbyGame(username) {
    this.creatorId = username;
    this.users = [new LobbyUser(username)];
    this.isStarted = false;
  }

  function getLobbyState() {
    return {users: users, games: games, invitations: invitations};
  };

  function findGame(id) {
    return _.find(games, {creatorId: id});
  }

  function findUser(id) {
    return _.find(users, {id: id});
  }

  function findUsers(ids) {
    return ids.map(function(id) {return _.find(users, {id: id})});
  }

  this.getLobbyState = function () {
    return getLobbyState();
  };

  this.enterLobby = function (username, wasPlaying, create) {
    if (!username) {
      return messageHelper.toResult(new Error('User name is empty.'));
    }

    var validationError = validator.validateUserId(username);
    username = username.trim();
    if(validationError) {
      return messageHelper.toResult(new Error(validationError));
    }

    var storedUser = _.find(users, {id: username});
    if (!wasPlaying) {
      if (storedUser) { // username already exists
        return messageHelper.toResult(new Error('The username already exists.'));
      }

      // join lobby
      var user = new LobbyUser(username);
      users.push(user);

      if(create){
        // create game
        var game = new LobbyGame(username);
        games.push(game);
      }
      return messageHelper.toResult({user: user});
    }
    else {
      storedUser.isPlaying = false;
      return messageHelper.toResult({user: storedUser});
    }
  };

  this.leaveLobby = function (username, startsPlay) {
    if (!username) {
      return messageHelper.toResult(new Error('User name is empty.'));
    }

    var storedUser = findUser(username);
    if (!storedUser) {
      return messageHelper.toResult(new Error('User with the given ID doesn\'t exist.'));
    }

    // join lobby
    var user = {id: username};
    if (!startsPlay) {
      _.remove(users, user);
      _.remove(invitations, {from: username});
      _.remove(invitations, {to: username});
    }
    else {
      storedUser.isInRoom = true;
    }
    return messageHelper.OK();
  };

  this.joinGame = function (userId, invitingUserId) {
    var invitingUser = _.find(users, {id: invitingUserId});
    if (!invitingUser) { // user isn't in lobby
      return messageHelper.toResult(new Error('You\'re not in the lobby.'));
    }

    if (userId === invitingUserId) { // self invitation
      return messageHelper.toResult(new Error('You can\'t invite yourself!'));
    }

    var user = _.find(users, {id: userId});
    if (!user) {
      return messageHelper.toResult(new Error('User not found in lobby!'));
    }

    var invitation = {from: invitingUserId, to: userId};
    if (_.find(invitations, invitation)) {
      return messageHelper.toResult(new Error('The user has already an invitation from you.'));
    }

    invitations.push(invitation);
    return messageHelper.toResult({invitation: invitation});
  }

  this.acceptInvitation = function (accepted, invitation) {
    if (accepted) {
      if (!_.find(invitations, invitation)) {
        return messageHelper.toResult(new Error('You\'re not invited by this user!'));
      }

      _.find(users, {id: invitation.from}).isInRoom = true;
      _.find(users, {id: invitation.to}).isInRoom = true;
      _.remove(invitations, invitation);
    }
    return messageHelper.toResult({accepted: accepted, invitation: invitation});
  }
};

module.exports = Lobby;
