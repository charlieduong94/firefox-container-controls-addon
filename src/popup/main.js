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

    ports.browserAction.subscribe(async ({ action, tabIndex }) => {
      console.log(action, tabIndex)
      try {
        switch (action) {
          case 'OpenTab':
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
        case 'containerify-down-key':
          ports.keyPress.send('down')
          break
        case 'containerify-up-key':
          ports.keyPress.send('up')
          break
        case 'containerify-enter-key':
          ports.keyPress.send('enter')
          break
      }
    })
  } catch (err) {
    console.error(err)
    // TODO: render error
  }
})()
