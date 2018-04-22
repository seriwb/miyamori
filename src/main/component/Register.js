'use strict';

// TODO:ラムダを別に切り出す
function response(bot, message) {

  bot.reply(message, {
    "text": "XXXXXXXさんのことを教えてください",
    "attachments": [
      {
        "text": "名前はどう表記しましょうか？",
        "fallback": "すみません！もう一度お願いします！",
        "callback_id": `register_user-${message.user}`,
        "color": "#0079e3",
        "attachment_type": "default",
        "actions": []
      }
    ]
  }, (err, resp) => {
    if (err) {
      console.log(err, resp);
    }
  });
}

module.exports = (controller) => {
  controller.hears(
    ['register', '登録'],
    ['direct_message', 'direct_mention'],
    response(bot, message));
  };

  controller.on('interactive_message_callback', (bot, message) => {

    const ids = message.callback_id.split(/\-/);
    const item_id = ids[0];

    if (item_id === 'contact_kintai') {
      const user_id = ids[1];
      const date = ids[2];
      const time = ids[3];

      const kintai_id = date;
      // TODO:users利用はサンプル
      controller.storage.kintai.get(kintai_id, (err, kintai) => {

        if (!kintai) {
          kintai = {
            id: kintai_id,
            list: []
          };
        }

        bot.api.users.info({user: message.user}, (error, response) => {
          let {display_name} = response.user.profile;

          bot.replyInteractive(message, {
            "text": `${display_name}さんは${message.actions[0].value}ですね、了解です！`
          });
        });

        controller.storage.kintai.save(kintai);
      });
    }
  });
};