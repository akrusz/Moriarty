var React = require('react/addons')
  , Reflux = require('reflux')
  , _ = require('lodash')
  , Actions = require('./../actions')
  , LobbyStore = require('./../stores/LobbyStore');

var Lobby = React.createClass({
  mixins: [Reflux.ListenerMixin],

  getInitialState() {
    return {
      userId: null,
      users: []
    }
  },

  componentDidMount() {
    this.listenTo(LobbyStore, this.updateLobby);

    this.updateLobby(LobbyStore.state);
  },

  updateLobby(update) {
    this.setState(update);
  },

  handleJoinClick(user) {
    var {state} = this;
    if (user.hasInvited) {
      Actions.init.acceptInvitation(true, state.userId, user.id);
    }
    else {
      Actions.init.joinGame(user.id);
    }
  },

  render() {
    var {state} = this, items = [];
    state.users.forEach((user) => {
      if (user.id != state.userId) {
        items.push(<GameItem key={user.id} onJoinClick={this.handleJoinClick.bind(this, user)} user={user}/>);
      }
    });
    return (
      <div className="lobby">
      {items.length > 0 ?
        <div>
          <div className="header">
            <p>Select an open game, or create your own!</p>
          </div>

          <div className="content">
            <div className="header">Open games:</div>
            <div className="user-list">
              <ul className="user-list-scroll">
          {items}
              </ul>
            </div>
          </div>
        </div>
        :
        <div className="no-games">
          <p>There are currently no open games in the lobby.</p>
          <p>Please wait or create a new one!</p>
        </div>
        }
      </div>
    );
  }
});


var GameItem = React.createClass({
  render() {
    var {props} = this;

    var getCaption = () => {
      if (props.user.isPlaying) {
        return 'Is playing..';
      }
      else {
        if (props.user.hasInvited) {
          return 'Accept invitation';
        }
        else if (props.user.gotInvitation) {
          return 'Invitation sent';
        }
        else {
          return 'Invite';
        }
      }
    };

    var itemClasses = React.addons.classSet({
      'user-item': true,
      'playing': props.user.isPlaying
    });

    var btnDisabled = props.user.gotInvitation || props.user.isPlaying;
    return (
      <li className={itemClasses}>
        <div className="user-name">{props.user.id}</div>
        <div className="user-invitation">
          <button className="btn btn-primary" onClick={props.onJoinClick} disabled={btnDisabled}>
            {getCaption()}
          </button>
        </div>
      </li>
    );
  }
});

module.exports = Lobby;
