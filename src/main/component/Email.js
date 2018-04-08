'use strict';

import nodemailer from 'nodemailer';
import fs from 'fs';

/**
 * メール送信処理用クラス
 */
export default class Email {

  constructor(config) {
    this.config = config;

    // SMTPコネクションプールを作成
    let smtpConfig;
    if (this.config.email.smtp.auth.user !== null) {
      smtpConfig = {
        host: this.config.email.smtp.host,
        port: this.config.email.smtp.port,
        secure: this.config.email.smtp.ssl,
        auth: {
          user: this.config.email.smtp.auth.user,
          pass: this.config.email.smtp.auth.pass
        }
      };
    } else {
      smtpConfig = {
        host: this.config.email.smtp.host,
        port: this.config.email.smtp.port,
        secure: this.config.email.smtp.ssl
      };
    }
    this.transporter = nodemailer.createTransport(smtpConfig);
  }

  /**
   * メール送信処理を行う
   */
  send(user, kintai) {
    const emailTemplate = fs.readFileSync('./email_template.html', 'utf8');

    let mailBody = '' + emailTemplate
        .replace('{{ user.name }}', user.name)
        .replace('{{ user.department }}', user.department)
        .replace('{{ kintai.date }}', kintai.date)
        .replace('{{ kintai.time }}', kintai.time)
        .replace('{{ kintai.type }}', kintai.type)
        .replace('{{ kintai.reason }}', kintai.reason);

    const mailOptions = {
      //TODO:送り元を固定にするか、ユーザにするかは選択式
      from: `${user.name} <${user.email}>`,
      to: user.send_to,
      // TODO:件名作成はメソッド化して分離する
      subject: `【勤怠連絡】${kintai.date} ${user.name} ${kintai.type} ${kintai.time}`,
      html: mailBody
    };

    // メール送信
    this.transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        // console.log("Message sent: " + info.response);
      }
    });
  }
}
