'use strict';

import { formatDate } from './util';

module.exports = (controller) => {
  controller.hears(['kintai', '勤怠', 'きんたい'], ['direct_message', 'direct_mention'], (bot, message) => {

    let datetime = formatDate(new Date(), 'YYYYMMDD-hh:mm:ss');

    bot.reply(message, {
      "text": "勤怠ですね",
      "attachments": [
        {
          "text": "今日はどうされましたか？",
          "fallback": "大丈夫・・・ですか？お待ちしてますね！",
          "callback_id": `contact_kintai-${message.user}-${datetime}`,
          "color": "#0079e3",
          "attachment_type": "default",
          "actions": [
            {
              "name": "absence",
              "text": "休み",
              "type": "button",
              "value": "休み"
            },
            {
              "name": "late",
              "text": "遅刻",
              "type": "button",
              "value": "遅刻"
            },
            {
              "name": "early",
              "text": "早出",
              "type": "button",
              "value": "早出"
            },
            {
              "name": "tyokushutsu",
              "text": "直出",
              "type": "button",
              "value": "直出"
            },
            {
              "name": "tyokki",
              "text": "直帰",
              "type": "button",
              "value": "直帰"
            },
            {
              "name": "leave",
              "text": "早退",
              "type": "button",
              "value": "早退"
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
          }
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