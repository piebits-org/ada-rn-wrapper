import ada from '../../src/index';
import * as React from 'react';

import { StyleSheet, View, Button, Text } from 'react-native';

ada.configure({
  app_id: '60c114cfd64cf32579d03ddd',
  version: 'v0.1.0',
  expiration: '30m',
});

export default function App() {
  const [status, setstatus] = React.useState('loading');

  ada.reaction(
    () => ada.store.status,
    (status) => {
      setstatus(status);
    }
  );

  if (status === 'loggedin') {
    return (
      <View style={styles.container}>
        <Text>{JSON.stringify(ada.store.user)}</Text>
        <Button
          title="log out"
          onPress={() => {
            ada.userops.logout();
          }}
        />
      </View>
    );
  }

  if (status === 'notloggedin') {
    return (
      <View style={styles.container}>
        <Text>{JSON.stringify(ada.store.user)}</Text>
        <Button
          title="Sign Up"
          onPress={() => {
            ada.basic.signup({
              email: 'johndoe@example.com',
              password: 'johndoepassword',
            });
          }}
        />
        <Button
          title="Log In"
          onPress={() => {
            ada.basic.signin({
              key: 'johndoe@example.com',
              password: 'johndoepassword',
            });
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Button
        title={status}
        onPress={() => {
          ada.basic.signup({
            email: 'johndoe@example.com',
            password: 'johndoepassword',
          });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
