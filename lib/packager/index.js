var _        = require('lodash'),
    nconf    = require('nconf'),
    url      = require('url'),
    request  = require('request');

module.exports = function (app, authenticatedVarsMiddleware) {
  if (nconf.get('PACKAGER_URL')) {
    app.get(nconf.get('BASE_URL') + '/:repo/:branch/create-package', authenticatedVarsMiddleware, function(req, res) {
      if (req.query.clientId) {
        if (!res.locals.account) {
          return res.send(401, 'Unauthorized: You need to log in to be able to use a clientId');
        }

        var localClient = _.find(res.locals.account.clients, function(client) {
          return client.clientID === req.query.clientId;
        });

        if (!localClient) {
          return res.send(401, 'Unauthorized: You can\'t use a clientId that doesn\'t belong to you.');
        }
      }
      var pkg_url = url.resolve(nconf.get('PACKAGER_URL'), req.url.substr(nconf.get('BASE_URL').length));

      var pkg_req = request(pkg_url);

      pkg_req.pipe(res);

      pkg_req.on('error', function (err) {
            winston.error('error when fetching package', {
              error:  err.stack,
              url:    req.originalUrl,
              tenant: res.locals && res.locals.account && res.locals.account.tenant
            });
            res.send(500);
          });

      res.on('error', function (err) {
        winston.error('error when fetching package', {
          error:  err.stack,
          url:    req.originalUrl,
          tenant: res.locals && res.locals.account && res.locals.account.tenant
        });
      });

    });
  }

};
