# ada-rn-wrapper

React Native Wrapper for ada js lib

## Installation

```sh
npm install @piebits/ada-rn-wrapper
```

> required step as the library uses react-native-async-storage to persist data
```sh
npm install @@react-native-async-storage/async-storage
```

## Usage

```js
import ada from "@piebits/ada-rn-wrapper";

// required step initializes the lib and fills the store with cached data
ada.configure({
  app_id: 'your piebits app_id',
  version: 'v0.4.0', // ADA version
  expiration: 'access_token expiration' // value set for your app in the piebits ada console
})

// mobx reaction object exposed to watch state changes. check out mobx reaction docs
ada.reaction(() => ada.store.status, (status) => {
  console.log(`Status Changes, current status ${status}`);
})

// signup the user with basic provider
ada.basic.signup({
  email: 'johndoe@example.com',
  password: 'johndoepassword'
})

// signin the user with basic provider
ada.basic.signin({
  key: 'johndoe@example.com', // key/identifier assigned in your piebits console (console defaulr: email)
  password: 'johndoepassword'
})

const user = await ada.userops.fetchSelf() // fetch the user manually, returns the new user object

const tokens = await ada.userops.refreshToken() // manually refresh token, returns the new access token

ada.userops.logout() // logouts the currently loggedin user

ada.userops.resetPass('email here') // triggers a password reset for the given email

ada.userops.verifyToken('token recieved from url', 'user entered password') // resets the user password

ada.store //the actually store object of the library, contains all data e.g. ada.store.user contains user info
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

Apache-2.0
