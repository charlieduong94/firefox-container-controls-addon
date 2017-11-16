;(async function () {
  const { tabs, commands, contextualIdentities } = browser
  const containers = await contextualIdentities.query({})

  let currentTabId

  // add listener for tab changes
  tabs.onActivated.addListener(({ tabId }) => {
    currentTabId = tabId
  })

  const cmds = await commands.getAll()

  commands.onCommand.addListener(async (command) => {
    console.log(command)
    try {
      let cookieStoreId

      if (!currentTabId) {
        cookieStoreId = 'firefox-default'
      } else {
        const currentTab = await tabs.get(currentTabId)
        cookieStoreId = currentTab.cookieStoreId
      }

      switch (command) {
        case '_execute_browser_action':
          console.log('browser action clicked')
          break;
        case 'containerify-open-tab':
          tabs.create({
            cookieStoreId
          })
          break;
      }
    } catch (err) {
      console.error(err)
    }
  })
})()
