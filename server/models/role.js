(function() {
  'use strict';

  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;

  var RoleSchema = new Schema({
    title: {
      type: String,
      required: true,
      index: {
        unique: true
      },
      enum: ['admin', 'contributor', 'viewer', 'administrator']
    }
  });

  module.exports = mongoose.model('Role', RoleSchema);
})();
