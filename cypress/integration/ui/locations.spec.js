/// <reference types="cypress" />

import { LocationsPage } from '../../pages/locations.page'

const CASES = {
  tohoku: {
    path: '/ja/locations/tohoku',
    title: '東北',
  },
  aizuwakamatsu: {
    path: '/ja/locations/tohoku/fukushima/aizuwakamatsu',
    title: '会津若松市',
  },
}

describe('Locations', () => {
  const locationsPage = new LocationsPage()

  function shouldDisplayPage(page) {
    cy.url().should('contain', page.path)
    cy.title().should('contain', page.title)
    locationsPage.getHeading().should('contain', page.title)
    locationsPage.mapNavigation
      .getMapNavigationHeading()
      .should('contain', page.title)
  }

  describe('Map Navigation', () => {
    specify(
      `When user navigates back from "fukushima" to "tohoku"
      Then "tohoku" page is displayed`,
      () => {
        // When
        locationsPage.visit('/ja/locations/tohoku/fukushima')
        locationsPage.mapNavigation.goBack('/ja/locations/tohoku')
        // Then
        shouldDisplayPage(CASES.tohoku)
      }
    )

    specify(
      `When user navigates to "aizuwakamatsu" from "locations"
      Then "aizuwakamatsu" page is displayed`,
      () => {
        // When
        locationsPage.visit()
        locationsPage.mapNavigation.goToSubregion('/locations/tohoku')
        locationsPage.mapNavigation.goToSubregion('/locations/tohoku/fukushima')
        locationsPage.mapNavigation.goToSubregion(
          '/locations/tohoku/fukushima/aizuwakamatsu'
        )
        // Then
        shouldDisplayPage(CASES.aizuwakamatsu)
      }
    )
  })
})
