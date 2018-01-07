'use strict';

module.exports = (controller) => {
  controller.hears(['kintai', '勤怠', 'きんたい'], ['direct_message', 'direct_mention'], (bot, message) => {

    bot.reply(message, {
      "text": "勤怠ですね",
      "attachments": [
        {
          "text": "今日はどうされましたか？",
          "fallback": "大丈夫・・・ですか？お待ちしてますね！",
          "callback_id": `contact_kintai-${message.user.id}`,
          "color": "#3AA3E3",
          "attachment_type": "default",
          "actions": [
            {
              "name": "kintai",
              "text": "休み",
              "type": "button",
              "value": "absence"
            },
            {
              "name": "kintai",
              "text": "遅刻",
              "type": "button",
              "value": "late"
            },
            {
              "name": "kintai",
              "text": "早出",
              "type": "button",
              "value": "early"
            },
            {
              "name": "kintai",
              "text": "直出",
              "type": "button",
              "value": "tyokushutsu"
            },
            {
              "name": "kintai",
              "text": "直帰",
              "type": "button",
              "value": "tyokki"
            },
            {
              "name": "kintai",
              "text": "早退",
              "type": "button",
              "value": "leave"
            }
          ]
        }
      ]
    }, (err, resp) => {
      if (err) {
        console.log(err, resp);
      }
    });
  });


  // TODO:サンプル
  controller.on('interactive_message_callback', (bot, message) => {

    const ids = message.callback_id.split(/\-/);
    const item_id = ids[0];
    const user_id = ids[1];

    if (item_id === 'contact_kintai') {
      bot.replyInteractive(message, {
        "text": `${user_id}さんは${message.actions[0].value}ですね、了解です！`
      });
    }

    // controller.storage.users.get(user_id, (err, user) => {
    //
    //   if (!user) {
    //     user = {
    //       id: user_id,
    //       list: []
    //     }
    //   }
    //
    //   for (let x = 0; x < user.list.length; x++) {
    //     if (user.list[x].id === item_id) {
    //       if (message.actions[0].value === 'flag') {
    //         user.list[x].flagged = !user.list[x].flagged;
    //       }
    //       if (message.actions[0].value === 'delete') {
    //         user.list.splice(x,1);
    //       }
    //     }
    //   }
    //
    //
    //   var reply = {
    //     text: 'Here is <@' + user_id + '>s list:',
    //     attachments: [],
    //   };
    //
    //   for (var x = 0; x < user.list.length; x++) {
    //     reply.attachments.push({
    //       title: user.list[x].text + (user.list[x].flagged? ' *FLAGGED*' : ''),
    //       callback_id: user_id + '-' + user.list[x].id,
    //       attachment_type: 'default',
    //       actions: [
    //         {
    //           "name":"flag",
    //           "text": ":waving_black_flag: Flag",
    //           "value": "flag",
    //           "type": "button",
    //         },
    //         {
    //           "text": "Delete",
    //           "name": "delete",
    //           "value": "delete",
    //           "style": "danger",
    //           "type": "button",
    //           "confirm": {
    //             "title": "Are you sure?",
    //             "text": "This will do something!",
    //             "ok_text": "Yes",
    //             "dismiss_text": "No"
    //           }
    //         }
    //       ]
    //     })
    //   }
    //
    //   bot.replyInteractive(message, reply);
    //   controller.storage.users.save(user);
    // });

  });
};