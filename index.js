const fetch = require('node-fetch');
const pluralize = require('pluralize');
const camelcaseKeysDeep = require('camelcase-keys-deep');

// REST real data
// const url = {
//   AUTH: 'http://auth.test',
//   FOLIO: 'http://folio.test',
//   ROLODEX: 'http://rolodex.test',
// }

// Test ENV Tokens
// const token = {
//   AUTH: 'auth',
//   FOLIO: 'folio',
//   ROLODEX: 'rolodex',
// };

function jasonify(res) {
  return res.json();
}

function camelizeify(res, key) {
  const pluralKey = pluralize.plural(key);

  if (Array.isArray(res[pluralKey])) {
    return res[pluralKey].map((key) => camelizeKeys(key))
  } else {
    return camelizeKeys(res[pluralKey])
  }
}

function tranformify(res, key) {
  return jasonify(res).then(res => camelizeify(res, key));
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

function get({ url, key, token }) {
  return fetch(url, datafy(token, 'GET')).then(res => tranformify(res, key));
};

function post({ url, key, data, token }) {
  const body = JSON.stringify(underscoreizeKeys(data));

  return fetch(url, datafy(token, 'POST', body)).then(res => tranformify(res, key));
};

module.exports = class Restbound {
  constructor({ endpoint, key, service }) {
    this.endpoint = endpoint;
    this.key = key;
    this.service = toUpper(service);
  }

  get(id) {
    const options = {
      key: this.key,
      token: token[this.service],
      url: id ? `${url[this.service]}/${this.endpoint}/${id}` : `${url[this.service]}/${this.endpoint}`,
    };

    return get(options);
  }

  getLink(link) {
    const options = {
      key: this.key,
      token: token[this.service],
      url: link,
    };

    return get(options);
  }

  post(data) {
    const options = {
      data,
      key: this.key,
      token: token[this.service],
      url: `${url[this.service]}/${this.endpoint}`,
    };

    return post(options);
  }
}
