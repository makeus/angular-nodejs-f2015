module.exports = function (grunt) {
    grunt.registerTask('test', [
        'compileAssets',
        'concat:dep',
        'karma',
        'mochaTest'
    ]);
};
