'use strict';

import Botkit from 'botkit';
import config from 'config';

const DB_PATH = process.cwd() + "/miyamori.sqlite";

if (!config.client_id || !config.client_secret || !config.port) {
  console.error('Specify client_id client_secret and port in environment');
  process.exit(1);
}

const port = process.env.PORT || config.port;

const controller = Botkit.slackbot({
  debug: false,
  json_file_store: './data/', // TODO:Sqliteに変更する
}).configureSlackApp(
  {
    clientId: config.client_id,
    clientSecret: config.client_secret,
    redirectUri: config.redirect_uri,
    scopes: ['bot', 'commands']
  }
);

controller.setupWebserver(port, (err, webserver) => {
  if (err) {
    console.error(`Setup webserver failed: ${err}`);
    process.exit(1);
  }

//  controller.createWebhookEndpoints(webserver, config.verification_token);
  controller.createWebhookEndpoints(webserver);

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

controller.on('create_bot', (bot, config) => {

  if (_bots[bot.config.token]) {
    // already online! do nothing.
  } else {
    bot.startRTM(function(err) {
      if (!err) {
        trackBot(bot);
      }

      bot.startPrivateConversation({user: config.createdBy}, (err, convo) => {
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
controller.on('rtm_open', (bot) => {
  console.log('** The RTM api just connected!');
});

controller.on('rtm_close', (bot) => {
  console.log('** The RTM api just closed');
  // you may want to attempt to re-open
});

controller.spawn({
  token: config.token
}).startRTM();

require('./hears.js')(controller);
require('./contact')(controller);   // TODO:hearsを別にする