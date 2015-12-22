(function() {
  'use strict';
  var Document = require('../models/document'),
    Role = require('../models/role');

  module.exports = {
    create: function(req, res) {
      // get userid from the token
      var document = new Document({
        ownerId: req.decoded.id,
        title: req.body.title,
        content: req.body.content,
        createdAt: new Date()
      });

      console.log(document);
      // save the doc
      document.save(function(err, doc) {
        if (err) {
          res.status(500).send("err", err);
        } else {

          var role = new Role({
            userId: req.decoded.id,
            docId: doc._id,
            role: 'owner'
          });

          role.save(function(err, role) {
            if (err) {
              res.status(500).send({
                err
              });
            } else {
              console.log();
              res.status(201).send({
                message: 'Document and role added successfuly',
                doc: doc,
                role: role
              });
            }
          });
        }
      });
    },

    getAllDocuments: function(req, res) {
      Document.find(function(err, documents) {
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
