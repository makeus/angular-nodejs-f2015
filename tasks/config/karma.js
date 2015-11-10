module.exports = function(grunt) {

    grunt.config.set('karma', {
        options: {
            files: [
              'test/testSetup.js',
              '.tmp/public/concat/depProduction.js',
              'assets/dependencies/angular-mocks/angular-mocks.js',
              'assets/js/**/*.js'
            ],
            frameworks: ['jasmine'],
            browsers: ['PhantomJS'],
            preprocessors: {
              'assets/js/**/*.js': 'coverage'
            },
            reporters: 'coverage',
            coverageReporter: {
              subdir: '/',
              dir : 'coverage/'
            },
            singleRun: true
        },
        unit: {
            files: [
                { src: ['test/unit/clientside/**/*.test.js'] }
            ]
        }
    });

    grunt.loadNpmTasks('grunt-karma');
};
