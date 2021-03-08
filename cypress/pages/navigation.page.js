/// <reference types="cypress" />

export class NavigationPage {
  getTabLink(tab) {
    return cy.get(
      `#sapper header [data-test="navigation-items"] [data-test="${tab}"] a`
    )
  }

  getLanguageMenu() {
    return cy.get('#sapper header [data-test="language-menu"]')
  }

  getLanguageMenuButton() {
    return this.getLanguageMenu().get('button')
  }

  getLanguageMenuOption(language) {
    return this.getLanguageMenu().get(`[role="menu"] a[lang="${language}"]`)
  }

  visit(url = '/', language) {
    cy.visit(url, { language })
  }

  switchLanguage(language) {
    cy.wait(1000) // needs delay for some reason otherwise gets unfocused
    this.getLanguageMenuButton().focus()
    this.getLanguageMenuOption(language).click()
  }

  switchTab(tab) {
    this.getTabLink(tab).click()
  }
}
