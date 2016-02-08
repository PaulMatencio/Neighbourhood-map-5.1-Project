var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    minifycss = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    plumber = require('gulp-plumber'),
    minifyinline = require('gulp-minify-inline'),
    minifyhtml = require('gulp-minify-html');

// HTML minifier
gulp.task('mini-html', function() {
  var opts = {
    conditionals: true,
    spare:true
  };

  return gulp.src('src/*.html')
    .pipe(minifyhtml(opts))
    .pipe(plumber())
    .pipe(gulp.dest('./'));
});

gulp.task('mini-critical-html', function() {
    var opts = {
        conditionals: true,
        spare: true
    };
    return gulp.src('*.html')
        .pipe(minifyhtml(opts))
        .pipe(gulp.dest(''));
});

gulp.task('mini-inline', function() {
  gulp.src('*.html')
    .pipe(minifyinline())
    .pipe(gulp.dest(''))
});

// JavaScript  minifier
gulp.task('mini-js', function() {
  gulp.src('src/js/*.js')
    .pipe(plumber())
    .pipe(uglify())
    .pipe(gulp.dest('./js'));
});

// CSS minifier
gulp.task('mini-css', function() {
  gulp.src('src/css/*.css')
    .pipe(plumber())
    .pipe(minifycss({compatibility: 'ie8'}))
    .pipe(gulp.dest('./css'));
});


gulp.task('critical', function () {
  critical.generate({
    base: 'src',
    src: 'index.html',
    css: ['src/css/style.css'],
    dimensions: [{
      width: 320,
      height: 480
    },{
      width: 768,
      height: 1024
    },{
      width: 1280,
      height: 960
    }],
    dest: 'index.html',
    minify:true,
    inline: true
  });
});

// Image optimize
gulp.task('optimize-image', function() {
    gulp.src('src/images/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('images'));
});


// Image compress
gulp.task('compress-image', function() {
  gulp.src('src/images/*')
    .pipe(plumber())
    .pipe(imagemin())
    .pipe(gulp.dest('./images'));
})

// I watching U workin'
gulp.task('watch', function() {
  gulp.watch('src/*.html', ['mini-html']);
  gulp.watch('src/*.html', ['mini-inline']);
  gulp.watch('src/js/*.js', ['mini-js']);
  gulp.watch('src/css/*.css', ['mini-css']);
  gulp.watch('src/images/*', ['optimize-image']);
});

gulp.task('default', ['mini-html', 'mini-js','mini-css', 'compress-image','watch']);
