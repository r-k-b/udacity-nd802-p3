const del = require('del');
const gulp = require('gulp');
const util = require('gulp-util');
const sass = require('gulp-sass');
const hbsfy = require('hbsfy');
const babel = require('gulp-babel');
const merge = require('ramda').merge;
const rename = require('gulp-rename');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');
const through = require('through2');
const watchify = require('watchify');
const babelify = require('babelify');
const handlebars = require('handlebars');
const browserify = require('browserify');
const sourcemaps = require('gulp-sourcemaps');
const runSequence = require('run-sequence');
const mergeStream = require('merge-stream');
const defineModule = require('gulp-define-module');
const developServer = require('gulp-develop-server');
const gulpHandlebars = require('gulp-handlebars');


function createBundle(srcIn) {
  const src = (!srcIn.push) ? [srcIn] : srcIn;

  const customOpts = {
    entries: src,
    debug: true,
  };

  const opts = merge(watchify.args, customOpts);
  const b = watchify(browserify(opts));

  b.transform(babelify.configure({}));

  b.transform(hbsfy);
  b.on('log', util.log); // `bind` not required, like in `bundle()`?
  return b;
}


const jsBundles = {
  'js/main.js': createBundle('./public/js/main/index.js'),
};


gulp.task('clean', done =>
  del(['build'], done)
);


// TODO: add autoprefixer to pipeline
gulp.task('css', () =>
  gulp.src('public/scss/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('build/public/css/'))
);


function bundle(b, outputPath) {
  const splitPath = outputPath.split('/');
  const outputFile = splitPath[splitPath.length - 1];
  const outputDir = splitPath.slice(0, -1).join('/');

  return b.bundle()
  // log errors if they happen
    .on('error', util.log.bind(util, 'Browserify Error'))

    .pipe(source(outputFile))

    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())

    // optional, remove if you dont want sourcemaps
    .pipe(sourcemaps.init({ loadMaps: true })) // loads map from browserify file

    // Add transformation tasks to the pipeline here.
    .pipe(sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest(`build/public/${outputDir}`));
}


gulp.task('copy', () =>
  mergeStream(
    gulp.src('public/imgs/**/*')
      .pipe(gulp.dest('build/public/imgs/')),
    gulp.src('public/*.json')
      .pipe(gulp.dest('build/public/'))
  )
);

const createBundleFromKey = key => bundle(jsBundles[key], key);

gulp.task('js:browser', () =>
  mergeStream(...Object.keys(jsBundles).map(createBundleFromKey))
);


gulp.task('templates:server', () =>
  gulp.src('templates/*.hbs')
    .pipe(gulpHandlebars({ handlebars }))
    .on('error', util.log.bind(util))
    .pipe(through.obj((file, enc, callback) => {
      // Don't want the whole lib
      const fileOut = file;
      fileOut.defineModuleOptions.require = { Handlebars: 'handlebars/runtime' };
      callback(null, fileOut);
    }))
    .pipe(defineModule('commonjs'))
    .pipe(rename(path => {
      const pathOut = path;
      pathOut.extname = '.js';
      return pathOut;
    }))
    .pipe(gulp.dest('build/server/templates'))
);


gulp.task('js:server', () =>
  gulp.src('server/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({}))
    .on('error', util.log.bind(util))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/server'))
);


gulp.task('server', () => {
  // strip unwanted args:
  // [0] = `node` path
  // [1] = `gulp` path
  // [2] = `serve`
  const serverArgs = process.argv.slice(3);

  developServer.listen({
    path: './index.js',
    cwd: './build/server',
    args: serverArgs,
  });

  gulp.watch([
    'build/server/**/*.js',
  ], developServer.restart);
});


gulp.task('watch', () => {
  gulp.watch(
    ['public/scss/**/*.scss'],
    ['css']
  );
  gulp.watch(
    ['templates/*.hbs'],
    ['templates:server']
  );
  gulp.watch(
    ['server/**/*.js'],
    ['js:server']
  );
  gulp.watch(
    ['public/imgs/**/*', 'server/*.txt', 'public/*.json'],
    ['copy']
  );

  Object.keys(jsBundles).forEach(key => {
    const b = jsBundles[key];
    b.on('update', () => bundle(b, key));
  });
});


gulp.task('serve', callback =>
  runSequence(
    'clean',
    ['css', 'js:browser', 'templates:server', 'js:server', 'copy'],
    ['server', 'watch'],
    callback
  )
);

gulp.task('default', ['watch']);