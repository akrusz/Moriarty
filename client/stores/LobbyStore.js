var Reflux = require('reflux')
  , socket = require('../socket')
  , Actions = require('../actions')
  , _ = require('lodash')
  , gameEvents = require('../../game/gameEvents')
  , phase = require('../gamePhase')
  , GamePhaseStore = require('./GamePhaseStore')
  , AppStore = require('./UserStore');

var LobbyStore = Reflux.createStore({

  setInitialState() {
    this.state = {
      userId: null,
      users: [],
      games: []
    }
  },

  resetOnSignIn(game) {
    if (game.phase == phase.signIn) {
      this.setInitialState();
    }
  },

  setUser (appState) {
    this.state.userId = appState.userId;
  },

  init() {
    this.setInitialState();
    this.listenTo(GamePhaseStore, this.resetOnSignIn);
    this.listenTo(AppStore, this.setUser);

    socket.on(gameEvents.server.lobbyUpdate, (update) => {
      var {state} = this;
      // update users
      update.users.forEach((user) => {
        user.hasInvited = !!_.find(update.invitations, {from: user.id, to: state.userId});
        user.gotInvitation = !!_.find(update.invitations, {to: user.id, from: state.userId});
      });

      state.users = update.users;

      // update games
      update.games.forEach((game) => {
        game.creatorId = !!_.find(update.users, {from: game.creatorId, to: state.creatorId});
        game.users= !!_.find(update.invitations, {to: game.users, from: state.users});
      });

      state.games = update.games;
      this.trigger(state);
    });

    socket.on(gameEvents.server.invitationForward, (data) => {
      var {state} = this;
      var invitingUser = _.find(state.users, {id: data.invitation.from});
      invitingUser.hasInvited = true;
      this.trigger(state);
    });

    socket.on(gameEvents.server.invitationRequestStatus, (status) => {
      if (status.isSuccessful) {
        var {state} = this;
        var invitedUser = _.find(state.users, {id: status.invitation.to});
        invitedUser.gotInvitation = true;
        this.trigger(state);
      }
    });
  }
});

module.exports = LobbyStore;
