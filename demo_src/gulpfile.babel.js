import gulp from 'gulp'
import grid from 'smart-grid'
import notify from 'gulp-notify'
import browserSync from 'browser-sync'
import less from 'gulp-less'
import pug from 'gulp-pug'
import versionAppend from 'gulp-version-append';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
var del = require('del');
const settings = {
    outputStyle: 'less',
    columns: 12,
    offset: '30px',
    mobileFirst: false,
    container: {
        maxWidth: '1140px',
        fields: '30px'
    },
    breakPoints: {
        lg: {
            width: '1200px'
        },
        md: {
            width: '960px'
        },
        sm: {
            width: '780px',
            fields: '15px'
        },
        xs: {
            width: '560px'
        }
    }
};

gulp.task('init', () => {
    grid('less', settings);
});

gulp.task('browser-sync', () => {
    browserSync({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('styles', () => {
    return gulp.src('less/*.less')
        .pipe(less())
        .on("error", notify.onError({
            message: 'LESS compile error: <%= error.message %>'
        }))
        .pipe(gulp.dest('css'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('views', () => {
    return gulp.src('*.pug')
        .pipe(pug()).pipe(gulp.dest('')).pipe(browserSync.reload({stream: true}));
});

gulp.task('watch', ['browser-sync'], () => {
    gulp.watch('less/*.less', ['styles']);
    gulp.watch('*.pug', ['views']);
    gulp.watch('js/*.js');
    gulp.watch('../src/screenScroll.js', ['makeJsSrc']);
    gulp.watch('../src/screenScroll.less', ['makeLessSrc']);
});

gulp.task('makeJsSrc', () => {
    return gulp.src('../src/screenScroll.js').pipe(gulp.dest('js')).pipe(browserSync.reload({stream: true}));
});

gulp.task('makeLessSrc', () => {
    return gulp.src('../src/screenScroll.less')
        .pipe(less())
        .pipe(gulp.dest('../src')).pipe(gulp.dest('css'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('demo-build', ['styles', 'views', 'makeLessSrc'], () => {
    del(['../demo']);

    gulp.src(['index.html'])
        .pipe(versionAppend(['html', 'js', 'css']))
        .pipe(gulp.dest('../demo'));

    gulp.src([
        'js/**/*',
        'bower_components/jquery/dist/jquery.min.js',
        'bower_components/jquery-mousewheel/jquery.mousewheel.min.js'
    ]).pipe(gulp.dest('../demo/js'));

    gulp.src(['css/**/*']).pipe(gulp.dest('../demo/css'));

    gulp.src(['bower_components/font-awesome/fonts/**/*']).pipe(gulp.dest('../demo/fonts'));
    gulp.src(['bower_components/font-awesome/css/font-awesome.min.css'])
        .pipe(gulp.dest('../demo/css'));
});