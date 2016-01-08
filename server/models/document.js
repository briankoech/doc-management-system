(function() {
  'use strict';
  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;
  require('./user');

  var DocumentSchema = new Schema({
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    accessLevel: {
      type: Number,
      enum: [1, 2, 3],
      default: 1
    },

    editors: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false
    }],

    title: {
      type: String,
      required: true
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },

    content: {
      type: String,
      required: true
    },

    createdAt: {
      type: Date
    },

    modifiedAt: {
      type: Date,
      Default: Date.now
    }
  });

  module.exports = mongoose.model('Document', DocumentSchema);
})();
