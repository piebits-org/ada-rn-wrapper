import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeAutoObservable } from 'mobx';
import type { WRAPPER_STATE } from './types';

export class STORE {
  tokens: WRAPPER_STATE['tokens'] = {
    access_token: undefined,
    refresh_token: undefined,
  };

  user: WRAPPER_STATE['user'] | undefined = undefined;

  status: WRAPPER_STATE['status'] = 'loading';

  token_timestamp: number | undefined = undefined;

  constructor() {
    makeAutoObservable(this);
  }

  setTokens(tokens: WRAPPER_STATE['tokens']) {
    this.tokens = tokens;
    AsyncStorage.setItem('@ada/tokens', JSON.stringify(tokens));
  }

  setUser(user: WRAPPER_STATE['user']) {
    this.user = user;
    AsyncStorage.setItem('@ada/user', JSON.stringify(user));
  }

  setStatus(status: WRAPPER_STATE['status']) {
    this.status = status;
  }

  setTokenTimestamp(timestamp: number) {
    this.token_timestamp = timestamp;
    AsyncStorage.setItem(
      '@ada/token_timestamp',
      JSON.stringify({ value: timestamp })
    );
  }

  async reset() {
    this.tokens = {
      access_token: undefined,
      refresh_token: undefined,
    };
    this.status = 'notloggedin';
    this.user = undefined;
    this.token_timestamp = undefined;
    await AsyncStorage.clear();
  }
}

export const store = new STORE();
