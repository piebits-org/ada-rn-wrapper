import type { ADA } from '@piebits/ada';
import type { FETCH_SELF_METHOD } from '@piebits/ada/lib/userops/types';
import { store } from 'src/store';

export class USEROPS {
  private ada: ADA;

  constructor(ada: ADA) {
    this.ada = ada;
  }

  public fetch_self: FETCH_SELF_METHOD = async () => {
    try {
      const user = await this.ada.userops.fetch_self();
      store.user = user;
      return Promise.resolve(user);
    } catch (e) {
      return Promise.reject(e);
    }
  };

  public refresh_token = async () => {
    try {
      const tokens = await this.ada.userops.refresh_token();
      store.tokens = { ...store.tokens, refresh_token: tokens.refresh_token };
      return Promise.resolve(store.tokens);
    } catch (e) {
      return Promise.reject(e);
    }
  };
}
