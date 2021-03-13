// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

const ACTION_TIMEOUT = 250

function getBrowserLanguageOptions(options, language) {
  const onBeforeLoad = options.onBeforeLoad || function () {}
  const headers = options.headers || {}
  return {
    ...options,
    onBeforeLoad(win) {
      Object.defineProperty(win.navigator, 'language', { value: language })
      Object.defineProperty(win.navigator, 'languages', { value: [language] })
      onBeforeLoad(win)
    },
    headers: {
      ...headers,
      'Accept-Language': language,
    },
  }
}

Cypress.Commands.overwrite('visit', (originalFn, url, options) => {
  if (options && options.language) {
    // add in language options if specified
    const { language } = options
    options = getBrowserLanguageOptions(options, language)
  }

  originalFn(url, options)
  cy.wait(ACTION_TIMEOUT)
})

Cypress.Commands.overwrite(
  'click',
  (originalFn, element, position, x, y, options) => {
    cy.wait(ACTION_TIMEOUT)
    originalFn(element, position, x, y, options)
  }
)

Cypress.Commands.overwrite('focus', (originalFn, element, options) => {
  cy.wait(ACTION_TIMEOUT)
  originalFn(element, options)
})
