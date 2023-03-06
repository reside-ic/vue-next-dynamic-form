'use strict';

const gulp = require('gulp'),
    sass = require('gulp-sass')(require('node-sass')),
    rename = require('gulp-rename'),
    minify = require('gulp-clean-css'),
    through = require('through'),
    path = require('path');

gulp.task('sass', function () {
    return gulp.src('src/style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(through(function (file) {
            file.named = path.basename(path.dirname(file.path).split("/").pop(), path.extname(file.path));
            this.queue(file);
        }))
        .pipe(minify({compatibility: 'ie8'}))
        .pipe(rename({
            extname: ".min.css"
        }))
        .pipe(gulp.dest('dist/css'));
});
