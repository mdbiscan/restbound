const fetch = require('node-fetch');
const camelcaseKeysDeep = require('camelcase-keys-deep');
const decamelizeKeysDeep = require('decamelize-keys-deep');

const method = {
  GET: 'GET',
  POST: 'POST',
};

function jasonify(res) {
  return res.json();
}

function camelizeify(res, dataKey) {
  if (Array.isArray(res[dataKey])) {
    return res[dataKey].map(key => camelcaseKeysDeep(key))
  } else {
    return camelcaseKeysDeep(res[dataKey]);
  }
}

function transformify(res, dataKey) {
  return jasonify(res).then(res => camelizeify(res, dataKey));
}

function _fetch(url, options, dataKey) {
  return fetch(url, options).then(res => transformify(res, dataKey));
}

module.exports = class Restbound {
  constructor(config = {}) {
    const headers = config.headers || {};

    this.headers = new fetch.Headers({
      'Accept': headers.accept || '*/*',
      'Accept-Encoding': headers.acceptEncoding || 'application/json',
      'Authorization': `Bearer ${config.token}` || headers.authorization,
      'Connection': headers.connection || 'close',
      'Content-Type': headers.contentType || 'application/json',
      'User-Agent': headers.userAgent || 'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)',
    });

    this.fetchOptions = {
      agent: config.agent || null,
      compress: config.compress || true,
      follow: config.follow || 20,
      headers: this.headers,
      redirect: config.redirect || 'follow',
      size: config.size || 0,
      timeout: config.timeout || 0,
    };

    this.api = config.api;
    this.endpoint = config.endpoint;
    this.dataKey = config.dataKey || config.endpoint;
    this.url = (config.api && config.endpoint) ? `${config.api}/${config.endpoint}` : config.api;
  }

  get(params = {}) {
    const options = Object.assign(this.fetchOptions, { method: method.GET });
    let url = params.url || this.url;
    url = params.id ? `${url}/${params.id}` : url;

    return _fetch(url, options, this.dataKey);
  }

  post(params = {}) {
    const body = JSON.stringify(decamelizeKeysDeep(params.body));
    const options = Object.assign(this.fetchOptions, { method: method.POST, body });
    const url = params.url || this.url;

    return _fetch(url, options, this.dataKey);
  }
}
