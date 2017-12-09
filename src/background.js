/* globals browser */

;(function () {
  const { tabs, commands, contextualIdentities } = browser

  async function sortTabs () {
    const endPos = -1

    const browserTabs = await tabs.query({
      currentWindow: true
    })

    const containers = await contextualIdentities.query({})

    const cookieStoreTabsMap = {
      'firefox-default': []
    }

    for (const container of containers) {
      const { cookieStoreId } = container
      cookieStoreTabsMap[cookieStoreId] = []
    }

    for (const tab of browserTabs) {
      const { id, cookieStoreId = 'firefox-default' } = tab
      cookieStoreTabsMap[cookieStoreId].push(id)
    }

    let tabListPosition = 0;

    for (const key in cookieStoreTabsMap) {
      const cookieStoreTabs = cookieStoreTabsMap[key];
      await tabs.move(cookieStoreTabs, { index: tabListPosition })
      tabListPosition += cookieStoreTabs.length
    }
  }

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
          sortTabs()
          break
        // ignore all other commands
      }
    } catch (err) {
      console.error(`Error handing command: ${command}`, err)
    }
  })
})()
