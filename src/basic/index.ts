import type { ADA } from '@piebits/ada';
import type {
  SIGNIN_METHOD,
  SIGNUP_METHOD,
} from '@piebits/ada/lib/basic/types';
import { store } from '../store';

export class BASIC {
  private ada: ADA | undefined;

  constructor(ada: ADA | undefined) {
    this.ada = ada;
  }

  public signup: SIGNUP_METHOD = async (params) => {
    try {
      if (this.ada) {
        const tokens = await this.ada.basic.signup(params);
        store.setTokens(tokens);
        store.setTokenTimestamp(new Date().getTime());
        return Promise.resolve(tokens);
      } else {
        return Promise.reject(
          new Error('ADA not Configured, have you used the configure method?')
        );
      }
    } catch (e) {
      return Promise.reject(e);
    }
  };

  public signin: SIGNIN_METHOD = async (params) => {
    try {
      if (this.ada) {
        const tokens = await this.ada.basic.signin(params);
        store.setTokens(tokens);
        store.setTokenTimestamp(new Date().getTime());
        return Promise.resolve(tokens);
      } else {
        return Promise.reject(
          new Error('ADA not Configured, have you used the configure method?')
        );
      }
    } catch (e) {
      return Promise.reject(e);
    }
  };
}
