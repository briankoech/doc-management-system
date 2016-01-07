(function() {
  'use strict';
  var Users = require('../controllers/users');

  module.exports = function(app, express) {
    var api = express.Router();

    api.post('/users', Users.create); // close sign-up

    api.post('/users/login', Users.login); // close sign in

    api.use(Users.getToken); // Middleware to allow one to continue

    api.get('/users/token', Users.getToken);

    api.get('/users/:userId', Users.find); // Find a user before RUD

    api.get('/users', Users.getAllUsers);

    api.route('/users/:userId')
      .get(Users.findOne)
      .put(Users.update)
      .delete(Users.delete);

    app.use('/api', api);
  };

})();
