module.exports = function(grunt) {

    grunt.config.set('mochaTest', {
      unit: {
        options: {
          reporter: 'spec',
          quiet: false,
          clearRequireCache: false
        },
        src: [
          'test/bootstrap.test.js',
          'test/unit/**/*.test.js',
          '!test/unit/clientside/**/*.test.js'
        ]
      }
    });

    grunt.loadNpmTasks('grunt-mocha-test');
};
