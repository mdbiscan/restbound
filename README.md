# restbound
A node-fetch wrapper for REST endpoints returning JSONAPI. `Restbound` is a JS Class, each instantiation points towards an endpoint. 

## Installation
`npm install restbound --save`

## JSON Serialization
`Restbound` automagically serializes returned JSON objects to `camelCase` and serializes data to `underscore`.

## TODOs
1. Outbound and inbound serialization options
1. `node-fetch` error handling
1. Post/Patch/Put options

# Configuration & Setup
## Example
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
# API
Configuration|Usage
------------ | -------------
api|Url for your API
endpoint|The name of the rest Endpoint
dataKey|Key for JSON array. This is optional. If you do not set a dataKey, Restbound will assume it's the same as your endpoint.
token|Authorization token
url|Private field built in the class constructor. Is either a combination of the `api` and `endpoint` configurations, or is the `api` configuration if no `endpoint` exists. For instance, `api` could be a wholly constructed URL including the endpoint from a link path.

# Public Methods
## get
### Examples
```javascript
const accountBound = new Restbound({
  api: 'http://myapp',
  endpoint: 'accounts',
  token: 'mytoken',
});

accountBound.get();
```
#### BankAccounts from Accounts
```javascript
const bankAccountBound = new Restbound({
  api: 'http://myapp',
  dataKey: 'bank_accounts',
  endpoint: `accounts/${accountId}/bank_accounts`,
  token: 'mytoken',
});

bankAccountBound.get();
```
Params|Usage
------------ | -------------
id|Optional. Passing an `id` will get one object returned, else all objects are returned.
url|Override the initially constructed URL. See `url` in the API configuration table.
## put
```javascript
const data = {
  bankAccounts: {
    accountNumber: 555555555,
    bankAccountType: 'checking',
    bankPaymentType: 'ach',
    routingNumber: 123456789,
  },
};

accountBound.post({ data });
```
Params|Usage
------------ | -------------
data|Object of key/value pairs.
url|Override the initially constructed URL. see `url` in the API configuration table.
