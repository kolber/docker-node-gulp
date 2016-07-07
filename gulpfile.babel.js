import gulp from 'gulp';
import gutil from 'gulp-util';
import plumber from 'gulp-plumber';
import postcss from 'gulp-postcss';
import precss from 'precss';
import cssnext from 'postcss-cssnext';
import path from 'path';
import webpack from 'webpack-stream';
import webpackConfig from './webpack.config.babel.js';
import yaml from 'js-yaml';
import fs from 'fs';
import get from 'lodash/get';

const SOURCE_BASE = process.env.ASSET_INPUT_DIR || 'src/';
const OUTPUT_BASE = process.env.ASSET_OUTPUT_DIR || 'output/';

gutil.log('INPUT_DIR: '+SOURCE_BASE);
gutil.log('OUTPUT_DIR: '+OUTPUT_BASE);

const GLOB_SCRIPTS = SOURCE_BASE+'/**/*.js';
const GLOB_STYLES =  SOURCE_BASE+'/**/*.css';

gulp.task('dev', ['scripts', 'styles', 'watch']);
gulp.task('default', ['scripts', 'styles']);

const dest = dir => gulp.dest(path.join(OUTPUT_BASE, dir));
const src = file => gulp.src(path.join(SOURCE_BASE, file));

const dockerPort = process.env.WEB_PORT || '80'

function errorHandler(err) {
  console.log(err);
  this.emit('end');
}

gulp.task('scripts', () => {
  return src('main.js')
    .pipe(plumber({ errorHandler }))
    .pipe(webpack(webpackConfig))
    .pipe(dest('js'))
});

gulp.task('styles', () => {
  return src('main.css')
    .pipe(plumber({ errorHandler }))
    .pipe(postcss([precss(), cssnext()]))
    .pipe(dest('css'))
});

gulp.task('watch', () => {
  gulp.watch(GLOB_SCRIPTS, { interval: 500, usePolling: true }, ['scripts']);
  gulp.watch(GLOB_STYLES, { interval: 500, usePolling: true }, ['styles']);
});
