'use strict';

var path = require('path');
var Promise = require('es6-promise').Promise;
var gulp = require('gulp');
var del = require('del');
var eslint = require('gulp-eslint');
var istanbul = require('gulp-istanbul');
var mocha = require('gulp-mocha');
var changed = require('gulp-changed');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var livereload = require('gulp-livereload');
var nodemon = require('gulp-nodemon');
var browserify = require('browserify');
var watchify = require('watchify');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');

var getBundleName = function () {
    var version = require('./package.json').version;
    var name = require('./package.json').name;
    return version + '.' + name + '.' + 'min';
};

var paths = {
    js: ['src/common/**/*.js', 'src/component/**/*.js', 'src/server/**/*.js'],
    asset: ['src/**/*.*', '!src/**/*.js'],
    build: 'build/node_modules/minode',
};

function bundle(bundler) {
    return bundler.bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('minode.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.build + '/web'));
}

gulp.task('clean', function (cb) {
    del.sync('build', {
        force: true
    }, cb);
});

gulp.task('transpile', function () {
    var sourceRoot = path.resolve('src').replace(/\\/g, '/');

    if (sourceRoot[0] !== '/')
        sourceRoot = '/' + sourceRoot;

    return gulp.src(paths.js, {
        base: 'src',
        dot: true
    })
        .pipe(sourcemaps.init())
        .pipe(changed(paths.build))
        .pipe(babel())
        .pipe(sourcemaps.write('.', {sourceRoot: sourceRoot}))
        .pipe(gulp.dest(paths.build))
        .pipe(livereload());
});

gulp.task('lint', function () {
    return gulp.src(paths.js)
        .pipe(eslint())
        .pipe(eslint.format());
});

gulp.task('copy', function () {
    return gulp.src(paths.asset, {
        base: 'src',
        dot: true
    })
        .pipe(changed(paths.build))
        .pipe(gulp.dest(paths.build))
        .pipe(livereload());
});

gulp.task('bundle', function () {
    var bundler = watchify(browserify('./src/web/index.js', watchify.args));

    // add any other browserify options or transforms here
    bundler
        //.transform('brfs')
        .transform('babelify');

    bundler.on('update', function () {
        bundle(bundler);
    });
    bundler.on('bytes', function () {
        livereload.reload();
    });
    bundler.on('log', gutil.log); // output build logs to terminal
    bundler.on('error', gutil.log); // output build logs to terminal

    bundle(bundler);
});

gulp.task('test', ['transpile', 'copy'], function (cb) {
    var specs = 'build/**/*.spec.js';
    gulp.src(['build/**/*.js'])
        .pipe(istanbul())
        .pipe(istanbul.hookRequire())
        .on('finish', function () {
            gulp
                .src(specs, {
                    read: false,
                    dot: true
                })
                .pipe(mocha())
                .pipe(istanbul.writeReports())
                .on('end', cb);
        });
});

gulp.task('demo', ['bundle', 'copy', 'transpile'], function () {
    livereload({
        start: true
    });

    gulp.watch(paths.js, ['transpile']);
    gulp.watch(paths.asset, ['copy']);

    nodemon({
        script: './' + paths.build + '/server/demo',
        watch: [paths.build + '/server', 'node_modules'],
        ignore: 'src',
        nodeArgs: ['--debug=9999']
    })
        .on('restart', function () {
            console.log('Restarted!');
            livereload.reload();
        });
});
