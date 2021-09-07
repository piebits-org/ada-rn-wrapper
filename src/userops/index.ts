import { ADA, store as ada_store } from '@piebits/ada';
import type { FETCH_SELF_METHOD } from '@piebits/ada/lib/userops/types';
import { tokenExpired } from '../token_exp';
import { store } from '../store';

export class USEROPS {
  private ada: ADA | undefined;

  constructor(ada: ADA | undefined) {
    this.ada = ada;
  }

  public fetchSelf: FETCH_SELF_METHOD = async () => {
    try {
      if (this.ada) {
        const user = await this.ada.userops.fetch_self();
        let tokens = store.tokens;
        if (!tokens.access_token) {
          tokens = ada_store.state.tokens;
        }
        await store.setCredentials(
          {
            tokens,
            user,
          },
          false
        );
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

  public refreshToken = async () => {
    try {
      if (this.ada) {
        const tokens = await this.ada.userops.refresh_token();
        await store.setCredentials(
          {
            tokens,
            user: store.user,
          },
          false
        );
        await this.fetchSelf();
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

  public logout = async () => {
    try {
      if (this.ada) {
        await store.resetCredentials();
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

  public resetPass = async (email: string) => {
    try {
      if (this.ada) {
        await this.ada.userops.reset_password({ email });
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

  public verifyToken = async (token: string, password: string) => {
    try {
      if (this.ada) {
        await this.ada.userops.verify_token({
          token,
          password,
        });
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

  public getAccessToken = async () => {
    const token = store.tokens.access_token;
    if (!token) {
      throw Error('access token missing are you sure user is logged in !');
    }
    const expired = tokenExpired(token);
    if (expired) {
      const tokens = await this.refreshToken();
      return tokens.access_token;
    } else {
      return token;
    }
  };
}
