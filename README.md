# axios-etag-cache

Axios etag interceptor to enable If-None-Match request with ETAG support

## Basic use:

```js
const axiosETAGCache = require('axios-etag-cache');

axiosETAGCache(axios)
    .get('http://example.com')
    .then(console.log)
    .catch(console.error);
```

## Using external cache

Thanks to @dasniko axios-etag-cache use internally a simple cache model but if you want use another system you only have to use the **cache** object:

```js
const axiosETAGCache = require('axios-etag-cache');

const myCacheModule = {
  get: (uuid) => {}, 
  set: (uuid, value) => {},
  reset: () => {}
};

axiosETAGCache(axios, { cache: myCacheModule })
    .get('http://example.com')
    .then(console.log)
    .catch(console.error);
```

For example to use the [node-cache](https://www.npmjs.com/package/node-cache) package...

```js
const axiosETAGCache = require('axios-etag-cache');
const NodeCache = require('node-cache');
const nodeCache = new NodeCache();

axiosETAGCache(axios, { cache: nodeCache })
    .get('http://example.com')
    .then(console.log)
    .catch(console.error);
```







