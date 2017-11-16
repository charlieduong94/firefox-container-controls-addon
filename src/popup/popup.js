(async function () {
  try {
    const { tabs, commands, contextualIdentities } = browser
    const element = document.getElementById('app')

    const containers = await contextualIdentities.query({})

    for (const container of containers) {
      console.log(container)
    }
  } catch (err) {
    console.error(err)
  }
})()
