/// <reference types="cypress" />

import { forEach } from 'lodash'
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

const BROWSER_LANGUAGE_CASES = {
  ja: {
    language: 'ja',
    matchedLanguage: 'ja',
  },
  en: {
    language: 'en',
    matchedLanguage: 'en',
  },
  ko: {
    language: 'ko',
    matchedLanguage: 'ko',
  },
  'en-US': {
    language: 'en-US',
    matchedLanguage: 'en',
  },
  de: {
    language: 'de',
    matchedLanguage: 'ja',
  },
}

describe('Localization', () => {
  const navigationPage = new NavigationPage()

  function shouldDisplayPage(page) {
    cy.url().should('contain', page.path)
    cy.get('html').should('have.attr', 'lang', page.matchedLanguage)
    navigationPage
      .getLanguageMenuButton()
      .should('contain', page.translation.name)
    navigationPage.getTabLink('about').should('contain', page.translation.about)
  }

  describe('Browser Languages', () => {
    forEach(BROWSER_LANGUAGE_CASES, ({ language, matchedLanguage }) => {
      const page = {
        language,
        matchedLanguage,
        path: `/${matchedLanguage}/locations`,
        translation: TRANSLATIONS[matchedLanguage],
      }

      specify(
        `When home page is hit with browser language "${page.language}"
        Then locations page is displayed in "${matchedLanguage}"`,
        () => {
          navigationPage.visit('/', page.language)
          // Then
          shouldDisplayPage(page)
        }
      )
    })
  })

  describe('Switching Languages', () => {
    specify(
      `When language switched from "ja" to "en" on the about page
      Then about page is displayed in "en"`,
      () => {
        // When
        navigationPage.visit('/ja/about')
        navigationPage.switchLanguage('en')
        // Then
        const page = {
          language: BROWSER_LANGUAGE_CASES.en.language,
          matchedLanguage: BROWSER_LANGUAGE_CASES.en.matchedLanguage,
          path: '/en/about',
          translation: TRANSLATIONS.en,
        }
        shouldDisplayPage(page)
      }
    )
  })
})
