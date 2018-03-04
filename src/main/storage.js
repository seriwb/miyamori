'use strict';

import simple_storage from 'botkit/lib/storage/simple_storage.js';
import Store from 'jfs';

export function kintai_storage(config) {

  if (!config) {
    config = {
      path: './',
    };
  }

  let storage = simple_storage(config);
  let kintai_db = new Store(config.path + '/kintai', {saveId: 'id'});

  let objectsToList = (cb) => {
    return (err, data) => {
      if (err) {
        cb(err, data);
      } else {
        cb(err, Object.keys(data).map((key) => data[key]));
      }
    };
  };

  storage.kintai = {
    get: (kintai_id, cb) => {
      kintai_db.get(kintai_id, cb);
    },
    save: (kintai_data, cb) => {
      kintai_db.save(kintai_data.id, kintai_data, cb);
    },
    delete: (kintai_id, cb) => {
      kintai_db.delete(kintai_id, cb);
    },
    all: (cb) => {
      kintai_db.all(objectsToList(cb));
    }
  };

  return storage;
}