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
    }
  };
})();
