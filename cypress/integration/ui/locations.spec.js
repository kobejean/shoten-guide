/// <reference types="cypress" />

import { LocationsPage } from '../../pages/locations.page'

describe('Locations', () => {
  const locationsPage = new LocationsPage()

  function specifyPage(page) {
    specify(`Path is "${page.path}"`, () => {
      cy.url().should('contain', page.path)
    })

    specify(`Document title is "${page.title}"`, () => {
      cy.title().should('contain', page.title)
    })

    specify(`Page Heading is "${page.title}"`, () => {
      locationsPage.getHeading().should('contain', page.title)
    })

    specify(`Map Navigation Heading is "${page.title}"`, () => {
      locationsPage.mapNavigation
        .getMapNavigationHeading()
        .should('contain', page.title)
    })
  }

  describe('Map Navigation', () => {
    context(`Navigate to "aizuwakamatsu" from "locations"`, () => {
      before(() => {
        locationsPage.visit()
        locationsPage.mapNavigation.goToSubregion('/locations/tohoku')
        locationsPage.mapNavigation.goToSubregion('/locations/tohoku/fukushima')
        locationsPage.mapNavigation.goToSubregion(
          '/locations/tohoku/fukushima/aizuwakamatsu'
        )
      })

      specifyPage({
        path: '/ja/locations/tohoku/fukushima/aizuwakamatsu',
        title: '会津若松市',
      })
    })

    context(`Navigate back to "tohoku" from "fukushima"`, () => {
      before(() => {
        locationsPage.visit('/ja/locations/tohoku/fukushima')
        locationsPage.mapNavigation.goBack('/ja/locations/tohoku')
      })

      specifyPage({
        path: '/ja/locations/tohoku',
        title: '東北',
      })
    })
  })
})
