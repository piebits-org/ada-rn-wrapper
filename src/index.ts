import { ADA } from '@piebits/ada';
import { reaction } from 'mobx';
import { BASIC } from './basic';
import { STORE, store } from './store';
import { tokenExpired } from './token_exp';
import type { WRAPPER_CONFIG } from './types';
import { USEROPS } from './userops';

class ADA_WRAPPER {
  private ada: ADA | undefined = undefined;

  public basic: BASIC = new BASIC(undefined);

  public userops: USEROPS = new USEROPS(undefined);

  public store: STORE = store;

  public reaction = reaction;

  private setInterceptor() {
    if (this.ada && this.ada.axios_instance) {
      this.ada.axios_instance.interceptors.request.use(
        async (config) => {
          const auth_header: string = config.headers.Authorization;
          if (auth_header) {
            const token = auth_header.split('Bearer ')[1];
            const expired = tokenExpired(token);
            if (expired) {
              const tokens = await this.userops.refreshToken();
              config.headers.Authorization = `Bearer ${tokens.access_token}`;
              return config;
            } else {
              return config;
            }
          } else {
            return config;
          }
        },
        function (error) {
          return error;
        }
      );
    }
  }

  private async load() {
    try {
      this.setInterceptor();
      const resp = await store.loadCredentials();
      if (resp) {
        if (resp.expired) {
          this.store.setCredentials(resp.credentials, true, false);
          await this.userops.refreshToken();
        } else {
          this.store.setCredentials(resp.credentials, false, true);
        }
      }
      return Promise.resolve();
    } catch (e) {
      return Promise.resolve();
    }
  }

  public async configure(config: WRAPPER_CONFIG) {
    this.ada = new ADA({
      app_id: config.app_id,
      version: config.version,
      public_key: config.public_key,
    });
    this.basic = new BASIC(this.ada);
    this.userops = new USEROPS(this.ada);
    await this.load();
  }
}

export const ada = new ADA_WRAPPER();
