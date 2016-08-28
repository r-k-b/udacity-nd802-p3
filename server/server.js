import koa from 'koa';
import logger from 'koa-logger';
import koaRouter from 'koa-router';
import mount from 'koa-mount';
import serve from 'koa-static';
import send from 'koa-send';
// noinspection JSFileReferences
import indexTemplate from './templates/index'; // eslint-disable-line import/no-unresolved

const router = koaRouter();

const app = koa();

app.use(logger());

function serveBuilt(x) {
  return koa().use(serve(`../public/${x}`));
}

app.use(mount('/js', serveBuilt('js')));
app.use(mount('/css', serveBuilt('css')));
app.use(mount('/imgs', serveBuilt('imgs')));
app.use(mount('/data', serveBuilt('data')));

//noinspection JSUnusedLocalSymbols
function singleFile(file) {
  return function* singleFileGenerator() {
    yield send(this, file, { root: '../public' });
  };
}

// TODO: add service-worker, manifest
// router.get('/manifest.json', singleFile('manifest.json'));
// router.get('/sw.js', singleFile('sw.js'));
// router.get('/sw.js.map', singleFile('sw.js.map'));

// For now, we'll allow the client-side JS to handle every other route.
// TODO: refine wildcard down to valid routes for app
router.get('/(.*)', function* root() {
  //noinspection JSUnusedGlobalSymbols
  this.body = indexTemplate({
    scripts: '<script src="/js/app.js" defer></script>',
    content: '<div class="loadingscreen"><h1>Restaurant Reviewer</h1></div>"',
  });
});

app
  .use(router.routes())
  .use(router.allowedMethods());

const start = options => app.listen(options.port);

export default {
  start,
};
