/**
 * Updates the selected buttons
 */
(async function () {
  function updateButtons (buttons, currentPosition) {
    for (const button of buttons) {
      if (button.getAttribute('data-pos') === `${currentPosition}`) {
        button.classList.add('selected')
      } else {
        button.classList.remove('selected')
      }
    }
  }


  try {
    const { tabs, commands, contextualIdentities } = browser
    const appContainer = document.getElementById('app')
    const containers = await contextualIdentities.query({})

    const buttonEls = []
    let currentPosition = 0

    for (let i = 0; i < containers.length; i++) {
      const {
        name,
        iconUrl,
        colorCode,
        cookieStoreId
      } = containers[i]

      const button = document.createElement('div')
      const icon = document.createElement('div')
      const label = document.createElement('label')

      button.setAttribute('data-pos', i)
      button.classList.add('button')

      icon.style.mask =  `url(${iconUrl}) top left / contain`,
      icon.style.background = colorCode
      icon.classList.add('icon')

      label.innerText = name
      label.classList.add('label')

      button.appendChild(icon)
      button.appendChild(label)
      buttonEls.push(button)

      appContainer.appendChild(button)

      button.addEventListener('click', () => {
        const { cookieStoreId } = containers[i]
        tabs.create({ cookieStoreId })
        window.close()
      })

      button.addEventListener('mouseover', () => {
        currentPosition = i
        updateButtons(buttonEls, currentPosition)
      })

      if (i < containers.length - 1) {
        const separator = document.createElement('hr')
        separator.classList.add('separator')
        appContainer.appendChild(separator)
      }
    }

    commands.onCommand.addListener(async (command) => {
      switch (command) {
        case 'containerify-down-key':
          if (currentPosition < containers.length -1) {
            currentPosition++
            updateButtons(buttonEls, currentPosition)
          }
          break;
        case 'containerify-up-key':
          if (currentPosition > 0) {
            currentPosition--
            updateButtons(buttonEls, currentPosition)
          }
          break;
        case 'containerify-enter-key':
          const { cookieStoreId } = containers[currentPosition]

          tabs.create({ cookieStoreId })

          window.close()
          break;
      }
    })

    updateButtons(buttonEls, currentPosition)
  } catch (err) {
    console.error(err)
    // TODO: render error
  }
})()
