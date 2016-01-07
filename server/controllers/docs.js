(function() {
  'use strict';
  var Document = require('../models/document'),
    Role = require('../models/role'),
    Category = require('../models/category'),
    users = require('./users');


  module.exports = {
    create: function(req, res) {

      var docsave = function(categoryId) {
        var document = new Document({
          ownerId: req.decoded._id,
          title: req.body.title,
          category: categoryId,
          content: req.body.content,
          createdAt: new Date()
        });

        document.save(function(err, doc) {
          if (err) {
            res.status(500).send({
              error: err.message,
              errr: 'this one'
            });
          } else {
            res.status(201).send({
              message: 'Document created successfuly',
              doc: doc.title
            });
          }
        });
      };
      // get userid from the token
      Role.findById(req.decoded.role, function(err, role) {
        if (err) {
          res.status(500).send({
            error: err
          });
        } else if (!role) {
          res.status(404).send({
            error: 'no such role found',
            role: req.decoded.role
          });
        } else {
          if (role.title === 'viewer') {
            res.status(401).send({
              error: 'You are not authorised to create document'
            });
          } else {
            // check if category exists
            Category.findOne({
              'category': req.body.category
            }, function(err, result) {
              console.log(result);
              if (err) {
                res.status(500).send({
                  error: 'Server error. Couldn\'t confirm category'
                });
              } else if (!result) {
                var category = new Category({
                  category: req.body.category
                });

                category.save(function(err, cat) {
                  if (err) {
                    console.log(cat);
                    res.status(500).send({
                      error: err,
                      err: 'another new one',
                      cat: cat
                    });
                  } else {
                    // go to doc saving
                    docsave(cat._id);
                  }
                });
              } else {
                // go to doc saving
                docsave(result._id);
              }
            });
          }
        }
      });
    },

    getAllDocuments: function(req, res) {
      Document.find({})
        .limit(10)
        .exec(function(err, documents) {
          if (err) {
            res.status(500).send(err);
          } else {
            res.json(documents);
          }
        });
    },

    findOne: function(req, res) {
      console.log("THis has been called");
      Document.findById(req.params._id, function(err, document) {
        if (err) {
          console.log("Sjitnkjns");
          res.status(500).send(err);
        } else if (document) {
          console.log("Sjitnkjns");
          res.status(200).send(document);
        } else {
          res.status(500).send({
            message: "document isnt available"
          });
        }
      });
    },

    update: function(req, res) {
      req.document.ownerId = req.body.ownerId;
      req.document.title = req.body.title;
      req.document.content = req.body.content;
      req.document.updatedAt = req.body.updatedAt;
      req.document.save();
      res.send(req.document);
    },

    getAllById: function(req, res) {
      // get the user id
      // get all docs accessible to the user
      //var userId = req.param.userId;
      Document.find({
        ownerId: req.decoded.id
      }, function(err, documents) {
        if (err) {
          return res.status(500).send(err);
        } else if (documents) {
          return res.status(200).send(documents);
        } else {
          return res.send({
            message: "No documents found"
          });
        }
      });

    }
  };

})();
