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
      Actions.init.signInCreate(userName);
    }
  },

  render() {
    return (
      <div className="sign-in">
        <form>
          <div>
            <label className="sr-only" htmlFor="user-name">User name</label>
            <input type='text' name='user-name' ref='userName' placeholder='User Name' autoFocus='autofocus' />
          </div>
          <div>
            <button onClick={this.joinGame} className="btn btn-primary enter-buttom">Join</button>
            <button onClick={this.createGame} className="btn btn-primary enter-buttom">Create</button>
          </div>
        </form>
      </div>);
  }
});

module.exports = SignInView;
