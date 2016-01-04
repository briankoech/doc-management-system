(function() {
  var Roles = require('../controllers/roles');

  module.exports = function(app, express) {
    var api = express.Router();

    api.post('/roles', Roles.create);
    api.get('/roles', Roles.getAllRoles);

    app.use('/api', api);
  };
})();
