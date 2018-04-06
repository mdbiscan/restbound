# restbound
A node-fetch wrapper for REST endpoints returning JSONAPI. `Restbound` is a JS Class, each instantiation points towards an endpoint. 

See `node-fetch` for more info and API: https://www.npmjs.com/package/node-fetch

## Installation
`npm install restbound --save`

## JSON Serialization
`Restbound` automagically serializes returned JSON objects to `camelCase` and serializes data to `underscore`.

## TODOs
1. Outbound and inbound serialization options
1. `node-fetch` error handling
1. Post/Patch/Put options

## Configuration & Setup
```javascript
const config = {
  api: 'http://yourapp.com',
  endpoint: 'namespace',
  dataKey: 'namespace',
  token: 'yourtoken',
};

const restbound = new Restbound(config);

restbound.get();
restbound.get({ id });
resetbound.post({ data });
```

## API
Configuration|Usage
------------ | -------------
api|Url for your API.
endpoint|The name of the rest endpoint.
dataKey|_Optional._ Key for JSON array. If you do not set a dataKey, Restbound will assume it's the same as `endpoint`.
token|Authorization token. If you do not wish to customize `config.headers`, you can just set the token instead.
url|_Private._ Built in the class constructor. Is either a combination of the `api` and `endpoint` configurations, or is the `api` configuration if no `endpoint` exists. For instance, `api` could be a wholly constructed URL including the endpoint from a link path.
headers|_Optional._ Sets up `node-fetch` headers.

## node-fetch API Support
`Restbound` will set `Accept` and `Content-Type` as `application/json` by default. You can override it via `config.headers`.

## get
Params|Usage
------------ | -------------
id|Optional. Passing an `id` will get one object returned, else all objects are returned.
url|Override the initially constructed URL. See `url` in the API configuration table.

```javascript
const userBound = new Restbound({
  api: 'http://myapp',
  endpoint: 'users',
  token: 'mytoken',
});

userBound.get();
```

#### Returns
```json
{
  "users": [
    {
      "id": 1,
      "firstName": "Bob",
      "lastName": "Balaban"
    },
    {
      "id": 2,
      "firstName": "Bob",
      "lastName": "Weston"
    }
  ]
}
```

#### Example: Embedded Resources
```javascript
const bankAccountBound = new Restbound({
  api: 'http://myapp',
  dataKey: 'bank_accounts',
  endpoint: `accounts/${accountId}/bank_accounts`,
  token: 'mytoken',
});

bankAccountBound.get();
```

## put
Params|Usage
------------ | -------------
data|Object of key/value pairs.
url|Override the initially constructed URL. see `url` in the API configuration table.

```javascript
const body = {
  bankAccounts: {
    accountNumber: 555555555,
    bankAccountType: 'checking',
    routingNumber: 123456789,
  },
};

accountBound.post({ body });
```

#### Sends
```json
{
  "bank_accounts": {
    "account_number": 555555555,
    "bank_account_type": "checking",
    "routing_number": 123456789
  }
}
```
