
module.exports = {
    getMetadataFromFilename: function(filename) {
        var fs = require('fs');
        var Promise = require("bluebird");
        var mm = Promise.promisify(require('musicmetadata'));

        return mm(fs.createReadStream(filename)).then(function(metadata) {
            console.log(metadata);
            return metadata;
        });
    }
};
