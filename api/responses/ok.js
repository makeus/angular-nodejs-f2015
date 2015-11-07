/**
 * 200 (OK) Response
 */

module.exports = function sendOK (data, options) {
  var res = this.res;
  var req = this.req;
  var sails = req._sails;

  sails.log.silly('res.ok() :: Sending 200 ("OK") response');

  res.status(200);
  if(!data) {
    data = {};
  }

  return res.jsonx(data);
};
