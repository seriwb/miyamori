'use strict';

module.exports = (controller) => {
  controller.on('slash_command', (bot, message) => {
    switch (message.command) {
      case '/kintai':
        // TODO:以下はサンプル
        let choices = message.text.split(',');
        let choice = choices[Math.random() * choices.length | 0];
        bot.replyPrivate(message, '<@' + message.user + '> *' + choice + '*');
        break;
      case '/oshiete':
        // TODO
        break;
    }
  });
};