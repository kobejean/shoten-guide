/// <reference types="cypress" />

import { NavigationPage } from '../../pages/navigation.page'

const TRANSLATIONS = {
  ja: {
    name: '日本語',
    about: '情報',
  },
  en: {
    name: 'English',
    about: 'About',
  },
  ko: {
    name: '한국어',
    about: '정보',
  },
}
const CASES = [
  {
    language: 'ja',
    matchedLanguage: 'ja',
  },
  {
    language: 'en',
    matchedLanguage: 'en',
  },
  {
    language: 'ko',
    matchedLanguage: 'ko',
  },
  {
    language: 'en-US',
    matchedLanguage: 'en',
  },
  {
    language: 'de',
    matchedLanguage: 'ja',
  },
]

describe('Localization', () => {
  const navigationPage = new NavigationPage()

  describe('Browser Languages', () => {
    CASES.forEach(({ language, matchedLanguage }) => {
      const translation = TRANSLATIONS[matchedLanguage]

      context(`Homepage with Language: "${language}"`, () => {
        before(() => {
          navigationPage.visit('/', language)
        })

        specify(
          `Home page redirects to "/${matchedLanguage}/locations"`,
          () => {
            cy.url().should('include', `/${matchedLanguage}/locations`)
          }
        )

        specify(`Html lang attribute is "${matchedLanguage}"`, () => {
          cy.get('html').should('have.attr', 'lang', matchedLanguage)
        })

        specify(`Language option "${translation.name}" is selected`, () => {
          navigationPage
            .getLanguageMenuButton()
            .should('contain', translation.name)
        })

        specify(`About tab is named "${translation.about}"`, () => {
          navigationPage
            .getTabLink('about')
            .should('contain', translation.about)
        })
      })
    })
  })

  context('About Page Switched from Japanese to English', () => {
    before(() => {
      navigationPage.visit('/ja/about')
      navigationPage.switchLanguage('en')
    })

    specify(`Path is "/en/about"`, () => {
      cy.url().should('include', `/en/about`)
    })

    specify(`Html lang attribute is "en"`, () => {
      cy.get('html').should('have.attr', 'lang', 'en')
    })

    specify(`Language option "${TRANSLATIONS.en.name}" is selected`, () => {
      navigationPage
        .getLanguageMenuButton()
        .should('contain', TRANSLATIONS.en.name)
    })

    specify(`About tab is named "${TRANSLATIONS.en.about}"`, () => {
      navigationPage
        .getTabLink('about')
        .should('contain', TRANSLATIONS.en.about)
    })
  })
})
