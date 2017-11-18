/* globals browser */

;(function () {
  const { tabs, commands, contextualIdentities } = browser

  commands.onCommand.addListener(async (command) => {
    try {
      const [ tab ] = await tabs.query({
        active: true,
        currentWindow: true
      })

      const { cookieStoreId } = tab

      switch (command) {
        case 'container-open-tab':
          await tabs.create({ cookieStoreId })
          break
        case 'container-sort-tabs':
          // sortTabs()
          break
        // ignore all other commands
      }
    } catch (err) {
      console.error(`Error handing command: ${command}`, err)
    }
  })
})()
