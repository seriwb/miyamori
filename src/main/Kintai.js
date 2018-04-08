'use strict';

/**
 * 勤怠情報
 */
export default class Kintai {
  constructor(id, user_id, date, time, num, type, reason) {
    this.id = id;
    this.user_id = user_id;
    this.date = date;
    this.time = time;
    this.num = num;
    this.type = type;
    this.reason = reason;
  }
}