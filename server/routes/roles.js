(function() {
  'use strict';

  var Roles = require('../controllers/roles');

  module.exports = function(app, express) {
    var api = express.Router();

    api.use(Roles.checkUserRole);
    api.post('/roles', Roles.create);
    api.get('/roles', Roles.getAllRoles);
    api.put('/roles/:id', Roles.update);
    api.delete('/roles', Roles.delete);

    app.use('/api', api);
  };
})();
