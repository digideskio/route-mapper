import koa from 'koa';
import router from 'koa-router';
import RouteMapper from '../..';

let app = koa();

let routeMapper = new RouteMapper();
routeMapper.draw((m) => {
  m.root('welcome#index');
  m.get('about', { to: 'welcome#about' });
  m.resources('posts', () => {
    m.resources('comments');
  });
  m.scope({ path: '~:username?', module: 'users', as: 'user'}, () => {
    m.root('welcome#index');
  });
});

app.use(function *(next) {
  this.urlHelpers = routeMapper.urlHelpers;
  yield next;
});

app.use(router(app));

routeMapper.routes.forEach((r) => {
  r.via.forEach((m) => {
    let controller = r.controller;
    let action = r.action;
    let c = require(__dirname + '/controllers/' + controller + '.js');
    let a;
    if (c && (a = c[action])) {
      if (!Array.isArray(a)) {
        a = [a];
      }
      app[m](r.path, ...a);
    };
  });
});

app.listen(3300);
