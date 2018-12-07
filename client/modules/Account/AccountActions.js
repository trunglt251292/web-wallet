import callApi from '../../util/apiCaller';
import know from 'know-js';
import _ from 'lodash';
import config from '../../../server/config';

export var IP = '';
export var URL = '';
export var IPS = [];
export var publicKey = '';
export var privateKey = '';
export var address = '';
export var nethash = '';
export const API_PEERS = '/api/v1/peers';
export const API_ACCOUNT = '/api/v1/accounts';
export const API_BALANCE = '/api/v1/accounts/getBalance';
export const API_TRANSACTIONS = '/api/v1/transactions';
export const API_SENT_TRANSACTION = '/api/v2/transactions';
export const API_NETHASH = '/api/v1/blocks/getNetHash';
export const API_STATUS = '/api/v1/loader/status';
export const API_DELEGATE = '/api/v1/delegates/get/';
export const API_DELEGATES = '/api/v1/accounts/delegates';
export const API_SEARCH_DELEGATES = '/api/v1/delegates/search';
export const API_ALL_DELEGATES = '/api/v1/delegates';
export const API_FORGED = '/api/v1/delegates/forging/getForgedByAccount';
export const API_VOTES = '/api/v1/delegates/voters';
// Export Constants
export const ADD_ACCOUNTINFO = 'ADD_ACCOUNTINFO';
export const EDIT_PEER = 'EDIT_PEER';
export const GET_BALANCE = 'GET_BALANCE';
export const FETCH_ACCOUNT = 'FETCH_ACCOUNT';

// Export Actions
export function addAcountInfo(data) {
  return {
    type: ADD_ACCOUNTINFO,
    data,
  };
}
export function fetchAccount(data) {
  return {
    type: FETCH_ACCOUNT,
    data,
  };
}
export function getAcountBalance(data) {
  return {
    type: GET_BALANCE,
    data,
  };
}
export function editPeer(data) {
  return {
    type: EDIT_PEER,
    data,
  };
}
function perrsStatus() {
  const official = config.official;
  const active = [];
  const activeServer = _.chain([])
    .concat(official, active)
    .sample()
    .value();
  if (activeServer.ssl) {
    URL = 'https://' + activeServer.host + ':' + activeServer.port;
  } else {
    URL = 'http://' + activeServer.host + ':' + activeServer.port;
  }
  IP = activeServer.host;
  official.map(ip => {
    IPS.push(ip.host);
  });
}

export function loginPassphrase(passphrase) {
  const keys = know.crypto.getKeys(passphrase);
  if (keys.publicKey) {
    publicKey = keys.publicKey;
    address = know.crypto.getAddress(keys.publicKey);
    privateKey = keys.d.toBuffer().toString('hex');
  }
  perrsStatus();
  return (dispatch) => {
    return callApi(URL + API_STATUS).then(res => {
      if (res && res.success) {
        return dispatch(addAcountInfo({
          publicKey,
          privateKey,
          address,
          hostActive: IP,
          ips: IPS,
          hostStatus: res.success,
        }));
      } else {
        return dispatch(addAcountInfo({
          publicKey,
          privateKey,
          address,
          hostActive: IP,
          ips: IPS,
          hostStatus: false,
        }));
      }
    });
  };
}

export function fetchDataAccount() {
  return (dispatch) => {
    return callApi(URL + API_ACCOUNT + '?address=' + address).then(res => {
      if (res && res.success) {
        return dispatch(fetchAccount(res.account));
      }
    });
  };
}
export function fetchForged() {
  return callApi(URL + API_FORGED + '?generatorPublicKey=' + publicKey);
}
export function fetchVotes() {
  return callApi(URL + API_VOTES + '?publicKey=' + publicKey);
}
export function fetchDelegates() {
  return callApi(URL + API_DELEGATES + '?address=' + address);
}
export function searchDelegates(data) {
  let query = '';
  if (data.search) {
    query += '?q=' + data.search.toString();
  }
  return callApi(URL + API_SEARCH_DELEGATES + query);
}
export function fetchDelegate() {
  return callApi(URL + API_DELEGATE + '?publicKey=' + publicKey);
}
export function fetcAllhDelegate() {
  return callApi(URL + API_ALL_DELEGATES);
}
export function fetchBalanceAccount() {
  return (dispatch) => {
    return callApi(URL + API_BALANCE + '?address=' + address).then(res => {
      if (res && res.success) {
        return dispatch(getAcountBalance({
          balance: res.balance,
        }));
      } else {
        return dispatch(getAcountBalance({
          balance: 0,
        }));
      }
    });
  };
}
export function fetchTransactionsAccount(type = 'all', current = 1) {
  if (type === 'all') {
    return callApi(URL + API_TRANSACTIONS + '?senderId=' + address + '&recipientId=' + address + '&limit=' + config.limitList + '&offset=' + (current - 1) * config.limitList + '&orderBy=timestamp:desc');
  } else if (type === 'send') {
    return callApi(URL + API_TRANSACTIONS + '?senderId=' + address + '&limit=' + config.limitList + '&offset=' + (current - 1) * config.limitList + '&orderBy=timestamp:desc');
  } else if (type === 'received') {
    return callApi(URL + API_TRANSACTIONS + '?recipientId=' + address + '&limit=' + config.limitList + '&offset=' + (current - 1) * config.limitList + '&orderBy=timestamp:desc');
  }
}

export function sendTransaction(data) {
  let transactions = [];
  let transaction;
  switch (data.type) {
    case 0:
      try {
        transaction = know.transaction.createTransaction(
          data.recipient,
          data.amount * 100000000,
          '',
          data.passphrase,
          data.secondPassphrase
        );
      } catch (e) {
        return new Promise(function (resolve) {
          resolve({
            success: false,
            error: e.message,
          });
        });
      }
      break;
    case 1:
      try {
        transaction = know.signature.createSignature(
          data.passphrase,
          data.secondPassphrase
        );
      } catch (e) {
        return new Promise(function (resolve) {
          resolve({
            success: false,
            error: e.message,
          });
        });
      }
      break;
    case 2:
      try {
        transaction = know.delegate.createDelegate(
        data.passphrase,
        data.username,
        data.secondPassphrase
      );
      } catch (e) {
        return new Promise(function (resolve) {
          resolve({
            success: false,
            error: e.message,
          });
        });
      }
      break;
    case 3:
      try {
        transaction = know.vote.createVote(
        data.passphrase,
        data.delegates,
        data.secondPassphrase
      );
      } catch (e) {
        return new Promise(function (resolve) {
          resolve({
            success: false,
            error: e.message,
          });
        });
      }
      break;
  }
  transactions.push(transaction);
  console.log("Transactions : ",transactions);
  return callApi(URL + API_SENT_TRANSACTION, 'post', { transactions });
}
export function changePeer(peer) {
  const official = config.official;
  official.map(ip => {
    if (peer === ip.host) {
      if (ip.ssl) {
        URL = 'https://' + ip.host + ':' + ip.port;
      } else {
        URL = 'http://' + ip.host + ':' + ip.port;
      }
    }
  });
  return (dispatch) => {
    return callApi(URL + API_STATUS).then(res => {
      if (res && res.success) {
        return dispatch(editPeer({
          hostActive: IP,
          hostStatus: res.success,
        }));
      } else {
        return dispatch(editPeer({
          hostActive: IP,
          hostStatus: false,
        }));
      }
    });
  };
}
