/**
 * 400 (Bad Request) Handler
 */

module.exports = function badRequest(data, options) {
  var req = this.req;
  var res = this.res;
  var sails = req._sails;

  sails.log.verbose('Sending 400 ("Bad Request") response: \n',data);

  res.status(500);

  if(typeof data === 'string') {
    data = {
      success: 0,
      status: 500,
      message: data
    };
  }

  return res.jsonx(data);
};

