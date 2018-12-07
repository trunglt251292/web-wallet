import fetch from 'isomorphic-fetch';
import config from '../../server/config';
function timeout(ms, promise) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      reject(new Error("timeout"));
    }, ms)
    promise.then(resolve, reject);
  })
}
export default function callApi(endpoint, method = 'get', body) {
  return timeout(5000, fetch(`${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      "os": "linux3.2.0-4-amd64",
      "version": "0.3.0",
      "port": 1,
      "nethash":config.nethash
    },
    method,
    body: JSON.stringify(body),
  }))
  .then(response => response.json().then(json => ({ json, response })))
  .then(({ json, response }) => {
    console.log(response);
    if (!response.ok) {
      return Promise.reject(json);
    }

    return json;
  })
  .then(
    response => response,
    error => error
  )
}
