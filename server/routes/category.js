(function() {
  'use strict';

  var Category = require('../controllers/category');

  module.exports = function(app, express) {
    var api = express.Router();

    api.post('/category', Category.create);
    api.get('/category', Category.getAllCategories);
    api.put('/category/:id', Category.update);
    api.delete('/category/:id', Category.delete);
    app.use('/api', api);
  };
})();
