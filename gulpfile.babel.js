import gulp from 'gulp'
import rename from 'gulp-rename'
import cssmin from 'gulp-cssmin'
import uglify from 'gulp-uglify';
var del = require('del');

gulp.task('build', () => {
    gulp.src('src/screenScroll.css').pipe(gulp.dest('dist'))
        .pipe(cssmin()).pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist'));
    gulp.src('src/screenScroll.js').pipe(gulp.dest('dist'))
        .pipe(uglify()).pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist'));
});

