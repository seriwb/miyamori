'use strict';

module.exports = (controller) => {
  controller.hears('みゃーもり','direct_message', (bot, message) => {
    bot.reply(message,'はいは〜い、宮森ですよー');
  });

  controller.hears(['hello', 'hi', 'お疲れ', 'おつかれ'], 'direct_message,direct_mention,mention', (bot, message) => {

    // bot.api.reactions.add({
    //   timestamp: message.ts,
    //   channel: message.channel,
    //   name: 'robot_face',
    // }, (err, res) => {
    //   if (err) {
    //     bot.botkit.log('Failed to add emoji reaction :(', err);
    //   }
    // });

    bot.api.users.info({user: message.user}, (error, response) => {
      let { name, real_name } = response.user;
      let { display_name } = response.user.profile;

      if (display_name) {
        bot.reply(message, `お疲れ様です！${display_name}さん`);
      } else {
        bot.reply(message, 'はい！勤怠管理の宮森です');
      }
    });
  });
};