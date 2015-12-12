(function() {
  'use strict';
  var Document = require('../models/document');

  module.exports = {
    create: function(req, res) {
      // get userid from the token
      var document = new Document({
        ownerId: req.body.ownerId,
        title: req.body.title,
        content: req.body.content,
        createdAt: new Date()
      });

      // save the doc
      document.save(function(err) {
        if (err) {
          res.status(500).send("err", err);
        } else {
          res.status(201).send({
            message: "doc created successfuly"
          });
        }
      });
    },

    all: function(req, res) {
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
        ownerId: req.params.id
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
