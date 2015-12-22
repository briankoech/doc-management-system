(function() {
'use strict';
var Roles = require('../models/Roles');

module.exports = {
  create: function(req, res) {
    var role = new Role({
      userId: req.body.userId,
      docId: req.body.docId,
      role: req.body.role
    });

    role.save(function(err, role) {
      if(err) {
        res.status(500).send({error: 'Could not create the role'});
      } else {
        res.status(201).send({message: 'role creates successfuly'});
      }
    });
  },

  update: function(req, res) {
    req.role.
  }
};
})();
