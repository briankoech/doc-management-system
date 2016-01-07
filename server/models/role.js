(function() {
  'use strict';

  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;

  var RoleSchema = new Schema({
    title: {
      type: String,
      require: true,
      index: {
        unique: true
      },
      enum: ['admin', 'contributor', 'viewer']
    }
  });

  module.exports = mongoose.model('Role', RoleSchema);
})();
