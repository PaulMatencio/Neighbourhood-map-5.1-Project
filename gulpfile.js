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

  return gulp.src('src/*.html')
    .pipe(htmlmin(opts))
    .pipe(plumber())
    .pipe(gulp.dest('./'));
});

// JScript minifier
gulp.task('jsmini', function() {
  gulp.src('src/js/*.js')
    .pipe(plumber())
    .pipe(uglify())
    .pipe(gulp.dest('./js'));
});

// CSS minifier
gulp.task('cssmini', function() {
  gulp.src('src/css/*.css')
    .pipe(plumber())
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(gulp.dest('./css'));
});

// Image compress
gulp.task('imagecomp', function() {
  gulp.src('src/images/*')
    .pipe(plumber())
    .pipe(imagemin())
    .pipe(gulp.dest('./images'));
})

// I watching U workin'
gulp.task('watch', function() {
  gulp.watch('src/*.html', ['htmlmini']);
  gulp.watch('src/js/*.js', ['jsmini']);
  gulp.watch('src/css/*.css', ['cssmini']);
  gulp.watch('src/img/*', ['imagecomp']);
});

gulp.task('default', ['htmlmini', 'jsmini','cssmini', 'imagecomp', 'watch']);
