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

  function specifyPage(page) {
    specify(`Path is "${page.path}"`, () => {
      cy.url().should('contain', page.path)
    })

    specify(`Document title is "${page.title}"`, () => {
      cy.title().should('contain', page.title)
    })

    specify(
      `Current tab "${page.id}" should have attribute aria-current="page"`,
      () => {
        navigationPage
          .getTabLink(page.id)
          .should('have.attr', 'aria-current', 'page')
      }
    )

    specify(`Non-active tabs should not have attribute aria-current`, () => {
      forEach(CASES, otherPage => {
        if (otherPage.id === page.id) return // skip page.id because it is active
        navigationPage
          .getTabLink(otherPage.id)
          .should('not.have.attr', 'aria-current')
      })
    })
  }

  describe('Tabs by Route', () => {
    forEach(CASES, page => {
      context(`Path "${page.path}"`, () => {
        before(() => {
          navigationPage.visit(page.path)
        })

        specifyPage(page)
      })
    })
  })

  context('Switching tabs from "blog" to "about"', () => {
    before(() => {
      navigationPage.visit('/ja/blog')
      navigationPage.switchTab('about')
    })

    specifyPage(CASES.about)
  })
})
