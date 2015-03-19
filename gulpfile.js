'use strict';

var path = require('path');
var Promise = require('es6-promise').Promise;
var gulp = require('gulp');
var del = require('del');
var es = require('event-stream');
var insert = require('gulp-insert');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var changed = require('gulp-changed');
var watch = require('gulp-watch');
var babel = require('gulp-babel');
var babelify = require('babelify');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var livereload = require('gulp-livereload');
var nodemon = require('gulp-nodemon');
var browserify = require('browserify');
var watchify = require('watchify');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');

var getBundleName = function() {
    var version = require('./package.json').version;
    var name = require('./package.json').name;
    return version + '.' + name + '.' + 'min';
};

var paths = {
    js: ['src/server/**/*.js'],
    asset: ['src/**/*.*', '!src/**/*.js'],
};

function bundle(bundler) {
    return bundler.bundle()
        // log errors if they happen
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('minode.js'))
        // optional, remove if you dont want sourcemaps
        .pipe(buffer())
        .pipe(sourcemaps.init({
            loadMaps: true
        })) // loads map from browserify file
        .pipe(sourcemaps.write('./')) // writes .map file
        //
        .pipe(gulp.dest('./build/web'));
}

gulp.task('clean', function(cb) {
    del.sync('build', {
        force: true
    }, cb);
});

gulp.task('transpile', function() {
    function transpile(strm) {}

    return gulp.src(paths.js, {
            base: 'src'
        })
        .pipe(changed('build'))
        .pipe(sourcemaps.init())
        .pipe(insert.prepend('\'use strict\';'))
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(babel())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build'))
        .pipe(livereload());
});

gulp.task('copy', function() {
    return gulp.src(paths.asset, {
            base: 'src'
        })
        .pipe(changed('build'))
        .pipe(gulp.dest('build'))
        .pipe(livereload());
});

gulp.task('bundle', function() {
    var bundler = watchify(browserify('./src/web/index.js', watchify.args));

    // add any other browserify options or transforms here
    bundler
    //.transform('brfs')
        .transform('babelify');

    bundler.on('update', function() {
        bundle(bundler);
    });
    bundler.on('bytes', function() {
        livereload.reload();
    });
    bundler.on('log', gutil.log); // output build logs to terminal
    bundler.on('error', gutil.log); // output build logs to terminal

    bundle(bundler);
});

gulp.task('test', ['transpile'], function() {
    return gulp
        .src('build/**/*.spec.js', {
            read: false
        })
        .pipe(mocha());
});

gulp.task('run', ['bundle', 'copy', 'transpile'], function() {
    livereload({
        start: true
    });

    gulp.watch(paths.js, ['transpile']);
    gulp.watch(paths.asset, ['copy']);

    nodemon({
            script: './build/server/start',
            watch: ['build/server', 'node_modules'],
            ignore: 'src',
            nodeArgs: ['--debug=9999']
        })
        .on('restart', function() {
            console.log('Restarted!');
            livereload.reload();
        });
});
