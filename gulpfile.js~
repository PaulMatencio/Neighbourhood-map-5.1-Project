var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    plumber = require('gulp-plumber'),
    htmlmin = require('gulp-minify-html');

// HTML minifier
gulp.task('htmlmini', function() {
  var opts = {
    conditionals: true,
    spare:true
  };

  return gulp.src('Dev/*.html')
    .pipe(htmlmin(opts))
    .pipe(plumber())
    .pipe(gulp.dest('./'));
});

// JScript minifier
gulp.task('jsmini', function() {
  gulp.src('Dev/js/*.js')
    .pipe(plumber())
    .pipe(uglify())
    .pipe(gulp.dest('./js'));
});

// CSS minifier
gulp.task('cssmini', function() {
  gulp.src('Dev/css/*.css')
    .pipe(plumber())
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(gulp.dest('./css'));
});

// Image compress
gulp.task('imagecomp', function() {
  gulp.src('Dev/images/*')
    .pipe(plumber())
    .pipe(imagemin())
    .pipe(gulp.dest('./images'));
})

// I watching U workin'
gulp.task('watch', function() {
  gulp.watch('Dev/*.html', ['htmlmini']);
  gulp.watch('Dev/js/*.js', ['jsmini']);
  gulp.watch('Dev/css/*.css', ['cssmini']);
  gulp.watch('Dev/img/*', ['imagecomp']);
});

gulp.task('default', ['htmlmini', 'jsmini','cssmini', 'imagecomp', 'watch']);
