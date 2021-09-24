import * as KeyChain from 'react-native-keychain';
import { makeAutoObservable } from 'mobx';
import { store as ada_store } from '@piebits/ada';
import type { ADACREDENTIALS, WRAPPER_STATE } from './types';
import decode, { JwtPayload } from 'jwt-decode';
import EventEmitter from 'events';

export class STORE {
  tokens: WRAPPER_STATE['tokens'] = {
    access_token: undefined,
    refresh_token: undefined,
  };

  user: WRAPPER_STATE['user'] = {};

  status: WRAPPER_STATE['status'] = 'loading';

  events: EventEmitter = new EventEmitter();

  constructor() {
    makeAutoObservable(this);
  }

  async setCredentials(
    credentials: ADACREDENTIALS,
    shallow: boolean,
    shouldSetStatus: boolean = true
  ) {
    this.tokens = credentials.tokens;
    this.user = credentials.user;
    ada_store.set('tokens', credentials.tokens);
    if (!shallow) {
      try {
        await KeyChain.setGenericPassword(
          credentials.user._id,
          JSON.stringify(credentials),
          {
            service: 'org.piebits.cloud.ada',
          }
        );
        if (shouldSetStatus) {
          this.setStatus('loggedin');
        }
      } catch (e) {
        console.error('Failed to Store Credentials! Logged user out');
        if (shouldSetStatus) {
          this.setStatus('notloggedin');
        }
      }
    } else {
      if (shouldSetStatus) {
        this.setStatus('loggedin');
      }
    }
  }

  async loadCredentials() {
    try {
      const keychain_credentials = await KeyChain.getGenericPassword({
        service: 'org.piebits.cloud.ada',
      });
      if (keychain_credentials) {
        const credentials: ADACREDENTIALS = JSON.parse(
          keychain_credentials.password
        );
        const decoded_token = decode<JwtPayload>(
          credentials.tokens.access_token as string
        );
        let exp = decoded_token.exp;
        if (exp) {
          exp = exp * 1000;
        } else {
          exp = 0;
        }
        return {
          expired: exp <= Date.now() + 300000,
          credentials,
        };
      } else {
        this.setStatus('notloggedin');
        return null;
      }
    } catch (e) {
      console.error('Failed to Get Credentials! Logged user out');
      this.setStatus('notloggedin');
      return null;
    }
  }

  async resetCredentials() {
    const did_reset = await KeyChain.resetGenericPassword({
      service: 'org.piebits.cloud.ada',
    });
    this.tokens = {
      access_token: undefined,
      refresh_token: undefined,
    };
    this.user = {};
    this.setStatus('notloggedin');
    ada_store.set('user', this.user);
    ada_store.set('tokens', this.tokens);
    return did_reset;
  }

  setStatus(status: WRAPPER_STATE['status']): void {
    this.status = status;
    this.events.emit('AuthState', status);
    return;
  }
}

export const store = new STORE();
