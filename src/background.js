;(async function () {
  const { tabs, commands, contextualIdentities } = browser
  const containers = await contextualIdentities.query({})

  commands.onCommand.addListener(async (command) => {
    try {
      const [ tab ] = await tabs.query({
        active: true,
        currentWindow: true
      })

      const { cookieStoreId } = tab

      switch (command) {
        case 'containerify-open-tab':
          tabs.create({ cookieStoreId })
          break;
      }
    } catch (err) {
      console.error(err)
    }
  })
})()
