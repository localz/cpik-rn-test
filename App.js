import React, { useEffect, useState } from 'react'

import { StyleSheet, Text, View, BackHandler } from 'react-native';
import {
  CopilotView,
  isActive,
  init,
  setupEventListeners,
  configureLogin,
  destroy,
} from './Copilot'

const companyId = 'AMS COMPANY ID'
const username = 'AMS USERNAME'

export default function App() {
  const [isInitialised, setInitialised] = useState(false)

  const initialiseCopilot = async () => {
    const isInitialised = await isActive()
    if (!isInitialised) {
      init()
      return
    }
    setInitialised(true)
  }

  useEffect(() => {
    let listeners
    ;(async () => {
      listeners = setupEventListeners({ setInitialised })
      // Setting AMS credentials needs to happen prior to Copilot
      // initialisation to bypass the license entry screen.
      await configureLogin(username, companyId)
      await initialiseCopilot()
    })()
    return () => {
      Object.values(listeners).forEach(
        listener => listener && listener.remove(),
      )
      destroy()
    }
  }, [])

  const goBack = () => {
    console.log('This is swallowed by CopilotView.')
    return true
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', goBack)
    return () => BackHandler.removeEventListener('hardwareBackPress', goBack)
  }, [goBack])

  return (
    <>
      {!isInitialised ? (
        <View style={styles.container}>
          <Text>Waiting for Copilot to initialise...</Text>
        </View>
      ) : (
        <CopilotView style={{ flex: 1 }} />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
