import { ADA } from '@piebits/ada';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { reaction } from 'mobx';
import ms from 'ms';
import { BASIC } from './basic';
import { STORE, store } from './store';
import type { WRAPPER_CONFIG } from './types';
import { USEROPS } from './usserops';

class ADA_WRAPPER {
  public ada: ADA | undefined = undefined;

  public basic: BASIC = new BASIC(undefined);

  public userops: USEROPS = new USEROPS(undefined);

  public store: STORE = store;

  public expiration: number = ms('30m');

  reaction = reaction;

  deriveSecondsToRefresh(timestamp: number) {
    const dts = timestamp + this.expiration;
    const diff = dts - new Date().getTime();
    return diff;
  }

  initiateTimeout(time: number) {
    setTimeout(() => {
      this.userops.refresh_token();
    }, time);
  }

  async load() {
    try {
      const keys = await AsyncStorage.multiGet([
        '@ada/tokens',
        '@ada/user',
        '@ada/token_timestamp',
      ]);
      if (keys[0][1] && keys[1][1] && keys[2][1]) {
        store.setTokens(JSON.parse(keys[0][1]));
        store.setUser(JSON.parse(keys[1][1]));
        const timestamp = JSON.parse(keys[2][1]).value;
        store.setTokenTimestamp(JSON.parse(timestamp));
        const seconds = this.deriveSecondsToRefresh(timestamp);
        if (seconds <= 0) {
          await this.userops.refresh_token();
        } else {
          this.initiateTimeout(seconds);
          store.setStatus('loggedin');
        }
      } else {
        store.setStatus('notloggedin');
      }
      return Promise.resolve();
    } catch (e) {
      store.setStatus('notloggedin');
      return Promise.resolve();
    }
  }

  public async configure(config: WRAPPER_CONFIG) {
    this.ada = new ADA({
      app_id: config.app_id,
      version: config.version,
    });
    this.basic = new BASIC(this.ada);
    this.userops = new USEROPS(this.ada);
    this.expiration = ms(config.expiration);
    this.load().then(() => {
      reaction(
        () => store.tokens,
        async () => {
          await this.userops.fetch_self();
          store.setStatus('loggedin');
        }
      );
    });
  }
}

const ada = new ADA_WRAPPER();

export default ada;

export { store };
