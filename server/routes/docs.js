(function() {
  'use strict';
  var Document = require('../controllers/docs');

  module.exports = function(app, express) {
    var api = express.Router();

    //api.use(Users.getToken);
    api.post('/document', Document.create);
    api.get('/document', Document.all);
    api.get('/document/:_id', Document.findOne);
    // .get(function(req, res) {
    //  res.send(req.body);
    // })
    api.put('document/:_id', Document.update);
    // .delete('/:_id', function(req, res) {

    // });

    api.get('/users/:userId/documents', Document.getAllById);
    app.use('/api', api);
  };
})();
