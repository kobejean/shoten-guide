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
    this.getLanguageMenuButton().should('be.visible').focus()
    this.getLanguageMenuOption(language).should('be.visible').click()
  }

  switchTab(tab) {
    this.getTabLink(tab).should('be.visible').click()
  }
}
