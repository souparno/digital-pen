var gulp = require('gulp'),
    qunit = require('node-qunit-phantomjs'),
    jscs = require('gulp-jscs');

gulp.task('jscs', function () {
    jscs('blackboard.js');
});
gulp.task('test', function() {
    qunit('./test/index.html');
});
