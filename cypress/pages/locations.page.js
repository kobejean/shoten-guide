/// <reference types="cypress" />

class MapNavigation {
  getMapNavigation() {
    return cy.get(`#sapper main aside [data-test="map-navigation"]`)
  }

  getMapNavigationBackLink() {
    return this.getMapNavigation().get(`header a[data-test="back-button"]`)
  }

  getMapNavigationHeading() {
    return this.getMapNavigation().get(`header h2`)
  }

  getSubregionLink(id) {
    return this.getMapNavigation().get(`footer [data-test="${id}"] a`)
  }

  goBack(path) {
    this.getMapNavigationBackLink()
      .should('have.attr', 'href', path)
      .should('be.visible')
      .click()
  }

  goToSubregion(id) {
    this.getSubregionLink(id).should('be.visible').click()
  }
}

export class LocationsPage {
  constructor() {
    this.mapNavigation = new MapNavigation()
  }

  getHeading() {
    return cy.get(`#sapper main h1`)
  }

  visit(url = 'ja/locations') {
    cy.visit(url)
  }
}
