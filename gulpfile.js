var gulp = require('gulp'),
    browserify = require('browserify'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer');;

var paths = {
    'dist': {
      'js' : './dist/'
    },
    'src': {
      'js': './src/'
    },    
    'test': {
      'main': './test/',
      'js': './test/js/'
    }
};

// JS
gulp.task('beetlejs.js', function(){
  return browserify({
      // debug: true,
      entries: [paths.src.js+'index.js']
    })
    .bundle()
    .pipe(source('beetle.js'))
    .pipe(buffer())
    .pipe(gulp.dest(paths.dist.js))
    .pipe(uglify())
    .pipe(rename({suffix:'.min'}))
    .pipe(gulp.dest(paths.dist.js));
});

gulp.task('test.js', function(){
  return browserify({
      // debug: true,
      entries: [paths.test.js+'index.js']
    })
    .bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(gulp.dest(paths.test.main))
    .pipe(uglify())
    .pipe(rename({suffix:'.min'}))
    .pipe(gulp.dest(paths.test.main));
});

gulp.task('watch', function() {  
  gulp.watch(paths.src.js + '**/*.js', ['beetlejs.js','test.js']);
  gulp.watch(paths.test.js + '**/*.js', ['test.js']);
});

gulp.task('default', [
  'beetlejs.js',
  'test.js',
  'watch'
]);
