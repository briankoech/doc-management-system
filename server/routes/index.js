(function() {
  'use strict';

  module.exports = function(app, express) {

    require('./users')(app, express);
    require('./roles')(app, express);
    require('./docs')(app, express);

    // home route
    app.get('/*', function(req, res) {
      res.send({
        message: 'core edge is a tech genius'
      });
    });
  };

})();
