(function() {
  'use strict';

  module.exports = function(app, express) {

    require('./users')(app, express);
    require('./docs')(app, express);
    require('./category')(app, express);
    require('./roles')(app, express);

    // home route
    app.get('/*', function(req, res) {
      res.send({
        message: 'No such api'
      });
    });
  };

})();
