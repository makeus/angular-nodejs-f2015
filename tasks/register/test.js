module.exports = function (grunt) {
    grunt.registerTask('test', [
        'concat:dep',
        'karma',
        'mochaTest'
    ]);
};
