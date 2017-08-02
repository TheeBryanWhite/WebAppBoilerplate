'use strict';
/*
 * Define plugins
 */
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var jshintStylish = require('jshint-stylish');
var sass = require('gulp-sass');;
var browserSync = require('browser-sync');

/*
 * Define paths
 */
var paths = {
    jsFiles: ['src/js/lib/**/*.js', 'src/js/local/**/*.js'],
    jsDirectory: ['src/js/lib/', 'src/js/local/'],
    cssFiles: './src/css/*.css',
    cssDirectory: './src/css/',
    sassFiles: './src/less/*.scss',
    sassDirectory: './src/scss/',
    distributionDirectory: './src/dist'
};

/*
 * Compile SASS to CSS
 */
gulp.task('sass', function () {
  return gulp.src(paths.sassFiles)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(paths.cssDirectory));
});


/*
 * Lint your JavaScript
 */
gulp.task('js-lint', function () {
    return gulp.src(paths.jsFiles)
        .pipe($.jshint())
        .pipe($.jshint.reporter(jshintStylish));
});

/*
 * Lint your CSS
 */
gulp.task('css-lint', function () {
    return gulp.src(paths.cssFiles)
        .pipe($.csslint())
        .pipe($.csslint.reporter());
});

/*
 * Beautify your CSS
 */
gulp.task('beautify-css', function () {
    return gulp.src(paths.cssFiles)
        .pipe($.cssbeautify())
        .pipe(gulp.dest(paths.cssDirectory));
});

/*
 * Beautify your JavaScript
 */
gulp.task('beautify-js', function () {
    return gulp.src(paths.jsFiles)
        .pipe($.jsbeautifier({
            config: '.jsbeautifyrc',
            mode: 'VERIFY_AND_WRITE'
        }))
        .pipe(gulp.dest(paths.jsDirectory));
});

/*
 * Strip, prefix, minify and concatenate your CSS during a deployment
 */
gulp.task('css-dist', function () {
    $.util.log('Gulp.js:', $.util.colors.red('• run CSS tasks for distribution'));
    $.util.log('Gulp.js:', $.util.colors.red('• strip comments, add prefixes, minify files,'));
    $.util.log('Gulp.js:', $.util.colors.red('  concatenate files, gzip files and write files to destination folder'));
    $.util.beep();

    return gulp.src(paths.cssFiles)
        .pipe($.plumber())
        .pipe($.stripComments())
        .pipe($.autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe($.concat('style.css'), {newLine: ''})
        .pipe($.minifyCss({compatibility: 'ie8'}))
        .pipe(gulp.dest(paths.distributionDirectory));
});

/*
 * Strip, minify and concatenate your JavaScript during a deployment
 */
gulp.task('js-dist', function () {
    $.util.log('Gulp.js:', $.util.colors.red('• run JavaScript tasks for distribution'));
    $.util.log('Gulp.js:', $.util.colors.red('• strip comments, minify files,'));
    $.util.log('Gulp.js:', $.util.colors.red('  concatenate files, gzip files and write files to destination folder'));
    $.util.beep();

    return gulp.src(paths.jsFiles)
        .pipe($.plumber())
        .pipe($.stripComments())
        .pipe($.uglify())
        .pipe($.concat('main.js'), {newLine: ';'})
        .pipe(gulp.dest(paths.distributionDirectory));
});

/*
 * Watchers
 */
gulp.task('watch', function () {
    gulp.watch(paths.jsFiles, ['js-lint']);
    gulp.watch(paths.cssFiles, ['css-lint']);
    gulp.watch(paths.sassDirectory, ['sass']);
});

/*
 * Run multiple tasks at the same time
 */
gulp.task('default', ['css-dist', 'js-dist']);
gulp.task('beautify', ['beautify-css', 'beautify-js']);

/*
 * Serve files trough BrowserSync
 */
gulp.task('serve', function () {
    browserSync.create();
    browserSync.init({
        proxy: "dev.youdevurl"
    });
    gulp.watch("./resources/views/*.php", browserSync.reload);
});