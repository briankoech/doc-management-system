(function() {
  'use strict';

  var Category = require('../controllers/category');
  var Roles = require('../controllers/roles');

  module.exports = function(app, express) {
    var api = express.Router();

    api.post('/category', Category.create);
    api.get('/category', Category.getAllCategories);
    api.put('/category/:id', Roles.checkUserRole, Category.update);
    api.delete('/category/:id', Roles.checkUserRole, Category.delete);
    app.use('/api', api);
  };
})();
