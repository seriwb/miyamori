'use strict';

const sqlite3 = require('sqlite3').verbose();
const DB_PATH = process.cwd() + "/miyamori.sqlite";

export default class Db {

  constructor(config) {
    this.db = new sqlite3.Database(DB_PATH);
    this.config = config;
  }

  init() {
    this.db.serialize(() => {
      // ユーザ情報
      this.db.run(
        "CREATE TABLE IF NOT EXISTS user(" +
        "id INTEGER, " +          // User Id
        "name TEXT, " +           //
        "department TEXT, " +     // 所属
        "email TEXT, " +          // 自分のメールアドレス
        "use_email, INTEGER DEFAULT 0, " + // メール送信するかどうか(0:しない、1:する)
        "send_to TEXT, " +        // 送信先
        "create_date DATE, " +    // 登録日
        "update_date DATE, " +    // 更新日
        "PRIMARY KEY id)"
      );

      // 勤怠情報
      this.db.run(
        "CREATE TABLE IF NOT EXISTS kintai(" +
        "id INTEGER, " +          // Id
        "user_id INTEGER, " +     // ユーザID
        "date TEXT, " +           // 日付(YYYY/MM/DD)
        "time TEXT, " +           // 時刻(HH:mm)
        "num INTEGER, " +         // 報告回数
        "type TEXT, " +           // 勤怠分類
        "reason TEXT, " +         // 理由
        "create_date DATE, " +    // 登録日
        "update_date DATE, " +    // 更新日
        "PRIMARY KEY id)"
      );
      this.db.run(
        "CREATE INDEX IF NOT EXISTS kintai_idx_01 ON kintai(user_id)"
      );
      this.db.run(
        "CREATE INDEX IF NOT EXISTS kintai_idx_02 ON kintai(date)"
      );

      // チャンネル情報
      this.db.run(
        "CREATE TABLE IF NOT EXISTS channel(" +
        "id INTEGER, " +          // Id
        "name TEXT, " +           // チャンネル名（#なし）
        "time TEXT, " +           // 通知時刻(HH:mm)
        "interval TEXT, " +       // 繰り返し方法（everyday, weekday）
        "mention TEXT, " +        // メンション利用（none, here, channel）
        "create_date DATE, " +    // 登録日
        "update_date DATE, " +    // 更新日
        "PRIMARY KEY (id, name))"
      );
      // TODO:チャンネル名が変わっていて通知できなかった場合は、当該レコードを削除する

      // 通知対象ユーザ
      this.db.run(
        "CREATE TABLE IF NOT EXISTS channel_users(" +
        "cannel_id INTEGER, " +   // チャンネルId
        "user_id INTEGER, " +     // ユーザID
        "PRIMARY KEY (channel_id, user_id))"
      )
    });
  }

  use(arrow) {
    this.db.serialize(arrow);
  }

}
