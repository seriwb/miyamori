'use strict';

import Botkit from 'botkit';
import config from 'config';

const DB_PATH = process.cwd() + "/miyamori.sqlite";

const controller = Botkit.slackbot({
  debug: false
});

controller.spawn({
  token: config.token
}).startRTM();

require('./hears.js')(controller);
require('./contact')(controller);   // TODO:hearsを別にする