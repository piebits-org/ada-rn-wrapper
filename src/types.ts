export interface WRAPPER_CONFIG {
  app_id: string;
  version: string;
  expiration: string;
  public_key: string;
}

export interface WRAPPER_STATE {
  tokens: {
    access_token: undefined | string;
    refresh_token: undefined | string;
  };
  user: {
    [key: string]: any;
  };
  status: 'loading' | 'loggedin' | 'notloggedin';
}

export type ADACREDENTIALS = Omit<WRAPPER_STATE, 'status'>;
