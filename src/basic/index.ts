import type { ADA } from '@piebits/ada';
import type {
  SIGNIN_METHOD,
  SIGNUP_METHOD,
} from '@piebits/ada/lib/basic/types';
import { store } from '../store';

export class BASIC {
  private ada: ADA;

  constructor(ada: ADA) {
    this.ada = ada;
  }

  public signup: SIGNUP_METHOD = async (params) => {
    try {
      const tokens = await this.ada.basic.signup(params);
      store.tokens = tokens;
      return Promise.resolve(tokens);
    } catch (e) {
      return Promise.reject(e);
    }
  };

  public signin: SIGNIN_METHOD = async (params) => {
    try {
      const tokens = await this.ada.basic.signin(params);
      store.tokens = tokens;
      return Promise.resolve(tokens);
    } catch (e) {
      return Promise.reject(e);
    }
  };
}
