import { makeAutoObservable } from 'mobx';
import type { WRAPPER_STATE } from './types';

class STORE {
  public tokens: WRAPPER_STATE['tokens'] = {
    access_token: undefined,
    refresh_token: undefined,
  };

  public user: WRAPPER_STATE['user'] | undefined = undefined;

  constructor() {
    makeAutoObservable(this);
  }
}

export const store = new STORE();
