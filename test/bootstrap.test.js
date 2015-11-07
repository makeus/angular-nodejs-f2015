var Sails = require('sails'),
  sails;

before(function(done) {
  this.timeout(5000);

  Sails.lift({
    bootstrap: function(cb) {
      cb();
    },
    log: {
      level: 'error'
    }
  }, function(err, server) {
    sails = server;
    if (err) return done(err);
    done(err, sails);
  });
});

after(function(done) {
  Sails.lower(done);
});
