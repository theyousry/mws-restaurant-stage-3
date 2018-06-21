const gulp = require('gulp');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const jsmin = require('gulp-jsmin');
const imagemin = require('gulp-imagemin');
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();

gulp.task('css', () => {
  return gulp.src(['css/styles.css', 'css/responsive.css'])
    .pipe(cleanCSS({ level: 2 }))
    .pipe(concat('bundle.css'))
    .pipe(rename('bundle.min.css'))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('js', () => {
  return gulp.src('js/*.js')
    .pipe(babel({ presets: ['env'] }))
    .pipe(jsmin())
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('img', () => {
  gulp.src('img/*.{png,jpg,jpeg,gif,webp}')
    .pipe(imagemin({ progressive: true, }))
    .pipe(gulp.dest('dist/img/'));
});

gulp.task('default', [ 'css', 'js', 'img' ]);
