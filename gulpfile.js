var gulp = require('gulp'),
    gzip = require('gulp-gzip'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename');

var paths = {
    'dist': {
      'js' : './dist/'
    },
    'src': {
      'js': './src/'
    }
};

// JS
gulp.task('beetlejs.js', function(){
  return gulp.src([

      paths.src.js+'beetlejs.js',
      paths.src.js+'events.js',
      paths.src.js+'networking.js',
      
    ])
    .pipe(concat('beetlejs.js'))
    .pipe(gulp.dest(paths.dist.js))
    .pipe(concat('beetlejs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.dist.js))
    .pipe(gzip({ append:true }))
    .pipe(gulp.dest(paths.dist.js));
});

gulp.task('watch', function() {  
  gulp.watch(paths.src.js + '**/*.js', ['beetlejs.js']);
});

gulp.task('default', [
  'beetlejs.js',
  'watch'
]);
