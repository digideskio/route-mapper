
## route-mapper

Generate Rails Routing Style.


### Features

* Nested
* Namespace
* Resources
* RESTful
* ...


### APIs

* `root`
* `match`
* `get`
* `post`
* `patch`
* `put`
* `delete`
* `scope`
* `controller`
* `namespace`
* `constraints`
* `defaults`
* `resource`
* `resources`
  * `collection`
  * `member`
  * `nested`
* `shallow`
* `concern`
* `concerns`



### Usage

```js
let router = new RouteSet();
router.draw((m) => {
  // resources
  m.resources('photos');

  // resources nested
  m.resources('posts', () => {
    m.resources('comments');
  });

  // root
  m.root('welcome#index');

});
```


#### Express working with `route-mapper`:

```js
import express from 'express';
import {RouteSet} from '../..';

let app = express();

let controllers = {
  welcome: {
    index:  (req, res) => {
      res.send('Welcome Index!');
    }
  },
  photos: {
    index: (req, res) => {
      res.send('photos index');
    },
    show: (req, res) => {
      res.send(`photo ${req.params.id}`);
    }
  }
};

let router = new RouteSet();
router.draw((m) => {
  m.root('welcome#index');
  m.resources('photos');
});

router.routes.forEach((r) => {
  r.via.forEach((m) => {
    let controller = r.controller;
    let action = r.action;
    let c;
    let a;
    if ((c = controllers[controller]) && (a = c[action])) {
      app[m](r.path, a);
    };
  });
});

app.listen(2333);
```

#### Koa working with `route-mapper`:

```js
import koa from 'koa';
import router from 'koa-router';
import {RouteSet} from '../..';

let app = koa();
app.use(router(app));

let controllers = {
  welcome: {
    index:  function *() {
      this.body = 'Welcome Index!';
    }
  },
  photos: {
    index: function *() {
      this.body = 'photos index';
    },
    show: function *() {
      this.body = `photo ${this.params.id}`;
    }
  },
  posts: {
    index: function *() {
      this.body = 'posts index';
    },
    show: function *() {
      this.body = `posts ${this.params.id}`;
    }
  },
  comments: {
    index: function *() {
      this.body = 'comments index';
    },
    show: function *() {
      this.body = `post ${this.params.post_id}, comment ${this.params.id}`;
    }
  },
};

let router = new RouteSet();
router.draw((m) => {
  m.root('welcome#index');
  m.resources('photos');
  m.resources('posts', () => {
    m.resources('comments');
  });
});

router.routes.forEach((r) => {
  r.via.forEach((m) => {
    let controller = r.controller;
    let action = r.action;
    let c;
    let a;
    if ((c = controllers[controller]) && (a = c[action])) {
      app[m](r.path, a);
    };
  });
});

app.listen(2333);
```
