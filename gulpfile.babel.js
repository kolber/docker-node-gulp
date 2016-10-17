import gulp from 'gulp';
import gutil from 'gulp-util';
import browserify from 'browserify';
import babelify from 'babelify';
import assert from 'assert';
import rename from 'gulp-rename';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import path from 'path';
import sass from 'gulp-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import sourcemaps from 'gulp-sourcemaps';

console.log(`JS: ${process.env.JS_IN} => ${process.env.JS_OUT}`);
console.log(`CSS: ${process.env.CSS_IN} => ${process.env.CSS_OUT}`);

gulp.task('dev', ['css', 'js', 'watch']);
gulp.task('default', ['css', 'js']);

const dockerPort = process.env.WEB_PORT || '80';

function errorHandler(err) {
  console.error(err);
  this.emit('end');
}

gulp.task('js', () => {
  assert(process.env.JS_IN && process.env.JS_OUT, 'JS_IN and JS_OUT not defined');

  console.log('Compiling', process.env.JS_IN);

  const JS_OUT_DIR = path.dirname(process.env.JS_OUT);
  const JS_OUT_FILE = path.basename(process.env.JS_OUT);

  return browserify(process.env.JS_IN)
    .transform('babelify')
    .bundle()
    .on('error', function(err) {
      console.error(err);
      this.emit('end');
    })
    .pipe(source('index.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init())
    .pipe(rename(JS_OUT_FILE))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(JS_OUT_DIR));
});

gulp.task('css', () => {
  assert(process.env.CSS_IN && process.env.CSS_OUT, 'CSS_IN and CSS_OUT not defined');

  console.log('Compiling', process.env.CSS_IN);

  const CSS_OUT_DIR = path.dirname(process.env.CSS_OUT);
  const CSS_OUT_FILE = path.basename(process.env.CSS_OUT);

  return gulp.src(process.env.CSS_IN)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(rename(CSS_OUT_FILE))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(CSS_OUT_DIR));
});

gulp.task('watch', () => {
  if(process.env.JS_WATCH) {
    console.log('Watching', process.env.JS_WATCH);
    gulp.watch(process.env.JS_WATCH, { interval: 500, usePolling: true }, ['js']);
  }

  if(process.env.CSS_WATCH) {
    console.log('Watching', process.env.CSS_WATCH);
    gulp.watch(process.env.CSS_WATCH, { interval: 500, usePolling: true }, ['css']);
  }
});
