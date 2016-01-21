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

    update: function(req, res) {
      // get the category by id
      Category.findById(req.params.id, function(err, category) {
        if (err) {
          res.status(500).send({
            error: err
          });
        } else if (!category) {
          res.status(404).send({
            message: 'No such category'
          });
        } else {
          req.category = category;
          req.category.category = req.body.title;
          category.save(function(err, category) {
            if (err) {
              res.status(500).send({
                error: err
              });
            } else {
              res.status(200).send({
                message: 'update was successful',
                category: category
              });
            }
          });
        }
      });
    },

    getAllCategories: function(req, res) {
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
    },

    delete: function(req, res) {
      Category.remove({
        _id: req.params.id
      }, function(err, ok) {
        if (err) {
          res.status(500).send({
            error: err
          });
        } else {
          res.status(200).send({
            message: 'Deleted successfully'
          });
        }

      });
    }
  };
})();
