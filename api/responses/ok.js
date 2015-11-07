/**
 * 200 (OK) Response
 */

module.exports = function sendOK (data, options) {
  var res = this.res;
  var sails = req._sails;

  sails.log.silly('res.ok() :: Sending 200 ("OK") response');

  res.status(200);

  return res.jsonx(data);
};
