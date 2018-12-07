import { ADD_ACCOUNTINFO, EDIT_PEER, GET_BALANCE, FETCH_ACCOUNT } from './AccountActions';

// Initial State
const initialState = {
  publicKey: '',
  privateKey: '',
  address: '',
  hostActive: '',
  ips: [],
  hostStatus: false,
  balance: 0,
  isDelegate: false,
  secondSignature: 0
};

const AccountReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ACCOUNTINFO :
      state.publicKey = action.data.publicKey;
      state.privateKey = action.data.privateKey;
      state.address = action.data.address;
      state.hostActive = action.data.hostActive;
      state.ips = action.data.ips;
      state.hostStatus = action.data.hostStatus;
      return { ...state };
    case FETCH_ACCOUNT :
      state.secondSignature = action.data.secondSignature;
      return { ...state };
    case EDIT_PEER :
      state.hostActive = action.data.hostActive;
      state.hostStatus = action.data.hostStatus;
      return { ...state };
      case GET_BALANCE :
      state.balance = action.data.balance;
      return { ...state };
    default:
      return state;
  }
};

/* Selectors */

// Get all posts
export const getPublicKey = state => state.account.publicKey;
export const getPrivateKey = state => state.account.privateKey;
export const getAddress = state => state.account.address;
export const getIps = state => state.account.ips;
export const getHostActive = state => state.account.hostActive;
export const getHostStatus = state => state.account.hostStatus;
export const getBalance = state => state.account.balance;
export const getDelegate = state => state.account.isDelegate;
export const getSecondSignature = state => state.account.secondSignature;

// Export Reducer
export default AccountReducer;
