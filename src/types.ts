export interface WRAPPER_CONFIG {
  app_id: string;
  version: string;
  expiration: string;
}

export interface WRAPPER_STATE {
  tokens: {
    access_token: undefined | string;
    refresh_token: undefined | string;
  };
  user: {
    [key: string]: any;
  };
}
