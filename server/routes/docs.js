(function() {
  'use strict';
  var Document = require('../controllers/docs');

  module.exports = function(app, express) {
    var api = express.Router();

    //api.use(Users.getToken);
    api.post('/document', Document.create);
    api.get('/document', Document.getAllDocuments);
    api.get('/documentbyrole', Document.getAllDocumentsByRole);
    api.get('/documentbydate', Document.getAllDocumentsByDate);
    api.get('/documentbycategory', Document.getDocumenstByCategory);
    api.get('/document/:_id', Document.findOne);
    api.put('/document/:_id', Document.update);
    api.delete('/document/:_id', Document.delete);

    api.get('/users/:userId/documents', Document.getAllById);

    app.use('/api', api);
  };
})();
