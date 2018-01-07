'use strict';

var _botkit = require('botkit');

var _botkit2 = _interopRequireDefault(_botkit);

var _config = require('config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const DB_PATH = process.cwd() + "/miyamori.sqlite";

if (!_config2.default.client_id || !_config2.default.client_secret || !_config2.default.port) {
  console.error('Specify client_id client_secret and port in environment');
  process.exit(1);
}

const port = process.env.PORT || _config2.default.port;

const controller = _botkit2.default.slackbot({
  debug: false,
  json_file_store: './data/' // TODO:Sqliteに変更する
}).configureSlackApp({
  clientId: _config2.default.client_id,
  clientSecret: _config2.default.client_secret,
  redirectUri: _config2.default.redirect_uri,
  scopes: ['bot', 'commands']
});

controller.setupWebserver(port, (err, webserver) => {
  if (err) {
    console.error(`Setup webserver failed: ${err}`);
    process.exit(1);
  }

  //  controller.createWebhookEndpoints(webserver, config.verification_token);
<<<<<<< HEAD
  controller.createWebhookEndpoints(webserver);
=======
>>>>>>> 32bd1f4... update

  controller.createOauthEndpoints(webserver, (err, req, res) => {
    if (err) {
      console.error(err);
      res.status(500).send(err);
      return;
    }
    res.send('Success');
  });
});

let _bots = {};

function trackBot(bot) {
  _bots[bot.config.token] = bot;
}

controller.on('create_bot', (bot, conf) => {

  if (_bots[bot.config.token]) {
    // already online! do nothing.
  } else {
    bot.startRTM(function (err) {
      if (!err) {
        trackBot(bot);
      }

      bot.startPrivateConversation({ user: conf.createdBy }, (err, convo) => {
        if (err) {
          console.log(err);
        } else {
          convo.say('I am a bot that has just joined your team');
          convo.say('You must now /invite me to a channel so that I can be of use!');
        }
      });
    });
  }
});

// Handle events related to the websocket connection to Slack
controller.on('rtm_open', bot => {
  console.log('** The RTM api just connected!');
});

controller.on('rtm_close', bot => {
  console.log('** The RTM api just closed');
  // you may want to attempt to re-open
});

controller.on('slash_command', function (bot, message) {
  switch (message.command) {
    case '/kintai':
      var choices = message.text.split(',');
      var choice = choices[Math.random() * choices.length | 0];
      bot.replyPrivate(message, '<@' + message.user + '> *' + choice + '*');
      break;
  }
});

// controller.spawn({
//   token: config.token
// }).startRTM();

require('./hears.js')(controller);
require('./contact')(controller); // TODO:hearsを別にする