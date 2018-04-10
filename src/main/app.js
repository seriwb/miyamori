'use strict';

import Botkit from 'botkit';
import config from 'config';
import { kintai_storage } from './storage';

if (!config.client_id || !config.client_secret || !config.port) {
  console.error('Specify client_id client_secret and port in environment');
  process.exit(1);
}

// Herokuのための設定
const port = process.env.PORT || config.port;

const controller = Botkit.slackbot({
  debug: false,
  storage: kintai_storage({path: './data/'}),
  // json_file_store: './data/', // TODO:Sqliteに変更する
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

controller.on('create_bot', (bot, conf) => {

  if (_bots[bot.config.token]) {
    // already online! do nothing.
  } else {
    bot.startRTM(function(err) {
      if (!err) {
        trackBot(bot);
      }

      bot.startPrivateConversation({user: conf.createdBy}, (err, convo) => {
        if (err) {
          console.log(err);
        } else {
          // TODO:開発中はコメントアウト
          convo.say('勤怠管理の宮森です！\n' +
            '/invite で招待いただければ、勤怠連絡させていただきます！');
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

require('./slash_command')(controller);
require('./hears')(controller);
require('./contact')(controller);   // TODO:hearsを別にする