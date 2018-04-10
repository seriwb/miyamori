'use strict';

/**
 * ユーザ情報
 */
export default class User {
  constructor(id, slack_id, name, department, email, use_email, send_to) {
    this.id = id;
    this.slack_id = slack_id;
    this.name = name;
    this.department = department;
    this.email = email;
    this.use_email = use_email;
    this.send_to = send_to;
  }
}