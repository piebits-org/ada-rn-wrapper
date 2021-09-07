import type { ADA } from '@piebits/ada';
import type {
  SIGNIN_PARAMS,
  SIGNUP_PARAMS,
} from '@piebits/ada/lib/basic/types';
import { USEROPS } from '../userops';

export class BASIC {
  private ada: ADA | undefined;

  private userops: USEROPS;

  constructor(ada: ADA | undefined) {
    this.ada = ada;
    this.userops = new USEROPS(ada);
  }

  public signup = async (params: SIGNUP_PARAMS) => {
    try {
      if (this.ada) {
        await this.ada.basic.signup(params);
        await this.userops.fetchSelf();
        return Promise.resolve();
      } else {
        return Promise.reject(
          new Error('ADA not Configured, have you used the configure method?')
        );
      }
    } catch (e) {
      return Promise.reject(e);
    }
  };

  public signin = async (params: SIGNIN_PARAMS) => {
    try {
      if (this.ada) {
        await this.ada.basic.signin(params);
        await this.userops.fetchSelf();
        return Promise.resolve();
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
