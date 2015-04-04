var gulp = require('gulp');
var tasks = process.argv.slice(2);

require('./gulpfile');
gulp.start.apply(gulp, tasks);
