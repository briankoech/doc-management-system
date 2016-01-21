(function() {
  'use strict';
  var Roles = require('../models/role');

  module.exports = {
    create: function(req, res) {
      var role = new Roles({
        title: req.body.title
      });

      role.save(function(err, role) {
        if (err) {
          res.status(500).send({
            error: err.errmsg
          });
        } else {
          res.status(201).send(role);
        }
      });
    },

    getRole: function(req) {
      // get the roleId from req.decoded
      Roles.findById(req.decoded.role, function(err, role) {
        if (err) {
          return 'error';
        } else if (role) {
          return role.title;
        } else {
          return 'no such role';
        }
      });
    },

    update: function(req, res) {
      Roles.findById(req.params.id, function(err, role) {
        if (err) {
          res.status(500).send({
            error: err
          });
        } else if (!role) {
          res.status(404).send({
            message: 'no such role'
          });
        } else {
          req.role = role;
          req.role.title = req.body.title;
          role.save(function(err, ok) {
            if (err) {
              res.status(500).send({
                error: err
              });
            } else if (ok) {
              res.status(200).send({
                message: 'update was successful'
              });
            }
          });
        }
      });
    },

    getAllRoles: function(req, res) {
      Roles.find({}, function(err, roles) {
        if (err) {
          res.status(500).send(err);
        } else if (!roles) {
          res.status(500).send({
            error: 'no roles found'
          });
        } else {
          res.status(200).send(roles);
        }
      });
    },

    delete: function(req, res) {
      Roles.remove({
        _id: req.params.id
      }, function(err, ok) {
        if (err) {
          res.status(500).send({
            error: err
          });
        } else {
          res.status(200).send({
            message: 'deleted successfully'
          });
        }
      });
    }
  };
})();
