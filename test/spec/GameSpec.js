var moriartyGame = require('../../game/moriarty/game')
  , EventEmitter = require('events').EventEmitter
  , gameEvents = require('../../game/gameEvents');

var game, emitter = new EventEmitter();

describe('Battleship game', function () {

  beforeEach(function () {
    game = new moriartyGame(emitter, 'player1', 'player2');
  });

  it('doesn\'t allow to shoot if ships are not positioned', function(done) {

    //setup async with event emitter
    emitter.on('player1', function (event, result) {
      expect(event).toEqual(gameEvents.server.shotUpdate);
      expect(result.error).toBeTruthy();
      expect(result.error).toEqual('Place ships first!');
      done();
    });

    //run test
    game.shoot('player1', {x:0, y:5});
  });
});



