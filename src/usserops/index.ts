import { ADA, store as ada_lib_store } from '@piebits/ada';
import type { FETCH_SELF_METHOD } from '@piebits/ada/lib/userops/types';
import { store } from '../store';

export class USEROPS {
  private ada: ADA | undefined;

  constructor(ada: ADA | undefined) {
    this.ada = ada;
  }

  public fetch_self: FETCH_SELF_METHOD = async () => {
    try {
      if (this.ada) {
        ada_lib_store.set('tokens', store.tokens);
        const user = await this.ada.userops.fetch_self();
        store.setUser(user);
        return Promise.resolve(user);
      } else {
        return Promise.reject(
          new Error('ADA not Configured, have you used the configure method?')
        );
      }
    } catch (e) {
      return Promise.reject(e);
    }
  };

  public refresh_token = async () => {
    try {
      if (this.ada) {
        ada_lib_store.set('tokens', store.tokens);
        const tokens = await this.ada.userops.refresh_token();
        store.setTokens({
          access_token: tokens.access_token,
          refresh_token: store.tokens.refresh_token,
        });
        store.setTokenTimestamp(new Date().getTime());
        return Promise.resolve(store.tokens);
      } else {
        return Promise.reject(
          new Error('ADA not Configured, have you used the configure method?')
        );
      }
    } catch (e) {
      return Promise.reject(e);
    }
  };

  public logout = async () => {
    try {
      if (this.ada) {
        await store.reset();
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
