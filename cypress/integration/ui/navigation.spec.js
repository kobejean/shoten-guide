/// <reference types="cypress" />

import { forEach } from 'lodash'
import { NavigationPage } from '../../pages/navigation.page'

const CASES = {
  locations: {
    id: 'locations',
    path: '/ja/locations',
    title: '商店ガイド｜全国',
  },
  about: {
    id: 'about',
    path: '/ja/about',
    title: '情報',
  },
  blog: {
    id: 'blog',
    path: '/ja/blog',
    title: 'ブログ',
  },
}

describe('Navigation', () => {
  const navigationPage = new NavigationPage()

  function shouldDisplayPage(page) {
    cy.url().should('contain', page.path)
    cy.title().should('contain', page.title)
    navigationPage
      .getTabLink(page.id)
      .should('have.attr', 'aria-current', 'page')
    forEach(CASES, otherPage => {
      if (otherPage.id === page.id) return // skip page.id because it is active
      navigationPage
        .getTabLink(otherPage.id)
        .should('not.have.attr', 'aria-current')
    })
  }

  describe('Tabs by Route', () => {
    forEach(CASES, page => {
      specify(
        `When route "${page.path}" is hit
        Then "${page.id}" page is displayed`,
        () => {
          // When
          navigationPage.visit(page.path)
          // Then
          shouldDisplayPage(page)
        }
      )
    })
  })

  describe('Switching Tabs', () => {
    beforeEach(() => {
      navigationPage.visit('/ja/blog')
      navigationPage.switchTab('about')
    })

    specify(
      `When page is switched from "blog" to "about"
      Then "about" page is displayed`,
      () => {
        // When
        navigationPage.visit('/ja/blog')
        navigationPage.switchTab('about')
        // Then
        shouldDisplayPage(CASES.about)
      }
    )
  })
})
