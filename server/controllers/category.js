(function() {
  'use strict';

  var Category = require('../models/category');
  module.exports = {
    create: function(req, res) {
      var category = new Category({
        category: req.body.category
      });

      category.save(function(err, category) {
        if (err) {
          res.status(500).send({
            error: err.message
          });
        } else {
          res.status(201).send({
            message: 'successfully created category',
            category: category
          });
        }
      });
    },

    getAllCategories: function(reqe, res) {
      Category.find({})
        .limit(10)
        .exec(function(err, categories) {
          if (err) {
            res.status(500).send({
              error: err.message
            });
          } else {
            res.status(200).send(categories);
          }
        });
    }
  };
})();
