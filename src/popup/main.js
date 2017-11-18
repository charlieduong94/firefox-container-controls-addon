/* globals browser */

import { Main } from './elm/Main'
import './styles.css'

;(async function () {
  try {
    const { tabs, commands, contextualIdentities } = browser
    const appContainer = document.getElementById('app')

    const containers = await contextualIdentities.query({})

    const [ currentTab ] = await tabs.query({
      active: true,
      currentWindow: true
    })

    const currentCookieStoreId = currentTab.cookieStoreId

    let currentIndex = 0

    for (let i = 0; i < containers.length; i++) {
      if (containers[i].cookieStoreId === currentCookieStoreId) {
        currentIndex = i
        break
      }
    }

    const app = Main.embed(appContainer, {
      containers,
      currentIndex
    })

    const { ports } = app

    const {
      browserAction: actionPort,
      keyPress: keyPressPort
    } = ports

    actionPort.subscribe(async ({ action, tabIndex }) => {
      try {
        switch (action) {
          case 'open-tab':
            const { cookieStoreId } = containers[tabIndex]
            await tabs.create({ cookieStoreId })
            window.close()
        }
      } catch (err) {
        console.error(err)
      }
    })

    commands.onCommand.addListener((command) => {
      switch (command) {
        case 'container-down-key':
          keyPressPort.send('down')
          break
        case 'container-up-key':
          keyPressPort.send('up')
          break
        case 'container-enter-key':
          keyPressPort.send('enter')
          break
      }
    })
  } catch (err) {
    console.error(err)
    // TODO: render error
  }
})()
