import gulp from 'gulp';
import gutil from 'gulp-util';
import postcss from 'gulp-postcss';
import precss from 'precss';
import cssnext from 'postcss-cssnext';
import path from 'path';
import webpack from 'webpack-stream';
import webpackConfig from './webpack.config.babel.js';
import BrowserSync from 'browser-sync';
import yaml from 'js-yaml';
import fs from 'fs';
import get from 'lodash/get';

const browserSync = BrowserSync.create();

const SOURCE_BASE = process.env.ASSET_INPUT_DIR || 'src/';
const OUTPUT_BASE = process.env.ASSET_OUTPUT_DIR || 'output/';

gutil.log('INPUT_DIR: '+SOURCE_BASE);
gutil.log('OUTPUT_DIR: '+OUTPUT_BASE);

const GLOB_SCRIPTS = SOURCE_BASE+'/**/*.js';
const GLOB_STYLES =  SOURCE_BASE+'/**/*.css';

gulp.task('dev', ['browser-sync', 'scripts', 'styles', 'watch']);
gulp.task('default', ['scripts', 'styles']);

const dest = dir => gulp.dest(path.join(OUTPUT_BASE, dir));
const src = file => gulp.src(path.join(SOURCE_BASE, file));

const dockerPort = process.env.WEB_PORT || '80'

gulp.task('scripts', () => {
  return src('main.js')
    .pipe(webpack(webpackConfig).on('error', gutil.log))
    .pipe(dest('js'))
});

gulp.task('styles', () => {
  return src('main.css')
    .pipe(postcss([precss(), cssnext()]).on('error', gutil.log))
    .pipe(dest('css'))
});

gulp.task('watch', () => {
  gulp.watch(GLOB_SCRIPTS, {interval: 500, usePolling: true}, ['scripts']).on('change', browserSync.reload);
  gulp.watch(GLOB_STYLES, {interval: 500, usePolling: true}, ['styles']).on('change', browserSync.reload);
});

gulp.task('browser-sync', () => {
  return browserSync.init({
    proxy: `http://localhost:${dockerPort}`
  });
});
