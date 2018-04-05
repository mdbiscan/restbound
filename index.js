const fetch = require('node-fetch');
const camelcaseKeysDeep = require('camelcase-keys-deep');
const decamelizeKeysDeep = require('decamelize-keys-deep');

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

function datafy(token, method, body) {
  return {
    body,
    method,
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }
};

function get({ url, dataKey, token }) {
  // TODO: responses
  return fetch(url, datafy(token, 'GET')).then(res => transformify(res, dataKey));
};

function post({ url, dataKey, data, token }) {
  const body = JSON.stringify(decamelizeKeysDeep(data));
  // TODO: responses
  return fetch(url, datafy(token, 'POST', body)).then(res => transformify(res, dataKey));
};

module.exports = class Restbound {
  constructor(config = {}) {
    this.api = config.api;
    this.endpoint = config.endpoint;
    this.dataKey = config.dataKey || config.endpoint;
    this.token = config.token;
    this.url = (config.api && config.endpoint) ? `${config.api}/${config.endpoint}` : (config.api || config.endpoint);
  }

  options(options = {}) {
    return {
      data: options.data,
      dataKey: options.dataKey || this.dataKey,
      token: options.token || this.token,
      url: options.url || options.id ? `${this.url}/${options.id}` : this.url,
    };
  }

  get(options = {}) {
    return get(this.options({ id: options.id, url: options.url }));
  }

  post(options = {}) {
    return post(this.options({ data: options.data, url: options.url }));
  }
}
