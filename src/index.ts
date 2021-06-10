import { ADA } from '@piebits/ada';
import type { WRAPPER_CONFIG } from './types';

class ADA_WRAPPER {
  public ada: ADA | undefined = undefined;

  public configure(config: WRAPPER_CONFIG) {
    this.ada = new ADA({
      app_id: config.app_id,
      version: config.version,
    });
  }
}

const ada = new ADA_WRAPPER();

export default ada;
