var gulp = require('gulp'),
    qunit = require('node-qunit-phantomjs');

gulp.task('test', function() {
    qunit('./test/index.html');
});
