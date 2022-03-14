import { App, LogLevel } from '@slack/bolt';

import { hears } from './hears';

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  logLevel: LogLevel.DEBUG,
});

// hears(app);

app.message(/^(miyamori|宮森|みやもり)$/, async ({ message, say }) => {
  if (message.channel_type == 'im') {
    await say({
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'はい！なんでしょうか？',
          },
        },
      ],
      text: `'はい！なんでしょうか？'`,
    });
  }
});

app.message('みゃーもり', async ({ message, say }) => {
  await say({
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: 'はいは〜い、宮森ですよー\nどうしました？',
        }
      },
    ],
    text: 'はいは〜い、宮森ですよー\nどうしました？',
  });
});

// Listens to incoming messages that contain "hello"
app.message('hello', async ({ message, say }) => {
  // Filter out message events with subtypes (see https://api.slack.com/events/message)
  // Is there a way to do this in listener middleware with current type system?
  // if (!isGenericMessageEvent(message)) return;

  // say() sends a message to the channel where the event was triggered
  await say({
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `Hey there <@${message.user}>!`,
        },
        accessory: {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'Click Me',
          },
          action_id: 'button_click',
        },
      },
    ],
    text: `Hey there <@${message.user}>!`,
  });
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();

// bot.startRTM(function(err) {
//   if (!err) {
//     trackBot(bot);
//   }

//   bot.startPrivateConversation({user: conf.createdBy}, (err, convo) => {
//     if (err) {
//       console.log(err);
//     } else {
//       // TODO:開発中はコメントアウト
//       convo.say('勤怠管理の宮森です！\n' +
//         '/invite で招待いただければ、勤怠連絡させていただきます！');
//     }
//   });
// });
