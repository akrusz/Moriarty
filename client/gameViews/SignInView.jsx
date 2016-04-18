var React = require('react')
  , Actions = require('../actions')
  , phase = require('../gamePhase');

var SignInView = React.createClass({

  createGame(e) {
    e.preventDefault();
    var userName = this.refs.userName.getDOMNode().value;
    if (userName) {
      Actions.init.signIn(userName);
    }
  },

  joinGame(e) {
    e.preventDefault();
    var userName = this.refs.userName.getDOMNode().value;
    if (userName) {
      Actions.init.signIn(userName);
    }
  },

  render() {
    return (
      <div className="sign-in">
        <form>
          <div>
            <label className="sr-only" htmlFor="user-name">User name</label>
            <input type='text' name='user-name' ref='userName' placeholder='User name' autoFocus='autofocus' />
          </div>
          <div>
            <button onClick={this.joinGame} className="btn btn-primary">Join Game</button>
            <button onClick={this.createGame} className="btn btn-primary">Create Game</button>
          </div>
        </form>
      </div>);
  }
});

module.exports = SignInView;
